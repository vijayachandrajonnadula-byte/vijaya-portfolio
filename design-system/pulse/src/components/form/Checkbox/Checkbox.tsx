// Implements Figma page "Checkbox": BuildingBlock/Checkbox (Size x Style x Color x State x Interaction)
// and BuildingBlock/CheckboxList (label right/left + metadata).
import type { ReactNode } from 'react';
import MuiCheckbox from '@mui/material/Checkbox';
import type { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import { CheckGlyph, ChoiceLabel, DashGlyph, choiceRootSx } from '../../_shared/choiceControl';
import type { ChoiceColor, ChoiceSize, ChoiceVariant } from '../../_shared/choiceControl';

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'size' | 'color' | 'icon' | 'checkedIcon' | 'indeterminateIcon' | 'disableRipple'> {
  /** @default "small" */
  size?: ChoiceSize;
  /** `error` and `warning` recolour the whole control. @default "primary" */
  color?: ChoiceColor | 'default' | 'secondary';
  /** solid fills the box when selected, stroke only outlines it. @default "solid" */
  variant?: ChoiceVariant;
  /** Shorthand for `color="error"`. */
  error?: boolean;
  /** Renders the control with its label (Figma CheckboxList). */
  label?: ReactNode;
  /** Small text under the label. */
  metadata?: ReactNode;
  /** @default "end" */
  labelPlacement?: 'end' | 'start';
}

/** Pulse checkbox: 14/18/22px box inside a 32/40/44px hit area. */
export function Checkbox({ size = 'small', color = 'primary', variant = 'solid', error, label, metadata, labelPlacement, sx, disabled, ...rest }: CheckboxProps) {
  const tone: ChoiceColor = error ? 'error' : color === 'error' || color === 'warning' ? color : 'primary';
  const control = (
    <MuiCheckbox
      {...rest}
      disabled={disabled}
      disableRipple
      icon={<span className="pulse-box" />}
      checkedIcon={<span className="pulse-box"><CheckGlyph size={size} /></span>}
      indeterminateIcon={<span className="pulse-box"><DashGlyph size={size} /></span>}
      sx={[choiceRootSx('checkbox', size, tone, variant), ...(Array.isArray(sx) ? sx : [sx])] as never}
    />
  );
  if (label == null) return control;
  return <ChoiceLabel control={control} label={label} metadata={metadata} labelPlacement={labelPlacement} disabled={disabled} size={size} error={error} />;
}
