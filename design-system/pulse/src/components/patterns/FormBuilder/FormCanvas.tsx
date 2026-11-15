/**
 * Figma page "Form Builder": "BuildingBlocks/FormField" (Type = Default | Selected; 460x65, pad 8, r=2, white;
 * Selected: 1px #3b82f6 OUTSIDE + four 6x6 white square resizers on the corners) and the hover/selected
 * overlays of ".Building Blocks/formBuilder-formfields": 1px #32c1e0 outline, component name above the field
 * (secondary 12/20), floating toolbar (64x32: duplicate + delete, fill #f1f1f2, drop(0,2,8,0,#00000026)) above its right edge, drag handle 32px to the left.
 * FormCanvas accepts drops from FieldPalette (native drag and drop) and reorders fields with the drag handle (MOVE_MIME).
 */
import { useState } from 'react';
import type { DragEvent } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import DragIndicatorRounded from '@mui/icons-material/DragIndicatorRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import { IconButton } from '../../actions/IconButton/IconButton';
import { CompResizer } from './BuildingBlocks';
import { FieldPreview } from './FieldPreview';
import { PALETTE_MIME, fieldTypeLabel } from './types';
import type { FormBuilderField, FormFieldType } from './types';
import { pt } from '../../../theme/pulseTokens';

const selectedColor = '#3b82f6';
const hoverColor = '#32c1e0';
/** Native drag payload used by the drag handle to reorder fields inside the canvas. */
export const MOVE_MIME = 'application/x-pulse-form-move';

export interface FormFieldFrameProps {
  field: FormBuilderField;
  selected?: boolean;
  onSelect?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  /** Drag-handle drag start (reordering). The handle is only shown while selected. */
  onHandleDragStart?: (e: DragEvent<HTMLElement>) => void;
}

/** One field on the canvas: preview inside the Default / Selected frame (BuildingBlocks/FormField). */
export function FormFieldFrame({ field, selected, onSelect, onDuplicate, onDelete, onHandleDragStart }: FormFieldFrameProps) {
  const ring = selected ? `1px solid ${selectedColor}` : '1px solid transparent';
  return (
    <Box
      data-spec={`form-field ${selected ? 'selected' : 'default'}`}
      role="group"
      aria-label={`${fieldTypeLabel(field.type)}: ${field.label}`}
      aria-selected={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onSelect?.(); } }}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        p: '8px',
        borderRadius: '2px',
        bgcolor: '#fff',
        outline: ring,
        cursor: 'pointer',
        '&:hover': selected ? undefined : { outline: `1px solid ${hoverColor}` },
        '&:focus-visible': { boxShadow: pt.shadow.focusStyle_1, outline: ring },
      }}
    >
      {selected && (
        <>
          <Box sx={{ position: 'absolute', left: -3, top: -3 }}><CompResizer /></Box>
          <Box sx={{ position: 'absolute', right: -3, top: -3 }}><CompResizer /></Box>
          <Box sx={{ position: 'absolute', left: -3, bottom: -3 }}><CompResizer /></Box>
          <Box sx={{ position: 'absolute', right: -3, bottom: -3 }}><CompResizer /></Box>
          <Box sx={{ position: 'absolute', left: 0, top: -22, fontSize: 12, lineHeight: '20px', color: pt.colors.neutral[500] }}>{fieldTypeLabel(field.type)}</Box>
          <Box
            sx={{ position: 'absolute', left: -32, top: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box draggable aria-label="Drag to reorder" role="button" onDragStart={onHandleDragStart} sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: pt.radius.xs, cursor: 'grab', color: '#090909', '& svg': { fontSize: 16 }, '&:hover': { bgcolor: pt.uiElements.closeButton.color.darkHoverBG } }}>
              <DragIndicatorRounded />
            </Box>
          </Box>
          <Box
            sx={{ position: 'absolute', right: 0, top: -36, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: 32, borderRadius: pt.radius.xs, bgcolor: '#f1f1f2', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton ariaLabel="Duplicate field" size="small" onClick={onDuplicate as never}><ContentCopyRounded /></IconButton>
            <IconButton ariaLabel="Delete field" size="small" color="error" shape="circle" onClick={onDelete as never}><DeleteOutlineRounded /></IconButton>
          </Box>
        </>
      )}
      <FieldPreview field={field} />
    </Box>
  );
}
export interface FormCanvasProps {
  fields: FormBuilderField[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  /** Receives the new field list on reorder / delete. */
  onFieldsChange?: (fields: FormBuilderField[]) => void;
  /** A palette item was dropped at `index`. */
  onDropField?: (type: FormFieldType, index: number) => void;
  sx?: SxProps<Theme>;
}

/** Drop surface for the form being built. */
export function FormCanvas({ fields, selectedId, onSelect, onFieldsChange, onDropField, sx }: FormCanvasProps) {
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const accepts = (e: DragEvent) => { const types = Array.from(e.dataTransfer.types); return types.includes(PALETTE_MIME) || types.includes(MOVE_MIME); };
  const dropAt = (e: DragEvent, index: number) => {
    setOverIndex(null);
    const from = e.dataTransfer.getData(MOVE_MIME);
    if (from !== '') {
      e.preventDefault();
      e.stopPropagation();
      const fromIndex = Number(from);
      const item = fields[fromIndex];
      if (!item) return;
      const next = fields.slice();
      next.splice(fromIndex, 1);
      next.splice(index > fromIndex ? index - 1 : index, 0, item);
      onFieldsChange?.(next);
      return;
    }
    const type = e.dataTransfer.getData(PALETTE_MIME) as FormFieldType;
    if (type) { e.preventDefault(); e.stopPropagation(); onDropField?.(type, index); }
  };
  const duplicate = (i: number) => {
    const src = fields[i];
    if (!src) return;
    const next = fields.slice();
    next.splice(i + 1, 0, { ...src, id: `${src.id}-copy-${Date.now().toString(36)}`, name: src.name ? `${src.name}_copy` : undefined });
    onFieldsChange?.(next);
  };  const indicator = (i: number) => (
    <Box key={`ind${i}`} aria-hidden sx={{ height: 2, my: '-1px', bgcolor: overIndex === i ? '#32c1e0' : 'transparent', borderRadius: 1 }} />
  );
  return (
    <Box
      data-spec="form-canvas"
      onClick={() => onSelect?.(null)}
      onDragOver={(e) => { if (accepts(e)) { e.preventDefault(); if (overIndex === null) setOverIndex(fields.length); } }}
      onDragLeave={(e) => { if (e.currentTarget === e.target) setOverIndex(null); }}
      onDrop={(e) => dropAt(e, fields.length)}
      sx={[{ display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box', minHeight: 240, p: '24px', pt: '48px', bgcolor: '#fff', border: `1px solid ${pt.colors.neutral[200]}`, borderRadius: pt.radius.xs }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>}
    >
      {fields.length === 0 && (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160, border: `1px dashed ${pt.colors.neutral[300]}`, borderRadius: pt.radius.m, fontSize: 12, lineHeight: '20px', color: pt.colors.neutral[500], bgcolor: overIndex === 0 || overIndex === fields.length ? pt.colors.brand[25] : 'transparent' }}>
          Drag a field here or click one in the palette
        </Box>
      )}
      {fields.map((f, i) => (
        <Box key={f.id} onDragOver={(e) => { if (accepts(e)) { e.preventDefault(); e.stopPropagation(); setOverIndex(i); } }} onDrop={(e) => dropAt(e, i)}>
          {indicator(i)}
          <Box sx={{ mt: selectedId === f.id ? '22px' : 0 }}>
            <FormFieldFrame
              field={f}
              selected={selectedId === f.id}
              onSelect={() => onSelect?.(f.id)}
              onDuplicate={() => duplicate(i)}
              onHandleDragStart={(e) => { e.dataTransfer.setData(MOVE_MIME, String(i)); e.dataTransfer.effectAllowed = 'move'; }}
              onDelete={() => { onFieldsChange?.(fields.filter((x) => x.id !== f.id)); onSelect?.(null); }}
            />
          </Box>
        </Box>
      ))}
      {fields.length > 0 && indicator(fields.length)}
    </Box>
  );
}
