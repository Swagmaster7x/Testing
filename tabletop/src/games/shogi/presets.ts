/**
 * Shogi options and named presets (docs/rules/shogi.md, section 8): the board, the traditional
 * handicaps, the impasse rule and a move limit. The handicap giver plays White and moves first.
 */
import type { BoardKind } from './core';
import { START_SFEN } from './core';

export type HandicapId = 'even' | 'lance' | 'bishop' | 'rook' | 'rook-lance' | 'two' | 'four' | 'six' | 'eight' | 'ten';
export type ImpasseRule = 'none' | 'points-24' | 'declare-27' | 'try';

export interface Handicap {
  readonly id: HandicapId;
  readonly board: BoardKind;
  readonly sfen: string;
  /** Impasse points of the pieces White removed; they count for White (section 6). */
  readonly points: number;
  /** The rank difference the handicap is meant for (JSA table; 0 for an even game). */
  readonly ranks: number;
}

const BLACK_HALF = 'ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL';

export const HANDICAPS: readonly Handicap[] = [
  { id: 'even', board: 'standard', sfen: START_SFEN.standard, points: 0, ranks: 0 },
  { id: 'lance', board: 'standard', sfen: `lnsgkgsn1/1r5b1/${BLACK_HALF} w - 1`, points: 1, ranks: 2 },
  { id: 'bishop', board: 'standard', sfen: `lnsgkgsnl/1r7/${BLACK_HALF} w - 1`, points: 5, ranks: 3 },
  { id: 'rook', board: 'standard', sfen: `lnsgkgsnl/7b1/${BLACK_HALF} w - 1`, points: 5, ranks: 4 },
  { id: 'rook-lance', board: 'standard', sfen: `lnsgkgsn1/7b1/${BLACK_HALF} w - 1`, points: 6, ranks: 5 },
  { id: 'two', board: 'standard', sfen: `lnsgkgsnl/9/${BLACK_HALF} w - 1`, points: 10, ranks: 6.5 },
  { id: 'four', board: 'standard', sfen: `1nsgkgsn1/9/${BLACK_HALF} w - 1`, points: 12, ranks: 8.5 },
  { id: 'six', board: 'standard', sfen: `2sgkgs2/9/${BLACK_HALF} w - 1`, points: 14, ranks: 10 },
  { id: 'eight', board: 'standard', sfen: `3gkg3/9/${BLACK_HALF} w - 1`, points: 16, ranks: 12 },
  { id: 'ten', board: 'standard', sfen: `4k4/9/${BLACK_HALF} w - 1`, points: 18, ranks: 14 },
  { id: 'even', board: 'mini', sfen: START_SFEN.mini, points: 0, ranks: 0 },
  { id: 'bishop', board: 'mini', sfen: 'r1sgk/4p/5/P4/KGSBR w - 1', points: 0, ranks: 3 },
  { id: 'rook', board: 'mini', sfen: '1bsgk/4p/5/P4/KGSBR w - 1', points: 0, ranks: 4 },
  { id: 'two', board: 'mini', sfen: '2sgk/4p/5/P4/KGSBR w - 1', points: 0, ranks: 6.5 },
];

export function handicapFor(board: BoardKind, id: HandicapId): Handicap | null {
  return HANDICAPS.find((h) => h.board === board && h.id === id) ?? null;
}

export function handicapsFor(board: BoardKind): readonly Handicap[] {
  return HANDICAPS.filter((h) => h.board === board);
}

export const IMPASSE_RULES: readonly ImpasseRule[] = ['declare-27', 'points-24', 'try', 'none'];

/** Points per piece in an impasse: rook and bishop (promoted or not) 5, other pieces 1, kings 0. */
export const IMPASSE_BIG = 5;
export const IMPASSE_SMALL = 1;
/** The 24-point rule: fewer than this loses. */
export const IMPASSE_24 = 24;
/** The declaration: points needed by Black and by White, and pieces needed in the enemy camp. */
export const DECLARE_BLACK = 28;
export const DECLARE_WHITE = 27;
export const DECLARE_PIECES = 10;
/** Positions repeat this many times for sennichite. */
export const REPETITIONS = 4;
/** The move limit used by ladders and the problem generator (computer-shogi convention). */
export const LADDER_MOVE_LIMIT = 320;
/** The rating points one amateur rank is taken to be worth (docs/rules/shogi.md, section 9). */
export const POINTS_PER_RANK = 100;

export interface ShogiConfig {
  /** 9×9 or 5×5. */
  readonly board?: BoardKind;
  readonly handicap?: HandicapId;
  readonly impasse?: ImpasseRule;
  /** Draw when the game reaches this many moves; 0 or absent for no limit. */
  readonly moveLimit?: number;
  /** A starting position in SFEN (lessons, problems, play on from here). */
  readonly position?: string;
}

export interface Preset {
  readonly id: string;
  readonly config: ShogiConfig;
}

/** Named presets, standard first (section 8). Labels are in the text catalogue as shogi.preset.<id>. */
export const PRESETS: readonly Preset[] = [
  { id: 'standard', config: {} },
  { id: 'professional', config: { impasse: 'points-24' } },
  { id: 'casual', config: { impasse: 'none' } },
  ...HANDICAPS.filter((h) => h.board === 'standard' && h.id !== 'even').map((h) => ({ id: `handicap-${h.id}`, config: { handicap: h.id } })),
  { id: 'mini', config: { board: 'mini' } },
  ...HANDICAPS.filter((h) => h.board === 'mini' && h.id !== 'even').map((h) => ({ id: `mini-${h.id}`, config: { board: 'mini' as const, handicap: h.id } })),
];
