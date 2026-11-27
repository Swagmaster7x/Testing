/**
 * Winning shapes, for every style (docs/rules/mahjong-core.md): n sets and a pair (n is four for
 * 13-tile hands, five for 16), seven pairs and thirteen orphans. Hands are counts of the 34
 * playing kinds; declared melds are counted separately.
 */
import type { Kind } from './tiles';
import { isHonour, ORPHANS, PLAYING_KINDS, rankOf, SUIT_KINDS } from './tiles';

export interface ShapeRules {
  readonly sevenPairs: boolean;
  readonly thirteenOrphans: boolean;
}

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

/** Seven different pairs (fourteen concealed tiles). */
export function isSevenPairs(counts: readonly number[]): boolean {
  let pairs = 0;
  for (let k = 0; k < PLAYING_KINDS; k++) {
    const n = counts[k] ?? 0;
    if (n === 2) pairs++;
    else if (n !== 0) return false;
  }
  return pairs === 7;
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
  if (melds === 0 && setsNeeded === 4) {
    if (shapes.sevenPairs && isSevenPairs(counts)) return true;
    if (shapes.thirteenOrphans && isThirteenOrphans(counts)) return true;
  }
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
