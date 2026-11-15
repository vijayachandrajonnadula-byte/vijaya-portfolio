/**
 * Electronic Execution dialogs: shared helpers. NOT FROM FIGMA (page code, composed from design-system components only).
 */
import type { ReactNode } from 'react';
import { Box } from '../../../components/mui';
import { Chip } from '../../../components/data-display/Chip/Chip';
import { Notification } from '../../../components/feedback/Notification/Notification';
import { Checkbox } from '../../../components/form/Checkbox/Checkbox';
import { pt, textStyle } from '../../../theme/pulseTokens';
import type { EvidenceKind, ExecState, Step, Verdict } from '../model';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const two = (n: number): string => String(n).padStart(2, '0');

/** 10-May-2026 (UTC, the store clock is UTC). */
export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${two(d.getUTCDate())}-${MONTHS[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
}
export function fmtTime(iso: string): string {
  const d = new Date(iso);
  return `${two(d.getUTCHours())}:${two(d.getUTCMinutes())}`;
}
export const fmtWhen = (iso: string): string => `${fmtDate(iso)} ${fmtTime(iso)} UTC`;

/** Plain text of a rich-text result (the store keeps the editor's HTML). */
export const plainText = (html: string): string => html.replace(/<br\s*\/?>/gi, ' ').replace(/<\/p>\s*<p>/gi, ' ').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();

export const stepLabel = (s: Pick<Step, 'table' | 'row'>): string => `Table ${s.table} - Step ${s.row}`;

export function userName(s: ExecState, id: string): string {
  if (id === 'ai.agent') return 'AI agent';
  return s.users.find((u) => u.id === id)?.name ?? id;
}

export const KIND_LABEL: Record<EvidenceKind, string> = { screenshot: 'Screenshot', file: 'File', video: 'Video', snapshot: 'Snapshot' };
export const KINDS: EvidenceKind[] = ['screenshot', 'file', 'video', 'snapshot'];

/** Stack of form fields (Figma dialog body: gap 16). */
export function FormStack({ children }: { children: ReactNode }) {
  return <Box sx={{ display: 'flex', flexDirection: 'column', gap: pt.spacing.xxxl }}>{children}</Box>;
}

/** Secondary body text. */
export function Muted({ children }: { children: ReactNode }) {
  return <Box sx={{ ...textStyle('textM'), color: pt.formElements.content.secondaryTextColor }}>{children}</Box>;
}

/** Body text. */
export function Body({ children }: { children: ReactNode }) {
  return <Box sx={{ ...textStyle('textL'), color: pt.colors.neutral[900] }}>{children}</Box>;
}

/** Message lines (title content of a red Notification). */
export function ErrorLines({ messages }: { messages: string[] }) {
  return (
    <Box>
      {messages.map((m) => (
        <Box key={m}>{m}</Box>
      ))}
    </Box>
  );
}

/** Red inline banner listing one or more messages. Renders nothing when there are none. */
export function ErrorBanner({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;
  return <Notification color="red" variant="fill" fullWidth showClose={false} title={<ErrorLines messages={messages} />} />;
}

/** "I Accept" statement with its checkbox, in the Figma e-signature notice (blue fill). */
export function acceptStatement(checked: boolean, onChange: (v: boolean) => void, error: boolean, text: string) {
  return {
    title: 'I Accept',
    description: <Checkbox size="small" checked={checked} error={error} onChange={(e) => onChange(e.target.checked)} label={text} />,
  };
}

export const LEGAL_TEXT = 'My electronic signature is legally binding and equivalent to my handwritten signature.';

export function VerdictStatus({ verdict }: { verdict: Verdict }) {
  if (verdict === 'pass') return <Chip label="Pass" color="green" size="xsmall" />;
  if (verdict === 'fail') return <Chip label="Fail" color="red" size="xsmall" />;
  if (verdict === 'na') return <Chip label="N/A" color="gray" size="xsmall" />;
  return <Chip label="No result" color="gray" size="xsmall" />;
}
