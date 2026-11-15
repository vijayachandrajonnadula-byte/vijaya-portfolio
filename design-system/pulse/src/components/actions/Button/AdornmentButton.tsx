// Figma: Button page, set "adornmentButton" (Size XXS|XS|S x Variant Light|Dark x Interaction x Shape Circle|Square).
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { focusRing, num, pt } from '../../../theme/pulseTokens';

export type AdornmentButtonSize = 'xxs' | 'xs' | 's';

export interface AdornmentButtonProps extends Omit<ButtonBaseProps, 'children' | 'size'> {
  /** @default "xxs" */
  size?: AdornmentButtonSize;
  /** dark: dark glyph + black hover tint (for light surfaces). light: white glyph + white tint. @default "dark" */
  variant?: 'light' | 'dark';
  /** @default "circle" */
  shape?: 'circle' | 'square';
  /** Replaces the default "cancel" glyph. */
  icon?: ReactNode;
}

const box = { xxs: 18, xs: 20, s: 22 } as const;
const glyph = { xxs: 14, xs: 16, s: 18 } as const;
const c = pt.uiElements.closeButton.color;

/** Small icon button used inside chips, tags, popovers and tooltips (default glyph: cancel). */
export const AdornmentButton = forwardRef<HTMLButtonElement, AdornmentButtonProps>(function AdornmentButton(
  { size = 'xxs', variant = 'dark', shape = 'circle', icon, sx, ...rest },
  ref,
) {
  const g = glyph[size];
  return (
    <ButtonBase
      ref={ref}
      aria-label="Close"
      sx={[
        {
          boxSizing: 'border-box',
          width: box[size],
          height: box[size],
          padding: `${num(pt.uiElements.closeButton.padding)}px`,
          flexShrink: 0,
          borderRadius: shape === 'circle' ? '1000px' : '4px',
          color: variant === 'dark' ? c.darkIcon : c.lightIcon,
          '& svg': { width: g, height: g, fontSize: g },
          '&:hover': { background: variant === 'dark' ? '#00000012' : '#ffffff1a' },
          '&.Mui-focusVisible': { boxShadow: focusRing },
          '&.Mui-disabled': { opacity: 0.38 },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...rest}
    >
      {icon ?? <CloseRounded />}
    </ButtonBase>
  );
});
AdornmentButton.displayName = 'AdornmentButton';

