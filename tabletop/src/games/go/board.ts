/**
 * A fast Go board shared by the rules module and the CPU. Rules as implemented: docs/rules/go.md.
 *
 * One flat array with a border of edge cells, so every point has four neighbours. Stones are
 * linked into chains (a circular list per chain), and each chain keeps pseudo-liberties: every
 * pair of a stone and an empty neighbour counts once. From the count, the sum and the sum of
 * squares of those neighbours we can tell at once whether a chain has no liberty, whether it is
 * in atari, and where its last liberty is (all pseudo-liberties are then the same point).
 *
 * The board is mutable for speed; the rules module copies it for every move, and playouts work
 * on their own copy. Points outside this file are numbered y * size + x from the top-left corner,
 * the order SGF uses; inside, they are padded indices (see `index` and `point`).
 */

export const EMPTY = 0;
export const BLACK = 1;
export const WHITE = 2;
export const EDGE = 3;
export type Color = typeof BLACK | typeof WHITE;

export const opponent = (c: Color): Color => (c === BLACK ? WHITE : BLACK);

/** Largest board the coordinates can name: A to Z without I is 25 columns. */
export const MAX_SIZE = 25;
const MAX_WIDTH = MAX_SIZE + 2;
const MAX_CELLS = MAX_WIDTH * MAX_WIDTH;

/** Zobrist keys: two 32-bit halves per colour and cell, from a fixed seed so hashes never change. */
function zobristTable(seed: number): Int32Array {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x9e3779b9) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 16), 0x21f0aaad);
    z = Math.imul(z ^ (z >>> 15), 0x735a2d97);
    return (z ^ (z >>> 15)) | 0;
  };
  const table = new Int32Array(3 * MAX_CELLS * 2);
  for (let i = 0; i < table.length; i++) table[i] = next();
  return table;
}

const ZOBRIST = zobristTable(0x60b0a2d1);

function zHi(color: number, cell: number): number {
  return ZOBRIST[(color * MAX_CELLS + cell) * 2] as number;
}

function zLo(color: number, cell: number): number {
  return ZOBRIST[(color * MAX_CELLS + cell) * 2 + 1] as number;
}

export function hashHex(hi: number, lo: number): string {
  return (hi >>> 0).toString(16).padStart(8, '0') + (lo >>> 0).toString(16).padStart(8, '0');
}

export class Board {
  readonly size: number;
  /** Row length including the two border columns. */
  readonly width: number;
  readonly cells: number;
  /** Offsets to the four neighbours: up, left, right, down. */
  readonly dirs: Int32Array;
  readonly color: Uint8Array;
  /** The chain's head (its id) for each stone. */
  readonly head: Int32Array;
  /** The next stone in the same chain (a circular list). */
  readonly next: Int32Array;
  /** Per chain, indexed by its head: pseudo-liberty count, sum, sum of squares, stones. */
  readonly libs: Int32Array;
  readonly libSum: Int32Array;
  readonly libSumSq: Int32Array;
  readonly stones: Int32Array;
  /** Empty points (padded indices) and where each sits in that list, for random playouts. */
  readonly empties: Int32Array;
  readonly emptyAt: Int32Array;
  emptyCount = 0;
  /** The point the side to move may not take back at once (simple ko), or -1. */
  ko = -1;
  hashHi = 0;
  hashLo = 0;
  /** Stones captured by Black and by White. */
  capturedBy: [number, number] = [0, 0];
  /** The last move played (padded index), -1 for a pass, -2 at the start. */
  last = -2;
  /** The move before the last one. */
  last2 = -2;

  constructor(size: number) {
    if (!Number.isInteger(size) || size < 2 || size > MAX_SIZE) throw new RangeError(`A Go board is 2 to ${MAX_SIZE} lines, not ${size}`);
    this.size = size;
    this.width = size + 2;
    this.cells = this.width * this.width;
    this.dirs = Int32Array.of(-this.width, -1, 1, this.width);
    const n = this.cells;
    this.color = new Uint8Array(n).fill(EDGE);
    this.head = new Int32Array(n);
    this.next = new Int32Array(n);
    this.libs = new Int32Array(n);
    this.libSum = new Int32Array(n);
    this.libSumSq = new Int32Array(n);
    this.stones = new Int32Array(n);
    this.empties = new Int32Array(size * size);
    this.emptyAt = new Int32Array(n).fill(-1);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = this.index(x, y);
        this.color[i] = EMPTY;
        this.emptyAt[i] = this.emptyCount;
        this.empties[this.emptyCount++] = i;
      }
    }
  }

  /** Padded index of the point in column x, row y (both from the top-left, from 0). */
  index(x: number, y: number): number {
    return (y + 1) * this.width + x + 1;
  }

  /** Padded index from an outside point number (y * size + x). */
  fromPoint(p: number): number {
    return this.index(p % this.size, Math.floor(p / this.size));
  }

  /** Outside point number from a padded index. */
  point(i: number): number {
    const y = Math.floor(i / this.width) - 1;
    const x = (i % this.width) - 1;
    return y * this.size + x;
  }

  copy(): Board {
    const b = Object.create(Board.prototype) as Board;
    const w = b as unknown as Record<string, unknown>;
    w.size = this.size;
    w.width = this.width;
    w.cells = this.cells;
    w.dirs = this.dirs;
    w.color = this.color.slice();
    w.head = this.head.slice();
    w.next = this.next.slice();
    w.libs = this.libs.slice();
    w.libSum = this.libSum.slice();
    w.libSumSq = this.libSumSq.slice();
    w.stones = this.stones.slice();
    w.empties = this.empties.slice();
    w.emptyAt = this.emptyAt.slice();
    b.emptyCount = this.emptyCount;
    b.ko = this.ko;
    b.hashHi = this.hashHi;
    b.hashLo = this.hashLo;
    b.capturedBy = [this.capturedBy[0], this.capturedBy[1]];
    b.last = this.last;
    b.last2 = this.last2;
    return b;
  }

  /** True when the chain whose head is h has exactly one liberty. */
  inAtari(h: number): boolean {
    const n = this.libs[h] as number;
    if (n === 0) return false;
    const s = this.libSum[h] as number;
    return n * (this.libSumSq[h] as number) === s * s;
  }

  /** The only liberty of a chain in atari. */
  atariLiberty(h: number): number {
    return (this.libSum[h] as number) / (this.libs[h] as number);
  }

  /** The distinct liberties of a chain (padded indices), at most `limit` of them. */
  liberties(h: number, limit = Infinity): number[] {
    const out: number[] = [];
    const dirs = this.dirs;
    let s = h;
    do {
      for (let d = 0; d < 4; d++) {
        const n = s + (dirs[d] as number);
        if (this.color[n] === EMPTY && !out.includes(n)) {
          out.push(n);
          if (out.length >= limit) return out;
        }
      }
      s = this.next[s] as number;
    } while (s !== h);
    return out;
  }

  /** Number of distinct liberties of the chain at padded index i. */
  libertyCount(i: number): number {
    return this.liberties(this.head[i] as number).length;
  }

  /** Stones of the chain whose head is h (padded indices). */
  chain(h: number): number[] {
    const out: number[] = [];
    let s = h;
    do {
      out.push(s);
      s = this.next[s] as number;
    } while (s !== h);
    return out;
  }

  private addLib(h: number, lib: number): void {
    this.libs[h] = (this.libs[h] as number) + 1;
    this.libSum[h] = (this.libSum[h] as number) + lib;
    this.libSumSq[h] = (this.libSumSq[h] as number) + lib * lib;
  }

  private removeLib(h: number, lib: number): void {
    this.libs[h] = (this.libs[h] as number) - 1;
    this.libSum[h] = (this.libSum[h] as number) - lib;
    this.libSumSq[h] = (this.libSumSq[h] as number) - lib * lib;
  }

  private takeEmpty(i: number): void {
    const at = this.emptyAt[i] as number;
    const lastIndex = --this.emptyCount;
    const moved = this.empties[lastIndex] as number;
    this.empties[at] = moved;
    this.emptyAt[moved] = at;
    this.emptyAt[i] = -1;
  }

  private giveEmpty(i: number): void {
    this.emptyAt[i] = this.emptyCount;
    this.empties[this.emptyCount++] = i;
  }

  private merge(a: number, b: number): number {
    // Keep the larger chain's head.
    if ((this.stones[a] as number) < (this.stones[b] as number)) [a, b] = [b, a];
    let s = b;
    do {
      this.head[s] = a;
      s = this.next[s] as number;
    } while (s !== b);
    const na = this.next[a] as number;
    this.next[a] = this.next[b] as number;
    this.next[b] = na;
    this.libs[a] = (this.libs[a] as number) + (this.libs[b] as number);
    this.libSum[a] = (this.libSum[a] as number) + (this.libSum[b] as number);
    this.libSumSq[a] = (this.libSumSq[a] as number) + (this.libSumSq[b] as number);
    this.stones[a] = (this.stones[a] as number) + (this.stones[b] as number);
    return a;
  }

  /** Removes a chain from the board and returns how many stones it had. */
  private removeChain(h: number): number {
    const c = this.color[h] as number;
    const stones = this.chain(h);
    for (const s of stones) {
      this.color[s] = EMPTY;
      this.hashHi ^= zHi(c, s);
      this.hashLo ^= zLo(c, s);
      this.giveEmpty(s);
    }
    const dirs = this.dirs;
    for (const s of stones) {
      for (let d = 0; d < 4; d++) {
        const n = s + (dirs[d] as number);
        const nc = this.color[n];
        if (nc === BLACK || nc === WHITE) this.addLib(this.head[n] as number, s);
      }
    }
    return stones.length;
  }

  /** Puts a stone down with no checks at all (used to set up positions). */
  setStone(i: number, c: Color): void {
    if (this.color[i] !== EMPTY) throw new Error('setStone needs an empty point');
    this.placeRaw(i, c);
  }

  private placeRaw(i: number, c: Color): void {
    const dirs = this.dirs;
    this.color[i] = c;
    this.head[i] = i;
    this.next[i] = i;
    this.stones[i] = 1;
    this.libs[i] = 0;
    this.libSum[i] = 0;
    this.libSumSq[i] = 0;
    this.takeEmpty(i);
    this.hashHi ^= zHi(c, i);
    this.hashLo ^= zLo(c, i);
    for (let d = 0; d < 4; d++) {
      const n = i + (dirs[d] as number);
      const nc = this.color[n];
      if (nc === EMPTY) this.addLib(i, n);
      else if (nc === BLACK || nc === WHITE) this.removeLib(this.head[n] as number, i);
    }
    let h = i;
    for (let d = 0; d < 4; d++) {
      const n = i + (dirs[d] as number);
      if (this.color[n] === c) {
        const hn = this.head[n] as number;
        if (hn !== h) h = this.merge(h, hn);
      }
    }
  }

  /**
   * Can colour c play at i? Checks the simple ko point and suicide. Superko is the rules
   * module's business (see `hashAfter`). With `suicide` true, a suicide of two or more stones
   * is allowed; a single stone taking its own last liberty never is.
   */
  isLegal(i: number, c: Color, suicide = false): boolean {
    if (this.color[i] !== EMPTY || i === this.ko) return false;
    const dirs = this.dirs;
    let friend = false;
    for (let d = 0; d < 4; d++) {
      const n = i + (dirs[d] as number);
      const nc = this.color[n];
      if (nc === EMPTY) return true;
      if (nc === c) {
        friend = true;
        if (!this.inAtari(this.head[n] as number)) return true;
      } else if (nc !== EDGE && this.inAtari(this.head[n] as number)) return true;
    }
    return suicide && friend;
  }

  /** True when the move at i takes its own last liberty and captures nothing. */
  isSuicide(i: number, c: Color): boolean {
    const dirs = this.dirs;
    for (let d = 0; d < 4; d++) {
      const n = i + (dirs[d] as number);
      const nc = this.color[n];
      if (nc === EMPTY) return false;
      if (nc === c && !this.inAtari(this.head[n] as number)) return false;
      if (nc !== c && nc !== EDGE && this.inAtari(this.head[n] as number)) return false;
    }
    return true;
  }

  /**
   * Plays a stone, captures, and handles a (multi-stone) suicide. Assumes the move is legal.
   * Returns the number of stones captured from the opponent.
   */
  play(i: number, c: Color): number {
    const dirs = this.dirs;
    const opp = opponent(c);
    this.placeRaw(i, c);
    let captured = 0;
    let lastCaptured = -1;
    for (let d = 0; d < 4; d++) {
      const n = i + (dirs[d] as number);
      if (this.color[n] === opp && this.libs[this.head[n] as number] === 0) {
        lastCaptured = n;
        captured += this.removeChain(this.head[n] as number);
      }
    }
    const h = this.head[i] as number;
    if (captured > 0) this.capturedBy[c - 1] = (this.capturedBy[c - 1] as number) + captured;
    if (this.libs[h] === 0) {
      // Suicide (only reached when the rules allow it): the opponent takes the stones.
      const lost = this.removeChain(h);
      this.capturedBy[opp - 1] = (this.capturedBy[opp - 1] as number) + lost;
      this.ko = -1;
    } else if (captured === 1 && this.stones[h] === 1 && this.inAtari(h) && this.atariLiberty(h) === lastCaptured) {
      this.ko = lastCaptured;
    } else {
      this.ko = -1;
    }
    this.last2 = this.last;
    this.last = i;
    return captured;
  }

  pass(): void {
    this.ko = -1;
    this.last2 = this.last;
    this.last = -1;
  }

  /** The position hash after colour c plays at i (which must be legal), without playing. */
  hashAfter(i: number, c: Color): [number, number] {
    const dirs = this.dirs;
    const opp = opponent(c);
    let hi = this.hashHi ^ zHi(c, i);
    let lo = this.hashLo ^ zLo(c, i);
    const seen: number[] = [];
    let captures = false;
    for (let d = 0; d < 4; d++) {
      const n = i + (dirs[d] as number);
      if (this.color[n] !== opp) continue;
      const h = this.head[n] as number;
      if (seen.includes(h) || !this.inAtari(h)) continue;
      seen.push(h);
      captures = true;
      for (const s of this.chain(h)) {
        hi ^= zHi(opp, s);
        lo ^= zLo(opp, s);
      }
    }
    if (!captures && this.isSuicide(i, c)) {
      // The new stone and every friendly chain next to it come off.
      hi ^= zHi(c, i);
      lo ^= zLo(c, i);
      const friends: number[] = [];
      for (let d = 0; d < 4; d++) {
        const n = i + (dirs[d] as number);
        if (this.color[n] !== c) continue;
        const h = this.head[n] as number;
        if (friends.includes(h)) continue;
        friends.push(h);
        for (const s of this.chain(h)) {
          hi ^= zHi(c, s);
          lo ^= zLo(c, s);
        }
      }
    }
    return [hi, lo];
  }

  /** How many stones a move at i would capture (0 if none). */
  capturesAt(i: number, c: Color): number {
    const dirs = this.dirs;
    const opp = opponent(c);
    const seen: number[] = [];
    let total = 0;
    for (let d = 0; d < 4; d++) {
      const n = i + (dirs[d] as number);
      if (this.color[n] !== opp) continue;
      const h = this.head[n] as number;
      if (seen.includes(h) || !this.inAtari(h)) continue;
      seen.push(h);
      total += this.stones[h] as number;
    }
    return total;
  }

  /**
   * True when i is an eye-like point of colour c: every neighbour is c or the edge, and the
   * diagonals do not belong to the opponent too much (at most one inside, none on the edge).
   * Playouts never fill such points.
   */
  isEye(i: number, c: Color): boolean {
    const w = this.width;
    const col = this.color;
    if ((col[i - w] !== c && col[i - w] !== EDGE) || (col[i - 1] !== c && col[i - 1] !== EDGE) || (col[i + 1] !== c && col[i + 1] !== EDGE) || (col[i + w] !== c && col[i + w] !== EDGE)) return false;
    const opp = opponent(c);
    let bad = 0;
    let edge = 0;
    let dc = col[i - w - 1];
    if (dc === EDGE) edge = 1;
    else if (dc === opp) bad++;
    dc = col[i - w + 1];
    if (dc === EDGE) edge = 1;
    else if (dc === opp) bad++;
    dc = col[i + w - 1];
    if (dc === EDGE) edge = 1;
    else if (dc === opp) bad++;
    dc = col[i + w + 1];
    if (dc === EDGE) edge = 1;
    else if (dc === opp) bad++;
    return bad + edge < 2;
  }

  /** The current position as text: one character per point, row by row from the top. */
  toText(): string {
    let out = '';
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const c = this.color[this.index(x, y)];
        out += c === BLACK ? 'X' : c === WHITE ? 'O' : '.';
      }
    }
    return out;
  }

  /** Builds a board from one character per point ('.', 'X', 'O'), with no captures. */
  static fromText(size: number, text: string): Board {
    if (text.length !== size * size) throw new Error(`A ${size}×${size} board needs ${size * size} points, not ${text.length}`);
    const b = new Board(size);
    for (let p = 0; p < text.length; p++) {
      const ch = text[p];
      if (ch === 'X' || ch === 'x') b.setStone(b.fromPoint(p), BLACK);
      else if (ch === 'O' || ch === 'o') b.setStone(b.fromPoint(p), WHITE);
      else if (ch !== '.') throw new Error(`"${ch}" is not a point: use '.', 'X' or 'O'`);
    }
    return b;
  }

  /** Chains with no liberty (only possible in a position typed in by hand). */
  deadChains(): number[] {
    const out: number[] = [];
    for (let i = 0; i < this.cells; i++) {
      const c = this.color[i];
      if ((c === BLACK || c === WHITE) && this.head[i] === i && this.libs[i] === 0) out.push(i);
    }
    return out;
  }
}
