/**
 * NOT FROM FIGMA. Building blocks of the Electronic Execution execution panel, sized from the reference prototype
 * (measured at 1440x900). Colours come from refTheme.ts, weights from panelRole. Logged in docs/figma-deviations.md.
 */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { Box } from '../../../components/mui';
import type { SxProps, Theme } from '../../../components/mui';
import { panelRole } from '../../../theme/typography';
import { panelRef, ref } from '../refTheme';

export type PanelVariant = 'stack' | 'row' | 'grid';

/* ---------- icons (stroke, 24 viewBox) ---------- */

export function Svg({ size, children, sw = 2, style }: { size: number; children: ReactNode; sw?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...style }} aria-hidden>
      {children}
    </svg>
  );
}

export const icons = {
  check: (s = 10) => (
    <Svg size={s} sw={2.4}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </Svg>
  ),
  clock: (s = 10) => (
    <Svg size={s} sw={2.4}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Svg>
  ),
  edit: (s = 10) => (
    <Svg size={s} sw={2.4}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Svg>
  ),
  upload: (s = 10) => (
    <Svg size={s} sw={2.4}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </Svg>
  ),
  pencil: (s = 11) => (
    <Svg size={s} sw={2.4}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </Svg>
  ),
  tick: (s = 11) => (
    <Svg size={s} sw={3}>
      <polyline points="20 6 9 17 4 12" />
    </Svg>
  ),
  qr: (s = 14) => (
    <Svg size={s} sw={2}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M21 14v.01M14 21h.01M21 21v.01M17.5 21H21v-3" />
    </Svg>
  ),
  dots: (s = 14) => (
    <Svg size={s} sw={2.6}>
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </Svg>
  ),
  x: (s = 11) => (
    <Svg size={s} sw={2.4}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  ),
  chevDown: (s = 11) => (
    <Svg size={s} sw={2.4}>
      <polyline points="6 9 12 15 18 9" />
    </Svg>
  ),
  collapse: (s = 12) => (
    <Svg size={s} sw={2.2}>
      <polyline points="15 18 9 12 15 6" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </Svg>
  ),
  dockGlyph: (side: 'left' | 'right' | 'top' | 'bottom' | 'full', s = 15) => (
    <Svg size={s} sw={1.9}>
      {side === 'full' ? (
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
      ) : (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          {side === 'left' && <line x1="8" y1="3" x2="8" y2="21" />}
          {side === 'right' && <line x1="16" y1="3" x2="16" y2="21" />}
          {side === 'top' && <line x1="3" y1="8" x2="21" y2="8" />}
          {side === 'bottom' && <line x1="3" y1="16" x2="21" y2="16" />}
        </>
      )}
    </Svg>
  ),
};

/* ---------- popover state ---------- */

export function usePopover(): { open: boolean; setOpen: (v: boolean) => void; ref: RefObject<HTMLDivElement | null> } {
  const [open, setOpen] = useState(false);
  const r = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      if (r.current && !r.current.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', down);
      document.removeEventListener('keydown', key);
    };
  }, [open]);
  return { open, setOpen, ref: r };
}

/* ---------- section ---------- */

const bottomHead = { m: 0, pt: '5px', flexWrap: 'wrap', rowGap: '3px', alignItems: 'flex-start', lineHeight: 1.35 } as const;

/** `.psec`: a labelled block. `head` replaces the plain label (Actual Result tabs). */
export function Section({
  icon, label, tag, head, children, variant, order, grow, hidden, sx,
}: {
  icon: ReactNode;
  label?: ReactNode;
  tag?: ReactNode;
  head?: ReactNode;
  children: ReactNode;
  variant: PanelVariant;
  order?: number;
  grow?: number;
  hidden?: boolean;
  sx?: SxProps<Theme>;
}) {
  if (hidden) return null;
  const grid = variant === 'grid';
  return (
    <Box
      data-spec="psec"
      sx={[
        grid
          ? { display: 'grid', gridTemplateColumns: '164px minmax(0,1fr)', alignItems: 'start', columnGap: '16px', flex: '0 0 auto', minWidth: 0, p: '9px 0', borderBottom: `1px dashed ${ref.line}`, '&:last-of-type': { borderBottom: 'none' }, order }
          : variant === 'row'
            ? { flex: `${grow ?? 1} 1 0px`, minWidth: 0, order }
            : { display: 'block' },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box
        data-spec="ph"
        sx={{ display: 'flex', alignItems: 'center', gap: '5px', mb: grid ? 0 : '6px', fontSize: 10, fontWeight: panelRole.strong, color: ref.ink, ...(grid ? bottomHead : {}) }}
      >
        <Box component="span" sx={{ width: 16, height: 16, borderRadius: '4px', bgcolor: ref.grayTint, color: ref.grayIc, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          {icon}
        </Box>
        {head ?? <span>{label}</span>}
        {tag && (
          <Box component="span" sx={{ ml: grid ? 0 : 'auto', fontSize: 10, fontWeight: panelRole.emphasis, color: ref.grayIc, ...(grid ? { flexBasis: '100%' } : {}) }}>
            {tag}
          </Box>
        )}
      </Box>
      <Box sx={{ minWidth: 0 }}>{children}</Box>
    </Box>
  );
}

/* ---------- read card ---------- */

export function ReadCard({ children, tone, variant, dockSize }: { children: ReactNode; tone?: 'exp'; variant: PanelVariant; dockSize: 'normal' | 'row' | 'grid' }) {
  const exp = tone === 'exp';
  return (
    <Box
      data-spec={exp ? 'read-exp' : 'read-ins'}
      sx={{
        boxSizing: 'border-box',
        p: dockSize === 'grid' ? '7px 10px' : '9px 11px',
        bgcolor: exp ? panelRef.expBg : ref.tint2,
        border: `1px solid ${exp ? panelRef.expBorder : panelRef.readBorder}`,
        borderLeft: `3px solid ${exp ? panelRef.expBorder : ref.blue4}`,
        borderRadius: '7px',
        fontSize: dockSize === 'grid' ? 11.5 : dockSize === 'row' ? 11 : 12,
        lineHeight: 1.5,
        color: ref.ink,
        wordBreak: 'break-word',
        '& b': { fontWeight: panelRole.strong },
        ...(variant === 'row' ? {} : {}),
      }}
    >
      {children}
    </Box>
  );
}

/* ---------- header tabs ---------- */

export function PhTab({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Box
      component="button"
      type="button"
      role="tab"
      aria-selected={on}
      onClick={onClick}
      sx={{
        border: 0,
        borderBottom: `2px solid ${on ? ref.ink : 'transparent'}`,
        bgcolor: on ? 'rgba(10,13,46,.06)' : 'transparent',
        fontFamily: 'inherit',
        fontSize: 11,
        fontWeight: panelRole.emphasis,
        color: on ? ref.ink : ref.muted,
        p: '2px 7px',
        m: 0,
        borderRadius: '5px 5px 0 0',
        cursor: 'pointer',
        lineHeight: 1.6,
        '&:hover': { color: ref.ink, bgcolor: on ? 'rgba(10,13,46,.06)' : 'rgba(10,13,46,.05)' },
      }}
    >
      {children}
    </Box>
  );
}

export const iconBtnSx = {
  width: 22,
  height: 22,
  p: 0,
  m: 0,
  border: 0,
  borderRadius: '4px',
  bgcolor: 'transparent',
  color: ref.muted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 auto',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background .12s, color .12s',
  '&:hover:not(:disabled)': { bgcolor: ref.tint, color: ref.blue3 },
} as const;

/* ---------- verdict ---------- */

const verdictTone = {
  pass: { fg: ref.pass, bg: ref.passBg, mark: '✓' },
  fail: { fg: panelRef.fail, bg: panelRef.failBg, mark: '✗' },
  na: { fg: ref.muted, bg: ref.tint2, mark: '∅' },
} as const;

export function VerdictButtons({ value, disabled, variant, onPick }: { value: 'pass' | 'fail' | 'na' | null; disabled?: boolean; variant: PanelVariant | 'single'; onPick: (v: 'pass' | 'fail' | 'na') => void }) {
  const cols = variant === 'single' ? '1fr' : variant === 'grid' ? 'repeat(3, minmax(88px, 132px))' : '1fr 1fr 1fr';
  return (
    <Box
      role="group"
      aria-label="Pass, fail or not applicable"
      data-spec="verdict"
      sx={{ display: 'grid', gridTemplateColumns: cols, gap: '5px', justifyContent: variant === 'grid' ? 'start' : undefined, opacity: disabled ? 0.55 : 1, pointerEvents: disabled ? 'none' : undefined }}
    >
      {(['pass', 'fail', 'na'] as const).map((k) => {
        const t = verdictTone[k];
        const on = value === k;
        return (
          <Box
            key={k}
            component="button"
            type="button"
            aria-pressed={on}
            disabled={disabled}
            onClick={() => onPick(k)}
            sx={{
              boxSizing: 'border-box',
              p: '8px 6px',
              borderRadius: '8px',
              border: `1.5px solid ${on ? t.fg : ref.line}`,
              bgcolor: on ? t.bg : '#fff',
              color: on ? t.fg : ref.muted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              fontFamily: 'inherit',
              fontSize: 12,
              fontWeight: panelRole.strong,
              lineHeight: 'normal',
              cursor: disabled ? 'default' : 'pointer',
            }}
          >
            <Box component="span" sx={{ width: 16, height: 16, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: on ? t.fg : ref.bg, color: on ? '#fff' : ref.muted, fontSize: 10, fontWeight: panelRole.strong, lineHeight: 'normal' }}>
              {t.mark}
            </Box>
            {k === 'na' ? 'N/A' : k === 'pass' ? 'Pass' : 'Fail'}
          </Box>
        );
      })}
    </Box>
  );
}

/* ---------- buttons ---------- */

export function PanelBtn({
  tone = 'plain', children, onClick, disabled, sx, title,
}: {
  tone?: 'plain' | 'primary';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  title?: string;
}) {
  const primary = tone === 'primary';
  return (
    <Box
      component="button"
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          boxSizing: 'border-box',
          p: '5px 10px',
          borderRadius: '6px',
          fontFamily: 'inherit',
          fontSize: 11.5,
          fontWeight: panelRole.emphasis,
          lineHeight: 'normal',
          border: `1px solid ${primary ? ref.blue3 : ref.line}`,
          bgcolor: primary ? ref.blue3 : '#fff',
          color: primary ? '#fff' : ref.ink,
          cursor: 'pointer',
          '&:hover:not(:disabled)': { bgcolor: primary ? ref.navy2 : ref.bg },
          '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Box>
  );
}

/* ---------- menus ---------- */

export function MenuItem({ icon, children, onClick, on }: { icon?: ReactNode; children: ReactNode; onClick: () => void; on?: boolean }) {
  return (
    <Box
      component="button"
      type="button"
      role="menuitem"
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        width: '100%',
        textAlign: 'left',
        p: '7px 9px',
        border: 0,
        bgcolor: on ? ref.tint : 'transparent',
        fontFamily: 'inherit',
        fontSize: 12,
        fontWeight: panelRole.emphasis,
        lineHeight: 'normal',
        color: on ? ref.blue3 : ref.ink,
        cursor: 'pointer',
        borderRadius: '7px',
        '& svg': { color: ref.blue3 },
        '&:hover': { bgcolor: ref.tint, color: ref.blue3 },
      }}
    >
      {icon}
      {children}
    </Box>
  );
}

/** Dock position menu (button `panelDockBtn` of the reference): 214px wide, Top / Bottom / Left / Right, then Full Screen. */
export function DockMenu({ dock, fullscreen, onDock, onFullscreen }: { dock: 'left' | 'right' | 'top' | 'bottom'; fullscreen: boolean; onDock: (d: 'left' | 'right' | 'top' | 'bottom') => void; onFullscreen: () => void }) {
  const p = usePopover();
  const items: ['top' | 'bottom' | 'left' | 'right', string][] = [['top', 'Top'], ['bottom', 'Bottom'], ['left', 'Left'], ['right', 'Right']];
  return (
    <Box ref={p.ref} sx={{ position: 'relative', display: 'inline-flex' }}>
      <Box
        component="button"
        type="button"
        data-spec="dock-trigger"
        aria-label="Panel position"
        aria-haspopup="menu"
        aria-expanded={p.open}
        title={fullscreen ? 'Exit full screen' : 'Dock panel position'}
        onClick={() => p.setOpen(!p.open)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          height: 26,
          p: '0 7px',
          boxSizing: 'border-box',
          border: `1px solid ${ref.line}`,
          bgcolor: '#fff',
          borderRadius: '7px',
          color: ref.muted,
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: '.15s',
          '&:hover': { borderColor: ref.blue4, color: ref.blue3, bgcolor: ref.tint },
        }}
      >
        {icons.dockGlyph(fullscreen ? 'full' : dock)}
        <span style={{ opacity: 0.7, display: 'flex' }}>{icons.chevDown(11)}</span>
      </Box>
      {p.open && (
        <Box
          role="menu"
          data-spec="dock-menu"
          sx={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, bgcolor: '#fff', border: `1px solid ${ref.line}`, borderRadius: '10px', boxShadow: panelRef.menuShadow, p: '6px', zIndex: 120, minWidth: 214, boxSizing: 'border-box' }}
        >
          <Box sx={{ fontSize: 10, fontWeight: panelRole.heavy, color: ref.muted, p: '4px 8px 6px' }}>Dock panel</Box>
          {items.map(([d, label]) => (
            <MenuItem
              key={d}
              icon={icons.dockGlyph(d, 14)}
              on={!fullscreen && dock === d}
              onClick={() => {
                p.setOpen(false);
                onDock(d);
              }}
            >
              {label}
            </MenuItem>
          ))}
          <Box sx={{ height: '1px', bgcolor: ref.line, m: '5px 4px' }} />
          <MenuItem
            icon={icons.dockGlyph('full', 14)}
            on={fullscreen}
            onClick={() => {
              p.setOpen(false);
              onFullscreen();
            }}
          >
            {fullscreen ? 'Exit Full Screen' : 'Full Screen'}
          </MenuItem>
        </Box>
      )}
    </Box>
  );
}

/** Overflow menu of the Actual Result header ("..."): 200px wide rows. */
export function DotsMenu({ items, alignLeft }: { items: { label: string; onClick: () => void; disabled?: boolean }[]; alignLeft?: boolean }) {
  const p = usePopover();
  return (
    <Box ref={p.ref} sx={{ position: 'relative', display: 'flex', alignItems: alignLeft ? 'flex-start' : 'center', ml: alignLeft ? '2px' : 'auto' }}>
      <Box component="button" type="button" aria-label="More actions" aria-haspopup="menu" aria-expanded={p.open} onClick={() => p.setOpen(!p.open)} sx={iconBtnSx}>
        {icons.dots(14)}
      </Box>
      {p.open && (
        <Box role="menu" sx={{ position: 'absolute', right: alignLeft ? 'auto' : 0, left: alignLeft ? 0 : 'auto', top: 'calc(100% + 4px)', bgcolor: '#fff', border: `1px solid ${ref.tint2}`, borderRadius: '8px', boxShadow: panelRef.dotsShadow, zIndex: 2100, minWidth: 200, overflow: 'hidden' }}>
          {items.map((it) => (
            <Box
              key={it.label}
              component="button"
              type="button"
              role="menuitem"
              disabled={it.disabled}
              onClick={() => {
                p.setOpen(false);
                it.onClick();
              }}
              sx={{ width: '100%', textAlign: 'left', p: '9px 13px', bgcolor: 'transparent', border: 0, borderBottom: `1px solid ${ref.tint2}`, '&:last-of-type': { borderBottom: 0 }, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: ref.ink, display: 'flex', alignItems: 'center', gap: '9px', fontWeight: panelRole.menuItem, lineHeight: 'normal', '&:hover:not(:disabled)': { bgcolor: ref.tint2 }, '&:disabled': { opacity: 0.5, cursor: 'not-allowed' } }}
            >
              {it.label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
