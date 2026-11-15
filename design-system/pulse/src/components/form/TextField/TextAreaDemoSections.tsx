import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { TextArea } from './TextField';
import { Caption, ForceState, Section } from '../../_shared/ForceState';
import type { FieldColor, FieldSize } from '../../_shared/fieldStyles';

const colors: FieldColor[] = ['primary', 'success', 'warning', 'error'];
const interactions = ['default', 'hover', 'active', 'disabled'] as const;

/** Figma "Textarea" (rendered at the end of the TextField demo, the gallery shows one demo per folder): Size x Color x Interaction x State (placeholder / value filled), Label Position. */
export function TextAreaDemoSections() {
  const [v, setV] = useState('Multi-line value\nsecond line');
  return (
    <Stack spacing={4}>
      <Section title="Color x Interaction (medium, placeholder)">
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 240px)', gap: 2 }}>
          {colors.map((c) =>
            interactions.map((i) => (
              <ForceState key={`${c}${i}`} state={i === 'hover' || i === 'active' ? i : undefined} color={c}>
                <TextArea color={c} disabled={i === 'disabled'} placeholder={`${c} / ${i}`} data-spec={`ta ${c} ${i}`} />
              </ForceState>
            )),
          )}
        </Box>
      </Section>
      <Section title="Value filled, Filled? = Yes, sizes">
        <Stack direction="row" useFlexGap sx={{ gap: 2, flexWrap: 'wrap' }}>
          {(['small', 'medium', 'large'] as FieldSize[]).map((s) => (
            <Stack key={s} spacing={1} sx={{ width: 240 }}>
              <Caption>{s}</Caption>
              <TextArea size={s} value={v} onChange={(e) => setV(e.target.value)} />
              <TextArea size={s} filled defaultValue="Filled background" />
            </Stack>
          ))}
        </Stack>
      </Section>
      <Section title="Label and hint">
        <Stack direction="row" useFlexGap sx={{ gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ width: 280 }}><TextArea label="Description" required placeholder="Enter Description" rows={4} hint="Guide message" /></Box>
          <Box sx={{ width: 280 }}><TextArea label="Description" error defaultValue="Invalid" hint="Error message" /></Box>
          <Box sx={{ width: 520 }}><TextArea label="Label (left)" labelPosition="left" placeholder="Enter Description" hint="Guide message" /></Box>
          <Box sx={{ width: 280 }}><TextArea label="Read only" readOnly defaultValue="Read-only multi-line value" /></Box>
        </Stack>
      </Section>
    </Stack>
  );
}

