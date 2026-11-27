/**
 * Dominoes styles end to end (milestone 14, first part): a whole All Fives match against level 1
 * and its review, a Cuban double-nine hand, and an All Fives lesson, at every screen size.
 */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

async function startGame(page: Page, seed: string, preset: RegExp, oneHand: boolean) {
  await page.goto(`/#/games/dominoes?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: '1', exact: true }).click();
  await dialog.getByRole('radio', { name: preset }).click();
  if (oneHand) {
    await dialog.getByRole('button', { name: 'Change the rules' }).click();
    await dialog.getByRole('radiogroup', { name: 'Play to' }).getByRole('radio', { name: 'One hand' }).click();
  }
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

/** Plays your turns (the first tile that fits, on the first marked end; or draw, or pass) until the game is over. */
async function playToTheEnd(page: Page, turns: number): Promise<number> {
  const turn = page.locator('.status-turn');
  let played = 0;
  for (; played < turns; played++) {
    await expect(turn).toHaveText(/Your move|Game over/, { timeout: 60_000 });
    if ((await turn.textContent())?.includes('Game over')) return played;
    const knock = page.locator('.knock-btn');
    if (await knock.isVisible()) {
      await knock.click();
    } else {
      const tile = page.locator('button.table-tile').first();
      await tile.click();
      const ends = page.locator('button.line-end');
      if ((await ends.count()) > 0) await ends.first().click();
      else await tile.click();
    }
    await page.waitForTimeout(80);
  }
  throw new Error(`The game was not over after ${turns} turns`);
}

test.describe('dominoes styles', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a whole All Fives match against level 1 to the end, then reviews it', async ({ page }) => {
    test.setTimeout(600_000);
    await startGame(page, 'e2e-all-fives', /^All Fives \(two players\)/, false);
    await expect(page.locator('.status-turn')).toHaveText(/Your move|Game over/, { timeout: 60_000 });
    const played = await playToTheEnd(page, 400);
    expect(played).toBeGreaterThan(5);
    await expect(page.locator('.result-card h2')).toHaveText(/You win|The CPU wins|Draw|win|lose/i);
    // Somebody reached 250: the score is in the counters.
    const score = await page.locator('.counters, .facts').first().textContent();
    expect(score ?? '').toMatch(/\d/);
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.moments')).toBeVisible({ timeout: 240_000 });
    await expect(page.locator('.accuracy')).toContainText('You:');
  });

  test('plays a Cuban double-nine hand to the end', async ({ page }) => {
    test.setTimeout(300_000);
    await startGame(page, 'e2e-cuban', /^Cuban double nine/, true);
    await expect(page.locator('.status-turn')).toHaveText(/Your move|Game over/, { timeout: 60_000 });
    // Fifteen tiles sleep, and the tiles go up to nine.
    await expect(page.locator('.yard-tag')).toHaveText(/15/);
    const labels = await page.locator('.table-tile[aria-label]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''));
    expect(labels.some((l) => /[789]/.test(l))).toBe(true);
    await playToTheEnd(page, 30);
    await expect(page.locator('.result-card h2')).toHaveText(/You win|The CPU wins|Draw|win|lose/i);
  });

  test('finishes an All Fives lesson: the end of a hand, rounded to five', async ({ page }) => {
    await page.goto('/#/learn/dominoes.4.fives-end');
    await page.getByRole('button', { name: 'Next' }).click();
    const tile = page.getByRole('button', { name: '3-6', exact: true });
    await tile.click();
    await tile.click();
    await expect(page.locator('.lesson-feedback')).toContainText('Out!');
    await page.getByRole('button', { name: 'Next' }).click();
    // The other player holds the 1-2 and the 2-4: nine pips, rounded to ten.
    await page.getByRole('button', { name: '1', exact: true }).click();
    await page.getByRole('button', { name: '0', exact: true }).click();
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Yes');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  });
});
