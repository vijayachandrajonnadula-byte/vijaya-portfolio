import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import PersonOutline from '@mui/icons-material/PersonOutlineRounded';
import { Autocomplete } from './Autocomplete';
import type { SelectOption } from '../Select/Select';
import { Caption } from '../../_shared/ForceState';

const options: SelectOption[] = [
  { label: 'QA Team', value: 'qa' },
  { label: 'CMC Team', value: 'cmc' },
  { label: 'Manufacturing', value: 'mfg' },
  { label: 'Regulatory Affairs', value: 'ra', disabled: true },
  { label: 'Quality Control', value: 'qc' },
  { label: 'Validation', value: 'val' },
];
const rich: SelectOption[] = options.map((o, i) => ({ ...o, icon: <PersonOutline />, metadata: i % 2 ? `Metadata line ${i + 1}` : undefined }));

/** Autocomplete: Label Position Top / Left, single and multiple, sizes, colours, states, open list. */
export default function AutocompleteDemo() {
  const [one, setOne] = useState<string | string[] | null>('cmc');
  return (
    <Stack spacing={3} sx={{ maxWidth: 760 }}>
      <Caption>Label position top / left</Caption>
      <Box sx={{ display: 'grid', gridTemplateColumns: '240px 480px', gap: '32px', alignItems: 'start' }}>
        <Autocomplete label="Team" options={options} value={one} onChange={setOne} hint="Helper text" />
        <Autocomplete label="Team" labelPosition="left" options={options} placeholder="Type to search" hint="Helper text" />
      </Box>
      <Caption>Multiple (chips + checkbox rows), limitTags 2</Caption>
      <Box sx={{ width: 320 }}><Autocomplete label="Teams" multiple options={options} defaultValue={['qa', 'cmc', 'mfg']} /></Box>
      <Caption>Sizes</Caption>
      <Stack direction="row" spacing={2}>
        {(['small', 'medium', 'large'] as const).map((s) => <Box key={s} sx={{ width: 220 }}><Autocomplete label={s} size={s} options={options} defaultValue="qa" /></Box>)}
      </Stack>
      <Caption>Colours, disabled, read only</Caption>
      <Stack direction="row" spacing={2}>
        <Box sx={{ width: 180 }}><Autocomplete label="Success" color="success" options={options} defaultValue="qa" /></Box>
        <Box sx={{ width: 180 }}><Autocomplete label="Warning" color="warning" options={options} defaultValue="qa" /></Box>
        <Box sx={{ width: 180 }}><Autocomplete label="Error" error hint="Required" options={options} /></Box>
        <Box sx={{ width: 180 }}><Autocomplete label="Disabled" disabled options={options} defaultValue="qa" /></Box>
        <Box sx={{ width: 180 }}><Autocomplete label="Read only" readOnly options={options} defaultValue="qa" /></Box>
      </Stack>
      <Caption>Open list (icons + metadata)</Caption>
      <Box sx={{ width: 320, minHeight: 280 }}><Autocomplete label="Open" options={rich} defaultOpen defaultValue="cmc" /></Box>
    </Stack>
  );
}
