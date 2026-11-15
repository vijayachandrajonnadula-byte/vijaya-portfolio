// Implements Figma page "Date Picker": Calendar (Single/Dual x Day/Month/Year/Quarter), .Building Blocks/Calendar Header,
// Body, Calendar Cell, Calendar Footer and Event Badge.
import { useCallback, useEffect, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { Button } from '../../actions/Button/Button';
import { IconButton } from '../../actions/IconButton/IconButton';
import { focusRing, disabledOpacity, pt, textStyle } from '../../../theme/pulseTokens';

const dp = pt.uiElements.datePicker.color;

export type CalendarView = 'day' | 'month' | 'year' | 'quarter';
export type CalendarRange = [Dayjs | null, Dayjs | null];

export interface CalendarProps {
  /** "single" picks one date, "range" picks a start and an end. @default "single" */
  mode?: 'single' | 'range';
  value?: Dayjs | null;
  rangeValue?: CalendarRange;
  onChange?: (value: Dayjs) => void;
  onRangeChange?: (value: CalendarRange) => void;
  /** What a pick selects: a day, or a whole month / year / quarter (starts in that view). @default "day" */
  granularity?: CalendarView;
  /** Controlled view. @default granularity (uncontrolled) */
  view?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  /** Month displayed (first calendar). Initial month unless onMonthChange is also given (then controlled). */
  month?: Dayjs;
  onMonthChange?: (month: Dayjs) => void;
  /** Two side-by-side months (Figma "Dual"). @default 1 */
  calendars?: 1 | 2;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disabledDate?: (d: Dayjs) => boolean;
  /** Event dots (max 3) under a day: return Pulse badge colours, e.g. ['#eab308', '#22c55e']. */
  eventColors?: (d: Dayjs) => string[] | undefined;
  /** Show the footer (Today / Cancel / OK). */
  showFooter?: boolean;
  onToday?: () => void;
  onCancel?: () => void;
  onOk?: () => void;
  /** Extra footer content shown instead of the default buttons (e.g. the time picker "Now"). */
  footer?: ReactNode;
  /** Render without its own shadow/background (when nested inside a popper that already has them). */
  bare?: boolean;
}

const CELL = 40;
const sameDay = (a: Dayjs | null | undefined, b: Dayjs | null | undefined) => !!a && !!b && a.isSame(b, 'day');

interface CellProps {
  label: ReactNode;
  width?: number;
  selected?: boolean;
  today?: boolean;
  outside?: boolean;
  disabled?: boolean;
  rangeStart?: boolean;
  rangeEnd?: boolean;
  inRange?: boolean;
  tabIndex?: number;
  events?: string[];
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  onFocus?: () => void;
  'data-date'?: string;
  'aria-label'?: string;
}

/** .Building Blocks/Calendar Cell: 40x40 outer (4px padding), 32x32 inner, radius 4. */
export function CalendarCell({ label, width = CELL, selected, today, outside, disabled, rangeStart, rangeEnd, inRange, tabIndex, events, onClick, onKeyDown, onFocus, ...rest }: CellProps) {
  const band = inRange || rangeStart || rangeEnd;
  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height: CELL,
        p: '4px',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '&::before': band
          ? {
              content: '""',
              position: 'absolute',
              top: 4,
              height: 32,
              bgcolor: dp.cellRangeBG,
              left: rangeStart && !rangeEnd ? '50%' : 0,
              right: rangeEnd && !rangeStart ? '50%' : 0,
            }
          : undefined,
      }}
    >
      <Box
        component="button"
        type="button"
        disabled={disabled}
        tabIndex={tabIndex}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        aria-pressed={selected || undefined}
        aria-current={today ? 'date' : undefined}
        {...rest}
        sx={{
          ...textStyle('textL'),
          position: 'relative',
          zIndex: 1,
          width: width === CELL ? 32 : width - 8,
          height: 32,
          p: 0,
          border: today && !selected ? `${pt.uiElements.datePicker.border.s} solid ${dp.cellTodayBorder}` : 0,
          borderRadius: pt.uiElements.datePicker.radius.s,
          bgcolor: selected ? dp.cellSelectedBG : 'transparent',
          color: selected ? dp.cellSelectedFont : outside ? dp.outsideMonthFont : 'text.primary',
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? disabledOpacity : 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          font: 'inherit',
          '&:hover:not(:disabled)': { bgcolor: selected ? dp.cellSelectedHoverBG : dp.cellHover },
          '&:focus-visible': { outline: 'none', boxShadow: focusRing },
        }}
      >
        {label}
      </Box>
      {events && events.length > 0 && (
        <Box sx={{ position: 'absolute', bottom: 1, left: '50%', transform: 'translateX(-50%)', display: 'flex', zIndex: 2 }} aria-hidden>
          {events.slice(0, 3).map((c, i) => (
            <Box key={i} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: c, ml: i ? '-2px' : 0 }} />
          ))}
        </Box>
      )}
    </Box>
  );
}

/** .Building Blocks/Calendar Header. */
function Header({ onPrev, onNext, children, showPrev = true, showNext = true, prevLabel, nextLabel }: { onPrev: () => void; onNext: () => void; children: ReactNode; showPrev?: boolean; showNext?: boolean; prevLabel: string; nextLabel: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 40, py: '4px', boxSizing: 'border-box', width: 280 }}>
      <Box sx={{ width: 32, height: 32 }}>
        {showPrev && (
          <IconButton ariaLabel={prevLabel} size="small" onClick={onPrev}>
            <ChevronLeftRounded fontSize="small" />
          </IconButton>
        )}
      </Box>
      {children}
      <Box sx={{ width: 32, height: 32 }}>
        {showNext && (
          <IconButton ariaLabel={nextLabel} size="small" onClick={onNext}>
            <ChevronRightRounded fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Calendar (Date Picker page): single/dual, day/month/year/quarter views, single or range selection. */
export function Calendar({
  mode = 'single',
  value,
  rangeValue,
  onChange,
  onRangeChange,
  granularity = 'day',
  view: viewProp,
  onViewChange,
  month: monthProp,
  onMonthChange,
  calendars = 1,
  minDate,
  maxDate,
  disabledDate,
  eventColors,
  showFooter,
  onToday,
  onCancel,
  onOk,
  footer,
  bare,
}: CalendarProps) {
  const [viewState, setViewState] = useState<CalendarView>(granularity);
  const view = viewProp ?? viewState;
  const setView = (v: CalendarView) => {
    setViewState(v);
    onViewChange?.(v);
  };
  const anchor = mode === 'range' ? rangeValue?.[0] ?? null : value ?? null;
  const [monthState, setMonthState] = useState<Dayjs>(() => (monthProp ?? anchor ?? dayjs()).startOf('month'));
  const month = (onMonthChange && monthProp ? monthProp : monthState).startOf('month');
  const setMonth = useCallback(
    (m: Dayjs) => {
      setMonthState(m.startOf('month'));
      onMonthChange?.(m.startOf('month'));
    },
    [onMonthChange],
  );
  const [hover, setHover] = useState<Dayjs | null>(null);
  const [focusDate, setFocusDate] = useState<Dayjs>(() => anchor ?? dayjs());
  const [yearBase, setYearBase] = useState(() => Math.floor(month.year() / 12) * 12);
  useEffect(() => {
    if (view === 'year') setYearBase(Math.floor(month.year() / 12) * 12);
  }, [view, month]);

  const isDisabled = (d: Dayjs) => !!(disabledDate?.(d) || (minDate && d.isBefore(minDate, 'day')) || (maxDate && d.isAfter(maxDate, 'day')));

  const pickDay = (d: Dayjs) => {
    if (mode === 'single') {
      onChange?.(d);
      return;
    }
    const [s, e] = rangeValue ?? [null, null];
    if (!s || (s && e)) onRangeChange?.([d, null]);
    else if (d.isBefore(s, 'day')) onRangeChange?.([d, null]);
    else onRangeChange?.([s, d]);
  };

  const rangeEdges = (): CalendarRange => {
    const [s, e] = rangeValue ?? [null, null];
    if (s && !e && hover && hover.isAfter(s, 'day')) return [s, hover];
    return [s, e];
  };

  const onGridKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    const dd = delta[e.key];
    if (dd === undefined) return;
    e.preventDefault();
    const next = focusDate.add(dd, 'day');
    setFocusDate(next);
    if (!next.isSame(month, 'month') && !(calendars === 2 && next.isSame(month.add(1, 'month'), 'month'))) setMonth(next);
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-date="${next.format('YYYY-MM-DD')}"]`)?.focus());
  };

  const dayGrid = (m: Dayjs, isFirst: boolean, isLast: boolean) => {
    const start = m.startOf('month');
    const lead = start.day();
    const [rs, re] = rangeEdges();
    const cells: ReactNode[] = [];
    for (let i = 0; i < 42; i++) {
      const d = start.add(i - lead, 'day');
      const outside = !d.isSame(m, 'month');
      if (outside) {
        // Figma shows overflow days in a lighter colour (calendars=2 keeps the grid clean).
        if (calendars === 2) {
          cells.push(<Box key={i} sx={{ width: CELL, height: CELL }} />);
          continue;
        }
      }
      const isSel = mode === 'single' ? sameDay(d, value) : sameDay(d, rs) || sameDay(d, re);
      const isStart = mode === 'range' && sameDay(d, rs);
      const isEnd = mode === 'range' && sameDay(d, re);
      const inRange = mode === 'range' && !!rs && !!re && d.isAfter(rs, 'day') && d.isBefore(re, 'day');
      const sameDayRange = isStart && isEnd;
      cells.push(
        <CalendarCell
          key={i}
          label={d.date()}
          outside={outside}
          selected={isSel}
          today={sameDay(d, dayjs())}
          disabled={isDisabled(d)}
          rangeStart={isStart && !sameDayRange}
          rangeEnd={isEnd && !sameDayRange}
          inRange={inRange}
          events={eventColors?.(d)}
          tabIndex={sameDay(d, focusDate) ? 0 : -1}
          data-date={d.format('YYYY-MM-DD')}
          aria-label={d.format('dddd, D MMMM YYYY')}
          onClick={() => {
            pickDay(d);
            setFocusDate(d);
            if (outside) setMonth(d);
          }}
          onFocus={() => setFocusDate(d)}
          onKeyDown={onGridKey}
        />,
      );
    }
    return (
      <Box key={m.format('YYYY-MM')} sx={{ width: 280 }} onMouseLeave={() => setHover(null)}>
        <Header
          onPrev={() => setMonth(month.subtract(1, 'month'))}
          onNext={() => setMonth(month.add(1, 'month'))}
          showPrev={isFirst}
          showNext={isLast}
          prevLabel="Previous month"
          nextLabel="Next month"
        >
          <ButtonGroup variant="outlined" size="small" aria-label="Choose month or year">
            <Button variant="outlined" size="small" onClick={() => setView('month')}>
              {m.format('MMM')}
            </Button>
            <Button variant="outlined" size="small" onClick={() => setView('year')}>
              {m.format('YYYY')}
            </Button>
          </ButtonGroup>
        </Header>
        <Box role="grid" aria-label={m.format('MMMM YYYY')}>
          <Box role="row" sx={{ display: 'flex', justifyContent: 'space-evenly', height: CELL }}>
            {WEEKDAYS.map((w, i) => (
              <Box key={i} role="columnheader" sx={{ ...textStyle('textL'), width: CELL, height: CELL, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dp.weekDayLabel }}>
                {w}
              </Box>
            ))}
          </Box>
          <Box
            sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', width: 280 }}
            onMouseOver={(e) => {
              const t = (e.target as HTMLElement).closest<HTMLElement>('[data-date]');
              if (t?.dataset.date && mode === 'range') setHover(dayjs(t.dataset.date));
            }}
          >
            {cells}
          </Box>
        </Box>
      </Box>
    );
  };

  const monthView = (
    <Box sx={{ width: 280 }}>
      <Header onPrev={() => setMonth(month.subtract(1, 'year'))} onNext={() => setMonth(month.add(1, 'year'))} prevLabel="Previous year" nextLabel="Next year">
        <Button variant="outlined" size="small" onClick={() => setView('year')}>
          {month.format('YYYY')}
        </Button>
      </Header>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: '16px', rowGap: 0, width: 280, height: 240, alignContent: 'flex-start' }}>
        {MONTHS.map((label, i) => {
          const m = month.month(i);
          const cur = m.isSame(dayjs(), 'month');
          const selMonth = mode === 'single' ? !!value && value.isSame(m, 'month') : !!rangeValue?.[0] && rangeValue[0].isSame(m, 'month');
          return (
            <CalendarCell
              key={label}
              label={label}
              width={64}
              today={cur}
              selected={selMonth}
              onClick={() => {
                setMonth(m);
                if (granularity === 'month') onChange?.(m);
                else setView('day');
              }}
            />
          );
        })}
      </Box>
    </Box>
  );

  const yearView = (
    <Box sx={{ width: 280 }}>
      <Header onPrev={() => setYearBase(yearBase - 12)} onNext={() => setYearBase(yearBase + 12)} prevLabel="Previous years" nextLabel="Next years">
        <Box sx={{ ...textStyle('textL', 'medium'), color: 'text.primary' }}>
          {yearBase} - {yearBase + 11}
        </Box>
      </Header>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: 280, height: 240, alignContent: 'flex-start' }}>
        {Array.from({ length: 12 }, (_, i) => yearBase + i).map((y) => (
          <CalendarCell
            key={y}
            label={y}
            width={70}
            today={y === dayjs().year()}
            selected={mode === 'single' ? value?.year() === y : rangeValue?.[0]?.year() === y}
            onClick={() => {
              setMonth(month.year(y));
              if (granularity === 'year') onChange?.(month.year(y));
              else setView(granularity === 'quarter' ? 'quarter' : granularity === 'month' ? 'month' : 'day');
            }}
          />
        ))}
      </Box>
    </Box>
  );

  const quarterView = (
    <Box sx={{ width: 280 }}>
      <Header onPrev={() => setMonth(month.subtract(1, 'year'))} onNext={() => setMonth(month.add(1, 'year'))} prevLabel="Previous year" nextLabel="Next year">
        <Button variant="outlined" size="small" onClick={() => setView('year')}>
          {month.format('YYYY')}
        </Button>
      </Header>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: '8px', width: 280, alignContent: 'flex-start', pt: '8px' }}>
        {[0, 1, 2, 3].map((q) => {
          const start = month.month(q * 3);
          return (
            <CalendarCell
              key={q}
              label={`Q${q + 1}`}
              width={64}
              today={dayjs().isSame(start, 'year') && Math.floor(dayjs().month() / 3) === q}
              selected={!!value && value.isSame(start, 'year') && Math.floor(value.month() / 3) === q}
              onClick={() => onChange?.(start.startOf('month'))}
            />
          );
        })}
      </Box>
    </Box>
  );

  const body = (() => {
    if (view === 'month') return monthView;
    if (view === 'year') return yearView;
    if (view === 'quarter') return quarterView;
    return (
      <Box sx={{ display: 'flex', gap: '8px' }}>
        {dayGrid(month, true, calendars === 1)}
        {calendars === 2 && (
          <>
            <Box sx={{ width: '1px', bgcolor: 'divider', alignSelf: 'stretch' }} />
            {dayGrid(month.add(1, 'month'), false, true)}
          </>
        )}
      </Box>
    );
  })();

  return (
    <Box
      data-spec="calendar"
      sx={{
        display: 'inline-flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        p: bare ? 0 : '8px',
        borderRadius: pt.uiElements.datePicker.radius.m,
        bgcolor: bare ? 'transparent' : 'background.paper',
        boxShadow: bare ? 'none' : '0px 2px 8px 0px rgba(0,0,0,0.2)',
      }}
    >
      {body}
      {showFooter && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 40, p: '8px', boxSizing: 'border-box', borderTop: 1, borderColor: 'divider', mt: '8px' }}>
          {footer ?? (
            <>
              <Button variant="text" size="small" onClick={onToday}>
                Today
              </Button>
              <Box sx={{ display: 'flex' }}>
                <Button variant="text" size="small" onClick={onCancel}>
                  Cancel
                </Button>
                <Button variant="text" size="small" onClick={onOk}>
                  OK
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}




