import { test as setup } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate as standard user', async ({ page }) => {
  // Create auth directory if not exists
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const username = process.env.STANDARD_USER || 'standard_user';
  const password = process.env.STANDARD_PASSWORD || 'secret_sauce';

  await page.goto('/');
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login-button').click();

  // Verify we are logged in
  await page.waitForURL('**/inventory.html');

  // Save auth state
  await page.context().storageState({ path: authFile });
});
