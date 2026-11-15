/**
 * NOT FROM FIGMA. Full-screen evidence viewer (reference div#evFull, S\ref\overlays\spec.md "evfull"): a dark scrim holding a
 * 1008px image stage with round previous / next buttons and a 432px side panel (gradient header with the file name, the
 * Evidence Details table, the Step / Activity note, a Download / Close footer). Left and right arrow keys move, Esc closes.
 */
import { useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Box } from '../../../components/mui';
import { FullScreenSurface } from '../../../components/feedback/FullScreenSurface/FullScreenSurface';
import { ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon, ViewIcon } from '../../../icons';
import { panelRole } from '../../../theme/typography';
import { EvBtn, EvChip, thinScroll } from '../evidence/EvControls';
import { goToStep } from '../evidence/actions';
import { EV_KIND, getEvidenceImage, stepsLabel } from '../evidence/evidenceMeta';
import { ev } from '../evidence/evRef';
import type { EvidenceItem } from '../model';
import { fonts, ref } from '../refTheme';
import { useExecution } from '../store';
import { ui } from '../ui';
import EvidenceThumb from './EvidenceThumb';
import { fmtWhen, plainText, userName } from './common';

const sec = { m: '4px 0 8px', fontSize: 10.5, lineHeight: '15.225px', fontWeight: panelRole.heavy, color: ref.blue3 } as const;

/** Save the item: a captured picture as it is, otherwise the generated sample picture as an SVG file (sample data). */
function download(item: EvidenceItem) {
  const picture = getEvidenceImage(item.id);
  let href = picture;
  let name = item.name;
  if (!href) {
    const svg = renderToStaticMarkup(<EvidenceThumb item={item} />).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    name = `${item.name.replace(/\.[^.]+$/, '')}-sample.svg`;
  }
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  a.click();
  if (!picture) setTimeout(() => URL.revokeObjectURL(href as string), 1000);
  ui.toast('success', picture ? `${name} downloaded` : `${name} downloaded (generated sample picture)`);
}

export default function EvidenceViewer({ evidenceId, ids }: { evidenceId: string; ids?: string[] }) {
  const s = useExecution();
  const order = (ids && ids.length ? ids : s.evidence.map((e) => e.id)).filter((id) => s.evidence.some((e) => e.id === id));
  const index = order.indexOf(evidenceId);
  const item = s.evidence.find((e) => e.id === evidenceId);
  const prevId = index > 0 ? order[index - 1] : undefined;
  const nextId = index >= 0 && index < order.length - 1 ? order[index + 1] : undefined;
  const close = () => ui.close('evidenceViewer');

  const go = (id: string | undefined) => {
    if (id) ui.open('evidenceViewer', { evidenceId: id, ids: order });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(prevId);
      if (e.key === 'ArrowRight') go(nextId);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!item) return null;
  const steps = item.stepIds.flatMap((id) => (s.protocol.steps[id] ? [s.protocol.steps[id]] : []));
  const first = steps[0];
  const rows: [string, React.ReactNode][] = [
    ['Evidence Name', item.name],
    ['Type', EV_KIND[item.kind]],
    ['Table', first ? `Table ${first.table}` : 'None'],
    ['Row / Step', first ? `Step ${first.row}` : 'None'],
    ['Uploaded By', userName(s, item.addedBy)],
    ['Date', fmtWhen(item.when)],
    ['Size', `${item.sizeKb} KB`],
    [
      'Status',
      steps.length === 0 ? (
        'Not linked'
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
          Linked to
          {steps.map((st) => (
            <EvChip key={st.id} onClick={() => goToStep(st.id)} aria-label={`Go to Table ${st.table} Row ${st.row}`} sx={{ p: '1px 8px', fontSize: 10.5 }}>
              {`T${st.table} / R${st.row}`}
            </EvChip>
          ))}
        </Box>
      ),
    ],
  ];

  const nav = (side: 'prev' | 'next', id: string | undefined) => (
    <Box
      component="button"
      type="button"
      aria-label={side === 'prev' ? 'Previous evidence' : 'Next evidence'}
      disabled={!id}
      onClick={() => go(id)}
      sx={{
        position: 'absolute', top: '50%', [side === 'prev' ? 'left' : 'right']: 14, transform: 'translateY(-50%)', display: 'grid', placeItems: 'center', width: 42, height: 42, p: 0, m: 0, border: 0, borderRadius: '50%', cursor: 'pointer', color: ref.white, background: ev.navBtn,
        '&:hover:not(:disabled)': { background: ev.navBtnHover }, '&:disabled': { opacity: 0.35, cursor: 'not-allowed' }, '&:focus-visible': { outline: `2px solid ${ref.white}`, outlineOffset: 2 },
      }}
    >
      {side === 'prev' ? <ArrowLeft01Icon size={22} /> : <ArrowRight01Icon size={22} />}
    </Box>
  );

  return (
    <FullScreenSurface open onClose={close} label={`Evidence ${item.name}`} background={ev.viewerScrim} direction="row">
      <Box sx={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: ev.viewerStage }}>
        {nav('prev', prevId)}
        <Box data-spec="viewer-stage" sx={{ width: '100%', height: '100%' }}>
          <EvidenceThumb item={item} label={`${EV_KIND[item.kind]} ${item.name}`} />
        </Box>
        {nav('next', nextId)}
      </Box>
      <Box component="aside" data-spec="viewer-details" sx={{ width: 432, maxWidth: '45vw', flexShrink: 0, display: 'flex', flexDirection: 'column', boxSizing: 'border-box', background: ref.white, borderLeft: `1px solid ${ref.line}`, fontFamily: fonts.shell, color: ref.ink }}>
        <Box data-spec="viewer-head" sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', p: '16px 20px', boxSizing: 'border-box', flexShrink: 0, background: `linear-gradient(135deg, ${ref.navy}, ${ref.blue3})`, color: ref.white }}>
          <Box sx={{ display: 'grid', placeItems: 'center', width: 34, height: 34, flexShrink: 0, borderRadius: '8px', background: ev.navBtn }}>
            <ViewIcon size={18} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box component="h2" sx={{ m: 0, fontSize: 14, lineHeight: '18.2px', fontWeight: panelRole.strong, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</Box>
            <Box sx={{ mt: '3px', fontSize: 11, lineHeight: '15.95px', fontWeight: panelRole.regular, color: ref.tint }}>
              {EV_KIND[item.kind]} · {stepsLabel(s, item)}
              {index >= 0 ? ` (${index + 1} of ${order.length})` : ''}
            </Box>
          </Box>
          <Box component="button" type="button" aria-label="Close" onClick={close} sx={{ p: '2px 4px', m: 0, border: 0, background: 'transparent', color: ref.tint, cursor: 'pointer', display: 'grid', placeItems: 'center', '&:hover': { color: ref.white }, '&:focus-visible': { outline: `2px solid ${ref.white}`, outlineOffset: 1 } }}>
            <Cancel01Icon size={20} />
          </Box>
        </Box>
        <Box data-spec="viewer-body" sx={{ flex: '1 1 0', minHeight: 0, overflow: 'auto', p: '16px 20px', boxSizing: 'border-box', ...thinScroll }}>
          <Box sx={sec}>Evidence Details</Box>
          <Box component="table" sx={{ width: '100%', m: '0 0 18px', borderCollapse: 'collapse' }}>
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k}>
                  <Box component="td" sx={{ width: '42%', p: '8px 4px', verticalAlign: 'top', fontSize: 12, lineHeight: '17.4px', fontWeight: panelRole.emphasis, color: ref.muted, borderBottom: `1px solid ${ref.tint2}` }}>{k}</Box>
                  <Box component="td" sx={{ p: '8px 4px', verticalAlign: 'top', fontSize: 12, lineHeight: '17.4px', fontWeight: panelRole.emphasis, color: ref.ink, borderBottom: `1px solid ${ref.tint2}`, overflowWrap: 'anywhere' }}>{v}</Box>
                </tr>
              ))}
            </tbody>
          </Box>
          <Box sx={sec}>Step / Activity</Box>
          {first ? (
            <Box sx={{ p: '10px 12px', boxSizing: 'border-box', border: `1px solid ${ref.line}`, borderRadius: '8px', background: ref.tint2, fontSize: 11.5, lineHeight: '18.4px', color: ev.note }}>
              <b style={{ fontWeight: panelRole.strong }}>Step {first.row}:</b> {first.instructions}
              <br />
              <br />
              <b style={{ fontWeight: panelRole.strong }}>Recorded:</b> {plainText(first.actual) || 'Not recorded yet.'}
            </Box>
          ) : (
            <Box sx={{ fontSize: 11.5, lineHeight: '18.4px', color: ref.muted }}>This item is not linked to a step.</Box>
          )}
        </Box>
        <Box data-spec="viewer-foot" sx={{ display: 'flex', gap: '8px', p: '12px 20px', boxSizing: 'border-box', flexShrink: 0, borderTop: `1px solid ${ref.line}` }}>
          <EvBtn sx={{ flex: 1 }} onClick={() => download(item)}>Download</EvBtn>
          <EvBtn primary sx={{ flex: 1 }} onClick={close}>Close</EvBtn>
        </Box>
      </Box>
    </FullScreenSurface>
  );
}
