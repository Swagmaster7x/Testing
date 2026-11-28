// M15 trial 2: the small KataGo network that gives the Go review its score and ownership map.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isJsonObject } from '../../src/core/json';
import { createRng } from '../../src/core/rng';
import { goBots, goBotsWith } from '../../src/games/go/bots';
import { pointName } from '../../src/games/go/coords';
import { evaluate, readNetwork } from '../../src/games/go/net';
import { fromHalf } from '../../src/games/go/net/model';
import { libertyMap, netInputs } from '../../src/games/go/net/inputs';
import { go, makeConfig } from '../../src/games/go/rules';

const file = readFileSync(join(import.meta.dirname, '../../assets/katago/g170-b6c96-f16.bin'));
const net = readNetwork(new Uint8Array(file.buffer, file.byteOffset, file.byteLength));
const position = (size: number, rows: readonly string[], toMove: 'X' | 'O', komi = 7) => ({ size, board: rows.join(''), toMove, ko: -1, recent: [], komi, preset: 'chinese' as const });
const empty = (n: number) => Array.from({ length: n }, () => '.'.repeat(n));

// Black holds the left, White the right; one black stone sits alone in White's area.
const SPLIT = ['...XO....', '...XO....', '..XXO....', '...XOO...', '...XXO.X.', '....XO...', '...XXO...', '...XO....', '...XO....'];

describe('the network file', () => {
  it('is the small b6c96 net, read with 16-bit weights', () => {
    expect(net.name).toBe('g170-b6c96-s175395328-d26788732');
    expect(net.version).toBe(8);
    expect(net.trunkChannels).toBe(96);
    expect(net.blocks).toHaveLength(6);
    expect(net.spatialInputs).toBe(22);
    expect(net.globalInputs).toBe(19);
    expect(file.byteLength).toBeLessThan(2_200_000);
  });

  it('decodes 16-bit floats', () => {
    expect(fromHalf(0x3c00)).toBe(1);
    expect(fromHalf(0xc000)).toBe(-2);
    expect(fromHalf(0x3555)).toBeCloseTo(1 / 3, 3);
    expect(fromHalf(0x0001)).toBeCloseTo(2 ** -24, 30);
    expect(fromHalf(0x7c00)).toBe(Infinity);
  });
});

describe('the inputs', () => {
  it('counts liberties per chain and marks the side to move', () => {
    const libs = libertyMap(3, 'XX.O.....');
    expect([...libs]).toEqual([2, 2, 0, 2, 0, 0, 0, 0, 0]);
    const { spatial, global } = netInputs({ size: 3, board: 'XX.O.....', toMove: 'O', ko: 2, recent: [3, -1], komi: 7, preset: 'japanese' });
    const at = (p: number, plane: number) => spatial[p * 22 + plane];
    expect([at(0, 0), at(0, 1), at(0, 2), at(0, 4)]).toEqual([1, 0, 1, 1]);
    expect([at(3, 1), at(3, 2)]).toEqual([1, 0]);
    expect(at(2, 6)).toBe(1);
    expect(global[0]).toBe(1);
    expect(at(3, 10)).toBe(1);
    expect(global[5]).toBeCloseTo(7 / 20);
    expect([global[9], global[10], global[14]]).toEqual([1, 1, 1]);
  });
});

describe('what the network says', () => {
  it('opens on the centre of 9×9 and on the corners of 19×19, about even with komi', () => {
    const nine = evaluate(net, position(9, empty(9), 'X'));
    expect(pointName(nine.policy[0]!.point, 9)).toBe('E5');
    expect(nine.blackWins).toBeGreaterThan(0.35);
    expect(nine.blackWins).toBeLessThan(0.65);
    expect(Math.abs(nine.blackLead)).toBeLessThan(3);
    const nineteen = evaluate(net, position(19, empty(19), 'X', 7.5));
    const corners = new Set(['D4', 'C4', 'D3', 'Q4', 'R4', 'Q3', 'D16', 'C16', 'D17', 'Q16', 'R16', 'Q17']);
    expect(corners.has(pointName(nineteen.policy[0]!.point, 19))).toBe(true);
  });

  it('gives each side its own area, and counts a stone alone in the other’s area as lost', () => {
    const e = evaluate(net, position(9, SPLIT, 'O'));
    // A point deep on each side, and the lone black stone (row 5, column H).
    expect(e.ownership[4 * 9 + 0]).toBeGreaterThan(0.6);
    expect(e.ownership[4 * 9 + 8]).toBeLessThan(-0.6);
    expect(e.ownership[4 * 9 + 7]).toBeLessThan(-0.5);
    expect(e.blackLead).toBeLessThan(0);
    expect(e.blackWins).toBeLessThan(0.2);
    // The same board seen from the other side to move gives the same owners.
    const other = evaluate(net, position(9, SPLIT, 'X'));
    expect(Math.sign(other.ownership[4 * 9 + 0]!)).toBe(1);
  });
});

describe('the review coach question', () => {
  it('answers "net" from Black’s point of view, loading the network once', async () => {
    let loads = 0;
    const bots = goBotsWith(() => {
      loads++;
      return Promise.resolve(net);
    });
    const state = go.setup(makeConfig(9, 'chinese'), createRng('n'));
    const answer = await bots.advise!({ view: state, seat: 0, query: { type: 'net', recent: [] }, rng: createRng('a') });
    expect(isJsonObject(answer) && Array.isArray(answer.ownership) && answer.ownership.length).toBe(81);
    expect(isJsonObject(answer) && typeof answer.blackLead).toBe('number');
    await bots.advise!({ view: state, seat: 0, query: { type: 'net' }, rng: createRng('b') });
    expect(loads).toBe(1);
    // Other questions still go to the playout coach.
    const eval_ = await bots.advise!({ view: state, seat: 0, query: { type: 'eval', playouts: 50 }, rng: createRng('c') });
    expect(isJsonObject(eval_) && typeof eval_.black).toBe('number');
    expect('advise' in goBots).toBe(true);
  });
});
