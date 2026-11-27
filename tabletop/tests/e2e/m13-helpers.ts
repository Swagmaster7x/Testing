/** Helpers for the classic card pack end-to-end tests (milestone 13). */
import type { Page } from '@playwright/test';
import { expect } from './fixtures';

/** Opens a game's hub with a fixed seed and starts a game at a CPU level, with an optional preset. */
export async function startClassic(page: Page, game: string, seed: string, level = 1, preset?: string): Promise<void> {
  await page.goto(`/#/games/${game}?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: String(level), exact: true }).click();
  if (preset) {
    await dialog.getByRole('button', { name: 'Change the rules' }).click();
    await dialog.getByRole('radio', { name: preset, exact: true }).click();
  }
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

/** Taps a card twice: lift, then play. */
export async function tapTwice(page: Page, name: string): Promise<void> {
  const card = page.getByRole('button', { name, exact: true });
  await card.click();
  await card.click();
}

/** Plays the first playable card in your hand (tap to lift, tap to play). */
export async function playFirstCard(page: Page): Promise<void> {
  const card = page.locator('button.table-card').first();
  await card.click();
  await card.click();
}

/** Waits until it is your move or the game is over; returns true when over. */
export async function waitTurn(page: Page, timeout = 30_000): Promise<boolean> {
  const turn = page.locator('.status-turn');
  await expect(turn).toHaveText(/Your move|Game over/, { timeout });
  return (await turn.textContent())?.includes('Game over') ?? false;
}
