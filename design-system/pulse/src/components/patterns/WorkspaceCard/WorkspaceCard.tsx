/**
 * Figma page "Workspace Card": set "Workspace Card" (Color x Interaction = Default | Hover), 420x218.
 * Outer card r=8 with a 4px top accent border (colour variants), inner Content with 1px #e2e8f0 border,
 * Body (pad 16/24) + Footer (60px, pad 12/24, top divider). Hover adds drop(0,2,16,0,#0000001a) = pt.shadow.shadowSxl.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { pt } from '../../../theme/pulseTokens';

export type WorkspaceCardColor = 'none' | 'gray' | 'darkGray' | 'brand' | 'green' | 'red' | 'cyan' | 'teal' | 'orange' | 'purple' | 'blue';

/** pt.uiElements.workspaceCard has no entry in the designkit snapshot, so these are the values in the spec (variables uiElements/workspaceCard/*Border). */
const accent: Record<WorkspaceCardColor, string | null> = {
  none: null,
  gray: '#cbd5e1',
  darkGray: '#566680',
  brand: '#1e3a6e',
  green: '#22c55e',
  red: '#ef4444',
  cyan: '#06b6d4',
  teal: '#14b8a6',
  orange: '#f59e0b',
  purple: '#8b5cf6',
  blue: '#3b82f6',
};
const defaultBorder = pt.colors.neutral[200];

export interface WorkspaceCardProps {
  /** Top accent colour. @default "none" */
  color?: WorkspaceCardColor;
  children?: ReactNode;
  footer?: ReactNode;
  /** Makes the card a button and enables the hover shadow. */
  onClick?: () => void;
  /** Force the hover look (for documentation). */
  hover?: boolean;
  /** @default 420 */
  width?: number | string;
  sx?: SxProps<Theme>;
}

export function WorkspaceCard({ color = 'none', children, footer, onClick, hover, width = 420, sx }: WorkspaceCardProps) {
  const top = accent[color];
  const hoverShadow = pt.shadow.shadowSxl;
  return (
    <Box
      data-spec={`workspace-card ${color}`}
      {...(onClick ? { component: 'button' as const, type: 'button' as const, onClick } : {})}
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          width,
          p: 0,
          m: 0,
          font: 'inherit',
          textAlign: 'left',
          bgcolor: '#fff',
          borderRadius: pt.radius.m,
          overflow: 'hidden',
          position: 'relative',
          // Content: 1px #e2e8f0 stroke INSIDE; colour variants add a 4px top stroke INSIDE (drawn over it, no layout shift)
          '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', border: `1px solid ${defaultBorder}`, borderTop: top ? `4px solid ${top}` : undefined, pointerEvents: 'none' },
          cursor: onClick ? 'pointer' : 'default',
          boxShadow: hover ? hoverShadow : 'none',
          transition: 'box-shadow 150ms',
          '&:hover': { boxShadow: hoverShadow },
          '&:focus-visible': { outline: 'none', boxShadow: pt.shadow.focusStyle_1 },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ] as SxProps<Theme>}
    >
      <Box sx={{ flex: 1, minHeight: 158, boxSizing: 'border-box', px: '24px', py: '16px', borderBottom: footer ? `1px solid ${defaultBorder}` : undefined, display: 'flex', flexDirection: 'column', gap: '8px' }}>{children}</Box>
      {footer && <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: 60, px: '24px', py: '12px', boxSizing: 'border-box' }}>{footer}</Box>}
    </Box>
  );
}

