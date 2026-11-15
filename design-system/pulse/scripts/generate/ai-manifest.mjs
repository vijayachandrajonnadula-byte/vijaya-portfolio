/**
 * Builds the AI-readable layer of the design system from the code and the Figma extraction.
 *   node scripts/generate/ai-manifest.mjs
 * Writes (all in /ai):
 *   components.json  every component: category, exports, import path, Figma page/sets, description, props, demo, story title
 *   figma-map.json   every Figma page and set -> the component that implements it (or "not built"), so a Figma frame's layer
 *                    names resolve to code
 *   INDEX.md         the same, as one scannable page
 * Reads ai/intents.json (hand-curated) and FAILS if it names a component that does not exist.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const repo = new URL('../..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const comps = join(repo, 'src/components');
const out = join(repo, 'ai');
mkdirSync(out, { recursive: true });
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/* ------------------------------------------------------------- scan components */
const items = [];
for (const category of readdirSync(comps).sort()) {
  const catDir = join(comps, category);
  if (category.startsWith('_') || !statSync(catDir).isDirectory()) continue;
  for (const name of readdirSync(catDir).sort()) {
    const dir = join(catDir, name);
    if (!statSync(dir).isDirectory()) continue;
    const files = readdirSync(dir).filter((f) => /\.tsx?$/.test(f) && !/\.(demo|stories)\.tsx?$/.test(f) && !f.endsWith('.generated.tsx') && !f.endsWith('.generated.ts'));
    const exportsV = new Set();
    const exportsT = new Set();
    const figmaStrings = new Set();
    const docs = {};
    const props = {};
    let header = '';
    for (const f of files) {
      const src = readFileSync(join(dir, f), 'utf8');
      if (!header) header = (src.match(/^(?:\/\/[^\n]*\n)+/) ?? [''])[0];
      for (const m of src.matchAll(/^export\s+(?:declare\s+)?(?:async\s+)?(?:function\*?|const|class)\s+([A-Za-z0-9_$]+)/gm)) exportsV.add(m[1]);
      for (const m of src.matchAll(/^export\s+(?:interface|type)\s+([A-Za-z0-9_$]+)/gm)) exportsT.add(m[1]);
      for (const m of src.matchAll(/^export\s+\{([^}]+)\}/gms)) for (const p of m[1].split(',')) { const n = p.trim().replace(/^type\s+/, '').split(/\s+as\s+/).pop(); if (n && /^[A-Z]/.test(n)) exportsV.add(n); }
      // first JSDoc before an exported function/const
      for (const m of src.matchAll(/\/\*\*((?:(?!\*\/)[\s\S])*?)\*\/\s*export\s+(?:function|const)\s+([A-Za-z0-9_$]+)/g)) docs[m[2]] ??= m[1].replace(/\s*\*\s?/g, ' ').replace(/\s+/g, ' ').trim();
      // Figma references in the file header and JSDoc
      for (const line of src.slice(0, 1200).split('\n').filter((l) => /^\s*(\/\/|\*|\/\*)/.test(l) && /Figma|set |sets |page /.test(l))) for (const m of line.matchAll(/"([^"]{2,70})"/g)) figmaStrings.add(m[1]);
      // props interfaces: fields with doc and default
      for (const m of src.matchAll(/export interface (\w+Props)(?:<[^>]*>)?(?:\s+extends[^{]+)?\s*\{([\s\S]*?)\n\}/g)) {
        const fields = [];
        let doc = '';
        for (const line of m[2].split('\n')) {
          const d = line.match(/^\s*\/\*\*\s*(.*?)\s*\*\/\s*$/);
          if (d) { doc = d[1]; continue; }
          const f = line.match(/^\s{2}([A-Za-z_]\w*)(\?)?:\s*(.+?);\s*$/);
          if (f) {
            const def = doc.match(/@default\s+(.+)$/);
            fields.push({ name: f[1], required: !f[2], type: f[3].replace(/\s+/g, ' ').slice(0, 140), ...(doc && { doc: doc.replace(/\s*@default.*$/, '').slice(0, 200) }), ...(def && { default: def[1] }) });
            doc = '';
          }
        }
        if (fields.length) props[m[1]] = fields.slice(0, 60);
      }
    }
    const main = [...exportsV].find((e) => norm(e) === norm(name)) ?? [...exportsV][0] ?? name;
    items.push({
      name,
      category,
      main,
      description: docs[main] || header.replace(/^\/\/\s?/gm, '').replace(/\s+/g, ' ').trim().slice(0, 240) || ` (Pulse design system, ). See its demo for every variant and state.`,
      exports: [...exportsV].sort(),
      types: [...exportsT].sort(),
      files: files.map((f) => `src/components/${category}/${name}/${f}`),
      importFrom: `src/components/${category}/${name}/${files.find((f) => f.replace(/\.tsx?$/, '') === name) ?? files[0]}`.replace(/\.tsx?$/, ''),
      barrel: "import { %s } from 'src/components'".replace('%s', main),
      figma: [...figmaStrings].slice(0, 12),
      props,
      demo: existsSync(join(dir, `${name}.demo.tsx`)) ? `src/components/${category}/${name}/${name}.demo.tsx` : null,
      story: `${category.replace(/-/g, ' ').replace(/^./, (m) => m.toUpperCase())}/${name}`,
    });
  }
}
const allExports = new Map();
for (const it of items) for (const e of it.exports) if (!allExports.has(e)) allExports.set(e, it.name);

/* ----- shared helpers that are public exports (src/components/_shared) */
for (const f of readdirSync(join(comps, '_shared'))) { if (!/\.tsx?$/.test(f)) continue; for (const m of readFileSync(join(comps, '_shared', f), 'utf8').matchAll(/^export\s+(?:async\s+)?(?:function|const)\s+([A-Z][A-Za-z0-9_]*)/gm)) if (!allExports.has(m[1])) allExports.set(m[1], '_shared'); }

/* --------------------------------------------------- templates, shell, icons */
const extra = [
  ['AppShell', 'templates', 'src/templates/AppShell.tsx', 'Full-viewport frame: LeftNav on the left, Header above the page content. Layout helper, not from Figma.'],
  ['ContextBarPanel', 'templates', 'src/templates/panels.tsx', 'Breadcrumb bar with optional status chips and actions. From the Pulse app, not Figma.'],
  ['ListHeaderPanel', 'templates', 'src/templates/panels.tsx', 'Page title + meta + tools + primary action, built on DataGridToolbar.'],
  ['TabStatusFilterPanel', 'templates', 'src/templates/panels.tsx', 'Tabs on the left, StatusFilterBar on the right, shared baseline.'],
  ['PageBodyContentPanel', 'templates', 'src/templates/panels.tsx', 'Page body on the surface canvas colour with 16px padding; owns the scroll region.'],
  ['FooterActionsPanel', 'templates', 'src/templates/panels.tsx', 'Bottom action bar with left and right groups.'],
  ['StepperHeaderPanel', 'templates', 'src/templates/panels.tsx', 'Centered Stepper header for wizards.'],
  ['FilterToolbarPanel', 'templates', 'src/templates/panels.tsx', 'Status filter + search + view toggle row.'],
  ['SearchToolbarPanel', 'templates', 'src/templates/panels.tsx', 'Split toolbar: toggle + search, optional collapsible left section.'],
];
for (const [n] of extra) allExports.set(n, 'templates');
for (const e of readFileSync(join(repo, 'src/icons/iconList.ts'), 'utf8').matchAll(/\["(\w+Icon)"/g)) allExports.set(e[1], 'icons');

/* ----------------------------------------------------------- validate intents */
const intents = JSON.parse(readFileSync(join(out, 'intents.json'), 'utf8'));
const missing = [];
for (const it of intents.intents) for (const u of it.use) if (!allExports.has(u)) missing.push(`${it.intent}: ${u}`);
if (missing.length) {
  console.error('ai/intents.json names components that do not exist:\n' + missing.join('\n'));
  process.exit(1);
}

/* --------------------------------------------------------- Figma page/set map */
const index = JSON.parse(readFileSync(join(repo, 'figma-tokens/pulse/components/index.json'), 'utf8'));
const byNorm = new Map();
for (const it of items) { byNorm.set(norm(it.name), it); for (const e of it.exports) byNorm.set(norm(e), it); }
const pageAlias = {
  'region card region': ['Region'], 'charts cards': ['Charts'], imagery: ['Equipment', 'Instrument', 'Subpart', 'ProcessLine'], arrows: ['Arrow'], shapes: ['Shape'],
  icons: ['Icons', 'FlagIcon'], 'data grid': ['DataGrid', 'StatusFilterBar', 'TaskSwitcher', 'TrendLine', 'VersionCard', 'Highlighter', 'TableCell', 'AdvancedGridDropdown'],
  'toggle button': ['ToggleButtonGroup'], textarea: ['TextField'], 'helper text': ['HelperText'], dropdownlist: ['Select', 'Autocomplete', 'InlineDropdown', 'SelectWithBorder'],
  textfield: ['TextField', 'PhoneNumber'], colorpicker: ['ColorPicker'], 'tally counter': ['TallyCounter'], textformat: ['TextFormat'], notifications: ['Notification'],
  'section new': ['Section'], 'selection card new': ['SelectionCard'], 'side panel new': ['SidePanel'], 'kpi card': ['KPICard'], 'rich text editor': ['RichTextEditor', 'FormulaEditor'],
  'canvas toolbar': ['CanvasToolbar'], 'document toolbar': ['DocumentToolbar'], 'comment suggestion ai': ['CommentSuggestionAI'], 'password strength': ['PasswordStrength'],
  'file uploader': ['FileUploader'], 'date picker': ['DatePicker', 'Calendar'], 'time picker': ['TimePicker'], 'date time picker': ['DateTimePicker'], 'electronic signature': ['ElectronicSignature'],
  'navigation bar': ['NavigationBar'], 'navigation rail': ['NavigationRail'], 'side nav': ['SideNav'], 'empty states': ['EmptyState'], 'workspace card': ['WorkspaceCard'],
  'form builder': ['FormBuilder'], workflow: ['Workflow'], draggablelistitem: ['DraggableListItem'], matrix: ['Matrix'], loader: ['Loader'], progressbar: ['ProgressBar'], 'code snippet': ['CodeSnippet'],
  'zoom select': ['ZoomSelect'], 'zoom control': ['ZoomControl'], 'transfer list': ['TransferList'], tree: ['TreeView'],
};
const foundation = new Set(['typography', 'grid spacing and radius', 'color', 'shadows', 'cover', 'font demo', 'matrix demo', 'keyboard focus state', 'for reference only', 'template components', 'general documentation guide']);
const pages = index.map((p) => {
  const key = norm(p.page).length ? p.page.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() : '';
  const names = pageAlias[key] ?? [];
  const hit = new Set(names.map((n) => byNorm.get(norm(n))?.name).filter(Boolean));
  const direct = byNorm.get(norm(p.page));
  if (direct) hit.add(direct.name);
  const status = foundation.has(key) ? 'foundation' : hit.size ? 'built' : 'not-built';
  return { figmaPage: p.page.trim(), status, components: [...hit], sets: p.sets.map((s) => { const exact = byNorm.get(norm(s.name.replace(/^[.\s]*(building ?blocks?|buildingblock)\s*\/\s*/i, '').replace(/^\.?\s*(atom|building ?blocks?)\s*/i, '')))?.main ?? byNorm.get(norm(s.name))?.main ?? null; return { set: s.name.trim(), variants: s.variants, properties: s.props, component: exact, implementedBy: exact ? [exact] : [...hit] }; }) };
});
const unmatched = pages.filter((p) => p.status === 'not-built').map((p) => p.figmaPage);

/* ---------------------------------------------------------------- write files */
const generatedAt = new Date().toISOString().slice(0, 10);
writeFileSync(join(out, 'components.json'), JSON.stringify({ generated: generatedAt, note: 'GENERATED by scripts/generate/ai-manifest.mjs. Do not edit.', count: items.length, components: items, templates: extra.map(([name, , file, description]) => ({ name, file, description })) }, null, 1));
writeFileSync(join(out, 'figma-map.json'), JSON.stringify({ generated: generatedAt, note: 'GENERATED. Figma page / component-set names -> code. Use the Figma layer name of an instance (it equals the set name) to find the component.', pages }, null, 1));

const md = [];
md.push('# Design-system index (generated)\n');
md.push('> GENERATED by `npm run ai:build`. Do not edit. Read `CLAUDE.md` first, then `ai/intents.json` to choose components.\n');
md.push(`${items.length} component folders · ${allExports.size} exported names · ${pages.length} Figma pages (${pages.filter((p) => p.status === 'built').length} built, ${pages.filter((p) => p.status === 'foundation').length} foundations, ${pages.filter((p) => p.status === 'not-built').length} not built)\n`);
md.push('## Components by category\n');
for (const cat of [...new Set(items.map((i) => i.category))]) {
  md.push(`### ${cat}\n`);
  md.push('| Component | Exports | Figma | What it is |\n|---|---|---|---|');
  for (const it of items.filter((i) => i.category === cat)) md.push(`| \`${it.name}\` | ${it.exports.slice(0, 6).map((e) => `\`${e}\``).join(' ')}${it.exports.length > 6 ? ' …' : ''} | ${it.figma.slice(0, 3).join(', ') || ''} | ${it.description.replace(/\|/g, '/').slice(0, 150)} |`);
  md.push('');
}
md.push('## Templates (src/templates, not from Figma)\n');
for (const [name, , file, description] of extra) md.push(`- \`${name}\` (${file}): ${description}`);
md.push('\n## Figma page → code\n');
md.push('| Figma page | Status | Component(s) | Sets |\n|---|---|---|---|');
for (const p of pages) md.push(`| ${p.figmaPage} | ${p.status} | ${p.components.map((c) => `\`${c}\``).join(' ')} | ${p.sets.length} |`);
if (unmatched.length) md.push(`\nNot built: ${unmatched.join(', ')}`);
writeFileSync(join(out, 'INDEX.md'), md.join('\n') + '\n');
console.log(`components: ${items.length}, figma pages: ${pages.length} (built ${pages.filter((p) => p.status === 'built').length}), not matched: ${unmatched.join(' | ') || 'none'}`);
