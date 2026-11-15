// Pulse "Charts & Cards" page: Building Blocks/Charts Legends (Variant Open | Stacked, Shape Round | Square).
// Marker 12px (round r=1000, square r=4) + textContent Meta Data. Stacked = overlapping markers (gap -4, 1px white stroke) + one label.
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { pt, textStyle } from '../../../theme/pulseTokens';
import { chartColors } from './ChartTheme';

export interface ChartLegendProps {
  label: string;
  /** Marker colour (open). Defaults to Brand. */
  color?: string;
  /** Marker colours for variant="stacked" (overlapping markers). */
  colors?: string[];
  variant?: 'open' | 'stacked';
  shape?: 'round' | 'square';
  sx?: SxProps<Theme>;
}

export function ChartLegend({ label, color = chartColors.brand, colors, variant = 'open', shape = 'round', sx }: ChartLegendProps) {
  const radius = shape === 'round' ? '1000px' : '4px';
  const stacked = variant === 'stacked';
  const list = stacked ? (colors ?? [chartColors.brand, chartColors.purple, chartColors.yellow, chartColors.blue, chartColors.green]) : [color];
  return (
    <Box data-spec="chart-legend" sx={[{ display: 'inline-flex', alignItems: 'center', gap: '4px' }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: stacked ? '-4px' : 0 }}>
        {list.map((c, i) => (
          <Box
            key={i}
            data-spec="chart-legend-marker"
            sx={{ width: 12, height: 12, boxSizing: 'border-box', borderRadius: radius, background: c, flexShrink: 0, ml: stacked && i > 0 ? '-4px' : 0, ...(stacked ? { boxShadow: '0 0 0 1px #fff' } : {}) }}
          />
        ))}
      </Box>
      <Box component="span" sx={{ ...textStyle('textS'), color: pt.formElements.content.metaDataTextColor, whiteSpace: 'nowrap' }}>{label}</Box>
    </Box>
  );
}
