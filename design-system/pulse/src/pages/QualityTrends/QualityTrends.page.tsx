import { useState } from 'react';
import { Box, Grid, Stack, Typography } from '../../components/mui';
import { Region } from '../../components/containers/Region/Region';
import { Chip } from '../../components/data-display/Chip/Chip';
import type { ChipColor } from '../../components/data-display/Chip/Chip';
import { ControlChart } from '../../components/data-display/ControlChart/ControlChart';
import { ChartHeader } from '../../components/data-display/Charts/ChartHeader';
import { Notification } from '../../components/feedback/Notification/Notification';
import { Select } from '../../components/form/Select/Select';
import { ContextBarPanel, ListHeaderPanel, PageBodyContentPanel, TabStatusFilterPanel } from '../../templates';
import { Frame } from '../_shared/frame';

/** "Quality trends": an attribute list beside rule checks, two control charts and summary figures. Generic sample data. */
const wave = (n: number, base: number, amp: number) => Array.from({ length: n }, (_, i) => Number((base + Math.sin(i * 1.9) * amp * 0.6 + Math.cos(i * 0.8) * amp * 0.4).toFixed(2)));
const attrs: { name: string; cpk: string; status: string; tone: ChipColor }[] = [
  { name: 'Potency', cpk: '1.42', status: 'OOT', tone: 'orange' },
  { name: 'Aggregation', cpk: '1.29', status: 'OOS', tone: 'red' },
  { name: 'Charge variants', cpk: '1.53', status: 'In control', tone: 'green' },
  { name: 'Glycosylation', cpk: '1.53', status: 'In control', tone: 'green' },
  { name: 'Host cell protein', cpk: '1.49', status: 'In control', tone: 'green' },
  { name: 'Residual DNA', cpk: '1.72', status: 'In control', tone: 'green' },
  { name: 'Endotoxin', cpk: '1.42', status: 'Variability', tone: 'orange' },
  { name: 'Titer / yield', cpk: '1.72', status: 'In control', tone: 'green' },
];
const rules: { n: string; d: string; r: 'Fail' | 'Pass' | 'Not evaluated' }[] = [
  { n: 'Rule 1', d: '1 point beyond the 3σ action limit', r: 'Fail' }, { n: 'Rule 2', d: '9 points in a row on the same side of centre', r: 'Pass' },
  { n: 'Rule 3', d: '6 points steadily trending', r: 'Pass' }, { n: 'Rule 4', d: '14 points alternating up and down', r: 'Not evaluated' },
  { n: 'Rule 5', d: '2 of 3 points beyond 2σ, same side', r: 'Pass' }, { n: 'Rule 6', d: '4 of 5 points beyond 1σ, same side', r: 'Pass' },
  { n: 'Rule 7', d: '15 points within ±1σ (stratification)', r: 'Not evaluated' }, { n: 'Rule 8', d: '8 points beyond ±1σ, both sides', r: 'Not evaluated' },
];
const stats = [
  ['48', 'N'], ['103.1 %', 'Mean'], ['102.7 %', 'Median'], ['6.1 %', 'Std dev'], ['1.42', 'Cpk, latest 20 batches'], ['1.35', 'Ppk'],
  ['92.8 %', 'Min'], ['121.0 %', 'Max'], ['5.92 %', 'RSD'], ['1', 'Normality (p)'], ['0', 'Out-of-spec count'], ['0', 'Out-of-tolerance count'],
];
const values = wave(36, 88.4, 12);

export default function QualityTrendsPage() {
  const [tab, setTab] = useState(0);
  const [sub, setSub] = useState(2);
  const [pick, setPick] = useState('Potency');
  return (
    <Frame active="verification">
      <ContextBarPanel breadcrumbs={[{ node: 'Verification', link: '/v' }, { node: 'Capability workspace', link: '/w' }, { node: 'Product A', link: '' }]} />
      <TabStatusFilterPanel tabs={[{ label: 'Capability workspace' }, { label: 'Capability plan' }, { label: 'Visualisation' }, { label: 'Analytics' }]} activeTab={tab} onTabChange={setTab} divider />
      <ListHeaderPanel title="Product A" metaData="Monoclonal antibody · 150 mg/vial" actionSlot={<Select size="small" options={['Last 30 batches', 'Last 20 batches']} value="Last 30 batches" />} divider={false} />
      <TabStatusFilterPanel tabs={[{ label: 'Capability dashboard' }, { label: 'Process parameters' }, { label: 'Quality trends' }, { label: 'Alerts & investigation' }, { label: 'Batch records' }]} activeTab={sub} onTabChange={setSub} divider />
      <PageBodyContentPanel>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Region>
              <Box sx={{ p: 2 }}>
                <Typography variant="heading6">Quality attributes · 9</Typography>
                <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                  {attrs.map((a) => (
                    <Box
                      key={a.name}
                      component="button"
                      type="button"
                      aria-pressed={pick === a.name}
                      onClick={() => setPick(a.name)}
                      sx={{ all: 'unset', cursor: 'pointer', boxSizing: 'border-box', p: 1.25, borderRadius: '8px', border: '1px solid', borderColor: pick === a.name ? '#d3e0f2' : 'transparent', bgcolor: pick === a.name ? '#f6f8fc' : 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, '&:focus-visible': { boxShadow: '0 0 0 1px #fff, 0 0 0 3px #3B82F6' } }}
                    >
                      <Box><Typography variant="textL" sx={{ display: 'block' }}>{a.name}</Typography><Typography variant="textM">Cpk {a.cpk}</Typography></Box>
                      <Chip label={a.status} color={a.tone} size="xsmall" />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Region>
          </Grid>
          <Grid size={{ xs: 12, lg: 9 }}>
            <Stack spacing={1.5}>
              <Region>
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="heading6">Run-rule assessment</Typography>
                    <Chip label="48 batches evaluated" color="gray" size="xsmall" />
                  </Stack>
                  <Grid container spacing={1}>
                    {rules.map((r) => (
                      <Grid key={r.n} size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Region sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', p: 1.5, height: '100%' }}>
                          <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
                            <Typography variant="textL">{r.n}</Typography>
                            <Typography variant="textL" sx={{ color: r.r === 'Fail' ? '#dc2626' : r.r === 'Pass' ? '#15803d' : '#566680' }}>{r.r}</Typography>
                          </Stack>
                          <Typography variant="textM" sx={{ display: 'block', mt: 0.5 }}>{r.d}</Typography>
                        </Region>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Region>
              <Notification color="orange" variant="fill" title="Beyond alert limit (120%)" showIcon />
              <Region>
                <Box sx={{ p: 2 }}>
                  <ChartHeader title={pick} subtitle="Spec: 75 – 135 % · Method: cell-based bioassay · n = 44 in-scope batches" />
                  <Typography variant="textL" sx={{ display: 'block', mt: 1.5 }}>Individuals chart</Typography>
                  <ControlChart values={values} mean={88.4} ucl={108.8} lcl={68} height={200} width={900} aria-label="Individuals chart" />
                  <Typography variant="textL" sx={{ display: 'block', mt: 1.5 }}>Moving range chart</Typography>
                  <ControlChart values={values.map((v, i) => (i ? Math.abs(v - (values[i - 1] ?? v)) * 0.8 + 6 : 7))} mean={8} ucl={14} height={170} width={900} aria-label="Moving range chart" />
                </Box>
              </Region>
              <Region>
                <Box sx={{ p: 2 }}>
                  <Typography variant="heading6" sx={{ mb: 1.5 }}>Descriptive statistics · {pick}</Typography>
                  <Grid container spacing={1}>
                    {stats.map(([v, l]) => (
                      <Grid key={l} size={{ xs: 6, md: 3 }}>
                        <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#f6f8fc', border: '1px solid #e2e8f0' }}>
                          <Typography variant="heading5" sx={{ display: 'block' }}>{v}</Typography>
                          <Typography variant="textM">{l}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Region>
            </Stack>
          </Grid>
        </Grid>
      </PageBodyContentPanel>
    </Frame>
  );
}
