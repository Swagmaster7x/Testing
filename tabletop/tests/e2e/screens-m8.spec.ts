/** Milestone 8 screenshots: shogi at 844 × 390 (twice the pixels). */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';
import { hand, play, playWithEngine, square, startShogi } from './shogi-helpers';

const DIR = 'screenshots/m8';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

interface ProblemFile {
  readonly problems: readonly { readonly id: string; readonly line: readonly string[]; readonly themes: readonly string[] }[];
}
const problems = (JSON.parse(readFileSync(join(import.meta.dirname, '../../src/games/shogi/practice/problems.json'), 'utf8')) as ProblemFile).problems;

test('milestone 8 screens: shogi table, faces, lessons, practice, review, reference', async ({ page }) => {
  test.setTimeout(420_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/#/games/shogi');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '01-shogi-hub');

  await page.getByRole('button', { name: /^Play/ }).click();
  await page.getByRole('dialog').locator('#play-preset').selectOption('handicap-rook');
  await shot(page, '02-new-game-presets');
  await page.keyboard.press('Escape');

  // A game in progress: hands filled, last move shown.
  await startShogi(page, { seed: 'm8-shots', level: 1 });
  await shot(page, '03-table-start');
  await playWithEngine(page, { maxPlies: 9, nodes: 15_000 });
  await expect(page.locator('.status-turn')).toHaveText(/Your move|Game over/, { timeout: 30_000 });
  await shot(page, '04-table-midgame');

  // Faces: two kanji, then symbols with learner marks.
  await page.getByRole('radiogroup', { name: 'Piece faces' }).getByRole('radio', { name: '2 kanji' }).click();
  await shot(page, '06-two-kanji');
  await page.getByRole('radiogroup', { name: 'Piece faces' }).getByRole('radio', { name: 'Symbols' }).click();
  await page.getByRole('switch', { name: 'Movement marks' }).click();
  await shot(page, '07-symbols-marks');
  await page.getByRole('switch', { name: 'Movement marks' }).click();
  await page.getByRole('radiogroup', { name: 'Piece faces' }).getByRole('radio', { name: '1 kanji' }).click();

  // After a bishop exchange: the bishop in hand selected, with every square it may be dropped on.
  await startShogi(page, { seed: 'm8-drop', fen: 'lnsgkg1nl/1r5s1/pppppp1pp/6p2/9/2P6/PP1PPPPPP/7R1/LNSGKGSNL b Bb 1' });
  await hand(page, 'Sente').getByRole('button', { name: /^bishop in hand/ }).click();
  await shot(page, '05-drop-selected');

  // Refusals and the promotion prompt.
  await startShogi(page, { seed: 'm8-nifu', fen: '4k4/9/9/9/9/9/4P4/9/4K4 b P 1' });
  await hand(page, 'Sente').getByRole('button', { name: /^pawn in hand/ }).click();
  await square(page, '55').click();
  await expect(page.locator('.shogi-note')).toBeVisible();
  await shot(page, '08-nifu-refused');
  await startShogi(page, { seed: 'm8-promo', fen: '4k4/9/9/4S4/9/9/9/9/4K4 b - 1' });
  await square(page, '54').click();
  await square(page, '53').click();
  await expect(page.getByRole('button', { name: 'Promote', exact: true })).toBeVisible();
  await shot(page, '09-promotion-prompt');

  // Mini-shogi from the presets.
  await startShogi(page, { seed: 'm8-mini', preset: 'mini' });
  await play(page, '5453');
  await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 15_000 });
  await shot(page, '10-mini-shogi');

  // Learn: the door, a lesson on the small board, a lesson on the full board.
  await page.goto('/#/games/shogi/learn');
  await shot(page, '11-learn-door');
  await page.goto('/#/learn/shogi.1.silver');
  await page.getByRole('button', { name: 'Next' }).click();
  await shot(page, '12-lesson-silver');
  await page.goto('/#/learn/shogi.2.tsume');
  await page.getByRole('button', { name: 'Next' }).click();
  await play(page, 'G*22');
  await expect(page.locator('.lesson-feedback')).toBeVisible();
  await shot(page, '13-lesson-tsume');
  await page.goto('/#/learn/shogi.3.mino');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled({ timeout: 20_000 });
  await shot(page, '14-lesson-mino');

  // Practice: the door, a mate problem with a hint, a drill.
  await page.goto('/#/games/shogi/practice');
  await shot(page, '15-practice-door');
  const problem = problems.find((p) => p.themes.includes('shogi-mate3')) ?? problems[0];
  if (problem) {
    await page.goto(`/#/practice/shogi/shogi-mate3?id=${encodeURIComponent(problem.id)}`);
    await expect(page.locator('.lesson-text')).toContainText('Your move.', { timeout: 15_000 });
    await page.getByRole('button', { name: 'Hint' }).click();
    await shot(page, '16-problem-hint');
  }
  await page.goto('/#/practice/shogi/drill-shogi-castles?seed=m8');
  await expect(page.locator('.lesson-text')).toBeVisible();
  await shot(page, '17-drill-castles');

  // Review of a finished game, with key moments.
  await startShogi(page, { seed: 'm8-review', level: 1 });
  await playWithEngine(page, { nodes: 8_000 });
  await page.getByRole('link', { name: 'Review' }).click();
  await expect(page.locator('.moments')).toBeVisible({ timeout: 120_000 });
  const first = page.locator('.moment-list a').first();
  if ((await first.count()) > 0) await first.click();
  await shot(page, '18-review');

  await page.goto('/#/games/shogi/reference');
  await shot(page, '19-reference');
});
