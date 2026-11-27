/** Golden cases for docs/rules/dominoes-styles.md: All Fives (the spinner, counting the ends) and Cuban double nine. */
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import type { DominoesAction, DominoesConfig, DominoesState, Tile } from '../../src/games/dominoes/rules';
import {
  blockedWinner,
  CUBAN,
  dominoes,
  endsCount,
  handPips,
  handSize,
  openEnds,
  position,
  PRESETS,
  roundPips,
  setPips,
  sideOf,
  sleepingCount,
  tilesOfSet,
  viewOf,
} from '../../src/games/dominoes/rules';

const at = (p: Parameters<typeof position>[0]): DominoesState => dominoes.codec.state.fromText(position(p));
const play = (s: DominoesState, text: string): DominoesState => dominoes.apply(s, dominoes.codec.action.fromText(text, s)).state;
const legalText = (s: DominoesState) => dominoes.legal(s, s.turn).map((a) => dominoes.codec.action.toText(a));
const preset = (id: string): DominoesConfig => PRESETS[id] as DominoesConfig;
const ALL_FIVES = preset('all-fives');

describe('the double-nine set and the Cuban deal', () => {
  it('has 55 tiles and 495 pips, each number on ten tiles', () => {
    const tiles = tilesOfSet('double-nine');
    expect(tiles).toHaveLength(55);
    expect(handPips([...tiles])).toBe(495);
    expect(setPips('double-nine')).toBe(495);
    expect(setPips('double-six')).toBe(168);
    for (let x = 0; x <= 9; x++) expect(tiles.filter((t) => t.includes(String(x))).length).toBe(10);
  });

  it('deals ten to each of four; fifteen sleep and are never drawn', () => {
    const s = dominoes.setup(CUBAN, createRng('cuban-deal'));
    expect(s.hands.map((h) => h.length)).toEqual([10, 10, 10, 10]);
    expect(s.boneyard).toHaveLength(15);
    expect(handSize(CUBAN)).toBe(10);
    expect(sleepingCount(CUBAN)).toBe(15);
    expect(s.mustLead).toBeNull();
    expect(dominoes.legal(s, s.turn)).toHaveLength(10);
    let t = s;
    for (let i = 0; i < 200 && !t.over; i++) {
      const legal = legalText(t);
      expect(legal).not.toContain('draw');
      t = play(t, legal[0] as string);
    }
  });

  it('reads 7-9 only in a double-nine position', () => {
    const s = dominoes.setup(CUBAN, createRng('notation'));
    expect(dominoes.codec.action.toText(dominoes.codec.action.fromText('7-9U', s))).toBe('7-9U');
    expect(() => dominoes.codec.action.fromText('7-9')).toThrow();
    expect(dominoes.codec.action.fromJSON('8-9R')).toEqual({ type: 'play', tile: '8-9', end: 'right' });
  });

  it('deals again on five doubles, and with the "highest double" lead the highest double dealt leads', () => {
    for (let i = 0; i < 200; i++) {
      const s = dominoes.setup({ ...CUBAN, firstLead: 'double-six' }, createRng(`nine-${i}`));
      for (const hand of s.hands) expect(hand.filter((t) => t[0] === t[2]).length).toBeLessThan(5);
      const doubles = s.hands.flat().filter((t) => t[0] === t[2]);
      const top = doubles.sort((a, b) => Number(b[0]) - Number(a[0]))[0];
      expect(s.mustLead).toBe(top);
      expect(s.hands[s.turn]).toContain(top);
    }
  });
});

/** pagat's worked example of All Fives: the first nine plays and what each scores. */
const PAGAT_HANDS: Tile[][] = [
  ['1-4', '4-4', '1-2', '5-5', '1-3', '0-0', '6-6', '2-2', '3-3'],
  ['1-1', '3-4', '1-5', '0-5', '2-6', '0-6', '2-4', '4-6', '3-6'],
];
const PAGAT_PLAYS: [string, number, number][] = [
  ['1-4', 5, 5],
  ['1-1L', 6, 0],
  ['4-4R', 10, 10],
  ['3-4R', 5, 5],
  ['1-2L', 5, 5],
  ['1-5U', 10, 10],
  ['5-5U', 15, 15],
  ['0-5U', 5, 5],
  ['1-3D', 8, 0],
];

describe('All Fives: the spinner and the count of the ends', () => {
  it('scores pagat\'s worked example play by play', () => {
    let s = at({ hands: PAGAT_HANDS, config: ALL_FIVES, handNo: 0 });
    const scored: number[] = [0, 0];
    for (const [i, [move, count, points]] of PAGAT_PLAYS.entries()) {
      const seat = s.turn;
      expect(seat).toBe(i % 2);
      const result = dominoes.apply(s, dominoes.codec.action.fromText(move, s));
      const event = result.events[0];
      expect(event?.type).toBe('play');
      if (event?.type === 'play') {
        expect(event.count, move).toBe(count);
        expect(event.scored ?? 0, move).toBe(points);
      }
      s = result.state;
      scored[seat] = (scored[seat] ?? 0) + points;
      expect(endsCount(s)).toBe(count);
      expect(s.scores).toEqual(scored);
    }
    expect(s.spinner).toBe('1-1');
    expect(s.scores).toEqual([35, 20]);
  });

  it('opens the third arm only when both sides of the spinner are covered, the fourth only after the third', () => {
    let s = at({ hands: PAGAT_HANDS, config: ALL_FIVES, handNo: 0 });
    for (const move of ['1-4', '1-1L', '4-4R', '3-4R']) s = play(s, move);
    // The spinner's left side is still open: no arm yet, and the 1-5 goes only on the left.
    expect(openEnds(s).map((e) => e.end)).toEqual(['left', 'right']);
    s = play(s, '1-2L');
    expect(openEnds(s).map((e) => [e.end, e.value, e.count])).toEqual([
      ['left', 2, 2],
      ['right', 3, 3],
      ['up', 1, 0],
    ]);
    expect(legalText(s)).toContain('1-5U');
    expect(legalText(s).some((m) => m.endsWith('D'))).toBe(false);
    s = play(s, '1-5U');
    expect(openEnds(s).map((e) => e.end)).toEqual(['left', 'right', 'up', 'down']);
    expect(openEnds(s).find((e) => e.end === 'down')?.value).toBe(1);
  });

  it('makes only the first double a spinner', () => {
    let s = at({ hands: PAGAT_HANDS, config: ALL_FIVES, handNo: 0 });
    for (const move of ['1-4', '1-1L', '4-4R']) s = play(s, move);
    expect(s.spinner).toBe('1-1');
    // The 4-4 lies across its arm and counts both halves, but it takes no arms.
    expect(openEnds(s).map((e) => e.end)).toEqual(['left', 'right']);
  });

  it('counts a double at an end as both halves until it is covered, and a lone double lead once', () => {
    let s = at({ hands: PAGAT_HANDS, config: ALL_FIVES, handNo: 0, turn: 0 });
    s = play(s, '5-5');
    expect(endsCount(s)).toBe(10);
    expect(s.scores).toEqual([10, 0]);
    s = play(s, '0-5R');
    // The spinner is still an end on its left: 10 + 0.
    expect(endsCount(s)).toBe(10);
    expect(s.scores).toEqual([10, 10]);
  });

  it('rounds the pips left to the nearest five: [1-2] scores 5, [1-1] scores 0', () => {
    expect(roundPips(ALL_FIVES, 3)).toBe(5);
    expect(roundPips(ALL_FIVES, 2)).toBe(0);
    expect(roundPips(ALL_FIVES, 13)).toBe(15);
    const out = (theirs: Tile) => play(at({ hands: [['3-6'], [theirs]], line: '1-6', config: { ...ALL_FIVES, target: 0 }, handNo: 3 }), '3-6R').results[0];
    expect(out('1-2')?.points).toEqual([5, 0]);
    expect(out('1-1')?.points).toEqual([0, 0]);
    expect(out('1-1')?.reason).toBe('domino');
  });

  it('ends the match the moment a play reaches the target; "hand-end" plays the hand out', () => {
    const near = (finish: DominoesConfig['finish']) => at({ hands: [['3-6', '0-0'], ['1-1', '2-2']], line: '2-6', config: { ...ALL_FIVES, finish }, scores: [245, 100], handNo: 3 });
    const now = dominoes.apply(near('at-once'), dominoes.codec.action.fromText('3-6R'));
    expect(now.state.over).toBe(true);
    expect(now.state.results[0]?.reason).toBe('target');
    expect(now.state.scores).toEqual([250, 100]);
    expect(now.events.map((e) => e.type)).toEqual(['play', 'hand-end', 'match-end']);
    expect(dominoes.outcome(now.state)?.results.map((r) => r.place)).toEqual([1, 2]);
    const later = play(near('hand-end'), '3-6R');
    expect(later.over).toBe(false);
    expect(later.scores).toEqual([250, 100]);
  });

  it('two players: nine tiles each; three: seven; four in partnerships: five', () => {
    expect(dominoes.setup(ALL_FIVES, createRng('a')).hands.map((h) => h.length)).toEqual([9, 9]);
    expect(dominoes.setup(preset('all-fives-three'), createRng('b')).hands.map((h) => h.length)).toEqual([7, 7, 7]);
    const four = dominoes.setup(preset('all-fives-partners'), createRng('c'));
    expect(four.hands.map((h) => h.length)).toEqual([5, 5, 5, 5]);
    expect(four.boneyard).toHaveLength(8);
    expect(four.scores).toEqual([0, 0]);
    expect(dominoes.setup(preset('all-fives-three'), createRng('b')).scores).toEqual([0, 0, 0]);
  });

  it('after a hand won by going out, that player leads; after a block, a player drawn by lot', () => {
    let s = dominoes.setup(ALL_FIVES, createRng('leads'));
    const rng = createRng('lead-moves');
    for (let hands = 0; hands < 8 && !s.over; ) {
      const before = s.handNo;
      const next = dominoes.apply(s, rng.pick(dominoes.legal(s, s.turn)));
      s = next.state;
      if (s.handNo !== before && !s.over) {
        hands++;
        const r = s.results[s.results.length - 1];
        expect(s.mustLead).toBeNull();
        if (r?.reason === 'domino') expect(s.turn).toBe(r.by);
      }
    }
  });

  it('three players: two tied for the fewest pips in a blocked hand share the third\'s count', () => {
    const config: DominoesConfig = { ...preset('all-fives-three'), mode: 'block-three', target: 0 };
    const s = at({ hands: [['5-6', '0-0', '1-1'], ['0-2'], ['5-5', '4-4']], line: '6-0 0-1 1-6 6-6 6-2 2-3 3-6 6-4 4-5', config, handNo: 3 });
    const after = play(s, '5-6R');
    const r = after.results[0];
    expect(r?.reason).toBe('blocked');
    expect(r?.winner).toBeNull();
    expect(r?.split).toEqual([0, 1]);
    // 18 pips left with the third player round to 20: 10 each.
    expect(r?.points).toEqual([10, 10, 0]);
  });
});

/** A Cuban hand about to be blocked: after 7-9 on the seven, both ends show a nine and every other nine sleeps. */
const CUBAN_HANDS: Tile[][] = [
  ['7-9', '0-5', '0-6', '1-4', '2-3', '0-7', '1-5', '2-4', '3-3', '0-8'],
  ['0-0', '0-1', '0-2', '0-3', '1-1', '1-2', '0-4', '1-3', '2-2'],
  ['1-6', '1-7', '1-8', '2-5', '2-6', '2-7', '2-8', '3-4', '3-5'],
  ['8-8', '7-7', '6-8', '6-7', '5-8', '5-7', '6-6', '4-8', '5-6'],
];
const cubanBlock = (c: Partial<DominoesConfig> = {}) => at({ hands: CUBAN_HANDS, line: '7-8 8-9 9-9', leader: 1, turn: 0, config: { ...CUBAN, ...c }, handNo: 2 });

describe('Cuban double nine', () => {
  it('a blocked hand goes to the player with the fewest pips, even when that side holds more in all', () => {
    const s = play(cubanBlock(), '7-9L');
    const r = s.results[0];
    expect(r?.reason).toBe('blocked');
    expect(r?.pips).toEqual([54, 23, 73, 117]);
    // Side 0 holds 127 pips, side 1 holds 140, but the lightest hand is seat 1's.
    expect(r?.winner).toBe(1);
    expect(r?.points).toEqual([0, 127]);
    // 127 in one hand reaches 100 at once (a viajera); to 300, the winner leads the next hand with any tile.
    expect(s.over).toBe(true);
    const on = play(cubanBlock({ target: 300 }), '7-9L');
    expect(on.over).toBe(false);
    expect(on.turn).toBe(1);
    expect(on.mustLead).toBeNull();
    // Comparing sides instead, side 0 would win.
    expect(play(cubanBlock({ blockedWinner: 'side' }), '7-9L').results[0]?.winner).toBe(0);
  });

  it('scores only the opponents\' pips; the 300 variant scores every tile left after a block', () => {
    expect(play(cubanBlock(), '7-9L').results[0]?.points).toEqual([0, 127]);
    const three = play(cubanBlock({ target: 300, blockedScore: 'all' }), '7-9L').results[0];
    expect(three?.points).toEqual([0, 127 + 140]);
  });

  it('two opponents tied for the fewest pips: nobody scores; two partners tied: their side wins', () => {
    const hands: Tile[][] = [['0-1', '0-2'], ['0-3'], ['5-5'], ['6-6']];
    expect(blockedWinner(CUBAN, hands, 0, 0)).toEqual({ winner: null, byTie: true, split: [] });
    const partners: Tile[][] = [['0-3'], ['5-5'], ['1-2'], ['6-6']];
    expect(blockedWinner(CUBAN, partners, 0, 0)).toEqual({ winner: 0, byTie: false, split: [] });
  });

  it('after a tied block the side that did not lead the hand leads the next', () => {
    let found = 0;
    for (let g = 0; g < 400 && found < 3; g++) {
      let s = dominoes.setup(CUBAN, createRng(`cuban-tie-${g}`));
      const rng = createRng(`cuban-tie-moves-${g}`);
      const leader = s.leader;
      while (s.handNo === 0 && !s.over) s = dominoes.apply(s, rng.pick<DominoesAction>(dominoes.legal(s, s.turn))).state;
      const r = s.results[0];
      if (r?.reason !== 'blocked' || r.winner !== null) continue;
      found++;
      expect(r.points).toEqual([0, 0]);
      expect(sideOf(s.turn, 4)).not.toBe(sideOf(leader, 4));
    }
    expect(found).toBeGreaterThan(0);
  });

  it('hides the sleeping tiles from every seat', () => {
    const s = dominoes.setup(CUBAN, createRng('sleep'));
    for (let seat = 0; seat < 4; seat++) {
      const v = viewOf(s, seat);
      expect(v.boneyardCount).toBe(15);
      const text = JSON.stringify({ ...v, hand: [] });
      for (const t of s.boneyard) expect(text.includes(`"${t}"`)).toBe(false);
    }
  });
});
