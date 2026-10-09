import type { Locator, Page } from '@playwright/test';
import { checkoutLocators } from '../locators/checkout.locator.js';
import { BasePage } from './BasePage.js';

export class CheckoutOverviewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get title(): Locator {
    return this.page.locator(checkoutLocators.pageTitle);
  }

  get itemName(): Locator {
    return this.page.locator(checkoutLocators.overviewItemName);
  }

  get itemPrice(): Locator {
    return this.page.locator(checkoutLocators.overviewItemPrice);
  }

  get itemQuantity(): Locator {
    return this.page.locator(checkoutLocators.overviewItemQuantity);
  }

  get subtotal(): Locator {
    return this.page.locator(checkoutLocators.subtotal);
  }

  get tax(): Locator {
    return this.page.locator(checkoutLocators.tax);
  }

  get total(): Locator {
    return this.page.locator(checkoutLocators.total);
  }

  async finishOrder(): Promise<void> {
    await this.page.locator(checkoutLocators.finish).click();
  }
}
