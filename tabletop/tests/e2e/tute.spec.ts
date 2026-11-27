/**
 * Tute end to end (PLAN.md 2.10): play a whole game of one hand for four against level 1 and
 * review it; an illegal card refused with its reason; a rules lesson with a cante; a drill.
 */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const RANKS: Record<string, string> = { As: 'A', Dos: '2', Tres: '3', Cuatro: '4', Cinco: '5', Seis: '6', Siete: '7', Sota: 'S', Caballo: 'C', Rey: 'R' };
const SUITS: Record<string, string> = { oros: 'o', copas: 'c', espadas: 'e', bastos: 'b' };
const CARD = /^(As|Dos|Tres|Cuatro|Cinco|Seis|Siete|Sota|Caballo|Rey) de (oros|copas|espadas|bastos)$/;

async function startTute(page: Page, seed: string, preset: string | null, games: string | null) {
  await page.goto(`/#/games/tute?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: '1', exact: true }).click();
  if (preset) await dialog.getByRole('radiogroup', { name: 'Rules at this table' }).getByRole('radio', { name: preset, exact: true }).click();
  if (games) {
    await dialog.getByRole('button', { name: 'Change the rules' }).click();
    await dialog.getByRole('radiogroup', { name: 'Games to win' }).getByRole('radio', { name: games, exact: true }).click();
  }
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

/** On your turn: sing or declare when offered, else play the first card you may (tap to lift, tap to play). */
async function playOne(page: Page) {
  const offer = page.locator('.tute-actions button').first();
  if (await offer.isVisible()) {
    await offer.click();
    return;
  }
  const card = page.locator('button.table-card:not(:has([data-dim="true"]))').first();
  await card.click();
  await card.click();
}

test.describe('tute', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a whole game for four against level 1 to the end, then reviews it', async ({ page }) => {
    test.setTimeout(240_000);
    await startTute(page, 'e2e-four', 'Spain, in pairs', 'One');
    await expect(page.getByText('Partner', { exact: true }).first()).toBeVisible();
    const turn = page.locator('.status-turn');
    for (let i = 0; i < 40; i++) {
      await expect(turn).toHaveText(/Your move|Game over/, { timeout: 30_000 });
      if ((await turn.textContent())?.includes('Game over')) break;
      await playOne(page);
      await page.waitForTimeout(60);
    }
    await expect(turn).toHaveText(/Game over/, { timeout: 30_000 });
    await expect(page.locator('.result-card h2')).toHaveText(/You win|You lose|Draw|wins/);
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.moments')).toBeVisible({ timeout: 120_000 });
    await expect(page.locator('.accuracy')).toContainText('You:');
  });

  test('two players with a stock: the hand starts with eight cards each', async ({ page }) => {
    await startTute(page, 'e2e-two', 'Two players (habanero)', null);
    await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 30_000 });
    await expect(page.locator('button.table-card')).toHaveCount(8);
    await expect(page.getByRole('img', { name: /^Stock, \d+ cards$/ })).toBeVisible();
  });

  test('tute corriente: six cards each, and the stock holds the other twenty-eight', async ({ page }) => {
    await startTute(page, 'e2e-corriente', 'Two players (corriente)', null);
    await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 30_000 });
    await expect(page.locator('button.table-card')).toHaveCount(6);
    await expect(page.getByRole('img', { name: 'Stock, 28 cards' })).toBeVisible();
  });

  test('an illegal card is refused with the reason, and a legal one is played', async ({ page }) => {
    await page.goto('/#/learn/tute.1.follow');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'As de oros' }).click();
    await expect(page.getByRole('alert')).toHaveText('You must follow suit: play espadas.');
    const card = page.getByRole('button', { name: 'Cuatro de espadas' });
    await card.click();
    await card.click();
    await expect(page.locator('.lesson-feedback')).toContainText('neither of your espadas');
  });

  test('finishes a rules lesson: singing the twenty', async ({ page }) => {
    await page.goto('/#/learn/tute.1.sing');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Sing the 20 in copas' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Las veinte en copas');
    await page.getByRole('button', { name: 'Next' }).click();
    for (const d of '20') await page.getByRole('button', { name: d, exact: true }).click();
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Yes');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  });

  test('a drill: what your hand can sing', async ({ page }) => {
    await page.goto('/#/practice/tute/drill-tute-cantes?seed=e2e');
    const text = page.locator('.lesson-text');
    await expect(text).toContainText('how many points can you sing?');
    const trumpWord = ((await text.textContent()) ?? '').match(/(Oros|Copas|Espadas|Bastos) are trumps/)?.[1]?.toLowerCase() ?? '';
    const trump = SUITS[trumpWord] ?? '';
    const labels = await page.locator('.table-card[role="img"], button.table-card').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''));
    const mine = new Set(
      labels.flatMap((l) => {
        const m = CARD.exec(l);
        return m ? [`${RANKS[m[1] ?? ''] ?? ''}${SUITS[m[2] ?? ''] ?? ''}`] : [];
      }),
    );
    const total = Object.values(SUITS).reduce((sum, s) => sum + (mine.has(`R${s}`) && mine.has(`C${s}`) ? (s === trump ? 40 : 20) : 0), 0);
    for (const d of String(total)) await page.getByRole('button', { name: d, exact: true }).click();
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Yes');
  });
});
