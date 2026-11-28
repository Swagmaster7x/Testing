/**
 * Tiles from ready (shanten) and tile acceptance, for every style (docs/rules/mahjong-core.md).
 *
 * The shanten number counts how many tile changes a hand needs before it is ready (one tile from
 * winning): 0 is ready, -1 is complete. For n sets and a pair it is 2n - 2m - t - p, where m is
 * the complete sets, t the partial sets (a pair or two tiles of a run, at most n - m of them
 * counted) and p is 1 when a pair is kept as the head, taken at the best reading of the hand.
 * Seven pairs and thirteen orphans have their own counts. Acceptance is the tiles that lower the
 * number, counted by the copies the player has not seen. The tests check both against the
 * `syanten` package.
 */
import type { ShapeRules } from './shapes';
import { KNITTED } from './shapes';
import type { Kind } from './tiles';
import { ORPHANS, PLAYING_KINDS, SUIT_KINDS } from './tiles';

/** Best partial-set count for each number of complete sets (index), or -1 when unreachable. */
type Front = Int8Array;

const MAX_SETS = 5;
const suitCache = new Map<number, Front>();
const CACHE_LIMIT = 300_000;

function suitKey(c: readonly number[], base: number): number {
  let key = 0;
  for (let r = 0; r < 9; r++) key = key * 5 + (c[base + r] ?? 0);
  return key;
}

function suitFront(c: readonly number[], base: number): Front {
  const key = suitKey(c, base);
  const hit = suitCache.get(key);
  if (hit) return hit;
  const a: number[] = [];
  for (let r = 0; r < 9; r++) a.push(c[base + r] ?? 0);
  const best = new Int8Array(MAX_SETS + 1).fill(-1);
  const dfs = (i: number, m: number, t: number): void => {
    while (i < 9 && (a[i] ?? 0) === 0) i++;
    if (i === 9) {
      if (m <= MAX_SETS && t > (best[m] ?? -1)) best[m] = t;
      return;
    }
    const n = a[i] ?? 0;
    if (n >= 3) {
      a[i] = n - 3;
      dfs(i, m + 1, t);
      a[i] = n;
    }
    if (i <= 6 && (a[i + 1] ?? 0) > 0 && (a[i + 2] ?? 0) > 0) {
      a[i] = n - 1;
      a[i + 1] = (a[i + 1] ?? 0) - 1;
      a[i + 2] = (a[i + 2] ?? 0) - 1;
      dfs(i, m + 1, t);
      a[i] = n;
      a[i + 1] = (a[i + 1] ?? 0) + 1;
      a[i + 2] = (a[i + 2] ?? 0) + 1;
    }
    if (n >= 2) {
      a[i] = n - 2;
      dfs(i, m, t + 1);
      a[i] = n;
    }
    if (i <= 7 && (a[i + 1] ?? 0) > 0) {
      a[i] = n - 1;
      a[i + 1] = (a[i + 1] ?? 0) - 1;
      dfs(i, m, t + 1);
      a[i] = n;
      a[i + 1] = (a[i + 1] ?? 0) + 1;
    }
    if (i <= 6 && (a[i + 2] ?? 0) > 0) {
      a[i] = n - 1;
      a[i + 2] = (a[i + 2] ?? 0) - 1;
      dfs(i, m, t + 1);
      a[i] = n;
      a[i + 2] = (a[i + 2] ?? 0) + 1;
    }
    // Leave one tile here on its own.
    a[i] = n - 1;
    dfs(i, m, t);
    a[i] = n;
  };
  dfs(0, 0, 0);
  if (suitCache.size >= CACHE_LIMIT) suitCache.clear();
  suitCache.set(key, best);
  return best;
}

function honourFront(c: readonly number[]): Front {
  let m = 0;
  let t = 0;
  for (let k = SUIT_KINDS; k < PLAYING_KINDS; k++) {
    const n = c[k] ?? 0;
    if (n >= 3) m++;
    else if (n === 2) t++;
  }
  const out = new Int8Array(MAX_SETS + 1).fill(-1);
  if (m <= MAX_SETS) out[m] = t;
  // Fewer sets are reachable too (a set read as a pair and a single never helps, but keeps the front complete).
  for (let k = m - 1; k >= 0; k--) out[k] = Math.max(out[k] ?? -1, t + (m - k));
  return out;
}

function combine(a: Front, b: Front): Front {
  const out = new Int8Array(MAX_SETS + 1).fill(-1);
  for (let i = 0; i <= MAX_SETS; i++) {
    const ti = a[i] ?? -1;
    if (ti < 0) continue;
    for (let j = 0; i + j <= MAX_SETS; j++) {
      const tj = b[j] ?? -1;
      if (tj < 0) continue;
      if (ti + tj > (out[i + j] ?? -1)) out[i + j] = ti + tj;
    }
  }
  return out;
}

function bestOf(c: readonly number[], need: number, head: number): number {
  const f = combine(combine(combine(suitFront(c, 0), suitFront(c, 9)), suitFront(c, 18)), honourFront(c));
  let best = 99;
  for (let m = 0; m <= Math.min(need, MAX_SETS); m++) {
    const t = f[m] ?? -1;
    if (t < 0) continue;
    const s = 2 * need - 2 * m - Math.min(t, need - m) - head;
    if (s < best) best = s;
  }
  return best;
}

/** Shanten for n sets and a pair, where `need` sets are still to be made in the concealed part. */
export function shantenStandard(counts: readonly number[], need: number): number {
  let best = bestOf(counts, need, 0);
  const c = [...counts];
  for (let k = 0; k < PLAYING_KINDS; k++) {
    if ((c[k] ?? 0) < 2) continue;
    c[k] = (c[k] ?? 0) - 2;
    const s = bestOf(c, need, 1);
    c[k] = (c[k] ?? 0) + 2;
    if (s < best) best = s;
  }
  return best;
}

/** Shanten for seven pairs (no melds); with `four`, four of a kind counts as two pairs. */
export function shantenSevenPairs(counts: readonly number[], four = false): number {
  let pairs = 0;
  let kinds = 0;
  for (let k = 0; k < PLAYING_KINDS; k++) {
    const n = counts[k] ?? 0;
    if (n >= 1) kinds++;
    if (four) pairs += Math.floor(n / 2);
    else if (n >= 2) pairs++;
  }
  return four ? 6 - pairs : 6 - pairs + Math.max(0, 7 - kinds);
}

/** Shanten for thirteen orphans (no melds). */
export function shantenOrphans(counts: readonly number[]): number {
  let kinds = 0;
  let pair = 0;
  for (const k of ORPHANS) {
    const n = counts[k] ?? 0;
    if (n >= 1) kinds++;
    if (n >= 2) pair = 1;
  }
  return 13 - kinds - pair;
}

/** Shanten for honours and knitted tiles (no melds): fourteen different tiles from one knitted set and the honours. */
export function shantenHonoursKnitted(counts: readonly number[]): number {
  let honours = 0;
  for (let k = SUIT_KINDS; k < PLAYING_KINDS; k++) if ((counts[k] ?? 0) > 0) honours++;
  let best = 0;
  for (const set of KNITTED) best = Math.max(best, honours + set.filter((k) => (counts[k] ?? 0) > 0).length);
  return 13 - Math.min(14, best);
}

/** Shanten for a knitted straight with `need` sets to make in the concealed part (three of them the knitted tiles). */
export function shantenKnittedStraight(counts: readonly number[], need: number): number {
  let best = 99;
  for (const set of KNITTED) {
    const c = [...counts];
    let missing = 0;
    for (const k of set) {
      if ((c[k] ?? 0) > 0) c[k] = (c[k] ?? 0) - 1;
      else missing++;
    }
    best = Math.min(best, shantenStandard(c, need - 3) + missing);
  }
  return best;
}

/** Shanten for seven pairs and a pung (no melds, sixteen tiles and the winning one): the tiles still missing, less one. */
export function shantenPairsAndPung(counts: readonly number[]): number {
  let best = 99;
  for (let p = 0; p < PLAYING_KINDS; p++) {
    const lack = Math.max(0, 3 - (counts[p] ?? 0));
    const pairLack: number[] = [];
    for (let k = 0; k < PLAYING_KINDS; k++) if (k !== p) pairLack.push(Math.max(0, 2 - (counts[k] ?? 0)));
    pairLack.sort((a, b) => a - b);
    const missing = lack + pairLack.slice(0, 7).reduce((a, b) => a + b, 0);
    best = Math.min(best, missing - 1);
  }
  return best;
}

export interface ShantenRules {
  readonly shapes: ShapeRules;
  /** Sets in a complete hand: four for 13 tiles, five for 16. */
  readonly sets: number;
}

/** The hand's shanten over every shape the style allows. */
export function shanten(counts: readonly number[], melds: number, rules: ShantenRules): number {
  let s = shantenStandard(counts, rules.sets - melds);
  if (melds === 0 && rules.sets === 4) {
    if (rules.shapes.sevenPairs) s = Math.min(s, shantenSevenPairs(counts, rules.shapes.sevenPairsFours ?? false));
    if (rules.shapes.thirteenOrphans) s = Math.min(s, shantenOrphans(counts));
    if (rules.shapes.knitted) s = Math.min(s, shantenHonoursKnitted(counts));
  }
  if (rules.shapes.knitted && rules.sets - melds >= 3) s = Math.min(s, shantenKnittedStraight(counts, rules.sets - melds));
  if (melds === 0 && rules.sets === 5 && rules.shapes.pairsAndPung) s = Math.min(s, shantenPairsAndPung(counts));
  return s;
}

export interface Acceptance {
  readonly shanten: number;
  /** Kinds that lower the shanten, whether or not a copy is left. */
  readonly kinds: readonly Kind[];
  /** Unseen copies of those kinds. */
  readonly count: number;
}

/**
 * The tiles that would bring a concealed part of 3k+1 tiles closer to winning. `unseen` gives the
 * copies of each kind the player has not seen; four less the hand's own when absent.
 */
export function acceptance(counts: readonly number[], melds: number, rules: ShantenRules, unseen?: readonly number[]): Acceptance {
  const now = shanten(counts, melds, rules);
  const c = [...counts];
  const kinds: Kind[] = [];
  let count = 0;
  for (let k = 0; k < PLAYING_KINDS; k++) {
    if ((c[k] ?? 0) >= 4) continue;
    c[k] = (c[k] ?? 0) + 1;
    const s = shanten(c, melds, rules);
    c[k] = (c[k] ?? 0) - 1;
    if (s < now) {
      kinds.push(k);
      count += unseen ? Math.max(0, unseen[k] ?? 0) : 4 - (counts[k] ?? 0);
    }
  }
  return { shanten: now, kinds, count };
}

export interface DiscardChoice extends Acceptance {
  readonly kind: Kind;
}

/** Every discard from a concealed part of 3k+2 tiles, best first: the lowest shanten, then the most tiles accepted. */
export function discardChoices(counts: readonly number[], melds: number, rules: ShantenRules, unseen?: readonly number[]): DiscardChoice[] {
  const out: DiscardChoice[] = [];
  const c = [...counts];
  for (let k = 0; k < PLAYING_KINDS; k++) {
    if ((c[k] ?? 0) === 0) continue;
    c[k] = (c[k] ?? 0) - 1;
    out.push({ kind: k, ...acceptance(c, melds, rules, unseen) });
    c[k] = (c[k] ?? 0) + 1;
  }
  return out.sort((a, b) => a.shanten - b.shanten || b.count - a.count || a.kind - b.kind);
}

/** One reading of a hand for n sets and a pair: what the shanten number counts. */
export interface Reading {
  /** Complete sets: chows by their lowest kind, pungs by their kind. */
  readonly sets: readonly { readonly type: 'chow' | 'pung'; readonly kind: Kind }[];
  /** Partial sets: two tiles of a run, or a pair waiting for a third. */
  readonly partials: readonly (readonly [Kind, Kind])[];
  readonly pair: Kind | null;
  /** Tiles that belong to nothing yet. */
  readonly loose: readonly Kind[];
  readonly shanten: number;
}

/**
 * The best reading of the concealed part for `need` sets and a pair, found by a plain search over
 * every way to group the tiles. Slower than `shantenStandard`; used to explain a hand, and in the
 * tests as a second implementation.
 */
export function bestReading(counts: readonly number[], need: number): Reading {
  const c = [...counts];
  let best: Reading | null = null;
  const sets: { type: 'chow' | 'pung'; kind: Kind }[] = [];
  const partials: [Kind, Kind][] = [];
  const loose: Kind[] = [];
  let pair: Kind | null = null;
  const value = () => 2 * need - 2 * sets.length - Math.min(partials.length, need - sets.length) - (pair === null ? 0 : 1);
  const dfs = (k: number): void => {
    while (k < PLAYING_KINDS && (c[k] ?? 0) === 0) k++;
    if (k === PLAYING_KINDS) {
      if (sets.length > need) return;
      const v = value();
      if (!best || v < best.shanten) best = { sets: [...sets], partials: partials.map((p) => [...p] as [Kind, Kind]), pair, loose: [...loose], shanten: v };
      return;
    }
    const suited = k < SUIT_KINDS;
    const r = suited ? k % 9 : -1;
    const n = c[k] ?? 0;
    const tryWith = (take: readonly Kind[], apply: () => void, undo: () => void) => {
      if (take.some((x) => (c[x] ?? 0) <= 0)) return;
      const used = new Map<Kind, number>();
      for (const x of take) used.set(x, (used.get(x) ?? 0) + 1);
      for (const [x, m] of used) if ((c[x] ?? 0) < m) return;
      for (const x of take) c[x] = (c[x] ?? 0) - 1;
      apply();
      dfs(k);
      undo();
      for (const x of take) c[x] = (c[x] ?? 0) + 1;
    };
    if (n >= 3) tryWith([k, k, k], () => sets.push({ type: 'pung', kind: k }), () => sets.pop());
    if (suited && r <= 6) tryWith([k, k + 1, k + 2], () => sets.push({ type: 'chow', kind: k }), () => sets.pop());
    if (n >= 2 && pair === null) tryWith([k, k], () => (pair = k), () => (pair = null));
    if (n >= 2) tryWith([k, k], () => partials.push([k, k]), () => partials.pop());
    if (suited && r <= 7) tryWith([k, k + 1], () => partials.push([k, k + 1]), () => partials.pop());
    if (suited && r <= 6) tryWith([k, k + 2], () => partials.push([k, k + 2]), () => partials.pop());
    tryWith([k], () => loose.push(k), () => loose.pop());
  };
  dfs(0);
  return best ?? { sets: [], partials: [], pair: null, loose: [], shanten: 2 * need };
}

/** Copies of each kind not seen by a player: four less those in `seen`. */
export function unseenCounts(seen: readonly number[]): number[] {
  const out = new Array<number>(PLAYING_KINDS).fill(0);
  for (let k = 0; k < PLAYING_KINDS; k++) out[k] = Math.max(0, 4 - (seen[k] ?? 0));
  return out;
}
