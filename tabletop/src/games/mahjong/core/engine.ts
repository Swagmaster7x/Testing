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
import type { DrawInput, DrawReason, HandEnd, HandScore, Meld, PassRound, Payment, Style, StyleOptions, StyleRules, WinContext, WinRecord } from './style';
import type { Kind, TileId } from './tiles';
import { codeOf, countsOf, FLOWER_1, isBonus, isSuited, isTerminalOrHonour, isWind, JOKER, kindOf, ORPHANS, rankOf, suitOf, tileSet } from './tiles';

export const SEATS = 4;

export interface MahjongConfig {
  readonly style: string;
  readonly options: StyleOptions;
  /** A position to start from instead of a deal ("play on from here"), in state notation. */
  readonly start?: string;
}

export type Phase = 'act' | 'claim' | 'rob' | 'scored' | 'pass' | 'void';
export type CallType = 'win' | 'kong' | 'pung' | 'chow' | 'expose';

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
  /** An exposure's size and the jokers it takes from the hand. */
  readonly size?: number;
  readonly jokers?: number;
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
  /** Discard: thrown right after the thrower's own kong. */
  readonly afterKong?: boolean;
}

/** Tiles being passed before play (styles with passes): the round under way and the choices so far. */
export interface PassState {
  /** Index into the style's pass rounds. */
  readonly round: number;
  /** The direction of a round set by the dice (1 right, 2 across, 3 left). */
  readonly dice: number;
  /** This round opens with a vote on playing its group. */
  readonly voting: boolean;
  /** Seats still to choose, in turn order from the dealer; the first is the seat to act. */
  readonly waiting: readonly Seat[];
  /** Each seat's tiles to pass (kinds), hidden from the others until the round is done. */
  readonly chosen: readonly (readonly Kind[] | null)[];
  /** How many tiles each seat passes on unseen (a blind pass). */
  readonly blind: readonly number[];
  readonly votes: readonly (boolean | null)[];
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
  /** Styles that report it: each seat's standing when the wall ran out ("won", "ready", "not-ready", "pig"). */
  readonly status?: readonly string[];
  /** Payments made during the hand (kongs, wins in a hand that went on), in order. */
  readonly payments?: readonly Payment[];
  /** Void suits declared this hand. */
  readonly voids?: readonly (number | null)[];
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
  /** Each seat's declared void suit this hand (styles with a void declaration). */
  readonly voids: readonly (number | null)[];
  /** Wins so far in a hand that goes on after a win; those seats are out of the hand. */
  readonly won: readonly WinRecord[];
  /** Each seat's gain or loss so far in this hand (kongs paid at once, wins in a hand that goes on). */
  readonly paid: readonly number[];
  /** The payments behind `paid`, in order. */
  readonly ledger: readonly Payment[];
  /** Tiles being passed before play, or null. */
  readonly passing: PassState | null;
  /** The tiles each seat received in the last pass (shown only to that seat). */
  readonly received: readonly (readonly TileId[])[];
  /** Dead hands (American): exposures that fit no hand. A dead seat may not call or win. */
  readonly dead: readonly boolean[];
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
  | { readonly type: 'abort' }
  /** Pass these tiles (kinds) in a passing round, and `blind` more of those received, unseen. */
  | { readonly type: 'pass-tiles'; readonly tiles: readonly Kind[]; readonly blind: number }
  /** Vote to play (or skip) the passing rounds that follow. */
  | { readonly type: 'vote'; readonly yes: boolean }
  /** Declare a suit void: 0 characters, 1 dots, 2 bamboo. */
  | { readonly type: 'void'; readonly suit: number }
  /** Call a discard for an exposure of `size` tiles, `jokers` of them jokers from the hand. */
  | { readonly type: 'expose'; readonly size: number; readonly jokers: number }
  /** Take a joker from a seat's exposure by putting in the tile it stands for. */
  | { readonly type: 'swap'; readonly seat: Seat; readonly meld: number };

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
  | { readonly type: 'passed'; readonly round: number; readonly dir: number; readonly counts: readonly number[] }
  | { readonly type: 'vote-result'; readonly round: number; readonly yes: boolean }
  | { readonly type: 'voids'; readonly voids: readonly (number | null)[] }
  | { readonly type: 'pay'; readonly reason: string; readonly seat: Seat; readonly deltas: readonly number[] }
  | { readonly type: 'swap'; readonly seat: Seat; readonly from: Seat; readonly tile: TileId; readonly joker: TileId }
  | { readonly type: 'dead'; readonly seat: Seat }
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
      voids: [null, null, null, null],
      won: [],
      paid: [0, 0, 0, 0],
      ledger: [],
      passing: null,
      received: [[], [], [], []],
      dead: [false, false, false, false],
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
      case 'pass':
        return this.passOptions(s, seat);
      case 'void':
        return [0, 1, 2].map((suit): MahjongAction => ({ type: 'void', suit }));
    }
  }

  /** Whether a seat has won and left a hand that goes on after a win. */
  isOut(s: Pick<MahjongState, 'won'>, seat: Seat): boolean {
    return s.won.some((w) => w.seat === seat);
  }

  /** The next seat in turn after `seat` still in the hand. */
  private nextIn(s: Pick<MahjongState, 'won'>, seat: Seat): Seat {
    for (let i = 1; i <= SEATS; i++) {
      const t = (seat + i) % SEATS;
      if (!this.isOut(s, t)) return t;
    }
    return (seat + 1) % SEATS;
  }

  /** The other seats still in the hand, in turn order after `seat`. */
  private othersIn(s: Pick<MahjongState, 'won'>, seat: Seat): Seat[] {
    return [1, 2, 3].map((i) => (seat + i) % SEATS).filter((t) => !this.isOut(s, t));
  }

  /** The kinds a seat must throw first: tiles of its void suit still in its hand. */
  voidKinds(s: Pick<MahjongState, 'voids' | 'hands'>, seat: Seat): Kind[] {
    const v = s.voids[seat];
    if (v === null || v === undefined) return [];
    return [...new Set((s.hands[seat] ?? []).map(kindOf).filter((k) => isSuited(k) && suitOf(k) === v))].sort((a, b) => a - b);
  }

  /** Exposures a seat may call on a discard of `k`: each size, with each number of jokers its hand allows. */
  private exposeOptions(s: MahjongState, seat: Seat, k: Kind): MahjongAction[] {
    const r = this.rules(s.config);
    const style = this.style(s.config);
    const hand = s.hands[seat] ?? [];
    const same = (t: TileId) => kindOf(t) === k || (isBonus(k) && isBonus(kindOf(t)));
    const naturals = hand.filter(same).length;
    const jokers = hand.filter((t) => kindOf(t) === JOKER).length;
    const out: MahjongAction[] = [];
    for (const size of r.calls.expose?.sizes ?? []) {
      for (let j = 0; j <= Math.min(jokers, size - 1); j++) {
        if (size - 1 - j > naturals) continue;
        if (r.calls.expose?.refuseDead && style.exposuresFit && !style.exposuresFit([...(s.melds[seat] ?? []), sampleExposure(k, size, j)], s.config.options)) continue;
        out.push({ type: 'expose', size, jokers: j });
      }
    }
    return out;
  }

  /** Joker exchanges open to a seat: a joker in a live exposure whose kind the seat holds. */
  private swapOptions(s: MahjongState, seat: Seat): MahjongAction[] {
    const out: MahjongAction[] = [];
    const hand = s.hands[seat] ?? [];
    for (let t = 0; t < SEATS; t++) {
      if (s.dead[t]) continue;
      (s.melds[t] ?? []).forEach((m, i) => {
        if (m.kind === undefined || !m.tiles.some((x) => kindOf(x) === JOKER)) return;
        const k = m.kind;
        if (hand.some((x) => kindOf(x) === k || (isBonus(k) && isBonus(kindOf(x))))) out.push({ type: 'swap', seat: t, meld: i });
      });
    }
    return out;
  }

  /** The pass round under way. */
  passRound(s: Pick<MahjongState, 'config' | 'passing'>): PassRound | null {
    const p = s.passing;
    return p ? (this.rules(s.config).passes?.rounds[p.round] ?? null) : null;
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
    else if (s.phase === 'pass') this.passChoice(d, seat, action, events);
    else if (s.phase === 'void') this.voidChoice(d, seat, action, events);
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
    // A void suit still in the hand is thrown first.
    const voidFirst = this.voidKinds(s, seat);
    const discards: MahjongAction[] = (voidFirst.length > 0 ? voidFirst : kinds).map((tile) => ({ type: 'discard', tile }));
    const voidSuit = s.voids[seat] ?? null;
    const notVoid = (k: Kind) => voidSuit === null || !isSuited(k) || suitOf(k) !== voidSuit;
    if (s.claimed) {
      // Swap calling: the called kind (and a chow's other end) may not be thrown, unless nothing else is left.
      const allowed = discards.filter((a) => a.type === 'discard' && !s.forbidden.includes(a.tile));
      return allowed.length > 0 ? allowed : discards;
    }
    const out: MahjongAction[] = [];
    if (!s.dead[seat] && this.canWinSelf(s)) out.push({ type: 'win' });
    if (r.calls.jokerSwap) out.push(...this.swapOptions(s, seat));
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
      if (r.calls.concealedKong) for (const k of kinds) if ((counts[k] ?? 0) === 4 && notVoid(k)) out.push({ type: 'kong', tile: k });
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
    if (!w || w.from === seat || s.dead[seat]) return [];
    const r = this.rules(s.config);
    const k = kindOf(w.tile);
    // Where exposures take jokers, a discarded joker is dead: nobody may call it.
    if (r.calls.expose && k === JOKER) return [];
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
      const voidSuit = s.voids[seat] ?? null;
      if (best < 2 && (voidSuit === null || !isSuited(k) || suitOf(k) !== voidSuit)) {
        if (r.calls.kong && n >= 3 && s.wall.length > r.deadWall && !(r.aborts?.fourKongs && kongsOnTable >= 4)) out.push({ type: 'kong' });
        if (r.calls.pung && n >= 2) out.push({ type: 'pung' });
      }
      if (best < 2 && r.calls.expose) out.push(...this.exposeOptions(s, seat, k));
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

  /** A seat's choices in a passing round: a vote, or every set of tiles it may pass. */
  private passOptions(s: MahjongState, seat: Seat): MahjongAction[] {
    const p = s.passing;
    const round = this.passRound(s);
    if (!p || !round || p.waiting[0] !== seat) return [];
    if (p.voting) return [{ type: 'vote', yes: true }, { type: 'vote', yes: false }];
    const keep = new Set(this.rules(s.config).passes?.keep ?? []);
    const counts = new Map<Kind, number>();
    for (const t of s.hands[seat] ?? []) {
      const k = kindOf(t);
      if (!keep.has(k)) counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    const kinds = [...counts.keys()].sort((a, b) => a - b);
    const out: MahjongAction[] = [];
    const pick = (n: number, from: number, acc: Kind[], blind: number) => {
      if (acc.length === n) {
        if (round.sameSuit && acc.length > 0 && !acc.every((k) => isSuited(k) && suitOf(k) === suitOf(acc[0] as Kind))) return;
        out.push({ type: 'pass-tiles', tiles: [...acc], blind });
        return;
      }
      for (let i = from; i < kinds.length; i++) {
        const k = kinds[i] as Kind;
        const used = acc.filter((x) => x === k).length;
        if (used >= (counts.get(k) ?? 0)) continue;
        acc.push(k);
        pick(n, i, acc, blind);
        acc.pop();
      }
    };
    if (round.courtesy) for (let n = 0; n <= round.count; n++) pick(n, 0, [], 0);
    else if (round.blind) for (let n = round.count; n >= 0; n--) pick(n, 0, [], round.count - n);
    else pick(round.count, 0, [], 0);
    return out;
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
      ...(r.declareVoid ? { voidSuit: s.voids[seat] ?? null } : {}),
      ...(!selfDrawn && !robbed && s.claim?.afterKong ? { kongDiscard: true } : {}),
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
    if (!r.customShape && !isWinningShape(countsOf(hand), (s.melds[seat] ?? []).length, r.shapes, setsIn(r))) return null;
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
    } else if (!r.customShape && !isWinningShape(counts, melds, r.shapes, setsIn(r))) return null;
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
    if (action.type === 'swap') {
      // Your tile goes into the exposure in the joker's place; the joker comes to your hand.
      const melds = d.melds[action.seat] as Meld[];
      const m = melds[action.meld] as Meld;
      const k = m.kind as Kind;
      const hand = d.hands[seat] as TileId[];
      const i = hand.findIndex((x) => kindOf(x) === k || (isBonus(k) && isBonus(kindOf(x))));
      const tile = hand[i] as TileId;
      const joker = m.tiles.find((x) => kindOf(x) === JOKER) as TileId;
      hand.splice(i, 1, joker);
      melds[action.meld] = { ...m, tiles: m.tiles.map((x) => (x === joker ? tile : x)) };
      if (d.drawn === tile) d.drawn = joker;
      events.push({ type: 'swap', seat, from: action.seat, tile, joker });
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
    const afterKong = d.kongs > 0;
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
    d.claim = { kind: 'discard', tile, from: seat, waiting: this.othersIn(d, seat), declared: [], meld: -1, last: d.wall.length <= r.deadWall, ...(afterKong ? { afterKong: true } : {}) };
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
      d.claim = { kind: 'rob', tile, from: seat, waiting: this.othersIn(d, seat), declared: [], meld: added ? meldIndex : -1 - meldIndex, last: false };
      d.phase = 'rob';
      this.advanceWindow(d, events);
      return;
    }
    this.payKong(d, seat, added ? 'added' : 'concealed', null, events);
    this.replacement(d, seat, events);
  }

  private declare(d: Draft, seat: Seat, action: MahjongAction, events: MahjongEvent[]): void {
    const w = d.claim as ClaimWindow;
    // Passing a win you could have taken makes you furiten (where the style has furiten).
    if (action.type !== 'win' && this.rules(d.config).calls.furiten && this.claimOptions(freeze(d), seat).some((a) => a.type === 'win')) {
      d.missed = d.missed.map((m, i) => (i === seat ? (d.ready[seat] ? 'hand' : 'turn') : m));
    }
    const declared: Declaration[] =
      action.type === 'win' || action.type === 'kong' || action.type === 'pung' || action.type === 'chow' || action.type === 'expose'
        ? [...w.declared, { seat, call: action.type, ...(action.type === 'chow' ? { start: action.start } : {}), ...(action.type === 'expose' ? { size: action.size, jokers: action.jokers } : {}) }]
        : [...w.declared];
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
      // Nobody robbed it: the kong stands, and is paid where the style pays kongs at once.
      this.payKong(d, w.from, w.meld >= 0 ? 'added' : 'concealed', null, events);
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
    const call = w.declared.find((x) => x.call === 'kong' || x.call === 'pung' || x.call === 'expose') ?? w.declared.find((x) => x.call === 'chow');
    if (call) {
      this.makeCall(d, call, w, events);
      return;
    }
    this.nextTurn(d, this.nextIn(d, w.from), events);
  }

  private makeCall(d: Draft, call: Declaration, w: ClaimWindow, events: MahjongEvent[]): void {
    if (call.call === 'expose') {
      this.makeExposure(d, call, w, events);
      return;
    }
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
      this.payKong(d, seat, 'exposed', w.from, events);
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

  /**
   * An exposure with jokers (American): the called tile, natural tiles of its kind and the jokers
   * named, laid face up; then the caller throws. A hand whose exposures fit nothing is dead.
   */
  private makeExposure(d: Draft, call: Declaration, w: ClaimWindow, events: MahjongEvent[]): void {
    const seat = call.seat;
    const hand = d.hands[seat] as TileId[];
    const k = kindOf(w.tile);
    const size = call.size ?? 3;
    const jokers = call.jokers ?? 0;
    markClaimed(d, w.from, w.tile);
    const same = (t: TileId) => kindOf(t) === k || (isBonus(k) && isBonus(kindOf(t)));
    const naturals = hand.filter(same).slice(-(size - 1 - jokers));
    const usedJokers = hand.filter((t) => kindOf(t) === JOKER).slice(-jokers);
    const fromHand = [...(size - 1 - jokers > 0 ? naturals : []), ...(jokers > 0 ? usedJokers : [])];
    for (const t of fromHand) hand.splice(hand.indexOf(t), 1);
    const meld: Meld = { type: exposeType(size), tiles: [...fromHand, w.tile], claimed: w.tile, from: w.from, concealed: false, added: false, kind: isBonus(k) ? FLOWER_1 : k };
    (d.melds[seat] as Meld[]).push(meld);
    events.push({ type: 'call', seat, call: size >= 4 ? 'kong' : 'pung', tile: w.tile, from: w.from, meld });
    d.calls++;
    d.claim = null;
    d.turn = seat;
    d.phase = 'act';
    d.drawn = null;
    d.claimed = true;
    d.kongs = 0;
    d.source = 'call';
    d.forbidden = [];
    const style = this.style(d.config);
    if (style.exposuresFit && !d.dead[seat] && !style.exposuresFit(d.melds[seat] as Meld[], d.config.options)) {
      d.dead = d.dead.map((x, i) => (i === seat ? true : x));
      events.push({ type: 'dead', seat });
    }
  }

  /** A kong paid at once, where the style says so: moved now, kept in the hand's ledger. */
  private payKong(d: Draft, seat: Seat, kind: 'exposed' | 'added' | 'concealed', from: Seat | null, events: MahjongEvent[]): void {
    const style = this.style(d.config);
    if (!style.kongPayment) return;
    const deltas = style.kongPayment({ seat, kind, from, out: [0, 1, 2, 3].map((t) => this.isOut(d, t)), seats: SEATS }, d.config.options);
    if (deltas.every((x) => x === 0)) return;
    this.pay(d, { reason: `kong-${kind}`, seat, from, deltas }, events);
  }

  /** Moves points during a hand: the scores change now, the hand keeps the payment. */
  private pay(d: Draft, payment: Payment, events: MahjongEvent[]): void {
    d.scores = d.scores.map((v, i) => v + (payment.deltas[i] ?? 0));
    d.paid = d.paid.map((v, i) => v + (payment.deltas[i] ?? 0));
    d.ledger = [...d.ledger, payment];
    events.push({ type: 'pay', reason: payment.reason, seat: payment.seat, deltas: payment.deltas });
  }

  /** The start of play after the deal: passing rounds, then the void declaration, then the dealer's first throw. */
  private beginPlay(d: Draft, events: MahjongEvent[]): void {
    const r = this.rules(d.config);
    if (r.passes && r.passes.rounds.length > 0) {
      const dice = 1 + createRng(`${d.seed}/hand/${d.handNo}/dice`).int(3);
      d.passing = this.passStart(d, 0, dice);
      if (d.passing) {
        d.phase = 'pass';
        d.turn = d.dealer;
        return;
      }
    }
    this.afterPasses(d, events);
  }

  /** A pass round's opening state, from `round` on (skipping nothing); null when no rounds are left. */
  private passStart(d: Draft, round: number, dice: number): PassState | null {
    const rounds = this.rules(d.config).passes?.rounds ?? [];
    if (round >= rounds.length) return null;
    return { round, dice, voting: rounds[round]?.vote === true, waiting: [0, 1, 2, 3].map((i) => (d.dealer + i) % SEATS), chosen: [null, null, null, null], blind: [0, 0, 0, 0], votes: [null, null, null, null] };
  }

  private afterPasses(d: Draft, events: MahjongEvent[]): void {
    d.passing = null;
    const hand = d.hands[d.dealer] as TileId[];
    if (d.drawn === null || !hand.includes(d.drawn)) d.drawn = hand[hand.length - 1] ?? null;
    d.turn = d.dealer;
    if (this.rules(d.config).declareVoid) {
      d.phase = 'void';
      return;
    }
    d.phase = 'act';
    void events;
  }

  private voidChoice(d: Draft, seat: Seat, action: MahjongAction, events: MahjongEvent[]): void {
    if (action.type !== 'void') return;
    d.voids = d.voids.map((v, i) => (i === seat ? action.suit : v));
    const next = [1, 2, 3].map((i) => (seat + i) % SEATS).find((t) => d.voids[t] === null);
    if (next !== undefined) {
      d.turn = next;
      return;
    }
    events.push({ type: 'voids', voids: d.voids });
    d.phase = 'act';
    d.turn = d.dealer;
  }

  private passChoice(d: Draft, seat: Seat, action: MahjongAction, events: MahjongEvent[]): void {
    const p = d.passing as PassState;
    const rounds = this.rules(d.config).passes?.rounds ?? [];
    const waiting = p.waiting.slice(1);
    if (action.type === 'vote') {
      const votes = p.votes.map((v, i) => (i === seat ? action.yes : v));
      if (waiting.length > 0) {
        d.passing = { ...p, waiting, votes };
        d.turn = waiting[0] as Seat;
        return;
      }
      const yes = votes.every((v) => v === true);
      events.push({ type: 'vote-result', round: p.round, yes });
      if (yes) {
        d.passing = { ...p, voting: false, waiting: [0, 1, 2, 3].map((i) => (d.dealer + i) % SEATS), votes };
        d.turn = d.dealer;
        return;
      }
      // Skip the whole group.
      const group = rounds[p.round]?.group;
      let next = p.round + 1;
      while (next < rounds.length && group !== undefined && rounds[next]?.group === group) next++;
      this.nextPassRound(d, next, p.dice, events);
      return;
    }
    if (action.type !== 'pass-tiles') return;
    const chosen = p.chosen.map((c, i) => (i === seat ? [...action.tiles] : c));
    const blind = p.blind.map((b, i) => (i === seat ? action.blind : b));
    if (waiting.length > 0) {
      d.passing = { ...p, waiting, chosen, blind };
      d.turn = waiting[0] as Seat;
      return;
    }
    this.resolvePass(d, { ...p, waiting, chosen, blind }, events);
    this.nextPassRound(d, p.round + 1, p.dice, events);
  }

  private nextPassRound(d: Draft, round: number, dice: number, events: MahjongEvent[]): void {
    const next = this.passStart(d, round, dice);
    if (!next) {
      this.afterPasses(d, events);
      return;
    }
    d.passing = next;
    d.turn = d.dealer;
  }

  /**
   * Every seat's choice is in: the tiles change hands at once. A courtesy round exchanges the lower
   * number with the seat across. In a blind round a seat passes on, unseen, the first tiles it
   * receives; tiles travel on until they reach a seat that keeps them, so every seat ends with as
   * many tiles as it started with.
   */
  private resolvePass(d: Draft, p: PassState, events: MahjongEvent[]): void {
    const round = this.rules(d.config).passes?.rounds[p.round] as PassRound;
    const dir = round.dir === 0 ? p.dice : round.dir;
    const order = [0, 1, 2, 3].map((i) => (d.dealer + i) % SEATS);
    const take = (seat: Seat, kinds: readonly Kind[]): TileId[] => {
      const hand = d.hands[seat] as TileId[];
      return kinds.map((k) => {
        const i = lastIndexOfKind(hand, k);
        return hand.splice(i, 1)[0] as TileId;
      });
    };
    const inbox: TileId[][] = [[], [], [], []];
    const counts = [0, 0, 0, 0];
    if (round.courtesy) {
      for (const seat of order) {
        const across = (seat + 2) % SEATS;
        const n = Math.min(p.chosen[seat]?.length ?? 0, p.chosen[across]?.length ?? 0);
        counts[seat] = n;
        (inbox[across] as TileId[]).push(...take(seat, (p.chosen[seat] ?? []).slice(0, n)));
      }
    } else {
      for (const seat of order) {
        const own = p.chosen[seat] ?? [];
        counts[seat] = own.length + (p.blind[seat] ?? 0);
        (inbox[(seat + dir) % SEATS] as TileId[]).push(...take(seat, own));
      }
      const quota = [...p.blind];
      for (let moved = true; moved; ) {
        moved = false;
        for (const seat of order) {
          const box = inbox[seat] as TileId[];
          const n = Math.min(quota[seat] ?? 0, box.length);
          if (n === 0) continue;
          quota[seat] = (quota[seat] ?? 0) - n;
          (inbox[(seat + dir) % SEATS] as TileId[]).push(...box.splice(0, n));
          moved = true;
        }
      }
    }
    for (const seat of order) (d.hands[seat] as TileId[]).push(...(inbox[seat] as TileId[]));
    d.received = inbox.map((box) => [...box]);
    events.push({ type: 'passed', round: p.round, dir: round.courtesy ? 2 : dir, counts });
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
      if (this.flowerWin(d, seat, tile, events)) return;
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

  /**
   * A win by the bonus tiles, where the style has one, just after `seat` set aside `tile`: all eight
   * win for that seat (paid as a self-draw); seven held by another seat win for it, paid by `seat`.
   */
  private flowerWin(d: Draft, seat: Seat, tile: TileId, events: MahjongEvent[]): boolean {
    const fw = this.rules(d.config).flowerWins;
    if (!fw) return false;
    let winner: Seat | null = null;
    let from: Seat | null = null;
    if (fw.eight && (d.bonus[seat] ?? []).length === 8) winner = seat;
    else if (fw.robSeventh) {
      const robber = [1, 2, 3].map((i) => (seat + i) % SEATS).find((s) => (d.bonus[s] ?? []).length === 7);
      if (robber !== undefined) {
        winner = robber;
        from = seat;
      }
    }
    if (winner === null) return false;
    const s = freeze(d);
    const base = this.winContext(s, winner, tile, from === null, from, false);
    const ctx: WinContext = { ...base, selfDrawn: from === null, concealed: (s.hands[winner] ?? []).map(kindOf), tiles: [...(s.hands[winner] ?? []), ...(s.melds[winner] ?? []).flatMap((m) => m.tiles)], flowerWin: from === null ? 'eight' : 'seven' };
    const score = this.style(d.config).score(ctx, d.config.options);
    if (!score) return false;
    d.claim = null;
    this.endWithWins(d, [{ seat: winner, from, tile, score, robbed: false }], events);
    return true;
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
    const r = this.rules(d.config);
    const out = [0, 1, 2, 3].map((t) => this.isOut(d, t));
    const kongDiscard = w !== null && w.kind === 'discard' && w.afterKong === true && wins.some((x) => x.from !== null);
    const deltas = this.style(d.config).settle({ wins, dealer: d.dealer, seats: SEATS, counter: d.counter, stakes: d.stakes, ...(r.playOn ? { out, ledger: d.ledger } : {}), ...(kongDiscard ? { kongDiscard: true } : {}) }, d.config.options);
    if (r.playOn) {
      // The hand goes on: the wins are paid now and the winners leave it.
      const winner = wins[wins.length - 1] as WinRecord;
      this.pay(d, { reason: 'win', seat: (wins[0] as WinRecord).seat, from: winner.from, deltas }, events);
      d.won = [...d.won, ...wins];
      d.claim = null;
      const left = [0, 1, 2, 3].filter((t) => !this.isOut(d, t));
      if (d.won.length >= r.playOn.winners || left.length <= 1) {
        this.finishHand(d, [], [0, 0, 0, 0], events);
        return;
      }
      // The next to draw is the player after the winner (after the last of several, in turn from the thrower).
      this.nextTurn(d, this.nextIn(d, winner.seat), events);
      return;
    }
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
    const input: DrawInput = {
      dealer: d.dealer,
      seats: SEATS,
      reason: 'exhausted',
      ready,
      allTerminalDiscards,
      counter: d.counter,
      ...(r.playOn || r.declareVoid || style.seatStatus ? { hands: d.hands, melds: d.melds, voids: d.voids, out: [0, 1, 2, 3].map((t) => this.isOut(d, t)), ledger: d.ledger } : {}),
    };
    const deltas = style.settleDraw ? style.settleDraw(input, d.config.options) : [0, 0, 0, 0];
    const status = style.seatStatus ? style.seatStatus(input, d.config.options) : null;
    this.finishHand(d, [], deltas, events, { reason: 'exhausted', ...(style.settleDraw && !status ? { ready } : {}), ...(status ? { status } : {}), ...(d.indicators ? { indicators: d.indicators.tiles.slice(0, d.indicators.shown) } : {}) });
  }

  /** A hand abandoned by an abortive-draw rule: nobody pays, and the stakes stay on the table. */
  private endAbortive(d: Draft, reason: DrawReason, seat: Seat | null, events: MahjongEvent[]): void {
    events.push({ type: 'abort', reason, seat });
    this.finishHand(d, [], [0, 0, 0, 0], events, { reason, ...(d.indicators ? { indicators: d.indicators.tiles.slice(0, d.indicators.shown) } : {}) });
  }

  private finishHand(d: Draft, wins: readonly WinRecord[], deltas: readonly number[], events: MahjongEvent[], extra: Partial<HandResult> = {}): void {
    // Payments made during the hand (kongs, earlier wins) are already in the scores; the result shows the whole hand.
    const total = deltas.map((x, i) => x + (d.paid[i] ?? 0));
    const r = this.rules(d.config);
    const result: HandResult = {
      ...extra,
      ...(r.ready || d.counter > 0 || d.stakes > 0 ? { counter: d.counter, stakes: d.stakes } : {}),
      ...(d.ledger.length > 0 ? { payments: d.ledger } : {}),
      ...(r.declareVoid ? { voids: d.voids } : {}),
      handNo: d.handNo,
      round: d.round,
      dealer: d.dealer,
      wins: [...d.won, ...wins],
      deltas: total,
      hands: d.hands.map((h) => [...h]),
      melds: d.melds.map((m) => [...m]),
      bonus: d.bonus.map((b) => [...b]),
      wallLeft: d.wall.length,
    };
    d.scores = d.scores.map((v, i) => v + (deltas[i] ?? 0));
    d.results = [...d.results, result];
    // The hand's payments now live in its result.
    d.paid = [0, 0, 0, 0];
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
    d.voids = [null, null, null, null];
    d.won = [];
    d.paid = [0, 0, 0, 0];
    d.ledger = [];
    d.passing = null;
    d.received = [[], [], [], []];
    d.dead = [false, false, false, false];
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
    // All eight bonus tiles in one opening hand win at once (seven robbing one applies to tiles drawn in play).
    if (r.flowerWins?.eight) {
      const seat = order.find((x) => (d.bonus[x] ?? []).length === 8);
      const lastBonus = seat === undefined ? undefined : (d.bonus[seat] ?? [])[7];
      if (seat !== undefined && lastBonus && this.flowerWin(d, seat, lastBonus, events)) return;
    }
    this.beginPlay(d, events);
  }
}

// Helpers

export const PRIORITY: Readonly<Record<CallType, number>> = { win: 3, kong: 2, pung: 2, chow: 1, expose: 2 };

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
    case 'pass-tiles':
      return `pass${[...a.tiles].sort((x, y) => x - y).join('.')}/${a.blind}`;
    case 'vote':
      return a.yes ? 'vote-yes' : 'vote-no';
    case 'void':
      return `void${a.suit}`;
    case 'expose':
      return `expose${a.size}/${a.jokers}`;
    case 'swap':
      return `swap${a.seat}/${a.meld}`;
    default:
      return a.type;
  }
}

/** The meld type of an exposure of `size` tiles. */
export function exposeType(size: number): Meld['type'] {
  return size >= 6 ? 'sextet' : size === 5 ? 'quint' : size === 4 ? 'kong' : 'pung';
}

/** An exposure of `size` tiles of kind `k`, `jokers` of them jokers, for asking whether it would fit. */
function sampleExposure(k: Kind, size: number, jokers: number): Meld {
  const natural = Array.from({ length: size - jokers }, (_, i) => `${codeOf(k)}.${i % 4}`);
  const joker = Array.from({ length: jokers }, (_, i) => `J.${i}`);
  return { type: exposeType(size), tiles: [...natural, ...joker], claimed: null, from: null, concealed: false, added: false, kind: isBonus(k) ? FLOWER_1 : k };
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
  voids: readonly (number | null)[];
  won: readonly WinRecord[];
  paid: readonly number[];
  ledger: readonly Payment[];
  passing: PassState | null;
  received: readonly (readonly TileId[])[];
  dead: readonly boolean[];
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
