/**
 * Gin Rummy for two (docs/rules/gin-rummy.md), behind the game contract, with the melds and
 * deadwood of the shared module. Every disputed rule is an option; presets are named configs.
 *
 * Hidden information: a seat's view holds its own hand, the discard pile, the cards the other
 * player is known to hold (taken from the pile and not thrown back) and the scores; never the
 * other hand, the stock or the seed. At the end of a hand both hands are shown in the result.
 */
import type { Codec, GameDef, GameEvent, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject, stableStringify } from '../../core/json';
import type { Rng } from '../../core/rng';
import { createRng } from '../../core/rng';
import type { Card } from '../classic/cards';
import { checkWholePack, DECK, isCard, readCards } from '../classic/cards';
import type { DefenderShow } from '../classic/melds';
import { bestArrangement, cardValue, deadwood, defenderBest, ginRank, sortLow } from '../classic/melds';

export const HAND_SIZE = 10;
export const KNOCK_LIMIT = 10;
export const GAME_BONUS = 100;
export const MAX_HANDS = 50;
/** The hand is dead when this few cards are left in the stock after a discard. */
export const DEAD_STOCK = 2;

export interface GinConfig {
  readonly knock: 'ten' | 'oklahoma' | 'oklahoma-ace-gin';
  readonly spadeDouble: 'on' | 'off';
  readonly ginBonus: number;
  readonly undercutBonus: number;
  /** 0 when big gin is not allowed. */
  readonly bigGin: number;
  readonly lineBonus: number;
  readonly shutout: 'double-bonus' | 'double-all' | 'none';
  /** 0 for a single hand. */
  readonly target: number;
  readonly firstTurn: 'upcard' | 'eleven';
  readonly nextDealer: 'winner' | 'loser' | 'alternate';
  readonly start?: string;
}

export const STANDARD: GinConfig = {
  knock: 'ten',
  spadeDouble: 'on',
  ginBonus: 25,
  undercutBonus: 25,
  bigGin: 31,
  lineBonus: 25,
  shutout: 'double-bonus',
  target: 100,
  firstTurn: 'upcard',
  nextDealer: 'winner',
};

export const PRESETS: Readonly<Record<string, GinConfig>> = {
  standard: STANDARD,
  classic: { ...STANDARD, ginBonus: 20, undercutBonus: 10, bigGin: 0, lineBonus: 20 },
  oklahoma: { ...STANDARD, knock: 'oklahoma', target: 150 },
  quick: { ...STANDARD, target: 0 },
};

export const GIN_BONUSES: readonly number[] = [25, 20];
export const UNDERCUT_BONUSES: readonly number[] = [25, 20, 10];
export const BIG_GIN: readonly number[] = [31, 50, 0];
export const LINE_BONUSES: readonly number[] = [25, 20, 0];
export const TARGETS: readonly number[] = [100, 150, 250, 0];

export type HandKind = 'knock' | 'gin' | 'big-gin' | 'undercut' | 'dead';

export interface HandResult {
  readonly kind: HandKind;
  /** The hand's winner, or null for a dead hand. */
  readonly winner: Seat | null;
  readonly points: number;
  readonly knocker: Seat | null;
  /** The knocker's melds and deadwood, and the defender's showing (with layoffs). */
  readonly knockerMelds: readonly (readonly Card[])[];
  readonly knockerDeadwood: readonly Card[];
  readonly defenderMelds: readonly (readonly Card[])[];
  readonly defenderDeadwood: readonly Card[];
  readonly laid: readonly { readonly card: Card; readonly meld: number }[];
  readonly knockerCount: number;
  readonly defenderCount: number;
  readonly doubled: boolean;
}

export interface LogEntry {
  readonly seat: Seat;
  readonly type: 'take' | 'pass' | 'draw' | 'discard';
  /** The card, for moves everyone sees (a card taken from the pile, a discard). */
  readonly card?: Card;
}

export interface GinState {
  readonly config: GinConfig;
  readonly seed: string;
  readonly handNo: number;
  readonly dealer: Seat;
  readonly phase: 'offer' | 'draw' | 'discard';
  readonly toAct: Seat;
  readonly hands: readonly (readonly Card[])[];
  /** Top first. */
  readonly stock: readonly Card[];
  /** The discard pile, bottom first: the top card is the last. */
  readonly discard: readonly Card[];
  /** The card first turned up this hand (null in the eleven-card start). */
  readonly upcard: Card | null;
  /** Passes so far in the up-card offer. */
  readonly offers: number;
  /** The card taken from the pile this turn, which may not be thrown back at once. */
  readonly taken: Card | null;
  /** Both passed the up-card: the non-dealer must draw from the stock. */
  readonly stockOnly: boolean;
  /** Cards each seat is known to hold: taken from the pile and not thrown back. */
  readonly known: readonly (readonly Card[])[];
  /** Everything both players saw happen this hand. */
  readonly log: readonly LogEntry[];
  readonly scores: readonly number[];
  readonly handsWon: readonly number[];
  readonly results: readonly HandResult[];
  readonly over: boolean;
  /** Final totals with every bonus, once the game is over. */
  readonly final: readonly number[] | null;
}

export type GinAction =
  | { readonly type: 'take' }
  | { readonly type: 'pass' }
  | { readonly type: 'stock' }
  | { readonly type: 'pile' }
  | { readonly type: 'discard'; readonly card: Card }
  | { readonly type: 'knock'; readonly card: Card }
  | { readonly type: 'big-gin' };

export type GinEvent =
  | { readonly type: 'deal'; readonly handNo: number; readonly dealer: Seat; readonly upcard: Card | null }
  | { readonly type: 'offer'; readonly seat: Seat; readonly take: boolean; readonly card: Card }
  | { readonly type: 'draw'; readonly seat: Seat; readonly from: 'stock' | 'pile'; readonly card: Card }
  | { readonly type: 'discard'; readonly seat: Seat; readonly card: Card }
  | { readonly type: 'knock'; readonly seat: Seat; readonly card: Card | null; readonly result: HandResult }
  | { readonly type: 'dead' }
  | { readonly type: 'hand-end'; readonly result: HandResult; readonly scores: readonly number[] }
  | { readonly type: 'game-end'; readonly final: readonly number[] };

export interface GinView {
  readonly seat: Seat;
  readonly config: GinConfig;
  readonly handNo: number;
  readonly dealer: Seat;
  readonly phase: 'offer' | 'draw' | 'discard';
  readonly toAct: Seat;
  readonly hand: readonly Card[];
  readonly handCounts: readonly number[];
  readonly stockCount: number;
  readonly discard: readonly Card[];
  readonly upcard: Card | null;
  readonly offers: number;
  readonly taken: Card | null;
  readonly stockOnly: boolean;
  readonly known: readonly (readonly Card[])[];
  readonly log: readonly LogEntry[];
  readonly scores: readonly number[];
  readonly handsWon: readonly number[];
  readonly results: readonly HandResult[];
  readonly over: boolean;
  readonly final: readonly number[] | null;
}

const other = (seat: Seat): Seat => (seat === 0 ? 1 : 0);

/** The most deadwood a player may knock with this hand. */
export function knockLimit(config: Pick<GinConfig, 'knock'>, upcard: Card | null): number {
  if (config.knock === 'ten' || upcard === null) return KNOCK_LIMIT;
  if (config.knock === 'oklahoma-ace-gin' && ginRank(upcard) === 0) return 0;
  return cardValue(upcard);
}

function dealHand(config: GinConfig, seed: string, handNo: number, dealer: Seat, scores: readonly number[], handsWon: readonly number[], results: readonly HandResult[]): { state: GinState; event: GinEvent } {
  const rng = createRng(`${seed}/hand/${handNo}`);
  const pack = rng.shuffle(DECK);
  const first = other(dealer);
  const hands: Card[][] = [[], []];
  for (let i = 0; i < 2 * HAND_SIZE; i++) (hands[(first + i) % 2] as Card[]).push(pack.shift() as Card);
  let upcard: Card | null = null;
  const discard: Card[] = [];
  if (config.firstTurn === 'eleven') (hands[first] as Card[]).push(pack.shift() as Card);
  else {
    upcard = pack.shift() as Card;
    discard.push(upcard);
  }
  const state: GinState = {
    config,
    seed,
    handNo,
    dealer,
    phase: config.firstTurn === 'eleven' ? 'discard' : 'offer',
    toAct: first,
    hands: hands.map((h) => sortLow(h)),
    stock: pack,
    discard,
    upcard,
    offers: 0,
    taken: null,
    stockOnly: false,
    known: [[], []],
    log: [],
    scores,
    handsWon,
    results,
    over: false,
    final: null,
  };
  return { state, event: { type: 'deal', handNo, dealer, upcard } };
}

function toMove(s: GinState): Seat | null {
  return s.over ? null : s.toAct;
}

/** True when this hand of ten (after the discard) may knock under the limit. */
export function canKnockWith(cards: readonly Card[], limit: number): boolean {
  return deadwood(cards) <= limit;
}

function legalActions(s: GinState, seat: Seat): GinAction[] {
  if (s.over || s.toAct !== seat) return [];
  const hand = s.hands[seat] ?? [];
  switch (s.phase) {
    case 'offer':
      return [{ type: 'take' }, { type: 'pass' }];
    case 'draw': {
      const out: GinAction[] = [];
      if (s.stock.length > 0) out.push({ type: 'stock' });
      if (!s.stockOnly && s.discard.length > 0) out.push({ type: 'pile' });
      return out;
    }
    default: {
      const limit = knockLimit(s.config, s.upcard);
      const out: GinAction[] = [];
      for (const card of hand) {
        if (card === s.taken) continue;
        out.push({ type: 'discard', card });
        if (canKnockWith(hand.filter((c) => c !== card), limit)) out.push({ type: 'knock', card });
      }
      if (s.config.bigGin > 0 && hand.length === HAND_SIZE + 1 && deadwood(hand) === 0) out.push({ type: 'big-gin' });
      return out;
    }
  }
}

/** Scores a knock: the knocker's ten cards (eleven for big gin) against the defender's ten. */
export function scoreKnock(config: GinConfig, upcard: Card | null, knocker: Seat, knockerCards: readonly Card[], defenderCards: readonly Card[], big: boolean): HandResult {
  const k = bestArrangement(knockerCards);
  const gin = big || k.count === 0;
  const d: DefenderShow = defenderBest(defenderCards, k.melds, !gin);
  let kind: HandKind;
  let winner: Seat;
  let points: number;
  if (big) {
    kind = 'big-gin';
    winner = knocker;
    points = config.bigGin + d.count;
  } else if (gin) {
    kind = 'gin';
    winner = knocker;
    points = config.ginBonus + d.count;
  } else if (k.count < d.count) {
    kind = 'knock';
    winner = knocker;
    points = d.count - k.count;
  } else {
    kind = 'undercut';
    winner = other(knocker);
    points = config.undercutBonus + (k.count - d.count);
  }
  const doubled = config.knock !== 'ten' && config.spadeDouble === 'on' && upcard !== null && upcard[1] === 's';
  return {
    kind,
    winner,
    points: doubled ? points * 2 : points,
    knocker,
    knockerMelds: k.melds,
    knockerDeadwood: k.deadwood,
    defenderMelds: d.melds,
    defenderDeadwood: d.deadwood,
    laid: d.laid,
    knockerCount: k.count,
    defenderCount: d.count,
    doubled,
  };
}

const DEAD_RESULT: HandResult = { kind: 'dead', winner: null, points: 0, knocker: null, knockerMelds: [], knockerDeadwood: [], defenderMelds: [], defenderDeadwood: [], laid: [], knockerCount: 0, defenderCount: 0, doubled: false };

/** Final totals: points, line bonuses and the game bonus (with the shutout rule). */
export function finalTotals(config: GinConfig, scores: readonly number[], handsWon: readonly number[], winner: Seat | null): number[] {
  return scores.map((x, seat) => {
    if (config.target <= 0) return x;
    const shutout = winner !== null && (scores[other(winner)] ?? 0) === 0;
    let total = x + config.lineBonus * (handsWon[seat] ?? 0);
    if (seat === winner) {
      if (shutout && config.shutout === 'double-all') total += x;
      total += shutout && config.shutout === 'double-bonus' ? 2 * GAME_BONUS : GAME_BONUS;
    }
    return total;
  });
}

function endOfHand(s: GinState, result: HandResult): { state: GinState; events: GinEvent[] } {
  const scores = s.scores.map((x, seat) => (seat === result.winner ? x + result.points : x));
  const handsWon = s.handsWon.map((x, seat) => (seat === result.winner ? x + 1 : x));
  const results = [...s.results, result];
  const events: GinEvent[] = [{ type: 'hand-end', result, scores }];
  const reached = s.config.target > 0 && result.winner !== null && (scores[result.winner] ?? 0) >= s.config.target;
  if (s.config.target <= 0 || reached || results.length >= MAX_HANDS) {
    const winner = s.config.target <= 0 ? result.winner : reached ? result.winner : (scores[0] ?? 0) === (scores[1] ?? 0) ? null : (scores[0] ?? 0) > (scores[1] ?? 0) ? 0 : 1;
    const final = finalTotals(s.config, scores, handsWon, winner);
    events.push({ type: 'game-end', final });
    return { state: { ...s, scores, handsWon, results, over: true, final }, events };
  }
  const dealer = result.winner === null ? s.dealer : s.config.nextDealer === 'winner' ? result.winner : s.config.nextDealer === 'loser' ? other(result.winner) : other(s.dealer);
  const next = dealHand(s.config, s.seed, s.handNo + 1, dealer, scores, handsWon, results);
  events.push(next.event);
  return { state: next.state, events };
}

function applyAction(s: GinState, action: GinAction): { state: GinState; events: GinEvent[] } {
  const seat = toMove(s);
  if (seat === null) throw new Error('The game is over');
  const key = actionText(action);
  if (!legalActions(s, seat).some((a) => actionText(a) === key)) throw new Error(`${key} is not legal here`);
  const hand = s.hands[seat] ?? [];
  const setHand = (cards: readonly Card[]) => s.hands.map((h, i) => (i === seat ? sortLow(cards) : h));
  switch (action.type) {
    case 'take': {
      const card = s.discard[s.discard.length - 1] as Card;
      return {
        state: { ...s, hands: setHand([...hand, card]), discard: s.discard.slice(0, -1), taken: card, phase: 'discard', known: s.known.map((k, i) => (i === seat ? [...k, card] : k)), log: [...s.log, { seat, type: 'take', card }] },
        events: [{ type: 'offer', seat, take: true, card }],
      };
    }
    case 'pass': {
      const offers = s.offers + 1;
      const card = s.discard[s.discard.length - 1] as Card;
      const log = [...s.log, { seat, type: 'pass' as const, card }];
      if (offers < 2) return { state: { ...s, offers, toAct: other(seat), log }, events: [{ type: 'offer', seat, take: false, card }] };
      return { state: { ...s, offers, toAct: other(s.dealer), phase: 'draw', stockOnly: true, log }, events: [{ type: 'offer', seat, take: false, card }] };
    }
    case 'stock': {
      const card = s.stock[0] as Card;
      return {
        state: { ...s, hands: setHand([...hand, card]), stock: s.stock.slice(1), taken: null, phase: 'discard', stockOnly: false, log: [...s.log, { seat, type: 'draw' }] },
        events: [{ type: 'draw', seat, from: 'stock', card }],
      };
    }
    case 'pile': {
      const card = s.discard[s.discard.length - 1] as Card;
      return {
        state: { ...s, hands: setHand([...hand, card]), discard: s.discard.slice(0, -1), taken: card, phase: 'discard', known: s.known.map((k, i) => (i === seat ? [...k, card] : k)), log: [...s.log, { seat, type: 'take', card }] },
        events: [{ type: 'draw', seat, from: 'pile', card }],
      };
    }
    case 'discard': {
      const card = action.card;
      const after: GinState = {
        ...s,
        hands: setHand(hand.filter((c) => c !== card)),
        discard: [...s.discard, card],
        taken: null,
        known: s.known.map((k, i) => (i === seat ? k.filter((c) => c !== card) : k)),
        log: [...s.log, { seat, type: 'discard', card }],
        phase: 'draw',
        toAct: other(seat),
        stockOnly: false,
      };
      const events: GinEvent[] = [{ type: 'discard', seat, card }];
      if (after.stock.length <= DEAD_STOCK) {
        events.push({ type: 'dead' });
        const end = endOfHand(after, DEAD_RESULT);
        return { state: end.state, events: [...events, ...end.events] };
      }
      return { state: after, events };
    }
    case 'knock':
    case 'big-gin': {
      const big = action.type === 'big-gin';
      const card = action.type === 'knock' ? action.card : null;
      const mine = card ? hand.filter((c) => c !== card) : [...hand];
      const result = scoreKnock(s.config, s.upcard, seat, mine, s.hands[other(seat)] ?? [], big);
      const after: GinState = { ...s, hands: setHand(mine), discard: card ? [...s.discard, card] : s.discard, taken: null };
      const end = endOfHand(after, result);
      return { state: end.state, events: [{ type: 'knock', seat, card, result }, ...end.events] };
    }
  }
}

// Codecs

export function actionText(a: GinAction): string {
  switch (a.type) {
    case 'discard':
      return a.card;
    case 'knock':
      return `knock:${a.card}`;
    case 'pile':
      return 'discard';
    default:
      return a.type;
  }
}

function parseAction(text: string): GinAction {
  const t = text.trim();
  if (t === 'take' || t === 'pass' || t === 'stock' || t === 'big-gin') return { type: t };
  if (t === 'discard' || t === 'pile') return { type: 'pile' };
  if (t.startsWith('knock:') && isCard(t.slice(6))) return { type: 'knock', card: t.slice(6) as Card };
  if (isCard(t)) return { type: 'discard', card: t };
  throw new Error(`"${text}" is not a Gin Rummy move, such as stock, discard, Kh or knock:Kh`);
}

const CONFIG_KEYS = ['knock', 'spadeDouble', 'ginBonus', 'undercutBonus', 'bigGin', 'lineBonus', 'shutout', 'target', 'firstTurn', 'nextDealer'] as const;

function readConfig(json: Json): GinConfig {
  if (!isJsonObject(json)) return STANDARD;
  const pick = <K extends keyof GinConfig>(key: K, allowed: readonly GinConfig[K][]): GinConfig[K] => {
    const value = json[key] as GinConfig[K] | undefined;
    return value !== undefined && allowed.includes(value) ? value : STANDARD[key];
  };
  return {
    knock: pick('knock', ['ten', 'oklahoma', 'oklahoma-ace-gin']),
    spadeDouble: pick('spadeDouble', ['on', 'off']),
    ginBonus: pick('ginBonus', GIN_BONUSES),
    undercutBonus: pick('undercutBonus', UNDERCUT_BONUSES),
    bigGin: pick('bigGin', BIG_GIN),
    lineBonus: pick('lineBonus', LINE_BONUSES),
    shutout: pick('shutout', ['double-bonus', 'double-all', 'none']),
    target: pick('target', TARGETS),
    firstTurn: pick('firstTurn', ['upcard', 'eleven']),
    nextDealer: pick('nextDealer', ['winner', 'loser', 'alternate']),
    ...(typeof json.start === 'string' ? { start: json.start } : {}),
  };
}

function configJson(c: GinConfig): Json {
  const out: Record<string, Json> = {};
  for (const key of CONFIG_KEYS) out[key] = c[key];
  if (c.start) out.start = c.start;
  return out;
}

const cardList = (json: Json | undefined, what: string): Card[] => (json === undefined ? [] : readCards(json, `Gin Rummy: ${what}`));
const meldList = (json: Json | undefined): Card[][] => (Array.isArray(json) ? json.map((m) => cardList(m, 'a meld')) : []);

function resultFromJson(r: Json): HandResult {
  if (!isJsonObject(r)) throw new Error('Gin Rummy: a hand result is damaged');
  const kinds: HandKind[] = ['knock', 'gin', 'big-gin', 'undercut', 'dead'];
  return {
    kind: kinds.includes(r.kind as HandKind) ? (r.kind as HandKind) : 'dead',
    winner: typeof r.winner === 'number' ? r.winner : null,
    points: typeof r.points === 'number' ? r.points : 0,
    knocker: typeof r.knocker === 'number' ? r.knocker : null,
    knockerMelds: meldList(r.knockerMelds),
    knockerDeadwood: cardList(r.knockerDeadwood, 'deadwood'),
    defenderMelds: meldList(r.defenderMelds),
    defenderDeadwood: cardList(r.defenderDeadwood, 'deadwood'),
    laid: Array.isArray(r.laid) ? r.laid.flatMap((x) => (isJsonObject(x) && typeof x.card === 'string' && isCard(x.card) && typeof x.meld === 'number' ? [{ card: x.card, meld: x.meld }] : [])) : [],
    knockerCount: typeof r.knockerCount === 'number' ? r.knockerCount : 0,
    defenderCount: typeof r.defenderCount === 'number' ? r.defenderCount : 0,
    doubled: r.doubled === true,
  };
}

function resultToJson(r: HandResult): Json {
  return {
    kind: r.kind,
    winner: r.winner,
    points: r.points,
    knocker: r.knocker,
    knockerMelds: r.knockerMelds.map((m) => [...m]),
    knockerDeadwood: [...r.knockerDeadwood],
    defenderMelds: r.defenderMelds.map((m) => [...m]),
    defenderDeadwood: [...r.defenderDeadwood],
    laid: r.laid.map((x) => ({ card: x.card, meld: x.meld })),
    knockerCount: r.knockerCount,
    defenderCount: r.defenderCount,
    doubled: r.doubled,
  };
}

const nums = (json: Json | undefined, fallback: number[]): number[] => (Array.isArray(json) && json.every((n) => typeof n === 'number') ? json : fallback);

function stateFromJson(json: Json): GinState {
  if (!isJsonObject(json)) throw new Error('Not a Gin Rummy position');
  const config = readConfig(json.config ?? null);
  const log: LogEntry[] = Array.isArray(json.log)
    ? json.log.flatMap((e) => {
        if (!isJsonObject(e) || typeof e.seat !== 'number' || !['take', 'pass', 'draw', 'discard'].includes(e.type as string)) return [];
        return [{ seat: e.seat, type: e.type as LogEntry['type'], ...(typeof e.card === 'string' && isCard(e.card) ? { card: e.card } : {}) }];
      })
    : [];
  const phases = ['offer', 'draw', 'discard'] as const;
  const state: GinState = {
    config,
    seed: typeof json.seed === 'string' ? json.seed : 'lesson',
    handNo: typeof json.handNo === 'number' ? json.handNo : 0,
    dealer: json.dealer === 0 ? 0 : 1,
    phase: phases.includes(json.phase as (typeof phases)[number]) ? (json.phase as GinState['phase']) : 'draw',
    toAct: json.toAct === 1 ? 1 : 0,
    hands: Array.isArray(json.hands) ? json.hands.map((h) => cardList(h, 'a hand')) : [[], []],
    stock: cardList(json.stock, 'the stock'),
    discard: cardList(json.discard, 'the discard pile'),
    upcard: typeof json.upcard === 'string' && isCard(json.upcard) ? json.upcard : null,
    offers: typeof json.offers === 'number' ? json.offers : 0,
    taken: typeof json.taken === 'string' && isCard(json.taken) ? json.taken : null,
    stockOnly: json.stockOnly === true,
    known: Array.isArray(json.known) ? json.known.map((k) => cardList(k, 'a known card')) : [[], []],
    log,
    scores: nums(json.scores, [0, 0]),
    handsWon: nums(json.handsWon, [0, 0]),
    results: Array.isArray(json.results) ? json.results.map(resultFromJson) : [],
    over: json.over === true,
    final: Array.isArray(json.final) ? nums(json.final, [0, 0]) : null,
  };
  checkConservation(state);
  return state;
}

/** Every card is in a hand, the stock or the discard pile; or, once a hand is over, in the result shown. */
export function checkConservation(s: Pick<GinState, 'hands' | 'stock' | 'discard' | 'over'>): void {
  const all = [...s.hands.flat(), ...s.stock, ...s.discard];
  if (s.over) {
    if (new Set(all).size !== all.length) throw new Error('Gin Rummy: a card is in two places');
    return;
  }
  checkWholePack(all, 'Gin Rummy');
}

function stateToJson(s: GinState): Json {
  return {
    config: configJson(s.config),
    seed: s.seed,
    handNo: s.handNo,
    dealer: s.dealer,
    phase: s.phase,
    toAct: s.toAct,
    hands: s.hands.map((h) => [...h]),
    stock: [...s.stock],
    discard: [...s.discard],
    upcard: s.upcard,
    offers: s.offers,
    taken: s.taken,
    stockOnly: s.stockOnly,
    known: s.known.map((k) => [...k]),
    log: s.log.map((e) => ({ seat: e.seat, type: e.type, ...(e.card ? { card: e.card } : {}) })),
    scores: [...s.scores],
    handsWon: [...s.handsWon],
    results: s.results.map(resultToJson),
    over: s.over,
    final: s.final ? [...s.final] : null,
  };
}

const stateCodec: Codec<GinState> = {
  toJSON: stateToJson,
  fromJSON: stateFromJson,
  toText: (s) => stableStringify(stateToJson(s)),
  fromText: (text) => stateFromJson(JSON.parse(text) as Json),
};

const actionCodec: Codec<GinAction> = {
  toJSON: (a) => actionText(a),
  fromJSON(json) {
    if (typeof json !== 'string') throw new Error('A Gin Rummy move is stored as text, such as stock or Kh');
    return parseAction(json);
  },
  toText: actionText,
  fromText: (text) => parseAction(text),
};

const configCodec: JsonCodec<GinConfig> = { toJSON: configJson, fromJSON: readConfig };

function outcomeOf(s: GinState): Outcome | null {
  if (!s.over) return null;
  const last = s.results[s.results.length - 1];
  const final = s.final ?? s.scores;
  let winner: Seat | null;
  if (s.config.target <= 0) winner = last?.winner ?? null;
  else {
    const reached = [0, 1].filter((seat) => (s.scores[seat] ?? 0) >= s.config.target);
    winner = reached.length === 1 ? (reached[0] as Seat) : (final[0] ?? 0) === (final[1] ?? 0) ? null : (final[0] ?? 0) > (final[1] ?? 0) ? 0 : 1;
  }
  const score = (seat: Seat) => (s.config.target <= 0 ? (seat === winner ? (last?.points ?? 0) : 0) : (final[seat] ?? 0));
  if (winner === null) return { reason: s.config.target <= 0 ? 'gin-dead' : 'gin-tie', results: [0, 1].map((seat) => ({ seat, place: 1, score: score(seat) })) };
  return {
    reason: s.config.target <= 0 ? `gin-${last?.kind ?? 'knock'}` : 'gin-game',
    results: [
      { seat: winner, place: 1, score: score(winner) },
      { seat: other(winner), place: 2, score: score(other(winner)) },
    ],
  };
}

export function viewOf(s: GinState, seat: Seat): GinView {
  return {
    seat,
    config: s.config,
    handNo: s.handNo,
    dealer: s.dealer,
    phase: s.phase,
    toAct: s.toAct,
    hand: [...(s.hands[seat] ?? [])],
    handCounts: s.hands.map((h) => h.length),
    stockCount: s.stock.length,
    discard: s.discard,
    upcard: s.upcard,
    offers: s.offers,
    taken: s.taken,
    stockOnly: s.stockOnly,
    known: s.known,
    log: s.log,
    scores: s.scores,
    handsWon: s.handsWon,
    results: s.results,
    over: s.over,
    final: s.final,
  };
}

/** The cards a seat cannot see: not in its hand, not in the pile, not known to be held by the other. */
export function unseenCards(v: GinView): Card[] {
  const seen = new Set<Card>([...v.hand, ...v.discard, ...(v.known[other(v.seat)] ?? [])]);
  return DECK.filter((c) => !seen.has(c));
}

/** A full state consistent with a view: the other hand (its known cards plus unseen ones) and the stock. */
export function sampleState(v: GinView, rng: Rng): GinState {
  const them = other(v.seat);
  const unseen = rng.shuffle(unseenCards(v));
  const theirKnown = [...(v.known[them] ?? [])];
  const theirs = [...theirKnown, ...unseen.splice(0, Math.max(0, (v.handCounts[them] ?? 0) - theirKnown.length))];
  const hands: Card[][] = [[], []];
  hands[v.seat] = [...v.hand];
  hands[them] = sortLow(theirs);
  return {
    config: v.config,
    seed: `sample/${rng.int(1_000_000_000)}`,
    handNo: v.handNo,
    dealer: v.dealer,
    phase: v.phase,
    toAct: v.toAct,
    hands,
    stock: unseen.slice(0, v.stockCount),
    discard: v.discard,
    upcard: v.upcard,
    offers: v.offers,
    taken: v.taken,
    stockOnly: v.stockOnly,
    known: v.known,
    log: v.log,
    scores: v.scores,
    handsWon: v.handsWon,
    results: v.results,
    over: v.over,
    final: v.final,
  };
}

export const ginRummy: GameDef<GinState, GinAction, GinConfig, GinView, GinEvent & GameEvent> = {
  id: 'gin-rummy',
  rulesVersion: 1,
  defaultConfig: STANDARD,
  setup(config, rng) {
    const seed = `gin/${rng.int(2_147_483_647)}/${rng.int(2_147_483_647)}`;
    if (config.start) {
      const from = stateFromJson(JSON.parse(config.start) as Json);
      return { ...from, config: { ...config, start: undefined }, seed };
    }
    return dealHand(config, seed, 0, 1, [0, 0], [0, 0], []).state;
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

export function presetOf(config: GinConfig): string | null {
  const key = stableStringify(configJson({ ...config, start: undefined }));
  return Object.entries(PRESETS).find(([, c]) => stableStringify(configJson(c)) === key)?.[0] ?? null;
}

/**
 * A position for lessons and problems; seat 0 is the student. Cards not named go into the stock
 * (in a fixed order, after any stock given), so every position holds all 52 cards.
 */
export function position(p: {
  me: readonly Card[];
  them: readonly Card[];
  discard?: readonly Card[];
  stock?: readonly Card[];
  phase?: GinState['phase'];
  toAct?: Seat;
  upcard?: Card | null;
  known?: readonly Card[];
  taken?: Card | null;
  config?: Partial<GinConfig>;
  scores?: readonly number[];
}): string {
  const named = new Set<Card>([...p.me, ...p.them, ...(p.discard ?? []), ...(p.stock ?? [])]);
  const stock = [...(p.stock ?? []), ...DECK.filter((c) => !named.has(c))];
  const state: GinState = {
    config: { ...STANDARD, target: 0, ...p.config },
    seed: 'lesson',
    handNo: 0,
    dealer: 1,
    phase: p.phase ?? 'draw',
    toAct: p.toAct ?? 0,
    hands: [sortLow(p.me), sortLow(p.them)],
    stock,
    discard: [...(p.discard ?? [])],
    upcard: p.upcard === undefined ? (p.discard?.[0] ?? null) : p.upcard,
    offers: 0,
    taken: p.taken ?? null,
    stockOnly: false,
    known: [[], [...(p.known ?? [])]],
    log: [],
    scores: p.scores ?? [0, 0],
    handsWon: [0, 0],
    results: [],
    over: false,
    final: null,
  };
  checkConservation(state);
  return stateCodec.toText(state);
}
