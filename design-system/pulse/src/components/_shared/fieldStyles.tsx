import type { ReactNode } from 'react';
import { fw } from '../../theme/typography';
import ButtonBase from '@mui/material/ButtonBase';
import CloseRounded from '@mui/icons-material/CloseRounded';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { disabledOpacity, focusRing, textStyle } from '../../theme/pulseTokens';

/**
 * Shared text-field chrome: TextField / TextArea / Select / Search / TallyCounter all draw the same
 * box (Figma "BuildingBlocks/atomTextField" and "atomTextArea"), so the measurements live here.
 */
export type FieldSize = 'small' | 'medium' | 'large';
export type FieldColor = 'primary' | 'success' | 'warning' | 'error';

/** atomTextField: height / radius / horizontal padding / gap / adornment box / glyph. */
export const fieldSizes = {
  small: { h: 32, r: 4, px: 8, gap: 4, box: 18, glyph: 14 },
  medium: { h: 40, r: 6, px: 12, gap: 6, box: 20, glyph: 16 },
  large: { h: 44, r: 8, px: 16, gap: 8, box: 22, glyph: 18 },
} as const;

/** formElements/color/<colour>/{default,hover,focus}Border (values read from the .fig, not the kit). */
export const fieldColors = {
  primary: { border: '#d3e0f2', hover: '#b5c9e7' },
  success: { border: '#22c55e', hover: '#4ade80' },
  warning: { border: '#f59e0b', hover: '#fbbf24' },
  error: { border: '#ef4444', hover: '#f87171' },
} as const;
export const fieldFocusBorder = '#1e3a6e';
export const fieldFill = '#f6f8fc';
export const fieldPlaceholder = '#5f6f86';
export const fieldValue = '#0f172a';
export const fieldBorderWidth = 1.5;

export interface FieldSxOptions {
  size?: FieldSize;
  color?: FieldColor;
  /** Filled? = Yes: tinted background. */
  filled?: boolean;
  multiline?: boolean;
  readOnly?: boolean;
  /** Border stays in the focus colour (open dropdown). */
  active?: boolean;
}

/** `sx` for an MUI OutlinedInput (or Select) root that reproduces the Pulse field box in every state. */
export function fieldSx({ size = 'medium', color = 'primary', filled, multiline, readOnly, active }: FieldSxOptions = {}): SystemStyleObject<Theme> {
  const s = fieldSizes[size];
  const c = fieldColors[color];
  const bg = filled ? fieldFill : '#ffffff';
  return {
    ...textStyle('textL', 'medium'),
    boxSizing: 'border-box',
    minHeight: s.h,
    height: multiline ? 'auto' : undefined,
    borderRadius: `${s.r}px`,
    backgroundColor: bg,
    color: fieldValue,
    gap: `${s.gap}px`,
    alignItems: multiline ? 'flex-start' : 'center',
    paddingLeft: `${s.px}px`,
    paddingRight: `${s.px}px`,
    paddingTop: multiline ? `${(s.h - 20) / 2}px` : 0,
    paddingBottom: multiline ? `${(s.h - 20) / 2}px` : 0,
    '& .MuiOutlinedInput-notchedOutline': { borderColor: c.border, borderWidth: fieldBorderWidth, borderRadius: `${s.r}px` },
    '&:hover': { backgroundColor: filled ? fieldFill : '#ffffff' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: c.hover, borderWidth: fieldBorderWidth },
    '&.Mui-focused': { boxShadow: 'none', backgroundColor: bg },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: fieldFocusBorder, borderWidth: fieldBorderWidth },
    '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: fieldColors.error.border },
    '&.Mui-error:hover .MuiOutlinedInput-notchedOutline': { borderColor: fieldColors.error.hover },
    '&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: fieldFocusBorder },
    '&.Mui-disabled': { opacity: disabledOpacity, backgroundColor: bg },
    '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: c.border },
    '& .MuiOutlinedInput-input': {
      ...textStyle('textL', 'medium'),
      boxSizing: 'border-box',
      height: multiline ? 'auto' : '20px',
      padding: 0,
      color: fieldValue,
      '&::placeholder': { color: fieldPlaceholder, opacity: 1 },
      '&.Mui-disabled': { WebkitTextFillColor: fieldValue },
    },
    '& textarea.MuiOutlinedInput-input': { padding: 0, lineHeight: '20px' },
    '& .MuiInputAdornment-root': { margin: 0, height: 'auto', maxHeight: 'none', color: '#566680', gap: `${s.gap}px` },
    ...(active && { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1e3a6e', borderWidth: fieldBorderWidth }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1e3a6e' } }),
    ...(readOnly && {
      backgroundColor: 'transparent',
      '& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
      '&:hover': { backgroundColor: 'transparent' },
      '& .MuiOutlinedInput-input': { fontWeight: fw.regular, color: fieldValue },
    }),
  };
}

/** adornmentButton: 18/20/22 square-ish icon button used for clear / reveal / dropdown arrow. */
export function AdornmentButton({ size = 'medium', label, onClick, children, disabled, tabIndex }: { size?: FieldSize; label: string; onClick?: () => void; children?: ReactNode; disabled?: boolean; tabIndex?: number }) {
  const s = fieldSizes[size];
  return (
    <ButtonBase
      aria-label={label}
      disabled={disabled}
      tabIndex={tabIndex}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      sx={{
        width: s.box,
        height: s.box,
        flex: '0 0 auto',
        borderRadius: '50%',
        color: '#566680',
        '&:hover': { backgroundColor: '#f1f5f9', color: '#0f172a' },
        '&.Mui-focusVisible': { boxShadow: focusRing },
        '& svg': { fontSize: s.glyph },
      }}
    >
      {children ?? <CloseRounded />}
    </ButtonBase>
  );
}


