/**
 * Spaced review (PLAN.md 1.1): each mistake you keep becomes a card that comes back on a
 * schedule until you stop getting it wrong. The schedule is FSRS (ts-fsrs). Cards are stored as
 * plain JSON with times in milliseconds.
 */
import type { Card } from 'ts-fsrs';
import { createEmptyCard, fsrs, generatorParameters, Rating } from 'ts-fsrs';
import type { Json } from '../core/json';
import { isJsonObject } from '../core/json';

/** What a card asks. A problem from a set, or a position from one of your games. */
export type PracticeItem =
  | { readonly kind: 'problem'; readonly problemId: string }
  | {
      readonly kind: 'position';
      /** The position, in the game's notation, with you to move. */
      readonly position: string;
      /** Moves that count as right (the best move, and any about as good). */
      readonly accept: readonly string[];
      /** The move you played, shown after you answer. */
      readonly played: string | null;
      readonly recordId: string | null;
      readonly ply: number | null;
    };

export interface Schedule {
  readonly due: number;
  readonly stability: number;
  readonly difficulty: number;
  readonly scheduledDays: number;
  readonly reps: number;
  readonly lapses: number;
  readonly learningSteps: number;
  readonly state: number;
  readonly lastReview: number | null;
}

export interface StoredCard {
  readonly item: PracticeItem;
  readonly schedule: Schedule;
  readonly addedAt: number;
}

const scheduler = fsrs(generatorParameters({ enable_fuzz: false }));

function toSchedule(card: Card): Schedule {
  return {
    due: card.due.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    scheduledDays: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    learningSteps: card.learning_steps,
    state: card.state,
    lastReview: card.last_review ? card.last_review.getTime() : null,
  };
}

function toCard(s: Schedule): Card {
  return {
    due: new Date(s.due),
    stability: s.stability,
    difficulty: s.difficulty,
    elapsed_days: 0,
    scheduled_days: s.scheduledDays,
    reps: s.reps,
    lapses: s.lapses,
    learning_steps: s.learningSteps,
    state: s.state,
    ...(s.lastReview !== null ? { last_review: new Date(s.lastReview) } : {}),
  } as Card;
}

/** A new card, due at once. */
export function newSchedule(now: number): Schedule {
  return toSchedule(createEmptyCard(new Date(now)));
}

/** The schedule after an answer: right first time is "good", anything else is "again". */
export function gradeSchedule(schedule: Schedule, now: number, right: boolean): Schedule {
  return toSchedule(scheduler.next(toCard(schedule), new Date(now), right ? Rating.Good : Rating.Again).card);
}

/** A stable id for an item, so the same mistake is never added twice. */
export function itemKey(gameId: string, item: PracticeItem): string {
  if (item.kind === 'problem') return `${gameId}:problem:${item.problemId}`;
  return `${gameId}:position:${item.position}`;
}

export function cardToJson(card: StoredCard): Json {
  return card as unknown as Json;
}

export function cardFromJson(json: Json): StoredCard {
  if (!isJsonObject(json) || !isJsonObject(json.item) || !isJsonObject(json.schedule)) throw new Error('A review card is damaged');
  return json as unknown as StoredCard;
}
