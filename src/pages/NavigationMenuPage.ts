import type { Page } from '@playwright/test';
import { navigationLocators } from '../locators/navigation.locator.js';

export class NavigationMenuPage {
  constructor(private readonly page: Page) {}

  async logout(): Promise<void> {
    await this.page
      .getByRole(navigationLocators.openMenu.role, { name: navigationLocators.openMenu.name })
      .click();
    await this.page.locator(navigationLocators.logout).click();
  }
}
