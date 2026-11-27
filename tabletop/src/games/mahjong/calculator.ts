/**
 * The Mahjong score calculator (milestone 16, Tools): a hand written down after a game at a real
 * table, scored by the same rules file the table plays with, and settled the same way. Pure
 * functions; the screen is `ui/Calculator.tsx`.
 */
import type { Seat } from '../../core/contract';
import type { HandScore, Meld, Style, StyleOptions, WinContext } from './core/style';
import type { Kind } from './core/tiles';
import { isBonus, isSuited, rankOf, tileId } from './core/tiles';

export interface CalcSet {
  readonly type: 'chow' | 'pung' | 'kong';
  /** The lowest tile of a chow, or the tile of a pung or kong. */
  readonly kind: Kind;
  /** A kong declared from the hand (still concealed for scoring). */
  readonly concealed: boolean;
}

export interface CalcInput {
  /** Tiles still in the hand, the winning tile among them. */
  readonly hand: readonly Kind[];
  /** Index into `hand` of the winning tile. */
  readonly winning: number;
  readonly sets: readonly CalcSet[];
  /** 0 East to 3 North. */
  readonly seatWind: number;
  readonly prevailingWind: number;
  /** Who discarded the winning tile, counted from the winner (1 next in turn, 2 across, 3 before); null when self-drawn. */
  readonly from: 1 | 2 | 3 | null;
  readonly bonus: readonly Kind[];
  readonly lastTile: boolean;
  readonly lastDiscard: boolean;
  readonly afterKong: boolean;
  readonly robbed: boolean;
  /** Riichi: 0 none, 1 declared, 2 declared on the first throw (double riichi). */
  readonly ready: 0 | 1 | 2;
  /** Riichi: won within a go round of declaring (ippatsu). */
  readonly oneShot: boolean;
  /** Riichi: how many of the hand's fives are red. */
  readonly redFives: number;
  /** Riichi: the dora indicators turned up, and the ura indicators under them. */
  readonly indicators: readonly Kind[];
  readonly underIndicators: readonly Kind[];
}

export const EMPTY_INPUT: CalcInput = { hand: [], winning: -1, sets: [], seatWind: 0, prevailingWind: 0, from: null, bonus: [], lastTile: false, lastDiscard: false, afterKong: false, robbed: false, ready: 0, oneShot: false, redFives: 0, indicators: [], underIndicators: [] };

const isFive = (k: Kind): boolean => isSuited(k) && rankOf(k) === 5;

/** How many red fives the hand could hold: one per suit with a five in the hand or its sets. */
export function fivesIn(input: CalcInput): number {
  return new Set([...input.hand, ...input.sets.flatMap(setKinds)].filter(isFive)).size;
}

/** Which fives are the red ones (one per suit, the sets' first, then the hand's), up to `redFives`. */
export function redPlaces(input: CalcInput): { readonly sets: boolean[][]; readonly hand: boolean[] } {
  let left = input.redFives;
  const done = new Set<Kind>();
  const mark = (k: Kind): boolean => {
    if (left <= 0 || !isFive(k) || done.has(k)) return false;
    done.add(k);
    left--;
    return true;
  };
  const sets = input.sets.map((set) => setKinds(set).map(mark));
  return { sets, hand: input.hand.map(mark) };
}

/** The tiles of a set, as kinds. */
export function setKinds(set: CalcSet): Kind[] {
  if (set.type === 'chow') return [set.kind, set.kind + 1, set.kind + 2];
  return Array.from({ length: set.type === 'kong' ? 4 : 3 }, () => set.kind);
}

/** Whether a set can start at this tile: a chow needs a suited 1 to 7. */
export function setFits(type: CalcSet['type'], kind: Kind): boolean {
  if (isBonus(kind)) return false;
  return type !== 'chow' || (isSuited(kind) && rankOf(kind) <= 7);
}

/** How many more tiles the hand needs (negative: too many), for a hand of `size` (13 or 16) plus the winning tile. */
export function tilesWanted(input: CalcInput, size: number): number {
  const kongs = input.sets.filter((s) => s.type === 'kong').length;
  const held = input.hand.length + input.sets.reduce((n, s) => n + setKinds(s).length, 0);
  return size + 1 + kongs - held;
}

/** No kind more than four times, counting the sets. */
export function overused(input: CalcInput): Kind | null {
  const count = new Map<Kind, number>();
  for (const k of [...input.hand, ...input.sets.flatMap(setKinds)]) count.set(k, (count.get(k) ?? 0) + 1);
  for (const [k, n] of count) if (n > 4) return k;
  return null;
}

/** The engine's view of the hand, seat 0 the winner. */
export function contextOf(input: CalcInput): WinContext {
  // Tile ids: copy 0 of a five is the red one, so red fives take copy 0 and other fives copies 1 to 3
  // first; every copy is used once.
  const reds = redPlaces(input);
  const pools = new Map<Kind, number[]>();
  const id = (k: Kind, red: boolean) => {
    let pool = pools.get(k);
    if (!pool) pools.set(k, (pool = isFive(k) ? [1, 2, 3, 0] : [0, 1, 2, 3]));
    const copy = red ? 0 : (pool[0] ?? 3);
    const at = pool.indexOf(copy);
    if (at >= 0) pool.splice(at, 1);
    return tileId(k, copy);
  };
  const melds: Meld[] = input.sets.map((s, i) => {
    const tiles = setKinds(s).map((k, j) => id(k, reds.sets[i]?.[j] === true));
    const exposed = !(s.type === 'kong' && s.concealed);
    return { type: s.type, tiles, claimed: exposed ? (tiles[0] ?? null) : null, from: exposed ? 3 : null, concealed: !exposed, added: false };
  });
  const tile = input.hand[input.winning] ?? input.hand[input.hand.length - 1] ?? 0;
  const selfDrawn = input.from === null;
  const tiles = [...input.hand.map((k, i) => id(k, reds.hand[i] === true)), ...melds.flatMap((m) => m.tiles)];
  return {
    tiles,
    indicators: [...input.indicators],
    underIndicators: input.ready > 0 ? [...input.underIndicators] : [],
    ready: input.ready,
    oneShot: input.ready > 0 && input.oneShot,
    seat: 0,
    tile,
    selfDrawn,
    from: selfDrawn ? null : input.from,
    concealed: [...input.hand],
    melds,
    bonus: [...input.bonus],
    seatWind: input.seatWind,
    prevailingWind: input.prevailingWind,
    dealer: input.seatWind === 0,
    lastTile: selfDrawn && input.lastTile,
    lastDiscard: !selfDrawn && input.lastDiscard,
    kongs: selfDrawn && input.afterKong ? 1 : 0,
    robbed: !selfDrawn && input.robbed,
    heavenly: false,
    earthly: false,
  };
}

export interface Calculation {
  /** The score as the hand stands, before the minimum. */
  readonly score: HandScore | null;
  /** It scores, but less than the table's minimum to win. */
  readonly belowMinimum: boolean;
  /** Each seat's gain or loss, counted from the winner (0) in turn order; empty when it cannot win. */
  readonly payments: readonly number[];
}

/** Scores and settles a complete hand under a style's options. */
export function calculate(style: Style, options: StyleOptions, input: CalcInput): Calculation {
  const ctx = contextOf(input);
  const scored = style.score(ctx, options);
  // Score it again with the lowest minimum the style allows, to tell "too little" from "not a hand".
  const lowest: Record<string, string | number> = { ...options };
  for (const spec of style.options) {
    if (!/^min/i.test(spec.key)) continue;
    const nums = spec.values.filter((v): v is number => typeof v === 'number');
    if (nums.length > 0) lowest[spec.key] = Math.min(...nums);
  }
  const raw = scored ?? style.score(ctx, lowest);
  if (!scored) return { score: raw, belowMinimum: raw !== null, payments: [] };
  const dealer: Seat = (4 - input.seatWind) % 4;
  const payments = style.settle({ wins: [{ seat: 0, from: ctx.from, tile: tileId(ctx.tile, 0), score: scored, robbed: ctx.robbed }], dealer, seats: 4 }, options);
  return { score: scored, belowMinimum: false, payments };
}
