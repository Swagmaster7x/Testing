/** Starting a new game: a fresh seed, the chosen seat and CPU level, saved before play begins. */
import { createRng, randomSeed } from '../../core/rng';
import type { SeatPlayer } from '../../core/record';
import { newRecord } from '../../core/record';
import type { AnyGameUi } from '../../games/types';
import { appDb } from '../../store/db';
import { newId } from '../../store/ids';
import { saveRecord } from '../../store/records';

export interface StartOptions {
  readonly level: number;
  readonly side: number | 'either';
  /** Fixed seeds make end-to-end runs repeatable (#/games/<id>?seed=...). */
  readonly seed?: string;
}

export async function startGame(ui: AnyGameUi, profileId: string, options: StartOptions): Promise<string> {
  const { def } = ui;
  const seed = options.seed ?? randomSeed();
  const seats = def.seats(def.setup(def.defaultConfig, createRng(seed)));
  const human = options.side === 'either' ? (seats[createRng(seed).fork('seat').int(seats.length)] ?? 0) : options.side;
  const players: SeatPlayer[] = seats.map((seat) => (seat === human ? { kind: 'human' } : { kind: 'bot', level: options.level }));
  const record = newRecord(def, {
    id: newId('g'),
    config: def.defaultConfig,
    seed,
    players,
    appVersion: __APP_VERSION__,
    training: false,
    now: Date.now(),
  });
  await saveRecord(appDb(), profileId, record);
  return record.id;
}
