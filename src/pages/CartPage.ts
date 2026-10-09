import type { Locator, Page } from '@playwright/test';
import { cartLocators } from '../locators/cart.locator.js';
import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get title(): Locator {
    return this.page.locator(cartLocators.pageTitle);
  }

  get items(): Locator {
    return this.page.locator(cartLocators.items);
  }

  async checkout(): Promise<void> {
    await this.page.locator(cartLocators.checkout).click();
  }
}
