import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '../../actions/Button/Button';
import { ButtonGroup } from '../../actions/Button/ButtonGroup';
import { ArrowDown01Icon, Edit02Icon, FilterIcon } from '../../../icons';
import { DropdownMenu } from './DropdownMenu';

/** Menus opened from a Button and from the split ButtonGroup. */
export default function DropdownMenuDemo() {
  const [a, setA] = useState<HTMLElement | null>(null);
  const [b, setB] = useState<HTMLElement | null>(null);
  const [picked, setPicked] = useState<string | number>('new');
  return (
    <Stack spacing={3}>
      <Typography variant="textM" color="text.secondary">Button menu, with icons and a selected row (picked: {picked})</Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={(e) => setA(e.currentTarget)}>Open menu</Button>
        <DropdownMenu
          anchorEl={a}
          open={Boolean(a)}
          onClose={() => setA(null)}
          selected={picked}
          onSelect={(o) => setPicked(o.value)}
          options={[
            { label: 'New lifecycle', value: 'new', icon: <Edit02Icon size={16} /> },
            { label: 'From template', value: 'template', icon: <FilterIcon size={16} /> },
            { label: 'Disabled', value: 'disabled', disabled: true },
          ]}
        />
        <ButtonGroup size="small" icon={<ArrowDown01Icon size={16} />} onIconClick={(e) => setB(e.currentTarget)}>Create</ButtonGroup>
        <DropdownMenu anchorEl={b} open={Boolean(b)} onClose={() => setB(null)} align="right" options={[{ label: 'Blank', value: 'blank' }, { label: 'From template', value: 'template' }]} />
      </Stack>
    </Stack>
  );
}
