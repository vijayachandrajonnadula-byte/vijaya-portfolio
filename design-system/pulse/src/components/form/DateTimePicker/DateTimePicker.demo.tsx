import Stack from '@mui/material/Stack';
import { DateTimePicker } from './DateTimePicker';

/** DateTimePicker: label top / left, error, disabled. Click the icon to open the combined calendar + clock popper. */
export default function DateTimePickerDemo() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 560 }}>
      <DateTimePicker label="Schedule" hint="Helper text" defaultValue="2026-11-09T14:30:00" />
      <DateTimePicker label="Schedule" labelPosition="left" size="small" defaultValue="2026-11-09T14:30:00" />
      <DateTimePicker label="Error" error hint="Pick a future date" />
      <DateTimePicker label="Disabled" disabled defaultValue="2026-11-09T14:30:00" />
    </Stack>
  );
}
