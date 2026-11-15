// Figma page "TextField", set "Search" (Label Position x Search Icon Position) built on atomTextField, Size = Small by default.
import type { ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { TextField } from '../TextField/TextField';
import type { TextFieldProps } from '../TextField/TextField';
import { fieldSizes } from '../../_shared/fieldStyles';
import type { FieldSize } from '../../_shared/fieldStyles';
import { pt } from '../../../theme/pulseTokens';

export interface SearchProps
  extends Pick<TextFieldProps, 'label' | 'required' | 'hint' | 'hintVariant' | 'error' | 'color' | 'filled' | 'labelPosition' | 'labelWidth' | 'readOnly' | 'autoFocus' | 'onBlur' | 'onFocus'> {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Called when the clear button is pressed. */
  handleClear?: () => void;
  placeholder?: string;
  /** @default "small" (32px) */
  size?: FieldSize;
  showSearchIcon?: boolean;
  /** Force the clear button on / off. By default it shows while there is a value and `handleClear` is set. */
  showCloseIcon?: boolean;
  /** "Search Icon Position": which side the search icon sits on. @default "start" */
  position?: 'start' | 'end';
  disabled?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
}

/** Search input with a search icon (left or right) and a clear button. */
export function Search({
  value, onChange, handleClear, placeholder = 'Search', size = 'small', showSearchIcon = true, showCloseIcon, position = 'start', disabled, fullWidth = true, ariaLabel = 'Search', ...field
}: SearchProps) {
  const glyph = <SearchRounded aria-hidden="true" sx={{ fontSize: fieldSizes[size].glyph, color: (value ?? '') === '' ? '#6c757e' : '#0f172a' }} />; // AtomIconSearch: Placeholder #6c757e, Filled default dark
  const showClear = showCloseIcon !== false && !!handleClear && (showCloseIcon === true || (value ?? '') !== '');
  return (
    <Box role="search" sx={{ minWidth: fullWidth ? `min(${pt.custom.search.input.minWidth}, 100%)` : undefined, width: fullWidth ? '100%' : undefined, display: fullWidth ? 'block' : 'inline-block' }}>
      <TextField
        {...field}
        size={size}
        fullWidth
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange as TextFieldProps['onChange']}
        onClear={showClear ? handleClear : undefined}
        startAdornment={showSearchIcon && position === 'start' ? glyph : undefined}
        endAdornment={showSearchIcon && position === 'end' ? glyph : undefined}
        inputProps={{ 'aria-label': ariaLabel }}
      />
    </Box>
  );
}

