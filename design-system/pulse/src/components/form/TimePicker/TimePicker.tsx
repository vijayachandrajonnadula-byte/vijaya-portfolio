// Implements Figma page "Time Picker": TimePicker (Label Position Top | Left) + Time Picker Body (Clock Body + "Now" footer).
import { useState } from 'react';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { Button } from '../../actions/Button/Button';
import { PickerField, parseStrict } from '../DatePicker/PickerField';
import type { PickerFieldBaseProps } from '../DatePicker/PickerField';
import { ClockBody } from './ClockBody';

export type TimeInput = Dayjs | Date | string | null | undefined;
const toTime = (v: TimeInput): Dayjs | null => {
  if (v == null || v === '') return null;
  if (typeof v === 'string' && /^\d{1,2}:\d{2}/.test(v)) {
    const d = dayjs(`2000-01-01 ${v}`);
    return d.isValid() ? d : null;
  }
  const d = dayjs(v);
  return d.isValid() ? d : null;
};

export interface TimePickerProps extends PickerFieldBaseProps {
  value?: TimeInput;
  defaultValue?: TimeInput;
  onChange?: (value: Dayjs | null) => void;
  /** 12-hour clock with AM/PM. @default true */
  use12h?: boolean;
  /** @default true (Figma clock body has an S column) */
  showSeconds?: boolean;
  minuteStep?: number;
  /** Clock body height. @default "short" */
  panelSize?: 'short' | 'tall';
  /** Text format. Defaults to "hh:mm A" / "HH:mm" (+ ":ss"). */
  format?: string;
}

export function TimePicker({ value, defaultValue, onChange, use12h = true, showSeconds = true, minuteStep, panelSize = 'short', format, ...field }: TimePickerProps) {
  const fmt = format ?? `${use12h ? 'hh' : 'HH'}:mm${showSeconds ? ':ss' : ''}${use12h ? ' A' : ''}`;
  const [inner, setInner] = useState<Dayjs | null>(toTime(defaultValue));
  const controlled = value !== undefined;
  const current = controlled ? toTime(value) : inner;
  const commit = (d: Dayjs | null) => {
    if (!controlled) setInner(d);
    onChange?.(d);
  };
  const shown = current ?? dayjs().startOf('day').hour(12);

  return (
    <PickerField
      {...field}
      text={current ? current.format(fmt) : ''}
      icon={<AccessTimeRounded sx={{ fontSize: 16 }} />}
      popupLabel="Choose time"
      placeholder={field.placeholder ?? fmt.toLowerCase().replace(/ a$/, ' AM')}
      onTextCommit={(t) => {
        if (t === '') return commit(null);
        const d = parseStrict(t, fmt);
        if (d) commit(d);
      }}
      onClear={() => commit(null)}
    >
      {(close) => <TimePickerBody value={shown} onChange={commit} onNow={() => commit(dayjs())} onClose={close} use12h={use12h} showSeconds={showSeconds} minuteStep={minuteStep} size={panelSize} />}
    </PickerField>
  );
}

export interface TimePickerBodyProps {
  value: Dayjs;
  onChange: (v: Dayjs) => void;
  onNow?: () => void;
  onClose?: () => void;
  use12h?: boolean;
  /** @default true (Figma clock body has an S column) */
  showSeconds?: boolean;
  minuteStep?: number;
  size?: 'short' | 'tall';
}

/** Figma "Time Picker Body": 224px wide, 8px radius, clock columns plus a footer. */
export function TimePickerBody({ value, onChange, onNow, onClose, use12h, showSeconds, minuteStep, size = 'short' }: TimePickerBodyProps) {
  return (
    <Box data-spec="time-picker-body" sx={{ display: 'inline-flex', flexDirection: 'column', bgcolor: 'background.paper', borderRadius: '8px' }}>
      <ClockBody value={value} onChange={onChange} use12h={use12h} showSeconds={showSeconds} minuteStep={minuteStep} size={size} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 40, p: '8px', boxSizing: 'border-box', borderTop: 1, borderColor: 'divider' }}>
        <Button variant="text" size="small" onClick={onNow}>
          Now
        </Button>
        <Button variant="text" size="small" onClick={onClose}>
          OK
        </Button>
      </Box>
    </Box>
  );
}
