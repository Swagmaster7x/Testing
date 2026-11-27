/**
 * Game records. A record is config + seed + actions, plus who sat where and the rules version.
 * Replays, save and resume, bug reports, lesson positions and tests all use this one form.
 */
import type { AnyGameDef, GameDef, GameEvent, Outcome, Seat } from './contract';
import { resignationOutcome } from './contract';
import type { Json } from './json';
import { createRng } from './rng';
import { isJsonObject } from './json';

export type PlayerKind = 'human' | 'bot';

export interface SeatPlayer {
  readonly kind: PlayerKind;
  /** CPU level, for bots. */
  readonly level?: number;
}

export type RecordStatus = 'active' | 'finished';

/** How a game ended when it did not end on the board. */
export interface Ending {
  readonly kind: 'resigned' | 'timeout';
  readonly seat: Seat;
}

/** An optional clock. Remaining time is saved after every move, per seat. */
export interface ClockState {
  readonly initialMs: number;
  readonly incrementMs: number;
  readonly remainingMs: readonly number[];
}

export interface GameRecord {
  readonly id: string;
  readonly gameId: string;
  readonly rulesVersion: number;
  readonly appVersion: string;
  readonly config: Json;
  readonly seed: string;
  /** Indexed by seat. */
  readonly players: readonly SeatPlayer[];
  /** Encoded with the game's action codec, in play order. */
  readonly actions: readonly Json[];
  readonly status: RecordStatus;
  readonly outcome: Outcome | null;
  /** Set when a seat resigned or lost on time rather than playing to the end. */
  readonly ending: Ending | null;
  readonly clock: ClockState | null;
  /** Played with coach helps on: such games never move a rating. */
  readonly training: boolean;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface NewRecordInput<Config> {
  readonly id: string;
  readonly config: Config;
  readonly seed: string;
  readonly players: readonly SeatPlayer[];
  readonly appVersion: string;
  readonly training: boolean;
  readonly now: number;
  /** Minutes and seconds per move, when the table uses a clock. */
  readonly clock?: { readonly initialMs: number; readonly incrementMs: number } | null;
}

export function newRecord<S, A, C, V, E extends GameEvent>(
  def: GameDef<S, A, C, V, E>,
  input: NewRecordInput<C>,
): GameRecord {
  return {
    id: input.id,
    gameId: def.id,
    rulesVersion: def.rulesVersion,
    appVersion: input.appVersion,
    config: def.codec.config.toJSON(input.config),
    seed: input.seed,
    players: input.players.map((p) => ({ ...p })),
    actions: [],
    status: 'active',
    outcome: null,
    ending: null,
    clock: input.clock
      ? {
          initialMs: input.clock.initialMs,
          incrementMs: input.clock.incrementMs,
          remainingMs: def.seats(def.setup(input.config, createRng(input.seed))).map(() => input.clock?.initialMs ?? 0),
        }
      : null,
    training: input.training,
    createdAt: input.now,
    updatedAt: input.now,
  };
}

export function withAction(record: GameRecord, action: Json, now: number): GameRecord {
  if (record.status !== 'active') throw new Error('Cannot add a move to a finished game');
  return { ...record, actions: [...record.actions, action], updatedAt: now };
}

export function withOutcome(record: GameRecord, outcome: Outcome, now: number): GameRecord {
  return { ...record, status: 'finished', outcome, updatedAt: now };
}

export function withResignation(record: GameRecord, seat: Seat, seats: readonly Seat[], now: number): GameRecord {
  if (record.status !== 'active') throw new Error('Cannot resign a finished game');
  return { ...record, status: 'finished', ending: { kind: 'resigned', seat }, outcome: resignationOutcome(seats, seat), updatedAt: now };
}

/** A loss on time. `outcome` lets a game turn it into a draw when the other side cannot win. */
export function withTimeout(record: GameRecord, seat: Seat, outcome: Outcome, now: number): GameRecord {
  if (record.status !== 'active') throw new Error('The game is already over');
  return { ...record, status: 'finished', ending: { kind: 'timeout', seat }, outcome, updatedAt: now };
}

/** Removes the last `count` moves (a take-back), keeping the clock as it is. */
export function withoutLastMoves(record: GameRecord, count: number, now: number): GameRecord {
  if (record.status !== 'active') throw new Error('Cannot take back a move in a finished game');
  return { ...record, actions: record.actions.slice(0, Math.max(0, record.actions.length - count)), updatedAt: now };
}

export function withClock(record: GameRecord, remainingMs: readonly number[]): GameRecord {
  if (!record.clock) return record;
  return { ...record, clock: { ...record.clock, remainingMs: [...remainingMs] } };
}

/** The seats a person plays in this record. */
export function humanSeats(record: GameRecord): Seat[] {
  const seats: Seat[] = [];
  record.players.forEach((p, seat) => {
    if (p.kind === 'human') seats.push(seat);
  });
  return seats;
}

/**
 * Reads a record from storage or a backup, checking its shape. Throws on anything malformed.
 * The game's own codecs check the config and actions when the record is replayed.
 */
export function parseRecord(value: unknown): GameRecord {
  if (!isJsonObject(value)) throw new Error('A game record must be an object');
  const r = value;
  const str = (k: string): string => {
    const v = r[k];
    if (typeof v !== 'string') throw new Error(`Game record field "${k}" must be text`);
    return v;
  };
  const num = (k: string): number => {
    const v = r[k];
    if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`Game record field "${k}" must be a number`);
    return v;
  };
  if (!Array.isArray(r.players) || !Array.isArray(r.actions)) throw new Error('Game record needs players and actions');
  const players = r.players.map((p): SeatPlayer => {
    if (!isJsonObject(p) || (p.kind !== 'human' && p.kind !== 'bot')) throw new Error('Bad player in game record');
    return typeof p.level === 'number' ? { kind: p.kind, level: p.level } : { kind: p.kind };
  });
  const status = r.status;
  if (status !== 'active' && status !== 'finished') throw new Error('Bad game record status');
  // Records from 0.1.0 kept a plain resigned seat.
  const ending: Ending | null = isJsonObject(r.ending) && (r.ending.kind === 'resigned' || r.ending.kind === 'timeout') && typeof r.ending.seat === 'number'
    ? { kind: r.ending.kind, seat: r.ending.seat }
    : typeof r.resigned === 'number'
      ? { kind: 'resigned', seat: r.resigned }
      : null;
  const clock: ClockState | null =
    isJsonObject(r.clock) && typeof r.clock.initialMs === 'number' && typeof r.clock.incrementMs === 'number' && Array.isArray(r.clock.remainingMs) && r.clock.remainingMs.every((v) => typeof v === 'number')
      ? { initialMs: r.clock.initialMs, incrementMs: r.clock.incrementMs, remainingMs: r.clock.remainingMs }
      : null;
  return {
    id: str('id'),
    gameId: str('gameId'),
    rulesVersion: num('rulesVersion'),
    appVersion: str('appVersion'),
    config: r.config ?? {},
    seed: str('seed'),
    players,
    actions: r.actions,
    status,
    outcome: (r.outcome ?? null) as Outcome | null,
    ending,
    clock,
    training: r.training === true,
    createdAt: num('createdAt'),
    updatedAt: num('updatedAt'),
  };
}

/** True when a record was made by rules this build can still read. */
export function canOpen(def: AnyGameDef, record: GameRecord): boolean {
  return record.gameId === def.id && record.rulesVersion <= def.rulesVersion;
}
