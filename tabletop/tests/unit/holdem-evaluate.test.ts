/** The hand evaluator: golden cases for every category and tie, and agreement with pokersolver. */
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import type { Card } from '../../src/games/holdem/cards';
import { DECK, handClass, HAND_CLASSES } from '../../src/games/holdem/cards';
import { categoryOf, evaluate, handNameParts } from '../../src/games/holdem/evaluate';

const require = createRequire(import.meta.url);
// A test oracle only (MIT); never shipped.
const { Hand } = require('pokersolver') as { Hand: { solve(cards: string[]): unknown; winners(hands: unknown[]): unknown[] } };

const h = (text: string) => text.split(' ') as Card[];

describe('the evaluator', () => {
  it('names every category', () => {
    expect(categoryOf(evaluate(h('As Ks Qs Js Ts 2c 3d')))).toBe('straight-flush');
    expect(categoryOf(evaluate(h('9c 9d 9h 9s Kd 2c 3d')))).toBe('quads');
    expect(categoryOf(evaluate(h('9c 9d 9h Ks Kd 2c 3d')))).toBe('full-house');
    expect(categoryOf(evaluate(h('2h 7h 9h Jh Kh Ac Ad')))).toBe('flush');
    expect(categoryOf(evaluate(h('5c 6d 7h 8s 9d 2c 2d')))).toBe('straight');
    expect(categoryOf(evaluate(h('7c 7d 7h Ks 2d 4c 9d')))).toBe('trips');
    expect(categoryOf(evaluate(h('7c 7d Kh Ks 2d 4c 9d')))).toBe('two-pair');
    expect(categoryOf(evaluate(h('7c 7d Kh Qs 2d 4c 9d')))).toBe('pair');
    expect(categoryOf(evaluate(h('7c 3d Kh Qs 2d 4c 9d')))).toBe('high-card');
  });

  it('plays the ace low in the wheel, and a six-high straight beats it', () => {
    const wheel = evaluate(h('Ac 2d 3h 4s 5d Kc Kd'));
    expect(categoryOf(wheel)).toBe('straight');
    expect(handNameParts(wheel).ranks).toEqual(['5']);
    expect(evaluate(h('2d 3h 4s 5d 6c Kc Qd'))).toBeGreaterThan(wheel);
  });

  it('uses kickers, and ignores the sixth and seventh cards', () => {
    expect(evaluate(h('Ac Ad Kh 9s 7d 3c 2d'))).toBeGreaterThan(evaluate(h('Ac Ad Qh Js Td 3c 2d')));
    // Q-Q-9-9-A for all three: the board plays (pagat's example).
    const board = h('Ah Qd Qs 9c 6d');
    const a = evaluate([...board, 'Kh', '9h']);
    const b = evaluate([...board, '9d', '6h']);
    const c = evaluate([...board, '9s', '3c']);
    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  it('two pair takes the best two and the best kicker, even from a third pair', () => {
    expect(handNameParts(evaluate(h('Kc Kd 7h 7s 3d 3c Ad'))).ranks).toEqual(['K', '7']);
    expect(evaluate(h('Kc Kd 7h 7s 3d 3c Ad'))).toBeGreaterThan(evaluate(h('Kc Kd 7h 7s 3d 3c Qd')));
  });

  it('agrees with pokersolver on 20,000 random showdowns', () => {
    const rng = createRng('pokersolver');
    for (let i = 0; i < 20000; i++) {
      const cards = rng.shuffle(DECK).slice(0, 9);
      const board = cards.slice(0, 5);
      const a = [...board, cards[5], cards[6]] as Card[];
      const b = [...board, cards[7], cards[8]] as Card[];
      const ours = Math.sign(evaluate(a) - evaluate(b));
      const ha = Hand.solve(a);
      const hb = Hand.solve(b);
      const winners = Hand.winners([ha, hb]);
      const theirs = winners.length === 2 ? 0 : winners[0] === ha ? 1 : -1;
      if (ours !== theirs) throw new Error(`${a.join(' ')} vs ${b.join(' ')}: ours ${ours}, pokersolver ${theirs}`);
    }
  }, 120_000);
});

describe('starting hands', () => {
  it('has 169 classes, written high card first', () => {
    expect(HAND_CLASSES).toHaveLength(169);
    expect(new Set(HAND_CLASSES).size).toBe(169);
    expect(handClass('Kh', 'Ah')).toBe('AKs');
    expect(handClass('2c', '7d')).toBe('72o');
    expect(handClass('9s', '9d')).toBe('99');
  });
});
