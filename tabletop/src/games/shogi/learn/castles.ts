/**
 * Shogi stage 4, the castle trainer's lessons (M15): the castles of src/games/shogi/castles.ts built
 * from the starting position, in four short lessons. Each castle is named (with its Japanese name
 * and reading), its idea given in a sentence and the whole build played through; a quiz at the end
 * asks each castle's finishing move.
 */
import type { Lesson } from '../../../teach/lesson';
import type { LineWords } from '../../../teach/lines';
import { lineLesson } from '../../../teach/lines';
import { CASTLES } from '../castles';
import { shogiLessonGame } from './game';

export const SHOGI_SIDES: LineWords = { side: (seat) => (seat === 0 ? 'Black' : 'White') };

const LESSONS: readonly { readonly id: string; readonly castles: readonly string[]; readonly title: string; readonly intro: string }[] = [
  {
    id: 'mino-family',
    castles: ['mino', 'high-mino', 'silver-crown'],
    title: 'Building the Mino, the High Mino and the Silver Crown',
    intro: 'A castle (kakoi, kah-koy) is a set shape of generals around the king, built in the opening before the fighting starts. The Mino family belongs to Ranging Rook: watch each one grow from the starting position, move by move.',
  },
  {
    id: 'anaguma',
    castles: ['ranging-anaguma', 'static-anaguma'],
    title: 'Building the Anaguma, both ways',
    intro: 'The Anaguma, the “badger in its hole”, hides the king in a corner. A Ranging Rook player builds it on the right, a Static Rook player on the left.',
  },
  {
    id: 'yagura',
    castles: ['yagura', 'crab'],
    title: 'Building the Yagura and the Crab',
    intro: 'When both players keep their rooks at home, the Yagura is the classic castle, and the Crab is a common step on the way to it.',
  },
  {
    id: 'quick',
    castles: ['boat', 'elmo'],
    title: 'Quick castles against Ranging Rook: the Boat and the Elmo',
    intro: 'Against a ranging rook, a Static Rook player can castle in a few moves and keep time for an attack.',
  },
];

export function castleLessons(): Lesson[] {
  const all = new Map(CASTLES.map((c) => [c.id, c]));
  return LESSONS.map((l) => {
    const lines = l.castles.map((id) => {
      const c = all.get(id);
      if (!c) throw new Error(`Castle lesson ${l.id}: no castle "${id}"`);
      return c;
    });
    return lineLesson(shogiLessonGame, lines, SHOGI_SIDES, { id: `shogi.castles.${l.id}`, gameId: 'shogi', stage: 'stage-4', title: l.title, intro: l.intro, minutes: 4 });
  });
}
