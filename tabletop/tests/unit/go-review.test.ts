// Go game review: every move rated, mistakes explained in one sentence, key moments, play on.
import { describe, expect, it } from 'vitest';
import { findLegal } from '../../src/core/contract';
import type { Json } from '../../src/core/json';
import type { GameRecord } from '../../src/core/record';
import { newRecord, withAction, withOutcome } from '../../src/core/record';
import { createRng } from '../../src/core/rng';
import { goBots } from '../../src/games/go/bots';
import { analyseGoGame, reasonFor } from '../../src/games/go/review';
import type { GoAction, GoState } from '../../src/games/go/rules';
import { configAt, go, makeConfig } from '../../src/games/go/rules';
import { MAX_KEY_MOMENTS } from '../../src/teach/analysis';
import { hasText } from '../../src/text';

const at = (text: string): GoState => go.codec.state.fromText(text);

function act(state: GoState, move: string): GoAction {
  const a = findLegal(go, state, go.turn(state) as number, go.codec.action.fromText(move, state));
  if (!a) throw new Error(`${move} is not legal`);
  return a;
}

function recordOf(moves: readonly string[]): GameRecord {
  const config = makeConfig(9, 'chinese');
  let state = go.setup(config, createRng('review'));
  let record = newRecord(go, { id: 'r', config, seed: 'review', players: [{ kind: 'human' }, { kind: 'bot', level: 3 }], appVersion: 'test', training: false, now: 0 });
  for (const m of moves) {
    const a = act(state, m);
    state = go.apply(state, a).state;
    record = withAction(record, go.codec.action.toJSON(a), 1);
  }
  const outcome = go.outcome(state);
  return outcome ? withOutcome(record, outcome, 2) : record;
}

const ask = (query: Json, position?: unknown) => {
  const view = position as GoState;
  const seat = go.turn(view) ?? 0;
  return Promise.resolve(goBots.advise?.({ view, seat, query, rng: createRng('review/coach') }) ?? null);
};

describe('go review', () => {
  it('rates every move, explains the mistakes and picks key moments', async () => {
    // Black leaves a stone in atari twice; White takes it.
    const record = recordOf(['C3', 'B3', 'G7', 'C4', 'G3', 'D3', 'G5', 'C2', 'E5', 'pass', 'pass', 'done', 'done']);
    const progress: number[] = [];
    const analysis = await analyseGoGame(record, ask, (done) => progress.push(done), () => false);
    if (!analysis) throw new Error('no analysis');
    expect(analysis.moves).toHaveLength(record.actions.length);
    expect(progress.length).toBeGreaterThan(5);
    for (const m of analysis.moves) {
      expect(m.accuracy).toBeGreaterThanOrEqual(0);
      expect(m.accuracy).toBeLessThanOrEqual(100);
      if (m.reason) expect(hasText(m.reason.key), m.reason.key).toBe(true);
      if (m.verdict === 'mistake' || m.verdict === 'blunder') expect(m.reason).not.toBeNull();
    }
    // The marking at the end is not rated.
    expect(analysis.moves.slice(-2).every((m) => m.verdict === 'best' && m.loss === 0)).toBe(true);
    expect(analysis.keyMoments.length).toBeLessThanOrEqual(MAX_KEY_MOMENTS);
    expect(Object.keys(analysis.accuracy).sort()).toEqual(['0', '1']);
    // Best moves are stored in SGF form, so the board can ring them on any size.
    expect(analysis.moves.filter((m) => m.bestMove).every((m) => /^([a-s]{2}|pass)$/.test(m.bestMove ?? ''))).toBe(true);
  }, 120_000);

  it('gives the one-sentence reasons', () => {
    const best = (name: string, move: string) => ({ move, name, value: 60 });
    // Missed capture: the white stone on C3 can be taken at D3.
    const capture = at('...../..X../.XO../..X../..... b');
    expect(reasonFor(capture, act(capture, 'A1'), go.apply(capture, act(capture, 'A1')).state, best('D3', 'dc'))?.key).toBe('why.go-missed-capture');
    // Passing while a capture is on the board.
    expect(reasonFor(capture, { type: 'pass' }, go.apply(capture, { type: 'pass' }).state, best('D3', 'dc'))?.key).toBe('why.go-early-pass');
    // Self-atari of two stones.
    const self = at('...../.OO../O.X../.OXO./..O.. b');
    const move = act(self, 'B3');
    expect(reasonFor(self, move, go.apply(self, move).state, best('E5', 'ea'))?.key).toBe('why.go-self-atari');
    // Nothing tactical: a bigger move.
    const quiet = at('...../...../..X../...../..... w');
    expect(reasonFor(quiet, act(quiet, 'A1'), go.apply(quiet, act(quiet, 'A1')).state, best('C4', 'cb'))?.key).toBe('why.go-bigger');
  });

  it('plays on from any position with the same rules', () => {
    const s = go.apply(go.setup(makeConfig(13, 'japanese', 2), createRng('x')), { type: 'play', at: 'jj', name: '' }).state;
    const c = configAt(s);
    expect(c.rules).toEqual(s.rules);
    expect(go.setup(c, createRng('y')).board).toBe(s.board);
  });
});
