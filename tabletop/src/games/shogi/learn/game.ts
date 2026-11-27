/**
 * Shogi for the lesson runner: positions in SFEN, moves in the canonical form ("7776", "P*55"),
 * USI or Western notation. Every number a lesson quotes is a {placeholder} computed here from the
 * rules module and the presets.
 */
import { findLegal } from '../../../core/contract';
import type { FreePlayGoal } from '../../../teach/lesson';
import type { LessonGame } from '../../../teach/runner';
import type { Color } from '../core';
import { GEOMETRY, HAND_LETTER, HAND_TYPES, parseSfen, SET_COUNT, START_SFEN } from '../core';
import { canonicalOf } from '../notation';
import { DECLARE_BLACK, DECLARE_PIECES, DECLARE_WHITE, HANDICAPS, IMPASSE_24, IMPASSE_BIG, IMPASSE_SMALL, REPETITIONS } from '../presets';
import type { ShogiAction, ShogiState } from '../rules';
import { canonicalAction, declarationPoints, impassePoints, material, PIECE_NAMES, shogi, TEACHING_VALUE } from '../rules';

function parse(state: ShogiState, move: string): ShogiAction | null {
  const seat = shogi.turn(state);
  if (seat === null) return null;
  try {
    return findLegal(shogi, state, seat, shogi.codec.action.fromText(move, state));
  } catch {
    return null;
  }
}

const standardStart = parseSfen(START_SFEN.standard);
const miniStart = parseSfen(START_SFEN.mini);
const countPieces = (p: typeof standardStart) => p.geo.squares.filter((sq) => p.board[sq] !== 0 && p.board[sq]! >> 4 === 0).length;

/** Numbers that do not depend on the position. */
const FIXED: Record<string, number> = {
  'board:files': GEOMETRY.standard.files,
  'board:squares': GEOMETRY.standard.files * GEOMETRY.standard.ranks,
  'mini:files': GEOMETRY.mini.files,
  'mini:squares': GEOMETRY.mini.files * GEOMETRY.mini.ranks,
  'pieces:each': countPieces(standardStart),
  'mini:pieces': countPieces(miniStart),
  'pawns:each': SET_COUNT.standard[0]! / 2,
  'kinds:each': 8,
  'zone:ranks': GEOMETRY.standard.zone,
  'mini:zone': GEOMETRY.mini.zone,
  'rule:repetition': REPETITIONS,
  'impasse:big': IMPASSE_BIG,
  'impasse:small': IMPASSE_SMALL,
  'impasse:count': IMPASSE_24,
  'impasse:start': 2 * IMPASSE_BIG + 17 * IMPASSE_SMALL,
  'declare:black': DECLARE_BLACK,
  'declare:white': DECLARE_WHITE,
  'declare:pieces': DECLARE_PIECES,
  'dirs:king': 8,
  'dirs:gold': 6,
  'dirs:silver': 5,
  'knight:targets': 2,
  'handicaps:count': HANDICAPS.filter((h) => h.board === 'standard' && h.id !== 'even').length,
};
for (const [i, name] of PIECE_NAMES.entries()) if (name !== 'king') FIXED[`value:${name}`] = TEACHING_VALUE[i] ?? 0;
for (const h of HANDICAPS) if (h.board === 'standard' && h.id !== 'even') FIXED[`handicap:${h.id}:points`] = h.points;

/** True when the side that played `move` now has checkmate. */
function mated(before: ShogiState, after: ShogiState): boolean {
  const mover = shogi.turn(before);
  return after.result?.kind === 'checkmate' && after.result.winner === mover;
}

export const shogiLessonGame: LessonGame<ShogiState> = {
  position: (sfen) => shogi.codec.state.fromText(sfen),
  notation: (state) => state.sfen,
  play(state, move) {
    const action = parse(state, move);
    return action ? shogi.apply(state, action).state : null;
  },
  canonical(state, move) {
    const action = parse(state, move);
    return action ? canonicalAction(action) : null;
  },
  goalMet(goal: FreePlayGoal, before, after, move) {
    if (goal === 'mate') return mated(before, after);
    if (goal === 'promote') return /\+$/.test(shogiLessonGame.canonical(before, move) ?? '');
    const mover = shogi.turn(before) ?? 0;
    const lead = (s: ShogiState) => {
      const m = material(s);
      return mover === 0 ? m[0] - m[1] : m[1] - m[0];
    };
    return lead(after) - lead(before) >= 3;
  },
  over: (state) => state.result !== null,
  moves(state) {
    const seat = shogi.turn(state);
    return seat === null ? [] : shogi.legal(state, seat).map(canonicalAction);
  },
  computed(state) {
    const out: Record<string, number> = { ...FIXED };
    const p = parseSfen(state.sfen);
    const m = material(state);
    out['material:black'] = m[0];
    out['material:white'] = m[1];
    out['material:diff'] = Math.abs(m[0] - m[1]);
    out['moves:legal'] = state.result ? 0 : p.legalMoves().length;
    out['impasse:black'] = impassePoints(p, 0, state.rules);
    out['impasse:white'] = impassePoints(p, 1, state.rules);
    const declared = declarationPoints(p, p.side, state.rules);
    out['declare:points'] = declared.points;
    out['declare:camp'] = declared.pieces;
    for (const color of [0, 1] as const) {
      for (let type = 0; type < HAND_TYPES; type++) out[`hand:${color === 0 ? 'black' : 'white'}:${HAND_LETTER[type]}`] = p.handCount(color, type);
    }
    // Moves of the piece on each square, counted as if it were that side's turn.
    for (const sq of p.geo.squares) {
      const code = p.board[sq]!;
      if (code === 0) continue;
      const color = (code >> 4) as Color;
      const copy = p.clone();
      copy.side = color;
      copy.rehash();
      const own = copy.legalMoves().filter((mv) => ((mv >>> 8) & 0xff) === sq && (mv & (1 << 17)) === 0);
      const name = `${p.geo.fileOf[sq]}${p.geo.rankOf[sq]}`;
      out[`moves:${name}`] = own.length;
      // Squares it can reach: a move that may promote or not counts once.
      out[`reach:${name}`] = new Set(own.map((mv) => mv & 0xff)).size;
      out[`attackers:${name}`] = p.attackers(sq, (1 - color) as Color).length;
      out[`defenders:${name}`] = p.attackers(sq, color).length;
    }
    // Squares each piece in hand could be dropped on, for the side to move.
    const legal = state.result ? [] : p.legalMoves();
    for (let type = 0; type < HAND_TYPES; type++) {
      const letter = HAND_LETTER[type]!;
      out[`drops:${letter}`] = legal.filter((mv) => canonicalOf(p.geo, mv).startsWith(`${letter}*`)).length;
    }
    return out;
  },
  stripNotation(text) {
    return text
      .replace(/\+?[PLNSGBRK](\d\d)?[-x*]\d\d[+=]?/g, ' ')
      .replace(/\b\d{4}\+?/g, ' ')
      .replace(/[1-9１-９][一二三四五六七八九]/g, ' ')
      .replace(/\b(file|rank) [1-9]\b/g, ' ')
      .replace(/\b[1-9][a-i]\b/g, ' ')
      .replace(/\b[1-9]-file\b/g, ' ')
      .replace(/\b[1-9][1-9]\b/g, ' ');
  },
};
