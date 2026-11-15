// Action menu built from Figma "DropdownList" > BuildingBlocks/ListItem rows (same row look as Select / Autocomplete lists).
// The Figma file has no standalone "menu" component: this reuses the dropdown list rows for menus opened by a button
// (e.g. the split Create button). Menu surface and row hover/selected colours come from the theme (MuiMenu / MuiMenuItem).
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItemContent } from '../Select/ListItemContent';
import type { SelectOption } from '../Select/Select';

export interface DropdownMenuProps {
  /** Element the menu opens from. */
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  options: SelectOption[];
  /** Called with the chosen option; the menu closes afterwards. */
  onSelect?: (option: SelectOption) => void;
  /** Highlight the option with this value. */
  selected?: string | number;
  /** Menu alignment against the anchor. @default "left" */
  align?: 'left' | 'right';
  /** Accessible name of the menu. */
  ariaLabel?: string;
}

/** A menu of dropdown list rows. */
export function DropdownMenu({ anchorEl, open, onClose, options, onSelect, selected, align = 'left', ariaLabel }: DropdownMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: align }}
      transformOrigin={{ vertical: 'top', horizontal: align }}
      slotProps={{ list: { 'aria-label': ariaLabel } }}
    >
      {options.map((o) => (
        <MenuItem
          key={o.value}
          disabled={o.disabled}
          selected={o.value === selected}
          onClick={() => {
            onClose();
            onSelect?.(o);
          }}
          sx={{ gap: '8px', minWidth: 160 }}
        >
          <ListItemContent option={o} selected={o.value === selected} />
        </MenuItem>
      ))}
    </Menu>
  );
}
