/**
 * A fast model of one dominoes hand for the bots' search (PLAN.md 2.3: bots may use fast internal
 * representations as long as they agree with rules.ts under test). A move is a number, and a hand
 * is played to its end in place, without allocating. Only the current hand is modelled: its
 * result is the points each side scores in it, bonuses and points made on the ends included.
 *
 * Hands are bit masks over the tiles of the set in play, in two 32-bit words: `lo` holds tiles 0
 * to 31 and `hi` tiles 32 to 54. The double six's 28 tiles all sit in `lo`, so its `hi` words stay
 * zero and cost one extra AND here and there; the double nine's 55 tiles use both. Two plain
 * numbers keep every operation in 32-bit integer arithmetic, where BigInt masks would allocate and
 * a typed-array bitset would add an indirection per access; measured on double-six positions, the
 * CPU levels choose exactly as before and are no slower. Legal moves walk the set bits of a hand
 * rather than every tile index.
 *
 * The layout is kept as its open ends: the two ends of the line, whether each end tile is a
 * double (a double at an end counts both halves), and with a spinner its number, whether it is
 * still an end of the line on either side, and the ends of its third and fourth arms.
 */
import type { DominoesConfig, DominoesState, DominoSet, Tile } from './rules';
import { seatCount, sideCount, sideOf, tilesOfSet, topOf } from './rules';

/** The tile tables of one set, by tile index (the order of tilesOfSet). */
export interface SetTables {
  readonly set: DominoSet;
  readonly tiles: readonly Tile[];
  readonly count: number;
  readonly a: readonly number[];
  readonly b: readonly number[];
  readonly pips: readonly number[];
  /** The tiles holding each number, as masks: tiles 0 to 31, and tiles 32 up. */
  readonly numLo: readonly number[];
  readonly numHi: readonly number[];
  readonly index: ReadonlyMap<Tile, number>;
}

function buildTables(set: DominoSet): SetTables {
  const tiles = tilesOfSet(set);
  const a = tiles.map((t) => Number(t[0]));
  const b = tiles.map((t) => Number(t[2]));
  const numLo: number[] = [];
  const numHi: number[] = [];
  for (let n = 0; n <= topOf(set); n++) {
    let lo = 0;
    let hi = 0;
    tiles.forEach((_, i) => {
      if (a[i] !== n && b[i] !== n) return;
      if (i < 32) lo |= 1 << i;
      else hi |= 1 << (i - 32);
    });
    numLo.push(lo);
    numHi.push(hi);
  }
  return { set, tiles, count: tiles.length, a, b, pips: tiles.map((_, i) => (a[i] ?? 0) + (b[i] ?? 0)), numLo, numHi, index: new Map(tiles.map((t, i) => [t, i])) };
}

const TABLES: Readonly<Record<DominoSet, SetTables>> = { 'double-six': buildTables('double-six'), 'double-nine': buildTables('double-nine') };

export function tablesOf(set: DominoSet): SetTables {
  return TABLES[set];
}

const SIX = TABLES['double-six'];
/** The double six's tables, as the old single-word model named them. */
export const TILE_COUNT = SIX.count;
export const TILE_A: readonly number[] = SIX.a;
export const TILE_B: readonly number[] = SIX.b;
export const TILE_PIPS: readonly number[] = SIX.pips;
export const NUM_MASK: readonly number[] = SIX.numLo;
export const CHUCHA = 0;

export const PASS = -1;
export const DRAW = -2;

/** A tile's index in its set. */
export function tileIndex(tile: Tile, set: DominoSet = 'double-six'): number {
  const i = TABLES[set].index.get(tile);
  if (i === undefined) throw new Error(`Not a tile of the ${set}: ${tile}`);
  return i;
}

/** A hand as its two mask words. */
export function masksOf(tiles: readonly Tile[], set: DominoSet = 'double-six'): [number, number] {
  let lo = 0;
  let hi = 0;
  for (const t of tiles) {
    const i = tileIndex(t, set);
    if (i < 32) lo |= 1 << i;
    else hi |= 1 << (i - 32);
  }
  return [lo, hi];
}

/** A double-six hand as one mask. */
export function maskOf(tiles: readonly Tile[]): number {
  return masksOf(tiles)[0];
}

export function tilesOf(lo: number, hi = 0, set: DominoSet = 'double-six'): Tile[] {
  const t = TABLES[set];
  const out: Tile[] = [];
  for (let i = 0; i < t.count; i++) if (i < 32 ? lo & (1 << i) : hi & (1 << (i - 32))) out.push(t.tiles[i] as Tile);
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

/** Pips in a mask word; `offset` is 32 for the high word. */
export function maskPips(m: number, pips: readonly number[] = TILE_PIPS, offset = 0): number {
  let x = m >>> 0;
  let sum = 0;
  while (x) {
    const low = x & -x;
    sum += pips[offset + 31 - Math.clz32(low)] ?? 0;
    x ^= low;
  }
  return sum;
}

/** A move: tile index * 4 + end (0 left, 1 right, 2 up, 3 down); PASS; DRAW. The first tile uses end 0. */
export const moveOf = (tile: number, end: boolean | number): number => tile * 4 + (end === true ? 1 : end === false ? 0 : end);
export const moveTile = (move: number): number => move >> 2;
export const moveEnd = (move: number): number => move & 3;
export const moveRight = (move: number): boolean => (move & 3) === 1;
const END_CODE = { left: 0, right: 1, up: 2, down: 3 } as const;
export const endCode = (end: keyof typeof END_CODE | undefined): number => (end ? END_CODE[end] : 0);

export interface SimRules {
  readonly n: number;
  readonly sides: number;
  readonly draw: boolean;
  /** Tiles that may never be drawn: 0, 1 or 2. */
  readonly keep: number;
  readonly scoringAll: boolean;
  readonly difference: boolean;
  readonly blockedAll: boolean;
  readonly blockerOrNext: boolean;
  readonly player: boolean;
  readonly tie: DominoesConfig['blockedTie'];
  readonly early: boolean;
  readonly capicu: number;
  readonly chuchazo: number;
  readonly chuchazoOneEnd: boolean;
  readonly passBonus: boolean;
  readonly spinner: boolean;
  readonly fives: boolean;
  readonly roundFive: boolean;
  readonly atOnce: boolean;
  readonly target: number;
}

export function simRules(config: DominoesConfig): SimRules {
  const n = seatCount(config);
  return {
    n,
    sides: sideCount(n),
    draw: config.mode === 'draw' || config.mode === 'draw-three' || config.mode === 'partnership-draw',
    keep: config.drawLimit === 'leave-two' ? 2 : config.drawLimit === 'leave-one' ? 1 : 0,
    scoringAll: config.scoring === 'all',
    difference: config.blockedScore === 'difference',
    blockedAll: config.blockedScore === 'all',
    blockerOrNext: config.blockedWinner === 'blocker-or-next',
    player: config.blockedWinner === 'player',
    tie: config.blockedTie,
    early: config.earlyBonus === '100-75-50-25',
    capicu: config.capicu,
    chuchazo: config.chuchazo,
    chuchazoOneEnd: config.chuchazoEnds === 'one-end',
    passBonus: config.passBonus === 'on',
    spinner: config.spinner === 'first-double',
    fives: config.fives === 'on',
    roundFive: config.rounding === 'nearest-five',
    atOnce: config.finish === 'at-once' && config.target > 0,
    target: config.target,
  };
}

export interface Sim {
  readonly rules: SimRules;
  readonly t: SetTables;
  /** Each seat's hand: tiles 0 to 31, and tiles 32 up. */
  lo: number[];
  hi: number[];
  /** Boneyard tile indices, top first (draw games). */
  bone: number[];
  /** Next boneyard index to draw. */
  boneAt: number;
  /** The ends of the line (-1 before the first tile), and whether each end tile is a double. */
  left: number;
  right: number;
  leftD: boolean;
  rightD: boolean;
  /** Tiles on the table. */
  onTable: number;
  /** The spinner's number (-1 for none), and whether it is still the left or the right end of the line. */
  sp: number;
  spL: boolean;
  spR: boolean;
  /** The ends of the third and fourth arms (-1 until started), and whether each end tile is a double. */
  up: number;
  down: number;
  upD: boolean;
  downD: boolean;
  turn: number;
  leader: number;
  /** The seat that played the last tile, or -1. */
  lastPlayer: number;
  handNo: number;
  passBonusTaken: boolean;
  mustLead: number;
  /** Points each side has scored in this hand so far (pass bonuses, points on the ends), then the hand's result. */
  pts: number[];
  /** Match points before this hand, per side (for a target reached during play). */
  readonly base: readonly number[];
  done: boolean;
  /** How the hand ended: 1 going out, 2 blocked, 3 the target reached during play. */
  ending: number;
  /** The side that won the hand, -1 for none (set when done). */
  winner: number;
}

/** The current hand of a full state, as a fast model. */
export function fromState(s: DominoesState): Sim {
  const rules = simRules(s.config);
  const t = TABLES[s.config.set];
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
  const pts = Array.from({ length: rules.sides }, () => 0);
  for (const b of s.handBonuses) pts[b.side] = (pts[b.side] ?? 0) + b.points;
  const masks = s.hands.map((h) => masksOf(h, s.config.set));
  const k = s.spinner ? s.chain.findIndex((p) => p.tile === s.spinner) : -1;
  const upEnd = s.up[s.up.length - 1];
  const downEnd = s.down[s.down.length - 1];
  return {
    rules,
    t,
    lo: masks.map((m) => m[0]),
    hi: masks.map((m) => m[1]),
    bone: s.boneyard.map((tile) => tileIndex(tile, s.config.set)),
    boneAt: 0,
    left: first ? first.left : -1,
    right: last ? last.right : -1,
    leftD: first ? first.left === first.right : false,
    rightD: last ? last.left === last.right : false,
    onTable: s.chain.length + s.up.length + s.down.length,
    sp: s.spinner ? Number(s.spinner[0]) : -1,
    spL: k === 0,
    spR: k >= 0 && k === s.chain.length - 1,
    up: upEnd ? upEnd.right : -1,
    down: downEnd ? downEnd.right : -1,
    upD: upEnd ? upEnd.left === upEnd.right : false,
    downD: downEnd ? downEnd.left === downEnd.right : false,
    turn: s.turn,
    leader: s.leader,
    lastPlayer,
    handNo: s.handNo,
    passBonusTaken: s.passBonusTaken,
    mustLead: s.mustLead ? tileIndex(s.mustLead, s.config.set) : -1,
    pts,
    base: s.scores.map((v, i) => v - (pts[i] ?? 0)),
    done: s.over,
    ending: 0,
    winner: -1,
  };
}

export function cloneSim(s: Sim): Sim {
  return { ...s, lo: s.lo.slice(), hi: s.hi.slice(), pts: s.pts.slice() };
}

function canDrawSim(s: Sim): boolean {
  if (!s.rules.draw) return false;
  return s.bone.length - s.boneAt > s.rules.keep;
}

/** The number a tile must match on the spinner's third arm, or -1 where none may go yet. */
function upValue(s: Sim): number {
  if (s.sp < 0 || s.spL || s.spR) return -1;
  return s.up >= 0 ? s.up : s.sp;
}

/** The number a tile must match on the fourth arm, which opens once the third has started; -1 before. */
function downValue(s: Sim): number {
  if (s.sp < 0 || s.spL || s.spR || s.up < 0) return -1;
  return s.down >= 0 ? s.down : s.sp;
}

/** The count of the open ends. */
export function simCount(s: Sim): number {
  if (s.left < 0) return 0;
  if (s.onTable === 1) return s.leftD ? 2 * s.left : s.left + s.right;
  let c = (s.leftD ? 2 * s.left : s.left) + (s.rightD ? 2 * s.right : s.right);
  if (s.up >= 0) c += s.upD ? 2 * s.up : s.up;
  if (s.down >= 0) c += s.downD ? 2 * s.down : s.down;
  return c;
}

/** What peek() reports. */
export interface Peeked {
  /** The ends of the line after the move. */
  l: number;
  r: number;
  /** The numbers the third and fourth arms would take (-1 where no tile may go). */
  uv: number;
  dv: number;
  /** Scoring as you play: the count of the open ends after the move (0 otherwise). */
  count: number;
}

const PEEKED: Peeked = { l: 0, r: 0, uv: -1, dv: -1, count: 0 };

/** What a play would leave, without making it. The answer is one shared object, overwritten by the next call. */
export function peek(s: Sim, move: number): Readonly<Peeked> {
  const tile = move >> 2;
  const e = move & 3;
  const a = s.t.a[tile] as number;
  const b = s.t.b[tile] as number;
  let l = s.left;
  let r = s.right;
  if (!s.rules.spinner && !s.rules.fives) {
    if (l < 0) {
      l = a;
      r = b;
    } else if (e === 1) r = r === a ? b : a;
    else l = l === a ? b : a;
    PEEKED.l = l;
    PEEKED.r = r;
    PEEKED.uv = -1;
    PEEKED.dv = -1;
    PEEKED.count = 0;
    return PEEKED;
  }
  const dbl = a === b;
  let lD = s.leftD;
  let rD = s.rightD;
  let sp = s.sp;
  let spL = s.spL;
  let spR = s.spR;
  let up = s.up;
  let down = s.down;
  let upD = s.upD;
  let downD = s.downD;
  let on = s.onTable;
  if (l < 0) {
    l = a;
    r = b;
    lD = dbl;
    rD = dbl;
    on = 1;
    if (s.rules.spinner && dbl) {
      sp = a;
      spL = true;
      spR = true;
    }
  } else {
    if (e === 0) {
      l = l === a ? b : a;
      lD = dbl;
      spL = false;
      if (dbl && s.rules.spinner && sp < 0) {
        sp = a;
        spL = true;
      }
    } else if (e === 1) {
      r = r === a ? b : a;
      rD = dbl;
      spR = false;
      if (dbl && s.rules.spinner && sp < 0) {
        sp = a;
        spR = true;
      }
    } else if (e === 2) {
      const v = up >= 0 ? up : sp;
      up = v === a ? b : a;
      upD = dbl;
    } else {
      const v = down >= 0 ? down : sp;
      down = v === a ? b : a;
      downD = dbl;
    }
    on++;
  }
  const arms = sp >= 0 && !spL && !spR;
  PEEKED.l = l;
  PEEKED.r = r;
  PEEKED.uv = arms ? (up >= 0 ? up : sp) : -1;
  PEEKED.dv = arms && up >= 0 ? (down >= 0 ? down : sp) : -1;
  if (!s.rules.fives) PEEKED.count = 0;
  else if (on === 1) PEEKED.count = lD ? 2 * l : l + r;
  else PEEKED.count = (lD ? 2 * l : l) + (rD ? 2 * r : r) + (up >= 0 ? (upD ? 2 * up : up) : 0) + (down >= 0 ? (downD ? 2 * down : down) : 0);
  return PEEKED;
}

/** Legal moves for the seat to move, in the order the rules list them for a hand sorted by tile. */
export function simLegal(s: Sim, out: number[] = []): number[] {
  out.length = 0;
  if (s.done) return out;
  const lo = s.lo[s.turn] ?? 0;
  const hi = s.hi[s.turn] ?? 0;
  if (s.left < 0) {
    if (s.mustLead >= 0) {
      const m = s.mustLead;
      if (m < 32 ? lo & (1 << m) : hi & (1 << (m - 32))) out.push(moveOf(m, 0));
      return out;
    }
    for (let x = lo >>> 0; x; ) {
      const low = x & -x;
      out.push(moveOf(31 - Math.clz32(low), 0));
      x ^= low;
    }
    for (let x = hi >>> 0; x; ) {
      const low = x & -x;
      out.push(moveOf(63 - Math.clz32(low), 0));
      x ^= low;
    }
    return out;
  }
  const t = s.t;
  const uv = upValue(s);
  const dv = downValue(s);
  const lmLo = t.numLo[s.left] ?? 0;
  const rmLo = t.numLo[s.right] ?? 0;
  const umLo = uv >= 0 ? (t.numLo[uv] ?? 0) : 0;
  const dmLo = dv >= 0 ? (t.numLo[dv] ?? 0) : 0;
  for (let x = (lo & (lmLo | rmLo | umLo | dmLo)) >>> 0; x; ) {
    const low = x & -x;
    const i = 31 - Math.clz32(low);
    x ^= low;
    if (lmLo & low) out.push(i * 4);
    if (rmLo & low) out.push(i * 4 + 1);
    if (umLo & low) out.push(i * 4 + 2);
    if (dmLo & low) out.push(i * 4 + 3);
  }
  if (hi) {
    const lmHi = t.numHi[s.left] ?? 0;
    const rmHi = t.numHi[s.right] ?? 0;
    const umHi = uv >= 0 ? (t.numHi[uv] ?? 0) : 0;
    const dmHi = dv >= 0 ? (t.numHi[dv] ?? 0) : 0;
    for (let x = (hi & (lmHi | rmHi | umHi | dmHi)) >>> 0; x; ) {
      const low = x & -x;
      const i = 63 - Math.clz32(low);
      x ^= low;
      if (lmHi & low) out.push(i * 4);
      if (rmHi & low) out.push(i * 4 + 1);
      if (umHi & low) out.push(i * 4 + 2);
      if (dmHi & low) out.push(i * 4 + 3);
    }
  }
  if (out.length === 0) out.push(canDrawSim(s) ? DRAW : PASS);
  return out;
}

function blocked(s: Sim): boolean {
  if (s.left < 0 || canDrawSim(s)) return false;
  const t = s.t;
  let mLo = (t.numLo[s.left] ?? 0) | (t.numLo[s.right] ?? 0);
  let mHi = (t.numHi[s.left] ?? 0) | (t.numHi[s.right] ?? 0);
  if (s.sp >= 0) {
    const uv = upValue(s);
    const dv = downValue(s);
    if (uv >= 0) {
      mLo |= t.numLo[uv] ?? 0;
      mHi |= t.numHi[uv] ?? 0;
    }
    if (dv >= 0) {
      mLo |= t.numLo[dv] ?? 0;
      mHi |= t.numHi[dv] ?? 0;
    }
  }
  const n = s.rules.n;
  for (let i = 0; i < n; i++) if ((s.lo[i] ?? 0) & mLo || (s.hi[i] ?? 0) & mHi) return false;
  return true;
}

function passBonusPoints(s: Sim): number {
  const p = s.passBonusTaken ? 10 : 20;
  s.passBonusTaken = true;
  return p;
}

/** Points scored during play reach the target: the match ends at once. */
function reached(s: Sim, side: number): boolean {
  if (!s.rules.atOnce || (s.base[side] ?? 0) + (s.pts[side] ?? 0) < s.rules.target) return false;
  s.done = true;
  s.ending = 3;
  s.winner = side;
  return true;
}

/** Applies a legal move in place. */
export function simApply(s: Sim, move: number): void {
  const n = s.rules.n;
  const seat = s.turn;
  if (move === DRAW) {
    const t = s.bone[s.boneAt++] as number;
    if (t < 32) s.lo[seat] = (s.lo[seat] ?? 0) | (1 << t);
    else s.hi[seat] = (s.hi[seat] ?? 0) | (1 << (t - 32));
    if (blocked(s)) finishBlocked(s, s.lastPlayer >= 0 ? s.lastPlayer : seat);
    return;
  }
  if (move === PASS) {
    if (s.rules.passBonus && s.lastPlayer >= 0 && sideOf(s.lastPlayer, n) !== sideOf(seat, n)) {
      const side = sideOf(s.lastPlayer, n);
      s.pts[side] = (s.pts[side] ?? 0) + passBonusPoints(s);
      if (reached(s, side)) return;
    }
    s.turn = (seat + 1) % n;
    return;
  }
  const t = moveTile(move);
  const e = move & 3;
  const a = s.t.a[t] as number;
  const b = s.t.b[t] as number;
  const dbl = a === b;
  const oldLeft = s.left;
  const oldRight = s.right;
  if (t < 32) s.lo[seat] = (s.lo[seat] ?? 0) & ~(1 << t);
  else s.hi[seat] = (s.hi[seat] ?? 0) & ~(1 << (t - 32));
  if (s.left < 0) {
    s.left = a;
    s.right = b;
    s.leftD = dbl;
    s.rightD = dbl;
    s.onTable = 1;
    if (s.rules.spinner && dbl) {
      s.sp = a;
      s.spL = true;
      s.spR = true;
    }
  } else {
    if (e === 0) {
      s.left = s.left === a ? b : a;
      s.leftD = dbl;
      s.spL = false;
      if (dbl && s.rules.spinner && s.sp < 0) {
        s.sp = a;
        s.spL = true;
      }
    } else if (e === 1) {
      s.right = s.right === a ? b : a;
      s.rightD = dbl;
      s.spR = false;
      if (dbl && s.rules.spinner && s.sp < 0) {
        s.sp = a;
        s.spR = true;
      }
    } else if (e === 2) {
      const v = s.up >= 0 ? s.up : s.sp;
      s.up = v === a ? b : a;
      s.upD = dbl;
    } else {
      const v = s.down >= 0 ? s.down : s.sp;
      s.down = v === a ? b : a;
      s.downD = dbl;
    }
    s.onTable++;
  }
  s.mustLead = -1;
  s.lastPlayer = seat;
  if (s.rules.fives) {
    const c = simCount(s);
    if (c > 0 && c % 5 === 0) {
      const side = sideOf(seat, n);
      s.pts[side] = (s.pts[side] ?? 0) + c;
      if (reached(s, side)) return;
    }
  }
  if (s.lo[seat] === 0 && s.hi[seat] === 0) {
    finishDomino(s, seat, t, oldLeft, oldRight);
    return;
  }
  if (blocked(s)) {
    finishBlocked(s, seat);
    return;
  }
  s.turn = (seat + 1) % n;
}

function seatPips(s: Sim, seat: number): number {
  const hi = s.hi[seat] ?? 0;
  return maskPips(s.lo[seat] ?? 0, s.t.pips) + (hi ? maskPips(hi, s.t.pips, 32) : 0);
}

function round(s: Sim, pips: number): number {
  return s.rules.roundFive ? Math.round(pips / 5) * 5 : pips;
}

function finishDomino(s: Sim, seat: number, t: number, l: number, r: number): void {
  const n = s.rules.n;
  const side = sideOf(seat, n);
  let total = 0;
  let losers = 0;
  for (let i = 0; i < n; i++) {
    const p = seatPips(s, i);
    total += p;
    if (sideOf(i, n) !== side) losers += p;
  }
  let pts = round(s, s.rules.scoringAll ? total : losers);
  if (s.rules.early && s.handNo < 4) pts += [100, 75, 50, 25][s.handNo] ?? 0;
  if (l >= 0) {
    const a = s.t.a[t] as number;
    const b = s.t.b[t] as number;
    if (s.rules.capicu > 0 && a !== b && (a === l || b === l) && (a === r || b === r)) pts += s.rules.capicu;
    if (s.rules.chuchazo > 0 && t === CHUCHA) {
      const blanks = (l === 0 ? 1 : 0) + (r === 0 ? 1 : 0);
      if (!s.rules.chuchazoOneEnd || blanks === 1) pts += s.rules.chuchazo;
    }
  }
  s.pts[side] = (s.pts[side] ?? 0) + pts;
  s.done = true;
  s.ending = 1;
  s.winner = side;
}

function finishBlocked(s: Sim, blocker: number): void {
  const { n, sides } = s.rules;
  const pips: number[] = [];
  const counts: number[] = [];
  for (let i = 0; i < n; i++) {
    pips.push(seatPips(s, i));
    counts.push(popcount(s.lo[i] ?? 0) + popcount(s.hi[i] ?? 0));
  }
  const bSide = sideOf(blocker, n);
  const value: number[] = [];
  const count: number[] = [];
  for (let x = 0; x < sides; x++) {
    value.push(s.rules.player ? Infinity : 0);
    count.push(s.rules.player ? Infinity : 0);
  }
  if (s.rules.blockerOrNext && n === 4) {
    const next = (blocker + 1) % n;
    value[bSide] = pips[blocker] ?? 0;
    value[1 - bSide] = pips[next] ?? 0;
    count[bSide] = counts[blocker] ?? 0;
    count[1 - bSide] = counts[next] ?? 0;
  } else {
    for (let i = 0; i < n; i++) {
      const side = sideOf(i, n);
      const p = pips[i] ?? 0;
      if (!s.rules.player) {
        value[side] = (value[side] ?? 0) + p;
        count[side] = (count[side] ?? 0) + (counts[i] ?? 0);
      } else if (p < (value[side] ?? Infinity) || (p === value[side] && (counts[i] ?? 0) < (count[side] ?? Infinity))) {
        value[side] = p;
        count[side] = counts[i] ?? 0;
      }
    }
  }
  let low = Infinity;
  let lowSides = 0;
  let lowSide = -1;
  let otherLow = -1;
  for (let x = 0; x < sides; x++) {
    const v = value[x] ?? 0;
    if (v < low) {
      low = v;
      lowSides = 1;
      lowSide = x;
    } else if (v === low) {
      lowSides++;
      otherLow = x;
    }
  }
  let winner = -1;
  if (lowSides === 1) winner = lowSide;
  else if (sides === 3) {
    // Two tied: they share the third player's count.
    if (lowSides === 2) {
      let third = 0;
      for (let i = 0; i < n; i++) if (i !== lowSide && i !== otherLow) third += pips[i] ?? 0;
      const unit = s.rules.roundFive ? 5 : 1;
      const half = Math.floor(round(s, third) / 2 / unit) * unit;
      s.pts[lowSide] = (s.pts[lowSide] ?? 0) + half;
      s.pts[otherLow] = (s.pts[otherLow] ?? 0) + half;
    }
  } else {
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
      case 'more-tiles': {
        const ca = count[0] ?? 0;
        const cb = count[1] ?? 0;
        winner = ca > cb ? 0 : cb > ca ? 1 : -1;
        break;
      }
    }
  }
  if (winner >= 0) {
    let losers = 0;
    let winners = 0;
    for (let i = 0; i < n; i++) {
      if (sideOf(i, n) === winner) winners += pips[i] ?? 0;
      else losers += pips[i] ?? 0;
    }
    const pts = s.rules.difference ? Math.max(0, losers - winners) : s.rules.blockedAll || s.rules.scoringAll ? losers + winners : losers;
    s.pts[winner] = (s.pts[winner] ?? 0) + round(s, pts);
  }
  if (s.rules.passBonus && s.lastPlayer >= 0) {
    for (let i = 1; i < n; i++) if (sideOf((blocker + i) % n, n) !== bSide) s.pts[bSide] = (s.pts[bSide] ?? 0) + passBonusPoints(s);
  }
  s.done = true;
  s.ending = 2;
  s.winner = winner;
}

/** Applies moves chosen by `pick` until the hand ends; returns the hand's points per side. */
export function playToEnd(s: Sim, pick: (s: Sim, legal: number[]) => number): number[] {
  const legal: number[] = [];
  for (let guard = 0; guard < 400 && !s.done; guard++) {
    simLegal(s, legal);
    simApply(s, legal.length === 1 ? (legal[0] as number) : pick(s, legal));
  }
  return s.pts;
}

/** Tiles left in every hand. */
export function tilesInHands(s: Sim): number {
  let c = 0;
  for (let i = 0; i < s.rules.n; i++) c += popcount(s.lo[i] ?? 0) + popcount(s.hi[i] ?? 0);
  return c;
}

/** Tiles still in play: those in hands and those that can still be drawn. Exact search waits until this is small. */
export function liveTiles(s: Sim): number {
  const drawable = s.rules.draw ? Math.max(0, s.bone.length - s.boneAt - s.rules.keep) : 0;
  return tilesInHands(s) + drawable;
}

/** A side's points in the hand less the others' (with three players, less the others' average). */
export function marginOf(pts: readonly number[], side: number): number {
  if (pts.length === 2) return (pts[side] ?? 0) - (pts[1 - side] ?? 0);
  let others = 0;
  for (let x = 0; x < pts.length; x++) if (x !== side) others += pts[x] ?? 0;
  return (pts[side] ?? 0) - others / (pts.length - 1);
}

/** Two moves that leave the same position (the same tile on two ends showing its number) need searching once. */
function positionKey(s: Sim, mover: number): string {
  if (!s.rules.fives && !s.rules.spinner) {
    const lo = s.left < s.right ? s.left : s.right;
    const hi = s.left < s.right ? s.right : s.left;
    return s.hi[mover] ? `${lo}-${hi}-${s.lo[mover]}-${s.hi[mover]}` : `${lo}-${hi}-${s.lo[mover]}`;
  }
  const l = `${s.left}${s.leftD ? 'd' : ''}${s.spL ? 's' : ''}`;
  const r = `${s.right}${s.rightD ? 'd' : ''}${s.spR ? 's' : ''}`;
  return `${l < r ? l : r}|${l < r ? r : l}|${s.up}${s.upD ? 'd' : ''}|${s.down}${s.downD ? 'd' : ''}|${s.lo[mover]}|${s.hi[mover]}|${s.pts.join(',')}`;
}

/**
 * Exact play with every tile known: the best margin (side `side`'s hand points less the other
 * side's) both sides can force from here, by alpha-beta search.
 */
export function solveMargin(s: Sim, side: number, alpha = -Infinity, beta = Infinity, budget = { nodes: 0, limit: 40_000 }): number {
  if (s.done) return marginOf(s.pts, side);
  budget.nodes++;
  const legal = simLegal(s, []);
  const maximise = sideOf(s.turn, s.rules.n) === side;
  let best = maximise ? -Infinity : Infinity;
  const seen = new Set<string>();
  for (const move of legal) {
    const child = cloneSim(s);
    simApply(child, move);
    const key = child.done ? `${move}` : positionKey(child, s.turn);
    if (seen.has(key)) continue;
    seen.add(key);
    if (budget.nodes > budget.limit) {
      // Out of budget: finish this line greedily.
      playToEnd(child, (_, l) => l[0] as number);
      const v = marginOf(child.pts, side);
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
