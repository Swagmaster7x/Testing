/**
 * Chess stage 4, the opening trainer's lessons (M15): the openings of src/games/chess/openings.ts in
 * ten short lessons of three or four, by family. Each opening is named, its idea given in a
 * sentence and its moves played through; a quiz at the end asks each opening's key move.
 */
import type { Lesson } from '../../../teach/lesson';
import type { LineWords } from '../../../teach/lines';
import { lineLesson } from '../../../teach/lines';
import type { Opening, OpeningGroup } from '../openings';
import { chessOpenings } from '../openings';
import { chessLessonGame } from './game';

export const CHESS_SIDES: LineWords = { side: (seat) => (seat === 0 ? 'White' : 'Black') };

const LESSONS: readonly { readonly id: string; readonly group: OpeningGroup; readonly openings: readonly string[]; readonly title: string; readonly intro: string }[] = [
  {
    id: 'open-white',
    group: 'open',
    openings: ['italian', 'ruy-lopez', 'scotch'],
    title: 'Open games: Italian, Ruy Lopez, Scotch',
    intro: 'An opening is a line of moves with a name, known by heart at every club. After e4 e5 and Nf3 Nc6, White has three classic ways to go on. Learn the moves, and above all the idea behind each.',
  },
  {
    id: 'open-gambits',
    group: 'open',
    openings: ['kings-gambit', 'evans-gambit', 'two-knights'],
    title: 'Open games: gambits and the Two Knights',
    intro: 'A gambit gives a pawn for time and open lines. Here are two famous White gambits, and Black’s sharpest answer to the Italian.',
  },
  {
    id: 'open-black',
    group: 'open',
    openings: ['berlin', 'petrov', 'philidor'],
    title: 'Open games: Black’s solid answers',
    intro: 'Black does not have to wait to be attacked. These three defences meet e4 e5 Nf3 with a plan of Black’s own.',
  },
  {
    id: 'sicilian',
    group: 'semi-open',
    openings: ['sicilian', 'najdorf', 'dragon'],
    title: 'The Sicilian: Najdorf and Dragon',
    intro: 'Against e4, the Sicilian is the most popular answer at every level. Two of its main lines are worth knowing by name.',
  },
  {
    id: 'french-caro',
    group: 'semi-open',
    openings: ['french', 'french-advance', 'caro-kann'],
    title: 'The French and the Caro-Kann',
    intro: 'Two sturdy defences that meet e4 with a quiet pawn move, then challenge the centre with d5.',
  },
  {
    id: 'other-e4',
    group: 'semi-open',
    openings: ['scandinavian', 'pirc', 'alekhine'],
    title: 'Scandinavian, Pirc and Alekhine',
    intro: 'Three defences that let White have the centre for a while, each in its own way.',
  },
  {
    id: 'queens-gambit',
    group: 'closed',
    openings: ['queens-gambit', 'qgd', 'qga', 'slav'],
    title: 'The Queen’s Gambit and its answers',
    intro: 'After d4 d5, the c-pawn goes to c4 in the Queen’s Gambit. Black can decline it two ways, or take it.',
  },
  {
    id: 'indian',
    group: 'closed',
    openings: ['kings-indian', 'nimzo-indian', 'queens-indian'],
    title: 'The Indian defences',
    intro: 'Against d4, many players answer Nf6 and put a bishop on the long diagonal or on b4. These are the “Indian” defences.',
  },
  {
    id: 'd4-systems',
    group: 'closed',
    openings: ['london', 'grunfeld', 'dutch'],
    title: 'London, Grünfeld and Dutch',
    intro: 'A simple system for White, and two fighting defences for Black.',
  },
  {
    id: 'flank',
    group: 'flank',
    openings: ['english', 'reti', 'catalan'],
    title: 'Flank openings: English, Réti and Catalan',
    intro: 'Not every opening starts in the centre. These fight for it from the side, with the c-pawn and a bishop on the long diagonal.',
  },
];

export function openingLessons(): Lesson[] {
  const all = new Map(chessOpenings().map((o) => [o.id, o]));
  return LESSONS.map((l) => {
    const lines = l.openings.map((id) => {
      const o = all.get(id);
      if (!o || o.group !== l.group) throw new Error(`Opening lesson ${l.id}: no ${l.group} opening "${id}"`);
      return o;
    }) satisfies Opening[];
    return lineLesson(chessLessonGame, lines, CHESS_SIDES, { id: `chess.openings.${l.id}`, gameId: 'chess', stage: 'stage-4', title: l.title, intro: l.intro, minutes: lines.length > 3 ? 4 : 3 });
  });
}

/** Every opening is taught in exactly one lesson. */
export const OPENING_LESSON_IDS: readonly (readonly string[])[] = LESSONS.map((l) => l.openings);
