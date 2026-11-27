/**
 * Milestone 16 screenshots: the seven translated games in Spanish, at 844 × 390 (twice the pixels).
 * Each game: its hub, the new-game dialog and rules, a table after a few moves, the coach's hint
 * and helpers down the rail, and the reference card.
 */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m16-es';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });
const TURN = /Te toca|Partida terminada/;

async function spanish(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/settings');
  await page.getByRole('radio', { name: 'Español' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
}

/** Opens a game's hub and its new-game dialog with the rules, then starts; waits for your turn. */
async function startTable(page: Page, game: string, prefix: string) {
  await page.goto(`/#/games/${game}?seed=es-${game}`);
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, `${prefix}-hub`);
  await page.getByRole('button', { name: /^Jugar/ }).click();
  const dialog = page.getByRole('dialog');
  await shot(page, `${prefix}-new-game`);
  const change = dialog.getByRole('button', { name: /reglas/i }).first();
  if (await change.isVisible()) {
    await change.click();
    await shot(page, `${prefix}-rules`);
  }
  await dialog.getByRole('button', { name: /^(Empezar|Partida nueva)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
  await yourTurn(page);
}

async function yourTurn(page: Page) {
  await expect(page.locator('.status-turn')).toHaveText(TURN, { timeout: 90_000 });
}

/** Turns on the coach helpers named, where the table shows them. */
async function helpers(page: Page, names: readonly string[]) {
  for (const name of names) {
    const sw = page.getByRole('switch', { name, exact: true });
    if ((await sw.count()) > 0 && (await sw.first().getAttribute('aria-checked')) !== 'true') await sw.first().click();
  }
}

/** Asks the coach for a hint, and for more, so its words show in the rail. */
async function hint(page: Page) {
  const ask = page.getByRole('button', { name: 'Pista', exact: true });
  if (!(await ask.isVisible())) return;
  await ask.click();
  // Wait for the coach's answer (leaving the table while it thinks cancels the request).
  const more = page.getByRole('button', { name: /^(Dime más|Más)$/ }).first();
  const shown = await more
    .waitFor({ state: 'visible', timeout: 20_000 })
    .then(() => true)
    .catch(() => false);
  if (shown) await more.click();
  await expect(page.getByText(/Pensando…|Calculando…/)).toHaveCount(0, { timeout: 20_000 });
}

/** The rail from the top down, a screen at a time. */
async function railShots(page: Page, prefix: string, limit = 8) {
  const rail = page.locator('.rail');
  if ((await rail.count()) === 0) return;
  const step = await rail.evaluate((el) => Math.max(80, Math.round(el.clientHeight * 0.9)));
  for (let i = 0; i < limit; i++) {
    const end = await rail.evaluate((el, y) => {
      el.scrollTop = y;
      return el.scrollTop < y - 2;
    }, i * step);
    await shot(page, `${prefix}-rail-${i}`);
    if (end) return;
  }
}

/** Waits for your turn or for a hand-over banner; true when the banner shows. */
async function turnOrBanner(page: Page, banner: string): Promise<boolean> {
  const over = page.locator(banner);
  await expect(page.locator('.status-turn').filter({ hasText: TURN }).or(over)).toBeVisible({ timeout: 90_000 });
  return over.isVisible();
}

async function reference(page: Page, game: string, prefix: string) {
  await page.goto(`/#/games/${game}/reference`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await shot(page, `${prefix}-reference`);
  await page.mouse.wheel(0, 700);
  await shot(page, `${prefix}-reference-2`);
}

test('m16 Spanish: brisca', async ({ page }) => {
  test.setTimeout(300_000);
  await spanish(page);
  await startTable(page, 'brisca', '10-brisca');
  await shot(page, '10-brisca-table');
  for (let i = 0; i < 3; i++) {
    const card = page.locator('.card-table button.table-card').first();
    if (!(await card.isVisible())) break;
    await card.click();
    await card.click();
    await yourTurn(page);
  }
  await shot(page, '10-brisca-table-later');
  await helpers(page, ['Puntos y triunfos que quedan', 'Cartas vistas']);
  await hint(page);
  await railShots(page, '10-brisca');
  await reference(page, 'brisca', '10-brisca');
});

test('m16 Spanish: dominoes', async ({ page }) => {
  test.setTimeout(300_000);
  await spanish(page);
  await startTable(page, 'dominoes', '20-dominoes');
  await shot(page, '20-dominoes-table');
  for (let i = 0; i < 3; i++) {
    const knock = page.locator('.knock-btn');
    if (await knock.isVisible()) await knock.click();
    else {
      const tile = page.locator('button.table-tile').first();
      if (!(await tile.isVisible())) break;
      await tile.click();
      const ends = page.locator('button.line-end');
      if ((await ends.count()) > 0) await ends.first().click();
      else await tile.click();
    }
    await yourTurn(page);
  }
  await shot(page, '20-dominoes-table-later');
  await helpers(page, ['Fichas jugadas y las que quedan', 'Lo que cada uno no puede tener', 'Total de puntos']);
  await hint(page);
  await railShots(page, '20-dominoes');
  // Play the hand out to its banner.
  for (let i = 0; i < 12; i++) {
    if (await turnOrBanner(page, '.domino-hand-over')) {
      await shot(page, '20-dominoes-hand-over');
      break;
    }
    const knock = page.locator('.knock-btn');
    if (await knock.isVisible()) await knock.click();
    else {
      const tile = page.locator('button.table-tile').first();
      if (!(await tile.isVisible())) break;
      await tile.click();
      const ends = page.locator('button.line-end');
      if ((await ends.count()) > 0) await ends.first().click();
      else await tile.click();
    }
  }
  await reference(page, 'dominoes', '20-dominoes');
});

test('m16 Spanish: brisca for four, with señas', async ({ page }) => {
  test.setTimeout(300_000);
  await spanish(page);
  await page.goto('/#/games/brisca?seed=es-four');
  await page.getByRole('button', { name: /^Jugar/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: /reglas/i }).first().click();
  await dialog.getByRole('radio', { name: 'Cuatro en parejas, con señas', exact: true }).click();
  await dialog.getByRole('button', { name: /^(Empezar|Partida nueva)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
  await yourTurn(page);
  await shot(page, '11-brisca-four-table');
  const signs = page.getByRole('button', { name: 'Señas', exact: true });
  if (await signs.isVisible()) {
    await signs.click();
    await shot(page, '11-brisca-four-signs');
    await page.locator('.brisca-sign-btn').first().click();
  }
  for (let i = 0; i < 2; i++) {
    const card = page.locator('.card-table button.table-card').first();
    if (!(await card.isVisible())) break;
    await card.click();
    await card.click();
    await yourTurn(page);
  }
  await shot(page, '11-brisca-four-later');
  await railShots(page, '11-brisca-four');
});

test('m16 Spanish: poker', async ({ page }) => {
  test.setTimeout(300_000);
  await spanish(page);
  await startTable(page, 'poker', '30-poker');
  await shot(page, '30-poker-table');
  const raise = page.getByRole('button', { name: /^(Subir|Apostar)/ }).first();
  if (await raise.isVisible()) {
    await raise.click();
    await shot(page, '30-poker-bet-size');
    await page.getByRole('button', { name: 'Atrás' }).first().click();
  }
  await helpers(page, ['Probabilidades del bote', 'Outs', 'Nombrar mi mano', 'Posiciones', 'Equity contra sus rangos']);
  await shot(page, '30-poker-table-helpers');
  for (let i = 0; i < 3; i++) {
    const call = page.locator('.bet-call');
    if (!(await call.isVisible())) break;
    await call.click();
    await yourTurn(page);
  }
  await shot(page, '30-poker-table-later');
  await hint(page);
  await railShots(page, '30-poker');
  // Check or call to the end of the hand, for the winner's line.
  for (let i = 0; i < 8; i++) {
    if (await turnOrBanner(page, '.poker-hand-over')) {
      await shot(page, '30-poker-hand-over');
      break;
    }
    const call = page.locator('.bet-call');
    if (!(await call.isVisible())) break;
    await call.click();
  }
  await reference(page, 'poker', '30-poker');
});

test('m16 Spanish: go', async ({ page }) => {
  test.setTimeout(300_000);
  await spanish(page);
  await startTable(page, 'go', '40-go');
  await helpers(page, ['Cuenta de libertades', 'Cálculo del territorio']);
  for (const point of ['C3', 'G7', 'C7']) {
    const cell = page.getByRole('button', { name: `${point}, vacío` });
    if (!(await cell.isVisible())) continue;
    await cell.click();
    await yourTurn(page);
  }
  await shot(page, '40-go-table');
  await hint(page);
  await railShots(page, '40-go');
  await reference(page, 'go', '40-go');
});

test('m16 Spanish: chinese checkers', async ({ page }) => {
  test.setTimeout(300_000);
  await spanish(page);
  await startTable(page, 'chinese-checkers', '50-cc');
  await shot(page, '50-cc-table');
  await helpers(page, ['Contar la carrera', 'Adónde puede ir una canica']);
  await hint(page);
  await shot(page, '50-cc-table-hint');
  await railShots(page, '50-cc');
  await reference(page, 'chinese-checkers', '50-cc');
});

test('m16 Spanish: shogi', async ({ page }) => {
  test.setTimeout(300_000);
  await spanish(page);
  await startTable(page, 'shogi', '60-shogi');
  for (const [from, to] of [
    ['77', '76'],
    ['27', '26'],
  ]) {
    await page.getByRole('button', { name: new RegExp(`^${from},`) }).click();
    await page.getByRole('button', { name: new RegExp(`^${to},`) }).click();
    await yourTurn(page);
  }
  await helpers(page, ['Marcas de movimiento']);
  await shot(page, '60-shogi-table');
  await hint(page);
  await railShots(page, '60-shogi');
  await reference(page, 'shogi', '60-shogi');
});

test('m16 Spanish: mahjong', async ({ page }) => {
  test.setTimeout(300_000);
  await spanish(page);
  await startTable(page, 'mahjong', '70-mahjong');
  await shot(page, '70-mahjong-table');
  await helpers(page, ['Cuánto te falta y fichas útiles', 'Fichas seguras por jugador']);
  for (let i = 0; i < 4; i++) {
    await yourTurn(page);
    const prompt = page.locator('.mj-prompt');
    if (await prompt.isVisible()) {
      await shot(page, '70-mahjong-claim');
      await prompt.locator('.mj-call[data-call="pass"]').click();
      continue;
    }
    const tile = page.locator('button.mj-tile').last();
    if (!(await tile.isVisible())) break;
    await tile.click();
    await tile.click();
  }
  await yourTurn(page);
  await shot(page, '70-mahjong-table-later');
  await hint(page);
  await railShots(page, '70-mahjong');
  await reference(page, 'mahjong', '70-mahjong');
});
