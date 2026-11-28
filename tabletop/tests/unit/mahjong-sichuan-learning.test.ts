/**
 * The Sichuan track and drill (milestone 14c): the lessons pass the linter and their numbers come
 * from the Sichuan rules file; the drill's fan and total are what the table pays once you win.
 */
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { mahjongComputed, mahjongLessonGame as g } from '../../src/games/mahjong/learn/game';
import { mahjongVerifier } from '../../src/games/mahjong/learn/verify';
import { SICHUAN_LESSONS } from '../../src/games/mahjong/learn/sichuan';
import { SICHUAN_DRILLS, sichuanWinningHand } from '../../src/games/mahjong/practice/sichuan';
import { kindOf } from '../../src/games/mahjong/core/tiles';
import { KONG_PAY, SICHUAN_FAN } from '../../src/games/mahjong/styles/sichuan';
import { lintLesson } from '../../src/teach/lint';

const random = (seed: string) => {
  const rng = createRng(seed);
  return () => rng.next();
};

describe('the Sichuan track', () => {
  it('passes the lesson linter', async () => {
    for (const lesson of SICHUAN_LESSONS) expect(await lintLesson(lesson, g, mahjongVerifier), lesson.id).toEqual([]);
  });

  it('reads its numbers from the rules file', () => {
    const c = mahjongComputed(g.position(SICHUAN_LESSONS[0]?.start ?? ''));
    expect(c['sc:tiles']).toBe(108);
    expect(c['sfan:sc-pure-suit']).toBe(SICHUAN_FAN['sc-pure-suit']);
    expect(c['sc:kong:concealed:all']).toBe(KONG_PAY.concealed * 3);
    // The fan lesson's hand: one suit and all pungs, self-drawn: 3 fan, 8 points and 1 more from each of three.
    const fan = mahjongComputed(g.position(SICHUAN_LESSONS[2]?.start ?? ''));
    expect([fan['win:faan'], fan['win:total']]).toEqual([3, 27]);
  });
});

describe('the Sichuan drill', () => {
  it('lints, and asks the fan and the total the table pays once you win', async () => {
    const drill = SICHUAN_DRILLS[0];
    if (!drill) throw new Error('no drill');
    const next = random('unit/sichuan-fan');
    for (let i = 0; i < 10; i++) {
      const lesson = drill.make(next);
      expect(await lintLesson(lesson, g, mahjongVerifier), `#${i}`).toEqual([]);
      const s = g.position(lesson.start);
      const won = g.play(s, 'win');
      // The hand goes on after the win: the payment is in the scores at once.
      expect(won?.won[0]?.score.total).toBe(mahjongComputed(s)['win:faan']);
      expect(won?.scores[0]).toBe(mahjongComputed(s)['win:total']);
    }
  });

  it('builds hands in at most two suits, none of them the void suit', () => {
    const next = random('unit/sichuan-hands');
    for (let i = 0; i < 20; i++) {
      const h = sichuanWinningHand(next);
      const kinds = [...(h.state.hands[0] ?? []), ...(h.state.melds[0] ?? []).flatMap((m) => m.tiles)].map(kindOf);
      const suits = new Set(kinds.map((k) => Math.floor(k / 9)));
      expect(suits.size).toBeLessThanOrEqual(2);
      expect(suits.has(h.state.voids[0] ?? -1)).toBe(false);
    }
  });
});
