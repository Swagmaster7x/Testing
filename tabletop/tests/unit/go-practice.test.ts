// Go practice: the generated problems are sound, their first move is the only one, and the
// counting drill asks for numbers the rules compute.
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { BLACK, WHITE } from '../../src/games/go/board';
import { goLessonGame } from '../../src/games/go/learn/game';
import { findEnclosure, lifeWinners } from '../../src/games/go/learn/verify';
import { GO_DRILLS, GO_SETS, loadGoPractice } from '../../src/games/go/practice';
import { winningCaptures } from '../../src/games/go/practice/generate';
import { boardOf, colorOf, pointName } from '../../src/games/go/rules';
import { captureSearch } from '../../src/games/go/solver';
import { inSet } from '../../src/games/practice';
import { typedNumbers } from '../../src/teach/lesson';
import type { Problem } from '../../src/teach/problem';

const pack = await loadGoPractice();

/** Every nth problem, so the slow proofs cover the whole range without taking long. */
function sample(list: readonly Problem[], n: number): Problem[] {
  const step = Math.max(1, Math.floor(list.length / n));
  return list.filter((_, i) => i % step === 0).slice(0, n);
}

describe('go practice', () => {
  it('has three problem sets of generated problems, with ids unique', () => {
    expect(GO_SETS.map((s) => s.id)).toEqual(['go-capture', 'go-ladders', 'go-life']);
    for (const set of GO_SETS) expect(pack.problems.filter((p) => inSet(p, set)).length, set.id).toBeGreaterThanOrEqual(100);
    expect(new Set(pack.problems.map((p) => p.id)).size).toBe(pack.problems.length);
  });

  it('plays every line legally, ending with the student’s move', () => {
    for (const p of pack.problems) {
      expect(p.line.length % 2, p.id).toBe(1);
      let s = goLessonGame.position(p.position);
      for (const m of p.line) {
        const next = goLessonGame.play(s, m);
        expect(next, `${p.id}: ${m}`).not.toBeNull();
        s = next as typeof s;
      }
    }
  });

  it('proves capture, ladder and net problems again: the target falls, and only the first move does it', () => {
    const fights = pack.problems.filter((p) => p.themes.includes('go-capture'));
    const nets = fights.filter((p) => p.themes.includes('go-net'));
    expect(nets.length).toBeGreaterThanOrEqual(30);
    for (const p of [...sample(fights, 16), ...sample(nets, 4)]) {
      const state = goLessonGame.position(p.position);
      const board = boardOf(state);
      const attacker = colorOf(state.toMove);
      const defender = attacker === BLACK ? WHITE : BLACK;
      // The target: the one enemy chain with two liberties that can be captured.
      const targets = [];
      for (let i = 0; i < board.cells; i++) {
        if (board.color[i] !== defender || board.head[i] !== i || board.liberties(i, 3).length !== 2) continue;
        const s = captureSearch(i, defender);
        if (s.attack(board, 25) === true) targets.push(s);
      }
      expect(targets.length, p.id).toBe(1);
      const winners = winningCaptures(board, targets[0] as ReturnType<typeof captureSearch>, 25).map((i) => pointName(board.point(i), state.size));
      expect(winners, p.id).toEqual([p.line[0]]);
    }
  }, 300_000);

  it('proves life-and-death problems again: the first move is the only one that works', () => {
    const life = pack.problems.filter((p) => p.themes.includes('go-live') || p.themes.includes('go-kill'));
    for (const p of sample(life, 16)) {
      const state = goLessonGame.position(p.position);
      const enclosure = findEnclosure(boardOf(state));
      expect(enclosure, p.id).not.toBeNull();
      if (!enclosure) continue;
      const r = lifeWinners(state, enclosure);
      expect(r.proved, p.id).toBe(true);
      expect(r.passWins, p.id).toBe(false);
      expect(r.moves.map((i) => pointName(r.board.point(i), state.size)), p.id).toEqual([p.line[0]]);
    }
  }, 300_000);

  it('makes counting drills whose answers the rules compute', () => {
    const drill = GO_DRILLS[0];
    if (!drill) throw new Error('no drill');
    for (let i = 0; i < 40; i++) {
      const rng = createRng(`count/${i}`);
      const lesson = drill.make(() => rng.next());
      const state = goLessonGame.position(lesson.start);
      const step = lesson.steps[0];
      if (step?.kind !== 'askNumber') throw new Error('not a number question');
      const value = goLessonGame.computed(state)[step.answer];
      expect(typeof value === 'number' && Number.isInteger(value), `${lesson.start} ${step.answer}`).toBe(true);
      expect(typedNumbers(step.text)).toEqual([]);
      expect(typedNumbers(step.success)).toEqual([]);
    }
  });
});
