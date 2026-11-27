/**
 * Go for the lesson runner: positions in the Go position notation (docs/rules/go.md, "Notation"),
 * moves as point names ("D4"), SGF letters ("dd") or "pass". The canonical form is the stored
 * one ("dd", "pass"). Numbers for lesson text are computed here from the rules module.
 */
import { findLegal } from '../../../core/contract';
import type { LessonGame } from '../../../teach/runner';
import { Board } from '../board';
import { handicapPoints, maxHandicap, pointName, starPoints } from '../coords';
import type { GoAction, GoState } from '../rules';
import { BOARD_SIZES, countState, go, HANDICAP_KOMI, PASSES_TO_END, positionText, PRESETS } from '../rules';
import { EYES_FOR_LIFE } from '../solver';
import { compensationFor } from '../score';

function parse(state: GoState, move: string): GoAction | null {
  const seat = go.turn(state);
  if (seat === null) return null;
  try {
    return findLegal(go, state, seat, go.codec.action.fromText(move, state));
  } catch {
    return null;
  }
}

/** Liberties of a lone stone at (x, y) on an empty board. */
function lonely(x: number, y: number): number {
  const b = new Board(5);
  const i = b.index(x, y);
  b.setStone(i, 1);
  return b.libertyCount(i);
}

const [SMALL = 9, MID = 13, BIG = 19] = BOARD_SIZES;

/** Numbers that do not depend on the position. */
const FIXED: Record<string, number> = {
  'size:small': SMALL,
  'size:mid': MID,
  'size:big': BIG,
  'points:small': SMALL * SMALL,
  'points:big': BIG * BIG,
  'stars:small': starPoints(SMALL).length,
  'stars:big': starPoints(BIG).length,
  'komi:chinese': PRESETS.chinese.komi,
  'komi:japanese': PRESETS.japanese.komi,
  'komi:nz': PRESETS['new-zealand'].komi,
  'komi:aga': PRESETS.aga.komi,
  'komi:handicap': HANDICAP_KOMI,
  'handicap:max': maxHandicap(BIG),
  'handicap:min': handicapPoints(BIG, 2).length,
  'liberties:centre': lonely(2, 2),
  'liberties:edge': lonely(2, 0),
  'liberties:corner': lonely(0, 0),
  'passes:end': PASSES_TO_END,
  'eyes:needed': EYES_FOR_LIFE,
  // A full set covers the big board: Black, moving first, has the odd stone.
  'set:black': Math.ceil((BIG * BIG) / 2),
  'set:white': Math.floor((BIG * BIG) / 2),
};

export const goLessonGame: LessonGame<GoState> = {
  position: (text) => go.codec.state.fromText(text),
  notation: (state) => positionText(state),
  play(state, move) {
    const action = parse(state, move);
    return action ? go.apply(state, action).state : null;
  },
  canonical(state, move) {
    const action = parse(state, move);
    return action ? (go.codec.action.toJSON(action) as string) : null;
  },
  goalMet(goal, before, after) {
    if (goal !== 'win-material') return false;
    const mover = before.toMove;
    const taken = (s: GoState) => (mover === 0 ? s.prisoners[0] : s.prisoners[1]);
    return taken(after) > taken(before);
  },
  over: (state) => go.turn(state) === null,
  moves(state) {
    const seat = go.turn(state);
    return seat === null ? [] : go.legal(state, seat).map((a) => go.codec.action.toJSON(a) as string);
  },
  computed(state) {
    const out: Record<string, number | string> = { ...FIXED };
    out.size = state.size;
    out.points = state.size * state.size;
    out.komi = state.rules.komi;
    out['capture:target'] = state.rules.captureTarget;
    out['prisoners:black'] = state.prisoners[0];
    out['prisoners:white'] = state.prisoners[1];
    out.compensation = compensationFor(state.rules.compensation, state.handicap);
    const count = countState(state);
    out['stones:black'] = count.stones[0];
    out['stones:white'] = count.stones[1];
    out['territory:black'] = count.territory[0];
    out['territory:white'] = count.territory[1];
    out['area:black'] = count.stones[0] + count.territory[0];
    out['area:white'] = count.stones[1] + count.territory[1];
    out['dead:black'] = count.dead[0];
    out['dead:white'] = count.dead[1];
    out['held:black'] = count.prisoners[0];
    out['held:white'] = count.prisoners[1];
    out['score:black'] = count.black;
    out['score:white'] = count.white;
    out.margin = Math.abs(count.black - count.white);
    out.winner = count.black > count.white ? 'Black' : count.white > count.black ? 'White' : 'nobody';
    // Liberties and chain sizes for every stone, by point name.
    const board = Board.fromText(state.size, state.board);
    let empty = 0;
    for (let p = 0; p < state.board.length; p++) {
      if (state.board[p] === '.') {
        empty++;
        continue;
      }
      const name = pointName(p, state.size);
      const i = board.fromPoint(p);
      const h = board.head[i] as number;
      out[`libs:${name}`] = board.liberties(h).length;
      out[`chain:${name}`] = board.stones[h] as number;
    }
    out.empty = empty;
    out.stones = state.board.length - empty;
    return out;
  },
};
