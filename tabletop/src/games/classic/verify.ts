/**
 * Lesson-linter checks shared by the classic card games. Positions must hold the whole pack (or
 * shoe) and give the player to move a legal move. "Best" claims are only made where a game has a
 * proof for them (Gin Rummy's least deadwood, Blackjack's expected value); elsewhere lessons claim
 * "legal" or "only" and the text gives the reason.
 */
import type { GameDef, GameEvent } from '../../core/contract';
import { createRng } from '../../core/rng';
import type { LessonVerifier } from '../../teach/lint';

export function basicVerifier<S, A>(opts: {
  readonly def: GameDef<S, A, unknown, unknown, GameEvent>;
  readonly conserve: (state: S) => void;
  readonly checkBest?: (state: S, accept: readonly string[]) => string[];
  readonly bestMove?: (state: S) => A;
}): LessonVerifier<S> {
  const { def } = opts;
  return {
    positionProblems(state) {
      const problems: string[] = [];
      try {
        opts.conserve(state);
      } catch (err) {
        problems.push((err as Error).message);
      }
      const seat = def.turn(state);
      if (seat !== null && def.legal(state, seat).length === 0) problems.push('the player to move has no legal move');
      return problems;
    },
    checkBest(state, accept) {
      if (!opts.checkBest) return Promise.resolve([`claim "best" is not proved for ${def.id}; use "legal" or "only"`]);
      return Promise.resolve(opts.checkBest(state, accept));
    },
    freePlayMove(state) {
      const seat = def.turn(state) ?? 0;
      const action = opts.bestMove ? opts.bestMove(state) : (def.legal(state, seat)[0] as A);
      void createRng;
      return Promise.resolve(def.codec.action.toText(action));
    },
  };
}
