/**
 * Brisca end to end (PLAN.md 2.10): start a hand, play it to the end against level 1, review it;
 * finish a lesson; solve an endgame problem; a drill.
 */
import type { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { findLegal } from '../../src/core/contract';
import { brisca } from '../../src/games/brisca/rules';
import { expect, test } from './fixtures';

const RANKS: Record<string, string> = { A: 'As', '2': 'Dos', '3': 'Tres', '4': 'Cuatro', '5': 'Cinco', '6': 'Seis', '7': 'Siete', S: 'Sota', C: 'Caballo', R: 'Rey' };
const SUITS: Record<string, string> = { o: 'oros', c: 'copas', e: 'espadas', b: 'bastos' };
const cardLabel = (card: string) => `${RANKS[card[0] ?? ''] ?? ''} de ${SUITS[card[1] ?? ''] ?? ''}`;
const endgames = JSON.parse(readFileSync(new URL('../../src/games/brisca/practice/endgames.json', import.meta.url), 'utf8')) as { problems: { id: string; position: string; line: string[] }[] };

async function startBrisca(page: Page, seed: string, level = 1) {
  await page.goto(`/#/games/brisca?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: String(level), exact: true }).click();
  await dialog.getByRole('radio', { name: 'You lead first', exact: true }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

/** Plays a card by tapping it twice (lift, then play). */
async function playFirstCard(page: Page) {
  const card = page.locator('button.table-card').first();
  await card.click();
  await card.click();
}

test.describe('brisca', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a whole hand against level 1 to the end, then reviews it', async ({ page }) => {
    test.setTimeout(180_000);
    await startBrisca(page, 'e2e-hand');
    const turn = page.locator('.status-turn');
    for (let i = 0; i < 40; i++) {
      await expect(turn).toHaveText(/Your move|Game over/, { timeout: 20_000 });
      if ((await turn.textContent())?.includes('Game over')) break;
      await expect(page.locator('button.table-card').first()).toBeVisible();
      await playFirstCard(page);
      await page.waitForTimeout(50);
    }
    await expect(turn).toHaveText(/Game over/, { timeout: 20_000 });
    await expect(page.locator('.result-card h2')).toHaveText(/You win|The CPU wins|Draw/);
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.moments')).toBeVisible({ timeout: 90_000 });
    await expect(page.locator('.accuracy')).toContainText('You:');
  });

  test('the swap: the 7 of trumps takes the turned card', async ({ page }) => {
    await page.goto('/#/learn/brisca.1.swap');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Swap your Siete de copas' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Rey de copas');
  });

  test('finishes a rules lesson: trumps beat any other suit', async ({ page }) => {
    await page.goto('/#/learn/brisca.1.trumps');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Copas', exact: true }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    const card = page.getByRole('button', { name: 'Dos de copas' });
    await card.click();
    await card.click();
    await expect(page.locator('.lesson-feedback')).toContainText('Even the Dos of trumps');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  });

  test('solves an endgame problem proved by the solver', async ({ page }) => {
    const first = endgames.problems[0];
    if (!first) throw new Error('no Brisca endgame problems');
    await page.goto(`/#/practice/brisca/endgames?id=${first.id}`);
    await expect(page.getByText(/Your turn\. Find the best play\./)).toBeVisible({ timeout: 15_000 });
    // Play the solution's cards; the other side's answers play themselves. Which cards are the
    // student's follows from replaying the line through the rules.
    let state = brisca.codec.state.fromText(first.position);
    const student = brisca.turn(state);
    const mine: string[] = [];
    for (const move of first.line) {
      if (brisca.turn(state) === student) mine.push(move);
      const seat = brisca.turn(state) ?? 0;
      const action = findLegal(brisca, state, seat, brisca.codec.action.fromText(move));
      if (!action) throw new Error(`${move} is not legal in the problem`);
      state = brisca.apply(state, action).state;
    }
    for (const [i, move] of mine.entries()) {
      const card = page.getByRole('button', { name: cardLabel(move) });
      await card.click();
      await card.click();
      if (i + 1 < mine.length) await expect(page.getByText(/Your turn\. Find the best play\./)).toBeVisible({ timeout: 15_000 });
    }
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!', { timeout: 20_000 });
  });

  test('a drill: count the points in your hand', async ({ page }) => {
    await page.goto('/#/practice/brisca/drill-values?seed=e2e');
    await expect(page.locator('.lesson-text')).toContainText('How many points are in your three cards?');
    const points: Record<string, number> = { As: 11, Tres: 10, Rey: 4, Caballo: 3, Sota: 2 };
    const names = await page.locator('button.table-card, .table-card[role="img"]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''));
    const mine = names.filter((n) => / de (oros|copas|espadas|bastos)$/.test(n) && !n.startsWith('CPU')).slice(0, 3);
    const total = mine.reduce((sum, n) => sum + (points[n.split(' ')[0] ?? ''] ?? 0), 0);
    for (const d of String(total)) await page.getByRole('button', { name: d, exact: true }).click();
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Yes');
  });
});
