// Shared input field + popper used by DatePicker / DateRangePicker / DateTimePicker / TimePicker
// (Figma "DatePicker", "TimePicker", "DateTimePicker" sets: Label Position = Top | Left, Small input field).
import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popover from '@mui/material/Popover';
import CloseRounded from '@mui/icons-material/CloseRounded';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { IconButton } from '../../actions/IconButton/IconButton';
import { pt } from '../../../theme/pulseTokens';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat); // Q (quarter) token

/** Values the Pulse app passes: ISO strings, Date, Dayjs or null. */
export type DateInput = Dayjs | Date | string | null | undefined;
export const toDayjs = (v: DateInput): Dayjs | null => {
  if (v == null || v === '') return null;
  const d = dayjs(v);
  return d.isValid() ? d : null;
};
export const parseStrict = (text: string, format: string): Dayjs | null => {
  const d = dayjs(text, format, true);
  return d.isValid() ? d : null;
};

export interface PickerFieldBaseProps {
  label?: ReactNode;
  /** @default "top" */
  labelPosition?: 'top' | 'left';
  required?: boolean;
  hint?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  /** @default "medium" (40px); "small" is 32px (Figma input field). */
  size?: 'small' | 'medium';
  placeholder?: string;
  fullWidth?: boolean;
  /** Allow clearing the value. @default true */
  clearable?: boolean;
  name?: string;
  id?: string;
}

interface PickerFieldProps extends PickerFieldBaseProps {
  text: string;
  onTextCommit: (text: string) => void;
  onClear?: () => void;
  icon: ReactNode;
  popupLabel: string;
  children: (close: () => void) => ReactNode;
  popupWidth?: number;
  /** Called when the popup closes without OK (dismiss). */
  onDismiss?: () => void;
}

export function PickerField({ label, labelPosition = 'top', required, hint, error, disabled, size = 'medium', placeholder, fullWidth = true, clearable = true, name, id, text, onTextCommit, onClear, icon, popupLabel, children, onDismiss }: PickerFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(text);
  const anchor = useRef<HTMLDivElement>(null);
  useEffect(() => setDraft(text), [text]);
  const close = () => setOpen(false);
  const left = labelPosition === 'left';

  return (
    <FormControl fullWidth={fullWidth} error={error} disabled={disabled} required={required} sx={{ minWidth: pt.formElements.formElementMinWidth, flexDirection: left ? 'row' : 'column', alignItems: left ? 'flex-start' : undefined, gap: left ? '12px' : 0 }}>
      {label != null && (
        <FormLabel htmlFor={inputId} sx={{ mb: left ? 0 : pt.spacing.xs, width: left ? 120 : undefined, flexShrink: 0, lineHeight: left ? (size === 'small' ? '32px' : '40px') : undefined }}>
          {label}
        </FormLabel>
      )}
      <Box sx={{ flex: 1, minWidth: 0, width: left ? undefined : '100%' }}>
        <OutlinedInput
          ref={anchor}
          id={inputId}
          name={name}
          size={size}
          fullWidth
          value={draft}
          placeholder={placeholder}
          error={error}
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => draft !== text && onTextCommit(draft)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onTextCommit(draft);
            if (e.key === 'ArrowDown' && e.altKey) setOpen(true);
          }}
          endAdornment={
            <InputAdornment position="end" sx={{ gap: 0.5, mr: -0.5 }}>
              {clearable && onClear && text && !disabled && (
                <Box component="button" type="button" aria-label="Clear" onClick={onClear} sx={{ display: 'inline-flex', p: 0, border: 0, bgcolor: 'transparent', cursor: 'pointer', color: 'text.secondary' }}>
                  <CloseRounded sx={{ fontSize: 16 }} />
                </Box>
              )}
              <IconButton ariaLabel={popupLabel} size="xsmall" disabled={disabled} onClick={() => setOpen((o) => !o)}>
                {icon}
              </IconButton>
            </InputAdornment>
          }
        />
        {hint != null && <FormHelperText sx={{ mt: pt.spacing.xs }}>{hint}</FormHelperText>}
      </Box>
      <Popover
        open={open}
        anchorEl={anchor.current}
        onClose={() => {
          close();
          onDismiss?.();
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { mt: '4px', borderRadius: '8px', boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.2)', overflow: 'visible' } } }}
      >
        {children(close)}
      </Popover>
    </FormControl>
  );
}
