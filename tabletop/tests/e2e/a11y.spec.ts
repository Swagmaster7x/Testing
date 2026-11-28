/**
 * Accessibility pass (milestone 16): axe-core scans of the main screens, a table of each kind and
 * a lesson. Serious and critical findings fail; the rest are printed for a person to judge.
 */
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';
import { choosePassOrVoid } from './mahjong-helpers';

/** Serious and critical findings so far in this test; checked at its end, so one run shows them all. */
let found: string[] = [];

async function scan(page: Page, where: string) {
  // label-content-name-mismatch is off: on a playing card the corner index ("2") is part of the
  // picture, and the card's name ("Dos de oros") is what a person says to choose it.
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).disableRules(['label-content-name-mismatch']).analyze();
  for (const v of result.violations) console.log(`${where}: ${v.impact ?? '?'} ${v.id} (${v.nodes.length}) ${v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')} ${n.html.slice(0, 120)} ${(n.failureSummary ?? '').split('\n')[1] ?? ''}`).join(' | ')}`);
  found.push(...result.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => `${where} ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`));
}

async function startGame(page: Page, game: string) {
  await page.goto(`/#/games/${game}?seed=a11y`);
  await page.getByRole('button', { name: /^Play/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page.locator('.status-turn')).toHaveText(/Your move|to move|thinking|Game over/, { timeout: 60_000 });
}

test.describe('accessibility', () => {
  test.beforeEach(async ({ page }) => {
    found = [];
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test.afterEach(() => {
    expect(found).toEqual([]);
  });

  test('the main screens', async ({ page }) => {
    for (const [where, url] of [
      ['today', '/#/today'],
      ['games', '/#/games'],
      ['hub', '/#/games/brisca'],
      ['learn', '/#/games/go/learn'],
      ['practice', '/#/games/dominoes/practice'],
      ['progress', '/#/progress'],
      ['tools', '/#/tools'],
      ['timer', '/#/tools/timer'],
      ['settings', '/#/settings'],
      ['reference', '/#/games/poker/reference'],
    ] as const) {
      await page.goto(url);
      await page.waitForTimeout(400);
      // The progress table loads every game's lessons first: scan it once it is there.
      if (where === 'progress') await page.locator('button.progress-game').first().waitFor({ timeout: 15_000 });
      await scan(page, where);
    }
  });

  test('the daylight look', async ({ page }) => {
    await page.goto('/#/settings');
    await page.getByRole('radio', { name: /Daylight/ }).click();
    for (const url of ['/#/today', '/#/games/brisca', '/#/tools']) {
      await page.goto(url);
      await page.waitForTimeout(400);
      await scan(page, `daylight ${url}`);
    }
  });

  test('tables and a lesson', async ({ page }) => {
    test.setTimeout(120_000);
    for (const game of ['chess', 'brisca', 'dominoes', 'poker', 'go', 'mahjong']) {
      await startGame(page, game);
      await scan(page, `${game} table`);
    }
    await page.goto('/#/learn/brisca.0.game');
    await page.waitForTimeout(400);
    await scan(page, 'lesson');
  });

  test('the Mahjong style tables of milestone 14c', async ({ page }) => {
    test.setTimeout(120_000);
    // Sichuan: the exchange prompt, then the void prompt, then the table in play.
    await page.goto('/#/games/mahjong?seed=a11y');
    await page.getByRole('button', { name: /^Play/ }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('radio', { name: /^Sichuan, online/ }).click();
    await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
    await expect(page.locator('.mj-pass-prompt')).toBeVisible({ timeout: 60_000 });
    await scan(page, 'sichuan exchange');
    await choosePassOrVoid(page);
    await expect(page.locator('.mj-void-prompt')).toBeVisible({ timeout: 60_000 });
    await scan(page, 'sichuan void');
    await choosePassOrVoid(page);
    await expect(page.locator('.status-turn')).toHaveText(/Your move|to move|thinking/, { timeout: 60_000 });
    await scan(page, 'sichuan table');
    // American: the Charleston, the table in play, the card editor.
    await page.goto('/#/games/mahjong?seed=a11y');
    await page.getByRole('button', { name: /^Play/ }).click();
    await page.getByRole('dialog').getByRole('radio', { name: /^American, League/ }).click();
    await page.getByRole('dialog').getByRole('button', { name: /^(Start|New game)$/ }).click();
    await expect(page.locator('.mj-pass-prompt')).toBeVisible({ timeout: 60_000 });
    await scan(page, 'american charleston');
    for (let i = 0; i < 12 && (await page.locator('.mj-pass-prompt').isVisible()); i++) {
      await choosePassOrVoid(page);
      await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 60_000 });
      await expect(page.locator('.mj-prompt, .mj-centre-tip').first()).toBeVisible({ timeout: 15_000 });
    }
    await scan(page, 'american table');
    await page.goto('/#/tools/mahjong-card');
    await page.getByRole('button', { name: 'Start from the practice card' }).click();
    await scan(page, 'american card editor');
  });
});
