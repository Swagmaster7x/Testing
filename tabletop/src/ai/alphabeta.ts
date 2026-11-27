/**
 * Alpha-beta search (negamax form) with iterative deepening and a transposition table.
 *
 * Strength is set by depth and a node budget, never by time, so a level plays the same on a slow
 * phone and in tests. The first depth always finishes; after that the search stops when the
 * budget runs out and keeps the deepest depth it finished.
 *
 * Root moves are each searched with a full window, so every root move gets an exact score at the
 * finished depth. Weak levels use those scores to make human-looking choices.
 */
import type { Rng } from '../core/rng';

export interface SearchSpace<S, M> {
  moves(state: S): readonly M[];
  play(state: S, move: M): S;
  /** The final result for the side to move (1 win, -1 loss, 0 draw), or null while play goes on. */
  result(state: S): number | null;
  /** A heuristic score for the side to move. Keep it well inside ±WIN / 2. */
  evaluate(state: S): number;
  /** Identifies the position, side to move included. */
  key(state: S): string;
}

export interface SearchLimits {
  readonly maxDepth: number;
  readonly nodeBudget: number;
}

export interface ScoredMove<M> {
  readonly move: M;
  readonly score: number;
}

export interface SearchResult<M> {
  readonly best: ScoredMove<M>;
  /** Every root move with its score at the deepest finished depth, best first. */
  readonly scored: readonly ScoredMove<M>[];
  readonly depth: number;
  readonly nodes: number;
  /** False when the node budget ran out before maxDepth. */
  readonly complete: boolean;
}

/** Score of a win found at the root; a win n plies away scores WIN - n. */
export const WIN = 1_000_000;
const DECIDED = WIN - 10_000;
const INF = WIN * 2;
const MAX_TABLE = 500_000;

export function isDecided(score: number): boolean {
  return Math.abs(score) > DECIDED;
}

const enum Bound {
  Exact,
  Lower,
  Upper,
}

interface Entry {
  depth: number;
  score: number;
  bound: Bound;
  best: number;
}

class OutOfBudget extends Error {}
const OUT_OF_BUDGET = new OutOfBudget('node budget used up');

/** Wins are stored relative to the node, so they stay right when reached by another path. */
function toTable(score: number, ply: number): number {
  if (score > DECIDED) return score + ply;
  if (score < -DECIDED) return score - ply;
  return score;
}

function fromTable(score: number, ply: number): number {
  if (score > DECIDED) return score - ply;
  if (score < -DECIDED) return score + ply;
  return score;
}

export function search<S, M>(space: SearchSpace<S, M>, root: S, limits: SearchLimits, rng?: Rng): SearchResult<M> {
  const rootMoves = space.moves(root);
  if (rootMoves.length === 0) throw new Error('search() needs a position with at least one move');
  if (limits.maxDepth < 1) throw new RangeError('maxDepth must be at least 1');

  const table = new Map<string, Entry>();
  let nodes = 0;
  let budgeted = false;

  const negamax = (state: S, depth: number, alphaIn: number, beta: number, ply: number): number => {
    nodes++;
    if (budgeted && nodes > limits.nodeBudget) throw OUT_OF_BUDGET;
    const result = space.result(state);
    if (result !== null) return result > 0 ? WIN - ply : result < 0 ? -(WIN - ply) : 0;
    if (depth <= 0) return space.evaluate(state);

    let alpha = alphaIn;
    const key = space.key(state);
    const entry = table.get(key);
    let first = -1;
    if (entry !== undefined) {
      if (entry.depth >= depth) {
        const score = fromTable(entry.score, ply);
        if (entry.bound === Bound.Exact) return score;
        if (entry.bound === Bound.Lower && score >= beta) return score;
        if (entry.bound === Bound.Upper && score <= alpha) return score;
      }
      first = entry.best;
    }

    const moves = space.moves(state);
    const order: number[] = [];
    if (first >= 0 && first < moves.length) order.push(first);
    for (let i = 0; i < moves.length; i++) if (i !== first) order.push(i);

    let best = -INF;
    let bestIndex = order[0] ?? 0;
    for (const i of order) {
      // `0 - x` rather than `-x`, so a draw is always +0.
      const score = 0 - negamax(space.play(state, moves[i] as M), depth - 1, -beta, -alpha, ply + 1);
      if (score > best) {
        best = score;
        bestIndex = i;
      }
      if (score > alpha) alpha = score;
      if (alpha >= beta) break;
    }

    const bound = best <= alphaIn ? Bound.Upper : best >= beta ? Bound.Lower : Bound.Exact;
    if (table.size >= MAX_TABLE) table.clear();
    table.set(key, { depth, score: toTable(best, ply), bound, best: bestIndex });
    return best;
  };

  let order: M[] = rootMoves.slice();
  let finished: ScoredMove<M>[] = [];
  let finishedDepth = 0;
  let complete = true;

  for (let depth = 1; depth <= limits.maxDepth; depth++) {
    budgeted = depth > 1;
    try {
      const scored: ScoredMove<M>[] = order.map((move) => ({
        move,
        score: 0 - negamax(space.play(root, move), depth - 1, -INF, INF, 1),
      }));
      // Array.prototype.sort is stable, so equal moves keep the previous order.
      scored.sort((a, b) => b.score - a.score);
      finished = scored;
      finishedDepth = depth;
      order = scored.map((s) => s.move);
      const top = scored[0] as ScoredMove<M>;
      // A forced win cannot get shorter, and if every move loses there is nothing more to learn.
      if (top.score > DECIDED || top.score < -DECIDED) break;
    } catch (err) {
      if (err === OUT_OF_BUDGET) {
        complete = false;
        break;
      }
      throw err;
    }
  }

  const topScore = (finished[0] as ScoredMove<M>).score;
  const tied = finished.filter((s) => s.score === topScore);
  const best = rng ? rng.pick(tied) : (tied[0] as ScoredMove<M>);
  return { best, scored: finished, depth: finishedDepth, nodes, complete };
}
