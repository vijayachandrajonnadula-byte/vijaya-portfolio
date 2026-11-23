import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Box } from '../../../components/mui';
import { DropdownMenu } from '../../../components/form/DropdownMenu/DropdownMenu';
import { ViewPanel } from './ViewPanel';
import { ChromeButton, ChromeIconButton, SegmentedToggle } from '../../../components/navigation/ExecutionChrome/ExecutionChrome';
import { ArrowDown01Icon, ArrowLeft01Icon, ArrowLeftDoubleIcon, ArrowRight01Icon, ArrowRightDoubleIcon, LayoutLeftIcon, Menu01Icon, MinusSignIcon, PlusSignIcon } from '../../../icons';
import { fw } from '../../../theme/typography';
import { barRef } from '../refTheme';

export const ZOOM_MIN = 50;
export const ZOOM_MAX = 200;
export const ZOOM_STEP = 10;

const divider = <Box aria-hidden sx={{ width: '1px', height: 24, background: barRef.line, flexShrink: 0, mx: '4px' }} />;

/** 24px chevron button of the navigators (the real toolbar shows them without a border). */
function Nav({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <Box
      component="button"
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      sx={{ display: 'grid', placeItems: 'center', width: 24, height: 24, p: 0, m: 0, border: 0, borderRadius: '6px', background: 'transparent', color: barRef.ink, cursor: 'pointer', flexShrink: 0, '&:hover:not(:disabled)': { background: barRef.soft }, '&:disabled': { opacity: 0.35, cursor: 'default' }, '&:focus-visible': { outline: `2px solid ${barRef.focus}`, outlineOffset: 1 } }}
    >
      {children}
    </Box>
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

/** Document toolbar (48px, white): Document / Table toggle, table navigator and picker, row navigator, View menu, zoom. */
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

      {/* table navigator */}
      <Nav label="First table" disabled={p.curTable === first} onClick={() => p.onPickTable(first)}>
        <ArrowLeftDoubleIcon size={16} />
      </Nav>
      <Nav label="Previous table" disabled={p.curTable === first} onClick={() => p.onPickTable(Math.max(first, p.curTable - 1))}>
        <ArrowLeft01Icon size={16} />
      </Nav>
      <ChromeButton
        tone="field"
        weight="medium"
        ariaHasPopup="menu"
        ariaExpanded={!!tblEl}
        ariaLabel={`Table: ${cur?.label ?? ''}. Choose a table`}
        onClick={(e) => setTblEl(e.currentTarget)}
        startIcon={<Menu01Icon size={16} />}
        endIcon={<ArrowDown01Icon size={16} />}
        sx={{ width: 196, justifyContent: 'flex-start', gap: '8px', mx: '4px', '& .label': { flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' } }}
      >
        <span className="label">{cur?.label ?? 'Tables'}</span>
      </ChromeButton>
      <DropdownMenu
        anchorEl={tblEl}
        open={!!tblEl}
        onClose={() => setTblEl(null)}
        ariaLabel="Tables"
        selected={p.curTable}
        options={p.tables.map((t) => ({ label: t.label, value: t.n }))}
        onSelect={(o) => p.onPickTable(Number(o.value))}
      />
      <Nav label="Next table" disabled={p.curTable === last} onClick={() => p.onPickTable(Math.min(last, p.curTable + 1))}>
        <ArrowRight01Icon size={16} />
      </Nav>
      <Nav label="Last table" disabled={p.curTable === last} onClick={() => p.onPickTable(last)}>
        <ArrowRightDoubleIcon size={16} />
      </Nav>
      {divider}

      {/* row navigator */}
      <Box role="group" aria-label="Row navigation" sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        <Nav label="First row" onClick={() => p.onRow(1)}>
          <ArrowLeftDoubleIcon size={16} />
        </Nav>
        <Nav label="Previous row" onClick={() => p.onRow(Math.max(1, p.row - 1))}>
          <ArrowLeft01Icon size={16} />
        </Nav>
        <Box component="span" sx={{ fontSize: 12, lineHeight: '16px', fontWeight: fw.semiBold, color: barRef.ink, mr: '1px' }}>
          Row
        </Box>
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
          sx={{
            width: 32, height: 32, boxSizing: 'border-box', textAlign: 'center', border: 0, boxShadow: `inset 0 0 0 1.5px ${barRef.fieldLine}`, borderRadius: '6px', fontSize: 12, fontWeight: fw.medium, p: 0, fontFamily: 'inherit', color: barRef.ink, background: '#fff', mx: '2px',
            '&:focus': { outline: 'none', boxShadow: `inset 0 0 0 1.5px ${barRef.navy}` },
            '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': { WebkitAppearance: 'none', m: 0 }, MozAppearance: 'textfield',
          }}
        />
        <Box component="span" sx={{ fontSize: 12, lineHeight: '16px', fontWeight: fw.medium, color: barRef.ink, mr: '1px' }}>
          /{p.rowMax}
        </Box>
        <ChromeButton tone="navy" onClick={goRow} sx={{ px: 0, width: 41 }}>
          Go
        </ChromeButton>
        <Nav label="Next row" onClick={() => p.onRow(Math.min(p.rowMax, p.row + 1))}>
          <ArrowRight01Icon size={16} />
        </Nav>
        <Nav label="Last row" onClick={() => p.onRow(p.rowMax)}>
          <ArrowRightDoubleIcon size={16} />
        </Nav>
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
