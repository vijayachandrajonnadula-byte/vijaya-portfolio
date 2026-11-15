// Shared by Popover and Tooltip: the 12 arrow positions of the Figma toolTip / popOver sets.
import Box from '@mui/material/Box';

export type ArrowPosition =
  | 'none'
  | 'top-left' | 'top-middle' | 'top-right'
  | 'bottom-left' | 'bottom-middle' | 'bottom-right'
  | 'left-top' | 'left-middle' | 'left-bottom'
  | 'right-top' | 'right-middle' | 'right-bottom';

export type BubbleStyle = 'outline' | 'filled';
// Figma arrow node is 12 wide x 7 deep; a 45deg-rotated 8.5px square gives a 12px base and ~6px depth.
const SIZE = 8.5;
export const BUBBLE_FILLED = '#0f172a';
export const BUBBLE_BORDER = '#e2e8f0';

/** Rotated square sitting on the given edge. The first word of `position` is the edge the arrow is on. */
export function BubbleArrow({ position, bubble }: { position: ArrowPosition; bubble: BubbleStyle }) {
  if (position === 'none') return null;
  const [edge, align] = position.split('-') as ['top' | 'bottom' | 'left' | 'right', 'left' | 'middle' | 'right' | 'top' | 'bottom'];
  const horizontal = edge === 'top' || edge === 'bottom';
  const offset = align === 'middle' ? { [horizontal ? 'left' : 'top']: `calc(50% - ${SIZE / 2}px)` } : { [align === 'left' || align === 'top' ? (horizontal ? 'left' : 'top') : horizontal ? 'right' : 'bottom']: (align === 'left' || align === 'top' ? 14 : 13) - SIZE / 2 };
  const border = `1px solid ${BUBBLE_BORDER}`;
  const cut: Record<string, object> = {
    top: { borderLeft: border, borderTop: border },
    bottom: { borderRight: border, borderBottom: border },
    left: { borderLeft: border, borderBottom: border },
    right: { borderRight: border, borderTop: border },
  };
  return (
    <Box
      data-arrow={position}
      sx={{
        position: 'absolute',
        width: SIZE,
        height: SIZE,
        background: bubble === 'filled' ? BUBBLE_FILLED : '#fff',
        transform: 'rotate(45deg)',
        [edge]: -SIZE / 2 - (bubble === 'outline' ? 0.5 : 0),
        ...offset,
        ...(bubble === 'outline' ? cut[edge] : {}),
      }}
    />
  );
}
