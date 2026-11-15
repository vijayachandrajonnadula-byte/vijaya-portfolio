/**
 * Content for the Electronic execution case study. Every claim here is something the running app does or a count taken from
 * its code. The app is a design-system build of a prototype, not a shipped product, and the page says so.
 */
import type { Slot } from './pulseImages';

/** The running app, hosted with the PULSE component gallery. */
export const appUrl = '/pulse-gallery/index.html#/ElectronicExecution';
export const galleryUrl = '/pulse-gallery/index.html';

const dir = '/images/projects/execution';

export const eeImages: Record<string, Slot> = {
  execution: {
    src: `${dir}/execution.jpg`,
    alt: 'The execution screen: left navigation, breadcrumb and status bar, the protocol as a document card, and the Evidence and Activity pane on the right',
    caption: 'The execution screen. The protocol reads as a document, with the execution panel collapsed to a strip and the evidence pane open beside it.',
    hint: 'Execution screen, 1440 × 900',
  },
  sign: {
    src: `${dir}/e-sign.jpg`,
    alt: 'The e-signature dialog over the execution screen: signer, reason, user id, password, comments and the accept statement',
    caption: 'Recording a step opens the e-signature: who signs, the date and time, a reason and an explicit accept.',
    hint: 'E-signature dialog, 1440 × 900',
  },
  discrepancy: {
    src: `${dir}/discrepancy.jpg`,
    alt: 'A prompt asking whether to raise a discrepancy after a step was recorded as failed, over the AI agent panel',
    caption: 'A Fail does not pass quietly: the prompt asks for a discrepancy, and a Fail without one has to be justified.',
    hint: 'Discrepancy prompt, 1440 × 900',
  },
  ai: {
    src: `${dir}/ai-agent.jpg`,
    alt: 'The AI agent panel with a banner saying the result is a draft the executor must review and record, the input and scope choices and the run button',
    caption: 'The assistant proposes. The banner, the draft state and the per-step Record button keep the person responsible.',
    hint: 'AI agent panel, 1440 × 900',
  },
  status: {
    src: `${dir}/status.jpg`,
    alt: 'The execution status panel: recorded and verified progress, counts by verdict, drafts, AI-filled steps, open discrepancies and per-table progress',
    caption: 'Execution status: where the run stands, by verdict and by table.',
    hint: 'Execution status, 1440 × 900',
  },
  metrics: {
    src: `${dir}/metrics.jpg`,
    alt: 'The metrics panel with two donut charts for step status and verdict split, and a bar for each table coloured by verdict',
    caption: 'Metrics: step status and verdict split as donuts, one bar per table.',
    hint: 'Metrics, 1440 × 900',
  },
  audit: {
    src: `${dir}/audit.jpg`,
    alt: 'The details panel with the task and equipment fields and an icon rail for switching to the audit trail',
    caption: 'Details: the task and equipment on one side, and the audit trail one tab away.',
    hint: 'Details panel, 1440 × 900',
  },
  split: {
    src: `${dir}/split.jpg`,
    alt: 'The split execution panel, where tables or rows are given to different executors, with the rule that a table taken whole cannot be reused',
    caption: 'Split execution: give tables or rows to different executors, with the overlap rules enforced.',
    hint: 'Split execution, 1440 × 900',
  },
};

export const executionSteps = [
  { title: 'Open the protocol', body: 'The protocol arrives as a document: an information block, then tables of numbered steps, each with instructions, an expected result and a reference.' },
  { title: 'Work a step', body: 'The executor does the work, writes the actual result, sets Pass, Fail or N/A and attaches the evidence the step calls for.' },
  { title: 'Record and sign', body: 'Recording locks the step behind an e-signature: a reason, the signer’s credentials and an explicit accept. The signature carries who, when and why.' },
  { title: 'Verify the table', body: 'A different person verifies each table once every step in it is recorded. Editing a recorded step later clears that verification.' },
  { title: 'Raise exceptions', body: 'A Fail prompts a discrepancy, which moves through its own states until it is closed, terminated or made obsolete.' },
  { title: 'Review the run', body: 'Status, metrics and the audit trail show where the run stands and how it got there, ready for review and approval.' },
];

export const stepStates = [
  { state: 'Pending', body: 'Nothing entered yet.' },
  { state: 'Draft', body: 'A result is saved but not recorded. It can still change freely.' },
  { state: 'AI-filled', body: 'The assistant proposed a result. It is a draft until the executor records it.' },
  { state: 'Recorded', body: 'E-signed and locked. Changing it needs an edit with a mandatory reason, and creates a new version.' },
  { state: 'Verified', body: 'The table is verified by a second person. Any later edit voids it.' },
];

export const decisions = [
  { title: 'The document stays the document', body: 'People executing a protocol think in the protocol’s own pages and tables. So the screen keeps the document on the left and adds a panel for the one step in hand, rather than turning the protocol into a form.' },
  { title: 'Make the safe path the only path', body: 'You cannot record without a result, a verdict and the evidence a step calls for. The screen says what is missing, in place, before the e-signature ever opens.' },
  { title: 'A signature means something', body: 'Reason, credentials and an explicit accept sit together, with the signer and the time at the top. The record shows who signed, when and why.' },
  { title: 'Change is allowed, never silent', body: 'A recorded step can be edited with a reason. It becomes a new version, the old one stays in the history, and verification is voided.' },
  { title: 'The assistant never signs', body: 'AI output is a draft with a visible state. Recording it is a person’s action, and the signature says it was AI-assisted.' },
  { title: 'Oversight is part of the product', body: 'Status, metrics and the audit trail are one tap from the work, so the person running the protocol sees the same picture a reviewer will.' },
];

/** Rules the state logic enforces. Each one is also exercised by the app's own self-check. */
export const rules: { rule: string; why: string }[] = [
  { rule: 'A step cannot be recorded without an actual result, a verdict and the evidence it calls for', why: 'Recording is a statement of fact, so the facts have to be there first.' },
  { rule: 'A Fail prompts a discrepancy', why: 'A failure that disappears into a table is the thing a reviewer most needs to find.' },
  { rule: 'Editing a recorded step needs a reason, and voids that table’s verification', why: 'The second pair of eyes only counts for what they saw.' },
  { rule: 'The person who verifies a table cannot be the one who recorded it', why: 'Verification has to be independent to be worth anything.' },
  { rule: 'A table taken as a whole cannot be reused in a split, and a row cannot sit in two splits', why: 'Two people must never own the same step.' },
  { rule: 'A later table can be locked until an earlier table is verified', why: 'Some protocols are a gate: later work depends on an earlier result.' },
  { rule: 'Spectators are read-only', why: 'Watching a live run must never change it.' },
  { rule: 'Unsaved changes are guarded when you move to another step', why: 'Work is not lost, and not saved by accident.' },
];

export const componentMap: { need: string; component: string }[] = [
  { need: 'The app frame: left navigation, top bar, breadcrumbs', component: 'LeftNav, Header and Breadcrumbs, each given an app appearance, inside the AppShell template' },
  { need: 'The status bar, toolbar and pill tabs', component: 'A set of small chrome components (segmented toggle, chrome buttons, pill tabs) built from PULSE tokens' },
  { need: 'The protocol as a document', component: 'A document card and execution tables, built as new components' },
  { need: 'Writing the actual result', component: 'A compact rich-text editor, plus Checkbox, Radio and Select for control steps' },
  { need: 'Pass / Fail / N/A and the view toggles', component: 'ToggleButtonGroup' },
  { need: 'Signing and verifying', component: 'ElectronicSignature in a compact mode, with TextField, Select and Checkbox' },
  { need: 'Small confirmations: Fail prompt, unsaved changes, edit reason', component: 'CompactDialog' },
  { need: 'Side surfaces: status, metrics, details, split, AI, history', component: 'Flyout, SideSurface and SlidePanel' },
  { need: 'Evidence gallery and viewer', component: 'FullScreenSurface' },
  { need: 'State and verdict badges', component: 'Chip and Status' },
  { need: 'Progress and counts', component: 'ProgressBar, KPICard and the Charts donut and bar' },
  { need: 'Warnings, errors and the AI draft banner', component: 'Notification, including the snackbar for toasts' },
  { need: 'People on the run', component: 'Avatar and Tooltip' },
  { need: 'Menus and zoom', component: 'DropdownMenu and ZoomControl' },
];

export const limits = [
  'Nothing here is a validated system. It is a design and working prototype of the interface and its rules, not a compliant product.',
  'The password is only checked for being present, as in the original prototype. There is no sign-in, no server and no stored record.',
  'The AI agent is scripted sample output. No file is read and no tab is shared, and the panel says so.',
  'The prototype’s exception modes, Protocol Error and Re-Execute, its spreadsheet-style document view and live-session timing are not rebuilt. The first two are labels only.',
  'Evidence capture is mocked: you can crop, mask, highlight and watermark a generated sample picture, but nothing is read from your screen.',
  'It is built for a workstation. At phone width it works but is cramped, and I have not tuned it.',
  'It has not been tested with people who execute protocols, and I have not measured time saved.',
];

export const nextSteps = [
  'Test the record and sign flow with people who execute protocols, and time it against the paper and the earlier prototype.',
  'Build the two exception modes properly, with the correction reason and the re-run history.',
  'Replace the mocked evidence capture with a real one, and check the screenshot tools against the evidence rules.',
  'Run a keyboard and screen-reader pass on the tables, which are not yet keyboard-selectable by row.',
];
