/** Dominoes practice, drills, coach answers and review, run in-process. */
import { describe, expect, it } from 'vitest';
import type { Json } from '../../src/core/json';
import { isJsonObject } from '../../src/core/json';
import { newRecord, withAction } from '../../src/core/record';
import { createRng } from '../../src/core/rng';
import { chooseAction, dominoesBots } from '../../src/games/dominoes/bots';
import { dominoesComputed, dominoesLessonGame } from '../../src/games/dominoes/learn/game';
import { loadDominoesPractice } from '../../src/games/dominoes/practice';
import { analyseDominoesGame } from '../../src/games/dominoes/review';
import type { DominoesState } from '../../src/games/dominoes/rules';
import { actionText, dominoes, PUERTO_RICO_500, sideOf, viewOf } from '../../src/games/dominoes/rules';
import { cloneSim, fromState, moveOf, simApply, solveMargin, tileIndex } from '../../src/games/dominoes/sim';

describe('practice problems', () => {
  it('ships more than a hundred endgames, every line legal, every first play the best by exact search', async () => {
    const pack = await loadDominoesPractice();
    expect(pack.problems.length).toBeGreaterThan(100);
    for (const p of pack.problems) {
      let s = dominoesLessonGame.position(p.position);
      for (const m of p.line) {
        const next = dominoesLessonGame.play(s, m);
        expect(next, `${p.id} ${m}`).not.toBeNull();
        s = next as DominoesState;
      }
    }
    // Spot-check the proof: the first play beats every other by the generator's margin.
    for (const p of pack.problems.filter((_, i) => i % 10 === 0)) {
      const s = dominoesLessonGame.position(p.position);
      const side = sideOf(s.turn, 4);
      const sim = fromState(s);
      const values = dominoes.legal(s, s.turn).map((a) => {
        const child = cloneSim(sim);
        simApply(child, a.type === 'play' ? moveOf(tileIndex(a.tile), a.end === 'right') : -1);
        return { move: actionText(a), value: solveMargin(child, side) };
      });
      const best = values.find((v) => v.move === p.line[0]);
      for (const v of values) if (v.move !== p.line[0]) expect((best?.value ?? 0) - v.value, `${p.id}`).toBeGreaterThanOrEqual(6);
    }
  });

  it('every drill makes a sound exercise from a real position', async () => {
    const pack = await loadDominoesPractice();
    let seed = 1;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (const drill of pack.drills) {
      for (let i = 0; i < 12; i++) {
        const lesson = drill.make(random);
        const s = dominoesLessonGame.position(lesson.start);
        expect(dominoes.turn(s)).toBe(0);
        const computed = dominoesComputed(s);
        for (const step of lesson.steps) {
          if (step.kind === 'askNumber') expect(computed[step.answer], `${drill.id} ${step.answer}`).toBeTypeOf('number');
          if (step.kind === 'askChoice') expect(step.options.filter((o) => o.correct).length, drill.id).toBe(1);
          expect(step.text, drill.id).not.toMatch(/\{(?![\w:.-]+\})/);
        }
      }
    }
  });
});

describe('the coach and the review', () => {
  it('answers hints and analyses from the view', async () => {
    const s = dominoes.setup({ ...PUERTO_RICO_500, target: 0 }, createRng('coach'));
    const after = dominoes.apply(s, dominoes.legal(s, s.turn)[0] as never).state;
    const view = viewOf(after, after.turn);
    const hint = (await dominoesBots.advise?.({ view, seat: after.turn, query: { type: 'hint', samples: 12 }, rng: createRng('h') })) as Json;
    expect(isJsonObject(hint) && typeof hint.action === 'string').toBe(true);
    const analysis = (await dominoesBots.advise?.({ view, seat: after.turn, query: { type: 'analyse', samples: 12 }, rng: createRng('a') })) as Json;
    expect(isJsonObject(analysis) && Array.isArray(analysis.moves) && analysis.moves.length === dominoes.legal(after, after.turn).length).toBe(true);
  });

  it('reviews a whole hand with key moments', async () => {
    const config = { ...PUERTO_RICO_500, target: 0 };
    const seed = 'review-hand';
    let s = dominoes.setup(config, createRng(seed));
    let record = newRecord(dominoes, { id: 'r', config, seed, players: [{ kind: 'human' }, { kind: 'bot', level: 1 }, { kind: 'bot', level: 1 }, { kind: 'bot', level: 1 }], appVersion: 'test', training: false, now: 0 });
    for (let ply = 0; !s.over; ply++) {
      // The "person" plays like level 1 here, so there are mistakes to find.
      const action = chooseAction(viewOf(s, s.turn), 1, createRng(`p${ply}`));
      record = withAction(record, dominoes.codec.action.toJSON(action), ply);
      s = dominoes.apply(s, action).state;
    }
    const ask = (query: Json, state?: unknown) => {
      const st = state as DominoesState;
      return Promise.resolve(dominoesBots.advise?.({ view: viewOf(st, st.turn), seat: st.turn, query: { ...(query as object), samples: 16 }, rng: createRng('review') }) as Json);
    };
    const analysis = await analyseDominoesGame(record, ask, () => undefined, () => false);
    expect(analysis).not.toBeNull();
    expect(analysis?.moves.every((m) => m.seat === 0)).toBe(true);
    expect(analysis?.keyMoments.length).toBeGreaterThan(0);
  }, 60_000);
});
