// Figma page "Button", set adornmentButton: Pulse's CloseButton (square icon button with a close glyph).
import { forwardRef } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { IconButton } from '../IconButton/IconButton';
import type { IconButtonProps } from '../IconButton/IconButton';

export interface CloseButtonProps extends Omit<IconButtonProps, 'children' | 'ariaLabel'> {
  ariaLabel?: string;
}

/** Plain square icon button with a close glyph (Pulse CloseButton). */
export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(function CloseButton(
  { ariaLabel = 'Close', size = 'small', ...rest },
  ref,
) {
  return (
    <IconButton ref={ref} ariaLabel={ariaLabel} size={size} {...rest}>
      <CloseRounded />
    </IconButton>
  );
});
CloseButton.displayName = 'CloseButton';


