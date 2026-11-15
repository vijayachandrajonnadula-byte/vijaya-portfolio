import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TransferList } from './TransferList';

const items = Array.from({ length: 10 }, (_, i) => ({
  id: `u${i}`,
  label: ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Linus Torvalds', 'Margaret Hamilton', 'Dennis Ritchie', 'Barbara Liskov', 'Ken Thompson', 'Radia Perlman'][i]!,
  description: `user${i}@example.com`,
  disabled: i === 9,
}));

export default function TransferListDemo() {
  const [a, setA] = useState(['u1']);
  const [b, setB] = useState(['u2']);
  const [c, setC] = useState(['u3']);
  return (
    <Stack spacing={4}>
      {([['footer', a, setA], ['toaster', b, setB], ['dragDrop', c, setC]] as const).map(([v, val, set]) => (
        <Stack key={v} spacing={1}>
          <Typography variant="textM" color="text.secondary">{v === 'dragDrop' ? 'dragDrop: drag rows (or tick and drag) between the lists' : `${v} style`}</Typography>
          <TransferList variant={v} items={items} value={val} onChange={set} panelWidth={340} height={340} />
        </Stack>
      ))}
    </Stack>
  );
}
