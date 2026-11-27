// Chinese Checkers practice: every generated problem proved again by the solvers, and the drills
// ask for numbers the rules compute.
import { describe, expect, it } from 'vitest';
import { ccLessonGame } from '../../src/games/chinese-checkers/learn/game';
import { CC_DRILLS, loadCcPractice } from '../../src/games/chinese-checkers/practice';
import { hopProblem, raceProblem } from '../../src/games/chinese-checkers/practice/generate';
import type { CcState } from '../../src/games/chinese-checkers/rules';
import { actionOf, boardArray, chineseCheckers as cc, layoutOf } from '../../src/games/chinese-checkers/rules';
import { fastestFinish, longestMoves } from '../../src/games/chinese-checkers/solver';
import { startProblem, submitProblemMove } from '../../src/teach/problem';

const code = (m: number) => cc.codec.action.toJSON(actionOf(m)) as string;

describe('chinese checkers problems', () => {
  it('ships more than a hundred of each kind, all from different positions', async () => {
    const pack = await loadCcPractice();
    const hops = pack.problems.filter((p) => p.id.startsWith('cc:hop:'));
    const race = pack.problems.filter((p) => p.id.startsWith('cc:race:'));
    expect(hops.length).toBeGreaterThanOrEqual(100);
    expect(race.length).toBeGreaterThanOrEqual(100);
    expect(new Set(pack.problems.map((p) => p.position)).size).toBe(pack.problems.length);
    expect(new Set(pack.problems.map((p) => p.id)).size).toBe(pack.problems.length);
  });

  it('proves every longest hop: one move goes furthest, by a chain, and every other falls short', async () => {
    const pack = await loadCcPractice();
    for (const p of pack.problems.filter((x) => x.id.startsWith('cc:hop:'))) {
      const s = ccLessonGame.position(p.position);
      const { gain, moves, next } = longestMoves(boardArray(s.board), s.toMove, layoutOf(s), s.rules);
      expect(moves.map(code), p.id).toEqual([p.line[0]]);
      expect(gain, p.id).toBeGreaterThanOrEqual(4);
      expect(next, p.id).toBeLessThan(gain);
      expect(hopProblem(s)?.line, p.id).toBe(p.line[0]);
    }
  });

  it('proves every race endgame: the listed first moves are exactly the fastest finishes', async () => {
    const pack = await loadCcPractice();
    for (const p of pack.problems.filter((x) => x.id.startsWith('cc:race:'))) {
      const s = ccLessonGame.position(p.position);
      const finish = fastestFinish(boardArray(s.board), s.toMove, layoutOf(s), s.rules, 4);
      expect(finish, p.id).not.toBeNull();
      expect(finish?.length, p.id).toBeGreaterThanOrEqual(2);
      expect(new Set(finish?.firsts.map(code)), p.id).toEqual(new Set([p.line[0], ...(p.alsoFirst ?? [])]));
      expect(raceProblem(s)?.line, p.id).toBe(p.line[0]);
    }
  });

  it('solves a problem through the problem runner, and refuses a slower move', async () => {
    const pack = await loadCcPractice();
    const race = pack.problems.find((x) => x.id.startsWith('cc:race:') && x.themes.includes('cc-tip'));
    if (!race) throw new Error('no race problem with a tempting move');
    const solved = submitProblemMove(ccLessonGame, startProblem(race), race.line[0] as string);
    expect(solved.phase).toBe('solved');
    const s = ccLessonGame.position(race.position);
    const fast = new Set([race.line[0], ...(race.alsoFirst ?? [])]);
    const slow = ccLessonGame.moves(s).find((m) => !fast.has(m));
    if (!slow) throw new Error('no slower move');
    expect(submitProblemMove(ccLessonGame, startProblem(race), slow).phase).toBe('failed');
  });
});

describe('chinese checkers drills', () => {
  it('make exercises whose answers the rules compute, from positions with Red to move', () => {
    let seed = 7;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (const drill of CC_DRILLS) {
      for (let i = 0; i < 10; i++) {
        const lesson = drill.make(random);
        const s: CcState = ccLessonGame.position(lesson.start);
        expect(cc.turn(s), drill.id).toBe(0);
        const computed = ccLessonGame.computed(s);
        for (const step of lesson.steps) {
          if (step.kind === 'askNumber') expect(computed[step.answer], `${drill.id} ${step.answer}`).toBeTypeOf('number');
          expect(step.text, drill.id).not.toMatch(/\d/);
        }
      }
    }
  });
});
