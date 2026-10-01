import { chromium } from '@playwright/test';

// старт браузеру
const browser = await chromium.launch();

// старт контексту
const context = await browser.newContext();

// старт пейджи
const page = await context.newPage();
