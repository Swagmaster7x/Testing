/**
 * The lesson runner as a pure state machine: the screen and the linter's auto-player drive the
 * same code, so a lesson that lints is a lesson that can be finished.
 */
import type { AskMoveStep, FreePlayGoal, Lesson, LessonStep, QuizStep } from './lesson';
import { fillText } from './lesson';

/** What the runner needs from a game. Positions and moves are in the game's own notation. */
export interface LessonGame<S> {
  position(notation: string): S;
  notation(state: S): string;
  /** Plays a move written in notation; null if it is not legal here. */
  play(state: S, move: string): S | null;
  /** The move written in the game's canonical move form (from-to for chess), or null if illegal. */
  canonical(state: S, move: string): string | null;
  /** True when a free-play goal has been reached by `move`, which led from `before` to `after`. */
  goalMet(goal: FreePlayGoal, before: S, after: S, move: string): boolean;
  /** True when the game is over in this position (the student can no longer move). */
  over(state: S): boolean;
  /** Every legal move here, in canonical form. */
  moves(state: S): string[];
  /** The seat to move, or null when the game is over. */
  toMove(state: S): number | null;
  /** Values for {placeholders} in lesson text, computed from the rules module for a position. */
  computed(state: S): Readonly<Record<string, number | string>>;
}

export type Computed = Readonly<Record<string, number | string>>;

/** The computed values for the runner's current position. */
export function valuesAt<S>(game: LessonGame<S>, s: RunnerState): Computed {
  return game.computed(game.position(s.position));
}

export type Phase = 'ready' | 'correct' | 'wrong' | 'revealed' | 'failed' | 'done';

export interface RunnerState {
  readonly lesson: Lesson;
  readonly step: number;
  /** The current position, in notation. */
  readonly position: string;
  readonly phase: Phase;
  readonly attempts: number;
  /** How many of a `show` step's moves have been played. */
  readonly shown: number;
  /** For checkpoints: which question, and how many were right first time. */
  readonly question: number;
  readonly right: number;
  /** For free play: the student's moves so far, and the position it started from. */
  readonly freeMoves: number;
  readonly feedback: string | null;
  /** The last move made, in canonical form, for highlighting. */
  readonly lastMove: string | null;
  /** The other side's scripted answer, waiting to be played (the screen plays it after a pause). */
  readonly pendingReply: string | null;
  /** Mistakes over the whole lesson (wrong first answers). */
  readonly mistakes: number;
  /** In a checkpoint: whether the last answer was right (null before the first). */
  readonly lastRight: boolean | null;
}

export function startLesson(lesson: Lesson): RunnerState {
  const first = lesson.steps[0];
  return {
    lesson,
    step: 0,
    position: first?.position ?? lesson.start,
    phase: 'ready',
    attempts: 0,
    shown: 0,
    question: 0,
    right: 0,
    freeMoves: 0,
    feedback: null,
    lastMove: null,
    pendingReply: null,
    mistakes: 0,
    lastRight: null,
  };
}

export function currentStep(s: RunnerState): LessonStep | null {
  return s.lesson.steps[s.step] ?? null;
}

/** The question in play: the step itself, or the current question of a checkpoint. */
export function currentQuestion(s: RunnerState): QuizStep | LessonStep | null {
  const step = currentStep(s);
  if (step?.kind === 'checkpoint') return step.questions[s.question] ?? null;
  return step;
}

/** True when the student may press Next. */
export function canAdvance(s: RunnerState): boolean {
  const step = currentStep(s);
  if (!step || s.phase === 'done') return false;
  switch (step.kind) {
    case 'say':
      return true;
    case 'show':
      return s.shown >= step.moves.length;
    case 'checkpoint':
      return s.question >= step.questions.length;
    default:
      return s.phase === 'correct' || s.phase === 'revealed';
  }
}

function enterStep<S>(game: LessonGame<S>, s: RunnerState, index: number): RunnerState {
  const step = s.lesson.steps[index];
  if (!step) return { ...s, phase: 'done', feedback: null };
  const position = step.kind === 'checkpoint' ? (step.questions[0]?.position ?? step.position ?? s.position) : (step.position ?? s.position);
  game.position(position);
  return { ...s, step: index, position, phase: 'ready', attempts: 0, shown: 0, question: 0, right: 0, freeMoves: 0, feedback: null, lastMove: null, pendingReply: null, lastRight: null };
}

/** Plays the scripted reply that follows a correct (or revealed) move, if there is one. */
export function playReply<S>(game: LessonGame<S>, s: RunnerState): RunnerState {
  if (!s.pendingReply) return s;
  const before = game.position(s.position);
  const after = game.play(before, s.pendingReply);
  if (!after) throw new Error(`Lesson ${s.lesson.id}: reply ${s.pendingReply} is not legal`);
  return { ...s, position: game.notation(after), lastMove: game.canonical(before, s.pendingReply), pendingReply: null };
}

/** Goes on to the next step (or the next part of a `show`). */
export function next<S>(game: LessonGame<S>, s: RunnerState): RunnerState {
  if (s.pendingReply) s = playReply(game, s);
  const step = currentStep(s);
  if (!step || s.phase === 'done') return s;
  if (step.kind === 'show' && s.shown < step.moves.length) {
    const move = step.moves[s.shown] as string;
    const after = game.play(game.position(s.position), move);
    if (!after) throw new Error(`Lesson ${s.lesson.id}: show move ${move} is not legal`);
    return { ...s, position: game.notation(after), shown: s.shown + 1, lastMove: game.canonical(game.position(s.position), move) };
  }
  if (!canAdvance(s)) return s;
  return enterStep(game, s, s.step + 1);
}

function judgeMove<S>(game: LessonGame<S>, s: RunnerState, q: AskMoveStep, move: string): { ok: boolean; feedback: string; after: S | null; canonicalMove: string | null } {
  const state = game.position(s.position);
  const canonicalMove = game.canonical(state, move);
  if (!canonicalMove) return { ok: false, feedback: 'illegal', after: null, canonicalMove: null };
  const ok = q.accept.some((a) => game.canonical(state, a) === canonicalMove);
  const after = game.play(state, move);
  const specific = Object.entries(q.wrong ?? {}).find(([m]) => game.canonical(state, m) === canonicalMove)?.[1];
  return { ok, feedback: ok ? q.success : (specific ?? 'try-again'), after, canonicalMove };
}

/** Moves for askMove, checkpoint askMove questions and free play. */
export function submitMove<S>(game: LessonGame<S>, s: RunnerState, move: string, computed: Computed = valuesAt(game, s)): RunnerState {
  const step = currentStep(s);
  if (!step || s.phase === 'correct' || s.phase === 'revealed' || s.phase === 'done') return s;
  if (step.kind === 'freePlay') return freeMove(game, s, step.goal, move, computed, step.success);
  const q = currentQuestion(s);
  if (!q || q.kind !== 'askMove') return s;
  const verdict = judgeMove(game, s, q, move);
  if (verdict.feedback === 'illegal') return s;
  if (step.kind === 'checkpoint') return answerQuestion(game, s, step.questions.length, verdict.ok, verdict.ok ? fillText(q.success, computed) : fillText(verdict.feedback, computed));
  if (verdict.ok) {
    const position = verdict.after ? game.notation(verdict.after) : s.position;
    return { ...s, phase: 'correct', position, lastMove: verdict.canonicalMove, pendingReply: q.reply ?? null, feedback: fillText(q.success, computed) };
  }
  return { ...s, phase: 'wrong', attempts: s.attempts + 1, feedback: fillText(verdict.feedback, computed), mistakes: s.attempts === 0 ? s.mistakes + 1 : s.mistakes };
}

function freeMove<S>(game: LessonGame<S>, s: RunnerState, goal: FreePlayGoal, move: string, computed: Computed, success: string): RunnerState {
  const before = game.position(s.position);
  const after = game.play(before, move);
  if (!after) return s;
  const moves = s.freeMoves + 1;
  const canonicalMove = game.canonical(before, move);
  if (game.goalMet(goal, before, after, move)) return { ...s, phase: 'correct', position: game.notation(after), freeMoves: moves, lastMove: canonicalMove, feedback: fillText(success, computed) };
  // Out of moves only counts once the other side has answered (its reply can still end the game).
  if (game.over(after)) return { ...s, phase: 'failed', position: game.notation(after), freeMoves: moves, lastMove: canonicalMove, feedback: 'out-of-moves', mistakes: s.mistakes + 1 };
  return { ...s, position: game.notation(after), freeMoves: moves, lastMove: canonicalMove, feedback: null };
}

/**
 * The other side's answer during free play (from the engine). The goal is checked again, from the
 * student's side: in card games the last trick is often finished by the other player's card.
 */
export function opponentMove<S>(game: LessonGame<S>, s: RunnerState, move: string, computed: Computed = valuesAt(game, s)): RunnerState {
  const before = game.position(s.position);
  const after = game.play(before, move);
  if (!after) throw new Error(`Opponent move ${move} is not legal`);
  const base = { ...s, position: game.notation(after), lastMove: game.canonical(before, move) };
  const step = currentStep(s);
  if (step?.kind !== 'freePlay' || s.phase === 'correct') return base;
  if (game.goalMet(step.goal, game.position(step.position), after, move)) return { ...base, phase: 'correct', feedback: fillText(step.success, computed) };
  // With several other players, out of moves only counts once it is the student's turn again.
  const studentAgain = game.toMove(after) === game.toMove(game.position(step.position));
  if (game.over(after) || (s.freeMoves >= step.maxMoves && studentAgain)) return { ...base, phase: 'failed', feedback: 'out-of-moves', mistakes: s.mistakes + 1 };
  return base;
}

/** Starts a free-play or other step over from its own position. */
export function retry<S>(game: LessonGame<S>, s: RunnerState): RunnerState {
  return enterStep(game, s, s.step);
}

export function chooseOption<S>(game: LessonGame<S>, s: RunnerState, index: number, computed: Computed = valuesAt(game, s)): RunnerState {
  const step = currentStep(s);
  const q = currentQuestion(s);
  if (!step || !q || q.kind !== 'askChoice' || s.phase === 'correct' || s.phase === 'revealed') return s;
  const option = (q).options[index];
  if (!option) return s;
  const why = option.why ? fillText(option.why, computed) : null;
  if (step.kind === 'checkpoint') return answerQuestion(game, s, step.questions.length, option.correct === true, why ?? (option.correct ? 'right' : 'try-again'));
  if (option.correct) return { ...s, phase: 'correct', feedback: why ?? 'right' };
  return { ...s, phase: 'wrong', attempts: s.attempts + 1, feedback: why ?? 'try-again', mistakes: s.attempts === 0 ? s.mistakes + 1 : s.mistakes };
}

export function submitNumber<S>(game: LessonGame<S>, s: RunnerState, value: number, computed: Computed = valuesAt(game, s)): RunnerState {
  const step = currentStep(s);
  const q = currentQuestion(s);
  if (!step || !q || q.kind !== 'askNumber' || s.phase === 'correct' || s.phase === 'revealed') return s;
  const expected = Number(computed[(q).answer]);
  const ok = Number.isFinite(expected) && value === expected;
  if (step.kind === 'checkpoint') return answerQuestion(game, s, step.questions.length, ok, ok ? fillText((q).success, computed) : 'try-again');
  if (ok) return { ...s, phase: 'correct', feedback: fillText((q).success, computed) };
  return { ...s, phase: 'wrong', attempts: s.attempts + 1, feedback: 'try-again', mistakes: s.attempts === 0 ? s.mistakes + 1 : s.mistakes };
}

/** In a checkpoint each question gets one try; the checkpoint shows how many were right. */
function answerQuestion<S>(game: LessonGame<S>, s: RunnerState, count: number, ok: boolean, feedback: string): RunnerState {
  const step = currentStep(s);
  const nextQuestion = s.question + 1;
  const position =
    step?.kind === 'checkpoint' && nextQuestion < count ? (step.questions[nextQuestion]?.position ?? s.position) : s.position;
  game.position(position);
  return { ...s, question: nextQuestion, right: s.right + (ok ? 1 : 0), position, feedback, lastRight: ok, lastMove: null, phase: nextQuestion >= count ? 'correct' : 'ready', mistakes: ok ? s.mistakes : s.mistakes + 1 };
}

/** Shows the answer after the student has tried (the first accepted move or the right option). */
export function reveal<S>(game: LessonGame<S>, s: RunnerState): RunnerState {
  const step = currentStep(s);
  if (!step || step.kind === 'checkpoint' || step.kind === 'freePlay') return s;
  if (step.kind === 'askMove') {
    const answer = step.accept[0] as string;
    const after = game.play(game.position(s.position), answer);
    return { ...s, phase: 'revealed', position: after ? game.notation(after) : s.position, lastMove: game.canonical(game.position(s.position), answer), pendingReply: step.reply ?? null, feedback: 'revealed' };
  }
  return { ...s, phase: 'revealed', feedback: 'revealed' };
}

/** The answer a perfect student gives at this point, for the linter's auto-player. */
export function correctAnswer<S>(game: LessonGame<S>, s: RunnerState): { kind: 'move'; move: string } | { kind: 'choice'; index: number } | { kind: 'number'; value: number } | null {
  const q = currentQuestion(s);
  if (!q) return null;
  if (q.kind === 'askMove') return { kind: 'move', move: q.accept[0] as string };
  if (q.kind === 'askChoice') return { kind: 'choice', index: q.options.findIndex((o) => o.correct) };
  if (q.kind === 'askNumber') return { kind: 'number', value: Number(valuesAt(game, s)[q.answer]) };
  return null;
}
