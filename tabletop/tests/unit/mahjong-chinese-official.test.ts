/**
 * Chinese Official golden cases (docs/rules/mahjong-chinese-official.md): patterns and the
 * principles that combine them, the eight-point minimum that flowers never count toward, the
 * settlement; and on the engine, the deal passing every hand, the sixteen-hand game, one winner on a
 * discard, and the minimum at the table.
 */
import { describe, expect, it } from 'vitest';
import type { MahjongConfig, MahjongState } from '../../src/games/mahjong/rules';
import { engine, mahjong, parseTiles, position } from '../../src/games/mahjong/rules';
import type { HandScore, Meld, StyleOptions, WinContext } from '../../src/games/mahjong/core/style';
import { isWinningShape, waitsOf } from '../../src/games/mahjong/core/shapes';
import { shanten } from '../../src/games/mahjong/core/shanten';
import { countsOfKinds, parseKind, parseKinds, tileId } from '../../src/games/mahjong/core/tiles';
import { chineseOfficial, CO_DEFAULTS, CO_FAN, CO_PATTERNS, coScoreAny } from '../../src/games/mahjong/styles/chinese-official';
import { createRng } from '../../src/core/rng';

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
  readonly melds?: readonly { type: 'chow' | 'pung' | 'kong'; tiles: string; concealed?: boolean; added?: boolean }[];
  readonly seat?: number;
  readonly round?: number;
  readonly flowers?: string;
  readonly options?: StyleOptions;
  readonly lastTile?: boolean;
  readonly lastDiscard?: boolean;
  readonly kongs?: number;
  readonly robbed?: boolean;
  readonly shown?: number;
}

function ctx(s: Spec): WinContext {
  const melds: Meld[] = (s.melds ?? []).map((m) => ({ type: m.type, tiles: parseTiles(m.tiles).map((t) => tileId(t.kind, 3)), claimed: null, from: m.concealed ? null : 3, concealed: m.concealed === true, added: m.added === true }));
  return {
    seat: 0,
    tile: K(s.win),
    selfDrawn: s.tsumo === true,
    from: s.tsumo ? null : 2,
    concealed: parseKinds(s.hand),
    melds,
    bonus: s.flowers ? parseKinds(s.flowers) : [],
    seatWind: s.seat ?? 1,
    prevailingWind: s.round ?? 0,
    dealer: (s.seat ?? 1) === 0,
    lastTile: s.lastTile === true,
    lastDiscard: s.lastDiscard === true,
    kongs: s.kongs ?? 0,
    robbed: s.robbed === true,
    heavenly: false,
    earthly: false,
    shown: s.shown ?? 0,
  };
}

const opts = (s: Spec): StyleOptions => ({ ...CO_DEFAULTS, ...s.options });
const scoreOf = (s: Spec): HandScore | null => chineseOfficial.score(ctx(s), opts(s));
const anyOf = (s: Spec): HandScore | null => coScoreAny(ctx(s), opts(s));
const fans = (sc: HandScore | null) => (sc ? Object.fromEntries(sc.lines.map((l) => [l.id, l.value])) : null);

describe('Chinese Official: the table of patterns', () => {
  it('has 81 patterns, flowers last, highest first', () => {
    expect(CO_PATTERNS).toHaveLength(81);
    expect(CO_PATTERNS[CO_PATTERNS.length - 1]).toBe('co-flowers');
    const values = CO_PATTERNS.map((id) => CO_FAN[id] ?? 0);
    for (let i = 1; i < values.length; i++) expect(values[i] ?? 0).toBeLessThanOrEqual(values[i - 1] ?? 0);
  });
});

describe('Chinese Official: scoring', () => {
  const chicken: Spec = { hand: '567s EE', win: '5s', melds: [{ type: 'chow', tiles: '234m' }, { type: 'chow', tiles: '456p' }, { type: 'pung', tiles: '888s' }] };

  it('a hand that scores nothing else is a Chicken Hand, worth eight; flowers add to it', () => {
    expect(fans(scoreOf(chicken))).toEqual({ 'co-chicken-hand': 8 });
    const flowers = scoreOf({ ...chicken, flowers: 'F1 S3' });
    expect(fans(flowers)).toEqual({ 'co-chicken-hand': 8, 'co-flowers': 2 });
    expect(flowers?.total).toBe(10);
  });

  it('flowers never count toward the eight-point minimum', () => {
    // All Pungs and nothing else: 6 points, then three flowers.
    const six: Spec = { hand: '88m EE 8m', win: '8m', melds: [{ type: 'pung', tiles: '222m' }, { type: 'pung', tiles: '444p' }, { type: 'pung', tiles: '666s' }], flowers: 'F1 F2 F3' };
    expect(fans(anyOf(six))).toEqual({ 'co-all-pungs': 6, 'co-flowers': 3 });
    expect(scoreOf(six)).toBeNull();
    // Mixed Shifted Pungs as well: 14, and it may win.
    const fourteen: Spec = { hand: '88m EE 8m', win: '8m', melds: [{ type: 'pung', tiles: '222m' }, { type: 'pung', tiles: '333p' }, { type: 'pung', tiles: '444s' }] };
    expect(fans(scoreOf(fourteen))).toEqual({ 'co-mixed-shifted-pungs': 8, 'co-all-pungs': 6 });
    // A lower minimum at a learner table lets six points win.
    expect(scoreOf({ ...six, options: { minPoints: 4 } })?.total).toBe(9);
  });

  it('Mixed Triple Chow leaves out Mixed Double Chow; the fourth chow joins one of the three once', () => {
    const s = scoreOf({ hand: '123m 123p 123s 456m 99s', win: '6m' });
    expect(fans(s)).toEqual({ 'co-mixed-triple-chow': 8, 'co-all-chows': 2, 'co-concealed-hand': 2, 'co-short-straight': 1, 'co-no-honours': 1 });
    expect(s?.total).toBe(14);
  });

  it('Pure Straight leaves out Short Straight and Two Terminal Chows; Fully Concealed leaves out Self-Drawn', () => {
    const s = scoreOf({ hand: '123m 456m 789m 234p 55s', win: '5s', tsumo: true });
    expect(fans(s)).toEqual({ 'co-pure-straight': 16, 'co-fully-concealed': 4, 'co-all-chows': 2, 'co-no-honours': 1, 'co-single-wait': 1 });
    expect(s?.total).toBe(24);
  });

  it('Mixed Straight', () => {
    expect(fans(scoreOf({ hand: '123m 456p 789s 345m 22p', win: '4p' }))).toEqual({ 'co-mixed-straight': 8, 'co-all-chows': 2, 'co-concealed-hand': 2, 'co-no-honours': 1 });
  });

  it('Seven Pairs may use four alike as two pairs, with Tile Hog; self-drawn it scores Self-Drawn', () => {
    const s = scoreOf({ hand: '11m 5555m 22p 66p 88s 99s', win: '9s', tsumo: true });
    expect(fans(s)).toEqual({ 'co-seven-pairs': 24, 'co-tile-hog': 2, 'co-no-honours': 1, 'co-self-drawn': 1 });
  });

  it('Seven Shifted Pairs leaves out Seven Pairs, Full Flush and No Honours', () => {
    const s = scoreOf({ hand: '22334455667788p', win: '8p' });
    expect(fans(s)).toEqual({ 'co-seven-shifted-pairs': 88, 'co-all-simples': 2 });
  });

  it('Thirteen Orphans self-drawn: 88 and Self-Drawn', () => {
    expect(fans(scoreOf({ hand: '19m 19p 19s ESWN WdGdRd Rd', win: 'Rd', tsumo: true }))).toEqual({ 'co-thirteen-orphans': 88, 'co-self-drawn': 1 });
  });

  it('Nine Gates leaves out Full Flush, Concealed Hand, No Honours and its terminal pungs', () => {
    const s = fans(scoreOf({ hand: '1112345678999m 5m', win: '5m' }));
    expect(s?.['co-nine-gates']).toBe(88);
    for (const id of ['co-full-flush', 'co-concealed-hand', 'co-no-honours', 'co-pung-terminals-honours']) expect(s?.[id], id).toBeUndefined();
  });

  it('Big Three Dragons leaves out the dragon pungs; Little Four Winds keeps the seat and round winds', () => {
    const dragons = fans(scoreOf({ hand: 'WdWdWd GdGdGd RdRdRd 123m 99m', win: '2m' }));
    expect(dragons?.['co-big-three-dragons']).toBe(88);
    expect(dragons?.['co-dragon-pung']).toBeUndefined();
    expect(dragons?.['co-two-dragon-pungs']).toBeUndefined();
    const winds = fans(scoreOf({ hand: 'EEE SSS WWW NN 123m', win: '2m', seat: 0, round: 1 }));
    expect(winds).toMatchObject({ 'co-little-four-winds': 64, 'co-seat-wind': 2, 'co-prevalent-wind': 2 });
    expect(winds?.['co-big-three-winds']).toBeUndefined();
    expect(winds?.['co-pung-terminals-honours']).toBeUndefined();
  });

  it('a pung of a wind that is neither seat nor round is a Pung of Terminals or Honours', () => {
    const s = fans(anyOf({ hand: 'NNN 111p 456s 789m 22m', win: '5s', seat: 1, round: 0 }));
    expect(s?.['co-pung-terminals-honours']).toBe(2);
  });

  it('the knitted straight with a chow and a pair; it counts as three chows for All Chows', () => {
    const s = scoreOf({ hand: '147m 258p 369s 345m 77s', win: '7s' });
    expect(fans(s)).toEqual({ 'co-knitted-straight': 12, 'co-all-chows': 2, 'co-concealed-hand': 2, 'co-no-honours': 1, 'co-single-wait': 1 });
    expect(isWinningShape(countsOfKinds(parseKinds('147m 258p 369s 345m 77s')), 0, engine.rules({ style: 'chinese-official', options: CO_DEFAULTS }).shapes, 4)).toBe(true);
  });

  it('honours and knitted tiles: lesser, greater, and lesser with the whole knitted straight', () => {
    expect(fans(scoreOf({ hand: '147m 258p 36s ESWN WdGd', win: 'Gd', tsumo: true }))).toEqual({ 'co-lesser-honours-knitted': 12, 'co-self-drawn': 1 });
    expect(fans(scoreOf({ hand: '147m 25p 36s ESWN WdGdRd', win: 'Rd' }))).toEqual({ 'co-greater-honours-knitted': 24 });
    expect(fans(scoreOf({ hand: '147m 258p 369s ESW GdRd', win: 'E' }))).toEqual({ 'co-lesser-honours-knitted': 12, 'co-knitted-straight': 12 });
  });

  it('a pung completed by a discard is melded for Concealed Pungs; self-drawn it is concealed', () => {
    const ron = scoreOf({ hand: '222m 333p 444s 678m 99p', win: '4s' });
    expect(fans(ron)).toEqual({ 'co-mixed-shifted-pungs': 8, 'co-two-concealed-pungs': 2, 'co-concealed-hand': 2, 'co-no-honours': 1 });
    const tsumo = scoreOf({ hand: '222m 333p 444s 678m 99p', win: '4s', tsumo: true });
    expect(fans(tsumo)).toEqual({ 'co-mixed-shifted-pungs': 8, 'co-three-concealed-pungs': 16, 'co-fully-concealed': 4, 'co-no-honours': 1 });
  });

  it('the waits count only when one kind of tile, and only that, could win', () => {
    const melds = [{ type: 'chow' as const, tiles: '456p' }, { type: 'pung' as const, tiles: '777s' }];
    expect(fans(anyOf({ hand: '123m 345s EE', win: '3m', melds }))).toEqual({ 'co-edge-wait': 1 });
    expect(fans(anyOf({ hand: '123m 345s EE', win: '2m', melds }))).toEqual({ 'co-closed-wait': 1 });
    expect(fans(anyOf({ hand: '123m 345s EE', win: 'E', melds }))).toEqual({ 'co-single-wait': 1 });
    // 2-3 waits on 1 or 4: no wait pattern, so nothing at all: a Chicken Hand.
    expect(fans(anyOf({ hand: '123m 345s EE', win: '1m', melds }))).toEqual({ 'co-chicken-hand': 8 });
  });

  it('Melded Hand: four called sets and the pair won on a discard', () => {
    const s = anyOf({ hand: 'E E', win: 'E', melds: [{ type: 'chow', tiles: '123m' }, { type: 'chow', tiles: '456p' }, { type: 'pung', tiles: '777s' }, { type: 'pung', tiles: '888m' }] });
    expect(fans(s)).toEqual({ 'co-melded-hand': 6 });
  });

  it('kongs: Concealed Kong, Two Concealed Kongs (6 or 8), Two Melded Kongs, Three Kongs', () => {
    const base = { hand: '123m 456p 77s', win: '7s' };
    const one = fans(anyOf({ ...base, melds: [{ type: 'kong', tiles: '9999s', concealed: true }, { type: 'chow', tiles: '345m' }] }));
    expect(one?.['co-concealed-kong']).toBe(2);
    const two = { ...base, melds: [{ type: 'kong' as const, tiles: '2222s', concealed: true }, { type: 'kong' as const, tiles: '5555m', concealed: true }] };
    expect(fans(anyOf(two))?.['co-two-concealed-kongs']).toBe(6);
    expect(fans(anyOf({ ...two, options: { twoConcealedKongs: 8 } }))?.['co-two-concealed-kongs']).toBe(8);
    expect(fans(anyOf(two))?.['co-concealed-kong']).toBeUndefined();
    const mixed = { ...base, melds: [{ type: 'kong' as const, tiles: '2222s', concealed: true }, { type: 'kong' as const, tiles: '5555m' }] };
    expect(fans(anyOf(mixed))).toMatchObject({ 'co-two-melded-kongs': 4 });
    expect(fans(anyOf({ ...mixed, options: { mixedKongs: 'separate' } }))).toMatchObject({ 'co-melded-kong': 1, 'co-concealed-kong': 2 });
    const three = fans(anyOf({ hand: '456p 77s', win: '7s', melds: [{ type: 'kong', tiles: '2222s' }, { type: 'kong', tiles: '5555m' }, { type: 'kong', tiles: '8888p' }] }));
    expect(three?.['co-three-kongs']).toBe(32);
    expect(three?.['co-two-melded-kongs']).toBeUndefined();
  });

  it('account once: four chows make at most three two-chow patterns; the "twice" reading allows four', () => {
    const hand: Spec = { hand: '123m 123p 456m 456p 99s', win: '9s', tsumo: true };
    const official = fans(scoreOf(hand));
    expect((official?.['co-mixed-double-chow'] ?? 0) + (official?.['co-short-straight'] ?? 0)).toBe(3);
    const twice = fans(scoreOf({ ...hand, options: { accountOnce: 'twice' } }));
    expect(twice?.['co-mixed-double-chow']).toBe(2);
    expect(twice?.['co-short-straight']).toBe(2);
  });

  it('Last Tile with the other three in sight; Robbing the Kong leaves it out; Last Tile Draw leaves out Self-Drawn', () => {
    const hand = { hand: '123m 456p 789s 345m 99p', win: '3m' };
    expect(fans(scoreOf({ ...hand, shown: 3 }))).toMatchObject({ 'co-last-tile': 4 });
    const robbed = fans(scoreOf({ ...hand, shown: 3, robbed: true }));
    expect(robbed).toMatchObject({ 'co-robbing-the-kong': 8 });
    expect(robbed?.['co-last-tile']).toBeUndefined();
    const last = fans(scoreOf({ ...hand, tsumo: true, lastTile: true }));
    expect(last).toMatchObject({ 'co-last-tile-draw': 8 });
    expect(last?.['co-self-drawn']).toBeUndefined();
  });

  it('settles 8 + x from the discarder and 8 from each other player, or 8 + x from each when self-drawn', () => {
    const sc = scoreOf({ ...chicken, flowers: 'F1 S3' }) as HandScore;
    expect(chineseOfficial.settle({ wins: [{ seat: 0, from: 2, tile: '5s.0', score: sc, robbed: false }], dealer: 1, seats: 4 }, CO_DEFAULTS)).toEqual([34, -8, -18, -8]);
    expect(chineseOfficial.settle({ wins: [{ seat: 1, from: null, tile: '5s.0', score: sc, robbed: false }], dealer: 1, seats: 4 }, CO_DEFAULTS)).toEqual([-18, 54, -18, -18]);
  });
});

describe('Chinese Official: shapes and tiles from ready', () => {
  const shapes = engine.rules({ style: 'chinese-official', options: CO_DEFAULTS }).shapes;
  it('waits and shanten know the knitted shapes', () => {
    expect(waitsOf(countsOfKinds(parseKinds('147m 258p 369s 345m 7s')), 0, shapes, 4)).toEqual([K('7s')]);
    expect(shanten(countsOfKinds(parseKinds('147m 258p 36s ESWN Wd')), 0, { shapes, sets: 4 })).toBe(0);
    expect(shanten(countsOfKinds(parseKinds('147m 258p 3s ESWN Wd 1m')), 0, { shapes, sets: 4 })).toBe(1);
    expect(shanten(countsOfKinds(parseKinds('147m 258p 39s 345m 77s')), 0, { shapes, sets: 4 })).toBe(0);
    expect(shanten(countsOfKinds(parseKinds('11m 5555m 22p 66p 88s 9s')), 0, { shapes, sets: 4 })).toBe(0);
  });
});

describe('Chinese Official at the table', () => {
  const config: MahjongConfig = { style: 'chinese-official', options: CO_DEFAULTS };

  it('deals 144 tiles with flowers, 136 without', () => {
    const s = engine.newGame(config, 'co-tiles');
    const all = [...s.wall, ...s.hands.flat(), ...s.bonus.flat()];
    expect(all).toHaveLength(144);
    const plain = engine.newGame({ ...config, options: { ...CO_DEFAULTS, flowers: 'off' } }, 'co-tiles');
    expect([...plain.wall, ...plain.hands.flat()]).toHaveLength(136);
  });

  it('a hand under the minimum may not be won at the table; one at eight may', () => {
    // All Pungs only: no win offered on the 8 characters.
    const short = position({ style: 'chinese-official', hands: ['88m EE 8m', '', '', ''], melds: [[{ type: 'pung', tiles: '222m' }, { type: 'pung', tiles: '444p' }, { type: 'pung', tiles: '666s' }]], drawn: '8m', wall: 40 });
    expect(engine.legal(short, 0).some((a) => a.type === 'win')).toBe(false);
    const enough = position({ style: 'chinese-official', hands: ['88m EE 8m', '', '', ''], melds: [[{ type: 'pung', tiles: '222m' }, { type: 'pung', tiles: '333p' }, { type: 'pung', tiles: '444s' }]], drawn: '8m', wall: 40 });
    expect(engine.legal(enough, 0).some((a) => a.type === 'win')).toBe(true);
  });

  it('the deal passes even when the dealer wins, and the winner collects 8 + x from each on a self-draw', () => {
    const s0: MahjongState = position({ style: 'chinese-official', options: { length: 'east', flowers: 'off' }, dealer: 0, hands: ['123m 456m 789m 234p 55s', '', '', ''], drawn: '5s', wall: 40 });
    const won = engine.apply(s0, { type: 'win' }).state;
    const result = won.results[0];
    expect(result?.wins[0]?.score.total).toBe(24);
    expect(result?.deltas).toEqual([96, -32, -32, -32]);
    const next = engine.apply(won, { type: 'next' }).state;
    expect(next.dealer).toBe(1);
  });

  it('a full game is sixteen hands, four in each round', () => {
    let s = mahjong.setup(config, createRng('co-full'));
    const rng = createRng('co-full-play');
    for (let i = 0; i < 20000 && !s.over; i++) {
      const legal = mahjong.legal(s, s.turn);
      const win = legal.find((a) => a.type === 'win');
      const pass = legal.find((a) => a.type === 'pass');
      s = mahjong.apply(s, win ?? pass ?? rng.pick(legal)).state;
    }
    expect(s.over).toBe(true);
    expect(s.results).toHaveLength(16);
    expect(s.results.map((r) => r.round)).toEqual([0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3]);
  });

  it('only the first in turn after the discarder wins on a discard two could win on', () => {
    expect(engine.rules(config).calls.multipleWinners).toBe(false);
  });
});
