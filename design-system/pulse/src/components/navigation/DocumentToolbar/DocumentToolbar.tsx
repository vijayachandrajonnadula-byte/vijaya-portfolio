// Implements Figma page "Document Toolbar": 48px bar, 16px side padding, 8px gap, 24px icon buttons, 1x16 dividers,
// font dropdowns, wrap enabled, 1px bottom border, trailing slot (panel toggles).
import type { ReactElement, ReactNode } from 'react';
import Box from '@mui/material/Box';
import { ToolbarButton, ToolbarDivider, ToolbarDropdown } from '../../form/RichTextEditor/RichTextEditor';
import { pt } from '../../../theme/pulseTokens';

export interface DocumentToolbarButton {
  type?: 'button';
  id: string;
  label: string;
  icon: ReactElement;
  active?: boolean;
  disabled?: boolean;
}
export interface DocumentToolbarDropdown {
  type: 'dropdown';
  id: string;
  label: string;
  /** Text shown in the closed dropdown. */
  value: string;
  width?: number;
  options: string[];
}
export type DocumentToolbarItem = DocumentToolbarButton | DocumentToolbarDropdown | { type: 'divider'; id?: string };

export interface DocumentToolbarProps {
  /** Buttons, dropdowns and dividers in order (the Figma file only carries the structure, not the glyphs). */
  items: DocumentToolbarItem[];
  /** Ids of toggle buttons that are currently on. */
  activeIds?: string[];
  /** Fires for button clicks (`id`) and dropdown picks (`id`, `value`). */
  onAction?: (id: string, value?: string) => void;
  /** Right-aligned content (Figma "Slot"), e.g. a save status or share button. */
  slot?: ReactNode;
  disabled?: boolean;
}

/** Top control bar of a document editor. */
export function DocumentToolbar({ items, activeIds = [], onAction, slot, disabled }: DocumentToolbarProps) {
  return (
    <Box
      role="toolbar"
      aria-label="Document formatting"
      data-spec="document-toolbar"
      sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', minHeight: 48, boxSizing: 'border-box', px: '16px', bgcolor: pt.formElements.color.primary.defaultBackground, borderBottom: `1px solid ${pt.uiElements.divider.color.solidColor}` }}
    >
      {items.map((it, i) => {
        if (it.type === 'divider') return <ToolbarDivider key={`d${i}`} />;
        if (it.type === 'dropdown') {
          return <ToolbarDropdown key={it.id} label={it.label} text={it.value} width={it.width} disabled={disabled} options={it.options.map((o) => ({ label: o, selected: o === it.value, onPick: () => onAction?.(it.id, o) }))} />;
        }
        return (
          <ToolbarButton key={it.id} label={it.label} active={it.active ?? activeIds.includes(it.id)} disabled={disabled || it.disabled} onClick={() => onAction?.(it.id)}>
            {it.icon}
          </ToolbarButton>
        );
      })}
      {slot != null && <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', minWidth: 97 }}>{slot}</Box>}
    </Box>
  );
}

