// Renewly: scroll the real hosted dashboard, hover a "Review" action and a renewal card, back to the top.
import { record, tools, sleep } from './lib.mjs';

await record('renewly', {
  viewport: { width: 1440, height: 900 },
  url: 'https://renewly-ux.vercel.app/',
  async run(page, t) {
    const k = tools(page);
    await page.waitForLoadState('networkidle');
    await sleep(700);
    await page.mouse.move(1000, 300);
    k.cur.x = 1000; k.cur.y = 300;
    t.mark();
    await sleep(250);
    await k.moveToEl(page.getByRole('button', { name: /Review/ }).filter({ visible: true }).first(), 600);
    await sleep(500);
    await k.scrollTo(420, 1200);
    await k.moveToEl(page.getByText('Threadly').filter({ visible: true }).first(), 600);
    await sleep(700);
    await k.moveTo(1000, 300, 400);
    await k.scrollTo(0, 1200);
    await sleep(300);
    t.end();
  },
});
