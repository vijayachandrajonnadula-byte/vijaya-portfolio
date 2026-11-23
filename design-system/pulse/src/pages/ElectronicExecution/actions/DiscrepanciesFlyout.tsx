import { useState } from 'react';
import { Box, Typography } from '../../../components/mui';
import { Flyout } from '../../../components/feedback/Flyout/Flyout';
import { Table } from '../../../components/data-display/DataGrid/DataGrid';
import { Chip } from '../../../components/data-display/Chip/Chip';
import { EmptyState } from '../../../components/data-display/EmptyState/EmptyState';
import { Select } from '../../../components/form/Select/Select';
import { TextArea } from '../../../components/form/TextField/TextField';
import { Button } from '../../../components/actions/Button/Button';
import { executionActions, useExecution } from '../store';
import { ui } from '../ui';
import type { DiscrepancySeverity, DiscrepancyStatus } from '../model';
import { DiscrepancyChip, Fact, RuleErrors, Section, discrepancyLabel, fmtWhen, nextStatuses, stepLabelById, userName } from './shared';

type View = { kind: 'list' } | { kind: 'detail'; id: string } | { kind: 'create'; stepId?: string };

const severityColor = { major: 'red', moderate: 'orange', minor: 'gray' } as const;
const severityOptions = [
  { value: 'major', label: 'Major' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'minor', label: 'Minor' },
];
const moveLabel: Record<DiscrepancyStatus, string> = {
  underAssessment: 'Send back for assessment',
  pendingReview: 'Send for review',
  closed: 'Close',
  terminated: 'Terminate',
  obsoleted: 'Mark obsolete',
};
const needsComment = (st: DiscrepancyStatus) => st === 'terminated' || st === 'obsoleted';

/** Statuses shown by each tab of View Discrepancy (Open = under assessment and pending review). */
const TABS: { label: string; match: DiscrepancyStatus[] }[] = [
  { label: 'Open', match: ['underAssessment', 'pendingReview'] },
  { label: 'Closed', match: ['closed'] },
  { label: 'Terminated', match: ['terminated'] },
  { label: 'Obsoleted', match: ['obsoleted'] },
];

/** View discrepancies (720px, tabs by status), open one to change its status, or raise a new one in the full create panel. */
export default function DiscrepanciesFlyout() {
  const s = useExecution();
  const payload = ui.payload<{ stepId?: string; create?: boolean }>('discrepancies');
  const [view, setView] = useState<View>(payload?.create || payload?.stepId ? { kind: 'create', stepId: payload.stepId } : { kind: 'list' });
  const [tab, setTab] = useState(0);
  const close = () => ui.close('discrepancies');

  if (view.kind === 'create') {
    return <CreatePanel initialStepId={view.stepId} onCancel={() => setView({ kind: 'list' })} onClose={close} onCreated={(id) => setView({ kind: 'detail', id })} />;
  }

  const detail = view.kind === 'detail' ? s.discrepancies.find((d) => d.id === view.id) : undefined;
  const count = (i: number) => s.discrepancies.filter((d) => TABS[i]?.match.includes(d.status)).length;
  const title = detail ? detail.id : `View Discrepancy | ${s.protocol.id}`;
  const metadata = view.kind === 'list' ? `${s.discrepancies.length} raised for ${s.protocol.docNumber}` : detail ? stepLabelById(s, detail.stepId) : undefined;

  return (
    <Flyout
      open
      width={720}
      onClose={close}
      headerProps={{ compact: true, title, metadata, onBack: view.kind === 'list' ? undefined : () => setView({ kind: 'list' }) }}
      tabs={view.kind === 'list' ? TABS.map((t, i) => ({ label: `${t.label} (${count(i)})` })) : undefined}
      activeTab={tab}
      handleChangeTab={setTab}
      footerLeft={view.kind === 'list' ? <Button size="small" onClick={() => setView({ kind: 'create' })}>Create Discrepancy</Button> : undefined}
      footer={<Button size="small" variant="outlined" onClick={close}>Close</Button>}
    >
      {view.kind === 'list' && <List statuses={TABS[tab]?.match ?? []} onOpen={(id) => setView({ kind: 'detail', id })} onCreate={() => setView({ kind: 'create' })} />}
      {view.kind === 'detail' && (detail ? <Detail key={detail.id} id={detail.id} /> : <EmptyState size="small" type="error" title="Discrepancy not found" />)}
    </Flyout>
  );
}

function List({ statuses, onOpen, onCreate }: { statuses: DiscrepancyStatus[]; onOpen: (id: string) => void; onCreate: () => void }) {
  const s = useExecution();
  const shown = s.discrepancies.filter((d) => statuses.includes(d.status));
  if (s.discrepancies.length === 0) {
    return <EmptyState size="small" title="No discrepancies" description="A failed step can have one raised against it." actionLabel="New discrepancy" onAction={onCreate} />;
  }
  if (shown.length === 0) return <EmptyState size="small" type="noRecords" title="Nothing in this tab" description="No discrepancy has this status." />;
  const rows = shown.map((d) => ({
    id: d.id,
    step: stepLabelById(s, d.stepId),
    severity: d.severity,
    description: d.description,
    status: d.status,
    raisedBy: userName(s, d.raisedBy),
    when: fmtWhen(d.when),
  }));
  return (
    <Table
      size="small"
      onRowClick={(r) => onOpen(String(r.id))}
      columns={[
        { id: 'id', label: 'Number', width: 90 },
        { id: 'step', label: 'Step', width: 130 },
        { id: 'severity', label: 'Severity', width: 90, renderCell: (r) => <Chip label={String(r.severity)} color={severityColor[r.severity as DiscrepancySeverity]} /> },
        { id: 'description', label: 'Description' },
        { id: 'status', label: 'Status', width: 140, renderCell: (r) => <DiscrepancyChip status={r.status as DiscrepancyStatus} /> },
        { id: 'when', label: 'Raised', width: 140 },
      ]}
      data={rows}
    />
  );
}

function Detail({ id }: { id: string }) {
  const s = useExecution();
  const d = s.discrepancies.find((x) => x.id === id);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  if (!d) return null;
  const moves = nextStatuses[d.status];

  const move = (to: DiscrepancyStatus) => {
    const r = executionActions.updateDiscrepancyStatus(d.id, to, comment);
    if (r.ok) {
      setComment('');
      setErrors([]);
      ui.toast('success', `${d.id}: ${discrepancyLabel[to].toLowerCase()}`);
    } else {
      setErrors(r.errors);
    }
  };

  return (
    <>
      <RuleErrors title="Status not changed" errors={errors} />
      <Section title="Details">
        <Fact label="Status"><DiscrepancyChip status={d.status} /></Fact>
        <Fact label="Severity"><Chip label={d.severity} color={severityColor[d.severity]} /></Fact>
        <Fact label="Step">{stepLabelById(s, d.stepId)}</Fact>
        <Fact label="Description">{d.description}</Fact>
        <Fact label="Raised by">{userName(s, d.raisedBy)}, {fmtWhen(d.when)}</Fact>
      </Section>

      <Section title="Comments" hint={d.comments.length === 0 ? 'No comments yet.' : undefined}>
        {d.comments.map((c, i) => (
          <Typography key={`${i}-${c}`} variant="textM" sx={{ display: 'block', py: 0.5 }}>{c}</Typography>
        ))}
      </Section>

      <Section title="Change status" hint={moves.length === 0 ? `A ${discrepancyLabel[d.status].toLowerCase()} discrepancy cannot be changed.` : 'A comment is required to terminate or mark a discrepancy obsolete.'}>
        {moves.length > 0 && (
          <>
            <TextArea label="Comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Why is the status changing?" fullWidth />
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
              {moves.map((to) => (
                <Button key={to} size="small" variant={needsComment(to) ? 'outlined' : 'contained'} color={needsComment(to) ? 'error' : 'primary'} onClick={() => move(to)}>
                  {moveLabel[to]}
                </Button>
              ))}
            </Box>
          </>
        )}
      </Section>
    </>
  );
}

/** Create Discrepancy: a 1240px panel with a 52px header (x at the right), a form body and a footer. */
function CreatePanel({ initialStepId, onCancel, onClose, onCreated }: { initialStepId?: string; onCancel: () => void; onClose: () => void; onCreated: (id: string) => void }) {
  const s = useExecution();
  const stepOptions = s.protocol.tables.flatMap((t) =>
    t.stepIds.flatMap((id) => {
      const st = s.protocol.steps[id];
      return st ? [{ value: id, label: `Table ${t.n} · Step ${st.row}`, metadata: st.verdict === 'fail' ? 'Failed' : undefined }] : [];
    }),
  );
  const [stepId, setStepId] = useState(initialStepId ?? '');
  const [severity, setSeverity] = useState<DiscrepancySeverity>('moderate');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const submit = () => {
    const errs: string[] = [];
    if (!stepId) errs.push('Choose the step this discrepancy is about.');
    if (!description.trim()) errs.push('Describe the discrepancy.');
    if (errs.length) return setErrors(errs);
    const r = executionActions.raiseDiscrepancy(stepId, { severity, description });
    if (r.ok && r.id) {
      ui.toast('success', `Discrepancy ${r.id} raised`);
      onCreated(r.id);
    } else {
      setErrors(r.errors);
    }
  };

  return (
    <Flyout
      open
      width={1240}
      onClose={onClose}
      backdropOpacity={0.3}
      headerProps={{ compact: true, title: 'Create Discrepancy' }}
      footer={
        <>
          <Button size="small" variant="outlined" onClick={onCancel}>Cancel</Button>
          <Button size="small" onClick={submit}>Raise discrepancy</Button>
        </>
      }
    >
      <Box sx={{ maxWidth: 640 }}>
        <RuleErrors title="Discrepancy not raised" errors={errors} />
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Select label="Step" required placeholder="Choose a step" options={stepOptions} value={stepId} onChange={(v) => setStepId(String(v))} searchable fullWidth />
          <Select label="Severity" options={severityOptions} value={severity} onChange={(v) => setSeverity(v as DiscrepancySeverity)} hideClearIcon fullWidth />
          <TextArea label="Description" required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was observed, and how it differs from the expected result" fullWidth />
        </Box>
      </Box>
    </Flyout>
  );
}