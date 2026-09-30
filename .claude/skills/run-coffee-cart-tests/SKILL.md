---
name: run-coffee-cart-tests
description: Run, debug, and screenshot the Coffee Cart Playwright E2E suite. Use when asked to run the tests, start Playwright, screenshot coffee-cart.app, drive the coffee cart app, check which specs pass, or open the HTML report. This repo has no local app — the specs drive the live site https://coffee-cart.app.
---

# Run: Coffee Cart Playwright tests

This repo is a Playwright E2E **test suite**, not an app. There is no local
server and `playwright.config.ts` starts no `webServer`. The specs drive the
public demo site **`https://coffee-cart.app`** (baseURL in the config), so
running anything here makes **real network calls** to that site. One test in
each spec also hits `http://104.168.59.50/articles`.

Two things you'll do here:

1. **Run the suite** — `npx playwright test` (the deliverable of a test repo).
2. **Drive the live app directly** — `driver.mjs`, to explore/debug the site
   the specs depend on and drop screenshots to disk without going through the
   test runner.

All paths below are relative to the repo root
(`coffee.cart.playwright.example/`).

> ⚠️ **The suite is a teaching repo and is NOT all-green by design.** Two of the
> three spec files (`cart.spec.ts`, `order-coffee-smoke.spec.ts`) and parts of
> `order.spec.ts` are intentionally-broken course scaffolds. `npx playwright
> test` (all 24 tests) **will report failures — that is expected.** See Gotchas.

## Prerequisites

Node is already installed (verified v22.17.1). Install deps + the one browser
the config uses (`chromium`):

```bash
npm ci
npx playwright install chromium
```

`npm ci` adds ~6 packages in under a second. `npx playwright install chromium`
is a no-op if the browser is already cached. On a clean Linux/CI box use
`npx playwright install --with-deps chromium` instead (pulls OS libs too — this
is what `.github/workflows/playwright.yml` runs).

## Run (agent path): drive the live app + screenshot

The driver launches headless Chromium against `coffee-cart.app`, runs a real
user flow, asserts the key result, and writes full-page PNGs. It exits non-zero
if the flow breaks, so it doubles as a connectivity smoke check for the site the
whole suite leans on.

```bash
# order flow: add drinks, open checkout, fill payment form, screenshot
node .claude/skills/run-coffee-cart-tests/driver.mjs order --out=driver-out

# cart flow: add two drinks, open /cart, assert 2 line items
node .claude/skills/run-coffee-cart-tests/driver.mjs cart --out=driver-out

# just prove the landing page renders
node .claude/skills/run-coffee-cart-tests/driver.mjs screenshot --out=driver-out
```

Flags: `--url=<url>` (default `https://coffee-cart.app`), `--out=<dir>`
(default `driver-out`, gitignored), `--headed` (needs a display; headless
otherwise). Each run prints `DRIVER OK` on success and the screenshot paths.
Screenshots land in `driver-out/` — **open them** (`01-landing.png`,
`02-payment-form.png`, `02-cart.png`) to confirm the page actually rendered.

Verified output of the `order` flow:

```
  cart total text: "Total: $26.00"
  ok: checkout shows a dollar total
  cart label: "cart (2)"
  ok: cart counter renders
DRIVER OK
```

## Run: the test suite

```bash
# the three known-good specs in order.spec.ts (all pass in ~3.4s)
npx playwright test order.spec.ts:75 order.spec.ts:87 order.spec.ts:137 --reporter=line

# run one file
npx playwright test order.spec.ts --reporter=line

# everything (24 tests — expect failures from the broken scaffolds)
npx playwright test
```

The config sets `reporter: 'html'`, so a full run writes `playwright-report/`.
View it with:

```bash
npx playwright show-report
```

`trace: 'on'` means every test records a trace under `test-results/`; open one
with `npx playwright show-trace test-results/<...>/trace.zip`.

## Human path

There isn't a meaningfully different one. `npx playwright test --ui` opens the
interactive UI runner, and `--headed` shows the browser — both need a display,
so they're useless in a headless/CI shell. Stick to the driver + `--reporter=line`.

## Gotchas

- **No local app.** Nothing to `npm start`. "Running the app" = pointing a
  browser (the driver, or a spec) at `https://coffee-cart.app`. If that site is
  down or the network is blocked, everything fails — the driver's non-zero exit
  is your fast check (`curl -sS -o /dev/null -w '%{http_code}' https://coffee-cart.app/`
  should print `200`).
- **The suite is not green, on purpose.** Known-failing scaffolds:
  - `cart.spec.ts` and `order-coffee-smoke.spec.ts` are near-identical practice
    files. Their first test (`start browser, context, page`) chains a
    non-existent `.visible()` on a locator and clicks empty selectors
    (`page.click('')`), so it hangs until the 30s action timeout then fails with
    `TimeoutError: locator.click: ... waiting for locator('[data-test="Espresso"]').visible()`.
  - The `форма оплати...` (payment form) test in all three files asserts on
    `#name1` / `#email1`, which don't exist on the page — fails with
    `expect(locator).toHaveValue ... locator('#name1') ... element(s) not found`.
    The real ids are `#name` / `#email` (the driver uses those).
  - Do **not** "fix" these unless asked — they're course exercises. To see green,
    run the specific good tests listed above.
- **Two specs are duplicates.** `cart.spec.ts` and `order-coffee-smoke.spec.ts`
  have identical content; `order.spec.ts` is the lightly-cleaned variant. Same
  test names repeat across files — always qualify by file (and `:line`) when
  running one.
- **`.env` is a decoy.** `dotenv` loads it but `BASE_URL` / `USERNAME` are empty
  and unused; the real base URL is hard-coded in `playwright.config.ts`. Don't
  rely on `.env`.
- **`fullyParallel: false`, `actionTimeout: 30s`, `timeout: 120s`.** A broken
  test can sit for up to 30s before failing, so a full run isn't instant. Target
  specific tests while iterating.
- **`testIdAttribute: 'data-test'`**, so `getByTestId('Espresso')` maps to
  `[data-test="Espresso"]`. Drink test-ids use underscores for spaces
  (`Flat_White`). Cart total lives in `[data-test="checkout"]`.

## Troubleshooting

- `locator('#name1') ... element(s) not found` / `.visible()` timeout → not your
  environment; that's an intentionally-broken scaffold test (see Gotchas).
- `net::ERR_...` / driver exits non-zero at `page.goto` → the external site is
  unreachable; check network, then retry.
- `browserType.launch: Executable doesn't exist` → run
  `npx playwright install chromium` (or `--with-deps chromium` on Linux).

## The driver

[.claude/skills/run-coffee-cart-tests/driver.mjs](driver.mjs) — ~90 lines,
imports `chromium` from `@playwright/test` (already a dep), no extra install.
Flows: `order` (default), `cart`, `screenshot`. Extend it with new flows as the
specs grow.
