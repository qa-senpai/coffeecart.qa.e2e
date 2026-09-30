// driver.mjs — drive the real coffee-cart.app the tests target, headless,
// and drop screenshots to disk. This is the "poke the running app" harness:
// the repo itself has no local app, so "the app" is the external site the
// Playwright specs exercise (baseURL in playwright.config.ts).
//
// Usage:
//   node .claude/skills/run-coffee-cart-tests/driver.mjs [flow] [--url=<url>] [--out=<dir>] [--headed]
//
//   flow: order (default) | cart | screenshot
//   --url=   override target (default https://coffee-cart.app)
//   --out=   screenshot dir (default ./driver-out)
//   --headed run with a visible window (needs a display; headless by default)
//
// Exit code is non-zero if the flow's assertions don't hold, so it doubles as
// a connectivity/smoke check for the site the whole suite depends on.

import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flow = args.find((a) => !a.startsWith('-')) || 'order';
const getFlag = (name, def) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : def;
};
const URL = getFlag('url', 'https://coffee-cart.app');
const OUT = path.resolve(getFlag('out', 'driver-out'));
const HEADED = args.includes('--headed');

mkdirSync(OUT, { recursive: true });

const shot = async (page, name) => {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  screenshot -> ${file}`);
};

const assert = (cond, msg) => {
  if (!cond) throw new Error(`ASSERT FAILED: ${msg}`);
  console.log(`  ok: ${msg}`);
};

const run = async () => {
  console.log(`flow=${flow} url=${URL} out=${OUT} headed=${HEADED}`);
  const browser = await chromium.launch({ headless: !HEADED });
  const page = await browser.newContext().then((c) => c.newPage());
  try {
    await page.goto(`${URL}/`, { waitUntil: 'domcontentloaded' });
    await shot(page, `01-landing`);

    if (flow === 'screenshot') {
      // nothing else — just prove the page renders
    } else if (flow === 'cart') {
      await page.locator('[data-test="Cappuccino"]').click();
      await page.locator('[data-test="Mocha"]').click();
      await page.locator('a[href="/cart"]').click();
      await shot(page, `02-cart`);
      const count = await page.locator('.cart-preview .list-item').count();
      assert(count === 2, `cart shows 2 line items (got ${count})`);
    } else {
      // default: order flow — add drinks, open checkout, read the total
      await page.locator('[data-test="Mocha"]').click();
      await page.locator('[data-test="Flat_White"]').click();
      const total = await page.locator('[data-test="checkout"]').innerText();
      console.log(`  cart total text: "${total}"`);
      assert(/Total: \$\d/.test(total), `checkout shows a dollar total`);
      await page.locator('[data-test="checkout"]').click();
      await page.locator('#name').fill('Test User');
      await page.locator('#email').fill('test.user@example.com');
      await shot(page, `02-payment-form`);
      const cartLabel = await page.locator('a[href="/cart"]').innerText();
      console.log(`  cart label: "${cartLabel}"`);
      assert(/cart \(\d+\)/.test(cartLabel), `cart counter renders`);
    }
    console.log('DRIVER OK');
  } finally {
    await browser.close();
  }
};

run().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
