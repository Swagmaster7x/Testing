/**
 * American end to end (milestone 14c): a hand against level 2 through the whole Charleston (the
 * three passes, the vote, the courtesy pass) to its end and the review; the exposure lesson with a
 * joker; the drill; the card editor with an error, a fix, saving, and a game played from "My card";
 * the reference card's practice card.
 */
import type { Page } from '@playwright/test';
import { expect, noHorizontalScroll, test } from './fixtures';
import { choosePassOrVoid, playToEnd, startMahjong } from './mahjong-helpers';

const next = (page: Page) => page.getByRole('button', { name: 'Next' }).click();

async function typeNumber(page: Page, n: number) {
  for (const d of String(n)) await page.getByRole('button', { name: d, exact: true }).click();
  await page.getByRole('button', { name: 'Check', exact: true }).click();
}

test.describe('mahjong: american', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a hand: the Charleston with its vote and courtesy pass, then play to the end and the review', async ({ page }) => {
    test.setTimeout(400_000);
    await startMahjong(page, { seed: 'am-1', level: 2, preset: /^American, League/, oneHand: true });
    const prompt = page.locator('.mj-pass-prompt');
    await expect(prompt).toBeVisible({ timeout: 45_000 });
    await expect(prompt).toContainText('First Charleston');
    await expect(prompt).toContainText('Jokers never pass.');
    // Jokers cannot be picked to pass.
    await expect(page.locator('button.mj-tile[aria-label="Joker"]')).toHaveCount(0);
    await noHorizontalScroll(page);
    const seen = new Set<string>();
    for (let i = 0; i < 12; i++) {
      await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 45_000 });
      // The prompt waits for the passing animation; in play, the middle says to throw instead.
      await expect(page.locator('.mj-prompt, .mj-centre-tip').first()).toBeVisible({ timeout: 15_000 });
      if (!(await prompt.isVisible())) break;
      const text = (await prompt.textContent()) ?? '';
      if (/second Charleston\?/.test(text)) seen.add('vote');
      if (/Courtesy/.test(text)) seen.add('courtesy');
      if (/to the left/.test(text)) seen.add('left');
      await choosePassOrVoid(page);
    }
    expect([...seen].sort()).toEqual(['courtesy', 'left', 'vote']);
    await expect(page.locator('.mj-seat[data-where="bottom"]')).toBeVisible();
    await playToEnd(page, 'drawn', 400);
    await expect(page.locator('.status-turn')).toHaveText(/Game over/);
    const result = page.locator('.mj-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText(/won|drawn hand/);
    await expect(result.locator('.mj-pay')).toContainText('You');
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.moments')).toBeVisible({ timeout: 120_000 });
    await noHorizontalScroll(page);
  });

  test('the exposure lesson: a pung with a joker, then a throw', async ({ page }) => {
    await page.goto('/#/learn/mahjong.4.american-jokers');
    await next(page);
    const call = page.locator('.mj-prompt .mj-call[data-call="expose"]');
    await expect(call).toHaveCount(1);
    await expect(call).toContainText('Expose a pung, 1 joker');
    await call.click();
    await expect(page.locator('.lesson-feedback')).toContainText('a joker standing for the third');
    await next(page);
    const north = page.locator('button.mj-tile[aria-label="North wind"]');
    await north.click();
    await north.click();
    await next(page);
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
    await noHorizontalScroll(page);
  });

  test('the drill: find the hand on the card, then what everyone pays', async ({ page }) => {
    await page.goto('/#/practice/mahjong/drill-mahjong-american-pay?seed=e2e');
    await expect(page.locator('.lesson-text')).toContainText('Which hand on the practice card is it?');
    const options = page.locator('.choice-list button.choice');
    for (let i = 0; i < 3; i++) {
      await options.nth(i).click();
      if ((await page.locator('.lesson-feedback').textContent())?.startsWith('Right')) break;
    }
    await expect(page.locator('.lesson-feedback')).toContainText('Right');
    await next(page);
    await typeNumber(page, 0);
    await page.getByRole('button', { name: 'Show me' }).click();
    const [, total = '0'] = /The answer is (\d+)/.exec((await page.locator('.lesson-feedback').textContent()) ?? '') ?? [];
    expect(Number(total)).toBeGreaterThan(0);
    await next(page);
    await page.getByRole('button', { name: /Mah Jongg/ }).first().click();
    await expect(page.locator('.mj-result')).toContainText(`+${total}`);
  });

  test('the card editor: an error names its line; a fixed card is saved and played as "My card"', async ({ page }) => {
    await page.goto('/#/tools');
    await page.getByRole('link', { name: 'Your American card' }).click();
    const box = page.getByRole('textbox', { name: 'The card, one hand a line' });
    await box.fill('title: My test card\n## Evens\nFFF 2222a 44b 666c 88a = 25 X\nFFF 2222x 44b 666c 88a = 30 X\n');
    await expect(page.locator('.card-errors')).toContainText('Line 4: "2222x" is not a group');
    await expect(page.getByRole('button', { name: 'Save on this device' })).toBeDisabled();
    await box.fill('title: My test card\n## Evens\nFFF 2222a 44b 666c 88a = 25 X\nFFF 2222a 44b 666c 88b = 30 X\n');
    await expect(page.locator('.calc-status')).toContainText('All 2 hands read.');
    await page.getByRole('button', { name: 'Save on this device' }).click();
    await expect(page.locator('.calc-status')).toContainText('Saved.');
    await noHorizontalScroll(page);
    // Kept on the device, and played with.
    await page.reload();
    await expect(box).toHaveValue(/My test card/);
    await page.goto('/#/games/mahjong?seed=my-card');
    await page.getByRole('button', { name: /^Play/ }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('radio', { name: 'American, one hand' }).click();
    await dialog.getByRole('button', { name: 'Change the rules' }).click();
    await dialog.getByRole('radiogroup', { name: 'Card' }).getByRole('radio', { name: /My card/ }).click();
    await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
    await expect(page).toHaveURL(/#\/play\/g_/);
    await expect(page.locator('.mj-pass-prompt')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByText('My test card')).toBeVisible();
  });

  test('the reference card lists the practice card and the American payments', async ({ page }) => {
    await page.goto('/#/games/mahjong/reference');
    await expect(page.getByRole('heading', { name: 'The practice card' })).toBeVisible();
    await expect(page.getByText('Evens: FFF 2222a 44b 666c 88a (25, X)')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'American payments' })).toBeVisible();
    await noHorizontalScroll(page);
  });
});
