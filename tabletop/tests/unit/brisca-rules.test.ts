// Golden cases for docs/rules/brisca.md.
import { describe, expect, it } from 'vitest';
import { findLegal } from '../../src/core/contract';
import { createRng } from '../../src/core/rng';
import type { BriscaAction, BriscaConfig, BriscaState, Card } from '../../src/games/brisca/rules';
import { actionText, brisca, cardPoints, DECK, PRESETS, position, PUERTO_RICO, pointsOf, presetOf, sampleState, strength, swapCardFor, TOTAL_POINTS, trickWinner, unseenCards, viewOf, WINNING_POINTS } from '../../src/games/brisca/rules';

const at = (text: string): BriscaState => brisca.codec.state.fromText(text);
const play = (s: BriscaState, text: string): BriscaState => {
  const seat = brisca.turn(s);
  if (seat === null) throw new Error('over');
  const action = findLegal(brisca, s, seat, brisca.codec.action.fromText(text, s));
  if (!action) throw new Error(`${text} is not legal; legal: ${brisca.legal(s, seat).map(actionText).join(' ')}`);
  return brisca.apply(s, action).state;
};
const legalTexts = (s: BriscaState) => brisca.legal(s, brisca.turn(s) ?? 0).map(actionText).sort();

describe('cards and tricks', () => {
  it('ranks the Tres above the Rey and the As above the Tres; the pack holds 120 points', () => {
    expect(strength('3o', PUERTO_RICO)).toBeGreaterThan(strength('Ro', PUERTO_RICO));
    expect(strength('Ao', PUERTO_RICO)).toBeGreaterThan(strength('3o', PUERTO_RICO));
    expect(strength('7o', PUERTO_RICO)).toBeGreaterThan(strength('6o', PUERTO_RICO));
    expect(strength('4o', PUERTO_RICO)).toBeGreaterThan(strength('2o', PUERTO_RICO));
    expect(pointsOf(DECK, PUERTO_RICO)).toBe(TOTAL_POINTS);
    expect(WINNING_POINTS).toBe(61);
    expect(cardPoints('Sc', PUERTO_RICO)).toBe(2);
  });

  it('a card of another suit never wins, any trump beats any non-trump', () => {
    expect(trickWinner([{ seat: 0, card: 'Ao' }, { seat: 1, card: 'Ac' }], 'e', PUERTO_RICO)).toBe(0);
    expect(trickWinner([{ seat: 0, card: 'Ao' }, { seat: 1, card: '2e' }], 'e', PUERTO_RICO)).toBe(1);
    expect(trickWinner([{ seat: 0, card: '2e' }, { seat: 1, card: '4e' }], 'e', PUERTO_RICO)).toBe(1);
    expect(trickWinner([{ seat: 0, card: 'Rb' }, { seat: 1, card: '3b' }], 'o', PUERTO_RICO)).toBe(1);
  });

  it('the seven as second brisca moves the points and the rank', () => {
    const seven = { secondBrisca: 'seven' as const };
    expect(cardPoints('7c', seven)).toBe(10);
    expect(cardPoints('3c', seven)).toBe(0);
    expect(strength('7c', seven)).toBeGreaterThan(strength('Rc', seven));
    expect(pointsOf(DECK, seven)).toBe(TOTAL_POINTS);
  });
});

describe('a hand', () => {
  it('deals three each, turns a trump under the stock, and the non-dealer leads', () => {
    const s = brisca.setup(PUERTO_RICO, createRng('deal'));
    expect(s.hands.map((h) => h.length)).toEqual([3, 3]);
    expect(s.stock.length).toBe(34);
    expect(s.turned).toBe(s.stock[33]);
    expect(s.trumpSuit).toBe(s.turned?.[1]);
    expect(brisca.turn(s)).toBe(0);
  });

  it('no duty to follow: the second player may throw any card', () => {
    const s = at(position({ trump: 'Rc', me: ['Ao', '4b', '5e'], them: ['3o', '2c', '6b'], leader: 0 }));
    const after = play(s, 'Ao');
    expect(legalTexts(after)).toEqual(['2c', '3o', '6b']);
  });

  it('the winner draws first, then the other; the loser of trick 17 draws the turned card', () => {
    const s = at(position({ trump: 'Rc', me: ['Ao'], them: ['2o'], stock: ['5b', 'Rc'], wonMe: [], wonThem: [] }));
    const done = play(play(s, 'Ao'), '2o');
    expect(done.hands[0]).toContain('5b');
    expect(done.hands[1]).toContain('Rc');
    expect(done.known[1]).toEqual(['Rc']);
    expect(done.turned).toBeNull();
    expect(done.leader).toBe(0);
  });

  it('points always total 120 at the end, 61 wins, and 60-60 follows the tie option', () => {
    for (const seed of ['a', 'b', 'c', 'd']) {
      let s = brisca.setup(PUERTO_RICO, createRng(seed));
      const rng = createRng(`${seed}/moves`);
      while (brisca.turn(s) !== null) s = brisca.apply(s, rng.pick(brisca.legal(s, brisca.turn(s) ?? 0))).state;
      const result = s.results[0];
      expect((result?.points[0] ?? 0) + (result?.points[1] ?? 0)).toBe(120);
      const o = brisca.outcome(s);
      expect(o).not.toBeNull();
      if (result?.winner !== null && result) expect(result.points[result.winner]).toBeGreaterThanOrEqual(61);
    }
    // A 60-60 hand: a draw by default, most cards wins under the Spain preset.
    const tie = (config: BriscaConfig) => {
      // Seat 0 has 60 points in more cards than seat 1, with one trick left that holds no points.
      const zero: Card[] = ['2o', '4o', '5o', '6o', '7o', '2c', '4c', '5c', '6c', '7c', '2e', '4e', '5e', '6e', '7e', '2b', '4b', '5b', '6b', '7b'];
      const pointsA: Card[] = ['Ao', '3o', 'Ro', 'Co', 'So', 'Ac', '3c', 'Rc', 'Cc', 'Sc'];
      const pointsB: Card[] = ['Ae', '3e', 'Re', 'Ce', 'Se', 'Ab', '3b', 'Rb', 'Cb', 'Sb'];
      expect(pointsOf(pointsA, config) + pointsOf(pointsB, config)).toBe(120);
      // The last trick: 2o and 4o. Seat 0 wins it (leads 4o, 2o follows).
      const wonMe = [...pointsA, ...zero.slice(2, 18)];
      const wonThem = [...pointsB, ...zero.slice(18)];
      const s = at(position({ trump: 'b', me: ['4o'], them: ['2o'], stock: [], wonMe, wonThem, config }));
      return play(play(s, '4o'), '2o');
    };
    const draw = tie(PUERTO_RICO);
    expect(draw.results[0]?.points).toEqual([60, 60]);
    expect(draw.results[0]?.winner).toBeNull();
    expect(brisca.outcome(draw)?.reason).toBe('brisca-tie');
    const spain = tie(PRESETS.spain as BriscaConfig);
    expect(spain.results[0]?.winner).toBe(0);
  });

  it('a match deals again with the deal alternating until someone wins enough hands', () => {
    let s = brisca.setup({ ...PUERTO_RICO, matchTo: 2 }, createRng('match'));
    const rng = createRng('match/moves');
    const dealers: number[] = [s.dealer];
    while (brisca.turn(s) !== null) {
      const before = s.handNo;
      s = brisca.apply(s, rng.pick(brisca.legal(s, brisca.turn(s) ?? 0))).state;
      if (s.handNo !== before) dealers.push(s.dealer);
    }
    expect(Math.max(...s.matchWins)).toBe(2);
    for (let i = 1; i < dealers.length; i++) expect(dealers[i]).not.toBe(dealers[i - 1]);
  });
});

describe('the swap', () => {
  it('the 7 takes a turned point card, the 2 a turned 4 to 7, as the option says', () => {
    expect(swapCardFor('Rc', PUERTO_RICO)).toBe('7c');
    expect(swapCardFor('Ac', PUERTO_RICO)).toBe('7c');
    expect(swapCardFor('5c', PUERTO_RICO)).toBe('2c');
    expect(swapCardFor('7c', PUERTO_RICO)).toBe('2c');
    expect(swapCardFor('2c', PUERTO_RICO)).toBeNull();
    expect(swapCardFor('5c', { ...PUERTO_RICO, swap: 'seven' })).toBeNull();
    expect(swapCardFor('Rc', { ...PUERTO_RICO, swap: 'none' })).toBeNull();
  });

  it('swapping puts the 7 under the stock and the turned card in hand, known to all', () => {
    const s = at(position({ trump: 'Rc', me: ['7c', '4b', '5e'], them: ['3o', '2b', '6b'] }));
    expect(legalTexts(s)).toContain('swap');
    const after = play(s, 'swap');
    expect(after.hands[0]).toContain('Rc');
    expect(after.turned).toBe('7c');
    expect(after.stock[after.stock.length - 1]).toBe('7c');
    expect(after.known[0]).toEqual(['Rc']);
    expect(viewOf(after, 1).known[0]).toEqual(['Rc']);
  });

  it('only after winning a trick under the Spain preset, and never once the turned card is drawn', () => {
    const spain = at(position({ trump: 'Rc', me: ['7c', '4b', '5e'], them: ['3o', '2b', '6b'], config: PRESETS.spain }));
    expect(legalTexts(spain)).not.toContain('swap');
    const drawn = at(position({ trump: 'Rc', me: ['7c', '4b', '5e'], them: ['3o', '2b', '6b'], stock: [] }));
    expect(legalTexts(drawn)).not.toContain('swap');
  });
});

describe('options', () => {
  it('arrastre: after the As of trumps is led with a call, the other must play their best trump', () => {
    const s = at(position({ trump: 'Rc', me: ['Ac', '4b', '5e'], them: ['3c', '2c', 'Ao'], config: { arrastre: 'on' } }));
    expect(legalTexts(s)).toContain('Ac!');
    const called = play(s, 'Ac!');
    expect(legalTexts(called)).toEqual(['3c']);
    const quiet = play(s, 'Ac');
    expect(legalTexts(quiet)).toEqual(['2c', '3c', 'Ao']);
  });

  it('rotating trumps turns nothing and offers no swap', () => {
    const s = brisca.setup({ ...PUERTO_RICO, trumps: 'rotate' }, createRng('rotate'));
    expect(s.turned).toBeNull();
    expect(s.trumpSuit).toBe('o');
    expect(brisca.legal(s, 0).some((a: BriscaAction) => a.type === 'swap')).toBe(false);
  });

  it('presets are recognised by name and round-trip through the config codec', () => {
    for (const [name, config] of Object.entries(PRESETS)) {
      expect(presetOf(brisca.codec.config.fromJSON(brisca.codec.config.toJSON(config)))).toBe(name);
    }
  });
});

describe('hidden information', () => {
  it('a view shows the own hand and public history only, and a sample is consistent with it', () => {
    const s = brisca.setup(PUERTO_RICO, createRng('hidden'));
    const view = viewOf(s, 0);
    const text = JSON.stringify(view);
    for (const card of s.hands[1] ?? []) expect(text.includes(`"${card}"`)).toBe(false);
    expect(text.includes(s.seed)).toBe(false);
    expect(unseenCards(view).length).toBe(40 - 3 - 1);
    const sampled = sampleState(view, createRng('sample'));
    expect(sampled.hands[0]).toEqual(s.hands[0]);
    expect(sampled.hands[1]?.length).toBe(3);
    expect(sampled.stock.length).toBe(34);
    expect(sampled.stock[33]).toBe(s.turned);
  });
});
