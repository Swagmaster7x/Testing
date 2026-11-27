/** Helpers for the classic card pack end-to-end tests (milestone 13). */
import type { Page } from '@playwright/test';
import { expect } from './fixtures';

/**
 * Opens a game's hub with a fixed seed and starts a game at a CPU level, with an optional preset
 * and an optional single rule (`option`: the radio group's name and the choice).
 */
export async function startClassic(page: Page, game: string, seed: string, level = 1, preset?: string, option?: { group: string; choice: string }): Promise<void> {
  await page.goto(`/#/games/${game}?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: String(level), exact: true }).click();
  if (preset || option) await dialog.getByRole('button', { name: 'Change the rules' }).click();
  if (preset) await dialog.getByRole('radio', { name: preset, exact: true }).click();
  if (option) await dialog.getByRole('radiogroup', { name: option.group }).getByRole('radio', { name: option.choice, exact: true }).click();
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

/** One move of yours in Hearts or Spades: pass three cards, bid, or play the first playable card. */
export async function trickMove(page: Page): Promise<void> {
  const pass = page.getByRole('button', { name: /^Pass / });
  if (await pass.isVisible()) {
    const cards = page.locator('button.table-card');
    for (let i = 0; i < 3; i++) await cards.nth(i).click();
    await pass.click();
    return;
  }
  const bid = page.getByRole('button', { name: 'Bid 3', exact: true });
  if (await bid.isVisible()) {
    await bid.click();
    return;
  }
  await playFirstCard(page);
}

/** One move of yours in Gin Rummy: turn down the up-card, draw from the stock, knock when you can, else throw your last card. */
export async function ginMove(page: Page): Promise<void> {
  const pass = page.getByRole('button', { name: 'Pass', exact: true });
  if (await pass.isVisible()) {
    await pass.click();
    return;
  }
  const stock = page.getByRole('button', { name: /^Stock, \d+ cards: draw$/ });
  if ((await stock.count()) > 0) {
    await stock.click();
    return;
  }
  const card = page.locator('button.table-card').last();
  await card.click();
  const knock = page.getByRole('button', { name: /^(Knock with|Gin!)/ });
  if (await knock.isVisible()) await knock.click();
  else await card.click();
}

/** One move of yours in Blackjack: bet the last amount, turn down insurance, or stand. */
export async function blackjackMove(page: Page): Promise<void> {
  const bet = page.locator('.bet-call');
  if (await bet.isVisible()) {
    await bet.click();
    return;
  }
  const noInsurance = page.getByRole('button', { name: 'No insurance', exact: true });
  if (await noInsurance.isVisible()) {
    await noInsurance.click();
    return;
  }
  await page.getByRole('button', { name: 'Stand', exact: true }).click();
}

/** Plays your moves with `move` until the game is over. */
export async function playToEnd(page: Page, move: (page: Page) => Promise<void>, limit = 400): Promise<void> {
  for (let i = 0; i < limit; i++) {
    if (await waitTurn(page)) return;
    await move(page);
    await page.waitForTimeout(60);
  }
  throw new Error('the game did not end');
}

/** Types a whole number on the lesson number pad and checks it. */
export async function typeNumber(page: Page, n: number): Promise<void> {
  for (const d of String(n)) await page.locator('.number-keys').getByRole('button', { name: d, exact: true }).click();
  await page.getByRole('button', { name: 'Check', exact: true }).click();
}
