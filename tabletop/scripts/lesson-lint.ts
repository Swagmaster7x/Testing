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
import { BLACKJACK_LESSONS, blackjackLessonGame } from '../src/games/blackjack/learn';
import { blackjackVerifier } from '../src/games/blackjack/learn/verify';
import { BRISCA_LESSONS, briscaLessonGame } from '../src/games/brisca/learn';
import { GIN_LESSONS, ginLessonGame } from '../src/games/gin-rummy/learn';
import { ginVerifier } from '../src/games/gin-rummy/learn/verify';
import { HEARTS_LESSONS, heartsLessonGame } from '../src/games/hearts/learn';
import { heartsVerifier } from '../src/games/hearts/learn/verify';
import { SPADES_LESSONS, spadesLessonGame } from '../src/games/spades/learn';
import { spadesVerifier } from '../src/games/spades/learn/verify';
import { CC_LESSONS, ccLessonGame } from '../src/games/chinese-checkers/learn';
import { ccVerifier } from '../src/games/chinese-checkers/learn/verify';
import { briscaVerifier } from '../src/games/brisca/learn/verify';
import { DOMINOES_LESSONS, dominoesLessonGame } from '../src/games/dominoes/learn';
import { dominoesVerifier } from '../src/games/dominoes/learn/verify';
import { CHESS_LESSONS, chessLessonGame } from '../src/games/chess/learn';
import { chessVerifier } from '../src/games/chess/learn/verify';
import { GO_LESSONS, goLessonGame } from '../src/games/go/learn';
import { goVerifier } from '../src/games/go/learn/verify';
import { POKER_LESSONS, pokerLessonGame } from '../src/games/holdem/learn';
import { pokerVerifier } from '../src/games/holdem/learn/verify';
import { lessonGames } from '../src/games/lessons';
import { SHOGI_LESSONS, shogiLessonGame } from '../src/games/shogi/learn';
import type { ClaimCache } from '../src/games/shogi/learn/verify';
import { shogiVerifier } from '../src/games/shogi/learn/verify';
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

/** Shogi claims are checked by the built-in engine; results are kept in the same cache file. */
const SHOGI_ENGINE = 'kibitz-shogi-1';
const shogiCache: ClaimCache = {
  get: (key) => {
    const hit = cache[`${SHOGI_ENGINE}|${key}`] as unknown;
    if (Array.isArray(hit)) {
      hits++;
      return hit as string[];
    }
    return undefined;
  },
  set: (key, found) => {
    searches++;
    (cache as Record<string, unknown>)[`${SHOGI_ENGINE}|${key}`] = [...found];
  },
};

const SUITES: Record<string, Suite> = {
  chess: { lessons: CHESS_LESSONS, game: chessLessonGame, verifier: chessVerifier },
  brisca: { lessons: BRISCA_LESSONS, game: briscaLessonGame, verifier: () => briscaVerifier },
  dominoes: { lessons: DOMINOES_LESSONS, game: dominoesLessonGame, verifier: () => dominoesVerifier },
  shogi: { lessons: SHOGI_LESSONS, game: shogiLessonGame, verifier: () => shogiVerifier(shogiCache) },
  go: { lessons: GO_LESSONS, game: goLessonGame, verifier: () => goVerifier() },
  'chinese-checkers': { lessons: CC_LESSONS, game: ccLessonGame, verifier: () => ccVerifier() },
  poker: { lessons: POKER_LESSONS, game: pokerLessonGame, verifier: () => pokerVerifier },
  blackjack: { lessons: BLACKJACK_LESSONS, game: blackjackLessonGame, verifier: () => blackjackVerifier },
  hearts: { lessons: HEARTS_LESSONS, game: heartsLessonGame, verifier: () => heartsVerifier },
  spades: { lessons: SPADES_LESSONS, game: spadesLessonGame, verifier: () => spadesVerifier },
  'gin-rummy': { lessons: GIN_LESSONS, game: ginLessonGame, verifier: () => ginVerifier },
};

/** Game folders whose name is not the game's id. */
const FOLDER_GAME: Readonly<Record<string, string>> = { holdem: 'poker' };

const problems: string[] = [];
const withFiles = readdirSync(gamesDir).filter((name) => statSync(join(gamesDir, name)).isDirectory() && lessonFiles(join(gamesDir, name, 'learn')).length > 0);
for (const folder of withFiles) if (!SUITES[FOLDER_GAME[folder] ?? folder]) problems.push(`${folder}: has lesson files but no lint suite in scripts/lesson-lint.ts`);
for (const game of lessonGames()) if (!SUITES[game]) problems.push(`${game}: the app loads lessons that are not linted`);

const engine = cachedEngine();
const started = Date.now();
for (const [gameId, suite] of Object.entries(SUITES)) {
  // LESSON_LINT_ONLY=shogi lints one game (the full run is part of npm run check).
  if (process.env.LESSON_LINT_ONLY && process.env.LESSON_LINT_ONLY !== gameId) continue;
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
