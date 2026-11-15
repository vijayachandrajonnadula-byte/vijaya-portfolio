// Implements Figma page "DropdownList", sets ".SelectwithBorder" and ".AutocompletewithBorder" (State Expanded/Default x Label Position Top/Left).
// Default = the normal atomTextField (Small). Expanded = the field and its Check Box list share one 1px #1e3a6e border
// (radius 4), the field loses its own border and keeps only its top corners (4/4/0/0), the list sits inside the border.
import { useId, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import OutlinedInput from '@mui/material/OutlinedInput';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import { FormField } from '../../_shared/FormField';
import type { FormFieldProps } from '../../_shared/FormField';
import { fieldFocusBorder, fieldSizes, fieldSx } from '../../_shared/fieldStyles';
import type { FieldColor, FieldSize } from '../../_shared/fieldStyles';
import { ListItemContent } from '../Select/ListItemContent';
import { listItemSx, menuPaperSx } from '../Select/listItemStyles';
import type { SelectOption } from '../Select/Select';
import { textStyle } from '../../../theme/pulseTokens';

export interface BorderedDropdownProps extends Omit<FormFieldProps, 'children' | 'htmlFor' | 'hintId'> {
  options: (SelectOption | string)[];
  /** Selected value(s). Omit for uncontrolled. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Check Box list (as drawn in Figma) vs single choice that closes on pick. @default true */
  multiple?: boolean;
  placeholder?: string;
  /** Figma "State = Expanded". Omit for uncontrolled. */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Figma atomTextField Size. @default "small" */
  size?: FieldSize;
  color?: FieldColor;
  filled?: boolean;
  /** List height. @default 168 */
  listHeight?: number;
  'data-spec'?: string;
}

const norm = (o: SelectOption | string): SelectOption => (typeof o === 'string' ? { label: o, value: o } : o);
const textOf = (o: SelectOption) => (typeof o.label === 'string' ? o.label : String(o.value));

function BorderedDropdown({
  searchable, options, value, defaultValue = [], onChange, multiple = true, placeholder, expanded, defaultExpanded = false, onExpandedChange, size = 'small', color = 'primary', filled, listHeight = 168, 'data-spec': dataSpec,
  label, required, hint, hintVariant, hintIcon, error, disabled, fullWidth, labelPosition, labelWidth, labelAllCaps, labelInfo,
}: BorderedDropdownProps & { searchable: boolean }) {
  const id = useId();
  const listId = `${id}-list`;
  const items = useMemo(() => options.map(norm), [options]);
  const [innerValue, setInnerValue] = useState<string[]>(defaultValue);
  const [innerOpen, setInnerOpen] = useState(defaultExpanded);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const selected = value ?? innerValue;
  const open = !disabled && (expanded ?? innerOpen);
  const s = fieldSizes[size];
  const setOpen = (next: boolean) => {
    if (expanded === undefined) setInnerOpen(next);
    onExpandedChange?.(next);
    if (!next) setQuery('');
  };
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return searchable && q ? items.filter((o) => textOf(o).toLowerCase().includes(q)) : items;
  }, [items, query, searchable]);
  const summary = selected.map((v) => { const o = items.find((x) => x.value === v); return o ? textOf(o) : v; }).join(', ');

  const pick = (o: SelectOption) => {
    if (o.disabled) return;
    const v = String(o.value);
    const next = multiple ? (selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]) : [v];
    if (value === undefined) setInnerValue(next);
    onChange?.(next);
    if (!multiple) setOpen(false);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) return setOpen(true);
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => (visible.length ? (i + step + visible.length) % visible.length : 0));
    } else if (e.key === 'Enter' || (e.key === ' ' && !searchable)) {
      e.preventDefault();
      if (!open) setOpen(true);
      else if (visible[active]) pick(visible[active]);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      if (open) setOpen(false);
    }
  };

  return (
    <FormField
      label={label} required={required} hint={hint} hintVariant={hintVariant} hintIcon={hintIcon} error={error} disabled={disabled} fullWidth={fullWidth}
      labelPosition={labelPosition} labelWidth={labelWidth} labelAllCaps={labelAllCaps} labelInfo={labelInfo} htmlFor={id}
    >
      <ClickAwayListener onClickAway={() => open && setOpen(false)}>
        <Box data-spec={dataSpec} sx={{ position: 'relative', height: s.h, width: '100%' }}>
          <Box
            sx={{
              ...(open ? { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, border: `1px solid ${fieldFocusBorder}`, borderRadius: '4px', backgroundColor: '#ffffff', boxSizing: 'border-box' } : {}),
            }}
          >
            <OutlinedInput
              fullWidth
              error={error}
              disabled={disabled}
              placeholder={placeholder ?? (searchable ? 'Search' : 'Select')}
              value={searchable && open ? query : summary}
              onChange={(e) => { setQuery(e.target.value); setActive(0); }}
              onClick={() => !open && setOpen(true)}
              onKeyDown={onKeyDown}
              inputProps={{
                id,
                role: 'combobox',
                'aria-expanded': open,
                'aria-controls': listId,
                'aria-haspopup': 'listbox',
                'aria-activedescendant': open && visible[active] ? `${id}-opt-${active}` : undefined,
                readOnly: !searchable,
                style: searchable ? undefined : { cursor: 'pointer', textOverflow: 'ellipsis' },
              }}
              endAdornment={<KeyboardArrowDownRounded sx={{ fontSize: s.glyph, color: '#090909', transform: open ? 'rotate(180deg)' : 'none', flex: '0 0 auto' }} />}
              sx={{
                ...fieldSx({ size, color, filled }),
                ...(open ? { borderRadius: '4px 4px 0 0', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent !important', borderRadius: '4px 4px 0 0' }, '&.Mui-focused': { boxShadow: 'none' } } : {}),
              }}
            />
            {open && (
              <Box sx={{ ...menuPaperSx, boxSizing: 'border-box', maxHeight: listHeight, overflow: 'auto' }}>
                <Box component="ul" id={listId} role="listbox" aria-multiselectable={multiple || undefined} sx={{ listStyle: 'none', m: 0, py: '8px', px: 0 }}>
                  {visible.length === 0 && <Box component="li" sx={{ ...textStyle('textL'), color: '#566680', px: '12px', py: '8px' }}>No options</Box>}
                  {visible.map((o, i) => {
                    const isSel = selected.includes(String(o.value));
                    return (
                      <Box
                        component="li"
                        key={String(o.value)}
                        id={`${id}-opt-${i}`}
                        role="option"
                        aria-selected={isSel}
                        aria-disabled={o.disabled || undefined}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => pick(o)}
                        className={i === active ? 'pulse-hover' : undefined}
                        sx={listItemSx(size, multiple, o.metadata != null)}
                      >
                        <ListItemContent option={o} multiple={multiple} selected={isSel} />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </ClickAwayListener>
    </FormField>
  );
}

/** Select whose open state draws one border around field and list (".SelectwithBorder"). */
export function SelectWithBorder(props: BorderedDropdownProps) {
  return <BorderedDropdown {...props} searchable={false} />;
}

/** Autocomplete whose open state draws one border around field and list (".AutocompletewithBorder"). */
export function AutocompleteWithBorder(props: BorderedDropdownProps) {
  return <BorderedDropdown {...props} searchable />;
}
