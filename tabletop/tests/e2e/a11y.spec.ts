/**
 * Accessibility pass (milestone 16): axe-core scans of the main screens, a table of each kind and
 * a lesson. Serious and critical findings fail; the rest are printed for a person to judge.
 */
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

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
    for (const [where, url, ready] of [
      ['today', '/#/today'],
      ['games', '/#/games'],
      ['hub', '/#/games/brisca'],
      ['learn', '/#/games/go/learn'],
      ['practice', '/#/games/dominoes/practice'],
      // Progress loads every game's lessons first; scan it once its rows are buttons.
      ['progress', '/#/progress', 'main button'],
      ['tools', '/#/tools'],
      ['timer', '/#/tools/timer'],
      ['settings', '/#/settings'],
      ['reference', '/#/games/poker/reference'],
    ] as [string, string, string?][]) {
      await page.goto(url);
      if (ready) await page.locator(ready).first().waitFor();
      await page.waitForTimeout(400);
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
});
