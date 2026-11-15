import { useMemo, useState } from 'react';
import { Box } from '../../../components/mui';
import { SideSurface } from '../../../components/feedback/SideSurface/SideSurface';
import { File01Icon, InformationCircleIcon, ArrowUpDownIcon, Layers01Icon } from '../../../icons';
import { actRef, fonts, ref } from '../refTheme';
import { useExecution } from '../store';
import { ui } from '../ui';
import { fmtWhen, userName } from './shared';
import { FootBtn, KV, PanelFooter, PanelHeader, SecHead, W, focusRing, tx, wsTable } from './parts';
import { RefButton } from '../shell/RefControls';

type Tab = 'view' | 'audit';

/** Details panel (640px): a two-button rail switches between the document facts and the audit trail table. */
export default function DetailsFlyout() {
  const s = useExecution();
  const [tab, setTab] = useState<Tab>('view');
  const p = s.protocol;
  const close = () => ui.close('details');

  const rows = useMemo(() => [...s.audit].reverse().map((a) => ({ id: a.id, activity: a.target ? `${a.action}: ${a.target}` : a.action, who: userName(s, a.userId), role: a.role, when: fmtWhen(a.when), note: a.reason ?? a.detail ?? '' })), [s]);
  const versions = Math.max(1, ...Object.values(p.steps).map((x) => x.history.length));
  const steps = Object.keys(p.steps).length;

  const railBtn = (id: Tab, label: string, icon: React.ReactNode) => (
    <RefButton
      key={id}
      aria-label={label}
      aria-pressed={tab === id}
      title={label}
      onClick={() => setTab(id)}
      sx={{
        width: 34, height: 34, p: '1px 6px', boxSizing: 'border-box', justifyContent: 'center', borderRadius: '7px', transition: 'all .15s ease',
        background: tab === id ? ref.navy2 : 'transparent', color: tab === id ? ref.white : ref.muted,
        '&:hover': { background: tab === id ? ref.navy2 : ref.white, color: tab === id ? ref.white : ref.blue3 },
        ...focusRing,
      }}
    >
      {icon}
    </RefButton>
  );

  return (
    <SideSurface
      ariaLabel="Details"
      width={640}
      onClose={close}
      duration={0}
      scrim={actRef.scrimPanel}
      scrimBlur={actRef.blur}
      shadow={actRef.shadowPanel}
      borderRight={`1px solid ${ref.line}`}
      fontFamily={fonts.shell}
      header={<PanelHeader title="Details" subtitle={p.id} onClose={close} />}
      footer={<PanelFooter><FootBtn onClick={close}>Close</FootBtn></PanelFooter>}
      bodyPadding="18px 22px"
    >
      <Box sx={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <Box role="group" aria-label="Details view" sx={{ display: 'flex', flexDirection: 'column', gap: '6px', p: '6px', border: `1px solid ${ref.line}`, borderRadius: '10px', background: ref.bg, flexShrink: 0, boxSizing: 'border-box' }}>
          {railBtn('view', 'Details', <File01Icon size={18} />)}
          {railBtn('audit', 'Audit trail', <ArrowUpDownIcon size={18} />)}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }} data-spec="details-content">
          {tab === 'view' ? (
            <>
              <SecHead first icon={<InformationCircleIcon size={16} />}>Task Details</SecHead>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                <KV k="Exe. No." v={p.id} mono />
                <KV k="Doc No." v={p.docNumber} mono />
                <KV k="Document Title" v={p.title} full />
                <KV k="Equipment" v={p.equipment} />
                <KV k="Equipment No." v={p.equipmentId} mono />
                <KV k="Site" v={p.site} />
                <KV k="Mode" v={s.mode} />
              </Box>
              <SecHead icon={<Layers01Icon size={16} />}>Execution</SecHead>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                <KV k="Tables" v={p.tables.length} />
                <KV k="Steps" v={steps} />
                <KV k="Latest step version" v={`v${versions} (most edited step)`} />
                <KV k="Working as" v={userName(s, s.currentUserId)} />
              </Box>
            </>
          ) : rows.length === 0 ? (
            <Box sx={{ ...tx(11.5, W.regular, ref.muted, 16.675), p: '20px 0' }}>No activity yet. Record, edit or verify a step and it appears here.</Box>
          ) : (
            <Box component="table" data-spec="audit-table" sx={wsTable}>
              <thead>
                <tr>{['Activity', 'Completed By', 'Functional Role', 'Completed On', 'Comments'].map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.activity}</td>
                    <td>{r.who}</td>
                    <td>{r.role}</td>
                    <td>{r.when}</td>
                    <td>{r.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </Box>
          )}
        </Box>
      </Box>
    </SideSurface>
  );
}
