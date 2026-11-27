/**
 * Hold'em end to end (PLAN.md 2.10): play a short cash session against level 1 to the end, then
 * review it (key moments, accuracy, and each CPU seat's style revealed); size a raise with a
 * preset and the slider; a heads-up table has two seats.
 */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

async function start(page: Page, seed: string, options: { level: string; preset?: string; hands?: string }) {
  await page.goto(`/#/games/poker?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: options.level, exact: true }).click();
  if (options.preset || options.hands) await dialog.getByRole('button', { name: 'Change the rules' }).click();
  if (options.preset) await dialog.getByRole('radio', { name: options.preset, exact: true }).click();
  if (options.hands) await dialog.getByRole('radiogroup', { name: 'Cash session' }).getByRole('radio', { name: options.hands }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

test.describe('poker', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a short cash session against level 1 to the end, then reviews it', async ({ page }) => {
    test.setTimeout(300_000);
    await start(page, 'e2e-session', { level: '1', hands: '10 hands' });
    const turn = page.locator('.status-turn');
    for (let i = 0; i < 200; i++) {
      await expect(turn).toHaveText(/Your move|Game over/, { timeout: 60_000 });
      if ((await turn.textContent())?.includes('Game over')) break;
      // Call or check; now and then fold a raise.
      const fold = page.locator('.bet-fold');
      if (i % 7 === 3 && (await fold.isVisible())) await fold.click();
      else await page.locator('.bet-call').click();
    }
    await expect(turn).toHaveText(/Game over/, { timeout: 60_000 });
    // Each CPU seat's style is shown once the session is over (on a phone the player list sits in the side panel).
    await expect(page.locator('.players .player-detail').filter({ hasText: /Calling station|Maniac/ })).not.toHaveCount(0);
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.moments')).toBeVisible({ timeout: 180_000 });
    await expect(page.locator('.accuracy')).toContainText('You:');
    await expect(page.locator('.players .player-detail').filter({ hasText: /Calling station|Maniac/ })).not.toHaveCount(0);
  });

  test('sizes a raise with a preset and the slider', async ({ page }) => {
    test.setTimeout(120_000);
    await start(page, 'e2e-raise', { level: '1' });
    const turn = page.locator('.status-turn');
    await expect(turn).toHaveText(/Your move/, { timeout: 60_000 });
    const raise = page.locator('.bet-raise');
    await expect(raise).toHaveText(/^(Raise to|Bet|All-in)/);
    await raise.click();
    const tray = page.getByRole('group', { name: 'Bet size' });
    await expect(tray).toBeVisible();
    const slider = tray.getByRole('slider', { name: 'Bet size' });
    await slider.press('End');
    await expect(raise).toHaveText(/^All-in/);
    await tray.getByRole('button', { name: 'Min' }).click();
    await expect(raise).toHaveText(/^(Raise to|Bet) \d+$/);
    const label = (await raise.textContent()) ?? '';
    await raise.click();
    const amount = label.replace(/\D+/g, '');
    await expect(page.locator('.poker-seat[data-me="true"] .poker-action')).toHaveText(/Raise|Bet|All-in/, { timeout: 10_000 });
    await expect(page.locator('.poker-seat[data-me="true"]')).not.toHaveAttribute('data-folded', 'true');
    expect(Number(amount)).toBeGreaterThan(0);
  });

  test('a heads-up table seats two', async ({ page }) => {
    await start(page, 'e2e-hu', { level: '2', preset: 'Heads-up' });
    await expect(page.locator('.poker-seat')).toHaveCount(2);
    await expect(page.locator('.status-turn')).toHaveText(/Your move|CPU is thinking|Game over/, { timeout: 60_000 });
    await expect(page.locator('.poker-seat[data-me="true"] .poker-stack')).toHaveText(/\d+/);
  });
});
