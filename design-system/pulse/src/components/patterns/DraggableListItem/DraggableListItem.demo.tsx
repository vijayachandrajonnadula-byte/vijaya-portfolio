import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RhombusOutlined from '@mui/icons-material/CategoryOutlined';
import PrecisionManufacturingOutlined from '@mui/icons-material/PrecisionManufacturingOutlined';
import { DraggableList, DraggableListItem } from './DraggableListItem';
import type { DraggableListEntry } from './DraggableListItem';

const states = ['default', 'hover', 'ghost', 'dragged'] as const;

export default function DraggableListItemDemo() {
  const [items, setItems] = useState<DraggableListEntry[]>([
    { id: '1', label: 'Mixing', metaData: 'Unit operation', leftIcon: <RhombusOutlined /> },
    { id: '2', label: 'Filtration', metaData: 'Unit operation', leftIcon: <RhombusOutlined />, info: 'Removes particulates' },
    { id: '3', label: 'Fill and finish', metaData: 'Unit operation', leftIcon: <RhombusOutlined /> },
  ]);
  return (
    <Stack spacing={3} sx={{ maxWidth: 640 }}>
      <Typography variant="textM" color="text.secondary">Interaction states (list item and process map)</Typography>
      <Stack direction="row" useFlexGap sx={{ gap: 3, flexWrap: 'wrap' }}>
        <Stack spacing={1.5} sx={{ width: 276 }}>
          {states.map((s) => <DraggableListItem key={s} interaction={s} label={`Item ${s}`} metaData="Meta data" info="Info" />)}
        </Stack>
        <Stack spacing={1.5} sx={{ width: 276 }}>
          {states.map((s) => (
            <DraggableListItem key={s} processMap interaction={s} label={`Equipment ${s}`} metaData={['Absorber column', 'Line 1']} leftIcon={<PrecisionManufacturingOutlined sx={{ fontSize: 32 }} />} />
          ))}
        </Stack>
      </Stack>
      <Typography variant="textM" color="text.secondary">Drag to reorder</Typography>
      <Stack sx={{ width: 276 }}><DraggableList items={items} onReorder={setItems} /></Stack>
    </Stack>
  );
}
