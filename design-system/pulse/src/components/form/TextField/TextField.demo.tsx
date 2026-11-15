import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { TextField } from './TextField';
import { TextAreaDemoSections } from './TextAreaDemoSections';
import { Caption, ForceState, Section } from '../../_shared/ForceState';
import type { FieldColor, FieldSize } from '../../_shared/fieldStyles';

const colors: FieldColor[] = ['primary', 'success', 'warning', 'error'];
const sizes: FieldSize[] = ['small', 'medium', 'large'];
const interactions = ['default', 'hover', 'active', 'disabled'] as const;

/** Figma "TextField": Size x Color x Interaction x Filled?, label positions, input types, adornments. */
export default function TextFieldDemo() {
  const [text, setText] = useState('PULSE design system');
  const [tags, setTags] = useState(['Tag 01', 'Tag 02']);
  return (
    <Stack spacing={4}>
      {([false, true] as const).map((filled) => (
        <Section key={String(filled)} title={`Color x Interaction (medium, Filled? = ${filled ? 'Yes' : 'No'})`}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 240px)', gap: 2 }}>
            {colors.map((c) =>
              interactions.map((i) => (
                <ForceState key={`${c}${i}`} state={i === 'hover' || i === 'active' ? i : undefined} color={c}>
                  <TextField size="medium" color={c} filled={filled} disabled={i === 'disabled'} placeholder={`${c} / ${i}`} data-spec={`tf ${c} ${i}`} />
                </ForceState>
              )),
            )}
          </Box>
        </Section>
      ))}

      <Section title="Size (small 32 / medium 40 / large 44), empty and filled value">
        <Stack direction="row" useFlexGap sx={{ gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {sizes.map((s) => (
            <Stack key={s} spacing={1} sx={{ width: 260 }}>
              <Caption>{s}</Caption>
              <TextField size={s} placeholder="Placeholder" />
              <TextField size={s} value="Value text" onChange={() => undefined} onClear={() => undefined} />
              <TextField size={s} filled value="Filled value" onChange={() => undefined} />
            </Stack>
          ))}
        </Stack>
      </Section>

      <Section title="Label, required, hint (Label Position top / left)">
        <Stack direction="row" useFlexGap sx={{ gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ width: 280 }}>
            <TextField label="Label" required placeholder="Enter value" hint="Guide message" />
          </Box>
          <Box sx={{ width: 280 }}>
            <TextField label="Label" placeholder="Enter value" hint="Information message" hintVariant="info" />
          </Box>
          <Box sx={{ width: 280 }}>
            <TextField label="Label" color="success" placeholder="Enter value" hint="Success message" hintVariant="success" />
          </Box>
          <Box sx={{ width: 280 }}>
            <TextField label="Label" color="warning" placeholder="Enter value" hint="Warning message" hintVariant="warning" />
          </Box>
          <Box sx={{ width: 280 }}>
            <TextField label="Label" error value="Wrong value" onChange={() => undefined} hint="Error message" />
          </Box>
          <Box sx={{ width: 480 }}>
            <TextField label="Label (left)" labelPosition="left" required placeholder="Enter value" hint="Guide message" />
          </Box>
          <Box sx={{ width: 280 }}>
            <TextField label="LABEL ALL CAPS" labelAllCaps placeholder="Enter value" />
          </Box>
        </Stack>
      </Section>

      <Section title="Input types and adornments">
        <Stack direction="row" useFlexGap sx={{ gap: 3, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Box sx={{ width: 280 }}>
            <TextField label="Clearable" value={text} onChange={(e) => setText(e.target.value)} onClear={() => setText('')} placeholder="Type here" />
          </Box>
          <Box sx={{ width: 280 }}>
            <TextField label="Left search icon" startAdornment={<SearchRounded sx={{ fontSize: 16 }} />} placeholder="Search" />
          </Box>
          <Box sx={{ width: 280 }}>
            <TextField label="Date" placeholder="DD/MM/YYYY" endAdornment={<CalendarTodayOutlined sx={{ fontSize: 16 }} />} />
          </Box>
          <Box sx={{ width: 280 }}>
            <TextField label="Password" type="password" defaultValue="secret123" />
          </Box>
          <Box sx={{ width: 320 }}>
            <TextField label="Tag input" tags={tags} onTagsChange={setTags} placeholder="Add a tag" filled />
          </Box>
          <Box sx={{ width: 280 }}>
            <TextField label="Read only" readOnly defaultValue="Read-only value" />
          </Box>
          <Box sx={{ width: 280 }}>
            <TextField label="Disabled" disabled defaultValue="Disabled value" />
          </Box>
        </Stack>
      </Section>
      <TextAreaDemoSections />
    </Stack>
  );
}

