import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Matrix, MatrixCell } from './Matrix';
import type { MatrixCellType } from './Matrix';

const ratings: [Exclude<MatrixCellType, 'axis'>, string][] = [['low', 'Low (3)'], ['medium', 'Medium (6)'], ['high', 'High (9)']];

export default function MatrixDemo() {
  const [sel, setSel] = useState<string | null>('1-1');
  return (
    <Stack spacing={3}>
      <Typography variant="textM" color="text.secondary">Matrix Cell: Interactive=Yes Low / Medium / High (Default, then Hover) and Interactive=No, Type=Axis</Typography>
      <Stack direction="row" useFlexGap sx={{ gap: 1, flexWrap: 'wrap' }}>
        <MatrixCell type="axis">Severity</MatrixCell>
        {ratings.map(([t, l]) => <MatrixCell key={t} type={t} interactive>{l}</MatrixCell>)}
        {ratings.map(([t, l]) => <MatrixCell key={`h${t}`} type={t} interactive hover>{l}</MatrixCell>)}
      </Stack>
      <Typography variant="textM" color="text.secondary">Matrix: Severity x Occurrence, axis cells + rating cells (click a cell)</Typography>
      <Matrix
        cornerLabel="Severity"
        columns={['Low', 'Medium', 'High']}
        rows={[
          { header: 'Low', cells: [{ type: 'low', label: 'Low (1)', id: '0-0' }, { type: 'low', label: 'Low (2)', id: '0-1' }, { type: 'medium', label: 'Medium (4)', id: '0-2' }] },
          { header: 'Medium', cells: [{ type: 'low', label: 'Low (2)', id: '1-0' }, { type: 'medium', label: 'Medium (4)', id: '1-1' }, { type: 'high', label: 'High (9)', id: '1-2' }] },
          { header: 'High', cells: [{ type: 'medium', label: 'Medium (6)', id: '2-0' }, { type: 'high', label: 'High (9)', id: '2-1' }, { type: 'high', label: 'High (9)', id: '2-2' }] },
        ]}
        interactive
        selectedId={sel}
        onCellClick={(c) => setSel(c.id ?? null)}
      />
    </Stack>
  );
}
