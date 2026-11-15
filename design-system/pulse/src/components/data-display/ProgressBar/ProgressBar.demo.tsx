import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ProgressBar, ProgressBarAnimation, ProgressBarNotification } from './ProgressBar';
import type { ProgressBarColor, ProgressBarLabel, ProgressBarStatus } from './ProgressBar';

// Figma progressBar Color: 0% | Default | Red | Green | Orange | Blue | Yellow
const colors: { name: string; value: number; color: ProgressBarColor }[] = [
  { name: '0%', value: 0, color: 'default' },
  { name: 'Default', value: 50, color: 'default' },
  { name: 'Red', value: 50, color: 'red' },
  { name: 'Green', value: 50, color: 'green' },
  { name: 'Orange', value: 50, color: 'orange' },
  { name: 'Blue', value: 50, color: 'blue' },
  { name: 'Yellow', value: 50, color: 'yellow' },
];
const labels: ProgressBarLabel[] = [false, 'right', 'topRight', 'topBoth', 'bottomRight', 'bottomBoth'];
const statuses: ProgressBarStatus[] = ['empty', 'default', 'normal', 'average', 'alert', 'critical'];

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px 32px' } as const;

/** ProgressBar: Label x Color x Interaction (84), Label x Status gradient (36), notification strip, and the 3 animation states. */
export default function ProgressBarDemo() {
  return (
    <Stack spacing={3}>
      <Typography variant="textM">progressBar: Label x Color (Interaction=Default)</Typography>
      {colors.map((c) => (
        <Stack key={c.name} spacing={1}>
          <Typography variant="textS">{c.name}</Typography>
          <Box sx={grid}>
            {labels.map((l) => (
              <ProgressBar key={String(l)} value={c.value} color={c.color} label={l} labelText={c.value ? 'Stopped' : 'Starting...'} helperText={l === false ? 'Hint text' : undefined} />
            ))}
          </Box>
        </Stack>
      ))}
      <Typography variant="textM">progressBar: Interaction=Disabled</Typography>
      {colors.map((c) => (
        <Stack key={c.name} spacing={1}>
          <Typography variant="textS">{c.name}</Typography>
          <Box sx={grid}>
            {labels.map((l) => (
              <ProgressBar key={String(l)} value={c.value} color={c.color} label={l} labelText="Stopped" disabled />
            ))}
          </Box>
        </Stack>
      ))}
      <Typography variant="textM">progressBarGradient: Label x Status</Typography>
      {statuses.map((s) => (
        <Stack key={s} spacing={1}>
          <Typography variant="textS">{s}</Typography>
          <Box sx={grid}>
            {labels.map((l) => <ProgressBar key={String(l)} gradient status={s} label={l} />)}
          </Box>
        </Stack>
      ))}
      <Typography variant="textM">progressBarNotification: Colour x Position (Start 0%, Mid 50%, Full 100%)</Typography>
      <Box sx={{ ...grid, alignItems: 'start' }}>
        {([0, 50, 100] as const).map((v) => <ProgressBarNotification key={`b${v}`} value={v} />)}
        {([0, 50, 100] as const).map((v) => (
          <Box key={`w${v}`} sx={{ background: '#1e3a6e' }}><ProgressBarNotification value={v} colour="white" /></Box>
        ))}
      </Box>
      <Typography variant="textM">Animations: .Animation-InProgress, .Animation-InErrorState, .Animation-Success</Typography>
      <Box sx={grid}>
        <ProgressBarAnimation state="inProgress" />
        <ProgressBarAnimation state="error" />
        <ProgressBarAnimation state="success" />
      </Box>
    </Stack>
  );
}
