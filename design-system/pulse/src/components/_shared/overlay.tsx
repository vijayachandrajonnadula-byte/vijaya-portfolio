// Shared by Flyout and Modal: the Figma header block (Back, Icon, Heading "Sub Heading 2", Chip, Actions, Close, metadata).
import { fw } from '../../theme/typography';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { focusRing, pt } from '../../theme/pulseTokens';

export const headingFont = "Figtree, 'Inter Variable', Inter, sans-serif";
export const line = '#e2e8f0';
export const backdrop = (opacity: number) => ({ backgroundColor: `rgba(0,0,0,${opacity})` });
export interface OverlayHeaderProps {
  title: ReactNode;
  /** Supporting text under the title. */
  metadata?: ReactNode;
  showCloseIcon?: boolean;
  onClose?: () => void;
  /** Shows a back arrow before the title. */
  onBack?: () => void;
  /** Content placed before the close button (chips, buttons). */
  actions?: ReactNode;
  /** Chip or badge right after the title. */
  titleAdornment?: ReactNode;
  /** Leading icon (Modal header icon slot). */
  icon?: ReactNode;
  /**
   * Smaller header text for dense screens: title 16/24 SemiBold, metadata 12/16 (default: Figma "Sub Heading 2" title 24/28 Medium,
   * metadata 14/20). The header stays 48px tall. Not in Figma; logged in docs/figma-deviations.md. @default false
   */
  compact?: boolean;
}

export function CloseButton({ onClick }: { onClick?: () => void }) {
  return (
    <ButtonBase
      aria-label="Close"
      onClick={onClick}
      data-spec="overlay-close"
      sx={{ width: 20, height: 20, boxSizing: 'border-box', p: '2px', borderRadius: '50%', color: pt.colors.neutral[700], '&:hover': { background: pt.uiElements.closeButton.color.darkHoverBG }, '&.Mui-focusVisible': { boxShadow: focusRing } }}
    >
      <CloseRounded sx={{ fontSize: 16 }} />
    </ButtonBase>
  );
}

export function OverlayHeader({ title, metadata, showCloseIcon = true, onClose, onBack, actions, titleAdornment, icon, compact = false, divider, padding }: OverlayHeaderProps & { divider?: boolean; padding: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: pt.spacing.m, padding, borderBottom: divider ? `1px solid ${line}` : undefined, background: pt.colors.base.white, flexShrink: 0 }}>
      {onBack && (
        <ButtonBase aria-label="Back" onClick={onBack} sx={{ width: 24, height: 32, borderRadius: pt.radius.xs, '&.Mui-focusVisible': { boxShadow: focusRing } }}>
          <ArrowBackRounded sx={{ fontSize: 18 }} />
        </ButtonBase>
      )}
      {icon && <Box sx={{ display: 'inline-flex', alignItems: 'center', height: 32 }}>{icon}</Box>}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: pt.spacing.m, minHeight: 32 }}>
          <Box component="h2" sx={{ m: 0, flex: 1, minWidth: 0, fontFamily: headingFont, ...(compact ? { fontSize: 16, lineHeight: '24px', fontWeight: fw.semiBold } : { fontSize: 24, lineHeight: '28px', fontWeight: fw.medium }), color: pt.formElements.headings.defaultTextColor }}>
            {title}
          </Box>
          {titleAdornment}
          {actions}
          {showCloseIcon && <CloseButton onClick={onClose} />}
        </Box>
        {metadata && <Box sx={{ mt: compact ? '-2px' : '-4px', fontFamily: headingFont, fontSize: compact ? 12 : 14, lineHeight: compact ? '16px' : '20px', color: pt.formElements.content.secondaryTextColor }}>{metadata}</Box>}
      </Box>
    </Box>
  );
}

