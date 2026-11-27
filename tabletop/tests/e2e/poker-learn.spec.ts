/**
 * Hold'em Learn and Practice end to end (PLAN.md 2.10): finish a lesson with the bet controls,
 * pass a stage check with cards up, solve a problem proved by exact equity, and do two drills,
 * answering from what the page shows (the poker modules that read preflop.json do not load in
 * the test runner, and a player has only the table anyway).
 */
import type { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { Card } from '../../src/games/holdem/cards';
import { evaluate } from '../../src/games/holdem/evaluate';
import { expect, test } from './fixtures';

const spots = JSON.parse(readFileSync(new URL('../../src/games/holdem/practice/spots.json', import.meta.url), 'utf8')) as { problems: { id: string; line: string[]; rating: number }[] };

const next = (page: Page) => page.getByRole('button', { name: 'Next' }).click();
/** Next once the scripted reply has played (Next waits for it). */
async function nextAfterReply(page: Page) {
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled({ timeout: 15_000 });
  await next(page);
}

const RANK: Readonly<Record<string, string>> = { Two: '2', Three: '3', Four: '4', Five: '5', Six: '6', Seven: '7', Eight: '8', Nine: '9', Ten: 'T', Jack: 'J', Queen: 'Q', King: 'K', Ace: 'A' };
const SUIT: Readonly<Record<string, string>> = { spades: 's', hearts: 'h', diamonds: 'd', clubs: 'c' };
/** A card from the name the table gives it: "Ten of clubs", "Your card: Ace of hearts". */
function cardOf(label: string): Card {
  const m = /(\w+) of (\w+)$/.exec(label);
  if (!m) throw new Error(`not a card: ${label}`);
  return `${RANK[m[1] ?? ''] ?? '?'}${SUIT[m[2] ?? ''] ?? '?'}` as Card;
}

async function typeNumber(page: Page, n: number) {
  for (const d of String(n)) await page.getByRole('button', { name: d, exact: true }).click();
  await page.getByRole('button', { name: 'Check', exact: true }).click();
}

test.describe('poker learn and practice', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('finishes a rules lesson with the bet controls: call, check, raise', async ({ page }) => {
    await page.goto('/#/learn/poker.1.actions');
    await expect(page.locator('.lesson-text')).toContainText('up to three choices');
    await next(page);
    await page.locator('.bet-call').click();
    await expect(page.locator('.lesson-feedback')).toContainText('You put in 6 to match');
    await nextAfterReply(page);
    await expect(page.locator('.lesson-text')).toContainText('Diego checked');
    await page.locator('.bet-call').click();
    await expect(page.locator('.lesson-feedback')).toContainText('Both of you checked');
    await nextAfterReply(page);
    await expect(page.locator('.lesson-text')).toContainText('Diego bets 10');
    // Raise opens the sizing tray; pressing it again confirms the smallest raise, to 20.
    await page.locator('.bet-raise').click();
    await expect(page.locator('.bet-tray')).toBeVisible();
    await page.locator('.bet-raise').click();
    await expect(page.locator('.lesson-feedback')).toContainText('A raise');
    await nextAfterReply(page);
    await page.getByRole('button', { name: 'Only when nobody has bet in this round' }).click();
    await next(page);
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  });

  test('works out pot odds with cards up and makes the call the equity proves', async ({ page }) => {
    await page.goto('/#/learn/poker.2.pot-odds');
    await next(page);
    await next(page);
    await typeNumber(page, 25);
    await expect(page.locator('.lesson-feedback')).toContainText('Yes, 25%');
    await next(page);
    // Cards up: the other hand is drawn face up with its name.
    await expect(page.getByRole('img', { name: 'King of clubs' })).toBeVisible();
    await next(page);
    await page.getByRole('button', { name: 'Call 14' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('On average it gains');
    await next(page);
    await next(page);
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  });

  test('passes the stage check of the basics with every hand face up', async ({ page }) => {
    await page.goto('/#/games/poker/learn');
    await page.getByRole('link', { name: 'I already know this' }).click();
    await expect(page.locator('.lesson-text')).toContainText('Who wins');
    for (const answer of ['You: any pair beats a high card', 'You: a flush beats a straight', 'You: your king outranks his jack']) {
      await page.getByRole('button', { name: answer }).click();
    }
    await next(page);
    await expect(page.getByRole('heading', { name: 'Stage passed' })).toBeVisible();
  });

  test('solves an all-in problem proved by exact equity', async ({ page }) => {
    const problem = spots.problems.find((p) => p.line[0] === 'call');
    if (!problem) throw new Error('no call problem');
    await page.goto(`/#/practice/poker/spots?id=${problem.id}`);
    await expect(page.getByText('Your turn. Find the best play.')).toBeVisible({ timeout: 15_000 });
    await page.locator('.bet-call').click();
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!', { timeout: 15_000 });
  });

  test('a drill: the price of a call, then call or fold with the equity shown', async ({ page }) => {
    await page.goto('/#/practice/poker/drill-poker-odds?seed=e2e');
    const ask = page.locator('.lesson-text');
    await expect(ask).toContainText('What share of the final pot');
    // Work it out the way a player does, from what the table says.
    const [, call = '0', pot = '0'] = /(\d+) more to call into a pot of (\d+)/.exec((await ask.textContent()) ?? '') ?? [];
    const need = Math.round((100 * Number(call)) / (Number(pot) + Number(call)));
    await typeNumber(page, need);
    await expect(page.locator('.lesson-feedback')).toContainText(`Yes, ${need}%`);
    await next(page);
    const [, equity = '0'] = /equity is (\d+)%/.exec((await ask.textContent()) ?? '') ?? [];
    const calling = Number(equity) > need;
    await page.locator(calling ? '.bet-call' : '.bet-fold').click();
    await expect(page.locator('.lesson-feedback')).toContainText(calling ? 'Call:' : 'Fold:');
    await next(page);
    await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible();
  });

  test('a drill: which hand wins, read from the cards on the table', async ({ page }) => {
    await page.goto('/#/practice/poker/drill-poker-winner?seed=e2e');
    await expect(page.locator('.lesson-text')).toContainText('Who wins at the showdown?');
    // The table names every card it shows: the board first, then your two, then Beto's two.
    const labels = await page.locator('.table-card[role="img"]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''));
    expect(labels).toHaveLength(9);
    expect(labels.slice(5, 7).every((l) => l.startsWith('Your card:'))).toBe(true);
    const board = labels.slice(0, 5).map(cardOf);
    const mine = evaluate([...labels.slice(5, 7).map(cardOf), ...board]);
    const theirs = evaluate([...labels.slice(7, 9).map(cardOf), ...board]);
    await page.getByRole('button', { name: mine > theirs ? 'You' : theirs > mine ? 'Beto' : 'A split pot', exact: true }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Yes');
    await next(page);
    await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible();
  });
});
