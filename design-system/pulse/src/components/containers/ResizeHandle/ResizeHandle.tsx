// NOT FROM FIGMA. A vertical drag handle that resizes the width of the panel it sits on (Pulse has no such component; the
// Electronic Execution prototype needed one for its Evidence & Activity pane and Details panel). Logged in docs/figma-deviations.md.
// It is the ARIA "window splitter" pattern: role="separator" with aria-valuenow/min/max, focusable, arrow keys change the size,
// Home/End jump to the limits, Enter or a double click resets. Pointer dragging uses pointer capture, so it works with mouse,
// pen and touch and keeps tracking when the pointer leaves the thin handle. The handle only reports a new size in px;
// the parent owns the number and applies it (controlled, like an input).
import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import Box from '@mui/material/Box';

export interface ResizeHandleProps {
  /** Current width in px of the panel this handle resizes. */
  value: number;
  /** Smallest and largest width in px. */
  min: number;
  max: number;
  /** New width in px (already clamped to min and max). */
  onChange: (px: number) => void;
  /** Double click or Enter: put the panel back to its default width. */
  onReset?: () => void;
  /** Which edge of the panel the handle is on. "start" is the left edge, so dragging left makes the panel wider; "end" is the right edge. @default "start" */
  edge?: 'start' | 'end';
  /** Keep the handle fully inside the panel (for a panel that clips its overflow). Otherwise it straddles the edge. @default false */
  inset?: boolean;
  /** Accessible name, for example "Resize the evidence pane". */
  label: string;
  /** Arrow-key step in px. @default 16 */
  step?: number;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(n)));

export function ResizeHandle({ value, min, max, onChange, onReset, edge = 'start', inset = false, label, step = 16 }: ResizeHandleProps) {
  const [dragging, setDragging] = useState(false);
  const from = useRef({ x: 0, v: 0 });

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    from.current = { x: e.clientX, v: value };
    setDragging(true);
    document.body.style.userSelect = 'none';
    e.preventDefault();
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    onChange(clamp(from.current.v + (e.clientX - from.current.x) * (edge === 'start' ? -1 : 1), min, max));
  };
  const end = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    document.body.style.userSelect = '';
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
    if (dir !== 0) {
      e.preventDefault();
      onChange(clamp(value + dir * (edge === 'start' ? -1 : 1) * step, min, max)); // ArrowLeft widens a start-edge panel
      return;
    }
    if (e.key === 'Home') { e.preventDefault(); onChange(min); }
    else if (e.key === 'End') { e.preventDefault(); onChange(max); }
    else if (e.key === 'Enter' && onReset) { e.preventDefault(); onReset(); }
  };

  return (
    <Box
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      data-spec="resize-handle"
      data-dragging={dragging}
      title={onReset ? 'Drag to resize. Double click to reset.' : 'Drag to resize.'}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      onKeyDown={key}
      onDoubleClick={onReset}
      sx={{
        position: 'absolute', top: 0, bottom: 0, width: 10, zIndex: 20, cursor: 'col-resize', touchAction: 'none', outline: 'none', userSelect: 'none',
        [edge === 'start' ? 'left' : 'right']: inset ? 0 : -5,
        // the line: thin at rest, brand colour on hover, focus and while dragging
        '&::before': { content: '""', position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, ml: '-1px', bgcolor: 'transparent', transition: 'background-color .15s ease' },
        // the grip: a short pill in the middle
        '&::after': { content: '""', position: 'absolute', top: '50%', left: '50%', width: 4, height: 36, mt: '-18px', ml: '-2px', borderRadius: '4px', bgcolor: '#cbd5e1', transition: 'background-color .15s ease, height .15s ease, margin .15s ease' },
        '&:hover::before, &:focus-visible::before, &[data-dragging="true"]::before': { bgcolor: (t) => t.palette.primary.main },
        '&:hover::after, &:focus-visible::after, &[data-dragging="true"]::after': { bgcolor: (t) => t.palette.primary.main, height: 48, mt: '-24px' },
        '&:focus-visible': { outline: (t) => `2px solid ${t.palette.primary.main}`, outlineOffset: -2, borderRadius: '4px' },
        '@media (prefers-reduced-motion: reduce)': { '&::before, &::after': { transition: 'none' } },
      }}
    />
  );
}
