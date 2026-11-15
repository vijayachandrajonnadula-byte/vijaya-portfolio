/** Mark steps N/A: justification + reason + e-signature (the signature is skipped for sign-off tables). */
import { useState } from 'react';
import { Chip } from '../../../components/data-display/Chip/Chip';
import { ElectronicSignature } from '../../../components/documents/ElectronicSignature/ElectronicSignature';
import { CompactDialog } from '../../../components/feedback/CompactDialog/CompactDialog';
import { TextArea } from '../../../components/form/TextField/TextField';
import { Box } from '../../../components/mui';
import { NA_REASONS, isoAt } from '../model';
import { executionActions, useExecution } from '../store';
import { ui } from '../ui';
import { ErrorBanner, ErrorLines, FormStack, LEGAL_TEXT, Muted, acceptStatement, fmtDate, fmtTime, stepLabel } from './common';

export default function MarkNADialog({ stepIds }: { stepIds: string[] }) {
  const s = useExecution();
  const user = s.users.find((u) => u.id === s.currentUserId);
  const steps = stepIds.flatMap((id) => (s.protocol.steps[id] ? [s.protocol.steps[id]] : []));
  const needSig = steps.some((x) => !s.protocol.tables.find((t) => t.n === x.table)?.signoff);
  const [justification, setJustification] = useState('');
  const [reason, setReason] = useState('');
  const [userId, setUserId] = useState(s.currentUserId);
  const [password, setPassword] = useState('');
  const [accept, setAccept] = useState(false);
  const [tried, setTried] = useState(false);
  const [storeErrors, setStoreErrors] = useState<string[]>([]);

  const close = () => ui.close('markNA');
  const justErr = tried && !justification.trim();
  const reasonErr = tried && needSig && !reason;
  const userErr = tried && needSig && !userId.trim();
  const pwErr = tried && needSig && !password.trim();
  const acceptErr = tried && needSig && !accept;

  const submit = () => {
    setTried(true);
    if (!justification.trim()) return;
    if (needSig && (!reason || !userId.trim() || !password.trim() || !accept)) return;
    const creds = needSig ? { reason, userId: userId.trim(), password, accept, comments: justification } : undefined;
    const r = executionActions.markNA(stepIds, justification, creds);
    if (!r.ok) {
      setStoreErrors(r.errors);
      return;
    }
    ui.close('markNA');
    ui.toast('success', `${r.affected?.length ?? steps.length} step(s) marked N/A`);
  };

  const justificationField = {
    label: 'Justification (required)',
    placeholder: 'Why is this not applicable?',
    value: justification,
    error: justErr,
    hint: justErr ? 'Justification is required.' : undefined,
    onChange: (e: { target: { value: string } }) => setJustification(e.target.value),
  };

  if (needSig) {
    const now = isoAt(s.clock + 1);
    const statement = acceptStatement(accept, setAccept, acceptErr, LEGAL_TEXT);
    return (
      <ElectronicSignature
        open
        compact
        contextText={
          <>
            You are marking <b>{steps.length === 1 && steps[0] ? `Step ${steps[0].row} · Table ${steps[0].table}` : `${steps.length} steps`}</b> as N/A
          </>
        }
        handleFlyoutClose={close}
        handleSecondary={close}
        handleSign={submit}
        signButtonLabel="Mark as N/A"
        userDetails={{
          name: user?.name,
          role: user?.role,
          date: fmtDate(now),
          time: fmtTime(now),
          timeZone: 'UTC',
        }}
        errorMessage={acceptErr || storeErrors.length ? <ErrorLines messages={[...(acceptErr ? ['Accept the signature statement.'] : []), ...storeErrors]} /> : undefined}
        fields={{
          type: 'reason',
          reason: {
            label: 'Reason for N/A',
            options: [...NA_REASONS],
            value: reason,
            error: reasonErr,
            hint: reasonErr ? 'Select a reason.' : undefined,
            onChange: setReason,
          },
          userId: { value: userId, error: userErr, hint: userErr ? 'User ID is required.' : undefined, onChange: (e) => setUserId(e.target.value) },
          password: { value: password, error: pwErr, hint: pwErr ? 'Enter your password.' : undefined, onChange: (e) => setPassword(e.target.value) },
          comments: justificationField,
        }}
        notificationValues={statement}
      />
    );
  }

  return (
    <CompactDialog
      open
      width={480}
      onClose={close}
      title="Mark as N/A"
      subtitle="Sign-off tables have no signature column, so no e-signature is needed."
      secondaryAction={{ label: 'Cancel', onClick: close }}
      primaryAction={{ label: 'Mark as N/A', onClick: submit }}
    >
      <FormStack>
        <ErrorBanner messages={storeErrors} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
          <Muted>Steps:</Muted>
          {steps.map((x) => (
            <Chip key={x.id} label={stepLabel(x)} size="xsmall" />
          ))}
        </Box>
        <TextArea size="small" required {...justificationField} />
      </FormStack>
    </CompactDialog>
  );
}
