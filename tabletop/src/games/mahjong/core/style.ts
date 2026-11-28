/**
 * The rules-file interface (docs/rules/mahjong-core.md). A style is one typed object that tells
 * the shared engine its tiles, hand size, calls, shapes, scoring, payments and rounds. Nothing
 * style-specific lives in the core; the Hong Kong file (styles/hong-kong.ts) is the first style.
 */
import type { Seat } from '../../../core/contract';
import type { Json } from '../../../core/json';
import type { ShapeRules } from './shapes';
import type { Kind, TileId, TileSetSpec } from './tiles';

/** A set laid on the table: called from a discard, or a concealed kong. */
export interface Meld {
  /** A quint (5) or sextet (6) only where jokers make them (American). */
  readonly type: 'chow' | 'pung' | 'kong' | 'quint' | 'sextet';
  /** In order (a chow from low to high); for an added kong the added tile is last. */
  readonly tiles: readonly TileId[];
  /** The discard it took, or null for a concealed kong. */
  readonly claimed: TileId | null;
  /** Who discarded the claimed tile. */
  readonly from: Seat | null;
  /** A concealed kong: laid down, but still concealed for scoring. */
  readonly concealed: boolean;
  /** A pung made into a kong by adding the fourth tile. */
  readonly added: boolean;
  /** The kind the set stands for, when jokers are in it (American exposures). */
  readonly kind?: Kind;
}

export interface CallRules {
  /** Chow from the player before you. */
  readonly chow: boolean;
  readonly pung: boolean;
  /** An exposed kong called on a discard. */
  readonly kong: boolean;
  readonly concealedKong: boolean;
  readonly addedKong: boolean;
  /** A tile added to a pung may be taken by a player it completes. */
  readonly robKong: boolean;
  /** Thirteen orphans may also rob a concealed kong. */
  readonly robConcealedWithOrphans: boolean;
  /** Several players may win on one discard; otherwise the first in turn after the discarder. */
  readonly multipleWinners: boolean;
  /** With several winners allowed: more than this many on one tile makes an abortive draw. */
  readonly maxWinners?: number;
  /** Furiten: no win on a discard with a wait among your own discards, or after passing a win. */
  readonly furiten?: boolean;
  /** After a chow or pung you may not throw the called kind (nor, for a chow, the other end). */
  readonly noSwapCall?: boolean;
  /**
   * Calling a discard for an exposure of these sizes, jokers standing in (American): the called
   * tile and tiles of its kind or jokers from the hand; no replacement draw. A discarded joker can
   * never be called. With `refuseDead`, an exposure that would leave a hand no way to win is not offered.
   */
  readonly expose?: { readonly sizes: readonly number[]; readonly refuseDead?: boolean };
  /** On your turn a joker in any live exposure may be taken by putting in the tile it stands for. */
  readonly jokerSwap?: boolean;
}

/** One round of passing tiles before play (Sichuan's exchange of three, American's Charleston). */
export interface PassRound {
  /** 1 to the right (the next player), 2 across, 3 to the left; 0 by the dice, a fresh direction each hand. */
  readonly dir: 0 | 1 | 2 | 3;
  /** Tiles each seat passes. */
  readonly count: number;
  /** The tiles passed must all be of one suit. */
  readonly sameSuit?: boolean;
  /** A seat may pass on, unseen, some of the tiles it receives in this round instead of its own. */
  readonly blind?: boolean;
  /** Each seat offers 0 to `count` tiles; with the seat across, the lower number changes hands. */
  readonly courtesy?: boolean;
  /** Rounds with the same group are played or skipped together. */
  readonly group?: number;
  /** A vote opens this round's group: one "no" skips the whole group. */
  readonly vote?: boolean;
}

/** Passing tiles before play, in rounds. */
export interface PassRules {
  readonly rounds: readonly PassRound[];
  /** Kinds that may never be passed (jokers). */
  readonly keep?: readonly Kind[];
}

/** A payment made during a hand (a kong paid at once, a win in a hand that goes on), kept for later rules. */
export interface Payment {
  /** "win", "kong-exposed", "kong-added", "kong-concealed", or a style's own reason. */
  readonly reason: string;
  /** The seat that made it happen (the winner, the kong's owner). */
  readonly seat: Seat;
  /** The discarder, for an exposed kong or a win on a discard. */
  readonly from?: Seat | null;
  readonly deltas: readonly number[];
}

/** A kong just made, for a style that pays kongs at once. */
export interface KongInput {
  readonly seat: Seat;
  readonly kind: 'exposed' | 'added' | 'concealed';
  /** The discarder of an exposed kong's tile. */
  readonly from: Seat | null;
  /** Seats that have already won in a hand that goes on after a win. */
  readonly out: readonly boolean[];
  readonly seats: number;
}

/** A declaration of a ready hand with a stake on the table (riichi), when the style has one. */
export interface ReadyDeclaration {
  /** Points put on the table when the declaring throw passes without a win. */
  readonly stake: number;
  /** Points a seat needs to declare. */
  readonly minScore: number;
  /** Tiles that must be left to draw. */
  readonly minLeft: number;
}

/** Hands abandoned before their end, each when the style plays it. */
export interface AbortRules {
  /** A seat with nine different terminals and honours on its first draw, before any call, may end the hand. */
  readonly nineTerminals: boolean;
  /** All four throw the same wind on the first go round, with no call. */
  readonly fourWinds: boolean;
  /** All four have declared ready. */
  readonly fourReady: boolean;
  /** Four kongs on the table, not all one player's. */
  readonly fourKongs: boolean;
}

/** What the engine needs from a style, from its options. */
export interface StyleRules {
  readonly tiles: TileSetSpec;
  /** 13 (four sets and a pair) or 16 (five sets and a pair). */
  readonly handSize: number;
  /** Tiles never drawn at the end of the wall. */
  readonly deadWall: number;
  /** Bonus tiles are set aside and replaced from the back of the wall. */
  readonly replaceBonus: boolean;
  readonly calls: CallRules;
  readonly shapes: ShapeRules;
  /** Wind rounds in a game; 0 plays a single hand. */
  readonly rounds: number;
  /** A game also ends after this many hands for each round. */
  readonly handsPerRound: number;
  /** Indicator stacks set aside from the dead wall at the deal (each with a tile under it), or none. */
  readonly indicators?: number;
  /** Kong indicators: "immediate", or "late" (an exposed or added kong turns its indicator after the throw). */
  readonly kongIndicator?: 'immediate' | 'late';
  /** Each seat's points at the start of a game (0 when absent). */
  readonly startScore?: number;
  readonly ready?: ReadyDeclaration;
  readonly aborts?: AbortRules;
  /** Passing tiles before play (and before the void is declared). */
  readonly passes?: PassRules;
  /** Each seat declares a suit to void before play: thrown first, never called, never in a winning hand. */
  readonly declareVoid?: boolean;
  /** The hand goes on after a win, the winners leaving it, until this many have won or the wall is empty. */
  readonly playOn?: { readonly winners: number };
  /**
   * The style's scorer alone decides whether a hand is complete (American hands come from a card,
   * not from sets and a pair): the core's shape check is skipped and `score` returning null means no win.
   */
  readonly customShape?: boolean;
}

/** Everything a scorer needs to know about a complete hand and how it was won. */
export interface WinContext {
  readonly seat: Seat;
  /** The winning tile's kind. */
  readonly tile: Kind;
  readonly selfDrawn: boolean;
  /** The discarder, or the player whose kong was robbed; null when self-drawn. */
  readonly from: Seat | null;
  /** Concealed tiles, the winning tile included. */
  readonly concealed: readonly Kind[];
  readonly melds: readonly Meld[];
  /** Bonus tiles set aside by the winner. */
  readonly bonus: readonly Kind[];
  /** 0 East, 1 South, 2 West, 3 North. */
  readonly seatWind: number;
  readonly prevailingWind: number;
  readonly dealer: boolean;
  /** Self-drawn with the last tile that could be drawn. */
  readonly lastTile: boolean;
  /** Won on the discard made after the last tile was drawn. */
  readonly lastDiscard: boolean;
  /** How many kongs in a row came just before this replacement tile (0 when it was not one). */
  readonly kongs: number;
  readonly robbed: boolean;
  /** The dealer won on the deal, before any discard. */
  readonly heavenly: boolean;
  /** Another player won on the dealer's first discard. */
  readonly earthly: boolean;
  /** Self-drawn on the seat's first draw, before any call or throw (not the dealer's deal). */
  readonly firstDraw?: boolean;
  /** Every tile of the hand by id, melds and the winning tile included (red fives are copies). */
  readonly tiles?: readonly TileId[];
  /** Indicator tiles turned up, and the ones under them (for a winner who declared ready). */
  readonly indicators?: readonly Kind[];
  readonly underIndicators?: readonly Kind[];
  /** 0: no ready declaration; 1: declared; 2: declared on the first throw. */
  readonly ready?: number;
  /** Declared ready and winning within a go round of it, with no call in between. */
  readonly oneShot?: boolean;
  /** The suit the winner declared void (styles with a void declaration). */
  readonly voidSuit?: number | null;
  /** Won on a discard the thrower made right after its own kong. */
  readonly kongDiscard?: boolean;
}

/** One scoring pattern in a hand, by id; the text catalogue names it. */
export interface ScoreLine {
  readonly id: string;
  /** Its value in the style's unit (faan in Hong Kong); for a limit hand, the limit. */
  readonly value: number;
  /** How to show the line when its id has no name in the catalogue (a hand from a card typed in). */
  readonly label?: string;
  /** How many times it counted (two dragon pungs), when more than once. */
  readonly times?: number;
}

export interface HandScore {
  readonly lines: readonly ScoreLine[];
  /** The sum before the limit (a limit hand: the limit). */
  readonly raw: number;
  /** After the limit. */
  readonly total: number;
  /** A limit hand, or a total capped at the limit. */
  readonly limit: boolean;
  /** The style's unit: "faan" for Hong Kong. */
  readonly unit: string;
  /** Base points the payments are made from. */
  readonly base: number;
  /** Fu, in styles that count them. */
  readonly fu?: number;
  /** Limit hands as multiples (1 for a limit hand, 2 for a double one), in styles that count them. */
  readonly yakuman?: number;
  /** The name of the score's band ("mangan"), when it has one. */
  readonly band?: string;
}

export interface WinRecord {
  readonly seat: Seat;
  /** The discarder (or the player robbed), or null when self-drawn. */
  readonly from: Seat | null;
  readonly tile: TileId;
  readonly score: HandScore;
  readonly robbed: boolean;
}

export interface SettleInput {
  readonly wins: readonly WinRecord[];
  readonly dealer: Seat;
  readonly seats: number;
  /** Counters on the table (honba), for styles that pay them. */
  readonly counter?: number;
  /** Stakes on the table, collected by the winner (the first in turn after the thrower). */
  readonly stakes?: number;
  /** In a hand that goes on after a win: the seats that won before these wins (they neither pay nor collect). */
  readonly out?: readonly boolean[];
  /** Payments already made in this hand. */
  readonly ledger?: readonly Payment[];
  /** The winning tile was thrown right after the thrower's own kong. */
  readonly kongDiscard?: boolean;
}

/** A hand that ended without a winner, for styles that pay something at a draw. */
export interface DrawInput {
  readonly dealer: Seat;
  readonly seats: number;
  /** Why it ended: the wall ran out, or an abortive draw by its rule. */
  readonly reason: DrawReason;
  /** Seats ready (one tile from a winning shape) when the wall ran out. */
  readonly ready: readonly boolean[];
  /** Seats whose discards were all terminals and honours, none of them called. */
  readonly allTerminalDiscards: readonly Seat[];
  readonly counter: number;
  /** Each seat's tiles and melds at the end, its void suit, whether it had won already, and the payments made in the hand. */
  readonly hands?: readonly (readonly TileId[])[];
  readonly melds?: readonly (readonly Meld[])[];
  readonly voids?: readonly (number | null)[];
  readonly out?: readonly boolean[];
  readonly ledger?: readonly Payment[];
}

export type DrawReason = 'exhausted' | 'nine-terminals' | 'four-winds' | 'four-ready' | 'four-kongs' | 'too-many-winners';

/** What the next hand starts with, from the hand just finished, for the style to decide. */
export interface HandEnd {
  readonly winners: readonly Seat[];
  readonly dealer: Seat;
  readonly drawn: boolean;
  /** An abortive draw's reason (an exhausted wall is not abortive). */
  readonly abortive?: DrawReason;
  /** Seats ready at an exhaustive draw. */
  readonly ready?: readonly boolean[];
}

/** Where a game stands after a hand, for a style that ends games its own way. */
export interface GameStanding {
  readonly scores: readonly number[];
  /** The hand just finished: its round and how many times the deal had passed in it. */
  readonly round: number;
  readonly passes: number;
  /** The next hand's round, and whether its dealer is the same seat. */
  readonly nextRound: number;
  readonly dealerKeeps: boolean;
  readonly dealer: Seat;
  readonly hands: number;
  readonly rounds: number;
}

/** One option of a style, with every value it may take. */
export interface OptionSpec {
  readonly key: string;
  readonly values: readonly (string | number)[];
  /** Any text is kept (a card typed in by the player); `values` then lists none. */
  readonly text?: boolean;
}

export type StyleOptions = Readonly<Record<string, string | number>>;

/**
 * What a style's scoring rewards, roughly, so one bot family can steer toward value in every
 * style: the bots read these numbers, never the patterns' names.
 */
export interface ValueHints {
  /** The value a hand needs to win. */
  readonly minimum: number;
  /** The value of a pung or kong of each of the 34 kinds (dragons, your winds). */
  readonly pung: readonly number[];
  /** One suit with honours, and one suit alone. */
  readonly mixedSuit: number;
  readonly pureSuit: number;
  readonly allPungs: number;
  readonly allChows: number;
  /** A concealed hand, on any win; and a self-drawn win. */
  readonly concealed: number;
  readonly selfDrawn: number;
  /** Value from the bonus tiles the seat already holds (seat flowers, a full set, none at all). */
  readonly bonus: number;
  /** The most a hand can score. */
  readonly limit: number;
  /** Kinds that can never help this seat (its void suit): the CPU treats them as unseen-and-gone. */
  readonly dead?: readonly Kind[];
  /** How strongly the CPU steers toward value, against the Hong Kong table its weights were tuned on (1). */
  readonly valueSteer?: number;
  /** Calls judged by speed alone: where the first to win gains most (a hand that goes on after a win). */
  readonly callsBySpeed?: boolean;
  /** Base points for each value from 0 to the limit. */
  readonly points: readonly number[];
  /** What each loser pays, in base points: on a self-draw, the discarder, and the others on a discard win. */
  readonly pay: { readonly selfDrawn: number; readonly discarder: number; readonly others: number };
  /** A hand of simples only (2 to 8), closed and with calls, in styles that reward it. */
  readonly allSimples?: number;
  readonly allSimplesOpen?: number;
  /** A closed ready hand can always be declared ready for this much (riichi). */
  readonly readyDeclaration?: number;
  /** Kinds worth this much each when held in a winning hand (dora), once a hand has value. */
  readonly bonusKinds?: readonly Kind[];
  /**
   * How much the strongest CPU weighs the cost of feeding a ready hand, against the table its
   * weights were tuned on (1, Hong Kong). Where the feeder pays the whole hand that cost is several
   * times larger, and the tuned weight would have the CPU fold far too often.
   */
  readonly riskScale?: number;
}

export interface Style {
  readonly id: string;
  /** Rough values of a seat's prospects, for bots and the coach. */
  hints(seat: { readonly seatWind: number; readonly prevailingWind: number; readonly bonus: readonly Kind[]; readonly indicators?: readonly Kind[]; readonly voidSuit?: number | null }, options: StyleOptions): ValueHints;
  readonly options: readonly OptionSpec[];
  readonly defaults: StyleOptions;
  readonly presets: readonly { readonly id: string; readonly options: StyleOptions }[];
  rules(options: StyleOptions): StyleRules;
  /** The hand's score, or null when it may not win (below the minimum, or a shape the style refuses). */
  score(ctx: WinContext, options: StyleOptions): HandScore | null;
  /** The score of a complete hand whatever the minimum (no yaku, too few faan), for teaching. */
  scoreAny?(ctx: WinContext, options: StyleOptions): HandScore | null;
  /** Each seat's gain or loss for a finished hand with winners. Adds up to zero. */
  settle(hand: SettleInput, options: StyleOptions): number[];
  /** Whether the dealer deals the next hand too. */
  dealerKeeps(hand: HandEnd, options: StyleOptions): boolean;
  /** Payments at a hand with no winner (none when absent). */
  settleDraw?(hand: DrawInput, options: StyleOptions): number[];
  /** The counter (honba) for the next hand (0 when absent). */
  nextCounter?(hand: HandEnd, counter: number, options: StyleOptions): number;
  /** Whether the game is over after a hand; null leaves it to the rounds. */
  gameOver?(standing: GameStanding, options: StyleOptions): boolean | null;
  /** What each seat pays at once for a kong (none when absent). Adds up to zero. */
  kongPayment?(kong: KongInput, options: StyleOptions): number[];
  /** Each seat's standing when the wall ran out ("won", "ready", "not-ready", or a style's own word), shown with the result. */
  seatStatus?(hand: DrawInput, options: StyleOptions): readonly string[];
  /** Whether a seat's exposures can still make a winning hand (none: the hand is dead). */
  exposuresFit?(melds: readonly Meld[], options: StyleOptions): boolean;
}

/** Reads a style's options from JSON, keeping only known values (defaults for the rest). */
export function readOptions(style: Style, json: Json | undefined): StyleOptions {
  const out: Record<string, string | number> = {};
  const src = json && typeof json === 'object' && !Array.isArray(json) ? (json as Record<string, Json>) : {};
  for (const spec of style.options) {
    const value = src[spec.key];
    if (spec.text) out[spec.key] = typeof value === 'string' ? value : (style.defaults[spec.key] as string | number);
    else out[spec.key] = (typeof value === 'string' || typeof value === 'number') && spec.values.includes(value) ? value : (style.defaults[spec.key] as string | number);
  }
  return out;
}
