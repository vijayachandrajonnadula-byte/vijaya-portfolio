import { fw } from '../../../theme/typography';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GridViewRounded from '@mui/icons-material/GridViewRounded';
import ViewListRounded from '@mui/icons-material/ViewListRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import { Button } from '../../actions/Button/Button';
import { WorkspaceCard } from '../../patterns/WorkspaceCard/WorkspaceCard';
import {
  ContextBarPanel,
  FilterToolbarPanel,
  FooterActionsPanel,
  ListHeaderPanel,
  PageBodyContentPanel,
  SearchToolbarPanel,
  StepperHeaderPanel,
  TabStatusFilterPanel,
} from '../../../templates/panels';
import type { WorkspaceCardColor } from '../../patterns/WorkspaceCard/WorkspaceCard';

const statuses = [
  { status: 'Draft', count: 4, color: 'gray' as const },
  { status: 'In review', count: 7, color: 'orange' as const },
  { status: 'Approved', count: 12, color: 'green' as const },
  { status: 'Rejected', count: 2, color: 'red' as const },
];
const cardColor: Record<string, WorkspaceCardColor> = { Draft: 'gray', 'In review': 'orange', Approved: 'green', Rejected: 'red' };
const workspaces = Array.from({ length: 6 }, (_, i) => {
  const s = statuses[i % statuses.length]!;
  return { id: i, name: `Workspace ${i + 1}`, status: s.status };
});

/** A full page composed of the micro-template panels, each shown on its own and then stacked. */
function PageFrame({ children }: { children: React.ReactNode }) {
  return <Box sx={{ display: 'flex', flexDirection: 'column', height: 720, border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>{children}</Box>;
}

export default function TemplatesDemo() {
  const [tab, setTab] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('grid');
  const [step, setStep] = useState(1);
  const [toggle, setToggle] = useState('all');
  const shown = workspaces.filter((w) => (!status || w.status === status) && w.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Stack spacing={4}>
      <Typography variant="textM" color="text.secondary">Full page: ContextBar, ListHeader, TabStatusFilter, FilterToolbar, PageBody, FooterActions</Typography>
      <PageFrame>
        <ContextBarPanel
          breadcrumbs={[{ node: 'Home', link: '/' }, { node: 'Workspaces', link: '/workspaces' }, { node: 'All', link: '' }]}
          statusChips={[{ label: 'Draft', color: 'gray' }, { label: 'Approved', color: 'green' }]}
        />
        <ListHeaderPanel
          title="Workspaces"
          metaData="25 workspaces"
          gridActions={['filter', 'columns', 'density', 'more']}
          primaryAction={{ label: 'Create', startIcon: <AddRounded />, dropdownOptions: [{ label: 'Blank workspace', value: 'blank' }, { label: 'From template', value: 'tpl' }] }}
        />
        <TabStatusFilterPanel
          tabs={[{ label: 'All' }, { label: 'Mine' }, { label: 'Shared' }]}
          activeTab={tab}
          onTabChange={setTab}
          statusFilter={{ items: statuses, activeStatus: status, onStatusChange: setStatus }}
        />
        <FilterToolbarPanel
          search={{ value: query, onChange: setQuery, placeholder: 'Search workspaces' }}
          searchPlacement="left"
          viewToggle={{
            value: view,
            onChange: setView,
            options: [{ value: 'grid', label: <GridViewRounded fontSize="small" /> }, { value: 'list', label: <ViewListRounded fontSize="small" /> }],
          }}
        />
        <PageBodyContentPanel>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
            {shown.map((w) => (
              <WorkspaceCard key={w.id} width="100%" color={cardColor[w.status] ?? 'none'} footer={<Typography variant="textM" color="text.secondary">{w.status}</Typography>}>
                <Typography variant="textL" sx={{ fontWeight: fw.semiBold }}>{w.name}</Typography>
                <Typography variant="textM" color="text.secondary">Last edited today</Typography>
              </WorkspaceCard>
            ))}
          </Box>
        </PageBodyContentPanel>
        <FooterActionsPanel leftActions={<Button variant="outlined" size="small">Cancel</Button>} rightActions={<><Button variant="outlined" size="small">Save draft</Button><Button size="small">Publish</Button></>} />
      </PageFrame>

      <Typography variant="textM" color="text.secondary">StepperHeaderPanel</Typography>
      <Box sx={{ border: '1px solid #e2e8f0' }}>
        <StepperHeaderPanel steps={[{ label: 'Definition' }, { label: 'Data sources' }, { label: 'Review' }, { label: 'Approval' }]} activeStep={step} onStepClick={setStep} rightActions={<Button variant="text" size="small">Exit</Button>} />
      </Box>

      <Typography variant="textM" color="text.secondary">SearchToolbarPanel with collapsible left section</Typography>
      <Box sx={{ border: '1px solid #e2e8f0', height: 220, display: 'flex' }}>
        <SearchToolbarPanel
          headerSlot={<Typography variant="textL" sx={{ fontWeight: fw.semiBold, py: 1 }}>Folders</Typography>}
          body={<Typography variant="textM">Tree goes here</Typography>}
          toggle={{ value: toggle, onChange: setToggle, options: [{ value: 'all', label: 'All' }, { value: 'mine', label: 'Mine' }] }}
          search={{ value: query, onChange: setQuery, width: 240 }}
        />
      </Box>
    </Stack>
  );
}
