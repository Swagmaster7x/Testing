import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { BASE, HAND_TYPES, parseSfen } from '../../src/games/shogi/core';
import type { ShogiConfig } from '../../src/games/shogi/presets';
import { PRESETS } from '../../src/games/shogi/presets';
import type { ShogiState } from '../../src/games/shogi/rules';
import { shogi } from '../../src/games/shogi/rules';
import { checkReplay, playRandomGame } from '../harness/contract';

/** Pieces by unpromoted kind, on the board and in hand: captures and drops only move them around. */
function census(s: ShogiState): string {
  const p = parseSfen(s.sfen);
  const counts = new Array<number>(8).fill(0);
  for (const sq of p.geo.squares) {
    const code = p.board[sq]!;
    if (code !== 0) counts[BASE[(code & 15) - 1]!]!++;
  }
  for (const color of [0, 1] as const) for (let type = 0; type < HAND_TYPES; type++) counts[type]! += p.handCount(color, type);
  return counts.join(',');
}

function conserved(config: ShogiConfig): (s: ShogiState) => void {
  const start = census(shogi.setup(config, createRng('census')));
  return (s) => {
    const now = census(s);
    if (now !== start) throw new Error(`pieces changed: ${start} became ${now} in ${s.sfen}`);
    const p = parseSfen(s.sfen);
    if (p.kings[0]! < 0 || p.kings[1]! < 0) throw new Error(`a king is missing in ${s.sfen}`);
  };
}

describe('shogi over random games, under every preset', () => {
  for (const preset of PRESETS) {
    it(`${preset.id}: the contract holds, pieces are conserved, the record replays`, () => {
      const config: ShogiConfig = { ...preset.config, moveLimit: 240 };
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 6 }), (seed) => {
          const game = playRandomGame(shogi, config, `shogi-${preset.id}-${seed}`, { invariant: conserved(config), maxPlies: 400 });
          expect(shogi.outcome(game.final)).not.toBeNull();
          checkReplay(shogi, game);
        }),
        { numRuns: preset.id === 'standard' || preset.id === 'mini' ? 4 : 1 },
      );
    }, 120_000);
  }
});
