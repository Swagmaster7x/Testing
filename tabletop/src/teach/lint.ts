/**
 * The lesson linter (PLAN.md 2.5). It fails unless every position is legal, every accepted
 * answer is a legal move, an auto-player can finish the lesson (also when it first answers wrong
 * and asks to be shown), every engine claim holds, and every number in the text is computed.
 *
 * The checks that need an engine or solver come from the game, as a LessonVerifier.
 */
import type { AskMoveStep, FreePlayStep, Lesson, LessonStep, QuizStep } from './lesson';
import { fillText, STAGES, typedNumbers } from './lesson';
import type { LessonGame, RunnerState } from './runner';
import { canAdvance, chooseOption, currentQuestion, currentStep, next, opponentMove, playReply, reveal, startLesson, submitMove, submitNumber, valuesAt } from './runner';

export interface LessonVerifier<S> {
  /** Problems with a position that parsing does not catch (chess: the side not to move is in check). */
  positionProblems(state: S): string[];
  /** Checks a "best" claim: the accepted moves are clearly better than every other move. */
  checkBest(state: S, accept: readonly string[]): Promise<string[]>;
  /** A move for free play: the student's best try for the goal, or the opponent's best defence. */
  freePlayMove(state: S, role: 'student' | 'opponent', step: FreePlayStep): Promise<string>;
}

/** Lessons are short: one idea, two to four minutes (a few rules lessons are shorter). */
export const MIN_MINUTES = 1;
export const MAX_MINUTES = 4;

const ID = /^[a-z0-9-]+\.[a-z0-9-]+\.[a-z0-9-]+$/;

function texts(step: LessonStep | QuizStep): string[] {
  const out = [step.text];
  if (step.kind === 'askMove') out.push(step.success, ...Object.values(step.wrong ?? {}));
  if (step.kind === 'askNumber' || step.kind === 'freePlay') out.push(step.success);
  if (step.kind === 'askChoice') for (const o of step.options) out.push(o.text, ...(o.why ? [o.why] : []));
  return out;
}

function placeholders(text: string): string[] {
  return [...text.matchAll(/\{([\w:.-]+)\}/g)].map((m) => m[1] as string);
}

export async function lintLesson<S>(lesson: Lesson, game: LessonGame<S>, verifier: LessonVerifier<S>): Promise<string[]> {
  const problems: string[] = [];
  const at = (where: string, message: string) => problems.push(`${lesson.id} ${where}: ${message}`);

  if (!ID.test(lesson.id) || !lesson.id.startsWith(`${lesson.gameId}.`)) at('id', 'ids look like "<game>.<stage>.<name>"');
  if (!STAGES.includes(lesson.stage)) at('stage', `unknown stage ${lesson.stage}`);
  if (!lesson.title.trim()) at('title', 'missing');
  if (typedNumbers(lesson.title).length > 0) at('title', `typed number ${typedNumbers(lesson.title).join(', ')}`);
  if (lesson.minutes < MIN_MINUTES || lesson.minutes > MAX_MINUTES) at('minutes', `${lesson.minutes} is outside ${MIN_MINUTES} to ${MAX_MINUTES}`);
  if (lesson.steps.length === 0) at('steps', 'a lesson needs steps');
  if (!lesson.steps.some((s) => s.kind !== 'say' && s.kind !== 'show')) at('steps', 'a lesson needs at least one question or exercise');

  const parse = (where: string, notation: string): S | null => {
    let state: S;
    try {
      state = game.position(notation);
    } catch (err) {
      at(where, `position ${notation} does not parse: ${String(err)}`);
      return null;
    }
    for (const p of verifier.positionProblems(state)) at(where, `position ${notation}: ${p}`);
    return state;
  };

  const checkText = (where: string, step: LessonStep | QuizStep, state: S) => {
    const computed = game.computed(state);
    for (const text of texts(step)) {
      const typed = typedNumbers(text);
      if (typed.length > 0) at(where, `typed number(s) ${typed.join(', ')} in "${text}"; use a {placeholder}`);
      for (const name of placeholders(text)) if (!(name in computed)) at(where, `unknown placeholder {${name}} in "${text}"`);
      if (fillText(text, computed).includes('{')) at(where, `unfilled placeholder in "${text}"`);
    }
  };

  const checkQuestion = async (where: string, q: QuizStep, state: S): Promise<void> => {
    checkText(where, q, state);
    if (q.kind === 'askChoice') {
      if (q.options.length < 2) at(where, 'a choice needs at least two options');
      if (q.options.filter((o) => o.correct).length !== 1) at(where, 'a choice needs exactly one correct option');
      if (new Set(q.options.map((o) => o.text)).size !== q.options.length) at(where, 'two options have the same text');
      return;
    }
    if (q.kind === 'askNumber') {
      const value = game.computed(state)[q.answer];
      if (typeof value !== 'number' || !Number.isFinite(value)) at(where, `answer ${q.answer} is not a computed number here`);
      return;
    }
    await checkMove(where, q, state);
  };

  const checkMove = async (where: string, q: AskMoveStep, state: S): Promise<void> => {
    if (q.accept.length === 0) {
      at(where, 'no accepted moves');
      return;
    }
    const legal = new Set(game.moves(state));
    const accepted = q.accept.map((m) => game.canonical(state, m));
    q.accept.forEach((m, i) => {
      if (!accepted[i]) at(where, `accepted move ${m} is not legal`);
    });
    if (new Set(accepted).size !== accepted.length) at(where, 'an accepted move is listed twice');
    for (const m of Object.keys(q.wrong ?? {})) {
      const c = game.canonical(state, m);
      if (!c) at(where, `"wrong" move ${m} is not legal`);
      else if (accepted.includes(c)) at(where, `"wrong" move ${m} is also accepted`);
    }
    if (q.reply) {
      for (const m of q.accept) {
        const after = game.play(state, m);
        if (after && !game.play(after, q.reply)) at(where, `reply ${q.reply} is not legal after ${m}`);
      }
    }
    if (accepted.some((m) => !m)) return;
    switch (q.claim) {
      case 'legal':
        break;
      case 'only': {
        const set = new Set(accepted as string[]);
        if (set.size !== legal.size || [...legal].some((m) => !set.has(m))) at(where, `claim "only", but the legal moves are ${[...legal].join(' ')}`);
        break;
      }
      case 'mate':
        for (const m of q.accept) {
          const after = game.play(state, m);
          if (!after || !game.goalMet('mate', state, after, m)) at(where, `claim "mate", but ${m} is not checkmate`);
        }
        break;
      case 'best':
        for (const p of await verifier.checkBest(state, q.accept)) at(where, p);
        break;
    }
  };

  // Static checks, step by step, following the position as the lesson does.
  let position = lesson.start;
  if (!parse('start', position)) return problems;
  for (const [i, step] of lesson.steps.entries()) {
    const where = `step ${i + 1} (${step.kind})`;
    if (step.position) position = step.position;
    const state = parse(where, position);
    if (!state) return problems;
    switch (step.kind) {
      case 'say':
        checkText(where, step, state);
        break;
      case 'show': {
        checkText(where, step, state);
        let s = state;
        for (const m of step.moves) {
          const after = game.play(s, m);
          if (!after) {
            at(where, `scripted move ${m} is not legal`);
            return problems;
          }
          s = after;
        }
        position = game.notation(s);
        break;
      }
      case 'askMove': {
        await checkQuestion(where, step, state);
        const after = game.play(state, step.accept[0] ?? '');
        if (!after) return problems;
        const replied = step.reply ? game.play(after, step.reply) : after;
        position = game.notation(replied ?? after);
        break;
      }
      case 'askChoice':
      case 'askNumber':
        await checkQuestion(where, step, state);
        break;
      case 'freePlay':
        checkText(where, step, state);
        if (step.maxMoves < 1) at(where, 'maxMoves must be at least one');
        break;
      case 'checkpoint': {
        checkText(where, step, state);
        if (step.questions.length === 0) at(where, 'a checkpoint needs questions');
        let qPosition = position;
        for (const [j, q] of step.questions.entries()) {
          if (q.position) qPosition = q.position;
          const qState = parse(`${where} question ${j + 1}`, qPosition);
          if (qState) await checkQuestion(`${where} question ${j + 1}`, q, qState);
        }
        break;
      }
    }
  }
  if (problems.length > 0) return problems;

  // The auto-player: once answering everything right, once answering wrong first and asking to be shown.
  for (const mode of ['right', 'shown'] as const) {
    const result = await autoPlay(lesson, game, verifier, mode);
    if (result) at(`auto-player (${mode})`, result);
  }
  return problems;
}

/** Plays a lesson to the end. Returns a problem, or null when the lesson finished. */
export async function autoPlay<S>(lesson: Lesson, game: LessonGame<S>, verifier: LessonVerifier<S>, mode: 'right' | 'shown'): Promise<string | null> {
  let s: RunnerState = startLesson(lesson);
  let guard = 0;
  while (s.phase !== 'done') {
    if (++guard > 2000) return 'the lesson never ends';
    const step = currentStep(s);
    if (!step) return 'ran past the last step without finishing';
    const where = `step ${s.step + 1} (${step.kind})`;
    if (canAdvance(s) || step.kind === 'say' || step.kind === 'show') {
      const before = s;
      s = next(game, s);
      if (s === before) return `${where}: Next does nothing`;
      continue;
    }
    if (step.kind === 'freePlay') {
      const result = await freePlay(game, verifier, s, step);
      if (typeof result === 'string') return `${where}: ${result}`;
      s = result;
      continue;
    }
    const q = currentQuestion(s);
    if (!q) return `${where}: no question`;
    const values = valuesAt(game, s);
    if (mode === 'shown' && step.kind !== 'checkpoint') {
      const wrong = wrongAnswer(game, s, q);
      if (wrong !== null) {
        const before = s;
        s = wrong();
        if (s.phase !== 'wrong') return `${where}: a wrong answer was not marked wrong (phase ${s.phase})`;
        if (before.position !== s.position) return `${where}: a wrong answer changed the position`;
      }
      s = reveal(game, s);
      if (!canAdvance(s)) return `${where}: cannot go on after the answer is shown`;
      if (step.kind === 'askMove') s = playReply(game, s);
      continue;
    }
    if (q.kind === 'askMove') s = submitMove(game, s, q.accept[0] as string, values);
    else if (q.kind === 'askChoice') s = chooseOption(game, s, q.options.findIndex((o) => o.correct), values);
    else if (q.kind === 'askNumber') s = submitNumber(game, s, Number(values[q.answer]), values);
    else return `${where}: unexpected question kind`;
    if (step.kind !== 'checkpoint' && s.phase !== 'correct') return `${where}: the accepted answer was not accepted (phase ${s.phase}, ${s.feedback ?? ''})`;
    if (step.kind === 'checkpoint' && s.question > 0 && s.right !== s.question) return `${where}: a right answer was counted wrong`;
  }
  return null;
}

function wrongAnswer<S>(game: LessonGame<S>, s: RunnerState, q: QuizStep | LessonStep): (() => RunnerState) | null {
  if (q.kind === 'askMove') {
    const state = game.position(s.position);
    const accepted = new Set(q.accept.map((m) => game.canonical(state, m)));
    const move = game.moves(state).find((m) => !accepted.has(m));
    return move ? () => submitMove(game, s, move) : null;
  }
  if (q.kind === 'askChoice') {
    const index = q.options.findIndex((o) => !o.correct);
    return index >= 0 ? () => chooseOption(game, s, index) : null;
  }
  if (q.kind === 'askNumber') {
    const value = Number(valuesAt(game, s)[q.answer]);
    return () => submitNumber(game, s, value + 1);
  }
  return null;
}

async function freePlay<S>(game: LessonGame<S>, verifier: LessonVerifier<S>, start: RunnerState, step: FreePlayStep): Promise<RunnerState | string> {
  let s = start;
  for (let i = 0; i < step.maxMoves * 2 + 2; i++) {
    const mine = await verifier.freePlayMove(game.position(s.position), 'student', step);
    s = submitMove(game, s, mine);
    if (s.phase === 'correct') return s;
    if (s.phase === 'failed') return `the goal "${step.goal}" was not reached in ${step.maxMoves} moves against the engine's defence`;
    const theirs = await verifier.freePlayMove(game.position(s.position), 'opponent', step);
    s = opponentMove(game, s, theirs);
    if (s.phase === 'failed') return `the game ended before the goal "${step.goal}" was reached`;
  }
  return 'free play did not finish';
}

/** Lints a set of lessons for one game: each lesson, plus ids that must be unique. */
export async function lintLessons<S>(lessons: readonly Lesson[], game: LessonGame<S>, verifier: LessonVerifier<S>, onLesson?: (lesson: Lesson, problems: string[]) => void): Promise<string[]> {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const lesson of lessons) {
    if (seen.has(lesson.id)) problems.push(`${lesson.id}: the id is used twice`);
    seen.add(lesson.id);
    const found = await lintLesson(lesson, game, verifier);
    onLesson?.(lesson, found);
    problems.push(...found);
  }
  return problems;
}
