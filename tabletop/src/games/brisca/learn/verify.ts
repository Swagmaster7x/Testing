/**
 * The checks behind the Brisca lesson linter. "Best" claims are proved by the exact solver, so
 * they may only be made once the stock is empty (every card known): the accepted cards must be
 * worth as much as the best card, and every other card at least BEST_MARGIN points less.
 */
import { createRng } from '../../../core/rng';
import type { LessonVerifier } from '../../../teach/lint';
import { chooseAction, solveMoves } from '../bots';
import type { BriscaState } from '../rules';
import { actionText, brisca, checkConservation, viewOf } from '../rules';

/** Points the best card must win by. */
export const BEST_MARGIN = 2;

export const briscaVerifier: LessonVerifier<BriscaState> = {
  positionProblems(state) {
    const problems: string[] = [];
    try {
      checkConservation(state);
    } catch (err) {
      problems.push((err as Error).message);
    }
    if (state.hands.some((h) => h.length > 3)) problems.push('a hand holds more than three cards');
    const seat = brisca.turn(state);
    if (seat !== null && brisca.legal(state, seat).length === 0) problems.push('the player to move has no legal move');
    return problems;
  },

  checkBest(state, accept) {
    if (state.stock.length > 0) return Promise.resolve(['claim "best" needs an empty stock, where the solver can prove it']);
    const scored = solveMoves(state);
    const top = Math.max(...scored.map((m) => m.points));
    const problems: string[] = [];
    const accepted = new Set(accept);
    for (const card of accept) {
      const m = scored.find((x) => x.card === card);
      if (!m) problems.push(`claim "best": ${card} is not in hand`);
      else if (m.points < top) problems.push(`claim "best": ${card} ends with ${m.points} points, the best card ${top}`);
    }
    const rivals = scored.filter((m) => !accepted.has(m.card));
    const rival = [...rivals].sort((a, b) => b.points - a.points)[0];
    if (rival && top - rival.points < BEST_MARGIN) problems.push(`claim "best": ${rival.card} ends with ${rival.points} points, as good as ${top}`);
    return Promise.resolve(problems);
  },

  freePlayMove(state) {
    const seat = brisca.turn(state) ?? 0;
    return Promise.resolve(actionText(chooseAction(viewOf(state, seat), 6, createRng(brisca.codec.state.toText(state).length.toString()))));
  },
};
