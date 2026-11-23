/**
 * NOT FROM FIGMA. Generic sample rows for the Evidence & Activity list (the real screen shows a long list of captured items; the
 * sample store starts with none). They are display-only (not in the store, not openable), use roles instead of people, and follow
 * the kind filter and the count of the pane. Items the user adds through the media bar are listed first, from the store.
 */
import type { ReactNode } from 'react';
import { File01Icon, PlayIcon, Pdf02Icon, Xls02Icon } from '../../../icons';
import { fw } from '../../../theme/typography';
import type { EvidenceKind } from '../model';
import { EV_KIND } from './evidenceMeta';
import type { EvKindFilter } from './evidenceMeta';

export interface SampleRow {
  id: string;
  kind: EvidenceKind;
  name: string;
  /** Lower-case file label shown in the first part of the meta line (pdf, xls, tiff ...) for file items. */
  ext?: string;
  table: number;
  row: number;
  by: string;
  when: string;
  ai?: boolean;
  /** Tile: an icon on a light tile, or a dark screen picture. */
  tile: 'pdf' | 'xls' | 'file' | 'play' | 'screen';
}

const W = '10-May-2026';
export const SAMPLE_ROWS: SampleRow[] = [
  { id: 's01', kind: 'file', name: 'Cal.pdf', ext: 'pdf', table: 1, row: 1, by: 'Executor', when: W, tile: 'pdf' },
  { id: 's02', kind: 'file', name: 'Calibration Certificate Cal-CRT-2026-0119', table: 1, row: 2, by: 'Executor', when: W, tile: 'screen' },
  { id: 's03', kind: 'screenshot', name: 'URS-03 Speed Verification §4.2', table: 1, row: 1, by: 'Executor', when: W, tile: 'screen', ai: true },
  { id: 's04', kind: 'file', name: 'Equipment Log Sheet EL-118', ext: 'pdf', table: 3, row: 2, by: 'Executor', when: W, tile: 'pdf' },
  { id: 's05', kind: 'snapshot', name: 'Equipment Log Sheet EL-118', table: 3, row: 2, by: 'Executor', when: W, tile: 'screen' },
  { id: 's06', kind: 'file', name: 'Equipment Log Sheet EL-118', ext: 'xls', table: 3, row: 2, by: 'Executor', when: W, tile: 'xls' },
  { id: 's07', kind: 'file', name: 'Equipment Log Sheet EL-118', ext: 'pdf', table: 3, row: 2, by: 'Verifier', when: W, tile: 'pdf' },
  { id: 's08', kind: 'snapshot', name: 'Equipment Log Sheet EL-118', table: 3, row: 2, by: 'Executor', when: W, tile: 'screen' },
  { id: 's09', kind: 'video', name: 'Stabilized Run · 0:14', table: 1, row: 2, by: 'Executor', when: W, tile: 'play' },
  { id: 's10', kind: 'file', name: 'Autoclave Cycle Printout AC-204', ext: 'tiff', table: 4, row: 2, by: 'QA Lead', when: W, tile: 'file' },
  { id: 's11', kind: 'screenshot', name: 'Batch Record Excerpt R-5.0', table: 5, row: 1, by: 'Executor', when: W, tile: 'screen', ai: true },
  { id: 's12', kind: 'snapshot', name: 'Equipment Log Sheet EL-118', table: 3, row: 3, by: 'Executor', when: W, tile: 'screen' },
];

/**
 * Display-only suggestions for a step or table that none of the 12 rows above belongs to, so a step-scoped pane is never empty:
 * the kinds of evidence this step would normally carry (a reading, a set-up photo, a supporting file, a short run recording).
 */
export function suggestedRows(table: number, row = 1): SampleRow[] {
  const id = `sg-${table}-${row}`;
  const at = `Table ${table} / Row ${row}`;
  return [
    { id: `${id}-a`, kind: 'screenshot', name: `Instrument reading · ${at}`, table, row, by: 'Executor', when: W, tile: 'screen', ai: true },
    { id: `${id}-b`, kind: 'snapshot', name: `Set-up photo · ${at}`, table, row, by: 'Executor', when: W, tile: 'screen' },
    { id: `${id}-c`, kind: 'file', name: `Supporting record · ${at}`, ext: 'pdf', table, row, by: 'Executor', when: W, tile: 'pdf' },
    { id: `${id}-d`, kind: 'video', name: 'Run recording · 0:12', table, row, by: 'Executor', when: W, tile: 'play' },
  ];
}

/** Same rule as the store items: the AI Captured tab lists AI rows, the other tabs follow the kind. */
export const sampleMatches = (r: SampleRow, k: EvKindFilter): boolean => (k === 'all' ? true : k === 'ai' ? !!r.ai : r.kind === k);

/** "pdf · Table 1 / Row 1 · Executor · 10-May-2026" (files lead with their extension, the rest with their kind). */
export const sampleMeta = (r: SampleRow): string => `${r.ext ?? EV_KIND[r.kind]} · Table ${r.table} / Row ${r.row} · ${r.by} · ${r.when}`;

/** 48 x 36 tile of a sample row: an outline icon on a light tile, or a small dark screen picture. */
export function SampleTile({ tile }: { tile: SampleRow['tile'] }): ReactNode {
  if (tile === 'screen') {
    return (
      <svg viewBox="0 0 48 36" width="100%" height="100%" aria-hidden style={{ display: 'block' }}>
        <rect width="48" height="36" fill="#0b1220" />
        <rect x="3" y="3" width="42" height="4" fill="#1e2a44" />
        <rect x="4" y="10" width="12" height="3" fill="#2a3a5c" />
        <text x="5" y="23" fontSize="9" fontWeight={fw.bold} fontFamily="Inter, sans-serif" fill="#22c55e">5.04</text>
        <rect x="22" y="11" width="21" height="10" fill="#141f38" />
        <rect x="24" y="14" width="14" height="2" fill="#38bdf8" />
        <rect x="24" y="24" width="18" height="2" fill="#22c55e" />
        <rect x="4" y="28" width="10" height="2" fill="#22c55e" />
      </svg>
    );
  }
  const Icon = tile === 'pdf' ? Pdf02Icon : tile === 'xls' ? Xls02Icon : tile === 'play' ? PlayIcon : File01Icon;
  return (
    <span style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', color: '#0f172a' }}>
      <Icon size={24} />
    </span>
  );
}
