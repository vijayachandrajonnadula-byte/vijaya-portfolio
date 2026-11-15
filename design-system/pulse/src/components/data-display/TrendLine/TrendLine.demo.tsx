import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TrendLine } from './TrendLine';
import type { TrendLineColor } from './TrendLine';

const colors: TrendLineColor[] = ['green', 'orange', 'red', 'yellow', 'gray', 'purple'];

/** TrendLine: the six Figma colours (gray is the flat line), plus a data-driven example. */
export default function TrendLineDemo() {
  return (
    <Stack spacing={1.5}>
      {colors.map((c) => (
        <Stack key={c} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="textS" sx={{ width: 70 }}>{c}</Typography>
          <TrendLine color={c} />
        </Stack>
      ))}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="textS" sx={{ width: 70 }}>data</Typography>
        <TrendLine color="red" data={[1, 3, 2, 5, 9, 4, 8]} aria-label="Deviations trending up" />
      </Stack>
    </Stack>
  );
}
