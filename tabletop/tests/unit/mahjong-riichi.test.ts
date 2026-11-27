/**
 * Riichi golden cases (docs/rules/mahjong-riichi.md): yaku, fu, han and points from the rules
 * file; and on the engine, riichi, furiten, multiple ron, swap calling, kong dora, drawn hands,
 * abortive draws, counters and sticks, and the end of a game.
 */
import { describe, expect, it } from 'vitest';
import type { MahjongState } from '../../src/games/mahjong/rules';
import { engine, mahjong, position } from '../../src/games/mahjong/rules';
import type { PositionSpec } from '../../src/games/mahjong/rules';
import type { HandScore, Meld, StyleOptions, WinContext } from '../../src/games/mahjong/core/style';
import { parseKind, tileId } from '../../src/games/mahjong/core/tiles';
import { parseTiles } from '../../src/games/mahjong/rules';
import { doraOf, payments, riichi, riichiScoreAny, RIICHI_DEFAULTS } from '../../src/games/mahjong/styles/riichi';

const K = (code: string) => {
  const k = parseKind(code);
  if (k === null) throw new Error(code);
  return k;
};

interface Spec {
  /** Concealed tiles, the winning tile included ("0p" a red five). */
  readonly hand: string;
  readonly win: string;
  readonly tsumo?: boolean;
  readonly melds?: readonly { type: 'chow' | 'pung' | 'kong'; tiles: string; concealed?: boolean }[];
  readonly seat?: number;
  readonly round?: number;
  readonly dora?: string;
  readonly ura?: string;
  readonly ready?: number;
  readonly oneShot?: boolean;
  readonly options?: StyleOptions;
  readonly lastTile?: boolean;
  readonly lastDiscard?: boolean;
  readonly kongs?: number;
  readonly robbed?: boolean;
  readonly heavenly?: boolean;
  readonly firstDraw?: boolean;
}

function ctx(s: Spec): WinContext {
  let copy = 1;
  const tiles = parseTiles(s.hand).map((t) => (t.red ? tileId(t.kind, 0) : tileId(t.kind, copy++ % 4 || 1)));
  const melds: Meld[] = (s.melds ?? []).map((m) => ({ type: m.type, tiles: parseTiles(m.tiles).map((t) => tileId(t.kind, t.red ? 0 : 3)), claimed: null, from: m.concealed ? null : 3, concealed: m.concealed === true, added: false }));
  return {
    seat: 0,
    tile: K(s.win),
    selfDrawn: s.tsumo === true,
    from: s.tsumo ? null : 2,
    concealed: parseTiles(s.hand).map((t) => t.kind),
    melds,
    bonus: [],
    seatWind: s.seat ?? 1,
    prevailingWind: s.round ?? 0,
    dealer: (s.seat ?? 1) === 0,
    lastTile: s.lastTile === true,
    lastDiscard: s.lastDiscard === true,
    kongs: s.kongs ?? 0,
    robbed: s.robbed === true,
    heavenly: s.heavenly === true,
    earthly: false,
    firstDraw: s.firstDraw === true,
    tiles: [...tiles, ...melds.flatMap((m) => m.tiles)],
    indicators: s.dora ? parseTiles(s.dora).map((t) => t.kind) : [],
    underIndicators: s.ura ? parseTiles(s.ura).map((t) => t.kind) : [],
    ready: s.ready ?? 0,
    oneShot: s.oneShot === true,
  };
}

const scoreOf = (s: Spec): HandScore | null => riichi.score(ctx(s), { ...RIICHI_DEFAULTS, ...s.options });
const yaku = (sc: HandScore | null) => (sc ? Object.fromEntries(sc.lines.map((l) => [l.id, l.value])) : null);
/** What the winner collects (no counters or sticks): on a discard, or in all on a self-draw. */
const collect = (sc: HandScore, dealer: boolean, tsumo: boolean) => {
  const p = payments(sc.base, dealer);
  return tsumo ? (dealer ? 3 * p.tsumoOther : p.tsumoDealer + 2 * p.tsumoOther) : p.ron;
};

describe('yaku, fu and points', () => {
  it('pinfu: self-drawn 20 fu with menzen tsumo, on a discard 30 fu', () => {
    const tsumo = scoreOf({ hand: '123m 567p 345s 678s 22p', win: '3s', tsumo: true });
    expect(yaku(tsumo)).toEqual({ 'menzen-tsumo': 1, pinfu: 1 });
    expect(tsumo?.fu).toBe(20);
    expect(collect(tsumo as HandScore, false, true)).toBe(1500);
    const ron = scoreOf({ hand: '123m 567p 345s 678s 22p', win: '3s' });
    expect(yaku(ron)).toEqual({ pinfu: 1 });
    expect(ron?.fu).toBe(30);
    expect(collect(ron as HandScore, false, false)).toBe(1000);
    // The same hand waiting on an edge is not pinfu, and has no yaku on a discard.
    expect(scoreOf({ hand: '123m 567p 789s 678s 22p', win: '7s' })).toBeNull();
  });

  it('chiitoitsu: 25 fu, with tanyao and dora', () => {
    const s = scoreOf({ hand: '22m 44m 66p 88p 33s 55s 77s', win: '7s' });
    expect(yaku(s)).toEqual({ chiitoitsu: 2, tanyao: 1 });
    expect(s?.fu).toBe(25);
    expect(collect(s as HandScore, false, false)).toBe(3200);
    const dora = scoreOf({ hand: '22m 44m 66p 88p 33s 55s 77s', win: '7s', dora: '1m' });
    expect(dora?.lines.find((l) => l.id === 'dora')?.value).toBe(2);
    expect(dora?.band).toBe('mangan');
    expect(collect(dora as HandScore, false, false)).toBe(8000);
  });

  it('riichi, ippatsu, menzen tsumo and pinfu, with ura dora: mangan', () => {
    const s = scoreOf({ hand: '123m 456m 789p 234s 55s', win: '4s', tsumo: true, ready: 1, oneShot: true, ura: '4m' });
    expect(yaku(s)).toEqual({ riichi: 1, ippatsu: 1, 'menzen-tsumo': 1, pinfu: 1, 'ura-dora': 1 });
    expect(s?.band).toBe('mangan');
    expect(collect(s as HandScore, false, true)).toBe(8000);
    // Ura dora count only for a riichi hand, and ippatsu can be switched off.
    expect(yaku(scoreOf({ hand: '123m 456m 789p 234s 55s', win: '4s', tsumo: true, ready: 1, oneShot: true, ura: '4m', options: { ura: 'off', ippatsu: 'off' } }))).toEqual({ riichi: 1, 'menzen-tsumo': 1, pinfu: 1 });
    expect(yaku(scoreOf({ hand: '123m 456m 789p 234s 55s', win: '4s', tsumo: true, ready: 2 }))).toEqual({ 'double-riichi': 2, 'menzen-tsumo': 1, pinfu: 1 });
  });

  it('open tanyao counts by default and not when the option is off; a hand without yaku cannot win', () => {
    const melds = [{ type: 'chow' as const, tiles: '234m' }];
    const open = scoreOf({ hand: '567p 345s 66s 678s', win: '6s', melds });
    expect(yaku(open)).toEqual({ tanyao: 1 });
    expect(open?.fu).toBe(30);
    expect(collect(open as HandScore, false, false)).toBe(1000);
    expect(scoreOf({ hand: '567p 345s 66s 678s', win: '6s', melds, options: { openTanyao: 'off' } })).toBeNull();
    expect(scoreOf({ hand: '456p 789s 11s 345m', win: '5m', melds: [{ type: 'chow', tiles: '123m' }] })).toBeNull();
    // Without a yaku the hand is complete but cannot win; dora do not help.
    expect(riichiScoreAny(ctx({ hand: '456p 789s 11s 345m', win: '5m', melds: [{ type: 'chow', tiles: '123m' }], dora: '4p' }), RIICHI_DEFAULTS)?.lines).toEqual([]);
  });

  it('fu: pungs and kongs, closed and open, the waits, and an open hand rounded to 30', () => {
    // A concealed terminal pung (8) and a closed ron (10): 38, so 40.
    expect(scoreOf({ hand: '111m 234p 567s 789s 55p', win: '6s', ready: 1 })?.fu).toBe(40);
    // An open kong of simples (8), an open dragon pung (4) and a pair wait (2): 34, so 40.
    const kong = scoreOf({ hand: '123m 789s 44s', win: '4s', melds: [{ type: 'kong', tiles: '5555p' }, { type: 'pung', tiles: 'WdWdWd' }] });
    expect(yaku(kong)).toEqual({ 'yakuhai-white': 1 });
    expect(kong?.fu).toBe(40);
    expect(collect(kong as HandScore, false, false)).toBe(1300);
    // A closed wait (kanchan) adds two: 32, so 40.
    expect(scoreOf({ hand: '123m 456p 789s 123s 55m', win: '2s', ready: 1 })?.fu).toBe(40);
    // A pung completed on a discard counts as open (2), the concealed one doubled (4): 36, so 40.
    const shanpon = scoreOf({ hand: '222m 555p 345s 678s 99s', win: '2m', ready: 1 });
    expect(shanpon?.fu).toBe(40);
    expect(yaku(shanpon)).toEqual({ riichi: 1 });
  });

  it('a pair of the wind that is both seat and round: 4 fu by default, 2 as an option', () => {
    const spec: Spec = { hand: '222m 456p 789s 234s EE', win: 'E', tsumo: true, seat: 0, round: 0 };
    const four = scoreOf(spec);
    expect(four?.fu).toBe(40);
    expect(collect(four as HandScore, true, true)).toBe(2100);
    const two = scoreOf({ ...spec, options: { doubleWindFu: 2 } });
    expect(two?.fu).toBe(30);
    expect(collect(two as HandScore, true, true)).toBe(1500);
  });

  it('4 han 30 fu is 7,700, or mangan with kiriage; haneman, baiman, counted yakuman', () => {
    const spec: Spec = { hand: '234m 567p 345s 678s 22p', win: '3s', ready: 1, dora: '1m' };
    const s = scoreOf(spec);
    expect(yaku(s)).toEqual({ riichi: 1, pinfu: 1, tanyao: 1, dora: 1 });
    expect(collect(s as HandScore, false, false)).toBe(7700);
    expect(collect(scoreOf({ ...spec, options: { kiriage: 'on' } }) as HandScore, false, false)).toBe(8000);
    // Chinitsu and ittsu, riichi and tsumo, with four dora: 14 han, counted as yakuman or capped.
    const big: Spec = { hand: '123p 456p 789p 222p 99p', win: '9p', tsumo: true, ready: 1, dora: '1p' };
    const counted = scoreOf(big);
    expect(counted?.total).toBe(14);
    expect(counted?.band).toBe('kazoe');
    expect(collect(counted as HandScore, false, true)).toBe(32000);
    expect(collect(scoreOf({ ...big, options: { kazoe: 'sanbaiman' } }) as HandScore, false, true)).toBe(24000);
    const baiman = scoreOf({ hand: '123p 456p 789p 222p 99p', win: '9p' });
    expect(yaku(baiman)).toEqual({ ittsu: 2, chinitsu: 6 });
    expect(baiman?.band).toBe('baiman');
    expect(collect(baiman as HandScore, true, false)).toBe(24000);
  });

  it('yakuman: daisangen, and thirteen orphans on the thirteen-way wait as a double', () => {
    const big = scoreOf({ hand: 'WdWdWd GdGdGd RdRdRd 123m 55p', win: '5p' });
    expect(yaku(big)).toEqual({ daisangen: 1 });
    expect(collect(big as HandScore, false, false)).toBe(32000);
    const kokushi = scoreOf({ hand: '19m 19p 19s ESWN WdGdRd 1m', win: '1m' });
    expect(yaku(kokushi)).toEqual({ 'kokushi-13': 2 });
    expect(collect(kokushi as HandScore, false, false)).toBe(64000);
    expect(collect(scoreOf({ hand: '19m 19p 19s ESWN WdGdRd 1m', win: '1m', options: { doubleYakuman: 'off' } }) as HandScore, false, false)).toBe(32000);
    expect(yaku(scoreOf({ hand: '19m 19p 19s ESWN WdGdRd 1m', win: '9m' }))).toEqual({ kokushi: 1 });
  });

  it('red fives add a han each, when the table plays them', () => {
    const s = scoreOf({ hand: '234m 0p67p 345s 678s 22p', win: '3s', ready: 1 });
    expect(yaku(s)).toEqual({ riichi: 1, pinfu: 1, tanyao: 1, 'aka-dora': 1 });
    expect(yaku(scoreOf({ hand: '234m 0p67p 345s 678s 22p', win: '3s', ready: 1, options: { red: 0 } }))).toEqual({ riichi: 1, pinfu: 1, tanyao: 1 });
  });

  it('dora indicators point to the next tile: 9 to 1, North to East, Red to White', () => {
    expect(doraOf(K('9m'))).toBe(K('1m'));
    expect(doraOf(K('N'))).toBe(K('E'));
    expect(doraOf(K('Rd'))).toBe(K('Wd'));
    expect(doraOf(K('Wd'))).toBe(K('Gd'));
    expect(doraOf(K('4s'))).toBe(K('5s'));
  });

  it('dealer and non-dealer payments, rounded up to 100', () => {
    expect(payments(320, false)).toEqual({ ron: 1300, tsumoDealer: 700, tsumoOther: 400 });
    expect(payments(320, true)).toEqual({ ron: 2000, tsumoDealer: 0, tsumoOther: 700 });
    expect(payments(2000, false)).toEqual({ ron: 8000, tsumoDealer: 4000, tsumoOther: 2000 });
  });
});

// The engine under Riichi rules

const ONE: StyleOptions = { length: 'hand' };
const at = (p: Omit<PositionSpec, 'style'> & { options?: StyleOptions }): MahjongState => position({ style: 'riichi', ...p, options: { ...ONE, ...p.options } });
const play = (s: MahjongState, text: string): MahjongState => mahjong.apply(s, mahjong.codec.action.fromText(text)).state;
const legal = (s: MahjongState) => mahjong.legal(s, s.turn).map((a) => mahjong.codec.action.toText(a));

describe('riichi on the engine', () => {
  // Seat 0 holds a ready hand on 3s or 6s after throwing the West wind.
  const hands = ['123m 456m 789p 45s 99s W', '1m 2m 3p 5p 7p 9p 2s 8s E E S S N', '4m 5m 6m 7m 8m 1p 2p 3p 7s 7s Gd Gd Rd', '9m 9m 4p 4p 6p 6p 1s 2s 3s Wd Wd N N'];

  it('may be declared with a throw that leaves a closed hand ready, with points and tiles enough', () => {
    const s = at({ hands, drawn: 'W', calls: 0 });
    expect(legal(s)).toContain('riichi W');
    expect(legal(s)).not.toContain('riichi 1m');
    expect(legal(at({ hands, drawn: 'W', scores: [900, 25000, 25000, 25000] }))).not.toContain('riichi W');
    expect(legal(at({ hands, drawn: 'W', wall: 7 }))).not.toContain('riichi W');
  });

  it('puts its stick down when the throw passes; then the hand throws what it draws', () => {
    let s = play(at({ hands, drawn: 'W', calls: 0, front: '1m 2m 3m 7m' }), 'riichi W');
    // The throw passed (nobody could call it): the stick is on the table.
    expect(s.ready[0]).toMatchObject({ paid: true, first: true });
    expect(s.scores[0]).toBe(24000);
    expect(s.stakes).toBe(1);
    // Three more throws round to seat 0's next draw.
    for (let i = 0; i < 3 && s.turn !== 0; i++) s = play(s, legal(s).find((m) => m !== 'pass' && !m.startsWith('riichi') && !m.startsWith('kong') && m !== 'abort') ?? 'pass');
    while (s.phase === 'claim') s = play(s, 'pass');
    if (s.turn === 0 && s.phase === 'act') expect(legal(s).filter((m) => !m.startsWith('kong') && m !== 'win')).toHaveLength(1);
  });

  it('costs no stick when another player wins on the riichi throw', () => {
    // Seat 1 waits on the West wind.
    const s0 = at({ hands: ['123m 456m 789p 45s 99s W', '123p 456p 789s W', '4m 5m 6m 7m 8m 1p 2p 3p 7s 7s Gd Gd 1m', '9m 9m 4p 4p 6p 6p 1s 2s 3s Wd Wd N N'], melds: [[], [{ type: 'pung', tiles: 'RdRdRd', from: 3 }], [], []], drawn: 'W' });
    let s = play(s0, 'riichi W');
    expect(s.phase).toBe('claim');
    expect(s.turn).toBe(1);
    s = play(s, 'win');
    expect(s.results[0]?.wins[0]?.seat).toBe(1);
    expect(s.stakes).toBe(0);
    expect(s.scores[0]).toBe(25000 + (s.results[0]?.deltas[0] ?? 0));
  });

  it('furiten: a wait among your own discards stops a win on a discard, not a self-draw', () => {
    const furiten = at({ hands: ['123m 456m 789p 45s 99s', '1m 2m 3p 5p 7p 9p 2s 8s E E S S 3s', '4m 5m 6m 7m 8m 1p 2p 3p 7s 7s Gd Gd Rd', '9m 9m 4p 4p 6p 6p 1s 2s 3s Wd Wd N N'], discards: ['6s', '', '', ''], turn: 1, drawn: '3s' });
    expect(engine.furiten(furiten, 0)).toBe(true);
    const after = play(furiten, '3s');
    // Seat 0 is not asked: the window closes and the next player draws.
    expect(after.phase === 'claim' && after.turn === 0).toBe(false);
    // Drawing a winning tile still wins.
    const tsumo = at({ hands: ['123m 456m 789p 45s 99s 3s', '1m 2m 3p 5p 7p 9p 2s 8s E E S S', '4m 5m 6m 7m 8m 1p 2p 3p 7s 7s Gd Gd Rd', '9m 9m 4p 4p 6p 6p 1s 2s 3s Wd Wd N N'], discards: ['6s', '', '', ''], drawn: '3s' });
    expect(legal(tsumo)).toContain('win');
  });

  it('furiten: passing a winning discard stops wins on discards until your next throw, or for the hand after riichi', () => {
    const base = { hands: ['123m 456m 789p 45s 99s', '1m 2m 3p 5p 7p 9p 2s 8s E E S S 3s', '4m 5m 6m 7m 8m 1p 2p 3p 7s 7s Gd Gd 6s', '9m 9m 4p 4p 6p 6p 1s 2s 3s Wd Wd N N'], turn: 1, drawn: '3s', front: 'Rd Wd' } as const;
    let s = play(at(base), '3s');
    expect(s.turn).toBe(0);
    expect(legal(s)).toEqual(['win', 'pass']);
    s = play(s, 'pass');
    expect(s.missed[0]).toBe('turn');
    // Seat 2 draws the Red dragon and throws the 6 bamboo: seat 0 may not win on it.
    s = play(s, '6s');
    expect(s.phase === 'claim' && s.turn === 0).toBe(false);
    // After riichi, the furiten lasts the hand.
    let r = play(at({ ...base, ready: [{ paid: true, at: 0 }, null, null, null], discards: ['N', '', '', ''] }), '3s');
    r = play(r, 'pass');
    expect(r.missed[0]).toBe('hand');
  });

  it('double ron: both win, the thrower pays both, and the first in turn takes the counters and sticks', () => {
    // Seat 0 (the dealer) and seat 1 both wait on the 3 or 6 bamboo.
    const both = ['123m 456m 789p 45s 99s', '123p 456p 789m 45s 11m', '4m 5m 6m 7m 8m 1p 2p 3p 7s 7s Gd Gd Rd', '9m 9m 4p 4p 6p 6p 1s 2s 3s Wd Wd N 6s'];
    let s = at({ hands: both, turn: 3, drawn: '6s', counter: 2, stakes: 1, ready: [{ paid: true, at: 0 }, { paid: true, at: 0 }, null, null], discards: ['N', 'N', '', ''], scores: [24000, 24000, 25000, 26000] });
    s = play(s, '6s');
    expect(s.turn).toBe(0);
    s = play(s, 'win');
    expect(s.turn).toBe(1);
    s = play(s, 'win');
    const result = s.results[0];
    expect(result?.wins.map((w) => w.seat)).toEqual([0, 1]);
    const [w0, w1] = result?.wins ?? [];
    const ron0 = payments(w0?.score.base ?? 0, true).ron;
    const ron1 = payments(w1?.score.base ?? 0, false).ron;
    expect(result?.deltas).toEqual([ron0 + 600 + 1000, ron1, 0, -(ron0 + 600 + ron1)]);
    expect(s.stakes).toBe(0);
  });

  it('three winners on one discard: an abortive draw by default, all paid with the option, the first only with head bump', () => {
    const three = ['123m 456m 789p 45s 99s', '123p 456p 789m 45s 11m', '111p 999m 234p 45s 22m', '9p 9p 4m 4m 6p 6p 1s 2s 3s Wd Wd N 6s'];
    const spec = { hands: three, turn: 3, drawn: '6s', ready: [{ paid: true, at: 0 }, { paid: true, at: 0 }, { paid: true, at: 0 }, null], discards: ['N', 'N', 'N', ''] } as const;
    const winAll = (s: MahjongState) => {
      let x = s;
      while (x.phase === 'claim') x = play(x, legal(x).includes('win') ? 'win' : 'pass');
      return x;
    };
    const aborted = winAll(play(at(spec), '6s'));
    expect(aborted.results[0]?.reason).toBe('too-many-winners');
    expect(aborted.results[0]?.wins).toHaveLength(0);
    const all = winAll(play(at({ ...spec, options: { multipleRon: 'triple' } }), '6s'));
    expect(all.results[0]?.wins).toHaveLength(3);
    const first = winAll(play(at({ ...spec, options: { multipleRon: 'head-bump' } }), '6s'));
    expect(first.results[0]?.wins.map((w) => w.seat)).toEqual([0]);
  });

  it('swap calling is forbidden: after a chi neither the called tile nor the far end, after a pon not the called tile', () => {
    let s = at({ hands: ['45s 3s 6s 1m 2m 9p 9p 7p 8p E E Wd', '1m 2m 3p 5p 7p 9p 2s 8s E S S N 3s', '4m 5m 6m 7m 8m 1p 2p 3p 7s 7s Gd Gd Rd', '9m 9m 4p 4p 6p 6p 1s 2s 3s Wd Wd N 3s'], turn: 3, drawn: '3s' });
    s = play(s, '3s');
    expect(legal(s)).toContain('chow 3s');
    s = play(s, 'chow 3s');
    expect(legal(s)).not.toContain('3s');
    expect(legal(s)).not.toContain('6s');
    expect(legal(s)).toContain('E');
    // With swap calling allowed, both may be thrown.
    let t = at({ hands: ['45s 3s 6s 1m 2m 9p 9p 7p 8p E E Wd', '1m 2m 3p 5p 7p 9p 2s 8s E S S N 3s', '4m 5m 6m 7m 8m 1p 2p 3p 7s 7s Gd Gd Rd', '9m 9m 4p 4p 6p 6p 1s 2s 3s Wd Wd N 3s'], turn: 3, drawn: '3s', options: { kuikae: 'allowed' } });
    t = play(play(t, '3s'), 'chow 3s');
    expect(legal(t)).toContain('6s');
  });

  it('kong dora: a concealed kong turns an indicator at once; an added kong after its throw (or at once with the option)', () => {
    const concealed = at({ hands: ['1111m 456m 789p 45s 9s', '2m 2m 3p 5p 7p 9p 2s 8s E E S S N', '4m 5m 6m 7m 8m 1p 2p 3p 7s 7s Gd Gd Rd', '9m 9m 4p 4p 6p 6p 1s 2s 3s Wd Wd N N'], drawn: '1m' });
    expect(concealed.indicators?.shown).toBe(1);
    const k = play(concealed, 'kong 1m');
    expect(k.indicators?.shown).toBe(2);
    const added = at({ hands: ['1m 456m 789p 45s 99s', '2m 2m 3p 5p 7p 9p 2s 8s E E S S N', '4m 5m 6m 7m 8m 1p 1p 3p 7s 7s Gd Gd Rd', '9m 9m 4p 4p 6p 6p 1s 2s 3s Wd Wd N N'], melds: [[{ type: 'pung', tiles: '1m 1m 1m', from: 2 }], [], [], []], drawn: '1m' });
    let a = play(added, 'kong 1m');
    while (a.phase === 'rob') a = play(a, 'pass');
    expect(a.indicators?.shown).toBe(1);
    expect(a.indicators?.pending).toBe(1);
    a = play(a, legal(a).find((m) => /^[1-9][mps]$|^[A-Z]/.test(m) && !m.startsWith('riichi') && m !== 'win' && !m.startsWith('kong')) ?? '');
    expect(a.indicators?.shown).toBe(2);
    let b = play(at({ hands: ['1m 456m 789p 45s 99s', '2m 2m 3p 5p 7p 9p 2s 8s E E S S N', '4m 5m 6m 7m 8m 1p 1p 3p 7s 7s Gd Gd Rd', '9m 9m 4p 4p 6p 6p 1s 2s 3s Wd Wd N N'], melds: [[{ type: 'pung', tiles: '1m 1m 1m', from: 2 }], [], [], []], drawn: '1m', options: { kanDora: 'immediate' } }), 'kong 1m');
    while (b.phase === 'rob') b = play(b, 'pass');
    expect(b.indicators?.shown).toBe(2);
  });

  it('an exhaustive draw: ready players are paid 3,000 in all, the dealer keeps the deal when ready, the counter goes up', () => {
    // The wall's last tile goes to seat 0, who throws it; nobody can win on it.
    const last = (ready: string[]) => at({ hands: ready, drawn: 'Rd', wall: 4, options: { length: 'east-south' } });
    const draw = (s: MahjongState) => {
      let x = play(s, 'Rd');
      while (x.phase === 'claim') x = play(x, 'pass');
      return x;
    };
    const oneReady = draw(last(['123m 456m 789p 45s 99s Rd', '1m 2m 3p 5p 7p 9p 2s 8s E E S S N', '4m 5m 6m 7m 8m 1p 2p 3p 7s 1s Gd 3s Rd', '9m 9m 4p 6p 8p 1s 2s 3s 6s Wd Wd N N']));
    expect(oneReady.results[0]?.reason).toBe('exhausted');
    expect(oneReady.results[0]?.ready).toEqual([true, false, false, false]);
    expect(oneReady.results[0]?.deltas).toEqual([3000, -1000, -1000, -1000]);
    const twoReady = draw(last(['123m 456m 789p 45s 99s Rd', '123p 456p 789m 45s 11m', '4m 5m 6m 7m 8m 1p 2p 3p 7s 1s Gd 3s Rd', '9m 9m 4p 6p 8p 1s 2s 3s 6s Wd Wd N N']));
    expect(twoReady.results[0]?.deltas).toEqual([1500, 1500, -1500, -1500]);
    const next = engine.afterHand(twoReady);
    expect(next.dealer).toBe(0);
    expect(next.counter).toBe(1);
    const dealerNot = draw(last(['1m 2m 3p 5p 7p 9p 2s 8s E E S S Rd', '123p 456p 789m 45s 11m', '4m 5m 6m 7m 8m 1p 2p 3p 7s 1s Gd 3s Rd', '9m 9m 4p 6p 8p 1s 2s 3s 6s Wd Wd N N']));
    expect(engine.afterHand(dealerNot).dealer).toBe(1);
    expect(engine.afterHand(dealerNot).counter).toBe(1);
  });

  it('nagashi mangan: discards all terminals and honours, none called, paid as a self-drawn mangan', () => {
    const draw = { seats: 4, reason: 'exhausted' as const, ready: [false, true, false, false], counter: 0 };
    expect(riichi.settleDraw?.({ ...draw, dealer: 0, allTerminalDiscards: [0] }, RIICHI_DEFAULTS)).toEqual([12000, -4000, -4000, -4000]);
    expect(riichi.settleDraw?.({ ...draw, dealer: 0, allTerminalDiscards: [2] }, RIICHI_DEFAULTS)).toEqual([-4000, -2000, 8000, -2000]);
    // Switched off, the ready payments apply instead.
    expect(riichi.settleDraw?.({ ...draw, dealer: 0, allTerminalDiscards: [2] }, { ...RIICHI_DEFAULTS, nagashi: 'off' })).toEqual([-1000, 3000, -1000, -1000]);
  });

  it('abortive draws: nine terminals on the first draw, four of the same wind', () => {
    const nine = at({ hands: ['19m 19p 19s E S W Wd 2m 3m 4m 5m', '1m 2m 3p 5p 7p 9p 2s 8s E E S S N', '4m 5m 6m 7m 8m 1p 2p 3p 7s 7s Gd Gd Rd', '9m 9m 4p 4p 6p 6p 1s 2s 3s Wd Wd N N'], calls: 0 });
    expect(legal(nine)).toContain('abort');
    const aborted = play(nine, 'abort');
    expect(aborted.results[0]?.reason).toBe('nine-terminals');
    expect(engine.afterHand({ ...aborted, config: { ...aborted.config, options: { ...aborted.config.options, length: 'east-south' } } }).dealer).toBe(0);
    let w = at({ hands: ['123m 456m 789p 45s 99s N', '1m 2m 3p 5p 7p 9p 2s 8s E S S N 3m', '4m 5m 6m 7m 8m 1p 2p 3p 7s 7s Gd Gd N', '9m 9m 4p 4p 6p 6p 1s 2s 3s Wd Wd N 5p'], drawn: 'N', calls: 0, front: '1s 2s 3s 4s' });
    for (let i = 0; i < 4 && w.results.length === 0; i++) {
      w = play(w, 'N');
      while (w.phase === 'claim') w = play(w, 'pass');
    }
    expect(w.results[0]?.reason).toBe('four-winds');
  });

  it('starts every player at 25,000 and ends a game when someone goes below zero', () => {
    const fresh = engine.newGame({ style: 'riichi', options: RIICHI_DEFAULTS }, 'unit');
    expect(fresh.scores).toEqual([25000, 25000, 25000, 25000]);
    expect(fresh.indicators?.tiles).toHaveLength(10);
    expect(fresh.wall.length).toBe(136 - 53 - 10);
    const over = riichi.gameOver?.({ scores: [-100, 30000, 35100, 35000], round: 0, passes: 1, nextRound: 0, dealerKeeps: false, dealer: 1, hands: 3, rounds: 2 }, RIICHI_DEFAULTS);
    expect(over).toBe(true);
    // Agari-yame: the last dealer keeps the deal while first, at 30,000 or more.
    expect(riichi.gameOver?.({ scores: [20000, 20000, 20000, 40000], round: 1, passes: 3, nextRound: 1, dealerKeeps: true, dealer: 3, hands: 9, rounds: 2 }, RIICHI_DEFAULTS)).toBe(true);
    // Nobody at 30,000 after South 4: into the West round, which ends as soon as someone is.
    expect(riichi.gameOver?.({ scores: [25000, 25000, 26000, 24000], round: 1, passes: 3, nextRound: 2, dealerKeeps: false, dealer: 3, hands: 8, rounds: 2 }, RIICHI_DEFAULTS)).toBe(false);
    expect(riichi.gameOver?.({ scores: [31000, 25000, 20000, 24000], round: 2, passes: 0, nextRound: 2, dealerKeeps: false, dealer: 0, hands: 9, rounds: 2 }, RIICHI_DEFAULTS)).toBe(true);
    expect(riichi.gameOver?.({ scores: [25000, 25000, 26000, 24000], round: 1, passes: 3, nextRound: 2, dealerKeeps: false, dealer: 3, hands: 8, rounds: 2 }, { ...RIICHI_DEFAULTS, extension: 'off' })).toBe(true);
  });
});
