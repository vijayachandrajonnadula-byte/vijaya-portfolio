import { useState } from 'react';
import { Button } from '../../actions/Button/Button';
import { SideSurface } from './SideSurface';

export default function SideSurfaceDemo() {
  const [open, setOpen] = useState<'modal' | 'floating' | null>(null);
  const close = () => setOpen(null);
  const header = <div style={{ padding: '14px 18px', borderBottom: '1px solid #dfe5eb', font: '700 14.5px Inter, sans-serif' }}>Panel title</div>;
  const footer = <div style={{ padding: '11px 22px', borderTop: '1px solid #dfe5eb', background: '#f4f7fb', textAlign: 'right' }}><Button size="small" variant="outlined" onClick={close}>Close</Button></div>;
  return (
    <>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outlined" size="small" onClick={() => setOpen('modal')}>Modal, 640px</Button>
        <Button variant="outlined" size="small" onClick={() => setOpen('floating')}>Floating, 320px</Button>
      </div>
      {open === 'modal' && <SideSurface ariaLabel="Modal panel" width={640} onClose={close} scrim="rgba(15,30,80,.45)" scrimBlur={2} shadow="-8px 0 32px rgba(15,30,80,.18)" header={header} footer={footer} bodyPadding="18px 22px">Body</SideSurface>}
      {open === 'floating' && <SideSurface ariaLabel="Floating panel" width={320} modal={false} onClose={close} shadow="-6px 0 28px rgba(15,30,80,.18)" header={header} footer={footer} bodyPadding="12px">Body</SideSurface>}
    </>
  );
}
