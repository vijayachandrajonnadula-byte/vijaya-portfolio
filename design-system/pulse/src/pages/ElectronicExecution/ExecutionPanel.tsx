import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography } from '../../components/mui';
import { Chip } from '../../components/data-display/Chip/Chip';
import type { ChipColor } from '../../components/data-display/Chip/Chip';
import { Status } from '../../components/data-display/Status/Status';
import { ToggleButtonGroup } from '../../components/form/ToggleButtonGroup/ToggleButtonGroup';
import { getPlainTextFromRTE } from '../../components/form/RichTextEditor/RichTextEditor';
import { ExecutionRichText } from '../../components/form/ExecutionRichText/ExecutionRichText';
import { Checkbox } from '../../components/form/Checkbox/Checkbox';
import { Radio } from '../../components/form/Radio/Radio';
import { Select } from '../../components/form/Select/Select';
import { DropdownMenu } from '../../components/form/DropdownMenu/DropdownMenu';
import { dataGridColors } from '../../components/data-display/DataGrid/DataGridCells';
import { ArrowRight01Icon } from '../../icons';
import { fw, panelRole } from '../../theme/typography';
import type { ExecState, Step, StepState, Verdict } from './model';
import { discrepanciesForStep, executionActions, executionStore, isTableVerified, useExecution } from './store';
import { ui, useUi } from './ui';
import type { PanelDock } from './ui';
import { captureEvidence, EVIDENCE_KINDS, Stack } from './MediaBar';
import { panelRef, ref } from './refTheme';
import type { EvidenceKind } from './model';
import { DockMenu, DotsMenu, PanelBtn, PhTab, ReadCard, Section, icons, iconBtnSx, VerdictButtons } from './panel/PanelParts';
import type { PanelVariant } from './panel/PanelParts';

/* ---------- helpers shared with DocumentView ---------- */

export const plain = (html: string): string => getPlainTextFromRTE(html).trim();

export const fmtWhen = (iso: string): string =>
  `${new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC`;

export const tableNum = (s: ExecState, step: Step): string => s.protocol.tables.find((t) => t.n === step.table)?.num ?? String(step.table);
export const stepLabel = (s: ExecState, step: Step): string => `${tableNum(s, step)} step ${step.row}`;

/** Select a step. In the inline layout an edited step with a result is saved as a draft first; otherwise the unsaved guard opens. */
export function selectStepGuarded(id: string): void {
  const s = executionStore.getState();
  const cur = s.selectedStepId ? s.protocol.steps[s.selectedStepId] : undefined;
  if (cur && cur.id !== id && cur.dirty && ui.getState().layout === 'inline' && s.mode !== 'spectator' && plain(cur.actual)) {
    executionActions.saveDraft(cur.id);
  }
  const r = executionActions.selectStep(id);
  if (r.guard === 'unsaved') ui.open('unsavedGuard', { nextStepId: id });
}

/** Record a step. Returns validation errors to show inline; opens the sign / discrepancy surfaces when the store asks. */
export function recordFlow(id: string): string[] {
  const r = executionActions.recordStep(id);
  if (!r.ok) return r.errors;
  if (r.needsSignature) {
    // The sign dialog completes the record; the store also reports promptDiscrepancy from eSign.
    ui.open('sign', { stepIds: [id] });
    return [];
  }
  const s = executionStore.getState();
  const step = s.protocol.steps[id];
  ui.toast('ai', `Step ${step ? stepLabel(s, step) : id} recorded (AI-assisted result accepted)`);
  if (r.promptDiscrepancy) ui.open('discrepancyPrompt', { stepId: id });
  return [];
}

const stateMeta: Record<StepState, { label: string; color: ChipColor }> = {
  pending: { label: 'Pending', color: 'gray' },
  draft: { label: 'Draft', color: 'blue' },
  aiFilled: { label: 'AI filled', color: 'ai' },
  recorded: { label: 'Recorded', color: 'green' },
};

export function StateChip({ state }: { state: StepState }) {
  const m = stateMeta[state];
  return <Status type="chip" label={m.label} color={m.color} />;
}

const verdictMeta: Record<Exclude<Verdict, null>, { label: string; color: ChipColor }> = {
  pass: { label: 'Pass', color: 'green' },
  fail: { label: 'Fail', color: 'red' },
  na: { label: 'N/A', color: 'gray' },
};

export function VerdictChip({ verdict }: { verdict: Verdict }) {
  if (!verdict) return <Typography sx={{ fontSize: 12, color: dataGridColors.metaText }}>Not set</Typography>;
  const m = verdictMeta[verdict];
  return <Chip label={m.label} color={m.color} variant="strokeLight" size="xsmall" />;
}

/** Verdict Pass / Fail / N/A. N/A opens the Mark as N/A dialog (it needs a justification and an e-signature). */
export function VerdictGroup({ step, disabled }: { step: Step; disabled?: boolean }) {
  return (
    <ToggleButtonGroup
      ariaLabel="Verdict"
      size="small"
      exclusive
      disabled={disabled}
      value={step.verdict}
      buttonList={[
        { value: 'pass', label: 'Pass' },
        { value: 'fail', label: 'Fail' },
        { value: 'na', label: 'N/A' },
      ]}
      onChange={(_e, v) => {
        if (!v) return;
        if (v === 'na') {
          ui.open('markNA', { stepIds: [step.id] });
          return;
        }
        const r = executionActions.setVerdict(step.id, v as 'pass' | 'fail');
        if (!r.ok) ui.toast('error', r.errors[0] ?? 'Could not set the verdict.');
      }}
    />
  );
}

/** Checkbox / radio / dropdown control of a step; the actual result is derived from it. */
export function ControlInput({ step, disabled }: { step: Step; disabled?: boolean }) {
  const ctl = step.control;
  if (!ctl) return null;
  const fail = (errors: string[]) => ui.toast('error', errors[0] ?? 'Could not change the answer.');
  if (ctl.type === 'dropdown') {
    return (
      <Select
        size="small"
        placeholder="Select an answer"
        options={ctl.options}
        disabled={disabled}
        value={typeof step.controlValue === 'string' ? step.controlValue : ''}
        onChange={(v) => {
          const r = executionActions.setControlValue(step.id, Array.isArray(v) ? (v[0] ?? '') : v);
          if (!r.ok) fail(r.errors);
        }}
      />
    );
  }
  const picked = Array.isArray(step.controlValue) ? step.controlValue : typeof step.controlValue === 'string' ? [step.controlValue] : [];
  return (
    <Stack role={ctl.type === 'radio' ? 'radiogroup' : 'group'} aria-label="Answer" spacing={0.5}>
      {ctl.options.map((o) =>
        ctl.type === 'checkbox' ? (
          <Checkbox
            key={o}
            label={o}
            disabled={disabled}
            checked={picked.includes(o)}
            onChange={(_e, checked) => {
              const r = executionActions.setControlValue(step.id, checked ? [...picked, o] : picked.filter((x) => x !== o));
              if (!r.ok) fail(r.errors);
            }}
          />
        ) : (
          <Radio
            key={o}
            label={o}
            disabled={disabled}
            checked={picked.includes(o)}
            onChange={() => {
              const r = executionActions.setControlValue(step.id, o);
              if (!r.ok) fail(r.errors);
            }}
          />
        ),
      )}
    </Stack>
  );
}

/* ---------- panel ---------- */

/** The step's control drawn like the reference: native checkbox / radio list or select inside the dashed control host. */
function PanelControl({ step, disabled }: { step: Step; disabled?: boolean }) {
  const ctl = step.control;
  if (!ctl) return null;
  const fail = (errors: string[]) => ui.toast('error', errors[0] ?? 'Could not change the answer.');
  const host = { boxSizing: 'border-box', m: '5px', p: '10px 12px', minHeight: 64, border: `1px dashed ${ref.line}`, borderRadius: '8px', bgcolor: '#fff', fontSize: 12, lineHeight: 1.5 } as const;
  if (ctl.type === 'dropdown') {
    return (
      <Box data-spec="ctl-host" sx={host}>
        <Box
          component="select"
          aria-label="Answer"
          disabled={disabled}
          value={typeof step.controlValue === 'string' ? step.controlValue : ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            if (!e.target.value) return;
            const r = executionActions.setControlValue(step.id, e.target.value);
            if (!r.ok) fail(r.errors);
          }}
          sx={{ display: 'inline-block', width: '100%', boxSizing: 'border-box', p: '3px 6px', border: `1px solid ${ref.line}`, borderRadius: '3px', bgcolor: '#fff', fontFamily: 'inherit', fontSize: 12.5, color: ref.black, cursor: disabled ? 'default' : 'pointer' }}
        >
          <option value="">Select an answer</option>
          {ctl.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </Box>
      </Box>
    );
  }
  const picked = Array.isArray(step.controlValue) ? step.controlValue : typeof step.controlValue === 'string' ? [step.controlValue] : [];
  const name = `ctl-${step.id}`;
  return (
    <Box data-spec="ctl-host" sx={host}>
      <Box role={ctl.type === 'radio' ? 'radiogroup' : 'group'} aria-label="Answer" sx={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: panelRef.controlFont, fontSize: 12.5, lineHeight: 1.5, color: ref.black }}>
        {ctl.options.map((o) => (
          <Box key={o} component="label" sx={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: disabled ? 'default' : 'pointer', lineHeight: 1.25 }}>
            <Box
              component="input"
              type={ctl.type === 'radio' ? 'radio' : 'checkbox'}
              name={name}
              disabled={disabled}
              checked={picked.includes(o)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const r = executionActions.setControlValue(step.id, ctl.type === 'radio' ? o : e.target.checked ? [...picked, o] : picked.filter((x) => x !== o));
                if (!r.ok) fail(r.errors);
              }}
              sx={{ width: 13, height: 13, m: 0, accentColor: ref.blue3, cursor: 'inherit' }}
            />
            <span>{o}</span>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function CollapseGlyph({ dock }: { dock: PanelDock }) {
  return <Box component="span" sx={{ display: 'flex', transform: dock === 'right' ? 'scaleX(-1)' : undefined }}>{icons.collapse(12)}</Box>;
}

const MIN = { w: 320, h: 200 };
const MAX = { w: 720, h: 600 };

export default function ExecutionPanel() {
  const s = useExecution();
  const u = useUi();
  const step = s.selectedStepId ? s.protocol.steps[s.selectedStepId] : undefined;
  const [evEl, setEvEl] = useState<HTMLElement | null>(null);
  const [tab, setTab] = useState<'actual' | 'reason'>('actual');
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 420, h: 300 });
  const bodyRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTab('actual');
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step?.id]);
  useEffect(() => {
    if (!step?.editUnlocked) setTab('actual');
  }, [step?.editUnlocked]);

  const order = useMemo(() => s.protocol.tables.flatMap((t) => t.stepIds), [s.protocol.tables]);
  void order;
  const dock = u.dock;
  const horizontal = dock === 'left' || dock === 'right';
  const fullscreen = u.panelFullscreen && !u.panelCollapsed;
  const spectator = s.mode === 'spectator';
  const variant: PanelVariant = fullscreen || horizontal ? 'stack' : dock === 'top' ? 'row' : 'grid';
  const dockSize = variant === 'stack' ? 'normal' : variant;

  const setDock = (d: PanelDock) => ui.set({ dock: d, panelCollapsed: false, panelFullscreen: false });
  const toggleFull = () => ui.set({ panelFullscreen: !u.panelFullscreen, panelCollapsed: false });
  const toggleCollapse = () => ui.set({ panelCollapsed: !u.panelCollapsed, panelFullscreen: false });

  /* drag the edge to resize (reference: #panelResize) */
  const onResize = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = rootRef.current;
    if (!el) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (horizontal) {
        const w = dock === 'left' ? ev.clientX - r.left : r.right - ev.clientX;
        setSize((p) => ({ ...p, w: Math.min(MAX.w, Math.max(MIN.w, Math.round(w))) }));
      } else {
        const h = dock === 'top' ? ev.clientY - r.top : r.bottom - ev.clientY;
        setSize((p) => ({ ...p, h: Math.min(MAX.h, Math.max(MIN.h, Math.round(h))) }));
      }
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const rootSx = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    bgcolor: '#fff',
    overflow: 'hidden',
    minHeight: 0,
    minWidth: 0,
    fontSize: 14,
    lineHeight: 1.45,
    color: ref.ink,
    ...(fullscreen
      ? { flex: 1 }
      : {
          flexShrink: 0,
          borderRight: dock === 'left' ? `1px solid ${ref.line}` : undefined,
          borderLeft: dock === 'right' ? `1px solid ${ref.line}` : undefined,
          borderBottom: dock === 'top' ? `1px solid ${ref.line}` : undefined,
          borderTop: dock === 'bottom' ? `1px solid ${ref.line}` : undefined,
          boxShadow: `inset ${dock === 'left' ? '4px 0' : dock === 'right' ? '-4px 0' : dock === 'top' ? '0 4px' : '0 -4px'} 0 ${panelRef.shadowInset}`,
          ...(u.panelCollapsed
            ? horizontal
              ? { width: { xs: '100%', md: 48 }, height: { xs: 48, md: '100%' }, boxShadow: 'none', overflow: 'visible', background: '#fff', [dock === 'left' ? 'borderRight' : 'borderLeft']: '1px solid #e2e8f0' }
              : { width: '100%', height: 42 }
            : horizontal
              ? { width: { xs: '100%', md: size.w }, height: { xs: '55%', md: '100%' } }
              : { width: '100%', height: size.h }),
        }),
  } as const;

  if (u.panelCollapsed && !fullscreen && horizontal) {
    // The real application's collapsed panel: a 48px white strip, the vertical label "Execution Panel" centred, and a round chevron
    // button on the strip's inner edge that expands the panel.
    const left = dock === 'left';
    return (
      <Box component="aside" ref={rootRef} aria-label="Execution panel (collapsed)" sx={rootSx}>
        <Box
          component="button"
          type="button"
          data-spec="panel-rail"
          aria-label="Expand execution panel"
          title="Expand panel"
          onClick={toggleCollapse}
          sx={{
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', boxSizing: 'border-box', m: 0, p: 0, border: 0, bgcolor: 'transparent', cursor: 'pointer', fontFamily: 'inherit', color: '#0f172a',
            '&:focus-visible': { outline: `2px solid ${ref.blue4}`, outlineOffset: -2 },
            '&:hover [data-spec=panel-rail-chevron]': { boxShadow: '0 2px 8px 0 rgba(0,0,0,0.28)' },
          }}
        >
          <Box component="span" sx={{ writingMode: { xs: 'horizontal-tb', md: 'vertical-rl' }, transform: { xs: 'none', md: 'rotate(180deg)' }, fontSize: 13, lineHeight: '20px', fontWeight: fw.semiBold, whiteSpace: 'nowrap' }}>
            Execution Panel
          </Box>
          <Box
            component="span"
            data-spec="panel-rail-chevron"
            aria-hidden
            sx={{ position: 'absolute', top: 'calc(50% - 12px)', [left ? 'right' : 'left']: -12, display: { xs: 'none', md: 'grid' }, placeItems: 'center', width: 24, height: 24, boxSizing: 'border-box', borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.2)', color: '#0f172a', zIndex: 2, transform: left ? 'none' : 'scaleX(-1)' }}
          >
            <ArrowRight01Icon size={16} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (u.panelCollapsed && !fullscreen) {
    return (
      <Box component="aside" ref={rootRef} aria-label="Execution panel (collapsed)" sx={rootSx}>
        <Box
          component="button"
          type="button"
          data-spec="panel-rail"
          aria-label="Expand execution panel"
          title="Expand panel"
          onClick={toggleCollapse}
          sx={{
            display: 'flex',
            flexDirection: horizontal ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: horizontal ? 'flex-start' : 'center',
            gap: '12px',
            width: '100%',
            height: horizontal ? '100%' : 14,
            boxSizing: 'border-box',
            border: 0,
            bgcolor: 'transparent',
            cursor: 'pointer',
            p: horizontal ? '14px 0' : 0,
            color: ref.blue3,
            fontFamily: 'inherit',
            '&:hover': { bgcolor: ref.tint2 },
          }}
        >
          <Box component="span" sx={{ display: 'flex', transform: dock === 'right' ? 'scaleX(-1)' : dock === 'top' ? 'rotate(90deg)' : dock === 'bottom' ? 'rotate(-90deg)' : undefined }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Box>
          <Box component="span" sx={{ writingMode: horizontal ? 'vertical-rl' : 'horizontal-tb', transform: horizontal ? 'rotate(180deg)' : 'none', fontSize: 10, fontWeight: panelRole.strong, color: ref.blue3 }}>Execution Panel</Box>
        </Box>
      </Box>
    );
  }

  const head = (
    <Box data-spec="panel-head" sx={{ p: '9px 14px', borderBottom: `1px solid ${ref.tint2}`, background: `linear-gradient(180deg,${ref.tint2},#fff)`, flexShrink: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Box component="span" sx={{ fontSize: 10, fontWeight: panelRole.strong, color: ref.blue3 }}>Execution Panel</Box>
        <Box component="span" sx={{ flex: 1 }} />
        <DockMenu dock={dock} fullscreen={fullscreen} onDock={setDock} onFullscreen={toggleFull} />
        <Box
          component="button"
          type="button"
          data-spec="collapse-btn"
          aria-label="Collapse panel"
          title="Collapse panel"
          onClick={toggleCollapse}
          sx={{ display: 'grid', placeItems: 'center', width: 24, height: 22, boxSizing: 'border-box', p: 0, border: `1px solid ${ref.line}`, borderRadius: '6px', bgcolor: '#fff', color: ref.muted, cursor: 'pointer', '&:hover': { color: ref.blue3, borderColor: ref.blue4, bgcolor: ref.tint } }}
        >
          <CollapseGlyph dock={dock} />
        </Box>
      </Box>
    </Box>
  );

  const resize = !fullscreen && (
    <Box
      data-spec="panel-resize"
      aria-hidden
      onPointerDown={onResize}
      sx={{
        position: 'absolute',
        zIndex: 9,
        ...(horizontal
          ? { top: 0, width: 6, height: '100%', cursor: 'ew-resize', [dock === 'left' ? 'right' : 'left']: -3 }
          : { left: 0, width: '100%', height: 6, cursor: 'ns-resize', [dock === 'top' ? 'bottom' : 'top']: -3 }),
        '&::after': { content: '""', position: 'absolute', top: '50%', left: horizontal ? 'auto' : '50%', transform: horizontal ? 'translateY(-50%)' : 'translate(-50%,-50%)', width: horizontal ? 3 : 40, height: horizontal ? 40 : 3, borderRadius: '3px', bgcolor: ref.line },
        '&:hover::after': { bgcolor: ref.blue3 },
      }}
    />
  );

  if (!step) {
    return (
      <Box component="aside" ref={rootRef} aria-label="Execution panel" sx={rootSx}>
        {head}
        <Box sx={{ flex: 1, p: '12px 14px', fontSize: 12, color: ref.muted }}>Select a step in the document to work on it here.</Box>
        {resize}
      </Box>
    );
  }

  const locked = step.state === 'recorded' && !step.editUnlocked;
  const readOnly = spectator || locked;
  const table = s.protocol.tables.find((t) => t.n === step.table);
  const signoff = !!table?.signoff;
  const gated = s.options.gateTable2 && step.table >= 3 && !isTableVerified(s, 2);
  const evidenceItems = (step.evidence ?? []).flatMap((id) => {
    const e = s.evidence.find((x) => x.id === id);
    return e ? [e] : [];
  });
  const discs = discrepanciesForStep(s, step.id);
  const aiState = step.state === 'aiFilled' && !step.editUnlocked;
  const hideInsExp = variant === 'row';

  const saveDraft = () => {
    const r = executionActions.saveDraft(step.id);
    if (r.ok) ui.toast('success', `Draft saved for ${stepLabel(s, step)}`);
    else ui.toast('warn', r.errors[0] ?? 'Could not save.');
  };
  const record = () => {
    const errs = recordFlow(step.id);
    if (errs.length) ui.toast('warn', errs.join(' · '));
  };
  const removeEvidence = (id: string) => {
    const r = executionActions.removeEvidence(step.id, id);
    if (!r.ok) ui.toast('warn', r.errors[0] ?? 'Could not remove the evidence.');
  };

  const meta = aiState ? (
    <>
      AI-filled draft · <b>{step.aiMismatch ?? 'review, then record to accept'}</b>
    </>
  ) : step.editUnlocked ? (
    <>
      Editing a recorded step · <b>record again when ready</b>
    </>
  ) : locked ? (
    <>
      Recorded · <b>locked, use Edit to change</b>
    </>
  ) : step.dirty ? (
    <>
      Not saved · <b>unsaved changes</b>
    </>
  ) : step.state === 'draft' ? (
    <>
      Draft saved · <b>record when ready</b>
    </>
  ) : (
    <>
      Not saved · <b>pending</b>
    </>
  );

  const reasonArea = (
    <Box data-spec="exrte-reason" sx={{ boxSizing: 'border-box', m: '5px', p: '9px 11px', minHeight: 64, border: `1px dashed ${ref.tint}`, borderRadius: '6px', bgcolor: panelRef.areaBg, fontSize: dockSize === 'grid' ? 11.5 : dockSize === 'row' ? 11 : 12, lineHeight: 1.5, wordBreak: 'break-word' }}>
      {step.editReason ?? <Box component="span" sx={{ color: '#9AA6BF', fontStyle: 'italic' }}>No reason entered.</Box>}
    </Box>
  );

  const actualHead = (
    <>
      <Box component="span" role="tablist" sx={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
        <PhTab on={tab === 'actual'} onClick={() => setTab('actual')}>
          {signoff ? 'Comments' : 'Actual Result'}
        </PhTab>
        {step.editUnlocked && (
          <PhTab on={tab === 'reason'} onClick={() => setTab('reason')}>
            Reason for Edit <Box component="span" sx={{ color: panelRef.fail, fontWeight: panelRole.strong }}>*</Box>
          </PhTab>
        )}
      </Box>
      <Box component="button" type="button" aria-label="Scan code (not available in this sample)" title="Scan code (not available in this sample)" aria-disabled sx={{ ...iconBtnSx, ml: '4px', cursor: 'default' }}>
        {icons.qr(14)}
      </Box>
      <DotsMenu
        alignLeft={variant === 'grid'}
        items={[
          {
            label: 'Copy Expected Result',
            disabled: readOnly || !!step.control,
            onClick: () => {
              const r = executionActions.setActual(step.id, step.expected);
              ui.toast(r.ok ? 'success' : 'warn', r.ok ? 'Expected result copied to the actual result' : (r.errors[0] ?? 'Could not copy.'));
            },
          },
          {
            label: 'Copy Execution Result',
            disabled: !plain(step.actual),
            onClick: () => {
              void navigator.clipboard?.writeText(plain(step.actual));
              ui.toast('success', 'Execution result copied');
            },
          },
        ]}
      />
    </>
  );

  const hasNotes = discs.length > 0 || gated || spectator || !!step.signature;

  return (
    <Box component="aside" ref={rootRef} aria-label="Execution panel" sx={rootSx}>
      {head}
      <Box
        ref={bodyRef}
        data-spec="panel-body"
        sx={{
          flex: '1 1 0%',
          minHeight: 0,
          ...(variant === 'stack'
            ? { overflowY: 'auto', p: '12px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }
            : variant === 'row'
              ? { overflow: 'auto', p: '12px 14px', display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: '8px' }
              : { overflow: 'hidden auto', p: '4px 16px 10px', display: 'flex', flexDirection: 'column', gap: 0 }),
        }}
      >
        <Section icon={icons.check()} label={signoff ? 'Sign-off Activity' : 'Instructions'} tag="Read-only" variant={variant} order={1} hidden={hideInsExp}>
          <ReadCard variant={variant} dockSize={dockSize}>{step.instructions}</ReadCard>
        </Section>
        <Section icon={icons.clock()} label={signoff ? 'Criteria' : 'Expected Results'} variant={variant} order={2} hidden={hideInsExp}>
          <ReadCard tone="exp" variant={variant} dockSize={dockSize}>{step.expected}</ReadCard>
        </Section>

        <Section icon={icons.edit()} head={actualHead} variant={variant} order={3} grow={1.5}>
          <ExecutionRichText
            key={`${step.id}-${step.editUnlocked ? 'edit' : 'view'}-${step.control ? 'ctl' : 'rte'}`}
            value={step.actual}
            readOnly={readOnly}
            placeholder="Enter the actual result"
            ariaLabel="Actual result"
            areaFontSize={dockSize === 'grid' ? 11.5 : dockSize === 'row' ? 11 : 12}
            areaMinHeight={dockSize === 'grid' ? 46 : 64}
            hideToolbar={!!step.control || tab === 'reason'}
            area={step.control ? <PanelControl step={step} disabled={readOnly} /> : tab === 'reason' ? reasonArea : undefined}
            meta={meta}
            onChange={(html) => {
              // A read-only (recorded or spectator) editor re-emits its own content when the step changes under it: ignore that.
              if (readOnly) return;
              const next = plain(html) ? html : '';
              if (next === step.actual) return;
              const r = executionActions.setActual(step.id, next);
              if (!r.ok) ui.toast('warn', r.errors[0] ?? 'Could not change the result.');
            }}
          />
        </Section>

        <Section icon={icons.check()} label={signoff ? 'Status' : 'P/F'} variant={variant} order={5} grow={0.8}>
          <VerdictButtons
            value={step.verdict}
            disabled={readOnly}
            variant={variant === 'row' ? 'single' : variant}
            onPick={(v) => {
              if (v === 'na') {
                ui.open('markNA', { stepIds: [step.id] });
                return;
              }
              const r = executionActions.setVerdict(step.id, v);
              if (!r.ok) ui.toast('error', r.errors[0] ?? 'Could not set the verdict.');
            }}
          />
        </Section>

        {!(signoff && step.evidence === null) && (
          <Section
            icon={icons.upload()}
            label="Evidence"
            variant={variant}
            order={4}
            grow={1.3}
            tag={
              step.evidence !== null ? (
                <Box component="button" type="button" onClick={() => ui.open('evidence', { stepId: step.id })} sx={{ p: 0, border: 0, bgcolor: 'transparent', color: 'inherit', font: 'inherit', cursor: 'pointer', '&:hover': { color: ref.blue3, textDecoration: 'underline' } }}>
                  View all
                </Box>
              ) : undefined
            }
          >
            <Box
              data-spec="evi-box"
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                if (!readOnly && step.evidence !== null) setEvEl(e.currentTarget);
              }}
              sx={{ boxSizing: 'border-box', border: `1.5px solid ${ref.blue5}`, borderRadius: '9px', bgcolor: readOnly ? ref.tint2 : '#fff', overflow: 'hidden', cursor: readOnly ? 'default' : 'text', position: 'relative' }}
            >
              <Box data-spec="evi-cards" sx={{ display: 'flex', flexDirection: 'column', gap: '4px', p: '8px', minHeight: dockSize === 'grid' ? 38 : 56, boxSizing: 'border-box' }}>
                {step.evidence === null ? (
                  <Box sx={{ fontSize: 11, color: ref.muted, textAlign: 'center', p: '14px 0' }}>Evidence is not applicable for this step.</Box>
                ) : (
                  <>
                    {evidenceItems.length === 0 && !readOnly && <Box sx={{ fontSize: 11, color: ref.muted, p: '3px 2px' }}>Click to add evidence</Box>}
                    {evidenceItems.map((e) => (
                      <Box key={e.id} data-spec="evi-row" sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '3px 2px' }} onClick={(ev: React.MouseEvent) => ev.stopPropagation()}>
                        <Box
                          component="a"
                          role="link"
                          tabIndex={0}
                          title={`View ${e.name}`}
                          onClick={() => ui.open('evidenceViewer', { evidenceId: e.id })}
                          onKeyDown={(ev: React.KeyboardEvent) => ev.key === 'Enter' && ui.open('evidenceViewer', { evidenceId: e.id })}
                          sx={{ fontSize: 12, color: panelRef.eviLink, textDecoration: 'underline', cursor: 'pointer', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', '&:hover': { color: ref.navy2 } }}
                        >
                          {e.name}
                        </Box>
                        {!readOnly && (
                          <Box
                            component="button"
                            type="button"
                            aria-label={`Remove ${e.name}`}
                            title="Remove"
                            onClick={() => removeEvidence(e.id)}
                            sx={{ ml: 'auto', width: 22, height: 22, flexShrink: 0, p: '2px', border: 0, bgcolor: 'transparent', color: ref.muted, borderRadius: '5px', cursor: 'pointer', display: 'grid', placeItems: 'center', '&:hover': { bgcolor: panelRef.failBg, color: panelRef.fail } }}
                          >
                            {icons.x(11)}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </>
                )}
              </Box>
            </Box>
            <DropdownMenu
              anchorEl={evEl}
              open={!!evEl}
              onClose={() => setEvEl(null)}
              ariaLabel="Add evidence"
              options={EVIDENCE_KINDS.map((k) => ({ label: k.label, value: k.kind }))}
              onSelect={(o) => {
                setEvEl(null);
                captureEvidence(o.value as EvidenceKind);
              }}
            />
          </Section>
        )}

        {hasNotes && (
          <Box data-spec="panel-notes" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', fontSize: 10, color: ref.muted, flex: variant === 'row' ? '0 0 auto' : undefined, order: 6, pt: variant === 'grid' ? '9px' : 0 }}>
            {spectator && <Chip label="Read-only (spectator)" color="gray" variant="strokeLight" size="xsmall" />}
            {gated && <Chip label="Locked: verify table 2 first" color="orange" variant="strokeLight" size="xsmall" />}
            {discs.map((d) => (
              <Chip key={d.id} label={`${d.id}: ${d.status === 'underAssessment' ? 'under assessment' : d.status === 'pendingReview' ? 'pending review' : d.status}`} color="red" variant="strokeLight" size="xsmall" onClick={() => ui.open('discrepancies')} />
            ))}
            {step.signature && (
              <span>
                Signed by {step.signature.who}
                {step.signature.by === 'ai' ? ' (AI-assisted result accepted)' : step.signature.by === 'na' ? ' (marked N/A)' : ''}, {fmtWhen(step.signature.when)}
              </span>
            )}
          </Box>
        )}
      </Box>

      <Box data-spec="panel-foot" sx={{ p: '10px 14px', borderTop: `1px solid ${ref.line}`, background: `linear-gradient(180deg,#fff,${ref.tint2})`, display: 'flex', gap: '6px', justifyContent: 'flex-end', flexShrink: 0 }}>
        <PanelBtn disabled={step.history.length === 0} onClick={() => ui.open('history', { stepId: step.id })} sx={{ mr: 'auto' }}>
          History ({step.history.length})
        </PanelBtn>
        {locked ? (
          <PanelBtn tone="primary" disabled={spectator} onClick={() => ui.open('editReason', { stepId: step.id })} sx={{ minWidth: 100 }}>
            {icons.edit(11)}
            Edit
          </PanelBtn>
        ) : (
          <>
            <PanelBtn disabled={spectator} onClick={saveDraft} sx={{ minWidth: 100 }}>
              Save
            </PanelBtn>
            <PanelBtn tone="primary" disabled={spectator} onClick={record} sx={{ width: 120, flexShrink: 0 }}>
              {aiState ? icons.tick(11) : icons.pencil(11)}
              {aiState ? 'Verify & Record' : 'Record'}
            </PanelBtn>
          </>
        )}
      </Box>
      {resize}
    </Box>
  );
}
