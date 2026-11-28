/**
 * Lints the Mahjong lessons whose ids contain a word, and some drills (not part of the checks; the
 * full lint is `npm run lint:lessons`).
 *
 *   npx tsx scripts/mahjong-lint-some.ts <id part> [drill id] [how many]
 */
import { MAHJONG_LESSONS, mahjongLessonGame } from '../src/games/mahjong/learn';
import { mahjongVerifier } from '../src/games/mahjong/learn/verify';
import { MAHJONG_DRILLS } from '../src/games/mahjong/practice';
import { lintLesson } from '../src/teach/lint';

const [part = 'co-', drillId, countArg = '5'] = process.argv.slice(2);
let bad = 0;
for (const lesson of MAHJONG_LESSONS.filter((l) => l.id.includes(part))) {
  const problems = await lintLesson(lesson, mahjongLessonGame, mahjongVerifier);
  console.log(problems.length === 0 ? `ok ${lesson.id}` : problems.join('\n'));
  bad += problems.length;
}
if (drillId) {
  const drill = MAHJONG_DRILLS.find((d) => d.id === drillId);
  if (!drill) throw new Error(`No drill ${drillId}`);
  let seed = 1;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < Number(countArg); i++) {
    const t0 = Date.now();
    const lesson = drill.make(random);
    const problems = await lintLesson(lesson, mahjongLessonGame, mahjongVerifier);
    console.log(problems.length === 0 ? `ok ${drill.id} #${i} (${Date.now() - t0} ms)` : problems.join('\n'));
    bad += problems.length;
  }
}
process.exit(bad > 0 ? 1 : 0);
