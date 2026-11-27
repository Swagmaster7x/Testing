/**
 * Go game review: every position in play is searched by the coach in the bot worker, each move is
 * rated by its loss in winning chances (src/teach/analysis.ts), and mistakes get a one-sentence
 * reason: put your own stones in atari, missed a capture, left stones in atari, passed too soon,
 * or simply what was bigger. Handicap placements and the marking at the end are not rated.
 */
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { replay, startState } from '../../core/replay';
import type { GameAnalysis, MoveVerdict, Reason } from '../../teach/analysis';
import { ANALYSIS_VERSION, keyMoments, moveAccuracy, verdictFor } from '../../teach/analysis';
import type { AskCoach } from '../types';
import { Board } from './board';
import { putsInAtari } from './bots';
import { parsePoint, pointName, sgfToXY } from './coords';
import type { GoAction, GoState } from './rules';
import { boardOf, colorOf, go, winnerOf } from './rules';

/** Playouts per position in review on 9×9 (the bot scales them down on bigger boards). */
export const REVIEW_PLAYOUTS = 1_500;
/** A second move this close (in winning chances) also counts as right on a practice card. */
const ALSO_RIGHT = 3;

interface Line {
  readonly move: string;
  readonly name: string;
  readonly value: number;
}

interface Eval {
  /** The side to move's winning chances, 0 to 100. */
  readonly value: number;
  readonly lines: readonly Line[];
}

function readEval(answer: Json): Eval {
  if (!isJsonObject(answer)) return { value: 50, lines: [] };
  const lines = Array.isArray(answer.lines)
    ? answer.lines.flatMap((l) => (isJsonObject(l) && typeof l.move === 'string' && typeof l.name === 'string' && typeof l.value === 'number' ? [{ move: l.move, name: l.name, value: l.value }] : []))
    : [];
  return { value: typeof answer.value === 'number' ? answer.value : 50, lines };
}

const atOf = (a: GoAction): string => (a.type === 'play' ? a.at : a.type);

function pointOfAt(at: string, size: number): number | null {
  const xy = sgfToXY(at);
  return xy && xy.x < size && xy.y < size ? xy.y * size + xy.x : null;
}

/** The chain of the stone at p is in atari after the move: how many stones, and its last liberty. */
function selfAtari(after: GoState, p: number): { n: number; liberty: number } | null {
  const board = Board.fromText(after.size, after.board);
  const i = board.fromPoint(p);
  if (board.color[i] === 0) return null;
  const h = board.head[i] as number;
  if (!board.inAtari(h)) return null;
  return { n: board.stones[h] as number, liberty: board.point(board.atariLiberty(h)) };
}

/** Our chains in atari before the move. */
function chainsInAtari(state: GoState): number[] {
  const board = boardOf(state);
  const c = colorOf(state.toMove);
  const out: number[] = [];
  for (let p = 0; p < state.board.length; p++) {
    const i = board.fromPoint(p);
    if (board.color[i] === c && board.head[i] === i && board.inAtari(i)) out.push(p);
  }
  return out;
}

export function reasonFor(before: GoState, action: GoAction, after: GoState, best: Line | undefined): Reason | null {
  if (!best) return null;
  const size = before.size;
  const bestPoint = best.move === 'pass' ? null : parsePoint(best.move, size);
  const board = boardOf(before);
  const c = colorOf(before.toMove);
  if (action.type === 'pass' && bestPoint !== null) return { key: 'why.go-early-pass', params: { move: best.name } };
  if (action.type === 'play') {
    const p = pointOfAt(action.at, size);
    const sa = p === null ? null : selfAtari(after, p);
    if (sa && sa.n >= 2) return { key: 'why.go-self-atari', params: { n: sa.n, point: pointName(sa.liberty, size) } };
  }
  if (bestPoint !== null) {
    const taken = board.capturesAt(board.fromPoint(bestPoint), c);
    if (taken > 0) return { key: 'why.go-missed-capture', params: { move: best.name, n: taken } };
    const inAtari = chainsInAtari(before);
    if (inAtari.length > 0) {
      // Did the best move save one of those chains?
      const saved = inAtari.some((p) => {
        const i = board.fromPoint(p);
        return board.atariLiberty(i) === board.fromPoint(bestPoint);
      });
      if (saved) return { key: before.last >= 0 && putsInAtariBefore(before) ? 'why.go-ignored-atari' : 'why.go-missed-save', params: { move: best.name } };
    }
  }
  return { key: 'why.go-bigger', params: { move: best.name } };
}

/** True when the opponent's last stone put one of our chains in atari (they said atari). */
function putsInAtariBefore(state: GoState): boolean {
  if (state.last < 0) return false;
  const board = Board.fromText(state.size, state.board);
  const i = board.fromPoint(state.last);
  const c = colorOf(state.toMove);
  for (let d = 0; d < 4; d++) {
    const n = i + (board.dirs[d] as number);
    if (board.color[n] === c && board.inAtari(board.head[n] as number)) return true;
  }
  return false;
}

/** Analyses a finished game. `ask` sends a coach question about a position to the bot worker. */
export async function analyseGoGame(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null> {
  const start = startState(go, record);
  const { steps } = replay(go, record);
  const positions: GoState[] = [start, ...steps.map((s) => s.state)];
  // Positions to search: every position in play (before a stone or a pass).
  const wanted = positions.map((p, i) => p.phase === 'play' && (i < steps.length || p.result === null));
  const total = wanted.filter(Boolean).length;
  const evals: (Eval | null)[] = [];
  let done = 0;
  for (let i = 0; i < positions.length; i++) {
    if (!wanted[i]) {
      evals.push(null);
      continue;
    }
    if (cancelled()) return null;
    evals.push(readEval(await ask({ type: 'analyse', playouts: REVIEW_PLAYOUTS }, positions[i])));
    onProgress(++done, total);
  }

  const moves: MoveVerdict[] = steps.map((step, i) => {
    const before = positions[i] as GoState;
    const after = positions[i + 1] as GoState;
    const played = go.codec.action.toText(step.action);
    const rated = before.phase === 'play' && (step.action.type === 'play' || step.action.type === 'pass');
    const e = evals[i];
    if (!rated || !e) {
      return { ply: i, seat: step.seat, played, best: null, bestMove: null, winBefore: 50, winAfter: 50, loss: 0, accuracy: 100, verdict: 'best', reason: null, accept: [] };
    }
    const best = e.lines[0];
    const playedAt = atOf(step.action);
    const playedBest = best?.move === playedAt;
    const winBefore = best?.value ?? e.value;
    let winAfter: number;
    const next = evals[i + 1];
    if (after.phase === 'play' && next) winAfter = 100 - next.value;
    else if (after.result) winAfter = winnerOf(after.result) === step.seat ? 100 : winnerOf(after.result) === null ? 50 : 0;
    else winAfter = winBefore; // the pass that ends play: judged by the count, not here
    const loss = playedBest ? 0 : Math.max(0, winBefore - winAfter);
    const verdict = verdictFor(loss, playedBest);
    const second = e.lines[1];
    const accept = [best?.move, second && second.value >= winBefore - ALSO_RIGHT ? second.move : undefined].filter((m): m is string => typeof m === 'string' && m.length > 0);
    return {
      ply: i,
      seat: step.seat,
      played,
      best: best?.name ?? null,
      bestMove: best?.move ?? null,
      winBefore: Math.round(winBefore * 10) / 10,
      winAfter: Math.round(winAfter * 10) / 10,
      loss: Math.round(loss * 10) / 10,
      accuracy: Math.round(moveAccuracy(loss)),
      verdict,
      reason: verdict === 'inaccuracy' || verdict === 'mistake' || verdict === 'blunder' ? reasonFor(before, step.action, after, best) : null,
      accept,
    };
  });

  // Accuracy over the moves that were rated (stones and passes in play).
  const accuracy: Record<string, number> = {};
  for (const seat of [0, 1]) {
    const mine = moves.filter((m, i) => m.seat === seat && positions[i]?.phase === 'play' && (steps[i]?.action.type === 'play' || steps[i]?.action.type === 'pass'));
    accuracy[String(seat)] = mine.length === 0 ? 100 : Math.round(mine.reduce((a, m) => a + m.accuracy, 0) / mine.length);
  }
  const humans = record.players.flatMap((p, seat) => (p.kind === 'human' ? [seat] : []));
  return { version: ANALYSIS_VERSION, nodes: REVIEW_PLAYOUTS, moves, accuracy, keyMoments: keyMoments(moves, humans) };
}

export { putsInAtari };
