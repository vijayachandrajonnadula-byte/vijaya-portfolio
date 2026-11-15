/**
 * Electronic Execution, side surfaces: building blocks sized from the reference prototype (measured at 1440x900).
 * NOT FROM FIGMA. Plain buttons and boxes styled with the values in refTheme.ts (ref, actRef, fonts) and the weights in
 * theme/typography.ts (panelRole). Logged in docs/figma-deviations.md.
 */
import type { ReactNode } from 'react';
import { Box } from '../../../components/mui';
import type { SxProps, Theme } from '../../../components/mui';
import { Cancel01Icon } from '../../../icons';
import { panelRole } from '../../../theme/typography';
import { actRef, fonts, ref } from '../refTheme';
import { RefButton, focusRing } from '../shell/RefControls';

/** Text style from reference numbers: size px, weight, colour, line height px (omit for "normal"). */
export const tx = (size: number, weight: number, color: string, lh?: number) => ({ fontSize: size, fontWeight: weight, color, lineHeight: lh ? `${lh}px` : 'normal' });

export const W = panelRole;

/** Close (x) button of a header: 30x30, 6px padding, 18px glyph. */
export function Closer({ onClose, tone = 'plain', size = 18, box = 30, h }: { onClose: () => void; tone?: 'plain' | 'dark'; size?: number; box?: number; h?: number }) {
  return (
    <RefButton
      aria-label="Close"
      onClick={onClose}
      sx={{
        width: box, height: h ?? box, p: `${((h ?? box) - size) / 2}px ${(box - size) / 2}px`, boxSizing: 'border-box', borderRadius: '6px', justifyContent: 'center', flexShrink: 0,
        color: tone === 'dark' ? ref.white : ref.muted,
        '&:hover': tone === 'dark' ? { background: 'rgba(255,255,255,.18)' } : { background: ref.tint, color: ref.blue3 },
      }}
    >
      <Cancel01Icon size={size} />
    </RefButton>
  );
}

/** Panel header (reference .am-sec-head): title 14.5px/700, optional sub line 11px, close button. */
export function PanelHeader({ title, subtitle, onClose, dark }: { title: ReactNode; subtitle?: ReactNode; onClose: () => void; dark?: boolean }) {
  return (
    <Box data-spec="panel-head" sx={{ display: 'flex', alignItems: 'center', gap: '10px', p: '14px 18px', borderBottom: dark ? 0 : `1px solid ${ref.line}`, background: dark ? ref.navy : ref.white, flexShrink: 0, boxSizing: 'border-box' }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box data-spec="panel-title" sx={{ ...tx(14.5, W.strong, dark ? ref.white : ref.ink, 17.4), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</Box>
        {subtitle && <Box data-spec="panel-sub" sx={{ mt: '2px', ...tx(11, W.regular, dark ? actRef.annotationSub : ref.muted, 15.95) }}>{subtitle}</Box>}
      </Box>
      <Closer onClose={onClose} tone={dark ? 'dark' : 'plain'} />
    </Box>
  );
}

/** Panel footer (reference .am-sec-foot): 11/22 padding, tinted, buttons at the right. */
export function PanelFooter({ children, left }: { children: ReactNode; left?: ReactNode }) {
  return (
    <Box data-spec="panel-foot" sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '11px 22px', borderTop: `1px solid ${ref.line}`, background: ref.tint2, flexShrink: 0, boxSizing: 'border-box' }}>
      {left && <Box sx={{ flex: 1, minWidth: 0 }}>{left}</Box>}
      <Box sx={{ display: 'flex', gap: '8px', ml: left ? 0 : 'auto' }}>{children}</Box>
    </Box>
  );
}

/** Reference .btn: 26px tall, 5/10 padding, 11.5px/600, 6px radius, 1px line border. */
export function FootBtn({ children, onClick, disabled, primary, title }: { children: ReactNode; onClick?: () => void; disabled?: boolean; primary?: boolean; title?: string }) {
  return (
    <RefButton
      onClick={onClick}
      disabled={disabled}
      title={title}
      sx={{
        height: 26, p: '5px 10px', boxSizing: 'border-box', gap: '4px', justifyContent: 'center', borderRadius: '6px', ...tx(11.5, W.emphasis, primary ? ref.white : ref.ink),
        border: `1px solid ${primary ? ref.navy2 : ref.line}`, background: primary ? ref.navy2 : ref.white,
        '&:hover': { background: primary ? ref.blue3 : ref.bg },
      }}
    >
      {children}
    </RefButton>
  );
}

/** Section heading of a details tab (reference .dso-sec-h): 11px/800 blue, bottom rule. */
export function SecHead({ icon, children, first }: { icon?: ReactNode; children: ReactNode; first?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '0 0 8px', m: `${first ? 0 : 20}px 0 14px`, borderBottom: `1px solid ${ref.line}`, ...tx(11, W.heavy, ref.navy2, 15.95) }}>
      {icon && <Box sx={{ display: 'flex', width: 16, height: 16 }}>{icon}</Box>}
      {children}
    </Box>
  );
}

/** Key / value (reference .dso-kv): 10.5px/600 muted key over a 13px/700 value. */
export function KV({ k, v, mono, full }: { k: string; v: ReactNode; mono?: boolean; full?: boolean }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: full ? '1 / -1' : undefined, minWidth: 0 }}>
      <Box component="span" sx={tx(10.5, W.emphasis, ref.muted, 15.225)}>{k}</Box>
      <Box component="span" sx={{ ...tx(13, W.strong, ref.ink, 18.85), fontFamily: mono ? fonts.mono : undefined, overflowWrap: 'anywhere' }}>{v}</Box>
    </Box>
  );
}

/** Reference .ws-table: 1px line border, 8px radius, tinted 9.5px/800 header, 11.5px body cells. */
export const wsTable: SxProps<Theme> = {
  width: '100%', borderCollapse: 'separate', borderSpacing: 0, border: `1px solid ${ref.line}`, borderRadius: '8px', overflow: 'hidden',
  '& th': { p: '7px 10px', background: ref.tint2, borderBottom: `1px solid ${ref.line}`, textAlign: 'left', ...tx(9.5, W.heavy, ref.muted, 13.775) },
  '& td': { p: '7px 10px', background: ref.white, borderBottom: `1px solid ${ref.tint2}`, verticalAlign: 'middle', ...tx(11.5, W.regular, ref.ink, 16.675) },
  '& tr:last-of-type td': { borderBottom: 0 },
};

/** Round icon-less avatar with initials (picker rows). */
export function Av({ text, color, size = 26 }: { text: string; color: string; size?: number }) {
  return <Box aria-hidden sx={{ width: size, height: size, borderRadius: '50%', background: color, display: 'grid', placeItems: 'center', flexShrink: 0, ...tx(10, W.strong, ref.white, 14.5) }}>{text}</Box>;
}

export { focusRing };
