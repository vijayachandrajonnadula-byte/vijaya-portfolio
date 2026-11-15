import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '../../actions/Button/Button';
import { Backdrop } from './Backdrop';

/** Backdrop: 30% and 50% scrims (contained previews), and a live full-screen one. */
export default function BackdropDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={3}>
        {([30, 50] as const).map((o) => (
          <Box key={o} sx={{ position: 'relative', width: 360, height: 200, borderRadius: 1, overflow: 'hidden', border: '1px solid #e2e8f0', p: 2 }}>
            <Typography variant="textM">Page content behind the scrim</Typography>
            <Backdrop open opacity={o} sx={{ position: 'absolute', zIndex: 1 }} data-spec={`backdrop ${o}`}>
              <Typography variant="textM" sx={{ color: '#fff' }}>{o}%</Typography>
            </Backdrop>
          </Box>
        ))}
      </Stack>
      <Box><Button variant="outlined" onClick={() => setOpen(true)}>Show full-screen backdrop</Button></Box>
      <Backdrop open={open} opacity={50} onClick={() => setOpen(false)} sx={{ zIndex: 1300 }}>
        <Typography variant="textL" sx={{ color: '#fff' }}>Click to dismiss</Typography>
      </Backdrop>
    </Stack>
  );
}
