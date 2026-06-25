import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path: string) {
    await this.page.goto(path);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  getCartBadge() {
    return this.page.locator('.shopping_cart_badge');
  }

  async clickCart() {
    await this.page.locator('.shopping_cart_link').click();
  }

  getPageHeader() {
    return this.page.locator('.title');
  }

  async openBurgerMenu() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
  }

  async logout() {
    await this.openBurgerMenu();
    await this.page.getByText('Logout').click();
  }

  async resetAppState() {
    await this.openBurgerMenu();
    await this.page.getByText('Reset App State').click();
  }
}
