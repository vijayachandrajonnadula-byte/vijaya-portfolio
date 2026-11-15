// Pulse "Charts & Cards" page: .Building Blocks/Charts Donut (Size S | M | L), Charts Pie, Charts Nightingale, Charts Circle (Size S | M | L)
// and .Building Blocks/Charts Values (hero value + caption shown in the donut centre). All 196px, pure SVG.
// Donut: the Figma export has ring geometry only as vector paths; ring thickness per size is approximated (see RING).
// S ends are square (r=4), M and L ends rounded (r=1000), as in the spec.
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { pt, textStyle } from '../../../theme/pulseTokens';
import { chartColors, seriesColor } from './ChartTheme';

const D = 196;
const C = D / 2;

export interface ChartSlice {
  label?: string;
  value: number;
  color?: string;
}

const defaultSlices: ChartSlice[] = [
  { label: 'Brand', value: 40 }, { label: 'Blue', value: 30 }, { label: 'Green', value: 20 }, { label: 'Yellow', value: 10 },
];

function polar(r: number, a: number) {
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
}
/** Annular sector (r0 = 0 gives a pie wedge). Angles in radians, 0 = 12 o'clock, clockwise. */
function sector(r0: number, r1: number, a0: number, a1: number) {
  const s = a0 - Math.PI / 2;
  const e = a1 - Math.PI / 2;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = polar(r1, s);
  const [x1, y1] = polar(r1, e);
  if (r0 <= 0) return `M${C},${C} L${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} Z`;
  const [x2, y2] = polar(r0, e);
  const [x3, y3] = polar(r0, s);
  return `M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z`;
}

function layout(slices: ChartSlice[]) {
  const total = slices.reduce((s, x) => s + Math.max(0, x.value), 0) || 1;
  let acc = 0;
  return slices.map((s, i) => {
    const a0 = (acc / total) * Math.PI * 2;
    acc += Math.max(0, s.value);
    return { a0, a1: (acc / total) * Math.PI * 2, color: seriesColor(i, s.color), slice: s };
  });
}

const frame = (children: ReactNode, sx?: SxProps<Theme>, label?: string) => (
  <Box data-spec="chart-radial" role="img" aria-label={label} sx={[{ position: 'relative', width: D, height: D, flexShrink: 0 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
    {children}
  </Box>
);

/* ---------------- Values ---------------- */
export interface ChartValuesProps {
  value: ReactNode;
  caption?: ReactNode;
}
/** .Building Blocks/Charts Values: textChart Hero (Brand) over a Primary textContent caption, centred. */
export function ChartValues({ value, caption }: ChartValuesProps) {
  return (
    <Box data-spec="chart-values" sx={{ display: 'flex', flexDirection: 'column', gap: '1px', alignItems: 'center', textAlign: 'center', width: 98 }}>
      <Box sx={{ ...textStyle('heading4', 'medium'), color: chartColors.brand }}>{value}</Box>
      {caption != null && <Box sx={{ ...textStyle('textL'), color: pt.formElements.content.primaryTextColor }}>{caption}</Box>}
    </Box>
  );
}

/* ---------------- Donut ---------------- */
export type ChartDonutSize = 's' | 'm' | 'l';
const RING: Record<ChartDonutSize, number> = { s: 24, m: 32, l: 40 };

export interface ChartDonutProps {
  size?: ChartDonutSize;
  slices?: ChartSlice[];
  /** Centre content (Charts Values). Pass `value`/`caption` or a node. */
  value?: ReactNode;
  caption?: ReactNode;
  sx?: SxProps<Theme>;
}

export function ChartDonut({ size = 'm', slices = defaultSlices, value, caption, sx }: ChartDonutProps) {
  const t = RING[size];
  const cap = size === 's' ? 'butt' : 'round';
  const gap = size === 's' ? 0 : 0.02;
  return frame(
    <>
      <svg width={D} height={D} viewBox={`0 0 ${D} ${D}`} style={{ display: 'block' }}>
        {layout(slices).map((p, i) => {
          if (p.a1 - p.a0 >= Math.PI * 2 - 1e-6) return <circle key={i} cx={C} cy={C} r={C - t / 2} fill="none" stroke={p.color} strokeWidth={t} />;
          const pad = cap === 'round' ? gap : 0;
          return (
            <path
              key={i}
              d={sector(C - t + (cap === 'round' ? 2 : 0), C - (cap === 'round' ? 2 : 0), p.a0 + pad, Math.max(p.a0 + pad, p.a1 - pad))}
              fill={p.color}
              stroke={p.color}
              strokeWidth={cap === 'round' ? 4 : 0}
              strokeLinejoin="round"
            />
          );
        })}
      </svg>
      {(value != null || caption != null) && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChartValues value={value} caption={caption} />
        </Box>
      )}
    </>,
    sx,
    'Donut chart',
  );
}

/* ---------------- Pie ---------------- */
export interface ChartPieProps {
  slices?: ChartSlice[];
  sx?: SxProps<Theme>;
}
export function ChartPie({ slices = defaultSlices, sx }: ChartPieProps) {
  return frame(
    <svg width={D} height={D} viewBox={`0 0 ${D} ${D}`} style={{ display: 'block' }}>
      {layout(slices).map((p, i) =>
        p.a1 - p.a0 >= Math.PI * 2 - 1e-6 ? <circle key={i} cx={C} cy={C} r={C} fill={p.color} /> : <path key={i} d={sector(0, C, p.a0, p.a1)} fill={p.color} />,
      )}
    </svg>,
    sx,
    'Pie chart',
  );
}

/* ---------------- Nightingale (rose) ---------------- */
export interface ChartNightingaleProps {
  /** Equal-angle petals; `value` (0..max) sets the radius. */
  slices?: ChartSlice[];
  sx?: SxProps<Theme>;
}
const roseColors = [chartColors.green, chartColors.yellow, chartColors.blue, chartColors.brand];
const defaultRose:ChartSlice[] = [{ value: 98 }, { value: 70 }, { value: 40 }, { value: 22 }];
export function ChartNightingale({ slices = defaultRose, sx }: ChartNightingaleProps) {
  const max = Math.max(...slices.map((s) => s.value), 1);
  const step = (Math.PI * 2) / slices.length;
  return frame(
    <svg width={D} height={D} viewBox={`0 0 ${D} ${D}`} style={{ display: 'block' }}>
      {slices.map((s, i) => (
        <path key={i} d={sector(0, (s.value / max) * C, i * step, (i + 1) * step)} fill={s.color ?? roseColors[i % roseColors.length]} />
      ))}
    </svg>,
    sx,
    'Nightingale rose chart',
  );
}

/* ---------------- Circle (concentric progress discs) ---------------- */
export type ChartCircleSize = 's' | 'm' | 'l';
const CIRCLE_D: Record<ChartCircleSize, [number, number, number]> = { s: [196, 164, 132], m: [196, 148, 100], l: [196, 132, 68] };
const CIRCLE_TRACK = ['#eef3fb', '#eff6ff', '#fefce8'] as const;
const CIRCLE_FILL = [chartColors.brand, chartColors.blue, chartColors.yellow] as const;

export interface ChartCircleProps {
  size?: ChartCircleSize;
  /** Percent (0..100) for the outer, middle and inner disc. */
  values?: [number, number, number];
  sx?: SxProps<Theme>;
}
export function ChartCircle({ size = 'm', values = [75, 55, 35], sx }: ChartCircleProps) {
  return frame(
    <svg width={D} height={D} viewBox={`0 0 ${D} ${D}`} style={{ display: 'block' }}>
      {CIRCLE_D[size].map((d, i) => {
        const pct = Math.min(100, Math.max(0, values[i] ?? 0));
        const r = d / 2;
        const a = (pct / 100) * Math.PI * 2;
        return (
          <g key={i}>
            <circle cx={C} cy={C} r={r} fill={CIRCLE_TRACK[i]} />
            {pct >= 100 ? (
              <circle cx={C} cy={C} r={r} fill={CIRCLE_FILL[i]} stroke="#fff" strokeWidth={i === 0 ? 1 : 2} />
            ) : pct > 0 ? (
              <path d={sector(0, r, 0, a)} fill={CIRCLE_FILL[i]} stroke="#fff" strokeWidth={i === 0 ? 1 : 2} strokeLinejoin="round" />
            ) : null}
          </g>
        );
      })}
    </svg>,
    sx,
    'Circle chart',
  );
}
