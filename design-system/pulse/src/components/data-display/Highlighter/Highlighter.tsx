// Figma: Data Grid page, `BuildingBlocks/comparison-highlighter`
// (Version Current/Previous x Color Variation x Indicator Dot/Line x Badge Size). Current = Blue, Previous = the other seven.
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

export type HighlighterColor = 'blue' | 'yellow' | 'red' | 'green' | 'orange' | 'brand' | 'gray' | 'purple';
export type HighlighterIndicator = 'dot' | 'line';
export type HighlighterBadgeSize = 'xsmall' | 'small' | 'medium' | 'large';

export interface HighlighterProps {
  /** @default "blue" */
  color?: HighlighterColor;
  /** @default "dot" */
  indicator?: HighlighterIndicator;
  /** Dot diameter (4/6/8/10). Only meaningful for `indicator="dot"`. @default "small" */
  badgeSize?: HighlighterBadgeSize;
  children?: ReactNode;
}

/** uiElements/dataComparison/color/<color>/{background,border}. */
export const highlighterColors: Record<HighlighterColor, { bg: string; border: string }> = {
  blue: { bg: '#eff6ff', border: '#1d4ed8' },
  yellow: { bg: '#fefce8', border: '#ca8a04' },
  red: { bg: '#fef2f2', border: '#b91c1c' },
  green: { bg: '#f0fdf4', border: '#15803d' },
  orange: { bg: '#fffbeb', border: '#b45309' },
  brand: { bg: '#eef3fb', border: '#152a4f' },
  gray: { bg: '#f1f5f9', border: '#334155' },
  purple: { bg: '#f5f3ff', border: '#6d28d9' },
};
const dot = { xsmall: 4, small: 6, medium: 8, large: 10 } as const;

/** Marks a value that differs between two compared versions: tinted 18px strip with a leading dot or 2px line. */
export function Highlighter({ color = 'blue', indicator = 'dot', badgeSize = 'small', children }: HighlighterProps) {
  const c = highlighterColors[color];
  const strip = (
    <Box
      component="mark"
      data-spec={`highlighter-${indicator}`}
      sx={{ display: 'inline-flex', alignItems: 'center', flex: '1 1 auto', minWidth: 0, height: 18, padding: 0, gap: '2px', borderRadius: '2px', background: c.bg, color: 'inherit', fontSize: 12, lineHeight: '18px', ...(indicator === 'line' ? { boxShadow: `inset 2px 0 0 ${c.border}`, paddingLeft: '7px' } : {}) }}
    >
      {children}
    </Box>
  );
  if (indicator === 'line') return strip;
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'stretch', gap: '2px' }}>
      <Box component="span" aria-hidden sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: dot[badgeSize] }}>
        <Box component="span" sx={{ width: dot[badgeSize], height: dot[badgeSize], borderRadius: '50%', background: c.border }} />
      </Box>
      {strip}
    </Box>
  );
}
