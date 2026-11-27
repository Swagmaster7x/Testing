// npm run icons: renders assets/icon.svg into the web app icons and the Android launcher icons,
// splash images and adaptive-icon layers. Uses the Playwright Chromium already installed.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(join(root, 'assets/icon.svg'), 'utf8');
const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const defs = inner.match(/<defs>[\s\S]*?<\/defs>/)?.[0] ?? '';
const art = inner.match(/<g id="art">[\s\S]*<\/g>\s*$/)?.[0] ?? '';
const FELT = '#163a2c';
const ROOM = '#15120e';

/** The icon art on a background, scaled around the centre. */
function compose({ size, background, scale = 1, radius = 0, transparent = false }) {
  const bg = transparent ? '' : background === 'felt' ? `<rect width="512" height="512" rx="${radius}" fill="url(#felt)"/>` : `<rect width="512" height="512" fill="${background}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">${defs}${bg}<g transform="translate(256 256) scale(${scale}) translate(-256 -256)">${art}</g></svg>`;
}

function splash(width, height) {
  const s = Math.min(width, height) * 0.36;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${ROOM}"/><g transform="translate(${(width - s) / 2} ${(height - s) / 2}) scale(${s / 512})">${defs}<rect width="512" height="512" rx="112" fill="url(#felt)"/><g transform="translate(256 256) scale(0.86) translate(-256 -256)">${art}</g></g></svg>`;
}

const executablePath = existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ deviceScaleFactor: 1 });

async function render(markup, width, height, out, transparent = false) {
  await page.setViewportSize({ width, height });
  await page.setContent(`<html><body style="margin:0;background:transparent">${markup}</body></html>`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, await page.screenshot({ omitBackground: transparent, clip: { x: 0, y: 0, width, height } }));
}

const web = join(root, 'public/icons');
await render(compose({ size: 192, background: 'felt', radius: 96 }), 192, 192, join(web, 'icon-192.png'), true);
await render(compose({ size: 512, background: 'felt', radius: 112 }), 512, 512, join(web, 'icon-512.png'), true);
await render(compose({ size: 512, background: 'felt', scale: 0.8 }), 512, 512, join(web, 'icon-maskable-512.png'));

const res = join(root, 'android/app/src/main/res');
const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [name, k] of Object.entries(densities)) {
  const legacy = Math.round(48 * k);
  const layer = Math.round(108 * k);
  await render(compose({ size: legacy, background: 'felt', radius: 100 }), legacy, legacy, join(res, `mipmap-${name}/ic_launcher.png`), true);
  await render(compose({ size: legacy, background: 'felt', radius: 256 }), legacy, legacy, join(res, `mipmap-${name}/ic_launcher_round.png`), true);
  // Adaptive icon: the art must sit inside the central 66 of 108 units.
  await render(compose({ size: layer, background: FELT, scale: 0.6, transparent: true }), layer, layer, join(res, `mipmap-${name}/ic_launcher_foreground.png`), true);
  await render(splash(Math.round(480 * k), Math.round(320 * k)), Math.round(480 * k), Math.round(320 * k), join(res, `drawable-land-${name}/splash.png`));
  await render(splash(Math.round(320 * k), Math.round(480 * k)), Math.round(320 * k), Math.round(480 * k), join(res, `drawable-port-${name}/splash.png`));
}
await render(splash(480, 320), 480, 320, join(res, 'drawable/splash.png'));
await browser.close();
console.log('Icons written to public/icons and android/app/src/main/res.');
