import { test as base } from '@playwright/test';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage.js';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage.js';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { NavigationMenuPage } from '../pages/NavigationMenuPage.js';
import type { FrameworkFixtures } from '../types/framework.js';
import {
  attachFailureDiagnostics,
  onConsoleMessage,
  type BrowserDiagnostic,
} from '../utils/diagnostics.js';

export const test = base.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutInformationPage: async ({ page }, use) => use(new CheckoutInformationPage(page)),
  checkoutOverviewPage: async ({ page }, use) => use(new CheckoutOverviewPage(page)),
  checkoutCompletePage: async ({ page }, use) => use(new CheckoutCompletePage(page)),
  navigationMenuPage: async ({ page }, use) => use(new NavigationMenuPage(page)),
  page: async ({ page }, use, testInfo) => {
    const diagnostics: BrowserDiagnostic[] = [];
    page.on('console', (message) => {
      const diagnostic = onConsoleMessage(message);
      if (diagnostic !== undefined) {
        diagnostics.push(diagnostic);
      }
    });
    page.on('pageerror', (error: Error) => {
      diagnostics.push({ source: 'pageerror', message: error.message });
    });
    await use(page);
    await attachFailureDiagnostics(page, testInfo, diagnostics);
  },
});

export { expect } from '@playwright/test';
