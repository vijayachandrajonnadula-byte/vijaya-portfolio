import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import PersonOutline from '@mui/icons-material/PersonOutlineRounded';
import { Select } from './Select';
import type { SelectOption, SelectProps } from './Select';
import { Caption, ForceState, Section } from '../../_shared/ForceState';
import type { FieldColor, FieldSize } from '../../_shared/fieldStyles';

const plain: SelectOption[] = [
  { label: 'QA Team', value: 'qa' },
  { label: 'CMC Team', value: 'cmc' },
  { label: 'Manufacturing', value: 'mfg' },
  { label: 'Regulatory Affairs', value: 'ra', disabled: true },
  { label: 'Quality Control', value: 'qc' },
];
const meta: SelectOption[] = plain.map((o, i) => ({ ...o, metadata: `Metadata line ${i + 1}` }));
const chipsMeta: SelectOption[] = plain.map((o, i) => ({ ...o, metadata: `Metadata line ${i + 1}`, chips: i % 2 ? ['Active'] : undefined }));
const rich: SelectOption[] = [
  { label: 'Left icon', value: 'a', icon: <PersonOutline /> },
  { label: 'Right icon', value: 'b', rightIcon: <PersonOutline /> },
  { label: 'Avatar', value: 'c', avatar: <Box component="span" sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#cbd5e1' }} /> },
  { label: 'Colour', value: 'd', color: '#ef4444' },
  { label: 'Indent 1', value: 'e', indent: 1 },
  { label: 'Indent 2', value: 'f', indent: 2 },
  { label: 'Indent 3', value: 'g', indent: 3 },
];
const grouped: SelectOption[] = [
  { label: 'Quality system', value: 'g1', group: 'NATIVE CONNECTORS' },
  { label: 'Veeva', value: 'g2', group: 'NATIVE CONNECTORS' },
  { label: 'SharePoint', value: 'g3', group: 'EXTERNAL INTEGRATIONS' },
  { label: 'SAP', value: 'g4', group: 'EXTERNAL INTEGRATIONS' },
];

function Field(props: Omit<SelectProps, 'value' | 'onChange'> & { start?: string | string[] }) {
  const { start, ...rest } = props;
  const multi = rest.variant?.startsWith('checkbox') || rest.variant?.startsWith('chip');
  const [v, setV] = useState<string | string[]>(start ?? (multi ? [] : ''));
  return <Select {...rest} value={v} onChange={setV} />;
}

const colors: FieldColor[] = ['primary', 'success', 'warning', 'error'];

/** Figma "DropdownList": Select field states / sizes / colours, every Dropdown list style, option rows. */
export default function SelectDemo() {
  return (
    <Stack spacing={4} sx={{ pb: 36 }}>
      <Section title="Field: Color x Interaction (medium)">
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 240px)', gap: 2 }}>
          {colors.map((c) =>
            (['default', 'hover', 'active', 'disabled'] as const).map((i) => (
              <ForceState key={`${c}${i}`} state={i === 'hover' || i === 'active' ? i : undefined} color={c}>
                <Field options={plain} color={c} disabled={i === 'disabled'} placeholder={`${c} / ${i}`} data-spec={`select ${c} ${i}`} />
              </ForceState>
            )),
          )}
        </Box>
      </Section>
      <Section title="Sizes, filled, read only">
        <Stack direction="row" useFlexGap sx={{ gap: 2, flexWrap: 'wrap' }}>
          {(['small', 'medium', 'large'] as FieldSize[]).map((s) => (
            <Stack key={s} spacing={1} sx={{ width: 240 }}>
              <Caption>{s}</Caption>
              <Field options={plain} size={s} data-spec={`select ${s}`} />
              <Field options={plain} size={s} start="qa" />
              <Field options={plain} size={s} filled start="cmc" />
            </Stack>
          ))}
          <Stack spacing={1} sx={{ width: 240 }}>
            <Caption>read only</Caption>
            <Field options={plain} readOnly start="qa" />
          </Stack>
        </Stack>
      </Section>
      <Section title="Label, hint, label position">
        <Stack direction="row" useFlexGap sx={{ gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ width: 260 }}><Field options={plain} label="Label" required hint="Guide message" /></Box>
          <Box sx={{ width: 260 }}><Field options={plain} label="Label" error start="qa" hint="Error message" /></Box>
          <Box sx={{ width: 260 }}><Field options={plain} label="Label" hintVariant="info" hint="Information message" /></Box>
          <Box sx={{ width: 480 }}><Field options={plain} label="Label (left)" labelPosition="left" hint="Guide message" /></Box>
        </Stack>
      </Section>
      <Section title="Dropdown styles (click to open)">
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 280px)', gap: 3, alignItems: 'start' }}>
          <Field label="Single line" options={plain} start="qa" />
          <Field label="List with MetaData" variant="metadata" options={meta} />
          <Field label="Check box" variant="checkbox" options={plain} start={['qa', 'cmc']} />
          <Field label="Check box, count summary" variant="checkbox" options={plain} start={['qa', 'cmc']} selectionCountLabelSuffix="teams selected" />
          <Field label="CheckBox with Meta Data" variant="checkbox-metadata" options={meta} start={['qa']} />
          <Field label="Chips" variant="chip" options={plain} start={['qa', 'cmc', 'mfg']} limitTags={2} />
          <Field label="Chips with metadata + chips" variant="chip-metadata" options={chipsMeta} start={['qa']} />
          <Field label="Grouped" variant="grouped-select" options={grouped} start="g1" />
          <Field label="Icons, avatar, colour, indent" options={rich} />
          <Field label="Inside Search" options={plain} searchable />
          <Field label="View selected" options={plain} start="qa" onViewSelectedItem={() => undefined} />
          <Field label="Open menu (checkbox)" variant="checkbox" options={plain} start={['qa']} defaultOpen dropdownHeight="200px" />
        </Box>
      </Section>
    </Stack>
  );
}

