/** Spades for the lesson runner: positions in state notation, bids ("bid:3") and cards as moves, the student in seat 0. */
import { classicLessonGame, STUDENT } from '../../classic/learn';
import { simpleCount } from '../bots';
import type { SpadesAction, SpadesState } from '../rules';
import { actionText, BAG_LIMIT, BAG_PENALTY, HAND_SIZE, scoreHand, SEATS, spades, STANDARD, TRICK_VALUE, tricksWon } from '../rules';

const FIXED: Record<string, number> = {
  'players:four': SEATS,
  'hand:size': HAND_SIZE,
  'tricks:total': HAND_SIZE,
  'trick:value': TRICK_VALUE,
  'nil:value': STANDARD.nil,
  'blind:value': 2 * STANDARD.nil,
  'bag:limit': BAG_LIMIT,
  'bag:penalty': BAG_PENALTY,
  'target:usual': STANDARD.target,
};

export function spadesComputed(state: SpadesState): Record<string, number> {
  const out: Record<string, number> = { ...FIXED };
  const won = tricksWon(state);
  const bids = state.bids.map((b) => b ?? 0);
  const partner = (STUDENT + 2) % SEATS;
  const mine = state.hands[STUDENT] ?? [];
  out['bid:me'] = bids[STUDENT] ?? 0;
  out['bid:partner'] = bids[partner] ?? 0;
  out['bid:us'] = (bids[STUDENT] ?? 0) + (bids[partner] ?? 0);
  out['won:me'] = won[STUDENT] ?? 0;
  out['won:us'] = (won[STUDENT] ?? 0) + (won[partner] ?? 0);
  out['need:us'] = Math.max(0, out['bid:us'] - out['won:us']);
  out['count:simple'] = simpleCount(mine);
  out['spades:mine'] = mine.filter((c) => c[1] === 's').length;
  out['score:now'] = scoreHand(state.config, bids, state.blind, won, state.bagCount).deltas[0] ?? 0;
  out['score:if-mine'] = scoreHand(state.config, bids, state.blind, won.map((n, seat) => (seat === STUDENT ? n + 1 : n)), state.bagCount).deltas[0] ?? 0;
  out['score:size'] = Math.abs(out['score:now']);
  out['score:us'] = state.scores[0] ?? 0;
  out['bags:us'] = state.bagCount[0] ?? 0;
  out['bags:left'] = BAG_LIMIT - (state.bagCount[0] ?? 0);
  return out;
}

export const spadesLessonGame = classicLessonGame<SpadesState, SpadesAction>({
  def: spades,
  text: actionText,
  computed: spadesComputed,
  over: (s) => s.over || s.results.length > 0,
});
