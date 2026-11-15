// Implements Figma page "Slider": Slider (single, horizontal/vertical, labels), RangeSlider, sliderKnobs (Default/Hover/Focus).
import { fw } from '../../../theme/typography';
import { useState } from 'react';
import type { ReactNode } from 'react';
import MuiSlider from '@mui/material/Slider';
import type { SliderProps as MuiSliderProps } from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { disabledOpacity, focusRing, pt } from '../../../theme/pulseTokens';

const t = pt.uiElements.slider;

export interface SliderProps extends Omit<MuiSliderProps, 'size' | 'color'> {
  /** Vertical slider height in px. @default 200 */
  length?: number;
}

/**
 * Pulse slider. Rail 6px (r4) rgba(0,0,0,.1), filled part navy, 16px white knob with a navy 1px ring;
 * hover grows the knob to 18px, lightens the fill and shows the value tooltip. Pass an array `value` for a range slider.
 */
export function Slider({ sx, length = 200, orientation, valueLabelDisplay = 'auto', ...rest }: SliderProps) {
  const vertical = orientation === 'vertical';
  return (
    <MuiSlider
      {...rest}
      orientation={orientation}
      valueLabelDisplay={valueLabelDisplay}
      sx={[
        {
          boxSizing: 'border-box',
          color: t.color.defaultProgressBackground,
          ...(vertical ? { width: 18, height: length, padding: '0 6px', display: 'inline-block' } : { height: 18, padding: '6px 0' }),
          '&.Mui-disabled': { opacity: disabledOpacity, color: t.color.defaultProgressBackground },
          '& .MuiSlider-rail': { opacity: 1, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: t.border.radius, ...(vertical ? { width: 6 } : { height: 6 }) },
          '& .MuiSlider-track': { border: 0, borderRadius: t.border.radius, backgroundColor: t.color.defaultProgressBackground, ...(vertical ? { width: 6 } : { height: 6 }) },
          '& .MuiSlider-thumb': {
            boxSizing: 'border-box',
            width: 16,
            height: 16,
            backgroundColor: t.color.defaultKnobBackground,
            border: `1px solid ${t.color.defaultKnobBorder}`,
            boxShadow: 'none',
            transition: 'width 120ms, height 120ms, box-shadow 120ms, border-color 120ms',
            '&::before, &::after': { display: 'none' },
            '&:hover, &.Mui-active': { width: 18, height: 18, borderColor: t.color.hoverKnobBorder, boxShadow: '0 4px 4px rgba(0,0,0,0.25)' },
            '&.Mui-focusVisible': { boxShadow: focusRing },
          },
          '&.is-hover .MuiSlider-thumb': { width: 18, height: 18, borderColor: t.color.hoverKnobBorder, boxShadow: '0 4px 4px rgba(0,0,0,0.25)' },
          '&:hover .MuiSlider-rail, &.is-hover .MuiSlider-rail': { backgroundColor: t.color.hoverBaseBackground },
          '&:hover .MuiSlider-track, &.is-hover .MuiSlider-track': { backgroundColor: t.color.hoverProgressBackground },
          '&.Mui-disabled:hover .MuiSlider-rail': { backgroundColor: 'rgba(0,0,0,0.1)' },
          '&.Mui-disabled:hover .MuiSlider-track': { backgroundColor: t.color.defaultProgressBackground },
          '& .MuiSlider-valueLabel': {
            backgroundColor: pt.colors.neutral[900],
            color: '#fff',
            borderRadius: '4px',
            padding: '2px 8px',
            fontFamily: "'Inter Variable', Inter, sans-serif",
            fontSize: 10,
            lineHeight: '18px',
            fontWeight: fw.medium,
            top: -2,
            '&::before': { bottom: -3 },
          },
          '& .MuiSlider-mark': { display: 'none' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ] as never}
    />
  );
}

/**
 * Figma Slider / RangeSlider "Label" variants: none (False) | right | sides (Left & Right / Both) | topRight | bottomRight |
 * topBoth | bottomBoth | topLabelBottomBoth. For a single slider "Both" is label + value, for a range it is min + max.
 */
export type SliderValueLabels = 'none' | 'right' | 'sides' | 'topRight' | 'bottomRight' | 'topBoth' | 'bottomBoth' | 'topLabelBottomBoth';

export interface SliderWithLabelProps extends SliderProps {
  /** Field label (textLabel), only part of the topBoth / bottomBoth / topLabelBottomBoth variants. */
  label?: ReactNode;
  /** Helper text below. */
  hint?: ReactNode;
  error?: boolean;
  /** @default "none" */
  valueLabels?: SliderValueLabels;
  /** Format a number for display (e.g. add a unit). */
  formatValue?: (v: number) => ReactNode;
}

// textContent Primary / Bold: Inter 12/20 #0F172A. textLabel: SemiBold 14/20.
const numberSx = { fontFamily: "'Inter Variable', Inter, sans-serif", fontSize: 12, lineHeight: '20px', fontWeight: fw.bold, color: pt.colors.neutral[900], whiteSpace: 'nowrap' } as const;
const labelSx = { fontFamily: "'Inter Variable', Inter, sans-serif", fontSize: 14, lineHeight: '20px', fontWeight: fw.semiBold, color: pt.colors.neutral[900] } as const;

/** Slider with label, numeric value labels and helper text (Figma Slider "Label" variants; rows 20px, gap 8). */
export function SliderWithLabel({ label, hint, error, valueLabels = 'none', formatValue = (v) => v, min = 0, max = 100, value, defaultValue, onChange, disabled, ...rest }: SliderWithLabelProps) {
  const [inner, setInner] = useState<number | number[]>(defaultValue ?? min);
  const current = value ?? inner;
  const range = Array.isArray(current);
  const text = Array.isArray(current) ? `${formatValue(current[0] ?? min)} - ${formatValue(current[1] ?? max)}` : formatValue(current);
  const slider = (
    <Slider
      {...rest}
      min={min}
      max={max}
      value={current}
      disabled={disabled}
      onChange={(e, v, a) => {
        setInner(v);
        onChange?.(e, v, a);
      }}
      sx={{ ...(rest.orientation === 'vertical' ? {} : { flex: 1, minWidth: 0 }), ...(rest.sx as object) }}
    />
  );
  const row = (left: ReactNode, rightNode: ReactNode) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', height: 20 }}>
      <Box sx={left === label ? labelSx : numberSx}>{left}</Box>
      <Box sx={numberSx}>{rightNode}</Box>
    </Box>
  );
  const minMax = row(formatValue(min), formatValue(max));
  const labelAndValue = row(label, text);
  const both = range || label == null ? minMax : labelAndValue;
  const labelOnly = label != null && <Box sx={{ ...labelSx, height: 20 }}>{label}</Box>;
  const side = (v: ReactNode) => <Box sx={numberSx}>{v}</Box>;
  if (rest.orientation === 'vertical') {
    // Figma vertical Label = Top & Bottom: min above, max below, 8px gaps.
    return (
      <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: disabled ? disabledOpacity : 1 }}>
        {valueLabels === 'sides' && side(formatValue(max))}
        {slider}
        {valueLabels === 'sides' && side(formatValue(min))}
      </Box>
    );
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', opacity: disabled ? disabledOpacity : 1 }}>
      {valueLabels === 'topLabelBottomBoth' && labelOnly}
      {valueLabels === 'topBoth' && both}
      {valueLabels === 'topRight' && <Box sx={{ ...numberSx, textAlign: 'right' }}>{text}</Box>}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {valueLabels === 'sides' && side(formatValue(min))}
        {slider}
        {valueLabels === 'sides' && side(formatValue(max))}
        {valueLabels === 'right' && side(text)}
      </Box>
      {valueLabels === 'bottomRight' && <Box sx={{ ...numberSx, textAlign: 'right' }}>{text}</Box>}
      {valueLabels === 'bottomBoth' && both}
      {valueLabels === 'topLabelBottomBoth' && minMax}
      {hint != null && <Box sx={{ fontSize: 12, lineHeight: '20px', color: error ? pt.colors.accent.red[600] : pt.colors.neutral[500] }}>{hint}</Box>}
    </Box>
  );
}
