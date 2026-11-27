/**
 * Lessons are data that run on the real game (PLAN.md 2.5). A lesson is a list of steps:
 * `say`, `show` (scripted moves), `askMove`, `askChoice`, `askNumber`, `freePlay` (reach a goal
 * against the engine) and `checkpoint` (a short quiz). Positions are written in the game's own
 * notation (FEN for chess) and carry over from step to step unless a step sets a new one.
 *
 * Numbers in lesson text are never typed: they are written as {placeholders} that the game's
 * rules module computes (piece values, counts, limits), so a lesson cannot disagree with the game.
 * The lesson linter enforces this.
 */

export type StageId = 'stage-0' | 'stage-1' | 'stage-2' | 'stage-3' | 'stage-4' | 'table';

export const STAGES: readonly StageId[] = ['stage-0', 'stage-1', 'stage-2', 'stage-3', 'stage-4', 'table'];

export interface Arrow {
  readonly from: string;
  readonly to: string;
}

interface StepBase {
  /** Text shown with the step. Use {name} placeholders for numbers. */
  readonly text: string;
  /** A new position for this step, in the game's notation. Otherwise the last one carries over. */
  readonly position?: string;
  readonly arrows?: readonly Arrow[];
  readonly marks?: readonly string[];
  /** Card and tile games: show the other hands face up during this step. */
  readonly openHand?: boolean;
  /** Card games: show the tricks already won face up (for counting drills). */
  readonly openPiles?: boolean;
}

export interface SayStep extends StepBase {
  readonly kind: 'say';
}

export interface ShowStep extends StepBase {
  readonly kind: 'show';
  /** Moves played one at a time, in the game's move notation. */
  readonly moves: readonly string[];
}

export interface AskMoveStep extends StepBase {
  readonly kind: 'askMove';
  /** Moves that pass. The first is the one shown when the student asks for the answer. */
  readonly accept: readonly string[];
  /** Feedback for tempting wrong answers, by move. */
  readonly wrong?: Readonly<Record<string, string>>;
  readonly success: string;
  /**
   * What the lesson claims about the accepted moves; the linter checks it with the engine:
   * "best" (clearly better than any other move), "mate" (gives checkmate), "only" (the accepted
   * moves are exactly the legal moves), or "legal" (only that each is legal and has the property
   * the text describes; no engine claim).
   */
  readonly claim: 'best' | 'mate' | 'only' | 'legal';
  /** The other side's answer, played after a correct move. */
  readonly reply?: string;
}

export interface ChoiceOption {
  readonly text: string;
  readonly correct?: boolean;
  /** Shown after this option is picked. */
  readonly why?: string;
}

export interface AskChoiceStep extends StepBase {
  readonly kind: 'askChoice';
  readonly options: readonly ChoiceOption[];
}

export interface AskNumberStep extends StepBase {
  readonly kind: 'askNumber';
  /** The name of a computed value (see GameTeach.computed); never a typed number. */
  readonly answer: string;
  readonly success: string;
}

export type FreePlayGoal = 'mate' | 'promote' | 'win-material' | 'win';

export interface FreePlayStep extends StepBase {
  readonly kind: 'freePlay';
  readonly position: string;
  readonly goal: FreePlayGoal;
  /** The goal must be reached within this many of the student's moves (a computed name or a count). */
  readonly maxMoves: number;
  readonly success: string;
}

export type QuizStep = AskMoveStep | AskChoiceStep | AskNumberStep;

export interface CheckpointStep extends StepBase {
  readonly kind: 'checkpoint';
  readonly questions: readonly QuizStep[];
}

export type LessonStep = SayStep | ShowStep | AskMoveStep | AskChoiceStep | AskNumberStep | FreePlayStep | CheckpointStep;

export interface Lesson {
  readonly id: string;
  readonly gameId: string;
  readonly stage: StageId;
  readonly title: string;
  /** About how long it takes. Lessons are short: two to four minutes. */
  readonly minutes: number;
  /** The position the lesson starts in. */
  readonly start: string;
  readonly steps: readonly LessonStep[];
}

/** Fills {placeholders} with computed values. Unknown names are left as they are, for the linter to catch. */
export function fillText(text: string, computed: Readonly<Record<string, number | string>>): string {
  return text.replace(/\{([\w:.-]+)\}/g, (whole, name: string) => (name in computed ? String(computed[name]) : whole));
}

/**
 * Digits in lesson text are only allowed inside notation (squares like e4, moves like Nf3 or
 * O-O-O) and {placeholders}. Returns the offending fragments, if any.
 */
export function typedNumbers(text: string): string[] {
  const stripped = text
    .replace(/\{[\w:.-]+\}/g, ' ')
    .replace(/\bO-O(-O)?\b/g, ' ')
    .replace(/\b[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](=[QRBN])?[+#]?/g, ' ')
    .replace(/\b[a-h][1-8]\b/g, ' ');
  return stripped.match(/\d+/g) ?? [];
}
