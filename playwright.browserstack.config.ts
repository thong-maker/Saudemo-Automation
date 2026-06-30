/**
 * Playwright config for BrowserStack Automate (real cloud browsers + video).
 * Usage: npm run test:bs
 */

import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const USERNAME  = process.env.BROWSERSTACK_USERNAME  || '';
const ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY || '';
const BUILD = `Saudemo-${new Date().toISOString().slice(0,10)}`;

const caps = JSON.stringify({
  browser: 'chrome',
  browser_version: 'latest',
  os: 'Windows',
  os_version: '11',
  project: 'Saudemo-Automation',
  build: BUILD,
  name: 'E2E Tests',
  'browserstack.username': USERNAME,
  'browserstack.accessKey': ACCESS_KEY,
  'browserstack.video': true,
  'browserstack.debug': true,
  'browserstack.networkLogs': true,
  'browserstack.consoleLogs': 'verbose',
});

const WS_ENDPOINT = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(caps)}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120_000,   // 2 phút mỗi test (remote browser cần thời gian)
  retries: 0,
  workers: 1,         // tuần tự — mỗi test 1 session riêng

  reporter: [['list']],

  use: {
    baseURL: 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',   // saucedemo dùng data-test, không phải data-testid
    connectOptions: {
      wsEndpoint: WS_ENDPOINT,
      timeout: 90_000,  // 90s để kết nối tới BrowserStack
    },
  },
});
