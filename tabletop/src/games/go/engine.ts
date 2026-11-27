/**
 * Go for the shared Monte Carlo tree search (src/ai/mcts.ts): a fast mutable board, a playout
 * policy guided by simple Go knowledge, and priors for the tree.
 *
 * Playouts (one move at a time, for the player to move):
 * 1. If the last move put one of our chains in atari, save it: capture an attacker that is
 *    itself in atari, or extend if that gives the chain two liberties or more.
 * 2. If the last move left the opponent's own chain in atari, capture it.
 * 3. Play a 3×3 shape pattern (patterns.ts) next to the last move.
 * 4. Otherwise a random legal move that does not fill one of our own eyes and is not a
 *    self-atari of two or more stones. With none left, pass.
 * A playout ends after two passes (or a move limit) and is counted by area, Tromp-Taylor
 * style: stones plus empty points touching one colour only. Capture-Go playouts end at the
 * capture. Each playout also adds to an ownership map, used for the territory estimate and the
 * dead-stone suggestion.
 */
import type { MctsGame, MoveLog, Prior } from '../../ai/mcts';
import type { Rng } from '../../core/rng';
import type { Color } from './board';
import { BLACK, Board, EDGE, EMPTY, opponent, WHITE } from './board';
import { matchesPattern } from './patterns';

export interface SearchPos {
  readonly board: Board;
  readonly toMove: Color;
  /** Passes in a row. */
  readonly passes: number;
  /** Moves played since the search began. */
  readonly depth: number;
}

export interface SearchRules {
  /** Komi plus any handicap compensation, added to White. */
  readonly komi: number;
  readonly suicide: boolean;
  /** Capture-Go target, 0 for ordinary Go. */
  readonly captureTarget: number;
  /** Prisoners already taken when the search starts (Capture-Go counts them). */
  readonly captured: readonly [number, number];
}

const player = (c: Color): number => (c === BLACK ? 0 : 1);

/** xorshift32: a quick generator for the playouts, seeded from the search's Rng each playout. */
class Quick {
  private x = 1;
  seed(from: Rng): void {
    this.x = (Math.floor(from.next() * 0x7fffffff) | 1) >>> 0;
  }
  /** An integer in [0, n). */
  int(n: number): number {
    let x = this.x;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.x = x >>> 0;
    return this.x % n;
  }
}

/** A scratch list of distinct points, reused so playouts do not allocate. */
class PointSet {
  readonly items: Int32Array;
  readonly mark: Int32Array;
  size = 0;
  private stamp = 1;
  constructor(cells: number) {
    this.items = new Int32Array(cells);
    this.mark = new Int32Array(cells);
  }
  clear(): void {
    this.size = 0;
    this.stamp++;
  }
  has(i: number): boolean {
    return this.mark[i] === this.stamp;
  }
  add(i: number): void {
    if (this.mark[i] === this.stamp) return;
    this.mark[i] = this.stamp;
    this.items[this.size++] = i;
  }
}

export class GoSearch implements MctsGame<SearchPos> {
  readonly moveSpace: number;
  readonly players = 2;
  /** The move number for a pass. */
  readonly pass: number;
  readonly size: number;
  /** Sum over playouts of +1 (Black owns the point at the end) or -1 (White), by padded index. */
  readonly ownership: Float64Array;
  playouts = 0;
  /** Root moves allowed by the full rules (superko); null allows every move. */
  private readonly rootMoves: ReadonlySet<number> | null;
  private readonly libs: PointSet;
  private readonly seen: PointSet;
  private readonly cand: Int32Array;
  private readonly around: Int32Array;
  private readonly limit: number;
  private readonly quick = new Quick();

  constructor(
    size: number,
    readonly rules: SearchRules,
    rootMoves: ReadonlySet<number> | null = null,
  ) {
    const probe = new Board(size);
    this.size = size;
    this.pass = probe.cells;
    this.moveSpace = probe.cells + 1;
    this.ownership = new Float64Array(probe.cells);
    this.rootMoves = rootMoves;
    this.libs = new PointSet(probe.cells);
    this.seen = new PointSet(probe.cells);
    this.cand = new Int32Array(64);
    const w = probe.width;
    this.around = Int32Array.of(-w - 1, -w, -w + 1, -1, 1, w - 1, w, w + 1);
    this.limit = size * size * 3;
  }

  toMove(s: SearchPos): number {
    return player(s.toMove);
  }

  moves(s: SearchPos): number[] {
    const b = s.board;
    const out: number[] = [];
    const c = s.toMove;
    for (let k = 0; k < b.emptyCount; k++) {
      const i = b.empties[k] as number;
      if (s.depth === 0 && this.rootMoves && !this.rootMoves.has(i)) continue;
      if (!b.isLegal(i, c, this.rules.suicide) || b.isEye(i, c)) continue;
      out.push(i);
    }
    out.sort((a, z) => a - z);
    if (s.depth > 0 || !this.rootMoves || this.rootMoves.has(this.pass)) out.push(this.pass);
    return out;
  }

  play(s: SearchPos, move: number): SearchPos {
    const board = s.board.copy();
    if (move === this.pass) {
      board.pass();
      return { board, toMove: opponent(s.toMove), passes: s.passes + 1, depth: s.depth + 1 };
    }
    board.play(move, s.toMove);
    return { board, toMove: opponent(s.toMove), passes: 0, depth: s.depth + 1 };
  }

  fork(s: SearchPos): SearchPos {
    return { ...s, board: s.board.copy() };
  }

  /** Captures so far, start included, for Capture-Go. */
  private captures(b: Board): [number, number] {
    return [this.rules.captured[0] + b.capturedBy[0], this.rules.captured[1] + b.capturedBy[1]];
  }

  terminal(s: SearchPos): readonly number[] | null {
    const target = this.rules.captureTarget;
    if (target > 0) {
      const [cb, cw] = this.captures(s.board);
      if (cb >= target || cw >= target) return cb >= target ? [1, 0] : [0, 1];
      if (s.passes >= 2) return cb === cw ? [0.5, 0.5] : cb > cw ? [1, 0] : [0, 1];
      return null;
    }
    if (s.passes >= 2) return this.result(s.board, false);
    return null;
  }

  /** Each player's reward for a finished board, counted by area. */
  result(b: Board, record: boolean): number[] {
    const w = b.width;
    const col = b.color;
    let black = 0;
    let white = 0;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const i = (y + 1) * w + x + 1;
        const c = col[i];
        let owner = 0;
        if (c === BLACK) owner = 1;
        else if (c === WHITE) owner = -1;
        else {
          let nb = false;
          let nw = false;
          const n1 = col[i - w];
          const n2 = col[i - 1];
          const n3 = col[i + 1];
          const n4 = col[i + w];
          if (n1 === BLACK || n2 === BLACK || n3 === BLACK || n4 === BLACK) nb = true;
          if (n1 === WHITE || n2 === WHITE || n3 === WHITE || n4 === WHITE) nw = true;
          if (nb && !nw) owner = 1;
          else if (nw && !nb) owner = -1;
        }
        if (owner === 1) black++;
        else if (owner === -1) white++;
        if (record) this.ownership[i] = (this.ownership[i] as number) + owner;
      }
    }
    const margin = black - white - this.rules.komi;
    return margin > 0 ? [1, 0] : margin < 0 ? [0, 1] : [0.5, 0.5];
  }

  rollout(s: SearchPos, rng: Rng, log: MoveLog): readonly number[] {
    const b = s.board;
    let c = s.toMove;
    let passes = s.passes;
    const target = this.rules.captureTarget;
    this.playouts++;
    const quick = this.quick;
    quick.seed(rng);
    for (let moves = 0; moves < this.limit && passes < 2; moves++) {
      const move = this.policy(b, c, quick);
      if (move < 0) {
        b.pass();
        passes++;
        log.record(player(c), this.pass);
      } else {
        b.play(move, c);
        passes = 0;
        log.record(player(c), move);
        if (target > 0) {
          const [cb, cw] = this.captures(b);
          if (cb >= target || cw >= target) return cb >= target ? [1, 0] : [0, 1];
        }
      }
      c = opponent(c);
    }
    if (target > 0) {
      const [cb, cw] = this.captures(b);
      return cb === cw ? [0.5, 0.5] : cb > cw ? [1, 0] : [0, 1];
    }
    return this.result(b, true);
  }

  /** Distinct liberties a stone of colour c at i would have (counted up to `limit`). */
  libertiesAfter(b: Board, i: number, c: Color, limit: number): number {
    const libs = this.libs;
    libs.clear();
    const dirs = b.dirs;
    const col = b.color;
    const opp = opponent(c);
    for (let d = 0; d < 4; d++) {
      const n = i + (dirs[d] as number);
      const nc = col[n];
      if (nc === EMPTY) libs.add(n);
      else if (nc === opp && b.inAtari(b.head[n] as number)) libs.add(n); // a capture frees the point
    }
    if (libs.size >= limit) return libs.size;
    for (let d = 0; d < 4; d++) {
      const n = i + (dirs[d] as number);
      if (col[n] !== c) continue;
      const h = b.head[n] as number;
      let s = h;
      do {
        for (let e = 0; e < 4; e++) {
          const m = s + (dirs[e] as number);
          if (m !== i && col[m] === EMPTY) {
            libs.add(m);
            if (libs.size >= limit) return libs.size;
          }
        }
        s = b.next[s] as number;
      } while (s !== h);
    }
    return libs.size;
  }

  /** True when a stone at i would leave a chain of two or more stones in atari, capturing nothing. */
  selfAtari(b: Board, i: number, c: Color): boolean {
    const dirs = b.dirs;
    const col = b.color;
    let friends = false;
    let empty = 0;
    for (let d = 0; d < 4; d++) {
      const nc = col[i + (dirs[d] as number)];
      if (nc === c) friends = true;
      else if (nc === EMPTY) empty++;
    }
    if (!friends || empty >= 2) return false;
    return this.libertiesAfter(b, i, c, 2) < 2;
  }

  /** The playout move for colour c, or -1 to pass. */
  policy(b: Board, c: Color, rng: { int(n: number): number }): number {
    const last = b.last;
    const col = b.color;
    const dirs = b.dirs;
    const opp = opponent(c);
    const suicide = this.rules.suicide;
    if (last >= 0 && col[last] !== EMPTY) {
      // 1. Our chains next to the last move, put in atari by it.
      let n = 0;
      const cand = this.cand;
      const seen = this.seen;
      seen.clear();
      for (let d = 0; d < 4; d++) {
        const nb = last + (dirs[d] as number);
        if (col[nb] !== c) continue;
        const h = b.head[nb] as number;
        if (seen.has(h) || !b.inAtari(h)) continue;
        seen.add(h);
        // Capture an attacker in atari.
        let s = h;
        do {
          for (let e = 0; e < 4; e++) {
            const m = s + (dirs[e] as number);
            if (col[m] === opp && b.inAtari(b.head[m] as number)) {
              const lib = b.atariLiberty(b.head[m] as number);
              if (n < cand.length && b.isLegal(lib, c, suicide)) cand[n++] = lib;
            }
          }
          s = b.next[s] as number;
        } while (s !== h);
        // Or run.
        const lib = b.atariLiberty(h);
        if (n < cand.length && b.isLegal(lib, c, suicide) && this.libertiesAfter(b, lib, c, 2) >= 2) cand[n++] = lib;
      }
      if (n > 0) return cand[rng.int(n)] as number;
      // 2. The last move's own chain left in atari: take it.
      if (col[last] === opp) {
        const h = b.head[last] as number;
        if (b.inAtari(h)) {
          const lib = b.atariLiberty(h);
          if (b.isLegal(lib, c, suicide)) return lib;
        }
      }
      // 3. Shape patterns around the last move.
      const w = b.width;
      const around = this.around;
      for (let k = 0; k < 8; k++) {
        const p = last + (around[k] as number);
        if (col[p] !== EMPTY) continue;
        if (!matchesPattern(col, p, w)) continue;
        if (!b.isLegal(p, c, suicide) || this.selfAtari(b, p, c)) continue;
        if (n < cand.length) cand[n++] = p;
      }
      if (n > 0) return cand[rng.int(n)] as number;
    }
    // 4. A random move that is not foolish.
    const count = b.emptyCount;
    if (count === 0) return -1;
    const start = rng.int(count);
    for (let k = 0; k < count; k++) {
      const i = b.empties[(start + k) % count] as number;
      if (!b.isLegal(i, c, suicide) || b.isEye(i, c) || this.selfAtari(b, i, c)) continue;
      return i;
    }
    return -1;
  }

  prior(s: SearchPos, move: number): Prior {
    const b = s.board;
    const c = s.toMove;
    if (move === this.pass) {
      if (s.passes > 0) return { visits: 4, value: 0.5 };
      const emptyShare = b.emptyCount / (this.size * this.size);
      return emptyShare > 0.35 ? { visits: 30, value: 0.05 } : { visits: 10, value: 0.3 };
    }
    const captures = b.capturesAt(move, c);
    if (captures > 0) return { visits: 20 + 5 * Math.min(captures, 4), value: 0.9 };
    const dirs = b.dirs;
    const col = b.color;
    // Saving one of our chains from atari.
    for (let d = 0; d < 4; d++) {
      const n = move + (dirs[d] as number);
      if (col[n] === c && b.inAtari(b.head[n] as number)) {
        return this.libertiesAfter(b, move, c, 2) >= 2 ? { visits: 20, value: 0.85 } : { visits: 20, value: 0.15 };
      }
    }
    if (this.selfAtari(b, move, c)) return { visits: 20, value: 0.1 };
    // Putting an opponent chain in atari.
    let atari = false;
    for (let d = 0; d < 4; d++) {
      const n = move + (dirs[d] as number);
      if (col[n] === opponent(c) && b.liberties(b.head[n] as number, 3).length === 2) atari = true;
    }
    const pattern = matchesPattern(col, move, b.width);
    const x = (move % b.width) - 1;
    const y = Math.floor(move / b.width) - 1;
    const edge = Math.min(x, y, this.size - 1 - x, this.size - 1 - y);
    const alone = !this.near(b, move, 2);
    if (edge === 0 && alone) return { visits: 10, value: 0.2 };
    if (pattern) return { visits: 10, value: 0.7 };
    if (atari) return { visits: 8, value: 0.65 };
    // The opening: the third and fourth lines, away from other stones, and not the second.
    if (this.size >= 9 && alone && b.emptyCount > this.size * this.size * 0.75) {
      if (edge === 2 || edge === 3) return { visits: 20, value: 0.7 };
      if (edge === 1) return { visits: 10, value: 0.3 };
    }
    return { visits: 4, value: 0.5 };
  }

  /** True when a stone stands within this many lines (Manhattan distance) of i. */
  private near(b: Board, i: number, distance: number): boolean {
    const w = b.width;
    for (let dy = -distance; dy <= distance; dy++) {
      for (let dx = -distance; dx <= distance; dx++) {
        if (Math.abs(dx) + Math.abs(dy) > distance || (dx === 0 && dy === 0)) continue;
        const j = i + dy * w + dx;
        if (j < 0 || j >= b.cells) continue;
        const c = b.color[j];
        if (c === BLACK || c === WHITE) return true;
      }
    }
    return false;
  }
}

/** Ownership per outside point, from -1 (White's) to 1 (Black's), after a search. */
export function ownershipMap(search: GoSearch, board: Board): Float64Array {
  const out = new Float64Array(search.size * search.size);
  const n = Math.max(1, search.playouts);
  for (let p = 0; p < out.length; p++) out[p] = (search.ownership[board.fromPoint(p)] as number) / n;
  return out;
}

export { EDGE };
