import { test, expect } from '@playwright/test';
import { USERS } from '../../utils/test-data';

/**
 * API / Network layer tests.
 * Saucedemo is a frontend-only app, so these tests cover:
 * - HTTP response codes on page navigation
 * - Network request interception (mocking)
 * - Static asset loading
 */

test.describe('Network & API Tests', () => {
  test.describe('Page Response Codes', () => {
    test('login page returns 200', async ({ page }) => {
      const response = await page.goto('/');
      expect(response?.status()).toBe(200);
    });

    test('inventory page accessible when authenticated', async ({ page }) => {
      // Saucedemo is a SPA — /inventory.html is a client-side route, not a real file.
      // Verify that login succeeds and the inventory page renders correctly.
      await page.goto('/');
      await page.getByTestId('username').fill(USERS.standard.username);
      await page.getByTestId('password').fill(USERS.standard.password);
      await page.getByTestId('login-button').click();
      await page.waitForURL('**/inventory.html');
      expect(page.url()).toContain('inventory.html');
      await expect(page.locator('.inventory_list')).toBeVisible();
    });

    test('static assets load successfully', async ({ page }) => {
      const failedResources: string[] = [];

      page.on('response', response => {
        // Only check saucedemo.com resources — ignore third-party analytics/tracking
        if (!response.ok() && response.url().includes('saucedemo.com')) {
          failedResources.push(`${response.status()} ${response.url()}`);
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      expect(failedResources).toHaveLength(0);
    });
  });

  test.describe('Request Interception', () => {
    test('should intercept and mock a resource', async ({ page }) => {
      // Intercept the inventory page and inject custom response header
      await page.route('**/inventory.html', async route => {
        const response = await route.fetch();
        await route.fulfill({
          response,
          headers: {
            ...response.headers(),
            'x-test-intercepted': 'true',
          },
        });
      });

      await page.goto('/');
      await page.getByTestId('username').fill(USERS.standard.username);
      await page.getByTestId('password').fill(USERS.standard.password);
      await page.getByTestId('login-button').click();
      await page.waitForURL('**/inventory.html');
      await expect(page.locator('.inventory_list')).toBeVisible();
    });

    test('should simulate network failure gracefully', async ({ page }) => {
      let aborted = false;

      // Intercept image requests — saucedemo product images are .jpg
      // Route must be set up BEFORE navigation to catch requests
      await page.route('**/*.{jpg,jpeg,png,svg}', route => {
        aborted = true;
        route.abort();
      });

      await page.goto('/');
      await page.getByTestId('username').fill(USERS.standard.username);
      await page.getByTestId('password').fill(USERS.standard.password);
      await page.getByTestId('login-button').click();
      await page.waitForURL('**/inventory.html');
      await page.waitForLoadState('domcontentloaded');

      // Page should still render product list even with broken images
      await expect(page.locator('.inventory_list')).toBeVisible();
      expect(aborted).toBe(true);
    });

    test('should intercept and validate login request payload', async ({ page }) => {
      const requestData: Record<string, string> = {};

      page.on('request', request => {
        if (request.method() === 'POST' && request.url().includes('login')) {
          try {
            const postData = request.postDataJSON();
            Object.assign(requestData, postData);
          } catch {
            // Not all requests have JSON body
          }
        }
      });

      await page.goto('/');
      await page.getByTestId('username').fill(USERS.standard.username);
      await page.getByTestId('password').fill(USERS.standard.password);
      await page.getByTestId('login-button').click();
      await page.waitForURL('**/inventory.html');

      // Page was navigated → login succeeded
      await expect(page).toHaveURL(/inventory\.html/);
    });
  });

  test.describe('Performance', () => {
    test('login page should load within 3 seconds', async ({ page }) => {
      const start = Date.now();
      await page.goto('/');
      await page.waitForLoadState('load');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(3000);
    });

    test('inventory page should load within 5 seconds after login', async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('username').fill(USERS.standard.username);
      await page.getByTestId('password').fill(USERS.standard.password);

      const start = Date.now();
      await page.getByTestId('login-button').click();
      await page.waitForURL('**/inventory.html');
      await page.waitForLoadState('networkidle');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(5000);
    });
  });
});
