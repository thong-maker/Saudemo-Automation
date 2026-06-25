/**
 * Chromatic Visual Regression
 *
 * Chromatic works with Storybook stories. For a Playwright-only project,
 * we use Chromatic's Playwright integration via chromatic/playwright.
 *
 * These tests capture full-page screenshots and upload to Chromatic for
 * visual diffing in CI/CD.
 *
 * Usage:
 *   npx chromatic --playwright
 *
 * See: https://www.chromatic.com/docs/playwright
 */

import { test } from '@chromatic-com/playwright';

test.describe('Chromatic Visual Snapshots', () => {
  test('Login page', async ({ page }) => {
    await page.goto('/');
    // Chromatic captures snapshot automatically
  });

  test('Login page – error state', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('bad_user');
    await page.getByTestId('password').fill('bad_pass');
    await page.getByTestId('login-button').click();
    await page.waitForSelector('[data-test="error"]');
  });

  test('Inventory page', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await page.waitForURL('**/inventory.html');
    await page.addStyleTag({ content: '.inventory_item_price { color: red; font-size: 24px; }' });
    await page.waitForLoadState('networkidle');
  });

  test('Cart page', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await page.waitForURL('**/inventory.html');
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.locator('.shopping_cart_link').click();
    await page.waitForURL('**/cart.html');
  });

  test('Checkout step 1', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await page.waitForURL('**/inventory.html');
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.locator('.shopping_cart_link').click();
    await page.getByTestId('checkout').click();
    await page.waitForURL('**/checkout-step-one.html');
  });

  test('Checkout complete', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await page.waitForURL('**/inventory.html');
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.locator('.shopping_cart_link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('10001');
    await page.getByTestId('continue').click();
    await page.getByTestId('finish').click();
    await page.waitForURL('**/checkout-complete.html');
  });
});
