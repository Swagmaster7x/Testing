/** Milestone 7 screenshots: Chinese Checkers and pass-and-play at 844 × 390 (twice the pixels). */
import type { Page } from '@playwright/test';
import { createRng } from '../../src/core/rng';
import { chooseWith, LEVEL_PARAMS } from '../../src/games/chinese-checkers/bots';
import { actionOf, chineseCheckers, makeConfig, positionText } from '../../src/games/chinese-checkers/rules';
import { ccProblems, goodMove, hole, playCcToEnd, startCc } from './cc-helpers';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m7';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

/** A middle game from the CPU's own play (level 2 against itself), Red to move. */
function middleGame(plies: number): string {
  let s = chineseCheckers.setup(makeConfig(2), createRng('shots-middle'));
  const params = LEVEL_PARAMS[2];
  if (!params) throw new Error('no level 2');
  for (let i = 0; i < plies; i++) s = chineseCheckers.apply(s, actionOf(chooseWith(s, params, createRng(`middle/${i}`)).move)).state;
  return positionText(s);
}

/** Plays `n` careful moves for the person, waiting for the CPUs between them. */
async function playSome(page: Page, n: number): Promise<void> {
  for (let i = 0; i < n; i++) {
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 45_000 });
    const position = (await page.locator('.cc-surface').getAttribute('data-state')) ?? '';
    const move = goodMove(position);
    if (move === 'pass') return;
    await hole(page, move.from).click();
    await hole(page, move.to).click();
    await expect(page.locator('.cc-surface')).not.toHaveAttribute('data-state', position, { timeout: 15_000 });
  }
  await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 45_000 });
}

test('milestone 7 screens: Chinese Checkers and pass-and-play', async ({ page }) => {
  test.setTimeout(600_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/#/games');
  await shot(page, '01-games-shelf');
  await page.goto('/#/games/chinese-checkers');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '02-hub');

  // The New game dialog: levels, the rules at this table, then every option.
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await shot(page, '03-new-game');
  await dialog.getByRole('radiogroup', { name: 'Rules at this table' }).scrollIntoViewIfNeeded();
  await dialog.getByRole('button', { name: 'Change the rules' }).click();
  await dialog.locator('.rule-fields').scrollIntoViewIfNeeded();
  await shot(page, '04-rules-dialog');
  await page.keyboard.press('Escape');

  // A two-player game at the start, and a marble chosen.
  await startCc(page, { seed: 'shots-cc', level: 3, preset: 'Two players' });
  await shot(page, '05-table-start');
  await hole(page, '3b').click();
  await shot(page, '06-marble-chosen');
  await hole(page, '3b').click();

  // A hop chain being chosen: a position from the problems with a long chain for Red.
  const chain = ccProblems().find((p) => p.themes.includes('cc-chain') && / r( |$)/.test(p.position));
  if (chain) {
    await startCc(page, { seed: 'shots-cc-chain', level: 2, position: chain.position });
    await hole(page, chain.from).click();
    await expect(page.locator('svg.sb .sb-target-chain').first()).toBeVisible();
    await shot(page, '07-hop-chain');
  }

  // Six players: you and five CPUs, a few moves in.
  await startCc(page, { seed: 'shots-cc-six', level: 1, preset: 'Six players' });
  await playSome(page, 4);
  await shot(page, '08-six-players');

  // Coach helps: the race count and a hint.
  await page.getByRole('switch', { name: 'Count the race' }).click();
  await page.getByRole('button', { name: 'Hint' }).click();
  await expect(page.locator('.hint-steps li')).toHaveCount(1, { timeout: 30_000 });
  await page.getByRole('button', { name: 'Tell me more' }).click();
  await shot(page, '09-coach-helps');
  await page.getByRole('switch', { name: 'Count the race' }).click();

  // A game played from the middle to the end against level 2, then its review.
  await startCc(page, { seed: 'shots-cc-end', level: 2, position: middleGame(50) });
  await playCcToEnd(page);
  await expect(page.locator('.result-card')).toBeVisible();
  await shot(page, '10-game-over');
  await page.getByRole('link', { name: 'Review' }).click();
  await expect(page.locator('.moments .accuracy')).toBeVisible({ timeout: 180_000 });
  const moment = page.locator('.moment-list a').first();
  if ((await moment.count()) > 0) await moment.click();
  await shot(page, '11-review');

  // Learn: the door, a lesson with a chain, the blocked-home rule.
  await page.goto('/#/games/chinese-checkers/learn');
  await shot(page, '12-learn-door');
  await page.goto('/#/learn/chinese-checkers.1.chain');
  await page.getByRole('button', { name: 'Next' }).click();
  await hole(page, '7e').click();
  await shot(page, '13-lesson-chain');
  await page.goto('/#/learn/chinese-checkers.1.blocked');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await shot(page, '14-lesson-blocked');

  // Practice: the door, a problem with a hint, the race drill.
  await page.goto('/#/games/chinese-checkers/practice');
  await shot(page, '15-practice-door');
  const race = ccProblems().find((p) => p.themes.includes('cc-tip'));
  if (race) {
    await page.goto(`/#/practice/chinese-checkers/cc-race?id=${encodeURIComponent(race.id)}`);
    await page.getByRole('button', { name: 'Hint' }).click();
    await shot(page, '16-problem-race');
  }
  await page.goto('/#/practice/chinese-checkers/drill-cc-rows?seed=shots');
  await shot(page, '17-drill-rows');

  await page.goto('/#/games/chinese-checkers/reference');
  await shot(page, '18-reference');

  // Pass-and-play: the dialog, then the cover in a card game.
  await page.goto('/#/games/brisca?seed=shots-pnp');
  await page.getByRole('button', { name: /^Play/ }).click();
  await page.getByRole('dialog').getByRole('radio', { name: 'Pass and play', exact: true }).click();
  await page.getByRole('dialog').getByRole('textbox', { name: 'Name for First to lead' }).fill('Ana');
  await page.getByRole('dialog').getByRole('textbox', { name: 'Name for Dealer' }).fill('Ben');
  await shot(page, '19-pass-and-play-dialog');
  await page.getByRole('dialog').getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page.getByRole('heading', { name: 'Pass the device to Ana' })).toBeVisible();
  await shot(page, '20-pass-and-play-cover');
  await page.getByRole('button', { name: 'I am Ana: show my hand' }).click();
  await shot(page, '21-pass-and-play-table');

  // Pass-and-play on the star: two people and a CPU.
  await page.goto('/#/games/chinese-checkers?seed=shots-pnp-cc');
  await page.getByRole('button', { name: /^Play/ }).click();
  await page.getByRole('dialog').getByRole('radiogroup', { name: 'Rules at this table' }).getByRole('radio', { name: 'Three players', exact: true }).click();
  await page.getByRole('dialog').getByRole('radio', { name: 'Pass and play', exact: true }).click();
  await page.getByRole('dialog').getByRole('radiogroup', { name: 'Who plays Blue' }).getByRole('radio', { name: 'CPU', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: /^(Start|New game)$/ }).click();
  await hole(page, '4c').click();
  await hole(page, '5h').click();
  await expect(page.locator('.status-turn')).toHaveText('Player 2 to move', { timeout: 30_000 });
  await shot(page, '22-pass-and-play-star');
});
