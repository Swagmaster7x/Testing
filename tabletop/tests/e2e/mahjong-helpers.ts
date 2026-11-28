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
  if (await choosePassOrVoid(page)) return true;
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

/**
 * Before play (milestone 14c): the void suit (the suit with the fewest tiles) and passing tiles
 * (three of one suit for Sichuan's exchange; any three but a joker in a Charleston; nothing in a
 * courtesy pass; "go on" in a vote). Returns false when neither prompt is up.
 */
export async function choosePassOrVoid(page: Page): Promise<boolean> {
  const voidPrompt = page.locator('.mj-void-prompt');
  if (await voidPrompt.isVisible()) {
    const buttons = voidPrompt.locator('button');
    const texts = await buttons.allTextContents();
    const counts = texts.map((x) => Number(/(\d+)\s*$/.exec(x)?.[1] ?? 99));
    await buttons.nth(counts.indexOf(Math.min(...counts))).click();
    return true;
  }
  const passPrompt = page.locator('.mj-pass-prompt');
  if (!(await passPrompt.isVisible())) return false;
  const vote = passPrompt.locator('.mj-call[data-call="vote-yes"]');
  if (await vote.count()) {
    await vote.click();
    return true;
  }
  const title = (await passPrompt.locator('.mj-prompt-title').textContent()) ?? '';
  if (!/Courtesy/.test(title)) {
    const tiles = page.locator('button.mj-tile:not([aria-label="Joker"])');
    const labels = await tiles.evaluateAll((list) => list.map((b) => b.getAttribute('aria-label') ?? ''));
    let picks = labels.map((_, i) => i).slice(0, 3);
    if (/one suit/.test(title)) {
      const bySuit = new Map<string, number[]>();
      labels.forEach((l, i) => bySuit.set(l.split(' ').pop() ?? '', [...(bySuit.get(l.split(' ').pop() ?? '') ?? []), i]));
      const groups = [...bySuit.values()].filter((g) => g.length >= 3).sort((a, b) => a.length - b.length);
      picks = (groups[0] ?? []).slice(0, 3);
    }
    for (const i of picks) await tiles.nth(i).click();
  }
  await passPrompt.locator('.mj-call[data-call="pass-tiles"]').click();
  return true;
}

/**
 * Plays a Sichuan game to its end, and says whether play went on after a win: at some point it was
 * your move again in a hand where a player had already won. `onPlayedOn` runs at that moment.
 */
export async function playOnToEnd(page: Page, onPlayedOn?: () => Promise<void>): Promise<boolean> {
  let playedOn = false;
  const turn = page.locator('.status-turn');
  for (let i = 0; i < 300; i++) {
    await expect(turn).toHaveText(/Your move|Game over/, { timeout: 45_000 });
    if ((await turn.textContent())?.includes('Game over')) return playedOn;
    if (!playedOn && (await page.locator('.mj-won-mark').count()) > 0 && !(await page.locator('.mj-result').isVisible())) {
      playedOn = true;
      await onPlayedOn?.();
    }
    await takeTurn(page);
    await page.waitForTimeout(40);
  }
  throw new Error('The game did not end');
}

/** Plays until the game is over (or the move budget runs out). */
export async function playToEnd(page: Page, policy: Policy = 'drawn', budget = 80): Promise<void> {
  for (let i = 0; i < budget; i++) {
    if (!(await takeTurn(page, policy))) return;
    await page.waitForTimeout(60);
  }
  throw new Error('The game did not end');
}
