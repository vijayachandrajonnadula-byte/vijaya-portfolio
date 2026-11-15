import { useState } from 'react';
import { Box, Grid, Stack, Typography } from '../../components/mui';
import { Region } from '../../components/containers/Region/Region';
import { KPICard } from '../../components/data-display/KPICard/KPICard';
import type { KPICardColor } from '../../components/data-display/KPICard/KPICard';
import { ControlChart } from '../../components/data-display/ControlChart/ControlChart';
import { ChartHeader } from '../../components/data-display/Charts/ChartHeader';
import { DataGrid, DataGridTextCell } from '../../components/data-display/DataGrid/DataGrid';
import type { GridColDef } from '../../components/data-display/DataGrid/DataGrid';
import { Status } from '../../components/data-display/Status/Status';
import type { ChipColor } from '../../components/data-display/Chip/Chip';
import { Select } from '../../components/form/Select/Select';
import { ToggleButtonGroup } from '../../components/form/ToggleButtonGroup/ToggleButtonGroup';
import { Switch } from '../../components/form/Switch/Switch';
import { ContextBarPanel, ListHeaderPanel, PageBodyContentPanel, TabStatusFilterPanel } from '../../templates';
import { Frame } from '../_shared/frame';

/**
 * "Capability dashboard": a sample page for process monitoring, assembled only from design-system parts.
 * All names and figures are generic.
 */
interface Row { id: number; parameter: string; step: string; type: string; spec: string; alert: string; action: string; batch: string; value: string; status: string }
const tone: Record<string, ChipColor> = { 'In control': 'green', OOT: 'orange', OOS: 'red', Drift: 'orange' };
const rows: Row[] = [
  { id: 1, parameter: 'Reactor temperature', step: 'Cell culture', type: 'PP', spec: '35.5 – 38.5 °C', alert: '36.5 / 37.5 °C', action: '36.0 / 38.0 °C', batch: 'B-048', value: '37.1 °C', status: 'In control' },
  { id: 2, parameter: 'Dissolved oxygen', step: 'Cell culture', type: 'PP', spec: '25% – 55%', alert: '33 / 47%', action: '30 / 50%', batch: 'B-048', value: '45.8%', status: 'OOT' },
  { id: 3, parameter: 'pH set point', step: 'Cell culture', type: 'PP', spec: '6.75 – 7.25', alert: '6.85 / 7.15', action: '6.80 / 7.20', batch: 'B-048', value: '6.87', status: 'OOT' },
  { id: 4, parameter: 'Lactate concentration', step: 'Cell culture', type: 'PP', spec: '≤ 3.0 g/L', alert: '2.2 g/L', action: '2.6 g/L', batch: 'B-048', value: '2.1 g/L', status: 'Drift' },
  { id: 5, parameter: 'Cell bank viability', step: 'Cell culture', type: 'PP', spec: '≥ 85%', alert: '90%', action: '87%', batch: 'B-048', value: '96%', status: 'In control' },
  { id: 6, parameter: 'Media osmolality', step: 'Media prep', type: 'MA', spec: '270 – 330', alert: '280 / 320', action: '275 / 325', batch: 'B-048', value: '301', status: 'In control' },
  { id: 7, parameter: 'Potency', step: 'Fill-finish', type: 'MA', spec: '75% – 135%', alert: '85 / 120%', action: '80 / 125%', batch: 'B-048', value: '121%', status: 'OOS' },
];
const kpis: { v: string; l: string; c: string; k: KPICardColor }[] = [
  { v: '44', l: 'Batches in scope', c: '3 excluded · 1 flagged', k: 'purple' },
  { v: '34 / 35', l: 'Targets met', c: 'Latest 20 in-scope batches', k: 'green' },
  { v: '31 / 35', l: 'Capability targets met', c: 'Latest 20 in-scope batches', k: 'green' },
  { v: '9 / 12', l: 'Parameters in control', c: 'Process parameters', k: 'orange' },
  { v: '8 / 8', l: 'Attributes in control', c: 'Material attributes', k: 'red' },
  { v: '12 / 15', l: 'Quality attributes in control', c: 'Quality attributes', k: 'purple' },
  { v: '8', l: 'Open signals', c: 'Out of tolerance 3 · Out of spec 1', k: 'blue' },
];
const summary = [
  { name: 'Cell culture', n: '1 of 4', c: '#f59e0b', note: 'Lowest: Reactor temperature 1.37 (target 1.33)' },
  { name: 'Fill-finish', n: '2 of 2', c: '#22c55e', note: 'Lowest: Potency 1.42 (target 1.33)' },
  { name: 'Purification', n: '0 of 1', c: '#ef4444', note: 'Lowest: Aggregation 1.29 (target 1.33)' },
];
const trend = [0.82, 1.04, 0.84, 0.78, 1.0];

export default function CapabilityDashboardPage() {
  const [tab, setTab] = useState(0);
  const [metric, setMetric] = useState<string | null>('cpk');
  const [personalise, setPersonalise] = useState(false);

  const columns: GridColDef<Row>[] = [
    { field: 'parameter', headerName: 'Parameter', flex: 1.4, minWidth: 190, renderCell: (p) => <DataGridTextCell primary={p.row.parameter} secondary={p.row.step} /> },
    { field: 'type', headerName: 'Type', width: 80 },
    { field: 'spec', headerName: 'Spec', flex: 1, minWidth: 140 },
    { field: 'alert', headerName: 'Alert limit', flex: 1, minWidth: 140 },
    { field: 'action', headerName: 'Action limit', flex: 1, minWidth: 140 },
    { field: 'batch', headerName: 'Latest batch', flex: 0.8, minWidth: 110 },
    { field: 'value', headerName: 'Latest value', flex: 0.8, minWidth: 110 },
    { field: 'status', headerName: 'Status', flex: 0.9, minWidth: 130, renderCell: (p) => <Status type="chip" label={p.value} color={tone[p.row.status] ?? 'gray'} /> },
  ];

  return (
    <Frame active="verification">
      <ContextBarPanel breadcrumbs={[{ node: 'Verification', link: '/v' }, { node: 'Capability workspace', link: '/w' }, { node: 'Capability dashboard', link: '' }]} />
      <ListHeaderPanel
        title="Capability project for Product A"
        metaData="Monoclonal antibody · Approved"
        actionSlot={<Select size="small" options={['All batches', 'Last 30 batches', 'Last 20 batches']} value="All batches" />}
        divider={false}
      />
      <TabStatusFilterPanel
        tabs={[{ label: 'Capability dashboard' }, { label: 'Process parameters' }, { label: 'Quality trends' }, { label: 'Alerts & investigation' }, { label: 'Batch records' }]}
        activeTab={tab}
        onTabChange={setTab}
        divider
      />
      <PageBodyContentPanel>
        <Stack spacing={2}>
          <Grid container spacing={1.5}>
            {kpis.map((k) => (
              <Grid key={k.l} size={{ xs: 6, md: 3 }}>
                <KPICard label={k.l} value={k.v} caption={k.c} color={k.k} hideIcon />
              </Grid>
            ))}
          </Grid>
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant="textL">Personalise</Typography>
              <Switch checked={personalise} onChange={(_, v) => setPersonalise(v)} slotProps={{ input: { 'aria-label': 'Personalise' } }} />
            </Stack>
            <Select size="small" options={['Add card', 'Capability trend', 'Open signals']} placeholder="Add card" />
          </Stack>
          <Region>
            <Box sx={{ p: 2 }}>
              <ChartHeader title="Process capability trend" subtitle="Cell culture · Spec 35.5 – 38.5 · each point is the latest in-scope batch group" />
              <Box sx={{ mt: 1 }}>
                <ToggleButtonGroup
                  size="small"
                  buttonList={[{ value: 'cpk', label: 'Cpk' }, { value: 'ppk', label: 'Ppk' }]}
                  value={metric}
                  onChange={(_, v) => setMetric(v ?? metric)}
                  ariaLabel="Capability index"
                  exclusive
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <ControlChart values={trend} mean={0.9} ucl={1.5} lcl={0.25} area height={220} width={900} aria-label="Capability trend across five batch groups" />
              </Box>
            </Box>
          </Region>
          <Grid container spacing={1.5}>
            {summary.map((s) => (
              <Grid key={s.name} size={{ xs: 12, md: 4 }}>
                <Region>
                  <Stack spacing={0.5} sx={{ p: 2 }}>
                    <Typography variant="textL">{s.name}</Typography>
                    <Typography variant="heading5" sx={{ color: s.c }}>{s.n}</Typography>
                    <Typography variant="textM">parameters meet their capability target</Typography>
                    <Typography variant="textM">{s.note}</Typography>
                  </Stack>
                </Region>
              </Grid>
            ))}
          </Grid>
          <Region>
            <Box sx={{ p: 2 }}>
              <Typography variant="heading6">Control status for monitored parameters</Typography>
              <Box sx={{ mt: 1.5 }}>
                <DataGrid hideToolbar filledHeader hideFooter rows={rows} columns={columns} size="medium" columnDividers autoHeight />
              </Box>
            </Box>
          </Region>
        </Stack>
      </PageBodyContentPanel>
    </Frame>
  );
}
