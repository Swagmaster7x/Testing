/** Moves for the poker end-to-end tests. */
import type { Page } from '@playwright/test';
import { expect } from './fixtures';

/** One move of a passive player: draw two, bring it in, or call/check. Returns what it did. */
export async function playOne(page: Page): Promise<'draw' | 'bring-in' | 'call'> {
  const draw = page.locator('.bet-draw');
  const bringIn = page.locator('.bet-bring-in');
  await expect(draw.or(bringIn).or(page.locator('.bet-call'))).toBeVisible({ timeout: 30_000 });
  if (await draw.isVisible()) {
    const mine = page.locator('.poker-table button.table-card');
    await mine.nth(3).click();
    await mine.nth(4).click();
    await expect(draw).toHaveText('Draw 2');
    await draw.click();
    return 'draw';
  }
  if (await bringIn.isVisible()) {
    await bringIn.click();
    return 'bring-in';
  }
  await page.locator('.bet-call').click();
  return 'call';
}
