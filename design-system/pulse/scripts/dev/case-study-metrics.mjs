/**
 * Counts the facts quoted in the portfolio case study, from the repo itself, so the numbers cannot be wrong.
 *   node scripts/dev/case-study-metrics.mjs   ->  portfolio-case-study/data/metrics.json
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const repo = new URL('../..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const read = (p) => readFileSync(join(repo, p), 'utf8');
const walk = (d, test, out = []) => { for (const e of readdirSync(d)) { const p = join(d, e); if (e === 'node_modules' || e === 'dist' || e === 'storybook-static' || e.startsWith('.git')) continue; statSync(p).isDirectory() ? walk(p, test, out) : test(p) && out.push(p); } return out; };

const index = JSON.parse(read('figma-tokens/pulse/components/index.json'));
const sets = index.flatMap((p) => p.sets);
const variants = sets.reduce((n, s) => n + s.variants, 0);
const components = JSON.parse(read('ai/components.json'));
const figmaMap = JSON.parse(read('ai/figma-map.json'));
const intents = JSON.parse(read('ai/intents.json')).intents;
const vars = JSON.parse(read('figma-tokens/pulse/variables.json')).collections.reduce((n, c) => n + c.variables.length, 0);
const symbols = { Equipment: 104, Instrument: 38, Subpart: 35, ProcessLine: 10, Arrow: 192, Shape: 56, FlagIcon: 271 };
const iconCount = [...read('src/icons/iconList.ts').matchAll(/\["\w+Icon"/g)].length;
const demos = walk(join(repo, 'src'), (p) => p.endsWith('.demo.tsx')).length;
const stories = walk(join(repo, 'src'), (p) => p.endsWith('.stories.tsx')).length;
const typography = read('src/theme/typography.ts');
const roles = [...typography.matchAll(/^\s{2}(\w+):\s*fw\./gm)].length;
const deviations = read('docs/figma-deviations.md').split('\n').filter((l) => /^\|[^|]+\|/.test(l) && !/^\|\s*(Area|---)/.test(l)).length;
const pageDirs = readdirSync(join(repo, 'src/pages')).filter((d) => statSync(join(repo, 'src/pages', d)).isDirectory());
const metrics = {
  generated: new Date().toISOString().slice(0, 10),
  figma: {
    componentPages: index.length,
    componentSets: sets.length,
    variants,
    variables: vars,
    pagesBuilt: figmaMap.pages.filter((p) => p.status === 'built').length,
    pagesFoundation: figmaMap.pages.filter((p) => p.status === 'foundation').length,
    setsResolvedToCode: figmaMap.pages.flatMap((p) => p.sets).filter((s) => s.implementedBy.length).length,
  },
  code: {
    componentFolders: components.count,
    categories: [...new Set(components.components.map((c) => c.category))].length,
    galleryDemos: demos,
    stories,
    pages: pageDirs.length,
    icons: iconCount,
    symbols: Object.values(symbols).reduce((a, b) => a + b, 0),
    symbolSets: symbols,
  },
  ai: {
    intents: intents.length,
    intentComponentsNamed: new Set(intents.flatMap((i) => i.use)).size,
    registryProps: components.components.reduce((n, c) => n + Object.values(c.props).reduce((m, f) => m + f.length, 0), 0),
    fontWeightRoles: roles,
    deviationsLogged: deviations,
  },
};
mkdirSync(join(repo, 'portfolio-case-study/data'), { recursive: true });
writeFileSync(join(repo, 'portfolio-case-study/data/metrics.json'), JSON.stringify(metrics, null, 2));
console.log(JSON.stringify(metrics, null, 2));
