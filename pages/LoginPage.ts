import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PATHS } from '../paths';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  get usernameInput() { return this.page.getByTestId('username'); }
  get passwordInput() { return this.page.getByTestId('password'); }
  get loginButton() { return this.page.getByTestId('login-button'); }
  get errorMessage() { return this.page.getByTestId('error'); }
  get errorButton() { return this.page.getByTestId('error-button'); }

  async goto() {
    await this.page.goto(PATHS.LOGIN);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsStandardUser() {
    const user = process.env.STANDARD_USER || 'standard_user';
    const pass = process.env.STANDARD_PASSWORD || 'secret_sauce';
    await this.login(user, pass);
  }

  async assertLoginError(expectedMessage: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  async assertLoggedIn() {
    await expect(this.page).toHaveURL(/inventory\.html/);
  }

  async assertLockedOutError() {
    await this.assertLoginError('Sorry, this user has been locked out');
  }

  async clearError() {
    await this.errorButton.click();
    await expect(this.errorMessage).not.toBeVisible();
  }
}
