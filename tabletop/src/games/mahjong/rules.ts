/**
 * Mahjong behind the game contract (PLAN.md 2.3): the shared engine (core/) with a rules file
 * per style (styles/). Milestone 9 plays Hong Kong Old Style (docs/rules/mahjong-hk.md).
 *
 * Hidden information: a seat's view holds its own hand and drawn tile, every meld, discard and
 * bonus tile, how many tiles each hand and the wall hold, the scores and past hands, and its own
 * options when it is to act. It never holds another hand, the wall, the choices other seats have
 * made in an open claim window (nor who else is being asked), or the seed.
 */
import type { Codec, GameDef, GameEvent, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject, stableStringify } from '../../core/json';
import type { Rng } from '../../core/rng';
import type { ClaimWindow, Declaration, Discard, HandResult, IndicatorStacks, MahjongAction, MahjongConfig, MahjongEvent, MahjongState, PassState, Phase, ReadyMark } from './core/engine';
import { MahjongEngine, SEATS } from './core/engine';
import type { DrawReason, HandScore, Meld, Payment, ScoreLine, Style, StyleOptions, WinRecord } from './core/style';
import { readOptions } from './core/style';
import type { Kind, TileId } from './core/tiles';
import { codeOf, isTileId, kindOf, parseKind, parseKinds, tileId, tileSet } from './core/tiles';
import { HK_DEFAULTS, hongKong } from './styles/hong-kong';
import { riichi } from './styles/riichi';
import { sichuan } from './styles/sichuan';

export type { ClaimWindow, Declaration, Discard, HandResult, IndicatorStacks, MahjongAction, MahjongConfig, MahjongEvent, MahjongState, PassState, Phase, ReadyMark } from './core/engine';

export const STYLES: Readonly<Record<string, Style>> = { 'hong-kong': hongKong, riichi, sichuan };
export const engine = new MahjongEngine(STYLES);

export const DEFAULT_CONFIG: MahjongConfig = { style: 'hong-kong', options: HK_DEFAULTS };

export interface MahjongView {
  readonly seat: Seat;
  readonly config: MahjongConfig;
  readonly table: number;
  readonly handNo: number;
  readonly round: number;
  readonly dealer: Seat;
  readonly passes: number;
  readonly repeats: number;
  readonly scores: readonly number[];
  readonly results: readonly HandResult[];
  readonly hand: readonly TileId[];
  /** Your drawn tile, when you are to act on it. */
  readonly drawn: TileId | null;
  readonly handCounts: readonly number[];
  readonly melds: readonly (readonly Meld[])[];
  readonly discards: readonly (readonly Discard[])[];
  readonly bonus: readonly (readonly TileId[])[];
  readonly wall: number;
  readonly phase: Phase;
  /** The seat to act when everyone can see it; in a claim window, only yourself when you are asked. */
  readonly turn: Seat | null;
  /** The tile on offer in a claim window, and who offered it. */
  readonly claim: { readonly kind: 'discard' | 'rob'; readonly tile: TileId; readonly from: Seat; readonly last: boolean } | null;
  readonly source: MahjongState['source'];
  readonly kongs: number;
  readonly claimed: boolean;
  readonly calls: number;
  readonly lastDiscard: TileId | null;
  /** What you may do now (empty when it is not your turn). */
  readonly options: readonly MahjongAction[];
  readonly over: boolean;
  /** Indicators turned up (styles with indicators). */
  readonly indicators: readonly TileId[];
  /** Every seat's ready declaration (public). */
  readonly ready: readonly (ReadyMark | null)[];
  readonly stakes: number;
  readonly counter: number;
  /** Your own furiten from a passed win (null when none). */
  readonly missed: 'turn' | 'hand' | null;
  /** Void suits: your own once chosen, the others once everyone has chosen. */
  readonly voids: readonly (number | null)[];
  /** Wins so far in a hand that goes on after a win. */
  readonly won: readonly WinRecord[];
  /** The hands laid down face up by seats that have won (null for seats still playing). */
  readonly shown: readonly (readonly TileId[] | null)[];
  /** Each seat's gain or loss so far this hand, and the payments behind it. */
  readonly paid: readonly number[];
  readonly ledger: readonly Payment[];
  /** A passing round under way: which, by the dice which way, and your own choice so far. */
  readonly passing: { readonly round: number; readonly dice: number; readonly voting: boolean; readonly mine: readonly Kind[] | null; readonly blind: number; readonly vote: boolean | null } | null;
  /** The tiles you received in the last pass. */
  readonly received: readonly TileId[];
}

export function viewOf(s: MahjongState, seat: Seat): MahjongView {
  const mine = s.turn === seat && !s.over;
  // Choices in a claim window, a passing round or the void declaration are made in secret.
  const hidden = s.phase === 'claim' || s.phase === 'rob' || s.phase === 'pass' || s.phase === 'void';
  return {
    seat,
    config: s.config,
    table: s.table,
    handNo: s.handNo,
    round: s.round,
    dealer: s.dealer,
    passes: s.passes,
    repeats: s.repeats,
    scores: s.scores,
    results: s.results,
    hand: [...(s.hands[seat] ?? [])],
    drawn: mine && s.phase === 'act' ? s.drawn : null,
    handCounts: s.hands.map((h) => h.length),
    melds: s.melds,
    discards: s.discards,
    bonus: s.bonus,
    wall: s.wall.length,
    phase: s.phase,
    turn: s.over ? null : hidden ? (mine ? seat : null) : s.turn,
    claim: s.claim ? { kind: s.claim.kind, tile: s.claim.tile, from: s.claim.from, last: s.claim.last } : null,
    source: s.source,
    kongs: s.kongs,
    claimed: s.claimed,
    calls: s.calls,
    lastDiscard: s.lastDiscard,
    options: mine ? engine.legal(s, seat) : [],
    over: s.over,
    indicators: s.indicators ? s.indicators.tiles.slice(0, s.indicators.shown) : [],
    ready: s.ready,
    stakes: s.stakes,
    counter: s.counter,
    missed: s.missed[seat] ?? null,
    voids: s.voids.map((v, i) => (i === seat || s.phase !== 'void' ? v : null)),
    won: s.won,
    shown: s.hands.map((h, i) => (i !== seat && engine.isOut(s, i) ? [...h] : null)),
    paid: s.paid,
    ledger: s.ledger,
    passing: s.passing ? { round: s.passing.round, dice: s.passing.dice, voting: s.passing.voting, mine: s.passing.chosen[seat] ?? null, blind: s.passing.blind[seat] ?? 0, vote: s.passing.votes[seat] ?? null } : null,
    received: [...(s.received[seat] ?? [])],
  };
}

/** Every tile a seat can see on the table or in its hand. */
export function seenTiles(v: Pick<MahjongView, 'hand' | 'melds' | 'discards' | 'bonus'> & { readonly indicators?: readonly TileId[]; readonly shown?: readonly (readonly TileId[] | null)[] }): TileId[] {
  return [...v.hand, ...v.melds.flatMap((list) => list.flatMap((m) => m.tiles)), ...v.discards.flatMap((list) => list.filter((d) => !d.claimed).map((d) => d.tile)), ...v.bonus.flat(), ...(v.indicators ?? []), ...(v.shown ?? []).flatMap((h) => h ?? [])];
}

/** A full state consistent with a view: the tiles the seat cannot see dealt at random to the other hands and the wall. */
export function sampleState(v: MahjongView, rng: Rng): MahjongState {
  const rules = engine.rules(v.config);
  const seen = new Set(seenTiles(v));
  const unseen = rng.shuffle(tileSet(rules.tiles).filter((t) => !seen.has(t)));
  const hands: TileId[][] = [[], [], [], []];
  hands[v.seat] = [...v.hand];
  let k = 0;
  for (let seat = 0; seat < SEATS; seat++) {
    if (seat === v.seat) continue;
    // A hand laid down after a win is seen by everyone.
    const shown = v.shown[seat];
    if (shown) {
      hands[seat] = [...shown];
      continue;
    }
    const n = v.handCounts[seat] ?? 0;
    hands[seat] = unseen.slice(k, k + n);
    k += n;
  }
  // Indicators: those turned up are known; the rest (and the tiles under them) are dealt like the wall.
  let indicators: IndicatorStacks | null = null;
  if (rules.indicators) {
    const n = rules.indicators;
    const shown = v.indicators.length;
    const hidden = unseen.slice(k, k + 2 * n - shown);
    k += 2 * n - shown;
    indicators = { tiles: [...v.indicators, ...hidden], shown, pending: 0 };
  }
  const wall = unseen.slice(k);
  let claim: ClaimWindow | null = null;
  let turn: Seat = v.turn ?? v.seat;
  if (v.claim) {
    const after = [1, 2, 3].map((i) => (v.claim!.from + i) % SEATS);
    // Seats asked before this one have chosen in secret: the sample treats them as having passed.
    const waiting = v.turn === v.seat ? after.slice(after.indexOf(v.seat)) : after;
    claim = { kind: v.claim.kind, tile: v.claim.tile, from: v.claim.from, waiting, declared: [], meld: robbedMeld(v), last: v.claim.last };
    turn = waiting[0] ?? v.seat;
  }
  return {
    config: v.config,
    seed: `sample/${rng.int(1_000_000_000)}`,
    table: v.table,
    handNo: v.handNo,
    round: v.round,
    dealer: v.dealer,
    passes: v.passes,
    repeats: v.repeats,
    scores: v.scores,
    results: v.results,
    wall,
    hands,
    melds: v.melds,
    discards: v.discards,
    bonus: v.bonus,
    turn,
    phase: v.phase,
    drawn: v.drawn,
    source: v.source,
    kongs: v.kongs,
    claimed: v.claimed,
    claim,
    calls: v.calls,
    lastDiscard: v.lastDiscard,
    over: v.over,
    indicators,
    ready: v.ready,
    stakes: v.stakes,
    counter: v.counter,
    missed: [0, 1, 2, 3].map((s) => (s === v.seat ? v.missed : null)),
    forbidden: v.turn === v.seat && v.claimed ? forbiddenFrom(v) : [],
    voids: v.voids,
    won: v.won,
    paid: v.paid,
    ledger: v.ledger,
    passing: v.passing ? samplePassing(v) : null,
    received: [0, 1, 2, 3].map((s) => (s === v.seat ? [...v.received] : [])),
  };
}

/** A passing round as a seat sees it: its own choice; the seats after it in turn from the dealer still to choose. */
function samplePassing(v: MahjongView): PassState {
  const p = v.passing as NonNullable<MahjongView['passing']>;
  const order = [0, 1, 2, 3].map((i) => (v.dealer + i) % SEATS);
  const waiting = v.turn === v.seat ? order.slice(order.indexOf(v.seat)) : order.filter((s) => s !== v.seat);
  return {
    round: p.round,
    dice: p.dice,
    voting: p.voting,
    waiting,
    chosen: [0, 1, 2, 3].map((s) => (s === v.seat ? p.mine : null)),
    blind: [0, 1, 2, 3].map((s) => (s === v.seat ? p.blind : 0)),
    votes: [0, 1, 2, 3].map((s) => (s === v.seat ? p.vote : null)),
  };
}

/** The kinds you may not throw after a call, worked out from your legal options. */
function forbiddenFrom(v: MahjongView): Kind[] {
  const allowed = new Set(v.options.filter((a) => a.type === 'discard').map((a) => (a as { tile: Kind }).tile));
  return [...new Set(v.hand.map(kindOf))].filter((k) => !allowed.has(k));
}

/** The meld a robbable kong sits in: its index, or -1 - index for a concealed kong. */
function robbedMeld(v: MahjongView): number {
  const c = v.claim;
  if (!c || c.kind !== 'rob') return -1;
  const melds = v.melds[c.from] ?? [];
  const i = melds.findIndex((m) => m.tiles.includes(c.tile));
  const m = melds[i];
  return m && m.concealed ? -1 - i : i;
}

// Notation

export function actionText(a: MahjongAction): string {
  switch (a.type) {
    case 'discard':
      return codeOf(a.tile);
    case 'kong':
      return a.tile === undefined ? 'kong' : `kong ${codeOf(a.tile)}`;
    case 'chow':
      return `chow ${codeOf(a.start)}`;
    case 'ready':
      return `riichi ${codeOf(a.tile)}`;
    case 'pass-tiles':
      return ['pass', ...(a.tiles.length === 0 && a.blind === 0 ? ['none'] : a.tiles.map(codeOf)), ...(a.blind > 0 ? [`blind${a.blind}`] : [])].join(' ');
    case 'vote':
      return a.yes ? 'vote yes' : 'vote no';
    case 'void':
      return `void ${'mps'[a.suit] ?? 'm'}`;
    default:
      return a.type;
  }
}

export function parseAction(text: string): MahjongAction {
  const t = text.trim();
  if (t === 'win' || t === 'pung' || t === 'pass' || t === 'next' || t === 'kong' || t === 'abort') return { type: t };
  if (t === 'vote yes' || t === 'vote no') return { type: 'vote', yes: t === 'vote yes' };
  const v = /^void\s+([mps])$/.exec(t);
  if (v) return { type: 'void', suit: 'mps'.indexOf(v[1] ?? 'm') };
  if (t === 'pass' || t.startsWith('pass ')) {
    const words = t.split(/\s+/).slice(1);
    const blindWord = words.find((w) => /^blind[0-9]$/.test(w));
    const tiles = words.filter((w) => w !== blindWord && w !== 'none').map((w) => {
      const k = parseKind(w);
      if (k === null) throw new Error(`"${text}" names no tile`);
      return k;
    });
    return { type: 'pass-tiles', tiles, blind: blindWord ? Number(blindWord.slice(5)) : 0 };
  }
  const m = /^(kong|chow|riichi)\s+(\S+)$/.exec(t);
  if (m) {
    const kind = parseKind(m[2] ?? '');
    if (kind === null) throw new Error(`"${text}" names no tile`);
    return m[1] === 'kong' ? { type: 'kong', tile: kind } : m[1] === 'riichi' ? { type: 'ready', tile: kind } : { type: 'chow', start: kind };
  }
  const kind = parseKind(t);
  if (kind === null) throw new Error(`"${text}" is not a mahjong move, such as 5p, kong 5p, chow 3s, pung, win, pass or next`);
  return { type: 'discard', tile: kind };
}

// Codecs

function readConfig(json: Json): MahjongConfig {
  if (!isJsonObject(json)) return DEFAULT_CONFIG;
  const styleId = typeof json.style === 'string' && STYLES[json.style] ? json.style : DEFAULT_CONFIG.style;
  const style = STYLES[styleId] as Style;
  const options = readOptions(style, json.options);
  return { style: styleId, options, ...(typeof json.start === 'string' ? { start: json.start } : {}) };
}

function configJson(c: MahjongConfig): Json {
  return { style: c.style, options: { ...c.options }, ...(c.start ? { start: c.start } : {}) };
}

const configCodec: JsonCodec<MahjongConfig> = { toJSON: configJson, fromJSON: readConfig };

function fail(what: string): never {
  throw new Error(`Mahjong: ${what} is damaged`);
}

const tilesFrom = (j: Json | undefined, what: string): TileId[] => {
  if (!Array.isArray(j)) fail(what);
  return j.map((t) => (typeof t === 'string' && isTileId(t) ? t : fail(what)));
};
const perSeat = <T>(j: Json | undefined, what: string, read: (x: Json) => T): T[] => {
  if (!Array.isArray(j) || j.length !== SEATS) fail(what);
  return j.map(read);
};
const numberIn = (j: Json | undefined, what: string, lo = -Infinity, hi = Infinity): number => (typeof j === 'number' && Number.isFinite(j) && j >= lo && j <= hi ? j : fail(what));
const seatIn = (j: Json | undefined, what: string): Seat => numberIn(j, what, 0, SEATS - 1);

function meldFrom(j: Json): Meld {
  if (!isJsonObject(j) || (j.type !== 'chow' && j.type !== 'pung' && j.type !== 'kong')) fail('a meld');
  return {
    type: j.type,
    tiles: tilesFrom(j.tiles, 'a meld'),
    claimed: typeof j.claimed === 'string' && isTileId(j.claimed) ? j.claimed : null,
    from: typeof j.from === 'number' ? seatIn(j.from, 'a meld') : null,
    concealed: j.concealed === true,
    added: j.added === true,
  };
}

function discardFrom(j: Json): Discard {
  if (!isJsonObject(j) || typeof j.tile !== 'string' || !isTileId(j.tile)) fail('a discard');
  return { tile: j.tile, claimed: j.claimed === true };
}

function scoreFrom(j: Json | undefined): HandScore {
  if (!isJsonObject(j) || !Array.isArray(j.lines)) fail('a score');
  const lines: ScoreLine[] = j.lines.map((l) => {
    if (!isJsonObject(l) || typeof l.id !== 'string' || typeof l.value !== 'number') fail('a score line');
    return typeof l.times === 'number' ? { id: l.id, value: l.value, times: l.times } : { id: l.id, value: l.value };
  });
  return {
    lines,
    raw: numberIn(j.raw, 'a score'),
    total: numberIn(j.total, 'a score'),
    limit: j.limit === true,
    unit: typeof j.unit === 'string' ? j.unit : 'faan',
    base: numberIn(j.base, 'a score'),
    ...(typeof j.fu === 'number' ? { fu: j.fu } : {}),
    ...(typeof j.yakuman === 'number' ? { yakuman: j.yakuman } : {}),
    ...(typeof j.band === 'string' ? { band: j.band } : {}),
  };
}

function winFrom(j: Json): WinRecord {
  if (!isJsonObject(j) || typeof j.tile !== 'string' || !isTileId(j.tile)) fail('a win');
  return { seat: seatIn(j.seat, 'a win'), from: typeof j.from === 'number' ? seatIn(j.from, 'a win') : null, tile: j.tile, score: scoreFrom(j.score), robbed: j.robbed === true };
}

function resultFrom(j: Json): HandResult {
  if (!isJsonObject(j)) fail('a hand result');
  return {
    handNo: numberIn(j.handNo, 'a hand result', 0),
    round: numberIn(j.round, 'a hand result', 0),
    dealer: seatIn(j.dealer, 'a hand result'),
    wins: Array.isArray(j.wins) ? j.wins.map(winFrom) : [],
    deltas: perSeat(j.deltas, 'a hand result', (x) => numberIn(x, 'a hand result')),
    hands: perSeat(j.hands, 'a hand result', (x) => tilesFrom(x, 'a hand result')),
    melds: perSeat(j.melds, 'a hand result', (x) => (Array.isArray(x) ? x.map(meldFrom) : fail('a hand result'))),
    bonus: perSeat(j.bonus, 'a hand result', (x) => tilesFrom(x, 'a hand result')),
    wallLeft: numberIn(j.wallLeft, 'a hand result', 0),
    ...(typeof j.reason === 'string' && DRAW_REASONS.includes(j.reason as DrawReason) ? { reason: j.reason as DrawReason } : {}),
    ...(Array.isArray(j.ready) ? { ready: perSeat(j.ready, 'a hand result', (x) => x === true) } : {}),
    ...(Array.isArray(j.indicators) ? { indicators: tilesFrom(j.indicators, 'a hand result') } : {}),
    ...(Array.isArray(j.under) ? { under: tilesFrom(j.under, 'a hand result') } : {}),
    ...(typeof j.counter === 'number' ? { counter: numberIn(j.counter, 'a hand result', 0) } : {}),
    ...(typeof j.stakes === 'number' ? { stakes: numberIn(j.stakes, 'a hand result', 0) } : {}),
    ...(Array.isArray(j.status) ? { status: perSeat(j.status, 'a hand result', (x) => (typeof x === 'string' ? x : '')) } : {}),
    ...(Array.isArray(j.payments) ? { payments: j.payments.map(paymentFrom) } : {}),
    ...(Array.isArray(j.voids) ? { voids: perSeat(j.voids, 'a hand result', (x) => (typeof x === 'number' ? x : null)) } : {}),
  };
}

const DRAW_REASONS: readonly DrawReason[] = ['exhausted', 'nine-terminals', 'four-winds', 'four-ready', 'four-kongs', 'too-many-winners'];

function readyFrom(j: Json): ReadyMark | null {
  if (j === null) return null;
  if (!isJsonObject(j)) fail('a ready declaration');
  return { at: numberIn(j.at, 'a ready declaration', 0), first: j.first === true, oneShot: j.oneShot === true, paid: j.paid === true };
}

function indicatorsFrom(j: Json | undefined): IndicatorStacks | null {
  if (j === null || j === undefined) return null;
  if (!isJsonObject(j)) fail('the indicators');
  const tiles = tilesFrom(j.tiles, 'the indicators');
  return { tiles, shown: numberIn(j.shown, 'the indicators', 0, tiles.length / 2), pending: numberIn(j.pending ?? 0, 'the indicators', 0) };
}

function claimFrom(j: Json | undefined): ClaimWindow | null {
  if (j === null || j === undefined) return null;
  if (!isJsonObject(j) || (j.kind !== 'discard' && j.kind !== 'rob') || typeof j.tile !== 'string' || !isTileId(j.tile) || !Array.isArray(j.waiting) || !Array.isArray(j.declared)) fail('the claim window');
  const calls = ['win', 'kong', 'pung', 'chow'];
  const declared: Declaration[] = j.declared.map((x) => {
    if (!isJsonObject(x) || typeof x.call !== 'string' || !calls.includes(x.call)) fail('a call');
    return { seat: seatIn(x.seat, 'a call'), call: x.call as Declaration['call'], ...(typeof x.start === 'number' ? { start: x.start } : {}) };
  });
  return { kind: j.kind, tile: j.tile, from: seatIn(j.from, 'the claim window'), waiting: j.waiting.map((x) => seatIn(x, 'the claim window')), declared, meld: numberIn(j.meld, 'the claim window'), last: j.last === true, ...(j.afterKong === true ? { afterKong: true } : {}) };
}

const PHASES: readonly Phase[] = ['act', 'claim', 'rob', 'scored', 'pass', 'void'];

function paymentFrom(j: Json): Payment {
  if (!isJsonObject(j) || typeof j.reason !== 'string' || !Array.isArray(j.deltas)) fail('a payment');
  return { reason: j.reason, seat: seatIn(j.seat, 'a payment'), ...(typeof j.from === 'number' ? { from: seatIn(j.from, 'a payment') } : j.from === null ? { from: null } : {}), deltas: j.deltas.map((x) => numberIn(x, 'a payment')) };
}

function passingFrom(j: Json | undefined): PassState | null {
  if (j === null || j === undefined) return null;
  if (!isJsonObject(j) || !Array.isArray(j.waiting) || !Array.isArray(j.chosen)) fail('the passing round');
  return {
    round: numberIn(j.round, 'the passing round', 0),
    dice: numberIn(j.dice ?? 1, 'the passing round', 1, 3),
    voting: j.voting === true,
    waiting: j.waiting.map((x) => seatIn(x, 'the passing round')),
    chosen: perSeat(j.chosen, 'the passing round', (x) => (Array.isArray(x) ? x.map((k) => numberIn(k, 'the passing round', 0, 42)) : null)),
    blind: Array.isArray(j.blind) ? perSeat(j.blind, 'the passing round', (x) => numberIn(x, 'the passing round', 0, 6)) : [0, 0, 0, 0],
    votes: Array.isArray(j.votes) ? perSeat(j.votes, 'the passing round', (x) => (typeof x === 'boolean' ? x : null)) : [null, null, null, null],
  };
}
const SOURCES: readonly MahjongState['source'][] = ['deal', 'wall', 'replacement', 'call'];

function stateFromJson(json: Json): MahjongState {
  if (!isJsonObject(json)) throw new Error('Not a mahjong position');
  const config = readConfig(json.config ?? null);
  const phase = PHASES.includes(json.phase as Phase) ? (json.phase as Phase) : fail('the phase');
  const state: MahjongState = {
    config,
    seed: typeof json.seed === 'string' ? json.seed : 'position',
    table: numberIn(json.table ?? 0, 'the table number', 0),
    handNo: numberIn(json.handNo, 'the hand number', 0),
    round: numberIn(json.round, 'the round', 0),
    dealer: seatIn(json.dealer, 'the dealer'),
    passes: numberIn(json.passes ?? 0, 'the deal count', 0),
    repeats: numberIn(json.repeats ?? 0, 'the repeat count', 0),
    scores: perSeat(json.scores, 'the scores', (x) => numberIn(x, 'the scores')),
    results: Array.isArray(json.results) ? json.results.map(resultFrom) : [],
    wall: tilesFrom(json.wall, 'the wall'),
    hands: perSeat(json.hands, 'the hands', (x) => tilesFrom(x, 'a hand')),
    melds: perSeat(json.melds, 'the melds', (x) => (Array.isArray(x) ? x.map(meldFrom) : fail('the melds'))),
    discards: perSeat(json.discards, 'the discards', (x) => (Array.isArray(x) ? x.map(discardFrom) : fail('the discards'))),
    bonus: perSeat(json.bonus, 'the bonus tiles', (x) => tilesFrom(x, 'the bonus tiles')),
    turn: seatIn(json.turn, 'the turn'),
    phase,
    drawn: typeof json.drawn === 'string' && isTileId(json.drawn) ? json.drawn : null,
    source: SOURCES.includes(json.source as MahjongState['source']) ? (json.source as MahjongState['source']) : 'wall',
    kongs: numberIn(json.kongs ?? 0, 'the kong count', 0),
    claimed: json.claimed === true,
    claim: claimFrom(json.claim),
    calls: numberIn(json.calls ?? 0, 'the call count', 0),
    lastDiscard: typeof json.lastDiscard === 'string' && isTileId(json.lastDiscard) ? json.lastDiscard : null,
    over: json.over === true,
    indicators: indicatorsFrom(json.indicators),
    ready: json.ready === undefined ? [null, null, null, null] : perSeat(json.ready, 'the ready declarations', readyFrom),
    stakes: numberIn(json.stakes ?? 0, 'the stakes', 0),
    counter: numberIn(json.counter ?? 0, 'the counter', 0),
    missed: json.missed === undefined ? [null, null, null, null] : perSeat(json.missed, 'the furiten marks', (x) => (x === 'turn' || x === 'hand' ? x : null)),
    forbidden: Array.isArray(json.forbidden) ? json.forbidden.map((x) => numberIn(x, 'the forbidden throws', 0, 33)) : [],
    voids: Array.isArray(json.voids) ? perSeat(json.voids, 'the void suits', (x) => (typeof x === 'number' ? numberIn(x, 'the void suits', 0, 2) : null)) : [null, null, null, null],
    won: Array.isArray(json.won) ? json.won.map(winFrom) : [],
    paid: Array.isArray(json.paid) ? perSeat(json.paid, 'the hand payments', (x) => numberIn(x, 'the hand payments')) : [0, 0, 0, 0],
    ledger: Array.isArray(json.ledger) ? json.ledger.map(paymentFrom) : [],
    passing: passingFrom(json.passing),
    received: Array.isArray(json.received) ? perSeat(json.received, 'the received tiles', (x) => tilesFrom(x, 'the received tiles')) : [[], [], [], []],
  };
  checkConservation(state);
  return state;
}

function stateToJson(s: MahjongState): Json {
  return JSON.parse(JSON.stringify({ ...s, config: configJson(s.config) })) as Json;
}

/** Every tile of the set is in exactly one place: the wall, a hand, a meld, the discards (not taken) or the bonus tiles. */
export function checkConservation(s: Pick<MahjongState, 'config' | 'wall' | 'hands' | 'melds' | 'discards' | 'bonus'> & { readonly indicators?: IndicatorStacks | null }): void {
  const all = [...s.wall, ...s.hands.flat(), ...s.melds.flatMap((list) => list.flatMap((m) => m.tiles)), ...s.discards.flatMap((list) => list.filter((d) => !d.claimed).map((d) => d.tile)), ...s.bonus.flat(), ...(s.indicators?.tiles ?? [])];
  const expected = tileSet(engine.rules(s.config).tiles);
  if (all.length !== expected.length) throw new Error(`Mahjong: ${all.length} tiles, not ${expected.length}`);
  const set = new Set(all);
  if (set.size !== all.length) throw new Error('Mahjong: a tile is in two places');
  for (const t of expected) if (!set.has(t)) throw new Error(`Mahjong: ${t} is missing`);
}

const stateCodec: Codec<MahjongState> = {
  toJSON: stateToJson,
  fromJSON: stateFromJson,
  toText: (s) => stableStringify(stateToJson(s)),
  fromText: (text) => stateFromJson(JSON.parse(text) as Json),
};

const actionCodec: Codec<MahjongAction> = {
  toJSON: (a) => actionText(a),
  fromJSON(json) {
    if (typeof json !== 'string') throw new Error('A mahjong move is stored as text, such as 5p or pung');
    return parseAction(json);
  },
  toText: actionText,
  fromText: (text) => parseAction(text),
};

/** Places by score (equal scores share a place); each seat's score is its points. */
function outcomeOf(s: MahjongState): Outcome | null {
  if (!s.over) return null;
  const results = s.scores.map((score, seat) => ({ seat, place: 1 + s.scores.filter((x) => x > score).length, score }));
  return { reason: s.results.length === 1 && engine.rules(s.config).rounds === 0 ? 'mahjong-hand' : 'mahjong-game', results };
}

export const mahjong: GameDef<MahjongState, MahjongAction, MahjongConfig, MahjongView, MahjongEvent & GameEvent> = {
  id: 'mahjong',
  rulesVersion: 1,
  defaultConfig: DEFAULT_CONFIG,
  setup(config, rng) {
    const seed = `mahjong/${rng.int(2_147_483_647)}/${rng.int(2_147_483_647)}`;
    if (config.start) {
      // Play on from a position: the same tiles where they lay, a fresh seed for later hands.
      const from = stateFromJson(JSON.parse(config.start) as Json);
      return { ...from, config: { style: from.config.style, options: from.config.options }, seed };
    }
    return engine.newGame(config, seed);
  },
  seats: () => [0, 1, 2, 3],
  turn: (s) => (s.over ? null : s.turn),
  legal: (s, seat) => engine.legal(s, seat),
  apply: (s, a) => engine.apply(s, a),
  outcome: outcomeOf,
  view: viewOf,
  sample: (view, _seat, rng) => sampleState(view, rng),
  codec: { state: stateCodec, action: actionCodec, config: configCodec },
};

/** Which preset a config is, if any. */
export function presetOf(config: MahjongConfig): string | null {
  const style = STYLES[config.style];
  if (!style) return null;
  const key = stableStringify(config.options);
  return style.presets.find((p) => stableStringify(p.options) === key)?.id ?? null;
}

// Positions for tests and lessons

export interface MeldSpec {
  readonly type: 'chow' | 'pung' | 'kong' | 'concealed-kong';
  /** The tiles, such as "345s" or "Rd Rd Rd". */
  readonly tiles: string;
  /** Who discarded the claimed tile; the seat before by default. */
  readonly from?: Seat;
}

export interface PositionSpec {
  /** The style (Hong Kong by default) and its options over the style's defaults. */
  readonly style?: string;
  readonly options?: Partial<Record<string, string | number>>;
  readonly dealer?: Seat;
  readonly round?: number;
  readonly turn?: Seat;
  /** Concealed tiles per seat, such as "123m 456p 789s EE S" ("0p" is a red five where the style has them). */
  readonly hands: readonly string[];
  readonly melds?: readonly (readonly MeldSpec[])[];
  readonly discards?: readonly string[];
  readonly bonus?: readonly string[];
  /** The next tiles to be drawn from the front of the wall, in order. */
  readonly front?: string;
  /** The next replacement tiles from the back of the wall, in the order they will be drawn. */
  readonly back?: string;
  /** How many tiles the wall holds; the rest of the set goes to the discards as filler. */
  readonly wall?: number;
  /** The tile the seat to act has just drawn (it must be in its hand). */
  readonly drawn?: string;
  readonly source?: MahjongState['source'];
  readonly calls?: number;
  readonly scores?: readonly number[];
  /** Styles with indicators: the indicators turned up (one by default), and the tiles under them. */
  readonly indicators?: string;
  readonly under?: string;
  readonly ready?: readonly (Partial<ReadyMark> | null)[];
  readonly stakes?: number;
  readonly counter?: number;
  /** Void suits declared (styles with a void declaration). */
  readonly voids?: readonly (number | null)[];
}

/** Tiles written in a position, each with whether it is a red five ("0p"). */
export function parseTiles(text: string): { kind: Kind; red: boolean }[] {
  const out: { kind: Kind; red: boolean }[] = [];
  for (const word of text.trim().split(/\s+/).filter(Boolean)) {
    let rest = '';
    let i = 0;
    while (i < word.length) {
      const run = /^(\d+)([mps])/.exec(word.slice(i));
      if (run) {
        if (rest) {
          out.push(...parseKinds(rest).map((kind) => ({ kind, red: false })));
          rest = '';
        }
        const suit = 'mps'.indexOf(run[2] ?? 'm');
        for (const d of run[1] ?? '') out.push(d === '0' ? { kind: suit * 9 + 4, red: true } : { kind: suit * 9 + Number(d) - 1, red: false });
        i += run[0].length;
        continue;
      }
      rest += word[i];
      i++;
    }
    if (rest) out.push(...parseKinds(rest).map((kind) => ({ kind, red: false })));
  }
  return out;
}

/** A position in the middle of a hand, phase "act", for tests and lessons. Unnamed tiles fill the wall. */
export function position(p: PositionSpec): MahjongState {
  const styleId = p.style ?? 'hong-kong';
  const style = STYLES[styleId];
  if (!style) throw new Error(`Mahjong position: no style ${styleId}`);
  const config: MahjongConfig = { style: styleId, options: { ...style.defaults, ...(p.options as StyleOptions | undefined) } };
  const rules = engine.rules(config);
  const reds = (rules.tiles.red ?? 0) > 0;
  const pool = new Map<Kind, TileId[]>();
  for (const t of tileSet(rules.tiles)) {
    const k = kindOf(t);
    pool.set(k, [...(pool.get(k) ?? []), t]);
  }
  const take = (k: Kind, red = false): TileId => {
    const list = pool.get(k) ?? [];
    // A plain tile is never the red five, when the style has red fives; "0" asks for it.
    const i = reds && isRedFive(list[0] ?? '', true) ? (red ? 0 : list.length > 1 ? 1 : -1) : red ? -1 : 0;
    const t = i >= 0 ? list[i] : undefined;
    if (!t) throw new Error(`Mahjong position: no ${red ? 'red ' : ''}${codeOf(k)} left`);
    list.splice(i, 1);
    return t;
  };
  const takeAll = (text: string | undefined): TileId[] => (text ? parseTiles(text).map((x) => take(x.kind, x.red)) : []);
  const hands = [0, 1, 2, 3].map((seat) => takeAll(p.hands[seat]));
  const melds: Meld[][] = [0, 1, 2, 3].map((seat) =>
    (p.melds?.[seat] ?? []).map((m): Meld => {
      const tiles = takeAll(m.tiles);
      if (m.type === 'concealed-kong') return { type: 'kong', tiles, claimed: null, from: null, concealed: true, added: false };
      const from = m.from ?? (seat + SEATS - 1) % SEATS;
      return { type: m.type, tiles, claimed: tiles[tiles.length - 1] ?? null, from, concealed: false, added: false };
    }),
  );
  const discards: Discard[][] = [0, 1, 2, 3].map((seat) => takeAll(p.discards?.[seat]).map((tile) => ({ tile, claimed: false })));
  const bonus = [0, 1, 2, 3].map((seat) => takeAll(p.bonus?.[seat]));
  const front = takeAll(p.front);
  const back = takeAll(p.back);
  const shownIndicators = takeAll(p.indicators);
  const underIndicators = takeAll(p.under);
  const rest: TileId[] = [];
  for (const list of pool.values()) rest.push(...list);
  // Spare tiles: bonus tiles nobody named are set aside by the seats in turn, the rest fill the wall or the discards.
  const spareBonus = rest.filter((t) => kindOf(t) >= 34);
  const spare = rest.filter((t) => kindOf(t) < 34);
  spareBonus.forEach((t, i) => (bonus[(i + 1) % SEATS] as TileId[]).push(t));
  // Indicator stacks: those named, then filled from the spare tiles' end.
  let indicators: IndicatorStacks | null = null;
  if (rules.indicators) {
    const n = rules.indicators;
    const fill = (named: TileId[]) => [...named, ...spare.splice(spare.length - (n - named.length), n - named.length)];
    const ups = fill(shownIndicators);
    const unders = fill(underIndicators);
    indicators = { tiles: [...ups, ...unders], shown: Math.max(1, shownIndicators.length), pending: 0 };
  }
  const wallSize = p.wall ?? front.length + back.length + spare.length;
  const middle = spare.slice(0, Math.max(0, wallSize - front.length - back.length));
  const filler = spare.slice(middle.length);
  filler.forEach((tile, i) => (discards[i % SEATS] as Discard[]).push({ tile, claimed: false }));
  const wall = [...front, ...middle, ...[...back].reverse()];
  const turn = p.turn ?? 0;
  const drawnKind = p.drawn ? (parseTiles(p.drawn)[0] ?? null) : null;
  const hand = hands[turn] as TileId[];
  const drawn = drawnKind === null ? (hand[hand.length - 1] ?? null) : (hand.find((t) => kindOf(t) === drawnKind.kind && (!reds || isRedFive(t, true) === drawnKind.red)) ?? hand.find((t) => kindOf(t) === drawnKind.kind) ?? null);
  const start = rules.startScore ?? 0;
  const state: MahjongState = {
    config,
    seed: 'position',
    table: 0,
    handNo: 0,
    round: p.round ?? 0,
    dealer: p.dealer ?? 0,
    passes: 0,
    repeats: 0,
    scores: [...(p.scores ?? [start, start, start, start])],
    results: [],
    wall,
    hands,
    melds,
    discards,
    bonus,
    turn,
    phase: 'act',
    drawn,
    source: p.source ?? 'wall',
    kongs: 0,
    claimed: false,
    claim: null,
    calls: p.calls ?? 1,
    lastDiscard: null,
    over: false,
    indicators,
    ready: [0, 1, 2, 3].map((seat) => {
      const r = p.ready?.[seat];
      return r ? { at: r.at ?? 0, first: r.first ?? false, oneShot: r.oneShot ?? false, paid: r.paid ?? true } : null;
    }),
    stakes: p.stakes ?? 0,
    counter: p.counter ?? 0,
    missed: [null, null, null, null],
    forbidden: [],
    voids: p.voids ? [0, 1, 2, 3].map((seat) => p.voids?.[seat] ?? null) : [null, null, null, null],
    won: [],
    paid: [0, 0, 0, 0],
    ledger: [],
    passing: null,
    received: [[], [], [], []],
  };
  checkConservation(state);
  return state;
}

/** A red five: copy 0 of a 5, in a style that plays them (pass `reds` from the style's tile set). */
export function isRedFive(id: TileId, reds: boolean): boolean {
  if (!reds || !id) return false;
  const k = kindOf(id);
  return k < 27 && k % 9 === 4 && id.endsWith('.0');
}

/** A tile id of a kind that is not used anywhere else, for building contexts in tests. */
export function anyTile(kind: Kind, copy = 0): TileId {
  return tileId(kind, copy);
}
