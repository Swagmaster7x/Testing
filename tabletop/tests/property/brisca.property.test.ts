import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { BriscaConfig, BriscaState } from '../../src/games/brisca/rules';
import { brisca, checkConservation, PRESETS, PUERTO_RICO } from '../../src/games/brisca/rules';
import { checkReplay, playRandomGame } from '../harness/contract';

/** Everything another seat may not see: the other hand (unless known), the face-down stock and the seed. */
function hidden(s: BriscaState, seat: number): string[] {
  const them = seat === 0 ? 1 : 0;
  const known = new Set(s.known[them] ?? []);
  const secret = (s.hands[them] ?? []).filter((c) => !known.has(c)).map((c) => `"${c}"`);
  const stock = s.stock.filter((c) => c !== s.turned).map((c) => `"${c}"`);
  return [...secret, ...stock, s.seed];
}

function invariant(s: BriscaState): void {
  checkConservation(s);
  const points = s.results.map((r) => (r.points[0] ?? 0) + (r.points[1] ?? 0));
  if (points.some((p) => p !== 120)) throw new Error(`a hand did not total 120: ${points.join(', ')}`);
}

const configs: BriscaConfig[] = [PUERTO_RICO, ...Object.values(PRESETS), { ...PUERTO_RICO, arrastre: 'on' }, { ...PUERTO_RICO, trumps: 'rotate', matchTo: 2 }, { ...PUERTO_RICO, secondBrisca: 'seven' }, { ...PUERTO_RICO, turnedBrisca: 'redeal', bigWin: 'double', matchTo: 3 }];

describe('brisca over random games', () => {
  it('keeps the contract under every preset: cards conserved, 120 points a hand, no leaks, replays', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 0, max: configs.length - 1 }), (seed, i) => {
        const config = configs[i] as BriscaConfig;
        const game = playRandomGame(brisca, config, `brisca-${seed}`, { hidden, invariant, maxPlies: 2000 });
        expect(brisca.outcome(game.final)).not.toBeNull();
        checkReplay(brisca, game);
      }),
      { numRuns: 60 },
    );
  }, 120_000);
});
