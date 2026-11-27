// Hearts golden cases (docs/rules/hearts.md): one or more tests per rule.
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import type { Card } from '../../src/games/classic/cards';
import type { HeartsConfig, HeartsState } from '../../src/games/hearts/rules';
import { actionText, checkConservation, handPoints, hearts, passDirFor, playableCards, position, PRESETS, STANDARD } from '../../src/games/hearts/rules';

const at = (text: string): HeartsState => hearts.codec.state.fromText(text);
const play = (s: HeartsState, ...moves: string[]): HeartsState => moves.reduce((x, m) => hearts.apply(x, hearts.codec.action.fromText(m)).state, s);
const legalText = (s: HeartsState): string[] => hearts.legal(s, hearts.turn(s) ?? 0).map(actionText);

// Four thirteen-card hands with known shapes (seat 0 holds the two of clubs).
const H0: Card[] = ['2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'Tc', 'Jc', 'Qc', 'Kc', 'Ac'];
const H1: Card[] = ['2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Td', 'Jd', 'Qd', 'Kd', 'Ad'];
const H2: Card[] = ['2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Ts', 'Js', 'Qs', 'Ks', 'As'];
const H3: Card[] = ['2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'Th', 'Jh', 'Qh', 'Kh', 'Ah'];

describe('hearts: the deal and the pass', () => {
  it('deals 13 cards each from the whole pack', () => {
    const s = hearts.setup(STANDARD, createRng('deal'));
    expect(s.hands.map((h) => h.length)).toEqual([13, 13, 13, 13]);
    checkConservation(s);
    expect(s.phase).toBe('pass');
  });

  it('passes left, right, across, then holds, under the default pattern; other patterns too', () => {
    expect([0, 1, 2, 3, 4].map((n) => passDirFor(STANDARD, n))).toEqual([1, 3, 2, 0, 1]);
    expect([0, 1, 2, 3].map((n) => passDirFor({ passing: 'lra' }, n))).toEqual([1, 3, 2, 1]);
    expect([0, 1, 2].map((n) => passDirFor({ passing: 'lr' }, n))).toEqual([1, 3, 1]);
    expect(passDirFor({ passing: 'left' }, 7)).toBe(1);
    expect(passDirFor({ passing: 'none' }, 0)).toBe(0);
    const s = hearts.setup({ ...STANDARD, passing: 'none' }, createRng('hold'));
    expect(s.phase).toBe('play');
    expect(s.hands[s.leader]).toContain('2c');
  });

  it('hands the passed cards over only once all four have chosen, and the receiver sees them', () => {
    let s = hearts.setup(STANDARD, createRng('pass'));
    const chosen: Card[][] = [];
    for (let i = 0; i < 4; i++) {
      const seat = hearts.turn(s) as number;
      const cards = [...(s.hands[seat] ?? [])].slice(0, 3);
      chosen[seat] = cards;
      s = hearts.apply(s, { type: 'pass', cards }).state;
      if (i < 3) {
        expect(s.phase).toBe('pass');
        expect(s.hands[seat]).toEqual(expect.arrayContaining(cards));
        // Nobody else can see a pass before the exchange.
        for (const other of [0, 1, 2, 3].filter((x) => x !== seat)) expect(hearts.view(s, other).myPass === null || other !== seat).toBe(true);
      }
    }
    expect(s.phase).toBe('play');
    // Passing left: seat 1 holds what seat 0 chose, and sees it as received.
    expect(s.hands[1]).toEqual(expect.arrayContaining(chosen[0] as Card[]));
    expect(hearts.view(s, 1).received).toEqual(expect.arrayContaining(chosen[0] as Card[]));
    expect(s.hands[0]).not.toEqual(expect.arrayContaining(chosen[0] as Card[]));
    checkConservation(s);
  });
});

describe('hearts: the play', () => {
  it('the two of clubs leads the first trick', () => {
    const s = at(position({ hands: [H0, H1, H2, H3], config: { firstLead: 'two-clubs' } }));
    // position() puts no earlier tricks in when every card is in a hand: this is the first trick.
    expect(legalText(s)).toEqual(['2c']);
  });

  it('with the old rule the dealer’s left leads anything but a heart', () => {
    const hands = [['2c', '3h', '4h', 'Ac', 'Kd', 'Qd', 'Jd', 'Td', '9d', '8d', '7d', '6d', '5d'] as Card[]];
    const rest = ([...H0, ...H1, ...H2, ...H3] as Card[]).filter((c) => !hands[0]?.includes(c));
    const s = at(position({ hands: [hands[0] as Card[], rest.slice(0, 13), rest.slice(13, 26), rest.slice(26, 39)], config: { firstLead: 'left-of-dealer' } }));
    expect(legalText(s)).not.toContain('3h');
    expect(legalText(s)).toContain('2c');
    expect(legalText(s)).toContain('Kd');
  });

  it('players must follow suit; a void player may play anything (after the first trick)', () => {
    const tricks = [[{ seat: 0, card: '2c' as Card }, { seat: 1, card: '3c' as Card }, { seat: 2, card: '4c' as Card }, { seat: 3, card: '5c' as Card }]];
    const s = at(position({ hands: [['6c', 'Ah', 'Qs'], ['Kd', 'Kh', '9s'], ['Jc', 'Th', 'Ts'], ['Tc', 'Jh', 'Js']], tricks, leader: 1, broken: true }));
    // Seat 1 leads the king of diamonds: everyone void in diamonds may throw anything.
    const after = play(s, 'Kd');
    expect(legalText(after).sort()).toEqual(['Jc', 'Th', 'Ts'].sort());
  });

  it('no points on the first trick, unless a hand holds nothing else', () => {
    const s0 = at(position({ hands: [['2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'Tc', 'Jc', 'Qc', 'Kc', 'Ac'], H3, H2, H1] }));
    const s = play(s0, '2c');
    // Seat 1 holds only hearts: it may play one.
    expect(legalText(s).every((m) => m.endsWith('h'))).toBe(true);
    const s2 = play(s, '2h');
    // Seat 2 holds spades: not the queen.
    expect(legalText(s2)).not.toContain('Qs');
    expect(legalText(s2)).toContain('As');
    // With points allowed, the queen may go.
    const open = { ...s2, config: { ...s2.config, firstTrickPoints: 'yes' as const } };
    expect(playableCards(open, open.hands[2] ?? [])).toContain('Qs');
  });

  it('hearts may not be led until broken, unless the hand is all hearts, or hearts and the queen', () => {
    const tricks = [[{ seat: 0, card: '2c' as Card }, { seat: 1, card: '3c' as Card }, { seat: 2, card: '4c' as Card }, { seat: 3, card: '5c' as Card }]];
    const base = { tricks, leader: 0, broken: false };
    const mixed = at(position({ ...base, hands: [['Ah', 'Kh', 'Ad'], ['2d', '3d', '4d'], ['5d', '6d', '7d'], ['8d', '9d', 'Td']] }));
    expect(legalText(mixed)).toEqual(['Ad']);
    const allHearts = at(position({ ...base, hands: [['Ah', 'Kh', 'Qh'], ['2d', '3d', '4d'], ['5d', '6d', '7d'], ['8d', '9d', 'Td']] }));
    expect(legalText(allHearts).sort()).toEqual(['Ah', 'Kh', 'Qh'].sort());
    const heartsAndQueen = at(position({ ...base, hands: [['Ah', 'Kh', 'Qs'], ['2d', '3d', '4d'], ['5d', '6d', '7d'], ['8d', '9d', 'Td']] }));
    expect(legalText(heartsAndQueen).sort()).toEqual(['Ah', 'Kh', 'Qs'].sort());
    const open = at(position({ ...base, hands: [['Ah', 'Kh', 'Ad'], ['2d', '3d', '4d'], ['5d', '6d', '7d'], ['8d', '9d', 'Td']], config: { breakHearts: 'off' } }));
    expect(legalText(open)).toContain('Ah');
  });

  it('a heart played breaks hearts; with the option the queen of spades breaks them too', () => {
    const tricks = [[{ seat: 0, card: '2c' as Card }, { seat: 1, card: '3c' as Card }, { seat: 2, card: '4c' as Card }, { seat: 3, card: '5c' as Card }]];
    const hands: Card[][] = [['Ad', 'Ah', 'Kh'], ['Qs', '8c', '9c'], ['2d', 'Tc', 'Jc'], ['3d', '6c', '7c']];
    const s = at(position({ tricks, hands, leader: 0 }));
    const after = play(s, 'Ad', 'Qs', '2d', '3d');
    expect(after.broken).toBe(false);
    const queenRule = at(position({ tricks, hands, leader: 0, config: { queenBreaks: 'yes' } }));
    expect(play(queenRule, 'Ad', 'Qs').broken).toBe(true);
  });

  it('the highest card of the suit led wins; other suits never do', () => {
    const tricks = [[{ seat: 0, card: '2c' as Card }, { seat: 1, card: '3c' as Card }, { seat: 2, card: '4c' as Card }, { seat: 3, card: '5c' as Card }]];
    const s = at(position({ tricks, hands: [['9d', 'Ah'], ['Td', 'Kh'], ['As', 'Qh'], ['8d', 'Jh']], leader: 0, broken: true }));
    const after = play(s, '9d', 'Td', 'As', '8d');
    expect(after.leader).toBe(1);
  });
});

describe('hearts: scoring', () => {
  const none: Card[] = [];
  it('hearts are one point each, the queen thirteen; under Omnibus the jack of diamonds is minus ten', () => {
    const taken: Card[][] = [['2h', '3h', 'Qs'], ['4h', 'Jd'], [], ['5h', '6h', '7h', '8h', '9h', 'Th', 'Jh', 'Qh', 'Kh', 'Ah']];
    expect(handPoints(taken, STANDARD, [0, 0, 0, 0]).points).toEqual([15, 1, 0, 10]);
    expect(handPoints(taken, PRESETS.omnibus as HeartsConfig, [0, 0, 0, 0]).points).toEqual([15, -9, 0, 10]);
  });

  const moonTaken: Card[][] = [['2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'Th', 'Jh', 'Qh', 'Kh', 'Ah', 'Qs'], none, ['Jd'], none];
  it('shooting the moon adds 26 to the others, or subtracts 26 from the shooter', () => {
    expect(handPoints(moonTaken, STANDARD, [0, 0, 0, 0])).toEqual({ points: [0, 26, 26, 26], moon: 0 });
    expect(handPoints(moonTaken, { ...STANDARD, moon: 'subtract' }, [0, 0, 0, 0])).toEqual({ points: [-26, 0, 0, 0], moon: 0 });
    expect(handPoints(moonTaken, { ...STANDARD, jackDiamonds: 'minus-10' }, [0, 0, 0, 0]).points).toEqual([0, 26, 16, 26]);
  });

  it("the shooter's choice subtracts when adding would end the game without the shooter in first place", () => {
    const choose = { ...STANDARD, moon: 'choose' as const };
    expect(handPoints(moonTaken, choose, [10, 20, 30, 40]).points).toEqual([0, 26, 26, 26]);
    // Adding would put seat 3 over 100 while seat 1 (60 + 26 = 86) stays below the shooter's 90.
    expect(handPoints(moonTaken, choose, [90, 60, 70, 80]).points).toEqual([-26, 0, 0, 0]);
  });
});

describe('hearts: the end of the game', () => {
  // The last trick of a hand: seat 2 won every earlier trick (twelve hearts and the queen, 25);
  // the ace of clubs takes the last trick and the ace of hearts with it.
  const lastTrick = (scores: number[], config: Partial<HeartsConfig>) => at(position({ hands: [['Ac'], ['Ah'], ['3d'], ['4d']], leader: 0, broken: true, scores, config, winner: 2 }));
  const finish = (s: HeartsState) => play(s, 'Ac', 'Ah', '3d', '4d');

  it('ends once someone reaches the target; the lowest score wins, equal scores share a place', () => {
    const end = finish(lastTrick([9, 10, 80, 90], { target: 100 }));
    expect(end.results[0]?.points).toEqual([1, 0, 25, 0]);
    expect(end.scores).toEqual([10, 10, 105, 90]);
    expect(end.over).toBe(true);
    expect(hearts.outcome(end)?.results.map((r) => r.place)).toEqual([1, 1, 4, 3]);
  });

  it('with "play on", a tie for the lowest score deals another hand', () => {
    const end = finish(lastTrick([9, 10, 80, 90], { target: 100, ties: 'play-on' }));
    expect(end.over).toBe(false);
    expect(end.handNo).toBe(1);
    const clear = finish(lastTrick([10, 10, 80, 90], { target: 100, ties: 'play-on' }));
    expect(clear.over).toBe(true);
    expect(hearts.outcome(clear)?.results.map((r) => r.place)).toEqual([2, 1, 4, 3]);
  });

  it('a single hand ends the game at once', () => {
    expect(finish(lastTrick([0, 0, 0, 0], { target: 0 })).over).toBe(true);
    expect(finish(lastTrick([0, 0, 0, 0], { target: 50 })).over).toBe(false);
  });
});

describe('hearts: hidden information', () => {
  it('a view shows only your own hand, never another pass or the seed', () => {
    let s = hearts.setup(STANDARD, createRng('views'));
    const seat = hearts.turn(s) as number;
    const cards = [...(s.hands[seat] ?? [])].slice(0, 3);
    s = hearts.apply(s, { type: 'pass', cards }).state;
    for (const other of [0, 1, 2, 3]) {
      const view = hearts.view(s, other);
      const text = JSON.stringify(view);
      expect(text).not.toContain(s.seed);
      for (const x of [0, 1, 2, 3].filter((y) => y !== other)) for (const c of s.hands[x] ?? []) expect(view.hand).not.toContain(c);
      expect(view.myPass === null).toBe(other !== seat);
    }
  });
});
