// Gin Rummy golden cases (docs/rules/gin-rummy.md), and the shared melds module.
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import type { Card } from '../../src/games/classic/cards';
import { arrangements, bestArrangement, cardValue, deadwood, defenderBest, isMeld, layOff } from '../../src/games/classic/melds';
import type { GinConfig, GinState } from '../../src/games/gin-rummy/rules';
import { actionText, finalTotals, ginRummy, knockLimit, position, PRESETS, scoreKnock, STANDARD } from '../../src/games/gin-rummy/rules';

const at = (text: string): GinState => ginRummy.codec.state.fromText(text);
const play = (s: GinState, ...moves: string[]): GinState => moves.reduce((x, m) => ginRummy.apply(x, ginRummy.codec.action.fromText(m)).state, s);
const legalText = (s: GinState): string[] => ginRummy.legal(s, ginRummy.turn(s) ?? 0).map(actionText);

describe('melds and deadwood', () => {
  it('values: ace 1, numbers their face, pictures 10', () => {
    expect(['Ac', '7d', 'Th', 'Js', 'Qc', 'Kd'].map((c) => cardValue(c as Card))).toEqual([1, 7, 10, 10, 10, 10]);
  });

  it('sets of three and four, runs of three or more, ace low only', () => {
    expect(isMeld(['7c', '7d', '7h'])).toBe(true);
    expect(isMeld(['7c', '7d', '7h', '7s'])).toBe(true);
    expect(isMeld(['4h', '5h', '6h', '7h'])).toBe(true);
    expect(isMeld(['Ah', '2h', '3h'])).toBe(true);
    expect(isMeld(['Qh', 'Kh', 'Ah'])).toBe(false);
    expect(isMeld(['4h', '5h', '6d'])).toBe(false);
    expect(isMeld(['7c', '7d'])).toBe(false);
  });

  it('finds the arrangement with the least deadwood; a card is in one meld at a time', () => {
    // 7♥ could join the sevens or the heart run: the run 6-7-8♥ plus 7♣ 7♦ left over, or the set and 6♥ 8♥ left.
    const hand: Card[] = ['7c', '7d', '7h', '6h', '8h', 'Kc', 'Kd', 'Ks', '2s', '3c'];
    const best = bestArrangement(hand);
    expect(best.count).toBe(deadwood(hand));
    expect(best.count).toBe(Math.min(...arrangements(hand).map((a) => a.count)));
    // Kings set (30) and either the sevens (21) leaving 6♥ 8♥ 2♠ 3♣ = 19, or the run (21) leaving 7♣ 7♦ 2♠ 3♣ = 19.
    expect(best.count).toBe(19);
    expect(deadwood(['Ac', '2c', '3c', '4c', '5d', '5h', '5s', 'Kh', 'Qh', 'Jh'])).toBe(0);
  });

  it('lays off a fourth card on a set and cards at either end of a run, a chain of two included', () => {
    const melds: Card[][] = [['4s', '5s', '6s'], ['9c', '9d', '9h']];
    const off = layOff(melds, ['3s', '7s', '8s', '9s', 'Kd']);
    expect(off.laid.map((x) => x.card).sort()).toEqual(['3s', '7s', '8s', '9s'].sort());
    expect(off.rest).toEqual(['Kd']);
  });

  it('the defender may break a meld when laying its cards off leaves less deadwood', () => {
    const knocker: Card[][] = [['4s', '5s', '6s']];
    // Four sevens as a set leave 8♠ A♣ 2♣ (11); three sevens as a set, with 7♠ and then 8♠ laid off on the run, leave 3.
    const hand: Card[] = ['7s', '7h', '7d', '7c', '8s', 'Kc', 'Kd', 'Kh', 'Ac', '2c'];
    const show = defenderBest(hand, knocker, true);
    expect(show.count).toBe(3);
    expect(show.laid.map((x) => x.card).sort()).toEqual(['7s', '8s']);
    expect(defenderBest(hand, knocker, false).count).toBe(11);
  });
});

describe('gin rummy: the first turn', () => {
  it('the non-dealer may take the up-card or pass; then the dealer; if both pass the non-dealer draws from the stock', () => {
    const s = ginRummy.setup(STANDARD, createRng('offer'));
    expect(s.hands.map((h) => h.length)).toEqual([10, 10]);
    expect(s.discard.length).toBe(1);
    expect(s.phase).toBe('offer');
    expect(ginRummy.turn(s)).toBe(0);
    const taken = play(s, 'take');
    expect(taken.hands[0]?.length).toBe(11);
    expect(legalText(taken)).not.toContain(s.upcard);
    const passed = play(s, 'pass');
    expect(ginRummy.turn(passed)).toBe(1);
    const both = play(passed, 'pass');
    expect(ginRummy.turn(both)).toBe(0);
    expect(legalText(both)).toEqual(['stock']);
  });

  it('with eleven cards the non-dealer starts by discarding', () => {
    const s = ginRummy.setup({ ...STANDARD, firstTurn: 'eleven' }, createRng('eleven'));
    expect(s.hands[0]?.length).toBe(11);
    expect(s.discard).toEqual([]);
    expect(s.phase).toBe('discard');
  });
});

describe('gin rummy: a turn', () => {
  it('draw from the stock or the pile, then discard; the card just taken from the pile may not be thrown back', () => {
    const s = at(position({ me: ['Ac', '2c', '3c', '5d', '6d', '7d', 'Kh', 'Qh', '9s', '4h'], them: ['2h', '3h', '5h', '6h', '8c', '9c', 'Tc', 'Jd', 'Qd', 'Kd'], discard: ['4c'] }));
    expect(legalText(s).sort()).toEqual(['discard', 'stock']);
    const took = play(s, 'discard');
    expect(took.hands[0]).toContain('4c');
    expect(legalText(took)).not.toContain('4c');
    expect(took.known[0]).toContain('4c');
    const thrown = play(took, 'Kh');
    expect(thrown.discard[thrown.discard.length - 1]).toBe('Kh');
    expect(ginRummy.turn(thrown)).toBe(1);
  });

  it('knocks only with ten or less after the discard; Oklahoma takes the limit from the first card', () => {
    // After drawing 4♣: melds A-2-3-4♣, 5-6-7♦; deadwood K♥ Q♥ 9♠ 4♥ before the discard.
    const s = play(at(position({ me: ['Ac', '2c', '3c', '5d', '6d', '7d', 'Kh', 'Qh', '9s', '4h'], them: ['2h', '3h', '5h', '6h', '8c', '9c', 'Tc', 'Jd', 'Qd', 'Kd'], discard: ['4c'] })), 'discard');
    const knocks = legalText(s).filter((m) => m.startsWith('knock:'));
    // Discarding K♥ leaves Q♥ 9♠ 4♥ = 23: no knock; nothing here gets to ten.
    expect(knocks).toEqual([]);
    const near = play(at(position({ me: ['Ac', '2c', '3c', '5d', '6d', '7d', 'Kh', 'Qh', '2s', '4h'], them: ['2h', '3h', '5h', '6h', '8c', '9c', 'Tc', 'Jd', 'Qd', 'Kd'], discard: ['Ks'] })), 'discard');
    // Holding K♥ K♠ Q♥ 2♠ 4♥: throw Q♥ and the kings are not a set... deadwood after Q♥ is K♥ K♠ 2♠ 4♥ = 26.
    expect(legalText(near).filter((m) => m.startsWith('knock:'))).toEqual([]);
    const ready = play(at(position({ me: ['Ac', '2c', '3c', '5d', '6d', '7d', 'Kh', 'Ks', '2s', '4h'], them: ['2h', '3h', '5h', '6h', '8c', '9c', 'Tc', 'Jd', 'Qd', 'Qs'], discard: ['Kd'] })), 'discard');
    // Kings make a set: deadwood 2♠ 4♥ = 6 before the discard; throwing either leaves 4 or 2.
    expect(legalText(ready)).toEqual(expect.arrayContaining(['knock:2s', 'knock:4h']));
    expect(knockLimit({ knock: 'ten' }, '3h')).toBe(10);
    expect(knockLimit({ knock: 'oklahoma' }, '3h')).toBe(3);
    expect(knockLimit({ knock: 'oklahoma' }, 'Qh')).toBe(10);
    expect(knockLimit({ knock: 'oklahoma' }, 'Ah')).toBe(1);
    expect(knockLimit({ knock: 'oklahoma-ace-gin' }, 'Ah')).toBe(0);
  });

  it('big gin: all eleven cards in melds, laid down without a discard', () => {
    const s = play(at(position({ me: ['Ac', '2c', '3c', '4c', '5d', '6d', '7d', 'Kh', 'Ks', 'Kd'], them: ['2h', '3h', '5h', '6h', '8c', '9c', 'Tc', 'Jd', 'Qd', 'Qs'], discard: ['8d'] })), 'discard');
    expect(legalText(s)).toContain('big-gin');
    const end = play(s, 'big-gin');
    const r = end.results[0];
    expect(r?.kind).toBe('big-gin');
    expect(r?.points).toBe(31 + (r?.defenderCount ?? 0));
    const noBig = play(at(position({ me: ['Ac', '2c', '3c', '4c', '5d', '6d', '7d', 'Kh', 'Ks', 'Kd'], them: ['2h', '3h', '5h', '6h', '8c', '9c', 'Tc', 'Jd', 'Qd', 'Qs'], discard: ['8d'], config: { bigGin: 0 } })), 'discard');
    expect(legalText(noBig)).not.toContain('big-gin');
  });

  it('the hand is dead when two cards are left in the stock and the player discards without knocking', () => {
    const s = at(position({ me: ['Ac', '2c', '3c', '5d', '6d', '7d', 'Kh', 'Qh', '9s', '4h'], them: ['2h', '3h', '5h', '6h', '8c', '9c', 'Tc', 'Jd', 'Qd', 'Kd'], discard: ['4c'], config: { target: 100 } }));
    const short = { ...s, discard: [...s.discard, ...s.stock.slice(3)], stock: s.stock.slice(0, 3) };
    const drew = play(short, 'stock');
    const end = play(drew, legalText(drew).find((m) => !m.startsWith('knock:')) as string);
    expect(end.results[0]?.kind).toBe('dead');
    expect(end.handNo).toBe(1);
    expect(end.dealer).toBe(s.dealer);
    expect(end.scores).toEqual([0, 0]);
  });
});

describe('gin rummy: scoring', () => {
  const knocker: Card[] = ['Ac', '2c', '3c', '5d', '6d', '7d', 'Kh', 'Ks', 'Kd', '4h'];
  it('the knocker scores the difference', () => {
    const r = scoreKnock(STANDARD, null, 0, knocker, ['2h', '3h', '5h', '6h', '8c', '9c', 'Tc', 'Jd', 'Qd', 'Qs'], false);
    expect(r.kind).toBe('knock');
    expect(r.knockerCount).toBe(4);
    expect(r.points).toBe(r.defenderCount - 4);
    expect(r.winner).toBe(0);
  });

  it('an undercut (equal counts too) gives the defender the difference and the bonus', () => {
    // The defender lays off 4♣ and 8♦ and keeps 2♠ 2♥ = 4: equal counts, an undercut.
    const r = scoreKnock(STANDARD, null, 0, knocker, ['4c', '8d', '2s', '2h', '9h', 'Th', 'Jh', '9c', '9d', '9s'], false);
    expect(r.defenderCount).toBe(4);
    expect(r.kind).toBe('undercut');
    expect(r.winner).toBe(1);
    expect(r.points).toBe(25);
    expect(scoreKnock(PRESETS.classic as GinConfig, null, 0, knocker, ['4c', '8d', '2s', '2h', '9h', 'Th', 'Jh', '9c', '9d', '9s'], false).points).toBe(10);
  });

  it('gin scores the bonus and the whole count, with no laying off', () => {
    const gin: Card[] = ['Ac', '2c', '3c', '5d', '6d', '7d', 'Kh', 'Ks', 'Kd', '4c'];
    const r = scoreKnock(STANDARD, null, 0, gin, ['8d', '2s', '2h', '9h', 'Th', 'Jh', '9c', '9d', '9s', '5c'], false);
    expect(r.kind).toBe('gin');
    expect(r.laid).toEqual([]);
    // 8♦ and 5♣ would fit the runs, but nothing is laid off on gin: 8 + 2 + 2 + 5 = 17.
    expect(r.points).toBe(25 + 17);
  });

  it('Oklahoma doubles a hand when the first card was a spade', () => {
    const r = scoreKnock(PRESETS.oklahoma as GinConfig, '9s', 0, knocker, ['2h', '3h', '5h', '6h', '8c', '9c', 'Tc', 'Jd', 'Qd', 'Qs'], false);
    expect(r.doubled).toBe(true);
    expect(r.points).toBe(2 * (r.defenderCount - 4));
  });

  it('the game: line bonuses, the game bonus, and the shutout rules', () => {
    expect(finalTotals(STANDARD, [105, 40], [3, 2], 0)).toEqual([105 + 75 + 100, 40 + 50]);
    expect(finalTotals(STANDARD, [105, 0], [3, 0], 0)).toEqual([105 + 75 + 200, 0]);
    expect(finalTotals({ ...STANDARD, shutout: 'double-all' }, [105, 0], [3, 0], 0)).toEqual([210 + 75 + 100, 0]);
    expect(finalTotals({ ...STANDARD, shutout: 'none' }, [105, 0], [3, 0], 0)).toEqual([105 + 75 + 100, 0]);
  });

  it('the winner of a hand deals the next by default; the loser or by turns as options', () => {
    const base = position({ me: knocker.slice(0, 9).concat('4c'), them: ['2h', '3h', '5h', '6h', '8c', '9c', 'Tc', 'Jd', 'Qd', 'Qs'], discard: ['Jc'], config: { target: 100 } });
    const finish = (config: Partial<GinConfig>) => {
      const s = { ...at(base), config: { ...at(base).config, ...config } };
      const drew = play(s, 'stock');
      const knock = legalText(drew).find((m) => m.startsWith('knock:')) as string;
      return play(drew, knock);
    };
    expect(finish({}).dealer).toBe(0);
    expect(finish({ nextDealer: 'loser' }).dealer).toBe(1);
    expect(finish({ nextDealer: 'alternate' }).dealer).toBe(0);
  });
});

describe('gin rummy: hidden information', () => {
  it('a view shows your hand, the pile and the cards the other player took from it; never their hand or the stock', () => {
    const s = play(ginRummy.setup(STANDARD, createRng('views')), 'take');
    const view = ginRummy.view(s, 1);
    expect(view.known[0]).toEqual([s.upcard]);
    const text = JSON.stringify(view);
    for (const c of s.hands[0] ?? []) if (c !== s.upcard) expect(view.hand).not.toContain(c);
    expect(text).not.toContain('"stock"');
    expect(text).not.toContain(s.seed);
  });
});
