/**
 * Dominoes end to end (PLAN.md 2.10): play a whole hand against level 1 to the end and review it;
 * finish a lesson; solve an endgame problem proved by exact search; a counting drill.
 */
import type { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { findLegal } from '../../src/core/contract';
import { dominoes } from '../../src/games/dominoes/rules';
import { expect, test } from './fixtures';

const endgames = JSON.parse(readFileSync(new URL('../../src/games/dominoes/practice/endgames.json', import.meta.url), 'utf8')) as { problems: { id: string; position: string; line: string[] }[] };

/** The label a tile carries on the table: "3-5", or "5-5 (double)". */
const tileName = (tile: string) => (tile[0] === tile[2] ? `${tile} (double)` : tile);

/** Plays a move given in notation ("3-5L", "6-6", "pass", "draw") by tapping, as a person would. */
async function playMove(page: Page, move: string) {
  if (move === 'pass') return page.getByRole('button', { name: 'Pass (knock)' }).click();
  if (move === 'draw') return page.getByRole('button', { name: 'Draw a tile' }).click();
  const tile = move.replace(/[LR]$/, '');
  const button = page.getByRole('button', { name: tileName(tile), exact: true });
  await button.click();
  const end = move.endsWith('L') ? 'left' : move.endsWith('R') ? 'right' : null;
  const marker = end ? page.getByRole('button', { name: new RegExp(`^Play ${tile.replace(/[()]/g, '')}.* on the ${end} end`) }) : null;
  // A tile that fits both ends waits for the end; otherwise a second tap plays it.
  if (marker && (await page.locator('button.line-end').count()) > 1) await marker.click();
  else await button.click();
}

test.describe('dominoes', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a whole hand against level 1 to the end, then reviews it', async ({ page }) => {
    test.setTimeout(240_000);
    await page.goto('/#/games/dominoes?seed=e2e-hand');
    await page.getByRole('button', { name: /^Play/ }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: '1', exact: true }).click();
    await dialog.getByRole('button', { name: 'Change the rules' }).click();
    await dialog.getByRole('radiogroup', { name: 'Play to' }).getByRole('radio', { name: 'One hand' }).click();
    await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
    await expect(page).toHaveURL(/#\/play\/g_/);
    const turn = page.locator('.status-turn');
    for (let i = 0; i < 40; i++) {
      await expect(turn).toHaveText(/Your move|Game over/, { timeout: 30_000 });
      if ((await turn.textContent())?.includes('Game over')) break;
      const knock = page.locator('.knock-btn');
      if (await knock.isVisible()) {
        await knock.click();
      } else {
        const tile = page.locator('button.table-tile').first();
        await tile.click();
        const ends = page.locator('button.line-end');
        if ((await ends.count()) > 0) await ends.first().click();
        else await tile.click();
      }
      await page.waitForTimeout(100);
    }
    await expect(turn).toHaveText(/Game over/, { timeout: 30_000 });
    await expect(page.locator('.result-card h2')).toHaveText(/You win|The CPU wins|Draw|win|lose/i);
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.moments')).toBeVisible({ timeout: 120_000 });
    await expect(page.locator('.accuracy')).toContainText('You:');
  });

  test('finishes a rules lesson: play if you can, pass if you cannot', async ({ page }) => {
    await page.goto('/#/learn/dominoes.1.pass');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Pass (knock)' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Paso');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.locator('.lesson-text')).toContainText('The others played on', { timeout: 15_000 });
    await page.getByRole('button', { name: 'Next' }).click();
    await playMove(page, '1-6R');
    await expect(page.locator('.lesson-feedback')).toContainText('when a tile fits, it must be played');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  });

  test('solves an endgame problem proved by exact search', async ({ page }) => {
    const first = endgames.problems[0];
    if (!first) throw new Error('no dominoes endgame problems');
    await page.goto(`/#/practice/dominoes/endgames?id=${first.id}`);
    await expect(page.getByText(/Your turn\. Find the best play\./)).toBeVisible({ timeout: 15_000 });
    // The student's plays follow from replaying the line through the rules.
    let state = dominoes.codec.state.fromText(first.position);
    const student = dominoes.turn(state);
    const mine: string[] = [];
    for (const move of first.line) {
      const seat = dominoes.turn(state) ?? 0;
      if (seat === student) mine.push(move);
      const action = findLegal(dominoes, state, seat, dominoes.codec.action.fromText(move));
      if (!action) throw new Error(`${move} is not legal in the problem`);
      state = dominoes.apply(state, action).state;
    }
    for (const [i, move] of mine.entries()) {
      await playMove(page, move);
      if (i + 1 < mine.length) await expect(page.getByText(/Your turn\. Find the best play\./)).toBeVisible({ timeout: 15_000 });
    }
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!', { timeout: 20_000 });
  });

  test('a drill: the pips you cannot see', async ({ page }) => {
    await page.goto('/#/practice/dominoes/drill-pips?seed=e2e');
    await expect(page.locator('.lesson-text')).toContainText('How many pips are in the hands you cannot see?');
    // Every tile you can see carries its name: the line and your hand.
    const names = await page.locator('.table-tile[role="img"], button.table-tile').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''));
    const seen = names.filter((n) => /^\d-\d/.test(n)).reduce((sum, n) => sum + Number(n[0]) + Number(n[2]), 0);
    for (const d of String(168 - seen)) await page.getByRole('button', { name: d, exact: true }).click();
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Yes');
  });
});
