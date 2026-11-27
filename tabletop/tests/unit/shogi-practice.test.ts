import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { parseSfen } from '../../src/games/shogi/core';
import { shogiLessonGame } from '../../src/games/shogi/learn/game';
import { MateSolver } from '../../src/games/shogi/mate';
import { canonicalOf } from '../../src/games/shogi/notation';
import { castlePosition, dropCountPosition, loadShogiPractice } from '../../src/games/shogi/practice';
import type { LessonVerifier } from '../../src/teach/lint';
import { lintLesson } from '../../src/teach/lint';
import { solverPosition } from '../../src/teach/problem';
import type { ShogiState } from '../../src/games/shogi/rules';

/** Drills claim only "legal" and "mate", which the rules check; no engine is needed. */
const verifier: LessonVerifier<ShogiState> = {
  positionProblems: () => [],
  checkBest: () => Promise.resolve(['drills make no "best" claims']),
  freePlayMove: () => Promise.reject(new Error('drills have no free play')),
};

describe('shogi mate problems', () => {
  it('has at least a hundred of each length, generated and rated', async () => {
    const pack = await loadShogiPractice();
    for (const plies of [1, 3, 5]) {
      const set = pack.problems.filter((p) => p.themes.includes(`shogi-mate${plies}`));
      expect(set.length, `mate in ${plies}`).toBeGreaterThanOrEqual(100);
      expect(set.every((p) => p.line.length === plies)).toBe(true);
    }
    expect(new Set(pack.problems.map((p) => p.id)).size).toBe(pack.problems.length);
  });

  it('every problem is proved: the mate holds, nothing shorter works, and the attacker has one move at every turn', async () => {
    const pack = await loadShogiPractice();
    for (const problem of pack.problems) {
      const start = solverPosition(shogiLessonGame, problem);
      const p = parseSfen(start);
      const plies = problem.line.length;
      const solver = new MateSolver(p, 4_000_000);
      expect(solver.shortest(plies), problem.id).toBe(plies);
      const firsts = solver.mateMoves(plies).map((m) => canonicalOf(p.geo, m));
      expect(firsts, problem.id).toEqual([problem.line[0]]);
      // Against the longest defence the attacker's move is the only one that works at every turn.
      const main = solver.mainLine(plies);
      expect(main?.unique, problem.id).toBe(true);
      expect(main?.line.map((m) => canonicalOf(p.geo, m)), problem.id).toEqual(problem.line);
      // The line itself is legal and ends in checkmate.
      let state = shogiLessonGame.position(start);
      for (const [i, move] of problem.line.entries()) {
        const next = shogiLessonGame.play(state, move);
        expect(next, `${problem.id} move ${i + 1}`).not.toBeNull();
        if (i === plies - 1) expect(shogiLessonGame.goalMet('mate', state, next as ShogiState, move), problem.id).toBe(true);
        state = next as ShogiState;
      }
    }
  }, 600_000);
});

describe('shogi drills', () => {
  it('every generated drill is a lesson that lints clean', async () => {
    const pack = await loadShogiPractice();
    for (const drill of pack.drills) {
      for (let i = 0; i < 25; i++) {
        const rng = createRng(`${drill.id}/${i}`);
        const lesson = drill.make(() => rng.next());
        expect(await lintLesson(lesson, shogiLessonGame, verifier), `${drill.id} ${i}`).toEqual([]);
      }
    }
  }, 120_000);

  it('builds the four castles and counts drops on a small board', () => {
    for (const id of ['mino', 'yagura', 'anaguma', 'boat'] as const) {
      expect(() => shogiLessonGame.position(castlePosition(id, true))).not.toThrow();
      expect(() => shogiLessonGame.position(castlePosition(id, false))).not.toThrow();
    }
    const rng = createRng('drops');
    for (let i = 0; i < 20; i++) {
      const position = dropCountPosition(() => rng.next());
      const values = shogiLessonGame.computed(shogiLessonGame.position(position));
      expect(values['drops:P']).toBeGreaterThan(0);
      expect(values['drops:P']).toBeLessThan(25);
    }
  });
});
