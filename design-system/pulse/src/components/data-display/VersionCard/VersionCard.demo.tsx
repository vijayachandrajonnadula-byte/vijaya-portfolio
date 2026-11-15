import { useState } from 'react';
import Box from '@mui/material/Box';
import { VersionCard } from './VersionCard';

const versions = ['1.0', '2.0', '3.0'];
const details = [
  { label: 'Completed By', value: 'Senthil Kumar [Senthil]' },
  { label: 'Completed On', value: '2024-02-08 14:28:31 (IST)' },
  { label: 'Role', value: 'Standard' },
  { label: 'Comments', value: 'No comments' },
];

/** VersionCard: Show Option Collapsed and Expanded, Current (blue) beside Previous (yellow). */
export default function VersionCardDemo() {
  const [open, setOpen] = useState(true);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 960 }}>
      {[false, true].map((x) => (
        <Box key={String(x)} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <VersionCard versions={versions} version="3.0" expanded={x} details={details} />
          <VersionCard color="yellow" versions={versions} version="2.0" expanded={x} details={details} />
        </Box>
      ))}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <VersionCard versions={versions} version="3.0" expanded={open} onExpandedChange={setOpen} details={details} />
        <VersionCard color="yellow" versions={versions} version="2.0" expanded={open} onExpandedChange={setOpen} details={details} />
      </Box>
    </Box>
  );
}
