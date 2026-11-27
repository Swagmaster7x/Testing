/**
 * Golden cases for the shared mahjong engine under the Hong Kong rules (docs/rules/mahjong-core.md
 * and mahjong-hk.md): the deal, calls in the claim window and their priority, several winners,
 * kongs and wins on their replacement tiles, robbing a kong, the last discard and the exhaustive
 * draw, the minimum, hidden choices, and the rounds.
 */
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import type { MahjongState } from '../../src/games/mahjong/rules';
import { actionText, checkConservation, DEFAULT_CONFIG, engine, mahjong, parseAction, position, viewOf } from '../../src/games/mahjong/rules';
import { HK_DEFAULTS } from '../../src/games/mahjong/styles/hong-kong';
import { codeOf, isBonus, kindOf } from '../../src/games/mahjong/core/tiles';

const legalText = (s: MahjongState) => mahjong.legal(s, s.turn).map(actionText);

function play(s: MahjongState, ...moves: string[]): MahjongState {
  let state = s;
  for (const move of moves) {
    const legal = legalText(state);
    if (!legal.includes(move)) throw new Error(`${move} is not legal for seat ${state.turn} (legal: ${legal.join(', ')})`);
    state = mahjong.apply(state, parseAction(move)).state;
    checkConservation(state);
  }
  return state;
}

const PLAIN = { flowers: 'off', minFaan: 1 } as const;

describe('the deal', () => {
  it('gives the dealer 14 and the others 13, with every bonus tile replaced from the back', () => {
    for (const seed of ['a', 'b', 'c', 'd', 'e']) {
      const s = mahjong.setup(DEFAULT_CONFIG, createRng(seed));
      const counts = s.hands.map((h) => h.length);
      expect(counts[s.dealer]).toBe(14);
      expect(counts.filter((n) => n === 13)).toHaveLength(3);
      expect(s.hands.flat().some((t) => isBonus(kindOf(t)))).toBe(false);
      expect(s.wall.length + s.hands.flat().length + s.bonus.flat().length).toBe(144);
      expect(s.turn).toBe(s.dealer);
      expect(s.phase).toBe('act');
      checkConservation(s);
    }
  });

  it('uses 136 tiles without flowers', () => {
    const s = mahjong.setup({ ...DEFAULT_CONFIG, options: { ...HK_DEFAULTS, flowers: 'off' } }, createRng('x'));
    expect(s.wall.length).toBe(136 - 53);
    expect(s.bonus.flat()).toEqual([]);
  });
});

describe('calls on a discard', () => {
  // Seat 0 throws 4s. Seat 1 (next) can chow it, seat 2 can pung it, seat 3 can win on it.
  const base = () =>
    position({
      options: PLAIN,
      turn: 0,
      hands: ['111p 999p EEE SSS 4s Gd', '23s 56s 234m 789p WdWd N', '44s 678m 234p NN WW Gd', '123m 456m 789m RdRdRd 4s'],
      drawn: 'Gd',
    });

  it('offers a chow only to the next player, a pung to anyone holding the pair, a win to anyone it completes', () => {
    let s = play(base(), '4s');
    expect(s.phase).toBe('claim');
    expect(s.turn).toBe(1);
    expect(legalText(s)).toEqual(['chow 2s', 'chow 3s', 'chow 4s', 'pass']);
    s = play(s, 'pass');
    expect(s.turn).toBe(2);
    expect(legalText(s)).toEqual(['pung', 'pass']);
    s = play(s, 'pass');
    expect(s.turn).toBe(3);
    expect(legalText(s)).toEqual(['win', 'pass']);
  });

  it('priority: a win beats a pung, which beats a chow; the beaten callers keep their tiles', () => {
    const s = play(base(), '4s', 'chow 3s', 'pung', 'win');
    expect(s.phase).toBe('scored');
    const result = s.results[0];
    expect(result?.wins.map((w) => [w.seat, w.from])).toEqual([[3, 0]]);
    expect(s.hands[1]).toHaveLength(13);
    expect(s.hands[2]).toHaveLength(13);
    expect(s.melds[1]).toEqual([]);
    expect(s.melds[2]).toEqual([]);
  });

  it('a pung beats a chow: play goes on from the caller, who must discard', () => {
    const s = play(base(), '4s', 'chow 3s', 'pung', 'pass');
    expect(s.turn).toBe(2);
    expect(s.phase).toBe('act');
    expect(s.melds[2]?.[0]?.type).toBe('pung');
    expect(s.melds[1]).toEqual([]);
    expect(legalText(s).every((m) => !['win', 'kong'].includes(m.split(' ')[0] ?? ''))).toBe(true);
    expect(s.discards[0]?.[0]?.claimed).toBe(true);
  });

  it('with nobody calling a higher set, the chow is made with the tiles chosen', () => {
    const s = play(base(), '4s', 'chow 4s', 'pass', 'pass');
    expect(s.turn).toBe(1);
    expect(s.melds[1]?.[0]?.tiles.map((t) => codeOf(kindOf(t)))).toEqual(['4s', '5s', '6s']);
  });

  it('a seat is not asked when nothing it could call would beat a call already made', () => {
    // Seat 2 pungs; seat 3 still may win; then nobody else is asked.
    const noWin = position({ options: PLAIN, turn: 0, hands: ['111p 999p EEE SSS 4s Gd', '23s 56s 234m 789p WdWd N', '44s 678m 234p NN WW Gd', '123m 456m 789m RdRd 6s 7s'], drawn: 'Gd' });
    const s = play(noWin, '4s', 'chow 2s', 'pung');
    expect(s.turn).toBe(2);
    expect(s.phase).toBe('act');
  });

  it('keeps choices hidden while the window is open', () => {
    const s = play(base(), '4s', 'chow 3s', 'pung');
    for (const seat of [0, 1, 2]) {
      const v = viewOf(s, seat);
      expect(v.turn).toBeNull();
      expect(JSON.stringify(v.claim)).not.toContain('declared');
      expect(JSON.stringify(v.claim)).not.toContain('waiting');
      expect(v.options).toEqual([]);
    }
    expect(viewOf(s, 3).turn).toBe(3);
    expect(viewOf(s, 3).options.map(actionText)).toEqual(['win', 'pass']);
  });
});

describe('several players able to win on one discard', () => {
  const both = (multipleWinners: 'first' | 'all') =>
    position({
      options: { ...PLAIN, multipleWinners },
      turn: 0,
      hands: ['111p 999p EEE SSS 4s Gd', '123p 456p 789p RdRdRd 4s', '789m 123s 56s WW WdWd Gd', '123m 456m 789m NNN 4s'],
      drawn: 'Gd',
    });

  it('first: only the first in turn after the discarder wins (the other is not asked)', () => {
    const s = play(both('first'), '4s', 'win');
    expect(s.phase).toBe('scored');
    expect(s.results[0]?.wins.map((w) => w.seat)).toEqual([1]);
  });

  it('all: both win, and each is paid', () => {
    const s = play(both('all'), '4s', 'win', 'win');
    const r = s.results[0];
    expect(r?.wins.map((w) => w.seat)).toEqual([1, 3]);
    expect(r?.deltas.reduce((a, b) => a + b, 0)).toBe(0);
    expect(r?.deltas[0]).toBeLessThan(0);
    expect(r?.deltas[2]).toBeLessThan(0);
    expect(r?.deltas[1]).toBeGreaterThan(0);
    expect(r?.deltas[3]).toBeGreaterThan(0);
  });
});

describe('kongs', () => {
  it('a concealed kong, then a win on its replacement tile: win by a kong', () => {
    const s0 = position({ options: PLAIN, turn: 0, hands: ['123m 456m 789m RdRdRdRd 5s', '', '', ''], back: '5s', drawn: 'Rd' });
    expect(legalText(s0)).toContain('kong Rd');
    const s1 = play(s0, 'kong Rd');
    expect(s1.turn).toBe(0);
    expect(s1.source).toBe('replacement');
    expect(codeOf(kindOf(s1.drawn as string))).toBe('5s');
    const s2 = play(s1, 'win');
    const lines = s2.results[0]?.wins[0]?.score.lines.map((l) => l.id);
    expect(lines).toContain('win-by-kong');
    expect(lines).toContain('self-drawn');
    expect(lines).toContain('concealed');
  });

  it('two kongs in a row, then a win: the double kong', () => {
    const s0 = position({ options: PLAIN, turn: 0, hands: ['123m 456m RdRdRdRd GdGdGd 5s', '', '', ''], back: 'Gd 5s', drawn: 'Rd' });
    const s = play(s0, 'kong Rd', 'kong Gd', 'win');
    expect(s.results[0]?.wins[0]?.score.lines.map((l) => l.id)).toContain('double-kong');
  });

  it('an exposed kong on a discard draws a replacement, and the caller may win on it', () => {
    const s0 = position({ options: PLAIN, turn: 0, hands: ['111m 999m 111p 999p Rd Gd', 'RdRdRd 123p 456p 789p 5s', '', ''], back: '5s', drawn: 'Gd' });
    const s1 = play(s0, 'Rd');
    expect(legalText(s1)).toEqual(['kong', 'pung', 'pass']);
    const s2 = play(s1, 'kong');
    expect(s2.turn).toBe(1);
    expect(s2.melds[1]?.[0]?.type).toBe('kong');
    expect(legalText(s2)).toContain('win');
    expect(play(s2, 'win').results[0]?.wins[0]?.score.lines.map((l) => l.id)).toContain('win-by-kong');
  });

  it('an added kong may be robbed by a player it completes, who is paid by the player who added', () => {
    const s0 = position({
      options: PLAIN,
      turn: 0,
      hands: ['5p 1m 2m 3m 7m 8m 9m 1s 2s 3s E', '', '46p 123s 456s 789s NN', ''],
      melds: [[{ type: 'pung', tiles: '555p', from: 2 }], [], [], []],
      drawn: '5p',
    });
    const s1 = play(s0, 'kong 5p');
    expect(s1.phase).toBe('rob');
    expect(s1.turn).toBe(2);
    expect(legalText(s1)).toEqual(['win', 'pass']);
    const s2 = play(s1, 'win');
    const r = s2.results[0];
    expect(r?.wins[0]?.robbed).toBe(true);
    expect(r?.wins[0]?.score.lines.map((l) => l.id)).toContain('robbing-kong');
    expect(r?.melds[0]?.[0]?.type).toBe('pung');
    expect(r?.deltas[0]).toBeLessThan(0);
    // Not robbed: the kong stands and its owner draws a replacement.
    const s3 = play(s1, 'pass');
    expect(s3.melds[0]?.[0]?.type).toBe('kong');
    expect(s3.turn).toBe(0);
    expect(s3.source).toBe('replacement');
  });

  it('robKong off: no window opens', () => {
    const s0 = position({ options: { ...PLAIN, robKong: 'off' }, turn: 0, hands: ['5p 1m 2m 3m 7m 8m 9m 1s 2s 3s E', '', '46p 123s 456s 789s NN', ''], melds: [[{ type: 'pung', tiles: '555p', from: 2 }], [], [], []], drawn: '5p' });
    const s1 = play(s0, 'kong 5p');
    expect(s1.phase).toBe('act');
    expect(s1.turn).toBe(0);
  });

  it('thirteen orphans robs a concealed kong only under the orphans option', () => {
    const spec = (robKong: string) =>
      position({ options: { ...PLAIN, robKong }, turn: 0, hands: ['1111m 2p 3p 4p 5s 6s 7s 8s 8s E', '', '', '9m 19p 19s E S W N Wd Gd Rd Rd'], drawn: '1m' });
    expect(play(spec('on'), 'kong 1m').phase).toBe('act');
    const s = play(spec('orphans'), 'kong 1m');
    expect(s.phase).toBe('rob');
    expect(s.turn).toBe(3);
    const won = play(s, 'win');
    expect(won.results[0]?.wins[0]?.score.lines.map((l) => l.id)).toEqual(['thirteen-orphans']);
    expect(won.results[0]?.melds[0]).toEqual([]);
  });
});

describe('the end of the wall', () => {
  it('on the last discard only a win may be called; with none the hand is drawn and nobody pays', () => {
    const s0 = position({ options: PLAIN, turn: 0, wall: 0, hands: ['111m 999m 111p 999p 4s Gd', '23s 1m 2m 3m 7p 8p 9p E E Wd Wd N', '44s 7m 8m 9m 1p 2p 3p N S S Wd E', ''], drawn: 'Gd' });
    const s = play(s0, '4s');
    expect(s.phase).toBe('scored');
    expect(s.results[0]?.wins).toEqual([]);
    expect(s.results[0]?.deltas).toEqual([0, 0, 0, 0]);
  });

  it('a win on the last discard scores it', () => {
    const s0 = position({ options: PLAIN, turn: 0, wall: 0, hands: ['111m 999m 111p 999p 4s Gd', '', '', '123m 456m 789m RdRdRd 4s'], drawn: 'Gd' });
    const s = play(s0, '4s');
    expect(legalText(s)).toEqual(['win', 'pass']);
    expect(play(s, 'win').results[0]?.wins[0]?.score.lines.map((l) => l.id)).toContain('last-discard');
  });

  it('a self-draw of the last tile scores the last tile', () => {
    const s0 = position({ options: PLAIN, turn: 3, wall: 1, front: '4s', hands: ['123m 456m 789m RdRdRd 4s', '', '', '111m 999m 111p 999p 5p Gd'], drawn: 'Gd' });
    const s1 = play(s0, 'Gd');
    expect(s1.turn).toBe(0);
    expect(s1.wall).toHaveLength(0);
    expect(play(s1, 'win').results[0]?.wins[0]?.score.lines.map((l) => l.id)).toContain('last-tile');
  });

  it('after a drawn hand the dealer keeps the deal under win-or-draw, and passes it under win', () => {
    const drawn = (dealerKeeps: string) => play(position({ options: { ...PLAIN, dealerKeeps, length: 'east' }, turn: 0, dealer: 0, wall: 0, hands: ['111m 999m 111p 999p 4s Gd', '', '', ''], drawn: 'Gd' }), '4s');
    expect(play(drawn('win-or-draw'), 'next').dealer).toBe(0);
    expect(play(drawn('win'), 'next').dealer).toBe(1);
  });
});

describe('the minimum', () => {
  const waiting = (minFaan: number) => position({ options: { flowers: 'off', minFaan }, turn: 0, hands: ['111m 999m 111p 999p 4s Gd', '', '', '123m 456m 789p 567s 4s'], drawn: 'Gd' });
  it('a hand below the minimum is not offered as a win', () => {
    // All chows and concealed: 2 faan.
    expect(play(waiting(3), '4s').phase).not.toBe('claim');
    expect(legalText(play(waiting(1), '4s'))).toEqual(['win', 'pass']);
  });
});

describe('rounds', () => {
  const after = (results: { wins: number[]; dealer: number }[], dealer: number, round = 0, passes = 0, options = {}) =>
    engine.afterHand({
      config: { style: 'hong-kong', options: { ...HK_DEFAULTS, ...options } },
      results: results.map((r, i) => ({ handNo: i, round, dealer: r.dealer, wins: r.wins.map((seat) => ({ seat, from: null, tile: '1m.0', robbed: false, score: { lines: [], raw: 0, total: 0, limit: false, unit: 'faan', base: 1 } })), deltas: [0, 0, 0, 0], hands: [[], [], [], []], melds: [[], [], [], []], bonus: [[], [], [], []], wallLeft: 0 })),
      dealer,
      round,
      passes,
      repeats: 0,
      scores: [0, 0, 0, 0],
      counter: 0,
    });

  it('the dealer keeps the deal after winning; it passes after another player wins', () => {
    expect(after([{ wins: [2], dealer: 2 }], 2)).toMatchObject({ dealer: 2, repeats: 1, over: false });
    expect(after([{ wins: [1], dealer: 2 }], 2)).toMatchObject({ dealer: 3, passes: 1, over: false });
  });

  it('after four passes the prevailing wind moves on, and the East round game ends', () => {
    expect(after([{ wins: [1], dealer: 0 }], 0, 0, 3, { length: 'east-south' })).toMatchObject({ dealer: 1, round: 1, passes: 0, over: false });
    expect(after([{ wins: [1], dealer: 0 }], 0, 0, 3, { length: 'east' })).toMatchObject({ round: 1, over: true });
    expect(after([{ wins: [1], dealer: 0 }], 0, 0, 0, { length: 'hand' })).toMatchObject({ over: true });
  });

  it('a game also ends after eight hands a round', () => {
    const eight = Array.from({ length: 8 }, () => ({ wins: [] as number[], dealer: 0 }));
    expect(after(eight, 0, 0, 0, { length: 'east' }).over).toBe(true);
    expect(after(eight.slice(0, 7), 0, 0, 0, { length: 'east' }).over).toBe(false);
  });
});

describe('heavenly and earthly hands', () => {
  it('the dealer winning on the deal scores the heavenly hand', () => {
    const s0 = position({ options: PLAIN, turn: 0, dealer: 0, hands: ['123m 456m 789p 234s 55s', '', '', ''], source: 'deal', calls: 0, wall: 60 });
    const s1 = { ...s0, discards: [[], [], [], []] as MahjongState['discards'] };
    // The filler discards are moved into the wall so no discard has been made yet.
    const fixed: MahjongState = { ...s1, wall: [...s0.wall, ...s0.discards.flat().map((d) => d.tile)] };
    checkConservation(fixed);
    expect(play(fixed, 'win').results[0]?.wins[0]?.score.lines.map((l) => l.id)).toEqual(['heavenly']);
  });
});
