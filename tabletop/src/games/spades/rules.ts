/**
 * Spades for four (docs/rules/spades.md), behind the game contract, on the shared trick module:
 * partnerships (seats 0 and 2 against 1 and 3) or cutthroat, nil and blind nil, bags. Every
 * disputed rule is an option; presets are named configs.
 *
 * Hidden information: a seat's view holds its own hand (not even that while it may still bid blind
 * nil and has not looked), the bids, every trick and the scores; never another hand or the seed.
 */
import type { Codec, GameDef, GameEvent, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject, stableStringify } from '../../core/json';
import type { Rng } from '../../core/rng';
import { createRng } from '../../core/rng';
import type { Card } from '../classic/cards';
import { checkWholePack, DECK, dealHands, isCard, readCards, sortHand, suitOf } from '../classic/cards';
import type { Play } from '../classic/tricks';
import { dealConsistent, following, trickWinner, voidsOf } from '../classic/tricks';

export const SEATS = 4;
export const HAND_SIZE = 13;
export const TRUMP = 's' as const;
export const MAX_HANDS = 60;
export const BAG_LIMIT = 10;
export const BAG_PENALTY = 100;
export const TRICK_VALUE = 10;
export const BLIND_BEHIND = 100;

export interface SpadesConfig {
  readonly partners: 'pairs' | 'solo';
  /** What a nil is worth (made or lost); 0 means nil is not allowed. */
  readonly nil: number;
  readonly blindNil: 'off' | 'behind-100' | 'always';
  readonly nilTricks: 'bags' | 'count';
  readonly bags: 'penalty' | 'none' | 'minus';
  readonly breakSpades: 'on' | 'off';
  readonly firstLead: 'left' | 'two-clubs';
  /** The least a partnership may bid between them (0 for no minimum). */
  readonly minBid: number;
  readonly target: number;
  /** A side at this score or below loses at once; 0 for no losing score. */
  readonly loseAt: number;
  readonly start?: string;
}

export const STANDARD: SpadesConfig = {
  partners: 'pairs',
  nil: 100,
  blindNil: 'off',
  nilTricks: 'bags',
  bags: 'penalty',
  breakSpades: 'on',
  firstLead: 'left',
  minBid: 0,
  target: 500,
  loseAt: 0,
};

export const PRESETS: Readonly<Record<string, SpadesConfig>> = {
  standard: STANDARD,
  'blind-nil': { ...STANDARD, blindNil: 'behind-100' },
  casual: { ...STANDARD, nil: 0, bags: 'none', target: 300 },
  club: { ...STANDARD, minBid: 4, firstLead: 'two-clubs', loseAt: -200 },
  cutthroat: { ...STANDARD, partners: 'solo', target: 300 },
};

export const TARGETS: readonly number[] = [500, 300, 1000, 0];
export const NIL_VALUES: readonly number[] = [100, 50, 0];
export const LOSE_AT: readonly number[] = [0, -200, -500];
export const MIN_BIDS: readonly number[] = [0, 4];

export interface HandResult {
  /** Points each side scored this hand. */
  readonly deltas: readonly number[];
  /** Tricks each seat won. */
  readonly tricks: readonly number[];
  readonly bids: readonly number[];
  readonly blind: readonly boolean[];
  /** Bags each side took this hand, and the ten-bag penalties paid. */
  readonly bags: readonly number[];
  readonly penalties: readonly number[];
}

export interface SpadesState {
  readonly config: SpadesConfig;
  readonly seed: string;
  readonly handNo: number;
  readonly dealer: Seat;
  readonly phase: 'bid' | 'play';
  readonly hands: readonly (readonly Card[])[];
  /** Each seat's bid (0 is nil), null until made. */
  readonly bids: readonly (number | null)[];
  readonly blind: readonly boolean[];
  /** Has looked at its cards (only matters while it may still bid blind nil). */
  readonly looked: readonly boolean[];
  readonly trick: readonly Play[];
  readonly leader: Seat;
  readonly tricks: readonly (readonly Play[])[];
  readonly winners: readonly Seat[];
  readonly broken: boolean;
  /** Totals by side (two partnerships, or four players), before this hand. */
  readonly scores: readonly number[];
  /** Bags carried by each side towards the next penalty. */
  readonly bagCount: readonly number[];
  readonly results: readonly HandResult[];
  readonly over: boolean;
}

export type SpadesAction =
  | { readonly type: 'bid'; readonly n: number }
  | { readonly type: 'blind' }
  | { readonly type: 'look' }
  | { readonly type: 'play'; readonly card: Card };

export type SpadesEvent =
  | { readonly type: 'deal'; readonly handNo: number; readonly dealer: Seat }
  | { readonly type: 'look'; readonly seat: Seat }
  | { readonly type: 'bid'; readonly seat: Seat; readonly n: number; readonly blind: boolean }
  | { readonly type: 'play'; readonly seat: Seat; readonly card: Card; readonly breaks: boolean }
  | { readonly type: 'trick'; readonly winner: Seat; readonly plays: readonly Play[] }
  | { readonly type: 'hand-end'; readonly result: HandResult; readonly scores: readonly number[]; readonly bagCount: readonly number[] }
  | { readonly type: 'game-end'; readonly scores: readonly number[] };

export interface SpadesView {
  readonly seat: Seat;
  readonly config: SpadesConfig;
  readonly handNo: number;
  readonly dealer: Seat;
  readonly phase: 'bid' | 'play';
  /** Empty while the seat may still bid blind nil and has not looked. */
  readonly hand: readonly Card[];
  readonly hidden: boolean;
  readonly handCounts: readonly number[];
  readonly bids: readonly (number | null)[];
  readonly blind: readonly boolean[];
  readonly looked: readonly boolean[];
  readonly trick: readonly Play[];
  readonly leader: Seat;
  readonly tricks: readonly (readonly Play[])[];
  readonly winners: readonly Seat[];
  readonly broken: boolean;
  readonly scores: readonly number[];
  readonly bagCount: readonly number[];
  readonly results: readonly HandResult[];
  readonly over: boolean;
}

// Sides

export const sideCount = (config: Pick<SpadesConfig, 'partners'>): number => (config.partners === 'pairs' ? 2 : 4);
export const sideOf = (config: Pick<SpadesConfig, 'partners'>, seat: Seat): number => (config.partners === 'pairs' ? seat % 2 : seat);
export const membersOf = (config: Pick<SpadesConfig, 'partners'>, side: number): Seat[] => (config.partners === 'pairs' ? [side, side + 2] : [side]);
export const partnerOf = (seat: Seat): Seat => (seat + 2) % SEATS;

/** Tricks each seat has won this hand. */
export function tricksWon(s: Pick<SpadesState, 'winners'>): number[] {
  const out = [0, 0, 0, 0];
  for (const w of s.winners) out[w] = (out[w] ?? 0) + 1;
  return out;
}

// Dealing and turns

function dealHand(config: SpadesConfig, seed: string, handNo: number, dealer: Seat, scores: readonly number[], bagCount: readonly number[], results: readonly HandResult[]): { state: SpadesState; event: SpadesEvent } {
  const rng = createRng(`${seed}/hand/${handNo}`);
  const { hands } = dealHands(rng, SEATS, HAND_SIZE, (dealer + 1) % SEATS);
  const state: SpadesState = {
    config,
    seed,
    handNo,
    dealer,
    phase: 'bid',
    hands,
    bids: [null, null, null, null],
    blind: [false, false, false, false],
    looked: [false, false, false, false],
    trick: [],
    leader: (dealer + 1) % SEATS,
    tricks: [],
    winners: [],
    broken: false,
    scores,
    bagCount,
    results,
    over: false,
  };
  return { state, event: { type: 'deal', handNo, dealer } };
}

function toMove(s: SpadesState): Seat | null {
  if (s.over) return null;
  if (s.phase === 'bid') return (s.dealer + 1 + s.bids.filter((b) => b !== null).length) % SEATS;
  return (s.leader + s.trick.length) % SEATS;
}

/** True when a seat may still bid blind nil (it has not looked, and the rules and the score allow it). */
export function mayBlind(s: Pick<SpadesState, 'config' | 'looked' | 'bids' | 'scores' | 'phase'>, seat: Seat): boolean {
  const c = s.config;
  if (c.blindNil === 'off' || c.nil <= 0 || s.phase !== 'bid' || s.looked[seat] || s.bids[seat] !== null) return false;
  if (c.blindNil === 'always') return true;
  const mine = s.scores[sideOf(c, seat)] ?? 0;
  const best = Math.max(...s.scores.filter((_, side) => side !== sideOf(c, seat)));
  return best - mine >= BLIND_BEHIND;
}

/** The bids a seat may make (0 is nil). */
export function legalBids(s: Pick<SpadesState, 'config' | 'bids'>, seat: Seat): number[] {
  const c = s.config;
  let lo = c.nil > 0 ? 0 : 1;
  const out: number[] = [];
  const partnerBid = c.partners === 'pairs' ? s.bids[partnerOf(seat)] : null;
  let nilOk = c.nil > 0;
  if (c.partners === 'pairs' && c.minBid > 0 && partnerBid !== null && partnerBid !== undefined) {
    if (partnerBid === 0) {
      lo = c.minBid;
      nilOk = false;
    } else {
      lo = Math.max(1, c.minBid - partnerBid);
      nilOk = nilOk && partnerBid >= c.minBid;
    }
  }
  if (nilOk) out.push(0);
  for (let n = Math.max(1, lo); n <= HAND_SIZE; n++) out.push(n);
  return out;
}

/** The cards a seat may play now. */
export function playableCards(s: Pick<SpadesState, 'config' | 'trick' | 'tricks' | 'broken'>, hand: readonly Card[]): Card[] {
  if (s.trick.length > 0) return following(hand, s.trick);
  const first = s.tricks.length === 0;
  if (first && s.config.firstLead === 'two-clubs' && hand.includes('2c')) return ['2c'];
  const noSpadeLead = (s.config.breakSpades === 'on' && !s.broken) || (first && s.config.firstLead === 'left');
  if (noSpadeLead) {
    const others = hand.filter((c) => suitOf(c) !== TRUMP);
    if (others.length > 0) return others;
  }
  return [...hand];
}

function legalActions(s: SpadesState, seat: Seat): SpadesAction[] {
  if (toMove(s) !== seat) return [];
  if (s.phase === 'bid') {
    if (mayBlind(s, seat)) return [{ type: 'blind' }, { type: 'look' }];
    return legalBids(s, seat).map((n) => ({ type: 'bid', n }));
  }
  return playableCards(s, s.hands[seat] ?? []).map((card) => ({ type: 'play', card }));
}

// Scoring

/** The points each side scores for a finished hand, and the bags carried on. */
export function scoreHand(config: SpadesConfig, bids: readonly number[], blind: readonly boolean[], tricks: readonly number[], bagCount: readonly number[]): HandResult & { readonly bagCount: readonly number[] } {
  const sides = sideCount(config);
  const deltas: number[] = [];
  const bags: number[] = [];
  const penalties: number[] = [];
  const carried: number[] = [];
  for (let side = 0; side < sides; side++) {
    const members = membersOf(config, side);
    let points = 0;
    let handBags = 0;
    const contract = members.reduce((a, m) => a + ((bids[m] ?? 0) > 0 ? (bids[m] as number) : 0), 0);
    let counted = 0;
    for (const m of members) {
      const won = tricks[m] ?? 0;
      if ((bids[m] ?? 0) > 0 || config.nilTricks === 'count') counted += won;
      if (bids[m] === 0) {
        const value = config.nil * (blind[m] ? 2 : 1);
        points += won === 0 ? value : -value;
        if (config.nilTricks === 'bags') handBags += won;
      }
    }
    if (counted >= contract) {
      points += TRICK_VALUE * contract;
      handBags += counted - contract;
    } else {
      points -= TRICK_VALUE * contract;
    }
    points += config.bags === 'minus' ? -handBags : handBags;
    let count = (bagCount[side] ?? 0) + (config.bags === 'penalty' ? handBags : 0);
    let paid = 0;
    while (config.bags === 'penalty' && count >= BAG_LIMIT) {
      count -= BAG_LIMIT;
      points -= BAG_PENALTY;
      paid++;
    }
    deltas.push(points);
    bags.push(handBags);
    penalties.push(paid);
    carried.push(count);
  }
  return { deltas, tricks: [...tricks], bids: [...bids], blind: [...blind], bags, penalties, bagCount: carried };
}

function endOfHand(s: SpadesState): { state: SpadesState; events: SpadesEvent[] } {
  const scored = scoreHand(s.config, s.bids.map((b) => b ?? 0), s.blind, tricksWon(s), s.bagCount);
  const { bagCount, ...result } = scored;
  const scores = s.scores.map((x, side) => x + (result.deltas[side] ?? 0));
  const results = [...s.results, result];
  const events: SpadesEvent[] = [{ type: 'hand-end', result, scores, bagCount }];
  if (gameOver(s.config, scores) || results.length >= MAX_HANDS) {
    events.push({ type: 'game-end', scores });
    return { state: { ...s, scores, bagCount, results, over: true }, events };
  }
  const next = dealHand(s.config, s.seed, s.handNo + 1, (s.dealer + 1) % SEATS, scores, bagCount, results);
  events.push(next.event);
  return { state: next.state, events };
}

/** True when these totals end the game. */
export function gameOver(config: SpadesConfig, scores: readonly number[]): boolean {
  if (config.target <= 0) return true;
  if (config.loseAt < 0 && scores.some((x) => x <= config.loseAt)) return true;
  const top = Math.max(...scores);
  if (top < config.target) return false;
  return scores.filter((x) => x === top).length === 1;
}

function applyAction(s: SpadesState, action: SpadesAction): { state: SpadesState; events: SpadesEvent[] } {
  const seat = toMove(s);
  if (seat === null) throw new Error('The game is over');
  const key = actionText(action);
  if (!legalActions(s, seat).some((a) => actionText(a) === key)) throw new Error(`${key} is not legal here`);
  if (action.type === 'look') {
    return { state: { ...s, looked: s.looked.map((x, i) => (i === seat ? true : x)) }, events: [{ type: 'look', seat }] };
  }
  if (action.type === 'bid' || action.type === 'blind') {
    const n = action.type === 'blind' ? 0 : action.n;
    const bids = s.bids.map((b, i) => (i === seat ? n : b));
    const blind = s.blind.map((b, i) => (i === seat ? action.type === 'blind' : b));
    const looked = s.looked.map((x, i) => (i === seat ? true : x));
    const after: SpadesState = { ...s, bids, blind, looked };
    const events: SpadesEvent[] = [{ type: 'bid', seat, n, blind: action.type === 'blind' }];
    if (bids.some((b) => b === null)) return { state: after, events };
    const leader = s.config.firstLead === 'two-clubs' ? Math.max(0, s.hands.findIndex((h) => h.includes('2c'))) : (s.dealer + 1) % SEATS;
    return { state: { ...after, phase: 'play', leader }, events };
  }
  const card = action.card;
  const breaks = !s.broken && suitOf(card) === TRUMP;
  const hands = s.hands.map((h, i) => (i === seat ? h.filter((c) => c !== card) : h));
  const trick = [...s.trick, { seat, card }];
  const events: SpadesEvent[] = [{ type: 'play', seat, card, breaks }];
  const broken = s.broken || breaks;
  if (trick.length < SEATS) return { state: { ...s, hands, trick, broken }, events };
  const winner = trickWinner(trick, TRUMP);
  events.push({ type: 'trick', winner, plays: trick });
  const after: SpadesState = { ...s, hands, trick: [], broken, leader: winner, tricks: [...s.tricks, trick], winners: [...s.winners, winner] };
  if (after.tricks.length < HAND_SIZE) return { state: after, events };
  const end = endOfHand(after);
  return { state: end.state, events: [...events, ...end.events] };
}

// Codecs

export function actionText(a: SpadesAction): string {
  switch (a.type) {
    case 'bid':
      return `bid:${a.n}`;
    case 'blind':
      return 'blind';
    case 'look':
      return 'look';
    default:
      return a.card;
  }
}

function parseAction(text: string): SpadesAction {
  const t = text.trim();
  if (t === 'blind') return { type: 'blind' };
  if (t === 'look') return { type: 'look' };
  const bid = /^bid:(\d{1,2})$/.exec(t);
  if (bid) return { type: 'bid', n: Number(bid[1]) };
  if (!isCard(t)) throw new Error(`"${text}" is not a Spades move, such as bid:4 or Qs`);
  return { type: 'play', card: t };
}

const CONFIG_KEYS = ['partners', 'nil', 'blindNil', 'nilTricks', 'bags', 'breakSpades', 'firstLead', 'minBid', 'target', 'loseAt'] as const;

function readConfig(json: Json): SpadesConfig {
  if (!isJsonObject(json)) return STANDARD;
  const pick = <K extends keyof SpadesConfig>(key: K, allowed: readonly SpadesConfig[K][]): SpadesConfig[K] => {
    const value = json[key] as SpadesConfig[K] | undefined;
    return value !== undefined && allowed.includes(value) ? value : STANDARD[key];
  };
  return {
    partners: pick('partners', ['pairs', 'solo']),
    nil: pick('nil', NIL_VALUES),
    blindNil: pick('blindNil', ['off', 'behind-100', 'always']),
    nilTricks: pick('nilTricks', ['bags', 'count']),
    bags: pick('bags', ['penalty', 'none', 'minus']),
    breakSpades: pick('breakSpades', ['on', 'off']),
    firstLead: pick('firstLead', ['left', 'two-clubs']),
    minBid: pick('minBid', MIN_BIDS),
    target: pick('target', TARGETS),
    loseAt: pick('loseAt', LOSE_AT),
    ...(typeof json.start === 'string' ? { start: json.start } : {}),
  };
}

function configJson(c: SpadesConfig): Json {
  const out: Record<string, Json> = {};
  for (const key of CONFIG_KEYS) out[key] = c[key];
  if (c.start) out.start = c.start;
  return out;
}

const plays = (json: Json | undefined, what: string): Play[] => {
  if (json === undefined) return [];
  if (!Array.isArray(json)) throw new Error(`Spades: ${what} is damaged`);
  return json.map((p) => {
    if (!isJsonObject(p) || typeof p.seat !== 'number' || typeof p.card !== 'string' || !isCard(p.card)) throw new Error(`Spades: ${what} is damaged`);
    return { seat: p.seat, card: p.card };
  });
};

const nums = (json: Json | undefined, what: string, fallback: number[]): number[] => {
  if (json === undefined) return fallback;
  if (!Array.isArray(json) || !json.every((n) => typeof n === 'number')) throw new Error(`Spades: ${what} is damaged`);
  return json;
};

const bools = (json: Json | undefined, fallback: boolean[]): boolean[] => (Array.isArray(json) ? json.map((x) => x === true) : fallback);

function stateFromJson(json: Json): SpadesState {
  if (!isJsonObject(json)) throw new Error('Not a Spades position');
  const config = readConfig(json.config ?? null);
  const sides = sideCount(config);
  const tricks = Array.isArray(json.tricks) ? json.tricks.map((t) => plays(t, 'a trick')) : [];
  const results = Array.isArray(json.results)
    ? json.results.map((r) => {
        if (!isJsonObject(r)) throw new Error('Spades: a hand result is damaged');
        return {
          deltas: nums(r.deltas, 'a result', []),
          tricks: nums(r.tricks, 'a result', []),
          bids: nums(r.bids, 'a result', []),
          blind: bools(r.blind, [false, false, false, false]),
          bags: nums(r.bags, 'a result', []),
          penalties: nums(r.penalties, 'a result', []),
        };
      })
    : [];
  const state: SpadesState = {
    config,
    seed: typeof json.seed === 'string' ? json.seed : 'lesson',
    handNo: typeof json.handNo === 'number' ? json.handNo : 0,
    dealer: typeof json.dealer === 'number' ? json.dealer % SEATS : 3,
    phase: json.phase === 'bid' ? 'bid' : 'play',
    hands: Array.isArray(json.hands) ? json.hands.map((h) => readCards(h, 'Spades: a hand')) : [[], [], [], []],
    bids: Array.isArray(json.bids) ? json.bids.map((b) => (typeof b === 'number' ? b : null)) : [null, null, null, null],
    blind: bools(json.blind, [false, false, false, false]),
    looked: bools(json.looked, [true, true, true, true]),
    trick: plays(json.trick, 'the trick'),
    leader: typeof json.leader === 'number' ? json.leader % SEATS : 0,
    tricks,
    winners: nums(json.winners, 'the winners', tricks.map((t) => trickWinner(t, TRUMP))),
    broken: json.broken === true,
    scores: nums(json.scores, 'the scores', new Array<number>(sides).fill(0)),
    bagCount: nums(json.bagCount, 'the bags', new Array<number>(sides).fill(0)),
    results,
    over: json.over === true,
  };
  checkConservation(state);
  return state;
}

export function checkConservation(s: Pick<SpadesState, 'hands' | 'trick' | 'tricks'>): void {
  checkWholePack([...s.hands.flat(), ...s.trick.map((p) => p.card), ...s.tricks.flat().map((p) => p.card)], 'Spades');
}

function stateToJson(s: SpadesState): Json {
  const playsJson = (t: readonly Play[]): Json => t.map((p) => ({ seat: p.seat, card: p.card }));
  return {
    config: configJson(s.config),
    seed: s.seed,
    handNo: s.handNo,
    dealer: s.dealer,
    phase: s.phase,
    hands: s.hands.map((h) => [...h]),
    bids: [...s.bids],
    blind: [...s.blind],
    looked: [...s.looked],
    trick: playsJson(s.trick),
    leader: s.leader,
    tricks: s.tricks.map(playsJson),
    winners: [...s.winners],
    broken: s.broken,
    scores: [...s.scores],
    bagCount: [...s.bagCount],
    results: s.results.map((r) => ({ deltas: [...r.deltas], tricks: [...r.tricks], bids: [...r.bids], blind: [...r.blind], bags: [...r.bags], penalties: [...r.penalties] })),
    over: s.over,
  };
}

const stateCodec: Codec<SpadesState> = {
  toJSON: stateToJson,
  fromJSON: stateFromJson,
  toText: (s) => stableStringify(stateToJson(s)),
  fromText: (text) => stateFromJson(JSON.parse(text) as Json),
};

const actionCodec: Codec<SpadesAction> = {
  toJSON: (a) => actionText(a),
  fromJSON(json) {
    if (typeof json !== 'string') throw new Error('A Spades move is stored as text, such as bid:4 or Qs');
    return parseAction(json);
  },
  toText: actionText,
  fromText: (text) => parseAction(text),
};

const configCodec: JsonCodec<SpadesConfig> = { toJSON: configJson, fromJSON: readConfig };

/** Places of the sides: a side at the losing score is last; otherwise high scores first, equal scores share. */
export function sidePlaces(config: SpadesConfig, scores: readonly number[]): number[] {
  const bust = (x: number) => config.loseAt < 0 && x <= config.loseAt;
  const key = (x: number) => (bust(x) ? -1e9 + x : x);
  return scores.map((x) => 1 + scores.filter((y) => key(y) > key(x)).length);
}

function outcomeOf(s: SpadesState): Outcome | null {
  if (!s.over) return null;
  const places = sidePlaces(s.config, s.scores);
  const results = [0, 1, 2, 3].map((seat) => {
    const side = sideOf(s.config, seat);
    return { seat, place: places[side] ?? 4, score: s.scores[side] ?? 0 };
  });
  return s.config.partners === 'pairs' ? { reason: 'spades-score', results, teams: [[0, 2], [1, 3]] } : { reason: 'spades-score', results };
}

export function viewOf(s: SpadesState, seat: Seat): SpadesView {
  const hidden = mayBlind(s, seat);
  return {
    seat,
    config: s.config,
    handNo: s.handNo,
    dealer: s.dealer,
    phase: s.phase,
    hand: hidden ? [] : [...(s.hands[seat] ?? [])],
    hidden,
    handCounts: s.hands.map((h) => h.length),
    bids: s.bids,
    blind: s.blind,
    looked: s.looked,
    trick: s.trick,
    leader: s.leader,
    tricks: s.tricks,
    winners: s.winners,
    broken: s.broken,
    scores: s.scores,
    bagCount: s.bagCount,
    results: s.results,
    over: s.over,
  };
}

export function unseenCards(v: SpadesView): Card[] {
  const seen = new Set<Card>([...v.hand, ...v.tricks.flat().map((p) => p.card), ...v.trick.map((p) => p.card)]);
  return DECK.filter((c) => !seen.has(c));
}

/** A full state consistent with a view: unseen cards dealt to the others (and to this seat if it has not looked), respecting voids. */
export function sampleState(v: SpadesView, rng: Rng): SpadesState {
  const need = v.handCounts.map((n, seat) => (seat === v.seat && !v.hidden ? 0 : n));
  const voids = voidsOf(SEATS, [...v.tricks, v.trick]);
  voids[v.seat] = new Set();
  const unseen = unseenCards(v);
  const dealt = dealConsistent(unseen, need, voids, rng) ?? dealConsistent(unseen, need, [new Set(), new Set(), new Set(), new Set()], rng);
  if (!dealt) throw new Error('Spades: no deal agrees with this view');
  const hands = v.handCounts.map((_, seat) => (seat === v.seat && !v.hidden ? [...v.hand] : sortHand(dealt[seat] ?? [])));
  return {
    config: v.config,
    seed: `sample/${rng.int(1_000_000_000)}`,
    handNo: v.handNo,
    dealer: v.dealer,
    phase: v.phase,
    hands,
    bids: v.bids,
    blind: v.blind,
    looked: v.looked,
    trick: v.trick,
    leader: v.leader,
    tricks: v.tricks,
    winners: v.winners,
    broken: v.broken,
    scores: v.scores,
    bagCount: v.bagCount,
    results: v.results,
    over: v.over,
  };
}

export const spades: GameDef<SpadesState, SpadesAction, SpadesConfig, SpadesView, SpadesEvent & GameEvent> = {
  id: 'spades',
  rulesVersion: 1,
  defaultConfig: STANDARD,
  setup(config, rng) {
    const seed = `spades/${rng.int(2_147_483_647)}/${rng.int(2_147_483_647)}`;
    if (config.start) {
      const from = stateFromJson(JSON.parse(config.start) as Json);
      return { ...from, config: { ...config, start: undefined }, seed };
    }
    const sides = sideCount(config);
    return dealHand(config, seed, 0, 3, new Array<number>(sides).fill(0), new Array<number>(sides).fill(0), []).state;
  },
  seats: () => [0, 1, 2, 3],
  turn: toMove,
  legal: legalActions,
  apply: applyAction,
  outcome: outcomeOf,
  view: viewOf,
  sample: (view, _seat, rng) => sampleState(view, rng),
  teams: (s) => (s.config.partners === 'pairs' ? [[0, 2], [1, 3]] : [[0], [1], [2], [3]]),
  codec: { state: stateCodec, action: actionCodec, config: configCodec },
};

export function presetOf(config: SpadesConfig): string | null {
  const key = stableStringify(configJson({ ...config, start: undefined }));
  return Object.entries(PRESETS).find(([, c]) => stableStringify(configJson(c)) === key)?.[0] ?? null;
}

/**
 * A position for lessons and problems; seat 0 is the student. Hands are given for every seat;
 * unnamed cards fill earlier tricks, a suit at a time.
 */
export function position(p: {
  hands: readonly (readonly Card[])[];
  bids?: readonly (number | null)[];
  trick?: readonly Play[];
  leader?: Seat;
  broken?: boolean;
  scores?: readonly number[];
  bagCount?: readonly number[];
  config?: Partial<SpadesConfig>;
  phase?: 'bid' | 'play';
  dealer?: Seat;
  /** Tricks already won by each seat (filled from the unnamed cards). */
  won?: readonly number[];
}): string {
  const config = { ...STANDARD, target: 0, ...p.config };
  const named = new Set<Card>([...p.hands.flat(), ...(p.trick ?? []).map((x) => x.card)]);
  const rest = sortHand(DECK.filter((c) => !named.has(c)), ['c', 'd', 'h', 's']);
  const tricks: Play[][] = [];
  const winners: Seat[] = [];
  const want = [...(p.won ?? [])];
  while (rest.length >= 4) {
    const cards = rest.splice(0, 4);
    // Give the trick to a seat that still has tricks to win, leading with the highest card.
    const w = want.findIndex((n) => (n ?? 0) > 0);
    const winner = w >= 0 ? w : tricks.length % SEATS;
    if (w >= 0) want[w] = (want[w] ?? 0) - 1;
    const order = [...cards].sort((a, b) => DECK.indexOf(b) - DECK.indexOf(a));
    tricks.push(order.map((card, i) => ({ seat: (winner + i) % SEATS, card })));
    winners.push(winner);
  }
  if (rest.length > 0) throw new Error(`Spades position: ${rest.length} cards left over`);
  const sides = sideCount(config);
  const state: SpadesState = {
    config,
    seed: 'lesson',
    handNo: 0,
    dealer: p.dealer ?? 3,
    phase: p.phase ?? 'play',
    hands: p.hands.map((h) => [...h]),
    bids: p.bids ?? [3, 3, 3, 3],
    blind: [false, false, false, false],
    looked: [true, true, true, true],
    trick: [...(p.trick ?? [])],
    leader: p.leader ?? 0,
    tricks,
    winners,
    broken: p.broken ?? true,
    scores: p.scores ?? new Array<number>(sides).fill(0),
    bagCount: p.bagCount ?? new Array<number>(sides).fill(0),
    results: [],
    over: false,
  };
  checkConservation(state);
  return stateCodec.toText(state);
}
