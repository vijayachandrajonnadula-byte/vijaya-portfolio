// Figma pages: "TextField" (BuildingBlocks/atomTextField, TextField, PhoneNumber) and "Textarea" (atomTextArea, TextArea).
import { forwardRef, useId, useState } from 'react';
import type { ChangeEventHandler, FocusEventHandler, KeyboardEvent, ReactNode } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { FormField } from '../../_shared/FormField';
import type { FormFieldProps } from '../../_shared/FormField';
import { AdornmentButton, fieldSizes, fieldSx } from '../../_shared/fieldStyles';
import type { FieldColor, FieldSize } from '../../_shared/fieldStyles';
import { Chip } from '../../data-display/Chip/Chip';
import { scrollBarSx } from '../../data-display/ScrollBar/ScrollBar';

export interface TextFieldProps extends Omit<FormFieldProps, 'children' | 'htmlFor' | 'hintId'> {
  /** "Size": small 32px, medium 40px, large 44px. @default "medium" */
  size?: FieldSize;
  /** "Color": validation colour of the border (error also follows the `error` prop). @default "primary" */
  color?: FieldColor;
  /** "Filled? = Yes": tinted (#F6F8FC) background. */
  filled?: boolean;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  type?: string;
  name?: string;
  id?: string;
  multiline?: boolean;
  rows?: number;
  readOnly?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  /** Shows a clear button while the field has a value. */
  onClear?: () => void;
  /** "Input Type = Tag Input": chips rendered inside the field; Enter / comma adds, Backspace removes the last. */
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  autoFocus?: boolean;
  maxLength?: number;
  autoComplete?: string;
  inputProps?: Record<string, unknown>;
}

/** Single-line (or multiline) text input with Pulse label / hint layout. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label, required, hint, hintVariant, hintIcon, error, disabled, fullWidth, labelPosition, labelWidth, labelAllCaps, labelInfo,
    size = 'medium', color = 'primary', filled, startAdornment, endAdornment, onClear, tags, onTagsChange, id, value, readOnly, multiline, rows,
    type, inputProps, maxLength, ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const [reveal, setReveal] = useState(false);
  const [draft, setDraft] = useState('');
  const s = fieldSizes[size];
  const isPassword = type === 'password';
  const hasValue = value !== undefined && value !== '';
  const showClear = !!onClear && hasValue && !disabled && !readOnly;
  const tagMode = tags !== undefined;

  const addTag = (raw: string) => {
    const t = raw.trim();
    if (t && !tags?.includes(t)) onTagsChange?.([...(tags ?? []), t]);
    setDraft('');
  };
  const onTagKey = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === 'Backspace' && draft === '' && tags && tags.length > 0) {
      onTagsChange?.(tags.slice(0, -1));
    }
  };

  const tagNodes = tagMode ? (
    <>
      {tags.map((t) => (
        <Chip key={t} label={t} color="brand" size="xsmall" onDelete={disabled || readOnly ? undefined : () => onTagsChange?.(tags.filter((x) => x !== t))} />
      ))}
    </>
  ) : null;

  const end = (showClear || (isPassword && !readOnly) || endAdornment) && (
    <InputAdornment position="end">
      {showClear && <AdornmentButton size={size} label="Clear" onClick={onClear} />}
      {isPassword && !readOnly && (
        <AdornmentButton size={size} label={reveal ? 'Hide password' : 'Show password'} onClick={() => setReveal((r) => !r)} disabled={disabled}>
          {reveal ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
        </AdornmentButton>
      )}
      {endAdornment}
    </InputAdornment>
  );

  return (
    <FormField
      label={label} required={required} hint={hint} hintVariant={hintVariant} hintIcon={hintIcon} error={error} disabled={disabled} fullWidth={fullWidth}
      labelPosition={labelPosition} labelWidth={labelWidth} labelAllCaps={labelAllCaps} labelInfo={labelInfo} htmlFor={inputId} hintId={hintId}
    >
      <OutlinedInput
        inputRef={ref}
        id={inputId}
        size={size === 'small' ? 'small' : 'medium'}
        value={tagMode ? draft : value}
        type={isPassword && reveal ? 'text' : type}
        multiline={multiline}
        rows={multiline ? rows ?? 3 : undefined}
        readOnly={readOnly}
        sx={[
          fieldSx({ size, color, filled, multiline, readOnly }),
          multiline ? { minHeight: 80, '& textarea': scrollBarSx('light') as object } : null,
          tagMode ? { flexWrap: 'wrap', height: 'auto', py: `${(s.h - 24) / 2 - 1.5}px`, '& .MuiOutlinedInput-input': { flex: '1 1 60px', minWidth: 60, height: '24px' } } : null,
        ]}
        startAdornment={startAdornment || tagNodes ? <>{startAdornment ? <InputAdornment position="start">{startAdornment}</InputAdornment> : null}{tagNodes}</> : undefined}
        endAdornment={end || undefined}
        onKeyDown={tagMode ? onTagKey : undefined}
        slotProps={{ input: { 'aria-describedby': hint != null ? hintId : undefined, 'aria-invalid': error || undefined, maxLength, ...inputProps } }}
        {...(tagMode ? { onChange: (e) => setDraft(e.target.value), onBlur: () => addTag(draft) } : {})}
        {...(tagMode ? {} : rest)}
        {...(tagMode ? { placeholder: tags.length === 0 ? rest.placeholder : undefined } : {})}
      />
    </FormField>
  );
});
TextField.displayName = 'TextField';

export type TextAreaProps = Omit<TextFieldProps, 'multiline' | 'tags' | 'onTagsChange'>;

/** Multiline text input (Figma "Textarea": min height 80px, 3 rows by default). */
export const TextArea = forwardRef<HTMLInputElement, TextAreaProps>(function TextArea({ rows = 3, ...props }, ref) {
  return <TextField ref={ref} multiline rows={rows} {...props} />;
});
TextArea.displayName = 'TextArea';


