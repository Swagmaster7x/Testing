/**
 * The learning loop on chess (PLAN.md 2.10, end to end): finish a lesson, pass a stage check,
 * solve a problem, keep a missed one and review it, and open a game review with key moments.
 */
import { expect, test } from './fixtures';
import { fen, move, square, startChess } from './chess-helpers';

test.describe('learning loop', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('finishes a lesson, and it shows as done', async ({ page }) => {
    await page.goto('/#/learn/chess.1.rook');
    await expect(page.locator('.status-title')).toHaveText('The rook');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: '9', exact: true }).click();
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.locator('.lesson-feedback')).toHaveText('Not quite. Try again.');
    await page.getByRole('button', { name: '1', exact: true }).click();
    await page.getByRole('button', { name: '4', exact: true }).click();
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Yes, 14');
    await page.getByRole('button', { name: 'Next' }).click();
    await move(page, 'd1d6');
    await expect(page.locator('.lesson-feedback')).toContainText('Rooks capture the same way');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
    await expect(page.getByText('Mistakes along the way: 1.')).toBeVisible();
    await page.getByRole('link', { name: 'All Chess lessons' }).click();
    await expect(page.getByText('1 of 37 lessons done')).toBeVisible();
    await page.getByRole('radio', { name: 'Rules' }).click();
    await expect(page.locator('.lesson-row', { hasText: 'The rook' })).toContainText('Done');
  });

  test('a stage check passes a stage with "I already know this"', async ({ page }) => {
    await page.goto('/#/games/chess/learn');
    await page.getByRole('radio', { name: 'Basics' }).click();
    await page.getByRole('link', { name: 'I already know this' }).click();
    await expect(page.locator('.status-title')).toHaveText('Check: Basics');
    await page.getByRole('button', { name: 'White', exact: true }).click();
    await page.getByRole('button', { name: /^Yes, by guarding f7/ }).click();
    await expect(page.getByText('2 of 2 right')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Stage passed' })).toBeVisible();
    await page.getByRole('link', { name: 'All Chess lessons' }).click();
    await page.getByRole('radio', { name: 'Basics' }).click();
    await expect(page.locator('.lesson-row', { hasText: 'Chess in a minute' })).toContainText('Passed by check');
  });

  test('a mate-in-one lesson tells stalemate from mate', async ({ page }) => {
    await page.goto('/#/learn/chess.2.mate-one');
    await move(page, 'a1a8');
    await expect(page.locator('.lesson-feedback')).toContainText('Back-rank mate');
    await page.getByRole('button', { name: 'Next' }).click();
    await move(page, 'a2f7');
    await expect(page.locator('.lesson-feedback')).toContainText('that is stalemate');
    await move(page, 'a2a8');
    await expect(page.locator('.lesson-feedback')).toContainText('Mate.');
  });

  test('solves a rated problem, and the problem rating moves', async ({ page }) => {
    // Lichess 01YDB: after White's f3, Black mates with Rh1.
    await page.goto('/#/practice/chess/mates?id=lichess:01YDB');
    await expect(page.getByText('Your move. Find the best move for Black.')).toBeVisible();
    await move(page, 'a1h1');
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!');
    await expect(page.locator('.lesson-feedback')).toContainText(/Rating \+\d+/);
    await page.goto('/#/games/chess/practice');
    await expect(page.getByText(/Problem rating 6[1-9]\d/)).toBeVisible();
  });

  test('a missed problem goes into the review queue and comes up for review', async ({ page }) => {
    await page.goto('/#/practice/chess/mates?id=lichess:01YDB');
    await expect(page.getByText('Your move. Find the best move for Black.')).toBeVisible();
    await move(page, 'a1a2');
    await expect(page.locator('.lesson-feedback')).toContainText('Not the move.');
    await page.getByRole('button', { name: 'Add to my practice' }).click();
    await expect(page.getByText('Added to your review queue.')).toBeVisible();
    await page.goto('/#/games/chess/practice');
    await expect(page.getByText('1 due')).toBeVisible();
    await page.getByRole('link', { name: 'Review now' }).click();
    await expect(page.getByText('From your review queue')).toBeVisible();
    await expect(page.getByText('Your move. Find the best move for Black.')).toBeVisible();
    await move(page, 'a1h1');
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!');
    await page.getByRole('button', { name: 'Next problem' }).click();
    await expect(page.getByRole('heading', { name: 'Queue done for now' })).toBeVisible();
  });

  test('a count-the-material drill is checked against the rules', async ({ page }) => {
    await page.goto('/#/practice/chess/drill-count?seed=e2e');
    await expect(page.locator('.lesson-text')).toBeVisible();
    // Read the answer the rules give: count the pieces on the board from the position.
    const position = (await fen(page)) ?? '';
    const values: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    let white = 0;
    let black = 0;
    for (const ch of position.split(' ')[0] ?? '') {
      const v = values[ch.toLowerCase()];
      if (v === undefined) continue;
      if (ch === ch.toUpperCase()) white += v;
      else black += v;
    }
    const text = (await page.locator('.lesson-text').textContent()) ?? '';
    const answer = text.startsWith('Count White') ? white : text.startsWith('Count Black') ? black : Math.abs(white - black);
    for (const d of String(answer)) await page.getByRole('button', { name: d, exact: true }).click();
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Right');
  });

  test('a game review shows key moments, keeps one for practice and plays on from there', async ({ page }) => {
    await startChess(page, { seed: 'e2e-review', level: 1 });
    // Weak opening moves on purpose, so the review has something to say.
    await move(page, 'f2f3');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
    await move(page, 'g2g4');
    await expect(page.locator('.status-turn')).toHaveText(/Your move|Game over/, { timeout: 30_000 });
    if ((await page.locator('.status-turn').textContent())?.includes('Your move')) {
      await page.locator('.table-side').getByRole('button', { name: 'Resign' }).click();
      await page.getByRole('alertdialog').getByRole('button', { name: 'Resign' }).click();
    }
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.moments')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('.accuracy')).toContainText('You:');
    const first = page.locator('.moment-list a').first();
    await expect(first).toBeVisible();
    await first.click();
    await expect(page.locator('.moment-card')).toBeVisible();
    await page.locator('.moment-card').getByRole('button', { name: 'Add to my practice' }).click();
    await expect(page.getByText('Added to your review queue.')).toBeVisible();
    await page.getByRole('button', { name: 'Play on from here' }).click();
    await expect(page).toHaveURL(/#\/play\/g_/);
    await expect(square(page, 'e1')).toBeVisible();
  });
});
