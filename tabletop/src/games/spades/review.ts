/**
 * Spades review: every card you played, valued "with what you knew" (the coach deals the unseen
 * cards many times and plays each card out), by your side's score for the hand against the other
 * side's. A trick that sets a bid can be worth eighty points; a bag one.
 */
import type { GameRecord } from '../../core/record';
import type { GameAnalysis, Reason } from '../../teach/analysis';
import { tDynamic } from '../../text';
import type { AskCoach } from '../types';
import { isCard, suitOf } from '../classic/cards';
import { cardName } from '../classic/names';
import { trickWinner } from '../classic/tricks';
import { analyseRecord } from '../classic/review';
import type { SpadesAction, SpadesState } from './rules';
import { partnerOf, spades, TRUMP, tricksWon } from './rules';

export const REVIEW_SAMPLES = 40;

const nameOf = (action: string): string => (isCard(action) ? cardName(action) : action);

function reasonFor(before: SpadesState, played: SpadesAction, best: string, loss: number): Reason {
  if (played.type !== 'play') return { key: 'why.spades-better', params: { move: nameOf(best), n: Math.max(1, Math.round(loss)) } };
  const seat = (before.leader + before.trick.length) % 4;
  const card = played.card;
  const pairs = before.config.partners === 'pairs';
  const partner = partnerOf(seat);
  const won = tricksWon(before);
  if (pairs && before.bids[partner] === 0 && (won[partner] ?? 0) === 0) return { key: 'why.spades-cover-nil', params: { move: nameOf(best) } };
  if (before.bids[seat] === 0) return { key: 'why.spades-nil', params: { move: nameOf(best) } };
  const led = before.trick[0];
  if (led) {
    const wins = trickWinner([...before.trick, { seat, card }], TRUMP) === seat;
    const partnerWinning = pairs && before.trick.length > 0 && trickWinner(before.trick, TRUMP) === partner;
    if (wins && partnerWinning) return { key: 'why.spades-overtook', params: { move: nameOf(best) } };
    if (wins && suitOf(card) === TRUMP && suitOf(led.card) !== TRUMP) return { key: 'why.spades-trumped', params: { move: nameOf(best) } };
  }
  return { key: 'why.spades-better', params: { move: nameOf(best), n: Math.max(1, Math.round(loss)) } };
}

export function analyseSpadesGame(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null> {
  return analyseRecord<SpadesState, SpadesAction>(
    {
      def: spades,
      rated: (_before, action) => action.type === 'play',
      query: { type: 'analyse', samples: REVIEW_SAMPLES },
      scale: 0.5,
      alsoRight: 2,
      label: (before, action) => tDynamic('spades.review.trick', { hand: before.handNo + 1, n: before.tricks.length + 1, card: action.type === 'play' ? cardName(action.card) : '' }),
      name: nameOf,
      reason: reasonFor,
    },
    record,
    ask,
    onProgress,
    cancelled,
  );
}
