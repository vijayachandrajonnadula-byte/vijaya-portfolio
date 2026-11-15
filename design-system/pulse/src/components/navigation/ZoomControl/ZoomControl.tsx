// Implements Figma page "ZoomControl": set "ZoomControl" (Variant Default / Expanded) and the zoom group of "Canvas Toolbar".
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import AddRounded from '@mui/icons-material/AddRounded';
import RemoveRounded from '@mui/icons-material/RemoveRounded';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Divider } from '../../data-display/Divider/Divider';
import { pt, textStyle } from '../../../theme/pulseTokens';

export interface ZoomControlProps {
  /** Zoom percentage, e.g. 100. */
  value: number;
  onChange: (value: number) => void;
  /** Percentages listed in the dropdown. Defaults to the presets named in the Figma Canvas Toolbar notes. */
  presets?: number[];
  /** Label of the last dropdown entry (after a divider); selecting it calls `onFit`. @default "Fit width" */
  fitLabel?: string;
  onFit?: () => void;
  min?: number;
  max?: number;
  /** Step of the - / + buttons. @default 10 */
  step?: number;
  /** Borderless input (54px wide) as used inside the Canvas Toolbar. @default false */
  compact?: boolean;
  disabled?: boolean;
  /** Start with the preset dropdown open (Figma "Expanded"). */
  defaultOpen?: boolean;
}

// Common zoom presets from the Canvas Toolbar page notes.
const defaultPresets = [25, 50, 75, 100, 150, 200, 400];

/** Zoom stepper: - / editable percentage / +, with a preset dropdown on focus. 32px tall, input 72px (54px compact). */
export function ZoomControl({ value, onChange, presets = defaultPresets, fitLabel = 'Fit width', onFit, min = 10, max = 400, step = 10, compact = false, disabled, defaultOpen = false }: ZoomControlProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [text, setText] = useState(`${value}%`);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => setText(`${value}%`), [value]);
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)));
  const commit = () => {
    const n = parseFloat(text.replace('%', ''));
    if (Number.isFinite(n)) onChange(clamp(n));
    else setText(`${value}%`);
  };
  const w = compact ? 54 : 72;
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box role="group" aria-label="Zoom" data-spec="zoomcontrol" sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: compact ? 0 : '4px', height: 32 }}>
        <IconButton ariaLabel="Zoom out" size="small" disabled={disabled || value <= min} onClick={() => onChange(clamp(value - step))}><RemoveRounded /></IconButton>
        <Box
          sx={{
            boxSizing: 'border-box', width: w, height: 32, p: '4px 8px', borderRadius: pt.radius.xs, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#fff',
            boxShadow: compact && !open ? 'none' : `inset 0 0 0 1.5px ${open ? '#1e3a6e' : '#d3e0f2'}`,
            '&:hover': { boxShadow: compact && !open ? 'inset 0 0 0 1.5px #d3e0f2' : undefined },
          }}
        >
          <Box
            component="input"
            ref={inputRef}
            aria-label="Zoom level"
            value={text}
            disabled={disabled}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={commit}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Enter') { commit(); setOpen(false); }
              if (e.key === 'Escape') { setText(`${value}%`); setOpen(false); }
            }}
            sx={{ ...textStyle('textM', 'medium'), width: '100%', border: 0, outline: 0, background: 'transparent', textAlign: 'center', color: '#0f172a', p: 0 }}
          />
        </Box>
        <IconButton ariaLabel="Zoom in" size="small" disabled={disabled || value >= max} onClick={() => onChange(clamp(value + step))}><AddRounded /></IconButton>
        {open && (
          // Rows are the themed Pulse dropdown rows (MuiMenuItem: 32px, hover / selected fills from the dropdown tokens).
          <MenuList role="listbox" data-spec="zoomcontrol dropdown" sx={{ position: 'absolute', top: 36, left: compact ? 32 : 36, width: w, boxSizing: 'border-box', py: '8px', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
            {presets.map((p) => (
              <MenuItem
                key={p}
                role="option"
                aria-selected={p === value}
                selected={p === value}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onChange(clamp(p)); setOpen(false); }}
                sx={{ px: '8px' }}
              >{p}%</MenuItem>
            ))}
            {onFit && (
              <>
                <Divider sx={{ my: '2px' }} />
                <MenuItem onMouseDown={(e) => e.preventDefault()} onClick={() => { onFit(); setOpen(false); }} sx={{ px: '8px' }}>{fitLabel}</MenuItem>
              </>
            )}
          </MenuList>
        )}
      </Box>
    </ClickAwayListener>
  );
}



