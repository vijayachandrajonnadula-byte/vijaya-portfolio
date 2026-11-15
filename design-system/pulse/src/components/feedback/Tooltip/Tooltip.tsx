// Figma: Tooltip page, set "toolTip" (style Outline|Filled x Type Single|Multi Line x 12 arrow positions).
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import MuiTooltip from '@mui/material/Tooltip';
import type { TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip';
import { BUBBLE_BORDER, BUBBLE_FILLED, BubbleArrow } from '../Popover/Arrow';
import type { ArrowPosition, BubbleStyle } from '../Popover/Arrow';
import { textStyle } from '../../../theme/pulseTokens';

export type { ArrowPosition } from '../Popover/Arrow';

export interface TooltipContentProps {
  /** @default "filled" */
  variant?: BubbleStyle;
  /** Bold first line of a multi-line tooltip. */
  heading?: ReactNode;
  children: ReactNode;
  /** @default "none" */
  arrow?: ArrowPosition;
}

/** Static tooltip bubble (single line: 2/8 padding; with `heading`: 8px padding, 320 wide). */
export function TooltipContent({ variant = 'filled', heading, children, arrow = 'none' }: TooltipContentProps) {
  const filled = variant === 'filled';
  const multi = heading != null;
  return (
    <Box
      data-spec={`tooltip ${variant}`}
      sx={{
        position: 'relative',
        display: 'inline-block',
        boxSizing: 'border-box',
        minWidth: 24,
        maxWidth: 320,
        ...(multi ? { width: 320, p: '8px' } : { py: '2px', px: '8px' }),
        borderRadius: '4px',
        background: filled ? BUBBLE_FILLED : '#fff',
        color: filled ? '#fff' : '#1e293b',
        boxShadow: filled ? 'none' : `inset 0 0 0 1px ${BUBBLE_BORDER}`,
        ...textStyle('textS', 'regular'),
      }}
    >
      {multi && <Box sx={{ ...textStyle('textS', 'semiBold'), mb: '4px' }}>{heading}</Box>}
      {children}
      <BubbleArrow position={arrow} bubble={variant} />
    </Box>
  );
}

export interface TooltipProps extends Omit<MuiTooltipProps, 'title' | 'variant'> {
  title: ReactNode;
  /** Bold first line (switches to the multi-line layout). */
  heading?: ReactNode;
  /** @default "filled" */
  variant?: BubbleStyle;
}

/** Tooltip: MUI Tooltip (hover/focus/touch behaviour, placement) with the Pulse bubble and arrow. */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { title, heading, variant = 'filled', arrow = true, slotProps, children, ...rest },
  ref,
) {
  const filled = variant === 'filled';
  const bg = filled ? BUBBLE_FILLED : '#fff';
  return (
    <MuiTooltip
      ref={ref}
      arrow={arrow}
      title={
        heading != null ? (
          <>
            <Box sx={{ ...textStyle('textS', 'semiBold'), mb: '4px' }}>{heading}</Box>
            {title}
          </>
        ) : (
          title
        )
      }
      slotProps={{
        ...slotProps,
        tooltip: {
          sx: {
            m: '6px !important',
            boxSizing: 'border-box',
            minWidth: 24,
            maxWidth: 320,
            ...(heading != null ? { p: '8px' } : { py: '2px', px: '8px' }),
            borderRadius: '4px',
            background: bg,
            color: filled ? '#fff' : '#1e293b',
            border: filled ? 0 : `1px solid ${BUBBLE_BORDER}`,
            boxShadow: 'none',
            ...textStyle('textS', 'regular'),
          },
        },
        arrow: { sx: { color: bg, '&::before': { boxSizing: 'border-box', ...(filled ? {} : { border: `1px solid ${BUBBLE_BORDER}` }) } } },
      }}
      {...rest}
    >
      {children}
    </MuiTooltip>
  );
});
Tooltip.displayName = 'Tooltip';


