/** Starting a new game: a fresh seed, the chosen seat and CPU level, saved before play begins. */
import { createRng, randomSeed } from '../../core/rng';
import type { SeatPlayer } from '../../core/record';
import { newRecord, withAction } from '../../core/record';
import { replay } from '../../core/replay';
import type { AnyGameUi } from '../../games/types';
import { appDb } from '../../store/db';
import { newId } from '../../store/ids';
import { saveRecord } from '../../store/records';

export interface StartOptions {
  readonly level: number;
  readonly side: number | 'either';
  /** Fixed seeds make end-to-end runs repeatable (#/games/<id>?seed=...). */
  readonly seed?: string;
  /** A clock for the game, or none. */
  readonly clock?: { readonly initialMs: number; readonly incrementMs: number } | null;
  /** The game's options, such as a starting position (#/games/chess?fen=...). */
  readonly config?: unknown;
}

/** Opens a game file (PGN for chess) as a finished game, for review. */
export async function importGame(ui: AnyGameUi, profileId: string, text: string): Promise<string> {
  const format = ui.importRecord;
  if (!format) throw new Error('This game cannot open files');
  const read = format.read(text);
  const { def } = ui;
  const seed = randomSeed();
  const seats = def.seats(def.setup(read.config, createRng(seed)));
  let record = newRecord(def, {
    id: newId('g'),
    config: read.config,
    seed,
    players: seats.map(() => ({ kind: 'human' as const })),
    appVersion: __APP_VERSION__,
    training: true,
    now: Date.now(),
  });
  for (const action of read.actions) record = withAction(record, action, record.updatedAt);
  // Check every move before saving: a damaged file is refused here, not at review time.
  const final = replay(def, record).state;
  const outcome = def.outcome(final) ?? read.outcome;
  record = { ...record, status: 'finished', outcome };
  await saveRecord(appDb(), profileId, record);
  return record.id;
}

export async function startGame(ui: AnyGameUi, profileId: string, options: StartOptions): Promise<string> {
  const { def } = ui;
  const seed = options.seed ?? randomSeed();
  const config = options.config ?? def.defaultConfig;
  const seats = def.seats(def.setup(config, createRng(seed)));
  const human = options.side === 'either' ? (seats[createRng(seed).fork('seat').int(seats.length)] ?? 0) : options.side;
  const players: SeatPlayer[] = seats.map((seat) => (seat === human ? { kind: 'human' } : { kind: 'bot', level: options.level }));
  const record = newRecord(def, {
    id: newId('g'),
    config,
    seed,
    players,
    appVersion: __APP_VERSION__,
    training: false,
    now: Date.now(),
    clock: options.clock && options.clock.initialMs > 0 ? options.clock : null,
  });
  await saveRecord(appDb(), profileId, record);
  return record.id;
}
