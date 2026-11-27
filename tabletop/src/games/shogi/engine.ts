/**
 * The shogi engine: an evaluation (material, king safety, piece placement) and the position as
 * a PvsGame for the shared principal-variation search in src/ai/pvs.ts. Quiescence tries captures,
 * promotions and, at the horizon, drops that check the king from close by (PLAN.md 2.4).
 *
 * Scores are in centipawn-like units, a pawn about 90. Strength comes from node budgets only.
 */
import type { PvsGame, PvsLimits, PvsResult } from '../../ai/pvs';
import { MATE, PvsSearcher } from '../../ai/pvs';
import type { Color, Position } from './core';
import * as core from './core';

// Bound once: imported bindings can cost a getter call each in some module loaders (tsx, Vitest),
// and these are read millions of times per search.
const {
  BASE,
  BISHOP,
  capturedOf,
  colorOfCode,
  DRAGON,
  dropType,
  EMPTY,
  encodeDrop,
  GOLD,
  HAND_TYPES,
  HORSE,
  isDrop,
  isPromotion,
  KING,
  KNIGHT,
  LANCE,
  movingOf,
  parseSfen,
  PAWN,
  pieceCode,
  PRO_SILVER,
  PROMOTED,
  ROOK,
  SILVER,
  SLIDE_MASK,
  STEP_MASK,
  TOKIN,
  typeOfCode,
  WALL,
} = core;

/** Piece values on the board, by type (standard board). */
export const VALUE = [90, 240, 260, 370, 450, 570, 650, 0, 530, 490, 510, 500, 830, 950];
/** Values in hand: a little more, since a piece in hand can go anywhere. */
export const HAND_VALUE = [105, 265, 290, 410, 500, 640, 740];
/** Mini-shogi: rook and bishop are weaker on a small board, the generals stronger. */
const VALUE_MINI = [110, 0, 0, 480, 530, 520, 620, 0, 560, 0, 0, 540, 760, 860];
const HAND_VALUE_MINI = [130, 0, 0, 520, 580, 580, 680];

/** Pressure an enemy piece near the king adds, by type. */
const NEAR_KING = [12, 16, 26, 30, 32, 40, 46, 0, 32, 32, 32, 32, 60, 72];
/** Weight of the pieces the opponent holds in hand, for king danger. */
const HAND_DANGER = [4, 7, 10, 14, 16, 22, 26];

const DRAW = 0;
/** Mini-shogi repetition: the first player loses, which the search treats as nearly a mate. */
const REPETITION_LOSS = 15_000;
/** Perpetual check loses for the checker. */
const PERPETUAL_LOSS = 20_000;

export interface EngineHistory {
  /** Hashes of earlier positions in the game, oldest first, as [lo, hi] pairs. */
  readonly hashes: readonly (readonly [number, number])[];
  /** Whether the move that reached each earlier position gave check. */
  readonly checks: readonly boolean[];
}

/** The position as a PvsGame: legality on make, repetition against the game and the search path. */
export class ShogiSearch implements PvsGame {
  readonly p: Position;
  private readonly lo: number[] = [];
  private readonly hi: number[] = [];
  private readonly check: boolean[] = [];
  private readonly values: readonly number[];
  private readonly handValues: readonly number[];
  private readonly kind: 'standard' | 'mini';
  /** The colour that moved first in the game (mini-shogi repetition loses for it). */
  private readonly first: Color;
  private readonly checkDrops: boolean;
  private readonly noise: number;
  private readonly salt: number;

  constructor(p: Position, history: EngineHistory | null, first: Color, options: SearchFlavour = {}) {
    this.p = p;
    this.kind = p.geo.kind;
    this.values = this.kind === 'mini' ? VALUE_MINI : VALUE;
    this.handValues = this.kind === 'mini' ? HAND_VALUE_MINI : HAND_VALUE;
    this.first = first;
    this.checkDrops = options.checkDrops ?? true;
    this.noise = Math.max(0, Math.round(options.noise ?? 0));
    this.salt = options.salt ?? 0;
    for (const [i, [lo, hi]] of (history?.hashes ?? []).entries()) {
      this.lo.push(lo);
      this.hi.push(hi);
      this.check.push(history?.checks[i] ?? false);
    }
    // The current position is the last entry of the path.
    this.lo.push(p.hashLo);
    this.hi.push(p.hashHi);
    this.check.push(p.inCheck());
  }

  generate(out: Int32Array, tactical: boolean, qply: number): number {
    const p = this.p;
    if (!tactical) return p.generate(out);
    let n = p.generateBoardMoves(out, 0, false);
    // Keep captures and promotions only.
    let k = 0;
    for (let i = 0; i < n; i++) {
      const m = out[i]!;
      if (capturedOf(m) !== EMPTY || isPromotion(m)) out[k++] = m;
    }
    n = k;
    if (qply === 0 && this.checkDrops) n = this.generateCheckDrops(out, n);
    return n;
  }

  /** Drops (other than pawns) that check the enemy king from within two squares. */
  private generateCheckDrops(out: Int32Array, start: number): number {
    const p = this.p;
    const side = p.side;
    const king = p.kings[1 - side]!;
    if (king < 0) return start;
    const geo = p.geo;
    const kf = geo.fileOf[king]!;
    const kr = geo.rankOf[king]!;
    let n = start;
    for (let type = 1; type < HAND_TYPES; type++) {
      if (p.handCount(side, type) === 0) continue;
      const code = pieceCode(side, type);
      for (let df = -2; df <= 2; df++) {
        for (let dr = -2; dr <= 2; dr++) {
          const f = kf + df;
          const r = kr + dr;
          if (f < 1 || f > geo.files || r < 1 || r > geo.ranks || (df === 0 && dr === 0)) continue;
          const sq = (r + 1) * geo.stride + (geo.files - f) + 1;
          if (p.board[sq] !== EMPTY) continue;
          if (!p.pieceAttacks(code, sq, king)) continue;
          if (type === KNIGHT || type === LANCE) {
            const fromEnd = side === 0 ? r - 1 : geo.ranks - r;
            if (fromEnd < (type === KNIGHT ? 2 : 1)) continue;
          }
          if (n < out.length) out[n++] = encodeDrop(type, sq, side);
        }
      }
    }
    return n;
  }

  make(move: number): boolean {
    const p = this.p;
    if (isDrop(move) && dropType(move) === PAWN && p.isPawnDropMate(move)) return false;
    const side = p.side;
    p.make(move);
    if (p.kingAttacked(side)) {
      p.unmake(move);
      return false;
    }
    this.lo.push(p.hashLo);
    this.hi.push(p.hashHi);
    this.check.push(p.inCheck());
    return true;
  }

  unmake(move: number): void {
    this.lo.pop();
    this.hi.pop();
    this.check.pop();
    this.p.unmake(move);
  }

  makeNull(): void {
    this.p.makeNull();
    this.lo.push(this.p.hashLo);
    this.hi.push(this.p.hashHi);
    this.check.push(false);
  }

  unmakeNull(): void {
    this.lo.pop();
    this.hi.pop();
    this.check.pop();
    this.p.unmakeNull();
  }

  inCheck(): boolean {
    // Worked out once, when the position was reached.
    return this.check[this.check.length - 1] ?? false;
  }

  hashLo(): number {
    return this.p.hashLo;
  }

  hashHi(): number {
    return this.p.hashHi;
  }

  repetition(): number | null {
    const last = this.lo.length - 1;
    const lo = this.lo[last]!;
    const hi = this.hi[last]!;
    // Same side to move: look back two plies at a time.
    for (let i = last - 2; i >= 0; i -= 2) {
      if (this.lo[i] !== lo || this.hi[i] !== hi) continue;
      // Who checked with every move since then? Index j was reached by the side not to move now
      // when (last - j) is even... the mover of position j is the side to move at j - 1.
      let moverChecks = true; // the side that just moved (opponent of the side to move)
      let ownChecks = true;
      for (let j = i + 1; j <= last; j++) {
        const byOpponent = (last - j) % 2 === 0;
        if (!this.check[j]) {
          if (byOpponent) moverChecks = false;
          else ownChecks = false;
        }
      }
      if (moverChecks && !ownChecks) return PERPETUAL_LOSS;
      if (ownChecks && !moverChecks) return -PERPETUAL_LOSS;
      if (this.kind === 'mini') return this.p.side === this.first ? -REPETITION_LOSS : REPETITION_LOSS;
      return DRAW;
    }
    return null;
  }

  noMoves(ply: number): number {
    // Shogi has no stalemate: a player without a legal move has lost.
    return -MATE + ply;
  }

  tacticalScore(move: number): number {
    const captured = capturedOf(move);
    let score = 0;
    if (captured !== EMPTY) score += 16 * this.values[typeOfCode(captured)]! + 1_000 - (this.values[typeOfCode(movingOf(move))]! >> 3);
    if (isPromotion(move)) score += 300 + this.values[PROMOTED[typeOfCode(movingOf(move))]!]! - this.values[typeOfCode(movingOf(move))]!;
    if (isDrop(move)) score += 50;
    return score;
  }

  gain(move: number): number {
    if (isDrop(move)) return MATE;
    const captured = capturedOf(move);
    let gain = 120;
    if (captured !== EMPTY) gain += this.values[typeOfCode(captured)]! + this.handValues[BASE[typeOfCode(captured)]!]!;
    if (isPromotion(move)) gain += this.values[PROMOTED[typeOfCode(movingOf(move))]!]! - this.values[typeOfCode(movingOf(move))]!;
    return gain;
  }

  evaluate(): number {
    const score = evaluate(this.p);
    if (this.noise === 0) return score;
    // A small, repeatable wobble per position and per game, so strong levels vary their play.
    const spread = 2 * this.noise + 1;
    return score + ((Math.imul(this.p.hashLo ^ this.salt, 0x9e3779b1) >>> 0) % spread) - this.noise;
  }
}

export interface SearchFlavour {
  /** Whether quiescence tries checking drops near the king. */
  readonly checkDrops?: boolean;
  /** Up to this much random wobble in each evaluation (engine units); 0 for none. */
  readonly noise?: number;
  /** Seeds the wobble. */
  readonly salt?: number;
}

/** Static evaluation from the side to move's point of view. */
export function evaluate(p: Position): number {
  const geo = p.geo;
  const mini = geo.kind === 'mini';
  const values = mini ? VALUE_MINI : VALUE;
  const handValues = mini ? HAND_VALUE_MINI : HAND_VALUE;
  const board = p.board;
  const kings = p.kings;
  const kingFile = [geo.fileOf[kings[0]!] ?? 0, geo.fileOf[kings[1]!] ?? 0];
  const kingRank = [geo.rankOf[kings[0]!] ?? 0, geo.rankOf[kings[1]!] ?? 0];
  const score = [0, 0];
  const shelter = [0, 0];
  const pressure = [0, 0];
  const delta = geo.delta;

  for (const sq of geo.squares) {
    const code = board[sq]!;
    if (code === EMPTY) continue;
    const color = colorOfCode(code);
    const enemy = 1 - color;
    const type = typeOfCode(code);
    score[color]! += values[type]!;
    const file = geo.fileOf[sq]!;
    const rank = geo.rankOf[sq]!;
    // Ranks from the owner's own back rank: 0 at home.
    const advance = color === 0 ? geo.ranks - rank : rank - 1;
    if (type === KING) {
      if (!mini) {
        // A king tucked away at the back, off the centre, is safer.
        score[color]! += advance === 0 ? 30 : advance === 1 ? 22 : advance === 2 ? 0 : -18 * (advance - 2);
        const edge = Math.min(file - 1, geo.files - file);
        score[color]! += edge <= 2 ? 20 - 4 * edge : edge === 3 ? 0 : -15;
      }
      continue;
    }
    // Distance to each king.
    const ownDist = Math.max(Math.abs(file - kingFile[color]!), Math.abs(rank - kingRank[color]!));
    const enemyDist = Math.max(Math.abs(file - kingFile[enemy]!), Math.abs(rank - kingRank[enemy]!));
    if (enemyDist <= 2) pressure[enemy]! += NEAR_KING[type]! * (enemyDist === 1 ? 2 : 1);
    if (ownDist <= 1) shelter[color]! += type === GOLD || type === SILVER || (type >= TOKIN && type <= PRO_SILVER) ? 26 : type === PAWN ? 10 : 6;
    else if (ownDist === 2 && (type === GOLD || type === SILVER)) shelter[color]! += 12;
    if (!mini && (type === GOLD || type === SILVER) && ownDist > 3 && advance < 4) score[color]! -= 4 * (ownDist - 3);
    if (type === PAWN) score[color]! += advance >= 3 && advance <= 5 ? 4 * (advance - 2) : advance >= 6 ? 14 : 0;
    if (type === KNIGHT) score[color]! += advance >= 2 && advance <= 4 ? 8 : 0;
    if (type === BISHOP || type === ROOK || type === HORSE || type === DRAGON) {
      // Mobility: free squares along the piece's lines.
      const slides = SLIDE_MASK[code]!;
      let free = 0;
      for (let d = 0; d < 8; d++) {
        if ((slides & (1 << d)) === 0) continue;
        let x = sq + delta[d]!;
        while (board[x] === EMPTY) {
          free++;
          x += delta[d]!;
        }
        if (board[x] !== WALL && colorOfCode(board[x]!) !== color) free++;
      }
      score[color]! += 3 * free;
    }
  }

  for (const color of [0, 1] as const) {
    const enemy = (1 - color) as Color;
    let handTotal = 0;
    let danger = 0;
    for (let type = 0; type < HAND_TYPES; type++) {
      const count = p.handCount(color, type);
      if (count === 0) continue;
      // Pawns in hand: the first few matter most.
      handTotal += type === PAWN ? handValues[PAWN]! * Math.min(count, 4) + (handValues[PAWN]! >> 1) * Math.max(0, count - 4) : count * handValues[type]!;
      danger += count * HAND_DANGER[type]!;
    }
    score[color]! += handTotal;
    // Holes around the enemy king make our pieces in hand more dangerous.
    const king = kings[enemy]!;
    if (king >= 0) {
      let open = 0;
      for (let d = 0; d < 8; d++) {
        const x = king + delta[d]!;
        const c = board[x]!;
        if (c === EMPTY) open++;
        else if (c !== WALL && colorOfCode(c) !== enemy) open++;
      }
      pressure[enemy]! += (danger * (2 + open)) >> 2;
    }
  }

  const total = score[0]! - score[1]! + (shelter[0]! - shelter[1]!) - (pressure[0]! - pressure[1]!);
  const tempo = 20;
  return (p.side === 0 ? total : -total) + tempo;
}

/** The moves of each piece as one-step and sliding masks, re-exported for the coach and tests. */
export const MASKS = { STEP_MASK, SLIDE_MASK };

export interface EngineRequest {
  readonly sfen: string;
  readonly history?: EngineHistory | null;
  /** The colour that moved first in the game (mini-shogi repetition). */
  readonly first?: Color;
  readonly limits: PvsLimits;
}

const searchers = new Map<number, PvsSearcher>();

/** A searcher with a table of the given size, kept for reuse (tables are cleared per search). */
export function searcher(tableBits = 18): PvsSearcher {
  let s = searchers.get(tableBits);
  if (!s) {
    s = new PvsSearcher(tableBits);
    searchers.set(tableBits, s);
  }
  return s;
}

export function searchSfen(request: EngineRequest, options: SearchFlavour = {}): { result: PvsResult; game: ShogiSearch } {
  const p = parseSfen(request.sfen);
  const game = new ShogiSearch(p, request.history ?? null, request.first ?? p.side, options);
  const result = searcher().search(game, request.limits);
  return { result, game };
}

/** Plain-data piece values for the coach's "material" counter and tests. */
export function pieceValue(type: number, mini = false): number {
  return (mini ? VALUE_MINI : VALUE)[type] ?? 0;
}

export { KING as KING_TYPE };
