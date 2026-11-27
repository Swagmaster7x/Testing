/**
 * Mahjong tiles, for every style (docs/rules/mahjong-core.md). A tile *kind* is a number:
 *
 *   0-8 characters 1-9, 9-17 dots 1-9, 18-26 bamboo 1-9,
 *   27-30 winds East, South, West, North, 31-33 dragons White, Green, Red,
 *   34-37 flowers 1-4, 38-41 seasons 1-4, 42 the joker.
 *
 * The order of the honours follows the usual computer notation (1z-7z: East South West North
 * White Green Red), so hands convert directly for the test oracle.
 *
 * A physical tile is an id "<code>.<copy>", such as "5p.2" or "F1.0": every tile keeps its
 * identity from the wall to a hand to a discard or a meld. Actions name kinds, never copies.
 */

export type Kind = number;
export type TileId = string;

export const SUIT_KINDS = 27;
export const PLAYING_KINDS = 34;
export const KIND_COUNT = 43;

export const WIND_EAST = 27;
export const WHITE = 31;
export const GREEN = 32;
export const RED = 33;
export const FLOWER_1 = 34;
export const SEASON_1 = 38;
export const JOKER = 42;

/** Suit letters as written after the number: characters (m), dots (p), bamboo (s). */
export const SUIT_LETTERS = ['m', 'p', 's'] as const;
export type SuitLetter = (typeof SUIT_LETTERS)[number];

const HONOUR_CODES = ['E', 'S', 'W', 'N', 'Wd', 'Gd', 'Rd'] as const;
const BONUS_CODES = ['F1', 'F2', 'F3', 'F4', 'S1', 'S2', 'S3', 'S4'] as const;

/** The code of every kind, in kind order. */
export const CODES: readonly string[] = [
  ...SUIT_LETTERS.flatMap((s) => [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `${n}${s}`)),
  ...HONOUR_CODES,
  ...BONUS_CODES,
  'J',
];

const KIND_OF_CODE = new Map<string, Kind>(CODES.map((code, kind) => [code, kind]));

export function codeOf(kind: Kind): string {
  const code = CODES[kind];
  if (code === undefined) throw new RangeError(`No tile kind ${kind}`);
  return code;
}

/** The kind written as a code ("5p", "E", "Rd", "F2"), or null. */
export function parseKind(code: string): Kind | null {
  return KIND_OF_CODE.get(code.trim()) ?? null;
}

export function isSuited(kind: Kind): boolean {
  return kind >= 0 && kind < SUIT_KINDS;
}

export function isHonour(kind: Kind): boolean {
  return kind >= SUIT_KINDS && kind < PLAYING_KINDS;
}

export function isWind(kind: Kind): boolean {
  return kind >= WIND_EAST && kind < WIND_EAST + 4;
}

export function isDragon(kind: Kind): boolean {
  return kind >= WHITE && kind <= RED;
}

/** Flowers and seasons: they never stay in a hand. */
export function isBonus(kind: Kind): boolean {
  return kind >= FLOWER_1 && kind < JOKER;
}

export function isFlower(kind: Kind): boolean {
  return kind >= FLOWER_1 && kind < SEASON_1;
}

export function isSeason(kind: Kind): boolean {
  return kind >= SEASON_1 && kind < JOKER;
}

/** 0 characters, 1 dots, 2 bamboo; 3 for honours, 4 for bonus tiles and jokers. */
export function suitOf(kind: Kind): number {
  if (kind < SUIT_KINDS) return Math.floor(kind / 9);
  return kind < PLAYING_KINDS ? 3 : 4;
}

/** 1 to 9 for a suited tile, 1 to 4 for a flower or season, 0 otherwise. */
export function rankOf(kind: Kind): number {
  if (kind < SUIT_KINDS) return (kind % 9) + 1;
  if (isBonus(kind)) return ((kind - FLOWER_1) % 4) + 1;
  return 0;
}

export function isTerminal(kind: Kind): boolean {
  return isSuited(kind) && (rankOf(kind) === 1 || rankOf(kind) === 9);
}

/** Terminals and honours: the tiles of thirteen orphans. */
export function isTerminalOrHonour(kind: Kind): boolean {
  return isTerminal(kind) || isHonour(kind);
}

/** The thirteen kinds of thirteen orphans. */
export const ORPHANS: readonly Kind[] = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];

// Tile ids

export function tileId(kind: Kind, copy: number): TileId {
  return `${codeOf(kind)}.${copy}`;
}

export function kindOf(id: TileId): Kind {
  const dot = id.lastIndexOf('.');
  const kind = parseKind(dot < 0 ? id : id.slice(0, dot));
  if (kind === null) throw new Error(`"${id}" is not a mahjong tile`);
  return kind;
}

export function isTileId(text: string): boolean {
  const m = /^(.+)\.(\d)$/.exec(text);
  return m !== null && m[1] !== undefined && parseKind(m[1]) !== null;
}

/** What a style's tile set holds. */
export interface TileSetSpec {
  /** Winds and dragons (all but Sichuan). */
  readonly honours: boolean;
  /** Four flowers and four seasons, one each. */
  readonly bonus: boolean;
  /** Jokers (American: eight). */
  readonly jokers: number;
}

/** Every tile in a set, in kind order: four of each suited and honour kind, one of each bonus tile. */
export function tileSet(spec: TileSetSpec): TileId[] {
  const out: TileId[] = [];
  const last = spec.honours ? PLAYING_KINDS : SUIT_KINDS;
  for (let kind = 0; kind < last; kind++) for (let copy = 0; copy < 4; copy++) out.push(tileId(kind, copy));
  if (spec.bonus) for (let kind = FLOWER_1; kind < JOKER; kind++) out.push(tileId(kind, 0));
  for (let copy = 0; copy < spec.jokers; copy++) out.push(tileId(JOKER, copy));
  return out;
}

/** How many copies of a kind a set holds. */
export function copiesOf(spec: TileSetSpec, kind: Kind): number {
  if (isSuited(kind)) return 4;
  if (isHonour(kind)) return spec.honours ? 4 : 0;
  if (isBonus(kind)) return spec.bonus ? 1 : 0;
  return kind === JOKER ? spec.jokers : 0;
}

// Counts

/** Counts of the 34 playing kinds in a list of tile ids (bonus tiles and jokers are left out). */
export function countsOf(ids: readonly TileId[]): number[] {
  const out = new Array<number>(PLAYING_KINDS).fill(0);
  for (const id of ids) {
    const k = kindOf(id);
    if (k < PLAYING_KINDS) out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

/** Counts of the 34 playing kinds in a list of kinds. */
export function countsOfKinds(kinds: readonly Kind[]): number[] {
  const out = new Array<number>(PLAYING_KINDS).fill(0);
  for (const k of kinds) if (k < PLAYING_KINDS) out[k] = (out[k] ?? 0) + 1;
  return out;
}

/** Tiles sorted for showing: by kind, then copy. */
export function sortTiles(ids: readonly TileId[]): TileId[] {
  return [...ids].sort((a, b) => kindOf(a) - kindOf(b) || a.localeCompare(b));
}

/** Kinds written compactly, as players do: "123m 55p E Rd". */
export function kindsText(kinds: readonly Kind[]): string {
  const sorted = [...kinds].sort((a, b) => a - b);
  const groups: string[] = [];
  let run = '';
  let suit = -1;
  for (const k of sorted) {
    if (isSuited(k)) {
      const s = suitOf(k);
      if (s !== suit && run) {
        groups.push(`${run}${SUIT_LETTERS[suit] ?? ''}`);
        run = '';
      }
      suit = s;
      run += String(rankOf(k));
    } else {
      if (run) {
        groups.push(`${run}${SUIT_LETTERS[suit] ?? ''}`);
        run = '';
        suit = -1;
      }
      groups.push(codeOf(k));
    }
  }
  if (run) groups.push(`${run}${SUIT_LETTERS[suit] ?? ''}`);
  return groups.join(' ');
}

/** Reads "123m 55p E Rd" (or "1m2m3m", "EEE", "RdRdRd") back into kinds. */
export function parseKinds(text: string): Kind[] {
  const out: Kind[] = [];
  for (const word of text.trim().split(/\s+/).filter(Boolean)) {
    let i = 0;
    while (i < word.length) {
      // Digits followed by a suit letter: "123m", "55p".
      const run = /^(\d+)([mps])/.exec(word.slice(i));
      if (run) {
        const suit = SUIT_LETTERS.indexOf(run[2] as SuitLetter);
        for (const d of run[1] ?? '') {
          const n = Number(d);
          if (n < 1 || n > 9) throw new Error(`"${word}" has no tile ${d}`);
          out.push(suit * 9 + n - 1);
        }
        i += run[0].length;
        continue;
      }
      // An honour, bonus tile or joker: two letters first ("Wd", "F1", "S2"), then one ("E", "S").
      const two = parseKind(word.slice(i, i + 2));
      if (two !== null && word.slice(i, i + 2).length === 2) {
        out.push(two);
        i += 2;
        continue;
      }
      const one = parseKind(word.slice(i, i + 1));
      if (one === null) throw new Error(`"${word}" is not a list of tiles, such as 123m 55p E Rd`);
      out.push(one);
      i += 1;
    }
  }
  return out;
}
