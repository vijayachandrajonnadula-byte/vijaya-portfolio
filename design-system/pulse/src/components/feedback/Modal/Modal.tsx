// Pulse "Modal" page, set "Modal" (Type: Default | Alert | Max Size | Full Page).
// Default: 480 wide, radius 8, 1px #f1f5f9 border, body pad 16 gap 16, no header divider, small buttons. Alert: 40px icon on top,
// equal-width buttons. Max Size: 1368x972 (95% of 1440x1024). Full Page: edge to edge, header 8/16 (64px), footer 8/16 (48px).
// ModalPanel is the surface without the Dialog (inline display); Modal wraps it in a MUI Dialog.
import { fw } from '../../../theme/typography';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import WarningRounded from '@mui/icons-material/WarningRounded';
import { Button } from '../../actions/Button/Button';
import { pt } from '../../../theme/pulseTokens';
import { CloseButton, OverlayHeader, backdrop, headingFont } from '../../_shared/overlay';
import type { OverlayHeaderProps } from '../../_shared/overlay';

export interface ModalAction {
  label: string;
  onClick?: () => void;
  color?: 'primary' | 'error' | 'success' | 'warning' | 'ai';
  disabled?: boolean;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** popup: Default. alert: icon on top, equal-width buttons. maxSize: 95% of the viewport. fullPage: edge to edge. @default "popup" */
  variant?: 'popup' | 'alert' | 'maxSize' | 'fullPage';
  headerProps: OverlayHeaderProps;
  footerProps?: { primaryAction?: ModalAction; secondaryAction?: ModalAction; /** Helper text at the left of the actions row. */ helperText?: ReactNode };
  /** Alert icon (40px). Defaults to the orange warning icon. */
  alertIcon?: ReactNode;
  /** Dialog width. @default pt.custom.popup.minWidth (480px) */
  width?: number | string;
  /** 0.3 or 0.5. @default 0.5 */
  backdropOpacity?: 0.3 | 0.5;
  children?: ReactNode;
}

function Actions({ footerProps, grow }: { footerProps: NonNullable<ModalProps['footerProps']>; grow?: boolean }) {
  const { primaryAction, secondaryAction, helperText } = footerProps;
  const btn = (a: ModalAction, variant: 'outlined' | 'contained') => (
    <Button key={a.label} variant={variant} size="small" color={a.color} disabled={a.disabled} onClick={a.onClick} sx={grow ? { flex: 1 } : undefined}>
      {a.label}
    </Button>
  );
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: pt.spacing.m, minHeight: 32, ...(grow && { justifyContent: 'flex-end' }) }}>
      {helperText && <Box sx={{ fontSize: 12, lineHeight: '20px', color: pt.formElements.content.secondaryTextColor }}>{helperText}</Box>}
      {!grow && <Box sx={{ flex: 1 }} />}
      {secondaryAction && btn(secondaryAction, 'outlined')}
      {primaryAction && btn(primaryAction, 'contained')}
    </Box>
  );
}

export type ModalPanelProps = Omit<ModalProps, 'open' | 'backdropOpacity'>;

/** The modal surface without the Dialog. Fills its parent; Modal sizes it through the Dialog paper. */
export function ModalPanel({ onClose, variant = 'popup', headerProps, footerProps, alertIcon, children }: ModalPanelProps) {
  const hasFooter = footerProps && (footerProps.primaryAction || footerProps.secondaryAction || footerProps.helperText);
  const full = variant === 'fullPage';
  const max = variant === 'maxSize';
  return (
    <Box
      data-spec={`modal ${variant}`}
      sx={{
        flex: 1,
        width: '100%',
        height: '100%',
        minHeight: 0,
        boxSizing: 'border-box',
        borderRadius: full ? 0 : pt.uiElements.popup.radius.medium,
        position: 'relative',
        // 1px #f1f5f9 stroke drawn INSIDE (spec uiElements/popUp/color/border), so the outer size stays 480x304
        '&::after': full ? undefined : { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', border: '1px solid #f1f5f9', pointerEvents: 'none' },
        background: pt.colors.base.white,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {variant === 'alert' ? (
        <Box data-spec="modal-alert" sx={{ display: 'flex', flexDirection: 'column', gap: pt.spacing.xxxl, p: pt.spacing.xxxl }}>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40 }}>
            {alertIcon ?? <WarningRounded sx={{ fontSize: 40, color: '#ff8204' }} />}
            <Box sx={{ position: 'absolute', right: 0, top: 0, height: 32, display: 'flex', alignItems: 'center' }}><CloseButton onClick={headerProps.onClose ?? onClose} /></Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: pt.spacing.m }}>
            <Box component="h2" sx={{ m: 0, fontFamily: headingFont, fontSize: 24, lineHeight: '28px', fontWeight: fw.medium, color: pt.formElements.headings.defaultTextColor }}>{headerProps.title}</Box>
            <Box sx={{ maxHeight: pt.custom.popup.content.maxHeight, overflowY: 'auto' }}>{children}</Box>
          </Box>
          {hasFooter && <Actions footerProps={footerProps} grow />}
        </Box>
      ) : (
        <>
          <OverlayHeader {...headerProps} onClose={headerProps.onClose ?? onClose} padding={full ? '8px 16px' : '16px 16px 0'} />
          <Box data-spec="modal-body" sx={{ flex: full || max ? 1 : undefined, minHeight: 0, overflowY: 'auto', padding: full ? 0 : pt.spacing.xxxl, boxSizing: 'border-box', maxHeight: full || max ? undefined : pt.custom.popup.content.maxHeight }}>{children}</Box>
          {hasFooter && (
            <Box sx={{ padding: full ? '8px 16px' : '0 16px 16px', flexShrink: 0 }}>
              <Actions footerProps={footerProps} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

/** Centered dialog. Built on MUI Dialog. */
export function Modal({ open, onClose, variant = 'popup', width = pt.custom.popup.minWidth, backdropOpacity = 0.5, ...panel }: ModalProps) {
  const full = variant === 'fullPage';
  const max = variant === 'maxSize';
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={full}
      slotProps={{
        backdrop: { sx: backdrop(backdropOpacity) },
        paper: {
          sx: {
            width: max ? '95%' : full ? '100%' : width,
            maxWidth: max ? 1368 : full ? 'none' : pt.custom.popup.container.maxWidth,
            height: max ? '95%' : undefined,
            maxHeight: max ? 972 : undefined,
            m: 0,
            borderRadius: full ? 0 : pt.uiElements.popup.radius.medium,
            boxShadow: full ? 'none' : undefined,
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <ModalPanel variant={variant} onClose={onClose} {...panel} />
    </Dialog>
  );
}