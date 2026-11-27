/**
 * Dominoes game review (PLAN.md 2.7): each of your decisions is rated by the points it is expected
 * to cost your side in that hand, judged "with what you knew": the coach deals the unseen tiles
 * many ways that agree with every pass, and plays each choice out. The biggest losses are the key
 * moments, each with a one-sentence reason.
 */
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { replay, startState } from '../../core/replay';
import type { GameAnalysis, MoveVerdict, Reason } from '../../teach/analysis';
import { ANALYSIS_VERSION, keyMoments, moveAccuracy, seatAccuracy, verdictFor } from '../../teach/analysis';
import { tDynamic } from '../../text';
import type { AskCoach } from '../types';
import { actionText, dominoes, isTile } from './rules';
import { tileLabel } from './ui/names';

export const REVIEW_SAMPLES = 80;
/** Moves within this many expected points of the best also count as right on a practice card. */
const ALSO_RIGHT = 2;

interface Scored {
  readonly action: string;
  readonly margin: number;
  readonly tags: readonly string[];
}

function readMoves(answer: Json): Scored[] {
  if (!isJsonObject(answer) || !Array.isArray(answer.moves)) return [];
  return answer.moves.flatMap((m) =>
    isJsonObject(m) && typeof m.action === 'string' && typeof m.margin === 'number'
      ? [{ action: m.action, margin: m.margin, tags: Array.isArray(m.tags) ? m.tags.filter((x): x is string => typeof x === 'string') : [] }]
      : [],
  );
}

/** A move's name: the tile, or pass and draw. */
export function moveName(action: string): string {
  const tile = action.replace(/[LRUD]$/, '');
  if (isTile(tile)) return tileLabel(tile);
  return tDynamic(`dominoes.move.${action}`);
}

function reasonFor(played: Scored | undefined, best: Scored | undefined, swing: number, leading: boolean): Reason {
  const n = Math.max(1, Math.round(swing));
  const has = (s: Scored | undefined, tag: string) => s?.tags.includes(tag) === true;
  if (has(best, 'dom-scores') && !has(played, 'dom-scores')) return { key: 'why.dom-score', params: { move: moveName(best?.action ?? ''), n } };
  if (has(played, 'dom-covers-partner') && !has(best, 'dom-covers-partner')) return { key: 'why.dom-covered-partner', params: { move: moveName(best?.action ?? ''), n } };
  if (has(best, 'dom-makes-pass') && !has(played, 'dom-makes-pass')) return { key: 'why.dom-missed-pass', params: { move: moveName(best?.action ?? ''), n } };
  if (has(played, 'dom-blocks')) return { key: 'why.dom-bad-block', params: { n } };
  if (has(best, 'dom-blocks')) return { key: 'why.dom-missed-block', params: { move: moveName(best?.action ?? ''), n } };
  if (leading && has(best, 'dom-leads-strength') && !has(played, 'dom-leads-strength')) return { key: 'why.dom-lead', params: { move: moveName(best?.action ?? ''), n } };
  if (has(best, 'dom-double') && !has(played, 'dom-double')) return { key: 'why.dom-double', params: { move: moveName(best?.action ?? ''), n } };
  return { key: 'why.dom-better', params: { move: moveName(best?.action ?? ''), n } };
}

export async function analyseDominoesGame(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null> {
  const humans = record.players.flatMap((p, seat) => (p.kind === 'human' ? [seat] : []));
  const start = startState(dominoes, record);
  const { steps } = replay(dominoes, record);
  const mine = steps.map((s, i) => ({ s, i })).filter(({ s }) => humans.includes(s.seat));
  const moves: MoveVerdict[] = [];
  let done = 0;
  for (const { s, i } of mine) {
    if (cancelled()) return null;
    const before = i === 0 ? start : (steps[i - 1]?.state ?? start);
    const legal = dominoes.legal(before, s.seat);
    let scored: Scored[];
    if (legal.length <= 1) scored = legal.map((a) => ({ action: actionText(a), margin: 0, tags: [] }));
    else scored = readMoves(await ask({ type: 'analyse', samples: REVIEW_SAMPLES }, before));
    done++;
    onProgress(done, mine.length);
    const played = actionText(s.action);
    const top = scored.length > 0 ? Math.max(...scored.map((m) => m.margin)) : 0;
    const bestMove = scored.find((m) => m.margin >= top - 1e-9);
    const best = bestMove?.action ?? played;
    const playedMove = scored.find((m) => m.action === played);
    const mineMargin = playedMove?.margin ?? top;
    // A margin is our side's points less theirs, so a point that changes sides moves it by two.
    const swing = Math.max(0, top - mineMargin);
    const loss = swing / 2;
    const sameTile = best.replace(/[LRUD]$/, '') === played.replace(/[LRUD]$/, '') && Math.abs(top - mineMargin) < 1;
    const playedBest = played === best || sameTile || loss < 0.5;
    const verdict = verdictFor(loss, playedBest);
    const winBefore = Math.round((50 + top / 4) * 10) / 10;
    moves.push({
      label: tDynamic('dominoes.review.move', { n: before.handNo + 1, tile: moveName(played) }),
      ply: i,
      seat: s.seat,
      played: moveName(played),
      best: moveName(best),
      bestMove: best,
      winBefore,
      winAfter: Math.round((winBefore - loss / 2) * 10) / 10,
      loss: Math.round(loss * 10) / 10,
      accuracy: Math.round(moveAccuracy(loss)),
      verdict,
      reason: verdict === 'inaccuracy' || verdict === 'mistake' || verdict === 'blunder' ? reasonFor(playedMove, bestMove, swing, before.chain.length === 0) : null,
      accept: scored.filter((m) => (top - m.margin) / 2 <= ALSO_RIGHT).map((m) => m.action),
    });
  }
  return { version: ANALYSIS_VERSION, nodes: REVIEW_SAMPLES, moves, accuracy: seatAccuracy(moves), keyMoments: keyMoments(moves, humans) };
}
