/**
 * npm run lint:lessons, the last step of `npm run check` (PLAN.md 2.5).
 *
 * For every game with lessons: every position is legal, every accepted answer is legal, an
 * auto-player finishes every lesson (answering right, and answering wrong then asking to be
 * shown), every "best move" claim holds by an engine margin, free-play goals are reachable
 * against the engine's best defence, and every number in the text is computed.
 *
 * Engine searches use fixed node budgets, so they are cached between runs in
 * node_modules/.cache/kibitz/lesson-lint.json; a lesson change only searches what changed.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Engine, SearchRequest, SearchResult } from '../src/ai/uci';
import { BRISCA_LESSONS, briscaLessonGame } from '../src/games/brisca/learn';
import { briscaVerifier } from '../src/games/brisca/learn/verify';
import { DOMINOES_LESSONS, dominoesLessonGame } from '../src/games/dominoes/learn';
import { dominoesVerifier } from '../src/games/dominoes/learn/verify';
import { CHESS_LESSONS, chessLessonGame } from '../src/games/chess/learn';
import { chessVerifier } from '../src/games/chess/learn/verify';
import { lessonGames } from '../src/games/lessons';
import type { Lesson } from '../src/teach/lesson';
import { STAGES } from '../src/teach/lesson';
import type { LessonVerifier } from '../src/teach/lint';
import { lintLesson, lintLessons } from '../src/teach/lint';
import { stageCheck } from '../src/teach/stage-check';
import type { LessonGame } from '../src/teach/runner';
import { nodeEngine } from '../tests/harness/stockfish-node';

const root = join(import.meta.dirname, '..');
const gamesDir = join(root, 'src', 'games');
const cacheFile = join(root, 'node_modules', '.cache', 'kibitz', 'lesson-lint.json');
const ENGINE_BUILD = 'stockfish-19.0.1-lite-single';

type Cache = Record<string, SearchResult>;
const cache: Cache = existsSync(cacheFile) ? (JSON.parse(readFileSync(cacheFile, 'utf8')) as Cache) : {};
let searches = 0;
let hits = 0;

/** Stockfish in Node, started only when a search is not in the cache. */
function cachedEngine(): Engine & { close(): void } {
  let inner: Engine | null = null;
  return {
    async search(request: SearchRequest) {
      const key = `${ENGINE_BUILD}|${request.fen}|${request.nodes}|${request.multiPv ?? 1}|${request.elo ?? ''}`;
      const hit = cache[key];
      if (hit) {
        hits++;
        return hit;
      }
      inner ??= nodeEngine();
      searches++;
      const result = await inner.search(request);
      cache[key] = result;
      return result;
    },
    terminate() {
      inner?.terminate();
    },
    close() {
      inner?.terminate();
      inner = null;
    },
  };
}

function lessonFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? lessonFiles(full) : /\.(ts|json)$/.test(name) ? [full] : [];
  });
}

interface Suite {
  readonly lessons: readonly Lesson[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- each game has its own state type
  readonly game: LessonGame<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- as above
  verifier(engine: Engine): LessonVerifier<any>;
}

const SUITES: Record<string, Suite> = {
  chess: { lessons: CHESS_LESSONS, game: chessLessonGame, verifier: chessVerifier },
  brisca: { lessons: BRISCA_LESSONS, game: briscaLessonGame, verifier: () => briscaVerifier },
  dominoes: { lessons: DOMINOES_LESSONS, game: dominoesLessonGame, verifier: () => dominoesVerifier },
};

const problems: string[] = [];
const withFiles = readdirSync(gamesDir).filter((name) => statSync(join(gamesDir, name)).isDirectory() && lessonFiles(join(gamesDir, name, 'learn')).length > 0);
for (const game of withFiles) if (!SUITES[game]) problems.push(`${game}: has lesson files but no lint suite in scripts/lesson-lint.ts`);
for (const game of lessonGames()) if (!SUITES[game]) problems.push(`${game}: the app loads lessons that are not linted`);

const engine = cachedEngine();
const started = Date.now();
for (const [gameId, suite] of Object.entries(SUITES)) {
  const verifier = suite.verifier(engine);
  const found = await lintLessons(suite.lessons, suite.game, verifier, (lesson, p) => {
    if (process.env.LESSON_LINT_VERBOSE) console.log(`${p.length === 0 ? 'ok  ' : 'FAIL'} ${lesson.id}`);
  });
  problems.push(...found);
  // The "I already know this" checks are built from the lessons; they must pass too.
  for (const stage of STAGES) {
    if (!suite.lessons.some((l) => l.stage === stage)) continue;
    problems.push(...(await lintLesson(stageCheck(suite.lessons, suite.game, gameId, stage), suite.game, verifier)));
  }
  const byStage = STAGES.map((stage) => `${stage} ${suite.lessons.filter((l) => l.stage === stage).length}`).join(', ');
  console.log(`${gameId}: ${suite.lessons.length} lessons (${byStage})`);
}
engine.close();
mkdirSync(dirname(cacheFile), { recursive: true });
writeFileSync(cacheFile, JSON.stringify(cache));
console.log(`Engine: ${searches} searches, ${hits} from the cache, ${((Date.now() - started) / 1000).toFixed(1)} s.`);

if (problems.length > 0) {
  console.error(`\nLesson lint found ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log('Lesson lint: all lessons pass.');
