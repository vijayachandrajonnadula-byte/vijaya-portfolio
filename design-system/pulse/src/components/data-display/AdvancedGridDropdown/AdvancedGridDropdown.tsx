// Figma: Data Grid page, `.Building Blocks/advancedGridDropdown` (Variant: Single Select | Multi select).
// 540 wide white panel, r8, padding 8 0: search input (32) over a small grid (header 32, rows 48, checkbox/radio column 52 + two 244 text columns).
import { useState } from 'react';
import Box from '@mui/material/Box';
import { Search } from '../../form/Search/Search';
import { Checkbox } from '../../form/Checkbox/Checkbox';
import { Radio } from '../../form/Radio/Radio';
import { DataGridCellFrame, DataGridHeaderCell, DataGridTextCell } from '../DataGrid/DataGrid';
import { DataGridSizeProvider } from '../DataGrid/DataGridCells';
import { pt } from '../../../theme/pulseTokens';

export interface AdvancedGridDropdownRow {
  id: string;
  primary: string;
  secondary?: string;
}
export interface AdvancedGridDropdownProps {
  /** Figma Variant: single = radio column, multi = checkbox column. @default "single" */
  variant?: 'single' | 'multi';
  columns?: [string, string];
  rows: AdvancedGridDropdownRow[];
  value: string[];
  onChange: (value: string[]) => void;
  width?: number;
}

export function AdvancedGridDropdown({ variant = 'single', columns = ['Name', 'Details'], rows, value, onChange, width = 540 }: AdvancedGridDropdownProps) {
  const [q, setQ] = useState('');
  const shown = rows.filter((r) => `${r.primary} ${r.secondary ?? ''}`.toLowerCase().includes(q.toLowerCase()));
  const toggle = (id: string) => onChange(variant === 'single' ? [id] : value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  const Control = variant === 'single' ? Radio : Checkbox;
  return (
    <DataGridSizeProvider value="small">
      <Box data-spec={`advanced-grid-dropdown-${variant}`} sx={{ boxSizing: 'border-box', width, padding: '8px 0', background: '#fff', borderRadius: pt.radius.m, display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden', boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.15)' /* Figma drop(0,2,8,0,#00000026), no stroke */ }}>
        <Box sx={{ padding: '0 8px' }}><Search fullWidth size="small" value={q} onChange={(e) => setQ(e.target.value)} handleClear={() => setQ('')} placeholder="Search" ariaLabel="Search options" /></Box>
        <Box role={variant === 'single' ? 'radiogroup' : 'group'}>
          <Box sx={{ display: 'flex' }}>
            <DataGridHeaderCell size="small" title="" width={52} />
            <DataGridHeaderCell size="small" title={columns[0]} width={244} />
            <DataGridHeaderCell size="small" title={columns[1]} width={244} />
          </Box>
          {shown.map((r) => (
            <Box key={r.id} onClick={() => toggle(r.id)} sx={{ display: 'flex', cursor: 'pointer', '&:hover > *': { background: '#eef3fb' } }}>
              <DataGridCellFrame size="small" width={52} height={48}>
                <Control size="small" checked={value.includes(r.id)} onChange={() => toggle(r.id)} slotProps={{ input: { 'aria-label': r.primary } }} />
              </DataGridCellFrame>
              <DataGridCellFrame size="small" width={244} height={48}><DataGridTextCell primary={r.primary} secondary={r.secondary} /></DataGridCellFrame>
              <DataGridCellFrame size="small" width={244} height={48}><DataGridTextCell primary={r.secondary ?? ''} /></DataGridCellFrame>
            </Box>
          ))}
        </Box>
      </Box>
    </DataGridSizeProvider>
  );
}

