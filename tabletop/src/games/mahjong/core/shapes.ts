/**
 * Winning shapes, for every style (docs/rules/mahjong-core.md): n sets and a pair (n is four for
 * 13-tile hands, five for 16), seven pairs and thirteen orphans, and the shapes a style may add:
 * knitted shapes (Chinese Official) and seven pairs with a pung (Taiwanese). Hands are counts of
 * the 34 playing kinds; declared melds are counted separately.
 */
import type { Kind } from './tiles';
import { isHonour, ORPHANS, PLAYING_KINDS, rankOf, SUIT_KINDS } from './tiles';

export interface ShapeRules {
  readonly sevenPairs: boolean;
  readonly thirteenOrphans: boolean;
  /** Seven pairs may use four alike as two pairs (Chinese Official). */
  readonly sevenPairsFours?: boolean;
  /**
   * Knitted shapes (Chinese Official): a knitted straight (1-4-7, 2-5-8 and 3-6-9, one run in each
   * suit) standing for three sets, and honours and knitted tiles (fourteen different tiles from one
   * knitted set and the seven honours).
   */
  readonly knitted?: boolean;
  /** Seven pairs and a pung, closed, in a hand of sixteen tiles and the winning one (Taiwanese). */
  readonly pairsAndPung?: boolean;
}

/** The six knitted sets: 1-4-7 of one suit, 2-5-8 of another and 3-6-9 of the third. */
export const KNITTED: readonly (readonly Kind[])[] = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
].map(([a = 0, b = 0, c = 0]) => [a * 9, a * 9 + 3, a * 9 + 6, b * 9 + 1, b * 9 + 4, b * 9 + 7, c * 9 + 2, c * 9 + 5, c * 9 + 8]);

/** A set found in the concealed part: a chow (by its lowest tile) or a pung. */
export interface ConcealedSet {
  readonly type: 'chow' | 'pung';
  readonly kind: Kind;
}

/** One way to read a concealed part as sets and a pair. */
export interface Arrangement {
  readonly pair: Kind;
  readonly sets: readonly ConcealedSet[];
}

function total(counts: readonly number[]): number {
  let n = 0;
  for (let k = 0; k < PLAYING_KINDS; k++) n += counts[k] ?? 0;
  return n;
}

/**
 * True when the counts split into sets only (no pair). Within a suit, at the lowest rank with
 * tiles, three of a kind can always be taken as a pung (three equal chows use the same tiles), and
 * whatever is left there must start chows.
 */
function allSets(c: number[]): boolean {
  for (let suit = 0; suit < 3; suit++) {
    const base = suit * 9;
    const a = c.slice(base, base + 9);
    for (let r = 0; r < 9; r++) {
      const n = a[r] ?? 0;
      if (n === 0) continue;
      const chows = n % 3;
      if (chows === 0) continue;
      if (r > 6) return false;
      if ((a[r + 1] ?? 0) < chows || (a[r + 2] ?? 0) < chows) return false;
      a[r + 1] = (a[r + 1] ?? 0) - chows;
      a[r + 2] = (a[r + 2] ?? 0) - chows;
    }
  }
  for (let k = SUIT_KINDS; k < PLAYING_KINDS; k++) if ((c[k] ?? 0) % 3 !== 0) return false;
  return true;
}

/** True when the concealed counts are `sets` sets and a pair. */
export function isStandardComplete(counts: readonly number[], sets: number): boolean {
  if (total(counts) !== sets * 3 + 2) return false;
  for (let k = 0; k < PLAYING_KINDS; k++) {
    if ((counts[k] ?? 0) < 2) continue;
    const c = [...counts];
    c[k] = (c[k] ?? 0) - 2;
    if (allSets(c)) return true;
  }
  return false;
}

/** Seven different pairs (fourteen concealed tiles); with `fours`, four alike count as two pairs. */
export function isSevenPairs(counts: readonly number[], fours = false): boolean {
  let pairs = 0;
  for (let k = 0; k < PLAYING_KINDS; k++) {
    const n = counts[k] ?? 0;
    if (n === 2) pairs++;
    else if (n === 4 && fours) pairs += 2;
    else if (n !== 0) return false;
  }
  return pairs === 7;
}

/** The knitted set an honours-and-knitted hand is drawn from (fourteen different tiles), or null. */
export function honoursKnittedSet(counts: readonly number[]): readonly Kind[] | null {
  if (total(counts) !== 14) return null;
  for (const set of KNITTED) {
    let ok = true;
    for (let k = 0; k < PLAYING_KINDS && ok; k++) {
      const n = counts[k] ?? 0;
      if (n === 0) continue;
      if (n > 1 || (!isHonour(k) && !set.includes(k))) ok = false;
    }
    if (ok) return set;
  }
  return null;
}

/** The knitted sets a concealed part holds in full (at least one of each of the nine tiles). */
export function knittedIn(counts: readonly number[]): (readonly Kind[])[] {
  return KNITTED.filter((set) => set.every((k) => (counts[k] ?? 0) >= 1));
}

/** Seven different pairs and a pung of another kind (seventeen concealed tiles). */
export function isPairsAndPung(counts: readonly number[]): boolean {
  let pairs = 0;
  let pungs = 0;
  for (let k = 0; k < PLAYING_KINDS; k++) {
    const n = counts[k] ?? 0;
    if (n === 2) pairs++;
    else if (n === 3) pungs++;
    else if (n !== 0) return false;
  }
  return pairs === 7 && pungs === 1;
}

/** One of each terminal and honour, and one more of any of them. */
export function isThirteenOrphans(counts: readonly number[]): boolean {
  if (total(counts) !== 14) return false;
  let pair = false;
  for (const k of ORPHANS) {
    const n = counts[k] ?? 0;
    if (n === 0 || n > 2) return false;
    if (n === 2) pair = true;
  }
  return pair;
}

/** True when the concealed part, beside `melds` declared sets, is a winning shape. */
export function isWinningShape(counts: readonly number[], melds: number, shapes: ShapeRules, setsNeeded: number): boolean {
  if (isStandardComplete(counts, setsNeeded - melds)) return true;
  if (shapes.knitted && setsNeeded - melds >= 3) {
    // A knitted straight stands for three sets; the rest is sets and a pair.
    for (const set of knittedIn(counts)) {
      const c = [...counts];
      for (const k of set) c[k] = (c[k] ?? 0) - 1;
      if (isStandardComplete(c, setsNeeded - melds - 3)) return true;
    }
  }
  if (melds === 0 && setsNeeded === 4) {
    if (shapes.sevenPairs && isSevenPairs(counts, shapes.sevenPairsFours ?? false)) return true;
    if (shapes.thirteenOrphans && isThirteenOrphans(counts)) return true;
    if (shapes.knitted && honoursKnittedSet(counts) !== null) return true;
  }
  if (melds === 0 && setsNeeded === 5 && shapes.pairsAndPung && isPairsAndPung(counts)) return true;
  return false;
}

/** The kinds that complete a concealed part of 3k+1 tiles (whether or not any copy is left). */
export function waitsOf(counts: readonly number[], melds: number, shapes: ShapeRules, setsNeeded: number): Kind[] {
  const out: Kind[] = [];
  const c = [...counts];
  for (let k = 0; k < PLAYING_KINDS; k++) {
    if ((c[k] ?? 0) >= 4) continue;
    c[k] = (c[k] ?? 0) + 1;
    if (isWinningShape(c, melds, shapes, setsNeeded)) out.push(k);
    c[k] = (c[k] ?? 0) - 1;
  }
  return out;
}

function setsOnly(c: number[], out: ConcealedSet[], found: ConcealedSet[][]): void {
  let k = 0;
  while (k < PLAYING_KINDS && (c[k] ?? 0) === 0) k++;
  if (k === PLAYING_KINDS) {
    found.push([...out]);
    return;
  }
  const n = c[k] ?? 0;
  if (n >= 3) {
    c[k] = n - 3;
    out.push({ type: 'pung', kind: k });
    setsOnly(c, out, found);
    out.pop();
    c[k] = n;
  }
  if (!isHonour(k) && k < SUIT_KINDS && rankOf(k) <= 7 && (c[k + 1] ?? 0) > 0 && (c[k + 2] ?? 0) > 0) {
    c[k] = n - 1;
    c[k + 1] = (c[k + 1] ?? 0) - 1;
    c[k + 2] = (c[k + 2] ?? 0) - 1;
    out.push({ type: 'chow', kind: k });
    setsOnly(c, out, found);
    out.pop();
    c[k] = n;
    c[k + 1] = (c[k + 1] ?? 0) + 1;
    c[k + 2] = (c[k + 2] ?? 0) + 1;
  }
}

/** Every way to read the concealed counts as `sets` sets and a pair, without repeats. */
export function arrangements(counts: readonly number[], sets: number): Arrangement[] {
  if (total(counts) !== sets * 3 + 2) return [];
  const out: Arrangement[] = [];
  const seen = new Set<string>();
  for (let k = 0; k < PLAYING_KINDS; k++) {
    if ((counts[k] ?? 0) < 2) continue;
    const c = [...counts];
    c[k] = (c[k] ?? 0) - 2;
    const found: ConcealedSet[][] = [];
    setsOnly(c, [], found);
    for (const list of found) {
      const sorted = [...list].sort((a, b) => a.kind - b.kind || a.type.localeCompare(b.type));
      const key = `${k}|${sorted.map((s) => `${s.type[0]}${s.kind}`).join(',')}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ pair: k, sets: sorted });
    }
  }
  return out;
}
