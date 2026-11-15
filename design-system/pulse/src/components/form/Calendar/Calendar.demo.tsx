import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { Calendar, CalendarCell } from './Calendar';
import type { CalendarRange } from './Calendar';

const Label = ({ children }: { children: string }) => (
  <Typography variant="textM" color="text.secondary" sx={{ mb: 1 }}>{children}</Typography>
);

/** Calendar: Single/Dual x Day/Month/Year/Quarter, cell states, range highlight, event badges, footer. */
export default function CalendarDemo() {
  const [single, setSingle] = useState<dayjs.Dayjs | null>(dayjs());
  const [range, setRange] = useState<CalendarRange>([dayjs().date(8), dayjs().date(17)]);
  const [range2, setRange2] = useState<CalendarRange>([dayjs().date(12), dayjs().add(1, 'month').date(9)]);
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Label>Cell states (Default, Today, Selected, Hover via mouse, Disabled, Overflow, range start / middle / end, events)</Label>
        <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1, bgcolor: 'background.paper', p: 1 }}>
          <CalendarCell label="12" />
          <CalendarCell label="13" today />
          <CalendarCell label="14" selected />
          <CalendarCell label="15" disabled />
          <CalendarCell label="30" outside />
          <CalendarCell label="16" selected rangeStart />
          <CalendarCell label="17" inRange />
          <CalendarCell label="18" selected rangeEnd />
          <CalendarCell label="19" events={['#eab308', '#22c55e', '#ef4444']} />
          <CalendarCell label="May" width={64} />
          <CalendarCell label="2026" width={70} today />
        </Stack>
      </Stack>
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
        <Box><Label>Single / Day (with footer + events)</Label>
          <Calendar value={single} onChange={setSingle} showFooter onToday={() => setSingle(dayjs())} eventColors={(d) => (d.date() % 7 === 0 ? ['#eab308', '#22c55e'] : undefined)} />
        </Box>
        <Box><Label>Single / Month</Label><Calendar granularity="month" value={single} onChange={setSingle} /></Box>
        <Box><Label>Single / Year</Label><Calendar granularity="year" value={single} onChange={setSingle} /></Box>
        <Box><Label>Single / Quarter</Label><Calendar granularity="quarter" value={single} onChange={setSingle} /></Box>
        <Box><Label>Range (1 calendar)</Label><Calendar mode="range" rangeValue={range} onRangeChange={setRange} /></Box>
      </Stack>
      <Box><Label>Dual / Day (range)</Label><Calendar mode="range" calendars={2} rangeValue={range2} onRangeChange={setRange2} showFooter /></Box>
    </Stack>
  );
}
