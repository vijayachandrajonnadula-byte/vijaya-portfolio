// NOT FROM FIGMA. Compact confirm/form dialog taken from the Electronic Execution reference prototype (measured), for dense
// execution workflows. Pulse "Modal" (Figma) has a 24px Figtree title and 16px padding; this one is the prototype's .modal.sm/.md:
// radius 12, header 12/18 (34px icon tile, 14px/700 title, 11px sub-text), body 16/18, tinted footer 10/18 with 6px gap, small buttons.
// Listed in docs/figma-deviations.md. Use Modal for anything that has a Figma spec.
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { Button } from '../../actions/Button/Button';
import { focusRing, pt } from '../../../theme/pulseTokens';
import { role } from '../../../theme/typography';
import type { ModalAction } from '../Modal/Modal';

export interface CompactDialogProps {
  open: boolean;
  onClose: () => void;
  /** Dialog width in px. @default 420 */
  width?: number;
  /** Icon inside the 34px brand tile left of the title. Omit for a text-only header. */
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Close (x) button in the header. @default true */
  showClose?: boolean;
  /** Backdrop click / Escape close the dialog. @default true */
  dismissible?: boolean;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  /** Extra control at the left of the footer (for example a text button). */
  footerStart?: ReactNode;
  /** Extra controls in the header, before the close button (for example a maximise button). */
  headerActions?: ReactNode;
  /** Footer buttons at the prototype's .btn size (26px high, 11.5px label) instead of the Pulse small button. @default false */
  dense?: boolean;
  /** Role of the dialog. @default "dialog" */
  dialogRole?: 'dialog' | 'alertdialog';
  /** Body padding override (CSS). */
  bodyPadding?: string;
  /**
   * 'notice' = the prototype's plain notification modal (.mid): header 16/20 with a 16px/700 title and no tint, 13.5px body
   * (22/24), white footer 10/20 with an 8px gap. @default 'compact'
   */
  appearance?: 'compact' | 'notice';
  children?: ReactNode;
}

export function CompactDialog({ open, onClose, width = 420, icon, title, subtitle, showClose = true, dismissible = true, primaryAction, secondaryAction, footerStart, headerActions, dense = false, dialogRole = 'dialog', bodyPadding, appearance = 'compact', children }: CompactDialogProps) {
  const notice = appearance === 'notice';
  const pad = bodyPadding ?? (notice ? '22px 24px' : '16px 18px');
  const btn = (a: ModalAction, variant: 'outlined' | 'contained') => (
    <Button key={a.label} variant={variant} size="small" color={a.color} disabled={a.disabled} onClick={a.onClick} sx={dense ? { height: 26, minHeight: 26, p: '5px 10px', fontSize: 11.5, lineHeight: 'normal', borderRadius: '6px' } : undefined}>
      {a.label}
    </Button>
  );
  return (
    <Dialog
      open={open}
      onClose={dismissible ? onClose : undefined}
      role={dialogRole}
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(15,30,80,.45)', backdropFilter: 'blur(2px)' } },
        paper: { sx: { width, maxWidth: 'calc(100% - 32px)', m: 0, borderRadius: '12px', ...(notice ? { border: 0 } : null), maxHeight: '94vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' } },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: icon ? 'flex-start' : 'center', gap: notice ? '10px' : '12px', p: notice ? '16px 20px' : '12px 18px', borderBottom: `1px solid ${pt.colors.neutral[200]}`, background: notice ? '#fff' : `linear-gradient(180deg, ${pt.colors.neutral[50]}, #fff)`, flexShrink: 0 }}>
        {icon && (
          <Box data-spec="compact-icon" sx={{ width: 34, height: 34, flexShrink: 0, borderRadius: '9px', background: pt.colors.brand[600], color: '#fff', display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: role.dialogTitle }}>
            {icon}
          </Box>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box component="h2" data-spec="compact-title" sx={{ m: 0, fontSize: notice ? 16 : 14, lineHeight: notice ? '23.2px' : '20px', fontWeight: role.dialogTitle, color: pt.colors.neutral[900] }}>{title}</Box>
          {subtitle && <Box data-spec="compact-sub" sx={{ mt: '2px', fontSize: 11, lineHeight: '16px', color: pt.formElements.content.secondaryTextColor }}>{subtitle}</Box>}
        </Box>
        {headerActions}
        {showClose && (
          <ButtonBase aria-label="Close" onClick={onClose} sx={{ p: '4px', borderRadius: '5px', color: pt.formElements.content.secondaryTextColor, '&.Mui-focusVisible': { boxShadow: focusRing } }}>
            <CloseRounded sx={{ fontSize: 16 }} />
          </ButtonBase>
        )}
      </Box>
      <Box data-spec="compact-body" sx={{ p: pad, overflowY: 'auto', fontSize: notice ? 13.5 : 12.5, lineHeight: notice ? '20.25px' : '18px', color: pt.colors.neutral[900] }}>{children}</Box>
      {(primaryAction || secondaryAction) && (
        <Box data-spec="compact-footer" sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: notice ? '8px' : '6px', p: notice ? '8px 20px' : '10px 18px', borderTop: `1px solid ${pt.colors.neutral[200]}`, background: notice ? '#fff' : pt.colors.neutral[50], flexShrink: 0 }}>
          {footerStart && <Box sx={{ flex: 1 }}>{footerStart}</Box>}
          {secondaryAction && btn(secondaryAction, 'outlined')}
          {primaryAction && btn(primaryAction, 'contained')}
        </Box>
      )}
    </Dialog>
  );
}
