import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker, DateRangePicker } from './DatePicker';

const Label = ({ children }: { children: string }) => <Typography variant="textM" color="text.secondary">{children}</Typography>;

/** DatePicker + DateRangePicker: label top / left, sizes, error, disabled, pickers (day/month/year/quarter). Click the icon to open. */
export default function DatePickerDemo() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 560 }}>
      <Label>Label position</Label>
      <DatePicker label="Start date" hint="Helper text" defaultValue="2026-11-09" />
      <DatePicker label="Start date" labelPosition="left" defaultValue="2026-11-09" />
      <Label>Sizes</Label>
      <DatePicker label="Small (32px)" size="small" defaultValue="2026-11-09" data-spec="date-small" />
      <Label>States</Label>
      <DatePicker label="Required, empty" required placeholder="DD/MM/YYYY" />
      <DatePicker label="Error" error hint="Select a valid date" defaultValue="2026-11-09" />
      <DatePicker label="Disabled" disabled defaultValue="2026-11-09" />
      <Label>Pickers</Label>
      <DatePicker label="Month" picker="month" defaultValue="2026-11-09" />
      <DatePicker label="Year" picker="year" defaultValue="2026-11-09" />
      <DatePicker label="Quarter" picker="quarter" defaultValue="2026-11-09" />
      <DatePicker label="With footer" showFooter defaultValue="2026-11-09" />
      <Label>Range</Label>
      <DateRangePicker label="Period" size="small" defaultValue={['2024-08-21T00:00:00Z', '2024-09-21T00:00:00Z']} />
      <DateRangePicker label="Single calendar" calendars={1} labelPosition="left" />
    </Stack>
  );
}
