/** Mandatory "Reason for edit" before a recorded step is unlocked. Voids the table's verification. Compact 420px dialog. */
import { useState } from 'react';
import { CompactDialog } from '../../../components/feedback/CompactDialog/CompactDialog';
import { Notification } from '../../../components/feedback/Notification/Notification';
import { TextArea } from '../../../components/form/TextField/TextField';
import { Box } from '../../../components/mui';
import { Edit02Icon } from '../../../icons';
import { executionActions, useExecution } from '../store';
import { ui } from '../ui';
import { ErrorBanner, stepLabel } from './common';

export default function EditReasonDialog({ stepId }: { stepId: string }) {
  const s = useExecution();
  const step = s.protocol.steps[stepId];
  const [reason, setReason] = useState('');
  const [tried, setTried] = useState(false);
  const [storeErrors, setStoreErrors] = useState<string[]>([]);
  const close = () => ui.close('editReason');
  const err = tried && !reason.trim();
  const verified = step ? !!s.verifications[step.table] : false;

  const submit = () => {
    setTried(true);
    if (!reason.trim()) return;
    const r = executionActions.editRecordedStep(stepId, reason);
    if (!r.ok) {
      setStoreErrors(r.errors);
      return;
    }
    ui.close('editReason');
    ui.toast(
      'warn',
      verified && step ? `Row edited - Table ${step.table} verification cleared. Please re-verify.` : 'Step unlocked for edit. Record it again to keep the change.',
    );
  };

  return (
    <CompactDialog
      open
      onClose={close}
      icon={<Edit02Icon size={16} />}
      title="Reason for edit"
      subtitle={step ? `Provide a reason for editing recorded ${stepLabel(step)}` : undefined}
      secondaryAction={{ label: 'Cancel', onClick: close }}
      primaryAction={{ label: 'Continue to record', onClick: submit }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ErrorBanner messages={storeErrors} />
        <Notification
          color="orange"
          variant="fill"
          fullWidth
          title={step ? `Editing voids the verification of Table ${step.table}` : 'Editing voids the table verification'}
          body={
            verified
              ? 'This table is verified. Once you edit the step the verification is cleared and the table must be verified again.'
              : 'The step is unlocked and must be recorded and signed again. Any verification of this table is voided.'
          }
        />
        <TextArea
          label="Reason for edit"
          required
          placeholder="Why does this recorded step need to change?"
          value={reason}
          error={err}
          hint={err ? 'Reason for edit is required.' : undefined}
          onChange={(e) => setReason(e.target.value)}
        />
      </Box>
    </CompactDialog>
  );
}
