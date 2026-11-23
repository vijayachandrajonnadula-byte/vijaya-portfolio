import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Box } from '../../../components/mui';
import { FlyoutPanel } from '../../../components/feedback/Flyout/Flyout';
import { Chip } from '../../../components/data-display/Chip/Chip';
import { Button } from '../../../components/actions/Button/Button';
import { Attachment01Icon, CheckmarkCircle01Icon, ChatBotIcon, Folder01Icon, PlayIcon, VideoReplayIcon, Cancel01Icon } from '../../../icons';
import { actRef, panelRef, ref } from '../refTheme';
import { executionActions, executionStore, useExecution } from '../store';
import { ui } from '../ui';
import { W, tx } from './parts';
import { RefButton, focusRing } from '../shell/RefControls';
import { StateChip, VerdictChip, stepLabel } from './shared';

type Source = 'attachments' | 'liveTab';
type Scope = 'entire' | 'rows';
interface TableScope {
  on: boolean;
  scope: Scope;
  rows: number[];
}

/** Sample inputs. Nothing is uploaded or read; the proposals come from the scripted output stored on each step. */
const SAMPLE_FILES = ['bench-run.mp4', 'tachometer-readings.pdf', 'operator-notes.docx'];
const STEP_MS = 220;

const stepHead = (n: number, text: string) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', m: '14px 12px 2px', ...tx(11, W.heavy, ref.blue3, 15.95) }}>
    <Box aria-hidden sx={{ width: 18, height: 18, borderRadius: '50%', background: ref.blue3, display: 'grid', placeItems: 'center', flexShrink: 0, ...tx(10, W.heavy, ref.white, 14.5) }}>{n}</Box>
    {text}
  </Box>
);

const checkbox = { width: 13, height: 13, m: '3px 3px 3px 4px', cursor: 'pointer', accentColor: ref.blue3, flexShrink: 0 } as const;

function Opt({ selected, locked, tile, icon, label, desc, onSelect, children }: { selected: boolean; locked: boolean; tile: string; icon: ReactNode; label: string; desc: string; onSelect: () => void; children?: ReactNode }) {
  return (
    <Box
      data-spec="ai-opt"
      sx={{ m: '8px 10px', border: `1px solid ${selected ? ref.blue3 : ref.tint2}`, borderRadius: '10px', background: ref.white, overflow: 'hidden', boxShadow: selected ? '0 0 0 2px rgba(47,84,150,.16)' : 'none', transition: 'border-color .15s, box-shadow .15s ease', '&:hover': { borderColor: selected ? ref.blue3 : ref.blue6 } }}
    >
      <Box
        role="radio"
        aria-checked={selected}
        aria-disabled={locked}
        tabIndex={locked ? -1 : 0}
        onClick={() => !locked && onSelect()}
        onKeyDown={(e: React.KeyboardEvent) => { if (!locked && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); onSelect(); } }}
        sx={{ display: 'flex', alignItems: 'center', gap: '10px', p: '11px 12px', cursor: locked ? 'not-allowed' : 'pointer', ...focusRing }}
      >
        <Box aria-hidden sx={{ width: 18, height: 18, boxSizing: 'border-box', border: `2px solid ${selected ? ref.blue3 : ref.blue6}`, borderRadius: '50%', flexShrink: 0, background: selected ? ref.blue3 : 'transparent', boxShadow: selected ? `inset 0 0 0 3px ${ref.white}` : 'none', transition: 'all .15s ease' }} />
        <Box aria-hidden sx={{ width: 32, height: 32, borderRadius: '7px', background: tile, display: 'grid', placeItems: 'center', flexShrink: 0, color: ref.grayIc }}>{icon}</Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={tx(12, W.emphasis, ref.ink, 17.4)}>{label}</Box>
          <Box sx={{ mt: '1px', ...tx(10, W.regular, actRef.aiOptDesc, 13) }}>{desc}</Box>
        </Box>
      </Box>
      {selected && children}
    </Box>
  );
}

/**
 * AI agent panel (320px, slides in over 0.25s, leaves the page usable). The assistant proposes; the executor reviews and
 * records. Nothing is signed by the AI: recording is always an action of the signed-in user, marked as AI-assisted.
 */
export default function AiAgentFlyout() {
  const s = useExecution();
  const [source, setSource] = useState<Source>('attachments');
  const [files, setFiles] = useState<string[]>([]);
  const [scope, setScope] = useState<Record<number, TableScope>>({});
  const [running, setRunning] = useState<{ done: number; total: number } | null>(null);
  const [runIds, setRunIds] = useState<string[]>([]);
  const [skipNote, setSkipNote] = useState<string[]>([]);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearInterval(timer.current), []);
  const close = () => ui.close('aiAgent');

  const get = (n: number): TableScope => scope[n] ?? { on: false, scope: 'entire', rows: [] };
  const patch = (n: number, p: Partial<TableScope>) => setScope((x) => ({ ...x, [n]: { ...get(n), ...p } }));
  const allOn = s.protocol.tables.every((t) => get(t.n).on);
  const anyOn = s.protocol.tables.some((t) => get(t.n).on);

  const selected = s.protocol.tables.flatMap((t) => {
    const g = get(t.n);
    if (!g.on) return [];
    return g.scope === 'entire' ? t.stepIds : t.stepIds.filter((_, i) => g.rows.includes(i + 1));
  });
  const runnable = selected.filter((id) => s.protocol.steps[id]?.state !== 'recorded');
  const waiting = runIds.filter((id) => s.protocol.steps[id]?.state === 'aiFilled').length;

  const run = () => {
    setSkipNote([]);
    if (runnable.length === 0) {
      ui.toast('warn', 'Choose at least one table or row that is not recorded yet.');
      return;
    }
    const ids = runnable;
    let done = 0;
    setRunning({ done, total: ids.length });
    timer.current = window.setInterval(() => {
      done += 1;
      setRunning({ done, total: ids.length });
      if (done >= ids.length) {
        window.clearInterval(timer.current);
        const r = executionActions.aiFill(ids);
        setRunning(null);
        if (!r.ok) {
          ui.toast('error', r.errors[0] ?? 'The agent did not run.');
          return;
        }
        const filled = r.affected ?? [];
        setRunIds(filled);
        const steps = executionStore.getState().protocol.steps;
        const fails = filled.filter((id) => steps[id]?.verdict === 'fail').length;
        ui.toast('ai', `AI proposed ${filled.length} result${filled.length === 1 ? '' : 's'} (${filled.length - fails} pass, ${fails} fail). Review and record them.`);
      }
    }, STEP_MS);
  };

  const record = (id: string) => {
    const r = executionActions.recordStep(id);
    if (!r.ok) return ui.toast('error', r.errors[0] ?? 'The step could not be recorded.');
    ui.toast('success', `${stepLabel(s.protocol.steps[id] ?? { table: 0, row: 0 })} recorded`);
    if (r.promptDiscrepancy) ui.open('discrepancyPrompt', { stepId: id });
  };

  const recordAll = () => {
    const ids = runIds.filter((id) => s.protocol.steps[id]?.state === 'aiFilled');
    const r = executionActions.recordAllAi(ids);
    const notes = (r.skipped ?? []).map((x) => `${stepLabel(s.protocol.steps[x.stepId] ?? { table: 0, row: 0 })}: ${x.errors[0] ?? ''}`);
    setSkipNote(notes);
    if (!r.ok) {
      ui.toast('error', r.skipped?.[0]?.errors[0] ?? r.errors[0] ?? 'Nothing could be recorded.');
      return;
    }
    ui.toast('success', `${r.affected?.length ?? 0} AI-filled result${r.affected?.length === 1 ? '' : 's'} recorded`);
    const first = r.promptDiscrepancyFor?.[0];
    if (first) ui.open('discrepancyPrompt', { stepId: first });
  };

  const status = running ? 'running' : waiting > 0 ? 'done' : 'ready';
  const pill = {
    ready: { text: 'Ready', color: 'gray' },
    running: { text: 'Running', color: 'blue' },
    done: { text: `${waiting} AI`, color: 'green' },
  }[status] as { text: string; color: 'gray' | 'blue' | 'green' };

  return (
    // A floating panel that leaves the page usable (no scrim), so it uses the design system's inline FlyoutPanel in a fixed slot.
    <Box role="complementary" aria-label="AI agent" data-spec="sidepanel" sx={{ position: 'fixed', top: 0, right: 0, height: '100vh', width: 320, maxWidth: '100vw', zIndex: 1150, boxShadow: actRef.shadowSlide }}>
    <FlyoutPanel
      width="100%"
      onClose={close}
      headerProps={{ title: 'AI agent', icon: <ChatBotIcon size={22} />, titleAdornment: <Chip label={pill.text} color={pill.color} size="xsmall" /> }}
      disableContentPadding
      footerLeft={<Button size="small" variant="outlined" startIcon={<PlayIcon size={12} />} onClick={run} disabled={!!running || s.mode === 'spectator'}>Run</Button>}
      footer={<Button size="small" color="success" startIcon={<CheckmarkCircle01Icon size={14} />} onClick={recordAll} disabled={waiting === 0}>Record all{waiting > 0 ? ` (${waiting})` : ''}</Button>}
    >
      {running && (
        <Box data-spec="ai-prog" role="status" sx={{ p: '9px 12px', borderBottom: `1px solid ${ref.line}`, boxSizing: 'border-box' }}>
          <Box sx={tx(10, W.emphasis, ref.blue3, 14.5)}>Analysing steps</Box>
          <Box sx={{ mt: '2px', height: 5, background: ref.tint2, borderRadius: '3px', overflow: 'hidden' }}>
            <Box sx={{ width: `${Math.round((running.done / running.total) * 100)}%`, height: 5, background: ref.blue3, transition: 'width .2s ease' }} />
          </Box>
          <Box sx={{ mt: '2px', ...tx(10, W.regular, ref.muted, 14.5) }}>Step {Math.min(running.done + 1, running.total)} of {running.total}</Box>
        </Box>
      )}
      {stepHead(1, 'Select tables & steps for the agent')}
      <Box data-spec="ai-tblcard" sx={{ m: '10px', border: `1px solid ${ref.blue3}`, borderRadius: '9px', overflow: 'hidden' }}>
        <Box sx={{ p: '10px 12px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {s.protocol.tables.map((t) => {
              const g = get(t.n);
              const pend = t.stepIds.filter((id) => s.protocol.steps[id]?.state !== 'recorded').length;
              return (
                <Box key={t.n} sx={{ display: 'flex', flexDirection: 'column', background: g.on ? actRef.aiItemOn : 'transparent', borderRadius: g.on ? '8px' : 0, p: g.on ? '0 0 2px' : 0 }}>
                  <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '6px 8px', border: `1px solid ${g.on ? ref.blue3 : actRef.aiTint}`, borderRadius: '6px', background: actRef.aiTint, cursor: 'pointer', '&:hover': { borderColor: g.on ? ref.blue3 : ref.blue6 } }}>
                    <Box component="input" type="checkbox" checked={g.on} onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch(t.n, { on: e.target.checked })} sx={checkbox} />
                    <Box component="span" sx={{ flex: 1, minWidth: 0, ...tx(11, W.emphasis, ref.ink, 15.95) }}>Table {t.n}: {t.title}</Box>
                    <Box component="span" sx={{ p: '1px 6px', border: `1px solid ${ref.line}`, borderRadius: '8px', background: ref.white, ...tx(9.5, W.regular, ref.muted, 13.775) }}>{pend}/{t.stepIds.length}</Box>
                  </Box>
                  {g.on && (
                    <>
                      <Box role="group" aria-label={`Table ${t.n} scope`} sx={{ display: 'flex', p: '2px', m: '3px 8px 6px 26px', border: `1px solid ${actRef.aiModeBorder}`, borderRadius: '20px', background: actRef.aiModeTrack }}>
                        {(['entire', 'rows'] as const).map((k) => (
                          <RefButton
                            key={k}
                            aria-pressed={g.scope === k}
                            onClick={() => patch(t.n, { scope: k })}
                            sx={{ flex: 1, justifyContent: 'center', p: '5px 8px', borderRadius: '16px', transition: 'all .15s ease', ...tx(10, W.strong, g.scope === k ? ref.white : ref.muted), background: g.scope === k ? ref.blue3 : 'transparent', boxShadow: g.scope === k ? '0 2px 6px rgba(47,84,150,.32)' : 'none' }}
                          >
                            {k === 'entire' ? 'Entire table' : 'Selected rows'}
                          </RefButton>
                        ))}
                      </Box>
                      {g.scope === 'rows' && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px', m: '0 8px 6px 26px' }}>
                          {t.stepIds.map((_, i) => (
                            <Box component="label" key={i} sx={{ display: 'inline-flex', alignItems: 'center', gap: '2px', p: '1px 6px 1px 0', border: `1px solid ${ref.line}`, borderRadius: '8px', background: ref.white, cursor: 'pointer', ...tx(9.5, W.emphasis, ref.ink, 13.775) }}>
                              <Box component="input" type="checkbox" checked={g.rows.includes(i + 1)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch(t.n, { rows: e.target.checked ? [...g.rows, i + 1] : g.rows.filter((r) => r !== i + 1) })} sx={{ ...checkbox, width: 11, height: 11 }} />
                              Row {i + 1}
                            </Box>
                          ))}
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              );
            })}
          </Box>
          <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: '7px', p: '7px 8px', m: '6px 0 0', borderTop: `1px dashed ${ref.blue3}`, cursor: 'pointer', ...tx(11, W.strong, ref.blue3, 15.95) }}>
            <Box component="input" type="checkbox" checked={allOn} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScope(Object.fromEntries(s.protocol.tables.map((t) => [t.n, { ...get(t.n), on: e.target.checked }])))} sx={checkbox} />
            Select all {s.protocol.tables.length} tables
          </Box>
          <Box sx={{ p: '5px 7px', m: '6px 0 0', border: `1px solid ${actRef.aiTint}`, borderRadius: '5px', background: actRef.aiTint, ...tx(9.5, W.regular, ref.muted, 13.3) }}>
            Tick a table to enable its <Box component="b" sx={{ fontWeight: W.strong, color: ref.blue3 }}>entire table</Box> or <Box component="b" sx={{ fontWeight: W.strong, color: ref.blue3 }}>selected rows</Box> scope. <Box component="b" sx={{ fontWeight: W.strong, color: ref.blue3 }}>Run</Box> proposes a draft for every step in scope that is not recorded yet.
          </Box>
        </Box>
      </Box>

      {stepHead(2, 'Choose the input')}
      {!anyOn && <Box sx={{ p: '6px 9px', m: '2px 12px 4px', border: `1px dashed ${actRef.aiTint}`, borderRadius: '6px', background: actRef.aiTint, ...tx(10.5, W.regular, ref.muted, 15.225) }}>Select at least one table above to choose an input.</Box>}
      <Box sx={{ opacity: anyOn ? 1 : 0.45, filter: anyOn ? 'none' : 'grayscale(.3)' }}>
        <Opt selected={source === 'attachments'} locked={!anyOn} tile={actRef.aiVidTile} icon={<Attachment01Icon size={16} />} label="Attachments" desc="Attach multiple videos or documents as evidence" onSelect={() => setSource('attachments')}>
          <Box sx={{ p: '0 12px 12px 40px' }}>
            <Box
              role="button"
              tabIndex={0}
              onClick={() => setFiles((f) => (f.length < SAMPLE_FILES.length ? [...f, SAMPLE_FILES[f.length] as string] : f))}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFiles((f) => (f.length < SAMPLE_FILES.length ? [...f, SAMPLE_FILES[f.length] as string] : f)); } }}
              sx={{ p: '14px 10px', border: `2px dashed ${actRef.aiDropBorder}`, borderRadius: '7px', background: ref.tint2, textAlign: 'center', cursor: 'pointer', ...focusRing }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: '3px', color: ref.draft }}><Folder01Icon size={22} /></Box>
              <Box sx={tx(11, W.emphasis, ref.navy2, 15.95)}>Drop videos / files or click to browse</Box>
              <Box sx={tx(10, W.regular, ref.blue5, 14.5)}>Sample only: each click adds a sample file</Box>
            </Box>
            {files.length > 0 && (
              <Box sx={{ mt: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {files.map((f) => (
                  <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '6px 9px', border: `1px solid ${ref.tint2}`, borderRadius: '7px', background: ref.tint2, ...tx(11, W.regular, ref.ink, 15.95) }}>
                    <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f}</Box>
                    <RefButton aria-label={`Remove ${f}`} onClick={() => setFiles((x) => x.filter((y) => y !== f))} sx={{ color: ref.muted, '&:hover': { color: ref.failFg }, ...focusRing }}><Cancel01Icon size={12} /></RefButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Opt>
        <Opt selected={source === 'liveTab'} locked={!anyOn} tile={actRef.aiLiveTile} icon={<VideoReplayIcon size={16} />} label="Start a Live Tab Session" desc="Sample session: no tab is shared and nothing is captured" onSelect={() => setSource('liveTab')} />
      </Box>

      {runIds.length > 0 && (
        <>
          {stepHead(3, 'Review the drafts')}
          <Box sx={{ m: '8px 12px 14px', display: 'grid', gap: '8px' }}>
            <Box sx={{ p: '5px 7px', border: `1px solid ${actRef.aiTint}`, borderRadius: '5px', background: actRef.aiTint, ...tx(9.5, W.regular, ref.muted, 13.3) }}>
              AI results are drafts. Check each one against the expected result, then record it. The signature is yours; the assistant never signs.
            </Box>
            {skipNote.length > 0 && <Box role="alert" sx={{ p: '5px 7px', borderRadius: '5px', background: panelRef.failBg, ...tx(9.5, W.regular, ref.failFg, 13.3) }}>{skipNote.map((n) => <Box key={n}>{n}</Box>)}</Box>}
            {runIds.map((id) => {
              const st = s.protocol.steps[id];
              if (!st) return null;
              return (
                <Box key={id} sx={{ p: '8px 10px', border: `1px solid ${ref.line}`, borderRadius: '8px', display: 'grid', gap: '4px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Box sx={{ flex: 1, minWidth: 0, ...tx(11, W.emphasis, ref.ink, 15.95) }}>{stepLabel(st)}</Box>
                    <VerdictChip verdict={st.verdict} />
                    <StateChip state={st.state} />
                  </Box>
                  <Box sx={tx(10, W.regular, ref.muted, 14.5)}>Expected: {st.expected}</Box>
                  <Box sx={tx(10.5, W.regular, ref.ink, 15.225)}>Proposed: {st.actual}</Box>
                  {st.aiMismatch && <Box sx={{ p: '4px 6px', borderRadius: '5px', background: panelRef.failBg, ...tx(10, W.regular, ref.failFg, 14.5) }}>{st.aiMismatch}</Box>}
                  {st.state === 'aiFilled' && <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}><Button size="small" onClick={() => record(id)}>Record this step</Button></Box>}
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </FlyoutPanel>
    </Box>
  );
}
