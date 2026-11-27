import type { BotLevel } from '../../ai/bot';

/**
 * Shogi CPU levels with nominal ratings (PLAN.md 2.7). Ratings are anchored at 400 for level 1
 * and spaced by the scores each level made against the one below in the ladder
 * (`npm run ladder -- shogi`; PROGRESS-M8.md has the measured table). Names and blurbs are in the
 * text catalogue.
 */
export const SHOGI_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 400 },
  { level: 2, rating: 650 },
  { level: 3, rating: 850 },
  { level: 4, rating: 1050 },
  { level: 5, rating: 1250 },
  { level: 6, rating: 1400 },
  { level: 7, rating: 1550 },
  { level: 8, rating: 1700 },
];

export interface ShogiLevelParams {
  /** Node budget for the move. */
  readonly nodes: number;
  readonly maxDepth: number;
  /** Search every root move fully, for planned mistakes. */
  readonly exact: boolean;
  /** Chance of choosing something other than the best move. */
  readonly error: number;
  /** Largest loss a planned mistake may cost, in engine units (a pawn is about 90). */
  readonly window: number;
  /** How much more often a capture is picked when making a mistake. */
  readonly captureBias: number;
  /** Whether quiescence looks at checking drops (weak levels miss drop tactics). */
  readonly checkDrops: boolean;
  readonly quiescence: number;
  /** Random wobble in the evaluation, so a level does not play the same game every time. */
  readonly noise: number;
}

export const LEVEL_PARAMS: Readonly<Record<number, ShogiLevelParams>> = {
  1: { nodes: 2_500, maxDepth: 1, exact: true, error: 0.85, window: 700, captureBias: 3, checkDrops: false, quiescence: 2, noise: 12 },
  2: { nodes: 8_000, maxDepth: 2, exact: true, error: 0.55, window: 420, captureBias: 2, checkDrops: false, quiescence: 4, noise: 12 },
  3: { nodes: 20_000, maxDepth: 3, exact: true, error: 0.3, window: 260, captureBias: 1.5, checkDrops: true, quiescence: 6, noise: 12 },
  4: { nodes: 40_000, maxDepth: 30, exact: false, error: 0, window: 0, captureBias: 1, checkDrops: true, quiescence: 8, noise: 12 },
  5: { nodes: 90_000, maxDepth: 30, exact: false, error: 0, window: 0, captureBias: 1, checkDrops: true, quiescence: 8, noise: 12 },
  6: { nodes: 180_000, maxDepth: 30, exact: false, error: 0, window: 0, captureBias: 1, checkDrops: true, quiescence: 8, noise: 12 },
  7: { nodes: 320_000, maxDepth: 30, exact: false, error: 0, window: 0, captureBias: 1, checkDrops: true, quiescence: 8, noise: 12 },
  8: { nodes: 550_000, maxDepth: 30, exact: false, error: 0, window: 0, captureBias: 1, checkDrops: true, quiescence: 8, noise: 12 },
};
