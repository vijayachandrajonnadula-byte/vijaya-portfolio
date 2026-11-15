// Figma: Backdrop page, set "Backdrop" (Opacity 30% | 50%).
import { forwardRef } from 'react';
import MuiBackdrop from '@mui/material/Backdrop';
import type { BackdropProps as MuiBackdropProps } from '@mui/material/Backdrop';

export interface BackdropProps extends Omit<MuiBackdropProps, 'invisible'> {
  /** Scrim strength: 30 = #0000004d, 50 = rgba(0,0,0,.5). @default 30 */
  opacity?: 30 | 50;
}

/** Backdrop (scrim) that dims the UI behind a modal or pop-up. */
export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(function Backdrop({ opacity = 30, sx, ...rest }, ref) {
  return (
    <MuiBackdrop
      ref={ref}
      sx={[{ background: opacity === 30 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)', zIndex: (t) => t.zIndex.modal - 1 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      {...rest}
    />
  );
});
Backdrop.displayName = 'Backdrop';
