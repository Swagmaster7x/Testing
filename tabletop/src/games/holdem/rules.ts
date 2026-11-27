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
import { evaluate } from './evaluate';

export type Format = 'cash' | 'heads-up' | 'sit-and-go';
export type Street = 'preflop' | 'flop' | 'turn' | 'river';
export const STREETS: readonly Street[] = ['preflop', 'flop', 'turn', 'river'];

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
};

export const PRESETS: Readonly<Record<string, HoldemConfig>> = {
  'six-max': SIX_MAX_CASH,
  'heads-up': { ...SIX_MAX_CASH, format: 'heads-up', stack: 75 },
  'sit-and-go': { ...SIX_MAX_CASH, format: 'sit-and-go', stack: 75, ante: 'big-blind-ante' },
  'home-game': { ...SIX_MAX_CASH, ante: 'ante', straddle: 'live', shortAllIn: 'half-raise' },
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
  /** The smallest chip. */
  readonly unit: number;
}

export interface Player {
  readonly stack: number;
  /** Two cards while dealt in this hand; none when out. */
  readonly hole: readonly Card[];
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

export type LogKind = 'ante' | 'small-blind' | 'big-blind' | 'straddle' | 'fold' | 'check' | 'call' | 'bet' | 'raise';

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
}

export interface PotResult {
  readonly amount: number;
  /** Seats that could win it. */
  readonly eligible: readonly Seat[];
  readonly winners: readonly Seat[];
  /** Chips each winner took, in the order of `winners` (odd chips first). */
  readonly shares: readonly number[];
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
  readonly handNo: number;
  readonly level: number;
  readonly blinds: Blinds;
  readonly button: Seat;
  readonly players: readonly Player[];
  /** The undealt cards, top first. */
  readonly deck: readonly Card[];
  readonly burned: readonly Card[];
  readonly board: readonly Card[];
  readonly street: Street;
  readonly toAct: Seat | null;
  /** The bet to match on this street. */
  readonly currentBet: number;
  /** The size of the last full bet or raise on this street: the least the next raise may add. */
  readonly minRaise: number;
  /** The last seat to bet or raise on the last street with betting. */
  readonly aggressor: Seat | null;
  /** This hand, in order. */
  readonly log: readonly LogEntry[];
  readonly lastHand: HandResult | null;
  /** Freezeout finishing places; null while a seat is still in. */
  readonly places: readonly (number | null)[];
  readonly stats: readonly SeatStats[];
  readonly over: boolean;
}

export type HoldemAction = { readonly type: 'fold' } | { readonly type: 'check' } | { readonly type: 'call' } | { readonly type: 'raise'; readonly to: number };

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
    }
  | { readonly type: 'post'; readonly seat: Seat; readonly kind: 'ante' | 'small-blind' | 'big-blind' | 'straddle'; readonly amount: number; readonly allIn: boolean }
  | { readonly type: 'hole'; readonly seats: readonly Seat[] }
  | { readonly type: 'act'; readonly seat: Seat; readonly kind: LogKind; readonly amount: number; readonly to: number; readonly allIn: boolean }
  | { readonly type: 'collect'; readonly pot: number }
  | { readonly type: 'board'; readonly street: Street; readonly cards: readonly Card[] }
  | { readonly type: 'show'; readonly seat: Seat; readonly cards: readonly Card[]; readonly value: number }
  | { readonly type: 'muck'; readonly seat: Seat }
  | { readonly type: 'return'; readonly seat: Seat; readonly amount: number }
  | { readonly type: 'win'; readonly seat: Seat; readonly amount: number; readonly pot: number; readonly value: number | null }
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
  if (!isFreezeout(config)) {
    return { sb: 1, bb: 2, ante: config.ante === 'ante' ? 1 : config.ante === 'big-blind-ante' ? 2 : 0, straddle: config.straddle === 'live' ? 4 : 0, unit: 1 };
  }
  const [sb, bb] = levelBlinds(level);
  const ante = level < ANTE_LEVEL ? 0 : config.ante === 'ante' ? bb / 10 : config.ante === 'big-blind-ante' ? bb : 0;
  return { sb, bb, ante, straddle: 0, unit: 5 };
}

/** The level a hand is played at. */
export function levelOf(config: HoldemConfig, handNo: number): number {
  return isFreezeout(config) ? 1 + Math.floor((Math.max(1, handNo) - 1) / config.levelHands) : 1;
}

/** In this hand: dealt in and not folded. */
export const inHand = (p: Player): boolean => p.hole.length > 0 && !p.folded && !p.out;

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
    if (dealt ? p.hole.length > 0 && !p.out : !p.out && p.stack > 0) out.push(seat);
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

/** Whether a seat must still act on this street. */
function needsToAct(s: Pick<HoldemState, 'players' | 'currentBet'>, seat: Seat): boolean {
  const p = at(s.players, seat);
  if (!inHand(p) || p.stack === 0) return false;
  if (p.bet < s.currentBet) return true;
  if (p.actedAt !== null) return false;
  // Nobody acts when nobody is left to bet against.
  return withChips(s) >= 2;
}

function nextToAct(s: Pick<HoldemState, 'players' | 'currentBet'>, from: Seat): Seat | null {
  const n = s.players.length;
  for (let k = 1; k <= n; k++) {
    const seat = (from + k) % n;
    if (needsToAct(s, seat)) return seat;
  }
  return null;
}

/** Whether a seat that is to act may raise: it has not acted since the betting was opened, or a full raise has been made since. */
export function mayRaise(s: Pick<HoldemState, 'players' | 'currentBet' | 'minRaise'>, seat: Seat): boolean {
  const p = at(s.players, seat);
  if (p.bet + p.stack <= s.currentBet) return false;
  // A raise needs someone left to call it.
  if (!s.players.some((q, i) => i !== seat && inHand(q) && q.stack > 0)) return false;
  return p.actedAt === null || s.currentBet - p.actedAt >= s.minRaise;
}

/** The least and most a seat may raise to, or null when it may not raise. A raise below `min` is only allowed all-in (`max`). */
export function raiseRange(s: Pick<HoldemState, 'players' | 'currentBet' | 'minRaise'>, seat: Seat): { min: number; max: number } | null {
  if (!mayRaise(s, seat)) return null;
  const p = at(s.players, seat);
  const max = p.bet + p.stack;
  return { min: Math.min(max, s.currentBet + s.minRaise), max };
}

function legalActions(s: HoldemState, seat: Seat): HoldemAction[] {
  if (s.over || s.toAct !== seat) return [];
  const out: HoldemAction[] = toCallOf(s, seat) > 0 ? [{ type: 'fold' }, { type: 'call' }] : [{ type: 'check' }];
  const range = raiseRange(s, seat);
  if (range) {
    for (let to = range.min; to < range.max; to += s.blinds.unit) out.push({ type: 'raise', to });
    out.push({ type: 'raise', to: range.max });
  }
  return out;
}

function isLegal(s: HoldemState, seat: Seat, a: HoldemAction): boolean {
  if (s.over || s.toAct !== seat) return false;
  const owe = toCallOf(s, seat);
  switch (a.type) {
    case 'fold':
    case 'call':
      return owe > 0;
    case 'check':
      return owe === 0;
    case 'raise': {
      const range = raiseRange(s, seat);
      if (!range || !Number.isInteger(a.to)) return false;
      if (a.to === range.max) return true;
      return a.to >= range.min && a.to < range.max && (a.to - range.min) % s.blinds.unit === 0;
    }
  }
}

// The table, while an action is applied

type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type MPlayer = Mutable<Omit<Player, 'hole'>> & { hole: Card[] };
type Work = Mutable<Omit<HoldemState, 'players' | 'deck' | 'burned' | 'board' | 'log' | 'places' | 'stats'>> & {
  players: MPlayer[];
  deck: Card[];
  burned: Card[];
  board: Card[];
  log: LogEntry[];
  places: (number | null)[];
  stats: SeatStats[];
};

function work(s: HoldemState): Work {
  return {
    ...s,
    players: s.players.map((p) => ({ ...p, hole: [...p.hole] })),
    deck: [...s.deck],
    burned: [...s.burned],
    board: [...s.board],
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

function post(w: Work, events: HoldemEvent[], seat: Seat, amount: number, kind: 'ante' | 'small-blind' | 'big-blind' | 'straddle'): void {
  const p = at(w.players, seat);
  const chips = Math.min(amount, p.stack);
  put(p, chips, kind !== 'ante');
  w.log.push({ seat, street: 'preflop', kind, amount: chips, to: p.bet, allIn: p.stack === 0 });
  events.push({ type: 'post', seat, kind, amount: chips, allIn: p.stack === 0 });
}

const EMPTY_STATS: SeatStats = { hands: 0, vpip: 0, pfr: 0, threeBet: 0, threeBetChances: 0, aggressive: 0, passive: 0, sawFlop: 0, showdowns: 0, wonShowdown: 0 };

/** Deals the next hand: rebuys, the level, the button, antes and blinds, hole cards. Leaves `toAct` null if nobody can bet. */
function startHand(w: Work, events: HoldemEvent[], moveButton: boolean, deck?: readonly Card[]): void {
  const config = w.config;
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
  for (const p of w.players) {
    p.hole = [];
    p.bet = 0;
    p.total = 0;
    p.folded = false;
    p.actedAt = null;
    p.startStack = p.stack;
  }
  w.board = [];
  w.burned = [];
  w.log = [];
  w.street = 'preflop';
  w.aggressor = null;
  w.toAct = null;

  // The seats dealt in, from the left of the button; the button is last.
  const order = activeFrom(w, w.button, false);
  const button = w.button;
  const headsUp = order.length === 2;
  const sb = headsUp ? button : at(order, 0);
  const bb = headsUp ? at(order, 0) : at(order, 1);
  const blinds = w.blinds;
  const straddler = blinds.straddle > 0 && order.length >= 3 && at(w.players, at(order, 2)).stack > blinds.straddle ? at(order, 2) : null;
  events.push({ type: 'deal', handNo: w.handNo, button, level: w.level, blinds, seats: order, previous: w.lastHand });

  if (blinds.ante > 0 && config.ante === 'ante') for (const seat of order) post(w, events, seat, blinds.ante, 'ante');
  post(w, events, sb, blinds.sb, 'small-blind');
  post(w, events, bb, blinds.bb, 'big-blind');
  if (blinds.ante > 0 && config.ante === 'big-blind-ante') post(w, events, bb, blinds.ante, 'ante');
  if (straddler !== null) post(w, events, straddler, blinds.straddle, 'straddle');
  w.currentBet = straddler !== null ? blinds.straddle : blinds.bb;
  w.minRaise = w.currentBet;

  const cards = deck ? [...deck] : createRng(`${w.seed}/hand/${w.handNo}`).shuffle(DECK);
  for (let round = 0; round < 2; round++) {
    for (const seat of order) {
      const card = cards.shift();
      if (!card) throw new Error("Hold'em: the deck ran out");
      at(w.players, seat).hole.push(card);
    }
  }
  w.deck = cards;
  events.push({ type: 'hole', seats: order });
  w.toAct = nextToAct(w, straddler ?? bb);
}

/**
 * Ends the betting on a street: gathers the bets and deals the next street, or runs the board out
 * when nobody can bet. Returns 'showdown' after the river, 'betting' when a seat is to act.
 */
function closeStreet(w: Work, events: HoldemEvent[]): 'betting' | 'showdown' {
  for (;;) {
    events.push({ type: 'collect', pot: potOf(w) });
    for (const p of w.players) {
      p.bet = 0;
      p.actedAt = null;
    }
    w.currentBet = 0;
    w.minRaise = w.blinds.bb;
    w.toAct = null;
    if (w.street === 'river') return 'showdown';
    const street = at(STREETS, STREETS.indexOf(w.street) + 1);
    w.street = street;
    const burn = w.deck.shift();
    if (burn) w.burned.push(burn);
    const cards = w.deck.splice(0, street === 'flop' ? 3 : 1);
    if (cards.length < (street === 'flop' ? 3 : 1)) throw new Error("Hold'em: the deck ran out");
    w.board.push(...cards);
    events.push({ type: 'board', street, cards });
    if (withChips(w) >= 2) {
      w.aggressor = null;
      const first = nextToAct(w, w.button);
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
    const pre = mine.filter((e) => e.street === 'preflop');
    // A re-raise chance: acting before the flop when exactly one other player has raised.
    let raises = 0;
    let acted = false;
    let chance = false;
    let threeBet = false;
    for (const e of w.log) {
      if (e.street !== 'preflop') break;
      const voluntary = e.kind === 'fold' || e.kind === 'check' || e.kind === 'call' || e.kind === 'raise';
      if (e.seat === seat && voluntary && !acted) {
        acted = true;
        chance = raises === 1;
        threeBet = chance && e.kind === 'raise';
      }
      if (e.kind === 'raise') raises += 1;
    }
    const post = mine.filter((e) => e.street !== 'preflop');
    const foldedPre = pre.some((e) => e.kind === 'fold');
    const atShowdown = result.reason === 'showdown' && !at(w.players, seat).folded;
    return {
      hands: st.hands + 1,
      vpip: st.vpip + (pre.some((e) => e.kind === 'call' || e.kind === 'raise') ? 1 : 0),
      pfr: st.pfr + (pre.some((e) => e.kind === 'raise') ? 1 : 0),
      threeBet: st.threeBet + (threeBet ? 1 : 0),
      threeBetChances: st.threeBetChances + (chance ? 1 : 0),
      aggressive: st.aggressive + post.filter((e) => e.kind === 'bet' || e.kind === 'raise').length,
      passive: st.passive + post.filter((e) => e.kind === 'call').length,
      sawFlop: st.sawFlop + (!foldedPre && w.board.length >= 3 ? 1 : 0),
      showdowns: st.showdowns + (atShowdown ? 1 : 0),
      wonShowdown: st.wonShowdown + (atShowdown && result.pots.some((p) => p.winners.includes(seat)) ? 1 : 0),
    };
  });
}

/** Pays the pots out and records the hand. */
function payOut(w: Work, events: HoldemEvent[], reason: 'fold' | 'showdown'): void {
  const live = seatsInHand(w);
  const { returned, pots } = settle(w.players);
  const n = w.players.length;
  const values: (number | null)[] = Array.from({ length: n }, () => null);
  const shown: (Card[] | null)[] = Array.from({ length: n }, () => null);
  let order: Seat[] = [];
  const strength = new Map<Seat, number>();
  if (reason === 'showdown') {
    for (const seat of live) strength.set(seat, evaluate([...at(w.players, seat).hole, ...w.board]));
    order = showOrder(w, live);
    // When anyone is all-in, every hand is turned up; otherwise a beaten hand may be mucked.
    const everyone = w.config.showdown === 'show-all' || live.some((seat) => at(w.players, seat).stack === 0);
    const best = pots.map(() => -1);
    for (const seat of order) {
      const v = strength.get(seat) ?? 0;
      const contests = pots.flatMap((pot, k) => (pot.eligible.includes(seat) ? [k] : []));
      if (everyone || contests.some((k) => v >= at(best, k))) {
        for (const k of contests) best[k] = Math.max(at(best, k), v);
        shown[seat] = [...at(w.players, seat).hole];
        values[seat] = v;
        events.push({ type: 'show', seat, cards: [...at(w.players, seat).hole], value: v });
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
    let winners = pot.eligible;
    if (pot.eligible.length > 1) {
      const top = Math.max(...pot.eligible.map((seat) => strength.get(seat) ?? -1));
      winners = pot.eligible.filter((seat) => strength.get(seat) === top);
    }
    const shares = split(w, pot.amount, winners);
    for (const { seat, share } of shares) {
      at(w.players, seat).stack += share;
      won[seat] = at(won, seat) + share;
      events.push({ type: 'win', seat, amount: share, pot: k, value: values[seat] ?? null });
    }
    return { amount: pot.amount, eligible: pot.eligible, winners: shares.map((x) => x.seat), shares: shares.map((x) => x.share) };
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
    case 'raise': {
      amount = action.to - p.bet;
      const increase = action.to - w.currentBet;
      kind = w.currentBet === 0 ? 'bet' : 'raise';
      put(p, amount, true);
      const full = increase >= w.minRaise;
      const reopens = full || (w.config.shortAllIn === 'half-raise' && 2 * increase >= w.minRaise);
      if (full) w.minRaise = increase;
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
  const entry: LogEntry = { seat, street: w.street, kind, amount, to: p.bet, allIn: p.stack === 0 && kind !== 'fold' && kind !== 'check' };
  w.log.push(entry);
  events.push({ type: 'act', seat, kind, amount, to: p.bet, allIn: entry.allIn });

  if (seatsInHand(w).length === 1) {
    events.push({ type: 'collect', pot: potOf(w) });
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
  return a.type === 'raise' ? `r${a.to}` : a.type;
}

function parseAction(text: string): HoldemAction {
  const t = text.trim().toLowerCase();
  if (t === 'fold' || t === 'check' || t === 'call') return { type: t };
  const m = /^r(\d+)$/.exec(t);
  if (!m) throw new Error(`"${text}" is not a poker action, such as fold, check, call or r60 (raise to 60)`);
  return { type: 'raise', to: Number(m[1]) };
}

const CONFIG_KEYS = ['format', 'stack', 'hands', 'levelHands', 'ante', 'straddle', 'shortAllIn', 'oddChip', 'showdown', 'payouts'] as const;

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
const KINDS = new Set<string>(['ante', 'small-blind', 'big-blind', 'straddle', 'fold', 'check', 'call', 'bet', 'raise']);

function blindsFrom(v: Json | undefined): Blinds {
  if (!isJsonObject(v)) return fail('the blinds');
  return { sb: num(v.sb, 'sb'), bb: num(v.bb, 'bb'), ante: num(v.ante, 'ante'), straddle: num(v.straddle, 'straddle'), unit: num(v.unit, 'unit') };
}

function playerFrom(v: Json): Player {
  if (!isJsonObject(v)) return fail('a player');
  return {
    stack: num(v.stack, 'a stack'),
    hole: cardsFrom(v.hole, 'hole cards'),
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
  return { seat: num(v.seat, 'a seat'), street: v.street as Street, kind: v.kind as LogKind, amount: num(v.amount, 'an amount'), to: num(v.to, 'a bet'), allIn: v.allIn === true };
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
      return { amount: num(p.amount, 'a pot'), eligible: p.eligible.map((x) => num(x, 'a seat')), winners: p.winners.map((x) => num(x, 'a seat')), shares: p.shares.map((x) => num(x, 'a share')) };
    }),
    returned: v.returned.map((x) => num(x, 'a return')),
    shown: v.shown.map((x) => (x === null ? null : cardsFrom(x, 'shown cards'))),
    values: v.values.map((x) => (x === null ? null : num(x, 'a hand value'))),
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
    handNo: num(json.handNo ?? 1, 'the hand number'),
    level,
    blinds: json.blinds === undefined ? blindsAt(config, level) : blindsFrom(json.blinds),
    button: num(json.button ?? 0, 'the button'),
    players,
    deck: cardsFrom(json.deck ?? [], 'the deck'),
    burned: cardsFrom(json.burned ?? [], 'the burned cards'),
    board: cardsFrom(json.board ?? [], 'the board'),
    street,
    toAct: seatOrNull(json.toAct, 'the seat to act'),
    currentBet: num(json.currentBet ?? 0, 'the bet'),
    minRaise: num(json.minRaise ?? 0, 'the minimum raise'),
    aggressor: seatOrNull(json.aggressor, 'the aggressor'),
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
    handNo: s.handNo,
    level: s.level,
    blinds: { ...s.blinds },
    button: s.button,
    players: s.players.map((p) => ({ ...p, hole: [...p.hole] })),
    deck: [...s.deck],
    burned: [...s.burned],
    board: [...s.board],
    street: s.street,
    toAct: s.toAct,
    currentBet: s.currentBet,
    minRaise: s.minRaise,
    aggressor: s.aggressor,
    log: s.log.map((e) => ({ ...e })),
    lastHand: s.lastHand ? (JSON.parse(JSON.stringify(s.lastHand)) as Json) : null,
    places: [...s.places],
    stats: s.stats.map((x) => ({ ...x })),
    over: s.over,
  };
}

/** No card is in two places, and while a hand is dealt every card is somewhere. */
export function checkCards(s: Pick<HoldemState, 'players' | 'deck' | 'burned' | 'board'>): void {
  const all = [...s.players.flatMap((p) => p.hole), ...s.deck, ...s.burned, ...s.board];
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
  };
}

/** The cards a seat cannot see: everything but its hole cards and the board. */
export function unseenCards(v: Pick<HoldemView, 'players' | 'board' | 'seat'>): Card[] {
  const seen = new Set<Card>([...at(v.players, v.seat).hole, ...v.board]);
  return DECK.filter((c) => !seen.has(c));
}

/** A full state consistent with a view: the unseen cards dealt at random to the other hands, the burn and the deck. */
export function sampleState(v: HoldemView, rng: Rng): HoldemState {
  const unseen = rng.shuffle(unseenCards(v));
  const players: Player[] = v.players.map((p, i) => {
    const { cards, ...rest } = p;
    return { ...rest, hole: i === v.seat ? p.hole : unseen.splice(0, cards) };
  });
  const burnedCount = v.board.length === 0 ? 0 : v.board.length - 2;
  const burned = unseen.splice(0, burnedCount);
  const dealt = players.some((p) => p.hole.length > 0);
  return {
    config: v.config,
    seed: `sample/${rng.int(1_000_000_000)}`,
    handNo: v.handNo,
    level: v.level,
    blinds: v.blinds,
    button: v.button,
    players,
    deck: dealt ? unseen : [],
    burned: dealt ? burned : [],
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
  };
}

function freshTable(config: HoldemConfig, seed: string, button: Seat): Work {
  const n = seatCount(config);
  const chips = startChips(config);
  return {
    config,
    seed,
    handNo: 0,
    level: 1,
    blinds: blindsAt(config, 1),
    button,
    players: Array.from({ length: n }, () => ({ stack: chips, hole: [], bet: 0, total: 0, folded: false, actedAt: null, out: false, buyIns: 1, startStack: chips })),
    deck: [],
    burned: [],
    board: [],
    street: 'preflop',
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
    const w = freshTable(config, seed, rng.int(seatCount(config)));
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
  readonly holes: readonly (readonly Card[] | null)[];
  readonly board?: readonly Card[];
  readonly actions?: readonly string[];
  readonly handNo?: number;
  readonly seed?: string;
}): HoldemState {
  const config: HoldemConfig = { ...SIX_MAX_CASH, ...p.config };
  const w = freshTable(config, p.seed ?? 'position', p.button ?? 0);
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
  // Stack the deck: hole cards dealt from the left of the button, two rounds, then burn and board.
  const named = new Set<Card>([...p.holes.flatMap((h) => h ?? []), ...(p.board ?? [])]);
  const rest = createRng(`${w.seed}/position`).shuffle(DECK.filter((c) => !named.has(c)));
  const order = activeFrom(w, w.button, false);
  const holes = new Map<Seat, Card[]>(order.map((seat) => [seat, [...(p.holes[seat] ?? [])]]));
  for (const seat of order) {
    const h = holes.get(seat) ?? [];
    while (h.length < 2) h.push(rest.shift() as Card);
    holes.set(seat, h);
  }
  const deck: Card[] = [];
  for (let round = 0; round < 2; round++) for (const seat of order) deck.push(at(holes.get(seat) ?? [], round));
  const board = [...(p.board ?? [])];
  while (board.length < 5) board.push(rest.shift() as Card);
  const burn = () => rest.shift() as Card;
  deck.push(burn(), ...board.slice(0, 3), burn(), at(board, 3), burn(), at(board, 4), ...rest);
  firstHand(w, deck);
  let state: HoldemState = w;
  for (const text of p.actions ?? []) state = applyAction(state, parseAction(text)).state;
  return state;
}
