import type { Locator, Page } from '@playwright/test';
import { loginLocators } from '../locators/login.locator.js';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get username(): Locator {
    return this.page.locator(loginLocators.username);
  }

  get password(): Locator {
    return this.page.locator(loginLocators.password);
  }

  get submitButton(): Locator {
    return this.page.locator(loginLocators.submit);
  }

  get errorMessage(): Locator {
    return this.page.locator(loginLocators.error);
  }

  async submit(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submitButton.click();
  }

  async submitWithEnter(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.password.press('Enter');
  }

  async dismissError(): Promise<void> {
    await this.page.locator(loginLocators.dismissError).click();
  }
}
