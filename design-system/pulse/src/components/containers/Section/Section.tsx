// Pulse "Section (NEW)" page: titled content container. Tokens: uiElements/section (header #f8fafc pad 8/16, body pad 16,
// border #e2e8f0, radius 8). Optionally collapsible.
import { fw } from '../../../theme/typography';
import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import type { SxProps, Theme } from '@mui/material/styles';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import { IconButton } from '../../actions/IconButton/IconButton';
import { pt } from '../../../theme/pulseTokens';

const sec = pt.uiElements.section;

export interface SectionProps {
  title: ReactNode;
  /** Supporting line under the title. */
  metadata?: ReactNode;
  icon?: ReactNode;
  /** Content aligned to the right of the header (buttons, chips). */
  rightSlot?: ReactNode;
  children?: ReactNode;
  /** Remove the body padding (for full-bleed grids). @default false */
  disableBodyPadding?: boolean;
  /** Adds a chevron that collapses the body. @default false */
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  sx?: SxProps<Theme>;
}

/** Titled panel: tinted header bar over a bordered body. */
export function Section({ title, metadata, icon, rightSlot, children, disableBodyPadding, collapsible, defaultCollapsed = false, sx }: SectionProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const open = !collapsible || !collapsed;
  return (
    <Box component="section" sx={[{ border: `1px solid ${sec.color.defaultBorder}`, borderRadius: sec.radius.defaultRadius, overflow: 'hidden', background: pt.colors.base.white }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: pt.spacing.xxxl, padding: `${sec.padding.headerPaddingTb} ${sec.padding.headerPaddingLr}`, background: sec.color.sectionHeader, borderBottom: open ? `1px solid ${sec.color.defaultBorder}` : 'none' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: pt.spacing.m, minWidth: 0 }}>
          {collapsible && (
            <IconButton ariaLabel={open ? 'Collapse section' : 'Expand section'} aria-expanded={open} size="xsmall" onClick={() => setCollapsed(!collapsed)}>
              <ExpandMoreRounded sx={{ transition: 'transform 150ms', transform: open ? 'none' : 'rotate(-90deg)' }} />
            </IconButton>
          )}
          {icon && <Box sx={{ display: 'inline-flex', color: 'primary.main', '& svg': { fontSize: 16 } }}>{icon}</Box>}
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ py: '2px' }}><Box sx={{ fontFamily: "'Inter Variable', Inter, sans-serif", fontSize: 14, lineHeight: '24px', fontWeight: fw.bold, color: pt.formElements.headings.defaultTextColor }}>{title}</Box></Box>
            {metadata && <Box sx={{ mt: '-4px', fontFamily: "'Inter Variable', Inter, sans-serif", fontSize: 10, lineHeight: '18px', color: pt.formElements.content.secondaryTextColor }}>{metadata}</Box>}
          </Box>
        </Box>
        {rightSlot && <Box sx={{ display: 'flex', alignItems: 'center', gap: pt.spacing.m, flexShrink: 0 }}>{rightSlot}</Box>}
      </Box>
      <Collapse in={open}>
        <Box sx={{ padding: disableBodyPadding ? 0 : `${sec.padding.bodyPaddingTb} ${sec.padding.paddingLr}` }}>{children}</Box>
      </Collapse>
    </Box>
  );
}
