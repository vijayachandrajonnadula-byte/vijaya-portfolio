/**
 * NOT FROM FIGMA. Full-viewport evidence gallery (reference div#galOverlay, S\ref\overlays\spec.md "gallery"): header with the
 * count and a List / Gallery view toggle, a filter row (kind chips, funnel, search), a 4-column grid of cards and a 360px
 * detail column for the selected item, and a footer with the item count. Double-click or "View in Full Size" opens the
 * full-size viewer. Esc closes it (it is the top surface); the pane behind it stays open.
 */
import { useMemo, useState } from 'react';
import { Box } from '../../../components/mui';
import { FullScreenSurface } from '../../../components/feedback/FullScreenSurface/FullScreenSurface';
import { EmptyState } from '../../../components/data-display/EmptyState/EmptyState';
import { ArrowExpandIcon, Cancel01Icon, DashboardSquare02Icon, Delete02Icon, ListViewIcon } from '../../../icons';
import { panelRole } from '../../../theme/typography';
import { fmtWhen, userName } from '../dialogs/common';
import EvidenceThumb from '../dialogs/EvidenceThumb';
import type { EvidenceItem } from '../model';
import { fonts, ref } from '../refTheme';
import { useExecution } from '../store';
import { ui } from '../ui';
import { EvBtn, EvChip, thinScroll } from './EvControls';
import { EvFilterButton, EvKindChips } from './EvFilter';
import { goToStep, removableFromSelected, removeFromStep } from './actions';
import { EV_FILTER_DEFAULT, EV_KIND, applyFilter } from './evidenceMeta';
import type { EvFilter } from './evidenceMeta';
import { ev } from './evRef';

const stepOf = (s: ReturnType<typeof useExecution>, e: EvidenceItem) => {
  const st = s.protocol.steps[e.stepIds[0] ?? ''];
  return st ? { table: `Table ${st.table}`, row: `Row ${st.row}` } : { table: 'None', row: 'None' };
};

export default function EvidenceGallery({ evidenceId }: { evidenceId?: string }) {
  const s = useExecution();
  const [view, setView] = useState<'list' | 'gallery'>('gallery');
  const [filter, setFilter] = useState<EvFilter>(EV_FILTER_DEFAULT);
  const [picked, setPicked] = useState(evidenceId ?? '');
  const shown = useMemo(() => applyFilter(s, s.evidence, filter), [s, filter]);
  const ids = shown.map((e) => e.id);
  const sel = shown.find((e) => e.id === picked) ?? shown[0];
  const close = () => ui.close('evidenceGallery');
  const full = (e: EvidenceItem) => ui.open('evidenceViewer', { evidenceId: e.id, ids });
  const removable = sel ? removableFromSelected(sel) : null;

  const rows: [string, React.ReactNode][] = sel
    ? [
        ['Evidence Name', sel.name],
        ['Type', EV_KIND[sel.kind]],
        ['Table', stepOf(s, sel).table],
        ['Row', stepOf(s, sel).row],
        ['Uploaded By', userName(s, sel.addedBy)],
        ['Date', fmtWhen(sel.when)],
        ['Size', `${sel.sizeKb} KB`],
        [
          'Linked steps',
          <Box key="chips" sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {sel.stepIds.length === 0 && 'Not linked'}
            {sel.stepIds.map((id) => (
              <EvChip key={id} onClick={() => goToStep(id)} aria-label={`Go to Table ${s.protocol.steps[id]?.table} Row ${s.protocol.steps[id]?.row}`} sx={{ p: '1px 8px', fontSize: 10.5 }}>
                {`T${s.protocol.steps[id]?.table} / R${s.protocol.steps[id]?.row}`}
              </EvChip>
            ))}
          </Box>,
        ],
      ]
    : [];

  return (
    <FullScreenSurface open onClose={close} label="Evidence gallery">
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, fontFamily: fonts.shell, color: ref.ink }}>
        {/* head */}
        <Box component="header" data-spec="gal-head" sx={{ display: 'flex', alignItems: 'center', gap: '14px', p: '12px 18px', boxSizing: 'border-box', flexShrink: 0, background: `linear-gradient(${ref.tint2}, ${ref.white})`, borderBottom: `1px solid ${ref.line}` }}>
          <Box data-spec="gal-title" sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box component="h2" sx={{ m: 0, fontSize: 15, lineHeight: '21.75px', fontWeight: panelRole.heavy, color: ref.ink }}>Evidence &amp; Activity</Box>
            <Box component="span" data-spec="gal-count" sx={{ p: '1px 9px', borderRadius: '10px', background: ref.tint2, color: ref.blue3, fontSize: 11, lineHeight: '15.95px', fontWeight: panelRole.strong }}>{s.evidence.length}</Box>
          </Box>
          <Box role="group" aria-label="View" data-spec="gal-toggle" sx={{ display: 'flex', gap: '2px', p: '2px', boxSizing: 'border-box', border: `1px solid ${ref.line}`, borderRadius: '7px', background: ref.bg }}>
            {(
              [
                ['list', 'List View', <ListViewIcon key="l" size={11} />],
                ['gallery', 'Gallery View', <DashboardSquare02Icon key="g" size={11} />],
              ] as const
            ).map(([v, label, icon]) => (
              <Box
                key={v}
                component="button"
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                sx={{ display: 'flex', alignItems: 'center', gap: '4px', p: '3px 10px', m: 0, border: 0, borderRadius: '5px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 10.5, lineHeight: 'normal', fontWeight: panelRole.strong, background: view === v ? ref.blue3 : 'transparent', color: view === v ? ref.white : ref.muted, '&:focus-visible': { outline: `2px solid ${ref.blue4}`, outlineOffset: 1 } }}
              >
                {icon}
                {label}
              </Box>
            ))}
          </Box>
          <Box aria-hidden sx={{ flex: 1 }} />
          <Box
            component="button"
            type="button"
            aria-label="Close gallery"
            onClick={close}
            sx={{ p: '3px 9px', m: 0, border: 0, borderRadius: '6px', background: 'transparent', color: ref.muted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 18, lineHeight: '26.1px', '&:hover': { background: ref.bg, color: ref.ink }, '&:focus-visible': { outline: `2px solid ${ref.blue4}`, outlineOffset: 1 } }}
          >
            <Cancel01Icon size={18} />
          </Box>
        </Box>

        {/* sub */}
        <Box data-spec="gal-sub" sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '10px 18px', boxSizing: 'border-box', flexShrink: 0, background: ref.tint2, borderBottom: `1px solid ${ref.tint2}` }}>
          <Box role="status" data-spec="gal-count-lbl" sx={{ fontSize: 11.5, lineHeight: '16.675px', fontWeight: panelRole.emphasis, color: ref.muted }}>
            Showing {shown.length} evidence item{shown.length === 1 ? '' : 's'}
          </Box>
          <Box aria-hidden sx={{ flex: 1 }} />
          <Box data-spec="gal-filt" sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <EvKindChips value={filter.kind} onChange={(kind) => setFilter({ ...filter, kind })} />
            <EvFilterButton s={s} filter={filter} onChange={setFilter} />
            <Box sx={{ position: 'relative', width: 180, height: 28 }}>
              <Box
                component="input"
                type="search"
                aria-label="Search evidence"
                placeholder="Search evidence..."
                value={filter.query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, query: e.target.value })}
                sx={{ width: 180, height: 28, p: '0 12px', boxSizing: 'border-box', border: `1px solid ${ref.line}`, borderRadius: '14px', background: ref.white, color: ref.ink, fontFamily: 'inherit', fontSize: 11.5, '&:focus': { outline: 'none', borderColor: ref.blue4 }, '&::placeholder': { color: ref.muted2 } }}
              />
            </Box>
          </Box>
        </Box>

        {/* body */}
        <Box sx={{ flex: '1 1 0', minHeight: 0, display: 'flex', overflow: 'hidden' }}>
          <Box data-spec="gal-grid" sx={{ flex: 1, minWidth: 0, overflow: 'auto', boxSizing: 'border-box', p: '16px', ...thinScroll }}>
            {shown.length === 0 && <EmptyState type={s.evidence.length === 0 ? 'noRecords' : 'noFilter'} size="small" title="No evidence" description={s.evidence.length === 0 ? 'Nothing is attached yet.' : 'No evidence matches the filters.'} />}
            {view === 'gallery' && shown.length > 0 && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px', alignContent: 'start' }}>
                {shown.map((e, i) => {
                  const on = sel?.id === e.id;
                  return (
                    <Box
                      key={e.id}
                      component="button"
                      type="button"
                      aria-label={`${e.name}, ${EV_KIND[e.kind]}${on ? ', selected' : ''}`}
                      aria-pressed={on}
                      onClick={() => setPicked(e.id)}
                      onDoubleClick={() => full(e)}
                      sx={{
                        position: 'relative', display: 'block', p: 0, m: 0, height: 60, boxSizing: 'border-box', overflow: 'hidden', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', background: ref.white,
                        border: `1px solid ${on ? ref.blue3 : ref.line}`, borderRadius: '10px', boxShadow: on ? `0 0 0 2px ${ref.tint}` : 'none', transition: 'all .15s ease',
                        '&:hover': { borderColor: on ? ref.blue3 : ref.blue5, boxShadow: on ? `0 0 0 2px ${ref.tint}` : ev.cardHover },
                        '&:hover .gzoom, &:focus-visible .gzoom': { opacity: 1 },
                        '&:focus-visible': { outline: `2px solid ${ref.blue4}`, outlineOffset: 1 },
                      }}
                    >
                      <Box component="span" data-spec="gal-num" sx={{ position: 'absolute', top: 6, left: 6, zIndex: 1, display: 'grid', placeItems: 'center', width: 20, height: 20, borderRadius: '5px', background: ref.blue3, color: ref.white, fontSize: 10, lineHeight: '14.5px', fontWeight: panelRole.heavy }}>{i + 1}</Box>
                      <Box sx={{ height: 150, background: ev.thumbBg }}>
                        <EvidenceThumb item={e} fit="slice" />
                      </Box>
                      <Box component="span" className="gzoom" sx={{ position: 'absolute', right: 6, bottom: 6, p: '2px 7px', borderRadius: '10px', background: ev.zoomPill, color: ref.white, fontSize: 9, lineHeight: '13.05px', fontWeight: panelRole.strong, opacity: 0, transition: 'all .15s ease', pointerEvents: 'none' }}>
                        Double-click to open
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
            {view === 'list' && shown.length > 0 && (
              <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, lineHeight: '16.675px' }}>
                <thead>
                  <tr>
                    {['#', 'Evidence Name', 'Type', 'Table', 'Row', 'Uploaded By', 'Date'].map((h) => (
                      <Box component="th" key={h} sx={{ p: '7px 10px', textAlign: 'left', fontWeight: panelRole.emphasis, color: ref.muted, borderBottom: `1px solid ${ref.line}` }}>{h}</Box>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shown.map((e, i) => {
                    const on = sel?.id === e.id;
                    return (
                      <Box
                        component="tr"
                        key={e.id}
                        tabIndex={0}
                        aria-selected={on}
                        onClick={() => setPicked(e.id)}
                        onDoubleClick={() => full(e)}
                        onKeyDown={(k: React.KeyboardEvent) => {
                          if (k.key === 'Enter') full(e);
                          if (k.key === ' ') {
                            k.preventDefault();
                            setPicked(e.id);
                          }
                        }}
                        sx={{ cursor: 'pointer', background: on ? ref.tint : 'transparent', '&:hover': { background: on ? ref.tint : ref.tint2 }, '&:focus-visible': { outline: `2px solid ${ref.blue4}`, outlineOffset: -2 } }}
                      >
                        {[i + 1, e.name, EV_KIND[e.kind], stepOf(s, e).table, stepOf(s, e).row, userName(s, e.addedBy), fmtWhen(e.when)].map((c, k) => (
                          <Box component="td" key={k} sx={{ p: '8px 10px', fontWeight: panelRole.emphasis, color: ref.ink, borderBottom: `1px solid ${ref.tint2}` }}>{c}</Box>
                        ))}
                      </Box>
                    );
                  })}
                </tbody>
              </Box>
            )}
          </Box>

          <Box component="aside" aria-label="Evidence details" data-spec="gal-detail" sx={{ width: 360, flexShrink: 0, boxSizing: 'border-box', overflow: 'auto', background: ref.white, borderLeft: `1px solid ${ref.line}`, ...thinScroll }}>
            {sel ? (
              <>
                <Box data-spec="gd-preview" sx={{ p: '14px', background: ev.galPreview, height: 234.9, boxSizing: 'border-box' }}>
                  <EvidenceThumb item={sel} />
                </Box>
                <Box data-spec="gd-body" sx={{ p: '14px 16px' }}>
                  <Box component="h3" sx={{ m: '0 0 10px', fontSize: 13, lineHeight: '18.85px', fontWeight: panelRole.heavy, color: ref.ink }}>Step Details</Box>
                  <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {rows.map(([k, v]) => (
                        <tr key={k}>
                          <Box component="td" sx={{ width: '42%', p: '7px 4px', verticalAlign: 'top', fontSize: 11.5, lineHeight: '16.675px', fontWeight: panelRole.emphasis, color: ref.muted, borderBottom: `1px solid ${ref.tint2}` }}>{k}</Box>
                          <Box component="td" sx={{ p: '7px 4px', verticalAlign: 'top', fontSize: 11.5, lineHeight: '16.675px', fontWeight: panelRole.emphasis, color: ref.ink, borderBottom: `1px solid ${ref.tint2}`, overflowWrap: 'anywhere' }}>{v}</Box>
                        </tr>
                      ))}
                    </tbody>
                  </Box>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => full(sel)}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', p: '8px 0', m: '14px 0 0', boxSizing: 'border-box', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, lineHeight: 'normal', fontWeight: panelRole.strong, color: ref.blue3, background: ref.white, border: `1px solid ${ref.blue3}`, borderRadius: '7px', '&:hover': { background: ref.tint }, '&:focus-visible': { outline: `2px solid ${ref.blue4}`, outlineOffset: 1 } }}
                  >
                    <ArrowExpandIcon size={12} />
                    View in Full Size
                  </Box>
                  {removable && (
                    <EvBtn sx={{ mt: '8px', width: '100%', color: ev.danger, '&:hover:not(:disabled)': { background: ev.dangerBg } }} onClick={() => removeFromStep(sel, removable.stepId, removable.label)}>
                      <Delete02Icon size={12} />
                      Remove from {removable.label}
                    </EvBtn>
                  )}
                </Box>
              </>
            ) : (
              <Box sx={{ p: '14px 16px', fontSize: 11.5, color: ref.muted }}>Select an item to see its details.</Box>
            )}
          </Box>
        </Box>

        {/* foot */}
        <Box data-spec="gal-foot" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: '9px', boxSizing: 'border-box', flexShrink: 0, borderTop: `1px solid ${ref.line}`, fontSize: 11.5, lineHeight: '16.675px', fontWeight: panelRole.emphasis, color: ref.muted }}>
          {shown.length === 0 ? '0 items' : `1-${shown.length} of ${s.evidence.length} items`}
        </Box>
      </Box>
    </FullScreenSurface>
  );
}
