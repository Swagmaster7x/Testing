/**
 * Milestone 14c screenshots: Sichuan Bloody at the table (the exchange, the void, a hand going on
 * after a win, the result), in Learn and Practice, the reference card and the calculator, at 844 ×
 * 390 (twice the pixels), then the table on a tablet and a laptop.
 */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';
import { choosePassOrVoid, playOnToEnd, startMahjong } from './mahjong-helpers';

const DIR = 'screenshots/m14c';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });
const next = (page: Page) => page.getByRole('button', { name: 'Next' }).click();

/** Plays on until a seat has won while the hand goes on, then until the end; a shot of each. */
async function sichuanHand(page: Page, prefix: string) {
  await playOnToEnd(page, async () => {
    await shot(page, `${prefix}-played-on`);
  });
  await expect(page.locator('.mj-result')).toBeVisible();
  await shot(page, `${prefix}-result`);
}

test('milestone 14c screens: sichuan', async ({ page }) => {
  test.setTimeout(600_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/#/games/mahjong?seed=sc-1');
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radio', { name: 'Sichuan, Chengdu table' }).click();
  await dialog.getByRole('button', { name: 'Change the rules' }).click();
  await expect(dialog.getByRole('radiogroup', { name: 'Fan cap' })).toBeVisible();
  await shot(page, 's01-rules');
  await page.keyboard.press('Escape');

  await startMahjong(page, { seed: 'sc-1', level: 1, preset: /^Sichuan, online/, oneHand: true });
  await expect(page.locator('.mj-pass-prompt')).toBeVisible({ timeout: 45_000 });
  await shot(page, 's02-exchange');
  // Pick the three tiles, and show them lifted before passing.
  const tiles = page.locator('button.mj-tile');
  const labels = await tiles.evaluateAll((list) => list.map((b) => b.getAttribute('aria-label') ?? ''));
  const bySuit = new Map<string, number[]>();
  labels.forEach((l, i) => bySuit.set(l.split(' ').pop() ?? '', [...(bySuit.get(l.split(' ').pop() ?? '') ?? []), i]));
  const group = [...bySuit.values()].filter((g) => g.length >= 3).sort((a, b) => a.length - b.length)[0] ?? [];
  for (const i of group.slice(0, 3)) await tiles.nth(i).click();
  await shot(page, 's03-exchange-picked');
  await page.locator('.mj-pass-prompt .mj-call[data-call="pass-tiles"]').click();
  await expect(page.locator('.mj-void-prompt')).toBeVisible({ timeout: 45_000 });
  await shot(page, 's04-void');
  await choosePassOrVoid(page);
  await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 45_000 });
  await shot(page, 's05-table');
  await sichuanHand(page, 's06');

  // Learn, Practice, Reference, Tools.
  await page.goto('/#/learn/mahjong.4.sichuan-void');
  await next(page);
  await shot(page, 's07-lesson-void');
  await page.goto('/#/learn/mahjong.4.sichuan-blood');
  await next(page);
  await shot(page, 's08-lesson-kong');
  await page.goto('/#/practice/mahjong/drill-mahjong-sichuan-fan?seed=shots');
  await expect(page.locator('.lesson-text')).toContainText('How many fan');
  await shot(page, 's09-drill');
  await page.goto('/#/games/mahjong/reference');
  await page.getByRole('heading', { name: 'Sichuan fan' }).scrollIntoViewIfNeeded();
  await shot(page, 's10-reference');
  await page.goto('/#/tools/mahjong');
  await page.getByRole('radiogroup', { name: 'Style' }).getByRole('radio', { name: 'Sichuan' }).click();
  const picker = page.getByRole('group', { name: 'Tiles to add' });
  for (const tile of ['1 dots', '1 dots', '1 dots', '4 dots', '4 dots', '4 dots', '7 dots', '7 dots', '7 dots', '2 dots', '2 dots', '2 dots', '9 dots', '9 dots']) {
    await picker.getByRole('button', { name: `Add the ${tile}`, exact: true }).click();
  }
  await shot(page, 's11-calculator');
});

test('milestone 14c screens: sichuan on a tablet and a laptop', async ({ page }) => {
  test.setTimeout(400_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [name, size] of [
    ['tablet', { width: 1180, height: 820 }],
    ['laptop', { width: 1440, height: 900 }],
  ] as const) {
    await page.setViewportSize(size);
    await startMahjong(page, { seed: 'sc-1', level: 1, preset: /^Sichuan, online/, oneHand: true });
    await expect(page.locator('.mj-pass-prompt')).toBeVisible({ timeout: 45_000 });
    await choosePassOrVoid(page);
    await expect(page.locator('.mj-void-prompt')).toBeVisible({ timeout: 45_000 });
    await shot(page, `s20-${name}-void`);
    await choosePassOrVoid(page);
    await sichuanHand(page, `s21-${name}`);
  }
});
