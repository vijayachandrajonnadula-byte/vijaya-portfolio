/**
 * Loads every gallery demo in one headless Edge session; reports console errors / exceptions / empty renders
 * and saves a PNG per demo.   node scripts/dev/sweep-demos.mjs <outDir> [port=9450] [baseUrl=http://localhost:5173]
 */
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const [outDir, port = '9450', base = 'http://localhost:5173'] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const names = [];
const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); e.isDirectory() ? walk(p) : e.name.endsWith('.demo.tsx') && names.push(e.name.replace('.demo.tsx', '')); } };
walk('src/components');
names.sort();
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const proc = spawn(edge, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}/edge-sweep`, '--window-size=1200,900', 'about:blank'], { stdio: 'ignore' });
try {
  let target;
  for (let i = 0; i < 40 && !target; i++) { await sleep(400); try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch { /* wait */ } }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map(); let errors = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
    if (d.method === 'Runtime.exceptionThrown') errors.push('EXC ' + (d.params.exceptionDetails.exception?.description ?? d.params.exceptionDetails.text).slice(0, 300));
    if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push('console.error ' + d.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 300));
  };
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable'); await send('Page.enable');
  const bad = [];
  for (const n of names) {
    errors = [];
    await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `${base}/?c=${n}` });
    await sleep(1800);
    const box = (await send('Runtime.evaluate', { returnByValue: true, expression: `(() => { const e = document.getElementById('demo-root'); if (!e) return null; const b = e.getBoundingClientRect(); return { h: Math.ceil(b.height + b.top), txt: e.innerText.length, overlay: !!document.querySelector('vite-error-overlay') }; })()` })).result.result.value;
    if (!box) { bad.push(`${n}: no #demo-root`); continue; }
    await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: Math.min(box.h + 20, 12000), deviceScaleFactor: 1, mobile: false });
    await sleep(300);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(outDir, `${n}.png`), Buffer.from(shot.result.data, 'base64'));
    const flags = [box.overlay && 'VITE-OVERLAY', box.h < 120 && `tiny(${box.h}px)`, ...errors.slice(0, 3)].filter(Boolean);
    if (flags.length) bad.push(`${n}: ${flags.join(' | ')}`);
  }
  console.log(`${names.length} demos swept. Problems: ${bad.length}`);
  console.log(bad.join('\n'));
  ws.close();
} finally { proc.kill(); }
