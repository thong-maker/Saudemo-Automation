# Saudemo-Automation

Playwright automation suite for **saucedemo.com** — demo project for Kat.

## Quick Start

```bash
# 1. Install dependencies
npm ci

# 2. Install Playwright browsers
npx playwright install

# 3. Copy env file and fill in secrets
cp .env.example .env

# 4. Run all tests
npm test
```

## Test Suites

| Suite | Command | Description |
|---|---|---|
| E2E / Regression | `npm run test:e2e` | Login, Inventory, Cart, Checkout (3 browsers) |
| API / Network | `npm run test:api` | HTTP responses, route interception, mocking |
| Accessibility | `npm run test:accessibility` | axe-core WCAG 2.0/2.1 AA |
| Visual (screenshots) | `npm run test:visual` | Playwright screenshot diffs |
| Visual (Chromatic) | `npm run chromatic` | Chromatic cloud visual regression |

## Useful Commands

```bash
npm run test:headed    # Run tests in browser UI
npm run test:debug     # Open Playwright inspector
npm run test:report    # Open HTML test report
```

## CI/CD

| Platform | Config |
|---|---|
| CloudBees | `.cloudbees/workflows/test.yaml` |
| GitHub Actions | `.github/workflows/playwright.yml` |
| Jenkins | `Jenkinsfile` |

## Secrets Required

| Secret | Where |
|---|---|
| `CHROMATIC_PROJECT_TOKEN` | `.env` / CI secret |

Set `chromatic.config.json` → `projectId` after creating your Chromatic project.
