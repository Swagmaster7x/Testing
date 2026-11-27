// The lesson runner and the lesson linter, on chess lessons (PLAN.md 2.5).
import { describe, expect, it } from 'vitest';
import { CHESS_LESSONS, chessLessonGame } from '../../src/games/chess/learn';
import { chessPositionProblems } from '../../src/games/chess/learn/verify';
import type { ChessState } from '../../src/games/chess/rules';
import type { Lesson } from '../../src/teach/lesson';
import { fillText, typedNumbers } from '../../src/teach/lesson';
import type { LessonVerifier } from '../../src/teach/lint';
import { autoPlay, lintLesson } from '../../src/teach/lint';
import { canAdvance, chooseOption, next, reveal, startLesson, submitMove, submitNumber } from '../../src/teach/runner';
import { stageCheck } from '../../src/teach/stage-check';

const game = chessLessonGame;

/** A verifier with no engine: every "best" claim passes, free play plays the first legal move. */
const noEngine: LessonVerifier<ChessState> = {
  positionProblems: (s) => chessPositionProblems(s.fen),
  checkBest: () => Promise.resolve([]),
  freePlayMove: (s) => Promise.resolve(game.moves(s)[0] ?? ''),
};

const lesson = (steps: Lesson['steps'], start = '4k3/8/8/8/8/8/8/R3K3 w - - 0 1'): Lesson => ({ id: 'chess.test.lesson', gameId: 'chess', stage: 'stage-1', title: 'Test', minutes: 2, start, steps });

describe('lesson text', () => {
  it('allows digits only in notation and placeholders', () => {
    expect(typedNumbers('Play Nf3, then e4 and O-O. A pawn is {value:p}.')).toEqual([]);
    expect(typedNumbers('Qxd8+ wins, and so does e8=Q#.')).toEqual([]);
    expect(typedNumbers('A rook is worth 5 points.')).toEqual(['5']);
    expect(typedNumbers('You have 30 moves')).toEqual(['30']);
  });

  it('fills placeholders and leaves unknown ones for the linter', () => {
    expect(fillText('a {value:r} and a {nope}', { 'value:r': 5 })).toBe('a 5 and a {nope}');
  });
});

describe('lesson runner', () => {
  const steps: Lesson['steps'] = [
    { kind: 'say', text: 'Hello.' },
    { kind: 'askMove', text: 'Check the king.', accept: ['a1a8'], wrong: { a1a7: 'Not check.' }, claim: 'legal', success: 'Check!', reply: 'e8e7' },
    { kind: 'askNumber', text: 'How many points is a rook?', answer: 'value:r', success: 'Yes, {value:r}.' },
    { kind: 'askChoice', text: 'Pick', options: [{ text: 'Wrong', why: 'No.' }, { text: 'Right', correct: true }] },
  ];

  it('walks through steps, judging answers and playing the reply', () => {
    let s = startLesson(lesson(steps));
    expect(canAdvance(s)).toBe(true);
    s = next(game, s);
    expect(s.step).toBe(1);
    expect(canAdvance(s)).toBe(false);
    s = submitMove(game, s, 'a1a7');
    expect(s.phase).toBe('wrong');
    expect(s.feedback).toBe('Not check.');
    expect(s.mistakes).toBe(1);
    s = submitMove(game, s, 'Ra8+');
    expect(s.phase).toBe('correct');
    expect(s.pendingReply).toBe('e8e7');
    s = next(game, s);
    expect(s.step).toBe(2);
    expect(s.position.startsWith('R7/4k3/')).toBe(true);
    s = submitNumber(game, s, 4);
    expect(s.phase).toBe('wrong');
    s = submitNumber(game, s, 5);
    expect(s.feedback).toBe('Yes, 5.');
    s = next(game, s);
    s = chooseOption(game, s, 0);
    expect(s.feedback).toBe('No.');
    s = chooseOption(game, s, 1);
    expect(s.phase).toBe('correct');
    s = next(game, s);
    expect(s.phase).toBe('done');
    expect(s.mistakes).toBe(3);
  });

  it('ignores illegal moves and plays the reply after a revealed answer', () => {
    let s = next(game, startLesson(lesson(steps)));
    const before = s;
    s = submitMove(game, s, 'a1h8');
    expect(s).toBe(before);
    s = reveal(game, s);
    expect(s.phase).toBe('revealed');
    expect(s.pendingReply).toBe('e8e7');
    s = next(game, s);
    expect(s.position.startsWith('R7/4k3/')).toBe(true);
  });

  it('scores a checkpoint, one try per question', () => {
    let s = startLesson(
      lesson([
        {
          kind: 'checkpoint',
          text: 'Quiz',
          questions: [
            { kind: 'askNumber', text: 'Rook?', answer: 'value:r', success: 'Yes.' },
            { kind: 'askMove', position: '4k3/8/8/8/8/8/8/Q3K3 w - - 0 1', text: 'Check.', accept: ['a1a8'], claim: 'legal', success: 'Yes.' },
          ],
        },
      ]),
    );
    s = submitNumber(game, s, 3);
    expect(s.question).toBe(1);
    expect(s.position.startsWith('4k3/8/8/8/8/8/8/Q3K3')).toBe(true);
    s = submitMove(game, s, 'a1a8');
    expect(s.right).toBe(1);
    expect(canAdvance(s)).toBe(true);
  });
});

describe('lesson linter', () => {
  it('passes a good lesson and the auto-player finishes it both ways', async () => {
    const good = lesson([
      { kind: 'say', text: 'A rook is worth {value:r}.' },
      { kind: 'askMove', text: 'Check.', accept: ['a1a8'], claim: 'legal', success: 'Good.', reply: 'e8e7' },
      { kind: 'askMove', text: 'Again.', accept: ['a8a7'], claim: 'legal', success: 'Good.' },
    ]);
    expect(await lintLesson(good, game, noEngine)).toEqual([]);
    expect(await autoPlay(good, game, noEngine, 'shown')).toBeNull();
  });

  it('catches typed numbers, unknown placeholders, illegal answers and false claims', async () => {
    const bad = lesson([
      { kind: 'say', text: 'A rook is worth 5, a {nothing}.' },
      { kind: 'askMove', text: 'Move.', accept: ['a1a8', 'a1b2'], claim: 'mate', success: 'Mate.' },
    ]);
    const problems = await lintLesson(bad, game, noEngine);
    expect(problems.some((p) => p.includes('typed number'))).toBe(true);
    expect(problems.some((p) => p.includes('unknown placeholder {nothing}'))).toBe(true);
    expect(problems.some((p) => p.includes('a1b2 is not legal'))).toBe(true);
  });

  it('checks "mate" and "only" claims with the rules', async () => {
    const claims = lesson([
      { kind: 'askMove', text: 'Mate?', accept: ['a1a8'], claim: 'mate', success: 'x' },
      { kind: 'askMove', position: '4k3/8/8/8/8/8/8/R3K3 w - - 0 1', text: 'Only?', accept: ['a1a8'], claim: 'only', success: 'x' },
    ]);
    const problems = await lintLesson(claims, game, noEngine);
    expect(problems.some((p) => p.includes('a1a8 is not checkmate'))).toBe(true);
    expect(problems.some((p) => p.includes('claim "only"'))).toBe(true);
  });

  it('rejects positions where the side not to move is in check', async () => {
    const problems = await lintLesson(lesson([{ kind: 'askMove', text: 'x', accept: ['e8d7'], claim: 'legal', success: 'x' }], '4k3/8/8/8/8/8/8/4K2R b - - 0 1'), game, noEngine);
    expect(problems).toEqual([]);
    expect(chessPositionProblems('4k3/8/8/8/8/8/8/4R1K1 w - - 0 1')).toContain('the side not to move is in check');
    expect(chessPositionProblems('4k3/8/8/8/8/8/8/4K2R w Q - 0 1')[0]).toMatch(/castling right Q/);
  });

  it('builds a stage check from real lesson questions that the auto-player passes', async () => {
    const check = stageCheck(CHESS_LESSONS, game, 'chess', 'stage-1');
    expect(check.steps[0]?.kind).toBe('checkpoint');
    expect(await lintLesson(check, game, noEngine)).toEqual([]);
  });
});
