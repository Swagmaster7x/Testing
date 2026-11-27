/** Shared steps for the mahjong end-to-end tests and screenshots. */
import type { Page } from '@playwright/test';
import { expect } from './fixtures';

/** Opens the hub with a fixed seed and starts a game against a level, optionally a single hand. */
export async function startMahjong(page: Page, options: { seed: string; level?: number; oneHand?: boolean; preset?: RegExp }): Promise<void> {
  await page.goto(`/#/games/mahjong?seed=${options.seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: String(options.level ?? 1), exact: true }).click();
  if (options.preset) await dialog.getByRole('radio', { name: options.preset }).click();
  if (options.oneHand) {
    await dialog.getByRole('button', { name: 'Change the rules' }).click();
    await dialog.getByRole('radiogroup', { name: 'Game length' }).getByRole('radio', { name: 'One hand' }).click();
  }
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

export type Policy = 'drawn' | 'efficient';

/**
 * One decision when it is the person's move: win when offered, pass every call, then discard (the
 * drawn tile, or the tile the efficiency helper marks best). Returns false once the game is over.
 */
export async function takeTurn(page: Page, policy: Policy = 'drawn'): Promise<boolean> {
  const turn = page.locator('.status-turn');
  await expect(turn).toHaveText(/Your move|Game over/, { timeout: 45_000 });
  if ((await turn.textContent())?.includes('Game over')) return false;
  const prompt = page.locator('.mj-prompt');
  if (await prompt.isVisible()) {
    const win = prompt.locator('.mj-call[data-call="win"]');
    if (await win.count()) await win.click();
    else await prompt.locator('.mj-call[data-call="pass"]').click();
    return true;
  }
  const next = page.locator('.mj-next');
  if (await next.isVisible()) {
    await next.click();
    return true;
  }
  const win = page.getByRole('button', { name: /^(Win \(zi mo|Tsumo)/ });
  if (await win.isVisible()) {
    await win.click();
    return true;
  }
  const best = page.locator('button.mj-tile[data-tone="hint"]').first();
  const tile = policy === 'efficient' && (await best.count()) > 0 ? best : page.locator('button.mj-tile').last();
  await tile.click();
  await tile.click();
  return true;
}

/** Plays until the game is over (or the move budget runs out). */
export async function playToEnd(page: Page, policy: Policy = 'drawn', budget = 80): Promise<void> {
  for (let i = 0; i < budget; i++) {
    if (!(await takeTurn(page, policy))) return;
    await page.waitForTimeout(60);
  }
  throw new Error('The game did not end');
}
