/** A player that picks any legal action. It is the floor every level-1 bot must beat. */
import type { GameDef, GameEvent, Seat } from '../core/contract';
import type { Rng } from '../core/rng';

export function randomChoice<S, A, C, V, E extends GameEvent>(
  def: GameDef<S, A, C, V, E>,
  view: V,
  seat: Seat,
  rng: Rng,
): A {
  if (!def.sample) throw new Error(`${def.id} has no sample(), so a random player cannot see its legal moves`);
  return rng.pick(def.legal(def.sample(view, seat, rng.fork('sample')), seat));
}
