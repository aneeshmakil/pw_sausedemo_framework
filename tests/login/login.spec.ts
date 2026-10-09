import type { Page } from '@playwright/test';
import { test, expect } from '../../src/fixtures/test.fixture.js';
import type { LoginPage } from '../../src/pages/LoginPage.js';
import { testUsers, userPassword } from '../../src/test-data/users.js';

const invalidCredentialsMessage =
  'Epic sadface: Username and password do not match any user in this service';
const lockedOutMessage = 'Epic sadface: Sorry, this user has been locked out.';

async function expectSuccessfulLogin(
  loginPage: LoginPage,
  page: Page,
  username: string,
): Promise<void> {
  await loginPage.open();
  await loginPage.submit(username, userPassword);

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(loginPage.errorMessage).toHaveCount(0);
}

async function expectRejectedLogin(
  loginPage: LoginPage,
  page: Page,
  username: string,
  password: string,
  message = invalidCredentialsMessage,
): Promise<void> {
  await loginPage.open();
  await loginPage.submit(username, password);

  await expect(page).toHaveURL('/');
  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toHaveText(message);
}

test.describe('Login | supported sample accounts', () => {
  test('LOGIN-001-standard_user: standard account can authenticate', async ({
    loginPage,
    page,
  }) => {
    await expectSuccessfulLogin(loginPage, page, testUsers.standard.username);
  });

  test('LOGIN-001-problem_user: problem account can authenticate', async ({ loginPage, page }) => {
    await expectSuccessfulLogin(loginPage, page, testUsers.problem.username);
  });

  test('LOGIN-001-performance_glitch_user: performance-glitch account can authenticate', async ({
    loginPage,
    page,
  }) => {
    await expectSuccessfulLogin(loginPage, page, testUsers.performanceGlitch.username);
  });

  test('LOGIN-001-error_user: error account can authenticate', async ({ loginPage, page }) => {
    await expectSuccessfulLogin(loginPage, page, testUsers.error.username);
  });

  test('LOGIN-001-visual_user: visual account can authenticate', async ({ loginPage, page }) => {
    await expectSuccessfulLogin(loginPage, page, testUsers.visual.username);
  });

  test('LOGIN-006: locked-out account is rejected with the observed message', async ({
    loginPage,
    page,
  }) => {
    await expectRejectedLogin(
      loginPage,
      page,
      testUsers.lockedOut.username,
      userPassword,
      lockedOutMessage,
    );
  });
});

test.describe('Login | validation and credential boundaries', () => {
  test('LOGIN-007: rejects an unknown username and password', async ({ loginPage, page }) => {
    await expectRejectedLogin(loginPage, page, 'unknown_saucedemo_user', 'wrong_password');
  });

  test('LOGIN-008: rejects a valid username with an invalid password', async ({
    loginPage,
    page,
  }) => {
    await expectRejectedLogin(loginPage, page, testUsers.standard.username, 'wrong_password');
  });

  test('LOGIN-009: rejects an invalid username with the documented password', async ({
    loginPage,
    page,
  }) => {
    await expectRejectedLogin(loginPage, page, 'unknown_saucedemo_user', userPassword);
  });

  test('LOGIN-010: requires a username when the password is populated', async ({
    loginPage,
    page,
  }) => {
    await expectRejectedLogin(
      loginPage,
      page,
      '',
      userPassword,
      'Epic sadface: Username is required',
    );
  });

  test('LOGIN-011: requires a password when the username is populated', async ({
    loginPage,
    page,
  }) => {
    await expectRejectedLogin(
      loginPage,
      page,
      testUsers.standard.username,
      '',
      'Epic sadface: Password is required',
    );
  });

  test('LOGIN-012: requires credentials when both fields are empty', async ({
    loginPage,
    page,
  }) => {
    await expectRejectedLogin(loginPage, page, '', '', 'Epic sadface: Username is required');
  });

  test('LOGIN-013: does not authenticate a username with surrounding spaces', async ({
    loginPage,
    page,
  }) => {
    await expectRejectedLogin(loginPage, page, ` ${testUsers.standard.username} `, userPassword);
  });

  test('LOGIN-014: does not authenticate a password with surrounding spaces', async ({
    loginPage,
    page,
  }) => {
    await expectRejectedLogin(loginPage, page, testUsers.standard.username, ` ${userPassword} `);
  });

  test('LOGIN-015: treats usernames as case-sensitive', async ({ loginPage, page }) => {
    await expectRejectedLogin(
      loginPage,
      page,
      testUsers.standard.username.toUpperCase(),
      userPassword,
    );
  });

  test('LOGIN-016: treats passwords as case-sensitive', async ({ loginPage, page }) => {
    await expectRejectedLogin(
      loginPage,
      page,
      testUsers.standard.username,
      userPassword.toUpperCase(),
    );
  });

  test('LOGIN-017: rejects a malformed username without authenticating', async ({
    loginPage,
    page,
  }) => {
    await expectRejectedLogin(loginPage, page, 'user name<>', userPassword);
  });

  test('LOGIN-018: rejects a SQL-like username without authenticating (exploratory)', async ({
    loginPage,
    page,
  }) => {
    await expectRejectedLogin(loginPage, page, "' OR '1'='1", userPassword);
  });

  test('LOGIN-019: rejects a markup-like username without authenticating (exploratory)', async ({
    loginPage,
    page,
  }) => {
    await expectRejectedLogin(loginPage, page, '<script>alert(1)</script>', userPassword);
  });

  test('LOGIN-020: dismisses the visible authentication error', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.submit('', '');
    await expect(loginPage.errorMessage).toBeVisible();

    await loginPage.dismissError();

    await expect(loginPage.errorMessage).toHaveCount(0);
  });

  test('LOGIN-021: repeats failed authentication without assuming a lockout threshold (exploratory)', async ({
    loginPage,
    page,
  }) => {
    await loginPage.open();

    for (let attempt = 0; attempt < 3; attempt += 1) {
      await loginPage.submit('unknown_saucedemo_user', 'wrong_password');
      await expect(page).toHaveURL('/');
      await expect(loginPage.errorMessage).toHaveText(invalidCredentialsMessage);
      if (attempt < 2) {
        await loginPage.dismissError();
      }
    }
  });
});

test.describe('Login | navigation and keyboard behavior', () => {
  test('LOGIN-022: submits valid credentials with Enter', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.submitWithEnter(testUsers.standard.username, userPassword);

    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('LOGIN-023: supports sequential keyboard navigation across the login form', async ({
    loginPage,
    page,
  }) => {
    await loginPage.open();
    await page.keyboard.press('Tab');
    await expect(loginPage.username).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(loginPage.password).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(loginPage.submitButton).toBeFocused();
  });

  test('LOGIN-024: redirects unauthenticated direct inventory access to login', async ({
    loginPage,
    page,
  }) => {
    await loginPage.open('/inventory.html');

    await expect(page).toHaveURL('/');
    await expect(loginPage.errorMessage).toHaveText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    );
  });

  test('LOGIN-025: keeps the authenticated session on inventory after refresh', async ({
    loginPage,
    page,
  }) => {
    await loginPage.open();
    await loginPage.submit(testUsers.standard.username, userPassword);
    await expect(page).toHaveURL(/\/inventory\.html$/);

    await page.reload();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(loginPage.errorMessage).toHaveCount(0);
  });

  test('LOGIN-026: can log out and authenticate again in the same browser context', async ({
    loginPage,
    navigationMenuPage,
    page,
  }) => {
    await loginPage.open();
    await loginPage.submit(testUsers.standard.username, userPassword);
    await expect(page).toHaveURL(/\/inventory\.html$/);

    await navigationMenuPage.logout();
    await expect(page).toHaveURL('/');

    await loginPage.submit(testUsers.standard.username, userPassword);
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });
});
