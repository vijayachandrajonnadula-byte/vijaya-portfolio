import { useEffect } from 'react';
import DialogHost from './dialogs/DialogHost';
import ActionsHost from './actions/ActionsHost';
import { ui } from './ui';

/**
 * Mounts every overlay surface of the page: dialogs (sign, verify, N/A, edit reason, discrepancy prompt, unsaved guard,
 * evidence, evidence viewer, history) and actions (status, details, metrics, discrepancies, split, verification
 * assignment, AI agent, toast). Esc closes the top surface when the surface itself did not handle the key.
 */
export default function Overlays() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const stack = ui.getState().stack;
      // The evidence pane is open by default (part of the page): Esc closes the surfaces above it, not the pane itself.
      if (e.key === 'Escape' && !e.defaultPrevented && stack.length > 0 && !(stack.length === 1 && stack[0]?.name === 'evidence')) ui.close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return (
    <>
      <DialogHost />
      <ActionsHost />
    </>
  );
}
