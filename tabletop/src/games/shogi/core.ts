/**
 * The shogi position core: a mutable mailbox board with hands, move generation, make and unmake,
 * attack tests, Zobrist hashing and SFEN. The rules module (rules.ts) wraps it immutably behind the
 * game contract, and the engine searches with it directly, so both always agree. It handles the
 * 9×9 board and 5×5 mini-shogi. Rules as implemented: docs/rules/shogi.md.
 *
 * Squares are mailbox indices. A square on the board is also named by its file (1 on Black's
 * right) and rank (1 at the top, White's side): "76" is file 7, rank 6.
 */

export type BoardKind = 'standard' | 'mini';
/** 0 is Black (sente, moves first in an even game), 1 is White (gote). */
export type Color = 0 | 1;

// Piece types. The first seven are also the hand types, in the order P L N S G B R.
export const PAWN = 0;
export const LANCE = 1;
export const KNIGHT = 2;
export const SILVER = 3;
export const GOLD = 4;
export const BISHOP = 5;
export const ROOK = 6;
export const KING = 7;
export const TOKIN = 8;
export const PRO_LANCE = 9;
export const PRO_KNIGHT = 10;
export const PRO_SILVER = 11;
export const HORSE = 12;
export const DRAGON = 13;
export const PIECE_TYPES = 14;
export const HAND_TYPES = 7;

/** Board codes: 0 empty, Black pieces 1 to 14, White pieces 17 to 30, 64 off the board. */
export const EMPTY = 0;
export const WALL = 64;

export const pieceCode = (color: Color, type: number): number => type + 1 + (color << 4);
export const typeOfCode = (code: number): number => (code & 15) - 1;
export const colorOfCode = (code: number): Color => (code >> 4) as Color;
export const isPieceCode = (code: number): boolean => code > 0 && code < WALL;

/** The promoted type, or -1 for kings and golds (and pieces already promoted). */
export const PROMOTED: readonly number[] = [TOKIN, PRO_LANCE, PRO_KNIGHT, PRO_SILVER, -1, HORSE, DRAGON, -1, -1, -1, -1, -1, -1, -1];
/** The unpromoted type: what a captured piece becomes in hand. */
export const BASE: readonly number[] = [PAWN, LANCE, KNIGHT, SILVER, GOLD, BISHOP, ROOK, KING, PAWN, LANCE, KNIGHT, SILVER, BISHOP, ROOK];
export const canPromoteType = (type: number): boolean => (PROMOTED[type] ?? -1) >= 0;
export const isPromotedType = (type: number): boolean => type >= TOKIN;

/** SFEN letters by type (Black's, upper case). Promoted pieces add a "+". */
export const SFEN_LETTER: readonly string[] = ['P', 'L', 'N', 'S', 'G', 'B', 'R', 'K', '+P', '+L', '+N', '+S', '+B', '+R'];
export const HAND_LETTER: readonly string[] = ['P', 'L', 'N', 'S', 'G', 'B', 'R'];
/** The order SFEN lists pieces in hand: rook, bishop, gold, silver, knight, lance, pawn. */
const SFEN_HAND_ORDER = [ROOK, BISHOP, GOLD, SILVER, KNIGHT, LANCE, PAWN];

// Directions, as seen by Black: 0 north (towards rank 1), then clockwise.
const N = 0;
const NE = 1;
const E = 2;
const SE = 3;
const S = 4;
const SW = 5;
const W = 6;
const NW = 7;

const bits = (...dirs: number[]) => dirs.reduce((m, d) => m | (1 << d), 0);
const GOLDLIKE = bits(N, NE, E, S, W, NW);
const ALL8 = 255;
const DIAG = bits(NE, SE, SW, NW);
const ORTHO = bits(N, E, S, W);
/** One-step directions of each type, for Black. */
const STEP_BLACK: readonly number[] = [bits(N), 0, 0, bits(N, NE, SE, SW, NW), GOLDLIKE, 0, 0, ALL8, GOLDLIKE, GOLDLIKE, GOLDLIKE, GOLDLIKE, ORTHO, DIAG];
/** Sliding directions of each type, for Black. */
const SLIDE_BLACK: readonly number[] = [0, bits(N), 0, 0, 0, DIAG, ORTHO, 0, 0, 0, 0, 0, DIAG, ORTHO];

/** Turns a direction mask round for White. */
const rotate = (mask: number) => ((mask << 4) | (mask >> 4)) & 255;

/** Step and slide masks by board code. */
export const STEP_MASK = new Uint8Array(32);
export const SLIDE_MASK = new Uint8Array(32);
for (let type = 0; type < PIECE_TYPES; type++) {
  STEP_MASK[pieceCode(0, type)] = STEP_BLACK[type]!;
  SLIDE_MASK[pieceCode(0, type)] = SLIDE_BLACK[type]!;
  STEP_MASK[pieceCode(1, type)] = rotate(STEP_BLACK[type]!);
  SLIDE_MASK[pieceCode(1, type)] = rotate(SLIDE_BLACK[type]!);
}

export interface Geometry {
  readonly kind: BoardKind;
  readonly files: number;
  readonly ranks: number;
  /** Depth of each side's promotion zone, in ranks. */
  readonly zone: number;
  readonly stride: number;
  readonly size: number;
  /** Mailbox index of every square, in SFEN order: rank 1 from the highest file down, then rank 2... */
  readonly squares: readonly number[];
  readonly fileOf: Int8Array;
  readonly rankOf: Int8Array;
  /** Index step for each of the eight directions. */
  readonly delta: readonly number[];
  /** Knight jumps by colour. */
  readonly knight: readonly [readonly number[], readonly number[]];
}

function makeGeometry(kind: BoardKind): Geometry {
  const files = kind === 'mini' ? 5 : 9;
  const ranks = files;
  const zone = kind === 'mini' ? 1 : 3;
  const stride = files + 1;
  const size = (ranks + 4) * stride + 1;
  const fileOf = new Int8Array(size);
  const rankOf = new Int8Array(size);
  const squares: number[] = [];
  for (let rank = 1; rank <= ranks; rank++) {
    for (let file = files; file >= 1; file--) {
      const index = (rank + 1) * stride + (files - file) + 1;
      fileOf[index] = file;
      rankOf[index] = rank;
      squares.push(index);
    }
  }
  const delta = [-stride, -stride + 1, 1, stride + 1, stride, stride - 1, -1, -stride - 1];
  return {
    kind,
    files,
    ranks,
    zone,
    stride,
    size,
    squares,
    fileOf,
    rankOf,
    delta,
    knight: [
      [-2 * stride + 1, -2 * stride - 1],
      [2 * stride - 1, 2 * stride + 1],
    ],
  };
}

export const GEOMETRY: Readonly<Record<BoardKind, Geometry>> = { standard: makeGeometry('standard'), mini: makeGeometry('mini') };

export function squareIndex(geo: Geometry, file: number, rank: number): number {
  if (file < 1 || file > geo.files || rank < 1 || rank > geo.ranks) return -1;
  return (rank + 1) * geo.stride + (geo.files - file) + 1;
}

/** "76" for file 7, rank 6. */
export function squareName(geo: Geometry, index: number): string {
  return `${geo.fileOf[index]}${geo.rankOf[index]}`;
}

export function parseSquare(geo: Geometry, name: string): number {
  if (!/^[1-9][1-9]$/.test(name)) return -1;
  return squareIndex(geo, Number(name[0]), Number(name[1]));
}

/** True when `rank` is in `color`'s promotion zone. */
export function inZone(geo: Geometry, color: Color, rank: number): boolean {
  return color === 0 ? rank <= geo.zone : rank > geo.ranks - geo.zone;
}

/** Ranks a piece of this type could never move from (the last rank, or two for a knight). */
export function deadRank(geo: Geometry, color: Color, type: number, rank: number): boolean {
  const fromEnd = color === 0 ? rank - 1 : geo.ranks - rank;
  if (type === PAWN || type === LANCE) return fromEnd < 1;
  if (type === KNIGHT) return fromEnd < 2;
  return false;
}

// ---------------------------------------------------------------------------------------------
// Moves are packed into one integer:
//   bits 0-7 to, 8-15 from (0 for a drop), 16 promotes, 17 drop, 18-20 dropped type,
//   21-25 the board code captured, 26-30 the board code of the piece that moves.
// ---------------------------------------------------------------------------------------------
export const PROMOTE_FLAG = 1 << 16;
export const DROP_FLAG = 1 << 17;

export const moveTo = (m: number): number => m & 0xff;
export const moveFrom = (m: number): number => (m >>> 8) & 0xff;
export const isPromotion = (m: number): boolean => (m & PROMOTE_FLAG) !== 0;
export const isDrop = (m: number): boolean => (m & DROP_FLAG) !== 0;
export const dropType = (m: number): number => (m >>> 18) & 7;
export const capturedOf = (m: number): number => (m >>> 21) & 31;
export const movingOf = (m: number): number => (m >>> 26) & 31;

export function encodeMove(from: number, to: number, promote: boolean, moving: number, captured: number): number {
  return to | (from << 8) | (promote ? PROMOTE_FLAG : 0) | (captured << 21) | (moving << 26);
}

export function encodeDrop(type: number, to: number, color: Color): number {
  return to | DROP_FLAG | (type << 18) | (pieceCode(color, type) << 26);
}

// Zobrist keys, from a fixed seed so hashes are the same in every run.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (t ^ (t >>> 14)) | 0;
  };
}

const MAX_SIZE = GEOMETRY.standard.size;
const MAX_COUNT = 19;
const keyRng = mulberry32(0x5a0b1);
const PIECE_KEY_LO = new Int32Array(32 * MAX_SIZE).map(() => keyRng());
const PIECE_KEY_HI = new Int32Array(32 * MAX_SIZE).map(() => keyRng());
const HAND_KEY_LO = new Int32Array(2 * HAND_TYPES * MAX_COUNT).map(() => keyRng());
const HAND_KEY_HI = new Int32Array(2 * HAND_TYPES * MAX_COUNT).map(() => keyRng());
const SIDE_KEY_LO = keyRng();
const SIDE_KEY_HI = keyRng();

const handSlot = (color: Color, type: number, count: number) => (color * HAND_TYPES + type) * MAX_COUNT + Math.min(count, MAX_COUNT - 1);

/** How many of each type a full set has, per side (standard board): for checking positions. */
export const SET_COUNT: Readonly<Record<BoardKind, readonly number[]>> = {
  standard: [18, 4, 4, 4, 4, 2, 2, 2],
  mini: [2, 0, 0, 2, 2, 2, 2, 2],
};

export class SfenError extends Error {}

export class Position {
  readonly geo: Geometry;
  readonly board: Int8Array;
  /** Counts in hand, colour * 7 + type. */
  readonly hand: Int8Array;
  side: Color = 0;
  /** The number SFEN gives the next move (1 at the start of a game). */
  moveNumber = 1;
  readonly kings = new Int16Array([-1, -1]);
  /** Unpromoted pawns per colour and file, for the two-pawns rule: colour * 10 + file. */
  readonly pawns = new Int8Array(20);
  hashLo = 0;
  hashHi = 0;

  constructor(kind: BoardKind) {
    this.geo = GEOMETRY[kind];
    this.board = new Int8Array(this.geo.size).fill(WALL);
    for (const sq of this.geo.squares) this.board[sq] = EMPTY;
    this.hand = new Int8Array(2 * HAND_TYPES);
    this.rehash();
  }

  clone(): Position {
    const p = new Position(this.geo.kind);
    p.board.set(this.board);
    p.hand.set(this.hand);
    p.side = this.side;
    p.moveNumber = this.moveNumber;
    p.kings.set(this.kings);
    p.pawns.set(this.pawns);
    p.hashLo = this.hashLo;
    p.hashHi = this.hashHi;
    return p;
  }

  /** Recomputes the hash and the pawn and king records from the board and hands. */
  rehash(): void {
    let lo = 0;
    let hi = 0;
    this.kings[0] = -1;
    this.kings[1] = -1;
    this.pawns.fill(0);
    for (const sq of this.geo.squares) {
      const code = this.board[sq]!;
      if (code === EMPTY) continue;
      lo ^= PIECE_KEY_LO[code * MAX_SIZE + sq]!;
      hi ^= PIECE_KEY_HI[code * MAX_SIZE + sq]!;
      const type = typeOfCode(code);
      const color = colorOfCode(code);
      if (type === KING) this.kings[color] = sq;
      if (type === PAWN) this.pawns[color * 10 + this.geo.fileOf[sq]!]!++;
    }
    for (let color = 0 as Color; color <= 1; color = (color + 1) as Color) {
      for (let type = 0; type < HAND_TYPES; type++) {
        const slot = handSlot(color, type, this.hand[color * HAND_TYPES + type]!);
        lo ^= HAND_KEY_LO[slot]!;
        hi ^= HAND_KEY_HI[slot]!;
      }
    }
    if (this.side === 1) {
      lo ^= SIDE_KEY_LO;
      hi ^= SIDE_KEY_HI;
    }
    this.hashLo = lo;
    this.hashHi = hi;
  }

  handCount(color: Color, type: number): number {
    return this.hand[color * HAND_TYPES + type]!;
  }

  // -------------------------------------------------------------------------------------------
  // Attacks
  // -------------------------------------------------------------------------------------------

  /** True when a piece of `by` attacks square `sq`. */
  attacked(sq: number, by: Color): boolean {
    const board = this.board;
    const delta = this.geo.delta;
    for (let d = 0; d < 8; d++) {
      const step = delta[d]!;
      const back = 1 << ((d + 4) & 7);
      let x = sq + step;
      let code = board[x]!;
      if (code !== EMPTY) {
        if (code < WALL && colorOfCode(code) === by && ((STEP_MASK[code]! | SLIDE_MASK[code]!) & back) !== 0) return true;
        continue;
      }
      x += step;
      code = board[x]!;
      while (code === EMPTY) {
        x += step;
        code = board[x]!;
      }
      if (code < WALL && colorOfCode(code) === by && (SLIDE_MASK[code]! & back) !== 0) return true;
    }
    const knightCode = pieceCode(by, KNIGHT);
    const jumps = this.geo.knight[by];
    if (board[sq - jumps[0]!] === knightCode || board[sq - jumps[1]!] === knightCode) return true;
    return false;
  }

  /** Squares of `by`'s pieces that attack `sq`. */
  attackers(sq: number, by: Color): number[] {
    const out: number[] = [];
    const board = this.board;
    const delta = this.geo.delta;
    for (let d = 0; d < 8; d++) {
      const step = delta[d]!;
      const back = 1 << ((d + 4) & 7);
      let x = sq + step;
      let code = board[x]!;
      if (code !== EMPTY) {
        if (code < WALL && colorOfCode(code) === by && ((STEP_MASK[code]! | SLIDE_MASK[code]!) & back) !== 0) out.push(x);
        continue;
      }
      x += step;
      code = board[x]!;
      while (code === EMPTY) {
        x += step;
        code = board[x]!;
      }
      if (code < WALL && colorOfCode(code) === by && (SLIDE_MASK[code]! & back) !== 0) out.push(x);
    }
    const knightCode = pieceCode(by, KNIGHT);
    for (const j of this.geo.knight[by]) if (board[sq - j] === knightCode) out.push(sq - j);
    return out;
  }

  /** True when the side to move is in check. */
  inCheck(): boolean {
    const king = this.kings[this.side]!;
    return king >= 0 && this.attacked(king, (1 - this.side) as Color);
  }

  /** True when `color`'s king is attacked. */
  kingAttacked(color: Color): boolean {
    const king = this.kings[color]!;
    return king >= 0 && this.attacked(king, (1 - color) as Color);
  }

  /** True when a piece with board code `code` standing on `from` attacks `to` (on this board). */
  pieceAttacks(code: number, from: number, to: number): boolean {
    const delta = this.geo.delta;
    const color = colorOfCode(code);
    const type = typeOfCode(code);
    if (type === KNIGHT) {
      const jumps = this.geo.knight[color];
      return from + jumps[0]! === to || from + jumps[1]! === to;
    }
    const steps = STEP_MASK[code]!;
    const slides = SLIDE_MASK[code]!;
    for (let d = 0; d < 8; d++) {
      const bit = 1 << d;
      if (((steps | slides) & bit) === 0) continue;
      const step = delta[d]!;
      let x = from + step;
      if (x === to) return true;
      if ((slides & bit) === 0) continue;
      while (this.board[x] === EMPTY) {
        x += step;
        if (x === to) return true;
      }
    }
    return false;
  }

  // -------------------------------------------------------------------------------------------
  // Move generation
  // -------------------------------------------------------------------------------------------

  /**
   * Fills `out` with pseudo-legal moves for the side to move and returns the count: every piece
   * movement (with and without promotion where both are allowed, never a move that leaves a
   * piece with no future move) and every drop allowed by the two-pawns and dead-piece rules.
   * King safety and pawn-drop mate are checked by `isLegal`.
   */
  generate(out: Int32Array, captureOnly = false): number {
    let n = this.generateBoardMoves(out, 0, captureOnly);
    if (!captureOnly) n = this.generateDrops(out, n);
    return n;
  }

  generateBoardMoves(out: Int32Array, start: number, captureOnly: boolean): number {
    const { board, geo } = this;
    const side = this.side;
    const delta = geo.delta;
    let n = start;
    for (const from of geo.squares) {
      const code = board[from]!;
      if (code === EMPTY || colorOfCode(code) !== side) continue;
      const type = typeOfCode(code);
      if (type === KNIGHT) {
        for (const j of geo.knight[side]) n = this.addMove(out, n, code, type, from, from + j, captureOnly);
        continue;
      }
      const steps = STEP_MASK[code]!;
      const slides = SLIDE_MASK[code]!;
      for (let d = 0; d < 8; d++) {
        const bit = 1 << d;
        if ((slides & bit) !== 0) {
          const step = delta[d]!;
          let to = from + step;
          while (board[to] === EMPTY) {
            n = this.addMove(out, n, code, type, from, to, captureOnly);
            to += step;
          }
          n = this.addMove(out, n, code, type, from, to, captureOnly);
        } else if ((steps & bit) !== 0) {
          n = this.addMove(out, n, code, type, from, from + delta[d]!, captureOnly);
        }
      }
    }
    return n;
  }

  private addMove(out: Int32Array, n: number, code: number, type: number, from: number, to: number, captureOnly: boolean): number {
    const target = this.board[to]!;
    if (target === WALL) return n;
    if (target !== EMPTY && colorOfCode(target) === this.side) return n;
    if (captureOnly && target === EMPTY) return n;
    const geo = this.geo;
    const side = this.side;
    if (canPromoteType(type) && (inZone(geo, side, geo.rankOf[from]!) || inZone(geo, side, geo.rankOf[to]!))) {
      out[n++] = encodeMove(from, to, true, code, target);
      if (deadRank(geo, side, type, geo.rankOf[to]!)) return n;
    }
    out[n++] = encodeMove(from, to, false, code, target);
    return n;
  }

  generateDrops(out: Int32Array, start: number): number {
    const { board, geo } = this;
    const side = this.side;
    let n = start;
    for (let type = 0; type < HAND_TYPES; type++) {
      if (this.hand[side * HAND_TYPES + type] === 0) continue;
      for (const to of geo.squares) {
        if (board[to] !== EMPTY) continue;
        if (deadRank(geo, side, type, geo.rankOf[to]!)) continue;
        if (type === PAWN && this.pawns[side * 10 + geo.fileOf[to]!]! > 0) continue;
        out[n++] = encodeDrop(type, to, side);
      }
    }
    return n;
  }

  /** True when a pseudo-legal move is legal: it does not leave the king attacked and is not pawn-drop mate. */
  isLegal(m: number): boolean {
    const side = this.side;
    if (isDrop(m)) {
      if (dropType(m) === PAWN && this.isPawnDropMate(m)) return false;
      if (!this.kingAttacked(side)) return true;
      this.make(m);
      const ok = !this.kingAttacked(side);
      this.unmake(m);
      return ok;
    }
    const king = this.kings[side]!;
    if (king < 0) return true;
    const from = moveFrom(m);
    // A piece that is not the king, off every line through the king, cannot expose it.
    if (from !== king && !this.kingAttacked(side) && !this.aligned(from, king)) return true;
    this.make(m);
    const ok = !this.kingAttacked(side);
    this.unmake(m);
    return ok;
  }

  private aligned(a: number, b: number): boolean {
    const fa = this.geo.fileOf[a]!;
    const fb = this.geo.fileOf[b]!;
    const ra = this.geo.rankOf[a]!;
    const rb = this.geo.rankOf[b]!;
    return fa === fb || ra === rb || Math.abs(fa - fb) === Math.abs(ra - rb);
  }

  /** True when this pawn drop gives check and the opponent has no legal answer. */
  isPawnDropMate(m: number): boolean {
    const side = this.side;
    const enemy = (1 - side) as Color;
    const king = this.kings[enemy]!;
    const to = moveTo(m);
    if (king < 0 || to + this.geo.delta[side === 0 ? N : S]! !== king) return false;
    this.make(m);
    // A pawn's check is next to the king, so no drop can block it: only board moves can answer.
    const replies = new Int32Array(256);
    const count = this.generateBoardMoves(replies, 0, false);
    let escape = false;
    for (let i = 0; i < count; i++) {
      if (this.isLegal(replies[i]!)) {
        escape = true;
        break;
      }
    }
    this.unmake(m);
    return !escape;
  }

  /** Every legal move, as packed integers. */
  legalMoves(): number[] {
    const buffer = new Int32Array(1024);
    const count = this.generate(buffer);
    const out: number[] = [];
    for (let i = 0; i < count; i++) if (this.isLegal(buffer[i]!)) out.push(buffer[i]!);
    return out;
  }

  /** True when the side to move has at least one legal move. */
  hasLegalMove(): boolean {
    const buffer = new Int32Array(1024);
    const boardCount = this.generateBoardMoves(buffer, 0, false);
    for (let i = 0; i < boardCount; i++) if (this.isLegal(buffer[i]!)) return true;
    const count = this.generateDrops(buffer, 0);
    for (let i = 0; i < count; i++) if (this.isLegal(buffer[i]!)) return true;
    return false;
  }

  /** True when the move gives check (made, tested and taken back). */
  givesCheck(m: number): boolean {
    this.make(m);
    const check = this.inCheck();
    this.unmake(m);
    return check;
  }

  // -------------------------------------------------------------------------------------------
  // Make and unmake
  // -------------------------------------------------------------------------------------------

  private setHand(color: Color, type: number, count: number): void {
    const index = color * HAND_TYPES + type;
    const before = this.hand[index]!;
    const a = handSlot(color, type, before);
    const b = handSlot(color, type, count);
    this.hashLo ^= HAND_KEY_LO[a]! ^ HAND_KEY_LO[b]!;
    this.hashHi ^= HAND_KEY_HI[a]! ^ HAND_KEY_HI[b]!;
    this.hand[index] = count;
  }

  private place(sq: number, code: number): void {
    this.board[sq] = code;
    this.hashLo ^= PIECE_KEY_LO[code * MAX_SIZE + sq]!;
    this.hashHi ^= PIECE_KEY_HI[code * MAX_SIZE + sq]!;
    const type = typeOfCode(code);
    const color = colorOfCode(code);
    if (type === KING) this.kings[color] = sq;
    else if (type === PAWN) this.pawns[color * 10 + this.geo.fileOf[sq]!]!++;
  }

  private lift(sq: number): void {
    const code = this.board[sq]!;
    this.board[sq] = EMPTY;
    this.hashLo ^= PIECE_KEY_LO[code * MAX_SIZE + sq]!;
    this.hashHi ^= PIECE_KEY_HI[code * MAX_SIZE + sq]!;
    const type = typeOfCode(code);
    const color = colorOfCode(code);
    if (type === KING) this.kings[color] = -1;
    else if (type === PAWN) this.pawns[color * 10 + this.geo.fileOf[sq]!]!--;
  }

  private flipSide(): void {
    this.side = (1 - this.side) as Color;
    this.hashLo ^= SIDE_KEY_LO;
    this.hashHi ^= SIDE_KEY_HI;
  }

  make(m: number): void {
    const side = this.side;
    const to = moveTo(m);
    if (isDrop(m)) {
      const type = dropType(m);
      this.setHand(side, type, this.hand[side * HAND_TYPES + type]! - 1);
      this.place(to, pieceCode(side, type));
    } else {
      const from = moveFrom(m);
      const moving = movingOf(m);
      const captured = capturedOf(m);
      if (captured !== EMPTY) {
        this.lift(to);
        const base = BASE[typeOfCode(captured)]!;
        if (base !== KING) this.setHand(side, base, this.hand[side * HAND_TYPES + base]! + 1);
      }
      this.lift(from);
      this.place(to, isPromotion(m) ? pieceCode(side, PROMOTED[typeOfCode(moving)]!) : moving);
    }
    this.flipSide();
    this.moveNumber++;
  }

  unmake(m: number): void {
    this.moveNumber--;
    this.flipSide();
    const side = this.side;
    const to = moveTo(m);
    if (isDrop(m)) {
      const type = dropType(m);
      this.lift(to);
      this.setHand(side, type, this.hand[side * HAND_TYPES + type]! + 1);
    } else {
      const from = moveFrom(m);
      const captured = capturedOf(m);
      this.lift(to);
      this.place(from, movingOf(m));
      if (captured !== EMPTY) {
        this.place(to, captured);
        const base = BASE[typeOfCode(captured)]!;
        if (base !== KING) this.setHand(side, base, this.hand[side * HAND_TYPES + base]! - 1);
      }
    }
  }

  /** Passes the turn (for the engine's null-move search and "what do they threaten?"). */
  makeNull(): void {
    this.flipSide();
  }

  unmakeNull(): void {
    this.flipSide();
  }

  // -------------------------------------------------------------------------------------------
  // SFEN
  // -------------------------------------------------------------------------------------------

  /** Board, side and hands: everything that decides repetition, without the move number. */
  key(): string {
    const parts = this.sfen().split(' ');
    return parts.slice(0, 3).join(' ');
  }

  sfen(): string {
    const { geo, board } = this;
    const rows: string[] = [];
    for (let rank = 1; rank <= geo.ranks; rank++) {
      let row = '';
      let empty = 0;
      for (let file = geo.files; file >= 1; file--) {
        const code = board[squareIndex(geo, file, rank)]!;
        if (code === EMPTY) {
          empty++;
          continue;
        }
        if (empty > 0) row += String(empty);
        empty = 0;
        const letter = SFEN_LETTER[typeOfCode(code)]!;
        row += colorOfCode(code) === 0 ? letter : letter.toLowerCase();
      }
      rows.push(empty > 0 ? row + String(empty) : row);
    }
    let hand = '';
    for (const color of [0, 1] as const) {
      for (const type of SFEN_HAND_ORDER) {
        const count = this.hand[color * HAND_TYPES + type]!;
        if (count === 0) continue;
        const letter = color === 0 ? HAND_LETTER[type]! : HAND_LETTER[type]!.toLowerCase();
        hand += count > 1 ? `${count}${letter}` : letter;
      }
    }
    return `${rows.join('/')} ${this.side === 0 ? 'b' : 'w'} ${hand || '-'} ${this.moveNumber}`;
  }
}

const LETTER_TYPE: Readonly<Record<string, number>> = { P: PAWN, L: LANCE, N: KNIGHT, S: SILVER, G: GOLD, B: BISHOP, R: ROOK, K: KING };

/** The board kind an SFEN describes, from its number of ranks. */
export function sfenBoardKind(sfen: string): BoardKind {
  const rows = sfen.trim().split(/\s+/)[0]?.split('/') ?? [];
  if (rows.length === 9) return 'standard';
  if (rows.length === 5) return 'mini';
  throw new SfenError(`An SFEN board has 9 ranks (or 5 for mini-shogi), not ${rows.length}`);
}

/** Reads an SFEN. Checks its form, not whether the position could arise (see positionProblems). */
export function parseSfen(sfen: string): Position {
  const fields = sfen.trim().split(/\s+/);
  const [boardField, sideField, handField = '-', numberField = '1'] = fields;
  if (!boardField || !sideField) throw new SfenError(`"${sfen}" is not an SFEN position`);
  const kind = sfenBoardKind(sfen);
  const p = new Position(kind);
  const geo = p.geo;
  const rows = boardField.split('/');
  rows.forEach((row, r) => {
    const rank = r + 1;
    let file = geo.files;
    let promoted = false;
    for (const ch of row) {
      if (ch === '+') {
        promoted = true;
        continue;
      }
      if (/[1-9]/.test(ch)) {
        if (promoted) throw new SfenError(`A "+" must come before a piece letter in ${row}`);
        file -= Number(ch);
        continue;
      }
      const type = LETTER_TYPE[ch.toUpperCase()];
      if (type === undefined) throw new SfenError(`"${ch}" is not a shogi piece letter`);
      if (file < 1) throw new SfenError(`Rank ${rank} has too many squares in ${row}`);
      let finalType = type;
      if (promoted) {
        const up = PROMOTED[type]!;
        if (up < 0) throw new SfenError(`A ${ch} cannot be promoted`);
        finalType = up;
        promoted = false;
      }
      p.board[squareIndex(geo, file, rank)] = pieceCode(ch === ch.toUpperCase() ? 0 : 1, finalType);
      file--;
    }
    if (file !== 0) throw new SfenError(`Rank ${rank} should have ${geo.files} squares: ${row}`);
  });
  if (sideField !== 'b' && sideField !== 'w') throw new SfenError(`The side to move is "b" or "w", not "${sideField}"`);
  p.side = sideField === 'b' ? 0 : 1;
  if (handField !== '-') {
    let count = 0;
    for (const ch of handField) {
      if (/[0-9]/.test(ch)) {
        count = count * 10 + Number(ch);
        continue;
      }
      const type = LETTER_TYPE[ch.toUpperCase()];
      if (type === undefined || type === KING) throw new SfenError(`"${ch}" cannot be in hand`);
      const color: Color = ch === ch.toUpperCase() ? 0 : 1;
      p.hand[color * HAND_TYPES + type]! += count === 0 ? 1 : count;
      count = 0;
    }
  }
  const moveNumber = Number(numberField);
  if (!Number.isInteger(moveNumber) || moveNumber < 1) throw new SfenError(`The move number must be a whole number from 1, not "${numberField}"`);
  p.moveNumber = moveNumber;
  p.rehash();
  return p;
}

/** Reasons a parsed position could not occur in a game (empty when it is fine). */
export function positionProblems(p: Position): string[] {
  const problems: string[] = [];
  const { geo, board } = p;
  const counts = [new Array<number>(8).fill(0), new Array<number>(8).fill(0)];
  for (const sq of geo.squares) {
    const code = board[sq]!;
    if (code === EMPTY) continue;
    const color = colorOfCode(code);
    const type = typeOfCode(code);
    counts[color]![BASE[type]!]!++;
    if (deadRank(geo, color, type, geo.rankOf[sq]!)) problems.push(`a piece on ${squareName(geo, sq)} could never move`);
  }
  for (const color of [0, 1] as const) {
    for (let type = 0; type < HAND_TYPES; type++) counts[color]![type]! += p.hand[color * HAND_TYPES + type]!;
    if (counts[color]![KING] !== 1) problems.push(`${color === 0 ? 'Black' : 'White'} needs exactly one king`);
    for (let file = 1; file <= geo.files; file++) if (p.pawns[color * 10 + file]! > 1) problems.push(`two ${color === 0 ? 'Black' : 'White'} pawns on file ${file}`);
  }
  const limit = SET_COUNT[geo.kind];
  for (let type = 0; type < 7; type++) {
    if (counts[0]![type]! + counts[1]![type]! > limit[type]!) problems.push(`too many pieces of one kind (${HAND_LETTER[type]})`);
  }
  if (p.kingAttacked((1 - p.side) as Color)) problems.push('the side not to move is in check');
  return problems;
}

/** The standard and mini-shogi starting positions. */
export const START_SFEN: Readonly<Record<BoardKind, string>> = {
  standard: 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1',
  mini: 'rbsgk/4p/5/P4/KGSBR b - 1',
};

/** Counts leaves `depth` plies below the position: the perft cross-check. */
export function perft(p: Position, depth: number): number {
  const buffer = new Int32Array(1024);
  const count = p.generate(buffer);
  let total = 0;
  for (let i = 0; i < count; i++) {
    const m = buffer[i]!;
    if (!p.isLegal(m)) continue;
    if (depth <= 1) {
      total++;
      continue;
    }
    p.make(m);
    total += perft(p, depth - 1);
    p.unmake(m);
  }
  return total;
}
