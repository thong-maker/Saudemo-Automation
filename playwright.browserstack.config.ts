/**
 * Playwright config for BrowserStack Automate.
 * Each test gets its own session via the bs-test fixture.
 * Usage: npm run test:bs
 */

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120_000,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
  },
});
