import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { PATHS } from '../paths';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  get inventoryItems() { return this.page.locator('.inventory_item'); }
  get productSortDropdown() { return this.page.locator('[data-test="product-sort-container"]'); }
  get inventoryItemNames() { return this.page.locator('.inventory_item_name'); }
  get inventoryItemPrices() { return this.page.locator('.inventory_item_price'); }

  async goto() {
    await this.page.goto(PATHS.INVENTORY);
  }

  getItemByName(name: string): Locator {
    return this.page.locator('.inventory_item').filter({ hasText: name });
  }

  getAddToCartButton(productName: string): Locator {
    const slug = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return this.page.getByTestId(`add-to-cart-${slug}`);
  }

  getRemoveButton(productName: string): Locator {
    const slug = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return this.page.getByTestId(`remove-${slug}`);
  }

  async addItemToCart(productName: string) {
    await this.getAddToCartButton(productName).click();
  }

  async removeItemFromCart(productName: string) {
    await this.getRemoveButton(productName).click();
  }

  async addAllItemsToCart() {
    const addButtons = this.page.locator('[data-test^="add-to-cart"]');
    const count = await addButtons.count();
    for (let i = 0; i < count; i++) {
      await addButtons.nth(i).click();
    }
  }

  async sortBy(option: SortOption) {
    await this.productSortDropdown.selectOption(option);
  }

  async getItemNames(): Promise<string[]> {
    return this.inventoryItemNames.allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.inventoryItemPrices.allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  async clickItemByName(name: string) {
    await this.inventoryItemNames.filter({ hasText: name }).click();
  }

  async assertItemCount(count: number) {
    await expect(this.inventoryItems).toHaveCount(count);
  }

  async assertCartBadge(count: number) {
    await expect(this.getCartBadge()).toHaveText(String(count));
  }

  async assertCartBadgeNotVisible() {
    await expect(this.getCartBadge()).not.toBeVisible();
  }
}
