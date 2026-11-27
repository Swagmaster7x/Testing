/**
 * Shogi move notation, all computed from the position core:
 * - the app's canonical form, stored in records: "7776", "8822+", "P*55" (USI with digit ranks);
 * - USI, the engine protocol: "7g7f", "8h2b+", "P*5e";
 * - Western notation for the move list: "P-76", "Bx22+", "S*52", "G61-52", "S-34=";
 * - Japanese notation as in KIF files: "７六歩(77)", "２二角成(88)", "５五角打".
 */
import type { Color, Geometry, Position } from './core';
import {
  BASE,
  canPromoteType,
  colorOfCode,
  dropType,
  EMPTY,
  HAND_LETTER,
  isDrop,
  isPromotion,
  KING,
  moveFrom,
  moveTo,
  movingOf,
  parseSquare,
  squareName,
  typeOfCode,
} from './core';

export const DECLARE = 'declare';

/** The canonical text of a packed move. */
export function canonicalOf(geo: Geometry, m: number): string {
  if (isDrop(m)) return `${HAND_LETTER[dropType(m)]}*${squareName(geo, moveTo(m))}`;
  return `${squareName(geo, moveFrom(m))}${squareName(geo, moveTo(m))}${isPromotion(m) ? '+' : ''}`;
}

const RANK_LETTERS = 'abcdefghi';

function usiSquare(name: string): string {
  return `${name[0]}${RANK_LETTERS[Number(name[1]) - 1]}`;
}

function digitSquare(text: string): string {
  const rank = /[a-i]/.test(text[1] ?? '') ? RANK_LETTERS.indexOf(text[1] ?? '') + 1 : Number(text[1]);
  return `${text[0]}${rank}`;
}

/** Canonical "7776+" to USI "7g7f+". */
export function canonicalToUsi(move: string): string {
  if (move === DECLARE) return 'win';
  const drop = /^([PLNSGBR])\*(\d\d)$/.exec(move);
  if (drop) return `${drop[1]}*${usiSquare(drop[2] ?? '')}`;
  const m = /^(\d\d)(\d\d)(\+?)$/.exec(move);
  if (!m) throw new Error(`"${move}" is not a shogi move`);
  return `${usiSquare(m[1] ?? '')}${usiSquare(m[2] ?? '')}${m[3] ?? ''}`;
}

/** USI "7g7f+" (or the canonical form itself) to canonical "7776+"; null if it is neither. */
export function toCanonical(text: string): string | null {
  const t = text.trim();
  if (t === DECLARE || t === 'win') return DECLARE;
  const drop = /^([PLNSGBR])\*([1-9])([1-9a-i])$/.exec(t);
  if (drop) return `${drop[1]}*${digitSquare(`${drop[2]}${drop[3]}`)}`;
  const m = /^([1-9])([1-9a-i])([1-9])([1-9a-i])(\+?)$/.exec(t);
  if (!m) return null;
  return `${digitSquare(`${m[1]}${m[2]}`)}${digitSquare(`${m[3]}${m[4]}`)}${m[5] ?? ''}`;
}

/** Finds the packed legal move for a canonical string, or null. */
export function moveFromCanonical(p: Position, legal: readonly number[], canonical: string): number | null {
  for (const m of legal) if (canonicalOf(p.geo, m) === canonical) return m;
  return null;
}

/** Piece letters for Western notation, by type: promoted pieces carry a "+" in front. */
export const WESTERN_LETTER: readonly string[] = ['P', 'L', 'N', 'S', 'G', 'B', 'R', 'K', '+P', '+L', '+N', '+S', '+B', '+R'];

/**
 * Western notation for each legal move, computed together so that an origin square is added only
 * when another piece of the same kind could reach the same square, and "=" marks a promotion that
 * was possible but declined.
 */
export function westernAll(p: Position, legal: readonly number[]): string[] {
  const geo = p.geo;
  return legal.map((m) => {
    const to = moveTo(m);
    const dest = squareName(geo, to);
    if (isDrop(m)) return `${HAND_LETTER[dropType(m)]}*${dest}`;
    const moving = movingOf(m);
    const from = moveFrom(m);
    const rivals = legal.some((o) => o !== m && !isDrop(o) && movingOf(o) === moving && moveTo(o) === to && moveFrom(o) !== from);
    const origin = rivals ? squareName(geo, from) : '';
    const sep = p.board[to] !== EMPTY ? 'x' : '-';
    let suffix = '';
    if (isPromotion(m)) suffix = '+';
    else if (canPromoteType(typeOfCode(moving)) && legal.some((o) => o !== m && !isDrop(o) && moveFrom(o) === from && moveTo(o) === to && isPromotion(o))) suffix = '=';
    return `${WESTERN_LETTER[typeOfCode(moving)]}${origin}${sep}${dest}${suffix}`;
  });
}

const FULL_DIGITS = '０１２３４５６７８９';
const KANJI_DIGITS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
/** One-character (or two for promoted minors) names used in Japanese move notation. */
const KIF_PIECE: readonly string[] = ['歩', '香', '桂', '銀', '金', '角', '飛', '玉', 'と', '成香', '成桂', '成銀', '馬', '龍'];

export function japaneseSquare(geo: Geometry, index: number): string {
  return `${FULL_DIGITS[geo.fileOf[index] ?? 0]}${KANJI_DIGITS[geo.rankOf[index] ?? 0]}`;
}

/**
 * Japanese notation as KIF writes it: destination, piece, 成 or 不成, 打 for drops, and the origin
 * square in brackets; 同 when the move lands where the last one did.
 */
export function japaneseMove(p: Position, m: number, legal: readonly number[], lastTo: number | null, kingName = '玉'): string {
  const geo = p.geo;
  const to = moveTo(m);
  const where = lastTo === to ? '同　' : japaneseSquare(geo, to);
  if (isDrop(m)) return `${where}${KIF_PIECE[dropType(m)]}打`;
  const moving = movingOf(m);
  const type = typeOfCode(moving);
  const from = moveFrom(m);
  let name = type === KING ? kingName : (KIF_PIECE[type] ?? '');
  if (isPromotion(m)) name += '成';
  else if (canPromoteType(type) && legal.some((o) => o !== m && !isDrop(o) && moveFrom(o) === from && moveTo(o) === to && isPromotion(o))) name += '不成';
  return `${where}${name}(${geo.fileOf[from]}${geo.rankOf[from]})`;
}

/** Reads Western notation in a position: the legal move it names, or null (also when ambiguous). */
export function parseWestern(p: Position, legal: readonly number[], text: string): number | null {
  const m = /^(\+?[PLNSGBRK])(\d\d)?([-xX*])(\d\d)([+=])?$/.exec(text.trim());
  if (!m) return null;
  const [, letter = '', origin, sep, dest = '', suffix] = m;
  const to = parseSquare(p.geo, dest);
  if (to < 0) return null;
  const found = legal.filter((move) => {
    if (moveTo(move) !== to) return false;
    if (sep === '*') return isDrop(move) && HAND_LETTER[dropType(move)] === letter;
    if (isDrop(move)) return false;
    const type = typeOfCode(movingOf(move));
    if (WESTERN_LETTER[type] !== letter) return false;
    if (origin && squareName(p.geo, moveFrom(move)) !== origin) return false;
    return suffix === '+' ? isPromotion(move) : !isPromotion(move);
  });
  return found.length === 1 ? (found[0] ?? null) : null;
}

/** The hand letter of a captured piece (what goes into hand), or null. */
export function capturedLetter(m: number, board: Int8Array): string | null {
  if (isDrop(m)) return null;
  const code = board[moveTo(m)] ?? EMPTY;
  if (code === EMPTY) return null;
  return HAND_LETTER[BASE[typeOfCode(code)] ?? 0] ?? null;
}

export function moverOf(m: number): Color {
  return colorOfCode(movingOf(m));
}
