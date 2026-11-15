import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '../../actions/Button/Button';
import { Chip } from '../../data-display/Chip/Chip';
import { NavigationRail } from '../../navigation/NavigationRail/NavigationRail';
import { Flyout, FlyoutPanel } from './Flyout';
import type { FlyoutPanelProps } from './Flyout';

const slot = (
  <Box sx={{ height: '100%', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #6d28d9', background: '#fcfaff', borderRadius: '8px', fontSize: 12 }}>
    Slot content
  </Box>
);

const noop = () => {};
const footer = (
  <>
    <Button size="small" variant="outlined">Cancel</Button>
    <Button size="small">Save</Button>
  </>
);
const base: FlyoutPanelProps = { onClose: noop, headerProps: { title: 'Flyout title' }, footer };

const two = 'Two lines of metadata. Two lines of metadata. Two lines of metadata. Two lines of metadata. Two lines of metadata. Two lines.';

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>{label}</Typography>
      <Box sx={{ width: 480, height: 420, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15,23,42,.12)' }}>{children}</Box>
    </Box>
  );
}

export default function FlyoutDemo() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [rail, setRail] = useState('a');
  return (
    <Stack spacing={3}>
      <Typography variant="textM" color="text.secondary">Figma set Flyout, Metadata = False / Single Line / Two Lines (shown inline; 480px wide, header 48 / 64 / 84)</Typography>
      <Stack direction="row" useFlexGap spacing={2} sx={{ flexWrap: 'wrap' }}>
        <Frame label="Metadata=False"><FlyoutPanel {...base}>{slot}</FlyoutPanel></Frame>
        <Frame label="Metadata=Single Line"><FlyoutPanel {...base} headerProps={{ title: 'Flyout title', metadata: 'One line of metadata' }}>{slot}</FlyoutPanel></Frame>
        <Frame label="Metadata=Two Lines"><FlyoutPanel {...base} headerProps={{ title: 'Flyout title', metadata: two }}>{slot}</FlyoutPanel></Frame>
        <Frame label="Chip next to the title, back arrow, tabs, left footer">
          <FlyoutPanel {...base} headerProps={{ title: 'Flyout title', onBack: noop, titleAdornment: <Chip label="Draft" color="green" size="xsmall" /> }} tabs={[{ label: 'Details' }, { label: 'History' }, { label: 'Disabled', disabled: true }]} activeTab={tab} handleChangeTab={setTab} footerLeft={<Button size="small" variant="outlined">Reset</Button>}>{slot}</FlyoutPanel>
        </Frame>
        <Frame label="With docked right NavigationRail">
          <FlyoutPanel {...base} rail={<NavigationRail variant="docked" position="right" showLabels={false} selectedId={rail} onChange={(i) => setRail(i.id)} items={[{ id: 'a', label: 'Info', icon: <span>i</span> }, { id: 'b', label: 'Files', icon: <span>f</span> }]} />}>{slot}</FlyoutPanel>
        </Frame>
      </Stack>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Button size="small" variant="outlined" onClick={() => setOpen(true)}>Open as overlay (Drawer)</Button>
        <Typography variant="textM" color="text.secondary">Flyout = FlyoutPanel inside a MUI Drawer, backdrop 50% (or 30%)</Typography>
      </Stack>
      <Flyout open={open} onClose={() => setOpen(false)} headerProps={{ title: 'Flyout title', metadata: 'One line of metadata' }} footer={footer}>{slot}</Flyout>
    </Stack>
  );
}