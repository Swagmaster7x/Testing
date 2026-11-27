/**
 * Milestone 16 screenshots: the classic card pack and Tute in Spanish, at 844 × 390 (twice the
 * pixels). Each game: its hub, the new-game dialog and its rules, the table at its key moments, the
 * coach's hint and helpers down the rail, and the reference card.
 */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m16-es-cards';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });
const TURN = /Te toca|Partida terminada/;

async function spanish(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/settings');
  await page.getByRole('radio', { name: 'Español' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
}

/** Scrolls the open dialog a screen at a time, a shot each. */
async function dialogShots(page: Page, prefix: string, limit = 6) {
  for (let i = 0; i < limit; i++) {
    const end = await page.locator('.dialog').evaluate((dialog, n) => {
      const all = [dialog, ...Array.from(dialog.querySelectorAll('*'))] as HTMLElement[];
      const box = all.find((el) => el.scrollHeight > el.clientHeight + 4 && /(auto|scroll)/.test(getComputedStyle(el).overflowY));
      if (!box) return true;
      const y = n * Math.round(box.clientHeight * 0.85);
      box.scrollTop = y;
      return box.scrollTop < y - 2;
    }, i);
    await shot(page, `${prefix}-${i}`);
    if (end) return;
  }
}

/**
 * Opens a game's hub and its new-game dialog with every rule, picks a preset when given, then
 * starts and waits for your turn (or for the table to settle).
 */
async function startTable(page: Page, game: string, prefix: string, preset?: string) {
  await page.goto(`/#/games/${game}?seed=es-${game}`);
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, `${prefix}-hub`);
  await page.getByRole('button', { name: /^Jugar/ }).click();
  const dialog = page.getByRole('dialog');
  await shot(page, `${prefix}-new-game`);
  const change = dialog.getByRole('button', { name: 'Cambiar las reglas' });
  if (await change.isVisible()) {
    await change.click();
    await dialogShots(page, `${prefix}-rules`);
  }
  if (preset) await dialog.getByRole('radiogroup', { name: 'Reglas en esta mesa' }).getByRole('radio', { name: preset, exact: true }).click();
  await dialog.getByRole('button', { name: /^(Empezar|Partida nueva)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

async function yourTurn(page: Page, timeout = 90_000) {
  await expect(page.locator('.status-turn')).toHaveText(TURN, { timeout });
}

const over = async (page: Page) => (await page.locator('.status-turn').textContent())?.includes('Partida terminada') ?? false;

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
  const more = page.getByRole('button', { name: 'Dime más', exact: true }).first();
  const shown = await more
    .waitFor({ state: 'visible', timeout: 30_000 })
    .then(() => true)
    .catch(() => false);
  if (shown) await more.click();
  await expect(page.getByText('Pensando…')).toHaveCount(0, { timeout: 30_000 });
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

/** The reference card, a screen at a time to the bottom. */
async function reference(page: Page, game: string, prefix: string, limit = 8) {
  await page.goto(`/#/games/${game}/reference`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  for (let i = 0; i < limit; i++) {
    const end = await page.evaluate((n) => {
      const el = document.scrollingElement ?? document.documentElement;
      const all = [el, ...Array.from(document.querySelectorAll('main, .screen, .screen-body'))] as HTMLElement[];
      const box = all.find((b) => b.scrollHeight > b.clientHeight + 4) ?? el;
      const y = n * Math.round(box.clientHeight * 0.85);
      box.scrollTop = y;
      return box.scrollTop < y - 2;
    }, i);
    await page.waitForTimeout(100);
    await shot(page, `${prefix}-reference-${i}`);
    if (end) return;
  }
}

/** Plays the first card you may (tap to lift, tap to play). */
async function playFirstCard(page: Page) {
  const card = page.locator('button.table-card:not(:has([data-dim="true"]))').first();
  await card.click();
  await card.click();
}

test('m16 Spanish cards: the shelf', async ({ page }) => {
  await spanish(page);
  await page.goto('/#/games');
  await page.getByRole('heading', { name: 'Cartas' }).scrollIntoViewIfNeeded();
  await shot(page, '00-shelf');
  await page.mouse.wheel(0, 400);
  await shot(page, '00-shelf-2');
});

test('m16 Spanish cards: blackjack', async ({ page }) => {
  test.setTimeout(400_000);
  await spanish(page);
  await startTable(page, 'blackjack', '10-blackjack');
  await yourTurn(page);
  await shot(page, '10-blackjack-bet');
  await page.locator('.bet-call').click();
  await yourTurn(page);
  await shot(page, '10-blackjack-table');
  await helpers(page, ['Tabla de estrategia básica', 'Conteo corrido', 'Valor esperado de cada jugada', 'Marcar la jugada de la tabla', 'Avisar si dejas la tabla']);
  await shot(page, '10-blackjack-table-helpers');
  await hint(page);
  await railShots(page, '10-blackjack');
  // A few rounds: stand each hand, turn down insurance, bet the same again; catch the outcomes and
  // the coach's warning when standing leaves the chart.
  const keep = page.getByRole('button', { name: 'Jugarla de todos modos', exact: true });
  let warned = false;
  for (let i = 0; i < 30; i++) {
    await expect(page.locator('.status-turn').filter({ hasText: TURN }).or(keep).first()).toBeVisible({ timeout: 90_000 });
    if (await keep.isVisible()) {
      if (!warned) await shot(page, '10-blackjack-warn');
      warned = true;
      await keep.click();
      continue;
    }
    if (await over(page)) {
      await page.waitForTimeout(400);
      await shot(page, '10-blackjack-over');
      break;
    }
    const insurance = page.getByRole('button', { name: 'Sin seguro', exact: true });
    if (await insurance.isVisible()) {
      await shot(page, '10-blackjack-insurance');
      await insurance.click();
      continue;
    }
    const bet = page.locator('.bet-call');
    if (await bet.isVisible()) {
      if (i < 12) await shot(page, `10-blackjack-round-${String(i).padStart(2, '0')}`);
      await bet.click();
      continue;
    }
    const stand = page.getByRole('button', { name: 'Plantarse', exact: true });
    if (await stand.isVisible()) await stand.click();
    else break;
  }
  await reference(page, 'blackjack', '10-blackjack');
});

test('m16 Spanish cards: hearts', async ({ page }) => {
  test.setTimeout(400_000);
  await spanish(page);
  await startTable(page, 'hearts', '20-hearts');
  await expect(page.locator('.trick-action')).toBeVisible({ timeout: 30_000 });
  await shot(page, '20-hearts-pass');
  const cards = page.locator('button.table-card');
  for (let i = 0; i < 3; i++) await cards.nth(12 - i).click();
  await shot(page, '20-hearts-pass-chosen');
  await page.getByRole('button', { name: /^Pasar / }).click();
  await yourTurn(page);
  await shot(page, '20-hearts-table');
  for (let i = 0; i < 3; i++) {
    await yourTurn(page);
    await playFirstCard(page);
  }
  await yourTurn(page);
  await helpers(page, ['Puntos llevados hasta ahora', 'Cartas jugadas', 'Palos que les faltan', 'Cartas que quedan por debajo']);
  await shot(page, '20-hearts-table-helpers');
  await hint(page);
  await railShots(page, '20-hearts');
  // Play the hand out to its banner, with full motion so the banner stays up long enough to catch.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const banner = page.locator('.trick-hand-over');
  for (let i = 0; i < 14; i++) {
    await expect(page.locator('.status-turn').filter({ hasText: TURN }).or(banner).first()).toBeVisible({ timeout: 90_000 });
    if (await banner.isVisible()) {
      await shot(page, '20-hearts-hand-over');
      break;
    }
    if ((await over(page)) || (await page.getByRole('button', { name: /^Pasar / }).isVisible())) break;
    await playFirstCard(page);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await reference(page, 'hearts', '20-hearts');
});

test('m16 Spanish cards: spades', async ({ page }) => {
  test.setTimeout(400_000);
  await spanish(page);
  await startTable(page, 'spades', '30-spades');
  await expect(page.locator('.bid-panel')).toBeVisible({ timeout: 30_000 });
  await shot(page, '30-spades-bid');
  await page.getByRole('button', { name: 'Apostar 3', exact: true }).click();
  await yourTurn(page);
  await shot(page, '30-spades-table');
  for (let i = 0; i < 3; i++) {
    await yourTurn(page);
    await playFirstCard(page);
  }
  await yourTurn(page);
  await helpers(page, ['Bazas contra lo apostado', 'Cartas jugadas', 'Palos que les faltan', 'Cartas que ganan la baza']);
  await shot(page, '30-spades-table-helpers');
  await hint(page);
  await railShots(page, '30-spades');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const banner = page.locator('.trick-hand-over');
  for (let i = 0; i < 14; i++) {
    await expect(page.locator('.status-turn').filter({ hasText: TURN }).or(banner).first()).toBeVisible({ timeout: 90_000 });
    if (await banner.isVisible()) {
      await shot(page, '30-spades-hand-over');
      break;
    }
    if ((await over(page)) || (await page.locator('.bid-panel').isVisible())) break;
    await playFirstCard(page);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await reference(page, 'spades', '30-spades');
});

test('m16 Spanish cards: gin rummy', async ({ page }) => {
  test.setTimeout(400_000);
  await spanish(page);
  await startTable(page, 'gin-rummy', '40-gin');
  await yourTurn(page);
  await shot(page, '40-gin-table');
  await helpers(page, ['Cuenta de cartas sueltas', 'Cartas que recogió']);
  await hint(page);
  await shot(page, '40-gin-table-helpers');
  await railShots(page, '40-gin');
  // Pass the up-card, draw, then throw; knock when the button offers it. Catch the notes and the
  // result, with full motion so the result stays up long enough to catch.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  let noted = 0;
  const result = page.locator('.gin-result-title, .gin-table .hand-over');
  for (let i = 0; i < 80; i++) {
    await expect(page.locator('.status-turn').filter({ hasText: TURN }).or(result).first()).toBeVisible({ timeout: 90_000 });
    if (await result.first().isVisible()) {
      await page.waitForTimeout(400);
      await shot(page, '40-gin-result');
      break;
    }
    if (await over(page)) break;
    const pass = page.getByRole('button', { name: 'Pasar', exact: true });
    if (await pass.isVisible()) {
      await pass.click();
      continue;
    }
    const stock = page.getByRole('button', { name: /^Mazo, \d+ cartas: roba$/ });
    if ((await stock.count()) > 0 && (await page.locator('.gin-note').isVisible())) {
      if (noted < 2) await shot(page, `40-gin-draw-${noted++}`);
      await stock.click();
      continue;
    }
    const card = page.locator('button.table-card').last();
    await card.click();
    const knock = page.getByRole('button', { name: /^(Tocar con|¡Gin!)/ });
    if (await knock.isVisible()) {
      await shot(page, '40-gin-knock');
      await knock.click();
      await result.first().waitFor({ timeout: 30_000 });
      await page.waitForTimeout(400);
      await shot(page, '40-gin-result');
      break;
    } else {
      if (i < 4) await shot(page, `40-gin-discard-${i}`);
      await card.click();
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await reference(page, 'gin-rummy', '40-gin');
});

test('m16 Spanish cards: tute for four', async ({ page }) => {
  test.setTimeout(500_000);
  await spanish(page);
  await startTable(page, 'tute', '50-tute', 'España, en parejas');
  await yourTurn(page);
  await shot(page, '50-tute-table');
  for (let i = 0; i < 4; i++) {
    await yourTurn(page);
    const offer = page.locator('.tute-actions button').first();
    if (await offer.isVisible()) {
      await shot(page, `50-tute-offer-${i}`);
      await offer.click();
      continue;
    }
    await playFirstCard(page);
  }
  await yourTurn(page);
  await shot(page, '50-tute-table-later');
  // A card the obligations refuse.
  const dim = page.locator('button.table-card:has([data-dim="true"])').first();
  if ((await dim.count()) > 0) {
    await dim.click();
    await page.waitForTimeout(300);
    await shot(page, '50-tute-refused');
  }
  await helpers(page, ['Puntos, triunfos y cantes', 'Quién no puede tener un palo', 'Cartas vistas', 'Qué gana la baza']);
  await hint(page);
  await railShots(page, '50-tute');
  // Play on with full motion so the end of the hand stays up long enough to catch.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const banner = page.locator('.tute-hand-over');
  for (let i = 0; i < 40; i++) {
    await expect(banner.or(page.locator('.status-turn', { hasText: TURN }))).toBeVisible({ timeout: 90_000 });
    if ((await banner.count()) > 0) {
      await shot(page, '50-tute-hand-over');
      break;
    }
    if (await over(page)) break;
    const offer = page.locator('.tute-actions button').first();
    if (await offer.isVisible()) {
      await shot(page, `50-tute-offer-late-${i}`);
      await offer.click();
      continue;
    }
    await playFirstCard(page);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await reference(page, 'tute', '50-tute');
});

test('m16 Spanish cards: tute for two', async ({ page }) => {
  test.setTimeout(300_000);
  await spanish(page);
  await page.goto('/#/games/tute?seed=es-tute-two');
  await page.getByRole('button', { name: /^Jugar/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'Reglas en esta mesa' }).getByRole('radio', { name: 'Dos jugadores (habanero)', exact: true }).click();
  await shot(page, '51-tute-two-new-game');
  await dialog.getByRole('button', { name: /^(Empezar|Partida nueva)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
  await yourTurn(page);
  await shot(page, '51-tute-two-table');
  for (let i = 0; i < 6; i++) {
    await yourTurn(page);
    const offer = page.locator('.tute-actions button').first();
    if (await offer.isVisible()) {
      await shot(page, `51-tute-two-offer-${i}`);
      await offer.click();
      continue;
    }
    await playFirstCard(page);
  }
  await yourTurn(page);
  await shot(page, '51-tute-two-later');
  await railShots(page, '51-tute-two', 4);
});
