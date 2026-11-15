import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { InformationCircleIcon, Task01Icon, Copy01Icon, Attachment01Icon, Route01Icon } from '../../../icons';
import { ActionList } from './ActionList';
import type { ActionListGroup } from './ActionList';

const groups: ActionListGroup[] = [
  {
    label: 'View',
    items: [
      { value: 'details', label: 'Details', icon: <InformationCircleIcon size={20} /> },
      { value: 'status', label: 'Execution Status', icon: <Task01Icon size={20} /> },
      { value: 'mapping', label: 'Verify Mapping', icon: <Route01Icon size={20} />, disabled: true, reason: 'Not in this sample' },
    ],
  },
  {
    label: 'Execute',
    items: [
      { value: 'attach', label: 'Add Attachments', icon: <Attachment01Icon size={20} /> },
      { value: 'copy', label: 'Copy Result', icon: <Copy01Icon size={20} /> },
    ],
  },
];

/** ActionList: grouped rows (icon + label), a disabled row with its reason, arrow-key navigation. */
export default function ActionListDemo() {
  const [last, setLast] = useState('none');
  return (
    <Box sx={{ width: 360 }}>
      <Typography variant="textS" color="text.secondary" component="div" sx={{ mb: 1 }}>Chosen: {last}</Typography>
      <ActionList groups={groups} onSelect={(i) => setLast(i.label)} />
    </Box>
  );
}
