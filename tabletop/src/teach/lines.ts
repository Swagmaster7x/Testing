/**
 * Line trainers (M15): named move sequences to learn by heart and understand, such as chess
 * openings, shogi castles and Go joseki. A line is data; from it this module makes the three
 * things the app teaches with:
 *
 * - lessons for Learn: the name and the idea, the line played through, then a short quiz;
 * - a drill: "play the next move of this line", at a random point of a random line;
 * - problems for spaced review: the student plays every move of their side, the other side's
 *   replies play themselves, and each line comes back on the review schedule (practice set with
 *   `review: 'auto'`).
 *
 * Every position comes from playing the moves on the game's own rules (LessonGame), so a line with
 * an illegal move fails as soon as it is used; the tests and the lesson linter play them all.
 */
import type { DrillDef } from '../games/practice';
import type { CheckpointStep, Lesson, LessonStep, StageId } from './lesson';
import type { Problem } from './problem';
import type { LessonGame } from './runner';

export interface StudyLine {
  readonly id: string;
  /** The line's name, in English like all lesson text (with the native name where there is one). */
  readonly name: string;
  /** What the line is for, in one sentence. */
  readonly idea: string;
  /** The position the line starts from, in the game's notation. */
  readonly start: string;
  /** Every move from the start, in the game's notation, both sides. */
  readonly moves: readonly string[];
  /** The seat the student plays in practice: the side whose plan the line is. */
  readonly side: number;
  /** A family for grouping in lessons and as a practice theme ("e4", "ranging", "4-4"). */
  readonly group: string;
  /**
   * The positions and movers along the line, when the game's data module has them already (chess
   * replays its openings through chess.js once); otherwise the line is replayed on first use. The
   * tests check that they match a replay on the rules.
   */
  readonly replayed?: { readonly positions: readonly string[]; readonly movers: readonly number[] };
}

/** How a game names its sides in line text ("White", "Black"). */
export interface LineWords {
  side(seat: number): string;
}

interface Replay {
  readonly positions: readonly string[];
  readonly movers: readonly number[];
}

/** One replay per line, shared by its lessons, drill and problem (replaying is the slow part). */
const replays = new WeakMap<StudyLine, Replay>();

function replay<S>(game: LessonGame<S>, line: StudyLine): Replay {
  const known = replays.get(line) ?? line.replayed;
  if (known) return known;
  let state = game.position(line.start);
  const positions = [game.notation(state)];
  const movers: number[] = [];
  for (const [i, move] of line.moves.entries()) {
    const seat = game.toMove(state);
    if (seat === null) throw new Error(`Line ${line.id}: the game is over before move ${i + 1}`);
    const next = game.play(state, move);
    if (!next) throw new Error(`Line ${line.id}: move ${i + 1} (${move}) is not legal`);
    movers.push(seat);
    state = next;
    positions.push(game.notation(state));
  }
  const out = { positions, movers };
  replays.set(line, out);
  return out;
}

/** Positions along a line: `positions[i]` is before move i (and the last one after every move). */
export function linePositions<S>(game: LessonGame<S>, line: StudyLine): string[] {
  return [...replay(game, line).positions];
}

/** Who moves at each ply of a line. */
export function lineMovers<S>(game: LessonGame<S>, line: StudyLine): number[] {
  return [...replay(game, line).movers];
}

/** The plies where the student (the line's side) moves. */
export function studentPlies<S>(game: LessonGame<S>, line: StudyLine): number[] {
  return lineMovers(game, line).flatMap((seat, i) => (seat === line.side ? [i] : []));
}

/**
 * The line as a problem: the student plays every move of their side; the other side's replies
 * play themselves. It starts with the other side's first move when the student moves second, and
 * stops after the student's last move.
 */
export function lineProblem<S>(game: LessonGame<S>, line: StudyLine, themes: readonly string[] = []): Problem {
  const mine = studentPlies(game, line);
  const first = mine[0];
  const last = mine[mine.length - 1];
  if (first === undefined || last === undefined) throw new Error(`Line ${line.id}: the student never moves`);
  if (first > 1) throw new Error(`Line ${line.id}: the student's first move must be the first or second move`);
  const positions = linePositions(game, line);
  return {
    id: `line:${line.id}`,
    position: positions[0] as string,
    setup: first === 1 ? (line.moves[0] as string) : null,
    line: line.moves.slice(first, last + 1),
    rating: 0,
    themes: ['line', line.group, ...themes],
    title: line.name,
    note: line.idea,
  };
}

/**
 * "Play the next move": one question at a random point of a random line, with the line's idea
 * once it is answered. Either side's move may be asked, so both halves of a line are learnt.
 */
export function lineDrill<S>(id: string, game: LessonGame<S>, lines: readonly StudyLine[], words: LineWords, meta: { readonly gameId: string; readonly stage: StageId }): DrillDef {
  return {
    id,
    make(random) {
      const line = lines[Math.floor(random() * lines.length)] as StudyLine;
      const positions = linePositions(game, line);
      const movers = lineMovers(game, line);
      const ply = Math.floor(random() * line.moves.length);
      const move = line.moves[ply] as string;
      const side = words.side(movers[ply] as number);
      const step: LessonStep = {
        kind: 'askMove',
        text: ply === 0 ? `${line.name}. Play ${side}’s first move.` : `${line.name}. Play ${side}’s next move.`,
        accept: [move],
        claim: 'legal',
        success: `Right. ${line.idea}`,
      };
      return { id: `${meta.gameId}.drill.${id.replace(/^drill-/, '')}`, gameId: meta.gameId, stage: meta.stage, title: line.name, minutes: 1, start: positions[ply] as string, steps: [step] };
    },
  };
}

/** The key question for a line in a quiz: the student's last move, from the position before it. */
function quizQuestion<S>(game: LessonGame<S>, line: StudyLine, words: LineWords): CheckpointStep['questions'][number] {
  const mine = studentPlies(game, line);
  const ply = mine[mine.length - 1] as number;
  return {
    kind: 'askMove',
    position: linePositions(game, line)[ply] as string,
    text: `${line.name}: play ${words.side(line.side)}’s move.`,
    accept: [line.moves[ply] as string],
    claim: 'legal',
    success: 'Right.',
  };
}

/**
 * A lesson for a few lines of one family: each line's name and idea, the line played through, and
 * a quiz at the end asking each line's key move.
 */
export function lineLesson<S>(
  game: LessonGame<S>,
  lines: readonly StudyLine[],
  words: LineWords,
  meta: { readonly id: string; readonly gameId: string; readonly stage: StageId; readonly title: string; readonly intro: string; readonly minutes: number },
): Lesson {
  const steps: LessonStep[] = [{ kind: 'say', text: meta.intro, position: lines[0]?.start ?? '' }];
  for (const line of lines) {
    steps.push({ kind: 'say', position: line.start, text: `${line.name}. ${line.idea}` });
    steps.push({ kind: 'show', text: `${line.name}, move by move.`, moves: line.moves });
  }
  steps.push({ kind: 'checkpoint', text: 'Now from memory: each line’s key move.', questions: lines.map((l) => quizQuestion(game, l, words)) });
  return { id: meta.id, gameId: meta.gameId, stage: meta.stage, title: meta.title, minutes: meta.minutes, start: lines[0]?.start ?? '', steps };
}
