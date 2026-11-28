/**
 * The shared mahjong engine (docs/rules/mahjong-core.md): the wall, the deal and bonus tiles,
 * draws and discards, calls in a claim window, kongs and robbing them, wins, exhaustive draws,
 * payments, the dealer and the rounds. Everything style-specific comes from the rules file
 * (core/style.ts); this file never names a style's patterns or values.
 *
 * The contract stays turn-based: one seat acts at a time. After a discard, the seats that could
 * call it are asked in turn order; their choices are hidden from the other seats until the window
 * closes, and the best call wins by priority (win, then pung or kong, then chow).
 */
import type { Seat } from '../../../core/contract';
import { createRng } from '../../../core/rng';
import { isThirteenOrphans, isWinningShape, waitsOf } from './shapes';
import type { DrawReason, HandEnd, HandScore, Meld, Style, StyleOptions, StyleRules, WinContext, WinRecord } from './style';
import type { Kind, TileId } from './tiles';
import { countsOf, isBonus, isSuited, isTerminalOrHonour, isWind, kindOf, ORPHANS, rankOf, suitOf, tileSet } from './tiles';

export const SEATS = 4;

export interface MahjongConfig {
  readonly style: string;
  readonly options: StyleOptions;
  /** A position to start from instead of a deal ("play on from here"), in state notation. */
  readonly start?: string;
}

export type Phase = 'act' | 'claim' | 'rob' | 'scored';
export type CallType = 'win' | 'kong' | 'pung' | 'chow';

export interface Discard {
  readonly tile: TileId;
  /** Taken by a call or a win: it no longer lies in the discards. */
  readonly claimed: boolean;
}

/** A seat's choice in an open claim window. Hidden from the other seats until the window closes. */
export interface Declaration {
  readonly seat: Seat;
  readonly call: CallType;
  /** A chow's lowest kind. */
  readonly start?: Kind;
}

export interface ClaimWindow {
  /** A discard on offer, or a kong that may be robbed. */
  readonly kind: 'discard' | 'rob';
  readonly tile: TileId;
  readonly from: Seat;
  /** Seats still to choose, in turn order after `from`; the first is the seat to act. */
  readonly waiting: readonly Seat[];
  readonly declared: readonly Declaration[];
  /** Rob: the index of the kong in the robbed seat's melds. */
  readonly meld: number;
  /** Discard: made when no tile was left to draw (only a win may be called). */
  readonly last: boolean;
}

export interface HandResult {
  readonly handNo: number;
  readonly round: number;
  readonly dealer: Seat;
  /** Empty for an exhaustive draw. */
  readonly wins: readonly WinRecord[];
  readonly deltas: readonly number[];
  /** The hands as they were laid down at the end (a winner's includes the winning tile). */
  readonly hands: readonly (readonly TileId[])[];
  readonly melds: readonly (readonly Meld[])[];
  readonly bonus: readonly (readonly TileId[])[];
  readonly wallLeft: number;
  /** A hand with no winner: why it ended. */
  readonly reason?: DrawReason;
  /** At an exhaustive draw, in styles that count it: which seats were ready. */
  readonly ready?: readonly boolean[];
  /** Indicators turned up, and (for a winner who declared ready) the tiles under them. */
  readonly indicators?: readonly TileId[];
  readonly under?: readonly TileId[];
  /** The counters and stakes on the table when the hand ended. */
  readonly counter?: number;
  readonly stakes?: number;
}

/** Indicator tiles set aside at the deal (styles with indicators): turned up one by one. */
export interface IndicatorStacks {
  /** The indicators first, then the tile under each, in the same order. */
  readonly tiles: readonly TileId[];
  /** How many are turned up. */
  readonly shown: number;
  /** Indicators owed by an exposed or added kong, turned after its owner's next throw. */
  readonly pending: number;
}

/** A seat's ready declaration (riichi) this hand. */
export interface ReadyMark {
  /** The index, in the seat's discards, of the throw it was declared with. */
  readonly at: number;
  /** Declared on the seat's first throw, before any call. */
  readonly first: boolean;
  /** No call since, and the seat has not thrown again: a win now is within one go round. */
  readonly oneShot: boolean;
  /** The stake is on the table (the declaring throw passed without a win). */
  readonly paid: boolean;
}

export interface MahjongState {
  readonly config: MahjongConfig;
  /** Deals every hand of the game. Never part of a view. */
  readonly seed: string;
  /** The table's public number, which fixes the CPU seats' styles of play. */
  readonly table: number;
  readonly handNo: number;
  /** The prevailing wind: 0 East, 1 South, 2 West, 3 North. */
  readonly round: number;
  readonly dealer: Seat;
  /** How many times the deal has passed in this round. */
  readonly passes: number;
  /** Hands in a row the dealer has kept the deal. */
  readonly repeats: number;
  readonly scores: readonly number[];
  readonly results: readonly HandResult[];
  /** The undrawn tiles: draws from the front, replacements from the back. */
  readonly wall: readonly TileId[];
  readonly hands: readonly (readonly TileId[])[];
  readonly melds: readonly (readonly Meld[])[];
  readonly discards: readonly (readonly Discard[])[];
  readonly bonus: readonly (readonly TileId[])[];
  readonly turn: Seat;
  readonly phase: Phase;
  /** The tile the seat to act has just drawn (or was dealt last), or null after a call. */
  readonly drawn: TileId | null;
  readonly source: 'deal' | 'wall' | 'replacement' | 'call';
  /** Kongs in a row by the seat to act since it last discarded. */
  readonly kongs: number;
  /** The seat to act called a chow or pung and must discard. */
  readonly claimed: boolean;
  readonly claim: ClaimWindow | null;
  /** Calls and kongs made this hand. */
  readonly calls: number;
  /** The tile discarded last this hand (it may have been called since). */
  readonly lastDiscard: TileId | null;
  readonly over: boolean;
  /** Styles with indicators: the stacks set aside at this hand's deal. */
  readonly indicators: IndicatorStacks | null;
  /** Each seat's ready declaration this hand. */
  readonly ready: readonly (ReadyMark | null)[];
  /** Stakes on the table, carried over hands with no winner. */
  readonly stakes: number;
  /** Counters on the table (honba), in styles that keep them. */
  readonly counter: number;
  /** A seat that passed a win on a discard: until its next throw, or for the hand once it has declared ready. */
  readonly missed: readonly ('turn' | 'hand' | null)[];
  /** Kinds the seat to act may not throw (after a call, when swap calling is forbidden). */
  readonly forbidden: readonly Kind[];
}

export type MahjongAction =
  | { readonly type: 'discard'; readonly tile: Kind }
  /** With a tile: a concealed or added kong on your turn. Without: an exposed kong on a discard. */
  | { readonly type: 'kong'; readonly tile?: Kind }
  | { readonly type: 'win' }
  | { readonly type: 'pung' }
  | { readonly type: 'chow'; readonly start: Kind }
  | { readonly type: 'pass' }
  | { readonly type: 'next' }
  /** Throw this tile and declare the hand ready (riichi), with a stake. */
  | { readonly type: 'ready'; readonly tile: Kind }
  /** End the hand at once, where the style allows it (nine terminals on the first draw). */
  | { readonly type: 'abort' };

export type MahjongEvent =
  | { readonly type: 'deal'; readonly handNo: number; readonly round: number; readonly dealer: Seat; readonly wall: number }
  | { readonly type: 'bonus'; readonly seat: Seat; readonly tile: TileId }
  | { readonly type: 'draw'; readonly seat: Seat; readonly tile: TileId; readonly from: 'front' | 'back'; readonly wall: number }
  | { readonly type: 'discard'; readonly seat: Seat; readonly tile: TileId }
  | { readonly type: 'call'; readonly seat: Seat; readonly call: 'chow' | 'pung' | 'kong'; readonly tile: TileId; readonly from: Seat; readonly meld: Meld }
  | { readonly type: 'kong'; readonly seat: Seat; readonly meld: Meld; readonly added: boolean }
  | { readonly type: 'win'; readonly win: WinRecord }
  | { readonly type: 'exhausted' }
  | { readonly type: 'ready'; readonly seat: Seat; readonly tile: TileId }
  | { readonly type: 'stake'; readonly seat: Seat; readonly amount: number }
  | { readonly type: 'indicator'; readonly tile: TileId }
  | { readonly type: 'abort'; readonly reason: DrawReason; readonly seat: Seat | null }
  | { readonly type: 'hand-end'; readonly result: HandResult; readonly scores: readonly number[] }
  | { readonly type: 'game-end'; readonly scores: readonly number[] };

/** The styles the engine can play, by id. */
export type StyleRegistry = Readonly<Record<string, Style>>;

export class MahjongEngine {
  private readonly cache = new WeakMap<StyleOptions, StyleRules>();

  constructor(private readonly styles: StyleRegistry) {}

  style(config: MahjongConfig): Style {
    const style = this.styles[config.style];
    if (!style) throw new Error(`No mahjong style "${config.style}"`);
    return style;
  }

  rules(config: MahjongConfig): StyleRules {
    const hit = this.cache.get(config.options);
    if (hit) return hit;
    const rules = this.style(config).rules(config.options);
    this.cache.set(config.options, rules);
    return rules;
  }

  /** A new game: the first hand dealt. */
  newGame(config: MahjongConfig, seed: string): MahjongState {
    const rng = createRng(`${seed}/table`);
    const table = rng.int(1000);
    const dealer = createRng(`${seed}/dealer`).int(SEATS);
    const start = this.rules(config).startScore ?? 0;
    const blank: Draft = {
      config,
      seed,
      table,
      handNo: 0,
      round: 0,
      dealer,
      passes: 0,
      repeats: 0,
      scores: [start, start, start, start],
      results: [],
      wall: [],
      hands: [[], [], [], []],
      melds: [[], [], [], []],
      discards: [[], [], [], []],
      bonus: [[], [], [], []],
      turn: dealer,
      phase: 'act',
      drawn: null,
      source: 'deal',
      kongs: 0,
      claimed: false,
      claim: null,
      calls: 0,
      lastDiscard: null,
      over: false,
      indicators: null,
      ready: [null, null, null, null],
      stakes: 0,
      counter: 0,
      missed: [null, null, null, null],
      forbidden: [],
    };
    this.deal(blank, []);
    return freeze(blank);
  }

  legal(s: MahjongState, seat: Seat): MahjongAction[] {
    if (s.over || s.turn !== seat) return [];
    switch (s.phase) {
      case 'scored':
        return [{ type: 'next' }];
      case 'act':
        return this.actOptions(s);
      case 'claim':
      case 'rob':
        return this.claimOptions(s, seat);
    }
  }

  apply(s: MahjongState, action: MahjongAction): { state: MahjongState; events: MahjongEvent[] } {
    if (s.over) throw new Error('The game is over');
    const seat = s.turn;
    const key = actionKey(action);
    if (!this.legal(s, seat).some((a) => actionKey(a) === key)) throw new Error(`${key} is not legal here`);
    const d = draft(s);
    const events: MahjongEvent[] = [];
    if (s.phase === 'scored') this.nextHand(d, events);
    else if (s.phase === 'act') this.act(d, seat, action, events);
    else this.declare(d, seat, action, events);
    return { state: freeze(d), events };
  }

  // What a seat may do

  private actOptions(s: MahjongState): MahjongAction[] {
    const r = this.rules(s.config);
    const seat = s.turn;
    const hand = s.hands[seat] ?? [];
    const counts = countsOf(hand);
    const kinds = [...new Set(hand.map(kindOf))].sort((a, b) => a - b);
    const discards: MahjongAction[] = kinds.map((tile) => ({ type: 'discard', tile }));
    if (s.claimed) {
      // Swap calling: the called kind (and a chow's other end) may not be thrown, unless nothing else is left.
      const allowed = discards.filter((a) => a.type === 'discard' && !s.forbidden.includes(a.tile));
      return allowed.length > 0 ? allowed : discards;
    }
    const out: MahjongAction[] = [];
    if (this.canWinSelf(s)) out.push({ type: 'win' });
    const melds = s.melds[seat] ?? [];
    const kongsOnTable = s.melds.reduce((n, list) => n + list.filter((m) => m.type === 'kong').length, 0);
    const kongRoom = s.wall.length > r.deadWall && !(r.aborts?.fourKongs && kongsOnTable >= 4);
    const mark = s.ready[seat] ?? null;
    if (mark) {
      // A ready hand is locked: it throws what it draws, or makes a concealed kong of the drawn
      // tile that leaves its waits as they were.
      const drawn = s.drawn;
      if (drawn === null) return [...out, ...discards];
      const k = kindOf(drawn);
      if (kongRoom && r.calls.concealedKong && (counts[k] ?? 0) === 4) {
        const shapes = r.shapes;
        const before = [...counts];
        before[k] = (before[k] ?? 0) - 1;
        const after = [...counts];
        after[k] = 0;
        const waitsBefore = waitsOf(before, melds.length, shapes, setsIn(r)).join();
        const waitsAfter = waitsOf(after, melds.length + 1, shapes, setsIn(r)).join();
        if (waitsBefore !== '' && waitsBefore === waitsAfter) out.push({ type: 'kong', tile: k });
      }
      return [...out, { type: 'discard', tile: k }];
    }
    if (kongRoom) {
      if (r.calls.concealedKong) for (const k of kinds) if ((counts[k] ?? 0) === 4) out.push({ type: 'kong', tile: k });
      if (r.calls.addedKong) {
        for (const m of melds) {
          if (m.type !== 'pung') continue;
          const k = kindOf(m.tiles[0] as TileId);
          if ((counts[k] ?? 0) >= 1) out.push({ type: 'kong', tile: k });
        }
      }
    }
    // Declaring ready: a closed hand, enough points, enough tiles left, and a throw that leaves it ready.
    const decl = r.ready;
    if (decl && melds.every((m) => m.concealed) && (s.scores[seat] ?? 0) >= decl.minScore && s.wall.length - r.deadWall >= decl.minLeft) {
      for (const k of kinds) {
        const c = [...counts];
        c[k] = (c[k] ?? 0) - 1;
        if (waitsOf(c, melds.length, r.shapes, setsIn(r)).length > 0) out.push({ type: 'ready', tile: k });
      }
    }
    // Nine different terminals and honours on the first draw, before any call: the seat may end the hand.
    if (r.aborts?.nineTerminals && s.calls === 0 && (s.discards[seat] ?? []).length === 0 && ORPHANS.filter((k) => (counts[k] ?? 0) > 0).length >= 9) out.push({ type: 'abort' });
    return [...out, ...discards];
  }

  /** True when a seat may not win on a discard: a wait among its own discards, or a win passed. */
  furiten(s: MahjongState, seat: Seat): boolean {
    const r = this.rules(s.config);
    if (!r.calls.furiten) return false;
    if (s.missed[seat]) return true;
    const own = new Set((s.discards[seat] ?? []).map((d) => kindOf(d.tile)));
    if (own.size === 0) return false;
    const waits = waitsOf(countsOf(s.hands[seat] ?? []), (s.melds[seat] ?? []).length, r.shapes, setsIn(r));
    return waits.some((k) => own.has(k));
  }

  private claimOptions(s: MahjongState, seat: Seat): MahjongAction[] {
    const w = s.claim;
    if (!w || w.from === seat) return [];
    const r = this.rules(s.config);
    const k = kindOf(w.tile);
    const anyWin = w.declared.some((x) => x.call === 'win');
    const best = Math.max(0, ...w.declared.map((x) => PRIORITY[x.call]));
    const out: MahjongAction[] = [];
    if ((r.calls.multipleWinners || !anyWin) && !this.furiten(s, seat) && this.canWinOn(s, seat, w)) out.push({ type: 'win' });
    // A seat that has declared ready may only win.
    if (s.ready[seat]) return out.length > 0 ? [...out, { type: 'pass' }] : [];
    if (w.kind === 'discard' && !w.last && !anyWin) {
      const hand = s.hands[seat] ?? [];
      const counts = countsOf(hand);
      const n = counts[k] ?? 0;
      const kongsOnTable = s.melds.reduce((m, list) => m + list.filter((x) => x.type === 'kong').length, 0);
      if (best < 2) {
        if (r.calls.kong && n >= 3 && s.wall.length > r.deadWall && !(r.aborts?.fourKongs && kongsOnTable >= 4)) out.push({ type: 'kong' });
        if (r.calls.pung && n >= 2) out.push({ type: 'pung' });
      }
      if (best < 1 && r.calls.chow && seat === (w.from + 1) % SEATS && isSuited(k)) {
        const rank = rankOf(k);
        for (const start of [k - 2, k - 1, k]) {
          const startRank = rank - (k - start);
          if (startRank < 1 || startRank > 7) continue;
          const others = [start, start + 1, start + 2].filter((x) => x !== k);
          if (others.every((x) => (counts[x] ?? 0) > 0)) out.push({ type: 'chow', start });
        }
      }
    }
    return out.length > 0 ? [...out, { type: 'pass' }] : [];
  }

  /** The context of a win for the style's scorer. */
  winContext(s: MahjongState, seat: Seat, tile: TileId, selfDrawn: boolean, from: Seat | null, robbed: boolean): WinContext {
    const r = this.rules(s.config);
    const hand = s.hands[seat] ?? [];
    const concealed = (selfDrawn ? hand : [...hand, tile]).map(kindOf);
    const totalDiscards = s.discards.reduce((n, list) => n + list.length, 0);
    return {
      seat,
      tile: kindOf(tile),
      selfDrawn,
      from,
      concealed,
      melds: s.melds[seat] ?? [],
      bonus: (s.bonus[seat] ?? []).map(kindOf),
      seatWind: seatWind(seat, s.dealer),
      prevailingWind: s.round % 4,
      dealer: seat === s.dealer,
      lastTile: selfDrawn && s.source === 'wall' && s.wall.length <= r.deadWall,
      lastDiscard: !selfDrawn && !robbed && (s.claim?.last ?? false),
      kongs: selfDrawn && s.source === 'replacement' ? s.kongs : 0,
      robbed,
      heavenly: selfDrawn && seat === s.dealer && s.source === 'deal' && s.calls === 0 && totalDiscards === 0,
      earthly: !selfDrawn && !robbed && from === s.dealer && seat !== s.dealer && s.calls === 0 && totalDiscards === 1,
      firstDraw: selfDrawn && seat !== s.dealer && s.source === 'wall' && s.calls === 0 && (s.discards[seat] ?? []).length === 0,
      tiles: [...(selfDrawn ? hand : [...hand, tile]), ...(s.melds[seat] ?? []).flatMap((m) => m.tiles)],
      ...this.indicatorContext(s, seat),
      shown: shownOf(s, kindOf(tile)) - (selfDrawn ? 0 : 1),
      counter: s.counter,
    };
  }

  /** The indicators a winner scores, and its ready declaration. */
  private indicatorContext(s: MahjongState, seat: Seat): Pick<WinContext, 'indicators' | 'underIndicators' | 'ready' | 'oneShot'> {
    const mark = s.ready[seat] ?? null;
    const st = s.indicators;
    const half = st ? st.tiles.length / 2 : 0;
    return {
      indicators: st ? st.tiles.slice(0, st.shown).map(kindOf) : [],
      underIndicators: st && mark ? st.tiles.slice(half, half + st.shown).map(kindOf) : [],
      ready: mark ? (mark.first ? 2 : 1) : 0,
      oneShot: mark?.oneShot ?? false,
    };
  }

  /** The score of a self-drawn win now, or null. */
  selfWinScore(s: MahjongState): HandScore | null {
    if (s.phase !== 'act' || s.claimed || s.drawn === null) return null;
    const r = this.rules(s.config);
    const seat = s.turn;
    const hand = s.hands[seat] ?? [];
    if (!isWinningShape(countsOf(hand), (s.melds[seat] ?? []).length, r.shapes, setsIn(r))) return null;
    return this.style(s.config).score(this.winContext(s, seat, s.drawn, true, null, false), s.config.options);
  }

  private canWinSelf(s: MahjongState): boolean {
    return this.selfWinScore(s) !== null;
  }

  /** The score of winning on the window's tile, or null. */
  claimWinScore(s: MahjongState, seat: Seat, w: ClaimWindow): HandScore | null {
    const r = this.rules(s.config);
    const hand = s.hands[seat] ?? [];
    const counts = countsOf(hand);
    const k = kindOf(w.tile);
    counts[k] = (counts[k] ?? 0) + 1;
    const melds = (s.melds[seat] ?? []).length;
    if (w.kind === 'rob' && w.meld < 0) {
      // A concealed kong may be robbed only to complete thirteen orphans.
      if (!(melds === 0 && isThirteenOrphans(counts))) return null;
    } else if (!isWinningShape(counts, melds, r.shapes, setsIn(r))) return null;
    return this.style(s.config).score(this.winContext(s, seat, w.tile, false, w.from, w.kind === 'rob'), s.config.options);
  }

  private canWinOn(s: MahjongState, seat: Seat, w: ClaimWindow): boolean {
    return this.claimWinScore(s, seat, w) !== null;
  }

  // Doing it

  private act(d: Draft, seat: Seat, action: MahjongAction, events: MahjongEvent[]): void {
    if (action.type === 'win') {
      const tile = d.drawn as TileId;
      const s = freeze(d);
      const score = this.selfWinScore(s) as HandScore;
      this.endWithWins(d, [{ seat, from: null, tile, score, robbed: false }], events);
      return;
    }
    if (action.type === 'kong' && action.tile !== undefined) {
      this.declareKong(d, seat, action.tile, events);
      return;
    }
    if (action.type === 'abort') {
      this.endAbortive(d, 'nine-terminals', seat, events);
      return;
    }
    if (action.type === 'ready') {
      const own = d.discards[seat] as Discard[];
      d.ready = d.ready.map((m, i) => (i === seat ? { at: own.length, first: d.calls === 0 && own.length === 0, oneShot: true, paid: false } : m));
      const hand = d.hands[seat] as TileId[];
      const drawnMatches = d.drawn !== null && kindOf(d.drawn) === action.tile && hand.includes(d.drawn);
      events.push({ type: 'ready', seat, tile: drawnMatches ? (d.drawn as TileId) : (hand[lastIndexOfKind(hand, action.tile)] as TileId) });
      this.discard(d, seat, action.tile, events);
      return;
    }
    if (action.type === 'discard') this.discard(d, seat, action.tile, events);
  }

  private discard(d: Draft, seat: Seat, kind: Kind, events: MahjongEvent[]): void {
    const hand = d.hands[seat] as TileId[];
    const drawnMatches = d.drawn !== null && kindOf(d.drawn) === kind && hand.includes(d.drawn);
    const i = drawnMatches ? hand.indexOf(d.drawn as TileId) : lastIndexOfKind(hand, kind);
    const tile = hand[i] as TileId;
    hand.splice(i, 1);
    const own = d.discards[seat] as Discard[];
    own.push({ tile, claimed: false });
    d.lastDiscard = tile;
    events.push({ type: 'discard', seat, tile });
    const r = this.rules(d.config);
    d.drawn = null;
    d.kongs = 0;
    d.claimed = false;
    d.forbidden = [];
    // A missed win lasts until the seat's next throw (for the hand, once it has declared ready).
    if (d.missed[seat] === 'turn') d.missed = d.missed.map((m, i) => (i === seat ? null : m));
    // The seat's second throw after declaring ends its one-shot chance.
    const mark = d.ready[seat];
    if (mark && mark.oneShot && mark.at !== own.length - 1) d.ready = d.ready.map((m, i) => (i === seat && m ? { ...m, oneShot: false } : m));
    // Indicators owed by an exposed or added kong are turned now.
    if (d.indicators && d.indicators.pending > 0) this.turnIndicators(d, d.indicators.pending, events);
    d.claim = { kind: 'discard', tile, from: seat, waiting: [1, 2, 3].map((i2) => (seat + i2) % SEATS), declared: [], meld: -1, last: d.wall.length <= r.deadWall };
    d.phase = 'claim';
    this.advanceWindow(d, events);
  }

  private declareKong(d: Draft, seat: Seat, kind: Kind, events: MahjongEvent[]): void {
    const r = this.rules(d.config);
    const hand = d.hands[seat] as TileId[];
    const melds = d.melds[seat] as Meld[];
    const pungAt = melds.findIndex((m) => m.type === 'pung' && kindOf(m.tiles[0] as TileId) === kind);
    let meldIndex: number;
    let tile: TileId;
    let added: boolean;
    if (pungAt >= 0 && hand.filter((t) => kindOf(t) === kind).length < 4) {
      const i = lastIndexOfKind(hand, kind);
      tile = hand[i] as TileId;
      hand.splice(i, 1);
      const pung = melds[pungAt] as Meld;
      melds[pungAt] = { ...pung, type: 'kong', tiles: [...pung.tiles, tile], added: true };
      meldIndex = pungAt;
      added = true;
    } else {
      const tiles = hand.filter((t) => kindOf(t) === kind);
      for (const t of tiles) hand.splice(hand.indexOf(t), 1);
      melds.push({ type: 'kong', tiles, claimed: null, from: null, concealed: true, added: false });
      meldIndex = melds.length - 1;
      tile = tiles[tiles.length - 1] as TileId;
      added = false;
    }
    if (d.drawn !== null && !hand.includes(d.drawn)) d.drawn = null;
    d.calls++;
    d.kongs++;
    this.breakOneShot(d);
    events.push({ type: 'kong', seat, meld: melds[meldIndex] as Meld, added });
    if (d.indicators) {
      if (!added || r.kongIndicator !== 'late') this.turnIndicators(d, 1, events);
      else d.indicators = { ...d.indicators, pending: d.indicators.pending + 1 };
    }
    // Robbing: an added kong, or a concealed kong by thirteen orphans when the style allows it.
    if ((added && r.calls.robKong) || (!added && r.calls.robConcealedWithOrphans)) {
      d.claim = { kind: 'rob', tile, from: seat, waiting: [1, 2, 3].map((i) => (seat + i) % SEATS), declared: [], meld: added ? meldIndex : -1 - meldIndex, last: false };
      d.phase = 'rob';
      this.advanceWindow(d, events);
      return;
    }
    this.replacement(d, seat, events);
  }

  private declare(d: Draft, seat: Seat, action: MahjongAction, events: MahjongEvent[]): void {
    const w = d.claim as ClaimWindow;
    // Passing a win you could have taken makes you furiten (where the style has furiten).
    if (action.type !== 'win' && this.rules(d.config).calls.furiten && this.claimOptions(freeze(d), seat).some((a) => a.type === 'win')) {
      d.missed = d.missed.map((m, i) => (i === seat ? (d.ready[seat] ? 'hand' : 'turn') : m));
    }
    const declared: Declaration[] =
      action.type === 'win' || action.type === 'kong' || action.type === 'pung' || action.type === 'chow' ? [...w.declared, { seat, call: action.type, ...(action.type === 'chow' ? { start: action.start } : {}) }] : [...w.declared];
    d.claim = { ...w, waiting: w.waiting.filter((x) => x !== seat), declared };
    this.advanceWindow(d, events);
  }

  /** Skips seats that can no longer call anything that counts; closes the window when nobody is left. */
  private advanceWindow(d: Draft, events: MahjongEvent[]): void {
    for (;;) {
      const w = d.claim as ClaimWindow;
      const next = w.waiting[0];
      if (next === undefined) {
        this.resolveWindow(d, events);
        return;
      }
      if (this.claimOptions(freeze(d), next).length > 0) {
        d.turn = next;
        return;
      }
      d.claim = { ...w, waiting: w.waiting.slice(1) };
    }
  }

  private resolveWindow(d: Draft, events: MahjongEvent[]): void {
    const w = d.claim as ClaimWindow;
    const r = this.rules(d.config);
    const wins = w.declared.filter((x) => x.call === 'win');
    if (r.calls.maxWinners !== undefined && wins.length > r.calls.maxWinners) {
      this.endAbortive(d, 'too-many-winners', null, events);
      return;
    }
    if (wins.length > 0) {
      const s = freeze(d);
      const records: WinRecord[] = wins.map((x) => ({ seat: x.seat, from: w.from, tile: w.tile, score: this.claimWinScore(s, x.seat, w) as HandScore, robbed: w.kind === 'rob' }));
      this.endWithWins(d, records, events);
      return;
    }
    if (w.kind === 'rob') {
      d.claim = null;
      d.phase = 'act';
      d.turn = w.from;
      this.replacement(d, w.from, events);
      return;
    }
    // The throw passed without a win: a ready declaration's stake goes on the table.
    const mark = d.ready[w.from];
    if (mark && !mark.paid && r.ready) {
      d.scores = d.scores.map((v, i) => (i === w.from ? v - (r.ready?.stake ?? 0) : v));
      d.stakes++;
      d.ready = d.ready.map((m, i) => (i === w.from && m ? { ...m, paid: true } : m));
      events.push({ type: 'stake', seat: w.from, amount: r.ready.stake });
    }
    const aborts = r.aborts;
    if (aborts) {
      if (aborts.fourReady && d.ready.every((m) => m?.paid)) {
        this.endAbortive(d, 'four-ready', null, events);
        return;
      }
      const first = d.discards.map((list) => list[0]?.tile);
      if (aborts.fourWinds && d.calls === 0 && d.discards.every((list) => list.length === 1)) {
        const kinds = first.map((t) => (t ? kindOf(t) : -1));
        if (isWind(kinds[0] ?? -1) && kinds.every((k) => k === kinds[0])) {
          this.endAbortive(d, 'four-winds', null, events);
          return;
        }
      }
      if (aborts.fourKongs) {
        const owners = d.melds.map((list) => list.filter((m) => m.type === 'kong').length);
        if (owners.reduce((a, b) => a + b, 0) >= 4 && owners.filter((n) => n > 0).length > 1) {
          this.endAbortive(d, 'four-kongs', null, events);
          return;
        }
      }
    }
    const call = w.declared.find((x) => x.call === 'kong' || x.call === 'pung') ?? w.declared.find((x) => x.call === 'chow');
    if (call) {
      this.makeCall(d, call, w, events);
      return;
    }
    this.nextTurn(d, (w.from + 1) % SEATS, events);
  }

  private makeCall(d: Draft, call: Declaration, w: ClaimWindow, events: MahjongEvent[]): void {
    const seat = call.seat;
    const hand = d.hands[seat] as TileId[];
    const k = kindOf(w.tile);
    markClaimed(d, w.from, w.tile);
    let fromHand: TileId[];
    let type: 'chow' | 'pung' | 'kong';
    if (call.call === 'chow') {
      const start = call.start as Kind;
      fromHand = [start, start + 1, start + 2].filter((x) => x !== k).map((x) => hand[lastIndexOfKind(hand, x)] as TileId);
      type = 'chow';
    } else {
      const n = call.call === 'kong' ? 3 : 2;
      fromHand = hand.filter((t) => kindOf(t) === k).slice(-n);
      type = call.call === 'kong' ? 'kong' : 'pung';
    }
    for (const t of fromHand) hand.splice(hand.indexOf(t), 1);
    const tiles = [...fromHand, w.tile].sort((a, b) => kindOf(a) - kindOf(b));
    const meld: Meld = { type, tiles, claimed: w.tile, from: w.from, concealed: false, added: false };
    (d.melds[seat] as Meld[]).push(meld);
    events.push({ type: 'call', seat, call: type, tile: w.tile, from: w.from, meld });
    d.calls++;
    d.claim = null;
    d.turn = seat;
    d.phase = 'act';
    d.drawn = null;
    this.breakOneShot(d);
    const r = this.rules(d.config);
    if (type === 'kong') {
      d.claimed = false;
      d.kongs = 1;
      if (d.indicators) {
        if (r.kongIndicator === 'late') d.indicators = { ...d.indicators, pending: d.indicators.pending + 1 };
        else this.turnIndicators(d, 1, events);
      }
      this.replacement(d, seat, events);
    } else {
      d.claimed = true;
      d.kongs = 0;
      d.source = 'call';
      d.forbidden = r.calls.noSwapCall ? swapForbidden(type, call.start, k) : [];
    }
  }

  /** Any call or kong ends every seat's one-shot chance. */
  private breakOneShot(d: Draft): void {
    if (d.ready.some((m) => m?.oneShot)) d.ready = d.ready.map((m) => (m ? { ...m, oneShot: false } : m));
  }

  /** Turns up the next indicators (up to the number set aside). */
  private turnIndicators(d: Draft, n: number, events: MahjongEvent[]): void {
    const st = d.indicators;
    if (!st) return;
    const max = st.tiles.length / 2;
    let shown = st.shown;
    for (let i = 0; i < n && shown < max; i++) {
      events.push({ type: 'indicator', tile: st.tiles[shown] as TileId });
      shown++;
    }
    d.indicators = { ...st, shown, pending: 0 };
  }

  /** The next player draws from the front of the wall, or the hand is drawn when none is left. */
  private nextTurn(d: Draft, seat: Seat, events: MahjongEvent[]): void {
    const r = this.rules(d.config);
    d.claim = null;
    d.turn = seat;
    d.phase = 'act';
    d.claimed = false;
    d.kongs = 0;
    if (d.wall.length <= r.deadWall) {
      this.endDrawn(d, events);
      return;
    }
    const tile = d.wall.shift() as TileId;
    events.push({ type: 'draw', seat, tile, from: 'front', wall: d.wall.length });
    d.source = 'wall';
    this.keep(d, seat, tile, events);
  }

  /** A replacement from the back of the wall, after a kong. */
  private replacement(d: Draft, seat: Seat, events: MahjongEvent[]): void {
    const tile = d.wall.pop() as TileId;
    events.push({ type: 'draw', seat, tile, from: 'back', wall: d.wall.length });
    d.turn = seat;
    d.phase = 'act';
    d.source = 'replacement';
    this.keep(d, seat, tile, events);
  }

  /** Puts a drawn tile in the hand, setting bonus tiles aside and replacing them from the back. */
  private keep(d: Draft, seat: Seat, first: TileId, events: MahjongEvent[]): void {
    const r = this.rules(d.config);
    let tile = first;
    while (r.replaceBonus && isBonus(kindOf(tile))) {
      (d.bonus[seat] as TileId[]).push(tile);
      events.push({ type: 'bonus', seat, tile });
      if (d.wall.length <= r.deadWall) {
        this.endDrawn(d, events);
        return;
      }
      tile = d.wall.pop() as TileId;
      events.push({ type: 'draw', seat, tile, from: 'back', wall: d.wall.length });
    }
    (d.hands[seat] as TileId[]).push(tile);
    d.drawn = tile;
  }

  private endWithWins(d: Draft, wins: readonly WinRecord[], events: MahjongEvent[]): void {
    const w = d.claim;
    for (const win of wins) events.push({ type: 'win', win });
    if (w && wins.some((x) => x.from !== null)) {
      // The tile goes to the winner (the first, when several win on it).
      const first = wins[0] as WinRecord;
      if (w.kind === 'discard') markClaimed(d, w.from, w.tile);
      else {
        const melds = d.melds[w.from] as Meld[];
        const index = w.meld >= 0 ? w.meld : -1 - w.meld;
        const kong = melds[index] as Meld;
        if (kong.added) melds[index] = { ...kong, type: 'pung', tiles: kong.tiles.filter((t) => t !== w.tile), added: false };
        else {
          melds.splice(index, 1);
          for (const t of kong.tiles) if (t !== w.tile) (d.hands[w.from] as TileId[]).push(t);
        }
      }
      (d.hands[first.seat] as TileId[]).push(w.tile);
    }
    const deltas = this.style(d.config).settle({ wins, dealer: d.dealer, seats: SEATS, counter: d.counter, stakes: d.stakes }, d.config.options);
    const st = d.indicators;
    const readyWinner = wins.some((x) => d.ready[x.seat]);
    const extra = st ? { indicators: st.tiles.slice(0, st.shown), ...(readyWinner ? { under: st.tiles.slice(st.tiles.length / 2, st.tiles.length / 2 + st.shown) } : {}) } : {};
    this.finishHand(d, wins, deltas, events, extra);
    d.stakes = 0;
  }

  /** The wall ran out: the style may pay for ready hands (or all-terminal discards). */
  private endDrawn(d: Draft, events: MahjongEvent[]): void {
    events.push({ type: 'exhausted' });
    const r = this.rules(d.config);
    const style = this.style(d.config);
    const ready = d.hands.map((h, seat) => waitsOf(countsOf(h), (d.melds[seat] ?? []).length, r.shapes, setsIn(r)).length > 0);
    const allTerminalDiscards = d.discards.flatMap((list, seat) => (list.length > 0 && list.every((x) => !x.claimed && isTerminalOrHonour(kindOf(x.tile))) ? [seat] : []));
    const deltas = style.settleDraw ? style.settleDraw({ dealer: d.dealer, seats: SEATS, reason: 'exhausted', ready, allTerminalDiscards, counter: d.counter }, d.config.options) : [0, 0, 0, 0];
    this.finishHand(d, [], deltas, events, { reason: 'exhausted', ...(style.settleDraw ? { ready } : {}), ...(d.indicators ? { indicators: d.indicators.tiles.slice(0, d.indicators.shown) } : {}) });
  }

  /** A hand abandoned by an abortive-draw rule: nobody pays, and the stakes stay on the table. */
  private endAbortive(d: Draft, reason: DrawReason, seat: Seat | null, events: MahjongEvent[]): void {
    events.push({ type: 'abort', reason, seat });
    this.finishHand(d, [], [0, 0, 0, 0], events, { reason, ...(d.indicators ? { indicators: d.indicators.tiles.slice(0, d.indicators.shown) } : {}) });
  }

  private finishHand(d: Draft, wins: readonly WinRecord[], deltas: readonly number[], events: MahjongEvent[], extra: Partial<HandResult> = {}): void {
    const result: HandResult = {
      ...extra,
      ...(this.rules(d.config).ready || d.counter > 0 || d.stakes > 0 ? { counter: d.counter, stakes: d.stakes } : {}),
      handNo: d.handNo,
      round: d.round,
      dealer: d.dealer,
      wins,
      deltas,
      hands: d.hands.map((h) => [...h]),
      melds: d.melds.map((m) => [...m]),
      bonus: d.bonus.map((b) => [...b]),
      wallLeft: d.wall.length,
    };
    d.scores = d.scores.map((v, i) => v + (deltas[i] ?? 0));
    d.results = [...d.results, result];
    events.push({ type: 'hand-end', result, scores: d.scores });
    d.claim = null;
    d.phase = 'scored';
    d.turn = 0;
    d.drawn = null;
    if (this.afterHand(d).over) {
      d.over = true;
      events.push({ type: 'game-end', scores: d.scores });
    }
  }

  /** Who deals next, the round, and whether the game is over, after the last hand. */
  afterHand(s: Pick<MahjongState, 'config' | 'results' | 'dealer' | 'round' | 'passes' | 'repeats' | 'scores' | 'counter'>): { dealer: Seat; round: number; passes: number; repeats: number; counter: number; over: boolean } {
    const style = this.style(s.config);
    const r = style.rules(s.config.options);
    const last = s.results[s.results.length - 1];
    let { dealer, round, passes, repeats, counter } = s;
    let keeps = false;
    if (last) {
      const hand: HandEnd = {
        winners: last.wins.map((w) => w.seat),
        dealer: last.dealer,
        drawn: last.wins.length === 0,
        ...(last.reason && last.reason !== 'exhausted' ? { abortive: last.reason } : {}),
        ...(last.ready ? { ready: last.ready } : {}),
      };
      keeps = style.dealerKeeps(hand, s.config.options);
      counter = style.nextCounter ? style.nextCounter(hand, s.counter, s.config.options) : 0;
      if (keeps) repeats++;
      else {
        dealer = (dealer + 1) % SEATS;
        passes++;
        repeats = 0;
        if (passes >= SEATS) {
          round++;
          passes = 0;
        }
      }
    }
    let over = r.rounds === 0 ? s.results.length >= 1 : round >= r.rounds || s.results.length >= r.rounds * r.handsPerRound;
    if (last && style.gameOver && r.rounds > 0) {
      const decided = style.gameOver({ scores: s.scores, round: last.round, passes: s.passes, nextRound: round, dealerKeeps: keeps, dealer: last.dealer, hands: s.results.length, rounds: r.rounds }, s.config.options);
      // The hand cap still ends a game that would otherwise run on.
      if (decided !== null) over = decided || s.results.length >= (r.rounds + 1) * r.handsPerRound;
    }
    return { dealer, round, passes, repeats, counter, over };
  }

  private nextHand(d: Draft, events: MahjongEvent[]): void {
    const next = this.afterHand(d);
    d.dealer = next.dealer;
    d.round = next.round;
    d.passes = next.passes;
    d.repeats = next.repeats;
    d.counter = next.counter;
    d.handNo++;
    this.deal(d, events);
  }

  private deal(d: Draft, events: MahjongEvent[]): void {
    const r = this.rules(d.config);
    const wall = createRng(`${d.seed}/hand/${d.handNo}`).shuffle(tileSet(r.tiles));
    const hands: TileId[][] = [[], [], [], []];
    const order = [0, 1, 2, 3].map((i) => (d.dealer + i) % SEATS);
    while ((hands[d.dealer] as TileId[]).length < r.handSize) {
      for (const seat of order) {
        const hand = hands[seat] as TileId[];
        const n = Math.min(4, r.handSize - hand.length);
        for (let i = 0; i < n; i++) hand.push(wall.shift() as TileId);
      }
    }
    let last = wall.shift() as TileId;
    (hands[d.dealer] as TileId[]).push(last);
    // Indicator stacks (and the tiles under them) are set aside from the end of the wall.
    d.indicators = r.indicators ? { tiles: wall.splice(wall.length - 2 * r.indicators, 2 * r.indicators), shown: 1, pending: 0 } : null;
    d.ready = [null, null, null, null];
    d.missed = [null, null, null, null];
    d.forbidden = [];
    d.wall = wall;
    d.hands = hands;
    d.melds = [[], [], [], []];
    d.discards = [[], [], [], []];
    d.bonus = [[], [], [], []];
    d.turn = d.dealer;
    d.phase = 'act';
    d.claim = null;
    d.claimed = false;
    d.kongs = 0;
    d.calls = 0;
    d.lastDiscard = null;
    d.source = 'deal';
    events.push({ type: 'deal', handNo: d.handNo, round: d.round, dealer: d.dealer, wall: d.wall.length });
    if (r.replaceBonus && r.tiles.bonus) {
      for (const seat of order) {
        const hand = hands[seat] as TileId[];
        for (;;) {
          const i = hand.findIndex((t) => isBonus(kindOf(t)));
          if (i < 0) break;
          const tile = hand[i] as TileId;
          hand.splice(i, 1);
          (d.bonus[seat] as TileId[]).push(tile);
          events.push({ type: 'bonus', seat, tile });
          const replacement = d.wall.pop() as TileId;
          hand.push(replacement);
          events.push({ type: 'draw', seat, tile: replacement, from: 'back', wall: d.wall.length });
          if (seat === d.dealer && tile === last) last = replacement;
        }
      }
    }
    d.drawn = (hands[d.dealer] as TileId[]).includes(last) ? last : ((hands[d.dealer] as TileId[])[(hands[d.dealer] as TileId[]).length - 1] ?? null);
  }
}

// Helpers

export const PRIORITY: Readonly<Record<CallType, number>> = { win: 3, kong: 2, pung: 2, chow: 1 };

/** Sets in a complete hand: four for 13 tiles, five for 16. */
export function setsIn(r: Pick<StyleRules, 'handSize'>): number {
  return Math.floor(r.handSize / 3);
}

/** A seat's wind (0 East to 3 North) when `dealer` deals. */
export function seatWind(seat: Seat, dealer: Seat): number {
  return (seat - dealer + SEATS) % SEATS;
}

/** Copies of a kind face up on the table: discards still lying there and called sets (a concealed kong lies face down). */
export function shownOf(s: Pick<MahjongState, 'discards' | 'melds'>, kind: Kind): number {
  let n = 0;
  for (const list of s.discards) for (const d of list) if (!d.claimed && kindOf(d.tile) === kind) n++;
  for (const list of s.melds) for (const m of list) if (!m.concealed) for (const t of m.tiles) if (kindOf(t) === kind) n++;
  return n;
}

function lastIndexOfKind(hand: readonly TileId[], kind: Kind): number {
  for (let i = hand.length - 1; i >= 0; i--) if (kindOf(hand[i] as TileId) === kind) return i;
  throw new Error(`No ${kind} in the hand`);
}

function markClaimed(d: Draft, from: Seat, tile: TileId): void {
  const list = d.discards[from] as Discard[];
  const i = list.findIndex((x) => x.tile === tile);
  if (i >= 0) list[i] = { tile, claimed: true };
}

export function actionKey(a: MahjongAction): string {
  switch (a.type) {
    case 'discard':
      return `d${a.tile}`;
    case 'kong':
      return a.tile === undefined ? 'kong' : `kong${a.tile}`;
    case 'chow':
      return `chow${a.start}`;
    case 'ready':
      return `ready${a.tile}`;
    default:
      return a.type;
  }
}

/** Kinds a seat may not throw just after a call, when swap calling is forbidden. */
export function swapForbidden(type: 'chow' | 'pung', start: Kind | undefined, called: Kind): Kind[] {
  if (type === 'pung' || start === undefined) return [called];
  const out = [called];
  // Called at one end of the run: the tile beyond the other end would make the same run again.
  if (called === start && rankOf(start) <= 6) out.push(start + 3);
  if (called === start + 2 && rankOf(start) >= 2 && suitOf(start - 1) === suitOf(start)) out.push(start - 1);
  return out;
}

/** A mutable copy of a state, for building the next one inside `apply`. */
interface Draft {
  config: MahjongConfig;
  seed: string;
  table: number;
  handNo: number;
  round: number;
  dealer: Seat;
  passes: number;
  repeats: number;
  scores: number[];
  results: HandResult[];
  wall: TileId[];
  hands: TileId[][];
  melds: Meld[][];
  discards: Discard[][];
  bonus: TileId[][];
  turn: Seat;
  phase: Phase;
  drawn: TileId | null;
  source: MahjongState['source'];
  kongs: number;
  claimed: boolean;
  claim: ClaimWindow | null;
  calls: number;
  lastDiscard: TileId | null;
  over: boolean;
  indicators: IndicatorStacks | null;
  ready: readonly (ReadyMark | null)[];
  stakes: number;
  counter: number;
  missed: readonly ('turn' | 'hand' | null)[];
  forbidden: readonly Kind[];
}

function draft(s: MahjongState): Draft {
  return {
    ...s,
    scores: [...s.scores],
    results: [...s.results],
    wall: [...s.wall],
    hands: s.hands.map((h) => [...h]),
    melds: s.melds.map((m) => [...m]),
    discards: s.discards.map((x) => [...x]),
    bonus: s.bonus.map((b) => [...b]),
  };
}

function freeze(d: Draft): MahjongState {
  return { ...d };
}
