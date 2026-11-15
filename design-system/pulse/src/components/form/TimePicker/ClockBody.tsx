// Implements Figma "Time Picker" > .Building Blocks/Clock Body (Size = Short 180px | Tall 304px): scrolling H / M / (S) / AM-PM columns of 40px cells.
import { scrollBarSx } from '../../data-display/ScrollBar/ScrollBar';
import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import type { Dayjs } from 'dayjs';
import { CalendarCell } from '../Calendar/Calendar';

export interface ClockBodyProps {
  value: Dayjs;
  onChange: (value: Dayjs) => void;
  /** Short is 180px high, tall is 304px (Figma). @default "short" */
  size?: 'short' | 'tall';
  /** 12-hour columns with AM/PM. @default true */
  use12h?: boolean;
  /** Seconds column (Figma shows H / M / S / AM-PM, 224px). @default true */
  showSeconds?: boolean;
  /** Minute step. @default 1 */
  minuteStep?: number;
  /** Override height in px (e.g. to fit a taller panel). */
  height?: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

function Column({ items, selected, onPick, label, height }: { items: { label: string; value: number }[]; selected: number; onPick: (v: number) => void; label: string; height: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (el && ref.current) ref.current.scrollTop = Math.max(0, el.offsetTop - ref.current.clientHeight / 2 + 20);
  }, [selected]);
  return (
    <Box
      ref={ref}
      role="listbox"
      aria-label={label}
      sx={{ width: 56, height, boxSizing: 'border-box', p: '8px', position: 'relative', overflowY: 'auto', flexShrink: 0, ...(scrollBarSx('light') as object) }}
    >
      {items.map((it) => (
        <Box key={it.value} role="option" aria-selected={it.value === selected} sx={{ ml: '-4px' }}>
          <CalendarCell label={it.label} selected={it.value === selected} onClick={() => onPick(it.value)} />
        </Box>
      ))}
    </Box>
  );
}

export function ClockBody({ value, onChange, size = 'short', use12h = true, showSeconds = true, minuteStep = 1, height }: ClockBodyProps) {
  const h = height ?? (size === 'tall' ? 304 : 180);
  const hour24 = value.hour();
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const isPm = hour24 >= 12;
  const hours = use12h ? Array.from({ length: 12 }, (_, i) => ({ label: pad(i + 1), value: i + 1 })) : Array.from({ length: 24 }, (_, i) => ({ label: pad(i), value: i }));
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => ({ label: pad(i * minuteStep), value: i * minuteStep }));
  const seconds = Array.from({ length: 60 }, (_, i) => ({ label: pad(i), value: i }));
  const divider = <Box aria-hidden sx={{ width: 0, alignSelf: 'stretch', position: 'relative', '&::after': { content: '""', position: 'absolute', top: 0, bottom: 0, left: 0, width: '1px', bgcolor: 'divider' } }} />;
  return (
    <Box data-spec="clock-body" sx={{ display: 'flex', height: h }}>
      <Column
        label="Hours"
        height={h}
        items={hours}
        selected={use12h ? hour12 : hour24}
        onPick={(v) => onChange(value.hour(use12h ? (v % 12) + (isPm ? 12 : 0) : v))}
      />
      {divider}
      <Column label="Minutes" height={h} items={minutes} selected={value.minute() - (value.minute() % minuteStep)} onPick={(v) => onChange(value.minute(v))} />
      {showSeconds && (
        <>
          {divider}
          <Column label="Seconds" height={h} items={seconds} selected={value.second()} onPick={(v) => onChange(value.second(v))} />
        </>
      )}
      {use12h && (
        <>
          {divider}
          <Column
            label="AM or PM"
            height={h}
            items={[
              { label: 'AM', value: 0 },
              { label: 'PM', value: 1 },
            ]}
            selected={isPm ? 1 : 0}
            onPick={(v) => onChange(value.hour((hour24 % 12) + (v ? 12 : 0)))}
          />
        </>
      )}
    </Box>
  );
}
