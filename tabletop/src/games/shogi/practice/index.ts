/**
 * Shogi practice (PLAN.md 2.6): mate problems in one, three and five plies, generated from the
 * engine's own games and proved by mate search with a single first move
 * (scripts/shogi-problems.ts); and three generated drills on the lesson runner: drops, castles,
 * and counting impasse points the way you will at a real table. The castle trainer (M15) adds nine
 * castles to build from the starting position from memory, each coming back on the review
 * schedule, and a "next move of this castle" drill.
 */
import type { Lesson } from '../../../teach/lesson';
import type { Problem } from '../../../teach/problem';
import { solverPosition } from '../../../teach/problem';
import { lineDrill, lineProblem } from '../../../teach/lines';
import type { DrillDef, PracticePack, PracticeSetDef } from '../../practice';
import { CASTLES as CASTLE_LINES } from '../castles';
import { SHOGI_SIDES } from '../learn/castles';
import type { Color } from '../core';
import { colorOfCode, HAND_LETTER, parseSfen, pieceCode, positionProblems, squareIndex, START_SFEN, typeOfCode } from '../core';
import { shogiLessonGame } from '../learn/game';
import { canonicalOf } from '../notation';
import type { ShogiState } from '../rules';
import { shogi } from '../rules';

interface ProblemFile {
  readonly problems: readonly Problem[];
}

export const SHOGI_SETS: readonly PracticeSetDef[] = [
  { id: 'shogi-mate1', themes: ['shogi-mate1'], chips: ['shogi-drop', 'shogi-promotion'] },
  { id: 'shogi-mate3', themes: ['shogi-mate3'], chips: ['shogi-sacrifice', 'shogi-drop'] },
  { id: 'shogi-mate5', themes: ['shogi-mate5'], chips: ['shogi-sacrifice'] },
  // The castle trainer: every castle you finish joins your review queue; it moves no rating.
  { id: 'shogi-castles', themes: ['line'], chips: ['castle-ranging', 'castle-static'], review: 'auto', rated: false },
];

/** The castles as problems: Black builds the castle from the starting position, White answers. */
export function castleProblems(): Problem[] {
  return CASTLE_LINES.map((c) => lineProblem(shogiLessonGame, c, [`castle-${c.group}`]));
}

const THEME_ORDER: readonly string[] = ['shogi-mate1', 'shogi-mate3', 'shogi-mate5', 'shogi-sacrifice', 'shogi-drop', 'shogi-promotion'];

const pick = <T>(random: () => number, items: readonly T[]): T => items[Math.floor(random() * items.length)] as T;

// ---------------------------------------------------------------------------------------------
// Drops
// ---------------------------------------------------------------------------------------------

/** A sparse mini-shogi position with a piece in hand for Black, for counting legal drops. */
export function dropCountPosition(random: () => number): string {
  for (let tries = 0; tries < 500; tries++) {
    const p = parseSfen('5/5/5/5/5 b - 1');
    const cells = p.geo.squares;
    const place = (code: number) => {
      const free = cells.filter((sq) => p.board[sq] === 0);
      const sq = pick(random, free);
      p.board[sq] = code;
    };
    place(pieceCode(0, 7));
    place(pieceCode(1, 7));
    // A black pawn on the board sometimes, so the two-pawns rule matters.
    if (random() < 0.7) place(pieceCode(0, 0));
    for (let i = 0; i < 2; i++) place(pieceCode(random() < 0.5 ? 1 : 0, pick(random, [3, 4])));
    p.hand[0] = 1;
    p.rehash();
    if (positionProblems(p).length > 0 || p.inCheck()) continue;
    return p.sfen();
  }
  return '4k/5/5/P4/K4 b P 1';
}

function dropDrill(problems: readonly Problem[]): (random: () => number) => Lesson {
  const dropMates = problems.filter((p) => p.themes.includes('shogi-mate1') && p.themes.includes('shogi-drop'));
  return (random) => {
    if (dropMates.length > 0 && random() < 0.5) {
      const problem = pick(random, dropMates);
      const position = solverPosition(shogiLessonGame, problem);
      const state = shogiLessonGame.position(position);
      // Every drop that mates is right.
      const mates = shogiLessonGame.moves(state).filter((m) => m.includes('*') && shogiLessonGame.goalMet('mate', state, shogiLessonGame.play(state, m) as ShogiState, m));
      return {
        id: 'shogi.drill.drop-mate',
        gameId: 'shogi',
        stage: 'stage-2',
        title: 'Mate with a drop',
        minutes: 1,
        start: position,
        steps: [{ kind: 'askMove', text: 'One piece from your hand gives checkmate. Drop it.', accept: mates.length > 0 ? mates : problem.line.slice(0, 1), claim: 'mate', success: 'Checkmate with a drop.' }],
      };
    }
    const position = dropCountPosition(random);
    return {
      id: 'shogi.drill.drop-count',
      gameId: 'shogi',
      stage: 'stage-1',
      title: 'Where may the pawn go?',
      minutes: 1,
      start: position,
      steps: [
        {
          kind: 'askNumber',
          text: 'You have a pawn in hand. On how many squares may you drop it? Remember: empty squares only, never on your far rank, never on a file that already has your pawn, and never to give mate.',
          answer: 'drops:P',
          success: 'Right: {drops:P} squares.',
        },
      ],
    };
  };
}

// ---------------------------------------------------------------------------------------------
// Castles
// ---------------------------------------------------------------------------------------------

type CastleId = 'mino' | 'yagura' | 'anaguma' | 'boat';

/** Where Black's pieces go, as moves from the starting position (board edits, not a game). */
const CASTLES: Readonly<Record<CastleId, { readonly relocate: readonly (readonly [string, string])[]; readonly lastKing: readonly [string, string]; readonly name: string }>> = {
  mino: { relocate: [['77', '76'], ['67', '66'], ['88', '77'], ['28', '68'], ['39', '38'], ['69', '58'], ['59', '28']], lastKing: ['39', '28'], name: 'The Mino castle (美濃囲い)' },
  yagura: { relocate: [['77', '76'], ['67', '66'], ['79', '77'], ['69', '78'], ['49', '67'], ['88', '68'], ['59', '88']], lastKing: ['79', '88'], name: 'The Yagura castle (矢倉)' },
  anaguma: { relocate: [['77', '76'], ['88', '77'], ['99', '98'], ['79', '88'], ['69', '79'], ['49', '78'], ['59', '99']], lastKing: ['89', '99'], name: 'The Anaguma castle (穴熊)' },
  boat: { relocate: [['77', '76'], ['27', '26'], ['79', '68'], ['49', '58'], ['59', '78']], lastKing: ['69', '78'], name: 'The Boat castle (舟囲い)' },
};
const CASTLE_IDS: readonly CastleId[] = ['mino', 'yagura', 'anaguma', 'boat'];

/** The standard start with Black's pieces moved into a castle; the king one step short when `short`. */
export function castlePosition(id: CastleId, short: boolean): string {
  const p = parseSfen(START_SFEN.standard);
  const castle = CASTLES[id];
  const at = (name: string) => squareIndex(p.geo, Number(name[0]), Number(name[1]));
  for (const [from, to] of castle.relocate) {
    const code = p.board[at(from)]!;
    p.board[at(from)] = 0;
    p.board[at(to)] = code;
  }
  if (short) {
    const [from, to] = castle.lastKing;
    const code = p.board[at(to)]!;
    p.board[at(to)] = 0;
    p.board[at(from)] = code;
  }
  p.rehash();
  return p.sfen();
}

function castleDrill(random: () => number): Lesson {
  const id = pick(random, CASTLE_IDS);
  if (random() < 0.5) {
    const position = castlePosition(id, false);
    // Three wrong names and the right one, in a fixed order so the answer moves around.
    const options = CASTLE_IDS.map((c) => ({ text: CASTLES[c].name, ...(c === id ? { correct: true as const, why: 'Right.' } : { why: `No: look at where the king and the generals stand. This is ${CASTLES[id].name}.` }) }));
    return {
      id: 'shogi.drill.castle-name',
      gameId: 'shogi',
      stage: 'stage-3',
      title: 'Name the castle',
      minutes: 1,
      start: position,
      steps: [{ kind: 'askChoice', text: 'Which castle has Black built?', options }],
    };
  }
  const position = castlePosition(id, true);
  const [from, to] = CASTLES[id].lastKing;
  return {
    id: 'shogi.drill.castle-king',
    gameId: 'shogi',
    stage: 'stage-3',
    title: 'Into the castle',
    minutes: 1,
    start: position,
    steps: [{ kind: 'askMove', text: `${CASTLES[id].name} is ready. Move the king into place.`, accept: [`${from}${to}`], claim: 'legal', success: 'The king is home.' }],
  };
}

// ---------------------------------------------------------------------------------------------
// Impasse points
// ---------------------------------------------------------------------------------------------

function pointsDrill(problems: readonly Problem[]): (random: () => number) => Lesson {
  return (random) => {
    const problem = pick(random, problems);
    const position = problem ? solverPosition(shogiLessonGame, problem) : START_SFEN.standard;
    const black = random() < 0.5;
    return {
      id: 'shogi.drill.points',
      gameId: 'shogi',
      stage: 'table',
      title: 'Count impasse points',
      minutes: 1,
      start: position,
      steps: [
        {
          kind: 'askNumber',
          text: `Count ${black ? 'Black' : 'White'}’s impasse points: every rook and bishop (promoted or not) {impasse:big}, every other piece {impasse:small}, kings nothing. Pieces in hand count too.`,
          answer: black ? 'impasse:black' : 'impasse:white',
          success: `Right: ${black ? '{impasse:black}' : '{impasse:white}'}. Fewer than {impasse:count} loses under the professional rule.`,
        },
      ],
    };
  };
}

export async function loadShogiPractice(): Promise<PracticePack> {
  const file = (await import('./problems.json')).default as unknown as ProblemFile;
  const problems = file.problems;
  const drills: DrillDef[] = [
    { id: 'drill-shogi-drops', make: dropDrill(problems) },
    { id: 'drill-shogi-castles', make: castleDrill },
    lineDrill('drill-shogi-build', shogiLessonGame, CASTLE_LINES, SHOGI_SIDES, { gameId: 'shogi', stage: 'stage-4' }),
    { id: 'drill-shogi-points', make: pointsDrill(problems) },
  ];
  return { problems: [...problems, ...castleProblems()], sets: SHOGI_SETS, drills, attribution: 'practice.shogi.generated', game: shogiLessonGame, themeOrder: THEME_ORDER };
}

/** For tests: the side to move in a problem after its setup move. */
export function problemSide(problem: Problem): Color {
  const position = solverPosition(shogiLessonGame, problem);
  return shogi.turn(shogi.codec.state.fromText(position)) === 1 ? 1 : 0;
}

/** For tests: the canonical first move of each piece drop in a position. */
export function dropsIn(sfen: string): string[] {
  const p = parseSfen(sfen);
  return p.legalMoves().filter((m) => (m & (1 << 17)) !== 0).map((m) => canonicalOf(p.geo, m));
}

export { colorOfCode, HAND_LETTER, typeOfCode };
