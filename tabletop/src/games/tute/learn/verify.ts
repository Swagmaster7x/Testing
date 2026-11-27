/**
 * The checks behind the Tute lesson linter. "Best" claims are proved by the exact solver, so they
 * may only be made in endgames where every card is known and no hand holds more than
 * `SOLVE_LIMIT` cards: the accepted moves must keep as many points for the mover's side as the
 * best move, and every other move at least BEST_MARGIN points fewer. Free play is played exactly by
 * every seat in the same endgames.
 */
import { createRng } from '../../../core/rng';
import type { LessonVerifier } from '../../../teach/lint';
import { chooseAction, solve, solveMoves } from '../bots';
import type { TuteState } from '../rules';
import { actionText, checkConservation, handSize, seatCount, sideOf, tute, viewOf } from '../rules';

/** Points the best move must win by. */
export const BEST_MARGIN = 2;
/** The largest hands the solver proves claims in. */
export const SOLVE_LIMIT = 4;

const solvable = (state: TuteState) => state.stock.length === 0 && state.hands.every((h) => h.length <= SOLVE_LIMIT);

export const tuteVerifier: LessonVerifier<TuteState> = {
  positionProblems(state) {
    const problems: string[] = [];
    try {
      checkConservation(state);
    } catch (err) {
      problems.push((err as Error).message);
    }
    const players = seatCount(state.config);
    if (state.hands.some((h) => h.length > handSize(state.config))) problems.push('a hand holds too many cards');
    // Seats that have played to the trick hold one card fewer than those still to play.
    if (players === 4 && !state.over) {
      const played = new Set(state.trick.map((p) => p.seat));
      const sizes = state.hands.map((h, seat) => h.length + (played.has(seat) ? 1 : 0));
      if (new Set(sizes).size > 1) problems.push(`the hands do not match the trick: ${sizes.join(', ')}`);
    }
    const seat = tute.turn(state);
    if (seat !== null && tute.legal(state, seat).length === 0) problems.push('the player to move has no legal move');
    return problems;
  },

  checkBest(state, accept) {
    if (!solvable(state)) return Promise.resolve([`claim "best" needs an empty stock and at most ${SOLVE_LIMIT} cards a hand, where the solver can prove it`]);
    const scored = solveMoves(state).map((m) => ({ move: actionText(m.action), value: m.value }));
    const top = Math.max(...scored.map((m) => m.value));
    const problems: string[] = [];
    const accepted = new Set(accept);
    for (const move of accept) {
      const m = scored.find((x) => x.move === move);
      if (!m) problems.push(`claim "best": ${move} is not legal`);
      else if (m.value < top) problems.push(`claim "best": ${move} keeps a margin of ${m.value}, the best move ${top}`);
    }
    const rival = scored.filter((m) => !accepted.has(m.move)).sort((a, b) => b.value - a.value)[0];
    if (rival && top - rival.value < BEST_MARGIN) problems.push(`claim "best": ${rival.move} keeps a margin of ${rival.value}, as good as ${top}`);
    return Promise.resolve(problems);
  },

  freePlayMove(state) {
    const seat = tute.turn(state) ?? 0;
    if (solvable(state)) {
      const side = sideOf(seat, seatCount(state.config));
      const scored = solveMoves(state, true);
      const top = Math.max(...scored.map((m) => m.value));
      const best = scored.find((m) => m.value >= top) ?? scored[0];
      void side;
      void solve;
      if (best) return Promise.resolve(actionText(best.action));
    }
    return Promise.resolve(actionText(chooseAction(viewOf(state, seat), 6, createRng(tute.codec.state.toText(state).length.toString())).action));
  },
};
