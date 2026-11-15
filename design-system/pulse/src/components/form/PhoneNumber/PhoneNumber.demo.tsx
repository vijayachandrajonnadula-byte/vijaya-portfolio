import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AtomIconSearch, CountryCodeSelect, PhoneNumber } from './PhoneNumber';
import { Caption } from '../../_shared/ForceState';

/** PhoneNumber (Label Position Top / Left), sizes, colours, states, the open country-code list and AtomIconSearch. */
export default function PhoneNumberDemo() {
  const [country, setCountry] = useState('US');
  const [number, setNumber] = useState('555 010 2030');
  return (
    <Stack spacing={3} sx={{ maxWidth: 760 }}>
      <Caption>Label position top / left (controlled)</Caption>
      <Box sx={{ display: 'grid', gridTemplateColumns: '304px 480px', gap: '32px', alignItems: 'start' }}>
        <PhoneNumber label="Phone number" required hint="Helper text" country={country} onCountryChange={setCountry} value={number} onChange={setNumber} data-spec="phone-top" />
        <PhoneNumber label="Phone number" labelPosition="left" hint="Helper text" />
      </Box>
      <Caption>Sizes</Caption>
      <Stack direction="row" spacing={2}>
        {(['small', 'medium', 'large'] as const).map((s) => <Box key={s} sx={{ width: 240 }}><PhoneNumber label={s} size={s} defaultValue="98765 43210" /></Box>)}
      </Stack>
      <Caption>Colours, filled, disabled, read only</Caption>
      <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Box sx={{ width: 240 }}><PhoneNumber label="Error" error hint="Enter a valid number" defaultValue="123" /></Box>
        <Box sx={{ width: 240 }}><PhoneNumber label="Success" color="success" defaultValue="98765 43210" /></Box>
        <Box sx={{ width: 240 }}><PhoneNumber label="Warning" color="warning" defaultValue="98765 43210" /></Box>
        <Box sx={{ width: 240 }}><PhoneNumber label="Filled" filled /></Box>
        <Box sx={{ width: 240 }}><PhoneNumber label="Disabled" disabled defaultValue="98765 43210" /></Box>
        <Box sx={{ width: 240 }}><PhoneNumber label="Read only" readOnly defaultValue="98765 43210" /></Box>
      </Stack>
      <Caption>Country Code dropdown (open)</Caption>
      <Box sx={{ minHeight: 280 }}>
        <CountryCodeSelect value="IN" onChange={() => {}} defaultOpen />
      </Box>
      <Caption>AtomIconSearch: Icon State x Sizes</Caption>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
        {(['filled', 'placeholder'] as const).map((state) => (
          <Stack key={state} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            {(['S', 'M', 'L'] as const).map((size) => <AtomIconSearch key={size} state={state} size={size} />)}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
