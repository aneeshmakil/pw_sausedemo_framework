# SauceDemo Playwright UI framework

A strict TypeScript, Playwright Test framework for the live demo at https://www.saucedemo.com/. Page actions, selectors, fixtures, test data, and test intent are separated, and login coverage is independent of the one end-to-end purchase journey.

## Prerequisites and install

- Node.js 20 or later and npm.
- Install dependencies and browser binaries:

  ```sh
  npm install
  npx playwright install
  ```

## Environment

Copy `.env.example` to `.env` to configure the public demo account names, shared publicly displayed sample password, base URL, and checkout form values. `.env` is ignored by git. The defaults match what the live login page displayed when this framework was authored; no personal credentials or production secrets are required.

| Variable                            | Default                      | Purpose                                  |
| ----------------------------------- | ---------------------------- | ---------------------------------------- |
| `SAUCEDEMO_BASE_URL`                | `https://www.saucedemo.com/` | Target site                              |
| `SAUCEDEMO_PASSWORD`                | `secret_sauce`               | Public SauceDemo sample-account password |
| `SAUCEDEMO_STANDARD_USER`           | `standard_user`              | Standard successful account              |
| `SAUCEDEMO_LOCKED_OUT_USER`         | `locked_out_user`            | Account expected to be rejected          |
| `SAUCEDEMO_PROBLEM_USER`            | `problem_user`               | Additional documented account            |
| `SAUCEDEMO_PERFORMANCE_GLITCH_USER` | `performance_glitch_user`    | Additional documented account            |
| `SAUCEDEMO_ERROR_USER`              | `error_user`                 | Additional documented account            |
| `SAUCEDEMO_VISUAL_USER`             | `visual_user`                | Additional documented account            |
| `CHECKOUT_FIRST_NAME`               | `John`                       | Checkout test data                       |
| `CHECKOUT_LAST_NAME`                | `Doe`                        | Checkout test data                       |
| `CHECKOUT_POSTAL_CODE`              | `12345`                      | Checkout test data                       |

Only the standard, problem, performance-glitch, error, and visual accounts are expected to authenticate. The live site explicitly identifies the locked-out account as rejected. The sample accounts/password are public demo values, not credentials for a real account.

## Architecture

```text
src/
  fixtures/       Shared typed page-object fixtures and failure diagnostics
  locators/       Central selectors, grouped by page
  pages/          Page objects and the navigation-menu component
  test-data/      Typed sample users and checkout/product data
  types/          Reusable fixture contracts
  utils/          Currency calculations and diagnostics
tests/
  login/          Independent authentication scenarios
  e2e/            Independent full purchase journeys for all six products
  Test Plan/
    login-test-cases.csv  Spreadsheet-ready login test inventory
    e2e-test-cases.csv    Spreadsheet-ready product purchase E2E test cases
playwright.config.ts
```

Locators use the site's observed `data-test` attributes. Assertions stay in tests, where they express test intent.

## Run tests

```sh
npm test                         # Full suite in Chromium, Firefox, and WebKit
npm run test:login               # Authentication-only tests
npm run test:e2e                 # Product-purchase E2E tests
npm run test:chromium            # Full suite in Chromium only
npx playwright test --project=firefox
npx playwright test --project=webkit
HEADED=true npm test             # Headed browser
npm run test:debug               # Playwright Inspector
npm run typecheck
npm run lint
npm run format:check
```

Tests use isolated browser contexts and can run independently. CI enables retries, two workers, and a JUnit XML report. Every run emits a non-interactive HTML report; open it with `npm run report`. Screenshots, traces, and video are retained on failure. Failed tests also attach sanitized browser console/page-error diagnostics when available. No fixed sleeps are used.

## Test inventory and observed application behavior

The live login page displays the six supported usernames and shared sample password. Blank credentials show `Epic sadface: Username is required`; a populated username without a password shows `Epic sadface: Password is required`. A locked account displays `Epic sadface: Sorry, this user has been locked out.` Direct navigation to `/inventory.html` when logged out redirects to `/` and displays `Epic sadface: You can only access '/inventory.html' when you are logged in.` Authentication and error-dismissal use observed `data-test` attributes.

The spreadsheet-ready inventories—including preconditions, test data, steps, expected and observed results, priority/severity, and automation status—are maintained separately: [login test cases](./Test%20Plan/login-test-cases.csv) and [product-purchase E2E test cases](./Test%20Plan/e2e-test-cases.csv). Open either CSV in Excel or another spreadsheet tool. Rate limiting and CAPTCHA are not assumed to exist. SQL-like and markup-like inputs are exploratory rejection smoke tests, not penetration tests or a security certification.

The E2E suite independently purchases each of the six products shown on the inventory page. Every product journey authenticates the standard account, verifies inventory and cart contents, enters checkout details, checks the product, quantity, subtotal, and displayed tax/total arithmetic, completes the order, verifies the confirmation, returns to inventory, and logs out. Login tests never execute these purchase journeys.

## Extending the framework

1. Add a page's observed selectors to its `src/locators/` module.
2. Add explicit page actions and locator accessors in `src/pages/`; keep assertions in tests.
3. Add reusable fixture types and instances in `src/types/framework.ts` and `src/fixtures/test.fixture.ts`.
4. Put shared accounts and business data in `src/test-data/`.
5. Add isolated login scenarios under `tests/login/` and document their ID/results in `tests/Test Plan/login-test-cases.csv`.
6. Keep each product's complete customer purchase journey independent in `tests/e2e/` and document each case in `tests/Test Plan/e2e-test-cases.csv`.

## Known limitations

- SauceDemo is a public demo site. Availability, latency, sample accounts, and catalog/pricing can change independently; the suite does not mock the site.
- The live site displayed telemetry requests returning HTTP 401 during initial exploration. Those were unrelated to login/cart UI behavior; browser console diagnostics are attached on test failure, not treated as functional assertions.
- Observed prices, account behavior, and messages reflect a live session on 2026-10-09. Reconfirm against the site if it changes.
- Running all three browser projects requires the Chromium, Firefox, and WebKit binaries installed with `npx playwright install`.
