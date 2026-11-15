import { useState } from 'react';
import { Button } from '../../actions/Button/Button';
import { SlidePanel } from './SlidePanel';

export default function SlidePanelDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" size="small" onClick={() => setOpen(true)}>Open slide panel</Button>
      <SlidePanel open={open} onClose={() => setOpen(false)} title="Sample.jpg">
        Panel content.
      </SlidePanel>
    </>
  );
}
