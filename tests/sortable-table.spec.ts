import { test, expect } from '@playwright/test';

const tableBlock = "//h2[text()='Sortable table']/ancestor::section[1]";
const selectedCounter = `${tableBlock}//span[starts-with(normalize-space(), 'Вибрано:')]`;
const rows = `${tableBlock}//tbody/tr`;
const nameCells = `${rows}/td[2]`;
const statusCells = `${rows}/td[3]`;
const durationCells = `${rows}/td[4]`;
const sortButton = (column: string) =>
  `${tableBlock}//thead//button[contains(normalize-space(), '${column}')]`;
const columnHeader = (column: string) => `${sortButton(column)}/parent::th`;
const rowCheckbox = (testName: string) =>
  `${rows}[td[normalize-space()='${testName}']]//input[@type='checkbox']`;

test.describe('Sortable table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://104.168.59.50/laboratory/interactions');
    await expect(page.locator(rows)).toHaveCount(4);
  });

  test('вибір рядків чекбоксами змінює лічильник "Вибрано"', async ({ page }) => {
    const counter = page.locator(selectedCounter);
    await expect(counter).toHaveText('Вибрано: 0');

    const testNames = [
      'Створення статті',
      'Авторизація',
      'Пошук за тегом',
      'Завантаження файлу',
    ];

    for (const [index, testName] of testNames.entries()) {
      await page.locator(rowCheckbox(testName)).check();
      await expect(page.locator(rowCheckbox(testName))).toBeChecked();
      await expect(counter).toHaveText(`Вибрано: ${index + 1}`);
    }

    await page.locator(rowCheckbox('Авторизація')).uncheck();
    await expect(page.locator(rowCheckbox('Авторизація'))).not.toBeChecked();
    await expect(counter).toHaveText('Вибрано: 3');
  });

  test('вибір рядка зберігається після сортування', async ({ page }) => {
    await page.locator(rowCheckbox('Пошук за тегом')).check();
    await expect(page.locator(selectedCounter)).toHaveText('Вибрано: 1');

    await page.locator(sortButton('Тривалість')).click();

    await expect(page.locator(rowCheckbox('Пошук за тегом'))).toBeChecked();
    await expect(page.locator(rowCheckbox('Авторизація'))).not.toBeChecked();
    await expect(page.locator(selectedCounter)).toHaveText('Вибрано: 1');
  });

  test('сортування за назвою тесту', async ({ page }) => {
    const ascending = [
      'Авторизація',
      'Завантаження файлу',
      'Пошук за тегом',
      'Створення статті',
    ];

    // за замовчуванням таблиця відсортована за назвою за зростанням
    await expect(page.locator(columnHeader('Тест'))).toHaveAttribute('aria-sort', 'ascending');
    await expect(page.locator(nameCells)).toHaveText(ascending);

    await page.locator(sortButton('Тест')).click();
    await expect(page.locator(columnHeader('Тест'))).toHaveAttribute('aria-sort', 'descending');
    await expect(page.locator(nameCells)).toHaveText([...ascending].reverse());

    await page.locator(sortButton('Тест')).click();
    await expect(page.locator(columnHeader('Тест'))).toHaveAttribute('aria-sort', 'ascending');
    await expect(page.locator(nameCells)).toHaveText(ascending);
  });

  test('сортування за статусом', async ({ page }) => {
    await page.locator(sortButton('Статус')).click();
    await expect(page.locator(columnHeader('Статус'))).toHaveAttribute('aria-sort', 'ascending');
    await expect(page.locator(columnHeader('Тест'))).toHaveAttribute('aria-sort', 'none');
    await expect(page.locator(statusCells)).toHaveText(['Failed', 'Passed', 'Passed', 'Skipped']);

    await page.locator(sortButton('Статус')).click();
    await expect(page.locator(columnHeader('Статус'))).toHaveAttribute('aria-sort', 'descending');
    await expect(page.locator(statusCells)).toHaveText(['Skipped', 'Passed', 'Passed', 'Failed']);
  });

  test('сортування за тривалістю', async ({ page }) => {
    await page.locator(sortButton('Тривалість')).click();
    await expect(page.locator(columnHeader('Тривалість'))).toHaveAttribute('aria-sort', 'ascending');
    await expect(page.locator(durationCells)).toHaveText(['0.0 s', '5.7 s', '8.4 s', '12.1 s']);
    await expect(page.locator(nameCells)).toHaveText([
      'Завантаження файлу',
      'Пошук за тегом',
      'Авторизація',
      'Створення статті',
    ]);

    await page.locator(sortButton('Тривалість')).click();
    await expect(page.locator(columnHeader('Тривалість'))).toHaveAttribute('aria-sort', 'descending');
    await expect(page.locator(durationCells)).toHaveText(['12.1 s', '8.4 s', '5.7 s', '0.0 s']);
    await expect(page.locator(nameCells)).toHaveText([
      'Створення статті',
      'Авторизація',
      'Пошук за тегом',
      'Завантаження файлу',
    ]);
  });
});
