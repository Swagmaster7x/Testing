/** Golden cases for Brisca for four in pairs, and the señas (docs/rules/brisca.md). */
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { chooseAction } from '../../src/games/brisca/bots';
import { briscaLessonGame } from '../../src/games/brisca/learn/game';
import { loadBriscaPractice } from '../../src/games/brisca/practice';
import type { BriscaState, Card } from '../../src/games/brisca/rules';
import { brisca, checkConservation, position, PRESETS, PUERTO_RICO, sampleState, viewOf } from '../../src/games/brisca/rules';

const FOUR = { ...PUERTO_RICO, players: 4 as const };
const SENAS = PRESETS['four-señas'] ?? FOUR;
const c = (text: string) => text.split(' ') as Card[];
const play = (s: BriscaState, ...moves: string[]): BriscaState => moves.reduce((st, m) => brisca.apply(st, brisca.codec.action.fromText(m)).state, s);
const legalText = (s: BriscaState) => {
  const seat = brisca.turn(s);
  return seat === null ? [] : brisca.legal(s, seat).map((a) => brisca.codec.action.toText(a));
};

describe('brisca for four', () => {
  it('deals three each from the dealer’s right; the player after the dealer leads; 27 in the stock with the turned card under it', () => {
    const s = brisca.setup(FOUR, createRng('four'));
    expect(brisca.seats(s)).toEqual([0, 1, 2, 3]);
    expect(s.hands.map((h) => h.length)).toEqual([3, 3, 3, 3]);
    expect(s.stock).toHaveLength(28);
    expect(s.stock[27]).toBe(s.turned);
    expect(s.leader).toBe((s.dealer + 1) % 4);
    expect(brisca.turn(s)).toBe(s.leader);
    checkConservation(s);
  });

  it('a trick of four goes to the highest trump, else the highest card of the suit led; the winner draws first, then round the table', () => {
    // Oros trumps. Seat 0 leads the Rey de copas, 1 the As de copas, 2 the 2 de oros, 3 the 3 de oros.
    const s = brisca.codec.state.fromText(position({ trump: 'Co', me: c('Rc 4e 5e'), them: [], others: [c('Ac 6e 7e'), c('2o 4b 5b'), c('3o 6b 7b')], config: FOUR }));
    const after = brisca.apply(play(s, 'Rc', 'Ac', '2o'), { type: 'play', card: '3o' });
    const trick = after.events.find((e) => e.type === 'trick');
    expect(trick).toMatchObject({ winner: 3, points: 25 });
    expect(after.events.filter((e) => e.type === 'draw').map((e) => (e.type === 'draw' ? e.seat : -1))).toEqual([3, 0, 1, 2]);
    expect(after.state.leader).toBe(3);
    // Points count by side: seats 1 and 3 together.
    expect(after.state.won[3]).toHaveLength(4);
  });

  it('the last card drawn, the turned card, goes to the player before the trick’s winner', () => {
    // Four cards in the stock, the last the turned Caballo de oros.
    const s = brisca.codec.state.fromText(position({ trump: 'Co', me: c('Rc 4e 5e'), them: [], others: [c('Ac 6e 7e'), c('2o 4b 5b'), c('3o 6b 7b')], stock: c('7c 6c 5c Co'), config: FOUR }));
    const after = brisca.apply(play(s, 'Rc', 'Ac', '2o'), { type: 'play', card: '3o' });
    const draws = after.events.flatMap((e) => (e.type === 'draw' ? [e] : []));
    expect(draws.map((e) => e.seat)).toEqual([3, 0, 1, 2]);
    expect(draws[3]).toMatchObject({ seat: 2, card: 'Co', turned: true });
    expect(after.state.known[2]).toEqual(['Co']);
  });

  it('a hand ends after ten tricks; the side with more than sixty wins, and the outcome names both sides', () => {
    let s = brisca.setup(FOUR, createRng('ten'));
    const rng = createRng('moves');
    let tricks = 0;
    while (!s.over) {
      const seat = brisca.turn(s) as number;
      const r = brisca.apply(s, rng.pick(brisca.legal(s, seat).filter((a) => a.type === 'play')));
      tricks += r.events.filter((e) => e.type === 'trick').length;
      s = r.state;
    }
    expect(tricks).toBe(10);
    const [a = 0, b = 0] = s.results[0]?.points ?? [];
    expect(a + b).toBe(120);
    const outcome = brisca.outcome(s);
    expect(outcome?.teams).toEqual([
      [0, 2],
      [1, 3],
    ]);
    const winner = a > b ? 0 : b > a ? 1 : null;
    for (const r of outcome?.results ?? []) expect(r.place).toBe(winner === null || r.seat % 2 === winner ? 1 : 2);
  });
});

describe('señas', () => {
  // Espadas trumps: seat 0 holds the As and Rey of trumps.
  const start = () => brisca.codec.state.fromText(position({ trump: 'Se', me: c('Ae Re 4b'), them: [], others: [c('Ac 6c 7c'), c('2o 4o 5o'), c('3e 6b 7b')], config: SENAS }));

  it('a player may sign each high trump they hold, once, on their turn, before playing', () => {
    const s = start();
    expect(legalText(s)).toEqual(['Ae', 'Re', '4b', 'sign:A', 'sign:R']);
    const signed = play(s, 'sign:A');
    expect(brisca.turn(signed)).toBe(0);
    expect(legalText(signed)).toEqual(['Ae', 'Re', '4b', 'sign:R']);
    // Not without señas, and not with two players.
    expect(legalText(brisca.codec.state.fromText(position({ trump: 'Se', me: c('Ae Re 4b'), them: [], others: [c('Ac 6c 7c'), c('2o 4o 5o'), c('3e 6b 7b')], config: FOUR })))).toEqual(['Ae', 'Re', '4b']);
  });

  it('only the partner sees a seña, and the partner’s sampled deals give the signed card to the signer', () => {
    const s = play(start(), 'sign:A');
    expect(viewOf(s, 2).signals).toEqual([{ seat: 0, sign: 'A' }]);
    expect(viewOf(s, 1).signals).toEqual([]);
    expect(viewOf(s, 3).signals).toEqual([]);
    const rng = createRng('sample');
    for (let i = 0; i < 20; i++) {
      expect(sampleState(viewOf(s, 2), rng).hands[0]).toContain('Ae');
    }
    // A player who did not see it cannot know: some sampled deals put the As elsewhere.
    const elsewhere = Array.from({ length: 40 }, () => sampleState(viewOf(s, 1), rng).hands[0]?.includes('Ae')).filter((x) => !x);
    expect(elsewhere.length).toBeGreaterThan(0);
  });

  it('the CPU signs its As and Tres of trumps to its partner first', () => {
    const s = start();
    const a = chooseAction(viewOf(s, 0), 4, createRng('cpu'));
    expect(brisca.codec.action.toText(a)).toBe('sign:A');
  });
});

describe('the señas drill', () => {
  it('makes a sound flash card every time: one right answer, or a sign you may really make', async () => {
    const pack = await loadBriscaPractice();
    const drill = pack.drills.find((d) => d.id === 'drill-senas');
    expect(drill).toBeDefined();
    const rng = createRng('drill');
    let read = 0;
    let make = 0;
    for (let i = 0; i < 40; i++) {
      const lesson = drill?.make(() => rng.next());
      if (!lesson) throw new Error('no drill');
      const s = briscaLessonGame.position(lesson.start);
      checkConservation(s);
      expect(brisca.turn(s)).toBe(0);
      for (const step of lesson.steps) {
        expect(step.marks).toEqual(['hide-sign-names']);
        if (step.kind === 'askChoice') {
          read++;
          expect(step.options.filter((o) => o.correct)).toHaveLength(1);
          expect(viewOf(s, 0).signals).toHaveLength(1);
        }
        if (step.kind === 'askMove') {
          make++;
          for (const move of step.accept) expect(briscaLessonGame.moves(s)).toContain(move);
          for (const move of Object.keys(step.wrong ?? {})) expect(briscaLessonGame.moves(s)).toContain(move);
        }
      }
    }
    expect(read).toBeGreaterThan(5);
    expect(make).toBeGreaterThan(5);
  });
});

