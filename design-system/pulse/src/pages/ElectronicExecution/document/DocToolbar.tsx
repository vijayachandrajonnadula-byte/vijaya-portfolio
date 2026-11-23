import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Box } from '../../../components/mui';
import { DropdownMenu } from '../../../components/form/DropdownMenu/DropdownMenu';
import { Tooltip } from '../../../components/feedback/Tooltip/Tooltip';
import { ViewPanel } from './ViewPanel';
import { ChromeButton, ChromeIconButton, SegmentedToggle } from '../../../components/navigation/ExecutionChrome/ExecutionChrome';
import { ArrowDown01Icon, ArrowLeft01Icon, ArrowRight01Icon, LayoutLeftIcon, Menu01Icon, MinusSignIcon, PlusSignIcon } from '../../../icons';
import { fw } from '../../../theme/typography';
import { barRef } from '../refTheme';

export const ZOOM_MIN = 50;
export const ZOOM_MAX = 200;
export const ZOOM_STEP = 10;

const divider = <Box aria-hidden sx={{ width: '1px', height: 24, background: barRef.line, flexShrink: 0, mx: '4px' }} />;

/** Shared look of the two navigator groups: one 32px bordered pill, so each reads as a single control (Common Region). */
const groupSx = { display: 'inline-flex', alignItems: 'stretch', height: 32, boxSizing: 'border-box', border: `1px solid ${barRef.btnLine}`, borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#fff' } as const;
/** A cell inside a group: full height, divided from its neighbours by a hairline. */
const cellSx = { display: 'inline-flex', alignItems: 'center', boxSizing: 'border-box', height: '100%', m: 0, border: 0, borderLeft: `1px solid ${barRef.line}`, borderRight: `1px solid ${barRef.line}`, background: 'transparent', whiteSpace: 'nowrap' } as const;

/** Previous / next chevron cell of a group (28px wide, full height), with a tooltip that names it. */
function Step({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <Tooltip title={label}>
      <span style={{ display: 'inline-flex' }}>
        <Box
          component="button"
          type="button"
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          sx={{ display: 'grid', placeItems: 'center', width: 28, height: '100%', p: 0, m: 0, border: 0, background: 'transparent', color: barRef.ink, cursor: 'pointer', '&:hover:not(:disabled)': { background: barRef.soft }, '&:disabled': { opacity: 0.35, cursor: 'default', pointerEvents: 'none' }, '&:focus-visible': { outline: `2px solid ${barRef.focus}`, outlineOffset: -2 } }}
        >
          {children}
        </Box>
      </span>
    </Tooltip>
  );
}

export interface DocToolbarProps {
  tableView: boolean;
  onView: (table: boolean) => void;
  tables: { n: number; label: string }[];
  curTable: number;
  onPickTable: (n: number) => void;
  /** 1-based row within the current table and the row count. */
  row: number;
  rowMax: number;
  onRow: (row: number) => void;
  onNextTable: () => void;
  /** A document chosen in the View panel (Attachments or Vault): show it. */
  onOpenDocument: (title: string) => void;
  zoom: number;
  onZoom: (z: number) => void;
}

/**
 * Document toolbar (48px, white): Document / Table toggle, a table stepper and a row stepper (each one bordered group: previous, the
 * current value, next), the View panel, zoom. First / last buttons and the "Go" button are gone: the table picker lists every table and
 * the row field takes a number on Enter or on leaving it.
 */
export function DocToolbar(p: DocToolbarProps) {
  const [tblEl, setTblEl] = useState<HTMLElement | null>(null);
  const [viewEl, setViewEl] = useState<HTMLElement | null>(null);
  const rowRef = useRef<HTMLInputElement>(null);
  const cur = p.tables.find((t) => t.n === p.curTable);
  const first = p.tables[0]?.n ?? 1;
  const last = p.tables[p.tables.length - 1]?.n ?? 1;
  const goRow = () => {
    const n = Number(rowRef.current?.value);
    if (Number.isFinite(n)) p.onRow(Math.min(p.rowMax, Math.max(1, Math.round(n))));
  };
  const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));

  return (
    <Box
      role="toolbar"
      aria-label="Document toolbar"
      sx={{
        display: 'flex', alignItems: 'center', gap: '4px', px: '16px', background: '#fff', boxShadow: `inset 0 -1px 0 0 ${barRef.line}`, flexShrink: 0, height: { md: 48 }, minHeight: 48, boxSizing: 'border-box', flexWrap: 'nowrap',
        overflowX: 'auto', overflowY: 'hidden', color: barRef.ink, '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <SegmentedToggle ariaLabel="Document view" value={p.tableView ? 'table' : 'document'} onChange={(v) => p.onView(v === 'table')} options={[{ value: 'document', label: 'Document' }, { value: 'table', label: 'Table' }]} />
      {divider}

      {/* table stepper: previous | picker | next, one bordered group (Common Region). First / last are the picker's job. */}
      <Box role="group" aria-label="Table navigation" sx={groupSx}>
        <Step label="Previous table" disabled={p.curTable === first} onClick={() => p.onPickTable(Math.max(first, p.curTable - 1))}>
          <ArrowLeft01Icon size={16} />
        </Step>
        <Tooltip title="Choose a table">
          <Box
            component="button"
            type="button"
            aria-haspopup="menu"
            aria-expanded={!!tblEl}
            aria-label={`Table: ${cur?.label ?? ''}. Choose a table`}
            onClick={(e: React.MouseEvent<HTMLElement>) => setTblEl(e.currentTarget)}
            sx={{ ...cellSx, gap: '6px', width: 192, px: '10px', justifyContent: 'flex-start', cursor: 'pointer', fontSize: 12, lineHeight: '16px', fontWeight: fw.medium, fontFamily: 'inherit', color: barRef.ink, '&:hover': { background: barRef.soft }, '&:focus-visible': { outline: `2px solid ${barRef.focus}`, outlineOffset: -2 } }}
          >
            <Menu01Icon size={16} />
            <Box component="span" sx={{ flex: 1, minWidth: 0, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cur?.label ?? 'Tables'}</Box>
            <ArrowDown01Icon size={16} />
          </Box>
        </Tooltip>
        <DropdownMenu
          anchorEl={tblEl}
          open={!!tblEl}
          onClose={() => setTblEl(null)}
          ariaLabel="Tables"
          selected={p.curTable}
          options={p.tables.map((t) => ({ label: t.label, value: t.n }))}
          onSelect={(o) => p.onPickTable(Number(o.value))}
        />
        <Step label="Next table" disabled={p.curTable === last} onClick={() => p.onPickTable(Math.min(last, p.curTable + 1))}>
          <ArrowRight01Icon size={16} />
        </Step>
      </Box>

      {/* row stepper: previous | Row n / total | next. Type a number and press Enter, or leave the field (Postel). */}
      <Box role="group" aria-label="Row navigation" sx={groupSx}>
        <Step label="Previous row" disabled={p.row <= 1} onClick={() => p.onRow(Math.max(1, p.row - 1))}>
          <ArrowLeft01Icon size={16} />
        </Step>
        <Tooltip title="Go to a row: type a number, then press Enter">
          <Box component="label" sx={{ ...cellSx, gap: '6px', px: '10px', fontSize: 12, lineHeight: '16px', fontWeight: fw.medium, color: barRef.muted, cursor: 'text' }}>
            Row
            <Box
              component="input"
              key={`${p.curTable}-${p.row}`}
              ref={rowRef}
              type="number"
              aria-label="Row number"
              min={1}
              max={p.rowMax}
              defaultValue={p.row}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') goRow();
              }}
              onBlur={goRow}
              sx={{
                width: 28, height: 24, boxSizing: 'border-box', textAlign: 'center', border: 0, borderRadius: '4px', fontSize: 12, fontWeight: fw.semiBold, p: 0, fontFamily: 'inherit', color: barRef.ink, background: 'transparent',
                '&:hover': { background: barRef.soft }, '&:focus': { outline: 'none', background: '#fff', boxShadow: `inset 0 0 0 1.5px ${barRef.navy}` },
                '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': { WebkitAppearance: 'none', m: 0 }, MozAppearance: 'textfield',
              }}
            />
            <Box component="span" sx={{ ml: '-2px', color: barRef.muted, fontVariantNumeric: 'tabular-nums' }}>/ {p.rowMax}</Box>
          </Box>
        </Tooltip>
        <Step label="Next row" disabled={p.row >= p.rowMax} onClick={() => p.onRow(Math.min(p.rowMax, p.row + 1))}>
          <ArrowRight01Icon size={16} />
        </Step>
      </Box>

      <Box sx={{ flex: 1, minWidth: 8 }} />

      {/* View panel: Attachments | Vault documents, and the page width */}
      <ChromeButton ariaHasPopup="dialog" ariaExpanded={!!viewEl} onClick={(e) => setViewEl(e.currentTarget)} startIcon={<LayoutLeftIcon size={16} />} endIcon={<ArrowDown01Icon size={16} />} sx={{ gap: '6px', px: '10px' }}>
        View
      </ChromeButton>
      <ViewPanel anchorEl={viewEl} onClose={() => setViewEl(null)} onOpenDocument={p.onOpenDocument} />
      <Box aria-hidden sx={{ width: '1px', height: 24, background: barRef.line, flexShrink: 0, mx: '8px' }} />

      {/* zoom */}
      <Box role="group" aria-label="Zoom" sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <ChromeIconButton ariaLabel="Zoom out" bordered={false} disabled={p.zoom <= ZOOM_MIN} onClick={() => p.onZoom(clampZoom(p.zoom - ZOOM_STEP))}>
          <MinusSignIcon size={16} />
        </ChromeIconButton>
        <Box component="span" aria-live="polite" sx={{ fontSize: 10.5, lineHeight: '16px', fontWeight: fw.medium, color: barRef.ink, minWidth: 56, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
          {p.zoom}%
        </Box>
        <ChromeIconButton ariaLabel="Zoom in" bordered={false} disabled={p.zoom >= ZOOM_MAX} onClick={() => p.onZoom(clampZoom(p.zoom + ZOOM_STEP))}>
          <PlusSignIcon size={16} />
        </ChromeIconButton>
      </Box>
    </Box>
  );
}
