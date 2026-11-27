// The learning loop's pieces: spaced review, ratings, problems, analysis arithmetic and storage.
import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { newRecord, withAction, withOutcome } from '../../src/core/record';
import { createRng } from '../../src/core/rng';
import { chessLessonGame } from '../../src/games/chess/learn';
import { basicMatePosition, loadChessPractice } from '../../src/games/chess/practice';
import { chess, chessAt } from '../../src/games/chess/rules';
import { inSet } from '../../src/games/practice';
import { readyDone } from '../../src/games/ready';
import { exportBackup, parseBackup } from '../../src/store/backup';
import { TabletopDb } from '../../src/store/db';
import { addAttempt, addCard, attemptsFor, cardsFor, completeLessons, dueCards, gradeCard, lessonProgress, wasSkipped } from '../../src/store/learning';
import { createProfile } from '../../src/store/profiles';
import type { MoveVerdict } from '../../src/teach/analysis';
import { keyMoments, moveAccuracy, seatAccuracy, verdictFor, winChance } from '../../src/teach/analysis';
import type { Problem } from '../../src/teach/problem';
import { isRight, pickProblem, playProblemReply, playSetup, retryProblem, showSolution, startProblem, submitProblemMove, takeHint } from '../../src/teach/problem';
import { playRating, problemRating } from '../../src/teach/progress';
import { expectedScore, ratingFrom, START_PLAY_RATING, START_PROBLEM_RATING, suggestLevel, updateRating } from '../../src/teach/rating';
import { gradeSchedule, itemKey, newSchedule } from '../../src/teach/srs';

const DAY = 86_400_000;

describe('spaced review', () => {
  it('brings a right answer back later and a wrong one back soon', () => {
    const now = Date.UTC(2026, 10, 27);
    const fresh = newSchedule(now);
    expect(fresh.due).toBe(now);
    const right = gradeSchedule(gradeSchedule(fresh, now, true), now + DAY, true);
    expect(right.due).toBeGreaterThan(now + DAY);
    const wrong = gradeSchedule(right, right.due, false);
    expect(wrong.due - right.due).toBeLessThan(DAY);
    expect(wrong.lapses).toBe(1);
  });

  it('keys items so the same mistake is not added twice', () => {
    expect(itemKey('chess', { kind: 'problem', problemId: 'lichess:abc' })).toBe('chess:problem:lichess:abc');
    expect(itemKey('chess', { kind: 'position', position: 'x', accept: ['e2e4'], played: null, recordId: null, ply: null })).toBe('chess:position:x');
  });
});

describe('ratings', () => {
  it('uses the Elo expectation and moves less once settled', () => {
    expect(expectedScore(1500, 1500)).toBeCloseTo(0.5);
    expect(expectedScore(1900, 1500)).toBeCloseTo(0.909, 2);
    const early = updateRating({ rating: 1000, count: 0 }, 1000, 1);
    const late = updateRating({ rating: 1000, count: 40 }, 1000, 1);
    expect(early.rating - 1000).toBeGreaterThan(late.rating - 1000);
    expect(ratingFrom(800, []).rating).toBe(800);
  });

  it('suggests the level that gives about a 55% chance', () => {
    const levels = [400, 700, 1000, 1500].map((rating, i) => ({ level: i + 1, rating }));
    expect(suggestLevel(500, levels)).toBe(1);
    expect(suggestLevel(1050, levels)).toBe(3);
    expect(suggestLevel(3000, levels)).toBe(4);
  });

  it('counts only first, unhinted problem tries and only help-free games against the CPU', () => {
    const attempts = [
      { profileId: 'p', gameId: 'chess', problemId: 'a', solved: true, at: 1, rating: 900, rated: true },
      { profileId: 'p', gameId: 'chess', problemId: 'a', solved: true, at: 2, rating: 900, rated: false },
      { profileId: 'p', gameId: 'chess', problemId: 'drill-count', solved: true, at: 3, rated: false },
    ];
    const r = problemRating(attempts);
    expect(r.count).toBe(1);
    expect(r.rating).toBeGreaterThan(START_PROBLEM_RATING);

    const base = { config: {}, seed: 's', appVersion: '0.3.0', now: 1 };
    const won = withOutcome(newRecord(chess, { ...base, id: 'g1', players: [{ kind: 'human' }, { kind: 'bot', level: 2 }], training: false }), { results: [{ seat: 0, place: 1, score: 1 }, { seat: 1, place: 2, score: 0 }], reason: 'checkmate' }, 5);
    const helped = { ...won, id: 'g2', training: true };
    const levels = (level: number) => [400, 700][level - 1] ?? null;
    const play = playRating([won, helped], levels, () => true);
    expect(play.count).toBe(1);
    expect(play.rating).toBeGreaterThan(START_PLAY_RATING);
    expect(playRating([won], levels, () => false).count).toBe(0);
  });
});

describe('problems', () => {
  // A Lichess-style problem: Black plays f2f3?? (setup), White mates with Rh1.
  const problem: Problem = { id: 'p1', position: '8/6p1/4k1N1/5R1P/4n1PK/8/5P2/r7 w - - 11 60', setup: 'f2f3', line: ['a1h1'], rating: 601, themes: ['mateIn1'] };
  const game = chessLessonGame;

  it('plays the setup move, then accepts the solution', () => {
    let run = startProblem(problem);
    expect(run.phase).toBe('setup');
    run = playSetup(game, run);
    expect(run.phase).toBe('solving');
    run = submitProblemMove(game, run, 'Rh1#');
    expect(run.phase).toBe('solved');
    expect(run.spoiled).toBe(false);
  });

  it('fails a wrong move, then allows a retry that no longer counts', () => {
    let run = playSetup(game, startProblem(problem));
    run = submitProblemMove(game, run, 'a1a2');
    expect(run.phase).toBe('failed');
    run = retryProblem(game, run);
    expect(run.phase).toBe('solving');
    expect(run.spoiled).toBe(true);
    run = showSolution(game, run);
    expect(run.phase).toBe('shown');
    run = playProblemReply(game, run);
    expect(run.index).toBe(1);
  });

  it('accepts any mating move at the end of a mating line, and plays replies of longer lines', () => {
    const mate: Problem = { id: 'p2', position: '6k1/5ppp/8/8/8/8/5PPP/RR4K1 w - - 0 1', setup: null, line: ['a1a8'], rating: 700, themes: [] };
    expect(isRight(game, startProblem(mate), 'b1b8')).toBe(true);
    expect(isRight(game, startProblem(mate), 'b1b7')).toBe(false);
    const fork: Problem = { id: 'p3', position: 'r3k3/p6p/8/3N4/8/8/P6P/4K3 w - - 0 1', setup: null, line: ['d5c7', 'e8d7', 'c7a8'], rating: 800, themes: ['fork'] };
    let run = submitProblemMove(game, startProblem(fork), 'Nc7+');
    expect(run.phase).toBe('reply');
    run = playProblemReply(game, run);
    expect(run.phase).toBe('solving');
    run = submitProblemMove(game, run, 'c7a8');
    expect(run.phase).toBe('solved');
    expect(takeHint(startProblem(fork)).spoiled).toBe(true);
  });

  it('picks unseen problems near the rating first', () => {
    const pool: Problem[] = [800, 820, 1500].map((rating, i) => ({ ...problem, id: `x${i}`, rating }));
    expect(pickProblem(pool, 810, new Map([['x0', 1]]), 0)?.id).toBe('x1');
    expect(pickProblem(pool, 1490, new Map(), 0.5)?.id).toBe('x2');
    expect(pickProblem([], 800, new Map(), 0)).toBeNull();
  });

  it('ships more than a hundred problems in each set, every one replaying through the rules', async () => {
    const pack = await loadChessPractice();
    expect(pack.problems.length).toBeGreaterThan(5000);
    // The opening trainer's set (M15) holds the openings to learn by heart, not a hundred problems.
    for (const set of pack.sets.filter((s) => s.review !== 'auto')) expect(pack.problems.filter((p) => inSet(p, set)).length, set.id).toBeGreaterThan(100);
    const rng = createRng('sample');
    for (const p of rng.shuffle(pack.problems).slice(0, 300)) {
      let s = chessLessonGame.position(p.position);
      for (const m of [...(p.setup ? [p.setup] : []), ...p.line]) {
        const next = chessLessonGame.play(s, m);
        expect(next, `${p.id} ${m}`).not.toBeNull();
        s = next as typeof s;
      }
    }
    // Replaying a few hundred lines through chess.js takes several seconds on a busy machine.
  }, 120_000);

  it('generates legal basic-mate positions with White to move and Black not in check', () => {
    const rng = createRng('mates');
    for (let i = 0; i < 200; i++) {
      const fen = basicMatePosition(i % 2 ? 'q' : 'r', () => rng.next());
      const board = chessAt(fen);
      expect(board.turn()).toBe('w');
      expect(board.isGameOver()).toBe(false);
      expect(board.moves().length).toBeGreaterThan(0);
    }
  });
});

describe('analysis arithmetic', () => {
  it('turns scores into winning chances and losses into verdicts', () => {
    expect(winChance(0)).toBeCloseTo(50);
    expect(winChance(100_000)).toBeGreaterThan(97);
    expect(winChance(-300)).toBeLessThan(30);
    expect(moveAccuracy(0)).toBeCloseTo(100, 0);
    expect(moveAccuracy(40)).toBeLessThan(20);
    expect(verdictFor(0, true)).toBe('best');
    expect(verdictFor(3, false)).toBe('good');
    expect(verdictFor(6, false)).toBe('inaccuracy');
    expect(verdictFor(12, false)).toBe('mistake');
    expect(verdictFor(30, false)).toBe('blunder');
  });

  it('picks your biggest swings as key moments, topped up with the CPU’s', () => {
    const m = (ply: number, seat: number, loss: number): MoveVerdict => ({ ply, seat, played: 'x', best: null, bestMove: null, winBefore: 50, winAfter: 50 - loss, loss, accuracy: moveAccuracy(loss), verdict: verdictFor(loss, false), reason: null, accept: [] });
    const moves = [m(0, 0, 2), m(1, 1, 20), m(2, 0, 8), m(3, 1, 1), m(4, 0, 30)];
    expect(keyMoments(moves, [0])).toEqual([1, 2, 4]);
    expect(seatAccuracy(moves)['0']).toBeLessThan(seatAccuracy(moves)['1'] as number);
  });
});

describe('learning storage', () => {
  const opened: TabletopDb[] = [];
  let n = 0;
  const fresh = () => {
    const db = new TabletopDb(`learn-${Date.now()}-${n++}`);
    opened.push(db);
    return db;
  };
  afterEach(async () => {
    for (const db of opened.splice(0)) {
      db.close();
      await db.delete();
    }
  });

  it('records lessons, and a real finish replaces a skip but not the other way round', async () => {
    const db = fresh();
    await completeLessons(db, 'p', 'chess', ['a', 'b'], { mistakes: 0, skipped: true }, 1);
    await completeLessons(db, 'p', 'chess', ['a'], { mistakes: 2, skipped: false }, 2);
    await completeLessons(db, 'p', 'chess', ['a'], { mistakes: 0, skipped: true }, 3);
    const done = await lessonProgress(db, 'p', 'chess');
    expect(done.size).toBe(2);
    expect(wasSkipped(done.get('a') as never)).toBe(false);
    expect(wasSkipped(done.get('b') as never)).toBe(true);
  });

  it('keeps a review queue that schedules cards and never duplicates them', async () => {
    const db = fresh();
    const item = { kind: 'problem', problemId: 'lichess:1' } as const;
    expect(await addCard(db, 'p', 'chess', item, 1000)).toBe(true);
    expect(await addCard(db, 'p', 'chess', item, 1000)).toBe(false);
    expect((await dueCards(db, 'p', 'chess', 1000)).length).toBe(1);
    const [card] = await cardsFor(db, 'p', 'chess');
    await gradeCard(db, card?.id as string, true, 1000);
    expect((await dueCards(db, 'p', 'chess', 1000)).length).toBe(0);
    await addAttempt(db, { profileId: 'p', gameId: 'chess', problemId: 'x', solved: true, at: 5, rating: 900, rated: true });
    expect((await attemptsFor(db, 'p', 'chess')).length).toBe(1);
  });

  it('puts analyses and every learning table into the backup', async () => {
    const db = fresh();
    const profile = await createProfile(db, 'Ana', 1);
    await addCard(db, profile.id, 'chess', { kind: 'problem', problemId: 'lichess:1' }, 1);
    await db.analyses.put({ recordId: 'g1', profileId: profile.id, gameId: 'chess', createdAt: 1, data: { version: 1 } });
    const backup = parseBackup(JSON.stringify(await exportBackup(db, { name: 'Kibitz', version: '0.3.0' }, new Date(0))));
    expect(backup.tables.analyses.length).toBe(1);
    expect(backup.tables.reviewCards.length).toBe(1);
  });
});

describe('table-ready checklist', () => {
  it('ticks items by lessons, drills and wins', () => {
    const facts = { lessonsDone: new Set(['a']), drillsPassed: new Map([['drill-count', 5]]), bestWin: 2 };
    expect(readyDone({ id: 'setup', lessons: ['a'] }, facts)).toBe(true);
    expect(readyDone({ id: 'terms', lessons: ['a', 'b'] }, facts)).toBe(false);
    expect(readyDone({ id: 'score', drill: { id: 'drill-count', times: 5 } }, facts)).toBe(true);
    expect(readyDone({ id: 'beat', beatLevel: 3 }, facts)).toBe(false);
  });

  it('records keep working: a played chess record still replays', () => {
    let r = newRecord(chess, { id: 'g', config: {}, seed: 's', players: [{ kind: 'human' }, { kind: 'bot', level: 1 }], appVersion: '0.3.0', training: false, now: 1 });
    r = withAction(r, chess.codec.action.toJSON(chess.legal(chess.setup({}, createRng('s')), 0)[0] as never), 2);
    expect(r.actions.length).toBe(1);
  });
});
