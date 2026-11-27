/** Tute drills: every generated exercise passes the lesson linter, as a written lesson would. */
import { describe, expect, it } from 'vitest';
import { tuteLessonGame } from '../../src/games/tute/learn/game';
import { tuteVerifier } from '../../src/games/tute/learn/verify';
import { loadTutePractice } from '../../src/games/tute/practice';
import { tute } from '../../src/games/tute/rules';
import { lintLesson } from '../../src/teach/lint';

describe('tute drills', () => {
  it('make sound exercises: legal positions, computed answers, finished by the auto-player', async () => {
    const pack = await loadTutePractice();
    expect(pack.drills.map((d) => d.id).every((id) => id.startsWith('drill-'))).toBe(true);
    let seed = 7;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (const drill of pack.drills) {
      for (let i = 0; i < 40; i++) {
        const lesson = drill.make(random);
        const s = tuteLessonGame.position(lesson.start);
        expect(tute.turn(s)).toBe(0);
        const problems = await lintLesson(lesson, tuteLessonGame, tuteVerifier);
        expect(problems, `${drill.id} #${i}`).toEqual([]);
      }
    }
  }, 120_000);
});
