/**
 * Lists frames of a .fig file (name, id, size, children), to find node ids for `npm run figma:frame`.
 *   node --max-old-space-size=12000 scripts/dev/fig-pages.mjs "../../pulse 2.0.fig" "Data Grid" [depth]   a page, by name
 *   node --max-old-space-size=12000 scripts/dev/fig-pages.mjs "../../pulse 2.0.fig" 12141:36455 [depth]    one node, by id
 * Instances named like ".Label-tags" and loose vectors are skipped.
 */
import { resolve } from 'node:path';
import { gid, loadFig } from '../figma/fig-load.mjs';

const { children, pages, byId } = await loadFig(resolve(process.argv[2]));
const want = process.argv[3] ?? '';
const depth = Number(process.argv[4] ?? 2);
const root = /^\d+:\d+$/.test(want) ? byId.get(want) : pages.find((p) => String(p.name).toLowerCase().includes(want.toLowerCase()));
if (!root) { console.log('no match. pages:', pages.map((p) => p.name).join(' | ')); process.exit(1); }
const show = (n, d) => {
  const kids = children.get(gid(n.guid)) ?? [];
  if (/Label-tags|Documentation (blue|footer)/.test(n.name) || n.type === 'VECTOR' || n.type === 'LINE') return;
  console.log(`${'  '.repeat(d)}${gid(n.guid).padEnd(11)} [${n.type}] ${String(n.name).slice(0, 60)}  ${Math.round(n.size?.x ?? 0)}x${Math.round(n.size?.y ?? 0)}  kids=${kids.length}`);
  if (d < depth) for (const k of kids) show(k, d + 1);
};
show(root, 0);
