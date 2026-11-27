/**
 * Laying out a line of dominoes that bends to fit the table (PLAN.md M4: "a chain that bends to
 * fit the table, open ends marked"). Work is in units: a tile is 2 units long and 1 wide. The
 * first tile sits in the middle; the right arm runs right, turns down at the edge and runs back
 * left, turning down again as needed; the left arm does the same upwards. Doubles lie across the
 * line. At a corner the turning tile starts beside the last one, so matching halves always touch.
 *
 * Rotation is how far a tile drawn flat with its low number on the left is turned: 0 low on the
 * left, 180 low on the right, 90 low on top, -90 low at the bottom.
 */

export interface LineTile {
  readonly tile: string;
  /** The number facing the left end of the line, and the right end. */
  readonly left: number;
  readonly right: number;
  /** Order of play; the lowest is the first tile. */
  readonly n: number;
}

export interface LaidTile {
  readonly tile: string;
  readonly x: number;
  readonly y: number;
  readonly rotate: number;
}

/** Where the next tile on an end would lie, for the open-end marker. */
export interface EndSpot {
  readonly x: number;
  readonly y: number;
  readonly rotate: number;
  readonly value: number;
}

export interface LineLayout {
  readonly tiles: readonly LaidTile[];
  /** Left and right ends, or null before the first tile. */
  readonly ends: readonly [EndSpot, EndSpot] | null;
  readonly box: { readonly minX: number; readonly maxX: number; readonly minY: number; readonly maxY: number };
}

type Vec = readonly [number, number];

interface Turtle {
  /** The middle of the open end's edge. */
  p: Vec;
  /** The way the arm is running now. */
  d: Vec;
  /** The way it turns at an edge: down for the right arm, up for the left. */
  readonly turn: Vec;
  /** The way the current (or last) row runs. */
  rowDir: Vec;
  /** In the short run between two rows. */
  across: boolean;
}

const add = (a: Vec, b: Vec, k = 1): Vec => [a[0] + b[0] * k, a[1] + b[1] * k];
const neg = (a: Vec): Vec => [-a[0], -a[1]];

/** Rotation for a tile lying along `d` with `first` nearest the start of `d`. */
function rotationAlong(d: Vec, first: number, second: number): number {
  const low = Math.min(first, second);
  const double = first === second;
  if (d[1] === 0) {
    // Lying flat: the left number is `first` when running right.
    const leftValue = d[0] > 0 ? first : second;
    return double || leftValue === low ? 0 : 180;
  }
  const topValue = d[1] > 0 ? first : second;
  return double || topValue === low ? 90 : -90;
}

interface Step {
  readonly x: number;
  readonly y: number;
  readonly rotate: number;
}

/** Places one tile on an arm and moves the turtle on. */
function place(t: Turtle, inner: number, outer: number, halfWidth: number): Step {
  const double = inner === outer;
  const inRow = !t.across;
  const fitsRow = (k: number) => Math.abs(t.p[0] + t.d[0] * k) <= halfWidth + 1e-9;
  if (double && (!inRow || fitsRow(1))) {
    // Across the line, one unit along it.
    const c = add(t.p, t.d, 0.5);
    t.p = add(t.p, t.d, 1);
    return { x: c[0], y: c[1], rotate: inRow ? 90 : 0 };
  }
  if (!double && inRow && fitsRow(2)) {
    const c = add(t.p, t.d, 1);
    t.p = add(t.p, t.d, 2);
    return { x: c[0], y: c[1], rotate: rotationAlong(t.d, inner, outer) };
  }
  // A corner: the tile starts beside the last one and runs the new way.
  const m: Vec = inRow ? t.turn : neg(t.rowDir);
  const c = add(add(t.p, t.d, 0.5), m, 0.5);
  t.p = add(add(t.p, t.d, 0.5), m, 1.5);
  t.d = m;
  if (!inRow) t.rowDir = m;
  t.across = inRow;
  return { x: c[0], y: c[1], rotate: rotationAlong(m, inner, outer) };
}

/** Lays the line out in units, with rows no wider than `halfWidth` either side of the first tile. */
export function layoutUnits(chain: readonly LineTile[], halfWidth: number): LineLayout {
  if (chain.length === 0) {
    return { tiles: [], ends: null, box: { minX: -1, maxX: 1, minY: -0.5, maxY: 0.5 } };
  }
  let f = 0;
  chain.forEach((p, i) => {
    if (p.n < (chain[f] as LineTile).n) f = i;
  });
  const first = chain[f] as LineTile;
  const tiles: LaidTile[] = [];
  const double = first.left === first.right;
  tiles.push({ tile: first.tile, x: 0, y: 0, rotate: double ? 90 : rotationAlong([1, 0], first.left, first.right) });
  const reach = double ? 0.5 : 1;
  const right: Turtle = { p: [reach, 0], d: [1, 0], turn: [0, 1], rowDir: [1, 0], across: false };
  const left: Turtle = { p: [-reach, 0], d: [-1, 0], turn: [0, -1], rowDir: [-1, 0], across: false };
  for (let i = f + 1; i < chain.length; i++) {
    const p = chain[i] as LineTile;
    const s = place(right, p.left, p.right, halfWidth);
    tiles.push({ tile: p.tile, ...s });
  }
  for (let i = f - 1; i >= 0; i--) {
    const p = chain[i] as LineTile;
    const s = place(left, p.right, p.left, halfWidth);
    tiles.push({ tile: p.tile, ...s });
  }
  const leftEnd = (chain[0] as LineTile).left;
  const rightEnd = (chain[chain.length - 1] as LineTile).right;
  // The marker shows a tile that is not a double, so it is as long as the longest next tile.
  const ghost = (t: Turtle, value: number): EndSpot => ({ ...place({ ...t }, value, value === 6 ? 5 : 6, halfWidth), value });
  const ends: [EndSpot, EndSpot] = [ghost(left, leftEnd), ghost(right, rightEnd)];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const t of [...tiles, ...ends]) {
    const flat = t.rotate === 0 || t.rotate === 180;
    const hw = flat ? 1 : 0.5;
    const hh = flat ? 0.5 : 1;
    minX = Math.min(minX, t.x - hw);
    maxX = Math.max(maxX, t.x + hw);
    minY = Math.min(minY, t.y - hh);
    maxY = Math.max(maxY, t.y + hh);
  }
  return { tiles, ends, box: { minX, maxX, minY, maxY } };
}

export interface FittedLine {
  /** Pixels per unit. */
  readonly unit: number;
  /** Pixel offset of the first tile's centre from the area's centre. */
  readonly dx: number;
  readonly dy: number;
  readonly layout: LineLayout;
}

/** The largest tiles (between `minUnit` and `maxUnit` pixels per unit) whose line fits a `width` by `height` area. */
export function fitLine(chain: readonly LineTile[], width: number, height: number, maxUnit: number, minUnit = 7): FittedLine {
  let unit = Math.max(minUnit, maxUnit);
  for (;;) {
    const halfWidth = Math.max(2, width / unit / 2 - 1.2);
    const layout = layoutUnits(chain, halfWidth);
    const w = (layout.box.maxX - layout.box.minX) * unit;
    const h = (layout.box.maxY - layout.box.minY) * unit;
    if ((w <= width && h <= height) || unit <= minUnit) {
      const dx = -((layout.box.maxX + layout.box.minX) / 2) * unit;
      const dy = -((layout.box.maxY + layout.box.minY) / 2) * unit;
      return { unit, dx, dy, layout };
    }
    unit = Math.max(minUnit, unit * 0.93);
  }
}
