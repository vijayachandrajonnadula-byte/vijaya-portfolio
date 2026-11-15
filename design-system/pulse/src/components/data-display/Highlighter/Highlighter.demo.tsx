import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Highlighter } from './Highlighter';
import type { HighlighterBadgeSize, HighlighterColor } from './Highlighter';

const colors: HighlighterColor[] = ['blue', 'yellow', 'red', 'green', 'orange', 'brand', 'gray', 'purple'];
const sizes: HighlighterBadgeSize[] = ['xsmall', 'small', 'medium', 'large'];

/** Highlighter: Blue = Current version, the other seven = Previous; Dot (4 badge sizes) and Line. */
export default function HighlighterDemo() {
  return (
    <Stack spacing={1.5}>
      <Typography variant="textM">Indicator = Dot (badge size small)</Typography>
      <Stack direction="row" useFlexGap sx={{ gap: 2, flexWrap: 'wrap' }}>
        {colors.map((c) => <Highlighter key={c} color={c}>{c} value</Highlighter>)}
      </Stack>
      <Typography variant="textM">Dot badge sizes</Typography>
      <Stack direction="row" useFlexGap sx={{ gap: 2, flexWrap: 'wrap' }}>
        {sizes.map((s) => <Highlighter key={s} badgeSize={s}>{s}</Highlighter>)}
      </Stack>
      <Typography variant="textM">Indicator = Line</Typography>
      <Stack direction="row" useFlexGap sx={{ gap: 2, flexWrap: 'wrap' }}>
        {colors.map((c) => <Highlighter key={c} color={c} indicator="line">{c} value</Highlighter>)}
      </Stack>
    </Stack>
  );
}
