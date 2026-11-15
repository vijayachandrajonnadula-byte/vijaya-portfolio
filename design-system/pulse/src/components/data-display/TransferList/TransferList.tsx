// Pulse "TransferList" page: Transfer List = Footer Style | Toaster Style | Drag and Drop Style (Accordion / Table styles are
// not built). Panel: 400 wide, radius 8, shadow 0 2 8 #00000033, padding 8, search field, 50px list items (multi-select checkbox
// rows, pad 0/8, gap 2), footer bar #f6f8fc with Select All + record count + pill button.
import { fw } from '../../../theme/typography';
import { useMemo, useState } from 'react';
import type { DragEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import { Button } from '../../actions/Button/Button';
import { Checkbox } from '../../form/Checkbox/Checkbox';
import { Search } from '../../form/Search/Search';
import { disabledOpacity, pt } from '../../../theme/pulseTokens';

export interface TransferItem {
  id: string;
  label: ReactNode;
  /** Text used by the search field. Defaults to `label` when it is a string. */
  searchText?: string;
  description?: ReactNode;
  disabled?: boolean;
}

export interface TransferListProps {
  items: TransferItem[];
  /** Ids in the selected (right) list. */
  value: string[];
  onChange: (ids: string[]) => void;
  /** footer: Select All + count in a footer bar. toaster: Select All in the title row, action bar appears on selection. dragDrop: drag rows between lists. @default "footer" */
  variant?: 'footer' | 'toaster' | 'dragDrop';
  availableTitle?: ReactNode;
  selectedTitle?: ReactNode;
  /** @default 400 */
  panelWidth?: number;
  height?: number;
}

const shadow = '0px 2px 8px 0px rgba(0, 0, 0, 0.2)';
const dd = pt.uiElements.dropDownList.color;

interface PanelProps {
  title: ReactNode;
  items: TransferItem[];
  variant: NonNullable<TransferListProps['variant']>;
  width: number;
  height: number;
  actionLabel: string;
  onMove: (ids: string[]) => void;
  /** Drag payload side: where items dropped here come from. */
  side: 'available' | 'selected';
  onDropIds: (ids: string[], to: 'available' | 'selected') => void;
}

function Panel({ title, items, variant, width, height, actionLabel, onMove, side, onDropIds }: PanelProps) {
  const [query, setQuery] = useState('');
  const [checked, setChecked] = useState<string[]>([]);
  const visible = useMemo(
    () => items.filter((i) => !query || (i.searchText ?? (typeof i.label === 'string' ? i.label : '')).toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );
  const selectable = visible.filter((i) => !i.disabled).map((i) => i.id);
  const live = checked.filter((id) => items.some((i) => i.id === id));
  const allChecked = selectable.length > 0 && selectable.every((id) => live.includes(id));
  const some = live.length > 0 && !allChecked;
  const toggleAll = () => setChecked(allChecked ? [] : selectable);
  const toggle = (id: string) => setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const move = () => {
    onMove(live);
    setChecked([]);
  };
  const dragStart = (e: DragEvent, id: string) => {
    const ids = live.includes(id) ? live : [id];
    e.dataTransfer.setData('text/plain', JSON.stringify({ from: side, ids }));
    e.dataTransfer.effectAllowed = 'move';
  };
  const drop = (e: DragEvent) => {
    if (variant !== 'dragDrop') return;
    e.preventDefault();
    try {
      const { from, ids } = JSON.parse(e.dataTransfer.getData('text/plain')) as { from: string; ids: string[] };
      if (from !== side) onDropIds(ids, side);
    } catch {
      /* ignore foreign drops */
    }
  };
  const selectAll = (
    <Box sx={{ display: 'flex', flexDirection: variant === 'toaster' ? 'row-reverse' : 'row', alignItems: 'center', gap: pt.spacing.xs }}>
      <Checkbox size="small" variant={variant === 'footer' ? 'stroke' : 'solid'} checked={allChecked} indeterminate={some} onChange={toggleAll} slotProps={{ input: { 'aria-label': 'Select all' } }} />
      <Box sx={{ fontSize: 12, lineHeight: '20px', fontWeight: fw.medium }}>Select All</Box>
    </Box>
  );
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: pt.spacing.m, width }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 32 }}>
        <Box sx={{ fontSize: 12, lineHeight: '20px', fontWeight: fw.semiBold, color: pt.formElements.headings.defaultTextColor }}>{title}</Box>
        {variant === 'toaster' && selectAll}
      </Box>
      <Box
        onDragOver={(e) => variant === 'dragDrop' && e.preventDefault()}
        onDrop={drop}
        sx={{ height, display: 'flex', flexDirection: 'column', background: pt.colors.base.white, borderRadius: pt.radius.m, boxShadow: shadow, overflow: 'hidden', boxSizing: 'border-box' }}
      >
        <Box sx={{ p: pt.spacing.m, display: 'flex', flexDirection: 'column', gap: pt.spacing.xxxl, flex: 1, minHeight: 0 }}>
          <Search value={query} onChange={(e) => setQuery(e.target.value)} handleClear={() => setQuery('')} ariaLabel="Search list" />
          <Box component="ul" role="listbox" aria-multiselectable aria-label={typeof title === 'string' ? title : undefined} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
            {visible.map((it) => {
              const on = live.includes(it.id);
              return (
                <Box
                  component="li"
                  key={it.id}
                  role="option"
                  aria-selected={on}
                  aria-disabled={it.disabled}
                  draggable={variant === 'dragDrop' && !it.disabled}
                  onDragStart={(e: DragEvent) => dragStart(e, it.id)}
                  data-spec="transfer-item"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: pt.spacing.xs,
                    minHeight: 50,
                    boxSizing: 'border-box',
                    px: pt.spacing.m,
                    flexShrink: 0,
                    background: on ? dd.activeBackground : dd.defaultBackground,
                    opacity: it.disabled ? disabledOpacity : 1,
                    cursor: variant === 'dragDrop' ? 'grab' : 'default',
                    '&:hover': { background: on ? dd.activeHoverBackground : dd.hoverBackground },
                  }}
                >
                  <Checkbox size="small" checked={on} disabled={it.disabled} onChange={() => toggle(it.id)} slotProps={{ input: { 'aria-label': typeof it.label === 'string' ? it.label : it.id } }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ fontSize: 12, lineHeight: '20px', color: pt.formElements.content.primaryTextColor }}>{it.label}</Box>
                    {it.description && <Box sx={{ fontSize: 11, lineHeight: '18px', color: pt.formElements.content.metaDataTextColor }}>{it.description}</Box>}
                  </Box>
                </Box>
              );
            })}
            {visible.length === 0 && <Box sx={{ p: 2, fontSize: 12, color: pt.formElements.content.secondaryTextColor, textAlign: 'center' }}>No items</Box>}
          </Box>
        </Box>
        {variant === 'toaster' ? (
          live.length > 0 && (
            <Box sx={{ m: pt.spacing.m, mt: 0, p: pt.spacing.m, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: pt.spacing.m, background: pt.uiElements.dataGrid.deleteConfirmation.color.defaultBackground, border: `1px solid ${pt.uiElements.dataGrid.deleteConfirmation.color.defaultBorder}`, borderRadius: pt.radius.xs }}>
              <Box sx={{ fontSize: 12, lineHeight: '20px' }}>{live.length} selected</Box>
              <Button size="small" onClick={move}>{actionLabel}</Button>
            </Box>
          )
        ) : variant === 'footer' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: pt.spacing.xxxl, padding: '6px 16px 6px 14px', minHeight: 64, boxSizing: 'border-box', background: '#f6f8fc', borderTop: '1px solid #e2e8f0' }}>
            <Box>
              {selectAll}
              <Box sx={{ pl: '36px', fontSize: 12, lineHeight: '20px', color: pt.formElements.content.primaryTextColor }}>{live.length} Records selected</Box>
            </Box>
            <Button size="small" variant="outlined" disabled={live.length === 0} onClick={move} sx={{ borderRadius: pt.radius.full }}>{actionLabel}</Button>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

/** Two-list picker: move items between "available" and "selected". */
export function TransferList({ items, value, onChange, variant = 'footer', availableTitle = 'Available', selectedTitle = 'Selected', panelWidth = 400, height = 420 }: TransferListProps) {
  const available = items.filter((i) => !value.includes(i.id));
  const selected = items.filter((i) => value.includes(i.id));
  const moveToSelected = (ids: string[]) => onChange([...value, ...ids.filter((id) => !value.includes(id))]);
  const moveToAvailable = (ids: string[]) => onChange(value.filter((id) => !ids.includes(id)));
  const drop = (ids: string[], to: 'available' | 'selected') => (to === 'selected' ? moveToSelected(ids) : moveToAvailable(ids));
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: pt.spacing['7xl'] }}>
      <Panel title={availableTitle} items={available} variant={variant} width={panelWidth} height={height} actionLabel="Add" onMove={moveToSelected} side="available" onDropIds={drop} />
      <ArrowForwardRounded aria-hidden sx={{ alignSelf: 'center', color: pt.uiElements.transferList.region.arrowColor, fontSize: 20 }} />
      <Panel title={selectedTitle} items={selected} variant={variant} width={panelWidth} height={height} actionLabel="Remove" onMove={moveToAvailable} side="selected" onDropIds={drop} />
    </Box>
  );
}




