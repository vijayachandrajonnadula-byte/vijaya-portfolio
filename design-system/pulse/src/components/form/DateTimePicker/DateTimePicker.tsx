// Implements Figma page "Date Time Picker": DateTimePicker (Label Position Top | Left) + DateTimePicker Body
// (month calendar | divider | Time panel on brand/25 | "Now" footer).
import { useState } from 'react';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { Button } from '../../actions/Button/Button';
import { Calendar } from '../Calendar/Calendar';
import { PickerField, parseStrict, toDayjs } from '../DatePicker/PickerField';
import type { DateInput, PickerFieldBaseProps } from '../DatePicker/PickerField';
import { ClockBody } from '../TimePicker/ClockBody';
import { pt, textStyle } from '../../../theme/pulseTokens';

export interface DateTimePickerProps extends PickerFieldBaseProps {
  value?: DateInput;
  defaultValue?: DateInput;
  onChange?: (value: Dayjs | null) => void;
  /** @default "DD/MM/YYYY hh:mm:ss A" */
  format?: string;
  use12h?: boolean;
  minDate?: DateInput;
  maxDate?: DateInput;
}

export function DateTimePicker({ value, defaultValue, onChange, format, use12h = true, minDate, maxDate, ...field }: DateTimePickerProps) {
  const fmt = format ?? (use12h ? 'DD/MM/YYYY hh:mm:ss A' : 'DD/MM/YYYY HH:mm:ss');
  const [inner, setInner] = useState<Dayjs | null>(toDayjs(defaultValue));
  const controlled = value !== undefined;
  const current = controlled ? toDayjs(value) : inner;
  const [draft, setDraft] = useState<Dayjs | null>(null);
  const shown = draft ?? current ?? dayjs().startOf('day').hour(12);
  const commit = (d: Dayjs | null) => {
    if (!controlled) setInner(d);
    onChange?.(d);
  };

  return (
    <PickerField
      {...field}
      text={current ? current.format(fmt) : ''}
      icon={<CalendarMonthOutlined sx={{ fontSize: 16 }} />}
      popupLabel="Choose date and time"
      placeholder={field.placeholder ?? fmt.replace('hh:mm:ss A', 'HH:MM:SS AM').replace('HH:mm:ss', 'HH:MM:SS')}
      onTextCommit={(t) => {
        if (t === '') return commit(null);
        const d = parseStrict(t, fmt);
        if (d) commit(d);
      }}
      onClear={() => commit(null)}
      onDismiss={() => setDraft(null)}
    >
      {(close) => (
        <Box data-spec="datetime-body" sx={{ width: 528, boxSizing: 'border-box', p: '8px', borderRadius: '8px', bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', height: 320 }}>
            <Box sx={{ width: 288, pr: '8px', boxSizing: 'border-box' }}>
              <Calendar
                bare
                value={shown}
                month={shown}
                minDate={minDate ? dayjs(minDate) : undefined}
                maxDate={maxDate ? dayjs(maxDate) : undefined}
                onChange={(d) => setDraft(d.hour(shown.hour()).minute(shown.minute()))}
              />
            </Box>
            <Box sx={{ width: '1px', bgcolor: 'divider' }} />
            <Box sx={{ width: 224, bgcolor: pt.colors.brand['25'], display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ ...textStyle('textL', 'medium'), height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Time</Box>
              <ClockBody value={shown} onChange={setDraft} use12h={use12h} height={280} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 40, p: '8px', boxSizing: 'border-box', borderTop: 1, borderColor: 'divider' }}>
            <Button variant="text" size="small" onClick={() => setDraft(dayjs())}>
              Now
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                commit(shown);
                setDraft(null);
                close();
              }}
            >
              OK
            </Button>
          </Box>
        </Box>
      )}
    </PickerField>
  );
}
