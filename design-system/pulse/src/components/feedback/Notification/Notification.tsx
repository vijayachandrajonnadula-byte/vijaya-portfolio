// Pulse "Notifications" page: Color (Blue | Orange | Red | Green) x Variant (Fill | Left Stroke) x Actions Placement (Bottom | Right).
// 400px wide (min 320, max 80% of page), radius 8, padding 12, gap 8. Left Stroke = white card with a 4px coloured left edge and a 24px
// tinted icon circle; Fill = tinted card, 20px icon, no stroke. Title in the accent colour, body secondary text, 20px close button.
import { fw } from '../../../theme/typography';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import MuiSnackbar from '@mui/material/Snackbar';
import type { SnackbarOrigin } from '@mui/material/Snackbar';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { focusRing, pt } from '../../../theme/pulseTokens';

export type NotificationColor = 'blue' | 'green' | 'orange' | 'red';

export interface NotificationProps {
  title: ReactNode;
  body?: ReactNode;
  /** @default "blue" */
  color?: NotificationColor;
  /** leftStroke: white card, 4px coloured left edge. fill: tinted card. @default "leftStroke" */
  variant?: 'leftStroke' | 'fill';
  showIcon?: boolean;
  showClose?: boolean;
  /** Visibility. Omit for always visible. */
  open?: boolean;
  handleClose?: () => void;
  onClose?: () => void;
  /** Float as a snackbar instead of rendering inline. */
  isSnackbar?: boolean;
  /** Snackbar auto-hide delay in ms. */
  duration?: number;
  autoClose?: () => void;
  anchorOrigin?: SnackbarOrigin;
  /** Action buttons (Button size xsmall/small). */
  footer?: ReactNode;
  /** Where `footer` goes. @default "bottom" */
  actionsPlacement?: 'bottom' | 'right';
  /** Fill the width of the parent instead of the fixed 400px (for notices inside dialogs and forms). NOT FROM FIGMA. @default false */
  fullWidth?: boolean;
}

/** Spec: textMetaData / textContent Multi Line are Figtree 14/20. */
const figtree = "Figtree, 'Inter Variable', Inter, sans-serif";
const n = pt.uiElements.notification;
const icons = { blue: InfoOutlined, green: CheckCircleOutlineRounded, orange: WarningAmberRounded, red: CancelOutlined } as const;
/** Text/stroke colours: uiElements/Notifications/colors/*Text. */
const text = { blue: '#2563eb', green: '#16a34a', orange: '#d97706', red: '#dc2626' } as const;
/** Fill variant title colours from the spec instance overrides. */
const fillText = { blue: '#2eb0cc', green: '#007c00', orange: '#cc6803', red: '#c10000' } as const;
/** Icon colours (spec instance overrides, both variants). */
const iconColor = { blue: '#24899f', green: '#007c00', orange: '#cc6803', red: '#c10000' } as const;
/** Left Stroke icon circle fill (accent/50 or 75 per colour). */
const circleBg = { blue: pt.colors.accent.blue[50], green: pt.colors.accent.green[75], orange: pt.colors.accent.orange[75], red: pt.colors.accent.red[50] } as const;
const fillBg = { blue: n.color.blueBG, green: n.color.greenBG, orange: n.color.orangeBG, red: n.color.redBG } as const;

/** Inline alert / toast. */
export function Notification({
  title,
  body,
  color = 'blue',
  variant = 'leftStroke',
  showIcon = true,
  showClose = false,
  open = true,
  handleClose,
  onClose,
  isSnackbar,
  duration,
  autoClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
  footer,
  actionsPlacement = 'bottom',
  fullWidth = false,
}: NotificationProps) {
  const Icon = icons[color];
  const fill = variant === 'fill';
  const tone = fill ? fillText[color] : text[color];
  const close = () => {
    handleClose?.();
    onClose?.();
  };
  const card = (
    <Box
      data-spec={`notification ${variant} ${color}`}
      role={color === 'red' ? 'alert' : 'status'}
      sx={{
        boxSizing: 'border-box',
        width: fullWidth ? '100%' : 400,
        minWidth: fullWidth ? 0 : pt.custom.notification.minWidth,
        maxWidth: fullWidth ? 'none' : '80%',
        borderRadius: pt.radius.m,
        background: fill ? fillBg[color] : pt.colors.base.white,
        borderLeft: fill ? undefined : `${n.leftStroke} solid ${text[color]}`,
        ...(isSnackbar && { boxShadow: pt.shadow.blurL, maxWidth: '100%' }),
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: pt.spacing.m, padding: n.padding.s }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: pt.spacing.m }}>
          {showIcon && (
            <Box sx={{ width: fill ? 20 : 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {fill ? (
                <Icon sx={{ fontSize: 20, color: iconColor[color] }} />
              ) : (
                <Box sx={{ width: 24, height: 24, borderRadius: '50%', background: circleBg[color], display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon sx={{ fontSize: 16, color: iconColor[color] }} />
                </Box>
              )}
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ py: '1px', fontFamily: figtree, fontSize: 14, lineHeight: '22px', fontWeight: fw.semiBold, color: tone }}>{title}</Box>
            {body && <Box sx={{ py: '2px', mt: '-4px', fontFamily: figtree, fontSize: 14, lineHeight: '20px', color: pt.formElements.content.secondaryTextColor }}>{body}</Box>}
          </Box>
          {footer && actionsPlacement === 'right' && <Box sx={{ display: 'flex', alignItems: 'center', gap: pt.spacing.xs, flexShrink: 0 }}>{footer}</Box>}
          {showClose && (
            <Box
              component="button"
              type="button"
              aria-label="Close notification"
              onClick={close}
              sx={{ all: 'unset', cursor: 'pointer', boxSizing: 'border-box', width: 20, height: 20, p: '2px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: pt.radius.xs, color: pt.colors.neutral[700], flexShrink: 0, '&:hover': { background: pt.uiElements.closeButton.color.darkHoverBG }, '&:focus-visible': { boxShadow: focusRing } }}
            >
              <CloseRounded sx={{ fontSize: 16 }} />
            </Box>
          )}
        </Box>
        {footer && actionsPlacement === 'bottom' && <Box sx={{ display: 'flex', alignItems: 'center', gap: pt.spacing.xs, minHeight: 24 }}>{footer}</Box>}
      </Box>
    </Box>
  );
  if (isSnackbar) {
    return (
      <MuiSnackbar open={open} anchorOrigin={anchorOrigin} autoHideDuration={duration} onClose={(_, reason) => reason !== 'clickaway' && (autoClose ?? close)()}>
        {card}
      </MuiSnackbar>
    );
  }
  return open ? card : null;
}


