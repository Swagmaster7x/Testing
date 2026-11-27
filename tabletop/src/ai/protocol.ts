/** Messages between the table and the bot worker. Only a seat's view ever crosses. */
import type { Seat } from '../core/contract';
import type { Json } from '../core/json';

export interface BotRequest {
  readonly id: number;
  readonly gameId: string;
  /** The output of `view(state, seat)`. Never the full state. */
  readonly view: unknown;
  readonly seat: Seat;
  readonly level: number;
  readonly seed: string;
}

export interface BotReplyOk {
  readonly id: number;
  readonly ok: true;
  readonly action: Json;
  readonly tags: readonly string[];
  readonly nodes: number;
  readonly ms: number;
}

export interface BotReplyError {
  readonly id: number;
  readonly ok: false;
  readonly error: string;
}

export type BotReply = BotReplyOk | BotReplyError;
