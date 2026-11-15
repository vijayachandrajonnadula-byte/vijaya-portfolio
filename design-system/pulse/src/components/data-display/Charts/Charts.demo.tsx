import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FilterListRounded from '@mui/icons-material/FilterListRounded';
import MoreVertRounded from '@mui/icons-material/MoreVertRounded';
import { IconButton } from '../../actions/IconButton/IconButton';
import { ChartAxisValue } from './ChartAxis';
import type { ChartAxisAlign } from './ChartAxis';
import { ChartXAxis, ChartYAxis } from './ChartAxis';
import { ChartBar } from './ChartBar';
import { ChartHeader } from './ChartHeader';
import { ChartInteractiveNode } from './ChartInteractiveNode';
import type { ChartNodeColor } from './ChartInteractiveNode';
import { ChartLegend } from './ChartLegend';
import { ChartCircle, ChartDonut, ChartNightingale, ChartPie } from './ChartRadial';
import { chartColors, pulseChartTheme } from './ChartTheme';

const Label = ({ children }: { children: string }) => <Typography variant="textM" color="text.secondary">{children}</Typography>;
const row = { flexWrap: 'wrap', alignItems: 'flex-end', gap: 4 } as const;
const aligns: ChartAxisAlign[] = ['x-center', 'x-left', 'x-right', 'y-top', 'y-middle', 'y-bottom'];
const nodes: ChartNodeColor[] = ['brand', 'color2', 'color3', 'color4', 'color5', 'color6', 'purple', 'cyan', 'teal'];
const xv = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
const yv = ['100', '75', '50', '25', '0'];

export default function ChartsDemo() {
  return (
    <Stack spacing={3}>
      <Label>Header (loose component)</Label>
      <div style={{ width: 403 }}>
        <ChartHeader
          title="Title"
          subtitle="Subtitle"
          filterLabel="Filter"
          filterAction={<IconButton ariaLabel="Filter" size="small" shape="square"><FilterListRounded /></IconButton>}
          moreAction={<IconButton ariaLabel="More" size="small" shape="square"><MoreVertRounded /></IconButton>}
        />
      </div>

      <Label>Axis values (Align)</Label>
      <Stack direction="row" useFlexGap sx={{ ...row, alignItems: 'center' }}>
        {aligns.map((a) => (
          <Stack key={a} spacing={0.5} sx={{ minWidth: 100, alignItems: a.startsWith('y') ? 'stretch' : 'flex-start' }}>
            <Typography variant="textS" color="text.secondary">{a}</Typography>
            <ChartAxisValue align={a}>{a.startsWith('x') ? 'X Axis' : 'Y Axis'}</ChartAxisValue>
          </Stack>
        ))}
      </Stack>

      <Label>X-Axis (Value Position Center | Left | Right)</Label>
      <Stack spacing={1}>
        {(['center', 'left', 'right'] as const).map((p) => <ChartXAxis key={p} values={xv} valuePosition={p} />)}
      </Stack>

      <Label>Y-Axis (Value Position Middle | Top | Bottom)</Label>
      <Stack direction="row" useFlexGap sx={row}>
        {(['middle', 'top', 'bottom'] as const).map((p) => <ChartYAxis key={p} values={yv} valuePosition={p} />)}
      </Stack>

      <Label>Bar (Size S / M / L / XL x Orientation)</Label>
      <Stack direction="row" useFlexGap sx={row}>
        {(['s', 'm', 'l', 'xl'] as const).map((s) => <ChartBar key={s} size={s} />)}
      </Stack>
      <Stack spacing={1}>
        {(['s', 'm', 'l', 'xl'] as const).map((s) => <ChartBar key={s} size={s} orientation="horizontal" />)}
      </Stack>

      <Label>Legends (Open Round, Open Square, Stacked Round)</Label>
      <Stack direction="row" useFlexGap sx={{ ...row, alignItems: 'center' }}>
        <ChartLegend label="Brand" />
        <ChartLegend label="Brand" shape="square" />
        <ChartLegend label="Brand" variant="stacked" />
      </Stack>

      <Label>Donut (Size S / M / L)</Label>
      <Stack direction="row" useFlexGap sx={row}>
        {(['s', 'm', 'l'] as const).map((s) => <ChartDonut key={s} size={s} value="140" caption="Total Data" />)}
      </Stack>

      <Label>Pie, Nightingale</Label>
      <Stack direction="row" useFlexGap sx={row}>
        <ChartPie />
        <ChartNightingale />
      </Stack>

      <Label>Circle (Size S / M / L)</Label>
      <Stack direction="row" useFlexGap sx={row}>
        {(['s', 'm', 'l'] as const).map((s) => <ChartCircle key={s} size={s} />)}
      </Stack>

      <Label>Interactive nodes (Color)</Label>
      <Stack direction="row" useFlexGap sx={{ ...row, alignItems: 'center' }}>
        {nodes.map((c) => <ChartInteractiveNode key={c} color={c} />)}
      </Stack>

      <Label>pulseChartTheme (recharts) series</Label>
      <Stack direction="row" useFlexGap sx={{ ...row, alignItems: 'center' }}>
        {pulseChartTheme.series.map((c, i) => <ChartLegend key={c} label={Object.keys(chartColors)[i] ?? c} color={c} />)}
      </Stack>
    </Stack>
  );
}
