/**
 * Fails if a numeric font weight is written anywhere outside src/theme/typography.ts (and generated files).
 *   node scripts/dev/check-weights.mjs
 * Allowed: fontWeight: fw.semiBold / role.link / a variable. Not allowed: fontWeight: 600, font-weight: 600, weight: 600.
 * textStyle('textL', 'semiBold') is fine (it reads the design kit scale).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../../src', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const skip = (p) => /[\\/](generated|symbols)[\\/]|\.generated\.|[\\/]icons[\\/]|typography\.ts$/.test(p);
const bad = [];
const walk = (d) => {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(e) && !skip(p)) {
      readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
        if (/(fontWeight\s*[:=][^,}]*|font-weight:\s*|[^a-zA-Z]weight:\s*)\b[1-9]00\b/.test(line)) bad.push(`${relative(root, p)}:${i + 1}: ${line.trim().slice(0, 120)}`);
      });
    }
  }
};
walk(root);
if (bad.length) {
  console.error(`${bad.length} numeric font weight(s). Use fw.* / role.* from src/theme/typography.ts:\n${bad.join('\n')}`);
  process.exit(1);
}
console.log('font weights: ok (no numeric weights outside src/theme/typography.ts)');
