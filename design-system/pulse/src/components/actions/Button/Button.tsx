import { forwardRef } from 'react';
import MuiButton from '@mui/material/Button';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { BUTTON_LABEL_CLASS } from '../../../theme/buttonStyles';

export type ButtonProps = MuiButtonProps;

/**
 * Design-system Button (pulse-2.0 "Button" component set).
 *
 * - variant: "contained" | "outlined" | "text"
 * - color:   "primary" | "error" | "success" | "warning" | "ai"
 * - size:    "xsmall" | "small" | "medium" | "large" | "xlarge"
 * - Interaction states (hover, focus-visible, disabled) are handled by the theme.
 * - Left/right icons: use `startIcon` / `endIcon`. Icon-only buttons must pass `aria-label`.
 *
 * A thin wrapper over MUI Button: all MUI props are forwarded. The only addition is a label
 * wrapper, which the "ai" colour needs to paint its gradient text.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'contained', color = 'primary', size = 'medium', children, ...props },
  ref,
) {
  return (
    <MuiButton ref={ref} variant={variant} color={color} size={size} {...props}>
      {children != null && children !== false ? <span className={BUTTON_LABEL_CLASS}>{children}</span> : null}
    </MuiButton>
  );
});

Button.displayName = 'Button';
