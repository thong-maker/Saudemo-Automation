import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { USERS, ERROR_MESSAGES } from '../../utils/test-data';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with standard user', async () => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await loginPage.assertLoggedIn();
  });

  test('should show error for locked out user', async () => {
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);
    await loginPage.assertLoginError(ERROR_MESSAGES.lockedOut);
  });

  test('should show error when username is empty', async () => {
    await loginPage.login('', USERS.standard.password);
    await loginPage.assertLoginError(ERROR_MESSAGES.usernameRequired);
  });

  test('should show error when password is empty', async () => {
    await loginPage.login(USERS.standard.username, '');
    await loginPage.assertLoginError(ERROR_MESSAGES.passwordRequired);
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login(USERS.invalid.username, USERS.invalid.password);
    await loginPage.assertLoginError(ERROR_MESSAGES.credentialsDoNotMatch);
  });

  test('should clear error message when X button is clicked', async () => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();
    await loginPage.clearError();
    await expect(loginPage.errorMessage).not.toBeVisible();
  });

  test('should login with performance glitch user', async () => {
    test.slow();
    await loginPage.login(USERS.performanceGlitch.username, USERS.performanceGlitch.password);
    await loginPage.assertLoggedIn();
  });

  test('should logout successfully', async ({ page }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await loginPage.assertLoggedIn();
    await loginPage.logout();
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
