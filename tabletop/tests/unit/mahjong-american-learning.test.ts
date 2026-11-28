/**
 * The American track and drill (milestone 14c): the lessons pass the linter with their numbers
 * read from the rules file and the practice card; the drill's hand is the one it names, and its
 * total is what the table pays once you win.
 */
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { mahjongComputed, mahjongLessonGame as g } from '../../src/games/mahjong/learn/game';
import { mahjongVerifier } from '../../src/games/mahjong/learn/verify';
import { AMERICAN_LESSONS } from '../../src/games/mahjong/learn/american';
import { AMERICAN_DRILLS, americanWinningHand } from '../../src/games/mahjong/practice/american';
import { PRACTICE } from '../../src/games/mahjong/styles/american';
import { lintLesson } from '../../src/teach/lint';

const random = (seed: string) => {
  const rng = createRng(seed);
  return () => rng.next();
};

describe('the American track', () => {
  it('passes the lesson linter', async () => {
    for (const lesson of AMERICAN_LESSONS) expect(await lintLesson(lesson, g, mahjongVerifier), lesson.id).toEqual([]);
  });

  it('reads its numbers from the rules file and the practice card', () => {
    const c = mahjongComputed(g.position(AMERICAN_LESSONS[0]?.start ?? ''));
    expect([c['am:tiles'], c['am:jokers'], c['am:flowers'], c['am:hand']]).toEqual([152, 8, 8, 14]);
    expect(c['am:hands']).toBe(PRACTICE.hands.length);
    // The scoring lesson: the Evens hand with a joker, self-picked: 25 points, 50 from each of three.
    const s = mahjongComputed(g.position(AMERICAN_LESSONS[4]?.start ?? ''));
    expect([s['win:faan'], s['win:total']]).toEqual([25, 150]);
  });
});

describe('the American drill', () => {
  it('lints, names the hand on the card, and asks the total the table pays once you win', async () => {
    const drill = AMERICAN_DRILLS[0];
    if (!drill) throw new Error('no drill');
    const next = random('unit/american-pay');
    for (let i = 0; i < 8; i++) {
      const lesson = drill.make(next);
      expect(await lintLesson(lesson, g, mahjongVerifier), `#${i}`).toEqual([]);
      const s = g.position(lesson.start);
      const won = g.play(s, 'win');
      const result = won?.results[won.results.length - 1];
      expect(result?.deltas[0]).toBe(mahjongComputed(s)['win:total']);
      const ask = lesson.steps[0];
      if (ask?.kind !== 'askChoice') throw new Error('not a choice');
      expect(ask.options.find((o) => o.correct)?.text).toBe(result?.wins[0]?.score.lines[0]?.label);
    }
  });

  it('builds hands from every part of the card, some with jokers and exposures', () => {
    const next = random('unit/american-hands');
    const sections = new Set<string>();
    let jokers = 0;
    let exposed = 0;
    for (let i = 0; i < 40; i++) {
      const h = americanWinningHand(next);
      sections.add(PRACTICE.hands.find((x) => x.id === h.handId)?.section ?? '');
      if ([...(h.state.hands[0] ?? []), ...(h.state.melds[0] ?? []).flatMap((m) => m.tiles)].some((t) => t.startsWith('J.'))) jokers++;
      if ((h.state.melds[0] ?? []).length > 0) exposed++;
    }
    expect(sections.size).toBeGreaterThan(5);
    expect(jokers).toBeGreaterThan(0);
    expect(exposed).toBeGreaterThan(0);
  });
});
