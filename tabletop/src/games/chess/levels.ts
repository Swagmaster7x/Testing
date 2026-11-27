import type { BotLevel } from '../../ai/bot';

/** Chess CPU levels with nominal ratings (PLAN.md 2.7). Names and blurbs are in the text catalogue. */
export const CHESS_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 400 },
  { level: 2, rating: 700 },
  { level: 3, rating: 1000 },
  { level: 4, rating: 1500 },
  { level: 5, rating: 1750 },
  { level: 6, rating: 2000 },
  { level: 7, rating: 2300 },
  { level: 8, rating: 2700 },
];
