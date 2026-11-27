/**
 * Mahjong Learn and Practice end to end (PLAN.md 2.10, milestone 10): finish a rules lesson with
 * the claim prompt, pass the basics with "I already know this", solve a rated discard problem,
 * score a hand in a drill, and count a won hand yourself with "Score hands for me" off.
 */
import type { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { expect, noHorizontalScroll, test } from './fixtures';
import { playToEnd, startMahjong } from './mahjong-helpers';

const problems = JSON.parse(readFileSync(new URL('../../src/games/mahjong/practice/discards.json', import.meta.url), 'utf8')) as { problems: { id: string; best: string[]; rating: number }[] };

const next = (page: Page) => page.getByRole('button', { name: 'Next' }).click();

/** The name the table gives a tile, from its code (the app's modules do not load in the test runner). */
const HONOURS: Readonly<Record<string, string>> = { E: 'East wind', S: 'South wind', W: 'West wind', N: 'North wind', Wd: 'White dragon', Gd: 'Green dragon', Rd: 'Red dragon' };
const SUITS: Readonly<Record<string, string>> = { m: 'characters', p: 'dots', s: 'bamboo' };
const tileName = (code: string) => HONOURS[code] ?? `${code[0] ?? ''} ${SUITS[code[1] ?? ''] ?? ''}`;

/** Taps a tile in your hand twice: lift, then throw. */
async function throwTile(page: Page, code: string) {
  const tile = page.locator(`button.mj-tile[aria-label="${tileName(code)}"]`).last();
  await tile.click();
  await tile.click();
}

async function typeNumber(page: Page, n: number) {
  for (const d of String(n)) await page.getByRole('button', { name: d, exact: true }).click();
  await page.getByRole('button', { name: 'Check', exact: true }).click();
}

test.describe('mahjong learn and practice', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('finishes the chow lesson with the claim prompt and a throw', async ({ page }) => {
    await page.goto('/#/learn/mahjong.1.chow');
    await expect(page.locator('.lesson-text')).toContainText('only be called on the tile thrown by the player on your left');
    await next(page);
    const prompt = page.locator('.mj-prompt');
    await expect(prompt).toContainText('Left discarded 6 bamboo');
    await prompt.locator('.mj-call[data-call="chow"]').click();
    await expect(page.locator('.lesson-feedback')).toContainText('lay the run face up: 6-7-8 bamboo');
    await next(page);
    await throwTile(page, 'W');
    await expect(page.locator('.lesson-feedback')).toContainText('still makes 13 tiles');
    await next(page);
    await page.getByRole('button', { name: 'No: only the player on your left feeds a chow' }).click();
    await next(page);
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
    await noHorizontalScroll(page);
  });

  test('passes the basics with "I already know this"', async ({ page }) => {
    await page.goto('/#/games/mahjong/learn');
    await page.getByRole('radio', { name: 'Basics' }).click();
    await page.getByRole('link', { name: 'I already know this' }).click();
    await expect(page.locator('.lesson-text')).toContainText('How many tiles does a complete hand hold');
    await page.getByRole('button', { name: '14', exact: true }).click();
    await throwTile(page, 'W');
    await next(page);
    await expect(page.getByRole('heading', { name: 'Stage passed' })).toBeVisible();
  });

  test('a lesson proves the best throw by counting what is in sight', async ({ page }) => {
    await page.goto('/#/learn/mahjong.2.useful');
    await next(page);
    await next(page);
    await throwTile(page, '7m');
    await expect(page.locator('.lesson-feedback')).toContainText('only 2 of those are left: 12 useful tiles instead of 14');
    await throwTile(page, '1p');
    await expect(page.locator('.lesson-feedback')).toContainText('the 8 characters are all still out there');
  });

  test('solves a rated discard problem', async ({ page }) => {
    const problem = problems.problems.find((p) => p.best.length === 1 && p.rating >= 900) ?? problems.problems[0];
    if (!problem) throw new Error('no problems');
    await page.goto(`/#/practice/mahjong/discards?id=${problem.id}`);
    await expect(page.getByText('Your turn. Find the best play.')).toBeVisible({ timeout: 15_000 });
    await throwTile(page, problem.best[0] ?? '');
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!', { timeout: 15_000 });
  });

  test('a drill: score a winning hand, then work out what you collect', async ({ page }) => {
    await page.goto('/#/practice/mahjong/drill-mahjong-score?seed=e2e');
    const ask = page.locator('.lesson-text');
    await expect(ask).toContainText('How many faan is it worth?');
    // A wrong count first: the drill says so, and shows the answer when asked.
    await typeNumber(page, 0);
    await expect(page.locator('.lesson-feedback')).toContainText('Not quite');
    await page.getByRole('button', { name: 'Show me' }).click();
    const [, faan = '0'] = /The answer is (\d+)/.exec((await page.locator('.lesson-feedback').textContent()) ?? '') ?? [];
    await next(page);
    // Then the payment, worked out from the base as a player does.
    const [, base = '0'] = /The base for \d+ faan is (\d+)/.exec((await ask.textContent()) ?? '') ?? [];
    const selfDrawn = /Self-drawn/.test((await ask.textContent()) ?? '');
    const total = selfDrawn ? 3 * 2 * Number(base) : 2 * Number(base) + 2 * Number(base);
    await typeNumber(page, total);
    await expect(page.locator('.lesson-feedback')).toContainText(`Yes, ${total}`);
    await next(page);
    await page.getByRole('button', { name: /^Win/ }).first().click();
    await expect(page.locator('.mj-result')).toContainText(`${faan} faan`);
    await next(page);
    await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible();
  });

  test('with "Score hands for me" off, a won hand asks for its faan first', async ({ page }) => {
    test.setTimeout(300_000);
    await startMahjong(page, { seed: 'win-10', level: 2, oneHand: true });
    await page.getByRole('switch', { name: 'Score hands for me' }).click();
    await expect(page.getByRole('switch', { name: 'Score hands for me' })).toHaveAttribute('aria-checked', 'false');
    await page.getByRole('switch', { name: 'Tiles from ready and useful tiles' }).click();
    await playToEnd(page, 'efficient');
    const result = page.locator('.mj-result');
    await expect(result).toContainText('You won by self-draw');
    await expect(result.locator('.mj-faan')).toHaveCount(0);
    await result.getByRole('spinbutton', { name: 'Faan' }).fill('1');
    await result.getByRole('button', { name: 'Check' }).click();
    await expect(result.locator('.mj-count-verdict')).toContainText('Not quite: you said 1');
    await expect(result.locator('.mj-faan')).toBeVisible();
    await expect(result.locator('.mj-pay')).toBeVisible();
  });
});
