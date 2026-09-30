import { test, expect, chromium } from '@playwright/test';

test('взаємодія з різними елементами', async ({ page }) => {
  await page.goto('http://104.168.59.50/laboratory/interactions');

  await page.locator("//button[text() = 'Передумови']").click();

  await page.locator('//button', { hasText: 'Кроки' }).click();
  expect(page.locator('//*[@id="panel-steps"]//li')).toContainText([
    'Відкрити глобальну стрічку.',
    'Ввести запит.',
    'Застосувати фільтр.',
  ]);

  await page.locator('//button[contains(text(), "Результат")]').click();
  expect(page.locator('//*[@id="panel-result"]//p')).toHaveText(
    'У списку залишаються лише статті, заголовок яких відповідає запиту.',
  );
});

test('взаємодія з акордіоном', async ({ page }) => {
  await page.goto('http://104.168.59.50/laboratory/interactions');

  const accordionLocator = page.locator(
    "//h2[text()='Accordion']/parent::section",
  );

  const accordionLocator2 = page
    .getByText('Accordion') // getbytext
    .locator('/..')
    .locator('/parent::section') // xpath
    .locator('details'); // css

  // locator chaining
  await accordionLocator.locator('details').nth(2).click();

  await page.waitForTimeout(2000);

  await page
    .locator("//h2[text()='Accordion']/parent::section//details")
    .first()
    .click();

  await page.waitForTimeout(2000);

  await page
    .locator("//h2[text()='Accordion']/parent::section//details")
    .nth(1)
    .click();

  await page.waitForTimeout(2000);

  await page
    .locator("//h2[text()='Accordion']/parent::section//details")
    .last()
    .click();

  await page.waitForTimeout(2000);
});

test('робота з dialog', async ({ page }) => {
  await page.goto('http://104.168.59.50/laboratory/interactions');

  //   const dialogPromise = page.waitForEvent('dialog');

  const dialogLocator = page.locator(
    '//dialog[@data-testid="interactions-modal"]',
  );

  await dialogLocator.locator("//button[@value='confirm']").click();
});

test('робота з progress bar', async ({ page }) => {
  await page.goto('http://104.168.59.50/laboratory/interactions');

  const progressBarLocator = page.locator(
    `//progress[@data-testid="interactions-progress"]`,
  );
  const plusTenLocator = page.locator('//button', { hasText: '+10' });
  const minusTenLocator = page.locator('//button[text() = "−10"]');

  await expect(progressBarLocator).toHaveAttribute('value', '35', {});

  await plusTenLocator.click();

  await expect(progressBarLocator).toHaveAttribute('value', '45');

  await minusTenLocator.click();
  await minusTenLocator.click();

  await expect(progressBarLocator).toHaveAttribute('value', '25');

  await page
    .locator("//button[@class = 'btn-primary' and text() = 'Сформувати звіт']")
    .click();

  expect(
    page
      .locator('[data-testid="interactions-async-status"]')
      .getByText('Завантаження'),
  ).toBeVisible({ visible: false });

  await page.waitForTimeout(5000);
});

test('drag and drop', async ({ page }) => {
  await page.goto('http://104.168.59.50/laboratory/interactions');

  const articleLocator = page.locator(
    `article[data-testid="interactions-drag-item-locators"]`,
  );

  const dropZone = page.locator(
    '//*[@data-testid="interactions-dropzone-done"]',
  );

  await articleLocator.dragTo(dropZone);

  await expect(dropZone.locator(articleLocator)).toBeVisible();
});
