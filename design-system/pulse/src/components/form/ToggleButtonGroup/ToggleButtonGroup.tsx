// Implements Figma page "Toggle Button": BuildingBlocks/ToggleButton (Size x Position x Interaction x Variant Text/Icon)
// and ToggleButtonGroup (Variant Text/Icon x Size x Label Position Top/Left). The group has no other variants in Figma.
import { fw } from '../../../theme/typography';
import type { MouseEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import MuiToggleButton from '@mui/material/ToggleButton';
import MuiToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { disabledOpacity, focusRing, pt } from '../../../theme/pulseTokens';

export interface ToggleButtonItem {
  value: string;
  label: ReactNode;
  /** Figma Variant: icon = square, glyph only. text = padded label. @default "text" */
  contentType?: 'icon' | 'text';
  disabled?: boolean;
  /** Accessible name; recommended for icon buttons. */
  ariaLabel?: string;
}

export interface ToggleButtonGroupProps {
  buttonList: ToggleButtonItem[];
  value: string | string[] | null;
  onChange: (event: MouseEvent<HTMLElement>, value: string | null) => void;
  /** Only one button selected at a time. @default false */
  exclusive?: boolean;
  /** @default "small" */
  size?: 'small' | 'medium' | 'large';
  orientation?: 'horizontal' | 'vertical';
  /** Group label (Figma textLabel), placed per `labelPosition`. */
  label?: ReactNode;
  /** @default "top" */
  labelPosition?: 'top' | 'left';
  ariaLabel?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const t = pt.uiElements.toggleButton;
// Spec: heights 32/40/44, text padding 8/12/16 (+4 vertical in small), gaps 4/8/8, icon 16/18/20, outer radius 6/8/10.
const dims = {
  small: { h: 32, padX: 8, gap: 4, icon: 16, radius: t.border.radius.small },
  medium: { h: 40, padX: 12, gap: 8, icon: 18, radius: t.border.radius.medium },
  large: { h: 44, padX: 16, gap: 8, icon: 20, radius: t.border.radius.large },
} as const;
const border = '#D3E0F2';
const hoverBg = '#E3EBF8';
const selectedHoverBg = '#4E73A8';
const font = "'Figtree', 'Inter Variable', sans-serif";

/** Figma BuildingBlocks/ToggleButton Interaction values. */
export type ToggleButtonInteraction = 'default' | 'hover' | 'focus' | 'disabled' | 'selected' | 'selectedHover' | 'selectedFocus' | 'selectedDisabled';
export type ToggleButtonPosition = 'left' | 'middle' | 'right';

export interface ToggleButtonProps {
  value: string;
  label: ReactNode;
  contentType?: 'icon' | 'text';
  size?: 'small' | 'medium' | 'large';
  /** Figma Position: corner rounding inside a group. Normally set by the group. */
  position?: ToggleButtonPosition;
  /** Pins a Figma Interaction state (for documentation); real states come from the pointer, keyboard and props. */
  interaction?: ToggleButtonInteraction;
  selected?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onChange?: (event: MouseEvent<HTMLElement>, value: string) => void;
}

function buttonSx(size: keyof typeof dims, icon: boolean, position: ToggleButtonPosition) {
  const d = dims[size];
  const r = d.radius;
  const radius = position === 'left' ? `${r} 0 0 ${r}` : position === 'right' ? `0 ${r} ${r} 0` : 0;
  return {
    boxSizing: 'border-box',
    textTransform: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${d.gap}px`,
    height: d.h,
    minWidth: icon ? d.h : 0,
    padding: icon ? '8px' : `4px ${d.padX}px`,
    border: `1px solid ${border}`,
    borderRadius: radius,
    fontFamily: font,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: fw.regular,
    whiteSpace: 'nowrap',
    color: t.color.defaultTextColor,
    backgroundColor: t.color.defaultBackground,
    transition: 'background-color 120ms, color 120ms',
    '& svg': { width: d.icon, height: d.icon, fontSize: d.icon },
    '&:hover, &.pulse-hover': { backgroundColor: hoverBg },
    '&.Mui-selected': {
      fontWeight: fw.semiBold,
      zIndex: 1,
      color: '#fff',
      backgroundColor: t.color.selectedFlatBackground,
      borderColor: t.color.selectedFlatBackground,
      '&:hover, &.pulse-hover': { backgroundColor: selectedHoverBg, borderColor: selectedHoverBg },
    },
    '&.Mui-focusVisible': { boxShadow: focusRing, zIndex: 2 },
    '&.Mui-disabled': { opacity: disabledOpacity },
  } as const;
}

const interactionClasses: Record<ToggleButtonInteraction, string> = {
  default: '',
  hover: 'pulse-hover',
  focus: 'Mui-focusVisible',
  disabled: '',
  selected: '',
  selectedHover: 'pulse-hover',
  selectedFocus: 'Mui-focusVisible',
  selectedDisabled: '',
};

/** Standalone Figma BuildingBlocks/ToggleButton. Inside ToggleButtonGroup the group supplies position, selection and size. */
export function ToggleButton({ value, label, contentType = 'text', size = 'small', position = 'left', interaction, selected, disabled, ariaLabel, onChange }: ToggleButtonProps) {
  const isSelected = selected ?? (interaction?.startsWith('selected') ?? false);
  const isDisabled = disabled ?? (interaction === 'disabled' || interaction === 'selectedDisabled');
  return (
    <MuiToggleButton
      value={value}
      selected={isSelected}
      disabled={isDisabled}
      aria-label={ariaLabel}
      disableRipple
      onChange={onChange as never}
      className={interaction ? interactionClasses[interaction] : undefined}
      sx={buttonSx(size, contentType === 'icon', position)}
    >
      {label}
    </MuiToggleButton>
  );
}

/** Segmented toggle buttons. */
export function ToggleButtonGroup({ buttonList, value, onChange, exclusive, size = 'small', orientation = 'horizontal', label, labelPosition = 'top', ariaLabel, disabled, fullWidth }: ToggleButtonGroupProps) {
  const vertical = orientation === 'vertical';
  const group = (
    <MuiToggleButtonGroup
      exclusive={exclusive}
      value={value}
      orientation={orientation}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={onChange as never}
      sx={{
        display: 'inline-flex',
        width: fullWidth ? '100%' : 'fit-content',
        '&& .MuiToggleButtonGroup-grouped': { margin: 0 },
        '&& .MuiToggleButtonGroup-grouped:not(:first-of-type)': vertical ? { marginTop: '-1px' } : { marginLeft: '-1px' },
        ...(fullWidth ? { '& .MuiToggleButtonGroup-grouped': { flex: 1 } } : {}),
      }}
    >
      {buttonList.map((b, i) => {
        const pos: ToggleButtonPosition = i === 0 ? 'left' : i === buttonList.length - 1 ? 'right' : 'middle';
        const r = dims[size].radius;
        // vertical groups round top/bottom instead of left/right
        const radius = vertical ? (pos === 'left' ? `${r} ${r} 0 0` : pos === 'right' ? `0 0 ${r} ${r}` : 0) : undefined;
        return (
          <MuiToggleButton
            key={b.value}
            value={b.value}
            disabled={b.disabled}
            aria-label={b.ariaLabel}
            disableRipple
            sx={{ ...buttonSx(size, b.contentType === 'icon', buttonList.length === 1 ? 'left' : pos), ...(radius !== undefined ? { borderRadius: radius } : {}), ...(buttonList.length === 1 ? { borderRadius: r } : {}) }}
          >
            {b.label}
          </MuiToggleButton>
        );
      })}
    </MuiToggleButtonGroup>
  );
  if (label == null) return group;
  const left = labelPosition === 'left';
  return (
    <Box sx={{ display: 'inline-flex', flexDirection: left ? 'row' : 'column', alignItems: left ? 'center' : 'flex-start', gap: left ? '24px' : '4px' }}>
      <Box component="span" sx={{ fontFamily: font, fontSize: 14, lineHeight: '20px', fontWeight: fw.semiBold, color: pt.colors.neutral[900] }}>{label}</Box>
      {group}
    </Box>
  );
}
