// NOT FROM FIGMA. Right-hand slide panel with a dimmed scrim, taken from the Electronic Execution reference prototype
// (file slider: 560px wide, full height, slides in over 0.26s with cubic-bezier(.4,0,.2,1), header 13/16 on a #F7F9FC tint,
// scrim rgba(15,30,80,.28), shadow -14px 0 40px rgba(15,30,80,.22)). Pulse Flyout has a 24px Figtree header, so this stays
// separate. A MUI Drawer: focus trap, Escape and backdrop click close it. Listed in docs/figma-deviations.md.
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { fw } from '../../../theme/typography';

export interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  /** Width in px. @default 560 */
  width?: number;
  /** Heading text (13px/800). */
  title: ReactNode;
  /** Controls at the right of the header (icon buttons). */
  headerActions?: ReactNode;
  children?: ReactNode;
}

export function SlidePanel({ open, onClose, width = 560, title, headerActions, children }: SlidePanelProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      transitionDuration={260}
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(15,30,80,.28)' } },
        paper: { sx: { width, maxWidth: '100vw', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', boxShadow: '-14px 0 40px rgba(15,30,80,.22)', background: '#fff' } },
        transition: { easing: 'cubic-bezier(.4,0,.2,1)' },
      }}
    >
      <Box component="header" data-spec="slide-head" sx={{ display: 'flex', alignItems: 'center', gap: '10px', p: '13px 16px', boxSizing: 'border-box', flexShrink: 0, background: '#F7F9FC', borderBottom: '1px solid #DFE5EB' }}>
        <Box component="h2" data-spec="slide-title" sx={{ m: 0, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, lineHeight: '18.85px', fontWeight: fw.extraBold, color: '#0A0D2E' }}>
          {title}
        </Box>
        {headerActions}
      </Box>
      <Box data-spec="slide-body" sx={{ flex: '1 1 0', minHeight: 0, overflow: 'auto', p: '18px', boxSizing: 'border-box' }}>
        {children}
      </Box>
    </Drawer>
  );
}
