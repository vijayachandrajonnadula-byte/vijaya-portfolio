/**
 * Electronic Execution, actions group: small helpers shared by the overlays. NOT FROM FIGMA (page-level composition).
 * Only design-system components and layout primitives are used here.
 */
import type { ReactNode } from 'react';
import { Box, Typography } from '../../../components/mui';
import { Chip } from '../../../components/data-display/Chip/Chip';
import type { ChipColor } from '../../../components/data-display/Chip/Chip';
import { Notification } from '../../../components/feedback/Notification/Notification';
import type { DiscrepancyStatus, ExecState, Step, StepState, Verdict } from '../model';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const two = (n: number) => String(n).padStart(2, '0');

/** "10 May 2026, 09:05" in UTC, so the sample timestamps read the same everywhere. */
export function fmtWhen(iso: string): string {
  const d = new Date(iso);
  return `${two(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${two(d.getUTCHours())}:${two(d.getUTCMinutes())}`;
}

export function userName(s: ExecState, id: string): string {
  if (id === 'ai.agent') return 'AI agent';
  return s.users.find((u) => u.id === id)?.name ?? id;
}

export const stepLabel = (step: Pick<Step, 'table' | 'row'>): string => `Table ${step.table} · Step ${step.row}`;

export const stepLabelById = (s: ExecState, id: string): string => {
  const st = s.protocol.steps[id];
  return st ? stepLabel(st) : id;
};

export const verdictLabel: Record<'pass' | 'fail' | 'na' | 'none', string> = { pass: 'Pass', fail: 'Fail', na: 'N/A', none: 'No verdict' };
const verdictColor: Record<'pass' | 'fail' | 'na' | 'none', ChipColor> = { pass: 'green', fail: 'red', na: 'gray', none: 'default' };

export function VerdictChip({ verdict }: { verdict: Verdict }) {
  const k = verdict ?? 'none';
  return <Chip label={verdictLabel[k]} color={verdictColor[k]} />;
}

const stateLabel: Record<StepState, string> = { pending: 'Pending', draft: 'Draft', aiFilled: 'AI-filled draft', recorded: 'Recorded' };
const stateColor: Record<StepState, ChipColor> = { pending: 'gray', draft: 'orange', aiFilled: 'ai', recorded: 'blue' };
export const StateChip = ({ state }: { state: StepState }) => <Chip label={stateLabel[state]} color={stateColor[state]} />;

export const discrepancyLabel: Record<DiscrepancyStatus, string> = {
  underAssessment: 'Under assessment',
  pendingReview: 'Pending review',
  closed: 'Closed',
  terminated: 'Terminated',
  obsoleted: 'Obsoleted',
};
const discrepancyColor: Record<DiscrepancyStatus, ChipColor> = {
  underAssessment: 'orange',
  pendingReview: 'amber',
  closed: 'green',
  terminated: 'gray',
  obsoleted: 'dark_gray',
};
export const DiscrepancyChip = ({ status }: { status: DiscrepancyStatus }) => <Chip label={discrepancyLabel[status]} color={discrepancyColor[status]} />;

/** Allowed moves, mirrors store.updateDiscrepancyStatus (the store enforces it; this only decides which buttons to show). */
export const nextStatuses: Record<DiscrepancyStatus, DiscrepancyStatus[]> = {
  underAssessment: ['pendingReview', 'terminated', 'obsoleted'],
  pendingReview: ['underAssessment', 'closed', 'terminated', 'obsoleted'],
  closed: [],
  terminated: [],
  obsoleted: [],
};

export function Section({ title, hint, children }: { title: ReactNode; hint?: ReactNode; children: ReactNode }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="heading6" sx={{ display: 'block' }}>{title}</Typography>
      {hint && <Typography variant="textM" sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}>{hint}</Typography>}
      <Box sx={{ mt: 1.5 }}>{children}</Box>
    </Box>
  );
}

/** Inline list of rule errors returned by a rejected store action. Renders nothing when empty. */
export function RuleErrors({ title, errors }: { title: string; errors: string[] }) {
  if (errors.length === 0) return null;
  return (
    <Box sx={{ mb: 2 }}>
      <Notification
        color="red"
        title={title}
        body={<Box component="ul" sx={{ m: 0, pl: 2.5 }}>{errors.map((e) => <li key={e}>{e}</li>)}</Box>}
      />
    </Box>
  );
}

/** Label / value row used in detail lists. */
export function Fact({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, py: 0.75, alignItems: 'baseline' }}>
      <Typography variant="textM" sx={{ width: 150, flexShrink: 0, color: 'text.secondary' }}>{label}</Typography>
      <Typography component="div" variant="textM" sx={{ minWidth: 0, flex: 1 }}>{children}</Typography>
    </Box>
  );
}
