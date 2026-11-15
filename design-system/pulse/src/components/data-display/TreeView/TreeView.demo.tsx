import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TreeView } from './TreeView';
import type { TreeViewItem } from './TreeView';

const items: TreeViewItem[] = [
  {
    id: 'a',
    label: 'Quality',
    metadata: '3 modules',
    children: [
      { id: 'a1', label: 'Deviation', metadata: 'Open items', children: [{ id: 'a1a', label: 'Root cause' }, { id: 'a1b', label: 'CAPA', children: [{ id: 'a1b1', label: 'Action plan' }] }] },
      { id: 'a2', label: 'Change control' },
      { id: 'a3', label: 'Audit (disabled)', disabled: true },
    ],
  },
  { id: 'b', label: 'Validation', children: [{ id: 'b1', label: 'Protocols' }, { id: 'b2', label: 'Reports' }] },
  { id: 'c', label: 'Archive' },
];

/** TreeView: single select, checkbox multi-select, metadata rows, disabled item, nested tiers with dotted guides. */
export default function TreeViewDemo() {
  const [one, setOne] = useState<string[]>(['a2']);
  const [many, setMany] = useState<string[]>(['a1a']);
  return (
    <Stack direction="row" spacing={6} useFlexGap sx={{ flexWrap: 'wrap' }}>
      <Stack spacing={1}>
        <Typography variant="textM" color="text.secondary">Single select</Typography>
        <TreeView items={items} selectedItems={one} handleSelection={setOne} defaultExpandedItems={['a', 'a1']} />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="textM" color="text.secondary">Checkbox ({many.length} selected)</Typography>
        <TreeView items={items} checkBox selectedItems={many} handleSelection={setMany} defaultExpandedItems={['a', 'a1', 'b']} />
      </Stack>
    </Stack>
  );
}
