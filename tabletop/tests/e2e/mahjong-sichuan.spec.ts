/**
 * Sichuan Bloody end to end (milestone 14c): a hand against level 1 with the exchange of three and
 * the void declaration, played on after a CPU win to its end; the void lesson; the scoring drill;
 * the Sichuan options in the play dialog; the reference card.
 */
import type { Page } from '@playwright/test';
import { expect, noHorizontalScroll, test } from './fixtures';
import { playOnToEnd, startMahjong, takeTurn } from './mahjong-helpers';

const next = (page: Page) => page.getByRole('button', { name: 'Next' }).click();

async function typeNumber(page: Page, n: number) {
  for (const d of String(n)) await page.getByRole('button', { name: d, exact: true }).click();
  await page.getByRole('button', { name: 'Check', exact: true }).click();
}

/** The answer a number question wants, by answering 0 and asking to be shown. */
async function shownAnswer(page: Page): Promise<number> {
  await typeNumber(page, 0);
  const feedback = page.locator('.lesson-feedback');
  if ((await feedback.textContent())?.includes('Yes')) return 0;
  await page.getByRole('button', { name: 'Show me' }).click();
  const [, n = '0'] = /The answer is (\d+)/.exec((await feedback.textContent()) ?? '') ?? [];
  return Number(n);
}

test.describe('mahjong: sichuan', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a hand: exchange three, declare a void, play on after a win, then the result and the review', async ({ page }) => {
    test.setTimeout(300_000);
    await startMahjong(page, { seed: 'sc-1', level: 1, preset: /^Sichuan, online/, oneHand: true });
    // The exchange of three tiles of one suit comes first.
    await expect(page.locator('.mj-pass-prompt')).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('.mj-pass-prompt')).toContainText('of one suit');
    await noHorizontalScroll(page);
    await takeTurn(page);
    // Then the void suit.
    await expect(page.locator('.mj-void-prompt')).toBeVisible({ timeout: 45_000 });
    await takeTurn(page);
    await expect(page.locator('.mj-seat[data-where="bottom"] .mj-void-mark')).toBeVisible();
    const playedOn = await playOnToEnd(page);
    await expect(page.locator('.status-turn')).toHaveText(/Game over/);
    // A player won and the hand went on.
    expect(playedOn).toBe(true);
    const result = page.locator('.mj-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText(/won/);
    await expect(result.locator('.mj-faan-total').first()).toContainText(/fan/);
    await expect(result.locator('.mj-pay')).toContainText('You');
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.moments')).toBeVisible({ timeout: 120_000 });
    await noHorizontalScroll(page);
  });

  test('the void lesson: only the void suit may be thrown', async ({ page }) => {
    await page.goto('/#/learn/mahjong.4.sichuan-void');
    await next(page);
    // Only the three bamboo tiles can be thrown.
    await expect(page.locator('button.mj-tile')).toHaveCount(3);
    await expect(page.locator('.mj-centre-tip')).toContainText(/bamboo/);
    const tile = page.locator('button.mj-tile').first();
    await tile.click();
    await tile.click();
    await expect(page.locator('.lesson-feedback')).toContainText('Your other bamboo goes next');
    await next(page);
    await page.getByRole('button', { name: /A flower pig/ }).click();
    await next(page);
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
    await noHorizontalScroll(page);
  });

  test('the drill: count the fan, then what you collect', async ({ page }) => {
    await page.goto('/#/practice/mahjong/drill-mahjong-sichuan-fan?seed=e2e');
    await expect(page.locator('.lesson-text')).toContainText('How many fan is it worth?');
    await shownAnswer(page);
    await next(page);
    const total = await shownAnswer(page);
    expect(total).toBeGreaterThan(0);
    await next(page);
    await page.getByRole('button', { name: /^Win/ }).first().click();
    await expect(page.locator('.mj-won-mark')).toBeVisible();
    await next(page);
    await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible();
  });

  test('the play dialog offers the Sichuan options; the reference card has its fan table', async ({ page }) => {
    await page.goto('/#/games/mahjong');
    await page.getByRole('button', { name: /^Play/ }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('radio', { name: 'Sichuan, Chengdu table' }).click();
    await dialog.getByRole('button', { name: 'Change the rules' }).click();
    await expect(dialog.getByRole('radiogroup', { name: 'Fan cap' })).toBeVisible();
    await expect(dialog.getByRole('radiogroup', { name: 'Exchange three tiles' })).toBeVisible();
    await expect(dialog.getByRole('radiogroup', { name: /Red fives/ })).toHaveCount(0);
    await noHorizontalScroll(page);
    await page.goto('/#/games/mahjong/reference');
    await expect(page.getByRole('heading', { name: 'Sichuan fan' })).toBeVisible();
    await expect(page.getByText('One suit (qīng yī sè): 2')).toBeVisible();
    await noHorizontalScroll(page);
  });
});
