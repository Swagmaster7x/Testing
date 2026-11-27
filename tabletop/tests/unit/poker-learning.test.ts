/**
 * Hold'em learning: the range shorthand, the numbers lessons quote, the verifier that proves
 * "best" claims by equity and pot odds, the generated problems and the drills.
 */
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import type { Card } from '../../src/games/holdem/cards';
import { cardIndex, handClass } from '../../src/games/holdem/cards';
import { comboOf, exactEquity } from '../../src/games/holdem/equity';
import { POKER_LESSONS } from '../../src/games/holdem/learn';
import { after, handPhrase, lessonPosition, pokerComputed, pokerLessonGame, stripPokerNotation } from '../../src/games/holdem/learn/game';
import { assume, assumed, liveCombos, parseRange } from '../../src/games/holdem/learn/ranges';
import { claimProblems, MARGIN, pokerVerifier, prove } from '../../src/games/holdem/learn/verify';
import { evaluate } from '../../src/games/holdem/evaluate';
import { inTop, openFraction } from '../../src/games/holdem/preflop';
import { loadPokerPractice, POKER_DRILLS } from '../../src/games/holdem/practice';
import type { HoldemState } from '../../src/games/holdem/rules';
import { holdem, positionName } from '../../src/games/holdem/rules';
import { inSet } from '../../src/games/practice';
import { readyItems } from '../../src/games/ready';
import type { LessonStep } from '../../src/teach/lesson';
import { fillText, typedNumbers } from '../../src/teach/lesson';
import { currentStep, next, startLesson, submitMove, submitNumber, valuesAt } from '../../src/teach/runner';
import { lintLesson } from '../../src/teach/lint';

const h = (text: string): Card[] => text.split(' ') as Card[];
const BTN_VS_BB = ['fold', 'fold', 'fold', 'r5', 'fold', 'call'];
const state = (text: string): HoldemState => pokerLessonGame.position(text);
const values = (text: string) => pokerComputed(state(text));
const random = (seed: string) => {
  const rng = createRng(seed);
  return () => rng.next();
};

describe('ranges', () => {
  it('reads classes, pluses, exact combos and a slice of the ranking', () => {
    expect(parseRange('AA')).toHaveLength(6);
    expect(parseRange('AKs')).toHaveLength(4);
    expect(parseRange('AKo')).toHaveLength(12);
    expect(parseRange('AK')).toHaveLength(16);
    expect(parseRange('QQ+')).toHaveLength(18);
    expect(parseRange('ATs+')).toHaveLength(16);
    expect(parseRange('KhQh,KhQh,AA')).toHaveLength(7);
    const top = parseRange('top:0.15').length / 1326;
    expect(top).toBeGreaterThan(0.13);
    expect(top).toBeLessThan(0.17);
    expect(() => parseRange('AKx')).toThrow();
    expect(liveCombos('AA', new Set([cardIndex('Ah')]))).toHaveLength(3);
  });

  it('rides in a seed that no view shows', () => {
    const seed = assume({ value: 'QQ+', bluff: 'JTs' });
    expect(assumed(seed)).toEqual({ value: 'QQ+', bluff: 'JTs' });
    expect(assumed('position')).toBeNull();
    const s = state(lessonPosition({ button: 0, holes: [], seed }));
    expect(s.seed).toBe(seed);
    expect(JSON.stringify(holdem.view(s, 0))).not.toContain('assume');
  });
});

describe('the numbers lessons quote', () => {
  it('pot odds against a turn all-in, outs and exact equity with cards up', () => {
    const text = lessonPosition({ button: 0, stacks: [200, 200, 27, 200, 200, 200], holes: [h('Jh Th'), null, h('Kc Qd'), null, null, null], board: h('Kh 9h 2c 8d 7c'), actions: [...BTN_VS_BB, 'check', 'r8', 'call', 'r14'] });
    const c = values(text);
    expect(c.call).toBe(14);
    expect(c.pot).toBe(41);
    expect(c.final).toBe(55);
    expect(c.need).toBe(Math.round((100 * 14) / 55));
    expect(c['outs:win']).toBe(14);
    const exact = exactEquity([comboOf(h('Jh Th')), comboOf(h('Kc Qd'))], h('Kh 9h 2c 8d').map(cardIndex))[0] ?? 0;
    expect(c.equity).toBe(Math.round(100 * exact));
    expect(exact).toBeCloseTo(14 / 44, 10);
  });

  it('counts outs to a straight or better, with the quick rule and the exact chance', () => {
    const flop = values(lessonPosition({ button: 0, holes: [h('Ah 7h'), null, null, null, null, null], board: h('Kh 9h 2c 5s Jd'), actions: [...BTN_VS_BB, 'check'] }));
    expect(flop.outs).toBe(9);
    expect(flop.rough).toBe(36);
    expect(flop.hit).toBe(Math.round(100 * (1 - (38 * 37) / (47 * 46))));
    const turn = values(after(lessonPosition({ button: 0, holes: [h('Ah 7h'), null, null, null, null, null], board: h('Kh 9h 2c 5s Jd'), actions: [...BTN_VS_BB, 'check'] }), 'check check'));
    expect(turn.outs).toBe(9);
    expect(turn.rough).toBe(18);
    expect(turn.hit).toBe(Math.round((100 * 9) / 46));
    expect(values(lessonPosition({ button: 0, holes: [h('9s 8d'), null, null, null, null, null], board: h('7c 6h 2d Kc 3h'), actions: [...BTN_VS_BB, 'check'] })).outs).toBe(8);
    expect(values(lessonPosition({ button: 0, holes: [h('9s 8d'), null, null, null, null, null], board: h('Jc 7h 2d Kc 3h'), actions: [...BTN_VS_BB, 'check'] })).outs).toBe(4);
  });

  it('works out the main pot and the side pot', () => {
    const text = lessonPosition({ button: 5, stacks: [200, 200, 40, 200, 200, 200], holes: [h('Jc Jd'), null, h('Ac Ad'), h('Ah Ks'), null, null], board: h('7c 5d 2h 9s 3c'), actions: ['r40', 'r100', 'fold', 'fold', 'call', 'fold'] });
    const c = values(text);
    expect(c['pot:main']).toBe(122);
    expect(c['pot:side']).toBe(120);
  });

  it('names hands for the middle of a sentence and reads the opening chart', () => {
    expect(handPhrase(evaluate(h('Qs Qd 7h 2c 9d 3s 4c')))).toBe('a pair of queens');
    expect(handPhrase(evaluate(h('Ah Kh Qh Jh Th 2c 3d')))).toBe('a royal flush');
    expect(handPhrase(evaluate(h('9c 9d 9h 5h 5c Kh 2h')))).toBe('a full house, nines full of fives');
    const c = values(lessonPosition({ button: 0, holes: [] }));
    expect(c['open:UTG']).toBe(Math.round(100 * openFraction('UTG', 6)));
    expect(c['open:BTN']).toBe(Math.round(100 * openFraction('BTN', 6)));
  });

  it('treats card codes and hand classes as notation, not typed numbers', () => {
    expect(typedNumbers('Your 7h and the AKs, T9s, QQ+', stripPokerNotation)).toEqual([]);
    expect(typedNumbers('You need 33% and a pair of 77', stripPokerNotation)).toEqual(['33', '77']);
  });
});

describe('the verifier', () => {
  const potOdds = (stack: number) => lessonPosition({ button: 0, stacks: [200, 200, stack, 200, 200, 200], holes: [h('Jh Th'), null, h('Kc Qd'), null, null, null], board: h('Kh 9h 2c 8d 7c'), actions: [...BTN_VS_BB, 'check', 'r8', 'call', `r${stack - 13}`] });

  it('proves a call by exact equity and pot odds, and refuses the fold', () => {
    const s = state(potOdds(27));
    const proof = prove(s, true);
    expect(proof.kind).toBe('call');
    if (proof.kind !== 'call') return;
    expect(proof.best).toBe('call');
    expect(proof.gain).toBeCloseTo((14 / 44) * 55 - 14, 6);
    expect(claimProblems(s, ['call'], true)).toEqual([]);
    expect(claimProblems(s, ['fold'], true)[0]).toMatch(/best play is call/);
  });

  it('turns to a fold when the price rises, and refuses a claim too close to call', () => {
    const dear = state(potOdds(80));
    expect(claimProblems(dear, ['fold'], true)).toEqual([]);
    // Find a price where calling and folding are within the margin.
    let close: string[] | null = null;
    for (let stack = 27; stack <= 80; stack++) {
      const s = state(potOdds(stack));
      const p = prove(s, true);
      if (p.kind === 'call' && Math.abs(p.gain) < MARGIN * p.stake) {
        close = claimProblems(s, [p.best], true);
        break;
      }
    }
    expect(close?.[0]).toMatch(/better by only/);
  });

  it('needs the cards up or a stated range, one opponent, and a play equity can decide', () => {
    const hidden = state(potOdds(27));
    expect(claimProblems(hidden, ['call'], false)[0]).toMatch(/assumes no range/);
    const ranged = state(lessonPosition({ button: 0, stacks: [200, 200, 27, 200, 200, 200], holes: [h('Jh Th'), null, h('Kc Qd'), null, null, null], board: h('Kh 9h 2c 8d 7c'), actions: [...BTN_VS_BB, 'check', 'r8', 'call', 'r14'], seed: assume({ value: 'KQ,KJ,K9,99,22' }) }));
    expect(prove(ranged, false).kind).toBe('call');
    const preflop = state(lessonPosition({ button: 0, holes: [h('Ah Kh'), null, null, null, null, null], actions: ['fold', 'fold', 'fold'] }));
    expect(claimProblems(preflop, ['r200'], true)[0]).toMatch(/one other player/);
    const flopBet = state(lessonPosition({ button: 0, holes: [h('Jh Th'), null, h('Kc Qd'), null, null, null], board: h('Kh 9h 2c 8d 7c'), actions: [...BTN_VS_BB, 'r6'] }));
    expect(claimProblems(flopBet, ['call'], true)[0]).toMatch(/calling ends the betting/);
    expect(claimProblems(flopBet, ['r12'], true)[0]).toMatch(/only a call, a fold or an all-in/);
  });

  it('proves all-in or fold for a short stack against a stated calling range', () => {
    const shove = (hole: string, calls: string) => state(lessonPosition({ button: 5, stacks: [16, 200, 200, 200, 200, 200], holes: [h(hole), null, null, null, null, null], actions: ['fold', 'fold', 'fold', 'fold'], seed: assume({ value: calls }) }));
    expect(claimProblems(shove('Kc 9d', 'top:0.25'), ['r16'], false)).toEqual([]);
    expect(claimProblems(shove('7c 2d', 'top:0.5'), ['fold'], false)).toEqual([]);
    expect(claimProblems(shove('Kc 9d', 'top:0.25'), ['fold'], false)[0]).toMatch(/best play is r16/);
  });

  it('flags positions that break the lesson conventions', () => {
    const good = state(lessonPosition({ button: 0, holes: [] }));
    expect(pokerVerifier.positionProblems(good)).toEqual([]);
    expect(pokerVerifier.positionProblems({ ...good, handNo: 3 })[0]).toMatch(/last of its session/);
    const p0 = good.players[0];
    if (!p0) throw new Error('no seat 0');
    expect(pokerVerifier.positionProblems({ ...good, players: [{ ...p0, stack: p0.stack + 5 }, ...good.players.slice(1)] }).some((x) => /chips on the table/.test(x))).toBe(true);
  });
});

describe('lessons', () => {
  it('cover stages 0 to 2 and the Table-ready track, and the checklist names real lessons', () => {
    const count = (stage: string) => POKER_LESSONS.filter((l) => l.stage === stage).length;
    expect(count('stage-0')).toBeGreaterThanOrEqual(2);
    for (const stage of ['stage-1', 'stage-2', 'stage-3', 'table']) expect(count(stage), stage).toBeGreaterThanOrEqual(6);
    // In order: the Learn screen suggests the first lesson not yet done.
    const stages = POKER_LESSONS.map((l) => l.stage);
    expect(stages).toEqual([...stages].sort((a, b) => ['stage-0', 'stage-1', 'stage-2', 'stage-3', 'table'].indexOf(a) - ['stage-0', 'stage-1', 'stage-2', 'stage-3', 'table'].indexOf(b)));
    const ids = new Set(POKER_LESSONS.map((l) => l.id));
    expect(ids.size).toBe(POKER_LESSONS.length);
    for (const item of readyItems('poker')) for (const id of item.lessons ?? []) expect(ids.has(id), id).toBe(true);
    expect(readyItems('poker').some((item) => item.drill?.id === 'drill-poker-winner')).toBe(true);
  });

  it('name only players who are still in the hand at that step', () => {
    for (const lesson of POKER_LESSONS) {
      let position = lesson.start;
      const check = (text: string, at: string, where: string) => {
        const s = state(at);
        const last = s.log[s.log.length - 1];
        for (const m of text.matchAll(/\{name:(\d)\}/g)) {
          const seat = Number(m[1]);
          const p = s.players[seat];
          // In the hand, or the player whose fold was the last thing that happened.
          const ok = (p !== undefined && p.hole.length === 2 && !p.folded) || (last?.seat === seat && last.kind === 'fold');
          expect(ok, `${lesson.id} ${where}: ${m[0]} is not in the hand`).toBe(true);
        }
      };
      lesson.steps.forEach((step, i) => {
        if (step.position) position = step.position;
        const texts = [step.text, ...(step.kind === 'askChoice' ? step.options.flatMap((o) => [o.text, o.why ?? '']) : []), ...(step.kind === 'askMove' ? [step.success] : [])];
        for (const t of texts) check(t, position, `step ${i + 1}`);
        if (step.kind === 'checkpoint') {
          let qp = position;
          for (const q of step.questions) {
            if (q.position) qp = q.position;
            check(q.text, qp, `step ${i + 1}`);
          }
        }
        if (step.kind === 'show') position = after(position, step.moves.join(' '));
        if (step.kind === 'askMove') position = after(position, [step.accept[0], step.reply].filter(Boolean).join(' '));
      });
    }
  });

  it('keep a question’s numbers from where it was asked once the move is played', () => {
    const lesson = POKER_LESSONS.find((l) => l.id === 'poker.2.pot-odds');
    if (!lesson) throw new Error('no pot-odds lesson');
    let s = startLesson(lesson);
    while (currentStep(s)?.kind !== 'askMove') s = currentStep(s)?.kind === 'askNumber' ? next(pokerLessonGame, submitNumber(pokerLessonGame, s, Number(valuesAt(pokerLessonGame, s).need))) : next(pokerLessonGame, s);
    const before = s.position;
    s = submitMove(pokerLessonGame, s, 'call');
    expect(s.phase).toBe('correct');
    expect(s.position).not.toBe(before);
    expect(s.asked).toBe(before);
    const step = currentStep(s);
    if (step?.kind !== 'askMove') throw new Error('not the move');
    expect(fillText(step.text, pokerComputed(state(s.asked)))).toMatch(/^Your \d+% beats the \d+% you need/);
  });

  it('never mention money: play chips only', () => {
    // Everything a student reads: titles, steps, options, feedback, and the drills' text too.
    const read = (steps: readonly LessonStep[]): string[] =>
      steps.flatMap((step) => [
        step.text,
        ...(step.kind === 'askChoice' ? step.options.flatMap((o) => [o.text, o.why ?? '']) : []),
        ...(step.kind === 'askMove' ? [step.success, ...Object.values(step.wrong ?? {})] : []),
        ...(step.kind === 'askNumber' ? [step.success] : []),
        ...(step.kind === 'checkpoint' ? read(step.questions) : []),
      ]);
    const next = random('unit/words');
    const drills = POKER_DRILLS.flatMap((d) => Array.from({ length: 5 }, () => d.make(next)));
    // Placeholder names ({cash:stack}) are never shown; their values are numbers.
    const all = [...POKER_LESSONS, ...drills].flatMap((l) => [l.title, ...read(l.steps)]).join('\n').replace(/\{[\w:.-]+\}/g, '').toLowerCase();
    for (const word of ['money', 'dollar', 'cash', '$', '€', 'bankroll', 'buy', 'purchase', 'wager', 'gambl']) expect(all.includes(word), word).toBe(false);
  });
});

describe('practice', () => {
  it('ships more than a hundred all-in problems, each line legal and each answer proved by exact equity', async () => {
    const pack = await loadPokerPractice();
    const set = pack.sets[0];
    if (!set) throw new Error('no problem set');
    expect(pack.problems.filter((p) => inSet(p, set)).length).toBeGreaterThanOrEqual(100);
    expect(new Set(pack.problems.map((p) => p.id)).size).toBe(pack.problems.length);
    let calls = 0;
    for (const p of pack.problems) {
      const before = state(p.position);
      expect(before.toAct, p.id).not.toBe(0);
      const facing = pokerLessonGame.play(before, p.setup ?? '');
      expect(facing, p.id).not.toBeNull();
      if (!facing) continue;
      expect(facing.toAct, p.id).toBe(0);
      expect(claimProblems(facing, p.line, true), p.id).toEqual([]);
      expect(pokerLessonGame.play(facing, p.line[0] ?? '')?.over, p.id).toBe(true);
      if (p.line[0] === 'call') calls++;
    }
    expect(calls / pack.problems.length).toBeGreaterThan(0.35);
    expect(calls / pack.problems.length).toBeLessThan(0.65);
  });

  it('makes every drill a sound exercise that the lesson linter passes', async () => {
    for (const drill of POKER_DRILLS) {
      const next = random(`unit/${drill.id}`);
      for (let i = 0; i < 6; i++) {
        const lesson = drill.make(next);
        expect(await lintLesson(lesson, pokerLessonGame, pokerVerifier), `${drill.id} #${i}`).toEqual([]);
      }
    }
  });

  it('answers the preflop drill by the opening chart', () => {
    const drill = POKER_DRILLS.find((d) => d.id === 'drill-poker-preflop');
    if (!drill) throw new Error('no preflop drill');
    const next = random('unit/chart');
    for (let i = 0; i < 25; i++) {
      const lesson = drill.make(next);
      const s = state(lesson.start);
      const hole = s.players[0]?.hole ?? [];
      const cls = handClass(hole[0] as Card, hole[1] as Card);
      const step = lesson.steps[0];
      if (step?.kind !== 'askMove') throw new Error('not a move');
      const raise = inTop(cls, openFraction(positionName(s, 0), 6));
      expect(step.accept[0]?.startsWith('r'), `${cls} from ${positionName(s, 0)}`).toBe(raise);
    }
  });
});
