import { useState } from 'react';
import { Button } from '../../actions/Button/Button';
import { FullScreenSurface } from './FullScreenSurface';

export default function FullScreenSurfaceDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" size="small" onClick={() => setOpen(true)}>Open full-screen surface</Button>
      <FullScreenSurface open={open} onClose={() => setOpen(false)} label="Sample surface">
        <div style={{ padding: 24 }}>
          <Button variant="outlined" size="small" onClick={() => setOpen(false)}>Close</Button>
        </div>
      </FullScreenSurface>
    </>
  );
}
