import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TaskSwitcher } from './TaskSwitcher';
import type { TaskSwitcherSize, TaskSwitcherValue } from './TaskSwitcher';

/** TaskSwitcher: 3 sizes, each option selected, plus disabled. Hover/focus are live (Tab). */
export default function TaskSwitcherDemo() {
  const [v, setV] = useState<TaskSwitcherValue>('my');
  return (
    <Stack spacing={2}>
      {(['small', 'medium', 'large'] as TaskSwitcherSize[]).map((s) => (
        <Stack key={s} direction="row" spacing={3} sx={{ alignItems: 'center' }}>
          <Typography variant="textS" sx={{ width: 70 }}>{s}</Typography>
          <TaskSwitcher size={s} value={v} onChange={setV} />
          <TaskSwitcher size={s} value="my" onChange={() => {}} />
          <TaskSwitcher size={s} value="all" onChange={() => {}} />
          <TaskSwitcher size={s} value="all" onChange={() => {}} disabled />
        </Stack>
      ))}
    </Stack>
  );
}
