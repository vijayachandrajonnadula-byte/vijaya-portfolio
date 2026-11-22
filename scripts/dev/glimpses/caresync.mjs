// CareSync: calm scroll through the real hosted shift briefing, one hover, back to the top.
import { record, tools, sleep } from './lib.mjs';

await record('caresync', {
  viewport: { width: 1280, height: 800 },
  url: 'https://care-sync-two-mu.vercel.app/shift-briefing',
  async run(page, t) {
    const k = tools(page);
    await page.waitForLoadState('networkidle');
    await sleep(800);
    await page.mouse.move(700, 500); // cursor appears at the start position
    t.mark();
    await sleep(400);
    await k.scrollTo(380, 1300, 'main');
    await sleep(300);
    // hover the "Why this needs review" panel / first detail row
    const hov = page.getByText('Glucose increased by +24 mg/dL').first();
    await k.moveToEl(hov, 700);
    await sleep(700);
    await k.scrollTo(760, 1300, 'main');
    await sleep(400);
    await k.moveTo(700, 500, 500);
    await k.scrollTo(0, 1500, 'main');
    await sleep(200);
    t.end();
  },
});
