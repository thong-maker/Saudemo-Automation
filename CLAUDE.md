# Saudemo-Automation

Playwright automation suite for **saucedemo.com** – demo project for Kat.

## Stack

| Layer | Tool |
|---|---|
| Test runner | Playwright v1.50 |
| Language | TypeScript |
| E2E / Regression | `@playwright/test` |
| API / Network | `@playwright/test` (route interception) |
| Accessibility | `@axe-core/playwright` |
| Visual regression | Chromatic + Playwright screenshots |
| CI/CD | CloudBees, GitHub Actions, Jenkins |

## Project Structure

```
├── pages/              # Page Object Models
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── e2e/            # End-to-end / regression tests
│   ├── api/            # Network & API interception tests
│   ├── accessibility/  # axe-core accessibility tests
│   ├── UI/             # Playwright screenshot visual regression
│   └── chromatic/      # Chromatic visual regression stories
├── utils/
│   ├── test-data.ts    # Users, products, checkout info, error messages
│   └── helpers.ts      # Shared helper functions
├── .cloudbees/         # CloudBees CI workflow
├── .github/            # GitHub Actions workflow
├── auth.setup.ts       # Auth state setup (runs before E2E)
├── fixtures.ts         # Playwright fixtures (page objects)
├── paths.ts            # URL path constants
├── playwright.config.ts
└── Jenkinsfile
```

## Test Users

All users share the same password: `secret_sauce`

| User | Behaviour |
|---|---|
| `standard_user` | Normal flow |
| `locked_out_user` | Cannot log in |
| `problem_user` | Images broken, form bugs |
| `performance_glitch_user` | Slow login |
| `error_user` | Errors on certain actions |
| `visual_user` | Visual differences |

## Commands

```bash
# Install
npm ci

# Run all tests
npm test

# Specific suites
npm run test:e2e
npm run test:api
npm run test:accessibility
npm run test:visual

# Headed / debug mode
npm run test:headed
npm run test:debug

# Open report
npm run test:report

# Chromatic visual regression
npm run chromatic
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.
The only required secret for CI is `CHROMATIC_PROJECT_TOKEN`.

## CI/CD

- **CloudBees**: `.cloudbees/workflows/test.yaml` – runs E2E, API, accessibility, then Chromatic
- **GitHub Actions**: `.github/workflows/playwright.yml` – matrix per project
- **Jenkins**: `Jenkinsfile` – stage-per-suite pipeline

## Adding New Tests

1. Add page selectors to the relevant `pages/*.ts` POM
2. Add test data to `utils/test-data.ts`
3. Create a new spec in the appropriate `tests/` subfolder
4. Tests are automatically picked up by Playwright
