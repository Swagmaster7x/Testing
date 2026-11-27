import { describe, expect, it } from 'vitest';
import type { GameRecord } from '../../src/core/record';
import { newRecord, withAction, withOutcome, withResignation } from '../../src/core/record';
import { replay } from '../../src/core/replay';
import { readGameFile, ShogiFileError, writeCsa, writeKif, writeUsi } from '../../src/games/shogi/formats';
import type { ShogiConfig } from '../../src/games/shogi/presets';
import { shogi } from '../../src/games/shogi/rules';

const MESSAGES = { encoding: 'encoding', unknown: 'unknown' };

function record(config: ShogiConfig, moves: readonly string[], resign = false): GameRecord {
  let r = newRecord(shogi, { id: 'g', config, seed: 's', players: [{ kind: 'human' }, { kind: 'bot', level: 1 }], appVersion: 'test', training: false, now: Date.UTC(2026, 10, 27) });
  for (const m of moves) r = withAction(r, m, 1);
  const final = replay(shogi, r).state;
  const outcome = shogi.outcome(final);
  if (outcome) r = withOutcome(r, outcome, 2);
  if (resign) r = withResignation(r, shogi.turn(final) ?? 0, [0, 1], 2);
  return r;
}

const GAME = ['7776', '3334', '8822+', '3122', 'B*45', '5142', '4534', '4232'];

describe('shogi files', () => {
  it('KIF reads back the moves and the result it wrote', () => {
    const r = record({}, GAME, true);
    const kif = writeKif(r, ['You', 'CPU Level 1']);
    expect(kif).toContain('先手：You');
    expect(kif).toContain('２二角成(88)');
    expect(kif).toContain('投了');
    const read = readGameFile(kif, MESSAGES);
    expect(read.config).toEqual({});
    expect(read.actions).toEqual(GAME);
    expect(read.names).toEqual(['You', 'CPU Level 1']);
    expect(read.outcome?.reason).toBe('resigned');
    // The side to move resigned: after eight moves that is Black, so White wins.
    expect(read.outcome?.results.find((x) => x.place === 1)?.seat).toBe(1);
  });

  it('handicap games keep their handicap', () => {
    const moves = ['5142', '7776', '4232'];
    const kif = writeKif(record({ handicap: 'two' }, moves), ['A', 'B']);
    expect(kif).toContain('二枚落ち');
    const read = readGameFile(kif, MESSAGES);
    expect(read.config).toEqual({ handicap: 'two' });
    expect(read.actions).toEqual(moves);
  });

  it('CSA and USI read back too', () => {
    const r = record({}, GAME);
    const csa = writeCsa(r, ['A', 'B']);
    expect(csa).toContain('+7776FU');
    expect(readGameFile(csa, MESSAGES).actions).toEqual(GAME);
    const usi = writeUsi(r);
    expect(usi).toBe('position startpos moves 7g7f 3c3d 8h2b+ 3a2b B*4e 5a4b 4e3d 4b3b');
    expect(readGameFile(usi, MESSAGES).actions).toEqual(GAME);
  });

  it('mini-shogi games are written as KIF with a 5五将棋 header and read back', () => {
    const moves = ['5453', '1213', '3544', '3122', '5352'];
    const r = record({ board: 'mini' }, moves);
    const kif = writeKif(r, ['A', 'B']);
    expect(kif).toContain('５五将棋');
    const read = readGameFile(kif, MESSAGES);
    expect(read.config).toEqual({ board: 'mini' });
    expect(read.actions).toEqual(moves);
    expect(writeUsi(r)).toBe('position sfen rbsgk/4p/5/P4/KGSBR b - 1 moves 5d5c 1b1c 3e4d 3a2b 5c5b');
    expect(() => writeCsa(r, [])).toThrow(ShogiFileError);
  });

  it('reads a hand-written KIF with 同, 打 and promotions', () => {
    const kif = ['手合割：平手', '先手：A', '後手：B', '手数----指手---------消費時間--', '   1 ７六歩(77)', '   2 ３四歩(33)', '   3 ２二角成(88)', '   4 同　銀(31)', '   5 ４五角打', '   6 投了'].join('\n');
    const read = readGameFile(kif, MESSAGES);
    expect(read.actions).toEqual(['7776', '3334', '8822+', '3122', 'B*45']);
    expect(read.outcome?.reason).toBe('resigned');
  });

  it('refuses a Shift-JIS file read as UTF-8, and text that is no game file', () => {
    expect(() => readGameFile('��：�', MESSAGES)).toThrow('encoding');
    expect(() => readGameFile('hello there', MESSAGES)).toThrow();
  });
});
