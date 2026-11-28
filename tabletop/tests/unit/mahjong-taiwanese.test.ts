/**
 * Taiwanese golden cases (docs/rules/mahjong-taiwanese.md): the 16-tile shapes, the tai, the
 * dealer's tai and streak, the payments; and on the engine, the deal of sixteen, the dead wall of
 * sixteen, the dealer keeping the deal with its streak, two winners on one discard, eight flowers,
 * and seven robbing the eighth.
 */
import { describe, expect, it } from 'vitest';
import type { MahjongConfig, MahjongState } from '../../src/games/mahjong/rules';
import { engine, parseTiles, position } from '../../src/games/mahjong/rules';
import type { HandScore, Meld, StyleOptions, WinContext } from '../../src/games/mahjong/core/style';
import { isWinningShape } from '../../src/games/mahjong/core/shapes';
import { shanten } from '../../src/games/mahjong/core/shanten';
import { countsOfKinds, parseKind, parseKinds, tileId } from '../../src/games/mahjong/core/tiles';
import { taiwanese, TW_DEFAULTS, twScoreAny } from '../../src/games/mahjong/styles/taiwanese';

const K = (code: string) => {
  const k = parseKind(code);
  if (k === null) throw new Error(code);
  return k;
};

interface Spec {
  readonly hand: string;
  readonly win: string;
  readonly tsumo?: boolean;
  readonly melds?: readonly { type: 'chow' | 'pung' | 'kong'; tiles: string; concealed?: boolean }[];
  readonly seat?: number;
  readonly round?: number;
  readonly flowers?: string;
  readonly options?: StyleOptions;
  readonly counter?: number;
  readonly lastTile?: boolean;
  readonly flowerWin?: 'eight' | 'seven';
}

function ctx(s: Spec): WinContext {
  const melds: Meld[] = (s.melds ?? []).map((m) => ({ type: m.type, tiles: parseTiles(m.tiles).map((t) => tileId(t.kind, 3)), claimed: null, from: m.concealed ? null : 3, concealed: m.concealed === true, added: false }));
  return {
    seat: 0,
    tile: K(s.win),
    selfDrawn: s.tsumo === true || s.flowerWin === 'eight',
    from: s.tsumo ? null : 2,
    concealed: parseKinds(s.hand),
    melds,
    bonus: s.flowers ? parseKinds(s.flowers) : [],
    seatWind: s.seat ?? 1,
    prevailingWind: s.round ?? 0,
    dealer: (s.seat ?? 1) === 0,
    lastTile: s.lastTile === true,
    lastDiscard: false,
    kongs: 0,
    robbed: false,
    heavenly: false,
    earthly: false,
    counter: s.counter ?? 0,
    ...(s.flowerWin ? { flowerWin: s.flowerWin } : {}),
  };
}

const opts = (s: Spec): StyleOptions => ({ ...TW_DEFAULTS, ...s.options });
const scoreOf = (s: Spec): HandScore | null => taiwanese.score(ctx(s), opts(s));
const tai = (sc: HandScore | null) => (sc ? Object.fromEntries(sc.lines.map((l) => [l.id, l.value])) : null);
const shapes = engine.rules({ style: 'taiwanese', options: TW_DEFAULTS }).shapes;

describe('Taiwanese: shapes', () => {
  it('five sets and a pair make seventeen tiles; lik gu lik gu is seven pairs and a pung; one tile short is neither', () => {
    expect(isWinningShape(countsOfKinds(parseKinds('123m 456m 789p 234s 567s 99p')), 0, shapes, 5)).toBe(true);
    expect(isWinningShape(countsOfKinds(parseKinds('11m 22m 33p 44p 55s 66s 77s 888m')), 0, shapes, 5)).toBe(true);
    expect(isWinningShape(countsOfKinds(parseKinds('123m 456m 789p 234s 567s 9p')), 0, shapes, 5)).toBe(false);
    expect(shanten(countsOfKinds(parseKinds('123m 456m 789p 234s 567s 9p')), 0, { shapes, sets: 5 })).toBe(0);
    expect(shanten(countsOfKinds(parseKinds('11m 22m 33p 44p 55s 66s 77s 88m')), 0, { shapes, sets: 5 })).toBe(0);
  });
});

describe('Taiwanese: tai', () => {
  const chows: Spec = { hand: '123m 456m 789p 234s 567s 99p', win: '4s' };

  it('a concealed hand of runs won on a discard: concealed and all chows', () => {
    expect(tai(scoreOf(chows))).toEqual({ 'tw-concealed': 1, 'tw-all-chows': 2 });
  });

  it('self-drawn it is concealed and self-drawn (3, or 2), and no longer all chows', () => {
    expect(tai(scoreOf({ ...chows, tsumo: true }))).toEqual({ 'tw-concealed-self-drawn': 3 });
    expect(tai(scoreOf({ ...chows, tsumo: true, options: { concealedSelfDrawn: 2 } }))).toEqual({ 'tw-concealed-self-drawn': 2 });
  });

  it('a flower takes away all chows; your seat flowers score, and a set of four holds its seat flower', () => {
    expect(tai(scoreOf({ ...chows, flowers: 'F1' }))).toEqual({ 'tw-concealed': 1 });
    expect(tai(scoreOf({ ...chows, flowers: 'F2 S2' }))).toEqual({ 'tw-concealed': 1, 'tw-seat-flower': 2 });
    expect(tai(scoreOf({ ...chows, flowers: 'F1 F2 F3 F4 S2' }))).toEqual({ 'tw-concealed': 1, 'tw-flower-set': 2, 'tw-seat-flower': 1 });
  });

  it('a one-tile wait scores, and is not all chows', () => {
    expect(tai(scoreOf({ hand: '123m 456m 789p 234s 567s 99p', win: '3m' }))).toEqual({ 'tw-concealed': 1, 'tw-one-wait': 1 });
  });

  it('concealed pungs: a pung completed by a discard is not concealed; three, four, five', () => {
    const hand = { hand: '111m 222p 333s 444m 567p 99s', win: '4m' };
    expect(tai(scoreOf(hand))).toEqual({ 'tw-three-concealed': 2, 'tw-concealed': 1 });
    expect(tai(scoreOf({ ...hand, tsumo: true }))).toEqual({ 'tw-four-concealed': 5, 'tw-concealed-self-drawn': 3 });
    expect(tai(scoreOf({ hand: '111m 222p 333s 444m 555p 99s', win: '9s', tsumo: true }))).toEqual({ 'tw-all-pungs': 4, 'tw-five-concealed': 8, 'tw-concealed-self-drawn': 3, 'tw-one-wait': 1 });
  });

  it('flushes, honour pungs, dragons and winds', () => {
    expect(tai(scoreOf({ hand: '123p 456p 789p 111p 99p', win: '2p', melds: [{ type: 'pung', tiles: 'RdRdRd' }] }))).toMatchObject({ 'tw-half-flush': 4, 'tw-dragon-pung': 1 });
    expect(tai(scoreOf({ hand: '111s 234s 456s 789s 666s 99s', win: '3s' }))).toMatchObject({ 'tw-full-flush': 8 });
    const little = tai(scoreOf({ hand: 'WdWdWd GdGdGd RdRd 123m 456p 789s', win: '5p' }));
    expect(little).toMatchObject({ 'tw-little-three-dragons': 4 });
    expect(little?.['tw-dragon-pung']).toBeUndefined();
    expect(tai(scoreOf({ hand: 'WdWdWd GdGdGd RdRdRd 123m 456p 99s', win: '5p' }))).toMatchObject({ 'tw-big-three-dragons': 8 });
    const winds = tai(scoreOf({ hand: 'EEE SSS WWW NNN 123m 55p', win: '2m', seat: 0, round: 1 }));
    expect(winds).toMatchObject({ 'tw-big-four-winds': 16 });
    expect(winds?.['tw-seat-wind']).toBeUndefined();
    expect(tai(scoreOf({ hand: '111m EEE 234p 567s 999s NN', win: '3p', seat: 0, round: 0 }))).toMatchObject({ 'tw-seat-wind': 1, 'tw-round-wind': 1 });
  });

  it('all honours (16, or 8) leaves out all pungs', () => {
    const hand: Spec = { hand: 'EEE SSS WWW WdWdWd GdGdGd NN', win: 'N', seat: 2 };
    const sc = tai(scoreOf(hand));
    expect(sc).toMatchObject({ 'tw-all-honours': 16 });
    expect(sc?.['tw-all-pungs']).toBeUndefined();
    expect(tai(scoreOf({ ...hand, options: { allHonours: 8 } }))).toMatchObject({ 'tw-all-honours': 8 });
  });

  it('lik gu lik gu: seven pairs and a pung, eight tai, closed by definition', () => {
    expect(tai(scoreOf({ hand: '11m 22m 33p 44p 55s 66s 77s 888m', win: '8m' }))).toEqual({ 'tw-pairs-and-pung': 8 });
    expect(tai(scoreOf({ hand: '11m 22m 33p 44p 55s 66s 77s 888m', win: '8m', tsumo: true }))).toEqual({ 'tw-pairs-and-pung': 8, 'tw-self-drawn': 1 });
    expect(scoreOf({ hand: '11m 22m 33p 44p 55s 66s 77s 888m', win: '8m', options: { pairsAndPung: 'off' } })).toBeNull();
  });

  it('the dealer: 1 tai, and 2 more for each hand the deal was kept', () => {
    expect(tai(scoreOf({ ...chows, seat: 0, counter: 2 }))).toEqual({ 'tw-concealed': 1, 'tw-all-chows': 2, 'tw-dealer': 1, 'tw-streak': 4 });
  });

  it('flower wins: eight flowers, seven robbing one', () => {
    expect(tai(twScoreAny(ctx({ hand: '123m', win: 'S4', flowerWin: 'eight' }), TW_DEFAULTS))).toEqual({ 'tw-eight-flowers': 8 });
    expect(tai(twScoreAny(ctx({ hand: '123m', win: 'S4', flowerWin: 'seven' }), TW_DEFAULTS))).toEqual({ 'tw-seven-flowers': 8 });
  });

  it('a minimum: a hand with no tai may win only at a table without one', () => {
    const none: Spec = { hand: '678s 123s 456p 99m', win: '8s', melds: [{ type: 'pung', tiles: '222p' }, { type: 'chow', tiles: '345m' }] };
    expect(scoreOf(none)?.total).toBe(0);
    expect(scoreOf({ ...none, options: { minTai: 1 } })).toBeNull();
  });
});

describe('Taiwanese: payments', () => {
  const hand = (seat: number, from: number | null, total: number): { seat: number; from: number | null; tile: string; score: HandScore; robbed: boolean } => ({ seat, from, tile: '4s.0', score: { lines: [], raw: total, total, limit: false, unit: 'tai', base: total }, robbed: false });

  it('on a discard the discarder alone pays base + tai × per tai; self-drawn, each of the three', () => {
    expect(taiwanese.settle({ wins: [hand(0, 2, 3)], dealer: 1, seats: 4, counter: 0 }, TW_DEFAULTS)).toEqual([160, 0, -160, 0]);
    expect(taiwanese.settle({ wins: [hand(0, null, 3)], dealer: 0, seats: 4, counter: 0 }, TW_DEFAULTS)).toEqual([480, -160, -160, -160]);
    expect(taiwanese.settle({ wins: [hand(0, 2, 3)], dealer: 1, seats: 4, counter: 0 }, { ...TW_DEFAULTS, base: 30, perTai: 10 })).toEqual([60, 0, -60, 0]);
  });

  it('a dealer who pays adds 1 + 2 × streak tai; a non-dealer pays only the hand', () => {
    expect(taiwanese.settle({ wins: [hand(0, 1, 3)], dealer: 1, seats: 4, counter: 2 }, TW_DEFAULTS)).toEqual([260, -260, 0, 0]);
    expect(taiwanese.settle({ wins: [hand(0, null, 3)], dealer: 1, seats: 4, counter: 1 }, TW_DEFAULTS)).toEqual([540, -220, -160, -160]);
  });

  it('two winners on one discard: the discarder pays each', () => {
    expect(taiwanese.settle({ wins: [hand(0, 2, 3), hand(1, 2, 5)], dealer: 3, seats: 4, counter: 0 }, TW_DEFAULTS)).toEqual([160, 200, -360, 0]);
  });
});

describe('Taiwanese at the table', () => {
  const config: MahjongConfig = { style: 'taiwanese', options: TW_DEFAULTS };

  it('deals sixteen tiles each and seventeen to the dealer, with 144 tiles', () => {
    const s = engine.newGame(config, 'tw-deal');
    expect(s.hands.map((h, seat) => h.length - (seat === s.dealer ? 1 : 0))).toEqual([16, 16, 16, 16]);
    expect([...s.wall, ...s.hands.flat(), ...s.bonus.flat()]).toHaveLength(144);
  });

  it('the hand is drawn with sixteen tiles left; the dealer keeps the deal and the streak grows', () => {
    let s: MahjongState = position({ style: 'taiwanese', dealer: 0, hands: ['1m', '2m', '', ''], wall: 17, turn: 0, drawn: '1m' });
    s = engine.apply(s, { type: 'discard', tile: K('1m') }).state;
    while (s.phase === 'claim') s = engine.apply(s, { type: 'pass' }).state;
    // Seat 1 drew the seventeenth tile from the end; its throw leaves sixteen, and the hand is drawn.
    s = engine.apply(s, { type: 'discard', tile: engine.legal(s, 1).find((a) => a.type === 'discard')?.type === 'discard' ? (engine.legal(s, 1).find((a) => a.type === 'discard') as { tile: number }).tile : 0 }).state;
    while (s.phase === 'claim') s = engine.apply(s, { type: 'pass' }).state;
    const result = s.results[0];
    expect(result?.reason).toBe('exhausted');
    expect(result?.wallLeft).toBe(16);
    const next = engine.afterHand(s);
    expect(next.dealer).toBe(0);
    expect(next.counter).toBe(1);
  });

  it('eight flowers win at once, paid by everyone; the dealer pays its extra tai', () => {
    let s: MahjongState = position({ style: 'taiwanese', dealer: 1, hands: ['123m 456m 789p 234s 567s E', '', '', 'N'], bonus: ['F1 F2 F3 F4 S1 S2 S3', '', '', ''], front: 'S4 5m', turn: 3, drawn: 'N' });
    s = engine.apply(s, { type: 'discard', tile: K('N') }).state;
    while (s.phase === 'claim') s = engine.apply(s, { type: 'pass' }).state;
    const result = s.results[0];
    expect(result?.wins[0]?.seat).toBe(0);
    expect(result?.wins[0]?.score.lines.map((l) => l.id)).toEqual(['tw-eight-flowers']);
    expect(result?.deltas).toEqual([800, -280, -260, -260]);
  });

  it('seven flowers rob the eighth from the player who draws it, who pays', () => {
    let s: MahjongState = position({ style: 'taiwanese', dealer: 2, hands: ['123m 456m 789p 234s 567s E N', '', '', ''], bonus: ['F1 F2 F3 F4 S1 S2 S3', '', '', ''], front: 'S4 5m', turn: 0, drawn: 'N' });
    s = engine.apply(s, { type: 'discard', tile: K('N') }).state;
    while (s.phase === 'claim') s = engine.apply(s, { type: 'pass' }).state;
    const result = s.results[0];
    expect(result?.wins[0]?.seat).toBe(0);
    expect(result?.wins[0]?.from).toBe(1);
    expect(result?.wins[0]?.score.lines.map((l) => l.id)).toEqual(['tw-seven-flowers']);
    expect(result?.deltas).toEqual([260, -260, 0, 0]);
  });

  it('two players win on one discard, and the dealer who wins keeps the deal', () => {
    let s: MahjongState = position({
      style: 'taiwanese',
      dealer: 0,
      hands: ['123m 456m 789p 234s 567s 9p', '123p 456p 789s 234m 567m 9p', '9p', ''],
      bonus: ['', 'F3', 'F1 F2 F4 S1 S2 S3 S4', ''],
      turn: 2,
      drawn: '9p',
      wall: 40,
    });
    s = engine.apply(s, { type: 'discard', tile: K('9p') }).state;
    while (s.phase === 'claim') s = engine.apply(s, engine.legal(s, s.turn).find((a) => a.type === 'win') ?? { type: 'pass' }).state;
    const result = s.results[0];
    expect(result?.wins.map((w) => w.seat).sort()).toEqual([0, 1]);
    expect(engine.afterHand(s).dealer).toBe(0);
  });
});
