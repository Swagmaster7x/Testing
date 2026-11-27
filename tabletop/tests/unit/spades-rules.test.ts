// Spades golden cases (docs/rules/spades.md).
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import type { Card } from '../../src/games/classic/cards';
import type { SpadesConfig, SpadesState } from '../../src/games/spades/rules';
import { actionText, gameOver, legalBids, mayBlind, PRESETS, position, scoreHand, sidePlaces, spades, STANDARD } from '../../src/games/spades/rules';

const at = (text: string): SpadesState => spades.codec.state.fromText(text);
const play = (s: SpadesState, ...moves: string[]): SpadesState => moves.reduce((x, m) => spades.apply(x, spades.codec.action.fromText(m)).state, s);
const legalText = (s: SpadesState): string[] => spades.legal(s, spades.turn(s) ?? 0).map(actionText);
const bid = (n: number, seat = 0) => [n, n, n, n].map((x, i) => (i === seat ? x : 3));

describe('spades: the deal and the bidding', () => {
  it('deals 13 each; bidding starts on the dealer’s left', () => {
    const s = spades.setup(STANDARD, createRng('deal'));
    expect(s.hands.map((h) => h.length)).toEqual([13, 13, 13, 13]);
    expect(s.phase).toBe('bid');
    expect(spades.turn(s)).toBe((s.dealer + 1) % 4);
    expect(legalText(s)).toContain('bid:0');
    expect(legalText(s)).toContain('bid:13');
  });

  it('nil can be switched off', () => {
    const s = spades.setup({ ...STANDARD, nil: 0 }, createRng('deal'));
    expect(legalText(s)).not.toContain('bid:0');
    expect(legalText(s)[0]).toBe('bid:1');
  });

  it('with a minimum team bid of four the second partner makes it up, and a nil asks four of the partner', () => {
    const config = { ...STANDARD, minBid: 4 };
    expect(legalBids({ config, bids: [null, null, null, null] }, 0)).toContain(0);
    expect(legalBids({ config, bids: [1, null, null, null] }, 2)[0]).toBe(3);
    expect(legalBids({ config, bids: [1, null, null, null] }, 2)).not.toContain(0);
    expect(legalBids({ config, bids: [0, null, null, null] }, 2)[0]).toBe(4);
    expect(legalBids({ config, bids: [5, null, null, null] }, 2)).toContain(0);
  });

  it('blind nil is offered only when allowed and behind by 100; the hand stays hidden until the choice', () => {
    const behind = { ...spades.setup({ ...STANDARD, blindNil: 'behind-100' }, createRng('blind')), scores: [100, 250] };
    const first = spades.turn(behind) as number;
    const ahead = { ...behind, scores: first % 2 === 0 ? [300, 100] : [100, 300] };
    const losing = { ...behind, scores: first % 2 === 0 ? [100, 300] : [300, 100] };
    expect(mayBlind(ahead, first)).toBe(false);
    expect(mayBlind(losing, first)).toBe(true);
    expect(legalText(losing)).toEqual(['blind', 'look']);
    expect(spades.view(losing, first).hand).toEqual([]);
    const looked = play(losing, 'look');
    expect(spades.turn(looked)).toBe(first);
    expect(spades.view(looked, first).hand.length).toBe(13);
    const blind = play(losing, 'blind');
    expect(blind.bids[first]).toBe(0);
    expect(blind.blind[first]).toBe(true);
    expect(mayBlind({ ...behind, config: { ...behind.config, blindNil: 'always' } }, first)).toBe(true);
    expect(mayBlind({ ...behind, config: { ...behind.config, blindNil: 'off' } }, first)).toBe(false);
  });
});

describe('spades: the play', () => {
  const four: Card[][] = [
    ['As', '2c', '3c'],
    ['Ks', '4c', '5c'],
    ['Qs', '6c', '7c'],
    ['Js', '8c', '9c'],
  ];

  it('the dealer’s left leads anything but a spade to the first trick', () => {
    const full = spades.setup(STANDARD, createRng('lead'));
    let s = full;
    for (let i = 0; i < 4; i++) s = play(s, 'bid:3');
    const leader = spades.turn(s) as number;
    expect(leader).toBe((s.dealer + 1) % 4);
    const hasOther = (s.hands[leader] ?? []).some((c) => c[1] !== 's');
    if (hasOther) expect(legalText(s).every((m) => m[1] !== 's')).toBe(true);
  });

  it('with the two-of-clubs rule its holder leads it', () => {
    let s = spades.setup({ ...STANDARD, firstLead: 'two-clubs' }, createRng('clubs'));
    for (let i = 0; i < 4; i++) s = play(s, 'bid:3');
    expect(s.hands[spades.turn(s) as number]).toContain('2c');
    expect(legalText(s)).toEqual(['2c']);
  });

  it('spades may not be led until broken, unless the leader holds nothing else', () => {
    const s = at(position({ hands: four, broken: false }));
    expect(legalText(s).sort()).toEqual(['2c', '3c']);
    const onlySpades = at(position({ hands: [['As', 'Ks', 'Qs'], ['2c', '3c', '4c'], ['5c', '6c', '7c'], ['8c', '9c', 'Tc']], broken: false }));
    expect(legalText(onlySpades).sort()).toEqual(['As', 'Ks', 'Qs'].sort());
    const free = at(position({ hands: four, broken: false, config: { breakSpades: 'off' } }));
    expect(legalText(free)).toContain('As');
  });

  it('follow suit; a void player may trump; the highest spade wins, else the highest of the suit led', () => {
    const s = at(position({ hands: [['Ad', '2c'], ['2s', '3c'], ['Kd', '4c'], ['Qd', '5c']], broken: false }));
    const s1 = play(s, 'Ad');
    expect(legalText(s1).sort()).toEqual(['2s', '3c'].sort());
    const done = play(s1, '2s', 'Kd', 'Qd');
    expect(done.leader).toBe(1);
    expect(done.broken).toBe(true);
    const plain = at(position({ hands: [['Ad', '2c'], ['3d', '3c'], ['Kd', '4c'], ['Qd', '5c']] }));
    expect(play(plain, 'Ad', '3d', 'Kd', 'Qd').leader).toBe(0);
  });
});

describe('spades: scoring', () => {
  const pairs = STANDARD;
  it('made: ten a trick bid and one a bag; set: minus ten a trick bid', () => {
    // Side 0 (seats 0 and 2) bids 3 + 2 and takes 4 + 3; side 1 bids 4 + 4 and takes 3 + 3.
    const r = scoreHand(pairs, [3, 4, 2, 4], [false, false, false, false], [4, 3, 3, 3], [0, 0]);
    expect(r.deltas).toEqual([52, -80]);
    expect(r.bags).toEqual([2, 0]);
  });

  it('nil: plus or minus 100; a failed nil’s tricks are bags, not the partner’s bid (or count, with the option)', () => {
    const made = scoreHand(pairs, [0, 4, 4, 4], [false, false, false, false], [0, 5, 4, 4], [0, 0]);
    expect(made.deltas[0]).toBe(100 + 40);
    const failed = scoreHand(pairs, [0, 4, 4, 4], [false, false, false, false], [2, 4, 3, 4], [0, 0]);
    // The partner bid 4 and took 3: set (-40); the nil lost (-100); the two nil tricks are bags (+2).
    expect(failed.deltas[0]).toBe(-100 - 40 + 2);
    const counted = scoreHand({ ...pairs, nilTricks: 'count' }, [0, 4, 4, 4], [false, false, false, false], [2, 4, 3, 4], [0, 0]);
    expect(counted.deltas[0]).toBe(-100 + 40 + 1);
    const half = scoreHand({ ...pairs, nil: 50 }, [0, 4, 4, 4], [false, false, false, false], [0, 5, 4, 4], [0, 0]);
    expect(half.deltas[0]).toBe(50 + 40);
  });

  it('blind nil scores double', () => {
    expect(scoreHand(pairs, [0, 4, 4, 4], [true, false, false, false], [0, 5, 4, 4], [0, 0]).deltas[0]).toBe(200 + 40);
    expect(scoreHand(pairs, [0, 4, 4, 4], [true, false, false, false], [1, 4, 4, 4], [0, 0]).deltas[0]).toBe(-200 + 40 + 1);
  });

  it('ten bags cost 100 and the count carries on (pagat’s worked example: 337, bid 5)', () => {
    // A score of 337 holds seven bags in its last digit.
    const take = (n: number) => 337 + (scoreHand(pairs, [3, 3, 2, 3], [false, false, false, false], [Math.ceil(n / 2), 3, Math.floor(n / 2), 13 - 6 - n], [7, 0]).deltas[0] ?? 0);
    expect(take(7)).toBe(389);
    expect(take(8)).toBe(290);
    expect(take(9)).toBe(291);
    const r = scoreHand(pairs, [3, 3, 2, 3], [false, false, false, false], [5, 3, 4, 1], [7, 0]);
    expect(r.bagCount[0]).toBe(1);
    expect(r.penalties[0]).toBe(1);
  });

  it('no bag penalty, or minus one a bag', () => {
    expect(scoreHand({ ...pairs, bags: 'none' }, [3, 3, 2, 3], [false, false, false, false], [6, 3, 6, 0], [9, 0]).deltas[0]).toBe(50 + 7);
    expect(scoreHand({ ...pairs, bags: 'minus' }, [3, 3, 2, 3], [false, false, false, false], [6, 3, 6, 0], [9, 0]).deltas[0]).toBe(50 - 7);
  });

  it('cutthroat scores each player alone', () => {
    const solo = PRESETS.cutthroat as SpadesConfig;
    const r = scoreHand(solo, [3, 4, 2, 0], [false, false, false, false], [4, 3, 6, 0], [0, 0, 0, 0]);
    expect(r.deltas).toEqual([31, -40, 24, 100]);
  });
});

describe('spades: the end of the game', () => {
  it('ends at the target; the higher score wins when both pass it; a tie at the top plays on', () => {
    expect(gameOver(STANDARD, [480, 300])).toBe(false);
    expect(gameOver(STANDARD, [510, 300])).toBe(true);
    expect(gameOver(STANDARD, [510, 520])).toBe(true);
    expect(gameOver(STANDARD, [510, 510])).toBe(false);
    expect(gameOver({ ...STANDARD, target: 0 }, [0, 0])).toBe(true);
  });

  it('a losing score ends the game, and that side is last', () => {
    const club = PRESETS.club as SpadesConfig;
    expect(gameOver(club, [-210, 150])).toBe(true);
    expect(sidePlaces(club, [-210, 100])).toEqual([2, 1]);
    expect(sidePlaces(club, [-210, -250])).toEqual([1, 2]);
  });

  it('partners share their side’s place in the outcome', () => {
    const s = at(position({ hands: [['Ad'], ['2d'], ['3d'], ['4d']], scores: [0, 0], config: { target: 0 }, won: [3, 3, 3, 3] }));
    const end = play(s, 'Ad', '2d', '3d', '4d');
    const outcome = spades.outcome(end);
    expect(outcome?.teams).toEqual([[0, 2], [1, 3]]);
    const place = (seat: number) => outcome?.results.find((r) => r.seat === seat)?.place;
    expect(place(0)).toBe(place(2));
    expect(place(1)).toBe(place(3));
  });
});

describe('spades: hidden information', () => {
  it('a view never holds another hand or the seed', () => {
    const s = spades.setup(STANDARD, createRng('views'));
    for (const seat of [0, 1, 2, 3]) {
      const view = spades.view(s, seat);
      expect(JSON.stringify(view)).not.toContain(s.seed);
      for (const other of [0, 1, 2, 3].filter((x) => x !== seat)) for (const c of s.hands[other] ?? []) expect(view.hand).not.toContain(c);
    }
  });

  it('a sample agrees with the view (voids included)', () => {
    let s = spades.setup(STANDARD, createRng('sample'));
    const rng = createRng('moves');
    for (let i = 0; i < 30; i++) s = spades.apply(s, rng.pick(spades.legal(s, spades.turn(s) as number))).state;
    const seat = spades.turn(s) as number;
    const view = spades.view(s, seat);
    for (let k = 0; k < 20; k++) {
      const sampled = spades.sample?.(view, seat, createRng(`k${k}`)) as SpadesState;
      expect(JSON.stringify(spades.view(sampled, seat))).toBe(JSON.stringify(view));
    }
    expect(bid(2)).toEqual([2, 3, 3, 3]);
  });
});
