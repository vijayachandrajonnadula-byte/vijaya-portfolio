/**
 * NOT FROM FIGMA. Presentation helpers for evidence items: labels, the one-line description of an item, the filter model of
 * the evidence pane and gallery, and two small side tables for things the store does not keep (the picture produced by the
 * sample capture tools, and whether an item came from the document vault). Both are keyed by evidence id and live only in
 * this browser session, like the rest of the sample data.
 */
import { useSyncExternalStore } from 'react';
import type { EvidenceItem, EvidenceKind, ExecState } from '../model';
import { fmtDate, userName } from '../dialogs/common';

/** Reference wording: a "snapshot" is listed as a Photo, an "attachment" is a file. */
export const EV_KIND: Record<EvidenceKind, string> = { screenshot: 'Screenshot', snapshot: 'Photo', file: 'Attachment', video: 'Video' };

export type EvKindFilter = 'all' | 'ai' | EvidenceKind;
export const EV_FILTERS: { key: EvKindFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ai', label: 'AI Captured' },
  { key: 'screenshot', label: 'Screenshots' },
  { key: 'snapshot', label: 'Photos' },
  { key: 'video', label: 'Videos' },
  { key: 'file', label: 'Attachments' },
];

export const matchKind = (e: EvidenceItem, k: EvKindFilter): boolean => (k === 'all' ? true : k === 'ai' ? e.aiCaptured : e.kind === k);

export interface EvFilter {
  kind: EvKindFilter;
  query: string;
  /** Table number, or 0 for all. */
  table: number;
  /** Step id, or '' for all. */
  step: string;
  group: 'none' | 'table' | 'type';
}
export const EV_FILTER_DEFAULT: EvFilter = { kind: 'all', query: '', table: 0, step: '', group: 'none' };

export function applyFilter(s: ExecState, list: EvidenceItem[], f: EvFilter): EvidenceItem[] {
  const q = f.query.trim().toLowerCase();
  return list.filter((e) => {
    if (!matchKind(e, f.kind)) return false;
    if (q && !`${e.name} ${EV_KIND[e.kind]} ${stepsLabel(s, e)}`.toLowerCase().includes(q)) return false;
    if (f.step && !e.stepIds.includes(f.step)) return false;
    if (f.table && !e.stepIds.some((id) => s.protocol.steps[id]?.table === f.table)) return false;
    return true;
  });
}

/** "Table 1 / Row 2" for the steps an item is linked to (first two, then a count). */
export function stepsLabel(s: ExecState, e: EvidenceItem): string {
  const parts = e.stepIds.flatMap((id) => (s.protocol.steps[id] ? [`Table ${s.protocol.steps[id].table} / Row ${s.protocol.steps[id].row}`] : []));
  if (parts.length === 0) return 'Not linked';
  return parts.length > 2 ? `${parts.slice(0, 2).join(', ')} +${parts.length - 2}` : parts.join(', ');
}

/** "Screenshot · Table 1 / Row 1 · Executor · 10-May-2026" (reference pane sub line). */
export const itemSub = (s: ExecState, e: EvidenceItem): string => `${EV_KIND[e.kind]} · ${stepsLabel(s, e)} · ${userName(s, e.addedBy)} · ${fmtDate(e.when)}`;

/* ---------- side tables (picture and source of an item) ---------- */

type Listener = () => void;
const listeners = new Set<Listener>();
const images = new Map<string, string>();
const vault = new Set<string>();
let version = 0;
const bump = () => {
  version++;
  listeners.forEach((l) => l());
};
const subscribe = (l: Listener) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Keep the picture made by a sample capture for an item (a data URL). */
export function setEvidenceImage(id: string, dataUrl: string): void {
  images.set(id, dataUrl);
  bump();
}
export const getEvidenceImage = (id: string): string | undefined => images.get(id);
/** Mark an item as taken from the document vault. */
export function markVault(id: string): void {
  vault.add(id);
  bump();
}
export const evidenceSource = (id: string): 'Vault' | 'External' => (vault.has(id) ? 'Vault' : 'External');
/** Re-render when a picture or a source changes. */
export function useEvidenceSideTables(): number {
  return useSyncExternalStore(subscribe, () => version, () => version);
}
