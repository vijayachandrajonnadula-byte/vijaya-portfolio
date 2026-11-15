/**
 * Electronic Execution: framework-free store, domain rules as actions, selectors, React hook.
 *
 * NOT FROM FIGMA. State is held in one immutable snapshot; every successful action clones the state,
 * mutates the clone and publishes it, so `useSyncExternalStore` sees a new reference. A rejected action
 * leaves the state untouched and returns `{ ok: false, errors }`.
 *
 * Scope notes
 * - Passwords are NOT validated. The source prototype only checks that the field is non-empty; this
 *   store keeps that behaviour on purpose (see `credentialErrors`). Do not read it as real authentication.
 * - AI output is scripted sample data stored on each step (`step.ai`); no model is called.
 * - Exception modes 'protocolError' and 'reExecute' are stubs (see TODO in `setMode`).
 */
import { useSyncExternalStore } from 'react';
import {
  NA_REASONS,
  SIGN_REASONS,
  createInitialState,
  isoAt,
  stepId as makeStepId,
} from './model';
import type {
  AuditEntry,
  DiscrepancySeverity,
  DiscrepancyStatus,
  EvidenceItem,
  EvidenceKind,
  ExecState,
  ExecutionMode,
  ExecutionOptions,
  HistoryVersion,
  Signature,
  SignedBy,
  SplitAssignment,
  Step,
  Verdict,
} from './model';

/* ---------- result and input types ---------- */

export interface ActionResult {
  ok: boolean;
  errors: string[];
  /** The UI should offer to raise a discrepancy (a step was failed without one). */
  promptDiscrepancy?: boolean;
  /** recordStep: validation passed and the e-signature dialog should open. */
  needsSignature?: boolean;
  /** selectStep: blocked because the current step has unsaved edits. */
  guard?: 'unsaved';
  /** Step ids affected, for bulk actions. */
  affected?: string[];
  /** Bulk actions: steps that were skipped and why. */
  skipped?: { stepId: string; errors: string[] }[];
  /** Step ids whose failed verdict has no discrepancy yet. */
  promptDiscrepancyFor?: string[];
  /** Id of a created item (evidence, discrepancy). */
  id?: string;
}

export interface SignCredentials {
  reason: string;
  userId: string;
  /** Only checked for non-empty. The prototype does not validate passwords. */
  password: string;
  accept: boolean;
  comments?: string;
}

export interface VerifyInput {
  verifierId: string;
  reason: string;
  password: string;
  accept: boolean;
  remarks?: string;
}

export interface EvidenceInput {
  kind: EvidenceKind;
  name: string;
  sizeKb: number;
}

export interface StepStatus {
  total: number;
  recorded: number;
  verified: number;
}

export interface ExecutionStatus {
  total: number;
  recorded: number;
  verified: number;
  drafts: number;
  aiFilled: number;
  pending: number;
  percentRecorded: number;
  percentVerified: number;
  verdicts: { pass: number; fail: number; na: number; unset: number };
  evidenceCount: number;
  openDiscrepancies: number;
  perTable: (StepStatus & { table: number; isVerified: boolean })[];
}

/* ---------- helpers on a state draft ---------- */

const ok = (extra: Partial<ActionResult> = {}): ActionResult => ({ ok: true, errors: [], ...extra });
const fail = (...errors: string[]): ActionResult => ({ ok: false, errors });

const getStep = (s: ExecState, id: string): Step | undefined => s.protocol.steps[id];
const getUser = (s: ExecState, id: string) => s.users.find((u) => u.id === id);
const currentUser = (s: ExecState) => getUser(s, s.currentUserId);
const allSteps = (s: ExecState): Step[] => Object.values(s.protocol.steps);
const stepsOfTable = (s: ExecState, n: number): Step[] =>
  (s.protocol.tables.find((t) => t.n === n)?.stepIds ?? []).flatMap((id) => {
    const st = getStep(s, id);
    return st ? [st] : [];
  });

const readOnlyError = (s: ExecState): string | null =>
  s.mode === 'spectator' ? 'Read-only: a spectator cannot change the execution.' : null;

const stamp = (s: ExecState): string => {
  s.clock += 1;
  return isoAt(s.clock);
};

const newId = (s: ExecState, prefix: string): string => `${prefix}-${String(s.nextId++).padStart(3, '0')}`;

function log(s: ExecState, action: string, target: string, reason: string | null = null, detail: string | null = null): void {
  const u = currentUser(s);
  const entry: AuditEntry = {
    id: s.audit.length + 1,
    when: stamp(s),
    userId: u?.id ?? 'unknown',
    role: u?.role ?? 'unknown',
    action,
    target,
    reason,
    detail,
  };
  s.audit.push(entry);
}

function makeSignature(s: ExecState, by: SignedBy, meaning: string, userId?: string): Signature {
  const u = getUser(s, userId ?? s.currentUserId) ?? currentUser(s);
  return {
    who: u?.name ?? 'Unknown',
    userId: u?.id ?? 'unknown',
    role: u?.role ?? 'unknown',
    when: stamp(s),
    meaning,
    by,
  };
}

function evidenceNames(s: ExecState, step: Step): string[] {
  return (step.evidence ?? []).flatMap((id) => {
    const e = s.evidence.find((x) => x.id === id);
    return e ? [e.name] : [];
  });
}

function pushHistory(s: ExecState, step: Step, draft: boolean, reason: string | null, signature: Signature | null): void {
  const v: HistoryVersion = {
    v: step.history.length + 1,
    draft,
    actual: step.actual,
    verdict: step.verdict,
    evidenceNames: evidenceNames(s, step),
    signature,
    reason,
    when: stamp(s),
  };
  step.history.push(v);
}

const isLocked = (step: Step): boolean => step.state === 'recorded';

const hasOpenDiscrepancy = (s: ExecState, id: string): boolean =>
  s.discrepancies.some((d) => d.stepId === id && d.status !== 'terminated' && d.status !== 'obsoleted');

const needsDiscrepancyPrompt = (s: ExecState, step: Step): boolean => step.verdict === 'fail' && !hasOpenDiscrepancy(s, step.id);

/** Gate: with the option on, table 2 must be verified before tables 3 and later can be recorded. */
function gateError(s: ExecState, step: Step): string | null {
  if (s.options.gateTable2 && step.table >= 3 && !s.verifications[2]) {
    return `Table 2 must be verified before table ${step.table} can be recorded.`;
  }
  return null;
}

/** Everything that stops a step being recorded (before the signature). */
function recordErrors(s: ExecState, step: Step): string[] {
  const errs: string[] = [];
  if (isLocked(step)) errs.push('Step is recorded and locked. Use Edit with a reason to change it.');
  const gate = gateError(s, step);
  if (gate) errs.push(gate);
  if (!step.actual.trim()) errs.push('Actual result is required.');
  if (step.verdict === null) errs.push('Pass, Fail or N/A is required.');
  if (step.verdict === 'na') errs.push('Use Mark as N/A (justification and e-signature) to record a step as N/A.');
  if (step.evidence !== null && step.evidence.length === 0) errs.push('Evidence is required for this step.');
  if (step.editUnlocked && !(step.editReason ?? '').trim()) errs.push('Reason for edit is required.');
  return errs;
}

/** The prototype only checks that these are present; the password is never verified. */
function credentialErrors(c: SignCredentials): string[] {
  const errs: string[] = [];
  if (!c.reason.trim()) errs.push('Select a reason for the signature.');
  if (!c.userId.trim()) errs.push('User ID is required.');
  if (!c.password.trim()) errs.push('Enter your password.');
  if (!c.accept) errs.push('Accept the signature statement.');
  return errs;
}

function commitRecord(s: ExecState, step: Step, signature: Signature): void {
  const reason = step.editReason;
  step.state = 'recorded';
  step.signature = signature;
  step.savedActual = step.actual;
  step.dirty = false;
  step.editUnlocked = false;
  pushHistory(s, step, false, reason, signature);
  step.editReason = null;
  log(s, signature.by === 'ai' ? 'Step recorded (AI-assisted)' : 'Step recorded', step.id, reason, `${step.verdict ?? ''}; ${signature.meaning}`);
}

function derivedActual(value: string | string[]): string {
  return Array.isArray(value) ? value.join(', ') : value;
}

/* ---------- the store ---------- */

export function createExecutionStore(initial: ExecState = createInitialState()) {
  let state: ExecState = initial;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  /** Run an action on a clone; publish it only when the action succeeded. */
  function run(fn: (s: ExecState) => ActionResult): ActionResult {
    const next = structuredClone(state);
    const r = fn(next);
    if (r.ok) {
      state = next;
      emit();
    }
    return r;
  }

  /** Same as run, but refuses to change anything in spectator mode. */
  function write(fn: (s: ExecState) => ActionResult): ActionResult {
    return run((s) => {
      const ro = readOnlyError(s);
      return ro ? fail(ro) : fn(s);
    });
  }

  const actions = {
    /* --- session --- */

    setCurrentUser(userId: string): ActionResult {
      return run((s) => {
        if (!getUser(s, userId)) return fail('Unknown user.');
        s.currentUserId = userId;
        return ok();
      });
    },

    /**
     * TODO(phase 3): 'protocolError' (correct Instructions/Expected/Reference of selected rows with a mandatory
     * reason and per-field stamps; Verify Table locked) and 'reExecute' (failed rows come back for a second run
     * that keeps the replaced run as "Old value") are only labels for now. Actions behave as in 'executor' mode.
     * 'spectator' is fully enforced: every write action is rejected.
     */
    setMode(mode: ExecutionMode): ActionResult {
      return run((s) => {
        s.mode = mode;
        return ok();
      });
    },

    setOption<K extends keyof ExecutionOptions>(key: K, value: ExecutionOptions[K]): ActionResult {
      return run((s) => {
        s.options[key] = value;
        return ok();
      });
    },

    reset(): void {
      state = createInitialState();
      emit();
    },

    /* --- step editing --- */

    /** Select a step. Blocks when the current step has unsaved edits unless `discard` is true (navGuard). */
    selectStep(id: string, opts: { discard?: boolean } = {}): ActionResult {
      return run((s) => {
        if (!getStep(s, id)) return fail('Unknown step.');
        const cur = s.selectedStepId ? getStep(s, s.selectedStepId) : undefined;
        if (cur && cur.id !== id && cur.dirty) {
          if (!opts.discard) return { ...fail('You have not recorded or saved this step.'), guard: 'unsaved' };
          cur.actual = cur.savedActual;
          cur.dirty = false;
        }
        s.selectedStepId = id;
        return ok();
      });
    },

    setActual(id: string, text: string): ActionResult {
      return write((s) => {
        const step = getStep(s, id);
        if (!step) return fail('Unknown step.');
        if (isLocked(step)) return fail('Step is recorded and locked.');
        step.actual = text;
        step.dirty = text !== step.savedActual;
        return ok();
      });
    },

    /** For steps with a checkbox / radio / dropdown control: the actual result is derived from the value. */
    setControlValue(id: string, value: string | string[]): ActionResult {
      return write((s) => {
        const step = getStep(s, id);
        if (!step) return fail('Unknown step.');
        if (!step.control) return fail('This step has no control.');
        if (isLocked(step)) return fail('Step is recorded and locked.');
        const picked = Array.isArray(value) ? value : [value];
        if (picked.some((v) => !step.control?.options.includes(v))) return fail('Value is not one of the options.');
        if (step.control.type !== 'checkbox' && picked.length > 1) return fail('Only one option can be selected.');
        step.controlValue = value;
        step.actual = derivedActual(value);
        step.dirty = step.actual !== step.savedActual;
        return ok();
      });
    },

    /** Pass copies the expected result, Fail negates it, N/A states it, when the actual result is still empty. */
    setVerdict(id: string, verdict: Exclude<Verdict, null>): ActionResult {
      return write((s) => {
        const step = getStep(s, id);
        if (!step) return fail('Unknown step.');
        if (isLocked(step)) return fail('Step is recorded and locked.');
        step.verdict = verdict;
        if (!step.actual.trim() && !step.control) {
          step.actual =
            verdict === 'pass'
              ? step.expected
              : verdict === 'fail'
                ? `Did not meet the expected result: ${step.expected}`
                : `Not applicable. Expected result was: ${step.expected}`;
        }
        step.dirty = true;
        return ok({ promptDiscrepancy: needsDiscrepancyPrompt(s, step) });
      });
    },

    /** Save a draft. Needs an actual result. Adds a "saved value" history version. */
    saveDraft(id: string, actual?: string): ActionResult {
      return write((s) => {
        const step = getStep(s, id);
        if (!step) return fail('Unknown step.');
        if (isLocked(step)) return fail('Step is recorded and locked.');
        if (actual !== undefined) step.actual = actual;
        if (!step.actual.trim()) return fail('Enter an actual result before saving.');
        if (step.state !== 'aiFilled') step.state = 'draft';
        step.savedActual = step.actual;
        step.dirty = false;
        pushHistory(s, step, true, step.editUnlocked ? step.editReason : null, null);
        log(s, 'Draft saved', step.id);
        return ok();
      });
    },

    /**
     * Validate a step for recording. Needs actual result, verdict and evidence where it applies (and a reason
     * when the step was unlocked for edit). Fail verdict without a discrepancy sets promptDiscrepancy.
     * AI-filled steps are recorded at once (no signature dialog, marked AI); other steps return needsSignature
     * and wait for eSign().
     */
    recordStep(id: string): ActionResult {
      return write((s) => {
        const step = getStep(s, id);
        if (!step) return fail('Unknown step.');
        const errs = recordErrors(s, step);
        if (errs.length) return fail(...errs);
        const prompt = needsDiscrepancyPrompt(s, step);
        if (step.state === 'aiFilled' && !step.editUnlocked) {
          commitRecord(s, step, makeSignature(s, 'ai', 'AI-assisted result accepted by the signed-in user'));
          return ok({ promptDiscrepancy: prompt, affected: [id] });
        }
        s.pendingSignStepId = id;
        return ok({ needsSignature: true, promptDiscrepancy: prompt });
      });
    },

    /** Complete a pending record with an e-signature. */
    eSign(creds: SignCredentials, id?: string): ActionResult {
      return write((s) => {
        const target = id ?? s.pendingSignStepId;
        const step = target ? getStep(s, target) : undefined;
        if (!step) return fail('No step is waiting for a signature.');
        const errs = [...credentialErrors(creds), ...recordErrors(s, step)];
        if (errs.length) return fail(...errs);
        commitRecord(s, step, makeSignature(s, 'user', creds.reason));
        s.pendingSignStepId = null;
        return ok({ promptDiscrepancy: needsDiscrepancyPrompt(s, step), affected: [step.id] });
      });
    },

    /** Cancel the signature dialog. */
    cancelSign(): ActionResult {
      return run((s) => {
        s.pendingSignStepId = null;
        return ok();
      });
    },

    /**
     * Edit a recorded step. Reason is mandatory. Unlocks the step, optionally applies a patch, voids that
     * table's verification and adds a history version carrying the reason. The step must be recorded again.
     */
    editRecordedStep(id: string, reason: string, patch: { actual?: string; verdict?: Exclude<Verdict, null> } = {}): ActionResult {
      return write((s) => {
        const step = getStep(s, id);
        if (!step) return fail('Unknown step.');
        if (!isLocked(step)) return fail('Only a recorded step can be edited.');
        if (!reason.trim()) return fail('Reason for edit is required.');
        step.state = 'draft';
        step.editUnlocked = true;
        step.editReason = reason.trim();
        if (patch.actual !== undefined) step.actual = patch.actual;
        if (patch.verdict !== undefined) step.verdict = patch.verdict;
        step.dirty = step.actual !== step.savedActual;
        const hadVerification = !!s.verifications[step.table];
        s.verifications[step.table] = null;
        pushHistory(s, step, true, step.editReason, null);
        log(s, 'Recorded step edited', step.id, step.editReason, hadVerification ? `Table ${step.table} verification cleared` : null);
        return ok({ affected: [id] });
      });
    },

    /** Mark steps N/A. Justification is mandatory; sign-off tables skip the e-signature (no signature column). */
    markNA(stepIds: string[], justification: string, creds?: SignCredentials): ActionResult {
      return write((s) => {
        if (!justification.trim()) return fail('Justification is required.');
        const steps = stepIds.map((i) => getStep(s, i));
        if (steps.some((x) => !x)) return fail('Unknown step.');
        const real = steps.flatMap((x) => (x ? [x] : []));
        if (real.length === 0) return fail('Select at least one step.');
        const needSig = real.some((x) => !s.protocol.tables.find((t) => t.n === x.table)?.signoff);
        if (needSig) {
          if (!creds) return fail('E-signature is required to mark steps N/A.');
          const errs = credentialErrors(creds);
          if (errs.length) return fail(...errs);
        }
        const lockedOnes = real.filter(isLocked);
        if (lockedOnes.length) return fail(`Already recorded: ${lockedOnes.map((x) => x.id).join(', ')}.`);
        const gate = real.map((x) => gateError(s, x)).find((g) => g);
        if (gate) return fail(gate);
        for (const step of real) {
          step.verdict = 'na';
          step.naJustification = justification.trim();
          step.actual = `N/A: ${justification.trim()}`;
          commitRecord(s, step, makeSignature(s, 'na', creds?.reason ?? NA_REASONS[0]));
        }
        return ok({ affected: real.map((x) => x.id) });
      });
    },

    /** Record several steps under one e-signature. Steps that fail validation are skipped and reported. */
    bulkRecord(stepIds: string[], creds: SignCredentials): ActionResult {
      return write((s) => {
        const ce = credentialErrors(creds);
        if (ce.length) return fail(...ce);
        const done: string[] = [];
        const skipped: { stepId: string; errors: string[] }[] = [];
        const prompts: string[] = [];
        for (const id of stepIds) {
          const step = getStep(s, id);
          if (!step) {
            skipped.push({ stepId: id, errors: ['Unknown step.'] });
            continue;
          }
          const errs = recordErrors(s, step);
          if (errs.length) {
            skipped.push({ stepId: id, errors: errs });
            continue;
          }
          if (needsDiscrepancyPrompt(s, step)) prompts.push(id);
          commitRecord(s, step, makeSignature(s, 'user', creds.reason));
          done.push(id);
        }
        if (done.length === 0) return { ...fail('Nothing could be recorded.'), skipped };
        return ok({ affected: done, skipped, promptDiscrepancyFor: prompts });
      });
    },

    /**
     * Independent verification of a whole table. Every step must be recorded; the verifier must be a different
     * user from every executor of that table. Password only checked for non-empty (see file header).
     */
    verifyTable(table: number, input: VerifyInput): ActionResult {
      return write((s) => {
        const steps = stepsOfTable(s, table);
        if (steps.length === 0) return fail('Unknown table.');
        if (s.verifications[table]) return fail(`Table ${table} is already verified.`);
        const verifier = getUser(s, input.verifierId);
        const errs: string[] = [];
        if (!verifier) errs.push('Select a verifier.');
        else if (!verifier.canVerify) errs.push('That user cannot verify.');
        if (!input.reason.trim()) errs.push('Select a reason.');
        if (!input.password.trim()) errs.push('Enter your password.');
        if (!input.accept) errs.push('Accept the signature statement.');
        const open = steps.filter((x) => x.state !== 'recorded');
        if (open.length) errs.push(`Record every step first. Not recorded: ${open.map((x) => x.id).join(', ')}.`);
        const executors = new Set(steps.flatMap((x) => (x.signature ? [x.signature.userId] : [])));
        if (verifier && executors.has(verifier.id)) errs.push('The verifier must be a different user from the executor.');
        if (errs.length || !verifier) return fail(...errs);
        s.verifications[table] = {
          tableId: table,
          userId: verifier.id,
          who: verifier.name,
          role: verifier.role,
          when: stamp(s),
          reason: input.reason.trim(),
          remarks: (input.remarks ?? '').trim(),
        };
        log(s, 'Table verified', `Table ${table}`, input.reason.trim(), input.remarks ?? null);
        return ok();
      });
    },

    /* --- evidence --- */

    addEvidence(id: string, input: EvidenceInput): ActionResult {
      return write((s) => {
        const step = getStep(s, id);
        if (!step) return fail('Unknown step.');
        if (step.evidence === null) return fail('Evidence does not apply to this step.');
        if (isLocked(step)) return fail('Step is recorded and locked.');
        if (!input.name.trim()) return fail('Evidence needs a name.');
        const item: EvidenceItem = {
          id: newId(s, 'EV'),
          kind: input.kind,
          name: input.name.trim(),
          sizeKb: input.sizeKb,
          addedBy: s.currentUserId,
          when: stamp(s),
          stepIds: [id],
          aiCaptured: false,
        };
        s.evidence.push(item);
        step.evidence.push(item.id);
        log(s, 'Evidence added', id, null, item.name);
        return ok({ id: item.id });
      });
    },

    /** Unlink evidence from a step; the item is deleted when no step uses it any more. */
    removeEvidence(id: string, evidenceId: string): ActionResult {
      return write((s) => {
        const step = getStep(s, id);
        const item = s.evidence.find((e) => e.id === evidenceId);
        if (!step || !item) return fail('Unknown step or evidence.');
        if (isLocked(step)) return fail('Step is recorded and locked.');
        if (!step.evidence?.includes(evidenceId)) return fail('Evidence is not linked to this step.');
        step.evidence = step.evidence.filter((e) => e !== evidenceId);
        item.stepIds = item.stepIds.filter((x) => x !== id);
        if (item.stepIds.length === 0) s.evidence = s.evidence.filter((e) => e.id !== evidenceId);
        log(s, 'Evidence removed', id, null, item.name);
        return ok();
      });
    },

    /** Link an item already in the library to another step. */
    reuseEvidence(id: string, evidenceId: string): ActionResult {
      return write((s) => {
        const step = getStep(s, id);
        const item = s.evidence.find((e) => e.id === evidenceId);
        if (!step || !item) return fail('Unknown step or evidence.');
        if (step.evidence === null) return fail('Evidence does not apply to this step.');
        if (isLocked(step)) return fail('Step is recorded and locked.');
        if (step.evidence.includes(evidenceId)) return fail('Evidence is already linked to this step.');
        step.evidence.push(evidenceId);
        item.stepIds.push(id);
        log(s, 'Evidence reused', id, null, item.name);
        return ok();
      });
    },

    /* --- discrepancies --- */

    raiseDiscrepancy(id: string, input: { severity: DiscrepancySeverity; description: string }): ActionResult {
      return write((s) => {
        const step = getStep(s, id);
        if (!step) return fail('Unknown step.');
        if (!input.description.trim()) return fail('Describe the discrepancy.');
        const did = newId(s, 'DISC');
        s.discrepancies.push({
          id: did,
          stepId: id,
          severity: input.severity,
          description: input.description.trim(),
          status: 'underAssessment',
          raisedBy: s.currentUserId,
          when: stamp(s),
          comments: [],
        });
        log(s, 'Discrepancy raised', id, null, did);
        return ok({ id: did });
      });
    },

    /** underAssessment -> pendingReview -> closed; any open status can be terminated or obsoleted. */
    updateDiscrepancyStatus(did: string, status: DiscrepancyStatus, comment?: string): ActionResult {
      return write((s) => {
        const d = s.discrepancies.find((x) => x.id === did);
        if (!d) return fail('Unknown discrepancy.');
        const allowed: Record<DiscrepancyStatus, DiscrepancyStatus[]> = {
          underAssessment: ['pendingReview', 'terminated', 'obsoleted'],
          pendingReview: ['underAssessment', 'closed', 'terminated', 'obsoleted'],
          closed: [],
          terminated: [],
          obsoleted: [],
        };
        if (!allowed[d.status].includes(status)) return fail(`Cannot move a discrepancy from ${d.status} to ${status}.`);
        if ((status === 'terminated' || status === 'obsoleted') && !(comment ?? '').trim()) {
          return fail('A comment is required to terminate or obsolete a discrepancy.');
        }
        const from = d.status;
        d.status = status;
        if (comment?.trim()) d.comments.push(comment.trim());
        log(s, 'Discrepancy status changed', d.stepId, comment?.trim() ?? null, `${did}: ${from} -> ${status}`);
        return ok();
      });
    },

    /* --- split execution --- */

    /**
     * Replace the split plan. Rules: a table taken as 'Entire table' cannot be reused by another assignment,
     * and a row cannot be in two splits.
     */
    splitExecution(assignments: SplitAssignment[]): ActionResult {
      return write((s) => {
        const errs: string[] = [];
        const entire = new Map<number, string>();
        const rowOwner = new Map<string, string>();
        for (const a of assignments) {
          const user = getUser(s, a.assigneeId);
          const table = s.protocol.tables.find((t) => t.n === a.table);
          if (!user || !user.canExecute) errs.push(`${a.assigneeId} cannot be assigned execution.`);
          if (!table) {
            errs.push(`Table ${a.table} does not exist.`);
            continue;
          }
          if (a.scope === 'entire') {
            if (entire.has(a.table)) errs.push(`Table ${a.table} is taken as Entire table and cannot be reused.`);
            entire.set(a.table, a.assigneeId);
          } else {
            if (a.rows.length === 0) errs.push(`Choose rows for table ${a.table}.`);
            for (const r of a.rows) {
              if (r < 1 || r > table.stepIds.length) errs.push(`Table ${a.table} has no row ${r}.`);
              const key = makeStepId(a.table, r);
              if (rowOwner.has(key)) errs.push(`Row ${r} of table ${a.table} is already in another split.`);
              rowOwner.set(key, a.assigneeId);
            }
          }
        }
        for (const t of entire.keys()) {
          if ([...rowOwner.keys()].some((k) => k.startsWith(`T${t}-`))) {
            errs.push(`Table ${t} is taken as Entire table and cannot also be split by rows.`);
          }
        }
        if (errs.length) return fail(...[...new Set(errs)]);
        s.splits = assignments.map((a) => ({ ...a, rows: [...a.rows] }));
        log(s, 'Execution split', 'Protocol', null, `${assignments.length} assignment(s)`);
        return ok();
      });
    },

    /** Assign (or clear, with null) the verifier of a table. */
    assignVerifier(table: number, userId: string | null): ActionResult {
      return write((s) => {
        if (!s.protocol.tables.some((t) => t.n === table)) return fail(`Table ${table} does not exist.`);
        if (userId) {
          const user = getUser(s, userId);
          if (!user) return fail(`${userId} is not a user of this protocol.`);
          s.verifierAssignments = { ...s.verifierAssignments, [table]: userId };
        } else {
          const next = { ...s.verifierAssignments };
          delete next[table];
          s.verifierAssignments = next;
        }
        log(s, 'Verifier assigned', `Table ${table}`, null, userId ?? 'cleared');
        return ok();
      });
    },

    /* --- AI agent (scripted sample output) --- */

    /**
     * Fill the given steps (skipping recorded ones) from the scripted sample output: actual result, verdict,
     * mismatch note and an AI-captured screenshot where evidence applies. Steps become 'aiFilled', which is
     * still a draft: the user must record them (recordStep / recordAllAi).
     */
    aiFill(stepIds: string[]): ActionResult {
      return write((s) => {
        const filled: string[] = [];
        for (const id of stepIds) {
          const step = getStep(s, id);
          if (!step || isLocked(step)) continue;
          step.actual = step.ai.actual;
          step.verdict = step.ai.verdict;
          if (step.control && step.ai.ctlVal !== undefined) step.controlValue = step.ai.ctlVal;
          step.aiMismatch = step.ai.mismatch ?? null;
          step.aiFilled = true;
          step.state = 'aiFilled';
          step.savedActual = step.actual;
          step.dirty = false;
          if (step.evidence !== null) {
            const item: EvidenceItem = {
              id: newId(s, 'EV'),
              kind: 'screenshot',
              name: `AI_T${step.table}_S${step.row}.png`,
              sizeKb: 120,
              addedBy: 'ai.agent',
              when: stamp(s),
              stepIds: [id],
              aiCaptured: true,
            };
            s.evidence.push(item);
            step.evidence.push(item.id);
          }
          pushHistory(s, step, true, null, null);
          filled.push(id);
        }
        if (filled.length === 0) return fail('No steps to fill: they are recorded or unknown.');
        log(s, 'AI filled steps', 'Protocol', null, `${filled.length} step(s)`);
        return ok({ affected: filled });
      });
    },

    /** Record every AI-filled step (or those in `stepIds`). Signed as the user with an AI marker. */
    recordAllAi(stepIds?: string[]): ActionResult {
      return write((s) => {
        const targets = (stepIds ?? allSteps(s).map((x) => x.id)).flatMap((id) => {
          const st = getStep(s, id);
          return st && st.state === 'aiFilled' ? [st] : [];
        });
        if (targets.length === 0) return fail('No AI results waiting to be recorded.');
        const done: string[] = [];
        const skipped: { stepId: string; errors: string[] }[] = [];
        const prompts: string[] = [];
        for (const step of targets) {
          const errs = recordErrors(s, step);
          if (errs.length) {
            skipped.push({ stepId: step.id, errors: errs });
            continue;
          }
          if (needsDiscrepancyPrompt(s, step)) prompts.push(step.id);
          commitRecord(s, step, makeSignature(s, 'ai', 'AI-assisted result accepted by the signed-in user'));
          done.push(step.id);
        }
        if (done.length === 0) return { ...fail('Nothing could be recorded.'), skipped };
        return ok({ affected: done, skipped, promptDiscrepancyFor: prompts });
      });
    },
  };

  return {
    getState: (): ExecState => state,
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    actions,
  };
}

export type ExecutionStore = ReturnType<typeof createExecutionStore>;

/** The app-wide store. Tests and tools can make their own with createExecutionStore(). */
export const executionStore: ExecutionStore = createExecutionStore();
export const executionActions = executionStore.actions;

/** Subscribe a component to the store. Re-renders on every successful action. */
export function useExecution(store: ExecutionStore = executionStore): ExecState {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}

/* ---------- selectors (pure) ---------- */

export const isTableVerified = (s: ExecState, table: number): boolean => !!s.verifications[table];

export function stepsInTable(s: ExecState, table: number): Step[] {
  return stepsOfTable(s, table);
}

export function discrepanciesForStep(s: ExecState, id: string) {
  return s.discrepancies.filter((d) => d.stepId === id);
}

export function executionStatus(s: ExecState): ExecutionStatus {
  const steps = allSteps(s);
  const total = steps.length;
  const perTable = s.protocol.tables.map((t) => {
    const ts = stepsOfTable(s, t.n);
    const verified = !!s.verifications[t.n];
    return {
      table: t.n,
      total: ts.length,
      recorded: ts.filter((x) => x.state === 'recorded').length,
      /** Steps counted as verified (the whole table once it is verified). */
      verified: verified ? ts.length : 0,
      /** Table-level verification flag. */
      isVerified: verified,
    };
  });
  const recorded = steps.filter((x) => x.state === 'recorded').length;
  const verified = perTable.reduce((n, t) => n + t.verified, 0);
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));
  return {
    total,
    recorded,
    verified,
    drafts: steps.filter((x) => x.state === 'draft').length,
    aiFilled: steps.filter((x) => x.state === 'aiFilled').length,
    pending: steps.filter((x) => x.state === 'pending').length,
    percentRecorded: pct(recorded),
    percentVerified: pct(verified),
    verdicts: {
      pass: steps.filter((x) => x.verdict === 'pass').length,
      fail: steps.filter((x) => x.verdict === 'fail').length,
      na: steps.filter((x) => x.verdict === 'na').length,
      unset: steps.filter((x) => x.verdict === null).length,
    },
    evidenceCount: s.evidence.length,
    openDiscrepancies: s.discrepancies.filter((d) => d.status === 'underAssessment' || d.status === 'pendingReview').length,
    perTable,
  };
}

/* ---------- self check ---------- */

/**
 * Exercises the main rules on fresh stores. Returns one "PASS: ..." or "FAIL: ..." line per check.
 * No runner file in the repo: bundle store.ts with esbuild (a Vite dependency) for node and call it, or
 * import it from any dev console. `tsx` is not installed in this project.
 */
export function runSelfCheck(): string[] {
  const out: string[] = [];
  const check = (name: string, cond: boolean, detail = ''): void => {
    out.push(`${cond ? 'PASS' : 'FAIL'}: ${name}${!cond && detail ? ` (${detail})` : ''}`);
  };
  const creds = (userId = 'user.executor'): SignCredentials => ({ reason: SIGN_REASONS[0], userId, password: 'x', accept: true });
  const verifyInput = (verifierId: string): VerifyInput => ({ verifierId, reason: SIGN_REASONS[2], password: 'x', accept: true });
  /** Fill a whole table from the scripted AI output and record it. */
  const recordTable = (st: ExecutionStore, table: number): void => {
    const ids = st.getState().protocol.tables.find((t) => t.n === table)?.stepIds ?? [];
    st.actions.aiFill(ids);
    st.actions.recordAllAi(ids);
  };

  {
    const st = createExecutionStore();
    const id = 'T1-S2';
    st.actions.setActual(id, 'Displayed speed is 5.04 RPM');
    st.actions.setVerdict(id, 'pass');
    const r = st.actions.recordStep(id);
    check('record without evidence fails', !r.ok && r.errors.some((e) => e.includes('Evidence')), r.errors.join('|'));
  }
  {
    const st = createExecutionStore();
    const id = 'T1-S2';
    st.actions.addEvidence(id, { kind: 'screenshot', name: 'speed.png', sizeKb: 40 });
    const v = st.actions.setVerdict(id, 'fail');
    check('fail verdict prompts discrepancy', v.ok && v.promptDiscrepancy === true);
    const r = st.actions.recordStep(id);
    check('recordStep on fail returns promptDiscrepancy and needsSignature', r.ok && r.promptDiscrepancy === true && r.needsSignature === true);
    const bad = st.actions.eSign({ ...creds(), password: '' });
    check('e-sign with empty password rejected', !bad.ok);
    const signed = st.actions.eSign(creds());
    check('e-sign records the step', signed.ok && st.getState().protocol.steps[id]?.state === 'recorded');
    st.actions.raiseDiscrepancy(id, { severity: 'minor', description: 'Speed outside limit' });
    const again = st.actions.updateDiscrepancyStatus('DISC-002', 'closed');
    check('discrepancy cannot skip review (underAssessment -> closed)', !again.ok || st.getState().discrepancies[0]?.status !== 'closed');
  }
  {
    const st = createExecutionStore();
    recordTable(st, 1);
    check('AI fill + record all records table 1', executionStatus(st.getState()).perTable[0]?.recorded === 5);
    const edit0 = st.actions.editRecordedStep('T1-S1', '  ');
    check('edit without reason rejected', !edit0.ok);
    const same = st.actions.verifyTable(1, verifyInput('user.executor'));
    check('same user cannot verify', !same.ok && same.errors.some((e) => e.includes('different user')), same.errors.join('|'));
    const good = st.actions.verifyTable(1, verifyInput('user.verifier'));
    check('different user can verify', good.ok && isTableVerified(st.getState(), 1));
    const edit = st.actions.editRecordedStep('T1-S1', 'Corrected typing error', { actual: 'Home screen shown, no alarms.' });
    const s1 = st.getState();
    check(
      'edit with reason voids table verification and adds history',
      edit.ok && !isTableVerified(s1, 1) && (s1.protocol.steps['T1-S1']?.history.length ?? 0) >= 2,
    );
    const rec = st.actions.recordStep('T1-S1');
    check('edited step needs a signature again', rec.ok && rec.needsSignature === true);
  }
  {
    const st = createExecutionStore();
    const a = st.actions.splitExecution([
      { assigneeId: 'user.executor', table: 1, scope: 'entire', rows: [] },
      { assigneeId: 'user.executor2', table: 1, scope: 'rows', rows: [1, 2] },
    ]);
    check('split: Entire table cannot be reused', !a.ok);
    const b = st.actions.splitExecution([
      { assigneeId: 'user.executor', table: 2, scope: 'rows', rows: [1, 2, 3] },
      { assigneeId: 'user.executor2', table: 2, scope: 'rows', rows: [3, 4, 5] },
    ]);
    check('split: a row in two splits rejected', !b.ok);
    const c = st.actions.splitExecution([
      { assigneeId: 'user.executor', table: 2, scope: 'rows', rows: [1, 2, 3] },
      { assigneeId: 'user.executor2', table: 2, scope: 'rows', rows: [4, 5] },
    ]);
    check('split: valid plan accepted', c.ok && st.getState().splits.length === 2);
  }
  {
    const st = createExecutionStore();
    st.actions.aiFill(['T3-S1']);
    const blocked = st.actions.recordStep('T3-S1');
    check('gate: table 3 cannot be recorded before table 2 is verified', !blocked.ok && blocked.errors.some((e) => e.includes('Table 2')), blocked.errors.join('|'));
    recordTable(st, 2);
    check('table 2 recorded (one scripted fail)', executionStatus(st.getState()).perTable[1]?.recorded === 5);
    st.actions.verifyTable(2, verifyInput('user.qalead'));
    const open = st.actions.recordStep('T3-S1');
    check('gate: table 3 can be recorded after table 2 is verified', open.ok, open.errors.join('|'));
  }
  {
    const st = createExecutionStore();
    st.actions.aiFill(['T1-S1']);
    const s0 = st.getState().protocol.steps['T1-S1'];
    check('AI fill is a draft, not recorded', s0?.state === 'aiFilled' && s0.aiFilled === true);
    const miss = st.actions.aiFill(['T2-S3']);
    check('AI fill sets a mismatch note on a failing step', miss.ok && !!st.getState().protocol.steps['T2-S3']?.aiMismatch);
  }
  {
    const st = createExecutionStore();
    st.actions.setMode('spectator');
    const r = st.actions.setActual('T1-S1', 'x');
    check('spectator is read-only', !r.ok);
  }
  {
    const st = createExecutionStore();
    st.actions.setActual('T1-S1', 'draft text');
    const nav = st.actions.selectStep('T1-S2');
    check('unsaved step blocks navigation', !nav.ok && nav.guard === 'unsaved');
    const disc = st.actions.selectStep('T1-S2', { discard: true });
    check('discard lets navigation continue', disc.ok && st.getState().selectedStepId === 'T1-S2');
  }
  {
    const st = createExecutionStore();
    st.actions.setOption('gateTable2', false);
    const r = st.actions.markNA(['T6-S1'], 'Not part of this batch');
    check('mark N/A in a sign-off table needs no e-sign', r.ok && st.getState().protocol.steps['T6-S1']?.verdict === 'na' && !!st.getState().audit.length);
    const r2 = st.actions.markNA(['T1-S1'], 'Not part of this batch');
    check('mark N/A elsewhere needs an e-sign', !r2.ok);
  }
  return out;
}
