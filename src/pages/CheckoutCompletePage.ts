import type { Locator, Page } from '@playwright/test';
import { checkoutLocators } from '../locators/checkout.locator.js';
import { BasePage } from './BasePage.js';

export class CheckoutCompletePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get confirmationHeading(): Locator {
    return this.page.locator(checkoutLocators.completeHeading);
  }

  async returnToProducts(): Promise<void> {
    await this.page.locator(checkoutLocators.backHome).click();
  }
}
