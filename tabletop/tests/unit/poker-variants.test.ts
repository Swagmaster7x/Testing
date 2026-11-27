/** Golden cases for docs/rules/poker-variants.md: Omaha, Five-Card Draw and Seven-Card Stud on the poker engine. */
import { describe, expect, it } from 'vitest';
import type { Card } from '../../src/games/holdem/cards';
import { categoryOf } from '../../src/games/holdem/evaluate';
import type { HoldemConfig, HoldemEvent, HoldemState } from '../../src/games/holdem/rules';
import { checkCards, checkChips, holdem, position, PRESETS, SIX_MAX_CASH } from '../../src/games/holdem/rules';
import { highValue, lowName, lowValue } from '../../src/games/holdem/showdown';

const h = (text: string) => text.split(' ') as Card[];
const toAct = (s: HoldemState): number => {
  if (s.toAct === null) throw new Error('nobody to act');
  return s.toAct;
};
const legalText = (s: HoldemState) => holdem.legal(s, toAct(s)).map((a) => holdem.codec.action.toText(a));
function play(s: HoldemState, ...moves: string[]): { state: HoldemState; events: HoldemEvent[] } {
  const events: HoldemEvent[] = [];
  let state = s;
  for (const m of moves) {
    const r = holdem.apply(state, holdem.codec.action.fromText(m));
    state = r.state;
    events.push(...r.events);
  }
  return { state, events };
}
const cfg = (c: Partial<HoldemConfig>): Partial<HoldemConfig> => c;

describe('Omaha', () => {
  it('a hand uses exactly two hole cards and exactly three board cards', () => {
    // Four hearts in the hand and two on the board is no flush; the board's straight needs three hole cards.
    expect(categoryOf(highValue('omaha', h('Ah Kh Qh Jh'), [], h('Th 2c 3d 4s 9h')))).toBe('high-card');
    expect(categoryOf(highValue('holdem', h('Ah Kh'), [], h('Qh Jh Th 2c 3d')))).toBe('straight-flush');
    // Four aces on the board make only three of a kind: two of the five must be hole cards.
    expect(categoryOf(highValue('omaha', h('2c 3d 4h 5s'), [], h('Ah Ac Ad As Kh')))).toBe('trips');
    // Two hole aces with two on the board are four of a kind.
    expect(categoryOf(highValue('omaha', h('As Ad 7c 8d'), [], h('Ah Ac Kd 2s 3c')))).toBe('quads');
  });

  it('deals four hole cards each', () => {
    const s = position({ config: cfg({ game: 'omaha', betting: 'pot-limit' }), button: 0, holes: [] });
    expect(s.players.every((p) => p.hole.length === 4)).toBe(true);
    checkCards(s);
    checkChips(s);
  });

  it('pot-limit: a raise makes the bet at most the pot after calling', () => {
    const s = position({ config: cfg({ game: 'omaha', betting: 'pot-limit' }), button: 0, holes: [] });
    // Blinds 1 and 2: under the gun calls 2, the pot is 5, so the most is a raise of 5, to 7.
    const legal = legalText(s);
    expect(legal.slice(0, 3)).toEqual(['fold', 'call', 'r4']);
    expect(legal[legal.length - 1]).toBe('r7');
    const { state } = play(s, 'r7');
    // Now 1 + 2 + 7 is in; the next player calls 7 to make 17, and may raise 17 more: to 24.
    const next = legalText(state);
    expect(next[next.length - 1]).toBe('r24');
  });

  it('high-low eight or better: the low hand takes half, a high hand alone takes all', () => {
    const base = { config: cfg({ game: 'omaha', betting: 'fixed-limit', split: 'high-low', format: 'heads-up' }), button: 0 };
    const split = position({ ...base, holes: [h('As 2d 9c 9h'), h('Kh Kd Js Ts')], board: h('3c 5d 7h Kc Qs') });
    expect(lowValue('omaha', h('As 2d 9c 9h'), [], h('3c 5d 7h Kc Qs'))).not.toBeNull();
    expect(lowName(lowValue('omaha', h('As 2d 9c 9h'), [], h('3c 5d 7h Kc Qs')) ?? 0)).toBe('7-5-3-2-A');
    const { state } = play(split, 'call', 'check', 'check', 'check', 'check', 'check', 'check', 'check');
    const pot = state.lastHand?.pots[0];
    expect(pot?.lowWinners).toEqual([0]);
    // The button (seat 0) has the low, seat 1 three kings: 40 heads-up at 10/20 split 20 and 20.
    expect(state.lastHand?.net).toEqual([0, 0]);
    // No three low cards on the board: no low, so the high hand scoops.
    const scoop = position({ ...base, holes: [h('As 2d 9c 9h'), h('Kh Kd Js Ts')], board: h('3c Td Qh Kc Qs') });
    const { state: after } = play(scoop, 'call', 'check', 'check', 'check', 'check', 'check', 'check', 'check');
    expect(after.lastHand?.pots[0]?.lowWinners).toEqual([]);
    expect(after.lastHand?.net).toEqual([-20, 20]);
  });
});

describe('Five-Card Draw', () => {
  const draw = (c: Partial<HoldemConfig> = {}) => cfg({ game: 'draw', betting: 'fixed-limit', ...c });

  it('deals five, bets, then each player draws up to three in turn from the left of the button', () => {
    const s = position({ config: draw(), seats: 3, button: 0, holes: [h('Ks Kd 7c 4h 2s'), h('Ah Qh 9h 3h 2c'), h('Jc Jd Js 8c 5d')], next: h('Kc Qd 6s 9d') });
    expect(s.players.every((p) => p.hole.length === 5)).toBe(true);
    // Fixed limit: before the draw the small bet, one big blind (2): a raise is to 4.
    expect(legalText(s)).toEqual(['fold', 'call', 'r4']);
    const { state } = play(s, 'call', 'call', 'check');
    expect(state.street).toBe('draw');
    expect(toAct(state)).toBe(1);
    // None to three of five cards: 1 + 5 + 10 + 10 ways.
    expect(holdem.legal(state, 1)).toHaveLength(26);
    const { state: drawn, events } = play(state, 'd3h2c', 'd8c5d', 'd7c4h2s');
    expect(events.filter((e) => e.type === 'drew').map((e) => (e.type === 'drew' ? e.count : 0))).toEqual([2, 2, 3]);
    expect(drawn.players[1]?.hole).toEqual(h('Ah Qh 9h Kc Qd'));
    expect(drawn.players[2]?.hole).toEqual(h('Jc Jd Js 6s 9d'));
    expect(drawn.street).toBe('postdraw');
    // After the draw the big bet: two big blinds.
    expect(toAct(drawn)).toBe(1);
    expect(legalText(drawn)).toEqual(['check', 'r4']);
    checkCards(drawn);
  });

  it('may allow drawing all five; if the deck runs out, the discards make a new one', () => {
    const s = position({ config: draw({ maxDraw: 5 }), button: 0, holes: [] });
    let { state } = play(s, 'call', 'call', 'call', 'call', 'call', 'check');
    expect(state.street).toBe('draw');
    expect(holdem.legal(state, toAct(state))).toHaveLength(32);
    // Six players drawing five each need 30 cards; 22 are left.
    for (let i = 0; i < 6; i++) {
      const seat = toAct(state);
      state = play(state, `d${state.players[seat]?.hole.join('')}`).state;
      checkCards(state);
    }
    expect(state.street).toBe('postdraw');
    expect(state.players.every((p) => p.hole.length === 5)).toBe(true);
  });
});

describe('Seven-Card Stud', () => {
  const stud = (c: Partial<HoldemConfig> = {}) => cfg({ game: 'stud', betting: 'fixed-limit', ...c });
  // Three players, button 0: cards go to seats 1, 2, 0.
  const three = () =>
    position({
      config: stud(),
      seats: 3,
      button: 0,
      holes: [h('As Ad'), h('9c 9d'), h('5h 6h')],
      ups: [h('Kc Kd 3s 4c'), h('2d 3h 8s 8h'), h('2c 4h 7d Ts')],
      downs: [h('Ah')[0] ?? null, h('9h')[0] ?? null, h('Jc')[0] ?? null],
    });

  it('antes, two down and one up; the lowest up card brings it in, clubs lowest on a tie', () => {
    const s = three();
    expect(s.players.map((p) => p.total)).toEqual([1, 1, 1]);
    expect(s.players.map((p) => [p.hole.length, p.up.length])).toEqual([
      [2, 1],
      [2, 1],
      [2, 1],
    ]);
    // Seat 1 shows the 2 of diamonds, seat 2 the 2 of clubs: clubs is lower, so seat 2 brings it in.
    expect(toAct(s)).toBe(2);
    // Bring it in for 1, or complete to the small bet of 2; no fold, no check.
    expect(legalText(s)).toEqual(['r1', 'r2']);
    const { state } = play(s, 'r1');
    expect(state.log[state.log.length - 1]?.kind).toBe('bring-in');
    expect(toAct(state)).toBe(0);
    expect(legalText(state)).toEqual(['fold', 'call', 'r2']);
    const { state: completed } = play(state, 'r2');
    expect(completed.log[completed.log.length - 1]?.kind).toBe('complete');
    // After the completion, raises go up by the small bet.
    expect(legalText(completed)).toEqual(['fold', 'call', 'r4']);
  });

  it('from fourth street the best hand showing acts first, and an open pair allows the big bet', () => {
    const { state } = play(three(), 'r1', 'call', 'call');
    expect(state.street).toBe('fourth');
    expect(state.players.every((p) => p.up.length === 2)).toBe(true);
    // Seat 0 shows kings.
    expect(toAct(state)).toBe(0);
    expect(legalText(state)).toEqual(['check', 'r2', 'r4']);
    const { state: big } = play(state, 'r4');
    // After a big bet, raises are big.
    expect(legalText(big)).toEqual(['fold', 'call', 'r8']);
  });

  it('a bet and three raises at most, unless only two are in', () => {
    const { state } = play(three(), 'r1', 'call', 'call', 'check', 'check', 'check');
    expect(state.street).toBe('fifth');
    // Fifth street: big bets (4); the kings showing (seat 0) act first.
    const first = toAct(state);
    const { state: capped } = play(state, 'r4', 'r8', 'r12', 'r16');
    expect(capped.raises).toBe(4);
    // The fourth bet came round to the first player again; the next player may only call or fold.
    expect(toAct(capped)).not.toBe(first);
    expect(legalText(capped)).toEqual(['fold', 'call']);
    // Heads-up there is no cap.
    const hu = position({ config: { ...SIX_MAX_CASH, game: 'holdem', betting: 'fixed-limit', format: 'heads-up' }, button: 0, holes: [] });
    const { state: many } = play(hu, 'r40', 'r60', 'r80', 'r100');
    expect(legalText(many)).toContain('r120');
  });

  it('plays the best five of seven at the showdown', () => {
    const { state, events } = play(three(), 'r1', 'call', 'call', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'check');
    const shows = events.filter((e) => e.type === 'show');
    expect(shows).toHaveLength(3);
    // Seat 0: aces and kings in the hole and up (A A K K A: aces full of kings).
    const r = state.lastHand;
    expect(r?.pots[0]?.winners).toEqual([0]);
    expect(categoryOf(r?.values[0] ?? 0)).toBe('full-house');
  });

  it('the presets set the games', () => {
    expect(PRESETS['pot-limit-omaha']).toMatchObject({ game: 'omaha', betting: 'pot-limit' });
    expect(PRESETS['five-card-draw']).toMatchObject({ game: 'draw', betting: 'fixed-limit' });
    expect(PRESETS['seven-card-stud']).toMatchObject({ game: 'stud', betting: 'fixed-limit' });
    expect(PRESETS['omaha-high-low']).toMatchObject({ game: 'omaha', split: 'high-low' });
  });
});
