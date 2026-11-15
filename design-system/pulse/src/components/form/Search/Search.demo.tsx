import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Search } from './Search';
import { Caption, ForceState, Section } from '../../_shared/ForceState';

/** Figma "Search": Label Position (top / left) x Search Icon Position (left / right), states, sizes. */
export default function SearchDemo() {
  const [q, setQ] = useState('pulse');
  return (
    <Stack spacing={4}>
      <Section title="Label Position x Search Icon Position">
        <Stack direction="row" useFlexGap sx={{ gap: 4, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {(['start', 'end'] as const).map((pos) => (
            <Stack key={pos} spacing={2} sx={{ width: 480 }}>
              <Caption>icon {pos === 'start' ? 'left' : 'right'}</Caption>
              <Search label="Label" position={pos} hint="Error message" error placeholder="Search" />
              <Search label="Label" labelPosition="left" position={pos} hint="Guide message" placeholder="Search" />
            </Stack>
          ))}
        </Stack>
      </Section>
      <Section title="States (small)">
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 240px)', gap: 2 }}>
          <Search placeholder="Default" />
          <ForceState state="hover"><Search placeholder="Hover" /></ForceState>
          <ForceState state="active"><Search placeholder="Active" /></ForceState>
          <Search placeholder="Disabled" disabled />
          <Search value={q} onChange={(e) => setQ(e.target.value)} handleClear={() => setQ('')} />
          <Search filled placeholder="Filled" />
          <Search error placeholder="Error" />
          <Search color="success" placeholder="Success" />
        </Box>
      </Section>
      <Section title="Sizes">
        <Stack spacing={1.5} sx={{ width: 280 }}>
          <Search size="small" placeholder="Small 32" />
          <Search size="medium" placeholder="Medium 40" />
          <Search size="large" placeholder="Large 44" />
        </Stack>
      </Section>
    </Stack>
  );
}


