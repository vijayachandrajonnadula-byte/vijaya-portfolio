import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EmptyState } from './EmptyState';
import type { EmptyStateType } from './EmptyState';

const types: EmptyStateType[] = ['noRecords', 'noSearch', 'noFilter', 'error'];

export default function EmptyStateDemo() {
  return (
    <Stack spacing={3}>
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Box key={size}>
          <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>{`Size ${size} (illustration ${{ small: 120, medium: 160, large: 200 }[size]}px)`}</Typography>
          <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 2 }}>
            {types.map((t) => (
              <Box key={t} sx={{ border: '1px dashed #e2e8f0', width: 400 }}>
                <EmptyState type={t} size={size} onAction={t === 'noSearch' ? undefined : () => undefined} />
              </Box>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
