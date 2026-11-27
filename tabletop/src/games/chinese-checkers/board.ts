/**
 * The Chinese Checkers star: 121 holes, worked out once from cube coordinates (x + y + z = 0).
 * A hole is on the star when all three coordinates are at most 4 or all are at least -4: two big
 * triangles that overlap in the middle hexagon.
 *
 * Holes are numbered in reading order from the top tip (hole 0) to the bottom tip (hole 120), row
 * by row, left to right, so a position's text lists them in index order. Rows are named 1 to 17
 * from the bottom (Red's start) and holes in a row a, b, c, ... from the left: the bottom tip is
 * "1a", the top tip "17a" (docs/rules/chinese-checkers.md, "Notation").
 *
 * The six points are numbered clockwise from the bottom: 0 bottom, 1 lower left, 2 upper left,
 * 3 top, 4 upper right, 5 lower right. A seat's home is the point opposite its start.
 */

export const HOLES = 121;
export const ROWS = 17;
/** Holes in each row from the bottom (row 1) to the top (row 17). */
export const ROW_LENGTHS: readonly number[] = [1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1];
export const POINT_HOLES = 10;
/** The six directions, clockwise from east (as seen with Red at the bottom). */
export const DIRECTIONS: readonly (readonly [number, number, number])[] = [
  [1, -1, 0],
  [0, -1, 1],
  [-1, 0, 1],
  [-1, 1, 0],
  [0, 1, -1],
  [1, 0, -1],
];

/** Cube coordinates by hole. */
export const HX = new Int8Array(HOLES);
export const HY = new Int8Array(HOLES);
export const HZ = new Int8Array(HOLES);
/** Row from the bottom (1 to 17) and place in the row from the left (0 is "a"), as the board's names use them. */
export const ROW = new Int8Array(HOLES);
export const COL = new Int8Array(HOLES);
/** Neighbour of each hole in each direction (hole * 6 + direction), or -1 off the board. */
export const NEIGHBOUR = new Int16Array(HOLES * 6).fill(-1);
/** The point (0 to 5) a hole belongs to, or -1 for the middle hexagon. */
export const POINT_OF = new Int8Array(HOLES).fill(-1);
/** Position on the drawing with Red at the bottom: x in hole spacings, y in rows (downwards). */
export const PX = new Float64Array(HOLES);
export const PY = new Float64Array(HOLES);

const onStar = (x: number, y: number, z: number) => (x <= 4 && y <= 4 && z <= 4) || (x >= -4 && y >= -4 && z >= -4);

const byCube = new Map<number, number>();
const cubeKey = (x: number, z: number) => (x + 16) * 64 + (z + 16);

/** Which point a hole is in: 0 bottom (z ≥ 5), then clockwise. */
function pointOf(x: number, y: number, z: number): number {
  if (z >= 5) return 0;
  if (x <= -5) return 1;
  if (y >= 5) return 2;
  if (z <= -5) return 3;
  if (x >= 5) return 4;
  if (y <= -5) return 5;
  return -1;
}

(() => {
  let i = 0;
  for (let z = -8; z <= 8; z++) {
    let col = 0;
    for (let x = -8; x <= 8; x++) {
      const y = -x - z;
      if (!onStar(x, y, z)) continue;
      HX[i] = x;
      HY[i] = y;
      HZ[i] = z;
      ROW[i] = 9 - z;
      COL[i] = col++;
      POINT_OF[i] = pointOf(x, y, z);
      PX[i] = x + z / 2;
      PY[i] = z;
      byCube.set(cubeKey(x, z), i);
      i++;
    }
  }
  if (i !== HOLES) throw new Error(`The star has ${i} holes, not ${HOLES}`);
  for (let h = 0; h < HOLES; h++) {
    DIRECTIONS.forEach(([dx, , dz], d) => {
      NEIGHBOUR[h * 6 + d] = byCube.get(cubeKey((HX[h] as number) + dx, (HZ[h] as number) + dz)) ?? -1;
    });
  }
})();

/** The hole at cube coordinates (x, -x-z, z), or -1. */
export function holeAt(x: number, z: number): number {
  return byCube.get(cubeKey(x, z)) ?? -1;
}

export const neighbour = (hole: number, direction: number): number => NEIGHBOUR[hole * 6 + direction] as number;

/** Steps between two holes along the lines (marbles ignored). */
export function distance(a: number, b: number): number {
  return Math.max(Math.abs((HX[a] as number) - (HX[b] as number)), Math.abs((HY[a] as number) - (HY[b] as number)), Math.abs((HZ[a] as number) - (HZ[b] as number)));
}

// ---------------------------------------------------------------------------------------------
// Names

const LETTERS = 'abcdefghijklm';

/** "1a" (bottom tip) to "17a" (top tip). */
export function holeName(hole: number): string {
  return `${ROW[hole] as number}${LETTERS[COL[hole] as number] as string}`;
}

const byName = new Map<string, number>();
for (let h = 0; h < HOLES; h++) byName.set(holeName(h), h);

/** The hole with a name such as "4b", or -1. */
export function parseHoleName(name: string): number {
  return byName.get(name.trim().toLowerCase()) ?? -1;
}

/** The two-letter stored code of a hole: its x and z coordinates as letters a to q. */
export function holeCode(hole: number): string {
  return `${String.fromCharCode(105 + (HX[hole] as number))}${String.fromCharCode(105 + (HZ[hole] as number))}`;
}

/** The hole with a two-letter code, or -1. */
export function parseHoleCode(code: string): number {
  if (!/^[a-q]{2}$/.test(code)) return -1;
  return holeAt(code.charCodeAt(0) - 105, code.charCodeAt(1) - 105);
}

/** A hole from either its name ("4b") or its code ("hp"), or -1. */
export function parseHole(text: string): number {
  const t = text.trim().toLowerCase();
  const named = parseHoleName(t);
  return named >= 0 ? named : parseHoleCode(t);
}

/** Hole names in text ("4b", "17a"), for the lesson linter's typed-number check. */
export const HOLE_NAME_PATTERN = /\b(?:1[0-7]|[1-9])[a-m]\b/g;

// ---------------------------------------------------------------------------------------------
// Points, homes and rows

/** Every hole of a point, ten of them. */
export const POINT_HOLES_OF: readonly (readonly number[])[] = Array.from({ length: 6 }, (_, p) => {
  const out: number[] = [];
  for (let h = 0; h < HOLES; h++) if (POINT_OF[h] === p) out.push(h);
  return out;
});

/** The fifteen holes of a point and the hexagon edge in front of it (the fifteen-marble start). */
export const WIDE_HOLES_OF: readonly (readonly number[])[] = Array.from({ length: 6 }, (_, p) => {
  const out: number[] = [];
  for (let h = 0; h < HOLES; h++) {
    const x = HX[h] as number;
    const y = HY[h] as number;
    const z = HZ[h] as number;
    const c = [z, -x, y, -z, x, -y][p] as number;
    // Points 0, 2, 4 lie where one coordinate is at least 5; 1, 3, 5 where one is at most -5.
    const inside = p % 2 === 0 ? c >= 4 && x >= -4 && y >= -4 && z >= -4 : c >= 4 && x <= 4 && y <= 4 && z <= 4;
    if (inside) out.push(h);
  }
  return out;
});

export const opposite = (point: number): number => (point + 3) % 6;

/**
 * Row of a hole counted from a point's tip (1) to the opposite tip (17): how far a marble that
 * started in that point has come. ROW_FROM[point * HOLES + hole].
 */
export const ROW_FROM = new Int8Array(6 * HOLES);
for (let h = 0; h < HOLES; h++) {
  const x = HX[h] as number;
  const y = HY[h] as number;
  const z = HZ[h] as number;
  const rows = [9 - z, 9 + x, 9 - y, 9 + z, 9 - x, 9 + y];
  rows.forEach((r, p) => {
    ROW_FROM[p * HOLES + h] = r;
  });
}

/** The point at the bottom when the board is turned for a player in this point; the angle to turn it by (degrees). */
export function turnFor(point: number): number {
  return -60 * point;
}

/** Drawing position of a hole with `point` turned to the bottom. */
export function drawAt(hole: number, point: number): { x: number; y: number } {
  const x = PX[hole] as number;
  const y = (PY[hole] as number) * (Math.sqrt(3) / 2);
  if (point === 0) return { x, y };
  const a = (turnFor(point) * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: x * c - y * s, y: x * s + y * c };
}
