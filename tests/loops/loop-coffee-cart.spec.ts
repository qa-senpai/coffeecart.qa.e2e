import { test, expect } from '@playwright/test';

test('сума кошика оновлюється при додаванні двох різних напоїв', async ({
  page,
}) => {
  await page.goto('https://coffee-cart.app/');

  const orderCount = 100;

  for (let i = 0; i < orderCount; i++) {
    await page.locator('[data-test="Mocha"]').click();
  }

  const expectedPrice = 8 * orderCount;

  await expect(page.locator('[data-test="checkout"]')).toHaveText(
    `Total: $${expectedPrice}.00`,
  );
});

test('1251 сума кошика оновлюється при додаванні двох різних напоїв', async ({
  page,
}) => {
  await page.goto('https://coffee-cart.app/');

  const cupBodyLocator = page.locator('.cup-body');
  const orderCount = await cupBodyLocator.count();

  for (let i = 0; i < orderCount; i++) {
    console.log(i);
    await page.waitForTimeout(1000);
    await cupBodyLocator.nth(i).click();
  }
});

test('1241 сума кошика оновлюється при додаванні двох різних напоїв', async ({
  page,
}) => {
  await page.goto('https://coffee-cart.app/');
  // we get from csv or api
  const expectedPrices = [10.0, 12.0, 19.0, 8.0, 18.0, 7.0, 16.0, 14.0, 15.0];
  // може прийти з індексами які не відповідають індексам на сторінці
  // приходить в number, а у нас ціни в string $

  //   await page.waitForTimeout(2000);
  await page.waitForLoadState('networkidle');

  await expect(page.locator('h4>small').first()).toHaveText('$10.00');
  const cupBodyPrices = await page.locator('h4>small').allTextContents();
  const actualPrices = [];

  for (let i = 0; i < cupBodyPrices.length; i++) {
    const price = Number(cupBodyPrices[i].slice(1));
    actualPrices.push(price);
  }

  //   for (let i = 0; i < cupBodyPrices.length; i++) {
  //     expect(expectedPrices[i]).toBe(actualPrices[i]);
  //   }

  expect(actualPrices.length).toBe(expectedPrices.length);

  for (let i = 0; i < expectedPrices.length; i++) {
    expect(
      actualPrices.find((value, index) => value === expectedPrices[i]),
    ).toBeTruthy();
  }
});
