/**
 * The engine checks behind the chess lesson linter: legal positions, "best move" claims by an
 * engine margin, and an engine that plays both sides of free play. The engine is passed in, so
 * the linter can use Stockfish in Node with a cache.
 */
import type { Square } from 'chess.js';
import type { Engine } from '../../../ai/uci';
import { scoreValue } from '../../../ai/uci';
import type { LessonVerifier } from '../../../teach/lint';
import type { ChessState } from '../rules';
import { chessAt, SQUARES } from '../rules';
import { chessLessonGame } from './game';

/** Search size for a "best move" claim, spread over every legal move. */
export const CLAIM_NODES = 1_000_000;
/** Search size for each move of free play, for both sides. */
export const FREE_PLAY_NODES = 300_000;
/** A "best" move must beat every other move by this much, in centipawns. */
export const BEST_MARGIN = 150;
/** Accepted moves may trail the engine's top move by this much and still count as equal. */
export const EQUAL_MARGIN = 60;

const MATE = 50_000;

function show(value: number): string {
  if (value >= MATE) return `mate in ${Math.round((100_000 - value) / 100)}`;
  if (value <= -MATE) return `mated in ${Math.round((100_000 + value) / 100)}`;
  return `${value >= 0 ? '+' : ''}${(value / 100).toFixed(2)}`;
}

function equal(a: number, b: number): boolean {
  return (a >= MATE && b >= MATE) || Math.abs(a - b) <= EQUAL_MARGIN;
}

export function chessPositionProblems(fen: string): string[] {
  const problems: string[] = [];
  const board = chessAt(fen);
  const parts = fen.split(' ');
  const toMove = parts[1] === 'b' ? 'b' : 'w';
  const other = toMove === 'w' ? 'b' : 'w';
  for (const sq of SQUARES) {
    const p = board.get(sq);
    if (!p) continue;
    if (p.type === 'p' && (sq[1] === '1' || sq[1] === '8')) problems.push(`a pawn stands on ${sq}`);
    if (p.type === 'k' && p.color === other && board.isAttacked(sq, toMove)) problems.push('the side not to move is in check');
  }
  const has = (sq: Square, color: 'w' | 'b', type: string) => {
    const p = board.get(sq);
    return p?.color === color && p.type === type;
  };
  const castling = parts[2] ?? '-';
  const needs: Record<string, [Square, Square, 'w' | 'b']> = { K: ['e1', 'h1', 'w'], Q: ['e1', 'a1', 'w'], k: ['e8', 'h8', 'b'], q: ['e8', 'a8', 'b'] };
  for (const right of castling === '-' ? [] : castling.split('')) {
    const need = needs[right];
    if (!need) problems.push(`unknown castling right ${right}`);
    else if (!has(need[0], need[2], 'k') || !has(need[1], need[2], 'r')) problems.push(`castling right ${right} without the king and rook at home`);
  }
  return problems;
}

export function chessVerifier(engine: Engine): LessonVerifier<ChessState> {
  return {
    positionProblems: (state) => chessPositionProblems(state.fen),

    async checkBest(state, accept) {
      const legal = chessLessonGame.moves(state);
      const accepted = accept.map((m) => chessLessonGame.canonical(state, m) ?? m);
      const result = await engine.search({ fen: state.fen, nodes: CLAIM_NODES, multiPv: Math.min(legal.length, 128) });
      const scores = new Map<string, number>();
      for (const line of result.lines) if (line.pv[0]) scores.set(line.pv[0], scoreValue(line.score));
      const missing = legal.filter((m) => !scores.has(m));
      if (missing.length > 0) return [`claim "best": the engine did not score ${missing.join(' ')}`];
      const top = Math.max(...scores.values());
      const topMove = [...scores].find(([, v]) => v === top)?.[0] ?? '';
      const problems: string[] = [];
      for (const m of accepted) {
        const v = scores.get(m) ?? -Infinity;
        if (v < top && !equal(v, top)) problems.push(`claim "best": ${m} (${show(v)}) is worse than ${topMove} (${show(top)})`);
      }
      const worstAccepted = Math.min(...accepted.map((m) => scores.get(m) ?? -Infinity));
      const rivals = [...scores].filter(([m]) => !accepted.includes(m)).sort((a, b) => b[1] - a[1]);
      const rival = rivals[0];
      if (rival && worstAccepted - rival[1] < BEST_MARGIN && !(worstAccepted >= MATE && rival[1] < MATE)) {
        problems.push(`claim "best": ${rival[0]} (${show(rival[1])}) is nearly as good as ${accepted.join('/')} (${show(worstAccepted)}); accept it or change the position`);
      }
      return problems;
    },

    async freePlayMove(state) {
      const result = await engine.search({ fen: state.fen, nodes: FREE_PLAY_NODES });
      return result.bestmove;
    },
  };
}
