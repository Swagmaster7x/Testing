import type { BotLevel } from '../../ai/bot';

/**
 * Chinese Checkers CPU levels with nominal ratings (PLAN.md 2.7). Strength comes from the search in
 * bots.ts: levels 1 and 2 look one move ahead (1 jumps as far as it can, 2 keeps its marbles
 * together); 3 to 6 search further with growing node budgets. Blurbs are in the text catalogue.
 */
export const CC_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 350 },
  { level: 2, rating: 600 },
  { level: 3, rating: 850 },
  { level: 4, rating: 1100 },
  { level: 5, rating: 1350 },
  { level: 6, rating: 1600 },
];
