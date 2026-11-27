import type { BotLevel } from '../../ai/bot';

/** CPU levels for the fixture game. Their names and blurbs live in the text catalogue. */
export const NOUGHTS_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 400 },
  { level: 2, rating: 800 },
  { level: 3, rating: 1200 },
];
