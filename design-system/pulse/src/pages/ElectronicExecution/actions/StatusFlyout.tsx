import type { ReactNode } from 'react';
import { Box } from '../../../components/mui';
import { Flyout } from '../../../components/feedback/Flyout/Flyout';
import { ChatBotIcon, CheckmarkCircle01Icon, CircleIcon, Menu06Icon, TickDouble02Icon, TriangleIcon, Upload03Icon } from '../../../icons';
import { actRef, ref } from '../refTheme';
import { executionStatus, useExecution } from '../store';
import { ui } from '../ui';
import { W, tx } from './parts';
import { RefButton, focusRing } from '../shell/RefControls';

function Card({ label, value, color, icon, sub }: { label: string; value: number; color: string; icon: ReactNode; sub?: string }) {
  return (
    <Box data-spec="status-card" sx={{ p: '10px 11px', border: `1px solid ${ref.line}`, borderRadius: '9px', background: ref.white, boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', height: 24 }}>
        <Box aria-hidden sx={{ width: 24, height: 24, borderRadius: '6px', background: color, color: ref.white, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{icon}</Box>
        <Box data-spec="status-card-label" sx={tx(9.5, W.strong, ref.muted, 13.775)}>{label}</Box>
      </Box>
      <Box data-spec="status-card-value" sx={{ mt: '2px', ...tx(20, W.heavy, ref.ink, 20) }}>{value}</Box>
      {sub && <Box sx={{ mt: '1px', ...tx(10, W.regular, ref.muted, 14.5) }}>{sub}</Box>}
    </Box>
  );
}

/** Execution Status slider (440px, slides in over 0.25s): overall progress and six KPI cards, live from executionStatus(). */
export default function StatusFlyout() {
  const s = useExecution();
  const st = executionStatus(s);
  const aiProposed = Object.values(s.protocol.steps).filter((x) => x.aiFilled).length;
  const close = () => ui.close('status');
  const g = 14;

  return (
    <Flyout
      open
      width={440}
      onClose={close}
      backdropOpacity={0.3}
      headerProps={{ compact: true, title: 'Execution Status', metadata: `${s.protocol.id} · Real-time progress`, icon: <CheckmarkCircle01Icon size={22} /> }}
      disableContentPadding
    >
      <Box data-spec="status-prog" sx={{ p: '12px 16px', borderBottom: `1px solid ${ref.line}`, background: actRef.statusProg, boxSizing: 'border-box' }}>
        <Box sx={{ mb: '5px', ...tx(10, W.emphasis, ref.muted, 14.5) }}>Overall Progress</Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '7px', minHeight: 28.4, mb: '5px' }}>
          <Box component="span" data-spec="status-val" sx={tx(28, W.heavy, ref.blue3, 28)}>{st.percentRecorded}</Box>
          <Box component="span" sx={tx(12, W.emphasis, ref.muted, 17.4)}>% · {st.recorded} of {st.total} steps</Box>
        </Box>
        <Box role="progressbar" aria-label="Recorded" aria-valuenow={st.percentRecorded} aria-valuemin={0} aria-valuemax={100} sx={{ height: 7, borderRadius: '3px', background: ref.tint2, overflow: 'hidden' }}>
          <Box sx={{ width: `${st.percentRecorded}%`, height: 7, borderRadius: '3px', background: actRef.statusBar, transition: 'width .3s ease' }} />
        </Box>
      </Box>

      <Box sx={{ p: '12px' }}>
        <Box data-spec="status-grid" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <Card label="Total Steps" value={st.total} color={actRef.cardTotal} icon={<Menu06Icon size={g} />} sub={`${s.protocol.tables.length} tables`} />
          <Card label="Completed" value={st.recorded} color={actRef.cardDone} icon={<TickDouble02Icon size={g} />} />
          <Card label="Pending" value={st.pending + st.drafts + st.aiFilled} color={actRef.cardPending} icon={<CircleIcon size={g} />} />
          <Card label="Failed" value={st.verdicts.fail} color={actRef.cardFail} icon={<TriangleIcon size={g} />} />
          <Card label="Evidence" value={st.evidenceCount} color={actRef.cardEvidence} icon={<Upload03Icon size={g} />} />
          <Card label="AI proposed" value={aiProposed} color={actRef.cardAi} icon={<ChatBotIcon size={g} />} />
        </Box>

        {/* Not in the reference (its body is empty below the cards): per-table progress, verification and discrepancies. */}
        <Box sx={{ mt: '14px', display: 'grid', gap: '8px' }}>
          <Box sx={{ ...tx(10, W.emphasis, ref.muted, 14.5) }}>By table</Box>
          {st.perTable.map((t) => {
            const table = s.protocol.tables.find((x) => x.n === t.table);
            const pct = t.total ? Math.round((t.recorded / t.total) * 100) : 0;
            return (
              <Box key={t.table} sx={{ display: 'grid', gap: '4px' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <Box sx={{ flex: 1, minWidth: 0, ...tx(11, W.emphasis, ref.ink, 15.95), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{table?.num} {table?.title}</Box>
                  <Box sx={tx(10, W.regular, ref.muted, 14.5)}>{t.recorded}/{t.total} recorded · {t.isVerified ? 'Verified' : 'Not verified'}</Box>
                </Box>
                <Box sx={{ height: 5, borderRadius: '3px', background: ref.tint2, overflow: 'hidden' }}>
                  <Box sx={{ width: `${pct}%`, height: 5, background: actRef.statusBar }} />
                </Box>
              </Box>
            );
          })}
          <Box sx={{ display: 'flex', gap: '14px', mt: '4px' }}>
            <RefButton onClick={() => ui.open('discrepancies')} sx={{ ...tx(11, W.emphasis, ref.blue3, 15.95), textDecoration: 'underline', ...focusRing }}>{st.openDiscrepancies} open discrepancies</RefButton>
            <RefButton onClick={() => ui.open('metrics')} sx={{ ...tx(11, W.emphasis, ref.blue3, 15.95), textDecoration: 'underline', ...focusRing }}>Open metrics</RefButton>
          </Box>
        </Box>
      </Box>
    </Flyout>
  );
}
