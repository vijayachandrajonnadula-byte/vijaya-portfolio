import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ControlChart } from './ControlChart';

const steady = [37.1, 36.6, 37.3, 37.0, 36.8, 37.4, 36.9, 37.2, 36.7, 37.1, 37.3, 36.9, 37.0, 37.2, 36.8, 37.1];

/** ControlChart: a steady run with limits, a run with a signal, a filled trend, and a bare sparkline. NOT FROM FIGMA. */
export default function ControlChartDemo() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 720 }}>
      <Stack spacing={1}>
        <Typography variant="textS">Limits: specification, action and centre line</Typography>
        <ControlChart values={steady} mean={37} actionHigh={38} actionLow={36} usl={39} lsl={35} aria-label="Steady process within its limits" />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="textS">A signal: the last point breaks the upper limit</Typography>
        <ControlChart values={[40, 40.6, 41, 39.8, 40.2, 40.9, 40.1, 40.3, 40.8, 43.4]} mean={40} ucl={43} lcl={37} signals={[9]} aria-label="Run with one signal" />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="textS">Area tint, for a capability trend</Typography>
        <ControlChart values={[0.8, 1.04, 0.84, 0.78, 1.0]} mean={0.9} ucl={1.5} lcl={0.25} area height={140} aria-label="Capability trend" />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="textS">Bare</Typography>
        <ControlChart values={steady} mean={37} bare height={48} aria-label="Sparkline" />
      </Stack>
    </Stack>
  );
}
