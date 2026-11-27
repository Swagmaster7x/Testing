/**
 * What a game's bots look like from the outside. Bots receive a view, never the full state,
 * and run in a worker (see bot.worker.ts); the same code runs in-process for ladders and tests.
 */
import type { Seat } from '../core/contract';
import type { Json } from '../core/json';
import type { Rng } from '../core/rng';

export interface BotLevel {
  readonly level: number;
  /** A nominal rating for the level (PLAN.md 2.7). */
  readonly rating: number;
}

export interface BotInput<V> {
  readonly view: V;
  readonly seat: Seat;
  readonly level: number;
  readonly rng: Rng;
}

export interface BotChoice<A> {
  readonly action: A;
  /** Reason tags such as "blocks" or "fork"; the text catalogue turns them into words. */
  readonly tags: readonly string[];
  readonly nodes: number;
}

export interface BotSet<V, A> {
  readonly gameId: string;
  readonly levels: readonly BotLevel[];
  choose(input: BotInput<V>): BotChoice<A>;
  encode(action: A): Json;
}

/** Bot seeds come from the game's seed and the move number, so a resumed game gets the same reply. */
export function botSeed(gameSeed: string, ply: number): string {
  return `${gameSeed}/bot/${ply}`;
}
