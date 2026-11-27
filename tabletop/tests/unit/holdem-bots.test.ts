/** Hold'em bots, equity and hand reading: legal play at every level and style, sound decisions in clear spots, exact equity. */
import { describe, expect, it } from 'vitest';
import { runMatch } from '../../src/ai/ladder';
import { createRng } from '../../src/core/rng';
import type { Json } from '../../src/core/json';
import { newRecord, withAction } from '../../src/core/record';
import type { Card } from '../../src/games/holdem/cards';
import { cardIndex } from '../../src/games/holdem/cards';
import type { Style } from '../../src/games/holdem/bots';
import { decide, holdemBots, LINEUPS, optionValues, STYLES, styleOf, viewLegal } from '../../src/games/holdem/bots';
import { ANY_HAND, comboOf, exactEquity, rangeEquity } from '../../src/games/holdem/equity';
import { inTop, openFraction, RANKING } from '../../src/games/holdem/preflop';
import { outs, readHand } from '../../src/games/holdem/reading';
import { analyseHoldemGame } from '../../src/games/holdem/review';
import type { HoldemAction, HoldemConfig, HoldemState } from '../../src/games/holdem/rules';
import { actionText, holdem, position, PRESETS, SIX_MAX_CASH, viewOf } from '../../src/games/holdem/rules';
import { buildLadders, pokerSideScore } from '../../src/games/ladders';

const h = (text: string) => text.split(' ') as Card[];
const idx = (text: string) => h(text).map(cardIndex);

describe('equity and hand reading', () => {
  it('exact equity: aces against kings on a dry flop, and a made flush against a set on the river', () => {
    const [aa = 0, kk = 0] = exactEquity([comboOf(h('Ah Ad')), comboOf(h('Ks Kc'))], idx('2c 7d 9h'));
    expect(aa + kk).toBeCloseTo(1, 6);
    expect(aa).toBeGreaterThan(0.9);
    expect(exactEquity([comboOf(h('Ah 4h')), comboOf(h('9s 9c'))], idx('2h 7h 9h 3d Ks'))).toEqual([1, 0]);
  });

  it('equity against any two cards: aces win about 85% heads-up', () => {
    const eq = rangeEquity(comboOf(h('As Ac')), [], [ANY_HAND], 4000, createRng('aa'));
    expect(eq).toBeGreaterThan(0.82);
    expect(eq).toBeLessThan(0.88);
  });

  it('reads made hands and draws, and counts the outs', () => {
    expect(readHand(comboOf(h('Ah Kd')), idx('Ad 7c 2s'))).toMatchObject({ category: 'pair', detail: 'top-pair', tier: 4 });
    expect(readHand(comboOf(h('Qh Qd')), idx('9d 7c 2s'))).toMatchObject({ detail: 'overpair' });
    expect(readHand(comboOf(h('7h 7d')), idx('7s Kc 2s'))).toMatchObject({ detail: 'set', tier: 5 });
    expect(readHand(comboOf(h('Ah 5h')), idx('Kh 9h 2c')).draws).toContain('flush-draw');
    expect(readHand(comboOf(h('9d 8c')), idx('7s 6h 2c')).draws).toContain('open-ended');
    expect(readHand(comboOf(h('9d 8c')), idx('Js 6h 2c')).draws).toEqual([]);
    expect(readHand(comboOf(h('9d 5c')), idx('8s 6h 2c')).draws).toContain('gutshot');
    // Nine cards make the flush; the open-ender has eight straight cards.
    expect(outs(h('Ah 5h'), h('Kh 9h 2c')).draw).toHaveLength(9);
    expect(outs(h('9d 8c'), h('7s 6h 2c')).draw).toHaveLength(8);
    expect(outs(h('9d 8c'), h('7s 6h 2c 3d')).draw).toHaveLength(8);
    expect(outs(h('9d 8c'), h('7s 6h 2c 3d Kd'))).toEqual({ draw: [], improve: [] });
  });

  it('ranks the starting hands: aces first, the worst last; opening ranges by position', () => {
    expect(RANKING).toHaveLength(169);
    expect(RANKING[0]).toBe('AA');
    expect(RANKING.slice(-5)).toContain('72o');
    expect(inTop('AKs', openFraction('UTG', 6))).toBe(true);
    expect(inTop('K9o', openFraction('UTG', 6))).toBe(false);
    expect(inTop('K9o', openFraction('BTN', 6))).toBe(true);
    expect(openFraction('BTN', 2)).toBeGreaterThan(openFraction('BTN', 6));
  });
});

describe('the bots', () => {
  const configs: HoldemConfig[] = [SIX_MAX_CASH, PRESETS['heads-up'] as HoldemConfig, PRESETS['sit-and-go'] as HoldemConfig, PRESETS['home-game'] as HoldemConfig];

  it('play only legal actions, at every level, in every format', () => {
    for (const level of [1, 2, 3, 4, 5, 6]) {
      for (const [ci, config] of configs.entries()) {
        let s = holdem.setup({ ...config, hands: 10 }, createRng(`legal-${level}-${ci}`));
        for (let ply = 0; ply < 150 && !s.over; ply++) {
          const seat = s.toAct ?? 0;
          const v = viewOf(s, seat);
          expect(viewLegal(v, seat).map(actionText)).toEqual(holdem.legal(s, seat).map(actionText));
          const choice = holdemBots.choose({ view: v, seat, level, rng: createRng(`b-${ply}`) });
          if (choice instanceof Promise) throw new Error('holdem bots answer at once');
          s = holdem.apply(s, choice.action).state;
        }
      }
    }
  }, 120_000);

  it('every style plays legally', () => {
    const s = position({ seats: 3, button: 0, holes: [h('Ah Kd'), null, null], board: h('As 7c 2d 9h Qs') });
    for (const style of STYLES) {
      const d = decide(viewOf(s, 0), 0, 4, style, createRng(style));
      expect(holdem.legal(s, 0).map(actionText)).toContain(actionText(d.action));
    }
  });

  it('a seat keeps its style for the whole session, drawn from its level’s line-up', () => {
    for (const level of [1, 3, 6]) {
      for (let seat = 1; seat < 6; seat++) {
        const style: Style = styleOf(1234, seat, level);
        expect(styleOf(1234, seat, level)).toBe(style);
        expect(LINEUPS[level]).toContain(style);
      }
    }
  });

  it('calls an all-in with aces and folds seven-deuce to one (level 3 and up)', () => {
    for (const level of [3, 4, 5, 6]) {
      const aces = position({ config: { format: 'heads-up' }, button: 0, holes: [h('9c 8d'), h('As Ad')], actions: ['r2000'] });
      expect(actionText(decide(viewOf(aces, 1), 1, level, 'tag', createRng('aa')).action)).toBe('call');
      const junk = position({ config: { format: 'heads-up' }, button: 0, holes: [h('Ks Qd'), h('7c 2d')], actions: ['r2000'] });
      expect(actionText(decide(viewOf(junk, 1), 1, level, 'tag', createRng('72')).action)).toBe('fold');
    }
  });

  it('values the options: folding is nothing, the nuts on the river would rather bet', () => {
    const s = position({ seats: 2, config: { format: 'heads-up' }, button: 0, holes: [h('Ah Kh'), h('Qc Jd')], board: h('Th Jh Qh 2c 3d'), actions: ['call', 'check', 'check', 'check', 'check', 'check', 'check'] });
    expect(s.street).toBe('river');
    const seat = s.toAct ?? 1;
    const values = optionValues(viewOf(s, seat), seat, 300, createRng('nuts'), new Map([[1 - seat, comboOf(s.players[1 - seat]?.hole ?? [])]]));
    const check = values.find((o) => o.action === 'check');
    const bets = values.filter((o) => o.action.startsWith('r'));
    expect(check).toBeDefined();
    if (seat === 0) expect(Math.max(...bets.map((o) => o.ev))).toBeGreaterThanOrEqual((check?.ev ?? 0) - 1e-9);
  });

  it('level 3 beats random play at a six-handed table', async () => {
    const ladder = buildLadders({ chessEngine: () => { throw new Error('no chess here'); } }).poker;
    if (!ladder) throw new Error('no poker ladder');
    const result = await runMatch(holdem, { ...SIX_MAX_CASH, hands: 20 }, { name: 'L3', choose: (v, seat, rng) => decide(v, seat, 3, styleOf(v.table, seat, 3), rng).action }, ladder.random as never, 8, 'unit', true, pokerSideScore);
    expect(result.score).toBeGreaterThanOrEqual(0.75);
  }, 120_000);
});

describe('the review', () => {
  it('rates a person’s decisions in big blinds and finds the key moments', async () => {
    const config = { ...SIX_MAX_CASH, hands: 3 };
    let s: HoldemState = holdem.setup(config, createRng('review'));
    let record = newRecord(holdem, { id: 'r', config, seed: 'review', players: s.players.map((_, i) => (i === 0 ? { kind: 'human' as const } : { kind: 'bot' as const, level: 2 })), appVersion: 'test', training: false, now: 0 });
    for (let ply = 1; !s.over && ply < 400; ply++) {
      const seat = s.toAct ?? 0;
      // The person folds nothing: calls or checks every time, a bad habit the review should catch.
      const chosen: HoldemAction = seat === 0 ? (holdem.legal(s, 0).find((a) => a.type === 'call' || a.type === 'check') ?? { type: 'fold' }) : decide(viewOf(s, seat), seat, 2, 'station', createRng(`r${ply}`)).action;
      s = holdem.apply(s, chosen).state;
      record = withAction(record, holdem.codec.action.toJSON(chosen), ply);
    }
    record = { ...record, status: 'finished', outcome: holdem.outcome(s) };
    const ask = (query: Json, state?: unknown) => {
      const at = state as HoldemState;
      const seat = at.toAct ?? 0;
      return Promise.resolve<Json>(holdemBots.advise?.({ view: viewOf(at, seat), seat, query, rng: createRng('ask') }) ?? null);
    };
    const analysis = await analyseHoldemGame(record, ask, () => undefined, () => false);
    expect(analysis).not.toBeNull();
    const moves = analysis?.moves ?? [];
    expect(moves.length).toBeGreaterThan(0);
    for (const m of moves) {
      expect(m.seat).toBe(0);
      expect(m.loss).toBeGreaterThanOrEqual(0);
      expect(m.accept.length).toBeGreaterThan(0);
    }
    expect(Object.keys(analysis?.accuracy ?? {})).toEqual(['0']);
  }, 120_000);
});
