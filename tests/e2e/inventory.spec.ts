import { test, expect } from './bs-test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { USERS, PRODUCTS } from '../../utils/test-data';
import { assertSortedAscending, assertSortedDescending } from '../../utils/helpers';

test.describe('Inventory / Product List', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    inventoryPage = new InventoryPage(page);
  });

  test('should display 6 products', async () => {
    await inventoryPage.assertItemCount(6);
  });

  test('should sort products A to Z', async () => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getItemNames();
    expect(assertSortedAscending(names)).toBe(true);
  });

  test('should sort products Z to A', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getItemNames();
    expect(assertSortedDescending(names)).toBe(true);
  });

  test('should sort products price low to high', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();
    expect(assertSortedAscending(prices)).toBe(true);
  });

  test('should sort products price high to low', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getItemPrices();
    expect(assertSortedDescending(prices)).toBe(true);
  });

  test('should add item to cart and show badge', async () => {
    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await inventoryPage.assertCartBadge(1);
  });

  test('should add multiple items to cart', async () => {
    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await inventoryPage.addItemToCart(PRODUCTS.bikeLight);
    await inventoryPage.assertCartBadge(2);
  });

  test('should remove item from cart', async () => {
    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await inventoryPage.assertCartBadge(1);
    await inventoryPage.removeItemFromCart(PRODUCTS.backpack);
    await inventoryPage.assertCartBadgeNotVisible();
  });

  test('should navigate to product detail when item name is clicked', async ({ page }) => {
    await inventoryPage.clickItemByName(PRODUCTS.backpack);
    await expect(page).toHaveURL(/inventory-item\.html/);
  });

  test('should navigate to cart when cart icon is clicked', async ({ page }) => {
    await inventoryPage.clickCart();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
