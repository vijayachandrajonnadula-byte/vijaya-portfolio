// Pulse "Charts & Cards" page: .Building Blocks/Charts Interactive Nods (Color Brand | Color 2..6 | Purple | Cyan | Teal).
// 8px circle with a 1px white outside stroke. Colour mapping read from the Figma fills.
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { chartColors } from './ChartTheme';

export type ChartNodeColor = 'brand' | 'color2' | 'color3' | 'color4' | 'color5' | 'color6' | 'purple' | 'cyan' | 'teal';

export const chartNodeColors: Record<ChartNodeColor, string> = {
  brand: chartColors.brand,
  color2: chartColors.green,
  color3: chartColors.yellow,
  color4: chartColors.blue,
  color5: chartColors.orange,
  color6: chartColors.red,
  purple: chartColors.purple,
  cyan: chartColors.cyan,
  teal: chartColors.teal,
};

export interface ChartInteractiveNodeProps {
  color?: ChartNodeColor;
  sx?: SxProps<Theme>;
}

export function ChartInteractiveNode({ color = 'brand', sx }: ChartInteractiveNodeProps) {
  return (
    <Box
      data-spec="chart-node"
      sx={[{ width: 8, height: 8, borderRadius: '1000px', background: chartNodeColors[color], boxShadow: '0 0 0 1px #fff', flexShrink: 0 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    />
  );
}
