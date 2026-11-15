// Implements Figma page "Electronic Signature": 560px dialog = gradient banner (signer, activity chip, date, time, time zone),
// reason / user id / password / comments fields, "I Accept" notification and Cancel / Submit footer.
// Prop API follows the Pulse app (`ElectonicSignature`); `ElectonicSignature` is exported as an alias.
import type { ChangeEvent, ReactNode } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CloseRounded from '@mui/icons-material/CloseRounded';
import Dialog from '@mui/material/Dialog';
import { role } from '../../../theme/typography';
import PublicRounded from '@mui/icons-material/PublicRounded';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';
import { Button } from '../../actions/Button/Button';
import { Chip } from '../../data-display/Chip/Chip';
import { Notification } from '../../feedback/Notification/Notification';
import { Tooltip } from '../../feedback/Tooltip/Tooltip';
import { Select } from '../../form/Select/Select';
import type { SelectOption } from '../../form/Select/Select';
import { TextArea, TextField } from '../../form/TextField/TextField';
import { pt, textStyle } from '../../../theme/pulseTokens';

export interface ESignFieldBase {
  label?: ReactNode;
  value?: string;
  placeholder?: string;
  error?: boolean;
  hint?: ReactNode;
}
export interface ESignFields {
  /** "reason" shows the reason dropdown. @default "reason" */
  type?: 'reason' | 'comment' | string;
  reason?: ESignFieldBase & { options?: (SelectOption | string)[]; onChange?: (value: string) => void };
  userId?: ESignFieldBase & { onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void };
  password?: ESignFieldBase & { onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void };
  comments?: ESignFieldBase & { onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void };
}
export interface ESignUserDetails {
  date?: string;
  time?: string;
  timeZone?: string;
  timeZoneTooltip?: string;
  /** Chip text on the banner, e.g. "Witnessed and Verified". */
  activityText?: string;
  name?: string;
  role?: string;
  /** Avatar image URL. */
  src?: string;
}

export interface ElectronicSignatureProps {
  open: boolean;
  fields?: ESignFields;
  userDetails?: ESignUserDetails;
  /** The consent text ("I Accept ..."). */
  notificationValues?: { title?: ReactNode; description?: ReactNode };
  signButtonLabel?: string;
  secondaryButtonLabel?: string;
  /** Primary action. */
  handleSign?: () => void;
  /** Cancel action. */
  handleSecondary?: () => void;
  /** Dialog dismiss (Escape / backdrop). */
  handleFlyoutClose?: () => void;
  /** Error banner shown above the fields (Figma hidden "Notifications / Red"). */
  errorMessage?: ReactNode;
  disableSign?: boolean;
  /** Render inline instead of in a dialog (docs). */
  inline?: boolean;
  /** NOT FROM FIGMA (Electronic Execution reference): dense 480px layout, 52px avatar, 15px name, context strip, tinted footer. */
  compact?: boolean;
  /** Compact only: dialog width. @default 480 */
  width?: number;
  /** Compact only: strip under the banner, e.g. "You are signing Step 2 · Table 1". */
  contextText?: ReactNode;
  /** Compact only: replaces the avatar initial (for example a check mark). */
  avatarContent?: ReactNode;
  /** Compact only: fields shown before the reason select (for example a verifier select). */
  beforeFields?: ReactNode;
  /** Compact only: User ID is shown but not editable. */
  userIdReadOnly?: boolean;
  /** Compact only: closes the dialog from the banner x button. */
  handleClose?: () => void;
}

const fullWidth = { '& > *': { maxWidth: 'none !important', width: '100% !important', minWidth: '0 !important' } };
const BANNER = 'linear-gradient(131deg, #1e3a6e 0%, #10213f 100%)';

type PanelProps = Omit<ElectronicSignatureProps, 'open' | 'handleFlyoutClose' | 'inline'>;

function FieldList({ fields = {}, notificationValues, beforeFields, userIdReadOnly, gap }: Pick<PanelProps, 'fields' | 'notificationValues' | 'beforeFields' | 'userIdReadOnly'> & { gap: string }) {
  const showReason = (fields.type ?? 'reason') === 'reason' || !!fields.reason;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap }}>
      {beforeFields}
      {showReason && (
        <Select
          size="small"
          label={fields.reason?.label ?? 'Reason for E-sign'}
          required
          options={fields.reason?.options ?? []}
          value={fields.reason?.value ?? ''}
          placeholder={fields.reason?.placeholder ?? 'Select a Reason'}
          error={fields.reason?.error}
          hint={fields.reason?.hint}
          onChange={(v) => fields.reason?.onChange?.(Array.isArray(v) ? (v[0] ?? '') : v)}
        />
      )}
      <TextField size="small" label={fields.userId?.label ?? 'User ID'} required placeholder={fields.userId?.placeholder ?? 'Enter User ID'} value={fields.userId?.value ?? ''} error={fields.userId?.error} hint={fields.userId?.hint} readOnly={userIdReadOnly} onChange={fields.userId?.onChange} />
      <TextField size="small" type="password" label={fields.password?.label ?? 'Password'} required placeholder={fields.password?.placeholder ?? 'Enter password'} value={fields.password?.value ?? ''} error={fields.password?.error} hint={fields.password?.hint} onChange={fields.password?.onChange} />
      <TextArea label={fields.comments?.label ?? 'Comments'} placeholder={fields.comments?.placeholder ?? 'Write a comment'} value={fields.comments?.value ?? ''} error={fields.comments?.error} hint={fields.comments?.hint} onChange={fields.comments?.onChange} />
      {notificationValues && <Box sx={fullWidth}><Notification title={notificationValues.title} body={notificationValues.description} color="blue" variant="fill" /></Box>}
    </Box>
  );
}

function CompactPanel({ fields, userDetails = {}, notificationValues, signButtonLabel = 'Submit', secondaryButtonLabel = 'Cancel', handleSign, handleSecondary, handleClose, errorMessage, disableSign, width = 480, contextText, avatarContent, beforeFields, userIdReadOnly }: PanelProps) {
  const meta = { display: 'flex', alignItems: 'center', gap: '4px', fontSize: 10.5, lineHeight: '15px', color: 'rgba(255,255,255,.7)' };
  return (
    <Box data-spec="esign-compact" sx={{ width, maxWidth: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', bgcolor: pt.uiElements.popup.color.background, borderRadius: '14px', overflow: 'hidden' }}>
      <Box sx={{ background: 'linear-gradient(135deg, #0A1F3D 0%, #2F5496 100%)', p: '20px 22px 0', color: '#fff' }}>
        <Box sx={{ display: 'flex', gap: '14px', pb: '16px' }}>
          <Avatar data-spec="esign-avatar" src={userDetails.src} alt={userDetails.name} sx={{ width: 52, height: 52, flexShrink: 0, boxSizing: 'border-box', border: '2px solid rgba(255,255,255,.35)', bgcolor: 'rgba(255,255,255,.18)', color: '#fff', fontSize: 16, fontWeight: role.dialogTitle, letterSpacing: '.5px' }}>
            {avatarContent ?? userDetails.name?.split(' ').map((p) => p[0]).join('').slice(0, 2)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ fontSize: 15, lineHeight: '20px', fontWeight: role.dialogTitle, color: '#fff', mb: '2px' }}>{userDetails.name}</Box>
            <Box sx={{ fontSize: 11.5, lineHeight: '16px', color: 'rgba(255,255,255,.65)', mb: userDetails.date || userDetails.time || userDetails.timeZone ? '8px' : 0 }}>{userDetails.role}</Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
              {userDetails.date && <Box sx={meta}><CalendarTodayOutlined sx={{ fontSize: 11 }} />{userDetails.date}</Box>}
              {userDetails.time && <Box sx={meta}><AccessTimeRounded sx={{ fontSize: 11 }} />{userDetails.time}</Box>}
              {userDetails.timeZone && <Box sx={meta}><PublicRounded sx={{ fontSize: 11 }} />{userDetails.timeZone}</Box>}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
            <ButtonBase aria-label="Close" onClick={handleClose} sx={{ p: '3px 7px', borderRadius: '6px', bgcolor: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.55)' }}>
              <CloseRounded sx={{ fontSize: 14 }} />
            </ButtonBase>
            {userDetails.activityText && (
              <Box sx={{ p: '3px 9px', borderRadius: '20px', fontSize: 10, lineHeight: '16px', fontWeight: role.dialogTitle, color: '#6EE7B7', bgcolor: 'rgba(16,185,129,.18)', border: '1px solid rgba(16,185,129,.45)', whiteSpace: 'nowrap' }}>{userDetails.activityText}</Box>
            )}
          </Box>
        </Box>
        {contextText != null && (
          <Box data-spec="esign-context" sx={{ m: '0 -22px', p: '9px 22px', borderRadius: '6px 6px 0 0', bgcolor: 'rgba(255,255,255,.1)', fontSize: 11.5, lineHeight: '16px', color: 'rgba(255,255,255,.85)', '& b': { color: '#fff', fontWeight: role.dialogTitle } }}>{contextText}</Box>
        )}
      </Box>
      <Box data-spec="esign-body" sx={{ p: '18px 22px 12px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
        {errorMessage != null && <Box sx={fullWidth}><Notification title={errorMessage} color="red" variant="fill" showClose={false} /></Box>}
        <FieldList fields={fields} notificationValues={notificationValues} beforeFields={beforeFields} userIdReadOnly={userIdReadOnly} gap="14px" />
      </Box>
      <Box data-spec="esign-footer" sx={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', p: '10px 18px', borderTop: `1px solid ${pt.colors.neutral[200]}`, bgcolor: pt.colors.neutral[50] }}>
        <Button variant="outlined" size="small" onClick={handleSecondary}>{secondaryButtonLabel}</Button>
        <Button size="small" onClick={handleSign} disabled={disableSign}>{signButtonLabel}</Button>
      </Box>
    </Box>
  );
}

function Panel({ fields = {}, userDetails = {}, notificationValues, signButtonLabel = 'Submit', secondaryButtonLabel = 'Cancel', handleSign, handleSecondary, errorMessage, disableSign }: PanelProps) {
  const showReason = (fields.type ?? 'reason') === 'reason' || !!fields.reason;
  const light = { ...textStyle('textL'), color: '#fff' };
  return (
    <Box data-spec="esign" sx={{ width: 560, maxWidth: '100%', boxSizing: 'border-box', p: '16px', display: 'flex', flexDirection: 'column', gap: '16px', bgcolor: pt.uiElements.popup.color.background, position: 'relative', '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', border: '1px solid #f1f5f9', pointerEvents: 'none' }, borderRadius: pt.uiElements.popup.radius.medium }}>
      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', background: BANNER, p: '16px', minHeight: 132, boxSizing: 'border-box', display: 'flex', alignItems: 'flex-end' }}>
        <Box aria-hidden sx={{ position: 'absolute', right: -40, top: -60, width: 220, height: 220, borderRadius: '50%', border: '28px solid rgba(189,227,248,0.18)' }} />
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '16px', width: '100%' }}>
          <Avatar data-spec="esign-avatar" src={userDetails.src} alt={userDetails.name} sx={{ width: 100, height: 100, flexShrink: 0, boxSizing: 'border-box', border: '4px solid #fff', bgcolor: '#d9d9d9', fontSize: 36 }}>{userDetails.name?.[0]}</Avatar>
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ ...textStyle('textXl', 'semiBold'), color: '#fff' }}>{userDetails.name}</Box>
                <Box sx={{ ...light, opacity: 0.85 }}>{userDetails.role}</Box>
              </Box>
              {userDetails.activityText && <Chip label={userDetails.activityText} size="xsmall" color="brand" shape="pill" />}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', ...light }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {userDetails.date && <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CalendarTodayOutlined sx={{ fontSize: 16 }} />{userDetails.date}</Box>}
                {userDetails.time && <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AccessTimeRounded sx={{ fontSize: 16 }} />{userDetails.time}</Box>}
              </Box>
              {userDetails.timeZone && (
                <Tooltip title={userDetails.timeZoneTooltip ?? ''} disableHoverListener={!userDetails.timeZoneTooltip} disableFocusListener={!userDetails.timeZoneTooltip}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}><PublicRounded sx={{ fontSize: 16 }} />{`(${userDetails.timeZone})${userDetails.timeZoneTooltip ? ` ${userDetails.timeZoneTooltip}` : ''}`}</Box>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {errorMessage != null && <Box sx={fullWidth}><Notification title={errorMessage} color="red" variant="fill" showClose={false} /></Box>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {showReason && (
          <Select
            size="small"
            label={fields.reason?.label ?? 'Reason for E-sign'}
            required
            options={fields.reason?.options ?? []}
            value={fields.reason?.value ?? ''}
            placeholder={fields.reason?.placeholder ?? 'Select a Reason'}
            error={fields.reason?.error}
            hint={fields.reason?.hint}
            onChange={(v) => fields.reason?.onChange?.(Array.isArray(v) ? (v[0] ?? '') : v)}
          />
        )}
        <TextField size="small" label={fields.userId?.label ?? 'User ID'} required placeholder={fields.userId?.placeholder ?? 'Enter User ID'} value={fields.userId?.value ?? ''} error={fields.userId?.error} hint={fields.userId?.hint} onChange={fields.userId?.onChange} />
        <TextField size="small" type="password" label={fields.password?.label ?? 'Password'} required placeholder={fields.password?.placeholder ?? 'Enter password'} value={fields.password?.value ?? ''} error={fields.password?.error} hint={fields.password?.hint} onChange={fields.password?.onChange} />
        <TextArea label={fields.comments?.label ?? 'Comments'} placeholder={fields.comments?.placeholder ?? 'Write a comment'} value={fields.comments?.value ?? ''} error={fields.comments?.error} hint={fields.comments?.hint} onChange={fields.comments?.onChange} />
        {notificationValues && <Box sx={fullWidth}><Notification title={notificationValues.title} body={notificationValues.description} color="blue" variant="fill" /></Box>}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Button variant="outlined" size="small" onClick={handleSecondary}>{secondaryButtonLabel}</Button>
        <Button size="small" onClick={handleSign} disabled={disableSign}>{signButtonLabel}</Button>
      </Box>
    </Box>
  );
}

/** Electronic signature (e-sign verification) dialog. */
export function ElectronicSignature({ open, handleFlyoutClose, inline, compact, ...rest }: ElectronicSignatureProps) {
  const body = compact ? <CompactPanel {...rest} handleClose={rest.handleClose ?? handleFlyoutClose} /> : <Panel {...rest} />;
  if (inline) return body;
  return (
    <Dialog
      open={open}
      onClose={handleFlyoutClose}
      maxWidth={false}
      aria-label="Electronic signature"
      slotProps={{
        ...(compact && { backdrop: { sx: { backgroundColor: 'rgba(15,30,80,.45)', backdropFilter: 'blur(2px)' } } }),
        paper: { sx: { borderRadius: compact ? '14px' : '8px', m: 2, maxHeight: 'calc(100% - 32px)', overflow: 'auto' } },
      }}
    >
      {body}
    </Dialog>
  );
}

/** Spelling used by the Pulse app. */
export const ElectonicSignature = ElectronicSignature;
