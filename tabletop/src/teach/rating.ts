/**
 * Ratings (PLAN.md 2.7). Elo, recomputed from the history each time, so it can never drift or
 * count a game twice. Only games without helps count for play; only first, unhinted tries count
 * for problems. The suggested level aims at about a 55% chance for you.
 */

export const START_PLAY_RATING = 500;
export const START_PROBLEM_RATING = 600;
/** Results needed before a rating stops being provisional. */
export const SETTLED_AFTER = 10;
/** The win chance the suggested level aims for. */
export const TARGET_SCORE = 0.55;

export interface RatingState {
  readonly rating: number;
  readonly count: number;
}

/** Expected score for a player rated `a` against `b`. */
export function expectedScore(a: number, b: number): number {
  return 1 / (1 + 10 ** ((b - a) / 400));
}

/** Big steps while the rating is new, smaller once it has settled. */
export function kFactor(count: number): number {
  if (count < SETTLED_AFTER) return 48;
  if (count < 30) return 32;
  return 20;
}

export function updateRating(state: RatingState, opponent: number, score: number): RatingState {
  const next = state.rating + kFactor(state.count) * (score - expectedScore(state.rating, opponent));
  return { rating: Math.max(100, Math.round(next)), count: state.count + 1 };
}

/** Folds a list of results (oldest first) into a rating. */
export function ratingFrom(start: number, results: readonly { opponent: number; score: number }[]): RatingState {
  return results.reduce<RatingState>((s, r) => updateRating(s, r.opponent, r.score), { rating: start, count: 0 });
}

/** The level whose rating gives you closest to a 55% chance. */
export function suggestLevel(rating: number, levels: readonly { level: number; rating: number }[]): number | null {
  let best: { level: number; gap: number } | null = null;
  for (const l of levels) {
    const gap = Math.abs(expectedScore(rating, l.rating) - TARGET_SCORE);
    if (!best || gap < best.gap - 1e-9) best = { level: l.level, gap };
  }
  return best?.level ?? null;
}
