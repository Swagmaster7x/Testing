/**
 * npm run lint:lessons, the last step of `npm run check` (PLAN.md 2.5).
 *
 * Lessons live in src/games/<game>/learn/. The lesson runner and the full linter arrive in
 * milestone 2: it will replay every lesson position, check every accepted answer is legal, run
 * an auto-player through each lesson, confirm every "best move" with the engine or solver and
 * require every number in lesson text to come from the rules module. Until a game has lessons,
 * this step only finds the lesson folders and reports that there is nothing to check.
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const gamesDir = join(import.meta.dirname, '..', 'src', 'games');

function lessonFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? lessonFiles(full) : /\.(ts|json)$/.test(name) ? [full] : [];
  });
}

const games = readdirSync(gamesDir).filter((name) => statSync(join(gamesDir, name)).isDirectory());
const found = games.flatMap((game) => lessonFiles(join(gamesDir, game, 'learn')));

if (found.length > 0) {
  console.error(`Found ${found.length} lesson file(s), but the lesson linter arrives in milestone 2. Build it before adding lessons.`);
  process.exit(1);
}
console.log('Lesson lint: no lessons yet (the lesson runner and linter arrive in milestone 2). Nothing to check.');
