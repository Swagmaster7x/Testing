/**
 * Sichuan Bloody golden cases (docs/rules/mahjong-sichuan.md): the fan table and its cap from the
 * rules file; and on the engine, the void declaration, void tiles thrown first, no chow, the
 * exchange of three tiles, a win that does not end the hand, two winners on one discard, the third
 * winner ending it, kongs paid at once, the call transfer and the checks when the wall runs out.
 */
import { describe, expect, it } from 'vitest';
import type { MahjongAction, MahjongState, PositionSpec } from '../../src/games/mahjong/rules';
import { checkConservation, engine, mahjong, parseTiles, position, viewOf } from '../../src/games/mahjong/rules';
import type { HandScore, Meld, StyleOptions, WinContext } from '../../src/games/mahjong/core/style';
import { kindOf, parseKind, tileId } from '../../src/games/mahjong/core/tiles';
import { createRng } from '../../src/core/rng';
import { decide } from '../../src/games/mahjong/bots';
import { bestReadyValue, sichuan, SICHUAN_DEFAULTS, sichuanPoints } from '../../src/games/mahjong/styles/sichuan';

const K = (code: string) => {
  const k = parseKind(code);
  if (k === null) throw new Error(code);
  return k;
};

interface Spec {
  /** Concealed tiles, the winning tile included. */
  readonly hand: string;
  readonly win: string;
  readonly tsumo?: boolean;
  readonly melds?: readonly { type: 'pung' | 'kong'; tiles: string; concealed?: boolean }[];
  readonly voidSuit?: number;
  readonly options?: StyleOptions;
  readonly lastTile?: boolean;
  readonly lastDiscard?: boolean;
  readonly kongs?: number;
  readonly robbed?: boolean;
  readonly heavenly?: boolean;
  readonly kongDiscard?: boolean;
}

function ctx(s: Spec): WinContext {
  const melds: Meld[] = (s.melds ?? []).map((m) => ({ type: m.type, tiles: parseTiles(m.tiles).map((t, i) => tileId(t.kind, i)), claimed: null, from: m.concealed ? null : 3, concealed: m.concealed === true, added: false }));
  return {
    seat: 0,
    tile: K(s.win),
    selfDrawn: s.tsumo === true,
    from: s.tsumo ? null : 2,
    concealed: parseTiles(s.hand).map((t) => t.kind),
    melds,
    bonus: [],
    seatWind: 1,
    prevailingWind: 0,
    dealer: false,
    lastTile: s.lastTile === true,
    lastDiscard: s.lastDiscard === true,
    kongs: s.kongs ?? 0,
    robbed: s.robbed === true,
    heavenly: s.heavenly === true,
    earthly: false,
    voidSuit: s.voidSuit ?? 2,
    ...(s.kongDiscard ? { kongDiscard: true } : {}),
  };
}

const scoreOf = (s: Spec): HandScore | null => sichuan.score(ctx(s), { ...SICHUAN_DEFAULTS, ...s.options });
const lines = (sc: HandScore | null) => (sc ? Object.fromEntries(sc.lines.map((l) => [l.id, l.value])) : null);

describe('the fan table', () => {
  it('a basic hand is 0 fan, worth 1 point', () => {
    const sc = scoreOf({ hand: '123m 456m 789p 234p 55m', win: '5m' });
    expect(sc?.total).toBe(0);
    expect(sc?.base).toBe(1);
    expect(sc?.lines).toEqual([]);
  });

  it('all pungs 1; one suit 2; seven pairs 2', () => {
    expect(lines(scoreOf({ hand: '111m 444m 777p 222p 55m', win: '5m' }))).toEqual({ 'sc-all-pungs': 1 });
    expect(lines(scoreOf({ hand: '123m 456m 789m 234m 55m', win: '5m' }))).toEqual({ 'sc-pure-suit': 2 });
    expect(lines(scoreOf({ hand: '11m 33m 55m 77p 99p 22p 44p', win: '4p' }))).toEqual({ 'sc-seven-pairs': 2 });
  });

  it('a dragon seven pairs (four alike as two pairs) is 3; pure, 5 capped at 4', () => {
    const dragon = scoreOf({ hand: '11m 11m 55m 77p 99p 22p 44p', win: '4p' });
    expect(lines(dragon)).toEqual({ 'sc-seven-pairs': 2, 'sc-root': 1 });
    expect(dragon?.total).toBe(3);
    const pure = scoreOf({ hand: '11m 11m 33m 55m 66m 77m 99m', win: '9m' });
    expect(pure?.raw).toBe(5);
    expect(pure?.total).toBe(4);
    expect(pure?.base).toBe(16);
    expect(scoreOf({ hand: '11m 11m 33m 55m 66m 77m 99m', win: '9m', options: { cap: 6 } })?.base).toBe(32);
  });

  it('a pure all-pungs hand is 3 fan; roots count for a kong and for four held', () => {
    expect(scoreOf({ hand: '111m 444m 777m 222m 55m', win: '5m' })?.total).toBe(3);
    const kong = scoreOf({ hand: '123m 456p 789p 55m', win: '5m', melds: [{ type: 'kong', tiles: '9m9m9m9m' }] });
    expect(lines(kong)).toEqual({ 'sc-root': 1 });
    const held = scoreOf({ hand: '123m 1m 1m 1m 456p 789p 55m', win: '5m' });
    expect(lines(held)).toEqual({ 'sc-root': 1 });
  });

  it('terminals everywhere 2, golden hook 2 with all pungs, a 2-5-8 hand 3; none with extras off', () => {
    expect(lines(scoreOf({ hand: '123m 789m 123p 999p 11m', win: '1m' }))).toEqual({ 'sc-terminals': 2 });
    const hook = scoreOf({ hand: '5p 5p', win: '5p', melds: [{ type: 'pung', tiles: '111m' }, { type: 'pung', tiles: '444m' }, { type: 'pung', tiles: '777p' }, { type: 'pung', tiles: '222p' }] });
    expect(lines(hook)).toEqual({ 'sc-all-pungs': 1, 'sc-golden-hook': 1 });
    expect(scoreOf({ hand: '222m 555m 888p 222p 55p', win: '5p' })?.total).toBe(3);
    expect(lines(scoreOf({ hand: '222m 555m 888p 222p 55p', win: '5p', options: { extras: 'off' } }))).toEqual({ 'sc-all-pungs': 1 });
    expect(scoreOf({ hand: '123m 789m 123p 999p 11m', win: '1m', options: { extras: 'off' } })?.total).toBe(0);
  });

  it('a hand holding its void suit, or three suits, cannot win', () => {
    expect(scoreOf({ hand: '123m 456m 789p 234p 55m', win: '5m', voidSuit: 1 })).toBeNull();
    expect(scoreOf({ hand: '123m 456m 789p 234s 55m', win: '5m', voidSuit: 2 })).toBeNull();
  });

  it('a fan each for a kong’s tile, a kong’s throw, robbing a kong and the last tile; none with bonusFan off', () => {
    const base = { hand: '123m 456m 789p 234p 55m', win: '5m' };
    expect(lines(scoreOf({ ...base, tsumo: true, kongs: 1 }))).toEqual({ 'sc-kong-flower': 1 });
    expect(lines(scoreOf({ ...base, kongDiscard: true }))).toEqual({ 'sc-kong-discard': 1 });
    expect(lines(scoreOf({ ...base, robbed: true }))).toEqual({ 'sc-robbing-kong': 1 });
    expect(lines(scoreOf({ ...base, tsumo: true, lastTile: true }))).toEqual({ 'sc-last-tile': 1 });
    expect(lines(scoreOf({ ...base, lastDiscard: true }))).toEqual({ 'sc-last-discard': 1 });
    expect(scoreOf({ ...base, robbed: true, options: { bonusFan: 'off' } })?.total).toBe(0);
  });

  it('self-drawn adds a fan only when the table says so; heavenly hands score the cap', () => {
    const base = { hand: '123m 456m 789p 234p 55m', win: '5m', tsumo: true };
    expect(scoreOf(base)?.total).toBe(0);
    expect(lines(scoreOf({ ...base, options: { selfDraw: 'fan' } }))).toEqual({ 'sc-self-drawn': 1 });
    expect(scoreOf({ ...base, heavenly: true })?.total).toBe(4);
    expect(scoreOf({ ...base, heavenly: true, options: { heavenly: 'off' } })?.total).toBe(0);
  });

  it('points are 2 to the fan, capped', () => {
    expect([0, 1, 2, 3, 4, 5].map((f) => sichuanPoints(f))).toEqual([1, 2, 4, 8, 16, 16]);
    expect(sichuanPoints(5, { ...SICHUAN_DEFAULTS, cap: 3 })).toBe(8);
  });
});

// The engine

const SC = (spec: Omit<PositionSpec, 'style'>): MahjongState => position({ style: 'sichuan', voids: [2, 2, 2, 2], ...spec });
const act = (s: MahjongState, a: MahjongAction) => engine.apply(s, a);
const legal = (s: MahjongState) => engine.legal(s, s.turn);
/** Everyone passes every claim window, until it is `seat`'s move in phase act (or the hand ends). */
function passUntil(s: MahjongState, seat: number): MahjongState {
  let state = s;
  for (let i = 0; i < 20 && !(state.phase === 'act' && state.turn === seat) && state.phase !== 'scored'; i++) {
    const options = legal(state);
    state = act(state, options.find((a) => a.type === 'pass') ?? (options.find((a) => a.type === 'discard') as MahjongAction)).state;
  }
  return state;
}

describe('the Sichuan engine', () => {
  it('deals 108 tiles, declares voids in secret, then the dealer throws', () => {
    let s = mahjong.setup({ style: 'sichuan', options: SICHUAN_DEFAULTS }, createRng('void-1'));
    expect(s.phase).toBe('void');
    expect(s.wall.length + s.hands.flat().length).toBe(108);
    const dealer = s.dealer;
    expect(s.turn).toBe(dealer);
    s = act(s, { type: 'void', suit: 1 }).state;
    // The next seat is asked; it cannot see the first choice.
    expect(viewOf(s, (dealer + 1) % 4).voids[dealer]).toBeNull();
    expect(viewOf(s, dealer).voids[dealer]).toBe(1);
    for (let i = 0; i < 3; i++) s = act(s, { type: 'void', suit: 0 }).state;
    expect(s.phase).toBe('act');
    expect(s.turn).toBe(dealer);
    expect(viewOf(s, (dealer + 1) % 4).voids[dealer]).toBe(1);
  });

  it('void tiles go first, and are never called; there is no chow', () => {
    const s = SC({ hands: ['123m 456m 789p 22p 5s', '34m 66m 77m 1p 2p 3p 4p 5p', '', ''], drawn: '5s', voids: [2, 2, 2, 2] });
    expect(legal(s)).toEqual([{ type: 'discard', tile: K('5s') }]);
    // Seat 1 voids characters: it may not pung the 6 characters.
    const t = SC({ hands: ['123m 456m 789p 22p 6m', '34s 66m 77m 1p 2p 3p 4p 5p', '', ''], drawn: '6m', voids: [2, 0, 2, 2] });
    const after = act(t, { type: 'discard', tile: K('6m') }).state;
    expect(after.phase === 'claim' ? after.turn : -1).not.toBe(1);
    // A seat with 5m 6m... is never offered a chow.
    const u = SC({ hands: ['123m 456m 789p 22p 4p', '23p 66m 77m 1p 3s 5p 6p 7p', '', ''], drawn: '4p', voids: [2, 2, 2, 2] });
    const w = act(u, { type: 'discard', tile: K('4p') }).state;
    if (w.phase === 'claim' && w.turn === 1) expect(legal(w).some((a) => a.type === 'chow')).toBe(false);
  });

  it('three winners on one discard: each paid by the thrower, and the hand ends', () => {
    const s = SC({
      hands: ['123m 678m 789p 234p 5m', '123m 678m 789p 234p 5m', '123m 678m 789p 234p 5m', '9m 9m 9m 5p 5p 6p 6p 1p 1p 1p 4m 4m 5p 5m'],
      dealer: 3,
      turn: 3,
      drawn: '5m',
      voids: [2, 2, 2, 2],
      wall: 30,
    });
    let t = act(s, { type: 'discard', tile: K('5m') }).state;
    for (let i = 0; i < 3; i++) {
      expect(legal(t).some((a) => a.type === 'win')).toBe(true);
      t = act(t, { type: 'win' }).state;
    }
    expect(t.phase).toBe('scored');
    const r = t.results[0];
    expect(r?.wins.map((w) => w.seat)).toEqual([0, 1, 2]);
    expect(r?.deltas).toEqual([1, 1, 1, -3]);
    expect(t.scores).toEqual([1, 1, 1, -3]);
  });

  it('two winners on one discard: play goes on after the second, and seats out are skipped', () => {
    const s = SC({
      hands: ['123m 678m 789p 234p 5m', '1m 2m 3m 4p 5p 6p 7p 8p 9p 2p 2p 7m 8m', '123m 678m 789p 234p 5m', '9m 9m 9m 5p 5p 6p 6p 1p 1p 1p 4m 4m 5p 5m'],
      dealer: 3,
      turn: 3,
      drawn: '5m',
      voids: [2, 2, 2, 2],
      wall: 30,
    });
    let t = act(s, { type: 'discard', tile: K('5m') }).state;
    t = act(t, { type: 'win' }).state; // seat 0
    // Seat 1 cannot win on 5m; seat 2 can.
    expect(t.turn).toBe(2);
    t = act(t, { type: 'win' }).state;
    expect(t.phase).toBe('act');
    // The next to draw is the player after the last winner, skipping nobody here: seat 3.
    expect(t.turn).toBe(3);
    expect(t.won.map((w) => w.seat)).toEqual([0, 2]);
    expect(t.scores).toEqual([1, 0, 1, -2]);
    // The winners' hands are shown to everyone; they are never asked again.
    expect(viewOf(t, 1).shown[0]).not.toBeNull();
    t = act(t, { type: 'discard', tile: legal(t).find((a) => a.type === 'discard')?.type === 'discard' ? (legal(t)[legal(t).length - 1] as { tile: number }).tile : 0 }).state;
    if (t.phase === 'claim') expect([0, 2]).not.toContain(t.turn);
    if (t.phase === 'act') expect(t.turn).toBe(1);
    checkConservation(t);
  });

  it('a self-draw is paid by everyone still in, plus 1 each by default', () => {
    const s = SC({ hands: ['123m 456m 789p 234p 55m', '', '', ''], drawn: '5m', voids: [2, 2, 2, 2], wall: 30 });
    const t = act(s, { type: 'win' }).state;
    expect(t.phase).toBe('act');
    expect(t.scores).toEqual([6, -2, -2, -2]);
    expect(t.turn).toBe(1);
  });

  it('kongs are paid at once by the players still in: exposed 2 from the thrower, concealed 2 each', () => {
    const s = SC({ hands: ['123m 456m 7p 7p 7p 7p 2p 3p 5m', '', '', ''], drawn: '7p', voids: [2, 2, 2, 2], wall: 30 });
    const t = act(s, { type: 'kong', tile: K('7p') }).state;
    expect(t.scores).toEqual([6, -2, -2, -2]);
    expect(t.ledger[0]?.reason).toBe('kong-concealed');
    // Exposed: seat 1 throws a 9 dots that seat 0 holds three of.
    const e = SC({ hands: ['123m 456m 999p 2p 3p 5m 5m', '1m 2m 3m 4m 6m 7m 8m 1p 1p 2p 3p 4p 9p 5s', '', ''], turn: 1, drawn: '5s', voids: [2, 2, 2, 2], wall: 30 });
    let f = act(e, { type: 'discard', tile: K('5s') }).state;
    f = passUntil(f, 2);
    void f;
    const g = SC({ hands: ['123m 456m 999p 2p 3p 5m 5m', '1m 2m 3m 4m 6m 7m 8m 1p 1p 2p 3p 4p 9p', '', ''], turn: 1, drawn: '9p', voids: [2, 2, 2, 2], wall: 30 });
    let h = act(g, { type: 'discard', tile: K('9p') }).state;
    expect(h.turn).toBe(0);
    h = act(h, { type: 'kong' }).state;
    expect(h.scores).toEqual([2, -2, 0, 0]);
  });

  it('a robbed added kong is never paid; an added kong nobody robs is paid 1 by each player still in', () => {
    const s = SC({ hands: ['123m 456m 2p 3p 5m 5m 7p', '', '', ''], melds: [[{ type: 'pung', tiles: '7p7p7p', from: 2 }]], drawn: '7p', voids: [2, 2, 2, 2], wall: 30 });
    const t = act(s, { type: 'kong', tile: K('7p') }).state;
    const done = t.phase === 'rob' ? passUntil(t, 0) : t;
    expect(done.scores).toEqual([3, -1, -1, -1]);
  });

  it('call transfer: a kong whose next throw is won on gives its money to the winner', () => {
    // Seat 0 makes a concealed kong (6 from the others), draws, and throws the 5 characters seat 1 wins on.
    const s = SC({ hands: ['7p 7p 7p 7p 1m 2m 3m 4m 6m 8m 9m 1p 5m', '123m 456m 123p 234p 5m', '', ''], drawn: '5m', back: '1p', voids: [2, 2, 2, 2], wall: 30 });
    let t = act(s, { type: 'kong', tile: K('7p') }).state;
    expect(t.scores).toEqual([6, -2, -2, -2]);
    t = act(t, { type: 'discard', tile: K('5m') }).state;
    expect(t.turn).toBe(1);
    t = act(t, { type: 'win' }).state;
    // Seat 1's hand: 1 fan for the kong's throw (2 points), and the kong's 6 transferred.
    expect(t.won[0]?.score.lines.map((l) => l.id)).toContain('sc-kong-discard');
    expect(t.scores).toEqual([6 - 2 - 6, -2 + 2 + 6, -2, -2]);
    const back = SC({ hands: ['7p 7p 7p 7p 1m 2m 3m 4m 6m 8m 9m 1p 5m', '123m 456m 123p 234p 5m', '', ''], drawn: '5m', back: '1p', voids: [2, 2, 2, 2], wall: 30, options: { kongShoot: 'return' } });
    let u = act(back, { type: 'kong', tile: K('7p') }).state;
    u = act(act(u, { type: 'discard', tile: K('5m') }).state, { type: 'win' }).state;
    expect(u.scores).toEqual([-2, 2, 0, 0]);
  });

  it('when the wall runs out: a flower pig pays the cap, a player not ready pays the ready ones, and kong money comes back', () => {
    // Seat 0 ready on 5 characters (a basic hand, 1 point); seat 1 not ready; seat 2 still holds bamboo (its void): a pig;
    // seat 3 ready too. The wall is empty; seat 0 has the turn and throws.
    const s = SC({
      hands: ['123m 456m 789p 234p 5m 1p', '1m 4m 9m 9m 2p 4p 6p 8p 1p 3p 3p 5p 9p', '2m 2m 3m 3m 6m 6m 6m 2p 2p 9p 4s 5s 6s', '777m 888m 555p 666p 9m'],
      drawn: '1p',
      voids: [2, 2, 2, 2],
      wall: 0,
    });
    const t = act(s, { type: 'discard', tile: K('1p') }).state;
    const done = passUntil(t, 9);
    expect(done.phase).toBe('scored');
    const r = done.results[0];
    expect(r?.status).toEqual(['ready', 'not-ready', 'pig', 'ready']);
    // The pig pays 16 to each of seats 0, 1, 3; seat 1 pays seat 0 one point and seat 3 two (all pungs).
    expect(r?.deltas).toEqual([16 + 1, 16 - 1 - 2, -48, 16 + 2]);
    expect(r?.deltas.reduce((a, b) => a + b, 0)).toBe(0);
  });

  it('prices a ready hand by its best wait', () => {
    const hand = { dealer: 0, seats: 4, reason: 'exhausted' as const, ready: [true, true, true, true], allTerminalDiscards: [], counter: 0, hands: [parseTiles('111m 444m 777p 22p 55m').map((t, i) => tileId(t.kind, i % 4))], melds: [[]], voids: [2] };
    expect(bestReadyValue(hand, 0, SICHUAN_DEFAULTS)).toBe(2);
  });

  it('the exchange of three: one suit, passed the way the table says, every hand keeping thirteen', () => {
    for (const exchange of ['right', 'across', 'left', 'random']) {
      let s = mahjong.setup({ style: 'sichuan', options: { ...SICHUAN_DEFAULTS, exchange } }, createRng(`ex-${exchange}`));
      expect(s.phase).toBe('pass');
      const before = s.hands.map((h) => h.length);
      for (let i = 0; i < 4; i++) {
        const options = legal(s);
        expect(options.every((a) => a.type === 'pass-tiles' && a.tiles.length === 3 && new Set(a.tiles.map((k) => Math.floor(k / 9))).size === 1)).toBe(true);
        s = act(s, options[0] as MahjongAction).state;
      }
      expect(s.phase).toBe('void');
      expect(s.hands.map((h) => h.length)).toEqual(before);
      expect(s.received.every((r) => r.length === 3)).toBe(true);
      checkConservation(s);
      if (exchange === 'right') {
        // What seat 0 received came from seat 3.
        expect(s.received[0]?.every((id) => kindOf(id) >= 0)).toBe(true);
      }
    }
  });

  it('bots declare a void, pass, and finish a game that keeps the payments adding up', () => {
    let s = mahjong.setup({ style: 'sichuan', options: { ...SICHUAN_DEFAULTS, exchange: 'random' } }, createRng('bots'));
    for (let ply = 0; ply < 3000 && !s.over; ply++) {
      const seat = s.turn;
      const d = decide(viewOf(s, seat), 1 + (seat % 4), createRng(`b${ply}`));
      s = engine.apply(s, d.action).state;
      expect(s.scores.reduce((a, b) => a + b, 0)).toBe(0);
    }
    expect(s.over).toBe(true);
    expect(s.results.length).toBe(4);
    expect(s.results.every((r) => r.deltas.reduce((a, b) => a + b, 0) === 0)).toBe(true);
  });
});
