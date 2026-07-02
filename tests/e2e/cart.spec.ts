import { test, expect } from './bs-test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { USERS, PRODUCTS } from '../../utils/test-data';

test.describe('Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  test('should show empty cart', async () => {
    await cartPage.goto();
    await cartPage.assertCartEmpty();
  });

  test('should show added items in cart', async () => {
    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await inventoryPage.addItemToCart(PRODUCTS.bikeLight);
    await inventoryPage.clickCart();
    await cartPage.assertItemInCart(PRODUCTS.backpack);
    await cartPage.assertItemInCart(PRODUCTS.bikeLight);
    await cartPage.assertCartItemCount(2);
  });

  test('should remove item from cart page', async () => {
    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await inventoryPage.clickCart();
    await cartPage.assertItemInCart(PRODUCTS.backpack);
    await cartPage.removeItem(PRODUCTS.backpack);
    await cartPage.assertCartEmpty();
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await inventoryPage.clickCart();
    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('should return to inventory when continue shopping is clicked', async ({ page }) => {
    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await inventoryPage.clickCart();
    await cartPage.clickContinueShopping();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('should persist cart after page reload', async ({ page }) => {
    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await page.reload();
    await inventoryPage.assertCartBadge(1);
  });
});
