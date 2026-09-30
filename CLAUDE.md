# CLAUDE.md

## What this is

A Playwright E2E-testing course/practice repository. Tests drive the public demo app at
`https://coffee-cart.app` — there is no local application in this repo and no `webServer` is
started.

Running tests makes real network calls to that external site (and one test targets
`http://104.168.59.50/articles`).

## Commands

`package.json` defines no scripts

## Configuration

- Key configuration in playwright.config.ts

- `.env` is loaded via dotenv but its `BASE_URL` / `USERNAME` keys are currently empty and unused.

## Test file structure

- Several spec files inside tests folder

## CI

`.github/workflows/playwright.yml` runs `npx playwright test` on push/PR to `main`/`master` and
uploads the HTML report as an artifact.
