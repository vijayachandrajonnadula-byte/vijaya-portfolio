import type { ReactNode } from 'react';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import { HelperText } from '../form/HelperText/HelperText';
import type { HelperTextVariant } from '../form/HelperText/HelperText';
import { FieldLabel } from '../form/TextFormat/TextFormat';
import { pt } from '../../theme/pulseTokens';

export type FormFieldHintVariant = 'default' | HelperTextVariant;

export interface FormFieldProps {
  label?: ReactNode;
  required?: boolean;
  /** Helper text under the control. */
  hint?: ReactNode;
  /**
   * default (grey) | info | warning | success | error. `info` also shows the status glyph. `error` on the field wins.
   * @default "default"
   */
  hintVariant?: FormFieldHintVariant;
  /** Show the status glyph before the hint whatever the variant. */
  hintIcon?: boolean;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Figma "Label Position": label above (top) or in a 200px column beside the control (left). @default "top" */
  labelPosition?: 'top' | 'left';
  /** Width of the left label column. @default 200 */
  labelWidth?: number | string;
  /** Render the label in caps (textLabel "All Caps? = Yes"). */
  labelAllCaps?: boolean;
  /** Trailing label affordance (e.g. an info icon button). */
  labelInfo?: ReactNode;
  htmlFor?: string;
  /** id applied to the hint, for aria-describedby. */
  hintId?: string;
  children: ReactNode;
}

/** Label above (or beside), control, hint below: the layout every Pulse form control uses. Gap 4, left label gap 24. */
export function FormField({
  label,
  required,
  hint,
  hintVariant = 'default',
  hintIcon,
  error,
  disabled,
  fullWidth = true,
  labelPosition = 'top',
  labelWidth = 200,
  labelAllCaps,
  labelInfo,
  htmlFor,
  hintId,
  children,
}: FormFieldProps) {
  const variant: HelperTextVariant = error ? 'error' : hintVariant === 'default' ? 'normal' : hintVariant;
  const labelNode =
    label != null ? (
      <FieldLabel htmlFor={htmlFor} required={required} allCaps={labelAllCaps} info={labelInfo}>
        {label}
      </FieldLabel>
    ) : null;
  const hintNode =
    hint != null ? (
      <HelperText id={hintId} variant={variant} showIcon={hintIcon ?? hintVariant === 'info'}>
        {hint}
      </HelperText>
    ) : null;
  const left = labelPosition === 'left';
  return (
    <FormControl
      fullWidth={fullWidth}
      error={error}
      disabled={disabled}
      required={required}
      sx={{ minWidth: fullWidth ? undefined : pt.formElements.formElementMinWidth, opacity: 1, flexDirection: left ? 'row' : 'column', gap: left ? '24px' : '4px', alignItems: left ? 'flex-start' : 'stretch' }}
    >
      {left ? (
        <>
          {labelNode && <Box sx={{ flex: `0 0 ${typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth}`, py: '8px', opacity: disabled ? 0.38 : 1 }}>{labelNode}</Box>}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {children}
            {hintNode}
          </Box>
        </>
      ) : (
        <>
          {labelNode && <Box sx={{ opacity: disabled ? 0.38 : 1 }}>{labelNode}</Box>}
          {children}
          {hintNode}
        </>
      )}
    </FormControl>
  );
}
