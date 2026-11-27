// Golden cases for docs/rules/go.md.
import { describe, expect, it } from 'vitest';
import { findLegal } from '../../src/core/contract';
import type { Json } from '../../src/core/json';
import { createRng } from '../../src/core/rng';
import { Board, BLACK, hashHex } from '../../src/games/go/board';
import { handicapPoints, parsePoint, pointName, sgfName, starPoints } from '../../src/games/go/coords';
import type { GoAction, GoConfig, GoPresetId, GoState } from '../../src/games/go/rules';
import { boardOf, configAt, countState, go, legalPoints, makeConfig, parsePosition, positionText, PRESET_IDS, PRESETS } from '../../src/games/go/rules';

const at = (text: string): GoState => go.codec.state.fromText(text);

function action(state: GoState, move: string): GoAction | null {
  const seat = go.turn(state);
  if (seat === null) return null;
  try {
    return findLegal(go, state, seat, go.codec.action.fromText(move, state));
  } catch {
    return null;
  }
}

function play(state: GoState, ...moves: string[]): GoState {
  let s = state;
  for (const m of moves) {
    const a = action(s, m);
    if (!a) throw new Error(`${m} is not legal in ${positionText(s)}`);
    s = go.apply(s, a).state;
  }
  return s;
}

const legal = (state: GoState, move: string) => action(state, move) !== null;

function libertiesAt(state: GoState, name: string): number {
  const board = boardOf(state);
  const p = parsePoint(name, state.size);
  if (p === null) throw new Error(name);
  return board.libertyCount(board.fromPoint(p));
}

const fresh = (size: number, preset: GoPresetId = 'chinese', handicap = 0, changes = {}) => go.setup(makeConfig(size, preset, handicap, changes), createRng('t'));

describe('go: points, liberties and capture', () => {
  it('names points by column (no I) and row from the bottom, and by SGF letters', () => {
    expect(pointName(0, 19)).toBe('A19');
    expect(pointName(18, 19)).toBe('T19');
    expect(pointName(19 * 19 - 1, 19)).toBe('T1');
    expect(pointName(8, 9)).toBe('J9');
    expect(sgfName(0, 9)).toBe('aa');
    expect(parsePoint('D4', 9)).toBe(5 * 9 + 3);
    expect(parsePoint('dd', 9)).toBe(3 * 9 + 3);
    expect(parsePoint('I5', 9)).toBeNull();
    expect(parsePoint('K1', 9)).toBeNull();
    expect(starPoints(9).map((p) => pointName(p, 9)).sort()).toEqual(['C3', 'C7', 'E5', 'G3', 'G7']);
    expect(starPoints(19)).toHaveLength(9);
  });

  it('counts liberties: four in the centre, three on the edge, two in the corner', () => {
    const s = at('X...X/...../..X../...../X.... w');
    expect(libertiesAt(s, 'C3')).toBe(4);
    expect(libertiesAt(s, 'E5')).toBe(2);
    expect(libertiesAt(s, 'A1')).toBe(2);
    const edge = at('..X../...../...../...../..... w');
    expect(libertiesAt(edge, 'C5')).toBe(3);
  });

  it('takes a stone off when its last liberty is filled, and keeps it as a prisoner', () => {
    const s = at('...../..X../.XO../..X../..... b');
    const r = go.apply(s, action(s, 'D3') as GoAction);
    expect(r.state.board[2 * 5 + 2]).toBe('.');
    expect(r.state.prisoners).toEqual([1, 0]);
    expect(r.events[0]).toMatchObject({ type: 'place', name: 'D3', captured: ['cc'] });
  });

  it('captures a whole chain, and several chains with one stone', () => {
    const chain = at('...../.XX../XOO../.XX../..... b');
    expect(libertiesAt(chain, 'B3')).toBe(1);
    expect(play(chain, 'D3').prisoners).toEqual([2, 0]);
    // C4 takes C5, B4 and D4 at once; C3 keeps a liberty and stays.
    const three = play(at('.XOX./XO.OX/.XOX./...../..... b'), 'C4');
    expect(three.prisoners).toEqual([3, 0]);
    expect([...three.board].flatMap((c, p) => (c === 'O' ? [pointName(p, 5)] : []))).toEqual(['C3']);
  });

  it('refuses a single-stone suicide under every preset', () => {
    for (const preset of PRESET_IDS) {
      const s = at(`.X.../X..../...../...../..... w${preset === 'chinese' ? '' : ` rules=${preset}`}`);
      expect(legal(s, 'A5'), preset).toBe(false);
    }
  });

  it('refuses a two-stone suicide, unless the rules allow it; then the opponent takes the stones', () => {
    const chinese = at('...../...../XX.../OX.../.X... w');
    expect(legal(chinese, 'A1')).toBe(false);
    const nz = at('...../...../XX.../OX.../.X... w rules=new-zealand');
    const after = play(nz, 'A1');
    expect(after.board[3 * 5]).toBe('.');
    expect(after.board[4 * 5]).toBe('.');
    expect(after.prisoners).toEqual([2, 0]);
  });

  it('allows a move with no liberty of its own when it captures', () => {
    const s = at('...../...../...../XO.../.XO.. w');
    expect(legal(s, 'A1')).toBe(true);
    const after = play(s, 'A1');
    expect(after.board[4 * 5 + 1]).toBe('.');
    expect(after.prisoners).toEqual([0, 1]);
  });
});

describe('go: ko and superko', () => {
  const ko = '...../.XO../XO.O./.XO../..... b';

  it('refuses retaking a ko at once, under every ko rule, and allows it after a threat elsewhere', () => {
    for (const preset of ['chinese', 'aga', 'japanese'] as const) {
      const s = play(at(`${ko}${preset === 'chinese' ? '' : ` rules=${preset}`}`), 'C3');
      expect(s.ko, preset).toBe(parsePoint('B3', 5));
      expect(legal(s, 'B3'), preset).toBe(false);
      const later = play(s, 'E5', 'E1');
      expect(legal(later, 'B3'), preset).toBe(true);
    }
  });

  it('tells positional from situational superko', () => {
    const base = at('...../.X.../...../...../..... b');
    // The board after Black plays C3 is put in the history with Black to move.
    const board = boardOf(base);
    board.play(board.fromPoint(parsePoint('C3', 5) as number), BLACK);
    const seenWithBlackToMove = `${hashHex(board.hashHi, board.hashLo)}b`;
    const withHistory = (preset: string) => {
      const s = at(`...../.X.../...../...../..... b rules=${preset}`);
      return { ...s, history: [seenWithBlackToMove, ...s.history] };
    };
    expect(legal(withHistory('chinese'), 'C3')).toBe(false);
    expect(legal(withHistory('aga'), 'C3')).toBe(true);
    expect(legal(withHistory('japanese'), 'C3')).toBe(true);
  });

  it('ends a game with no result when a position comes round the third time under the Japanese rules', () => {
    const s = at('...../.X.../...../...../..... b rules=japanese');
    const board = boardOf(s);
    board.play(board.fromPoint(parsePoint('C3', 5) as number), BLACK);
    const key = `${hashHex(board.hashHi, board.hashLo)}w`;
    const twice: GoState = { ...s, history: [key, key, ...s.history] };
    const after = play(twice, 'C3');
    expect(after.result).toEqual({ kind: 'no-result' });
    expect(go.outcome(after)).toMatchObject({ reason: 'go-no-result', results: [{ place: 1 }, { place: 1 }] });
    const once: GoState = { ...s, history: [key, ...s.history] };
    expect(play(once, 'C3').result).toBeNull();
  });

  it('never forbids a pass', () => {
    const s = play(at(ko), 'C3');
    expect(legal(s, 'pass')).toBe(true);
  });
});

describe('go: the end of play, marking and counting', () => {
  it('ends play after two passes and hands marking to the player after the last passer', () => {
    const s = play(fresh(9), 'E5', 'pass', 'pass');
    expect(s.phase).toBe('scoring');
    expect(go.turn(s)).toBe(1);
    expect(go.legal(s, 1).map((a) => go.codec.action.toText(a))).toEqual(['dead E5', 'done', 'resume']);
  });

  it('counts after done and agree; a change after done needs a new agreement', () => {
    let s = play(fresh(9), 'E5', 'D5', 'pass', 'pass');
    expect(go.turn(s)).toBe(0);
    s = play(s, 'dead D5', 'done');
    expect(s.agreed).toBe(0);
    expect(go.turn(s)).toBe(1);
    const changed = play(s, 'dead D5');
    expect(changed.dead).toEqual([]);
    expect(changed.agreed).toBeNull();
    const counted = play(s, 'done');
    expect(counted.phase).toBe('over');
    // Black: the whole board but the dead stone's point is Black's area: 80 points + E5.
    expect(counted.result).toEqual({ kind: 'score', black: 81, white: 7.5 });
    expect(go.outcome(counted)).toMatchObject({ reason: 'go-area', results: [{ seat: 0, place: 1, score: 81 }, { seat: 1, place: 2, score: 7.5 }] });
  });

  it('plays on from the marking with the player after the last passer, clearing the marks', () => {
    let s = play(fresh(9), 'E5', 'D5', 'pass', 'pass', 'dead D5');
    s = play(s, 'resume');
    expect(s.phase).toBe('play');
    expect(s.dead).toEqual([]);
    expect(go.turn(s)).toBe(0);
  });

  it('under AGA rules White passes last and every pass hands over a prisoner', () => {
    let s = fresh(9, 'aga');
    s = play(s, 'E5', 'pass', 'pass');
    expect(s.phase).toBe('play');
    expect(s.prisoners).toEqual([1, 1]);
    s = play(s, 'pass');
    expect(s.phase).toBe('scoring');
    expect(s.prisoners).toEqual([2, 1]);
  });

  it('counts the same finished game by area and by territory', () => {
    // Black owns columns A to D, White F to J; E is the border, half each with no dame.
    const rows = ['XXXXOOOOO', 'XXXXOOOOO', ...Array.from({ length: 7 }, () => '...XO....')];
    const area = at(`${rows.join('/')} b cap=2,3`);
    const a = countState(area);
    expect(a.stones).toEqual([4 * 2 + 7, 5 * 2 + 7]);
    expect(a.territory).toEqual([3 * 7, 4 * 7]);
    expect(a.black).toBe(15 + 21);
    expect(a.white).toBe(17 + 28 + 7.5);
    const territory = at(`${rows.join('/')} b cap=2,3 rules=japanese`);
    const t = countState(territory);
    expect(t.black).toBe(21 + 2);
    expect(t.white).toBe(28 + 3 + 6.5);
  });

  it('counts dead stones as prisoners and their points as territory', () => {
    const s = at('...../.XXX./.XO../.XXX./..... b rules=japanese');
    // Alive, the white stone touches the one big empty region, so nothing is territory.
    expect(countState(s).territory).toEqual([0, 0]);
    const dead = countState(s, [parsePoint('C3', 5) as number]);
    expect(dead.territory).toEqual([18, 0]);
    expect(dead.prisoners).toEqual([1, 0]);
    expect(dead.black).toBe(18 + 1);
    expect(dead.white).toBe(6.5);
    const area = countState(at('...../.XXX./.XO../.XXX./..... b'), [parsePoint('C3', 5) as number]);
    expect(area.black).toBe(25);
  });

  it('keeps a seki: the shared liberty is neutral, the eyes count under area but not under Japanese counting', () => {
    const seki = 'OOXXX/OOXXX/O.OX./OOOXX/OO.XX b';
    const area = countState(at(seki));
    expect(area.seki).toEqual([]);
    expect(area.black).toBe(11 + 1);
    expect(area.white).toBe(11 + 1 + 7.5);
    const japanese = countState(at(`${seki} rules=japanese`));
    expect(japanese.seki.map((p) => pointName(p, 5))).toEqual(['C1']);
    expect(japanese.territory).toEqual([0, 0]);
    const counted = countState(at(`${seki} rules=japanese,seki:count`));
    expect(counted.territory).toEqual([1, 1]);
  });

  it('does not mistake an unfilled dame between settled groups for seki', () => {
    const rows = Array.from({ length: 7 }, () => '.X.O...').join('/');
    const c = countState(at(`${rows} b rules=japanese`));
    expect(c.seki).toEqual([]);
    expect(c.territory).toEqual([7, 21]);
  });

  it('counts at once, every stone alive, when the rules have no marking (Tromp-Taylor)', () => {
    const s = play(fresh(9, 'tromp-taylor'), 'E5', 'D5', 'pass', 'pass');
    expect(s.phase).toBe('over');
    expect(s.result).toEqual({ kind: 'score', black: 1, white: 1 + 7.5 });
  });
});

describe('go: handicap', () => {
  it('puts fixed handicap stones on the star points; White moves first; komi is half a point', () => {
    for (const size of [9, 13, 19]) {
      for (let n = 2; n <= 9; n++) {
        const s = fresh(size, 'japanese', n);
        const stones = [...s.board].flatMap((c, p) => (c === 'X' ? [p] : []));
        expect(stones.sort((a, b) => a - b)).toEqual([...handicapPoints(size, n)].sort((a, b) => a - b));
        expect(go.turn(s)).toBe(1);
        expect(s.rules.komi).toBe(0.5);
      }
    }
    expect(handicapPoints(19, 3).map((p) => pointName(p, 19))).toEqual(['Q16', 'D4', 'Q4']);
  });

  it('lets Black place free handicap stones one at a time, then White moves; compensation goes to White', () => {
    let s = fresh(9, 'chinese', 3);
    expect(s.phase).toBe('handicap');
    expect(legal(s, 'pass')).toBe(false);
    s = play(s, 'C3', 'G7');
    expect(go.turn(s)).toBe(0);
    s = play(s, 'E5');
    expect(s.phase).toBe('play');
    expect(go.turn(s)).toBe(1);
    const c = countState(s);
    expect(c.compensation).toBe(3);
    expect(c.white).toBe(3 + 0.5);
  });

  it('gives n − 1 compensation under AGA rules and none under Japanese', () => {
    expect(countState(fresh(9, 'aga', 4)).compensation).toBe(3);
    expect(countState(fresh(9, 'japanese', 4)).compensation).toBe(0);
  });
});

describe('go: Capture-Go', () => {
  it('ends at the first capture', () => {
    const s = at('...../..X../.XO../..X../..... b rules=capture');
    const r = go.apply(s, action(s, 'D3') as GoAction);
    expect(r.state.result).toEqual({ kind: 'capture', winner: 0 });
    expect(go.outcome(r.state)).toMatchObject({ reason: 'go-capture', results: [{ seat: 0, place: 1 }, { seat: 1, place: 2 }] });
    expect(r.events.map((e) => e.type)).toContain('end');
  });

  it('plays on to the agreed number of stones', () => {
    const s = at('...../..X../.XO../..X../..... b rules=capture,captureTarget:3');
    const after = play(s, 'D3');
    expect(after.result).toBeNull();
    expect(after.prisoners).toEqual([1, 0]);
  });

  it('after two passes, the side with more prisoners wins', () => {
    const s = play(at('...../...../...../...../..... b rules=capture cap=0,1'), 'pass', 'pass');
    expect(s.result).toEqual({ kind: 'captures', black: 0, white: 1 });
    expect(go.outcome(s)).toMatchObject({ reason: 'go-captures', results: [{ seat: 0, place: 2 }, { seat: 1, place: 1 }] });
  });
});

describe('go: notation and codecs', () => {
  it('reads position text back to the same text', () => {
    for (const text of [
      '...../.XO../XO.O./.XO../..... b',
      '...../.XO../X.XO./.XO../..... w ko=bc cap=1,0',
      'OOXXX/OOXXX/O.OX./OOOXX/OO.XX b rules=japanese pass=2,w phase=scoring,b,w dead=aa',
      `${Array.from({ length: 9 }, () => '.........').join('/')} w rules=aga hc=2`,
      '...../...../...../...../..... b rules=capture,captureTarget:3',
    ]) {
      expect(positionText(parsePosition(text)), text).toBe(text);
    }
  });

  it('refuses malformed positions', () => {
    expect(() => parsePosition('..../.... b')).toThrow();
    expect(() => parsePosition('XO/OX x')).toThrow();
    expect(() => parsePosition('.O/O. b rules=martian')).toThrow();
    expect(() => parsePosition('XO/O. b')).toThrow(/no liberties/);
  });

  it('keeps the repetition history in JSON, not in the text', () => {
    const s = play(fresh(9), 'E5', 'D5');
    const json = go.codec.state.toJSON(s);
    const back = go.codec.state.fromJSON(JSON.parse(JSON.stringify(json)) as Json);
    expect(back.history).toEqual(s.history);
    expect(go.codec.state.fromText(go.codec.state.toText(s)).history).toHaveLength(1);
  });

  it('reads moves in either notation and writes the usual one', () => {
    const s = fresh(9);
    expect(go.codec.action.toText(action(s, 'D4') as GoAction)).toBe('D4');
    expect(go.codec.action.toJSON(action(s, 'D4') as GoAction)).toBe('df');
    expect(go.codec.action.toText(action(s, 'df') as GoAction)).toBe('D4');
    expect(go.codec.action.fromJSON('pass')).toEqual({ type: 'pass' });
    expect(() => go.codec.action.fromJSON('zz9')).toThrow();
  });

  it('writes the config with only what differs from the preset, and reads it back', () => {
    const configs: GoConfig[] = [makeConfig(9, 'chinese'), makeConfig(13, 'japanese', 3), makeConfig(19, 'aga', 0, { komi: 6.5 }), makeConfig(9, 'capture', 0, { captureTarget: 5 })];
    for (const c of configs) {
      const json = go.codec.config.toJSON(c);
      expect(go.codec.config.fromJSON(json)).toEqual(c);
    }
    expect(go.codec.config.toJSON(makeConfig(9, 'chinese'))).toEqual({ size: 9, preset: 'chinese' });
    expect(go.codec.config.toJSON(makeConfig(13, 'japanese', 3))).toEqual({ size: 13, preset: 'japanese', handicap: 3 });
    expect(() => go.codec.config.fromJSON({ size: 9, handicap: 1 })).toThrow();
  });

  it('starts "play on from here" games from the position with the same rules', () => {
    const s = play(fresh(13, 'japanese', 2), 'K4', 'D10');
    const c = configAt(s);
    const again = go.setup(c, createRng('x'));
    expect(again.board).toBe(s.board);
    expect(again.rules).toEqual(s.rules);
    expect(again.handicap).toBe(2);
    expect(go.turn(again)).toBe(1);
  });

  it('has a preset for every rule set in the doc', () => {
    expect(PRESET_IDS).toEqual(['chinese', 'japanese', 'aga', 'new-zealand', 'tromp-taylor', 'capture']);
    expect(PRESETS.japanese).toMatchObject({ scoring: 'territory', komi: 6.5, ko: 'simple', seki: 'neutral' });
    expect(PRESETS.aga).toMatchObject({ ko: 'situational', compensation: 'n-1', passStones: true, whitePassesLast: true });
    expect(PRESETS['new-zealand']).toMatchObject({ komi: 7, suicide: true });
  });

  it('lists only legal points as moves', () => {
    const s = play(at('...../.XO../XO.O./.XO../..... b'), 'C3');
    const points = legalPoints(s).map((p) => pointName(p, 5));
    expect(points).not.toContain('B3');
    expect(points).not.toContain('C3');
    expect(points).toHaveLength(25 - 7 - 1);
  });

  it('keeps Board.fromText and toText in step', () => {
    const b = Board.fromText(5, 'X...O....................');
    expect(b.toText()).toBe('X...O....................');
  });
});
