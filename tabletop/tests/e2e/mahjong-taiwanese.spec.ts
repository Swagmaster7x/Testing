/**
 * Taiwanese end to end (milestone 14b): a 16-tile hand against level 2 to its end, with the tai or
 * the drawn hand, then the review; an accessibility scan of the table; the dealer lesson; the tai
 * drill; the rules dialog with the Taiwanese options; the reference card.
 */
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, noHorizontalScroll, test } from './fixtures';
import { playToEnd, startMahjong } from './mahjong-helpers';

const next = (page: Page) => page.getByRole('button', { name: 'Next' }).click();

async function typeNumber(page: Page, n: number) {
  for (const d of String(n)) await page.getByRole('button', { name: d, exact: true }).click();
  await page.getByRole('button', { name: 'Check', exact: true }).click();
}

test.describe('mahjong: taiwanese', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a 16-tile hand against level 2 to the end, shows the tai or the drawn hand, then reviews it', async ({ page }) => {
    test.setTimeout(300_000);
    await startMahjong(page, { seed: 'e2e-tw', level: 2, preset: /^Taiwanese, one hand/ });
    await expect(page.locator('button.mj-tile').first()).toBeVisible({ timeout: 45_000 });
    // Sixteen tiles in hand, or seventeen when it is your turn to throw.
    expect([16, 17]).toContain(await page.locator('button.mj-tile').count());
    await noHorizontalScroll(page);
    await playToEnd(page, 'drawn', 120);
    await expect(page.locator('.status-turn')).toHaveText(/Game over/);
    const result = page.locator('.mj-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText(/won|drawn hand/);
    if (/won/.test((await result.textContent()) ?? '')) await expect(result.locator('.mj-faan-total').first()).toContainText(/\d+ tai/);
    await expect(result.locator('.mj-pay')).toContainText('You');
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.moments')).toBeVisible({ timeout: 120_000 });
    await noHorizontalScroll(page);
  });

  test('the table passes an accessibility scan', async ({ page }) => {
    await startMahjong(page, { seed: 'a11y-tw', level: 1, preset: /^Taiwanese, one hand/ });
    await expect(page.locator('.status-turn')).toHaveText(/Your move|thinking|Game over/, { timeout: 60_000 });
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).disableRules(['label-content-name-mismatch']).analyze();
    const serious = result.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
    expect(serious).toEqual([]);
  });

  test('the dealer lesson: the tai with the repeat deals, what the discarder pays, then the win', async ({ page }) => {
    await page.goto('/#/learn/mahjong.4.tw-dealer');
    await next(page);
    await next(page);
    await typeNumber(page, 8);
    await expect(page.locator('.lesson-feedback')).toContainText('Yes, 8: 1 + 2 for the hand, 1 for dealing and 4 for the repeat deals');
    await next(page);
    await typeNumber(page, 260);
    await expect(page.locator('.lesson-feedback')).toContainText('Yes: 100 plus 8 times 20, 260');
    await next(page);
    await page.locator('.mj-prompt .mj-call[data-call="win"]').click();
    const result = page.locator('.mj-result');
    await expect(result).toContainText('8 tai');
    await expect(result).toContainText('Repeat deals');
    await expect(result.locator('.mj-pay')).toContainText('You +260');
    await noHorizontalScroll(page);
  });

  test('the tai drill: count the tai and what you collect', async ({ page }) => {
    await page.goto('/#/practice/mahjong/drill-mahjong-tw-tai?seed=e2e');
    const ask = page.locator('.lesson-text');
    await expect(ask).toContainText('How many tai is it worth');
    await typeNumber(page, 0);
    if (/Not quite/.test((await page.locator('.lesson-feedback').textContent()) ?? '')) await page.getByRole('button', { name: 'Show me' }).click();
    const [, tai = '0'] = /(?:The answer is|Yes,) (\d+)/.exec((await page.locator('.lesson-feedback').textContent()) ?? '') ?? [];
    await next(page);
    await expect(ask).toContainText('How much do you collect in all?');
    await typeNumber(page, 0);
    await page.getByRole('button', { name: 'Show me' }).click();
    await next(page);
    await page.getByRole('button', { name: /^Win/ }).first().click();
    await expect(page.locator('.mj-result')).toContainText(`${tai} tai`);
    await noHorizontalScroll(page);
  });

  test('the rules dialog offers the Taiwanese options once its preset is chosen', async ({ page }) => {
    await page.goto('/#/games/mahjong');
    await page.getByRole('button', { name: /^Play/ }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('radio', { name: 'Taiwanese, common table (100/20)' }).click();
    await dialog.getByRole('button', { name: 'Change the rules' }).click();
    await expect(dialog.getByRole('radiogroup', { name: 'Base stake' })).toBeVisible();
    await expect(dialog.getByRole('radiogroup', { name: 'Stake for each tai' })).toBeVisible();
    await expect(dialog.getByRole('radiogroup', { name: 'Points to win (flowers never count)' })).toHaveCount(0);
    await noHorizontalScroll(page);
  });

  test('the reference card has the Taiwanese tai and payments', async ({ page }) => {
    await page.goto('/#/games/mahjong/reference');
    await expect(page.getByRole('heading', { name: 'Taiwanese tai (common table)' })).toBeVisible();
    await expect(page.getByText(/^24: Heavenly hand/)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Taiwanese payments' })).toBeVisible();
    await noHorizontalScroll(page);
  });
});
