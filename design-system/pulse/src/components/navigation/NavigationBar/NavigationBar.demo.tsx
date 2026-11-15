import { useState } from 'react';
import Stack from '@mui/material/Stack';
import DiamondOutlined from '@mui/icons-material/DiamondOutlined';
import { Button } from '../../actions/Button/Button';
import { NavigationBar } from './NavigationBar';

const items = [{ label: 'Overview' }, { label: 'Activity', badgeContent: 3 }, { label: 'Reports', startIcon: <DiamondOutlined /> }, { label: 'Disabled', disabled: true }];

/** NavigationBar: tabs only, tabs + slot, narrow (scrollable). */
export default function NavigationBarDemo() {
  const [v, setV] = useState(0);
  return (
    <Stack spacing={3}>
      <NavigationBar items={items} value={v} onChange={(_, n) => setV(n)} />
      <NavigationBar items={items} value={v} onChange={(_, n) => setV(n)} slot={<><Button variant="outlined" size="small">Export</Button><Button size="small">Create</Button></>} />
      <div style={{ width: 280 }}><NavigationBar items={items} value={v} onChange={(_, n) => setV(n)} /></div>
    </Stack>
  );
}
