/**
 * Reason tags for Chinese Checkers moves (finishes, comes home, a chain of hops, brings up the last
 * marble), shared by the CPU's log lines, the coach's hints and the review. No search here, so the
 * table can load it without the engine.
 */
import { HOLES, NEIGHBOUR, ROW_FROM } from './board';
import type { Layout } from './engine';
import { homeComplete, movePath, PASS } from './engine';
import type { CcAction, CcState } from './rules';
import { boardArray, layoutOf } from './rules';

/** Rows a move gains for the seat making it. */
export function rowsGained(layout: Layout, seat: number, move: number): number {
  if (move === PASS) return 0;
  const point = layout.points[seat] as number;
  return (ROW_FROM[point * HOLES + ((move >> 8) & 0xff)] as number) - (ROW_FROM[point * HOLES + (move & 0xff)] as number);
}

function isStep(action: { from: number; to: number }): boolean {
  for (let d = 0; d < 6; d++) if (NEIGHBOUR[action.from * 6 + d] === action.to) return true;
  return false;
}

/** Reason tags for a move, for the log, the coach and the review. */
export function moveTags(view: CcState, action: CcAction): string[] {
  if (action.type === 'pass') return ['cc-pass'];
  const board = boardArray(view.board);
  const layout = layoutOf(view);
  const seat = view.toMove;
  const home = layout.home[seat] as Uint8Array;
  const point = layout.points[seat] as number;
  const tags: string[] = [];
  const path = movePath(board, seat, layout, view.rules, action.from, action.to) ?? [action.from, action.to];
  const own = board[action.from] as number;
  board[action.to] = own;
  board[action.from] = 0;
  const finished = homeComplete(board, seat, layout, view.rules.finish);
  board[action.from] = own;
  board[action.to] = 0;
  if (finished) tags.push('cc-finishes');
  else if (home[action.to] === 1 && home[action.from] === 0) tags.push('cc-home');
  const hops = isStep(action) ? 0 : path.length - 1;
  if (hops >= 3) tags.push('cc-chain');
  else if (hops >= 1) tags.push('cc-hop');
  // The rearmost marble still out of home, when it is well behind.
  let back = 99;
  for (let h = 0; h < HOLES; h++) if (board[h] === seat + 1 && home[h] === 0) back = Math.min(back, ROW_FROM[point * HOLES + h] as number);
  if (home[action.from] === 0 && ROW_FROM[point * HOLES + action.from] === back && back < 9) tags.push('cc-straggler');
  return tags;
}

export type HintIdea = 'finish' | 'home' | 'chain' | 'hop' | 'straggler' | 'forward' | 'pass';

export function ideaOf(view: CcState, action: CcAction): HintIdea {
  const tags = moveTags(view, action);
  if (tags.includes('cc-pass')) return 'pass';
  if (tags.includes('cc-finishes')) return 'finish';
  if (tags.includes('cc-home')) return 'home';
  if (tags.includes('cc-chain')) return 'chain';
  if (tags.includes('cc-straggler')) return 'straggler';
  if (tags.includes('cc-hop')) return 'hop';
  return 'forward';
}
