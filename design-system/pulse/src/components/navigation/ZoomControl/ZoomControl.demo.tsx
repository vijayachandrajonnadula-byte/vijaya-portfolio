import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ZoomControl } from './ZoomControl';

/** ZoomControl: default, expanded (preset dropdown), compact (toolbar), disabled. */
export default function ZoomControlDemo() {
  const [a, setA] = useState(100);
  const [b, setB] = useState(100);
  const [c, setC] = useState(75);
  return (
    <Stack direction="row" spacing={6} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'flex-start', minHeight: 420 }}>
      <Stack spacing={1}><Typography variant="textS" color="text.secondary">Default</Typography><ZoomControl value={a} onChange={setA} onFit={() => setA(100)} /></Stack>
      <Stack spacing={1}><Typography variant="textS" color="text.secondary">Expanded</Typography><ZoomControl value={b} onChange={setB} defaultOpen onFit={() => setB(100)} /></Stack>
      <Stack spacing={1}><Typography variant="textS" color="text.secondary">Compact (toolbar)</Typography><Box sx={{ p: '4px', background: '#fff', borderRadius: '8px' }}><ZoomControl value={c} onChange={setC} compact /></Box></Stack>
      <Stack spacing={1}><Typography variant="textS" color="text.secondary">Disabled</Typography><ZoomControl value={100} onChange={() => undefined} disabled /></Stack>
    </Stack>
  );
}


