/**
 * Tute CPU players (PLAN.md 2.4). Levels 1 to 3 play by heuristics that know more as they go up:
 * a beginner who often forgets what matters (1), a player who knows the basics, keeps pairs to
 * sing and loads points on a partner's trick (2), and one who counts the cards and reads voids
 * from the obligations (3). Levels 4 to 6 search: they deal the unseen cards at random many times,
 * consistent with everything the table has shown, play each card out to the end of the hand, and
 * keep the card that does best on average; level 6 also solves the last tricks exactly in every
 * deal.
 *
 * Bots see only their view. Strength comes from knowledge and the number of sampled deals, never
 * from time.
 */
import type { BotChoice, BotInput, BotLevel, BotSet } from '../../ai/bot';
import type { Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Rng } from '../../core/rng';
import { createRng } from '../../core/rng';
import type { Card, Suit, TuteAction, TuteState, TuteView } from './rules';
import { actionsFor, actionText, beats, cannotHold, cardPoints, DECK, dutyOf, partnerOf, rankOf, sampleState, seatCount, sideOf, strength, SUITS, suitOf, tute, viewOf, viewTurn, winningPlay } from './rules';

export const TUTE_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 600 },
  { level: 2, rating: 900 },
  { level: 3, rating: 1200 },
  { level: 4, rating: 1450 },
  { level: 5, rating: 1650 },
  { level: 6, rating: 1850 },
];

/**
 * What a heuristic player knows. Levels differ in knowledge: a beginner plays the card it likes and
 * forgets the 20s; a basic player keeps its pairs to sing, cashes its Ases and loads points onto a
 * partner's trick; a counting player also knows which cards nobody can beat, draws trumps when it
 * holds more than are out, and reads voids from the obligations.
 */
export interface Skill {
  /** The chance of playing any allowed card. */
  readonly random: number;
  /** The chance of missing a 20 (half that for a 40) or an exchange. */
  readonly forget: number;
  /** Keeps an unsung Rey and Caballo together. */
  readonly pairs: boolean;
  /** Loads points onto a partner's trick it trusts. */
  readonly load: boolean;
  /** Leads its Ases in plain suits. */
  readonly cash: boolean;
  /** Counts the cards: which cards nobody can beat, how many trumps are out. */
  readonly count: boolean;
  /** Reads what each seat cannot hold from its plays. */
  readonly voids: boolean;
}

export type Policy = number;

/** The basic player's knowledge, also used for a policy that is not in the table. */
const BASIC: Skill = { random: 0, forget: 0, pairs: true, load: true, cash: false, count: false, voids: false };

export const SKILLS: Record<number, Skill> = {
  1: { random: 0.25, forget: 0.5, pairs: false, load: false, cash: false, count: false, voids: false },
  2: { random: 0, forget: 0, pairs: true, load: true, cash: false, count: false, voids: false },
  3: { random: 0, forget: 0, pairs: true, load: true, cash: true, count: true, voids: true },
};

interface LevelParams {
  /** Sampled deals for determinized search; 0 plays by heuristics alone. */
  readonly samples: number;
  /** The heuristic (a key of SKILLS) used on its own, and inside rollouts. */
  readonly policy: Policy;
  /** Deal the unseen cards keeping each seat clear of what its plays show it cannot hold. */
  readonly infer: boolean;
  /** Solve the rest exactly once every hand holds this many cards or fewer (-1: never). */
  readonly exactAt: number;
}

export const LEVEL_PARAMS: Record<number, LevelParams> = {
  1: { samples: 0, policy: 1, infer: false, exactAt: -1 },
  2: { samples: 0, policy: 2, infer: false, exactAt: -1 },
  3: { samples: 0, policy: 3, infer: true, exactAt: -1 },
  4: { samples: 24, policy: 3, infer: true, exactAt: -1 },
  5: { samples: 64, policy: 3, infer: true, exactAt: -1 },
  6: { samples: 128, policy: 3, infer: true, exactAt: 2 },
};

/** What a hand won is worth in the search, in points per game it scores. */
export const WIN_BONUS = 40;
const GAME_BONUS = 200;

/** The legal actions as the view sees them (the same as the rules give for the true state). */
export function viewLegal(v: TuteView): TuteAction[] {
  if (viewTurn(v) !== v.seat) return [];
  return actionsFor(v, v.seat, v.hand, dutyOf(v));
}

const plays = (legal: readonly TuteAction[]): Card[] => legal.flatMap((a) => (a.type === 'play' ? [a.card] : []));

// Knowledge from the view

/** Cards still out: not in my hand and not played. */
function outstanding(v: TuteView): Card[] {
  const gone = new Set<Card>([...v.hand, ...v.won.flat(), ...v.trick.map((p) => p.card)]);
  return DECK.filter((c) => !gone.has(c));
}

/** No card still out can beat `card` in its own suit. */
function isBoss(card: Card, out: readonly Card[]): boolean {
  return !out.some((c) => suitOf(c) === suitOf(card) && strength(c) > strength(card));
}

/** The pairs I could still sing: suits where I hold Rey and Caballo, not yet sung. */
function pairSuits(v: TuteView): Set<Suit> {
  const sung = new Set(v.cantes.map((c) => c.suit));
  return new Set(SUITS.filter((s) => !sung.has(s) && v.hand.includes(`R${s}`) && v.hand.includes(`C${s}`)));
}

const isFigure = (card: Card) => rankOf(card) === 'R' || rankOf(card) === 'C';

/** How much a card is worth keeping: its points, trumps, cards of an unsung pair, cards nobody can beat. */
function keepValue(card: Card, v: TuteView, out: readonly Card[], pairs: ReadonlySet<Suit>, skill: Skill): number {
  let value = cardPoints(card);
  if (suitOf(card) === v.trumpSuit) value += 8 + strength(card);
  if (skill.pairs && pairs.has(suitOf(card)) && isFigure(card)) value += suitOf(card) === v.trumpSuit ? 30 : 15;
  if (skill.count && isBoss(card, out)) value += 4;
  return value;
}

function cheapest(cards: readonly Card[], value: (c: Card) => number): Card {
  return [...cards].sort((a, b) => value(a) - value(b) || strength(a) - strength(b))[0] as Card;
}

/** Seats still to play to this trick after me. */
function stillToPlay(v: TuteView): Seat[] {
  const n = seatCount(v.config);
  const left = n - v.trick.length - 1;
  return Array.from({ length: left }, (_, i) => (v.seat + 1 + i) % n);
}

/** Heuristic play with the knowledge of `SKILLS[policy]`. Returns an action and the reason tag for it. */
export function heuristic(v: TuteView, policy: Policy, rng: Rng): { action: TuteAction; tag: string } {
  const skill = SKILLS[policy] ?? BASIC;
  const legal = viewLegal(v);
  const tuteAction = legal.find((a) => a.type === 'tute');
  if (tuteAction) return { action: tuteAction, tag: 'tute-declares' };
  const sing = legal.find((a) => a.type === 'sing');
  if (sing && sing.type === 'sing' && rng.next() >= (sing.suit === v.trumpSuit ? skill.forget / 2 : skill.forget)) return { action: sing, tag: 'tute-sings' };
  const swap = legal.find((a) => a.type === 'swap');
  if (swap && rng.next() >= skill.forget) return { action: swap, tag: 'tute-swaps' };
  const allowed = plays(legal);
  const one = (card: Card, tag: string) => ({ action: { type: 'play', card } as TuteAction, tag });
  if (allowed.length === 1) return one(allowed[0] as Card, 'tute-forced');
  if (skill.random > 0 && rng.next() < skill.random) return one(rng.pick(allowed), 'tute-other');

  const n = seatCount(v.config);
  const out = outstanding(v);
  const pairs = pairSuits(v);
  const keep = (c: Card) => keepValue(c, v, out, pairs, skill);
  const trump = v.trumpSuit;
  const bars = skill.voids ? cannotHold(v) : null;
  const opponents = Array.from({ length: n }, (_, i) => i).filter((s) => sideOf(s, n) !== sideOf(v.seat, n));
  // A seat known to hold none of `suit` (every card of it still out is barred for it, or none is out).
  const voidIn = (s: Seat, suit: Suit) => out.every((c) => suitOf(c) !== suit || (bars?.[s]?.has(c) ?? false));
  const mayTrump = (s: Seat) => out.some((c) => suitOf(c) === trump && !(bars?.[s]?.has(c) ?? false));
  // Some of `who` may trump a card of `suit`.
  const canBeTrumped = (suit: Suit, who: readonly Seat[]) => suit !== trump && who.some((s) => voidIn(s, suit) && mayTrump(s));

  if (v.trick.length === 0) {
    // Leading.
    const plain = allowed.filter((c) => suitOf(c) !== trump);
    if (skill.count) {
      const myTrumps = allowed.filter((c) => suitOf(c) === trump);
      const trumpsOut = out.filter((c) => suitOf(c) === trump);
      // Draw trumps with the top trump when holding more than are left out there.
      const topTrump = myTrumps.find((c) => isBoss(c, out));
      if (topTrump && trumpsOut.length > 0 && myTrumps.length >= trumpsOut.length && !(pairs.has(trump) && isFigure(topTrump))) return one(topTrump, 'tute-draws-trumps');
      // Cash a plain card nobody can beat, unless an opponent may trump it.
      const bosses = plain.filter((c) => isBoss(c, out) && cardPoints(c) >= 10 && !canBeTrumped(suitOf(c), opponents));
      if (bosses.length > 0) return one(bosses.sort((a, b) => cardPoints(b) - cardPoints(a))[0] as Card, 'tute-leads-boss');
      // Lead a suit the partner can trump.
      const partner = partnerOf(v.seat, n);
      if (partner !== null && bars) {
        const voidSuits = SUITS.filter((s) => s !== trump && out.some((c) => suitOf(c) === s) && out.filter((c) => suitOf(c) === s).every((c) => bars[partner]?.has(c)));
        const toPartner = plain.filter((c) => voidSuits.includes(suitOf(c)) && cardPoints(c) === 0);
        if (toPartner.length > 0) return one(cheapest(toPartner, keep), 'tute-leads-low');
      }
    } else if (skill.cash) {
      const aces = plain.filter((c) => rankOf(c) === 'A');
      if (aces.length > 0) return one(aces[0] as Card, 'tute-leads-boss');
    }
    const blanks = plain.filter((c) => cardPoints(c) === 0);
    if (blanks.length > 0) return one(cheapest(blanks, keep), 'tute-leads-low');
    return one(cheapest(allowed, keep), 'tute-leads-low');
  }

  // Following.
  const winning = winningPlay(v.trick, trump);
  const partnerWins = n === 4 && partnerOf(v.seat, n) === winning.seat;
  const after = stillToPlay(v);
  const last = after.length === 0;
  const trickPoints = v.trick.reduce((a, p) => a + cardPoints(p.card), 0);
  const winners = allowed.filter((c) => beats(c, winning.card, trump));
  const led = suitOf((v.trick[0] as { card: Card }).card);
  // A card that the players still to come cannot beat, as far as I know.
  const holds = (card: Card) => {
    if (last) return true;
    const laterOpponents = after.filter((s) => opponents.includes(s));
    if (laterOpponents.length === 0) return true;
    if (!skill.load) return false;
    if (!isBoss(card, out)) return false;
    if (suitOf(card) === trump) return true;
    // A plain boss can still be trumped by an opponent void in the suit.
    if (skill.voids) return !canBeTrumped(led, laterOpponents);
    return out.filter((c) => suitOf(c) === led).length >= after.length;
  };

  if (skill.load && partnerWins && holds(winning.card)) {
    // Load points onto the partner's trick, keeping trumps and pairs.
    const loaders = allowed.filter((c) => suitOf(c) !== trump && !(pairs.has(suitOf(c)) && isFigure(c)));
    const best = [...(loaders.length > 0 ? loaders : allowed)].sort((a, b) => cardPoints(b) - cardPoints(a) || keep(a) - keep(b))[0] as Card;
    if (cardPoints(best) > 0) return one(best, 'tute-loads');
    return one(cheapest(allowed, keep), 'tute-ducks');
  }
  if (winners.length > 0 && !partnerWins) {
    const sure = winners.filter(holds);
    const worth = trickPoints + Math.max(...winners.map(cardPoints)) >= (skill.load ? 2 : 10) || last;
    if (sure.length > 0 && worth) {
      const pick = cheapest(sure, keep);
      return one(pick, suitOf(pick) === trump && led !== trump ? 'tute-trumps' : 'tute-wins-cheap');
    }
  }
  // Forced to beat (the obligations): beat as cheaply as possible.
  if (winners.length === allowed.length) return one(cheapest(winners, keep), 'tute-wins-cheap');
  return one(cheapest(allowed, keep), 'tute-ducks');
}

// Search

/**
 * What the end of a hand is worth to `side`: the point margin and, with `bonus`, the games it won
 * or lost. A hand not finished counts the cards won and the cantes so far.
 */
export function handValue(s: TuteState, handNo: number, side: number, bonus = true): number {
  const result = s.results[handNo];
  const other = 1 - side;
  if (!result) {
    const n = seatCount(s.config);
    const pts = [0, 1].map((x) => s.won[x]?.reduce((a, c) => a + cardPoints(c), 0) ?? 0);
    const cantes = [0, 1].map((x) => s.cantes.filter((c) => sideOf(c.seat, n) === x).reduce((a, c) => a + c.points, 0));
    return (pts[side] ?? 0) + (cantes[side] ?? 0) - (pts[other] ?? 0) - (cantes[other] ?? 0);
  }
  const margin = (result.carried[side] ?? 0) + (result.points[side] ?? 0) - (result.carried[other] ?? 0) - (result.points[other] ?? 0);
  if (result.winner === null || !bonus) return margin;
  const sign = result.winner === side ? 1 : -1;
  const games = result.end === 'tute' && s.config.tute === 'game' ? GAME_BONUS : WIN_BONUS * result.value;
  return margin + sign * games;
}

const solveCache = new Map<string, number>();

function solveKey(s: TuteState, side: number, bonus: boolean): string {
  const c = s.config;
  return `${side}${bonus ? 'b' : 'p'}|${s.trumpSuit}|${c.mustBeat}${c.partner}${c.underTrump}${c.handWin}${c.singer}${c.fortyFirst}${c.tute}${c.capote}|${s.hands.map((h) => [...h].sort().join('')).join('/')}|${s.trick.map((p) => `${p.seat}${p.card}`).join('')}|${s.leader}|${s.won.map((w) => w.length).join(',')}|${s.cantes.map((x) => x.suit).join('')}${s.canteOpen ? '!' : ''}|${s.tricks[s.tricks.length - 1]?.winner ?? ''}|${handValue(s, s.handNo, side, false)}`;
}

/**
 * The value for `side` of the rest of the hand with best play by every seat, all cards known: the
 * point margin, plus the games won or lost with `bonus`. Cantes and tutes are played too; the
 * exchange is not (it only exists while a stock is left).
 */
export function solve(s: TuteState, side: number, bonus = true): number {
  const handNo = s.handNo;
  const seat = tute.turn(s);
  if (seat === null) return handValue(s, handNo, side, bonus);
  const key = solveKey(s, side, bonus);
  const hit = solveCache.get(key);
  if (hit !== undefined) return hit;
  const n = seatCount(s.config);
  const maximise = sideOf(seat, n) === side;
  let best = maximise ? -Infinity : Infinity;
  for (const action of tute.legal(s, seat)) {
    if (action.type === 'swap') continue;
    const next = tute.apply(s, action).state;
    const value = next.handNo !== handNo || next.over ? handValue(next, handNo, side, bonus) : solve(next, side, bonus);
    if (maximise ? value > best : value < best) best = value;
  }
  if (best === -Infinity || best === Infinity) best = handValue(s, handNo, side, bonus);
  if (solveCache.size > 300_000) solveCache.clear();
  solveCache.set(key, best);
  return best;
}

/** Every legal action's exact value for the seat to move's side (all cards known). */
export function solveMoves(s: TuteState, bonus = false): { action: TuteAction; value: number }[] {
  const seat = tute.turn(s) ?? 0;
  const side = sideOf(seat, seatCount(s.config));
  return tute.legal(s, seat).map((action) => {
    const next = tute.apply(s, action).state;
    return { action, value: next.handNo !== s.handNo || next.over ? handValue(next, s.handNo, side, bonus) : solve(next, side, bonus) };
  });
}

/** Plays the hand out from `s` with the heuristic for every seat; the value for `side` at the end. */
function playOut(s: TuteState, side: number, policy: Policy, exactAt: number, rng: Rng): number {
  const handNo = s.handNo;
  let state = s;
  for (let guard = 0; guard < 200; guard++) {
    if (state.over || state.handNo !== handNo) break;
    const seat = tute.turn(state);
    if (seat === null) break;
    if (exactAt >= 0 && state.stock.length === 0 && state.hands.every((h) => h.length <= exactAt)) return solve(state, side);
    state = tute.apply(state, heuristic(viewOf(state, seat), policy, rng).action).state;
  }
  return handValue(state, handNo, side);
}

/** The moves a search compares: every card allowed (cantes, tutes and exchanges are always taken first). */
function searchMoves(legal: readonly TuteAction[]): TuteAction[] {
  const pre = legal.find((a) => a.type === 'tute') ?? legal.find((a) => a.type === 'sing') ?? legal.find((a) => a.type === 'swap');
  return pre ? [pre] : [...legal];
}

/** Expected value (points margin plus games) of each move, over sampled deals. */
export function evaluateActions(v: TuteView, samples: number, policy: Policy, infer: boolean, exactAt: number, rng: Rng, moves: readonly TuteAction[] = viewLegal(v)): { action: TuteAction; value: number }[] {
  const n = seatCount(v.config);
  const side = sideOf(v.seat, n);
  const totals = moves.map(() => 0);
  const count = Math.max(1, samples);
  for (let i = 0; i < count; i++) {
    const world = sampleState(v, rng, infer);
    const rolloutSeed = `${rng.int(1_000_000_000)}`;
    moves.forEach((action, j) => {
      const next = tute.apply(world, action).state;
      const value = next.handNo !== world.handNo || next.over ? handValue(next, world.handNo, side) : playOut(next, side, policy, exactAt, createRng(rolloutSeed));
      totals[j] = (totals[j] ?? 0) + value;
    });
  }
  return moves.map((action, j) => ({ action, value: (totals[j] ?? 0) / count }));
}

function bestOf(scored: readonly { action: TuteAction; value: number }[], rng: Rng): TuteAction {
  const top = Math.max(...scored.map((x) => x.value));
  return rng.pick(scored.filter((x) => x.value >= top - 1e-9)).action;
}

/** A reason tag for a move, as a coach would put it. */
export function tagFor(v: TuteView, action: TuteAction): string {
  switch (action.type) {
    case 'tute':
      return 'tute-declares';
    case 'sing':
      return 'tute-sings';
    case 'swap':
      return 'tute-swaps';
    case 'play':
      break;
  }
  const card = action.card;
  const n = seatCount(v.config);
  const out = outstanding(v);
  if (viewLegal(v).filter((a) => a.type === 'play').length === 1) return 'tute-forced';
  if (v.trick.length === 0) {
    if (suitOf(card) === v.trumpSuit && isBoss(card, out)) return 'tute-draws-trumps';
    if (isBoss(card, out) && cardPoints(card) >= 10) return 'tute-leads-boss';
    return cardPoints(card) === 0 ? 'tute-leads-low' : 'tute-other';
  }
  const winning = winningPlay(v.trick, v.trumpSuit);
  const partnerWins = n === 4 && partnerOf(v.seat, n) === winning.seat;
  const wins = beats(card, winning.card, v.trumpSuit);
  if (partnerWins && !wins && cardPoints(card) > 0) return 'tute-loads';
  if (wins && suitOf(card) === v.trumpSuit && suitOf(v.trick[0]?.card ?? card) !== v.trumpSuit) return 'tute-trumps';
  if (wins) return 'tute-wins-cheap';
  return 'tute-ducks';
}

export function chooseAction(v: TuteView, level: number, rng: Rng): { action: TuteAction; tag: string } {
  const params = LEVEL_PARAMS[level];
  if (!params) throw new Error(`Tute has no level ${level}`);
  const legal = viewLegal(v);
  if (legal.length === 1) return { action: legal[0] as TuteAction, tag: tagFor(v, legal[0] as TuteAction) };
  if (params.samples === 0) return heuristic(v, params.policy, rng);
  const moves = searchMoves(legal);
  if (moves.length === 1) return { action: moves[0] as TuteAction, tag: tagFor(v, moves[0] as TuteAction) };
  const action = bestOf(evaluateActions(v, params.samples, params.policy, params.infer, params.exactAt, rng, moves), rng);
  return { action, tag: tagFor(v, action) };
}

/** Coach answers: a hint, the best move for free play, and every move's value for review. */
function advise(v: TuteView, query: Json, rng: Rng): Json {
  if (!isJsonObject(query)) throw new Error('A coach question must be an object');
  const samples = typeof query.samples === 'number' ? Math.max(1, Math.min(200, Math.round(query.samples))) : 48;
  switch (query.type) {
    case 'hint':
    case 'best': {
      const legal = viewLegal(v);
      const moves = searchMoves(legal);
      const action = moves.length === 1 ? (moves[0] as TuteAction) : bestOf(evaluateActions(v, samples, 3, true, 3, rng, moves), rng);
      return { action: actionText(action), tags: [tagFor(v, action)] };
    }
    case 'analyse': {
      const scored = evaluateActions(v, samples, 3, true, 3, rng);
      return { moves: scored.map((x) => ({ action: actionText(x.action), value: Math.round(x.value * 10) / 10 })) };
    }
    default:
      throw new Error(`Unknown coach question: ${JSON.stringify(query.type ?? null)}`);
  }
}

export const tuteBots: BotSet<TuteView, TuteAction> = {
  gameId: 'tute',
  levels: TUTE_LEVELS,
  choose({ view, level, rng }: BotInput<TuteView>): BotChoice<TuteAction> {
    const { action, tag } = chooseAction(view, level, rng);
    return { action, tags: [tag], nodes: LEVEL_PARAMS[level]?.samples ?? 0 };
  },
  advise: ({ view, query, rng }) => advise(view, query, rng),
  encode: (action) => tute.codec.action.toJSON(action),
};
