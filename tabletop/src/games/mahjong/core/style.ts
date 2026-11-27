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
  readonly type: 'chow' | 'pung' | 'kong';
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
}

/** One scoring pattern in a hand, by id; the text catalogue names it. */
export interface ScoreLine {
  readonly id: string;
  /** Its value in the style's unit (faan in Hong Kong); for a limit hand, the limit. */
  readonly value: number;
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
}

/** One option of a style, with every value it may take. */
export interface OptionSpec {
  readonly key: string;
  readonly values: readonly (string | number)[];
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
  /** Base points for each value from 0 to the limit. */
  readonly points: readonly number[];
  /** What each loser pays, in base points: on a self-draw, the discarder, and the others on a discard win. */
  readonly pay: { readonly selfDrawn: number; readonly discarder: number; readonly others: number };
}

export interface Style {
  readonly id: string;
  /** Rough values of a seat's prospects, for bots and the coach. */
  hints(seat: { readonly seatWind: number; readonly prevailingWind: number; readonly bonus: readonly Kind[] }, options: StyleOptions): ValueHints;
  readonly options: readonly OptionSpec[];
  readonly defaults: StyleOptions;
  readonly presets: readonly { readonly id: string; readonly options: StyleOptions }[];
  rules(options: StyleOptions): StyleRules;
  /** The hand's score, or null when it may not win (below the minimum, or a shape the style refuses). */
  score(ctx: WinContext, options: StyleOptions): HandScore | null;
  /** Each seat's gain or loss for a finished hand with winners. Adds up to zero. */
  settle(hand: SettleInput, options: StyleOptions): number[];
  /** Whether the dealer deals the next hand too. */
  dealerKeeps(hand: { readonly winners: readonly Seat[]; readonly dealer: Seat; readonly drawn: boolean }, options: StyleOptions): boolean;
}

/** Reads a style's options from JSON, keeping only known values (defaults for the rest). */
export function readOptions(style: Style, json: Json | undefined): StyleOptions {
  const out: Record<string, string | number> = {};
  const src = json && typeof json === 'object' && !Array.isArray(json) ? (json as Record<string, Json>) : {};
  for (const spec of style.options) {
    const value = src[spec.key];
    out[spec.key] = (typeof value === 'string' || typeof value === 'number') && spec.values.includes(value) ? value : (style.defaults[spec.key] as string | number);
  }
  return out;
}
