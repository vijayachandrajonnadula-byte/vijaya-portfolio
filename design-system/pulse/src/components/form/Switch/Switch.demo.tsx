import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SwitchWithLabel } from '../Choice/Choice';
import { Switch } from './Switch';

const states = [
  { name: 'default', props: {} },
  { name: 'hover', props: { className: 'is-hover' } },
  { name: 'focus', props: { className: 'Mui-focusVisible' } },
  { name: 'disabled', props: { disabled: true } },
] as const;

/** Size x Color x State (OFF / ON / Intermediate) x Interaction, and SwitchWithLabel layouts. */
export default function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <Stack spacing={2}>
      {(['primary', 'error', 'warning', 'mobile', 'grey'] as const).map((color) => (
        <Stack key={color} spacing={0.5}>
          <Typography variant="textM" color="text.secondary">{color}</Typography>
          {states.map((s) => (
            <Stack key={s.name} direction="row" useFlexGap sx={{ alignItems: 'center', gap: 1.5 }}>
              <Typography variant="textM" color="text.secondary" sx={{ width: 70 }}>{s.name}</Typography>
              {(['small', 'medium'] as const).map((size) => (
                <Stack key={size} direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                  <Switch size={size} color={color} {...s.props} data-spec={`switch ${size} off`} />
                  <Switch size={size} color={color} defaultChecked {...s.props} data-spec={`switch ${size} on`} />
                  <Switch size={size} color={color} indeterminate {...s.props} />
                </Stack>
              ))}
            </Stack>
          ))}
        </Stack>
      ))}
      <Typography variant="textM" color="text.secondary">SwitchWithLabel</Typography>
      <Stack direction="row" useFlexGap sx={{ gap: 4, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <SwitchWithLabel size="medium" label="Enable" fieldLabel="Label Value" hint="Error message" error checked={on} onChange={setOn} />
        <SwitchWithLabel size="small" label="Enable" fieldLabel="Label left" fieldLabelPosition="left" labelPlacement="start" checked={on} onChange={setOn} />
        <SwitchWithLabel label="Plain label" checked={on} onChange={setOn} />
        <SwitchWithLabel label="Disabled" disabled checked />
      </Stack>
    </Stack>
  );
}
