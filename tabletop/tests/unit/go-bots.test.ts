// Go CPU levels and coach: legal and sensible choices, passing, marking, handicap, advice.
import { describe, expect, it } from 'vitest';
import { runMatch } from '../../src/ai/ladder';
import { findLegal } from '../../src/core/contract';
import type { Json } from '../../src/core/json';
import { isJsonObject } from '../../src/core/json';
import { createRng } from '../../src/core/rng';
import { goBots, LEVEL_PARAMS, scaled } from '../../src/games/go/bots';
import type { GoAction, GoState } from '../../src/games/go/rules';
import { go, makeConfig, positionText } from '../../src/games/go/rules';

const at = (text: string): GoState => go.codec.state.fromText(text);

async function choose(state: GoState, level: number, seed = 'bot'): Promise<GoAction> {
  const seat = go.turn(state) as number;
  const choice = await goBots.choose({ view: go.view(state, seat), seat, level, rng: createRng(seed) });
  expect(findLegal(go, state, seat, choice.action), `level ${level} chose ${go.codec.action.toText(choice.action)}`).not.toBeNull();
  return choice.action;
}

async function advise(state: GoState, query: Json): Promise<Json> {
  const seat = go.turn(state) as number;
  return goBots.advise?.({ view: go.view(state, seat), seat, query, rng: createRng('coach') }) ?? null;
}

function play(state: GoState, ...moves: string[]): GoState {
  let s = state;
  for (const m of moves) {
    const seat = go.turn(s) as number;
    const a = findLegal(go, s, seat, go.codec.action.fromText(m, s));
    if (!a) throw new Error(`${m} is not legal`);
    s = go.apply(s, a).state;
  }
  return s;
}

const E9 = '.........';

describe('go bots', () => {
  it('every level answers with a legal move on every board size', async () => {
    for (const size of [9, 13, 19]) {
      const s = play(go.setup(makeConfig(size, 'chinese'), createRng('x')), size === 9 ? 'E5' : 'D4');
      for (const level of goBots.levels.map((l) => l.level)) await choose(s, level);
    }
  }, 120_000);

  it('budgets shrink on bigger boards and grow with the level', () => {
    const budgets = goBots.levels.map((l) => (LEVEL_PARAMS[l.level] as { playouts: number }).playouts);
    expect([...budgets].sort((a, b) => a - b)).toEqual(budgets);
    expect(scaled(9000, 19)).toBeLessThan(scaled(9000, 13));
    expect(scaled(9000, 13)).toBeLessThan(scaled(9000, 9));
  });

  it('the top level answers an opening move on 9×9 within a few seconds of processor time', async () => {
    // Processor time rather than the clock, so a busy machine does not fail the test.
    const cpu = process.cpuUsage();
    const started = Date.now();
    await choose(go.setup(makeConfig(9, 'chinese'), createRng('x')), 6);
    const used = process.cpuUsage(cpu);
    const ms = Math.round((used.user + used.system) / 1000);
    console.log(`level 6 opening move on 9×9: ${ms} ms of processor time, ${Date.now() - started} ms on the clock`);
    expect(ms).toBeLessThan(5_000);
  }, 120_000);

  it('takes a big chain in atari and saves its own', async () => {
    // White's five stones on the left have one liberty, B4; played there, they would join the
    // white stones on the right and get away.
    const take = at(['X........', 'OX.......', 'OX.......', 'OX.......', 'OX.......', 'O.OO.....', 'X.O......', E9, E9].join('/') + ' b');
    expect(go.codec.action.toText(await choose(take, 4))).toBe('B4');
    // The same with the colours swapped: Black must connect its five stones.
    const save = at(['O........', 'XO.......', 'XO.......', 'XO.......', 'XO.......', 'X.XX.....', 'O.X......', E9, E9].join('/') + ' b');
    expect(go.codec.action.toText(await choose(save, 4))).toBe('B4');
  }, 60_000);

  it('passes back when the count is won, and plays on when it is not', async () => {
    // Narrow areas nobody can invade: Black has 45 points, White 36 plus 7.5 komi.
    const settled = Array.from({ length: 9 }, () => '..XO..OX.').join('/');
    const won = play(at(`${settled} w`), 'pass');
    expect((await choose(won, 3)).type).toBe('pass');
    // Black passes with a big open area still to fight for: White keeps playing.
    const open = play(at(['.........', '.........', '.........', '....O....', '.........', '.........', '.........', '...X.....', '.........'].join('/') + ' w'), 'pass');
    expect(open.passes).toBe(1);
    const reply = await choose(open, 3);
    expect(reply.type).toBe('play');
  }, 60_000);

  it('marks dead stones chain by chain, says done, and accepts an equal marking', async () => {
    // A lone white stone in Black's narrow area is dead.
    const rows = Array.from({ length: 9 }, () => '..XO..OX.');
    rows[4] = 'O.XO..OX.';
    let s = play(at(rows.join('/') + ' b'), 'pass', 'pass');
    expect(s.phase).toBe('scoring');
    expect(go.turn(s)).toBe(0);
    const first = await choose(s, 2);
    expect(go.codec.action.toText(first)).toBe('dead A5');
    s = go.apply(s, first).state;
    expect((await choose(s, 2)).type).toBe('done');
    s = play(s, 'done');
    // White (the CPU) agrees to the same marking.
    expect((await choose(s, 5)).type).toBe('done');
  }, 60_000);

  it('places free handicap stones on the traditional points', async () => {
    let s = go.setup(makeConfig(9, 'chinese', 3), createRng('x'));
    for (const expected of ['G7', 'C3', 'G3']) {
      const a = await choose(s, 1);
      expect(go.codec.action.toText(a)).toBe(expected);
      s = go.apply(s, a).state;
    }
    expect(s.phase).toBe('play');
  });

  it('answers the coach: hint, threats, territory, dead stones, best, analyse, check-move', async () => {
    const s = play(go.setup(makeConfig(9, 'chinese'), createRng('x')), 'E5', 'D5', 'D4', 'C4');
    const hint = await advise(s, { type: 'hint' });
    expect(isJsonObject(hint) && typeof hint.name === 'string' && typeof hint.idea === 'string').toBe(true);
    const territory = await advise(s, { type: 'territory' });
    expect(isJsonObject(territory) && Array.isArray(territory.ownership) && territory.ownership.length === 81).toBe(true);
    const threats = await advise(s, { type: 'threats' });
    expect(isJsonObject(threats) && Array.isArray(threats.atari)).toBe(true);
    const best = await advise(s, { type: 'best', nodes: 40_000 });
    expect(isJsonObject(best) && typeof best.uci === 'string').toBe(true);
    const analysis = await advise(s, { type: 'analyse', playouts: 500 });
    expect(isJsonObject(analysis) && Array.isArray(analysis.lines) && analysis.lines.length > 0).toBe(true);
    expect(isJsonObject(await advise(at(Array.from({ length: 9 }, () => '..XO..OX.').join('/') + ' b pass=2,w phase=scoring,b'), { type: 'dead' }))).toBe(true);
    // Leaving five stones in atari to play in a far corner is a blunder; saving them is not.
    const risky = at(['O........', 'XO.......', 'XO.......', 'XO.......', 'XO.......', 'X.XX.....', 'O.X......', E9, E9].join('/') + ' b');
    const check = await advise(risky, { type: 'check-move', move: 'ii' });
    expect(isJsonObject(check) && check.warn).toBe(true);
    const fine = await advise(risky, { type: 'check-move', move: 'bf' });
    expect(isJsonObject(fine) && fine.warn).toBe(false);
  }, 120_000);

  it('level 1 beats random play', async () => {
    const random = { name: 'random', choose: (view: GoState, seat: number, rng: ReturnType<typeof createRng>) => {
      const legal = go.legal(view, seat);
      return view.phase === 'scoring' ? (legal.find((a) => a.type === 'done') as GoAction) : rng.pick(legal);
    } };
    const l1 = { name: 'L1', choose: async (view: GoState, seat: number, rng: ReturnType<typeof createRng>) => (await goBots.choose({ view, seat, level: 1, rng })).action };
    const r = await runMatch(go, makeConfig(9, 'chinese'), l1, random, 4, 'unit-ladder');
    expect(r.score).toBeGreaterThanOrEqual(0.75);
  }, 120_000);

  it('keeps positions it is given unchanged', async () => {
    const s = play(go.setup(makeConfig(9, 'chinese'), createRng('x')), 'E5');
    const before = positionText(s);
    await choose(s, 2);
    expect(positionText(s)).toBe(before);
  });
});
