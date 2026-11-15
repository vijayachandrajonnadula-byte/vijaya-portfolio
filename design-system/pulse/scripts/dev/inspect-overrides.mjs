/**
 * Prints font/fill overrides that component instances apply on top of their master, which pulse-extract does not capture.
 *   node --max-old-space-size=8192 scripts/dev/inspect-overrides.mjs "<symbol name contains>" ["<instance name contains>"]
 * e.g. "Variant=Underline, Size=Small, Interaction=Default" "Text Button"
 */
import { gid, loadFig } from '../figma/fig-load.mjs';

const [symbolPart, instPart = ''] = process.argv.slice(2);
const { nodes, byId, children } = await loadFig('pulse 2.0.fig');
const syms = nodes.filter((n) => n.type === 'SYMBOL' && n.name.includes(symbolPart));
console.log(`${syms.length} symbols match "${symbolPart}"`);
for (const s of syms.slice(0, 3)) {
  console.log('##', s.name, gid(s.guid));
  const walk = (n, d = 0) => {
    for (const k of children.get(gid(n.guid)) ?? []) {
      if (k.type === 'INSTANCE' && k.name.includes(instPart)) {
        const master = byId.get(gid(k.symbolData?.symbolID));
        console.log(' '.repeat(d * 2) + `${k.name} -> ${master?.name}`);
        for (const o of k.symbolData?.symbolOverrides ?? []) {
          const keys = Object.keys(o).filter((x) => !['guidPath', 'overrideLevel'].includes(x));
          const brief = {};
          for (const x of keys) brief[x] = ['fontName', 'fontSize', 'lineHeight', 'textData', 'fillPaints', 'textCase', 'textDecoration', 'letterSpacing', 'fontVariations'].includes(x) ? JSON.stringify(o[x]).slice(0, 160) : '…';
          console.log(' '.repeat(d * 2 + 2) + JSON.stringify(brief));
        }
      }
      walk(k, d + 1);
    }
  };
  walk(s);
}
