/**
 * What the shell needs from a playable game besides its rules: the play surface, how long its
 * events animate, how to describe them, its counters and its reference card.
 */
import type { ComponentType } from 'react';
import type { BotLevel } from '../ai/bot';
import type { GameDef, GameEvent, Seat } from '../core/contract';
import type { QueueSnapshot } from '../core/events';
import type { SoundName } from '../shell/sound';
import type { MessageKey } from '../text';

export interface SurfaceProps<S, A, E> {
  readonly state: S;
  /** Seats played by people on this device. */
  readonly mySeats: readonly Seat[];
  /** True when a person may act now. */
  readonly canAct: boolean;
  readonly legal: readonly A[];
  readonly lastAction: A | null;
  readonly anim: QueueSnapshot<E>;
  readonly onAction: (action: A) => void;
  /** Skips the animations still queued (a tap on the table). */
  readonly onSkip: () => void;
}

export interface CounterRow {
  readonly label: string;
  readonly value: string;
}

export interface ReferenceSection {
  readonly title: MessageKey;
  readonly items: readonly string[];
}

export interface SideChoice {
  readonly id: string;
  readonly label: MessageKey;
  /** The seat a person takes, or "either" to let the seed decide. */
  readonly seat: Seat | 'either';
}

export interface GameUi<S, A, C, V, E extends GameEvent> {
  readonly def: GameDef<S, A, C, V, E>;
  readonly levels: readonly BotLevel[];
  levelBlurb(level: number): string;
  readonly layout: 'board' | 'table';
  readonly Surface: ComponentType<SurfaceProps<S, A, E>>;
  /** Drawing of a seat's piece or colour for the player panel. */
  readonly SeatMark: ComponentType<{ seat: Seat }>;
  readonly sides: readonly SideChoice[];
  sideName(seat: Seat): string;
  eventDuration(event: E): number;
  /** A line for the log, or null to leave the event out. */
  describeEvent(event: E): string | null;
  counters(state: S, mySeats: readonly Seat[]): readonly CounterRow[];
  sound(event: E): SoundName | null;
  reference(): readonly ReferenceSection[];
}

export type AnyGameUi = GameUi<unknown, unknown, unknown, unknown, GameEvent>;
