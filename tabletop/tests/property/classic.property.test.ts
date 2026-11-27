/**
 * The classic card pack over random games (PLAN.md 2.10), under every preset and some odd mixes:
 * nothing crashes, every legal action applies, the 52 cards (or the shoe) are conserved, scores add
 * up, chips are conserved, views never leak, and every record replays to the identical state.
 */
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { Json } from '../../src/core/json';
import { createRng } from '../../src/core/rng';
import type { BlackjackConfig, BlackjackState, Box } from '../../src/games/blackjack/rules';
import { BANKROLL, blackjack, PRESETS as BJ_PRESETS, STANDARD as BJ_STANDARD, shoeOf } from '../../src/games/blackjack/rules';
import type { GinConfig, GinState } from '../../src/games/gin-rummy/rules';
import { checkConservation as ginConservation, ginRummy, PRESETS as GIN_PRESETS, STANDARD as GIN_STANDARD } from '../../src/games/gin-rummy/rules';
import type { HeartsConfig, HeartsState } from '../../src/games/hearts/rules';
import { checkConservation as heartsConservation, hearts, PRESETS as HEARTS_PRESETS, STANDARD as HEARTS_STANDARD } from '../../src/games/hearts/rules';
import type { SpadesConfig, SpadesState } from '../../src/games/spades/rules';
import { checkConservation as spadesConservation, mayBlind, PRESETS as SPADES_PRESETS, spades, STANDARD as SPADES_STANDARD } from '../../src/games/spades/rules';
import { deadwood } from '../../src/games/classic/melds';
import { checkReplay, playRandomGame } from '../harness/contract';

const quote = (c: string) => `"${c}"`;

describe('hearts over random games', () => {
  const configs: HeartsConfig[] = [
    ...Object.values(HEARTS_PRESETS).map((c) => ({ ...c, target: Math.min(c.target, 50) })),
    { ...HEARTS_STANDARD, target: 0, passing: 'left', queenBreaks: 'yes' },
    { ...HEARTS_STANDARD, target: 50, moon: 'choose', jackDiamonds: 'minus-10', ties: 'play-on', passing: 'lr' },
    { ...HEARTS_STANDARD, target: 0, passing: 'none', firstLead: 'left-of-dealer', firstTrickPoints: 'yes' },
    { ...HEARTS_STANDARD, target: 0, passing: 'lra', breakHearts: 'off' },
  ];
  const hidden = (s: HeartsState, seat: number): string[] => {
    // Cards this seat passed are known to be with the receiver until played.
    const known = new Set(s.exchanged && s.passDir !== 0 ? (s.passes[seat] ?? []) : []);
    return [...s.hands.flatMap((h, i) => (i === seat ? [] : h.filter((c) => !known.has(c)))).map(quote), s.seed];
  };
  const invariant = (s: HeartsState) => {
    heartsConservation(s);
    const jack = s.config.jackDiamonds === 'minus-10' ? -10 : 0;
    s.results.forEach((r) => {
      const sum = r.points.reduce((a, b) => a + b, 0);
      const allowed = r.moon === null ? [26 + jack] : [78 + jack, -26 + jack];
      if (!allowed.includes(sum)) throw new Error(`a hand totals ${sum} points`);
    });
    const totals = [0, 1, 2, 3].map((seat) => s.results.reduce((a, r) => a + (r.points[seat] ?? 0), 0));
    if (totals.some((x, i) => x !== s.scores[i])) throw new Error('the scores do not add up');
  };
  it('keeps the contract under every preset: 52 cards, scores add up, no leaks, replays', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 0, max: configs.length - 1 }), (seed, i) => {
        const config = configs[i] as HeartsConfig;
        const game = playRandomGame(hearts, config, `hearts-${seed}`, { hidden, invariant, maxPlies: 6000 });
        expect(hearts.outcome(game.final)).not.toBeNull();
        checkReplay(hearts, game);
      }),
      { numRuns: 24 },
    );
  }, 300_000);

  it('samples states that agree with the view', () => {
    const game = playRandomGame(hearts, { ...HEARTS_STANDARD, target: 0 }, 'hearts-sample', {});
    for (const [k, state] of game.states.entries()) {
      if (k % 5 !== 0) continue;
      const seat = hearts.turn(state);
      if (seat === null) continue;
      const view = hearts.view(state, seat);
      const sampled = hearts.sample?.(view, seat, createRng(`hearts-sample/${k}`));
      if (!sampled) throw new Error('no sample');
      heartsConservation(sampled);
      expect(JSON.stringify(hearts.view(sampled, seat))).toBe(JSON.stringify(view));
      expect(hearts.legal(sampled, seat).map((a) => hearts.codec.action.toText(a))).toEqual(hearts.legal(state, seat).map((a) => hearts.codec.action.toText(a)));
    }
  });
});

describe('spades over random games', () => {
  const configs: SpadesConfig[] = [
    ...Object.values(SPADES_PRESETS).map((c) => ({ ...c, target: Math.min(c.target, 300) })),
    { ...SPADES_STANDARD, target: 0, blindNil: 'always', nilTricks: 'count' },
    { ...SPADES_STANDARD, target: 300, bags: 'minus', breakSpades: 'off', loseAt: -500 },
    { ...SPADES_STANDARD, target: 300, minBid: 4, nil: 50, blindNil: 'behind-100' },
    { ...SPADES_STANDARD, partners: 'solo', target: 0, blindNil: 'always' },
  ];
  const hidden = (s: SpadesState, seat: number): string[] => {
    const own = mayBlind(s, seat) ? (s.hands[seat] ?? []) : [];
    return [...s.hands.flatMap((h, i) => (i === seat ? own : h)).map(quote), s.seed];
  };
  const invariant = (s: SpadesState) => {
    spadesConservation(s);
    s.results.forEach((r) => {
      if (r.tricks.reduce((a, b) => a + b, 0) !== 13) throw new Error('a hand did not have 13 tricks');
    });
    const sides = s.scores.length;
    for (let side = 0; side < sides; side++) {
      const total = s.results.reduce((a, r) => a + (r.deltas[side] ?? 0), 0);
      if (total !== s.scores[side]) throw new Error('the scores do not add up');
    }
  };
  it('keeps the contract under every preset: 52 cards, 13 tricks a hand, scores add up, no leaks, replays', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 0, max: configs.length - 1 }), (seed, i) => {
        const config = configs[i] as SpadesConfig;
        const game = playRandomGame(spades, config, `spades-${seed}`, { hidden, invariant, maxPlies: 6000 });
        expect(spades.outcome(game.final)).not.toBeNull();
        checkReplay(spades, game);
      }),
      { numRuns: 24 },
    );
  }, 300_000);
});

describe('gin rummy over random games', () => {
  const configs: GinConfig[] = [
    ...Object.values(GIN_PRESETS).map((c) => ({ ...c, target: c.target === 0 ? 0 : 100 })),
    { ...GIN_STANDARD, firstTurn: 'eleven', nextDealer: 'alternate', target: 0 },
    { ...GIN_STANDARD, knock: 'oklahoma-ace-gin', shutout: 'double-all', nextDealer: 'loser', target: 100 },
  ];
  const hidden = (s: GinState, seat: number): string[] => {
    const them = seat === 0 ? 1 : 0;
    const known = new Set(s.known[them] ?? []);
    if (s.over) return [s.seed];
    return [...(s.hands[them] ?? []).filter((c) => !known.has(c)).map(quote), ...s.stock.map(quote), s.seed];
  };
  const invariant = (s: GinState) => {
    ginConservation(s);
    s.known.forEach((k, seat) => {
      if (!s.over && !k.every((c) => (s.hands[seat] ?? []).includes(c))) throw new Error('a known card is not in the hand');
    });
    const totals = [0, 1].map((seat) => s.results.reduce((a, r) => a + (r.winner === seat ? r.points : 0), 0));
    if (totals.some((x, i) => x !== s.scores[i])) throw new Error('the scores do not add up');
  };
  // Random play rarely knocks; a chooser that knocks when it can and draws at random ends hands.
  const choose = (legal: readonly import('../../src/games/gin-rummy/rules').GinAction[], rng: import('../../src/core/rng').Rng) => {
    const knock = legal.filter((a) => a.type === 'knock' || a.type === 'big-gin');
    if (knock.length > 0 && rng.next() < 0.7) return rng.pick(knock);
    return rng.pick(legal);
  };
  it('keeps the contract under every preset: 52 cards, scores add up, no leaks, replays', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 0, max: configs.length - 1 }), (seed, i) => {
        const config = configs[i] as GinConfig;
        const game = playRandomGame(ginRummy, config, `gin-${seed}`, { hidden, invariant, maxPlies: 20000, choose, leakScope: (v) => ({ ...(v as Record<string, Json>), results: null }) });
        expect(ginRummy.outcome(game.final)).not.toBeNull();
        checkReplay(ginRummy, game);
        for (const r of game.final.results) if (r.kind !== 'dead') expect(deadwood(r.knockerMelds.flat())).toBe(0);
      }),
      { numRuns: 30 },
    );
  }, 300_000);
});

describe('blackjack over random games', () => {
  const configs: BlackjackConfig[] = [
    ...Object.values(BJ_PRESETS).map((c) => ({ ...c, rounds: 10 })),
    { ...BJ_STANDARD, rounds: 20, boxes: 3, decks: 1, penetration: 85, resplitAces: 'yes', hitSplitAces: 'yes', charlie: 'five' },
    { ...BJ_STANDARD, rounds: 20, boxes: 2, holeCard: 'enhc-obo', insurance: 'none', limits: '50-2500' },
    { ...BJ_STANDARD, rounds: 10, boxes: 2, holeCard: 'enhc', payout: '6:5', splitTo: 3, double: '10-11', das: 'no' },
  ];
  const money = (s: BlackjackState, b: Box) => b.chips + (s.phase === 'bet' ? (b.bet ?? 0) : b.hands.reduce((a, h) => a + (h.outcome === null ? h.bet : 0), 0) + Math.max(0, b.insurance ?? 0));
  const invariant = (s: BlackjackState) => {
    // Chips are conserved: what a box has, on the table and behind, is its start plus every settled result.
    s.boxes.forEach((b, i) => {
      const settled = s.history.reduce((a, r) => a + (r[i] ?? 0), 0);
      if (money(s, b) - BANKROLL !== settled + b.roundNet) throw new Error(`box ${i}: chips ${money(s, b)} do not match ${BANKROLL} + ${settled} + ${b.roundNet}`);
    });
    // The shoe and every card out (seen, the hole card, cards in front of the boxes) never exceed the packs.
    const count = new Map<string, number>();
    for (const c of s.shoe) count.set(c, (count.get(c) ?? 0) + 1);
    for (const c of s.seen) count.set(c, (count.get(c) ?? 0) + 1);
    if (!s.holeShown && s.dealer[1]) count.set(s.dealer[1], (count.get(s.dealer[1]) ?? 0) + 1);
    const full = shoeOf(s.config.decks).length;
    const total = [...count.values()].reduce((a, b) => a + b, 0);
    if (total !== full) throw new Error(`the shoe and the cards seen hold ${total} cards, not ${full}`);
    for (const [c, n] of count) if (n > s.config.decks) throw new Error(`${c} appears ${n} times`);
    for (const seat of s.boxes.keys()) {
      const view = JSON.stringify(blackjack.view(s, seat));
      if (view.includes('"shoe"')) throw new Error('a view holds the shoe');
      if (!s.holeShown && s.dealer.length > 1 && blackjack.view(s, seat).dealer[1] !== null) throw new Error('a view shows the hole card');
    }
  };
  it('keeps the contract under every preset: the shoe conserved, chips conserved, no leaks, replays', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 0, max: configs.length - 1 }), (seed, i) => {
        const config = configs[i] as BlackjackConfig;
        const game = playRandomGame(blackjack, config, `bj-${seed}`, { hidden: (s) => [s.seed], invariant, maxPlies: 8000 });
        expect(blackjack.outcome(game.final)).not.toBeNull();
        checkReplay(blackjack, game);
      }),
      { numRuns: 40 },
    );
  }, 300_000);
});
