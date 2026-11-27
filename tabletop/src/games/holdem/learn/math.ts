/**
 * The arithmetic behind Hold'em lessons, problems and their checks: equity against known hands or
 * a stated range, and what a call or an all-in gains over a fold when it ends the betting.
 *
 * From the flop on, equity is exact: every rest of the board is dealt. Before the flop that is
 * 1.7 million boards a matchup, so lesson text uses a fixed-seed sample (the same answer every
 * time) and the linter uses a much larger one, or exact enumeration against a single known hand.
 */
import type { Seat } from '../../../core/contract';
import { createRng } from '../../../core/rng';
import type { Card } from '../cards';
import { cardIndex, DECK } from '../cards';
import type { Combo, Range } from '../equity';
import { ALL_COMBOS, exactEquity, rangeEquity } from '../equity';
import { evaluateIndices } from '../evaluate';
import type { HoldemState, Player } from '../rules';
import { inHand, potOf, seatsInHand, settle, toCallOf } from '../rules';

/** Samples for equity before the flop: in lesson text, and in the linter's checks. */
export const TEXT_SAMPLES = 40_000;
export const CHECK_SAMPLES = 200_000;

export const holeOf = (p: Pick<Player, 'hole'>): Combo => [cardIndex(p.hole[0] as Card), cardIndex(p.hole[1] as Card)];

/**
 * Each hand's share of the pot, the hands known. Exact from the flop on; before the flop exact
 * only when `exactPreflop` (half a second a matchup), else a fixed-seed sample.
 */
export function knownEquity(hands: readonly Combo[], board: readonly number[], exactPreflop = false, samples = TEXT_SAMPLES): number[] {
  if (board.length >= 3 || exactPreflop) return exactEquity(hands, board);
  const rng = createRng(`equity/${hands.flat().join('.')}/${samples}`);
  const [hero, ...rest] = hands;
  if (!hero) return [];
  const mine = rangeEquity(hero, board, rest.map((c) => ({ combos: [c], weights: [1] })), samples, rng);
  // Only the first hand's share is needed in practice; the others split the rest evenly here.
  return [mine, ...rest.map(() => (1 - mine) / Math.max(1, rest.length))];
}

/** A hand's share of the pot against one player holding any combination of a range (equally likely). */
export function rangeShare(hero: Combo, board: readonly number[], combos: readonly Combo[], samples = TEXT_SAMPLES): number {
  if (combos.length === 0) return 1;
  if (board.length >= 3) {
    let sum = 0;
    for (const c of combos) sum += exactEquity([hero, c], board)[0] ?? 0;
    return sum / combos.length;
  }
  const range: Range = { combos, weights: combos.map(() => 1) };
  return rangeEquity(hero, board, [range], samples, createRng(`range/${hero.join('.')}/${combos.length}/${samples}`));
}

/** Every two-card hand another player could hold, given the cards a seat can see. */
export function liveHands(dead: ReadonlySet<number>): Combo[] {
  return ALL_COMBOS.filter((c) => !dead.has(c[0]) && !dead.has(c[1]));
}

/** Cards a seat sees: its own hole cards and the board. */
export function deadFor(state: HoldemState, seat: Seat): Set<number> {
  return new Set<number>([...holeOf(state.players[seat] as Player), ...state.board.map(cardIndex)]);
}

/** The other seats still in the hand. */
export function opponents(state: HoldemState, seat: Seat): Seat[] {
  return seatsInHand(state).filter((s) => s !== seat);
}

/**
 * Chips that calling gains over folding, when the call ends the betting (the others are all-in):
 * the equity share of each pot the seat can win, plus any chips that come back, less the call.
 */
export function callGain(state: HoldemState, seat: Seat, equity: number): number {
  const p = state.players[seat] as Player;
  const c = Math.min(toCallOf(state, seat), p.stack);
  const players = state.players.map((q, i) => (i === seat ? { ...q, stack: q.stack - c, bet: q.bet + c, total: q.total + c } : q));
  return potGain(players, seat, equity) - c;
}

/**
 * Chips that moving all-in gains over folding, against one player left to answer who calls with
 * a share `pCall` of their hands and against whose calling hands the seat has `equity`.
 */
export function pushGain(state: HoldemState, seat: Seat, caller: Seat, pCall: number, equity: number): number {
  const p = state.players[seat] as Player;
  const o = state.players[caller] as Player;
  const to = p.bet + p.stack;
  const oc = Math.min(to - o.bet, o.stack);
  const players = state.players.map((q, i) => {
    if (i === seat) return { ...q, stack: 0, bet: to, total: q.total + p.stack };
    if (i === caller) return { ...q, stack: q.stack - oc, bet: q.bet + oc, total: q.total + oc };
    return q;
  });
  const called = potGain(players, seat, equity) - p.stack;
  return (1 - pCall) * potOf(state) + pCall * called;
}

/** What a seat takes back from the middle at the end: its equity share of each pot it can win, and chips nobody matched. */
function potGain(players: readonly Player[], seat: Seat, equity: number): number {
  const { returned, pots } = settle(players);
  let gain = returned[seat] ?? 0;
  for (const pot of pots) {
    if (!pot.eligible.includes(seat)) continue;
    gain += pot.eligible.length === 1 ? pot.amount : equity * pot.amount;
  }
  return gain;
}

/** True when nobody but `seat` can bet any more this hand: calling ends the betting. */
export function othersAllIn(state: HoldemState, seat: Seat): boolean {
  return state.players.every((p, i) => i === seat || !inHand(p) || p.stack === 0);
}

/** Cards still unseen with every live hand face up: the cards that can come. */
export function cardsToCome(state: HoldemState): number[] {
  const seen = new Set<number>([...state.players.flatMap((p) => (inHand(p) ? p.hole.map(cardIndex) : [])), ...state.board.map(cardIndex)]);
  return DECK.map(cardIndex).filter((c) => !seen.has(c));
}

/** With one card to come and both hands known: the cards that put `hero` ahead, and those that tie. */
export function winningCards(hero: Combo, villain: Combo, board: readonly number[], unseen: readonly number[]): { win: number; tie: number } {
  let win = 0;
  let tie = 0;
  for (const c of unseen) {
    const a = evaluateIndices([hero[0], hero[1], ...board, c]);
    const b = evaluateIndices([villain[0], villain[1], ...board, c]);
    if (a > b) win++;
    else if (a === b) tie++;
  }
  return { win, tie };
}
