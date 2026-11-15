// Pulse "Data Grid" page: DataGrid_Header, DataGrid_Text_Cell, tableCell, DatagridToolbar.
// Built on @mui/x-data-grid v9. Also exports a simple Table (columns/data API used by the Pulse app).
// Cell, header and form-cell building blocks live in DataGridCells.tsx and are re-exported from here.
import { role } from '../../../theme/typography';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { SxProps, Theme } from '@mui/material/styles';
import { DataGrid as MuiDataGrid, useGridApiRef } from '@mui/x-data-grid';
import type { DataGridProps as MuiDataGridProps, GridColDef, GridColumnVisibilityModel, GridValidRowModel } from '@mui/x-data-grid';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Search } from '../../form/Search/Search';
import { EmptyState } from '../EmptyState/EmptyState';
import type { EmptyStateType } from '../EmptyState/EmptyState';
import { pt } from '../../../theme/pulseTokens';
import { FilterIcon, FilterRemoveIcon, HierarchySquare01Icon, Layout3ColumnIcon, Menu01Icon } from '../../../icons';
import { focusRing } from '../../../theme/pulseTokens';
import { Checkbox as PulseCheckbox } from '../../form/Checkbox/Checkbox';
import { choiceSizes } from '../../_shared/choiceControl';
import { DataGridSizeProvider, dataGridColors, dataGridMetrics, useDataGridSize } from './DataGridCells';
import type { DataGridSize } from './DataGridCells';



export {
  DataGridActionsCell,
  DataGridCellFrame,
  DataGridEmptyCell,
  DataGridFormCell,
  DataGridGroupCell,
  DataGridHeaderCell,
  DataGridLinkCell,
  DataGridTextCell,
  dataGridColors,
  dataGridFormCellHeights,
  dataGridIconButtonSize,
  dataGridMetrics,
} from './DataGridCells';
export type { DataGridCellFrameProps, DataGridCellInteraction, DataGridFormCellProps, DataGridFormCellType, DataGridHeaderCellProps, DataGridSize, DataGridTextCellProps } from './DataGridCells';

const c = dataGridColors;
const sizeToDensity = { small: 'compact', medium: 'standard', large: 'comfortable' } as const;
/* ---------------------------------------------------------------- toolbar */

export interface DataGridToolbarProps {
  title?: ReactNode;
  /** Line under the title (Figma: hidden textContent, Secondary). */
  metadata?: ReactNode;
  /** Control size: small 32, medium 40, large 44; tablet and mobile use 32. @default "medium" */
  size?: 'small' | 'medium' | 'large' | 'tablet' | 'mobile';
  /** Figma Quick Filter = On: the status filter row (StatusFilterBar) under the title. Off: title and actions share one row. */
  quickFilter?: boolean;
  /** The status filter shown in the Quick Filter row. */
  statusFilter?: ReactNode;
  /** Show the Filter / Columns / Density tool buttons. @default true */
  showFilter?: boolean;
  showColumns?: boolean;
  showDensity?: boolean;
  /** Inline search field (the Search icon button in Figma). @default false */
  search?: boolean;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  /** TaskSwitcher slot (hidden by default in Figma). */
  taskSwitcher?: ReactNode;
  onFilterClick?: (anchor: HTMLElement) => void;
  onColumnsClick?: (anchor: HTMLElement) => void;
  onDensityClick?: (anchor: HTMLElement) => void;
  /** Shows the Group By icon button when provided (hidden by default in Figma). */
  onGroupByClick?: (anchor: HTMLElement) => void;
  /** Shows the Clear Filter icon button while filters are applied. */
  onClearFilters?: () => void;
  /** Primary action (e.g. a contained Button). */
  actionSlot?: ReactNode;
  /** Number of applied filters; shows the green 6px dot on the filter button. */
  appliedFilters?: number;
  sx?: SxProps<Theme>;
}

/** DatagridToolbar: title (Figtree SemiBold 18/28) + optional status filter row + Filter / Columns / Density icon buttons + primary action. */
// Figma DatagridToolbar: the tool icons are Plain IconButtons whose glyph is overridden to #111112.
const toolIcon = { '& svg': { color: '#111112' } } as const;

export function DataGridToolbar({ title, metadata, size = 'medium', quickFilter = false, showFilter = true, showColumns = true, showDensity = true, statusFilter, search, searchValue, onSearchChange, taskSwitcher, onFilterClick, onColumnsClick, onDensityClick, onGroupByClick, onClearFilters, actionSlot, appliedFilters = 0, sx }: DataGridToolbarProps) {
  const btnSize = size === 'medium' ? 'medium' : size === 'large' ? 'large' : 'small';
  const mobile = size === 'mobile';
  const actions = (
    <Box data-spec="toolbar-actions" sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
      {search && <Box sx={{ width: 200, flexShrink: 0 }}><Search fullWidth value={searchValue} onChange={(e) => onSearchChange?.(e.target.value)} handleClear={() => onSearchChange?.('')} placeholder="Search" size={size === 'large' ? 'medium' : 'small'} ariaLabel="Search" /></Box>}
      {taskSwitcher}
      {onClearFilters && appliedFilters > 0 && (
        <IconButton ariaLabel="Clear filters" size={btnSize} variant="plain" onClick={onClearFilters} sx={toolIcon}>
          <FilterRemoveIcon size={16} />
        </IconButton>
      )}
      {showFilter && (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <IconButton ariaLabel="Filters" size={btnSize} variant="plain" onClick={(e) => onFilterClick?.(e.currentTarget)} sx={toolIcon}>
            <FilterIcon size={16} />
          </IconButton>
          {appliedFilters > 0 && <Box sx={{ position: 'absolute', top: 10, right: 10, width: 6, height: 6, borderRadius: '50%', background: '#22c55e', border: '1px solid #fff', boxSizing: 'content-box', transform: 'translate(1px,-1px)' }} />}
        </Box>
      )}
      {onGroupByClick && (
        <IconButton ariaLabel="Group by" size={btnSize} variant="plain" onClick={(e) => onGroupByClick(e.currentTarget)} sx={toolIcon}>
          <HierarchySquare01Icon size={16} />
        </IconButton>
      )}
      {!mobile && showColumns && (
        <IconButton ariaLabel="Columns" size={btnSize} variant="plain" onClick={(e) => onColumnsClick?.(e.currentTarget)} sx={toolIcon}>
          <Layout3ColumnIcon size={16} />
        </IconButton>
      )}
      {!mobile && showDensity && (
        <IconButton ariaLabel="Density" size={btnSize} variant="plain" onClick={(e) => onDensityClick?.(e.currentTarget)} sx={toolIcon}>
          <Menu01Icon size={16} />
        </IconButton>
      )}
      {actionSlot}
    </Box>
  );
  const titleBlock = (
    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Box sx={{ fontSize: 18, lineHeight: '28px', fontWeight: role.title, color: pt.colors.base.black }}>{title}</Box>
      {metadata && <Box sx={{ fontSize: 12, lineHeight: '20px', color: c.metaText, marginTop: '-2px' }}>{metadata}</Box>}
    </Box>
  );
  return (
    <Box data-spec={`toolbar-${size}`} sx={[{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', boxSizing: 'border-box' }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      {quickFilter ? (
        <>
          {(title || metadata) && titleBlock}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', minWidth: 0 }}>
            <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>{statusFilter}</Box>
            {actions}
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '46px', minWidth: 0 }}>
          {titleBlock}
          {actions}
        </Box>
      )}
    </Box>
  );
}
/* --------------------------------------------------------------- DataGrid */

export interface DataGridProps<R extends GridValidRowModel = GridValidRowModel> extends Omit<MuiDataGridProps<R>, 'density' | 'columns' | 'rows'> {
  columns: GridColDef<R>[];
  rows: R[];
  /** Header, cell and row sizing. @default "medium" */
  size?: DataGridSize;
  /** Controlled size; the toolbar density menu changes it when uncontrolled. */
  onSizeChange?: (size: DataGridSize) => void;
  title?: ReactNode;
  metadata?: ReactNode;
  /** Status filter bar rendered in the toolbar. */
  statusFilter?: ReactNode;
  /** Primary toolbar action (Button). */
  actionSlot?: ReactNode;
  /** Hide the Pulse toolbar. @default false */
  hideToolbar?: boolean;
  /** Quick filter field in the toolbar. @default false */
  enableSearch?: boolean;
  /** DataGrid_Header BackGroundFill = Yes: filled #1e3a6e header, white text. @default false */
  filledHeader?: boolean;
  /** Row content: single line (tableCell Empty 32/36/44) or two lines, primary + meta data (DataGrid_Text_Cell 48/52/60). Override with 
owHeight for taller form cells (see dataGridFormCellHeights). @default "single" */
  rowLines?: 'single' | 'double' | 'none';
  /** Alternating row fill (tableCell Row Variant=Even). @default false */
  striped?: boolean;
  /** Vertical lines between header cells. @default true */
  columnDividers?: boolean;
  /** Rows highlighted for the Hover/Selected demo; leave unset normally. */
  emptyType?: EmptyStateType;
  /** Fixed height. The grid scrolls inside it. */
  height?: number | string;
  sx?: SxProps<Theme>;
}

/**
 * Selection checkbox used by the grid (header "select all" and row cells). Figma: header = Checkbox Small in every grid size;
 * row cell (DataGrid_Form_Cell, Radio Check Box) = Checkbox Small / Medium / Large with the grid size.
 */
function GridCheckbox(props: Record<string, unknown>) {
  const size = useDataGridSize();
  const sp = props.slotProps as { input?: Record<string, unknown>; htmlInput?: Record<string, unknown> } | undefined;
  const input = { ...sp?.htmlInput, ...sp?.input };
  const isHeader = input.name === 'select_all_rows';
  const cs = isHeader ? 'small' : size;
  // Figma places the checkbox in a frame of box + 3px padding each side (20 / 24 / 28), not the 32/40/44 hit area of the stand-alone control.
  const frame = choiceSizes[cs].box + 6;
  return (
    <PulseCheckbox
      sx={{ width: frame, height: frame, padding: '3px', margin: 0 }}
      size={cs}
      checked={Boolean(props.checked)}
      indeterminate={Boolean(props.indeterminate)}
      disabled={Boolean(props.disabled)}
      onChange={props.onChange as never}
      onClick={props.onClick as never}
      onKeyDown={props.onKeyDown as never}
      tabIndex={props.tabIndex as number | undefined}
      className={props.className as string | undefined}
      slotProps={{ input: input as never }}
    />
  );
}

/** Pulse data grid: Figma header/cell/row colours and sizes on top of MUI X DataGrid. */
export function DataGrid<R extends GridValidRowModel = GridValidRowModel>({
  columns,
  rows,
  size: sizeProp,
  onSizeChange,
  title,
  metadata,
  statusFilter,
  actionSlot,
  hideToolbar,
  enableSearch = false,
  striped = false,
  filledHeader = false,
  rowLines = 'single',
  columnDividers = true,
  emptyType = 'noRecords',
  height,
  sx,
  getRowClassName,
  slots,
  slotProps,
  filterModel,
  onFilterModelChange,
  columnVisibilityModel,
  onColumnVisibilityModelChange,
  pageSizeOptions = [10, 25, 50],
  initialState,
  ...rest
}: DataGridProps<R>) {
  const apiRef = useGridApiRef();
  const [sizeState, setSizeState] = useState<DataGridSize>('medium');
  const size = sizeProp ?? sizeState;
  const m = dataGridMetrics[size];
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState<GridColumnVisibilityModel>({});
  const [menu, setMenu] = useState<{ type: 'columns' | 'density'; anchor: HTMLElement } | null>(null);
  const [filters, setFilters] = useState<NonNullable<typeof filterModel>>({ items: [] });

  const fm = filterModel ?? { ...filters, quickFilterValues: search ? [search] : [] };
  const vm = columnVisibilityModel ?? visibility;
  const applied = fm.items.length;
  const setSize = (s: DataGridSize) => {
    if (sizeProp === undefined) setSizeState(s);
    onSizeChange?.(s);
  };

  const rowClass = useMemo(
    () => (p: Parameters<NonNullable<typeof getRowClassName>>[0]) => `${striped && p.indexRelativeToCurrentPage % 2 === 1 ? 'pulse-even' : ''} ${getRowClassName?.(p) ?? ''}`,
    [striped, getRowClassName],
  );

  const showToolbar = !hideToolbar;
  const headBg = filledHeader ? c.headerFilledBg : c.headerBg;
  const headText = filledHeader ? '#ffffff' : c.headerText;
  return (
    <DataGridSizeProvider value={size}><Box sx={{ display: 'flex', flexDirection: 'column', gap: pt.spacing.xl, width: '100%', height }}>
      {showToolbar && (
        <DataGridToolbar
          title={title}
          metadata={metadata}
          statusFilter={statusFilter}
          actionSlot={actionSlot}
          quickFilter={Boolean(statusFilter)}
          search={enableSearch}
          searchValue={search}
          onSearchChange={setSearch}
          onClearFilters={() => { setFilters({ items: [] }); setSearch(''); }}
          appliedFilters={applied}
          onFilterClick={() => apiRef.current?.showFilterPanel()}
          onColumnsClick={(a) => setMenu({ type: 'columns', anchor: a })}
          onDensityClick={(a) => setMenu({ type: 'density', anchor: a })}
        />
      )}
      <Menu open={menu?.type === 'columns'} anchorEl={menu?.anchor} onClose={() => setMenu(null)}>
        {columns.map((col) => (
          <Box key={col.field} sx={{ px: 2 }}>
            <FormControlLabel
              label={<Box sx={{ fontSize: 12 }}>{col.headerName ?? col.field}</Box>}
              control={
                <Checkbox
                  size="small"
                  checked={vm[col.field] !== false}
                  onChange={(_, v) => {
                    const next = { ...vm, [col.field]: v };
                    if (columnVisibilityModel === undefined) setVisibility(next);
                    onColumnVisibilityModelChange?.(next, { api: apiRef.current } as never);
                  }}
                />
              }
            />
          </Box>
        ))}
      </Menu>
      <Menu open={menu?.type === 'density'} anchorEl={menu?.anchor} onClose={() => setMenu(null)}>
        {(['small', 'medium', 'large'] as const).map((s) => (
          <MenuItem key={s} selected={s === size} onClick={() => { setSize(s); setMenu(null); }} sx={{ fontSize: 12, textTransform: 'capitalize' }}>
            {s}
          </MenuItem>
        ))}
      </Menu>
      <MuiDataGrid<R>
        apiRef={apiRef}
        columns={rest.checkboxSelection && !columns.some((col) => col.field === '__check__')
          // Selection column = cell padding + checkbox frame + cell padding (Figma Form Cell: 14+20+14 small, 16+24+16 medium, 20+28+20 large).
          ? [{ field: '__check__', width: 2 * m.padX + choiceSizes[size].box + 6, resizable: false } as GridColDef<R>, ...columns]
          : columns}
        rows={rows}
        density={sizeToDensity[size]}
        rowHeight={rowLines === 'double' ? m.rowTwoLine : m.row}
        columnHeaderHeight={m.header}
        pageSizeOptions={pageSizeOptions}
        initialState={initialState ?? { pagination: { paginationModel: { pageSize: 10 } } }}
        filterModel={fm}
        onFilterModelChange={(model, details) => {
          setFilters({ ...model, quickFilterValues: undefined });
          onFilterModelChange?.(model, details);
        }}
        columnVisibilityModel={vm}
        onColumnVisibilityModelChange={(model, details) => {
          setVisibility(model);
          onColumnVisibilityModelChange?.(model, details);
        }}
        getRowClassName={rowClass}
        disableColumnMenu={false}
        slots={{ baseCheckbox: GridCheckbox as never, noRowsOverlay: () => <EmptyState type={emptyType} size="small" />, ...slots }}
        slotProps={slotProps}
        sx={[
          {
            flex: 1,
            minHeight: 0,
            fontFamily: 'inherit',
            fontSize: 12,
            color: c.bodyText,
            border: `1px solid ${c.border}`,
            borderRadius: pt.uiElements.dataGrid.radius.m,
            backgroundColor: c.cell,
            '--DataGrid-t-header-background-base': headBg,
            '--DataGrid-t-color-border-base': c.border,
            '--DataGrid-t-color-background-base': c.cell,
            '--unstable_DataGrid-headWeight': 400,
            // The header row's own filler/scrollbar filler take the header colour. The same "filler" class is also used for the
            // empty space below the rows when there are few of them: that must stay the body colour, not the header's.
            '& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaders .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller': { backgroundColor: headBg },
            '& .MuiDataGrid-virtualScroller .MuiDataGrid-filler': { backgroundColor: 'transparent' },
            '& .MuiDataGrid-columnHeaders': { borderBottom: `1px solid ${c.headerBorder}` },
            '& .MuiDataGrid-columnHeader': { padding: `0 ${m.headerPadX}px`, color: headText, justifyContent: 'flex-start', gap: '4px' },
            '& .MuiDataGrid-columnHeader .MuiSvgIcon-root, & .MuiDataGrid-columnHeader .MuiIconButton-root': { color: headText },
            '& .MuiDataGrid-columnHeaderTitle': { fontSize: 12, lineHeight: '20px', fontWeight: role.gridHeader, color: headText },
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
            '& .MuiDataGrid-columnHeader.Mui-focusVisible, & .MuiDataGrid-cell.Mui-focusVisible': { boxShadow: `inset ${focusRing}` },
            // Column divider = Figma tableHeaderDivider: a 1x16 bar, radius 2, centred in the resize handle. MUI draws an svg: hide it and draw the bar.
            '& .MuiDataGrid-columnSeparator': { visibility: columnDividers ? 'visible' : 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 10, '& svg': { display: 'none' }, '&::after': { content: '""', width: '1px', height: 16, borderRadius: '2px', backgroundColor: filledHeader ? c.headerFilledDivider : c.headerDivider } },
            // Header cell (Figma DataGrid_Header): title, then sort + menu as 24px plain icon buttons right after it.
            // Title grows; sort and the hover menu icon sit at the end of the cell (Figma "text with sorting": title grow, then icons).
            '& .MuiDataGrid-columnHeaderDraggableContainer': { flex: '1 1 auto', width: 'auto', minWidth: 0 },
            '& .MuiDataGrid-columnHeaderTitleContainer': { flex: '1 1 auto', gap: '4px', minWidth: 0 },
            '& .MuiDataGrid-columnHeaderTitleContainerContent': { flex: '1 1 auto', minWidth: 0, color: headText },
            '& .MuiDataGrid-iconButtonContainer': { marginLeft: 'auto', flexShrink: 0 },
            '& .MuiDataGrid-menuIcon': { marginLeft: 0, marginRight: 0, flexShrink: 0 },
            '& .MuiDataGrid-iconButtonContainer .MuiIconButton-root, & .MuiDataGrid-menuIconButton, & .MuiDataGrid-sortButton': {
              width: 24,
              height: 24,
              padding: 0,
              borderRadius: pt.radius.xs,
              color: headText,
              // MUI paints these with the grid's base background (white): that hid the icon on a coloured header.
              backgroundColor: 'transparent',
              '&:hover': { backgroundColor: filledHeader ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.06)' },
              '&.Mui-focusVisible': { boxShadow: focusRing },
              '& .MuiSvgIcon-root': { fontSize: 16, color: 'inherit' },
            },
            '& .MuiDataGrid-row': { backgroundColor: c.cell },
            '& .MuiDataGrid-row.pulse-even': { backgroundColor: c.even },
            '& .MuiDataGrid-row:hover': { backgroundColor: c.hover },
            '& .MuiDataGrid-row.Mui-selected': { backgroundColor: c.selected },
            '& .MuiDataGrid-row.Mui-selected:hover': { backgroundColor: c.selectedHover },
            // Column Merger (Figma tableCell Types=Column Merger): a group header row above the column headers, same header look.
            // Use MUI's `columnGroupingModel`. "Without Row Border" example: rowLines="none" removes the cell top border.
            '& .MuiDataGrid-columnHeader--filledGroup, & .MuiDataGrid-columnHeader--emptyGroup': { backgroundColor: headBg, padding: `0 ${m.headerPadX}px` },
            '& .MuiDataGrid-columnHeader--filledGroup': { borderBottom: `1px solid ${c.headerBorder}` },
            '& .MuiDataGrid-cell': { padding: `0 ${m.padX}px`, borderTop: rowLines === 'none' ? 'none' : `1px solid ${c.border}`, display: 'flex', alignItems: 'center', fontSize: 12, lineHeight: '20px' },
            '& .MuiDataGrid-cell--withRenderer': { alignItems: 'center' },
            '& .MuiCheckbox-root': { padding: '3px' },
            // Selection column: checkbox starts at the cell padding (Figma Form Cell / Header), same left edge in header and rows.
            '& .MuiDataGrid-columnHeader--checkbox, & .MuiDataGrid-cell--withCheckbox, & .MuiDataGrid-cellCheckbox': { padding: `0 ${m.padX}px`, justifyContent: 'flex-start' },
            '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderDraggableContainer, & .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': { flex: 1, width: '100%', justifyContent: 'flex-start', overflow: 'visible' },
            '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainerContent': { display: 'flex', alignItems: 'center', overflow: 'visible' },
            '& .MuiDataGrid-footerContainer': { minHeight: 40, borderTop: `1px solid ${c.border}`, fontSize: 12 },
            '& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select': { fontSize: 12 },
            '& .MuiDataGrid-selectedRowCount': { fontSize: 12 },
            '& mark': { backgroundColor: pt.uiElements.dataGrid.textHighlight },
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        {...rest}
      />
    </Box></DataGridSizeProvider>
  );
}

/* ------------------------------------------------------------------ Table */

export interface TableColumn<R> {
  id: string;
  label: ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  renderCell?: (row: R) => ReactNode;
}

export interface TableProps<R extends Record<string, unknown>> {
  columns: TableColumn<R>[];
  data: R[];
  /** @default "medium" */
  size?: DataGridSize;
  stickyHeader?: boolean;
  maxHeight?: number | string;
  striped?: boolean;
  onRowClick?: (row: R) => void;
  /** Highlights a row with the DataGrid "row selected" colour and sets aria-selected. */
  isRowSelected?: (row: R) => boolean;
  sx?: SxProps<Theme>;
}

/** Simple static table with the Data Grid look (tableCell Header / Text Based Cell). */
export function Table<R extends Record<string, unknown>>({ columns, data, size = 'medium', stickyHeader, maxHeight, striped, onRowClick, isRowSelected, sx }: TableProps<R>) {
  const m = dataGridMetrics[size];
  return (
    <TableContainer sx={[{ maxHeight, border: `1px solid ${c.border}`, borderRadius: pt.uiElements.dataGrid.radius.m, background: c.cell }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      <MuiTable stickyHeader={stickyHeader} size="small" sx={{ '& .MuiTableCell-root': { fontSize: 12, lineHeight: '20px', padding: `${m.padY}px ${m.padX}px`, borderBottom: 'none', borderTop: `1px solid ${c.border}`, color: c.bodyText } }}>
        <TableHead>
          <TableRow>
            {columns.map((col, i) => (
              <TableCell
                key={col.id}
                align={col.align}
                sx={{
                  width: col.width,
                  height: m.header,
                  boxSizing: 'border-box',
                  backgroundColor: `${c.headerBg} !important`,
                  color: `${c.headerText} !important`,
                  borderTop: 'none !important',
                  borderBottom: `1px solid ${c.headerBorder} !important`,
                  padding: `${m.headerPadY}px ${m.headerPadX}px !important`,
                  position: 'relative',
                  '&::after': i < columns.length - 1 ? { content: '""', position: 'absolute', right: 0, top: '50%', height: 16, marginTop: '-8px', width: '1px', background: c.headerDivider } : undefined,
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, ri) => (
            <TableRow
              key={ri}
              hover
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              selected={isRowSelected?.(row)}
              aria-selected={isRowSelected ? isRowSelected(row) : undefined}
              sx={{
                cursor: onRowClick ? 'pointer' : undefined,
                backgroundColor: isRowSelected?.(row) ? `${c.selected} !important` : striped && ri % 2 === 1 ? c.even : c.cell,
                '&.MuiTableRow-hover:hover': { backgroundColor: isRowSelected?.(row) ? c.selected : c.hover },
              }}
            >
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align}>
                  {col.renderCell ? col.renderCell(row) : (row[col.id] as ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}











export type { GridColDef } from '@mui/x-data-grid';
