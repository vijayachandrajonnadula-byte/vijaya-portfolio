/**
 * Generates the vector symbol libraries from real Figma geometry (commandsBlob in msg.blobs).
 *   node --max-old-space-size=8192 scripts/generate/pulse-symbols.mjs [equipment instruments subpart lines arrows shapes flags]
 * Writes src/symbols/generated/<set>.ts (one lazily importable module per set).
 *
 * Every VECTOR/ELLIPSE/RECTANGLE/BOOLEAN_OPERATION node is emitted from its fillGeometry (painted with fillPaints)
 * and strokeGeometry (an already-outlined shape, painted with strokePaints). Frames/groups become <g>, mask nodes
 * become <clipPath>s for their following siblings, TEXT is emitted from its glyph outlines, gradients become
 * <linearGradient>/<radialGradient> in the node's local user space.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { loadFig, gid } from '../figma/fig-load.mjs';

const { msg, children, pages } = await loadFig('pulse 2.0.fig');
const kids = (n) => children.get(gid(n.guid)) ?? [];
const OUT = new URL('../../src/symbols/generated/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const num = (v) => { const r = Math.round(v * 100) / 100; return Object.is(r, -0) ? 0 : r; };
const warn = new Map();
const note = (m) => warn.set(m, (warn.get(m) ?? 0) + 1);

function decode(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let o = 0;
  const pts = [];
  const f = () => { const v = dv.getFloat32(o, true); o += 4; return v; };
  const parts = [];
  const P = (x, y) => { pts.push([x, y]); return `${num(x)} ${num(y)}`; };
  while (o < bytes.length) {
    const c = bytes[o++];
    if (c === 0) parts.push('Z');
    else if (c === 1) parts.push('M' + P(f(), f()));
    else if (c === 2) parts.push('L' + P(f(), f()));
    else if (c === 3) parts.push('Q' + P(f(), f()) + ' ' + P(f(), f()));
    else if (c === 4) parts.push('C' + P(f(), f()) + ' ' + P(f(), f()) + ' ' + P(f(), f()));
    else break;
  }
  return { d: parts.join(''), pts };
}

const IDENT = [1, 0, 0, 1, 0, 0];
const mat = (t) => (t ? [t.m00, t.m10, t.m01, t.m11, t.m02, t.m12] : IDENT);
const mul = (p, q) => [
  p[0] * q[0] + p[2] * q[1], p[1] * q[0] + p[3] * q[1],
  p[0] * q[2] + p[2] * q[3], p[1] * q[2] + p[3] * q[3],
  p[0] * q[4] + p[2] * q[5] + p[4], p[1] * q[4] + p[3] * q[5] + p[5],
];
const isIdent = (m) => m.every((v, i) => Math.abs(v - IDENT[i]) < 1e-4);
const fmtM = (m) => `matrix(${m.map((v) => +v.toFixed(5)).join(' ')})`;
function inv(m) {
  const det = m[0] * m[3] - m[1] * m[2] || 1e-9;
  const a = m[3] / det, b = -m[1] / det, c = -m[2] / det, d = m[0] / det;
  return [a, b, c, d, -(a * m[4] + c * m[5]), -(b * m[4] + d * m[5])];
}
const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const alpha = (v) => +v.toFixed(3);

class Ctx {
  constructor(prefix) { this.prefix = prefix; this.defs = []; this.defMap = new Map(); this.n = 0; this.bb = [Infinity, Infinity, -Infinity, -Infinity]; }
  id(kind) { return `${this.prefix}${kind}${++this.n}`; }
  addPts(pts, m) {
    for (const [x, y] of pts) {
      const X = m[0] * x + m[2] * y + m[4], Y = m[1] * x + m[3] * y + m[5];
      if (X < this.bb[0]) this.bb[0] = X; if (Y < this.bb[1]) this.bb[1] = Y;
      if (X > this.bb[2]) this.bb[2] = X; if (Y > this.bb[3]) this.bb[3] = Y;
    }
  }
}

/** Returns {attrs} for a paint ("fill" attribute string) or null when invisible/unsupported. */
function paintAttrs(p, node, ctx) {
  if (!p || p.visible === false) return null;
  const po = p.opacity ?? 1;
  if (p.type === 'SOLID') {
    const a = alpha((p.color.a ?? 1) * po);
    return `fill="${hex(p.color)}"${a < 1 ? ` fill-opacity="${a}"` : ''}`;
  }
  if (p.type === 'GRADIENT_LINEAR' || p.type === 'GRADIENT_RADIAL') {
    const w = node.size?.x || 1, h = node.size?.y || 1;
    const gt = mul([w, 0, 0, h, 0, 0], inv(mat(p.transform)));
    const stops = (p.stops ?? []).map((s) => `<stop offset="${+s.position.toFixed(4)}" stop-color="${hex(s.color)}"${alpha((s.color.a ?? 1) * po) < 1 ? ` stop-opacity="${alpha((s.color.a ?? 1) * po)}"` : ''}/>`).join('');
    const radial = p.type === 'GRADIENT_RADIAL';
    const geom = radial ? 'cx="0.5" cy="0.5" r="0.5"' : 'x1="0" y1="0.5" x2="1" y2="0.5"';
    const body = `${radial ? 'radialGradient' : 'linearGradient'} gradientUnits="userSpaceOnUse" ${geom} gradientTransform="${fmtM(gt)}">${stops}`;
    let id = ctx.defMap.get(body);
    if (!id) {
      id = ctx.id('g');
      ctx.defMap.set(body, id);
      const tag = radial ? 'radialGradient' : 'linearGradient';
      ctx.defs.push(`<${body.replace(/^\S+/, tag + ' id="' + id + '"')}</${tag}>`);
    }
    return `fill="url(#${id})"`;
  }
  note('paint:' + p.type);
  return null;
}

function geomPaths(n, ctx, m, kind) {
  const geoms = kind === 'fill' ? n.fillGeometry : n.strokeGeometry;
  const paints = (kind === 'fill' ? n.fillPaints : n.strokePaints) ?? [];
  const out = [];
  for (const p of paints) {
    const attrs = paintAttrs(p, n, ctx);
    if (!attrs) continue;
    for (const g of geoms ?? []) {
      const bytes = msg.blobs[g.commandsBlob]?.bytes;
      if (!bytes) { note('missing blob'); continue; }
      const { d, pts } = decode(bytes);
      ctx.addPts(pts, m);
      out.push(`<path d="${d}" ${attrs}${g.windingRule === 'ODD' ? ' fill-rule="evenodd"' : ''}/>`);
    }
  }
  return out;
}

function clipContent(n, ctx, m, out) {
  if (n.visible === false) return;
  const mm = mul(m, mat(n.transform));
  for (const g of n.fillGeometry ?? []) {
    const bytes = msg.blobs[g.commandsBlob]?.bytes;
    if (!bytes) continue;
    out.push(`<path d="${decode(bytes).d}"${isIdent(mm) ? '' : ` transform="${fmtM(mm)}"`}${g.windingRule === 'ODD' ? ' clip-rule="evenodd"' : ''}/>`);
  }
  if (n.type !== 'BOOLEAN_OPERATION') for (const c of kids(n)) clipContent(c, ctx, mm, out);
}

function wrap(n, inner) {
  if (!inner) return '';
  const m = mat(n.transform);
  const attrs = [];
  if (!isIdent(m)) attrs.push(`transform="${fmtM(m)}"`);
  if (n.opacity != null && n.opacity < 1) attrs.push(`opacity="${alpha(n.opacity)}"`);
  return attrs.length ? `<g ${attrs.join(' ')}>${inner}</g>` : inner;
}

function emit(n, ctx, pm) {
  if (n.visible === false) return '';
  const m = mul(pm, mat(n.transform));
  let inner = '';
  if (n.type === 'TEXT') {
    const fill = (n.fillPaints ?? []).find((p) => p.visible !== false);
    const attrs = paintAttrs(fill, n, ctx);
    if (attrs) {
      for (const g of n.derivedTextData?.glyphs ?? []) {
        const bytes = msg.blobs[g.commandsBlob]?.bytes;
        if (!bytes) continue;
        const { d, pts } = decode(bytes);
        const gm = mul(m, [1, 0, 0, 1, g.position.x, g.position.y]);
        ctx.addPts(pts, gm);
        inner += `<path d="${d}" transform="translate(${num(g.position.x)} ${num(g.position.y)})" ${attrs}/>`;
      }
    }
    return wrap(n, inner);
  }
  if (n.type === 'INSTANCE') {
    note('instance (skipped)');
    return '';
  }
  inner += geomPaths(n, ctx, m, 'fill').join('');
  if (n.type !== 'BOOLEAN_OPERATION') {
    // children, with mask handling: a mask node clips all following siblings
    const list = kids(n);
    let i = 0;
    const walk = (from, to) => {
      let s = '';
      for (let k = from; k < to; k++) {
        const c = list[k];
        if (c.mask && c.visible !== false) {
          const parts = [];
          clipContent(c, ctx, IDENT, parts);
          const id = ctx.id('c');
          ctx.defs.push(`<clipPath id="${id}">${parts.join('')}</clipPath>`);
          s += `<g clip-path="url(#${id})">${walk(k + 1, to)}</g>`;
          return s;
        }
        s += emit(c, ctx, m);
      }
      return s;
    };
    i = walk(0, list.length);
    inner += i;
  }
  inner += geomPaths(n, ctx, m, 'stroke').join('');
  return wrap(n, inner);
}

/** Build one variant symbol into {viewBox, body}. */
function buildSymbol(sym, prefix) {
  const ctx = new Ctx(prefix);
  const list = kids(sym);
  let rect = [0, 0, sym.size.x, sym.size.y];
  // symbols whose only child is a framed artboard (Equipment/instruments/...) frame on that child
  if (list.length === 1 && list[0].type === 'FRAME' && list[0].size.x > 0) {
    const t = list[0].transform;
    rect = [t.m02, t.m12, t.m02 + list[0].size.x, t.m12 + list[0].size.y];
  }
  let body = '';
  for (const c of list) body += emit(c, ctx, IDENT);
  let [x0, y0, x1, y1] = rect;
  if (ctx.bb[0] < Infinity) {
    x0 = Math.min(x0, ctx.bb[0]); y0 = Math.min(y0, ctx.bb[1]); x1 = Math.max(x1, ctx.bb[2]); y1 = Math.max(y1, ctx.bb[3]);
  }
  const pad = 0;
  x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
  const vb = [num(x0), num(y0), num(Math.max(x1 - x0, 0.01)), num(Math.max(y1 - y0, 0.01))].join(' ');
  return { viewBox: vb, body: (ctx.defs.length ? `<defs>${ctx.defs.join('')}</defs>` : '') + body };
}

function findSet(pageSuffix, name) {
  const page = pages.find((p) => p.name.trim().endsWith(pageSuffix));
  let found = null;
  (function w(n) {
    for (const c of kids(n)) {
      if (found) return;
      if (c.name === name && kids(c).length > 3) found = c; else w(c);
    }
  })(page);
  if (!found) throw new Error('set not found ' + name);
  return found;
}
const props = (name) => Object.fromEntries(name.split(',').map((s) => s.trim().split('=')).map(([k, v]) => [k.trim(), (v ?? '').trim()]));
// Figma variant values carry a trailing instance counter (e.g. 'pump 1'); it is not part of the name.
const stripN = (s) => s.replace(/\s+\d+$/, '');
const camel = (s) => s.charAt(0).toLowerCase() + s.slice(1);

const ARROW_END = { DefaultLine: 'line', CricleArrow: 'circle', DiamondArrow: 'diamond', TriangleArrow: 'triangle', ReversedTriangleArrow: 'reversedTriangle', '-': 'none' };
const ARROW_DIR = { Left: 'left', Right: 'right', DoubleSided: 'both', '-': 'none' };
const SHAPE_NAME = { Rectangle: 'rectangle', Square: 'square', Triangle: 'triangle', InvertedTriangle: 'invertedTriangle', Diamond: 'diamond', Paralleogram: 'parallelogram', Circl: 'circle', Circle: 'circle' };

const SETS = {
  equipment: { page: 'Imagery', set: 'Equipment', type: 'EquipmentType', key: (p) => stripN(p.Variant) },
  instruments: { page: 'Imagery', set: 'instruments', type: 'InstrumentType', key: (p) => stripN(p.Variant) },
  subpart: { page: 'Imagery', set: 'Subpart', type: 'SubpartType', key: (p) => stripN(p.Variant) },
  lines: { page: 'Imagery', set: 'Lines', type: 'ProcessLineType', key: (p) => stripN(p.Variant) },
  arrows: {
    page: 'Arrows', set: 'Arrows', type: 'ArrowKey',
    key: (p) => `${ARROW_END[p['End Points']] ?? p['End Points']}/${p.Size.toLowerCase()}/${ARROW_DIR[p.Direction] ?? p.Direction}/${camel(p.Type)}`,
  },
  shapes: {
    page: 'Shapes', set: 'Shapes', type: 'ShapeKey',
    key: (p) => `${SHAPE_NAME[p.Shape] ?? camel(p.Shape)}/${camel(p.Type)}`,
  },
  flags: { page: 'Icons', set: 'FlagIcon', type: 'FlagCountry', key: (p) => p.Country },
};

const want = process.argv.slice(2);
const todo = want.length ? want : Object.keys(SETS);
for (const name of todo) {
  const cfg = SETS[name];
  if (!cfg) throw new Error('unknown set ' + name);
  const set = findSet(cfg.page, cfg.set);
  const entries = [];
  let bytes = 0;
  kids(set).forEach((sym, i) => {
    if (sym.type !== 'SYMBOL') return;
    const key = cfg.key(props(sym.name));
    const s = buildSymbol(sym, `${name[0]}${i}`);
    entries.push([key, s]);
    bytes += s.body.length;
  });
  const keys = entries.map((e) => e[0]);
  if (new Set(keys).size !== keys.length) console.warn(name, 'DUPLICATE KEYS', keys.filter((k, i) => keys.indexOf(k) !== i));
  const src = `/* eslint-disable */
// GENERATED by scripts/generate/pulse-symbols.mjs from the Figma "${cfg.set}" set (${entries.length} variants). Do not edit.
import type { SymbolData } from '../types';

export const keys = ${JSON.stringify(keys)} as const;
export type ${cfg.type} = (typeof keys)[number];

export const symbols: Record<${cfg.type}, SymbolData> = {
${entries.map(([k, s]) => `  ${JSON.stringify(k)}: { viewBox: ${JSON.stringify(s.viewBox)}, body: ${JSON.stringify(s.body)} },`).join('\n')}
};

export default symbols;
`;
  writeFileSync(new URL(`${name}.ts`, OUT), src);
  console.log(name, entries.length, 'variants', Math.round(bytes / 1024) + ' KB');
}
if (warn.size) console.log('notes:', Object.fromEntries(warn));

