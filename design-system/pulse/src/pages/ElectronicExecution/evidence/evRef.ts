/**
 * NOT FROM FIGMA. Colours and fixed sizes of the evidence surfaces of the Electronic Execution page (evidence pane, gallery,
 * full-size viewer, file slider, capture modals, upload attachment modal), measured from the reference prototype at 1440x900
 * (S\ref\overlays\spec.md). The shared reference colours live in ../refTheme.ts; only values that exist nowhere else are here.
 * Logged in docs/figma-deviations.md.
 */
import { fonts, ref } from '../refTheme';

export const ev = {
  font: fonts.shell,
  /** Pane left border (reference .sop-pane). */
  paneBorder: '#C2C7D0',
  chipHover: '#F3F6FC',
  /** Scrollbar thumb of the reference lists. */
  thumb: '#C8D2E5',
  // capture
  captureStage: '#0E1526',
  mediaStage: '#0B1220',
  phTitle: '#DFE7F5',
  phSub: '#9FB0CC',
  toolGroup: '#EEF1F7',
  toolSettings: '#F7F9FC',
  seg: '#5B6B86',
  // gallery / viewer / slider
  galPreview: '#0C1426',
  viewerStage: '#0B1322',
  viewerScrim: 'rgba(8,12,28,.82)',
  sliderScrim: 'rgba(15,30,80,.28)',
  sliderHead: '#F7F9FC',
  thumbBg: '#F1F5F9',
  zoomPill: 'rgba(8,12,28,.72)',
  navBtn: 'rgba(255,255,255,.16)',
  navBtnHover: 'rgba(255,255,255,.3)',
  sliderShadow: '-14px 0 40px rgba(15,30,80,.22)',
  modalShadow: '0 8px 32px rgba(30,58,110,.16)',
  popShadow: '0 12px 30px rgba(15,30,80,.2)',
  cardHover: '0 4px 14px rgba(15,30,80,.1)',
  note: '#1B2746',
  // sop page
  sopBody: '#E4E7EE',
  sopHead: '#2E74B5',
  sopRule: '#ECECEC',
  sopText: '#1A1A1A',
  sopFoot: '#9A9A9A',
  sopSmall: '#8A8A8A',
  // upload
  dashed: ref.blue5,
  attachedRow: '#E7F6EE',
  tdLine: '#EEF1F6',
  faint: '#B7BECE',
  faint2: '#C8D2E4',
  thHover: '#E8EEF7',
  folder: '#B45309',
  focusBlue: '#2563EB',
  danger: '#F04438',
  dangerBg: '#FEF3F2',
  alert: '#E5484D',
  // fixed sizes (px)
  paneBasis: '42%',
} as const;

/** Default capture date format used on the sample watermark. */
export function stamp(d = new Date()): string {
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
  let h = d.getHours();
  const ap = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getDate()} ${m} ${d.getFullYear()} ${p(h)}:${p(d.getMinutes())}:${p(d.getSeconds())} ${ap}`;
}
