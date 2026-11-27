/**
 * No-Limit Texas Hold'em (docs/rules/holdem.md) behind the game contract: the betting engine
 * (antes, blinds, a live straddle, the minimum raise, all-ins for less, side pots, split pots
 * and the odd chip, showdown order), a cash session with rebuys, and freezeouts with rising
 * blinds. Play chips only.
 *
 * Seats are numbered in the order of play, clockwise: the seat after the button is on its left.
 * Chips are whole numbers. The smallest chip (`unit`) is 1 in a cash game and 5 in a freezeout;
 * every raise is a whole number of units, or all-in.
 *
 * Hidden information: a seat's view holds its own hole cards, the board, every bet, the stacks
 * and the hands shown at the last showdown. It never holds another seat's hole cards, a mucked
 * hand, the deck, the burned cards, or the seed that shuffles later hands.
 */
import type { Codec, GameDef, GameEvent, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject, stableStringify } from '../../core/json';
import type { Rng } from '../../core/rng';
import { createRng } from '../../core/rng';
import type { Card } from './cards';
import { cardIndex, DECK, isCard } from './cards';
import { highValue, lowValue, showingValue } from './showdown';

export type Format = 'cash' | 'heads-up' | 'sit-and-go';
/** The game on this engine (docs/rules/poker-variants.md for all but Hold'em). */
export type PokerGame = 'holdem' | 'omaha' | 'draw' | 'stud';
export type Betting = 'no-limit' | 'pot-limit' | 'fixed-limit';
export type Street = 'preflop' | 'flop' | 'turn' | 'river' | 'predraw' | 'draw' | 'postdraw' | 'third' | 'fourth' | 'fifth' | 'sixth' | 'seventh';
/** The streets of each game, in order. The draw is not a betting round: every player still in draws in turn. */
export const STREETS_OF: Readonly<Record<PokerGame, readonly Street[]>> = {
  holdem: ['preflop', 'flop', 'turn', 'river'],
  omaha: ['preflop', 'flop', 'turn', 'river'],
  draw: ['predraw', 'draw', 'postdraw'],
  stud: ['third', 'fourth', 'fifth', 'sixth', 'seventh'],
};
export const STREETS: readonly Street[] = ['preflop', 'flop', 'turn', 'river', 'predraw', 'draw', 'postdraw', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
/** Hole cards dealt at the start of a hand (stud: two down; its first up card is dealt with them). */
export const HOLE_CARDS: Readonly<Record<PokerGame, number>> = { holdem: 2, omaha: 4, draw: 5, stud: 2 };

export interface HoldemConfig {
  readonly format: Format;
  /** Starting chips, in big blinds (of the first level, in a freezeout). */
  readonly stack: number;
  /** Hands in a cash session. */
  readonly hands: number;
  /** Hands per blind level, in a freezeout. */
  readonly levelHands: number;
  readonly ante: 'none' | 'ante' | 'big-blind-ante';
  /** Cash games: the player left of the big blind posts a live straddle of two big blinds. */
  readonly straddle: 'off' | 'live';
  /** Whether an all-in raise of at least half a full raise reopens the betting. */
  readonly shortAllIn: 'full-raise' | 'half-raise';
  readonly oddChip: 'left-of-button' | 'high-card';
  /** Whether a hand that cannot win may be thrown away unseen at the showdown. */
  readonly showdown: 'show-all' | 'muck';
  /** Prizes in a sit-and-go, in percent of the prize pool, by place. */
  readonly payouts: '65-35' | '50-30-20' | 'winner-takes-all';
  readonly game: PokerGame;
  readonly betting: Betting;
  /** Omaha and Stud: high only, or high-low eight or better. */
  readonly split: 'high' | 'high-low';
  /** Five-Card Draw: the most cards a player may draw. */
  readonly maxDraw: number;
  /** A position to start from instead of a deal ("play on from here"), in state notation. */
  readonly start?: string;
}

export const SIX_MAX_CASH: HoldemConfig = {
  format: 'cash',
  stack: 100,
  hands: 60,
  levelHands: 10,
  ante: 'none',
  straddle: 'off',
  shortAllIn: 'full-raise',
  oddChip: 'left-of-button',
  showdown: 'show-all',
  payouts: '65-35',
  game: 'holdem',
  betting: 'no-limit',
  split: 'high',
  maxDraw: 3,
};

export const PRESETS: Readonly<Record<string, HoldemConfig>> = {
  'six-max': SIX_MAX_CASH,
  'heads-up': { ...SIX_MAX_CASH, format: 'heads-up', stack: 75 },
  'sit-and-go': { ...SIX_MAX_CASH, format: 'sit-and-go', stack: 75, ante: 'big-blind-ante' },
  'home-game': { ...SIX_MAX_CASH, ante: 'ante', straddle: 'live', shortAllIn: 'half-raise' },
  'pot-limit-omaha': { ...SIX_MAX_CASH, game: 'omaha', betting: 'pot-limit' },
  'omaha-high-low': { ...SIX_MAX_CASH, game: 'omaha', betting: 'fixed-limit', split: 'high-low' },
  'five-card-draw': { ...SIX_MAX_CASH, game: 'draw', betting: 'fixed-limit' },
  'seven-card-stud': { ...SIX_MAX_CASH, game: 'stud', betting: 'fixed-limit' },
};

/** Freezeout blinds by level; after the last, they double every level. */
export const LEVELS: readonly (readonly [number, number])[] = [
  [10, 20],
  [15, 30],
  [25, 50],
  [50, 100],
  [75, 150],
  [100, 200],
  [150, 300],
  [200, 400],
  [300, 600],
  [400, 800],
  [600, 1200],
  [800, 1600],
  [1000, 2000],
];
/** In a freezeout, antes start at this level. */
export const ANTE_LEVEL = 4;

export const PAYOUTS: Readonly<Record<HoldemConfig['payouts'], readonly number[]>> = {
  '65-35': [65, 35],
  '50-30-20': [50, 30, 20],
  'winner-takes-all': [100],
};

export interface Blinds {
  readonly sb: number;
  readonly bb: number;
  /** Each player's ante, or the big blind's ante for the table; 0 when there is none at this level. */
  readonly ante: number;
  /** A live straddle; 0 when there is none. */
  readonly straddle: number;
  /** Stud: the bring-in; 0 in the other games. */
  readonly bringIn: number;
  /** The smallest chip. */
  readonly unit: number;
}

export interface Player {
  readonly stack: number;
  /** Face-down cards while dealt in this hand (two in Hold'em, four in Omaha, five in Draw); none when out. */
  readonly hole: readonly Card[];
  /** Stud: the cards dealt face up, in order. Empty in the other games. */
  readonly up: readonly Card[];
  /** Draw: how many cards this player drew this hand, or null before drawing. */
  readonly drew: number | null;
  /** Chips put in on this street. */
  readonly bet: number;
  /** Chips put in this hand, antes included. */
  readonly total: number;
  readonly folded: boolean;
  /**
   * The bet this player last matched or made on this street, or null when they have not acted
   * since the betting was last opened. Someone who has acted may raise again only after a full
   * raise (or raises adding up to one) since then.
   */
  readonly actedAt: number | null;
  /** Out of a freezeout. */
  readonly out: boolean;
  /** Buy-ins taken in a cash session, the first included. */
  readonly buyIns: number;
  /** Chips at the start of this hand. */
  readonly startStack: number;
}

export type LogKind = 'ante' | 'small-blind' | 'big-blind' | 'straddle' | 'bring-in' | 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'complete' | 'draw';

/** One entry in the hand's public log. */
export interface LogEntry {
  readonly seat: Seat;
  readonly street: Street;
  readonly kind: LogKind;
  /** Chips put in. */
  readonly amount: number;
  /** The seat's bet on this street afterwards. */
  readonly to: number;
  readonly allIn: boolean;
  /** Draw: how many cards were drawn. */
  readonly drew?: number;
}

export interface PotResult {
  readonly amount: number;
  /** Seats that could win it. */
  readonly eligible: readonly Seat[];
  readonly winners: readonly Seat[];
  /** Chips each winner took, in the order of `winners` (odd chips first). */
  readonly shares: readonly number[];
  /** High-low games: the seats that won the low half (empty when nobody qualified for low). */
  readonly lowWinners?: readonly Seat[];
}

export interface HandResult {
  readonly handNo: number;
  readonly button: Seat;
  readonly board: readonly Card[];
  readonly reason: 'fold' | 'showdown';
  /** Main pot first, then side pots. */
  readonly pots: readonly PotResult[];
  /** Uncalled chips given back, per seat. */
  readonly returned: readonly number[];
  /** Hole cards shown at the showdown, per seat; null for a hand not shown. */
  readonly shown: readonly (readonly Card[] | null)[];
  /** The value of each shown hand (see evaluate.ts), per seat. */
  readonly values: readonly (number | null)[];
  /** High-low games: each shown hand's low value (lower is better), or null when it has no low. */
  readonly lows?: readonly (number | null)[];
  /** Chips won less chips put in, per seat. */
  readonly net: readonly number[];
  /** The order hands were shown in. */
  readonly order: readonly Seat[];
}

/** Session statistics, counted from the public log of each finished hand. */
export interface SeatStats {
  readonly hands: number;
  /** Hands where this seat put chips in before the flop by choice (blinds do not count). */
  readonly vpip: number;
  /** Hands where this seat raised before the flop. */
  readonly pfr: number;
  /** Re-raises before the flop, and the hands where one was possible (facing a raise). */
  readonly threeBet: number;
  readonly threeBetChances: number;
  /** Bets and raises after the flop. */
  readonly aggressive: number;
  /** Calls after the flop. */
  readonly passive: number;
  readonly sawFlop: number;
  readonly showdowns: number;
  readonly wonShowdown: number;
}

export interface HoldemState {
  readonly config: HoldemConfig;
  /** Shuffles every hand. Never part of a view. */
  readonly seed: string;
  /** A public number drawn at the start; the CPU seats take their playing styles from it (shown after the session). */
  readonly table: number;
  readonly handNo: number;
  readonly level: number;
  readonly blinds: Blinds;
  readonly button: Seat;
  readonly players: readonly Player[];
  /** The undealt cards, top first. */
  readonly deck: readonly Card[];
  readonly burned: readonly Card[];
  /** Draw: the cards thrown away in the draw so far (they make a new deck if it runs out). */
  readonly discards: readonly Card[];
  readonly board: readonly Card[];
  readonly street: Street;
  readonly toAct: Seat | null;
  /** The bet to match on this street. */
  readonly currentBet: number;
  /** The size of the last full bet or raise on this street: the least the next raise may add. */
  readonly minRaise: number;
  /** The last seat to bet or raise on the last street with betting. */
  readonly aggressor: Seat | null;
  /** Fixed-limit: bets and raises made on this street (a bring-in is not one). */
  readonly raises: number;
  /** Fixed-limit: players with chips when this street's betting began (the cap is lifted heads-up). */
  readonly startedWith: number;
  /** This hand, in order. */
  readonly log: readonly LogEntry[];
  readonly lastHand: HandResult | null;
  /** Freezeout finishing places; null while a seat is still in. */
  readonly places: readonly (number | null)[];
  readonly stats: readonly SeatStats[];
  readonly over: boolean;
}

export type HoldemAction =
  | { readonly type: 'fold' }
  | { readonly type: 'check' }
  | { readonly type: 'call' }
  | { readonly type: 'raise'; readonly to: number }
  /** Draw: throw these cards away and be dealt as many (none: stand pat). */
  | { readonly type: 'draw'; readonly discard: readonly Card[] };

export type HoldemEvent =
  | {
      readonly type: 'deal';
      readonly handNo: number;
      readonly button: Seat;
      readonly level: number;
      readonly blinds: Blinds;
      /** Seats dealt in, from the left of the button. */
      readonly seats: readonly Seat[];
      /** How the last hand ended, so the interface can show it until this deal plays. */
      readonly previous: HandResult | null;
      /** Last hand's hole cards, for the interface to keep showing a person their own (and only theirs, or the shown ones). */
      readonly holes: readonly (readonly Card[])[];
    }
  | { readonly type: 'post'; readonly seat: Seat; readonly kind: 'ante' | 'small-blind' | 'big-blind' | 'straddle'; readonly amount: number; readonly allIn: boolean }
  | { readonly type: 'hole'; readonly seats: readonly Seat[] }
  /** Stud: a card dealt face up to each seat still in. */
  | { readonly type: 'up'; readonly street: Street; readonly cards: readonly { readonly seat: Seat; readonly card: Card }[] }
  /** Stud seventh street: a card dealt face down to each seat still in. */
  | { readonly type: 'down'; readonly seats: readonly Seat[] }
  /** Draw: a seat throws `count` cards away and is dealt as many. `before` is its hand before, for the interface to show its owner only (as `deal.holes`). */
  | { readonly type: 'drew'; readonly seat: Seat; readonly count: number; readonly before: readonly Card[] }
  | { readonly type: 'act'; readonly seat: Seat; readonly kind: LogKind; readonly amount: number; readonly to: number; readonly allIn: boolean }
  /** The bets go into the middle: `bets` per seat, `pot` everything in the middle afterwards. */
  | { readonly type: 'collect'; readonly pot: number; readonly bets: readonly number[] }
  | { readonly type: 'board'; readonly street: Street; readonly cards: readonly Card[] }
  | { readonly type: 'show'; readonly seat: Seat; readonly cards: readonly Card[]; readonly value: number }
  | { readonly type: 'muck'; readonly seat: Seat }
  | { readonly type: 'return'; readonly seat: Seat; readonly amount: number }
  /** Chips won from a pot; `low` is set (the low hand's value) for the low half of a high-low pot. */
  | { readonly type: 'win'; readonly seat: Seat; readonly amount: number; readonly pot: number; readonly value: number | null; readonly low?: number | null }
  | { readonly type: 'hand-end'; readonly result: HandResult }
  | { readonly type: 'bust'; readonly seat: Seat; readonly place: number }
  | { readonly type: 'rebuy'; readonly seat: Seat; readonly amount: number }
  | { readonly type: 'level'; readonly level: number; readonly blinds: Blinds }
  | { readonly type: 'match-end'; readonly places: readonly number[] };

export interface PlayerView extends Player {
  /** Hole cards held (dealt this hand), whether or not they can be seen. */
  readonly cards: number;
}

export interface HoldemView {
  readonly seat: Seat;
  readonly config: HoldemConfig;
  readonly table: number;
  readonly handNo: number;
  readonly level: number;
  readonly blinds: Blinds;
  readonly button: Seat;
  /** Other seats' hole cards are empty. */
  readonly players: readonly PlayerView[];
  readonly board: readonly Card[];
  readonly street: Street;
  readonly toAct: Seat | null;
  readonly currentBet: number;
  readonly minRaise: number;
  readonly aggressor: Seat | null;
  readonly log: readonly LogEntry[];
  readonly lastHand: HandResult | null;
  readonly places: readonly (number | null)[];
  readonly stats: readonly SeatStats[];
  readonly over: boolean;
  readonly raises: number;
  readonly startedWith: number;
  /** Draw: how many cards have been thrown away (the cards themselves are hidden). */
  readonly discardCount: number;
}

// Small helpers

function at<T>(list: readonly T[], i: number): T {
  const x = list[i];
  if (x === undefined) throw new RangeError(`Hold'em: no item ${i}`);
  return x;
}

export function seatCount(config: Pick<HoldemConfig, 'format'>): number {
  return config.format === 'heads-up' ? 2 : 6;
}

export const isFreezeout = (config: Pick<HoldemConfig, 'format'>): boolean => config.format !== 'cash';

/** Starting chips. */
export function startChips(config: Pick<HoldemConfig, 'format' | 'stack'>): number {
  return config.stack * (isFreezeout(config) ? 20 : 2);
}

function levelBlinds(level: number): readonly [number, number] {
  const known = LEVELS[level - 1];
  if (known) return known;
  const f = 2 ** (level - LEVELS.length);
  return [1000 * f, 2000 * f];
}

/** The blinds, ante and straddle at a level (always level 1 in a cash game). */
export function blindsAt(config: HoldemConfig, level: number): Blinds {
  const cash = !isFreezeout(config);
  const [sb, bb] = cash ? [1, 2] : levelBlinds(level);
  const unit = cash ? 1 : 5;
  if (config.game === 'stud') {
    // Stud has no blinds: everyone antes a quarter of a big blind and the low card brings it in for half of one.
    const toUnit = (x: number) => Math.max(unit, Math.round(x / unit) * unit);
    return { sb, bb, ante: toUnit(bb / 4), straddle: 0, bringIn: toUnit(bb / 2), unit };
  }
  // A straddle is a no-limit Hold'em custom.
  const straddle = cash && config.straddle === 'live' && config.game === 'holdem' && config.betting === 'no-limit' ? 2 * bb : 0;
  if (cash) return { sb, bb, ante: config.ante === 'ante' ? 1 : config.ante === 'big-blind-ante' ? bb : 0, straddle, bringIn: 0, unit };
  const ante = level < ANTE_LEVEL ? 0 : config.ante === 'ante' ? bb / 10 : config.ante === 'big-blind-ante' ? bb : 0;
  return { sb, bb, ante, straddle: 0, bringIn: 0, unit };
}

/** The level a hand is played at. */
export function levelOf(config: HoldemConfig, handNo: number): number {
  return isFreezeout(config) ? 1 + Math.floor((Math.max(1, handNo) - 1) / config.levelHands) : 1;
}

/** Hole cards a player holds: in a view, other seats' cards are hidden but counted. */
const dealtCards = (p: Player): number => (p as Partial<PlayerView>).cards ?? p.hole.length;

/** In this hand: dealt in and not folded. Works on states and on views. */
export const inHand = (p: Player): boolean => dealtCards(p) > 0 && !p.folded && !p.out;

export function seatsInHand(s: Pick<HoldemState, 'players'>): Seat[] {
  return s.players.flatMap((p, seat) => (inHand(p) ? [seat] : []));
}

/** Seats in the hand who still have chips to bet. */
function withChips(s: Pick<HoldemState, 'players'>): number {
  return s.players.filter((p) => inHand(p) && p.stack > 0).length;
}

/** Every chip in the middle: this street's bets and the pots before it. */
export function potOf(s: Pick<HoldemState, 'players'>): number {
  return s.players.reduce((sum, p) => sum + p.total, 0);
}

/** Chips a seat must put in to call (more than its stack when it can only call all-in). */
export function toCallOf(s: Pick<HoldemState, 'players' | 'currentBet'>, seat: Seat): number {
  return Math.max(0, s.currentBet - at(s.players, seat).bet);
}

/** Seats that are still in the match, from the left of `from` round to `from` itself. */
function activeFrom(s: Pick<HoldemState, 'players'>, from: Seat, dealt: boolean): Seat[] {
  const n = s.players.length;
  const out: Seat[] = [];
  for (let k = 1; k <= n; k++) {
    const seat = (from + k) % n;
    const p = at(s.players, seat);
    if (dealt ? dealtCards(p) > 0 && !p.out : !p.out && p.stack > 0) out.push(seat);
  }
  return out;
}

/** The seats dealt in this hand, from the left of the button (the button last). */
export function dealtOrder(s: Pick<HoldemState, 'players' | 'button'>): Seat[] {
  return activeFrom(s, s.button, true);
}

/** The small blind, big blind and straddle seats of this hand. */
export function blindSeats(s: Pick<HoldemState, 'players' | 'button' | 'log'>): { sb: Seat | null; bb: Seat | null; straddle: Seat | null } {
  const find = (kind: LogKind) => s.log.find((e) => e.kind === kind)?.seat ?? null;
  return { sb: find('small-blind'), bb: find('big-blind'), straddle: find('straddle') };
}

/**
 * A seat's position this hand: BTN, SB, BB, then UTG (first to act before the flop), HJ, CO as
 * the table fills. Heads-up, the button is also the small blind and is called BTN.
 */
export function positionName(s: Pick<HoldemState, 'players' | 'button'>, seat: Seat): string {
  const order = dealtOrder(s);
  const n = order.length;
  if (seat === s.button) return 'BTN';
  if (n === 2) return 'BB';
  const i = order.indexOf(seat);
  if (i === 0) return 'SB';
  if (i === 1) return 'BB';
  const middle = n - 3;
  const names = middle >= 3 ? ['UTG', 'HJ', 'CO'] : middle === 2 ? ['UTG', 'CO'] : ['UTG'];
  return names[i - 2] ?? 'UTG';
}

/** Whether a seat must still act on this street (in the draw: whether it has still to draw). */
function needsToAct(s: Pick<HoldemState, 'players' | 'currentBet' | 'street'>, seat: Seat): boolean {
  const p = at(s.players, seat);
  if (s.street === 'draw') return inHand(p) && p.drew === null;
  if (!inHand(p) || p.stack === 0) return false;
  if (p.bet < s.currentBet) return true;
  if (p.actedAt !== null) return false;
  // Nobody acts when nobody is left to bet against.
  return withChips(s) >= 2;
}

function nextToAct(s: Pick<HoldemState, 'players' | 'currentBet' | 'street'>, from: Seat): Seat | null {
  const n = s.players.length;
  for (let k = 1; k <= n; k++) {
    const seat = (from + k) % n;
    if (needsToAct(s, seat)) return seat;
  }
  return null;
}

/** What a seat needs to know about the betting: works on states and on views. */
export type BettingView = Pick<HoldemState, 'players' | 'currentBet' | 'minRaise' | 'config' | 'street' | 'raises' | 'startedWith' | 'blinds'>;

/** Fixed-limit: the small bet (a big blind) or the big bet (two) for a street. */
export function betSize(s: Pick<HoldemState, 'config' | 'blinds'>, street: Street): number {
  const big = street === 'turn' || street === 'river' || street === 'postdraw' || street === 'fifth' || street === 'sixth' || street === 'seventh';
  return big ? 2 * s.blinds.bb : s.blinds.bb;
}

/** Stud's fourth street: any player still in showing a pair allows the big bet. */
function openPair(s: Pick<HoldemState, 'players'>): boolean {
  return s.players.some((p) => inHand(p) && new Set(p.up.map((c) => c[0])).size < p.up.length);
}

/** Stud's third street before anyone has acted: the bring-in is still to be made. */
export function bringInDue(s: Pick<HoldemState, 'config' | 'street' | 'currentBet' | 'players'>): boolean {
  return s.config.game === 'stud' && s.street === 'third' && s.currentBet === 0 && s.players.every((p) => p.actedAt === null);
}

/** Whether a seat that is to act may raise: it has not acted since the betting was opened, or a full raise has been made since. */
export function mayRaise(s: BettingView, seat: Seat): boolean {
  const p = at(s.players, seat);
  if (p.bet + p.stack <= s.currentBet) return false;
  // A raise needs someone left to call it.
  if (!s.players.some((q, i) => i !== seat && inHand(q) && q.stack > 0)) return false;
  if (s.config.betting === 'fixed-limit' && s.startedWith > 2 && s.raises >= 4) return false;
  return p.actedAt === null || s.currentBet - p.actedAt >= s.minRaise;
}

/**
 * The bets a seat may make, as totals for this street. No-limit and pot-limit: every amount from
 * the least raise to the most (all-in, or the pot), on the chip grid; fixed-limit: one amount (two
 * on Stud's fourth street with a pair showing: the small or the big bet). An amount short of the
 * least is allowed only all-in.
 */
export function raiseTargets(s: BettingView, seat: Seat): { min: number; max: number; fixed: readonly number[] | null } | null {
  if (!mayRaise(s, seat)) return null;
  const p = at(s.players, seat);
  const allIn = p.bet + p.stack;
  if (s.config.betting === 'fixed-limit') {
    const size = s.minRaise;
    const targets: number[] = [];
    if (s.currentBet < size) targets.push(size);
    else targets.push(s.currentBet + size);
    if (s.config.game === 'stud' && s.street === 'fourth' && s.currentBet === 0 && openPair(s)) targets.push(2 * s.blinds.bb);
    const fixed = [...new Set(targets.map((t) => Math.min(t, allIn)))];
    return { min: Math.min(...fixed), max: Math.max(...fixed), fixed };
  }
  let max = allIn;
  if (s.config.betting === 'pot-limit') {
    const pot = s.players.reduce((sum, q) => sum + q.total, 0);
    max = Math.min(allIn, s.currentBet + pot + Math.max(0, s.currentBet - p.bet));
  }
  return { min: Math.min(max, s.currentBet + s.minRaise), max, fixed: null };
}

/** The least and most a seat may raise to, or null when it may not raise. A raise below `min` is only allowed all-in (`max`). */
export function raiseRange(s: BettingView, seat: Seat): { min: number; max: number } | null {
  const t = raiseTargets(s, seat);
  return t ? { min: t.min, max: t.max } : null;
}

/** Every way to draw: throw away none to `maxDraw` of the five cards. */
export function drawChoices(hole: readonly Card[], maxDraw: number): Card[][] {
  const out: Card[][] = [];
  const pick = (from: number, chosen: Card[]) => {
    out.push([...chosen]);
    if (chosen.length === maxDraw) return;
    for (let i = from; i < hole.length; i++) {
      chosen.push(hole[i] as Card);
      pick(i + 1, chosen);
      chosen.pop();
    }
  };
  pick(0, []);
  return out;
}

/** What the legal actions depend on: works on states and on a seat's own view. */
export type LegalView = BettingView & Pick<HoldemState, 'over' | 'toAct'>;

/** The actions a seat may take: from the rules (a state) or from its own view. */
export function legalOf(s: LegalView, seat: Seat): HoldemAction[] {
  return legalActions(s, seat);
}

function legalActions(s: LegalView, seat: Seat): HoldemAction[] {
  if (s.over || s.toAct !== seat) return [];
  if (s.street === 'draw') return drawChoices(at(s.players, seat).hole, s.config.maxDraw).map((discard) => ({ type: 'draw', discard }));
  if (bringInDue(s)) {
    const p = at(s.players, seat);
    const most = p.bet + p.stack;
    return [...new Set([Math.min(s.blinds.bringIn, most), Math.min(s.blinds.bb, most)])].map((to) => ({ type: 'raise', to }));
  }
  const out: HoldemAction[] = toCallOf(s, seat) > 0 ? [{ type: 'fold' }, { type: 'call' }] : [{ type: 'check' }];
  const t = raiseTargets(s, seat);
  if (t?.fixed) for (const to of t.fixed) out.push({ type: 'raise', to });
  else if (t) {
    for (let to = t.min; to < t.max; to += s.blinds.unit) out.push({ type: 'raise', to });
    out.push({ type: 'raise', to: t.max });
  }
  return out;
}

function isLegal(s: HoldemState, seat: Seat, a: HoldemAction): boolean {
  if (s.over || s.toAct !== seat) return false;
  if (s.street === 'draw') {
    if (a.type !== 'draw') return false;
    const hole = at(s.players, seat).hole;
    return a.discard.length <= s.config.maxDraw && new Set(a.discard).size === a.discard.length && a.discard.every((c) => hole.includes(c));
  }
  if (bringInDue(s)) return a.type === 'raise' && legalActions(s, seat).some((b) => b.type === 'raise' && b.to === a.to);
  const owe = toCallOf(s, seat);
  switch (a.type) {
    case 'fold':
    case 'call':
      return owe > 0;
    case 'check':
      return owe === 0;
    case 'draw':
      return false;
    case 'raise': {
      const t = raiseTargets(s, seat);
      if (!t || !Number.isInteger(a.to)) return false;
      if (t.fixed) return t.fixed.includes(a.to);
      if (a.to === t.max) return true;
      return a.to >= t.min && a.to < t.max && (a.to - t.min) % s.blinds.unit === 0;
    }
  }
}

// The table, while an action is applied

type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type MPlayer = Mutable<Omit<Player, 'hole' | 'up'>> & { hole: Card[]; up: Card[] };
type Work = Mutable<Omit<HoldemState, 'players' | 'deck' | 'burned' | 'board' | 'discards' | 'log' | 'places' | 'stats'>> & {
  players: MPlayer[];
  deck: Card[];
  burned: Card[];
  board: Card[];
  discards: Card[];
  log: LogEntry[];
  places: (number | null)[];
  stats: SeatStats[];
};

function work(s: HoldemState): Work {
  return {
    ...s,
    players: s.players.map((p) => ({ ...p, hole: [...p.hole], up: [...p.up] })),
    deck: [...s.deck],
    burned: [...s.burned],
    board: [...s.board],
    discards: [...s.discards],
    log: [...s.log],
    places: [...s.places],
    stats: [...s.stats],
  };
}

function put(p: MPlayer, amount: number, intoBet: boolean): void {
  p.stack -= amount;
  p.total += amount;
  if (intoBet) p.bet += amount;
}

/** The first street of a game: where the forced bets go and what "before the flop" means in statistics. */
export const firstStreet = (game: PokerGame): Street => STREETS_OF[game][0] ?? 'preflop';

function post(w: Work, events: HoldemEvent[], seat: Seat, amount: number, kind: 'ante' | 'small-blind' | 'big-blind' | 'straddle'): void {
  const p = at(w.players, seat);
  const chips = Math.min(amount, p.stack);
  put(p, chips, kind !== 'ante');
  w.log.push({ seat, street: firstStreet(w.config.game), kind, amount: chips, to: p.bet, allIn: p.stack === 0 });
  events.push({ type: 'post', seat, kind, amount: chips, allIn: p.stack === 0 });
}

const EMPTY_STATS: SeatStats = { hands: 0, vpip: 0, pfr: 0, threeBet: 0, threeBetChances: 0, aggressive: 0, passive: 0, sawFlop: 0, showdowns: 0, wonShowdown: 0 };

function draw(w: Work): Card {
  if (w.deck.length === 0) {
    // Draw poker: the cards already thrown away are shuffled to make a new deck.
    w.deck = createRng(`${w.seed}/hand/${w.handNo}/again/${w.discards.length}`).shuffle(w.discards);
    w.discards = [];
  }
  const card = w.deck.shift();
  if (!card) throw new Error("Hold'em: the deck ran out");
  return card;
}

/** Stud: the seat that must bring it in, the one showing the lowest up card (clubs lowest on a tie). */
export function bringInSeat(s: Pick<HoldemState, 'players'>): Seat | null {
  let best: Seat | null = null;
  s.players.forEach((p, seat) => {
    if (!inHand(p) || p.up.length === 0) return;
    const card = p.up[0] as Card;
    if (best === null || cardIndex(card) < cardIndex(at(s.players, best).up[0] as Card)) best = seat;
  });
  return best;
}

/** Stud: the seat whose up cards make the best hand, which acts first from fourth street on. */
export function bestShowingSeat(s: Pick<HoldemState, 'players'>): Seat | null {
  let best: Seat | null = null;
  let value = -1;
  s.players.forEach((p, seat) => {
    if (!inHand(p) || p.stack === 0) return;
    const v = showingValue(p.up);
    if (v > value) {
      value = v;
      best = seat;
    }
  });
  return best;
}

/** Deals the next hand: rebuys, the level, the button, antes and blinds, hole cards. Leaves `toAct` null if nobody can bet. */
function startHand(w: Work, events: HoldemEvent[], moveButton: boolean, deck?: readonly Card[]): void {
  const config = w.config;
  const game = config.game;
  if (!isFreezeout(config)) {
    w.players.forEach((p, seat) => {
      if (p.stack > 0) return;
      const amount = startChips(config);
      p.stack = amount;
      p.buyIns += 1;
      events.push({ type: 'rebuy', seat, amount });
    });
  }
  w.handNo += 1;
  const level = levelOf(config, w.handNo);
  if (level !== w.level) {
    w.level = level;
    w.blinds = blindsAt(config, level);
    events.push({ type: 'level', level, blinds: w.blinds });
  }
  if (moveButton) {
    const next = activeFrom(w, w.button, false)[0];
    if (next !== undefined) w.button = next;
  }
  const previousHoles = w.players.map((p) => [...p.hole, ...p.up]);
  for (const p of w.players) {
    p.hole = [];
    p.up = [];
    p.drew = null;
    p.bet = 0;
    p.total = 0;
    p.folded = false;
    p.actedAt = null;
    p.startStack = p.stack;
  }
  w.board = [];
  w.burned = [];
  w.discards = [];
  w.log = [];
  w.street = firstStreet(game);
  w.aggressor = null;
  w.toAct = null;
  w.raises = 0;

  // The seats dealt in, from the left of the button; the button is last.
  const order = activeFrom(w, w.button, false);
  const button = w.button;
  const blinds = w.blinds;
  events.push({ type: 'deal', handNo: w.handNo, button, level: w.level, blinds, seats: order, previous: w.lastHand, holes: previousHoles });
  w.deck = deck ? [...deck] : createRng(`${w.seed}/hand/${w.handNo}`).shuffle(DECK);

  if (game === 'stud') {
    // Antes, two cards down and one up; the lowest up card brings it in.
    for (const seat of order) post(w, events, seat, blinds.ante, 'ante');
    for (let round = 0; round < 2; round++) for (const seat of order) at(w.players, seat).hole.push(draw(w));
    events.push({ type: 'hole', seats: order });
    const ups = order.map((seat) => ({ seat, card: draw(w) }));
    for (const { seat, card } of ups) at(w.players, seat).up.push(card);
    events.push({ type: 'up', street: 'third', cards: ups });
    w.currentBet = 0;
    w.minRaise = blinds.bb;
    w.startedWith = withChips(w);
    const first = bringInSeat(w);
    w.toAct = first !== null && at(w.players, first).stack > 0 && withChips(w) >= 2 ? first : null;
    return;
  }

  const headsUp = order.length === 2;
  const sb = headsUp ? button : at(order, 0);
  const bb = headsUp ? at(order, 0) : at(order, 1);
  const straddler = blinds.straddle > 0 && order.length >= 3 && at(w.players, at(order, 2)).stack > blinds.straddle ? at(order, 2) : null;
  if (blinds.ante > 0 && config.ante === 'ante') for (const seat of order) post(w, events, seat, blinds.ante, 'ante');
  post(w, events, sb, blinds.sb, 'small-blind');
  post(w, events, bb, blinds.bb, 'big-blind');
  if (blinds.ante > 0 && config.ante === 'big-blind-ante') post(w, events, bb, blinds.ante, 'ante');
  if (straddler !== null) post(w, events, straddler, blinds.straddle, 'straddle');
  w.currentBet = straddler !== null ? blinds.straddle : blinds.bb;
  w.minRaise = w.currentBet;
  // Fixed-limit: the big blind is the first bet of the round.
  w.raises = 1;
  w.startedWith = withChips(w);

  for (let round = 0; round < HOLE_CARDS[game]; round++) for (const seat of order) at(w.players, seat).hole.push(draw(w));
  events.push({ type: 'hole', seats: order });
  w.toAct = nextToAct(w, straddler ?? bb);
}

/** The first seat to act on a street after the first: left of the button, or in Stud the best hand showing. */
function firstToAct(w: Work): Seat | null {
  if (w.config.game === 'stud') {
    const best = bestShowingSeat(w);
    if (best === null) return null;
    return nextToAct(w, (best - 1 + w.players.length) % w.players.length);
  }
  return nextToAct(w, w.button);
}

/**
 * Ends the betting on a street: gathers the bets and deals the next street (or begins the draw),
 * or runs the cards out when nobody can bet. Returns 'showdown' after the last street, 'betting'
 * when a seat is to act (to bet, or to draw).
 */
function closeStreet(w: Work, events: HoldemEvent[]): 'betting' | 'showdown' {
  const streets = STREETS_OF[w.config.game];
  for (;;) {
    if (w.street !== 'draw') events.push({ type: 'collect', pot: potOf(w), bets: w.players.map((p) => p.bet) });
    for (const p of w.players) {
      p.bet = 0;
      p.actedAt = null;
    }
    w.currentBet = 0;
    w.toAct = null;
    const i = streets.indexOf(w.street);
    if (i < 0 || i === streets.length - 1) return 'showdown';
    const street = at(streets, i + 1);
    w.street = street;
    w.minRaise = w.config.betting === 'fixed-limit' ? betSize(w, street) : w.blinds.bb;
    w.raises = 0;
    if (street === 'draw') {
      // Everyone still in draws in turn, all-in or not, from the left of the button.
      w.toAct = nextToAct(w, w.button);
      if (w.toAct !== null) return 'betting';
      continue;
    }
    if (street === 'postdraw') {
      // No cards are dealt after the draw.
    } else if (w.config.game === 'stud') {
      w.burned.push(draw(w));
      const live = dealtOrder(w).filter((seat) => inHand(at(w.players, seat)));
      if (street === 'seventh') {
        for (const seat of live) at(w.players, seat).hole.push(draw(w));
        events.push({ type: 'down', seats: live });
      } else {
        const ups = live.map((seat) => ({ seat, card: draw(w) }));
        for (const { seat, card } of ups) at(w.players, seat).up.push(card);
        events.push({ type: 'up', street, cards: ups });
      }
    } else {
      w.burned.push(draw(w));
      const cards = Array.from({ length: street === 'flop' ? 3 : 1 }, () => draw(w));
      w.board.push(...cards);
      events.push({ type: 'board', street, cards });
    }
    w.startedWith = withChips(w);
    if (withChips(w) >= 2) {
      w.aggressor = null;
      const first = firstToAct(w);
      if (first !== null) {
        w.toAct = first;
        return 'betting';
      }
    }
  }
}

/** Uncalled chips to give back, and the main and side pots, from what each seat put in. */
export function settle(players: readonly Player[]): { returned: number[]; pots: { amount: number; eligible: Seat[] }[] } {
  const totals = players.map((p) => p.total);
  const returned = totals.map(() => 0);
  const ranked = [...totals.keys()].sort((a, b) => at(totals, b) - at(totals, a));
  const top = ranked[0];
  const second = ranked[1];
  if (top !== undefined) {
    const excess = at(totals, top) - (second === undefined ? 0 : at(totals, second));
    if (excess > 0 && inHand(at(players, top))) {
      returned[top] = excess;
      totals[top] = at(totals, top) - excess;
    }
  }
  const live = players.flatMap((p, seat) => (inHand(p) ? [seat] : []));
  const pots: { amount: number; eligible: Seat[] }[] = [];
  for (;;) {
    const eligible = live.filter((seat) => at(totals, seat) > 0);
    if (eligible.length === 0) break;
    const cap = Math.min(...eligible.map((seat) => at(totals, seat)));
    let amount = 0;
    totals.forEach((t, seat) => {
      const take = Math.min(t, cap);
      amount += take;
      totals[seat] = t - take;
    });
    pots.push({ amount, eligible });
  }
  const left = totals.reduce((a, b) => a + b, 0);
  if (left > 0) {
    const last = pots[pots.length - 1];
    if (last) last.amount += left;
    else pots.push({ amount: left, eligible: live });
  }
  return { returned, pots };
}

/** Winners in the order odd chips go to them: left of the button first, or the highest hole card first. */
function oddChipOrder(w: Work, winners: readonly Seat[]): Seat[] {
  const n = w.players.length;
  if (w.config.oddChip === 'high-card') {
    const high = (seat: Seat) => Math.max(...at(w.players, seat).hole.map(cardIndex));
    return [...winners].sort((a, b) => high(b) - high(a));
  }
  return [...winners].sort((a, b) => ((a - w.button - 1 + n) % n) - ((b - w.button - 1 + n) % n));
}

/** Splits a pot in whole chips; any odd chips go one each to the winners in odd-chip order. */
function split(w: Work, amount: number, winners: readonly Seat[]): { seat: Seat; share: number }[] {
  const ordered = oddChipOrder(w, winners);
  const unit = w.blinds.unit;
  const units = Math.floor(amount / unit);
  const rest = amount - units * unit;
  const each = Math.floor(units / ordered.length);
  const odd = units - each * ordered.length;
  return ordered.map((seat, i) => ({ seat, share: each * unit + (i < odd ? unit : 0) + (i === 0 ? rest : 0) }));
}

/** The order hands are shown: the last to bet or raise first, else the first seat left of the button; then round the table. */
function showOrder(w: Work, live: readonly Seat[]): Seat[] {
  const n = w.players.length;
  const fromButton = (seat: Seat) => (seat - w.button - 1 + n) % n;
  const first = w.aggressor !== null && live.includes(w.aggressor) ? w.aggressor : [...live].sort((a, b) => fromButton(a) - fromButton(b))[0];
  if (first === undefined) return [];
  return [...live].sort((a, b) => ((a - first + n) % n) - ((b - first + n) % n));
}

function countStats(w: Work, result: HandResult): SeatStats[] {
  const dealt = new Set(dealtOrder(w));
  return w.stats.map((st, seat) => {
    if (!dealt.has(seat)) return st;
    const mine = w.log.filter((e) => e.seat === seat);
    const opening = firstStreet(w.config.game);
    const pre = mine.filter((e) => e.street === opening);
    // A re-raise chance: acting before the flop when exactly one other player has raised.
    let raises = 0;
    let acted = false;
    let chance = false;
    let threeBet = false;
    for (const e of w.log) {
      if (e.street !== opening) break;
      const voluntary = e.kind === 'fold' || e.kind === 'check' || e.kind === 'call' || e.kind === 'raise' || e.kind === 'complete';
      if (e.seat === seat && voluntary && !acted) {
        acted = true;
        chance = raises === 1;
        threeBet = chance && e.kind === 'raise';
      }
      if (e.kind === 'raise') raises += 1;
    }
    const post = mine.filter((e) => e.street !== opening);
    const foldedPre = pre.some((e) => e.kind === 'fold');
    // "Saw the flop": in Draw, reached the draw; in Stud, reached fourth street.
    const sawNext = w.config.game === 'draw' ? w.log.some((e) => e.street === 'postdraw') || at(w.players, seat).drew !== null : w.config.game === 'stud' ? at(w.players, seat).up.length >= 2 : w.board.length >= 3;
    const atShowdown = result.reason === 'showdown' && !at(w.players, seat).folded;
    return {
      hands: st.hands + 1,
      vpip: st.vpip + (pre.some((e) => e.kind === 'call' || e.kind === 'raise' || e.kind === 'complete') ? 1 : 0),
      pfr: st.pfr + (pre.some((e) => e.kind === 'raise' || e.kind === 'complete') ? 1 : 0),
      threeBet: st.threeBet + (threeBet ? 1 : 0),
      threeBetChances: st.threeBetChances + (chance ? 1 : 0),
      aggressive: st.aggressive + post.filter((e) => e.kind === 'bet' || e.kind === 'raise').length,
      passive: st.passive + post.filter((e) => e.kind === 'call').length,
      sawFlop: st.sawFlop + (!foldedPre && sawNext ? 1 : 0),
      showdowns: st.showdowns + (atShowdown ? 1 : 0),
      wonShowdown: st.wonShowdown + (atShowdown && result.pots.some((p) => p.winners.includes(seat)) ? 1 : 0),
    };
  });
}

/** Every card a seat plays with: its hole cards and, in Stud, its up cards. */
const allCards = (p: Pick<Player, 'hole' | 'up'>): Card[] => [...p.hole, ...p.up];

/** Pays the pots out and records the hand. High-low pots are split in halves, the odd chip to the high half. */
function payOut(w: Work, events: HoldemEvent[], reason: 'fold' | 'showdown'): void {
  const live = seatsInHand(w);
  const { returned, pots } = settle(w.players);
  const n = w.players.length;
  const game = w.config.game;
  const hiLo = w.config.split === 'high-low' && (game === 'omaha' || game === 'stud');
  const values: (number | null)[] = Array.from({ length: n }, () => null);
  const lows: (number | null)[] = Array.from({ length: n }, () => null);
  const shown: (Card[] | null)[] = Array.from({ length: n }, () => null);
  let order: Seat[] = [];
  const strength = new Map<Seat, number>();
  const low = new Map<Seat, number | null>();
  if (reason === 'showdown') {
    for (const seat of live) {
      const p = at(w.players, seat);
      strength.set(seat, highValue(game, p.hole, p.up, w.board));
      if (hiLo) low.set(seat, lowValue(game, p.hole, p.up, w.board));
    }
    order = showOrder(w, live);
    // When anyone is all-in, or in a high-low game, every hand is turned up; otherwise a beaten hand may be mucked.
    const everyone = hiLo || w.config.showdown === 'show-all' || live.some((seat) => at(w.players, seat).stack === 0);
    const best = pots.map(() => -1);
    for (const seat of order) {
      const v = strength.get(seat) ?? 0;
      const contests = pots.flatMap((pot, k) => (pot.eligible.includes(seat) ? [k] : []));
      const cards = allCards(at(w.players, seat));
      if (everyone || contests.some((k) => v >= at(best, k))) {
        for (const k of contests) best[k] = Math.max(at(best, k), v);
        shown[seat] = cards;
        values[seat] = v;
        lows[seat] = low.get(seat) ?? null;
        events.push({ type: 'show', seat, cards, value: v });
      } else {
        events.push({ type: 'muck', seat });
      }
    }
  }
  returned.forEach((amount, seat) => {
    if (amount <= 0) return;
    at(w.players, seat).stack += amount;
    events.push({ type: 'return', seat, amount });
  });
  const won = Array.from({ length: n }, () => 0);
  const results: PotResult[] = pots.map((pot, k) => {
    let highWinners = pot.eligible;
    let lowWinners: Seat[] = [];
    if (pot.eligible.length > 1) {
      const top = Math.max(...pot.eligible.map((seat) => strength.get(seat) ?? -1));
      highWinners = pot.eligible.filter((seat) => strength.get(seat) === top);
      if (hiLo) {
        const qualified = pot.eligible.filter((seat) => (low.get(seat) ?? null) !== null);
        if (qualified.length > 0) {
          const bestLow = Math.min(...qualified.map((seat) => low.get(seat) as number));
          lowWinners = qualified.filter((seat) => low.get(seat) === bestLow);
        }
      }
    }
    const unit = w.blinds.unit;
    const lowHalf = lowWinners.length > 0 ? Math.floor(pot.amount / unit / 2) * unit : 0;
    const shares = new Map<Seat, number>();
    const pay = (amount: number, winners: readonly Seat[], isLow: boolean) => {
      for (const { seat, share } of split(w, amount, winners)) {
        at(w.players, seat).stack += share;
        won[seat] = at(won, seat) + share;
        shares.set(seat, (shares.get(seat) ?? 0) + share);
        events.push({ type: 'win', seat, amount: share, pot: k, value: isLow ? null : (values[seat] ?? null), ...(isLow ? { low: lows[seat] ?? null } : {}) });
      }
    };
    pay(pot.amount - lowHalf, highWinners, false);
    if (lowHalf > 0) pay(lowHalf, lowWinners, true);
    return { amount: pot.amount, eligible: pot.eligible, winners: [...shares.keys()], shares: [...shares.values()], ...(hiLo ? { lowWinners } : {}) };
  });
  const result: HandResult = {
    handNo: w.handNo,
    button: w.button,
    board: [...w.board],
    reason,
    pots: results,
    returned,
    shown,
    values,
    ...(hiLo ? { lows } : {}),
    net: w.players.map((p, seat) => at(won, seat) + at(returned, seat) - p.total),
    order,
  };
  events.push({ type: 'hand-end', result });
  w.stats = countStats(w, result);
  w.lastHand = result;
  for (const p of w.players) {
    p.bet = 0;
    p.total = 0;
    p.actedAt = null;
  }
  w.currentBet = 0;
}

/** Players knocked out of a freezeout take the next places down; of two out in one hand, the one who started it with more chips finishes higher. */
function knockOuts(w: Work, events: HoldemEvent[]): void {
  const remaining = w.players.filter((p) => !p.out).length;
  const busted = w.players.flatMap((p, seat) => (!p.out && p.stack === 0 ? [seat] : [])).sort((a, b) => at(w.players, a).startStack - at(w.players, b).startStack);
  let worst = remaining;
  for (let i = 0; i < busted.length; ) {
    const start = at(w.players, at(busted, i)).startStack;
    let j = i;
    while (j < busted.length && at(w.players, at(busted, j)).startStack === start) j++;
    const place = worst - (j - i) + 1;
    for (const seat of busted.slice(i, j)) {
      at(w.players, seat).out = true;
      w.places[seat] = place;
      events.push({ type: 'bust', seat, place });
    }
    worst -= j - i;
    i = j;
  }
}

/** The end of a hand: pay out, knock out, and deal the next hand, or end the match. Hands nobody can bet in play themselves out. */
function endHand(w: Work, events: HoldemEvent[], reason: 'fold' | 'showdown'): void {
  for (let why = reason; ; ) {
    payOut(w, events, why);
    let over: boolean;
    if (isFreezeout(w.config)) {
      knockOuts(w, events);
      const left = w.players.flatMap((p, seat) => (p.out ? [] : [seat]));
      over = left.length <= 1;
      if (over) for (const seat of left) w.places[seat] = 1;
    } else {
      over = w.handNo >= w.config.hands;
    }
    if (over) {
      w.over = true;
      w.toAct = null;
      events.push({ type: 'match-end', places: placesOf(w) });
      return;
    }
    startHand(w, events, true);
    if (w.toAct !== null) return;
    closeStreet(w, events);
    why = 'showdown';
  }
}

/** Final places: freezeout finishing order, or chips won in a cash session. */
function placesOf(s: Pick<HoldemState, 'players' | 'places' | 'config'>): number[] {
  if (isFreezeout(s.config)) return s.places.map((p) => p ?? 1);
  const net = netChips(s);
  return net.map((x) => 1 + net.filter((y) => y > x).length);
}

/** Chips won or lost in a cash session: chips now less all the chips bought. */
export function netChips(s: Pick<HoldemState, 'players' | 'config'>): number[] {
  const start = startChips(s.config);
  return s.players.map((p) => p.stack + p.total - p.buyIns * start);
}

function applyAction(s: HoldemState, action: HoldemAction): { state: HoldemState; events: HoldemEvent[] } {
  const seat = s.toAct;
  if (seat === null || s.over) throw new Error("Hold'em: the game is over");
  if (!isLegal(s, seat, action)) throw new Error(`Hold'em: ${actionText(action)} is not legal for seat ${seat}`);
  const w = work(s);
  const events: HoldemEvent[] = [];
  const p = at(w.players, seat);
  let kind: LogKind;
  let amount = 0;
  switch (action.type) {
    case 'fold':
      p.folded = true;
      kind = 'fold';
      break;
    case 'check':
      p.actedAt = w.currentBet;
      kind = 'check';
      break;
    case 'call':
      amount = Math.min(w.currentBet - p.bet, p.stack);
      put(p, amount, true);
      p.actedAt = w.currentBet;
      kind = 'call';
      break;
    case 'draw': {
      // Throw the cards away and be dealt as many; the count is public, the cards are not.
      const before = [...p.hole];
      for (const card of action.discard) {
        p.hole.splice(p.hole.indexOf(card), 1);
        w.discards.push(card);
      }
      for (let i = 0; i < action.discard.length; i++) p.hole.push(draw(w));
      p.drew = action.discard.length;
      kind = 'draw';
      events.push({ type: 'drew', seat, count: action.discard.length, before });
      break;
    }
    case 'raise': {
      amount = action.to - p.bet;
      const increase = action.to - w.currentBet;
      const fixed = w.config.betting === 'fixed-limit';
      if (bringInDue(s) && action.to < w.minRaise) {
        // Stud: the low card brings it in for less than a bet; it is not a bet for the cap.
        put(p, amount, true);
        w.currentBet = action.to;
        p.actedAt = action.to;
        kind = 'bring-in';
        break;
      }
      // Completing a bring-in (or a short bet) to a full small bet counts as the round's bet.
      const completes = fixed && w.currentBet > 0 && w.currentBet < w.minRaise && action.to === w.minRaise;
      kind = completes ? 'complete' : w.currentBet === 0 ? 'bet' : 'raise';
      put(p, amount, true);
      const full = completes || increase >= w.minRaise;
      const reopens = full || (w.config.shortAllIn === 'half-raise' && 2 * increase >= w.minRaise);
      if (full && !completes) w.minRaise = increase;
      if (full) w.raises += 1;
      if (reopens) {
        w.players.forEach((q, i) => {
          if (i !== seat) q.actedAt = null;
        });
      }
      w.currentBet = action.to;
      p.actedAt = action.to;
      w.aggressor = seat;
      break;
    }
  }
  const entry: LogEntry = { seat, street: w.street, kind, amount, to: p.bet, allIn: p.stack === 0 && kind !== 'fold' && kind !== 'check' && kind !== 'draw', ...(action.type === 'draw' ? { drew: action.discard.length } : {}) };
  w.log.push(entry);
  if (action.type !== 'draw') events.push({ type: 'act', seat, kind, amount, to: p.bet, allIn: entry.allIn });

  if (seatsInHand(w).length === 1) {
    events.push({ type: 'collect', pot: potOf(w), bets: w.players.map((q) => q.bet) });
    endHand(w, events, 'fold');
  } else {
    const next = nextToAct(w, seat);
    if (next !== null) w.toAct = next;
    else if (closeStreet(w, events) === 'showdown') endHand(w, events, 'showdown');
  }
  return { state: w, events };
}

// Codecs

export function actionText(a: HoldemAction): string {
  if (a.type === 'draw') return `d${[...a.discard].sort((x, y) => cardIndex(y) - cardIndex(x)).join('')}`;
  return a.type === 'raise' ? `r${a.to}` : a.type;
}

function parseAction(text: string): HoldemAction {
  const raw = text.trim();
  const t = raw.toLowerCase();
  if (t === 'fold' || t === 'check' || t === 'call') return { type: t };
  const d = /^d((?:[2-9TJQKA][cdhs])*)$/i.exec(raw);
  if (d) {
    const cards = (d[1] ?? '').match(/../g) ?? [];
    const discard = cards.map((c) => `${(c[0] ?? '').toUpperCase()}${(c[1] ?? '').toLowerCase()}`);
    if (!discard.every(isCard)) throw new Error(`"${text}" is not a draw, such as d (stand pat) or dKs7h`);
    return { type: 'draw', discard };
  }
  const m = /^r(\d+)$/.exec(t);
  if (!m) throw new Error(`"${text}" is not a poker action, such as fold, check, call, r60 (raise to 60) or dKs7h (draw two)`);
  return { type: 'raise', to: Number(m[1]) };
}

const CONFIG_KEYS = ['format', 'stack', 'hands', 'levelHands', 'ante', 'straddle', 'shortAllIn', 'oddChip', 'showdown', 'payouts', 'game', 'betting', 'split', 'maxDraw'] as const;

export const CONFIG_CHOICES: { readonly [K in (typeof CONFIG_KEYS)[number]]: readonly HoldemConfig[K][] } = {
  format: ['cash', 'heads-up', 'sit-and-go'],
  stack: [20, 50, 75, 100],
  hands: [10, 30, 60, 100],
  levelHands: [6, 10, 15],
  ante: ['none', 'ante', 'big-blind-ante'],
  straddle: ['off', 'live'],
  shortAllIn: ['full-raise', 'half-raise'],
  oddChip: ['left-of-button', 'high-card'],
  showdown: ['show-all', 'muck'],
  payouts: ['65-35', '50-30-20', 'winner-takes-all'],
  game: ['holdem', 'omaha', 'draw', 'stud'],
  betting: ['no-limit', 'pot-limit', 'fixed-limit'],
  split: ['high', 'high-low'],
  maxDraw: [3, 5],
};

function readConfig(json: Json): HoldemConfig {
  if (!isJsonObject(json)) return SIX_MAX_CASH;
  const out: Record<string, unknown> = {};
  for (const key of CONFIG_KEYS) {
    const value = json[key];
    out[key] = (CONFIG_CHOICES[key] as readonly unknown[]).includes(value) ? value : SIX_MAX_CASH[key];
  }
  if (typeof json.start === 'string') out.start = json.start;
  return out as unknown as HoldemConfig;
}

function configJson(c: HoldemConfig): Json {
  const out: Record<string, Json> = {};
  for (const key of CONFIG_KEYS) out[key] = c[key];
  if (c.start) out.start = c.start;
  return out;
}

const fail = (what: string): never => {
  throw new Error(`Hold'em: ${what} is damaged`);
};
const num = (v: Json | undefined, what: string): number => (typeof v === 'number' && Number.isFinite(v) ? v : fail(what));
const seatOrNull = (v: Json | undefined, what: string): Seat | null => (v === null || v === undefined ? null : num(v, what));
const cardsFrom = (v: Json | undefined, what: string): Card[] => {
  if (!Array.isArray(v)) return fail(what);
  return v.map((c) => (typeof c === 'string' && isCard(c) ? c : fail(what)));
};
const STREET_SET = new Set<string>(STREETS);
const KINDS = new Set<string>(['ante', 'small-blind', 'big-blind', 'straddle', 'bring-in', 'fold', 'check', 'call', 'bet', 'raise', 'complete', 'draw']);

function blindsFrom(v: Json | undefined): Blinds {
  if (!isJsonObject(v)) return fail('the blinds');
  return { sb: num(v.sb, 'sb'), bb: num(v.bb, 'bb'), ante: num(v.ante, 'ante'), straddle: num(v.straddle, 'straddle'), bringIn: num(v.bringIn ?? 0, 'the bring-in'), unit: num(v.unit, 'unit') };
}

function playerFrom(v: Json): Player {
  if (!isJsonObject(v)) return fail('a player');
  return {
    stack: num(v.stack, 'a stack'),
    hole: cardsFrom(v.hole, 'hole cards'),
    up: cardsFrom(v.up ?? [], 'up cards'),
    drew: v.drew === null || v.drew === undefined ? null : num(v.drew, 'a draw'),
    bet: num(v.bet ?? 0, 'a bet'),
    total: num(v.total ?? 0, 'a total'),
    folded: v.folded === true,
    actedAt: seatOrNull(v.actedAt, 'actedAt'),
    out: v.out === true,
    buyIns: num(v.buyIns ?? 1, 'buy-ins'),
    startStack: num(v.startStack ?? v.stack, 'a starting stack'),
  };
}

function logFrom(v: Json): LogEntry {
  if (!isJsonObject(v) || typeof v.street !== 'string' || !STREET_SET.has(v.street) || typeof v.kind !== 'string' || !KINDS.has(v.kind)) return fail('the hand log');
  return { seat: num(v.seat, 'a seat'), street: v.street as Street, kind: v.kind as LogKind, amount: num(v.amount, 'an amount'), to: num(v.to, 'a bet'), allIn: v.allIn === true, ...(typeof v.drew === 'number' ? { drew: v.drew } : {}) };
}

function resultFrom(v: Json | undefined): HandResult | null {
  if (v === null || v === undefined) return null;
  if (!isJsonObject(v) || !Array.isArray(v.pots) || !Array.isArray(v.returned) || !Array.isArray(v.shown) || !Array.isArray(v.values) || !Array.isArray(v.net) || !Array.isArray(v.order)) return fail('the last hand');
  return {
    handNo: num(v.handNo, 'a hand number'),
    button: num(v.button, 'the button'),
    board: cardsFrom(v.board, 'the board'),
    reason: v.reason === 'fold' ? 'fold' : 'showdown',
    pots: v.pots.map((p) => {
      if (!isJsonObject(p) || !Array.isArray(p.eligible) || !Array.isArray(p.winners) || !Array.isArray(p.shares)) return fail('a pot');
      return { amount: num(p.amount, 'a pot'), eligible: p.eligible.map((x) => num(x, 'a seat')), winners: p.winners.map((x) => num(x, 'a seat')), shares: p.shares.map((x) => num(x, 'a share')), ...(Array.isArray(p.lowWinners) ? { lowWinners: p.lowWinners.map((x) => num(x, 'a seat')) } : {}) };
    }),
    returned: v.returned.map((x) => num(x, 'a return')),
    shown: v.shown.map((x) => (x === null ? null : cardsFrom(x, 'shown cards'))),
    values: v.values.map((x) => (x === null ? null : num(x, 'a hand value'))),
    ...(Array.isArray(v.lows) ? { lows: v.lows.map((x) => (x === null ? null : num(x, 'a low value'))) } : {}),
    net: v.net.map((x) => num(x, 'a result')),
    order: v.order.map((x) => num(x, 'a seat')),
  };
}

function statsFrom(v: Json | undefined, n: number): SeatStats[] {
  if (!Array.isArray(v)) return Array.from({ length: n }, () => EMPTY_STATS);
  return v.map((x) => {
    if (!isJsonObject(x)) return fail('the statistics');
    const out: Record<string, number> = {};
    for (const key of Object.keys(EMPTY_STATS)) out[key] = num(x[key] ?? 0, 'a statistic');
    return out as unknown as SeatStats;
  });
}

function stateFromJson(json: Json): HoldemState {
  if (!isJsonObject(json) || !Array.isArray(json.players)) return fail('the state');
  const config = readConfig(json.config ?? null);
  const players = json.players.map(playerFrom);
  const n = players.length;
  if (n < 2 || n > 10) return fail('the seats');
  const street = typeof json.street === 'string' && STREET_SET.has(json.street) ? (json.street as Street) : 'preflop';
  const level = num(json.level ?? 1, 'the level');
  const s: HoldemState = {
    config,
    seed: typeof json.seed === 'string' ? json.seed : 'position',
    table: num(json.table ?? 0, 'the table'),
    handNo: num(json.handNo ?? 1, 'the hand number'),
    level,
    blinds: json.blinds === undefined ? blindsAt(config, level) : blindsFrom(json.blinds),
    button: num(json.button ?? 0, 'the button'),
    players,
    deck: cardsFrom(json.deck ?? [], 'the deck'),
    burned: cardsFrom(json.burned ?? [], 'the burned cards'),
    discards: cardsFrom(json.discards ?? [], 'the discards'),
    board: cardsFrom(json.board ?? [], 'the board'),
    street,
    toAct: seatOrNull(json.toAct, 'the seat to act'),
    currentBet: num(json.currentBet ?? 0, 'the bet'),
    minRaise: num(json.minRaise ?? 0, 'the minimum raise'),
    aggressor: seatOrNull(json.aggressor, 'the aggressor'),
    raises: num(json.raises ?? 0, 'the raises'),
    startedWith: num(json.startedWith ?? 0, 'the players at the start of the round'),
    log: Array.isArray(json.log) ? json.log.map(logFrom) : [],
    lastHand: resultFrom(json.lastHand),
    places: Array.isArray(json.places) ? json.places.map((p) => seatOrNull(p, 'a place')) : players.map(() => null),
    stats: statsFrom(json.stats, n),
    over: json.over === true,
  };
  if (s.toAct !== null && (s.toAct < 0 || s.toAct >= n)) return fail('the seat to act');
  if (s.button < 0 || s.button >= n) return fail('the button');
  checkCards(s);
  return s;
}

function stateToJson(s: HoldemState): Json {
  return {
    config: configJson(s.config),
    seed: s.seed,
    table: s.table,
    handNo: s.handNo,
    level: s.level,
    blinds: { ...s.blinds },
    button: s.button,
    players: s.players.map((p) => ({ ...p, hole: [...p.hole], up: [...p.up] })),
    deck: [...s.deck],
    burned: [...s.burned],
    discards: [...s.discards],
    board: [...s.board],
    street: s.street,
    toAct: s.toAct,
    currentBet: s.currentBet,
    minRaise: s.minRaise,
    aggressor: s.aggressor,
    raises: s.raises,
    startedWith: s.startedWith,
    log: s.log.map((e) => JSON.parse(JSON.stringify(e)) as Json),
    lastHand: s.lastHand ? (JSON.parse(JSON.stringify(s.lastHand)) as Json) : null,
    places: [...s.places],
    stats: s.stats.map((x) => ({ ...x })),
    over: s.over,
  };
}

/** No card is in two places, and while a hand is dealt every card is somewhere. */
export function checkCards(s: Pick<HoldemState, 'players' | 'deck' | 'burned' | 'board'> & { readonly discards?: readonly Card[] }): void {
  const all = [...s.players.flatMap((p) => [...p.hole, ...(p.up ?? [])]), ...s.deck, ...s.burned, ...s.board, ...(s.discards ?? [])];
  if (new Set(all).size !== all.length) throw new Error("Hold'em: a card is in two places");
  if (all.length !== 0 && all.length !== DECK.length) throw new Error(`Hold'em: ${all.length} cards, not ${DECK.length}`);
}

/** Every chip bought is on the table: in a stack or in the middle. */
export function checkChips(s: HoldemState): void {
  const start = startChips(s.config);
  const bought = s.players.reduce((sum, p) => sum + p.buyIns * start, 0);
  const held = s.players.reduce((sum, p) => sum + p.stack + p.total, 0);
  if (held !== bought) throw new Error(`Hold'em: ${held} chips on the table, ${bought} bought`);
  for (const p of s.players) if (p.stack < 0 || p.bet < 0 || p.total < p.bet) throw new Error("Hold'em: a stack or bet is out of range");
}

const stateCodec: Codec<HoldemState> = {
  toJSON: stateToJson,
  fromJSON: stateFromJson,
  toText: (s) => stableStringify(stateToJson(s)),
  fromText: (text) => stateFromJson(JSON.parse(text) as Json),
};

const actionCodec: Codec<HoldemAction> = {
  toJSON: (a) => actionText(a),
  fromJSON(json) {
    if (typeof json !== 'string') throw new Error('A poker action is stored as text, such as call or r60');
    return parseAction(json);
  },
  toText: actionText,
  fromText: (text) => parseAction(text),
};

const configCodec: JsonCodec<HoldemConfig> = { toJSON: configJson, fromJSON: readConfig };

function outcomeOf(s: HoldemState): Outcome | null {
  if (!s.over) return null;
  const places = placesOf(s);
  if (!isFreezeout(s.config)) {
    const net = netChips(s);
    return { reason: 'holdem-session', results: s.players.map((_, seat) => ({ seat, place: at(places, seat), score: at(net, seat) })) };
  }
  const prizes = PAYOUTS[s.config.format === 'heads-up' ? 'winner-takes-all' : s.config.payouts];
  // Seats tied for a place share the prizes of the places they cover.
  const prizeOf = (place: number) => {
    const tied = places.filter((p) => p === place).length;
    let sum = 0;
    for (let k = place; k < place + tied; k++) sum += prizes[k - 1] ?? 0;
    return sum / tied;
  };
  return { reason: 'holdem-tournament', results: s.players.map((_, seat) => ({ seat, place: at(places, seat), score: prizeOf(at(places, seat)) })) };
}

export function viewOf(s: HoldemState, seat: Seat): HoldemView {
  const { start: _start, ...config } = s.config;
  return {
    seat,
    config,
    table: s.table,
    handNo: s.handNo,
    level: s.level,
    blinds: s.blinds,
    button: s.button,
    players: s.players.map((p, i) => ({ ...p, hole: i === seat ? p.hole : [], cards: p.hole.length })),
    board: s.board,
    street: s.street,
    toAct: s.toAct,
    currentBet: s.currentBet,
    minRaise: s.minRaise,
    aggressor: s.aggressor,
    log: s.log,
    lastHand: s.lastHand,
    places: s.places,
    stats: s.stats,
    over: s.over,
    raises: s.raises,
    startedWith: s.startedWith,
    discardCount: s.discards.length,
  };
}

/** The cards a seat cannot see: everything but its hole cards, the board and every up card. */
export function unseenCards(v: Pick<HoldemView, 'players' | 'board' | 'seat'>): Card[] {
  const seen = new Set<Card>([...at(v.players, v.seat).hole, ...v.board, ...v.players.flatMap((p) => p.up)]);
  return DECK.filter((c) => !seen.has(c));
}

/** A full state consistent with a view: the unseen cards dealt at random to the other hands, the burn and the deck. */
export function sampleState(v: HoldemView, rng: Rng): HoldemState {
  const unseen = rng.shuffle(unseenCards(v));
  const players: Player[] = v.players.map((p, i) => {
    const { cards, ...rest } = p;
    return { ...rest, hole: i === v.seat ? p.hole : unseen.splice(0, cards) };
  });
  // A burn before each street dealt after the first: the flop, turn and river, or Stud's later streets.
  const streets = STREETS_OF[v.config.game];
  const burnedCount = v.config.game === 'draw' ? 0 : Math.max(0, streets.indexOf(v.street));
  const burned = unseen.splice(0, burnedCount);
  const discards = unseen.splice(0, v.discardCount);
  const dealt = players.some((p) => p.hole.length > 0);
  return {
    config: v.config,
    seed: `sample/${rng.int(1_000_000_000)}`,
    table: v.table,
    handNo: v.handNo,
    level: v.level,
    blinds: v.blinds,
    button: v.button,
    players,
    deck: dealt ? unseen : [],
    burned: dealt ? burned : [],
    discards: dealt ? discards : [],
    board: v.board,
    street: v.street,
    toAct: v.toAct,
    currentBet: v.currentBet,
    minRaise: v.minRaise,
    aggressor: v.aggressor,
    log: v.log,
    lastHand: v.lastHand,
    places: v.places,
    stats: v.stats,
    over: v.over,
    raises: v.raises,
    startedWith: v.startedWith,
  };
}

function freshTable(config: HoldemConfig, seed: string, button: Seat, table: number): Work {
  const n = seatCount(config);
  const chips = startChips(config);
  return {
    config,
    seed,
    table,
    handNo: 0,
    level: 1,
    blinds: blindsAt(config, 1),
    button,
    players: Array.from({ length: n }, () => ({ stack: chips, hole: [], up: [], drew: null, bet: 0, total: 0, folded: false, actedAt: null, out: false, buyIns: 1, startStack: chips })),
    deck: [],
    burned: [],
    discards: [],
    board: [],
    street: firstStreet(config.game),
    raises: 0,
    startedWith: 0,
    toAct: null,
    currentBet: 0,
    minRaise: 0,
    aggressor: null,
    log: [],
    lastHand: null,
    places: Array.from({ length: n }, () => null),
    stats: Array.from({ length: n }, () => EMPTY_STATS),
    over: false,
  };
}

/** Deals the first hand, and plays out any hand nobody can bet in. */
function firstHand(w: Work, deck?: readonly Card[]): void {
  const events: HoldemEvent[] = [];
  startHand(w, events, false, deck);
  if (w.toAct === null) {
    closeStreet(w, events);
    endHand(w, events, 'showdown');
  }
}

export const holdem: GameDef<HoldemState, HoldemAction, HoldemConfig, HoldemView, HoldemEvent & GameEvent> = {
  id: 'poker',
  rulesVersion: 1,
  defaultConfig: SIX_MAX_CASH,
  setup(config, rng) {
    const seed = `holdem/${rng.int(2_147_483_647)}/${rng.int(2_147_483_647)}`;
    if (config.start) {
      // Play on from a position: the same cards where they lay, the rules of this game.
      const from = stateFromJson(JSON.parse(config.start) as Json);
      return { ...from, config: { ...config, format: from.config.format }, seed };
    }
    const w = freshTable(config, seed, rng.int(seatCount(config)), rng.int(1_000_000));
    firstHand(w);
    return w;
  },
  seats: (s) => s.players.map((_, i) => i),
  turn: (s) => (s.over ? null : s.toAct),
  legal: legalActions,
  apply: applyAction,
  outcome: outcomeOf,
  view: viewOf,
  sample: (view, _seat, rng) => sampleState(view, rng),
  codec: { state: stateCodec, action: actionCodec, config: configCodec },
};

/** Which preset a config is, if any. */
export function presetOf(config: HoldemConfig): string | null {
  const json = configJson(config) as Record<string, Json>;
  delete json.start;
  const key = stableStringify(json);
  return Object.entries(PRESETS).find(([, c]) => stableStringify(configJson(c)) === key)?.[0] ?? null;
}

/**
 * A hand for lessons, problems and tests, played through the rules: seats get the hole cards
 * given (null: dealt from what is left), the board comes in the order given (then from what is
 * left), and the actions are applied in order. Burned cards come from what is left.
 */
export function position(p: {
  readonly config?: Partial<HoldemConfig>;
  /** Seats at the table; a cash table has six unless this says fewer. */
  readonly seats?: number;
  readonly button?: Seat;
  /** Chips per seat at the start of the hand; the format's starting stack by default. */
  readonly stacks?: readonly number[];
  /** Face-down cards per seat (Hold'em two, Omaha four, Draw five, Stud the first two). */
  readonly holes: readonly (readonly Card[] | null)[];
  readonly board?: readonly Card[];
  /** Stud: up cards per seat, third street first (unnamed ones dealt from what is left). */
  readonly ups?: readonly (readonly Card[] | null)[];
  /** Stud: each seat's seventh-street card. */
  readonly downs?: readonly (Card | null)[];
  /** Draw: the cards the draw deals, in order. */
  readonly next?: readonly Card[];
  readonly actions?: readonly string[];
  readonly handNo?: number;
  readonly seed?: string;
  readonly table?: number;
}): HoldemState {
  const config: HoldemConfig = { ...SIX_MAX_CASH, ...p.config };
  const w = freshTable(config, p.seed ?? 'position', p.button ?? 0, p.table ?? 0);
  const n = p.seats ?? w.players.length;
  w.players = w.players.slice(0, n);
  w.places = w.places.slice(0, n);
  w.stats = w.stats.slice(0, n);
  w.handNo = (p.handNo ?? 1) - 1;
  w.level = levelOf(config, w.handNo + 1);
  w.blinds = blindsAt(config, w.level);
  p.stacks?.forEach((chips, seat) => {
    const player = at(w.players, seat);
    player.stack = chips;
    player.startStack = chips;
    if (chips === 0 && isFreezeout(config)) player.out = true;
  });
  // Seats already out of a freezeout hold the last places.
  let last = n;
  w.players.forEach((player, seat) => {
    if (player.out) w.places[seat] = last--;
  });
  // Stack the deck: hole cards dealt from the left of the button, one round per card, then what follows.
  const game = config.game;
  const named = new Set<Card>([...p.holes.flatMap((h) => h ?? []), ...(p.board ?? []), ...(p.ups ?? []).flatMap((u) => u ?? []), ...(p.downs ?? []).flatMap((d) => (d ? [d] : [])), ...(p.next ?? [])]);
  const rest = createRng(`${w.seed}/position`).shuffle(DECK.filter((c) => !named.has(c)));
  const fresh = () => rest.shift() as Card;
  const order = activeFrom(w, w.button, false);
  const holes = new Map<Seat, Card[]>(order.map((seat) => [seat, [...(p.holes[seat] ?? [])]]));
  for (const seat of order) {
    const h = holes.get(seat) ?? [];
    while (h.length < HOLE_CARDS[game]) h.push(fresh());
    holes.set(seat, h);
  }
  const deck: Card[] = [];
  for (let round = 0; round < HOLE_CARDS[game]; round++) for (const seat of order) deck.push(at(holes.get(seat) ?? [], round));
  if (game === 'stud') {
    // Third street's up card, then a burn and an up card for fourth to sixth, then a burn and the last card down.
    const upOf = (seat: Seat, k: number) => p.ups?.[seat]?.[k] ?? fresh();
    for (const seat of order) deck.push(upOf(seat, 0));
    for (let k = 1; k <= 3; k++) {
      deck.push(fresh());
      for (const seat of order) deck.push(upOf(seat, k));
    }
    deck.push(fresh());
    for (const seat of order) deck.push(p.downs?.[seat] ?? fresh());
    deck.push(...rest);
  } else if (game === 'draw') {
    deck.push(...(p.next ?? []), ...rest);
  } else {
    const board = [...(p.board ?? [])];
    while (board.length < 5) board.push(fresh());
    deck.push(fresh(), ...board.slice(0, 3), fresh(), at(board, 3), fresh(), at(board, 4), ...rest);
  }
  firstHand(w, deck);
  let state: HoldemState = w;
  for (const text of p.actions ?? []) state = applyAction(state, parseAction(text)).state;
  return state;
}
