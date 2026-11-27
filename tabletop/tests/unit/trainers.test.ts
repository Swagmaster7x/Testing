// M15 trainers: the chess openings, the shogi castles and the Go joseki, as data, lessons, drills
// and spaced-review problems (src/teach/lines.ts).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { chessLessonGame } from '../../src/games/chess/learn';
import { OPENING_LESSON_IDS, openingLessons } from '../../src/games/chess/learn/openings';
import { chessOpenings } from '../../src/games/chess/openings';
import { CHESS_SETS, openingProblems } from '../../src/games/chess/practice';
import { chessAt, START_FEN } from '../../src/games/chess/rules';
import { parsePoint } from '../../src/games/go/coords';
import { josekiLines } from '../../src/games/go/joseki';
import { goLessonGame } from '../../src/games/go/learn';
import { josekiLessons } from '../../src/games/go/learn/joseki';
import { readNetwork } from '../../src/games/go/net';
import { forward } from '../../src/games/go/net/forward';
import { netInputs } from '../../src/games/go/net/inputs';
import { GO_DRILLS, josekiProblems } from '../../src/games/go/practice';
import { go, makeConfig } from '../../src/games/go/rules';
import type { DrillDef } from '../../src/games/practice';
import { inSet } from '../../src/games/practice';
import { CASTLES } from '../../src/games/shogi/castles';
import { colorOfCode, parseSfen, SFEN_LETTER, squareIndex, typeOfCode } from '../../src/games/shogi/core';
import { shogiLessonGame } from '../../src/games/shogi/learn';
import { castleLessons } from '../../src/games/shogi/learn/castles';
import { castleProblems, loadShogiPractice } from '../../src/games/shogi/practice';
import { typedNumbers } from '../../src/teach/lesson';
import type { StudyLine } from '../../src/teach/lines';
import { linePositions, lineProblem, studentPlies } from '../../src/teach/lines';
import type { Problem } from '../../src/teach/problem';
import { playProblemReply, playSetup, startProblem, submitProblemMove } from '../../src/teach/problem';
import type { LessonGame } from '../../src/teach/runner';
import { next, startLesson, submitMove } from '../../src/teach/runner';

/** Solves a line problem by playing its moves, as a student who knows it. */
function solve<S>(game: LessonGame<S>, problem: Problem): string {
  let run = playSetup(game, startProblem(problem));
  for (let guard = 0; guard < 200 && (run.phase === 'solving' || run.phase === 'reply'); guard++) {
    run = run.phase === 'reply' ? playProblemReply(game, run) : submitProblemMove(game, run, problem.line[run.index] ?? '');
  }
  return run.phase;
}

/** Runs a drill's lesson with the right answer. */
function drillPasses<S>(game: LessonGame<S>, drill: DrillDef, seed: string): boolean {
  const rng = createRng(seed);
  const lesson = drill.make(() => rng.next());
  let s = startLesson(lesson);
  const step = lesson.steps[0];
  if (step?.kind !== 'askMove') return false;
  if (!game.canonical(game.position(lesson.start), step.accept[0] ?? '')) return false;
  s = submitMove(game, s, step.accept[0] ?? '');
  if (s.phase !== 'correct') return false;
  return next(game, s).phase === 'done';
}

function checkLines<S>(game: LessonGame<S>, lines: readonly StudyLine[], strip?: (text: string) => string) {
  expect(new Set(lines.map((l) => l.id)).size).toBe(lines.length);
  expect(new Set(lines.map((l) => l.name)).size).toBe(lines.length);
  for (const line of lines) {
    // Every move is legal from the start, and the student's side has the last word.
    expect(() => linePositions(game, line), line.id).not.toThrow();
    const mine = studentPlies(game, line);
    expect(mine.length, line.id).toBeGreaterThan(0);
    expect(line.idea.endsWith('.'), line.id).toBe(true);
    expect(typedNumbers(`${line.name} ${line.idea}`, strip), line.id).toEqual([]);
  }
}

describe('the chess opening trainer', () => {
  const openings = chessOpenings();

  it('has thirty-one openings, every move legal in chess.js and every name unique', () => {
    expect(openings).toHaveLength(31);
    checkLines(chessLessonGame, openings);
    for (const o of openings) {
      const board = chessAt(START_FEN);
      for (const san of o.san) expect(() => board.move(san), `${o.id} ${san}`).not.toThrow();
      expect(o.moves).toHaveLength(o.san.length);
      // The opening ends with the move of the side whose choice it is.
      expect(studentPlies(chessLessonGame, o).at(-1), o.id).toBe(o.moves.length - 1);
    }
  });

  it('teaches every opening in exactly one stage-4 lesson', () => {
    const taught = OPENING_LESSON_IDS.flat();
    expect([...taught].sort()).toEqual(openings.map((o) => o.id).sort());
    const lessons = openingLessons();
    expect(lessons).toHaveLength(10);
    for (const l of lessons) expect(l.stage).toBe('stage-4');
  });

  it('makes a problem of each opening that a student who knows it solves, in the unrated, self-reviewing set', () => {
    const set = CHESS_SETS.find((s) => s.id === 'openings');
    expect(set).toMatchObject({ review: 'auto', rated: false });
    const problems = openingProblems();
    expect(problems).toHaveLength(31);
    for (const p of problems) {
      expect(inSet(p, set!)).toBe(true);
      expect(p.title).toBeTruthy();
      expect(solve(chessLessonGame, p), p.id).toBe('solved');
    }
    // A Black defence starts with White's first move played for the student.
    const sicilian = problems.find((p) => p.id === 'line:sicilian');
    expect(sicilian).toMatchObject({ setup: 'e2e4', line: ['c7c5'] });
  });
});

describe('the shogi castle trainer', () => {
  it('builds nine castles legally, each ending in its shape', () => {
    expect(CASTLES).toHaveLength(9);
    checkLines(shogiLessonGame, CASTLES, shogiLessonGame.stripNotation?.bind(shogiLessonGame));
    for (const c of CASTLES) {
      const p = parseSfen(linePositions(shogiLessonGame, c).at(-1) ?? '');
      for (const piece of c.shape) {
        const code = p.board[squareIndex(p.geo, Number(piece[1]), Number(piece[2]))] ?? 0;
        expect(code !== 0 && colorOfCode(code) === 0 && SFEN_LETTER[typeOfCode(code)] === piece[0], `${c.id}: ${piece}`).toBe(true);
      }
    }
    expect(CASTLES.map((c) => c.id)).toEqual(expect.arrayContaining(['yagura', 'mino', 'ranging-anaguma', 'static-anaguma', 'boat']));
  });

  it('has lessons, a drill and problems for the castles', async () => {
    expect(castleLessons().flatMap((l) => l.steps.filter((s) => s.kind === 'show'))).toHaveLength(9);
    for (const p of castleProblems()) expect(solve(shogiLessonGame, p), p.id).toBe('solved');
    const pack = await loadShogiPractice();
    const drill = pack.drills.find((d) => d.id === 'drill-shogi-build');
    expect(drill).toBeDefined();
    for (let i = 0; i < 60; i++) expect(drillPasses(shogiLessonGame, drill!, `castle-${i}`)).toBe(true);
    expect(pack.sets.find((s) => s.id === 'shogi-castles')).toMatchObject({ review: 'auto', rated: false });
  });
});

describe('Go joseki basics', () => {
  const file = readFileSync(join(import.meta.dirname, '../../assets/katago/g170-b6c96-f16.bin'));
  const net = readNetwork(new Uint8Array(file.buffer, file.byteOffset, file.byteLength));

  it('plays five joseki legally on the full board', () => {
    const lines = josekiLines();
    expect(lines).toHaveLength(5);
    checkLines(goLessonGame, lines);
    expect(lines.map((l) => l.group)).toEqual(expect.arrayContaining(['4-4', '3-4']));
  });

  it('every answer is among the network’s top three in that corner, with the other corners taken', { timeout: 120_000 }, () => {
    const corner = (p: number) => p % 19 >= 7 && Math.floor(p / 19) <= 11;
    for (const j of josekiLines()) {
      let state = go.setup(makeConfig(19, 'japanese'), createRng('j'));
      const recent: number[] = [];
      const play = (name: string) => {
        const action = go.legal(state, go.turn(state) ?? 0).find((a) => a.type === 'play' && a.name === name);
        if (!action) throw new Error(`${j.id}: ${name} is not legal`);
        state = go.apply(state, action).state;
        recent.push(parsePoint(name, 19) ?? -1);
      };
      for (const name of ['Q4', 'D16', 'D4', 'C16']) play(name);
      j.points.forEach((name, i) => {
        // The first two moves set the corner up (the corner stone and the approach or invasion).
        if (i >= 2) {
          const { spatial, global } = netInputs({ size: 19, board: state.board, toMove: state.toMove === 0 ? 'X' : 'O', ko: state.ko, recent, komi: 6.5, preset: 'japanese' });
          const policy = forward(net, 19, spatial, global).policy;
          const local = [...Array(361).keys()].filter((p) => state.board[p] === '.' && corner(p)).sort((a, b) => policy[b]! - policy[a]!);
          expect(local.indexOf(parsePoint(name, 19) ?? -1), `${j.id}: ${name}`).toBeLessThan(3);
        }
        play(name);
      });
    }
  });

  it('has lessons, a drill and problems for the joseki', () => {
    expect(josekiLessons()).toHaveLength(2);
    for (const p of josekiProblems()) expect(solve(goLessonGame, p), p.id).toBe('solved');
    const drill = GO_DRILLS.find((d) => d.id === 'drill-go-joseki');
    expect(drill).toBeDefined();
    for (let i = 0; i < 40; i++) expect(drillPasses(goLessonGame, drill!, `joseki-${i}`)).toBe(true);
  });
});

describe('a line problem', () => {
  it('refuses a line where the student never moves', () => {
    const line: StudyLine = { id: 'x', name: 'X', idea: 'Nothing.', start: START_FEN, moves: ['e2e4'], side: 1, group: 'g' };
    expect(() => lineProblem(chessLessonGame, line)).toThrow(/never moves/);
  });
});
