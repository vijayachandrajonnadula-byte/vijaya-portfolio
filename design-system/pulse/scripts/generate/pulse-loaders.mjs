/**
 * Generates the Pulse illustration loaders from the Figma "Loader" page.
 *   node --max-old-space-size=8192 scripts/generate/pulse-loaders.mjs
 * Writes src/components/data-display/Loader/loaders.generated.ts
 *
 * Every component-set variant on that page is ONE animation frame. The frame order and timing come from the
 * Figma prototype (AFTER_TIMEOUT -> SWAP_STATE chain: hold = transitionTimeout, tween = transitionDuration).
 * Each frame is converted to SVG markup by a small Figma-node renderer (vector geometry blobs, solid / gradient
 * fills, masks, frame clipping, drop shadows / layer blur, nested instances expanded from their master with the
 * instance's derived overrides).
 */
import { writeFileSync } from 'node:fs';
import { loadFig, gid } from '../figma/fig-load.mjs';

const { msg, children, pages, byId } = await loadFig('pulse 2.0.fig');
const page = pages.find((p) => p.name.trim().endsWith('Loader'));

// ---------- path decoding (commandsBlob) ----------
const r2 = (v) => +v.toFixed(2);
function decode(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let o = 0;
  let d = '';
  const f = () => {
    const v = dv.getFloat32(o, true);
    o += 4;
    return r2(v);
  };
  while (o < bytes.length) {
    const c = bytes[o++];
    if (c === 0) d += 'Z';
    else if (c === 1) d += `M${f()} ${f()}`;
    else if (c === 2) d += `L${f()} ${f()}`;
    else if (c === 3) d += `Q${f()} ${f()} ${f()} ${f()}`;
    else if (c === 4) d += `C${f()} ${f()} ${f()} ${f()} ${f()} ${f()}`;
    else break;
  }
  return d;
}
const pathOf = (g) => {
  const bytes = msg.blobs[g.commandsBlob]?.bytes;
  return bytes ? decode(bytes) : '';
};

// ---------- misc helpers ----------
let uid = 0;
const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const matrix = (t) => (t ? `matrix(${[t.m00, t.m10, t.m01, t.m11, t.m02, t.m12].map((v) => +v.toFixed(5)).join(' ')})` : '');
const isIdentity = (t) => !t || (t.m00 === 1 && t.m11 === 1 && !t.m01 && !t.m10 && !t.m02 && !t.m12);
const num = (v) => +(+v).toFixed(3);
const warn = new Set();

function invert(t) {
  const det = t.m00 * t.m11 - t.m01 * t.m10;
  const a = t.m11 / det, b = -t.m10 / det, c = -t.m01 / det, d = t.m00 / det;
  return { m00: a, m10: b, m01: c, m11: d, m02: -(a * t.m02 + c * t.m12), m12: -(b * t.m02 + d * t.m12) };
}
const mul = (p, q) => ({
  m00: p.m00 * q.m00 + p.m01 * q.m10, m01: p.m00 * q.m01 + p.m01 * q.m11, m02: p.m00 * q.m02 + p.m01 * q.m12 + p.m02,
  m10: p.m10 * q.m00 + p.m11 * q.m10, m11: p.m10 * q.m01 + p.m11 * q.m11, m12: p.m10 * q.m02 + p.m11 * q.m12 + p.m12,
});

// returns { attr, defs } for a paint
function paintAttr(p, size, kind /* fill | stroke */) {
  if (!p || p.visible === false) return null;
  const op = p.opacity ?? 1;
  if (p.type === 'SOLID') return { attr: `${kind}="${hex(p.color)}"${op < 1 ? ` ${kind}-opacity="${num(op)}"` : ''}`, defs: '' };
  if (p.type === 'GRADIENT_LINEAR' || p.type === 'GRADIENT_RADIAL' || p.type === 'GRADIENT_ANGULAR' || p.type === 'GRADIENT_DIAMOND') {
    const id = `g${++uid}`;
    const stops = (p.stops ?? [])
      .map((s) => `<stop offset="${num(s.position)}" stop-color="${hex(s.color)}"${s.color.a < 1 ? ` stop-opacity="${num(s.color.a)}"` : ''}/>`)
      .join('');
    const inv = invert(p.transform ?? { m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0 });
    const toUser = mul({ m00: size.x, m01: 0, m02: 0, m10: 0, m11: size.y, m12: 0 }, inv);
    const gt = `gradientTransform="${matrix(toUser)}"`;
    const def =
      p.type === 'GRADIENT_LINEAR'
        ? `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0.5" x2="1" y2="0.5" ${gt}>${stops}</linearGradient>`
        : `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="0.5" cy="0.5" r="0.5" ${gt}>${stops}</radialGradient>`;
    if (p.type !== 'GRADIENT_LINEAR' && p.type !== 'GRADIENT_RADIAL') warn.add(`paint ${p.type} approximated as radial`);
    return { attr: `${kind}="url(#${id})"${op < 1 ? ` ${kind}-opacity="${num(op)}"` : ''}`, defs: def };
  }
  warn.add(`paint ${p.type}`);
  return null;
}

// ---------- override handling for instances ----------
const key = (guids) => guids.map(gid).join('/');
function buildOverrides(inst, outer) {
  // outer: parent overrides map (path-from-outer-instance -> props); we merge instance-local ones keyed relative to this instance
  const m = new Map();
  for (const o of inst.symbolData?.symbolOverrides ?? []) m.set(key(o.guidPath.guids), { ...(m.get(key(o.guidPath.guids)) ?? {}), ...o });
  for (const o of inst.derivedSymbolData ?? []) {
    const k = key(o.guidPath.guids);
    m.set(k, { ...(m.get(k) ?? {}), ...o });
  }
  return m;
}
const lastKey = (m) => {
  const out = new Map();
  for (const [k, v] of m) out.set(k.split('/').pop(), { ...(out.get(k.split('/').pop()) ?? {}), ...v });
  return out;
};

// ---------- renderer ----------
// ctx: { ovr: Map(path->props), ovrLast: Map(lastGuid->props), prefix: string[] (guid ids of enclosing instance chain) }
function effective(n, ctx) {
  const id = gid(n.guid);
  const full = ctx.prefix.length ? [...ctx.prefix, id].join('/') : id;
  const o = { ...(ctx.ovrLast?.get(id) ?? {}), ...(ctx.ovr?.get(full) ?? {}) };
  // fillGeometry / size / transform from derived data apply to nodes inside an instance; paints from symbolOverrides.
  return { ...n, ...Object.fromEntries(Object.entries(o).filter(([k]) => k !== 'guidPath')) };
}

function geomMarkup(n, size, defsOut) {
  let out = '';
  const fills = (n.fillPaints ?? []).filter((p) => p.visible !== false);
  const strokes = (n.strokePaints ?? []).filter((p) => p.visible !== false);
  const hasFG = (n.fillGeometry ?? []).length > 0;
  if (fills.length) {
    for (const p of fills) {
      const pa = paintAttr(p, size, 'fill');
      if (!pa) continue;
      if (pa.defs) defsOut.push(pa.defs);
      if (hasFG) {
        for (const g of n.fillGeometry) {
          const d = pathOf(g);
          if (d) out += `<path d="${d}" ${pa.attr}${g.windingRule === 'ODD' ? ' fill-rule="evenodd"' : ''}/>`;
        }
      } else if (n.type === 'ELLIPSE') {
        out += `<ellipse cx="${num(size.x / 2)}" cy="${num(size.y / 2)}" rx="${num(size.x / 2)}" ry="${num(size.y / 2)}" ${pa.attr}/>`;
      } else if (n.type === 'ROUNDED_RECTANGLE' || n.type === 'RECTANGLE' || n.type === 'FRAME' || n.type === 'SYMBOL') {
        const rad = n.cornerRadius ?? 0;
        out += `<rect width="${num(size.x)}" height="${num(size.y)}"${rad ? ` rx="${num(rad)}"` : ''} ${pa.attr}/>`;
      }
    }
  }
  if (strokes.length && (n.strokeGeometry ?? []).length) {
    for (const p of strokes) {
      const pa = paintAttr(p, size, 'fill');
      if (!pa) continue;
      if (pa.defs) defsOut.push(pa.defs);
      for (const g of n.strokeGeometry) {
        const d = pathOf(g);
        if (d) out += `<path d="${d}" ${pa.attr}${g.windingRule === 'ODD' ? ' fill-rule="evenodd"' : ''}/>`;
      }
    }
  } else if (strokes.length && !hasFG) {
    warn.add(`stroke without strokeGeometry on ${n.name}`);
  }
  return out;
}

function effectsAttr(n, defsOut, gooey) {
  const fx = (n.effects ?? []).filter((e) => e.visible !== false);
  if (!fx.length) return '';
  const id = `f${++uid}`;
  let prims = '';
  let last = 'SourceGraphic';
  for (const e of fx) {
    if (e.type === 'DROP_SHADOW') {
      const c = e.color ?? { r: 0, g: 0, b: 0, a: 0.25 };
      prims += `<feDropShadow dx="${num(e.offset?.x ?? 0)}" dy="${num(e.offset?.y ?? 0)}" stdDeviation="${num((e.radius ?? 0) / 2)}" flood-color="${hex(c)}" flood-opacity="${num(c.a)}"/>`;
    } else if (e.type === 'FOREGROUND_BLUR') {
      prims += `<feGaussianBlur in="${last}" stdDeviation="${num((e.radius ?? 0) / 2)}"/>`;
      if (gooey) prims += `<feComponentTransfer><feFuncA type="linear" slope="100" intercept="${num(-100 * gooey.t)}"/></feComponentTransfer>`;
    } else warn.add(`effect ${e.type}`);
  }
  if (!prims) return '';
  defsOut.push(`<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">${prims}</filter>`);
  return ` filter="url(#${id})"`;
}

function renderChildren(parent, ctx, defsOut, kids) {
  let out = '';
  let maskedOpen = 0;
  const dodge = kids.find((k) => k.fillPaints?.[0]?.blendMode === 'COLOR_DODGE');
  if (dodge) ctx = { ...ctx, gooey: { t: dodge.fillPaints[0].color.r } };
  for (const raw of kids) {
    const n = effective(raw, ctx);
    if (n.visible === false) continue;
    if (dodge && ['COLOR_DODGE', 'COLOR_BURN'].includes(n.fillPaints?.[0]?.blendMode)) continue;
    if (n.mask) {
      // Mask node: clip following siblings by its geometry (alpha mask approximated as clip).
      const id = `m${++uid}`;
      const d = (n.fillGeometry ?? []).map(pathOf).join('');
      if (d) defsOut.push(`<clipPath id="${id}"><path d="${d}"${isIdentity(n.transform) ? '' : ` transform="${matrix(n.transform)}"`}/></clipPath>`);
      out += `<g clip-path="url(#${id})">`;
      maskedOpen++;
      continue;
    }
    out += renderNode(raw, ctx, defsOut);
  }
  return out + '</g>'.repeat(maskedOpen);
}

function renderNode(raw, ctx, defsOut) {
  const n = effective(raw, ctx);
  if (n.visible === false) return '';
  const size = n.size ?? { x: 0, y: 0 };
  const attrs = [];
  if (!isIdentity(n.transform)) attrs.push(`transform="${matrix(n.transform)}"`);
  if ((n.opacity ?? 1) < 1) attrs.push(`opacity="${num(n.opacity)}"`);
  let inner = '';
  const kids = children.get(gid(raw.guid)) ?? [];
  if (n.type === 'TEXT') {
    warn.add(`TEXT node ${n.name} skipped`);
    return '';
  }
  if (n.type === 'INSTANCE') {
    const sym = byId.get(gid(n.symbolData?.symbolID));
    if (!sym) return '';
    const ovr = buildOverrides(n);
    const sub = { ovr, ovrLast: lastKey(ovr), prefix: [] };
    // the instance renders the master's content (the master node itself carries the frame fills/clip)
    inner += frameBody(sym, { ...n, type: 'FRAME', size: n.size, cornerRadius: sym.cornerRadius, fillPaints: sym.fillPaints, fillGeometry: sym.fillGeometry, strokePaints: sym.strokePaints, strokeGeometry: sym.strokeGeometry, frameMaskDisabled: sym.frameMaskDisabled }, sub, defsOut, children.get(gid(sym.guid)) ?? [], true);
  } else if (n.type === 'FRAME' || n.type === 'SYMBOL') {
    inner += frameBody(raw, n, ctx, defsOut, kids, false);
  } else {
    // leaf shapes (VECTOR, BOOLEAN_OPERATION, ELLIPSE, RECTANGLE...); boolean ops use their computed geometry
    inner += geomMarkup(n, size, defsOut);
    if (n.type !== 'BOOLEAN_OPERATION' && kids.length) inner += renderChildren(raw, ctx, defsOut, kids);
  }
  if (!inner) return '';
  const fx = effectsAttr(n, defsOut, ctx.gooey);
  return `<g ${attrs.join(' ')}${fx}>${inner}</g>`.replace('<g >', '<g>');
}

function frameBody(masterOrNode, n, ctx, defsOut, kids, isInstance) {
  const size = n.size;
  let out = '';
  // background fills / strokes
  out += geomMarkup({ ...n, fillGeometry: n.fillGeometry }, size, defsOut);
  // Instance children keep the master's own coordinates (instances are drawn at master size unless scaled by derived data)
  let body = renderChildren(masterOrNode, ctx, defsOut, kids);
  if (isInstance) {
    // derived size differs from master => children were already re-laid by derivedSymbolData transforms
  }
  const clip = n.frameMaskDisabled === false || n.frameMaskDisabled === undefined;
  if (clip && body && n.type !== 'SYMBOL') {
    const id = `c${++uid}`;
    const d = (n.fillGeometry ?? []).length ? n.fillGeometry.map(pathOf).join('') : '';
    defsOut.push(`<clipPath id="${id}">${d ? `<path d="${d}"/>` : `<rect width="${num(size.x)}" height="${num(size.y)}"/>`}</clipPath>`);
    body = `<g clip-path="url(#${id})">${body}</g>`;
  }
  return out + body;
}

// ---------- sets, frames, timing ----------
const section = children.get(gid(page.guid)).find((c) => c.type === 'SECTION') ?? page;
const sets = [...(children.get(gid(section.guid)) ?? []), ...(children.get(gid(page.guid)) ?? [])].filter(
  (f) => f.type === 'FRAME' && (children.get(gid(f.guid)) ?? []).some((k) => k.type === 'SYMBOL'),
);

const SETS = {
  '.Builing blocks/testTubeAnimation': 'testTube',
  '.Builing blocks/capsuleAnimation': 'capsule',
  '.Builing blocks/tabletAnimation': 'tablet',
  '.Builing blocks/heartBeatAnimation': 'heart',
  '.Builing blocks/dotLoaderAnimation': 'slidingDots',
  '.Builing blocks/scanningAnimation': 'scanning',
  '.Buiding blocks/searchAnimation': 'search',
  '.Builing blocks/Liquid-loader-animation1': 'liquid1',
  '.Builing blocks/Liquid-loader-animation2': 'liquid2',
  '.Builing blocks/Liquid-loader-animation3': 'liquid3',
  '.dotsAnimation': 'dots',
  '.Spinner': 'spinner',
};

const result = {};
for (const set of sets) {
  const k = SETS[set.name];
  if (!k || result[k]) continue;
  const syms = (children.get(gid(set.guid)) ?? []).filter((c) => c.type === 'SYMBOL');
  // order by prototype chain (start from the one nobody targets, else first by x position)
  const next = new Map();
  const targeted = new Set();
  for (const s of syms) {
    const pi = (s.prototypeInteractions ?? []).find((p) => !p.isDeleted && p.actions?.[0]?.transitionNodeID);
    const a = pi?.actions[0];
    if (a) {
      next.set(gid(s.guid), { to: gid(a.transitionNodeID), hold: pi.event.transitionTimeout ?? 0, tween: a.transitionType === 'INSTANT_TRANSITION' ? 0 : a.transitionDuration ?? 0 });
      targeted.add(gid(a.transitionNodeID));
    }
  }
  let ordered = [];
  if (next.size) {
    const byPos = [...syms].sort((a, b) => a.transform.m12 - b.transform.m12 || a.transform.m02 - b.transform.m02);
    let cur = byPos.find((s) => s.name.match(/=(1|start|Frame|Group|Spinner 01|Stage=1)/)) ?? byPos[0];
    const first = cur;
    const seen = new Set();
    // pick the head: the variant whose chain visits the most nodes
    let best = [];
    for (const s of byPos) {
      const chain = [];
      const sn = new Set();
      let c = s;
      while (c && !sn.has(gid(c.guid))) {
        sn.add(gid(c.guid));
        chain.push(c);
        const nx = next.get(gid(c.guid));
        c = nx ? byId.get(nx.to) : null;
      }
      if (chain.length > best.length) best = chain;
    }
    void first; void seen;
    ordered = best;
  } else {
    ordered = [...syms].sort((a, b) => a.transform.m12 - b.transform.m12 || a.transform.m02 - b.transform.m02);
  }
  const w = Math.round(ordered[0].size.x * 100) / 100;
  const h = Math.round(ordered[0].size.y * 100) / 100;
  const frames = ordered.map((s) => {
    const defs = [];
    const body = frameBody(s, s, { ovr: null, ovrLast: null, prefix: [] }, defs, children.get(gid(s.guid)) ?? [], false);
    const nx = next.get(gid(s.guid));
    return { name: s.name, w: s.size.x, h: s.size.y, defs: defs.join(''), body, hold: nx?.hold ?? 0, tween: nx?.tween ?? 0, animated: !!nx };
  });
  result[k] = { figma: set.name, w, h, frames, animated: next.size > 0 };
  console.log(k.padEnd(16), `${frames.length} frames`, `${w}x${h}`, `cycle ${frames.reduce((a, f) => a + f.hold + f.tween, 0).toFixed(2)}s`, `${Math.round(frames.reduce((a, f) => a + f.body.length + f.defs.length, 0) / 1024)}KB`);
}
if (warn.size) console.log('WARN', [...warn].join('\n     '));

// loaderAnimation set: which master each Animation Type selects (for the LoaderAnimation switch)
const la = sets.find((s) => s.name === 'loaderAnimation');
const mapping = {};
if (la) {
  for (const v of children.get(gid(la.guid)) ?? []) {
    const inst = (function find(n) {
      for (const c of children.get(gid(n.guid)) ?? []) {
        if (c.type === 'INSTANCE') return c;
        const r = find(c);
        if (r) return r;
      }
    })(v);
    const sym = inst && byId.get(gid(inst.symbolData?.symbolID));
    const parent = sym && byId.get(gid(sym.parentIndex?.guid));
    mapping[v.name] = parent?.name ?? null;
  }
  console.log('loaderAnimation ->', mapping);
}

const cssSafe = JSON.stringify;
const lines = [];
lines.push('/* eslint-disable */');
lines.push('// GENERATED by scripts/generate/pulse-loaders.mjs from the Figma "Loader" page. Do not edit by hand.');
lines.push('// Each frame is one component-set variant; hold/tween (seconds) come from the Figma prototype timing.');
lines.push('export interface LoaderFrameData { name: string; defs: string; body: string; hold: number; tween: number }');
lines.push('export interface LoaderAnimationData { figma: string; width: number; height: number; frames: LoaderFrameData[]; animated: boolean }');
lines.push('export const loaderAnimations = {');
for (const [k, v] of Object.entries(result)) {
  lines.push(`  ${k}: { figma: ${cssSafe(v.figma)}, width: ${v.w}, height: ${v.h}, animated: ${v.animated}, frames: [`);
  for (const f of v.frames) lines.push(`    { name: ${cssSafe(f.name)}, hold: ${r2(f.hold)}, tween: ${r2(f.tween)}, defs: ${cssSafe(f.defs)}, body: ${cssSafe(f.body)} },`);
  lines.push('  ] },');
}
lines.push('} satisfies Record<string, LoaderAnimationData>;');
lines.push('export type LoaderAnimationKey = keyof typeof loaderAnimations;');
writeFileSync(new URL('../../src/components/data-display/Loader/loaders.generated.ts', import.meta.url), lines.join('\n') + '\n');
console.log('written');



