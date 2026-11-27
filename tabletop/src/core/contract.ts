/**
 * The game contract (PLAN.md section 2.3). Every game is a pure module with this shape. The
 * interface, bots, lessons, review, replay and tests are written against it once.
 *
 * Rules that follow from it:
 * - A game record is config + seed + actions (see record.ts).
 * - `apply` is pure and returns events; the interface animates them from a queue (events.ts)
 *   and never blocks the rules on an animation.
 * - Bots receive `view`, never `state`, and run in a worker (see ai/).
 * - States, views, actions and configs are plain data, so they can be copied to a worker and
 *   written to storage as they are.
 */
import type { Json } from './json';
import { stableStringify } from './json';
import type { Rng } from './rng';

/** A seat at the table, numbered from 0 in turn order. */
export type Seat = number;

/** Something that happened when an action was applied, for the interface to animate and log. */
export interface GameEvent {
  readonly type: string;
}

/** One seat's result. Place 1 is first; seats that tie share the better place. */
export interface SeatResult {
  readonly seat: Seat;
  readonly place: number;
  readonly score: number;
}

/** The per-seat result and score of a finished game. */
export interface Outcome {
  readonly results: readonly SeatResult[];
  /** A short code such as "line" or "board-full"; the text catalogue turns it into words. */
  readonly reason: string;
  /**
   * Seats that play as one side (partners), when the game has sides. Each side counts as one
   * player when the result is turned into a share: a partnership win is a win for both partners.
   */
  readonly teams?: readonly (readonly Seat[])[];
}

/** JSON plus human notation for one kind of value. */
export interface Codec<T> {
  toJSON(value: T): Json;
  /** Reads JSON written by toJSON. Throws on anything malformed: records come from storage and backups. */
  fromJSON(json: Json): T;
  toText(value: T): string;
  /**
   * Reads notation back. Some notation only makes sense in a position (chess's Nc3), so action
   * codecs are given the state the action is played in, when there is one.
   */
  fromText(text: string, context?: unknown): T;
}

/** JSON only, for values with no useful notation (game options). */
export interface JsonCodec<T> {
  toJSON(value: T): Json;
  fromJSON(json: Json): T;
}

export interface GameDef<State, Action, Config, View, Event extends GameEvent = GameEvent> {
  readonly id: string;
  /** Raised whenever a rules change would change a replay. Stored in every record. */
  readonly rulesVersion: number;
  readonly defaultConfig: Config;
  /** All randomness is fixed here, from the seed. */
  setup(config: Config, rng: Rng): State;
  seats(state: State): Seat[];
  /** The seat to act, or null when the game is over. */
  turn(state: State): Seat | null;
  legal(state: State, seat: Seat): Action[];
  /** Pure. Throws if the action is not legal. */
  apply(state: State, action: Action): { state: State; events: Event[] };
  outcome(state: State): Outcome | null;
  /** Only what that seat may see. */
  view(state: State, seat: Seat): View;
  /** A full state consistent with a view (for hidden-information search). */
  sample?(view: View, seat: Seat, rng: Rng): State;
  /** Partners who share a result, for games played in sides; absent when every seat plays alone. */
  teams?(state: State): Seat[][];
  readonly codec: {
    readonly state: Codec<State>;
    readonly action: Codec<Action>;
    readonly config: JsonCodec<Config>;
  };
}

/** Any game, for code that works across games (registry, replay, worker). */
// Methods are declared with method syntax above, so a concrete GameDef is assignable to this.
export type AnyGameDef = GameDef<unknown, unknown, unknown, unknown, GameEvent>;

/** Two actions are the same when their JSON is the same. */
export function sameAction<A>(def: { codec: { action: Codec<A> } }, a: A, b: A): boolean {
  return stableStringify(def.codec.action.toJSON(a)) === stableStringify(def.codec.action.toJSON(b));
}

/** The legal action equal to `action`, or null. Use it to check input from the interface or a bot. */
export function findLegal<S, A, C, V, E extends GameEvent>(
  def: GameDef<S, A, C, V, E>,
  state: S,
  seat: Seat,
  action: A,
): A | null {
  for (const candidate of def.legal(state, seat)) {
    if (sameAction(def, candidate, action)) return candidate;
  }
  return null;
}

/**
 * A seat's share of a finished game on a 0 to 1 scale, used by ladders and ratings.
 * First place is 1 and last is 0; tied seats share the average of the places they cover,
 * so a two-player draw is 0.5 each.
 */
export function outcomePoints(outcome: Outcome, seat: Seat): number {
  const mine = outcome.results.find((r) => r.seat === seat);
  if (!mine) throw new RangeError(`Seat ${seat} is not in this outcome`);
  if (outcome.teams && outcome.teams.length > 1) {
    // Each side is one entrant, placed by its best seat.
    const placeOf = (team: readonly Seat[]) => Math.min(...team.map((s) => outcome.results.find((r) => r.seat === s)?.place ?? Infinity));
    const sides = outcome.teams.map((team) => ({ team, place: placeOf(team) }));
    const own = sides.find((side) => side.team.includes(seat));
    if (own) {
      const ranked = sides.map((side) => side.place).sort((a, b) => a - b);
      const position = ranked.indexOf(own.place) + 1;
      return shareOf(ranked.length, position, ranked.filter((p) => p === own.place).length);
    }
  }
  const n = outcome.results.length;
  if (n < 2) return 1;
  const tied = outcome.results.filter((r) => r.place === mine.place).length;
  return shareOf(n, mine.place, tied);
}

/** The share of `n` entrants for one at `place` (1 is first) tied with `tied` others in all. */
function shareOf(n: number, place: number, tied: number): number {
  if (n < 2) return 1;
  let total = 0;
  for (let position = place; position < place + tied; position++) {
    total += (n - position) / (n - 1);
  }
  return total / tied;
}

/**
 * The outcome when one seat resigns: everyone else shares first place. With sides (partners), the
 * resigning seat's whole side loses.
 */
export function resignationOutcome(seats: readonly Seat[], resigned: Seat, teams?: readonly (readonly Seat[])[]): Outcome {
  const own = teams?.find((team) => team.includes(resigned));
  if (teams && own) {
    const losers = seats.filter((s) => own.includes(s));
    const winners = seats.filter((s) => !own.includes(s));
    return {
      reason: 'resigned',
      teams,
      results: [...winners.map((seat) => ({ seat, place: 1, score: 1 })), ...losers.map((seat) => ({ seat, place: winners.length + 1, score: 0 }))],
    };
  }
  const others = seats.filter((s) => s !== resigned);
  return {
    reason: 'resigned',
    results: [
      ...others.map((seat) => ({ seat, place: 1, score: 1 / others.length })),
      { seat: resigned, place: others.length + 1, score: 0 },
    ],
  };
}
