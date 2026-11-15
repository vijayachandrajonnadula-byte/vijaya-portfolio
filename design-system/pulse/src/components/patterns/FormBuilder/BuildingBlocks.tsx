/**
 * Figma page "Form Builder", small building-block sets:
 *   .Building Blocks/formBuilder-CompResizer (Types = Square Resizer | Move)       6x6 white square / 8x8 move glyph
 *   .Building Blocks/formBuilder-ColumnRowResizer (Type = Column Resizer | Row Resize)  16x80 / 80x16, 16px resize glyph
 *   .Building Blocks/formBuilder-CellCountSelection (Interaction = Default | Hover)   16x16 r=2 cell
 *   .Building Blocks/TableCellCountSelection                                          label + wrapping 16px cells, gap 4
 *   Building Blocks/expandCollapse                                                    24px round handle on the panel edge
 *   Buttoned Tabs (States = Default | Hover | Active | Focus | Disabled)              64x64 r=4, icon + 12px label
 *   .Building Blocks/template-types (Blank | 2 Column | 2 Column + Header | 3 Column | 3 Column + Header | Header with Right Panel)
 *   .Building Blocks/formBuilder-HeaderComp-Style (4 styles x Default | Hover | Selected)   320x40 r=4
 * Resizer fill and hover colours come from the spec (#3b82f6 selection, #32c1e0 hover, #d0d6e4 borders).
 */
import { fw } from '../../../theme/typography';
import type { ReactNode } from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import OpenWithRounded from '@mui/icons-material/OpenWithRounded';
import UnfoldMoreRounded from '@mui/icons-material/UnfoldMoreRounded';
import { Button } from '../../actions/Button/Button';
import { Radio } from '../../form/Radio/Radio';
import { disabledOpacity, focusRing, pt } from '../../../theme/pulseTokens';

const formBuilderBorder = '#d0d6e4';
const formBuilderHover = '#f1f1f2';
const formBuilderSelect = '#32c1e0';
const selection = '#3b82f6';

/* ------------------------------------------------------------------ resizers */

export interface CompResizerProps {
  /** @default "square" */
  type?: 'square' | 'move';
}

/** Corner handle (square, 6x6 white with a 1px #3b82f6 edge) or the move handle (8x8). */
export function CompResizer({ type = 'square' }: CompResizerProps) {
  if (type === 'move') {
    return (
      <Box data-spec="comp-resizer move" aria-hidden sx={{ width: 8, height: 8, boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff', outline: `1px solid ${selection}`, color: selection, '& svg': { fontSize: 8 } }}>
        <OpenWithRounded />
      </Box>
    );
  }
  return <Box data-spec="comp-resizer square" aria-hidden sx={{ width: 6, height: 6, boxSizing: 'border-box', bgcolor: '#fff', outline: `1px solid ${selection}` }} />;
}

export interface ColumnRowResizerProps {
  /** @default "column" */
  type?: 'column' | 'row';
}

/** Table column / row drag handle: 16x80 (column) or 80x16 (row) strip with a 16px resize glyph. */
export function ColumnRowResizer({ type = 'column' }: ColumnRowResizerProps) {
  const column = type === 'column';
  return (
    <Box
      data-spec={`resizer ${type}`}
      aria-hidden
      sx={{ width: column ? 16 : 80, height: column ? 80 : 16, boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', p: column ? '4px 0' : '0 4px', bgcolor: selection, color: '#fff', borderRadius: pt.radius.xs, cursor: column ? 'col-resize' : 'row-resize', '& svg': { fontSize: 16, transform: column ? 'none' : 'rotate(90deg)' } }}
    >
      <UnfoldMoreRounded sx={{ transform: column ? 'rotate(90deg)' : 'none' }} />
    </Box>
  );
}

/* --------------------------------------------------------- table cell count */

export interface CellCountCellProps {
  /** @default "default" */
  interaction?: 'default' | 'hover';
  onMouseEnter?: () => void;
  onClick?: () => void;
  ariaLabel?: string;
}

/** One 16x16 cell of the table size picker. */
export function CellCountCell({ interaction = 'default', onMouseEnter, onClick, ariaLabel }: CellCountCellProps) {
  const hover = interaction === 'hover';
  return (
    <ButtonBase
      data-spec={`cell-count ${interaction}`}
      aria-label={ariaLabel}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      sx={{ width: 16, height: 16, boxSizing: 'border-box', borderRadius: '2px', bgcolor: hover ? '#eff6ff' : '#f1f5f9', border: `1px solid ${hover ? selection : '#cbd5e1'}`, '&:hover': { bgcolor: '#eff6ff', borderColor: selection }, '&.Mui-focusVisible': { boxShadow: focusRing } }}
    />
  );
}

export interface TableCellCountSelectionProps {
  /** Number of columns in the picker. @default 10 */
  columns?: number;
  /** Number of rows in the picker. @default 8 */
  rows?: number;
  onSelect?: (rows: number, columns: number) => void;
  /** Initial hovered size for static display. */
  highlight?: { rows: number; columns: number };
}

/** Grid picker: hovering a cell highlights every cell from the top-left up to it; the label reads "rows x columns". */
export function TableCellCountSelection({ columns = 10, rows = 8, onSelect, highlight }: TableCellCountSelectionProps) {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(highlight ? { r: highlight.rows, c: highlight.columns } : null);
  return (
    <Box data-spec="table-cell-count" onMouseLeave={() => !highlight && setHover(null)} sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: columns * 20 - 4 }}>
      <Box sx={{ fontSize: 12, lineHeight: '20px', color: pt.colors.neutral[900] }}>{hover ? `${hover.r} x ${hover.c}` : 'Select table size'}</Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {Array.from({ length: rows * columns }, (_, i) => {
          const r = Math.floor(i / columns) + 1;
          const c = (i % columns) + 1;
          return (
            <CellCountCell key={i} ariaLabel={`${r} rows by ${c} columns`} interaction={hover && r <= hover.r && c <= hover.c ? 'hover' : 'default'} onMouseEnter={() => setHover({ r, c })} onClick={() => onSelect?.(r, c)} />
          );
        })}
      </Box>
    </Box>
  );
}

/* ----------------------------------------------------------- expand / collapse */

export interface ExpandCollapseHandleProps {
  /** Arrow direction (Figma Variant Left | Right). @default "left" */
  direction?: 'left' | 'right';
  onClick?: () => void;
  ariaLabel?: string;
}

/** 24px round white handle with a #d9dbdd border that sits on the edge of a side panel. */
export function ExpandCollapseHandle({ direction = 'left', onClick, ariaLabel = direction === 'left' ? 'Collapse panel' : 'Expand panel' }: ExpandCollapseHandleProps) {
  return (
    <ButtonBase
      data-spec={`expand-collapse ${direction}`}
      aria-label={ariaLabel}
      onClick={onClick}
      sx={{ width: 24, height: 24, boxSizing: 'border-box', borderRadius: '50%', bgcolor: '#fff', border: '1px solid #d9dbdd', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', color: pt.colors.neutral[900], '& svg': { fontSize: 16 }, '&.Mui-focusVisible': { boxShadow: focusRing } }}
    >
      {direction === 'left' ? <ChevronLeftRounded /> : <ChevronRightRounded />}
    </ButtonBase>
  );
}

/* -------------------------------------------------------------- buttoned tabs */

export interface ButtonedTabProps {
  label: string;
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  /** Force a state for documentation. */
  forceState?: 'hover' | 'focus';
  onClick?: () => void;
}

/** 64x64 icon tab used to switch panel pages. Default / Hover / Active / Focus / Disabled. */
export function ButtonedTab({ label, icon, active, disabled, forceState, onClick }: ButtonedTabProps) {
  const hover = { bgcolor: '#f3f4f8' };
  const focus = { boxShadow: `0 0 0 1px #fff, 0 0 0 3px ${formBuilderSelect}` };
  return (
    <ButtonBase
      data-spec={`buttoned-tab ${disabled ? 'disabled' : active ? 'active' : forceState ?? 'default'}`}
      role="tab"
      aria-selected={Boolean(active)}
      disabled={disabled}
      onClick={onClick}
      sx={{ width: 64, height: 64, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', borderRadius: pt.radius.xs, bgcolor: active ? '#e6e9f1' : 'transparent', color: pt.colors.brand[500], opacity: disabled ? disabledOpacity : 1, '& svg': { fontSize: 24, color: '#090909' }, '&:hover': active ? undefined : hover, '&.Mui-focusVisible': focus, ...(forceState === 'hover' ? hover : {}), ...(forceState === 'focus' ? focus : {}) }}
    >
      {icon}
      <Box component="span" sx={{ fontSize: 12, lineHeight: '20px', fontWeight: fw.medium }}>{label}</Box>
    </ButtonBase>
  );
}

/* ------------------------------------------------------------- template types */

export type TemplateType = 'blank' | 'twoColumn' | 'twoColumnHeader' | 'threeColumn' | 'threeColumnHeader' | 'headerRightPanel';

export const templateTypes: { type: TemplateType; label: string }[] = [
  { type: 'blank', label: 'Blank Template' },
  { type: 'twoColumn', label: '2 Column' },
  { type: 'twoColumnHeader', label: '2 Column with Header' },
  { type: 'threeColumn', label: '3 Column' },
  { type: 'threeColumnHeader', label: '3 Column with Header' },
  { type: 'headerRightPanel', label: 'Header, 2 Column with Right Panel' },
];

const tplBlock = (extra?: object) => ({ bgcolor: '#fff', border: `1px solid ${formBuilderBorder}`, boxSizing: 'border-box' as const, ...extra });
const tplHeader = { height: 16, bgcolor: formBuilderHover, border: `1px solid ${formBuilderBorder}`, borderRadius: '4px', boxSizing: 'border-box' as const, alignSelf: 'stretch' };

function TemplateColumns({ n }: { n: 2 | 3 }) {
  return (
    <Box sx={{ display: 'flex', alignSelf: 'stretch', height: 16 }}>
      {Array.from({ length: n }, (_, i) => (
        <Box key={i} sx={{ ...tplBlock(), flex: 1, borderRadius: i === 0 ? '4px 0 0 4px' : i === n - 1 ? '0 4px 4px 0' : 0, borderLeftWidth: i === 0 ? 1 : 0 }} />
      ))}
    </Box>
  );
}

export interface TemplateTypeCardProps {
  type: TemplateType;
  selected?: boolean;
  onAdd?: (type: TemplateType) => void;
}

/** Template picker card: 100x120 preview card (r=4, #d0d6e4 border, shadow) with an "Add" button and the template name below. */
export function TemplateTypeCard({ type, selected, onAdd }: TemplateTypeCardProps) {
  const label = templateTypes.find((t) => t.type === type)?.label ?? type;
  const body = {
    blank: null,
    twoColumn: <TemplateColumns n={2} />,
    twoColumnHeader: (<><Box sx={tplHeader} /><TemplateColumns n={2} /></>),
    threeColumn: <TemplateColumns n={3} />,
    threeColumnHeader: (<><Box sx={tplHeader} /><TemplateColumns n={3} /></>),
    headerRightPanel: (
      <Box sx={{ display: 'flex', gap: '4px', alignSelf: 'stretch', height: 36 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}><Box sx={tplHeader} /><TemplateColumns n={2} /></Box>
        <Box sx={{ ...tplHeader, width: 16, height: 36 }} />
      </Box>
    ),
  }[type];
  return (
    <Box data-spec={`template ${type}`} sx={{ width: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <Box sx={{ position: 'relative', width: 100, height: 120, boxSizing: 'border-box', p: '8px', display: 'flex', flexDirection: 'column', justifyContent: type === 'blank' ? 'center' : undefined, alignItems: type === 'blank' ? 'center' : undefined, gap: '4px', borderRadius: pt.radius.xs, bgcolor: '#fff', border: `1px solid ${selected ? formBuilderSelect : formBuilderBorder}`, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        {body}
        <Box sx={{ position: 'absolute', left: 14.5, top: 80 }}>
          <Button size="small" variant="text" onClick={() => onAdd?.(type)}>Add</Button>
        </Box>
      </Box>
      <Box sx={{ alignSelf: 'stretch', fontSize: 12, lineHeight: '20px', color: pt.colors.neutral[900] }}>{label}</Box>
    </Box>
  );
}

/* --------------------------------------------------------- header style choice */

export type HeaderStyleType = 'logoTitlePageNumber' | 'datePageNumberLogo' | 'headingDateTime' | 'blank';

export const headerStyles: { type: HeaderStyleType; parts: string[] }[] = [
  { type: 'logoTitlePageNumber', parts: ['Logo', 'Heading', 'Page Number'] },
  { type: 'datePageNumberLogo', parts: ['Date', 'Page Number', 'Logo'] },
  { type: 'headingDateTime', parts: ['Heading', 'Date & Time'] },
  { type: 'blank', parts: [] },
];

export interface HeaderStyleOptionProps {
  type: HeaderStyleType;
  selected?: boolean;
  /** Force the hover look for documentation. */
  hover?: boolean;
  onSelect?: () => void;
}

/** Selectable header layout row (320x40, r=4): radio + the parts of the header. Hover fills #f1f1f2, Selected has a #32c1e0 border. */
export function HeaderStyleOption({ type, selected, hover, onSelect }: HeaderStyleOptionProps) {
  const style = headerStyles.find((s) => s.type === type);
  const hoverStyle = { bgcolor: formBuilderHover };
  return (
    <Box
      data-spec={`header-style ${type} ${selected ? 'selected' : hover ? 'hover' : 'default'}`}
      role="radio"
      aria-checked={Boolean(selected)}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(); } }}
      sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: 320, height: 40, boxSizing: 'border-box', p: '4px 16px 4px 4px', borderRadius: pt.radius.xs, cursor: 'pointer', position: 'relative', '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', border: `1px solid ${selected ? formBuilderSelect : formBuilderBorder}`, pointerEvents: 'none' }, '&:hover': hoverStyle, '&:focus-visible': { boxShadow: focusRing, outline: 'none' }, ...(hover ? hoverStyle : {}) }}
    >
      <Radio size="small" checked={Boolean(selected)} onChange={() => onSelect?.()} slotProps={{ input: { 'aria-label': type, tabIndex: -1 } }} />
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', height: 24, minWidth: 0 }}>
        {style?.parts.map((p) => (
          <Box key={p} component="span" sx={{ fontSize: p === 'Heading' ? 14 : 12, lineHeight: p === 'Heading' ? '24px' : '20px', fontWeight: p === 'Heading' ? fw.semiBold : fw.medium, color: pt.colors.neutral[900], whiteSpace: 'nowrap' }}>{p}</Box>
        ))}
      </Box>
    </Box>
  );
}
