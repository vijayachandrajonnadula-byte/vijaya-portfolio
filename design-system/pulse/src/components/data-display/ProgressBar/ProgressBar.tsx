// Figma: ProgressBar page, sets "progressBar", "progressBarGradient", "progressBarNotification".
import { forwardRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { textStyle } from '../../../theme/pulseTokens';

export type ProgressBarColor = 'default' | 'blue' | 'red' | 'green' | 'orange' | 'yellow';
export type ProgressBarLabel = false | 'right' | 'topRight' | 'topBoth' | 'bottomRight' | 'bottomBoth';
export type ProgressBarStatus = 'empty' | 'default' | 'normal' | 'average' | 'alert' | 'critical';

export interface ProgressBarProps {
  /** 0-100. @default 0 */
  value?: number;
  /** @default "default" */
  color?: ProgressBarColor;
  /**
   * Where the percentage (and `labelText`) go. right: beside the bar. top/bottom + Right: percentage only,
   * + Both: `labelText` on the left too. @default false
   */
  label?: ProgressBarLabel;
  /** Left label for the "Both" placements, e.g. "Stopped". */
  labelText?: ReactNode;
  /** Hint line under the bar (Figma "Hint Text"). */
  helperText?: ReactNode;
  /**
   * Multi-colour bar (Figma progressBarGradient): the bar is cut into five colour bands, so the colour reached
   * shows the status. Pass `status` to force the band instead of deriving it from `value`.
   */
  gradient?: boolean;
  status?: ProgressBarStatus;
  disabled?: boolean;
  /** Accessible name. */
  'aria-label'?: string;
  sx?: SxProps<Theme>;
}

const fills: Record<ProgressBarColor, string> = {
  default: '#1e3a6e', blue: '#2563eb', red: '#ef4444', green: '#22c55e', orange: '#f59e0b', yellow: '#eab308',
};
// Figma gradient1..5 (green -> light green -> yellow -> orange -> red).
const bands = ['#22c55e', '#4ade80', '#eab308', '#f59e0b', '#ef4444'];
// Figma progressBarGradient: the percentage and label each Status variant shows.
const statusValue: Record<ProgressBarStatus, number> = { empty: 0, default: 20, normal: 40, average: 60, alert: 80, critical: 100 };
const statusLabel: Record<ProgressBarStatus, string> = { empty: 'Starting', default: 'Normal', normal: 'Normal', average: 'Average', alert: 'Warning', critical: 'Critical' };
const TRACK = 'rgba(0,0,0,0.1)';

/** Linear progress bar: 6px track, 4px radius, optional percentage / label / hint text. */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  { value = 0, color = 'default', label = false, labelText, helperText, gradient, status, disabled, sx, ...rest },
  ref,
) {
  const v = Math.max(0, Math.min(100, gradient && status ? statusValue[status] : value));
  if (gradient && status && labelText == null) labelText = statusLabel[status];
  const pct = (
    <Box component="span" sx={{ ...textStyle('textM', 'bold'), color: 'rgba(0,0,0,0.7)', textAlign: 'right', minWidth: 27 }}>{`${Math.round(v)}%`}</Box>
  );
  const left = labelText != null && <Box component="span" sx={{ ...textStyle('textM', 'medium'), color: '#090909', flex: 1 }}>{labelText}</Box>;
  const bar = (
    <Box
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={rest['aria-label']}
      data-spec="progress track"
      sx={{ position: 'relative', flex: label === 'right' ? 1 : '0 0 auto', width: label === 'right' ? undefined : '100%', height: 6, borderRadius: '4px', background: TRACK, overflow: 'hidden' }}
    >
      <Box
        sx={{
          height: '100%',
          width: `${v}%`,
          borderRadius: '4px',
          background: gradient ? `linear-gradient(90deg, ${bands.map((b, i) => `${b} ${i * 20}% ${(i + 1) * 20}%`).join(', ')})` : fills[color],
          ...(gradient ? { backgroundSize: `${(100 / (v || 1)) * 100}% 100%`, backgroundRepeat: 'no-repeat' } : {}),
        }}
      />
    </Box>
  );
  const top = label === 'topRight' || label === 'topBoth';
  const bottom = label === 'bottomRight' || label === 'bottomBoth';
  const both = label === 'topBoth' || label === 'bottomBoth';
  const labelRow = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>{both && left}{pct}</Box>
  );
  return (
    <Box ref={ref} sx={[{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', opacity: disabled ? 0.38 : 1 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      {top && labelRow}
      {label === 'right' ? <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{bar}{pct}</Box> : bar}
      {bottom && labelRow}
      {helperText != null && <Box sx={{ ...textStyle('textS', 'regular'), color: 'text.secondary' }}>{helperText}</Box>}
    </Box>
  );
});
ProgressBar.displayName = 'ProgressBar';

export interface ProgressBarNotificationProps {
  /** 0-100 */
  value: number;
  /** black for light notifications, white for dark/filled ones. @default "black" */
  colour?: 'black' | 'white';
  sx?: SxProps<Theme>;
}

const note = {
  black: { base: 'rgba(0,0,0,0.03)', bar: 'rgba(0,0,0,0.07)' },
  white: { base: 'rgba(255,255,255,0.3)', bar: 'rgba(255,255,255,0.4)' },
};

/** 4px timer strip along the bottom of a notification (Figma progressBarNotification). */
export function ProgressBarNotification({ value, colour = 'black', sx }: ProgressBarNotificationProps) {
  const c = note[colour];
  return (
    <Box role="progressbar" aria-valuenow={Math.round(value)} sx={[{ height: 4, width: '100%', background: c.base }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      <Box sx={{ height: '100%', width: `${Math.max(0, Math.min(100, value))}%`, background: c.bar }} />
    </Box>
  );
}



export type ProgressBarAnimationState = 'inProgress' | 'error' | 'success';

// Figma .Animation-* prototypes: [ramp seconds, easing] per state. Hold after the last frame before looping.
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const HOLD = 1.2;

export interface ProgressBarAnimationProps {
  /** inProgress: 0 -> 50%. error: 0 -> 50% then turns red. success: 0 -> 99% then "Completed" in green. */
  state: ProgressBarAnimationState;
  sx?: SxProps<Theme>;
}

/**
 * The three prototype animations from the Figma ProgressBar page (.Animation-InProgress, .Animation-InErrorState,
 * .Animation-Success), looped. Under prefers-reduced-motion it shows the final frame without animating.
 */
export function ProgressBarAnimation({ state, sx }: ProgressBarAnimationProps) {
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const ramp = state === 'success' ? 4.5 : 1.5;
  const [t, setT] = useState(reduced ? Infinity : 0);
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      setT(((now - t0) / 1000) % (ramp + 0.3 + HOLD));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, ramp]);

  const p = Math.min(1, t / ramp);
  const done = t >= ramp;
  if (state === 'inProgress') {
    return <ProgressBar value={Math.round(50 * outCubic(p))} aria-label="In progress" sx={sx} />;
  }
  if (state === 'error') {
    const failed = done;
    const v = Math.round(50 * outCubic(p));
    return <ProgressBar value={v} color={failed ? 'red' : 'default'} label="topBoth" labelText={failed ? 'Stopped' : 'Starting...'} aria-label="Error state" sx={sx} />;
  }
  const v = done ? 100 : Math.min(99, Math.round(99 * p));
  return <ProgressBar value={v} color={done ? 'green' : 'default'} label="topBoth" labelText={done ? 'Completed' : 'Starting...'} aria-label="Success state" sx={sx} />;
}


