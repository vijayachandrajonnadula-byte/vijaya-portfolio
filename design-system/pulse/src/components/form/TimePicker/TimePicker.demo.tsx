import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import dayjs from 'dayjs';
import { TimePicker, TimePickerBody } from './TimePicker';
import { ClockBody } from './ClockBody';

const Label = ({ children }: { children: string }) => <Typography variant="textM" color="text.secondary">{children}</Typography>;

/** TimePicker (label top / left, states) plus the static Time Picker Body and Clock Body (short / tall). */
export default function TimePickerDemo() {
  const [t, setT] = useState(dayjs().hour(9).minute(30));
  return (
    <Stack spacing={3} sx={{ maxWidth: 560 }}>
      <TimePicker label="Time" hint="Helper text" defaultValue="09:30:00" />
      <TimePicker label="Time" labelPosition="left" size="small" defaultValue="14:05" />
      <TimePicker label="24 hour, no seconds" use12h={false} showSeconds={false} defaultValue="14:05" />
      <TimePicker label="Error" error hint="Invalid time" />
      <TimePicker label="Disabled" disabled defaultValue="09:30" />
      <Label>Time Picker Body (224 x 220)</Label>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-start' }}>
        <TimePickerBody value={t} onChange={setT} use12h />
        <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,.2)', borderRadius: 8, background: '#fff' }}>
          <ClockBody value={t} onChange={setT} size="tall" />
        </div>
      </Stack>
    </Stack>
  );
}
