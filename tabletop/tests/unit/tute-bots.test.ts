// Tute CPU players, coach and review: the exact solver against brute force, every level choosing
// legal, repeatable moves from a view, and the review finding key moments.
import { describe, expect, it } from 'vitest';
import { findLegal } from '../../src/core/contract';
import type { Json } from '../../src/core/json';
import { isJsonObject } from '../../src/core/json';
import { newRecord, withAction } from '../../src/core/record';
import { createRng } from '../../src/core/rng';
import { chooseAction, handValue, heuristic, solve, TUTE_LEVELS, tuteBots, viewLegal } from '../../src/games/tute/bots';
import { analyseTuteGame } from '../../src/games/tute/review';
import type { TuteConfig, TuteState } from '../../src/games/tute/rules';
import { actionText, DECK, position, PRESETS, seatCount, sideOf, SPAIN_PAIRS, tute, viewOf } from '../../src/games/tute/rules';

/** Plain minimax with no memory: the margin for `side` with best play by every seat. */
function bruteForce(s: TuteState, side: number): number {
  const seat = tute.turn(s);
  if (seat === null || s.over) return handValue(s, 0, side, false);
  const values = tute
    .legal(s, seat)
    .filter((a) => a.type !== 'swap')
    .map((a) => bruteForce(tute.apply(s, a).state, side));
  return sideOf(seat, seatCount(s.config)) === side ? Math.max(...values) : Math.min(...values);
}

function randomEndgame(seed: string, size: number): TuteState {
  const rng = createRng(seed);
  const deck = rng.shuffle(DECK);
  const hands = [0, 1, 2, 3].map((k) => deck.slice(k * size, k * size + size));
  return tute.codec.state.fromText(position({ trump: rng.pick(['o', 'c', 'e', 'b'] as const), hands, leader: rng.int(4), lastWinner: rng.int(4), config: { matchTo: 1 } }));
}

describe('the endgame solver', () => {
  it('agrees with brute force on random endgames of two and three cards a hand, cantes included', () => {
    for (let i = 0; i < 60; i++) {
      const s = randomEndgame(`end-${i}`, i % 2 === 0 ? 2 : 3);
      expect(solve(s, 0, false), `end-${i}`).toBe(bruteForce(s, 0));
    }
  });
});

describe('the levels', () => {
  it('every level plays only legal moves, the same ones for the same seed', () => {
    for (const { level } of TUTE_LEVELS) {
      for (const config of [SPAIN_PAIRS, PRESETS['two-habanero'] as TuteConfig]) {
        const rng = createRng(`levels-${level}`);
        let s = tute.setup(config, rng);
        for (let ply = 0; ply < 10 && tute.turn(s) !== null; ply++) {
          const seat = tute.turn(s) ?? 0;
          const view = viewOf(s, seat);
          const a = chooseAction(view, level, createRng(`p${ply}`)).action;
          const b = chooseAction(view, level, createRng(`p${ply}`)).action;
          expect(actionText(a)).toBe(actionText(b));
          const legal = findLegal(tute, s, seat, a);
          expect(legal, `level ${level}`).not.toBeNull();
          s = tute.apply(s, legal ?? a).state;
        }
      }
    }
  }, 240_000);

  it('the view gives the same legal moves as the rules, under every preset', () => {
    for (const [id, config] of Object.entries(PRESETS)) {
      const rng = createRng(`legal-${id}`);
      let s = tute.setup(config, rng);
      for (let ply = 0; ply < 60 && tute.turn(s) !== null; ply++) {
        const seat = tute.turn(s) ?? 0;
        expect(viewLegal(viewOf(s, seat)).map(actionText).sort()).toEqual(tute.legal(s, seat).map(actionText).sort());
        s = tute.apply(s, rng.pick(tute.legal(s, seat))).state;
      }
    }
  });

  it('every heuristic sings a pair and declares a tute when it can', () => {
    const sing = tute.codec.state.fromText(position({ trump: 'b', hands: [['Rb', 'Cb', '4o'], ['5o', '6o', '7o'], ['4e', '5e', '6e'], ['4c', '5c', '6c']], leader: 0, lastWinner: 0, config: { matchTo: 1 } }));
    for (const policy of [2, 3]) expect(actionText(heuristic(viewOf(sing, 0), policy, createRng('h')).action)).toBe('sing-b');
    const four = tute.codec.state.fromText(position({ trump: 'b', hands: [['Ro', 'Rc', 'Re', 'Rb'], ['5o', '6o', '7o', '2o'], ['4e', '5e', '6e', '7e'], ['4c', '5c', '6c', '7c']], leader: 0, lastWinner: 0, config: { matchTo: 1 } }));
    for (const policy of [1, 2, 3]) expect(actionText(heuristic(viewOf(four, 0), policy, createRng('t')).action)).toBe('tute-R');
  });

  it('a counting player loads points onto a partner’s trick that will surely win', () => {
    const s = tute.codec.state.fromText(position({ trump: 'b', hands: [['3c', '4c', '6e'], ['5c', '7o', '4e'], ['Sc', '5o'], ['2b', '3b']], trick: [{ seat: 2, card: 'Ac' }, { seat: 3, card: '7c' }], leader: 2, canteOpen: false, config: { matchTo: 1 } }));
    expect(actionText(heuristic(viewOf(s, 0), 3, createRng('load')).action)).toBe('3c');
  });
});

describe('the coach and the review', () => {
  it('answers hints and analyses from the view', async () => {
    const s = tute.setup(SPAIN_PAIRS, createRng('coach'));
    const seat = tute.turn(s) ?? 0;
    const view = viewOf(s, seat);
    const hint = (await tuteBots.advise?.({ view, seat, query: { type: 'hint', samples: 6 }, rng: createRng('h') })) as Json;
    expect(isJsonObject(hint) && typeof hint.action === 'string').toBe(true);
    const analysis = (await tuteBots.advise?.({ view, seat, query: { type: 'analyse', samples: 6 }, rng: createRng('a') })) as Json;
    expect(isJsonObject(analysis) && Array.isArray(analysis.moves) && analysis.moves.length === tute.legal(s, seat).length).toBe(true);
  });

  it('reviews a whole hand with key moments', async () => {
    const config: TuteConfig = { ...SPAIN_PAIRS, matchTo: 1 };
    const seed = 'review-hand';
    let s = tute.setup(config, createRng(seed));
    let record = newRecord(tute, { id: 'r', config, seed, players: [{ kind: 'human' }, { kind: 'bot', level: 1 }, { kind: 'bot', level: 1 }, { kind: 'bot', level: 1 }], appVersion: 'test', training: false, now: 0 });
    for (let ply = 0; !s.over; ply++) {
      // The "person" plays like level 1 here, so there are mistakes to find.
      const seat = tute.turn(s) ?? 0;
      const action = chooseAction(viewOf(s, seat), 1, createRng(`p${ply}`)).action;
      record = withAction(record, tute.codec.action.toJSON(action), ply);
      s = tute.apply(s, action).state;
    }
    const ask = (query: Json, state?: unknown) => {
      const st = state as TuteState;
      const seat = tute.turn(st) ?? 0;
      return Promise.resolve(tuteBots.advise?.({ view: viewOf(st, seat), seat, query: { ...(query as object), samples: 8 }, rng: createRng('review') }) as Json);
    };
    const analysis = await analyseTuteGame(record, ask, () => undefined, () => false);
    expect(analysis).not.toBeNull();
    expect(analysis?.moves.every((m) => m.seat === 0)).toBe(true);
    expect(analysis?.keyMoments.length).toBeGreaterThan(0);
  }, 120_000);
});
