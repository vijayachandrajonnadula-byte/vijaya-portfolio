import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { StatusFilterBar } from './StatusFilterBar';
import type { StatusFilterItem, StatusFilterSize } from './StatusFilterBar';

const items: StatusFilterItem[] = [
  { status: 'Approved', count: 12, color: 'green' },
  { status: 'Pending', count: 8, color: 'orange' },
  { status: 'In review', count: 5, color: 'blue' },
  { status: 'Draft', count: 3, color: 'dark_gray' },
  { status: 'Rejected', count: 2, color: 'red' },
  { status: 'On hold', count: 1, color: 'purple' },
  { status: 'Info', count: 4, color: 'cyan' },
  { status: 'Ready', count: 6, color: 'teal' },
  { status: 'Warning', count: 7, color: 'yellow' },
  { status: 'Archived', count: 9, color: 'gray' },
];

/** StatusFilterBar (Figma statusFilterv2): 3 sizes, Total / colour pills, Default and Selected (Tab for Focus). */
export default function StatusFilterBarDemo() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <Stack spacing={3}>
      {(['small', 'medium', 'large'] as StatusFilterSize[]).map((s) => (
        <Stack key={s} spacing={1}>
          <Typography variant="textS">{s}</Typography>
          <StatusFilterBar size={s} items={items.slice(0, 6)} activeStatus={active} onStatusChange={setActive} />
        </Stack>
      ))}
      <Stack spacing={1}>
        <Typography variant="textS">All ten colours (selected: Info)</Typography>
        <StatusFilterBar items={items} activeStatus="Info" onStatusChange={() => {}} />
      </Stack>
    </Stack>
  );
}
