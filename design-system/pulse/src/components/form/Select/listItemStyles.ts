// Figma page "DropdownList": BuildingBlocks/ListItem + Dropdown container measurements, shared by Select,
// Autocomplete, the bordered variants and the country-code selector.
import { fw } from '../../../theme/typography';
import { disabledOpacity, textStyle } from '../../../theme/pulseTokens';

/** ListItem sizes: padding top-bottom / left-right / gap. */
export const rowSizes = {
  small: { py: 0, px: 8, gap: 8, h: 32 },
  medium: { py: 4, px: 12, gap: 12, h: 40 },
  large: { py: 6, px: 16, gap: 16, h: 44 },
} as const;

/** uiElements/dropDownList/color/* */
export const rowColors = { hover: '#f6f8fc', activeSingle: '#eef3fb', activeMulti: '#ffffff', focus: '#3b82f6' };

/** Dropdown container: white, radius 8, drop shadow (0,2,8,0,#00000033). */
export const menuPaperSx = { border: 'none', borderRadius: '8px', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)', backgroundColor: '#ffffff' } as const;

/** `sx` for one ListItem row (works on MenuItem or a plain li). Interactions: Default, Hover, Active, Active Hover, Focus, Disabled. */
export function listItemSx(size: keyof typeof rowSizes, multiple: boolean, hasMeta = false) {
  const r = rowSizes[size];
  return {
    ...textStyle('textL', 'medium'),
    display: 'flex',
    boxSizing: 'border-box',
    m: 0,
    borderRadius: 0,
    minHeight: r.h,
    py: `${hasMeta ? Math.max(r.py, 4) : r.py}px`,
    px: `${r.px}px`,
    gap: `${r.gap}px`,
    alignItems: 'center',
    whiteSpace: 'normal',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    '&:not(:last-child)': { mb: '2px' },
    '&:hover, &.pulse-hover': { backgroundColor: rowColors.hover },
    '&.Mui-selected, &[aria-selected="true"]': { backgroundColor: multiple ? rowColors.activeMulti : rowColors.activeSingle, fontWeight: multiple ? fw.medium : fw.semiBold, '&:hover, &.pulse-hover': { backgroundColor: rowColors.hover } },
    '&.Mui-focusVisible, &.pulse-focus': { boxShadow: `inset 0 0 0 2px ${rowColors.focus}` },
    '&.Mui-disabled, &[aria-disabled="true"]': { opacity: disabledOpacity, pointerEvents: 'none' },
  } as const;
}
