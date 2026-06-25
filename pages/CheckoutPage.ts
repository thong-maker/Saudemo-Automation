import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PATHS } from '../paths';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators – Step 1
  get firstNameInput() { return this.page.getByTestId('firstName'); }
  get lastNameInput() { return this.page.getByTestId('lastName'); }
  get postalCodeInput() { return this.page.getByTestId('postalCode'); }
  get continueButton() { return this.page.getByTestId('continue'); }
  get cancelButton() { return this.page.getByTestId('cancel'); }
  get errorMessage() { return this.page.getByTestId('error'); }

  // Locators – Step 2
  get summarySubtotal() { return this.page.locator('.summary_subtotal_label'); }
  get summaryTax() { return this.page.locator('.summary_tax_label'); }
  get summaryTotal() { return this.page.locator('.summary_total_label'); }
  get summaryItems() { return this.page.locator('.cart_item'); }
  get finishButton() { return this.page.getByTestId('finish'); }

  // Locators – Complete
  get completeHeader() { return this.page.locator('.complete-header'); }
  get completeText() { return this.page.locator('.complete-text'); }
  get backHomeButton() { return this.page.getByTestId('back-to-products'); }

  async gotoStepOne() {
    await this.page.goto(PATHS.CHECKOUT_STEP_ONE);
  }

  async fillCheckoutInfo(info: CheckoutInfo) {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async fillAndContinue(info: CheckoutInfo) {
    await this.fillCheckoutInfo(info);
    await this.continue();
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async backHome() {
    await this.backHomeButton.click();
  }

  async getSubtotal(): Promise<number> {
    const text = await this.summarySubtotal.textContent() ?? '';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotal(): Promise<number> {
    const text = await this.summaryTotal.textContent() ?? '';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async assertCheckoutComplete() {
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.completeHeader).toContainText('Thank you for your order!');
  }

  async assertCheckoutError(expectedMessage: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  async completeFullCheckout(info: CheckoutInfo) {
    await this.fillAndContinue(info);
    await this.finish();
  }
}
