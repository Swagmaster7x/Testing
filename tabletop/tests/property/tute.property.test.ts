import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import type { TuteConfig, TuteState } from '../../src/games/tute/rules';
import { cannotHold, checkConservation, HAND_POINTS, LAST_TEN, pointsOf, PRESETS, sampleState, seatCount, SPAIN_PAIRS, TOTAL_POINTS, tute, viewOf } from '../../src/games/tute/rules';
import { checkReplay, playRandomGame } from '../harness/contract';

/** Everything another seat may not see: the other hands (unless known), the face-down stock and the seed. */
function hidden(s: TuteState, seat: number): string[] {
  const secret = s.hands.flatMap((hand, other) => (other === seat ? [] : hand.filter((c) => !(s.known[other] ?? []).includes(c)))).map((c) => `"${c}"`);
  const stock = s.stock.filter((c) => c !== s.turned).map((c) => `"${c}"`);
  return [...secret, ...stock, s.seed];
}

function invariant(s: TuteState): void {
  checkConservation(s);
  for (const r of s.results) {
    const cantes = (r.cantes[0] ?? 0) + (r.cantes[1] ?? 0);
    const total = (r.points[0] ?? 0) + (r.points[1] ?? 0);
    // A hand played out holds the 120 card points, the last ten and the cantes.
    if (r.end === 'played' && total !== HAND_POINTS + cantes) throw new Error(`a hand played out totalled ${total} with ${cantes} in cantes`);
    if (r.end !== 'played' && total > TOTAL_POINTS + cantes) throw new Error(`a hand ended early with ${total}`);
  }
  // The points in the piles never exceed the pack, and the last ten only comes with the last trick.
  if (pointsOf(s.won.flat()) > TOTAL_POINTS) throw new Error('more than the pack in the piles');
  if (s.results.some((r) => r.lastTrick !== null && r.end !== 'played')) throw new Error(`the last ten (${LAST_TEN}) without a last trick`);
}

/** Every state a view can stand for keeps each hand's past plays legal, and keeps the view. */
function sampleChecks(s: TuteState, seed: string): void {
  const seat = tute.turn(s);
  if (seat === null) return;
  const view = viewOf(s, seat);
  const bars = cannotHold(view);
  // What the rules infer a seat cannot hold, it really does not hold.
  bars.forEach((bar, other) => {
    for (const c of s.hands[other] ?? []) if (bar.has(c) && other !== seat) throw new Error(`seat ${other} holds ${c}, inferred impossible`);
  });
  const sample = sampleState(view, createRng(seed));
  checkConservation(sample);
  if (JSON.stringify(viewOf(sample, seat)) !== JSON.stringify(view)) throw new Error('a sample changed the view');
}

const configs: TuteConfig[] = [
  ...Object.values(PRESETS),
  { ...SPAIN_PAIRS, mustBeat: 'no', underTrump: 'must', capote: 'two', matchTo: 1 },
  { ...SPAIN_PAIRS, swap: 'seven-and-two', swapWhen: 'any-turn', tie: 'draw', tute: 'hand', fortyFirst: 'no' },
  { ...SPAIN_PAIRS, players: 2, stockRules: 'full', handWin: 'most', capote: 'two', swap: 'seven', swapWhen: 'any-turn', matchTo: 2 },
];

describe('tute over random games', () => {
  it('keeps the contract under every preset: cards conserved, points total, no leaks, replays', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 0, max: configs.length - 1 }), (seed, i) => {
        const config = configs[i] as TuteConfig;
        const game = playRandomGame(tute, config, `tute-${seed}`, { hidden, invariant, maxPlies: 4000 });
        expect(tute.outcome(game.final)).not.toBeNull();
        checkReplay(tute, game);
      }),
      { numRuns: 60 },
    );
  }, 180_000);

  it('samples hidden hands consistent with the view and with every obligation already shown', () => {
    for (const [i, config] of configs.entries()) {
      for (let g = 0; g < 6; g++) {
        const game = playRandomGame(tute, config, `sample-${i}-${g}`, { maxPlies: 4000 });
        game.states.forEach((s, ply) => {
          if (ply % 3 === 0) sampleChecks(s, `s-${i}-${g}-${ply}`);
        });
        expect(seatCount(config)).toBe(game.final.hands.length);
      }
    }
  }, 180_000);
});
