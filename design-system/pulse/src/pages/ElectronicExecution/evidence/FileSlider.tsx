/**
 * NOT FROM FIGMA. File viewer slider (reference aside#fileSlider, S\ref\overlays\spec.md "file-slider"): 560px, slides in from the
 * right over 0.26s with a dimmed scrim, header with the file name, a card with the name, round previous / next buttons with
 * "1 / n", the picture (a generated sample) and the "Uploaded by / Date" line. The expand button opens the full-size viewer.
 */
import { useEffect, useState } from 'react';
import { Box } from '../../../components/mui';
import { SlidePanel } from '../../../components/feedback/SlidePanel/SlidePanel';
import { ArrowExpandIcon, ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon } from '../../../icons';
import { panelRole } from '../../../theme/typography';
import { fmtWhen, userName } from '../dialogs/common';
import EvidenceThumb from '../dialogs/EvidenceThumb';
import { ref } from '../refTheme';
import { useExecution } from '../store';
import { ui } from '../ui';
import { EvChip, EvSq } from './EvControls';
import { goToStep } from './actions';
import { EV_KIND } from './evidenceMeta';
import { ev } from './evRef';

export function FileSlider({ payload }: { payload: { evidenceId?: string; ids?: string[] } | null }) {
  const s = useExecution();
  const [last, setLast] = useState(payload);
  useEffect(() => {
    if (payload) setLast(payload);
  }, [payload]);
  const p = payload ?? last;
  const order = ((p?.ids && p.ids.length ? p.ids : s.evidence.map((e) => e.id)) as string[]).filter((id) => s.evidence.some((e) => e.id === id));
  const idx = Math.max(0, order.indexOf(p?.evidenceId ?? ''));
  const item = s.evidence.find((e) => e.id === order[idx]);
  const go = (to: number) => {
    const id = order[to];
    if (id) ui.open('fileSlider', { evidenceId: id, ids: order });
  };
  const close = () => ui.close('fileSlider');

  const arrow = (dir: -1 | 1) => (
    <Box
      component="button"
      type="button"
      aria-label={dir < 0 ? 'Previous file' : 'Next file'}
      disabled={idx + dir < 0 || idx + dir >= order.length}
      onClick={() => go(idx + dir)}
      sx={{
        display: 'grid', placeItems: 'center', width: 30, height: 30, p: 0, m: 0, boxSizing: 'border-box', cursor: 'pointer', border: `1px solid ${ref.line}`, borderRadius: '50%', background: ref.white, color: ref.blue3, transition: 'background .12s ease, color .12s ease',
        '&:hover:not(:disabled)': { background: ref.blue3, color: ref.white, borderColor: ref.blue3 }, '&:disabled': { opacity: 0.4, cursor: 'not-allowed' }, '&:focus-visible': { outline: `2px solid ${ref.blue4}`, outlineOffset: 1 },
      }}
    >
      {dir < 0 ? <ArrowLeft01Icon size={14} /> : <ArrowRight01Icon size={14} />}
    </Box>
  );

  return (
    <SlidePanel
      open={!!payload}
      onClose={close}
      title={item?.name ?? 'File'}
      headerActions={
        <>
          {item && (
            <EvSq size={25} radius={6} bare aria-label="Open full size" title="Open full size" onClick={() => ui.open('evidenceViewer', { evidenceId: item.id, ids: order })}>
              <ArrowExpandIcon size={13} />
            </EvSq>
          )}
          <EvSq size={26} radius={6} bare aria-label="Close" title="Close" onClick={close}>
            <Cancel01Icon size={13} />
          </EvSq>
        </>
      }
    >
      {item && (
        <Box data-spec="ev-file" sx={{ p: '18px', boxSizing: 'border-box', border: `1px solid ${ref.line}`, borderRadius: '10px', background: ref.white }}>
          <Box data-spec="ev-file-h" sx={{ m: '0 0 12px', fontSize: 14, lineHeight: '20.3px', fontWeight: panelRole.strong, color: ref.ink }}>{item.name}</Box>
          <Box data-spec="ev-file-nav" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', m: '0 0 10px' }}>
            {arrow(-1)}
            <Box component="span" role="status" sx={{ fontSize: 12, lineHeight: '17.4px', fontWeight: panelRole.strong, color: ref.muted }}>{`${idx + 1} / ${order.length}`}</Box>
            {arrow(1)}
          </Box>
          <Box data-spec="ev-preview" sx={{ height: 220, borderRadius: '9px', overflow: 'hidden', background: ev.mediaStage }}>
            <EvidenceThumb item={item} label={`${EV_KIND[item.kind]} preview of ${item.name}`} />
          </Box>
          <Box data-spec="ev-file-meta" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 18px', m: '14px 0 0', fontSize: 11.5, lineHeight: '16.675px', color: ref.muted }}>
            <span>
              <Box component="b" sx={{ fontWeight: panelRole.strong, color: ref.ink }}>Uploaded by</Box> {userName(s, item.addedBy)}
            </span>
            <span>
              <Box component="b" sx={{ fontWeight: panelRole.strong, color: ref.ink }}>Date</Box> {fmtWhen(item.when)}
            </span>
            {item.stepIds.length > 0 && (
              <Box component="span" sx={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
                <Box component="b" sx={{ fontWeight: panelRole.strong, color: ref.ink, mr: '2px' }}>Linked to</Box>
                {item.stepIds.map((id) => (
                  <EvChip key={id} onClick={() => goToStep(id)} aria-label={`Go to Table ${s.protocol.steps[id]?.table} Row ${s.protocol.steps[id]?.row}`} sx={{ p: '1px 8px', fontSize: 10.5 }}>
                    {`T${s.protocol.steps[id]?.table} / R${s.protocol.steps[id]?.row}`}
                  </EvChip>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </SlidePanel>
  );
}
