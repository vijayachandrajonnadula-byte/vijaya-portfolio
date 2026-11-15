/**
 * Electronic Execution: types and generic sample data.
 *
 * NOT FROM FIGMA. This is the domain model for the Electronic Execution sample app (a GxP validation
 * protocol executed step by step: actual result, Pass/Fail/N/A verdict, evidence, e-signature,
 * independent verification, history, discrepancies, split execution, scripted AI fill).
 * All names, ids and people are generic: users are roles, ids are EQ-001 / DOC-001 style.
 */

export type Verdict = 'pass' | 'fail' | 'na' | null;
export type StepState = 'pending' | 'draft' | 'aiFilled' | 'recorded';
export type SignedBy = 'user' | 'ai' | 'na';
export type ControlType = 'checkbox' | 'radio' | 'dropdown';
export type EvidenceKind = 'screenshot' | 'file' | 'video' | 'snapshot';
export type DiscrepancyStatus = 'underAssessment' | 'pendingReview' | 'closed' | 'terminated' | 'obsoleted';
export type DiscrepancySeverity = 'major' | 'moderate' | 'minor';
/** executor: normal; spectator: read-only live view; protocolError / reExecute: exception tasks (stubs, see store.ts). */
export type ExecutionMode = 'executor' | 'spectator' | 'protocolError' | 'reExecute';

export type RoleName = 'Executor' | 'Verifier' | 'Reviewer' | 'Approver' | 'QA Lead';

export interface User {
  id: string;
  name: string;
  role: RoleName;
  initials: string;
  canExecute: boolean;
  canVerify: boolean;
}

export interface Signature {
  /** Display name (a role). */
  who: string;
  userId: string;
  role: string;
  /** ISO timestamp. */
  when: string;
  /** Meaning of the signature (the e-sign reason, or the AI / N/A marker). */
  meaning: string;
  by: SignedBy;
}

export interface StepControl {
  type: ControlType;
  options: string[];
}

/** Scripted sample output of the AI agent for a step. Not a model call. */
export interface AiSuggestion {
  actual: string;
  verdict: 'pass' | 'fail';
  /** Control value to select, when the step uses a control. */
  ctlVal?: string | string[];
  /** Expected vs observed note shown when the AI result disagrees with the expected result. */
  mismatch?: string;
}

export interface HistoryVersion {
  /** 1 = original. */
  v: number;
  draft: boolean;
  actual: string;
  verdict: Verdict;
  evidenceNames: string[];
  signature: Signature | null;
  /** Reason for edit, when this version came from an edit. */
  reason: string | null;
  when: string;
}

export interface Step {
  id: string;
  table: number;
  row: number;
  instructions: string;
  expected: string;
  reference: string;
  actual: string;
  /** Last saved or recorded actual result, used to discard unsaved changes. */
  savedActual: string;
  dirty: boolean;
  /** Evidence ids, or null when evidence does not apply to this step. */
  evidence: string[] | null;
  verdict: Verdict;
  state: StepState;
  signature: Signature | null;
  history: HistoryVersion[];
  /** True after Edit on a recorded step; the step is unlocked until re-recorded. */
  editUnlocked: boolean;
  editReason: string | null;
  naJustification: string | null;
  control: StepControl | null;
  controlValue: string | string[] | null;
  ai: AiSuggestion;
  aiMismatch: string | null;
  aiFilled: boolean;
}

export interface ProtocolTable {
  n: number;
  title: string;
  /** Section number in the document, e.g. "3.0". */
  num: string;
  intro: string;
  signoff: boolean;
  stepIds: string[];
}

export interface Protocol {
  id: string;
  docNumber: string;
  title: string;
  equipmentId: string;
  equipment: string;
  site: string;
  tables: ProtocolTable[];
  steps: Record<string, Step>;
}

export interface TableVerification {
  tableId: number;
  userId: string;
  who: string;
  role: string;
  when: string;
  reason: string;
  remarks: string;
}

export interface EvidenceItem {
  id: string;
  kind: EvidenceKind;
  name: string;
  sizeKb: number;
  addedBy: string;
  when: string;
  /** Step ids this item is linked to (an item can be reused on several steps). */
  stepIds: string[];
  /** True for items captured by the scripted AI agent. */
  aiCaptured: boolean;
}

export interface Discrepancy {
  id: string;
  stepId: string;
  severity: DiscrepancySeverity;
  description: string;
  status: DiscrepancyStatus;
  raisedBy: string;
  when: string;
  comments: string[];
}

export type SplitScope = 'entire' | 'rows';

export interface SplitAssignment {
  assigneeId: string;
  table: number;
  scope: SplitScope;
  /** Row numbers when scope is 'rows'. */
  rows: number[];
}

export interface AuditEntry {
  id: number;
  when: string;
  userId: string;
  role: string;
  action: string;
  target: string;
  reason: string | null;
  detail: string | null;
}

export interface Viewer {
  userId: string;
  role: RoleName;
  status: 'executing' | 'viewing';
  sinceMinutes: number;
}

export interface ExecutionOptions {
  /** Table 2 must be verified before steps in tables 3+ can be recorded. */
  gateTable2: boolean;
}

export interface ExecState {
  protocol: Protocol;
  users: User[];
  currentUserId: string;
  mode: ExecutionMode;
  options: ExecutionOptions;
  selectedStepId: string | null;
  /** Step waiting for its e-signature (set by recordStep, cleared by eSign). */
  pendingSignStepId: string | null;
  evidence: EvidenceItem[];
  verifications: Record<number, TableVerification | null>;
  discrepancies: Discrepancy[];
  splits: SplitAssignment[];
  /** Verifier chosen per table (table number -> user id). Verification itself still checks the verifier is not the executor. */
  verifierAssignments: Record<number, string>;
  viewers: Viewer[];
  audit: AuditEntry[];
  /** Minutes elapsed since the sample start; every action advances it so timestamps are deterministic. */
  clock: number;
  nextId: number;
}

export const SIGN_REASONS = [
  'I certify execution of this test step is true and accurate',
  'I approve the results recorded in this step',
  'I reviewed and verified the data entered',
] as const;

export const NA_REASONS = ['Not applicable to this execution', 'Step not required for this batch', 'Other'] as const;

export const CLOCK_BASE = Date.UTC(2026, 4, 10, 9, 0, 0);
export const isoAt = (minutes: number): string => new Date(CLOCK_BASE + minutes * 60_000).toISOString();

export const SAMPLE_USERS: User[] = [
  { id: 'user.executor', name: 'Executor', role: 'Executor', initials: 'EX', canExecute: true, canVerify: false },
  { id: 'user.executor2', name: 'Executor (second)', role: 'Executor', initials: 'E2', canExecute: true, canVerify: false },
  { id: 'user.verifier', name: 'Verifier', role: 'Verifier', initials: 'VE', canExecute: false, canVerify: true },
  { id: 'user.qalead', name: 'QA Lead', role: 'QA Lead', initials: 'QA', canExecute: false, canVerify: true },
  { id: 'user.reviewer', name: 'Reviewer', role: 'Reviewer', initials: 'RE', canExecute: false, canVerify: true },
  { id: 'user.approver', name: 'Approver', role: 'Approver', initials: 'AP', canExecute: false, canVerify: false },
];

/* ---------- sample protocol ---------- */

interface StepDef {
  ins: string;
  exp: string;
  ref: string;
  /** false = evidence not applicable. */
  evi?: boolean;
  ctl?: StepControl;
  ai: AiSuggestion;
}

interface TableDef {
  title: string;
  num: string;
  intro: string;
  signoff?: boolean;
  steps: StepDef[];
}

const TABLES: TableDef[] = [
  {
    title: 'Speed Verification',
    num: '3.0',
    intro: 'Confirm the blender shell turns at the set speeds and that the display agrees with an external tachometer.',
    steps: [
      {
        ins: 'Power on the V-cone blender and wait for the control panel to finish its start-up check.',
        exp: 'Control panel shows the home screen with no active alarms.',
        ref: 'URS-001',
        ai: { actual: 'Home screen shown, no alarms active.', verdict: 'pass' },
      },
      {
        ins: 'Set the shell speed to the lowest setpoint and start the blender. Record the displayed speed after 60 seconds.',
        exp: 'Displayed speed is within 5% of the lowest setpoint.',
        ref: 'URS-002',
        ai: { actual: 'Displayed speed is 5.04 RPM against a 5 RPM setpoint.', verdict: 'pass' },
      },
      {
        ins: 'Measure the shell speed with the calibrated tachometer at the same setpoint.',
        exp: 'Tachometer reading is within 5% of the displayed speed.',
        ref: 'URS-002',
        ai: { actual: 'Tachometer reads 5.04 RPM, matching the display.', verdict: 'pass' },
      },
      {
        ins: 'Tick every check that was seen during the speed run.',
        exp: 'All three checks are ticked: smooth rotation, no abnormal noise, no leakage at the seal.',
        ref: 'SOP-001',
        ctl: { type: 'checkbox', options: ['Smooth rotation', 'No abnormal noise', 'No leakage at the seal'] },
        ai: {
          actual: 'Smooth rotation, No abnormal noise, No leakage at the seal',
          verdict: 'pass',
          ctlVal: ['Smooth rotation', 'No abnormal noise', 'No leakage at the seal'],
        },
      },
      {
        ins: 'Stop the blender with the normal stop control and time how long the shell takes to come to rest.',
        exp: 'Shell comes to rest within 20 seconds.',
        ref: 'URS-003',
        ai: { actual: 'Shell stopped after 14 seconds.', verdict: 'pass' },
      },
    ],
  },
  {
    title: 'Mixing Performance',
    num: '4.0',
    intro: 'Run a timed blend of the placebo load and check that sampled locations agree.',
    steps: [
      {
        ins: 'Load the placebo blend to the marked fill line and close the lid.',
        exp: 'Load is at the fill line and the lid latch is engaged.',
        ref: 'SOP-002',
        ai: { actual: 'Load at the fill line, latch engaged.', verdict: 'pass' },
      },
      {
        ins: 'Choose the blend programme that was approved for this run.',
        exp: 'Programme 2 (15 minutes) is selected.',
        ref: 'SOP-002',
        evi: false,
        ctl: { type: 'radio', options: ['Programme 1 (10 minutes)', 'Programme 2 (15 minutes)', 'Programme 3 (20 minutes)'] },
        ai: { actual: 'Programme 2 (15 minutes)', verdict: 'pass', ctlVal: 'Programme 2 (15 minutes)' },
      },
      {
        ins: 'Run the programme to completion and note the elapsed time shown at the end of the cycle.',
        exp: 'Elapsed time is 15 minutes, within 30 seconds.',
        ref: 'URS-004',
        ai: {
          actual: 'Elapsed time 16 minutes 10 seconds.',
          verdict: 'fail',
          mismatch: 'Expected 15 minutes within 30 seconds; observed 16 minutes 10 seconds.',
        },
      },
      {
        ins: 'Take sample portions from the three sampling locations and record the assay of each.',
        exp: 'All three assays are within 90 to 110% of the label value.',
        ref: 'URS-005',
        ai: { actual: 'Assays 98.2%, 99.5% and 101.1% of label value.', verdict: 'pass' },
      },
      {
        ins: 'Calculate the relative standard deviation of the three assays.',
        exp: 'Relative standard deviation is not more than 5%.',
        ref: 'URS-005',
        ai: { actual: 'Relative standard deviation is 1.5%.', verdict: 'pass' },
      },
    ],
  },
  {
    title: 'Discharge Validation',
    num: '5.0',
    intro: 'Check that the discharge valve operates and that the blender empties cleanly.',
    steps: [
      {
        ins: 'Open the discharge valve using the normal control.',
        exp: 'Valve opens fully and the position indicator shows open.',
        ref: 'SOP-003',
        ai: { actual: 'Valve opened fully, indicator shows open.', verdict: 'pass' },
      },
      {
        ins: 'Discharge the blend into the collection container and measure the time to empty.',
        exp: 'Blender empties in 3 minutes or less.',
        ref: 'URS-006',
        ai: { actual: 'Blender emptied in 2 minutes 20 seconds.', verdict: 'pass' },
      },
      {
        ins: 'Describe how much material is left in the blender after discharge.',
        exp: 'Residue is described as "none visible".',
        ref: 'URS-006',
        ctl: { type: 'dropdown', options: ['None visible', 'Light film', 'Visible pockets'] },
        ai: { actual: 'None visible', verdict: 'pass', ctlVal: 'None visible' },
      },
      {
        ins: 'Close the discharge valve and confirm the seal.',
        exp: 'Valve is closed and the indicator shows closed.',
        ref: 'SOP-003',
        ai: { actual: 'Valve closed, indicator shows closed.', verdict: 'pass' },
      },
    ],
  },
  {
    title: 'Cleaning Verification',
    num: '6.0',
    intro: 'Clean the blender by the approved procedure and check the rinse.',
    steps: [
      {
        ins: 'Carry out the cleaning procedure and note the time it was started.',
        exp: 'Cleaning start time is recorded.',
        ref: 'SOP-004',
        evi: false,
        ai: { actual: 'Cleaning started at 11:40.', verdict: 'pass' },
      },
      {
        ins: 'Inspect the inside of the shell with a torch.',
        exp: 'No visible residue on any internal surface.',
        ref: 'SOP-004',
        ai: {
          actual: 'Light residue seen near the discharge port.',
          verdict: 'fail',
          mismatch: 'Expected no visible residue; light residue seen near the discharge port.',
        },
      },
      {
        ins: 'Collect the final rinse sample and measure its conductivity.',
        exp: 'Conductivity is not more than 1.3 times the water used for rinsing.',
        ref: 'SOP-005',
        ai: { actual: 'Conductivity is 1.1 times the rinse water.', verdict: 'pass' },
      },
      {
        ins: 'Attach the cleaning label to the blender with the date and the initials of the person who cleaned it.',
        exp: 'Cleaning label is attached and complete.',
        ref: 'SOP-004',
        ai: { actual: 'Label attached and complete.', verdict: 'pass' },
      },
    ],
  },
  {
    title: 'Performance Trial',
    num: '7.0',
    intro: 'Run a full-size trial at the working load and compare the result with the first mixing run.',
    steps: [
      {
        ins: 'Load the trial batch to the working fill level.',
        exp: 'Load is at the working fill level.',
        ref: 'SOP-006',
        ai: { actual: 'Load at the working fill level.', verdict: 'pass' },
      },
      {
        ins: 'Run the approved blend programme and record the total blend time.',
        exp: 'Total blend time matches the approved programme.',
        ref: 'SOP-006',
        ai: { actual: 'Total blend time 15 minutes.', verdict: 'pass' },
      },
      {
        ins: 'Sample the blend at the three locations and record the assay of each.',
        exp: 'All three assays are within 90 to 110% of the label value.',
        ref: 'URS-007',
        ai: { actual: 'Assays 99.0%, 100.2% and 100.8% of label value.', verdict: 'pass' },
      },
      {
        ins: 'Compare the trial result with the result from table 4.0 and state whether they agree.',
        exp: 'The two runs agree within the limits in the protocol.',
        ref: 'URS-007',
        ai: { actual: 'The two runs agree within the protocol limits.', verdict: 'pass' },
      },
    ],
  },
  {
    title: 'Sign-off',
    num: '8.0',
    intro: 'Final confirmations before the protocol goes forward for review.',
    signoff: true,
    steps: [
      {
        ins: 'Confirm that every step in tables 3.0 to 7.0 has a result.',
        exp: 'No step is left without a result.',
        ref: 'QA-001',
        evi: false,
        ai: { actual: 'All steps have a result.', verdict: 'pass' },
      },
      {
        ins: 'Confirm that every failed step has a discrepancy.',
        exp: 'Each failed step is linked to a discrepancy.',
        ref: 'QA-001',
        evi: false,
        ai: { actual: 'Each failed step is linked to a discrepancy.', verdict: 'pass' },
      },
      {
        ins: 'State whether the equipment is fit for use based on the results.',
        exp: 'The equipment is stated as fit for use, or the reason it is not.',
        ref: 'QA-001',
        evi: false,
        ai: { actual: 'Equipment is fit for use.', verdict: 'pass' },
      },
    ],
  },
];

export function createSampleProtocol(): Protocol {
  const steps: Record<string, Step> = {};
  const tables: ProtocolTable[] = TABLES.map((t, ti) => {
    const n = ti + 1;
    const stepIds = t.steps.map((d, ri) => {
      const row = ri + 1;
      const id = stepId(n, row);
      steps[id] = {
        id,
        table: n,
        row,
        instructions: d.ins,
        expected: d.exp,
        reference: d.ref,
        actual: '',
        savedActual: '',
        dirty: false,
        evidence: t.signoff || d.evi === false ? null : [],
        verdict: null,
        state: 'pending',
        signature: null,
        history: [],
        editUnlocked: false,
        editReason: null,
        naJustification: null,
        control: d.ctl ?? null,
        controlValue: null,
        ai: d.ai,
        aiMismatch: null,
        aiFilled: false,
      };
      return id;
    });
    return { n, title: t.title, num: t.num, intro: t.intro, signoff: !!t.signoff, stepIds };
  });
  return {
    id: 'OQ-001',
    docNumber: 'DOC-001',
    title: 'Operational Qualification of a V-cone blender',
    equipmentId: 'EQ-001',
    equipment: 'V-cone blender',
    site: 'Site A',
    tables,
    steps,
  };
}

export const stepId = (table: number, row: number): string => `T${table}-S${row}`;

export function createInitialState(): ExecState {
  const protocol = createSampleProtocol();
  return {
    protocol,
    users: SAMPLE_USERS.map((u) => ({ ...u })),
    currentUserId: 'user.executor',
    mode: 'executor',
    options: { gateTable2: true },
    selectedStepId: stepId(1, 1),
    pendingSignStepId: null,
    evidence: [],
    verifications: Object.fromEntries(protocol.tables.map((t) => [t.n, null])),
    discrepancies: [],
    splits: [],
    verifierAssignments: {},
    viewers: [
      { userId: 'user.executor', role: 'Executor', status: 'executing', sinceMinutes: 0 },
      { userId: 'user.verifier', role: 'Verifier', status: 'viewing', sinceMinutes: 4 },
      { userId: 'user.qalead', role: 'QA Lead', status: 'viewing', sinceMinutes: 9 },
      // sample viewers (roles, not people) so the status bar shows five avatars and "+2" like the reference
      { userId: 'user.executor2', role: 'Executor', status: 'viewing', sinceMinutes: 11 },
      { userId: 'user.reviewer', role: 'Reviewer', status: 'viewing', sinceMinutes: 14 },
      { userId: 'user.approver', role: 'Approver', status: 'viewing', sinceMinutes: 16 },
      { userId: 'viewer.operator', role: 'Executor', status: 'viewing', sinceMinutes: 20 },
      { userId: 'viewer.supervisor', role: 'QA Lead', status: 'viewing', sinceMinutes: 22 },
    ],
    audit: [],
    clock: 0,
    nextId: 1,
  };
}
