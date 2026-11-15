import { useId } from 'react';
import { chartAxisLine, chartAxisText, chartColors } from '../Charts/ChartTheme';
import { fw } from '../../../theme/typography';

/**
 * ControlChart: a run of measurements with its limit lines, for process monitoring.
 * NOT FROM FIGMA. Figma's "Charts & Cards" page has no line or control chart, so this is built from the chart
 * palette and axis tokens so that pages do not have to draw their own charts. Logged in docs/figma-deviations.md.
 *
 * Limits are optional: mean (green, solid), ucl / lcl and action limits (red, dashed), usl / lsl specification
 * limits (dark, solid). `signals` are indexes of points that broke a rule; they are drawn red.
 */
export interface ControlChartProps {
  values: number[];
  mean?: number;
  ucl?: number;
  lcl?: number;
  actionHigh?: number;
  actionLow?: number;
  usl?: number;
  lsl?: number;
  /** Indexes in `values` drawn as red signal points. */
  signals?: number[];
  /** Tint under the line. */
  area?: boolean;
  /** Label printed beside each limit line, for example "UCL". Values print after it. */
  showLimitLabels?: boolean;
  /** Pixel height of the plot. @default 180 */
  height?: number;
  /** Plot width in the SVG's own units; the chart scales to its container. @default 640 */
  width?: number;
  /** Hide the axes and labels (sparkline use). */
  bare?: boolean;
  'aria-label'?: string;
}

const W_LEFT = 44;
const W_RIGHT = 74;

function nice(min: number, max: number): { lo: number; hi: number; ticks: number[] } {
  const span = max - min || 1;
  const raw = span / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? mag * 10;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 1e6; v += step) ticks.push(Number(v.toFixed(6)));
  return { lo, hi, ticks };
}

const fmt = (v: number) => (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2));

export function ControlChart({
  values, mean, ucl, lcl, actionHigh, actionLow, usl, lsl, signals = [], area, showLimitLabels = true,
  height = 180, width = 640, bare, 'aria-label': ariaLabel,
}: ControlChartProps) {
  const id = useId().replace(/:/g, '');
  const lines = [
    { v: usl, k: 'USL', c: '#0f172a', dash: '', w: 1.2 },
    { v: ucl, k: 'UCL', c: chartColors.red, dash: '4 4', w: 1.2 },
    { v: actionHigh, k: 'Action', c: chartColors.red, dash: '4 4', w: 1.2 },
    { v: mean, k: 'CL', c: chartColors.green, dash: '', w: 1.4 },
    { v: actionLow, k: 'Action', c: chartColors.red, dash: '4 4', w: 1.2 },
    { v: lcl, k: 'LCL', c: chartColors.red, dash: '4 4', w: 1.2 },
    { v: lsl, k: 'LSL', c: '#0f172a', dash: '', w: 1.2 },
  ].filter((l): l is typeof l & { v: number } => typeof l.v === 'number');

  const all = [...values, ...lines.map((l) => l.v)];
  const { lo, hi, ticks } = nice(Math.min(...all), Math.max(...all));
  const left = bare ? 4 : W_LEFT;
  const right = bare ? 4 : showLimitLabels ? W_RIGHT : 12;
  const top = 8;
  const bottom = bare ? 4 : 22;
  const pw = width - left - right;
  const ph = height - top - bottom;
  const x = (i: number) => left + (values.length <= 1 ? pw / 2 : (i / (values.length - 1)) * pw);
  const y = (v: number) => top + ph - ((v - lo) / (hi - lo || 1)) * ph;
  const path = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const xTicks = values.length > 6 ? [0, 6, 12, 18, 24, 30, 36, 43].filter((i) => i < values.length) : values.map((_, i) => i);
  const font = { fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: fw.medium, fill: chartAxisText } as const;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label={ariaLabel ?? 'Control chart'} style={{ display: 'block' }}>
      {area && <path d={`${path} L${x(values.length - 1)} ${y(lo)} L${x(0)} ${y(lo)} Z`} fill={chartColors.blue} opacity={0.1} />}
      {!bare && ticks.map((t) => (
        <g key={t}>
          <line x1={left} x2={width - right} y1={y(t)} y2={y(t)} stroke={chartAxisLine} strokeWidth={1} opacity={0.5} />
          <text x={left - 8} y={y(t) + 3.5} textAnchor="end" {...font}>{t.toFixed(Math.abs(hi - lo) < 10 ? 2 : Math.abs(hi - lo) < 100 ? 1 : 0)}</text>
        </g>
      ))}
      {!bare && xTicks.map((i) => <text key={i} x={x(i)} y={height - 6} textAnchor="middle" {...font}>#{i + 1}</text>)}
      {lines.map((l, i) => (
        <g key={`${l.k}${i}`}>
          <line x1={left} x2={width - right} y1={y(l.v)} y2={y(l.v)} stroke={l.c} strokeWidth={l.w} strokeDasharray={l.dash} />
          {!bare && showLimitLabels && <text x={width - right + 6} y={y(l.v) + 3.5} {...font}>{l.k}{l.k === 'CL' || l.k === 'UCL' || l.k === 'LCL' ? ` ${fmt(l.v)}` : ''}</text>}
        </g>
      ))}
      <path d={path} fill="none" stroke={chartColors.blue} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
      {signals.map((i) => values[i] !== undefined && <circle key={i} cx={x(i)} cy={y(values[i] as number)} r={3.6} fill={chartColors.red} />)}
      {values.length > 0 && !signals.includes(values.length - 1) && <circle cx={x(values.length - 1)} cy={y(values[values.length - 1] as number)} r={3.2} fill={chartColors.brand} id={`${id}last`} />}
    </svg>
  );
}
