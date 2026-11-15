import { useState } from 'react';
import { Box, Grid, Stack, Typography } from '../../components/mui';
import { Region } from '../../components/containers/Region/Region';
import { Avatar } from '../../components/data-display/Avatar/Avatar';
import { KPICard } from '../../components/data-display/KPICard/KPICard';
import type { KPICardColor } from '../../components/data-display/KPICard/KPICard';
import { ChartDonut } from '../../components/data-display/Charts/ChartRadial';
import { ChartLegend } from '../../components/data-display/Charts/ChartLegend';
import { DataGrid, DataGridLinkCell, DataGridTextCell } from '../../components/data-display/DataGrid/DataGrid';
import type { GridColDef } from '../../components/data-display/DataGrid/DataGrid';
import { Status } from '../../components/data-display/Status/Status';
import type { ChipColor } from '../../components/data-display/Chip/Chip';
import { Button } from '../../components/actions/Button/Button';
import { Switch } from '../../components/form/Switch/Switch';
import { ContextBarPanel, ListHeaderPanel, PageBodyContentPanel, TabStatusFilterPanel } from '../../templates';
import { Frame } from '../_shared/frame';

/** "Annual review": a dashboard with summary cards, a donut, event tiles and three review tables. Generic sample data. */
const kpis: { v: string; l: string; c: string; k: KPICardColor }[] = [
  { v: '42', l: 'Total batches', c: '13 released · 3 in process · 1 rejected', k: 'green' },
  { v: '14 / 16', l: 'Data sources', c: '1 failed · 1 pending', k: 'red' },
  { v: '11 / 16', l: 'Health check', c: '5 watch · 0 action', k: 'orange' },
  { v: '2 / 9', l: 'Deliverables', c: '3 in progress · 4 in review', k: 'orange' },
];
const tiles: { v: string; l: string; s: string; k: 'green' | 'orange' | 'blue' }[] = [
  { v: '2', l: 'Deviations', s: 'All closed', k: 'green' }, { v: '2', l: 'Out of spec / tolerance', s: '1 open', k: 'orange' }, { v: '1', l: 'Complaint', s: 'All closed', k: 'green' },
  { v: '1', l: 'Corrective actions', s: '1 open', k: 'orange' }, { v: '8', l: 'Change controls', s: '1 open', k: 'orange' }, { v: '0', l: 'Recalls', s: 'None this period', k: 'blue' },
  { v: '0', l: 'Returns / reworks', s: 'None this period', k: 'blue' },
];
const tint = { green: '#f0fdf4', orange: '#fffbeb', blue: '#eff6ff' } as const;
const edge = { green: '#bbf7d0', orange: '#fde68a', blue: '#bfdbfe' } as const;

interface Src { id: number; element: string; source: string; detail: string; status: string }
interface Chk { id: number; parameter: string; source: string; result: string; status: string }
interface Del { id: number; name: string; type: string; due: string; owner: string; status: string }
const sources: Src[] = [
  { id: 1, element: 'Batch yield (%)', source: 'Manufacturing system', detail: 'Sync pending: awaiting refresh', status: 'Pending' },
  { id: 2, element: 'Complaints', source: 'Quality system', detail: 'Sync failed: no data retrieved', status: 'Failed' },
];
const checks: Chk[] = [
  { id: 1, parameter: 'Dissolution Q at 1 h (%)', source: 'Lab system', result: '14 normal · 3 warning, upward trend', status: 'Warning' },
  { id: 2, parameter: 'Compression force (kN)', source: 'Historian', result: '16 within range · 1 excursion (~8 min)', status: 'Warning' },
  { id: 3, parameter: 'Stability: water content (%)', source: 'Stability system', result: '11 normal · 2 warning, minor upward moisture', status: 'Warning' },
  { id: 4, parameter: 'Deviations', source: 'Quality system', result: '2 deviations this period, a cluster of 2 in Q3, since closed', status: 'Warning' },
  { id: 5, parameter: 'Out-of-spec results', source: 'Quality system', result: '1 out-of-spec result, investigated and linked to a corrective action', status: 'Warning' },
];
const dels: Del[] = [
  { id: 1, name: 'Annual review report 2026, part 1', type: 'Review', due: '30-Jun-2026', owner: 'Quality lead', status: 'In approval' },
  { id: 2, name: 'Annual review report 2026, part 2', type: 'Review', due: '15-May-2026', owner: 'QA reviewer', status: 'In progress' },
  { id: 3, name: 'Annual review report 2026, part 3', type: 'Review', due: '30-May-2026', owner: 'Process engineer', status: 'In progress' },
  { id: 4, name: 'Master batch production record', type: 'Document', due: '05-Jun-2026', owner: 'Review committee', status: 'In review' },
  { id: 5, name: 'Stability study report', type: 'Document', due: '18-Jun-2026', owner: 'Lab analyst', status: 'In progress' },
  { id: 6, name: 'Annual review e-learning module', type: 'Task', due: '01-Jun-2026', owner: 'Regulatory group', status: 'In review' },
  { id: 7, name: 'Read and acknowledge: data integrity SOP', type: 'Task', due: '20-Jun-2026', owner: 'Quality lead', status: 'In approval' },
];
const tone: Record<string, ChipColor> = { Pending: 'orange', Failed: 'red', Warning: 'orange', 'In approval': 'orange', 'In progress': 'orange', 'In review': 'orange' };

function Block({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <Region>
      <Box sx={{ p: 2 }}>
        <Typography variant="heading6">{title} ({count})</Typography>
        <Box sx={{ mt: 1.5 }}>{children}</Box>
      </Box>
    </Region>
  );
}

export default function AnnualReviewPage() {
  const [tab, setTab] = useState(0);
  const [personalise, setPersonalise] = useState(false);
  const srcCols: GridColDef<Src>[] = [
    { field: 'element', headerName: 'Element', flex: 1, minWidth: 150, renderCell: (p) => <DataGridTextCell primary={p.value} /> },
    { field: 'source', headerName: 'Source', flex: 1, minWidth: 150 },
    { field: 'detail', headerName: 'Sync detail', flex: 2, minWidth: 220 },
    { field: 'status', headerName: 'Sync status', flex: 0.8, minWidth: 120, renderCell: (p) => <Status type="chip" label={p.value} color={tone[p.value] ?? 'gray'} /> },
  ];
  const chkCols: GridColDef<Chk>[] = [
    { field: 'parameter', headerName: 'Parameter', flex: 1.2, minWidth: 200, renderCell: (p) => <DataGridTextCell primary={p.value} /> },
    { field: 'source', headerName: 'Source', flex: 1, minWidth: 140, renderCell: (p) => <DataGridLinkCell>{p.value}</DataGridLinkCell> },
    { field: 'result', headerName: 'Result this period', flex: 2.2, minWidth: 260 },
    { field: 'status', headerName: 'Status', flex: 0.8, minWidth: 110, renderCell: (p) => <Status type="chip" label={p.value} color={tone[p.value] ?? 'gray'} /> },
  ];
  const delCols: GridColDef<Del>[] = [
    { field: 'name', headerName: 'Deliverable', flex: 2, minWidth: 240, renderCell: (p) => <DataGridTextCell primary={p.value} /> },
    { field: 'type', headerName: 'Type', flex: 0.7, minWidth: 100, renderCell: (p) => <DataGridLinkCell>{p.value}</DataGridLinkCell> },
    { field: 'due', headerName: 'Due date', flex: 1, minWidth: 120 },
    { field: 'owner', headerName: 'Owner', flex: 1.2, minWidth: 160, renderCell: (p) => <DataGridTextCell icon={<Avatar size="xsmall">{String(p.value).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}</Avatar>} primary={p.value} /> },
    { field: 'status', headerName: 'Status', flex: 0.9, minWidth: 120, renderCell: (p) => <Status type="chip" label={p.value} color={tone[p.value] ?? 'gray'} /> },
  ];
  const grid = <T extends { id: number }>(rows: T[], columns: GridColDef<T>[]) => <DataGrid hideToolbar filledHeader hideFooter rows={rows} columns={columns} size="medium" autoHeight />;

  return (
    <Frame active="quality">
      <ContextBarPanel breadcrumbs={[{ node: 'Quality review', link: '/q' }, { node: 'Review workspace', link: '/w' }, { node: 'Annual review dashboard', link: '' }]} />
      <ListHeaderPanel title="Product A tablets" metaData="Review period: 01-Apr-25 – 31-Mar-26" actionSlot={<Status type="chip" label="Under approval" color="gray" />} divider={false} />
      <TabStatusFilterPanel tabs={[{ label: 'Dashboard' }, { label: 'Data sources' }, { label: 'Health check' }, { label: 'Deliverables' }, { label: 'Trending' }, { label: 'Workflow' }]} activeTab={tab} onTabChange={setTab} divider />
      <PageBodyContentPanel>
        <Stack spacing={2}>
          <Grid container spacing={1.5}>
            {kpis.map((k) => <Grid key={k.l} size={{ xs: 6, md: 3 }}><KPICard label={k.l} value={k.v} caption={k.c} color={k.k} hideIcon /></Grid>)}
          </Grid>
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
            <Typography variant="textL">Personalise</Typography>
            <Switch checked={personalise} onChange={(_, v) => setPersonalise(v)} slotProps={{ input: { 'aria-label': 'Personalise' } }} />
            <Button size="small" variant="outlined">Add card</Button>
          </Stack>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Region sx={{ height: '100%' }}>
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="heading6">Batch disposition</Typography><Typography variant="textL">42 batches</Typography></Stack>
                  <Stack direction="row" spacing={3} sx={{ mt: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <ChartDonut size="m" value="42" caption="Batches" slices={[{ label: 'Released', value: 76, color: '#22c55e' }, { label: 'In process', value: 18, color: '#f59e0b' }, { label: 'Rejected', value: 6, color: '#ef4444' }]} />
                    <Stack spacing={1.25} sx={{ flex: 1, minWidth: 180 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between' }}><ChartLegend label="Released" color="#22c55e" /><Typography variant="textL">13 · 76%</Typography></Stack>
                      <Stack direction="row" sx={{ justifyContent: 'space-between' }}><ChartLegend label="In process" color="#f59e0b" /><Typography variant="textL">3 · 8%</Typography></Stack>
                      <Stack direction="row" sx={{ justifyContent: 'space-between' }}><ChartLegend label="Rejected" color="#ef4444" /><Typography variant="textL">1 · 6%</Typography></Stack>
                    </Stack>
                  </Stack>
                  <Grid container spacing={1.5} sx={{ mt: 2 }}>
                    {[['Reject rate', '2.4%'], ['Average yield', '98.8%'], ['Yield range', '97.9 – 99.5%'], ['Pending release', '3'], ['Manufacturing site', 'Site 1'], ['Batch range', 'B-001 → B-048']].map(([l, v]) => (
                      <Grid key={l} size={6}><Typography variant="textM" sx={{ display: 'block' }}>{l}</Typography><Typography variant="heading6">{v}</Typography></Grid>
                    ))}
                  </Grid>
                </Box>
              </Region>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Region sx={{ height: '100%' }}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="heading6">Quality events</Typography>
                  <Grid container spacing={1} sx={{ mt: 1.5 }}>
                    {tiles.map((t) => (
                      <Grid key={t.l} size={{ xs: 6, md: 4 }}>
                        <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: tint[t.k], border: '1px solid', borderColor: edge[t.k], height: '100%' }}>
                          <Typography variant="heading5" sx={{ display: 'block' }}>{t.v}</Typography>
                          <Typography variant="textL" sx={{ display: 'block' }}>{t.l}</Typography>
                          <Typography variant="textM">{t.s}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Region>
            </Grid>
          </Grid>
          <Typography variant="heading6">Review focus · 14 items</Typography>
          <Block title="Data sources" count={sources.length}>{grid(sources, srcCols)}</Block>
          <Block title="Health check" count={checks.length}>{grid(checks, chkCols)}</Block>
          <Block title="Deliverables" count={dels.length}>{grid(dels, delCols)}</Block>
        </Stack>
      </PageBodyContentPanel>
    </Frame>
  );
}
