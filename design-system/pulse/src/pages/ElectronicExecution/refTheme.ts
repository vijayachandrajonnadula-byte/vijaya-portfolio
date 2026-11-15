/**
 * NOT FROM FIGMA. Colours, fonts and fixed sizes of the Electronic Execution page shell and Word-style document,
 * taken from the reference prototype (measured at 1440x900). Defined once here; the page code never writes hex values.
 * Logged in docs/figma-deviations.md.
 */

/** Colours "from the reference prototype". */
export const ref = {
  // brand blues
  navy: '#0A1F3D', // header
  navy2: '#1E3A6E',
  blue3: '#2F5496',
  blue4: '#3D6BB5',
  blue5: '#7DA3D6',
  blue6: '#C3D6EC',
  tint: '#EAF0F8',
  tint2: '#F4F7FB',
  // neutrals
  ink: '#0A0D2E',
  muted: '#8A96A8',
  muted2: '#A9B4C7',
  line: '#DFE5EB',
  bg: '#F4F7FA',
  grayTint: '#F1F2F4',
  grayIc: '#5B6472',
  white: '#FFFFFF',
  black: '#000000',
  // media bar
  mediaBar: '#E6EFFB',
  mediaBarLine: '#BFD3F0',
  presenceLine: '#E2E8F2',
  live: '#E1113B',
  // document viewer
  viewer: '#D8D8D8',
  pageBorder: '#CDCDCD',
  word: '#2E74B5',
  wordDark: '#1F4E79',
  wordTable: '#8FAADC',
  wordKey: '#D9E2F3',
  rule: '#BFBFBF',
  pageGrey: '#7A7A7A',
  subGrey: '#666666',
  tocGrey: '#444444',
  // states
  pass: '#12B76A',
  passBg: '#ECFDF5',
  passText: '#166534',
  draft: '#F79009',
  draftBg: '#FFFAEB',
  draftText: '#B45309',
  blank: '#FEF9C3',
  // table
  thText: '#3A3F4B',
  zebra: '#FAFAFB',
  rowHover: '#F2F4F7',
  rowSelectedHover: '#DBE8F8',
  aiRow: '#F4F7FB',
  esignFg: '#1B4E9C',
  esignBg: '#E7F0FB',
  verifiedFg: '#6C3FB5',
  verifiedBg: '#EFE6FA',
  failFg: '#D92D20',
  verifyRow: '#F5F8FF',
  verifyLabel: '#5A6685',
  verifyButton: '#0D7A4A',
  verifyButtonOff: '#C3CBD9',
  // locked table
  lockBg: '#F8F9FB',
  lockBorder: '#CBD5E1',
  lockBar: '#94A3B8',
  lockText: '#64748B',
  lockCell: '#9BA3B2',
  // figure
  figBorder: '#D9E2EC',
  figCaption: '#666666',
  // media pill icon chips: [rest background, glyph]
  attach: ['#F4F7FB', '#2F5496', '#2F5496'],
  screenshot: ['#ECFDF5', '#0D7A4A', '#0D7A4A'],
  snapshot: ['#FBEEDD', '#B45309', '#B45309'],
  video: ['#EFE6FA', '#6C3FB5', '#6C3FB5'],
  // record button
  recordFrom: '#0D7A4A',
  recordTo: '#13A073',
  recordShadow: 'rgba(15,130,89,.28)',
  // avatars
  avatarColors: ['#0F8259', '#B45309', '#6C3FB5', '#1B4E9C'],
  // shadows
  pageShadow: '0 0 1px rgba(0,0,0,.4), 0 4px 24px rgba(0,0,0,.18)',
  popShadow: '0 12px 32px rgba(15,30,80,.22)',
} as const;

/** Page shell font (Inter is the system font) and the Word page font stack. */
export const fonts = {
  shell: '"Inter Variable", Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  word: 'Calibri, "Segoe UI", sans-serif',
  wordPlain: 'Calibri, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  monoPlain: 'monospace',
} as const;

/** Fixed sizes of the shell (px). */
export const size = {
  header: 54,
  mediaBar: 56,
  panel: 420,
  /** Collapsed execution panel strip. */
  strip: 48,
  panelH: 300,
  docToolbar: 44,
} as const;

/** Extra colours of the execution panel (from the reference prototype); the shared ones are in `ref` above. */
export const panelRef = {
  readBorder: '#DAE6F7',
  expBg: '#F2FAF6',
  expBorder: '#D2EBDD',
  areaBg: '#FCFDFF',
  eviLink: '#1F4E79',
  writing: '#7C3AED',
  writingBg: '#F5F3FF',
  failBg: '#FEF3F2',
  fail: '#F04438',
  shadowInset: '#2F5496',
  menuShadow: '0 10px 30px rgba(15,45,107,.18)',
  dotsShadow: '0 4px 18px rgba(0,0,0,.13)',
  controlFont: 'Calibri, sans-serif',
} as const;

/**
 * Colours of the bars (status bar, toolbar, breadcrumb row), measured on the real Pulse application screenshot (1440 x 1024).
 * They are the Pulse palette (#1e3a6e navy, #d3e0f2 field border, #e2e8f0 divider, #f6f8fc surface); icon tints are the app's.
 */
export const barRef = {
  navy: '#1E3A6E',
  surface: '#F6F8FC',
  line: '#E2E8F0',
  fieldLine: '#D3E0F2',
  btnLine: '#CBD5E1',
  soft: '#EEF3FB',
  ink: '#0F172A',
  muted: '#64748B',
  focus: '#3B82F6',
  live: '#15803D',
  liveBg: '#F0FDF4',
  liveLine: '#BBF7D0',
  more: '#F1F5F9',
  moreText: '#475569',
  grip: '#6E7D92',
  avatars: ['#2563EB', '#0F8259', '#B45309', '#6C3FB5', '#C2410C'],
  attach: '#4077ED',
  screenshot: '#30C968',
  snapshot: '#F6AA2A',
  video: '#6E7D92',
} as const;

/** Extra values of the document pane (the real application's document card, measured on the screenshot). */
export const docRef = {
  radioAccent: '#333333',
  pageNumber: 'Page 1 of 18',
  scrollThumb: '#C8D2E5',
  /** App title in the header and the AI sparkle tint. */
  brandTitle: '#02216E',
  aiPurple: '#7C3AED',
  /** Work-area surface behind the document card and the collapsed panel strip. */
  canvas: '#F4F7FA',
  ink: '#1A1A26',
  runHead: '#808C99',
  subtitle: '#667380',
  link: '#335999',
  body: '#404752',
  infoLabel: '#33404D',
  infoValue: '#4D5966',
  infoLabelBg: '#F1F4F8',
  line: '#E2E8F0',
  navy: '#1E3A6E',
} as const;

/** Card width (CSS) and padding for each fit mode: auto fills the column, compact is at most 560px, full is at least 840px (the column scrolls). */
export const FIT = {
  auto: { width: '100%', pad: '24px 32px 40px', hdr: 32 },
  compact: { width: '560px', pad: '24px 28px 40px', hdr: 28 },
  full: { width: 'max(100%, 840px)', pad: '32px 48px 48px', hdr: 48 },
} as const;
export type FitMode = keyof typeof FIT;

/** from the reference prototype: history / evidence drawers (dialogs). */
export const drawerRef = {
  header: '#1B3B6F',
  subText: '#8A96A8',
  thBg: '#F1F3F1',
  thBorder: '#D8DEE3',
  tdBorder: '#E4E8EC',
  viewerBg: '#0B1220',
} as const;

/**
 * from the reference prototype: side surfaces (status slider, AI agent panel, details, metrics, split / verification drawer,
 * user picker, toasts, edit bar). Measured at 1440x900. Reference hex only where no Pulse token matches.
 */
export const actRef = {
  // scrims (rgba(15,30,80,a)) and blur
  scrimStatus: 'rgba(15,30,80,.28)',
  scrimDrawer: 'rgba(15,30,80,.38)',
  scrimPicker: 'rgba(15,30,80,.4)',
  scrimPanel: 'rgba(15,30,80,.45)',
  scrimModal: 'rgba(15,30,80,.55)',
  blur: 2,
  // shadows
  shadowPanel: '-8px 0 32px rgba(15,30,80,.18)',
  shadowSlide: '-6px 0 28px rgba(15,30,80,.18)',
  shadowPicker: '-10px 0 36px rgba(15,30,80,.25)',
  shadowToast: '0 8px 32px rgba(30,58,110,.16)',
  shadowBar: '0 12px 34px rgba(15,30,80,.35)',
  // headers
  annotationSub: '#A8C8F2',
  statusHead: 'linear-gradient(135deg, #0A1F3D, #2F5496)',
  aiHead: 'linear-gradient(135deg, #1E3A6E, #2F5496)',
  statusProg: 'linear-gradient(#F4F7FB, #FFFFFF)',
  statusBar: 'linear-gradient(90deg, #2F5496, #3D6BB5)',
  // status KPI card icon tiles
  cardTotal: '#1B2A4E',
  cardDone: '#12B76A',
  cardPending: '#8E97A8',
  cardFail: '#F04438',
  cardEvidence: '#3D6BB5',
  cardAi: '#2F5496',
  // AI panel
  aiRunBg: '#1E3A5F',
  aiRunBorder: '#3B82F6',
  aiRunText: '#93C5FD',
  aiRunHover: '#1E4A8F',
  aiTint: '#F4F7FB',
  aiModeTrack: '#EEE7FE',
  aiModeBorder: '#E0D6FB',
  aiItemOn: '#F8F5FF',
  aiOptDesc: '#9CA3AF',
  aiDropBorder: '#C3D6EC',
  aiPassRing: '#86EFAC',
  aiRunningBg: '#DBEAFE',
  aiRunningBorder: '#93C5FD',
  aiRunningText: '#1D4ED8',
  aiVidTile: '#FEF3F2',
  aiLiveTile: '#ECFDF5',
  bulkFrom: '#12B76A',
  bulkTo: '#2EB673',
  bulkHover: 'linear-gradient(135deg, #0A6B47, #12B76A)',
  bulkShadow: '0 2px 6px rgba(15,130,89,.3)',
  // split / verification drawer
  stripBg: '#EEF4FF',
  stripLine: '#DCE6F8',
  stripMuted: '#5B7099',
  dashed: '#93B4E8',
  dangerLine: '#FECACA',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  dangerHover: '#FEE2E2',
  viewBtnLine: '#A9B4C7',
  viewBtnHoverLine: '#9DB3D6',
  viewBtnHoverBg: '#F9FAFB',
  submitHover: '#1E40AF',
  rowHover: '#F8FAFF',
  optHover: '#F1F5FF',
  cancelLine: '#D1D5DB',
  avatars: ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
  // metrics
  metricPending: '#F87171',
  metricWip: '#4CAF50',
  metricDone: '#818CF8',
  metricTotal: '#6366F1',
  metricRows: '#EA7B36',
  metricExec: '#A3CB38',
  metricPass: '#4CAF50',
  metricFail: '#EF4444',
  metricFailNoDisc: '#DC2626',
  metricDisc: '#93C5FD',
  metricOpen: '#C4B5FD',
  metricNa: '#CBD5E1',
  metricNoResult: '#F9A8D4',
  metricPend: '#FACC15',
  metricRate: '#8B5CF6',
  metricCyan: '#06B6D4',
  // toasts
  toastDefault: '#0A1F3D',
  toastSuccess: '#12B76A',
  toastError: '#F04438',
  toastWarn: '#B45309',
  toastAi: '#1E3A6E',
  // copy result / transfer panels
  fieldLine: '#D1D9EE',
  fieldFocus: '#2563EB',
  required: '#DC2626',
  emptyText: '#94A3B8',
  panelFootBg: '#F4F7FB',
  // create discrepancy panel
  createScrim: 'rgba(15,23,42,.45)',
  createInk: '#0F172A',
  createLine: '#E2E8F0',
  // edit bar
  barGhost: 'rgba(255,255,255,.15)',
  barBlue: '#2F5496',
} as const;