// Electronic execution (PULSE-built prototype): record step 1 of the protocol.
// Off camera: open the execution panel, close the evidence gallery, attach a generated sample snapshot
// (the app requires evidence before Record). On camera: type the actual result, choose Pass, Record,
// fill the e-sign dialog (reason, any password, accept), Submit, and the step status updates.
// The end state differs from the start, so the clip fades from/to white to loop without a visible jump.
import { record, tools, sleep, BASE } from './lib.mjs';

await record('electronic-execution', {
  viewport: { width: 1440, height: 900 },
  url: `${BASE}/pulse-gallery/index.html#/ElectronicExecution`,
  async run(page, t) {
    const k = tools(page);
    await page.waitForLoadState('networkidle');
    await sleep(2200);
    await page.getByRole('button', { name: 'Close' }).first().click(); // close the evidence gallery
    await sleep(500);
    await page.getByRole('button', { name: 'Expand execution panel' }).click();
    await sleep(900);
    // evidence (off camera)
    await page.mouse.click(280, 687);
    await sleep(500);
    await page.mouse.click(140, 809); // Snapshot
    await sleep(900);
    await page.getByRole('button', { name: 'Capture' }).click();
    await sleep(700);
    await page.getByRole('button', { name: 'Attach', exact: true }).last().click();
    await sleep(900);
    // white overlay for the fade in / out
    await page.evaluate(() => {
      const o = document.createElement('div');
      o.id = '__fade';
      o.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:2147483647;pointer-events:none;opacity:1;transition:opacity .4s ease';
      document.documentElement.appendChild(o);
    });
    const fade = (v) => page.evaluate((v) => (document.getElementById('__fade').style.opacity = v), v);
    await page.mouse.move(700, 450);
    k.cur.x = 700; k.cur.y = 450;
    t.mark();
    await sleep(200);
    await fade('0');
    await sleep(380);
    // 1. actual result
    await k.moveTo(280, 490, 350);
    await page.mouse.click(280, 490);
    await page.keyboard.type('Home screen shown', { delay: 22 });
    await sleep(150);
    // 2. Pass
    await k.moveTo(150, 608, 300);
    await page.mouse.click(150, 608);
    await sleep(150);
    // 3. Record -> e-sign dialog
    await k.moveTo(417, 877, 300);
    await page.mouse.click(417, 877);
    await sleep(420);
    await k.moveTo(720, 318, 250);
    await page.mouse.click(720, 318);
    await sleep(150);
    await k.moveTo(700, 362, 180);
    await page.mouse.click(700, 362);
    await sleep(200);
    await k.moveTo(700, 458, 180);
    await page.mouse.click(700, 458);
    await page.keyboard.type('demo', { delay: 30 });
    await k.moveTo(558, 656, 250);
    await page.mouse.click(558, 656);
    await sleep(200);
    await k.moveTo(909, 745, 250);
    await page.mouse.click(909, 745);
    await sleep(1100); // step status updates
    await fade('1');
    await sleep(500);
    t.end();
  },
});
