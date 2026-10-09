import type { Locator, Page } from '@playwright/test';
import { checkoutLocators } from '../locators/checkout.locator.js';
import { BasePage } from './BasePage.js';

export class CheckoutInformationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get title(): Locator {
    return this.page.locator(checkoutLocators.pageTitle);
  }

  async continueWithDetails(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.page.locator(checkoutLocators.firstName).fill(firstName);
    await this.page.locator(checkoutLocators.lastName).fill(lastName);
    await this.page.locator(checkoutLocators.postalCode).fill(postalCode);
    await this.page.locator(checkoutLocators.continue).click();
  }
}
