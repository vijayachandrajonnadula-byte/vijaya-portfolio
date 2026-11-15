// Pulse "Flyout" page, set "Flyout" (Metadata: False | Single Line | Two Lines).
// 480 wide, header pad 8/16 (48px, 64 with one metadata line, 84 with two) with a 1px #e2e8f0 bottom border; body = row of
// [Body Content pad 16 (grows), optional docked-right NavigationRail 48px]; footer 48px pad 8/16 with a top border.
// `FlyoutPanel` is the panel itself (no portal) so it can be shown inline; `Flyout` wraps it in a MUI Drawer.
import type { ReactNode, SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Tab, Tabs } from '../../navigation/Tabs/Tabs';
import { pt } from '../../../theme/pulseTokens';
import { OverlayHeader, backdrop, line } from '../../_shared/overlay';
import type { OverlayHeaderProps } from '../../_shared/overlay';

export type { OverlayHeaderProps };

export interface FlyoutProps {
  open: boolean;
  onClose: () => void;
  /** @default "right" */
  anchor?: 'left' | 'right';
  /** px number or CSS length / percentage. @default 480 */
  width?: number | string;
  headerProps: OverlayHeaderProps;
  /** Tabs under the header. */
  tabs?: { label: string; disabled?: boolean }[];
  activeTab?: number;
  handleChangeTab?: (index: number) => void;
  /** Right side of the sticky footer (action buttons). */
  footer?: ReactNode;
  /** Left side of the footer (secondary buttons, helper text). */
  footerLeft?: ReactNode;
  /** Docked NavigationRail shown at the right edge of the body (Figma: NavigationRail docked / right, 48px). */
  rail?: ReactNode;
  /** Remove the content padding (for full-bleed grids). @default false */
  disableContentPadding?: boolean;
  /** 0.3 or 0.5 (Backdrop page). @default 0.5 */
  backdropOpacity?: 0.3 | 0.5;
  children?: ReactNode;
}

export type FlyoutPanelProps = Omit<FlyoutProps, 'open' | 'anchor' | 'backdropOpacity'>;

/** The flyout surface without the Drawer (header, tabs, body, footer). */
export function FlyoutPanel({ onClose, width = 480, headerProps, tabs, activeTab = 0, handleChangeTab, footer, footerLeft, rail, disableContentPadding, children }: FlyoutPanelProps) {
  return (
    <Box data-spec="flyout" sx={{ width, maxWidth: pt.custom.flyout.paper.maxWidth, minWidth: pt.custom.flyout.paper.minWidth, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: pt.colors.base.white }}>
      <OverlayHeader {...headerProps} onClose={headerProps.onClose ?? onClose} divider padding="8px 16px" />
      {tabs && (
        <Box sx={{ px: pt.spacing.xxxl, borderBottom: `1px solid ${line}` }}>
          <Tabs value={activeTab} handleChange={(_: SyntheticEvent, v: number) => handleChangeTab?.(v)} size="small">
            {tabs.map((t, i) => <Tab key={t.label} index={i} label={t.label} disabled={t.disabled} />)}
          </Tabs>
        </Box>
      )}
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <Box data-spec="flyout-body" sx={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: disableContentPadding ? 0 : pt.spacing.xxxl, boxSizing: 'border-box' }}>{children}</Box>
        {rail}
      </Box>
      {(footer || footerLeft) && (
        <Box data-spec="flyout-footer" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: pt.spacing.xxxl, height: 48, padding: '7px 16px 8px', boxSizing: 'border-box', borderTop: `1px solid ${line}`, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: pt.spacing.xxxl }}>{footerLeft}</Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: pt.spacing.m }}>{footer}</Box>
        </Box>
      )}
    </Box>
  );
}

/** Side panel for detail and create/edit forms. Built on MUI Drawer. */
export function Flyout({ open, onClose, anchor = 'right', width = 480, backdropOpacity = 0.5, ...panel }: FlyoutProps) {
  return (
    <Drawer
      open={open}
      anchor={anchor}
      onClose={onClose}
      slotProps={{
        backdrop: { sx: backdrop(backdropOpacity) },
        paper: { sx: { width, background: pt.colors.base.white, borderRadius: 0 } },
      }}
    >
      <FlyoutPanel width="100%" onClose={onClose} {...panel} />
    </Drawer>
  );
}
