/**
 * NOT FROM FIGMA. Small controls of the evidence surfaces, sized from the reference prototype (S\ref\overlays\spec.md):
 * the Pulse Button is 28px or taller, the reference .btn is 26px (small 21px), the filter chips are 22px pills, the square
 * icon buttons are 27 or 28px. Plain buttons styled with the values in refTheme.ts / evRef.ts, the same approach as the
 * panel and shell controls. Logged in docs/figma-deviations.md.
 */
import type { ReactNode } from 'react';
import { Box } from '../../../components/mui';
import type { SxProps, Theme } from '../../../components/mui';
import { panelRole } from '../../../theme/typography';
import { ref } from '../refTheme';
import { ev } from './evRef';

const focus = { '&:focus-visible': { outline: `2px solid ${ref.blue4}`, outlineOffset: 1 } } as const;
const arr = (sx?: SxProps<Theme>) => (Array.isArray(sx) ? sx : sx ? [sx] : []);

interface BaseProps {
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  title?: string;
  id?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: 'menu' | 'listbox' | 'dialog' | boolean;
  sx?: SxProps<Theme>;
}

/** Reference .btn: 26px, 11.5px/600, radius 6; `primary` is the blue one; `sm` is the 21px tool-setting button. */
export function EvBtn({ primary, sm, sx, children, ...rest }: BaseProps & { primary?: boolean; sm?: boolean }) {
  return (
    <Box
      component="button"
      type="button"
      {...rest}
      sx={[
        {
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', m: 0, boxSizing: 'border-box', cursor: 'pointer', fontFamily: ev.font, lineHeight: 'normal', whiteSpace: 'nowrap',
          p: sm ? '3px 8px' : '5px 10px', fontSize: sm ? 10.5 : 11.5, fontWeight: panelRole.emphasis, borderRadius: '6px',
          border: `1px solid ${primary ? ref.blue3 : ref.line}`, background: primary ? ref.blue3 : ref.white, color: primary ? ref.white : ref.ink,
          '&:hover:not(:disabled)': { background: primary ? ref.navy2 : ref.bg },
          '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
          ...focus,
        },
        ...arr(sx),
      ]}
    >
      {children}
    </Box>
  );
}

/** Reference .evx-chip: 22px pill, 11.5px/600; `on` is the filled navy one. */
export function EvChip({ on, sx, children, ...rest }: BaseProps & { on?: boolean }) {
  return (
    <Box
      component="button"
      type="button"
      aria-pressed={on}
      {...rest}
      sx={[
        {
          m: 0, boxSizing: 'border-box', cursor: 'pointer', fontFamily: ev.font, lineHeight: 'normal', whiteSpace: 'nowrap', p: '3px 10px', fontSize: 11.5, fontWeight: panelRole.emphasis, borderRadius: '14px',
          border: `1px solid ${on ? ref.navy2 : ref.line}`, background: on ? ref.navy2 : ref.white, color: on ? ref.white : ref.ink,
          '&:hover': { background: on ? ref.navy2 : ev.chipHover },
          ...focus,
        },
        ...arr(sx),
      ]}
    >
      {children}
    </Box>
  );
}

/** Square icon button (reference .sop-newtab 27px, .evx-fbtn 28px, .gal-close). */
export function EvSq({ size = 27, radius = 6, active, bare, sx, children, ...rest }: BaseProps & { size?: number; radius?: number; active?: boolean; bare?: boolean }) {
  return (
    <Box
      component="button"
      type="button"
      {...rest}
      sx={[
        {
          position: 'relative', display: 'grid', placeItems: 'center', width: size, height: size, p: 0, m: 0, boxSizing: 'border-box', flexShrink: 0, cursor: 'pointer', fontFamily: ev.font,
          borderRadius: `${radius}px`, border: bare ? '1px solid transparent' : `1px solid ${active ? ref.navy2 : ref.line}`, background: ref.white, color: active ? ref.navy2 : ref.muted,
          '&:hover:not(:disabled)': { background: bare ? ref.tint2 : ev.chipHover, color: ref.blue3 },
          '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
          ...focus,
        },
        ...arr(sx),
      ]}
    >
      {children}
    </Box>
  );
}

/** Reference .evx-vt: two 30x28 icon toggles in a 62px bordered pair (list / grid). */
export function EvViewToggle({ value, onChange, listIcon, gridIcon }: { value: 'list' | 'grid'; onChange: (v: 'list' | 'grid') => void; listIcon: ReactNode; gridIcon: ReactNode }) {
  const mk = (v: 'list' | 'grid', label: string, icon: ReactNode) => (
    <Box
      component="button"
      type="button"
      aria-label={label}
      aria-pressed={value === v}
      onClick={() => onChange(v)}
      sx={{ display: 'grid', placeItems: 'center', width: 30, height: 28, p: 0, m: 0, border: 0, cursor: 'pointer', background: value === v ? ref.navy2 : ref.white, color: value === v ? ref.white : ref.ink, ...focus }}
    >
      {icon}
    </Box>
  );
  return (
    <Box role="group" aria-label="View" sx={{ display: 'flex', boxSizing: 'border-box', border: `1px solid ${ref.line}`, borderRadius: '7px', overflow: 'hidden', flexShrink: 0 }}>
      {mk('list', 'List view', listIcon)}
      {mk('grid', 'Grid view', gridIcon)}
    </Box>
  );
}

/** Reference select: 29px tall, 6px radius, 1px line border. */
export function EvSelect({ value, onChange, options, label, width, sx }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; label: string; width?: number; sx?: SxProps<Theme> }) {
  return (
    <Box
      component="select"
      aria-label={label}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      sx={[
        { height: 29, width, p: '5px 8px', boxSizing: 'border-box', border: `1px solid ${ref.line}`, borderRadius: '6px', background: ref.white, color: ref.ink, fontFamily: ev.font, fontSize: 12, fontWeight: panelRole.regular, cursor: 'pointer', '&:focus': { outline: 'none', borderColor: ref.blue4 } },
        ...arr(sx),
      ]}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Box>
  );
}

/** Scrollbar of the reference lists (7px, thumb #C8D2E5). */
export const thinScroll = {
  '&::-webkit-scrollbar': { width: 7, height: 7 },
  '&::-webkit-scrollbar-thumb': { background: ev.thumb, borderRadius: '3px' },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
} as const;
