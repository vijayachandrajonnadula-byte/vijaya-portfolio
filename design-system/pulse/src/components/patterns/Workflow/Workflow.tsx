/**
 * Figma page "Workflow": set "Workflow Card" (Interaction = Default | Active | Zero State), 320x116.
 * WorkflowStep is the card; WorkflowDiagram lays steps out with connectors between them.
 * The Active card shows two connector handles (circle 24px, brand 500): bottom-centre and right-middle.
 */
import { fw } from '../../../theme/typography';
import { Fragment } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import MoreVertRounded from '@mui/icons-material/MoreVertRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Avatar, AvatarGroup } from '../../data-display/Avatar/Avatar';
import { Status } from '../../data-display/Status/Status';
import type { StatusProps } from '../../data-display/Status/Status';
import { pt, num } from '../../../theme/pulseTokens';

const brand = pt.colors.brand;
const neutral = pt.colors.neutral;
const primaryText = neutral[900];
const secondaryText = neutral[500];

export interface WorkflowStepAssignee {
  /** Initials shown in the avatar. */
  initials: string;
  name?: string;
}
export interface WorkflowStepDetail {
  label: string;
  value: string;
}
export interface WorkflowStepProps {
  /** default | active (selected, shows connector handles) | zeroState (empty placeholder). @default "default" */
  interaction?: 'default' | 'active' | 'zeroState';
  /** Step name (semibold, brand 500). */
  title?: string;
  /** Rows under the title, e.g. { label: 'Team', value: 'Quality' }. */
  details?: WorkflowStepDetail[];
  assignees?: WorkflowStepAssignee[];
  /** Status chip shown at the top right when not active. */
  status?: { label: string; color?: StatusProps['color'] };
  /** Zero-state texts. */
  emptyTitle?: string;
  emptyDescription?: string;
  onClick?: () => void;
  onMenuClick?: () => void;
  /** Fixed width. @default 320 */
  width?: number | string;
  sx?: SxProps<Theme>;
}

const avatarColors = [brand[500], pt.colors.accent.teal[600], pt.colors.accent.purple[600], pt.colors.accent.orange[600]];

function AvatarStack({ people }: { people: WorkflowStepAssignee[] }) {
  return (
    // Pulse AvatarGroup / Xsmall (Figma: Workflow Card > Head > AvatarGroup), not hand-drawn circles.
    <AvatarGroup size="xsmall" max={4}>
      {people.map((p, i) => (
        <Avatar key={`${p.initials}${i}`} size="xsmall" alt={p.name} backgroundColor={avatarColors[i % avatarColors.length]} textColor="#fff">
          {p.initials}
        </Avatar>
      ))}
    </AvatarGroup>
  );
}

/** Connector handle: Figma instance IconButton Xsmall / Circle / Contained / Primary. */
function Handle({ sx }: { sx: SxProps<Theme> }) {
  return (
    <Box sx={[{ position: 'absolute', display: 'flex' }, ...(Array.isArray(sx) ? sx : [sx])] as SxProps<Theme>}>
      <IconButton ariaLabel="Add step" size="xsmall" shape="circle" variant="contained"><AddRounded /></IconButton>
    </Box>
  );
}

/** Workflow node: assigned team, group details, status. */
export function WorkflowStep({ interaction = 'default', title = 'Step name', details = [], assignees = [], status, emptyTitle = 'No team assigned', emptyDescription = 'Assign a team to this step', onClick, onMenuClick, width = 320, sx }: WorkflowStepProps) {
  const zero = interaction === 'zeroState';
  const active = interaction === 'active';
  const base = {
    position: 'relative' as const,
    boxSizing: 'border-box' as const,
    width,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    p: zero || active ? '11px' : '12px',
    borderRadius: pt.radius.m,
    cursor: onClick ? 'pointer' : 'default',
    bgcolor: zero ? neutral[50] : brand[25],
    border: zero ? `1px dashed ${neutral[300]}` : active ? `1px solid ${brand[500]}` : '0 solid transparent',
    textAlign: 'left' as const,
    font: 'inherit',
  };
  const interactive = onClick ? { role: 'button', tabIndex: 0, onClick, onKeyDown: (e: KeyboardEvent<HTMLElement>) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } } } : {};
  const text = { fontSize: 12, lineHeight: '20px' };

  if (zero) {
    return (
      <Box data-spec="workflow-step zeroState" {...interactive} sx={[base, { alignItems: 'center', gap: '8px', minHeight: 112 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>}>
        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: neutral[200], color: neutral[400], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GroupsRounded />
        </Box>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Box sx={{ ...text, fontWeight: fw.semiBold, color: brand[500] }}>{emptyTitle}</Box>
          <Box sx={{ ...text, fontWeight: fw.medium, color: secondaryText }}>{emptyDescription}</Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box data-spec={`workflow-step ${interaction}`} {...interactive} sx={[base, { gap: '8px', minHeight: 116 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', height: 24 }}>
        <AvatarStack people={assignees} />
        {active ? (
          <IconButton ariaLabel="Step options" size="xsmall" onClick={onMenuClick as never}><MoreVertRounded /></IconButton>
        ) : (
          status && <Status type="chip" label={status.label} color={status.color ?? 'blue'} />
        )}
      </Box>
      <Box>
        <Box sx={{ ...text, fontWeight: fw.semiBold, color: brand[500] }}>{title}</Box>
        {details.map((d) => (
          <Box key={d.label} sx={{ display: 'flex', gap: '8px', ...text, minWidth: 0 }}>
            <Box component="span" sx={{ fontWeight: fw.medium, color: secondaryText, flexShrink: 0 }}>{d.label}</Box>
            <Box component="span" sx={{ fontWeight: fw.semiBold, color: primaryText, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.value}</Box>
          </Box>
        ))}
      </Box>
      {active && (
        <>
          <Handle sx={{ left: '50%', bottom: -12, transform: 'translateX(-50%)' }} />
          <Handle sx={{ right: -12, top: '50%', transform: 'translateY(-50%)' }} />
        </>
      )}
    </Box>
  );
}

export interface WorkflowDiagramStep extends Omit<WorkflowStepProps, 'onClick' | 'sx'> {
  id: string;
}
export interface WorkflowDiagramProps {
  steps: WorkflowDiagramStep[];
  /** Id of the selected step (rendered as `active`). */
  activeId?: string | null;
  onStepClick?: (id: string) => void;
  /** @default "row" */
  direction?: 'row' | 'column';
  /** Connector length in px. @default 40 */
  connectorLength?: number;
  sx?: SxProps<Theme>;
}

function Connector({ direction, length }: { direction: 'row' | 'column'; length: number }): ReactNode {
  const row = direction === 'row';
  return (
    <Box aria-hidden sx={{ position: 'relative', flexShrink: 0, width: row ? length : 2, height: row ? 2 : length, bgcolor: brand[500], alignSelf: 'center' }}>
      <Box sx={{ position: 'absolute', ...(row ? { right: -1, top: -4, borderLeft: `6px solid ${brand[500]}`, borderTop: '5px solid transparent', borderBottom: '5px solid transparent' } : { bottom: -1, left: -4, borderTop: `6px solid ${brand[500]}`, borderLeft: '5px solid transparent', borderRight: '5px solid transparent' }) }} />
    </Box>
  );
}

/** Sequence of workflow steps joined by arrow connectors. */
export function WorkflowDiagram({ steps, activeId, onStepClick, direction = 'row', connectorLength = num(pt.spacing['15xl']), sx }: WorkflowDiagramProps) {
  return (
    <Box role="list" sx={[{ display: 'flex', flexDirection: direction, alignItems: direction === 'row' ? 'center' : 'flex-start', width: 'fit-content' }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>}>
      {steps.map((s, i) => {
        const { id, interaction, ...rest } = s;
        const effective = interaction === 'zeroState' ? 'zeroState' : activeId === id ? 'active' : (interaction ?? 'default');
        return (
          <Fragment key={id}>
            {i > 0 && <Connector direction={direction} length={connectorLength} />}
            <Box role="listitem"><WorkflowStep {...rest} interaction={effective} onClick={onStepClick ? () => onStepClick(id) : undefined} /></Box>
          </Fragment>
        );
      })}
    </Box>
  );
}


