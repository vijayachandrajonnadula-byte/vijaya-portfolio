import { useState } from 'react';
import type { MouseEvent } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormatAlignLeft from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenter from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRight from '@mui/icons-material/FormatAlignRight';
import { ToggleButton, ToggleButtonGroup } from './ToggleButtonGroup';
import type { ToggleButtonInteraction, ToggleButtonItem } from './ToggleButtonGroup';

const text: ToggleButtonItem[] = [
  { value: 'a', label: 'Option 1', contentType: 'text' },
  { value: 'b', label: 'Option 2', contentType: 'text' },
  { value: 'c', label: 'Option 3', contentType: 'text' },
  { value: 'd', label: 'Disabled', contentType: 'text', disabled: true },
];
const icons: ToggleButtonItem[] = [
  { value: 'l', label: <FormatAlignLeft />, contentType: 'icon', ariaLabel: 'Left' },
  { value: 'c', label: <FormatAlignCenter />, contentType: 'icon', ariaLabel: 'Center' },
  { value: 'r', label: <FormatAlignRight />, contentType: 'icon', ariaLabel: 'Right' },
];
const interactions: ToggleButtonInteraction[] = ['default', 'hover', 'focus', 'disabled', 'selected', 'selectedHover', 'selectedFocus', 'selectedDisabled'];

/** Group: Variant (text/icon) x Size x Label Position. Building block: every Interaction, Position and Variant. */
export default function ToggleButtonGroupDemo() {
  const [one, setOne] = useState<string | null>('a');
  const [icon, setIcon] = useState<string | null>('l');
  const [many, setMany] = useState<string[]>(['a', 'c']);
  const onOne = (_e: MouseEvent<HTMLElement>, v: string | null) => v !== null && setOne(v);
  const onIcon = (_e: MouseEvent<HTMLElement>, v: string | null) => v !== null && setIcon(v);
  const onMany = (_e: MouseEvent<HTMLElement>, v: unknown) => setMany(v as string[]);
  return (
    <Stack spacing={2.5}>
      <Typography variant="textM" color="text.secondary">ToggleButtonGroup: Variant x Size</Typography>
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Stack key={size} direction="row" useFlexGap sx={{ gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <ToggleButtonGroup size={size} exclusive buttonList={text} value={one} onChange={onOne} />
          <ToggleButtonGroup size={size} exclusive buttonList={icons} value={icon} onChange={onIcon} />
        </Stack>
      ))}
      <Typography variant="textM" color="text.secondary">Label position top / left, multi-select, vertical, disabled</Typography>
      <Stack direction="row" useFlexGap sx={{ gap: 4, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <ToggleButtonGroup label="Label top" buttonList={text} value={many} onChange={onMany as never} />
        <ToggleButtonGroup label="Label left" labelPosition="left" exclusive buttonList={text.slice(0, 3)} value={one} onChange={onOne} />
        <ToggleButtonGroup orientation="vertical" exclusive buttonList={text.slice(0, 3)} value={one} onChange={onOne} />
        <ToggleButtonGroup disabled exclusive buttonList={text.slice(0, 3)} value="a" onChange={onOne} />
      </Stack>
      <Typography variant="textM" color="text.secondary">BuildingBlocks/ToggleButton: Interaction (rows) x Size, Position left, Text and Icon</Typography>
      {interactions.map((interaction) => (
        <Stack key={interaction} direction="row" useFlexGap sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="textS" sx={{ width: 110 }}>{interaction}</Typography>
          {(['small', 'medium', 'large'] as const).map((size) => (
            <Stack key={size} direction="row">
              <ToggleButton value="y" label="Yes" size={size} position="left" interaction={interaction} />
              <ToggleButton value="n" label="No" size={size} position="middle" interaction={interaction} />
              <ToggleButton value="m" label="Maybe" size={size} position="right" interaction={interaction} />
              <ToggleButton value="i" label={<FormatAlignRight />} contentType="icon" ariaLabel="Right" size={size} position="left" interaction={interaction} />
            </Stack>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
