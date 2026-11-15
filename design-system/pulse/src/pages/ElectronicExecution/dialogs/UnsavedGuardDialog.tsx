/** Unsaved changes on the current step when the user moves to another: Discard / Save draft / Stay. Compact 420px dialog. */
import { useState } from 'react';
import { Button } from '../../../components/actions/Button/Button';
import { CompactDialog } from '../../../components/feedback/CompactDialog/CompactDialog';
import { Box } from '../../../components/mui';
import { pt } from '../../../theme/pulseTokens';
import { role } from '../../../theme/typography';
import { executionActions, useExecution } from '../store';
import { ui } from '../ui';
import { ErrorBanner } from './common';

export default function UnsavedGuardDialog({ nextStepId }: { nextStepId: string }) {
  const s = useExecution();
  const cur = s.selectedStepId ? s.protocol.steps[s.selectedStepId] : undefined;
  const [errors, setErrors] = useState<string[]>([]);
  const close = () => ui.close('unsavedGuard');

  const discard = () => {
    const r = executionActions.selectStep(nextStepId, { discard: true });
    if (!r.ok) return setErrors(r.errors);
    ui.close('unsavedGuard');
    ui.toast('warn', 'Changes discarded');
  };
  const save = () => {
    if (!cur) return;
    const r = executionActions.saveDraft(cur.id);
    if (!r.ok) return setErrors(r.errors);
    const n = executionActions.selectStep(nextStepId);
    if (!n.ok) return setErrors(n.errors);
    ui.close('unsavedGuard');
    ui.toast('success', 'Actual result saved');
  };

  return (
    <CompactDialog
      open
      onClose={close}
      icon="!"
      title="Unsaved changes"
      subtitle="You have not recorded or saved this step"
      footerStart={
        <Button variant="text" size="small" color="error" onClick={discard}>
          Discard and continue
        </Button>
      }
      secondaryAction={{ label: 'Stay on this step', onClick: close }}
      primaryAction={{ label: 'Save draft', onClick: save }}
    >
      {errors.length > 0 && (
        <Box sx={{ mb: '12px' }}>
          <ErrorBanner messages={errors} />
        </Box>
      )}
      <Box data-spec="guard-callout" sx={{ p: '10px 12px', border: `1px solid ${pt.colors.brand[200]}`, borderRadius: '7px', bgcolor: pt.colors.brand[50], fontSize: 12, lineHeight: '18px', '& b': { fontWeight: role.dialogTitle } }}>
        <b>{cur ? `Step ${cur.row} · Table ${cur.table}` : 'This step'}</b> has unsaved changes that were not recorded or saved.
        <br />
        If you navigate away, this data <b>will not be maintained</b>. Do you want to proceed?
      </Box>
    </CompactDialog>
  );
}
