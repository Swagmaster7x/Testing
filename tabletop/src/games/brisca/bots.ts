/**
 * Brisca CPU players (PLAN.md 2.4): counting heuristics for levels 1 to 3, determinized search
 * for levels 4 to 6 (deal the unseen cards at random many times, play each candidate out, keep the
 * one that does best on average), and exact play once the stock is empty: with two players the
 * unseen cards are then exactly the other hand, so the end is a small perfect-information search.
 *
 * Four players in pairs: the same, scored by side. The heuristics know the partner: when the
 * partner is winning the trick they throw points on it (cargar), and they do not trump it. With
 * señas, a CPU signs its high trumps to its partner at its first turn (levels 2 and up), and the
 * partner's signs fix those cards in every sampled deal.
 *
 * Bots see only their view. Strength comes from the number of sampled deals, never from time.
 */
import type { BotChoice, BotInput, BotLevel, BotSet } from '../../ai/bot';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Rng } from '../../core/rng';
import { createRng } from '../../core/rng';
import type { BriscaAction, BriscaState, BriscaView, Card } from './rules';
import { actionText, arrastreChoices, brisca, cardPoints, partnerOf, sampleState, sideOf, sidePiles, signsAllowed, strength, suitOf, swapAllowed, trickWinner, unseenCards, viewOf } from './rules';

export const BRISCA_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 600 },
  { level: 2, rating: 900 },
  { level: 3, rating: 1200 },
  { level: 4, rating: 1450 },
  { level: 5, rating: 1650 },
  { level: 6, rating: 1850 },
];

interface LevelParams {
  /** Sampled deals for determinized search; 0 plays by heuristics alone. */
  readonly samples: number;
  /** The heuristic used inside rollouts, and on its own at low levels. */
  readonly policy: 1 | 2 | 3;
  /** Solve the end exactly once the stock holds this many cards or fewer (in each sampled deal). */
  readonly exactAt: number;
}

export const LEVEL_PARAMS: Readonly<Record<number, LevelParams>> = {
  1: { samples: 0, policy: 1, exactAt: -1 },
  2: { samples: 0, policy: 2, exactAt: -1 },
  3: { samples: 0, policy: 2, exactAt: 0 },
  4: { samples: 40, policy: 3, exactAt: 2 },
  5: { samples: 80, policy: 3, exactAt: 2 },
  6: { samples: 160, policy: 3, exactAt: 3 },
};


/** The legal actions as the view sees them (the same as the rules give for the true state). */
export function viewLegal(v: BriscaView): BriscaAction[] {
  if (v.over || (v.leader + v.trick.length) % v.handCounts.length !== v.seat) return [];
  const following = v.trick.length > 0;
  const forced = following && v.arrastre ? new Set(arrastreChoices(v.hand, v.trumpSuit, v.config)) : null;
  const out: BriscaAction[] = [];
  for (const card of v.hand) {
    if (forced && !forced.has(card)) continue;
    out.push({ type: 'play', card });
    if (!following && v.config.arrastre === 'on' && card === `A${v.trumpSuit}`) out.push({ type: 'play', card, call: true });
  }
  if (swapAllowed(v, v.seat, v.hand)) out.push({ type: 'swap' });
  for (const sign of signsAllowed(v, v.seat, v.hand)) out.push({ type: 'sign', sign });
  return out;
}

/** The signs a CPU makes: the As, the second brisca and the Rey of trumps, at once. */
const SIGNED: readonly string[] = ['A', 'second', 'R'];

function lowest(cards: readonly Card[], v: BriscaView, score: (c: Card) => number): Card {
  return [...cards].sort((a, b) => score(a) - score(b) || strength(a, v.config) - strength(b, v.config))[0] as Card;
}

/** How much a card is worth keeping: its points, and a premium for trumps. */
function keepValue(card: Card, v: BriscaView): number {
  const trump = suitOf(card) === v.trumpSuit ? 6 + strength(card, v.config) : 0;
  return cardPoints(card, v.config) + trump;
}

/**
 * Following with four players. If the partner is winning and nobody after can beat it (or the card
 * is hard to beat), throw points on it (cargar); else take a trick worth taking as cheaply as
 * possible; else throw the cheapest card.
 */
function followInPairs(v: BriscaView, hand: readonly Card[], policy: 1 | 2 | 3, playCard: (card: Card) => BriscaAction): BriscaAction {
  const now = trickWinner(v.trick, v.trumpSuit, v.config);
  const winning = v.trick.find((p) => p.seat === now)?.card as Card;
  const trickPoints = v.trick.reduce((a, p) => a + cardPoints(p.card, v.config), 0);
  const last = v.trick.length === v.handCounts.length - 1;
  const partnerWins = now === partnerOf(v.seat);
  const after = v.trick.length === 1 ? 2 : v.trick.length === 2 ? 1 : 0;
  const trumpsOut = unseenCards(v).filter((c) => suitOf(c) === v.trumpSuit);
  // Hard to beat: a trump above every trump unseen, or (level 3) nobody left to play.
  const safe = last || (suitOf(winning) === v.trumpSuit && trumpsOut.every((c) => strength(c, v.config) < strength(winning, v.config)));
  const sideCards = hand.filter((c) => suitOf(c) !== v.trumpSuit);
  // Loading a partner's trick is a skill: level 1 never does, level 2 only when it plays last.
  const loads = policy === 3 ? safe || (after === 1 && suitOf(winning) === v.trumpSuit) : policy === 2 && last;
  if (partnerWins && loads) {
    const pool = sideCards.length > 0 ? sideCards : hand;
    return playCard([...pool].sort((a, b) => cardPoints(b, v.config) - cardPoints(a, v.config) || strength(a, v.config) - strength(b, v.config))[0] as Card);
  }
  if (!partnerWins) {
    const winners = hand.filter((c) => trickWinner([...v.trick, { seat: v.seat, card: c }], v.trumpSuit, v.config) === v.seat);
    const threshold = policy === 1 ? 10 : policy === 2 ? 4 : 3;
    const sameSuit = winners.filter((c) => suitOf(c) !== v.trumpSuit);
    if (sameSuit.length > 0 && (last || policy >= 2)) return playCard([...sameSuit].sort((a, b) => cardPoints(b, v.config) - cardPoints(a, v.config))[0] as Card);
    const trumpWinners = winners.filter((c) => suitOf(c) === v.trumpSuit);
    if (trumpWinners.length > 0 && trickPoints >= threshold) {
      const cheap = lowest(trumpWinners, v, (c) => keepValue(c, v));
      if (policy < 3 || cardPoints(cheap, v.config) < 10 || trickPoints >= 10) return playCard(cheap);
    }
  }
  return playCard(lowest(hand, v, (c) => keepValue(c, v)));
}

/** Heuristic play. Level 1 is a beginner, level 2 knows the basics, level 3 counts. */
export function heuristic(v: BriscaView, policy: 1 | 2 | 3, rng: Rng): BriscaAction {
  const legal = viewLegal(v).filter((a) => a.type !== 'sign');
  const hand = legal.flatMap((a) => (a.type === 'play' && !a.call ? [a.card] : []));
  const handCards = hand.length > 0 ? hand : legal.flatMap((a) => (a.type === 'play' ? [a.card] : []));
  if (policy >= 2 && legal.some((a) => a.type === 'swap')) return { type: 'swap' };
  const playCard = (card: Card): BriscaAction => legal.find((a) => a.type === 'play' && a.card === card && !a.call) ?? (legal.find((a) => a.type === 'play' && a.card === card) as BriscaAction);
  if (policy === 1 && rng.next() < 0.35) return playCard(rng.pick(handCards));

  const led = v.trick[0]?.card;
  if (!led) {
    // Leading: a blank card in a side suit, else the cheapest thing to give away.
    const blanks = handCards.filter((c) => cardPoints(c, v.config) === 0 && suitOf(c) !== v.trumpSuit);
    if (blanks.length > 0) return playCard(lowest(blanks, v, (c) => strength(c, v.config)));
    if (policy >= 3) {
      // With no trumps left out there, a point card can be led safely.
      const trumpsOut = unseenCards(v).filter((c) => suitOf(c) === v.trumpSuit).length;
      const sidePoints = handCards.filter((c) => suitOf(c) !== v.trumpSuit);
      if (trumpsOut === 0 && sidePoints.length > 0) return playCard(lowest(sidePoints, v, (c) => -cardPoints(c, v.config)));
    }
    return playCard(lowest(handCards, v, (c) => keepValue(c, v)));
  }

  const n = v.handCounts.length;
  if (n === 4) return followInPairs(v, handCards, policy, playCard);

  // Following: take points cheaply, never waste a trump on nothing.
  const ledPoints = cardPoints(led, v.config);
  const winners = handCards.filter((c) => trickWinner([{ seat: 1 - v.seat, card: led }, { seat: v.seat, card: c }], v.trumpSuit, v.config) === v.seat);
  const sameSuit = winners.filter((c) => suitOf(c) === suitOf(led) && suitOf(c) !== v.trumpSuit);
  if (sameSuit.length > 0) {
    // Winning in the suit led cannot be beaten: take the most points with it.
    return playCard([...sameSuit].sort((a, b) => cardPoints(b, v.config) - cardPoints(a, v.config))[0] as Card);
  }
  const trumpWinners = winners.filter((c) => suitOf(c) === v.trumpSuit);
  const threshold = policy === 1 ? 10 : policy === 2 ? 4 : 3;
  if (trumpWinners.length > 0 && ledPoints >= threshold) {
    const cheap = lowest(trumpWinners, v, (c) => keepValue(c, v));
    // Level 3 will not spend the As or Tres of trumps on a small trick.
    if (policy < 3 || cardPoints(cheap, v.config) < 10 || ledPoints >= 10) return playCard(cheap);
  }
  if (policy === 1 && rng.next() < 0.3 && trumpWinners.length > 0) return playCard(rng.pick(trumpWinners));
  // Throw the cheapest card, keeping trumps and points.
  return playCard(lowest(handCards, v, (c) => keepValue(c, v)));
}

// Exact play once every card is known

const solveCache = new Map<string, number>();

function solveKey(s: BriscaState): string {
  return `${s.trumpSuit}|${s.config.secondBrisca}|${s.hands.map((h) => [...h].sort().join('')).join('/')}|${s.stock.join('')}|${s.trick.map((p) => `${p.seat}${p.card}`).join('')}|${s.leader}|${sidePiles(s).points[0] ?? 0}`;
}

/** Side 0's points so far, or at the end of the hand. */
const sideZero = (s: BriscaState): number => sidePiles(s).points[0] ?? 0;

/**
 * Side 0's final points in this hand with best play by both sides, from a state where every card
 * is known (the true end of a two-player hand, or a sampled deal). Swaps and signs are not considered.
 */
export function solve(s: BriscaState): number {
  const seat = brisca.turn(s);
  if (seat === null) return s.results[s.results.length - 1]?.points[0] ?? sideZero(s);
  const key = solveKey(s);
  const hit = solveCache.get(key);
  if (hit !== undefined) return hit;
  const maximise = sideOf(seat) === 0;
  let best = maximise ? -1 : 121;
  const hand = s.hands[seat] ?? [];
  for (const card of new Set(hand)) {
    const next = brisca.apply(s, { type: 'play', card }).state;
    const value = next.handNo !== s.handNo || next.over ? (next.results[next.results.length - 1]?.points[0] ?? 0) : solve(next);
    if (maximise ? value > best : value < best) best = value;
  }
  if (solveCache.size > 200_000) solveCache.clear();
  solveCache.set(key, best);
  return best;
}

/** The value of each card for the seat to move, as points that seat ends the hand with. */
export function solveMoves(s: BriscaState): { card: Card; points: number }[] {
  const seat = brisca.turn(s) ?? 0;
  return (s.hands[seat] ?? []).map((card) => {
    const next = brisca.apply(s, { type: 'play', card }).state;
    const zero = next.handNo !== s.handNo || next.over ? (next.results[next.results.length - 1]?.points[0] ?? 0) : solve(next);
    return { card, points: sideOf(seat) === 0 ? zero : 120 - zero };
  });
}

/** The true state is known exactly from a view once the stock is empty (two players). */
function knownState(v: BriscaView): BriscaState | null {
  if (v.stockCount > 0 || v.handCounts.length !== 2) return null;
  return sampleState(v, createRng('known'));
}

function playOut(s: BriscaState, policy: 1 | 2 | 3, rng: Rng, exactAt: number): number[] {
  let state = s;
  const handNo = s.handNo;
  for (let guard = 0; guard < 200; guard++) {
    if (state.over || state.handNo !== handNo) break;
    const seat = brisca.turn(state);
    if (seat === null) break;
    // With four players the exact search waits for the last two tricks (eight cards), to stay quick.
    if (exactAt >= 0 && state.stock.length <= exactAt && (state.hands.length === 2 || state.hands.reduce((a, h) => a + h.length, 0) + state.trick.length <= 8)) {
      const zero = solve(state);
      return [zero, 120 - zero];
    }
    const action = heuristic(viewOf(state, seat), policy, rng);
    state = brisca.apply(state, action).state;
  }
  const result = state.handNo !== handNo || state.over ? state.results[handNo] : undefined;
  if (result) return [...result.points];
  return sidePiles(state).points;
}

/** Expected margin (my points minus theirs) of each legal action, over sampled deals. */
export function evaluateActions(v: BriscaView, samples: number, policy: 1 | 2 | 3, exactAt: number, rng: Rng): { action: BriscaAction; margin: number }[] {
  const legal = searchable(v);
  const me = v.seat;
  const exact = knownState(v);
  if (exact) {
    return legal.map((action) => {
      const next = brisca.apply(exact, action).state;
      const zero = next.handNo !== exact.handNo || next.over ? (next.results[exact.handNo]?.points[0] ?? 0) : solve(next);
      const mine = sideOf(me) === 0 ? zero : 120 - zero;
      return { action, margin: mine - (120 - mine) };
    });
  }
  const totals = legal.map(() => 0);
  const mySide = sideOf(me);
  for (let i = 0; i < samples; i++) {
    const world = sampleState(v, rng);
    const rolloutSeed = `${rng.int(1_000_000_000)}`;
    legal.forEach((action, j) => {
      const next = brisca.apply(world, action).state;
      const points = next.handNo !== world.handNo || next.over ? [...(next.results[world.handNo]?.points ?? [0, 0])] : playOut(next, policy, createRng(rolloutSeed), exactAt);
      totals[j] = (totals[j] ?? 0) + ((points[mySide] ?? 0) - (points[1 - mySide] ?? 0));
    });
  }
  return legal.map((action, j) => ({ action, margin: samples > 0 ? (totals[j] ?? 0) / samples : 0 }));
}

function tagsFor(v: BriscaView, action: BriscaAction): string[] {
  if (action.type === 'swap') return ['brisca-swaps'];
  if (action.type === 'sign') return ['brisca-signs'];
  const led = v.trick[0]?.card;
  const trump = suitOf(action.card) === v.trumpSuit;
  if (!led) return cardPoints(action.card, v.config) === 0 ? ['brisca-leads-blank'] : ['brisca-leads-points'];
  const before = trickWinner(v.trick, v.trumpSuit, v.config);
  const wins = trickWinner([...v.trick, { seat: v.seat, card: action.card }], v.trumpSuit, v.config) === v.seat;
  if (v.handCounts.length === 4 && before === partnerOf(v.seat) && !wins && cardPoints(action.card, v.config) > 0) return ['brisca-loads-partner'];
  const points = v.trick.reduce((a, p) => a + cardPoints(p.card, v.config), 0) + cardPoints(action.card, v.config);
  if (wins && trump && suitOf(led) !== v.trumpSuit) return ['brisca-trumps'];
  if (wins && points > 0) return ['brisca-takes-points'];
  if (!wins && cardPoints(action.card, v.config) === 0) return ['brisca-throws-blank'];
  return [];
}

export function chooseAction(v: BriscaView, level: number, rng: Rng): BriscaAction {
  const params = LEVEL_PARAMS[level];
  if (!params) throw new Error(`Brisca has no level ${level}`);
  // Señas: sign the high trumps to the partner first (level 2 and up).
  const sign = level >= 2 ? viewLegal(v).find((a) => a.type === 'sign' && SIGNED.includes(a.sign)) : undefined;
  if (sign) return sign;
  const legal = viewLegal(v).filter((a) => a.type !== 'sign');
  if (legal.length === 1) return legal[0] as BriscaAction;
  const four = v.handCounts.length === 4;
  if (params.samples === 0) {
    // With two players the end is known exactly once the stock is empty; with four it never is.
    if (!four && params.exactAt >= 0 && v.stockCount === 0) return bestOf(evaluateActions(v, 0, params.policy, 0, rng), rng);
    // Level 3 stands out with four players by counting (the policy its two-player exact end replaces).
    return heuristic(v, four && params.exactAt >= 0 ? 3 : params.policy, rng);
  }
  // Four players: three hands are hidden, so fewer, cheaper deals: half as many, solved exactly only once the stock is gone.
  if (four) return bestOf(evaluateActions(v, Math.ceil(params.samples / 2), params.policy, Math.min(params.exactAt, 0), rng), rng);
  return bestOf(evaluateActions(v, params.samples, params.policy, params.exactAt, rng), rng);
}

/** Search candidates: signs are made before searching, so they are not compared with plays. */
function searchable(v: BriscaView): BriscaAction[] {
  return viewLegal(v).filter((a) => a.type !== 'sign');
}

function bestOf(scored: readonly { action: BriscaAction; margin: number }[], rng: Rng): BriscaAction {
  const top = Math.max(...scored.map((x) => x.margin));
  const best = scored.filter((x) => x.margin >= top - 1e-9);
  return rng.pick(best).action;
}

/** Coach answers: a hint, the best move for free play, and every move's value for review. */
function advise(v: BriscaView, query: Json, rng: Rng): Json {
  if (!isJsonObject(query)) throw new Error('A coach question must be an object');
  const samples = typeof query.samples === 'number' ? Math.max(1, Math.min(200, Math.round(query.samples))) : 40;
  switch (query.type) {
    case 'hint':
    case 'best': {
      const scored = evaluateActions(v, samples, 3, 2, rng);
      const action = bestOf(scored, rng);
      return { action: actionText(action), tags: tagsFor(v, action) };
    }
    case 'analyse': {
      const scored = evaluateActions(v, samples, 3, 2, rng);
      return { exact: v.stockCount === 0, moves: scored.map((x) => ({ action: actionText(x.action), margin: Math.round(x.margin * 10) / 10 })) };
    }
    default:
      throw new Error(`Unknown coach question: ${JSON.stringify(query.type ?? null)}`);
  }
}

export const briscaBots: BotSet<BriscaView, BriscaAction> = {
  gameId: 'brisca',
  levels: BRISCA_LEVELS,
  choose({ view, level, rng }: BotInput<BriscaView>): BotChoice<BriscaAction> {
    const action = chooseAction(view, level, rng);
    return { action, tags: tagsFor(view, action), nodes: LEVEL_PARAMS[level]?.samples ?? 0 };
  },
  advise: ({ view, query, rng }) => advise(view, query, rng),
  encode: (action) => brisca.codec.action.toJSON(action),
};

