import { useState } from 'react';
import { Button } from '../../actions/Button/Button';
import { CompactDialog } from './CompactDialog';

export default function CompactDialogDemo() {
  const [open, setOpen] = useState<'plain' | 'icon' | null>(null);
  const close = () => setOpen(null);
  return (
    <>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outlined" size="small" onClick={() => setOpen('plain')}>Text header</Button>
        <Button variant="outlined" size="small" onClick={() => setOpen('icon')}>Icon header</Button>
      </div>
      <CompactDialog open={open === 'plain'} onClose={close} title="Step marked as failed" subtitle="Raise a discrepancy for this step?" showClose={false} secondaryAction={{ label: 'Cancel', onClick: close }} primaryAction={{ label: 'Create discrepancy', color: 'error', onClick: close }}>
        Failing without a discrepancy must be justified.
      </CompactDialog>
      <CompactDialog open={open === 'icon'} onClose={close} icon="!" title="Unsaved changes" subtitle="You have not recorded or saved this step" secondaryAction={{ label: 'Stay on this step', onClick: close }} primaryAction={{ label: 'Discard and continue', onClick: close }}>
        Leaving this step will lose what you entered.
      </CompactDialog>
    </>
  );
}
