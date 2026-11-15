import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { WorkflowDiagram, WorkflowStep } from './Workflow';
import type { WorkflowDiagramStep } from './Workflow';

const people = [{ initials: 'AK' }, { initials: 'MR' }, { initials: 'JS' }];
const details = [
  { label: 'Group ID', value: 'GRP-1024' },
  { label: 'Functional Role', value: 'Batch Reviewer' },
];

const steps: WorkflowDiagramStep[] = [
  { id: 'a', title: 'Draft', details, assignees: people, status: { label: 'Configured', color: 'blue' } },
  { id: 'b', title: 'Review', details, assignees: people.slice(0, 2), status: { label: 'In progress', color: 'orange' } },
  { id: 'c', interaction: 'zeroState' },
];

export default function WorkflowDemo() {
  const [active, setActive] = useState<string | null>('b');
  return (
    <Stack spacing={3}>
      <Typography variant="textM" color="text.secondary">Workflow Card: default, active, zero state</Typography>
      <Stack direction="row" useFlexGap sx={{ gap: 4, flexWrap: 'wrap', alignItems: 'flex-start', p: 2 }}>
        <WorkflowStep title="Draft" details={details} assignees={people} status={{ label: 'Configured', color: 'blue' }} />
        <WorkflowStep interaction="active" title="Review" details={details} assignees={people} />
        <WorkflowStep interaction="zeroState" />
      </Stack>
      <Typography variant="textM" color="text.secondary">Diagram (click a step)</Typography>
      <WorkflowDiagram steps={steps} activeId={active} onStepClick={setActive} sx={{ p: 2 }} />
      <WorkflowDiagram steps={steps.slice(0, 2)} direction="column" activeId={active} onStepClick={setActive} sx={{ p: 2 }} connectorLength={32} />
    </Stack>
  );
}
