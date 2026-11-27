/**
 * Tute (docs/rules/tute.md), behind the game contract: four players in fixed pairs (partners
 * opposite), or two players with a stock. Every disputed rule is an option in the config, and the
 * presets are named configs. Cards are written as rank and suit: "Ao" is the As de oros, "Rb" the
 * Rey de bastos. Seats play to the right: seat 1 plays after seat 0. With four players, seats 0
 * and 2 are one side and seats 1 and 3 the other; with two, each seat is a side.
 *
 * Hidden information: a seat's view holds its own hand, the public history (every trick, every
 * cante, the turned card and exchanges) and counts, never the other hands, the order of the stock
 * or the seed that deals later hands.
 */
import type { Codec, GameDef, GameEvent, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject, stableStringify } from '../../core/json';
import type { Rng } from '../../core/rng';
import { createRng } from '../../core/rng';

export type Suit = 'o' | 'c' | 'e' | 'b';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | 'S' | 'C' | 'R';
export type Card = `${Rank}${Suit}`;

export const SUITS: readonly Suit[] = ['o', 'c', 'e', 'b'];
export const RANKS: readonly Rank[] = ['A', '2', '3', '4', '5', '6', '7', 'S', 'C', 'R'];
export const DECK: readonly Card[] = SUITS.flatMap((s) => RANKS.map((r): Card => `${r}${s}`));

/** Strongest first, in every suit. */
export const ORDER: readonly Rank[] = ['A', '3', 'R', 'C', 'S', '7', '6', '5', '4', '2'];
const POINTS: Readonly<Record<Rank, number>> = { A: 11, '3': 10, R: 4, C: 3, S: 2, '7': 0, '6': 0, '5': 0, '4': 0, '2': 0 };

/** The points in the pack, the last ten, and a hand played out without cantes. */
export const TOTAL_POINTS = 120;
export const LAST_TEN = 10;
export const HAND_POINTS = TOTAL_POINTS + LAST_TEN;
export const CANTE_PLAIN = 20;
export const CANTE_TRUMPS = 40;
/** What a side needs with `handWin: reach101` (the default `target`). */
export const REACH = 101;
/** The points a side needs with `handWin: reach101`: 101, or 121 in tute americano. */
export const reachOf = (config: Pick<TuteConfig, 'target'>): number => config.target;

export interface TuteConfig {
  readonly players: 2 | 4;
  readonly mustBeat: 'yes' | 'no';
  readonly partner: 'same' | 'relaxed';
  readonly underTrump: 'free' | 'must';
  readonly stockRules: 'free' | 'trumps' | 'full';
  readonly singer: 'side' | 'winner' | 'both';
  readonly fortyFirst: 'yes' | 'no';
  readonly tute: 'game' | 'two' | 'hand' | 'none';
  readonly handWin: 'most' | 'reach101';
  /** With `handWin: reach101`: the points a side needs. */
  readonly target: 101 | 121;
  /** With `handWin: most`: a hand won with 101 points or more counts two games. */
  readonly bigWin: 'off' | 'two';
  readonly tie: 'last-trick' | 'draw';
  readonly capote: 'off' | 'two';
  readonly swap: 'seven-and-two' | 'seven' | 'none';
  readonly swapWhen: 'after-own-trick' | 'any-turn';
  readonly matchTo: number;
  /** Games the match must be won by: 1, or 2 (play on until one side is two games ahead). */
  readonly margin: 1 | 2;
  /** Cards each player holds with two players: 6 (corriente), 8 (habanero) or 10. */
  readonly twoHand: 6 | 8 | 10;
  /** A position to start from instead of a deal ("play on from here"), in state notation. */
  readonly start?: string;
}

export const SPAIN_PAIRS: TuteConfig = {
  players: 4,
  mustBeat: 'yes',
  partner: 'same',
  underTrump: 'free',
  stockRules: 'free',
  singer: 'side',
  fortyFirst: 'yes',
  tute: 'game',
  handWin: 'most',
  target: 101,
  bigWin: 'off',
  tie: 'last-trick',
  capote: 'off',
  swap: 'none',
  swapWhen: 'after-own-trick',
  matchTo: 3,
  margin: 1,
  twoHand: 8,
};

const HABANERO: TuteConfig = { ...SPAIN_PAIRS, players: 2, swap: 'seven-and-two', handWin: 'reach101' };

export const PRESETS: Readonly<Record<string, TuteConfig>> = {
  'spain-pairs': SPAIN_PAIRS,
  'pairs-101': { ...SPAIN_PAIRS, handWin: 'reach101', tute: 'two' },
  'pairs-easy': { ...SPAIN_PAIRS, partner: 'relaxed', singer: 'winner' },
  'two-habanero': HABANERO,
  'two-arrastrado': { ...HABANERO, stockRules: 'full' },
  'two-trumps': { ...HABANERO, stockRules: 'trumps' },
  'two-corriente': { ...HABANERO, twoHand: 6 },
  'two-americano': { ...HABANERO, stockRules: 'trumps', tute: 'none', target: 121 },
  'two-ten': { ...HABANERO, twoHand: 10, stockRules: 'full', swap: 'none', handWin: 'most' },
};

/** Every option and its values, in the order the rules screen shows them. */
export const CONFIG_CHOICES = {
  players: [4, 2],
  mustBeat: ['yes', 'no'],
  partner: ['same', 'relaxed'],
  underTrump: ['free', 'must'],
  stockRules: ['free', 'trumps', 'full'],
  singer: ['side', 'winner', 'both'],
  fortyFirst: ['yes', 'no'],
  tute: ['game', 'two', 'hand', 'none'],
  handWin: ['most', 'reach101'],
  target: [101, 121],
  bigWin: ['off', 'two'],
  tie: ['last-trick', 'draw'],
  capote: ['off', 'two'],
  swap: ['none', 'seven-and-two', 'seven'],
  swapWhen: ['after-own-trick', 'any-turn'],
  matchTo: [1, 2, 3, 4, 5, 7],
  margin: [1, 2],
  twoHand: [8, 6, 10],
} as const satisfies { readonly [K in keyof Omit<TuteConfig, 'start'>]: readonly TuteConfig[K][] };

/** A match never runs past this many hands; if it does (ties, vueltas), the side with more games wins. */
const MAX_HANDS = 30;

export interface PlayedCard {
  readonly seat: Seat;
  readonly card: Card;
}

export interface Trick {
  readonly leader: Seat;
  readonly plays: readonly PlayedCard[];
  readonly winner: Seat;
  /** Cards in the stock while it was played (always 0 with four players). */
  readonly stock: number;
  /** Set up for a lesson or problem: its cards are real but their order is not, so nothing is inferred from it. */
  readonly setup?: boolean;
}

export interface Cante {
  readonly seat: Seat;
  readonly suit: Suit;
  readonly points: number;
  /** The tricks complete when it was sung (it is sung for the last of them). */
  readonly trick?: number;
}

export type HandEnd = 'played' | 'reach' | 'tute';

export interface HandResult {
  /** Each side's points in this hand: cards, last ten and cantes. */
  readonly points: readonly number[];
  /** Points each side brought into the hand from a vuelta. */
  readonly carried: readonly number[];
  readonly cantes: readonly number[];
  /** The side that took the last trick, when the hand was played out. */
  readonly lastTrick: number | null;
  readonly end: HandEnd;
  /** The side that won the hand, or null (a tie under `tie: draw`, or a vuelta). */
  readonly winner: number | null;
  /** Games scored by the winner: 1, or 2 for a capote or a tute counting two. */
  readonly value: number;
  readonly capote: boolean;
  readonly vuelta: boolean;
  /** The seat that declared a tute. */
  readonly tute: Seat | null;
}

export interface TuteState {
  readonly config: TuteConfig;
  /** Deals the later hands of a match. Never part of a view. */
  readonly seed: string;
  readonly handNo: number;
  readonly dealer: Seat;
  readonly trumpSuit: Suit;
  /** The card turned for trumps this hand. */
  readonly turnedCard: Card;
  /**
   * The face-up card that may still be exchanged: under the stock (two players) or in the dealer's
   * hand (four), until it is drawn or played. After an exchange it is the card given for it.
   */
  readonly turned: Card | null;
  readonly hands: readonly (readonly Card[])[];
  /** Top first; with two players the turned card is the last card while it is there. */
  readonly stock: readonly Card[];
  readonly trick: readonly PlayedCard[];
  readonly leader: Seat;
  /** Completed tricks this hand, in order. */
  readonly tricks: readonly Trick[];
  /** Cards won this hand, by side. */
  readonly won: readonly (readonly Card[])[];
  readonly cantes: readonly Cante[];
  /** True while the side that won the last trick may still sing for it. */
  readonly canteOpen: boolean;
  /** Cards everyone knows are in a seat's hand: the dealer's turned card, cantes, exchanges, the turned card once drawn. */
  readonly known: readonly (readonly Card[])[];
  /** Points each side carries into this hand from a vuelta. */
  readonly carry: readonly number[];
  readonly matchWins: readonly number[];
  readonly results: readonly HandResult[];
  readonly over: boolean;
  /** The side that won the match, once it is over (null for a drawn match). */
  readonly champion: number | null;
}

export type TuteAction =
  | { readonly type: 'play'; readonly card: Card }
  | { readonly type: 'sing'; readonly suit: Suit }
  | { readonly type: 'tute'; readonly kind: 'R' | 'C' }
  | { readonly type: 'swap' };

export type TuteEvent =
  | { readonly type: 'deal'; readonly handNo: number; readonly dealer: Seat; readonly trumpSuit: Suit; readonly turned: Card; readonly carry: readonly number[] }
  | { readonly type: 'play'; readonly seat: Seat; readonly card: Card }
  | { readonly type: 'sing'; readonly seat: Seat; readonly suit: Suit; readonly points: number }
  | { readonly type: 'tute'; readonly seat: Seat; readonly kind: 'R' | 'C'; readonly cards: readonly Card[] }
  | { readonly type: 'swap'; readonly seat: Seat; readonly gave: Card; readonly took: Card; readonly dealer: Seat | null }
  | { readonly type: 'trick'; readonly winner: Seat; readonly plays: readonly PlayedCard[]; readonly points: number; readonly last: boolean }
  | { readonly type: 'draw'; readonly seat: Seat; readonly card: Card; readonly turned: boolean }
  | { readonly type: 'reach'; readonly side: number; readonly points: number }
  | { readonly type: 'hand-end'; readonly result: HandResult; readonly matchWins: readonly number[] }
  | { readonly type: 'match-end'; readonly winner: number | null };

export interface TuteView {
  readonly seat: Seat;
  readonly config: TuteConfig;
  readonly handNo: number;
  readonly dealer: Seat;
  readonly trumpSuit: Suit;
  readonly turnedCard: Card;
  readonly turned: Card | null;
  readonly hand: readonly Card[];
  readonly handCounts: readonly number[];
  readonly stockCount: number;
  readonly trick: readonly PlayedCard[];
  readonly leader: Seat;
  readonly tricks: readonly Trick[];
  readonly won: readonly (readonly Card[])[];
  readonly cantes: readonly Cante[];
  readonly canteOpen: boolean;
  readonly known: readonly (readonly Card[])[];
  readonly carry: readonly number[];
  readonly matchWins: readonly number[];
  readonly results: readonly HandResult[];
  readonly over: boolean;
  readonly champion: number | null;
}

// Cards

export const suitOf = (card: Card): Suit => card[1] as Suit;
export const rankOf = (card: Card): Rank => card[0] as Rank;

export function isCard(text: string): text is Card {
  return /^[A234567SCR][oceb]$/.test(text);
}

/** Strength within a suit: higher is stronger (0 to 9). */
export function strength(card: Card): number {
  return 9 - ORDER.indexOf(rankOf(card));
}

export function cardPoints(card: Card): number {
  return POINTS[rankOf(card)];
}

export function pointsOf(cards: readonly Card[]): number {
  return cards.reduce((a, c) => a + cardPoints(c), 0);
}

export function canteValue(suit: Suit, trumpSuit: Suit): number {
  return suit === trumpSuit ? CANTE_TRUMPS : CANTE_PLAIN;
}

// Seats and sides

export const seatCount = (config: Pick<TuteConfig, 'players'>): number => (config.players === 2 ? 2 : 4);
export const handSize = (config: Pick<TuteConfig, 'players' | 'twoHand'>): number => (config.players === 2 ? config.twoHand : 10);

/** Partners share a side: seats 0 and 2 against 1 and 3. With two players each seat is a side. */
export function sideOf(seat: Seat, players: number): number {
  return players === 4 ? seat % 2 : seat;
}

export function teamsOf(players: number): Seat[][] {
  return players === 4
    ? [
        [0, 2],
        [1, 3],
      ]
    : [[0], [1]];
}

export const partnerOf = (seat: Seat, players: number): Seat | null => (players === 4 ? (seat + 2) % 4 : null);

/** True when card `b` beats card `a`, which is winning the trick so far. */
export function beats(b: Card, a: Card, trumpSuit: Suit): boolean {
  if (suitOf(b) === suitOf(a)) return strength(b) > strength(a);
  return suitOf(b) === trumpSuit;
}

/** The play winning a (complete or partial) trick: the highest trump, or the highest card of the suit led. */
export function winningPlay(trick: readonly PlayedCard[], trumpSuit: Suit): PlayedCard {
  const first = trick[0];
  if (!first) throw new Error('An empty trick has no winner');
  let best = first;
  for (const p of trick.slice(1)) if (beats(p.card, best.card, trumpSuit)) best = p;
  return best;
}

export function trickWinner(trick: readonly PlayedCard[], trumpSuit: Suit): Seat {
  return winningPlay(trick, trumpSuit).seat;
}

// Obligations

/** Why a card may not be played now. */
export type IllegalReason = 'follow' | 'beat' | 'trump' | 'overtrump' | 'trump-led';

/** Which obligations are in force: two players while the stock lasts follow `stockRules`. */
export type Duty = 'full' | 'trumps' | 'free';

export function dutyAt(config: TuteConfig, stockCount: number): Duty {
  if (seatCount(config) === 4 || stockCount === 0) return 'full';
  return config.stockRules;
}

interface Ask {
  readonly hand: readonly Card[];
  readonly trick: readonly PlayedCard[];
  readonly trumpSuit: Suit;
  readonly config: TuteConfig;
  readonly duty: Duty;
  readonly seat: Seat;
}

/** The cards `seat` may play to the trick, and why each other card is refused. */
export function obligations(ask: Ask): { allowed: Card[]; why: (card: Card) => IllegalReason | null } {
  const { hand, trick, trumpSuit, config, duty, seat } = ask;
  const all = [...hand];
  const free = { allowed: all, why: () => null };
  const first = trick[0];
  if (!first || duty === 'free') return free;
  const led = suitOf(first.card);
  if (duty === 'trumps') {
    if (led !== trumpSuit) return free;
    const trumps = hand.filter((c) => suitOf(c) === trumpSuit);
    if (trumps.length === 0) return free;
    return { allowed: trumps, why: (c) => (suitOf(c) === trumpSuit ? null : 'trump-led') };
  }
  const winning = winningPlay(trick, trumpSuit);
  const players = seatCount(config);
  const relaxed = config.partner === 'relaxed' && partnerOf(seat, players) === winning.seat;
  const follow = hand.filter((c) => suitOf(c) === led);
  if (follow.length > 0) {
    const followOnly = { allowed: follow, why: (c: Card): IllegalReason | null => (suitOf(c) === led ? null : 'follow') };
    if (relaxed || config.mustBeat === 'no') return followOnly;
    // Once the trick is trumped (a plain suit led), no card of the suit led can beat it.
    if (suitOf(winning.card) !== led) return followOnly;
    const beaters = follow.filter((c) => strength(c) > strength(winning.card));
    if (beaters.length === 0) return followOnly;
    return { allowed: beaters, why: (c) => (suitOf(c) !== led ? 'follow' : beaters.includes(c) ? null : 'beat') };
  }
  // Void in the suit led.
  if (relaxed) return free;
  const trumps = hand.filter((c) => suitOf(c) === trumpSuit);
  if (trumps.length === 0) return free;
  const mustTrump = { allowed: trumps, why: (c: Card): IllegalReason | null => (suitOf(c) === trumpSuit ? null : 'trump') };
  if (config.mustBeat === 'no') return mustTrump;
  if (suitOf(winning.card) !== trumpSuit) return mustTrump;
  const over = trumps.filter((c) => strength(c) > strength(winning.card));
  if (over.length > 0) return { allowed: over, why: (c) => (over.includes(c) ? null : 'overtrump') };
  return config.underTrump === 'must' ? mustTrump : free;
}

// The exchange for the turned card

/** The card that may be exchanged for the turned card, if any, under the options. */
export function swapCardFor(turned: Card, config: Pick<TuteConfig, 'swap'>): Card | null {
  if (config.swap === 'none') return null;
  const suit = suitOf(turned);
  const rank = rankOf(turned);
  if (cardPoints(turned) > 0) return `7${suit}`;
  if (config.swap === 'seven-and-two' && (rank === '4' || rank === '5' || rank === '6' || rank === '7')) return `2${suit}`;
  return null;
}

type SwapFacts = Pick<TuteState, 'turned' | 'config' | 'tricks' | 'over' | 'dealer'>;

/** True when `seat`, holding `hand`, may exchange for the turned card now (on its turn). */
export function swapAllowed(s: SwapFacts, seat: Seat, hand: readonly Card[]): boolean {
  if (s.over || !s.turned) return false;
  const card = swapCardFor(s.turned, s.config);
  if (!card || !hand.includes(card)) return false;
  const players = seatCount(s.config);
  if (players === 4 && seat === s.dealer) return false;
  if (s.config.swapWhen === 'after-own-trick' && !s.tricks.some((t) => sideOf(t.winner, players) === sideOf(seat, players))) return false;
  return true;
}

// Cantes and the tute

type SingFacts = Pick<TuteState, 'config' | 'tricks' | 'canteOpen' | 'cantes' | 'trumpSuit' | 'over'>;

/** True when `seat`'s side may still sing for the last trick, and `seat` is one who may. */
export function maySing(s: SingFacts, seat: Seat): boolean {
  if (s.over || !s.canteOpen) return false;
  const last = s.tricks[s.tricks.length - 1];
  if (!last) return false;
  const players = seatCount(s.config);
  if (sideOf(last.winner, players) !== sideOf(seat, players)) return false;
  // Both partners may each sing once for the same trick.
  if (s.config.singer === 'both') return !s.cantes.some((c) => c.seat === seat && c.trick === s.tricks.length);
  return s.config.singer === 'side' || last.winner === seat;
}

/** The suits `seat` may sing now, holding `hand`. */
export function singable(s: SingFacts, seat: Seat, hand: readonly Card[]): Suit[] {
  if (!maySing(s, seat)) return [];
  const sung = new Set(s.cantes.map((c) => c.suit));
  const pairs = SUITS.filter((suit) => !sung.has(suit) && hand.includes(`R${suit}`) && hand.includes(`C${suit}`));
  if (s.config.fortyFirst === 'yes' && pairs.includes(s.trumpSuit)) return [s.trumpSuit];
  return pairs;
}

/** The tutes `seat` may declare now: four Reyes, four Caballos. */
export function tutes(s: SingFacts, seat: Seat, hand: readonly Card[]): ('R' | 'C')[] {
  if (s.config.tute === 'none' || !maySing(s, seat)) return [];
  return (['R', 'C'] as const).filter((rank) => SUITS.every((suit) => hand.includes(`${rank}${suit}`)));
}

// Dealing

const next = (seat: Seat, players: number): Seat => (seat + 1) % players;

function deal(config: TuteConfig, seed: string, handNo: number, dealer: Seat, carry: readonly number[], matchWins: readonly number[], results: readonly HandResult[]): { state: TuteState; event: TuteEvent } {
  const players = seatCount(config);
  const size = handSize(config);
  const deck = createRng(`${seed}/hand/${handNo}`).shuffle(DECK);
  const hands: Card[][] = Array.from({ length: players }, () => []);
  let seat = next(dealer, players);
  for (let i = 0; i < size * players; i++) {
    (hands[seat] as Card[]).push(deck.shift() as Card);
    seat = next(seat, players);
  }
  const known: Card[][] = hands.map(() => []);
  let turnedCard: Card;
  if (players === 4) {
    // The fortieth card is the dealer's: turned face up for trumps, then taken into hand.
    const dealt = hands[dealer] as Card[];
    turnedCard = dealt[dealt.length - 1] as Card;
    (known[dealer] as Card[]).push(turnedCard);
  } else {
    turnedCard = deck.shift() as Card;
    deck.push(turnedCard);
  }
  const state: TuteState = {
    config,
    seed,
    handNo,
    dealer,
    trumpSuit: suitOf(turnedCard),
    turnedCard,
    turned: turnedCard,
    hands,
    stock: deck,
    trick: [],
    leader: next(dealer, players),
    tricks: [],
    won: [[], []],
    cantes: [],
    canteOpen: false,
    known,
    carry,
    matchWins,
    results,
    over: false,
    champion: null,
  };
  return { state, event: { type: 'deal', handNo, dealer, trumpSuit: state.trumpSuit, turned: turnedCard, carry } };
}

function toMove(s: TuteState): Seat | null {
  if (s.over) return null;
  return (s.leader + s.trick.length) % seatCount(s.config);
}

export function dutyOf(s: Pick<TuteState, 'config' | 'stock'> | Pick<TuteView, 'config' | 'stockCount'>): Duty {
  return dutyAt(s.config, 'stock' in s ? s.stock.length : s.stockCount);
}

function legalActions(s: TuteState, seat: Seat): TuteAction[] {
  if (toMove(s) !== seat) return [];
  return actionsFor(s, seat, s.hands[seat] ?? [], dutyOf(s));
}

/** Every legal action for `seat` holding `hand` (the same from a state or from that seat's view). */
export function actionsFor(s: SingFacts & SwapFacts & { readonly trick: readonly PlayedCard[] }, seat: Seat, hand: readonly Card[], duty: Duty): TuteAction[] {
  const out: TuteAction[] = obligations({ hand, trick: s.trick, trumpSuit: s.trumpSuit, config: s.config, duty, seat }).allowed.map((card) => ({ type: 'play', card }));
  for (const suit of singable(s, seat, hand)) out.push({ type: 'sing', suit });
  for (const kind of tutes(s, seat, hand)) out.push({ type: 'tute', kind });
  if (swapAllowed(s, seat, hand)) out.push({ type: 'swap' });
  return out;
}

// Points

/** A side's points in this hand so far: cards won, cantes, and the last ten once taken. */
export function sidePoints(s: Pick<TuteState, 'won' | 'cantes' | 'config' | 'tricks' | 'hands' | 'stock'>, side: number): number {
  const players = seatCount(s.config);
  const cantes = s.cantes.filter((c) => sideOf(c.seat, players) === side).reduce((a, c) => a + c.points, 0);
  return pointsOf(s.won[side] ?? []) + cantes + (lastTrickSide(s) === side ? LAST_TEN : 0);
}

/** The side that took the last trick of the hand, once every card has been played. */
export function lastTrickSide(s: Pick<TuteState, 'config' | 'tricks' | 'hands' | 'stock'>): number | null {
  if (s.stock.length > 0 || s.hands.some((h) => h.length > 0)) return null;
  const last = s.tricks[s.tricks.length - 1];
  return last ? sideOf(last.winner, seatCount(s.config)) : null;
}

function canteTotals(s: TuteState): number[] {
  const players = seatCount(s.config);
  return [0, 1].map((side) => s.cantes.filter((c) => sideOf(c.seat, players) === side).reduce((a, c) => a + c.points, 0));
}

/** The side that has reached 101 (with what it carried in), under `handWin: reach101`. */
function reached(s: TuteState): number | null {
  if (s.config.handWin !== 'reach101') return null;
  const side = [0, 1].find((x) => (s.carry[x] ?? 0) + sidePoints(s, x) >= reachOf(s.config));
  return side ?? null;
}

function finishHand(s: TuteState, end: HandEnd, winnerSide: number | null, tuteSeat: Seat | null, events: TuteEvent[]): { state: TuteState; events: TuteEvent[] } {
  const config = s.config;
  const players = seatCount(config);
  const points = [0, 1].map((side) => sidePoints(s, side));
  const lastTrick = end === 'played' ? lastTrickSide(s) : null;
  let winner = winnerSide;
  let vuelta = false;
  let capote = false;
  let value = 1;
  if (end === 'played') {
    const allBy = (side: number) => {
      const counted = players === 4 ? s.tricks : s.tricks.filter((t) => t.stock === 0);
      return counted.length > 0 && counted.every((t) => sideOf(t.winner, players) === side);
    };
    if (config.handWin === 'reach101') {
      winner = reached(s);
      vuelta = winner === null;
    } else {
      const [a = 0, b = 0] = points;
      winner = a > b ? 0 : b > a ? 1 : config.tie === 'last-trick' ? lastTrick : null;
    }
    if (winner !== null && config.capote === 'two' && allBy(winner)) {
      capote = true;
      value = 2;
    }
    if (winner !== null && config.handWin === 'most' && config.bigWin === 'two' && (points[winner] ?? 0) >= REACH) value = 2;
  }
  if (end === 'tute') value = config.tute === 'two' ? 2 : 1;
  const result: HandResult = { points, carried: [...s.carry], cantes: canteTotals(s), lastTrick, end, winner, value, capote, vuelta, tute: tuteSeat };
  const matchWins = [...s.matchWins];
  if (winner !== null) matchWins[winner] = (matchWins[winner] ?? 0) + value;
  const results = [...s.results, result];
  const out: TuteEvent[] = [...events, { type: 'hand-end', result, matchWins }];
  const target = Math.max(1, config.matchTo);
  let champion: number | null = null;
  let done = false;
  if (end === 'tute' && config.tute === 'game') {
    champion = winner;
    done = true;
  } else if (matchWins.some((w, i) => w >= target && w - (matchWins[1 - i] ?? 0) >= config.margin)) {
    champion = matchWins.findIndex((w, i) => w >= target && w - (matchWins[1 - i] ?? 0) >= config.margin);
    done = true;
  } else if (target === 1 && winner === null && !vuelta) {
    // A drawn single hand is a drawn game.
    done = true;
  } else if (results.length >= MAX_HANDS) {
    const [a = 0, b = 0] = matchWins;
    champion = a > b ? 0 : b > a ? 1 : null;
    done = true;
  }
  if (done) {
    out.push({ type: 'match-end', winner: champion });
    return { state: { ...s, matchWins, results, over: true, champion, canteOpen: false }, events: out };
  }
  const carry = vuelta ? [0, 1].map((side) => (s.carry[side] ?? 0) + (points[side] ?? 0)) : [0, 0];
  const dealt = deal(config, s.seed, s.handNo + 1, next(s.dealer, players), carry, matchWins, results);
  out.push(dealt.event);
  return { state: dealt.state, events: out };
}

function applyAction(s: TuteState, action: TuteAction): { state: TuteState; events: TuteEvent[] } {
  const seat = toMove(s);
  if (seat === null) throw new Error('The game is over');
  const key = actionText(action);
  if (!legalActions(s, seat).some((a) => actionText(a) === key)) throw new Error(`${key} is not legal here`);
  const players = seatCount(s.config);
  const side = sideOf(seat, players);

  if (action.type === 'swap') {
    const took = s.turned as Card;
    const gave = swapCardFor(took, s.config) as Card;
    if (players === 4) {
      const dealer = s.dealer;
      const hands = s.hands.map((h, i) => (i === seat ? [...h.filter((c) => c !== gave), took] : i === dealer ? [...h.filter((c) => c !== took), gave] : h));
      const known = s.known.map((k, i) => (i === seat ? [...k, took] : i === dealer ? [...k.filter((c) => c !== took), gave] : k));
      return { state: { ...s, hands, known, turned: gave }, events: [{ type: 'swap', seat, gave, took, dealer }] };
    }
    const hands = s.hands.map((h, i) => (i === seat ? [...h.filter((c) => c !== gave), took] : h));
    const stock = [...s.stock.slice(0, -1), gave];
    const known = s.known.map((k, i) => (i === seat ? [...k, took] : k.filter((c) => c !== gave)));
    return { state: { ...s, hands, stock, known, turned: gave }, events: [{ type: 'swap', seat, gave, took, dealer: null }] };
  }

  if (action.type === 'sing') {
    const points = canteValue(action.suit, s.trumpSuit);
    const shown: Card[] = [`R${action.suit}`, `C${action.suit}`];
    const known = s.known.map((k, i) => (i === seat ? [...k, ...shown.filter((c) => !k.includes(c))] : k));
    const both = s.config.singer === 'both';
    const after: TuteState = { ...s, cantes: [...s.cantes, { seat, suit: action.suit, points, ...(both ? { trick: s.tricks.length } : {}) }], canteOpen: both, known };
    const events: TuteEvent[] = [{ type: 'sing', seat, suit: action.suit, points }];
    const reach = reached(after);
    if (reach !== null) return finishHand(after, 'reach', reach, null, [...events, { type: 'reach', side: reach, points: (after.carry[reach] ?? 0) + sidePoints(after, reach) }]);
    return { state: after, events };
  }

  if (action.type === 'tute') {
    const cards = SUITS.map((suit): Card => `${action.kind}${suit}`);
    const known = s.known.map((k, i) => (i === seat ? [...k, ...cards.filter((c) => !k.includes(c))] : k));
    return finishHand({ ...s, known, canteOpen: false }, 'tute', side, seat, [{ type: 'tute', seat, kind: action.kind, cards }]);
  }

  const card = action.card;
  const hands = s.hands.map((h, i) => (i === seat ? h.filter((c) => c !== card) : h));
  const known = s.known.map((k, i) => (i === seat ? k.filter((c) => c !== card) : k));
  const turned = players === 4 && card === s.turned ? null : s.turned;
  const trick = [...s.trick, { seat, card }];
  const events: TuteEvent[] = [{ type: 'play', seat, card }];
  if (trick.length < players) return { state: { ...s, hands, known, turned, trick }, events };

  // The trick is complete.
  const winner = trickWinner(trick, s.trumpSuit);
  const winSide = sideOf(winner, players);
  const cards = trick.map((p) => p.card);
  const won = s.won.map((w, i) => (i === winSide ? [...w, ...cards] : w));
  const tricks = [...s.tricks, { leader: s.leader, plays: trick, winner, stock: s.stock.length }];
  // Draw (two players): the winner first. The turned card comes out last.
  const stock = [...s.stock];
  const drawn = hands.map((h) => [...h]);
  const knownAfter = known.map((k) => [...k]);
  let turnedAfter = turned;
  const draws: TuteEvent[] = [];
  for (const drawer of [winner, next(winner, players)]) {
    if (players !== 2) break;
    const top = stock.shift();
    if (!top) break;
    (drawn[drawer] as Card[]).push(top);
    const isTurned = stock.length === 0 && turnedAfter !== null;
    if (isTurned) {
      (knownAfter[drawer] as Card[]).push(top);
      turnedAfter = null;
    }
    draws.push({ type: 'draw', seat: drawer, card: top, turned: isTurned });
  }
  const after: TuteState = { ...s, hands: drawn, known: knownAfter, stock, turned: turnedAfter, trick: [], leader: winner, tricks, won, canteOpen: true };
  const last = stock.length === 0 && drawn.every((h) => h.length === 0);
  events.push({ type: 'trick', winner, plays: trick, points: pointsOf(cards) + (last ? LAST_TEN : 0), last }, ...draws);
  if (last) return finishHand(after, 'played', null, null, events);
  const reach = reached(after);
  if (reach !== null) return finishHand(after, 'reach', reach, null, [...events, { type: 'reach', side: reach, points: (after.carry[reach] ?? 0) + sidePoints(after, reach) }]);
  return { state: after, events };
}

// Codecs

export function actionText(a: TuteAction): string {
  switch (a.type) {
    case 'play':
      return a.card;
    case 'sing':
      return `sing-${a.suit}`;
    case 'tute':
      return `tute-${a.kind}`;
    case 'swap':
      return 'swap';
  }
}

function parseAction(text: string): TuteAction {
  const t = text.trim();
  if (t === 'swap') return { type: 'swap' };
  const sing = /^sing-([oceb])$/.exec(t);
  if (sing) return { type: 'sing', suit: sing[1] as Suit };
  const tute = /^tute-([RC])$/.exec(t);
  if (tute) return { type: 'tute', kind: tute[1] as 'R' | 'C' };
  if (!isCard(t)) throw new Error(`"${text}" is not a Tute move, such as Ao, sing-c, tute-R or swap`);
  return { type: 'play', card: t };
}

const CONFIG_KEYS = Object.keys(CONFIG_CHOICES) as (keyof typeof CONFIG_CHOICES)[];

function readConfig(json: Json): TuteConfig {
  if (!isJsonObject(json)) return SPAIN_PAIRS;
  const out: Record<string, Json> = {};
  for (const key of CONFIG_KEYS) {
    const allowed = CONFIG_CHOICES[key] as readonly (string | number)[];
    const value = json[key];
    out[key] = (typeof value === 'string' || typeof value === 'number') && allowed.includes(value) ? value : (SPAIN_PAIRS[key]);
  }
  if (typeof json.start === 'string') out.start = json.start;
  return out as unknown as TuteConfig;
}

function configJson(c: TuteConfig): Json {
  const out: Record<string, Json> = {};
  for (const key of CONFIG_KEYS) out[key] = c[key];
  if (c.start) out.start = c.start;
  return out;
}

const cardsOf = (json: Json | undefined, what: string): Card[] => {
  if (!Array.isArray(json) || !json.every((c) => typeof c === 'string' && isCard(c))) throw new Error(`Tute: ${what} is damaged`);
  return json;
};
const numsOf = (json: Json | undefined, what: string): number[] => {
  if (!Array.isArray(json) || !json.every((n) => typeof n === 'number')) throw new Error(`Tute: ${what} is damaged`);
  return json;
};
const playsOf = (json: Json | undefined, what: string): PlayedCard[] => {
  if (!Array.isArray(json)) throw new Error(`Tute: ${what} is damaged`);
  return json.map((p) => {
    if (!isJsonObject(p) || typeof p.seat !== 'number' || typeof p.card !== 'string' || !isCard(p.card)) throw new Error(`Tute: ${what} is damaged`);
    return { seat: p.seat, card: p.card };
  });
};

function resultFromJson(r: Json): HandResult {
  if (!isJsonObject(r)) throw new Error('Tute: a hand result is damaged');
  const end: HandEnd = r.end === 'reach' || r.end === 'tute' ? r.end : 'played';
  return {
    points: numsOf(r.points, 'a result'),
    carried: numsOf(r.carried ?? [0, 0], 'a result'),
    cantes: numsOf(r.cantes ?? [0, 0], 'a result'),
    lastTrick: typeof r.lastTrick === 'number' ? r.lastTrick : null,
    end,
    winner: typeof r.winner === 'number' ? r.winner : null,
    value: typeof r.value === 'number' ? r.value : 1,
    capote: r.capote === true,
    vuelta: r.vuelta === true,
    tute: typeof r.tute === 'number' ? r.tute : null,
  };
}

function resultToJson(r: HandResult): Json {
  return { points: [...r.points], carried: [...r.carried], cantes: [...r.cantes], lastTrick: r.lastTrick, end: r.end, winner: r.winner, value: r.value, capote: r.capote, vuelta: r.vuelta, tute: r.tute };
}

function stateFromJson(json: Json): TuteState {
  if (!isJsonObject(json)) throw new Error('Not a Tute position');
  const config = readConfig(json.config ?? null);
  const players = seatCount(config);
  const tricks: Trick[] = Array.isArray(json.tricks)
    ? json.tricks.map((t) => {
        if (!isJsonObject(t) || typeof t.leader !== 'number' || typeof t.winner !== 'number') throw new Error('Tute: a trick is damaged');
        return { leader: t.leader, winner: t.winner, plays: playsOf(t.plays, 'a trick'), stock: typeof t.stock === 'number' ? t.stock : 0, ...(t.setup === true ? { setup: true } : {}) };
      })
    : [];
  const cantes: Cante[] = Array.isArray(json.cantes)
    ? json.cantes.map((c) => {
        if (!isJsonObject(c) || typeof c.seat !== 'number' || typeof c.suit !== 'string' || !SUITS.includes(c.suit as Suit) || typeof c.points !== 'number') throw new Error('Tute: a cante is damaged');
        return { seat: c.seat, suit: c.suit as Suit, points: c.points, ...(typeof c.trick === 'number' ? { trick: c.trick } : {}) };
      })
    : [];
  const hands = Array.isArray(json.hands) ? json.hands.map((h) => cardsOf(h, 'a hand')) : [];
  if (hands.length !== players) throw new Error(`Tute: ${hands.length} hands for ${players} players`);
  const turnedCard = typeof json.turnedCard === 'string' && isCard(json.turnedCard) ? json.turnedCard : null;
  if (!turnedCard) throw new Error('Tute: the turned card is missing');
  const state: TuteState = {
    config,
    seed: typeof json.seed === 'string' ? json.seed : 'lesson',
    handNo: typeof json.handNo === 'number' ? json.handNo : 0,
    dealer: typeof json.dealer === 'number' && json.dealer >= 0 && json.dealer < players ? json.dealer : players - 1,
    trumpSuit: typeof json.trumpSuit === 'string' && SUITS.includes(json.trumpSuit as Suit) ? (json.trumpSuit as Suit) : suitOf(turnedCard),
    turnedCard,
    turned: typeof json.turned === 'string' && isCard(json.turned) ? json.turned : null,
    hands,
    stock: cardsOf(json.stock ?? [], 'the stock'),
    trick: playsOf(json.trick ?? [], 'the trick'),
    leader: typeof json.leader === 'number' && json.leader >= 0 && json.leader < players ? json.leader : 0,
    tricks,
    won: Array.isArray(json.won) && json.won.length === 2 ? json.won.map((w) => cardsOf(w, 'a pile')) : [[], []],
    cantes,
    canteOpen: json.canteOpen === true,
    known: Array.isArray(json.known) && json.known.length === players ? json.known.map((k) => cardsOf(k, 'a known card')) : hands.map(() => []),
    carry: Array.isArray(json.carry) ? numsOf(json.carry, 'the carried points') : [0, 0],
    matchWins: Array.isArray(json.matchWins) ? numsOf(json.matchWins, 'the match score') : [0, 0],
    results: Array.isArray(json.results) ? json.results.map(resultFromJson) : [],
    over: json.over === true,
    champion: typeof json.champion === 'number' ? json.champion : null,
  };
  checkConservation(state);
  return state;
}

/** Every card is in exactly one place, and the piles are the tricks. Throws otherwise. */
export function checkConservation(s: TuteState): void {
  const all = [...s.hands.flat(), ...s.stock, ...s.trick.map((p) => p.card), ...s.won.flat()];
  if (new Set(all).size !== all.length) throw new Error('Tute: a card is in two places');
  if (all.length !== DECK.length) throw new Error(`Tute: ${all.length} cards, not ${DECK.length}`);
  const players = seatCount(s.config);
  if (seatCount(s.config) === 2 && s.turned && s.stock.length > 0 && s.stock[s.stock.length - 1] !== s.turned) throw new Error('Tute: the turned card is not under the stock');
  if (players === 4 && s.stock.length > 0) throw new Error('Tute: four players have no stock');
  for (const side of [0, 1]) {
    const fromTricks = s.tricks.filter((t) => sideOf(t.winner, players) === side).flatMap((t) => t.plays.map((p) => p.card));
    const pile = s.won[side] ?? [];
    if (fromTricks.length !== pile.length || fromTricks.some((c) => !pile.includes(c))) throw new Error('Tute: a pile does not match its tricks');
  }
  s.known.forEach((k, seat) => {
    if (k.some((c) => !(s.hands[seat] ?? []).includes(c))) throw new Error('Tute: a known card is not in its hand');
  });
}

function stateToJson(s: TuteState): Json {
  return {
    config: configJson(s.config),
    seed: s.seed,
    handNo: s.handNo,
    dealer: s.dealer,
    trumpSuit: s.trumpSuit,
    turnedCard: s.turnedCard,
    turned: s.turned,
    hands: s.hands.map((h) => [...h]),
    stock: [...s.stock],
    trick: s.trick.map((p) => ({ seat: p.seat, card: p.card })),
    leader: s.leader,
    tricks: s.tricks.map((t) => ({ leader: t.leader, winner: t.winner, plays: t.plays.map((p) => ({ seat: p.seat, card: p.card })), stock: t.stock, ...(t.setup ? { setup: true } : {}) })),
    won: s.won.map((w) => [...w]),
    cantes: s.cantes.map((c) => ({ seat: c.seat, suit: c.suit, points: c.points, ...(c.trick !== undefined ? { trick: c.trick } : {}) })),
    canteOpen: s.canteOpen,
    known: s.known.map((k) => [...k]),
    carry: [...s.carry],
    matchWins: [...s.matchWins],
    results: s.results.map(resultToJson),
    over: s.over,
    champion: s.champion,
  };
}

const stateCodec: Codec<TuteState> = {
  toJSON: stateToJson,
  fromJSON: stateFromJson,
  toText: (s) => stableStringify(stateToJson(s)),
  fromText: (text) => stateFromJson(JSON.parse(text) as Json),
};

const actionCodec: Codec<TuteAction> = {
  toJSON: (a) => actionText(a),
  fromJSON(json) {
    if (typeof json !== 'string') throw new Error('A Tute move is stored as text, such as Ao or sing-c');
    return parseAction(json);
  },
  toText: actionText,
  fromText: (text) => parseAction(text),
};

const configCodec: JsonCodec<TuteConfig> = { toJSON: configJson, fromJSON: readConfig };

function outcomeOf(s: TuteState): Outcome | null {
  if (!s.over) return null;
  const players = seatCount(s.config);
  const single = Math.max(1, s.config.matchTo) === 1;
  const last = s.results[s.results.length - 1];
  const score = (side: number) => (single ? (last?.carried[side] ?? 0) + (last?.points[side] ?? 0) : (s.matchWins[side] ?? 0));
  const seats = Array.from({ length: players }, (_, i) => i);
  const teams = teamsOf(players);
  const winner = s.champion;
  if (winner === null) return { reason: 'tute-tie', teams, results: seats.map((seat) => ({ seat, place: 1, score: score(sideOf(seat, players)) })) };
  const reason = last?.end === 'tute' ? 'tute-tute' : single ? 'tute-points' : 'tute-match';
  return { reason, teams, results: seats.map((seat) => ({ seat, place: sideOf(seat, players) === winner ? 1 : 2, score: score(sideOf(seat, players)) })) };
}

export function viewOf(s: TuteState, seat: Seat): TuteView {
  return {
    seat,
    config: s.config,
    handNo: s.handNo,
    dealer: s.dealer,
    trumpSuit: s.trumpSuit,
    turnedCard: s.turnedCard,
    turned: s.turned,
    hand: [...(s.hands[seat] ?? [])],
    handCounts: s.hands.map((h) => h.length),
    stockCount: s.stock.length,
    trick: s.trick,
    leader: s.leader,
    tricks: s.tricks,
    won: s.won,
    cantes: s.cantes,
    canteOpen: s.canteOpen,
    known: s.known,
    carry: s.carry,
    matchWins: s.matchWins,
    results: s.results,
    over: s.over,
    champion: s.champion,
  };
}

/** The seat to move, from a view. */
export function viewTurn(v: TuteView): Seat | null {
  return v.over ? null : (v.leader + v.trick.length) % seatCount(v.config);
}

/** The cards a seat cannot see: everything not in its hand, played, known to be held, or turned under the stock. */
export function unseenCards(v: TuteView): Card[] {
  const seen = new Set<Card>([...v.hand, ...v.trick.map((p) => p.card), ...v.won.flat(), ...v.known.flat()]);
  if (seatCount(v.config) === 2 && v.turned && v.stockCount > 0) seen.add(v.turned);
  return DECK.filter((c) => !seen.has(c));
}

/**
 * What each seat is known not to hold, from the obligations: a seat that did not follow suit holds
 * none of the suit led, one that did not trump holds no trump that would have been required, one
 * that did not beat holds nothing that beats. Only plays made when no more cards could be drawn
 * count (always with four players; with two, once the stock is gone), so the inference is for good.
 */
export function cannotHold(v: Pick<TuteView, 'config' | 'tricks' | 'trick' | 'trumpSuit' | 'stockCount' | 'seat'>): Set<Card>[] {
  const players = seatCount(v.config);
  const out = Array.from({ length: players }, () => new Set<Card>());
  const trumpSuit = v.trumpSuit;
  const consider = (plays: readonly PlayedCard[]) => {
    for (let i = 1; i < plays.length; i++) {
      const { seat, card } = plays[i] as PlayedCard;
      if (seat === v.seat) continue;
      const prefix = plays.slice(0, i);
      const led = suitOf((prefix[0] as PlayedCard).card);
      const winning = winningPlay(prefix, trumpSuit);
      const relaxed = v.config.partner === 'relaxed' && partnerOf(seat, players) === winning.seat;
      const bar = out[seat] as Set<Card>;
      const forbid = (pred: (c: Card) => boolean) => DECK.forEach((c) => pred(c) && bar.add(c));
      if (suitOf(card) !== led) {
        forbid((c) => suitOf(c) === led);
        if (relaxed) continue;
        if (suitOf(card) !== trumpSuit) {
          if (v.config.mustBeat === 'no' || suitOf(winning.card) !== trumpSuit || v.config.underTrump === 'must') forbid((c) => suitOf(c) === trumpSuit);
          else forbid((c) => suitOf(c) === trumpSuit && strength(c) > strength(winning.card));
        } else if (v.config.mustBeat === 'yes' && suitOf(winning.card) === trumpSuit && strength(card) < strength(winning.card)) {
          forbid((c) => suitOf(c) === trumpSuit && strength(c) > strength(winning.card));
        }
      } else if (!relaxed && v.config.mustBeat === 'yes' && suitOf(winning.card) === led && strength(card) < strength(winning.card)) {
        forbid((c) => suitOf(c) === led && strength(c) > strength(winning.card));
      }
    }
  };
  for (const t of v.tricks) if (!t.setup && (players === 4 || t.stock === 0)) consider(t.plays);
  if (players === 4 || v.stockCount === 0) consider(v.trick);
  return out;
}

/**
 * Deals `cards` into slots of the given sizes at random, keeping each card out of the slots that
 * may not hold it. Returns null when no such deal is found in a few tries.
 */
function dealWithin(cards: readonly Card[], sizes: readonly number[], barred: readonly (ReadonlySet<Card> | null)[], rng: Rng): Card[][] | null {
  for (let attempt = 0; attempt < 40; attempt++) {
    const left = [...sizes];
    const out: Card[][] = sizes.map(() => []);
    const order = rng.shuffle(cards).sort((a, b) => barred.filter((x) => x?.has(a)).length - barred.filter((x) => x?.has(b)).length).reverse();
    let ok = true;
    for (const card of order) {
      const weights = left.map((n, slot) => (n > 0 && !barred[slot]?.has(card) ? n : 0));
      const total = weights.reduce((a, b) => a + b, 0);
      if (total === 0) {
        ok = false;
        break;
      }
      let r = rng.int(total);
      let slot = 0;
      while (r >= (weights[slot] ?? 0)) r -= weights[slot++] ?? 0;
      (out[slot] as Card[]).push(card);
      left[slot] = (left[slot] ?? 0) - 1;
    }
    if (ok) return out;
  }
  return null;
}

/** Deals `cards` into slots of the given sizes at random, with no constraints. */
function plainDeal(cards: readonly Card[], sizes: readonly number[], rng: Rng): Card[][] {
  const deck = rng.shuffle(cards);
  return sizes.map((n) => deck.splice(0, n));
}

/**
 * A full state consistent with a view: the unseen cards dealt at random to the other hands and the
 * stock, around the cards known to be held. With `infer` (the default) each seat is kept clear of
 * the cards it is known not to hold, so every play in the history stays legal.
 */
export function sampleState(v: TuteView, rng: Rng, infer = true): TuteState {
  const players = seatCount(v.config);
  const unseen = unseenCards(v);
  const others = Array.from({ length: players }, (_, i) => i).filter((i) => i !== v.seat);
  const held = (seat: Seat) => (v.known[seat] ?? []).filter((c) => !v.hand.includes(c));
  const turnedUnder = players === 2 && v.turned !== null && v.stockCount > 0;
  const stockSize = v.stockCount - (turnedUnder ? 1 : 0);
  const sizes = [...others.map((seat) => Math.max(0, (v.handCounts[seat] ?? 0) - held(seat).length)), stockSize];
  const bars = infer ? cannotHold(v) : null;
  const barred = [...others.map((seat) => bars?.[seat] ?? null), null];
  const dealt = dealWithin(unseen, sizes, barred, rng) ?? plainDeal(unseen, sizes, rng);
  const hands: Card[][] = Array.from({ length: players }, () => []);
  hands[v.seat] = [...v.hand];
  others.forEach((seat, i) => (hands[seat] = [...held(seat), ...(dealt[i] ?? [])]));
  const stock = [...(dealt[others.length] ?? []), ...(turnedUnder && v.turned ? [v.turned] : [])];
  return {
    config: v.config,
    seed: `sample/${rng.int(1_000_000_000)}`,
    handNo: v.handNo,
    dealer: v.dealer,
    trumpSuit: v.trumpSuit,
    turnedCard: v.turnedCard,
    turned: v.turned,
    hands,
    stock,
    trick: v.trick,
    leader: v.leader,
    tricks: v.tricks,
    won: v.won,
    cantes: v.cantes,
    canteOpen: v.canteOpen,
    known: v.known,
    carry: v.carry,
    matchWins: v.matchWins,
    results: v.results,
    over: v.over,
    champion: v.champion,
  };
}

export const tute: GameDef<TuteState, TuteAction, TuteConfig, TuteView, TuteEvent & GameEvent> = {
  id: 'tute',
  rulesVersion: 1,
  defaultConfig: SPAIN_PAIRS,
  setup(config, rng) {
    const seed = `tute/${rng.int(2_147_483_647)}/${rng.int(2_147_483_647)}`;
    if (config.start) {
      // Play on from a position: the same cards where they lay, the rules of this game.
      const from = stateFromJson(JSON.parse(config.start) as Json);
      return { ...from, config: { ...config, players: from.config.players }, seed };
    }
    const players = seatCount(config);
    return deal(config, seed, 0, players - 1, [0, 0], [0, 0], []).state;
  },
  seats: (s) => Array.from({ length: seatCount(s.config) }, (_, i) => i),
  turn: toMove,
  legal: legalActions,
  apply: applyAction,
  outcome: outcomeOf,
  view: viewOf,
  sample: (view, _seat, rng) => sampleState(view, rng),
  teams: (s) => teamsOf(seatCount(s.config)),
  codec: { state: stateCodec, action: actionCodec, config: configCodec },
};

/** Which preset a config is, if any. */
export function presetOf(config: TuteConfig): string | null {
  const key = stableStringify(configJson({ ...config, start: undefined }));
  return Object.entries(PRESETS).find(([, c]) => stableStringify(configJson(c)) === key)?.[0] ?? null;
}

/** Why `card` may not be played by the seat to move, or null when it may. */
export function explainCard(s: TuteState, card: Card): IllegalReason | null {
  const seat = toMove(s);
  if (seat === null) return null;
  return obligations({ hand: s.hands[seat] ?? [], trick: s.trick, trumpSuit: s.trumpSuit, config: s.config, duty: dutyOf(s), seat }).why(card);
}

/**
 * A position for tests, lessons and problems, from a short description. Seat 0 is the student.
 * With two players and no stock given, cards not named go face down into the stock (the turned card
 * last). Otherwise they are put into won tricks, a trick at a time, taken in turn by each side and
 * the last by `lastWinner`'s side, so every position holds all forty cards.
 */
export function position(p: {
  players?: 2 | 4;
  trump: Card | Suit;
  hands: readonly (readonly Card[])[];
  stock?: readonly Card[];
  trick?: readonly PlayedCard[];
  leader?: Seat;
  /** Who won the last completed trick; the trick's leader when absent. */
  lastWinner?: Seat;
  /** Cards dealt out as won tricks, by side; those not named are dealt as above. */
  won?: readonly (readonly Card[])[];
  cantes?: readonly Cante[];
  canteOpen?: boolean;
  dealer?: Seat;
  known?: readonly (readonly Card[])[];
  config?: Partial<TuteConfig>;
}): string {
  const players = p.players ?? 4;
  const config: TuteConfig = { ...SPAIN_PAIRS, ...(players === 2 ? { players: 2, swap: 'seven-and-two', handWin: 'reach101' } : {}), ...p.config, players };
  const turnedGiven = p.trump.length === 2;
  const turnedCard: Card = turnedGiven ? (p.trump as Card) : (`2${p.trump}` as Card);
  const trumpSuit = suitOf(turnedCard);
  const trick = [...(p.trick ?? [])];
  const leader = p.leader ?? trick[0]?.seat ?? 0;
  const named = new Set<Card>([...p.hands.flat(), ...(p.stock ?? []), ...trick.map((t) => t.card), ...(p.won ?? []).flat()]);
  const turnedFree = turnedGiven && !named.has(turnedCard);
  const rest = DECK.filter((c) => !named.has(c) && !(turnedFree && c === turnedCard));
  let stock: Card[] = [];
  let turned: Card | null = null;
  if (players === 2 && p.stock === undefined) {
    stock = [...rest, ...(turnedFree ? [turnedCard] : [])];
    turned = turnedFree ? turnedCard : null;
    rest.splice(0);
  } else if (players === 2 && p.stock) {
    stock = [...p.stock];
    if (turnedFree && stock.length > 0) {
      stock.push(turnedCard);
      turned = turnedCard;
    } else if (turnedFree) rest.push(turnedCard);
  } else if (turnedFree) rest.push(turnedCard);
  const lastWinner = p.lastWinner ?? leader;
  const lastSide = sideOf(lastWinner, players);
  const won: Card[][] = [[...(p.won?.[0] ?? [])], [...(p.won?.[1] ?? [])]];
  if (rest.length % players !== 0) throw new Error(`Tute position: ${rest.length} loose cards do not make whole tricks`);
  const loose: Card[][] = [];
  for (let i = 0; i < rest.length; i += players) loose.push(rest.slice(i, i + players));
  // Loose tricks go to the sides in turn, the last one to the last winner's side.
  loose.forEach((chunk, i) => (won[(lastSide + loose.length - 1 - i) % 2] as Card[]).push(...chunk));
  // The won piles as tricks, the last winner's side last: their cards are real, their order is not.
  const chunksOf = (side: number): Card[][] => {
    const pile = won[side] as Card[];
    const out: Card[][] = [];
    for (let i = 0; i < pile.length; i += players) out.push(pile.slice(i, i + players));
    return out;
  };
  const sequence = [...chunksOf(1 - lastSide).map((cards) => ({ side: 1 - lastSide, cards })), ...chunksOf(lastSide).map((cards) => ({ side: lastSide, cards }))];
  const tricks: Trick[] = sequence.map(({ side, cards }, i) => {
    const winner = i === sequence.length - 1 && side === lastSide ? lastWinner : side;
    return { leader: winner, winner, plays: cards.map((card, j) => ({ seat: (winner + j) % players, card })), stock: players === 2 ? stock.length : 0, setup: true };
  });
  const dealer = p.dealer ?? players - 1;
  const known: Card[][] = p.known ? p.known.map((k) => [...k]) : Array.from({ length: players }, () => []);
  if (players === 4 && turnedGiven && (p.hands[dealer] ?? []).includes(turnedCard)) {
    turned = turnedCard;
    if (!(known[dealer] ?? []).includes(turnedCard)) (known[dealer] as Card[]).push(turnedCard);
  }
  const state: TuteState = {
    config,
    seed: 'lesson',
    handNo: 0,
    dealer,
    trumpSuit,
    turnedCard,
    turned,
    hands: p.hands.map((h) => [...h]),
    stock,
    trick,
    leader,
    tricks,
    won,
    cantes: [...(p.cantes ?? [])],
    canteOpen: p.canteOpen ?? tricks.length > 0,
    known,
    carry: [0, 0],
    matchWins: [0, 0],
    results: [],
    over: false,
    champion: null,
  };
  return stateCodec.toText(state);
}
