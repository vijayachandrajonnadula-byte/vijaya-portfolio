/**
 * Dumps the variable collections of the pulse-2.0 .fig to figma-tokens/pulse/variables.json.
 * { collections: [{ name, modes:[..], variables:[{ name, type, values:{mode: value|{alias:name}} }] }] }
 * Variables whose collection lives in an external library keep only what the file stores.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gid, loadFig } from './fig-load.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const { nodes, byId } = await loadFig(resolve(process.argv[2] ?? join(here, '../../pulse 2.0.fig')));
const h2 = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
const hex = (c) => `#${h2(c.r)}${h2(c.g)}${h2(c.b)}${(c.a ?? 1) < 0.995 ? h2(c.a) : ''}`;

const sets = nodes.filter((n) => n.type === 'VARIABLE_SET');
const modeName = new Map();
for (const s of sets) for (const m of s.variableSetModes ?? []) modeName.set(gid(m.id), m.name);
const setOf = (v) => {
  const id = v.variableSetID?.guid;
  return id ? byId.get(gid(id)) : null;
};

const val = (d) => {
  const x = d?.value;
  if (!x) return null;
  if (x.alias) {
    const t = byId.get(gid(x.alias.guid));
    return { alias: t?.name ?? `external:${x.alias.assetRef?.key?.slice(0, 8)}` };
  }
  if (x.colorValue) return hex(x.colorValue);
  if (x.floatValue != null) return Math.round(x.floatValue * 1000) / 1000;
  if (x.textValue != null) return x.textValue;
  if (x.boolValue != null) return x.boolValue;
  return null;
};

const collections = new Map();
for (const v of nodes.filter((n) => n.type === 'VARIABLE')) {
  const s = setOf(v);
  const key = s ? gid(s.guid) : 'external';
  if (!collections.has(key)) collections.set(key, { name: s?.name ?? 'external', modes: (s?.variableSetModes ?? []).map((m) => m.name), variables: [] });
  const values = {};
  for (const e of v.variableDataValues?.entries ?? []) values[modeName.get(gid(e.modeID)) ?? gid(e.modeID)] = val(e.variableData);
  collections.get(key).variables.push({ name: v.name, type: v.variableResolvedType, values });
}
const result = { collections: [...collections.values()] };
const target = join(here, '../../figma-tokens/pulse/variables.json');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, JSON.stringify(result, null, 0));
for (const c of result.collections) console.log(c.name.padEnd(24), 'modes', JSON.stringify(c.modes), 'vars', c.variables.length);
