/**
 * Smart fixture:
 * - USE_BROWSERSTACK=true  → mỗi test chạy trên BrowserStack (session riêng, video, pass/fail)
 * - Không set             → chạy local browser bình thường
 *
 * BrowserStack: npm run test:bs
 * Local:        npm run test:e2e  (hoặc --headed)
 */

import { test as base, expect, chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const USE_BS     = process.env.USE_BROWSERSTACK === 'true';
const USERNAME   = process.env.BROWSERSTACK_USERNAME  || '';
const ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY || '';
const BUILD      = `Saudemo-${new Date().toISOString().slice(0, 10)}`;

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    if (!USE_BS) {
      // ── Local mode: dùng browser bình thường ──
      await use(page);
      return;
    }

    // ── BrowserStack mode: tạo session riêng cho mỗi test ──
    const caps = JSON.stringify({
      browser: 'chrome',
      browser_version: 'latest',
      os: 'Windows',
      os_version: '11',
      project: 'Saudemo-Automation',
      build: BUILD,
      name: testInfo.title,
      'browserstack.username': USERNAME,
      'browserstack.accessKey': ACCESS_KEY,
      'browserstack.video': true,
      'browserstack.debug': true,
      'browserstack.networkLogs': true,
      'browserstack.consoleLogs': 'verbose',
    });

    const browser = await chromium.connect(
      `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(caps)}`
    );
    const context = await browser.newContext({
      baseURL: 'https://www.saucedemo.com',
      testIdAttribute: 'data-test',
    });
    const bsPage = await context.newPage();

    await use(bsPage);

    // Mark pass/fail trên BrowserStack
    const passed = testInfo.status === testInfo.expectedStatus;
    const reason = passed
      ? `Passed: ${testInfo.title}`
      : (testInfo.error?.message?.slice(0, 150) ?? 'Test failed').replace(/"/g, "'");

    try {
      await bsPage.evaluate(
        () => {},
        `browserstack_executor: {"action":"setSessionStatus","arguments":{"status":"${passed ? 'passed' : 'failed'}","reason":"${reason}"}}`
      );
    } catch (_) {}

    await context.close();
    await browser.close();
  },
});

export { expect };
