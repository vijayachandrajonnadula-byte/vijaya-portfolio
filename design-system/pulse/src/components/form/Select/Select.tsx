// Figma page "DropdownList": sets "Select" (field), "BuildingBlocks/ListItem" (option row) and "Dropdown" (menu styles).
import { fw } from '../../../theme/typography';
import { useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Checkbox } from '../Checkbox/Checkbox';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect from '@mui/material/Select';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { FormField } from '../../_shared/FormField';
import type { FormFieldProps } from '../../_shared/FormField';
import { AdornmentButton, fieldFocusBorder, fieldSizes, fieldSx } from '../../_shared/fieldStyles';
import type { FieldColor, FieldSize } from '../../_shared/fieldStyles';
import { Chip } from '../../data-display/Chip/Chip';
import { disabledOpacity, textStyle } from '../../../theme/pulseTokens';
import { rowColors, rowSizes } from './listItemStyles';
import { scrollBarSx } from '../../data-display/ScrollBar/ScrollBar';

export interface SelectOption {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
  /** Second line under the label (List with MetaData). */
  metadata?: ReactNode;
  /** Group heading this option belongs to (variant "grouped-select"). */
  group?: string;
  /** Small chips at the end of the row (Chip 1 / Chip 2). */
  chips?: string[];
  /** 16px icon before the label (Left Icon). */
  icon?: ReactNode;
  /** 24px avatar before the label. */
  avatar?: ReactNode;
  /** Icon at the end of the row (Right Icon). */
  rightIcon?: ReactNode;
  /** CSS colour: draws the 20px colour square (Color Selector). */
  color?: string;
  /** Indent level 0..3, 16px each. */
  indent?: 0 | 1 | 2 | 3;
}

export type SelectVariant = 'default' | 'metadata' | 'checkbox' | 'checkbox-metadata' | 'chip' | 'chip-metadata' | 'grouped-select';

export interface SelectProps extends Omit<FormFieldProps, 'children' | 'htmlFor' | 'hintId'> {
  options: (SelectOption | string)[];
  /** A string, or an array for the multiple-choice variants. */
  value?: string | number | (string | number)[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  /** @default "medium" (40px). small 32px, large 44px. */
  size?: FieldSize;
  color?: FieldColor;
  filled?: boolean;
  /**
   * default: single choice. metadata: single, with a second line. checkbox / checkbox-metadata: multi-choice with checkboxes.
   * chip / chip-metadata: multi-choice shown as chips in the field. grouped-select: single choice under group headings.
   * @default "default"
   */
  variant?: SelectVariant;
  /** Chips shown before collapsing into "+N" (chip variants). @default 2 */
  limitTags?: number;
  /** Menu height. @default "250px" */
  dropdownHeight?: string;
  /** Multi-choice summary: shows "<n> <suffix>" instead of the joined labels, e.g. "items selected". */
  selectionCountLabelSuffix?: string;
  /** Shows a view button in the field while something is selected. */
  onViewSelectedItem?: () => void;
  /** Hide the clear button. */
  hideClearIcon?: boolean;
  /** Filter box at the top of the menu ("Inside Search"). */
  searchable?: boolean;
  readOnly?: boolean;
  /** Start with the menu open (demos). */
  defaultOpen?: boolean;
  'data-spec'?: string;
}

const norm = (o: SelectOption | string): SelectOption => (typeof o === 'string' ? { label: o, value: o } : o);


function Swatch({ color }: { color: string }) {
  return <Box component="span" sx={{ width: 20, height: 20, borderRadius: '4px', backgroundColor: color, flex: '0 0 20px' }} />;
}

/** Dropdown. Field = atomTextField with an arrow; options = BuildingBlocks/ListItem; menu = Dropdown. */
export function Select({
  options, value, onChange, placeholder = 'Select', size = 'medium', color = 'primary', filled, variant = 'default', limitTags = 2, dropdownHeight = '250px',
  selectionCountLabelSuffix, onViewSelectedItem, hideClearIcon, searchable, readOnly, defaultOpen, 'data-spec': dataSpec,
  label, required, hint, hintVariant, hintIcon, error, disabled, fullWidth, labelPosition, labelWidth, labelAllCaps, labelInfo,
}: SelectProps) {
  const id = useId();
  const [open, setOpen] = useState(!!defaultOpen);
  const [query, setQuery] = useState('');
  const s = fieldSizes[size];
  const r = rowSizes[size];
  const multiple = variant === 'checkbox' || variant === 'checkbox-metadata' || variant === 'chip' || variant === 'chip-metadata';
  const chipField = variant === 'chip' || variant === 'chip-metadata';
  const items = useMemo(() => options.map(norm), [options]);
  const current = multiple ? (Array.isArray(value) ? value : []) : Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
  const selected = (Array.isArray(current) ? current : current === '' ? [] : [current]) as (string | number)[];
  const labelOf = (v: string | number) => items.find((o) => o.value === v)?.label ?? String(v);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((o) => typeof o.label !== 'string' || o.label.toLowerCase().includes(q)) : items;
  }, [items, query]);
  const hasValue = selected.length > 0;
  const showClear = hasValue && !hideClearIcon && !disabled && !readOnly;
  const iconSlot = s.box + 4;
  const reserved = iconSlot + (showClear ? s.box + s.gap : 0) + (onViewSelectedItem && hasValue ? s.box + s.gap : 0);
  const chipSize = size === 'small' ? 'xxsmall' : 'xsmall';

  const renderValue = (): ReactNode => {
    if (!hasValue) return <span style={{ color: '#5f6f86' }}>{placeholder}</span>;
    if (chipField) {
      const shown = selected.slice(0, limitTags);
      return (
        <Box component="span" sx={{ display: 'inline-flex', gap: '6px', alignItems: 'center', verticalAlign: 'middle' }}>
          {shown.map((v) => (
            <Chip key={String(v)} label={labelOf(v)} color="brand" size={chipSize} />
          ))}
          {selected.length > shown.length && (
            <Box component="span" sx={{ minWidth: 40, height: size === 'small' ? 20 : 24, px: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1000px', border: '1px solid #87a8d3', backgroundColor: '#f6f8fc', color: '#1e3a6e', ...textStyle('textM', 'medium') }}>
              +{selected.length - shown.length}
            </Box>
          )}
        </Box>
      );
    }
    if (multiple && selectionCountLabelSuffix) return `${selected.length} ${selectionCountLabelSuffix}`;
    return selected.map((v, i) => (
      <span key={String(v)}>
        {i > 0 && ', '}
        {labelOf(v)}
      </span>
    ));
  };

  const optionNode = (o: SelectOption) => {
    const withMeta = o.metadata != null;
    const isSel = selected.includes(o.value);
    return (
      <MenuItem
        key={String(o.value)}
        value={o.value}
        disabled={o.disabled}
        disableRipple
        sx={{
          ...textStyle('textL', multiple ? 'medium' : 'medium'),
          m: 0,
          borderRadius: 0,
          minHeight: r.h,
          py: `${withMeta ? Math.max(r.py, 4) : r.py}px`,
          px: `${r.px}px`,
          gap: `${r.gap}px`,
          alignItems: 'center',
          whiteSpace: 'normal',
          color: '#0f172a',
          backgroundColor: '#ffffff',
          '&:not(:last-child)': { mb: '2px' },
          '&:hover': { backgroundColor: rowColors.hover },
          '&.Mui-selected': { backgroundColor: multiple ? rowColors.activeMulti : rowColors.activeSingle, fontWeight: multiple ? fw.medium : fw.semiBold, '&:hover': { backgroundColor: rowColors.hover } },
          '&.Mui-focusVisible': { backgroundColor: isSel && !multiple ? rowColors.activeSingle : '#ffffff', boxShadow: `inset 0 0 0 2px ${rowColors.focus}` },
          '&.Mui-disabled': { opacity: disabledOpacity },
        }}
      >
        {o.indent ? <Box component="span" sx={{ flex: `0 0 ${16 * o.indent}px` }} /> : null}
        {multiple && <Checkbox size="small" tabIndex={-1} checked={isSel} disabled={o.disabled} sx={{ width: 14, p: '9px 0' }} />}
        {o.color && <Swatch color={o.color} />}
        {o.avatar != null && <Box component="span" sx={{ display: 'inline-flex', flex: '0 0 24px' }}>{o.avatar}</Box>}
        {o.icon != null && <Box component="span" sx={{ display: 'inline-flex', flex: '0 0 16px', '& svg': { fontSize: 16 } }}>{o.icon}</Box>}
        <Box component="span" sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', py: withMeta ? 0 : '6px' }}>
          <span>{o.label}</span>
          {withMeta && <Box component="span" sx={{ ...textStyle('textS'), color: '#566680' }}>{o.metadata}</Box>}
        </Box>
        {o.chips?.map((c) => <Chip key={c} label={c} color="default" size="xxsmall" />)}
        {o.rightIcon != null && <Box component="span" sx={{ display: 'inline-flex', flex: '0 0 18px', '& svg': { fontSize: 18 } }}>{o.rightIcon}</Box>}
      </MenuItem>
    );
  };

  const children: ReactNode[] = [];
  if (searchable) {
    children.push(
      <ListSubheader key="__search" disableSticky={false} sx={{ p: '0 8px 6px', lineHeight: 'normal', backgroundColor: '#ffffff' }} onKeyDown={(e) => e.stopPropagation()}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', height: 32, px: '8px', border: '1.5px solid #d3e0f2', borderRadius: '4px', '&:focus-within': { borderColor: fieldFocusBorder } }}>
          <SearchRounded sx={{ fontSize: 14, color: '#566680' }} />
          <Box component="input" autoFocus aria-label="Search options" placeholder="Search" value={query} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} sx={{ ...textStyle('textL', 'medium'), flex: 1, minWidth: 0, border: 0, outline: 0, background: 'none', color: '#0f172a', '&::placeholder': { color: '#5f6f86' } }} />
        </Box>
      </ListSubheader>,
    );
  }
  if (variant === 'grouped-select') {
    let last: string | undefined;
    visible.forEach((o) => {
      if (o.group !== undefined && o.group !== last) {
        last = o.group;
        children.push(
          <ListSubheader key={`g-${o.group}`} sx={{ ...textStyle('textS', 'bold'), letterSpacing: '0.05em', textTransform: 'uppercase', color: '#566680', lineHeight: '24px', px: `${r.px}px`, backgroundColor: '#ffffff' }}>
            {o.group}
          </ListSubheader>,
        );
      }
      children.push(optionNode(o));
    });
  } else {
    visible.forEach((o) => children.push(optionNode(o)));
  }

  return (
    <FormField
      label={label} required={required} hint={hint} hintVariant={hintVariant} hintIcon={hintIcon} error={error} disabled={disabled} fullWidth={fullWidth}
      labelPosition={labelPosition} labelWidth={labelWidth} labelAllCaps={labelAllCaps} labelInfo={labelInfo} htmlFor={id}
    >
      <MuiSelect
        id={id}
        data-spec={dataSpec}
        size={size === 'small' ? 'small' : 'medium'}
        multiple={multiple}
        displayEmpty
        readOnly={readOnly}
        open={open}
        onOpen={() => !readOnly && setOpen(true)}
        onClose={() => {
          setOpen(false);
          setQuery('');
        }}
        value={current}
        IconComponent={(p) => <KeyboardArrowDownRounded {...p} />}
        onChange={(e) => {
          const v = e.target.value;
          onChange?.(multiple ? (v as unknown as string[]) : String(v));
        }}
        renderValue={renderValue}
        endAdornment={
          showClear || (onViewSelectedItem && hasValue) ? (
            <Box sx={{ position: 'absolute', right: s.px + iconSlot, top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: `${s.gap}px` }}>
              {onViewSelectedItem && hasValue && (
                <AdornmentButton size={size} label="View selected" onClick={onViewSelectedItem}>
                  <VisibilityOutlined />
                </AdornmentButton>
              )}
              {showClear && <AdornmentButton size={size} label="Clear" onClick={() => onChange?.(multiple ? [] : '')} />}
            </Box>
          ) : undefined
        }
        sx={[
          fieldSx({ size, color, filled, readOnly, active: open }),
          {
            '& .MuiSelect-select.MuiOutlinedInput-input': { display: 'flex', alignItems: 'center', height: 'auto', minHeight: 20, py: chipField ? '2px' : 0, pr: `${reserved}px !important`, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
            '& .MuiSelect-icon': { right: s.px, width: s.glyph, height: s.glyph, top: `calc(50% - ${s.glyph / 2}px)`, color: '#090909', display: readOnly ? 'none' : undefined },
          },
        ]}
        MenuProps={{
          slotProps: {
            paper: { sx: { maxHeight: dropdownHeight, border: 'none', borderRadius: '8px', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)', backgroundColor: '#ffffff', ...(scrollBarSx('light') as object) } },
            list: { sx: { py: '8px' } },
          },
        }}
      >
        {children}
      </MuiSelect>
    </FormField>
  );
}
