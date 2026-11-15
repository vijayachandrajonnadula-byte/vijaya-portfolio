import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ScrollBar, scrollBarColors } from './ScrollBar';

const lines = Array.from({ length: 24 }, (_, i) => `Line ${i + 1}: scrollable content`);

function Thumb({ color, label }: { color: string; label: string }) {
  return (
    <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
      <Box data-spec="scrollbar thumb" sx={{ width: 4, height: 25, borderRadius: '4px', backgroundColor: color }} />
      <Typography variant="textS" color="inherit">{label}</Typography>
    </Stack>
  );
}

/** Vertical and horizontal scrollbars on light and dark stages, plus the static thumb states from the spec. */
export default function ScrollBarDemo() {
  return (
    <Stack spacing={3}>
      {(['light', 'dark'] as const).map((bg) => (
        <Box key={bg} sx={{ p: 2, borderRadius: 1, backgroundColor: bg === 'dark' ? '#0F172A' : '#fff', color: bg === 'dark' ? '#fff' : 'inherit', border: '1px solid #E2E8F0' }}>
          <Typography variant="textM" color="inherit" sx={{ mb: 1 }}>{bg} stage</Typography>
          <Stack direction="row" useFlexGap sx={{ gap: 4, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <ScrollBar background={bg} sx={{ width: 220, height: 120, fontSize: 12 }}>
              {lines.map((l) => <div key={l}>{l}</div>)}
            </ScrollBar>
            <ScrollBar direction="horizontal" background={bg} sx={{ width: 220, whiteSpace: 'nowrap', fontSize: 12 }}>
              <Box sx={{ width: 700, py: 1 }}>{lines.slice(0, 6).join(' / ')}</Box>
            </ScrollBar>
            <Stack direction="row" sx={{ gap: 3 }}>
              <Thumb color={scrollBarColors[bg].thumb} label="default" />
              <Thumb color={scrollBarColors[bg].hover} label="hover" />
              <Thumb color={scrollBarColors[bg].pressed} label="pressed" />
            </Stack>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
