import { test, expect } from '@playwright/test';
import { USERS } from '../../utils/test-data';

/**
 * Visual Regression Tests
 * Uses Playwright's built-in screenshot comparison.
 * For Chromatic-based visual regression, see tests/chromatic/.
 */

async function loginAsStandard(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByTestId('username').fill(USERS.standard.username);
  await page.getByTestId('password').fill(USERS.standard.password);
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/inventory.html');
}

test.describe('Visual Regression Tests', () => {
  test.describe('Login Page', () => {
    test('login page matches snapshot', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveScreenshot('login-page.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });

    test('login error state matches snapshot', async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('username').fill('wrong_user');
      await page.getByTestId('password').fill('wrong_pass');
      await page.getByTestId('login-button').click();
      await page.waitForSelector('[data-test="error"]');
      await expect(page).toHaveScreenshot('login-error.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });
  });

  test.describe('Inventory Page', () => {
    test('inventory page matches snapshot', async ({ page }) => {
      await loginAsStandard(page);
      await expect(page).toHaveScreenshot('inventory-page.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });

    test('inventory page with item in cart matches snapshot', async ({ page }) => {
      await loginAsStandard(page);
      await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
      await expect(page).toHaveScreenshot('inventory-item-in-cart.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });
  });

  test.describe('Cart Page', () => {
    test('cart page with item matches snapshot', async ({ page }) => {
      await loginAsStandard(page);
      await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
      await page.locator('.shopping_cart_link').click();
      await page.waitForURL('**/cart.html');
      await expect(page).toHaveScreenshot('cart-with-item.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });
  });

  test.describe('Checkout', () => {
    test('checkout step 1 matches snapshot', async ({ page }) => {
      await loginAsStandard(page);
      await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
      await page.locator('.shopping_cart_link').click();
      await page.getByTestId('checkout').click();
      await page.waitForURL('**/checkout-step-one.html');
      await expect(page).toHaveScreenshot('checkout-step-one.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });

    test('checkout complete matches snapshot', async ({ page }) => {
      await loginAsStandard(page);
      await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
      await page.locator('.shopping_cart_link').click();
      await page.getByTestId('checkout').click();
      await page.getByTestId('firstName').fill('John');
      await page.getByTestId('lastName').fill('Doe');
      await page.getByTestId('postalCode').fill('10001');
      await page.getByTestId('continue').click();
      await page.getByTestId('finish').click();
      await page.waitForURL('**/checkout-complete.html');
      await expect(page).toHaveScreenshot('checkout-complete.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });
  });
});
