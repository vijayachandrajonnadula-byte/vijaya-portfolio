// Riverside General: home -> search a doctor -> results -> View Availability -> pick a slot -> back home.
// Uses only controls the hosted prototype has. It never presses "Book Appointment".
import { record, tools, sleep } from './lib.mjs';

await record('riverside-general', {
  viewport: { width: 1440, height: 900 },
  url: 'https://hospital-booking-portfolio.vercel.app/',
  async run(page, t) {
    const k = tools(page);
    await page.waitForLoadState('networkidle');
    await sleep(420);
    await page.mouse.move(900, 560);
    k.cur.x = 900; k.cur.y = 560;
    t.mark();
    await sleep(250);
    const input = page.getByPlaceholder(/doctor name/i);
    await k.moveToEl(input, 420);
    await input.click();
    await page.keyboard.type('cardio', { delay: 55 });
    await sleep(150);
    const btn = page.getByText('Search', { exact: true }).first();
    await k.moveToEl(btn, 380);
    await btn.click();
    await page.waitForURL('**/doctors');
    await sleep(550);
    const va = page.getByText('View Availability').first();
    await k.moveToEl(va, 420);
    await va.click();
    await page.waitForURL('**/doctors/dr-*');
    await sleep(450);
    const slot = page.getByText('10:30', { exact: true }).first();
    await k.moveToEl(slot, 420);
    await slot.click();
    await sleep(750);
    const logo = page.getByText('Riverside General', { exact: true }).first();
    await k.moveToEl(logo, 420);
    await logo.click();
    await page.waitForURL('https://hospital-booking-portfolio.vercel.app/');
    await k.moveTo(900, 560, 300);
    await sleep(250);
    t.end();
  },
});
