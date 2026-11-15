import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '../../actions/Button/Button';
import { WorkspaceCard } from './WorkspaceCard';
import type { WorkspaceCardColor } from './WorkspaceCard';

const colors: WorkspaceCardColor[] = ['none', 'gray', 'darkGray', 'brand', 'green', 'red', 'cyan', 'teal', 'orange', 'purple', 'blue'];

const slot = (label: string) => (
  <Box sx={{ flex: 1, minHeight: 125, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #6d28d9', background: '#fcfaff', borderRadius: '8px', fontSize: 12 }}>{label}</Box>
);

export default function WorkspaceCardDemo() {
  return (
    <Stack spacing={2}>
      <Typography variant="textM" color="text.secondary">Color (11) x Interaction: Default (left) / Hover (right, forced). 420px wide, 4px top accent.</Typography>
      {colors.map((c) => (
        <Stack key={c} direction="row" useFlexGap sx={{ gap: 2, flexWrap: 'wrap' }}>
          {[false, true].map((hover) => (
            <WorkspaceCard key={String(hover)} color={c} hover={hover} footer={<Button size="small" variant="outlined">Open</Button>}>
              {slot(`color=${c} ${hover ? 'hover' : 'default'}`)}
            </WorkspaceCard>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}