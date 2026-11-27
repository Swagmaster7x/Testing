/**
 * Dominoes (docs/rules/dominoes.md and docs/rules/dominoes-styles.md), behind the game contract:
 * the partnership game for four, the Draw and Block games for two or three, All Fives (the ends
 * are scored as you play, around a spinner) and Cuban partnership dominó with the double nine.
 * Every disputed rule is an option in the config, and the presets are named configs.
 *
 * Tiles are written low number first: "0-0" is the double blank (la chucha), "5-6", "6-6", and in
 * the double-nine set up to "9-9". Seats play in turn order 0, 1, 2, 3, which is counter-clockwise
 * round the table: you sit at the bottom, the next player is on your right and your partner faces
 * you.
 *
 * The layout is a line with two open ends. With a spinner (All Fives) the first double played
 * also takes two more arms, "up" and "down", once tiles touch both its sides: the layout becomes
 * a cross with up to four open ends.
 *
 * Hidden information: a seat's view holds its own hand, the layout, every play and pass, how many
 * tiles each hand and the boneyard hold, and the scores. It never holds another hand, the
 * boneyard, a tile someone else drew, or the seed that deals later hands.
 */
import type { Codec, GameDef, GameEvent, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject, stableStringify } from '../../core/json';
import type { Rng } from '../../core/rng';
import { createRng } from '../../core/rng';

export type Pip = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Tile = `${Pip}-${Pip}`;
/** Where a tile goes: an end of the line, or the spinner's third ("up") and fourth ("down") arms. */
export type End = 'left' | 'right' | 'up' | 'down';
/** Who plays and whether the tiles left over are drawn. */
export type Mode = 'partnership' | 'partnership-draw' | 'draw' | 'block' | 'draw-three' | 'block-three';
export type DominoSet = 'double-six' | 'double-nine';

/** The highest number on a set's tiles. */
export function topOf(set: DominoSet): Pip {
  return set === 'double-nine' ? 9 : 6;
}

const numbersTo = (top: number): Pip[] => Array.from({ length: top + 1 }, (_, i) => i as Pip);
const tilesTo = (top: number): Tile[] => numbersTo(top).flatMap((a) => numbersTo(top).filter((b) => b >= a).map((b): Tile => `${a}-${b}`));
const SET_NUMBERS: Readonly<Record<DominoSet, readonly Pip[]>> = { 'double-six': numbersTo(6), 'double-nine': numbersTo(9) };
const SET_TILES: Readonly<Record<DominoSet, readonly Tile[]>> = { 'double-six': tilesTo(6), 'double-nine': tilesTo(9) };

/** The numbers of a set, blank first. */
export function numbersOf(set: DominoSet): readonly Pip[] {
  return SET_NUMBERS[set];
}

/** A set's tiles, low number first, in order: 0-0, 0-1, ... 0-9, 1-1, ... */
export function tilesOfSet(set: DominoSet): readonly Tile[] {
  return SET_TILES[set];
}

/** Every pip in a set: each number is on (top + 2) halves, so 168 in the double six and 495 in the double nine. */
export function setPips(set: DominoSet): number {
  const top = topOf(set);
  return (top * (top + 1) * (top + 2)) / 2;
}

/** The double-six set, which most of the games use. */
export const PIPS: readonly Pip[] = numbersOf('double-six');
/** The 28 tiles of the double six, low number first, in order: 0-0, 0-1, ... 0-6, 1-1, ... 6-6. */
export const TILES: readonly Tile[] = tilesOfSet('double-six');
/** Every pip in the double six: each number appears eight times on seven tiles. */
export const TOTAL_PIPS = 168;
/** Tiles each player draws in the double-six line games. */
export const HAND_SIZE = 7;
/** A match never runs past this many hands; then the side ahead wins (or it is a tie). */
export const MAX_HANDS = 60;

export interface DominoesConfig {
  readonly mode: Mode;
  /** The set: double six (28 tiles) or double nine (55). */
  readonly set: DominoSet;
  /** Tiles dealt to each player; "auto" is the game's usual number (see handSize). */
  readonly hand: 'auto' | 5 | 7 | 9 | 10;
  /** Points that win the match; 0 plays a single hand. */
  readonly target: number;
  /** What the winners of a hand score: every tile left in every hand, or only the losers' tiles. */
  readonly scoring: 'all' | 'losers';
  /** A blocked hand scores the pips as `scoring` says, the losers' pips less the winners', or every tile left in hand. */
  readonly blockedScore: 'pips' | 'difference' | 'all';
  /** Who wins a blocked hand: the side with fewer pips, the fewer of the blocker and the next player, or the side of the player with the fewest. */
  readonly blockedWinner: 'side' | 'blocker-or-next' | 'player';
  /** A blocked hand with equal pips. */
  readonly blockedTie: 'none' | 'starting' | 'blocker' | 'not-blocker' | 'more-tiles';
  /** Who leads the first hand of a match: the highest double dealt (the 6-6, the 9-9), or a player drawn by lot. */
  readonly firstLead: 'double-six' | 'any';
  /** Who leads the later hands. */
  readonly nextLead: 'winner' | 'rotate' | 'double-six' | 'winner-lot' | 'winning-team';
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
  /** Drawing: until you can play, or never the last one or two tiles. */
  readonly drawLimit: 'all' | 'leave-one' | 'leave-two';
  /** The first double played is a spinner: once both its sides are covered it takes two more arms. */
  readonly spinner: 'none' | 'first-double';
  /** After each play the open ends are added up, and a multiple of five scores at once. */
  readonly fives: 'off' | 'on';
  /** The pips counted at the end of a hand: exact, or rounded to the nearest five. */
  readonly rounding: 'exact' | 'nearest-five';
  /** Points scored during play that reach the target end the match at once, or at the end of the hand. */
  readonly finish: 'hand-end' | 'at-once';
  /** A position to start from instead of a deal ("play on from here"), in state notation. */
  readonly start?: string;
}

export const PUERTO_RICO_500: DominoesConfig = {
  mode: 'partnership',
  set: 'double-six',
  hand: 'auto',
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
  spinner: 'none',
  fives: 'off',
  rounding: 'exact',
  finish: 'hand-end',
};

const NO_BONUSES = { earlyBonus: 'none', capicu: 0, chuchazo: 0 } as const;

/** All Fives (pagat): the first double is a spinner, multiples of five on the ends score at once. */
const ALL_FIVES: DominoesConfig = {
  ...PUERTO_RICO_500,
  ...NO_BONUSES,
  mode: 'draw',
  target: 250,
  scoring: 'losers',
  firstLead: 'any',
  nextLead: 'winner-lot',
  spinner: 'first-double',
  fives: 'on',
  rounding: 'nearest-five',
  finish: 'at-once',
};

/** Cuban partnership dominó with the double nine (pagat). */
export const CUBAN: DominoesConfig = {
  ...PUERTO_RICO_500,
  ...NO_BONUSES,
  set: 'double-nine',
  target: 100,
  scoring: 'losers',
  blockedWinner: 'player',
  firstLead: 'any',
  nextLead: 'winning-team',
  redeal: 'five-doubles',
};

export const PRESETS: Readonly<Record<string, DominoesConfig>> = {
  'puerto-rico-500': PUERTO_RICO_500,
  'puerto-rico-200': { ...PUERTO_RICO_500, ...NO_BONUSES, target: 200 },
  international: { ...PUERTO_RICO_500, ...NO_BONUSES, target: 200, firstLead: 'any', nextLead: 'rotate' },
  mexico: { ...PUERTO_RICO_500, ...NO_BONUSES, target: 100, scoring: 'losers', blockedTie: 'starting' },
  colombia: { ...PUERTO_RICO_500, ...NO_BONUSES, target: 100, scoring: 'losers', blockedTie: 'blocker' },
  venezuela: { ...PUERTO_RICO_500, ...NO_BONUSES, target: 100, scoring: 'losers', nextLead: 'rotate' },
  draw: { ...PUERTO_RICO_500, ...NO_BONUSES, mode: 'draw', target: 100 },
  block: { ...PUERTO_RICO_500, ...NO_BONUSES, mode: 'block', target: 100 },
  'all-fives': ALL_FIVES,
  'all-fives-three': { ...ALL_FIVES, mode: 'draw-three', target: 200 },
  'all-fives-partners': { ...ALL_FIVES, mode: 'partnership-draw', target: 200 },
  cuban: CUBAN,
  'cuban-300': { ...CUBAN, target: 300, blockedScore: 'all' },
};

export const TARGETS: readonly number[] = [0, 100, 150, 200, 250, 300, 500];
export const BONUS_VALUES: readonly number[] = [0, 50, 100];
/** Bonuses for winning hands one to four by going out (Quinientos). */
export const EARLY: readonly number[] = [100, 75, 50, 25];

/** One tile in the layout, as it lies. In the line `left` faces the left end; on an arm `left` touches the spinner. */
export interface Placed {
  readonly tile: Tile;
  readonly left: Pip;
  readonly right: Pip;
  readonly seat: Seat;
  /** Its place in the order of play this hand, from 0 for the first tile. */
  readonly n: number;
}

/** The tiles on the table. */
export interface Layout {
  /** The line, left to right. */
  readonly chain: readonly Placed[];
  /** The spinner (the first double, with a spinner rule), which is in the line; null when there is none. */
  readonly spinner: Tile | null;
  /** The spinner's third and fourth arms, from the spinner outwards. */
  readonly up: readonly Placed[];
  readonly down: readonly Placed[];
}

export const EMPTY_LAYOUT: Layout = { chain: [], spinner: null, up: [], down: [] };

/** A move in this hand, as everyone saw it. A draw shows its tile only to the drawer. */
export interface Move {
  readonly seat: Seat;
  readonly type: 'play' | 'pass' | 'draw';
  readonly tile?: Tile;
  readonly end?: End;
  /** The numbers on the open ends when the move was made (left, right, then any arms); null before the first tile. */
  readonly ends: readonly Pip[] | null;
}

export interface Bonus {
  readonly side: number;
  readonly kind: 'early' | 'capicu' | 'chuchazo' | 'pass' | 'fives';
  readonly points: number;
  readonly seat: Seat;
}

export interface HandResult {
  readonly handNo: number;
  /** Going out, a blocked hand, or (scoring as you play) a side reaching the target during the hand. */
  readonly reason: 'domino' | 'blocked' | 'target';
  /** The side that won the hand, or null when a blocked hand is tied. */
  readonly winner: number | null;
  /** Who went out, or who played the last tile of a blocked hand. */
  readonly by: Seat;
  /** Points each side scored in this hand, bonuses (and points made on the ends) included. */
  readonly points: readonly number[];
  /** Pips left in each seat's hand. */
  readonly pips: readonly number[];
  readonly bonuses: readonly Bonus[];
  /** The hands as they were shown at the end. */
  readonly hands: readonly (readonly Tile[])[];
  /** Three players: the two who tied for the fewest pips in a blocked hand and shared the count. */
  readonly split?: readonly number[];
}

export interface DominoesState extends Layout {
  readonly config: DominoesConfig;
  /** Deals the later hands of a match. Never part of a view. */
  readonly seed: string;
  readonly handNo: number;
  readonly hands: readonly (readonly Tile[])[];
  /** The boneyard in a draw game (top first); the tiles nobody holds (sleeping) otherwise. */
  readonly boneyard: readonly Tile[];
  readonly moves: readonly Move[];
  /** Who led this hand. */
  readonly leader: Seat;
  readonly turn: Seat;
  /** The tile the leader must start with (the highest double, or the heaviest tile), or null for any tile. */
  readonly mustLead: Tile | null;
  /** Match points, per side. */
  readonly scores: readonly number[];
  /** Points scored during this hand (pass bonuses, multiples of five on the ends), already in `scores`. */
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
      readonly previous: { readonly layout: Layout; readonly hands: readonly (readonly Tile[])[]; readonly boneyard: readonly Tile[] } | null;
    }
  | {
      readonly type: 'play';
      readonly seat: Seat;
      readonly tile: Tile;
      readonly end: End | null;
      /** The numbers on the open ends after the play. */
      readonly ends: readonly Pip[];
      /** Scoring as you play: the count of the open ends after the play, and what it scored. */
      readonly count?: number;
      readonly scored?: number;
      /** This tile became the spinner. */
      readonly spinner?: boolean;
    }
  | { readonly type: 'pass'; readonly seat: Seat; readonly ends: readonly Pip[] }
  | { readonly type: 'draw'; readonly seat: Seat; readonly tile: Tile; readonly left: number }
  | { readonly type: 'bonus'; readonly bonus: Bonus }
  | { readonly type: 'hand-end'; readonly result: HandResult; readonly scores: readonly number[] }
  | { readonly type: 'match-end'; readonly winner: number | null; readonly scores: readonly number[] };

export interface DominoesView extends Layout {
  readonly seat: Seat;
  readonly config: DominoesConfig;
  readonly handNo: number;
  readonly hand: readonly Tile[];
  readonly handCounts: readonly number[];
  readonly boneyardCount: number;
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

/** A tile of either set, written low number first. */
export function isTile(text: string): text is Tile {
  const m = /^([0-9])-([0-9])$/.exec(text);
  return m !== null && Number(m[1]) <= Number(m[2]);
}

/** A tile of this set. */
export function inSet(tile: Tile, set: DominoSet): boolean {
  return Number(tile[2]) <= topOf(set);
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

/** Heavier first: by pips, then by the higher number. Used to find who leads by the "highest double" rule. */
export function heavier(x: Tile, y: Tile): number {
  const d = tilePips(y) - tilePips(x);
  if (d !== 0) return d;
  return Math.max(...pipsOf(y)) - Math.max(...pipsOf(x));
}

// Seats and sides

export function seatCount(config: Pick<DominoesConfig, 'mode'>): number {
  switch (config.mode) {
    case 'partnership':
    case 'partnership-draw':
      return 4;
    case 'draw-three':
    case 'block-three':
      return 3;
    default:
      return 2;
  }
}

/** Four players play as two partnerships; two or three play each for themselves. */
export function sideCount(seats: number): number {
  return seats === 4 ? 2 : seats;
}

/** Partners share a side: seats 0 and 2 against 1 and 3. With two or three players each seat is a side. */
export function sideOf(seat: Seat, seats: number): number {
  return seats === 4 ? seat % 2 : seat;
}

export function teamsOf(seats: number): Seat[][] {
  return seats === 4
    ? [
        [0, 2],
        [1, 3],
      ]
    : Array.from({ length: seats }, (_, s) => [s]);
}

/** Whether the tiles left over after the deal are drawn (a boneyard) or sleep unused. */
export function drawing(config: Pick<DominoesConfig, 'mode'>): boolean {
  return config.mode === 'draw' || config.mode === 'draw-three' || config.mode === 'partnership-draw';
}

/**
 * Tiles dealt to each player. "auto": ten with the double nine; when the ends score as you play,
 * nine, seven or five for two, three or four players; otherwise seven. A number too large for the
 * set is cut to what it allows.
 */
export function handSize(config: Pick<DominoesConfig, 'mode' | 'set' | 'hand' | 'fives'>): number {
  const n = seatCount(config);
  const want = config.hand !== 'auto' ? config.hand : config.set === 'double-nine' ? 10 : config.fives === 'on' ? (n === 2 ? 9 : n === 3 ? 7 : 5) : HAND_SIZE;
  return Math.min(want, Math.floor(tilesOfSet(config.set).length / n));
}

/** Tiles that sleep unused in a game without drawing (the Block game, Cuban double nine). */
export function sleepingCount(config: Pick<DominoesConfig, 'mode' | 'set' | 'hand' | 'fives'>): number {
  return tilesOfSet(config.set).length - seatCount(config) * handSize(config);
}

// The layout

/** The ends of the line, left and right, or null before the first tile. */
export function endsOf(chain: readonly Placed[]): readonly [Pip, Pip] | null {
  const first = chain[0];
  const last = chain[chain.length - 1];
  if (!first || !last) return null;
  return [first.left, last.right];
}

/** An open end: where it is, the number a tile must show to go there, and what it adds to the count of the ends. */
export interface OpenEnd {
  readonly end: End;
  readonly value: Pip;
  /** A double at the end of an arm counts both halves; an arm not started yet adds nothing. */
  readonly count: number;
}

/** The spinner is in the line with a tile on each side, so its other two arms may start. */
function armsOpen(l: Layout): boolean {
  if (!l.spinner) return false;
  const k = l.chain.findIndex((p) => p.tile === l.spinner);
  return k > 0 && k < l.chain.length - 1;
}

const endCount = (p: Placed, value: number): number => (p.left === p.right ? 2 * value : value);

/**
 * The open ends: left and right, then with a spinner the third arm (once both sides of the spinner
 * are covered) and the fourth (once the third has started). Empty before the first tile.
 */
export function openEnds(l: Layout): OpenEnd[] {
  const first = l.chain[0];
  const last = l.chain[l.chain.length - 1];
  if (!first || !last) return [];
  if (l.chain.length === 1) {
    // One tile: both ends are the same tile, which counts once (a double, both halves).
    return [
      { end: 'left', value: first.left, count: first.left + first.right },
      { end: 'right', value: first.right, count: 0 },
    ];
  }
  const out: OpenEnd[] = [
    { end: 'left', value: first.left, count: endCount(first, first.left) },
    { end: 'right', value: last.right, count: endCount(last, last.right) },
  ];
  if (armsOpen(l)) {
    const sp = pipsOf(l.spinner as Tile)[0];
    const up = l.up[l.up.length - 1];
    out.push(up ? { end: 'up', value: up.right, count: endCount(up, up.right) } : { end: 'up', value: sp, count: 0 });
    if (up) {
      const down = l.down[l.down.length - 1];
      out.push(down ? { end: 'down', value: down.right, count: endCount(down, down.right) } : { end: 'down', value: sp, count: 0 });
    }
  }
  return out;
}

/** The count of the open ends (All Fives): a multiple of five scores for the player who made it. */
export function endsCount(l: Layout): number {
  return openEnds(l).reduce((sum, e) => sum + e.count, 0);
}

/** The numbers on the open ends, as a move records them; empty before the first tile. */
export function endValues(l: Layout): Pip[] {
  return openEnds(l).map((e) => e.value);
}

/** The points a count scores when the ends score: the count when it is a multiple of five, else nothing. */
export function fivesScore(count: number): number {
  return count > 0 && count % 5 === 0 ? count : 0;
}

/** The ends a tile may go on, given the line's ends (any end before the first tile). */
export function fitsEnds(tile: Tile, ends: readonly [Pip, Pip] | null): End[] {
  if (!ends) return ['left'];
  const out: End[] = [];
  if (hasNumber(tile, ends[0])) out.push('left');
  if (hasNumber(tile, ends[1])) out.push('right');
  return out;
}

/** The open ends of a layout a tile may go on, in the order left, right, up, down. */
export function fitsLayout(tile: Tile, l: Layout): End[] {
  const ends = openEnds(l);
  if (ends.length === 0) return ['left'];
  return ends.filter((e) => hasNumber(tile, e.value)).map((e) => e.end);
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

/** The layout after a tile is added; with a spinner rule the first double played becomes the spinner. */
export function placeOn(l: Layout, tile: Tile, end: End | null, seat: Seat, n: number, spinnerRule: boolean): Layout {
  if (l.chain.length > 0 && (end === 'up' || end === 'down')) {
    const open = openEnds(l).find((e) => e.end === end);
    if (!open || !hasNumber(tile, open.value)) throw new Error(`${tile} does not fit the ${end} arm`);
    const [a, b] = pipsOf(tile);
    const placed: Placed = { tile, left: open.value, right: a === open.value ? b : a, seat, n };
    return end === 'up' ? { ...l, up: [...l.up, placed] } : { ...l, down: [...l.down, placed] };
  }
  const chain = placeTile(l.chain, tile, l.chain.length === 0 ? null : end, seat, n);
  const spinner = l.spinner ?? (spinnerRule && isDouble(tile) ? tile : null);
  return { ...l, chain, spinner };
}

/** Every tile on the table. */
export function tilesOnTable(l: Layout): Placed[] {
  return [...l.chain, ...l.up, ...l.down];
}

export function canDraw(s: { readonly config: DominoesConfig; readonly boneyard: readonly unknown[] }): boolean {
  if (!drawing(s.config)) return false;
  const keep = s.config.drawLimit === 'leave-two' ? 2 : s.config.drawLimit === 'leave-one' ? 1 : 0;
  return s.boneyard.length > keep;
}

function canPlay(hand: readonly Tile[], ends: readonly Pip[]): boolean {
  if (ends.length === 0) return hand.length > 0;
  return hand.some((t) => ends.some((e) => hasNumber(t, e)));
}

/** Nobody can play and nobody can draw: the hand is blocked (trancado). */
export function isBlocked(s: Pick<DominoesState, 'hands' | 'chain' | 'boneyard' | 'config'> & Partial<Layout>): boolean {
  const ends = endValues({ chain: s.chain, spinner: s.spinner ?? null, up: s.up ?? [], down: s.down ?? [] });
  if (ends.length === 0) return false;
  if (canDraw(s)) return false;
  return s.hands.every((h) => !canPlay(h, ends));
}

// Dealing

/** Who leads a hand by the "highest double" rule: the 6-6 (or 9-9), else the highest double dealt, else the heaviest tile. */
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
  /** Who leads, or null to use the "highest double" rule (or for the first hand with any lead, a seat drawn by lot). */
  readonly leader: Seat | null;
  readonly previous?: { readonly layout: Layout; readonly hands: readonly (readonly Tile[])[]; readonly boneyard: readonly Tile[] };
}

function deal(input: DealInput): { state: DominoesState; event: DominoesEvent } {
  const { config } = input;
  const n = seatCount(config);
  const size = handSize(config);
  const set = tilesOfSet(config.set);
  const dealt = (attempt: number) => {
    const tiles = createRng(`${input.seed}/hand/${input.handNo}/${attempt}`).shuffle(set);
    return { hands: Array.from({ length: n }, (_, seat) => tiles.slice(seat * size, (seat + 1) * size)), rest: tiles.slice(n * size) };
  };
  const byLot = input.leader === null && input.handNo === 0 && config.firstLead === 'any';
  // With the double nine some tiles sleep, so a deal may hold no double: then the "highest double" rule deals again.
  const needsDouble = input.leader === null && !byLot && config.set === 'double-nine';
  const redealt = (hands: readonly (readonly Tile[])[]) => (config.redeal === 'five-doubles' && hands.some((h) => doubles(h) >= 5)) || (needsDouble && !hands.some((h) => h.some(isDouble)));
  let attempt = 0;
  let { hands, rest } = dealt(0);
  while (attempt < 50 && redealt(hands)) {
    attempt++;
    ({ hands, rest } = dealt(attempt));
  }
  let leader: Seat;
  let mustLead: Tile | null = null;
  if (input.leader !== null) {
    leader = input.leader;
  } else if (byLot) {
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
    ...EMPTY_LAYOUT,
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
  if (s.chain.length === 0) {
    if (s.mustLead) return hand.includes(s.mustLead) ? [{ type: 'play', tile: s.mustLead }] : [];
    return hand.map((tile) => ({ type: 'play', tile }));
  }
  const ends = openEnds(s);
  const out: DominoesAction[] = [];
  for (const tile of hand) for (const e of ends) if (hasNumber(tile, e.value)) out.push({ type: 'play', tile, end: e.end });
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

const layoutOf = (s: Layout): Layout => ({ chain: s.chain, spinner: s.spinner, up: s.up, down: s.down });

function applyAction(s: DominoesState, action: DominoesAction): { state: DominoesState; events: DominoesEvent[] } {
  const seat = s.over ? null : s.turn;
  if (seat === null) throw new Error('The game is over');
  const key = actionText(action);
  if (!legalActions(s, seat).some((a) => actionText(a) === key)) throw new Error(`${key} is not legal here`);
  const n = seatCount(s.config);
  const next = (seat + 1) % n;
  const before = endValues(s);
  const ends = before.length > 0 ? before : null;

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
    const events: DominoesEvent[] = [{ type: 'pass', seat, ends: before }];
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
      const after: DominoesState = { ...s, moves, scores, handBonuses, passBonusTaken };
      if (reachesTarget(s.config, scores, side)) return targetReached(after, last.seat, side, events);
    }
    return { state: { ...s, moves, turn: next, scores, handBonuses, passBonusTaken }, events };
  }

  const tile = action.tile;
  const end = s.chain.length === 0 ? null : (action.end ?? null);
  const layout = placeOn(s, tile, end, seat, tilesOnTable(s).length, s.config.spinner === 'first-double');
  const hands = s.hands.map((h, i) => (i === seat ? h.filter((t) => t !== tile) : h));
  const moves = [...s.moves, { seat, type: 'play' as const, tile, ...(end ? { end } : {}), ends }];
  const side = sideOf(seat, n);
  let { scores, handBonuses } = s;
  const madeSpinner = layout.spinner === tile && s.spinner !== tile;
  let scoring: { count: number; scored: number } | null = null;
  if (s.config.fives === 'on') {
    const count = endsCount(layout);
    const scored = fivesScore(count);
    scoring = { count, scored };
    if (scored > 0) {
      scores = scores.map((v, i) => (i === side ? v + scored : v));
      handBonuses = [...handBonuses, { side, kind: 'fives', points: scored, seat }];
    }
  }
  const events: DominoesEvent[] = [{ type: 'play', seat, tile, end, ends: endValues(layout), ...(scoring ?? {}), ...(madeSpinner ? { spinner: true } : {}) }];
  const after: DominoesState = { ...s, ...layout, hands, moves, mustLead: null, scores, handBonuses };
  if (scoring && scoring.scored > 0 && reachesTarget(s.config, scores, side)) return targetReached(after, seat, side, events);
  if ((hands[seat] ?? []).length === 0) {
    const out = handOver(after, 'domino', seat, endsOf(s.chain), tile);
    return { state: out.state, events: [...events, ...out.events] };
  }
  if (isBlocked(after)) {
    const out = handOver(after, 'blocked', seat);
    return { state: out.state, events: [...events, ...out.events] };
  }
  return { state: { ...after, turn: next }, events };
}

/** With "at once", points scored during play that reach the target end the match. */
function reachesTarget(config: DominoesConfig, scores: readonly number[], side: number): boolean {
  return config.finish === 'at-once' && config.target > 0 && (scores[side] ?? 0) >= config.target;
}

/** The match ends during a hand: the tiles left in hand are not counted. */
function targetReached(s: DominoesState, by: Seat, side: number, events: DominoesEvent[]): { state: DominoesState; events: DominoesEvent[] } {
  const sides = sideCount(seatCount(s.config));
  const points = Array.from({ length: sides }, (_, x) => s.handBonuses.reduce((sum, b) => (b.side === x ? sum + b.points : sum), 0));
  const result: HandResult = { handNo: s.handNo, reason: 'target', winner: side, by, points, pips: s.hands.map(handPips), bonuses: s.handBonuses, hands: s.hands.map((h) => [...h]) };
  const results = [...s.results, result];
  return {
    state: { ...s, results, handBonuses: [], over: true },
    events: [...events, { type: 'hand-end', result, scores: s.scores }, { type: 'match-end', winner: side, scores: s.scores }],
  };
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

/**
 * Who wins a blocked hand, whether the tie rule decided it, and (three players) the two who tied
 * for the fewest pips and share the count.
 */
export function blockedWinner(config: DominoesConfig, hands: readonly (readonly Tile[])[], blocker: Seat, leader: Seat): { winner: number | null; byTie: boolean; split: number[] } {
  const n = hands.length;
  const sides = sideCount(n);
  const pips = hands.map(handPips);
  const blockerSide = sideOf(blocker, n);
  const value: number[] = Array.from({ length: sides }, () => 0);
  const count: number[] = Array.from({ length: sides }, () => 0);
  if (config.blockedWinner === 'blocker-or-next' && n === 4) {
    // The blocker and the player after compare their own hands.
    const following = (blocker + 1) % n;
    value[blockerSide] = pips[blocker] ?? 0;
    value[1 - blockerSide] = pips[following] ?? 0;
    count[blockerSide] = (hands[blocker] ?? []).length;
    count[1 - blockerSide] = (hands[following] ?? []).length;
  } else if (config.blockedWinner === 'player') {
    // Each side is as good as its lightest hand.
    value.fill(Infinity);
    count.fill(Infinity);
    hands.forEach((h, seat) => {
      const side = sideOf(seat, n);
      const p = pips[seat] ?? 0;
      if (p < (value[side] ?? Infinity) || (p === value[side] && h.length < (count[side] ?? Infinity))) {
        value[side] = p;
        count[side] = h.length;
      }
    });
  } else {
    hands.forEach((h, seat) => {
      const side = sideOf(seat, n);
      value[side] = (value[side] ?? 0) + (pips[seat] ?? 0);
      count[side] = (count[side] ?? 0) + h.length;
    });
  }
  const low = Math.min(...value);
  const lowest = value.flatMap((v, side) => (v === low ? [side] : []));
  if (lowest.length === 1) return { winner: lowest[0] as number, byTie: false, split: [] };
  // Three players: two who tie share the third player's count; all three tied, nobody scores.
  if (sides === 3) return { winner: null, byTie: true, split: lowest.length === 2 ? lowest : [] };
  const [countA = 0, countB = 0] = count;
  switch (config.blockedTie) {
    case 'none':
      return { winner: null, byTie: true, split: [] };
    case 'starting':
      return { winner: sideOf(leader, n), byTie: true, split: [] };
    case 'blocker':
      return { winner: blockerSide, byTie: true, split: [] };
    case 'not-blocker':
      return { winner: 1 - blockerSide, byTie: true, split: [] };
    case 'more-tiles':
      return { winner: countA > countB ? 0 : countB > countA ? 1 : null, byTie: true, split: [] };
  }
}

/** A count of pips as the options take it: exact, or rounded to the nearest five ([1-2] is 5, [1-1] is 0). */
export function roundPips(config: Pick<DominoesConfig, 'rounding'>, pips: number): number {
  return config.rounding === 'nearest-five' ? Math.round(pips / 5) * 5 : pips;
}

/** The points the winning side scores for a hand, before bonuses. */
export function handScore(config: DominoesConfig, hands: readonly (readonly Tile[])[], winner: number, reason: 'domino' | 'blocked'): number {
  const n = hands.length;
  const pips = hands.map(handPips);
  const losers = pips.reduce((sum, p, seat) => (sideOf(seat, n) !== winner ? sum + p : sum), 0);
  const winners = pips.reduce((sum, p, seat) => (sideOf(seat, n) === winner ? sum + p : sum), 0);
  let points: number;
  if (reason === 'blocked' && config.blockedScore === 'difference') points = Math.max(0, losers - winners);
  else if (reason === 'blocked' && config.blockedScore === 'all') points = losers + winners;
  else points = config.scoring === 'all' ? losers + winners : losers;
  return roundPips(config, points);
}

/** Three players, two tied for the fewest pips in a blocked hand: each scores half the third player's count (rounded down to a five when counts are rounded). */
export function splitScore(config: DominoesConfig, hands: readonly (readonly Tile[])[], split: readonly number[]): number {
  const third = hands.reduce((sum, h, seat) => (split.includes(seat) ? sum : sum + handPips(h)), 0);
  const unit = config.rounding === 'nearest-five' ? 5 : 1;
  return Math.floor(roundPips(config, third) / 2 / unit) * unit;
}

function handOver(s: DominoesState, reason: 'domino' | 'blocked', by: Seat, ends: readonly [Pip, Pip] | null = null, lastTile: Tile | null = null): { state: DominoesState; events: DominoesEvent[] } {
  const config = s.config;
  const n = seatCount(config);
  const sides = sideCount(n);
  let winner: number | null;
  let byTie = false;
  let split: number[] = [];
  if (reason === 'domino') {
    winner = sideOf(by, n);
  } else {
    const decided = blockedWinner(config, s.hands, by, s.leader);
    winner = decided.winner;
    byTie = decided.byTie;
    split = decided.split;
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
  const base = Array.from({ length: sides }, () => 0);
  if (winner !== null) base[winner] = handScore(config, s.hands, winner, reason);
  else if (split.length > 0) for (const side of split) base[side] = splitScore(config, s.hands, split);
  const scores = s.scores.map((v, side) => v + (base[side] ?? 0) + fresh.reduce((sum, b) => (b.side === side ? sum + b.points : sum), 0));
  const bonuses = [...s.handBonuses, ...fresh];
  const points = base.map((p, side) => p + bonuses.reduce((sum, b) => (b.side === side ? sum + b.points : sum), 0));
  const result: HandResult = { handNo: s.handNo, reason, winner, by, points, pips: s.hands.map(handPips), bonuses, hands: s.hands.map((h) => [...h]), ...(split.length > 0 ? { split } : {}) };
  const events: DominoesEvent[] = [...fresh.map((bonus): DominoesEvent => ({ type: 'bonus', bonus })), { type: 'hand-end', result, scores }];
  const results = [...s.results, result];

  // The match ends when a side reaches the target (the higher score wins if several do), after a single hand, or at the limit.
  const top = Math.max(...scores);
  const leaders = scores.flatMap((v, side) => (v === top ? [side] : []));
  let over = false;
  let matchWinner: number | null = null;
  if (config.target <= 0) {
    over = true;
    matchWinner = winner;
  } else if (top >= config.target && leaders.length === 1) {
    over = true;
    matchWinner = leaders[0] as number;
  } else if (results.length >= MAX_HANDS) {
    over = true;
    matchWinner = leaders.length === 1 ? (leaders[0] as number) : null;
  }
  const ended: DominoesState = { ...s, scores, passBonusTaken, results, handBonuses: [] };
  if (over) {
    events.push({ type: 'match-end', winner: matchWinner, scores });
    return { state: { ...ended, over: true }, events };
  }
  const nextDeal = deal({ config, seed: s.seed, handNo: s.handNo + 1, scores, results, passBonusTaken, leader: nextLeader(s, reason, by, winner, byTie), previous: { layout: layoutOf(s), hands: s.hands, boneyard: s.boneyard } });
  events.push(nextDeal.event);
  return { state: nextDeal.state, events };
}

/** The player of a side with the fewest pips; on equal pips, the first in turn after `after`. */
function lightest(s: DominoesState, side: number, after: Seat): Seat | null {
  const n = seatCount(s.config);
  let best: Seat | null = null;
  for (let i = 1; i <= n; i++) {
    const seat = (after + i) % n;
    if (sideOf(seat, n) !== side) continue;
    if (best === null || handPips(s.hands[seat] ?? []) < handPips(s.hands[best] ?? [])) best = seat;
  }
  return best;
}

/** Who leads the next hand, or null for the "highest double" rule. */
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
      return lightest(s, winner, by);
    }
    case 'winner-lot':
      // Whoever went out; after a blocked hand, a player drawn by lot.
      if (reason === 'domino') return by;
      return createRng(`${s.seed}/lead/${s.handNo + 1}`).int(n);
    case 'winning-team': {
      if (reason === 'domino') return by;
      if (winner !== null) return byTie && s.config.blockedTie === 'blocker' ? by : lightest(s, winner, by);
      // A tie: the side that did not lead this hand, its player with the fewest pips.
      const other = sideOf((s.leader + 1) % n, n);
      return lightest(s, other, s.leader);
    }
  }
}

// Codecs

const END_LETTER: Readonly<Record<End, string>> = { left: 'L', right: 'R', up: 'U', down: 'D' };
const LETTER_END: Readonly<Record<string, End>> = { L: 'left', R: 'right', U: 'up', D: 'down' };

export function actionText(a: DominoesAction): string {
  if (a.type !== 'play') return a.type;
  return a.end ? `${a.tile}${END_LETTER[a.end]}` : a.tile;
}

/** Reads a move; tiles must belong to `set`. */
function parseAction(text: string, set: DominoSet): DominoesAction {
  const t = text.trim();
  if (t === 'pass' || t === 'draw') return { type: t };
  const m = /^([0-9]-[0-9])([LRUD]?)$/.exec(t);
  const tile = m?.[1];
  if (!m || !tile || !isTile(tile) || !inSet(tile, set)) throw new Error(`"${text}" is not a domino move, such as 3-5L, 6-6, 2-4U, pass or draw`);
  if (!m[2]) return { type: 'play', tile };
  return { type: 'play', tile, end: LETTER_END[m[2]] as End };
}

const CONFIG_KEYS = [
  'mode',
  'set',
  'hand',
  'target',
  'scoring',
  'blockedScore',
  'blockedWinner',
  'blockedTie',
  'firstLead',
  'nextLead',
  'earlyBonus',
  'capicu',
  'chuchazo',
  'chuchazoEnds',
  'passBonus',
  'redeal',
  'drawLimit',
  'spinner',
  'fives',
  'rounding',
  'finish',
] as const;

export const CONFIG_CHOICES: { readonly [K in (typeof CONFIG_KEYS)[number]]: readonly DominoesConfig[K][] } = {
  mode: ['partnership', 'partnership-draw', 'draw', 'block', 'draw-three', 'block-three'],
  set: ['double-six', 'double-nine'],
  hand: ['auto', 5, 7, 9, 10],
  target: TARGETS,
  scoring: ['all', 'losers'],
  blockedScore: ['pips', 'difference', 'all'],
  blockedWinner: ['side', 'blocker-or-next', 'player'],
  blockedTie: ['none', 'starting', 'blocker', 'not-blocker', 'more-tiles'],
  firstLead: ['double-six', 'any'],
  nextLead: ['winner', 'rotate', 'double-six', 'winner-lot', 'winning-team'],
  earlyBonus: ['none', '100-75-50-25'],
  capicu: BONUS_VALUES,
  chuchazo: BONUS_VALUES,
  chuchazoEnds: ['any', 'one-end'],
  passBonus: ['off', 'on'],
  redeal: ['never', 'five-doubles'],
  drawLimit: ['all', 'leave-one', 'leave-two'],
  spinner: ['none', 'first-double'],
  fives: ['off', 'on'],
  rounding: ['exact', 'nearest-five'],
  finish: ['hand-end', 'at-once'],
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

const tilesFrom = (json: Json | undefined, what: string, set: DominoSet): Tile[] => {
  if (!Array.isArray(json)) throw new Error(`Dominoes: ${what} is damaged`);
  return json.map((t) => {
    if (typeof t !== 'string' || !isTile(t) || !inSet(t, set)) throw new Error(`Dominoes: ${what} is damaged`);
    return t;
  });
};

const pipCheck =
  (set: DominoSet) =>
  (v: unknown): v is Pip =>
    typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= topOf(set);

function bonusFrom(j: Json): Bonus {
  const kinds: readonly string[] = ['early', 'capicu', 'chuchazo', 'pass', 'fives'];
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
  const set = config.set;
  const isPip = pipCheck(set);
  const n = seatCount(config);
  const hands = Array.isArray(json.hands) ? json.hands.map((h) => tilesFrom(h, 'a hand', set)) : [];
  if (hands.length !== n) throw new Error(`Dominoes: ${hands.length} hands, not ${n}`);
  const placedList = (j: Json | undefined, what: string): Placed[] =>
    Array.isArray(j)
      ? j.map((p, i) => {
          if (!isJsonObject(p) || typeof p.tile !== 'string' || !isTile(p.tile) || !inSet(p.tile, set) || !isPip(p.left) || !isPip(p.right)) throw new Error(`Dominoes: ${what} is damaged`);
          return { tile: p.tile, left: p.left, right: p.right, seat: typeof p.seat === 'number' ? p.seat : 0, n: typeof p.n === 'number' ? p.n : i };
        })
      : [];
  const chain = placedList(json.chain, 'the line');
  const spinner = typeof json.spinner === 'string' && isTile(json.spinner) && isDouble(json.spinner) && inSet(json.spinner, set) ? json.spinner : null;
  const up = spinner ? placedList(json.up, 'an arm') : [];
  const down = spinner ? placedList(json.down, 'an arm') : [];
  const endsFrom = (v: Json | undefined): readonly Pip[] | null => (Array.isArray(v) && v.length >= 2 && v.length <= 4 && v.every(isPip) ? v : null);
  const moves = Array.isArray(json.moves)
    ? json.moves.map((m): Move => {
        if (!isJsonObject(m) || typeof m.seat !== 'number' || (m.type !== 'play' && m.type !== 'pass' && m.type !== 'draw')) throw new Error('Dominoes: a move is damaged');
        const tile = typeof m.tile === 'string' && isTile(m.tile) && inSet(m.tile, set) ? m.tile : undefined;
        const end = m.end === 'left' || m.end === 'right' || m.end === 'up' || m.end === 'down' ? m.end : undefined;
        return { seat: m.seat, type: m.type, ...(tile ? { tile } : {}), ...(end ? { end } : {}), ends: endsFrom(m.ends) };
      })
    : [];
  const results = Array.isArray(json.results)
    ? json.results.map((r): HandResult => {
        if (!isJsonObject(r)) throw new Error('Dominoes: a hand result is damaged');
        const split = Array.isArray(r.split) ? numbers(r.split, 'a result') : [];
        return {
          handNo: typeof r.handNo === 'number' ? r.handNo : 0,
          reason: r.reason === 'blocked' ? 'blocked' : r.reason === 'target' ? 'target' : 'domino',
          winner: typeof r.winner === 'number' ? r.winner : null,
          by: typeof r.by === 'number' ? r.by : 0,
          points: numbers(r.points, 'a result'),
          pips: numbers(r.pips, 'a result'),
          bonuses: Array.isArray(r.bonuses) ? r.bonuses.map(bonusFrom) : [],
          hands: Array.isArray(r.hands) ? r.hands.map((h) => tilesFrom(h, 'a result', set)) : [],
          ...(split.length > 0 ? { split } : {}),
        };
      })
    : [];
  const seat = (v: Json | undefined, fallback: Seat): Seat => (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < n ? v : fallback);
  const sides = sideCount(n);
  const state: DominoesState = {
    config,
    seed: typeof json.seed === 'string' ? json.seed : 'lesson',
    handNo: typeof json.handNo === 'number' ? json.handNo : 0,
    hands,
    boneyard: tilesFrom(json.boneyard ?? [], 'the boneyard', set),
    chain,
    spinner,
    up,
    down,
    moves,
    leader: seat(json.leader, 0),
    turn: seat(json.turn, 0),
    mustLead: typeof json.mustLead === 'string' && isTile(json.mustLead) && inSet(json.mustLead, set) ? json.mustLead : null,
    scores: Array.isArray(json.scores) ? numbers(json.scores, 'the scores') : Array.from({ length: sides }, () => 0),
    handBonuses: Array.isArray(json.handBonuses) ? json.handBonuses.map(bonusFrom) : [],
    passBonusTaken: json.passBonusTaken === true,
    results,
    over: json.over === true,
  };
  if (state.scores.length !== sides) throw new Error(`Dominoes: ${state.scores.length} scores, not ${sides}`);
  checkConservation(state);
  return state;
}

/** Every tile is in exactly one place, and the line and the arms join up. */
export function checkConservation(s: Pick<DominoesState, 'hands' | 'boneyard' | 'chain' | 'config'> & Partial<Layout>): void {
  const set = tilesOfSet(s.config.set);
  const up = s.up ?? [];
  const down = s.down ?? [];
  const all = [...s.hands.flat(), ...s.boneyard, ...s.chain.map((p) => p.tile), ...up.map((p) => p.tile), ...down.map((p) => p.tile)];
  if (new Set(all).size !== all.length) throw new Error('Dominoes: a tile is in two places');
  if (all.length !== set.length) throw new Error(`Dominoes: ${all.length} tiles, not ${set.length}`);
  if (all.some((t) => !inSet(t, s.config.set))) throw new Error('Dominoes: a tile is not in this set');
  if (s.config.mode === 'partnership' && s.boneyard.length !== sleepingCount(s.config)) throw new Error('Dominoes: the partnership game has no boneyard to draw from');
  for (let i = 0; i < s.chain.length; i++) {
    const p = s.chain[i] as Placed;
    if (tileOf(p.left, p.right) !== p.tile) throw new Error(`Dominoes: ${p.tile} lies as ${p.left}-${p.right}`);
    const nextTile = s.chain[i + 1];
    if (nextTile && nextTile.left !== p.right) throw new Error('Dominoes: the line does not join up');
  }
  const spinner = s.spinner ?? null;
  if (spinner && !s.chain.some((p) => p.tile === spinner)) throw new Error('Dominoes: the spinner is not in the line');
  if (!spinner && (up.length > 0 || down.length > 0)) throw new Error('Dominoes: an arm with no spinner');
  if (down.length > 0 && up.length === 0) throw new Error('Dominoes: the fourth arm before the third');
  for (const arm of [up, down]) {
    let at = spinner ? pipsOf(spinner)[0] : -1;
    for (const p of arm) {
      if (tileOf(p.left, p.right) !== p.tile || p.left !== at) throw new Error('Dominoes: an arm does not join up');
      at = p.right;
    }
  }
}

function stateToJson(s: DominoesState): Json {
  const placed = (p: Placed) => ({ tile: p.tile, left: p.left, right: p.right, seat: p.seat, n: p.n });
  return {
    config: configJson(s.config),
    seed: s.seed,
    handNo: s.handNo,
    hands: s.hands.map((h) => [...h]),
    boneyard: [...s.boneyard],
    chain: s.chain.map(placed),
    // The arms only with a spinner, so the notation of a line game is as it always was.
    ...(s.spinner ? { spinner: s.spinner, up: s.up.map(placed), down: s.down.map(placed) } : {}),
    moves: s.moves.map((m) => ({ seat: m.seat, type: m.type, ...(m.tile ? { tile: m.tile } : {}), ...(m.end ? { end: m.end } : {}), ends: m.ends ? [...m.ends] : null })),
    leader: s.leader,
    turn: s.turn,
    mustLead: s.mustLead,
    scores: [...s.scores],
    handBonuses: s.handBonuses.map((b) => ({ ...b })),
    passBonusTaken: s.passBonusTaken,
    results: s.results.map((r) => ({
      handNo: r.handNo,
      reason: r.reason,
      winner: r.winner,
      by: r.by,
      points: [...r.points],
      pips: [...r.pips],
      bonuses: r.bonuses.map((b) => ({ ...b })),
      hands: r.hands.map((h) => [...h]),
      ...(r.split ? { split: [...r.split] } : {}),
    })),
    over: s.over,
  };
}

const stateCodec: Codec<DominoesState> = {
  toJSON: stateToJson,
  fromJSON: stateFromJson,
  toText: (s) => stableStringify(stateToJson(s)),
  fromText: (text) => stateFromJson(JSON.parse(text) as Json),
};

/** The set a move is read in: the position's, when there is one; records accept either set. */
function setOfContext(context: unknown): DominoSet {
  if (typeof context === 'object' && context !== null && isJsonObject((context as { config?: Json }).config ?? null)) {
    const set = ((context as { config: { set?: unknown } }).config.set ?? 'double-six') as DominoSet;
    return set === 'double-nine' ? 'double-nine' : 'double-six';
  }
  return 'double-six';
}

const actionCodec: Codec<DominoesAction> = {
  toJSON: (a) => actionText(a),
  fromJSON(json) {
    if (typeof json !== 'string') throw new Error('A dominoes move is stored as text, such as 3-5L');
    return parseAction(json, 'double-nine');
  },
  toText: actionText,
  // Notation read without a position is the double six's.
  fromText: (text, context) => parseAction(text, setOfContext(context)),
};

const configCodec: JsonCodec<DominoesConfig> = { toJSON: configJson, fromJSON: readConfig };

function outcomeOf(s: DominoesState): Outcome | null {
  if (!s.over) return null;
  const n = seatCount(s.config);
  const sides = sideCount(n);
  const single = s.config.target <= 0;
  const last = s.results[s.results.length - 1];
  const sideScore = (side: number) => (single ? (last?.points[side] ?? 0) : (s.scores[side] ?? 0));
  const all = Array.from({ length: sides }, (_, side) => sideScore(side));
  let winner: number | null;
  if (single && s.config.fives !== 'on') winner = last?.winner ?? null;
  else {
    const top = Math.max(...all);
    const leaders = all.flatMap((v, side) => (v === top ? [side] : []));
    winner = leaders.length === 1 ? (leaders[0] as number) : null;
  }
  const seats = Array.from({ length: n }, (_, i) => i);
  const teams = teamsOf(n);
  // Places by score; with two sides and a single hand, the hand's winner is first.
  const place = (side: number): number => {
    if (sides === 2) return winner === null ? 1 : side === winner ? 1 : 2;
    return 1 + all.filter((v) => v > (all[side] ?? 0)).length;
  };
  return {
    reason: winner === null ? 'dominoes-tie' : single ? 'dominoes-hand' : 'dominoes-match',
    teams,
    results: seats.map((seat) => ({ seat, place: place(sideOf(seat, n)), score: sideScore(sideOf(seat, n)) })),
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
    spinner: s.spinner,
    up: s.up,
    down: s.down,
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

/** The tiles a seat cannot see: everything in its set not in its hand or on the table. */
export function unseenTiles(v: Pick<DominoesView, 'hand' | 'chain'> & Partial<Pick<DominoesView, 'up' | 'down' | 'config'>>): Tile[] {
  const seen = new Set<Tile>([...v.hand, ...v.chain.map((p) => p.tile), ...(v.up ?? []).map((p) => p.tile), ...(v.down ?? []).map((p) => p.tile)]);
  return tilesOfSet(v.config?.set ?? 'double-six').filter((t) => !seen.has(t));
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

function missesAll(t: Tile, ends: readonly Pip[]): boolean {
  const a = Number(t[0]);
  const b = Number(t[2]);
  for (const e of ends) if (a === e || b === e) return false;
  return true;
}

/**
 * The hidden slots: for each other seat, one per tile in hand, each with what it is known not to
 * be; plus the boneyard, which can hold anything. In a draw game, tiles drawn later escape
 * earlier constraints, so slots are traced through the hand's history.
 */
function hiddenSlots(v: DominoesView): Slot[] {
  const n = seatCount(v.config);
  const slots: Slot[] = [];
  // A hand led by the "highest double" rule tells everyone that no higher double (or heavier tile) was dealt.
  const firstMove = v.moves[0];
  const ledByRule = firstMove?.type === 'play' && firstMove.tile !== undefined && (v.handNo === 0 ? v.config.firstLead === 'double-six' : v.config.nextLead === 'double-six' || ledAfterTie(v));
  const size = handSize(v.config);
  // When every tile is dealt (four with the double six) the lead tells nothing new.
  const someUndealt = n * size < tilesOfSet(v.config.set).length;
  const leadTile = ledByRule && someUndealt ? (firstMove?.tile ?? null) : null;
  const dealtOk = (t: Tile): boolean => {
    if (!leadTile) return true;
    if (isDouble(leadTile)) return !(isDouble(t) && heavier(t, leadTile) < 0);
    return !isDouble(t) && heavier(t, leadTile) > 0;
  };
  for (let seat = 0; seat < n; seat++) {
    if (seat === v.seat) continue;
    // Each tile held is a "vintage": dealt (0) or drawn at move i. A pass or draw by this seat at
    // move j rules out the ends then for every tile held at that moment.
    const vintages: number[] = Array.from({ length: size }, () => -1);
    const rules: { at: number; ends: readonly Pip[] }[] = [];
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
        const k = vintages.findIndex((at) => (at >= 0 || dealtOk(tile)) && rules.every((r) => r.at <= at || r.at >= i || missesAll(tile, r.ends)));
        vintages.splice(k >= 0 ? k : vintages.length - 1, 1);
      }
    });
    const count = v.handCounts[seat] ?? 0;
    for (const at of vintages.slice(0, count)) {
      const apply = rules.filter((r) => r.at > at);
      slots.push({ seat, ok: (t) => (at >= 0 || dealtOk(t)) && apply.every((r) => missesAll(t, r.ends)) });
    }
    for (let k = vintages.length; k < count; k++) slots.push({ seat, ok: () => true });
  }
  for (let k = 0; k < v.boneyardCount; k++) slots.push({ seat: null, ok: () => true });
  return slots;
}

/** True when this hand was led by the "highest double" rule after a tied blocked hand. */
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
    spinner: v.spinner,
    up: v.up,
    down: v.down,
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
  // 2: the double nine, the spinner and scoring as you play (milestone 14).
  rulesVersion: 2,
  defaultConfig: PUERTO_RICO_500,
  setup(config, rng) {
    const seed = `dominoes/${rng.int(2_147_483_647)}/${rng.int(2_147_483_647)}`;
    if (config.start) {
      // Play on from a position: the same tiles where they lay, the rules of this game.
      const from = stateFromJson(JSON.parse(config.start) as Json);
      const c = from.config;
      return { ...from, config: { ...config, mode: c.mode, set: c.set, hand: c.hand, spinner: c.spinner }, seed };
    }
    const sides = sideCount(seatCount(config));
    return deal({ config, seed, handNo: 0, scores: Array.from({ length: sides }, () => 0), results: [], passBonusTaken: false, leader: null }).state;
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
 * in order, then those to its left). With a spinner rule the first double played is the spinner,
 * and `up` and `down` give its other arms as the tiles lie from the spinner outwards ("1-5 5-5"),
 * played after the line. Hands given as null are filled with the tiles nobody named, up to
 * `counts` (a hand less what each seat played, by default); the rest go to the boneyard.
 */
export function position(p: {
  mode?: Mode;
  hands: readonly (readonly Tile[] | null)[];
  line?: string;
  up?: string;
  down?: string;
  by?: readonly Seat[];
  first?: number;
  counts?: readonly (number | null)[];
  turn?: Seat;
  leader?: Seat;
  passes?: readonly { seat: Seat; ends: readonly Pip[] }[];
  scores?: readonly number[];
  handNo?: number;
  config?: Partial<DominoesConfig>;
}): string {
  const config: DominoesConfig = { ...PUERTO_RICO_500, ...(p.mode ? { mode: p.mode } : {}), ...p.config };
  const n = seatCount(config);
  const top = topOf(config.set);
  const leader = p.leader ?? 0;
  const laid = (text: string | undefined) =>
    (text ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => {
        const m = /^([0-9])-([0-9])$/.exec(w);
        if (!m || Number(m[1]) > top || Number(m[2]) > top) throw new Error(`"${w}" is not a tile as it lies, such as 6-4`);
        return [Number(m[1]) as Pip, Number(m[2]) as Pip] as const;
      });
  const line = laid(p.line);
  const first = p.first ?? 0;
  const order = [...line.keys()].filter((i) => i >= first).concat([...line.keys()].filter((i) => i < first).reverse());
  let layout: Layout = EMPTY_LAYOUT;
  const moves: Move[] = [];
  const spinnerRule = config.spinner === 'first-double';
  let k = 0;
  const record = (seat: Seat, tile: Tile, end: End | undefined) => {
    const before = endValues(layout);
    moves.push({ seat, type: 'play', tile, ...(end ? { end } : {}), ends: before.length > 0 ? before : null });
  };
  for (const i of order) {
    const [left, right] = line[i] as readonly [Pip, Pip];
    const seat = p.by?.[i] ?? (leader + k) % n;
    const tile = tileOf(left, right);
    const end: End | undefined = k === 0 ? undefined : i > first ? 'right' : 'left';
    record(seat, tile, end);
    const placed: Placed = { tile, left, right, seat, n: k };
    const chain = end === 'left' ? [placed, ...layout.chain] : [...layout.chain, placed];
    layout = { ...layout, chain, spinner: layout.spinner ?? (spinnerRule && left === right ? tile : null) };
    k++;
  }
  for (const [arm, text] of [
    ['up', p.up],
    ['down', p.down],
  ] as const) {
    for (const [a, b] of laid(text)) {
      const seat = (leader + k) % n;
      const tile = tileOf(a, b);
      record(seat, tile, arm);
      layout = placeOn(layout, tile, arm, seat, k, spinnerRule);
      k++;
    }
  }
  for (const pass of p.passes ?? []) moves.push({ seat: pass.seat, type: 'pass', ends: pass.ends });
  const onTable = tilesOnTable(layout);
  const named = new Set<Tile>([...p.hands.flatMap((h) => h ?? []), ...onTable.map((c) => c.tile)]);
  const hands: Tile[][] = Array.from({ length: n }, (_, seat) => [...(p.hands[seat] ?? [])]);
  const played = (seat: Seat) => onTable.filter((c) => c.seat === seat).length;
  const want = (seat: Seat) => p.counts?.[seat] ?? handSize(config) - played(seat);
  const boneyard: Tile[] = [];
  for (const t of tilesOfSet(config.set)) {
    if (named.has(t)) continue;
    const seat = hands.findIndex((h, i) => p.hands[i] === null && h.length < want(i));
    if (seat >= 0) (hands[seat] as Tile[]).push(t);
    else boneyard.push(t);
  }
  if (config.mode === 'partnership' && boneyard.length !== sleepingCount(config)) throw new Error(`Dominoes position: ${boneyard.length} tiles belong to no hand, not ${sleepingCount(config)}`);
  const state: DominoesState = {
    config,
    seed: 'lesson',
    handNo: p.handNo ?? 1,
    hands,
    boneyard,
    ...layout,
    moves,
    leader,
    turn: p.turn ?? 0,
    mustLead: null,
    scores: [...(p.scores ?? Array.from({ length: sideCount(n) }, () => 0))],
    handBonuses: [],
    passBonusTaken: false,
    results: [],
    over: false,
  };
  checkConservation(state);
  return stateCodec.toText(state);
}
