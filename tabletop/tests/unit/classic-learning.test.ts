// The classic card pack's lessons and practice: every drill is a sound exercise the lesson linter
// passes, the numbers lessons quote come out right, and Blackjack never talks about money.
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { BLACKJACK_LESSONS, blackjackLessonGame } from '../../src/games/blackjack/learn';
import { blackjackVerifier } from '../../src/games/blackjack/learn/verify';
import { BLACKJACK_DRILLS } from '../../src/games/blackjack/practice';
import { basicFor } from '../../src/games/blackjack/bots';
import { blackjack } from '../../src/games/blackjack/rules';
import { GIN_LESSONS, ginLessonGame } from '../../src/games/gin-rummy/learn';
import { ginVerifier } from '../../src/games/gin-rummy/learn/verify';
import { GIN_DRILLS } from '../../src/games/gin-rummy/practice';
import { HEARTS_LESSONS, heartsLessonGame } from '../../src/games/hearts/learn';
import { heartsVerifier } from '../../src/games/hearts/learn/verify';
import { HEARTS_DRILLS } from '../../src/games/hearts/practice';
import { readyItems } from '../../src/games/ready';
import { SPADES_LESSONS, spadesLessonGame } from '../../src/games/spades/learn';
import { spadesVerifier } from '../../src/games/spades/learn/verify';
import { SPADES_DRILLS } from '../../src/games/spades/practice';
import type { DrillDef } from '../../src/games/practice';
import type { Lesson, LessonStep } from '../../src/teach/lesson';
import { lintLesson } from '../../src/teach/lint';
import type { LessonGame } from '../../src/teach/runner';
import type { LessonVerifier } from '../../src/teach/lint';
import { canAdvance, chooseOption, currentQuestion, currentStep, next, startLesson, submitMove, submitNumber, valuesAt } from '../../src/teach/runner';
import { enBlackjack } from '../../src/text/games/blackjack';

const random = (seed: string) => {
  const rng = createRng(seed);
  return () => rng.next();
};

const SUITES: { name: string; drills: readonly DrillDef[]; game: LessonGame<never>; verifier: LessonVerifier<never>; lessons: readonly Lesson[] }[] = [
  { name: 'hearts', drills: HEARTS_DRILLS, game: heartsLessonGame as never, verifier: heartsVerifier, lessons: HEARTS_LESSONS },
  { name: 'spades', drills: SPADES_DRILLS, game: spadesLessonGame as never, verifier: spadesVerifier, lessons: SPADES_LESSONS },
  { name: 'gin-rummy', drills: GIN_DRILLS, game: ginLessonGame as never, verifier: ginVerifier, lessons: GIN_LESSONS },
  { name: 'blackjack', drills: BLACKJACK_DRILLS, game: blackjackLessonGame as never, verifier: blackjackVerifier, lessons: BLACKJACK_LESSONS },
];

/** Walks a lesson answering right; returns every number it asked for. */
function numberAnswers(lesson: Lesson, game: LessonGame<never>): unknown[] {
  const out: unknown[] = [];
  let s = startLesson(lesson);
  for (let guard = 0; guard < 500; guard++) {
    const step = currentStep(s);
    if (!step) break;
    if (canAdvance(s) || step.kind === 'say' || step.kind === 'show') {
      const before = s;
      s = next(game, s);
      if (s === before) break;
      continue;
    }
    const q = currentQuestion(s);
    if (!q) break;
    const values = valuesAt(game, s);
    if (q.kind === 'askMove') s = submitMove(game, s, q.accept[0] as string, values);
    else if (q.kind === 'askChoice') s = chooseOption(game, s, q.options.findIndex((o) => o.correct), values);
    else if (q.kind === 'askNumber') {
      out.push(values[q.answer]);
      s = submitNumber(game, s, Number(values[q.answer]), values);
    } else break;
  }
  return out;
}

describe('classic card pack practice', () => {
  for (const suite of SUITES) {
    it(`${suite.name}: at least three kinds of drill, each a sound exercise the lesson linter passes`, async () => {
      expect(suite.drills.length).toBeGreaterThanOrEqual(3);
      for (const drill of suite.drills) {
        const next = random(`unit/${drill.id}`);
        for (let i = 0; i < 12; i++) {
          const lesson = drill.make(next);
          expect(await lintLesson(lesson, suite.game, suite.verifier), `${drill.id} #${i}`).toEqual([]);
        }
      }
    }, 120_000);

    it(`${suite.name}: every number asked for can be typed on the number pad (a whole number, 0 to 999)`, () => {
      const next = random(`pad/${suite.name}`);
      const lessons = [...suite.lessons, ...suite.drills.flatMap((d) => Array.from({ length: 30 }, () => d.make(next)))];
      let asked = 0;
      for (const lesson of lessons) {
        for (const n of numberAnswers(lesson, suite.game)) {
          asked++;
          expect(Number.isInteger(n) && (n as number) >= 0 && (n as number) <= 999, `${lesson.id}: ${String(n)}`).toBe(true);
        }
      }
      expect(asked).toBeGreaterThan(20);
    }, 120_000);

    it(`${suite.name}: lessons cover stages 0 to 2 and the Table-ready track, and the checklist points at real lessons and drills`, () => {
      for (const stage of ['stage-0', 'stage-1', 'stage-2', 'table'] as const) expect(suite.lessons.some((l) => l.stage === stage), stage).toBe(true);
      const ids = new Set(suite.lessons.map((l) => l.id));
      for (const item of readyItems(suite.name)) {
        for (const id of item.lessons ?? []) expect(ids.has(id), id).toBe(true);
        if (item.drill) expect(suite.drills.some((d) => d.id === item.drill?.id), item.drill.id).toBe(true);
      }
    });
  }

  it('the basic-strategy trainer answers by the chart computed from the rules, over every kind of hand', () => {
    const drill = BLACKJACK_DRILLS.find((d) => d.id === 'drill-blackjack-chart') as DrillDef;
    const next = random('unit/chart');
    const kinds = new Set<string>();
    for (let i = 0; i < 300; i++) {
      const lesson = drill.make(next);
      const step = lesson.steps[0] as Extract<LessonStep, { kind: 'askMove' }>;
      const state = blackjack.codec.state.fromText(lesson.start);
      expect(step.accept).toEqual([basicFor(blackjack.view(state, 0))]);
      kinds.add(step.accept[0] as string);
    }
    // Hit, stand, double, split and surrender all come up.
    expect([...kinds].sort()).toEqual(['double', 'hit', 'split', 'stand', 'surrender']);
  });
});

describe('numbers the lessons quote', () => {
  const values = (lessons: readonly Lesson[], game: LessonGame<never>, id: string, step = 0) => {
    const lesson = lessons.find((l) => l.id === id) as Lesson;
    return game.computed(game.position(lesson.steps[step]?.position ?? lesson.start));
  };

  it('spades: set at five of six tricks, made with the last', () => {
    const v = values(SPADES_LESSONS, spadesLessonGame as never, 'spades.1.score');
    expect([v['bid:us'], v['won:us'], v['score:now'], v['score:if-mine']]).toEqual([6, 5, -60, 60]);
    expect(values(SPADES_LESSONS, spadesLessonGame as never, 'spades.2.count')['count:simple']).toBe(6);
    expect(values(SPADES_LESSONS, spadesLessonGame as never, 'spades.table.bags')['bags:left']).toBe(3);
  });

  it('gin: the layoff lesson is an undercut', () => {
    const v = values(GIN_LESSONS, ginLessonGame as never, 'gin-rummy.1.layoff');
    expect(v['deadwood:me']).toBe(8);
    expect(v['knock:laid']).toBe(1);
    expect(v['knock:defender']).toBeLessThanOrEqual(8);
    expect(v['knock:points']).toBe(25 + 8 - (v['knock:defender'] as number));
    expect(values(GIN_LESSONS, ginLessonGame as never, 'gin-rummy.1.deadwood')['deadwood:me']).toBe(25);
  });

  it('hearts and blackjack', () => {
    expect(values(HEARTS_LESSONS, heartsLessonGame as never, 'hearts.table.score')['total:me']).toBe(41);
    expect(values(BLACKJACK_LESSONS, blackjackLessonGame as never, 'blackjack.1.pays')['pay:bj']).toBe(30);
    expect(values(BLACKJACK_LESSONS, blackjackLessonGame as never, 'blackjack.table.count')['count:running']).toBe(1);
  });
});

describe('blackjack is played for play chips', () => {
  it('no money words in its lessons, drills or interface text', () => {
    const read = (steps: readonly LessonStep[]): string[] =>
      steps.flatMap((s) => [s.text, ...(s.kind === 'askChoice' ? s.options.flatMap((o) => [o.text, o.why ?? '']) : []), ...('success' in s ? [s.success] : []), ...(s.kind === 'checkpoint' ? read(s.questions) : [])]);
    const next = random('money');
    const drills = BLACKJACK_DRILLS.flatMap((d) => Array.from({ length: 5 }, () => d.make(next)));
    const all = [...BLACKJACK_LESSONS, ...drills].flatMap((l) => [l.title, ...read(l.steps)]).join('\n') + Object.values(enBlackjack).join('\n');
    expect(all.toLowerCase()).not.toMatch(/\b(money|dollars?|cash|euros?|pounds?|cents?|wager|gambl\w*)\b|\$/);
  });
});
