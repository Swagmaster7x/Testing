/**
 * Replay: a record replays to the identical final state. Every action is decoded with the game's
 * codec and checked against `legal` before it is applied, so a damaged record fails loudly.
 */
import type { GameDef, GameEvent, Seat } from './contract';
import { findLegal } from './contract';
import type { GameRecord } from './record';
import { createRng } from './rng';

export class ReplayError extends Error {
  constructor(
    message: string,
    readonly ply: number,
  ) {
    super(message);
    this.name = 'ReplayError';
  }
}

export interface ReplayStep<S, A, E> {
  /** 1 for the first action. */
  readonly ply: number;
  readonly seat: Seat;
  readonly action: A;
  readonly before: S;
  readonly state: S;
  readonly events: E[];
}

export function startState<S, A, C, V, E extends GameEvent>(def: GameDef<S, A, C, V, E>, record: GameRecord): S {
  if (record.gameId !== def.id) throw new ReplayError(`Record is for ${record.gameId}, not ${def.id}`, 0);
  if (record.rulesVersion > def.rulesVersion) {
    throw new ReplayError(`Record uses rules version ${record.rulesVersion}; this build knows ${def.rulesVersion}`, 0);
  }
  return def.setup(def.codec.config.fromJSON(record.config), createRng(record.seed));
}

/** Replays the first `upto` actions (all of them by default). */
export function replay<S, A, C, V, E extends GameEvent>(
  def: GameDef<S, A, C, V, E>,
  record: GameRecord,
  upto: number = record.actions.length,
): { state: S; steps: ReplayStep<S, A, E>[] } {
  let state = startState(def, record);
  const steps: ReplayStep<S, A, E>[] = [];
  const count = Math.max(0, Math.min(upto, record.actions.length));
  for (let i = 0; i < count; i++) {
    const ply = i + 1;
    const seat = def.turn(state);
    if (seat === null) throw new ReplayError('The record has moves after the game ended', ply);
    let decoded: A;
    try {
      decoded = def.codec.action.fromJSON(record.actions[i] ?? null);
    } catch (err) {
      throw new ReplayError(`Move ${ply} cannot be read: ${(err as Error).message}`, ply);
    }
    const action = findLegal(def, state, seat, decoded);
    if (action === null) throw new ReplayError(`Move ${ply} is not legal`, ply);
    const before = state;
    const result = def.apply(state, action);
    state = result.state;
    steps.push({ ply, seat, action, before, state, events: result.events });
  }
  return { state, steps };
}
