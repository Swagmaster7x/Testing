/**
 * Problems (PLAN.md 2.6): a position, the opponent's move that sets it up, and a solution line.
 * The student plays every other move of the line; the opponent's replies play themselves. Like
 * the lesson runner this is a pure state machine over the game's LessonGame adapter.
 */
import type { LessonGame } from './runner';

export interface Problem {
  readonly id: string;
  /** The position before the setup move, in the game's notation. */
  readonly position: string;
  /** The opponent's move that leads into the problem, or null when the student moves first. */
  readonly setup: string | null;
  /** The solution: student, reply, student, ... in the game's move notation. */
  readonly line: readonly string[];
  /** Other first moves that also count as right (for positions saved from your own games). */
  readonly alsoFirst?: readonly string[];
  /** Difficulty on the rating scale. */
  readonly rating: number;
  readonly themes: readonly string[];
  /** Card games: show the other hand face up (in endgames it can be worked out anyway). */
  readonly openHand?: boolean;
}

export type ProblemPhase = 'setup' | 'solving' | 'reply' | 'solved' | 'failed' | 'shown';

export interface ProblemRun {
  readonly problem: Problem;
  readonly position: string;
  /** Index in the line of the next move to be played. */
  readonly index: number;
  readonly phase: ProblemPhase;
  readonly lastMove: string | null;
  /** The wrong move, once the student has played one. */
  readonly wrong: string | null;
  /** Hints taken: 1 marks the piece, 2 names the idea, 3 shows the move. */
  readonly hints: number;
  /** True once the student has failed, retried or taken a hint: the attempt no longer counts. */
  readonly spoiled: boolean;
}

export function startProblem(problem: Problem): ProblemRun {
  return { problem, position: problem.position, index: 0, phase: problem.setup ? 'setup' : 'solving', lastMove: null, wrong: null, hints: 0, spoiled: false };
}

/** The side the student plays: the side to move after the setup move. */
export function solverPosition<S>(game: LessonGame<S>, problem: Problem): string {
  if (!problem.setup) return problem.position;
  const after = game.play(game.position(problem.position), problem.setup);
  if (!after) throw new Error(`Problem ${problem.id}: the setup move is not legal`);
  return game.notation(after);
}

function apply<S>(game: LessonGame<S>, run: ProblemRun, move: string): { position: string; lastMove: string } {
  const before = game.position(run.position);
  const after = game.play(before, move);
  const canonical = game.canonical(before, move);
  if (!after || !canonical) throw new Error(`Problem ${run.problem.id}: ${move} is not legal`);
  return { position: game.notation(after), lastMove: canonical };
}

/** Plays the opponent's setup move. */
export function playSetup<S>(game: LessonGame<S>, run: ProblemRun): ProblemRun {
  if (run.phase !== 'setup' || !run.problem.setup) return run;
  return { ...run, ...apply(game, run, run.problem.setup), phase: 'solving' };
}

/** True when `move` counts as the line's move at the current index. */
export function isRight<S>(game: LessonGame<S>, run: ProblemRun, move: string): boolean {
  const state = game.position(run.position);
  const played = game.canonical(state, move);
  if (!played) return false;
  const expected = run.problem.line[run.index];
  if (expected !== undefined && game.canonical(state, expected) === played) return true;
  if (run.index === 0 && (run.problem.alsoFirst ?? []).some((m) => game.canonical(state, m) === played)) return true;
  // The last move of a mating line: any move that mates is right.
  if (run.index === run.problem.line.length - 1) {
    const after = game.play(state, move);
    if (after && game.goalMet('mate', state, after, move)) return true;
  }
  return false;
}

/** The student's move. Illegal moves are ignored. */
export function submitProblemMove<S>(game: LessonGame<S>, run: ProblemRun, move: string): ProblemRun {
  if (run.phase !== 'solving') return run;
  const state = game.position(run.position);
  if (!game.canonical(state, move)) return run;
  if (!isRight(game, run, move)) return { ...run, ...apply(game, run, move), phase: 'failed', wrong: game.canonical(state, move), spoiled: true };
  const moved = apply(game, run, move);
  const index = run.index + 1;
  if (index >= run.problem.line.length) return { ...run, ...moved, index, phase: 'solved' };
  // Usually the other side answers; in card games the student may also lead the next trick.
  const next = game.toMove(game.position(moved.position));
  return { ...run, ...moved, index, phase: next === solverSeat(game, run.problem) ? 'solving' : 'reply' };
}

/** The seat the student plays: the side to move once the setup move is played. */
export function solverSeat<S>(game: LessonGame<S>, problem: Problem): number | null {
  return game.toMove(game.position(solverPosition(game, problem)));
}

/** The opponent's reply from the line. In card games it may move twice running (it wins, then leads). */
export function playProblemReply<S>(game: LessonGame<S>, run: ProblemRun): ProblemRun {
  if (run.phase !== 'reply' && run.phase !== 'shown') return run;
  const move = run.problem.line[run.index];
  if (move === undefined) return run;
  const index = run.index + 1;
  const moved = apply(game, run, move);
  if (run.phase === 'shown') return { ...run, ...moved, index };
  if (index >= run.problem.line.length) return { ...run, ...moved, index, phase: 'solved' };
  const next = game.toMove(game.position(moved.position));
  return { ...run, ...moved, index, phase: next === solverSeat(game, run.problem) ? 'solving' : 'reply' };
}

/** Starts again from the problem's position (after the setup move); the try no longer counts. */
export function retryProblem<S>(game: LessonGame<S>, run: ProblemRun): ProblemRun {
  return { ...run, position: solverPosition(game, run.problem), index: 0, phase: 'solving', lastMove: run.problem.setup ? (game.canonical(game.position(run.problem.position), run.problem.setup) ?? null) : null, wrong: null, spoiled: true };
}

/** Shows the solution from the start: the screen then steps through it with playProblemReply. */
export function showSolution<S>(game: LessonGame<S>, run: ProblemRun): ProblemRun {
  const position = solverPosition(game, run.problem);
  return { ...run, position, index: 0, phase: 'shown', lastMove: null, spoiled: true };
}

export function takeHint(run: ProblemRun): ProblemRun {
  return { ...run, hints: Math.min(3, run.hints + 1), spoiled: true };
}

/** The move the student is looking for now, for hints. */
export function expectedMove(run: ProblemRun): string | null {
  return run.problem.line[run.index] ?? null;
}

/**
 * Chooses the next problem near a rating: unseen ones first, then the least recently tried,
 * within a widening window. `random` is a number in [0, 1).
 */
export function pickProblem(problems: readonly Problem[], rating: number, tried: ReadonlyMap<string, number>, random: number, exclude?: string): Problem | null {
  for (const window of [100, 200, 350, 600, Infinity]) {
    const near = problems.filter((p) => Math.abs(p.rating - rating) <= window && p.id !== exclude);
    const fresh = near.filter((p) => !tried.has(p.id));
    const pool = fresh.length > 0 ? fresh : window === Infinity ? [...near].sort((a, b) => (tried.get(a.id) ?? 0) - (tried.get(b.id) ?? 0)).slice(0, 20) : [];
    if (pool.length > 0) return pool[Math.floor(random * pool.length)] ?? pool[0] ?? null;
  }
  return null;
}
