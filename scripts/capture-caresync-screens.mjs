import { chromium } from 'playwright';
import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://care-sync-two-mu.vercel.app';
const OUT = path.join(__dirname, '../public/images/projects/caresync');

// Live routes, confirmed from the deployed bundle. The deployed app uses
// /shift-briefing (command centre) and /operational-insights (analytics).
const screens = [
  { route: '/shift-briefing', name: 'dashboard' },
  { route: '/patients', name: 'patients' },
  { route: '/patients/meera-iyer', name: 'patient-profile' },
  { route: '/appointments', name: 'appointments' },
  { route: '/medical-records', name: 'medical-records' },
  { route: '/messages', name: 'messages' },
  { route: '/tasks', name: 'tasks' },
  { route: '/operational-insights', name: 'operational-insights' },
  { route: '/settings', name: 'settings' },
];

const WIDTH = 1440;
const BASE_HEIGHT = 900;
const MAX_HEIGHT = 3200; // keep files sane; taller than this reads as a strip, not a screen

fs.mkdirSync(path.join(OUT, 'desktop'), { recursive: true });

const browser = await chromium.launch({ headless: true });

/**
 * CareSync's app shell is height:100vh with its own internal scroll container,
 * so Playwright's fullPage:true returns exactly one viewport and silently crops
 * everything below the fold. Instead: measure how far the tallest inner scroller
 * overflows, grow the viewport by that amount, and let the 100vh shell expand.
 */
/**
 * Returns how many pixels the viewport should change by:
 *   positive -> content is clipped, grow the viewport
 *   negative -> trailing dead space, shrink it
 * Measured against the main scroll container so the result is a screenshot that
 * ends where the content ends.
 */
async function heightDelta(page) {
  return page.evaluate(() => {
    let main = null;
    let bestArea = 0;
    for (const el of document.querySelectorAll('*')) {
      if (el.clientHeight < 200) continue;
      const style = getComputedStyle(el);
      if (!/(auto|scroll)/.test(style.overflowY)) continue;
      const area = el.clientWidth * el.clientHeight;
      if (area > bestArea) { bestArea = area; main = el; }
    }
    if (!main) {
      const doc = document.documentElement;
      return doc.scrollHeight - doc.clientHeight;
    }

    const overflow = main.scrollHeight - main.clientHeight;
    if (overflow > 2) return overflow + 24;

    // No overflow: find where the content actually stops inside the container.
    const top = main.getBoundingClientRect().top;
    let bottom = 0;
    for (const kid of main.querySelectorAll('*')) {
      const r = kid.getBoundingClientRect();
      if (r.height === 0 && r.width === 0) continue;
      bottom = Math.max(bottom, r.bottom - top + main.scrollTop);
    }
    const slack = main.clientHeight - bottom;
    return slack > 48 ? -(slack - 32) : 0;
  });
}

async function captureFull(page, file) {
  await page.setViewportSize({ width: WIDTH, height: BASE_HEIGHT });
  await page.waitForTimeout(700);

  // Resizing reflows content, so converge over a few passes.
  let height = BASE_HEIGHT;
  for (let pass = 0; pass < 4; pass++) {
    const delta = await heightDelta(page);
    if (Math.abs(delta) <= 8) break;
    height = Math.round(Math.max(560, Math.min(MAX_HEIGHT, height + delta)));
    await page.setViewportSize({ width: WIDTH, height });
    await page.waitForTimeout(600);
  }

  await page.screenshot({ path: file, fullPage: false, type: 'png' });
  return height;
}

/**
 * DOM measurement can't see trailing dead space, because full-height wrapper
 * divs report a bottom equal to the container. So trim in pixel space instead:
 * scan upward for the last row that differs from the app background, ignoring
 * the dark full-height sidebar on the left.
 */
const SIDEBAR_CSS = 232;
async function trimBottom(file, scale) {
  const img = await Jimp.read(file);
  const { width, height } = img.bitmap;
  const startX = Math.round((SIDEBAR_CSS + 24) * scale);
  const endX = width - Math.round(16 * scale);
  if (startX >= endX) return null;

  const bg = img.getPixelColor(endX - 2, height - 3);
  const bgR = (bg >>> 24) & 255, bgG = (bg >>> 16) & 255, bgB = (bg >>> 8) & 255;
  const differs = (x, y) => {
    const c = img.getPixelColor(x, y);
    return Math.abs(((c >>> 24) & 255) - bgR) > 10
      || Math.abs(((c >>> 16) & 255) - bgG) > 10
      || Math.abs(((c >>> 8) & 255) - bgB) > 10;
  };

  let contentBottom = null;
  const step = Math.max(2, Math.round(4 * scale));
  for (let y = height - 3; y > 0; y--) {
    let hit = false;
    for (let x = startX; x < endX; x += step) {
      if (differs(x, y)) { hit = true; break; }
    }
    if (hit) { contentBottom = y; break; }
  }
  if (contentBottom === null) return null;

  const target = Math.min(height, contentBottom + Math.round(40 * scale));
  if (height - target < Math.round(24 * scale)) return null; // not worth re-writing
  img.crop({ x: 0, y: 0, w: width, h: target });
  await img.write(file);
  return Math.round(target / scale);
}

const context = await browser.newContext({ viewport: { width: WIDTH, height: BASE_HEIGHT }, deviceScaleFactor: 2 });
const page = await context.newPage();

for (const s of screens) {
  await page.setViewportSize({ width: WIDTH, height: BASE_HEIGHT });
  await page.goto(BASE + s.route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const file = path.join(OUT, 'desktop', `${s.name}.png`);
  const h = await captureFull(page, file);
  const trimmed = await trimBottom(file, 2);
  console.log(`desktop/${s.name}.png  ${WIDTH}x${trimmed ?? h}${trimmed ? ` (trimmed from ${h})` : ''}`);
}
await context.close();

/**
 * Mobile screens at 390px.
 *
 * The deployed app swaps the sidebar for a bottom tab bar below ~1024px, but at
 * <=430px some clinical surfaces clip: an inner container overflows its width
 * WITHOUT overflow-x:auto, so text is cut rather than scrollable. We capture
 * every screen, measure that clipping, and report it — only the clean ones are
 * worth publishing, and the rest are documented as a known limitation.
 */
fs.mkdirSync(path.join(OUT, 'mobile'), { recursive: true });
const mCtx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const mPage = await mCtx.newPage();
const mobileReport = [];
for (const s of screens) {
  await mPage.setViewportSize({ width: 390, height: 844 });
  await mPage.goto(BASE + s.route, { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(1200);

  const clip = await mPage.evaluate(() => {
    let worst = 0;
    for (const el of document.querySelectorAll('*')) {
      if (el.clientWidth < 120) continue;
      if (/(auto|scroll)/.test(getComputedStyle(el).overflowX)) continue; // intentional scroller
      worst = Math.max(worst, el.scrollWidth - el.clientWidth);
    }
    return worst;
  });

  // Fixed 390x844 viewport, deliberately NOT trimmed to content. The mobile
  // gallery frame has a fixed aspect ratio, so uniform captures crop
  // predictably; variable heights make each thumbnail crop differently.
  const file = path.join(OUT, 'mobile', `${s.name}.png`);
  await mPage.screenshot({ path: file, fullPage: false, type: 'png' });
  mobileReport.push({ name: s.name, clip });
  console.log(`mobile/${s.name}.png  clip=${clip}px ${clip > 4 ? '<-- CLIPPED' : 'clean'}`);
}
await mCtx.close();

// Only the clean captures are publishable, so delete the clipped ones here.
// Leaving them on disk means a later re-run silently re-adds unreferenced,
// visibly broken images to the repo and the PWA precache.
const clipped = mobileReport.filter(m => m.clip > 4);
for (const m of clipped) {
  const f = path.join(OUT, 'mobile', `${m.name}.png`);
  if (fs.existsSync(f)) fs.unlinkSync(f);
}
console.log('\nclean mobile screens kept:', mobileReport.filter(m => m.clip <= 4).map(m => m.name).join(', ') || '(none)');
if (clipped.length) console.log('clipped, discarded:', clipped.map(m => `${m.name} (${m.clip}px)`).join(', '));

/**
 * Low-fidelity wireframes.
 *
 * These are the eight rough layout cards from the project's own case study
 * page — structure only, no colour or component decisions. Captured per card
 * so each can be labelled in the portfolio's wireframe grid.
 */
/* Wireframes are no longer scraped from the live case study — scraped fragments
 * did not read as wireframes. They are authored instead, from the captured UI
 * screens, by scripts/generate-caresync-wireframes.mjs. */
const SKIP_WIREFRAME_SCRAPE = true;
if (!SKIP_WIREFRAME_SCRAPE) {
const wCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const wPage = await wCtx.newPage();
await wPage.goto(BASE + '/case-study', { waitUntil: 'networkidle' });
await wPage.waitForTimeout(2000);

// NOTE: do not inject `opacity: 1 !important` here. These wireframes get their
// low-fidelity grey from aubergine drawn at low opacity, so forcing opacity to 1
// repaints every placeholder bar as solid brand purple and destroys the look.
// Instead, scroll the app shell's inner container all the way through so the
// scroll-reveal animations run and settle naturally.
const wfScroller = await wPage.evaluateHandle(() => {
  let best = null, area = 0;
  for (const el of document.querySelectorAll('*')) {
    if (el.clientHeight < 200) continue;
    if (!/(auto|scroll)/.test(getComputedStyle(el).overflowY)) continue;
    if (el.scrollHeight - el.clientHeight < 100) continue;
    const a = el.clientWidth * el.clientHeight;
    if (a > area) { area = a; best = el; }
  }
  return best;
});
await wPage.evaluate(async (el) => {
  if (!el) return;
  for (let y = 0; y < el.scrollHeight; y += 500) {
    el.scrollTop = y;
    await new Promise(r => setTimeout(r, 90));
  }
}, wfScroller);
await wPage.waitForTimeout(1500);

// `[class*="wfCard"]` also matches wfCardHeader / wfCardBody / wfCardTitle and
// returns 32 nodes. CSS-module classes are `_<name>_<hash>_<line>`, so match on
// the name segment being exactly "wfCard" to get the 8 real cards.
const wfCount = await wPage.evaluate(() => {
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cards = Array.from(document.querySelectorAll('[class*="wfCard"]')).filter(el =>
    Array.from(el.classList).some(c => c.split('_')[1] === 'wfCard')
  );
  cards.forEach((card, i) => {
    const texts = Array.from(card.querySelectorAll('*'))
      .filter(e => e.children.length === 0)
      .map(e => (e.textContent || '').trim())
      .filter(t => t && !/^[A-H]$/.test(t));
    card.setAttribute('data-wf-index', String(i));
    card.setAttribute('data-wf-name', slug(texts[0] || `wireframe-${i}`));
  });
  return cards.length;
});
console.log(`wireframe cards found: ${wfCount}`);

for (let i = 0; i < wfCount; i++) {
  const el = wPage.locator(`[data-wf-index="${i}"]`);
  const name = await el.getAttribute('data-wf-name');
  await el.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await wPage.waitForTimeout(1300); // let the reveal transition finish
  const file = path.join(OUT, 'wireframes', `${name}.png`);
  await el.screenshot({ path: file });
  const box = await el.boundingBox();
  console.log(`wireframes/${name}.png  ${Math.round(box.width)}x${Math.round(box.height)}`);
}
await wCtx.close();
}

/**
 * Cover for the projects grid.
 *
 * The card renders the cover in a 677x439 box (ratio 1.54) with
 * object-fit:cover and object-position:top left. Two things follow:
 *  - Match that ratio, so almost nothing is cropped away.
 *  - Capture NARROW, not wide. A 1600px-wide app screenshot is downscaled 4.7x
 *    into that box and the dense clinical UI becomes unreadable. 1200px wide
 *    keeps the sidebar (the app switches to a drawer below ~1100px) while
 *    rendering every label legibly at card size.
 */
const COVER_W = 1200;
const COVER_H = Math.round(COVER_W / 1.54);
const coverCtx = await browser.newContext({
  viewport: { width: COVER_W, height: COVER_H },
  deviceScaleFactor: 2,
});
const coverPage = await coverCtx.newPage();
await coverPage.goto(BASE + '/shift-briefing', { waitUntil: 'networkidle' });
await coverPage.waitForTimeout(1600);
await coverPage.screenshot({ path: path.join(OUT, 'cover.png'), fullPage: false, type: 'png' });
console.log(`cover.png  ${COVER_W}x${COVER_H}`);

await browser.close();
