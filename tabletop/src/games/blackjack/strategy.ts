/**
 * Basic strategy for Blackjack, computed by expected value from the rules in force (PLAN.md 2.6 and
 * docs/rules/blackjack.md), never typed in from a printed chart.
 *
 * The model: the player's cards and the dealer's up-card are taken out of the shoe, and every later
 * card is drawn from that shoe without further removal (the usual total-dependent approximation).
 * With the peek rule the dealer's hole card is conditioned on there being no blackjack; with no
 * hole card a dealer blackjack is counted separately, and costs the doubled or split money too
 * unless only original bets are lost. Hit, stand and double are exact under the model; a split
 * hand is played with the same strategy and further splits are counted by the chance of drawing
 * another card of the same rank. A total's row is the average over the two-card hands that make it.
 *
 * Values are expected chips won per chip of the original bet (+1 a win, -1 a loss).
 */
import type { Card } from '../classic/cards';

/** The rules that change the strategy. */
export interface StrategyRules {
  readonly decks: number;
  readonly soft17: 'stand' | 'hit';
  readonly payout: '3:2' | '6:5';
  readonly double: 'any' | '9-11' | '10-11';
  readonly das: 'yes' | 'no';
  readonly splitTo: number;
  readonly resplitAces: 'no' | 'yes';
  readonly hitSplitAces: 'no' | 'yes';
  readonly surrender: 'late' | 'none';
  readonly holeCard: 'peek' | 'enhc' | 'enhc-obo';
  readonly charlie: 'off' | 'five';
}

export type Move = 'hit' | 'stand' | 'double' | 'split' | 'surrender';
/** A chart cell: the best play, and what to do when it is not allowed (H hit, S stand, D double, P split, R surrender). */
export type Cell = 'H' | 'S' | 'Dh' | 'Ds' | 'P' | 'Ph' | 'Rh' | 'Rs' | 'Rp';

/** 1 for an ace, 2 to 9, 10 for every ten-value card. */
export function rankIndex(card: Card): number {
  const r = card[0];
  if (r === 'A') return 1;
  if (r === 'T' || r === 'J' || r === 'Q' || r === 'K') return 10;
  return Number(r);
}

export interface Total {
  readonly total: number;
  readonly soft: boolean;
}

/** A hand's best total: aces count 11 while that does not go over 21. */
export function handTotal(cards: readonly Card[]): Total {
  let hard = 0;
  let ace = false;
  for (const c of cards) {
    const r = rankIndex(c);
    hard += r;
    if (r === 1) ace = true;
  }
  const soft = ace && hard + 10 <= 21;
  return { total: soft ? hard + 10 : hard, soft };
}

export function isBlackjackCards(cards: readonly Card[]): boolean {
  return cards.length === 2 && handTotal(cards).total === 21;
}

/** Cards of each rank index in a fresh shoe (index 0 unused). */
export function shoeCounts(decks: number): number[] {
  const c = new Array<number>(11).fill(4 * decks);
  c[0] = 0;
  c[10] = 16 * decks;
  return c;
}

function probabilities(counts: readonly number[]): number[] {
  const n = counts.reduce((a, b) => a + b, 0);
  return counts.map((x) => (n > 0 ? x / n : 0));
}

// The dealer

/** Final dealer totals: index 0 to 4 are 17 to 21, 5 is bust. */
type DealerDist = Float64Array;

function dealerFinish(p: readonly number[], hit17: boolean): (hard: number, ace: boolean) => DealerDist {
  const memo = new Map<number, DealerDist>();
  const finish = (hard: number, ace: boolean): DealerDist => {
    const key = hard * 2 + (ace ? 1 : 0);
    const hit = memo.get(key);
    if (hit) return hit;
    const out = new Float64Array(6);
    const soft = ace && hard + 10 <= 21;
    const total = soft ? hard + 10 : hard;
    if (total > 21) out[5] = 1;
    else if (total > 17 || (total === 17 && !(soft && hit17))) out[total - 17] = 1;
    else {
      for (let r = 1; r <= 10; r++) {
        const pr = p[r] as number;
        if (pr === 0) continue;
        const next = finish(hard + r, ace || r === 1);
        for (let i = 0; i < 6; i++) out[i] = (out[i] as number) + pr * (next[i] as number);
      }
    }
    memo.set(key, out);
    return out;
  };
  return finish;
}

/** The dealer's final totals given the up-card, conditioned on no dealer blackjack; and the chance of one. */
export function dealerOutcomes(up: number, counts: readonly number[], hit17: boolean): { dist: DealerDist; blackjack: number } {
  const p = probabilities(counts);
  const finish = dealerFinish(p, hit17);
  const out = new Float64Array(6);
  let bj = 0;
  let mass = 0;
  for (let hole = 1; hole <= 10; hole++) {
    const pr = p[hole] as number;
    if (pr === 0) continue;
    if ((up === 1 && hole === 10) || (up === 10 && hole === 1)) {
      bj += pr;
      continue;
    }
    mass += pr;
    const d = finish(up + hole, up === 1 || hole === 1);
    for (let i = 0; i < 6; i++) out[i] = (out[i] as number) + pr * (d[i] as number);
  }
  if (mass > 0) for (let i = 0; i < 6; i++) out[i] = (out[i] as number) / mass;
  return { dist: out, blackjack: bj };
}

function standValue(total: number, d: DealerDist): number {
  if (total > 21) return -1;
  let ev = d[5] as number;
  for (let t = 17; t <= 21; t++) {
    const pr = d[t - 17] as number;
    if (t < total) ev += pr;
    else if (t > total) ev -= pr;
  }
  return ev;
}

const doubleAllowed = (rules: StrategyRules, total: number): boolean => rules.double === 'any' || (rules.double === '9-11' ? total >= 9 && total <= 11 : total >= 10 && total <= 11);

interface Context {
  readonly rules: StrategyRules;
  readonly p: readonly number[];
  readonly d: DealerDist;
  /** Best value of a hand that may still hit (or stand), by hard sum, ace and card count. */
  readonly bestMemo: Map<number, number>;
}

function totalOf(hard: number, ace: boolean): number {
  return ace && hard + 10 <= 21 ? hard + 10 : hard;
}

/** The value of standing or hitting on, playing on with the best of the two. */
function bestPlay(ctx: Context, hard: number, ace: boolean, n: number): number {
  const total = totalOf(hard, ace);
  if (total > 21) return -1;
  if (ctx.rules.charlie === 'five' && n >= 5) return 1;
  if (total === 21) return standValue(21, ctx.d);
  const key = (hard * 2 + (ace ? 1 : 0)) * 8 + Math.min(n, 7);
  const hit = ctx.bestMemo.get(key);
  if (hit !== undefined) return hit;
  const value = Math.max(standValue(total, ctx.d), hitValue(ctx, hard, ace, n));
  ctx.bestMemo.set(key, value);
  return value;
}

function hitValue(ctx: Context, hard: number, ace: boolean, n: number): number {
  let ev = 0;
  for (let r = 1; r <= 10; r++) {
    const pr = ctx.p[r] as number;
    if (pr > 0) ev += pr * bestPlay(ctx, hard + r, ace || r === 1, n + 1);
  }
  return ev;
}

function doubleValue(ctx: Context, hard: number, ace: boolean): number {
  let ev = 0;
  for (let r = 1; r <= 10; r++) {
    const pr = ctx.p[r] as number;
    if (pr > 0) ev += pr * standValue(totalOf(hard + r, ace || r === 1), ctx.d);
  }
  return 2 * ev;
}

/** The value of one hand made by splitting a pair of `rank`, with `left` more splits allowed. */
function splitHandValue(ctx: Context, rank: number, left: number): number {
  const rules = ctx.rules;
  const aces = rank === 1;
  let ev = 0;
  for (let c = 1; c <= 10; c++) {
    const pr = ctx.p[c] as number;
    if (pr === 0) continue;
    const hard = rank + c;
    const ace = aces || c === 1;
    const total = totalOf(hard, ace);
    let value: number;
    if (aces && rules.hitSplitAces === 'no') value = standValue(total, ctx.d);
    else {
      value = bestPlay(ctx, hard, ace, 2);
      if (rules.das === 'yes' && doubleAllowed(rules, total) && total < 21) value = Math.max(value, doubleValue(ctx, hard, ace));
    }
    if (c === rank && left > 0 && (!aces || rules.resplitAces === 'yes')) value = Math.max(value, 2 * splitHandValue(ctx, rank, left - 1));
    ev += pr * value;
  }
  return ev;
}

export type MoveValues = Partial<Record<Move, number>>;

export interface Allowed {
  readonly double: boolean;
  readonly split: boolean;
  readonly surrender: boolean;
  /** Further splits allowed after this one (hands left minus one). */
  readonly splitsLeft: number;
  /** The hand came from a split (no surrender; doubling only with DAS). */
  readonly fromSplit: boolean;
}

/**
 * The expected value of each move for a hand against an up-card, with these cards out of the shoe
 * (the hand, the up-card and any other cards given in `removed`).
 */
export function moveValues(cards: readonly Card[], up: Card, rules: StrategyRules, allowed: Allowed, removed: readonly Card[] = []): MoveValues {
  const counts = shoeCounts(rules.decks);
  for (const c of [...cards, up, ...removed]) counts[rankIndex(c)] = Math.max(0, (counts[rankIndex(c)] as number) - 1);
  return valuesWithCounts(cards.map(rankIndex), rankIndex(up), rules, allowed, counts);
}

function valuesWithCounts(ranks: readonly number[], up: number, rules: StrategyRules, allowed: Allowed, counts: readonly number[]): MoveValues {
  const { dist, blackjack } = dealerOutcomes(up, counts, rules.soft17 === 'hit');
  const ctx: Context = { rules, p: probabilities(counts), d: dist, bestMemo: new Map() };
  const hard = ranks.reduce((a, b) => a + b, 0);
  const ace = ranks.includes(1);
  const total = totalOf(hard, ace);
  const out: MoveValues = {};
  out.stand = standValue(total, dist);
  if (total < 21) out.hit = hitValue(ctx, hard, ace, ranks.length);
  if (allowed.double && ranks.length === 2 && doubleAllowed(rules, total) && total < 21) out.double = doubleValue(ctx, hard, ace);
  if (allowed.split && ranks.length === 2 && ranks[0] === ranks[1]) out.split = 2 * splitHandValue(ctx, ranks[0] as number, allowed.splitsLeft);
  if (allowed.surrender && ranks.length === 2) out.surrender = -0.5;
  // With no hole card, a dealer blackjack (not yet ruled out) takes the original bet, or every bet.
  const pBj = rules.holeCard === 'peek' ? 0 : blackjack;
  if (pBj > 0) {
    const lossAll = rules.holeCard === 'enhc' ? 2 : 1;
    for (const m of Object.keys(out) as Move[]) {
      const v = out[m] as number;
      const loss = m === 'surrender' ? 0.5 : m === 'double' || m === 'split' ? lossAll : 1;
      out[m] = m === 'surrender' ? -0.5 : (1 - pBj) * v - pBj * loss;
    }
  }
  return out;
}

/** The best move among the allowed values. */
export function bestMove(values: MoveValues): Move {
  let best: Move = 'stand';
  let top = -Infinity;
  for (const m of ['stand', 'hit', 'double', 'split', 'surrender'] as const) {
    const v = values[m];
    if (v !== undefined && v > top + 1e-12) {
      top = v;
      best = m;
    }
  }
  return best;
}

// The chart

export const UPCARDS: readonly number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 1];
export const HARD_ROWS: readonly number[] = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
export const SOFT_ROWS: readonly number[] = [13, 14, 15, 16, 17, 18, 19, 20];
export const PAIR_ROWS: readonly number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 1];

export interface ChartRow {
  readonly kind: 'hard' | 'soft' | 'pair';
  readonly value: number;
  /** Cells by up-card, in UPCARDS order. */
  readonly cells: readonly Cell[];
  /** The averaged value of each move, by up-card. */
  readonly values: readonly MoveValues[];
}

export interface Chart {
  readonly hard: readonly ChartRow[];
  readonly soft: readonly ChartRow[];
  readonly pairs: readonly ChartRow[];
}

const FULL: Allowed = { double: true, split: true, surrender: true, splitsLeft: 2, fromSplit: false };

function cellOf(values: MoveValues, rules: StrategyRules, isPair: boolean): Cell {
  const hitOrStand = (values.hit ?? -Infinity) > (values.stand ?? -Infinity) ? 'h' : 's';
  const best = bestMove(values);
  if (best === 'surrender') {
    if (isPair && (values.split ?? -Infinity) > Math.max(values.hit ?? -Infinity, values.stand ?? -Infinity)) return 'Rp';
    return hitOrStand === 'h' ? 'Rh' : 'Rs';
  }
  if (best === 'split') {
    // Split if doubling after a split is allowed, otherwise hit: only marked when the split depends on it.
    return 'P';
  }
  if (best === 'double') return hitOrStand === 'h' ? 'Dh' : 'Ds';
  void rules;
  return best === 'hit' ? 'H' : 'S';
}

function average(list: readonly { weight: number; values: MoveValues }[]): MoveValues {
  const total = list.reduce((a, b) => a + b.weight, 0);
  const out: MoveValues = {};
  for (const m of ['stand', 'hit', 'double', 'split', 'surrender'] as const) {
    if (list.every((x) => x.values[m] !== undefined)) out[m] = list.reduce((a, x) => a + x.weight * (x.values[m] as number), 0) / total;
  }
  return out;
}

/** Two-card hands (rank indices) that make a hard or soft total, with their chance of being dealt. */
function combos(kind: 'hard' | 'soft', value: number, decks: number): { ranks: number[]; weight: number }[] {
  const counts = shoeCounts(decks);
  const n = counts.reduce((a, b) => a + b, 0);
  const out: { ranks: number[]; weight: number }[] = [];
  for (let a = 1; a <= 10; a++) {
    for (let b = a; b <= 10; b++) {
      if (a === b) continue; // pairs have their own rows
      const t = handTotal([rankCard(a), rankCard(b)]);
      if (t.soft !== (kind === 'soft') || t.total !== value) continue;
      const weight = ((counts[a] as number) / n) * ((counts[b] as number) / (n - 1)) * 2;
      out.push({ ranks: [a, b], weight });
    }
  }
  return out;
}

function rankCard(r: number): Card {
  return (r === 1 ? 'As' : r === 10 ? 'Ts' : `${r}s`) as Card;
}

const chartCache = new Map<string, Chart>();

export function rulesKey(rules: StrategyRules): string {
  return [rules.decks, rules.soft17, rules.double, rules.das, rules.splitTo, rules.resplitAces, rules.hitSplitAces, rules.surrender, rules.holeCard, rules.charlie].join('|');
}

/** The full basic-strategy chart for these rules (cached). */
export function strategyChart(rules: StrategyRules): Chart {
  const key = rulesKey(rules);
  const cached = chartCache.get(key);
  if (cached) return cached;
  const allowed: Allowed = { ...FULL, surrender: rules.surrender === 'late', splitsLeft: Math.max(0, rules.splitTo - 2) };
  const row = (kind: 'hard' | 'soft', value: number): ChartRow => {
    const list = combos(kind, value, rules.decks);
    const values = UPCARDS.map((up) =>
      average(
        list.map((c) => {
          const counts = shoeCounts(rules.decks);
          for (const r of [...c.ranks, up]) counts[r] = (counts[r] as number) - 1;
          return { weight: c.weight, values: valuesWithCounts(c.ranks, up, rules, { ...allowed, split: false }, counts) };
        }),
      ),
    );
    return { kind, value, cells: values.map((v) => cellOf(v, rules, false)), values };
  };
  const pairRow = (rank: number): ChartRow => {
    const values = UPCARDS.map((up) => {
      const counts = shoeCounts(rules.decks);
      for (const r of [rank, rank, up]) counts[r] = (counts[r] as number) - 1;
      return valuesWithCounts([rank, rank], up, rules, allowed, counts);
    });
    const cells = values.map((v, i) => {
      const cell = cellOf(v, rules, true);
      if (cell !== 'P' || rules.das === 'no') return cell;
      // Mark splits that are right only because doubling after a split is allowed.
      const up = UPCARDS[i] as number;
      const counts = shoeCounts(rules.decks);
      for (const r of [rank, rank, up]) counts[r] = (counts[r] as number) - 1;
      const noDas = valuesWithCounts([rank, rank], up, { ...rules, das: 'no' }, allowed, counts);
      return bestMove(noDas) === 'split' ? 'P' : 'Ph';
    });
    return { kind: 'pair', value: rank, cells, values };
  };
  const chart: Chart = { hard: HARD_ROWS.map((v) => row('hard', v)), soft: SOFT_ROWS.map((v) => row('soft', v)), pairs: PAIR_ROWS.map(pairRow) };
  chartCache.set(key, chart);
  return chart;
}

/** The chart row and column for a hand against an up-card. */
export function chartCell(chart: Chart, cards: readonly Card[], up: Card, pairOk: boolean): { row: ChartRow; col: number } | null {
  const col = UPCARDS.indexOf(rankIndex(up));
  const ranks = cards.map(rankIndex);
  if (pairOk && cards.length === 2 && ranks[0] === ranks[1]) {
    const row = chart.pairs.find((r) => r.value === ranks[0]);
    return row ? { row, col } : null;
  }
  const t = handTotal(cards);
  if (t.soft) {
    const row = chart.soft.find((r) => r.value === Math.min(20, Math.max(13, t.total)));
    return row && t.total < 21 ? { row, col } : null;
  }
  const row = chart.hard.find((r) => r.value === Math.min(19, Math.max(5, t.total)));
  return row && t.total < 21 ? { row, col } : null;
}

/**
 * The basic-strategy move for a hand, following the chart with its fallbacks for what is allowed
 * here (no double on three cards, no surrender after a hit, and so on).
 */
export function basicMove(chart: Chart, cards: readonly Card[], up: Card, can: { readonly double: boolean; readonly split: boolean; readonly surrender: boolean; readonly hit: boolean }, das: boolean): Move {
  const t = handTotal(cards);
  if (t.total >= 21) return 'stand';
  if (!can.hit) return can.split && cards.length === 2 && rankIndex(cards[0] as Card) === rankIndex(cards[1] as Card) && chartCell(chart, cards, up, true)?.row.cells[UPCARDS.indexOf(rankIndex(up))]?.startsWith('P') ? 'split' : 'stand';
  const pairCell = can.split ? chartCell(chart, cards, up, true) : null;
  if (pairCell && pairCell.row.kind === 'pair') {
    const cell = pairCell.row.cells[pairCell.col] as Cell;
    if (cell === 'P' || (cell === 'Ph' && das)) return 'split';
    if (cell === 'Rp') return can.surrender ? 'surrender' : 'split';
  }
  const found = chartCell(chart, cards, up, false);
  if (!found) return 'stand';
  const cell = found.row.cells[found.col] as Cell;
  switch (cell) {
    case 'H':
      return 'hit';
    case 'S':
      return 'stand';
    case 'Dh':
      return can.double ? 'double' : 'hit';
    case 'Ds':
      return can.double ? 'double' : 'stand';
    case 'Rh':
      return can.surrender ? 'surrender' : 'hit';
    case 'Rs':
      return can.surrender ? 'surrender' : 'stand';
    default:
      return 'hit';
  }
}

/** The house edge of insurance against an ace: the value of a unit insured, with these cards out. */
export function insuranceValue(removed: readonly Card[], decks: number): number {
  const counts = shoeCounts(decks);
  for (const c of removed) counts[rankIndex(c)] = Math.max(0, (counts[rankIndex(c)] as number) - 1);
  const n = counts.reduce((a, b) => a + b, 0);
  const tens = (counts[10] as number) / n;
  return 2 * tens - (1 - tens);
}

/** Hi-Lo: 2 to 6 count +1, 7 to 9 nothing, tens and aces -1. */
export function hiLo(card: Card): number {
  const r = rankIndex(card);
  if (r >= 2 && r <= 6) return 1;
  if (r === 1 || r === 10) return -1;
  return 0;
}
