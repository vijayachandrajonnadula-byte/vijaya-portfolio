import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Region } from './Region';

/** Figma "cards": Shape (Square 400x400 | Rectangle 800x400) x Radius (0 | 8 | 16). */
export default function RegionDemo() {
  return (
    <Stack spacing={2}>
      <Typography variant="textM" color="text.secondary">Square, radius 0 / 8 / 16</Typography>
      <Stack direction="row" spacing={2}>
        {(['none', 'medium', 'xxxlarge'] as const).map((r) => (
          <Region key={r} radius={r} sx={{ width: 200, height: 200, p: 2 }}>
            <Typography variant="textL">radius {r}</Typography>
          </Region>
        ))}
      </Stack>
      <Typography variant="textM" color="text.secondary">Rectangle (2:1), radius 0 / 8 / 16</Typography>
      <Stack direction="row" spacing={2}>
        {(['none', 'medium', 'xxxlarge'] as const).map((r) => (
          <Region key={r} radius={r} sx={{ width: 400, height: 200, p: 2 }}>
            <Typography variant="textL">radius {r}</Typography>
          </Region>
        ))}
      </Stack>
    </Stack>
  );
}
