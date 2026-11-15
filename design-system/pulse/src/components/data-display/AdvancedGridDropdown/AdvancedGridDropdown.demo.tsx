import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { AdvancedGridDropdown } from './AdvancedGridDropdown';

const rows = ['Protocol 001', 'Protocol 002', 'Protocol 003', 'Protocol 004'].map((p, i) => ({ id: String(i), primary: p, secondary: ['Boston', 'Dublin', 'Singapore', 'Pune'][i]! }));

/** AdvancedGridDropdown: Variant Single Select (radio) and Multi select (checkbox). */
export default function AdvancedGridDropdownDemo() {
  const [one, setOne] = useState<string[]>(['1']);
  const [many, setMany] = useState<string[]>(['0', '2']);
  return (
    <Stack direction="row" useFlexGap sx={{ gap: 3, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <AdvancedGridDropdown variant="single" rows={rows} value={one} onChange={setOne} />
      <AdvancedGridDropdown variant="multi" rows={rows} value={many} onChange={setMany} />
    </Stack>
  );
}
