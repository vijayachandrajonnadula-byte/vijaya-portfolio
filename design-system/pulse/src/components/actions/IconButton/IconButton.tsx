// Figma: Button page, set "IconButton" (Size x Shape x Variant x Interaction incl. Active x Color incl. AI).
import { forwardRef } from 'react';
import type { ElementType, MouseEventHandler, ReactNode } from 'react';
import MuiButton from '@mui/material/Button';
import type { SxProps, Theme } from '@mui/material/styles';
import { pulseButton } from '../../../theme/buttonTokens';
import type { ButtonSizeKey } from '../../../theme/buttonTokens';

export interface IconButtonProps {
  /** Accessible name. Required: the button has no visible text. */
  ariaLabel: string;
  children: ReactNode;
  /** plain = text variant (no fill, no border). @default "plain" */
  variant?: 'plain' | 'outlined' | 'contained';
  /** @default "primary" */
  color?: 'primary' | 'error' | 'success' | 'warning' | 'ai';
  /** @default "medium" */
  size?: ButtonSizeKey;
  /** @default "square" */
  shape?: 'square' | 'circle';
  /** Figma Interaction=Active: pressed/selected look. Only defined for variant plain (1px tinted border; AI has no border). */
  active?: boolean;
  /** Shows the dot badge at the top right (Figma hidden "Border/Badge" layer). true = green. */
  badge?: boolean | string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  href?: string;
  target?: string;
  rel?: string;
  component?: ElementType;
  sx?: SxProps<Theme>;
}

/**
 * Icon-only button. It is the pulse-2.0 Button (same colours, states and focus ring) squared off:
 * width = height of the matching Button size, glyph size from pt.uiElements.iconButton.iconSize.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { ariaLabel, children, variant = 'plain', color = 'primary', size = 'medium', shape = 'square', active, badge, sx, ...rest },
  ref,
) {
  const s = pulseButton.size[size];
  const dot = { xsmall: 4, small: 6, medium: 8, large: 8, xlarge: 10 }[size];
  // Figma Border frame (dot + 1px ring) is absolutely placed: top = right inset per size.
  const inset = { xsmall: 4, small: 6, medium: 8, large: 8, xlarge: 8 }[size];
  const activeBorder = { primary: '#b5c9e7', error: '#fecaca', success: '#bbf7d0', warning: '#fde68a' }[color as 'primary'] ?? 'transparent';
  const glyph = s.iconSize[variant === 'plain' ? 'text' : variant];
  return (
    <MuiButton
      ref={ref}
      aria-label={ariaLabel}
      variant={variant === 'plain' ? 'text' : variant}
      color={color}
      size={size}
      sx={[
        {
          width: s.height,
          minWidth: s.height,
          padding: 0,
          borderRadius: shape === 'circle' ? '50%' : `${s.radius}px`,
          '& svg': { width: glyph, height: glyph, fontSize: glyph },
          position: 'relative',
          ...(active && variant === 'plain'
            ? { boxShadow: `inset 0 0 0 1px ${activeBorder}`, background: color === 'ai' ? 'transparent' : 'rgba(255,255,255,0.03)', '&:hover': { boxShadow: `inset 0 0 0 1px ${activeBorder}` } }
            : {}),
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...rest}
    >
      {children}
      {badge && (
        <span
          data-slot="badge"
          style={{ position: 'absolute', top: inset, right: inset, width: dot + 2, height: dot + 2, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ width: dot, height: dot, borderRadius: '50%', background: typeof badge === 'string' ? badge : '#22c55e' }} />
        </span>
      )}
    </MuiButton>
  );
});
IconButton.displayName = 'IconButton';



