// PULSE gallery: Button (hover) -> Chip (hover) -> DataGrid (sort a column) -> back to Button.
// Needs the dev server (or any host) serving /pulse-gallery/index.html. Override with SITE_URL.
import { record, tools, sleep, BASE } from './lib.mjs';

await record('pulse-design-system', {
  viewport: { width: 1440, height: 900 },
  url: `${BASE}/pulse-gallery/index.html#/Button`,
  async run(page, t) {
    const k = tools(page);
    await page.waitForLoadState('networkidle');
    await sleep(700);
    const nav = (name) => page.locator('nav').getByText(name, { exact: true }).first();
    // warm the lazy-loaded pages first so no "Loading..." frame is recorded, then return to Button
    for (const n of ['Chip', 'DataGrid', 'Button']) {
      await nav(n).click();
      await page.getByText('Loading...').waitFor({ state: 'detached' }).catch(() => {});
      await page.waitForLoadState('networkidle');
      await sleep(500);
    }
    await page.mouse.move(700, 520);
    k.cur.x = 700; k.cur.y = 520;
    t.mark();
    await sleep(300);
    // Button: hover an outlined and a contained variant
    await k.moveTo(285, 198, 550); // outlined primary
    await sleep(300);
    await k.moveTo(511, 122, 450); // contained success
    await sleep(300);
    // Chip
    await k.moveToEl(nav('Chip'), 450);
    await nav('Chip').click();
    await sleep(250);
    await k.moveTo(580, 494, 450); // Dropdown chip
    await sleep(250);
    await k.moveTo(740, 494, 400); // Deletable chip
    await sleep(250);
    // DataGrid: sort by the Document column
    await k.moveToEl(nav('DataGrid'), 450);
    await nav('DataGrid').click();
    await sleep(250);
    const head = page.getByText('Document', { exact: true }).first();
    await k.moveToEl(head, 450);
    await head.click();
    await sleep(700);
    // back to Button for a clean loop
    await k.moveToEl(nav('Button'), 450);
    await nav('Button').click();
    await sleep(400);
    t.end();
  },
});
