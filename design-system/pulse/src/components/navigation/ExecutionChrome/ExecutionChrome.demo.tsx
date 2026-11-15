import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AiMagicIcon, ArrowDown01Icon, DashboardSquare02Icon, ListViewIcon, SquareArrowUpRightIcon } from '../../../icons';
import { BarGroup, ChromeButton, ChromeIconButton, ChromeToast, PillTabs, SegmentedToggle } from './ExecutionChrome';

/** ExecutionChrome (NOT FROM FIGMA): segmented toggle, bar buttons, icon buttons, pill tabs, bar group and banner toast. */
export default function ExecutionChromeDemo() {
  const [layout, setLayout] = useState<'panel' | 'inline'>('panel');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [tab, setTab] = useState('all');
  return (
    <Stack spacing={3} sx={{ maxWidth: 720 }}>
      <Stack spacing={1}>
        <Typography variant="textS" color="text.secondary">SegmentedToggle (text and icon)</Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <SegmentedToggle ariaLabel="Layout" value={layout} onChange={setLayout} options={[{ value: 'panel', label: 'Panel' }, { value: 'inline', label: 'Inline' }]} />
          <SegmentedToggle ariaLabel="View" kind="icon" value={view} onChange={setView} options={[{ value: 'list', icon: <ListViewIcon size={16} />, ariaLabel: 'List view' }, { value: 'grid', icon: <DashboardSquare02Icon size={16} />, ariaLabel: 'Grid view' }]} />
        </Stack>
      </Stack>
      <Stack spacing={1}>
        <Typography variant="textS" color="text.secondary">ChromeButton (outline, navy, field) and ChromeIconButton</Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <ChromeButton>Actions</ChromeButton>
          <ChromeButton tone="navy">Go</ChromeButton>
          <ChromeButton tone="field" weight="medium" endIcon={<ArrowDown01Icon size={16} />} sx={{ width: 180, justifyContent: 'space-between' }}>Speed Verification</ChromeButton>
          <ChromeIconButton ariaLabel="AI assistant"><AiMagicIcon size={16} /></ChromeIconButton>
          <ChromeIconButton ariaLabel="Open in new window"><SquareArrowUpRightIcon size={16} /></ChromeIconButton>
        </Stack>
      </Stack>
      <Stack spacing={1}>
        <Typography variant="textS" color="text.secondary">PillTabs</Typography>
        <PillTabs ariaLabel="Kind" value={tab} onChange={setTab} tabs={[{ value: 'all', label: 'All' }, { value: 'ai', label: 'AI Captured' }, { value: 'shot', label: 'Screenshots' }]} />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="textS" color="text.secondary">BarGroup</Typography>
        <Box sx={{ p: '8px', background: '#f6f8fc' }}><BarGroup sx={{ px: '12px' }}>Execution Status</BarGroup></Box>
      </Stack>
      <Stack spacing={1}>
        <Typography variant="textS" color="text.secondary">ChromeToast (success, error, warn, info)</Typography>
        <ChromeToast>Executor is now viewing this execution</ChromeToast>
        <ChromeToast kind="error">Could not record the step.</ChromeToast>
        <ChromeToast kind="warn">Select a step first.</ChromeToast>
        <ChromeToast kind="info">Saved as a draft.</ChromeToast>
      </Stack>
    </Stack>
  );
}
