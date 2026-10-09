import type { Locator, Page } from '@playwright/test';
import { inventoryLocators } from '../locators/inventory.locator.js';
import { BasePage } from './BasePage.js';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get title(): Locator {
    return this.page.locator(inventoryLocators.pageTitle);
  }

  get items(): Locator {
    return this.page.locator(inventoryLocators.items);
  }

  get cartBadge(): Locator {
    return this.page.locator(inventoryLocators.cartBadge);
  }

  async addProductToCart(name: string): Promise<void> {
    const item = this.items.filter({
      has: this.page.locator(inventoryLocators.itemName, { hasText: name }),
    });
    await item.locator(inventoryLocators.addToCart).click();
  }

  async openCart(): Promise<void> {
    await this.page.locator(inventoryLocators.cartLink).click();
  }
}
