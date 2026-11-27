/** Milestone 6 screenshots: Go at 844 × 390 (twice the pixels). */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';
import { goProblems, playGoToEnd, point, startGo } from './go-helpers';

const DIR = 'screenshots/m6';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

test('milestone 6 screens: Go to play, learn, practise and review', async ({ page }) => {
  test.setTimeout(600_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/#/games');
  await shot(page, '01-games-shelf');
  await page.goto('/#/games/go');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '02-go-hub');

  // The New game dialog with the rules at this table.
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'Board' }).scrollIntoViewIfNeeded();
  await shot(page, '03-new-game-rules');
  await dialog.locator('details summary').click();
  await dialog.locator('details').scrollIntoViewIfNeeded();
  await shot(page, '04-new-game-all-rules');
  await page.keyboard.press('Escape');

  // A 9×9 game in progress, then the coach's helps.
  await startGo(page, { seed: 'shots-go', level: 2, size: 9 });
  for (const name of ['E5', 'C3', 'G7', 'C7']) {
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
    const cell = point(page, name);
    if ((await cell.getAttribute('aria-label'))?.endsWith('empty')) await cell.click();
  }
  await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
  await shot(page, '05-table-9x9');
  await page.getByRole('switch', { name: 'Liberty counts' }).click();
  await page.getByRole('switch', { name: 'Atari warning' }).click();
  await page.getByRole('switch', { name: 'Territory estimate' }).click();
  await expect(page.locator('.coach-line')).toContainText('Estimate', { timeout: 30_000 });
  await shot(page, '06-table-helps');
  await page.getByRole('button', { name: 'Hint' }).click();
  await expect(page.locator('.hint-steps li')).toHaveCount(1, { timeout: 30_000 });
  await page.getByRole('button', { name: 'Tell me more' }).click();
  await shot(page, '07-table-hint');
  for (const id of ['Liberty counts', 'Atari warning', 'Territory estimate']) await page.getByRole('switch', { name: id }).click();

  // Play it out and count.
  await playGoToEnd(page, ['G3', 'E3', 'E7', 'C5', 'G5', 'D4', 'F6', 'D6', 'F4']);
  await expect(page.locator('.result-card')).toBeVisible();
  await shot(page, '09-game-over');

  // The review with key moments.
  await page.getByRole('link', { name: 'Review' }).click();
  await expect(page.locator('.moments .accuracy')).toBeVisible({ timeout: 180_000 });
  const moment = page.locator('.moment-list a').first();
  if ((await moment.count()) > 0) await moment.click();
  await shot(page, '10-review');

  // Counting: a game ends with dead stones to mark.
  await page.goto('/#/learn/go.table.area');
  await page.getByRole('button', { name: 'Next' }).click();
  await shot(page, '08-counting');

  // 13×13 and 19×19 with handicap.
  await startGo(page, { seed: 'shots-go-13', level: 3, size: 13, preset: 'Japanese (territory)' });
  await point(page, 'D4').click();
  await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
  await point(page, 'K10').click();
  await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
  await shot(page, '11-table-13x13');
  await startGo(page, { seed: 'shots-go-19', level: 1, size: 19, preset: 'Japanese (territory)', handicap: 5 });
  await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
  await shot(page, '12-table-19x19-handicap');

  // Learn: the door, Capture-Go, a ladder, the eyes, the handicap lesson.
  await page.goto('/#/games/go/learn');
  await shot(page, '13-learn-door');
  await page.goto('/#/learn/go.0.capture-go');
  await page.getByRole('button', { name: 'Next' }).click();
  await shot(page, '14-lesson-capture-go');
  await page.goto('/#/learn/go.2.ladder');
  await page.getByRole('button', { name: 'Next' }).click();
  await point(page, 'C4').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled({ timeout: 30_000 });
  await shot(page, '15-lesson-ladder');
  await page.goto('/#/learn/go.2.two-eyes');
  await page.getByRole('button', { name: 'Next' }).click();
  await point(page, 'A1').click();
  await shot(page, '16-lesson-two-eyes-wrong');

  // Practice: the door, a problem with a hint, a ladder solved, life and death, the count drill.
  await page.goto('/#/games/go/practice');
  await shot(page, '17-practice-door');
  const problems = goProblems();
  const capture = problems.find((p) => p.themes.includes('go-capture') && !p.themes.includes('go-ladder'));
  const life = problems.find((p) => p.themes.includes('go-live') || p.themes.includes('go-kill'));
  if (capture) {
    await page.goto(`/#/practice/go/go-capture?id=${encodeURIComponent(capture.id)}`);
    await page.getByRole('button', { name: 'Hint' }).click();
    await shot(page, '18-problem-hint');
  }
  if (life) {
    await page.goto(`/#/practice/go/go-life?id=${encodeURIComponent(life.id)}`);
    await shot(page, '19-problem-life');
  }
  await page.goto('/#/practice/go/drill-go-count?seed=shots');
  await shot(page, '20-drill-count');

  await page.goto('/#/games/go/reference');
  await shot(page, '21-reference');

  // Stage 3: the net, in a lesson and as a problem.
  await page.goto('/#/learn/go.3.net');
  await page.getByRole('button', { name: 'Next' }).click();
  await point(page, 'E5').click();
  await expect(page.locator('.lesson-feedback')).toContainText('net');
  await shot(page, '22-lesson-net');
  const net = problems.find((p) => p.id.startsWith('go:net:'));
  if (net) {
    await page.goto(`/#/practice/go/go-ladders?id=${encodeURIComponent(net.id)}`);
    await shot(page, '23-problem-net');
  }
});
