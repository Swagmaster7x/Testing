import type { BotLevel } from '../../ai/bot';

/**
 * Go CPU levels with nominal ratings (PLAN.md 2.7). Strength comes from the playout budget in
 * bots.ts; levels 1 to 3 also keep a beginner's habits. Names and blurbs are in the text catalogue.
 */
export const GO_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 400 },
  { level: 2, rating: 650 },
  { level: 3, rating: 900 },
  { level: 4, rating: 1150 },
  { level: 5, rating: 1400 },
  { level: 6, rating: 1650 },
];
