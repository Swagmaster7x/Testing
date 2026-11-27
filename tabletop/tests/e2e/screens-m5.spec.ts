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

async function startGame(page: Page, seed: string, level: string, preset?: string) {
  await page.goto(`/#/games/poker?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: level, exact: true }).click();
  if (preset) {
    await dialog.getByRole('button', { name: 'Change the rules' }).click();
    await dialog.getByRole('radio', { name: preset, exact: true }).click();
  }
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
  // Play on to a flop, then switch the coach's helps on.
  for (let i = 0; i < 12; i++) {
    if ((await page.locator('.poker-table .table-card[aria-label]:not([aria-label^="Your card"])').count()) >= 3) break;
    await playSomething(page);
    await expect(turn).toHaveText(/Your move|Game over/, { timeout: 60_000 });
  }
  for (const help of ['Pot odds', 'Outs', 'Name my hand', 'Positions', 'Session statistics']) await page.getByRole('switch', { name: help }).click();
  await page.locator('.poker-coach').scrollIntoViewIfNeeded();
  await shot(page, '05-poker-coach-helps');
  await page.getByRole('switch', { name: 'Preflop chart' }).click();
  await page.locator('.preflop-chart').evaluate((el) => el.previousElementSibling?.scrollIntoView({ block: 'start' }));
  await shot(page, '06-poker-preflop-chart');
  await page.getByRole('switch', { name: 'Preflop chart' }).click();
  await page.getByRole('switch', { name: 'Session statistics' }).click();
  // A hand's end, with motion on, to see the showdown.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (let i = 0; i < 200; i++) {
    if (await page.locator('.poker-hand-over').isVisible()) break;
    if ((await turn.textContent())?.includes('Your move') && (await page.locator('.bet-call').isVisible())) await playSomething(page);
    await page.waitForTimeout(150);
  }
  await expect(page.locator('.poker-hand-over')).toBeVisible({ timeout: 60_000 });
  await shot(page, '07-poker-hand-over');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startGame(page, 'shots-m5-hu', '4', 'Heads-up');
  await expect(turn).toHaveText(/Your move/, { timeout: 60_000 });
  await shot(page, '08-poker-heads-up');

  await startGame(page, 'shots-m5-sng', '5', 'Sit-and-go');
  await expect(turn).toHaveText(/Your move/, { timeout: 60_000 });
  await shot(page, '09-poker-sit-and-go');

  // A short session to the end: the styles are revealed, then the review.
  await page.goto('/#/games/poker?seed=shots-m5-end');
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: '1', exact: true }).click();
  await dialog.getByRole('button', { name: 'Change the rules' }).click();
  await dialog.getByRole('radio', { name: '6-max cash', exact: true }).click();
  await dialog.getByRole('radiogroup', { name: 'Cash session' }).getByRole('radio', { name: '10 hands' }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  for (let i = 0; i < 200; i++) {
    await expect(turn).toHaveText(/Your move|Game over/, { timeout: 60_000 });
    if ((await turn.textContent())?.includes('Game over')) break;
    await playSomething(page);
  }
  await page.waitForTimeout(500);
  await shot(page, '10-poker-session-over');
  await page.getByRole('link', { name: 'Review' }).click();
  await expect(page.locator('.moments')).toBeVisible({ timeout: 180_000 });
  const moment = page.locator('.moment-list a').first();
  if (await moment.isVisible()) await moment.click();
  await shot(page, '11-poker-review');

  await page.goto('/#/games/poker/reference');
  await shot(page, '12-poker-reference');
});
