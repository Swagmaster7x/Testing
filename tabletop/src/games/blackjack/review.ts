/**
 * Blackjack review: every decision you made (insurance, hit, stand, double, split, surrender),
 * valued by its expected value under the rules at this table, the same calculation as the chart.
 * The loss is in hundredths of the bet on that hand: standing on a soft 18 against a 10 instead of
 * hitting gives away a few; splitting tens against a 6 about thirty.
 */
import type { GameRecord } from '../../core/record';
import type { GameAnalysis, Reason } from '../../teach/analysis';
import { tDynamic } from '../../text';
import type { AskCoach } from '../types';
import { analyseRecord } from '../classic/review';
import type { BlackjackAction, BlackjackState } from './rules';
import { blackjack } from './rules';
import { handTotal } from './strategy';

const nameOf = (action: string): string => tDynamic(`blackjack.move.${action}`);

function reasonFor(before: BlackjackState, played: BlackjackAction, best: string, loss: number): Reason {
  if (played.type === 'insure') return { key: 'why.blackjack-insurance', params: {} };
  const hand = before.at ? before.boxes[before.at.box]?.hands[before.at.hand] : undefined;
  const up = before.dealer[0];
  const total = hand ? handTotal(hand.cards) : null;
  const params = { move: nameOf(best), n: Math.max(1, Math.round(loss * 100)), hand: total ? String(total.total) : '', up: up ? up[0] === 'T' ? '10' : (up[0] ?? '') : '' };
  if (best === 'split' || played.type === 'split') return { key: 'why.blackjack-split', params };
  if (best === 'double') return { key: 'why.blackjack-double', params };
  if (best === 'surrender') return { key: 'why.blackjack-surrender', params };
  return { key: 'why.blackjack-chart', params };
}

export function analyseBlackjackGame(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null> {
  return analyseRecord<BlackjackState, BlackjackAction>(
    {
      def: blackjack,
      rated: (before, action) => before.phase === 'play' || (before.phase === 'insurance' && action.type !== 'bet'),
      query: { type: 'analyse' },
      scale: 100,
      alsoRight: 0.005,
      label: (before) => tDynamic('blackjack.review.round', { n: before.round + 1 }),
      name: nameOf,
      reason: reasonFor,
    },
    record,
    ask,
    onProgress,
    cancelled,
  );
}
