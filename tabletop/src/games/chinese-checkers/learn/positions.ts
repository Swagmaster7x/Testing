/**
 * Lesson and drill positions, written as the holes each colour's marbles stand on. Marbles not
 * listed fill their own start, from the tip outwards, so a position always has every marble.
 */
import { HOLES, parseHole, ROW_FROM } from '../board';
import { layoutFor } from '../engine';
import type { CcState } from '../rules';
import { DEFAULT_RULES, positionText, SEAT_LETTERS } from '../rules';

export type Letter = 'R' | 'B' | 'G' | 'Y' | 'P' | 'W';

/** A position text: marbles by colour, the side to move, and any extra fields ("rules=home:free"). */
export function pos(spec: Partial<Record<Letter, readonly string[]>>, side: Letter, extra = '', players = 2, marbles = 10): string {
  const layout = layoutFor(players, marbles);
  const board = new Array<string>(HOLES).fill('.');
  for (const [letter, names] of Object.entries(spec)) {
    for (const name of names ?? []) {
      const h = parseHole(name);
      if (h < 0) throw new Error(`No hole ${name}`);
      if (board[h] !== '.') throw new Error(`${name} is used twice`);
      board[h] = letter;
    }
  }
  for (let seat = 0; seat < players; seat++) {
    const letter = SEAT_LETTERS[seat] as string;
    const point = layout.points[seat] as number;
    let have = board.filter((c) => c === letter).length;
    const start = [...(layout.startHoles[seat] as readonly number[])].sort((a, b) => (ROW_FROM[point * HOLES + a] as number) - (ROW_FROM[point * HOLES + b] as number) || a - b);
    for (const h of start) {
      if (have >= marbles) break;
      if (board[h] === '.') {
        board[h] = letter;
        have++;
      }
    }
    if (have !== marbles) throw new Error(`${letter} has ${have} marbles in this position`);
  }
  const state: CcState = { players, marbles, rules: DEFAULT_RULES, board: board.join(''), toMove: SEAT_LETTERS.indexOf(side), round: 1, passes: 0, done: [], end: null };
  const text = positionText(state);
  return extra ? `${text} ${extra}` : text;
}

/** The holes of a point by name, for lessons that fill a home. */
export const TOP = ['17a', '16a', '16b', '15a', '15b', '15c', '14a', '14b', '14c', '14d'];
export const BOTTOM = ['1a', '2a', '2b', '3a', '3b', '3c', '4a', '4b', '4c', '4d'];
