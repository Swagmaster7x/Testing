/**
 * Contract checks that every game must pass over random games (PLAN.md 2.10): nothing crashes,
 * every legal action applies, the game ends, the codecs round-trip, a record replays to the
 * identical final state, and views never leak what a seat may not see.
 */
import type { GameDef, GameEvent, Seat } from '../../src/core/contract';
import { findLegal } from '../../src/core/contract';
import type { Json } from '../../src/core/json';
import { stableStringify } from '../../src/core/json';
import type { GameRecord } from '../../src/core/record';
import { newRecord, withAction } from '../../src/core/record';
import { replay } from '../../src/core/replay';
import { createRng } from '../../src/core/rng';

export interface ContractOptions<S> {
  /** Things a seat must not see in its view, written as they would appear in JSON. */
  readonly hidden?: (state: S, seat: Seat) => readonly string[];
  /** Game-specific invariants, such as piece conservation. Throw to fail. */
  readonly invariant?: (state: S) => void;
  readonly maxPlies?: number;
  /** The part of a view to search for leaks, leaving out history already shown to everyone (hands shown at the end of a deal). */
  readonly leakScope?: (view: unknown) => unknown;
}

export interface RandomGame<S, A> {
  readonly record: GameRecord;
  readonly final: S;
  readonly actions: readonly A[];
  readonly states: readonly S[];
}

/** Plays a random legal game from a seed, checking the contract at every step. */
export function playRandomGame<S, A, C, V, E extends GameEvent>(
  def: GameDef<S, A, C, V, E>,
  config: C,
  seed: string,
  options: ContractOptions<S> = {},
): RandomGame<S, A> {
  const rng = createRng(`${seed}/moves`);
  let state = def.setup(config, createRng(seed));
  let record = newRecord(def, { id: `random-${seed}`, config, seed, players: def.seats(state).map(() => ({ kind: 'human' as const })), appVersion: 'test', training: false, now: 0 });
  const actions: A[] = [];
  const states: S[] = [state];
  const maxPlies = options.maxPlies ?? 10_000;

  for (let ply = 0; ; ply++) {
    if (ply > maxPlies) throw new Error(`${def.id}: no end after ${maxPlies} moves (seed ${seed})`);
    checkState(def, state, options);
    const seat = def.turn(state);
    const outcome = def.outcome(state);
    if (seat === null) {
      if (!outcome) throw new Error(`${def.id}: no seat to move but no outcome`);
      break;
    }
    if (outcome) throw new Error(`${def.id}: an outcome while a seat is still to move`);
    for (const other of def.seats(state)) {
      if (other !== seat && def.legal(state, other).length > 0) throw new Error(`${def.id}: seat ${other} has moves out of turn`);
    }
    const legal = def.legal(state, seat);
    if (legal.length === 0) throw new Error(`${def.id}: the seat to move has no legal action`);
    const action = rng.pick(legal);
    const roundTrip = def.codec.action.fromJSON(def.codec.action.toJSON(action));
    if (findLegal(def, state, seat, roundTrip) === null) throw new Error(`${def.id}: an action changed through its JSON codec`);
    const text = def.codec.action.toText(action);
    if (findLegal(def, state, seat, def.codec.action.fromText(text, state)) === null) throw new Error(`${def.id}: notation "${text}" did not read back`);
    const before = stableStringify(def.codec.state.toJSON(state));
    const result = def.apply(state, action);
    if (stableStringify(def.codec.state.toJSON(state)) !== before) throw new Error(`${def.id}: apply changed the state it was given`);
    if (!Array.isArray(result.events)) throw new Error(`${def.id}: apply must return events`);
    state = result.state;
    actions.push(action);
    states.push(state);
    record = withAction(record, def.codec.action.toJSON(action), ply + 1);
  }
  return { record, final: state, actions, states };
}

function checkState<S, A, C, V, E extends GameEvent>(def: GameDef<S, A, C, V, E>, state: S, options: ContractOptions<S>): void {
  options.invariant?.(state);
  const json = def.codec.state.toJSON(state);
  const back = def.codec.state.fromJSON(JSON.parse(JSON.stringify(json)) as Json);
  if (stableStringify(def.codec.state.toJSON(back)) !== stableStringify(json)) throw new Error(`${def.id}: state JSON did not round-trip`);
  // Notation may leave out history (FEN has no repetition record), so it must read back to the
  // same notation; JSON above must read back exactly.
  const text = def.codec.state.toText(state);
  if (def.codec.state.toText(def.codec.state.fromText(text)) !== text) throw new Error(`${def.id}: state notation "${text}" did not round-trip`);
  for (const seat of def.seats(state)) {
    const view = def.view(state, seat);
    // Views cross to the worker by structured clone and must survive JSON.
    const serialised = JSON.stringify(view);
    if (serialised === undefined) throw new Error(`${def.id}: a view must be plain data`);
    const scope = options.leakScope ? JSON.stringify(options.leakScope(JSON.parse(serialised))) : serialised;
    for (const secret of options.hidden?.(state, seat) ?? []) {
      if (scope.includes(secret)) throw new Error(`${def.id}: seat ${seat}'s view leaks ${secret}`);
    }
  }
}

/** The record of a random game replays to the identical final state. */
export function checkReplay<S, A, C, V, E extends GameEvent>(def: GameDef<S, A, C, V, E>, game: RandomGame<S, A>): void {
  const replayed = replay(def, game.record).state;
  const a = stableStringify(def.codec.state.toJSON(replayed));
  const b = stableStringify(def.codec.state.toJSON(game.final));
  if (a !== b) throw new Error(`${def.id}: replay ended in a different state`);
}
