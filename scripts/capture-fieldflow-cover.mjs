import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../public/images/projects/field-flow/cover.png');

const browser = await chromium.launch({ headless: true });

// Pixel 7 mobile viewport
const context = await browser.newContext({
  viewport: { width: 412, height: 892 },
  deviceScaleFactor: 3,
});

const page = await context.newPage();

// Go to login — fields are pre-filled with FF-1042 / demo123
await page.goto('http://localhost:5200/field-flow/login', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// Click Sign In (fields are pre-filled with FF-1042 / demo123)
await page.getByRole('button', { name: 'Sign In' }).click();
await page.waitForTimeout(2000);

// Permissions page — grant Location and Camera (required to enable Continue)
// Buttons are conditionally rendered and disappear after clicking, so always click nth(0)
const allowBtns = page.getByRole('button', { name: 'Allow' });
await allowBtns.nth(0).click(); // Location
await page.waitForTimeout(500);
await allowBtns.nth(0).click(); // Camera (shifted to index 0 after Location disappeared)
await page.getByRole('button', { name: /Continue to app/i }).click();
await page.waitForTimeout(1800);

// Now on home screen — capture it
await page.screenshot({ path: OUT, fullPage: false, type: 'png' });

console.log('Saved:', OUT);
await browser.close();
