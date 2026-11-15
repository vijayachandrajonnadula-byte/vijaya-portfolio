// Implements Figma page "Switch": Switch (Size x Color x State OFF/ON/Intermediate x Interaction).
import MuiSwitch from '@mui/material/Switch';
import type { SwitchProps as MuiSwitchProps } from '@mui/material/Switch';
import { disabledOpacity, focusRing } from '../../../theme/pulseTokens';

export type SwitchColor = 'primary' | 'error' | 'warning' | 'mobile' | 'grey';

export interface SwitchProps extends Omit<MuiSwitchProps, 'size' | 'color' | 'disableRipple'> {
  /** @default "small" */
  size?: 'small' | 'medium';
  /** @default "primary" */
  color?: SwitchColor;
  /** Third Figma state: filled track with a dash instead of the knob. */
  indeterminate?: boolean;
}

// Spec: small 28x16 knob 10, medium 36x20 knob 14, 4px side padding. OFF track uses the primary border colour for every colour.
const dims = { small: { w: 28, h: 16, knob: 10 }, medium: { w: 36, h: 20, knob: 14 } } as const;
const off = { bg: '#D3E0F2', hover: '#B5C9E7' }; // #d3e0f2 / #b5c9e7
const tones = {
  primary: { on: '#1E3A6E', hover: '#4E73A8' },
  error: { on: '#EF4444', hover: '#F87171' },
  warning: { on: '#F59E0B', hover: '#FBBF24' },
  mobile: { on: '#22C55E', hover: '#4ADE80' },
  grey: { on: '#5f6f86', hover: '#566680' },
} as const;

/** Pulse switch. Knob 10/14px with a soft drop shadow; hover lightens the track. */
export function Switch({ size = 'small', color = 'primary', indeterminate, sx, ...rest }: SwitchProps) {
  const d = dims[size];
  const tone = tones[(color in tones ? color : 'primary') as SwitchColor];
  const travel = d.w - 8 - d.knob;
  const top = (d.h - d.knob) / 2;
  return (
    <MuiSwitch
      {...rest}
      disableRipple
      slotProps={{ ...rest.slotProps, root: { 'data-indeterminate': indeterminate ? '' : undefined } as never }}
      sx={[
        {
          width: d.w,
          height: d.h,
          padding: 0,
          overflow: 'visible',
          flexShrink: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            top,
            left: 4,
            '&:hover': { backgroundColor: 'transparent' },
            '&.Mui-checked': { transform: `translateX(${travel}px)`, color: '#fff' },
            '&.Mui-checked + .MuiSwitch-track': { backgroundColor: tone.on, opacity: 1 },
            '&.Mui-disabled': { color: '#fff' },
            '&.Mui-disabled + .MuiSwitch-track': { opacity: disabledOpacity },
            '&.Mui-disabled.Mui-checked + .MuiSwitch-track': { opacity: disabledOpacity },
            '&.Mui-disabled .MuiSwitch-thumb': { opacity: disabledOpacity },
            '&.Mui-focusVisible + .MuiSwitch-track': { boxShadow: focusRing },
          },
          '& .MuiSwitch-thumb': { width: d.knob, height: d.knob, backgroundColor: '#fff', boxShadow: '0 2px 2px rgba(0,0,0,0.2)' },
          '& .MuiSwitch-track': { borderRadius: 1000, backgroundColor: off.bg, opacity: 1, transition: 'background-color 120ms, box-shadow 120ms', position: 'relative' },
          '&:hover .MuiSwitch-switchBase:not(.Mui-disabled) + .MuiSwitch-track, &.is-hover .MuiSwitch-switchBase:not(.Mui-disabled) + .MuiSwitch-track': { backgroundColor: off.hover, boxShadow: '0 0 4px rgba(0,0,0,0.2)' },
          '&:hover .MuiSwitch-switchBase.Mui-checked:not(.Mui-disabled) + .MuiSwitch-track, &.is-hover .MuiSwitch-switchBase.Mui-checked:not(.Mui-disabled) + .MuiSwitch-track': { backgroundColor: tone.hover, boxShadow: 'none' },
          ...(color === 'grey'
            ? {
                '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': { backgroundColor: '#fff', boxShadow: 'inset 0 0 0 1px #5f6f86' },
                '&:hover .MuiSwitch-switchBase:not(.Mui-checked):not(.Mui-disabled) + .MuiSwitch-track, &.is-hover .MuiSwitch-switchBase:not(.Mui-checked):not(.Mui-disabled) + .MuiSwitch-track': { backgroundColor: '#fff', boxShadow: 'inset 0 0 0 1px #566680' },
                '& .MuiSwitch-switchBase:not(.Mui-checked) .MuiSwitch-thumb': { backgroundColor: '#5f6f86' },
                '&:hover .MuiSwitch-switchBase:not(.Mui-checked):not(.Mui-disabled) .MuiSwitch-thumb, &.is-hover .MuiSwitch-switchBase:not(.Mui-checked):not(.Mui-disabled) .MuiSwitch-thumb': { backgroundColor: '#566680' },
              }
            : {}),
          '&[data-indeterminate]': {
            '& .MuiSwitch-thumb': { display: 'none' },
            '& .MuiSwitch-switchBase + .MuiSwitch-track': { backgroundColor: tone.on },
            '&:hover .MuiSwitch-switchBase:not(.Mui-disabled) + .MuiSwitch-track, &.is-hover .MuiSwitch-switchBase:not(.Mui-disabled) + .MuiSwitch-track': { backgroundColor: tone.hover, boxShadow: 'none' },
            '& .MuiSwitch-track::after': { content: '""', position: 'absolute', left: '50%', top: '50%', width: 8, height: 2, borderRadius: 1, transform: 'translate(-50%, -50%)', backgroundColor: '#fff' },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ] as never}
    />
  );
}


