import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { KPICard } from './KPICard';

const colors = ['default', 'green', 'orange', 'red', 'blue', 'purple', 'yellow', 'ai', 'custom'] as const;

export default function KPICardDemo() {
  return (
    <Stack spacing={3}>
      <Typography variant="textM" color="text.secondary">All colours (hover a card for the hover state)</Typography>
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 2 }}>
        {colors.map((c) => (
          <KPICard key={c} color={c} label={`Open tasks (${c})`} value="128" caption="+4 this week" />
        ))}
      </Stack>
      <Typography variant="textM" color="text.secondary">Clickable, with progress donut, without icon</Typography>
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 2 }}>
        <KPICard color="blue" label="Clickable" value="32" onClick={() => undefined} />
        <KPICard color="green" label="Completion" value="72" progress={72} />
        <KPICard color="orange" label="No icon" value="9" hideIcon />
      </Stack>
    </Stack>
  );
}
