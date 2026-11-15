// Re-maps the ORIGINAL PULSE colours onto the accessible ramps. Run it on pristine source only: it is a per-hex
// substitution, so running it twice would map the new colours again.
//   node scripts/recolour/ramps.mjs         generate the ramps
//   node scripts/recolour/apply.mjs --dry   report what would change
//   node scripts/recolour/apply.mjs         rewrite files in place (UTF-8, no BOM)
//
// Rules (a principled shift, not a taste call):
//  * Light tints: accent 50 and 100 move one step darker, because the new tints are paler than Tailwind's.
//  * Accent 400 to 900 move one step darker. Original 500s were fills, dots and sometimes text at 2.1 to 3.8:1.
//  * Slate text greys: 400 and 500 both land on neutral 600, the lightest text grey that is still AA.
//  * Generated domain art (flags, equipment, instruments, loaders) is NOT touched.
import fs from 'fs';
import path from 'path';
import { HEX, SKIP_DIR, buildMap, inScope, loadPalette } from './mapping.mjs';

const root = process.cwd();
const dry = process.argv.includes('--dry');
const map = buildMap(loadPalette(root));

const changes = { files: 0, uses: 0 }; const unmapped = {};
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) walk(p); continue; }
    const rel = path.relative(root, p).replace(/\\/g, '/');
    if (!inScope(rel)) continue;
    let n = 0;
    const out = fs.readFileSync(p, 'utf8').replace(HEX, (m, six, alpha) => {
      const to = map.get('#' + six.toLowerCase());
      if (!to) { unmapped['#' + six.toLowerCase()] = (unmapped['#' + six.toLowerCase()] || 0) + 1; return m; }
      n++; return to + (alpha ?? '');
    });
    if (n) { changes.files++; changes.uses += n; if (!dry) fs.writeFileSync(p, out, 'utf8'); }
  }
})(root);
console.log(`${dry ? 'DRY RUN: ' : ''}${changes.uses} colour uses remapped across ${changes.files} files`);
console.log('left as they were:', Object.entries(unmapped).sort((a, b) => b[1] - a[1]).slice(0, 24).map(([h, c]) => `${h}:${c}`).join(' '));
