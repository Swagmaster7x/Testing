/** Ratings for the screens, recomputed from the history and stored for backups and Progress. */
import { stableStringify } from '../core/json';
import type { AnyGameUi } from '../games/types';
import { appDb } from '../store/db';
import { attemptsFor, saveRating } from '../store/learning';
import { finishedRecords } from '../store/records';
import type { RatingState } from '../teach/rating';
import { suggestLevel } from '../teach/rating';
import { playRating, problemRating } from '../teach/progress';

export async function playRatingFor(ui: AnyGameUi, profileId: string): Promise<RatingState> {
  const records = await finishedRecords(appDb(), profileId, ui.def.id);
  const standard = stableStringify(ui.def.codec.config.toJSON(ui.def.defaultConfig));
  const state = playRating(records, (level) => ui.levels.find((l) => l.level === level)?.rating ?? null, (r) => stableStringify(r.config) === standard);
  await saveRating(appDb(), profileId, ui.def.id, 'play', state, Date.now());
  return state;
}

export async function problemRatingFor(gameId: string, profileId: string): Promise<RatingState> {
  const state = problemRating(await attemptsFor(appDb(), profileId, gameId));
  await saveRating(appDb(), profileId, gameId, 'problems', state, Date.now());
  return state;
}

export function suggestedLevel(ui: AnyGameUi, rating: RatingState): number {
  return suggestLevel(rating.rating, ui.levels) ?? ui.levels[0]?.level ?? 1;
}
