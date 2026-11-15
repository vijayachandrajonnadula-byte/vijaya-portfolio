import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RadioGroup } from '../Choice/Choice';
import { Radio } from './Radio';

const states = [
  { name: 'default', props: {} },
  { name: 'hover', props: { className: 'is-hover' } },
  { name: 'focus', props: { className: 'Mui-focusVisible' } },
  { name: 'disabled', props: { disabled: true } },
] as const;

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack direction="row" useFlexGap sx={{ alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <Typography variant="textM" color="text.secondary" sx={{ width: 150 }}>{title}</Typography>
      {children}
    </Stack>
  );
}

/** Every Figma state: Size x Style x Color x State x Interaction, plus labels and groups. */
export default function RadioDemo() {
  const [v, setV] = useState('b');
  const opts = [{ label: 'Daily', value: 'a' }, { label: 'Weekly', value: 'b', metadata: 'Every Monday' }, { label: 'Monthly', value: 'c' }, { label: 'Never', value: 'd', disabled: true }];
  return (
    <Stack spacing={2}>
      {(['solid', 'stroke'] as const).map((variant) =>
        (['primary', 'error', 'warning'] as const).map((color) => (
          <Stack key={`${variant}${color}`} spacing={0.5}>
            <Typography variant="textM" color="text.secondary">{variant} / {color}</Typography>
            {states.map((s) => (
              <Row key={s.name} title={s.name}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <Stack key={size} direction="row" sx={{ gap: 0.5 }}>
                    <Radio size={size} variant={variant} color={color} {...s.props} />
                    <Radio size={size} variant={variant} color={color} checked {...s.props} data-spec={`radio ${size}`} />
                  </Stack>
                ))}
              </Row>
            ))}
          </Stack>
        )),
      )}
      <Row title="with label">
        <Radio label="Label" />
        <Radio label="Label left" labelPlacement="start" checked />
        <Radio label="With metadata" metadata="Meta Data" checked />
        <Radio label="Disabled" disabled checked />
      </Row>
      <Row title="group column">
        <RadioGroup label="Frequency" options={opts} value={v} onChange={setV} hint="Pick one" />
        <RadioGroup label="Required" required error options={opts} value="" onChange={() => {}} hint="Select an option" />
      </Row>
      <Row title="group row, label left">
        <RadioGroup label="Frequency" row labelPosition="left" options={opts} value={v} onChange={setV} />
      </Row>
    </Stack>
  );
}
