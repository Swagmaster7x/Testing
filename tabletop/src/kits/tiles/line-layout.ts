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

/** Which open end: the two ends of the line, or a spinner's third ("up") and fourth ("down") arms. */
export type EndName = 'left' | 'right' | 'up' | 'down';

/** Where the next tile on an end would lie, for the open-end marker. */
export interface EndSpot {
  readonly end: EndName;
  readonly x: number;
  readonly y: number;
  readonly rotate: number;
  readonly value: number;
}

export interface LineLayout {
  readonly tiles: readonly LaidTile[];
  /** The ends (left and right; with a spinner also up and down), or empty before the first tile. */
  readonly ends: readonly EndSpot[];
  readonly box: { readonly minX: number; readonly maxX: number; readonly minY: number; readonly maxY: number };
}

/** A spinner (All Fives) in the line, and its third and fourth arms from the spinner outwards (`left` touches the spinner). */
export interface SpinnerArms {
  readonly spinner: string;
  readonly up: readonly LineTile[];
  readonly down: readonly LineTile[];
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

/** The box around tiles and end markers. */
function boxOf(items: readonly { x: number; y: number; rotate: number }[]): LineLayout['box'] {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const t of items) {
    const flat = t.rotate === 0 || t.rotate === 180;
    const hw = flat ? 1 : 0.5;
    const hh = flat ? 0.5 : 1;
    minX = Math.min(minX, t.x - hw);
    maxX = Math.max(maxX, t.x + hw);
    minY = Math.min(minY, t.y - hh);
    maxY = Math.max(maxY, t.y + hh);
  }
  return { minX, maxX, minY, maxY };
}

/** Lays the line out in units, with rows no wider than `halfWidth` either side of the first tile. */
export function layoutUnits(chain: readonly LineTile[], halfWidth: number): LineLayout {
  if (chain.length === 0) {
    return { tiles: [], ends: [], box: { minX: -1, maxX: 1, minY: -0.5, maxY: 0.5 } };
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
  const ghost = (end: EndName, t: Turtle, value: number): EndSpot => ({ end, ...place({ ...t }, value, value === 6 ? 5 : 6, halfWidth), value });
  const ends: EndSpot[] = [ghost('left', left, leftEnd), ghost('right', right, rightEnd)];
  return { tiles, ends, box: boxOf([...tiles, ...ends]) };
}

/**
 * A cross around a spinner (All Fives): the spinner lies across the middle and four arms snake
 * out from it, each kept to its own part of the table so they never meet. The right arm (the
 * line's right end) runs right and then back and forth downwards on the right; the left arm runs
 * left and back and forth upwards on the left; the upper arm runs up, then turns right along the
 * top and works down on the right; the lower arm runs down, then turns left along the bottom and
 * works up on the left.
 */
interface Snake {
  /** The middle of the open end's edge, and the way the arm runs. */
  p: Vec;
  d: Vec;
  /** A first run up or down from the spinner, a row across the table, or the one-tile step between rows. */
  mode: 'leg' | 'row' | 'step';
  /** The way the current (or next) row runs. */
  rowDir: Vec;
  /** The way rows follow each other, and the way the first row runs after a leg. */
  readonly stack: Vec;
  readonly firstRow: Vec;
  /** How far a leg may run (a y coordinate), and the x bounds of the rows. */
  readonly legLimit: number;
  readonly rowMin: number;
  readonly rowMax: number;
}

const EPS = 1e-9;

/** Does a tile centred at `c` along the snake's way stay inside its bounds? */
function snakeFits(s: Snake, c: Vec, double: boolean): boolean {
  const reach = double ? 0.5 : 1;
  if (s.mode === 'leg') {
    const far = c[1] + s.d[1] * reach;
    return s.d[1] < 0 ? far >= s.legLimit - EPS : far <= s.legLimit + EPS;
  }
  if (s.mode === 'row') {
    const far = c[0] + s.d[0] * reach;
    return s.d[0] > 0 ? far <= s.rowMax + EPS : far >= s.rowMin - EPS;
  }
  return true;
}

function snakePlace(s: Snake, inner: number, outer: number): Step {
  const double = inner === outer;
  if (double) {
    // Across the arm, one unit along it.
    const c = add(s.p, s.d, 0.5);
    if (s.mode === 'step' || snakeFits(s, c, true)) {
      s.p = add(s.p, s.d, 1);
      return { x: c[0], y: c[1], rotate: s.d[1] === 0 ? 90 : 0 };
    }
  } else if (s.mode !== 'step') {
    const c = add(s.p, s.d, 1);
    if (snakeFits(s, c, false)) {
      s.p = add(s.p, s.d, 2);
      return { x: c[0], y: c[1], rotate: rotationAlong(s.d, inner, outer) };
    }
  }
  // A corner: the tile starts beside the last one and runs the new way.
  const m: Vec = s.mode === 'leg' ? s.firstRow : s.mode === 'row' ? s.stack : neg(s.rowDir);
  const c = add(add(s.p, s.d, 0.5), m, 0.5);
  s.p = add(add(s.p, s.d, 0.5), m, 1.5);
  s.d = m;
  if (s.mode !== 'row') s.rowDir = m;
  s.mode = s.mode === 'row' ? 'step' : 'row';
  return { x: c[0], y: c[1], rotate: rotationAlong(m, inner, outer) };
}

/** Lays out a cross around a spinner, in units, inside `halfWidth` by `halfHeight` either side of the spinner. */
export function layoutCross(chain: readonly LineTile[], arms: SpinnerArms, halfWidth: number, halfHeight: number): LineLayout {
  const k = chain.findIndex((p) => p.tile === arms.spinner);
  const hub = chain[k];
  if (!hub) return layoutUnits(chain, halfWidth);
  const tiles: LaidTile[] = [{ tile: hub.tile, x: 0, y: 0, rotate: 90 }];
  // Rows keep clear of the upper and lower arms' column, with room for a corner.
  const inner = 2.5;
  const legLimit = Math.max(2, halfHeight - 1);
  const east: Snake = { p: [0.5, 0], d: [1, 0], mode: 'row', rowDir: [1, 0], stack: [0, 1], firstRow: [1, 0], legLimit: 0, rowMin: inner, rowMax: halfWidth };
  const west: Snake = { p: [-0.5, 0], d: [-1, 0], mode: 'row', rowDir: [-1, 0], stack: [0, -1], firstRow: [-1, 0], legLimit: 0, rowMin: -halfWidth, rowMax: -inner };
  const north: Snake = { p: [0, -1], d: [0, -1], mode: 'leg', rowDir: [1, 0], stack: [0, 1], firstRow: [1, 0], legLimit: -legLimit, rowMin: inner, rowMax: halfWidth };
  const south: Snake = { p: [0, 1], d: [0, 1], mode: 'leg', rowDir: [-1, 0], stack: [0, -1], firstRow: [-1, 0], legLimit, rowMin: -halfWidth, rowMax: -inner };
  for (let i = k + 1; i < chain.length; i++) {
    const p = chain[i] as LineTile;
    tiles.push({ tile: p.tile, ...snakePlace(east, p.left, p.right) });
  }
  for (let i = k - 1; i >= 0; i--) {
    const p = chain[i] as LineTile;
    tiles.push({ tile: p.tile, ...snakePlace(west, p.right, p.left) });
  }
  for (const p of arms.up) tiles.push({ tile: p.tile, ...snakePlace(north, p.left, p.right) });
  for (const p of arms.down) tiles.push({ tile: p.tile, ...snakePlace(south, p.left, p.right) });
  const sp = hub.left;
  const leftEnd = (chain[0] as LineTile).left;
  const rightEnd = (chain[chain.length - 1] as LineTile).right;
  const upEnd = arms.up.length > 0 ? (arms.up[arms.up.length - 1] as LineTile).right : sp;
  const downEnd = arms.down.length > 0 ? (arms.down[arms.down.length - 1] as LineTile).right : sp;
  const ghost = (end: EndName, s: Snake, value: number): EndSpot => ({ end, ...snakePlace({ ...s }, value, value === 6 ? 5 : 6), value });
  const ends: EndSpot[] = [ghost('left', west, leftEnd), ghost('right', east, rightEnd), ghost('up', north, upEnd), ghost('down', south, downEnd)];
  return { tiles, ends, box: boxOf([...tiles, ...ends]) };
}

/** True when two laid tiles overlap (they may touch). */
function overlapping(tiles: readonly { x: number; y: number; rotate: number }[]): boolean {
  const half = (t: { rotate: number }): [number, number] => (t.rotate === 0 || t.rotate === 180 ? [1, 0.5] : [0.5, 1]);
  for (let i = 0; i < tiles.length; i++) {
    const a = tiles[i] as { x: number; y: number; rotate: number };
    const [aw, ah] = half(a);
    for (let j = i + 1; j < tiles.length; j++) {
      const b = tiles[j] as { x: number; y: number; rotate: number };
      const [bw, bh] = half(b);
      if (Math.abs(a.x - b.x) < aw + bw - 0.05 && Math.abs(a.y - b.y) < ah + bh - 0.05) return true;
    }
  }
  return false;
}

export interface FittedLine {
  /** Pixels per unit. */
  readonly unit: number;
  /** Pixel offset of the first tile's centre from the area's centre. */
  readonly dx: number;
  readonly dy: number;
  readonly layout: LineLayout;
}

/**
 * The largest tiles (between `minUnit` and `maxUnit` pixels per unit) whose line fits a `width` by
 * `height` area; with a spinner's arms, a cross whose arms do not run into each other.
 */
export function fitLine(chain: readonly LineTile[], width: number, height: number, maxUnit: number, minUnit = 7, arms: SpinnerArms | null = null): FittedLine {
  let unit = Math.max(minUnit, maxUnit);
  for (;;) {
    const halfWidth = Math.max(2, width / unit / 2 - 1.2);
    const halfHeight = Math.max(3, height / unit / 2 - 0.2);
    const layout = arms ? layoutCross(chain, arms, Math.max(4, halfWidth), halfHeight) : layoutUnits(chain, halfWidth);
    const w = (layout.box.maxX - layout.box.minX) * unit;
    const h = (layout.box.maxY - layout.box.minY) * unit;
    const clear = !arms || !overlapping([...layout.tiles, ...layout.ends]);
    if ((w <= width && h <= height && clear) || unit <= minUnit) {
      const dx = -((layout.box.maxX + layout.box.minX) / 2) * unit;
      const dy = -((layout.box.maxY + layout.box.minY) / 2) * unit;
      return { unit, dx, dy, layout };
    }
    unit = Math.max(minUnit, unit * 0.93);
  }
}
