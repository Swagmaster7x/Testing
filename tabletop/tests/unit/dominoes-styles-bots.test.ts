/** The CPU, the coach and the review in All Fives and Cuban double nine (milestone 14). */
import { describe, expect, it } from 'vitest';
import type { Json } from '../../src/core/json';
import { isJsonObject } from '../../src/core/json';
import { newRecord, withAction } from '../../src/core/record';
import { createRng } from '../../src/core/rng';
import { chooseAction, dominoesBots, heuristic, playScore, viewLegal } from '../../src/games/dominoes/bots';
import { analyseDominoesGame } from '../../src/games/dominoes/review';
import type { DominoesAction, DominoesConfig, DominoesState } from '../../src/games/dominoes/rules';
import { actionText, CUBAN, dominoes, endsCount, position, PRESETS, PUERTO_RICO_500, viewOf } from '../../src/games/dominoes/rules';
import { DRAW, endCode, fromState, moveOf, PASS, simApply, simCount, tileIndex } from '../../src/games/dominoes/sim';

const preset = (id: string): DominoesConfig => PRESETS[id] as DominoesConfig;
const NEW: DominoesConfig[] = [preset('all-fives'), preset('all-fives-three'), preset('all-fives-partners'), CUBAN, preset('cuban-300')];
const ODD: DominoesConfig[] = [
  { ...preset('all-fives'), drawLimit: 'leave-one', finish: 'hand-end', hand: 7 },
  { ...preset('all-fives-three'), mode: 'block-three', passBonus: 'on' },
  { ...preset('all-fives-partners'), blockedWinner: 'player', nextLead: 'winning-team', rounding: 'exact' },
  { ...CUBAN, set: 'double-six' },
  { ...CUBAN, blockedTie: 'more-tiles', blockedScore: 'difference', spinner: 'first-double', fives: 'on' },
  { ...PUERTO_RICO_500, set: 'double-nine', mode: 'draw-three' },
];

const code = (s: DominoesState, a: DominoesAction) => (a.type === 'pass' ? PASS : a.type === 'draw' ? DRAW : moveOf(tileIndex(a.tile, s.config.set), endCode(a.end)));
const lowest = (s: DominoesState) => [...dominoes.legal(s, s.turn)].sort((a, b) => code(s, a) - code(s, b))[0] as DominoesAction;

describe('the fast model agrees with the rules in the new styles', () => {
  it('plays every hand the same way, the count of the ends included, under every new preset and odd option', () => {
    let checked = 0;
    // A low target as well, so a hand can end the moment a play reaches it.
    const configs = [...NEW, ...ODD].flatMap((c) => [{ ...c, target: 0 }, ...(c.fives === 'on' ? [{ ...c, target: 40 }] : [])]);
    for (const [ci, config] of configs.entries()) {
      for (let g = 0; g < 10; g++) {
        let s = dominoes.setup(config, createRng(`styles-sim-${ci}-${g}`));
        const rng = createRng(`styles-moves-${ci}-${g}`);
        const steps = rng.int(20);
        for (let i = 0; i < steps && !s.over && s.handNo === 0; i++) s = dominoes.apply(s, rng.pick(dominoes.legal(s, s.turn))).state;
        if (s.over || s.handNo !== 0) continue;
        const sim = fromState(s);
        let t = s;
        while (!t.over && t.handNo === 0) {
          expect(sim.done).toBe(false);
          expect(sim.turn).toBe(t.turn);
          const a = lowest(t);
          simApply(sim, code(t, a));
          t = dominoes.apply(t, a).state;
          if (!t.over && t.handNo === 0 && config.fives === 'on') expect(simCount(sim), `config ${ci} game ${g}`).toBe(endsCount(t));
        }
        expect(sim.done).toBe(true);
        expect(sim.pts, `config ${ci} game ${g}`).toEqual(t.results[0]?.points);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(80);
  });
});

describe('the bots in the new styles', () => {
  it('play only legal moves at every level, in every new preset', () => {
    for (const level of [1, 2, 3, 4, 5, 6]) {
      for (const config of NEW) {
        let s = dominoes.setup({ ...config, target: 0 }, createRng(`styles-legal-${level}-${config.mode}-${config.set}`));
        for (let ply = 0; ply < 200 && !s.over; ply++) {
          const v = viewOf(s, s.turn);
          expect(viewLegal(v).map(actionText)).toEqual(dominoes.legal(s, s.turn).map(actionText));
          s = dominoes.apply(s, chooseAction(v, level, createRng(`b-${ply}`))).state;
        }
        expect(s.over).toBe(true);
      }
    }
  }, 240_000);

  it('take a scoring play: the 5-5 lead, and fifteen on the ends', () => {
    const fives = { ...preset('all-fives'), target: 0 };
    const hands = [
      ['1-4', '4-4', '1-2', '5-5', '1-3', '0-0', '6-6', '2-2', '3-3'],
      ['1-1', '3-4', '1-5', '0-5', '2-6', '0-6', '2-4', '4-6', '3-6'],
    ] as const;
    const lead = dominoes.codec.state.fromText(position({ hands: hands.map((h) => [...h]), config: fives, handNo: 0 }));
    for (const policy of [2, 3] as const) expect(heuristic(viewOf(lead, 0), policy, createRng('lead'))).toEqual({ type: 'play', tile: '5-5' });
    // After 1-4, 1-1, 4-4, 3-4 and 1-2 the 1-5 opens an arm; the 5-5 on it makes fifteen.
    let s = lead;
    for (const m of ['1-4', '1-1L', '4-4R', '3-4R', '1-2L', '1-5U']) s = dominoes.apply(s, dominoes.codec.action.fromText(m, s)).state;
    const v = viewOf(s, 0);
    expect(playScore(v, '5-5', 'up')).toBe(15);
    for (const level of [1, 2, 3, 5]) expect(actionText(chooseAction(v, level, createRng(`take-${level}`))), `level ${level}`).toBe('5-5U');
  });

  it('answer the coach and review an All Fives hand and a Cuban hand', async () => {
    for (const base of [preset('all-fives'), CUBAN]) {
      const config = { ...base, target: 0 };
      const seed = `styles-review-${config.set}`;
      let s = dominoes.setup(config, createRng(seed));
      const n = s.hands.length;
      let record = newRecord(dominoes, { id: 'r', config, seed, players: Array.from({ length: n }, (_, i) => (i === 0 ? { kind: 'human' as const } : { kind: 'bot' as const, level: 1 })), appVersion: 'test', training: false, now: 0 });
      for (let ply = 0; !s.over; ply++) {
        const action = chooseAction(viewOf(s, s.turn), 1, createRng(`p${ply}`));
        record = withAction(record, dominoes.codec.action.toJSON(action), ply);
        s = dominoes.apply(s, action).state;
      }
      const ask = (query: Json, state?: unknown) => {
        const st = state as DominoesState;
        return Promise.resolve(dominoesBots.advise?.({ view: viewOf(st, st.turn), seat: st.turn, query: { ...(query as object), samples: 8 }, rng: createRng('review') }) as Json);
      };
      const analysis = await analyseDominoesGame(record, ask, () => undefined, () => false);
      expect(analysis?.moves.length).toBeGreaterThan(0);
      expect(analysis?.moves.every((m) => m.seat === 0)).toBe(true);
      const start = dominoes.setup(config, createRng(`${seed}-hint`));
      const hint = (await dominoesBots.advise?.({ view: viewOf(start, start.turn), seat: start.turn, query: { type: 'hint', samples: 6 }, rng: createRng('h') })) as Json;
      expect(isJsonObject(hint) && typeof hint.action === 'string').toBe(true);
    }
  }, 120_000);
});
