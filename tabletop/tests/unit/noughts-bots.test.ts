import { describe, expect, it } from 'vitest';
import { runLadder } from '../../src/ai/ladder';
import { createRng } from '../../src/core/rng';
import { buildLadders } from '../../src/games/ladders';
import { nodeEngine } from '../harness/stockfish-node';
import { noughtsBots, reasonTags } from '../../src/games/noughts/bots';
import { noughts, parseCell } from '../../src/games/noughts/rules';

const pos = (text: string) => noughts.codec.state.fromText(text);
const choose = (text: string, level: number, seed = 's') => {
  const view = pos(text);
  return noughtsBots.choose({ view, seat: view.toMove, level, rng: createRng(seed) });
};

describe('noughts and crosses CPU levels', () => {
  it('level 1 takes a win when it has one', () => {
    expect(choose('xx./oo./... x', 1).action).toBe(parseCell('c3'));
  });

  it('level 1 misses your threat: it plays its favourite square instead of blocking', () => {
    // O threatens c3 and X has no win; level 1 likes the centre and does not look at O's reply.
    for (let i = 0; i < 5; i++) expect(choose('oo./..x/x.. x', 1, `seed${i}`).action).toBe(parseCell('b2'));
  });

  it('level 2 blocks a line you are about to finish', () => {
    for (let i = 0; i < 5; i++) expect(choose('oo./..x/x.. x', 2, `seed${i}`).action).toBe(parseCell('c3'));
  });

  it('level 2 falls for a fork that level 3 sees coming', () => {
    // X a3 and c1 with O in the centre: O must take an edge. A corner loses to a fork.
    const l2 = choose('x../.o./..x o', 2).action;
    const l3 = choose('x../.o./..x o', 3).action;
    expect([0, 2, 6, 8]).toContain(l2);
    expect([1, 3, 5, 7]).toContain(l3);
  });

  it('level 3 never loses, from either seat, against any level', () => {
    for (let game = 0; game < 30; game++) {
      for (const l3Seat of [0, 1] as const) {
        const other = 1 + (game % 3);
        let s = noughts.setup({}, createRng(`g${game}`));
        for (let ply = 1; noughts.turn(s) !== null; ply++) {
          const seat = noughts.turn(s) ?? 0;
          const level = seat === l3Seat ? 3 : other;
          s = noughts.apply(s, noughtsBots.choose({ view: s, seat, level, rng: createRng(`g${game}/${ply}`) }).action).state;
        }
        expect(s.winner === null || s.winner === l3Seat).toBe(true);
      }
    }
  }, 30_000);

  it('gives the same answer for the same seed, so a resumed game replies the same way', () => {
    for (const level of [1, 2, 3]) {
      expect(choose('.../.x./... o', level, 'resume').action).toBe(choose('.../.x./... o', level, 'resume').action);
    }
  });

  it('tags its reasons', () => {
    expect(reasonTags(pos('xx./oo./... x'), parseCell('c3'))).toEqual(['wins']);
    expect(reasonTags(pos('oo./x../..x x'), parseCell('c3'))).toEqual(['blocks']);
    expect(reasonTags(pos('oo./..x/x.. x'), parseCell('c3'))).toEqual(['blocks', 'fork']);
    expect(reasonTags(pos('.../.../... x'), parseCell('b2'))).toEqual(['centre']);
    expect(reasonTags(pos('x../.o./... x'), parseCell('c1'))).toEqual([]);
    expect(reasonTags(pos('x.o/.o./x.. x'), parseCell('a2'))).toEqual(['wins']);
    expect(reasonTags(pos('x../.o./o.x x'), parseCell('c3'))).toEqual(['blocks', 'fork']);
  });

  it('refuses a level that does not exist', () => {
    expect(() => choose('.../.../... x', 7)).toThrow();
  });

  it('passes a short ladder: level 1 beats random, each level beats the one below', async () => {
    const ladder = buildLadders({ chessEngine: nodeEngine }).noughts;
    expect(ladder).toBeDefined();
    if (!ladder) return;
    const rungs = await runLadder(ladder.spec, 40, 'quick', ladder.random);
    expect(rungs.map((r) => `${r.higher}>${r.lower}`)).toEqual(['L1>random', 'L2>L1', 'L3>L2']);
    for (const r of rungs) expect(r.passed, `${r.higher} vs ${r.lower}: ${r.result.score}`).toBe(true);
  }, 30_000);
});
