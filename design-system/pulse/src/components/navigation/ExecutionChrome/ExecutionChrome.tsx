/**
 * NOT FROM FIGMA. Bar controls of the Electronic Execution screen (breadcrumb row, status bar, document toolbar, evidence pane),
 * sized and coloured from the real Pulse application screenshot of that screen (1440 x 1024) with Pulse tokens only:
 * #1e3a6e action navy, #d3e0f2 field border, #cbd5e1 button border, #e2e8f0 divider, #eef3fb soft blue, #f6f8fc bar surface,
 * #0f172a text, #566680 muted. Pulse Button / ToggleButtonGroup / Tabs do not have these exact shapes (32px bordered buttons with a
 * navy "on" half, 40x32 soft-blue tab pills, 34px white bar groups). Logged in docs/figma-deviations.md.
 */
import { Fragment } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import type { SxProps, Theme } from '@mui/material/styles';
import { focusRing, textStyle } from '../../../theme/pulseTokens';
import { fw } from '../../../theme/typography';
import { Tooltip } from '../../feedback/Tooltip/Tooltip';

const NAVY = '#1e3a6e';
const FIELD = '#d3e0f2';
const BTN = '#cbd5e1';
const LINE = '#e2e8f0';
const SOFT = '#eef3fb';
const INK = '#0f172a';
const MUTED = '#566680';

const label13 = { ...textStyle('textM', 'semiBold'), fontSize: 12, lineHeight: '16px', fontWeight: fw.semiBold } as const;
const arr = (sx?: SxProps<Theme>) => (Array.isArray(sx) ? sx : sx ? [sx] : []);

/**
 * The Pulse Tooltip around a bar control (instead of the browser's plain title hint). The span keeps a disabled button hoverable
 * and keeps the control's place in a flex row. Without a tip the control is returned as it is.
 */
function withTip(tip: string | undefined, control: ReactNode): ReactNode {
  if (!tip) return control;
  return (
    <Tooltip title={tip}>
      <span style={{ display: 'inline-flex', flexShrink: 0 }}>{control}</span>
    </Tooltip>
  );
}

export interface ChromeButtonProps {
  children?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** navy: filled action (e.g. "Go"). outline: white with a #cbd5e1 border. field: #f6f8fc with the field border (selects). @default "outline" */
  tone?: 'outline' | 'navy' | 'field';
  /** Text weight: semiBold (buttons) or medium (selects). @default "semiBold" */
  weight?: 'semiBold' | 'medium';
  ariaLabel?: string;
  ariaHasPopup?: 'menu' | 'listbox' | 'dialog' | boolean;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  title?: string;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  sx?: SxProps<Theme>;
}

/** 32px bordered bar button (Actions, View, Go, table picker). */
export function ChromeButton({ children, startIcon, endIcon, tone = 'outline', weight = 'semiBold', ariaLabel, ariaHasPopup, ariaExpanded, ariaPressed, title, disabled, onClick, sx }: ChromeButtonProps) {
  const navy = tone === 'navy';
  const field = tone === 'field';
  return withTip(title, (
    <ButtonBase
      aria-label={ariaLabel}
      aria-haspopup={ariaHasPopup}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      disabled={disabled}
      onClick={onClick}
      data-spec="chrome button"
      sx={[
        {
          boxSizing: 'border-box', height: 32, gap: '8px', px: '12px', borderRadius: '6px', flexShrink: 0, whiteSpace: 'nowrap', justifyContent: 'center',
          ...label13, fontWeight: weight === 'medium' ? fw.medium : fw.semiBold,
          color: navy ? '#fff' : INK,
          background: navy ? NAVY : field ? '#f6f8fc' : '#fff',
          border: navy ? 'none' : field ? `1.5px solid ${FIELD}` : `1px solid ${BTN}`,
          '&:hover:not(.Mui-disabled)': { background: navy ? '#162d57' : field ? '#eef3fb' : '#f6f8fc' },
          '&.Mui-disabled': { opacity: 0.5 },
          '&.Mui-focusVisible': { boxShadow: focusRing },
          '& svg': { flexShrink: 0 },
        },
        ...arr(sx),
      ]}
    >
      {startIcon}
      {children}
      {endIcon}
    </ButtonBase>
  ));
}

export interface ChromeIconButtonProps {
  ariaLabel: string;
  children: ReactNode;
  /** Draws the #cbd5e1 border (default) or nothing. @default true */
  bordered?: boolean;
  title?: string;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  sx?: SxProps<Theme>;
}

/** 32x32 icon button (AI sparkle, open in new, close). */
export function ChromeIconButton({ ariaLabel, children, bordered = true, title, disabled, onClick, sx }: ChromeIconButtonProps) {
  return withTip(title, (
    <ButtonBase
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      data-spec="chrome icon button"
      sx={[
        {
          boxSizing: 'border-box', width: 32, height: 32, borderRadius: '6px', flexShrink: 0, color: INK, background: '#fff', border: bordered ? `1px solid ${BTN}` : '1px solid transparent',
          '&:hover:not(.Mui-disabled)': { background: '#f6f8fc' }, '&.Mui-disabled': { opacity: 0.5 }, '&.Mui-focusVisible': { boxShadow: focusRing },
        },
        ...arr(sx),
      ]}
    >
      {children}
    </ButtonBase>
  ));
}

export interface SegmentedOption<V extends string> {
  value: V;
  label?: ReactNode;
  icon?: ReactNode;
  ariaLabel?: string;
}

export interface SegmentedToggleProps<V extends string> {
  value: V;
  options: SegmentedOption<V>[];
  onChange: (v: V) => void;
  ariaLabel: string;
  /** Square icon-only segments (list / grid) or text segments (Panel / Inline). @default "text" */
  kind?: 'text' | 'icon';
  sx?: SxProps<Theme>;
}

/** Two or more segments, the selected one navy with white text, the rest #eef3fb with a #d3e0f2 border. 32px tall. */
export function SegmentedToggle<V extends string>({ value, options, onChange, ariaLabel, kind = 'text', sx }: SegmentedToggleProps<V>) {
  return (
    <Box role="group" aria-label={ariaLabel} data-spec="segmented toggle" sx={[{ display: 'inline-flex', flexShrink: 0, height: 32, borderRadius: '6px', overflow: 'hidden', boxSizing: 'border-box', border: `1.5px solid ${FIELD}`, background: SOFT }, ...arr(sx)]}>
      {options.map((o) => {
        const on = o.value === value;
        // icon-only segments (List view / Grid view) show their name as a tooltip
        return (
          <Fragment key={o.value}>
          {withTip(kind === 'icon' ? o.ariaLabel : undefined, (
          <ButtonBase
            aria-pressed={on}
            aria-label={o.ariaLabel}
            onClick={() => onChange(o.value)}
            sx={{
              boxSizing: 'border-box', height: '100%', minWidth: kind === 'icon' ? 32 : 0, px: kind === 'icon' ? 0 : '8px', gap: '6px', ...label13, fontWeight: on ? fw.semiBold : fw.medium,
              color: on ? '#fff' : INK, background: on ? NAVY : 'transparent', '&:hover': { background: on ? NAVY : '#e2ebf8' }, '&.Mui-focusVisible': { boxShadow: `inset 0 0 0 2px #3B82F6` },
            }}
          >
            {o.icon}
            {o.label}
          </ButtonBase>
          ))}
          </Fragment>
        );
      })}
    </Box>
  );
}

export interface PillTabsProps<V extends string> {
  value: V;
  tabs: { value: V; label: string }[];
  onChange: (v: V) => void;
  ariaLabel: string;
}

/** Evidence-pane kind tabs: 32px tall, the selected one a #eef3fb pill with navy semibold text, the others muted text. */
export function PillTabs<V extends string>({ value, tabs, onChange, ariaLabel }: PillTabsProps<V>) {
  return (
    <Box role="group" aria-label={ariaLabel} data-spec="pill tabs" sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', minWidth: 0 }}>
      {tabs.map((t) => {
        const on = t.value === value;
        return (
          <ButtonBase
            key={t.value}
            aria-pressed={on}
            onClick={() => onChange(t.value)}
            sx={{
              boxSizing: 'border-box', height: 32, px: '12px', borderRadius: '6px', ...textStyle('textM', on ? 'semiBold' : 'regular'), fontSize: 11.5, lineHeight: '16px', fontWeight: on ? fw.semiBold : fw.regular,
              color: on ? NAVY : '#8693ad', background: on ? SOFT : 'transparent', '&:hover': { background: on ? SOFT : '#f6f8fc', color: on ? NAVY : MUTED }, '&.Mui-focusVisible': { boxShadow: focusRing },
            }}
          >
            {t.label}
          </ButtonBase>
        );
      })}
    </Box>
  );
}

/** White bar group: a 34px container with a #e2e8f0 border and 6px radius (status pill, live group, media pill). */
export function BarGroup({ children, sx, ...rest }: { children: ReactNode; sx?: SxProps<Theme>; component?: 'div' | 'button'; onClick?: (e: MouseEvent<HTMLElement>) => void; 'aria-label'?: string; 'aria-haspopup'?: 'menu'; role?: string }) {
  return (
    <Box data-spec="bar group" {...rest} sx={[{ display: 'inline-flex', alignItems: 'center', boxSizing: 'border-box', height: 34, flexShrink: 0, borderRadius: '6px', border: `1px solid ${LINE}`, background: '#fff', color: INK, fontFamily: 'inherit' }, ...arr(sx)]}>
      {children}
    </Box>
  );
}

export interface ChromeToastProps {
  children: ReactNode;
  /** success: green banner (#f0fdf4 / #16a34a). error and warn use the Pulse red / amber tints. @default "success" */
  kind?: 'success' | 'error' | 'warn' | 'info';
  sx?: SxProps<Theme>;
}

const toastTone = {
  success: { bg: '#f0fdf4', fg: '#16a34a' },
  error: { bg: '#fef3f2', fg: '#d92d20' },
  warn: { bg: '#fffaeb', fg: '#b45309' },
  info: { bg: '#eef3fb', fg: '#1e3a6e' },
} as const;

/** Banner toast: 48px tall, 400px wide, 8px radius, 12px semibold text in the tone colour on its tint. */
export function ChromeToast({ children, kind = 'success', sx }: ChromeToastProps) {
  const t = toastTone[kind];
  return (
    <Box role="status" aria-live="polite" data-spec="chrome toast" sx={[{ boxSizing: 'border-box', width: 400, maxWidth: 'calc(100vw - 32px)', minHeight: 48, display: 'flex', alignItems: 'center', px: '12px', py: '8px', borderRadius: '8px', background: t.bg, color: t.fg, ...textStyle('textM', 'semiBold'), fontSize: 12, lineHeight: '18px', fontWeight: fw.semiBold, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }, ...arr(sx)]}>
      {children}
    </Box>
  );
}
