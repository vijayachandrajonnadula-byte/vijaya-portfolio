// The colour mapping, as data. Shared by apply.mjs (rewrite files) and by tooling that audits the result.
import fs from 'fs';
import path from 'path';

/* Tailwind v3 palettes, as used by the original code. */
export const TW = {
  slate:   ['f8fafc', 'f1f5f9', 'e2e8f0', 'cbd5e1', '94a3b8', '64748b', '475569', '334155', '1e293b', '0f172a', '020617'],
  gray:    ['f9fafb', 'f3f4f6', 'e5e7eb', 'd1d5db', '9ca3af', '6b7280', '4b5563', '374151', '1f2937', '111827', '030712'],
  red:     ['fef2f2', 'fee2e2', 'fecaca', 'fca5a5', 'f87171', 'ef4444', 'dc2626', 'b91c1c', '991b1b', '7f1d1d', '450a0a'],
  orange:  ['fff7ed', 'ffedd5', 'fed7aa', 'fdba74', 'fb923c', 'f97316', 'ea580c', 'c2410c', '9a3412', '7c2d12', '431407'],
  amber:   ['fffbeb', 'fef3c7', 'fde68a', 'fcd34d', 'fbbf24', 'f59e0b', 'd97706', 'b45309', '92400e', '78350f', '451a03'],
  yellow:  ['fefce8', 'fef9c3', 'fef08a', 'fde047', 'facc15', 'eab308', 'ca8a04', 'a16207', '854d0e', '713f12', '422006'],
  green:   ['f0fdf4', 'dcfce7', 'bbf7d0', '86efac', '4ade80', '22c55e', '16a34a', '15803d', '166534', '14532d', '052e16'],
  emerald: ['ecfdf5', 'd1fae5', 'a7f3d0', '6ee7b7', '34d399', '10b981', '059669', '047857', '065f46', '064e3b', '022c22'],
  teal:    ['f0fdfa', 'ccfbf1', '99f6e4', '5eead4', '2dd4bf', '14b8a6', '0d9488', '0f766e', '115e59', '134e4a', '042f2e'],
  cyan:    ['ecfeff', 'cffafe', 'a5f3fc', '67e8f9', '22d3ee', '06b6d4', '0891b2', '0e7490', '155e75', '164e63', '083344'],
  sky:     ['f0f9ff', 'e0f2fe', 'bae6fd', '7dd3fc', '38bdf8', '0ea5e9', '0284c7', '0369a1', '075985', '0c4a6e', '082f49'],
  blue:    ['eff6ff', 'dbeafe', 'bfdbfe', '93c5fd', '60a5fa', '3b82f6', '2563eb', '1d4ed8', '1e40af', '1e3a8a', '172554'],
  indigo:  ['eef2ff', 'e0e7ff', 'c7d2fe', 'a5b4fc', '818cf8', '6366f1', '4f46e5', '4338ca', '3730a3', '312e81', '1e1b4b'],
  violet:  ['f5f3ff', 'ede9fe', 'ddd6fe', 'c4b5fd', 'a78bfa', '8b5cf6', '7c3aed', '6d28d9', '5b21b6', '4c1d95', '2e1065'],
};
const TW_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const TO_FAMILY = { slate: 'neutral', gray: 'neutral', red: 'red', orange: 'amber', amber: 'amber', yellow: 'amber', green: 'green', emerald: 'green', teal: 'teal', cyan: 'cyan', sky: 'cyan', blue: 'blue', indigo: 'purple', violet: 'purple' };

/**
 * `tints: 'shifted'` (current) moves accent 50 and 100 one step darker. The new ramps' lightest tints are paler than Tailwind's
 * (1.06:1 against white, versus about 1.08), so an unshifted fill disappears on a near-white page.
 * `tints: 'same'` is the first version of the rule, kept so the difference can be audited.
 */
export function buildMap(palette, { tints = 'shifted' } = {}) {
  const accent = { 50: tints === 'shifted' ? 100 : 50, 100: tints === 'shifted' ? 200 : 100, 200: 200, 300: 300, 400: 500, 500: 600, 600: 700, 700: 800, 800: 900, 900: 950, 950: 950 };
  const neutral = { 50: 50, 100: 100, 200: 200, 300: 300, 400: 600, 500: 600, 600: 700, 700: 800, 800: 900, 900: 950, 950: 950 };
  const map = new Map();
  for (const [fam, hexes] of Object.entries(TW)) {
    const to = TO_FAMILY[fam];
    const shift = to === 'neutral' ? neutral : accent;
    hexes.forEach((h, i) => map.set('#' + h, palette[to][shift[TW_STEPS[i]]]));
  }
  /* The original brand ramp (Brand Blue) and a few one-off neutrals from the Figma file. */
  const brand = { '#f6f8fc': 50, '#eef3fb': tints === 'shifted' ? 100 : 50, '#e3ebf8': 100, '#e7f0ff': 100, '#d3e0f2': 200, '#b5c9e7': 300, '#87a8d3': 400, '#4e73a8': 600, '#1e3a6e': 800, '#19325e': 900, '#152a4f': 900, '#02216e': 900, '#162d57': 900, '#10213f': 950, '#0a162a': 950, '#050b15': 950 };
  for (const [h, step] of Object.entries(brand)) map.set(h, palette.blue[step]);
  const neutralOneOffs = { '#8f969d': 600, '#6c757e': 600, '#f4f7fa': 100, '#fcfcfd': 50, '#e9eef4': 100, '#e7eef6': 100, '#dbe5ef': 200, '#d0d6e4': 300 };
  for (const [h, step] of Object.entries(neutralOneOffs)) map.set(h, palette.neutral[step]);
  /* Not touched: pure black and white, and the AI gradient. */
  ['#ffffff', '#000000', '#090909', '#bd06be', '#653fda', '#158eef'].forEach(h => map.delete(h));
  return map;
}

export const loadPalette = root => JSON.parse(fs.readFileSync(path.join(root, 'figma-tokens/pulse-accessible-palette.json'), 'utf8')).ramps;

/* Authored files are recoloured; generated art (flags, equipment, instruments, loaders) is left alone. */
export const SKIP_DIR = new Set(['node_modules', '.git', 'dist', 'scripts', '.storybook']);
export const isGenerated = rel => /\.generated\./.test(rel) || rel.startsWith('src/symbols/generated/') || rel === 'src/icons/generated.tsx';
export const inScope = rel => /^(src|figma-tokens)\//.test(rel) && /\.(ts|tsx|css|json)$/.test(rel) && !isGenerated(rel) && !rel.endsWith('pulse-accessible-palette.json');
export const HEX = /#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?\b/g;
