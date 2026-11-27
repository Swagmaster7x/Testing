import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { Rng } from '../../src/core/rng';
import { createRng } from '../../src/core/rng';
import type { HoldemAction, HoldemConfig, HoldemState, HoldemView } from '../../src/games/holdem/rules';
import { checkCards, checkChips, holdem, PRESETS, sampleState, SIX_MAX_CASH, viewOf } from '../../src/games/holdem/rules';
import { checkReplay, playRandomGame } from '../harness/contract';

/** Everything a seat may not see: other hole cards, the deck, the burned cards and the seed. */
function hidden(s: HoldemState, seat: number): string[] {
  const others = s.players.flatMap((p, i) => (i === seat ? [] : p.hole));
  return [...others, ...s.deck, ...s.burned, ...s.discards].map((c) => `"${c}"`).concat(s.seed);
}

/** Leaves out the last hand's showdown, which everyone saw (its cards are back in the new deck). */
function leakScope(view: unknown): unknown {
  return { ...(view as HoldemView), lastHand: null };
}

function invariant(s: HoldemState): void {
  checkCards(s);
  checkChips(s);
  if (!s.over && s.players.some((p) => p.hole.length > 0)) {
    const held = s.players.reduce((n, p) => n + p.hole.length + p.up.length, 0);
    if (s.deck.length + s.burned.length + s.board.length + s.discards.length + held !== 52) throw new Error('52 cards are not all in play');
    const shared = s.config.game === 'holdem' || s.config.game === 'omaha';
    const boardCards: Partial<Record<string, number>> = { preflop: 0, flop: 3, turn: 4, river: 5 };
    if (s.board.length !== (shared ? boardCards[s.street] : 0)) throw new Error(`${s.board.length} board cards on the ${s.street}`);
    // Every player dealt in holds the game's cards for the street.
    const stud: Partial<Record<string, number>> = { third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7 };
    const want = s.config.game === 'stud' ? (stud[s.street] ?? 0) : { holdem: 2, omaha: 4, draw: 5, stud: 0 }[s.config.game];
    for (const p of s.players) if (p.hole.length + p.up.length > 0 && !p.folded && p.hole.length + p.up.length !== want) throw new Error(`a player holds ${p.hole.length + p.up.length} cards on the ${s.street}`);
  }
  if (s.lastHand) {
    const paid = s.lastHand.pots.reduce((sum, p) => sum + p.shares.reduce((a, b) => a + b, 0), 0);
    const potted = s.lastHand.pots.reduce((sum, p) => sum + p.amount, 0);
    if (paid !== potted) throw new Error(`pots of ${potted} paid ${paid}`);
    if (s.lastHand.net.reduce((a, b) => a + b, 0) !== 0) throw new Error('a hand made or lost chips');
  }
}

/** Plays like a loose table: mostly calls and checks, sometimes folds, sometimes raises a random amount. */
function choose(legal: readonly HoldemAction[], rng: Rng): HoldemAction {
  const raises = legal.filter((a) => a.type === 'raise');
  const passive = legal.filter((a) => a.type !== 'raise');
  const roll = rng.next();
  if (raises.length > 0 && roll < 0.25) return roll < 0.03 ? (raises[raises.length - 1] as HoldemAction) : rng.pick(raises.slice(0, Math.max(1, Math.ceil(raises.length / 8))));
  const fold = passive.find((a) => a.type === 'fold');
  if (fold && roll > 0.8) return fold;
  return passive.find((a) => a.type === 'call' || a.type === 'check') ?? rng.pick(legal);
}

const configs: HoldemConfig[] = [
  ...Object.values(PRESETS),
  { ...SIX_MAX_CASH, game: 'omaha', betting: 'no-limit', hands: 30 },
  { ...SIX_MAX_CASH, game: 'omaha', betting: 'pot-limit', split: 'high-low', format: 'sit-and-go', stack: 20, levelHands: 6 },
  { ...SIX_MAX_CASH, game: 'draw', betting: 'no-limit', maxDraw: 5, hands: 30 },
  { ...SIX_MAX_CASH, game: 'draw', betting: 'fixed-limit', format: 'heads-up', stack: 20, levelHands: 6 },
  { ...SIX_MAX_CASH, game: 'stud', betting: 'fixed-limit', split: 'high-low', hands: 30 },
  { ...SIX_MAX_CASH, game: 'stud', betting: 'no-limit', format: 'heads-up', stack: 20, levelHands: 6 },
  { ...SIX_MAX_CASH, game: 'stud', betting: 'pot-limit', format: 'sit-and-go', stack: 20, levelHands: 6 },
  { ...SIX_MAX_CASH, hands: 30, stack: 20 },
  { ...SIX_MAX_CASH, ante: 'big-blind-ante', showdown: 'muck', oddChip: 'high-card', stack: 50 },
  { ...(PRESETS['sit-and-go'] as HoldemConfig), ante: 'ante', levelHands: 6, payouts: '50-30-20', shortAllIn: 'half-raise', stack: 20 },
  { ...(PRESETS['heads-up'] as HoldemConfig), stack: 20, levelHands: 6, showdown: 'muck', ante: 'big-blind-ante' },
];

describe("hold'em over random games", () => {
  it('keeps the contract under every preset: 52 cards, every chip accounted for, pots paid, no leaks, replays', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 0, max: configs.length - 1 }), (seed, i) => {
        const config = configs[i] as HoldemConfig;
        const game = playRandomGame(holdem, config, `holdem-${seed}`, { hidden, invariant, leakScope, choose, maxPlies: 20_000 });
        const outcome = holdem.outcome(game.final);
        expect(outcome).not.toBeNull();
        if (config.format === 'cash') expect(outcome?.results.reduce((sum, r) => sum + r.score, 0)).toBe(0);
        else expect(outcome?.results.filter((r) => r.place === 1)).toHaveLength(1);
        checkReplay(holdem, game);
      }),
      { numRuns: 40 },
    );
  }, 240_000);

  it('keeps the contract when every action is picked at random, all-ins included', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 0, max: configs.length - 1 }), (seed, i) => {
        const config = { ...(configs[i] as HoldemConfig), hands: 10 };
        const game = playRandomGame(holdem, config, `wild-${seed}`, { hidden, invariant, leakScope, maxPlies: 20_000 });
        expect(holdem.outcome(game.final)).not.toBeNull();
        checkReplay(holdem, game);
      }),
      { numRuns: 30 },
    );
  }, 240_000);

  it('samples states that agree with the view: own cards, the board, the bets, the same legal actions', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 0, max: configs.length - 1 }), (seed, i) => {
        const config = { ...(configs[i] as HoldemConfig), hands: 10 };
        const game = playRandomGame(holdem, config, `sample-${seed}`, { choose, maxPlies: 20_000 });
        const rng = createRng(`s-${seed}`);
        for (const state of game.states.filter((_, k) => k % 5 === 0)) {
          if (state.over || state.toAct === null) continue;
          const seat = state.toAct;
          const sample = sampleState(viewOf(state, seat), rng);
          checkCards(sample);
          checkChips(sample);
          expect(sample.players[seat]?.hole).toEqual(state.players[seat]?.hole);
          expect(sample.board).toEqual(state.board);
          expect(sample.players.map((p) => [p.stack, p.bet, p.hole.length])).toEqual(state.players.map((p) => [p.stack, p.bet, p.hole.length]));
          expect(holdem.legal(sample, seat).map((a) => holdem.codec.action.toText(a))).toEqual(holdem.legal(state, seat).map((a) => holdem.codec.action.toText(a)));
        }
      }),
      { numRuns: 30 },
    );
  }, 240_000);
});
