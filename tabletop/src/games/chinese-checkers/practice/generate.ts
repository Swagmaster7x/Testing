/**
 * Chinese Checkers problems, generated from the CPU's own games and proved by the solvers in
 * solver.ts (PLAN.md 2.6). scripts/chinese-checkers-problems.ts writes them to problems.json; the
 * unit tests prove every one again.
 *
 * - Longest hop: the side to move has exactly one move that takes a marble furthest towards home,
 *   at least four rows by a chain of two or more hops; every other move falls at least a row short.
 * - Race endgame: the side to move can complete its home in two to four of its own moves (the other
 *   marbles held where they are, which they are: no other marble is near its home), and at most three
 *   first moves do it that fast (each of them counts as right), while some other move fills a hole of
 *   the home and still loses time, or every other move is slower.
 */
import { createRng } from '../../../core/rng';
import { HOLES, NEIGHBOUR, distance } from '../board';
import { chooseWith, LEVEL_PARAMS } from '../bots';
import type { CcState } from '../rules';
import { actionOf, boardArray, chineseCheckers, layoutOf, makeConfig, positionText } from '../rules';
import { fastestFinish, longestMoves } from '../solver';
import { generateMoves, movePath } from '../engine';

/** A problem: id, position, the solution's first move, rating, themes, and other first moves that are as fast. */
export type ProblemRow = readonly [id: string, position: string, line: string, rating: number, themes: string, also?: string];

const code = (move: number) => chineseCheckers.codec.action.toJSON(actionOf(move)) as string;

function isStep(from: number, to: number): boolean {
  for (let d = 0; d < 6; d++) if (NEIGHBOUR[from * 6 + d] === to) return true;
  return false;
}

/** A longest-hop problem in this position, or null. */
export function hopProblem(state: CcState): { line: string; rating: number; themes: string[] } | null {
  if (state.end !== null || state.players !== 2) return null;
  const board = boardArray(state.board);
  const layout = layoutOf(state);
  const seat = state.toMove;
  const { gain, moves, next } = longestMoves(board, seat, layout, state.rules);
  if (moves.length !== 1 || gain < 4 || next > gain - 1) return null;
  const move = moves[0] as number;
  const from = move & 0xff;
  const to = (move >> 8) & 0xff;
  if (isStep(from, to)) return null;
  const path = movePath(board, seat, layout, state.rules, from, to);
  if (!path || path.length < 3) return null;
  const hops = path.length - 1;
  // Hops over another colour's marble make the "their marbles" theme.
  let theirs = false;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1] as number;
    const b = path[i] as number;
    for (let d = 0; d < 6; d++) {
      const mid = NEIGHBOUR[a * 6 + d] as number;
      if (mid >= 0 && NEIGHBOUR[mid * 6 + d] === b && board[mid] !== 0 && board[mid] !== seat + 1) theirs = true;
    }
  }
  const themes = [hops >= 3 ? 'cc-chain' : 'cc-hop', ...(theirs ? ['cc-their'] : [])];
  // Harder with more hops and more moves that come close.
  const rating = Math.round(500 + 110 * hops + 40 * Math.max(0, next - (gain - 3)));
  return { line: code(move), rating, themes };
}

/** True when no other colour's marble is within `near` holes of the seat's home. */
function homeIsClear(state: CcState, near: number): boolean {
  const board = boardArray(state.board);
  const layout = layoutOf(state);
  const seat = state.toMove;
  for (let h = 0; h < HOLES; h++) {
    const v = board[h] as number;
    if (v === 0 || v === seat + 1) continue;
    for (const g of layout.homeHoles[seat] as readonly number[]) if (distance(h, g) <= near) return false;
  }
  return true;
}

/** A race endgame in this position, or null. */
export function raceProblem(state: CcState): { line: string; also: string[]; rating: number; themes: string[]; length: number } | null {
  if (state.end !== null || state.players !== 2 || !homeIsClear(state, 2)) return null;
  const board = boardArray(state.board);
  const layout = layoutOf(state);
  const seat = state.toMove;
  const home = layout.home[seat] as Uint8Array;
  const empty = (layout.homeHoles[seat] as readonly number[]).filter((h) => board[h] === 0).length;
  if (empty < 2 || empty > 4) return null;
  const finish = fastestFinish(board, seat, layout, state.rules, 4);
  if (!finish || finish.length < 2 || finish.firsts.length > 3) return null;
  // A tempting move: it brings a marble into an empty hole of the home, yet it is not one of the fastest.
  const fastest = new Set(finish.firsts);
  const buffer = new Int32Array(1024);
  const n = generateMoves(board, seat, layout, state.rules, buffer);
  let tempting = false;
  for (let i = 0; i < n; i++) {
    const m = buffer[i] as number;
    if (!fastest.has(m) && home[(m >> 8) & 0xff] === 1 && home[m & 0xff] === 0) tempting = true;
  }
  const [first, ...rest] = finish.firsts.map(code);
  const themes = ['cc-race', ...(tempting ? ['cc-tip'] : [])];
  const rating = 600 + 230 * (finish.length - 2) + (tempting ? 140 : 0) + (rest.length === 0 ? 60 : 0);
  return { line: first as string, also: rest, rating, themes, length: finish.length };
}

/** Positions from one of the CPU's games, from a seed: two mid-strength levels, a little noise. */
export function gamePositions(seed: string): CcState[] {
  const rng = createRng(seed);
  const levels = [2 + rng.int(3), 2 + rng.int(3)];
  let state = chineseCheckers.setup(makeConfig(2), rng);
  const out: CcState[] = [];
  for (let ply = 0; ply < 400 && state.end === null; ply++) {
    out.push(state);
    const params = LEVEL_PARAMS[levels[state.toMove] ?? 3];
    if (!params) break;
    const { move } = chooseWith(state, params, createRng(`${seed}/${ply}`));
    state = chineseCheckers.apply(state, actionOf(move)).state;
  }
  return out;
}

export interface Generated {
  readonly hops: ProblemRow[];
  readonly race: ProblemRow[];
}

/** Problems from numbered seeds, until each set has `want` (each position used once). */
export function generateProblems(want: number, maxGames = 400, log?: (text: string) => void): Generated {
  const hops: ProblemRow[] = [];
  const race: ProblemRow[] = [];
  const seen = new Set<string>();
  for (let g = 0; g < maxGames && (hops.length < want || race.length < want); g++) {
    const positions = gamePositions(`cc-problems/${g}`);
    let lastHop = -10;
    for (const [ply, state] of positions.entries()) {
      const text = positionText(state);
      if (seen.has(text)) continue;
      seen.add(text);
      // Hop problems from different moments of a game, not five in a row.
      if (hops.length < want && ply - lastHop >= 6) {
        const p = hopProblem(state);
        if (p) {
          hops.push([`cc:hop:${g}:${ply}`, text, p.line, p.rating, p.themes.join(' ')]);
          lastHop = ply;
        }
      }
      if (race.length < want) {
        const p = raceProblem(state);
        if (p) race.push(p.also.length > 0 ? [`cc:race:${g}:${ply}`, text, p.line, p.rating, p.themes.join(' '), p.also.join(' ')] : [`cc:race:${g}:${ply}`, text, p.line, p.rating, p.themes.join(' ')]);
      }
    }
    log?.(`game ${g}: ${hops.length} hop problems, ${race.length} race endgames`);
  }
  return { hops, race };
}

export { positionText };
