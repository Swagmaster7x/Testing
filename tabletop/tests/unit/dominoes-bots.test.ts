/** The bots' fast model agrees with the rules; bots play legally and follow the taught conventions. */
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { chooseAction, conventionalLead, evaluateActions, heuristic, viewLegal } from '../../src/games/dominoes/bots';
import type { DominoesAction, DominoesConfig, DominoesState } from '../../src/games/dominoes/rules';
import { actionText, dominoes, position, PRESETS, PUERTO_RICO_500, viewOf } from '../../src/games/dominoes/rules';
import { DRAW, fromState, moveOf, PASS, playToEnd, solveMargin, tileIndex } from '../../src/games/dominoes/sim';

const configs: DominoesConfig[] = [
  ...Object.values(PRESETS),
  { ...PUERTO_RICO_500, passBonus: 'on', blockedWinner: 'blocker-or-next', blockedTie: 'more-tiles', blockedScore: 'difference', chuchazoEnds: 'one-end' },
  { ...PUERTO_RICO_500, blockedTie: 'starting', scoring: 'losers', capicu: 50 },
  { ...(PRESETS.draw as DominoesConfig), drawLimit: 'leave-two', passBonus: 'on' },
];

const code = (a: DominoesAction) => (a.type === 'pass' ? PASS : a.type === 'draw' ? DRAW : moveOf(tileIndex(a.tile), a.end === 'right'));
/** The rules' legal action with the lowest code: the same choice the fast model makes with min(). */
const lowest = (s: DominoesState) => [...dominoes.legal(s, s.turn)].sort((a, b) => code(a) - code(b))[0] as DominoesAction;

describe('the fast model agrees with the rules', () => {
  it('scores every hand the same, under every preset and odd option', () => {
    let checked = 0;
    for (const [ci, config] of configs.entries()) {
      for (let g = 0; g < 12; g++) {
        let s = dominoes.setup({ ...config, target: 0 }, createRng(`sim-${ci}-${g}`));
        const rng = createRng(`moves-${ci}-${g}`);
        // Walk a random way into the hand, then finish it both ways with the same choices.
        const steps = rng.int(18);
        for (let i = 0; i < steps && !s.over; i++) s = dominoes.apply(s, rng.pick(dominoes.legal(s, s.turn))).state;
        if (s.over) continue;
        const sim = fromState(s);
        const simPoints = playToEnd(sim, (_, legal) => Math.min(...legal.filter((m) => m >= 0)));
        let t = s;
        while (!t.over) t = dominoes.apply(t, lowest(t)).state;
        expect(simPoints, `config ${ci} game ${g}`).toEqual(t.results[t.results.length - 1]?.points);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(100);
  });

  it('the exact search finds a going-out win when there is one', () => {
    // Seat 0 holds 1-4 and goes out at once; the search sees the whole hand's points.
    const s = dominoes.codec.state.fromText(position({ hands: [['1-4'], ['0-0', '6-6'], ['2-3'], null], line: '4-6', counts: [1, 2, 1, 23], handNo: 6 }));
    expect(solveMargin(fromState(s), 0)).toBe(168 - 10 - 5);
  });
});

describe('the bots', () => {
  it('play only legal moves at every level, in every game', () => {
    for (const level of [1, 2, 3, 4, 5, 6]) {
      for (const config of [PUERTO_RICO_500, PRESETS.draw as DominoesConfig, PRESETS.block as DominoesConfig]) {
        let s = dominoes.setup({ ...config, target: 0 }, createRng(`legal-${level}-${config.mode}`));
        for (let ply = 0; ply < 80 && !s.over; ply++) {
          const v = viewOf(s, s.turn);
          expect(viewLegal(v).map(actionText)).toEqual(dominoes.legal(s, s.turn).map(actionText));
          const action = chooseAction(v, level, createRng(`b-${ply}`));
          s = dominoes.apply(s, action).state;
        }
        expect(s.over).toBe(true);
      }
    }
  }, 240_000);

  it('lead from their strongest number, with its double when they hold it', () => {
    expect(conventionalLead(['6-6', '2-6', '4-6', '1-1', '0-3', '3-5', '2-5'])).toBe('6-6');
    expect(conventionalLead(['0-6', '2-6', '4-6', '1-1', '0-3', '3-5', '2-5'])).toBe('4-6');
    expect(conventionalLead(['1-2', '1-3', '1-5', '2-2', '0-4', '3-6', '1-1'])).toBe('1-1');
  });

  it('play to the partner\'s number and do not cover it', () => {
    // Partner (seat 2) led 5-5. The line is 5-5 | 5-1 | 1-3; seat 0 can cover the 5 (with 5-0) or play on the 3.
    const s = dominoes.codec.state.fromText(
      position({ hands: [['0-5', '3-4', '2-6', '0-1', '6-6', '1-6'], null, null, null], line: '5-5 5-1 1-3', by: [2, 3, 1], first: 0, leader: 2, counts: [6, 6, 6, 7], turn: 0 }),
    );
    const v = viewOf(s, 0);
    const move = heuristic(v, 3, createRng('partner'));
    expect(move).toEqual({ type: 'play', tile: '3-4', end: 'right' });
  });

  it('leave ends the next opponent cannot play', () => {
    // Seat 1 passed on 2 and 4 earlier. 2-4 leaves only numbers seat 1 lacks (on the left it also
    // keeps 4-6 playable for later); 4-6 would open a 6.
    const s = dominoes.codec.state.fromText(
      position({
        hands: [['2-4', '4-6', '0-0', '1-3', '3-3'], null, null, null],
        line: '2-5 5-5 5-4',
        by: [3, 1, 2],
        first: 1,
        leader: 1,
        counts: [5, 7, 7, 6],
        turn: 0,
        passes: [{ seat: 1, ends: [2, 4] }],
      }),
    );
    const move = heuristic(viewOf(s, 0), 3, createRng('shut'));
    expect(move).toEqual({ type: 'play', tile: '2-4', end: 'left' });
  });

  it('the search rates going out above everything', () => {
    const s = dominoes.codec.state.fromText(position({ hands: [['1-4'], ['0-0', '6-6'], ['2-3'], null], line: '4-6', counts: [1, 2, 1, 23], handNo: 6 }));
    const scored = evaluateActions(viewOf(s, 0), 4, 6, createRng('out'));
    expect(scored).toHaveLength(1);
  });
});
