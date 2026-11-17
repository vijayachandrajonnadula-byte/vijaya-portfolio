// Contrast check for the v2 film (light only). Usage: node scripts/dev/v2-contrast.mjs [port=9771]
// Needs the dev server on :5173 and Microsoft Edge. For every beat it scrolls to the middle of the pinned part and samples
// the resolved text colour and the effective background of every visible text node in the HUD and the scene, then prints failures.
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const port = process.argv[2] ?? '9771';
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const proc = spawn(edge, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}/edge-v2-contrast`, '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
try {
  let t; for (let i = 0; i < 50 && !t; i++) { await sleep(400); try { t = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((x) => x.type === 'page'); } catch { /* wait */ } }
  const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
  let id = 0; const p = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && p.has(d.id)) { p.get(d.id)(d); p.delete(d.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expression) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description); return r.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }, { name: 'prefers-color-scheme', value: 'light' }] });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:5173/' }); await sleep(9000);

  const probe = `(() => {
    const parse = (c) => { const m = c.match(/color\\(srgb ([\\d.]+) ([\\d.]+) ([\\d.]+)(?: \\/ ([\\d.]+))?\\)/); if (m) return [m[1] * 255, m[2] * 255, m[3] * 255, m[4] === undefined ? 1 : +m[4]]; const r = c.match(/rgba?\\(([^)]+)\\)/); if (!r) return null; const a = r[1].split(/[ ,\\/]+/).map(Number); return [a[0], a[1], a[2], a[3] === undefined ? 1 : a[3]]; };
    const lum = (c) => { const f = (v) => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
    const over = (top, under) => { const a = top[3]; return [top[0] * a + under[0] * (1 - a), top[1] * a + under[1] * (1 - a), top[2] * a + under[2] * (1 - a), 1]; };
    // the chapter colour is a sibling layer (.v2-wash) under the scene, not an ancestor: use it as the base
    const bgAt = (el) => { const stack = []; const st = el.closest('.v2-stage__in'); for (let e = el; e; e = e.parentElement) { if (st && e === st.parentElement) { const w = e.querySelector('.v2-wash'); if (w) stack.push(parse(getComputedStyle(w).backgroundColor)); } const b = parse(getComputedStyle(e).backgroundColor); if (b && b[3] > 0) { stack.push(b); if (b[3] === 1) break; } } let c = [250, 249, 247, 1]; for (const b of stack.reverse()) c = over(b, c); return c; };
    const out = []; const seen = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode; if (!n.textContent.trim()) continue; const el = n.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
      if (el.closest('.v2-sr, .v2-glyph, .v2-grain, [hidden], script, style')) continue;
      const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      let op = 1; for (let e = el; e; e = e.parentElement) op *= +getComputedStyle(e).opacity; if (op < 0.9) continue; // still fading in
      const fg = parse(cs.color); if (!fg) continue; const bg = bgAt(el); const f = over(fg, bg);
      const L1 = lum(f), L2 = lum(bg); const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
      const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700; const large = size >= 24 || (bold && size >= 18.66);
      out.push({ t: n.textContent.trim().slice(0, 28), ratio: +ratio.toFixed(2), need: large ? 3 : 4.5, cls: (el.className || el.tagName).toString().slice(0, 28) });
    }
    return out;
  })()`;

  const beats = await ev(`[...document.querySelectorAll('.v2-beat')].map(s => s.id)`);
  let fails = 0, checked = 0;
  for (let i = 0; i < beats.length; i++) {
    await ev(`(() => { const el = document.getElementById(${JSON.stringify(beats[i])}); const top = el.getBoundingClientRect().top + scrollY; const pin = Math.max(0, el.offsetHeight - innerHeight); window.scrollTo(0, ${i} === 0 ? 0 : top + pin * 0.5); })()`);
    await sleep(1400); // HUD colour transition is .6s
    const rows = await ev(probe);
    const bad = rows.filter((r) => r.ratio < r.need);
    checked += rows.length; fails += bad.length;
    console.log(`${beats[i].padEnd(36)} text nodes ${String(rows.length).padStart(3)}  min ${Math.min(...rows.map((r) => r.ratio)).toFixed(2)}  failures ${bad.length}`);
    bad.forEach((b) => console.log(`   FAIL ${b.ratio} < ${b.need}  "${b.t}"  .${b.cls}`));
  }
  console.log(`\nchecked ${checked} text nodes in ${beats.length} chapters, failures ${fails}`);
  process.exitCode = fails ? 1 : 0;
} finally { proc.kill(); }
