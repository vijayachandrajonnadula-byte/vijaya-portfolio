// Figma: Button page, sets "ButtonGroup" (split button) and the grouping used around Button/IconButton.
import { forwardRef } from 'react';
import type { MouseEventHandler, ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import { pulseButton } from '../../../theme/buttonTokens';
import type { ButtonSizeKey } from '../../../theme/buttonTokens';
import { Button } from './Button';
import { IconButton } from '../IconButton/IconButton';

export interface ButtonGroupProps {
  /** Label of the main (left) button. */
  children: ReactNode;
  /** primary = contained, secondary = outlined. @default "primary" */
  variant?: 'primary' | 'secondary';
  /** @default "medium" */
  size?: ButtonSizeKey;
  /** Glyph of the attached (right) icon button. @default a chevron-down */
  icon?: ReactNode;
  startIcon?: ReactNode;
  iconLabel?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onIconClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * Split button: a Button with an attached square IconButton (Figma ButtonGroup, Variant=Primary|Secondary).
 * Radii are r/0/0/r and 0/r/r/0; the primary group separates the two halves with a 20% white hairline.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { children, variant = 'primary', size = 'medium', icon, startIcon, iconLabel = 'More options', onClick, onIconClick, disabled, sx },
  ref,
) {
  const r = pulseButton.size[size].radius;
  const primary = variant === 'primary';
  const v = primary ? 'contained' : 'outlined';
  return (
    <Box ref={ref} role="group" sx={[{ display: 'inline-flex' }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      <Button
        variant={v}
        size={size}
        disabled={disabled}
        onClick={onClick}
        startIcon={startIcon}
        sx={{ borderRadius: `${r}px 0 0 ${r}px`, ...(primary ? { borderRight: '1px solid rgba(255,255,255,0.2)' } : {}) }}
      >
        {children}
      </Button>
      <IconButton
        ariaLabel={iconLabel}
        variant={v}
        size={size}
        disabled={disabled}
        onClick={onIconClick}
        sx={{ borderRadius: `0 ${r}px ${r}px 0`, ...(primary ? {} : { borderLeftWidth: 0 }) }}
      >
        {icon ?? <KeyboardArrowDownRounded />}
      </IconButton>
    </Box>
  );
});
ButtonGroup.displayName = 'ButtonGroup';

export interface StyledButtonGroupProps {
  /** Buttons / IconButtons to join. Give them all the same variant and size. */
  children: ReactNode;
  /** Outer radius of the group in px. @default 4 */
  radius?: number;
  sx?: SxProps<Theme>;
}

/** Joins any row of Pulse buttons: only the outer corners stay rounded, outlined neighbours share a border. */
export const StyledButtonGroup = forwardRef<HTMLDivElement, StyledButtonGroupProps>(function StyledButtonGroup(
  { children, radius = 4, sx },
  ref,
) {
  return (
    <Box
      ref={ref}
      role="group"
      sx={[
        {
          display: 'inline-flex',
          '& > *': { borderRadius: 0 },
          '& > *:not(:first-of-type)': { marginLeft: '-1px' },
          '& > *:first-of-type': { borderTopLeftRadius: radius, borderBottomLeftRadius: radius },
          '& > *:last-of-type': { borderTopRightRadius: radius, borderBottomRightRadius: radius },
          '& > *:hover, & > *:focus-visible': { zIndex: 1 },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Box>
  );
});
StyledButtonGroup.displayName = 'StyledButtonGroup';
