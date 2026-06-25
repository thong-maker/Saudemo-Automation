import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PATHS } from '../paths';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  get cartItems() { return this.page.locator('.cart_item'); }
  get cartItemNames() { return this.page.locator('.inventory_item_name'); }
  get checkoutButton() { return this.page.getByTestId('checkout'); }
  get continueShoppingButton() { return this.page.getByTestId('continue-shopping'); }

  async goto() {
    await this.page.goto(PATHS.CART);
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async clickContinueShopping() {
    await this.continueShoppingButton.click();
  }

  async removeItem(productName: string) {
    const slug = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await this.page.getByTestId(`remove-${slug}`).click();
  }

  async getItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  async assertItemInCart(productName: string) {
    await expect(this.cartItemNames.filter({ hasText: productName })).toBeVisible();
  }

  async assertItemNotInCart(productName: string) {
    await expect(this.cartItemNames.filter({ hasText: productName })).not.toBeVisible();
  }

  async assertCartEmpty() {
    await expect(this.cartItems).toHaveCount(0);
  }

  async assertCartItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }
}
