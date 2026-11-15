/**
 * Figma page "Form Builder": panel type "Add Fields" (360x812, right border #d0d6e4, pad 16/24, gap 16) and
 * ".Building Blocks/formBuilder-ComponentList-Styles" (States = Default | Hover | Favourite | Start Drag | Dragging Card, 200x48 / 296x48).
 * Item: r=4, grip button 32 + type icon tile 32 (fill #00000008) + label; hover fill #f1f1f2;
 * dragging: 2px dashed #32c1e0 + drop(0,2,8,0,#00000026). Accordion header: 32px, fill #d0d6e4, r 4/4/0/0, body border #d0d6e4.
 * Items are native-draggable (payload type PALETTE_MIME) so they can be dropped on FormCanvas.
 */
import { fw } from '../../../theme/typography';
import { useState } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import DragIndicatorRounded from '@mui/icons-material/DragIndicatorRounded';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import StarBorderRounded from '@mui/icons-material/StarBorderRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import { TextField } from '../../form/TextField/TextField';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Tab, Tabs } from '../../navigation/Tabs/Tabs';
import { ExpandCollapseHandle, TemplateTypeCard, templateTypes } from './BuildingBlocks';
import type { TemplateType } from './BuildingBlocks';
import { fieldIcons } from './FieldIcons';
import { FIELD_TYPES, PALETTE_MIME } from './types';
import type { FieldTypeInfo, FormFieldType } from './types';
import { scrollBarSx } from '../../data-display/ScrollBar/ScrollBar';
import { pt } from '../../../theme/pulseTokens';

export const formBuilderBorder = '#d0d6e4';
const hoverFill = '#f1f1f2';

export interface PaletteItemProps {
  info: FieldTypeInfo;
  favourite?: boolean;
  onToggleFavourite?: () => void;
  onAdd?: (type: FormFieldType) => void;
}

/** One draggable card of the palette. Clicking/Enter adds the field without dragging. */
export function PaletteItem({ info, favourite, onToggleFavourite, onAdd }: PaletteItemProps) {
  const [dragging, setDragging] = useState(false);
  return (
    <Box
      data-spec={`palette-item ${dragging ? 'dragging' : 'default'}`}
      draggable
      tabIndex={0}
      role="button"
      aria-label={`Add ${info.label}`}
      onDragStart={(e) => { e.dataTransfer.setData(PALETTE_MIME, info.type); e.dataTransfer.setData('text/plain', info.type); e.dataTransfer.effectAllowed = 'copy'; setDragging(true); }}
      onDragEnd={() => setDragging(false)}
      onClick={() => onAdd?.(info.type)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAdd?.(info.type); } }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        boxSizing: 'border-box',
        height: 48,
        pr: '8px',
        borderRadius: pt.radius.xs,
        bgcolor: '#fff',
        border: dragging ? '2px dashed #32c1e0' : '2px solid transparent',
        boxShadow: dragging ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
        cursor: 'grab',
        '& .fav': { visibility: favourite ? 'visible' : 'hidden' },
        '&:hover': { bgcolor: hoverFill, '& .fav': { visibility: 'visible' } },
        '&:focus-visible': { outline: 'none', boxShadow: pt.shadow.focusStyle_1 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', pl: 0 }}>
        <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: pt.colors.neutral[500], '& svg': { fontSize: 16 } }}><DragIndicatorRounded /></Box>
        <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: pt.radius.xs, bgcolor: 'rgba(0,0,0,0.03)', color: pt.colors.brand[500], '& svg': { fontSize: 16 } }}>{fieldIcons[info.type]}</Box>
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, pl: '4px', fontSize: 12, lineHeight: '20px', fontWeight: fw.semiBold, color: pt.colors.neutral[900], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{info.label}</Box>
      {onToggleFavourite && (
        <Box className="fav" onClick={(e) => e.stopPropagation()} sx={{ display: 'flex' }}>
          <IconButton ariaLabel={favourite ? `Remove ${info.label} from favourites` : `Add ${info.label} to favourites`} size="xsmall" onClick={onToggleFavourite as never}>
            {favourite ? <StarRounded /> : <StarBorderRounded />}
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

/** Accordion section with the Figma fill header. */
export function PanelSection({ title, children, defaultOpen = true }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box>
      <Box
        component="button"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 32, boxSizing: 'border-box', px: '12px', py: '6px', border: 0, bgcolor: formBuilderBorder, borderRadius: open ? '4px 4px 0 0' : '4px', font: 'inherit', fontSize: 12, lineHeight: '20px', fontWeight: fw.semiBold, color: pt.colors.neutral[900], cursor: 'pointer', textAlign: 'left', '&:focus-visible': { outline: 'none', boxShadow: pt.shadow.focusStyle_1 } }}
      >
        {title}
        <KeyboardArrowDownRounded sx={{ fontSize: 16, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
      </Box>
      {open && <Box sx={{ border: `1px solid ${formBuilderBorder}`, borderTop: 0, borderRadius: '0 0 6px 6px', p: '8px' }}>{children}</Box>}
    </Box>
  );
}

export interface FieldPaletteProps {
  /** Called when a palette item is clicked (the drag path is handled by FormCanvas). */
  onAdd?: (type: FormFieldType) => void;
  /** Called when a template card's "Add" is pressed (Templates tab). */
  onAddTemplate?: (type: TemplateType) => void;
  /** @default 360 */
  width?: number | string;
  /** Collapse handle on the panel edge (Figma Building Blocks/expandCollapse). */
  onCollapse?: () => void;
  sx?: SxProps<Theme>;
}

/** "Add Fields" panel (Figma panel-types / Add Fields): underline tabs, search, Favorite and "all Component list" accordions, collapse handle. */
export function FieldPalette({ onAdd, onAddTemplate, width = 360, onCollapse, sx }: FieldPaletteProps) {
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState('');
  const [favs, setFavs] = useState<FormFieldType[]>([]);
  const toggle = (t: FormFieldType) => setFavs((f) => (f.includes(t) ? f.filter((x) => x !== t) : [...f, t]));
  const q = query.trim().toLowerCase();
  const filtered = FIELD_TYPES.filter((f) => !q || f.label.toLowerCase().includes(q));
  const favItems = FIELD_TYPES.filter((f) => favs.includes(f.type));
  const item = (info: FieldTypeInfo) => <PaletteItem key={info.type} info={info} favourite={favs.includes(info.type)} onToggleFavourite={() => toggle(info.type)} onAdd={onAdd} />;
  return (
    <Box
      data-spec="field-palette"
      component="aside"
      aria-label="Add fields"
      sx={[{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box', width, height: '100%', minHeight: 0, p: '16px 24px', overflowY: 'auto', bgcolor: '#fff', borderRight: `1px solid ${formBuilderBorder}` }, scrollBarSx(), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>}
    >
      {onCollapse && <Box sx={{ position: 'absolute', right: 8, top: 44, zIndex: 1 }}><ExpandCollapseHandle direction="left" onClick={onCollapse} /></Box>}
      <Tabs value={tab} handleChange={(_: SyntheticEvent, v: number) => setTab(v)} size="small">
        <Tab index={0} label="Add Fields" />
        <Tab index={1} label="Templates" />
      </Tabs>
      {tab === 0 ? (
        <>
          <TextField size="small" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} startAdornment={<SearchRounded sx={{ fontSize: 16 }} />} inputProps={{ 'aria-label': 'Search fields' }} />
          {favItems.length > 0 && !q && (
            <PanelSection title="Favorite">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>{favItems.map(item)}</Box>
            </PanelSection>
          )}
          {filtered.length > 0 && (
            <PanelSection title="all Component list">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>{filtered.map(item)}</Box>
            </PanelSection>
          )}
          {filtered.length === 0 && <Box sx={{ fontSize: 12, lineHeight: '20px', color: pt.colors.neutral[500] }}>No fields match "{query}"</Box>}
        </>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px' }}>
          {templateTypes.map((t) => <TemplateTypeCard key={t.type} type={t.type} onAdd={onAddTemplate} />)}
        </Box>
      )}
    </Box>
  );
}