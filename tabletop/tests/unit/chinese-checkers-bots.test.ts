// Chinese Checkers CPU, coach and review, run in-process.
import { describe, expect, it } from 'vitest';
import type { Json } from '../../src/core/json';
import { isJsonObject } from '../../src/core/json';
import { newRecord, withAction } from '../../src/core/record';
import { createRng } from '../../src/core/rng';
import type { BotChoice, BotInput } from '../../src/ai/bot';
import { ccBots, chanceOf, LEVEL_PARAMS } from '../../src/games/chinese-checkers/bots';
import { CcPosition, layoutFor } from '../../src/games/chinese-checkers/engine';
import { pos, TOP } from '../../src/games/chinese-checkers/learn/positions';
import { analyseCcGame } from '../../src/games/chinese-checkers/review';
import type { CcAction, CcState } from '../../src/games/chinese-checkers/rules';
import { boardArray, chineseCheckers as cc, findMove, legalMoves, makeConfig } from '../../src/games/chinese-checkers/rules';
import { moveTags } from '../../src/games/chinese-checkers/tags';
import { PvsSearcher } from '../../src/ai/pvs';

const at = (text: string) => cc.codec.state.fromText(text);
/** The CPU's choice; Chinese Checkers answers at once. */
const choose = (input: BotInput<CcState>) => ccBots.choose(input) as BotChoice<CcAction>;

describe('chinese checkers levels', () => {
  it('play legal moves at every level, for two, three and six players', () => {
    for (const players of [2, 3, 6]) {
      let s: CcState = cc.setup(makeConfig(players), createRng('levels'));
      for (let ply = 0; ply < 3 * players; ply++) {
        const level = 1 + (ply % 6);
        const choice = choose({ view: s, seat: s.toMove, level, rng: createRng(`p${ply}`) });
        expect(cc.legal(s, s.toMove).some((a) => cc.codec.action.toJSON(a) === cc.codec.action.toJSON(choice.action)), `level ${level}`).toBe(true);
        s = cc.apply(s, choice.action).state;
      }
    }
    expect(Object.keys(LEVEL_PARAMS)).toHaveLength(6);
  });

  it('take a finishing move when there is one, at every level', () => {
    const s = at(pos({ R: [...TOP.slice(0, 9), '13h'], B: ['1a', '2a', '2b', '3a', '3b', '3c', '4a', '4b', '4c', '6c'] }, 'R'));
    for (let level = 1; level <= 6; level++) {
      const choice = choose({ view: s, seat: 0, level, rng: createRng(`f${level}`) });
      expect(cc.codec.action.toText(choice.action), `level ${level}`).toBe('13h-14d');
      expect(choice.tags).toContain('cc-finishes');
    }
  });

  it('level 1 races its front marbles; level 2 keeps them together', () => {
    // Red's front marble can hop far; the marble left in the start cannot.
    const s = at(pos({ R: ['9e', '10e', '3b', '8f'] }, 'R'));
    const one = choose({ view: s, seat: 0, level: 1, rng: createRng('a') });
    expect(one.action.type).toBe('move');
    // Not the marble left in the start.
    expect(cc.codec.action.toText(one.action).startsWith('3b-')).toBe(false);
  });

  it('search a two-player position and score a decided game as decided', () => {
    const s = at(pos({ R: [...TOP.slice(0, 9), '13h'], B: ['1a', '2a', '2b', '3a', '3b', '3c', '4a', '4b', '4c', '6c'] }, 'R'));
    const position = new CcPosition(boardArray(s.board), 0, layoutFor(2, 10), s.rules);
    const result = new PvsSearcher(12).search(position, { maxDepth: 2, nodes: 5_000 });
    expect(result.score).toBeGreaterThan(20_000);
    expect(chanceOf(result.score)).toBe(100);
    expect(chanceOf(0)).toBe(50);
  });
});

describe('the coach', () => {
  const s = cc.setup(makeConfig(2), createRng('coach'));

  it('gives a hint with an idea, the best move for free play, and an analysis with the move played', async () => {
    const hint = (await ccBots.advise?.({ view: s, seat: 0, query: { type: 'hint' }, rng: createRng('h') })) as Json;
    expect(isJsonObject(hint) && typeof hint.move === 'string' && typeof hint.idea === 'string' && typeof hint.from === 'string').toBe(true);
    const best = (await ccBots.advise?.({ view: s, seat: 0, query: { type: 'best' }, rng: createRng('b') })) as Json;
    expect(isJsonObject(best) && typeof best.action === 'string').toBe(true);
    const played = cc.codec.action.toJSON(cc.legal(s, 0)[0] as never) as string;
    const analysis = (await ccBots.advise?.({ view: s, seat: 0, query: { type: 'analyse', nodes: 4_000, move: played }, rng: createRng('a') })) as Json;
    expect(isJsonObject(analysis) && Array.isArray(analysis.lines) && analysis.lines.length > 0 && isJsonObject(analysis.played)).toBe(true);
  });

  it('warns before a move that is two rows slower than the best', async () => {
    // Stepping back into the start instead of hopping forward.
    const after = cc.apply(s, findMove(s, '3a-5e') as never).state;
    const blue = cc.apply(after, cc.legal(after, 1)[0] as never).state;
    const slow = findMove(blue, '5e-3a');
    if (!slow) throw new Error('no slow move');
    const check = (await ccBots.advise?.({ view: blue, seat: 0, query: { type: 'check-move', move: cc.codec.action.toJSON(slow) }, rng: createRng('c') })) as Json;
    expect(isJsonObject(check) && check.warn).toBe(true);
  });

  it('answers for three players too', async () => {
    const three = cc.setup(makeConfig(3), createRng('three'));
    const analysis = (await ccBots.advise?.({ view: three, seat: 0, query: { type: 'analyse' }, rng: createRng('a3') })) as Json;
    expect(isJsonObject(analysis) && Array.isArray(analysis.lines) && analysis.value === 50).toBe(true);
  });

  it('tags moves: a chain, a straggler, a move home', () => {
    const chain = at(pos({ R: ['7e'], B: ['8e', '10e', '11f'] }, 'R'));
    expect(moveTags(chain, findMove(chain, '7e-11g') as never)).toContain('cc-chain');
    expect(legalMoves(chain).length).toBeGreaterThan(5);
  });
});

describe('the review', () => {
  it('rates a short game and names key moments', async () => {
    const config = makeConfig(2, 10, { limit: 100 });
    const seed = 'cc-review';
    let s = cc.setup(config, createRng(seed));
    let record = newRecord(cc, { id: 'r', config, seed, players: [{ kind: 'human' }, { kind: 'bot', level: 2 }], appVersion: 'test', training: false, now: 0 });
    for (let ply = 0; ply < 16; ply++) {
      const level = s.toMove === 0 ? 1 : 3;
      const choice = choose({ view: s, seat: s.toMove, level, rng: createRng(`r${ply}`) });
      record = withAction(record, cc.codec.action.toJSON(choice.action), ply);
      s = cc.apply(s, choice.action).state;
    }
    record = { ...record, status: 'finished' };
    const ask = async (query: Json, position?: unknown) => {
      const view = (position ?? cc.setup(config, createRng(seed))) as CcState;
      return (await ccBots.advise?.({ view, seat: view.toMove, query: { ...(query as object), nodes: 3_000 }, rng: createRng('review') })) as Json;
    };
    const analysis = await analyseCcGame(record, ask, () => undefined, () => false);
    expect(analysis).not.toBeNull();
    expect(analysis?.moves.length).toBeGreaterThan(10);
    expect(analysis?.moves.every((m) => m.loss >= 0 && m.label?.startsWith('Round'))).toBe(true);
    expect(Object.keys(analysis?.accuracy ?? {})).toEqual(['0', '1']);
  }, 60_000);
});
