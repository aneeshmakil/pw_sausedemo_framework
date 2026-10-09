import type { CartPage } from '../pages/CartPage.js';
import type { CheckoutCompletePage } from '../pages/CheckoutCompletePage.js';
import type { CheckoutInformationPage } from '../pages/CheckoutInformationPage.js';
import type { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage.js';
import type { InventoryPage } from '../pages/InventoryPage.js';
import type { LoginPage } from '../pages/LoginPage.js';
import type { NavigationMenuPage } from '../pages/NavigationMenuPage.js';

export interface FrameworkFixtures {
  readonly loginPage: LoginPage;
  readonly inventoryPage: InventoryPage;
  readonly cartPage: CartPage;
  readonly checkoutInformationPage: CheckoutInformationPage;
  readonly checkoutOverviewPage: CheckoutOverviewPage;
  readonly checkoutCompletePage: CheckoutCompletePage;
  readonly navigationMenuPage: NavigationMenuPage;
}
