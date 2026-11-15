// Figma: Data Grid page, `TrendLine` (Color: Green | Orange | Red | Yellow | Gray | Purple), 132x10 stroked polyline, 2px.
// The Figma export keeps no path data, so the points are caller data; Gray is the flat line (132 x 0.75).
import Box from '@mui/material/Box';

export type TrendLineColor = 'green' | 'orange' | 'red' | 'yellow' | 'gray' | 'purple';

export interface TrendLineProps {
  /** @default "green" */
  color?: TrendLineColor;
  /** Series to plot, left to right. Omitted: a default shape (gray is flat). */
  data?: number[];
  /** Figma 132. */
  width?: number;
  /** Figma 10 (12 inside a data grid cell). */
  height?: number;
  'aria-label'?: string;
}

/** colors/accent/<color>/500 (yellow 400, gray neutral/400). */
const stroke: Record<TrendLineColor, string> = { green: '#22c55e', orange: '#f59e0b', red: '#ef4444', yellow: '#facc15', gray: '#5f6f86', purple: '#8b5cf6' };
const sample = [6, 4, 7, 3, 5, 2, 4, 1];

export function TrendLine({ color = 'green', data, width = 132, height = 10, 'aria-label': ariaLabel }: TrendLineProps) {
  const flat = color === 'gray' && !data;
  const series = data && data.length > 1 ? data : sample;
  const min = Math.min(...series);
  const span = Math.max(...series) - min || 1;
  const pad = 1;
  const pts = series.map((v, i) => `${(i / (series.length - 1)) * width},${flat ? height / 2 : pad + (1 - (v - min) / span) * (height - 2 * pad)}`).join(' ');
  return (
    <Box component="svg" data-spec="trendline" role={ariaLabel ? 'img' : undefined} aria-label={ariaLabel} aria-hidden={ariaLabel ? undefined : true} width={width} height={height} viewBox={`0 0 ${width} ${height}`} sx={{ display: 'block', flex: 'none', overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={stroke[color]} strokeWidth={flat ? 0.75 : 2} strokeLinecap="round" strokeLinejoin="round" />
    </Box>
  );
}
