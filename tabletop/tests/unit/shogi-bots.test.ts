import { describe, expect, it } from 'vitest';
import type { BotChoice } from '../../src/ai/bot';
import { runMatch } from '../../src/ai/ladder';
import { isMateScore, matePlies } from '../../src/ai/pvs';
import { randomChoice } from '../../src/ai/random-bot';
import type { Json } from '../../src/core/json';
import { isJsonObject } from '../../src/core/json';
import { createRng } from '../../src/core/rng';
import { pickWithErrors, searchState, shogiBots } from '../../src/games/shogi/bots';
import { HAND_TYPES, parseSfen, Position, START_SFEN } from '../../src/games/shogi/core';
import { evaluate } from '../../src/games/shogi/engine';
import { LEVEL_PARAMS, SHOGI_LEVELS } from '../../src/games/shogi/levels';
import { MateSolver } from '../../src/games/shogi/mate';
import { canonicalOf } from '../../src/games/shogi/notation';
import type { ShogiAction, ShogiState } from '../../src/games/shogi/rules';
import { canonicalAction, shogi, stateFromSfen } from '../../src/games/shogi/rules';

const at = (sfen: string, rules: Partial<ShogiState['rules']> = {}) => stateFromSfen(sfen, rules);
const choose = (state: ShogiState, level: number, seed = 'x') => shogiBots.choose({ view: state, seat: shogi.turn(state) ?? 0, level, rng: createRng(seed) }) as BotChoice<ShogiAction>;
const advise = (state: ShogiState, query: Json) => shogiBots.advise?.({ view: state, seat: shogi.turn(state) ?? 0, query, rng: createRng('a') }) as Json;

/** The same position turned round: colours swapped, board rotated, hands swapped. */
function mirror(sfen: string): string {
  const p = parseSfen(sfen);
  const m = new Position(p.geo.kind);
  for (const sq of p.geo.squares) {
    const code = p.board[sq]!;
    if (code === 0) continue;
    const file = p.geo.fileOf[sq]!;
    const rank = p.geo.rankOf[sq]!;
    const target = m.geo.squares.find((x) => m.geo.fileOf[x] === p.geo.files + 1 - file && m.geo.rankOf[x] === p.geo.ranks + 1 - rank)!;
    m.board[target] = code ^ 16;
  }
  for (let type = 0; type < HAND_TYPES; type++) {
    m.hand[type] = p.handCount(1, type);
    m.hand[HAND_TYPES + type] = p.handCount(0, type);
  }
  m.side = p.side === 0 ? 1 : 0;
  m.rehash();
  return m.sfen();
}

describe('the shogi engine', () => {
  it('finds a mate in one, and reports it as a mate', () => {
    const { result, p } = searchState(at('4k4/9/4P4/9/9/9/9/9/4K4 b G 1'), { nodes: 20_000 });
    expect(canonicalOf(p.geo, result.best)).toBe('G*52');
    expect(isMateScore(result.score)).toBe(true);
    expect(matePlies(result.score)).toBe(1);
  });

  it('gives the same answer for the same budget, and an aborted search leaves the position as it was', () => {
    const state = shogi.setup({}, createRng('x'));
    const a = searchState(state, { nodes: 30_000 });
    const b = searchState(state, { nodes: 30_000 });
    expect(a.result.best).toBe(b.result.best);
    expect(a.result.complete).toBe(false);
    expect(a.p.sfen()).toBe(state.sfen);
    expect(a.result.nodes).toBeLessThanOrEqual(30_001);
  });

  it('evaluates a position and its mirror image the same, for the side to move', () => {
    for (const sfen of [START_SFEN.standard, START_SFEN.mini, 'l6nl/5+P1gk/2np1S3/p1p4Pp/3P2Sp1/1PPb2P1P/P5GS1/R8/LN4bKL w RGgsn5p 1', '4k4/1r1g5/9/9/9/9/P8/LS7/KNG6 b N 1']) {
      expect(evaluate(parseSfen(mirror(sfen)))).toBe(evaluate(parseSfen(sfen)));
    }
  });

  it('answers within a few seconds at the top level (a phone is about three times slower)', () => {
    const started = Date.now();
    const choice = choose(shogi.apply(shogi.setup({}, createRng('x')), shogi.codec.action.fromText('7776', shogi.setup({}, createRng('x')))).state, 8);
    expect(choice.nodes).toBeGreaterThan(100_000);
    expect(Date.now() - started).toBeLessThan(6_000);
  }, 20_000);
});

describe('mate search', () => {
  it('proves a mate in three by checks, with its single first move and the longest defence', () => {
    const p = parseSfen('7sk/6G1n/9/9/9/9/9/9/K8 b RG 1');
    const solver = new MateSolver(p);
    expect(solver.shortest(5)).toBe(3);
    const main = solver.mainLine(3);
    expect(main?.unique).toBe(true);
    expect(main?.line.map((m) => canonicalOf(p.geo, m))).toEqual(['G*22', '2122', 'R*21']);
    expect(solver.mateMoves(3).map((m) => canonicalOf(p.geo, m))).toEqual(['G*22']);
  });

  it('never counts a pawn-drop mate, and finds no mate where there is none', () => {
    expect(new MateSolver(parseSfen('7nk/7p1/7S1/9/9/9/9/9/K8 b P 1')).shortest(3)).toBeNull();
    expect(new MateSolver(parseSfen(START_SFEN.standard)).shortest(3)).toBeNull();
  });
});

describe('levels', () => {
  it('has eight levels with rising ratings and node budgets', () => {
    expect(SHOGI_LEVELS.map((l) => l.level)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    for (let i = 1; i < SHOGI_LEVELS.length; i++) {
      expect(SHOGI_LEVELS[i]!.rating).toBeGreaterThan(SHOGI_LEVELS[i - 1]!.rating);
      expect(LEVEL_PARAMS[i + 1]!.nodes).toBeGreaterThan(LEVEL_PARAMS[i]!.nodes);
    }
  });

  it('every level plays a legal move, the same one again for the same seed', () => {
    const middle = at('ln1g3nl/1r1sg1k2/p1pppp1pp/1p4p2/7P1/2P6/PPSPPPP1P/1B5R1/LN1GKGSNL b Bs 1');
    for (const level of [1, 2, 3, 4, 5]) {
      const a = choose(middle, level, `s${level}`);
      const b = choose(middle, level, `s${level}`);
      expect(shogi.legal(middle, 0).some((x) => canonicalAction(x) === canonicalAction(a.action))).toBe(true);
      expect(canonicalAction(a.action)).toBe(canonicalAction(b.action));
    }
  });

  it('planned mistakes stay inside the level’s window and never pass up a mate', () => {
    const state = at('ln1g3nl/1r1sg1k2/p1pppp1pp/1p4p2/7P1/2P6/PPSPPPP1P/1B5R1/LN1GKGSNL b Bs 1');
    const { result } = searchState(state, { nodes: 20_000, maxDepth: 2, exact: true });
    const top = result.scored[0]!.score;
    for (let i = 0; i < 100; i++) {
      const m = pickWithErrors(result, { ...LEVEL_PARAMS[2]!, error: 1 }, createRng(`m${i}`));
      const score = result.scored.find((s) => s.move === m)!.score;
      expect(top - score).toBeLessThanOrEqual(LEVEL_PARAMS[2]!.window);
    }
    const mate = searchState(at('4k4/9/4P4/9/9/9/9/9/4K4 b G 1'), { nodes: 20_000, maxDepth: 1, exact: true });
    for (let i = 0; i < 20; i++) expect(pickWithErrors(mate.result, { ...LEVEL_PARAMS[1]!, error: 1 }, createRng(`k${i}`))).toBe(mate.result.best);
  });

  it('claims a winning impasse', () => {
    const state = at('5G3/4K4/PPPPPPPPP/9/9/9/9/4k4/9 b 2R2B3g4s4n4l9p 1', { impasse: 'declare-27' });
    expect(choose(state, 4).action.type).toBe('declare');
  });

  it('level 1 beats random play, and level 3 beats level 1', async () => {
    const config = { moveLimit: 200 };
    const bot = (level: number) => ({ name: `L${level}`, choose: (view: ShogiState, seat: number, rng: ReturnType<typeof createRng>) => (shogiBots.choose({ view, seat, level, rng }) as BotChoice<ShogiAction>).action });
    const random = { name: 'random', choose: (view: ShogiState, seat: number, rng: ReturnType<typeof createRng>) => randomChoice(shogi, view, seat, rng) };
    const vsRandom = await runMatch(shogi, config, bot(1), random, 4, 'unit-l1');
    expect(vsRandom.score).toBeGreaterThanOrEqual(0.75);
    const l3 = await runMatch(shogi, config, bot(3), bot(1), 4, 'unit-l3');
    expect(l3.score).toBeGreaterThanOrEqual(0.75);
  }, 120_000);
});

describe('the coach', () => {
  it('gives a hint with an idea, and the best move for free play', () => {
    const hint = advise(at('4k4/9/4P4/9/9/9/9/9/4K4 b G 1'), { type: 'hint' });
    expect(isJsonObject(hint) && hint.move).toBe('G*52');
    expect(isJsonObject(hint) && hint.idea).toBe('mate');
    expect(isJsonObject(hint) && hint.drop).toBe('G');
    const best = advise(at('4k4/9/4P4/9/9/9/9/9/4K4 b G 1'), { type: 'best', nodes: 5_000 });
    expect(isJsonObject(best) && best.uci).toBe('G*52');
  });

  it('sees a threat of mate', () => {
    const answer = advise(at('4k4/9/9/9/9/9/4p4/9/4K4 b g 1'), { type: 'threats' });
    expect(isJsonObject(answer) && Array.isArray(answer.threats) && answer.threats.length).toBe(1);
    const threat = isJsonObject(answer) && Array.isArray(answer.threats) ? answer.threats[0] : null;
    expect(isJsonObject(threat) && threat.move).toBe('G*58');
    expect(isJsonObject(threat) && threat.mate).toBe(1);
  });

  it('warns before a piece is left to be taken', () => {
    const answer = advise(at('4k4/9/9/9/4g4/9/9/4R4/4K4 b - 1'), { type: 'check-move', move: '5856' });
    expect(isJsonObject(answer) && answer.warn).toBe(true);
    expect(isJsonObject(answer) && answer.reason).toBe('hangs-rook');
    // Taking the gold is the best move, so it gets no warning.
    const fine = advise(at('4k4/9/9/9/4g4/9/9/4R4/4K4 b - 1'), { type: 'check-move', move: '5855' });
    expect(isJsonObject(fine) && fine.warn).toBe(false);
  });

  it('analyses with two lines and finds short mates', () => {
    const answer = advise(shogi.setup({}, createRng('x')), { type: 'analyse', nodes: 5_000, multiPv: 2 });
    expect(isJsonObject(answer) && Array.isArray(answer.lines) && answer.lines.length).toBe(2);
    const mate = advise(at('7sk/6G1n/9/9/9/9/9/9/K8 b RG 1'), { type: 'mate', plies: 5 });
    expect(isJsonObject(mate) && mate.mate).toBe(3);
    const evalAnswer = advise(at('4k4/9/4P4/9/9/9/9/9/4K4 b G 1'), { type: 'eval' });
    expect(isJsonObject(evalAnswer) && evalAnswer.mate).toBe(1);
  });
});
