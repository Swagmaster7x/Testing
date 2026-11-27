/** Milestone 2 screenshots: the learning loop on chess at 844 × 390 (twice the pixels). */
import type { Page } from '@playwright/test';
import { move, startChess } from './chess-helpers';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m2';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

test('milestone 2 screens: learn, practice, review, today, progress', async ({ page }) => {
  test.setTimeout(300_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // Focus on chess, so Today builds a session.
  await page.goto('/#/games/chess');
  await page.getByRole('button', { name: 'Add to focus' }).click();
  await expect(page.locator('.door')).toHaveCount(4);
  await expect(page.locator('.toast')).toHaveCount(0, { timeout: 10_000 });
  await shot(page, '01-chess-hub-doors');

  // Learn: the door, a lesson in progress, a choice, the number pad and the end of a lesson.
  await page.goto('/#/learn/chess.1.rook');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: '1', exact: true }).click();
  await page.getByRole('button', { name: '4', exact: true }).click();
  await shot(page, '03-lesson-count');
  await page.getByRole('button', { name: 'Check' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await move(page, 'd1d6');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  await shot(page, '05-lesson-complete');

  await page.goto('/#/learn/chess.3.fork');
  await page.getByRole('button', { name: 'Next' }).click();
  await move(page, 'd5c7');
  await expect(page.locator('.lesson-feedback')).toContainText('forks king and rook');
  await shot(page, '04-lesson-fork');

  await page.goto('/#/learn/chess.0.mate');
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled({ timeout: 15_000 });
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: /^No, White was always winning/ }).click();
  await shot(page, '06-lesson-choice');

  await page.goto('/#/games/chess/learn');
  await page.getByRole('radio', { name: 'Strategy' }).click();
  await shot(page, '02-learn-door');

  // Practice: the door, a problem, a hint, solved, a drill.
  await page.goto('/#/practice/chess/mates?id=lichess:01YDB');
  await expect(page.getByText('Your move. Find the best move for Black.')).toBeVisible();
  await page.getByRole('button', { name: 'Hint' }).click();
  await page.getByRole('button', { name: 'Another hint' }).click();
  await shot(page, '08-problem-hint');
  await move(page, 'a1h1');
  await expect(page.locator('.lesson-feedback')).toContainText('Solved!');
  await page.getByRole('button', { name: 'Add to my practice' }).click();
  await shot(page, '09-problem-solved');
  await page.goto('/#/practice/chess/tactics?theme=fork');
  await expect(page.getByText(/Your move\. Find the best move for (White|Black)\./)).toBeVisible();
  await shot(page, '10-problem-fork');
  await page.goto('/#/practice/chess/drill-count?seed=shots');
  await page.getByRole('button', { name: '1', exact: true }).click();
  await shot(page, '11-drill-count');
  await page.goto('/#/practice/chess/drill-mates?seed=shots');
  await expect(page.getByText(/Moves left/)).toBeVisible();
  await shot(page, '12-drill-basic-mate');
  await page.goto('/#/games/chess/practice');
  await expect(page.getByText('1 due')).toBeVisible();
  await shot(page, '07-practice-door');

  // A game with mistakes, its review and key moments.
  await startChess(page, { seed: 'shots-review', level: 1 });
  await move(page, 'f2f3');
  await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
  await move(page, 'g2g4');
  await expect(page.locator('.status-turn')).toHaveText(/Your move|Game over/, { timeout: 30_000 });
  if ((await page.locator('.status-turn').textContent())?.includes('Your move')) {
    await page.locator('.table-side').getByRole('button', { name: 'Resign' }).click();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Resign' }).click();
  }
  await page.getByRole('link', { name: 'Review' }).click();
  await expect(page.locator('.moments')).toBeVisible({ timeout: 60_000 });
  await page.locator('.moment-list a').first().click();
  await expect(page.locator('.moment-card')).toBeVisible();
  await shot(page, '13-review-key-moment');

  // The Play dialog's suggested level, Today and Progress.
  await page.goto('/#/games/chess');
  await page.getByRole('button', { name: /^Play/ }).click();
  await expect(page.getByText(/Suggested: level/)).toBeVisible();
  await shot(page, '14-play-suggested-level');
  await page.keyboard.press('Escape');
  await page.goto('/#/today');
  await expect(page.locator('.session-row').first()).toBeVisible();
  await shot(page, '15-today-session');
  await page.goto('/#/progress');
  await expect(page.locator('.stage-bars')).toBeVisible();
  await shot(page, '16-progress');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.locator('.screen').evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await shot(page, '17-progress-checklist');
});
