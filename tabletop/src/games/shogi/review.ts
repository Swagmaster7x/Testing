/**
 * Shogi game review: every position is searched by the engine in the bot worker (the best line and
 * a second one), each move is rated by its loss in winning chances, and mistakes get a one-sentence
 * reason: allowed mate, missed mate, left a piece to be taken, missed a win of material, or what
 * was better. The shared arithmetic and stored shape are in src/teach/analysis.ts.
 */
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { replay, startState } from '../../core/replay';
import type { GameAnalysis, MoveVerdict, Reason } from '../../teach/analysis';
import { ANALYSIS_VERSION, keyMoments, moveAccuracy, seatAccuracy, verdictFor, winChance } from '../../teach/analysis';
import type { AskCoach } from '../types';
import { BASE, capturedOf, EMPTY, isPromotion, parseSfen, typeOfCode } from './core';
import { VALUE } from './engine';
import { moveFromCanonical } from './notation';
import type { ShogiState } from './rules';
import { canonicalAction, legalPairs, PIECE_NAMES, shogi } from './rules';

/** Search size per position in review: deep enough for short tactics, quick on a phone. */
export const REVIEW_NODES = 50_000;
/** Engine units to the centipawns of the shared winning-chances curve (a shogi pawn is about 90). */
export const WIN_SCALE = 0.45;
const MATE = 100_000;
/** A second line this close (in winning chances) also counts as right on a practice card. */
const ALSO_RIGHT = 3;

interface Line {
  readonly uci: string;
  readonly score: number;
  readonly mate: number | null;
  readonly pv: readonly string[];
}

export const shogiWinChance = (score: number): number => winChance(score * WIN_SCALE);

function readLines(answer: Json): Line[] {
  if (!isJsonObject(answer) || !Array.isArray(answer.lines)) return [];
  return answer.lines.flatMap((l) => {
    if (!isJsonObject(l) || typeof l.uci !== 'string' || typeof l.score !== 'number') return [];
    return [{ uci: l.uci, score: l.score, mate: typeof l.mate === 'number' ? l.mate : null, pv: Array.isArray(l.pv) ? l.pv.filter((m): m is string => typeof m === 'string') : [] }];
  });
}

/** Western notation for a canonical move in a position, or the move itself. */
export function textIn(state: ShogiState, canonical: string): string {
  const { actions } = legalPairs(state);
  return actions.find((a) => canonicalAction(a) === canonical)?.text ?? canonical;
}

/** Material won (engine units) by the side to move over the first plies of a line. */
function swing(state: ShogiState, pv: readonly string[], plies: number): number {
  const p = parseSfen(state.sfen);
  let total = 0;
  const played: number[] = [];
  for (const [i, canonical] of pv.slice(0, plies).entries()) {
    const m = moveFromCanonical(p, p.legalMoves(), canonical);
    if (m === null) break;
    const captured = capturedOf(m);
    const gain = (captured !== EMPTY ? VALUE[typeOfCode(captured)]! : 0) + (isPromotion(m) ? 200 : 0);
    total += i % 2 === 0 ? gain : -gain;
    p.make(m);
    played.push(m);
  }
  return total;
}

function reasonFor(before: ShogiState, after: ShogiState, played: string, lines: readonly Line[], afterLines: readonly Line[] | null): Reason | null {
  const best = lines[0];
  if (!best) return null;
  const reply = afterLines?.[0];
  const bestText = textIn(before, best.uci);
  if (reply && reply.mate !== null && reply.mate > 0 && !(best.mate !== null && best.mate < 0)) return { key: 'why.allows-mate', params: { n: reply.mate } };
  if (best.mate !== null && best.mate > 0 && best.uci !== played) return { key: 'why.missed-mate', params: { move: bestText, n: best.mate } };
  if (reply) {
    const p = parseSfen(after.sfen);
    const m = moveFromCanonical(p, p.legalMoves(), reply.uci);
    const taken = m === null ? EMPTY : capturedOf(m);
    if (m !== null && taken !== EMPTY && VALUE[typeOfCode(taken)]! >= 300 && swing(after, reply.pv, 4) >= 250) {
      return { key: 'why.hangs', params: { piece: PIECE_NAMES[BASE[typeOfCode(taken)]!]!, square: reply.uci.slice(2, 4) } };
    }
  }
  if (swing(before, best.pv, 4) >= 250) return { key: 'why.missed-win', params: { move: bestText } };
  return { key: 'why.better', params: { move: bestText } };
}

/**
 * Analyses a finished game. `ask` sends a coach question about a position to the bot worker. With
 * `strong`, positions on the standard board are searched by Fairy-Stockfish (M15); the worker falls
 * back to the built-in engine if it cannot run it.
 */
export async function analyseShogiGame(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean, strong = false): Promise<GameAnalysis | null> {
  const start = startState(shogi, record);
  const { steps, state: final } = replay(shogi, record);
  const positions: ShogiState[] = [start, ...steps.map((s) => s.state)];
  const total = final.result ? positions.length - 1 : positions.length;
  const evals: Line[][] = [];
  for (let i = 0; i < total; i++) {
    if (cancelled()) return null;
    const position = positions[i] as ShogiState;
    evals.push(position.result ? [] : readLines(await ask({ type: 'analyse', nodes: REVIEW_NODES, multiPv: 2, ...(strong ? { engine: 'strong' } : {}) }, position)));
    onProgress(i + 1, total);
  }
  const moves: MoveVerdict[] = steps.map((step, i) => {
    const before = positions[i] as ShogiState;
    const after = positions[i + 1] as ShogiState;
    const lines = evals[i] ?? [];
    const best = lines[0];
    const played = canonicalAction(step.action);
    if (step.action.type === 'declare') {
      return { ply: i, seat: step.seat, played: step.action.text, best: null, bestMove: null, winBefore: 100, winAfter: 100, loss: 0, accuracy: 100, verdict: 'best', reason: null, accept: [] };
    }
    const bestScore = best?.score ?? 0;
    let afterScore: number;
    if (after.result) afterScore = 'winner' in after.result ? (after.result.winner === step.seat ? MATE : after.result.winner === null ? 0 : -MATE) : 0;
    else afterScore = -(evals[i + 1]?.[0]?.score ?? 0);
    const playedBest = best?.uci === played;
    const winBefore = shogiWinChance(bestScore);
    const winAfter = playedBest ? winBefore : shogiWinChance(afterScore);
    const loss = playedBest ? 0 : Math.max(0, winBefore - winAfter);
    const verdict = verdictFor(loss, playedBest);
    const second = lines[1];
    const accept = [best?.uci, second && shogiWinChance(second.score) >= winBefore - ALSO_RIGHT ? second.uci : undefined].filter((m): m is string => typeof m === 'string' && m.length > 0);
    return {
      ply: i,
      seat: step.seat,
      played: step.action.text,
      best: best ? textIn(before, best.uci) : null,
      bestMove: best?.uci ?? null,
      winBefore: Math.round(winBefore * 10) / 10,
      winAfter: Math.round(winAfter * 10) / 10,
      loss: Math.round(loss * 10) / 10,
      accuracy: Math.round(moveAccuracy(loss)),
      verdict,
      reason: verdict === 'inaccuracy' || verdict === 'mistake' || verdict === 'blunder' ? reasonFor(before, after, played, lines, after.result ? null : (evals[i + 1] ?? null)) : null,
      accept,
    };
  });
  const humans = record.players.flatMap((p, seat) => (p.kind === 'human' ? [seat] : []));
  return { version: ANALYSIS_VERSION, nodes: REVIEW_NODES, moves, accuracy: seatAccuracy(moves), keyMoments: keyMoments(moves, humans) };
}
