// Blackjack golden cases (docs/rules/blackjack.md), and the basic-strategy chart computed by expected value.
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import type { Card } from '../../src/games/classic/cards';
import type { BlackjackConfig, BlackjackState } from '../../src/games/blackjack/rules';
import { actionText, BANKROLL, betChoices, blackjack, position, PRESETS, STANDARD } from '../../src/games/blackjack/rules';
import { basicMove, handTotal, hiLo, insuranceValue, strategyChart, UPCARDS } from '../../src/games/blackjack/strategy';

const play = (s: BlackjackState, ...moves: string[]): BlackjackState => moves.reduce((x, m) => blackjack.apply(x, blackjack.codec.action.fromText(m)).state, s);
const legalText = (s: BlackjackState): string[] => blackjack.legal(s, blackjack.turn(s) ?? 0).map(actionText);

/** A table whose shoe starts with these cards (deal order: box, dealer up, box, dealer hole). */
function stacked(config: Partial<BlackjackConfig>, cards: Card[]): BlackjackState {
  const s = blackjack.setup({ ...STANDARD, ...config }, createRng('stacked'));
  const rest = [...s.shoe];
  for (const c of cards) rest.splice(rest.indexOf(c), 1);
  return { ...s, shoe: [...cards, ...rest] };
}

describe('blackjack: totals', () => {
  it('counts aces as 11 while that stays at 21 or less; soft and hard', () => {
    expect(handTotal(['As', '6d'])).toEqual({ total: 17, soft: true });
    expect(handTotal(['As', '6d', '9c'])).toEqual({ total: 16, soft: false });
    expect(handTotal(['As', 'Ad'])).toEqual({ total: 12, soft: true });
    expect(handTotal(['Kh', 'Qd', '2c'])).toEqual({ total: 22, soft: false });
  });
});

describe('blackjack: bets', () => {
  it('bets go in steps of ten between the limits, never above the chips', () => {
    expect(betChoices(STANDARD, BANKROLL).slice(0, 3)).toEqual([10, 20, 30]);
    expect(betChoices(STANDARD, BANKROLL).at(-1)).toBe(500);
    expect(betChoices(STANDARD, 35).at(-1)).toBe(30);
    expect(betChoices({ ...STANDARD, limits: '50-2500' }, BANKROLL)[0]).toBe(50);
  });

  it('a box that cannot cover the minimum sits out; the session ends when everyone is out', () => {
    let s = stacked({ rounds: 10 }, ['Th', '9d', 'Tc', '8c', 'Ts']);
    s = { ...s, boxes: [{ ...s.boxes[0]!, chips: 20 }] };
    s = play(s, 'bet:20', 'hit');
    // 10 + 10 + 10: bust, and with no chips left the box is out.
    expect(s.phase).toBe('done');
    expect(blackjack.outcome(s)?.results[0]?.score).toBe(20 - 20 - BANKROLL);
  });
});

describe('blackjack: insurance and the peek', () => {
  it('insurance is offered against an ace and pays 2 to 1 when the dealer has blackjack', () => {
    const s = play(stacked({}, ['9h', 'Ad', '9c', 'Kc']), 'bet:20');
    expect(s.phase).toBe('insurance');
    expect(legalText(s)).toEqual(['insure', 'no-insurance']);
    const end = play(s, 'insure');
    // The 20 bet is lost, the 10 of insurance wins 20: even.
    expect(end.history[0]).toEqual([0]);
    expect(end.last?.dealer).toEqual(['Ad', 'Kc']);
  });

  it('no insurance against a ten; a dealer blackjack ends the round and a player blackjack pushes', () => {
    const lose = play(stacked({}, ['9h', 'Kd', '9c', 'Ac']), 'bet:20');
    expect(lose.history[0]).toEqual([-20]);
    const push = play(stacked({}, ['Ah', 'Kd', 'Qc', 'Ac']), 'bet:20');
    expect(push.history[0]).toEqual([0]);
  });

  it('a player blackjack is paid 3 to 2, or 6 to 5', () => {
    expect(play(stacked({}, ['Ah', '9d', 'Qc', '8c']), 'bet:20').history[0]).toEqual([30]);
    expect(play(stacked({ payout: '6:5' }, ['Ah', '9d', 'Qc', '8c']), 'bet:20').history[0]).toEqual([24]);
  });

  it('insurance lost when the dealer has no blackjack', () => {
    const s = play(stacked({}, ['Th', 'Ad', '9c', '7c']), 'bet:20', 'insure');
    expect(s.phase).toBe('play');
    const end = play(s, 'stand');
    // 19 against the dealer's soft 18: the bet wins 20, the insurance loses 10.
    expect(end.history[0]).toEqual([10]);
  });
});

describe('blackjack: the player’s moves', () => {
  it('doubling: the first two cards only, one card, the bet doubled; restricted totals as options', () => {
    const s = play(stacked({}, ['6h', '9d', '5c', '8c', 'Tc']), 'bet:20');
    expect(legalText(s)).toContain('double');
    const end = play(s, 'double');
    // 21 against the dealer's 17: +40.
    expect(end.history[0]).toEqual([40]);
    const restricted = play(stacked({ double: '10-11' }, ['6h', '9d', '3c', '8c']), 'bet:20');
    expect(legalText(restricted)).not.toContain('double');
  });

  it('splitting: ten-value pairs, the hand limit, no double after a split unless allowed', () => {
    const s = play(stacked({ splitTo: 2, das: 'no' }, ['Kh', '9d', 'Qc', '8c', '8h', '3d']), 'bet:20');
    expect(legalText(s)).toContain('split');
    const split = play(s, 'split');
    expect(split.boxes[0]?.hands.length).toBe(2);
    expect(split.boxes[0]?.hands.map((h) => h.cards)).toEqual([['Kh', '8h'], ['Qc', '3d']]);
    expect(legalText(split)).not.toContain('double');
    expect(legalText(split)).not.toContain('split');
    const das = play(stacked({ das: 'yes' }, ['5h', '9d', '5c', '8c', '6h', '6d']), 'bet:20', 'split');
    expect(legalText(das)).toContain('double');
  });

  it('split aces take one card each and stand; 21 after a split is not blackjack', () => {
    const s = play(stacked({}, ['Ah', '9d', 'Ac', '8c', 'Kh', '7d']), 'bet:20', 'split');
    // Both hands stood at once, so the dealer played: A-K (21, even money) and A-7 (18) against 17.
    expect(s.last?.boxes[0]?.hands.map((h) => h.outcome)).toEqual(['win', 'win']);
    expect(s.history[0]).toEqual([40]);
  });

  it('aces may be resplit and hit with the options', () => {
    const s = play(stacked({ resplitAces: 'yes', hitSplitAces: 'yes' }, ['Ah', '9d', 'Ac', '8c', 'As', '5d']), 'bet:20', 'split');
    expect(legalText(s)).toContain('split');
    expect(legalText(s)).toContain('hit');
  });

  it('late surrender: the first decision only, never after a split, half the bet back', () => {
    const s = play(stacked({}, ['Th', 'Td', '6c', '8c']), 'bet:20');
    expect(legalText(s)).toContain('surrender');
    expect(play(s, 'surrender').history[0]).toEqual([-10]);
    expect(legalText(play(s, 'hit'))).not.toContain('surrender');
    const none = play(stacked({ surrender: 'none' }, ['Th', 'Td', '6c', '8c']), 'bet:20');
    expect(legalText(none)).not.toContain('surrender');
  });
});

describe('blackjack: the dealer', () => {
  it('stands on soft 17 by default, hits it with the option', () => {
    const stands = play(stacked({}, ['Th', 'Ad', '8c', '6c', '3h']), 'bet:20', 'no-insurance', 'stand');
    expect(stands.last?.dealer).toEqual(['Ad', '6c']);
    const hits = play(stacked({ soft17: 'hit' }, ['Th', 'Ad', '8c', '6c', '3h']), 'bet:20', 'no-insurance', 'stand');
    expect(hits.last?.dealer).toEqual(['Ad', '6c', '3h']);
  });

  it('does not draw when every hand is already settled', () => {
    const s = play(stacked({}, ['Th', '5d', 'Tc', '6c', 'Kh']), 'bet:20', 'hit');
    expect(s.last?.dealer).toEqual(['5d', '6c']);
  });

  it('no hole card: a dealer blackjack takes doubles and splits too, or only the original bet', () => {
    const cards: Card[] = ['5h', 'Ad', '6c', '9s', 'Kd'];
    const all = play(stacked({ holeCard: 'enhc', insurance: 'none' }, cards), 'bet:20', 'double');
    expect(all.history[0]).toEqual([-40]);
    const obo = play(stacked({ holeCard: 'enhc-obo', insurance: 'none' }, cards), 'bet:20', 'double');
    expect(obo.history[0]).toEqual([-20]);
  });

  it('five-card Charlie wins whatever the dealer holds', () => {
    const s = play(stacked({ charlie: 'five' }, ['2h', 'Td', '3c', '9c', '2d', '3s', '4h']), 'bet:20', 'hit', 'hit', 'hit');
    expect(s.last?.boxes[0]?.hands[0]?.outcome).toBe('charlie');
    expect(s.history[0]).toEqual([20]);
  });
});

describe('blackjack: basic strategy computed by expected value', () => {
  const show = (cells: readonly string[]) => cells.map((c) => c.padEnd(2)).join(' ');
  it('matches the published six-deck chart (dealer stands on soft 17, double after split, late surrender)', () => {
    const chart = strategyChart(STANDARD);
    const row = (kind: 'hard' | 'soft' | 'pairs', value: number) => show((chart[kind].find((r) => r.value === value) as { cells: readonly string[] }).cells);
    // Up-cards 2 3 4 5 6 7 8 9 T A.
    expect(row('hard', 9)).toBe(show(['H', 'Dh', 'Dh', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H']));
    expect(row('hard', 11)).toBe(show(['Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'H']));
    expect(row('hard', 12)).toBe(show(['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H']));
    expect(row('hard', 16)).toBe(show(['S', 'S', 'S', 'S', 'S', 'H', 'H', 'Rh', 'Rh', 'Rh']));
    expect(row('soft', 18)).toBe(show(['S', 'Ds', 'Ds', 'Ds', 'Ds', 'S', 'S', 'H', 'H', 'H']));
    expect(row('pairs', 9)).toBe(show(['P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S']));
    expect(row('pairs', 8)).toBe(show(['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']));
    expect(row('pairs', 2)).toBe(show(['Ph', 'Ph', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H']));
    expect(UPCARDS).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 1]);
  });

  it('moves the known cells when the rules change', () => {
    const h17 = strategyChart({ ...STANDARD, soft17: 'hit' });
    const at = (chart: typeof h17, kind: 'hard' | 'soft' | 'pairs', value: number, up: number) => chart[kind].find((r) => r.value === value)?.cells[UPCARDS.indexOf(up)];
    expect(at(h17, 'hard', 11, 1)).toBe('Dh');
    expect(at(h17, 'soft', 19, 6)).toBe('Ds');
    expect(at(h17, 'hard', 17, 1)).toBe('Rs');
    const eu = strategyChart(PRESETS.european as BlackjackConfig);
    expect(at(eu, 'hard', 11, 10)).toBe('H');
    expect(at(eu, 'pairs', 8, 10)).toBe('H');
  });

  it('follows the chart with its fallbacks', () => {
    const chart = strategyChart(STANDARD);
    const all = { double: true, split: true, surrender: true, hit: true };
    expect(basicMove(chart, ['Th', '6d'], 'Td', all, true)).toBe('surrender');
    expect(basicMove(chart, ['Th', '6d'], 'Td', { ...all, surrender: false }, true)).toBe('hit');
    expect(basicMove(chart, ['6h', '5d'], '6c', all, true)).toBe('double');
    expect(basicMove(chart, ['4h', '2d', '5c'], '6c', { ...all, double: false }, true)).toBe('hit');
    expect(basicMove(chart, ['8h', '8d'], 'Ac', all, true)).toBe('split');
    expect(basicMove(chart, ['2h', '2d'], '2c', all, false)).toBe('hit');
  });

  it('insurance loses without counting; Hi-Lo counts low cards up and high cards down', () => {
    expect(insuranceValue(['Ad', '9h', '7c'], 6)).toBeLessThan(0);
    expect(['2h', '6d', '7c', '9s', 'Th', 'Ad'].map((c) => hiLo(c as Card))).toEqual([1, 1, 0, 0, -1, -1]);
  });
});

describe('blackjack: positions and hidden information', () => {
  it('a lesson position puts the student on a hand against an up-card', () => {
    const s = blackjack.codec.state.fromText(position({ hand: ['Th', '6d'], up: 'Td' }));
    expect(legalText(s)).toEqual(['hit', 'stand', 'double', 'surrender']);
  });

  it('a view never shows the hole card or the shoe', () => {
    const s = play(stacked({}, ['9h', '7d', '9c', 'Kc']), 'bet:20');
    const view = blackjack.view(s, 0);
    expect(view.dealer).toEqual(['7d', null]);
    expect(JSON.stringify(view)).not.toContain('"shoe"');
    const sampled = blackjack.sample?.(view, 0, createRng('x')) as BlackjackState;
    expect(sampled.shoe.length).toBe(s.shoe.length);
  });
});
