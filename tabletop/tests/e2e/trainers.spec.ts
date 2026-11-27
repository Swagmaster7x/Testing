// Milestone 15 trainers end to end: the chess opening trainer, the shogi castle trainer and Go
// joseki basics. A line played from memory joins the review queue; the "next move" drills; a lesson.
import type { Page } from '@playwright/test';
import { createRng } from '../../src/core/rng';
import { chessLessonGame } from '../../src/games/chess/learn';
import { CHESS_SIDES } from '../../src/games/chess/learn/openings';
import { chessOpenings } from '../../src/games/chess/openings';
import { pointName } from '../../src/games/go/coords';
import { josekiLines } from '../../src/games/go/joseki';
import { goLessonGame } from '../../src/games/go/learn';
import { GO_SIDES, josekiLessons } from '../../src/games/go/learn/joseki';
import { CASTLES } from '../../src/games/shogi/castles';
import { shogiLessonGame } from '../../src/games/shogi/learn';
import { SHOGI_SIDES } from '../../src/games/shogi/learn/castles';
import type { StageId } from '../../src/teach/lesson';
import type { LineWords, StudyLine } from '../../src/teach/lines';
import { lineDrill, linePositions, studentPlies } from '../../src/teach/lines';
import type { LessonGame } from '../../src/teach/runner';
import { move as chessMove } from './chess-helpers';
import { expect, noHorizontalScroll, test } from './fixtures';
import { point } from './go-helpers';
import { play as shogiPlay } from './shogi-helpers';

/** A Go move in SGF letters to its point name on 19×19. */
const goName = (sgf: string) => pointName((sgf.charCodeAt(1) - 97) * 19 + (sgf.charCodeAt(0) - 97), 19);
const goMove = (page: Page, sgf: string) => point(page, goName(sgf)).click();

/** The question a drill asks for a seed, worked out the way the drill screen does. */
function drillMove<S>(id: string, game: LessonGame<S>, lines: readonly StudyLine[], words: LineWords, gameId: string, stage: StageId, seed: string): { move: string; text: string } {
  const rng = createRng(`${seed}/${id}/0`);
  const lesson = lineDrill(id, game, lines, words, { gameId, stage }).make(() => rng.next());
  const step = lesson.steps[0];
  if (step?.kind !== 'askMove') throw new Error('a drill asks a move');
  return { move: step.accept[0] ?? '', text: step.text };
}

/** What each board shows as its position (data-position), from a lesson position. */
const BOARD: Record<string, { selector: string; key: (state: unknown) => string }> = {
  chess: { selector: 'svg.grid-board', key: (s) => (s as { fen: string }).fen },
  shogi: { selector: 'svg.grid-board', key: (s) => (s as { sfen: string }).sfen },
  go: { selector: 'svg.ib', key: (s) => (s as { board: string }).board },
};

/** Plays the student's moves of a line problem, each once the board shows the position before it. */
async function playLine(page: Page, gameId: string, line: StudyLine, game: LessonGame<unknown>, play: (move: string) => Promise<unknown>): Promise<void> {
  const positions = linePositions(game, line);
  const board = BOARD[gameId]!;
  for (const ply of studentPlies(game, line)) {
    const want = board.key(game.position(positions[ply] ?? ''));
    await expect.poll(() => page.locator(board.selector).getAttribute('data-position'), { timeout: 15_000 }).toBe(want);
    await play(line.moves[ply] ?? '');
  }
}

test.describe('trainers', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('chess: an opening played from memory shows its idea and joins the review queue', async ({ page }) => {
    const italian = chessOpenings().find((o) => o.id === 'italian')!;
    await page.goto('/#/practice/chess/openings?id=line:italian');
    await expect(page.locator('.problem-title')).toHaveText('Italian Game');
    await expect(page.getByText('Play White’s moves of this line from memory, one at a time.')).toBeVisible();
    await playLine(page, 'chess', italian, chessLessonGame, (m) => chessMove(page, m));
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!');
    await expect(page.locator('.problem-note')).toHaveText(italian.idea);
    await noHorizontalScroll(page);
    // A Black defence: White's first move plays itself; a wrong answer fails and is kept for review.
    await page.goto('/#/practice/chess/openings?id=line:caro-kann');
    await expect(page.getByText('Play Black’s moves of this line from memory, one at a time.')).toBeVisible({ timeout: 10_000 });
    await chessMove(page, 'e7e6');
    await expect(page.locator('.lesson-feedback')).toContainText('Not the move.');
    await page.getByRole('button', { name: 'Show the solution' }).click();
    await expect(page.locator('.problem-note')).toContainText('keeps the light-squared bishop free');
    await page.goto('/#/games/chess/practice');
    await expect(page.getByText('2 cards in the queue, none due right now.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Openings' })).toBeVisible();
  });

  test('chess: the next move of an opening, and an opening lesson to the end', async ({ page }) => {
    const ask = drillMove('drill-openings', chessLessonGame, chessOpenings(), CHESS_SIDES, 'chess', 'stage-4', 'e2e-open');
    await page.goto('/#/practice/chess/drill-openings?seed=e2e-open');
    await expect(page.locator('.lesson-text')).toHaveText(ask.text);
    await chessMove(page, ask.move);
    await expect(page.locator('.lesson-feedback')).toContainText('Right.');

    await page.goto('/#/learn/chess.openings.flank');
    const next = page.getByRole('button', { name: 'Next' });
    for (let i = 0; i < 7; i++) {
      await expect(next).toBeEnabled({ timeout: 20_000 });
      await next.click();
    }
    for (const id of ['english', 'reti', 'catalan']) {
      const o = chessOpenings().find((x) => x.id === id)!;
      await expect(page.locator('.lesson-text').last()).toContainText(o.name);
      await chessMove(page, o.moves.at(-1) ?? '');
    }
    await expect(next).toBeEnabled();
    await next.click();
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  });

  test('shogi: a castle built from the starting position, and the next move of a castle', async ({ page }) => {
    const boat = CASTLES.find((c) => c.id === 'boat')!;
    await page.goto('/#/practice/shogi/shogi-castles?id=line:boat');
    await expect(page.locator('.problem-title')).toHaveText(boat.name);
    await playLine(page, 'shogi', boat, shogiLessonGame, (m) => shogiPlay(page, m));
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!');
    await expect(page.locator('.problem-note')).toHaveText(boat.idea);
    await noHorizontalScroll(page);

    const ask = drillMove('drill-shogi-build', shogiLessonGame, CASTLES, SHOGI_SIDES, 'shogi', 'stage-4', 'e2e-castle');
    await page.goto('/#/practice/shogi/drill-shogi-build?seed=e2e-castle');
    await expect(page.locator('.lesson-text')).toHaveText(ask.text);
    await shogiPlay(page, ask.move, ask.text.includes('White') ? 'Gote' : 'Sente');
    await expect(page.locator('.lesson-feedback')).toContainText('Right.');
  });

  test('go: a joseki on the full board, the next move of a joseki, and the 4-4 lesson', async ({ page }) => {
    test.setTimeout(120_000);
    const kosumi = josekiLines().find((j) => j.id === 'komoku-kosumi')!;
    await page.goto('/#/practice/go/go-joseki?id=line:komoku-kosumi');
    await expect(page.locator('.problem-title')).toHaveText(kosumi.name);
    await expect(page.locator('svg.ib rect.ib-hit')).toHaveCount(361);
    await playLine(page, 'go', kosumi, goLessonGame, (m) => goMove(page, m));
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!');
    await noHorizontalScroll(page);

    const ask = drillMove('drill-go-joseki', goLessonGame, josekiLines(), GO_SIDES, 'go', 'stage-4', 'e2e-joseki');
    await page.goto('/#/practice/go/drill-go-joseki?seed=e2e-joseki');
    await expect(page.locator('.lesson-text')).toHaveText(ask.text);
    await goMove(page, ask.move);
    await expect(page.locator('.lesson-feedback')).toContainText('Right.');

    const lesson = josekiLessons()[0]!;
    await page.goto(`/#/learn/${lesson.id}`);
    const next = page.getByRole('button', { name: 'Next' });
    const checkpoint = lesson.steps.at(-1);
    if (checkpoint?.kind !== 'checkpoint') throw new Error('the lesson ends with a quiz');
    for (let i = 0; i < lesson.steps.length - 1; i++) {
      await expect(next).toBeEnabled({ timeout: 20_000 });
      await next.click();
    }
    for (const q of checkpoint.questions) {
      if (q.kind !== 'askMove') continue;
      await expect(page.locator('.lesson-text').last()).toHaveText(q.text);
      await goMove(page, q.accept[0] ?? '');
    }
    await next.click();
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  });
});
