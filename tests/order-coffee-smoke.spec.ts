import { test, expect, chromium } from '@playwright/test';

test('start browser, context, page', async () => {
  // старт браузеру
  const browser = await chromium.launch();

  // старт контексту
  const context = await browser.newContext();

  // старт пейджи
  const page = await context.newPage();

  // locator
  await page.locator('[data-test="Espresso"]').visible().click();
  await page
    .locator('[data-test="Espresso"]')
    .filter({ visible: true })
    .click();

  await page.locator('[data-test="Espresso"]').fill('test test ');
  await page.locator('[data-test="Espresso"]').clear();

  //elementHandle
  await page.click('');
  await page.fill('', '');

  //id
  await page.locator('#Espresso').click();

  //1
  await page.getByRole('button', { name: '' });

  //2
  await page.getByLabel('');

  //3
  await page.getByPlaceholder('').click({ clickCount: 10 });
  await page.getByPlaceholder('').dblclick();

  //4
  await page.getByText('');
  await page.getByAltText('');

  // 1,4
  await page.getByTestId('Espresso');

  //5
  await page.locator('css selector | xpath').click();

  await page.locator('').scrollIntoViewIfNeeded();
  await page.locator('').click();
});

const human = {
  age: 10,
  hair: 'brown',
  name: 'Pavlo',
  run: () => {},
  sleep: () => {},
};

test('start browser, context, page1 ', async ({}) => {
  // старт браузеру
  const browser = await chromium.launch();

  // старт контексту
  const context = await browser.newContext();

  // старт пейджи
  const page = await context.newPage();
});

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
  await page
    .locator('#email')
    .pressSequentially('test.user@example.com', { delay: 100 });

  await page.locator('#email').click();

  await page.getByRole('checkbox').check();
  await page.getByRole('checkbox').uncheck();

  await expect(page.locator('#name1')).toHaveValue('Test User');
  await expect(page.locator('#email1')).toHaveValue('test.user@example.com');
});

// ❗️ КОПІЯ З НАВМИСНО ПОГАНИМИ ЛОКАТОРАМИ (css selectors + xpath).
// Приклад того, ЯК НЕ ТРЕБА писати локатори — крихкі, прив'язані до
// позиції, структури DOM та згенерованих класів. Для навчальних цілей.
test('форма оплати зберігає введені Name та Email (погані локатори)', async ({
  page,
}) => {
  await page.goto('https://coffee-cart.app/');

  // абсолютний xpath по позиції — зламається від будь-якої зміни розмітки
  await page.locator('xpath=/html/body/div[1]/div[2]/div[1]/ul/li[1]/div[2]').click();

  // css по вкладеності та nth-child — теж крихкий
  await page.locator('body > div#app > div:nth-child(3) > button:nth-child(2)').click();

  // css по атрибуту type замість id
  await page.locator('input[type="text"]').fill('Test User');

  // xpath по частковому тексту сусіднього елемента
  await page
    .locator('xpath=//div[contains(@class,"pay")]//input[2]')
    .pressSequentially('test.user@example.com', { delay: 100 });

  await page.locator('input[type="text"] ~ input').click();

  // чекбокс через xpath по тексту в мітці
  await page.locator('xpath=//label[contains(.,"agree")]/input').check();
  await page.locator('xpath=//label[contains(.,"agree")]/input').uncheck();

  // перевірки через позиційний css та xpath
  await expect(page.locator('div.preview p:nth-of-type(1)')).toHaveValue(
    'Test User',
  );
  await expect(
    page.locator('xpath=//div[@class="preview"]//p[2]'),
  ).toHaveValue('test.user@example.com');
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

test('check how select works ', async ({ page }) => {
  await page.goto('http://104.168.59.50/articles');
  await page.getByTestId('home-sort').selectOption('Oldest first');
  await page.getByTestId('home-sort').selectOption('Newest first');
});
