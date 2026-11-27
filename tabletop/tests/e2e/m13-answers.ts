/**
 * Prints, as JSON, the answers the classic card pack e2e test needs: the drills the drill screen
 * makes for a seed (round 0), and the numbers a lesson asks for. It runs under tsx, outside the
 * browser test runner, because the games' text modules import JSON.
 *
 *   tsx tests/e2e/m13-answers.ts <seed>
 */
import { createRng } from '../../src/core/rng';
import { BLACKJACK_DRILLS } from '../../src/games/blackjack/practice';
import { cardName } from '../../src/games/classic/names';
import { ginLessonGame } from '../../src/games/gin-rummy/learn/game';
import { GIN_DRILLS } from '../../src/games/gin-rummy/practice';
import { heartsLessonGame } from '../../src/games/hearts/learn/game';
import { HEARTS_DRILLS } from '../../src/games/hearts/practice';
import type { DrillDef } from '../../src/games/practice';
import { SPADES_LESSONS } from '../../src/games/spades/learn';
import { spadesLessonGame } from '../../src/games/spades/learn/game';
import { SPADES_DRILLS } from '../../src/games/spades/practice';
import type { Card } from '../../src/games/classic/cards';
import type { Lesson, LessonStep } from '../../src/teach/lesson';
import type { LessonGame } from '../../src/teach/runner';

const seed = process.argv[2] ?? 'e2e';

function drillFor(drills: readonly DrillDef[], id: string): Lesson {
  const drill = drills.find((d) => d.id === id);
  if (!drill) throw new Error(`no drill ${id}`);
  const rng = createRng(`${seed}/${id}/0`);
  return drill.make(() => rng.next());
}

function question(lesson: Lesson): LessonStep {
  const step = lesson.steps.find((s) => s.kind !== 'say' && s.kind !== 'show');
  if (!step) throw new Error(`${lesson.id} asks nothing`);
  return step;
}

function numberOf(lesson: Lesson, game: LessonGame<never>): number {
  const step = question(lesson);
  if (step.kind !== 'askNumber') throw new Error(`${lesson.id} does not ask for a number`);
  return Number(game.computed(game.position(step.position ?? lesson.start))[step.answer]);
}

function moveOf(lesson: Lesson): string {
  const step = question(lesson);
  if (step.kind !== 'askMove') throw new Error(`${lesson.id} does not ask for a move`);
  return step.accept[0] as string;
}

const score = SPADES_LESSONS.find((l) => l.id === 'spades.1.score') as Lesson;
const scoreValues = spadesLessonGame.computed(spadesLessonGame.position(score.start));
const chart = moveOf(drillFor(BLACKJACK_DRILLS, 'drill-blackjack-chart'));

console.log(
  JSON.stringify({
    'drill-hearts-points': numberOf(drillFor(HEARTS_DRILLS, 'drill-hearts-points'), heartsLessonGame as never),
    'drill-spades-count': numberOf(drillFor(SPADES_DRILLS, 'drill-spades-count'), spadesLessonGame as never),
    'drill-gin-deadwood': numberOf(drillFor(GIN_DRILLS, 'drill-gin-deadwood'), ginLessonGame as never),
    'drill-gin-discard': cardName(moveOf(drillFor(GIN_DRILLS, 'drill-gin-discard')) as Card),
    'drill-blackjack-chart': chart.charAt(0).toUpperCase() + chart.slice(1),
    'spades.1.score': [scoreValues['score:size'], scoreValues['score:if-mine']],
    names: { Qs: cardName('Qs'), '9d': cardName('9d') },
  }),
);
