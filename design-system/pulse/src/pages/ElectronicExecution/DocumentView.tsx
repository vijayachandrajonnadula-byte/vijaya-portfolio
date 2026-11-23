import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Box } from '../../components/mui';
import { ref, docRef } from './refTheme';
import type { FitMode } from './refTheme';
import type { ExecState, ProtocolTable } from './model';
import { DocToolbar } from './document/DocToolbar';
import { WordPage } from './document/WordPage';
import { selectStepGuarded } from './ExecutionPanel';
import { executionStatus, isTableVerified, stepsInTable, useExecution } from './store';
import { ui, useUi } from './ui';

const isGated = (s: ExecState, t: ProtocolTable): boolean => s.options.gateTable2 && t.n >= 3 && !isTableVerified(s, 2);

/**
 * The document pane (reference .doc): toolbar, then a grey viewer with the 840px Word-style page. Document view shows the
 * whole page, Table view only the chosen table. Zoom is a CSS scale of the page in 10% steps; Fit changes the page width.
 * In the Panel layout cells are read-only text; in the Inline layout the result, evidence and P/F cells are editable.
 */
export default function DocumentView({ side }: { side?: ReactNode }) {
  const s = useExecution();
  const u = useUi();
  const spectator = s.mode === 'spectator';
  const inline = u.layout === 'inline';
  const status = executionStatus(s);
  const [fit, setFit] = useState<FitMode>('auto');

  const tableView = typeof u.tableFilter === 'number' ? u.tableFilter : null;
  const selected = s.selectedStepId;
  const selectedStep = selected ? s.protocol.steps[selected] : undefined;
  const curTable = tableView ?? selectedStep?.table ?? 1;

  const sections = useMemo(() => s.protocol.tables.map((t) => ({ table: t, steps: stepsInTable(s, t.n) })), [s]);
  const rows = sections.find((x) => x.table.n === curTable)?.steps ?? [];
  const at = selected ? rows.findIndex((r) => r.id === selected) : -1;

  // The selected step can be changed from the panel: keep its table shown in Table view and the step in view.
  const firstRun = useRef(true);
  useEffect(() => {
    if (!selected) return;
    const st = s.protocol.steps[selected];
    if (st && u.tableFilter !== 'all' && st.table !== u.tableFilter) ui.set({ tableFilter: st.table });
    // The page opens at the top (like the reference): scroll only when the selection changes afterwards.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    document.getElementById(`ee-step-${selected}`)?.scrollIntoView({ block: 'nearest' });
  }, [selected, u.tableFilter, s.protocol.steps]);

  const select = (id: string) => {
    // selecting a step expands the collapsed execution panel so the record flow stays reachable
    if (ui.getState().layout === 'panel' && ui.getState().panelCollapsed) ui.set({ panelCollapsed: false });
    if (s.selectedStepId !== id) selectStepGuarded(id);
  };

  const pickTable = (n: number) => {
    const first = stepsInTable(s, n)[0];
    if (tableView !== null) ui.set({ tableFilter: n });
    if (first) select(first.id);
    if (tableView === null) requestAnimationFrame(() => document.getElementById(`sec-${n}`)?.scrollIntoView({ block: 'start' }));
  };

  const nextTable = () => {
    const order = s.protocol.tables.map((t) => t.n);
    const start = order.indexOf(curTable);
    for (let k = 1; k <= order.length; k++) {
      const n = order[(start + k) % order.length];
      if (n !== undefined && stepsInTable(s, n).length > 0) {
        pickTable(n);
        return;
      }
    }
  };

  const z = u.zoom / 100;

  return (
    <Box
      component="main"
      id="doc"
      aria-label="Protocol document"
      sx={{ display: 'flex', flexDirection: 'column', background: docRef.canvas, overflow: 'hidden', minWidth: 0, minHeight: { xs: 480, md: 0 }, height: '100%', fontSize: 14, lineHeight: 1.45, color: ref.ink }}
    >
      <DocToolbar
        tableView={tableView !== null}
        onView={(t) => ui.set({ tableFilter: t ? curTable : 'all' })}
        tables={s.protocol.tables.map((t) => ({ n: t.n, label: t.title }))}
        curTable={curTable}
        onPickTable={pickTable}
        row={at === -1 ? 1 : at + 1}
        rowMax={Math.max(1, rows.length)}
        onRow={(r) => {
          const st = rows[r - 1];
          if (st) select(st.id);
        }}
        onNextTable={nextTable}
        onOpenDocument={(title) => ui.open('evidence', { sop: title })}
        fit={fit}
        onFit={setFit}
        zoom={u.zoom}
        onZoom={(v) => ui.set({ zoom: v })}
      />
      {/* Row under the toolbar: the document viewer and, when open, the in-flow evidence pane (the page's `side` slot). */}
      <Box sx={{ flex: '1 1 0', minHeight: 0, display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
      <Box
        id="docBody"
        sx={{
          flex: '1 1 0', minHeight: { xs: 420, md: 0 }, minWidth: { lg: 360 }, overflow: 'auto', background: docRef.canvas, p: '16px 9px 24px 16px',
          '&::-webkit-scrollbar': { width: 7, height: 7 },
          '&::-webkit-scrollbar-thumb': { background: 'transparent', borderRadius: '3px' },
          '&:hover::-webkit-scrollbar-thumb': { background: docRef.scrollThumb },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
        }}
      >
        {/* CSS zoom reflows the card like a browser zoom (the card fills the column at 100%) */}
        <Box sx={{ zoom: z, width: '100%' }}>
          <WordPage
            s={s}
            fit={fit}
            tableView={tableView}
            sections={sections}
            gated={(t) => isGated(s, t)}
            inline={inline}
            spectator={spectator}
            percentRecorded={status.percentRecorded}
            recorded={status.recorded}
            onSelect={select}
          />
        </Box>
      </Box>
      {side}
      </Box>
    </Box>
  );
}
