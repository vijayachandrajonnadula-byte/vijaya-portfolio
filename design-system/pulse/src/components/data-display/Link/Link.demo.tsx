import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RhombusIcon } from '../../../icons';
import { Link } from './Link';

/** Link: light and dark backgrounds; Default, Hover (hover it), Visited, Focus (tab to it). */
export default function LinkDemo() {
  return (
    <Stack spacing={2}>
      {(['light', 'dark'] as const).map((bg) => (
        <Box key={bg} sx={{ p: 2, borderRadius: 1, bgcolor: bg === 'dark' ? '#0f172a' : '#fff', border: '1px solid #e2e8f0' }}>
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
            <Typography variant="textS" sx={{ color: bg === 'dark' ? '#fff' : undefined, width: 40 }}>{bg}</Typography>
            <Link background={bg} href="#default" startIcon={<RhombusIcon />} endIcon={<RhombusIcon />} data-spec={`link ${bg}`}>Hyperlink</Link>
            <Link background={bg} href="#plain">No icons</Link>
            <Link background={bg} href="#focus" autoFocus={false}>Tab to focus</Link>
            <Link background={bg} href="https://example.com/visited-demo" target="_blank" rel="noreferrer">Visited / external</Link>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
