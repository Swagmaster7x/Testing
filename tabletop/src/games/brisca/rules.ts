/**
 * Brisca for two players (docs/rules/brisca.md), behind the game contract. Every disputed rule is
 * an option in the config, and the presets are named configs. Cards are written as rank and suit:
 * "Ao" is the As de oros, "Rb" the Rey de bastos, "7e" the siete de espadas.
 *
 * Hidden information: a seat's view holds its own hand, the public history (every card played and
 * who won it, swaps, the turned card) and counts, never the other hand, the order of the stock or
 * the seed that deals later hands.
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
export const SEATS = 2;
export const HAND_SIZE = 3;

export interface BriscaConfig {
  readonly swap: 'seven-and-two' | 'seven' | 'none';
  readonly swapWhen: 'any-turn' | 'after-own-trick';
  readonly tie: 'draw' | 'most-cards';
  readonly turnedBrisca: 'stays' | 'redeal';
  readonly bigWin: 'single' | 'double';
  readonly matchTo: number;
  readonly trumps: 'turned' | 'rotate';
  readonly arrastre: 'off' | 'on';
  readonly secondBrisca: 'three' | 'seven';
  /** A position to start from instead of a deal ("play on from here"), in state notation. */
  readonly start?: string;
}

export const PUERTO_RICO: BriscaConfig = {
  swap: 'seven-and-two',
  swapWhen: 'any-turn',
  tie: 'draw',
  turnedBrisca: 'stays',
  bigWin: 'single',
  matchTo: 1,
  trumps: 'turned',
  arrastre: 'off',
  secondBrisca: 'three',
};

export const PRESETS: Readonly<Record<string, BriscaConfig>> = {
  'puerto-rico': PUERTO_RICO,
  spain: { ...PUERTO_RICO, swapWhen: 'after-own-trick', tie: 'most-cards' },
  italy: { ...PUERTO_RICO, swap: 'none' },
  'open-table': { ...PUERTO_RICO, matchTo: 3 },
};

export const MATCH_LENGTHS: readonly number[] = [1, 2, 3, 5, 7];
/** A match never runs past this many hands; if it does (ties), it ends as a draw. */
const MAX_HANDS = 25;

export interface PlayedCard {
  readonly seat: Seat;
  readonly card: Card;
}

export interface HandResult {
  readonly points: readonly number[];
  readonly cards: readonly number[];
  /** The seat that won the hand, or null for a tie. */
  readonly winner: Seat | null;
}

export interface BriscaState {
  readonly config: BriscaConfig;
  /** Deals the later hands of a match. Never part of a view. */
  readonly seed: string;
  readonly handNo: number;
  readonly dealer: Seat;
  readonly trumpSuit: Suit;
  /** The card turned for trumps, while it is still under the stock; null once drawn or with rotating trumps. */
  readonly turned: Card | null;
  readonly hands: readonly (readonly Card[])[];
  /** Top first. When a card is turned, it is the last card of the stock. */
  readonly stock: readonly Card[];
  readonly trick: readonly PlayedCard[];
  readonly leader: Seat;
  /** The cards each seat has won this hand, trick by trick. */
  readonly won: readonly (readonly Card[])[];
  readonly tricksWon: readonly number[];
  /** Cards everyone knows are in a seat's hand: the turned card once drawn or swapped. */
  readonly known: readonly (readonly Card[])[];
  /** The lead of this trick was "arrastro" with the As of trumps. */
  readonly arrastre: boolean;
  readonly matchWins: readonly number[];
  readonly results: readonly HandResult[];
  readonly over: boolean;
}

export type BriscaAction = { readonly type: 'play'; readonly card: Card; readonly call?: boolean } | { readonly type: 'swap' };

export type BriscaEvent =
  | { readonly type: 'deal'; readonly handNo: number; readonly dealer: Seat; readonly trumpSuit: Suit; readonly turned: Card | null }
  | { readonly type: 'play'; readonly seat: Seat; readonly card: Card; readonly call: boolean }
  | { readonly type: 'swap'; readonly seat: Seat; readonly gave: Card; readonly took: Card }
  | { readonly type: 'trick'; readonly winner: Seat; readonly plays: readonly PlayedCard[]; readonly points: number }
  | { readonly type: 'draw'; readonly seat: Seat; readonly card: Card; readonly turned: boolean }
  | { readonly type: 'hand-end'; readonly points: readonly number[]; readonly winner: Seat | null; readonly matchWins: readonly number[] }
  | { readonly type: 'match-end'; readonly winner: Seat | null };

export interface BriscaView {
  readonly seat: Seat;
  readonly config: BriscaConfig;
  readonly handNo: number;
  readonly dealer: Seat;
  readonly trumpSuit: Suit;
  readonly turned: Card | null;
  readonly hand: readonly Card[];
  readonly handCounts: readonly number[];
  readonly stockCount: number;
  readonly trick: readonly PlayedCard[];
  readonly leader: Seat;
  readonly won: readonly (readonly Card[])[];
  readonly tricksWon: readonly number[];
  readonly known: readonly (readonly Card[])[];
  readonly arrastre: boolean;
  readonly matchWins: readonly number[];
  readonly results: readonly HandResult[];
  readonly over: boolean;
}

// Cards

export const suitOf = (card: Card): Suit => card[1] as Suit;
export const rankOf = (card: Card): Rank => card[0] as Rank;

export function isCard(text: string): text is Card {
  return /^[A234567SCR][oceb]$/.test(text);
}

/** The order within a suit, strongest first. */
export function rankOrder(config: Pick<BriscaConfig, 'secondBrisca'>): readonly Rank[] {
  return config.secondBrisca === 'seven' ? ['A', '7', 'R', 'C', 'S', '6', '5', '4', '3', '2'] : ['A', '3', 'R', 'C', 'S', '7', '6', '5', '4', '2'];
}

/** Strength within a suit: higher is stronger (0 to 9). */
export function strength(card: Card, config: Pick<BriscaConfig, 'secondBrisca'>): number {
  return 9 - rankOrder(config).indexOf(rankOf(card));
}

const BASE_POINTS: Readonly<Record<Rank, number>> = { A: 11, '3': 10, R: 4, C: 3, S: 2, '7': 0, '6': 0, '5': 0, '4': 0, '2': 0 };

export function cardPoints(card: Card, config: Pick<BriscaConfig, 'secondBrisca'>): number {
  const rank = rankOf(card);
  if (config.secondBrisca === 'seven') {
    if (rank === '7') return 10;
    if (rank === '3') return 0;
  }
  return BASE_POINTS[rank];
}

export function pointsOf(cards: readonly Card[], config: Pick<BriscaConfig, 'secondBrisca'>): number {
  return cards.reduce((a, c) => a + cardPoints(c, config), 0);
}

/** The points in the whole pack, and what wins a hand. */
export const TOTAL_POINTS = 120;
export const WINNING_POINTS = TOTAL_POINTS / 2 + 1;

/** The seat winning a (complete or partial) trick: highest trump, or the highest card of the suit led. */
export function trickWinner(trick: readonly PlayedCard[], trumpSuit: Suit, config: Pick<BriscaConfig, 'secondBrisca'>): Seat {
  const first = trick[0];
  if (!first) throw new Error('An empty trick has no winner');
  let best = first;
  for (const p of trick.slice(1)) {
    const a = best.card;
    const b = p.card;
    const aTrump = suitOf(a) === trumpSuit;
    const bTrump = suitOf(b) === trumpSuit;
    if (bTrump && !aTrump) best = p;
    else if (suitOf(b) === suitOf(a) && strength(b, config) > strength(a, config)) best = p;
  }
  return best.seat;
}

/** The card that may be swapped for the turned card, if any, under the options. */
export function swapCardFor(turned: Card, config: BriscaConfig): Card | null {
  if (config.swap === 'none' || config.trumps !== 'turned') return null;
  const suit = suitOf(turned);
  const points = cardPoints(turned, config) > 0;
  if (points && rankOf(turned) !== '7') return `7${suit}`;
  if (config.swap === 'seven-and-two' && ['4', '5', '6', '7'].includes(rankOf(turned)) && cardPoints(turned, config) === 0) return `2${suit}`;
  // With the seven as second brisca, a turned 7 is a point card: the 2 may take any blank turned card above it.
  if (config.swap === 'seven-and-two' && config.secondBrisca === 'seven' && ['3', '4', '5', '6'].includes(rankOf(turned))) return `2${suit}`;
  return null;
}

const other = (seat: Seat): Seat => (seat === 0 ? 1 : 0);

// Dealing

function shuffled(rng: Rng): Card[] {
  return rng.shuffle(DECK);
}

function deal(config: BriscaConfig, seed: string, handNo: number, dealer: Seat, matchWins: readonly number[], results: readonly HandResult[]): { state: BriscaState; event: BriscaEvent } {
  const rng = createRng(`${seed}/hand/${handNo}`);
  const deck = shuffled(rng);
  const hands: Card[][] = [[], []];
  let seat = other(dealer);
  for (let i = 0; i < HAND_SIZE * SEATS; i++) {
    (hands[seat] as Card[]).push(deck.shift() as Card);
    seat = other(seat);
  }
  let turned: Card | null = null;
  let trumpSuit: Suit;
  if (config.trumps === 'rotate') {
    trumpSuit = SUITS[handNo % SUITS.length] as Suit;
  } else {
    turned = deck.shift() as Card;
    // An As or Tres turned for trumps may go back into the stock (option).
    for (let tries = 0; config.turnedBrisca === 'redeal' && cardPoints(turned, config) >= 10 && tries < 20; tries++) {
      deck.splice(rng.int(deck.length + 1), 0, turned);
      turned = deck.shift() as Card;
    }
    trumpSuit = suitOf(turned);
    deck.push(turned);
  }
  const state: BriscaState = {
    config,
    seed,
    handNo,
    dealer,
    trumpSuit,
    turned,
    hands,
    stock: deck,
    trick: [],
    leader: other(dealer),
    won: [[], []],
    tricksWon: [0, 0],
    known: [[], []],
    arrastre: false,
    matchWins,
    results,
    over: false,
  };
  return { state, event: { type: 'deal', handNo, dealer, trumpSuit, turned } };
}

function toMove(s: BriscaState): Seat | null {
  if (s.over) return null;
  return (s.leader + s.trick.length) % SEATS;
}

/** Under "arrastro", the cards the follower may play: the best trumps, or the best cards. */
export function arrastreChoices(hand: readonly Card[], trumpSuit: Suit, config: BriscaConfig): Card[] {
  const trumps = hand.filter((c) => suitOf(c) === trumpSuit);
  const pool = trumps.length > 0 ? trumps : [...hand];
  const top = Math.max(...pool.map((c) => strength(c, config)));
  return pool.filter((c) => strength(c, config) === top);
}

function legalActions(s: BriscaState, seat: Seat): BriscaAction[] {
  if (toMove(s) !== seat) return [];
  const hand = s.hands[seat] ?? [];
  const out: BriscaAction[] = [];
  const following = s.trick.length > 0;
  const forced = following && s.arrastre ? new Set(arrastreChoices(hand, s.trumpSuit, s.config)) : null;
  for (const card of hand) {
    if (forced && !forced.has(card)) continue;
    out.push({ type: 'play', card });
    if (!following && s.config.arrastre === 'on' && card === `A${s.trumpSuit}`) out.push({ type: 'play', card, call: true });
  }
  if (swapAllowed(s, seat, hand)) out.push({ type: 'swap' });
  return out;
}

/** True when `seat`, holding `hand`, may swap for the turned card now (on its turn). */
export function swapAllowed(s: { readonly turned: Card | null; readonly config: BriscaConfig; readonly tricksWon: readonly number[]; readonly over: boolean }, seat: Seat, hand: readonly Card[]): boolean {
  if (s.over || !s.turned) return false;
  const card = swapCardFor(s.turned, s.config);
  if (!card) return false;
  if (s.config.swapWhen === 'after-own-trick' && (s.tricksWon[seat] ?? 0) === 0) return false;
  return hand.includes(card);
}

function handOver(s: BriscaState): { state: BriscaState; events: BriscaEvent[] } {
  const config = s.config;
  const points = s.won.map((cards) => pointsOf(cards, config));
  const cards = s.won.map((c) => c.length);
  const [a = 0, b = 0] = points;
  let winner: Seat | null = a > b ? 0 : b > a ? 1 : null;
  if (winner === null && config.tie === 'most-cards') {
    const [ca = 0, cb = 0] = cards;
    winner = ca > cb ? 0 : cb > ca ? 1 : null;
  }
  const matchWins = [...s.matchWins];
  if (winner !== null) matchWins[winner] = (matchWins[winner] ?? 0) + (config.bigWin === 'double' && (points[winner] ?? 0) > 100 ? 2 : 1);
  const results = [...s.results, { points, cards, winner }];
  const events: BriscaEvent[] = [{ type: 'hand-end', points, winner, matchWins }];
  const target = Math.max(1, config.matchTo);
  const champion = matchWins.findIndex((w) => w >= target);
  if (champion >= 0 || target === 1 || results.length >= MAX_HANDS) {
    const matchWinner = champion >= 0 ? champion : null;
    events.push({ type: 'match-end', winner: matchWinner });
    return { state: { ...s, matchWins, results, over: true }, events };
  }
  const next = deal(config, s.seed, s.handNo + 1, other(s.dealer), matchWins, results);
  events.push(next.event);
  return { state: next.state, events };
}

function applyAction(s: BriscaState, action: BriscaAction): { state: BriscaState; events: BriscaEvent[] } {
  const seat = toMove(s);
  if (seat === null) throw new Error('The game is over');
  const legal = legalActions(s, seat);
  const key = actionText(action);
  if (!legal.some((a) => actionText(a) === key)) throw new Error(`${key} is not legal here`);

  if (action.type === 'swap') {
    const turned = s.turned as Card;
    const gave = swapCardFor(turned, s.config) as Card;
    const hands = s.hands.map((h, i) => (i === seat ? [...h.filter((c) => c !== gave), turned] : h));
    const stock = [...s.stock.slice(0, -1), gave];
    const known = s.known.map((k, i) => (i === seat ? [...k, turned] : k.filter((c) => c !== gave)));
    return { state: { ...s, hands, stock, turned: gave, known }, events: [{ type: 'swap', seat, gave, took: turned }] };
  }

  const card = action.card;
  const hands = s.hands.map((h, i) => (i === seat ? h.filter((c) => c !== card) : h));
  const known = s.known.map((k, i) => (i === seat ? k.filter((c) => c !== card) : k));
  const trick = [...s.trick, { seat, card }];
  const events: BriscaEvent[] = [{ type: 'play', seat, card, call: action.call === true }];
  const arrastre = s.trick.length === 0 ? action.call === true : s.arrastre;
  if (trick.length < SEATS) return { state: { ...s, hands, known, trick, arrastre }, events };

  // The trick is complete.
  const winner = trickWinner(trick, s.trumpSuit, s.config);
  const cards = trick.map((p) => p.card);
  const won = s.won.map((w, i) => (i === winner ? [...w, ...cards] : w));
  const tricksWon = s.tricksWon.map((n, i) => (i === winner ? n + 1 : n));
  events.push({ type: 'trick', winner, plays: trick, points: pointsOf(cards, s.config) });
  // Draw: the winner first, then the other. The turned card comes out last.
  const stock = [...s.stock];
  const drawn = hands.map((h) => [...h]);
  const knownAfter = known.map((k) => [...k]);
  let turned = s.turned;
  for (const drawer of [winner, other(winner)]) {
    const next = stock.shift();
    if (!next) break;
    (drawn[drawer] as Card[]).push(next);
    const isTurned = stock.length === 0 && turned !== null;
    if (isTurned) {
      (knownAfter[drawer] as Card[]).push(next);
      turned = null;
    }
    events.push({ type: 'draw', seat: drawer, card: next, turned: isTurned });
  }
  const after: BriscaState = { ...s, hands: drawn, known: knownAfter, stock, turned, trick: [], leader: winner, won, tricksWon, arrastre: false };
  if (drawn.every((h) => h.length === 0) && stock.length === 0) {
    const end = handOver(after);
    return { state: end.state, events: [...events, ...end.events] };
  }
  return { state: after, events };
}

// Codecs

export function actionText(a: BriscaAction): string {
  if (a.type === 'swap') return 'swap';
  return a.call ? `${a.card}!` : a.card;
}

function parseAction(text: string): BriscaAction {
  const t = text.trim();
  if (t === 'swap') return { type: 'swap' };
  const call = t.endsWith('!');
  const card = call ? t.slice(0, -1) : t;
  if (!isCard(card)) throw new Error(`"${text}" is not a Brisca card, such as Ao or 7e`);
  return call ? { type: 'play', card, call: true } : { type: 'play', card };
}

const CONFIG_KEYS = ['swap', 'swapWhen', 'tie', 'turnedBrisca', 'bigWin', 'matchTo', 'trumps', 'arrastre', 'secondBrisca'] as const;

function readConfig(json: Json): BriscaConfig {
  if (!isJsonObject(json)) return PUERTO_RICO;
  const pick = <K extends keyof BriscaConfig>(key: K, allowed: readonly BriscaConfig[K][]): BriscaConfig[K] => {
    const value = json[key] as BriscaConfig[K] | undefined;
    return value !== undefined && allowed.includes(value) ? value : PUERTO_RICO[key];
  };
  return {
    swap: pick('swap', ['seven-and-two', 'seven', 'none']),
    swapWhen: pick('swapWhen', ['any-turn', 'after-own-trick']),
    tie: pick('tie', ['draw', 'most-cards']),
    turnedBrisca: pick('turnedBrisca', ['stays', 'redeal']),
    bigWin: pick('bigWin', ['single', 'double']),
    matchTo: pick('matchTo', MATCH_LENGTHS),
    trumps: pick('trumps', ['turned', 'rotate']),
    arrastre: pick('arrastre', ['off', 'on']),
    secondBrisca: pick('secondBrisca', ['three', 'seven']),
    ...(typeof json.start === 'string' ? { start: json.start } : {}),
  };
}

function configJson(c: BriscaConfig): Json {
  const out: Record<string, Json> = {};
  for (const key of CONFIG_KEYS) out[key] = c[key];
  if (c.start) out.start = c.start;
  return out;
}

const cards = (json: Json, what: string): Card[] => {
  if (!Array.isArray(json) || !json.every((c) => typeof c === 'string' && isCard(c))) throw new Error(`Brisca: ${what} is damaged`);
  return json;
};

function stateFromJson(json: Json): BriscaState {
  if (!isJsonObject(json)) throw new Error('Not a Brisca position');
  const config = readConfig(json.config ?? null);
  const nums = (j: Json | undefined, what: string): number[] => {
    if (!Array.isArray(j) || !j.every((n) => typeof n === 'number')) throw new Error(`Brisca: ${what} is damaged`);
    return j;
  };
  const trick = Array.isArray(json.trick)
    ? json.trick.map((p) => {
        if (!isJsonObject(p) || typeof p.seat !== 'number' || typeof p.card !== 'string' || !isCard(p.card)) throw new Error('Brisca: the trick is damaged');
        return { seat: p.seat, card: p.card };
      })
    : [];
  const results = Array.isArray(json.results)
    ? json.results.map((r) => {
        if (!isJsonObject(r)) throw new Error('Brisca: a hand result is damaged');
        return { points: nums(r.points, 'a result'), cards: nums(r.cards, 'a result'), winner: typeof r.winner === 'number' ? r.winner : null };
      })
    : [];
  const hands = Array.isArray(json.hands) ? json.hands.map((h) => cards(h, 'a hand')) : [[], []];
  const won = Array.isArray(json.won) ? json.won.map((w) => cards(w, 'a pile')) : [[], []];
  const known = Array.isArray(json.known) ? json.known.map((k) => cards(k, 'a known card')) : [[], []];
  const stock = cards(json.stock ?? [], 'the stock');
  const turned = typeof json.turned === 'string' && isCard(json.turned) ? json.turned : null;
  const trumpSuit = typeof json.trumpSuit === 'string' && SUITS.includes(json.trumpSuit as Suit) ? (json.trumpSuit as Suit) : turned ? suitOf(turned) : 'o';
  const state: BriscaState = {
    config,
    seed: typeof json.seed === 'string' ? json.seed : 'lesson',
    handNo: typeof json.handNo === 'number' ? json.handNo : 0,
    dealer: json.dealer === 0 || json.dealer === 1 ? json.dealer : 1,
    trumpSuit,
    turned,
    hands,
    stock,
    trick,
    leader: json.leader === 1 ? 1 : 0,
    won,
    tricksWon: Array.isArray(json.tricksWon) ? nums(json.tricksWon, 'tricks won') : won.map((w) => Math.floor(w.length / SEATS)),
    known,
    arrastre: json.arrastre === true,
    matchWins: Array.isArray(json.matchWins) ? nums(json.matchWins, 'the match score') : [0, 0],
    results,
    over: json.over === true,
  };
  checkConservation(state);
  return state;
}

/** Every card is in exactly one place: a hand, the stock, the trick or a pile. */
export function checkConservation(s: BriscaState): void {
  const all = [...s.hands.flat(), ...s.stock, ...s.trick.map((p) => p.card), ...s.won.flat()];
  if (new Set(all).size !== all.length) throw new Error('Brisca: a card is in two places');
  if (all.length !== DECK.length) throw new Error(`Brisca: ${all.length} cards, not ${DECK.length}`);
  if (s.turned && s.stock[s.stock.length - 1] !== s.turned) throw new Error('Brisca: the turned card is not under the stock');
}

function stateToJson(s: BriscaState): Json {
  return {
    config: configJson(s.config),
    seed: s.seed,
    handNo: s.handNo,
    dealer: s.dealer,
    trumpSuit: s.trumpSuit,
    turned: s.turned,
    hands: s.hands.map((h) => [...h]),
    stock: [...s.stock],
    trick: s.trick.map((p) => ({ seat: p.seat, card: p.card })),
    leader: s.leader,
    won: s.won.map((w) => [...w]),
    tricksWon: [...s.tricksWon],
    known: s.known.map((k) => [...k]),
    arrastre: s.arrastre,
    matchWins: [...s.matchWins],
    results: s.results.map((r) => ({ points: [...r.points], cards: [...r.cards], winner: r.winner })),
    over: s.over,
  };
}

const stateCodec: Codec<BriscaState> = {
  toJSON: stateToJson,
  fromJSON: stateFromJson,
  toText: (s) => stableStringify(stateToJson(s)),
  fromText: (text) => stateFromJson(JSON.parse(text) as Json),
};

const actionCodec: Codec<BriscaAction> = {
  toJSON: (a) => actionText(a),
  fromJSON(json) {
    if (typeof json !== 'string') throw new Error('A Brisca action is stored as text, such as Ao or swap');
    return parseAction(json);
  },
  toText: actionText,
  fromText: (text) => parseAction(text),
};

const configCodec: JsonCodec<BriscaConfig> = { toJSON: configJson, fromJSON: readConfig };

function outcomeOf(s: BriscaState): Outcome | null {
  if (!s.over) return null;
  const single = Math.max(1, s.config.matchTo) === 1;
  const last = s.results[s.results.length - 1];
  const score = (seat: Seat) => (single ? (last?.points[seat] ?? 0) : (s.matchWins[seat] ?? 0));
  const winner = single ? (last?.winner ?? null) : s.matchWins.findIndex((w) => w >= Math.max(1, s.config.matchTo));
  if (winner === null || winner < 0) {
    return { reason: 'brisca-tie', results: [0, 1].map((seat) => ({ seat, place: 1, score: score(seat) })) };
  }
  return {
    reason: single ? 'brisca-points' : 'brisca-match',
    results: [
      { seat: winner, place: 1, score: score(winner) },
      { seat: other(winner), place: 2, score: score(other(winner)) },
    ],
  };
}

export function viewOf(s: BriscaState, seat: Seat): BriscaView {
  return {
    seat,
    config: s.config,
    handNo: s.handNo,
    dealer: s.dealer,
    trumpSuit: s.trumpSuit,
    turned: s.turned,
    hand: [...(s.hands[seat] ?? [])],
    handCounts: s.hands.map((h) => h.length),
    stockCount: s.stock.length,
    trick: s.trick,
    leader: s.leader,
    won: s.won,
    tricksWon: s.tricksWon,
    known: s.known,
    arrastre: s.arrastre,
    matchWins: s.matchWins,
    results: s.results,
    over: s.over,
  };
}

/** The cards a seat cannot see: everything not in its hand, played, turned or known to be held. */
export function unseenCards(v: BriscaView): Card[] {
  const seen = new Set<Card>([...v.hand, ...v.trick.map((p) => p.card), ...v.won.flat(), ...v.known.flat()]);
  if (v.turned) seen.add(v.turned);
  return DECK.filter((c) => !seen.has(c));
}

/** A full state consistent with a view: the unseen cards dealt at random to the other hand and the stock. */
export function sampleState(v: BriscaView, rng: Rng): BriscaState {
  const unseen = rng.shuffle(unseenCards(v));
  const hands: Card[][] = [[], []];
  hands[v.seat] = [...v.hand];
  const them = other(v.seat);
  const theirKnown = (v.known[them] ?? []).filter((c) => !v.hand.includes(c));
  hands[them] = [...theirKnown, ...unseen.splice(0, (v.handCounts[them] ?? 0) - theirKnown.length)];
  const stock = [...unseen.splice(0, v.stockCount - (v.turned ? 1 : 0)), ...(v.turned ? [v.turned] : [])];
  return {
    config: v.config,
    seed: `sample/${rng.int(1_000_000_000)}`,
    handNo: v.handNo,
    dealer: v.dealer,
    trumpSuit: v.trumpSuit,
    turned: v.turned,
    hands,
    stock,
    trick: v.trick,
    leader: v.leader,
    won: v.won,
    tricksWon: v.tricksWon,
    known: v.known,
    arrastre: v.arrastre,
    matchWins: v.matchWins,
    results: v.results,
    over: v.over,
  };
}

export const brisca: GameDef<BriscaState, BriscaAction, BriscaConfig, BriscaView, BriscaEvent & GameEvent> = {
  id: 'brisca',
  rulesVersion: 1,
  defaultConfig: PUERTO_RICO,
  setup(config, rng) {
    const seed = `brisca/${rng.int(2_147_483_647)}/${rng.int(2_147_483_647)}`;
    if (config.start) {
      // Play on from a position: the same cards where they lay, the rules of this game.
      const from = stateFromJson(JSON.parse(config.start) as Json);
      return { ...from, config, seed };
    }
    return deal(config, seed, 0, 1, [0, 0], []).state;
  },
  seats: () => [0, 1],
  turn: toMove,
  legal: legalActions,
  apply: applyAction,
  outcome: outcomeOf,
  view: viewOf,
  sample: (view, _seat, rng) => sampleState(view, rng),
  codec: { state: stateCodec, action: actionCodec, config: configCodec },
};

/** Which preset a config is, if any. */
export function presetOf(config: BriscaConfig): string | null {
  const key = stableStringify(configJson(config));
  return Object.entries(PRESETS).find(([, c]) => stableStringify(configJson(c)) === key)?.[0] ?? null;
}

/**
 * A position for lessons and problems, from a short description; seat 0 is the student. Cards not
 * named go face down into the stock (when no stock is given) or, for endgames with a given stock,
 * into the two piles in turn, so every position holds all forty cards.
 */
export function position(p: {
  trump: Card | Suit;
  me: readonly Card[];
  them: readonly Card[];
  stock?: readonly Card[];
  wonMe?: readonly Card[];
  wonThem?: readonly Card[];
  trick?: readonly PlayedCard[];
  leader?: Seat;
  config?: Partial<BriscaConfig>;
}): string {
  const turned = p.trump.length === 2 ? (p.trump as Card) : null;
  const named = new Set<Card>([...p.me, ...p.them, ...(p.stock ?? []), ...(p.wonMe ?? []), ...(p.wonThem ?? []), ...(p.trick ?? []).map((t) => t.card), ...(turned ? [turned] : [])]);
  const rest = DECK.filter((c) => !named.has(c));
  const wonMe = [...(p.wonMe ?? [])];
  const wonThem = [...(p.wonThem ?? [])];
  let stock: Card[];
  if (p.stock === undefined) {
    stock = [...rest, ...(turned ? [turned] : [])];
  } else {
    stock = [...p.stock];
    if (turned && stock.length > 0 && stock[stock.length - 1] !== turned) stock.push(turned);
    if (turned && stock.length === 0) rest.push(turned);
    rest.forEach((c, i) => (i % 2 === 0 ? wonMe : wonThem).push(c));
  }
  p = { ...p, wonMe, wonThem };
  const state: BriscaState = {
    config: { ...PUERTO_RICO, ...p.config },
    seed: 'lesson',
    handNo: 0,
    dealer: 1,
    trumpSuit: turned ? suitOf(turned) : (p.trump as Suit),
    turned: turned && stock.length > 0 && stock[stock.length - 1] === turned ? turned : null,
    hands: [[...p.me], [...p.them]],
    stock,
    trick: [...(p.trick ?? [])],
    leader: p.leader ?? 0,
    won: [[...(p.wonMe ?? [])], [...(p.wonThem ?? [])]],
    tricksWon: [Math.floor((p.wonMe ?? []).length / 2), Math.floor((p.wonThem ?? []).length / 2)],
    known: [[], []],
    arrastre: false,
    matchWins: [0, 0],
    results: [],
    over: false,
  };
  return stateCodec.toText(state);
}
