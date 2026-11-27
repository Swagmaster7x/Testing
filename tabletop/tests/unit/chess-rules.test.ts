// Golden cases and perft for docs/rules/chess.md.
import { Chess } from 'chess.js';
import { describe, expect, it } from 'vitest';
import type { ChessState } from '../../src/games/chess/rules';
import { chess, positionKey, START_FEN } from '../../src/games/chess/rules';
import { createRng } from '../../src/core/rng';
import { findLegal } from '../../src/core/contract';
import type { Json } from '../../src/core/json';

const at = (fen: string): ChessState => chess.codec.state.fromText(fen);

function move(state: ChessState, uci: string): { state: ChessState; events: ReturnType<typeof chess.apply>['events'] } {
  const seat = chess.turn(state);
  if (seat === null) throw new Error('game over');
  const action = findLegal(chess, state, seat, chess.codec.action.fromText(uci));
  if (!action) throw new Error(`${uci} is not legal in ${state.fen}`);
  return chess.apply(state, action);
}

function play(fen: string, moves: string[]): ChessState {
  let s = at(fen);
  for (const m of moves) s = move(s, m).state;
  return s;
}

function perft(state: ChessState, depth: number): number {
  const seat = chess.turn(state);
  if (seat === null) return 0;
  const moves = chess.legal(state, seat);
  if (depth === 1) return moves.length;
  let total = 0;
  for (const m of moves) total += perft(chess.apply(state, m).state, depth - 1);
  return total;
}

// Published perft values (Chess Programming Wiki, "Perft Results").
const PERFT: { name: string; fen: string; counts: number[] }[] = [
  { name: 'start', fen: START_FEN, counts: [20, 400, 8902, 197281, 4865609] },
  { name: 'Kiwipete', fen: 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1', counts: [48, 2039, 97862, 4085603] },
  { name: 'position 3', fen: '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1', counts: [14, 191, 2812, 43238, 674624] },
  { name: 'position 4', fen: 'r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1', counts: [6, 264, 9467, 422333] },
  { name: 'position 5', fen: 'rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8', counts: [44, 1486, 62379, 2103487] },
  { name: 'position 6', fen: 'r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10', counts: [46, 2079, 89890, 3894594] },
];

describe('chess perft', () => {
  for (const p of PERFT) {
    it(`${p.name}: our contract wrapper matches the published counts`, () => {
      const depth = p.name === 'start' || p.name === 'position 3' ? 3 : 2;
      expect(perft(at(p.fen), depth)).toBe(p.counts[depth - 1]);
    });
    it(`${p.name}: chess.js matches one ply deeper`, () => {
      const depth = p.name === 'start' || p.name === 'position 3' ? 4 : 3;
      expect(new Chess(p.fen).perft(depth)).toBe(p.counts[depth - 1]);
    });
  }
});

describe('chess rules', () => {
  it('starts with White to move and twenty moves', () => {
    const s = chess.setup({}, createRng('x'));
    expect(chess.turn(s)).toBe(0);
    expect(chess.legal(s, 0)).toHaveLength(20);
    expect(chess.legal(s, 1)).toHaveLength(0);
    expect(chess.legal(s, 0).map((a) => a.san)).toContain('Nf3');
  });

  it('castles, moving the rook too, and refuses castling through or out of check', () => {
    const open = 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1';
    const { events } = move(at(open), 'e1g1');
    expect(events[0]).toMatchObject({ type: 'move', san: 'O-O', rook: { from: 'h1', to: 'f1' } });
    expect(move(at(open), 'e1c1').events[0]).toMatchObject({ san: 'O-O-O', rook: { from: 'a1', to: 'd1' } });
    const through = 'r3k2r/8/8/8/8/8/5r2/R3K2R w KQkq - 0 1'; // f-file attacked: f1 is crossed
    expect(() => move(at(through), 'e1g1')).toThrow();
    const inCheck = 'r3k2r/8/8/8/8/8/4r3/R3K2R w KQkq - 0 1';
    expect(() => move(at(inCheck), 'e1g1')).toThrow();
    expect(() => move(at(inCheck), 'e1c1')).toThrow();
  });

  it('allows en passant only on the very next move', () => {
    const s = play(START_FEN, ['e2e4', 'a7a6', 'e4e5', 'd7d5']);
    const { events } = move(s, 'e5d6');
    expect(events[0]).toMatchObject({ san: 'exd6', captured: 'p', taken: 'd5' });
    const late = play(START_FEN, ['e2e4', 'a7a6', 'e4e5', 'd7d5', 'b1c3', 'a6a5']);
    expect(() => move(late, 'e5d6')).toThrow();
  });

  it('offers all four promotions and names them', () => {
    const s = at('8/4P3/8/8/8/8/8/k6K w - - 0 1');
    const promos = chess.legal(s, 0).filter((a) => a.from === 'e7');
    expect(promos.map((a) => a.promotion).sort()).toEqual(['b', 'n', 'q', 'r']);
    expect(promos.map((a) => a.san).sort()).toEqual(['e8=B', 'e8=N', 'e8=Q', 'e8=R']);
    expect(move(s, 'e7e8n').events[0]).toMatchObject({ promotion: 'n' });
  });

  it('ends in checkmate: Fool’s mate', () => {
    const s = play(START_FEN, ['f2f3', 'e7e5', 'g2g4', 'd8h4']);
    expect(s.result).toEqual({ kind: 'checkmate', winner: 1 });
    expect(chess.turn(s)).toBeNull();
    expect(chess.outcome(s)).toMatchObject({ reason: 'checkmate', results: [{ seat: 1, place: 1 }, { seat: 0, place: 2 }] });
  });

  it('reports check as an event', () => {
    const { events } = move(at('4k3/8/8/8/8/8/8/R3K3 w - - 0 1'), 'a1a8');
    expect(events.some((e) => e.type === 'check' && e.seat === 1)).toBe(true);
  });

  it('ends in stalemate', () => {
    const s = play('7k/8/6Q1/8/8/8/8/K7 w - - 0 1', ['g6f7']);
    expect(s.result).toEqual({ kind: 'stalemate' });
    expect(chess.outcome(s)?.reason).toBe('stalemate');
  });

  it('draws by threefold repetition', () => {
    const shuffle = ['g1f3', 'g8f6', 'f3g1', 'f6g8'];
    const once = play(START_FEN, shuffle);
    expect(once.result).toBeNull();
    const twice = play(START_FEN, [...shuffle, ...shuffle]);
    expect(twice.result).toEqual({ kind: 'threefold' });
  });

  it('draws by the fifty-move rule', () => {
    const s = play('4k3/8/8/8/8/8/8/4K2R w K - 99 80', ['h1h2']);
    expect(s.result).toEqual({ kind: 'fifty-move' });
  });

  it('draws by insufficient material', () => {
    const s = play('4k3/8/8/8/8/8/3p4/3BK3 w - - 0 1', ['e1d2']);
    expect(s.result).toEqual({ kind: 'insufficient' });
  });

  it('refuses illegal moves and moves after the end', () => {
    const s = chess.setup({}, createRng('x'));
    expect(() => chess.apply(s, { from: 'e2', to: 'e5', san: '' })).toThrow();
    const mate = play(START_FEN, ['f2f3', 'e7e5', 'g2g4', 'd8h4']);
    expect(() => chess.apply(mate, { from: 'a2', to: 'a3', san: '' })).toThrow(/over/);
  });

  it('round-trips positions and moves, and keeps repetition history', () => {
    const s = play(START_FEN, ['g1f3', 'g8f6']);
    const back = chess.codec.state.fromJSON(JSON.parse(JSON.stringify(chess.codec.state.toJSON(s))) as Json);
    expect(back).toEqual(s);
    expect(chess.codec.state.toText(s)).toBe(s.fen);
    expect(chess.codec.action.toJSON({ from: 'e7', to: 'e8', promotion: 'q', san: 'e8=Q' })).toBe('e7e8q');
    expect(chess.codec.action.fromJSON('e2e4')).toEqual({ from: 'e2', to: 'e4', san: '' });
    expect(() => chess.codec.action.fromJSON('e9e4')).toThrow();
    expect(() => chess.codec.state.fromText('not a fen')).toThrow();
    expect(positionKey(START_FEN)).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -');
  });

  it('starts from any legal position given in the config', () => {
    const fen = '8/8/8/8/8/8/8/K1k5 w - - 0 1';
    expect(() => chess.codec.config.fromJSON({ fen: 'nonsense' })).toThrow();
    const s = chess.setup(chess.codec.config.fromJSON({ fen }), createRng('x'));
    expect(s.result).toEqual({ kind: 'insufficient' });
  });
});
