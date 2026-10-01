import { test, expect, Locator, Page } from '@playwright/test';

// DON`T REPEAT YOURSELF / DRY

test.describe('unique test', () => {
  //   const purchaseMessage = 'BLa bla bla';

  // виконується один раз
  //   const uniqueEmail = Date.now() + '@gm.com';

  let uniqueEmail: string;

  test.beforeEach(async () => {
    uniqueEmail = Date.now() + '@gm.com';
  });

  test('1test empty cart page', async ({ page }) => {
    const uniqueEmail = Date.now() + '@gm.com';
    console.log(uniqueEmail);
  });

  test('2test empty cart page', async ({ page }) => {
    console.log(uniqueEmail);
  });

  test('3test empty cart page', async ({ page }) => {
    console.log(uniqueEmail);
  });
});

test.describe('test', () => {
  let appContainer: Locator;
  let cartLink: Locator;

  test.beforeEach(async ({ page }) => {
    appContainer = page.locator('#app');
    cartLink = page.getByRole('link', { name: 'Cart page' });
  });

  test('test empty cart page', async ({ page }) => {
    await page.goto('/');

    const cartLink = page.getByRole('link', { name: 'Cart page' });
    const emptyCartMessage = page.getByText('No coffee, go add some.');

    await expect(cartLink).toContainText('cart (0)');
    await cartLink.click();
    await expect(emptyCartMessage).toBeVisible();
  });

  test('test cart counter', async ({ page }) => {
    await page.goto('/');

    const cartLink = page.getByRole('link', { name: 'Cart page' });
    const addEspressoButton = page.locator('[data-test="Espresso"]');

    await expect(cartLink).toContainText('cart (0)');
    await addEspressoButton.click();
    await expect(cartLink).toContainText('cart (1)');
  });

  test('test cart total two drinks', async ({ page }) => {
    await page.goto('/');

    const appContainer: Locator = page.locator('#app');
    const cartLink: Locator = page.getByRole('link', { name: 'Cart page' });
    const checkoutSummary: Locator = page.locator('[data-test="checkout"]');
    const espressoHeading: Locator = page.getByRole('heading', {
      name: 'Espresso $',
    });
    const addEspressoButton: Locator = page.locator('[data-test="Espresso"]');
    const espressoMacchiatoHeading: Locator = page.getByRole('heading', {
      name: 'Espresso Macchiato $',
    });
    const addEspressoMacchiatoButton: Locator = page.locator(
      '[data-test="Espresso_Macchiato"]',
    );

    await expect(addEspressoMacchiatoButton).toBeVisible();
    await expect(checkoutSummary).toContainText('Total: $0.00');

    await expect(espressoHeading).toBeVisible();
    await expect(appContainer).toContainText('Espresso $10.00');
    await expect(espressoMacchiatoHeading).toBeVisible();
    await expect(appContainer).toContainText('Espresso Macchiato $12.00');

    await addEspressoButton.click();
    await addEspressoMacchiatoButton.click();

    await expect(cartLink).toContainText('cart (2)');
    await expect(checkoutSummary).toContainText('Total: $22.00');
  });

  test('test check payment', async ({ page }) => {
    await page.goto('/');

    const appContainer = page.locator('#app');
    const checkoutSummary = page.locator('[data-test="checkout"]');
    const addEspressoButton = page.locator('[data-test="Espresso"]');
    const paymentHeader = page.locator('h1');
    const nameField = page.getByRole('textbox', { name: 'Name' });
    const emailField = page.getByRole('textbox', { name: 'Email' });
    const submitButton = page.getByRole('button', { name: 'Submit' });
    const successPurchaseMessage =
      'Thanks for your purchase. Please check your email for payment.';

    await expect(checkoutSummary).toBeVisible();
    await expect(checkoutSummary).toContainText('Total: $0.00');

    await addEspressoButton.click();
    await checkoutSummary.click();

    await expect(paymentHeader).toContainText('Payment details');
    await nameField.fill('test');
    await emailField.fill('test@ex.com');
    await submitButton.click();

    await expect(appContainer).toContainText(successPurchaseMessage);
  });

  test('test promo message', async ({ page }) => {
    await page.goto('/');

    const appContainer = page.locator('#app');
    const checkoutSummary = page.locator('[data-test="checkout"]');
    const addEspressoButton = page.locator('[data-test="Espresso"]');
    const addEspressoMacchiatoButton = page.locator(
      '[data-test="Espresso_Macchiato"]',
    );
    const addCappuccinoButton = page.locator('[data-test="Cappuccino"]');
    const discountMessage =
      "It's your lucky day! Get an extra cup of Mocha for $4.";

    await expect(checkoutSummary).toContainText('Total: $0.00');
    await addEspressoButton.click();
    await addEspressoMacchiatoButton.click();
    await addCappuccinoButton.click();

    await expect(appContainer).toContainText(discountMessage);
  });
});

function getLocators(page: Page) {
  const appContainer = page.locator('#app');
  const cartLink = page.getByRole('link', { name: 'Cart page' });
  const checkoutSummary = page.locator('[data-test="checkout"]');
  const espressoHeading = page.getByRole('heading', { name: 'Espresso $' });
  const addEspressoButton = page.locator('[data-test="Espresso"]');
  const espressoMacchiatoHeading = page.getByRole('heading', {
    name: 'Espresso Macchiato $',
  });
  const addEspressoMacchiatoButton = page.locator(
    '[data-test="Espresso_Macchiato"]',
  );

  return { appContainer, cartLink, checkoutSummary };
}
