import { useState } from 'react';
import Stack from '@mui/material/Stack';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import { SideNav } from './SideNav';

/** SideNav: section titles, default items, accordion header + menus, active and hover states. */
export default function SideNavDemo() {
  const [sel, setSel] = useState('users');
  return (
    <Stack direction="row" spacing={4}>
      <SideNav
        selectedId={sel}
        onSelect={(i) => setSel(i.id)}
        sections={[
          { title: 'General', items: [{ id: 'dash', label: 'Dashboard', icon: <DashboardOutlined /> }, { id: 'settings', label: 'Settings', icon: <SettingsOutlined /> }] },
          {
            title: 'Administration',
            items: [
              { id: 'access', label: 'Access', icon: <PeopleAltOutlined />, children: [{ id: 'users', label: 'Users' }, { id: 'roles', label: 'Roles' }, { id: 'groups', label: 'Groups' }] },
              { id: 'audit', label: 'Audit', children: [{ id: 'logs', label: 'Logs' }, { id: 'reports', label: 'Reports' }] },
            ],
          },
        ]}
      />
    </Stack>
  );
}

