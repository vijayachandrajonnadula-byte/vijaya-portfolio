import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckboxGroup } from '../Choice/Choice';
import { Checkbox } from './Checkbox';

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

/** Every Figma state: Size x Style x Color x State x Interaction, plus label, metadata and group. */
export default function CheckboxDemo() {
  const [group, setGroup] = useState<string[]>(['b']);
  const opts = [{ label: 'Email', value: 'a' }, { label: 'SMS', value: 'b', metadata: 'Standard rates apply' }, { label: 'Push', value: 'c' }, { label: 'Fax', value: 'd', disabled: true }];
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
                    <Checkbox size={size} variant={variant} color={color} {...s.props} />
                    <Checkbox size={size} variant={variant} color={color} defaultChecked {...s.props} data-spec={`checkbox ${size}`} />
                    <Checkbox size={size} variant={variant} color={color} indeterminate {...s.props} />
                  </Stack>
                ))}
              </Row>
            ))}
          </Stack>
        )),
      )}
      <Row title="with label">
        <Checkbox label="Remember me" />
        <Checkbox label="Label left" labelPlacement="start" defaultChecked />
        <Checkbox label="With metadata" metadata="Meta Data" defaultChecked />
        <Checkbox label="Error" error />
        <Checkbox label="Disabled" disabled defaultChecked />
      </Row>
      <Row title="group column">
        <CheckboxGroup label="Notify me by" options={opts} value={group} onChange={setGroup} hint="Pick at least one" />
        <CheckboxGroup label="Required" required error options={opts} value={[]} onChange={() => {}} hint="Select at least one option" />
      </Row>
      <Row title="group row, label left">
        <CheckboxGroup label="Channels" row labelPosition="left" options={opts} value={group} onChange={setGroup} />
      </Row>
    </Stack>
  );
}
