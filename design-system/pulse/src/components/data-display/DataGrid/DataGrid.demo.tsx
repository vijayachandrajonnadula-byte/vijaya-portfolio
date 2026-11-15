import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { GridColDef } from '@mui/x-data-grid';
import AddRounded from '@mui/icons-material/AddRounded';
import { Button } from '../../actions/Button/Button';
import { Chip } from '../Chip/Chip';
import { StatusFilterBar } from '../StatusFilterBar/StatusFilterBar';
import { DataGrid, DataGridLinkCell, DataGridTextCell, DataGridToolbar, Table, dataGridColors } from './DataGrid';
import type { DataGridSize } from './DataGrid';
import { DataGridCellsSection } from './DataGridCellsSection';

interface Row {
  id: number;
  name: string;
  owner: string;
  site: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}
const statusColor = { Approved: 'green', Pending: 'orange', Rejected: 'red' } as const;
const rows: Row[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Protocol ${String(i + 1).padStart(3, '0')}`,
  owner: ['A. Rao', 'M. Chen', 'S. Ortiz', 'L. Novak'][i % 4]!,
  site: ['Boston', 'Dublin', 'Singapore'][i % 3]!,
  status: (['Approved', 'Pending', 'Rejected'] as const)[i % 3]!,
}));

const columns: GridColDef<Row>[] = [
  { field: 'name', headerName: 'Document', flex: 1.4, renderCell: (p) => <DataGridLinkCell secondary={p.row.site}>{p.value}</DataGridLinkCell> },
  { field: 'owner', headerName: 'Owner', flex: 1, renderCell: (p) => <DataGridTextCell primary={p.value} /> },
  { field: 'site', headerName: 'Site', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1, renderCell: (p) => <Chip label={p.value} color={statusColor[p.row.status]} size="xxsmall" /> },
];

const flatColumns = columns.map((c, i) => (i === 0 ? { ...c, renderCell: undefined } : c));

const Label = ({ children }: { children: string }) => (
  <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>
    {children}
  </Typography>
);

const noop = () => undefined;

export default function DataGridDemo() {
  const [size, setSize] = useState<DataGridSize>('medium');
  return (
    <Stack spacing={4}>
      <Box>
        <Label>DataGrid: toolbar (title, quick filter, filter / columns / density, action), striped rows, checkbox selection, density menu</Label>
        <DataGrid
          title="Documents (25)"
          metadata="Controlled documents across sites"
          rows={rows}
          columns={columns}
          size={size}
          onSizeChange={setSize}
          enableSearch
          striped
          checkboxSelection
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          pageSizeOptions={[5, 10, 25]}
          actionSlot={<Button size={size === 'large' ? 'large' : size === 'small' ? 'small' : 'medium'} startIcon={<AddRounded />}>Add</Button>}
        />
      </Box>
      {(['small', 'medium', 'large'] as const).map((s) => (
        <Box key={s}>
          <Label>{`Size ${s} (header ${s === 'small' ? 32 : s === 'medium' ? 40 : 44}px)`}</Label>
          <DataGrid hideToolbar size={s} rows={rows.slice(0, 3)} columns={flatColumns} hideFooter columnDividers />
        </Box>
      ))}
      <Box>
        <Label>Filled header (BackGroundFill = Yes) with two-line rows (rowLines=double: 48/52/60)</Label>
        <DataGrid hideToolbar filledHeader rowLines="double" rows={rows.slice(0, 3)} columns={columns} hideFooter />
      </Box>
      <Box>
        <Label>Without row border (rowLines=none), from the Figma "Without Row Border Style Format" example</Label>
        <DataGrid hideToolbar rowLines="none" rows={rows.slice(0, 4)} columns={columns} hideFooter checkboxSelection />
      </Box>
      <Box>
        <Label>Column merger: group header over columns (columnGroupingModel), from the Figma "Column Merger" example</Label>
        <DataGrid
          hideToolbar
          rows={rows.slice(0, 4)}
          columns={columns}
          hideFooter
          columnGroupingModel={[{ groupId: 'who', headerName: 'People', children: [{ field: 'owner' }, { field: 'site' }] }]}
        />
      </Box>
      <Box>
        <Label>No column dividers, selected row, no striping</Label>
        <DataGrid hideToolbar rows={rows.slice(0, 4)} columns={columns} hideFooter columnDividers={false} checkboxSelection rowSelectionModel={{ type: 'include', ids: new Set([2]) }} onRowSelectionModelChange={noop} />
      </Box>
      <Box>
        <Label>Empty states inside the grid: noRecords / noSearch / noFilter / error</Label>
        <Stack direction="row" spacing={2}>
          {(['noRecords', 'noSearch', 'noFilter', 'error'] as const).map((t) => (
            <Box key={t} sx={{ flex: 1, minWidth: 0 }}>
              <DataGrid hideToolbar rows={[]} columns={columns.slice(0, 2)} hideFooter emptyType={t} height={300} />
            </Box>
          ))}
        </Stack>
      </Box>
      <Box>
        <Label>DatagridToolbar sizes: small / medium / large (Quick Filter On = status filter row) / tablet / mobile (Quick Filter Off = one row)</Label>
        <Stack spacing={2}>
          {(['small', 'medium', 'large', 'tablet', 'mobile'] as const).map((s) => (
            <Box key={s} sx={{ maxWidth: s === 'mobile' ? 360 : s === 'tablet' ? 700 : 1000, p: 1, border: `1px dashed ${dataGridColors.border}` }}>
              <DataGridToolbar size={s} title="Form (30)" metadata={s === 'medium' || s === 'large' ? 'Last updated today' : undefined} quickFilter={s !== 'tablet' && s !== 'mobile'} statusFilter={<StatusFilterBar size={s === 'large' ? 'large' : s === 'medium' ? 'medium' : 'small'} items={[{ status: 'Approved', count: 12, color: 'green' }, { status: 'Pending', count: 8, color: 'orange' }]} activeStatus={null} onStatusChange={() => undefined} />} search={s === 'medium'} appliedFilters={s === 'large' ? 2 : 0} actionSlot={<Button size={s === 'large' ? 'large' : s === 'medium' ? 'medium' : 'small'}>Create</Button>} />
            </Box>
          ))}
        </Stack>
      </Box>
      <DataGridCellsSection />
      <Box>
        <Label>Table (simple, columns/data API)</Label>
        <Table
          striped
          size="small"
          columns={[
            { id: 'seq', label: '#', width: 50 },
            { id: 'name', label: 'Name' },
            { id: 'status', label: 'Status', renderCell: (r: Row) => <Chip label={r.status} color={statusColor[r.status]} size="xxsmall" /> },
          ]}
          data={rows.slice(0, 4).map((r, i) => ({ ...r, seq: i + 1 }))}
        />
      </Box>
    </Stack>
  );
}



