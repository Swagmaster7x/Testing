/**
 * Chinese Official end to end (milestone 14b): a hand against level 2 to its end, with the points
 * or the drawn hand, then the review; an accessibility scan of the table; the settling-up lesson;
 * the counting drill; the rules dialog with the Chinese Official options; the reference card.
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

test.describe('mahjong: chinese official', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a Chinese Official hand against level 2 to the end, shows the points or the drawn hand, then reviews it', async ({ page }) => {
    test.setTimeout(300_000);
    await startMahjong(page, { seed: 'e2e-co', level: 2, preset: /^Chinese Official, one hand/ });
    await expect(page.locator('button.mj-tile').first()).toBeVisible({ timeout: 45_000 });
    await noHorizontalScroll(page);
    await playToEnd(page);
    await expect(page.locator('.status-turn')).toHaveText(/Game over/);
    const result = page.locator('.mj-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText(/won|drawn hand/);
    if (/won/.test((await result.textContent()) ?? '')) await expect(result.locator('.mj-faan-total').first()).toContainText(/\d+ points/);
    await expect(result.locator('.mj-pay')).toContainText('You');
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.moments')).toBeVisible({ timeout: 120_000 });
    await noHorizontalScroll(page);
  });

  test('the table passes an accessibility scan', async ({ page }) => {
    await startMahjong(page, { seed: 'a11y-co', level: 1, preset: /^Chinese Official, one hand/ });
    await expect(page.locator('.status-turn')).toHaveText(/Your move|thinking|Game over/, { timeout: 60_000 });
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).disableRules(['label-content-name-mismatch']).analyze();
    const serious = result.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
    expect(serious).toEqual([]);
  });

  test('the settling-up lesson: the points, what the discarder pays, the total, then the win', async ({ page }) => {
    await page.goto('/#/learn/mahjong.4.co-settle');
    await next(page);
    await typeNumber(page, 15);
    await expect(page.locator('.lesson-feedback')).toContainText('Yes, 15, 14 of them without the flower');
    await next(page);
    await typeNumber(page, 23);
    await expect(page.locator('.lesson-feedback')).toContainText('Yes: 15 plus 8, 23');
    await next(page);
    await typeNumber(page, 39);
    await next(page);
    await page.locator('.mj-prompt .mj-call[data-call="win"]').click();
    const result = page.locator('.mj-result');
    await expect(result).toContainText('15 points');
    await expect(result).toContainText('Mixed straight');
    await expect(result.locator('.mj-pay')).toContainText('You +39');
    await noHorizontalScroll(page);
  });

  test('the counting drill: a pattern, the points and what the table pays', async ({ page }) => {
    await page.goto('/#/practice/mahjong/drill-mahjong-co-points?seed=e2e');
    const ask = page.locator('.lesson-text');
    await expect(ask).toContainText('Which of these patterns does it score?');
    await page.locator('.choice-list button.choice').first().click();
    if (!/Right/.test((await page.locator('.lesson-feedback').textContent()) ?? '')) await page.getByRole('button', { name: 'Show me' }).click();
    await next(page);
    await expect(ask).toContainText('How many points is it worth');
    await typeNumber(page, 0);
    await expect(page.locator('.lesson-feedback')).toContainText('Not quite');
    await page.getByRole('button', { name: 'Show me' }).click();
    const [, points = '0'] = /The answer is (\d+)/.exec((await page.locator('.lesson-feedback').textContent()) ?? '') ?? [];
    await next(page);
    const selfDrawn = /Self-drawn/.test((await ask.textContent()) ?? '');
    const total = selfDrawn ? 3 * (8 + Number(points)) : 8 + Number(points) + 16;
    await typeNumber(page, total);
    await expect(page.locator('.lesson-feedback')).toContainText(`Yes, ${total}`);
    await next(page);
    await page.getByRole('button', { name: /^Win/ }).first().click();
    await expect(page.locator('.mj-result')).toContainText(`${points} points`);
    await noHorizontalScroll(page);
  });

  test('the rules dialog offers the Chinese Official options once its preset is chosen', async ({ page }) => {
    await page.goto('/#/games/mahjong');
    await page.getByRole('button', { name: /^Play/ }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('radio', { name: 'Chinese Official, sixteen hands' }).click();
    await dialog.getByRole('button', { name: 'Change the rules' }).click();
    await expect(dialog.getByRole('radiogroup', { name: 'Points to win (flowers never count)' })).toBeVisible();
    await expect(dialog.getByRole('radiogroup', { name: 'Two concealed kongs' })).toBeVisible();
    await expect(dialog.getByRole('radiogroup', { name: 'Red fives' })).toHaveCount(0);
    await noHorizontalScroll(page);
  });

  test('the reference card has the Chinese Official patterns and settlement', async ({ page }) => {
    await page.goto('/#/games/mahjong/reference');
    await expect(page.getByRole('heading', { name: 'Chinese Official patterns (points)' })).toBeVisible();
    await expect(page.getByText(/^88: Big four winds; Big three dragons/)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Chinese Official: settling up' })).toBeVisible();
    await noHorizontalScroll(page);
  });
});
