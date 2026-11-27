// Chess game review with the real engine (Stockfish in Node, fixed node budgets).
import { afterAll, describe, expect, it } from 'vitest';
import { findLegal } from '../../src/core/contract';
import type { Json } from '../../src/core/json';
import type { GameRecord } from '../../src/core/record';
import { newRecord, withAction, withOutcome } from '../../src/core/record';
import { createRng } from '../../src/core/rng';
import { chessBots } from '../../src/games/chess/bots';
import { analyseChessGame } from '../../src/games/chess/review';
import type { ChessState } from '../../src/games/chess/rules';
import { chess } from '../../src/games/chess/rules';
import { nodeEngine } from '../harness/stockfish-node';

const engine = nodeEngine();
const bots = chessBots(() => engine);
afterAll(() => engine.terminate());

/** Coach questions go straight to the chess bots, as the bot worker does in the app. */
async function ask(query: Json, state?: unknown): Promise<Json> {
  const view = state as ChessState;
  return (await bots.advise?.({ view, seat: chess.turn(view) ?? 0, query, rng: createRng('r') })) ?? null;
}

function play(moves: string[]): GameRecord {
  let record = newRecord(chess, { id: 'g', config: {}, seed: 's', players: [{ kind: 'human' }, { kind: 'bot', level: 2 }], appVersion: '0.3.0', training: false, now: 1 });
  let state = chess.setup({}, createRng('s'));
  for (const [i, m] of moves.entries()) {
    const seat = chess.turn(state) ?? 0;
    const action = findLegal(chess, state, seat, chess.codec.action.fromText(m, state));
    if (!action) throw new Error(`${m} is not legal`);
    record = withAction(record, chess.codec.action.toJSON(action), 2 + i);
    state = chess.apply(state, action).state;
  }
  const outcome = chess.outcome(state);
  return outcome ? withOutcome(record, outcome, 100) : record;
}

describe('chess review', () => {
  it('finds the blunders of a short lost game, with reasons, accuracy and key moments', async () => {
    // White (the person) walks into Legal-style trouble: 5. Nxf7?? loses to ...Qxg2 and mate.
    const record = play(['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nd4', 'Nxe5', 'Qg5', 'Nxf7', 'Qxg2', 'Rf1', 'Qxe4+', 'Be2', 'Nf3#']);
    expect(record.status).toBe('finished');

    let progress = 0;
    const analysis = await analyseChessGame(record, ask, (done) => (progress = done), () => false);
    expect(analysis).not.toBeNull();
    if (!analysis) return;
    expect(progress).toBe(14);
    expect(analysis.moves.length).toBe(14);
    expect(analysis.keyMoments.length).toBeGreaterThanOrEqual(3);
    const white = analysis.moves.filter((m) => m.seat === 0);
    const worst = [...white].sort((a, b) => b.loss - a.loss)[0];
    expect(worst?.verdict === 'blunder' || worst?.verdict === 'mistake').toBe(true);
    expect(worst?.reason?.key).toMatch(/^why\./);
    expect(worst?.accept.length).toBeGreaterThan(0);
    expect(analysis.accuracy['0']).toBeLessThan(analysis.accuracy['1'] as number);
    // The last move mates, so it is the best move and loses nothing.
    expect(analysis.moves[13]?.loss).toBe(0);
  }, 120_000);

  it('names the reason when a move allows mate', async () => {
    const record = play(['f3', 'e5', 'g4', 'Qh4#']);

    const analysis = await analyseChessGame(record, ask, () => undefined, () => false);
    const g4 = analysis?.moves[2];
    expect(g4?.verdict).toBe('blunder');
    expect(g4?.reason).toEqual({ key: 'why.allows-mate', params: { n: 1 } });
  }, 60_000);
});
