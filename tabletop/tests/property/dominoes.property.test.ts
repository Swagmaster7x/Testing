import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import type { DominoesConfig, DominoesState, DominoesView } from '../../src/games/dominoes/rules';
import { cantHave, checkConservation, CUBAN, dominoes, handPips, PRESETS, PUERTO_RICO_500, sampleState, setPips, tilesOnTable, viewOf } from '../../src/games/dominoes/rules';
import { checkReplay, playRandomGame } from '../harness/contract';

/** Everything a seat may not see: other hands, the boneyard and the seed. */
function hidden(s: DominoesState, seat: number): string[] {
  const others = s.hands.flatMap((h, i) => (i === seat ? [] : h));
  return [...others, ...s.boneyard].map((t) => `"${t}"`).concat(s.seed);
}

/** Leaves out what everyone has seen: tiles on the line, plays, and hands shown at the end of a deal. */
function leakScope(view: unknown): unknown {
  const v = view as DominoesView;
  return { ...v, chain: [], up: [], down: [], spinner: null, results: [], moves: v.moves.filter((m) => m.type === 'draw'), hand: [] };
}

function invariant(s: DominoesState): void {
  checkConservation(s);
  const pips = handPips([...s.hands.flat(), ...s.boneyard, ...tilesOnTable(s).map((p) => p.tile)]);
  const total = setPips(s.config.set);
  if (pips !== total) throw new Error(`pips total ${pips}, not ${total}`);
  const scored = s.scores.map((_, side) => s.results.reduce((sum, r) => sum + (r.points[side] ?? 0), 0) + s.handBonuses.reduce((sum, b) => (b.side === side ? sum + b.points : sum), 0));
  if (scored.some((v, side) => v !== s.scores[side])) throw new Error(`scores ${s.scores.join('-')} do not add up to the hands (${scored.join('-')})`);
  // What a seat knows from passes is true.
  for (let seat = 0; seat < s.hands.length; seat++) {
    const lacks = cantHave(viewOf(s, (seat + 1) % s.hands.length), seat);
    for (const t of s.hands[seat] ?? []) if (lacks.has(Number(t[0]) as 0) || lacks.has(Number(t[2]) as 0)) throw new Error(`seat ${seat} holds ${t} after passing on it`);
  }
}

const configs: DominoesConfig[] = [
  ...Object.values(PRESETS),
  { ...PUERTO_RICO_500, target: 0 },
  { ...PUERTO_RICO_500, passBonus: 'on', redeal: 'five-doubles', blockedWinner: 'blocker-or-next', blockedTie: 'more-tiles', target: 200 },
  { ...PUERTO_RICO_500, blockedScore: 'difference', blockedTie: 'starting', nextLead: 'double-six', chuchazoEnds: 'one-end', target: 150 },
  { ...(PRESETS.draw as DominoesConfig), drawLimit: 'leave-two', passBonus: 'on', blockedScore: 'difference' },
  { ...(PRESETS.block as DominoesConfig), nextLead: 'rotate', blockedTie: 'blocker', scoring: 'losers' },
  // Milestone 14: odd mixes of the new options.
  { ...(PRESETS['all-fives'] as DominoesConfig), drawLimit: 'leave-one', finish: 'hand-end', hand: 7, target: 100 },
  { ...(PRESETS['all-fives-three'] as DominoesConfig), mode: 'block-three', passBonus: 'on', target: 100 },
  { ...(PRESETS['all-fives-partners'] as DominoesConfig), blockedWinner: 'player', nextLead: 'winning-team', rounding: 'exact', target: 150 },
  { ...CUBAN, set: 'double-six', target: 100 },
  { ...CUBAN, firstLead: 'double-six', nextLead: 'double-six', blockedTie: 'more-tiles', blockedScore: 'difference', spinner: 'first-double', fives: 'on' },
  { ...PUERTO_RICO_500, set: 'double-nine', mode: 'draw-three', target: 100 },
];

describe('dominoes over random games', () => {
  it('keeps the contract under every preset: every tile of the set, its pip total, scores add up, no leaks, replays', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 0, max: configs.length - 1 }), (seed, i) => {
        const config = configs[i] as DominoesConfig;
        const game = playRandomGame(dominoes, config, `dominoes-${seed}`, { hidden, invariant, leakScope, maxPlies: 6000 });
        expect(dominoes.outcome(game.final)).not.toBeNull();
        checkReplay(dominoes, game);
      }),
      { numRuns: 80 },
    );
  }, 400_000);

  it('samples states that agree with the view: own hand, counts, the line and every pass', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 0, max: configs.length - 1 }), (seed, i) => {
        const config = { ...(configs[i] as DominoesConfig), target: 0 };
        const game = playRandomGame(dominoes, config, `sample-${seed}`, { maxPlies: 2000 });
        const rng = createRng(`s-${seed}`);
        for (const state of game.states.filter((_, k) => k % 3 === 0)) {
          if (state.over) continue;
          const seat = state.turn;
          const view = viewOf(state, seat);
          const sample = sampleState(view, rng);
          checkConservation(sample);
          expect(sample.hands[seat]).toEqual(state.hands[seat]);
          expect(sample.hands.map((h) => h.length)).toEqual(state.hands.map((h) => h.length));
          expect(sample.boneyard.length).toBe(state.boneyard.length);
          // The sample is a state in which the same history could have happened: every pass and draw rule holds.
          for (let other = 0; other < state.hands.length; other++) {
            const lacks = cantHave(view, other);
            for (const t of sample.hands[other] ?? []) expect(lacks.has(Number(t[0]) as 0) || lacks.has(Number(t[2]) as 0)).toBe(false);
          }
          expect(dominoes.legal(sample, seat).map((a) => dominoes.codec.action.toText(a))).toEqual(dominoes.legal(state, seat).map((a) => dominoes.codec.action.toText(a)));
        }
      }),
      { numRuns: 40 },
    );
  }, 240_000);
});
