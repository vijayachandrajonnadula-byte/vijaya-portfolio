import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Diamond from '@mui/icons-material/DiamondOutlined';
import { RadioGroup } from '@mui/material';
import { CheckboxCard, RadioCard, SelectionCard } from './SelectionCard';

const lorem = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
const slot = (
  <Box sx={{ height: 183, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, border: '1px dashed #6D28D9', background: '#FCFAFF', color: '#6D28D9', fontSize: 12 }}>Slot (replace me)</Box>
);

/** Selection Card (default, hover, active, disabled) and the Checkbox / Radio card states incl. error. */
export default function SelectionCardDemo() {
  const [sel, setSel] = useState(1);
  const [plan, setPlan] = useState('b');
  return (
    <Stack spacing={3}>
      <Typography variant="textM" color="text.secondary">Selection Card (default, hover, active, disabled; click to select)</Typography>
      <Stack direction="row" useFlexGap sx={{ gap: 2, flexWrap: 'wrap' }}>
        <SelectionCard selected={sel === 0} onSelect={() => setSel(0)}>{slot}</SelectionCard>
        <SelectionCard className="is-hover">{slot}</SelectionCard>
        <SelectionCard selected={sel === 1} onSelect={() => setSel(1)}>{slot}</SelectionCard>
        <SelectionCard disabled>{slot}</SelectionCard>
      </Stack>
      <Typography variant="textM" color="text.secondary">Checkbox Card: default, active, with icon, disabled, error</Typography>
      <Stack direction="row" useFlexGap sx={{ gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <CheckboxCard label="Label" description={lorem} />
        <CheckboxCard label="Hover" description={lorem} className="is-hover" />
        <CheckboxCard label="Label" description={lorem} defaultChecked />
        <CheckboxCard label="With icon" description={lorem} icon={<Diamond />} defaultChecked />
        <CheckboxCard label="Disabled" description={lorem} icon={<Diamond />} disabled />
        <CheckboxCard label="Error" description={lorem} error errorMessage="Select at least one option" />
      </Stack>
      <Typography variant="textM" color="text.secondary">Radio Card (inside a RadioGroup)</Typography>
      <RadioGroup row value={plan} onChange={(_, v) => setPlan(v)} sx={{ gap: 2, alignItems: 'flex-start' }}>
        <RadioCard value="a" label="Starter" description={lorem} icon={<Diamond />} />
        <RadioCard value="b" label="Team" description={lorem} icon={<Diamond />} />
        <RadioCard value="e" label="Hover" description={lorem} className="is-hover" />
        <RadioCard value="c" label="Disabled" description={lorem} disabled />
        <RadioCard value="d" label="Error" description={lorem} error errorMessage="Choose a plan" />
      </RadioGroup>
    </Stack>
  );
}
