import { useMemo, useState } from 'react';
import { Header } from '../../components/navigation/Header/Header';
import { LeftNav } from '../../components/navigation/LeftNav/LeftNav';
import type { LeftNavMenu } from '../../components/navigation/LeftNav/LeftNav';
import { Region } from '../../components/containers/Region/Region';
import { Avatar } from '../../components/data-display/Avatar/Avatar';
import type { ChipColor } from '../../components/data-display/Chip/Chip';
import { Status as StatusChip } from '../../components/data-display/Status/Status';
import { DataGrid, DataGridActionsCell, DataGridLinkCell, DataGridTextCell } from '../../components/data-display/DataGrid/DataGrid';
import type { GridColDef } from '../../components/data-display/DataGrid/DataGrid';
import { IconButton } from '../../components/actions/IconButton/IconButton';
import type { StatusFilterItem } from '../../components/data-display/StatusFilterBar/StatusFilterBar';
import {
  QualityReviewIcon, ChartLineData02Icon, CleanIcon, Configuration01Icon, Doc02Icon, Edit02Icon, ExceptionIcon,
  GatewayIcon, Home01Icon, ProcessVerificationIcon, OperationsIcon, LabsIcon, Layers01Icon, ScheduleFrameworkIcon, Settings05Icon, SlidersHorizontalIcon,
  TaskEdit01Icon, UserSettings02Icon, ValidationApprovalIcon,
} from '../../icons';
import { AppShell, ContextBarPanel, ListHeaderPanel, PageBodyContentPanel, TabStatusFilterPanel } from '../../templates';

/**
 * "Execution Lifecycle" list page, assembled only from design-system parts:
 * Header + LeftNav (shell), ContextBarPanel, ListHeaderPanel, TabStatusFilterPanel and PageBodyContentPanel (templates),
 * a Region holding a DataGrid whose cells are DataGridLinkCell / DataGridTextCell (with Avatar) / Status / DataGridActionsCell
 * (with IconButton). The frame that places the shell parts is the AppShell template.
 */

type Status = 'Approved' | 'Reviewed' | 'Draft' | 'Rejected' | 'In Transfer' | 'Inactive' | 'Terminated';
interface Row {
  id: number;
  code: string;
  name: string;
  by: string;
  on: string;
  status: Status;
  /** Rows with a second action (open the linked record). */
  linked?: boolean;
}

const statusColor: Record<Status, ChipColor> = {
  Approved: 'green',
  Reviewed: 'blue',
  Draft: 'gray',
  Rejected: 'red',
  'In Transfer': 'orange',
  Inactive: 'gray',
  Terminated: 'purple',
};

const rows: Row[] = [
  { id: 1, code: 'EXL-0001-01', name: 'Standard Manufacturing Batch Re...', by: 'Validation lead', on: '2026-05-21 14:32 UTC', status: 'Approved' },
  { id: 2, code: 'EXL-0002-01', name: 'OQ / IQ Equipment Qualification', by: 'QA reviewer', on: '2026-05-20 09:15 UTC', status: 'Approved' },
  { id: 3, code: 'EXL-0004-01', name: 'Deviation Investigation Workflow', by: 'QA reviewer', on: '2026-05-12 17:40 UTC', status: 'Draft' },
  { id: 4, code: 'EXL-0005-01', name: 'Stability Study Pull & Test', by: 'Lab analyst', on: '2026-05-08 12:47 UTC', status: 'Rejected', linked: true },
  { id: 5, code: 'EXL-0006-03', name: 'Process Validation (PPQ)', by: 'Process engineer', on: '2026-05-02 14:00 UTC', status: 'In Transfer' },
  { id: 6, code: 'EXL-0007-01', name: 'Annual Product Quality Review Pull', by: 'Site manager', on: '2026-04-30 10:45 UTC', status: 'Inactive' },
  { id: 7, code: 'EXL-0010-01', name: 'Environmental Monitoring Protocol', by: 'Lab analyst', on: '2026-04-22 09:45 UTC', status: 'Approved' },
  { id: 8, code: 'EXL-0011-01', name: 'Change Control Review Lifecycle', by: 'Validation lead', on: '2026-04-18 16:30 UTC', status: 'Approved' },
  { id: 9, code: 'EXL-0012-02', name: 'SOP Compliance Verification', by: 'Site manager', on: '2026-04-15 10:20 UTC', status: 'Approved', linked: true },
  { id: 10, code: 'EXL-0014-01', name: 'Risk Assessment Protocol', by: 'Validation lead', on: '2026-05-28 10:00 UTC', status: 'Draft' },
  { id: 11, code: 'EXL-0015-01', name: 'Supplier Qualification Audit', by: 'Lab analyst', on: '2026-05-25 14:30 UTC', status: 'Draft' },
  { id: 12, code: 'EXL-0016-01', name: 'Temperature Mapping Protocol', by: 'QA reviewer', on: '2026-05-18 11:00 UTC', status: 'Rejected' },
  { id: 13, code: 'EXL-0017-02', name: 'Water System Monitoring Lifecycle', by: 'Site manager', on: '2026-05-14 09:30 UTC', status: 'Rejected' },
  { id: 14, code: 'EXL-0018-01', name: 'Shelf Life Extension Study', by: 'Process engineer', on: '2026-05-10 15:45 UTC', status: 'In Transfer', linked: true },
  { id: 15, code: 'EXL-0019-01', name: 'Legacy GMP Audit Protocol', by: 'Validation lead', on: '2026-04-05 08:00 UTC', status: 'Terminated' },
  { id: 16, code: 'EXL-0020-01', name: 'Discontinued Process Monitoring', by: 'Lab analyst', on: '2026-03-28 14:20 UTC', status: 'Terminated' },
  { id: 17, code: 'EXL-0021-01', name: 'Cleaning Validation Protocol', by: 'Validation lead', on: '2026-06-12 10:05 UTC', status: 'Reviewed', linked: true },
  { id: 18, code: 'EXL-0022-01', name: 'Media Fill Qualification', by: 'Process engineer', on: '2026-06-10 15:40 UTC', status: 'Reviewed', linked: true },
  { id: 19, code: 'EXL-0023-01', name: 'Calibration Master Schedule', by: 'Site manager', on: '2026-06-08 09:20 UTC', status: 'Reviewed' },
];

const icon = (Icon: typeof Home01Icon) => <Icon size={24} />;
const menus: LeftNavMenu[] = [
  { id: 'home', name: 'Home', icon: icon(Home01Icon) },
  { id: 'admin', name: 'Administration', icon: icon(UserSettings02Icon) },
  { id: 'quality', name: 'Quality review', icon: icon(QualityReviewIcon as typeof Home01Icon) },
  { id: 'config', name: 'Configuration', icon: icon(Configuration01Icon) },
  { id: 'document', name: 'Document', icon: icon(Doc02Icon) },
  { id: 'exception', name: 'Exception', icon: icon(ExceptionIcon as typeof Home01Icon) },
  { id: 'execution', name: 'Execution', icon: icon(Settings05Icon) },
  { id: 'gateway', name: 'Gateway', icon: icon(GatewayIcon as typeof Home01Icon) },
  { id: 'cleaning', name: 'Cleaning', icon: icon(CleanIcon) },
  { id: 'manufacturing', name: 'Manufacturing', icon: icon(LabsIcon) },
  { id: 'verification', name: 'Verification', icon: icon(ProcessVerificationIcon as typeof Home01Icon) },
  { id: 'inventory', name: 'Inventory', icon: icon(Layers01Icon) },
  { id: 'operations', name: 'Operations', icon: icon(OperationsIcon as typeof Home01Icon) },
  { id: 'validation', name: 'Validation', icon: icon(ValidationApprovalIcon) },
  { id: 'reports', name: 'Reports', icon: icon(ChartLineData02Icon) },
  { id: 'schedule', name: 'Schedule Management', icon: icon(ScheduleFrameworkIcon as typeof Home01Icon) },
  { id: 'setup', name: 'System Setup', icon: icon(SlidersHorizontalIcon) },
];

const tabs = [{ label: 'Create' }, { label: 'Review' }, { label: 'Approve' }];
const statusOrder: Status[] = ['Approved', 'Reviewed', 'Draft', 'Rejected', 'In Transfer', 'Inactive', 'Terminated'];
const gridColor = { Approved: 'green', Reviewed: 'blue', Draft: 'orange', Rejected: 'red', 'In Transfer': 'orange', Inactive: 'gray', Terminated: 'red' } as const;

export default function ExecutionLifecyclePage() {
  const [menu, setMenu] = useState('execution');
  const [tab, setTab] = useState(0);
  const [status, setStatus] = useState<string | null>(null);

  const items: StatusFilterItem[] = useMemo(
    () => statusOrder.map((s) => ({ status: s, count: rows.filter((r) => r.status === s).length, color: gridColor[s] })),
    [],
  );
  const shown = status ? rows.filter((r) => r.status === status) : rows;

  const columns: GridColDef<Row>[] = [
    { field: 'id', headerName: '#', width: 60 },
    { field: 'code', headerName: 'Execution Lifecycle ID', flex: 1, minWidth: 170, renderCell: (p) => <DataGridLinkCell>{p.value}</DataGridLinkCell> },
    { field: 'name', headerName: 'Execution Lifecycle Name', flex: 1.4, minWidth: 220, renderCell: (p) => <DataGridTextCell primary={p.value} /> },
    {
      field: 'by',
      headerName: 'Created by',
      flex: 1,
      minWidth: 150,
      renderCell: (p) => (
        <DataGridTextCell
          icon={<Avatar size="xsmall">{String(p.value).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}</Avatar>}
          primary={p.value}
        />
      ),
    },
    { field: 'on', headerName: 'Created on (UTC)', flex: 1, minWidth: 170, renderCell: (p) => <DataGridTextCell primary={p.value} /> },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 130, renderCell: (p) => <StatusChip type="chip" label={p.value} color={statusColor[p.row.status]} /> },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 110,
      sortable: false,
      renderCell: (p) => (
        <DataGridActionsCell>
          <IconButton ariaLabel={`Edit ${p.row.code}`} size="xsmall"><Edit02Icon size={16} /></IconButton>
          {p.row.linked && <IconButton ariaLabel={`Open linked record for ${p.row.code}`} size="xsmall"><TaskEdit01Icon size={16} /></IconButton>}
        </DataGridActionsCell>
      ),
    },
  ];

  return (
    <AppShell
      nav={<LeftNav menus={menus} selectedMenu={menu} onMenuClick={(m) => setMenu(m.id)} />}
      header={
        <Header
          showRegion
          showProfile
          showAvatar
          region={{ value: 'Chennai', time: '12:00 AM IST', options: [{ value: 'Chennai' }, { value: 'New Jersey' }] }}
          profile={{ name: 'Administrator', job: 'Quality site', options: [{ value: 'Settings' }, { value: 'Log out' }] }}
        />
      }
    >
      <ContextBarPanel breadcrumbs={[{ node: 'Execution', link: '/execution' }, { node: 'Execution Lifecycle', link: '' }]} />
      <ListHeaderPanel
        title="Execution Lifecycle"
        metaData="Standardise how executions are initiated, reviewed, and approved."
        gridActions={['filter', 'columns', 'density']}
        primaryAction={{ label: 'Create', dropdownOptions: [{ label: 'New lifecycle', value: 'new' }, { label: 'From template', value: 'template' }] }}
        divider={false}
      />
      <TabStatusFilterPanel
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        statusFilter={{ items, activeStatus: status, onStatusChange: setStatus, totalCount: rows.length }}
        divider
      />
      <PageBodyContentPanel>
        <Region sx={{ height: '100%', overflow: 'hidden' }}>
          <DataGrid
            hideToolbar
            filledHeader
            hideFooter
            rows={shown}
            columns={columns}
            size="medium"
            columnDividers
            height="100%"
            initialState={{ pagination: { paginationModel: { pageSize: 100 } } }}
          />
        </Region>
      </PageBodyContentPanel>
    </AppShell>
  );
}