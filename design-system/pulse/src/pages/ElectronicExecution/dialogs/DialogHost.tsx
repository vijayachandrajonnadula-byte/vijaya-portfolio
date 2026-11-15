/**
 * Electronic Execution: renders the dialog and drawer overlays that are on the ui stack
 * (sign, verify, markNA, editReason, discrepancyPrompt, unsavedGuard, history and the evidence surfaces: gallery, full-size
 * viewer, file slider, capture modals, upload modal). The in-flow evidence pane is rendered by the page layout
 * (evidence/EvidencePane.tsx, EvidencePaneSlot). Mount once on the page. Each overlay reads and writes the store and closes
 * itself with ui.close(name).
 */
import type { OverlayName } from '../ui';
import { useUi } from '../ui';
import CaptureModal from '../evidence/CaptureModal';
import type { CaptureKind } from '../evidence/CaptureModal';
import EvidenceGallery from '../evidence/EvidenceGallery';
import { FileSlider } from '../evidence/FileSlider';
import UploadModal from '../evidence/UploadModal';
import DiscrepancyPromptDialog from './DiscrepancyPromptDialog';
import EditReasonDialog from './EditReasonDialog';
import EvidenceViewer from './EvidenceViewer';
import HistoryDrawer from './HistoryDrawer';
import MarkNADialog from './MarkNADialog';
import SignDialog from './SignDialog';
import UnsavedGuardDialog from './UnsavedGuardDialog';
import VerifyDialog from './VerifyDialog';

const strs = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');

export default function DialogHost() {
  const { stack } = useUi();
  const pay = (name: OverlayName) => {
    const o = stack.find((x) => x.name === name);
    return o ? (o.payload ?? {}) : null;
  };

  const sign = pay('sign');
  const verify = pay('verify');
  const markNA = pay('markNA');
  const editReason = pay('editReason');
  const prompt = pay('discrepancyPrompt');
  const guard = pay('unsavedGuard');
  const viewer = pay('evidenceViewer');
  const gallery = pay('evidenceGallery');
  const slider = pay('fileSlider');
  const capture = pay('capture');
  const upload = pay('upload');
  const history = pay('history');

  return (
    <>
      {gallery && <EvidenceGallery evidenceId={str(gallery.evidenceId) || undefined} />}
      <FileSlider payload={slider ? { evidenceId: str(slider.evidenceId), ids: strs(slider.ids) } : null} />
      {history && <HistoryDrawer key={str(history.stepId)} stepId={str(history.stepId)} />}
      {viewer && <EvidenceViewer evidenceId={str(viewer.evidenceId)} ids={strs(viewer.ids)} />}
      {capture && <CaptureModal key={str(capture.kind)} kind={(str(capture.kind) || 'screenshot') as CaptureKind} />}
      {upload && <UploadModal tab={upload.tab === 'vault' ? 'vault' : 'external'} />}
      {editReason && <EditReasonDialog key={str(editReason.stepId)} stepId={str(editReason.stepId)} />}
      {markNA && <MarkNADialog key={strs(markNA.stepIds).join(',')} stepIds={strs(markNA.stepIds)} />}
      {sign && <SignDialog key={strs(sign.stepIds).join(',')} stepIds={strs(sign.stepIds)} />}
      {verify && <VerifyDialog key={String(verify.table)} table={Number(verify.table)} />}
      {guard && <UnsavedGuardDialog key={str(guard.nextStepId)} nextStepId={str(guard.nextStepId)} />}
      {prompt && <DiscrepancyPromptDialog key={str(prompt.stepId)} stepId={str(prompt.stepId)} queue={strs(prompt.queue)} />}
    </>
  );
}
