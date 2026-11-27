/**
 * Chinese Checkers game review: each decision is searched by the coach in the bot worker (two
 * players: every move of both sides, by the search's winning chances; more players: your own moves,
 * against the best move of the lookahead), rated by its loss through the shared arithmetic in
 * src/teach/analysis.ts, and the biggest losses get a one-sentence reason: a finish missed, a marble
 * that could have come home, a marble left behind, or a chain that went further.
 */
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { replay, startState } from '../../core/replay';
import type { GameAnalysis, MoveVerdict, Reason } from '../../teach/analysis';
import { ANALYSIS_VERSION, keyMoments, moveAccuracy, seatAccuracy, verdictFor } from '../../teach/analysis';
import { tDynamic } from '../../text';
import type { AskCoach } from '../types';
import type { CcAction, CcState } from './rules';
import { chineseCheckers, layoutOf, packAction } from './rules';
import { moveTags, rowsGained } from './tags';

/** Nodes per position in review (two players). */
export const REVIEW_NODES = 30_000;
/** A move this close (in winning chances) to the best also counts as right on a practice card. */
const ALSO_RIGHT = 3;

interface Line {
  readonly move: string;
  readonly name: string;
  readonly value: number;
}

function readLine(json: Json | undefined): Line | null {
  return isJsonObject(json) && typeof json.move === 'string' && typeof json.name === 'string' && typeof json.value === 'number' ? { move: json.move, name: json.name, value: json.value } : null;
}

function readAnswer(answer: Json): { lines: Line[]; played: Line | null } {
  if (!isJsonObject(answer)) return { lines: [], played: null };
  const lines = Array.isArray(answer.lines) ? answer.lines.flatMap((l) => readLine(l) ?? []) : [];
  return { lines, played: readLine(answer.played) };
}

export function reasonFor(before: CcState, played: CcAction, best: CcAction, bestName: string): Reason {
  const playedTags = moveTags(before, played);
  const bestTags = moveTags(before, best);
  const has = (tags: readonly string[], tag: string) => tags.includes(tag);
  if (has(bestTags, 'cc-finishes') && !has(playedTags, 'cc-finishes')) return { key: 'why.cc-missed-finish', params: { move: bestName } };
  if (has(bestTags, 'cc-home') && !has(playedTags, 'cc-home') && !has(playedTags, 'cc-finishes')) return { key: 'why.cc-missed-home', params: { move: bestName } };
  if (has(bestTags, 'cc-straggler') && !has(playedTags, 'cc-straggler')) return { key: 'why.cc-straggler', params: { move: bestName } };
  const layout = layoutOf(before);
  const further = rowsGained(layout, before.toMove, packAction(best)) - rowsGained(layout, before.toMove, packAction(played));
  if (further >= 3) return { key: 'why.cc-missed-chain', params: { move: bestName, n: further } };
  return { key: 'why.cc-better', params: { move: bestName } };
}

/** Analyses a finished game. `ask` sends a coach question about a position to the bot worker. */
export async function analyseCcGame(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null> {
  const def = chineseCheckers;
  const start = startState(def, record);
  const { steps } = replay(def, record);
  const humans = record.players.flatMap((p, seat) => (p.kind === 'human' ? [seat] : []));
  const positions: CcState[] = [start, ...steps.map((s) => s.state)];
  const wanted = steps.map((s, i) => {
    const before = positions[i] as CcState;
    if (s.action.type === 'pass' || (before.players > 2 && !humans.includes(s.seat))) return false;
    return def.legal(before, s.seat).length > 1;
  });
  const total = wanted.filter(Boolean).length;
  const moves: MoveVerdict[] = [];
  let done = 0;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (!step || !wanted[i]) continue;
    if (cancelled()) return null;
    const before = positions[i] as CcState;
    const code = def.codec.action.toJSON(step.action) as string;
    const { lines, played } = readAnswer(await ask({ type: 'analyse', nodes: REVIEW_NODES, move: code }, before));
    onProgress(++done, total);
    const best = lines[0];
    const text = def.codec.action.toText(step.action);
    const label = tDynamic('cc.review.move', { n: before.round, colour: tDynamic(`cc.seat.${step.seat}`), move: text });
    if (!best) {
      moves.push({ label, ply: i, seat: step.seat, played: text, best: null, bestMove: null, winBefore: 50, winAfter: 50, loss: 0, accuracy: 100, verdict: 'best', reason: null, accept: [] });
      continue;
    }
    const playedBest = best.move === code;
    const winBefore = best.value;
    const winAfter = playedBest ? best.value : (played?.value ?? best.value);
    const loss = playedBest ? 0 : Math.max(0, winBefore - winAfter);
    const verdict = verdictFor(loss, playedBest);
    const bestAction = def.codec.action.fromJSON(best.move);
    moves.push({
      label,
      ply: i,
      seat: step.seat,
      played: text,
      best: best.name,
      bestMove: best.move,
      winBefore: Math.round(winBefore * 10) / 10,
      winAfter: Math.round(winAfter * 10) / 10,
      loss: Math.round(loss * 10) / 10,
      accuracy: Math.round(moveAccuracy(loss)),
      verdict,
      reason: verdict === 'inaccuracy' || verdict === 'mistake' || verdict === 'blunder' ? reasonFor(before, step.action, bestAction, best.name) : null,
      accept: lines.filter((l) => l.value >= winBefore - ALSO_RIGHT).map((l) => l.move),
    });
  }
  return { version: ANALYSIS_VERSION, nodes: REVIEW_NODES, moves, accuracy: seatAccuracy(moves), keyMoments: keyMoments(moves, humans) };
}
