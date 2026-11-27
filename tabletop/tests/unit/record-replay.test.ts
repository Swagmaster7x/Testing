import { describe, expect, it } from 'vitest';
import { canOpen, humanSeats, newRecord, parseRecord, withAction, withOutcome, withResignation } from '../../src/core/record';
import { replay, ReplayError } from '../../src/core/replay';
import { noughts, parseCell } from '../../src/games/noughts/rules';

function recordOf(moves: string[]) {
  let r = newRecord(noughts, {
    id: 'r1',
    config: {},
    seed: 'seed-1',
    players: [{ kind: 'human' }, { kind: 'bot', level: 2 }],
    appVersion: '0.1.0',
    training: false,
    now: 100,
  });
  moves.forEach((m, i) => {
    r = withAction(r, noughts.codec.action.toJSON(parseCell(m)), 101 + i);
  });
  return r;
}

describe('game records', () => {
  it('start empty and keep config, seed, rules version and seats', () => {
    const r = recordOf([]);
    expect(r).toMatchObject({ gameId: 'noughts', rulesVersion: 1, seed: 'seed-1', actions: [], status: 'active', outcome: null, ending: null, clock: null });
    expect(humanSeats(r)).toEqual([0]);
  });

  it('add actions without changing the old record', () => {
    const a = recordOf(['b2']);
    const b = withAction(a, 0, 200);
    expect(a.actions).toEqual([4]);
    expect(b.actions).toEqual([4, 0]);
    expect(b.updatedAt).toBe(200);
  });

  it('refuse moves after the game is finished', () => {
    const done = withOutcome(recordOf(['b2']), { reason: 'x', results: [] }, 5);
    expect(() => withAction(done, 1, 6)).toThrow();
  });

  it('record a resignation with the other seat as winner', () => {
    const r = withResignation(recordOf(['b2']), 0, [0, 1], 300);
    expect(r.status).toBe('finished');
    expect(r.ending).toEqual({ kind: 'resigned', seat: 0 });
    expect(r.outcome?.results.find((x) => x.seat === 1)?.place).toBe(1);
  });

  it('read records saved by 0.1.0, which kept a plain resigned seat', () => {
    const old = { ...recordOf(['b2']), status: 'finished', resigned: 1 } as Record<string, unknown>;
    delete old.ending;
    delete old.clock;
    expect(parseRecord(old)).toMatchObject({ ending: { kind: 'resigned', seat: 1 }, clock: null });
  });

  it('start a clock for every seat when asked', () => {
    const r = newRecord(noughts, { id: 'c', config: {}, seed: 's', players: [{ kind: 'human' }, { kind: 'bot', level: 1 }], appVersion: 'x', training: false, now: 1, clock: { initialMs: 300_000, incrementMs: 2_000 } });
    expect(r.clock).toEqual({ initialMs: 300_000, incrementMs: 2_000, remainingMs: [300_000, 300_000] });
    expect(parseRecord(JSON.parse(JSON.stringify(r)))).toEqual(r);
  });

  it('survive a trip through JSON and back', () => {
    const r = recordOf(['b2', 'a3']);
    expect(parseRecord(JSON.parse(JSON.stringify(r)))).toEqual(r);
  });

  it('are refused when malformed', () => {
    expect(() => parseRecord(null)).toThrow();
    expect(() => parseRecord({ ...recordOf([]), status: 'paused' })).toThrow();
    expect(() => parseRecord({ ...recordOf([]), seed: 5 })).toThrow();
    expect(() => parseRecord({ ...recordOf([]), players: [{ kind: 'ghost' }] })).toThrow();
  });

  it('can only be opened by the same game with the same or newer rules', () => {
    const r = recordOf([]);
    expect(canOpen(noughts, r)).toBe(true);
    expect(canOpen(noughts, { ...r, rulesVersion: 99 })).toBe(false);
    expect(canOpen(noughts, { ...r, gameId: 'chess' })).toBe(false);
  });
});

describe('replay', () => {
  it('rebuilds the position move by move', () => {
    const r = recordOf(['b2', 'a3', 'c3']);
    const { state, steps } = replay(noughts, r);
    expect(noughts.codec.state.toText(state)).toBe('o.x/.x./... o');
    expect(steps.map((s) => s.ply)).toEqual([1, 2, 3]);
    expect(steps.map((s) => s.seat)).toEqual([0, 1, 0]);
    expect(steps[0]?.events).toEqual([{ type: 'placed', seat: 0, cell: 4 }]);
    expect(noughts.codec.state.toText(replay(noughts, r, 1).state)).toBe('.../.x./... o');
  });

  it('fails loudly on an illegal or unreadable move', () => {
    expect(() => replay(noughts, recordOf(['b2', 'b2']))).toThrow(ReplayError);
    const broken = { ...recordOf(['b2']), actions: ['nine'] };
    expect(() => replay(noughts, broken)).toThrow(/cannot be read/);
  });

  it('fails on moves after the end', () => {
    const r = recordOf(['a3', 'a2', 'b3', 'b2', 'c3', 'c1']);
    expect(() => replay(noughts, r)).toThrow(/after the game ended/);
  });

  it('refuses records from newer rules or another game', () => {
    expect(() => replay(noughts, { ...recordOf([]), rulesVersion: 2 })).toThrow(ReplayError);
    expect(() => replay(noughts, { ...recordOf([]), gameId: 'go' })).toThrow(ReplayError);
  });
});
