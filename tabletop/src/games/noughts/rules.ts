/**
 * Noughts and crosses: the fixture game for milestone 0. It is not on the shelf. It exists to
 * prove the contract, play against a worker bot, save and resume, replay and the animation queue.
 * Rules as implemented: docs/rules/noughts.md.
 */
import type { Codec, GameDef, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';

/** Seat 0 plays X and moves first; seat 1 plays O. */
export type Mark = 0 | 1;
export type Cell = Mark | null;

export interface NoughtsState {
  /** Nine cells, row by row from the top-left. */
  readonly cells: readonly Cell[];
  readonly toMove: Mark;
  readonly winner: Mark | null;
  /** The three cells of the winning line, when there is one. */
  readonly line: readonly number[] | null;
}

/** The index of the cell to mark, 0 to 8. */
export type NoughtsAction = number;

/** Noughts and crosses has no options. */
export type NoughtsConfig = Record<string, never>;

/** Nothing is hidden, so a seat sees the whole state. */
export type NoughtsView = NoughtsState;

export type NoughtsEvent =
  | { readonly type: 'placed'; readonly seat: Mark; readonly cell: number }
  | { readonly type: 'line'; readonly seat: Mark; readonly cells: readonly number[] }
  | { readonly type: 'full' };

export const LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const FILES = 'abc';

/** Squares are named like a chessboard: files a to c from the left, ranks 1 to 3 from the bottom. */
export function cellName(cell: number): string {
  return `${FILES[cell % 3]}${3 - Math.floor(cell / 3)}`;
}

export function parseCell(name: string): number {
  const match = /^([abc])([123])$/.exec(name.trim().toLowerCase());
  if (!match) throw new Error(`"${name}" is not a square (a1 to c3)`);
  const file = FILES.indexOf(match[1] as string);
  const rank = Number(match[2]);
  return (3 - rank) * 3 + file;
}

export function markOf(seat: Seat): 'X' | 'O' {
  return seat === 0 ? 'X' : 'O';
}

function findLine(cells: readonly Cell[]): { winner: Mark; line: number[] } | null {
  for (const [a, b, c] of LINES) {
    const m = cells[a];
    if (m !== null && m !== undefined && m === cells[b] && m === cells[c]) return { winner: m, line: [a, b, c] };
  }
  return null;
}

function lineOwners(cells: readonly Cell[]): Set<Mark> {
  const owners = new Set<Mark>();
  for (const [a, b, c] of LINES) {
    const m = cells[a];
    if (m !== null && m !== undefined && m === cells[b] && m === cells[c]) owners.add(m);
  }
  return owners;
}

function isFull(cells: readonly Cell[]): boolean {
  return cells.every((c) => c !== null);
}

function checkState(state: NoughtsState): NoughtsState {
  const { cells } = state;
  if (cells.length !== 9 || cells.some((c) => c !== null && c !== 0 && c !== 1)) throw new Error('A board has nine cells of X, O or empty');
  const x = cells.filter((c) => c === 0).length;
  const o = cells.filter((c) => c === 1).length;
  if (x - o !== 0 && x - o !== 1) throw new Error('X moves first, so X has as many marks as O or one more');
  const toMove: Mark = x === o ? 0 : 1;
  if (state.toMove !== toMove) throw new Error('The side to move does not match the marks on the board');
  if (lineOwners(cells).size > 1) throw new Error('Only one side can have a line');
  const found = findLine(cells);
  if ((found?.winner ?? null) !== state.winner) throw new Error('The winner does not match the board');
  // The winning move is the last one: after X wins X has one mark more, after O wins they are level.
  if (found && found.winner !== (toMove === 0 ? 1 : 0)) throw new Error('Play cannot go on after a line');
  return { cells: [...cells], toMove, winner: found?.winner ?? null, line: found?.line ?? null };
}

const stateCodec: Codec<NoughtsState> = {
  toJSON: (s) => ({ cells: [...s.cells], toMove: s.toMove, winner: s.winner, line: s.line ? [...s.line] : null }),
  fromJSON(json: Json) {
    if (!isJsonObject(json) || !Array.isArray(json.cells)) throw new Error('Not a noughts and crosses position');
    const cells = json.cells.map((c): Cell => (c === 0 || c === 1 ? c : null));
    const toMove = json.toMove === 1 ? 1 : 0;
    const winner = json.winner === 0 || json.winner === 1 ? json.winner : null;
    return checkState({ cells, toMove, winner, line: null });
  },
  /** Rows from the top joined by "/", then the side to move: "x.o/.x./... o". */
  toText: (s) =>
    `${[0, 1, 2].map((r) => s.cells.slice(r * 3, r * 3 + 3).map((c) => (c === 0 ? 'x' : c === 1 ? 'o' : '.')).join('')).join('/')} ${s.toMove === 0 ? 'x' : 'o'}`,
  fromText(text: string) {
    const match = /^([xo.]{3})\/([xo.]{3})\/([xo.]{3}) ([xo])$/.exec(text.trim().toLowerCase());
    if (!match) throw new Error(`"${text}" is not a noughts and crosses position`);
    const cells = (match.slice(1, 4).join('').split('') as ('x' | 'o' | '.')[]).map((ch): Cell => (ch === 'x' ? 0 : ch === 'o' ? 1 : null));
    const found = findLine(cells);
    return checkState({ cells, toMove: match[4] === 'x' ? 0 : 1, winner: found?.winner ?? null, line: null });
  },
};

const actionCodec: Codec<NoughtsAction> = {
  toJSON: (a) => a,
  fromJSON(json: Json) {
    if (typeof json !== 'number' || !Number.isInteger(json) || json < 0 || json > 8) throw new Error('A move is a square from 0 to 8');
    return json;
  },
  toText: (a) => cellName(a),
  fromText: (text) => parseCell(text),
};

const configCodec: JsonCodec<NoughtsConfig> = {
  toJSON: () => ({}),
  fromJSON: () => ({}),
};

export const noughts: GameDef<NoughtsState, NoughtsAction, NoughtsConfig, NoughtsView, NoughtsEvent> = {
  id: 'noughts',
  rulesVersion: 1,
  defaultConfig: {},

  setup: () => ({ cells: Array<Cell>(9).fill(null), toMove: 0, winner: null, line: null }),

  seats: () => [0, 1],

  turn: (s) => (s.winner !== null || isFull(s.cells) ? null : s.toMove),

  legal(s, seat) {
    if (noughts.turn(s) !== seat) return [];
    const moves: number[] = [];
    s.cells.forEach((c, i) => {
      if (c === null) moves.push(i);
    });
    return moves;
  },

  apply(s, action) {
    const seat = noughts.turn(s);
    if (seat === null) throw new Error('The game is over');
    if (!Number.isInteger(action) || action < 0 || action > 8) throw new Error(`No square ${action}`);
    if (s.cells[action] !== null) throw new Error(`${cellName(action)} is taken`);
    const mark = seat as Mark;
    const cells = s.cells.slice();
    cells[action] = mark;
    const found = findLine(cells);
    const events: NoughtsEvent[] = [{ type: 'placed', seat: mark, cell: action }];
    if (found) events.push({ type: 'line', seat: found.winner, cells: found.line });
    else if (isFull(cells)) events.push({ type: 'full' });
    return {
      state: { cells, toMove: mark === 0 ? 1 : 0, winner: found?.winner ?? null, line: found?.line ?? null },
      events,
    };
  },

  outcome(s): Outcome | null {
    if (s.winner !== null) {
      const loser: Mark = s.winner === 0 ? 1 : 0;
      return {
        reason: 'line',
        results: [
          { seat: s.winner, place: 1, score: 1 },
          { seat: loser, place: 2, score: 0 },
        ],
      };
    }
    if (isFull(s.cells)) {
      return {
        reason: 'board-full',
        results: [
          { seat: 0, place: 1, score: 0.5 },
          { seat: 1, place: 1, score: 0.5 },
        ],
      };
    }
    return null;
  },

  view: (s) => s,

  sample: (view) => view,

  codec: { state: stateCodec, action: actionCodec, config: configCodec },
};

/** The lines a seat could still complete: none of the other mark in them. */
export function openLines(cells: readonly Cell[], seat: Mark): number {
  return LINES.filter((line) => line.every((i) => cells[i] !== (seat === 0 ? 1 : 0))).length;
}

/** Cells that would complete a line for `seat` right now. */
export function winningCells(cells: readonly Cell[], seat: Mark): number[] {
  const out = new Set<number>();
  for (const line of LINES) {
    const marks = line.filter((i) => cells[i] === seat).length;
    const empty = line.filter((i) => cells[i] === null);
    if (marks === 2 && empty.length === 1) out.add(empty[0] as number);
  }
  return [...out];
}
