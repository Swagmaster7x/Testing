/**
 * Spades CPU players (PLAN.md 2.4). Bidding is by counting likely tricks, as players are taught;
 * play is by partnership heuristics at levels 1 and 2 (second hand low, third hand high, cover
 * partner's nil, stop taking tricks once the bid is made) and by the generic determinized bot at
 * levels 3 and 4: deal the unseen cards many times, play each card out to the end of the hand with
 * the level-2 heuristics for everyone, and keep the card that scores best for the side on average.
 *
 * Bots see only their view. Strength comes from the number of sampled deals, never from time.
 */
import type { BotChoice, BotInput, BotLevel, BotSet } from '../../ai/bot';
import type { DeterminizedSpec } from '../../ai/determinized';
import { bestScored, determinize } from '../../ai/determinized';
import type { Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Rng } from '../../core/rng';
import type { Card, Suit } from '../classic/cards';
import { DECK, rankHigh, SUITS, suitOf } from '../classic/cards';
import { trickWinner } from '../classic/tricks';
import type { SpadesAction, SpadesState, SpadesView } from './rules';
import { actionText, legalBids, mayBlind, membersOf, partnerOf, playableCards, scoreHand, sideCount, sideOf, spades, TRUMP, tricksWon } from './rules';

export const SPADES_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 700 },
  { level: 2, rating: 1000 },
  { level: 3, rating: 1300 },
  { level: 4, rating: 1550 },
];

interface LevelParams {
  /** Sampled deals for each card played; 0 plays by heuristics alone. */
  readonly samples: number;
  readonly policy: 1 | 2;
  /** Sampled deals for the bid; 0 bids by counting. */
  readonly bidSamples: number;
}

export const LEVEL_PARAMS: Readonly<Record<number, LevelParams>> = {
  1: { samples: 0, policy: 1, bidSamples: 0 },
  2: { samples: 0, policy: 2, bidSamples: 0 },
  3: { samples: 16, policy: 2, bidSamples: 0 },
  4: { samples: 40, policy: 2, bidSamples: 40 },
};

const high = (cards: readonly Card[]) => [...cards].sort((a, b) => rankHigh(b) - rankHigh(a));
const low = (cards: readonly Card[]) => [...cards].sort((a, b) => rankHigh(a) - rankHigh(b));

/**
 * Likely tricks in a hand, the way the lessons teach the count: aces; kings with a guard; queens
 * with two guards; in spades the top cards with their guards and every spade past the third; and a
 * short side suit when there are spades to trump with.
 */
export function countTricks(hand: readonly Card[]): number {
  let n = 0;
  const bySuit = (s: Suit) => hand.filter((c) => suitOf(c) === s);
  const spadesHeld = bySuit('s');
  for (const s of SUITS) {
    const cards = bySuit(s);
    const has = (r: string) => cards.some((c) => c[0] === r);
    if (s === 's') {
      if (has('A')) n += 1;
      if (has('K')) n += cards.length >= 2 ? 1 : 0.5;
      if (has('Q')) n += cards.length >= 3 ? 1 : 0.25;
      if (has('J') && cards.length >= 4) n += 0.5;
      n += Math.max(0, cards.length - 3) * (cards.length >= 5 ? 1 : 0.5);
      continue;
    }
    if (has('A')) n += cards.length >= 6 ? 0.5 : 1;
    if (has('K')) n += cards.length >= 2 && cards.length <= 5 ? 0.75 : 0.25;
    if (has('Q') && cards.length >= 3 && cards.length <= 4) n += 0.25;
    // A short suit lets a spade win a trick.
    const spare = spadesHeld.length - 2;
    if (spare > 0 && cards.length === 0) n += Math.min(spare, 1.5);
    else if (spare > 0 && cards.length === 1) n += 0.5;
  }
  return n;
}

/** True when a hand is a fair nil: no high cards that must win, and few, low spades. */
export function nilHand(hand: readonly Card[]): boolean {
  const spadesHeld = hand.filter((c) => suitOf(c) === 's');
  if (spadesHeld.length > 3 || spadesHeld.some((c) => rankHigh(c) >= rankHigh('Js'))) return false;
  for (const s of ['h', 'd', 'c'] as Suit[]) {
    const cards = low(hand.filter((c) => suitOf(c) === s));
    if (cards.some((c) => c[0] === 'A' || c[0] === 'K')) return false;
    // A suit needs low cards to duck under the others.
    if (cards.length > 0 && rankHigh(cards[0] as Card) > rankHigh('6s') && cards.length < 3) return false;
  }
  return true;
}

/** The bid a player of this level makes. */
export function chooseBid(v: Pick<SpadesView, 'config' | 'bids' | 'hand' | 'seat'>, policy: 1 | 2, rng: Rng): number {
  const legal = legalBids(v, v.seat);
  let want: number;
  if (policy === 1) {
    // Counts aces, kings and long spades, and guesses.
    const tops = v.hand.filter((c) => c[0] === 'A' || c[0] === 'K').length;
    const long = Math.max(0, v.hand.filter((c) => suitOf(c) === 's').length - 3);
    want = Math.max(1, tops + long + (rng.next() < 0.3 ? 1 : 0));
  } else {
    const count = countTricks(v.hand);
    const partner = v.config.partners === 'pairs' ? v.bids[partnerOf(v.seat)] : null;
    if (legal.includes(0) && nilHand(v.hand) && count < 1.5 && partner !== 0) return 0;
    want = Math.max(1, Math.round(count - 0.15));
    // Covering a partner's nil costs tricks: bid a little lower, keep the high cards to protect them.
    if (partner === 0) want = Math.max(1, want - 1);
  }
  const pick = legal.filter((n) => n > 0);
  return pick.reduce((best, n) => (Math.abs(n - want) < Math.abs(best - want) ? n : best), pick[0] ?? 1);
}

interface Table {
  readonly config: SpadesState['config'];
  readonly bids: readonly (number | null)[];
  readonly winners: readonly Seat[];
  readonly trick: SpadesState['trick'];
  readonly tricks: SpadesState['tricks'];
  readonly broken: boolean;
}

/** The highest unplayed card of a suit, from what a seat has seen. */
function topLeft(t: Table, hand: readonly Card[], suit: Suit): Card | null {
  const played = new Set<Card>([...t.tricks.flat().map((p) => p.card), ...t.trick.map((p) => p.card)]);
  const left = DECK.filter((c) => suitOf(c) === suit && !played.has(c));
  const top = high(left)[0] ?? null;
  return top && !hand.includes(top) ? top : (top ?? null);
}

/** The card a heuristic player of this level plays. */
export function heuristicCard(t: Table, seat: Seat, hand: readonly Card[], policy: 1 | 2, rng: Rng): Card {
  const legal = playableCards(t, hand);
  if (legal.length === 1) return legal[0] as Card;
  const pairs = t.config.partners === 'pairs';
  const partner = partnerOf(seat);
  const myBid = t.bids[seat] ?? 0;
  const won = tricksWon(t);
  const side = membersOf(t.config, sideOf(t.config, seat));
  const contract = side.reduce((a, m) => a + ((t.bids[m] ?? 0) > 0 ? (t.bids[m] as number) : 0), 0);
  const sideWon = side.reduce((a, m) => a + ((t.bids[m] ?? 0) > 0 ? (won[m] ?? 0) : 0), 0);
  const needTricks = myBid !== 0 && sideWon < contract;
  const partnerNil = pairs && t.bids[partner] === 0;
  const trick = t.trick;
  const led = trick[0];
  if (policy === 1 && rng.next() < 0.2) return rng.pick(legal);

  if (!led) {
    if (myBid === 0) return low(legal)[0] as Card;
    // Lead a sure winner while tricks are needed; otherwise a low card from a long suit.
    if (needTricks || partnerNil) {
      const winners = legal.filter((c) => topLeft(t, [], suitOf(c)) === c && (suitOf(c) !== TRUMP || t.broken));
      if (winners.length > 0) return high(winners)[0] as Card;
    }
    const sideCards = legal.filter((c) => suitOf(c) !== TRUMP);
    const pool = sideCards.length > 0 ? sideCards : legal;
    const count = (s: Suit) => hand.filter((c) => suitOf(c) === s).length;
    return [...pool].sort((a, b) => count(suitOf(b)) - count(suitOf(a)) || rankHigh(a) - rankHigh(b))[0] as Card;
  }

  const current = trickWinner(trick, TRUMP);
  const currentCard = trick.find((p) => p.seat === current)?.card as Card;
  const beats = (c: Card) => trickWinner([...trick, { seat, card: c }], TRUMP) === seat;
  const winners = low(legal.filter(beats));
  const losers = high(legal.filter((c) => !beats(c)));
  const last = trick.length === 3;

  if (myBid === 0) {
    // Nil: duck under the highest card, throwing the biggest card that still loses.
    if (losers.length > 0) return losers[0] as Card;
    return low(legal)[0] as Card;
  }
  if (partnerNil) {
    // Cover partner's nil: win any trick partner might otherwise take.
    const partnerPlayed = trick.find((p) => p.seat === partner);
    const partnerWinning = current === partner;
    if ((partnerWinning || !partnerPlayed) && winners.length > 0) return (partnerPlayed ? winners[0] : high(winners)[0]) as Card;
  }
  const partnerWinning = pairs && current === partner;
  if (partnerWinning) {
    const safe = rankHigh(currentCard) >= rankHigh(topLeft(t, hand, suitOf(currentCard)) ?? currentCard) || last;
    if (safe && losers.length > 0) return low(losers)[0] as Card;
  }
  if (needTricks && winners.length > 0) {
    // Second hand plays low unless it wins cheaply; the last to play wins with the least.
    if (trick.length === 1 && policy === 2 && !last) {
      const cheap = winners.filter((c) => suitOf(c) === suitOf(led.card));
      if (cheap.length === 0 && losers.length > 0 && suitOf(led.card) !== TRUMP && rankHigh(led.card) < rankHigh('Qs')) return low(losers)[0] as Card;
    }
    return winners[0] as Card;
  }
  // Bid made (or no chance): avoid bags, throwing the highest card that still loses.
  if (losers.length > 0) return (needTricks ? low(losers)[0] : losers[0]) as Card;
  return (winners[0] ?? low(legal)[0]) as Card;
}

export function policyMove(state: SpadesState, seat: Seat, policy: 1 | 2, rng: Rng): SpadesAction {
  if (state.phase === 'bid') {
    if (mayBlind(state, seat)) return { type: 'look' };
    return { type: 'bid', n: chooseBid({ config: state.config, bids: state.bids, hand: state.hands[seat] ?? [], seat }, policy, rng) };
  }
  return { type: 'play', card: heuristicCard(state, seat, state.hands[seat] ?? [], policy, rng) };
}

/** The hand's value for `seat`'s side: its score for the hand less the best other side's. */
export function handValue(state: SpadesState, seat: Seat, start: SpadesState): number {
  let deltas: readonly number[];
  if (state.handNo !== start.handNo || state.over) deltas = state.results[start.results.length]?.deltas ?? [];
  else deltas = scoreHand(state.config, state.bids.map((b) => b ?? 0), state.blind, tricksWon(state), state.bagCount).deltas;
  const side = sideOf(state.config, seat);
  const mine = deltas[side] ?? 0;
  const others = deltas.filter((_, i) => i !== side);
  return mine - (others.length > 0 ? Math.max(...others) : 0);
}

function spec(policy: 1 | 2): DeterminizedSpec<SpadesState, SpadesAction, SpadesView> {
  return {
    def: spades,
    policy: (state, seat, rng) => policyMove(state, seat, policy, rng),
    stop: (state, start) => state.handNo !== start.handNo || state.over,
    value: handValue,
    maxPlies: 60,
  };
}

export function evaluateCards(v: SpadesView, samples: number, policy: 1 | 2, rng: Rng): { action: SpadesAction; value: number }[] {
  const cards = playableCards(v, v.hand);
  return determinize(spec(policy), v, v.seat, samples, rng, cards.map((card) => ({ type: 'play' as const, card })));
}

/**
 * Level 4's bid: deal the unseen cards many times and play each deal out with the level-2
 * heuristics, once with a counted bid and once as a nil; bid the tricks won on average, or nil when
 * it survives most deals.
 */
export function simulatedBid(v: SpadesView, samples: number, rng: Rng): number {
  const legal = legalBids(v, v.seat);
  const counted = chooseBid(v, 2, rng);
  const tricksWith = (bid: number): number[] => {
    const out: number[] = [];
    for (let i = 0; i < samples; i++) {
      let s = spades.sample?.(v, v.seat, rng) as SpadesState;
      const hand = s.handNo;
      for (let guard = 0; guard < 80 && !s.over && s.handNo === hand; guard++) {
        const seat = spades.turn(s) as number;
        const action: SpadesAction = s.phase === 'bid' && seat === v.seat ? { type: 'bid', n: bid } : policyMove(s, seat, 2, rng);
        s = spades.apply(s, action).state;
      }
      out.push(s.results[v.results.length]?.tricks[v.seat] ?? 0);
    }
    return out;
  };
  const tricks = tricksWith(Math.max(1, counted));
  const mean = tricks.reduce((a, b) => a + b, 0) / Math.max(1, tricks.length);
  if (legal.includes(0) && (counted === 0 || countTricks(v.hand) < 2.5)) {
    const nil = tricksWith(0);
    const survives = nil.filter((n) => n === 0).length / Math.max(1, nil.length);
    if (survives >= 0.7) return 0;
  }
  const want = Math.max(1, Math.round(mean - 0.25));
  const pick = legal.filter((n) => n > 0);
  return pick.reduce((best, n) => (Math.abs(n - want) < Math.abs(best - want) ? n : best), pick[0] ?? 1);
}

/** Blind nil: taken by the better levels when far behind (at least 200), otherwise look. */
function blindChoice(v: SpadesView, level: number): SpadesAction {
  const mine = v.scores[sideOf(v.config, v.seat)] ?? 0;
  const best = Math.max(...v.scores.filter((_, i) => i !== sideOf(v.config, v.seat)));
  return level >= 3 && best - mine >= 200 && v.config.partners === 'pairs' && v.bids[partnerOf(v.seat)] !== 0 ? { type: 'blind' } : { type: 'look' };
}

export function chooseAction(v: SpadesView, level: number, rng: Rng): SpadesAction {
  const params = LEVEL_PARAMS[level];
  if (!params) throw new Error(`Spades has no level ${level}`);
  if (v.phase === 'bid') {
    if (v.hidden) return blindChoice(v, level);
    if (params.bidSamples > 0) return { type: 'bid', n: simulatedBid(v, params.bidSamples, rng) };
    return { type: 'bid', n: chooseBid(v, params.policy, rng) };
  }
  const cards = playableCards(v, v.hand);
  if (cards.length === 1) return { type: 'play', card: cards[0] as Card };
  if (params.samples === 0) return { type: 'play', card: heuristicCard(v, v.seat, v.hand, params.policy, rng) };
  return bestScored(evaluateCards(v, params.samples, params.policy, rng), rng);
}

export function tagsFor(v: SpadesView, action: SpadesAction): string[] {
  if (action.type === 'bid') return [action.n === 0 ? 'spades-nil' : 'spades-bids'];
  if (action.type !== 'play') return [];
  const card = action.card;
  const led = v.trick[0];
  if (!led) return suitOf(card) === TRUMP ? ['spades-leads-trump'] : ['spades-leads'];
  const wins = trickWinner([...v.trick, { seat: v.seat, card }], TRUMP) === v.seat;
  if (wins && suitOf(card) === TRUMP && suitOf(led.card) !== TRUMP) return ['spades-trumps'];
  if (wins) return ['spades-takes'];
  return ['spades-ducks'];
}

function advise(v: SpadesView, query: Json, rng: Rng): Json {
  if (!isJsonObject(query)) throw new Error('A coach question must be an object');
  const samples = typeof query.samples === 'number' ? Math.max(4, Math.min(120, Math.round(query.samples))) : 32;
  if (v.phase === 'bid') {
    const action = v.hidden ? blindChoice(v, 4) : ({ type: 'bid', n: chooseBid(v, 2, rng) } as SpadesAction);
    return { action: actionText(action), tags: tagsFor(v, action), count: Math.round(countTricks(v.hand) * 4) / 4, moves: [] };
  }
  const scored = evaluateCards(v, samples, 2, rng);
  switch (query.type) {
    case 'hint':
    case 'best': {
      const action = bestScored(scored, rng);
      return { action: actionText(action), tags: tagsFor(v, action) };
    }
    case 'analyse':
      return { moves: scored.map((x) => ({ action: actionText(x.action), value: Math.round(x.value * 10) / 10 })) };
    default:
      throw new Error(`Unknown coach question: ${JSON.stringify(query.type ?? null)}`);
  }
}

export const spadesBots: BotSet<SpadesView, SpadesAction> = {
  gameId: 'spades',
  levels: SPADES_LEVELS,
  choose({ view, level, rng }: BotInput<SpadesView>): BotChoice<SpadesAction> {
    const action = chooseAction(view, level, rng);
    return { action, tags: tagsFor(view, action), nodes: LEVEL_PARAMS[level]?.samples ?? 0 };
  },
  advise: ({ view, query, rng }) => advise(view, query, rng),
  encode: (action) => spades.codec.action.toJSON(action),
};

export { sideCount };
