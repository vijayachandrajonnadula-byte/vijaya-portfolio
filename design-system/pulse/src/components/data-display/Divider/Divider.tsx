// Figma: Divider page, set "divider" (Type Solid|Dashed|Dotted|Text Button|Button Only x Size S|M|L x Direction).
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { Button } from '../../actions/Button/Button';

export interface DividerProps {
  /** @default "solid" */
  type?: 'solid' | 'dashed' | 'dotted' | 'textButton' | 'buttonOnly';
  /** Line thickness: small 1px, medium 2px, large 4px. textButton/buttonOnly are always 1px (Figma Size=NA). @default "small" */
  size?: 'small' | 'medium' | 'large';
  /** @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  /** textButton: label of the pill button. buttonOnly: the (icon) buttons shown in the bordered frame. */
  children?: ReactNode;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

const thickness = { small: 1, medium: 2, large: 4 } as const;
const SOLID = '#e2e8f0';
const DASHED = '#5f6f86';

/** Divider: solid / dashed / dotted line, or a line interrupted by a text button / icon-button group. */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { type = 'solid', size = 'small', orientation = 'horizontal', children, onClick, sx },
  ref,
) {
  const vertical = orientation === 'vertical';
  const extra = Array.isArray(sx) ? sx : sx ? [sx] : [];
  if (type === 'textButton' || type === 'buttonOnly') {
    const line = { flex: 1, [vertical ? 'width' : 'height']: 0, [vertical ? 'borderLeft' : 'borderTop']: `1px solid ${SOLID}` };
    return (
      <Box ref={ref} role="separator" aria-orientation={orientation} sx={[{ display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center', gap: '4px', [vertical ? 'height' : 'width']: '100%', minHeight: 32 }, ...extra]}>
        <Box sx={line} />
        {type === 'textButton' ? (
          <Button variant="text" size="small" onClick={onClick} sx={{ borderRadius: '1000px' }}>{children}</Button>
        ) : (
          <Box sx={{ display: 'inline-flex', height: 32, border: `1px solid ${SOLID}`, borderRadius: '4px', background: '#fff', overflow: 'hidden' }}>{children}</Box>
        )}
        <Box sx={line} />
      </Box>
    );
  }
  const t = thickness[size];
  const style = type === 'solid' ? 'solid' : type;
  return (
    <Box
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      sx={[
        {
          flexShrink: 0,
          alignSelf: vertical ? 'stretch' : undefined,
          width: vertical ? 0 : '100%',
          height: vertical ? 'auto' : 0,
          border: 0,
          [vertical ? 'borderLeft' : 'borderTop']: `${t}px ${style} ${type === 'solid' ? SOLID : DASHED}`,
        },
        ...extra,
      ]}
    />
  );
});
Divider.displayName = 'Divider';
