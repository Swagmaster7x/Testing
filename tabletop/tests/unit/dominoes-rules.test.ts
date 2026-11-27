/** Golden cases for docs/rules/dominoes.md: one or more per rule, including the awkward ones. */
import { describe, expect, it } from 'vitest';
import { outcomePoints } from '../../src/core/contract';
import type { Json } from '../../src/core/json';
import { createRng } from '../../src/core/rng';
import type { DominoesAction, DominoesConfig, DominoesState, Pip, Tile } from '../../src/games/dominoes/rules';
import {
  cantHave,
  dominoes,
  endsOf,
  forcedLead,
  handPips,
  isBlocked,
  placeTile,
  position,
  PRESETS,
  PUERTO_RICO_500,
  sampleState,
  TILES,
  TOTAL_PIPS,
  viewOf,
} from '../../src/games/dominoes/rules';

const at = (p: Parameters<typeof position>[0]): DominoesState => dominoes.codec.state.fromText(position(p));
const play = (s: DominoesState, text: string): DominoesState => {
  const action = dominoes.codec.action.fromText(text);
  return dominoes.apply(s, action).state;
};
const legalText = (s: DominoesState, seat = s.turn) => dominoes.legal(s, seat).map((a) => dominoes.codec.action.toText(a));
const config = (c: Partial<DominoesConfig>): DominoesConfig => ({ ...PUERTO_RICO_500, ...c });

/** Builds a state directly, for draw-game cases that need a boneyard in a set order. */
function raw(p: { config: DominoesConfig; hands: Tile[][]; boneyard: Tile[]; line: [Pip, Pip][]; turn: number; moves?: Json[] }): DominoesState {
  return dominoes.codec.state.fromJSON({
    config: dominoes.codec.config.toJSON(p.config),
    hands: p.hands,
    boneyard: p.boneyard,
    chain: p.line.map(([left, right], n) => ({ tile: left <= right ? `${left}-${right}` : `${right}-${left}`, left, right, seat: n % p.hands.length, n })),
    moves: p.moves ?? [],
    leader: 0,
    turn: p.turn,
    scores: [0, 0],
    handNo: 5,
  });
}

describe('the set and the deal', () => {
  it('has 28 tiles and 168 pips', () => {
    expect(TILES).toHaveLength(28);
    expect(handPips([...TILES])).toBe(TOTAL_PIPS);
  });

  it('deals seven to each of four, with no boneyard, and the 6-6 leads the first hand', () => {
    const s = dominoes.setup(PUERTO_RICO_500, createRng('deal'));
    expect(s.hands.map((h) => h.length)).toEqual([7, 7, 7, 7]);
    expect(s.boneyard).toHaveLength(0);
    expect(s.hands[s.turn]).toContain('6-6');
    expect(legalText(s)).toEqual(['6-6']);
    for (const seat of [0, 1, 2, 3].filter((x) => x !== s.turn)) expect(dominoes.legal(s, seat)).toEqual([]);
  });

  it('deals seven each to two in the Draw game, fourteen to the boneyard', () => {
    const s = dominoes.setup(PRESETS.draw as DominoesConfig, createRng('draw'));
    expect(s.hands.map((h) => h.length)).toEqual([7, 7]);
    expect(s.boneyard).toHaveLength(14);
  });

  it('two players: the highest double dealt leads, else the heaviest tile', () => {
    expect(forcedLead([['5-5', '1-2'], ['4-4', '5-6']])).toEqual({ seat: 0, tile: '5-5' });
    expect(forcedLead([['1-2', '4-5'], ['0-1', '3-6']])).toEqual({ seat: 1, tile: '3-6' });
  });

  it('with any first lead, a seat drawn by lot leads any tile', () => {
    const s = dominoes.setup(PRESETS.international as DominoesConfig, createRng('lot'));
    expect(s.mustLead).toBeNull();
    expect(dominoes.legal(s, s.turn)).toHaveLength(7);
  });

  it('deals again when someone holds five doubles, with that option', () => {
    for (let i = 0; i < 300; i++) {
      const s = dominoes.setup(config({ redeal: 'five-doubles' }), createRng(`redeal-${i}`));
      for (const hand of s.hands) expect(hand.filter((t) => t[0] === t[2]).length).toBeLessThan(5);
    }
  });
});

describe('playing on the line', () => {
  it('a tile fits an end showing either number; the other number becomes the new end', () => {
    let chain = placeTile([], '3-5', null, 0, 0);
    expect(endsOf(chain)).toEqual([3, 5]);
    chain = placeTile(chain, '1-3', 'left', 1, 1);
    expect(endsOf(chain)).toEqual([1, 5]);
    chain = placeTile(chain, '5-5', 'right', 2, 2);
    expect(endsOf(chain)).toEqual([1, 5]);
    chain = placeTile(chain, '2-5', 'right', 3, 3);
    expect(endsOf(chain)).toEqual([1, 2]);
    expect(() => placeTile(chain, '4-6', 'left', 0, 4)).toThrow();
  });

  it('you must play when you can: no pass is offered then', () => {
    const s = at({ hands: [['1-4', '2-2'], null, null, null], line: '4-6', counts: [2, 9, 8, 8] });
    expect(legalText(s)).toEqual(['1-4L']);
    const t = at({ hands: [['1-2', '2-2'], null, null, null], line: '4-6', counts: [2, 9, 8, 8] });
    expect(legalText(t)).toEqual(['pass']);
  });

  it('offers both ends when a tile fits both', () => {
    const s = at({ hands: [['3-5', '0-0'], null, null, null], line: '3-6 6-6 6-5', counts: [2, 8, 8, 7] });
    expect(legalText(s)).toEqual(['3-5L', '3-5R']);
  });
});

describe('going out', () => {
  it('wins the hand for the side; winners score every tile left (all) or only the losers (losers)', () => {
    const s = at({ hands: [['1-4'], ['0-0', '6-6'], ['2-3'], null], line: '4-6', counts: [1, 2, 1, 23], handNo: 6 });
    const all = play(s, '1-4L');
    const result = all.results[all.results.length - 1];
    expect(result?.reason).toBe('domino');
    expect(result?.winner).toBe(0);
    const left = TOTAL_PIPS - 10 - 5;
    expect(result?.points).toEqual([left, 0]);
    const losers = play(at({ hands: [['1-4'], ['0-0', '6-6'], ['2-3'], null], line: '4-6', counts: [1, 2, 1, 23], handNo: 6, config: { scoring: 'losers' } }), '1-4L');
    expect(losers.results[0]?.points).toEqual([left - 5, 0]);
  });

  it('capicú: going out with a tile (not a double) that fits both ends', () => {
    const s = play(at({ hands: [['3-5'], null, null, null], line: '3-6 6-6 6-5', counts: [1, 8, 8, 8], handNo: 6 }), '3-5L');
    const result = s.results[0];
    expect(result?.bonuses.map((b) => b.kind)).toEqual(['capicu']);
    expect(result?.points[0]).toBe(TOTAL_PIPS - 32 - 8 + 100);
  });

  it('dominao: a double that fits both ends scores no bonus', () => {
    const s = play(at({ hands: [['3-3'], null, null, null], line: '3-1 1-2 2-3', counts: [1, 8, 8, 8], handNo: 6 }), '3-3L');
    expect(s.results[0]?.bonuses).toEqual([]);
  });

  it('chuchazo: going out with the double blank; with "one end", not when both ends show blanks', () => {
    const both = { hands: [['0-0'], null, null, null], line: '0-4 4-5 5-0', counts: [1, 8, 8, 8], handNo: 6 } as const;
    expect(play(at(both), '0-0L').results[0]?.bonuses.map((b) => b.kind)).toEqual(['chuchazo']);
    expect(play(at({ ...both, config: { chuchazoEnds: 'one-end' } }), '0-0L').results[0]?.bonuses).toEqual([]);
    const one = play(at({ hands: [['0-0'], null, null, null], line: '0-4 4-5', counts: [1, 9, 8, 8], handNo: 6, config: { chuchazoEnds: 'one-end' } }), '0-0L');
    expect(one.results[0]?.bonuses.map((b) => b.kind)).toEqual(['chuchazo']);
  });

  it('early bonuses of 100, 75, 50 and 25 for hands one to four', () => {
    const points = [0, 1, 2, 3, 4].map((handNo) => {
      const s = play(at({ hands: [['1-4'], ['0-0', '6-6'], ['2-3'], null], line: '4-6', counts: [1, 2, 1, 23], handNo }), '1-4L');
      return s.results[0]?.bonuses.find((b) => b.kind === 'early')?.points ?? 0;
    });
    expect(points).toEqual([100, 75, 50, 25, 0]);
  });
});

/** A line holding every six, with both ends 6 after 5-6 is played on the right: nobody can play. */
const BLOCK_LINE = '6-0 0-1 1-6 6-6 6-2 2-3 3-6 6-4 4-5';
/** After the block: side 0 holds 45 pips, side 1 holds 45; seat 0 holds 18, seat 1 holds 14. */
const TIE_HANDS: Tile[][] = [
  ['5-6', '5-5', '3-5'],
  ['0-0', '0-2', '0-3', '0-4', '1-1', '1-2'],
  ['4-4', '3-4', '2-5', '0-5'],
  ['1-3', '1-4', '1-5', '2-2', '2-4', '3-3'],
];
/** After the block: side 0 holds 24 pips (seat 0: 5), side 1 holds 66 (seat 1: 14). */
const LOW_HANDS: Tile[][] = [
  ['5-6', '0-0', '0-2', '0-3'],
  ['0-4', '0-5', '1-1', '1-2'],
  ['1-3', '1-4', '1-5', '2-2'],
  ['2-4', '2-5', '3-3', '3-4', '3-5', '4-4', '5-5'],
];

const blocked = (hands: Tile[][], c: Partial<DominoesConfig> = {}, leader = 0): DominoesState => {
  const s = at({ hands, line: BLOCK_LINE, handNo: 6, leader, config: c });
  return play(s, '5-6R');
};

describe('a blocked hand (tranque)', () => {
  it('ends when nobody can play, won by the side with fewer pips', () => {
    const before = at({ hands: LOW_HANDS, line: BLOCK_LINE, handNo: 6 });
    expect(isBlocked(before)).toBe(false);
    const s = blocked(LOW_HANDS);
    const r = s.results[0];
    expect(r?.reason).toBe('blocked');
    expect(r?.pips).toEqual([5, 14, 19, 52]);
    expect(r?.winner).toBe(0);
    expect(r?.points).toEqual([90, 0]);
    expect(blocked(LOW_HANDS, { scoring: 'losers' }).results[0]?.points).toEqual([66, 0]);
    expect(blocked(LOW_HANDS, { blockedScore: 'difference' }).results[0]?.points).toEqual([42, 0]);
  });

  it('scores no early bonus', () => {
    const s = play(at({ hands: LOW_HANDS, line: BLOCK_LINE, handNo: 0 }), '5-6R');
    expect(s.results[0]?.bonuses).toEqual([]);
  });

  it('a tie follows the tie rule', () => {
    const winner = (blockedTie: DominoesConfig['blockedTie'], leader = 1) => blocked(TIE_HANDS, { blockedTie }, leader).results[0]?.winner;
    expect(winner('none')).toBeNull();
    expect(blocked(TIE_HANDS, { blockedTie: 'none' }, 1).results[0]?.points).toEqual([0, 0]);
    expect(winner('starting')).toBe(1);
    expect(winner('starting', 0)).toBe(0);
    expect(winner('blocker')).toBe(0);
    expect(winner('not-blocker')).toBe(1);
    expect(winner('more-tiles')).toBe(1);
  });

  it('"blocker or next": the blocker and the player after compare their own pips', () => {
    const s = blocked(TIE_HANDS, { blockedWinner: 'blocker-or-next' });
    expect(s.results[0]?.winner).toBe(1);
    expect(s.results[0]?.points).toEqual([0, 90]);
  });

  it('the next hand is led by the winning side\'s player with fewer pips, or by the 6-6 after a tie', () => {
    expect(blocked(LOW_HANDS).turn).toBe(0);
    const tie = blocked(TIE_HANDS, { blockedTie: 'none' }, 1);
    expect(tie.mustLead).toBe('6-6');
    expect(tie.hands[tie.turn]).toContain('6-6');
    expect(blocked(TIE_HANDS, { blockedTie: 'blocker' }, 1).turn).toBe(0);
  });
});

describe('the pass bonus', () => {
  const passing = (passBonus: 'on' | 'off') =>
    at({
      hands: [['4-5', '0-5', '1-5', '2-5', '3-5', '5-5', '5-6'], null, null, null],
      line: '6-0 0-1 1-6 6-6 6-2 2-3 3-6 6-4',
      counts: [7, 5, 4, 4],
      handNo: 6,
      config: { passBonus },
    });

  it('pays 20 the first time and 10 after, for each opponent who passes; a partner\'s pass pays nothing', () => {
    let s = play(passing('on'), '4-5R');
    s = play(s, 'pass');
    expect(s.scores).toEqual([20, 0]);
    s = play(s, 'pass');
    expect(s.scores).toEqual([20, 0]);
    s = play(s, 'pass');
    expect(s.scores).toEqual([30, 0]);
    expect(s.turn).toBe(0);
    const off = play(play(passing('off'), '4-5R'), 'pass');
    expect(off.scores).toEqual([0, 0]);
  });

  it('a block pays the blocker for each opponent', () => {
    const s = blocked(LOW_HANDS, { passBonus: 'on' });
    expect(s.results[0]?.bonuses.filter((b) => b.kind === 'pass').map((b) => b.points)).toEqual([20, 10]);
    expect(s.scores).toEqual([120, 0]);
  });
});

describe('the Draw game', () => {
  const drawConfig = PRESETS.draw as DominoesConfig;

  it('a player who cannot play draws until a tile fits, then must play it', () => {
    const s = raw({ config: drawConfig, hands: [['0-1', '0-2'], ['1-1', '2-2', '3-3']], boneyard: ['1-3', '4-6', ...TILES.filter((t) => !['0-1', '0-2', '1-1', '2-2', '3-3', '1-3', '4-6', '6-6'].includes(t))], line: [[6, 6]], turn: 0 });
    expect(legalText(s)).toEqual(['draw']);
    const a = play(s, 'draw');
    expect(a.hands[0]).toContain('1-3');
    expect(legalText(a)).toEqual(['draw']);
    const b = play(a, 'draw');
    expect(legalText(b)).toEqual(['4-6L', '4-6R']);
  });

  it('passes only when the boneyard is spent, or down to two with "leave two"', () => {
    const others = TILES.filter((t) => !['0-1', '6-6', '1-2', '2-3'].includes(t));
    const two = raw({ config: { ...drawConfig, drawLimit: 'leave-two' }, hands: [['0-1'], others], boneyard: ['1-2', '2-3'], line: [[6, 6]], turn: 0 });
    // Seat 1 holds sixes, so the hand is not blocked; seat 0 may not draw the last two.
    expect(legalText(two)).toEqual(['pass']);
    const all = raw({ config: drawConfig, hands: [['0-1'], others], boneyard: ['1-2', '2-3'], line: [[6, 6]], turn: 0 });
    expect(legalText(all)).toEqual(['draw']);
  });

  it('hides a drawn tile from the other player', () => {
    const s = raw({ config: drawConfig, hands: [['0-1', '0-2'], ['1-1', '2-2', '3-3']], boneyard: ['1-3', '4-6', ...TILES.filter((t) => !['0-1', '0-2', '1-1', '2-2', '3-3', '1-3', '4-6', '6-6'].includes(t))], line: [[6, 6]], turn: 0 });
    const a = play(s, 'draw');
    expect(viewOf(a, 1).moves[0]).toEqual({ seat: 0, type: 'draw', ends: [6, 6] });
    expect(viewOf(a, 0).moves[0]?.tile).toBe('1-3');
  });
});

describe('leads, match and outcome', () => {
  /** Plays the first legal move until the hand number changes. */
  function finishHand(s: DominoesState): DominoesState {
    const hand = s.handNo;
    let state = s;
    while (!state.over && state.handNo === hand) state = dominoes.apply(state, dominoes.legal(state, state.turn)[0] as DominoesAction).state;
    return state;
  }

  it('with "rotate" the next player after the last leader leads any tile', () => {
    const s = dominoes.setup(PRESETS.venezuela as DominoesConfig, createRng('rotate'));
    const next = finishHand(s);
    expect(next.turn).toBe((s.leader + 1) % 4);
    expect(next.mustLead).toBeNull();
  });

  it('with "winner" the player who went out leads the next hand', () => {
    const s = dominoes.setup(PUERTO_RICO_500, createRng('winner-leads'));
    const next = finishHand(s);
    const r = next.results[0];
    if (r?.reason === 'domino') expect(next.turn).toBe(r.by);
  });

  it('with "double-six" the holder of the 6-6 leads it every hand', () => {
    const next = finishHand(dominoes.setup(config({ nextLead: 'double-six' }), createRng('six')));
    expect(next.mustLead).toBe('6-6');
  });

  it('a single-hand game ends after one hand; partners share the result', () => {
    const s = finishHand(dominoes.setup(config({ target: 0 }), createRng('single')));
    expect(s.over).toBe(true);
    const outcome = dominoes.outcome(s);
    expect(outcome?.teams).toEqual([
      [0, 2],
      [1, 3],
    ]);
    if (outcome && s.results[0]?.winner !== null) {
      expect(outcomePoints(outcome, 0)).toBe(outcomePoints(outcome, 2));
      expect(outcomePoints(outcome, 0) + outcomePoints(outcome, 1)).toBe(1);
    }
  });

  it('a match ends when a side reaches the target', () => {
    let s = dominoes.setup(config({ target: 100 }), createRng('to-100'));
    while (!s.over) s = finishHand(s);
    const [a = 0, b = 0] = s.scores;
    expect(Math.max(a, b)).toBeGreaterThanOrEqual(100);
    expect(s.results.reduce((sum, r) => sum + (r.points[0] ?? 0), 0)).toBe(a);
  });
});

describe('what the passes tell you', () => {
  it('"can\'t have": a seat that passed holds neither end', () => {
    const s = play(
      at({
        hands: [['4-5', '0-5', '1-5', '2-5', '3-5', '5-5', '5-6'], null, null, null],
        line: '6-0 0-1 1-6 6-6 6-2 2-3 3-6 6-4',
        counts: [7, 5, 4, 4],
        handNo: 6,
      }),
      '4-5R',
    );
    const after = play(s, 'pass');
    const view = viewOf(after, 2);
    expect([...cantHave(view, 1)].sort()).toEqual([5, 6]);
    // Every sample keeps it.
    for (let i = 0; i < 50; i++) {
      const sample = sampleState(view, createRng(`sample-${i}`));
      expect((sample.hands[1] ?? []).some((t) => t.includes('5') || t.includes('6'))).toBe(false);
      expect(sample.hands[2]).toEqual(after.hands[2]);
      expect(sample.hands.map((h) => h.length)).toEqual(after.hands.map((h) => h.length));
    }
  });

  it('the forced lead is hidden from everyone but the leader', () => {
    const s = dominoes.setup(PUERTO_RICO_500, createRng('hidden-lead'));
    const other = (s.turn + 1) % 4;
    expect(viewOf(s, s.turn).mustLead).toBe('6-6');
    expect(viewOf(s, other).mustLead).toBeNull();
  });
});

describe('notation', () => {
  it('reads and writes moves', () => {
    for (const text of ['6-6', '3-5L', '0-4R', 'pass', 'draw']) expect(dominoes.codec.action.toText(dominoes.codec.action.fromText(text))).toBe(text);
    expect(() => dominoes.codec.action.fromText('5-3L')).toThrow();
    expect(() => dominoes.codec.action.fromText('7-7')).toThrow();
  });
});
