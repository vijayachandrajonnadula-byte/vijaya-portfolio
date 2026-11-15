import { useState } from 'react';
import { Box, Grid, Stack, Typography } from '../../components/mui';
import { Region } from '../../components/containers/Region/Region';
import { Button } from '../../components/actions/Button/Button';
import { IconButton } from '../../components/actions/IconButton/IconButton';
import { ControlChart } from '../../components/data-display/ControlChart/ControlChart';
import { Status } from '../../components/data-display/Status/Status';
import type { ChipColor } from '../../components/data-display/Chip/Chip';
import { Select } from '../../components/form/Select/Select';
import { ToggleButtonGroup } from '../../components/form/ToggleButtonGroup/ToggleButtonGroup';
import { ArrowExpandIcon } from '../../icons';
import { ContextBarPanel, ListHeaderPanel, PageBodyContentPanel, TabStatusFilterPanel } from '../../templates';
import { Frame } from '../_shared/frame';

/** "Parameter monitoring": filters over a grid of control charts. Sample data is generated and generic. */
const wave = (n: number, base: number, amp: number, seed: number) => Array.from({ length: n }, (_, i) => Number((base + Math.sin(i * 1.7 + seed) * amp * 0.6 + Math.cos(i * 0.9 + seed * 2) * amp * 0.4).toFixed(3)));
interface Card { code: string; name: string; meta: string; status: string; tone: ChipColor; values: number[]; mean: number; ucl?: number; lcl?: number; ah?: number; al?: number; usl?: number; lsl?: number; signals?: number[] }
const cards: Card[] = [
  { code: 'PP-001', name: 'Reactor temperature', meta: 'Production reactor · Critical · Individuals chart', status: 'In control', tone: 'green', values: wave(44, 37, 0.5, 1), mean: 37, ah: 38, al: 36, usl: 39, lsl: 35 },
  { code: 'PP-002', name: 'Dissolved oxygen', meta: 'Production reactor · Critical · Moving average', status: 'OOT', tone: 'orange', values: [...wave(43, 40, 0.8, 2), 44.1], mean: 40, ucl: 43.5, lcl: 36.5, signals: [43] },
  { code: 'PP-003', name: 'pH set point', meta: 'Production reactor · Critical · Individuals chart', status: 'OOT', tone: 'orange', values: [...wave(40, 7, 0.07, 3), 6.96, 6.92, 6.88, 6.84], mean: 7, ah: 7.2, al: 6.8, usl: 7.4, lsl: 6.6, signals: [41, 42, 43] },
  { code: 'PP-004', name: 'Agitation speed', meta: 'Production reactor · Critical · Individuals chart', status: 'In control', tone: 'green', values: wave(44, 200, 12, 4), mean: 200, ah: 225, al: 175, usl: 250, lsl: 150 },
  { code: 'PP-005', name: 'Nutrient feed rate', meta: 'Fed-batch feeding · Non-critical · Cumulative sum', status: 'In control', tone: 'green', values: wave(44, 0, 0.5, 5), mean: 0, ah: 5, al: -5 },
  { code: 'PP-006', name: 'Glucose feed concentration', meta: 'Fed-batch feeding · Non-critical · Individuals chart', status: 'In control', tone: 'green', values: wave(44, 4, 0.3, 6), mean: 4, ah: 4.5, al: 3.5, usl: 5, lsl: 3 },
  { code: 'PP-007', name: 'Lactate concentration', meta: 'Production reactor · Non-critical · Individuals chart', status: 'Drift', tone: 'orange', values: [...wave(38, 1.4, 0.4, 7), 1.5, 1.7, 1.85, 1.95, 2.05, 2.15], mean: 1.4, ah: 2, usl: 3, signals: [43] },
  { code: 'PP-008', name: 'Harvest viability', meta: 'Harvest · Critical · Individuals chart', status: 'In control', tone: 'green', values: wave(44, 92, 2, 8), mean: 92, al: 87.5, lsl: 85 },
];

export default function ParameterMonitoringPage() {
  const [tab, setTab] = useState(1);
  const [view, setView] = useState<string | null>('chart');
  return (
    <Frame active="verification">
      <ContextBarPanel breadcrumbs={[{ node: 'Verification', link: '/v' }, { node: 'Capability workspace', link: '/w' }, { node: 'Product A', link: '' }]} />
      <ListHeaderPanel
        title="Product A"
        metaData="Monoclonal antibody · 150 mg/vial"
        actionSlot={<Select size="small" options={['Last 30 batches', 'Last 20 batches', 'All batches']} value="Last 30 batches" />}
        divider={false}
      />
      <TabStatusFilterPanel
        tabs={[{ label: 'Capability dashboard' }, { label: 'Process parameters' }, { label: 'Quality trends' }, { label: 'Alerts & investigation' }, { label: 'Batch records' }, { label: 'Summary' }]}
        activeTab={tab}
        onTabChange={setTab}
        divider
      />
      <PageBodyContentPanel>
        <Stack spacing={2}>
          <Region>
            <Stack direction="row" spacing={2} sx={{ p: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              {['Process step', 'Criticality', 'Status', 'Batch range from', 'Batch range to'].map((l) => (
                <Box key={l} sx={{ flex: '1 1 160px', minWidth: 150 }}><Select label={l} size="small" options={['Select']} placeholder="Select" fullWidth /></Box>
              ))}
              <Button variant="outlined" size="small">Reset</Button>
              <Button size="small">Apply</Button>
            </Stack>
          </Region>
          <Region>
            <Stack direction="row" sx={{ p: 2, alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="heading6">Process parameter monitoring</Typography>
              <ToggleButtonGroup size="small" exclusive ariaLabel="View" value={view} onChange={(_, v) => setView(v ?? view)} buttonList={[{ value: 'chart', label: 'Chart' }, { value: 'list', label: 'List' }]} />
            </Stack>
          </Region>
          <Region>
            <Box sx={{ p: 2 }}>
              <Typography variant="heading6">Control charts</Typography>
              <Typography variant="textL" sx={{ display: 'block', mb: 1.5 }}>Each parameter’s primary chart, over the selected batch range. Signal points are red.</Typography>
              <Grid container spacing={1.5}>
                {cards.map((c) => (
                  <Grid key={c.code} size={{ xs: 12, lg: 6 }}>
                    <Region>
                      <Stack direction="row" sx={{ p: 1.5, alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                        <Box>
                          <Typography variant="textL" sx={{ display: 'block' }}>{c.code} · {c.name}</Typography>
                          <Typography variant="textM">{c.meta}</Typography>
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Status type="chip" label={c.status} color={c.tone} />
                          <IconButton ariaLabel={`Expand ${c.name}`} size="xsmall"><ArrowExpandIcon size={16} /></IconButton>
                        </Stack>
                      </Stack>
                      <Box sx={{ px: 1.5, pb: 1.5 }}>
                        <ControlChart values={c.values} mean={c.mean} ucl={c.ucl} lcl={c.lcl} actionHigh={c.ah} actionLow={c.al} usl={c.usl} lsl={c.lsl} signals={c.signals} height={200} aria-label={`${c.name} control chart`} />
                      </Box>
                    </Region>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Region>
        </Stack>
      </PageBodyContentPanel>
    </Frame>
  );
}
