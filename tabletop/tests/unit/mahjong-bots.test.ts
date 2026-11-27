/**
 * The mahjong CPU: every level plays legal moves in every preset and finishes games; each takes a
 * win when it can; the weaker levels keep their human habits and the stronger ones their
 * knowledge; the coach's answers are well formed; and the top level is quick enough for a phone.
 */
import { describe, expect, it } from 'vitest';
import { findLegal } from '../../src/core/contract';
import { createRng } from '../../src/core/rng';
import { decide, LEVEL_PARAMS, MAHJONG_LEVELS, mahjongBots, playStyleOf } from '../../src/games/mahjong/bots';
import type { MahjongConfig, MahjongState } from '../../src/games/mahjong/rules';
import { actionText, mahjong, position, viewOf } from '../../src/games/mahjong/rules';
import { HK_DEFAULTS, HK_PRESETS } from '../../src/games/mahjong/styles/hong-kong';
import { RIICHI_PRESETS } from '../../src/games/mahjong/styles/riichi';
import { evaluateDiscards, expectedPoints, picture, readThreats, safetyRanking, winChance } from '../../src/games/mahjong/strategy';
import { isJsonObject } from '../../src/core/json';

const one = (options: Record<string, string | number>): MahjongConfig => ({ style: 'hong-kong', options: { ...options, length: 'hand' } });

function playOut(config: MahjongConfig, level: number, seed: string): MahjongState {
  let s = mahjong.setup(config, createRng(seed));
  for (let ply = 1; ply < 3000 && !s.over; ply++) {
    const d = decide(viewOf(s, s.turn), level, createRng(`${seed}/${ply}`));
    const legal = findLegal(mahjong, s, s.turn, d.action);
    if (!legal) throw new Error(`level ${level} chose ${actionText(d.action)}, which is not legal`);
    s = mahjong.apply(s, legal).state;
  }
  return s;
}

describe('the mahjong CPU', () => {
  it('has five levels, each with its parameters', () => {
    expect(MAHJONG_LEVELS.map((l) => l.level)).toEqual([1, 2, 3, 4, 5]);
    for (const l of MAHJONG_LEVELS) expect(LEVEL_PARAMS[l.level]).toBeDefined();
  });

  it('plays only legal moves and finishes the hand, at every level, under every preset', () => {
    for (const level of [1, 2, 3, 4, 5]) {
      HK_PRESETS.forEach((preset, i) => {
        const s = playOut(one(preset.options), level, `legal-${level}-${i}`);
        expect(s.over).toBe(true);
      });
    }
  }, 120_000);

  it('takes a win whenever it is offered', () => {
    const s0 = position({ options: { flowers: 'off', minFaan: 1 }, turn: 0, hands: ['111m 999m 111p 999p 4s Gd', '', '', '123m 456m 789m RdRdRd 4s'], drawn: 'Gd' });
    const s = mahjong.apply(s0, { type: 'discard', tile: 18 + 3 }).state;
    expect(s.turn).toBe(3);
    for (const level of [1, 2, 3, 4, 5]) {
      const d = decide(viewOf(s, 3), level, createRng('w'));
      expect(d.action.type).toBe('win');
      expect(d.tags).toContain('mj-win');
    }
  });

  it('a beginner calls every chow that brings the hand closer; a level that knows the minimum declines one that kills the hand', () => {
    // Seat 1 can chow 4s into 3-4-5: closer to ready, but the hand has nothing to score with three faan needed.
    const s0 = position({ options: { flowers: 'off', minFaan: 3 }, turn: 0, hands: ['111p 999p EEE SSS 4s Gd', '35s 1m 2m 4m 7p 8p 2s 6s Wd 9m N N', '', ''], drawn: 'Gd' });
    const s = mahjong.apply(s0, { type: 'discard', tile: 21 }).state;
    expect(s.turn).toBe(1);
    const options = mahjong.legal(s, 1).map(actionText);
    expect(options).toContain('chow 3s');
    expect(decide(viewOf(s, 1), 2, createRng('c')).action.type).toBe('chow');
    expect(decide(viewOf(s, 1), 4, createRng('c')).action.type).toBe('pass');
  });

  it('a beginner holds on to honours; the stronger levels let a lone honour go first', () => {
    // A lone North and a lone 5 of bamboo: either throw keeps the hand as close to ready.
    const s = position({ options: { flowers: 'off' }, turn: 0, hands: ['123m 456m 13p 57p 99s 5s N', '', '', ''], drawn: 'N' });
    const strong = decide(viewOf(s, 0), 4, createRng('h'));
    expect(actionText(strong.action)).toBe('N');
    expect(strong.tags).toContain('mj-isolated');
    expect(actionText(decide(viewOf(s, 0), 5, createRng('h')).action)).toBe('N');
    expect(actionText(decide(viewOf(s, 0), 2, createRng('h2')).action)).toBe('5s');
  });

  it('gives each CPU seat a style of play from the table number', () => {
    expect([0, 1, 2].map((t) => playStyleOf(t, 1))).toEqual(['balanced', 'defender', 'attacker']);
  });

  it('answers the coach: tiles from ready, safety and the review', () => {
    const s = mahjong.setup(one(HK_DEFAULTS), createRng('coach'));
    const v = viewOf(s, s.turn);
    const eff = mahjongBots.advise?.({ view: v, seat: s.turn, query: { type: 'efficiency' }, rng: createRng('a') });
    expect(isJsonObject(eff) && Array.isArray(eff.discards) && typeof eff.shanten === 'number').toBe(true);
    const safety = mahjongBots.advise?.({ view: v, seat: s.turn, query: { type: 'safety' }, rng: createRng('a') });
    expect(isJsonObject(safety) && Array.isArray(safety.threats) && safety.threats.length === 3).toBe(true);
    const review = mahjongBots.advise?.({ view: v, seat: s.turn, query: { type: 'analyse' }, rng: createRng('a') });
    expect(isJsonObject(review) && Array.isArray(review.moves) && typeof review.best === 'string').toBe(true);
    const hint = mahjongBots.advise?.({ view: v, seat: s.turn, query: { type: 'hint' }, rng: createRng('a') });
    expect(isJsonObject(hint) && typeof hint.action === 'string').toBe(true);
  });

  it('ranks a tile all of whose copies it can see as safe, and judges speed and worth', () => {
    const s = position({ options: { flowers: 'off' }, turn: 0, hands: ['123m 456m 13p 57p 9s 1s E', '', '', ''], discards: ['', 'EE', 'E', ''], drawn: 'E' });
    const p = picture(viewOf(s, 0));
    const ranking = safetyRanking(p, readThreats(p.view));
    expect(ranking[0]?.kind).toBe(27);
    expect(winChance(0, 0, 8, 80, 8)).toBeGreaterThan(winChance(1, 20, null, 80, 8));
    expect(winChance(1, 20, null, 80, 8)).toBeGreaterThan(winChance(2, 20, null, 80, 8));
    const evals = evaluateDiscards(p);
    expect(evals.every((e) => expectedPoints(p, e) >= 0)).toBe(true);
  });

  it('the top level decides quickly enough for a phone', () => {
    let state = mahjong.setup(one(HK_DEFAULTS), createRng('speed'));
    let worst = 0;
    for (let ply = 1; ply < 120 && !state.over; ply++) {
      const started = performance.now();
      const d = decide(viewOf(state, state.turn), 5, createRng(`s${ply}`));
      worst = Math.max(worst, performance.now() - started);
      state = mahjong.apply(state, d.action).state;
    }
    // A phone is perhaps four times slower than this machine; three seconds is the plan's bound.
    expect(worst).toBeLessThan(700);
  }, 120_000);
});

describe('the mahjong CPU at a Riichi table', () => {
  const R = { length: 'hand' };
  const riichiOne = (options: Record<string, string | number>): MahjongConfig => ({ style: 'riichi', options: { ...options, length: 'hand' } });

  it('plays only legal moves and finishes the hand, at every level, under every Riichi preset', () => {
    for (const level of [1, 2, 3, 4, 5]) {
      RIICHI_PRESETS.forEach((preset, i) => {
        const s = playOut(riichiOne(preset.options), level, `riichi-legal-${level}-${i}`);
        expect(s.over).toBe(true);
      });
    }
  }, 240_000);

  it('declares riichi with a closed ready hand; the strongest stay quiet when every wait already scores well', () => {
    // Throw the West wind: ready on the 4 or 7 bamboo with runs only, worth little without riichi.
    const plain = position({ style: 'riichi', options: R, turn: 0, hands: ['234m 678m 345p 56s 99s W', '', '', ''], drawn: 'W' });
    // Throw the North wind: ready on the 5 or 8 bamboo, and either wins tanyao, pinfu and the three-colour run.
    const rich = position({ style: 'riichi', options: R, turn: 0, hands: ['234m 234p 234s 67s 66p N', '', '', ''], drawn: 'N' });
    const WEST = 29;
    const NORTH = 30;
    for (const level of [2, 3, 4, 5]) {
      let declared = 0;
      for (let i = 0; i < 8; i++) {
        const d = decide(viewOf(plain, 0), level, createRng(`riichi/${level}/${i}`));
        if ((d.action.type === 'ready' || d.action.type === 'discard') && d.action.tile === WEST) {
          // Whenever it throws the West wind, it declares with it.
          expect(d.action.type, `level ${level}`).toBe('ready');
          expect(d.tags).toContain('mj-riichi');
          declared++;
        }
        const q = decide(viewOf(rich, 0), level, createRng(`dama/${level}/${i}`));
        if ((q.action.type === 'ready' || q.action.type === 'discard') && q.action.tile === NORTH) expect(q.action.type, `level ${level}`).toBe(level >= 4 ? 'discard' : 'ready');
      }
      expect(declared, `level ${level}`).toBeGreaterThan(0);
    }
  });

  it('folds against a declared riichi from level 3: a hand far from ready throws a tile the riichi player threw', () => {
    const s = position({
      style: 'riichi',
      options: R,
      turn: 0,
      hands: ['1m 4m 7m 2p 5p 8p 3s 6s 9s E S Gd 5m 4s', '', '', ''],
      drawn: '4s',
      discards: ['W 1p 9m', 'S 9s 1m E', 'N 1m 9p Wd 4s 2m', 'E 1s 8m Rd'],
      ready: [null, null, { at: 5 }, null],
      stakes: 1,
    });
    for (const level of [1, 2, 3, 4, 5]) {
      const d = decide(viewOf(s, 0), level, createRng('fold'));
      if (level >= 3) {
        expect(d.tags, `level ${level}`).toContain('mj-fold');
        expect(['1m', '4s']).toContain(actionText(d.action));
      } else expect(d.tags).not.toContain('mj-fold');
    }
  });

  it('calls with the yaku in mind: the strong levels decline a chow that kills tanyao, the only yaku left, and take one that keeps it', () => {
    const offer = (tile: string, kind: number) => {
      const s0 = position({ style: 'riichi', options: R, turn: 0, hands: [`111p 999p 2m 3m 4m 7m 8m 9m N ${tile}`, '23s 66m 77m 35p 44p', '', ''], melds: [[], [{ type: 'chow', tiles: '678p', from: 0 }], [], []], drawn: tile });
      return mahjong.apply(s0, { type: 'discard', tile: kind }).state;
    };
    const kills = offer('1s', 18);
    const keeps = offer('4s', 21);
    expect(mahjong.legal(kills, 1).map(actionText)).toEqual(['chow 1s', 'pass']);
    for (const level of [1, 2, 3, 4, 5]) {
      expect(decide(viewOf(kills, 1), level, createRng('call')).action.type, `level ${level}`).toBe(level >= 4 ? 'pass' : 'chow');
      expect(decide(viewOf(keeps, 1), level, createRng('call')).action.type, `level ${level}`).toBe('chow');
    }
    // A dragon pung is a yaku on its own: every level takes it.
    const d0 = position({ style: 'riichi', options: R, turn: 0, hands: ['111p 999p 2m 3m 4m 7m 8m 9m N Rd', '35s 1m 1m 7p 8p 9p 9m 9m RdRd N 6p', '', ''], drawn: 'Rd' });
    const d = mahjong.apply(d0, { type: 'discard', tile: 33 }).state;
    for (const level of [1, 2, 3, 4, 5]) expect(decide(viewOf(d, 1), level, createRng('call')).tags, `level ${level}`).toContain('mj-call-value');
  });
});
