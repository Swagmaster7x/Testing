/**
 * Gin Rummy review: every draw, discard and knock you made, valued "with what you knew" (the coach
 * deals the other hand and the stock many times and plays each move a few turns on), in points for
 * the hand: a discard that hands the other player their gin costs twenty-five and more.
 */
import type { GameRecord } from '../../core/record';
import type { GameAnalysis, Reason } from '../../teach/analysis';
import { tDynamic } from '../../text';
import type { AskCoach } from '../types';
import type { Card } from '../classic/cards';
import { isCard } from '../classic/cards';
import { deadwood } from '../classic/melds';
import { cardName } from '../classic/names';
import { analyseRecord } from '../classic/review';
import type { GinAction, GinState } from './rules';
import { ginRummy } from './rules';

export const REVIEW_SAMPLES = 24;

export function nameOf(action: string): string {
  if (action === 'stock') return tDynamic('gin.move.stock');
  if (action === 'discard') return tDynamic('gin.move.pile');
  if (action === 'take') return tDynamic('gin.move.take');
  if (action === 'pass') return tDynamic('gin.move.pass');
  if (action === 'big-gin') return tDynamic('gin.move.big-gin');
  if (action.startsWith('knock:')) return tDynamic('gin.move.knock', { card: cardName(action.slice(6) as Card) });
  return isCard(action) ? cardName(action) : action;
}

function reasonFor(before: GinState, played: GinAction, best: string, loss: number): Reason {
  const seat = before.toAct;
  const hand = before.hands[seat] ?? [];
  if (best.startsWith('knock:') && played.type !== 'knock') return { key: 'why.gin-knock', params: { move: nameOf(best) } };
  if (played.type === 'knock' && !best.startsWith('knock:')) return { key: 'why.gin-early-knock', params: { move: nameOf(best) } };
  if (played.type === 'discard') {
    const theirs = before.known[seat === 0 ? 1 : 0] ?? [];
    const near = theirs.some((c) => c[0] === played.card[0] || (c[1] === played.card[1] && Math.abs('A23456789TJQK'.indexOf(c[0] ?? '') - 'A23456789TJQK'.indexOf(played.card[0] ?? '')) <= 2));
    if (near) return { key: 'why.gin-fed', params: { move: nameOf(best) } };
    if (isCard(best) && deadwood(hand.filter((c) => c !== best)) < deadwood(hand.filter((c) => c !== played.card))) return { key: 'why.gin-deadwood', params: { move: nameOf(best) } };
  }
  if ((played.type === 'stock' && (best === 'discard' || best === 'take')) || (played.type === 'pass' && best === 'take')) return { key: 'why.gin-missed-pile', params: {} };
  return { key: 'why.gin-better', params: { move: nameOf(best), n: Math.max(1, Math.round(loss)) } };
}

export function analyseGinGame(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null> {
  return analyseRecord<GinState, GinAction>(
    {
      def: ginRummy,
      rated: () => true,
      query: { type: 'analyse', samples: REVIEW_SAMPLES },
      scale: 0.75,
      alsoRight: 2,
      label: (before, action) => tDynamic('gin.review.move', { hand: before.handNo + 1, move: nameOf(ginRummy.codec.action.toText(action)) }),
      name: nameOf,
      reason: reasonFor,
    },
    record,
    ask,
    onProgress,
    cancelled,
  );
}
