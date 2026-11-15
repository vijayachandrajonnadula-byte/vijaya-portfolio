// Implements Figma page "Side Panel (NEW)": set "Side Panel" (Position Left/Right x Collapsed No/Yes).
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { AdornmentButton } from '../../actions/Button/AdornmentButton';
import { textStyle } from '../../../theme/pulseTokens';
import { LeftNavExpandCollapse } from '../LeftNav/LeftNav';

export interface SidePanelProps {
  title: ReactNode;
  /** Meta line under the title. */
  subtitle?: ReactNode;
  /** Chip / status next to the title. */
  titleAdornment?: ReactNode;
  /** Buttons on the header's right, before the close button. */
  headerActions?: ReactNode;
  /** Panel body. */
  children?: ReactNode;
  /** Footer content (buttons / helper text). Left and right groups. */
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  /** @default "left" */
  position?: 'left' | 'right';
  /** Collapsed rail (48px) with a vertical title. */
  collapsed?: boolean;
  /** Expand/collapse circle clicked. Omit to hide the circle. */
  onToggle?: () => void;
  /** Shows the header close button. */
  onClose?: () => void;
  /** Expanded width. @default 320 */
  width?: number;
}

const BORDER = '#e2e8f0';

/** Collapsible side panel: 48px title header, scrolling body (16px padding), optional 48px footer; 320px wide, 1px divider on the inner edge. */
export function SidePanel({ title, subtitle, titleAdornment, headerActions, children, footerLeft, footerRight, position = 'left', collapsed = false, onToggle, onClose, width = 320 }: SidePanelProps) {
  const left = position === 'left';
  const edge = left ? 'inset -1px 0 0 0' : 'inset 1px 0 0 0';
  const toggle = onToggle && (
    <LeftNavExpandCollapse
      variant={(left ? !collapsed : collapsed) ? 'left' : 'right'}
      onClick={onToggle}
      sx={{ position: 'absolute', top: 'calc(50% - 12px)', [left ? 'right' : 'left']: -12 }}
    />
  );

  if (collapsed) {
    return (
      <Box component="aside" aria-label={typeof title === 'string' ? title : undefined} data-spec="sidepanel collapsed" sx={{ position: 'relative', width: 48, height: '100%', boxSizing: 'border-box', background: '#fff', boxShadow: `${edge} ${BORDER}`, display: 'flex', justifyContent: 'center', pt: '16px', flexShrink: 0 }}>
        {toggle}
        <Box sx={{ writingMode: 'vertical-rl', ...textStyle('textL', 'semiBold'), fontSize: 14, lineHeight: '20px', color: '#0f172a', whiteSpace: 'nowrap' }}>{title}</Box>
      </Box>
    );
  }

  return (
    <Box component="aside" data-spec="sidepanel" sx={{ position: 'relative', width, height: '100%', boxSizing: 'border-box', background: '#fff', boxShadow: `${edge} ${BORDER}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {toggle}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: 48, boxSizing: 'border-box', p: '8px 16px', boxShadow: `inset 0 -1px 0 0 ${BORDER}` }}>
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: 32 }}>
            <Box sx={{ ...textStyle('textL', 'semiBold'), color: '#0f172a', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</Box>
            {titleAdornment}
          </Box>
          {subtitle && <Box sx={{ ...textStyle('textM', 'regular'), color: '#566680', mt: '-4px' }}>{subtitle}</Box>}
        </Box>
        {headerActions}
        {/* Figma Close Button: adornmentButton Size=XS, Variant=Dark, Shape=Circle (20x20) */}
        {onClose && <AdornmentButton size="xs" variant="dark" shape="circle" aria-label="Close" onClick={onClose} />}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</Box>
      {(footerLeft || footerRight) && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', minHeight: 48, boxSizing: 'border-box', p: '8px 16px', boxShadow: `inset 0 1px 0 0 ${BORDER}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>{footerLeft}</Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{footerRight}</Box>
        </Box>
      )}
    </Box>
  );
}

