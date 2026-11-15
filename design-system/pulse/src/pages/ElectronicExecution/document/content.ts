/**
 * NOT FROM FIGMA. Wording of the Word-style document (purpose text, prerequisites, figure captions). Own wording for the
 * sample protocol in model.ts; the structure and lengths follow the reference prototype. Edit text here.
 */
import { CLOCK_BASE } from '../model';
import type { ExecState } from '../model';

/** Page numbers shown in the table of contents (sections 1.0, 3.0 to 8.0; decorative, the page has no real pagination). */
export const TOC_PAGES = [3, 5, 8, 10, 12, 14, 16];

export type FigureKind = 'panel' | 'blender' | 'valve' | 'certificate' | 'trial' | 'form';

/** One figure per table, in table order. */
export const FIGURES: { kind: FigureKind; caption: string }[] = [
  { kind: 'panel', caption: 'Control panel layout, speed verification.' },
  { kind: 'blender', caption: 'Blender shell and sampling points, mixing performance.' },
  { kind: 'valve', caption: 'Discharge valve and collection container.' },
  { kind: 'certificate', caption: 'Calibration certificate reference.' },
  { kind: 'trial', caption: 'Blender at the working fill level, performance trial.' },
  { kind: 'form', caption: 'Sign-off checklist.' },
];

/** Prerequisite lines; the first part of each pair is plain text, `bold` parts render in bold. */
export function prerequisites(equipmentId: string, equipment: string): { parts: { text: string; bold?: boolean }[] }[] {
  return [
    { parts: [{ text: 'Confirm ' }, { text: `${equipmentId} (${equipment})`, bold: true }, { text: ' is clean, released for qualification and free of residual product.' }] },
    { parts: [{ text: 'Verify all measuring instruments are within calibration: tachometer ' }, { text: 'CAL-001', bold: true }, { text: ', valid through 14-Apr-2027.' }] },
    { parts: [{ text: 'Ensure ambient conditions are within range (20–25 °C, RH 30–70%) and the area is logged for qualification activity.' }] },
    { parts: [{ text: 'Review the previous table results and confirm no open discrepancy blocks execution of this table.' }] },
  ];
}

export const PURPOSE = {
  before: 'This Operational Qualification (OQ) protocol verifies that the V-cone blender ',
  after: ' operates within its validated speed settings (5, 10 and 20 RPM) with a measured deviation no greater than ±5%.',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "10-May-2026" from the sample clock base. */
export const approvedOn = (): string => {
  const d = new Date(CLOCK_BASE);
  return `${String(d.getUTCDate()).padStart(2, '0')}-${MONTHS[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
};

/** "10-May 09:03" (UTC) for the signature cell. */
export const shortWhen = (iso: string): string => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}-${MONTHS[d.getUTCMonth()]} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())} UTC`;
};

export const docStatus = (percentRecorded: number, recorded: number): string => (percentRecorded >= 100 ? 'Complete' : recorded > 0 ? 'In Progress' : 'Not started');

/** Rows of the information table: [key, value, key, value]; the last row has no second pair (empty key). */
export function infoRows(s: ExecState, status: string): [string, string, string, string][] {
  const p = s.protocol;
  const executor = s.users.find((u) => u.canExecute)?.name ?? '';
  const verifier = s.users.find((u) => u.role === 'Verifier')?.name ?? '';
  return [
    ['Document No.', p.docNumber, 'Title', '—'],
    ['Equipment', `${p.equipmentId} (${p.equipment})`, 'Reference', 'URS-001 Rev 02'],
    ['Revision', `Rev 02, ${executor}`, 'Verifier', verifier],
    ['Approved On', approvedOn(), 'Status', status],
    ['Protocol', p.site, '', ''],
  ];
}
