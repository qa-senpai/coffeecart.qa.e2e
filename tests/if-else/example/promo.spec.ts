import { test, expect } from '@playwright/test';
import path from 'path';
import { pathToFileURL } from 'url';

const pageUrl = pathToFileURL(path.resolve(__dirname, 'index.html')).href;

test('checkout with banner', async ({ page }) => {
  await page.goto(pageUrl);

  const promoButton = page.getByTestId('apply-promo');
  const price = page.getByTestId('price');
  const result = page.getByTestId('result');

  await expect
    .poll(
      async () => {
        const isVisible = await promoButton.isVisible();

        if (isVisible === false) {
          await page.reload();
        }

        return isVisible;
      },
      {
        timeout: 60_000,
      },
    )
    .toBeTruthy();

  // Гілка 1: промо з'явилось — застосовуємо знижку
  await promoButton.click();
  await expect(price).toHaveText('$8.00');
  await page.getByTestId('checkout').click();
  await expect(result).toHaveText('Замовлення оформлено зі знижкою: $8.00');
});

test('checkout without banner', async ({ page }) => {
  await page.goto(pageUrl);

  const promoButton = page.getByTestId('apply-promo');
  const price = page.getByTestId('price');
  const result = page.getByTestId('result');

  await expect
    .poll(
      async () => {
        const isVisible = await promoButton.isVisible();

        if (isVisible) {
          await page.reload();
        }

        return isVisible;
      },
      {
        timeout: 60_000,
      },
    )
    .toBeFalsy();

  // Гілка 2: промо немає — оформлюємо за повною ціною
  await expect(price).toHaveText('$10.00');
  await page.getByTestId('checkout').click();
  await expect(result).toHaveText('Замовлення оформлено: $10.00');
});
