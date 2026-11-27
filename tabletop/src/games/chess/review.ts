/**
 * Chess game review: every position is searched by the coach engine (two best lines each), each
 * move is rated by its loss in winning chances, and mistakes get a one-sentence reason: allowed
 * mate, missed mate, left a piece to be taken, missed a win of material, or simply what was better.
 */
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { replay, startState } from '../../core/replay';
import type { GameAnalysis, MoveVerdict, Reason } from '../../teach/analysis';
import { ANALYSIS_VERSION, keyMoments, moveAccuracy, seatAccuracy, verdictFor, winChance } from '../../teach/analysis';
import type { AskCoach } from '../types';
import { capturedBy, materialSwing, sanOf } from './bots';
import type { ChessState } from './rules';
import { chess, chessAt, PIECE_VALUE, uciOf } from './rules';

/** Search size per position in review: deep enough to see short tactics, quick on a phone. */
export const REVIEW_NODES = 50_000;
const MATE = 100_000;
/** A second line this close (in winning chances) also counts as right on a practice card. */
const ALSO_RIGHT = 3;

interface Line {
  readonly uci: string;
  /** From the side to move's point of view, centipawns; mates are large. */
  readonly score: number;
  readonly mate: number | null;
  readonly pv: readonly string[];
}

function readLines(answer: Json): Line[] {
  if (!isJsonObject(answer) || !Array.isArray(answer.lines)) return [];
  return answer.lines.flatMap((l) => {
    if (!isJsonObject(l) || typeof l.uci !== 'string' || typeof l.score !== 'number') return [];
    return [{ uci: l.uci, score: l.score, mate: typeof l.mate === 'number' ? l.mate : null, pv: Array.isArray(l.pv) ? l.pv.filter((m): m is string => typeof m === 'string') : [] }];
  });
}

const PIECE_WORD = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' } as const;

function reasonFor(before: ChessState, played: string, lines: readonly Line[], afterLines: readonly Line[] | null): Reason | null {
  const best = lines[0];
  if (!best) return null;
  const reply = afterLines?.[0];
  const bestSan = sanOf(before.fen, best.uci);
  if (reply && reply.mate !== null && reply.mate > 0 && !(best.mate !== null && best.mate < 0)) return { key: 'why.allows-mate', params: { n: reply.mate } };
  if (best.mate !== null && best.mate > 0 && best.uci !== played) return { key: 'why.missed-mate', params: { move: bestSan, n: best.mate } };
  if (reply) {
    const after = chessAt(before.fen);
    try {
      after.move({ from: played.slice(0, 2), to: played.slice(2, 4), promotion: played[4] ?? 'q' });
    } catch {
      return { key: 'why.better', params: { move: bestSan } };
    }
    const afterFen = after.fen();
    const taken = capturedBy(afterFen, reply.uci);
    if (taken && PIECE_VALUE[taken] >= 3 && materialSwing(afterFen, reply.pv, 4) >= 2) {
      return { key: 'why.hangs', params: { piece: PIECE_WORD[taken], square: reply.uci.slice(2, 4) } };
    }
  }
  if (materialSwing(before.fen, best.pv, 4) >= 2) return { key: 'why.missed-win', params: { move: bestSan } };
  return { key: 'why.better', params: { move: bestSan } };
}

/** Analyses a finished game. `ask` sends a coach question about a position to the bot worker. */
export async function analyseChessGame(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null> {
  const start = startState(chess, record);
  const { steps, state: final } = replay(chess, record);
  const positions: ChessState[] = [start, ...steps.map((s) => s.state)];
  const total = final.result ? positions.length - 1 : positions.length;
  const evals: Line[][] = [];
  for (let i = 0; i < total; i++) {
    if (cancelled()) return null;
    evals.push(readLines(await ask({ type: 'analyse', nodes: REVIEW_NODES, multiPv: 2 }, positions[i])));
    onProgress(i + 1, total);
  }
  const moves: MoveVerdict[] = steps.map((step, i) => {
    const before = positions[i] as ChessState;
    const lines = evals[i] ?? [];
    const best = lines[0];
    const played = uciOf(step.action);
    const bestScore = best?.score ?? 0;
    const after = positions[i + 1] as ChessState;
    let afterScore: number;
    if (after.result) afterScore = after.result.kind === 'checkmate' ? MATE : 0;
    else afterScore = -(evals[i + 1]?.[0]?.score ?? 0);
    const playedBest = best?.uci === played;
    const winBefore = winChance(bestScore);
    const winAfter = playedBest ? winBefore : winChance(afterScore);
    const loss = playedBest ? 0 : Math.max(0, winBefore - winAfter);
    const verdict = verdictFor(loss, playedBest);
    const second = lines[1];
    const accept = [best?.uci, second && winChance(second.score) >= winBefore - ALSO_RIGHT ? second.uci : undefined].filter((m): m is string => typeof m === 'string' && m.length > 0);
    return {
      ply: i,
      seat: step.seat,
      played: step.action.san,
      best: best ? sanOf(before.fen, best.uci) : null,
      bestMove: best?.uci ?? null,
      winBefore: Math.round(winBefore * 10) / 10,
      winAfter: Math.round(winAfter * 10) / 10,
      loss: Math.round(loss * 10) / 10,
      accuracy: Math.round(moveAccuracy(loss)),
      verdict,
      reason: verdict === 'inaccuracy' || verdict === 'mistake' || verdict === 'blunder' ? reasonFor(before, played, lines, after.result ? null : (evals[i + 1] ?? null)) : null,
      accept,
    };
  });
  const humans = record.players.flatMap((p, seat) => (p.kind === 'human' ? [seat] : []));
  return { version: ANALYSIS_VERSION, nodes: REVIEW_NODES, moves, accuracy: seatAccuracy(moves), keyMoments: keyMoments(moves, humans) };
}
