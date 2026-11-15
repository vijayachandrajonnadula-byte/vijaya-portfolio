/**
 * Counts what is in THIS repo (the public, de-branded copy) so the case study quotes numbers it can prove.
 *   node scripts/dev/public-metrics.mjs   ->  ../../src/data/pulse-metrics.json  (the portfolio reads it)
 * The Figma-side figures (pages, sets, variants, variables) come from the production extraction and cannot
 * be recounted here: the .fig and the extracted specs are not part of the public copy.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const repo = process.cwd();
const read = p => readFileSync(join(repo, p), 'utf8');
const walk = (d, test, out = []) => { for (const e of readdirSync(d)) { const p = join(d, e); if (['node_modules', 'dist', '.git'].includes(e)) continue; statSync(p).isDirectory() ? walk(p, test, out) : test(p) && out.push(p); } return out; };

const components = JSON.parse(read('ai/components.json'));
const intents = JSON.parse(read('ai/intents.json')).intents;
const byCategory = {};
for (const c of components.components) byCategory[c.category] = (byCategory[c.category] || 0) + 1;

const symbolDir = join(repo, 'src/symbols/generated');
const symbolSets = {};
for (const f of readdirSync(symbolDir)) {
  const t = readFileSync(join(symbolDir, f), 'utf8');
  const m = t.match(/export const keys = (\[[^\]]*\])/);
  if (m) symbolSets[f.replace('.ts', '')] = JSON.parse(m[1]).length;
}

const typography = read('src/theme/typography.ts');
const deviations = read('docs/figma-deviations.md').split('\n').filter(l => /^\|[^|]+\|/.test(l) && !/^\|\s*(Area|---)/.test(l)).length;

const out = {
  counted: new Date().toISOString().slice(0, 10),
  code: {
    components: components.count,
    categories: Object.keys(byCategory).length,
    byCategory,
    demos: walk(join(repo, 'src'), p => p.endsWith('.demo.tsx')).length,
    stories: walk(join(repo, 'src'), p => p.endsWith('.stories.tsx')).length,
    icons: [...read('src/icons/iconList.ts').matchAll(/\["\w+Icon"/g)].length,
    symbolSets,
    symbols: Object.values(symbolSets).reduce((a, b) => a + b, 0),
    fontWeightRoles: [...typography.matchAll(/^\s{2}(\w+):\s*fw\./gm)].length,
  },
  ai: {
    intents: intents.length,
    intentComponentsNamed: new Set(intents.flatMap(i => i.use)).size,
    registryProps: components.components.reduce((n, c) => n + Object.values(c.props).reduce((m, f) => m + f.length, 0), 0),
    deviationsLogged: deviations,
  },
  // From the production extraction (kept from the original metrics file). Not recountable from the public copy.
  figma: { componentPages: 82, componentSets: 235, variants: 5814, variables: 4074 },
};
const target = join(repo, '../../src/data/pulse-metrics.json');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, JSON.stringify(out, null, 2), 'utf8');
console.log(JSON.stringify(out, null, 2));
