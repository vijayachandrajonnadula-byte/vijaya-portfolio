import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ResizeHandle } from './ResizeHandle';

const DEFAULT = 360;

/** Drag the left edge of the panel, press Left / Right Arrow when it is focused, Home / End for the limits, Enter or double click to reset. */
export default function ResizeHandleDemo() {
  const [w, setW] = useState(DEFAULT);
  return (
    <Stack spacing={2}>
      <Typography variant="textM" color="text.secondary">Width {w}px (limits 240 to 640). Drag, use the arrow keys, or double click to reset.</Typography>
      <div style={{ display: 'flex', justifyContent: 'flex-end', height: 220, background: '#f4f7fb', border: '1px solid #dfe5eb', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ position: 'relative', width: w, maxWidth: '100%', background: '#fff', borderLeft: '1px solid #dfe5eb', padding: 16, boxSizing: 'border-box' }}>
          <ResizeHandle value={w} min={240} max={640} onChange={setW} onReset={() => setW(DEFAULT)} inset label="Resize the demo panel" />
          <Typography variant="textM">A panel. The handle sits on its left edge.</Typography>
        </div>
      </div>
    </Stack>
  );
}
