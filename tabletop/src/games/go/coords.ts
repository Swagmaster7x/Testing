/**
 * Naming points on a Go board. Points are numbered y * size + x from the top-left corner.
 *
 * - The usual coordinates: a column letter from A, skipping I, and a row number from 1 at the
 *   bottom, as in "D4" (the Go Text Protocol and most servers write them this way).
 * - SGF coordinates: two letters, column then row, both from "a" at the top-left, as in "dd".
 *   They do not depend on the board size, so records and move codes use them.
 */

export const COLUMNS = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';

export function xOf(p: number, size: number): number {
  return p % size;
}

export function yOf(p: number, size: number): number {
  return Math.floor(p / size);
}

/** "D4": the column letter and the row counted from the bottom. */
export function pointName(p: number, size: number): string {
  return `${COLUMNS[xOf(p, size)] ?? '?'}${size - yOf(p, size)}`;
}

/** "dd": SGF's column and row letters, from the top-left. */
export function sgfName(p: number, size: number): string {
  return `${String.fromCharCode(97 + xOf(p, size))}${String.fromCharCode(97 + yOf(p, size))}`;
}

export function sgfToXY(name: string): { x: number; y: number } | null {
  if (!/^[a-z]{2}$/.test(name)) return null;
  return { x: name.charCodeAt(0) - 97, y: name.charCodeAt(1) - 97 };
}

/** A point from either form ("D4", "d4" or "dd"); null if it is not on this board. */
export function parsePoint(text: string, size: number): number | null {
  const t = text.trim();
  const sgf = /^[a-z]{2}$/.test(t) ? sgfToXY(t) : null;
  if (sgf) return sgf.x < size && sgf.y < size ? sgf.y * size + sgf.x : null;
  const m = /^([A-HJ-Za-hj-z])(\d{1,2})$/.exec(t);
  if (!m) return null;
  const x = COLUMNS.indexOf((m[1] as string).toUpperCase());
  const row = Number(m[2]);
  if (x < 0 || x >= size || row < 1 || row > size) return null;
  return (size - row) * size + x;
}

/** Distance of the star points from the edge, in lines: the 4-4 points on big boards, 3-3 on small. */
function starLine(size: number): number {
  return size >= 13 ? 3 : 2;
}

interface StarSet {
  readonly ur: number;
  readonly ll: number;
  readonly lr: number;
  readonly ul: number;
  readonly centre: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
}

function starSet(size: number): StarSet {
  const e = starLine(size);
  const f = size - 1 - e;
  const m = (size - 1) / 2;
  const at = (x: number, y: number) => y * size + x;
  return { ur: at(f, e), ll: at(e, f), lr: at(f, f), ul: at(e, e), centre: at(m, m), left: at(e, m), right: at(f, m), top: at(m, e), bottom: at(m, f) };
}

/** The star points drawn on the board (hoshi): corners and centre, plus the sides on 19×19. */
export function starPoints(size: number): number[] {
  if (size < 7 || size % 2 === 0) return size % 2 === 1 ? [((size - 1) / 2) * size + (size - 1) / 2] : [];
  const s = starSet(size);
  const out = [s.ul, s.ur, s.ll, s.lr, s.centre];
  if (size >= 19) out.push(s.left, s.right, s.top, s.bottom);
  return out.sort((a, b) => a - b);
}

/** The most handicap stones the fixed placement allows on this board. */
export function maxHandicap(size: number): number {
  return size >= 9 && size % 2 === 1 ? 9 : 0;
}

/**
 * Fixed handicap stones, in the traditional order seen from Black's side: upper right and lower
 * left, then lower right, upper left, the centre for odd counts, then the sides.
 */
export function handicapPoints(size: number, stones: number): number[] {
  if (stones < 2) return [];
  if (stones > maxHandicap(size)) throw new RangeError(`A ${size}×${size} board takes at most ${maxHandicap(size)} handicap stones`);
  const s = starSet(size);
  const corners = [s.ur, s.ll, s.lr, s.ul];
  switch (stones) {
    case 2:
      return corners.slice(0, 2);
    case 3:
      return corners.slice(0, 3);
    case 4:
      return corners;
    case 5:
      return [...corners, s.centre];
    case 6:
      return [...corners, s.left, s.right];
    case 7:
      return [...corners, s.left, s.right, s.centre];
    case 8:
      return [...corners, s.left, s.right, s.top, s.bottom];
    default:
      return [...corners, s.left, s.right, s.top, s.bottom, s.centre];
  }
}
