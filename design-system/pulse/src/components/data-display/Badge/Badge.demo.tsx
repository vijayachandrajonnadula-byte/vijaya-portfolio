import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NotificationsRounded from '@mui/icons-material/NotificationsRounded';
import { Badge } from './Badge';
import type { BadgeColor } from './Badge';

const colors: BadgeColor[] = ['blue', 'brand', 'complementary', 'dark_gray', 'gray', 'green', 'orange', 'red', 'yellow', 'black', 'ai', 'purple', 'cyan', 'teal', 'custom'];
const row = { flexWrap: 'wrap', gap: 1.5, alignItems: 'center' } as const;

/** Badge: Dot x 4 sizes, Standard and Stroke, all 15 colours, plus anchored usage. */
export default function BadgeDemo() {
  return (
    <Stack spacing={2.5}>
      {(['xsmall', 'small', 'medium', 'large'] as const).map((size) => (
        <Stack key={size} direction="row" useFlexGap sx={row}>
          <Typography variant="textS" sx={{ width: 64 }}>dot {size}</Typography>
          {colors.map((c) => <Badge key={c} variant="dot" size={size} color={c} customColor="#f97316" />)}
        </Stack>
      ))}
      {(['standard', 'stroke'] as const).map((v) => (
        <Stack key={v} direction="row" useFlexGap sx={row}>
          <Typography variant="textS" sx={{ width: 64 }}>{v}</Typography>
          {colors.map((c) => <Badge key={c} variant={v} color={c} customColor="#f97316" badgeContent={8} />)}
          <Badge variant={v} color="red" badgeContent="99+" />
        </Stack>
      ))}
      <Stack direction="row" spacing={3}>
        <Badge variant="standard" color="red" badgeContent={3}><NotificationsRounded /></Badge>
        <Badge variant="dot" color="green"><NotificationsRounded /></Badge>
      </Stack>
    </Stack>
  );
}

