import { useState } from 'react';
import { Box } from '../../components/mui';
import { DropdownMenu } from '../../components/form/DropdownMenu/DropdownMenu';
import { getPlainTextFromRTE } from '../../components/form/RichTextEditor/RichTextEditor';
import { Tooltip } from '../../components/feedback/Tooltip/Tooltip';
import { BarGroup, ChromeButton, SegmentedToggle } from '../../components/navigation/ExecutionChrome/ExecutionChrome';
import { ArrowDown01Icon, Attachment01Icon, Camera01Icon, Chat01Icon, Copy01Icon, DragDropVerticalIcon, Image01Icon, PencilEdit01Icon, Video02Icon } from '../../icons';
import { fw } from '../../theme/typography';
import type { EvidenceKind } from './model';
import { barRef } from './refTheme';
import { EVIDENCE_KINDS, Stack, captureEvidence } from './shell/shared';
import { executionStatus, useExecution } from './store';
import { ui, useUi } from './ui';

// ExecutionPanel imports these from here: keep them exported.
export { EVIDENCE_KINDS, Stack, captureEvidence };

const kindIcon = { file: Attachment01Icon, screenshot: Image01Icon, snapshot: Camera01Icon, video: Video02Icon } as const;
const kindColor: Record<EvidenceKind, string> = { file: barRef.attach, screenshot: barRef.screenshot, snapshot: barRef.snapshot, video: barRef.video };
const kindText: Record<EvidenceKind, string> = { file: 'Attach', screenshot: 'Screenshot', snapshot: 'Snapshot', video: 'Video' };

/** Text button of the media pill: 16px coloured icon and a 13px label. */
function PillButton({ kind, disabled, onClick }: { kind: EvidenceKind; disabled: boolean; onClick: () => void }) {
  const Icon = kindIcon[kind];
  return (
    <Box
      component="button"
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={EVIDENCE_KINDS.find((k) => k.kind === kind)?.label}
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: '4px', height: 28, px: '8px', m: 0, border: 0, borderRadius: '6px', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, lineHeight: '16px', fontWeight: fw.semiBold,
        color: barRef.ink, whiteSpace: 'nowrap', '&:hover:not(:disabled)': { background: barRef.soft }, '&:disabled': { cursor: 'not-allowed', opacity: 0.55 }, '&:focus-visible': { outline: `2px solid ${barRef.focus}`, outlineOffset: 1 },
      }}
    >
      <Icon size={16} color={kindColor[kind]} />
      {kindText[kind]}
    </Box>
  );
}

/**
 * Status bar (48px, #f6f8fc): Panel / Inline toggle, the execution status pill with its percentage, the live presence group, then the
 * media pill (attach, screenshot, snapshot, video, evidence count). In the Inline layout the Copy and Record buttons appear at the right.
 * `onRecord` is passed by the page (the record flow lives in ExecutionPanel; this file must not import it).
 */
export default function MediaBar({ onRecord }: { onRecord?: (stepId: string) => void }) {
  const s = useExecution();
  const u = useUi();
  const status = executionStatus(s);
  const spectator = s.mode === 'spectator';
  const step = s.selectedStepId ? s.protocol.steps[s.selectedStepId] : undefined;
  const noEvidence = !step || step.evidence === null || step.state === 'recorded';
  const [viewersEl, setViewersEl] = useState<HTMLElement | null>(null);
  const [copyEl, setCopyEl] = useState<HTMLElement | null>(null);
  const inline = u.layout === 'inline';
  const watchers = s.viewers.filter((v) => v.userId !== s.currentUserId);
  const shownWatchers = watchers.slice(0, 5);
  const more = watchers.length - shownWatchers.length;
  const recordedLocked = !!step && step.state === 'recorded' && !step.editUnlocked;

  const copyText = (text: string, what: string) => {
    const done = () => ui.toast('success', `${what} copied`);
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, () => ui.toast('error', 'Could not copy to the clipboard.'));
    else ui.toast('error', 'Copying is not available in this browser.');
  };

  return (
    <Box
      role="toolbar"
      aria-label="Media and status"
      sx={{
        display: 'flex', alignItems: 'center', gap: '8px', px: '16px', height: { md: 48 }, minHeight: 48, boxSizing: 'border-box', flexShrink: 0, background: barRef.surface, boxShadow: `inset 0 -1px 0 0 ${barRef.line}`,
        overflowX: 'auto', overflowY: 'hidden', color: barRef.ink, '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <SegmentedToggle ariaLabel="Layout" value={u.layout} onChange={(v) => ui.set({ layout: v })} options={[{ value: 'panel', label: 'Panel' }, { value: 'inline', label: 'Inline' }]} />

      <BarGroup
        component="button"
        onClick={() => ui.open('status')}
        aria-label={`Execution status ${status.percentRecorded} percent recorded. Open status`}
        sx={{ gap: '8px', px: '16px', cursor: 'pointer', fontSize: 9.5, lineHeight: '16px', fontWeight: fw.semiBold, '&:hover': { background: barRef.surface }, '&:focus-visible': { outline: `2px solid ${barRef.focus}`, outlineOffset: 1 } }}
      >
        Execution Status
        <Box component="span" sx={{ height: 16, minWidth: 16, boxSizing: 'border-box', px: '6px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: barRef.navy, color: '#fff', fontSize: 10, lineHeight: '16px', fontWeight: fw.semiBold }}>
          {status.percentRecorded}%
        </Box>
      </BarGroup>

      <BarGroup
        component="button"
        aria-haspopup="menu"
        aria-label={`Live: ${watchers.length} watching. Show viewers`}
        onClick={(e) => setViewersEl(e.currentTarget)}
        sx={{ gap: '8px', pl: '7px', pr: '9px', cursor: 'pointer', '&:hover': { background: barRef.surface }, '&:focus-visible': { outline: `2px solid ${barRef.focus}`, outlineOffset: 1 } }}
      >
        <Box component="span" sx={{ height: 24, boxSizing: 'border-box', px: '12px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', background: barRef.liveBg, border: `1px solid ${barRef.liveLine}`, color: barRef.live, fontSize: 10, lineHeight: '16px', fontWeight: fw.semiBold }}>
          LIVE
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {shownWatchers.map((v, i) => {
            const user = s.users.find((x) => x.id === v.userId);
            return (
              <Box
                key={v.userId}
                aria-hidden
                title={user?.name ?? v.role}
                sx={{ width: 24, height: 24, boxSizing: 'border-box', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 9, lineHeight: '12px', fontWeight: fw.semiBold, color: '#fff', border: '2px solid #fff', background: barRef.avatars[i % barRef.avatars.length], ml: i === 0 ? 0 : '-6px' }}
              >
                {user?.initials ?? v.role.slice(0, 2).toUpperCase()}
              </Box>
            );
          })}
          {more > 0 && (
            <Box aria-hidden sx={{ width: 24, height: 24, boxSizing: 'border-box', borderRadius: '50%', display: 'grid', placeItems: 'center', ml: '-6px', background: barRef.more, color: barRef.moreText, fontSize: 11, lineHeight: '12px', fontWeight: fw.medium, border: '2px solid #fff' }}>
              +{more}
            </Box>
          )}
        </Box>
      </BarGroup>
      <DropdownMenu
        anchorEl={viewersEl}
        open={!!viewersEl}
        onClose={() => setViewersEl(null)}
        ariaLabel="Viewers"
        options={s.viewers.map((v) => {
          const user = s.users.find((x) => x.id === v.userId);
          return { label: `${user?.name ?? v.role} · ${v.status === 'executing' ? 'executing' : 'viewing'} for ${v.sinceMinutes + s.clock} min`, value: v.userId };
        })}
      />

      <Box sx={{ flex: 1, minWidth: 0 }} />

      {/* media pill */}
      <BarGroup sx={{ gap: '2px', pl: '9px', pr: '6px' }}>
        <Box aria-hidden sx={{ display: 'flex', color: barRef.grip, mr: '4px' }}>
          <DragDropVerticalIcon size={16} />
        </Box>
        {EVIDENCE_KINDS.map(({ kind, label }) => (
          <Tooltip key={kind} title={noEvidence ? 'Select an unrecorded step that needs evidence' : `${label} (sample capture) for the selected step`}>
            <span style={{ display: 'flex' }}>
              <PillButton kind={kind} disabled={spectator || noEvidence} onClick={() => captureEvidence(kind)} />
            </span>
          </Tooltip>
        ))}
        <Box aria-hidden sx={{ width: '1px', height: 16, background: barRef.line, mx: '6px' }} />
        <Box
          component="button"
          type="button"
          aria-label={`Evidence, ${status.evidenceCount} items`}
          onClick={() => ui.open('evidence', step ? { stepId: step.id } : undefined)}
          sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: 28, px: '8px', m: 0, border: 0, borderRadius: '6px', background: 'transparent', cursor: 'pointer', color: barRef.grip, '&:hover': { background: barRef.soft }, '&:focus-visible': { outline: `2px solid ${barRef.focus}`, outlineOffset: 1 } }}
        >
          <Chat01Icon size={16} />
          <Box component="span" sx={{ minWidth: 16, height: 16, boxSizing: 'border-box', px: '4px', borderRadius: '8px', display: 'grid', placeItems: 'center', background: barRef.navy, color: '#fff', fontSize: 10, lineHeight: '16px', fontWeight: fw.semiBold }}>
            {status.evidenceCount}
          </Box>
        </Box>
      </BarGroup>

      {/* inline layout only */}
      {inline && (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <ChromeButton ariaHasPopup="menu" ariaExpanded={!!copyEl} disabled={!step} onClick={(e) => setCopyEl(e.currentTarget)} startIcon={<Copy01Icon size={14} />} endIcon={<ArrowDown01Icon size={14} />}>
            Copy
          </ChromeButton>
          <DropdownMenu
            anchorEl={copyEl}
            open={!!copyEl}
            onClose={() => setCopyEl(null)}
            align="right"
            ariaLabel="Copy"
            options={[
              { label: 'Copy Expected Result', value: 'expected' },
              { label: 'Copy Execution Result', value: 'actual' },
            ]}
            onSelect={(o) => {
              if (!step) return;
              if (o.value === 'expected') copyText(step.expected, 'Expected result');
              else copyText(getPlainTextFromRTE(step.actual).trim(), 'Execution result');
            }}
          />
          <ChromeButton
            tone={recordedLocked ? 'outline' : 'navy'}
            disabled={!step || spectator}
            title={recordedLocked ? 'Edit the selected step' : 'Record the selected step'}
            startIcon={<PencilEdit01Icon size={14} />}
            onClick={() => {
              if (!step) return;
              if (recordedLocked) ui.open('editReason', { stepId: step.id });
              else onRecord?.(step.id);
            }}
          >
            {recordedLocked ? 'Edit' : 'Record'}
          </ChromeButton>
        </Box>
      )}
    </Box>
  );
}
