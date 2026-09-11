import { test, expect } from '@playwright/test';

test('додавання напою в кошик оновлює лічильник кошика', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');

  await expect(page.locator('a[href="/cart"]')).toHaveText('cart (0)');

  await page.locator('[data-test="Espresso"]').click();

  await expect(page.locator('a[href="/cart"]')).toHaveText('cart (1)');
});

test('сума кошика оновлюється при додаванні двох різних напоїв', async ({
  page,
}) => {
  await page.goto('https://coffee-cart.app/');

  await page.locator('[data-test="Mocha"]').click();
  await page.locator('[data-test="Flat_White"]').click();

  await expect(page.locator('[data-test="checkout"]')).toHaveText(
    'Total: $26.00',
  );
});

test('форма оплати зберігає введені Name та Email', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');

  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="checkout"]').click();

  await page.locator('#name').fill('Test User');
  await page.locator('#email').fill('test.user@example.com');

  await expect(page.locator('#name')).toHaveValue('Test User');
  await expect(page.locator('#email')).toHaveValue('test.user@example.com');
});

test('успішна оплата показує повідомлення про підтвердження', async ({
  page,
}) => {
  await page.goto('https://coffee-cart.app/');

  await page.locator('[data-test="Americano"]').click();
  await page.locator('[data-test="checkout"]').click();

  await page.locator('#name').fill('Test User');
  await page.locator('#email').fill('test.user@example.com');
  await page.locator('#submit-payment').click();

  await expect(page.locator('.snackbar.success')).toHaveText(
    'Thanks for your purchase. Please check your email for payment.',
  );
});

test('сторінка кошика показує додані напої у списку', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');

  await page.locator('[data-test="Cappuccino"]').click();
  await page.locator('[data-test="Mocha"]').click();
  await page.locator('a[href="/cart"]').click();

  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.locator('.cart-preview .list-item')).toHaveCount(2);
  await expect(page.locator('.cart-preview')).toContainText('Cappuccino');
  await expect(page.locator('.cart-preview')).toContainText('Mocha');
});
