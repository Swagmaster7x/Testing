/** Milestone 10 screenshots: Mahjong Learn and Practice at 844 × 390 (twice the pixels). */
import type { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { expect, test } from './fixtures';
import { playToEnd, startMahjong } from './mahjong-helpers';

const DIR = 'screenshots/m10';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });
const problems = JSON.parse(readFileSync(new URL('../../src/games/mahjong/practice/discards.json', import.meta.url), 'utf8')) as { problems: { id: string; best: string[]; rating: number }[] };

const next = (page: Page) => page.getByRole('button', { name: 'Next' }).click();
const HONOURS: Readonly<Record<string, string>> = { E: 'East wind', S: 'South wind', W: 'West wind', N: 'North wind', Wd: 'White dragon', Gd: 'Green dragon', Rd: 'Red dragon' };
const SUITS: Readonly<Record<string, string>> = { m: 'characters', p: 'dots', s: 'bamboo' };
const tileName = (code: string) => HONOURS[code] ?? `${code[0] ?? ''} ${SUITS[code[1] ?? ''] ?? ''}`;
async function throwTile(page: Page, code: string) {
  const tile = page.locator(`button.mj-tile[aria-label="${tileName(code)}"]`).last();
  await tile.click();
  await tile.click();
}

test('milestone 10 screens: mahjong learn and practice', async ({ page }) => {
  test.setTimeout(600_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/#/games/mahjong');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '01-hub');

  await page.goto('/#/games/mahjong/learn');
  await expect(page.locator('.lesson-row').first()).toBeVisible();
  await shot(page, '02-learn-basics');
  await page.getByRole('radio', { name: 'Skills' }).click();
  await shot(page, '03-learn-hong-kong-track');
  await page.getByRole('radio', { name: /Table/ }).click();
  await shot(page, '04-learn-table-ready');

  // Stage 0: the tiles, with learner labels.
  await page.goto('/#/learn/mahjong.0.tiles');
  await next(page);
  await expect(page.locator('.lesson-text')).toContainText('short label');
  await shot(page, '05-lesson-tiles');

  // Stage 1: a chow from the claim prompt.
  await page.goto('/#/learn/mahjong.1.chow');
  await next(page);
  await expect(page.locator('.mj-prompt')).toBeVisible();
  await shot(page, '06-lesson-chow-prompt');
  await page.locator('.mj-call[data-call="chow"]').click();
  await expect(page.locator('.lesson-feedback')).toContainText('lay the run face up');
  await shot(page, '07-lesson-chow-done');

  // Stage 1: complete, but worth less than the minimum.
  await page.goto('/#/learn/mahjong.1.minimum');
  await next(page);
  await page.getByRole('button', { name: 'It is worth less than the minimum' }).click();
  await shot(page, '08-lesson-minimum');

  // Stage 2: counting the useful tiles, a wrong throw first.
  await page.goto('/#/learn/mahjong.2.useful');
  await next(page);
  await next(page);
  await throwTile(page, '7m');
  await expect(page.locator('.lesson-feedback')).toContainText('12 useful tiles instead of 14');
  await shot(page, '09-lesson-useful-wrong');

  // Stage 2: waits, with the number pad.
  await page.goto('/#/learn/mahjong.2.waits');
  await next(page);
  await expect(page.getByRole('button', { name: 'Check', exact: true })).toBeVisible();
  await shot(page, '10-lesson-waits');

  // Stage 2: safe tiles against a player with three sets called.
  await page.goto('/#/learn/mahjong.2.defence');
  await next(page);
  await next(page);
  await throwTile(page, '9m');
  await expect(page.locator('.lesson-feedback')).toContainText('threw the 9 characters themselves');
  await shot(page, '11-lesson-safe-tile');

  // The Hong Kong track: flowers, patterns, payments.
  await page.goto('/#/learn/mahjong.3.hk-flowers');
  await next(page);
  await next(page);
  await shot(page, '12-hk-flowers');
  await page.goto('/#/learn/mahjong.3.hk-patterns');
  await next(page);
  await next(page);
  await shot(page, '13-hk-patterns-check');
  await page.goto('/#/learn/mahjong.3.hk-pay');
  await next(page);
  await shot(page, '14-hk-payments');
  await page.getByRole('button', { name: '4', exact: true }).click();
  await page.getByRole('button', { name: '8', exact: true }).click();
  await page.getByRole('button', { name: 'Check', exact: true }).click();
  await next(page);
  await page.getByRole('button', { name: '9', exact: true }).click();
  await page.getByRole('button', { name: '6', exact: true }).click();
  await page.getByRole('button', { name: 'Check', exact: true }).click();
  await next(page);
  await page.locator('.mj-call[data-call="win"]').click();
  await expect(page.locator('.mj-result')).toBeVisible();
  await shot(page, '15-hk-payments-sheet');

  // Table-ready.
  await page.goto('/#/learn/mahjong.table.wall');
  await next(page);
  await shot(page, '16-table-wall');

  // The stage check.
  await page.goto('/#/learn/mahjong.check.stage-1');
  await expect(page.locator('.lesson-text')).toBeVisible();
  await shot(page, '17-stage-check');

  // Practice.
  await page.goto('/#/games/mahjong/practice');
  await expect(page.locator('.practice-card').first()).toBeVisible();
  await shot(page, '18-practice');
  await page.locator('.practice-grid').evaluate((el) => el.scrollIntoView({ block: 'end' }));
  await shot(page, '19-practice-drills');
  const problem = problems.problems.find((p) => p.best.length === 1 && p.rating >= 1000) ?? problems.problems[0];
  if (!problem) throw new Error('no problem');
  await page.goto(`/#/practice/mahjong/discards?id=${problem.id}`);
  await expect(page.getByText('Your turn. Find the best play.')).toBeVisible({ timeout: 15_000 });
  await page.getByRole('button', { name: 'Hint' }).click();
  await shot(page, '20-problem-hint');
  await throwTile(page, problem.best[0] ?? '');
  await expect(page.locator('.lesson-feedback')).toContainText('Solved!');
  await shot(page, '21-problem-solved');

  for (const [id, name] of [
    ['drill-mahjong-discard', '22-drill-discard'],
    ['drill-mahjong-waits', '23-drill-waits'],
    ['drill-mahjong-patterns', '24-drill-patterns'],
    ['drill-mahjong-score', '25-drill-score'],
    ['drill-mahjong-safe', '26-drill-safe'],
  ] as const) {
    await page.goto(`/#/practice/mahjong/${id}?seed=shots`);
    await expect(page.locator('.lesson-text')).toBeVisible();
    await shot(page, name);
  }

  // Counting a won hand yourself.
  await startMahjong(page, { seed: 'win-10', level: 2, oneHand: true });
  await page.getByRole('switch', { name: 'Score hands for me' }).click();
  await page.getByRole('switch', { name: 'Tiles from ready and useful tiles' }).click();
  await playToEnd(page, 'efficient');
  const result = page.locator('.mj-result');
  await expect(result.locator('.mj-count')).toBeVisible();
  await shot(page, '27-count-yourself');
  await result.getByRole('spinbutton', { name: 'Faan' }).fill('3');
  await result.getByRole('button', { name: 'Check' }).click();
  await expect(result.locator('.mj-count-verdict')).toBeVisible();
  await shot(page, '28-count-yourself-checked');

  // Progress: the table-ready checklist.
  await page.goto('/#/progress');
  await page.locator('button.progress-game', { hasText: 'Mahjong' }).click();
  await expect(page.locator('#ready-title')).toBeVisible();
  await page.locator('section[aria-labelledby="ready-title"]').evaluate((el) => el.scrollIntoView({ block: 'end' }));
  await shot(page, '29-progress');
});
