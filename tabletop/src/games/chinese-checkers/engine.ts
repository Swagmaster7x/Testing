/**
 * The Chinese Checkers core shared by the rules, the CPU and the lesson checks, so they can never
 * disagree: where each seat starts and goes, the move generator (steps and hop chains, long jumps,
 * the rules about other points and about marbles at home), the finishing test, "rows to go", and a
 * mutable position for the two-player search (src/ai/pvs.ts).
 *
 * Boards are Int8Arrays of 121 holes: 0 empty, seat + 1 for a marble. Moves are packed in one
 * integer, from | to << 8, and PASS is used only when a seat has no move at all.
 */
import type { PvsGame } from '../../ai/pvs';
import { HOLES, NEIGHBOUR, POINT_HOLES_OF, POINT_OF, ROW_FROM, WIDE_HOLES_OF, distance, opposite } from './board';

export type Jumps = 'adjacent' | 'long';
export type Stopping = 'anywhere' | 'pass-through' | 'never';
export type HomeRule = 'stay' | 'free' | 'frozen';
export type FinishRule = 'filled' | 'own';

export interface MoveRules {
  readonly jumps: Jumps;
  readonly stop: Stopping;
  readonly home: HomeRule;
  readonly finish: FinishRule;
}

export const PLAYER_COUNTS: readonly number[] = [2, 3, 4, 6];
/** The point each seat starts in, by number of players (seats go clockwise). */
export const SEAT_POINTS: Readonly<Record<number, readonly number[]>> = { 2: [0, 3], 3: [0, 2, 4], 4: [0, 1, 3, 4], 6: [0, 1, 2, 3, 4, 5] };

export const PASS = 0x10000;
export const packMove = (from: number, to: number): number => from | (to << 8);
export const moveFrom = (move: number): number => move & 0xff;
export const moveTo = (move: number): number => (move >> 8) & 0xff;

/** Where every seat starts and finishes, for one number of players and marbles. */
export interface Layout {
  readonly players: number;
  readonly marbles: number;
  /** Seat → start point. */
  readonly points: readonly number[];
  readonly startHoles: readonly (readonly number[])[];
  readonly homeHoles: readonly (readonly number[])[];
  /** Per seat, 1 for each hole of its home (HOLES entries a seat). */
  readonly home: readonly Uint8Array[];
  readonly start: readonly Uint8Array[];
  /** Per seat, 1 for each hole of the four points that are neither its start nor its home. */
  readonly other: readonly Uint8Array[];
  /** What "17 minus row" adds up to for a full home: subtracted to give rows to go. */
  readonly rowBase: number;
  /** Per seat and hole: steps from the hole to the nearest hole of the seat's home. */
  readonly toHome: readonly Int8Array[];
  /** The row a marble reaches its home at (14 with ten marbles, 13 with fifteen). */
  readonly homeRow: number;
}

const layouts = new Map<string, Layout>();

export function layoutFor(players: number, marbles: number): Layout {
  const key = `${players}/${marbles}`;
  const cached = layouts.get(key);
  if (cached) return cached;
  const points = SEAT_POINTS[players];
  if (!points) throw new Error(`Chinese Checkers is played by 2, 3, 4 or 6, not ${players}`);
  if (marbles !== 10 && marbles !== 15) throw new Error('Each player has 10 or 15 marbles');
  if (marbles === 15 && players !== 2) throw new Error('Fifteen marbles are for two players only');
  const regionOf = (point: number) => (marbles === 15 ? (WIDE_HOLES_OF[point] as readonly number[]) : (POINT_HOLES_OF[point] as readonly number[]));
  const startHoles = points.map((p) => regionOf(p));
  const homeHoles = points.map((p) => regionOf(opposite(p)));
  const mask = (holes: readonly number[]) => {
    const m = new Uint8Array(HOLES);
    for (const h of holes) m[h] = 1;
    return m;
  };
  const other = points.map((p) => {
    const m = new Uint8Array(HOLES);
    for (let h = 0; h < HOLES; h++) {
      const q = POINT_OF[h] as number;
      if (q >= 0 && q !== p && q !== opposite(p)) m[h] = 1;
    }
    return m;
  });
  // A full home: one marble at the tip (row 17), two a row below, and so on.
  let rowBase = 0;
  let left = marbles;
  for (let row = 17, width = 1; left > 0; row--, width++) {
    const n = Math.min(width, left);
    rowBase += n * (17 - row);
    left -= n;
  }
  const toHome = homeHoles.map((holes) => {
    const d = new Int8Array(HOLES);
    for (let h = 0; h < HOLES; h++) d[h] = Math.min(...holes.map((g) => distance(h, g)));
    return d;
  });
  const layout: Layout = { players, marbles, points, startHoles, homeHoles, home: homeHoles.map(mask), start: startHoles.map(mask), other, rowBase, toHome, homeRow: marbles === 15 ? 13 : 14 };
  layouts.set(key, layout);
  return layout;
}

// ---------------------------------------------------------------------------------------------
// Move generation

const seen = new Int32Array(HOLES);
const reached = new Int32Array(HOLES);
const queue = new Int16Array(HOLES);
const parent = new Int16Array(HOLES);
let stamp = 0;

/** The hole a hop from `h` in direction `d` lands on, or -1 (one marble, adjacent or, with long jumps, at a distance). */
export function hopLanding(board: Int8Array, h: number, d: number, long: boolean): number {
  let c = h;
  let k = 0;
  for (;;) {
    c = NEIGHBOUR[c * 6 + d] as number;
    if (c < 0) return -1;
    k++;
    if (board[c] !== 0) break;
    if (!long) return -1;
  }
  // The marble jumped over is k holes away: k more holes beyond it must be free, the last one the landing.
  for (let i = 0; i < k; i++) {
    c = NEIGHBOUR[c * 6 + d] as number;
    if (c < 0 || board[c] !== 0) return -1;
  }
  return c;
}

/**
 * Fills `out` with every legal move of `seat` and returns how many (PASS alone when it has none).
 * The moving marble is lifted while its chains are traced, so a chain may land on or cross its own
 * starting hole, but a move never ends where it began.
 */
export function generateMoves(board: Int8Array, seat: number, layout: Layout, rules: MoveRules, out: Int32Array): number {
  const own = seat + 1;
  const home = layout.home[seat] as Uint8Array;
  const other = layout.other[seat] as Uint8Array;
  const long = rules.jumps === 'long';
  const closed = rules.stop !== 'anywhere';
  const noLanding = rules.stop === 'never';
  let n = 0;
  for (let from = 0; from < HOLES; from++) {
    if (board[from] !== own) continue;
    const atHome = home[from] === 1;
    if (atHome && rules.home === 'frozen') continue;
    const stayHome = atHome && rules.home === 'stay';
    stamp++;
    for (let d = 0; d < 6; d++) {
      const to = NEIGHBOUR[from * 6 + d] as number;
      if (to < 0 || board[to] !== 0) continue;
      if ((closed && other[to] === 1) || (stayHome && home[to] === 0)) continue;
      reached[to] = stamp;
      out[n++] = from | (to << 8);
    }
    board[from] = 0;
    seen[from] = stamp;
    let head = 0;
    let tail = 0;
    queue[tail++] = from;
    while (head < tail) {
      const h = queue[head++] as number;
      for (let d = 0; d < 6; d++) {
        const land = hopLanding(board, h, d, long);
        if (land < 0 || seen[land] === stamp) continue;
        if (noLanding && other[land] === 1) continue;
        seen[land] = stamp;
        queue[tail++] = land;
        if (land === from || reached[land] === stamp) continue;
        if ((closed && other[land] === 1) || (stayHome && home[land] === 0)) continue;
        reached[land] = stamp;
        out[n++] = from | (land << 8);
      }
    }
    board[from] = own;
  }
  if (n === 0) out[n++] = PASS;
  return n;
}

/**
 * The holes a move passes through: [from, to] for a step, or from and every landing of the
 * shortest hop chain. Null when the move is not possible.
 */
export function movePath(board: Int8Array, seat: number, layout: Layout, rules: MoveRules, from: number, to: number): number[] | null {
  if (board[from] !== seat + 1 || board[to] !== 0 || from === to) return null;
  for (let d = 0; d < 6; d++) if (NEIGHBOUR[from * 6 + d] === to) return [from, to];
  const other = layout.other[seat] as Uint8Array;
  const long = rules.jumps === 'long';
  const noLanding = rules.stop === 'never';
  board[from] = 0;
  stamp++;
  seen[from] = stamp;
  parent[from] = -1;
  let head = 0;
  let tail = 0;
  queue[tail++] = from;
  let found = false;
  while (head < tail && !found) {
    const h = queue[head++] as number;
    for (let d = 0; d < 6; d++) {
      const land = hopLanding(board, h, d, long);
      if (land < 0 || seen[land] === stamp) continue;
      if (noLanding && other[land] === 1) continue;
      seen[land] = stamp;
      parent[land] = h;
      queue[tail++] = land;
      if (land === to) {
        found = true;
        break;
      }
    }
  }
  board[from] = seat + 1;
  if (!found) return null;
  const path: number[] = [];
  for (let h = to; h !== -1; h = parent[h] as number) path.push(h);
  return path.reverse();
}

// ---------------------------------------------------------------------------------------------
// Finishing and rows to go

/** True when the seat's home is complete under the finishing rule. */
export function homeComplete(board: Int8Array, seat: number, layout: Layout, finish: FinishRule): boolean {
  const own = seat + 1;
  let mine = 0;
  for (const h of layout.homeHoles[seat] as readonly number[]) {
    const v = board[h] as number;
    if (v === 0) return false;
    if (v === own) mine++;
    else if (finish === 'own') return false;
  }
  return mine > 0;
}

/** Own marbles sitting in the seat's home. */
export function marblesHome(board: Int8Array, seat: number, layout: Layout): number {
  let n = 0;
  for (const h of layout.homeHoles[seat] as readonly number[]) if (board[h] === seat + 1) n++;
  return n;
}

/** Rows a seat's marbles still have to climb (docs/rules/chinese-checkers.md, rule 12): 0 when all are home. */
export function rowsToGo(board: Int8Array, seat: number, layout: Layout): number {
  const point = layout.points[seat] as number;
  const own = seat + 1;
  let sum = 0;
  for (let h = 0; h < HOLES; h++) if (board[h] === own) sum += 17 - (ROW_FROM[point * HOLES + h] as number);
  return sum - layout.rowBase;
}

// ---------------------------------------------------------------------------------------------
// Evaluation (lower is better for the seat): rows to go, marbles off to the side, stragglers

/** Weights in hundredths of a row. */
export const EVAL = { row: 100, lateral: 30, straggler: 18, tempo: 60 } as const;

/**
 * How far a seat is from finishing, in hundredths of a row: the rows to go, plus a little for each
 * step a marble must take sideways to reach its home, plus a little for each row a marble trails
 * the rest by more than two (a marble left behind has nothing to hop over).
 */
export function seatCost(board: Int8Array, seat: number, layout: Layout): number {
  const point = layout.points[seat] as number;
  const own = seat + 1;
  const toHome = layout.toHome[seat] as Int8Array;
  const home = layout.home[seat] as Uint8Array;
  let rows = 0;
  let lateral = 0;
  let count = 0;
  let sumRow = 0;
  const rowsOf: number[] = [];
  for (let h = 0; h < HOLES; h++) {
    if (board[h] !== own) continue;
    const row = ROW_FROM[point * HOLES + h] as number;
    rows += 17 - row;
    if (home[h] === 0) {
      const excess = (toHome[h] as number) - Math.max(0, layout.homeRow - row);
      if (excess > 0) lateral += excess;
      sumRow += row;
      count++;
      rowsOf.push(row);
    }
  }
  let straggle = 0;
  if (count > 1) {
    const mean = sumRow / count;
    for (const row of rowsOf) if (mean - row > 2) straggle += mean - row - 2;
  }
  return (rows - layout.rowBase) * EVAL.row + lateral * EVAL.lateral + Math.round(straggle * EVAL.straggler);
}

// ---------------------------------------------------------------------------------------------
// The two-player search position

/** A pseudo-random 32-bit table, fixed so searches repeat exactly. */
function table(seed: number, n: number): Int32Array {
  const out = new Int32Array(n);
  let s = seed >>> 0;
  for (let i = 0; i < n; i++) {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    out[i] = (t ^ (t >>> 14)) | 0;
  }
  return out;
}

const ZLO = table(0x1234567, 6 * HOLES);
const ZHI = table(0x89abcde, 6 * HOLES);
const SIDE_LO = 0x5bd1e995 | 0;
const SIDE_HI = 0x27d4eb2f | 0;

/** Score for a decided game (the side to move has won or lost), kept inside the search's mate bound. */
export const DECIDED = 20_000;

/**
 * A two-player position for the principal-variation search. Seats 0 and 1 alternate; the first to
 * complete their home wins. Scores are hundredths of a row from the side to move's point of view.
 */
export class CcPosition implements PvsGame {
  readonly board: Int8Array;
  toMove: number;
  winner = -1;
  /** A seed for a small wobble in the evaluation (a quarter of a row at most), or 0 for none. */
  noise = 0;
  private lo = 0;
  private hi = 0;
  private readonly winners: number[] = [];

  constructor(
    board: Int8Array,
    toMove: number,
    readonly layout: Layout,
    readonly rules: MoveRules,
  ) {
    if (layout.players !== 2) throw new Error('The search position is for two players');
    this.board = Int8Array.from(board);
    this.toMove = toMove;
    for (let h = 0; h < HOLES; h++) {
      const v = this.board[h] as number;
      if (v > 0) {
        this.lo ^= ZLO[(v - 1) * HOLES + h] as number;
        this.hi ^= ZHI[(v - 1) * HOLES + h] as number;
      }
    }
    if (toMove === 1) {
      this.lo ^= SIDE_LO;
      this.hi ^= SIDE_HI;
    }
    if (homeComplete(this.board, 0, layout, rules.finish)) this.winner = 0;
    else if (homeComplete(this.board, 1, layout, rules.finish)) this.winner = 1;
  }

  generate(out: Int32Array, tactical: boolean): number {
    if (tactical || this.winner >= 0) return 0;
    return generateMoves(this.board, this.toMove, this.layout, this.rules, out);
  }

  make(move: number): boolean {
    this.winners.push(this.winner);
    if (move !== PASS) {
      const from = move & 0xff;
      const to = (move >> 8) & 0xff;
      const v = this.board[from] as number;
      this.board[from] = 0;
      this.board[to] = v;
      const s = (v - 1) * HOLES;
      this.lo ^= (ZLO[s + from] as number) ^ (ZLO[s + to] as number);
      this.hi ^= (ZHI[s + from] as number) ^ (ZHI[s + to] as number);
      if (this.winner < 0 && homeComplete(this.board, v - 1, this.layout, this.rules.finish)) this.winner = v - 1;
    }
    this.toMove = 1 - this.toMove;
    this.lo ^= SIDE_LO;
    this.hi ^= SIDE_HI;
    return true;
  }

  unmake(move: number): void {
    this.toMove = 1 - this.toMove;
    this.lo ^= SIDE_LO;
    this.hi ^= SIDE_HI;
    if (move !== PASS) {
      const from = move & 0xff;
      const to = (move >> 8) & 0xff;
      const v = this.board[to] as number;
      this.board[to] = 0;
      this.board[from] = v;
      const s = (v - 1) * HOLES;
      this.lo ^= (ZLO[s + from] as number) ^ (ZLO[s + to] as number);
      this.hi ^= (ZHI[s + from] as number) ^ (ZHI[s + to] as number);
    }
    this.winner = this.winners.pop() ?? -1;
  }

  makeNull(): void {
    this.toMove = 1 - this.toMove;
    this.lo ^= SIDE_LO;
    this.hi ^= SIDE_HI;
  }

  unmakeNull(): void {
    this.makeNull();
  }

  inCheck(): boolean {
    return false;
  }

  evaluate(): number {
    if (this.winner >= 0) return this.winner === this.toMove ? DECIDED : -DECIDED;
    const me = this.toMove;
    const wobble = this.noise === 0 ? 0 : ((Math.imul(this.lo ^ this.noise, 0x9e3779b1) >>> 0) % 51) - 25;
    return seatCost(this.board, 1 - me, this.layout) - seatCost(this.board, me, this.layout) + EVAL.tempo + wobble;
  }

  hashLo(): number {
    return this.lo;
  }

  hashHi(): number {
    return this.hi;
  }

  repetition(): number | null {
    return null;
  }

  noMoves(ply: number): number {
    // Only a finished game has no moves (a blocked seat passes): the side to move has lost.
    return -(32_000 - ply);
  }

  /** Long forward moves are tried first and never reduced. */
  tacticalScore(move: number): number {
    if (move === PASS) return 0;
    const point = this.layout.points[this.toMove] as number;
    const gain = (ROW_FROM[point * HOLES + ((move >> 8) & 0xff)] as number) - (ROW_FROM[point * HOLES + (move & 0xff)] as number);
    return gain >= 3 ? gain : 0;
  }

  gain(): number {
    return 0;
  }
}
