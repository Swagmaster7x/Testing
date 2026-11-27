/** Milestone 4 screenshots: Dominoes at 844 × 390 (twice the pixels). */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m4';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

/** Your turn: play the first tile that can go (on the first marked end), or pass. */
async function playSomething(page: Page) {
  const knock = page.locator('.knock-btn');
  if (await knock.isVisible()) return knock.click();
  const tile = page.locator('button.table-tile').first();
  await tile.click();
  const ends = page.locator('button.line-end');
  if ((await ends.count()) > 0) await ends.first().click();
  else await tile.click();
}

async function startGame(page: Page, seed: string, preset?: RegExp) {
  await page.goto(`/#/games/dominoes?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: '3', exact: true }).click();
  if (preset) await dialog.getByRole('radio', { name: preset }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

test('milestone 4 screens: dominoes', async ({ page }) => {
  test.setTimeout(400_000);

  await page.goto('/#/games/dominoes?seed=shots-m4');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '01-dominoes-hub');
  await page.getByRole('button', { name: /^Play/ }).click();
  await page.getByRole('button', { name: 'Change the rules' }).click();
  await shot(page, '02-dominoes-rules-at-this-table');
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startGame(page, 'shots-m4');
  const turn = page.locator('.status-turn');
  await expect(turn).toHaveText(/Your move/, { timeout: 30_000 });
  await shot(page, '03-dominoes-table');
  for (let i = 0; i < 3; i++) {
    await playSomething(page);
    await expect(turn).toHaveText(/Your move|Game over/, { timeout: 30_000 });
  }
  const tile = page.locator('button.table-tile').first();
  if (await tile.isVisible()) {
    await tile.click();
    await shot(page, '04-dominoes-tile-lifted');
    await tile.click();
  }
  await page.getByRole('switch', { name: 'Tiles out and numbers left' }).click();
  await page.getByRole('switch', { name: 'What each player cannot have' }).click();
  await page.getByRole('switch', { name: 'Pip totals' }).click();
  await expect(turn).toHaveText(/Your move|Game over/, { timeout: 30_000 });
  // On a phone the trackers sit lower in the rail: bring them into view.
  await page.locator('.tiles-out').scrollIntoViewIfNeeded();
  await shot(page, '05-dominoes-coach-helps');
  // Play on until a hand ends, with motion on, to see the hands shown at the end.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (let i = 0; i < 12; i++) {
    if (await page.locator('.domino-hand-over').isVisible()) break;
    if ((await turn.textContent())?.includes('Your move')) await playSomething(page);
    await page.waitForTimeout(600);
  }
  await expect(page.locator('.domino-hand-over')).toBeVisible({ timeout: 30_000 });
  await page.waitForTimeout(500);
  await shot(page, '06-dominoes-hand-over');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startGame(page, 'shots-m4-draw', /^Draw/);
  await expect(turn).toHaveText(/Your move/, { timeout: 30_000 });
  for (let i = 0; i < 4; i++) {
    await playSomething(page);
    await expect(turn).toHaveText(/Your move|Game over/, { timeout: 30_000 });
  }
  await shot(page, '07-dominoes-draw-game');

  await page.goto('/#/games/dominoes/learn');
  await page.getByRole('radio', { name: 'Strategy' }).click();
  await shot(page, '08-dominoes-learn');
  await page.goto('/#/learn/dominoes.2.partner');
  await page.getByRole('button', { name: 'Next' }).click();
  await shot(page, '09-dominoes-lesson-partner');
  await page.goto('/#/learn/dominoes.1.out');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: '1-2', exact: true }).click();
  await page.getByRole('button', { name: '1-2', exact: true }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await shot(page, '10-dominoes-lesson-blocked-open-hand');

  await page.goto('/#/games/dominoes/practice');
  await shot(page, '11-dominoes-practice');
  await page.goto('/#/practice/dominoes/endgames');
  await expect(page.getByText('Your turn. Find the best play.')).toBeVisible({ timeout: 15_000 });
  await shot(page, '12-dominoes-endgame-problem');
  await page.goto('/#/practice/dominoes/drill-cant-have?seed=shots');
  await expect(page.locator('.lesson-text')).toBeVisible();
  await shot(page, '13-dominoes-drill-cant-have');

  await page.goto('/#/games/dominoes/reference');
  await shot(page, '14-dominoes-reference');
});
