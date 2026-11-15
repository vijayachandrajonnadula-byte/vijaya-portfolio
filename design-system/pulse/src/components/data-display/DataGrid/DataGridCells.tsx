// Figma: Data Grid page, `BuildingBlocks/DataGrid_Text_Cell`, `DataGrid_Form_Cell`, `DataGrid_Header` and `tableCell`.
// Cell frames reproduce padding, gap, radius-free fills and heights for every Size / Interaction. Inside <DataGrid> the
// frame comes from the grid (cells render content only); the *Frame components are for standalone use and the demo.
import { fw, role } from '../../../theme/typography';
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import { Checkbox } from '../../form/Checkbox/Checkbox';
import { Radio } from '../../form/Radio/Radio';
import { Select } from '../../form/Select/Select';
import type { SelectProps } from '../../form/Select/Select';
import { TextArea, TextField } from '../../form/TextField/TextField';
import type { TextFieldProps } from '../../form/TextField/TextField';
import { Chip } from '../Chip/Chip';
import type { ChipProps } from '../Chip/Chip';
import { Status } from '../Status/Status';
import type { StatusProps } from '../Status/Status';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import type { ProgressBarProps } from '../ProgressBar/ProgressBar';
import { TrendLine } from '../TrendLine/TrendLine';
import type { TrendLineProps } from '../TrendLine/TrendLine';
import { Badge } from '../Badge/Badge';
import type { BadgeColor } from '../Badge/Badge';
import { focusRing, disabledOpacity } from '../../../theme/pulseTokens';

export type DataGridSize = 'small' | 'medium' | 'large';
/** Interaction variants of the text and form cells. */
export type DataGridCellInteraction = 'default' | 'hover' | 'disabled' | 'rowSelected' | 'rowSelectedHover';

/** Measurements from DataGrid_Header / DataGrid_Text_Cell / DataGrid_Form_Cell / tableCell. */
export const dataGridMetrics = {
  /**
   * header: header height. padY/padX: cell padding. headerPadY/headerPadX: header padding. gap: gap between cell parts
   * (text with icon / form cell). row: single-line or empty row (tableCell Empty, 32/36/44). rowTwoLine: two-line text
   * cell (48/52/60). rowLink: Link cell (52/56/64). rowIcons: Icons cell (36/48/56).
   */
  small: { header: 32, headerPadY: 4, headerPadX: 14, padY: 6, padX: 14, gap: 4, row: 32, rowTwoLine: 48, rowLink: 52, rowIcons: 36 },
  medium: { header: 40, headerPadY: 8, headerPadX: 16, padY: 8, padX: 16, gap: 8, row: 36, rowTwoLine: 52, rowLink: 56, rowIcons: 48 },
  large: { header: 44, headerPadY: 8, headerPadX: 16, padY: 12, padX: 20, gap: 12, row: 44, rowTwoLine: 60, rowLink: 64, rowIcons: 56 },
} as const;

/** Colours from the Figma variables uiElements/dataGrid/* and tableAccordion/*. */
export const dataGridColors = {
  headerBg: '#f1f5f9',
  headerFilledBg: '#1e3a6e',
  headerFilledDivider: '#87a8d3',
  headerBorder: '#e2e8f0',
  /** Figma uiElements/dataGrid/color/header/headerDivider (tableHeaderDivider: 1x16, r2). */
  headerDivider: '#e2e8f0',
  border: '#e2e8f0',
  cell: '#ffffff',
  even: '#f6f8fc',
  hover: '#eef3fb',
  selected: '#eff6ff',
  selectedHover: '#f6f8fc',
  groupBy: '#eef3fb',
  headerText: '#0f172a',
  bodyText: '#1e293b',
  metaText: '#566680',
  highlight: '#fef9c3',
  groupText: '#1e3a6e',
} as const;
const c = dataGridColors;

/** Form cell heights (DataGrid_Form_Cell, per Type x Size). Use as the grid `rowHeight` for a column-of-that-type grid. */
export const dataGridFormCellHeights = {
  radioCheckbox: { small: 36, medium: 40, large: 56 },
  chip: { small: 36, medium: 40, large: 48 },
  status: { small: 36, medium: 40, large: 48 },
  progress: { small: 36, medium: 40, large: 48 },
  input: { small: 44, medium: 56, large: 68 },
  dropdown: { small: 44, medium: 56, large: 68 },
  buttons: { small: 36, medium: 48, large: 64 },
  textArea: { small: 92, medium: 96, large: 104 },
  slot: { small: 36, medium: 40, large: 48 },
  trendLine: { small: 32, medium: 36, large: 44 },
  tree: { small: 48, medium: 56, large: 56 },
} as const;
export type DataGridFormCellType = keyof typeof dataGridFormCellHeights;

const SizeContext = createContext<DataGridSize>('medium');
/** Provided by <DataGrid>; cells read their size from it unless `size` is passed. */
export const DataGridSizeProvider = SizeContext.Provider;
export const useDataGridSize = () => useContext(SizeContext);

const bgFor = (i: DataGridCellInteraction, even?: boolean) =>
  i === 'hover' ? c.hover : i === 'rowSelectedHover' ? c.selectedHover : i === 'rowSelected' ? c.cell : even ? c.even : c.cell;

/* ------------------------------------------------------------ cell frames */

export interface DataGridCellFrameProps {
  size?: DataGridSize;
  /** @default "default" */
  interaction?: DataGridCellInteraction;
  /** tableCell Row Variant = Even. */
  even?: boolean;
  /** Fixed height; omit to hug the content. */
  height?: number;
  /** Override the gap between parts (default: per size 4/8/12). */
  gap?: number;
  /** Skip the horizontal padding (tree cells). */
  children?: ReactNode;
  width?: number | string;
  background?: string;
}

/** Standalone cell box: padding, fill and top border of a data grid cell. */
export function DataGridCellFrame({ size, interaction = 'default', even, height, gap, children, width = 200, background }: DataGridCellFrameProps) {
  const ctx = useContext(SizeContext);
  const m = dataGridMetrics[size ?? ctx];
  return (
    <Box
      data-spec={`cell-${size ?? ctx}-${interaction}`}
      sx={{
        boxSizing: 'border-box',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: `${gap ?? m.gap}px`,
        width,
        height,
        padding: `${m.padY}px ${m.padX}px`,
        background: background ?? bgFor(interaction, even),
        borderTop: `1px solid ${c.border}`,
        opacity: interaction === 'disabled' ? disabledOpacity : 1,
      }}
    >
      {children}
    </Box>
  );
}

/** tableCell Content Level = Empty (32/36/44). */
export function DataGridEmptyCell({ size, even, width }: { size?: DataGridSize; even?: boolean; width?: number | string }) {
  const ctx = useContext(SizeContext);
  const s = size ?? ctx;
  return <DataGridCellFrame size={s} even={even} height={dataGridMetrics[s].row} width={width} />;
}

/* ------------------------------------------------------------- text cells */

const lineStyle = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;

export interface DataGridTextCellProps {
  primary: ReactNode;
  /** Meta data line under the primary line (two-line cell, 18px). */
  secondary?: ReactNode;
  /** Leading icon (Type = Text with Icon, Left Icon). */
  icon?: ReactNode;
  /** Trailing icon (Right Icon). */
  trailingIcon?: ReactNode;
  /** Leading 8px status dot (Type = Default, "cell status"). */
  statusColor?: BadgeColor;
  bold?: boolean;
  size?: DataGridSize;
}

/** DataGrid_Text_Cell Type = Default / Text with Icon: primary 12/20 plus optional meta line 18, gap -2. */
export function DataGridTextCell({ primary, secondary, icon, trailingIcon, statusColor, bold, size }: DataGridTextCellProps) {
  const ctx = useContext(SizeContext);
  const m = dataGridMetrics[size ?? ctx];
  const hasIcon = Boolean(icon || trailingIcon);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: hasIcon ? `${m.gap}px` : '2px', minWidth: 0, width: '100%' }}>
      {statusColor && <Badge variant="dot" size="medium" color={statusColor} />}
      {icon && <Box sx={{ display: 'inline-flex', flex: 'none', '& svg': { fontSize: 16 } }}>{icon}</Box>}
      <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '0px' }}>
        <Box sx={{ fontSize: 12, lineHeight: '20px', fontWeight: bold ? fw.semiBold : fw.regular, color: c.bodyText, ...lineStyle }}>{primary}</Box>
        {secondary && <Box sx={{ fontSize: 11, lineHeight: '18px', color: c.metaText, marginTop: '-2px', ...lineStyle }}>{secondary}</Box>}
      </Box>
      {trailingIcon && <Box sx={{ display: 'inline-flex', flex: 'none', '& svg': { fontSize: 16 } }}>{trailingIcon}</Box>}
    </Box>
  );
}

/** Link cell (DataGrid_Text_Cell, Type = Link): textLink (Dark) over a meta data line, gap -4. */
export function DataGridLinkCell({ children, secondary, href = '#', onClick, chip }: { children: ReactNode; secondary?: ReactNode; href?: string; onClick?: () => void; chip?: ChipProps }) {
  return (
    <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', minHeight: 24 }}>
        <Box
          component="a"
          href={href}
          onClick={(e: { preventDefault: () => void }) => {
            if (href === '#') e.preventDefault();
            onClick?.();
          }}
          // Figma textLink (Variant=Dark): Default = SemiBold, no underline; Hover = Regular + underline.
          sx={{ fontSize: 12, lineHeight: '20px', color: c.groupText, ...lineStyle, fontWeight: role.link, textDecoration: 'none', '&:hover': { fontWeight: role.linkHover, textDecoration: 'underline' }, '&:focus-visible': { outline: 'none', boxShadow: focusRing, borderRadius: '2px' } }}
        >
          {children}
        </Box>
        {chip && <Chip size="xsmall" {...chip} />}
      </Box>
      {secondary && <Box sx={{ fontSize: 11, lineHeight: '18px', color: c.metaText, marginTop: '-4px', ...lineStyle }}>{secondary}</Box>}
    </Box>
  );
}

/** Group by cell (Type = Group by): arrow + semibold #1e3a6e label + meta line. Fill is #fff, #eef3fb on hover / expanded. */
export function DataGridGroupCell({ label, secondary, expanded = true, icon, onToggle }: { label: ReactNode; secondary?: ReactNode; expanded?: boolean; icon?: ReactNode; onToggle?: () => void }) {
  const ctx = useContext(SizeContext);
  const m = dataGridMetrics[ctx];
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: `${m.gap}px`, minWidth: 0, width: '100%' }}>
      <Box
        component="button"
        type="button"
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse group' : 'Expand group'}
        onClick={onToggle}
        sx={{ display: 'inline-flex', flex: 'none', padding: 0, border: 0, background: 'none', cursor: 'pointer', color: c.groupText, '&:focus-visible': { outline: 'none', boxShadow: focusRing, borderRadius: '2px' } }}
      >
        {expanded ? <ArrowDropDownRounded sx={{ fontSize: 16 }} /> : <ChevronRightRounded sx={{ fontSize: 16 }} />}
      </Box>
      {icon && <Box sx={{ display: 'inline-flex', flex: 'none', '& svg': { fontSize: 16 } }}>{icon}</Box>}
      <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ fontSize: 12, lineHeight: '20px', fontWeight: fw.semiBold, color: c.groupText, ...lineStyle }}>{label}</Box>
        {secondary && <Box sx={{ fontSize: 11, lineHeight: '18px', color: c.metaText, marginTop: '-2px', ...lineStyle }}>{secondary}</Box>}
      </Box>
    </Box>
  );
}

/** Icons cell (Type = Icons): row of icon buttons. Pass IconButtons (size xsmall for Small, small for Medium/Large). */
export function DataGridActionsCell({ children }: { children: ReactNode }) {
  const ctx = useContext(SizeContext);
  return <Box sx={{ display: 'flex', alignItems: 'center', gap: `${dataGridMetrics[ctx].gap}px` }}>{children}</Box>;
}
/** IconButton size the Icons cell uses at each grid size. */
export const dataGridIconButtonSize = { small: 'xsmall', medium: 'small', large: 'small' } as const;

/* -------------------------------------------------------------- form cell */

export interface DataGridFormCellProps {
  type: DataGridFormCellType;
  size?: DataGridSize;
  /** radioCheckbox: which control to show. @default "checkbox" */
  control?: 'checkbox' | 'radio';
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** radioCheckbox: content text next to the control, and its meta data line. */
  label?: ReactNode;
  meta?: ReactNode;
  /** radioCheckbox: avatar, chip/status: trailing icon. */
  avatar?: ReactNode;
  trailingIcon?: ReactNode;
  chip?: ChipProps;
  status?: StatusProps;
  progress?: ProgressBarProps;
  trend?: TrendLineProps;
  input?: TextFieldProps;
  dropdown?: SelectProps;
  textArea?: TextFieldProps;
  /** buttons / slot / tree: the content. */
  children?: ReactNode;
  disabled?: boolean;
}

/** DataGrid_Form_Cell content: the real form control sized for the cell. Wrap in a cell frame (the grid does). */
export function DataGridFormCell({ type, size, control = 'checkbox', checked, onCheckedChange, label, meta, avatar, trailingIcon, chip, status, progress, trend, input, dropdown, textArea, children, disabled }: DataGridFormCellProps) {
  const ctx = useContext(SizeContext);
  const s = size ?? ctx;
  const m = dataGridMetrics[s];
  const trail = trailingIcon ? <Box sx={{ display: 'inline-flex', flex: 'none', marginLeft: 'auto', '& svg': { fontSize: 16 } }}>{trailingIcon}</Box> : null;
  switch (type) {
    case 'radioCheckbox':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: `${m.gap}px`, minWidth: 0 }}>
          {control === 'radio' ? (
            <Radio size={s} checked={checked} onChange={(_, v) => onCheckedChange?.(v)} disabled={disabled} slotProps={{ input: { 'aria-label': 'Select row' } }} />
          ) : (
            <Checkbox size={s} checked={checked} onChange={(_, v) => onCheckedChange?.(v)} disabled={disabled} slotProps={{ input: { 'aria-label': 'Select row' } }} />
          )}
          {avatar}
          {label && <DataGridTextCell primary={label} secondary={meta} size={s} />}
        </Box>
      );
    case 'chip':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: `${m.gap}px`, width: '100%' }}>
          {chip && <Chip size="xsmall" {...chip} />}
          {trail}
        </Box>
      );
    case 'status':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: `${m.gap}px`, width: '100%' }}>
          {status && <Status type="chip" {...status} />}
          {trail}
        </Box>
      );
    case 'progress':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: `${m.gap}px`, width: '100%' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}><ProgressBar label="right" {...progress} /></Box>
          {trail}
        </Box>
      );
    case 'input':
      return <Box sx={{ width: '100%' }}><TextField fullWidth size={s} {...input} /></Box>;
    case 'dropdown':
      return <Box sx={{ width: '100%' }}><Select fullWidth size={s} options={[]} {...dropdown} /></Box>;
    case 'textArea':
      return <Box sx={{ width: '100%' }}><TextArea fullWidth size={s} {...textArea} /></Box>;
    case 'trendLine':
      return <TrendLine height={12} width={128} {...trend} />;
    case 'buttons':
    case 'slot':
    case 'tree':
      return <Box sx={{ display: 'flex', alignItems: 'center', gap: `${m.gap}px`, width: '100%', minWidth: 0 }}>{children}</Box>;
  }
}

/* ---------------------------------------------------------- header cell */

export interface DataGridHeaderCellProps {
  title: ReactNode;
  /** Figma Type: Default (title with sort) or Filter (a filter field under 8px padding, 56px at Medium). */
  type?: 'default' | 'filter';
  size?: DataGridSize;
  /** BackGroundFill = Yes: filled #1e3a6e header with white text. @default false */
  filled?: boolean;
  /** Interaction: Default / Hover share one look in Figma; Disabled is 38% opacity. */
  disabled?: boolean;
  width?: number | string;
  /** Sort / menu icon buttons (two Xsmall IconButtons in Figma). */
  actions?: ReactNode;
  filterProps?: TextFieldProps;
}

/** DataGrid_Header: title (12/20) + sort icons, or a filter field. */
export function DataGridHeaderCell({ title, type = 'default', size, filled = false, disabled, width = 280, actions, filterProps }: DataGridHeaderCellProps) {
  const ctx = useContext(SizeContext);
  const m = dataGridMetrics[size ?? ctx];
  const filter = type === 'filter';
  return (
    <Box
      data-spec={`header-${size ?? ctx}-${type}${filled ? '-filled' : ''}`}
      sx={{
        boxSizing: 'border-box',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        width,
        height: filter ? undefined : m.header,
        padding: `${m.headerPadY}px ${m.headerPadX}px`,
        background: filled && !filter ? c.headerFilledBg : c.headerBg,
        borderBottom: filter ? `1px solid ${c.border}` : undefined,
        color: filled && !filter ? '#ffffff' : c.headerText,
        opacity: disabled ? disabledOpacity : 1,
        '&::after': { content: '""', position: 'absolute', right: 0, top: '50%', height: 16, marginTop: '-8px', width: '1px', background: filled ? c.headerFilledDivider : c.headerDivider },
      }}
    >
      {filter ? (
        <Box sx={{ flex: 1, minWidth: 0 }}><TextField fullWidth size="medium" placeholder={typeof title === 'string' ? title : undefined} disabled={disabled} {...filterProps} /></Box>
      ) : (
        <>
          <Box sx={{ flex: 1, minWidth: 0, fontSize: 12, lineHeight: '20px', ...lineStyle }}>{title}</Box>
          {actions}
        </>
      )}
    </Box>
  );
}


