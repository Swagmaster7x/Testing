/**
 * What the shell needs from a playable game besides its rules: the play surface, how long its
 * events animate, how to describe them, its counters, its coach and its reference card.
 */
import type { ComponentType } from 'react';
import type { BotLevel } from '../ai/bot';
import type { GameDef, GameEvent, Outcome, Seat } from '../core/contract';
import type { QueueSnapshot } from '../core/events';
import type { Json } from '../core/json';
import type { GameRecord } from '../core/record';
import type { GameAnalysis } from '../teach/analysis';
import type { BoardArrow, BoardMark } from '../kits/board/GridBoard';
import type { SoundName } from '../shell/sound';
import type { MessageKey } from '../text';

/** Arrows and marked squares the coach draws on the board. */
export interface SurfaceOverlay {
  readonly arrows: readonly BoardArrow[];
  readonly marks: readonly BoardMark[];
}

export const NO_OVERLAY: SurfaceOverlay = { arrows: [], marks: [] };

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
  /** Board turned so the other side is at the bottom. */
  readonly flipped: boolean;
  /** Coach switches in force, by id (see GameCoach.helps). */
  readonly helps: Readonly<Record<string, boolean>>;
  readonly overlay: SurfaceOverlay;
  /** Once the game is over, what each seat turned out to be (see GameUi.revealSeat), by seat. */
  readonly reveal?: readonly (string | null)[];
  /** At a pass-and-play table, the other people's names by seat (null for a CPU or the viewer). */
  readonly names?: SeatNames;
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

/** One coach switch (PLAN.md 1.1, point 2). */
export interface CoachHelp {
  readonly id: string;
  readonly label: MessageKey;
  readonly on: boolean;
  /** Games played with this help on are training games and never move a rating. */
  readonly training: boolean;
}

/** A warning shown before a blunder is played, with the choice to take it back. */
export interface CoachWarning {
  readonly text: string;
  readonly overlay: SurfaceOverlay;
}

/** Asks the coach in the bot worker about the position a person is in, or about `state` when given. */
export type AskCoach = (query: Json, state?: unknown) => Promise<Json>;

export interface CoachPanelProps<S> {
  readonly state: S;
  /** The seat a person is about to play, or null when it is not their turn. */
  readonly seat: Seat | null;
  readonly helps: Readonly<Record<string, boolean>>;
  readonly ask: AskCoach;
  readonly setOverlay: (overlay: SurfaceOverlay) => void;
  /** Marks the game as training, for example when a hint is used. */
  readonly markTraining: () => void;
}

export interface GameCoach<S, A> {
  readonly helps: readonly CoachHelp[];
  readonly Panel: ComponentType<CoachPanelProps<S>>;
  /** When the blunder help is on: checks a person's move before the CPU answers it. */
  checkMove?(ask: AskCoach, before: S, action: A): Promise<CoachWarning | null>;
}

export interface ClockChoice {
  readonly id: string;
  readonly label: MessageKey;
  readonly initialMs: number;
  readonly incrementMs: number;
}

export interface OptionChoice {
  readonly value: string | number;
  readonly label: string;
}

export interface OptionField {
  readonly key: string;
  readonly label: string;
  readonly choices: readonly OptionChoice[];
}

export interface GameOptions<C> {
  readonly presets: readonly { readonly id: string; readonly label: string; readonly config: C }[];
  readonly fields: readonly OptionField[];
  /** The value of a field in a config, and a config with one field changed. */
  get(config: C, key: string): string | number;
  set(config: C, key: string, value: string | number): C;
}

/** Game review support: engine analysis of a finished game and "play on from here". */
export interface GameReviewSupport<S, C> {
  analyse(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null>;
  /** The options for a new game that starts from this position. */
  configAt(state: S): C;
}

/** A named set of options for the New game dialog ("Rules at this table", PLAN.md 2.3). */
export interface SetupPreset<C> {
  readonly id: string;
  readonly label: string;
  readonly detail?: string;
  readonly config: C;
  /** Rating points this preset takes off a CPU level's nominal rating (a handicap the CPU gives). */
  readonly ratingOffset?: number;
}

/**
 * Pass-and-play (several people at one device): the name of a seat played by another person at
 * this device, or null for the CPU's seats and the person holding the device. Games that call
 * other players "the CPU" use it to name people instead.
 */
export type SeatNames = (seat: Seat) => string | null;

export interface GameUi<S, A, C, V, E extends GameEvent> {
  readonly def: GameDef<S, A, C, V, E>;
  readonly levels: readonly BotLevel[];
  levelBlurb(level: number): string;
  readonly layout: 'board' | 'table';
  readonly Surface: ComponentType<SurfaceProps<S, A, E>>;
  /** Drawing of a seat's piece or colour for the player panel. */
  readonly SeatMark: ComponentType<{ seat: Seat }>;
  /** Extra things under a player in the side panel, such as captured pieces. `start` is the opening position. */
  readonly SeatExtra?: ComponentType<{ state: S; start: S; seat: Seat }>;
  readonly sides: readonly SideChoice[];
  sideName(seat: Seat): string;
  /** What the move list puts before each move; the side name when absent (chess uses none). `seats` is how many sit at the table. */
  readonly movePrefix?: (seat: Seat, mySeats?: readonly Seat[], seats?: number, names?: SeatNames) => string;
  /** How a move reads in the move list; its notation when absent. */
  readonly moveText?: (action: A) => string;
  /** A player's name in the player list and the log ("Partner", "Right"); "You" or "CPU" when absent. */
  readonly playerName?: (seat: Seat, mySeats: readonly Seat[], seats: number, names?: SeatNames) => string;
  eventDuration(event: E): number;
  /**
   * A line for the log, or null to leave the event out. `mySeats` is the person holding the device
   * (all people at it, outside pass-and-play); `seats` how many sit at the table; `names` names the
   * other people at the device in pass-and-play.
   */
  describeEvent(event: E, mySeats?: readonly Seat[], seats?: number, names?: SeatNames): string | null;
  counters(state: S, mySeats: readonly Seat[]): readonly CounterRow[];
  sound(event: E): SoundName | null;
  reference(): readonly ReferenceSection[];
  /** Turn the board so a person playing the second seat sees their side at the bottom. */
  readonly flipForSeat?: (seat: Seat) => boolean;
  readonly coach?: GameCoach<S, A>;
  /** Clock choices offered when starting a game. The first is the default. */
  readonly clocks?: readonly ClockChoice[];
  /** The result when a seat runs out of time (chess: a draw if the other side cannot mate). */
  timeoutOutcome?(state: S, seat: Seat): Outcome;
  /** Export a record in the game's own file format (PGN for chess). */
  readonly exportRecord?: { readonly extension: string; readonly mime: string; write(record: GameRecord, names: readonly string[]): string };
  /** More formats offered beside `exportRecord` (shogi: CSA and SFEN); `canWrite` hides one a record cannot be written in. */
  readonly moreExports?: readonly { readonly extension: string; readonly mime: string; write(record: GameRecord, names: readonly string[]): string; canWrite?(record: GameRecord): boolean }[];
  readonly review?: GameReviewSupport<S, C>;
  /** The rules at this table: named presets and every option (PLAN.md 2.3). */
  readonly options?: GameOptions<C>;
  /** The squares a move goes from and to, for arrows on a board. */
  moveSquares?(action: A): { from: string; to: string } | null;
  /** Import a game from its own file format into a record's config and actions. */
  readonly importRecord?: { readonly accept: string; read(text: string): { config: C; actions: readonly Json[]; outcome: Outcome | null; names: readonly string[] } };
  /** Named rule presets offered when starting a game; the first is the default. */
  readonly presets?: readonly SetupPreset<C>[];
  /** The options "Play again" keeps from a finished game (presets, not a set-up position); the standard game when absent. */
  replayConfig?(config: C): C;
  /** "Rules at this table" (PLAN.md 2.3): the game's own picker for a new game's options, presets first. */
  readonly rules?: { readonly Picker: ComponentType<{ value: C; onChange: (config: C) => void }> };
  /** The result of a finished game in the game's own words ("You finished 2nd of 6, +45 chips"); the win/loss line when absent or null. */
  resultText?(record: GameRecord): string | null;
  /** After a game, what a CPU seat turned out to be (poker: its playing style), from the opening position; null shows nothing. */
  revealSeat?(start: S, record: GameRecord, seat: Seat): string | null;
  /**
   * Pass-and-play: true when a seat's view hides something from the others (cards, tiles), so the
   * table covers itself between two people's turns. Worked out from the views when absent.
   */
  readonly hiddenInfo?: boolean;
}

export type AnyGameUi = GameUi<unknown, unknown, unknown, unknown, GameEvent>;
