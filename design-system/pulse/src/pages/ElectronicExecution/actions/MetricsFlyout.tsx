import { useState } from 'react';
import type { ReactNode } from 'react';
import { Box } from '../../../components/mui';
import { Flyout } from '../../../components/feedback/Flyout/Flyout';

import { Select } from '../../../components/form/Select/Select';
import { ChartColumnIcon } from '../../../icons';
import { actRef, fonts, ref } from '../refTheme';
import { stepsInTable, useExecution } from '../store';
import type { ExecState, Step } from '../model';
import { ui } from '../ui';
import { W, focusRing, tx, wsTable } from './parts';
import { RefButton } from '../shell/RefControls';

const OPEN = new Set(['underAssessment', 'pendingReview']);

interface M {
  rows: number;
  executed: number;
  pass: number;
  fail: number;
  failNoDisc: number;
  totalDisc: number;
  openDisc: number;
  closedDisc: number;
  na: number;
  noResult: number;
  pending: number;
  rate: number;
}

/** Counts for a set of steps, from the live state. Executed = recorded. */
function measure(s: ExecState, steps: Step[]): M {
  const rec = steps.filter((x) => x.state === 'recorded');
  const fails = rec.filter((x) => x.verdict === 'fail');
  const discOf = (id: string) => s.discrepancies.filter((d) => d.stepId === id);
  const all = steps.flatMap((x) => discOf(x.id));
  return {
    rows: steps.length,
    executed: rec.length,
    pass: rec.filter((x) => x.verdict === 'pass').length,
    fail: fails.length,
    failNoDisc: fails.filter((x) => discOf(x.id).length === 0).length,
    totalDisc: all.length,
    openDisc: all.filter((d) => OPEN.has(d.status)).length,
    closedDisc: all.filter((d) => !OPEN.has(d.status)).length,
    na: rec.filter((x) => x.verdict === 'na').length,
    noResult: rec.filter((x) => x.verdict === null).length,
    pending: steps.length - rec.length,
    rate: steps.length ? Math.round((rec.length / steps.length) * 100) : 0,
  };
}

const tableState = (s: ExecState, n: number): 'pending' | 'wip' | 'completed' => {
  const st = stepsInTable(s, n);
  const rec = st.filter((x) => x.state === 'recorded').length;
  if (st.length > 0 && rec === st.length) return 'completed';
  return rec === 0 && st.every((x) => x.state === 'pending') ? 'pending' : 'wip';
};

interface Item {
  label: string;
  value: number;
  color: string;
}

function LegendRow({ it }: { it: Item }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Box aria-hidden sx={{ width: 10, height: 10, borderRadius: '50%', background: it.color, flexShrink: 0 }} />
      <Box component="span" sx={{ flex: 1, minWidth: 0, ...tx(11.5, W.regular, ref.muted, 16.675) }}>{it.label}</Box>
      <Box component="span" sx={{ width: 34, textAlign: 'right', ...tx(11.5, W.strong, ref.ink, 16.675) }}>{it.value}</Box>
    </Box>
  );
}

/** Small vertical bars with a caption (reference chart cards). Bars scale to the largest value. */
function MiniBars({ items, caption, w = 120, h = 120 }: { items: Item[]; caption: string; w?: number; h?: number }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <Box role="img" aria-label={`${caption}: ${items.map((i) => `${i.label} ${i.value}`).join(', ')}`} sx={{ width: w, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ height: h, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '12px', borderBottom: `1px solid ${ref.line}` }}>
        {items.map((i) => (
          <Box key={i.label} sx={{ width: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
            <Box component="span" sx={tx(9, W.regular, i.color, 12)}>{i.value}</Box>
            <Box sx={{ width: 18, height: Math.max(2, Math.round((i.value / max) * (h - 16))), background: i.color, borderRadius: '2px 2px 0 0' }} />
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: '4px', ...tx(9, W.regular, ref.muted, 12) }}>{caption}</Box>
    </Box>
  );
}

/** Donut of the same numbers (ring 14px). An all-zero set draws a grey ring. */
function MiniDonut({ items, caption }: { items: Item[]; caption: string }) {
  const total = items.reduce((a, b) => a + b.value, 0);
  const r = 43;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <Box component="svg" viewBox="0 0 120 120" width={96} height={96} role="img" aria-label={`${caption}: ${items.map((i) => `${i.label} ${i.value}`).join(', ')}`} sx={{ display: 'block', flexShrink: 0 }}>
      <circle cx="60" cy="60" r={r} fill="none" stroke={ref.tint2} strokeWidth="14" />
      {total > 0 && items.map((i) => {
        const len = (i.value / total) * c;
        const el = i.value > 0 ? <circle key={i.label} cx="60" cy="60" r={r} fill="none" stroke={i.color} strokeWidth="14" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-acc} transform="rotate(-90 60 60)" /> : null;
        acc += len;
        return el;
      })}
      <text x="60" y="66" textAnchor="middle" fontSize="20" fontWeight={W.strong} fill={ref.ink}>{total}</text>
    </Box>
  );
}
function ChartCard({ title, items, caption, donut, extra }: { title: string; items: Item[]; caption: string; donut: boolean; extra?: ReactNode }) {
  return (
    <Box data-spec="chart-card" sx={{ p: '14px', border: `1px solid ${ref.line}`, borderRadius: '10px', background: ref.white, boxSizing: 'border-box', minWidth: 0 }}>
      <Box sx={{ mb: '8px', ...tx(12, W.strong, ref.ink, 17.4) }}>{title}</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', minHeight: 160 }}>
        {donut ? (
          <Box sx={{ width: 120, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
            <MiniDonut items={items} caption={caption} />
          </Box>
        ) : (
          <MiniBars items={items} caption={caption} />
        )}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {extra}
          {items.map((i) => <LegendRow key={i.label} it={i} />)}
        </Box>
      </Box>
    </Box>
  );
}

/** Test Details: eight bars on a 0..max axis (angled labels) and the same numbers as a table. */
function TestBars({ items }: { items: Item[] }) {
  const W_ = 778;
  const H_ = 400;
  const left = 54;
  const top = 36;
  const base = 280;
  const max = Math.max(...items.map((i) => i.value));
  const topVal = Math.max(6, Math.round(max * 1.3));
  const ticks = Array.from({ length: 7 }, (_, k) => Math.round((topVal / 6) * k));
  const y = (v: number) => base - (v / topVal) * (base - top);
  const slot = (W_ - left - 12) / items.length;
  const bw = 49;
  return (
    <Box component="svg" viewBox={`0 0 ${W_} ${H_}`} role="img" aria-label="Test details bar chart" sx={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible', fontFamily: fonts.shell }}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={left} x2={W_ - 12} y1={y(t)} y2={y(t)} stroke={ref.line} />
          <text x={left - 8} y={y(t) + 4} textAnchor="end" fontSize="12" fill={ref.muted}>{t}</text>
        </g>
      ))}
      {items.map((it, i) => {
        const cx = left + slot * i + slot / 2;
        return (
          <g key={it.label}>
            <rect x={cx - bw / 2} y={y(it.value)} width={bw} height={Math.max(2, base - y(it.value))} fill={it.color} rx="2" />
            <text x={cx} y={y(it.value) - 6} textAnchor="middle" fontSize="12" fontWeight={W.strong} fill={ref.ink}>{it.value}</text>
            <text transform={`translate(${cx + 6} ${base + 14}) rotate(-45)`} textAnchor="end" fontSize="12" fill={ref.muted}>{it.label}</text>
          </g>
        );
      })}
    </Box>
  );
}

const TABS = ['Overall Metrics', 'Test Details', 'Table Details'] as const;

/** Metrics panel (860px): overall metrics, test details and per-table details, all computed from the live state. */
export default function MetricsFlyout() {
  const s = useExecution();
  const [tab, setTab] = useState(0);
  const [donut, setDonut] = useState(false);
  const [tableN, setTableN] = useState<number>(s.protocol.tables[0]?.n ?? 1);
  const close = () => ui.close('metrics');
  const all = Object.values(s.protocol.steps);
  const total = measure(s, all);
  const states = s.protocol.tables.map((t) => ({ t, st: tableState(s, t.n) }));
  const ofState = (k: 'pending' | 'wip' | 'completed') => states.filter((x) => x.st === k);
  const tableFlags = (k: 'wip' | 'completed') => {
    const ms = ofState(k).map((x) => measure(s, stepsInTable(s, x.t.n)));
    return [
      { label: `${k === 'wip' ? 'WIP' : 'Completed'} with Failure`, value: ms.filter((m) => m.fail > 0).length, color: actRef.metricFail },
      { label: `${k === 'wip' ? 'WIP' : 'Completed'} without Failure`, value: ms.filter((m) => m.fail === 0).length, color: actRef.metricWip },
      { label: `${k === 'wip' ? 'WIP' : 'Completed'} with Open Discrepancy`, value: ms.filter((m) => m.openDisc > 0).length, color: actRef.metricCyan },
      { label: `${k === 'wip' ? 'WIP' : 'Completed'} with Closed Discrepancy`, value: ms.filter((m) => m.closedDisc > 0).length, color: actRef.metricRows },
    ];
  };

  const test: Item[] = [
    { label: 'Total number of Tables', value: s.protocol.tables.length, color: actRef.metricTotal },
    { label: 'Total number of Rows', value: total.rows, color: actRef.metricRows },
    { label: 'Rows Executed', value: total.executed, color: actRef.metricExec },
    { label: 'Rows with Pass', value: total.pass, color: actRef.metricPass },
    { label: 'Rows with Failure', value: total.fail, color: actRef.metricFail },
    { label: 'Rows With NA', value: total.na, color: actRef.metricNa },
    { label: 'Rows Executed without Result', value: total.noResult, color: actRef.metricNoResult },
    { label: 'Pending Rows', value: total.pending, color: actRef.metricPend },
  ];

  const sel = s.protocol.tables.find((t) => t.n === tableN) ?? s.protocol.tables[0];
  const sm = sel ? measure(s, stepsInTable(s, sel.n)) : total;
  const detail: Item[] = [
    { label: 'Rows Executed', value: sm.executed, color: actRef.metricExec },
    { label: 'Rows with Pass', value: sm.pass, color: actRef.metricPass },
    { label: 'Rows with Failure', value: sm.fail, color: actRef.metricFail },
    { label: 'Failure without Discrepancy', value: sm.failNoDisc, color: actRef.metricFailNoDisc },
    { label: 'Total Discrepancy', value: sm.totalDisc, color: actRef.metricDisc },
    { label: 'Open Discrepancy', value: sm.openDisc, color: actRef.metricOpen },
    { label: 'Closed Discrepancy', value: sm.closedDisc, color: actRef.metricDisc },
    { label: 'Rows With NA', value: sm.na, color: actRef.metricNa },
    { label: 'Rows Executed without Result', value: sm.noResult, color: actRef.metricNoResult },
    { label: 'Pending Rows', value: sm.pending, color: actRef.metricPend },
  ];

  const cols: { label: string; key: keyof M; color: string }[] = [
    { label: 'Total number of Rows', key: 'rows', color: actRef.metricRows },
    { label: 'Rows Executed', key: 'executed', color: actRef.metricExec },
    { label: 'Rows with Pass', key: 'pass', color: actRef.metricPass },
    { label: 'Rows with Failure', key: 'fail', color: actRef.metricFail },
    { label: 'Failure without Discrepancy', key: 'failNoDisc', color: actRef.metricFailNoDisc },
    { label: 'Total Discrepancy', key: 'totalDisc', color: actRef.metricDisc },
    { label: 'Open Discrepancy', key: 'openDisc', color: actRef.metricOpen },
    { label: 'Closed Discrepancy', key: 'closedDisc', color: actRef.metricDisc },
    { label: 'Rows With NA', key: 'na', color: actRef.metricNa },
    { label: 'Rows Executed without Result', key: 'noResult', color: actRef.metricNoResult },
    { label: 'Pending Rows', key: 'pending', color: actRef.metricPend },
    { label: 'Execution Rate', key: 'rate', color: actRef.metricRate },
  ];

  const tabBar = (
    <Box data-spec="metrics-tabbar" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', p: '0 22px', m: '-18px -22px 16px', borderBottom: `1px solid ${ref.line}`, boxSizing: 'border-box' }}>
      <Box role="tablist" sx={{ display: 'flex', gap: '26px' }}>
        {TABS.map((label, i) => (
          <Box
            key={label}
            component="button"
            type="button"
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            sx={{ p: '13px 2px', m: '0 0 -1px', border: 0, borderBottom: `2px solid ${tab === i ? ref.blue3 : 'transparent'}`, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', ...tx(12.5, W.emphasis, tab === i ? ref.navy : ref.muted), '&:hover': { color: ref.blue3 }, ...focusRing }}
          >
            {label}
          </Box>
        ))}
      </Box>
      {tab === 0 && (
        <RefButton
          aria-label={donut ? 'Show bar charts' : 'Show donut charts'}
          aria-pressed={donut}
          title={donut ? 'Show bar charts' : 'Show donut charts'}
          onClick={() => setDonut((d) => !d)}
          sx={{ width: 28, height: 28, justifyContent: 'center', boxSizing: 'border-box', border: `1px solid ${ref.blue3}`, borderRadius: '6px', background: ref.tint, color: ref.blue3, ...focusRing }}
        >
          <ChartColumnIcon size={14} />
        </RefButton>
      )}
    </Box>
  );

  return (
    <Flyout open width={860} onClose={close} backdropOpacity={0.3} headerProps={{ title: 'Metrics' }}>
      {tabBar}
      <Box sx={{ mb: '12px', ...tx(14, W.strong, ref.blue3, 20.3) }}>{TABS[tab]}</Box>

      {tab === 0 && (
        <Box data-spec="charts-row" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <ChartCard
            title="Execution Metrics Document Level"
            donut={donut}
            caption={`Total Table: ${s.protocol.tables.length}`}
            items={[
              { label: 'Pending', value: ofState('pending').length, color: actRef.metricPending },
              { label: 'WIP', value: ofState('wip').length, color: actRef.metricWip },
              { label: 'Completed', value: ofState('completed').length, color: actRef.metricDone },
            ]}
          />
          <ChartCard
            title="Execution Metrics Discrepancy Level"
            donut={donut}
            caption={`Total Failures: ${total.fail}`}
            extra={<Box sx={{ mb: '1px', ...tx(11, W.regular, ref.muted, 15.95) }}>Total Failures: {total.fail}</Box>}
            items={[
              { label: 'Failure without Discrepancy', value: total.failNoDisc, color: actRef.metricFail },
              { label: 'Open Discrepancy', value: total.openDisc, color: actRef.metricWip },
              { label: 'Closed Discrepancy', value: total.closedDisc, color: actRef.metricRows },
            ]}
          />
          <ChartCard title="Completed Table" donut={donut} caption={`Completed Table: ${ofState('completed').length}`} items={tableFlags('completed')} />
          <ChartCard title="WIP Table" donut={donut} caption={`WIP Table: ${ofState('wip').length}`} items={tableFlags('wip')} />
        </Box>
      )}

      {tab === 1 && (
        <>
          <Box data-spec="chart-card" sx={{ p: '14px', border: `1px solid ${ref.line}`, borderRadius: '10px', background: ref.white, boxSizing: 'border-box', overflow: 'auto' }}>
            <TestBars items={test} />
          </Box>
          <Box component="table" sx={{ ...wsTable, mt: '14px' }}>
            <thead><tr><th>Metric</th><th style={{ width: 165, textAlign: 'center' }}>Value</th></tr></thead>
            <tbody>
              {test.map((i) => (
                <tr key={i.label}><td>{i.label}</td><Box component="td" sx={{ '&&': { textAlign: 'center', ...tx(11.5, W.strong, i.color, 16.675) } }}>{i.value}</Box></tr>
              ))}
            </tbody>
          </Box>
        </>
      )}

      {tab === 2 && (
        <>
          <Box sx={{ width: 300, mb: '14px' }}>
            <Select size="small" label="Table" options={s.protocol.tables.map((t) => ({ value: t.n, label: `${t.num} ${t.title} — Table ${t.n}` }))} value={sel?.n ?? ''} onChange={(v) => setTableN(Number(v))} hideClearIcon fullWidth />
          </Box>
          <Box sx={{ mb: '16px', width: 407.5, maxWidth: '100%' }}>
            <ChartCard title={sel ? `${sel.num} ${sel.title} — Table ${sel.n}` : ''} donut={false} caption={`Total Rows: ${sm.rows}`} items={detail} />
          </Box>
          <Box sx={{ overflowX: 'auto', border: `1px solid ${ref.line}`, borderRadius: '8px' }}>
            <Box component="table" data-spec="rot-table" sx={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%', minWidth: 760 }}>
              <thead>
                <tr>
                  <Box component="th" sx={{ p: '9px 14px', background: ref.tint2, borderBottom: `2px solid ${ref.line}`, verticalAlign: 'bottom', textAlign: 'center', ...tx(10, W.heavy, ref.ink, 10) }}><Box component="span" sx={{ display: 'inline-block' }}>Table Name</Box></Box>
                  {cols.map((c) => (
                    <Box component="th" key={c.key} sx={{ p: '9px 14px', width: 46, background: c.color, borderBottom: `2px solid ${ref.line}`, verticalAlign: 'bottom', textAlign: 'center' }}>
                      <Box component="span" sx={{ display: 'inline-block', writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: 106, ...tx(10, W.strong, ref.white, 10) }}>{c.label}</Box>
                    </Box>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.protocol.tables.map((t) => {
                  const m = measure(s, stepsInTable(s, t.n));
                  return (
                    <tr key={t.n}>
                      <Box component="td" sx={{ p: '9px 14px', ...tx(12, W.emphasis, ref.ink, 17.4) }}>{t.num} {t.title} — Table {t.n}</Box>
                      {cols.map((c) => (
                        <Box component="td" key={c.key} sx={{ p: '9px 14px', textAlign: 'center', ...tx(12, c.key === 'rate' ? W.strong : W.emphasis, c.key === 'rows' || c.key === 'executed' || c.key === 'pending' || c.key === 'rate' ? c.color : ref.ink, 17.4) }}>{c.key === 'rate' ? `${m.rate}%` : m[c.key]}</Box>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </Box>
          </Box>
        </>
      )}
    </Flyout>
  );
}
