import { afterAll, describe, expect, it } from 'vitest';
import type { SearchResult } from '../../src/ai/uci';
import { parseInfo, scoreValue } from '../../src/ai/uci';
import { createRng } from '../../src/core/rng';
import { chessBots, ideaOf, LEVEL_PARAMS, moveTags, nullMoveFen, pickWithErrors } from '../../src/games/chess/bots';
import { chess, START_FEN, uciOf } from '../../src/games/chess/rules';
import { nodeEngine } from '../harness/stockfish-node';

const engine = nodeEngine();
const bots = chessBots(() => engine);
afterAll(() => engine.terminate());

const at = (fen: string) => chess.codec.state.fromText(fen);

describe('UCI parsing', () => {
  it('reads info lines with scores, mates and lines', () => {
    expect(parseInfo('info depth 10 seldepth 11 multipv 2 score cp -35 nodes 50015 pv g1f3 b8c6')).toEqual({ multipv: 2, depth: 10, score: { cp: -35 }, pv: ['g1f3', 'b8c6'] });
    expect(parseInfo('info depth 5 score mate 3 pv d1h5')).toMatchObject({ multipv: 1, score: { mate: 3 } });
    expect(parseInfo('info string NNUE evaluation')).toBeNull();
    expect(scoreValue({ mate: 1 })).toBeGreaterThan(scoreValue({ mate: 3 }));
    expect(scoreValue({ mate: -1 })).toBeLessThan(scoreValue({ cp: -2000 }));
  });
});

describe('planned mistakes', () => {
  const result: SearchResult = {
    bestmove: 'e2e4',
    lines: [
      { multipv: 1, depth: 8, score: { cp: 40 }, pv: ['e2e4'] },
      { multipv: 2, depth: 8, score: { cp: 20 }, pv: ['d2d4'] },
      { multipv: 3, depth: 8, score: { cp: -2000 }, pv: ['f2f3'] },
    ],
  };
  it('never picks a move beyond the level’s window', () => {
    for (let i = 0; i < 200; i++) expect(pickWithErrors(START_FEN, result, { ...LEVEL_PARAMS[2]!, error: 1 }, createRng(`s${i}`))).not.toBe('f2f3');
  });
  it('plays the best move when it makes no mistake', () => {
    expect(pickWithErrors(START_FEN, result, { ...LEVEL_PARAMS[3]!, error: 0 }, createRng('x'))).toBe('e2e4');
  });
});

describe('chess bots on Stockfish', () => {
  it('level 1 is repeatable for the same seed, and every level plays a legal move', async () => {
    const view = at(START_FEN);
    const a = await bots.choose({ view, seat: 0, level: 1, rng: createRng('same') });
    const b = await bots.choose({ view, seat: 0, level: 1, rng: createRng('same') });
    expect(uciOf(a.action)).toBe(uciOf(b.action));
    for (const level of [2, 3, 4, 8]) {
      const c = await bots.choose({ view, seat: 0, level, rng: createRng('x') });
      expect(chess.legal(view, 0).map(uciOf)).toContain(uciOf(c.action));
    }
  }, 30_000);

  it('a strong level finds mate in one', async () => {
    const view = at('6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1');
    const c = await bots.choose({ view, seat: 0, level: 8, rng: createRng('x') });
    expect(c.action.san).toBe('Rd8#');
    expect(c.tags).toEqual(['mate']);
  }, 30_000);

  it('tags captures, checks and castling', () => {
    expect(moveTags('4k3/8/8/8/8/8/3q4/3QK3 w - - 0 1', 'd1d2')).toEqual(['takes-q']);
    expect(moveTags('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1', 'e1g1')).toEqual(['castles']);
    expect(moveTags('4k3/8/8/8/8/8/8/R3K3 w - - 0 1', 'a1a8')).toEqual(['check']);
  });
});

describe('the chess coach', () => {
  it('gives a legal hint with an idea', async () => {
    const view = at(START_FEN);
    const hint = (await bots.advise?.({ view, seat: 0, query: { type: 'hint' }, rng: createRng('x') })) as { uci: string; idea: string };
    expect(chess.legal(view, 0).map(uciOf)).toContain(hint.uci);
    expect(typeof hint.idea).toBe('string');
  }, 30_000);

  it('warns before a blunder that hangs the queen, and names the reply', async () => {
    const view = at('4k3/8/8/3r4/8/8/8/3QK3 w - - 0 1');
    const check = (await bots.advise?.({ view, seat: 0, query: { type: 'check-move', move: 'd1d4' }, rng: createRng('x') })) as { warn: boolean; reason: string; reply: { san: string } };
    expect(check.warn).toBe(true);
    expect(check.reason).toBe('hangs-q');
    expect(check.reply.san).toBe('Rxd4');
    const fine = (await bots.advise?.({ view, seat: 0, query: { type: 'check-move', move: 'd1d5' }, rng: createRng('x') })) as { warn: boolean };
    expect(fine.warn).toBe(false);
  }, 30_000);

  it('spots a threat of mate (Scholar’s mate)', async () => {
    const view = at('r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3');
    const answer = (await bots.advise?.({ view, seat: 1, query: { type: 'threats' }, rng: createRng('x') })) as { threats: { san: string; mate: number | null }[] };
    expect(answer.threats[0]?.san).toBe('Qxf7#');
    expect(answer.threats[0]?.mate).toBe(1);
  }, 30_000);

  it('evaluates from White’s point of view', async () => {
    const answer = (await bots.advise?.({ view: at('4k3/8/8/8/8/8/8/QQQQK3 w - - 0 1'), seat: 0, query: { type: 'eval' }, rng: createRng('x') })) as { white: number };
    expect(answer.white).toBeGreaterThan(1000);
  }, 30_000);

  it('names the idea of a move', () => {
    // Knight fork of king and rook: Nc7+.
    expect(ideaOf('r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1', { multipv: 1, depth: 5, score: { cp: 500 }, pv: ['d5c7', 'e8d7', 'c7a8'] })).toBe('fork');
    expect(ideaOf(START_FEN, { multipv: 1, depth: 5, score: { cp: 30 }, pv: ['g1f3'] })).toBe('develop');
    expect(ideaOf('6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', { multipv: 1, depth: 5, score: { mate: 1 }, pv: ['d1d8'] })).toBe('mate');
  });

  it('flips the side to move for threats, but not when in check', () => {
    expect(nullMoveFen(START_FEN)?.split(' ')[1]).toBe('b');
    expect(nullMoveFen('4k3/8/8/8/8/8/8/R3K2r w - - 0 1')).toBeNull();
  });
});
