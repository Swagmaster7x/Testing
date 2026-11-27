// Golden cases for docs/rules/noughts.md.
import { describe, expect, it } from 'vitest';
import type { NoughtsState } from '../../src/games/noughts/rules';
import { cellName, noughts, openLines, parseCell, winningCells } from '../../src/games/noughts/rules';
import { createRng } from '../../src/core/rng';

function play(moves: string[]): { state: NoughtsState; events: unknown[] } {
  let state = noughts.setup({}, createRng('golden'));
  let events: unknown[] = [];
  for (const m of moves) {
    const r = noughts.apply(state, parseCell(m));
    state = r.state;
    events = r.events;
  }
  return { state, events };
}

describe('noughts and crosses rules', () => {
  it('starts empty with X to move and nine legal moves', () => {
    const s = noughts.setup({}, createRng('a'));
    expect(noughts.turn(s)).toBe(0);
    expect(noughts.legal(s, 0)).toHaveLength(9);
    expect(noughts.outcome(s)).toBeNull();
    expect(noughts.codec.state.toText(s)).toBe('.../.../... x');
  });

  it('names squares like a chessboard', () => {
    expect(cellName(0)).toBe('a3');
    expect(cellName(4)).toBe('b2');
    expect(cellName(8)).toBe('c1');
    expect(parseCell('A3')).toBe(0);
    expect(parseCell(' c1 ')).toBe(8);
    expect(() => parseCell('d4')).toThrow();
    for (let i = 0; i < 9; i++) expect(parseCell(cellName(i))).toBe(i);
  });

  it('ends with a row win', () => {
    const { state, events } = play(['a3', 'a2', 'b3', 'b2', 'c3']);
    expect(state.winner).toBe(0);
    expect(state.line).toEqual([0, 1, 2]);
    expect(noughts.turn(state)).toBeNull();
    expect(events).toEqual([
      { type: 'placed', seat: 0, cell: 2 },
      { type: 'line', seat: 0, cells: [0, 1, 2] },
    ]);
    expect(noughts.outcome(state)).toEqual({
      reason: 'line',
      results: [
        { seat: 0, place: 1, score: 1 },
        { seat: 1, place: 2, score: 0 },
      ],
    });
  });

  it('ends with a column win for O', () => {
    const { state } = play(['a3', 'b3', 'a2', 'b2', 'c1', 'b1']);
    expect(state.winner).toBe(1);
    expect(state.line).toEqual([1, 4, 7]);
  });

  it('ends with a diagonal win', () => {
    const { state } = play(['a3', 'b3', 'b2', 'c3', 'c1']);
    expect(state.winner).toBe(0);
    expect(state.line).toEqual([0, 4, 8]);
  });

  it('ends in a draw when the board fills with no line', () => {
    const { state, events } = play(['b2', 'a3', 'c3', 'a1', 'a2', 'c2', 'b1', 'b3', 'c1']);
    expect(state.winner).toBeNull();
    expect(noughts.turn(state)).toBeNull();
    expect(events.at(-1)).toEqual({ type: 'full' });
    expect(noughts.outcome(state)?.reason).toBe('board-full');
  });

  it('refuses a taken square, a move out of turn and a move after the end', () => {
    const { state } = play(['b2']);
    expect(() => noughts.apply(state, 4)).toThrow(/taken/);
    expect(noughts.legal(state, 0)).toEqual([]);
    const done = play(['a3', 'a2', 'b3', 'b2', 'c3']).state;
    expect(() => noughts.apply(done, 8)).toThrow(/over/);
    expect(noughts.legal(done, 1)).toEqual([]);
    expect(() => noughts.apply(noughts.setup({}, createRng('x')), 9)).toThrow();
  });

  it('never changes the state it is given', () => {
    const { state } = play(['b2']);
    const before = JSON.stringify(state);
    noughts.apply(state, 0);
    expect(JSON.stringify(state)).toBe(before);
  });

  it('reads and writes positions, refusing impossible ones', () => {
    const s = play(['b2', 'a3', 'c3']).state;
    const text = noughts.codec.state.toText(s);
    expect(text).toBe('o.x/.x./... o');
    expect(noughts.codec.state.fromText(text)).toEqual(s);
    expect(noughts.codec.state.fromJSON(noughts.codec.state.toJSON(s))).toEqual(s);
    expect(() => noughts.codec.state.fromText('o../.../... x')).toThrow(); // O moved first
    expect(() => noughts.codec.state.fromText('xxx/ooo/... x')).toThrow(); // two lines
    expect(() => noughts.codec.state.fromText('xxx/oo./... x')).toThrow(); // X to move after X won
    expect(() => noughts.codec.state.fromText('xxx/oo./o.. x')).toThrow(); // O played after the line
    expect(() => noughts.codec.state.fromText('nonsense')).toThrow();
    expect(() => noughts.codec.state.fromJSON({ cells: [1, 2] })).toThrow();
  });

  it('reads and writes moves', () => {
    expect(noughts.codec.action.toText(4)).toBe('b2');
    expect(noughts.codec.action.fromText('b2')).toBe(4);
    expect(noughts.codec.action.fromJSON(8)).toBe(8);
    expect(() => noughts.codec.action.fromJSON(9)).toThrow();
    expect(() => noughts.codec.action.fromJSON('b2')).toThrow();
  });

  it('shows each seat the whole board, since nothing is hidden', () => {
    const { state } = play(['b2']);
    expect(noughts.view(state, 1)).toEqual(state);
    expect(noughts.sample?.(noughts.view(state, 1), 1, createRng('s'))).toEqual(state);
  });

  it('counts open lines and finishing squares', () => {
    const { state } = play(['a3', 'b2', 'b3']);
    expect(winningCells(state.cells, 0)).toEqual([2]);
    expect(winningCells(state.cells, 1)).toEqual([]);
    expect(openLines(noughts.setup({}, createRng('x')).cells, 0)).toBe(8);
    expect(openLines(state.cells, 1)).toBe(4);
  });
});
