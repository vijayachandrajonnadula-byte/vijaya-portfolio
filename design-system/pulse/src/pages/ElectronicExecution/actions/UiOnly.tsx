/**
 * Electronic Execution, side surfaces that the store does not back: annotation report, edit-document bar, task transfer,
 * copy result and the route confirm. NOT FROM FIGMA. Each one says on screen what is mocked and none changes the execution state.
 */
import { useState } from 'react';
import { Box } from '../../../components/mui';
import { SideSurface } from '../../../components/feedback/SideSurface/SideSurface';
import { CompactDialog } from '../../../components/feedback/CompactDialog/CompactDialog';
import { Notification } from '../../../components/feedback/Notification/Notification';
import { Select } from '../../../components/form/Select/Select';
import { TextArea } from '../../../components/form/TextField/TextField';
import { Checkbox } from '../../../components/form/Checkbox/Checkbox';
import { Edit02Icon } from '../../../icons';
import { actRef, fonts, ref } from '../refTheme';
import { useExecution } from '../store';
import { ui } from '../ui';
import { Closer, FootBtn, PanelFooter, PanelHeader, W, focusRing, tx, wsTable } from './parts';
import { RefButton } from '../shell/RefControls';
import { stepLabel } from './shared';
import { RefSelect } from './RefSelect';

/** Annotation Report (1080px, navy header). The sample keeps no annotations, so the table is empty and says so. */
export function AnnotationPanel() {
  const s = useExecution();
  const close = () => ui.close('annotations');
  const heads = ['Executed Version', 'Reply To', 'Annotation Type', 'Annotated Content - Text', 'Annotated Date', 'Author', 'Author Comments', 'Page No', 'State', 'Document Owner'];
  return (
    <SideSurface
      ariaLabel="Annotation Details"
      width="min(1400px, 75vw)"
      onClose={close}
      duration={0}
      scrim={actRef.scrimPanel}
      scrimBlur={actRef.blur}
      shadow={actRef.shadowPanel}
      fontFamily={fonts.shell}
      header={<PanelHeader dark title="Annotation Details" subtitle={s.protocol.id} onClose={close} />}
      footer={<PanelFooter><FootBtn onClick={close}>Close</FootBtn></PanelFooter>}
      bodyPadding="18px 22px"
    >
      <Box component="table" data-spec="annotation-table" sx={wsTable}>
        <thead><tr>{heads.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          <tr><Box component="td" colSpan={heads.length} sx={{ p: '18px 10px', color: ref.muted }}>No annotations. Sample only: this prototype does not store document annotations, so the report is always empty.</Box></tr>
        </tbody>
      </Box>
    </SideSurface>
  );
}

/** Edit Document bar (720x62, 22px above the bottom). UI-only: the sample keeps no document edits, so only Done does anything. */
export function EditDocumentBar() {
  const btn = { p: '7px 13px', borderRadius: '8px', justifyContent: 'center', textAlign: 'center', boxSizing: 'border-box', ...tx(12, W.strong, ref.white), '&:disabled': { opacity: 0.55, cursor: 'not-allowed' }, '&:hover:not(:disabled)': { filter: 'brightness(1.08)' }, ...focusRing } as const;
  return (
    <Box
      role="region"
      aria-label="Edit document"
      data-spec="edit-bar"
      sx={{ position: 'fixed', left: '50%', bottom: 22, transform: 'translateX(-50%)', zIndex: 1150, width: 720, maxWidth: 'calc(100vw - 16px)', height: 62, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '12px', p: '9px 10px 9px 16px', borderRadius: '12px', background: ref.navy, boxShadow: actRef.shadowBar, fontFamily: fonts.shell }}
    >
      <Box aria-hidden sx={{ display: 'flex', color: ref.white }}><Edit02Icon size={15} /></Box>
      <Box component="span" sx={{ flex: 1, minWidth: 0, mr: '4px', ...tx(12, W.emphasis, ref.white, 17.4) }}>Editing document: sample only, edits are not saved.</Box>
      <RefButton disabled title="Not stored in this sample" sx={{ ...btn, width: 136.7, height: 44, background: actRef.barGhost }}>Version History (0)</RefButton>
      <RefButton disabled title="Not stored in this sample" sx={{ ...btn, width: 131.6, height: 44, background: actRef.barBlue }}>Update Document</RefButton>
      <RefButton onClick={() => ui.close('editDocument')} sx={{ ...btn, height: 29, background: ref.white, color: ref.navy }}>Done</RefButton>
    </Box>
  );
}

/** Task Transfer (440px). UI-only: nothing is transferred; the result is stated in the toast. */
export function TaskTransferPanel() {
  const s = useExecution();
  const [to, setTo] = useState('');
  const [comment, setComment] = useState('');
  const close = () => ui.close('taskTransfer');
  return (
    <SideSurface
      ariaLabel="Task Transfer"
      width={440}
      onClose={close}
      duration={0}
      scrim={actRef.scrimPanel}
      scrimBlur={actRef.blur}
      shadow={actRef.shadowPanel}
      fontFamily={fonts.shell}
      header={<PanelHeader title="Task Transfer" subtitle={s.protocol.id} onClose={close} />}
      footer={
        <PanelFooter>
          <FootBtn onClick={close}>Cancel</FootBtn>
          <FootBtn primary disabled={!to} onClick={() => { ui.toast('warn', 'Task transfer is a sample action: nothing was transferred.'); close(); }}>Transfer</FootBtn>
        </PanelFooter>
      }
      bodyPadding="18px 22px"
    >
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Notification color="blue" title="Sample only" body="This prototype does not transfer tasks. Choosing Transfer only shows a message." />
        <Select label="User" required placeholder="Choose a user" options={s.users.filter((u) => u.canExecute && u.id !== s.currentUserId).map((u) => ({ value: u.id, label: u.name }))} value={to} onChange={(v) => setTo(String(v))} fullWidth />
        <TextArea label="Comment" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Why is the task being transferred?" fullWidth />
      </Box>
    </SideSurface>
  );
}

/** Copy Result (620px, navy header). UI-only: pick a source, tick recorded steps, and Copy Result only reports that it is a sample. */
export function CopyResultPanel() {
  const s = useExecution();
  const [entity, setEntity] = useState('');
  const [doc, setDoc] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const close = () => ui.close('copyResult');
  const p = s.protocol;
  const recorded = Object.values(p.steps).filter((x) => x.state === 'recorded');
  const ready = !!entity && !!doc;
  const lbl = { width: 90, textAlign: 'right', ...tx(12.5, W.emphasis, ref.ink, 18.125) } as const;
  return (
    <SideSurface
      ariaLabel="Copy Result"
      width={620}
      onClose={close}
      duration={280}
      scrim="rgba(10,20,60,.35)"
      shadow="-8px 0 32px rgba(10,30,80,.18)"
      fontFamily={fonts.shell}
      header={
        <Box data-spec="copy-head" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '0 22px', height: 52, background: ref.navy, boxSizing: 'border-box', flexShrink: 0 }}>
          <Box sx={{ letterSpacing: '0.2px', ...tx(15, W.strong, ref.white, 21.75) }}>Copy Result</Box>
          <Box sx={{ m: '0 -7px' }}><Closer onClose={close} tone="dark" size={16} box={32} /></Box>
        </Box>
      }
      footer={
        <Box data-spec="copy-foot" sx={{ display: 'flex', alignItems: 'center', gap: '10px', p: '12px 20px', height: 56, borderTop: `1px solid ${ref.line}`, background: actRef.panelFootBg, boxSizing: 'border-box', flexShrink: 0 }}>
          <Box sx={{ flex: 1, ...tx(12, W.emphasis, ref.muted, 17.4) }}>{picked.length} steps selected</Box>
          <RefButton onClick={close} sx={{ height: 31, p: '7px 18px', boxSizing: 'border-box', border: `1px solid ${actRef.viewBtnLine}`, borderRadius: '7px', background: ref.white, ...tx(12.5, W.emphasis, ref.ink), '&:hover': { background: ref.tint2 } }}>Cancel</RefButton>
          <RefButton disabled={picked.length === 0} onClick={() => { ui.toast('warn', 'Copy Result is a sample action: nothing was copied.'); close(); }} sx={{ height: 31, p: '7px 18px', boxSizing: 'border-box', border: `1px solid ${ref.navy2}`, borderRadius: '7px', background: ref.navy2, ...tx(12.5, W.emphasis, ref.white), '&:disabled': { opacity: 0.4, cursor: 'default' }, '&:hover:not(:disabled)': { background: actRef.submitHover } }}>Copy Result</RefButton>
        </Box>
      }
    >
      <Box data-spec="copy-filter" sx={{ p: '16px 22px 12px', borderBottom: `1px solid ${ref.line}` }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '14px', alignItems: 'center', mb: '12px' }}>
          <Box component="label" sx={lbl}><Box component="span" sx={{ color: actRef.required, mr: '2px' }}>*</Box>Entity</Box>
          <RefSelect variant="field" ariaLabel="Entity" placeholder="-Select-" options={[{ value: 'eq', label: `${p.equipment} (${p.equipmentId})` }]} value={entity || null} onSelect={(o) => { setEntity(String(o.value)); setDoc(''); setPicked([]); }} />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '14px', alignItems: 'center' }}>
          <Box component="label" sx={lbl}><Box component="span" sx={{ color: actRef.required, mr: '2px' }}>*</Box>Document</Box>
          <RefSelect variant="field" ariaLabel="Document" placeholder="-Select-" disabled={!entity} options={[{ value: 'doc', label: p.docNumber }]} value={doc || null} onSelect={(o) => setDoc(String(o.value))} />
        </Box>
      </Box>
      {!ready ? (
        <Box sx={{ p: '48px 24px', textAlign: 'center', ...tx(13, W.regular, actRef.emptyText, 20.8) }}>Select an Entity and Document to load tables and steps.</Box>
      ) : (
        <Box sx={{ p: '14px 22px', display: 'grid', gap: '6px' }}>
          <Box sx={{ ...tx(11, W.emphasis, ref.muted, 15.95), mb: '2px' }}>Sample only: the recorded steps of this execution are listed. Nothing is copied.</Box>
          {recorded.length === 0 && <Box sx={tx(12.5, W.regular, ref.muted, 18.125)}>No step is recorded yet.</Box>}
          {recorded.map((st) => (
            <Checkbox key={st.id} size="small" label={`${stepLabel(st)}: ${st.verdict ?? 'no verdict'}`} checked={picked.includes(st.id)} onChange={(e) => setPicked((x) => (e.target.checked ? [...x, st.id] : x.filter((y) => y !== st.id)))} />
          ))}
        </Box>
      )}
    </SideSurface>
  );
}

const ROUTE = { peer: 'Peer Review', review: 'Review', approval: 'Approval' } as const;

/** Route to Peer Review / Review / Approval: a 480px confirm. UI-only: Ok only reports that routing is a sample action. */
export function RouteDialog({ to }: { to: keyof typeof ROUTE }) {
  const s = useExecution();
  const left = Object.values(s.protocol.steps).filter((x) => x.state !== 'recorded').length;
  const close = () => ui.close('route');
  return (
    <CompactDialog
      open
      appearance="notice"
      width={480}
      showClose={false}
      title="Notification"
      onClose={close}
      secondaryAction={{ label: 'Cancel', onClick: close }}
      primaryAction={{
        label: 'Ok',
        onClick: () => {
          close();
          ui.toast('warn', `Route to ${ROUTE[to]} is a sample action: nothing was routed.`);
        },
      }}
    >
      {left > 0 ? `${left} test steps are not recorded. Do you want to proceed?` : `All test steps are recorded. Route to ${ROUTE[to]}?`}
    </CompactDialog>
  );
}
