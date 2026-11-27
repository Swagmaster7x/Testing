/** Gin Rummy for the lesson runner: positions in state notation, moves as in the rules ("stock", "discard", "Kh", "knock:Kh"), the student in seat 0. */
import { classicLessonGame, STUDENT } from '../../classic/learn';
import { bestArrangement, cardValue, deadwood } from '../../classic/melds';
import type { GinAction, GinState } from '../rules';
import { actionText, GAME_BONUS, ginRummy, HAND_SIZE, KNOCK_LIMIT, scoreKnock, STANDARD } from '../rules';

/** An example game for the scorepad lesson: points reached, and hands won. */
export const EXAMPLE = { points: 104, hands: 3 } as const;

const FIXED: Record<string, number> = {
  'hand:size': HAND_SIZE,
  'knock:limit': KNOCK_LIMIT,
  'gin:bonus': STANDARD.ginBonus,
  'undercut:bonus': STANDARD.undercutBonus,
  'big-gin:bonus': STANDARD.bigGin,
  'line:bonus': STANDARD.lineBonus,
  'game:bonus': GAME_BONUS,
  'target:usual': STANDARD.target,
  'value:ace': cardValue('Ac'),
  'value:king': cardValue('Kc'),
  'example:points': EXAMPLE.points,
  'example:final': EXAMPLE.points + EXAMPLE.hands * STANDARD.lineBonus + GAME_BONUS,
};

export function ginComputed(state: GinState): Record<string, number> {
  const out: Record<string, number> = { ...FIXED };
  const mine = state.hands[STUDENT] ?? [];
  const theirs = state.hands[1] ?? [];
  out['deadwood:me'] = deadwood(mine);
  out['deadwood:them'] = deadwood(theirs);
  out['melds:me'] = bestArrangement(mine).melds.length;
  if (mine.length === HAND_SIZE && theirs.length === HAND_SIZE) {
    const r = scoreKnock(state.config, state.upcard, STUDENT, mine, theirs, false);
    out['knock:defender'] = r.defenderCount;
    out['knock:points'] = r.points;
    out['knock:laid'] = r.laid.length;
  }
  return out;
}

export const ginLessonGame = classicLessonGame<GinState, GinAction>({
  def: ginRummy,
  text: actionText,
  computed: ginComputed,
  over: (s) => s.over || s.results.length > 0,
});
