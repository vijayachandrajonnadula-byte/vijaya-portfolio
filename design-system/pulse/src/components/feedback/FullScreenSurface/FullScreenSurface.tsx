// NOT FROM FIGMA. A surface that fills the whole viewport (no Figma spec), taken from the Electronic Execution reference
// prototype: the evidence gallery (white, z 450) and the full-size evidence viewer (dark scrim, z 700). It is a MUI Modal, so
// it traps focus, restores it on close and closes only the top-most surface on Escape. The page supplies the content and
// the background. Listed in docs/figma-deviations.md.
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

export interface FullScreenSurfaceProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the surface. */
  label: string;
  /** CSS background of the surface. @default "#fff" */
  background?: string;
  /** CSS direction of the content. @default "column" */
  direction?: 'row' | 'column';
  /** Backdrop click closes the surface. @default false */
  closeOnBackdrop?: boolean;
  children?: ReactNode;
}

export function FullScreenSurface({ open, onClose, label, background = '#fff', direction = 'column', closeOnBackdrop = false, children }: FullScreenSurfaceProps) {
  return (
    <Modal open={open} onClose={(_, reason) => (reason === 'backdropClick' && !closeOnBackdrop ? undefined : onClose())} aria-label={label} slotProps={{ backdrop: { sx: { backgroundColor: 'transparent' } } }}>
      <Box role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} sx={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: direction, background, outline: 'none', overflow: 'hidden' }}>
        {children}
      </Box>
    </Modal>
  );
}
