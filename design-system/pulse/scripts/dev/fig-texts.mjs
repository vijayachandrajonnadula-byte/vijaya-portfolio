/**
 * Prints every text layer under a node of a .fig file, in reading order. Used to read the usage text a designer wrote on a page.
 *   node --max-old-space-size=12000 scripts/dev/fig-texts.mjs "../../pulse 2.0.fig" 12141:36446
 */
import { resolve } from 'node:path';
import { gid, loadFig } from '../figma/fig-load.mjs';

const { children, byId } = await loadFig(resolve(process.argv[2]));
const root = byId.get(process.argv[3]);
if (!root) { console.log('no such node'); process.exit(1); }
const seen = new Set();
const walk = (n, d) => {
  if (n.type === 'TEXT' && n.textData?.characters) {
    const t = n.textData.characters.trim().replace(/\s+/g, ' ');
    if (t.length > 1 && !seen.has(t + gid(n.guid))) { seen.add(t + gid(n.guid)); console.log(`${'·'.repeat(Math.min(d, 6))} ${t}`); }
  }
  for (const k of children.get(gid(n.guid)) ?? []) walk(k, d + 1);
};
walk(root, 0);
