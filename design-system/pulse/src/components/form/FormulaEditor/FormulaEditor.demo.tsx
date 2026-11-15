import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { FormulaButtonSet, FormulaEditor } from './FormulaEditor';
import type { FormulaButtonSetType, FormulaEditorColor } from './FormulaEditor';
import { Caption } from '../../_shared/ForceState';

const sets: FormulaButtonSetType[] = ['characters', 'basic', 'trigonometry', 'algebra', 'statistical'];
const colors: FormulaEditorColor[] = ['primary', 'error', 'success', 'warning'];

/** Formula Editor: Label Position Top / Left, Color, Interaction (default / hover / focus / disabled), and each Formula Button Set. */
export default function FormulaEditorDemo() {
  const [formula, setFormula] = useState('SUM(A, B) / 2');
  return (
    <Stack spacing={3} sx={{ maxWidth: 780 }}>
      <Caption>Label position top (controlled, limit) and left</Caption>
      <FormulaEditor label="Formula" required value={formula} onChange={setFormula} limit={200} hint="Use the buttons to insert functions" data-spec="formula-top" />
      <FormulaEditor label="Formula" labelPosition="left" defaultButtonSet="trigonometry" minHeight={96} />
      <Caption>Color</Caption>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {colors.map((c) => <FormulaEditor key={c} label={c} color={c} minHeight={64} defaultButtonSet="basic" defaultValue="A + B" hint={c === 'error' ? 'Formula is invalid' : undefined} />)}
      </Box>
      <Caption>Disabled</Caption>
      <FormulaEditor label="Disabled" disabled minHeight={64} defaultValue="A + B" />
      <Caption>Formula Button Set: Type</Caption>
      {sets.map((t) => (
        <Box key={t} sx={{ width: 593 }}><FormulaButtonSet type={t} /></Box>
      ))}
    </Stack>
  );
}
