/**
 * A fast model of one dominoes hand for the bots' search (PLAN.md 2.3: bots may use fast internal
 * representations as long as they agree with rules.ts under test). Hands are 28-bit masks, a move
 * is a number, and a hand is played to its end in place, without allocating. Only the current
 * hand is modelled: its result is the points each side scores in it, bonuses included.
 */
import type { DominoesConfig, DominoesState, Tile } from './rules';
import { seatCount, sideOf, TILES } from './rules';

export const TILE_COUNT = 28;
/** The two numbers on each tile, by tile index (the order of TILES). */
export const TILE_A: readonly number[] = TILES.map((t) => Number(t[0]));
export const TILE_B: readonly number[] = TILES.map((t) => Number(t[2]));
export const TILE_PIPS: readonly number[] = TILES.map((_, i) => (TILE_A[i] ?? 0) + (TILE_B[i] ?? 0));
const INDEX = new Map<Tile, number>(TILES.map((t, i) => [t, i]));
/** The tiles holding each number, as a mask. */
export const NUM_MASK: readonly number[] = [0, 1, 2, 3, 4, 5, 6].map((n) => TILES.reduce((m, _, i) => (TILE_A[i] === n || TILE_B[i] === n ? m | (1 << i) : m), 0));
export const DOUBLE_MASK = TILES.reduce((m, _, i) => (TILE_A[i] === TILE_B[i] ? m | (1 << i) : m), 0);
export const CHUCHA = 0;

export const PASS = -1;
export const DRAW = -2;

export function tileIndex(tile: Tile): number {
  const i = INDEX.get(tile);
  if (i === undefined) throw new Error(`Not a tile: ${tile}`);
  return i;
}

export function maskOf(tiles: readonly Tile[]): number {
  let m = 0;
  for (const t of tiles) m |= 1 << tileIndex(t);
  return m;
}

export function tilesOf(mask: number): Tile[] {
  const out: Tile[] = [];
  for (let i = 0; i < TILE_COUNT; i++) if (mask & (1 << i)) out.push(TILES[i] as Tile);
  return out;
}

export function popcount(m: number): number {
  let x = m >>> 0;
  let c = 0;
  while (x) {
    x &= x - 1;
    c++;
  }
  return c;
}

export function maskPips(m: number): number {
  let x = m >>> 0;
  let sum = 0;
  while (x) {
    const low = x & -x;
    sum += TILE_PIPS[31 - Math.clz32(low)] ?? 0;
    x ^= low;
  }
  return sum;
}

/** A move: tile index * 2 + end (0 left, 1 right); PASS; DRAW. The first tile uses end 0. */
export const moveOf = (tile: number, right: boolean): number => tile * 2 + (right ? 1 : 0);
export const moveTile = (move: number): number => move >> 1;
export const moveRight = (move: number): boolean => (move & 1) === 1;

export interface SimRules {
  readonly n: number;
  readonly draw: boolean;
  readonly leaveTwo: boolean;
  readonly scoringAll: boolean;
  readonly difference: boolean;
  readonly blockerOrNext: boolean;
  readonly tie: DominoesConfig['blockedTie'];
  readonly early: boolean;
  readonly capicu: number;
  readonly chuchazo: number;
  readonly chuchazoOneEnd: boolean;
  readonly passBonus: boolean;
}

export function simRules(config: DominoesConfig): SimRules {
  return {
    n: seatCount(config),
    draw: config.mode === 'draw',
    leaveTwo: config.drawLimit === 'leave-two',
    scoringAll: config.scoring === 'all',
    difference: config.blockedScore === 'difference',
    blockerOrNext: config.blockedWinner === 'blocker-or-next',
    tie: config.blockedTie,
    early: config.earlyBonus === '100-75-50-25',
    capicu: config.capicu,
    chuchazo: config.chuchazo,
    chuchazoOneEnd: config.chuchazoEnds === 'one-end',
    passBonus: config.passBonus === 'on',
  };
}

export interface Sim {
  readonly rules: SimRules;
  hands: number[];
  /** Boneyard tile indices, top first (Draw game). */
  bone: number[];
  /** Next boneyard index to draw. */
  boneAt: number;
  left: number;
  right: number;
  turn: number;
  leader: number;
  /** The seat that played the last tile, or -1. */
  lastPlayer: number;
  handNo: number;
  passBonusTaken: boolean;
  mustLead: number;
  /** Points each side has scored in this hand so far (pass bonuses), then the hand's result. */
  pts: [number, number];
  done: boolean;
  /** How the hand ended: 1 going out, 2 blocked. */
  ending: number;
  /** The side that won the hand, -1 for none (set when done). */
  winner: number;
}

/** The current hand of a full state, as a fast model. */
export function fromState(s: DominoesState): Sim {
  const rules = simRules(s.config);
  const first = s.chain[0];
  const last = s.chain[s.chain.length - 1];
  let lastPlayer = -1;
  for (let i = s.moves.length - 1; i >= 0; i--) {
    const m = s.moves[i];
    if (m?.type === 'play') {
      lastPlayer = m.seat;
      break;
    }
  }
  const handPts = [0, 0] as [number, number];
  for (const b of s.handBonuses) handPts[b.side as 0 | 1] += b.points;
  return {
    rules,
    hands: s.hands.map(maskOf),
    bone: s.boneyard.map(tileIndex),
    boneAt: 0,
    left: first ? first.left : -1,
    right: last ? last.right : -1,
    turn: s.turn,
    leader: s.leader,
    lastPlayer,
    handNo: s.handNo,
    passBonusTaken: s.passBonusTaken,
    mustLead: s.mustLead ? tileIndex(s.mustLead) : -1,
    pts: handPts,
    done: s.over,
    ending: 0,
    winner: -1,
  };
}

export function cloneSim(s: Sim): Sim {
  return { ...s, hands: s.hands.slice(), pts: [s.pts[0], s.pts[1]] };
}

function canDrawSim(s: Sim): boolean {
  if (!s.rules.draw) return false;
  return s.bone.length - s.boneAt > (s.rules.leaveTwo ? 2 : 0);
}

/** Tiles of a hand that fit an end, as a mask. */
export function playableMask(s: Sim, hand: number): number {
  if (s.left < 0) return hand;
  return hand & ((NUM_MASK[s.left] ?? 0) | (NUM_MASK[s.right] ?? 0));
}

/** Legal moves for the seat to move, in the order the rules list them for a hand sorted by tile. */
export function simLegal(s: Sim, out: number[] = []): number[] {
  out.length = 0;
  if (s.done) return out;
  const hand = s.hands[s.turn] ?? 0;
  if (s.left < 0) {
    if (s.mustLead >= 0) {
      if (hand & (1 << s.mustLead)) out.push(moveOf(s.mustLead, false));
      return out;
    }
    for (let i = 0; i < TILE_COUNT; i++) if (hand & (1 << i)) out.push(moveOf(i, false));
    return out;
  }
  const lm = NUM_MASK[s.left] ?? 0;
  const rm = NUM_MASK[s.right] ?? 0;
  for (let i = 0; i < TILE_COUNT; i++) {
    const bit = 1 << i;
    if (!(hand & bit)) continue;
    if (lm & bit) out.push(moveOf(i, false));
    if (rm & bit) out.push(moveOf(i, true));
  }
  if (out.length === 0) out.push(canDrawSim(s) ? DRAW : PASS);
  return out;
}

function blocked(s: Sim): boolean {
  if (s.left < 0 || canDrawSim(s)) return false;
  const m = (NUM_MASK[s.left] ?? 0) | (NUM_MASK[s.right] ?? 0);
  for (const h of s.hands) if (h & m) return false;
  return true;
}

function passBonusPoints(s: Sim): number {
  const p = s.passBonusTaken ? 10 : 20;
  s.passBonusTaken = true;
  return p;
}

/** Applies a legal move in place. */
export function simApply(s: Sim, move: number): void {
  const n = s.rules.n;
  const seat = s.turn;
  if (move === DRAW) {
    const t = s.bone[s.boneAt++] as number;
    s.hands[seat] = (s.hands[seat] ?? 0) | (1 << t);
    if (blocked(s)) finishBlocked(s, s.lastPlayer >= 0 ? s.lastPlayer : seat);
    return;
  }
  if (move === PASS) {
    if (s.rules.passBonus && s.lastPlayer >= 0 && sideOf(s.lastPlayer, n) !== sideOf(seat, n)) s.pts[sideOf(s.lastPlayer, n) as 0 | 1] += passBonusPoints(s);
    s.turn = (seat + 1) % n;
    return;
  }
  const t = moveTile(move);
  const a = TILE_A[t] as number;
  const b = TILE_B[t] as number;
  const oldLeft = s.left;
  const oldRight = s.right;
  s.hands[seat] = (s.hands[seat] ?? 0) & ~(1 << t);
  if (s.left < 0) {
    s.left = a;
    s.right = b;
  } else if (moveRight(move)) {
    s.right = s.right === a ? b : a;
  } else {
    s.left = s.left === a ? b : a;
  }
  s.mustLead = -1;
  s.lastPlayer = seat;
  if (s.hands[seat] === 0) {
    finishDomino(s, seat, t, oldLeft, oldRight);
    return;
  }
  if (blocked(s)) {
    finishBlocked(s, seat);
    return;
  }
  s.turn = (seat + 1) % n;
}

function finishDomino(s: Sim, seat: number, t: number, l: number, r: number): void {
  const n = s.rules.n;
  const side = sideOf(seat, n) as 0 | 1;
  let total = 0;
  let losers = 0;
  for (let i = 0; i < n; i++) {
    const p = maskPips(s.hands[i] ?? 0);
    total += p;
    if (sideOf(i, n) !== side) losers += p;
  }
  let pts = s.rules.scoringAll ? total : losers;
  if (s.rules.early && s.handNo < 4) pts += [100, 75, 50, 25][s.handNo] ?? 0;
  if (l >= 0) {
    const a = TILE_A[t] as number;
    const b = TILE_B[t] as number;
    if (s.rules.capicu > 0 && a !== b && (a === l || b === l) && (a === r || b === r)) pts += s.rules.capicu;
    if (s.rules.chuchazo > 0 && t === CHUCHA) {
      const blanks = (l === 0 ? 1 : 0) + (r === 0 ? 1 : 0);
      if (!s.rules.chuchazoOneEnd || blanks === 1) pts += s.rules.chuchazo;
    }
  }
  s.pts[side] += pts;
  s.done = true;
  s.ending = 1;
  s.winner = side;
}

function finishBlocked(s: Sim, blocker: number): void {
  const n = s.rules.n;
  const pips = s.hands.map(maskPips);
  const counts = s.hands.map(popcount);
  const bSide = sideOf(blocker, n);
  let a: number;
  let b: number;
  let ca: number;
  let cb: number;
  if (s.rules.blockerOrNext && n === 4) {
    const next = (blocker + 1) % n;
    const pa = pips[blocker] ?? 0;
    const pb = pips[next] ?? 0;
    a = bSide === 0 ? pa : pb;
    b = bSide === 0 ? pb : pa;
    ca = bSide === 0 ? (counts[blocker] ?? 0) : (counts[next] ?? 0);
    cb = bSide === 0 ? (counts[next] ?? 0) : (counts[blocker] ?? 0);
  } else {
    a = 0;
    b = 0;
    ca = 0;
    cb = 0;
    for (let i = 0; i < n; i++) {
      if (sideOf(i, n) === 0) {
        a += pips[i] ?? 0;
        ca += counts[i] ?? 0;
      } else {
        b += pips[i] ?? 0;
        cb += counts[i] ?? 0;
      }
    }
  }
  let winner: number;
  if (a < b) winner = 0;
  else if (b < a) winner = 1;
  else {
    switch (s.rules.tie) {
      case 'none':
        winner = -1;
        break;
      case 'starting':
        winner = sideOf(s.leader, n);
        break;
      case 'blocker':
        winner = bSide;
        break;
      case 'not-blocker':
        winner = 1 - bSide;
        break;
      case 'more-tiles':
        winner = ca > cb ? 0 : cb > ca ? 1 : -1;
        break;
    }
  }
  if (winner >= 0) {
    let losers = 0;
    let winners = 0;
    for (let i = 0; i < n; i++) {
      if (sideOf(i, n) === winner) winners += pips[i] ?? 0;
      else losers += pips[i] ?? 0;
    }
    const pts = s.rules.difference ? Math.max(0, losers - winners) : s.rules.scoringAll ? losers + winners : losers;
    s.pts[winner as 0 | 1] += pts;
  }
  if (s.rules.passBonus && s.lastPlayer >= 0) {
    for (let i = 1; i < n; i++) if (sideOf((blocker + i) % n, n) !== bSide) s.pts[bSide as 0 | 1] += passBonusPoints(s);
  }
  s.done = true;
  s.ending = 2;
  s.winner = winner;
}

/** Applies moves chosen by `pick` until the hand ends; returns the hand's points per side. */
export function playToEnd(s: Sim, pick: (s: Sim, legal: number[]) => number): [number, number] {
  const legal: number[] = [];
  for (let guard = 0; guard < 200 && !s.done; guard++) {
    simLegal(s, legal);
    simApply(s, legal.length === 1 ? (legal[0] as number) : pick(s, legal));
  }
  return s.pts;
}

/** Tiles left in every hand. */
export function tilesInHands(s: Sim): number {
  let c = 0;
  for (const h of s.hands) c += popcount(h);
  return c;
}

/** Tiles still in play: those in hands and those that can still be drawn. Exact search waits until this is small. */
export function liveTiles(s: Sim): number {
  const drawable = s.rules.draw ? Math.max(0, s.bone.length - s.boneAt - (s.rules.leaveTwo ? 2 : 0)) : 0;
  return tilesInHands(s) + drawable;
}

/**
 * Exact play with every tile known: the best margin (side `side`'s hand points less the other
 * side's) both sides can force from here, by alpha-beta search.
 */
export function solveMargin(s: Sim, side: number, alpha = -Infinity, beta = Infinity, budget = { nodes: 0, limit: 40_000 }): number {
  if (s.done) return (s.pts[side as 0 | 1] ?? 0) - (s.pts[(1 - side) as 0 | 1] ?? 0);
  budget.nodes++;
  const legal = simLegal(s, []);
  const maximise = sideOf(s.turn, s.rules.n) === side;
  let best = maximise ? -Infinity : Infinity;
  const seen = new Set<string>();
  for (const move of legal) {
    const child = cloneSim(s);
    simApply(child, move);
    // Playing the same tile on either end when both show the same number gives the same position.
    const key = child.done ? `${move}` : `${child.left < child.right ? child.left : child.right}-${child.left < child.right ? child.right : child.left}-${child.hands[s.turn]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (budget.nodes > budget.limit) {
      // Out of budget: finish this line greedily.
      playToEnd(child, (_, l) => l[0] as number);
      const v = (child.pts[side as 0 | 1] ?? 0) - (child.pts[(1 - side) as 0 | 1] ?? 0);
      if (maximise ? v > best : v < best) best = v;
      continue;
    }
    const v = solveMargin(child, side, alpha, beta, budget);
    if (maximise) {
      if (v > best) best = v;
      if (best > alpha) alpha = best;
    } else {
      if (v < best) best = v;
      if (best < beta) beta = best;
    }
    if (alpha >= beta) break;
  }
  return best;
}
