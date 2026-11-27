/**
 * Exact solvers for Chinese Checkers lessons and problems (PLAN.md 2.6: "search for the longest
 * chain or fewest moves").
 *
 * - fastestFinish: the fewest of its own moves a seat needs to complete its home, the other marbles
 *   held where they are, and every first move that keeps to that number. Iterative deepening with a
 *   bound that cannot overestimate: a move fills at most one empty hole of the home, so a home with k
 *   empty holes needs at least k more moves. Positions already shown to fail are remembered.
 * - longestMoves: the moves that take a marble furthest towards home (most rows gained).
 */
import { HOLES, ROW_FROM } from './board';
import type { Layout, MoveRules } from './engine';
import { generateMoves, homeComplete, PASS } from './engine';

export interface Finish {
  /** Own moves needed. */
  readonly length: number;
  /** Every first move that finishes in that many moves (packed). */
  readonly firsts: readonly number[];
}

const MAX_DEPTH = 8;
const buffers = Array.from({ length: MAX_DEPTH + 2 }, () => new Int32Array(1024));

function emptyHome(board: Int8Array, seat: number, layout: Layout): number {
  let n = 0;
  for (const h of layout.homeHoles[seat] as readonly number[]) if (board[h] === 0) n++;
  return n;
}

function key(board: Int8Array): string {
  let s = '';
  for (let h = 0; h < HOLES; h++) s += String.fromCharCode(48 + (board[h] as number));
  return s;
}

function play(board: Int8Array, move: number): void {
  const from = move & 0xff;
  const to = (move >> 8) & 0xff;
  board[to] = board[from] as number;
  board[from] = 0;
}

function undo(board: Int8Array, move: number): void {
  const from = move & 0xff;
  const to = (move >> 8) & 0xff;
  board[from] = board[to] as number;
  board[to] = 0;
}

/**
 * The fewest own moves to complete `seat`'s home (up to `max`), with every first move that does it,
 * or null when it takes longer. A home already complete needs 0 moves.
 */
export function fastestFinish(start: Int8Array, seat: number, layout: Layout, rules: MoveRules, max: number): Finish | null {
  const board = Int8Array.from(start);
  if (homeComplete(board, seat, layout, rules.finish)) return { length: 0, firsts: [] };
  const limit = Math.min(max, MAX_DEPTH);
  const failed = new Map<string, number>();
  const can = (left: number, depth: number): boolean => {
    if (homeComplete(board, seat, layout, rules.finish)) return true;
    if (left === 0 || emptyHome(board, seat, layout) > left) return false;
    const k = key(board);
    if ((failed.get(k) ?? -1) >= left) return false;
    const buffer = buffers[depth] as Int32Array;
    const n = generateMoves(board, seat, layout, rules, buffer);
    for (let i = 0; i < n; i++) {
      const m = buffer[i] as number;
      if (m === PASS) continue;
      play(board, m);
      const ok = can(left - 1, depth + 1);
      undo(board, m);
      if (ok) return true;
    }
    failed.set(k, left);
    return false;
  };
  const top = buffers[0] as Int32Array;
  const n = generateMoves(board, seat, layout, rules, top);
  const firstMoves = Array.from(top.subarray(0, n)).filter((m) => m !== PASS);
  for (let length = Math.max(1, emptyHome(board, seat, layout)); length <= limit; length++) {
    const firsts: number[] = [];
    for (const m of firstMoves) {
      play(board, m);
      if (can(length - 1, 1)) firsts.push(m);
      undo(board, m);
    }
    if (firsts.length > 0) return { length, firsts };
  }
  return null;
}

/** Rows a move takes its marble towards the seat's home. */
export function gainOf(layout: Layout, seat: number, move: number): number {
  if (move === PASS) return 0;
  const point = layout.points[seat] as number;
  return (ROW_FROM[point * HOLES + ((move >> 8) & 0xff)] as number) - (ROW_FROM[point * HOLES + (move & 0xff)] as number);
}

/** The moves that gain the most rows, how many, and the best gain of any other move. */
export function longestMoves(board: Int8Array, seat: number, layout: Layout, rules: MoveRules): { gain: number; moves: number[]; next: number } {
  const buffer = buffers[MAX_DEPTH + 1] as Int32Array;
  const n = generateMoves(board, seat, layout, rules, buffer);
  let gain = -Infinity;
  let next = -Infinity;
  let moves: number[] = [];
  for (let i = 0; i < n; i++) {
    const m = buffer[i] as number;
    const g = gainOf(layout, seat, m);
    if (g > gain) {
      next = gain;
      gain = g;
      moves = [m];
    } else if (g === gain) moves.push(m);
    else if (g > next) next = g;
  }
  return { gain, moves, next };
}
