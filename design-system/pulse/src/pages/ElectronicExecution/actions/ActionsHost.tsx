import { ui, useUi } from '../ui';
import type { OverlayName } from '../ui';
import StatusFlyout from './StatusFlyout';
import DetailsFlyout from './DetailsFlyout';
import MetricsFlyout from './MetricsFlyout';
import DiscrepanciesFlyout from './DiscrepanciesFlyout';
import SplitFlyout from './SplitFlyout';
import VerifyAssignFlyout from './VerifyAssignFlyout';
import AiAgentFlyout from './AiAgentFlyout';
import Toast from './Toast';
import { AnnotationPanel, CopyResultPanel, EditDocumentBar, RouteDialog, TaskTransferPanel } from './UiOnly';

const ROUTES = ['peer', 'review', 'approval'] as const;

/**
 * Renders the side surfaces (status, details, metrics, discrepancies, split, verifyAssign, aiAgent, annotations, route,
 * editDocument, taskTransfer, copyResult) and the toast. Mount once on the page. Each surface closes through ui.close(name).
 * The toast hides itself after 2.6 s.
 */
export default function ActionsHost() {
  const u = useUi();
  const open = (name: OverlayName) => u.stack.some((o) => o.name === name);
  const route = ui.payload<{ to?: string }>('route')?.to;
  const t = u.toast;
  return (
    <>
      {open('status') && <StatusFlyout />}
      {open('details') && <DetailsFlyout />}
      {open('metrics') && <MetricsFlyout />}
      {open('discrepancies') && <DiscrepanciesFlyout />}
      {open('split') && <SplitFlyout />}
      {open('verifyAssign') && <VerifyAssignFlyout />}
      {open('aiAgent') && <AiAgentFlyout />}
      {open('annotations') && <AnnotationPanel />}
      {open('editDocument') && <EditDocumentBar />}
      {open('taskTransfer') && <TaskTransferPanel />}
      {open('copyResult') && <CopyResultPanel />}
      {open('route') && <RouteDialog to={ROUTES.find((r) => r === route) ?? 'peer'} />}
      {t && <Toast key={t.id} id={t.id} kind={t.kind} text={t.text} />}
    </>
  );
}
