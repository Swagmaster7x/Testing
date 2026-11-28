/**
 * Every reading of a winning hand, for scorers (docs/rules/mahjong-core.md). Declared melds are
 * fixed; the concealed part is read every possible way, and for each reading the set (or pair)
 * the winning tile completed is marked. A set completed by a discard counts as exposed. A scorer
 * scores each reading and keeps the best, as a player arranges the hand to score most.
 */
import { arrangements, honoursKnittedSet, isPairsAndPung, isSevenPairs, isThirteenOrphans, knittedIn } from './shapes';
import type { ShapeRules } from './shapes';
import type { Meld, WinContext } from './style';
import type { Kind } from './tiles';
import { countsOfKinds, kindOf } from './tiles';

export interface HandSet {
  readonly type: 'chow' | 'pung' | 'kong';
  /** A chow's lowest tile, or the kind of a pung or kong. */
  readonly kind: Kind;
  /** Concealed for scoring: in the hand and not completed by a discard, or a concealed kong. */
  readonly concealed: boolean;
  /** Laid down on the table. */
  readonly melded: boolean;
}

export interface WinShape {
  /** Knitted shapes and pairs with a pung appear only in styles whose shape rules allow them. */
  readonly shape: 'standard' | 'seven-pairs' | 'thirteen-orphans' | 'knitted-straight' | 'honours-knitted' | 'pairs-and-pung';
  /** A knitted straight's other sets (beside the three the knitted tiles stand for); pairs and a pung: the pung. */
  readonly sets: readonly HandSet[];
  readonly pair: Kind | null;
  /** Seven pairs (four alike listed twice where a style allows it), and the pairs beside a pung. */
  readonly pairs: readonly Kind[];
  /** Where the winning tile sits: a set's index, -1 for the pair, -2 for a special shape, -3 for the knitted tiles. */
  readonly winIn: number;
  /** Knitted shapes: the nine kinds of the knitted set. */
  readonly knitted?: readonly Kind[];
}

export function meldSet(meld: Meld): HandSet {
  const kinds = meld.tiles.map(kindOf);
  return { type: meld.type, kind: Math.min(...kinds), concealed: meld.concealed, melded: true };
}

/** Every reading of the winning hand under the style's shapes (empty when it is not complete). */
export function winShapes(ctx: WinContext, shapes: ShapeRules, setsNeeded: number): WinShape[] {
  const counts = countsOfKinds(ctx.concealed);
  const melded = ctx.melds.map(meldSet);
  const out: WinShape[] = [];
  const seen = new Set<string>();
  const add = (shape: WinShape) => {
    const key = `${shape.shape}|${shape.pair ?? ''}|${shape.pairs.join(',')}|${shape.winIn}|${(shape.knitted ?? []).join(',')}|${shape.sets.map((s) => `${s.type}${s.kind}${s.concealed ? 'c' : 'o'}${s.melded ? 'm' : ''}`).join(',')}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(shape);
  };
  for (const a of arrangements(counts, setsNeeded - ctx.melds.length)) {
    const inHand: HandSet[] = a.sets.map((s) => ({ type: s.type, kind: s.kind, concealed: true, melded: false }));
    const base = [...melded, ...inHand];
    const holds = (s: HandSet) => (s.type === 'chow' ? ctx.tile >= s.kind && ctx.tile <= s.kind + 2 : s.kind === ctx.tile);
    // The winning tile completed one concealed set or the pair.
    base.forEach((s, i) => {
      if (s.melded || !holds(s)) return;
      const sets = base.map((x, j) => (j === i && !ctx.selfDrawn ? { ...x, concealed: false } : x));
      add({ shape: 'standard', sets, pair: a.pair, pairs: [], winIn: i });
    });
    if (a.pair === ctx.tile) add({ shape: 'standard', sets: base, pair: a.pair, pairs: [], winIn: -1 });
  }
  if (shapes.knitted && setsNeeded - ctx.melds.length >= 3) {
    // A knitted straight: the nine knitted tiles, then sets and a pair from the rest.
    for (const set of knittedIn(counts)) {
      const rest = [...counts];
      for (const k of set) rest[k] = (rest[k] ?? 0) - 1;
      for (const a of arrangements(rest, setsNeeded - ctx.melds.length - 3)) {
        const inHand: HandSet[] = a.sets.map((s) => ({ type: s.type, kind: s.kind, concealed: true, melded: false }));
        const base = [...melded, ...inHand];
        const holds = (s: HandSet) => (s.type === 'chow' ? ctx.tile >= s.kind && ctx.tile <= s.kind + 2 : s.kind === ctx.tile);
        const knit = { shape: 'knitted-straight' as const, pair: a.pair, pairs: [], knitted: set };
        if (set.includes(ctx.tile)) add({ ...knit, sets: base, winIn: -3 });
        base.forEach((s, i) => {
          if (s.melded || !holds(s)) return;
          add({ ...knit, sets: base.map((x, j) => (j === i && !ctx.selfDrawn ? { ...x, concealed: false } : x)), winIn: i });
        });
        if (a.pair === ctx.tile) add({ ...knit, sets: base, winIn: -1 });
      }
    }
  }
  if (ctx.melds.length === 0 && setsNeeded === 4) {
    if (shapes.sevenPairs && isSevenPairs(counts, shapes.sevenPairsFours ?? false)) {
      const pairs: Kind[] = [];
      counts.forEach((n, k) => {
        for (let i = 0; i < Math.floor(n / 2); i++) pairs.push(k);
      });
      add({ shape: 'seven-pairs', sets: [], pair: null, pairs, winIn: -2 });
    }
    if (shapes.thirteenOrphans && isThirteenOrphans(counts)) add({ shape: 'thirteen-orphans', sets: [], pair: null, pairs: [], winIn: -2 });
    const knit = shapes.knitted ? honoursKnittedSet(counts) : null;
    if (knit) add({ shape: 'honours-knitted', sets: [], pair: null, pairs: [], winIn: -2, knitted: knit });
  }
  if (ctx.melds.length === 0 && setsNeeded === 5 && shapes.pairsAndPung && isPairsAndPung(counts)) {
    const pairs: Kind[] = [];
    let pung = 0;
    counts.forEach((n, k) => {
      if (n === 2) pairs.push(k);
      if (n === 3) pung = k;
    });
    add({ shape: 'pairs-and-pung', sets: [{ type: 'pung', kind: pung, concealed: ctx.selfDrawn || ctx.tile !== pung, melded: false }], pair: null, pairs, winIn: -2 });
  }
  return out;
}

/** Every kind in the hand: the concealed tiles and the melds. */
export function allKinds(ctx: WinContext): Kind[] {
  return [...ctx.concealed, ...ctx.melds.flatMap((m) => m.tiles.map(kindOf))];
}
