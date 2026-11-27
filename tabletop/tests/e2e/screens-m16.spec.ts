/** Milestone 16 screenshots (first part): tools, the tour and the daylight look, at 844 × 390 (twice the pixels). */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m16';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

test('milestone 16 screens: tools, tour, daylight', async ({ page }) => {
  test.setTimeout(300_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/today');
  await expect(page.locator('.tour-card')).toBeVisible();
  await shot(page, '01-today-tour');
  await page.goto('/#/tools');
  await shot(page, '02-tools');
  await page.getByRole('button', { name: 'New Dominoes pad' }).click();
  const points = page.getByLabel('Points', { exact: true });
  for (const [n, side] of [
    ['85', 'Us'],
    ['120', 'Them'],
    ['45', 'Us'],
  ] as const) {
    await points.fill(n);
    await page.getByRole('button', { name: `Add to ${side}` }).click();
  }
  await shot(page, '03-dominoes-pad');
  await page.goto('/#/tools');
  await page.getByRole('button', { name: 'New Mahjong pad' }).click();
  await page.getByRole('radiogroup', { name: 'Who won' }).getByRole('radio', { name: 'South' }).click();
  await page.getByRole('radiogroup', { name: 'How' }).getByRole('radio', { name: 'On East’s discard' }).click();
  await page.getByLabel('The discarder pays').fill('8000');
  await page.getByRole('button', { name: 'Add the win' }).click();
  await shot(page, '04-mahjong-pad');
  await page.goto('/#/tools/timer');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.waitForTimeout(1500);
  await shot(page, '05-blind-timer');
  await page.goto('/#/settings');
  await page.getByRole('radio', { name: /Daylight/ }).click();
  await shot(page, '06-settings-daylight');
  await page.goto('/#/today');
  await shot(page, '07-today-daylight');
  await page.goto('/#/games');
  await shot(page, '08-games-daylight');
  await page.goto('/#/games/brisca');
  await shot(page, '09-hub-daylight');
  await page.goto('/#/tools/timer');
  await shot(page, '10-timer-daylight');
  await page.goto('/#/learn/brisca.3.senas');
  await shot(page, '11-lesson-daylight');
  await page.goto('/#/games/poker?seed=daylight');
  await page.getByRole('button', { name: /^Play/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 60_000 });
  await shot(page, '12-poker-daylight');
});
