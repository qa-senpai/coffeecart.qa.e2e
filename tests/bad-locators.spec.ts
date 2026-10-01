import { test, expect } from '@playwright/test';

test('форма оплати зберігає введені Name та Email', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');

  const espressoItemLocator = page.getByTestId('Espresso');
  const proceedToCheckoutButtonLocator = page.getByRole('button', { name: 'Proceed to checkout' });
  const nameInputLocator = page.getByLabel('Name');
  const emailInputLocator = page.getByLabel('Email');
  const promoCheckboxLocator = page.getByRole('checkbox');

  await espressoItemLocator.click();
  await proceedToCheckoutButtonLocator.click();

  await nameInputLocator.fill('Test User');
  await emailInputLocator.fill('test.user@example.com');

  await promoCheckboxLocator.check();
  await promoCheckboxLocator.uncheck();

  await expect(nameInputLocator).toHaveValue('Test User');
  await expect(emailInputLocator).toHaveValue('test.user@example.com');
});

https://code.claude.com/docs/en/memory#share-rules-across-projects-with-symlinks
