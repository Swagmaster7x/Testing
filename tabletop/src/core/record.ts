/**
 * Game records. A record is config + seed + actions, plus who sat where and the rules version.
 * Replays, save and resume, bug reports, lesson positions and tests all use this one form.
 */
import type { AnyGameDef, GameDef, GameEvent, Outcome, Seat } from './contract';
import { resignationOutcome } from './contract';
import type { Json } from './json';
import { isJsonObject } from './json';

export type PlayerKind = 'human' | 'bot';

export interface SeatPlayer {
  readonly kind: PlayerKind;
  /** CPU level, for bots. */
  readonly level?: number;
}

export type RecordStatus = 'active' | 'finished';

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
  /** Set when a seat resigned rather than playing to the end. */
  readonly resigned: Seat | null;
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
    resigned: null,
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
  return { ...record, status: 'finished', resigned: seat, outcome: resignationOutcome(seats, seat), updatedAt: now };
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
    resigned: typeof r.resigned === 'number' ? r.resigned : null,
    training: r.training === true,
    createdAt: num('createdAt'),
    updatedAt: num('updatedAt'),
  };
}

/** True when a record was made by rules this build can still read. */
export function canOpen(def: AnyGameDef, record: GameRecord): boolean {
  return record.gameId === def.id && record.rulesVersion <= def.rulesVersion;
}
