/**
 * Counting a finished Go game (docs/rules/go.md, "Scoring"). Dead stones are taken off first.
 * Then every empty region that touches stones of only one colour is that colour's territory;
 * regions touching both colours, or none, are neutral (dame).
 *
 * - Area (Chinese, AGA, New Zealand): live stones on the board plus territory.
 * - Territory (Japanese, Korean): territory plus prisoners, which are the stones captured
 *   during play and the dead stones taken off at the end.
 *
 * White adds komi and, in handicap games under some rules, compensation for the handicap
 * stones. Under the Japanese rules, empty points surrounded by stones that are alive only in
 * seki are not territory: a seki point is a shared liberty that neither side can fill without
 * leaving its own stones in atari, and the stones next to one are in seki.
 */
import type { Color } from './board';
import { BLACK, Board, EDGE, EMPTY, WHITE } from './board';

export type Scoring = 'area' | 'territory';
export type HandicapCompensation = 'none' | 'n' | 'n-1';

export interface CountRules {
  readonly scoring: Scoring;
  readonly komi: number;
  readonly compensation: HandicapCompensation;
  /** 'neutral': eyes of groups in seki are not territory (Japanese); 'count': they are. */
  readonly seki: 'count' | 'neutral';
}

export interface Count {
  /** Per point: 0 neutral, 1 Black's, 2 White's (stones count for their own side). */
  readonly owner: Uint8Array;
  readonly territory: readonly [number, number];
  /** Live stones on the board. */
  readonly stones: readonly [number, number];
  /** Dead stones of each colour taken off at the end. */
  readonly dead: readonly [number, number];
  /** Prisoners held by Black and by White, dead stones included (territory method). */
  readonly prisoners: readonly [number, number];
  readonly komi: number;
  /** Points White receives for the handicap stones. */
  readonly compensation: number;
  readonly black: number;
  readonly white: number;
  /** Seki points (shared liberties neither side can fill). */
  readonly seki: readonly number[];
}

export function compensationFor(rule: HandicapCompensation, handicap: number): number {
  if (handicap < 2) return 0;
  if (rule === 'n') return handicap;
  if (rule === 'n-1') return handicap - 1;
  return 0;
}

/** The board with the dead stones taken off (as a Board, for liberty questions). */
function liveBoard(size: number, board: string, dead: ReadonlySet<number>): Board {
  let text = '';
  for (let p = 0; p < board.length; p++) text += dead.has(p) ? '.' : (board[p] as string);
  return Board.fromText(size, text);
}

/** Shared liberties that neither colour can fill without leaving its own stones in atari. */
export function sekiPoints(live: Board): number[] {
  const out: number[] = [];
  const dirs = live.dirs;
  for (let k = 0; k < live.emptyCount; k++) {
    const i = live.empties[k] as number;
    let black = false;
    let white = false;
    for (let d = 0; d < 4; d++) {
      const c = live.color[i + (dirs[d] as number)];
      if (c === BLACK) black = true;
      else if (c === WHITE) white = true;
    }
    if (!black || !white) continue;
    if (!safeFill(live, i, BLACK) && !safeFill(live, i, WHITE)) out.push(live.point(i));
  }
  return out.sort((a, b) => a - b);
}

function safeFill(board: Board, i: number, c: Color): boolean {
  if (!board.isLegal(i, c, false)) return false;
  const after = board.copy();
  after.play(i, c);
  return after.libertyCount(i) >= 2;
}

/**
 * Counts a position. `board` has one character per point ('.', 'X', 'O'); `dead` lists the
 * points of stones agreed dead; `captured` is the prisoners each side took during play
 * (Black's first), pass stones included.
 */
export function countBoard(size: number, board: string, dead: Iterable<number>, captured: readonly [number, number], rules: CountRules, handicap: number): Count {
  const deadSet = new Set(dead);
  const live = liveBoard(size, board, deadSet);
  const n = size * size;
  const owner = new Uint8Array(n);
  const stones: [number, number] = [0, 0];
  const deadCount: [number, number] = [0, 0];
  for (let p = 0; p < n; p++) {
    const ch = board[p];
    if (ch !== 'X' && ch !== 'O') continue;
    const side = ch === 'X' ? 0 : 1;
    if (deadSet.has(p)) deadCount[side]++;
    else {
      stones[side]++;
      owner[p] = side + 1;
    }
  }

  const seki = rules.seki === 'neutral' ? sekiPoints(live) : [];
  // Stones next to a seki point are alive in seki; the regions they touch are not territory.
  const sekiStones = new Set<number>();
  for (const p of seki) {
    const i = live.fromPoint(p);
    for (let d = 0; d < 4; d++) {
      const nb = i + (live.dirs[d] as number);
      const c = live.color[nb];
      if (c === BLACK || c === WHITE) for (const s of live.chain(live.head[nb] as number)) sekiStones.add(s);
    }
  }

  const territory: [number, number] = [0, 0];
  const seen = new Uint8Array(live.cells);
  for (let start = 0; start < live.cells; start++) {
    if (live.color[start] !== EMPTY || seen[start]) continue;
    const region: number[] = [];
    let touchesBlack = false;
    let touchesWhite = false;
    let touchesSeki = false;
    const stack = [start];
    seen[start] = 1;
    while (stack.length > 0) {
      const i = stack.pop() as number;
      region.push(i);
      for (let d = 0; d < 4; d++) {
        const nb = i + (live.dirs[d] as number);
        const c = live.color[nb];
        if (c === EMPTY) {
          if (!seen[nb]) {
            seen[nb] = 1;
            stack.push(nb);
          }
        } else if (c === BLACK) {
          touchesBlack = true;
          if (sekiStones.has(nb)) touchesSeki = true;
        } else if (c === WHITE) {
          touchesWhite = true;
          if (sekiStones.has(nb)) touchesSeki = true;
        } else if (c !== EDGE) throw new Error('Unexpected cell');
      }
    }
    if (touchesBlack === touchesWhite || touchesSeki) continue;
    const side = touchesBlack ? 0 : 1;
    territory[side] += region.length;
    for (const i of region) owner[live.point(i)] = side + 1;
  }

  const prisoners: [number, number] = [captured[0] + deadCount[1], captured[1] + deadCount[0]];
  const compensation = compensationFor(rules.compensation, handicap);
  const black = rules.scoring === 'area' ? stones[0] + territory[0] : territory[0] + prisoners[0];
  const white = (rules.scoring === 'area' ? stones[1] + territory[1] : territory[1] + prisoners[1]) + rules.komi + compensation;
  return { owner, territory, stones, dead: deadCount, prisoners, komi: rules.komi, compensation, black, white, seki };
}

/** "B+3.5", "W+0.5", or "0" for a tie. */
export function resultText(black: number, white: number): string {
  if (black === white) return '0';
  return black > white ? `B+${black - white}` : `W+${white - black}`;
}
