// Shared styling for the Checkbox / Radio selection controls
// (Figma pages "Checkbox" -> BuildingBlock/Checkbox and "Radio" -> Radio: Size x Style x Color x State x Interaction).
import { fw } from '../../theme/typography';
import type { ReactElement, ReactNode } from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { SxProps, Theme } from '@mui/material/styles';
import { disabledOpacity, focusRing, pt } from '../../theme/pulseTokens';

export type ChoiceSize = 'small' | 'medium' | 'large';
export type ChoiceColor = 'primary' | 'error' | 'warning';
export type ChoiceVariant = 'solid' | 'stroke';

/** Hit area (outer frame), box and radius per size: spec 32/40/44, 14/18/22, r 4/6/8. */
export const choiceSizes = {
  small: { frame: 32, box: 14, radius: 4, check: [8, 6], dot: 6 },
  medium: { frame: 40, box: 18, radius: 6, check: [10, 8], dot: 8 },
  large: { frame: 44, box: 22, radius: 8, check: [12, 10], dot: 10 },
} as const;

export const labelTextSx = {
  fontFamily: "'Inter Variable', Inter, sans-serif",
  fontSize: 12,
  lineHeight: '20px',
  fontWeight: fw.medium,
  color: pt.colors.neutral[900],
} as const;

export const metadataTextSx = {
  fontFamily: "'Inter Variable', Inter, sans-serif",
  fontSize: 10,
  lineHeight: '18px',
  fontWeight: fw.regular,
  color: pt.colors.neutral[500],
} as const;

type ChoicePalette = typeof pt.uiElements.checkbox.primary;

/** Resolve the Figma colour tokens. Radio and checkbox use identical values. */
export function choicePalette(kind: 'checkbox' | 'radio', color: ChoiceColor): ChoicePalette {
  const set = pt.uiElements[kind];
  return set[color] ?? set.primary;
}

/** Props the MUI root needs: no ripple, transparent hover, spec sized frame. */
export function choiceRootSx(kind: 'checkbox' | 'radio', size: ChoiceSize, color: ChoiceColor, variant: ChoiceVariant): SxProps<Theme> {
  const s = choiceSizes[size];
  const c = choicePalette(kind, color);
  const stroke = variant === 'stroke';
  const focusBorder = color === 'primary' ? c.selectedBackground : c.defaultBorder;
  const pad = (s.frame - s.box) / 2;
  // Selectors: hover on the control itself, or on the surrounding FormControlLabel.
  const hov = (state: string, inner: string) => [`&${state}:hover:not(.Mui-disabled) ${inner}`, `&${state}.is-hover:not(.Mui-disabled) ${inner}`, `.MuiFormControlLabel-root:hover > &${state}:not(.Mui-disabled) ${inner}`].join(', ');
  const checkedStates = ['.Mui-checked', '.MuiCheckbox-indeterminate'];
  const selected = (inner: string) => checkedStates.map((st) => `&${st} ${inner}`).join(', ');
  const selectedHover = (inner: string) => checkedStates.map((st) => hov(st, inner)).join(', ');
  return {
    boxSizing: 'border-box',
    width: s.frame,
    height: s.frame,
    padding: `${pad}px`,
    margin: 0,
    flexShrink: 0,
    borderRadius: `${s.radius}px`,
    backgroundColor: 'transparent',
    color: 'inherit',
    '&:hover': { backgroundColor: 'transparent' },
    '&.Mui-disabled': { opacity: disabledOpacity },
    '&.Mui-focusVisible': { outline: 'none', boxShadow: 'none', backgroundColor: 'transparent' },
    '& .pulse-box': {
      boxSizing: 'border-box',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: s.box,
      height: s.box,
      borderRadius: kind === 'radio' ? '50%' : `${s.radius}px`,
      border: `1px solid ${c.defaultBorder}`,
      backgroundColor: c.defaultBackground,
      transition: 'background-color 120ms, border-color 120ms, box-shadow 120ms',
    },
    '& .pulse-glyph': { display: 'block', color: stroke ? c.selectedBackground : c.selectedIcon, overflow: 'visible' },
    '& .pulse-dot': { width: s.dot, height: s.dot, borderRadius: '50%', backgroundColor: stroke ? c.selectedBackground : c.selectedIcon },
    [hov('', '.pulse-box')]: { borderColor: c.hoverBorder },
    [selected('.pulse-box')]: { backgroundColor: stroke ? c.defaultBackground : c.selectedBackground, borderColor: c.selectedBackground },
    [selectedHover('.pulse-box')]: { backgroundColor: stroke ? c.defaultBackground : c.hoverSelectedBackground, borderColor: c.hoverSelectedBackground },
    [selectedHover('.pulse-glyph')]: { color: stroke ? c.hoverSelectedBackground : c.selectedIcon },
    [selectedHover('.pulse-dot')]: { backgroundColor: stroke ? c.hoverSelectedBackground : c.selectedIcon },
    '&.Mui-focusVisible .pulse-box': { borderColor: focusBorder, boxShadow: focusRing },
    [checkedStates.map((st) => `&.Mui-focusVisible${st} .pulse-box`).join(', ')]: { borderColor: c.selectedBackground, boxShadow: focusRing },
  };
}
/** Check mark (spec Vector WxH, stroke 1.5). */
export function CheckGlyph({ size }: { size: ChoiceSize }): ReactNode {
  const [w, h] = choiceSizes[size].check;
  return (
    <svg className="pulse-glyph" width={w} height={h} viewBox="0 0 8 6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M0.75 3.1 3 5.25 7.25 0.75" />
    </svg>
  );
}

/** Indeterminate dash (spec Line 8x0 for small, scaled). */
export function DashGlyph({ size }: { size: ChoiceSize }): ReactNode {
  const w = choiceSizes[size].check[0];
  return (
    <svg className="pulse-glyph" width={w} height={2} viewBox={`0 0 ${w} 2`} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden>
      <path d={`M0.75 1H${w - 0.75}`} />
    </svg>
  );
}


export interface ChoiceLabelProps {
  control: ReactElement;
  label: ReactNode;
  /** Small description under the label (Figma "Meta Data"). */
  metadata?: ReactNode;
  labelPlacement?: 'end' | 'start';
  disabled?: boolean;
  size: ChoiceSize;
  error?: boolean;
}

/** Figma "CheckboxList" / "Radio List": control + label (+ metadata). Label rows are 32px tall, metadata sits right under the label. */
export function ChoiceLabel({ control, label, metadata, labelPlacement = 'end', disabled, size, error }: ChoiceLabelProps) {
  const s = choiceSizes[size];
  const pad = (s.frame - s.box) / 2;
  const start = labelPlacement === 'start';
  return (
    <FormControlLabel
      control={control}
      disabled={disabled}
      labelPlacement={labelPlacement}
      label={
        <Box component="span" sx={{ display: 'flex', flexDirection: 'column', pt: `${(s.frame - 20) / 2}px`, pb: metadata ? 0 : `${(s.frame - 20) / 2}px`, opacity: disabled ? disabledOpacity : 1 }}>
          <Box component="span" sx={{ ...labelTextSx, color: error ? pt.colors.accent.red[600] : labelTextSx.color }}>{label}</Box>
          {metadata != null && <Box component="span" sx={metadataTextSx}>{metadata}</Box>}
        </Box>
      }
      sx={{
        alignItems: 'flex-start',
        m: 0,
        gap: '4px',
        '& .MuiFormControlLabel-label': { flex: 1, minWidth: 0 },
        '& > .MuiButtonBase-root': start ? { ml: `${-pad}px` } : { mr: `${-pad}px` },
      }}
    />
  );
}


