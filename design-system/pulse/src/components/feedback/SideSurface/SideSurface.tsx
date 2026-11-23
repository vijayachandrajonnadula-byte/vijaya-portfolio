// NOT FROM FIGMA. Side surface chassis taken from the Electronic Execution reference prototype (measured at 1440x900):
// a full-height panel fixed to the right edge with a scrim (modal) or without one (floating panel), an optional 0.25s slide-in,
// a header slot, a scrolling body and a footer slot. Header and footer content are passed in, so the page decides their type and
// spacing; the chassis only owns position, size, scrim, shadow, slide and the scroll area.
// Pulse "Flyout" (Figma) is a fixed 480px panel with a 48/64px header and 18px title; this one covers the prototype's 320 to 1388px
// panels with 11 to 18px headers. Listed in docs/figma-deviations.md. Use Flyout for anything that has a Figma spec.
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { ResizeHandle } from '../../containers/ResizeHandle/ResizeHandle';

/** Widths the visitor dragged to, kept for the session by `rememberAs`, so a reopened panel keeps its size. */
const remembered = new Map<string, number>();

export interface SideSurfaceProps {
  /** Close request (Escape, scrim click on a modal panel). */
  onClose: () => void;
  /** px number or CSS length, for example "calc(100vw - 52px)". With `resizable` it must be a number: it is the starting width. */
  width: number | string;
  /** Let the visitor drag the left edge to change the width (ARIA window splitter: arrow keys, Home / End, double click resets). Needs a numeric `width`. @default false */
  resizable?: boolean;
  /** Narrowest and widest width in px when `resizable`. The widest is also capped to the window. @default 360 and 1200 */
  minWidth?: number;
  maxWidth?: number;
  /** Key under which the dragged width is remembered for the session, so reopening the panel keeps it. */
  rememberAs?: string;
  /** Scrim + focus trap. Pass false for a floating panel that leaves the page usable. @default true */
  modal?: boolean;
  /** Scrim colour (any CSS colour, with its own alpha). Modal panels only. */
  scrim?: string;
  /** Scrim blur in px. @default 0 */
  scrimBlur?: number;
  /** Slide-in time in ms. 0 shows the panel at once. @default 250 */
  duration?: number;
  /** CSS box-shadow of the panel. */
  shadow?: string;
  /** Left border (CSS), for example "1px solid #dfe5eb". */
  borderLeft?: string;
  /** Right border (CSS). The prototype's slide panels end in a 1px line at the screen edge. */
  borderRight?: string;
  /** z-index of the panel (floating) or of the whole drawer (modal). */
  zIndex?: number;
  /** Accessible name of the panel. */
  ariaLabel: string;
  /** Content above the body (not scrolled). */
  header?: ReactNode;
  /** Content below the body (not scrolled). */
  footer?: ReactNode;
  /** Body padding (CSS). @default 0 */
  bodyPadding?: string;
  /** Body background (CSS). @default transparent */
  bodyBackground?: string;
  /** Font family inherited by the whole panel. */
  fontFamily?: string;
  children?: ReactNode;
}

const surface = (fontFamily?: string) => ({ display: 'flex', flexDirection: 'column', boxSizing: 'border-box', background: '#fff', overflow: 'hidden', fontFamily, lineHeight: 1.45 }) as const;

export function SideSurface({ onClose, width, resizable = false, minWidth = 360, maxWidth = 1200, rememberAs, modal = true, scrim = 'rgba(15,30,80,.45)', scrimBlur = 0, duration = 250, shadow, borderLeft, borderRight, zIndex, ariaLabel, header, footer, bodyPadding = '0', bodyBackground, fontFamily, children }: SideSurfaceProps) {
  const [shown, setShown] = useState(false);
  const base = typeof width === 'number' ? width : 640;
  const canResize = resizable && typeof width === 'number';
  const [drag, setDrag] = useState<number>(() => (rememberAs ? remembered.get(rememberAs) : undefined) ?? base);
  const [win, setWin] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth));
  useEffect(() => {
    if (!canResize) return undefined;
    const on = () => setWin(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [canResize]);
  const hi = Math.max(minWidth, Math.min(maxWidth, win - 24));
  const lo = Math.min(minWidth, hi);
  const current = Math.min(hi, Math.max(lo, drag));
  const setWidth = (px: number) => { setDrag(px); if (rememberAs) remembered.set(rememberAs, px); };
  const effectiveWidth: number | string = canResize ? current : width;
  const handle = canResize ? <ResizeHandle value={current} min={lo} max={hi} onChange={setWidth} onReset={() => setWidth(base)} inset label={`Resize the ${ariaLabel} panel`} /> : null;
  useEffect(() => {
    if (modal) return undefined;
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [modal]);

  const content = (
    <>
      {handle}
      {header}
      <Box data-spec="sidepanel-body" sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: bodyPadding, background: bodyBackground }}>{children}</Box>
      {footer}
    </>
  );

  if (modal) {
    return (
      <Drawer
        open
        anchor="right"
        onClose={onClose}
        transitionDuration={duration}
        sx={zIndex ? { zIndex } : undefined}
        slotProps={{
          backdrop: { sx: { backgroundColor: scrim, backdropFilter: scrimBlur ? `blur(${scrimBlur}px)` : undefined } },
          paper: { role: 'dialog', 'aria-modal': true, 'aria-label': ariaLabel, 'data-spec': 'sidepanel', sx: { ...surface(fontFamily), position: 'fixed', width: effectiveWidth, maxWidth: '100vw', height: '100%', borderRadius: 0, boxShadow: shadow, borderLeft, borderRight } } as never,
          transition: { easing: 'ease' },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Box
      role="complementary"
      aria-label={ariaLabel}
      data-spec="sidepanel"
      sx={{
        ...surface(fontFamily),
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: effectiveWidth,
        maxWidth: '100vw',
        zIndex: zIndex ?? 1150,
        boxShadow: shadow,
        borderLeft,
        borderRight,
        transform: shown || duration === 0 ? 'translateX(0)' : 'translateX(100%)',
        transition: duration ? `transform ${duration}ms ease` : 'none',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      {content}
    </Box>
  );
}
