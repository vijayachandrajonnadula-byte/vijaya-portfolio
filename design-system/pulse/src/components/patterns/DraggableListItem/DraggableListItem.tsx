/**
 * Figma page "DraggableListItem": sets "draggableListItem" (276x50) and "draggableListItemProcessMap" (276x80),
 * Interaction = Default | Hover | Ghost | Dragged. Native HTML5 drag and drop, no dependencies.
 *   Default  white, 1px neutral/200 border, r=4, pad 8/12, gap 8
 *   Hover    fill neutral/75 (#f4f7fa)
 *   Ghost    the in-place copy while another one is dragged: opacity 0.38
 *   Dragged  2px dashed brand/500 border (+ drop(0,2,4,0,#0000001a) on the process-map variant)
 * DraggableList wraps a set of items and reorders them as one is dragged over another.
 */
import { fw } from '../../../theme/typography';
import { useState } from 'react';
import type { DragEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import DragIndicatorRounded from '@mui/icons-material/DragIndicatorRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { pt, disabledOpacity } from '../../../theme/pulseTokens';

export type DraggableListItemInteraction = 'default' | 'hover' | 'ghost' | 'dragged';

export interface DraggableListItemProps {
  /** Primary line (Inter Medium 12/20). */
  label: ReactNode;
  /** Meta-data line(s) (14/20 in Figma spec, 12px secondary here, see note below). A string[] renders several lines. */
  metaData?: ReactNode | ReactNode[];
  /** Leading icon (16px) or, with `processMap`, a 40x48 image/equipment illustration. */
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Shows the info adornment (20px dark circle) with this tooltip text. */
  info?: string;
  /** Taller process-map variant (80px, multi-line meta). */
  processMap?: boolean;
  /** Force an interaction look (documentation); otherwise driven by hover and drag state. */
  interaction?: DraggableListItemInteraction;
  /** @default true */
  draggable?: boolean;
  onDragStart?: (e: DragEvent<HTMLElement>) => void;
  onDragEnd?: (e: DragEvent<HTMLElement>) => void;
  onDragOver?: (e: DragEvent<HTMLElement>) => void;
  onDrop?: (e: DragEvent<HTMLElement>) => void;
  width?: number | string;
  sx?: SxProps<Theme>;
}

const border = pt.colors.neutral[200];
const hoverBg = pt.colors.neutral[75];
const brand = pt.colors.brand[500];

export function DraggableListItem({ label, metaData, leftIcon, rightIcon, info, processMap, interaction, draggable = true, onDragStart, onDragEnd, onDragOver, onDrop, width, sx }: DraggableListItemProps) {
  const [dragging, setDragging] = useState(false);
  const state = interaction ?? (dragging ? 'dragged' : 'default');
  const metaLines = Array.isArray(metaData) ? metaData : metaData ? [metaData] : [];
  return (
    <Box
      data-spec={`draggable-list-item ${state}`}
      draggable={draggable}
      onDragStart={(e: DragEvent<HTMLElement>) => { setDragging(true); e.dataTransfer.effectAllowed = 'move'; onDragStart?.(e); }}
      onDragEnd={(e: DragEvent<HTMLElement>) => { setDragging(false); onDragEnd?.(e); }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxSizing: 'border-box',
          width: width ?? '100%',
          minHeight: processMap ? 80 : 50,
          px: state === 'dragged' ? '10px' : '11px',
          py: state === 'dragged' ? '6px' : '7px',
          borderRadius: pt.radius.xs,
          bgcolor: state === 'hover' ? hoverBg : '#fff',
          border: state === 'dragged' ? `2px dashed ${brand}` : `1px solid ${border}`,
          boxShadow: state === 'dragged' && processMap ? pt.shadow.shadowSm : 'none',
          opacity: state === 'ghost' ? disabledOpacity : 1,
          cursor: draggable ? 'grab' : 'default',
          '&:hover': state === 'default' ? { bgcolor: hoverBg } : undefined,
          '&:active': draggable ? { cursor: 'grabbing' } : undefined,
          userSelect: 'none',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ] as SxProps<Theme>}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 32, color: pt.colors.neutral[500], '& svg': { fontSize: 16 } }}>
        <DragIndicatorRounded />
      </Box>
      {leftIcon && <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...(processMap ? { width: 40, height: 64 } : { width: 16, height: 32, '& svg': { fontSize: 16 } }) }}>{leftIcon}</Box>}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Box sx={{ fontSize: 12, lineHeight: '20px', fontWeight: fw.medium, color: pt.colors.neutral[900], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: processMap ? 'normal' : 'nowrap' }}>{label}</Box>
        {metaLines.map((m, i) => (
          <Box key={i} sx={{ fontSize: 12, lineHeight: '18px', mt: '-4px', color: pt.colors.neutral[500], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: processMap ? 'normal' : 'nowrap' }}>{m}</Box>
        ))}
      </Box>
      {rightIcon && <Box sx={{ display: 'flex', alignItems: 'center', width: 16, flexShrink: 0, '& svg': { fontSize: 16 } }}>{rightIcon}</Box>}
      {info && (
        <Box role="img" aria-label={info} title={info} sx={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, bgcolor: pt.colors.neutral[800], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { fontSize: 14 } }}>
          <InfoOutlined />
        </Box>
      )}
    </Box>
  );
}

export interface DraggableListEntry extends Omit<DraggableListItemProps, 'interaction' | 'onDragStart' | 'onDragEnd' | 'onDragOver' | 'onDrop'> {
  id: string;
}
export interface DraggableListProps {
  items: DraggableListEntry[];
  /** Called with the new order while an item is dragged over another and on drop. */
  onReorder: (items: DraggableListEntry[]) => void;
  /** Gap between items. @default 4 */
  gap?: number;
  sx?: SxProps<Theme>;
}

/** Vertical list that reorders its items with native drag and drop; the dragged slot shows as Ghost. */
export function DraggableList({ items, onReorder, gap = 4, sx }: DraggableListProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const move = (overId: string) => {
    if (!dragId || dragId === overId) return;
    const from = items.findIndex((i) => i.id === dragId);
    const to = items.findIndex((i) => i.id === overId);
    const dragged = items[from];
    if (from < 0 || to < 0 || !dragged) return;
    const next = items.slice();
    next.splice(from, 1);
    next.splice(to, 0, dragged);
    onReorder(next);
  };
  return (
    <Box role="list" sx={[{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>}>
      {items.map((item) => {
        const { id, ...rest } = item;
        return (
          <Box role="listitem" key={id}>
            <DraggableListItem
              {...rest}
              interaction={dragId === id ? 'ghost' : undefined}
              onDragStart={(e) => { e.dataTransfer.setData('text/plain', id); setDragId(id); }}
              onDragEnd={() => setDragId(null)}
              onDragOver={(e) => { e.preventDefault(); move(id); }}
              onDrop={(e) => { e.preventDefault(); setDragId(null); }}
            />
          </Box>
        );
      })}
    </Box>
  );
}


