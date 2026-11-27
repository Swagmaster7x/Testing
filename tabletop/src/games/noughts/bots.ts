/**
 * CPU levels for noughts and crosses, built on the shared alpha-beta search.
 *
 * - Level 1 looks one move ahead: it takes a win when it has one and otherwise likes the centre
 *   and corners, but it does not see your threats. A beginner's mistake, not a random move.
 * - Level 2 looks two moves ahead: it blocks a line you are about to finish, but it does not
 *   see a fork coming.
 * - Level 3 searches to the end and never loses. Between equally good moves it picks the one
 *   that sets the most traps: replies that look safe but lose to a fork.
 */
import type { SearchSpace } from '../../ai/alphabeta';
import { search } from '../../ai/alphabeta';
import type { BotChoice, BotInput, BotSet } from '../../ai/bot';
import type { Rng } from '../../core/rng';
import { NOUGHTS_LEVELS } from './levels';
import type { Cell, Mark, NoughtsAction, NoughtsState, NoughtsView } from './rules';
import { noughts, winningCells } from './rules';

/** Centre 4, corners 3, edges 2: the squares that sit on the most lines are worth more. */
const SQUARE_VALUE = [3, 2, 3, 2, 4, 2, 3, 2, 3] as const;

interface LevelParams {
  readonly depth: number;
  readonly nodeBudget: number;
  readonly setTraps: boolean;
}

const PARAMS: Record<number, LevelParams> = {
  1: { depth: 1, nodeBudget: 100, setTraps: false },
  2: { depth: 2, nodeBudget: 1_000, setTraps: false },
  3: { depth: 9, nodeBudget: 200_000, setTraps: true },
};

function isFull(cells: readonly Cell[]): boolean {
  return cells.every((c) => c !== null);
}

export const noughtsSpace: SearchSpace<NoughtsState, NoughtsAction> = {
  moves: (s) => noughts.legal(s, s.toMove),
  play: (s, m) => noughts.apply(s, m).state,
  result(s) {
    // After a winning move it is the loser's turn.
    if (s.winner !== null) return s.winner === s.toMove ? 1 : -1;
    return isFull(s.cells) ? 0 : null;
  },
  evaluate(s) {
    let score = 0;
    s.cells.forEach((c, i) => {
      if (c === null) return;
      score += c === s.toMove ? SQUARE_VALUE[i] ?? 0 : -(SQUARE_VALUE[i] ?? 0);
    });
    return score;
  },
  key: (s) => `${s.cells.map((c) => (c === null ? '.' : c)).join('')}${s.toMove}`,
};

/** Exact game values for the side to move (1 win, 0 draw, -1 loss), remembered across calls. */
const solved = new Map<string, number>();

export function solve(s: NoughtsState): number {
  const key = noughtsSpace.key(s);
  const known = solved.get(key);
  if (known !== undefined) return known;
  const result = noughtsSpace.result(s);
  let value: number;
  if (result !== null) value = result;
  else {
    value = -1;
    for (const m of noughtsSpace.moves(s)) {
      value = Math.max(value, 0 - solve(noughtsSpace.play(s, m)));
      if (value === 1) break;
    }
  }
  solved.set(key, value);
  return value;
}

/**
 * How many of the opponent's replies to `move` lose by force without walking into a line that
 * could be finished at once. Replies that leave a line open are blunders anyone who looks one
 * move ahead avoids; these deeper traps (mostly forks) are the ones worth setting.
 */
function traps(s: NoughtsState, move: NoughtsAction): number {
  const me = s.toMove;
  const after = noughtsSpace.play(s, move);
  if (noughtsSpace.result(after) !== null) return 0;
  return noughtsSpace.moves(after).filter((reply) => {
    const next = noughtsSpace.play(after, reply);
    return solve(next) === 1 && winningCells(next.cells, me).length === 0;
  }).length;
}

export function reasonTags(s: NoughtsState, move: NoughtsAction): string[] {
  const me = s.toMove;
  const them: Mark = me === 0 ? 1 : 0;
  if (winningCells(s.cells, me).includes(move)) return ['wins'];
  const tags: string[] = [];
  if (winningCells(s.cells, them).includes(move)) tags.push('blocks');
  const after = noughts.apply(s, move).state;
  if (after.winner === null && winningCells(after.cells, me).length >= 2) tags.push('fork');
  if (tags.length === 0 && move === 4) tags.push('centre');
  return tags;
}

function choose(view: NoughtsView, level: number, rng: Rng): BotChoice<NoughtsAction> {
  const params = PARAMS[level];
  if (!params) throw new Error(`Noughts and crosses has no level ${level}`);
  const state = noughts.sample?.(view, view.toMove, rng) ?? view;
  const found = search(noughtsSpace, state, { maxDepth: params.depth, nodeBudget: params.nodeBudget }, rng.fork('ties'));
  let move = found.best.move;
  if (params.setTraps) {
    const top = found.best.score;
    const equal = found.scored.filter((s) => s.score === top).map((s) => s.move);
    const counted = equal.map((m) => ({ m, n: traps(state, m) }));
    const most = Math.max(...counted.map((c) => c.n));
    move = rng.fork('traps').pick(counted.filter((c) => c.n === most)).m;
  }
  return { action: move, tags: reasonTags(state, move), nodes: found.nodes };
}

export const noughtsBots = {
  gameId: 'noughts',
  levels: NOUGHTS_LEVELS,
  // Synchronous: noughts and crosses needs no engine.
  choose: ({ view, level, rng }: BotInput<NoughtsView>): BotChoice<NoughtsAction> => choose(view, level, rng),
  encode: (action: NoughtsAction) => noughts.codec.action.toJSON(action),
} satisfies BotSet<NoughtsView, NoughtsAction>;
