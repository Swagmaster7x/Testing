/** Messages between the table and the bot worker. Only a seat's view ever crosses. */
import type { Seat } from '../core/contract';
import type { Json } from '../core/json';

interface RequestBase {
  readonly id: number;
  readonly gameId: string;
  /** The output of `view(state, seat)`. Never the full state. */
  readonly view: unknown;
  readonly seat: Seat;
  readonly seed: string;
  /** Where the app's files live, so engines can load their own files (for example engines/). */
  readonly assetsBase: string;
}

/** Choose a move for a CPU seat. */
export interface ChooseRequest extends RequestBase {
  readonly kind: 'choose';
  readonly level: number;
}

/** A coach question about a person's own position: a hint, a threat, a blunder check. */
export interface AdviseRequest extends RequestBase {
  readonly kind: 'advise';
  readonly query: Json;
}

export type BotRequest = ChooseRequest | AdviseRequest;

export interface ChooseReply {
  readonly id: number;
  readonly ok: true;
  readonly kind: 'choose';
  readonly action: Json;
  readonly tags: readonly string[];
  readonly nodes: number;
  readonly ms: number;
}

export interface AdviseReply {
  readonly id: number;
  readonly ok: true;
  readonly kind: 'advise';
  readonly advice: Json;
  readonly ms: number;
}

export interface ErrorReply {
  readonly id: number;
  readonly ok: false;
  readonly error: string;
}

export type BotReply = ChooseReply | AdviseReply | ErrorReply;
