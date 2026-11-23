// Re-captures the eight screens of the Electronic execution case study (public/images/projects/execution/*.jpg) from the running app.
//
// Needs the PULSE app dev server (it imports the app's store and ui modules to put it in each state):
//   cd design-system/pulse && node node_modules/vite/bin/vite.js --port 5190 --strictPort
// then:
//   node scripts/dev/execution-shots.mjs            (APP=http://localhost:5190, OUT=public/images/projects/execution)
//
// Every state is reached with the app's own actions (select a step, set a result, record, sign, fill with the scripted AI output),
// never by editing the page, so each screen is something a person can reach. Each shot starts from a fresh page load.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..', '..');
const { chromium } = createRequire(path.join(repo, 'package.json'))('playwright');

const APP = process.env.APP || 'http://localhost:5190';
const OUT = process.env.OUT || path.join(repo, 'public', 'images', 'projects', 'execution');
const URL = `${APP}/#/ElectronicExecution`;
const STORE = '/src/pages/ElectronicExecution/store.ts';
const UI = '/src/pages/ElectronicExecution/ui.ts';
const MODEL = '/src/pages/ElectronicExecution/model.ts';

const browser = await chromium.launch();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fresh() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.warn('  page error:', String(e).slice(0, 160)));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  return { ctx, page };
}

/** Run a function in the page with the app's store actions, ui and model constants. */
const inApp = (page, fn) =>
  page.evaluate(
    async ([fnSrc, store, ui, model]) => {
      const S = await import(/* @vite-ignore */ store);
      const U = await import(/* @vite-ignore */ ui);
      const M = await import(/* @vite-ignore */ model);
      // eslint-disable-next-line no-new-func
      return new Function('A', 'ui', 'M', 'S', `return (${fnSrc})(A, ui, M, S)`)(S.executionActions, U.ui, M, S);
    },
    [fn.toString(), STORE, UI, MODEL],
  );

async function waitForToastGone(page) {
  for (let i = 0; i < 40; i++) {
    const has = await page.evaluate(() => !!document.querySelector('[role="status"], [role="alert"]') && /viewer is now viewing/i.test(document.body.innerText));
    if (!has) return;
    await sleep(300);
  }
}

async function shot(page, name) {
  await page.waitForTimeout(700);
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, type: 'jpeg', quality: 82 });
  console.log('  wrote', path.relative(repo, file), Math.round(fs.statSync(file).size / 1024) + ' KB');
}

fs.mkdirSync(OUT, { recursive: true });
const creds = (M) => ({ reason: M.SIGN_REASONS[0], userId: 'user.executor', password: 'x', accept: true });

// 1. the execution screen as it opens
{
  console.log('execution.jpg');
  const { ctx, page } = await fresh();
  await waitForToastGone(page);
  await shot(page, 'execution.jpg');
  await ctx.close();
}

// 2. the e-signature dialog, over a step ready to record
{
  console.log('e-sign.jpg');
  const { ctx, page } = await fresh();
  await inApp(page, (A, ui) => {
    A.selectStep('T1-S2');
    A.setActual('T1-S2', 'Displayed speed is 5.04 RPM');
    A.addEvidence('T1-S2', { kind: 'screenshot', name: 'speed.png', sizeKb: 40 });
    A.setVerdict('T1-S2', 'pass');
    const r = A.recordStep('T1-S2');
    ui.set({ panelCollapsed: false });
    if (r.ok && r.needsSignature) ui.open('sign', { stepIds: ['T1-S2'] });
  });
  await waitForToastGone(page);
  await shot(page, 'e-sign.jpg');
  await ctx.close();
}

// 3. a Fail, signed, and the prompt to raise a discrepancy (the AI agent panel is open behind it)
{
  console.log('discrepancy.jpg');
  const { ctx, page } = await fresh();
  await inApp(page, (A, ui, M) => {
    A.selectStep('T1-S2');
    A.setActual('T1-S2', 'Displayed speed is 4.2 RPM, outside the limit');
    A.addEvidence('T1-S2', { kind: 'screenshot', name: 'speed.png', sizeKb: 40 });
    A.setVerdict('T1-S2', 'fail');
    A.recordStep('T1-S2');
    const signed = A.eSign({ reason: M.SIGN_REASONS[0], userId: 'user.executor', password: 'x', accept: true });
    ui.set({ panelCollapsed: false });
    ui.open('aiAgent');
    if (signed.ok) ui.open('discrepancyPrompt', { stepId: 'T1-S2' });
  });
  await waitForToastGone(page);
  await shot(page, 'discrepancy.jpg');
  await ctx.close();
}

// 4. the AI agent: tick a table, run it, and look at the drafts and the banner that says they are drafts
{
  console.log('ai-agent.jpg');
  const { ctx, page } = await fresh();
  await inApp(page, (A, ui) => ui.open('aiAgent'));
  await waitForToastGone(page);
  await page.getByText('Table 1: Speed Verification').first().click();
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await page.waitForFunction(() => /AI results are drafts/.test(document.body.innerText), null, { timeout: 15000 });
  await page.waitForTimeout(5500); // the "AI proposed N results" toast covers the document for a few seconds
  await page.evaluate(() => {
    const body = document.querySelector('[data-spec="sidepanel"] [data-spec="flyout-body"]');
    const t = [...document.querySelectorAll('[data-spec="sidepanel"] *')].find((e) => /Review the drafts/.test(e.textContent || '') && e.children.length === 0 ? false : /Review the drafts/.test(e.textContent || '') && e.textContent.length < 60);
    if (body && t) body.scrollTop = Math.max(0, t.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 8);
  });
  await shot(page, 'ai-agent.jpg');
  await ctx.close();
}

// 5 to 7. the run part-way: tables 1 and 2 filled by the scripted assistant and recorded; a Fail, if there is one, has its discrepancy
async function midRunPage() {
  const { ctx, page } = await fresh();
  const summary = await inApp(page, (A, ui, M, S) => {
    const ids = (n) => S.executionStore.getState().protocol.tables.find((t) => t.n === n).stepIds;
    for (const n of [1, 2]) { A.aiFill(ids(n)); A.recordAllAi(ids(n)); }
    const steps = Object.values(S.executionStore.getState().protocol.steps);
    const failed = steps.filter((x) => x.verdict === 'fail' && x.state === 'recorded');
    for (const f of failed) A.raiseDiscrepancy(f.id, { severity: 'moderate', description: 'Reading outside the expected limit' });
    return { recorded: steps.filter((x) => x.state === 'recorded').length, failed: failed.length };
  });
  console.log('  state:', JSON.stringify(summary));
  await waitForToastGone(page);
  await page.waitForTimeout(5500); // let the "recorded" and "discrepancy raised" toasts fade
  return { ctx, page };
}
{
  console.log('status.jpg');
  const { ctx, page } = await midRunPage();
  await inApp(page, (A, ui) => ui.open('status'));
  await shot(page, 'status.jpg');
  await ctx.close();
}
{
  console.log('metrics.jpg');
  const { ctx, page } = await midRunPage();
  await inApp(page, (A, ui) => ui.open('metrics'));
  await shot(page, 'metrics.jpg');
  await ctx.close();
}

// 7. the details panel (task and equipment, with the icon rail that switches to the audit trail)
{
  console.log('audit.jpg');
  const { ctx, page } = await midRunPage();
  await inApp(page, (A, ui) => ui.open('details'));
  await shot(page, 'audit.jpg');
  await ctx.close();
}

// 8. split execution
{
  console.log('split.jpg');
  const { ctx, page } = await fresh();
  await inApp(page, (A, ui) => ui.open('split'));
  await waitForToastGone(page);
  await shot(page, 'split.jpg');
  await ctx.close();
}

await browser.close();
console.log('done');
