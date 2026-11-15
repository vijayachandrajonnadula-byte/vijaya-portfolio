// Implements Figma page "Radio": Radio (Size x Style x Color x State x Interaction) and Radio List (label + metadata).
import type { ReactNode } from 'react';
import MuiRadio from '@mui/material/Radio';
import type { RadioProps as MuiRadioProps } from '@mui/material/Radio';
import { ChoiceLabel, choiceRootSx } from '../../_shared/choiceControl';
import type { ChoiceColor, ChoiceSize, ChoiceVariant } from '../../_shared/choiceControl';

export interface RadioProps extends Omit<MuiRadioProps, 'size' | 'color' | 'icon' | 'checkedIcon' | 'disableRipple'> {
  /** @default "small" */
  size?: ChoiceSize;
  /** @default "primary" */
  color?: ChoiceColor | 'default' | 'secondary';
  /** solid fills the disc when selected, stroke keeps a white disc with a coloured dot. @default "solid" */
  variant?: ChoiceVariant;
  /** Shorthand for `color="error"`. */
  error?: boolean;
  label?: ReactNode;
  metadata?: ReactNode;
  /** @default "end" */
  labelPlacement?: 'end' | 'start';
}

/** Pulse radio: 14/18/22px disc inside a 32/40/44px hit area. */
export function Radio({ size = 'small', color = 'primary', variant = 'solid', error, label, metadata, labelPlacement, sx, disabled, ...rest }: RadioProps) {
  const tone: ChoiceColor = error ? 'error' : color === 'error' || color === 'warning' ? color : 'primary';
  const control = (
    <MuiRadio
      {...rest}
      disabled={disabled}
      disableRipple
      icon={<span className="pulse-box" />}
      checkedIcon={<span className="pulse-box"><span className="pulse-dot" /></span>}
      sx={[choiceRootSx('radio', size, tone, variant), ...(Array.isArray(sx) ? sx : [sx])] as never}
    />
  );
  if (label == null) return control;
  return <ChoiceLabel control={control} label={label} metadata={metadata} labelPlacement={labelPlacement} disabled={disabled} size={size} error={error} />;
}
