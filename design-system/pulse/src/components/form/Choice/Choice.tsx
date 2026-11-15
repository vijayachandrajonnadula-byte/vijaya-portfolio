// Implements Figma pages "Checkbox" (Checkbox Group), "Radio" (RadioGroup) and "Switch" (SwitchWithLabel).
import { fw } from '../../../theme/typography';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import MuiRadioGroup from '@mui/material/RadioGroup';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Checkbox } from '../Checkbox/Checkbox';
import { Radio } from '../Radio/Radio';
import { Switch } from '../Switch/Switch';
import type { SwitchColor } from '../Switch/Switch';
import { labelTextSx } from '../../_shared/choiceControl';
import type { ChoiceColor, ChoiceSize, ChoiceVariant } from '../../_shared/choiceControl';
import type { FormFieldProps } from '../../_shared/FormField';
import { disabledOpacity, pt } from '../../../theme/pulseTokens';

export interface ChoiceOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
  /** Small description under the label. */
  metadata?: ReactNode;
}

const fieldLabelSx = { fontFamily: "'Inter Variable', Inter, sans-serif", fontSize: 14, lineHeight: '20px', fontWeight: fw.semiBold, color: pt.colors.neutral[900] } as const;

interface FieldShellProps {
  label?: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  hintVariant?: FormFieldProps['hintVariant'];
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Where the group label sits. @default "top" */
  labelPosition?: 'top' | 'left';
  children: ReactNode;
}

/** Group label (top or left), the controls, and the helper / error message below (Figma Checkbox Group / RadioGroup). */
function FieldShell({ label, required, hint, hintVariant, error, disabled, fullWidth = true, labelPosition = 'top', children }: FieldShellProps) {
  const left = labelPosition === 'left';
  const labelNode = label != null && (
    <Box component="span" sx={{ ...fieldLabelSx, display: 'flex', gap: '2px', alignItems: 'center', minHeight: left ? 32 : undefined, flexShrink: 0, ...(left ? { width: 200 } : {}) }}>
      {label}
      {required && <Box component="span" sx={{ color: pt.colors.neutral[400] }}>*</Box>}
    </Box>
  );
  const hintNode = hint != null && (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 12, lineHeight: '20px', color: error ? pt.colors.accent.red[600] : pt.colors.neutral[500] }}>
      {hintVariant === 'info' && <InfoOutlined sx={{ fontSize: 14 }} />}
      <span>{hint}</span>
    </Box>
  );
  return (
    <Box role="group" sx={{ display: 'flex', flexDirection: left ? 'row' : 'column', gap: left ? '24px' : '4px', width: fullWidth ? '100%' : 'fit-content', opacity: disabled ? disabledOpacity : 1 }}>
      {labelNode}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: left ? 1 : undefined, minWidth: 0 }}>
        {children}
        {hintNode}
      </Box>
    </Box>
  );
}

export interface SwitchWithLabelProps {
  /** Text next to the switch (Figma "value" text). */
  label: ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  /** @default "small" */
  size?: 'small' | 'medium';
  /** Which side of the switch the value text sits on. @default "end" */
  labelPlacement?: 'start' | 'end';
  disabled?: boolean;
  color?: SwitchColor;
  indeterminate?: boolean;
  /** Field label (Figma "Label"), placed per `fieldLabelPosition`. */
  fieldLabel?: ReactNode;
  /** @default "top" */
  fieldLabelPosition?: 'top' | 'left';
  hint?: ReactNode;
  error?: boolean;
}

/** Switch with its text label (Figma SwitchWithLabel). */
export function SwitchWithLabel({ label, checked, onChange, size = 'small', labelPlacement = 'end', disabled, color, indeterminate, fieldLabel, fieldLabelPosition = 'top', hint, error }: SwitchWithLabelProps) {
  const sw = <Switch size={size} color={color} indeterminate={indeterminate} disabled={disabled} checked={checked} onChange={(_, v) => onChange?.(v)} />;
  const text = <Box component="span" sx={{ ...labelTextSx, fontSize: 12, opacity: disabled ? disabledOpacity : 1 }}>{label}</Box>;
  const row = (
    <Box component="label" sx={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minHeight: 20, cursor: disabled ? 'default' : 'pointer', width: 'fit-content' }}>
      {labelPlacement === 'start' && text}
      {sw}
      {labelPlacement === 'end' && text}
    </Box>
  );
  if (fieldLabel == null && hint == null) return row;
  return (
    <FieldShell label={fieldLabel} hint={hint} error={error} labelPosition={fieldLabelPosition} fullWidth={false}>
      {row}
    </FieldShell>
  );
}

interface GroupProps extends Omit<FormFieldProps, 'children' | 'htmlFor'> {
  options: ChoiceOption[];
  /** Lay options out in a row. @default false */
  row?: boolean;
  size?: ChoiceSize;
  color?: ChoiceColor;
  variant?: ChoiceVariant;
  /** @default "top" */
  labelPosition?: 'top' | 'left';
}

export interface CheckboxGroupProps extends GroupProps {
  value: string[];
  onChange: (value: string[]) => void;
}

/** Group of checkboxes bound to a string[] value. In `error` the boxes turn red and the hint shows as the error message. */
export function CheckboxGroup({ options, value, onChange, row, size = 'small', color = 'primary', variant, label, required, hint, hintVariant, error, disabled, fullWidth, labelPosition }: CheckboxGroupProps) {
  const toggle = (v: string, on: boolean) => onChange(on ? [...value, v] : value.filter((x) => x !== v));
  return (
    <FieldShell label={label} required={required} hint={hint} hintVariant={hintVariant} error={error} disabled={disabled} fullWidth={fullWidth} labelPosition={labelPosition}>
      <Box sx={{ display: 'flex', flexDirection: row ? 'row' : 'column', flexWrap: 'wrap', columnGap: '16px' }}>
        {options.map((o) => (
          <Checkbox
            key={o.value}
            label={o.label}
            metadata={o.metadata}
            size={size}
            color={color}
            variant={variant}
            error={error}
            disabled={o.disabled}
            checked={value.includes(o.value)}
            onChange={(_, on) => toggle(o.value, on)}
          />
        ))}
      </Box>
    </FieldShell>
  );
}

export interface RadioGroupProps extends GroupProps {
  value: string;
  onChange: (value: string) => void;
}

/** Group of radios bound to a string value. */
export function RadioGroup({ options, value, onChange, row, size = 'small', color = 'primary', variant, label, required, hint, hintVariant, error, disabled, fullWidth, labelPosition }: RadioGroupProps) {
  return (
    <FieldShell label={label} required={required} hint={hint} hintVariant={hintVariant} error={error} disabled={disabled} fullWidth={fullWidth} labelPosition={labelPosition}>
      <MuiRadioGroup row={row} value={value} onChange={(_, v) => onChange(v)} sx={{ columnGap: '16px', flexWrap: 'wrap' }}>
        {options.map((o) => (
          <Radio key={o.value} value={o.value} label={o.label} metadata={o.metadata} size={size} color={color} variant={variant} error={error} disabled={o.disabled} />
        ))}
      </MuiRadioGroup>
    </FieldShell>
  );
}


