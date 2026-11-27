/** Milestone 5 screenshots: Texas Hold'em at 844 × 390 (twice the pixels). */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m5';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

/** Your turn: check if free, else call; now and then raise with a preset. */
async function playSomething(page: Page, raise = false) {
  const controls = page.locator('.bet-controls');
  if (raise && (await controls.locator('.bet-raise').count()) > 0) {
    await controls.locator('.bet-raise').click();
    await controls.locator('.bet-presets .btn').first().click();
    await controls.locator('.bet-raise').click();
    return;
  }
  await controls.locator('.bet-call').click();
}

async function startGame(page: Page, seed: string, level: string, preset?: RegExp) {
  await page.goto(`/#/games/poker?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: level, exact: true }).click();
  if (preset) await dialog.getByRole('radio', { name: preset }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

test('milestone 5 screens: hold’em', async ({ page }) => {
  test.setTimeout(400_000);

  await page.goto('/#/games/poker?seed=shots-m5');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '01-poker-hub');
  await page.getByRole('button', { name: /^Play/ }).click();
  await page.getByRole('button', { name: 'Change the rules' }).click();
  await shot(page, '02-poker-rules-at-this-table');
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startGame(page, 'shots-m5', '3');
  const turn = page.locator('.status-turn');
  await expect(turn).toHaveText(/Your move/, { timeout: 60_000 });
  await shot(page, '03-poker-table');
  await page.locator('.bet-raise').click();
  await shot(page, '04-poker-bet-sizing');
  await page.locator('.bet-cancel').click();
  for (let i = 0; i < 4; i++) {
    await playSomething(page, i === 1);
    await expect(turn).toHaveText(/Your move|Game over/, { timeout: 60_000 });
  }
  await shot(page, '05-poker-later');
});
