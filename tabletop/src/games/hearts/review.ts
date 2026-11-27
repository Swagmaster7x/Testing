/**
 * Hearts review: every card you played, valued "with what you knew" (the coach deals the unseen
 * cards many times and plays each card out), in points: the others' average less your own, so
 * taking the queen yourself instead of giving it away costs about seventeen.
 */
import type { GameRecord } from '../../core/record';
import type { GameAnalysis, Reason } from '../../teach/analysis';
import { tDynamic } from '../../text';
import type { AskCoach } from '../types';
import type { Card } from '../classic/cards';
import { isCard, suitOf } from '../classic/cards';
import { cardName } from '../classic/names';
import { trickWinner } from '../classic/tricks';
import { analyseRecord } from '../classic/review';
import type { HeartsAction, HeartsState } from './rules';
import { hearts, isHeart, pointsOf, QUEEN } from './rules';

export const REVIEW_SAMPLES = 40;

const nameOf = (action: string): string => (isCard(action) ? cardName(action) : action);

function reasonFor(before: HeartsState, played: HeartsAction, best: string, loss: number): Reason {
  if (played.type !== 'play') return { key: 'why.hearts-better', params: { move: nameOf(best), n: Math.max(1, Math.round(loss)) } };
  const card = played.card;
  const seat = (before.leader + before.trick.length) % 4;
  const led = before.trick[0];
  if (led && suitOf(card) !== suitOf(led.card) && best === QUEEN) return { key: 'why.hearts-dump-queen', params: {} };
  if (card === QUEEN || (led && suitOf(led.card) === 's' && rankWins(before, card, seat) && isCard(best) && best !== card && (before.hands[seat] ?? []).includes(QUEEN))) return { key: 'why.hearts-queen', params: {} };
  if (led && rankWins(before, card, seat) && pointsOf([...before.trick.map((p) => p.card), card], before.config) > 0) return { key: 'why.hearts-took-points', params: { move: nameOf(best) } };
  if (!led && isHeart(card)) return { key: 'why.hearts-led-heart', params: { move: nameOf(best) } };
  return { key: 'why.hearts-better', params: { move: nameOf(best), n: Math.max(1, Math.round(loss)) } };
}

function rankWins(before: HeartsState, card: Card, seat: number): boolean {
  return before.trick.length === 3 && trickWinner([...before.trick, { seat, card }], null) === seat;
}

export function analyseHeartsGame(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null> {
  return analyseRecord<HeartsState, HeartsAction>(
    {
      def: hearts,
      rated: (_before, action) => action.type === 'play',
      query: { type: 'analyse', samples: REVIEW_SAMPLES },
      scale: 1,
      alsoRight: 1,
      label: (before, action) => tDynamic('hearts.review.trick', { hand: before.handNo + 1, n: before.tricks.length + 1, card: action.type === 'play' ? cardName(action.card) : '' }),
      name: nameOf,
      reason: reasonFor,
    },
    record,
    ask,
    onProgress,
    cancelled,
  );
}
