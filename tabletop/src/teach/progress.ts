/**
 * Ratings and accuracy from the history (PLAN.md 2.7). Recomputed whenever they are shown, so
 * they cannot drift: play rating from finished games without helps against the CPU, problem
 * rating from first, unhinted tries.
 */
import { outcomePoints } from '../core/contract';
import type { GameRecord } from '../core/record';
import type { ProblemAttemptRow } from '../store/db';
import type { RatingState } from './rating';
import { ratingFrom, START_PLAY_RATING, START_PROBLEM_RATING } from './rating';

export function problemRating(attempts: readonly ProblemAttemptRow[]): RatingState {
  const rated = attempts.filter((a) => a.rated === true && typeof a.rating === 'number');
  return ratingFrom(
    START_PROBLEM_RATING,
    rated.map((a) => ({ opponent: a.rating as number, score: a.solved ? 1 : 0 })),
  );
}

/** A finished game counts for the play rating when one person played one CPU level, without helps. */
export function ratedGame(record: GameRecord, standardStart: boolean): boolean {
  if (record.status !== 'finished' || !record.outcome || record.training || !standardStart) return false;
  const humans = record.players.filter((p) => p.kind === 'human');
  const bots = record.players.filter((p) => p.kind === 'bot');
  return humans.length === 1 && bots.length === 1 && typeof bots[0]?.level === 'number';
}

export function playRating(records: readonly GameRecord[], levelRating: (level: number) => number | null, isStandard: (record: GameRecord) => boolean): RatingState {
  const games = records.filter((r) => ratedGame(r, isStandard(r))).sort((a, b) => a.updatedAt - b.updatedAt);
  const results: { opponent: number; score: number }[] = [];
  for (const r of games) {
    const seat = r.players.findIndex((p) => p.kind === 'human');
    const bot = r.players.find((p) => p.kind === 'bot');
    const opponent = bot?.level !== undefined ? levelRating(bot.level) : null;
    if (opponent === null || !r.outcome) continue;
    results.push({ opponent, score: outcomePoints(r.outcome, seat) });
  }
  return ratingFrom(START_PLAY_RATING, results);
}
