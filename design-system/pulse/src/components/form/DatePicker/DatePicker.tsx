// Implements Figma page "Date Picker": DatePicker (Label Position Top | Left) + Calendar popper; DateRangePicker uses the Dual calendar.
import { useState } from 'react';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Calendar } from '../Calendar/Calendar';
import type { CalendarProps, CalendarRange, CalendarView } from '../Calendar/Calendar';
import { PickerField, parseStrict, toDayjs } from './PickerField';
import type { DateInput, PickerFieldBaseProps } from './PickerField';

export type { DateInput };

const defaultFormat: Record<CalendarView, string> = { day: 'DD/MM/YYYY', month: 'MMM YYYY', year: 'YYYY', quarter: '[Q]Q YYYY' };

export interface DatePickerProps extends PickerFieldBaseProps {
  value?: DateInput;
  defaultValue?: DateInput;
  onChange?: (value: Dayjs | null) => void;
  /** Output/input text format (dayjs tokens). @default "DD/MM/YYYY" */
  format?: string;
  /** Pick a day, month, year or quarter. @default "day" */
  picker?: CalendarView;
  minDate?: DateInput;
  maxDate?: DateInput;
  disabledDate?: CalendarProps['disabledDate'];
  eventColors?: CalendarProps['eventColors'];
  /** Footer with Today / Cancel / OK (selection is then confirmed with OK). @default false */
  showFooter?: boolean;
}

/** Date field with a calendar popper. */
export function DatePicker({ value, defaultValue, onChange, format, picker = 'day', minDate, maxDate, disabledDate, eventColors, showFooter = false, ...field }: DatePickerProps) {
  const fmt = format ?? defaultFormat[picker];
  const [inner, setInner] = useState<Dayjs | null>(toDayjs(defaultValue));
  const controlled = value !== undefined;
  const current = controlled ? toDayjs(value) : inner;
  const [pending, setPending] = useState<Dayjs | null>(null);
  const commit = (d: Dayjs | null) => {
    if (!controlled) setInner(d);
    onChange?.(d);
  };
  const shown = pending ?? current;

  return (
    <PickerField
      {...field}
      text={current ? current.format(fmt) : ''}
      icon={<CalendarMonthOutlined sx={{ fontSize: 16 }} />}
      popupLabel="Choose date"
      onTextCommit={(t) => {
        if (t === '') return commit(null);
        const d = parseStrict(t, fmt);
        if (d) commit(d);
      }}
      onClear={() => commit(null)}
      onDismiss={() => setPending(null)}
    >
      {(close) => (
        <Calendar
          bare
          granularity={picker}
          value={shown}
          month={shown ?? undefined}
          minDate={minDate ? dayjs(minDate) : undefined}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          disabledDate={disabledDate}
          eventColors={eventColors}
          showFooter={showFooter}
          onChange={(d) => {
            if (showFooter) setPending(d);
            else {
              commit(d);
              close();
            }
          }}
          onToday={() => setPending(dayjs())}
          onCancel={() => {
            setPending(null);
            close();
          }}
          onOk={() => {
            if (pending) commit(pending);
            setPending(null);
            close();
          }}
        />
      )}
    </PickerField>
  );
}

export interface DateRangePickerProps extends PickerFieldBaseProps {
  value?: [DateInput, DateInput];
  defaultValue?: [DateInput, DateInput];
  onChange?: (value: [Dayjs | null, Dayjs | null]) => void;
  /** @default "DD/MM/YYYY" */
  format?: string;
  /** Months shown side by side (Figma "Dual"). @default 2 */
  calendars?: 1 | 2;
  minDate?: DateInput;
  maxDate?: DateInput;
  showFooter?: boolean;
}

/** Start/end date field with a (dual) calendar popper and range highlight. */
export function DateRangePicker({ value, defaultValue, onChange, format = 'DD/MM/YYYY', calendars = 2, minDate, maxDate, showFooter = false, ...field }: DateRangePickerProps) {
  const [inner, setInner] = useState<CalendarRange>([toDayjs(defaultValue?.[0]), toDayjs(defaultValue?.[1])]);
  const controlled = value !== undefined;
  const current: CalendarRange = controlled ? [toDayjs(value[0]), toDayjs(value[1])] : inner;
  const [pending, setPending] = useState<CalendarRange | null>(null);
  const commit = (r: CalendarRange) => {
    if (!controlled) setInner(r);
    onChange?.(r);
  };
  const text = current[0] ? `${current[0].format(format)} - ${current[1] ? current[1].format(format) : ''}` : '';

  return (
    <PickerField
      {...field}
      text={text}
      icon={<CalendarMonthOutlined sx={{ fontSize: 16 }} />}
      popupLabel="Choose date range"
      placeholder={field.placeholder ?? `${format} - ${format}`}
      onTextCommit={(t) => {
        if (t === '') return commit([null, null]);
        const parts = t.split(/\s*[-–]\s*/);
        const a = parseStrict(parts[0] ?? '', format);
        const b = parseStrict(parts[1] ?? '', format);
        if (a && b && !b.isBefore(a)) commit([a, b]);
      }}
      onClear={() => commit([null, null])}
      onDismiss={() => setPending(null)}
    >
      {(close) => (
        <Calendar
          bare
          mode="range"
          calendars={calendars}
          rangeValue={pending ?? current}
          month={(pending ?? current)[0] ?? undefined}
          minDate={minDate ? dayjs(minDate) : undefined}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          showFooter={showFooter}
          onRangeChange={(r) => {
            if (showFooter) setPending(r);
            else {
              commit(r);
              if (r[1]) close();
            }
          }}
          onCancel={() => {
            setPending(null);
            close();
          }}
          onToday={() => setPending([dayjs(), dayjs()])}
          onOk={() => {
            if (pending) commit(pending);
            setPending(null);
            close();
          }}
        />
      )}
    </PickerField>
  );
}
