// Shared helpers for recording the home-page "glimpse" clips. See README.md.
import { createRequire } from 'module';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const repo = path.resolve(here, '..', '..', '..');
const req = createRequire(path.join(repo, 'package.json'));
export const { chromium } = req('playwright');

export const FFMPEG =
  process.env.FFMPEG ||
  path.join(process.env.LOCALAPPDATA || '', 'ms-playwright', 'ffmpeg-1011', 'ffmpeg-win64.exe');
export const OUT_DIR = path.join(repo, 'public', 'videos', 'projects');
export const WORK = process.env.GLIMPSE_WORK || path.join(process.env.TEMP || '.', 'glimpses-work');
export const BASE = process.env.SITE_URL || 'http://localhost:5173';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// A small dark dot with a white ring that follows the mouse (Playwright recordings draw no cursor).
const cursorScript = () => {
  const mk = () => {
    if (document.getElementById('__cur') || !document.documentElement) return;
    const d = document.createElement('div');
    d.id = '__cur';
    d.style.cssText =
      'position:fixed;left:0;top:0;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#17171a;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);pointer-events:none;z-index:2147483647;opacity:0;transition:opacity .2s';
    document.documentElement.appendChild(d);
    window.addEventListener(
      'mousemove',
      (e) => {
        d.style.opacity = '1';
        d.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      },
      true
    );
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mk);
  else mk();
};

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function tools(page) {
  const cur = { x: 480, y: 300 };
  return {
    cur,
    async moveTo(x, y, ms = 700) {
      // real-clock interpolation: the move takes `ms` however slow each mouse call is
      const sx = cur.x, sy = cur.y, t0 = Date.now();
      for (;;) {
        const p = Math.min(1, (Date.now() - t0) / ms);
        const e = ease(p);
        await page.mouse.move(sx + (x - sx) * e, sy + (y - sy) * e);
        if (p >= 1) break;
      }
      cur.x = x; cur.y = y;
    },
    async moveToEl(loc, ms = 700, dx = 0.5, dy = 0.5) {
      const b = await loc.boundingBox();
      await this.moveTo(b.x + b.width * dx, b.y + b.height * dy, ms);
    },
    // Eased smooth scroll of a scroller (selector string or null for window) to y.
    async scrollTo(y, ms = 1800, sel = null) {
      await page.evaluate(
        ([y, ms, sel]) =>
          new Promise((res) => {
            const el = sel ? document.querySelector(sel) : null;
            const get = () => (el ? el.scrollTop : window.scrollY);
            const set = (v) => (el ? (el.scrollTop = v) : window.scrollTo(0, v));
            const y0 = get(), t0 = performance.now();
            const e = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
            const f = (n) => {
              const t = Math.min(1, (n - t0) / ms);
              set(y0 + (y - y0) * e(t));
              t < 1 ? requestAnimationFrame(f) : res();
            };
            requestAnimationFrame(f);
          }),
        [y, ms, sel]
      );
    },
  };
}

/**
 * Record one clip. `run(page, t)` drives the page; it must call `t.mark()` when the
 * first good frame is on screen, and `t.end()` when the loop's last frame is on screen.
 * Everything before mark and after end is trimmed away.
 */
export async function record(id, { viewport = { width: 960, height: 600 }, url, run, minDur = 6, maxDur = 9, bitrate = '600k', setup }) {
  fs.mkdirSync(WORK, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const dir = path.join(WORK, id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    recordVideo: { dir, size: { width: 960, height: 600 } },
  });
  await ctx.addInitScript(cursorScript);
  const t0 = Date.now();
  const page = await ctx.newPage();
  const marks = {};
  const t = {
    mark: () => (marks.start = (Date.now() - t0) / 1000),
    end: () => (marks.end = (Date.now() - t0) / 1000),
  };
  if (setup) await setup(ctx, page);
  if (url) await page.goto(url, { waitUntil: 'load' });
  await run(page, t);
  await sleep(150);
  const vpath = await page.video().path();
  await ctx.close();
  await browser.close();
  const start = marks.start ?? 0.5;
  const dur = (marks.end ?? start + 7) - start;
  if (dur < minDur || dur > maxDur) console.warn(`[${id}] duration ${dur.toFixed(2)}s outside ${minDur}-${maxDur}s`);
  const out = path.join(OUT_DIR, `${id}.webm`);
  const r = spawnSync(
    FFMPEG,
    ['-y', '-ss', start.toFixed(2), '-i', vpath, '-t', Math.min(dur, maxDur).toFixed(2), '-r', '30',
     '-c:v', 'libvpx', '-b:v', bitrate, '-crf', '12', '-an', '-pix_fmt', 'yuv420p', '-g', '30', '-auto-alt-ref', '0', out],
    { encoding: 'utf8' }
  );
  if (r.status !== 0) console.error(r.stderr.slice(-800));
  console.log(`[${id}] raw=${vpath} start=${start.toFixed(2)} dur=${dur.toFixed(2)} -> ${out} ${(fs.statSync(out).size / 1024) | 0} KB`);
}
