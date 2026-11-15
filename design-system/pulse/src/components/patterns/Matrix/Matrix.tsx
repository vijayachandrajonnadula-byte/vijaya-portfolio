/**
 * Figma page "Matrix": set "Matrix Cell" (Interactive = Yes|No, Type = Low|Medium|High|Axis, State = Default|Hover|Null).
 * 120x52, r=6, pad 8, centred semibold 12/20 label.
 *   Low    fill accent/green/200 text green/800     Medium fill accent/yellow/200 text orange/800 (#92400e)
 *   High   fill accent/red/300   text red/800       Axis   no fill, 1px neutral/200 border, text neutral/900
 *   Hover  1px brand/500 border (interactive cells only)
 * The page text lays them out as a risk matrix (Severity x Occurrence x Detectability, values Low (1..3), Medium (4..6), High (9)).
 * The gap between cells is not in the spec (only the single cell is); 8px is assumed.
 */
import { fw } from '../../../theme/typography';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { pt } from '../../../theme/pulseTokens';

export type MatrixCellType = 'low' | 'medium' | 'high' | 'axis';

const cellColors: Record<Exclude<MatrixCellType, 'axis'>, { bg: string; fg: string }> = {
  low: { bg: pt.colors.accent.green[200], fg: pt.colors.accent.green[800] },
  medium: { bg: pt.colors.accent.yellow[200], fg: pt.colors.accent.orange[800] },
  high: { bg: pt.colors.accent.red[300], fg: pt.colors.accent.red[800] },
};

export interface MatrixCellProps {
  type: MatrixCellType;
  children?: ReactNode;
  /** Hover border and pointer; renders a button. @default false */
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  /** Force the hover look (documentation). */
  hover?: boolean;
  /** @default 120 */
  width?: number | string;
  sx?: SxProps<Theme>;
}

export function MatrixCell({ type, children, interactive = false, selected, onClick, hover, width = 120, sx }: MatrixCellProps) {
  const axis = type === 'axis';
  const c = axis ? null : cellColors[type];
  const hoverBorder = `1px solid ${pt.colors.brand[500]}`;
  return (
    <Box
      data-spec={`matrix-cell ${type}`}
      {...(interactive && !axis ? { component: 'button' as const, type: 'button' as const, onClick, 'aria-pressed': selected } : {})}
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          width,
          height: 52,
          p: '8px',
          m: 0,
          borderRadius: '6px',
          bgcolor: c ? c.bg : 'transparent',
          color: c ? c.fg : pt.colors.neutral[900],
          border: axis ? `1px solid ${pt.colors.neutral[200]}` : hover || selected ? hoverBorder : '1px solid transparent',
          fontFamily: 'inherit',
          fontSize: 12,
          lineHeight: '20px',
          fontWeight: fw.semiBold,
          textAlign: 'center',
          cursor: interactive && !axis ? 'pointer' : 'default',
          '&:hover': interactive && !axis ? { border: hoverBorder } : undefined,
          '&:focus-visible': { outline: 'none', boxShadow: pt.shadow.focusStyle_1 },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ] as SxProps<Theme>}
    >
      {children}
    </Box>
  );
}

export interface MatrixCellData {
  type: Exclude<MatrixCellType, 'axis'>;
  label: ReactNode;
  /** Cell id for selection callbacks. */
  id?: string;
}
export interface MatrixProps {
  /** Column header labels (axis cells). */
  columns: ReactNode[];
  rows: { header: ReactNode; cells: MatrixCellData[] }[];
  /** Axis title shown in the corner cell, e.g. "Severity". */
  cornerLabel?: ReactNode;
  interactive?: boolean;
  selectedId?: string | null;
  onCellClick?: (cell: MatrixCellData, rowIndex: number, colIndex: number) => void;
  /** Cell width. @default 120 */
  cellWidth?: number;
  /** Gap between cells (assumed, not in the spec). @default 8 */
  gap?: number;
  sx?: SxProps<Theme>;
}

/** Grid of MatrixCells with axis headers (risk / severity matrix). */
export function Matrix({ columns, rows, cornerLabel, interactive = false, selectedId, onCellClick, cellWidth = 120, gap = 8, sx }: MatrixProps) {
  return (
    <Box
      role="grid"
      sx={[{ display: 'grid', gridTemplateColumns: `repeat(${columns.length + 1}, ${cellWidth}px)`, gap: `${gap}px`, width: 'fit-content' }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>}
    >
      <MatrixCell type="axis" width={cellWidth}>{cornerLabel}</MatrixCell>
      {columns.map((col, i) => <MatrixCell key={i} type="axis" width={cellWidth}>{col}</MatrixCell>)}
      {rows.map((row, r) => (
        <Box key={r} sx={{ display: 'contents' }}>
          <MatrixCell type="axis" width={cellWidth}>{row.header}</MatrixCell>
          {row.cells.map((cell, c) => (
            <MatrixCell key={c} type={cell.type} width={cellWidth} interactive={interactive} selected={cell.id !== undefined && cell.id === selectedId} onClick={() => onCellClick?.(cell, r, c)}>
              {cell.label}
            </MatrixCell>
          ))}
        </Box>
      ))}
    </Box>
  );
}
