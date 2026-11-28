/**
 * American-format golden cases (docs/rules/mahjong-american.md): winning hands from the card with
 * and without jokers, exposures, concealed hands, values and payments; and on the engine the
 * Charleston (three passes, no jokers, the vote, the courtesy pass, blind passing), exposures with
 * jokers, Mah Jongg beating an exposure, dead jokers, the joker exchange and dead hands.
 */
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { decide } from '../../src/games/mahjong/bots';
import type { Meld, StyleOptions, WinContext } from '../../src/games/mahjong/core/style';
import { FLOWER_1, JOKER, kindOf, parseKinds, tileId } from '../../src/games/mahjong/core/tiles';
import type { MahjongAction, MahjongState } from '../../src/games/mahjong/rules';
import { checkConservation, engine, mahjong, position, viewOf } from '../../src/games/mahjong/rules';
import { american, AMERICAN_DEFAULTS, charleston, exposuresFit } from '../../src/games/mahjong/styles/american';

const O = (extra: StyleOptions = {}): StyleOptions => ({ ...AMERICAN_DEFAULTS, ...extra });

/** A meld of kind `code` and `size`, `jokers` of them jokers. */
function meld(code: string, size: number, jokers = 0): Meld {
  const k = parseKinds(code)[0] as number;
  const tiles = [...Array.from({ length: size - jokers }, (_, i) => tileId(k, i % 4)), ...Array.from({ length: jokers }, (_, i) => tileId(JOKER, 7 - i))];
  return { type: size === 3 ? 'pung' : size === 4 ? 'kong' : size === 5 ? 'quint' : 'sextet', tiles, claimed: tiles[0] ?? null, from: 1, concealed: false, added: false, kind: k };
}

function ctx(hand: string, melds: Meld[] = [], selfDrawn = true): WinContext {
  const concealed = parseKinds(hand);
  return { seat: 0, tile: concealed[concealed.length - 1] ?? 0, selfDrawn, from: selfDrawn ? null : 2, concealed, melds, bonus: [], seatWind: 0, prevailingWind: 0, dealer: false, lastTile: false, lastDiscard: false, kongs: 0, robbed: false, heavenly: false, earthly: false };
}

describe('winning from the practice card', () => {
  it('"FFF 2222a 44b 666c 88a = 25 X" with natural tiles: jokerless, doubled to 50', () => {
    const s = american.score(ctx('F1 F2 F3 2m 2m 2m 2m 4p 4p 6s 6s 6s 8m 8m'), O());
    expect(s?.lines.map((l) => l.id)).toEqual(['am-hand', 'am-jokerless']);
    expect(s?.lines[0]?.label).toBe('Evens: FFF 2222a 44b 666c 88a');
    expect(s?.total).toBe(50);
    expect(american.score(ctx('F1 F2 F3 2m 2m 2m 2m 4p 4p 6s 6s 6s 8m 8m'), O({ jokerless: 'off' }))?.total).toBe(25);
  });

  it('jokers stand in sets, never in a pair', () => {
    expect(american.score(ctx('F1 J F3 2m J 2m 2m 4p 4p 6s J 6s 8m 8m'), O())?.total).toBe(25);
    expect(american.score(ctx('F1 F2 F3 2m 2m 2m 2m 4p J 6s 6s 6s 8m 8m'), O())).toBeNull();
  });

  it('a quint needs a joker; flowers are all alike', () => {
    // FFFFF NNNN 55555a = 45 X
    const s = american.score(ctx('F1 F2 S3 F4 S1 N N N N 5p 5p 5p 5p J'), O());
    expect(s?.total).toBe(45);
  });

  it('exposures must be sets of the hand; a concealed hand takes none, but wins on a discard', () => {
    const exposed = american.score(ctx('F1 F2 F3 4p 4p 6s 6s 6s 8m 8m', [meld('2m', 4, 1)]), O());
    expect(exposed?.total).toBe(25);
    expect(american.score(ctx('F1 F2 F3 2m 4p 4p 6s 6s 6s 8m 8m', [meld('2m', 3)]), O())).toBeNull();
    // 2026a 2026b 2026c FF = 50 C (no jokers can go in it, so no jokerless bonus).
    const year = '2m Wd 2m 6m 2p Wd 2p 6p 2s Wd 2s 6s F1 F2';
    expect(american.score(ctx(year, [], false), O())?.total).toBe(50);
    expect(american.score(ctx('2p Wd 2p 6p 2s Wd 2s 6s F1 F2 F3', [meld('2m', 3)]), O())).toBeNull();
  });

  it('dragons go with suits: red with craks, green with bams, white with dots', () => {
    // 4444a 4444b DDDD 88c: the kong of dragons matches the first suit.
    expect(american.score(ctx('4m 4m 4m 4m 4p 4p 4p 4p Rd Rd Rd Rd 8s 8s'), O())?.total).toBe(60);
    expect(american.score(ctx('4m 4m 4m 4m 4p 4p 4p 4p Gd Gd Gd Gd 8s 8s'), O())).toBeNull();
  });

  it('"shift" lets the numbers move together', () => {
    // 111a 222a 3333a 4444a = 25 X shift, made as 5-6-7-8 dots.
    expect(american.score(ctx('5p 5p 5p 6p 6p 6p 7p 7p 7p 7p 8p 8p 8p 8p'), O())?.total).toBe(50);
  });

  it('a hand that is no card hand cannot win', () => {
    expect(american.score(ctx('1m 2m 3m 4m 5m 6m 7m 8m 9m 1p 2p 3p 5s 5s'), O())).toBeNull();
  });
});

describe('payment', () => {
  const win = (from: number | null, base: number) => [{ seat: 0, from, tile: '1m.0', score: { lines: [], raw: base, total: base, limit: false, unit: 'points', base }, robbed: false }];
  it('on a discard: the thrower pays double, the others single', () => {
    expect(american.settle({ wins: win(2, 25), dealer: 0, seats: 4 }, O())).toEqual([100, -25, -50, -25]);
  });
  it('self-picked: everyone pays double; the flat table: everyone pays the value', () => {
    expect(american.settle({ wins: win(null, 30), dealer: 0, seats: 4 }, O())).toEqual([180, -60, -60, -60]);
    expect(american.settle({ wins: win(2, 30), dealer: 0, seats: 4 }, O({ payment: 'flat' }))).toEqual([90, -30, -30, -30]);
  });
});

describe('the Charleston as passing rounds', () => {
  it('first, second (on a vote) and courtesy, blind on the last pass of each', () => {
    const r = charleston(O());
    expect(r.map((x) => x.dir)).toEqual([1, 2, 3, 3, 2, 1, 2]);
    expect(r.filter((x) => x.blind).length).toBe(2);
    expect(r[3]?.vote).toBe(true);
    expect(r[6]?.courtesy).toBe(true);
    expect(charleston(O({ secondCharleston: 'off', courtesy: 'off' })).length).toBe(3);
    expect(charleston(O({ secondCharleston: 'always' }))[3]?.vote).toBe(false);
  });
});

// The engine

const act = (s: MahjongState, a: MahjongAction) => engine.apply(s, a).state;
const legal = (s: MahjongState) => engine.legal(s, s.turn);

describe('the American engine', () => {
  it('deals 152 tiles and plays the Charleston: jokers never pass, every hand keeps its size', () => {
    let s = mahjong.setup({ style: 'american', options: O() }, createRng('charleston'));
    expect(s.phase).toBe('pass');
    expect(s.wall.length + s.hands.flat().length).toBe(152);
    const sizes = s.hands.map((h) => h.length);
    // Three passes of the first Charleston.
    for (let i = 0; i < 12; i++) {
      const options = legal(s);
      expect(options.every((a) => a.type !== 'pass-tiles' || !a.tiles.includes(JOKER))).toBe(true);
      // On the last pass, pass one tile and two blind.
      const blind = options.find((a) => a.type === 'pass-tiles' && a.blind === 2);
      s = act(s, (i >= 8 && blind) || (options.find((a) => a.type === 'pass-tiles' && a.blind === 0 && a.tiles.length === 3) as MahjongAction));
      expect(s.hands.map((h) => h.length)).toEqual(sizes);
    }
    // The vote on the second Charleston: one "no" skips it.
    expect(s.passing?.voting).toBe(true);
    s = act(s, { type: 'vote', yes: true });
    s = act(s, { type: 'vote', yes: false });
    s = act(s, { type: 'vote', yes: true });
    s = act(s, { type: 'vote', yes: true });
    // The courtesy pass: the lower number changes hands.
    expect(engine.passRound(s)?.courtesy).toBe(true);
    const offer = (n: number) => legal(s).find((a) => a.type === 'pass-tiles' && a.tiles.length === n) as MahjongAction;
    const before = s.hands.map((h) => [...h]);
    s = act(s, offer(3));
    s = act(s, offer(0));
    s = act(s, offer(1));
    s = act(s, offer(2));
    expect(s.phase).toBe('act');
    expect(s.hands.map((h) => h.length)).toEqual(sizes);
    // Seats across from each other: the dealer offered 3, the seat across 1: one tile each way.
    const d = s.dealer;
    expect(s.received[(d + 2) % 4]?.length).toBe(1);
    expect(s.received[d]?.length).toBe(1);
    expect(s.received[(d + 1) % 4]?.length).toBe(0);
    void before;
    checkConservation(s);
  });

  /** A table in play: seat 0 to act with the hand named. */
  const table = (hands: string[], extra: Partial<Parameters<typeof position>[0]> = {}) => position({ style: 'american', options: O(), hands, wall: 40, ...extra });

  it('an exposure with jokers on a discard; Mah Jongg beats it; a discarded joker is dead', () => {
    // Seat 0 throws a 2 characters; seat 1 holds one and two jokers; seat 2 wins on it.
    const s = table(['2m 9s 9s 9s 1s 1s 3s 3s 5s 5s 7s 7s 9p 1p', '2m J J 1p 3p 5p 7p 9p 1s 3s 5s 7s 9s', 'F1 F2 F3 2m 2m J 4p 4p 6s 6s 6s 8m 8m', ''], { drawn: '1p' });
    let t = act(s, { type: 'discard', tile: parseKinds('2m')[0] as number });
    expect(t.turn).toBe(1);
    expect(legal(t)).toContainEqual({ type: 'expose', size: 3, jokers: 2 });
    expect(legal(t)).toContainEqual({ type: 'expose', size: 3, jokers: 1 });
    t = act(t, { type: 'expose', size: 3, jokers: 2 });
    expect(t.turn).toBe(2);
    expect(legal(t).some((a) => a.type === 'win')).toBe(true);
    t = act(t, { type: 'win' });
    expect(t.phase).toBe('scored');
    expect(t.results[0]?.wins[0]?.seat).toBe(2);
    // A joker thrown: nobody is asked.
    const j = table(['J 9s 9s 9s 1s 1s 3s 3s 5s 5s 7s 7s 9p 1p', 'J J 1p 3p 5p 7p 9p 1s 3s 5s 7s 9s 2m', '', ''], { drawn: '1p' });
    const after = act(j, { type: 'discard', tile: JOKER });
    expect(after.phase).toBe('act');
    expect(after.turn).toBe(1);
  });

  it('an exposure leaves the caller to throw, with the meld standing for its kind', () => {
    const s = table(['2m 9s 9s 9s 1s 1s 3s 3s 5s 5s 7s 7s 9p 1p', 'F1 F2 2m 2m J 4p 4p 6s 6s 6s 8m 8m 9p', '', ''], { drawn: '1p' });
    let t = act(s, { type: 'discard', tile: parseKinds('2m')[0] as number });
    t = act(t, { type: 'expose', size: 4, jokers: 1 });
    expect(t.phase).toBe('act');
    expect(t.turn).toBe(1);
    expect(t.claimed).toBe(true);
    const m = t.melds[1]?.[0];
    expect(m?.type).toBe('kong');
    expect(m?.kind).toBe(1);
    expect(m?.tiles.filter((x) => kindOf(x) === JOKER).length).toBe(1);
    expect(t.dead[1]).toBe(false);
    checkConservation(t);
  });

  it('the joker exchange: a natural tile for the joker it stands for, from any live exposure', () => {
    const state = table(['2m 9s 9s 9s 1s 1s 3s 3s 5s 5s 7s 7s 9p 1p', '', '', ''], { drawn: '1p', melds: [[], [{ type: 'pung', tiles: '2m 2m J', from: 0 }], [], []] });
    checkConservation(state);
    expect(state.melds[1]?.[0]?.kind).toBe(1);
    const swaps = legal(state).filter((a) => a.type === 'swap');
    expect(swaps).toEqual([{ type: 'swap', seat: 1, meld: 0 }]);
    const t = act(state, swaps[0] as MahjongAction);
    expect(t.hands[0]).toContain('J.0');
    expect(t.melds[1]?.[0]?.tiles.some((x) => kindOf(x) === JOKER)).toBe(false);
    // Still your turn: throw a tile now.
    expect(t.phase).toBe('act');
    expect(legal(t).some((a) => a.type === 'discard')).toBe(true);
    // No exchange from a dead hand.
    const dead = { ...state, dead: [false, true, false, false] };
    expect(legal(dead).some((a) => a.type === 'swap')).toBe(false);
  });

  it('an exposure that fits no hand makes the hand dead; at the learner table it is not offered', () => {
    // A pung of 1 bamboo... the practice card has no hand with a pung of ones in one suit and nothing else? Use a pung of East winds.
    expect(exposuresFit([meld('E', 3)], O())).toBe(false);
    expect(exposuresFit([meld('E', 4)], O())).toBe(true);
    const s = table(['E 9s 9s 9s 1s 1s 3s 3s 5s 5s 7s 7s 9p 1p', 'E E 1p 3p 5p 7p 9p 1s 3s 5s 7s 9s 2m', '', ''], { drawn: '1p' });
    let t = act(s, { type: 'discard', tile: parseKinds('E')[0] as number });
    expect(legal(t)).toContainEqual({ type: 'expose', size: 3, jokers: 0 });
    t = act(t, { type: 'expose', size: 3, jokers: 0 });
    expect(t.dead[1]).toBe(true);
    // A dead hand may not call or win.
    const learner = position({ style: 'american', options: O({ deadHand: 'learner' }), hands: ['E 9s 9s 9s 1s 1s 3s 3s 5s 5s 7s 7s 9p 1p', 'E E 1p 3p 5p 7p 9p 1s 3s 5s 7s 9s 2m', '', ''], wall: 40, drawn: '1p' });
    const u = act(learner, { type: 'discard', tile: parseKinds('E')[0] as number });
    expect(u.turn === 1 ? legal(u).some((a) => a.type === 'expose') : false).toBe(false);
  });

  it('flowers called for an exposure count as one kind', () => {
    const s = table(['F1 9s 9s 9s 1s 1s 3s 3s 5s 5s 7s 7s 9p 1p', 'F2 S3 J 4p 4p 6s 6s 6s 8m 8m 2m 2m 2m', '', ''], { drawn: '1p' });
    const t = act(s, { type: 'discard', tile: FLOWER_1 });
    expect(legal(t)).toContainEqual({ type: 'expose', size: 3, jokers: 0 });
    const u = act(t, { type: 'expose', size: 3, jokers: 1 });
    expect(u.melds[1]?.[0]?.kind).toBe(FLOWER_1);
    expect(u.dead[1]).toBe(false);
    // A kong of flowers fits only a concealed hand on the practice card: exposed, the hand is dead.
    expect(act(t, { type: 'expose', size: 4, jokers: 1 }).dead[1]).toBe(true);
  });

  it('bots play the Charleston and a whole game, keeping every tile and the payments', () => {
    let s = mahjong.setup({ style: 'american', options: O({ length: 'four' }) }, createRng('bots'));
    for (let ply = 0; ply < 4000 && !s.over; ply++) {
      const seat = s.turn;
      const d = decide(viewOf(s, seat), 1 + (seat % 4), createRng(`b${ply}`));
      s = engine.apply(s, d.action).state;
      expect(s.scores.reduce((a, b) => a + b, 0)).toBe(0);
    }
    checkConservation(s);
    expect(s.over).toBe(true);
    expect(s.results.length).toBe(4);
  }, 60_000);
});
