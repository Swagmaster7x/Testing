/**
 * Mate search, the way shogi mate problems (tsume) are set: the attacker gives check with every
 * move and the defender tries every answer. Used to generate and prove the mate problems in
 * Practice (PLAN.md 2.6: each proven, with a unique first move) and to check lesson claims.
 *
 * Lengths are in plies, as in shogi: "mate in 3" is attacker, defender, attacker.
 */
import type { Position } from './core';
import * as core from './core';

const { dropType, isDrop, PAWN, capturedOf, EMPTY, KING, typeOfCode, movingOf } = core;

export class MateBudgetExceeded extends Error {}

export interface MateLine {
  /** Plies to mate with best defence. */
  readonly plies: number;
  /** Attacker, defender, attacker, ...: the defender's longest resistance. */
  readonly line: readonly number[];
}

export class MateSolver {
  private nodes = 0;
  /** Smallest depth at which each position (attacker to move) is proven to mate. */
  private readonly proven = new Map<string, number>();
  /** Largest depth at which each position (attacker to move) is proven not to mate. */
  private readonly disproven = new Map<string, number>();
  private readonly buffer: Int32Array[] = [];

  constructor(
    readonly p: Position,
    private readonly limit = 3_000_000,
  ) {
    for (let i = 0; i < 16; i++) this.buffer.push(new Int32Array(1024));
  }

  get nodeCount(): number {
    return this.nodes;
  }

  private key(): string {
    return `${this.p.hashLo}:${this.p.hashHi}`;
  }

  private tick(): void {
    if (++this.nodes > this.limit) throw new MateBudgetExceeded('mate search budget used up');
  }

  /** Legal moves that give check, for the side to move. */
  checks(ply = 0): number[] {
    const p = this.p;
    const buffer = this.buffer[ply % this.buffer.length]!;
    const count = p.generate(buffer);
    const out: number[] = [];
    for (let i = 0; i < count; i++) {
      const m = buffer[i]!;
      if (!p.isLegal(m)) continue;
      p.make(m);
      const check = p.inCheck();
      p.unmake(m);
      if (check) out.push(m);
    }
    return out;
  }

  /** Every legal move, with answers that capture or move the king first. */
  answers(ply = 0): number[] {
    const p = this.p;
    const buffer = this.buffer[ply % this.buffer.length]!;
    const count = p.generate(buffer);
    const out: number[] = [];
    for (let i = 0; i < count; i++) if (p.isLegal(buffer[i]!)) out.push(buffer[i]!);
    const rank = (m: number) => (isDrop(m) ? 2 : capturedOf(m) !== EMPTY || typeOfCode(movingOf(m)) === KING ? 0 : 1);
    return out.sort((a, b) => rank(a) - rank(b));
  }

  /** True when the side to move (the attacker) mates within `depth` plies. */
  attack(depth: number, ply = 0): boolean {
    if (depth < 1) return false;
    const key = this.key();
    const proven = this.proven.get(key);
    if (proven !== undefined && proven <= depth) return true;
    const disproven = this.disproven.get(key);
    if (disproven !== undefined && disproven >= depth) return false;
    this.tick();
    const p = this.p;
    for (const m of this.checks(ply)) {
      p.make(m);
      const mated = this.defend(depth - 1, ply + 1);
      p.unmake(m);
      if (mated) {
        if (proven === undefined || depth < proven) this.proven.set(key, depth);
        return true;
      }
    }
    if (disproven === undefined || depth > disproven) this.disproven.set(key, depth);
    return false;
  }

  /** True when every answer of the side to move (in check) is mated within `depth` plies. */
  defend(depth: number, ply = 0): boolean {
    this.tick();
    const p = this.p;
    const answers = this.answers(ply);
    if (answers.length === 0) return true;
    if (depth < 2) return false;
    for (const m of answers) {
      p.make(m);
      const mated = this.attack(depth - 1, ply + 1);
      p.unmake(m);
      if (!mated) return false;
    }
    return true;
  }

  /** The shortest forced mate within `maxPlies`, or null. */
  shortest(maxPlies: number): number | null {
    for (let d = 1; d <= maxPlies; d += 2) if (this.attack(d)) return d;
    return null;
  }

  /** The attacker's first moves that force mate within `plies`. */
  mateMoves(plies: number): number[] {
    const p = this.p;
    const out: number[] = [];
    for (const m of this.checks()) {
      p.make(m);
      const mated = this.defend(plies - 1, 1);
      p.unmake(m);
      if (mated) out.push(m);
    }
    return out;
  }

  /** Plies to mate after the defender's answer (attacker to move), at most `limit`. */
  private remaining(limit: number): number | null {
    for (let d = 1; d <= limit; d += 2) if (this.attack(d)) return d;
    return null;
  }

  /**
   * The main line of a mate within `plies`: the attacker's move, then the defender's longest
   * resistance (preferring answers that do not just drop a piece in the way), and so on.
   * Also reports whether the attacker's move was the only one at each turn before the last.
   */
  mainLine(plies: number): { line: number[]; unique: boolean } | null {
    const p = this.p;
    const line: number[] = [];
    let unique = true;
    let depth = plies;
    const played: number[] = [];
    try {
      while (depth >= 1) {
        const moves = this.mateMoves(depth);
        if (moves.length === 0) return null;
        // Prefer the move that mates soonest, so the line is the shortest one.
        let move = moves[0]!;
        if (depth > 1 && moves.length > 1) unique = false;
        if (depth === 1) {
          line.push(move);
          break;
        }
        line.push(move);
        p.make(move);
        played.push(move);
        // The defender's answer that lasts longest.
        let bestAnswer = -1;
        let bestLength = -1;
        let bestRank = 99;
        for (const answer of this.answers()) {
          p.make(answer);
          const length = this.remaining(depth - 2);
          p.unmake(answer);
          if (length === null) return null;
          const rank = isDrop(answer) ? 1 : 0;
          if (length > bestLength || (length === bestLength && rank < bestRank)) {
            bestLength = length;
            bestRank = rank;
            bestAnswer = answer;
          }
        }
        if (bestAnswer < 0) break;
        line.push(bestAnswer);
        p.make(bestAnswer);
        played.push(bestAnswer);
        depth = bestLength;
        move = 0;
      }
    } finally {
      for (let i = played.length - 1; i >= 0; i--) p.unmake(played[i]!);
    }
    return { line, unique };
  }
}

/** True when the move is a pawn drop (pawn drops cannot mate: uchifuzume). */
export function isPawnDrop(m: number): boolean {
  return isDrop(m) && dropType(m) === PAWN;
}
