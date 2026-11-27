// Golden cases for every rule in docs/rules/tute.md.
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import type { Card, PlayedCard, TuteAction, TuteConfig, TuteState } from '../../src/games/tute/rules';
import {
  actionText,
  beats,
  CANTE_PLAIN,
  CANTE_TRUMPS,
  checkConservation,
  DECK,
  explainCard,
  HAND_POINTS,
  LAST_TEN,
  pointsOf,
  position,
  PRESETS,
  presetOf,
  REACH,
  sidePoints,
  SPAIN_PAIRS,
  TOTAL_POINTS,
  tute,
  viewOf,
} from '../../src/games/tute/rules';

const at = (text: string): TuteState => tute.codec.state.fromText(text);
const legal = (s: TuteState): string[] => tute.legal(s, tute.turn(s) ?? 0).map(actionText).sort();
const cards = (s: TuteState): string[] => legal(s).filter((a) => !a.includes('-') && a !== 'swap');
const play = (s: TuteState, ...moves: string[]): TuteState => moves.reduce((x, m) => tute.apply(x, tute.codec.action.fromText(m)).state, s);
const trick = (...plays: [number, Card][]): PlayedCard[] => plays.map(([seat, card]) => ({ seat, card }));

/** Four hands (seats that have played to the trick hold one card fewer), bastos trumps, everything else in earlier tricks. */
function four(hands: Card[][], trickSoFar: PlayedCard[] = [], config: Partial<TuteConfig> = {}): TuteState {
  return at(position({ trump: 'b', hands, trick: trickSoFar, leader: trickSoFar[0]?.seat ?? 0, config }));
}

describe('cards and tricks', () => {
  it('orders each suit As, Tres, Rey, Caballo, Sota, then the blanks; any trump beats a plain card', () => {
    expect(beats('3o', 'Ro', 'b')).toBe(true);
    expect(beats('Ao', '3o', 'b')).toBe(true);
    expect(beats('Ro', '3o', 'b')).toBe(false);
    expect(beats('2b', 'Ao', 'b')).toBe(true);
    expect(beats('Ac', '4o', 'b')).toBe(false);
    expect(pointsOf(DECK as Card[])).toBe(TOTAL_POINTS);
  });

  it('gives the trick to the highest trump, else the highest card of the suit led', () => {
    const x = play(four([['5o', '6e'], ['Ao', '6c'], ['2b', '7e'], ['Ac', '5c']]), '5o', 'Ao', '2b', 'Ac');
    expect(x.tricks[x.tricks.length - 1]?.winner).toBe(2);
    expect(x.leader).toBe(2);
    const y = play(four([['5o', '6e'], ['Ao', '6c'], ['3o', '7e'], ['Ac', '5c']]), '5o', 'Ao', '3o', 'Ac');
    expect(y.tricks[y.tricks.length - 1]?.winner).toBe(1);
  });
});

// In these positions seat 3 led (or seats 2 and 3 played) and seat 0 is to play.
describe('obligations (four players)', () => {
  it('must follow suit: another suit is refused with the reason', () => {
    const s = four([['5o', 'Ae', '6c'], ['Co', '7e', '5c'], ['7o', '4e', '4c'], ['5e', '7c']], trick([3, 'So']));
    expect(tute.turn(s)).toBe(0);
    expect(cards(s)).toEqual(['5o']);
    expect(explainCard(s, 'Ae')).toBe('follow');
    expect(explainCard(s, '5o')).toBe(null);
  });

  it('must win the trick when it can; once trumped, any card of the suit led will do', () => {
    const s = four([['3o', '4o', '6c'], ['Ao', '7e', '5c'], ['7o', '4e', '4c'], ['5e', '7c']], trick([3, 'Ro']));
    expect(cards(s)).toEqual(['3o']);
    expect(explainCard(s, '4o')).toBe('beat');
    // Seat 2 led the Rey de oros, seat 3 was void and trumped: seat 0 need only follow suit.
    const t = four([['3o', '4o', '6c'], ['Ao', '7e', '5c'], ['4e', '4c'], ['5e', '7c']], trick([2, 'Ro'], [3, '2b']));
    expect(cards(t)).toEqual(['3o', '4o']);
  });

  it('void in the suit led must trump, and beat a trump already played; else may play anything', () => {
    const s = four([['3b', '4e', '6c'], ['Ab', '7e', '5c'], ['7o', '4b', '4c'], ['5e', '7c']], trick([3, 'Ro']));
    expect(cards(s)).toEqual(['3b']);
    expect(explainCard(s, '4e')).toBe('trump');
    const over = four([['Rb', '2b', '6c'], ['Ab', '7e', '5c'], ['4b', '4c'], ['5e', '7c']], trick([2, '7o'], [3, '5b']));
    expect(cards(over)).toEqual(['Rb']);
    expect(explainCard(over, '2b')).toBe('overtrump');
    expect(explainCard(over, '6c')).toBe('overtrump');
    const under = four([['4b', '2b', '6c'], ['Ab', '7e', '5c'], ['4e', '4c'], ['Ro', '7c']], trick([2, '7o'], [3, '5b']));
    expect(cards(under)).toEqual(['2b', '4b', '6c']);
    const must = four([['4b', '2b', '6c'], ['Ab', '7e', '5c'], ['4e', '4c'], ['Ro', '7c']], trick([2, '7o'], [3, '5b']), { underTrump: 'must' });
    expect(cards(must)).toEqual(['2b', '4b']);
  });

  it('the obligations hold when the partner is winning, unless the table plays "relaxed"', () => {
    // Seat 2 (the partner) led the Rey de oros; seat 3 followed low.
    const hands: Card[][] = [['3o', '4o', '6c'], ['Ao', '7e', '5c'], ['4e', '4c'], ['5e', '7c']];
    const plays = trick([2, 'Ro'], [3, '2o']);
    expect(cards(four(hands, plays))).toEqual(['3o']);
    expect(cards(four(hands, plays, { partner: 'relaxed' }))).toEqual(['3o', '4o']);
    const voidHands: Card[][] = [['3b', '4e', '6c'], ['Ao', '7e', '5c'], ['Se', '4c'], ['5e', '7c']];
    expect(cards(four(voidHands, plays))).toEqual(['3b']);
    expect(cards(four(voidHands, plays, { partner: 'relaxed' }))).toEqual(['3b', '4e', '6c']);
  });

  it('mustBeat "no": any card of the suit led, and any trump when void', () => {
    const s = four([['3o', '4o', '6c'], ['Ao', '7e', '5c'], ['7o', '4e', '4c'], ['5e', '7c']], trick([3, 'Ro']), { mustBeat: 'no' });
    expect(cards(s)).toEqual(['3o', '4o']);
    const v = four([['Rb', '2b', '6c'], ['Ab', '7e', '5c'], ['4b', '4c'], ['5e', '7c']], trick([2, '7o'], [3, '5b']), { mustBeat: 'no' });
    expect(cards(v)).toEqual(['2b', 'Rb']);
  });
});

describe('two players and the stock', () => {
  const twoAt = (stockRules: TuteConfig['stockRules'], led: Card, me: Card[]) =>
    at(position({ players: 2, trump: 'Rb', hands: [me, ['4c', '5c', '6c', '7c', 'Sc', '2c', '3c']], trick: [{ seat: 1, card: led }], leader: 1, config: { stockRules } }));

  it('any card while the stock lasts ("free"), a trump answered with a trump ("trumps"), all duties with "full"', () => {
    expect(cards(twoAt('free', '4o', ['5o', 'Ae', '6e', '7e', '2e', '3e', '4e', 'Se']))).toHaveLength(8);
    expect(cards(twoAt('trumps', '4o', ['5o', 'Ae', '6e', '7e', '2e', '3e', '4e', 'Se']))).toHaveLength(8);
    const trumps = twoAt('trumps', '4b', ['5b', 'Ae', '6e', '7e', '2e', '3e', '4e', 'Se']);
    expect(cards(trumps)).toEqual(['5b']);
    expect(explainCard(trumps, 'Ae')).toBe('trump-led');
    expect(cards(twoAt('full', '4o', ['5o', 'Ae', '6e', '7e', '2e', '3e', '4e', 'Se']))).toEqual(['5o']);
  });

  it('all duties once the stock is empty', () => {
    const s = at(position({ players: 2, trump: 'b', hands: [['5o', 'Ae'], ['4c']], stock: [], trick: [{ seat: 1, card: '4o' }], leader: 1 }));
    expect(cards(s)).toEqual(['5o']);
  });

  it('deals eight each, turns the next card under the stock, and the winner draws first', () => {
    const s = tute.setup(PRESETS['two-habanero'] as TuteConfig, createRng('deal-2'));
    expect(s.hands.map((h) => h.length)).toEqual([8, 8]);
    expect(s.stock).toHaveLength(24);
    expect(s.stock[s.stock.length - 1]).toBe(s.turnedCard);
    expect(s.leader).toBe(0);
    const a = tute.legal(s, 0).find((x) => x.type === 'play') as TuteAction;
    const mid = tute.apply(s, a).state;
    const b = tute.legal(mid, 1).find((y) => y.type === 'play') as TuteAction;
    const r = tute.apply(mid, b);
    const draws = r.events.filter((e) => e.type === 'draw');
    expect(draws.map((e) => (e.type === 'draw' ? e.seat : -1))).toEqual([r.state.leader, 1 - r.state.leader]);
    expect(r.state.hands.map((h) => h.length)).toEqual([8, 8]);
  });
});

describe('cantes and the tute', () => {
  const plain: Card[][] = [
    ['5o', '6o', '7o', '2c', '3c'],
    ['4e', '5e', '6e', '7e', 'Se'],
    ['4c', '5c', '6c', '7c', 'Sc'],
  ];
  // Seat 0 holds `mine`; the side of `lastWinner` won the last trick, and that seat leads.
  const spot = (mine: Card[], lastWinner: number, config: Partial<TuteConfig> = {}) => at(position({ trump: 'b', hands: [mine, ...plain], leader: lastWinner, lastWinner, config }));

  it('no cante before the side has won a trick', () => {
    const fresh = tute.setup(SPAIN_PAIRS, createRng('fresh'));
    expect(tute.legal(fresh, tute.turn(fresh) ?? 0).some((a) => a.type === 'sing' || a.type === 'tute')).toBe(false);
  });

  it('20 in a plain suit, 40 in trumps; the 40 first; one cante per trick', () => {
    const both: Card[] = ['Rc', 'Cc', 'Rb', 'Cb', '4o'];
    const s = spot(both, 0);
    expect(legal(s).filter((a) => a.startsWith('sing'))).toEqual(['sing-b']);
    const after = play(s, 'sing-b');
    expect(after.cantes).toEqual([{ seat: 0, suit: 'b', points: CANTE_TRUMPS }]);
    expect(legal(after).some((a) => a.startsWith('sing'))).toBe(false);
    expect(after.known[0]).toEqual(expect.arrayContaining(['Rb', 'Cb']));
    const free = spot(both, 0, { fortyFirst: 'no' });
    expect(legal(free).filter((a) => a.startsWith('sing'))).toEqual(['sing-b', 'sing-c']);
    expect(play(free, 'sing-c').cantes[0]?.points).toBe(CANTE_PLAIN);
  });

  it('the partner may sing during the next trick ("side") but not with "winner"; the other side never', () => {
    // Seat 2 won the last trick and led; seat 3 followed; seat 0, the partner, holds the pair.
    const next = (config: Partial<TuteConfig>) =>
      at(position({ trump: 'b', hands: [['Rc', 'Cc', '4o', '5o'], ['7o', '2c', '3c', 'Co'], ['5e', '6e', '7e'], ['5c', '6c', '7c']], trick: trick([2, '4e'], [3, '4c']), leader: 2, lastWinner: 2, config }));
    const side = next({});
    expect(tute.turn(side)).toBe(0);
    expect(legal(side)).toContain('sing-c');
    expect(legal(next({ singer: 'winner' }))).not.toContain('sing-c');
    const other = at(position({ trump: 'b', hands: [['4o', '5o', '6o'], ['Rc', 'Cc', '7o', '3c'], ['5e', '6e', '7e'], ['5c', '6c', '7c']], trick: trick([2, '4e'], [3, '4c'], [0, 'Se']), leader: 2, lastWinner: 2 }));
    expect(tute.turn(other)).toBe(1);
    expect(legal(other)).not.toContain('sing-c');
  });

  it('a tute of four Reyes ends the hand and wins the game; "two" and "hand" score two games or one', () => {
    const kings: Card[] = ['Ro', 'Rc', 'Re', 'Rb', '4o'];
    const s = spot(kings, 0);
    expect(legal(s)).toContain('tute-R');
    const done = play(s, 'tute-R');
    expect(done.over).toBe(true);
    expect(done.champion).toBe(0);
    expect(tute.outcome(done)?.reason).toBe('tute-tute');
    const two = play(spot(kings, 0, { tute: 'two' }), 'tute-R');
    expect(two.over).toBe(false);
    expect(two.matchWins).toEqual([2, 0]);
    expect(play(spot(kings, 0, { tute: 'hand' }), 'tute-R').matchWins).toEqual([1, 0]);
    // Four Reyes split between partners are no tute.
    expect(legal(spot(['Ro', 'Rc', '4o', 'Ae', 'Ce'], 0))).not.toContain('tute-R');
  });
});

describe('scoring', () => {
  it('the last trick is worth ten; a hand played out holds 130 plus its cantes', () => {
    const s = at(position({ trump: 'b', hands: [['Ao'], ['2o'], ['3o'], ['4o']], leader: 0, lastWinner: 1, canteOpen: false }));
    const done = play(s, 'Ao', '2o', '3o', '4o');
    const r = done.results[0];
    expect(r?.lastTrick).toBe(0);
    expect((r?.points[0] ?? 0) + (r?.points[1] ?? 0)).toBe(HAND_POINTS);
    expect(LAST_TEN).toBe(10);
  });

  it('more points wins; a tie goes to the last trick, or is nobody’s with "draw"', () => {
    // Side 0 holds 65 points in its tricks, side 1 the other 55; seat 3 takes the last trick and its ten.
    const pile0: Card[] = ['Ao', '3o', 'Ro', 'Co', 'So', 'Ac', '3c', 'Rc', 'Cc', 'Sc', 'Ce', 'Se'];
    const hands: Card[][] = [['2o'], ['4o'], ['5o'], ['6o']];
    const pile1 = DECK.filter((c) => !pile0.includes(c) && !hands.flat().includes(c));
    expect(pointsOf(pile0)).toBe(65);
    const tie = (config: Partial<TuteConfig>) => at(position({ trump: 'b', hands, leader: 0, won: [pile0, pile1], lastWinner: 1, canteOpen: false, config: { matchTo: 1, ...config } }));
    const end = play(tie({}), '2o', '4o', '5o', '6o');
    expect(end.results[0]?.points).toEqual([65, 65]);
    expect(end.results[0]?.lastTrick).toBe(1);
    expect(end.results[0]?.winner).toBe(1);
    expect(tute.outcome(end)?.results.find((r) => r.seat === 3)?.place).toBe(1);
    const drawn = play(tie({ tie: 'draw' }), '2o', '4o', '5o', '6o');
    expect(drawn.results[0]?.winner).toBe(null);
    expect(tute.outcome(drawn)?.reason).toBe('tute-tie');
    // With the Sota de espadas moved to side 1, side 1 wins on points: 67 to 63.
    const more = play(
      at(position({ trump: 'b', hands, leader: 0, won: [[...pile0.filter((c) => c !== 'Se'), pile1[0] as Card], [...pile1.slice(1), 'Se']], lastWinner: 1, canteOpen: false, config: { matchTo: 1, tie: 'draw' } })),
      '2o',
      '4o',
      '5o',
      '6o',
    );
    expect(more.results[0]?.winner).toBe(1);
  });

  it('reach101: the hand ends as soon as a side reaches 101; a vuelta carries both totals', () => {
    const config: TuteConfig = { ...SPAIN_PAIRS, handWin: 'reach101' };
    let s = tute.setup(config, createRng('reach'));
    const rng = createRng('reach-moves');
    let sawReach = false;
    let sawVuelta = false;
    for (let i = 0; i < 6000 && !(sawReach && sawVuelta); i++) {
      const before = s;
      const r = tute.apply(s, rng.pick(tute.legal(s, tute.turn(s) ?? 0)));
      s = r.state;
      const end = r.events.find((e) => e.type === 'hand-end');
      if (end?.type === 'hand-end') {
        const res = end.result;
        if (res.end === 'reach') {
          sawReach = true;
          const w = res.winner ?? 0;
          expect((res.carried[w] ?? 0) + (res.points[w] ?? 0)).toBeGreaterThanOrEqual(REACH);
          expect(before.hands.some((h) => h.length > 1)).toBe(true);
        }
        if (res.vuelta) {
          sawVuelta = true;
          expect(s.carry).toEqual([0, 1].map((x) => (res.carried[x] ?? 0) + (res.points[x] ?? 0)));
        }
      }
      if (s.over) s = tute.setup(config, createRng(`reach-${i}`));
    }
    expect(sawReach).toBe(true);
    expect(sawVuelta).toBe(true);
  });

  it('capote: every trick taken counts two games', () => {
    const hands: Card[][] = [['Ao'], ['2o'], ['3o'], ['4o']];
    const rest = DECK.filter((c) => !hands.flat().includes(c));
    const s = at(position({ trump: 'b', hands, leader: 0, won: [rest, []], lastWinner: 0, canteOpen: false, config: { capote: 'two' } }));
    const done = play(s, 'Ao', '2o', '3o', '4o');
    expect(done.results[0]?.capote).toBe(true);
    expect(done.matchWins).toEqual([2, 0]);
  });

  it('sidePoints counts cards, cantes and the last ten', () => {
    const s = play(at(position({ trump: 'b', hands: [['Rb', 'Cb', '4o'], ['5o', '6o', '7o'], ['4e', '5e', '6e'], ['4c', '5c', '6c']], leader: 0, lastWinner: 0 })), 'sing-b');
    expect(sidePoints(s, 0)).toBe(pointsOf(s.won[0] ?? []) + CANTE_TRUMPS);
  });
});

describe('the exchange for the turned card', () => {
  // Two players; the cards not named are tricks already won, the last by `lastWinner`; five cards left above the turned card.
  const two = (turned: Card, me: Card[], config: Partial<TuteConfig> = {}, lastWinner = 0) =>
    at(position({ players: 2, trump: turned, hands: [me, ['4c', '5c', '6c', '7c', 'Sc', '2c', '3c', 'Cc']], stock: ['Ab', '3b', 'Cb', 'Sb', '6b'], leader: lastWinner, lastWinner, won: [[], []], config: { swapWhen: 'after-own-trick', ...config } }));
  // A position where only seat 1 has won tricks.
  const neverWon = (config: Partial<TuteConfig> = {}) => {
    const me: Card[] = ['7o', 'Ae', '6e', '7e', '2e', '3e', '4e', 'Se'];
    const them: Card[] = ['4c', '5c', '6c', '7c', 'Sc', '2c', '3c', 'Cc'];
    const stock: Card[] = ['Ab', '3b', 'Cb', 'Sb', '6b'];
    const rest = DECK.filter((c) => !me.includes(c) && !them.includes(c) && !stock.includes(c) && c !== 'Ro');
    return at(position({ players: 2, trump: 'Ro', hands: [me, them], stock, leader: 0, lastWinner: 1, won: [[], rest], config: { swapWhen: 'after-own-trick', ...config } }));
  };

  it('the 7 takes a turned point card and the 2 a turned 4 to 7, once you have won a trick', () => {
    expect(legal(two('Ro', ['7o', 'Ae', '6e', '7e', '2e', '3e', '4e', 'Se']))).toContain('swap');
    expect(legal(two('5o', ['2o', 'Ae', '6e', '7e', '7o', '3e', '4e', 'Se']))).toContain('swap');
    expect(legal(two('5o', ['2o', 'Ae', '6e', '7e', '7o', '3e', '4e', 'Se'], { swap: 'seven' }))).not.toContain('swap');
    expect(legal(neverWon())).not.toContain('swap');
    expect(legal(neverWon({ swapWhen: 'any-turn' }))).toContain('swap');
    const swapped = play(two('Ro', ['7o', 'Ae', '6e', '7e', '2e', '3e', '4e', 'Se']), 'swap');
    expect(swapped.hands[0]).toContain('Ro');
    expect(swapped.stock[swapped.stock.length - 1]).toBe('7o');
    expect(swapped.turned).toBe('7o');
    expect(swapped.known[0]).toContain('Ro');
  });

  it('never once the turned card has been drawn', () => {
    const s = at(position({ players: 2, trump: 'b', hands: [['7b', 'Ae'], ['Rb', '5c']], stock: [], leader: 0, lastWinner: 0 }));
    expect(legal(s)).not.toContain('swap');
  });

  it('with four players the dealer gives up the turned card and receives the 7', () => {
    const hands: Card[][] = [
      ['7b', '4o', '5o'],
      ['6o', '7o', '2c'],
      ['4e', '5e', '6e'],
      ['Rb', '4c', '5c'],
    ];
    const s = at(position({ trump: 'Rb', hands, leader: 0, lastWinner: 0, dealer: 3, config: { swap: 'seven-and-two' } }));
    expect(legal(s)).toContain('swap');
    const x = play(s, 'swap');
    expect(x.hands[0]).toContain('Rb');
    expect(x.hands[3]).toContain('7b');
    expect(x.known[3]).toContain('7b');
    expect(x.known[0]).toContain('Rb');
    checkConservation(x);
    expect(legal(at(position({ trump: 'Rb', hands, leader: 0, lastWinner: 0, dealer: 3 })))).not.toContain('swap');
  });
});

describe('dealing for four, codecs, presets', () => {
  it('deals ten each; the dealer holds the turned card; the player on the dealer’s right leads; the deal passes right', () => {
    const s = tute.setup(SPAIN_PAIRS, createRng('deal-4'));
    expect(s.hands.map((h) => h.length)).toEqual([10, 10, 10, 10]);
    expect(s.hands[s.dealer]).toContain(s.turnedCard);
    expect(s.known[s.dealer]).toEqual([s.turnedCard]);
    expect(s.leader).toBe((s.dealer + 1) % 4);
    expect(viewOf(s, 0).hand).toHaveLength(10);
    let x = s;
    const rng = createRng('to-next-hand');
    while (x.handNo === 0 && !x.over) x = tute.apply(x, rng.pick(tute.legal(x, tute.turn(x) ?? 0))).state;
    if (!x.over) expect(x.dealer).toBe((s.dealer + 1) % 4);
  });

  it('reads back every action and every preset', () => {
    for (const text of ['Ao', 'sing-c', 'tute-R', 'tute-C', 'swap']) expect(actionText(tute.codec.action.fromText(text))).toBe(text);
    expect(() => tute.codec.action.fromText('8o')).toThrow();
    for (const [id, config] of Object.entries(PRESETS)) {
      expect(presetOf(config)).toBe(id);
      expect(tute.codec.config.fromJSON(tute.codec.config.toJSON(config))).toEqual(config);
    }
  });

  it('plays on from a position with the same cards', () => {
    const s = tute.setup(SPAIN_PAIRS, createRng('play-on'));
    const x = tute.setup({ ...SPAIN_PAIRS, start: tute.codec.state.toText(s) }, createRng('other'));
    expect(x.hands).toEqual(s.hands);
  });
});

describe('more house rules (pagat, read in full 2026-11-27)', () => {
  it('singer "both": each partner may sing once for the same trick', () => {
    // Seat 0 won the last trick and leads; it holds a pair, and so does its partner, seat 2.
    const s = at(
      position({
        trump: 'b',
        hands: [['Rc', 'Cc', '4o', '5o'], ['7o', '2c', '3c', 'Co'], ['Re', 'Ce', '7e', '6e'], ['5c', '6c', '7c', '4c']],
        leader: 0,
        lastWinner: 0,
        config: { singer: 'both' },
      }),
    );
    const sung = play(s, 'sing-c');
    expect(sung.cantes).toEqual([{ seat: 0, suit: 'c', points: CANTE_PLAIN, trick: sung.tricks.length }]);
    expect(legal(sung).some((a) => a.startsWith('sing'))).toBe(false);
    // Seat 0 leads, seat 1 follows; on its turn seat 2 may still sing its 20.
    const partner = play(sung, '4o', '7o');
    expect(tute.turn(partner)).toBe(2);
    expect(legal(partner)).toContain('sing-e');
    // With "side", one cante closes the trick for both partners.
    const side = play(at(position({ trump: 'b', hands: [['Rc', 'Cc', '4o', '5o'], ['7o', '2c', '3c', 'Co'], ['Re', 'Ce', '7e', '6e'], ['5c', '6c', '7c', '4c']], leader: 0, lastWinner: 0 })), 'sing-c', '4o', '7o');
    expect(legal(side)).not.toContain('sing-e');
    // The trick number survives the codec.
    expect(tute.codec.state.fromText(tute.codec.state.toText(partner)).cantes).toEqual(partner.cantes);
  });

  it('tute "none": four Reyes are no declaration (tute americano)', () => {
    const s = at(position({ trump: 'b', hands: [['Ro', 'Rc', 'Re', 'Rb', '4o'], ['5o', '6o', '7o', '2c', '3c'], ['4e', '5e', '6e', '7e', 'Se'], ['4c', '5c', '6c', '7c', 'Sc']], leader: 0, lastWinner: 0, config: { tute: 'none' } }));
    expect(legal(s)).not.toContain('tute-R');
  });

  it('bigWin "two": a hand won with 101 or more counts two games', () => {
    // Side 0 has taken every card point but the last trick's: it wins 130 to 0.
    const hands: Card[][] = [['Ao'], ['2o'], ['3o'], ['4o']];
    const rest = DECK.filter((c) => !hands.flat().includes(c));
    const end = (config: Partial<TuteConfig>) => play(at(position({ trump: 'b', hands, leader: 0, won: [rest, []], lastWinner: 0, canteOpen: false, config })), 'Ao', '2o', '3o', '4o');
    expect(end({}).matchWins).toEqual([1, 0]);
    expect(end({ bigWin: 'two' }).matchWins).toEqual([2, 0]);
  });

  it('margin 2: at the target the match goes on until a side is two games ahead', () => {
    const hands: Card[][] = [['Ao'], ['2o'], ['3o'], ['4o']];
    const rest = DECK.filter((c) => !hands.flat().includes(c));
    const s = (config: Partial<TuteConfig>) => {
      const base = at(position({ trump: 'b', hands, leader: 0, won: [rest, []], lastWinner: 0, canteOpen: false, config: { matchTo: 3, ...config } }));
      return { ...base, matchWins: [2, 2] };
    };
    expect(play(s({}), 'Ao', '2o', '3o', '4o').over).toBe(true);
    const on = play(s({ margin: 2 }), 'Ao', '2o', '3o', '4o');
    expect(on.over).toBe(false);
    expect(on.matchWins).toEqual([3, 2]);
  });

  it('target 121 (americano) and two-player hands of six (corriente) and ten', () => {
    for (const [id, size] of [['two-corriente', 6], ['two-habanero', 8], ['two-ten', 10], ['two-americano', 8]] as const) {
      const config = PRESETS[id] as TuteConfig;
      const s = tute.setup(config, createRng(id));
      expect(s.hands.map((h) => h.length)).toEqual([size, size]);
      expect(s.stock.length).toBe(DECK.length - 2 * size);
      expect(presetOf(config)).toBe(id);
    }
    expect(PRESETS['two-americano']?.target).toBe(121);
    // A hand of six plays out: every card drawn, the last six tricks without the stock.
    const config = PRESETS['two-corriente'] as TuteConfig;
    let s = tute.setup(config, createRng('corriente-out'));
    const rng = createRng('corriente-moves');
    for (let i = 0; i < 400 && s.handNo === 0 && !s.over; i++) s = tute.apply(s, rng.pick(tute.legal(s, tute.turn(s) ?? 0))).state;
    const first = s.results[0];
    expect(first).toBeDefined();
    if (first?.end === 'played') expect((first.points[0] ?? 0) + (first.points[1] ?? 0) - (first.cantes[0] ?? 0) - (first.cantes[1] ?? 0)).toBe(HAND_POINTS);
    checkConservation(s);
  });
});
