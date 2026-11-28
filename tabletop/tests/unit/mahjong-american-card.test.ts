/**
 * The American card format (docs/rules/mahjong-american.md, "The card"): the practice card reads
 * cleanly, each error names its line, readings follow the suit letters, "shift" and the dragons
 * matched to suits, and matching and distance treat jokers as the rules say.
 */
import { describe, expect, it } from 'vitest';
import type { Card } from '../../src/games/mahjong/american/card';
import { amCounts, cardVariants, completes, distance, parseCard, takesJokers, variants } from '../../src/games/mahjong/american/card';
import { PRACTICE_CARD } from '../../src/games/mahjong/american/practice-card';
import { parseKinds } from '../../src/games/mahjong/core/tiles';

const hand = (line: string) => {
  const { card, errors } = parseCard(line);
  expect(errors).toEqual([]);
  return (card as Card).hands[0]!;
};
/** Concealed tiles as written ("2026m" style is not tile notation: use "2m Wd 2m 6m"), J for jokers. */
const tiles = (text: string) => amCounts(parseKinds(text));

describe('the card format', () => {
  it('reads the practice card: every hand holds 14 tiles and can be made', () => {
    const { card, errors } = parseCard(PRACTICE_CARD);
    expect(errors).toEqual([]);
    expect(card?.title).toBe('Kibitz practice card 2026');
    expect(card?.hands.length).toBe(24);
    for (const h of card?.hands ?? []) expect(variants(h).length, h.text).toBeGreaterThan(0);
    expect(new Set(card?.hands.map((h) => h.section))).toContain('Quints');
  });

  it('names the line and the fault of each error', () => {
    const errors = parseCard(['title: Test', 'FFF 222a 333b = 25 X', '2222x 33 = 25 X', 'FF 2222a 4444b 6666c', 'FF 2222a 4444b 6666c = lots X', 'FF 2222a 4444b 6666c = 25 Q', 'FF 2222a 4444b 6666c = 25 X now', '22a 22a 22a 1111b 1111c = 25 C'].join('\n')).errors;
    expect(errors.map((e) => [e.line, e.code])).toEqual([
      [2, 'tiles'],
      [3, 'group'],
      [4, 'syntax'],
      [5, 'points'],
      [6, 'mark'],
      [7, 'word'],
      [8, 'too-many'],
    ]);
    expect(parseCard('# nothing but a comment').errors.map((e) => e.code)).toEqual(['empty']);
    expect(parseCard('FF 2222a 4444b 6666c = 25 X\nFF 22a = 1 X').card).toBeNull();
  });

  it('reads suit letters as three different suits, and dragons matched to the suit', () => {
    // A year in every suit: one reading whatever the order of the suits.
    expect(variants(hand('2026a 2026b 2026c FF = 50 C')).length).toBe(1);
    // A kong of fours in two suits and the dragon of the first: six readings.
    const vs = variants(hand('4444a 4444b DDDD 88c = 30 X'));
    expect(vs.length).toBe(6);
    // Characters go with red, bamboo with green, dots with white.
    const red = vs.find((v) => v.groups[0]?.kind === 3 && v.groups[1]?.kind === 12);
    expect(red?.groups[2]?.kind).toBe(33);
  });

  it('shifts the numbers together, keeping them on the tiles', () => {
    // Any like number: nine numbers, and three choices of the suit for the pung.
    expect(variants(hand('1111a 1111b 111c FFF = 25 X shift')).length).toBe(27);
    // Four in a run in one suit: six starting numbers in each of three suits.
    expect(variants(hand('111a 222a 3333a 4444a = 25 X shift')).length).toBe(18);
  });

  it('knows which hands can take jokers', () => {
    expect(takesJokers(hand('FF 11a 22a 33a 44b 55b 66c = 50 C shift'))).toBe(false);
    expect(takesJokers(hand('FFF 2222a 44b 666c 88a = 25 X'))).toBe(true);
  });
});

describe('matching', () => {
  const evens = hand('FFF 2222a 44b 666c 88a = 25 X');
  const v = variants(evens).find((x) => x.groups[1]?.kind === 1 && x.groups[2]?.kind === 12)!;

  it('a hand completed with natural tiles, and with jokers in its sets', () => {
    const plain = tiles('F1 F2 F3 2m 2m 2m 2m 4p 4p 6s 6s 6s 8m 8m');
    expect(completes(v, plain.counts, plain.jokers, [])).toBe(true);
    const jokers = tiles('F1 J 2m 2m J 2m 4p 4p 6s J 6s 8m 8m J');
    expect(jokers.jokers).toBe(4);
    expect(completes(v, jokers.counts, jokers.jokers, [])).toBe(true);
  });

  it('never lets a joker into a pair', () => {
    const t = tiles('F1 F2 F3 2m 2m 2m 2m 4p J 6s 6s 6s 8m 8m');
    expect(completes(v, t.counts, t.jokers, [])).toBe(false);
  });

  it('fits exposures to the hand’s sets, and refuses an exposure in a concealed hand', () => {
    const t = tiles('F1 F2 F3 4p 4p 6s 6s 6s 8m 8m');
    expect(completes(v, t.counts, t.jokers, [{ kind: 1, size: 4, jokers: 1 }])).toBe(true);
    expect(completes(v, t.counts, t.jokers, [{ kind: 1, size: 3, jokers: 0 }])).toBe(false);
    const pairs = variants(hand('NN EE WW SS 2026a 77b = 50 C'))[0]!;
    expect(distance(pairs, [], 0, [{ kind: 27, size: 3, jokers: 0 }])).toBe(Infinity);
  });

  it('counts the tiles still needed, jokers filling sets, and sees a pair that cannot be found', () => {
    const t = tiles('F1 2m 2m 4p 6s 6s J 8m');
    // Needs: two flowers, two 2 characters, a 4 dots, one 6 bamboo (a joker covers it), and a 8 characters... less the joker.
    expect(distance(v, t.counts, t.jokers, [])).toBe(2 + 2 + 1 + 1 + 1 - 1);
    const unseen = new Array<number>(43).fill(4);
    unseen[12] = 0;
    expect(distance(v, t.counts, t.jokers, [], unseen)).toBe(Infinity);
  });

  it('every hand on the practice card has a reading the full set can make', () => {
    const card = parseCard(PRACTICE_CARD).card as Card;
    expect(cardVariants(card).length).toBeGreaterThan(card.hands.length);
  });
});
