import type { ReactNode } from 'react';
import { Box } from '../../../components/mui';
import type { SxProps, Theme } from '../../../components/mui';
import { refRole } from '../../../theme/typography';
import { ref } from '../refTheme';

/**
 * NOT FROM FIGMA. Small controls of the Electronic Execution page shell, sized from the reference prototype
 * (the Pulse Button / ToggleButtonGroup are 28 to 32px tall, the reference shell controls are 22 to 30px).
 * They are plain buttons styled with the reference values in refTheme.ts. Logged in docs/figma-deviations.md.
 */

/** Visually hidden text (live regions, labels). */
export const srOnly: SxProps<Theme> = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
  p: 0,
  m: '-1px',
};

export const focusRing = { '&:focus-visible': { outline: `2px solid ${ref.blue4}`, outlineOffset: 1 } } as const;

export interface RefSegmentedProps<V extends string> {
  value: V;
  options: { value: V; label: string }[];
  onChange: (v: V) => void;
  ariaLabel: string;
}

/** Two or more text buttons on a blue gradient track; the active one is a white chip (reference .mode-toggle). */
export function RefSegmented<V extends string>({ value, options, onChange, ariaLabel }: RefSegmentedProps<V>) {
  return (
    <Box
      role="group"
      aria-label={ariaLabel}
      sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, background: `linear-gradient(135deg, ${ref.navy2}, ${ref.blue3})`, borderRadius: '8px', p: '3px' }}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Box
            key={o.value}
            component="button"
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            sx={{
              border: 0,
              m: 0,
              cursor: 'pointer',
              fontFamily: 'inherit',
              p: '4px 10px',
              borderRadius: '5px',
              fontSize: 11,
              fontWeight: refRole.shellStrong,
              background: on ? ref.white : 'transparent',
              color: on ? ref.navy2 : ref.tint,
              whiteSpace: 'nowrap',
              ...focusRing,
            }}
          >
            {o.label}
          </Box>
        );
      })}
    </Box>
  );
}

/** Bar button of the media bar / toolbar (white or grey, text 11 to 11.5px). */
export function RefButton({
  children,
  sx,
  ...rest
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  title?: string;
  'aria-label'?: string;
  'aria-haspopup'?: 'menu' | 'listbox' | boolean;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  id?: string;
}) {
  return (
    <Box
      component="button"
      type="button"
      {...rest}
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          border: 0,
          m: 0,
          p: 0,
          fontFamily: 'inherit',
          cursor: 'pointer',
          background: 'transparent',
          color: ref.ink,
          '&:disabled': { cursor: 'not-allowed', opacity: 0.5 },
          ...focusRing,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Box>
  );
}
