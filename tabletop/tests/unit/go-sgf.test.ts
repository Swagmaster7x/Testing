// SGF in and out for Go, checked against @sabaki/sgf, a second SGF parser.
import sabakiSgf from '@sabaki/sgf';
import type { SgfNode } from '@sabaki/sgf';
import { describe, expect, it } from 'vitest';
import { findLegal } from '../../src/core/contract';
import type { Json } from '../../src/core/json';
import type { GameRecord } from '../../src/core/record';
import { newRecord, withAction, withOutcome } from '../../src/core/record';
import { replay } from '../../src/core/replay';
import { createRng } from '../../src/core/rng';
import type { GoConfig, GoState } from '../../src/games/go/rules';
import { go, makeConfig } from '../../src/games/go/rules';
import { parseSgfMainLine, readSgf, writeSgf } from '../../src/games/go/sgf';

function mainLine(text: string): Record<string, string[]>[] {
  const roots = sabakiSgf.parse(text);
  const out: Record<string, string[]>[] = [];
  let node: SgfNode | undefined = roots[0];
  while (node) {
    out.push(node.data);
    node = node.children[0];
  }
  return out;
}

/** A record of a game played from `moves` (in either notation) under `config`. */
function recordOf(config: GoConfig, moves: readonly string[]): { record: GameRecord; final: GoState } {
  let state = go.setup(config, createRng('sgf'));
  let record = newRecord(go, { id: 'g', config, seed: 'sgf', players: [{ kind: 'human' }, { kind: 'bot', level: 2 }], appVersion: 'test', training: false, now: Date.UTC(2026, 10, 27) });
  for (const m of moves) {
    const seat = go.turn(state) as number;
    const a = findLegal(go, state, seat, go.codec.action.fromText(m, state));
    if (!a) throw new Error(`${m} is not legal`);
    state = go.apply(state, a).state;
    record = withAction(record, go.codec.action.toJSON(a), 1);
  }
  const outcome = go.outcome(state);
  if (outcome) record = withOutcome(record, outcome, 2);
  return { record, final: state };
}

describe('go SGF', () => {
  it('writes a game that @sabaki/sgf reads with the same moves, size, komi and result', () => {
    const { record } = recordOf(makeConfig(9, 'chinese'), ['E5', 'D5', 'D4', 'pass', 'C5', 'pass', 'pass', 'dead D5', 'done', 'done']);
    const text = writeSgf(record, ['You', 'CPU Level 2']);
    const nodes = mainLine(text);
    const root = nodes[0] as Record<string, string[]>;
    expect(root.SZ).toEqual(['9']);
    expect(root.KM).toEqual(['7.5']);
    expect(root.RU).toEqual(['Chinese']);
    expect(root.PB).toEqual(['You']);
    expect(root.PW).toEqual(['CPU Level 2']);
    expect(root.RE).toEqual(['B+73.5']);
    const moves = nodes.slice(1).map((n) => (n.B ? `B${n.B[0]}` : `W${n.W?.[0] ?? '?'}`));
    expect(moves).toEqual(['Bee', 'Wde', 'Bdf', 'W', 'Bce', 'W', 'B']);
    expect(nodes[nodes.length - 1]?.TB?.length).toBe(81 - 4 + 1);
  });

  it('reads its own files back to the same game', () => {
    for (const [config, moves] of [
      [makeConfig(9, 'japanese', 2), ['C7', 'E5', 'pass', 'D4']],
      [makeConfig(9, 'chinese', 3), ['C3', 'G7', 'E5', 'C7', 'pass']],
      [makeConfig(13, 'aga'), ['D4', 'K10', 'D10', 'pass', 'pass', 'pass']],
      [{ ...makeConfig(9, 'chinese'), position: '........./........./..XO...../........./........./........./........./........./......... w' }, ['E5', 'pass']],
    ] as const) {
      const { record, final } = recordOf(config, moves);
      const read = readSgf(writeSgf(record, ['A', 'B']));
      const again = { ...record, config: go.codec.config.toJSON(read.config), actions: read.actions as Json[] };
      expect(replay(go, again).state.board).toBe(final.board);
      expect(read.config.rules.komi).toBe(config.rules.komi);
    }
  });

  it('reads files from elsewhere: variations, escapes, compressed points, passes as tt', () => {
    const text = `(;GM[1]FF[4]SZ[9]KM[6.5]RU[Japanese]PB[Ann \\] Lee]PW[Bo]RE[W+R]C[a comment
over two lines]
;B[ee]C[nice \\] move];W[cc]
(;B[gg];W[tt];B[gc])
(;B[aa]))`;
    expect(mainLine(text).length).toBe(parseSgfMainLine(text).length);
    const read = readSgf(text);
    expect(read.config.preset).toBe('japanese');
    expect(read.config.rules.komi).toBe(6.5);
    expect(read.names).toEqual(['Ann ] Lee', 'Bo']);
    expect(read.actions).toEqual(['ee', 'cc', 'gg', 'pass', 'gc']);
    expect(read.outcome).toMatchObject({ reason: 'go-sgf', results: [{ seat: 1, place: 1 }, { seat: 0, place: 2 }] });
    const setup = readSgf('(;GM[1]SZ[5]AB[aa:bb]AW[dd]PL[W];W[ee];B[cc])');
    expect(setup.config.position).toBe('XX.../XX.../...../...O./..... w');
    expect(setup.actions).toEqual(['ee', 'cc']);
  });

  it('treats a colour moving twice as the other side passing', () => {
    expect(readSgf('(;SZ[9];B[ee];B[dd];W[cc])').actions).toEqual(['ee', 'pass', 'dd', 'cc']);
  });

  it('refuses files that are not Go or that set up stones mid-game', () => {
    expect(() => readSgf('(;GM[3]SZ[8])')).toThrow(/not a game of Go/);
    expect(() => readSgf('(;GM[1]SZ[9];B[ee];AB[aa])')).toThrow(/middle of the game/);
    expect(() => readSgf('not sgf')).toThrow();
    expect(() => readSgf('(;SZ[9:13])')).toThrow(/square/);
  });
});
