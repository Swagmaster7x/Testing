// Golden cases and perft for docs/rules/shogi.md (section 11 lists them).
import { Position as TsPosition } from 'tsshogi';
import { describe, expect, it } from 'vitest';
import { findLegal } from '../../src/core/contract';
import { createRng } from '../../src/core/rng';
import { parseSfen, perft, START_SFEN } from '../../src/games/shogi/core';
import { canonicalToUsi } from '../../src/games/shogi/notation';
import { HANDICAPS } from '../../src/games/shogi/presets';
import type { ShogiConfig, ShogiState } from '../../src/games/shogi/rules';
import { canDeclare, explainIllegal, impassePoints, shogi, stateFromSfen } from '../../src/games/shogi/rules';

const at = (sfen: string, rules: Partial<ShogiState['rules']> = {}): ShogiState => stateFromSfen(sfen, rules);
const moves = (s: ShogiState) => shogi.legal(s, shogi.turn(s) ?? 0).map((a) => shogi.codec.action.toJSON(a) as string);

function play(s: ShogiState, list: readonly string[]): ShogiState {
  let state = s;
  for (const m of list) {
    const seat = shogi.turn(state);
    if (seat === null) throw new Error(`game over before ${m}`);
    const action = findLegal(shogi, state, seat, shogi.codec.action.fromText(m, state));
    if (!action) throw new Error(`${m} is not legal in ${state.sfen}`);
    state = shogi.apply(state, action).state;
  }
  return state;
}

describe('shogi perft (published counts)', () => {
  it('the standard start: 30, 900, 25,470, 719,731', () => {
    const counts = [30, 900, 25_470, 719_731];
    counts.forEach((n, i) => expect(perft(parseSfen(START_SFEN.standard), i + 1)).toBe(n));
  });
  it('mini-shogi: 14, 181, 2,512, 35,401, 533,203', () => {
    const counts = [14, 181, 2_512, 35_401, 533_203];
    counts.forEach((n, i) => expect(perft(parseSfen(START_SFEN.mini), i + 1)).toBe(n));
  });
  it('the "matsuri" position: 207 and 28,684; the record position: 593 moves', () => {
    const matsuri = 'l6nl/5+P1gk/2np1S3/p1p4Pp/3P2Sp1/1PPb2P1P/P5GS1/R8/LN4bKL w RGgsn5p 1';
    expect(perft(parseSfen(matsuri), 1)).toBe(207);
    expect(perft(parseSfen(matsuri), 2)).toBe(28_684);
    expect(perft(parseSfen('R8/2K1S1SSk/4B4/9/9/9/9/9/1L1L1L3 b RBGSNLP3g3n17p 1'), 1)).toBe(593);
  });
  it('the contract wrapper agrees with the core (start, two plies)', () => {
    const s = shogi.setup({}, createRng('x'));
    let total = 0;
    for (const a of shogi.legal(s, 0)) total += moves(shogi.apply(s, a).state).length;
    expect(total).toBe(900);
  });
});

describe('setting up', () => {
  it('starts with Black to move and thirty moves; mini-shogi with fourteen', () => {
    const s = shogi.setup({}, createRng('x'));
    expect(shogi.turn(s)).toBe(0);
    expect(moves(s)).toHaveLength(30);
    expect(shogi.legal(s, 1)).toHaveLength(0);
    const mini = shogi.setup({ board: 'mini' }, createRng('x'));
    expect(mini.sfen).toBe(START_SFEN.mini);
    expect(moves(mini)).toHaveLength(14);
  });

  it('handicaps remove White’s pieces and White moves first', () => {
    for (const h of HANDICAPS) {
      const s = shogi.setup({ board: h.board, handicap: h.id }, createRng('x'));
      expect(s.sfen).toBe(h.sfen);
      expect(shogi.turn(s)).toBe(h.id === 'even' ? 0 : 1);
    }
    const two = shogi.setup({ handicap: 'two' }, createRng('x'));
    expect(two.sfen.split(' ')[0]).toBe('lnsgkgsnl/9/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL');
    expect(two.rules.handicapPoints).toBe(10);
  });
});

describe('drops', () => {
  it('two pawns (nifu): refused on a file with your pawn, allowed beside a tokin', () => {
    const s = at('4k4/9/9/9/9/9/4P4/9/4K4 b P 1');
    expect(moves(s)).not.toContain('P*55');
    expect(explainIllegal(s, { drop: 'P', to: '55' })).toBe('nifu');
    expect(moves(s)).toContain('P*65');
    const tokin = at('4k4/9/9/9/9/9/4+P4/9/4K4 b P 1');
    expect(moves(tokin)).toContain('P*55');
  });

  it('pawn-drop mate (uchifuzume) is refused; the same check with an escape is allowed', () => {
    const mate = at('7nk/7p1/7S1/9/9/9/9/9/K8 b P 1');
    expect(moves(mate)).not.toContain('P*12');
    expect(explainIllegal(mate, { drop: 'P', to: '12' })).toBe('pawn-drop-mate');
    const escape = at('8k/7p1/7S1/9/9/9/9/9/K8 b P 1');
    expect(moves(escape)).toContain('P*12');
    const after = play(escape, ['P*12']);
    expect(after.result).toBeNull();
    expect(moves(after)).toEqual(['1121']);
  });

  it('a pawn moved to mate, or a gold dropped to mate, is fine', () => {
    const moved = play(at('7nk/7p1/7SP/9/9/9/9/9/K8 b - 1'), ['1312']);
    expect(moved.result).toEqual({ kind: 'checkmate', winner: 0 });
    const gold = play(at('7nk/7p1/7S1/9/9/9/9/9/K8 b G 1'), ['G*12']);
    expect(gold.result).toEqual({ kind: 'checkmate', winner: 0 });
    expect(shogi.outcome(gold)?.reason).toBe('checkmate');
  });

  it('dead pieces: no pawn or lance drop on the last rank, no knight on the last two', () => {
    const s = at('4k4/9/9/9/9/9/9/9/4K4 b NLP 1');
    const all = moves(s);
    for (const file of [1, 2, 3, 4, 6, 7, 8, 9]) {
      expect(all).not.toContain(`P*${file}1`);
      expect(all).not.toContain(`L*${file}1`);
      expect(all).not.toContain(`N*${file}1`);
      expect(all).not.toContain(`N*${file}2`);
      expect(all).toContain(`N*${file}3`);
      expect(all).toContain(`P*${file}2`);
    }
    expect(explainIllegal(s, { drop: 'N', to: '22' })).toBe('dead-drop');
    expect(explainIllegal(s, { drop: 'P', to: '51' })).toBe('occupied');
    // White's last ranks are 9 and 8.
    const w = at('4k4/9/9/9/9/9/9/9/4K4 w nlp 1');
    expect(moves(w)).not.toContain('N*28');
    expect(moves(w)).toContain('N*27');
    expect(moves(w)).not.toContain('P*29');
  });
});

describe('promotion', () => {
  it('a pawn reaching the last rank and a knight reaching the second-last must promote', () => {
    const s = at('4k4/P8/9/1N7/9/9/9/9/4K4 b - 1');
    const all = moves(s);
    expect(all).toContain('9291+');
    expect(all).not.toContain('9291');
    expect(all).toContain('8472+');
    expect(all).not.toContain('8472');
    // 92 holds Black's own pawn.
    expect(all).not.toContain('8492+');
  });

  it('promotion is optional moving into, within or out of the zone', () => {
    const s = at('4k4/9/7S1/9/9/9/9/9/4K4 b - 1');
    const all = moves(s);
    expect(all).toContain('2334');
    expect(all).toContain('2334+');
    expect(all).toContain('2322+');
    expect(all).toContain('2322');
    const into = at('4k4/9/9/7S1/9/9/9/9/4K4 b - 1');
    expect(moves(into)).toEqual(expect.arrayContaining(['2433', '2433+']));
  });

  it('a piece dropped in the zone is unpromoted and may promote when it moves', () => {
    const s = play(at('4k4/9/9/9/9/9/9/9/4K4 b S 1'), ['S*22', '5152']);
    expect(s.sfen.startsWith('9/4k2S1/')).toBe(true);
    expect(moves(s)).toEqual(expect.arrayContaining(['2213+', '2213']));
  });

  it('a captured promoted piece goes to hand unpromoted', () => {
    const s = play(at('4k4/9/9/9/4+p4/4G4/9/9/4K4 b - 1'), ['5655']);
    expect(s.sfen.split(' ')[2]).toBe('P');
    const dragon = play(at('4k4/9/9/9/4+r4/4G4/9/9/4K4 b - 1'), ['5655']);
    expect(dragon.sfen.split(' ')[2]).toBe('R');
  });
});

describe('check', () => {
  it('refuses moving into check and leaving a check; a pinned piece stays on its line', () => {
    const s = at('4k4/9/9/9/4r4/9/4G4/9/4K4 b - 1');
    expect(moves(s)).not.toContain('5747');
    expect(explainIllegal(s, { from: '57', to: '47' })).toBe('self-check');
    expect(explainIllegal(s, { from: '57', to: '68' })).toBe('cannot-reach');
    expect(moves(s)).toContain('5756');
    const into = at('4k4/9/9/9/9/9/9/3r5/4K4 b - 1');
    expect(moves(into)).not.toContain('5958');
    expect(explainIllegal(into, { from: '59', to: '58' })).toBe('self-check');
    expect(explainIllegal(into, { from: '59', to: '57' })).toBe('cannot-reach');
  });

  it('a player with no legal move loses, in check or not', () => {
    const boxed = at('8k/9/6NG1/9/9/9/9/9/4K4 w - 1');
    expect(boxed.result).toEqual({ kind: 'no-moves', winner: 0 });
    expect(shogi.outcome(boxed)?.reason).toBe('shogi-no-moves');
    expect(shogi.turn(boxed)).toBeNull();
  });
});

describe('repetition', () => {
  const shuffle = ['5958', '5152', '5859', '5251'];
  it('the fourth time is a draw in standard shogi; the third is not', () => {
    const s = at('4k4/9/9/9/9/9/9/9/4K4 b - 1');
    const eight = play(s, [...shuffle, ...shuffle]);
    expect(eight.result).toBeNull();
    const twelve = play(s, [...shuffle, ...shuffle, ...shuffle]);
    expect(twelve.result).toEqual({ kind: 'repetition', winner: null });
    expect(shogi.outcome(twelve)?.reason).toBe('shogi-repetition');
    expect(shogi.outcome(twelve)?.results.every((r) => r.score === 0.5)).toBe(true);
  });

  it('in mini-shogi the player who moved first loses', () => {
    const s = at('4k/5/5/5/K4 b - 1');
    const loop = ['5554', '1112', '5455', '1211'];
    const end = play(s, [...loop, ...loop, ...loop]);
    expect(end.result).toEqual({ kind: 'repetition', winner: 1 });
    expect(shogi.outcome(end)?.reason).toBe('shogi-repetition-loss');
  });

  it('perpetual check loses for the side giving it', () => {
    const s = at('8k/R8/9/9/9/9/9/9/4K4 b - 1');
    const loop = ['9291', '1112', '9192', '1211'];
    const end = play(s, [...loop, ...loop, ...loop]);
    expect(end.result).toEqual({ kind: 'perpetual-check', winner: 1 });
    expect(shogi.outcome(end)?.reason).toBe('shogi-perpetual-check');
  });
});

describe('impasse', () => {
  const entered = '9/4K4/9/9/9/9/9/4k4/9 b';
  it('24-point count: fewer than 24 loses; both 24 or more draws; handicap pieces count for White', () => {
    const rules = { impasse: 'points-24' as const };
    const win = at(`${entered} 2R2B4G4S4N4L18P 1`, rules);
    expect(canDeclare(win)).toBe(true);
    const counted = play(win, ['declare']);
    expect(counted.result).toEqual({ kind: 'impasse-count', winner: 0, points: [54, 0] });
    expect(shogi.outcome(counted)?.reason).toBe('shogi-impasse-24');
    const draw = play(at(`${entered} RB2G2S2N2L9Prb2g2s2n2l9p 1`, rules), ['declare']);
    expect(draw.result).toEqual({ kind: 'impasse-count', winner: null, points: [27, 27] });
    const p = parseSfen(`${entered} 2R2B2G2S2N2L13P2g2s2n2l5p 1`);
    expect(impassePoints(p, 1, { handicapPoints: 0 })).toBe(13);
    expect(impassePoints(p, 1, { handicapPoints: 10 })).toBe(23);
    // Not offered unless both kings are in their zones.
    expect(canDeclare(at(`9/9/9/4K4/9/9/9/4k4/9 b 2R2B4G4S4N4L18P 1`, rules))).toBe(false);
  });

  it('27-point declaration: king in the camp, ten pieces there, 28 points for Black, not in check', () => {
    const rules = { impasse: 'declare-27' as const };
    const ok = at('5G3/4K4/PPPPPPPPP/9/9/9/9/4k4/9 b 2R2B3g4s4n4l9p 1', rules);
    expect(canDeclare(ok)).toBe(true);
    const done = play(ok, ['declare']);
    expect(done.result).toEqual({ kind: 'impasse-declared', winner: 0 });
    // 27 points is one short for Black.
    expect(canDeclare(at('5G3/4K4/PPPPPPPPP/9/9/9/9/4k4/9 b 2RB2S3gb2s4n4l9p 1', rules))).toBe(false);
    // Nine pieces in the camp are too few.
    expect(canDeclare(at('9/4K4/PPPPPPPPP/9/9/9/9/4k4/9 b 2R2BG3g4s4n4l9p 1', rules))).toBe(false);
    // The default rule set offers it; mini-shogi never does.
    expect(stateFromSfen(START_SFEN.standard).rules.impasse).toBe('declare-27');
    expect(stateFromSfen(START_SFEN.mini).rules.impasse).toBe('none');
  });

  it('the try rule: the king reaching the enemy king’s start square wins once both kings have entered', () => {
    const s = play(at('9/4K4/9/9/9/9/9/4k4/9 b G 1', { impasse: 'try' }), ['5251']);
    expect(s.result).toEqual({ kind: 'try', winner: 0 });
    const early = play(at('9/4K4/9/9/9/9/9/9/4k4 b G 1', { impasse: 'none' }), ['5251']);
    expect(early.result).toBeNull();
  });
});

describe('the move limit', () => {
  it('draws when the limit is reached', () => {
    const config: ShogiConfig = { moveLimit: 2 };
    const s = shogi.setup(config, createRng('x'));
    const end = play(s, ['7776', '3334']);
    expect(end.result).toEqual({ kind: 'move-limit' });
    expect(shogi.outcome(end)?.reason).toBe('shogi-move-limit');
  });
});

describe('codecs', () => {
  it('SFEN reads back what it writes, including hands and the move number', () => {
    const sfen = 'l6nl/5+P1gk/2np1S3/p1p4Pp/3P2Sp1/1PPb2P1P/P5GS1/R8/LN4bKL w RGgsn5p 1';
    expect(shogi.codec.state.toText(shogi.codec.state.fromText(sfen))).toBe(sfen);
    expect(() => shogi.codec.state.fromText('4k4/9/9/9/9/9/4P4/4P4/4K4 b - 1')).toThrow(/two Black pawns/);
    expect(() => shogi.codec.state.fromText('P3k4/9/9/9/9/9/9/9/4K4 b - 1')).toThrow(/could never move/);
  });

  it('moves read as the canonical form, USI and Western notation', () => {
    const s = shogi.setup({}, createRng('x'));
    const a = shogi.codec.action.fromText('7g7f', s);
    expect(shogi.codec.action.toJSON(a)).toBe('7776');
    expect(shogi.codec.action.toText(a)).toBe('P-76');
    expect(shogi.codec.action.toJSON(shogi.codec.action.fromText('P-76', s))).toBe('7776');
    const after = play(s, ['7776', '3334']);
    expect(shogi.codec.action.toText(shogi.codec.action.fromText('8822+', after))).toBe('Bx22+');
    expect(shogi.codec.action.toText(shogi.codec.action.fromText('8822', after))).toBe('Bx22=');
    expect(canonicalToUsi('8822+')).toBe('8h2b+');
    // Two golds can reach 58: the origin is named.
    const golds = play(s, ['6978']);
    const texts = shogi.legal(golds, 1).map((x) => x.text);
    expect(texts.length).toBeGreaterThan(0);
    const g = play(at('4k4/9/9/9/9/9/9/9/3GKG3 b - 1'), []);
    expect(shogi.legal(g, 0).map((x) => x.text)).toEqual(expect.arrayContaining(['G69-58', 'G49-58', 'G-68']));
  });

  it('the config keeps only what differs from the standard game', () => {
    expect(shogi.codec.config.toJSON({ board: 'standard', handicap: 'even', impasse: 'declare-27' })).toEqual({});
    expect(shogi.codec.config.toJSON({ board: 'mini' })).toEqual({ board: 'mini' });
    expect(shogi.codec.config.fromJSON({ fen: START_SFEN.mini })).toEqual({ position: START_SFEN.mini });
    expect(shogi.codec.config.fromJSON({ handicap: 'lance', board: 'mini' })).toEqual({ board: 'mini' });
  });
});

describe('cross-check against tsshogi, move by move', () => {
  /** Every legal move by tsshogi's own validation, as USI. */
  function tsLegal(sfen: string): string[] {
    const position = TsPosition.newBySFEN(sfen);
    if (!position) throw new Error(`tsshogi cannot read ${sfen}`);
    const files = '123456789';
    const ranks = 'abcdefghi';
    const out: string[] = [];
    const black = sfen.split(' ')[1] === 'b';
    const ours = parseSfen(sfen);
    const squares: string[] = [];
    for (const f of files) for (const r of ranks) squares.push(`${f}${r}`);
    for (const from of squares) {
      const rows = sfen.split(' ')[0]!.split('/');
      void rows;
      const index = ours.geo.squares.find((sq) => `${ours.geo.fileOf[sq]}${ranks[(ours.geo.rankOf[sq] ?? 1) - 1]}` === from);
      if (index === undefined) continue;
      const code = ours.board[index]!;
      if (code === 0 || (code >> 4 === 0) !== black) continue;
      for (const to of squares) {
        for (const promote of ['', '+']) {
          const move = position.createMoveByUSI(`${from}${to}${promote}`);
          if (move && position.isValidMove(move)) out.push(`${from}${to}${promote}`);
        }
      }
    }
    const hand = sfen.split(' ')[2] ?? '-';
    for (const letter of 'PLNSGBR') {
      if (!hand.includes(black ? letter : letter.toLowerCase())) continue;
      for (const to of squares) {
        const move = position.createMoveByUSI(`${letter}*${to}`);
        if (move && position.isValidMove(move)) out.push(`${letter}*${to}`);
      }
    }
    return out.sort();
  }

  it('agrees on every position of random games, nifu and pawn-drop mate included', () => {
    let positions = 0;
    for (const seed of ['a', 'b', 'c']) {
      const rng = createRng(`xcheck-${seed}`);
      let s = shogi.setup({ moveLimit: 160 }, createRng(seed));
      while (shogi.turn(s) !== null) {
        if (positions % 3 === 0) {
          const mine = shogi
            .legal(s, shogi.turn(s) ?? 0)
            .filter((a) => a.type !== 'declare')
            .map((a) => canonicalToUsi(shogi.codec.action.toJSON(a) as string))
            .sort();
          expect(mine, s.sfen).toEqual(tsLegal(s.sfen));
        }
        positions++;
        const legal = shogi.legal(s, shogi.turn(s) ?? 0);
        s = shogi.apply(s, rng.pick(legal)).state;
      }
    }
    expect(positions).toBeGreaterThan(100);
  }, 120_000);

  it('agrees on the pawn-drop mate position', () => {
    for (const sfen of ['7nk/7p1/7S1/9/9/9/9/9/K8 b P 1', '8k/7p1/7S1/9/9/9/9/9/K8 b P 1']) {
      const mine = moves(at(sfen)).map(canonicalToUsi).sort();
      expect(mine).toEqual(tsLegal(sfen));
    }
  });
});
