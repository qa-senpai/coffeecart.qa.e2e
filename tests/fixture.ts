import { test } from '@playwright/test';

type Fixture = {};
export const check = test.extend<Fixture>({});

check('that coffee cart visible', ({ page }) => {});
