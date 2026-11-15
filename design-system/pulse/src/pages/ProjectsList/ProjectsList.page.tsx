import { useState } from 'react';
import { DataGrid, DataGridActionsCell, DataGridLinkCell, DataGridTextCell } from '../../components/data-display/DataGrid/DataGrid';
import type { GridColDef } from '../../components/data-display/DataGrid/DataGrid';
import { Region } from '../../components/containers/Region/Region';
import { Status } from '../../components/data-display/Status/Status';
import type { ChipColor } from '../../components/data-display/Chip/Chip';
import { IconButton } from '../../components/actions/IconButton/IconButton';
import { ToggleButtonGroup } from '../../components/form/ToggleButtonGroup/ToggleButtonGroup';
import { Edit02Icon, Layout01Icon, ListViewIcon, TaskEdit01Icon } from '../../icons';
import { ListHeaderPanel, PageBodyContentPanel, TabStatusFilterPanel } from '../../templates';
import { Frame } from '../_shared/frame';

/** "Projects, list view": the same records as the card view, as a data grid. Generic sample data. */
interface Row { id: number; code: string; name: string; type: string; flow: string; status: string; linked?: boolean }
const rows: Row[] = [
  { id: 1, code: 'PRJ-2026-0001.001', name: 'Validation of the warehouse system', type: 'Standard', flow: 'NA', status: 'Approved' },
  { id: 2, code: 'PRJ-2026-0005.001', name: 'Validation of the plant historian', type: 'Standard', flow: 'NA', status: 'Approved' },
  { id: 3, code: 'PRJ-2026-0007.001', name: 'Validation of the records system', type: 'Standard', flow: 'NA', status: 'Approved' },
  { id: 4, code: 'PRJ-2026-0010.001', name: 'Validation of the control system', type: 'Service', flow: 'NA', status: 'Inactive' },
  { id: 5, code: 'PRJ-2026-0012.001', name: 'Validation of the maintenance system', type: 'Standard', flow: 'NA', status: 'Withdrawn' },
  { id: 6, code: 'PRJ-2026-0013.001', name: 'Validation of the sample manager', type: 'Standard', flow: 'Standard', status: 'Reviewed', linked: true },
  { id: 7, code: 'PRJ-2026-0014.001', name: 'Validation of the supply chain suite', type: 'Agile', flow: 'Initiation', status: 'Draft' },
  { id: 8, code: 'PRJ-2026-0015.001', name: 'Validation of the safety system', type: 'Standard', flow: 'NA', status: 'Draft' },
  { id: 9, code: 'PRJ-2026-0016.001', name: 'Validation of the extended warehouse system', type: 'Service', flow: 'Phase 3', status: 'Rejected', linked: true },
  { id: 10, code: 'PRJ-2026-0019.001', name: 'Validation of the tracking system', type: 'Standard', flow: 'Phase 1', status: 'Approved' },
];
const tone: Record<string, ChipColor> = { Approved: 'green', Draft: 'orange', Reviewed: 'cyan', Rejected: 'red', Withdrawn: 'red', Inactive: 'gray' };

export default function ProjectsListPage() {
  const [view, setView] = useState<string | null>('list');
  const [tab, setTab] = useState(0);
  const columns: GridColDef<Row>[] = [
    { field: 'id', headerName: '#', width: 60 },
    { field: 'code', headerName: 'Project ID', flex: 1, minWidth: 170, renderCell: (p) => <DataGridLinkCell>{p.value}</DataGridLinkCell> },
    { field: 'name', headerName: 'Project name', flex: 1.6, minWidth: 240, renderCell: (p) => <DataGridTextCell primary={p.value} /> },
    { field: 'type', headerName: 'Project type', flex: 0.8, minWidth: 120 },
    { field: 'flow', headerName: 'Workflow type', flex: 0.8, minWidth: 120 },
    { field: 'status', headerName: 'Status', flex: 0.8, minWidth: 120, renderCell: (p) => <Status type="chip" label={p.value} color={tone[p.value] ?? 'gray'} /> },
    {
      field: 'actions', headerName: 'Action', width: 110, sortable: false,
      renderCell: (p) => (
        <DataGridActionsCell>
          <IconButton ariaLabel={`Edit ${p.row.code}`} size="xsmall"><Edit02Icon size={16} /></IconButton>
          {p.row.linked && <IconButton ariaLabel={`Open linked record for ${p.row.code}`} size="xsmall"><TaskEdit01Icon size={16} /></IconButton>}
        </DataGridActionsCell>
      ),
    },
  ];
  return (
    <Frame active="validation">
      <ListHeaderPanel
        title="Projects"
        metaData="Create and manage validation projects across your solutions and entities."
        actionsStartSlot={
          <ToggleButtonGroup size="small" exclusive ariaLabel="View" value={view} onChange={(_, v) => setView(v ?? view)} buttonList={[
            { value: 'grid', label: <Layout01Icon size={16} />, contentType: 'icon', ariaLabel: 'Card view' },
            { value: 'list', label: <ListViewIcon size={16} />, contentType: 'icon', ariaLabel: 'List view' },
          ]} />
        }
        gridActions={['filter', 'columns', 'density']}
        primaryAction={{ label: 'Create', dropdownOptions: [{ label: 'New project', value: 'new' }, { label: 'From template', value: 'template' }] }}
        divider={false}
      />
      <TabStatusFilterPanel tabs={[{ label: 'Create (19)' }, { label: 'Review (12)' }, { label: 'Approve (12)' }]} activeTab={tab} onTabChange={setTab} divider />
      <PageBodyContentPanel>
        <Region sx={{ height: '100%', overflow: 'hidden' }}>
          <DataGrid hideToolbar filledHeader hideFooter rows={rows} columns={columns} size="medium" columnDividers height="100%" />
        </Region>
      </PageBodyContentPanel>
    </Frame>
  );
}
