// Pulse "Region (Card Region)" page: cards, Shape (Square | Rectangle) x Radius (0 | 8 | 16).
// Spec: white fill (uiElements/region/Color/backgroundColor), drop shadow 0 2 4 0 #00000033, no stroke.
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { pt } from '../../../theme/pulseTokens';

export interface RegionProps {
  /** Corner radius: 0 / 8 / 16 (pt.uiElements.cardRegion.radius). @default "medium" */
  radius?: 'none' | 'xs' | 'medium' | 'xxxlarge';
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

/** Container surface (card region). */
export function Region({ radius = 'medium', children, sx }: RegionProps) {
  return (
    <Box
      data-spec={`region radius ${radius}`}
      sx={[
        {
          background: pt.colors.base.white,
          borderRadius: pt.uiElements.cardRegion.radius[radius],
          boxSizing: 'border-box',
          boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.2)',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Box>
  );
}
