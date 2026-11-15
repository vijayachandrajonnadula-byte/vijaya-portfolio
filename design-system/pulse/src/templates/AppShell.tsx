/**
 * NOT FROM FIGMA. A layout helper: the pulse-2.0 Figma file defines the shell parts (Header, LeftNav) but not the frame
 * that places them. AppShell only positions them: LeftNav beside a column of Header + page content. It adds no visual
 * styling of its own.
 */
import { Box } from '../components/mui';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '../components/mui';

export interface AppShellProps {
  /** The LeftNav (full-height rail, left). */
  nav: ReactNode;
  /** The Header (top of the content column). */
  header?: ReactNode;
  /** Page content: the panels and body, stacked in a column. */
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

/** Full-viewport frame: nav on the left, header above the page content on the right. */
export function AppShell({ nav, header, children, sx }: AppShellProps) {
  return (
    <Box sx={[{ display: 'flex', height: '100vh', minWidth: 1100, bgcolor: 'background.paper' }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      {nav}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {header}
        {children}
      </Box>
    </Box>
  );
}
