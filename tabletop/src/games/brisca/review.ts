/**
 * Brisca game review (PLAN.md 2.7): each of your decisions is rated by the points it is expected
 * to lose, judged "with what you knew" (the coach samples the unseen cards from your view, and
 * plays the end exactly once the stock is empty). The biggest losses are the key moments, each
 * with a one-sentence reason.
 */
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { replay, startState } from '../../core/replay';
import type { GameAnalysis, MoveVerdict, Reason } from '../../teach/analysis';
import { ANALYSIS_VERSION, keyMoments, moveAccuracy, seatAccuracy, verdictFor } from '../../teach/analysis';
import type { AskCoach } from '../types';
import type { BriscaAction, BriscaState, Card } from './rules';
import { actionText, brisca, cardPoints, isCard, suitOf, trickWinner } from './rules';
import { tDynamic } from '../../text';
import { cardName } from './ui/names';

export const REVIEW_SAMPLES = 60;
/** Moves within this many expected points of the best also count as right on a practice card. */
const ALSO_RIGHT = 1;

interface Scored {
  readonly action: string;
  readonly margin: number;
}

function readMoves(answer: Json): Scored[] {
  if (!isJsonObject(answer) || !Array.isArray(answer.moves)) return [];
  return answer.moves.flatMap((m) => (isJsonObject(m) && typeof m.action === 'string' && typeof m.margin === 'number' ? [{ action: m.action, margin: m.margin }] : []));
}

const nameOf = (action: string): string => (action === 'swap' ? 'swap' : isCard(action.replace('!', '')) ? cardName(action.replace('!', '') as Card) : action);

function reasonFor(before: BriscaState, played: BriscaAction, best: string, loss: number): Reason {
  const seat = brisca.turn(before) ?? 0;
  if (best === 'swap' && played.type !== 'swap') return { key: 'why.brisca-swap', params: {} };
  if (played.type === 'play') {
    const led = before.trick[0];
    const config = before.config;
    if (led) {
      const ledPoints = cardPoints(led.card, config);
      const wins = trickWinner([led, { seat, card: played.card }], before.trumpSuit, config) === seat;
      if (wins && suitOf(played.card) === before.trumpSuit && suitOf(led.card) !== before.trumpSuit && ledPoints === 0) return { key: 'why.brisca-wasted-trump', params: { n: ledPoints } };
      if (!wins && cardPoints(played.card, config) >= 3) return { key: 'why.brisca-gave-points', params: { n: cardPoints(played.card, config) } };
      if (!wins && ledPoints >= 3 && best !== actionText(played)) return { key: 'why.brisca-missed-points', params: { move: nameOf(best), n: ledPoints } };
    } else if (cardPoints(played.card, config) >= 10) {
      return { key: 'why.brisca-led-points', params: {} };
    }
  }
  return { key: 'why.brisca-better', params: { move: nameOf(best), n: Math.max(1, Math.round(loss)) } };
}

export async function analyseBriscaGame(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null> {
  const humans = record.players.flatMap((p, seat) => (p.kind === 'human' ? [seat] : []));
  const start = startState(brisca, record);
  const { steps } = replay(brisca, record);
  const mine = steps.map((s, i) => ({ s, i })).filter(({ s }) => humans.includes(s.seat));
  const moves: MoveVerdict[] = [];
  let done = 0;
  for (const { s, i } of mine) {
    if (cancelled()) return null;
    const before = i === 0 ? start : (steps[i - 1]?.state ?? start);
    const legal = brisca.legal(before, s.seat);
    let scored: Scored[];
    if (legal.length <= 1) scored = legal.map((a) => ({ action: actionText(a), margin: 0 }));
    else scored = readMoves(await ask({ type: 'analyse', samples: REVIEW_SAMPLES }, before));
    done++;
    onProgress(done, mine.length);
    const played = actionText(s.action);
    const top = scored.length > 0 ? Math.max(...scored.map((m) => m.margin)) : 0;
    const best = scored.find((m) => m.margin >= top - 1e-9)?.action ?? played;
    const mineMargin = scored.find((m) => m.action === played)?.margin ?? top;
    // A margin is my points minus theirs, so a point that changes hands moves it by two.
    const loss = Math.max(0, (top - mineMargin) / 2);
    const playedBest = played === best || loss < 0.25;
    const verdict = verdictFor(loss, playedBest);
    const winBefore = Math.round(((120 + top) / 2) * 10) / 10;
    moves.push({
      label: tDynamic('brisca.review.trick', { n: before.tricksWon.reduce((x, y) => x + y, 0) + 1, card: nameOf(played) }),
      ply: i,
      seat: s.seat,
      played: nameOf(played),
      best: nameOf(best),
      bestMove: best,
      winBefore,
      winAfter: Math.round((winBefore - loss) * 10) / 10,
      loss: Math.round(loss * 10) / 10,
      accuracy: Math.round(moveAccuracy(loss)),
      verdict,
      reason: verdict === 'inaccuracy' || verdict === 'mistake' || verdict === 'blunder' ? reasonFor(before, s.action, best, loss) : null,
      accept: scored.filter((m) => (top - m.margin) / 2 <= ALSO_RIGHT).map((m) => m.action),
    });
  }
  return { version: ANALYSIS_VERSION, nodes: REVIEW_SAMPLES, moves, accuracy: seatAccuracy(moves), keyMoments: keyMoments(moves, humans) };
}
