/** Golden cases for docs/rules/holdem.md: one or more per rule, including the awkward ones. */
import { describe, expect, it } from 'vitest';
import { outcomePoints } from '../../src/core/contract';
import { createRng } from '../../src/core/rng';
import type { Card } from '../../src/games/holdem/cards';
import type { HoldemConfig, HoldemEvent, HoldemState } from '../../src/games/holdem/rules';
import { blindsAt, checkCards, checkChips, holdem, position, positionName, potOf, PRESETS, SIX_MAX_CASH, viewOf } from '../../src/games/holdem/rules';

const cfg = (c: Partial<HoldemConfig>): HoldemConfig => ({ ...SIX_MAX_CASH, ...c });
const toAct = (s: HoldemState): number => {
  if (s.toAct === null) throw new Error('nobody to act');
  return s.toAct;
};
const legalText = (s: HoldemState) => holdem.legal(s, toAct(s)).map((a) => holdem.codec.action.toText(a));
/** Applies actions in notation; returns the state and every event on the way. */
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
const of = <T extends HoldemEvent['type']>(events: readonly HoldemEvent[], type: T) => events.filter((e): e is Extract<HoldemEvent, { type: T }> => e.type === type);
const h = (text: string) => text.split(' ') as Card[];

describe('the deal and the blinds', () => {
  it('six-handed: the small and big blind left of the button, then the player left of the big blind acts', () => {
    const s = position({ button: 0, holes: [] });
    expect(s.players.map((p) => p.bet)).toEqual([0, 1, 2, 0, 0, 0]);
    expect(s.players.every((p) => p.hole.length === 2)).toBe(true);
    expect(toAct(s)).toBe(3);
    const legal = legalText(s);
    expect(legal.slice(0, 4)).toEqual(['fold', 'call', 'r4', 'r5']);
    expect(legal[legal.length - 1]).toBe('r200');
    expect(legal).toHaveLength(2 + 197);
    for (const seat of [0, 1, 2, 4, 5]) expect(holdem.legal(s, seat)).toEqual([]);
    expect(['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'].map((_, seat) => positionName(s, seat))).toEqual(['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO']);
    checkCards(s);
    checkChips(s);
  });

  it('a new game deals from the seed, and the same seed deals the same cards', () => {
    const a = holdem.setup(SIX_MAX_CASH, createRng('same'));
    const b = holdem.setup(SIX_MAX_CASH, createRng('same'));
    expect(a.players.map((p) => p.hole)).toEqual(b.players.map((p) => p.hole));
    expect(potOf(a)).toBe(3);
    expect(a.handNo).toBe(1);
  });

  it('heads-up: the button posts the small blind and acts first before the flop, last after it', () => {
    const s = position({ config: { format: 'heads-up', stack: 75 }, button: 0, holes: [] });
    expect(s.players.map((p) => p.bet)).toEqual([10, 20]);
    expect(toAct(s)).toBe(0);
    expect(legalText(s).slice(0, 3)).toEqual(['fold', 'call', 'r40']);
    expect(legalText(s)).toContain('r45');
    expect(legalText(s)).not.toContain('r42');
    expect(legalText(s)[legalText(s).length - 1]).toBe('r1500');
    const { state } = play(s, 'call', 'check');
    expect(state.street).toBe('flop');
    expect(toAct(state)).toBe(1);
    expect(positionName(s, 0)).toBe('BTN');
    expect(positionName(s, 1)).toBe('BB');
  });

  it('the big blind has the option: when everyone calls, it may check or raise', () => {
    const s = position({ seats: 3, button: 0, holes: [] });
    const { state } = play(s, 'call', 'call');
    expect(toAct(state)).toBe(2);
    expect(legalText(state).slice(0, 2)).toEqual(['check', 'r4']);
    const { state: flop } = play(state, 'check');
    expect(flop.street).toBe('flop');
    expect(flop.board).toHaveLength(3);
    expect(flop.burned).toHaveLength(1);
    expect(toAct(flop)).toBe(1);
  });

  it('antes come from every player; a big-blind ante from the big blind alone, after its blind', () => {
    const antes = position({ config: { ante: 'ante' }, button: 0, holes: [] });
    expect(antes.players.map((p) => p.total)).toEqual([1, 2, 3, 1, 1, 1]);
    expect(potOf(antes)).toBe(9);
    const sng = position({ config: PRESETS['sit-and-go'], button: 0, handNo: 31, holes: [] });
    expect(sng.blinds).toMatchObject({ sb: 50, bb: 100, ante: 100 });
    expect(sng.players.map((p) => p.total)).toEqual([0, 50, 200, 0, 0, 0]);
    expect(sng.players[2]?.bet).toBe(100);
    expect(sng.log.map((e) => e.kind)).toEqual(['small-blind', 'big-blind', 'ante']);
    // Before level 4 there is no ante.
    expect(position({ config: PRESETS['sit-and-go'], handNo: 30, holes: [] }).blinds.ante).toBe(0);
  });

  it('a live straddle: two big blinds from the player left of the big blind, who acts last before the flop', () => {
    const s = position({ config: { straddle: 'live' }, button: 0, holes: [] });
    expect(s.players.map((p) => p.bet)).toEqual([0, 1, 2, 4, 0, 0]);
    expect(toAct(s)).toBe(4);
    // The straddle doubles the minimum: the least raise is to 8.
    expect(legalText(s).slice(0, 3)).toEqual(['fold', 'call', 'r8']);
    const { state } = play(s, 'call', 'call', 'call', 'call', 'call');
    expect(toAct(state)).toBe(3);
    expect(legalText(state).slice(0, 2)).toEqual(['check', 'r8']);
  });
});

describe('betting', () => {
  it('the minimum raise is the last bet or raise; a re-raise must add at least as much again', () => {
    const s = position({ button: 0, holes: [] });
    const { state: one } = play(s, 'r6');
    expect(one.minRaise).toBe(4);
    expect(legalText(one).slice(0, 3)).toEqual(['fold', 'call', 'r10']);
    const { state: two } = play(one, 'r20');
    expect(two.minRaise).toBe(14);
    expect(legalText(two).slice(0, 3)).toEqual(['fold', 'call', 'r34']);
    expect(() => holdem.apply(two, { type: 'raise', to: 33 })).toThrow();
  });

  it('after the flop a bet is at least the big blind, and checking is free', () => {
    const s = position({ seats: 3, button: 0, holes: [] });
    const { state } = play(s, 'call', 'call', 'check');
    expect(legalText(state).slice(0, 3)).toEqual(['check', 'r2', 'r3']);
    expect(legalText(state)).not.toContain('fold');
    const { events } = play(state, 'r10');
    expect(of(events, 'act')[0]).toMatchObject({ kind: 'bet', amount: 10, to: 10 });
  });

  it('an all-in for less than a full raise does not reopen the betting for a player who has acted', () => {
    // Seat 2 has 30 after the blinds; seat 1 bets 20 on the flop and seat 2 moves in for 30.
    const s = position({ seats: 3, button: 0, stacks: [200, 200, 32], holes: [] });
    const { state: flop } = play(s, 'call', 'call', 'check');
    const { state } = play(flop, 'r20', 'r30');
    // Seat 0 has not acted yet, so it may raise.
    expect(toAct(state)).toBe(0);
    expect(legalText(state)).toContain('r50');
    const { state: back } = play(state, 'call');
    expect(toAct(back)).toBe(1);
    expect(legalText(back)).toEqual(['fold', 'call']);
  });

  it('the half-bet option: an all-in raise of at least half a full raise reopens the betting', () => {
    const s = position({ config: { shortAllIn: 'half-raise' }, seats: 3, button: 0, stacks: [200, 200, 32], holes: [] });
    const { state: flop } = play(s, 'call', 'call', 'check');
    const { state } = play(flop, 'r20', 'r30', 'call');
    expect(toAct(state)).toBe(1);
    expect(legalText(state).slice(0, 3)).toEqual(['fold', 'call', 'r50']);
    // Less than half does not: an all-in raise of 9 over a bet of 20.
    const t = position({ config: { shortAllIn: 'half-raise' }, seats: 3, button: 0, stacks: [200, 200, 31], holes: [] });
    const { state: flop2 } = play(t, 'call', 'call', 'check');
    const { state: back } = play(flop2, 'r20', 'r29', 'call');
    expect(legalText(back)).toEqual(['fold', 'call']);
  });

  it('two short all-ins that add up to a full raise do reopen it', () => {
    const s = position({ seats: 4, button: 0, stacks: [200, 200, 32, 42], holes: [] });
    // Preflop: seat 3 calls, seat 0 calls, seat 1 completes, seat 2 checks.
    const { state: flop } = play(s, 'call', 'call', 'call', 'check');
    expect(flop.street).toBe('flop');
    const { state } = play(flop, 'r20', 'r30', 'r40', 'call');
    expect(toAct(state)).toBe(1);
    expect(legalText(state).slice(0, 3)).toEqual(['fold', 'call', 'r60']);
  });

  it('a player who cannot cover the bet calls all-in for less, and the rest of the bet comes back', () => {
    const s = position({ seats: 3, button: 0, stacks: [200, 200, 50], holes: [h('Ah Ad'), h('7c 2d'), h('Kh Kd')], board: h('2c 7s 9d 3h 5c') });
    const { state, events } = play(s, 'r100', 'fold', 'call');
    expect(of(events, 'act').pop()).toMatchObject({ seat: 2, kind: 'call', amount: 48, to: 50, allIn: true });
    expect(of(events, 'return')).toEqual([{ type: 'return', seat: 0, amount: 50 }]);
    expect(of(events, 'win')).toEqual([{ type: 'win', seat: 0, amount: 101, pot: 0, value: expect.any(Number) as number }]);
    expect(state.lastHand?.net).toEqual([51, -1, -50]);
  });
});

describe('pots', () => {
  it('a three-way all-in makes a main pot and a side pot; the short stack wins the main, the next the side', () => {
    const s = position({ seats: 3, button: 0, stacks: [200, 50, 100], holes: [h('Qh Qd'), h('Ah Ad'), h('Kh Kd')], board: h('2c 7s 9d 3h 5c') });
    const { state, events } = play(s, 'r200', 'call', 'call');
    expect(of(events, 'board').map((e) => e.street)).toEqual(['flop', 'turn', 'river']);
    // Everyone is all-in, so every hand is shown, the last raiser first.
    expect(of(events, 'show').map((e) => e.seat)).toEqual([0, 1, 2]);
    expect(of(events, 'return')).toEqual([{ type: 'return', seat: 0, amount: 100 }]);
    const r = state.lastHand;
    expect(r?.pots.map((p) => [p.amount, [...p.eligible], [...p.winners]])).toEqual([
      [150, [0, 1, 2], [1]],
      [100, [0, 2], [2]],
    ]);
    expect(r?.net).toEqual([-100, 100, 0]);
  });

  it('an uncalled bet is returned when everyone folds', () => {
    const s = position({ seats: 3, button: 0, holes: [] });
    const { state: flop } = play(s, 'call', 'call', 'check');
    const { state, events } = play(flop, 'r100', 'fold', 'fold');
    expect(of(events, 'return')).toEqual([{ type: 'return', seat: 1, amount: 100 }]);
    expect(of(events, 'win')).toEqual([{ type: 'win', seat: 1, amount: 6, pot: 0, value: null }]);
    expect(of(events, 'show')).toEqual([]);
    expect(state.lastHand?.reason).toBe('fold');
    expect(state.lastHand?.net).toEqual([-2, 4, -2]);
  });

  it('everyone folds to the big blind: it wins the small blind', () => {
    const s = position({ seats: 3, button: 0, holes: [] });
    const { state } = play(s, 'fold', 'fold');
    expect(state.lastHand?.net).toEqual([0, -1, 1]);
    expect(state.handNo).toBe(2);
    expect(state.button).toBe(1);
  });

  it('a split pot: an odd chip goes to the first winner left of the button', () => {
    const s = position({ seats: 3, button: 0, holes: [h('9h 8h'), h('2c 3c'), h('4d 5d')], board: h('As Ks Qs Js Ts') });
    const { state } = play(s, 'call', 'fold', 'check', 'check', 'check', 'check', 'check', 'check', 'check');
    const pot = state.lastHand?.pots[0];
    expect(pot?.amount).toBe(5);
    expect(pot?.winners).toEqual([2, 0]);
    expect(pot?.shares).toEqual([3, 2]);
  });

  it('a split pot under the high-card rule: the odd chip to the highest hole card', () => {
    const s = position({ config: { oddChip: 'high-card' }, seats: 3, button: 0, holes: [h('9h 8h'), h('2c 3c'), h('4d 5d')], board: h('As Ks Qs Js Ts') });
    const { state } = play(s, 'call', 'fold', 'check', 'check', 'check', 'check', 'check', 'check', 'check');
    expect(state.lastHand?.pots[0]?.winners).toEqual([0, 2]);
    expect(state.lastHand?.pots[0]?.shares).toEqual([3, 2]);
  });

  it('a short big blind still makes the others call the full big blind; the extra comes back', () => {
    const s = position({ config: { format: 'heads-up' }, button: 0, stacks: [1500, 15], holes: [h('Ah Ad'), h('Jc 8d')], board: h('2c 7s 9d 3h 5c') });
    expect(s.players[1]?.bet).toBe(15);
    expect(s.currentBet).toBe(20);
    expect(legalText(s)).toEqual(['fold', 'call']);
    const { state, events } = play(s, 'call');
    expect(of(events, 'return')).toEqual([{ type: 'return', seat: 0, amount: 5 }]);
    expect(state.over).toBe(true);
    expect(holdem.outcome(state)?.results.map((r) => r.place)).toEqual([1, 2]);
  });
});

describe('the showdown', () => {
  it('the last to bet or raise on the river shows first; with the muck option a beaten hand is thrown away', () => {
    const s = position({ config: { showdown: 'muck' }, seats: 3, button: 0, holes: [h('Qc Jd'), h('Ah Kd'), h('9s 9c')], board: h('As 7h 4d 2s Tc') });
    const { state, events } = play(s, 'call', 'call', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'r10', 'call', 'call');
    expect(of(events, 'show').map((e) => e.seat)).toEqual([2, 1]);
    expect(of(events, 'muck').map((e) => e.seat)).toEqual([0]);
    expect(state.lastHand?.order).toEqual([2, 0, 1]);
    expect(state.lastHand?.shown[0]).toBeNull();
    expect(state.lastHand?.pots[0]?.winners).toEqual([1]);
  });

  it('when the river is checked, the first player left of the button shows first', () => {
    const s = position({ seats: 3, button: 0, holes: [h('Qc Jd'), h('Ah Kd'), h('9s 9c')], board: h('As 7h 4d 2s Tc') });
    const { state, events } = play(s, 'call', 'call', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'check');
    expect(of(events, 'show').map((e) => e.seat)).toEqual([1, 2, 0]);
    expect(state.lastHand?.values.every((v) => v !== null)).toBe(true);
  });

  it('with the muck option, a hand that ties the best so far is shown to claim its share', () => {
    const s = position({ config: { showdown: 'muck' }, seats: 3, button: 0, holes: [h('2c 3d'), h('4c 5d'), h('6c 7d')], board: h('As Ks Qs Js Ts') });
    const { events } = play(s, 'call', 'call', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'check');
    expect(of(events, 'show').map((e) => e.seat)).toEqual([1, 2, 0]);
  });
});

describe('formats', () => {
  it('a freezeout: the blinds rise every level', () => {
    let s = holdem.setup(cfg({ format: 'heads-up', levelHands: 6 }), createRng('levels'));
    expect(s.blinds).toMatchObject({ sb: 10, bb: 20, unit: 5 });
    const seen: HoldemEvent[] = [];
    while (s.handNo < 7) {
      const r = holdem.apply(s, legalText(s).includes('fold') ? { type: 'fold' } : { type: 'check' });
      seen.push(...r.events);
      s = r.state;
    }
    expect(s.level).toBe(2);
    expect(s.blinds).toMatchObject({ sb: 15, bb: 30 });
    expect(of(seen, 'level')).toEqual([{ type: 'level', level: 2, blinds: blindsAt(s.config, 2) }]);
    expect(blindsAt(s.config, 13)).toMatchObject({ sb: 1000, bb: 2000 });
    expect(blindsAt(s.config, 15)).toMatchObject({ sb: 4000, bb: 8000 });
  });

  it('two players out in one hand: the one who started it with more chips finishes higher', () => {
    const s = position({
      config: PRESETS['sit-and-go'],
      button: 0,
      stacks: [1500, 0, 0, 300, 500, 1500],
      holes: [h('Ah Ad'), null, null, h('7c 2d'), h('8c 3d'), h('9c 4d')],
      board: h('Ks Qh 5d 6s Jc'),
    });
    expect(s.players.map((p) => p.out)).toEqual([false, true, true, false, false, false]);
    // Button 0; seat 3 is the small blind, seat 4 the big blind, seat 5 acts first.
    expect(toAct(s)).toBe(5);
    const { state, events } = play(s, 'fold', 'r1500', 'call', 'call');
    expect(of(events, 'bust')).toEqual([
      { type: 'bust', seat: 3, place: 4 },
      { type: 'bust', seat: 4, place: 3 },
    ]);
    expect(state.places).toEqual([null, 6, 5, 4, 3, null]);
    // The button moves to the next seat still in.
    expect(state.button).toBe(5);
  });

  it('a sit-and-go pays the top places', () => {
    const s = position({ config: { ...PRESETS['sit-and-go'] }, seats: 6, button: 0, stacks: [1500, 0, 0, 0, 0, 300], holes: [h('Ah Ad'), null, null, null, null, h('7c 2d')], board: h('Ks Qh 5d 6s Jc') });
    // Heads-up now: the button (seat 0) posts the small blind and acts first.
    expect(toAct(s)).toBe(0);
    const { state } = play(s, 'r1500', 'call');
    expect(state.over).toBe(true);
    const o = holdem.outcome(state);
    expect(o?.reason).toBe('holdem-tournament');
    expect(o?.results.find((r) => r.seat === 0)).toMatchObject({ place: 1, score: 65 });
    expect(o?.results.find((r) => r.seat === 5)).toMatchObject({ place: 2, score: 35 });
    if (o) expect(outcomePoints(o, 0)).toBe(1);
  });

  it('a cash session: a busted player buys in again, and the session ends after its hands with chips won', () => {
    const s = position({ config: { hands: 2 }, seats: 3, button: 0, holes: [h('Ah Ad'), h('7c 2d'), h('Kh Kd')], board: h('2c 7s 9d 3h 5c') });
    const { state, events } = play(s, 'r200', 'fold', 'call');
    expect(of(events, 'rebuy')).toEqual([{ type: 'rebuy', seat: 2, amount: 200 }]);
    expect(state.players[2]?.buyIns).toBe(2);
    expect(state.handNo).toBe(2);
    checkChips({ ...state, players: state.players.map((p, i) => (i < 3 ? p : p)) });
    let t = state;
    while (!t.over) t = holdem.apply(t, legalText(t).includes('fold') ? { type: 'fold' } : { type: 'check' }).state;
    const o = holdem.outcome(t);
    expect(o?.reason).toBe('holdem-session');
    const net = o?.results.map((r) => r.score) ?? [];
    expect(net.reduce((a, b) => a + b, 0)).toBe(0);
    expect(o?.results.find((r) => r.seat === 0)?.place).toBe(1);
  });
});

describe('what each seat sees', () => {
  it('its own hole cards only; never the deck, the burn or the seed', () => {
    const s = holdem.setup(SIX_MAX_CASH, createRng('views'));
    for (let seat = 0; seat < 6; seat++) {
      const v = viewOf(s, seat);
      expect(v.players[seat]?.hole).toEqual(s.players[seat]?.hole);
      const text = JSON.stringify(v);
      for (const [i, p] of s.players.entries()) if (i !== seat) for (const c of p.hole) expect(text).not.toContain(`"${c}"`);
      for (const c of s.deck) expect(text).not.toContain(`"${c}"`);
      expect(text).not.toContain(s.seed);
      expect(v.players.every((p) => p.cards === 2)).toBe(true);
    }
  });

  it('a mucked hand stays hidden after the hand', () => {
    const s = position({ config: { showdown: 'muck' }, seats: 3, button: 0, holes: [h('Qc Jd'), h('Ah Kd'), h('9s 9c')], board: h('As 7h 4d 2s Tc') });
    const { state } = play(s, 'call', 'call', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'check', 'r10', 'call', 'call');
    const text = JSON.stringify(viewOf(state, 1).lastHand);
    expect(text).not.toContain('"Qc"');
    expect(text).toContain('"9s"');
  });
});
