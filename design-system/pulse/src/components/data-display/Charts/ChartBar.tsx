// Pulse "Charts & Cards" page: .Building Blocks/ Charts Bar (Size S 8 | M 12 | L 16 | XL 24 px thick, Orientation Vertical | Horizontal;
// default length 95px, fill Brand, radius 0).
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { chartColors } from './ChartTheme';

export type ChartBarSize = 's' | 'm' | 'l' | 'xl';
const thickness: Record<ChartBarSize, number> = { s: 8, m: 12, l: 16, xl: 24 };

export interface ChartBarProps {
  size?: ChartBarSize;
  orientation?: 'vertical' | 'horizontal';
  /** Bar length in px (Figma default 95). */
  length?: number;
  color?: string;
  sx?: SxProps<Theme>;
}

export function ChartBar({ size = 's', orientation = 'vertical', length = 95, color = chartColors.brand, sx }: ChartBarProps) {
  const t = thickness[size];
  const vertical = orientation === 'vertical';
  return (
    <Box
      data-spec="chart-bar"
      sx={[{ width: vertical ? t : length, height: vertical ? length : t, background: color, flexShrink: 0 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    />
  );
}
