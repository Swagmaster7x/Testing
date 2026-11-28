/**
 * Go stage 4, joseki basics (M15): the corner sequences of src/games/go/joseki.ts in two short
 * lessons, the 4-4 point and the 3-4 point. Each sequence is named, its idea given in a sentence
 * and its moves played through; a quiz at the end asks each sequence's key move.
 */
import type { Lesson } from '../../../teach/lesson';
import type { LineWords } from '../../../teach/lines';
import { lineLesson } from '../../../teach/lines';
import { josekiLines } from '../joseki';
import { goLessonGame } from './game';

export const GO_SIDES: LineWords = { side: (seat) => (seat === 0 ? 'Black' : 'White') };

export function josekiLessons(): Lesson[] {
  const all = josekiLines();
  const group = (g: string) => all.filter((j) => j.group === g);
  return [
    lineLesson(goLessonGame, group('4-4'), GO_SIDES, {
      id: 'go.joseki.hoshi',
      gameId: 'go',
      stage: 'stage-4',
      title: 'Joseki on the 4-4 point',
      intro: 'A joseki (joh-seh-kee) is a corner sequence both players accept as fair: one side usually gets the corner, the other a strong position facing the side. The 4-4 point (hoshi, hoh-shee) is the most popular first move in a corner.',
      minutes: 3,
    }),
    lineLesson(goLessonGame, group('3-4'), GO_SIDES, {
      id: 'go.joseki.komoku',
      gameId: 'go',
      stage: 'stage-4',
      title: 'Joseki on the 3-4 point',
      intro: 'The 3-4 point (komoku, koh-moh-koo) leans towards the corner and invites an approach. Here are its most common answers to the low and the high approach.',
      minutes: 4,
    }),
  ];
}
