/**
 * Prints readable specs from figma-tokens/pulse/components/*.json (made by pulse-extract.mjs).
 *
 *   node scripts/figma/pulse-spec.mjs list                         all pages
 *   node scripts/figma/pulse-spec.mjs <page> props                 component sets and their variant properties
 *   node scripts/figma/pulse-spec.mjs <page> <set> tree "K=V,K=V"   outline of the first variant matching the filter
 *   node scripts/figma/pulse-spec.mjs <page> <set> diff <Prop> "K=V"  how each value of <Prop> differs from the first, others fixed by filter
 *   node scripts/figma/pulse-spec.mjs <page> notes                 text written on the Figma page (usage notes)
 * <page> and <set> are case-insensitive substrings.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '../../figma-tokens/pulse/components');
const index = JSON.parse(readFileSync(join(dir, 'index.json'), 'utf8'));
const [a, b, c, d, e] = process.argv.slice(2);

if (a === 'list' || !a) {
  for (const p of index) console.log(`${p.file.padEnd(34)} ${p.page.padEnd(28)} sets=${p.sets.length} loose=${p.loose} ${p.kb}KB`);
  process.exit(0);
}
const entry = index.find((p) => p.file === `${a}.json`) ?? index.find((p) => p.page.toLowerCase().includes(a.toLowerCase()));
if (!entry) throw new Error(`No page matching "${a}"`);
const spec = JSON.parse(readFileSync(join(dir, entry.file), 'utf8'));

const parseFilter = (s) => Object.fromEntries((s ?? '').split(',').map((x) => x.trim()).filter(Boolean).map((x) => x.split('=').map((y) => y.trim())));
const matches = (v, f) => Object.entries(f).every(([k, val]) => v.props[k] === val);
const pickSet = (name) => [...spec.sets, ...spec.loose.map((l) => ({ name: l.name, props: {}, variants: [{ props: {}, tree: l.tree }] }))].find((s) => s.name.toLowerCase().includes((name ?? '').toLowerCase()));

const fmtPaint = (arr) => arr.map((p) => (p.var ? `${p.css}[${p.var}]` : p.css)).join(' + ');
function line(n) {
  const bits = [];
  if (n.w != null) bits.push(`${n.w}x${n.h}`);
  if (n.hidden) bits.push('HIDDEN');
  if (n.lay) bits.push(`${n.lay.m} gap${n.lay.gap} pad[${n.lay.pad.join(',')}] ${n.lay.main ?? ''}/${n.lay.cross ?? ''}${n.lay.mainSize ? ` ${n.lay.mainSize}` : ''}${n.lay.crossSize ? `/${n.lay.crossSize}` : ''}${n.lay.wrap ? ' wrap' : ''}`);
  if (n.grow) bits.push('grow');
  if (n.self) bits.push(`self:${n.self}`);
  if (n.abs) bits.push(`abs(${n.abs.x},${n.abs.y})`);
  if (n.r != null) bits.push(`r=${Array.isArray(n.r) ? n.r.join('/') : n.r}`);
  if (n.fill) bits.push(`fill ${fmtPaint(n.fill)}`);
  if (n.str) bits.push(`stroke ${fmtPaint(n.str)} ${Array.isArray(n.sw) ? n.sw.join('/') : n.sw}${n.sa ? ' ' + n.sa : ''}${n.dash ? ' dashed' : ''}`);
  if (n.fx) bits.push(`fx ${n.fx.map((f) => (f.k === 'drop' || f.k === 'inner' ? `${f.k}(${f.x},${f.y},${f.blur},${f.spread},${f.c})` : `${f.k}(${f.blur})`)).join(' ')}`);
  if (n.op != null) bits.push(`op=${n.op}`);
  if (n.text != null) bits.push(`"${n.text.slice(0, 40)}" ${n.tx.font ?? ''} ${n.tx.style ?? ''} ${n.tx.size}/${n.tx.lh ?? ''}${n.tx.ls ? ' ls' + n.tx.ls : ''}${n.tx.case ? ' ' + n.tx.case : ''}${n.tx.deco ? ' ' + n.tx.deco : ''}${n.tx.align ? ' ' + n.tx.align : ''}`);
  if (n.inst) bits.push(`<${n.inst.set ? n.inst.set + ' / ' : ''}${n.inst.name}> ${n.inst.w}x${n.inst.h}${n.texts ? ' texts=' + JSON.stringify(n.texts) : ''}${n.ovrFill ? ' ovrFill=' + n.ovrFill.join(',') : ''}`);
  if (n.vec) bits.push('vector');
  return `${n.n} [${n.t}] ${bits.join(' | ')}`;
}
function print(n, depth = 0, lines = []) {
  lines.push('  '.repeat(depth) + line(n));
  for (const k of n.kids ?? []) print(k, depth + 1, lines);
  return lines;
}
function flat(n, path = '', out = new Map()) {
  const p = `${path}/${n.n}`;
  let key = p;
  let i = 2;
  while (out.has(key)) key = `${p}#${i++}`;
  out.set(key, line(n).replace(/^.*? \[[A-Z_]+\] /, ''));
  for (const k of n.kids ?? []) flat(k, key, out);
  return out;
}

if (b === 'props') {
  for (const s of spec.sets) console.log(`${s.name}  (${s.variants.length} variants, ${s.size.w}x${s.size.h})\n  ${Object.entries(s.props).map(([k, v]) => `${k}: ${v.join(' | ')}`).join('\n  ')}`);
  for (const l of spec.loose) console.log(`(component) ${l.name}`);
} else if (b === 'notes') {
  console.log(spec.notes.join('\n'));
} else {
  const set = pickSet(b);
  if (!set) throw new Error(`No set matching "${b}" on ${spec.page}. Sets: ${spec.sets.map((s) => s.name).join(', ')}`);
  if (c === 'tree') {
    const f = parseFilter(d);
    const v = set.variants.find((x) => matches(x, f));
    if (!v) throw new Error(`No variant matching ${JSON.stringify(f)}`);
    console.log(`# ${spec.page} / ${set.name} / ${JSON.stringify(v.props)}`);
    console.log(print(v.tree).join('\n'));
  } else if (c === 'diff') {
    const f = parseFilter(e);
    const pool = set.variants.filter((x) => matches(x, f));
    const values = [...new Set(pool.map((x) => x.props[d]))];
    const base = pool.find((x) => x.props[d] === values[0]);
    const baseFlat = flat(base.tree);
    console.log(`# ${spec.page} / ${set.name}  fixed ${JSON.stringify(f)}  varying ${d}: ${values.join(' | ')}\n## baseline ${d}=${values[0]}\n${print(base.tree).join('\n')}`);
    for (const val of values.slice(1)) {
      const v = pool.find((x) => x.props[d] === val);
      const vf = flat(v.tree);
      console.log(`\n## ${d}=${val}  (differences from baseline)`);
      let any = false;
      for (const [k, s] of vf) if (baseFlat.get(k) !== s) { console.log(`  ${k}\n     now:  ${s}\n     was:  ${baseFlat.get(k) ?? '(absent)'}`); any = true; }
      for (const k of baseFlat.keys()) if (!vf.has(k)) { console.log(`  ${k}  REMOVED`); any = true; }
      if (!any) console.log('  (identical)');
    }
  } else throw new Error('Use: props | notes | <set> tree "K=V" | <set> diff <Prop> "K=V"');
}
