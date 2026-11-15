/**
 * NOT FROM FIGMA. The in-flow "Evidence & Activity" pane of the real Pulse application, measured on its screenshot (1440 x 1024):
 * a white 712px column right of the document, below the document toolbar. Header (title, open in a gallery, layout menu, close), a
 * tab row (All, AI Captured, Screenshots, Photos, Videos, Attachments, filter, list/grid toggle, expand), "Showing N evidence items"
 * and the list (48 x 36 thumbnail, title, meta line). The store's items come first, then generic display-only sample rows.
 * Clicking a store item opens it in the file slider; the expand button opens the full-viewport gallery.
 * The same pane shows a sample SOP page when opened with { sop: title } (reference "sop-split"). The pane grows and
 * shrinks with a flex-basis / max-width 0.26s transition.
 */
import { useEffect, useMemo, useState } from 'react';
import { Box } from '../../../components/mui';
import { DropdownMenu } from '../../../components/form/DropdownMenu/DropdownMenu';
import { EmptyState } from '../../../components/data-display/EmptyState/EmptyState';
import { ChromeButton, ChromeIconButton, PillTabs, SegmentedToggle } from '../../../components/navigation/ExecutionChrome/ExecutionChrome';
import { ArrowDown01Icon, ArrowExpandIcon, Cancel01Icon, DashboardSquare02Icon, LayoutLeftIcon, ListViewIcon, SquareArrowUpRightIcon } from '../../../icons';
import { fw } from '../../../theme/typography';
import EvidenceThumb from '../dialogs/EvidenceThumb';
import type { EvidenceItem } from '../model';
import { barRef } from '../refTheme';
import { useExecution } from '../store';
import { ui, useUi } from '../ui';
import { thinScroll } from './EvControls';
import { EvFilterButton } from './EvFilter';
import SopPage from './SopPage';
import { SAMPLE_ROWS, SampleTile, sampleMatches, sampleMeta } from './sampleRows';
import type { SampleRow } from './sampleRows';
import { EV_FILTERS, EV_FILTER_DEFAULT, EV_KIND, applyFilter, itemSub } from './evidenceMeta';
import type { EvFilter } from './evidenceMeta';
import { ev } from './evRef';

const PANE_PX = 712;
const GROUP_LABEL = (s: ReturnType<typeof useExecution>, e: EvidenceItem, g: EvFilter['group']): string => {
  if (g === 'type') return EV_KIND[e.kind];
  const t = e.stepIds.map((id) => s.protocol.steps[id]?.table).find((x) => x !== undefined);
  return t ? `Table ${t}` : 'Not linked';
};

const tile = { width: 48, height: 36, flexShrink: 0, boxSizing: 'border-box', border: `1px solid ${barRef.line}`, borderRadius: '4px', overflow: 'hidden', background: barRef.surface } as const;
const rowSx = {
  display: 'flex', alignItems: 'center', gap: '8px', width: '100%', minHeight: 50, boxSizing: 'border-box', px: '8px', m: 0, textAlign: 'left', fontFamily: ev.font, color: barRef.ink, background: 'transparent',
  border: 0, borderRadius: '8px', flexShrink: 0,
} as const;
const rowHover = { '&:hover': { background: barRef.surface }, '&:focus-visible': { outline: `2px solid ${barRef.focus}`, outlineOffset: -2 } } as const;

function PaneBody({ stepId }: { stepId?: string }) {
  const s = useExecution();
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [filter, setFilter] = useState<EvFilter>({ ...EV_FILTER_DEFAULT, step: stepId ?? '' });
  const shown = useMemo(() => applyFilter(s, s.evidence, filter), [s, filter]);
  const ids = shown.map((e) => e.id);
  const open = (e: EvidenceItem) => ui.open('fileSlider', { evidenceId: e.id, ids });
  // sample rows only join the unfiltered view of the whole execution (not a table / step / group filter)
  const sampleOn = !filter.step && !filter.table && filter.group === 'none';
  const samples = useMemo(() => (sampleOn ? SAMPLE_ROWS.filter((r) => sampleMatches(r, filter.kind) && (!filter.query.trim() || `${r.name} ${sampleMeta(r)}`.toLowerCase().includes(filter.query.trim().toLowerCase()))) : []), [sampleOn, filter.kind, filter.query]);
  const total = shown.length + samples.length;

  const groups = useMemo(() => {
    if (filter.group === 'none') return [{ label: '', items: shown }];
    const m = new Map<string, EvidenceItem[]>();
    for (const e of shown) {
      const k = GROUP_LABEL(s, e, filter.group);
      m.set(k, [...(m.get(k) ?? []), e]);
    }
    return [...m].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([label, items]) => ({ label, items }));
  }, [s, shown, filter.group]);

  const sampleRow = (r: SampleRow) =>
    view === 'list' ? (
      <Box key={r.id} data-spec="ev-sample" title="Sample row (display only)" sx={rowSx}>
        <Box sx={tile}>
          <SampleTile tile={r.tile} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box className="nm" sx={{ fontSize: 12, lineHeight: '20px', fontWeight: fw.medium, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</Box>
          <Box className="sb" sx={{ fontSize: 10, lineHeight: '16px', fontWeight: fw.regular, color: barRef.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sampleMeta(r)}</Box>
        </Box>
      </Box>
    ) : (
      <Box key={r.id} data-spec="ev-sample" title="Sample row (display only)" sx={{ minWidth: 0, border: `1px solid ${barRef.line}`, borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
        <Box sx={{ height: 96, background: barRef.surface }}>
          <SampleTile tile={r.tile} />
        </Box>
        <Box sx={{ p: '8px 10px' }}>
          <Box sx={{ fontSize: 12, lineHeight: '20px', fontWeight: fw.medium, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</Box>
          <Box sx={{ fontSize: 10, lineHeight: '16px', color: barRef.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sampleMeta(r)}</Box>
        </Box>
      </Box>
    );

  return (
    <Box data-spec="ev-root" sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', minHeight: 0 }}>
      <Box data-spec="ev-bar" sx={{ display: 'flex', alignItems: 'center', gap: '4px', p: '16px 8px 15px 15px', position: 'relative', '&::after': { content: '""', position: 'absolute', left: 15, right: 8, bottom: 0, height: 2, background: '#f0f3f7' }, boxSizing: 'border-box', flexShrink: 0, minWidth: 0, flexWrap: 'wrap', rowGap: '8px' }}>
        <PillTabs ariaLabel="Evidence kind" value={filter.kind} onChange={(kind) => setFilter({ ...filter, kind })} tabs={EV_FILTERS.map((f) => ({ value: f.key, label: f.label }))} />
        <EvFilterButton s={s} filter={filter} onChange={setFilter} bare size={32} />
        <Box aria-hidden sx={{ flex: 1 }} />
        <SegmentedToggle
          ariaLabel="View"
          kind="icon"
          value={view}
          onChange={setView}
          options={[
            { value: 'list', icon: <ListViewIcon size={16} />, ariaLabel: 'List view' },
            { value: 'grid', icon: <DashboardSquare02Icon size={16} />, ariaLabel: 'Grid view' },
          ]}
        />
        <ChromeIconButton ariaLabel="Expand to the full gallery" title="Expand to the full gallery" bordered={false} onClick={() => ui.open('evidenceGallery')} sx={{ ml: '6px' }}>
          <ArrowExpandIcon size={16} />
        </ChromeIconButton>
      </Box>

      <Box data-spec="ev-label" role="status" sx={{ p: '16px 16px 0 15px', fontSize: 12, lineHeight: '20px', fontWeight: fw.regular, color: barRef.muted, flexShrink: 0 }}>
        Showing {total} evidence item{total === 1 ? '' : 's'}
      </Box>

      <Box data-spec="ev-body" sx={{ flex: '1 1 0', minHeight: 0, overflow: 'auto', p: '12px 1px 16px 15px', background: '#fff', display: 'flex', flexDirection: 'column', gap: view === 'list' ? '8px' : 0, ...thinScroll }}>
        {total === 0 && <EmptyState type={s.evidence.length === 0 ? 'noRecords' : 'noFilter'} size="small" title="No evidence" description={s.evidence.length === 0 ? 'Nothing is attached yet. Use Screenshot, Snapshot, Video or Attach in the bar above.' : 'No evidence matches the filters.'} />}
        {groups.map((g) => (
          <Box key={g.label || 'all'} sx={{ display: 'contents' }}>
            {g.label && <Box sx={{ p: '8px 8px 0', fontSize: 12, lineHeight: '16px', fontWeight: fw.semiBold, color: barRef.muted }}>{g.label}</Box>}
            {view === 'list' ? (
              g.items.map((e) => (
                <Box key={e.id} component="button" type="button" onClick={() => open(e)} sx={{ ...rowSx, ...rowHover, cursor: 'pointer' }}>
                  <Box sx={tile}>
                    <EvidenceThumb item={e} fit="slice" />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Box className="nm" sx={{ fontSize: 12, lineHeight: '20px', fontWeight: fw.medium, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</Box>
                    <Box className="sb" sx={{ fontSize: 10, lineHeight: '16px', fontWeight: fw.regular, color: barRef.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{itemSub(s, e)}</Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', p: '4px 0' }}>
                {g.items.map((e) => (
                  <Box
                    key={e.id}
                    component="button"
                    type="button"
                    onClick={() => open(e)}
                    sx={{
                      p: 0, m: 0, textAlign: 'left', cursor: 'pointer', fontFamily: ev.font, color: barRef.ink, background: '#fff', border: `1px solid ${barRef.line}`, borderRadius: '8px', overflow: 'hidden', boxSizing: 'border-box', minWidth: 0,
                      '&:hover': { borderColor: barRef.btnLine, boxShadow: ev.cardHover }, '&:focus-visible': { outline: `2px solid ${barRef.focus}`, outlineOffset: 1 },
                    }}
                  >
                    <Box sx={{ height: 96, background: barRef.surface }}>
                      <EvidenceThumb item={e} fit="slice" />
                    </Box>
                    <Box sx={{ p: '8px 10px' }}>
                      <Box sx={{ fontSize: 12, lineHeight: '20px', fontWeight: fw.medium, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</Box>
                      <Box sx={{ fontSize: 10, lineHeight: '16px', color: barRef.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{itemSub(s, e)}</Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
        {view === 'list' ? samples.map(sampleRow) : samples.length > 0 && <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', p: '4px 0' }}>{samples.map(sampleRow)}</Box>}
      </Box>
    </Box>
  );
}

/** The pane itself (header + body). */
export function EvidencePane({ stepId, sop }: { stepId?: string; sop?: string }) {
  const [layoutEl, setLayoutEl] = useState<HTMLElement | null>(null);
  return (
    <Box
      component="aside"
      aria-label={sop ? 'Document preview' : 'Evidence and activity'}
      data-spec="ev-pane"
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'hidden', position: 'relative', background: '#fff', borderLeft: `1px solid ${barRef.line}`, fontFamily: ev.font, color: barRef.ink }}
    >
      <Box data-spec="ev-head" sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '0 6px 0 15px', boxSizing: 'border-box', height: 48, flexShrink: 0, background: '#fff', boxShadow: `inset 0 -1px 0 0 ${barRef.line}` }}>
        <Box component="h2" data-spec="ev-title" sx={{ m: 0, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, lineHeight: '20px', fontWeight: fw.semiBold, color: barRef.ink }}>
          {sop ?? 'Evidence & Activity'}
        </Box>
        {!sop && (
          <>
            <ChromeIconButton ariaLabel="Open the evidence gallery" title="Open the evidence gallery" onClick={() => ui.open('evidenceGallery')}>
              <SquareArrowUpRightIcon size={16} />
            </ChromeIconButton>
            <ChromeButton ariaLabel="Pane layout" ariaHasPopup="menu" ariaExpanded={!!layoutEl} onClick={(e) => setLayoutEl(e.currentTarget)} startIcon={<LayoutLeftIcon size={16} />} endIcon={<ArrowDown01Icon size={16} />} sx={{ px: '10px', gap: '6px' }} />
            <DropdownMenu
              anchorEl={layoutEl}
              open={!!layoutEl}
              onClose={() => setLayoutEl(null)}
              align="right"
              ariaLabel="Pane layout"
              selected="side"
              options={[
                { label: 'Side pane', value: 'side' },
                { label: 'Gallery view', value: 'gallery' },
              ]}
              onSelect={(o) => {
                if (o.value === 'gallery') ui.open('evidenceGallery');
              }}
            />
          </>
        )}
        <ChromeIconButton ariaLabel="Close" title="Close" bordered={false} onClick={() => ui.close('evidence')} sx={{ width: 24, height: 24, ml: '6px' }}>
          <Cancel01Icon size={16} />
        </ChromeIconButton>
      </Box>
      <Box data-spec="ev-pane-body" sx={{ flex: '1 1 0', minHeight: 0, overflow: 'auto', boxSizing: 'border-box', p: sop ? '16px' : 0, background: sop ? ev.sopBody : '#fff', ...thinScroll }}>
        {sop ? <SopPage title={sop} /> : <PaneBody key={stepId ?? 'all'} stepId={stepId} />}
      </Box>
    </Box>
  );
}

/**
 * Slot of the page layout: renders the pane when the 'evidence' overlay is on the ui stack. Opening grows the column from 0
 * to 712px and closing shrinks it back before the pane unmounts (flex-basis / max-width transition 0.26s). The pane gives way
 * (flex-shrink) when the execution panel is expanded, down to 320px; below 1200px the pane stacks under the document.
 */
export function EvidencePaneSlot() {
  const u = useUi();
  const entry = u.stack.find((o) => o.name === 'evidence');
  const wanted = !!entry;
  const [mounted, setMounted] = useState(wanted);
  const [grown, setGrown] = useState(false);
  const [last, setLast] = useState(entry?.payload);

  useEffect(() => {
    if (entry) setLast(entry.payload);
  }, [entry]);

  useEffect(() => {
    if (wanted) {
      setMounted(true);
      const id = requestAnimationFrame(() => setGrown(true));
      return () => cancelAnimationFrame(id);
    }
    setGrown(false);
    const t = window.setTimeout(() => setMounted(false), 280);
    return () => window.clearTimeout(t);
  }, [wanted]);

  if (!mounted) return null;
  const payload = (entry?.payload ?? last ?? {}) as { stepId?: string; sop?: string };
  const basis = grown ? `${PANE_PX}px` : '0px';
  return (
    <Box
      sx={{
        flex: { xs: '0 0 auto', md: grown ? '0 0 42%' : '0 0 0%', lg: `0 1 ${basis}` }, maxWidth: { xs: 'none', lg: basis }, minWidth: { xs: 0, lg: grown ? 320 : 0 }, minHeight: 0, overflow: 'hidden',
        height: { xs: '70vh', md: 'auto' }, transition: 'flex-basis .26s cubic-bezier(.4,0,.2,1), max-width .26s cubic-bezier(.4,0,.2,1)',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <EvidencePane key={`${payload.sop ?? ''}|${payload.stepId ?? ''}`} stepId={payload.stepId} sop={payload.sop} />
    </Box>
  );
}
