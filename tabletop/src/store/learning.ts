/**
 * Learning data on the device: lesson progress, problem attempts, review cards, ratings and
 * game analyses. Every row belongs to a profile.
 */
import { isJsonObject } from '../core/json';
import type { PracticeItem, StoredCard } from '../teach/srs';
import { cardFromJson, cardToJson, gradeSchedule, itemKey, newSchedule } from '../teach/srs';
import type { RatingState } from '../teach/rating';
import type { AnalysisRow, LessonProgressRow, ProblemAttemptRow, RatingRow, ReviewCardRow, TabletopDb } from './db';

// Lessons

export interface LessonResult {
  readonly mistakes: number;
  /** True when the lesson was passed through "I already know this". */
  readonly skipped: boolean;
}

export async function lessonProgress(db: TabletopDb, profileId: string, gameId: string): Promise<Map<string, LessonProgressRow>> {
  const rows = await db.lessonProgress.where('profileId').equals(profileId).toArray();
  return new Map(rows.filter((r) => r.gameId === gameId && r.completedAt !== null).map((r) => [r.lessonId, r]));
}

export async function allLessonProgress(db: TabletopDb, profileId: string): Promise<LessonProgressRow[]> {
  return (await db.lessonProgress.where('profileId').equals(profileId).toArray()).filter((r) => r.completedAt !== null);
}

/** Records a finished lesson. A lesson finished for real replaces one that was only skipped. */
export async function completeLessons(db: TabletopDb, profileId: string, gameId: string, lessonIds: readonly string[], result: LessonResult, now: number): Promise<void> {
  await db.transaction('rw', db.lessonProgress, async () => {
    for (const lessonId of lessonIds) {
      const old = await db.lessonProgress.get([profileId, lessonId]);
      if (old && result.skipped && old.completedAt !== null) continue;
      await db.lessonProgress.put({ profileId, lessonId, gameId, completedAt: now, data: { mistakes: result.mistakes, skipped: result.skipped } });
    }
  });
}

export function wasSkipped(row: LessonProgressRow): boolean {
  return isJsonObject(row.data) && row.data.skipped === true;
}

// Problems

export async function addAttempt(db: TabletopDb, attempt: Omit<ProblemAttemptRow, 'id'>): Promise<void> {
  await db.problemAttempts.add(attempt);
}

/** Attempts for a game, oldest first. */
export async function attemptsFor(db: TabletopDb, profileId: string, gameId: string): Promise<ProblemAttemptRow[]> {
  const rows = await db.problemAttempts.where('[profileId+gameId]').equals([profileId, gameId]).toArray();
  return rows.sort((a, b) => a.at - b.at || (a.id ?? 0) - (b.id ?? 0));
}

// Review cards

export interface ReviewCard extends StoredCard {
  readonly id: string;
  readonly gameId: string;
}

function toReviewCard(row: ReviewCardRow): ReviewCard {
  return { ...cardFromJson(row.card), id: row.id, gameId: row.gameId };
}

/** Adds an item to the review queue, due now. Returns false if it was already there. */
export async function addCard(db: TabletopDb, profileId: string, gameId: string, item: PracticeItem, now: number): Promise<boolean> {
  const id = `${profileId}:${itemKey(gameId, item)}`;
  if (await db.reviewCards.get(id)) return false;
  const card: StoredCard = { item, schedule: newSchedule(now), addedAt: now };
  await db.reviewCards.put({ id, profileId, gameId, due: card.schedule.due, card: cardToJson(card) });
  return true;
}

export async function hasCard(db: TabletopDb, profileId: string, gameId: string, item: PracticeItem): Promise<boolean> {
  return (await db.reviewCards.get(`${profileId}:${itemKey(gameId, item)}`)) !== undefined;
}

export async function cardsFor(db: TabletopDb, profileId: string, gameId: string): Promise<ReviewCard[]> {
  const rows = await db.reviewCards.where('[profileId+gameId]').equals([profileId, gameId]).toArray();
  return rows.map(toReviewCard).sort((a, b) => a.schedule.due - b.schedule.due);
}

export async function dueCards(db: TabletopDb, profileId: string, gameId: string, now: number): Promise<ReviewCard[]> {
  return (await cardsFor(db, profileId, gameId)).filter((c) => c.schedule.due <= now);
}

export async function gradeCard(db: TabletopDb, id: string, right: boolean, now: number): Promise<void> {
  await db.transaction('rw', db.reviewCards, async () => {
    const row = await db.reviewCards.get(id);
    if (!row) return;
    const card = cardFromJson(row.card);
    const schedule = gradeSchedule(card.schedule, now, right);
    await db.reviewCards.put({ ...row, due: schedule.due, card: cardToJson({ ...card, schedule }) });
  });
}

export async function removeCard(db: TabletopDb, id: string): Promise<void> {
  await db.reviewCards.delete(id);
}

// Ratings

export type RatingKind = 'play' | 'problems';

export async function saveRating(db: TabletopDb, profileId: string, gameId: string, kind: RatingKind, state: RatingState, now: number): Promise<void> {
  await db.ratings.put({ profileId, gameId, kind, rating: state.rating, games: state.count, updatedAt: now });
}

export async function getRating(db: TabletopDb, profileId: string, gameId: string, kind: RatingKind): Promise<RatingRow | undefined> {
  return db.ratings.get([profileId, gameId, kind]);
}

// Analyses

export async function getAnalysis(db: TabletopDb, recordId: string): Promise<AnalysisRow | undefined> {
  return db.analyses.get(recordId);
}

export async function saveAnalysis(db: TabletopDb, row: AnalysisRow): Promise<void> {
  await db.analyses.put(row);
}

export async function analysesFor(db: TabletopDb, profileId: string, gameId: string): Promise<AnalysisRow[]> {
  return db.analyses.where('[profileId+gameId]').equals([profileId, gameId]).toArray();
}

