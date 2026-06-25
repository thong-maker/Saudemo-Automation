import { Page } from '@playwright/test';

/**
 * Login helper – navigates to login page and logs in with given credentials
 */
export async function loginAs(page: Page, username: string, password: string) {
  await page.goto('/');
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/inventory.html');
}

/**
 * Add multiple products to cart from the inventory page
 */
export async function addProductsToCart(page: Page, productNames: string[]) {
  for (const name of productNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await page.getByTestId(`add-to-cart-${slug}`).click();
  }
}

/**
 * Returns all text values from a locator list as trimmed strings
 */
export async function getAllTexts(page: Page, selector: string): Promise<string[]> {
  const elements = page.locator(selector);
  const texts = await elements.allTextContents();
  return texts.map(t => t.trim());
}

/**
 * Assert array is sorted ascending
 */
export function assertSortedAscending(arr: (string | number)[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

/**
 * Assert array is sorted descending
 */
export function assertSortedDescending(arr: (string | number)[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < arr[i + 1]) return false;
  }
  return true;
}
