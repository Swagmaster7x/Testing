/**
 * Ladder runs (PLAN.md 2.4): over fixed seeds, level N+1 must beat level N by a clear margin and
 * level 1 must beat random play. Players see only their own view, as in the app.
 */
import type { GameDef, GameEvent, Outcome, Seat } from '../core/contract';
import { findLegal, outcomePoints } from '../core/contract';
import { createRng } from '../core/rng';
import type { Rng } from '../core/rng';
import { botSeed } from './bot';

export interface Contender<V, A> {
  readonly name: string;
  choose(view: V, seat: Seat, rng: Rng): A | Promise<A>;
}

export interface MatchResult {
  readonly games: number;
  /** Average share for the first contender, 0 to 1 (a draw is 0.5). */
  readonly score: number;
  readonly wins: number;
  readonly draws: number;
  readonly losses: number;
}

const MAX_PLIES = 10_000;

export async function playGame<S, A, C, V, E extends GameEvent>(
  def: GameDef<S, A, C, V, E>,
  config: C,
  bySeat: readonly Contender<V, A>[],
  seed: string,
): Promise<Outcome> {
  let state = def.setup(config, createRng(seed));
  for (let ply = 1; ply <= MAX_PLIES; ply++) {
    const seat = def.turn(state);
    if (seat === null) break;
    const player = bySeat[seat];
    if (!player) throw new Error(`No player for seat ${seat}`);
    const chosen = await player.choose(def.view(state, seat), seat, createRng(botSeed(seed, ply)));
    const action = findLegal(def, state, seat, chosen);
    if (action === null) throw new Error(`${player.name} chose an illegal move in game ${seed}`);
    state = def.apply(state, action).state;
  }
  const outcome = def.outcome(state);
  if (!outcome) throw new Error(`Game ${seed} did not finish within ${MAX_PLIES} moves`);
  return outcome;
}

/** Two-seat match. The contenders swap seats every game. */
export async function runMatch<S, A, C, V, E extends GameEvent>(
  def: GameDef<S, A, C, V, E>,
  config: C,
  a: Contender<V, A>,
  b: Contender<V, A>,
  games: number,
  seedPrefix: string,
  paired = false,
): Promise<MatchResult> {
  let total = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  for (let i = 0; i < games; i++) {
    const aSeat: Seat = i % 2;
    const bySeat = aSeat === 0 ? [a, b] : [b, a];
    // Paired games deal the same cards twice with the seats swapped, so luck cancels out.
    const outcome = await playGame(def, config, bySeat, `${seedPrefix}:${paired ? Math.floor(i / 2) : i}`);
    const points = outcomePoints(outcome, aSeat);
    total += points;
    if (points > 0.5) wins++;
    else if (points < 0.5) losses++;
    else draws++;
  }
  return { games, score: games === 0 ? 0 : total / games, wins, draws, losses };
}

export interface LadderSpec<S, A, C, V, E extends GameEvent> {
  readonly def: GameDef<S, A, C, V, E>;
  readonly config: C;
  readonly levels: readonly number[];
  bot(level: number): Contender<V, A>;
  /** A rung passes when the stronger side scores at least this share (a draw counts half). */
  readonly margin: number;
  /** Card and tile games: play each deal twice with the seats swapped. */
  readonly paired?: boolean;
}

export interface LadderRung {
  readonly higher: string;
  readonly lower: string;
  readonly result: MatchResult;
  readonly passed: boolean;
}

/** Random play against level 1, then each level against the next. */
export async function runLadder<S, A, C, V, E extends GameEvent>(
  spec: LadderSpec<S, A, C, V, E>,
  games: number,
  seedPrefix: string,
  random: Contender<V, A>,
  onRung?: (rung: LadderRung) => void,
): Promise<LadderRung[]> {
  const rungs: LadderRung[] = [];
  let lower: Contender<V, A> = random;
  for (const level of spec.levels) {
    const higher = spec.bot(level);
    const result = await runMatch(spec.def, spec.config, higher, lower, games, `${seedPrefix}:${higher.name}-${lower.name}`, spec.paired ?? false);
    const rung = { higher: higher.name, lower: lower.name, result, passed: result.score >= spec.margin };
    rungs.push(rung);
    onRung?.(rung);
    lower = higher;
  }
  return rungs;
}
