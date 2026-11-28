/**
 * Screenshots to look at before finishing a milestone, and to send. Phone landscape at
 * 844 × 390 (twice the pixels), plus portrait, tablet and laptop for comparison.
 * Written to screenshots/m0/.
 */
import type { Page } from '@playwright/test';
import { expect, playToEnd, startFixtureGame, test } from './fixtures';

const DIR = 'screenshots/m0';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

test('milestone 0 screens', async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/#/games/chess');
  await page.getByRole('button', { name: 'Add to focus' }).click();
  await page.goto('/#/games/brisca');
  await page.getByRole('button', { name: 'Add to focus' }).click();
  await page.waitForTimeout(3500); // let the notice fade
  await page.goto('/#/today');
  await expect(page.locator('.focus-row')).toHaveCount(2);
  await shot(page, '01-today');

  await page.goto('/#/games');
  // The eight launch games, and every game added since.
  await expect(page.locator('.tile').nth(7)).toBeVisible();
  await shot(page, '02-games');

  await page.goto('/#/games/chess');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '03-hub-chess-coming');

  await page.goto('/#/games/noughts?seed=shots-1');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '04-hub-test-table');
  await page.getByRole('button', { name: /^Play/ }).click();
  await page.getByRole('dialog').getByRole('radio', { name: '2', exact: true }).click();
  await shot(page, '05-new-game');
  await page.getByRole('dialog').getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.locator('.status-turn')).toHaveText('Your move');
  await page.getByRole('button', { name: 'b2, empty', exact: true }).click();
  await expect(page.locator('.status-turn')).toHaveText('Your move');
  await page.getByRole('button', { name: 'a3, empty', exact: true }).click();
  await expect(page.locator('.status-turn')).toHaveText('Your move');
  await shot(page, '06-table-mid-game');
  await playToEnd(page);
  await expect(page.locator('.result-card')).toBeVisible();
  await shot(page, '07-table-game-over');

  await page.getByRole('link', { name: 'Review' }).click();
  await page.getByRole('button', { name: 'First position' }).click();
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Next move' }).click();
  await expect(page.locator('.ply-label')).toHaveText(/Move 3 of/);
  await shot(page, '08-review');

  await page.goto('/#/games/noughts/reference');
  await expect(page.getByRole('heading', { name: 'Rules' })).toBeVisible();
  await shot(page, '09-reference');

  await page.goto('/#/progress');
  await shot(page, '10-progress');
  await page.goto('/#/tools');
  await shot(page, '11-tools');
  await page.goto('/#/settings');
  await shot(page, '12-settings');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/games');
  await shot(page, '13-portrait-games');

  await page.setViewportSize({ width: 1180, height: 820 });
  await startFixtureGame(page, { seed: 'shots-2', level: 3, side: 'X, moves first' });
  await page.getByRole('button', { name: 'b2, empty', exact: true }).click();
  await expect(page.locator('.status-turn')).toHaveText('Your move');
  await shot(page, '14-tablet-table');

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/games');
  await shot(page, '15-laptop-games');
});
