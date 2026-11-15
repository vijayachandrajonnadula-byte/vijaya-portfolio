import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '../../actions/Button/Button';
import { Modal, ModalPanel } from './Modal';
import type { ModalPanelProps } from './Modal';

const slot = (
  <Box sx={{ height: '100%', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #6d28d9', background: '#fcfaff', borderRadius: '8px', fontSize: 12, boxSizing: 'border-box' }}>
    Slot content
  </Box>
);
const noop = () => {};
const footerProps: ModalPanelProps['footerProps'] = { secondaryAction: { label: 'Secondary' }, primaryAction: { label: 'Primary' } };

function Frame({ label, width, height, children }: { label: string; width: number | string; height?: number; children: ReactNode }) {
  return (
    <Box>
      <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>{label}</Typography>
      <Box sx={{ width: typeof width === 'number' ? width + 48 : width, height, display: 'flex', background: 'rgba(0,0,0,0.5)', p: 3, boxSizing: 'border-box' }}>{children}</Box>
    </Box>
  );
}

export default function ModalDemo() {
  const [open, setOpen] = useState<ModalPanelProps['variant'] | null>(null);
  const close = () => setOpen(null);
  return (
    <Stack spacing={3}>
      <Typography variant="textM" color="text.secondary">Figma set Modal, Type = Default / Alert / Max Size / Full Page (shown inline on a 50% backdrop; Max Size and Full Page are scaled-down frames)</Typography>
      <Stack direction="row" useFlexGap spacing={2} sx={{ flexWrap: 'wrap' }}>
        <Frame label="Type=Default (480 x 304)" width={480}>
          <ModalPanel onClose={noop} headerProps={{ title: 'Modal title', metadata: 'Supporting description' }} footerProps={footerProps}>{slot}</ModalPanel>
        </Frame>
        <Frame label="Type=Default with helper text" width={480}>
          <ModalPanel onClose={noop} headerProps={{ title: 'Modal title' }} footerProps={{ ...footerProps, helperText: 'Helper text' }}>{slot}</ModalPanel>
        </Frame>
        <Frame label="Type=Alert (480 x 332)" width={480}>
          <ModalPanel onClose={noop} variant="alert" headerProps={{ title: 'Delete this record?' }} footerProps={footerProps}>{slot}</ModalPanel>
        </Frame>
      </Stack>
      <Frame label="Type=Max Size (95% of the viewport, max 1368 x 972; scaled here)" width="100%" height={420}>
        <ModalPanel onClose={noop} variant="maxSize" headerProps={{ title: 'Modal title', metadata: 'Supporting description' }} footerProps={footerProps}>{slot}</ModalPanel>
      </Frame>
      <Frame label="Type=Full Page (edge to edge; scaled here)" width="100%" height={420}>
        <ModalPanel onClose={noop} variant="fullPage" headerProps={{ title: 'Modal title' }} footerProps={footerProps}>{slot}</ModalPanel>
      </Frame>
      <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {(['popup', 'alert', 'maxSize', 'fullPage'] as const).map((v) => (
          <Button key={v} size="small" variant="outlined" onClick={() => setOpen(v)}>{`Open ${v} as Dialog`}</Button>
        ))}
      </Stack>
      <Modal open={open != null} onClose={close} variant={open ?? 'popup'} headerProps={{ title: open === 'alert' ? 'Delete this record?' : 'Modal title', metadata: open === 'alert' ? undefined : 'Supporting description' }} footerProps={{ secondaryAction: { label: 'Cancel', onClick: close }, primaryAction: { label: 'Confirm', onClick: close } }}>
        {slot}
      </Modal>
    </Stack>
  );
}
