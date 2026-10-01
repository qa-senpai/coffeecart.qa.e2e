import { test, expect, chromium } from '@playwright/test';

function randomNumber() {
  return Math.floor(Math.random() * 1_000_000);
  // 0.0000215412511521, 0.12, 0.1251251636126723 * 1000, 1
}

Date.now();

test.describe('unique test', () => {
  //   const purchaseMessage = 'BLa bla bla';

  // виконується один раз
  let uniqueEmail: string;

  //   let uniqueEmail: string;
  let describeMarker: string = 'DESCRIBE';

  // NODE

  test.beforeEach(async ({}, { workerIndex }) => {
    uniqueEmail = randomNumber() + '@gm.com';
    describeMarker = 'beforeEach' + workerIndex;
  });

  test('1test empty cart page', async ({ page }) => {
    console.log(`==== test 1 ====`);

    console.log(uniqueEmail);
    console.log(describeMarker);

    console.log(`==== test 1 end ====`);
  });

  test('2test empty cart page', async ({ page }) => {
    console.log(`==== test 2 ====`);

    console.log(uniqueEmail);
    console.log(describeMarker);

    console.log(`==== test 2 end ====`);
  });

  test('3test empty cart page', async ({ page }) => {
    console.log(`==== test 3 ====`);

    console.log(uniqueEmail);
    console.log(describeMarker);

    console.log(`==== test 3 end ====`);
  });
});
