/** Step e-signature (record one step, or several under one signature). Uses the Figma ElectronicSignature. */
import { useState } from 'react';
import { ElectronicSignature } from '../../../components/documents/ElectronicSignature/ElectronicSignature';
import { SIGN_REASONS, isoAt } from '../model';
import { executionActions, useExecution } from '../store';
import { ui } from '../ui';
import { ErrorLines, LEGAL_TEXT, acceptStatement, fmtDate, fmtTime } from './common';

export default function SignDialog({ stepIds }: { stepIds: string[] }) {
  const s = useExecution();
  const user = s.users.find((u) => u.id === s.currentUserId);
  const [reason, setReason] = useState('');
  const [userId, setUserId] = useState(s.currentUserId);
  const [password, setPassword] = useState('');
  const [comments, setComments] = useState('');
  const [accept, setAccept] = useState(false);
  const [tried, setTried] = useState(false);
  const [storeErrors, setStoreErrors] = useState<string[]>([]);

  const multi = stepIds.length > 1;
  const first = s.protocol.steps[stepIds[0] ?? ''];
  const now = isoAt(s.clock + 1);

  const reasonErr = tried && !reason;
  const userErr = tried && !userId.trim();
  const pwErr = tried && !password.trim();
  const acceptErr = tried && !accept;

  const cancel = () => {
    executionActions.cancelSign();
    ui.close('sign');
  };

  const submit = () => {
    setTried(true);
    if (!reason || !userId.trim() || !password.trim() || !accept) return;
    const creds = { reason, userId: userId.trim(), password, accept, comments };
    const r = multi ? executionActions.bulkRecord(stepIds, creds) : executionActions.eSign(creds, stepIds[0]);
    if (!r.ok) {
      setStoreErrors(r.errors);
      return;
    }
    ui.close('sign');
    if (multi) {
      const done = r.affected?.length ?? 0;
      const skipped = r.skipped?.length ?? 0;
      if (skipped) ui.toast('warn', `${done} recorded, ${skipped} skipped (${r.skipped?.map((x) => x.stepId).join(', ')}).`);
      else ui.toast('success', `Signature recorded - ${done} steps`);
    } else if (first) {
      ui.toast('success', `Signature recorded - Step ${first.row} - Table ${first.table}`);
    }
    const queue = multi ? (r.promptDiscrepancyFor ?? []) : r.promptDiscrepancy && first ? [first.id] : [];
    const head = queue[0];
    if (head) ui.open('discrepancyPrompt', { stepId: head, queue: queue.slice(1) });
  };

  const statement = acceptStatement(accept, setAccept, acceptErr, LEGAL_TEXT);

  return (
    <ElectronicSignature
      open
      compact
      contextText={
        <>
          You are signing <b>{multi ? `${stepIds.length} steps` : first ? `Step ${first.row} · Table ${first.table}` : ''}</b>
        </>
      }
      handleFlyoutClose={cancel}
      handleSecondary={cancel}
      handleSign={submit}
      signButtonLabel="Submit"
      userDetails={{
        name: user?.name,
        role: user?.role,
        date: fmtDate(now),
        time: fmtTime(now),
        timeZone: 'UTC',
        activityText: 'Witnessed and verified',
      }}
      errorMessage={
        acceptErr || storeErrors.length ? <ErrorLines messages={[...(acceptErr ? ['Accept the signature statement.'] : []), ...storeErrors]} /> : undefined
      }
      fields={{
        type: 'reason',
        reason: {
          label: 'Reason for E-sign',
          options: [...SIGN_REASONS],
          value: reason,
          error: reasonErr,
          hint: reasonErr ? 'Select a reason for the signature.' : undefined,
          onChange: setReason,
        },
        userId: { value: userId, error: userErr, hint: userErr ? 'User ID is required.' : undefined, onChange: (e) => setUserId(e.target.value) },
        password: { value: password, error: pwErr, hint: pwErr ? 'Enter your password.' : undefined, onChange: (e) => setPassword(e.target.value) },
        comments: { value: comments, onChange: (e) => setComments(e.target.value) },
      }}
      notificationValues={statement}
    />
  );
}
