/**
 * The classic card pack end to end (milestone 13), at every size: for Hearts, Spades, Gin Rummy
 * and Blackjack, play a game against level 1 to the end and open its review; finish a lesson;
 * answer a drill (the right answers come from the games' own modules, see m13-answers.ts). Gin
 * Rummy also runs pass and play with its hands covered.
 */
import type { Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { expect, noHorizontalScroll, test } from './fixtures';
import { blackjackMove, ginMove, playToEnd, startClassic, tapTwice, trickMove, typeNumber } from './m13-helpers';

interface Answers {
  'drill-hearts-points': number;
  'drill-spades-count': number;
  'drill-gin-deadwood': number;
  'drill-gin-discard': string;
  'drill-blackjack-chart': string;
  'spades.1.score': [number, number];
  names: { Qs: string; '9d': string };
}

let answers: Answers | null = null;
function answersFor(): Answers {
  answers ??= JSON.parse(execFileSync('node_modules/.bin/tsx', ['tests/e2e/m13-answers.ts', 'e2e'], { encoding: 'utf8' })) as Answers;
  return answers;
}

async function reviewOpens(page: Page): Promise<void> {
  await page.getByRole('link', { name: 'Review' }).click();
  await expect(page.locator('.moments')).toBeVisible({ timeout: 180_000 });
  await expect(page.locator('.accuracy')).toContainText('You:');
  await noHorizontalScroll(page);
}

test.describe('classic card pack', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('hearts: plays a hand against level 1 to the end, then reviews it', async ({ page }) => {
    test.setTimeout(300_000);
    await startClassic(page, 'hearts', 'e2e-hearts', 1, undefined, { group: 'Game to', choice: 'One hand' });
    await noHorizontalScroll(page);
    await playToEnd(page, trickMove);
    await expect(page.locator('.result-card h2')).toBeVisible();
    await reviewOpens(page);
  });

  test('spades: bids and plays a hand against level 1 to the end, then reviews it', async ({ page }) => {
    test.setTimeout(300_000);
    await startClassic(page, 'spades', 'e2e-spades', 1, undefined, { group: 'Game to', choice: 'One hand' });
    await playToEnd(page, trickMove);
    await expect(page.locator('.result-card h2')).toBeVisible();
    await reviewOpens(page);
  });

  test('gin rummy: plays a hand against level 1 to the knock, then reviews it', async ({ page }) => {
    test.setTimeout(300_000);
    await startClassic(page, 'gin-rummy', 'e2e-gin', 1, undefined, { group: 'Game to', choice: 'One hand' });
    await noHorizontalScroll(page);
    await playToEnd(page, ginMove);
    await expect(page.locator('.result-card h2')).toBeVisible();
    await reviewOpens(page);
  });

  test('blackjack: plays ten rounds against the dealer, then reviews them', async ({ page }) => {
    test.setTimeout(300_000);
    await startClassic(page, 'blackjack', 'e2e-blackjack', 1, undefined, { group: 'Rounds', choice: '10' });
    await noHorizontalScroll(page);
    await playToEnd(page, blackjackMove);
    await expect(page.locator('.result-card h2')).toBeVisible();
    await reviewOpens(page);
  });

  test('finishes a lesson in each game', async ({ page }) => {
    test.setTimeout(180_000);
    const a = answersFor();
    const done = page.getByRole('heading', { name: 'Lesson complete' });
    const next = page.getByRole('button', { name: 'Next' });
    const right = page.locator('.lesson-feedback');

    // Hearts: void in the suit led, throw the queen of spades.
    await page.goto('/#/learn/hearts.1.void');
    await next.click();
    await tapTwice(page, a.names.Qs);
    await expect(right).toHaveAttribute('data-tone', 'good');
    await next.click();
    await expect(done).toBeVisible();

    // Spades: made or set, by one trick.
    await page.goto('/#/learn/spades.1.score');
    await next.click();
    await typeNumber(page, a['spades.1.score'][0]);
    await expect(right).toHaveAttribute('data-tone', 'good');
    await next.click();
    await typeNumber(page, a['spades.1.score'][1]);
    await expect(right).toHaveAttribute('data-tone', 'good');
    await next.click();
    await expect(done).toBeVisible();

    // Gin Rummy: knock.
    await page.goto('/#/learn/gin-rummy.1.knock');
    await next.click();
    await page.getByRole('button', { name: a.names['9d'], exact: true }).click();
    await page.getByRole('button', { name: /^Knock with the 9♦/ }).click();
    await expect(right).toHaveAttribute('data-tone', 'good');
    await next.click();
    await expect(done).toBeVisible();

    // Blackjack: double down.
    await page.goto('/#/learn/blackjack.2.double');
    await next.click();
    await page.getByRole('button', { name: 'Double', exact: true }).click();
    await expect(right).toHaveAttribute('data-tone', 'good');
    await next.click();
    await expect(done).toBeVisible();
    await noHorizontalScroll(page);
  });

  test('answers a drill in each game', async ({ page }) => {
    test.setTimeout(120_000);
    const a = answersFor();
    const right = page.locator('.lesson-feedback');
    for (const [game, id] of [
      ['hearts', 'drill-hearts-points'],
      ['spades', 'drill-spades-count'],
      ['gin-rummy', 'drill-gin-deadwood'],
    ] as const) {
      await page.goto(`/#/practice/${game}/${id}?seed=e2e`);
      await typeNumber(page, a[id]);
      await expect(right).toHaveAttribute('data-tone', 'good');
    }

    // Gin Rummy: the discard that leaves the least deadwood (a problem with one best answer).
    await page.goto('/#/practice/gin-rummy/drill-gin-discard?seed=e2e');
    await tapTwice(page, a['drill-gin-discard']);
    await expect(right).toHaveAttribute('data-tone', 'good');

    // Blackjack: the basic-strategy trainer.
    await page.goto('/#/practice/blackjack/drill-blackjack-chart?seed=e2e');
    await page.getByRole('button', { name: a['drill-blackjack-chart'], exact: true }).click();
    await expect(right).toHaveAttribute('data-tone', 'good');
    await noHorizontalScroll(page);
  });

  test('gin rummy pass and play covers each hand between the two people', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/#/games/gin-rummy?seed=e2e-pnp-gin');
    await page.getByRole('button', { name: /^Play/ }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('radiogroup', { name: 'Who plays' }).getByRole('radio', { name: 'Pass and play', exact: true }).click();
    await dialog.getByRole('textbox', { name: 'Name for First player' }).fill('Ana');
    await dialog.getByRole('textbox', { name: 'Name for Dealer' }).fill('Ben');
    await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
    await expect(page).toHaveURL(/#\/play\/g_/);
    const covers = new Set<string>();
    for (let moves = 0; moves < 4; ) {
      const cover = page.locator('.pass-cover h1');
      if (await cover.isVisible()) {
        const title = (await cover.textContent()) ?? '';
        covers.add(title);
        await expect(page.locator('button.table-card')).toHaveCount(0);
        await page.getByRole('button', { name: `I am ${title.replace('Pass the device to ', '')}: show my hand` }).click();
        continue;
      }
      await expect(page.locator('.status-turn')).toHaveText(/(Ana|Ben) to move/);
      await ginMove(page);
      moves++;
      await page.waitForTimeout(150);
    }
    expect(covers.has('Pass the device to Ana')).toBe(true);
    expect(covers.has('Pass the device to Ben')).toBe(true);
  });
});
