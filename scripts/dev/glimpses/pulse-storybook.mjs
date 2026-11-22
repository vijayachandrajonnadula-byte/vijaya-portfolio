// PULSE Storybook: Button playground -> flip the variant control -> Variants And Colors -> States -> back to Playground.
// Needs the dev server (or any host) serving /pulse-storybook/index.html. Override with SITE_URL.
import { record, tools, sleep, BASE } from './lib.mjs';

await record('pulse-storybook', {
  viewport: { width: 1440, height: 900 },
  url: `${BASE}/pulse-storybook/index.html?path=/story/actions-button--playground`,
  async run(page, t) {
    const k = tools(page);
    await page.waitForLoadState('networkidle');
    await sleep(1500);
    const radio = (label) => page.getByRole('radio', { name: label, exact: true }).first();
    const side = (name) => page.locator('#storybook-explorer-tree').getByText(name, { exact: true }).first();
    await page.mouse.move(760, 420);
    k.cur.x = 760; k.cur.y = 420;
    t.mark();
    await sleep(400);
    // the Controls panel changes the live component
    for (const v of ['outlined', 'text', 'contained']) {
      await k.moveToEl(radio(v), 500);
      await radio(v).click();
      await sleep(550);
    }
    await k.moveToEl(side('Variants And Colors'), 500);
    await side('Variants And Colors').click();
    await sleep(1000);
    await k.moveToEl(side('States'), 450);
    await side('States').click();
    await sleep(1000);
    await k.moveToEl(side('Playground'), 450);
    await side('Playground').click();
    await sleep(700);
    t.end();
  },
});
