// Golden cases for Chinese Checkers (docs/rules/chinese-checkers.md, "Golden cases").
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { HOLES, holeName, NEIGHBOUR, parseHole, POINT_HOLES_OF, WIDE_HOLES_OF } from '../../src/games/chinese-checkers/board';
import { layoutFor } from '../../src/games/chinese-checkers/engine';
import type { CcAction, CcConfig, CcState } from '../../src/games/chinese-checkers/rules';
import { boardArray, chineseCheckers as cc, configAt, legalMoves, makeConfig, parsePosition, pathOf, placesOf, positionText, PRESETS, rowsLeft, SEAT_LETTERS, startBoard } from '../../src/games/chinese-checkers/rules';

const h = (name: string): number => {
  const hole = parseHole(name);
  if (hole < 0) throw new Error(`no hole ${name}`);
  return hole;
};

/**
 * A position from the holes each seat's marbles stand on; marbles not listed go to the seat's own
 * start (in hole order) until it has its full set.
 */
function build(spec: Partial<Record<string, readonly string[]>>, side: string, extra = '', players = 2, marbles = 10): string {
  const layout = layoutFor(players, marbles);
  const board = new Array<string>(HOLES).fill('.');
  for (const [letter, names] of Object.entries(spec)) for (const name of names ?? []) {
    if (board[h(name)] !== '.') throw new Error(`${name} is used twice`);
    board[h(name)] = letter;
  }
  for (let seat = 0; seat < players; seat++) {
    const letter = SEAT_LETTERS[seat] as string;
    let have = board.filter((c) => c === letter).length;
    for (const hole of layout.startHoles[seat] as readonly number[]) {
      if (have >= marbles) break;
      if (board[hole] === '.') {
        board[hole] = letter;
        have++;
      }
    }
    if (have !== marbles) throw new Error(`${letter} has ${have} marbles`);
  }
  const s: CcState = { players, marbles, rules: makeConfig(players, marbles).rules, board: board.join(''), toMove: SEAT_LETTERS.indexOf(side.toUpperCase()), round: 1, passes: 0, done: [], end: null };
  return `${positionText(s).split(' ').slice(0, 2).join(' ')}${extra ? ` ${extra}` : ''}`;
}

const at = (text: string) => cc.codec.state.fromText(text);
const move = (from: string, to: string): CcAction => ({ type: 'move', from: h(from), to: h(to) });
const play = (s: CcState, from: string, to: string) => cc.apply(s, move(from, to));
/** Destinations of the marble on `from`, as hole names, sorted. */
function targets(s: CcState, from: string): string[] {
  return legalMoves(s)
    .filter((m) => (m & 0xff) === h(from))
    .map((m) => holeName((m >> 8) & 0xff))
    .sort();
}

describe('the board', () => {
  it('has 121 holes, each with two to six neighbours, and six points of ten', () => {
    expect(HOLES).toBe(121);
    for (let hole = 0; hole < HOLES; hole++) {
      const n = [0, 1, 2, 3, 4, 5].filter((d) => (NEIGHBOUR[hole * 6 + d] as number) >= 0).length;
      expect(n).toBeGreaterThanOrEqual(2);
      expect(n).toBeLessThanOrEqual(6);
    }
    expect(POINT_HOLES_OF.map((p) => p.length)).toEqual([10, 10, 10, 10, 10, 10]);
    expect(WIDE_HOLES_OF.map((p) => p.length)).toEqual([15, 15, 15, 15, 15, 15]);
    expect(holeName(120)).toBe('1a');
    expect(holeName(0)).toBe('17a');
  });

  it('names holes by row from the bottom and letter from the left', () => {
    expect(POINT_HOLES_OF[0]?.map(holeName).sort()).toEqual(['1a', '2a', '2b', '3a', '3b', '3c', '4a', '4b', '4c', '4d']);
    expect(POINT_HOLES_OF[3]?.map(holeName).sort()).toEqual(['14a', '14b', '14c', '14d', '15a', '15b', '15c', '16a', '16b', '17a']);
    expect(parseHole('9e')).toBe(60);
    expect(parseHole('18a')).toBe(-1);
  });
});

describe('setups', () => {
  const marblesOf = (s: CcState, letter: string) => [...s.board].filter((c) => c === letter).length;

  it('fills the right points for two, three, four and six players', () => {
    const pointsOf = (players: number) => {
      const s = cc.setup(makeConfig(players), createRng('x'));
      return SEAT_LETTERS.slice(0, players)
        .split('')
        .map((letter) => POINT_HOLES_OF.findIndex((holes) => holes.every((hole) => s.board[hole] === letter)));
    };
    expect(pointsOf(2)).toEqual([0, 3]);
    expect(pointsOf(3)).toEqual([0, 2, 4]);
    expect(pointsOf(4)).toEqual([0, 1, 3, 4]);
    expect(pointsOf(6)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('gives three players empty homes, and fifteen marbles the hexagon edge as well', () => {
    const three = cc.setup(PRESETS.three, createRng('x'));
    const layout = layoutFor(3, 10);
    for (let seat = 0; seat < 3; seat++) expect(layout.homeHoles[seat]?.every((hole) => three.board[hole] === '.')).toBe(true);
    const fifteen = cc.setup(PRESETS.fifteen, createRng('x'));
    expect(marblesOf(fifteen, 'R')).toBe(15);
    expect(['5e', '5f', '5g', '5h', '5i', '13e', '13i'].map((n) => fifteen.board[h(n)])).toEqual(['R', 'R', 'R', 'R', 'R', 'B', 'B']);
    expect(rowsLeft(fifteen)).toEqual([160, 160]);
    expect(rowsLeft(cc.setup(PRESETS.six, createRng('x')))).toEqual([120, 120, 120, 120, 120, 120]);
  });

  it('refuses fifteen marbles for more than two players', () => {
    expect(() => makeConfig(3, 15)).toThrow(/two players/);
    expect(() => cc.codec.config.fromJSON({ players: 4, marbles: 15 })).toThrow();
  });
});

describe('moves', () => {
  it("lists Red's opening moves: eight steps from the front row and six hops", () => {
    const s = cc.setup(cc.defaultConfig, createRng('x'));
    const texts = legalMoves(s).map((m) => cc.codec.action.toText({ type: 'move', from: m & 0xff, to: (m >> 8) & 0xff }));
    expect(texts.sort()).toEqual(['3a-5e', '3a-5g', '3b-5f', '3b-5h', '3c-5g', '3c-5i', '4a-5e', '4a-5f', '4b-5f', '4b-5g', '4c-5g', '4c-5h', '4d-5h', '4d-5i'].sort());
    expect(cc.legal(s, 1)).toEqual([]);
  });

  it('steps to each empty neighbour, never onto a marble', () => {
    const s = at(build({ R: ['7e'], B: ['7f'] }, 'r'));
    expect(targets(s, '7e')).toEqual(['6e', '6f', '7d', '7g', '8d', '8e']);
  });

  it('hops over its own or another marble, not over a hole, two marbles or onto a marble', () => {
    // East over Red's own 7f to 7g; north-west over Blue's 8d to 9c; west is two marbles (7d, 7c);
    // south-east the landing 5g is taken; south-west 6e is empty, so only a step.
    const s = at(build({ R: ['7e', '7f', '7d', '7c', '5g'], B: ['8d', '6f'] }, 'r'));
    expect(targets(s, '7e')).toEqual(['6e', '7g', '8e', '9c']);
    const after = play(s, '7e', '9c');
    expect(after.state.board[h('8d')]).toBe('B');
    expect(after.events[0]).toMatchObject({ type: 'move', seat: 0, path: [h('7e'), h('9c')] });
  });

  it('chains hops, changing direction, and may stop after any hop; nothing is captured', () => {
    const s = at(build({ R: ['7e'], B: ['8e', '10e', '11f'] }, 'r'));
    const t = targets(s, '7e');
    for (const stop of ['9e', '11e', '11g']) expect(t).toContain(stop);
    expect(pathOf(s, move('7e', '11g')).map(holeName)).toEqual(['7e', '9e', '11e', '11g']);
    const { state, events } = play(s, '7e', '11g');
    expect(['8e', '10e', '11f'].map((n) => state.board[h(n)])).toEqual(['B', 'B', 'B']);
    expect(state.board[h('11g')]).toBe('R');
    expect(state.board[h('7e')]).toBe('.');
    expect(events[0]).toMatchObject({ type: 'move', path: [h('7e'), h('9e'), h('11e'), h('11g')] });
  });

  it('never ends a move where it began, even when a chain comes round to it', () => {
    // 9e over 9f to 9g, over 10g to 11g, over 10f back to 9e.
    const s = at(build({ R: ['9e', '9f', '10g', '10f'] }, 'r'));
    const t = targets(s, '9e');
    expect(t).not.toContain('9e');
    expect(t).toContain('9g');
    expect(t).toContain('11g');
    expect(pathOf(s, move('9e', '11g')).map(holeName)).toEqual(['9e', '11g']);
  });

  it('allows long jumps only with that option: over a marble two holes away to two beyond', () => {
    const text = build({ R: ['7e', '9e'] }, 'r');
    expect(targets(at(text), '7e')).not.toContain('11g');
    const long = at(`${text} rules=jumps:long`);
    expect(targets(long, '7e')).toContain('11g');
    expect(pathOf(long, move('7e', '11g')).map(holeName)).toEqual(['7e', '11g']);
    // Not when a hole between is taken, and never over two marbles.
    expect(targets(at(`${build({ R: ['7e', '9e'], B: ['8e'] }, 'r')} rules=jumps:long`), '7e')).not.toContain('11g');
    expect(targets(at(`${build({ R: ['7e', '9e', '10f'] }, 'r')} rules=jumps:long`), '7e')).not.toContain('11g');
  });
});

describe('other points', () => {
  // Red on 7d hops over 7c into 7b (the lower-left point) and on over 8b to 9b.
  const base = build({ R: ['7d', '7c', '8b'] }, 'r');

  it('may stop anywhere by default', () => {
    expect(targets(at(base), '7d')).toEqual(expect.arrayContaining(['7b', '9b']));
    expect(targets(at(base), '7c')).toContain('7b');
  });

  it('may only pass through under "pass through"', () => {
    const s = at(`${base} rules=stop:pass-through`);
    expect(targets(s, '7d')).toContain('9b');
    expect(targets(s, '7d')).not.toContain('7b');
    expect(targets(s, '7c')).not.toContain('7b');
  });

  it('may not even land there under "never"', () => {
    const s = at(`${base} rules=stop:never`);
    expect(targets(s, '7d')).not.toContain('7b');
    expect(targets(s, '7d')).not.toContain('9b');
  });
});

describe('marbles at home', () => {
  // Red on 14b, inside its home (the top point), among Blue marbles; only 15a is free there.
  const spec = { R: ['14b'], B: ['17a', '16a', '16b', '15b', '15c', '14a', '14c', '14d', '9e', '9f'] };

  it('stay inside home by default', () => {
    const s = at(build(spec, 'r'));
    expect(targets(s, '14b')).toEqual(['15a']);
  });

  it('may leave home under "free" and may not move at all under "frozen"', () => {
    expect(targets(at(`${build(spec, 'r')} rules=home:free`), '14b')).toEqual(['13f', '13g', '15a']);
    expect(targets(at(`${build(spec, 'r')} rules=home:frozen`), '14b')).toEqual([]);
  });
});

describe('finishing', () => {
  // Red's home holds eight Red marbles and one Blue; 14d is free and Red's 13h can step into it.
  const home = ['17a', '16a', '16b', '15a', '15b', '15c', '14a', '14b'];
  const spec = { R: [...home, '13h', '9e'], B: ['14c', '4a', '4b', '4c', '4d', '3a', '3b', '3c', '2a', '2b'] };

  it('counts a filled home with one of yours in it as complete, and ends a two-player game', () => {
    const s = at(build(spec, 'r'));
    const { state, events } = play(s, '13h', '14d');
    expect(events.map((e) => e.type)).toEqual(['move', 'finish', 'end']);
    expect(state.done).toEqual([0]);
    expect(cc.outcome(state)).toMatchObject({ reason: 'cc-home', results: [{ seat: 0, place: 1 }, { seat: 1, place: 2 }] });
    expect(cc.turn(state)).toBeNull();
  });

  it('does not count it under "all your own", and never counts a home full of other marbles', () => {
    const s = at(`${build(spec, 'r')} rules=finish:own`);
    const { state } = play(s, '13h', '14d');
    expect(state.done).toEqual([]);
    expect(cc.turn(state)).toBe(1);
    // At the start Red's home is full of Blue's marbles: not complete for Red.
    expect(cc.setup(cc.defaultConfig, createRng('x')).done).toEqual([]);
    expect(() => at(build({ R: [...home, '14c', '14d'], B: ['13a', '13b', '9a', '9b', '9c', '9d', '9e', '9f', '9g', '9h'] }, 'b'))).toThrow(/already complete/);
  });
});

describe('places', () => {
  // Three players, each one step from finishing: Red into 14d, Blue (home lower right) into 8j, Green (home lower left) far behind.
  const redHome = ['17a', '16a', '16b', '15a', '15b', '15c', '14a', '14b', '14c'];
  const blueHome = ['5j', '5k', '5l', '5m', '6j', '6k', '6l', '7j', '7k'];
  const text = build({ R: [...redHome, '13h'], B: [...blueHome, '9i'], G: ['5a', '6a', '9c', '9d', '10c', '10d', '11c', '11d', '12d', '12e'] }, 'r', 'n=3', 3);

  it('plays on after the first finisher until one player is left', () => {
    const s = at(text);
    const first = play(s, '13h', '14d');
    expect(first.events.map((e) => e.type)).toEqual(['move', 'finish']);
    expect(cc.turn(first.state)).toBe(1);
    const second = play(first.state, '9i', '8j');
    expect(second.events.map((e) => e.type)).toEqual(['move', 'finish', 'end']);
    expect(cc.outcome(second.state)?.results.map((r) => r.place)).toEqual([1, 2, 3]);
  });

  it('stops at the first finisher under "first home wins", placing the rest by rows to go', () => {
    const s = at(text.replace('n=3', 'n=3 rules=end:first'));
    const { state, events } = play(s, '13h', '14d');
    expect(events.map((e) => e.type)).toEqual(['move', 'finish', 'end']);
    const rows = rowsLeft(state);
    expect(rows[1]).toBeLessThan(rows[2] as number);
    expect(cc.outcome(state)).toMatchObject({ reason: 'cc-first', results: [{ place: 1 }, { place: 2 }, { place: 3 }] });
  });
});

describe('passing, blocking and the turn limit', () => {
  it('makes a seat with no move pass, and ends the game when every player still in must pass', () => {
    // Both homes are frozen and hold one marble of the other side; each last marble is stuck at a tip.
    const text = build(
      { R: ['16a', '16b', '15a', '15b', '15c', '14a', '14b', '14c', '14d', '1a'], B: ['17a', '2a', '2b', '3a', '3b', '3c', '4a', '4b', '4c', '4d'] },
      'r',
      'rules=home:frozen,finish:own',
    );
    const s = at(text);
    expect(cc.legal(s, 0)).toEqual([{ type: 'pass' }]);
    const first = cc.apply(s, { type: 'pass' });
    expect(first.state.passes).toBe(1);
    expect(cc.legal(first.state, 1)).toEqual([{ type: 'pass' }]);
    const second = cc.apply(first.state, { type: 'pass' });
    expect(second.events.map((e) => e.type)).toEqual(['pass', 'end']);
    expect(cc.outcome(second.state)).toMatchObject({ reason: 'cc-blocked', results: [{ seat: 0, place: 1 }, { seat: 1, place: 1 }] });
    expect(() => cc.apply(cc.setup(cc.defaultConfig, createRng('x')), { type: 'pass' })).toThrow(/only when no marble can move/);
  });

  it('ends the game at the turn limit after the last player of the last round, by rows to go', () => {
    const s = at(`${build({ R: ['9e', '10e'], B: ['8e'] }, 'b')} rules=limit:100 round=100`);
    const { state, events } = play(s, '14a', '13e');
    expect(events.map((e) => e.type)).toEqual(['move', 'end']);
    expect(state.end).toBe('limit');
    const rows = rowsLeft(state);
    expect(rows[0]).toBeLessThan(rows[1] as number);
    expect(placesOf(state)).toEqual([1, 2]);
    // One round earlier the game goes on.
    const earlier = at(`${build({ R: ['9e', '10e'], B: ['8e'] }, 'b')} rules=limit:100 round=99`);
    expect(play(earlier, '14a', '13e').state.end).toBeNull();
  });
});

describe('notation', () => {
  it('reads positions, moves and configs back to the same text', () => {
    const s = cc.setup(PRESETS.six, createRng('x'));
    expect(positionText(parsePosition(positionText(s)))).toBe(positionText(s));
    expect(cc.codec.action.toJSON(move('4b', '5f'))).toBe('fnfm');
    expect(cc.codec.action.fromJSON('fnfm')).toEqual(move('4b', '5f'));
    expect(cc.codec.action.fromText('3a-5e-7e')).toEqual(move('3a', '7e'));
    expect(cc.codec.action.toText(move('3a', '5e'))).toBe('3a-5e');
    for (const config of Object.values<CcConfig>(PRESETS)) expect(cc.codec.config.fromJSON(cc.codec.config.toJSON(config))).toEqual(config);
    const mid = play(cc.setup(cc.defaultConfig, createRng('x')), '3a', '5e').state;
    const again = cc.setup(configAt(mid), createRng('y'));
    expect(positionText(again)).toBe(positionText(mid));
    expect(startBoard(2, 10)).toBe(cc.setup(cc.defaultConfig, createRng('z')).board);
  });

  it('refuses bad text with a reason', () => {
    const good = positionText(cc.setup(cc.defaultConfig, createRng('x')));
    expect(() => parsePosition(good.replace('B/BB', 'B/B.'))).toThrow(/marbles/);
    expect(() => parsePosition(good.replace(' r', ' -'))).toThrow(/over/);
    expect(() => parsePosition(`${good} q=1`)).toThrow(/Unknown field/);
    expect(() => parsePosition(`${good} rules=jumps:far`)).toThrow(/jumps/);
    expect(() => parsePosition(good.split('/').slice(1).join('/'))).toThrow(/rows/);
    expect(() => cc.codec.action.fromJSON('zzzz')).toThrow();
    expect(() => cc.codec.action.fromText('4b')).toThrow();
    const board = boardArray(cc.setup(cc.defaultConfig, createRng('x')).board);
    expect(board.filter((v) => v === 1).length).toBe(10);
  });
});
