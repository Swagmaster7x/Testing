// Pass-and-play in the shell: who the table is shown for, the cover in games with hidden cards or
// tiles, names, results, and ratings that never move for games between people.
import { describe, expect, it } from 'vitest';
import type { GameRecord, SeatPlayer } from '../../src/core/record';
import { isPassAndPlay, newRecord, parseRecord } from '../../src/core/record';
import { createRng } from '../../src/core/rng';
import { brisca } from '../../src/games/brisca/rules';
import { chess } from '../../src/games/chess/rules';
import { chineseCheckers } from '../../src/games/chinese-checkers/rules';
import { dominoes } from '../../src/games/dominoes/rules';
import { go } from '../../src/games/go/rules';
import { shogi } from '../../src/games/shogi/rules';
import { hasHiddenInformation, namesFor, peopleResult, personName, placesLine, viewerOf } from '../../src/shell/table/passplay';
import { playRating } from '../../src/teach/progress';

const record = (players: readonly SeatPlayer[], extra: Partial<GameRecord> = {}): GameRecord => ({
  ...newRecord(chess, { id: 'g', config: chess.defaultConfig, seed: 's', players, appVersion: 'test', training: false, now: 0 }),
  ...extra,
});

const people: SeatPlayer[] = [
  { kind: 'human', name: 'Ana' },
  { kind: 'human', name: 'Ben' },
];

describe('pass-and-play records', () => {
  it('are games between two or more named people', () => {
    expect(isPassAndPlay(record(people))).toBe(true);
    expect(isPassAndPlay(record([{ kind: 'human' }, { kind: 'bot', level: 2 }]))).toBe(false);
    // A game opened from a file has unnamed people on every seat: not pass-and-play.
    expect(isPassAndPlay(record([{ kind: 'human' }, { kind: 'human' }]))).toBe(false);
    expect(parseRecord(JSON.parse(JSON.stringify(record(people)))).players).toEqual(people);
  });

  it('name people, numbering those without a name, and never the CPU', () => {
    const r = record([{ kind: 'human', name: 'Ana' }, { kind: 'bot', level: 3 }, { kind: 'human', name: 'Player 2' }]);
    expect([0, 1, 2].map((s) => personName(r, s))).toEqual(['Ana', null, 'Player 2']);
    const names = namesFor(r, 0);
    expect([names(0), names(1), names(2)]).toEqual([null, null, 'Player 2']);
    expect(personName(record([{ kind: 'human' }, { kind: 'bot' }]), 0)).toBeNull();
  });

  it('never move a rating', () => {
    const finished = (players: readonly SeatPlayer[]) =>
      record(players, { status: 'finished', outcome: { reason: 'checkmate', results: [{ seat: 0, place: 1, score: 1 }, { seat: 1, place: 2, score: 0 }] }, updatedAt: 1 });
    const levels = () => 800;
    expect(playRating([finished(people), finished(people)], levels, () => true).count).toBe(0);
    expect(playRating([finished([{ kind: 'human' }, { kind: 'bot', level: 2 }])], levels, () => true).count).toBe(1);
  });
});

describe('hidden information', () => {
  it('is found in the card and tile games and not in the board games', () => {
    const start = <S,>(def: { setup: (c: never, r: ReturnType<typeof createRng>) => S; defaultConfig: unknown }) => def.setup(def.defaultConfig as never, createRng('hidden'));
    expect(hasHiddenInformation({ def: brisca }, start(brisca))).toBe(true);
    expect(hasHiddenInformation({ def: dominoes }, start(dominoes))).toBe(true);
    expect(hasHiddenInformation({ def: chess }, start(chess))).toBe(false);
    expect(hasHiddenInformation({ def: go }, start(go))).toBe(false);
    expect(hasHiddenInformation({ def: shogi }, start(shogi))).toBe(false);
    expect(hasHiddenInformation({ def: chineseCheckers }, start(chineseCheckers))).toBe(false);
    // A game can say so itself.
    expect(hasHiddenInformation({ def: chess, hiddenInfo: true }, start(chess))).toBe(true);
  });
});

describe('whose table it is', () => {
  const active = { players: people, status: 'active' as const };

  it('follows the person to move in a board game, and the last person while the CPU moves', () => {
    expect(viewerOf(active, 1, [{ seat: 0 }], false, null)).toEqual({ seat: 1, passTo: null });
    const withCpu = { players: [{ kind: 'human' as const, name: 'Ana' }, { kind: 'bot' as const, level: 1 }, { kind: 'human' as const, name: 'Ben' }], status: 'active' as const };
    expect(viewerOf(withCpu, 1, [{ seat: 0 }, { seat: 2 }], false, null)).toEqual({ seat: 2, passTo: null });
    // One person against the CPU: always that person.
    expect(viewerOf({ players: [{ kind: 'human' }, { kind: 'bot', level: 1 }], status: 'active' }, 1, [], true, null)).toEqual({ seat: 0, passTo: null });
  });

  it('covers a hidden game until the next person takes the device', () => {
    expect(viewerOf(active, 0, [], true, null)).toEqual({ seat: null, passTo: 0 });
    expect(viewerOf(active, 0, [], true, 0)).toEqual({ seat: 0, passTo: null });
    expect(viewerOf(active, 1, [{ seat: 0 }], true, 0)).toEqual({ seat: null, passTo: 1 });
    expect(viewerOf(active, 1, [{ seat: 0 }], true, 1)).toEqual({ seat: 1, passTo: null });
    // The game is over: no cover.
    expect(viewerOf({ ...active, status: 'finished' }, null, [{ seat: 1 }], true, 1)).toEqual({ seat: 1, passTo: null });
    // A warning about Ana's move waits: Ana still has the table, uncovered, in either kind of game.
    expect(viewerOf(active, 1, [{ seat: 0 }], true, 0, true)).toEqual({ seat: 0, passTo: null });
    expect(viewerOf(active, 1, [{ seat: 0 }], false, null, true)).toEqual({ seat: 0, passTo: null });
  });
});

describe('results by name', () => {
  it('names the winner, a shared first place and everyone’s place', () => {
    const nameOf = (seat: number) => ['Ana', 'Ben', 'Cy'][seat] ?? '?';
    const won = { players: people, outcome: { reason: 'x', results: [{ seat: 0, place: 2, score: 0 }, { seat: 1, place: 1, score: 1 }] } };
    expect(peopleResult(won, nameOf)).toBe('Ben wins');
    // One-seat teams (a two-player game that also plays in pairs) still name one winner.
    expect(peopleResult({ ...won, outcome: { ...won.outcome, teams: [[0], [1]] } }, nameOf)).toBe('Ben wins');
    const pairs = { players: people, outcome: { reason: 'x', teams: [[0, 2], [1]], results: [{ seat: 0, place: 1, score: 1 }, { seat: 1, place: 2, score: 0 }, { seat: 2, place: 1, score: 1 }] } };
    expect(peopleResult(pairs, nameOf)).toBe('Ana and Cy win');
    const three = { outcome: { reason: 'cc-home', results: [{ seat: 0, place: 2, score: 0 }, { seat: 1, place: 1, score: 1 }, { seat: 2, place: 3, score: 0 }] } };
    expect(placesLine(three, nameOf)).toBe('1. Ben · 2. Ana · 3. Cy');
    const shared = { players: people, outcome: { reason: 'x', results: [{ seat: 0, place: 1, score: 0 }, { seat: 1, place: 1, score: 0 }, { seat: 2, place: 3, score: 0 }] } };
    expect(peopleResult(shared, nameOf)).toBe('First place is shared: Ana and Ben');
    const draw = { players: people, outcome: { reason: 'x', results: [{ seat: 0, place: 1, score: 0 }, { seat: 1, place: 1, score: 0 }] } };
    expect(peopleResult(draw, nameOf)).toBe('Draw');
  });
});
