/** "Raise a discrepancy?" after a Fail. Yes opens a small form; No dismisses. `queue` holds further failed steps to ask about. */
import { useState } from 'react';
import { CompactDialog } from '../../../components/feedback/CompactDialog/CompactDialog';
import { Select } from '../../../components/form/Select/Select';
import { TextArea } from '../../../components/form/TextField/TextField';
import type { DiscrepancySeverity } from '../model';
import { executionActions, useExecution } from '../store';
import { ui } from '../ui';
import { Body, ErrorBanner, FormStack, stepLabel } from './common';

const SEVERITIES: { label: string; value: DiscrepancySeverity }[] = [
  { label: 'Major', value: 'major' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Minor', value: 'minor' },
];

export default function DiscrepancyPromptDialog({ stepId, queue }: { stepId: string; queue: string[] }) {
  const s = useExecution();
  const step = s.protocol.steps[stepId];
  const [phase, setPhase] = useState<'ask' | 'form'>('ask');
  const [severity, setSeverity] = useState<DiscrepancySeverity | ''>('');
  const [description, setDescription] = useState('');
  const [tried, setTried] = useState(false);
  const [storeErrors, setStoreErrors] = useState<string[]>([]);

  const done = () => {
    ui.close('discrepancyPrompt');
    const head = queue[0];
    if (head) ui.open('discrepancyPrompt', { stepId: head, queue: queue.slice(1) });
  };

  const sevErr = tried && !severity;
  const descErr = tried && !description.trim();
  const submit = () => {
    setTried(true);
    if (!severity || !description.trim()) return;
    const r = executionActions.raiseDiscrepancy(stepId, { severity, description });
    if (!r.ok) {
      setStoreErrors(r.errors);
      return;
    }
    ui.toast('success', `Discrepancy ${r.id ?? ''} raised`.replace('  ', ' '));
    done();
  };

  if (phase === 'ask') {
    return (
      <CompactDialog
        open
        dialogRole="alertdialog"
        showClose={false}
        onClose={done}
        title="Step marked as failed"
        subtitle="Raise a discrepancy for this step?"
        secondaryAction={{ label: 'Cancel', onClick: done }}
        primaryAction={{ label: 'Create discrepancy', color: 'error', onClick: () => setPhase('form') }}
      >
        <Body>Failing without a discrepancy must be justified.</Body>
      </CompactDialog>
    );
  }

  return (
    <CompactDialog
      open
      onClose={done}
      title="Raise a discrepancy"
      subtitle={step ? stepLabel(step) : undefined}
      secondaryAction={{ label: 'Cancel', onClick: done }}
      primaryAction={{ label: 'Raise discrepancy', onClick: submit }}
    >
      <FormStack>
        <ErrorBanner messages={storeErrors} />
        <Select
          size="small"
          label="Severity"
          required
          placeholder="Select a severity"
          options={SEVERITIES}
          value={severity}
          error={sevErr}
          hint={sevErr ? 'Select a severity.' : undefined}
          onChange={(v) => setSeverity((Array.isArray(v) ? (v[0] ?? '') : v) as DiscrepancySeverity | '')}
        />
        <TextArea
          label="Description"
          required
          placeholder="What did not match the expected result?"
          value={description}
          error={descErr}
          hint={descErr ? 'Describe the discrepancy.' : undefined}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormStack>
    </CompactDialog>
  );
}
