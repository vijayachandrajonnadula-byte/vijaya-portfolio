/**
 * Extracts every component set / component of the pulse-2.0 .fig export into compact JSON specs.
 * Usage: node --max-old-space-size=8192 scripts/figma/pulse-extract.mjs ["pulse 2.0.fig"]
 * Output: figma-tokens/pulse/components/<page-slug>.json  (+ index.json, foundations.json)
 *
 * A spec is { page, sets: [{ name, id, props: {Prop:[values]}, variants: [{ props, tree }] }], loose: [...], notes: [...] }.
 * `tree` nodes: n name, t type, w/h size, lay (auto-layout), r radius, fill/str (CSS paints, `var` = bound variable),
 * fx effects, tx text style, inst = master component name, kids.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gid, loadFig } from './fig-load.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const figPath = resolve(process.argv[2] ?? join(here, '../../pulse 2.0.fig'));
const out = join(here, '../../figma-tokens/pulse/components');
mkdirSync(out, { recursive: true });

const { nodes, byId, children, pages } = await loadFig(figPath);

/* ------------------------------------------------------------ small helpers */
const r2 = (x) => (typeof x === 'number' ? Math.round(x * 100) / 100 : x);
const h2 = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
const hex = (c, op = 1) => {
  const a = (c.a ?? 1) * op;
  return `#${h2(c.r)}${h2(c.g)}${h2(c.b)}${a < 0.995 ? h2(a) : ''}`;
};
const varName = (alias) => {
  const g = alias?.value?.alias?.guid;
  if (!g) return undefined;
  const v = byId.get(gid(g));
  return v?.name;
};
function paint(p, node) {
  if (p.visible === false) return null;
  const op = p.opacity ?? 1;
  const v = p.colorVar ? varName(p.colorVar) : undefined;
  if (p.type === 'SOLID') return { css: hex(p.color, op), ...(v && { var: v }), ...(p.blendMode && p.blendMode !== 'NORMAL' && { blend: p.blendMode }) };
  if (p.type?.startsWith('GRADIENT')) {
    const t = p.transform ?? { m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0 };
    const det = t.m00 * t.m11 - t.m01 * t.m10 || 1;
    // Same convention as Figma's REST gradientHandlePositions (normalised, not scaled by node size).
    const dx = t.m11 / det;
    const dy = -t.m10 / det;
    const deg = Math.round(((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360);
    const stops = (p.stops ?? []).map((s) => `${hex(s.color, op)} ${Math.round(s.position * 100)}%`).join(', ');
    const kind = p.type === 'GRADIENT_LINEAR' ? `linear-gradient(${deg}deg, ${stops})` : `${p.type.toLowerCase()}(${stops})`;
    return { css: kind };
  }
  if (p.type === 'IMAGE') return { css: 'image', image: true };
  return { css: p.type };
}
const paints = (arr, node) => (arr ?? []).map((p) => paint(p, node)).filter(Boolean);
const lh = (l) => (l ? (l.units === 'PERCENT' ? `${r2(l.value)}%` : l.units === 'RAW' ? r2(l.value) : `${r2(l.value)}px`) : undefined);

function masterOf(n) {
  const id = gid(n.symbolData?.symbolID);
  const m = id ? byId.get(id) : null;
  if (!m) return null;
  const parent = byId.get(gid(m.parentIndex?.guid));
  return { name: m.name, set: parent?.isStateGroup || parent?.type === 'FRAME' ? parent.name : undefined, w: r2(m.size?.x), h: r2(m.size?.y) };
}

function summarize(n, depth = 0) {
  const o = { n: n.name, t: n.type };
  if (n.visible === false) o.hidden = 1;
  if (n.size) {
    o.w = r2(n.size.x);
    o.h = r2(n.size.y);
  }
  if (n.opacity != null && n.opacity !== 1) o.op = r2(n.opacity);
  if (n.stackMode && n.stackMode !== 'NONE') {
    o.lay = {
      m: n.stackMode === 'HORIZONTAL' ? 'row' : 'col',
      gap: n.stackSpacing ?? 0,
      pad: [n.stackVerticalPadding ?? 0, n.stackPaddingRight ?? 0, n.stackPaddingBottom ?? n.stackVerticalPadding ?? 0, n.stackHorizontalPadding ?? 0],
      main: n.stackPrimaryAlignItems,
      cross: n.stackCounterAlignItems,
      ...(n.stackWrap && { wrap: 1 }),
      ...(n.stackPrimarySizing && { mainSize: n.stackPrimarySizing }),
      ...(n.stackCounterSizing && { crossSize: n.stackCounterSizing }),
    };
  }
  if (n.stackChildPrimaryGrow) o.grow = n.stackChildPrimaryGrow;
  if (n.stackChildAlignSelf && n.stackChildAlignSelf !== 'AUTO') o.self = n.stackChildAlignSelf;
  if (n.stackPositioning === 'ABSOLUTE') o.abs = { x: r2(n.transform?.m02), y: r2(n.transform?.m12) };
  if (n.rectangleCornerRadiiIndependent) {
    const rr = [n.rectangleTopLeftCornerRadius, n.rectangleTopRightCornerRadius, n.rectangleBottomRightCornerRadius, n.rectangleBottomLeftCornerRadius].map((x) => x ?? 0);
    o.r = rr.every((x) => x === rr[0]) ? rr[0] : rr;
  } else if (n.cornerRadius) o.r = n.cornerRadius;
  const fills = paints(n.fillPaints, n);
  if (fills.length) o.fill = fills;
  const strokes = paints(n.strokePaints, n);
  if (strokes.length) {
    o.str = strokes;
    o.sw = n.borderStrokeWeightsIndependent ? [n.borderTopWeight, n.borderRightWeight, n.borderBottomWeight, n.borderLeftWeight] : n.strokeWeight;
    o.sa = n.strokeAlign;
    if (n.dashPattern?.length) o.dash = n.dashPattern;
  }
  const fx = (n.effects ?? [])
    .filter((e) => e.visible !== false)
    .map((e) => (e.type?.includes('SHADOW') ? { k: e.type === 'INNER_SHADOW' ? 'inner' : 'drop', x: r2(e.offset?.x), y: r2(e.offset?.y), blur: r2(e.radius), spread: r2(e.spread ?? 0), c: hex(e.color) } : { k: e.type, blur: r2(e.radius) }));
  if (fx.length) o.fx = fx;
  if (n.clipsContent || n.frameMaskDisabled === false) o.clip = 1;
  if (n.type === 'TEXT') {
    o.text = n.textData?.characters;
    o.tx = {
      font: n.fontName?.family,
      style: n.fontName?.style,
      size: r2(n.fontSize),
      lh: lh(n.lineHeight),
      ls: n.letterSpacing && n.letterSpacing.value ? `${r2(n.letterSpacing.value)}${n.letterSpacing.units === 'PERCENT' ? '%' : 'px'}` : undefined,
      case: n.textCase && n.textCase !== 'ORIGINAL' ? n.textCase : undefined,
      deco: n.textDecoration && n.textDecoration !== 'NONE' ? n.textDecoration : undefined,
      align: n.textAlignHorizontal && n.textAlignHorizontal !== 'LEFT' ? n.textAlignHorizontal : undefined,
      trunc: n.textTruncation && n.textTruncation !== 'DISABLED' ? n.textTruncation : undefined,
    };
    for (const k of Object.keys(o.tx)) if (o.tx[k] === undefined) delete o.tx[k];
    if (n.fontVariations?.length) o.tx.var = 1;
  }
  if (n.type === 'INSTANCE') {
    const m = masterOf(n);
    if (m) o.inst = m;
    const texts = (n.symbolData?.symbolOverrides ?? []).filter((x) => x.textData?.characters).map((x) => x.textData.characters);
    if (texts.length) o.texts = texts;
    const ovr = (n.symbolData?.symbolOverrides ?? []).filter((x) => x.fillPaints?.length).map((x) => paints(x.fillPaints, n)[0]?.css).filter(Boolean);
    if (ovr.length) o.ovrFill = ovr;
  }
  if (['VECTOR', 'BOOLEAN_OPERATION', 'LINE', 'ELLIPSE', 'REGULAR_POLYGON', 'STAR'].includes(n.type)) o.vec = 1;
  if (depth < 8 && n.type !== 'INSTANCE') {
    const kids = children.get(gid(n.guid));
    if (kids?.length) o.kids = kids.map((k) => summarize(k, depth + 1));
  }
  return o;
}

/* ------------------------------------------------------------ variant props */
const parseName = (name) => Object.fromEntries(name.split(',').map((s) => s.trim()).filter((s) => s.includes('=')).map((s) => { const i = s.indexOf('='); return [s.slice(0, i).trim(), s.slice(i + 1).trim()]; }));

const slug = (s) => s.replace(/[↪✅⭐]|â†ª|âœ…/g, '').replace(/\(.*?\)/g, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ------------------------------------------------------------------ pages */
const index = [];
for (const page of pages) {
  const pid = gid(page.guid);
  if (!/↪|â†ª|Template|Reference|Keyboard|Matrix|Font Demo/.test(page.name) && !/^COVER$/.test(page.name)) continue;
  const sets = [];
  const loose = [];
  const notes = [];
  const walk = (n, inSet) => {
    if (n.isStateGroup || (n.type === 'FRAME' && n.stateGroupPropertyValueOrders)) {
      const vs = (children.get(gid(n.guid)) ?? []).filter((c) => c.type === 'SYMBOL');
      const props = {};
      for (const v of vs) for (const [k, val] of Object.entries(parseName(v.name))) (props[k] ??= new Set()).add(val);
      for (const o of n.stateGroupPropertyValueOrders ?? []) if (o.property && o.values?.length) props[o.property] = o.values;
      sets.push({
        name: n.name,
        id: gid(n.guid),
        size: { w: r2(n.size?.x), h: r2(n.size?.y) },
        props: Object.fromEntries(Object.entries(props).map(([k, v]) => [k, [...v]])),
        variants: vs.map((v) => ({ id: gid(v.guid), props: parseName(v.name), tree: summarize(v) })),
      });
      return;
    }
    if (n.type === 'SYMBOL' && !inSet) {
      loose.push({ name: n.name, id: gid(n.guid), tree: summarize(n) });
      return;
    }
    if (n.type === 'TEXT' && n.textData?.characters && notes.length < 120) notes.push(n.textData.characters.trim());
    for (const c of children.get(gid(n.guid)) ?? []) walk(c, false);
  };
  for (const c of children.get(pid) ?? []) walk(c, false);
  const name = page.name.replace(/[↪✅⭐]|â†ª|âœ…/g, '').trim();
  const file = `${slug(name) || pid.replace(':', '-')}.json`;
  const spec = { page: name, pageId: pid, sets, loose, notes: [...new Set(notes)].filter((t) => t.length > 2) };
  writeFileSync(join(out, file), JSON.stringify(spec));
  const bytes = JSON.stringify(spec).length;
  index.push({ page: name, pageId: pid, file, sets: sets.map((s) => ({ name: s.name, variants: s.variants.length, props: Object.keys(s.props) })), loose: loose.length, kb: Math.round(bytes / 1024) });
  console.log(name.padEnd(30), 'sets', String(sets.length).padStart(3), 'variants', String(sets.reduce((a, s) => a + s.variants.length, 0)).padStart(5), 'loose', String(loose.length).padStart(3), `${Math.round(bytes / 1024)} KB`);
}
writeFileSync(join(out, 'index.json'), JSON.stringify(index, null, 1));
