// Brisca CPU players: the exact endgame solver against brute force (the M3 gate), and every level
// choosing legal, repeatable moves from a view.
import { describe, expect, it } from 'vitest';
import { findLegal } from '../../src/core/contract';
import { createRng } from '../../src/core/rng';
import { BRISCA_LEVELS, briscaBots, chooseAction, evaluateActions, solve, viewLegal } from '../../src/games/brisca/bots';
import type { BriscaState, Card } from '../../src/games/brisca/rules';
import { actionText, brisca, DECK, pointsOf, position, PUERTO_RICO, viewOf } from '../../src/games/brisca/rules';

/** Plain minimax with no memory and no shortcuts: seat 0's final points. */
function bruteForce(s: BriscaState): number {
  const seat = brisca.turn(s);
  if (seat === null) return s.results[s.results.length - 1]?.points[0] ?? pointsOf(s.won[0] ?? [], s.config);
  const values = (s.hands[seat] ?? []).map((card) => bruteForce(brisca.apply(s, { type: 'play', card }).state));
  return seat === 0 ? Math.max(...values) : Math.min(...values);
}

function randomEndgame(seed: string): BriscaState {
  const rng = createRng(seed);
  const cards: Card[] = rng.shuffle(DECK).slice(0, 6);
  const n = rng.int(2) + 2;
  return brisca.codec.state.fromText(position({ trump: rng.pick(['o', 'c', 'e', 'b'] as const), me: cards.slice(0, n), them: cards.slice(3, 3 + n), stock: [], leader: rng.int(2) }));
}

describe('the endgame solver', () => {
  it('agrees with brute force on 200 random endgames', () => {
    for (let i = 0; i < 200; i++) {
      const s = randomEndgame(`endgame-${i}`);
      expect(solve(s), `endgame-${i}`).toBe(bruteForce(s));
    }
  });

  it('agrees with brute force from the start of the last three tricks of real hands', () => {
    for (let i = 0; i < 20; i++) {
      const rng = createRng(`real-${i}`);
      let s = brisca.setup(PUERTO_RICO, rng);
      while (brisca.turn(s) !== null && s.stock.length > 0) s = brisca.apply(s, rng.pick(brisca.legal(s, brisca.turn(s) ?? 0))).state;
      if (brisca.turn(s) === null) continue;
      expect(solve(s)).toBe(bruteForce(s));
    }
  });

  it('values every card exactly once the stock is empty', () => {
    const s = randomEndgame('values');
    const seat = brisca.turn(s) ?? 0;
    const scored = evaluateActions(viewOf(s, seat), 0, 3, 0, createRng('x'));
    for (const { action, margin } of scored) {
      const after = brisca.apply(s, action).state;
      const zero = bruteForce(after);
      const mine = seat === 0 ? zero : 120 - zero;
      expect(margin).toBe(mine - (120 - mine));
    }
  });
});

describe('the levels', () => {
  it('every level plays only legal moves, the same ones for the same seed', () => {
    for (const { level } of BRISCA_LEVELS) {
      const rng = createRng(`levels-${level}`);
      let s = brisca.setup(PUERTO_RICO, rng);
      for (let ply = 0; ply < 12 && brisca.turn(s) !== null; ply++) {
        const seat = brisca.turn(s) ?? 0;
        const view = viewOf(s, seat);
        const a = chooseAction(view, level, createRng(`p${ply}`));
        const b = chooseAction(view, level, createRng(`p${ply}`));
        expect(actionText(a)).toBe(actionText(b));
        const legal = findLegal(brisca, s, seat, a);
        expect(legal, `level ${level}`).not.toBeNull();
        s = brisca.apply(s, legal ?? a).state;
      }
    }
  }, 60_000);

  it('the view gives the same legal moves as the rules', () => {
    for (let i = 0; i < 30; i++) {
      const rng = createRng(`legal-${i}`);
      let s = brisca.setup(i % 2 ? PUERTO_RICO : { ...PUERTO_RICO, arrastre: 'on', swapWhen: 'after-own-trick' }, rng);
      for (let ply = 0; ply < 30 && brisca.turn(s) !== null; ply++) {
        const seat = brisca.turn(s) ?? 0;
        expect(viewLegal(viewOf(s, seat)).map(actionText).sort()).toEqual(brisca.legal(s, seat).map(actionText).sort());
        s = brisca.apply(s, rng.pick(brisca.legal(s, seat))).state;
      }
    }
  });

  it('the coach answers hints and analyses from the view', async () => {
    const s = brisca.setup(PUERTO_RICO, createRng('coach'));
    const view = viewOf(s, 0);
    const hint = (await briscaBots.advise?.({ view, seat: 0, query: { type: 'hint', samples: 8 }, rng: createRng('h') })) as { action: string };
    expect(brisca.legal(s, 0).map(actionText)).toContain(hint.action);
    const analysis = (await briscaBots.advise?.({ view, seat: 0, query: { type: 'analyse', samples: 8 }, rng: createRng('a') })) as { moves: { action: string }[] };
    expect(analysis.moves.length).toBe(brisca.legal(s, 0).length);
  });
});
