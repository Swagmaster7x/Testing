/**
 * Game review (PLAN.md 2.7): each decision is rated by its loss in winning chances, the biggest
 * swings are the key moments, and accuracy is averaged per seat. The engine work is the game's;
 * this module holds the shared arithmetic and the stored shape.
 */
import type { Json } from '../core/json';
import { isJsonObject } from '../core/json';

export const ANALYSIS_VERSION = 1;

export type Verdict = 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';

/** Loss in winning chances (percentage points) at which a move earns each verdict. */
export const THRESHOLDS = { inaccuracy: 5, mistake: 10, blunder: 15 } as const;
export const MIN_KEY_MOMENTS = 3;
export const MAX_KEY_MOMENTS = 5;

export interface Reason {
  /** A message key under "why." in the catalogue. */
  readonly key: string;
  readonly params: Readonly<Record<string, string | number>>;
}

export interface MoveVerdict {
  /** Index of the move in the record (0 is the first move). */
  readonly ply: number;
  readonly seat: number;
  /** The move played, in notation. */
  readonly played: string;
  /** The engine's choice, in notation and in canonical form. */
  readonly best: string | null;
  readonly bestMove: string | null;
  /** The mover's winning chances (0 to 100) with the best move, and after the move played. */
  readonly winBefore: number;
  readonly winAfter: number;
  readonly loss: number;
  readonly accuracy: number;
  readonly verdict: Verdict;
  readonly reason: Reason | null;
  /** Moves that count as right if this position becomes a practice card. */
  readonly accept: readonly string[];
  /** How to name the moment ("Trick 5: As de oros"); a move number is used when absent. */
  readonly label?: string;
}

export interface GameAnalysis {
  readonly version: number;
  readonly nodes: number;
  readonly moves: readonly MoveVerdict[];
  /** Mean accuracy by seat, 0 to 100. */
  readonly accuracy: Readonly<Record<string, number>>;
  /** Plies of the key moments, in game order. */
  readonly keyMoments: readonly number[];
}

/** Winning chances for a centipawn score (the curve Lichess publishes), 0 to 100. */
export function winChance(centipawns: number): number {
  const cp = Math.max(-1000, Math.min(1000, centipawns));
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

/** Accuracy of one move from its loss in winning chances, 0 to 100. */
export function moveAccuracy(loss: number): number {
  return Math.max(0, Math.min(100, 103.1668 * Math.exp(-0.04354 * Math.max(0, loss)) - 3.1669));
}

export function verdictFor(loss: number, playedBest: boolean): Verdict {
  if (playedBest) return 'best';
  if (loss >= THRESHOLDS.blunder) return 'blunder';
  if (loss >= THRESHOLDS.mistake) return 'mistake';
  if (loss >= THRESHOLDS.inaccuracy) return 'inaccuracy';
  return 'good';
}

/** The biggest swings: up to five moves losing at least an inaccuracy's worth, in game order. */
export function keyMoments(moves: readonly MoveVerdict[], focusSeats: readonly number[]): number[] {
  const swings = moves.filter((m) => m.loss >= THRESHOLDS.inaccuracy);
  const mine = swings.filter((m) => focusSeats.includes(m.seat)).sort((a, b) => b.loss - a.loss);
  const theirs = swings.filter((m) => !focusSeats.includes(m.seat) && m.loss >= THRESHOLDS.mistake).sort((a, b) => b.loss - a.loss);
  const picked = mine.slice(0, MAX_KEY_MOMENTS);
  for (const m of theirs) if (picked.length < MIN_KEY_MOMENTS) picked.push(m);
  return picked.map((m) => m.ply).sort((a, b) => a - b);
}

export function seatAccuracy(moves: readonly MoveVerdict[]): Record<string, number> {
  const by = new Map<number, number[]>();
  for (const m of moves) by.set(m.seat, [...(by.get(m.seat) ?? []), m.accuracy]);
  const out: Record<string, number> = {};
  for (const [seat, list] of by) out[String(seat)] = Math.round(list.reduce((a, b) => a + b, 0) / list.length);
  return out;
}

export function analysisToJson(a: GameAnalysis): Json {
  return a as unknown as Json;
}

export function analysisFromJson(json: Json): GameAnalysis | null {
  if (!isJsonObject(json) || json.version !== ANALYSIS_VERSION || !Array.isArray(json.moves)) return null;
  return json as unknown as GameAnalysis;
}
