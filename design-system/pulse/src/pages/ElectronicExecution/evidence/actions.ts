/** NOT FROM FIGMA. Actions the evidence surfaces share: select a step (with the unsaved guard) and remove an item from a step. */
import type { EvidenceItem } from '../model';
import { executionActions, executionStore } from '../store';
import { ui } from '../ui';

/** Select a step. When the current step has unsaved edits the unsaved-changes dialog opens instead. */
export function goToStep(id: string): void {
  const r = executionActions.selectStep(id);
  if (!r.ok && r.guard === 'unsaved') ui.open('unsavedGuard', { nextStepId: id });
  else if (!r.ok) ui.toast('error', r.errors[0] ?? 'Could not select the step.');
}

/** Can the selected step lose this item (it is linked, evidence applies and the step is not locked)? */
export function removableFromSelected(item: EvidenceItem): { stepId: string; label: string } | null {
  const s = executionStore.getState();
  const step = s.selectedStepId ? s.protocol.steps[s.selectedStepId] : undefined;
  if (!step || step.evidence === null || step.state === 'recorded' || !item.stepIds.includes(step.id)) return null;
  return { stepId: step.id, label: `Table ${step.table} / Row ${step.row}` };
}

export function removeFromStep(item: EvidenceItem, stepId: string, label: string): boolean {
  const r = executionActions.removeEvidence(stepId, item.id);
  if (r.ok) ui.toast('success', `${item.name} removed from ${label}`);
  else ui.toast('error', r.errors[0] ?? 'Could not remove the evidence.');
  return r.ok;
}
