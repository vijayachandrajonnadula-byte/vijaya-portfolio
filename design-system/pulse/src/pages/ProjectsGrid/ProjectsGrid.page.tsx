import { useState } from 'react';
import { Box, Grid, Stack, Typography } from '../../components/mui';
import { WorkspaceCard } from '../../components/patterns/WorkspaceCard/WorkspaceCard';
import type { WorkspaceCardColor } from '../../components/patterns/WorkspaceCard/WorkspaceCard';
import { Status } from '../../components/data-display/Status/Status';
import type { ChipColor } from '../../components/data-display/Chip/Chip';
import { Avatar, AvatarGroup } from '../../components/data-display/Avatar/Avatar';
import { ToggleButtonGroup } from '../../components/form/ToggleButtonGroup/ToggleButtonGroup';
import { Layout01Icon, ListViewIcon } from '../../icons';
import { ListHeaderPanel, PageBodyContentPanel, TabStatusFilterPanel } from '../../templates';
import { Frame } from '../_shared/frame';

/** "Projects, card view": a workspace card for each record, with the same header as the list view. Generic sample data. */
interface P { code: string; name: string; status: string; type: string; flow: string }
const projects: P[] = [
  { code: 'PRJ-2026-0001.001', name: 'Validation of the warehouse system', status: 'Approved', type: 'Standard', flow: 'NA' },
  { code: 'PRJ-2025-0003.01', name: 'Validation of the plant historian', status: 'In progress', type: 'Service', flow: 'NA' },
  { code: 'PRJ-2026-0007.001', name: 'Validation of the records system', status: 'Approved', type: 'Standard', flow: 'NA' },
  { code: 'PRJ-2026-0013.001', name: 'Validation of the supply chain suite', status: 'Draft', type: 'Standard', flow: 'NA' },
  { code: 'PRJ-2026-0001.002', name: 'Validation of the warehouse system, phase 2', status: 'Approved', type: 'Standard', flow: 'NA' },
  { code: 'PRJ-2026-0015.001', name: 'Validation of the maintenance system', status: 'Reviewed', type: 'Service', flow: 'NA' },
  { code: 'PRJ-2026-0016.001', name: 'Validation of the safety system', status: 'Rejected', type: 'Service', flow: 'NA' },
  { code: 'PRJ-2026-0013.002', name: 'Validation of the supply chain suite, phase 2', status: 'Withdrawn', type: 'Standard', flow: 'NA' },
  { code: 'PRJ-2026-0045.001', name: 'Validation of the quality system', status: 'Inactive', type: 'Standard', flow: 'NA' },
  { code: 'PRJ-2026-0015.002', name: 'Validation of the maintenance system, phase 2', status: 'Reviewed', type: 'Service', flow: 'NA' },
  { code: 'PRJ-2026-0016.002', name: 'Validation of the safety system, phase 2', status: 'Rejected', type: 'Service', flow: 'NA' },
  { code: 'PRJ-2026-0013.003', name: 'Validation of the supply chain suite, phase 3', status: 'Withdrawn', type: 'Standard', flow: 'NA' },
];
const tone: Record<string, ChipColor> = { Approved: 'green', 'In progress': 'blue', Draft: 'orange', Reviewed: 'cyan', Rejected: 'red', Withdrawn: 'red', Inactive: 'gray' };
const stripe: Record<string, WorkspaceCardColor> = { Approved: 'green', 'In progress': 'blue', Draft: 'orange', Reviewed: 'cyan', Rejected: 'red', Withdrawn: 'red', Inactive: 'darkGray' };

export default function ProjectsGridPage() {
  const [view, setView] = useState<string | null>('grid');
  const [tab, setTab] = useState(0);
  return (
    <Frame active="validation">
      <ListHeaderPanel
        title="Projects"
        metaData="Create and manage validation projects across your solutions and entities."
        actionsStartSlot={
          <ToggleButtonGroup size="small" exclusive ariaLabel="View" value={view} onChange={(_, v) => setView(v ?? view)} buttonList={[
            { value: 'grid', label: <Layout01Icon size={16} />, contentType: 'icon', ariaLabel: 'Card view' },
            { value: 'list', label: <ListViewIcon size={16} />, contentType: 'icon', ariaLabel: 'List view' },
          ]} />
        }
        gridActions={['filter', 'columns', 'density']}
        primaryAction={{ label: 'Create', dropdownOptions: [{ label: 'New project', value: 'new' }, { label: 'From template', value: 'template' }] }}
        divider={false}
      />
      <TabStatusFilterPanel tabs={[{ label: 'Create (19)' }, { label: 'Review (12)' }, { label: 'Approve (12)' }]} activeTab={tab} onTabChange={setTab} divider />
      <PageBodyContentPanel>
        <Stack spacing={1.5}>
          <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
            <AvatarGroup max={4}>
              {['VL', 'QA', 'PE', 'LA', 'SM', 'RA'].map((i) => <Avatar key={i} size="small">{i}</Avatar>)}
            </AvatarGroup>
          </Stack>
          <Grid container spacing={1.5}>
            {projects.map((p) => (
              <Grid key={p.code} size={{ xs: 12, sm: 6, lg: 3 }}>
                <WorkspaceCard color={stripe[p.status] ?? 'gray'} width="100%" hover>
                  <Box sx={{ p: 2 }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                      <Typography variant="heading6">{p.name}</Typography>
                      <Status type="chip" label={p.status} color={tone[p.status] ?? 'gray'} />
                    </Stack>
                    <Typography variant="textM" sx={{ display: 'block', mt: 0.5 }}>{p.code}</Typography>
                    <Stack spacing={1} sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #e2e8f0' }}>
                      {[['#', 'NA'], ['Project type', p.type], ['Workflow type', p.flow]].map(([k, v]) => (
                        <Stack key={k} direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="textM">{k}</Typography><Typography variant="textL">{v}</Typography></Stack>
                      ))}
                    </Stack>
                  </Box>
                </WorkspaceCard>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </PageBodyContentPanel>
    </Frame>
  );
}
