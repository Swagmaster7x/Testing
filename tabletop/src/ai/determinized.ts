/**
 * The generic determinized bot (PLAN.md 2.4): for a hidden-information game, deal the cards the bot
 * cannot see with the game's own `sample`, play each candidate action out in that deal, and keep
 * the action that does best on average over many deals. It needs nothing but the game contract;
 * each game layers its heuristics on top: a rollout policy (how everyone plays in the rollouts),
 * a stopping point (the end of the hand) and a value (points, or a point difference).
 *
 * Every candidate is played in the same deals with the same rollout seed (common random numbers),
 * so the comparison between candidates is far steadier than the sample count alone suggests.
 * Strength comes from the number of deals, never from time.
 */
import type { GameDef, GameEvent, Seat } from '../core/contract';
import type { Rng } from '../core/rng';
import { createRng } from '../core/rng';

export interface DeterminizedSpec<S, A, V> {
  readonly def: GameDef<S, A, unknown, V, GameEvent>;
  /** How every seat plays in a rollout; random legal play when absent. */
  readonly policy?: (state: S, seat: Seat, rng: Rng) => A;
  /** True when a rollout should stop here (the end of the hand); it always stops when the game ends. */
  readonly stop?: (state: S, start: S) => boolean;
  /** What a stopped rollout is worth to `seat`. Higher is better. */
  readonly value: (state: S, seat: Seat, start: S) => number;
  /** A rollout never runs past this many moves (then it is valued where it stands). */
  readonly maxPlies?: number;
}

export interface Scored<A> {
  readonly action: A;
  readonly value: number;
}

/** Plays a state out with the spec's policy until it stops; returns its value for `seat`. */
export function rollout<S, A, V>(spec: DeterminizedSpec<S, A, V>, state: S, seat: Seat, start: S, rng: Rng): number {
  const { def } = spec;
  let s = state;
  const limit = spec.maxPlies ?? 1000;
  for (let ply = 0; ply < limit; ply++) {
    if (spec.stop?.(s, start)) break;
    const turn = def.turn(s);
    if (turn === null) break;
    const action = spec.policy ? spec.policy(s, turn, rng) : rng.pick(def.legal(s, turn));
    s = def.apply(s, action).state;
  }
  return spec.value(s, seat, start);
}

/**
 * Scores each candidate action over `samples` deals consistent with the view. Candidates default
 * to the legal actions in the first deal (every deal gives the same legal actions to the seat
 * that sees the view).
 */
export function determinize<S, A, V>(spec: DeterminizedSpec<S, A, V>, view: V, seat: Seat, samples: number, rng: Rng, candidates?: readonly A[]): Scored<A>[] {
  const { def } = spec;
  if (!def.sample) throw new Error(`${def.id} has no sample(), so it cannot be searched by determinization`);
  const worlds: S[] = [];
  for (let i = 0; i < Math.max(1, samples); i++) worlds.push(def.sample(view, seat, rng));
  const actions = candidates ?? def.legal(worlds[0] as S, seat);
  const totals = actions.map(() => 0);
  for (const world of worlds) {
    const seed = `${rng.int(2_147_483_647)}`;
    actions.forEach((action, j) => {
      const after = def.apply(world, action).state;
      totals[j] = (totals[j] as number) + rollout(spec, after, seat, world, createRng(seed));
    });
  }
  return actions.map((action, j) => ({ action, value: (totals[j] as number) / worlds.length }));
}

/** The best of a scored list; ties are broken at random. */
export function bestScored<A>(scored: readonly Scored<A>[], rng: Rng, tolerance = 1e-9): A {
  const top = Math.max(...scored.map((s) => s.value));
  return rng.pick(scored.filter((s) => s.value >= top - tolerance)).action;
}
