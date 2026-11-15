// Pulse "Charts & Cards" page: .Building Blocks/Charts Axis Values (Align X - Center|Left|Right, Y - Top|Middle|Bottom),
// Charts X-Axis (Value Position Center|Left|Right, 22px tall, axisLine border) and Charts Y-Axis (Middle|Top|Bottom, 60px wide).
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { textStyle } from '../../../theme/pulseTokens';
import { chartAxisLine, chartAxisText } from './ChartTheme';

export type ChartAxisAlign = 'x-center' | 'x-left' | 'x-right' | 'y-top' | 'y-middle' | 'y-bottom';

export interface ChartAxisValueProps {
  align?: ChartAxisAlign;
  children: string | number;
}

const tickColor = chartAxisLine;
const labelSx = { ...textStyle('textS', 'medium'), color: chartAxisText, whiteSpace: 'nowrap' } as const;

/** A single axis label with its 4px tick. */
export function ChartAxisValue({ align = 'x-center', children }: ChartAxisValueProps) {
  if (align.startsWith('x')) {
    const cross = align === 'x-center' ? 'center' : align === 'x-left' ? 'flex-start' : 'flex-end';
    return (
      <Box data-spec="chart-axis-value" sx={{ display: 'flex', flexDirection: 'column', alignItems: cross, height: 22 }}>
        <Box sx={{ width: 0, height: 4, borderLeft: `1px solid ${tickColor}` }} />
        <Box sx={{ ...labelSx, height: 18 }}>{children}</Box>
      </Box>
    );
  }
  const mainAlign = align === 'y-top' ? 'flex-start' : align === 'y-middle' ? 'center' : 'flex-end';
  return (
    <Box data-spec="chart-axis-value" sx={{ display: 'flex', alignItems: mainAlign === 'center' ? 'center' : mainAlign, justifyContent: 'flex-end', gap: '4px', height: 18, width: '100%' }}>
      <Box sx={labelSx}>{children}</Box>
      <Box sx={{ width: 4, height: 0, borderTop: `1px solid ${tickColor}`, alignSelf: align === 'y-top' ? 'flex-start' : align === 'y-bottom' ? 'flex-end' : 'center' }} />
    </Box>
  );
}

export interface ChartXAxisProps {
  values: Array<string | number>;
  valuePosition?: 'center' | 'left' | 'right';
  width?: number | string;
  sx?: SxProps<Theme>;
}

export function ChartXAxis({ values, valuePosition = 'center', width = 369, sx }: ChartXAxisProps) {
  return (
    <Box
      data-spec="chart-x-axis"
      sx={[{ display: 'flex', justifyContent: 'space-evenly', gap: '10px', px: '10px', boxSizing: 'border-box', width, height: 22, borderTop: `1px solid ${chartAxisLine}` }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    >
      {values.map((v, i) => (
        <Box key={i} sx={{ width: 48, display: 'flex', justifyContent: valuePosition === 'center' ? 'center' : valuePosition === 'left' ? 'flex-start' : 'flex-end' }}>
          <ChartAxisValue align={`x-${valuePosition}`}>{v}</ChartAxisValue>
        </Box>
      ))}
    </Box>
  );
}

export interface ChartYAxisProps {
  /** Top-to-bottom order. */
  values: Array<string | number>;
  valuePosition?: 'middle' | 'top' | 'bottom';
  height?: number | string;
  width?: number | string;
  sx?: SxProps<Theme>;
}

export function ChartYAxis({ values, valuePosition = 'middle', height = 174, width = 60, sx }: ChartYAxisProps) {
  return (
    <Box
      data-spec="chart-y-axis"
      sx={[{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', boxSizing: 'border-box', width, height, borderRight: `1px solid ${chartAxisLine}` }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    >
      {values.map((v, i) => (
        <ChartAxisValue key={i} align={`y-${valuePosition}`}>{v}</ChartAxisValue>
      ))}
    </Box>
  );
}
