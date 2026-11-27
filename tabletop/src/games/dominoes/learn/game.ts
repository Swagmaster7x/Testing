/**
 * Dominoes for the lesson runner: positions in state notation, moves in move notation ("3-5L",
 * "6-6", "pass", "draw"). A move may be several moves separated by spaces ("pass 4-5R pass"),
 * so one scripted reply can carry the other three players' turns.
 *
 * The student always sits in seat 0. A lesson position is one hand: it is over when that hand ends.
 */
import { findLegal } from '../../../core/contract';
import type { LessonGame } from '../../../teach/runner';
import type { DominoesConfig, DominoesState, Tile } from '../rules';
import { actionText, CUBAN, dominoes, EARLY, endsCount, endsOf, fivesScore, HAND_SIZE, handPips, handSize, hasNumber, numbersOf, PIPS, PRESETS, PUERTO_RICO_500, seatCount, setPips, sideOf, sleepingCount, TILES, tilesOfSet, tilesOnTable, TOTAL_PIPS, unseenTiles, viewOf } from '../rules';

const STUDENT = 0;

function parse(state: DominoesState, move: string) {
  const seat = dominoes.turn(state);
  if (seat === null) return null;
  try {
    return findLegal(dominoes, state, seat, dominoes.codec.action.fromText(move, state));
  } catch {
    return null;
  }
}

/** Plays one or more moves; null if any is not legal. */
function playAll(state: DominoesState, moves: string): { state: DominoesState; canonical: string[] } | null {
  let s = state;
  const canonical: string[] = [];
  for (const move of moves.trim().split(/\s+/)) {
    const action = parse(s, move);
    if (!action) return null;
    canonical.push(actionText(action));
    s = dominoes.apply(s, action).state;
  }
  return { state: s, canonical };
}

const preset = (id: string): DominoesConfig => PRESETS[id] ?? PUERTO_RICO_500;

/** Numbers that do not depend on the position. */
const FIXED: Record<string, number> = {
  'set:tiles': TILES.length,
  'set:pips': TOTAL_PIPS,
  'set:per-number': TILES.filter((t) => hasNumber(t, 0)).length,
  'set:doubles': TILES.filter((t) => t[0] === t[2]).length,
  'set:numbers': PIPS.length,
  'set:top': Math.max(...PIPS),
  'hand:size': HAND_SIZE,
  'players:four': 4,
  'boneyard:two': TILES.length - 2 * HAND_SIZE,
  'bonus:early-1': EARLY[0] ?? 0,
  'bonus:early-2': EARLY[1] ?? 0,
  'bonus:early-3': EARLY[2] ?? 0,
  'bonus:early-4': EARLY[3] ?? 0,
  'bonus:capicu': PUERTO_RICO_500.capicu,
  'bonus:chuchazo': PUERTO_RICO_500.chuchazo,
  'target:pr': PUERTO_RICO_500.target,
  'target:200': PRESETS['puerto-rico-200']?.target ?? 0,
  'target:100': PRESETS.mexico?.target ?? 0,
  'pass:first': 20,
  'pass:next': 10,
  // The double nine and Cuban dominó (milestone 14).
  'set9:tiles': tilesOfSet('double-nine').length,
  'set9:pips': setPips('double-nine'),
  'set9:per-number': tilesOfSet('double-nine').filter((t) => hasNumber(t, 0)).length,
  'set9:doubles': tilesOfSet('double-nine').filter((t) => t[0] === t[2]).length,
  'cuban:hand': handSize(CUBAN),
  'cuban:sleeping': sleepingCount(CUBAN),
  'cuban:target': CUBAN.target,
  'cuban:target-300': preset('cuban-300').target,
  // All Fives.
  'fives:hand-two': handSize(preset('all-fives')),
  'fives:hand-three': handSize(preset('all-fives-three')),
  'fives:hand-four': handSize(preset('all-fives-partners')),
  'fives:target-two': preset('all-fives').target,
  'fives:target-more': preset('all-fives-three').target,
};

export function dominoesComputed(state: DominoesState): Record<string, number> {
  const out: Record<string, number> = { ...FIXED };
  const n = seatCount(state.config);
  const view = viewOf(state, STUDENT);
  const ends = endsOf(state.chain);
  const unseen = unseenTiles(view);
  const mine = state.hands[STUDENT] ?? [];
  if (ends) {
    out['ends:left'] = ends[0];
    out['ends:right'] = ends[1];
  }
  out['hand:pips'] = handPips(mine);
  out['hand:tiles'] = mine.length;
  out['line:pips'] = handPips(tilesOnTable(state).map((p) => p.tile));
  out['line:tiles'] = tilesOnTable(state).length;
  out['unseen:pips'] = setPips(state.config.set) - out['line:pips'] - out['hand:pips'];
  out['unseen:tiles'] = unseen.length;
  if (ends) {
    out['ends:count'] = endsCount(state);
    out['ends:scores'] = fivesScore(endsCount(state));
  }
  for (const x of numbersOf(state.config.set)) {
    out[`unseen:${x}`] = unseen.filter((t) => hasNumber(t, x)).length;
    out[`mine:${x}`] = mine.filter((t) => hasNumber(t, x)).length;
    out[`line:${x}`] = tilesOnTable(state).filter((p) => hasNumber(p.tile, x)).length;
  }
  const pips = state.hands.map(handPips);
  out['pips:right'] = pips[1 % n] ?? 0;
  if (n === 4) {
    out['pips:partner'] = pips[2] ?? 0;
    out['pips:left'] = pips[3] ?? 0;
  }
  out['pips:us'] = pips.reduce((sum, p, seat) => (sideOf(seat, n) === 0 ? sum + p : sum), 0);
  out['pips:them'] = pips.reduce((sum, p, seat) => (sideOf(seat, n) === 1 ? sum + p : sum), 0);
  out['pips:all'] = out['pips:us'] + out['pips:them'];
  out['score:right'] = state.scores[1 % n] ?? 0;
  out['score:us'] = state.scores[0] ?? 0;
  out['score:them'] = state.scores[1] ?? 0;
  const last = state.results[state.results.length - 1];
  if (last) {
    out['result:us'] = last.points[0] ?? 0;
    out['result:them'] = last.points[1] ?? 0;
  }
  return out;
}

export const dominoesLessonGame: LessonGame<DominoesState> = {
  position: (text) => dominoes.codec.state.fromText(text),
  notation: (state) => dominoes.codec.state.toText(state),
  play(state, move) {
    return playAll(state, move)?.state ?? null;
  },
  canonical(state, move) {
    return playAll(state, move)?.canonical.join(' ') ?? null;
  },
  goalMet(goal, before, after) {
    if (goal !== 'win') return false;
    const result = after.results[before.results.length];
    return result !== undefined && result.winner === sideOf(STUDENT, seatCount(after.config));
  },
  toMove: (state) => (state.over || state.results.length > 0 ? null : dominoes.turn(state)),
  over: (state) => state.over || state.results.length > 0,
  moves(state) {
    const seat = dominoes.turn(state);
    return seat === null ? [] : dominoes.legal(state, seat).map(actionText);
  },
  computed: dominoesComputed,
  // Tiles of the double nine (7-9) are names, like the double six's.
  stripNotation: (text) => text.replace(/\b[0-9]-[0-9]\b/g, ' '),
};

/** The tiles in a list that hold a number. */
export function holding(tiles: readonly Tile[], x: number): Tile[] {
  return tiles.filter((t) => hasNumber(t, x));
}
