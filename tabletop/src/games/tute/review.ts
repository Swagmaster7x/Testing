/**
 * Tute game review (PLAN.md 2.7): each of your decisions is rated by the points it is expected to
 * lose, judged "with what you knew" (the coach deals the unseen cards from your view many times,
 * consistent with every obligation shown, and plays each card out). A hand won counts as points
 * too (see WIN_BONUS in bots.ts). The biggest losses are the key moments, each with a one-sentence
 * reason.
 */
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { replay, startState } from '../../core/replay';
import type { GameAnalysis, MoveVerdict, Reason } from '../../teach/analysis';
import { ANALYSIS_VERSION, keyMoments, moveAccuracy, seatAccuracy, verdictFor } from '../../teach/analysis';
import { tDynamic } from '../../text';
import type { AskCoach } from '../types';
import type { TuteAction, TuteState } from './rules';
import { actionText, beats, cardPoints, isCard, partnerOf, seatCount, suitOf, tute, winningPlay } from './rules';
import { cardName } from './ui/names';

export const REVIEW_SAMPLES = 40;
/** Moves within this many expected points of the best also count as right on a practice card. */
const ALSO_RIGHT = 2;

interface Scored {
  readonly action: string;
  readonly value: number;
}

function readMoves(answer: Json): Scored[] {
  if (!isJsonObject(answer) || !Array.isArray(answer.moves)) return [];
  return answer.moves.flatMap((m) => (isJsonObject(m) && typeof m.action === 'string' && typeof m.value === 'number' ? [{ action: m.action, value: m.value }] : []));
}

export function moveName(action: string): string {
  if (action === 'swap') return tDynamic('tute.move.swap');
  if (action.startsWith('sing-')) return tDynamic('tute.move.sing', { suit: tDynamic(`tute.suit.${action.slice(5)}`) });
  if (action.startsWith('tute-')) return tDynamic('tute.move.tute');
  return isCard(action) ? cardName(action) : action;
}

function reasonFor(before: TuteState, played: TuteAction, best: string, loss: number): Reason {
  const seat = tute.turn(before) ?? 0;
  const players = seatCount(before.config);
  if (best.startsWith('sing-') && played.type !== 'sing') return { key: 'why.tute-missed-cante', params: {} };
  if (best.startsWith('tute-') && played.type !== 'tute') return { key: 'why.tute-missed-tute', params: {} };
  if (best === 'swap' && played.type !== 'swap') return { key: 'why.tute-swap', params: {} };
  if (played.type === 'play' && before.trick.length > 0) {
    const winning = winningPlay(before.trick, before.trumpSuit);
    const partnerWins = players === 4 && partnerOf(seat, players) === winning.seat;
    const wins = beats(played.card, winning.card, before.trumpSuit);
    const bestCard = isCard(best) ? best : null;
    if (!wins && !partnerWins && cardPoints(played.card) >= 3) return { key: 'why.tute-gave-points', params: { n: cardPoints(played.card) } };
    if (partnerWins && bestCard && cardPoints(bestCard) > cardPoints(played.card) && !beats(bestCard, winning.card, before.trumpSuit)) return { key: 'why.tute-missed-load', params: { move: moveName(best) } };
    if (wins && suitOf(played.card) === before.trumpSuit && suitOf(winning.card) !== before.trumpSuit && before.trick.every((p) => cardPoints(p.card) === 0) && bestCard && suitOf(bestCard) !== before.trumpSuit) {
      return { key: 'why.tute-wasted-trump', params: {} };
    }
  }
  return { key: 'why.tute-better', params: { move: moveName(best), n: Math.max(1, Math.round(loss)) } };
}

export async function analyseTuteGame(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null> {
  const humans = record.players.flatMap((p, seat) => (p.kind === 'human' ? [seat] : []));
  const start = startState(tute, record);
  const { steps } = replay(tute, record);
  const mine = steps.map((s, i) => ({ s, i })).filter(({ s }) => humans.includes(s.seat));
  const moves: MoveVerdict[] = [];
  let done = 0;
  for (const { s, i } of mine) {
    if (cancelled()) return null;
    const before = i === 0 ? start : (steps[i - 1]?.state ?? start);
    const legal = tute.legal(before, s.seat);
    let scored: Scored[];
    if (legal.length <= 1) scored = legal.map((a) => ({ action: actionText(a), value: 0 }));
    else scored = readMoves(await ask({ type: 'analyse', samples: REVIEW_SAMPLES }, before));
    done++;
    onProgress(done, mine.length);
    const played = actionText(s.action);
    const top = scored.length > 0 ? Math.max(...scored.map((m) => m.value)) : 0;
    const best = scored.find((m) => m.value >= top - 1e-9)?.action ?? played;
    const mineValue = scored.find((m) => m.action === played)?.value ?? top;
    // A value is my side's points minus theirs, so a point that changes sides moves it by two.
    const loss = Math.max(0, (top - mineValue) / 2);
    const playedBest = played === best || loss < 0.5;
    const verdict = verdictFor(loss, playedBest);
    const winBefore = Math.round(top * 10) / 10;
    moves.push({
      label: tDynamic('tute.review.trick', { n: before.tricks.length + 1, card: moveName(played) }),
      ply: i,
      seat: s.seat,
      played: moveName(played),
      best: moveName(best),
      bestMove: best,
      winBefore,
      winAfter: Math.round((winBefore - loss) * 10) / 10,
      loss: Math.round(loss * 10) / 10,
      accuracy: Math.round(moveAccuracy(loss)),
      verdict,
      reason: verdict === 'inaccuracy' || verdict === 'mistake' || verdict === 'blunder' ? reasonFor(before, s.action, best, loss) : null,
      accept: scored.filter((m) => (top - m.value) / 2 <= ALSO_RIGHT).map((m) => m.action),
    });
  }
  return { version: ANALYSIS_VERSION, nodes: REVIEW_SAMPLES, moves, accuracy: seatAccuracy(moves), keyMoments: keyMoments(moves, humans) };
}

