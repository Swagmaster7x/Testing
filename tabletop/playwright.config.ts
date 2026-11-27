import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

// The build environment has a Chromium for an older Playwright at this path (PLAN.md 2.11).
// Elsewhere Playwright uses its own browser (npx playwright install chromium).
const localChromium = '/opt/pw-browsers/chromium';
const launchOptions = existsSync(localChromium) ? { executablePath: localChromium } : {};

// E2E_PORT lets several checkouts run their suites at the same time without sharing a server.
const PORT = Number(process.env.E2E_PORT ?? 4173);

export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'test-results',
  fullyParallel: true,
  workers: 3,
  retries: 0,
  reporter: [['list']],
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'off',
    launchOptions,
  },
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
  },
  projects: [
    { name: 'phone', testIgnore: /screens.*\.spec/, use: { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true } },
    // Offline install and backup do not depend on the layout, so they run once, on the phone.
    { name: 'tablet', testIgnore: [/screens.*\.spec/, /offline-backup\.spec/], use: { viewport: { width: 1180, height: 820 }, hasTouch: true } },
    { name: 'laptop', testIgnore: [/screens.*\.spec/, /offline-backup\.spec/], use: { viewport: { width: 1440, height: 900 } } },
    // Screenshots to look at and send: phone landscape at twice the pixels.
    { name: 'screens', testMatch: /screens.*\.spec/, use: { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
});
