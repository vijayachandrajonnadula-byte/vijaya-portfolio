// Implements Figma page "TextField", set "PhoneNumber" (Label Position Top/Left): label, a country-code atomTextField (56px) and the
// number atomTextField (grows) 8px apart, helper text below. Also ".Builing blocks/AtomIconSearch" (Icon State x Sizes S/M/L) and the
// "Country Code" style of the DropdownList "Dropdown" set (search field + ListItems with a country flag).
import { useId, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { FormField } from '../../_shared/FormField';
import type { FormFieldProps } from '../../_shared/FormField';
import { fieldSizes, fieldSx } from '../../_shared/fieldStyles';
import type { FieldColor, FieldSize } from '../../_shared/fieldStyles';
import { TextField } from '../TextField/TextField';
import { listItemSx, menuPaperSx } from '../Select/listItemStyles';
import { ArrowDown01Icon, Search02Icon } from '../../../icons';
import { textStyle } from '../../../theme/pulseTokens';

/* ------------------------------------------------------------- AtomIconSearch */
const searchIconPx = { S: 14, M: 16, L: 18 } as const;

export interface AtomIconSearchProps {
  /** Figma "Icon State": Filled = text colour, Placeholder = #6C757E. @default "placeholder" */
  state?: 'filled' | 'placeholder';
  /** Figma "Sizes": 14 / 16 / 18px. @default "M" */
  size?: 'S' | 'M' | 'L';
}

/** Search glyph used inside search-style fields. */
export function AtomIconSearch({ state = 'placeholder', size = 'M' }: AtomIconSearchProps) {
  return <Search02Icon size={searchIconPx[size]} color={state === 'placeholder' ? '#6c757e' : undefined} />;
}

/* ------------------------------------------------------------- countries */
export interface CountryCode {
  /** ISO 3166-1 alpha-2, e.g. "IN". */
  iso: string;
  name: string;
  /** Dial code with plus sign, e.g. "+91". */
  dial: string;
}

/** A small default list; pass `countries` for the full set. */
export const defaultCountries: CountryCode[] = [
  { iso: 'IN', name: 'India', dial: '+91' },
  { iso: 'US', name: 'United States', dial: '+1' },
  { iso: 'GB', name: 'United Kingdom', dial: '+44' },
  { iso: 'DE', name: 'Germany', dial: '+49' },
  { iso: 'FR', name: 'France', dial: '+33' },
  { iso: 'CH', name: 'Switzerland', dial: '+41' },
  { iso: 'AU', name: 'Australia', dial: '+61' },
  { iso: 'JP', name: 'Japan', dial: '+81' },
  { iso: 'SG', name: 'Singapore', dial: '+65' },
  { iso: 'AE', name: 'United Arab Emirates', dial: '+971' },
];

/** Regional-indicator flag emoji (the Figma flag artwork is not bundled; platforms without flag glyphs show the letters). */
const flagOf = (iso: string) => String.fromCodePoint(...[...iso.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

/* ------------------------------------------------------------- CountryCodeSelect */
export interface CountryCodeSelectProps {
  /** ISO code of the selected country. */
  value: string;
  onChange: (iso: string) => void;
  countries?: CountryCode[];
  size?: FieldSize;
  color?: FieldColor;
  filled?: boolean;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Start with the list open (demos). */
  defaultOpen?: boolean;
  ariaLabel?: string;
}

/** The 56px country-code field and its "Country Code" dropdown (search box + flag rows). */
export function CountryCodeSelect({ value, onChange, countries = defaultCountries, size = 'small', color = 'primary', filled, error, disabled, readOnly, defaultOpen, ariaLabel = 'Country code' }: CountryCodeSelectProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const [query, setQuery] = useState('');
  const s = fieldSizes[size];
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? countries.filter((c) => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase() === q) : countries;
  }, [countries, query]);
  const current = countries.find((c) => c.iso === value);
  return (
    <FormControl disabled={disabled} error={error} sx={{ flex: '0 0 auto' }}>
    <MuiSelect
      value={current ? value : ''}
      displayEmpty
      open={open}
      readOnly={readOnly}
      disabled={disabled}
      error={error}
      onOpen={() => !readOnly && setOpen(true)}
      onClose={() => { setOpen(false); setQuery(''); }}
      onChange={(e) => onChange(String(e.target.value))}
      inputProps={{ 'aria-label': ariaLabel }}
      renderValue={() => <span style={{ whiteSpace: 'nowrap' }}>{current?.dial ?? '+'}</span>}
      IconComponent={() => <ArrowDown01Icon size={14} style={{ position: 'absolute', right: s.px, pointerEvents: 'none' }} />}
      sx={[
        fieldSx({ size, color, filled, readOnly, active: open }),
        {
          flex: '0 0 auto',
          minWidth: 56,
          '& .MuiSelect-select.MuiOutlinedInput-input': { display: 'flex', alignItems: 'center', height: 'auto', minHeight: 20, py: 0, pr: '18px !important', overflow: 'visible' },
        },
      ]}
      MenuProps={{
        slotProps: { paper: { sx: { ...menuPaperSx, minWidth: 322, maxHeight: 224 } }, list: { sx: { py: '8px' } } },
      }}
    >
      <ListSubheader sx={{ p: '0 8px 8px', lineHeight: 'normal', backgroundColor: '#ffffff' }} onKeyDown={(e) => e.stopPropagation()}>
        <TextField
          size="small"
          placeholder="Search country"
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setQuery(e.target.value)}
          startAdornment={<AtomIconSearch state="placeholder" size="M" />}
          autoFocus
          inputProps={{ 'aria-label': 'Search country' }}
        />
      </ListSubheader>
      {visible.map((c) => (
        <MenuItem key={c.iso} value={c.iso} disableRipple sx={listItemSx('small', false)}>
          <Box component="span" aria-hidden sx={{ flex: '0 0 16px', fontSize: 14, lineHeight: '16px' }}>{flagOf(c.iso)}</Box>
          <Box component="span" sx={{ flex: 1 }}>{c.name}</Box>
          <Box component="span" sx={{ ...textStyle('textM'), color: '#566680' }}>{c.dial}</Box>
        </MenuItem>
      ))}
    </MuiSelect>
    </FormControl>
  );
}

/* ------------------------------------------------------------- PhoneNumber */
export interface PhoneNumberProps extends Omit<FormFieldProps, 'children' | 'htmlFor' | 'hintId'> {
  /** National number. Omit for uncontrolled. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Selected country ISO code. Omit for uncontrolled. @default "IN" */
  country?: string;
  onCountryChange?: (iso: string) => void;
  countries?: CountryCode[];
  placeholder?: string;
  /** Figma atomTextField Size; the PhoneNumber instance is Small. @default "small" */
  size?: FieldSize;
  color?: FieldColor;
  filled?: boolean;
  readOnly?: boolean;
  name?: string;
  'data-spec'?: string;
}

/** Country-code selector + phone number input. */
export function PhoneNumber({
  value, defaultValue = '', onChange, country, onCountryChange, countries = defaultCountries, placeholder = 'Phone number', size = 'small', color = 'primary', filled, readOnly, name, 'data-spec': dataSpec,
  label, required, hint, hintVariant, hintIcon, error, disabled, fullWidth, labelPosition, labelWidth, labelAllCaps, labelInfo,
}: PhoneNumberProps) {
  const id = useId();
  const [innerNumber, setInnerNumber] = useState(defaultValue);
  const [innerCountry, setInnerCountry] = useState(country ?? 'IN');
  const number = value ?? innerNumber;
  const iso = country ?? innerCountry;
  return (
    <FormField
      label={label} required={required} hint={hint} hintVariant={hintVariant} hintIcon={hintIcon} error={error} disabled={disabled} fullWidth={fullWidth}
      labelPosition={labelPosition} labelWidth={labelWidth} labelAllCaps={labelAllCaps} labelInfo={labelInfo} htmlFor={id}
    >
      <Box data-spec={dataSpec} sx={{ display: 'flex', gap: '8px', width: '100%' }}>
        <CountryCodeSelect
          value={iso}
          onChange={(v) => { if (country === undefined) setInnerCountry(v); onCountryChange?.(v); }}
          countries={countries}
          size={size}
          color={color}
          filled={filled}
          error={error}
          disabled={disabled}
          readOnly={readOnly}
        />
        <OutlinedInput
          id={id}
          name={name}
          type="tel"
          fullWidth
          placeholder={placeholder}
          value={number}
          error={error}
          disabled={disabled}
          readOnly={readOnly}
          onChange={(e) => { if (value === undefined) setInnerNumber(e.target.value); onChange?.(e.target.value); }}
          inputProps={{ inputMode: 'tel', autoComplete: 'tel-national' }}
          sx={fieldSx({ size, color, filled, readOnly })}
        />
      </Box>
    </FormField>
  );
}
