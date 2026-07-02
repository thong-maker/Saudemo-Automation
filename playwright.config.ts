import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['list'],
    ['./reporters/bug-report.ts'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',   // saucedemo uses data-test, not data-testid
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'accessibility',
      testDir: './tests/accessibility',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual',
      testDir: './tests/UI',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromatic',
      testDir: './tests/chromatic',
      testMatch: '**/*.{spec,stories}.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
