/**
 * Mahjong for the lesson runner: positions in state notation (`mahjong.codec.state`), moves in
 * action notation (`5p`, `pung`, `chow 6s`, `kong Rd`, `win`, `pass`). A move may be several
 * actions separated by commas ("pass, 7m, pass"), so one scripted reply carries the other
 * players' turns.
 *
 * You always sit in seat 0. A lesson position is one hand of a one-hand game, so it is over when
 * that hand ends. Positions are built with `lessonPosition`: the tiles a lesson names, and the
 * rest dealt from a fixed seed to the other hands, the discards and the wall, every tile in
 * exactly one place.
 *
 * Numbers in lesson text come from `mahjongComputed`: the set and the hand from the rules, every
 * faan value and point from the Hong Kong rules file, every han, fu and payment from the Riichi
 * rules file, and for the position on the table the tiles from ready and useful tiles of each
 * discard (the coach's own calculator), the waits, the tiles you have not seen, the dora, and
 * what a win here would score and collect.
 */
import type { Seat } from '../../../core/contract';
import { findLegal } from '../../../core/contract';
import { createRng } from '../../../core/rng';
import type { LessonGame } from '../../../teach/runner';
import type { MahjongAction, MahjongConfig, MahjongState, MeldSpec, PositionSpec, ReadyMark } from '../rules';
import { actionText, DEFAULT_CONFIG, engine, isRedFive, mahjong, parseTiles, position, STYLES, viewOf } from '../rules';
import { seatWind, setsIn, SEATS } from '../core/engine';
import { bestReading, shanten } from '../core/shanten';
import type { HandScore, StyleOptions, WinContext } from '../core/style';
import type { Kind } from '../core/tiles';
import { codeOf, copiesOf, countsOf, FLOWER_1, isBonus, isDragon, isFlower, isHonour, isSeason, isTerminalOrHonour, isWind, kindOf, parseKind, parseKinds, PLAYING_KINDS, SUIT_KINDS, SUIT_LETTERS, tileSet } from '../core/tiles';
import { basePoints, HK_DEFAULTS, HK_LIMIT_HANDS, HK_OPTIONS, HK_PATTERNS, hkFaan, hkScoreAny, POINT_TABLES } from '../styles/hong-kong';
import { basePoints as riichiBase, COUNTER_VALUE, doraOf, FU, NOTEN_POOL, payments, RIICHI_DEFAULTS, RIICHI_TARGET, STAKE, YAKU_HAN } from '../styles/riichi';
import { CO_BASE, CO_DEFAULTS, CO_PATTERNS, coFan, withoutFlowers } from '../styles/chinese-official';
import { evaluateDiscards, handShanten, picture, readyInfo } from '../strategy';
import { kindName, runName, seatName, windName } from '../ui/names';

export const STUDENT: Seat = 0;
/** Separates the actions of a move that carries several. */
export const SEP = ', ';

/** The lessons written for every style: no flowers, any complete hand wins, a one-hand game. */
export const BASIC: StyleOptions = { flowers: 'off', minFaan: 0, length: 'hand' };
/** The Hong Kong track: the default table (three faan to win, flowers), a one-hand game. */
export const HK: StyleOptions = { length: 'hand' };
/** The Riichi track: the common online table (red fives, open tanyao), a one-hand game. */
export const RIICHI: StyleOptions = { length: 'hand' };
/** The Chinese Official track: the official table (eight points, flowers), a one-hand game. */
export const CO: StyleOptions = { length: 'hand' };

/** A tile's name from its code: "5 dots", "Red dragon". */
export function nameOf(code: string): string {
  const k = parseKind(code);
  if (k === null) throw new Error(`Mahjong lesson: no tile ${code}`);
  return kindName(k);
}

/** A run's name from its lowest tile: "6-7-8 bamboo". */
export function runOf(code: string): string {
  const k = parseKind(code);
  if (k === null) throw new Error(`Mahjong lesson: no tile ${code}`);
  return runName(k);
}

export interface LessonSpec {
  /** Your concealed tiles, such as "123m 456p 789s EE Rd". Fourteen less three for each meld when it is your turn. */
  readonly hand: string;
  /** The tile you have just drawn (one of `hand`). */
  readonly drawn?: string;
  /** Melds by seat. */
  readonly melds?: readonly (readonly MeldSpec[])[];
  /** Other hands by seat; those left out are dealt from the seed. */
  readonly hands?: readonly (string | null | undefined)[];
  /** Discards by seat; those left out are dealt from the seed (`turns` each). */
  readonly discards?: readonly (string | null | undefined)[];
  /** Bonus tiles by seat, with flowers on; the seats left out (undefined) share the rest. */
  readonly bonus?: readonly (string | undefined)[];
  readonly options?: StyleOptions;
  readonly dealer?: Seat;
  readonly round?: number;
  /** The next tiles to be drawn from the wall, in order. */
  readonly front?: string;
  /** How many tiles each player has thrown, for discards dealt from the seed. */
  readonly turns?: number;
  /** Kinds the other hands hold at most one of (so nobody else can call them). */
  readonly avoid?: string;
  /** Another player throws this tile at once, so the lesson starts on a claim. */
  readonly offer?: { readonly seat: Seat; readonly tile: string };
  /** The seed for the dealt tiles. A seed starting "safety" marks a safe-tile question for the verifier. */
  readonly seed?: string;
  readonly scores?: readonly number[];
  /** The rules family (a style id): Hong Kong unless it says otherwise. */
  readonly style?: string;
  /** Riichi: the dora indicators turned up (one by default; the rest are dealt from the seed). */
  readonly indicators?: string;
  /** Riichi: the tiles under the indicators (ura dora). */
  readonly under?: string;
  /** Riichi: the seats that have declared, each with the index of its riichi throw in its discards. Each has paid its stake. */
  readonly ready?: readonly (Partial<ReadyMark> | null | undefined)[];
  readonly counter?: number;
}

/** Builds a lesson position (in notation) from the tiles a lesson names; the rest is dealt from the seed. */
export function lessonPosition(spec: LessonSpec): string {
  return mahjong.codec.state.toText(lessonState(spec));
}

export function lessonState(spec: LessonSpec): MahjongState {
  for (let attempt = 0; attempt < 100; attempt++) {
    const state = dealLesson(spec, attempt);
    // A throw on offer must be yours alone to take: when you pass, nobody else may call it.
    if (!spec.offer) return state;
    if (state.turn === STUDENT && state.phase === 'claim' && engine.apply(state, { type: 'pass' }).state.phase !== 'claim') return state;
  }
  throw new Error(`Mahjong lesson ${spec.seed ?? ''}: no deal leaves the throw to you alone`);
}

function dealLesson(spec: LessonSpec, attempt: number): MahjongState {
  const styleId = spec.style ?? 'hong-kong';
  const options: StyleOptions = { ...(STYLES[styleId]?.defaults ?? HK_DEFAULTS), ...spec.options };
  const config: MahjongConfig = { style: styleId, options };
  const rules = engine.rules(config);
  const left = new Array<number>(PLAYING_KINDS).fill(0);
  for (const t of tileSet(rules.tiles)) {
    const k = kindOf(t);
    if (k < PLAYING_KINDS) left[k] = (left[k] ?? 0) + 1;
  }
  const take = (text: string | null | undefined) => {
    // Written as a position writes them: "0p" is the red five.
    for (const k of text ? parseTiles(text).map((x) => x.kind) : []) {
      if (isBonus(k)) continue;
      if ((left[k] ?? 0) <= 0) throw new Error(`Mahjong lesson: no ${codeOf(k)} left for "${text ?? ''}"`);
      left[k] = (left[k] ?? 0) - 1;
    }
  };
  take(spec.hand);
  for (const list of spec.melds ?? []) for (const m of list) take(m.tiles);
  for (const h of spec.hands ?? []) take(h);
  for (const d of spec.discards ?? []) take(d);
  take(spec.front);
  take(spec.indicators);
  take(spec.under);
  if (spec.offer) take(spec.offer.tile);

  const rng = createRng(`mahjong-lesson/${spec.seed ?? 'lesson'}${attempt > 0 ? `/${attempt}` : ''}`);
  const avoid = new Set(spec.avoid ? parseKinds(spec.avoid) : []);
  const pool = () => {
    const out: Kind[] = [];
    left.forEach((n, k) => {
      for (let i = 0; i < n; i++) out.push(k);
    });
    return out;
  };
  const remove = (kinds: readonly Kind[]) => {
    for (const k of kinds) left[k] = (left[k] ?? 0) - 1;
  };
  const shapes = { shapes: rules.shapes, sets: setsIn(rules) };

  // Other hands: no three alike, at most one of the kinds to avoid, and never close to winning.
  const hands: string[] = [spec.hand, '', '', ''];
  for (let seat = 1; seat < SEATS; seat++) {
    const named = spec.hands?.[seat];
    if (named) {
      hands[seat] = named;
      continue;
    }
    const need = rules.handSize - 3 * (spec.melds?.[seat]?.length ?? 0);
    let chosen: Kind[] = [];
    for (let tries = 0; tries < 200; tries++) {
      const counts = new Array<number>(PLAYING_KINDS).fill(0);
      chosen = [];
      for (const k of rng.shuffle(pool())) {
        if (chosen.length >= need) break;
        if ((counts[k] ?? 0) >= 2 || (avoid.has(k) && (counts[k] ?? 0) >= 1)) continue;
        counts[k] = (counts[k] ?? 0) + 1;
        chosen.push(k);
      }
      if (chosen.length === need && shanten(counts, spec.melds?.[seat]?.length ?? 0, shapes) >= 2) break;
    }
    remove(chosen);
    hands[seat] = codesOf(chosen);
  }
  if (spec.offer) hands[spec.offer.seat] = `${hands[spec.offer.seat] ?? ''} ${spec.offer.tile}`.trim();

  // Discards: mostly honours and terminals, as early discards are.
  const discards: string[] = ['', '', '', ''];
  for (let seat = 0; seat < SEATS; seat++) {
    const named = spec.discards?.[seat];
    if (named !== undefined && named !== null) {
      discards[seat] = named;
      continue;
    }
    const n = spec.turns ?? 3;
    const kinds = rng.shuffle(pool()).sort((a, b) => Number(isTerminalOrHonour(b)) - Number(isTerminalOrHonour(a)));
    const picked: Kind[] = [];
    for (const k of kinds) {
      if (picked.length >= n) break;
      if (avoid.has(k) || picked.includes(k)) continue;
      picked.push(k);
    }
    remove(picked);
    discards[seat] = codesOf(picked);
  }

  // Bonus tiles: those a lesson names, the rest shared among the other seats it leaves out.
  let bonus: string[] | null = null;
  const given = spec.bonus;
  if (given && options.flowers === 'on') {
    const named = given.flatMap((b) => (b ? parseKinds(b) : []));
    const rest = Array.from({ length: 8 }, (_, i) => FLOWER_1 + i).filter((k) => !named.includes(k));
    const left = [1, 2, 3].filter((seat) => given[seat] === undefined);
    const open = left.length > 0 ? left : [1, 2, 3];
    const out = [0, 1, 2, 3].map((seat) => given[seat] ?? '');
    rest.forEach((k, i) => {
      const seat = open[i % Math.max(1, open.length)] ?? 0;
      out[seat] = `${out[seat] ?? ''} ${codeOf(k)}`.trim();
    });
    bonus = out;
  }

  let p: PositionSpec = {
    options,
    dealer: spec.dealer ?? 0,
    round: spec.round ?? 0,
    turn: spec.offer ? spec.offer.seat : STUDENT,
    hands,
    ...(spec.melds ? { melds: spec.melds } : {}),
    discards,
    ...(bonus ? { bonus } : {}),
    ...(spec.front ? { front: spec.front } : {}),
    ...(spec.offer ? { drawn: spec.offer.tile } : spec.drawn ? { drawn: spec.drawn } : {}),
    ...(spec.scores ? { scores: spec.scores } : {}),
    ...(spec.style ? { style: spec.style } : {}),
    ...(spec.indicators ? { indicators: spec.indicators } : {}),
    ...(spec.under ? { under: spec.under } : {}),
    ...(spec.counter ? { counter: spec.counter } : {}),
  };
  if (spec.ready) {
    // Each seat that declared has paid its stake to the table.
    const start = rules.startScore ?? 0;
    const declared = [0, 1, 2, 3].map((seat) => spec.ready?.[seat] ?? null);
    p = { ...p, ready: declared, stakes: declared.filter(Boolean).length, scores: spec.scores ?? declared.map((r) => (r ? start - (rules.ready?.stake ?? 0) : start)) };
  }
  let state: MahjongState = { ...position(p), seed: spec.seed ?? 'lesson' };
  if (spec.offer) {
    const kind = parseKind(spec.offer.tile);
    if (kind === null) throw new Error(`Mahjong lesson: no tile ${spec.offer.tile}`);
    state = engine.apply(state, { type: 'discard', tile: kind }).state;
  }
  return state;
}

const codesOf = (kinds: readonly Kind[]): string => kinds.map(codeOf).join(' ');

function parse(state: MahjongState, move: string): MahjongAction | null {
  const seat = mahjong.turn(state);
  if (seat === null || over(state)) return null;
  try {
    return findLegal(mahjong, state, seat, mahjong.codec.action.fromText(move)) ?? null;
  } catch {
    return null;
  }
}

/** Plays one or more actions; null if any is not legal. */
function playAll(state: MahjongState, moves: string): { state: MahjongState; canonical: string[] } | null {
  let s = state;
  const canonical: string[] = [];
  const list = moves.split(',').map((m) => m.trim()).filter(Boolean);
  if (list.length === 0) return null;
  for (const move of list) {
    const action = parse(s, move);
    if (!action) return null;
    canonical.push(actionText(action));
    s = mahjong.apply(s, action).state;
  }
  return { state: s, canonical };
}

/** Plays actions in notation from a position in notation (for building later lesson positions). */
export function after(start: string, moves: string): string {
  const s = playAll(mahjong.codec.state.fromText(start), moves);
  if (!s) throw new Error(`Mahjong lesson: "${moves}" is not legal here`);
  return mahjong.codec.state.toText(s.state);
}

/**
 * The other players' turns after a move, until it is your turn again or the hand ends: each
 * passes every call, and throws the next tile of `throws` (or the tile it drew).
 */
export function othersPlay(start: string, throws: readonly string[] = []): string {
  let s = mahjong.codec.state.fromText(start);
  const moves: string[] = [];
  const queue = [...throws];
  for (let guard = 0; guard < 40; guard++) {
    if (over(s) || mahjong.turn(s) === STUDENT) break;
    const seat = mahjong.turn(s) ?? 0;
    let action: MahjongAction;
    if (s.phase === 'claim' || s.phase === 'rob') action = { type: 'pass' };
    else {
      const next = queue.shift();
      const kind = next ? parseKind(next) : s.drawn ? kindOf(s.drawn) : null;
      const legal = mahjong.legal(s, seat);
      const found = legal.find((a) => a.type === 'discard' && a.tile === kind) ?? legal.find((a) => a.type === 'discard');
      if (!found) throw new Error('Mahjong lesson: a player has nothing to throw');
      action = found;
    }
    moves.push(actionText(action));
    s = mahjong.apply(s, action).state;
  }
  return moves.join(SEP);
}

const over = (s: MahjongState): boolean => s.over || s.phase === 'scored';

// Numbers for lesson text

/** Numbers that do not depend on the position: the set, the hand, the faan table, points and payments. */
const FIXED: Readonly<Record<string, number | string>> = (() => {
  const out: Record<string, number | string> = {};
  const full = engine.rules(DEFAULT_CONFIG);
  const plain = engine.rules({ style: 'hong-kong', options: { ...HK_DEFAULTS, flowers: 'off' } });
  const kinds = Array.from({ length: 42 }, (_, k) => k);
  const copies = copiesOf(full.tiles, 0);
  out['set:tiles'] = tileSet(full.tiles).length;
  out['set:plain'] = tileSet(plain.tiles).length;
  out['set:kinds'] = PLAYING_KINDS;
  out['set:copies'] = copies;
  out['set:suits'] = SUIT_LETTERS.length;
  out['set:ranks'] = SUIT_KINDS / SUIT_LETTERS.length;
  out['set:suited'] = SUIT_KINDS * copies;
  out['set:winds'] = kinds.filter(isWind).length;
  out['set:dragons'] = kinds.filter(isDragon).length;
  out['set:honour-kinds'] = kinds.filter(isHonour).length;
  out['set:honours'] = kinds.filter(isHonour).length * copies;
  out['set:bonus'] = kinds.filter(isBonus).length;
  out['set:flowers'] = kinds.filter(isFlower).length;
  out['set:seasons'] = kinds.filter(isSeason).length;
  out['seats'] = SEATS;
  const hand = full.handSize;
  const sets = setsIn(full);
  out['hand:size'] = hand;
  out['hand:sets'] = sets;
  out['win:tiles'] = hand + 1;
  out['set:size'] = (hand + 1 - 2) / sets;
  out['pair:size'] = hand + 1 - 3 * sets;
  out['kong:size'] = copies;
  out['deal:dealer'] = hand + 1;
  out['wall:stacks'] = tileSet(full.tiles).length / SEATS / 2;
  out['wall:stacks:plain'] = tileSet(plain.tiles).length / SEATS / 2;
  // The Hong Kong table.
  const o = HK_DEFAULTS;
  out['hk:min'] = Number(o.minFaan);
  out['hk:limit'] = Number(o.limit);
  for (const id of HK_PATTERNS) out[`faan:${id}`] = hkFaan(id, o);
  for (const id of HK_LIMIT_HANDS) out[`faan:${id}`] = hkFaan(id, o);
  // Every value a numeric option may take, in the order the rules file lists them.
  for (const spec of HK_OPTIONS) spec.values.forEach((v, i) => typeof v === 'number' && (out[`opt:${spec.key}:${i}`] = v));
  for (let f = 0; f <= 13; f++) {
    out[`points:${f}`] = basePoints(f, 'half-spicy');
    out[`points:full:${f}`] = basePoints(f, 'full-spicy');
    out[`points:old:${f}`] = basePoints(f, 'old-style');
  }
  out['points:tables'] = Object.keys(POINT_TABLES).length;
  const pay = engine.style(DEFAULT_CONFIG).hints({ seatWind: 0, prevailingWind: 0, bonus: [] }, o).pay;
  const full_ = engine.style(DEFAULT_CONFIG).hints({ seatWind: 0, prevailingWind: 0, bonus: [] }, { ...o, discardPays: 'full-gun' }).pay;
  out['pay:self'] = pay.selfDrawn;
  out['pay:discarder'] = pay.discarder;
  out['pay:others'] = pay.others;
  out['pay:full'] = full_.discarder;
  out['pay:self:total'] = pay.selfDrawn * (SEATS - 1);
  out['pay:discard:total'] = pay.discarder + pay.others * (SEATS - 2);
  Object.assign(out, riichiFixed());
  Object.assign(out, coFixed());
  return out;
})();

/** The Chinese Official table: the set, the minimum, the base every player pays, the game's length and each pattern's points. */
function coFixed(): Record<string, number> {
  const out: Record<string, number> = {};
  const config: MahjongConfig = { style: 'chinese-official', options: CO_DEFAULTS };
  const rules = engine.rules(config);
  out['co:tiles'] = tileSet(rules.tiles).length;
  out['co:min'] = Number(CO_DEFAULTS.minPoints);
  out['co:base'] = CO_BASE;
  out['co:hands'] = rules.rounds * rules.handsPerRound;
  out['co:round'] = rules.handsPerRound;
  out['co:patterns'] = CO_PATTERNS.length;
  for (const id of CO_PATTERNS) out[`pts:${id.replace(/^co-/, '')}`] = coFan(id, CO_DEFAULTS);
  return out;
}

/** The Riichi table: the set, the sticks, each yaku's han, the fu, the bands and the payment table. */
function riichiFixed(): Record<string, number> {
  const out: Record<string, number> = {};
  const o = RIICHI_DEFAULTS;
  const config: MahjongConfig = { style: 'riichi', options: o };
  const rules = engine.rules(config);
  out['riichi:tiles'] = tileSet(rules.tiles).length;
  out['riichi:red'] = Number(o.red);
  out['riichi:start'] = Number(o.start);
  out['riichi:target'] = RIICHI_TARGET;
  out['riichi:stake'] = STAKE;
  out['riichi:honba'] = COUNTER_VALUE;
  out['riichi:noten'] = NOTEN_POOL;
  out['riichi:min-left'] = rules.ready?.minLeft ?? 0;
  out['riichi:indicators'] = (rules.indicators ?? 0) * 2;
  out['riichi:dead-wall'] = rules.deadWall + (rules.indicators ?? 0) * 2;
  for (const [id, [closed, open]] of Object.entries(YAKU_HAN)) {
    out[`han:${id}`] = closed;
    out[`han:open:${id}`] = open;
  }
  out['fu:base'] = FU.base;
  out['fu:closed-ron'] = FU.closedRon;
  out['fu:self-drawn'] = FU.selfDrawn;
  out['fu:pung'] = FU.pung;
  out['fu:pung:terminal'] = FU.pung * 2;
  out['fu:pung:concealed'] = FU.pung * 2;
  out['fu:pung:concealed-terminal'] = FU.pung * 4;
  out['fu:kong:concealed-terminal'] = FU.pung * 16;
  out['fu:value-pair'] = FU.valuePair;
  out['fu:wait'] = FU.wait;
  out['fu:seven-pairs'] = FU.sevenPairs;
  out['fu:open-minimum'] = FU.openMinimum;
  out['fu:pinfu-self-drawn'] = FU.pinfuSelfDrawn;
  out['fu:pinfu-ron'] = FU.pinfuRon;
  // The column of the payment table most hands with runs land in.
  out['fu:usual'] = FU.openMinimum;
  // The bands: the han each starts at (whatever the fu), and its base.
  for (const name of ['mangan', 'haneman', 'baiman', 'sanbaiman', 'kazoe']) {
    for (let han = 1; han <= 13; han++) {
      const b = riichiBase(han, FU.base, o);
      if (b.band === name) {
        out[`band:${name}:han`] = han;
        out[`band:${name}:base`] = b.base;
        out[`band:${name}:ron`] = payments(b.base, false).ron;
        out[`band:${name}:ron:dealer`] = payments(b.base, true).ron;
        break;
      }
    }
  }
  // The payment table: han by fu, on a discard and self-drawn, for the dealer and the others.
  for (let han = 1; han <= 4; han++) {
    for (const fu of [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110]) {
      const { base } = riichiBase(han, fu, o);
      const other = payments(base, false);
      const dealer = payments(base, true);
      out[`base:${han}:${fu}`] = fu * 2 ** (han + 2);
      out[`ron:${han}:${fu}`] = other.ron;
      out[`ron:dealer:${han}:${fu}`] = dealer.ron;
      out[`tsumo:${han}:${fu}:dealer-pays`] = other.tsumoDealer;
      out[`tsumo:${han}:${fu}:others-pay`] = other.tsumoOther;
      out[`tsumo:dealer:${han}:${fu}`] = dealer.tsumoOther;
    }
  }
  // Each payment as a multiple of the base.
  out['pay:ron'] = payments(1000, false).ron / 1000;
  out['pay:ron:dealer'] = payments(1000, true).ron / 1000;
  out['pay:tsumo:dealer-pays'] = payments(1000, false).tsumoDealer / 1000;
  out['pay:tsumo:others-pay'] = payments(1000, false).tsumoOther / 1000;
  out['pay:tsumo:dealer'] = payments(1000, true).tsumoOther / 1000;
  return out;
}

/** "a or b", "a, b or c". */
function orList(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} or ${items[items.length - 1] ?? ''}`;
}

/** "a and b", "a, b and c". */
export function andList(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1] ?? ''}`;
}

const CACHE = new Map<string, Readonly<Record<string, number | string>>>();

export function mahjongComputed(state: MahjongState): Readonly<Record<string, number | string>> {
  const key = mahjong.codec.state.toText(state);
  const hit = CACHE.get(key);
  if (hit) return hit;
  const out = computeAll(state);
  if (CACHE.size > 500) CACHE.clear();
  CACHE.set(key, out);
  return out;
}

/** The score of the win open to you now, whatever the minimum, with how it is won; null if none. */
export function winOnOffer(state: MahjongState): { score: HandScore; selfDrawn: boolean; from: Seat | null; tile: Kind } | null {
  const o = state.config.options;
  const r = engine.rules(state.config);
  const style = engine.style(state.config);
  const scoreAny = (ctx: WinContext, options: StyleOptions) => (style.scoreAny ? style.scoreAny(ctx, options) : hkScoreAny(ctx, options));
  if (state.phase === 'act' && state.turn === STUDENT && state.drawn !== null && !state.claimed) {
    const ctx = engine.winContext(state, STUDENT, state.drawn, true, null, false);
    const score = scoreAny(ctx, o);
    return score ? { score, selfDrawn: true, from: null, tile: kindOf(state.drawn) } : null;
  }
  const w = state.claim;
  if ((state.phase === 'claim' || state.phase === 'rob') && w && state.turn === STUDENT) {
    const ctx = engine.winContext(state, STUDENT, w.tile, false, w.from, w.kind === 'rob');
    if (ctx.concealed.length + 3 * ctx.melds.length !== r.handSize + 1) return null;
    const score = scoreAny(ctx, o);
    return score ? { score, selfDrawn: false, from: w.from, tile: kindOf(w.tile) } : null;
  }
  return null;
}

function computeAll(state: MahjongState): Record<string, number | string> {
  const out: Record<string, number | string> = { ...FIXED };
  const o = state.config.options;
  const r = engine.rules(state.config);
  const view = viewOf(state, STUDENT);
  const p = picture(view);
  const mine = state.hands[STUDENT] ?? [];
  const melds = state.melds[STUDENT] ?? [];
  out['wall:left'] = state.wall.length;
  out['hand:tiles'] = mine.length;
  out['melds'] = melds.length;
  out['wind:seat'] = windName(seatWind(STUDENT, state.dealer));
  out['wind:round'] = windName(state.round);
  out['flower:seat'] = seatWind(STUDENT, state.dealer) + 1;
  const riichi = state.config.style === 'riichi';
  const co = state.config.style === 'chinese-official';
  if (co) out['min'] = Number(o.minPoints);
  else if (!riichi) {
    out['min'] = Number(o.minFaan);
    out['limit'] = Number(o.limit);
  }
  out['bonus:mine'] = (state.bonus[STUDENT] ?? []).length;
  out['bonus:faan'] = p.hints.bonus;
  for (let k = 0; k < PLAYING_KINDS; k++) out[`unseen:${codeOf(k)}`] = p.unseen[k] ?? 0;
  if (state.claim) {
    out['claim:from'] = seatName(state.claim.from, STUDENT);
    out['claim:tile'] = kindName(kindOf(state.claim.tile));
  }
  if (riichi && state.indicators) {
    // The dora: what each indicator turned up points to, and how many your tiles hold.
    const shown = state.indicators.tiles.slice(0, state.indicators.shown).map(kindOf);
    const mineAll = [...mine, ...melds.flatMap((m) => m.tiles)];
    out['indicator:names'] = andList(shown.map(kindName));
    out['dora:names'] = andList(shown.map((k) => kindName(doraOf(k))));
    out['hand:dora'] = shown.reduce((n, k) => n + mineAll.filter((t) => kindOf(t) === doraOf(k)).length, 0);
    out['hand:red'] = mineAll.filter((t) => isRedFive(t, (r.tiles.red ?? 0) > 0)).length;
    out['hand:dora:all'] = Number(out['hand:dora']) + Number(out['hand:red']);
    out['furiten'] = engine.furiten(state, STUDENT) ? 1 : 0;
    out['sticks'] = state.stakes;
    out['honba'] = state.counter;
  }

  const counts = countsOf(mine);
  const n = mine.length;
  if (n % 3 === 2) {
    // Your turn: every discard, judged as the coach judges it.
    const evals = evaluateDiscards(p);
    const fastest = Math.min(...evals.map((e) => e.shanten));
    const most = Math.max(...evals.filter((e) => e.shanten === fastest).map((e) => e.accept));
    for (const e of evals) {
      const code = codeOf(e.kind);
      out[`accept:${code}`] = e.accept;
      out[`shanten:${code}`] = e.shanten;
      out[`useful:${code}`] = e.useful.length;
      if (e.ready) {
        out[`waits:${code}`] = e.ready.waits.length;
        out[`waits:left:${code}`] = e.ready.waits.reduce((a, w) => a + w.left, 0);
        out[`waits:names:${code}`] = orList(e.ready.waits.map((w) => kindName(w.kind)));
      }
    }
    const best = evals.filter((e) => e.shanten === fastest && e.accept === most).map((e) => e.kind);
    out['shanten'] = fastest;
    out['shanten:now'] = handShanten(p);
    out['accept:best'] = most;
    out['best:names'] = orList(best.map(kindName));
  } else {
    // Waiting for a tile: how far from ready, and what would win.
    const s = shanten(counts, melds.length, p.shapes);
    out['shanten'] = s;
    out['shanten:now'] = s;
    const reading = bestReading(counts, setsIn(r) - melds.length);
    out['reading:sets'] = reading.sets.length;
    out['reading:partials'] = reading.partials.length;
    out['reading:pair'] = reading.pair === null ? 0 : 1;
    out['reading:loose'] = reading.loose.length;
    if (s === 0) {
      const ready = readyInfo(p, counts);
      out['waits:kinds'] = ready.waits.length;
      out['waits:left'] = ready.waits.reduce((a, w) => a + w.left, 0);
      out['waits:names'] = orList(ready.waits.map((w) => kindName(w.kind)));
    }
  }

  // A win on offer now: what it scores and collects.
  const win = winOnOffer(state);
  if (win) {
    const { score } = win;
    if (riichi) {
      const doraIds = ['dora', 'aka-dora', 'ura-dora'];
      out['win:han'] = score.total;
      out['win:fu'] = score.fu ?? 0;
      out['win:yaku'] = score.lines.filter((l) => !doraIds.includes(l.id)).length;
      out['win:dora'] = score.lines.filter((l) => doraIds.includes(l.id)).reduce((n, l) => n + l.value, 0);
    }
    out['win:faan'] = score.total;
    out['win:raw'] = score.raw;
    out['win:base'] = score.base;
    out['win:lines'] = score.lines.length;
    if (co) {
      // Flowers add to what is paid but never toward the minimum.
      out['win:flowerless'] = withoutFlowers(score);
      out['win:ok'] = withoutFlowers(score) >= Number(o.minPoints) ? 1 : 0;
      out['win:short'] = Math.max(0, Number(o.minPoints) - withoutFlowers(score));
    } else if (!riichi) {
      out['win:ok'] = score.total >= Number(o.minFaan) ? 1 : 0;
      out['win:short'] = Math.max(0, Number(o.minFaan) - score.total);
    }
    for (const line of score.lines) out[`win:line:${line.id}`] = line.value;
    const deltas = engine.style(state.config).settle({ wins: [{ seat: STUDENT, from: win.from, tile: mine[0] ?? '1m.0', score, robbed: false }], dealer: state.dealer, seats: SEATS, counter: state.counter, stakes: state.stakes }, o);
    out['win:total'] = deltas[STUDENT] ?? 0;
    for (let seat = 1; seat < SEATS; seat++) out[`win:pay:${seat}`] = -(deltas[seat] ?? 0);
    if (win.from !== null) {
      out['win:discarder'] = -(deltas[win.from] ?? 0);
      const other = [1, 2, 3].find((x) => x !== win.from) ?? 1;
      out['win:other'] = -(deltas[other] ?? 0);
    } else out['win:each'] = -(deltas[1] ?? 0);
  }

  // A finished hand.
  const last = state.results[state.results.length - 1];
  if (last) {
    const w = last.wins[0];
    if (w) {
      out['result:faan'] = w.score.total;
      out['result:base'] = w.score.base;
    }
    out['result:you'] = last.deltas[STUDENT] ?? 0;
    last.deltas.forEach((d, seat) => (out[`result:${seat}`] = d));
  }
  return out;
}

/** Tile names and codes are notation, not typed numbers: "5 dots", "6-7-8 bamboo", "3 and 4 bamboo", "5D", "5p", "Orchid (flower 2)". */
export function stripMahjongNotation(text: string): string {
  return text
    .replace(/\b[1-9]\s+(?:and|or)\s+[1-9]\s+(?:dots|bamboo|characters)\b/g, ' ')
    .replace(/\b[1-9](?:-[1-9]){0,3}\s+(?:dots|bamboo|characters)\b/g, ' ')
    .replace(/\((?:flower|season)\s[1-4]\)/g, ' ')
    .replace(/\b(?:flower|season)\s[1-4]\b/gi, ' ')
    .replace(/\b[1-9]{1,4}[mps]\b/g, ' ')
    .replace(/\b[1-9][CDB]\b/g, ' ')
    .replace(/\b[FS][1-4]\b/g, ' ');
}

export const mahjongLessonGame: LessonGame<MahjongState> = {
  position: (text) => mahjong.codec.state.fromText(text),
  notation: (state) => mahjong.codec.state.toText(state),
  play(state, move) {
    return playAll(state, move)?.state ?? null;
  },
  canonical(state, move) {
    return playAll(state, move)?.canonical.join(SEP) ?? null;
  },
  goalMet(goal, before, after) {
    if (goal !== 'win') return false;
    const result = after.results[before.results.length];
    return result !== undefined && result.wins.some((w) => w.seat === STUDENT);
  },
  toMove: (state) => (over(state) ? null : mahjong.turn(state)),
  over,
  moves(state) {
    const seat = mahjong.turn(state);
    return seat === null || over(state) ? [] : mahjong.legal(state, seat).map(actionText);
  },
  computed: mahjongComputed,
  stripNotation: stripMahjongNotation,
};
