import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import InboxOutlined from '@mui/icons-material/InboxOutlined';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import { NavigationRail } from './NavigationRail';
import type { NavigationRailProps } from './NavigationRail';

const items = [
  { id: 'home', label: 'Home', icon: <HomeOutlined /> },
  { id: 'inbox', label: 'Inbox', icon: <InboxOutlined />, badge: true },
  { id: 'reports', label: 'Reports', icon: <BarChartOutlined /> },
  { id: 'settings', label: 'Settings', icon: <SettingsOutlined />, disabled: true },
];

function Rail(props: Omit<NavigationRailProps, 'items' | 'selectedId' | 'onChange'>) {
  const [sel, setSel] = useState('home');
  return <NavigationRail items={items} selectedId={sel} onChange={(i) => setSel(i.id)} {...props} />;
}

/** NavigationRail: docked (label on/off, left/right) and floating. */
export default function NavigationRailDemo() {
  const cases: { label: string; props: Omit<NavigationRailProps, 'items'> }[] = [
    { label: 'Docked, left, labels', props: {} },
    { label: 'Docked, left, no labels', props: { showLabels: false } },
    { label: 'Docked, right', props: { position: 'right' } },
    { label: 'Floating, left', props: { variant: 'floating' } },
    { label: 'Floating, right', props: { variant: 'floating', position: 'right' } },
  ];
  return (
    <Stack direction="row" spacing={4} useFlexGap sx={{ flexWrap: 'wrap' }}>
      {cases.map((c) => (
        <Stack key={c.label} spacing={1}>
          <Typography variant="textS" color="text.secondary">{c.label}</Typography>
          <Box sx={{ height: 360, display: 'flex' }}><Rail {...c.props} /></Box>
        </Stack>
      ))}
    </Stack>
  );
}
