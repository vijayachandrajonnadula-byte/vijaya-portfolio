// Implements Figma page "DropdownList", set "Inline Dropdown" (Variant Page Title / Body x Interaction Default / Hover / Focus):
// a text trigger (Sub Heading 2, or 12/20 body text) with a 14px down arrow, 8px apart, opening the Dropdown list.
import { fw } from '../../../theme/typography';
import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ArrowDown01Icon } from '../../../icons';
import { listItemSx, menuPaperSx } from '../Select/listItemStyles';
import { focusRing, textStyle } from '../../../theme/pulseTokens';

export type InlineDropdownVariant = 'pageTitle' | 'body';
export type InlineDropdownInteraction = 'default' | 'hover' | 'focus';

export interface InlineDropdownOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface InlineDropdownProps {
  options: (InlineDropdownOption | string)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Figma Variant. @default "body" */
  variant?: InlineDropdownVariant;
  /** Pins a Figma Interaction look (for documentation); real hover/focus come from the pointer and keyboard. */
  interaction?: InlineDropdownInteraction;
  /** Shown while nothing is selected. @default "Select" */
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const norm = (o: InlineDropdownOption | string): InlineDropdownOption => (typeof o === 'string' ? { label: o, value: o } : o);

/** Text-sized dropdown trigger for page titles and inline content. */
export function InlineDropdown({ options, value, defaultValue, onChange, variant = 'body', interaction, placeholder = 'Select', disabled, ariaLabel }: InlineDropdownProps) {
  const id = useId();
  const items = options.map(norm);
  const [inner, setInner] = useState(defaultValue ?? '');
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const current = value ?? inner;
  const selected = items.find((o) => o.value === current);
  const title = variant === 'pageTitle';
  return (
    <>
      <ButtonBase
        id={id}
        disableRipple
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={!!anchor}
        aria-label={ariaLabel}
        className={interaction === 'focus' ? 'Mui-focusVisible' : interaction === 'hover' ? 'pulse-hover' : undefined}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '4px',
          color: title ? '#0f172a' : '#1e293b',
          textAlign: 'left',
          ...(title ? textStyle('heading5', 'semiBold') : { ...textStyle('textM', 'semiBold'), fontSize: 12, lineHeight: '20px' }),
          // Figma Body: Semi Bold at rest, Medium in the Hover/Focus variants.
          ...(title ? {} : { '&:hover, &.pulse-hover, &.Mui-focusVisible': { fontWeight: fw.medium } }),
          '&.Mui-focusVisible': { boxShadow: focusRing },
          '&.Mui-disabled': { opacity: 0.38 },
          '& svg': { flex: '0 0 14px' },
        }}
      >
        <Box component="span">{selected?.label ?? placeholder}</Box>
        <ArrowDown01Icon size={14} />
      </ButtonBase>
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { ...menuPaperSx, minWidth: 160 } }, list: { sx: { py: '8px' }, 'aria-labelledby': id } }}
      >
        {items.map((o) => (
          <MenuItem
            key={o.value}
            selected={o.value === current}
            disabled={o.disabled}
            disableRipple
            onClick={() => {
              if (value === undefined) setInner(o.value);
              onChange?.(o.value);
              setAnchor(null);
            }}
            sx={listItemSx('small', false)}
          >
            {o.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
