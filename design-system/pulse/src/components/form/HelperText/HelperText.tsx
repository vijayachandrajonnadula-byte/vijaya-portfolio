import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { textStyle } from '../../../theme/pulseTokens';

/** Figma page "Helper Text" / set "Helper Text" (Variant = Error | Warning | Info | Success | Normal). */
export type HelperTextVariant = 'error' | 'warning' | 'info' | 'success' | 'normal';

export interface HelperTextProps {
  /** @default "normal" */
  variant?: HelperTextVariant;
  /** Leading 16px status glyph (hidden in the default Figma variants). */
  showIcon?: boolean;
  id?: string;
  children?: ReactNode;
}

/** textMetaData colour per variant, and the colour of the status glyph. */
const palette: Record<HelperTextVariant, { text: string; icon: string }> = {
  error: { text: '#dc2626', icon: '#df3327' },
  warning: { text: '#b45309', icon: '#ff9b37' },
  info: { text: '#2563eb', icon: '#2eb0cc' },
  success: { text: '#15803d', icon: '#479442' },
  normal: { text: '#5f6f86', icon: '#6b7178' },
};

/** Diamond glyph (the Figma icon is `diamond`, stroke / rounded). */
function Glyph({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 21 12 12 21 3 12Z" />
    </svg>
  );
}

/** Hint / validation message under a form control: row, 4px gap, 20px line, metadata text. */
export function HelperText({ variant = 'normal', showIcon, id, children }: HelperTextProps) {
  const c = palette[variant];
  return (
    <Box
      id={id}
      role={variant === 'error' ? 'alert' : undefined}
      data-variant={variant}
      sx={{ display: 'flex', alignItems: 'flex-start', gap: '4px', minHeight: 20, ...textStyle('textM'), color: c.text }}
    >
      {showIcon && (
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', height: 20, flex: '0 0 16px' }}>
          <Glyph color={c.icon} />
        </Box>
      )}
      <Box component="span" sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    </Box>
  );
}
