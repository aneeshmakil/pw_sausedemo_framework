import type { Page } from '@playwright/test';
import { test, expect } from '../../src/fixtures/test.fixture.js';
import { checkoutDetails, products, type ProductTestData } from '../../src/test-data/checkout.js';
import type { CartPage } from '../../src/pages/CartPage.js';
import type { CheckoutCompletePage } from '../../src/pages/CheckoutCompletePage.js';
import type { CheckoutInformationPage } from '../../src/pages/CheckoutInformationPage.js';
import type { CheckoutOverviewPage } from '../../src/pages/CheckoutOverviewPage.js';
import type { InventoryPage } from '../../src/pages/InventoryPage.js';
import type { LoginPage } from '../../src/pages/LoginPage.js';
import type { NavigationMenuPage } from '../../src/pages/NavigationMenuPage.js';
import { testUsers, userPassword } from '../../src/test-data/users.js';
import { currencyToCents } from '../../src/utils/currency.js';

interface ShoppingJourneyFixtures {
  readonly loginPage: LoginPage;
  readonly inventoryPage: InventoryPage;
  readonly cartPage: CartPage;
  readonly checkoutInformationPage: CheckoutInformationPage;
  readonly checkoutOverviewPage: CheckoutOverviewPage;
  readonly checkoutCompletePage: CheckoutCompletePage;
  readonly navigationMenuPage: NavigationMenuPage;
  readonly page: Page;
}

async function completePurchaseForProduct(
  {
    loginPage,
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    navigationMenuPage,
    page,
  }: ShoppingJourneyFixtures,
  product: ProductTestData,
): Promise<void> {
  await loginPage.open();
  await loginPage.submit(testUsers.standard.username, userPassword);
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventoryPage.title).toHaveText('Products');
  await expect(inventoryPage.items).toHaveCount(6);

  await inventoryPage.addProductToCart(product.name);
  await expect(inventoryPage.cartBadge).toHaveText('1');
  await inventoryPage.openCart();

  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(cartPage.title).toHaveText('Your Cart');
  await expect(cartPage.items).toHaveCount(1);
  await expect(cartPage.items.first()).toContainText(product.name);
  await expect(cartPage.items.first()).toContainText(product.price);
  await expect(cartPage.items.first().locator('[data-test="item-quantity"]')).toHaveText('1');
  await cartPage.checkout();

  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');
  await checkoutInformationPage.continueWithDetails(
    checkoutDetails.firstName,
    checkoutDetails.lastName,
    checkoutDetails.postalCode,
  );

  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(checkoutOverviewPage.title).toHaveText('Checkout: Overview');
  await expect(checkoutOverviewPage.itemName).toHaveText(product.name);
  await expect(checkoutOverviewPage.itemPrice).toHaveText(product.price);
  await expect(checkoutOverviewPage.itemQuantity).toHaveText('1');
  await expect(checkoutOverviewPage.subtotal).toContainText(product.price);

  const subtotalCents = currencyToCents(await checkoutOverviewPage.subtotal.innerText());
  const taxCents = currencyToCents(await checkoutOverviewPage.tax.innerText());
  const totalCents = currencyToCents(await checkoutOverviewPage.total.innerText());
  expect(subtotalCents).toBe(currencyToCents(product.price));
  expect(subtotalCents + taxCents).toBe(totalCents);

  await checkoutOverviewPage.finishOrder();
  await expect(page).toHaveURL(/\/checkout-complete\.html$/);
  await expect(checkoutCompletePage.confirmationHeading).toHaveText('Thank you for your order!');

  await checkoutCompletePage.returnToProducts();
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await navigationMenuPage.logout();
  await expect(page).toHaveURL('/');
  await expect(loginPage.username).toBeVisible();
}

function productPurchaseTest(product: ProductTestData) {
  return async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    navigationMenuPage,
    page,
  }: ShoppingJourneyFixtures): Promise<void> =>
    completePurchaseForProduct(
      {
        loginPage,
        inventoryPage,
        cartPage,
        checkoutInformationPage,
        checkoutOverviewPage,
        checkoutCompletePage,
        navigationMenuPage,
        page,
      },
      product,
    );
}

test(
  'E2E-001: standard customer purchases the Sauce Labs Backpack and logs out',
  productPurchaseTest(products.backpack),
);

test(
  'E2E-002: standard customer purchases the Sauce Labs Bike Light and logs out',
  productPurchaseTest(products.bikeLight),
);

test(
  'E2E-003: standard customer purchases the Sauce Labs Bolt T-Shirt and logs out',
  productPurchaseTest(products.boltTShirt),
);

test(
  'E2E-004: standard customer purchases the Sauce Labs Fleece Jacket and logs out',
  productPurchaseTest(products.fleeceJacket),
);

test(
  'E2E-005: standard customer purchases the Sauce Labs Onesie and logs out',
  productPurchaseTest(products.onesie),
);

test(
  'E2E-006: standard customer purchases the red T-Shirt and logs out',
  productPurchaseTest(products.redTShirt),
);
