/**
 * Milestone 14 (first part) screenshots: All Fives and Cuban double nine at 844 × 390 (twice the
 * pixels). The cross around the spinner at phone size, the count of the ends and a play's points,
 * three players, partners, the double-nine tiles, the coach, lessons, drills and the reference.
 */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m14a';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

/** Your turn: play the first tile that can go (on the first marked end), or pass or draw. */
async function playSomething(page: Page) {
  const knock = page.locator('.knock-btn');
  if (await knock.isVisible()) return knock.click();
  const tile = page.locator('button.table-tile').first();
  await tile.click();
  const ends = page.locator('button.line-end');
  if ((await ends.count()) > 0) await ends.first().click();
  else await tile.click();
}

async function startGame(page: Page, seed: string, preset: RegExp, level = '3', oneHand = false) {
  await page.goto(`/#/games/dominoes?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: level, exact: true }).click();
  await dialog.getByRole('radio', { name: preset }).click();
  if (oneHand) {
    await dialog.getByRole('button', { name: 'Change the rules' }).click();
    await dialog.getByRole('radiogroup', { name: 'Play to' }).getByRole('radio', { name: 'One hand' }).click();
  }
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

const turn = (page: Page) => page.locator('.status-turn');
const yourTurn = (page: Page) => expect(turn(page)).toHaveText(/Your move|Game over/, { timeout: 60_000 });

/** Plays on (`max` of your turns) until `done` holds or the game ends, checking while the others play too; returns true when `done` held. */
async function playUntil(page: Page, done: () => Promise<boolean>, max = 30): Promise<boolean> {
  let played = 0;
  for (let guard = 0; guard < max * 40; guard++) {
    if (await done()) return true;
    const text = (await turn(page).textContent()) ?? '';
    if (text.includes('Game over')) return false;
    if (text.includes('Your move')) {
      if (played >= max) return false;
      await playSomething(page);
      played++;
    }
    await page.waitForTimeout(100);
  }
  return done();
}

test('milestone 14a screens: All Fives and Cuban double nine', async ({ page }) => {
  test.setTimeout(600_000);

  await page.goto('/#/games/dominoes?seed=shots-m14a');
  await page.getByRole('button', { name: /^Play/ }).click();
  await page.getByRole('dialog').getByRole('radio', { name: /^All Fives \(two players\)/ }).click();
  await page.getByRole('button', { name: 'Change the rules' }).click();
  await shot(page, '01-rules-all-fives');
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();

  // All Fives for two: the lead, then on to a cross, with the scoring help on.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startGame(page, 'shots-m14a-fives', /^All Fives \(two players\)/);
  await yourTurn(page);
  await shot(page, '02-all-fives-table');
  await page.getByRole('switch', { name: 'Scoring plays (All Fives)' }).click();
  await playUntil(page, async () => (await page.getByRole('img', { name: /double/ }).count()) > 0 && (await page.locator('.line-end').count()) >= 3, 20);
  await yourTurn(page);
  await shot(page, '03-all-fives-cross');
  const tile = page.locator('button.table-tile').first();
  if (await tile.isVisible()) {
    await tile.click();
    await shot(page, '04-all-fives-tile-lifted');
    await tile.click();
  }
  // With motion on, catch a play that scores: its points show beside the tile.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const scored = await playUntil(page, () => page.locator('.score-pop').isVisible(), 40);
  if (scored) await shot(page, '05-all-fives-play-scores');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await playUntil(page, async () => (await page.locator('.table-tile').count()) > 0 && (await page.locator('.line-end').count()) >= 4, 30);
  await yourTurn(page);
  await page.locator('.coach-panel').scrollIntoViewIfNeeded();
  await shot(page, '06-all-fives-four-arms-coach');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await playUntil(page, () => page.locator('.domino-hand-over').isVisible(), 60);
  await shot(page, '07-all-fives-hand-over');

  // Three players, and partners.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startGame(page, 'shots-m14a-three', /^All Fives \(three players\)/);
  await yourTurn(page);
  await playUntil(page, async () => (await page.locator('.line-end').count()) >= 3, 12);
  await yourTurn(page);
  await shot(page, '08-all-fives-three-players');
  await startGame(page, 'shots-m14a-partners', /^All Fives \(partners\)/);
  await yourTurn(page);
  await playUntil(page, () => Promise.resolve(false), 3);
  await yourTurn(page);
  await shot(page, '09-all-fives-partners');

  // Cuban double nine: ten tiles each, tiles up to nine pips, fifteen asleep.
  await startGame(page, 'shots-m14a-cuban', /^Cuban double nine/);
  await yourTurn(page);
  await shot(page, '10-cuban-table');
  await page.getByRole('switch', { name: 'Tiles out and numbers left' }).click();
  await page.getByRole('switch', { name: 'Pip totals' }).click();
  await playUntil(page, () => Promise.resolve(false), 4);
  await yourTurn(page);
  await page.locator('.tiles-out').scrollIntoViewIfNeeded();
  await shot(page, '11-cuban-coach-tiles-out');
  await page.getByRole('switch', { name: 'Tiles up (everyone’s tiles face up)' }).click();
  await shot(page, '12-cuban-tiles-up');
  await page.getByRole('switch', { name: 'Tiles up (everyone’s tiles face up)' }).click();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await playUntil(page, () => page.locator('.domino-hand-over').isVisible(), 40);
  await shot(page, '13-cuban-hand-over');

  // Learn and practice.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/games/dominoes/learn');
  await page.getByRole('radio', { name: 'Advanced' }).click();
  await shot(page, '14-learn-advanced');
  await page.goto('/#/learn/dominoes.4.fives-spinner');
  await page.getByRole('button', { name: 'Next' }).click();
  await shot(page, '15-lesson-spinner');
  await page.getByRole('button', { name: '1-2', exact: true }).click();
  await page.getByRole('button', { name: '1-2', exact: true }).click();
  await expect(page.locator('.lesson-feedback')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('.lesson-text')).toContainText('third arm', { timeout: 15_000 });
  await shot(page, '16-lesson-spinner-arm');
  await page.goto('/#/learn/dominoes.4.cuban-block');
  await page.getByRole('button', { name: 'Next' }).click();
  await shot(page, '17-lesson-cuban-block');
  await page.goto('/#/practice/dominoes/drill-fives-count?seed=shots');
  await expect(page.locator('.lesson-text')).toBeVisible();
  await shot(page, '18-drill-fives-count');
  await page.goto('/#/practice/dominoes/drill-cuban-count?seed=shots');
  await expect(page.locator('.lesson-text')).toBeVisible();
  await shot(page, '19-drill-cuban-count');
  await page.goto('/#/games/dominoes/practice');
  await shot(page, '20-practice');
  await page.goto('/#/games/dominoes/reference');
  await page.getByRole('heading', { name: 'All Fives' }).scrollIntoViewIfNeeded();
  await shot(page, '21-reference');
});

test('milestone 14a screens: the cross and the double nine on a tablet and a laptop', async ({ page }) => {
  test.setTimeout(300_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [w, h, name] of [
    [1180, 820, 'tablet'],
    [1440, 900, 'laptop'],
  ] as const) {
    await page.setViewportSize({ width: w, height: h });
    await startGame(page, `shots-m14a-${name}`, /^All Fives \(two players\)/);
    await yourTurn(page);
    await playUntil(page, async () => (await page.locator('.line-end').count()) >= 4, 30);
    await yourTurn(page);
    await shot(page, `22-${name}-all-fives-cross`);
    await startGame(page, `shots-m14a-${name}-cuban`, /^Cuban double nine/);
    await yourTurn(page);
    await playUntil(page, () => Promise.resolve(false), 5);
    await yourTurn(page);
    await shot(page, `23-${name}-cuban`);
  }
});
