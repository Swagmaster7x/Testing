/**
 * Go practice (PLAN.md 2.6): three sets of generated problems, each proved by a solver
 * (generate.ts, written to problems.json by scripts/go-problems.ts): capturing, ladders and nets,
 * and life and death. Plus a drill: count a finished board yourself, by area or by territory.
 */
import type { Lesson } from '../../../teach/lesson';
import type { Problem } from '../../../teach/problem';
import type { DrillDef, PracticePack, PracticeSetDef } from '../../practice';
import { goLessonGame } from '../learn/game';

interface ProblemFile {
  readonly problems: readonly (readonly [string, string, string, number, string])[];
}

export const GO_SETS: readonly PracticeSetDef[] = [
  { id: 'go-capture', themes: ['go-capture'], exclude: ['go-ladder', 'go-net'], chips: ['go-atari', 'go-double-atari', 'go-snapback'] },
  { id: 'go-ladders', themes: ['go-ladder', 'go-net'], chips: ['go-ladder', 'go-net'] },
  { id: 'go-life', themes: ['go-live', 'go-kill'], chips: ['go-live', 'go-kill'] },
];

/** Themes in the order hints name them, most telling first. */
export const GO_THEME_ORDER: readonly string[] = ['go-snapback', 'go-double-atari', 'go-net', 'go-ladder', 'go-atari', 'go-live', 'go-kill', 'go-eye', 'go-capture'];

export function toProblem([id, position, line, rating, themes]: readonly [string, string, string, number, string]): Problem {
  return { id, position, setup: null, line: line.split(' '), rating, themes: themes.split(' ') };
}

const pick = <T,>(random: () => number, items: readonly T[]): T => items[Math.floor(random() * items.length)] as T;

/** A finished game to count: walls down the middle, stones inside, a dead stone or two. */
export function countPosition(random: () => number): { position: string; territory: boolean } {
  for (let tries = 0; tries < 200; tries++) {
    const size = random() < 0.5 ? 7 : 9;
    const wall = 1 + Math.floor(random() * (size - 3));
    const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => '.'));
    for (let y = 0; y < size; y++) {
      (grid[y] as string[])[wall] = 'X';
      (grid[y] as string[])[wall + 1] = 'O';
    }
    const dead: [number, number][] = [];
    const put = (x: number, y: number, c: string) => {
      if ((grid[y] as string[])[x] === '.') (grid[y] as string[])[x] = c;
    };
    // A few stones inside each side's own area, and maybe a dead invader.
    for (let k = Math.floor(random() * 3); k > 0; k--) put(Math.floor(random() * wall), Math.floor(random() * size), 'X');
    for (let k = Math.floor(random() * 3); k > 0; k--) put(wall + 2 + Math.floor(random() * (size - wall - 2)), Math.floor(random() * size), 'O');
    if (random() < 0.7 && wall >= 2) {
      const x = Math.floor(random() * (wall - 1));
      const y = Math.floor(random() * size);
      if ((grid[y] as string[])[x] === '.') {
        put(x, y, 'O');
        dead.push([x, y]);
      }
    }
    if (random() < 0.5 && size - wall - 2 >= 2) {
      const x = wall + 3 + Math.floor(random() * (size - wall - 3));
      const y = Math.floor(random() * size);
      if (x < size && (grid[y] as string[])[x] === '.') {
        put(x, y, 'X');
        dead.push([x, y]);
      }
    }
    const territory = random() < 0.5;
    const cap = territory ? ` cap=${Math.floor(random() * 5)},${Math.floor(random() * 5)}` : '';
    const deadText = dead.length > 0 ? ` dead=${dead.map(([x, y]) => `${String.fromCharCode(97 + x)}${String.fromCharCode(97 + y)}`).join('')}` : '';
    const position = `${grid.map((r) => r.join('')).join('/')} b${territory ? ' rules=japanese' : ''}${cap} pass=2,w phase=scoring,b${deadText}`;
    try {
      goLessonGame.position(position);
      return { position, territory };
    } catch {
      // A random stone took a chain's last liberty: try again.
    }
  }
  return { position: `${Array.from({ length: 7 }, () => '..XO...').join('/')} b pass=2,w phase=scoring,b`, territory: false };
}

const AREA_QUESTIONS = [
  { answer: 'area:black', text: 'Count Black’s area: stones on the board plus the empty points only Black surrounds. Crossed stones are dead and come off first.', success: 'Right: {stones:black} stones and {territory:black} points, {area:black} in all.' },
  { answer: 'area:white', text: 'Count White’s area: stones on the board plus the empty points only White surrounds, before komi. Crossed stones are dead and come off first.', success: 'Right: {stones:white} stones and {territory:white} points, {area:white} in all.' },
] as const;

const TERRITORY_QUESTIONS = [
  { answer: 'territory:black', text: 'Count Black’s territory: the empty points only Black surrounds, with the dead stones taken off.', success: 'Right, {territory:black}.' },
  { answer: 'territory:white', text: 'Count White’s territory: the empty points only White surrounds, with the dead stones taken off.', success: 'Right, {territory:white}.' },
  { answer: 'score:black', text: 'Black holds {prisoners:black} prisoners from the game. Count Black’s score: territory plus prisoners, the dead stones included.', success: 'Right: {territory:black} points of territory and {held:black} prisoners make {score:black}.' },
] as const;

function countDrill(random: () => number): Lesson {
  const { position, territory } = countPosition(random);
  const q = territory ? pick(random, TERRITORY_QUESTIONS) : pick(random, AREA_QUESTIONS);
  return {
    id: 'go.drill.count',
    gameId: 'go',
    stage: 'table',
    title: territory ? 'Count the board by territory' : 'Count the board by area',
    minutes: 1,
    start: position,
    steps: [{ kind: 'askNumber', text: q.text, answer: q.answer, success: q.success }],
  };
}

export const GO_DRILLS: readonly DrillDef[] = [{ id: 'drill-go-count', make: countDrill }];

export async function loadGoPractice(): Promise<PracticePack> {
  const file = (await import('./problems.json')).default as unknown as ProblemFile;
  return { problems: file.problems.map(toProblem), sets: GO_SETS, drills: GO_DRILLS, attribution: null, game: goLessonGame, themeOrder: GO_THEME_ORDER };
}
