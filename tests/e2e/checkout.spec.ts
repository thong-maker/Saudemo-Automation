import { test, expect } from './bs-test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { USERS, PRODUCTS, CHECKOUT_INFO, ERROR_MESSAGES } from '../../utils/test-data';

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await inventoryPage.clickCart();
    await cartPage.clickCheckout();
  });

  test.describe('Step 1 – Customer Information', () => {
    test('should proceed to step 2 with valid info', async ({ page }) => {
      await checkoutPage.fillAndContinue(CHECKOUT_INFO.valid);
      await expect(page).toHaveURL(/checkout-step-two\.html/);
    });

    test('should show error when first name is missing', async () => {
      await checkoutPage.fillAndContinue(CHECKOUT_INFO.missingFirstName);
      await checkoutPage.assertCheckoutError(ERROR_MESSAGES.firstNameRequired);
    });

    test('should show error when last name is missing', async () => {
      await checkoutPage.fillAndContinue(CHECKOUT_INFO.missingLastName);
      await checkoutPage.assertCheckoutError(ERROR_MESSAGES.lastNameRequired);
    });

    test('should show error when postal code is missing', async () => {
      await checkoutPage.fillAndContinue(CHECKOUT_INFO.missingPostalCode);
      await checkoutPage.assertCheckoutError(ERROR_MESSAGES.postalCodeRequired);
    });

    test('should cancel and return to cart', async ({ page }) => {
      await checkoutPage.cancel();
      await expect(page).toHaveURL(/cart\.html/);
    });
  });

  test.describe('Step 2 – Order Overview', () => {
    test.beforeEach(async () => {
      await checkoutPage.fillAndContinue(CHECKOUT_INFO.valid);
    });

    test('should show order summary', async () => {
      await expect(checkoutPage.summaryItems).toHaveCount(1);
      await expect(checkoutPage.summarySubtotal).toBeVisible();
      await expect(checkoutPage.summaryTax).toBeVisible();
      await expect(checkoutPage.summaryTotal).toBeVisible();
    });

    test('should show correct total (subtotal + tax)', async () => {
      const subtotal = await checkoutPage.getSubtotal();
      const total = await checkoutPage.getTotal();
      expect(total).toBeGreaterThan(subtotal);
    });

    test('should complete checkout when finish is clicked', async () => {
      await checkoutPage.finish();
      await checkoutPage.assertCheckoutComplete();
    });
  });

  test.describe('Complete', () => {
    test('should display success message after order', async () => {
      await checkoutPage.fillAndContinue(CHECKOUT_INFO.valid);
      await checkoutPage.finish();
      await expect(checkoutPage.completeHeader).toBeVisible();
      await expect(checkoutPage.completeText).toBeVisible();
    });

    test('should return to inventory after Back Home', async ({ page }) => {
      await checkoutPage.fillAndContinue(CHECKOUT_INFO.valid);
      await checkoutPage.finish();
      await checkoutPage.backHome();
      await expect(page).toHaveURL(/inventory\.html/);
    });
  });
});
