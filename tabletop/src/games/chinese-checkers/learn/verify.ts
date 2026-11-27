/**
 * The solver checks behind the Chinese Checkers lesson linter (docs/lessons.md). A "best" claim is
 * checked by an exact solver, chosen by the position:
 * - when the side to move can complete its home within four of its own moves (the other marbles held
 *   where they are), the accepted moves must be exactly the first moves of the fastest finish;
 * - otherwise the claim is about distance: the accepted moves must be exactly the moves that take a
 *   marble furthest towards home, and every other move must fall at least a row short.
 * Free play: the student finishes as fast as the solver can, or plays the strongest level; the
 * opponent plays level 5.
 */
import { createRng } from '../../../core/rng';
import type { FreePlayStep } from '../../../teach/lesson';
import type { LessonVerifier } from '../../../teach/lint';
import { holeName } from '../board';
import { chooseWith, LEVEL_PARAMS } from '../bots';
import type { CcState } from '../rules';
import { actionOf, boardArray, chineseCheckers, layoutOf } from '../rules';
import { fastestFinish, longestMoves } from '../solver';
import { ccLessonGame } from './game';

/** How far ahead "the fastest finish" is solved for a claim. */
export const FINISH_DEPTH = 4;

const text = (move: number) => chineseCheckers.codec.action.toText(actionOf(move));
const sameSet = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((x) => b.includes(x));

export function ccPositionProblems(state: CcState): string[] {
  return state.end !== null ? ['the game is already over'] : [];
}

export function ccVerifier(): LessonVerifier<CcState> {
  return {
    positionProblems: ccPositionProblems,

    // eslint-disable-next-line @typescript-eslint/require-await -- the interface is async for engines
    async checkBest(state, accept) {
      const seat = chineseCheckers.turn(state);
      if (seat === null) return ['claim "best": the game is over'];
      const board = boardArray(state.board);
      const layout = layoutOf(state);
      const accepted = accept.map((m) => ccLessonGame.canonical(state, m));
      if (accepted.some((m) => m === null)) return [`claim "best": ${accept.join('/')} is not legal`];
      const codes = accepted as string[];
      const finish = fastestFinish(board, seat, layout, state.rules, FINISH_DEPTH);
      if (finish && finish.length > 0) {
        const best = finish.firsts.map((m) => chineseCheckers.codec.action.toJSON(actionOf(m)) as string);
        if (!sameSet(codes, best)) return [`claim "best": the fastest finish (${finish.length} moves) starts with ${finish.firsts.map(text).join(' ')}, not ${accept.join('/')}`];
        return [];
      }
      const longest = longestMoves(board, seat, layout, state.rules);
      const best = longest.moves.map((m) => chineseCheckers.codec.action.toJSON(actionOf(m)) as string);
      if (longest.gain < 2) return ['claim "best": no move gains two rows or more; use "legal"'];
      if (!sameSet(codes, best)) return [`claim "best": the moves that go furthest (${longest.gain} rows) are ${longest.moves.map(text).join(' ')}, not ${accept.join('/')}`];
      return [];
    },

    // eslint-disable-next-line @typescript-eslint/require-await -- the interface is async for engines
    async freePlayMove(state: CcState, role: 'student' | 'opponent', _step: FreePlayStep) {
      const seat = chineseCheckers.turn(state) ?? 0;
      if (role === 'student') {
        const finish = fastestFinish(boardArray(state.board), seat, layoutOf(state), state.rules, FINISH_DEPTH);
        if (finish && finish.firsts.length > 0) return text(finish.firsts[0] as number);
      }
      const params = LEVEL_PARAMS[role === 'student' ? 6 : 5];
      if (!params) throw new Error('missing level');
      const { move } = chooseWith(state, params, createRng(`lint/${ccLessonGame.notation(state)}`));
      return text(move);
    },
  };
}

export { holeName };
