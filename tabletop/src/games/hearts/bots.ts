/**
 * Hearts CPU players (PLAN.md 2.4). Levels 1 and 2 play by heuristics a person would use; levels 3
 * and 4 are the generic determinized bot (src/ai/determinized.ts): they deal the unseen cards with
 * `sample` many times, play each card out to the end of the hand with the level-2 heuristics for
 * everyone, and keep the card that costs the fewest points on average. Passing is by heuristics at
 * every level (the better levels void a suit and keep their low spades).
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
import { canonical, rankHigh, suitOf } from '../classic/cards';
import { trickWinner } from '../classic/tricks';
import type { HeartsAction, HeartsState, HeartsView } from './rules';
import { actionText, handPoints, hearts, isHeart, PASS_COUNT, playableCards, pointsOf, QUEEN, takenBy } from './rules';

export const HEARTS_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 700 },
  { level: 2, rating: 1000 },
  { level: 3, rating: 1300 },
  { level: 4, rating: 1550 },
];

interface LevelParams {
  /** Sampled deals per decision; 0 plays by heuristics alone. */
  readonly samples: number;
  /** The heuristic used on its own, and for everyone inside rollouts. */
  readonly policy: 1 | 2;
}

export const LEVEL_PARAMS: Readonly<Record<number, LevelParams>> = {
  1: { samples: 0, policy: 1 },
  2: { samples: 0, policy: 2 },
  3: { samples: 6, policy: 2 },
  4: { samples: 48, policy: 2 },
};

/** What a player can know about the table: its own hand and what has been played. */
interface Seen {
  readonly hand: readonly Card[];
  readonly trick: HeartsState['trick'];
  readonly tricks: HeartsState['tricks'];
  readonly legal: readonly Card[];
  readonly queenOut: boolean;
}

function seenFrom(s: Pick<HeartsState, 'config' | 'trick' | 'tricks' | 'broken'>, hand: readonly Card[]): Seen {
  const played = s.tricks.some((t) => t.some((p) => p.card === QUEEN)) || s.trick.some((p) => p.card === QUEEN);
  return { hand, trick: s.trick, tricks: s.tricks, legal: playableCards(s, hand), queenOut: !played && !hand.includes(QUEEN) };
}

const high = (cards: readonly Card[]) => [...cards].sort((a, b) => rankHigh(b) - rankHigh(a));
const low = (cards: readonly Card[]) => [...cards].sort((a, b) => rankHigh(a) - rankHigh(b));

/** The card a heuristic player of this level plays. */
export function heuristicCard(seen: Seen, policy: 1 | 2, rng: Rng): Card {
  const legal = seen.legal;
  if (legal.length === 1) return legal[0] as Card;
  const trick = seen.trick;
  const led = trick[0];
  if (policy === 1) {
    // A beginner: duck when easy, otherwise throws its biggest card, and now and then just plays something.
    if (rng.next() < 0.2) return rng.pick(legal);
    if (!led) return low(legal)[0] as Card;
    const suit = suitOf(led.card);
    const follow = legal.filter((c) => suitOf(c) === suit);
    if (follow.length > 0) {
      const top = Math.max(...trick.filter((p) => suitOf(p.card) === suit).map((p) => rankHigh(p.card)));
      const under = follow.filter((c) => rankHigh(c) < top);
      return (under.length > 0 ? high(under)[0] : low(follow)[0]) as Card;
    }
    return high(legal)[0] as Card;
  }
  if (!led) return leadCard(seen);
  const suit = suitOf(led.card);
  const follow = legal.filter((c) => suitOf(c) === suit);
  const last = trick.length === 3;
  const points = pointsOf(trick.map((p) => p.card), { jackDiamonds: 'off' });
  if (follow.length > 0) {
    const top = Math.max(...trick.filter((p) => suitOf(p.card) === suit).map((p) => rankHigh(p.card)));
    const under = follow.filter((c) => rankHigh(c) < top);
    if (suit === 's') {
      // Give the queen to whoever played the ace or king; never win a spade trick with the queen still out.
      if (follow.includes(QUEEN) && top > rankHigh(QUEEN)) return QUEEN;
      const safe = under.filter((c) => c !== QUEEN);
      if (safe.length > 0) return high(safe)[0] as Card;
      if (last && points === 0) return high(follow.filter((c) => c !== QUEEN))[0] ?? (low(follow)[0] as Card);
      return (low(follow.filter((c) => c !== QUEEN))[0] ?? QUEEN);
    }
    if (under.length > 0) return high(under)[0] as Card;
    // Must win: as last to play with nothing in the trick, win with the highest; otherwise the lowest.
    if (last && points === 0) return high(follow)[0] as Card;
    return low(follow)[0] as Card;
  }
  // Void: the queen first, then the dangerous spades, then the highest heart, then the highest card of a short suit.
  if (legal.includes(QUEEN)) return QUEEN;
  const bigSpades = legal.filter((c) => suitOf(c) === 's' && rankHigh(c) > rankHigh(QUEEN));
  if (bigSpades.length > 0 && seen.queenOut) return high(bigSpades)[0] as Card;
  const hearts = legal.filter(isHeart);
  if (hearts.length > 0) return high(hearts)[0] as Card;
  const bySuit = (s: Suit) => seen.hand.filter((c) => suitOf(c) === s).length;
  return [...legal].sort((a, b) => bySuit(suitOf(a)) - bySuit(suitOf(b)) || rankHigh(b) - rankHigh(a))[0] as Card;
}

function leadCard(seen: Seen): Card {
  const legal = seen.legal;
  const spades = legal.filter((c) => suitOf(c) === 's');
  const holdsDanger = seen.hand.some((c) => c === QUEEN || ((c === 'As' || c === 'Ks') && seen.queenOut));
  // Smoke out the queen with low spades when it cannot hurt.
  if (seen.queenOut && !holdsDanger && spades.length > 0) return low(spades)[0] as Card;
  const safe = legal.filter((c) => !(suitOf(c) === 's' && holdsDanger) && c !== QUEEN);
  const pool = safe.length > 0 ? safe : legal;
  // Lead the lowest card, from the suit where it is lowest relative to what is left.
  return low(pool)[0] as Card;
}

/** Three cards to pass. Level 1 passes its highest; better players void a suit and keep low spades. */
export function choosePass(hand: readonly Card[], policy: 1 | 2): Card[] {
  if (policy === 1) return canonical(high(hand).slice(0, PASS_COUNT));
  const spades = hand.filter((c) => suitOf(c) === 's');
  const longSpades = spades.filter((c) => rankHigh(c) < rankHigh(QUEEN)).length >= 3;
  const count = (s: Suit) => hand.filter((c) => suitOf(c) === s).length;
  const danger = (c: Card): number => {
    const r = rankHigh(c);
    if (c === QUEEN) return longSpades ? 5 : 100;
    if (suitOf(c) === 's') return r > rankHigh(QUEEN) ? (longSpades ? 10 : 90) : 0;
    let d = r * 3;
    if (isHeart(c)) d += 12;
    // Getting rid of a short club or diamond suit leaves a void to throw points on.
    if ((suitOf(c) === 'c' || suitOf(c) === 'd') && count(suitOf(c)) <= 2) d += 25;
    if (c === '2c') d -= 30;
    return d;
  };
  return canonical([...hand].sort((a, b) => danger(b) - danger(a)).slice(0, PASS_COUNT));
}

/** The level-2 move in any state, for rollouts (it reads only that seat's hand and the table). */
export function policyMove(state: HeartsState, seat: Seat, policy: 1 | 2, rng: Rng): HeartsAction {
  const hand = state.hands[seat] ?? [];
  if (state.phase === 'pass') return { type: 'pass', cards: choosePass(hand, policy) };
  return { type: 'play', card: heuristicCard(seenFrom(state, hand), policy, rng) };
}

/** A hand's value for `seat` at the end: the others' average points less its own (the moon included). */
export function handValue(state: HeartsState, seat: Seat, start: HeartsState): number {
  let points: readonly number[];
  if (state.handNo !== start.handNo || state.over) points = state.results[start.results.length]?.points ?? [0, 0, 0, 0];
  else points = handPoints(takenBy(state), state.config, state.scores).points;
  const mine = points[seat] ?? 0;
  const others = points.reduce((a, b) => a + b, 0) - mine;
  return others / 3 - mine;
}

function spec(policy: 1 | 2): DeterminizedSpec<HeartsState, HeartsAction, HeartsView> {
  return {
    def: hearts,
    policy: (state, seat, rng) => policyMove(state, seat, policy, rng),
    stop: (state, start) => state.handNo !== start.handNo || state.over,
    value: handValue,
    maxPlies: 60,
  };
}

/** Expected value of each card over sampled deals. */
export function evaluateCards(v: HeartsView, samples: number, policy: 1 | 2, rng: Rng): { action: HeartsAction; value: number }[] {
  const cards = playableCards(v, v.hand);
  return determinize(spec(policy), v, v.seat, samples, rng, cards.map((card) => ({ type: 'play' as const, card })));
}

export function chooseAction(v: HeartsView, level: number, rng: Rng): HeartsAction {
  const params = LEVEL_PARAMS[level];
  if (!params) throw new Error(`Hearts has no level ${level}`);
  if (v.phase === 'pass') return { type: 'pass', cards: choosePass(v.hand, level >= 2 ? 2 : 1) };
  const cards = playableCards(v, v.hand);
  if (cards.length === 1) return { type: 'play', card: cards[0] as Card };
  if (params.samples === 0) return { type: 'play', card: heuristicCard(seenFrom(v, v.hand), params.policy, rng) };
  return bestScored(evaluateCards(v, params.samples, params.policy, rng), rng);
}

export function tagsFor(v: HeartsView, action: HeartsAction): string[] {
  if (action.type === 'pass') return ['hearts-passes'];
  const card = action.card;
  const led = v.trick[0];
  if (!led) return suitOf(card) === 's' && rankHigh(card) < rankHigh(QUEEN) && !v.hand.includes(QUEEN) ? ['hearts-smokes-queen'] : ['hearts-leads-low'];
  if (suitOf(card) !== suitOf(led.card)) return card === QUEEN || isHeart(card) ? ['hearts-dumps-points'] : ['hearts-discards'];
  const wins = trickWinner([...v.trick, { seat: v.seat, card }], null) === v.seat;
  return wins ? ['hearts-takes'] : ['hearts-ducks'];
}

function advise(v: HeartsView, query: Json, rng: Rng): Json {
  if (!isJsonObject(query)) throw new Error('A coach question must be an object');
  const samples = typeof query.samples === 'number' ? Math.max(4, Math.min(120, Math.round(query.samples))) : 32;
  if (v.phase === 'pass') {
    const cards = choosePass(v.hand, 2);
    const action: HeartsAction = { type: 'pass', cards };
    return { action: actionText(action), tags: ['hearts-passes'], moves: [] };
  }
  const scored = evaluateCards(v, samples, 2, rng);
  switch (query.type) {
    case 'hint':
    case 'best': {
      const action = bestScored(scored, rng);
      return { action: actionText(action), tags: tagsFor(v, action) };
    }
    case 'analyse':
      return { moves: scored.map((x) => ({ action: actionText(x.action), value: Math.round(x.value * 100) / 100 })) };
    default:
      throw new Error(`Unknown coach question: ${JSON.stringify(query.type ?? null)}`);
  }
}

export const heartsBots: BotSet<HeartsView, HeartsAction> = {
  gameId: 'hearts',
  levels: HEARTS_LEVELS,
  choose({ view, level, rng }: BotInput<HeartsView>): BotChoice<HeartsAction> {
    const action = chooseAction(view, level, rng);
    return { action, tags: tagsFor(view, action), nodes: LEVEL_PARAMS[level]?.samples ?? 0 };
  },
  advise: ({ view, query, rng }) => advise(view, query, rng),
  encode: (action) => hearts.codec.action.toJSON(action),
};
