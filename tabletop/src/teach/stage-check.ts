/**
 * "I already know this" (PLAN.md 1.3): a short check built from a stage's own lesson questions.
 * Passing it marks every lesson in the stage as done; nothing is ever locked either way.
 */
import type { Lesson, QuizStep, StageId } from './lesson';
import type { LessonGame } from './runner';

export const CHECK_QUESTIONS = 5;
/** How many questions may be missed and still pass. */
export const CHECK_ALLOWED_MISSES = 1;

export interface PlacedQuestion {
  readonly question: QuizStep;
  readonly position: string;
}

/** Every question in a lesson with the position it is asked in, following the lesson's moves. */
export function placedQuestions<S>(lesson: Lesson, game: LessonGame<S>): PlacedQuestion[] {
  const out: PlacedQuestion[] = [];
  let position = lesson.start;
  for (const step of lesson.steps) {
    if (step.position) position = step.position;
    switch (step.kind) {
      case 'show': {
        let s = game.position(position);
        for (const m of step.moves) s = game.play(s, m) ?? s;
        position = game.notation(s);
        break;
      }
      case 'askMove': {
        out.push({ question: step, position });
        const after = game.play(game.position(position), step.accept[0] ?? '');
        const replied = after && step.reply ? game.play(after, step.reply) : after;
        if (replied) position = game.notation(replied);
        break;
      }
      case 'askChoice':
      case 'askNumber':
        out.push({ question: step, position });
        break;
      case 'checkpoint': {
        let p = position;
        for (const q of step.questions) {
          if (q.position) p = q.position;
          out.push({ question: q, position: p });
        }
        break;
      }
      default:
        break;
    }
  }
  return out;
}

const PREFERENCE: Record<QuizStep['kind'], number> = { askMove: 0, askNumber: 1, askChoice: 2 };

/** The stage check: one question from each of several lessons, spread over the stage. */
export function stageCheck<S>(lessons: readonly Lesson[], game: LessonGame<S>, gameId: string, stage: StageId): Lesson {
  const inStage = lessons.filter((l) => l.gameId === gameId && l.stage === stage);
  const candidates = inStage
    .map((l) => [...placedQuestions(l, game)].sort((a, b) => PREFERENCE[a.question.kind] - PREFERENCE[b.question.kind])[0])
    .filter((q): q is PlacedQuestion => q !== undefined);
  const count = Math.min(CHECK_QUESTIONS, candidates.length);
  const picked: PlacedQuestion[] = [];
  for (let i = 0; i < count; i++) picked.push(candidates[Math.floor((i * candidates.length) / count)] as PlacedQuestion);
  return {
    id: `${gameId}.check.${stage}`,
    gameId,
    stage,
    title: 'Stage check',
    minutes: 2,
    start: picked[0]?.position ?? inStage[0]?.start ?? '',
    steps: [{ kind: 'checkpoint', text: '', questions: picked.map(({ question, position }) => ({ ...question, position })) }],
  };
}

/** True when a finished stage check counts as passed. */
export function passedCheck(right: number, total: number): boolean {
  return total > 0 && total - right <= CHECK_ALLOWED_MISSES;
}
