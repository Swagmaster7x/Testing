/** Hearts for the lesson runner: positions in state notation, cards as moves ("Qs"), the student in seat 0. */
import type { Card } from '../../classic/cards';
import { DECK } from '../../classic/cards';
import { classicLessonGame, STUDENT } from '../../classic/learn';
import type { HeartsAction, HeartsState } from '../rules';
import { actionText, cardPoints, HAND_SIZE, hearts, isHeart, MOON_POINTS, PASS_COUNT, pointsOf, SEATS, STANDARD, takenBy } from '../rules';

/** Numbers that do not depend on the position. */
const FIXED: Record<string, number> = {
  'deck:cards': DECK.length,
  'hand:size': HAND_SIZE,
  'players:four': SEATS,
  'pass:count': PASS_COUNT,
  'points:heart': cardPoints('2h', STANDARD),
  'points:queen': cardPoints('Qs', STANDARD),
  'points:total': pointsOf(DECK, STANDARD),
  'points:moon': MOON_POINTS,
  'points:jack': -cardPoints('Jd', { jackDiamonds: 'minus-10' }),
  'target:usual': STANDARD.target,
};

export function heartsComputed(state: HeartsState): Record<string, number> {
  const out: Record<string, number> = { ...FIXED };
  const taken = takenBy(state).map((cards) => pointsOf(cards, state.config));
  const mine = state.hands[STUDENT] ?? [];
  const played = new Set<Card>([...state.tricks.flat().map((p) => p.card), ...state.trick.map((p) => p.card)]);
  out['trick:points'] = pointsOf(state.trick.map((p) => p.card), state.config);
  out['trick:cards'] = state.trick.length;
  out['taken:me'] = taken[STUDENT] ?? 0;
  out['score:me'] = state.scores[STUDENT] ?? 0;
  out['total:me'] = (state.scores[STUDENT] ?? 0) + (taken[STUDENT] ?? 0);
  out['hand:hearts'] = mine.filter(isHeart).length;
  out['hand:points'] = pointsOf(mine, state.config);
  out['hearts:unseen'] = DECK.filter(isHeart).length - [...played].filter(isHeart).length - mine.filter(isHeart).length;
  return out;
}

export const heartsLessonGame = classicLessonGame<HeartsState, HeartsAction>({
  def: hearts,
  text: actionText,
  computed: heartsComputed,
  over: (s) => s.over || s.results.length > 0,
});
