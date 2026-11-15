/**
 * Visual check: screenshots one gallery demo in headless Edge and prints console errors.
 *   node scripts/dev/shot-component.mjs <DemoName> <out.png> [width=1100] [debugPort=9400] [baseUrl=http://localhost:5173] [maxHeight=16000]
 * Pick your own debugPort if several people run this at once. Also prints rendered sizes of
 * elements tagged data-spec="..." so a demo can assert exact pixel dimensions.
 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const [name, out, width = '1100', port = '9400', base = 'http://localhost:5173', maxHeight = '16000'] = process.argv.slice(2);
const edge = [process.env.EDGE_PATH, 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(Boolean);
const profile = `${process.env.TEMP}/edge-shot-${port}`;
const proc = spawn(edge, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, `--window-size=${width},900`, 'about:blank'], { stdio: 'ignore' });
try {
  let target;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(400);
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch { /* not up yet */ }
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  const errors = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
    if (d.method === 'Runtime.exceptionThrown') errors.push('EXC ' + (d.params.exceptionDetails.exception?.description ?? '').slice(0, 400));
    if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push('console.error ' + d.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 400));
  };
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: Number(width), height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: `${base}/?c=${encodeURIComponent(name)}` });
  await sleep(3500);
  const box = (await send('Runtime.evaluate', { returnByValue: true, expression: `(() => { const e = document.getElementById('demo-root'); const b = e.getBoundingClientRect(); return { w: Math.ceil(b.width + b.left), h: Math.ceil(b.height + b.top) }; })()` })).result.result.value;
  await send('Emulation.setDeviceMetricsOverride', { width: Number(width), height: Math.min(box.h + 20, Number(maxHeight)), deviceScaleFactor: 1, mobile: false });
  await sleep(500);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
  const specs = (await send('Runtime.evaluate', { returnByValue: true, expression: `[...document.querySelectorAll('[data-spec]')].map(e => { const b = e.getBoundingClientRect(); return e.dataset.spec + ' => ' + Math.round(b.width * 100) / 100 + 'x' + Math.round(b.height * 100) / 100; })` })).result.result.value;
  if (specs?.length) console.log(specs.join('\n'));
  console.log(`saved ${out} (${box.w}x${box.h}); errors: ${errors.length ? '\n' + errors.join('\n') : 'none'}`);
  ws.close();
} finally {
  proc.kill();
}
