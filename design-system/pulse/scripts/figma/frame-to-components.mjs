/**
 * Figma frame -> design-system components.
 *   node --max-old-space-size=8192 scripts/figma/frame-to-components.mjs <node-id> [maxDepth=6]
 * <node-id> is the id from a Figma URL (?node-id=4720-15344 or 4720:15344) of a frame, section or page in "pulse 2.0.fig".
 * Walks the frame, and for every component INSTANCE prints: Figma set name -> code component (from ai/figma-map.json),
 * with the variant properties the designer chose, which become the component's props. Anything that is not an instance is a
 * layout frame (use AppShell / templates / Box layout) or raw text/vector (check it is not a missing component).
 */
import { readFileSync } from 'node:fs';
import { gid, loadFig } from './fig-load.mjs';

const [rawId, depthArg] = process.argv.slice(2);
if (!rawId) {
  console.error('Usage: frame-to-components.mjs <node-id> [maxDepth]');
  process.exit(1);
}
const id = rawId.replace('-', ':');
const maxDepth = Number(depthArg ?? 6);
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const strip = (s) => norm(s.replace(/^[.\s]*(building ?blocks?|buildingblock)\s*\/\s*/i, '').replace(/^\.?\s*(atom|building ?blocks?)\s*/i, ''));

const map = JSON.parse(readFileSync(new URL('../../ai/figma-map.json', import.meta.url), 'utf8'));
const bySet = new Map();
for (const p of map.pages) for (const s of p.sets) {
  const comp = s.implementedBy[0];
  for (const k of [norm(s.set), strip(s.set)]) if (comp && !bySet.has(k)) bySet.set(k, { component: s.component ?? `${comp} (building block)`, page: p.figmaPage, exact: Boolean(s.component) });
}

// UI icons: Figma icon sets are kebab-case (dashboard-square-01) -> PascalCase + Icon (DashboardSquare01Icon) in src/icons.
const icons = new Set([...readFileSync(new URL('../../src/icons/iconList.ts', import.meta.url), 'utf8').matchAll(/\["(\w+Icon)"/g)].map((m) => m[1]));
const iconFor = (n) => { const p = n.replace(/(^|-)([a-z0-9])/g, (_m, _a, c) => c.toUpperCase()) + 'Icon'; return icons.has(p) ? p : null; };

const { byId, children } = await loadFig('pulse 2.0.fig');
const root = byId.get(id);
if (!root) {
  console.error(`Node ${id} not found in the .fig`);
  process.exit(1);
}
const parseProps = (name) => Object.fromEntries(name.split(',').map((x) => x.trim()).filter((x) => x.includes('=')).map((x) => { const i = x.indexOf('='); return [x.slice(0, i).trim(), x.slice(i + 1).trim()]; }));

const found = new Map();
const lines = [];
function walk(n, depth) {
  const kids = children.get(gid(n.guid)) ?? [];
  if (n.type === 'INSTANCE') {
    const master = byId.get(gid(n.symbolData?.symbolID));
    const set = master ? byId.get(gid(master.parentIndex?.guid)) : null;
    const setName = set?.isStateGroup ? set.name : master?.name ?? n.name;
    if (/^\.?label-tags$/i.test(setName.trim())) return; // documentation label, not UI
    const ic = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(setName) ? iconFor(setName) : null;
    const hit = ic ? { component: `${ic} (src/icons)`, exact: true } : (bySet.get(norm(setName)) ?? bySet.get(strip(setName)));
    const props = master ? parseProps(master.name) : {};
    const label = hit ? `${hit.component}${hit.exact ? '' : ''}` : 'NOT MAPPED (check ai/figma-map.json; may be an icon or a missing component)';
    lines.push(`${'  '.repeat(depth)}<${setName}>  ->  ${label}${Object.keys(props).length ? `   props: ${Object.entries(props).map(([k, v]) => `${k}=${v}`).join(', ')}` : ''}`);
    found.set(setName, hit?.component ?? null);
    return; // do not descend into instances: their internals belong to the component
  }
  if (depth <= maxDepth && n.type !== 'CANVAS') lines.push(`${'  '.repeat(depth)}[${n.type.toLowerCase()}] ${n.name}${n.stackMode && n.stackMode !== 'NONE' ? `  (${n.stackMode === 'HORIZONTAL' ? 'row' : 'column'}, gap ${n.stackSpacing ?? 0})` : ''}`);
  if (depth < maxDepth) for (const k of kids) walk(k, depth + 1);
}
walk(root, 0);
console.log(`# ${root.name} (${id})\n${lines.join('\n')}`);
const unmapped = [...found].filter(([, c]) => !c).map(([n]) => n);
console.log(`\n${found.size} distinct component sets used. Unmapped: ${unmapped.length ? unmapped.join(', ') : 'none'}`);
