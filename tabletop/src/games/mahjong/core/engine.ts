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
import { isThirteenOrphans, isWinningShape } from './shapes';
import type { HandScore, Meld, Style, StyleOptions, StyleRules, WinContext, WinRecord } from './style';
import type { Kind, TileId } from './tiles';
import { countsOf, isBonus, isSuited, kindOf, rankOf, tileSet } from './tiles';

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
}

export type MahjongAction =
  | { readonly type: 'discard'; readonly tile: Kind }
  /** With a tile: a concealed or added kong on your turn. Without: an exposed kong on a discard. */
  | { readonly type: 'kong'; readonly tile?: Kind }
  | { readonly type: 'win' }
  | { readonly type: 'pung' }
  | { readonly type: 'chow'; readonly start: Kind }
  | { readonly type: 'pass' }
  | { readonly type: 'next' };

export type MahjongEvent =
  | { readonly type: 'deal'; readonly handNo: number; readonly round: number; readonly dealer: Seat; readonly wall: number }
  | { readonly type: 'bonus'; readonly seat: Seat; readonly tile: TileId }
  | { readonly type: 'draw'; readonly seat: Seat; readonly tile: TileId; readonly from: 'front' | 'back'; readonly wall: number }
  | { readonly type: 'discard'; readonly seat: Seat; readonly tile: TileId }
  | { readonly type: 'call'; readonly seat: Seat; readonly call: 'chow' | 'pung' | 'kong'; readonly tile: TileId; readonly from: Seat; readonly meld: Meld }
  | { readonly type: 'kong'; readonly seat: Seat; readonly meld: Meld; readonly added: boolean }
  | { readonly type: 'win'; readonly win: WinRecord }
  | { readonly type: 'exhausted' }
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
    const blank: Draft = {
      config,
      seed,
      table,
      handNo: 0,
      round: 0,
      dealer,
      passes: 0,
      repeats: 0,
      scores: [0, 0, 0, 0],
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
    if (s.claimed) return discards;
    const out: MahjongAction[] = [];
    if (this.canWinSelf(s)) out.push({ type: 'win' });
    if (s.wall.length > r.deadWall) {
      if (r.calls.concealedKong) for (const k of kinds) if ((counts[k] ?? 0) === 4) out.push({ type: 'kong', tile: k });
      if (r.calls.addedKong) {
        for (const m of s.melds[seat] ?? []) {
          if (m.type !== 'pung') continue;
          const k = kindOf(m.tiles[0] as TileId);
          if ((counts[k] ?? 0) >= 1) out.push({ type: 'kong', tile: k });
        }
      }
    }
    return [...out, ...discards];
  }

  private claimOptions(s: MahjongState, seat: Seat): MahjongAction[] {
    const w = s.claim;
    if (!w || w.from === seat) return [];
    const r = this.rules(s.config);
    const k = kindOf(w.tile);
    const anyWin = w.declared.some((x) => x.call === 'win');
    const best = Math.max(0, ...w.declared.map((x) => PRIORITY[x.call]));
    const out: MahjongAction[] = [];
    if ((r.calls.multipleWinners || !anyWin) && this.canWinOn(s, seat, w)) out.push({ type: 'win' });
    if (w.kind === 'discard' && !w.last && !anyWin) {
      const hand = s.hands[seat] ?? [];
      const counts = countsOf(hand);
      const n = counts[k] ?? 0;
      if (best < 2) {
        if (r.calls.kong && n >= 3 && s.wall.length > r.deadWall) out.push({ type: 'kong' });
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
    if (action.type === 'discard') this.discard(d, seat, action.tile, events);
  }

  private discard(d: Draft, seat: Seat, kind: Kind, events: MahjongEvent[]): void {
    const hand = d.hands[seat] as TileId[];
    const drawnMatches = d.drawn !== null && kindOf(d.drawn) === kind && hand.includes(d.drawn);
    const i = drawnMatches ? hand.indexOf(d.drawn as TileId) : lastIndexOfKind(hand, kind);
    const tile = hand[i] as TileId;
    hand.splice(i, 1);
    (d.discards[seat] as Discard[]).push({ tile, claimed: false });
    d.lastDiscard = tile;
    events.push({ type: 'discard', seat, tile });
    const r = this.rules(d.config);
    d.drawn = null;
    d.kongs = 0;
    d.claimed = false;
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
    events.push({ type: 'kong', seat, meld: melds[meldIndex] as Meld, added });
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
    const declared = action.type === 'pass' || action.type === 'next' || action.type === 'discard' ? w.declared : [...w.declared, { seat, call: action.type, ...(action.type === 'chow' ? { start: action.start } : {}) }];
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
    const wins = w.declared.filter((x) => x.call === 'win');
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
    if (type === 'kong') {
      d.claimed = false;
      d.kongs = 1;
      this.replacement(d, seat, events);
    } else {
      d.claimed = true;
      d.kongs = 0;
      d.source = 'call';
    }
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
    const deltas = this.style(d.config).settle({ wins, dealer: d.dealer, seats: SEATS }, d.config.options);
    this.finishHand(d, wins, deltas, events);
  }

  private endDrawn(d: Draft, events: MahjongEvent[]): void {
    events.push({ type: 'exhausted' });
    this.finishHand(d, [], [0, 0, 0, 0], events);
  }

  private finishHand(d: Draft, wins: readonly WinRecord[], deltas: readonly number[], events: MahjongEvent[]): void {
    const result: HandResult = {
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
  afterHand(s: Pick<MahjongState, 'config' | 'results' | 'dealer' | 'round' | 'passes' | 'repeats'>): { dealer: Seat; round: number; passes: number; repeats: number; over: boolean } {
    const style = this.style(s.config);
    const r = style.rules(s.config.options);
    const last = s.results[s.results.length - 1];
    let { dealer, round, passes, repeats } = s;
    if (last) {
      const keeps = style.dealerKeeps({ winners: last.wins.map((w) => w.seat), dealer: last.dealer, drawn: last.wins.length === 0 }, s.config.options);
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
    const over = r.rounds === 0 ? s.results.length >= 1 : round >= r.rounds || s.results.length >= r.rounds * r.handsPerRound;
    return { dealer, round, passes, repeats, over };
  }

  private nextHand(d: Draft, events: MahjongEvent[]): void {
    const next = this.afterHand(d);
    d.dealer = next.dealer;
    d.round = next.round;
    d.passes = next.passes;
    d.repeats = next.repeats;
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
    default:
      return a.type;
  }
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
