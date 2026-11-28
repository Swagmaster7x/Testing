// M15 trial 1: Fairy-Stockfish behind the Engine interface, spoken to in USI, as shogi level 8 and
// for strong review analysis; and the fallbacks when it cannot run.
import { afterAll, describe, expect, it } from 'vitest';
import { strongEngineAvailable } from '../../src/ai/engines/fairy-stockfish-web';
import type { UciTransport } from '../../src/ai/uci';
import { UciEngine, USI } from '../../src/ai/uci';
import { isJsonObject } from '../../src/core/json';
import { createRng } from '../../src/core/rng';
import { shogiBots, shogiBotsWith } from '../../src/games/shogi/bots';
import { START_SFEN } from '../../src/games/shogi/core';
import { canonicalAction, shogi, stateFromSfen } from '../../src/games/shogi/rules';
import { STRONG_LEVEL, STRONG_NODES } from '../../src/games/shogi/strong';
import { fairyNodeEngine } from '../harness/fairy-node';

/** A transport that records commands and answers like a USI engine. */
function fakeUsi(reply: (command: string) => readonly string[]): { transport: UciTransport; sent: string[] } {
  const sent: string[] = [];
  let listener: (line: string) => void = () => undefined;
  return {
    sent,
    transport: {
      send(command) {
        sent.push(command);
        for (const line of reply(command)) setTimeout(() => listener(line), 0);
      },
      listen(onLine) {
        listener = onLine;
      },
      terminate: () => undefined,
    },
  };
}

describe('the USI dialect of the engine driver', () => {
  it('speaks USI: usi, usinewgame, position sfen and the USI_ option names', async () => {
    const { transport, sent } = fakeUsi((c) => (c === 'isready' ? ['readyok'] : c.startsWith('go') ? ['info depth 3 score cp 41 pv 7g7f 3c3d', 'bestmove 7g7f'] : []));
    const engine = new UciEngine(transport, { ...USI, setup: ['setoption name Threads value 1'] });
    const result = await engine.search({ fen: START_SFEN.standard, nodes: 1000, multiPv: 2 });
    expect(result).toEqual({ bestmove: '7g7f', lines: [{ multipv: 1, depth: 3, score: { cp: 41 }, pv: ['7g7f', '3c3d'] }] });
    expect(sent).toEqual([
      'usi',
      'setoption name Threads value 1',
      'isready',
      'setoption name USI_MultiPV value 2',
      'setoption name USI_LimitStrength value false',
      'usinewgame',
      `position sfen ${START_SFEN.standard}`,
      'go nodes 1000',
    ]);
  });

  it('treats "bestmove resign" as no move, and an "error" line from the host as a failed engine', async () => {
    const resigns = new UciEngine(fakeUsi((c) => (c === 'isready' ? ['readyok'] : c.startsWith('go') ? ['info depth 1 score mate -1 pv 5a4a', 'bestmove resign'] : [])).transport, USI);
    const result = await resigns.search({ fen: START_SFEN.standard, nodes: 10 });
    expect(result.bestmove).toBe('(none)');
    expect(result.lines[0]?.score).toEqual({ mate: -1 });
    const broken = new UciEngine(fakeUsi((c) => (c === 'usi' ? ['error not cross-origin isolated'] : [])).transport, USI);
    await expect(broken.search({ fen: START_SFEN.standard, nodes: 10 })).rejects.toThrow(/could not start: not cross-origin isolated/);
    await expect(broken.search({ fen: START_SFEN.standard, nodes: 10 })).rejects.toThrow(/stopped/);
  });

  it('runs only where the page is cross-origin isolated', () => {
    expect(strongEngineAvailable({})).toBe(false);
    expect(strongEngineAvailable({ crossOriginIsolated: false })).toBe(false);
    // Node has shared memory and SIMD, so only the isolation flag decides here.
    expect(strongEngineAvailable({ crossOriginIsolated: true })).toBe(true);
  });
});

describe('Fairy-Stockfish as shogi level 8 and for review', () => {
  const engine = fairyNodeEngine();
  const bots = shogiBotsWith(() => engine);
  afterAll(() => engine.terminate());

  it('adds level 8 only when the strong engine is given', () => {
    expect(shogiBots.levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(bots.levels.at(-1)).toEqual(STRONG_LEVEL);
  });

  it('answers the start with a legal move, the same one every time', { timeout: 60_000 }, async () => {
    const state = shogi.setup({}, createRng('x'));
    const first = await bots.choose({ view: state, seat: 0, level: 8, rng: createRng('a') });
    const again = await bots.choose({ view: state, seat: 0, level: 8, rng: createRng('b') });
    expect(shogi.legal(state, 0).map(canonicalAction)).toContain(canonicalAction(first.action));
    expect(canonicalAction(again.action)).toBe(canonicalAction(first.action));
    expect(first.nodes).toBe(STRONG_NODES);
  });

  it('finds a mate in one with a drop, and plays White in a handicap game', { timeout: 60_000 }, async () => {
    const mate = stateFromSfen('4k4/9/4P4/9/9/9/9/9/4K4 b G 1');
    const choice = await bots.choose({ view: mate, seat: 0, level: 8, rng: createRng('m') });
    expect(canonicalAction(choice.action)).toBe('G*52');
    expect(choice.tags).toContain('mate');
    const handicap = shogi.setup({ handicap: 'bishop' }, createRng('h'));
    const white = await bots.choose({ view: handicap, seat: 1, level: 8, rng: createRng('w') });
    expect(shogi.legal(handicap, 1).map(canonicalAction)).toContain(canonicalAction(white.action));
  });

  it('gives review lines in the app’s own move form, with mate scores like the built-in engine', { timeout: 60_000 }, async () => {
    const mate = stateFromSfen('4k4/9/4P4/9/9/9/9/9/4K4 b G 1');
    const answer = await bots.advise!({ view: mate, seat: 0, query: { type: 'analyse', nodes: 20_000, multiPv: 2, engine: 'strong' }, rng: createRng('r') });
    expect(isJsonObject(answer) && answer.engine).toBe('strong');
    const lines = isJsonObject(answer) && Array.isArray(answer.lines) ? answer.lines : [];
    expect(lines[0]).toMatchObject({ uci: 'G*52', mate: 1, score: 100_000 - 1 });
    expect(lines).toHaveLength(2);
  });

  it('plays a level-8 game on at level 7 where the strong engine is missing', () => {
    const state = shogi.setup({}, createRng('x'));
    const choice = shogiBots.choose({ view: state, seat: 0, level: 8, rng: createRng('a') }) as { action: Parameters<typeof canonicalAction>[0] };
    expect(shogi.legal(state, 0).map(canonicalAction)).toContain(canonicalAction(choice.action));
  });

  it('keeps mini-shogi on the built-in engine', async () => {
    const mini = shogi.setup({ board: 'mini' }, createRng('mini'));
    const answer = await bots.advise!({ view: mini, seat: 0, query: { type: 'analyse', nodes: 2_000, multiPv: 1, engine: 'strong' }, rng: createRng('r') });
    expect(isJsonObject(answer) && answer.engine).toBeUndefined();
    const choice = await bots.choose({ view: mini, seat: 0, level: 8, rng: createRng('c') });
    expect(shogi.legal(mini, 0).map(canonicalAction)).toContain(canonicalAction(choice.action));
  });
});

describe('when the strong engine fails', () => {
  it('falls back to the built-in engine and stops trying', { timeout: 60_000 }, async () => {
    let started = 0;
    const bots = shogiBotsWith(() => {
      started++;
      return new UciEngine(fakeUsi((c) => (c === 'usi' ? ['error out of memory'] : [])).transport, USI);
    });
    const state = shogi.setup({}, createRng('f'));
    const choice = await bots.choose({ view: state, seat: 0, level: 8, rng: createRng('f') });
    expect(shogi.legal(state, 0).map(canonicalAction)).toContain(canonicalAction(choice.action));
    const answer = await bots.advise!({ view: state, seat: 0, query: { type: 'analyse', nodes: 2_000, multiPv: 1, engine: 'strong' }, rng: createRng('r') });
    expect(isJsonObject(answer) && Array.isArray(answer.lines)).toBe(true);
    expect(started).toBe(1);
  });
});
