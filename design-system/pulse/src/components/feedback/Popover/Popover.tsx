// Figma: Popover page, set "popOver" (style Outline|Filled x 12 arrow positions).
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import MuiPopover from '@mui/material/Popover';
import type { PopoverProps as MuiPopoverProps } from '@mui/material/Popover';
import type { SxProps, Theme } from '@mui/material/styles';
import { AdornmentButton } from '../../actions/Button/AdornmentButton';
import { BUBBLE_BORDER, BUBBLE_FILLED, BubbleArrow } from './Arrow';
import type { ArrowPosition, BubbleStyle } from './Arrow';
import { textStyle } from '../../../theme/pulseTokens';

export type { ArrowPosition } from './Arrow';

export interface PopoverContentProps {
  /** @default "outline" */
  variant?: BubbleStyle;
  /** @default "none" */
  arrow?: ArrowPosition;
  title?: ReactNode;
  /** Body paragraph. */
  children?: ReactNode;
  /** Shows the close adornment button in the header row. */
  onClose?: () => void;
  /** Action row: link on the left, buttons on the right (Figma "Action Row"). */
  actions?: ReactNode;
  sx?: SxProps<Theme>;
}

/** The popover panel itself (320 wide, 8px padding, 4px radius, soft shadow). Use directly for inline docs, or via <Popover>. */
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  { variant = 'outline', arrow = 'none', title, children, onClose, actions, sx },
  ref,
) {
  const filled = variant === 'filled';
  return (
    <Box
      ref={ref}
      data-spec={`popover ${variant}`}
      sx={[
        {
          position: 'relative',
          boxSizing: 'border-box',
          width: 320,
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          p: '8px',
          borderRadius: '4px',
          background: filled ? BUBBLE_FILLED : '#fff',
          color: filled ? '#fff' : '#212324',
          boxShadow: filled ? '0 2px 8px rgba(0,0,0,0.2)' : `inset 0 0 0 1px ${BUBBLE_BORDER}, 0 2px 8px rgba(0,0,0,0.2)`,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box sx={{ display: 'flex', gap: '4px', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {title && <Box sx={{ ...textStyle('textS', 'semiBold'), color: filled ? '#fff' : '#1e293b' }}>{title}</Box>}
          {children && <Box sx={{ ...textStyle('textS', 'regular') }}>{children}</Box>}
        </Box>
        {onClose && <AdornmentButton size="xxs" shape="square" variant={filled ? 'light' : 'dark'} onClick={onClose} aria-label="Close popover" />}
      </Box>
      {actions && <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'space-between' }}>{actions}</Box>}
      <BubbleArrow position={arrow} bubble={variant} />
    </Box>
  );
});
PopoverContent.displayName = 'PopoverContent';

export interface PopoverProps extends Omit<MuiPopoverProps, 'children' | 'title'> {
  /** @default "outline" */
  variant?: BubbleStyle;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  /** Adds the close button; defaults to `onClose` when true. */
  showClose?: boolean;
}

/** Popover: MUI Popover (positioning, focus, dismissal) with the Pulse panel inside. */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  { variant = 'outline', title, children, actions, showClose, onClose, slotProps, ...rest },
  ref,
) {
  return (
    <MuiPopover
      ref={ref}
      onClose={onClose}
      slotProps={{ ...slotProps, paper: { sx: { background: 'transparent', boxShadow: 'none', overflow: 'visible', mt: '8px' } } }}
      {...rest}
    >
      <PopoverContent variant={variant} title={title} actions={actions} onClose={showClose ? () => onClose?.({}, 'backdropClick') : undefined}>
        {children}
      </PopoverContent>
    </MuiPopover>
  );
});
Popover.displayName = 'Popover';

