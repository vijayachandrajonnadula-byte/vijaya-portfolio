// Implements Figma page "DropdownList", set "Autocomplete" (Label Position Top/Left): label + atomTextField (Small, typing filters the
// list) + helper text. The list is the Figma "Dropdown" container made of BuildingBlocks/ListItem rows, shared with form/Select.
import { useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popper from '@mui/material/Popper';
import useAutocomplete from '@mui/material/useAutocomplete';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import { FormField } from '../../_shared/FormField';
import type { FormFieldProps } from '../../_shared/FormField';
import { AdornmentButton, fieldSizes, fieldSx } from '../../_shared/fieldStyles';
import type { FieldColor, FieldSize } from '../../_shared/fieldStyles';
import { Chip } from '../../data-display/Chip/Chip';
import { ListItemContent } from '../Select/ListItemContent';
import { listItemSx, menuPaperSx } from '../Select/listItemStyles';
import type { SelectOption } from '../Select/Select';
import { textStyle } from '../../../theme/pulseTokens';

export interface AutocompleteProps extends Omit<FormFieldProps, 'children' | 'htmlFor' | 'hintId'> {
  options: (SelectOption | string)[];
  /** Selected option value, or values when `multiple`. Omit for uncontrolled. */
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
  /** Several selections: checkbox rows, chips in the field. @default false */
  multiple?: boolean;
  placeholder?: string;
  /** Figma atomTextField Size. @default "small" (the Autocomplete instance is Small in Figma) */
  size?: FieldSize;
  color?: FieldColor;
  filled?: boolean;
  /** Chips shown before collapsing into "+N" when not focused (multiple). @default 2 */
  limitTags?: number;
  /** Menu height. @default 250 */
  maxMenuHeight?: number;
  /** Start with the list open (demos). */
  defaultOpen?: boolean;
  readOnly?: boolean;
  'data-spec'?: string;
}

const norm = (o: SelectOption | string): SelectOption => (typeof o === 'string' ? { label: o, value: o } : o);
const textOf = (o: SelectOption) => (typeof o.label === 'string' ? o.label : String(o.value));

/** Type-ahead dropdown. */
export function Autocomplete({
  options, value, defaultValue, onChange, multiple, placeholder = 'Search', size = 'small', color = 'primary', filled, limitTags = 2, maxMenuHeight = 250, defaultOpen, readOnly, 'data-spec': dataSpec,
  label, required, hint, hintVariant, hintIcon, error, disabled, fullWidth, labelPosition, labelWidth, labelAllCaps, labelInfo,
}: AutocompleteProps) {
  const id = useId();
  const items = useMemo(() => options.map(norm), [options]);
  const toOpts = (v: string | string[] | null | undefined): SelectOption | SelectOption[] | null => {
    if (multiple) return (Array.isArray(v) ? v : v ? [v] : []).map((x) => items.find((o) => o.value === x)).filter((o): o is SelectOption => !!o);
    const one = Array.isArray(v) ? v[0] : v;
    return items.find((o) => o.value === one) ?? null;
  };
  const [inner, setInner] = useState(() => toOpts(defaultValue));
  const controlled = value !== undefined;
  const current = controlled ? toOpts(value) : inner;
  const s = fieldSizes[size];
  const [open, setOpen] = useState(!!defaultOpen);

  const {
    getRootProps, getInputProps, getListboxProps, getOptionProps, getClearProps, getPopupIndicatorProps, groupedOptions, popupOpen, focused, anchorEl, setAnchorEl, dirty,
  } = useAutocomplete<SelectOption, boolean, false, false>({
    id,
    options: items,
    multiple: !!multiple,
    value: current as never,
    disabled,
    readOnly,
    open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    disableCloseOnSelect: !!multiple,
    getOptionLabel: textOf,
    getOptionDisabled: (o) => !!o.disabled,
    isOptionEqualToValue: (a, b) => a.value === b.value,
    onChange: (_e, v) => {
      if (!controlled) setInner(v as never);
      onChange?.(multiple ? (v as SelectOption[]).map((o) => String(o.value)) : v ? String((v as SelectOption).value) : null);
    },
  });

  const selected = (Array.isArray(current) ? current : current ? [current] : []) as SelectOption[];
  const chipSize = size === 'small' ? 'xxsmall' : 'xsmall';
  const shown = multiple && !focused ? selected.slice(0, limitTags) : selected;
  const extra = multiple && !focused ? selected.length - shown.length : 0;
  const stacked = !!multiple && selected.length > 0;
  const optionRows = groupedOptions as SelectOption[];
  const dirtyClear = dirty && !disabled && !readOnly;
  const rowSize = size;
  const popupWidth = anchorEl ? anchorEl.clientWidth : undefined;

  const chips: ReactNode =
    multiple && selected.length ? (
      <>
        {shown.map((o) => (
          <Chip key={String(o.value)} label={textOf(o)} color="brand" size={chipSize} onDelete={disabled || readOnly ? undefined : () => { const next = selected.filter((x) => x.value !== o.value); if (!controlled) setInner(next); onChange?.(next.map((x) => String(x.value))); }} />
        ))}
        {extra > 0 && (
          <Box component="span" sx={{ minWidth: 40, height: size === 'small' ? 20 : 24, px: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1000px', border: '1px solid #87a8d3', backgroundColor: '#f6f8fc', color: '#1e3a6e', ...textStyle('textM', 'medium') }}>+{extra}</Box>
        )}
      </>
    ) : undefined;

  return (
    <FormField
      label={label} required={required} hint={hint} hintVariant={hintVariant} hintIcon={hintIcon} error={error} disabled={disabled} fullWidth={fullWidth}
      labelPosition={labelPosition} labelWidth={labelWidth} labelAllCaps={labelAllCaps} labelInfo={labelInfo} htmlFor={id}
    >
      <Box {...getRootProps()} data-spec={dataSpec} sx={{ width: '100%' }}>
        <OutlinedInput
          ref={setAnchorEl}
          fullWidth
          placeholder={placeholder}
          error={error}
          disabled={disabled}
          readOnly={readOnly}
          inputProps={{ ...getInputProps(), 'aria-label': typeof label === 'string' ? label : 'Search' }}
          startAdornment={chips}
          endAdornment={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: `${s.gap}px`, ml: 'auto', ...(stacked ? { position: 'absolute', right: s.px, top: 0, height: s.h } : {}) }}>
              {dirtyClear && <AdornmentButton size={size} label="Clear" {...(getClearProps() as object)} />}
              {!readOnly && (
                <Box component="span" {...getPopupIndicatorProps()} sx={{ display: 'inline-flex', width: s.box, height: s.box, alignItems: 'center', justifyContent: 'center', color: '#090909', cursor: 'pointer', transform: popupOpen ? 'rotate(180deg)' : 'none', '& svg': { fontSize: s.glyph } }}>
                  <KeyboardArrowDownRounded />
                </Box>
              )}
            </Box>
          }
          className={focused ? 'Mui-focused' : undefined}
          sx={{
            '&&&': {
              ...fieldSx({ size, color, filled, readOnly, active: popupOpen, multiline: !!multiple && selected.length > 0 }),
              flexWrap: 'wrap',
              gap: '4px',
              // Multi-value field can wrap onto several rows: pin the clear/arrow icons to the first row instead of letting them wrap too.
              ...(stacked ? { paddingRight: `${s.px + 2 * s.box + s.gap}px` } : {}),
              '& .MuiOutlinedInput-input': { ...textStyle('textL', 'medium'), flex: '1 1 24px', minWidth: 24, width: 0, height: '20px', p: 0 },
            },
          }}
        />
      </Box>
      <Popper open={popupOpen && !!anchorEl} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1400, width: popupWidth }} modifiers={[{ name: 'offset', options: { offset: [0, 4] } }]}>
        <Box sx={{ ...menuPaperSx, maxHeight: maxMenuHeight, overflow: 'auto' }}>
          <Box component="ul" {...getListboxProps()} sx={{ listStyle: 'none', m: 0, py: '8px', px: 0 }}>
            {optionRows.length === 0 && <Box component="li" sx={{ ...textStyle('textL'), color: '#566680', px: '12px', py: '8px' }}>No options</Box>}
            {optionRows.map((o, index) => {
              const { key, ...rest } = getOptionProps({ option: o, index }) as ReturnType<typeof getOptionProps> & { key: string };
              const isSel = selected.some((x) => x.value === o.value);
              return (
                <Box component="li" key={key} {...rest} sx={{ ...listItemSx(rowSize, !!multiple, o.metadata != null), '&.Mui-focused': { backgroundColor: '#f6f8fc' } }}>
                  <ListItemContent option={o} multiple={multiple} selected={isSel} />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Popper>
    </FormField>
  );
}
