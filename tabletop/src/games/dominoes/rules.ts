/**
 * Dominoes with the double-six set (docs/rules/dominoes.md), behind the game contract: the
 * partnership game for four, and the Draw and Block games for two. Every disputed rule is an
 * option in the config, and the presets are named configs.
 *
 * Tiles are written low number first: "0-0" is the double blank (la chucha), "5-6", "6-6". Seats
 * play in turn order 0, 1, 2, 3, which is counter-clockwise round the table: you sit at the
 * bottom, the next player is on your right and your partner faces you.
 *
 * Hidden information: a seat's view holds its own hand, the line, every play and pass, how many
 * tiles each hand and the boneyard hold, and the scores. It never holds another hand, the
 * boneyard, a tile someone else drew, or the seed that deals later hands.
 */
import type { Codec, GameDef, GameEvent, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject, stableStringify } from '../../core/json';
import type { Rng } from '../../core/rng';
import { createRng } from '../../core/rng';

export type Pip = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Tile = `${Pip}-${Pip}`;
export type End = 'left' | 'right';
export type Mode = 'partnership' | 'draw' | 'block';

export const PIPS: readonly Pip[] = [0, 1, 2, 3, 4, 5, 6];
/** The 28 tiles, low number first, in order: 0-0, 0-1, ... 0-6, 1-1, ... 6-6. */
export const TILES: readonly Tile[] = PIPS.flatMap((a) => PIPS.filter((b) => b >= a).map((b): Tile => `${a}-${b}`));
/** Every pip in the set: each number appears eight times on seven tiles. */
export const TOTAL_PIPS = 168;
export const HAND_SIZE = 7;
/** A match never runs past this many hands; then the side ahead wins (or it is a tie). */
export const MAX_HANDS = 60;

export interface DominoesConfig {
  readonly mode: Mode;
  /** Points that win the match; 0 plays a single hand. */
  readonly target: number;
  /** What the winners of a hand score: every tile left in every hand, or only the losers' tiles. */
  readonly scoring: 'all' | 'losers';
  /** A blocked hand scores the pips as `scoring` says, or the losers' pips less the winners'. */
  readonly blockedScore: 'pips' | 'difference';
  /** Who wins a blocked hand: the side with fewer pips, or the fewer of the blocker and the next player. */
  readonly blockedWinner: 'side' | 'blocker-or-next';
  /** A blocked hand with equal pips. */
  readonly blockedTie: 'none' | 'starting' | 'blocker' | 'not-blocker' | 'more-tiles';
  /** Who leads the first hand of a match. */
  readonly firstLead: 'double-six' | 'any';
  /** Who leads the later hands. */
  readonly nextLead: 'winner' | 'rotate' | 'double-six';
  /** Bonuses of 100, 75, 50 and 25 for winning hands one to four by going out. */
  readonly earlyBonus: 'none' | '100-75-50-25';
  /** Bonus for going out with a tile (not a double) that fits both ends. */
  readonly capicu: number;
  /** Bonus for going out with the double blank. */
  readonly chuchazo: number;
  /** When a chuchazo counts: always, or only when exactly one end shows a blank. */
  readonly chuchazoEnds: 'any' | 'one-end';
  /** 10 points (20 the first time in a match) for a tile that makes an opponent pass. */
  readonly passBonus: 'off' | 'on';
  /** A deal where someone holds five or more doubles is dealt again. */
  readonly redeal: 'never' | 'five-doubles';
  /** Draw game: draw until you can play, or never draw the last two tiles. */
  readonly drawLimit: 'all' | 'leave-two';
  /** A position to start from instead of a deal ("play on from here"), in state notation. */
  readonly start?: string;
}

export const PUERTO_RICO_500: DominoesConfig = {
  mode: 'partnership',
  target: 500,
  scoring: 'all',
  blockedScore: 'pips',
  blockedWinner: 'side',
  blockedTie: 'none',
  firstLead: 'double-six',
  nextLead: 'winner',
  earlyBonus: '100-75-50-25',
  capicu: 100,
  chuchazo: 100,
  chuchazoEnds: 'any',
  passBonus: 'off',
  redeal: 'never',
  drawLimit: 'all',
};

const NO_BONUSES = { earlyBonus: 'none', capicu: 0, chuchazo: 0 } as const;

export const PRESETS: Readonly<Record<string, DominoesConfig>> = {
  'puerto-rico-500': PUERTO_RICO_500,
  'puerto-rico-200': { ...PUERTO_RICO_500, ...NO_BONUSES, target: 200 },
  international: { ...PUERTO_RICO_500, ...NO_BONUSES, target: 200, firstLead: 'any', nextLead: 'rotate' },
  mexico: { ...PUERTO_RICO_500, ...NO_BONUSES, target: 100, scoring: 'losers', blockedTie: 'starting' },
  colombia: { ...PUERTO_RICO_500, ...NO_BONUSES, target: 100, scoring: 'losers', blockedTie: 'blocker' },
  venezuela: { ...PUERTO_RICO_500, ...NO_BONUSES, target: 100, scoring: 'losers', nextLead: 'rotate' },
  draw: { ...PUERTO_RICO_500, ...NO_BONUSES, mode: 'draw', target: 100 },
  block: { ...PUERTO_RICO_500, ...NO_BONUSES, mode: 'block', target: 100 },
};

export const TARGETS: readonly number[] = [0, 100, 150, 200, 500];
export const BONUS_VALUES: readonly number[] = [0, 50, 100];
/** Bonuses for winning hands one to four by going out (Quinientos). */
export const EARLY: readonly number[] = [100, 75, 50, 25];

/** One tile in the line, as it lies: `left` faces the left end of the line. */
export interface Placed {
  readonly tile: Tile;
  readonly left: Pip;
  readonly right: Pip;
  readonly seat: Seat;
  /** Its place in the order of play this hand, from 0 for the first tile. */
  readonly n: number;
}

/** A move in this hand, as everyone saw it. A draw shows its tile only to the drawer. */
export interface Move {
  readonly seat: Seat;
  readonly type: 'play' | 'pass' | 'draw';
  readonly tile?: Tile;
  readonly end?: End;
  /** The open ends when the move was made; null before the first tile. */
  readonly ends: readonly [Pip, Pip] | null;
}

export interface Bonus {
  readonly side: number;
  readonly kind: 'early' | 'capicu' | 'chuchazo' | 'pass';
  readonly points: number;
  readonly seat: Seat;
}

export interface HandResult {
  readonly handNo: number;
  readonly reason: 'domino' | 'blocked';
  /** The side that won the hand, or null when a blocked hand is tied and nobody scores. */
  readonly winner: number | null;
  /** Who went out, or who played the last tile of a blocked hand. */
  readonly by: Seat;
  /** Points each side scored in this hand, bonuses included. */
  readonly points: readonly number[];
  /** Pips left in each seat's hand. */
  readonly pips: readonly number[];
  readonly bonuses: readonly Bonus[];
  /** The hands as they were shown at the end. */
  readonly hands: readonly (readonly Tile[])[];
}

export interface DominoesState {
  readonly config: DominoesConfig;
  /** Deals the later hands of a match. Never part of a view. */
  readonly seed: string;
  readonly handNo: number;
  readonly hands: readonly (readonly Tile[])[];
  /** The boneyard in the Draw game (top first); the tiles nobody holds in the Block game. */
  readonly boneyard: readonly Tile[];
  /** The line, left to right. */
  readonly chain: readonly Placed[];
  readonly moves: readonly Move[];
  /** Who led this hand. */
  readonly leader: Seat;
  readonly turn: Seat;
  /** The tile the leader must start with (the 6-6, or the highest double), or null for any tile. */
  readonly mustLead: Tile | null;
  /** Match points, per side. */
  readonly scores: readonly number[];
  /** Pass bonuses scored this hand (already in `scores`). */
  readonly handBonuses: readonly Bonus[];
  /** The first pass bonus of the match has been scored. */
  readonly passBonusTaken: boolean;
  readonly results: readonly HandResult[];
  readonly over: boolean;
}

export type DominoesAction = { readonly type: 'play'; readonly tile: Tile; readonly end?: End } | { readonly type: 'pass' } | { readonly type: 'draw' };

export type DominoesEvent =
  | {
      readonly type: 'deal';
      readonly handNo: number;
      readonly leader: Seat;
      readonly mustLead: Tile | null;
      readonly redeals: number;
      /** How the last hand ended on the table, so the interface can show it until this deal plays. */
      readonly previous: { readonly chain: readonly Placed[]; readonly hands: readonly (readonly Tile[])[]; readonly boneyard: readonly Tile[] } | null;
    }
  | { readonly type: 'play'; readonly seat: Seat; readonly tile: Tile; readonly end: End | null; readonly ends: readonly [Pip, Pip] }
  | { readonly type: 'pass'; readonly seat: Seat; readonly ends: readonly [Pip, Pip] }
  | { readonly type: 'draw'; readonly seat: Seat; readonly tile: Tile; readonly left: number }
  | { readonly type: 'bonus'; readonly bonus: Bonus }
  | { readonly type: 'hand-end'; readonly result: HandResult; readonly scores: readonly number[] }
  | { readonly type: 'match-end'; readonly winner: number | null; readonly scores: readonly number[] };

export interface DominoesView {
  readonly seat: Seat;
  readonly config: DominoesConfig;
  readonly handNo: number;
  readonly hand: readonly Tile[];
  readonly handCounts: readonly number[];
  readonly boneyardCount: number;
  readonly chain: readonly Placed[];
  /** Other seats' draws carry no tile. */
  readonly moves: readonly Move[];
  readonly leader: Seat;
  readonly turn: Seat;
  readonly mustLead: Tile | null;
  readonly scores: readonly number[];
  readonly handBonuses: readonly Bonus[];
  readonly passBonusTaken: boolean;
  readonly results: readonly HandResult[];
  readonly over: boolean;
}

// Tiles

export function isTile(text: string): text is Tile {
  const m = /^([0-6])-([0-6])$/.exec(text);
  return m !== null && Number(m[1]) <= Number(m[2]);
}

/** The tile with these two numbers, in either order. */
export function tileOf(a: number, b: number): Tile {
  return (a <= b ? `${a}-${b}` : `${b}-${a}`) as Tile;
}

export function pipsOf(tile: Tile): readonly [Pip, Pip] {
  return [Number(tile[0]) as Pip, Number(tile[2]) as Pip];
}

export function isDouble(tile: Tile): boolean {
  return tile[0] === tile[2];
}

export function tilePips(tile: Tile): number {
  const [a, b] = pipsOf(tile);
  return a + b;
}

export function handPips(tiles: readonly Tile[]): number {
  return tiles.reduce((sum, t) => sum + tilePips(t), 0);
}

export function hasNumber(tile: Tile, n: number): boolean {
  const [a, b] = pipsOf(tile);
  return a === n || b === n;
}

/** Heavier first: by pips, then by the higher number. Used to find who leads a two-player hand. */
export function heavier(x: Tile, y: Tile): number {
  const d = tilePips(y) - tilePips(x);
  if (d !== 0) return d;
  return Math.max(...pipsOf(y)) - Math.max(...pipsOf(x));
}

// Seats and sides

export function seatCount(config: Pick<DominoesConfig, 'mode'>): number {
  return config.mode === 'partnership' ? 4 : 2;
}

/** Partners share a side: seats 0 and 2 against 1 and 3. With two players each seat is a side. */
export function sideOf(seat: Seat, seats: number): number {
  return seats === 4 ? seat % 2 : seat;
}

export function teamsOf(seats: number): Seat[][] {
  return seats === 4
    ? [
        [0, 2],
        [1, 3],
      ]
    : [[0], [1]];
}

// The line

/** The open ends, left and right, or null before the first tile. */
export function endsOf(chain: readonly Placed[]): readonly [Pip, Pip] | null {
  const first = chain[0];
  const last = chain[chain.length - 1];
  if (!first || !last) return null;
  return [first.left, last.right];
}

/** The ends a tile may go on, given the open ends (any end before the first tile). */
export function fitsEnds(tile: Tile, ends: readonly [Pip, Pip] | null): End[] {
  if (!ends) return ['left'];
  const out: End[] = [];
  if (hasNumber(tile, ends[0])) out.push('left');
  if (hasNumber(tile, ends[1])) out.push('right');
  return out;
}

/** The line after a tile is added on an end (the first tile lies with its low number on the left). */
export function placeTile(chain: readonly Placed[], tile: Tile, end: End | null, seat: Seat, n: number): Placed[] {
  const [a, b] = pipsOf(tile);
  const ends = endsOf(chain);
  if (!ends) return [{ tile, left: a, right: b, seat, n }];
  if (end === 'left') {
    const match = ends[0];
    if (a !== match && b !== match) throw new Error(`${tile} does not fit the left end (${match})`);
    const outer = a === match ? b : a;
    return [{ tile, left: outer, right: match, seat, n }, ...chain];
  }
  const match = ends[1];
  if (a !== match && b !== match) throw new Error(`${tile} does not fit the right end (${match})`);
  const outer = a === match ? b : a;
  return [...chain, { tile, left: match, right: outer, seat, n }];
}

export function canDraw(s: { readonly config: DominoesConfig; readonly boneyard: readonly unknown[] }): boolean {
  if (s.config.mode !== 'draw') return false;
  return s.boneyard.length > (s.config.drawLimit === 'leave-two' ? 2 : 0);
}

function canPlay(hand: readonly Tile[], ends: readonly [Pip, Pip] | null): boolean {
  if (!ends) return hand.length > 0;
  return hand.some((t) => hasNumber(t, ends[0]) || hasNumber(t, ends[1]));
}

/** Nobody can play and nobody can draw: the hand is blocked (trancado). */
export function isBlocked(s: Pick<DominoesState, 'hands' | 'chain' | 'boneyard' | 'config'>): boolean {
  const ends = endsOf(s.chain);
  if (!ends) return false;
  if (canDraw(s)) return false;
  return s.hands.every((h) => !canPlay(h, ends));
}

// Dealing

/** Who leads a hand by the "double six" rule: the 6-6, or in a two-player game the highest double, else the heaviest tile. */
export function forcedLead(hands: readonly (readonly Tile[])[]): { seat: Seat; tile: Tile } {
  const better = (t: Tile, than: Tile) => {
    const td = isDouble(t);
    if (td !== isDouble(than)) return td;
    return heavier(t, than) < 0;
  };
  let best: { seat: Seat; tile: Tile } | null = null;
  for (let seat = 0; seat < hands.length; seat++) {
    for (const tile of hands[seat] ?? []) if (best === null || better(tile, best.tile)) best = { seat, tile };
  }
  if (best === null) throw new Error('Nobody holds a tile');
  return best;
}

function doubles(hand: readonly Tile[]): number {
  return hand.filter(isDouble).length;
}

interface DealInput {
  readonly config: DominoesConfig;
  readonly seed: string;
  readonly handNo: number;
  readonly scores: readonly number[];
  readonly results: readonly HandResult[];
  readonly passBonusTaken: boolean;
  /** Who leads, or null to use the "double six" rule (or for the first hand with any lead, a seat drawn by lot). */
  readonly leader: Seat | null;
  readonly previous?: { readonly chain: readonly Placed[]; readonly hands: readonly (readonly Tile[])[]; readonly boneyard: readonly Tile[] };
}

function deal(input: DealInput): { state: DominoesState; event: DominoesEvent } {
  const { config } = input;
  const n = seatCount(config);
  const dealt = (attempt: number) => {
    const tiles = createRng(`${input.seed}/hand/${input.handNo}/${attempt}`).shuffle(TILES);
    return { hands: Array.from({ length: n }, (_, seat) => tiles.slice(seat * HAND_SIZE, (seat + 1) * HAND_SIZE)), rest: tiles.slice(n * HAND_SIZE) };
  };
  let attempt = 0;
  let { hands, rest } = dealt(0);
  // Five doubles in one hand: deal again (option).
  while (config.redeal === 'five-doubles' && attempt < 50 && hands.some((h) => doubles(h) >= 5)) {
    attempt++;
    ({ hands, rest } = dealt(attempt));
  }
  let leader: Seat;
  let mustLead: Tile | null = null;
  if (input.leader !== null) {
    leader = input.leader;
  } else if (input.handNo === 0 && config.firstLead === 'any') {
    leader = createRng(`${input.seed}/lead`).int(n);
  } else {
    const forced = forcedLead(hands);
    leader = forced.seat;
    mustLead = forced.tile;
  }
  const state: DominoesState = {
    config,
    seed: input.seed,
    handNo: input.handNo,
    hands,
    boneyard: rest,
    chain: [],
    moves: [],
    leader,
    turn: leader,
    mustLead,
    scores: input.scores,
    handBonuses: [],
    passBonusTaken: input.passBonusTaken,
    results: input.results,
    over: false,
  };
  return { state, event: { type: 'deal', handNo: input.handNo, leader, mustLead, redeals: attempt, previous: input.previous ?? null } };
}

// Play

function legalActions(s: DominoesState, seat: Seat): DominoesAction[] {
  if (s.over || s.turn !== seat) return [];
  const hand = s.hands[seat] ?? [];
  const ends = endsOf(s.chain);
  if (!ends) {
    if (s.mustLead) return hand.includes(s.mustLead) ? [{ type: 'play', tile: s.mustLead }] : [];
    return hand.map((tile) => ({ type: 'play', tile }));
  }
  const out: DominoesAction[] = [];
  for (const tile of hand) for (const end of fitsEnds(tile, ends)) out.push({ type: 'play', tile, end });
  if (out.length > 0) return out;
  return canDraw(s) ? [{ type: 'draw' }] : [{ type: 'pass' }];
}

/** The pass bonus for the next occasion in a match: 20 the first time, then 10. */
function passBonusPoints(taken: boolean): number {
  return taken ? 10 : 20;
}

/** The last tile played this hand, if any. */
function lastPlay(moves: readonly Move[]): Move | null {
  for (let i = moves.length - 1; i >= 0; i--) {
    const m = moves[i] as Move;
    if (m.type === 'play') return m;
  }
  return null;
}

function applyAction(s: DominoesState, action: DominoesAction): { state: DominoesState; events: DominoesEvent[] } {
  const seat = s.over ? null : s.turn;
  if (seat === null) throw new Error('The game is over');
  const key = actionText(action);
  if (!legalActions(s, seat).some((a) => actionText(a) === key)) throw new Error(`${key} is not legal here`);
  const n = seatCount(s.config);
  const next = (seat + 1) % n;
  const ends = endsOf(s.chain);

  if (action.type === 'draw') {
    const tile = s.boneyard[0] as Tile;
    const hands = s.hands.map((h, i) => (i === seat ? [...h, tile] : h));
    const boneyard = s.boneyard.slice(1);
    const moves = [...s.moves, { seat, type: 'draw' as const, tile, ends }];
    const after: DominoesState = { ...s, hands, boneyard, moves };
    const events: DominoesEvent[] = [{ type: 'draw', seat, tile, left: boneyard.length }];
    if (isBlocked(after)) {
      const end = handOver(after, 'blocked', lastPlay(moves)?.seat ?? seat);
      return { state: end.state, events: [...events, ...end.events] };
    }
    return { state: after, events };
  }

  if (action.type === 'pass') {
    const moves = [...s.moves, { seat, type: 'pass' as const, ends }];
    const events: DominoesEvent[] = [{ type: 'pass', seat, ends: ends as readonly [Pip, Pip] }];
    let { scores, handBonuses, passBonusTaken } = s;
    // Pass bonus: every opponent who passes after a tile, before the next tile, scores for its player.
    const last = lastPlay(s.moves);
    if (s.config.passBonus === 'on' && last && sideOf(last.seat, n) !== sideOf(seat, n)) {
      const side = sideOf(last.seat, n);
      const bonus: Bonus = { side, kind: 'pass', points: passBonusPoints(passBonusTaken), seat: last.seat };
      scores = scores.map((v, i) => (i === side ? v + bonus.points : v));
      handBonuses = [...handBonuses, bonus];
      passBonusTaken = true;
      events.push({ type: 'bonus', bonus });
    }
    return { state: { ...s, moves, turn: next, scores, handBonuses, passBonusTaken }, events };
  }

  const tile = action.tile;
  const end = action.end ?? null;
  const chain = placeTile(s.chain, tile, ends ? end : null, seat, s.chain.length);
  const hands = s.hands.map((h, i) => (i === seat ? h.filter((t) => t !== tile) : h));
  const moves = [...s.moves, { seat, type: 'play' as const, tile, ...(end ? { end } : {}), ends }];
  const newEnds = endsOf(chain) as readonly [Pip, Pip];
  const events: DominoesEvent[] = [{ type: 'play', seat, tile, end: ends ? end : null, ends: newEnds }];
  const after: DominoesState = { ...s, chain, hands, moves, mustLead: null };
  if ((hands[seat] ?? []).length === 0) {
    const out = handOver(after, 'domino', seat, ends, tile);
    return { state: out.state, events: [...events, ...out.events] };
  }
  if (isBlocked(after)) {
    const out = handOver(after, 'blocked', seat);
    return { state: out.state, events: [...events, ...out.events] };
  }
  return { state: { ...after, turn: next }, events };
}

/** The bonuses for going out with `tile` on `ends` in hand `handNo`. */
export function dominoBonuses(config: DominoesConfig, handNo: number, ends: readonly [Pip, Pip] | null, tile: Tile, seat: Seat, side: number): Bonus[] {
  const out: Bonus[] = [];
  if (config.earlyBonus === '100-75-50-25' && handNo < EARLY.length) out.push({ side, kind: 'early', points: EARLY[handNo] ?? 0, seat });
  if (ends) {
    const [l, r] = ends;
    if (config.capicu > 0 && !isDouble(tile) && hasNumber(tile, l) && hasNumber(tile, r)) out.push({ side, kind: 'capicu', points: config.capicu, seat });
    if (config.chuchazo > 0 && tile === '0-0') {
      const blanks = (l === 0 ? 1 : 0) + (r === 0 ? 1 : 0);
      if (config.chuchazoEnds === 'any' || blanks === 1) out.push({ side, kind: 'chuchazo', points: config.chuchazo, seat });
    }
  }
  return out;
}

/** Who wins a blocked hand, and whether the tie rule decided it. */
export function blockedWinner(config: DominoesConfig, hands: readonly (readonly Tile[])[], blocker: Seat, leader: Seat): { winner: number | null; byTie: boolean } {
  const n = hands.length;
  const pips = hands.map(handPips);
  const sidePips = [0, 1].map((side) => pips.reduce((sum, p, seat) => (sideOf(seat, n) === side ? sum + p : sum), 0));
  let a: number;
  let b: number;
  let countA: number;
  let countB: number;
  const blockerSide = sideOf(blocker, n);
  if (config.blockedWinner === 'blocker-or-next' && n === 4) {
    const following = (blocker + 1) % n;
    const pa = pips[blocker] ?? 0;
    const pb = pips[following] ?? 0;
    // Compare the two players: side of the blocker is "a".
    a = blockerSide === 0 ? pa : pb;
    b = blockerSide === 0 ? pb : pa;
    const ca = (hands[blocker] ?? []).length;
    const cb = (hands[following] ?? []).length;
    countA = blockerSide === 0 ? ca : cb;
    countB = blockerSide === 0 ? cb : ca;
  } else {
    a = sidePips[0] ?? 0;
    b = sidePips[1] ?? 0;
    countA = hands.reduce((sum, h, seat) => (sideOf(seat, n) === 0 ? sum + h.length : sum), 0);
    countB = hands.reduce((sum, h, seat) => (sideOf(seat, n) === 1 ? sum + h.length : sum), 0);
  }
  if (a < b) return { winner: 0, byTie: false };
  if (b < a) return { winner: 1, byTie: false };
  switch (config.blockedTie) {
    case 'none':
      return { winner: null, byTie: true };
    case 'starting':
      return { winner: sideOf(leader, n), byTie: true };
    case 'blocker':
      return { winner: blockerSide, byTie: true };
    case 'not-blocker':
      return { winner: 1 - blockerSide, byTie: true };
    case 'more-tiles':
      return { winner: countA > countB ? 0 : countB > countA ? 1 : null, byTie: true };
  }
}

/** The points the winning side scores for a hand, before bonuses. */
export function handScore(config: DominoesConfig, hands: readonly (readonly Tile[])[], winner: number, reason: 'domino' | 'blocked'): number {
  const n = hands.length;
  const pips = hands.map(handPips);
  const losers = pips.reduce((sum, p, seat) => (sideOf(seat, n) !== winner ? sum + p : sum), 0);
  const winners = pips.reduce((sum, p, seat) => (sideOf(seat, n) === winner ? sum + p : sum), 0);
  if (reason === 'blocked' && config.blockedScore === 'difference') return Math.max(0, losers - winners);
  return config.scoring === 'all' ? losers + winners : losers;
}

function handOver(s: DominoesState, reason: 'domino' | 'blocked', by: Seat, ends: readonly [Pip, Pip] | null = null, lastTile: Tile | null = null): { state: DominoesState; events: DominoesEvent[] } {
  const config = s.config;
  const n = seatCount(config);
  let winner: number | null;
  let byTie = false;
  if (reason === 'domino') {
    winner = sideOf(by, n);
  } else {
    const decided = blockedWinner(config, s.hands, by, s.leader);
    winner = decided.winner;
    byTie = decided.byTie;
  }
  // New bonuses: going out (early hands, capicú, chuchazo), or a block's pass bonuses.
  const fresh: Bonus[] = [];
  if (winner !== null && reason === 'domino' && lastTile) fresh.push(...dominoBonuses(config, s.handNo, ends, lastTile, by, winner));
  let { passBonusTaken } = s;
  if (reason === 'blocked' && config.passBonus === 'on' && lastPlay(s.moves)) {
    // Everyone would have to pass: the blocker scores for each opponent.
    for (let i = 1; i < n; i++) {
      if (sideOf((by + i) % n, n) === sideOf(by, n)) continue;
      fresh.push({ side: sideOf(by, n), kind: 'pass', points: passBonusPoints(passBonusTaken), seat: by });
      passBonusTaken = true;
    }
  }
  const base = winner === null ? 0 : handScore(config, s.hands, winner, reason);
  const scores = s.scores.map((v, side) => v + (side === winner ? base : 0) + fresh.reduce((sum, b) => (b.side === side ? sum + b.points : sum), 0));
  const bonuses = [...s.handBonuses, ...fresh];
  const points = [0, 1].map((side) => (side === winner ? base : 0) + bonuses.reduce((sum, b) => (b.side === side ? sum + b.points : sum), 0));
  const result: HandResult = { handNo: s.handNo, reason, winner, by, points, pips: s.hands.map(handPips), bonuses, hands: s.hands.map((h) => [...h]) };
  const events: DominoesEvent[] = [...fresh.map((bonus): DominoesEvent => ({ type: 'bonus', bonus })), { type: 'hand-end', result, scores }];
  const results = [...s.results, result];

  // The match ends when a side reaches the target (the higher score wins if both do), after a single hand, or at the limit.
  const [a = 0, b = 0] = scores;
  let over = false;
  let matchWinner: number | null = null;
  if (config.target <= 0) {
    over = true;
    matchWinner = winner;
  } else if ((a >= config.target || b >= config.target) && a !== b) {
    over = true;
    matchWinner = a > b ? 0 : 1;
  } else if (results.length >= MAX_HANDS) {
    over = true;
    matchWinner = a > b ? 0 : b > a ? 1 : null;
  }
  const ended: DominoesState = { ...s, scores, passBonusTaken, results, handBonuses: [] };
  if (over) {
    events.push({ type: 'match-end', winner: matchWinner, scores });
    return { state: { ...ended, over: true }, events };
  }
  const nextDeal = deal({ config, seed: s.seed, handNo: s.handNo + 1, scores, results, passBonusTaken, leader: nextLeader(s, reason, by, winner, byTie), previous: { chain: s.chain, hands: s.hands, boneyard: s.boneyard } });
  events.push(nextDeal.event);
  return { state: nextDeal.state, events };
}

/** Who leads the next hand, or null for the "double six" rule. */
function nextLeader(s: DominoesState, reason: 'domino' | 'blocked', by: Seat, winner: number | null, byTie: boolean): Seat | null {
  const n = seatCount(s.config);
  switch (s.config.nextLead) {
    case 'double-six':
      return null;
    case 'rotate':
      return (s.leader + 1) % n;
    case 'winner': {
      if (winner === null) return null;
      if (reason === 'domino') return by;
      if (byTie && s.config.blockedTie === 'blocker') return by;
      // The member of the winning side with fewer pips; on equal pips, the first in turn after the blocker.
      let best: Seat | null = null;
      for (let i = 1; i <= n; i++) {
        const seat = (by + i) % n;
        if (sideOf(seat, n) !== winner) continue;
        if (best === null || handPips(s.hands[seat] ?? []) < handPips(s.hands[best] ?? [])) best = seat;
      }
      return best;
    }
  }
}

// Codecs

export function actionText(a: DominoesAction): string {
  if (a.type !== 'play') return a.type;
  return a.end ? `${a.tile}${a.end === 'left' ? 'L' : 'R'}` : a.tile;
}

function parseAction(text: string): DominoesAction {
  const t = text.trim();
  if (t === 'pass' || t === 'draw') return { type: t };
  const m = /^([0-6]-[0-6])([LR]?)$/.exec(t);
  const tile = m?.[1];
  if (!m || !tile || !isTile(tile)) throw new Error(`"${text}" is not a domino move, such as 3-5L, 6-6, pass or draw`);
  if (!m[2]) return { type: 'play', tile };
  return { type: 'play', tile, end: m[2] === 'L' ? 'left' : 'right' };
}

const CONFIG_KEYS = ['mode', 'target', 'scoring', 'blockedScore', 'blockedWinner', 'blockedTie', 'firstLead', 'nextLead', 'earlyBonus', 'capicu', 'chuchazo', 'chuchazoEnds', 'passBonus', 'redeal', 'drawLimit'] as const;

export const CONFIG_CHOICES: { readonly [K in (typeof CONFIG_KEYS)[number]]: readonly DominoesConfig[K][] } = {
  mode: ['partnership', 'draw', 'block'],
  target: TARGETS,
  scoring: ['all', 'losers'],
  blockedScore: ['pips', 'difference'],
  blockedWinner: ['side', 'blocker-or-next'],
  blockedTie: ['none', 'starting', 'blocker', 'not-blocker', 'more-tiles'],
  firstLead: ['double-six', 'any'],
  nextLead: ['winner', 'rotate', 'double-six'],
  earlyBonus: ['none', '100-75-50-25'],
  capicu: BONUS_VALUES,
  chuchazo: BONUS_VALUES,
  chuchazoEnds: ['any', 'one-end'],
  passBonus: ['off', 'on'],
  redeal: ['never', 'five-doubles'],
  drawLimit: ['all', 'leave-two'],
};

function readConfig(json: Json): DominoesConfig {
  if (!isJsonObject(json)) return PUERTO_RICO_500;
  const out: Record<string, unknown> = {};
  for (const key of CONFIG_KEYS) {
    const value = json[key];
    out[key] = (CONFIG_CHOICES[key] as readonly unknown[]).includes(value) ? value : PUERTO_RICO_500[key];
  }
  if (typeof json.start === 'string') out.start = json.start;
  return out as unknown as DominoesConfig;
}

function configJson(c: DominoesConfig): Json {
  const out: Record<string, Json> = {};
  for (const key of CONFIG_KEYS) out[key] = c[key];
  if (c.start) out.start = c.start;
  return out;
}

const tilesFrom = (json: Json | undefined, what: string): Tile[] => {
  if (!Array.isArray(json)) throw new Error(`Dominoes: ${what} is damaged`);
  return json.map((t) => {
    if (typeof t !== 'string' || !isTile(t)) throw new Error(`Dominoes: ${what} is damaged`);
    return t;
  });
};

const isPip = (v: unknown): v is Pip => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 6;
const endsFrom = (v: Json | undefined): readonly [Pip, Pip] | null => (Array.isArray(v) && v.length === 2 && isPip(v[0]) && isPip(v[1]) ? [v[0], v[1]] : null);

function bonusFrom(j: Json): Bonus {
  const kinds: readonly string[] = ['early', 'capicu', 'chuchazo', 'pass'];
  if (!isJsonObject(j) || typeof j.side !== 'number' || typeof j.points !== 'number' || typeof j.seat !== 'number' || typeof j.kind !== 'string' || !kinds.includes(j.kind)) throw new Error('Dominoes: a bonus is damaged');
  return { side: j.side, kind: j.kind as Bonus['kind'], points: j.points, seat: j.seat };
}

const numbers = (j: Json | undefined, what: string): number[] => {
  if (!Array.isArray(j)) throw new Error(`Dominoes: ${what} is damaged`);
  return j.map((v) => {
    if (typeof v !== 'number') throw new Error(`Dominoes: ${what} is damaged`);
    return v;
  });
};

function stateFromJson(json: Json): DominoesState {
  if (!isJsonObject(json)) throw new Error('Not a dominoes position');
  const config = readConfig(json.config ?? null);
  const n = seatCount(config);
  const hands = Array.isArray(json.hands) ? json.hands.map((h) => tilesFrom(h, 'a hand')) : [];
  if (hands.length !== n) throw new Error(`Dominoes: ${hands.length} hands, not ${n}`);
  const chain = Array.isArray(json.chain)
    ? json.chain.map((p, i) => {
        if (!isJsonObject(p) || typeof p.tile !== 'string' || !isTile(p.tile) || !isPip(p.left) || !isPip(p.right)) throw new Error('Dominoes: the line is damaged');
        return { tile: p.tile, left: p.left, right: p.right, seat: typeof p.seat === 'number' ? p.seat : 0, n: typeof p.n === 'number' ? p.n : i };
      })
    : [];
  const moves = Array.isArray(json.moves)
    ? json.moves.map((m): Move => {
        if (!isJsonObject(m) || typeof m.seat !== 'number' || (m.type !== 'play' && m.type !== 'pass' && m.type !== 'draw')) throw new Error('Dominoes: a move is damaged');
        const tile = typeof m.tile === 'string' && isTile(m.tile) ? m.tile : undefined;
        const end = m.end === 'left' || m.end === 'right' ? m.end : undefined;
        return { seat: m.seat, type: m.type, ...(tile ? { tile } : {}), ...(end ? { end } : {}), ends: endsFrom(m.ends) };
      })
    : [];
  const results = Array.isArray(json.results)
    ? json.results.map((r): HandResult => {
        if (!isJsonObject(r)) throw new Error('Dominoes: a hand result is damaged');
        return {
          handNo: typeof r.handNo === 'number' ? r.handNo : 0,
          reason: r.reason === 'blocked' ? 'blocked' : 'domino',
          winner: typeof r.winner === 'number' ? r.winner : null,
          by: typeof r.by === 'number' ? r.by : 0,
          points: numbers(r.points, 'a result'),
          pips: numbers(r.pips, 'a result'),
          bonuses: Array.isArray(r.bonuses) ? r.bonuses.map(bonusFrom) : [],
          hands: Array.isArray(r.hands) ? r.hands.map((h) => tilesFrom(h, 'a result')) : [],
        };
      })
    : [];
  const seat = (v: Json | undefined, fallback: Seat): Seat => (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < n ? v : fallback);
  const state: DominoesState = {
    config,
    seed: typeof json.seed === 'string' ? json.seed : 'lesson',
    handNo: typeof json.handNo === 'number' ? json.handNo : 0,
    hands,
    boneyard: tilesFrom(json.boneyard ?? [], 'the boneyard'),
    chain,
    moves,
    leader: seat(json.leader, 0),
    turn: seat(json.turn, 0),
    mustLead: typeof json.mustLead === 'string' && isTile(json.mustLead) ? json.mustLead : null,
    scores: Array.isArray(json.scores) ? numbers(json.scores, 'the scores') : [0, 0],
    handBonuses: Array.isArray(json.handBonuses) ? json.handBonuses.map(bonusFrom) : [],
    passBonusTaken: json.passBonusTaken === true,
    results,
    over: json.over === true,
  };
  checkConservation(state);
  return state;
}

/** Every tile is in exactly one place, and the line joins up. */
export function checkConservation(s: Pick<DominoesState, 'hands' | 'boneyard' | 'chain' | 'config'>): void {
  const all = [...s.hands.flat(), ...s.boneyard, ...s.chain.map((p) => p.tile)];
  if (new Set(all).size !== all.length) throw new Error('Dominoes: a tile is in two places');
  if (all.length !== TILES.length) throw new Error(`Dominoes: ${all.length} tiles, not ${TILES.length}`);
  if (s.config.mode === 'partnership' && s.boneyard.length > 0) throw new Error('Dominoes: the partnership game has no boneyard');
  for (let i = 0; i < s.chain.length; i++) {
    const p = s.chain[i] as Placed;
    if (tileOf(p.left, p.right) !== p.tile) throw new Error(`Dominoes: ${p.tile} lies as ${p.left}-${p.right}`);
    const nextTile = s.chain[i + 1];
    if (nextTile && nextTile.left !== p.right) throw new Error('Dominoes: the line does not join up');
  }
}

function stateToJson(s: DominoesState): Json {
  return {
    config: configJson(s.config),
    seed: s.seed,
    handNo: s.handNo,
    hands: s.hands.map((h) => [...h]),
    boneyard: [...s.boneyard],
    chain: s.chain.map((p) => ({ tile: p.tile, left: p.left, right: p.right, seat: p.seat, n: p.n })),
    moves: s.moves.map((m) => ({ seat: m.seat, type: m.type, ...(m.tile ? { tile: m.tile } : {}), ...(m.end ? { end: m.end } : {}), ends: m.ends ? [...m.ends] : null })),
    leader: s.leader,
    turn: s.turn,
    mustLead: s.mustLead,
    scores: [...s.scores],
    handBonuses: s.handBonuses.map((b) => ({ ...b })),
    passBonusTaken: s.passBonusTaken,
    results: s.results.map((r) => ({ ...r, points: [...r.points], pips: [...r.pips], bonuses: r.bonuses.map((b) => ({ ...b })), hands: r.hands.map((h) => [...h]) })),
    over: s.over,
  };
}

const stateCodec: Codec<DominoesState> = {
  toJSON: stateToJson,
  fromJSON: stateFromJson,
  toText: (s) => stableStringify(stateToJson(s)),
  fromText: (text) => stateFromJson(JSON.parse(text) as Json),
};

const actionCodec: Codec<DominoesAction> = {
  toJSON: (a) => actionText(a),
  fromJSON(json) {
    if (typeof json !== 'string') throw new Error('A dominoes move is stored as text, such as 3-5L');
    return parseAction(json);
  },
  toText: actionText,
  fromText: (text) => parseAction(text),
};

const configCodec: JsonCodec<DominoesConfig> = { toJSON: configJson, fromJSON: readConfig };

function outcomeOf(s: DominoesState): Outcome | null {
  if (!s.over) return null;
  const n = seatCount(s.config);
  const single = s.config.target <= 0;
  const last = s.results[s.results.length - 1];
  const sideScore = (side: number) => (single ? (last?.points[side] ?? 0) : (s.scores[side] ?? 0));
  let winner: number | null;
  if (single) winner = last?.winner ?? null;
  else {
    const [a = 0, b = 0] = s.scores;
    winner = a > b ? 0 : b > a ? 1 : null;
  }
  const seats = Array.from({ length: n }, (_, i) => i);
  const teams = teamsOf(n);
  if (winner === null) return { reason: 'dominoes-tie', teams, results: seats.map((seat) => ({ seat, place: 1, score: sideScore(sideOf(seat, n)) })) };
  return {
    reason: single ? 'dominoes-hand' : 'dominoes-match',
    teams,
    results: seats.map((seat) => ({ seat, place: sideOf(seat, n) === winner ? 1 : 2, score: sideScore(sideOf(seat, n)) })),
  };
}

export function viewOf(s: DominoesState, seat: Seat): DominoesView {
  return {
    seat,
    config: s.config,
    handNo: s.handNo,
    hand: [...(s.hands[seat] ?? [])],
    handCounts: s.hands.map((h) => h.length),
    boneyardCount: s.boneyard.length,
    chain: s.chain,
    moves: s.moves.map((m) => (m.type === 'draw' && m.seat !== seat ? { seat: m.seat, type: 'draw' as const, ends: m.ends } : m)),
    leader: s.leader,
    turn: s.turn,
    // Only the leader knows the tile it must lead until it is played.
    mustLead: seat === s.turn ? s.mustLead : null,
    scores: s.scores,
    handBonuses: s.handBonuses,
    passBonusTaken: s.passBonusTaken,
    results: s.results,
    over: s.over,
  };
}

// What a seat can work out about the hidden tiles

/** The tiles a seat cannot see: everything not in its hand or the line. */
export function unseenTiles(v: Pick<DominoesView, 'hand' | 'chain'>): Tile[] {
  const seen = new Set<Tile>([...v.hand, ...v.chain.map((p) => p.tile)]);
  return TILES.filter((t) => !seen.has(t));
}

/** Numbers a seat is known not to hold now, from its passes and draws: it could not play on those ends. */
export function cantHave(v: Pick<DominoesView, 'moves'>, seat: Seat): Set<Pip> {
  const out = new Set<Pip>();
  const mine = v.moves.filter((m) => m.seat === seat);
  // While a seat is still drawing, the tile it just drew may be the one it plays next.
  if (mine[mine.length - 1]?.type === 'draw') return out;
  // Tiles drawn in a later draw may hold an earlier number again, so only the last draw (its kept
  // tiles could not be played on those ends either) and the passes after it count.
  let from = 0;
  mine.forEach((m, i) => {
    if (m.type === 'draw') from = i;
  });
  for (const m of mine.slice(from)) if ((m.type === 'pass' || m.type === 'draw') && m.ends) for (const e of m.ends) out.add(e);
  return out;
}

/** One unknown tile a seat holds, and what it is known not to be. */
interface Slot {
  readonly seat: Seat | null;
  readonly ok: (t: Tile) => boolean;
}

/**
 * The hidden slots: for each other seat, one per tile in hand, each with what it is known not to
 * be; plus the boneyard, which can hold anything. In the Draw game, tiles drawn later escape
 * earlier constraints, so slots are traced through the hand's history.
 */
function hiddenSlots(v: DominoesView): Slot[] {
  const n = seatCount(v.config);
  const slots: Slot[] = [];
  // Two-player hands led by the "double six" rule tell everyone that no higher double (or heavier tile) was dealt.
  const firstMove = v.moves[0];
  const ledByRule = firstMove?.type === 'play' && firstMove.tile !== undefined && (v.handNo === 0 ? v.config.firstLead === 'double-six' : v.config.nextLead === 'double-six' || ledAfterTie(v));
  const leadTile = ledByRule && n === 2 ? (firstMove?.tile ?? null) : null;
  const dealtOk = (t: Tile): boolean => {
    if (!leadTile) return true;
    if (isDouble(leadTile)) return !(isDouble(t) && heavier(t, leadTile) < 0);
    return !isDouble(t) && heavier(t, leadTile) > 0;
  };
  for (let seat = 0; seat < n; seat++) {
    if (seat === v.seat) continue;
    // Each tile held is a "vintage": dealt (0) or drawn at move i. A pass or draw by this seat at
    // move j rules out the ends then for every tile held at that moment.
    const vintages: number[] = Array.from({ length: HAND_SIZE }, () => -1);
    const rules: { at: number; ends: readonly [Pip, Pip] }[] = [];
    v.moves.forEach((m, i) => {
      if (m.seat !== seat) return;
      if ((m.type === 'pass' || m.type === 'draw') && m.ends) rules.push({ at: i, ends: m.ends });
      if (m.type === 'draw') vintages.push(i);
      if (m.type === 'play' && m.tile) {
        // Remove the vintage the played tile came from: the tile just drawn (a forced play after
        // drawing), else the oldest vintage whose rules it meets. Older vintages carry more rules,
        // so keeping the newer ones leaves every later play and the final hand still possible.
        const prev = v.moves[i - 1];
        if (prev && prev.seat === seat && prev.type === 'draw') {
          vintages.splice(vintages.lastIndexOf(i - 1), 1);
          return;
        }
        const tile = m.tile;
        const k = vintages.findIndex((at) => (at >= 0 || dealtOk(tile)) && rules.every((r) => r.at <= at || r.at >= i || (!hasNumber(tile, r.ends[0]) && !hasNumber(tile, r.ends[1]))));
        vintages.splice(k >= 0 ? k : vintages.length - 1, 1);
      }
    });
    const count = v.handCounts[seat] ?? 0;
    for (const at of vintages.slice(0, count)) {
      const apply = rules.filter((r) => r.at > at);
      slots.push({ seat, ok: (t) => (at >= 0 || dealtOk(t)) && apply.every((r) => !hasNumber(t, r.ends[0]) && !hasNumber(t, r.ends[1])) });
    }
    for (let k = vintages.length; k < count; k++) slots.push({ seat, ok: () => true });
  }
  for (let k = 0; k < v.boneyardCount; k++) slots.push({ seat: null, ok: () => true });
  return slots;
}

/** True when this hand was led by the "double six" rule after a tied blocked hand. */
function ledAfterTie(v: Pick<DominoesView, 'results' | 'config'>): boolean {
  const last = v.results[v.results.length - 1];
  return v.config.nextLead === 'winner' && last !== undefined && last.winner === null;
}

/** Fills the slots with the unseen tiles at random, keeping every rule; backtracks when the quick way fails. */
function fillSlots(slots: readonly Slot[], tiles: readonly Tile[], rng: Rng): Tile[] | null {
  const order = slots.map((slot, i) => ({ slot, i, options: tiles.filter((t) => slot.ok(t)).length })).sort((a, b) => a.options - b.options);
  for (let attempt = 0; attempt < 40; attempt++) {
    const left = rng.shuffle(tiles);
    const out: Tile[] = new Array<Tile>(slots.length);
    let ok = true;
    for (const { slot, i } of order) {
      const k = left.findIndex((t) => slot.ok(t));
      if (k < 0) {
        ok = false;
        break;
      }
      out[i] = left[k] as Tile;
      left.splice(k, 1);
    }
    if (ok) return out;
  }
  // Exact search, most constrained slot first.
  const out: Tile[] = new Array<Tile>(slots.length);
  const used = new Set<Tile>();
  const shuffled = rng.shuffle(tiles);
  const solve = (k: number): boolean => {
    const entry = order[k];
    if (!entry) return true;
    for (const t of shuffled) {
      if (used.has(t) || !entry.slot.ok(t)) continue;
      used.add(t);
      out[entry.i] = t;
      if (solve(k + 1)) return true;
      used.delete(t);
    }
    return false;
  };
  return solve(0) ? out : null;
}

/** A full state consistent with a view: the unseen tiles dealt at random to the other hands and the boneyard, keeping what passes and draws showed. */
export function sampleState(v: DominoesView, rng: Rng): DominoesState {
  const n = seatCount(v.config);
  const unseen = unseenTiles(v);
  const slots = hiddenSlots(v);
  // If the history cannot be met (a hand edited by a lesson), fall back to ignoring it.
  const filled = fillSlots(slots, unseen, rng) ?? fillSlots(slots.map((s) => ({ seat: s.seat, ok: () => true })), unseen, rng) ?? unseen;
  const hands: Tile[][] = Array.from({ length: n }, () => []);
  hands[v.seat] = [...v.hand];
  const boneyard: Tile[] = [];
  slots.forEach((slot, i) => {
    const t = filled[i] as Tile;
    if (slot.seat === null) boneyard.push(t);
    else (hands[slot.seat] as Tile[]).push(t);
  });
  return {
    config: v.config,
    seed: `sample/${rng.int(1_000_000_000)}`,
    handNo: v.handNo,
    hands,
    boneyard,
    chain: v.chain,
    moves: v.moves,
    leader: v.leader,
    turn: v.turn,
    mustLead: v.mustLead,
    scores: v.scores,
    handBonuses: v.handBonuses,
    passBonusTaken: v.passBonusTaken,
    results: v.results,
    over: v.over,
  };
}

export const dominoes: GameDef<DominoesState, DominoesAction, DominoesConfig, DominoesView, DominoesEvent & GameEvent> = {
  id: 'dominoes',
  rulesVersion: 1,
  defaultConfig: PUERTO_RICO_500,
  setup(config, rng) {
    const seed = `dominoes/${rng.int(2_147_483_647)}/${rng.int(2_147_483_647)}`;
    if (config.start) {
      // Play on from a position: the same tiles where they lay, the rules of this game.
      const from = stateFromJson(JSON.parse(config.start) as Json);
      return { ...from, config: { ...config, mode: from.config.mode }, seed };
    }
    return deal({ config, seed, handNo: 0, scores: [0, 0], results: [], passBonusTaken: false, leader: null }).state;
  },
  seats: (s) => Array.from({ length: seatCount(s.config) }, (_, i) => i),
  turn: (s) => (s.over ? null : s.turn),
  legal: legalActions,
  apply: applyAction,
  outcome: outcomeOf,
  view: viewOf,
  sample: (view, _seat, rng) => sampleState(view, rng),
  teams: (s) => teamsOf(seatCount(s.config)),
  codec: { state: stateCodec, action: actionCodec, config: configCodec },
};

/** Which preset a config is, if any. */
export function presetOf(config: DominoesConfig): string | null {
  const json = configJson(config) as Record<string, Json>;
  delete json.start;
  const key = stableStringify(json);
  return Object.entries(PRESETS).find(([, c]) => stableStringify(configJson(c)) === key)?.[0] ?? null;
}

/**
 * A position for lessons and problems; seat 0 is the student. The line is written as the tiles lie,
 * left to right ("6-6 6-4 4-1"), with who played each (`by`, default seats in turn from the
 * leader) and which was played first (`first`, default the leftmost; then the tiles to its right
 * in order, then those to its left). Hands given as null are filled with the tiles nobody named, up
 * to `counts` (seven less what each seat played, by default); the rest go to the boneyard.
 */
export function position(p: {
  mode?: Mode;
  hands: readonly (readonly Tile[] | null)[];
  line?: string;
  by?: readonly Seat[];
  first?: number;
  counts?: readonly (number | null)[];
  turn?: Seat;
  leader?: Seat;
  passes?: readonly { seat: Seat; ends: readonly [Pip, Pip] }[];
  scores?: readonly number[];
  handNo?: number;
  config?: Partial<DominoesConfig>;
}): string {
  const config: DominoesConfig = { ...PUERTO_RICO_500, ...(p.mode ? { mode: p.mode } : {}), ...p.config };
  const n = seatCount(config);
  const leader = p.leader ?? 0;
  const laid = (p.line ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const m = /^([0-6])-([0-6])$/.exec(w);
      if (!m) throw new Error(`"${w}" is not a tile as it lies, such as 6-4`);
      return [Number(m[1]) as Pip, Number(m[2]) as Pip] as const;
    });
  const first = p.first ?? 0;
  const order = [...laid.keys()].filter((i) => i >= first).concat([...laid.keys()].filter((i) => i < first).reverse());
  let chain: Placed[] = [];
  const moves: Move[] = [];
  order.forEach((i, k) => {
    const [left, right] = laid[i] as readonly [Pip, Pip];
    const seat = p.by?.[i] ?? (leader + k) % n;
    const tile = tileOf(left, right);
    const ends = endsOf(chain);
    const end: End | undefined = k === 0 ? undefined : i > first ? 'right' : 'left';
    moves.push({ seat, type: 'play', tile, ...(end ? { end } : {}), ends });
    const placed: Placed = { tile, left, right, seat, n: k };
    chain = end === 'left' ? [placed, ...chain] : [...chain, placed];
  });
  for (const pass of p.passes ?? []) moves.push({ seat: pass.seat, type: 'pass', ends: pass.ends });
  const named = new Set<Tile>([...p.hands.flatMap((h) => h ?? []), ...chain.map((c) => c.tile)]);
  const hands: Tile[][] = Array.from({ length: n }, (_, seat) => [...(p.hands[seat] ?? [])]);
  const played = (seat: Seat) => chain.filter((c) => c.seat === seat).length;
  const want = (seat: Seat) => p.counts?.[seat] ?? HAND_SIZE - played(seat);
  const boneyard: Tile[] = [];
  for (const t of TILES) {
    if (named.has(t)) continue;
    const seat = hands.findIndex((h, i) => p.hands[i] === null && h.length < want(i));
    if (seat >= 0) (hands[seat] as Tile[]).push(t);
    else boneyard.push(t);
  }
  if (config.mode === 'partnership' && boneyard.length > 0) throw new Error(`Dominoes position: ${boneyard.join(' ')} belong to no hand`);
  const state: DominoesState = {
    config,
    seed: 'lesson',
    handNo: p.handNo ?? 1,
    hands,
    boneyard,
    chain,
    moves,
    leader,
    turn: p.turn ?? 0,
    mustLead: null,
    scores: [...(p.scores ?? [0, 0])],
    handBonuses: [],
    passBonusTaken: false,
    results: [],
    over: false,
  };
  checkConservation(state);
  return stateCodec.toText(state);
}
