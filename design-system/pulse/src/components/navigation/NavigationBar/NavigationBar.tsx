// Implements Figma page "Navigation Bar": component "Navigation Bar" (48px, white, bottom divider; Tabs left, slot right, scroll arrows).
import type { ReactNode, SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import { Tab, Tabs } from '../Tabs/Tabs';

export interface NavigationBarItem {
  label: ReactNode;
  startIcon?: ReactNode;
  badgeContent?: number;
  disabled?: boolean;
}

export interface NavigationBarProps {
  items: NavigationBarItem[];
  /** Index of the selected item. */
  value: number;
  onChange: (event: SyntheticEvent, value: number) => void;
  /** Right-aligned content (toggle group, icon buttons, select ...). */
  slot?: ReactNode;
  /** Scroll the tabs with arrow buttons when they overflow. @default true */
  isScrollable?: boolean;
}

/** Secondary page navigation: solid small Tabs on the left and an action slot on the right. */
export function NavigationBar({ items, value, onChange, slot, isScrollable = true }: NavigationBarProps) {
  return (
    <Box component="nav" aria-label="Page navigation" data-spec="navigation-bar" sx={{ display: 'flex', alignItems: 'center', gap: '8px', height: 48, boxSizing: 'border-box', pl: '12px', pr: '24px', background: '#fff', boxShadow: 'inset 0 -1px 0 0 #e2e8f0', width: '100%' }}>
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex' }}>
        <Tabs value={value} handleChange={onChange} variation="solid" size="small" isScrollable={isScrollable}>
          {items.map((it, i) => (
            <Tab key={i} index={i} label={it.label} startIcon={it.startIcon} badgeContent={it.badgeContent} disabled={it.disabled} />
          ))}
        </Tabs>
      </Box>
      {slot && <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>{slot}</Box>}
    </Box>
  );
}
