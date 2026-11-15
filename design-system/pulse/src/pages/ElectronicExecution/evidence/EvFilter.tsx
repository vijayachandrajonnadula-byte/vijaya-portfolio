/**
 * NOT FROM FIGMA. Filter pieces shared by the evidence pane and the gallery (reference .evx-chips, .evx-fbtn and its popover):
 * kind chips with counts hidden (the reference shows only the label), a funnel button with a red "active" dot, and a popover
 * with Table / Step / Group by. Measured values from S\ref\overlays\spec.md; the popover content is not measured in the
 * reference (its screenshot shows the popover closed), so its inner layout follows the reference select and label styles.
 */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Box } from '../../../components/mui';
import { FilterIcon } from '../../../icons';
import { panelRole } from '../../../theme/typography';
import type { ExecState } from '../model';
import { ref } from '../refTheme';
import { EvBtn, EvChip, EvSelect, EvSq } from './EvControls';
import { EV_FILTERS, EV_FILTER_DEFAULT } from './evidenceMeta';
import type { EvFilter } from './evidenceMeta';
import { ev } from './evRef';

/** Popover open state: closes on outside click and on Escape (and keeps that Escape from closing the surface under it). */
export function useEvPopover() {
  const [open, setOpen] = useState(false);
  const r = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      if (r.current && !r.current.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      setOpen(false);
    };
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key, true);
    return () => {
      document.removeEventListener('mousedown', down);
      document.removeEventListener('keydown', key, true);
    };
  }, [open]);
  return { open, setOpen, ref: r };
}

export function EvKindChips({ value, onChange }: { value: EvFilter['kind']; onChange: (k: EvFilter['kind']) => void }) {
  return (
    <Box role="group" aria-label="Evidence kind" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', minWidth: 0 }}>
      {EV_FILTERS.map((f) => (
        <EvChip key={f.key} on={value === f.key} onClick={() => onChange(f.key)}>
          {f.label}
        </EvChip>
      ))}
    </Box>
  );
}

const isActive = (f: EvFilter) => f.table !== 0 || f.step !== '' || f.group !== 'none';

/** Funnel button (28x28) and its popover: Table, Step, Group by, Clear. */
export function EvFilterButton({ s, filter, onChange, bare, size = 28 }: { s: ExecState; filter: EvFilter; onChange: (f: EvFilter) => void; /** Borderless 32px icon button (the evidence pane of the real application). */ bare?: boolean; size?: number }) {
  const pop = useEvPopover();
  const active = isActive(filter);
  const tableSteps = s.protocol.tables.filter((t) => !filter.table || t.n === filter.table).flatMap((t) => t.stepIds);
  const field = (label: string, control: ReactNode) => (
    <Box component="label" sx={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: 11, fontWeight: panelRole.strong, color: ref.muted, lineHeight: 1.45 }}>
      {label}
      {control}
    </Box>
  );
  return (
    <Box ref={pop.ref} sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <EvSq
        size={size}
        radius={bare ? 6 : 7}
        bare={bare}
        active={active}
        aria-label="Filter evidence"
        aria-haspopup="dialog"
        aria-expanded={pop.open}
        onClick={() => pop.setOpen(!pop.open)}
        sx={{ color: active ? ref.navy2 : ref.ink, '&:hover:not(:disabled)': { color: ref.navy2 } }}
      >
        <FilterIcon size={14} />
        {active && <Box aria-hidden sx={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: ev.alert, border: `1.5px solid ${ref.white}` }} />}
      </EvSq>
      {pop.open && (
        <Box
          role="dialog"
          aria-label="Filter evidence"
          sx={{ position: 'absolute', top: size + 6, left: 0, zIndex: 5, width: 248, boxSizing: 'border-box', p: '12px', display: 'flex', flexDirection: 'column', gap: '10px', background: ref.white, border: `1px solid ${ref.line}`, borderRadius: '10px', boxShadow: ev.popShadow }}
        >
          {field(
            'Table',
            <EvSelect
              label="Table"
              value={String(filter.table)}
              onChange={(v) => onChange({ ...filter, table: Number(v), step: '' })}
              options={[{ value: '0', label: 'All tables' }, ...s.protocol.tables.map((t) => ({ value: String(t.n), label: `Table ${t.n}: ${t.title}` }))]}
            />,
          )}
          {field(
            'Step',
            <EvSelect
              label="Step"
              value={filter.step}
              onChange={(v) => onChange({ ...filter, step: v })}
              options={[{ value: '', label: 'All steps' }, ...tableSteps.flatMap((id) => (s.protocol.steps[id]?.evidence === null ? [] : [{ value: id, label: `Table ${s.protocol.steps[id]?.table} / Row ${s.protocol.steps[id]?.row}` }]))]}
            />,
          )}
          {field(
            'Group by',
            <EvSelect
              label="Group by"
              value={filter.group}
              onChange={(v) => onChange({ ...filter, group: v as EvFilter['group'] })}
              options={[{ value: 'none', label: 'None' }, { value: 'table', label: 'Table' }, { value: 'type', label: 'Type' }]}
            />,
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <EvBtn sm disabled={!active} onClick={() => onChange({ ...EV_FILTER_DEFAULT, kind: filter.kind, query: filter.query })}>
              Clear
            </EvBtn>
          </Box>
        </Box>
      )}
    </Box>
  );
}
