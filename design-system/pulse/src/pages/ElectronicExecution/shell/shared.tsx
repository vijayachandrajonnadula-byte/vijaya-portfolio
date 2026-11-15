import type { ElementType, ReactNode } from 'react';
import { Stack as MuiStack } from '../../../components/mui';
import type { SxProps, Theme } from '../../../components/mui';
import type { EvidenceKind } from '../model';
import { executionActions, executionStore } from '../store';
import { ui } from '../ui';

interface StackProps {
  direction?: 'row' | 'column';
  spacing?: number;
  useFlexGap?: boolean;
  alignItems?: string;
  justifyContent?: string;
  flexWrap?: string;
  component?: ElementType;
  role?: string;
  'aria-label'?: string;
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

/**
 * Stack for this page. MUI 9 no longer takes alignItems / justifyContent / flexWrap / component as props, so they are
 * mapped to sx here and the other props go to the layout primitive unchanged. (Re-exported by MediaBar.tsx.)
 */
export function Stack({ alignItems, justifyContent, flexWrap, component, sx, ...rest }: StackProps) {
  const S = MuiStack as ElementType;
  return <S component={component} sx={[{ alignItems, justifyContent, flexWrap }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} {...rest} />;
}

export const EVIDENCE_KINDS: { kind: EvidenceKind; label: string }[] = [
  { kind: 'file', label: 'Attach file' },
  { kind: 'screenshot', label: 'Screenshot' },
  { kind: 'snapshot', label: 'Snapshot' },
  { kind: 'video', label: 'Video capture' },
];

const sample: Record<EvidenceKind, { prefix: string; ext: string; baseKb: number }> = {
  file: { prefix: 'Attachment', ext: 'pdf', baseKb: 85 },
  screenshot: { prefix: 'Screenshot', ext: 'png', baseKb: 110 },
  snapshot: { prefix: 'Snapshot', ext: 'jpg', baseKb: 160 },
  video: { prefix: 'Capture', ext: 'mp4', baseKb: 2400 },
};

/** Mocked capture: nothing is recorded, a generated item is linked to the selected step. */
export function captureEvidence(kind: EvidenceKind): void {
  const s = executionStore.getState();
  const stepId = s.selectedStepId;
  const step = stepId ? s.protocol.steps[stepId] : undefined;
  if (!stepId || !step) {
    ui.toast('warn', 'Select a step first, then add evidence to it.');
    return;
  }
  if (step.evidence === null) {
    ui.toast('warn', 'Evidence does not apply to this step.');
    return;
  }
  // Screenshot, snapshot and video open their sample capture modal, the attach button opens the upload modal.
  if (kind === 'file') {
    ui.open('upload');
    return;
  }
  ui.open('capture', { kind });
  return;
}

/** Old one-click sample capture (no modal). Kept for callers that want a generated item straight away. */
export function quickCaptureEvidence(kind: EvidenceKind): void {
  const s = executionStore.getState();
  const stepId = s.selectedStepId;
  if (!stepId) return;
  const n = s.evidence.length + 1;
  const m = sample[kind];
  const name = `${m.prefix}_${stepId}_${String(n).padStart(3, '0')}.${m.ext}`;
  const r = executionActions.addEvidence(stepId, { kind, name, sizeKb: m.baseKb + ((n * 37) % 90) });
  if (r.ok) ui.toast('success', `${name} added (sample capture)`);
  else ui.toast('error', r.errors[0] ?? 'Could not add evidence.');
}
