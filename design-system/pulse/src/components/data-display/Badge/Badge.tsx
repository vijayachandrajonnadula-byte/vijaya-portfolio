// Figma: Badge page, set "Badge" (Variant Dot|Stroke|Standard x Size x Color incl. AI/Custom).
import { fw } from '../../../theme/typography';
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { pt } from '../../../theme/pulseTokens';

export type BadgeColor =
  | 'blue' | 'brand' | 'complementary' | 'dark_gray' | 'gray' | 'green' | 'orange' | 'red'
  | 'yellow' | 'black' | 'ai' | 'purple' | 'cyan' | 'teal' | 'custom';
export type BadgeSize = 'xsmall' | 'small' | 'medium' | 'large';

export interface BadgeProps {
  /** dot: status dot. standard: filled counter pill. stroke: outlined counter pill. @default "standard" */
  variant?: 'dot' | 'stroke' | 'standard';
  /** @default "red" */
  color?: BadgeColor;
  /** Dot diameter: xsmall 4, small 6, medium 8, large 10. Ignored by stroke/standard (always 16px high). @default "medium" */
  size?: BadgeSize;
  /** Text of stroke/standard badges. */
  badgeContent?: ReactNode;
  /** Any CSS colour for `color="custom"` (Figma sample: #eb0cff). */
  customColor?: string;
  /** Wrap an element and pin the badge to its top-right corner. */
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

const b = pt.uiElements.badges.color;
const colors: Record<Exclude<BadgeColor, 'custom'>, string> = {
  blue: b.blue, brand: b.brand, complementary: b.complementary, dark_gray: b.gray, gray: b.lightGray, green: b.green,
  orange: b.orange, red: b.red, yellow: b.yellow, black: b.black, purple: b.purple, cyan: b.cyan, teal: b.teal,
  // Figma Badge Color=AI is a solid #1e293b (same as Black), not a gradient.
  ai: '#1e293b',
};
const dotPx: Record<BadgeSize, number> = { xsmall: 4, small: 6, medium: 8, large: 10 };

/** Badge: dot, or 16px-high counter pill (Standard = filled, Stroke = white with coloured outline). */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'standard', color = 'red', size = 'medium', badgeContent, customColor, children, sx },
  ref,
) {
  const paint = color === 'custom' ? (customColor ?? '#eb0cff') : colors[color];
  const gradient = paint.startsWith('linear-gradient');
  const dot = variant === 'dot';
  const px = dotPx[size];
  const stroke = variant === 'stroke';
  const el = (
    <Box
      ref={ref}
      component="span"
      sx={[
        dot
          ? { display: 'inline-block', width: px, height: px, borderRadius: '50%', flexShrink: 0, background: paint }
          : {
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              minWidth: 16,
              height: 16,
              px: '4px',
              borderRadius: '1000px',
              fontFamily: 'Figtree, Inter Variable, sans-serif',
              fontSize: 12,
              lineHeight: '18px',
              fontWeight: fw.medium,
              textAlign: 'center',
              background: stroke ? '#ffffff' : paint,
              color: stroke ? (gradient ? '#653fda' : paint) : '#ffffff',
              // Figma stroke sits OUTSIDE the 16px box.
              ...(stroke ? { boxShadow: `0 0 0 1px ${gradient ? '#653fda' : paint}` } : {}),
            },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {dot ? null : badgeContent}
    </Box>
  );
  if (children == null) return el;
  return (
    <Box component="span" sx={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      <Box component="span" sx={{ position: 'absolute', top: 0, right: 0, transform: 'translate(50%, -50%)', display: 'inline-flex' }}>{el}</Box>
    </Box>
  );
});
Badge.displayName = 'Badge';

