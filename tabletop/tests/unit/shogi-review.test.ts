import { describe, expect, it } from 'vitest';
import type { Json } from '../../src/core/json';
import { newRecord, withAction } from '../../src/core/record';
import { replay } from '../../src/core/replay';
import { createRng } from '../../src/core/rng';
import { shogiBots } from '../../src/games/shogi/bots';
import { analyseShogiGame, shogiWinChance } from '../../src/games/shogi/review';
import type { ShogiState } from '../../src/games/shogi/rules';
import { shogi } from '../../src/games/shogi/rules';
import { shogiUi } from '../../src/games/shogi/ui';

const ask = (query: Json, state?: unknown) => {
  const view = state as ShogiState;
  return Promise.resolve(shogiBots.advise?.({ view, seat: shogi.turn(view) ?? 0, query, rng: createRng('r') }) as Json);
};

describe('shogi review', () => {
  it('rates each move, names the blunder with a reason and picks it as a key moment', async () => {
    const config = { position: '4k4/9/9/9/4g4/9/9/4R4/4K4 b - 1' };
    let record = newRecord(shogi, { id: 'r', config, seed: 's', players: [{ kind: 'human' }, { kind: 'bot', level: 1 }], appVersion: 'test', training: false, now: 0 });
    for (const m of ['5856', '5556', '5948']) record = withAction(record, m, 1);
    const analysis = await analyseShogiGame(record, ask, () => undefined, () => false);
    expect(analysis).not.toBeNull();
    const moves = analysis?.moves ?? [];
    expect(moves).toHaveLength(3);
    const blunder = moves[0];
    expect(['mistake', 'blunder']).toContain(blunder?.verdict);
    expect(blunder?.best).toBe('Rx55');
    expect(blunder?.reason?.key).toMatch(/^why\./);
    expect(analysis?.keyMoments).toContain(0);
    expect(moves[1]?.verdict).toBe('best');
  }, 60_000);

  it('turns engine scores into winning chances on a shogi scale', () => {
    expect(shogiWinChance(0)).toBeCloseTo(50, 5);
    expect(shogiWinChance(600)).toBeGreaterThan(70);
    expect(shogiWinChance(600)).toBeLessThan(80);
    expect(shogiWinChance(-100_000)).toBeLessThan(5);
  });

  it('plays on from any position of a game, keeping the handicap and the impasse rule', () => {
    let record = newRecord(shogi, { id: 'p', config: { handicap: 'rook', impasse: 'points-24' }, seed: 's', players: [{ kind: 'human' }, { kind: 'bot', level: 2 }], appVersion: 'test', training: false, now: 0 });
    for (const m of ['5142', '7776']) record = withAction(record, m, 1);
    const state = replay(shogi, record).state;
    const config = shogiUi.review?.configAt(state);
    expect(config).toEqual({ position: state.sfen, impasse: 'points-24', handicap: 'rook' });
    const again = shogi.setup(config ?? {}, createRng('x'));
    expect(again.sfen).toBe(state.sfen);
    expect(again.rules.handicapPoints).toBe(5);
    // "Play again" keeps the rules but not the position.
    expect(shogiUi.replayConfig?.(config ?? {})).toEqual({ impasse: 'points-24', handicap: 'rook' });
  });
});
