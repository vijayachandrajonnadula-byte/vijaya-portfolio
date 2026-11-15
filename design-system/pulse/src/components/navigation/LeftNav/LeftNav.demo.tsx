import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import HubOutlined from '@mui/icons-material/HubOutlined';
import TuneRounded from '@mui/icons-material/TuneRounded';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import BusinessOutlined from '@mui/icons-material/BusinessOutlined';
import { LeftNav, LeftNavExpandCollapse, LeftNavMoreButton, LeftNavSearch, LeftNavSuiteBlock, LeftNavSuitePanel } from './LeftNav';
import type { LeftNavMenu, LeftNavSuite } from './LeftNav';

const suites: LeftNavSuite[] = [
  { id: 'quality', name: 'Quality review', description: 'Annual product quality review', chip: 'Beta' },
  { id: 'cpv', name: 'CPV', description: 'Continued process verification' },
  { id: 'csa', name: 'CSA', description: 'Computer software assurance' },
];

const menus: LeftNavMenu[] = [
  { id: 'home', name: 'Home', icon: <HomeOutlined />, link: '/' },
  { id: 'inventory', name: 'Inventory', icon: <HubOutlined />, notification: 2 },
  { id: 'config', name: 'Configuration', icon: <TuneRounded /> },
  { id: 'asset', name: 'Asset', icon: <Inventory2Outlined /> },
  {
    id: 'admin',
    name: 'Admin',
    icon: <AdminPanelSettingsOutlined />,
    children: [
      { id: 'role', name: 'Role', icon: <AdminPanelSettingsOutlined /> },
      { id: 'dept', name: 'Department', icon: <BusinessOutlined /> },
      {
        id: 'ws',
        name: 'Workspaces',
        icon: <DashboardOutlined />,
        children: [{ id: 'ws1', name: 'Quality review workspace' }, { id: 'ws2', name: 'Verification workspace' }, { id: 'ws3', name: 'Archive' }],
      },
    ],
  },
];

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack spacing={1}>
      <Typography variant="textM" color="text.secondary">{label}</Typography>
      <Box sx={{ height: 440, display: 'flex', border: '1px solid #e2e8f0', background: '#f1f1f2' }}>{children}</Box>
    </Stack>
  );
}

function Stateful({ initialOpen, withSearch, withSuites }: { initialOpen: boolean; withSearch?: boolean; withSuites?: boolean }) {
  const [suite, setSuite] = useState('quality');
  const [sel, setSel] = useState('admin');
  const [second, setSecond] = useState('role');
  const [open, setOpen] = useState(initialOpen);
  const [q, setQ] = useState('');
  return (
    <LeftNav
      menus={menus}
      selectedMenu={sel}
      selectedSecondMenu={second}
      handleSubMenu={(i) => { setSel(i.firstLevelMenu); setSecond(i.secondLevelMenu); }}
      onMenuClick={(m) => { setSel(m.id); setSecond(''); }}
      open={open}
      onOpen={() => setOpen((o) => !o)}
      onMoreClick={() => undefined}
      {...(withSuites ? { suites, selectedSuite: suite, onSuiteChange: (s: LeftNavSuite) => setSuite(s.id), suitePanelTitle: 'Switch suite' } : {})}
      {...(withSearch ? { searchValue: q, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value), onClear: () => setQ('') } : {})}
    />
  );
}

function Row({ label, children, dark }: { label: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <Stack spacing={1}>
      <Typography variant="textM" color="text.secondary">{label}</Typography>
      <Stack direction="row" spacing={3} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center', p: 2, background: dark ? '#19325e' : 'transparent', border: dark ? 'none' : '1px solid #e2e8f0' }}>{children}</Stack>
    </Stack>
  );
}

/** LeftNav: rail, secondary menu, suite switcher, search, plus every building block. Hover states are live (hover the controls). */
export default function LeftNavDemo() {
  return (
    <Stack spacing={4}>
      <Stack direction="row" spacing={4} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Frame label="Collapsed (rail only)"><Stateful initialOpen={false} /></Frame>
        <Frame label="Expanded, secondary menu"><Stateful initialOpen /></Frame>
        <Frame label="Search (click the rail search) + suite switcher (hover/click the logo) + more"><Stateful initialOpen withSearch withSuites /></Frame>
      </Stack>
      <Row label="ExpandCollapse: Left / Right (Default; Focus via keyboard)">
        <LeftNavExpandCollapse variant="left" />
        <LeftNavExpandCollapse variant="right" />
      </Row>
      <Row label=".Building Blocks/Search: Collapsed / Expand (hover for the lighter state)" dark>
        <LeftNavSearch variant="collapsed" />
        <LeftNavSearch variant="expand" />
        <LeftNavSearch variant="expand" value="Role" />
      </Row>
      <Row label=".Building Blocks/leftNav-moreBtn: Default / Disabled (hover for Hover)" dark>
        <LeftNavMoreButton />
        <LeftNavMoreButton disabled />
      </Row>
      <Row label=".buildingBlock/SuiteBlock: Default / Active (hover for Hover)">
        <Box sx={{ width: 269 }}><LeftNavSuiteBlock name="Quality review" description="Annual product quality review" chip="Beta" /></Box>
        <Box sx={{ width: 269 }}><LeftNavSuiteBlock name="Quality review" description="Annual product quality review" chip="Beta" active /></Box>
      </Row>
      <Row label="Suite Panel">
        <LeftNavSuitePanel title="Switch suite" suites={suites} selectedSuite="quality" />
      </Row>
    </Stack>
  );
}
