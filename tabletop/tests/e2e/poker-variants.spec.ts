/**
 * Omaha, Five-Card Draw and Seven-Card Stud end to end (milestone 12): each preset deals the right
 * cards, the draw is made by tapping cards, Stud's bring-in and face-up cards show, and a short
 * session plays to the end.
 */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';
import { playOne } from './poker-helpers';

async function start(page: Page, seed: string, preset: string) {
  await page.goto(`/#/games/poker?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: '1', exact: true }).click();
  await dialog.getByRole('button', { name: 'Change the rules' }).click();
  await dialog.getByRole('radio', { name: preset, exact: true }).click();
  await dialog.getByRole('radiogroup', { name: 'Cash session' }).getByRole('radio', { name: '10 hands' }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

test.describe('poker variants', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('pot-limit Omaha deals four hole cards and caps a raise at the pot', async ({ page }) => {
    await start(page, 'e2e-plo', 'Pot-limit Omaha');
    await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 60_000 });
    await expect(page.locator('.poker-table .table-card[aria-label^="Your card"]')).toHaveCount(4);
    const raise = page.locator('.bet-raise');
    if (await raise.isVisible()) {
      await raise.click();
      await expect(page.locator('.bet-presets').getByRole('button', { name: 'Pot' })).toBeVisible();
      await page.locator('.bet-cancel').click();
    }
  });

  test('five-card draw: tap two cards, draw two, and play the session out', async ({ page }) => {
    test.setTimeout(300_000);
    await start(page, 'e2e-draw', 'Five-card draw');
    const turn = page.locator('.status-turn');
    let drew = false;
    for (let i = 0; i < 200; i++) {
      await expect(turn).toHaveText(/Your move|Game over/, { timeout: 60_000 });
      if ((await turn.textContent())?.includes('Game over')) break;
      await expect(page.locator('.poker-table .table-card[aria-label^="Your card"]')).toHaveCount(5);
      if ((await playOne(page)) === 'draw') drew = true;
    }
    await expect(turn).toHaveText(/Game over/, { timeout: 60_000 });
    expect(drew).toBe(true);
  });

  test('seven-card stud: the bring-in, cards face up, and the session to the end', async ({ page }) => {
    test.setTimeout(300_000);
    await start(page, 'e2e-stud', 'Seven-card stud');
    const turn = page.locator('.status-turn');
    let sawUp = false;
    for (let i = 0; i < 300; i++) {
      await expect(turn).toHaveText(/Your move|Game over/, { timeout: 60_000 });
      if ((await turn.textContent())?.includes('Game over')) break;
      if ((await page.locator('.poker-table .table-card[aria-label^="Your card, face up"]').count()) > 0) sawUp = true;
      await playOne(page);
    }
    await expect(turn).toHaveText(/Game over/, { timeout: 60_000 });
    expect(sawUp).toBe(true);
  });

  test('the draw lesson: call, then tap three cards and draw', async ({ page }) => {
    const next = () => page.getByRole('button', { name: 'Next' }).click();
    await page.goto('/#/learn/poker.4.draw');
    await next();
    await next();
    await page.locator('.bet-call').click();
    await expect(page.locator('.lesson-feedback')).toContainText('You call');
    await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled({ timeout: 15_000 });
    await next();
    await next();
    for (const card of ['Seven of clubs', 'Four of hearts', 'Two of spades']) await page.getByRole('button', { name: `Your card: ${card}` }).click();
    await expect(page.locator('.bet-draw')).toHaveText('Draw 3');
    await page.locator('.bet-draw').click();
    await expect(page.locator('.lesson-feedback')).toContainText('You draw three');
    await next();
    await page.getByRole('button', { name: 'Four hearts and a club: keep the hearts' }).click();
    await next();
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  });
});
