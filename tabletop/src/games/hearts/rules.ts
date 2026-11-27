/**
 * Hearts for four (docs/rules/hearts.md), behind the game contract, on the shared trick module.
 * Every disputed rule is an option; presets are named configs. Cards are written as in the poker
 * module ("Qs", "Th", "2c").
 *
 * Hidden information: a seat's view holds its own hand, the cards it chose to pass (and, after the
 * exchange, the cards it received), every trick played and the scores; never another hand,
 * another player's pass, or the seed that deals later hands.
 */
import type { Codec, GameDef, GameEvent, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject, stableStringify } from '../../core/json';
import type { Rng } from '../../core/rng';
import { createRng } from '../../core/rng';
import type { Card } from '../classic/cards';
import { canonical, checkWholePack, DECK, dealHands, isCard, readCards, sortHand, suitOf } from '../classic/cards';
import type { Play } from '../classic/tricks';
import { dealConsistent, following, trickWinner, voidsOf } from '../classic/tricks';

export const SEATS = 4;
export const HAND_SIZE = 13;
export const PASS_COUNT = 3;
export const QUEEN: Card = 'Qs';
export const JACK: Card = 'Jd';
export const MOON_POINTS = 26;
export const MAX_HANDS = 60;

export interface HeartsConfig {
  readonly passing: 'lrah' | 'lra' | 'lr' | 'left' | 'none';
  readonly firstLead: 'two-clubs' | 'left-of-dealer';
  readonly firstTrickPoints: 'no' | 'yes';
  readonly breakHearts: 'on' | 'off';
  readonly queenBreaks: 'no' | 'yes';
  readonly moon: 'add' | 'subtract' | 'choose';
  readonly jackDiamonds: 'off' | 'minus-10';
  readonly target: number;
  readonly ties: 'share' | 'play-on';
  /** A position to start from instead of a deal ("play on from here"), in state notation. */
  readonly start?: string;
}

export const STANDARD: HeartsConfig = {
  passing: 'lrah',
  firstLead: 'two-clubs',
  firstTrickPoints: 'no',
  breakHearts: 'on',
  queenBreaks: 'no',
  moon: 'add',
  jackDiamonds: 'off',
  target: 100,
  ties: 'share',
};

export const PRESETS: Readonly<Record<string, HeartsConfig>> = {
  standard: STANDARD,
  omnibus: { ...STANDARD, jackDiamonds: 'minus-10' },
  'old-style': { ...STANDARD, firstLead: 'left-of-dealer', breakHearts: 'off', firstTrickPoints: 'yes', moon: 'subtract' },
  quick: { ...STANDARD, target: 50 },
};

export const TARGETS: readonly number[] = [100, 50, 0];

/** Offsets to the receiver: 1 left (the next player), 3 right, 2 across, 0 no pass. */
export type PassDir = 0 | 1 | 2 | 3;

export function passDirFor(config: Pick<HeartsConfig, 'passing'>, handNo: number): PassDir {
  switch (config.passing) {
    case 'lrah':
      return ([1, 3, 2, 0] as const)[handNo % 4] as PassDir;
    case 'lra':
      return ([1, 3, 2] as const)[handNo % 3] as PassDir;
    case 'lr':
      return ([1, 3] as const)[handNo % 2] as PassDir;
    case 'left':
      return 1;
    default:
      return 0;
  }
}

export interface HandResult {
  /** Points each seat scored this hand (after the moon). */
  readonly points: readonly number[];
  /** The seat that shot the moon, if anyone did. */
  readonly moon: Seat | null;
}

export interface HeartsState {
  readonly config: HeartsConfig;
  readonly seed: string;
  readonly handNo: number;
  readonly dealer: Seat;
  readonly phase: 'pass' | 'play';
  readonly passDir: PassDir;
  readonly hands: readonly (readonly Card[])[];
  /** The cards each seat chose to pass (before the exchange), then the cards it gave (after); null until chosen. */
  readonly passes: readonly (readonly Card[] | null)[];
  readonly exchanged: boolean;
  readonly trick: readonly Play[];
  readonly leader: Seat;
  /** The completed tricks of this hand, in order, each with its winner. */
  readonly tricks: readonly (readonly Play[])[];
  readonly winners: readonly Seat[];
  readonly broken: boolean;
  /** Totals before this hand. */
  readonly scores: readonly number[];
  readonly results: readonly HandResult[];
  readonly over: boolean;
}

export type HeartsAction = { readonly type: 'pass'; readonly cards: readonly Card[] } | { readonly type: 'play'; readonly card: Card };

export type HeartsEvent =
  | { readonly type: 'deal'; readonly handNo: number; readonly dealer: Seat; readonly passDir: PassDir }
  | { readonly type: 'pass-chosen'; readonly seat: Seat }
  | { readonly type: 'exchange'; readonly passDir: PassDir; readonly gave: readonly (readonly Card[])[] }
  | { readonly type: 'play'; readonly seat: Seat; readonly card: Card; readonly breaks: boolean }
  | { readonly type: 'trick'; readonly winner: Seat; readonly plays: readonly Play[]; readonly points: number }
  | { readonly type: 'hand-end'; readonly points: readonly number[]; readonly moon: Seat | null; readonly scores: readonly number[] }
  | { readonly type: 'game-end'; readonly scores: readonly number[] };

export interface HeartsView {
  readonly seat: Seat;
  readonly config: HeartsConfig;
  readonly handNo: number;
  readonly dealer: Seat;
  readonly phase: 'pass' | 'play';
  readonly passDir: PassDir;
  readonly hand: readonly Card[];
  readonly handCounts: readonly number[];
  /** The cards this seat chose to pass (or gave, after the exchange); null until chosen. */
  readonly myPass: readonly Card[] | null;
  /** Who has chosen their pass. */
  readonly passed: readonly boolean[];
  readonly exchanged: boolean;
  /** The cards this seat received in the exchange. */
  readonly received: readonly Card[];
  readonly trick: readonly Play[];
  readonly leader: Seat;
  readonly tricks: readonly (readonly Play[])[];
  readonly winners: readonly Seat[];
  readonly broken: boolean;
  readonly scores: readonly number[];
  readonly results: readonly HandResult[];
  readonly over: boolean;
}

// Cards and points

export const isHeart = (card: Card): boolean => card[1] === 'h';
/** A penalty card: a heart or the queen of spades. */
export const isPenalty = (card: Card): boolean => isHeart(card) || card === QUEEN;

export function cardPoints(card: Card, config: Pick<HeartsConfig, 'jackDiamonds'>): number {
  if (isHeart(card)) return 1;
  if (card === QUEEN) return 13;
  if (card === JACK && config.jackDiamonds === 'minus-10') return -10;
  return 0;
}

export function pointsOf(cards: readonly Card[], config: Pick<HeartsConfig, 'jackDiamonds'>): number {
  let n = 0;
  for (const c of cards) n += cardPoints(c, config);
  return n;
}

/** The cards each seat has taken this hand. */
export function takenBy(s: Pick<HeartsState, 'tricks' | 'winners'>): Card[][] {
  const out: Card[][] = [[], [], [], []];
  s.tricks.forEach((trick, i) => {
    const w = s.winners[i] ?? 0;
    for (const p of trick) (out[w] as Card[]).push(p.card);
  });
  return out;
}

const receiverOf = (seat: Seat, dir: PassDir): Seat => (seat + dir) % SEATS;
export const giverTo = (seat: Seat, dir: PassDir): Seat => (seat - dir + SEATS) % SEATS;

// Dealing

function dealHand(config: HeartsConfig, seed: string, handNo: number, dealer: Seat, scores: readonly number[], results: readonly HandResult[]): { state: HeartsState; event: HeartsEvent } {
  const rng = createRng(`${seed}/hand/${handNo}`);
  const { hands } = dealHands(rng, SEATS, HAND_SIZE, (dealer + 1) % SEATS);
  const passDir = passDirFor(config, handNo);
  const base: HeartsState = {
    config,
    seed,
    handNo,
    dealer,
    phase: passDir === 0 ? 'play' : 'pass',
    passDir,
    hands,
    passes: [null, null, null, null],
    exchanged: passDir === 0,
    trick: [],
    leader: (dealer + 1) % SEATS,
    tricks: [],
    winners: [],
    broken: false,
    scores,
    results,
    over: false,
  };
  const state = passDir === 0 ? { ...base, leader: firstLeader(base) } : base;
  return { state, event: { type: 'deal', handNo, dealer, passDir } };
}

function firstLeader(s: Pick<HeartsState, 'config' | 'hands' | 'dealer'>): Seat {
  if (s.config.firstLead === 'two-clubs') {
    const holder = s.hands.findIndex((h) => h.includes('2c'));
    if (holder >= 0) return holder;
  }
  return (s.dealer + 1) % SEATS;
}

function toMove(s: HeartsState): Seat | null {
  if (s.over) return null;
  if (s.phase === 'pass') {
    for (let i = 1; i <= SEATS; i++) {
      const seat = (s.dealer + i) % SEATS;
      if (!s.passes[seat]) return seat;
    }
    return null;
  }
  return (s.leader + s.trick.length) % SEATS;
}

/** The cards a seat may play now, by the rules in force. */
export function playableCards(s: Pick<HeartsState, 'config' | 'trick' | 'tricks' | 'broken'>, hand: readonly Card[]): Card[] {
  const first = s.tricks.length === 0;
  const config = s.config;
  if (s.trick.length === 0) {
    if (first && config.firstLead === 'two-clubs' && hand.includes('2c')) return ['2c'];
    let options = [...hand];
    if (config.breakHearts === 'on' && !s.broken) {
      const onlyHeartsAndQueen = hand.every((c) => isHeart(c) || c === QUEEN);
      if (!onlyHeartsAndQueen) options = options.filter((c) => !isHeart(c));
    }
    if (first && config.firstTrickPoints === 'no') {
      const clean = options.filter((c) => !isPenalty(c));
      if (clean.length > 0) options = clean;
    }
    return options;
  }
  let options = following(hand, s.trick);
  const led = suitOf((s.trick[0] as Play).card);
  if (first && config.firstTrickPoints === 'no' && !hand.some((c) => suitOf(c) === led)) {
    const clean = options.filter((c) => !isPenalty(c));
    if (clean.length > 0) options = clean;
  }
  return options;
}

/** Every way to choose three cards from a hand, each in canonical order. */
export function passChoices(hand: readonly Card[]): Card[][] {
  const cards = canonical(hand);
  const out: Card[][] = [];
  for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) for (let k = j + 1; k < cards.length; k++) out.push([cards[i] as Card, cards[j] as Card, cards[k] as Card]);
  return out;
}

function legalActions(s: HeartsState, seat: Seat): HeartsAction[] {
  if (toMove(s) !== seat) return [];
  const hand = s.hands[seat] ?? [];
  if (s.phase === 'pass') return passChoices(hand).map((cards) => ({ type: 'pass', cards }));
  return playableCards(s, hand).map((card) => ({ type: 'play', card }));
}

/** The points of a finished hand, with the moon, under the rules in force. */
export function handPoints(taken: readonly (readonly Card[])[], config: HeartsConfig, scores: readonly number[]): HandResult {
  const raw = taken.map((cards) => pointsOf(cards, config));
  const jackOnly = taken.map((cards) => (config.jackDiamonds === 'minus-10' && cards.includes(JACK) ? -10 : 0));
  const shooter = taken.findIndex((cards) => cards.includes(QUEEN) && cards.filter(isHeart).length === 13);
  if (shooter < 0) return { points: raw, moon: null };
  const add = taken.map((_, seat) => (seat === shooter ? 0 : MOON_POINTS) + (jackOnly[seat] ?? 0));
  const subtract = taken.map((_, seat) => (seat === shooter ? -MOON_POINTS : 0) + (jackOnly[seat] ?? 0));
  if (config.moon === 'add') return { points: add, moon: shooter };
  if (config.moon === 'subtract') return { points: subtract, moon: shooter };
  // The shooter's choice: add, unless that ends the game without the shooter in first place.
  const after = scores.map((x, seat) => x + (add[seat] ?? 0));
  const ends = config.target > 0 && after.some((x) => x >= config.target);
  const shooterFirst = (after[shooter] ?? 0) <= Math.min(...after);
  return { points: ends && !shooterFirst ? subtract : add, moon: shooter };
}

function endOfHand(s: HeartsState): { state: HeartsState; events: HeartsEvent[] } {
  const result = handPoints(takenBy(s), s.config, s.scores);
  const scores = s.scores.map((x, i) => x + (result.points[i] ?? 0));
  const results = [...s.results, result];
  const events: HeartsEvent[] = [{ type: 'hand-end', points: result.points, moon: result.moon, scores }];
  const target = s.config.target;
  const reached = target <= 0 || scores.some((x) => x >= target);
  const low = Math.min(...scores);
  const lowShared = scores.filter((x) => x === low).length > 1;
  if ((reached && !(s.config.ties === 'play-on' && lowShared && target > 0)) || results.length >= MAX_HANDS) {
    events.push({ type: 'game-end', scores });
    return { state: { ...s, scores, results, over: true }, events };
  }
  const next = dealHand(s.config, s.seed, s.handNo + 1, (s.dealer + 1) % SEATS, scores, results);
  events.push(next.event);
  return { state: next.state, events };
}

function applyAction(s: HeartsState, action: HeartsAction): { state: HeartsState; events: HeartsEvent[] } {
  const seat = toMove(s);
  if (seat === null) throw new Error('The game is over');
  const hand = s.hands[seat] ?? [];
  if (action.type === 'pass') {
    if (s.phase !== 'pass') throw new Error('It is not time to pass');
    const cards = canonical(action.cards);
    if (cards.length !== PASS_COUNT || new Set(cards).size !== PASS_COUNT || !cards.every((c) => hand.includes(c))) throw new Error(`pass:${cards.join(',')} is not legal here`);
    const passes = s.passes.map((p, i) => (i === seat ? cards : p));
    const events: HeartsEvent[] = [{ type: 'pass-chosen', seat }];
    if (passes.some((p) => !p)) return { state: { ...s, passes }, events };
    // Everyone has chosen: the cards change hands.
    const hands = s.hands.map((h, i) => {
      const from = giverTo(i, s.passDir);
      return [...h.filter((c) => !(passes[i] as Card[]).includes(c)), ...(passes[from] as Card[])];
    });
    const after: HeartsState = { ...s, hands, passes, exchanged: true, phase: 'play' };
    events.push({ type: 'exchange', passDir: s.passDir, gave: passes as Card[][] });
    return { state: { ...after, leader: firstLeader(after) }, events };
  }
  if (s.phase !== 'play') throw new Error('It is not time to play');
  const card = action.card;
  if (!playableCards(s, hand).includes(card)) throw new Error(`${card} is not legal here`);
  const breaks = !s.broken && (isHeart(card) || (s.config.queenBreaks === 'yes' && card === QUEEN));
  const hands = s.hands.map((h, i) => (i === seat ? h.filter((c) => c !== card) : h));
  const trick = [...s.trick, { seat, card }];
  const events: HeartsEvent[] = [{ type: 'play', seat, card, breaks }];
  const broken = s.broken || breaks;
  if (trick.length < SEATS) return { state: { ...s, hands, trick, broken }, events };
  const winner = trickWinner(trick, null);
  events.push({ type: 'trick', winner, plays: trick, points: pointsOf(trick.map((p) => p.card), s.config) });
  const after: HeartsState = { ...s, hands, trick: [], broken, leader: winner, tricks: [...s.tricks, trick], winners: [...s.winners, winner] };
  if (after.tricks.length < HAND_SIZE) return { state: after, events };
  const end = endOfHand(after);
  return { state: end.state, events: [...events, ...end.events] };
}

// Codecs

export function actionText(a: HeartsAction): string {
  return a.type === 'pass' ? `pass:${canonical(a.cards).join(',')}` : a.card;
}

function parseAction(text: string): HeartsAction {
  const t = text.trim();
  if (t.startsWith('pass:')) {
    const cards = t.slice(5).split(',').map((c) => c.trim());
    if (cards.length !== PASS_COUNT || !cards.every(isCard)) throw new Error(`"${text}" is not a pass of three cards, such as pass:Qs,Ah,Kh`);
    return { type: 'pass', cards: canonical(cards) };
  }
  if (!isCard(t)) throw new Error(`"${text}" is not a card, such as Qs or 2c`);
  return { type: 'play', card: t };
}

const PASSINGS = ['lrah', 'lra', 'lr', 'left', 'none'] as const;

function readConfig(json: Json): HeartsConfig {
  if (!isJsonObject(json)) return STANDARD;
  const pick = <K extends keyof HeartsConfig>(key: K, allowed: readonly HeartsConfig[K][]): HeartsConfig[K] => {
    const value = json[key] as HeartsConfig[K] | undefined;
    return value !== undefined && allowed.includes(value) ? value : STANDARD[key];
  };
  return {
    passing: pick('passing', PASSINGS),
    firstLead: pick('firstLead', ['two-clubs', 'left-of-dealer']),
    firstTrickPoints: pick('firstTrickPoints', ['no', 'yes']),
    breakHearts: pick('breakHearts', ['on', 'off']),
    queenBreaks: pick('queenBreaks', ['no', 'yes']),
    moon: pick('moon', ['add', 'subtract', 'choose']),
    jackDiamonds: pick('jackDiamonds', ['off', 'minus-10']),
    target: pick('target', TARGETS),
    ties: pick('ties', ['share', 'play-on']),
    ...(typeof json.start === 'string' ? { start: json.start } : {}),
  };
}

const CONFIG_KEYS = ['passing', 'firstLead', 'firstTrickPoints', 'breakHearts', 'queenBreaks', 'moon', 'jackDiamonds', 'target', 'ties'] as const;

function configJson(c: HeartsConfig): Json {
  const out: Record<string, Json> = {};
  for (const key of CONFIG_KEYS) out[key] = c[key];
  if (c.start) out.start = c.start;
  return out;
}

const plays = (json: Json | undefined, what: string): Play[] => {
  if (json === undefined) return [];
  if (!Array.isArray(json)) throw new Error(`Hearts: ${what} is damaged`);
  return json.map((p) => {
    if (!isJsonObject(p) || typeof p.seat !== 'number' || typeof p.card !== 'string' || !isCard(p.card)) throw new Error(`Hearts: ${what} is damaged`);
    return { seat: p.seat, card: p.card };
  });
};

const nums = (json: Json | undefined, what: string, fallback: number[]): number[] => {
  if (json === undefined) return fallback;
  if (!Array.isArray(json) || !json.every((n) => typeof n === 'number')) throw new Error(`Hearts: ${what} is damaged`);
  return json;
};

function stateFromJson(json: Json): HeartsState {
  if (!isJsonObject(json)) throw new Error('Not a Hearts position');
  const config = readConfig(json.config ?? null);
  const hands = Array.isArray(json.hands) ? json.hands.map((h) => readCards(h, 'Hearts: a hand')) : [[], [], [], []];
  const passes = Array.isArray(json.passes) ? json.passes.map((p) => (p === null ? null : readCards(p, 'Hearts: a pass'))) : [null, null, null, null];
  const results = Array.isArray(json.results)
    ? json.results.map((r) => {
        if (!isJsonObject(r)) throw new Error('Hearts: a hand result is damaged');
        return { points: nums(r.points, 'a result', [0, 0, 0, 0]), moon: typeof r.moon === 'number' ? r.moon : null };
      })
    : [];
  const tricks = Array.isArray(json.tricks) ? json.tricks.map((t) => plays(t, 'a trick')) : [];
  const state: HeartsState = {
    config,
    seed: typeof json.seed === 'string' ? json.seed : 'lesson',
    handNo: typeof json.handNo === 'number' ? json.handNo : 0,
    dealer: typeof json.dealer === 'number' ? json.dealer % SEATS : 3,
    phase: json.phase === 'pass' ? 'pass' : 'play',
    passDir: [0, 1, 2, 3].includes(json.passDir as number) ? (json.passDir as PassDir) : 0,
    hands,
    passes,
    exchanged: json.exchanged !== false,
    trick: plays(json.trick, 'the trick'),
    leader: typeof json.leader === 'number' ? json.leader % SEATS : 0,
    tricks,
    winners: nums(json.winners, 'the winners', tricks.map((t) => trickWinner(t, null))),
    broken: json.broken === true,
    scores: nums(json.scores, 'the scores', [0, 0, 0, 0]),
    results,
    over: json.over === true,
  };
  checkConservation(state);
  return state;
}

/** Every card is in exactly one place: a hand, the trick or a finished trick. */
export function checkConservation(s: Pick<HeartsState, 'hands' | 'trick' | 'tricks'>): void {
  checkWholePack([...s.hands.flat(), ...s.trick.map((p) => p.card), ...s.tricks.flat().map((p) => p.card)], 'Hearts');
}

function stateToJson(s: HeartsState): Json {
  const playsJson = (t: readonly Play[]): Json => t.map((p) => ({ seat: p.seat, card: p.card }));
  return {
    config: configJson(s.config),
    seed: s.seed,
    handNo: s.handNo,
    dealer: s.dealer,
    phase: s.phase,
    passDir: s.passDir,
    hands: s.hands.map((h) => [...h]),
    passes: s.passes.map((p) => (p ? [...p] : null)),
    exchanged: s.exchanged,
    trick: playsJson(s.trick),
    leader: s.leader,
    tricks: s.tricks.map(playsJson),
    winners: [...s.winners],
    broken: s.broken,
    scores: [...s.scores],
    results: s.results.map((r) => ({ points: [...r.points], moon: r.moon })),
    over: s.over,
  };
}

const stateCodec: Codec<HeartsState> = {
  toJSON: stateToJson,
  fromJSON: stateFromJson,
  toText: (s) => stableStringify(stateToJson(s)),
  fromText: (text) => stateFromJson(JSON.parse(text) as Json),
};

const actionCodec: Codec<HeartsAction> = {
  toJSON: (a) => actionText(a),
  fromJSON(json) {
    if (typeof json !== 'string') throw new Error('A Hearts move is stored as text, such as Qs or pass:Qs,Ah,Kh');
    return parseAction(json);
  },
  toText: actionText,
  fromText: (text) => parseAction(text),
};

const configCodec: JsonCodec<HeartsConfig> = { toJSON: configJson, fromJSON: readConfig };

/** Places by score, lowest first; equal scores share a place. */
export function placesOf(scores: readonly number[], lowWins: boolean): number[] {
  return scores.map((x) => 1 + scores.filter((y) => (lowWins ? y < x : y > x)).length);
}

function outcomeOf(s: HeartsState): Outcome | null {
  if (!s.over) return null;
  const places = placesOf(s.scores, true);
  return { reason: 'hearts-score', results: s.scores.map((score, seat) => ({ seat, place: places[seat] ?? 4, score })) };
}

export function viewOf(s: HeartsState, seat: Seat): HeartsView {
  const received = s.exchanged && s.passDir !== 0 ? [...(s.passes[giverTo(seat, s.passDir)] ?? [])] : [];
  return {
    seat,
    config: s.config,
    handNo: s.handNo,
    dealer: s.dealer,
    phase: s.phase,
    passDir: s.passDir,
    hand: [...(s.hands[seat] ?? [])],
    handCounts: s.hands.map((h) => h.length),
    myPass: s.passes[seat] ? [...(s.passes[seat] as Card[])] : null,
    passed: s.passes.map((p) => p !== null),
    exchanged: s.exchanged,
    received,
    trick: s.trick,
    leader: s.leader,
    tricks: s.tricks,
    winners: s.winners,
    broken: s.broken,
    scores: s.scores,
    results: s.results,
    over: s.over,
  };
}

/** The cards a seat knows another seat holds: the cards it passed them, until they are played. */
export function knownHoldings(v: HeartsView): Card[][] {
  const out: Card[][] = [[], [], [], []];
  if (!v.exchanged || v.passDir === 0 || !v.myPass) return out;
  const played = new Set<Card>([...v.tricks.flat().map((p) => p.card), ...v.trick.map((p) => p.card)]);
  out[receiverOf(v.seat, v.passDir)] = v.myPass.filter((c) => !played.has(c));
  return out;
}

/** The cards a seat cannot see in anyone's hand. */
export function unseenCards(v: HeartsView): Card[] {
  const seen = new Set<Card>([...v.hand, ...v.tricks.flat().map((p) => p.card), ...v.trick.map((p) => p.card), ...knownHoldings(v).flat()]);
  return DECK.filter((c) => !seen.has(c));
}

/** A full state consistent with a view: unseen cards dealt to the others, respecting known voids and passed cards. */
export function sampleState(v: HeartsView, rng: Rng): HeartsState {
  const known = knownHoldings(v);
  const need = v.handCounts.map((n, seat) => (seat === v.seat ? 0 : n - (known[seat]?.length ?? 0)));
  const voids = voidsOf(SEATS, [...v.tricks, v.trick]);
  voids[v.seat] = new Set();
  const dealt = dealConsistent(unseenCards(v), need, voids, rng) ?? dealConsistent(unseenCards(v), need, [new Set(), new Set(), new Set(), new Set()], rng);
  if (!dealt) throw new Error('Hearts: no deal agrees with this view');
  const hands = v.handCounts.map((_, seat) => (seat === v.seat ? [...v.hand] : [...(known[seat] ?? []), ...(dealt[seat] ?? [])]));
  // Passes already chosen by others before the exchange: any three of their cards.
  const passes = v.passed.map((p, seat) => {
    if (seat === v.seat) return v.myPass ? [...v.myPass] : null;
    if (!p) return null;
    if (!v.exchanged) return canonical(rng.shuffle(hands[seat] ?? []).slice(0, PASS_COUNT));
    return seat === giverTo(v.seat, v.passDir) ? [...v.received] : [];
  });
  return {
    config: v.config,
    seed: `sample/${rng.int(1_000_000_000)}`,
    handNo: v.handNo,
    dealer: v.dealer,
    phase: v.phase,
    passDir: v.passDir,
    hands,
    passes,
    exchanged: v.exchanged,
    trick: v.trick,
    leader: v.leader,
    tricks: v.tricks,
    winners: v.winners,
    broken: v.broken,
    scores: v.scores,
    results: v.results,
    over: v.over,
  };
}

export const hearts: GameDef<HeartsState, HeartsAction, HeartsConfig, HeartsView, HeartsEvent & GameEvent> = {
  id: 'hearts',
  rulesVersion: 1,
  defaultConfig: STANDARD,
  setup(config, rng) {
    const seed = `hearts/${rng.int(2_147_483_647)}/${rng.int(2_147_483_647)}`;
    if (config.start) {
      const from = stateFromJson(JSON.parse(config.start) as Json);
      return { ...from, config: { ...config, start: undefined }, seed };
    }
    return dealHand(config, seed, 0, 3, [0, 0, 0, 0], []).state;
  },
  seats: () => [0, 1, 2, 3],
  turn: toMove,
  legal: legalActions,
  apply: applyAction,
  outcome: outcomeOf,
  view: viewOf,
  sample: (view, _seat, rng) => sampleState(view, rng),
  codec: { state: stateCodec, action: actionCodec, config: configCodec },
};

/** Which preset a config is, if any. */
export function presetOf(config: HeartsConfig): string | null {
  const key = stableStringify(configJson({ ...config, start: undefined }));
  return Object.entries(PRESETS).find(([, c]) => stableStringify(configJson(c)) === key)?.[0] ?? null;
}

/**
 * A position for lessons and problems; seat 0 is the student. Hands are given for every seat; cards
 * not named are placed in finished tricks (as earlier tricks of the hand) so every position holds
 * all 52 cards.
 */
export function position(p: {
  hands: readonly (readonly Card[])[];
  trick?: readonly Play[];
  leader?: Seat;
  broken?: boolean;
  scores?: readonly number[];
  config?: Partial<HeartsConfig>;
  /** Earlier tricks, in order (each with seats); unnamed cards fill further tricks before these. */
  tricks?: readonly (readonly Play[])[];
  dealer?: Seat;
  /** Who won the earlier tricks made from the unnamed cards (taking their points); they go round the table by default. */
  winner?: Seat;
}): string {
  const named = new Set<Card>([...p.hands.flat(), ...(p.trick ?? []).map((x) => x.card), ...(p.tricks ?? []).flat().map((x) => x.card)]);
  // Unnamed cards go into earlier tricks, four at a time, a suit at a time where they can.
  const restClean = sortHand(DECK.filter((c) => !named.has(c)), ['c', 'd', 's', 'h']);
  const earlier: Play[][] = [];
  for (let k = 0; restClean.length >= 4; k++) {
    // The first card of each trick is the highest of its suit there, so its leader wins it.
    const winner = p.winner ?? k % SEATS;
    earlier.push(restClean.splice(0, 4).map((card, i) => ({ seat: (winner + i) % SEATS, card })));
  }
  if (restClean.length > 0) throw new Error(`Hearts position: ${restClean.length} cards left over`);
  const tricks = [...earlier, ...(p.tricks ?? [])];
  const state: HeartsState = {
    config: { ...STANDARD, target: 0, ...p.config },
    seed: 'lesson',
    handNo: 0,
    dealer: p.dealer ?? 3,
    phase: 'play',
    passDir: 0,
    hands: p.hands.map((h) => [...h]),
    passes: [null, null, null, null],
    exchanged: true,
    trick: [...(p.trick ?? [])],
    leader: p.leader ?? 0,
    tricks,
    winners: tricks.map((t) => trickWinner(t, null)),
    broken: p.broken ?? false,
    scores: p.scores ?? [0, 0, 0, 0],
    results: [],
    over: false,
  };
  checkConservation(state);
  return stateCodec.toText(state);
}
