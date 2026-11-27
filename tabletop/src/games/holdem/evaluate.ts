/**
 * The hand evaluator: the best five-card hand from five, six or seven cards, as one number that
 * compares directly (higher is better). It works on card numbers (see cards.ts) with bit masks and
 * no tables beyond the straights, and is checked against `pokersolver` in the tests.
 *
 * The value is category << 20 then up to five ranks of four bits each, most important first:
 * category 8 straight flush, 7 four of a kind, 6 full house, 5 flush, 4 straight, 3 three of a
 * kind, 2 two pair, 1 one pair, 0 high card.
 */
import type { Card } from './cards';
import { cardIndex, RANKS } from './cards';

export const CATEGORY_NAMES = ['high-card', 'pair', 'two-pair', 'trips', 'straight', 'flush', 'full-house', 'quads', 'straight-flush'] as const;
export type Category = (typeof CATEGORY_NAMES)[number];

/** The highest card of a straight in a 13-bit rank mask, or -1 (the wheel A-2-3-4-5 is five high, 3). */
const STRAIGHT_HIGH = new Int8Array(8192).fill(-1);
for (let mask = 0; mask < 8192; mask++) {
  for (let high = 12; high >= 4; high--) {
    const need = 0x1f << (high - 4);
    if ((mask & need) === need) {
      STRAIGHT_HIGH[mask] = high;
      break;
    }
  }
  if (STRAIGHT_HIGH[mask] === -1 && (mask & 0x100f) === 0x100f) STRAIGHT_HIGH[mask] = 3;
}

const counts = new Int8Array(13);

function pack(category: number, r1 = 0, r2 = 0, r3 = 0, r4 = 0, r5 = 0): number {
  return (category << 20) | (r1 << 16) | (r2 << 12) | (r3 << 8) | (r4 << 4) | r5;
}

function topRanks(mask: number, n: number, out: number[]): void {
  for (let r = 12; r >= 0 && out.length < n; r--) if (mask & (1 << r)) out.push(r);
}

/** Evaluates card numbers (0 to 51). */
export function evaluateIndices(cards: readonly number[]): number {
  counts.fill(0);
  let s0 = 0;
  let s1 = 0;
  let s2 = 0;
  let s3 = 0;
  for (const c of cards) {
    const r = c >> 2;
    counts[r] = (counts[r] ?? 0) + 1;
    const bit = 1 << r;
    switch (c & 3) {
      case 0:
        s0 |= bit;
        break;
      case 1:
        s1 |= bit;
        break;
      case 2:
        s2 |= bit;
        break;
      default:
        s3 |= bit;
    }
  }
  const all = s0 | s1 | s2 | s3;
  // With seven cards a flush rules out four of a kind and a full house, so it is checked first.
  for (const suitMask of [s0, s1, s2, s3]) {
    if (popcount(suitMask) >= 5) {
      const sf = STRAIGHT_HIGH[suitMask] ?? -1;
      if (sf >= 0) return pack(8, sf);
      const top: number[] = [];
      topRanks(suitMask, 5, top);
      return pack(5, top[0], top[1], top[2], top[3], top[4]);
    }
  }
  let quad = -1;
  let trip = -1;
  let trip2 = -1;
  let pair1 = -1;
  let pair2 = -1;
  for (let r = 12; r >= 0; r--) {
    const n = counts[r] ?? 0;
    if (n === 4) quad = r;
    else if (n === 3) {
      if (trip < 0) trip = r;
      else if (trip2 < 0) trip2 = r;
    } else if (n === 2) {
      if (pair1 < 0) pair1 = r;
      else if (pair2 < 0) pair2 = r;
    }
  }
  if (quad >= 0) {
    const rest: number[] = [];
    topRanks(all & ~(1 << quad), 1, rest);
    return pack(7, quad, rest[0]);
  }
  if (trip >= 0 && (trip2 >= 0 || pair1 >= 0)) return pack(6, trip, Math.max(trip2, pair1));
  const straight = STRAIGHT_HIGH[all] ?? -1;
  if (straight >= 0) return pack(4, straight);
  if (trip >= 0) {
    const rest: number[] = [];
    topRanks(all & ~(1 << trip), 2, rest);
    return pack(3, trip, rest[0], rest[1]);
  }
  if (pair1 >= 0 && pair2 >= 0) {
    const rest: number[] = [];
    topRanks(all & ~(1 << pair1) & ~(1 << pair2), 1, rest);
    return pack(2, pair1, pair2, rest[0]);
  }
  if (pair1 >= 0) {
    const rest: number[] = [];
    topRanks(all & ~(1 << pair1), 3, rest);
    return pack(1, pair1, rest[0], rest[1], rest[2]);
  }
  const top: number[] = [];
  topRanks(all, 5, top);
  return pack(0, top[0], top[1], top[2], top[3], top[4]);
}

function popcount(m: number): number {
  let x = m;
  let c = 0;
  while (x) {
    x &= x - 1;
    c++;
  }
  return c;
}

export function evaluate(cards: readonly Card[]): number {
  return evaluateIndices(cards.map(cardIndex));
}

export function categoryOf(value: number): Category {
  return CATEGORY_NAMES[value >> 20] ?? 'high-card';
}

/** The ranks in a value, most important first (for naming a hand). */
export function ranksOf(value: number): number[] {
  return [(value >> 16) & 15, (value >> 12) & 15, (value >> 8) & 15, (value >> 4) & 15, value & 15];
}

/** A short code naming a hand, for the text catalogue: category and the ranks that matter. */
export function handNameParts(value: number): { category: Category; ranks: string[] } {
  const category = categoryOf(value);
  const r = ranksOf(value).map((x) => RANKS[x] as string);
  const used: Record<Category, number> = { 'high-card': 1, pair: 1, 'two-pair': 2, trips: 1, straight: 1, flush: 1, 'full-house': 2, quads: 1, 'straight-flush': 1 };
  return { category, ranks: r.slice(0, used[category]) };
}
