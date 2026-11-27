/**
 * Principal-variation search for games with a mutable position and packed integer moves: the
 * fast alpha-beta for board games too big for `alphabeta.ts` (shogi now, Chinese checkers next).
 *
 * Iterative deepening, a transposition table, check extensions, null-move pruning, late-move
 * reductions, killer and history move ordering, and a quiescence search whose moves the game
 * chooses (captures and promotions; shogi adds checking drops near the king). Strength is set by
 * a node budget and a depth limit, never by time, so a search gives the same answer on a phone
 * and in tests. The first iteration always finishes; later ones stop when the budget runs out.
 */

export interface PvsGame {
  /**
   * Fills `out` with candidate moves for the side to move and returns how many. With `tactical`
   * set, only the moves quiescence should try (`qply` counts quiescence plies from the horizon).
   * Candidates may be pseudo-legal: `make` refuses the illegal ones.
   */
  generate(out: Int32Array, tactical: boolean, qply: number): number;
  /** Plays a move, or returns false and leaves the position as it was when it is illegal. */
  make(move: number): boolean;
  unmake(move: number): void;
  makeNull(): void;
  unmakeNull(): void;
  inCheck(): boolean;
  /** Static score for the side to move. Keep it well inside ±MATE_BOUND. */
  evaluate(): number;
  hashLo(): number;
  hashHi(): number;
  /** The score when the current position repeats an earlier one (from the side to move), or null. */
  repetition(ply: number): number | null;
  /** The score when the side to move has no legal move. */
  noMoves(ply: number, inCheck: boolean): number;
  /** Ordering bonus for captures and promotions; 0 for quiet moves. */
  tacticalScore(move: number): number;
  /** A generous estimate of what a move can gain, for delta pruning in quiescence. */
  gain(move: number): number;
}

export interface PvsLimits {
  readonly maxDepth: number;
  readonly nodes: number;
  /** Search every root move with a full window, so each gets an exact score (weak levels, analysis). */
  readonly exactRoot?: boolean;
  /** Root moves to leave out (for a second-best line). */
  readonly exclude?: readonly number[];
  /** Quiescence plies at most. */
  readonly quiescence?: number;
}

export interface PvsScored {
  readonly move: number;
  readonly score: number;
}

export interface PvsResult {
  readonly best: number;
  readonly score: number;
  readonly depth: number;
  readonly nodes: number;
  /** Root moves best first; exact scores with `exactRoot`, otherwise only the first is exact. */
  readonly scored: readonly PvsScored[];
  readonly pv: readonly number[];
  readonly complete: boolean;
}

export const MATE = 32_000;
export const MATE_BOUND = MATE - 1_000;
const INF = MATE + 1;
const MAX_PLY = 96;
const MOVES_PER_PLY = 1_024;
/** Moves picked one by one before the rest are sorted in one go. */
const SELECT_FIRST = 3;

export const isMateScore = (score: number): boolean => Math.abs(score) >= MATE_BOUND;
/** Plies to mate for a mate score (positive when the side to move mates). */
export const matePlies = (score: number): number => MATE - Math.abs(score);

const NULL_MOVE = -1;
const EXACT = 1;
const LOWER = 2;
const UPPER = 3;

class OutOfBudget extends Error {}
const OUT = new OutOfBudget('node budget used up');

/** A fixed-size transposition table in typed arrays, reused between searches. */
class Table {
  readonly mask: number;
  readonly check: Int32Array;
  readonly move: Int32Array;
  readonly score: Int32Array;
  readonly info: Int16Array;

  constructor(bitsCount: number) {
    const size = 1 << bitsCount;
    this.mask = size - 1;
    this.check = new Int32Array(size);
    this.move = new Int32Array(size);
    this.score = new Int32Array(size);
    this.info = new Int16Array(size);
  }

  clear(): void {
    this.info.fill(0);
  }
}

const toTable = (score: number, ply: number) => (score >= MATE_BOUND ? score + ply : score <= -MATE_BOUND ? score - ply : score);
const fromTable = (score: number, ply: number) => (score >= MATE_BOUND ? score - ply : score <= -MATE_BOUND ? score + ply : score);

export class PvsSearcher {
  private readonly table: Table;
  private readonly buffers: Int32Array[] = [];
  private readonly order: Int32Array[] = [];
  private readonly killers = new Int32Array(MAX_PLY * 2);
  private readonly history = new Int32Array(1 << 16);
  private nodes = 0;
  private budget = 0;
  private budgeted = false;
  private maxQ = 8;
  private game: PvsGame | null = null;
  /** Moves made below the root, so an aborted search can put the position back. */
  private readonly path = new Int32Array(MAX_PLY * 2 + 8);
  private readonly scratch = new Float64Array(MOVES_PER_PLY);
  private readonly tmpMoves = new Int32Array(MOVES_PER_PLY);
  private readonly tmpKeys = new Int32Array(MOVES_PER_PLY);
  private pathLength = 0;

  constructor(tableBits = 18) {
    this.table = new Table(tableBits);
    for (let i = 0; i < MAX_PLY + 1; i++) {
      this.buffers.push(new Int32Array(MOVES_PER_PLY));
      this.order.push(new Int32Array(MOVES_PER_PLY));
    }
  }

  search(game: PvsGame, limits: PvsLimits): PvsResult {
    this.game = game;
    this.table.clear();
    this.killers.fill(0);
    this.history.fill(0);
    this.nodes = 0;
    this.budget = limits.nodes;
    this.budgeted = false;
    this.pathLength = 0;
    this.maxQ = limits.quiescence ?? 8;
    const rootBuffer = this.buffers[0]!;
    const count = game.generate(rootBuffer, false, 0);
    const excluded = new Set(limits.exclude ?? []);
    let root: number[] = [];
    for (let i = 0; i < count; i++) {
      const m = rootBuffer[i]!;
      if (excluded.has(m) || !game.make(m)) continue;
      game.unmake(m);
      root.push(m);
    }
    if (root.length === 0) throw new Error('The search needs a position with a legal move');
    // Captures and promotions first on the first iteration.
    root.sort((a, b) => game.tacticalScore(b) - game.tacticalScore(a));

    let finished: PvsScored[] = [];
    let finishedDepth = 0;
    let complete = true;
    for (let depth = 1; depth <= Math.max(1, limits.maxDepth); depth++) {
      this.budgeted = depth > 1;
      try {
        const scored = limits.exactRoot ? this.exactRoot(root, depth) : this.pvsRoot(root, depth);
        const sorted = [...scored].sort((a, b) => b.score - a.score);
        finished = sorted;
        finishedDepth = depth;
        root = sorted.map((s) => s.move);
        if (isMateScore(sorted[0]!.score)) break;
      } catch (err) {
        this.unwind();
        if (err === OUT) {
          complete = false;
          break;
        }
        throw err;
      }
    }
    const best = finished[0]!;
    return { best: best.move, score: best.score, depth: finishedDepth, nodes: this.nodes, scored: finished, pv: this.principalVariation(best.move), complete };
  }

  private play(move: number): boolean {
    if (!this.game!.make(move)) return false;
    this.path[this.pathLength++] = move;
    return true;
  }

  private undo(move: number): void {
    this.pathLength--;
    this.game!.unmake(move);
  }

  private playNull(): void {
    this.game!.makeNull();
    this.path[this.pathLength++] = NULL_MOVE;
  }

  private undoNull(): void {
    this.pathLength--;
    this.game!.unmakeNull();
  }

  /** Takes back every move still made, after the budget ran out mid-search. */
  private unwind(): void {
    const game = this.game!;
    while (this.pathLength > 0) {
      const move = this.path[--this.pathLength]!;
      if (move === NULL_MOVE) game.unmakeNull();
      else game.unmake(move);
    }
  }

  private exactRoot(root: readonly number[], depth: number): PvsScored[] {
    return root.map((move) => {
      this.play(move);
      const score = -this.negamax(depth - 1, -INF, INF, 1, true);
      this.undo(move);
      return { move, score };
    });
  }

  private pvsRoot(root: readonly number[], depth: number): PvsScored[] {
    let alpha = -INF;
    const out: PvsScored[] = [];
    root.forEach((move, i) => {
      this.play(move);
      let score: number;
      if (i === 0) score = -this.negamax(depth - 1, -INF, -alpha, 1, true);
      else {
        score = -this.negamax(depth - 1, -alpha - 1, -alpha, 1, true);
        if (score > alpha) score = -this.negamax(depth - 1, -INF, -alpha, 1, true);
      }
      this.undo(move);
      // Moves that failed low only have an upper bound; keep them in order behind the best.
      out.push({ move, score: i === 0 || score > alpha ? score : Math.min(score, alpha - 1 - i) });
      if (score > alpha) alpha = score;
    });
    return out;
  }

  private principalVariation(first: number): number[] {
    const game = this.game!;
    const line = [first];
    const played: number[] = [];
    if (!game.make(first)) return line;
    played.push(first);
    const seen = new Set<string>();
    while (line.length < 12) {
      const key = `${game.hashLo()}:${game.hashHi()}`;
      if (seen.has(key)) break;
      seen.add(key);
      const slot = game.hashLo() & this.table.mask;
      if (this.table.info[slot] === 0 || this.table.check[slot] !== game.hashHi()) break;
      const move = this.table.move[slot]!;
      if (move === 0 || !this.isCandidate(move) || !game.make(move)) break;
      line.push(move);
      played.push(move);
    }
    for (let i = played.length - 1; i >= 0; i--) game.unmake(played[i]!);
    return line;
  }

  private isCandidate(move: number): boolean {
    const buffer = this.buffers[MAX_PLY]!;
    const n = this.game!.generate(buffer, false, 0);
    for (let i = 0; i < n; i++) if (buffer[i] === move) return true;
    return false;
  }

  /** Sorts moves [from, count) by key, best first. */
  private sortRest(buffer: Int32Array, keys: Int32Array, from: number, count: number): void {
    const n = count - from;
    if (n <= 1) return;
    const scratch = this.scratch.subarray(0, n);
    for (let i = 0; i < n; i++) scratch[i] = keys[from + i]! * 2048 + i;
    scratch.sort();
    for (let i = 0; i < n; i++) {
      const index = scratch[n - 1 - i]! % 2048;
      this.tmpMoves[i] = buffer[from + index]!;
      this.tmpKeys[i] = keys[from + index]!;
    }
    buffer.set(this.tmpMoves.subarray(0, n), from);
    keys.set(this.tmpKeys.subarray(0, n), from);
  }

  private tick(): void {
    this.nodes++;
    if (this.budgeted && this.nodes > this.budget) throw OUT;
  }

  private historySlot(move: number): number {
    return (Math.imul(move & 0x3fffff, 0x9e3779b1) >>> 16) & 0xffff;
  }

  private negamax(depthIn: number, alphaIn: number, betaIn: number, ply: number, nullOk: boolean): number {
    const game = this.game!;
    this.tick();
    let alpha = alphaIn;
    let beta = betaIn;
    const repeated = game.repetition(ply);
    if (repeated !== null) return repeated;
    // Mate distance pruning.
    alpha = Math.max(alpha, -MATE + ply);
    beta = Math.min(beta, MATE - ply - 1);
    if (alpha >= beta) return alpha;
    const inCheck = game.inCheck();
    let depth = depthIn;
    if (inCheck && ply < MAX_PLY / 2) depth++;
    if (depth <= 0 || ply >= MAX_PLY - 1) return this.quiesce(alpha, beta, ply, 0);

    const lo = game.hashLo();
    const hi = game.hashHi();
    const slot = lo & this.table.mask;
    let ttMove = 0;
    const info = this.table.info[slot]!;
    if (info !== 0 && this.table.check[slot] === hi) {
      ttMove = this.table.move[slot]!;
      const storedDepth = info >> 2;
      const bound = info & 3;
      if (storedDepth >= depth) {
        const score = fromTable(this.table.score[slot]!, ply);
        if (bound === EXACT) return score;
        if (bound === LOWER && score >= beta) return score;
        if (bound === UPPER && score <= alpha) return score;
      }
    }

    const pvNode = beta - alpha > 1;
    if (nullOk && !pvNode && !inCheck && depth >= 3 && game.evaluate() >= beta) {
      this.playNull();
      const score = -this.negamax(depth - 3, -beta, -beta + 1, ply + 1, false);
      this.undoNull();
      if (score >= beta) return isMateScore(score) ? beta : score;
    }

    const buffer = this.buffers[ply]!;
    const keys = this.order[ply]!;
    const count = game.generate(buffer, false, 0);
    const k1 = this.killers[ply * 2]!;
    const k2 = this.killers[ply * 2 + 1]!;
    for (let i = 0; i < count; i++) {
      const m = buffer[i]!;
      if (m === ttMove) keys[i] = 1 << 30;
      else {
        const tactical = game.tacticalScore(m);
        if (tactical > 0) keys[i] = (1 << 28) + tactical;
        else if (m === k1) keys[i] = (1 << 27) + 1;
        else if (m === k2) keys[i] = 1 << 27;
        else keys[i] = this.history[this.historySlot(m)]!;
      }
    }

    let best = -INF;
    let bestMove = 0;
    let legal = 0;
    for (let i = 0; i < count; i++) {
      if (i < SELECT_FIRST) {
        // Selection sort for the first few: most cut-offs come from the first moves tried.
        let pick = i;
        for (let j = i + 1; j < count; j++) if (keys[j]! > keys[pick]!) pick = j;
        const m = buffer[pick]!;
        const key = keys[pick]!;
        buffer[pick] = buffer[i]!;
        keys[pick] = keys[i]!;
        buffer[i] = m;
        keys[i] = key;
      } else if (i === SELECT_FIRST) this.sortRest(buffer, keys, i, count);
      const m = buffer[i]!;
      const key = keys[i]!;
      if (!this.play(m)) continue;
      legal++;
      let score: number;
      if (legal === 1) score = -this.negamax(depth - 1, -beta, -alpha, ply + 1, true);
      else {
        let reduce = 0;
        const quiet = key < 1 << 27;
        if (depth >= 3 && legal > 3 && quiet && !inCheck && !game.inCheck()) reduce = legal > 10 && depth >= 5 ? 2 : 1;
        score = -this.negamax(depth - 1 - reduce, -alpha - 1, -alpha, ply + 1, true);
        if (score > alpha && reduce > 0) score = -this.negamax(depth - 1, -alpha - 1, -alpha, ply + 1, true);
        if (score > alpha && score < beta) score = -this.negamax(depth - 1, -beta, -alpha, ply + 1, true);
      }
      this.undo(m);
      if (score > best) {
        best = score;
        bestMove = m;
        if (score > alpha) {
          alpha = score;
          if (score >= beta) {
            if (key < 1 << 28) {
              if (m !== k1) {
                this.killers[ply * 2 + 1] = k1;
                this.killers[ply * 2] = m;
              }
              const h = this.historySlot(m);
              this.history[h] = Math.min(1 << 26, this.history[h]! + depth * depth);
            }
            break;
          }
        }
      }
    }
    if (legal === 0) return game.noMoves(ply, inCheck);

    const bound = best <= alphaIn ? UPPER : best >= beta ? LOWER : EXACT;
    this.table.check[slot] = hi;
    this.table.move[slot] = bestMove;
    this.table.score[slot] = toTable(best, ply);
    this.table.info[slot] = (Math.min(depth, 4_000) << 2) | bound;
    return best;
  }

  private quiesce(alphaIn: number, beta: number, ply: number, qply: number): number {
    const game = this.game!;
    this.tick();
    let alpha = alphaIn;
    if (ply > 0) {
      const repeated = game.repetition(ply);
      if (repeated !== null) return repeated;
    }
    const inCheck = game.inCheck();
    let best: number;
    let stand = 0;
    if (inCheck) best = -MATE + ply;
    else {
      stand = game.evaluate();
      if (stand >= beta || qply >= this.maxQ || ply >= MAX_PLY - 1) return stand;
      if (stand > alpha) alpha = stand;
      best = stand;
    }
    if (ply >= MAX_PLY - 1) return best;
    const buffer = this.buffers[ply]!;
    const keys = this.order[ply]!;
    const count = game.generate(buffer, !inCheck, qply);
    for (let i = 0; i < count; i++) keys[i] = game.tacticalScore(buffer[i]!);
    let legal = 0;
    for (let i = 0; i < count; i++) {
      let pick = i;
      for (let j = i + 1; j < count; j++) if (keys[j]! > keys[pick]!) pick = j;
      const m = buffer[pick]!;
      buffer[pick] = buffer[i]!;
      keys[pick] = keys[i]!;
      buffer[i] = m;
      if (!inCheck && stand + game.gain(m) < alpha) continue;
      if (!this.play(m)) continue;
      legal++;
      const score = -this.quiesce(-beta, -alpha, ply + 1, qply + 1);
      this.undo(m);
      if (score > best) {
        best = score;
        if (score > alpha) {
          alpha = score;
          if (score >= beta) break;
        }
      }
    }
    if (inCheck && legal === 0) return game.noMoves(ply, true);
    return best;
  }
}
