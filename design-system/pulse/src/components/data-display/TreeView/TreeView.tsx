// Implements Figma page "Tree": set "BuildingBlocks/Tree List" (Hierarchy Tier 1..7 x Interaction). Built on @mui/x-tree-view RichTreeView.
import { fw } from '../../../theme/typography';
import { forwardRef } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';
import FolderOutlined from '@mui/icons-material/FolderOutlined';
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined';
import { disabledOpacity, focusRing, pt } from '../../../theme/pulseTokens';
import { Checkbox } from '../../form/Checkbox/Checkbox';
import type { CheckboxProps } from '../../form/Checkbox/Checkbox';

export interface TreeViewItem {
  id: string;
  label: string;
  /** Meta line under the label (Figma textContent Meta Data). */
  metadata?: string;
  /** Overrides the folder / file glyph. */
  icon?: ReactNode;
  disabled?: boolean;
  children?: TreeViewItem[];
}

export interface TreeViewProps {
  items: TreeViewItem[];
  /** Show a checkbox per row (multi select). @default false */
  checkBox?: boolean;
  /** Selected item ids. */
  selectedItems?: string[];
  /** Called with the new selection (ids). */
  handleSelection?: (ids: string[]) => void;
  /** Hide the folder / file glyph column. @default true */
  showIcons?: boolean;
  /** Ids expanded initially. */
  defaultExpandedItems?: string[];
  /** Total width of the tree. */
  width?: number | string;
}

const tc = pt.uiElements.tree.color;
const DOT = '#5f6f86';

/** MUI X renders a stock MUI Checkbox per row; swap it for the Pulse Checkbox (Figma: BuildingBlock/Checkbox Small, 32x32). */
const RowCheckbox = forwardRef<HTMLButtonElement, { visible?: boolean } & Omit<CheckboxProps, 'ref'>>(function RowCheckbox({ visible, ...props }, ref) {
  if (!visible) return null;
  return <Checkbox {...props} ref={ref} size="small" />;
});

const Item = forwardRef<HTMLLIElement, TreeItemProps & { showIcons: boolean }>(function Item({ showIcons, ...props }, ref) {
  const model = useTreeItemModel<TreeViewItem>(props.itemId);
  const hasChildren = Boolean(model?.children?.length);
  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{ ...props.slots, checkbox: RowCheckbox as never }}
      label={
        // display: contents lets the icon, checkbox and text be siblings, so they can be ordered as in Figma (arrow, icon, checkbox, text).
        <Box data-spec="tree row" sx={{ display: 'contents' }}>
          {showIcons && (
            <Box component="span" sx={{ order: 1, width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, '& svg': { fontSize: 18 }, color: '#0f172a' }}>
              {model?.icon ?? (hasChildren ? <FolderOutlined /> : <InsertDriveFileOutlined />)}
            </Box>
          )}
          <Box sx={{ order: 3, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: model?.metadata ? 0 : '6px', pl: showIcons ? '6px' : 0, flex: 1 }}>
            <Box sx={{ fontFamily: pt.typographyStyles.textM.medium.fontFamily, fontSize: 12, lineHeight: '20px', fontWeight: fw.medium, color: tc.filledType.textDefault, pt: model?.metadata ? '6px' : 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{model?.label}</Box>
            {model?.metadata && <Box sx={{ fontFamily: pt.typographyStyles.textM.regular.fontFamily, fontSize: 12, lineHeight: '18px', color: '#566680', pb: '4px' }}>{model.metadata}</Box>}
          </Box>
        </Box>
      }
    />
  );
});

/** Hierarchical list: 32px arrow / icon / checkbox columns, 32px indentation with dotted guides, hover / selected / focus / disabled rows. */
export function TreeView({ items, checkBox = false, selectedItems, handleSelection, showIcons = true, defaultExpandedItems, width = 320 }: TreeViewProps) {
  const onChange = (_: SyntheticEvent | null, ids: string[] | string | null) => {
    handleSelection?.(ids == null ? [] : Array.isArray(ids) ? ids : [ids]);
  };
  const common = {
    items,
    isItemDisabled: (item: TreeViewItem) => Boolean(item.disabled),
    defaultExpandedItems,
    itemChildrenIndentation: 32,
    slots: { item: (p: TreeItemProps) => <Item {...p} showIcons={showIcons} />, expandIcon: KeyboardArrowRightRounded, collapseIcon: KeyboardArrowDownRounded },
    sx: {
      width,
      '& .MuiTreeItem-content': {
        boxSizing: 'border-box',
        minHeight: 32,
        padding: 0,
        gap: '0px',
        borderRadius: pt.radius.xs,
        color: tc.filledType.textDefault,
        '&:hover': { background: tc.filledType.hoverBg, color: tc.textHover },
        '&.Mui-selected, &.Mui-selected:hover': { background: tc.filledType.activeBg, boxShadow: 'inset 2px 0 0 0 #1e3a6e' },
        // Figma "Active Hover": hover background, the 2px left stroke is dropped.
        '&.Mui-selected:hover': { background: tc.filledType.activeHoverBg, boxShadow: 'none' },
        '&.Mui-focused': { background: 'transparent', boxShadow: focusRing },
        '&.Mui-selected.Mui-focused': { boxShadow: `inset 2px 0 0 0 #1e3a6e, ${focusRing}` },
        '&.Mui-disabled': { opacity: disabledOpacity },
      },
      '& .MuiTreeItem-iconContainer': { order: 0, width: 32, height: 32, margin: 0, justifyContent: 'center', alignItems: 'center', '& svg': { fontSize: 18 } },
      '& .MuiTreeItem-checkbox': { order: 2, margin: 0 },
      '& .MuiTreeItem-groupTransition': { marginLeft: '15px', paddingLeft: 0, borderLeft: `1px dotted ${DOT}` },
      '& .MuiTreeItem-label': { display: 'contents' },
    },
  } as const;
  const labelledBy = { 'aria-label': 'Tree' };
  if (checkBox) {
    return <RichTreeView {...common} {...labelledBy} multiSelect checkboxSelection selectedItems={selectedItems} onSelectedItemsChange={onChange as never} />;
  }
  return <RichTreeView {...common} {...labelledBy} selectedItems={selectedItems?.[0] ?? null} onSelectedItemsChange={onChange as never} />;
}
