/**
 * Chess practice (PLAN.md 2.6): rated problems from the Lichess puzzle database (CC0), grouped
 * by theme, and two generated drills: basic mates against the computer and counting material.
 */
import type { Lesson } from '../../../teach/lesson';
import type { Problem } from '../../../teach/problem';
import { solverPosition } from '../../../teach/problem';
import type { DrillDef, PracticePack, PracticeSetDef } from '../../practice';
import { chessLessonGame } from '../learn/game';
import { chessAt, FIFTY_MOVE_RULE } from '../rules';

interface PuzzleFile {
  readonly puzzles: readonly (readonly [string, string, string, number, string])[];
}

export const CHESS_SETS: readonly PracticeSetDef[] = [
  { id: 'tactics', themes: ['fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck', 'hangingPiece', 'trappedPiece', 'deflection', 'attraction', 'sacrifice', 'promotion', 'advantage', 'crushing'], exclude: ['mate'], chips: ['fork', 'pin', 'skewer', 'discoveredAttack', 'hangingPiece', 'sacrifice'] },
  { id: 'mates', themes: ['mate'], chips: ['mateIn1', 'mateIn2', 'mateIn3', 'backRankMate'] },
  { id: 'endgames', themes: ['endgame'], exclude: ['mate'], chips: ['pawnEndgame', 'rookEndgame'] },
];

/** Themes worth naming in a hint, most telling first. Broad tags such as "endgame" come last. */
const THEME_ORDER: readonly string[] = [
  'mateIn1', 'mateIn2', 'mateIn3', 'backRankMate', 'smotheredMate', 'fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck',
  'hangingPiece', 'trappedPiece', 'deflection', 'attraction', 'capturingDefender', 'interference', 'clearance', 'intermezzo',
  'xRayAttack', 'sacrifice', 'promotion', 'advancedPawn', 'quietMove', 'defensiveMove', 'zugzwang', 'exposedKing',
  'kingsideAttack', 'queensideAttack', 'pawnEndgame', 'rookEndgame', 'queenEndgame', 'bishopEndgame', 'knightEndgame', 'endgame', 'mate',
];

function toProblem([id, fen, moves, rating, themes]: readonly [string, string, string, number, string]): Problem {
  const line = moves.split(' ');
  return { id: `lichess:${id}`, position: fen, setup: line[0] ?? null, line: line.slice(1), rating, themes: themes.split(' ') };
}

/** Random-looking but repeatable positions for the drills, from a seed. */
function squareName(i: number): string {
  return `${'abcdefgh'[i % 8]}${Math.floor(i / 8) + 1}`;
}

function near(a: number, b: number): boolean {
  return Math.abs((a % 8) - (b % 8)) <= 1 && Math.abs(Math.floor(a / 8) - Math.floor(b / 8)) <= 1;
}

/** A FEN with White to move from pieces by square index (0 is a1), in FEN letters. */
function fenOf(pieces: ReadonlyMap<number, string>): string {
  const ranks: string[] = [];
  for (let rank = 7; rank >= 0; rank--) {
    let row = '';
    let empty = 0;
    for (let file = 0; file < 8; file++) {
      const piece = pieces.get(rank * 8 + file);
      if (!piece) {
        empty++;
        continue;
      }
      if (empty > 0) row += String(empty);
      empty = 0;
      row += piece;
    }
    ranks.push(empty > 0 ? row + String(empty) : row);
  }
  return `${ranks.join('/')} w - - 0 1`;
}

/** King and queen (or rook) against a lone king, White to move, the black king in the middle. */
export function basicMatePosition(piece: 'q' | 'r', random: () => number): string {
  for (let tries = 0; tries < 1000; tries++) {
    const bk = Math.floor(random() * 64);
    const wk = Math.floor(random() * 64);
    const p = Math.floor(random() * 64);
    const file = bk % 8;
    const rank = Math.floor(bk / 8);
    if (file < 2 || file > 5 || rank < 2 || rank > 5) continue;
    if (new Set([bk, wk, p]).size < 3 || near(bk, wk) || near(bk, p)) continue;
    const fen = fenOf(new Map([[bk, 'k'], [wk, 'K'], [p, piece.toUpperCase()]]));
    const check = chessAt(fen);
    if (check.isAttacked(squareName(bk) as never, 'w')) continue;
    return fen;
  }
  return piece === 'q' ? '8/8/8/4k3/8/8/8/4K2Q w - - 0 1' : '8/8/8/4k3/8/8/8/R3K3 w - - 0 1';
}

function mateDrill(random: () => number): Lesson {
  const piece = random() < 0.5 ? 'q' : 'r';
  const position = basicMatePosition(piece, random);
  return {
    id: 'chess.drill.basic-mate',
    gameId: 'chess',
    stage: 'stage-3',
    title: piece === 'q' ? 'Mate with king and queen' : 'Mate with king and rook',
    minutes: 3,
    start: position,
    steps: [{ kind: 'freePlay', position, text: 'Mate the lone king before the {rule:fifty}-move rule ends the game in a draw. The computer defends as well as it can.', goal: 'mate', maxMoves: FIFTY_MOVE_RULE, success: 'Checkmate. Again, from a new position?' }],
  };
}

const COUNT_QUESTIONS = [
  { answer: 'material:white', text: 'Count White’s material. A pawn is {value:p}, a knight or bishop {value:n}, a rook {value:r}, a queen {value:q}.', success: 'Right: White has {material:white}.' },
  { answer: 'material:black', text: 'Count Black’s material. A pawn is {value:p}, a knight or bishop {value:n}, a rook {value:r}, a queen {value:q}.', success: 'Right: Black has {material:black}.' },
  { answer: 'material:diff', text: 'How many points apart are the two sides? Count both, then take the difference.', success: 'Right: White {material:white}, Black {material:black}, a difference of {material:diff}.' },
] as const;

function countDrill(problems: readonly Problem[]): (random: () => number) => Lesson {
  return (random) => {
    const problem = problems[Math.floor(random() * problems.length)] as Problem;
    const position = solverPosition(chessLessonGame, problem);
    const q = COUNT_QUESTIONS[Math.floor(random() * COUNT_QUESTIONS.length)] ?? COUNT_QUESTIONS[0];
    return {
      id: 'chess.drill.count',
      gameId: 'chess',
      stage: 'table',
      title: 'Count the material',
      minutes: 1,
      start: position,
      steps: [{ kind: 'askNumber', text: q.text, answer: q.answer, success: q.success }],
    };
  };
}

export async function loadChessPractice(): Promise<PracticePack> {
  const file = (await import('./lichess-puzzles.json')).default as unknown as PuzzleFile;
  const problems = file.puzzles.map(toProblem);
  const drills: DrillDef[] = [
    { id: 'drill-mates', make: mateDrill },
    { id: 'drill-count', make: countDrill(problems) },
  ];
  return { problems, sets: CHESS_SETS, drills, attribution: 'practice.chess.attribution', game: chessLessonGame, themeOrder: THEME_ORDER };
}
