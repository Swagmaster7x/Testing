/**
 * The shogi castle trainer (M15): nine castles built from the starting position, move by move,
 * with White answering in a sensible way (a Static Rook castle against Black's Ranging Rook ones,
 * a Ranging Rook Mino against Black's Static Rook ones, a mirror Yagura against the Yagura). Every
 * move is checked by the rules when the lines are built, and the tests check each castle's final
 * shape square by square.
 *
 * The shapes follow the usual descriptions (checked against the English Wikipedia articles on
 * shogi castles, read 2026-11-27); the move orders and all text are this app's own. "Funagakoi"
 * (舟囲い) is the Boat castle.
 */
import type { StudyLine } from '../../teach/lines';
import { START_SFEN } from './core';

const START = START_SFEN.standard;

/** Black's Fourth File Rook opening with a Mino, White building a Boat castle (from the stage 3 lesson). */
const MINO = ['7776', '3334', '6766', '8384', '2868', '8485', '8877', '7162', '5948', '5142', '3938', '4232', '4839', '6152', '3928', '1314', '6958'];
const HIGH_MINO = [...MINO, '9394', '4746', '7374', '5847'];
const SILVER_CROWN = [...HIGH_MINO, '1415', '2726', '9495', '3827', '6364', '4938'];
/** White's Fourth File Rook and Mino, mirrored from Black's, as the answer to Black's Static Rook castles. */
const WHITE_MINO = ['3334', '4344', '8242', '2233', '5162', '7172', '6271', '7182', '4152', '9394', '1314', '6364'];

function interleave(black: readonly string[], white: readonly string[]): string[] {
  const out: string[] = [];
  black.forEach((m, i) => {
    out.push(m);
    if (i < black.length - 1) {
      const w = white[i];
      if (w === undefined) throw new Error('A castle line needs a White answer between Black’s moves');
      out.push(w);
    }
  });
  return out;
}

export interface Castle extends StudyLine {
  /** The castle's pieces once built, by square: "K28", "S38"... (Black's pieces). */
  readonly shape: readonly string[];
}

export const CASTLES: readonly Castle[] = [
  {
    id: 'mino',
    name: 'The Mino castle (美濃囲い, mee-noh)',
    idea: 'The quick home for a ranging-rook king: the silver above the king and two golds beside it make it strong against attacks from the side.',
    start: START,
    moves: MINO,
    side: 0,
    group: 'ranging',
    shape: ['K28', 'S38', 'G49', 'G58'],
  },
  {
    id: 'high-mino',
    name: 'The High Mino (高美濃, tah-kah mee-noh)',
    idea: 'Pushing the pawn on the fourth file lets a gold step up to 47: the Mino grows taller and stands up better to attacks from the front.',
    start: START,
    moves: HIGH_MINO,
    side: 0,
    group: 'ranging',
    shape: ['K28', 'S38', 'G49', 'G47', 'P46'],
  },
  {
    id: 'silver-crown',
    name: 'The Silver Crown (銀冠, geen-kahn-moo-ree)',
    idea: 'The silver climbs onto the king’s head at 27 and a gold takes its old square, the strongest of the Mino family against attacks from above.',
    start: START,
    moves: SILVER_CROWN,
    side: 0,
    group: 'ranging',
    shape: ['K28', 'S27', 'G38', 'G47', 'P26', 'P46'],
  },
  {
    id: 'ranging-anaguma',
    name: 'Ranging Rook Anaguma (振り飛車穴熊, ah-nah-goo-mah)',
    idea: 'The ranging-rook king digs into the far corner behind its lance, and a silver and two golds close the hole: slow to build, very hard to break.',
    start: START,
    moves: interleave(['7776', '6766', '2868', '8877', '5948', '4838', '3828', '1918', '2819', '3928', '4939', '6958', '5848', '4838'], ['3334', '8384', '8485', '7162', '5142', '4232', '6152', '9394', '1314', '7374', '6364', '9495', '1415']),
    side: 0,
    group: 'ranging',
    shape: ['K19', 'L18', 'S28', 'G39', 'G38', 'N29'],
  },
  {
    id: 'yagura',
    name: 'The Gold Yagura (金矢倉, kin yah-goo-rah)',
    idea: 'The classic castle when both rooks stay home: silver on 77, golds on 78 and 67 and the king on 88 make a wall that faces straight ahead.',
    start: START,
    moves: interleave(['7776', '7968', '6877', '6978', '5756', '5969', '4958', '8879', '6766', '5867', '7968', '6979', '7988'], ['8384', '3334', '6152', '8485', '7162', '5354', '4132', '5141', '9394', '1314', '4344', '6253']),
    side: 0,
    group: 'static',
    shape: ['K88', 'S77', 'G78', 'G67', 'P76', 'P66', 'P56'],
  },
  {
    id: 'static-anaguma',
    name: 'Static Rook Anaguma (居飛車穴熊, ee-bee-shah ah-nah-goo-mah)',
    idea: 'Against a ranging rook, the king hides in the corner at 99 behind the lance, with a silver and two golds packed in beside it.',
    start: START,
    moves: interleave(['7776', '2726', '5968', '6878', '8877', '7888', '9998', '8899', '7988', '6979', '4958', '5868', '6878'], WHITE_MINO),
    side: 0,
    group: 'static',
    shape: ['K99', 'L98', 'S88', 'G79', 'G78', 'B77'],
  },
  {
    id: 'boat',
    name: 'The Boat castle (舟囲い, foo-nah gah-koy)',
    idea: 'The quickest castle against a ranging rook: the king steps next to the bishop and a gold moves up, leaving time for an early attack.',
    start: START,
    moves: interleave(['7776', '2726', '5968', '6878', '4958', '3948'], WHITE_MINO),
    side: 0,
    group: 'static',
    shape: ['K78', 'G69', 'G58', 'S79'],
  },
  {
    id: 'elmo',
    name: 'The Elmo castle (エルモ囲い, eh-roo-moh)',
    idea: 'A modern castle first played by computer engines: king on 78, the silver beside it on 68 and a gold below on 79, compact and hard to reach with a bishop.',
    start: START,
    moves: interleave(['7776', '2726', '5968', '6878', '7968', '6979', '4958'], WHITE_MINO),
    side: 0,
    group: 'static',
    shape: ['K78', 'S68', 'G79', 'G58'],
  },
  {
    id: 'crab',
    name: 'The Crab castle (カニ囲い, kah-nee)',
    idea: 'Gold, silver and gold side by side with the king tucked behind the silver: a sturdy halfway house on the road to the Yagura.',
    start: START,
    moves: interleave(['7776', '7968', '6978', '4958', '5969', '5756'], ['8384', '3334', '7162', '6152', '5354']),
    side: 0,
    group: 'static',
    shape: ['K69', 'G78', 'S68', 'G58'],
  },
];
