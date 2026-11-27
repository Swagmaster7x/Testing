// Milestone 7: Chinese Checkers end to end at every size. A race played to the end and reviewed,
// the opening with hop chains, three players, the rules at the table, resuming, a lesson, problems,
// the drills and the reference card.
import { BOTTOM, pos, TOP } from '../../src/games/chinese-checkers/learn/positions';
import { ccProblems, goodMove, hole, playCcToEnd, startCc } from './cc-helpers';
import { expect, noHorizontalScroll, test } from './fixtures';

/** Red, the person, has two marbles to bring home; Blue, the CPU, has three far down the board. */
const ENDGAME = pos({ R: [...TOP.slice(0, 8), '12h', '11g'], B: [...BOTTOM.slice(0, 7), '8c', '9b', '9c'] }, 'R');

test.describe('chinese checkers', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a race to the end, reviews it and plays on from a position', async ({ page }) => {
    test.setTimeout(240_000);
    await startCc(page, { seed: 'e2e-cc-end', level: 1, position: ENDGAME });
    await noHorizontalScroll(page);
    await expect(page.locator('svg.sb circle.sb-hit')).toHaveCount(121);
    const moves = await playCcToEnd(page);
    expect(moves).toBeGreaterThanOrEqual(2);
    await expect(page.locator('.result-card h2')).toHaveText('You win');
    await expect(page.locator('.result-card')).toContainText('The race is over');
    await expect(page.locator('.cc-strip-text')).toHaveText('Red wins.');
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.moments .accuracy')).toBeVisible({ timeout: 120_000 });
    await expect(page.locator('.ply-label')).toHaveText(/Move \d+ of \d+/);
    await page.getByRole('button', { name: 'First position' }).click();
    await page.getByRole('button', { name: 'Next move' }).click();
    await page.getByRole('button', { name: 'Play on from here' }).click();
    await expect(page).toHaveURL(/#\/play\/g_/);
    await expect(page.locator('.status-turn')).toHaveText(/Your move|CPU is thinking/, { timeout: 30_000 });
    await noHorizontalScroll(page);
  });

  test('shows where a marble can go, with the hops of each chain, and plays a hop', async ({ page }) => {
    await startCc(page, { seed: 'e2e-cc-open', level: 2 });
    await expect(hole(page, '3a')).toHaveAttribute('aria-label', '3a, Red marble');
    await hole(page, '3a').click();
    // 3a hops over 4a to 5e, or over 4b to 5g: two lit holes, both a single hop.
    await expect(page.locator('svg.sb .sb-target')).toHaveCount(2);
    await expect(page.locator('.cc-strip-text')).toContainText('Tap a lit hole');
    await hole(page, '5e').click();
    await expect(hole(page, '5e')).toHaveAttribute('aria-label', '5e, Red marble');
    await expect(hole(page, '3a')).toHaveAttribute('aria-label', '3a, empty');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
    await expect(page.locator('.moves')).toContainText('3a–5e');
    await noHorizontalScroll(page);
  });

  test('seats three players, with two CPUs, and turns the board for Blue', async ({ page }) => {
    test.setTimeout(120_000);
    await startCc(page, { seed: 'e2e-cc-three', level: 1, preset: 'Three players' });
    await expect(page.locator('.players .player')).toHaveCount(3);
    await hole(page, '4b').click();
    await hole(page, '5g').click();
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
    // Both CPUs moved: three moves in the list.
    await expect(page.locator('.moves .mv')).toHaveCount(3);
    await noHorizontalScroll(page);

    // The dialog remembers the last rules: back to two players, sitting as Blue.
    await startCc(page, { seed: 'e2e-cc-blue', level: 1, side: 'Blue', preset: 'Two players' });
    await expect(page.locator('svg.sb')).toHaveAttribute('data-bottom', '3');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
  });

  test('resumes a game after the app is closed', async ({ page }) => {
    await startCc(page, { seed: 'e2e-cc-resume', level: 1 });
    await hole(page, '4c').click();
    await hole(page, '5h').click();
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
    const before = await page.locator('.cc-surface').getAttribute('data-state');
    const url = page.url();
    await page.goto('about:blank');
    await page.goto(url);
    await expect(page.locator('.cc-surface')).toHaveAttribute('data-state', before ?? '');
    await expect(page.locator('.status-turn')).toHaveText('Your move');
  });

  test('finishes a lesson', async ({ page }) => {
    await page.goto('/#/learn/chinese-checkers.1.hop');
    await expect(page.locator('.status-title')).toHaveText('Hops');
    await page.getByRole('button', { name: 'Next' }).click();
    await hole(page, '7e').click();
    await hole(page, '7g').click();
    await expect(page.locator('.lesson-feedback')).toContainText('A hop');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'It stays where it is' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
    await page.getByRole('link', { name: 'All Chinese Checkers lessons' }).click();
    await expect(page.getByText(/^1 of \d+ lessons done$/)).toBeVisible();
  });

  test('wins the first race lesson against the computer', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/#/learn/chinese-checkers.0.race');
    await page.getByRole('button', { name: 'Next' }).click();
    for (let i = 0; i < 30; i++) {
      const feedback = page.locator('.lesson-feedback');
      if ((await feedback.count()) > 0 && ((await feedback.textContent()) ?? '').includes('Home first')) break;
      // Wait until it is our move: a marble of ours can be tapped.
      await expect(page.locator('.lesson-panel')).not.toContainText('thinking', { timeout: 30_000 });
      const position = (await page.locator('.cc-surface').getAttribute('data-state')) ?? '';
      // Red (the student) to move: the side letter follows the rows.
      if (!/^\S+ r( |$)/.test(position)) {
        await page.waitForTimeout(200);
        continue;
      }
      const move = goodMove(position);
      if (move === 'pass') break;
      await hole(page, move.from).click();
      await hole(page, move.to).click();
      await expect(page.locator('.cc-surface')).not.toHaveAttribute('data-state', position, { timeout: 15_000 });
    }
    await expect(page.locator('.lesson-feedback')).toContainText('Home first', { timeout: 30_000 });
  });

  test('solves a longest-hop problem and a race endgame', async ({ page }) => {
    const problems = ccProblems();
    const hop = problems.find((p) => p.themes.includes('cc-chain'));
    const race = problems.find((p) => p.themes.includes('cc-race'));
    if (!hop || !race) throw new Error('no problems');
    await page.goto(`/#/practice/chinese-checkers/cc-hops?id=${encodeURIComponent(hop.id)}`);
    await expect(page.locator('.lesson-text')).toContainText('Your move');
    await page.getByRole('button', { name: 'Hint' }).click();
    await expect(page.locator('svg.sb .sb-mark')).toHaveCount(1);
    await hole(page, hop.from).click();
    await hole(page, hop.to).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!', { timeout: 15_000 });
    await page.goto(`/#/practice/chinese-checkers/cc-race?id=${encodeURIComponent(race.id)}`);
    await hole(page, race.from).click();
    await hole(page, race.to).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!', { timeout: 15_000 });
    await noHorizontalScroll(page);
  });

  test('counts the race and a marble’s reach in the drills', async ({ page }) => {
    await page.goto('/#/practice/chinese-checkers/drill-cc-rows?seed=e2e');
    await expect(page.locator('.lesson-text')).toContainText('rows');
    await page.getByRole('button', { name: '0', exact: true }).click();
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.locator('.lesson-feedback')).toHaveText('Not quite. Try again.');
    await page.goto('/#/practice/chinese-checkers/drill-cc-reach?seed=e2e');
    await expect(page.locator('.lesson-text')).toContainText('How many holes');
    await expect(page.locator('svg.sb .sb-mark')).toHaveCount(1);
  });

  test('shows the reference card with every preset and the ask-before-you-sit card', async ({ page }) => {
    await page.goto('/#/games/chinese-checkers/reference');
    await expect(page.getByRole('heading', { name: 'The rules at different tables' })).toBeVisible();
    for (const preset of ['Two players', 'Three players', 'Four players', 'Six players', 'Fifteen marbles', 'Fast-paced', 'Closed points']) await expect(page.locator('.reference')).toContainText(`${preset}:`);
    await expect(page.getByRole('heading', { name: 'Ask before you sit' })).toBeVisible();
    await noHorizontalScroll(page);
  });
});
