import { useState } from 'react';
import { Box } from '../../../components/mui';
import { DropdownMenu } from '../../../components/form/DropdownMenu/DropdownMenu';
import type { SelectOption } from '../../../components/form/Select/Select';
import { ArrowDown01Icon } from '../../../icons';
import { actRef, ref } from '../refTheme';
import { RefButton, focusRing } from '../shell/RefControls';
import { W, tx } from './parts';

export interface RefSelectProps {
  value: string | number | null;
  placeholder: string;
  options: SelectOption[];
  onSelect: (o: SelectOption) => void;
  ariaLabel: string;
  disabled?: boolean;
  title?: string;
  /** 'cell' = table-cell select (32px, 12.5px, line border, 6px radius). 'field' = filter-bar select (38px, 13px, 7px radius, 12px / 34px padding). @default 'cell' */
  variant?: 'cell' | 'field';
}

/**
 * NOT FROM FIGMA. The 32px select of the reference drawers (12.5px text, 6px radius, 10px padding): a plain trigger button that
 * opens the design-system DropdownMenu for the list. Pulse Select is 32px too but its text is 14px, so the trigger is drawn here.
 */
export function RefSelect({ value, placeholder, options, onSelect, ariaLabel, disabled, title, variant = 'cell' }: RefSelectProps) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const current = options.find((o) => o.value === value);
  const field = variant === 'field';
  return (
    <>
      <RefButton
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={!!el}
        disabled={disabled}
        title={title}
        onClick={(e) => setEl(e.currentTarget)}
        sx={{
          width: '100%', height: field ? 38 : 32, p: field ? '0 12px' : '0 10px', gap: '8px', boxSizing: 'border-box', justifyContent: 'space-between', border: `1px solid ${field ? actRef.fieldLine : ref.line}`, borderRadius: field ? '7px' : '6px', background: disabled ? ref.tint2 : ref.white, opacity: disabled ? 0.7 : 1, textAlign: 'left',
          '&:hover:not(:disabled)': { borderColor: ref.blue4 }, '&:disabled': { cursor: 'not-allowed', opacity: 0.7 }, ...focusRing,
        }}
      >
        <Box component="span" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...tx(field ? 13 : 12.5, W.regular, current || field ? ref.ink : ref.muted2, field ? 18 : 18.125) }}>{current ? current.label : placeholder}</Box>
        <Box aria-hidden sx={{ display: 'flex', color: ref.muted, flexShrink: 0 }}><ArrowDown01Icon size={14} /></Box>
      </RefButton>
      <DropdownMenu anchorEl={el} open={!!el} onClose={() => setEl(null)} ariaLabel={ariaLabel} options={options} selected={value ?? undefined} onSelect={onSelect} />
    </>
  );
}
