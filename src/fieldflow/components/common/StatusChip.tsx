import { Chip } from '@mui/material';
import type { TaskStatus, TaskPriority, SyncStatus } from '../../types';

interface StatusChipProps {
  status?: TaskStatus;
  priority?: TaskPriority;
  sync?: SyncStatus;
  size?: 'small' | 'medium';
}

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  assigned:    { label: 'Assigned',    color: '#00639B', bg: '#E0F2FF' },
  accepted:    { label: 'Accepted',    color: '#006A60', bg: '#D4F0EC' },
  en_route:    { label: 'En Route',    color: '#2457D6', bg: '#DCE4FF' },
  arrived:     { label: 'Arrived',     color: '#006A60', bg: '#D4F0EC' },
  in_progress: { label: 'In Progress', color: '#A06400', bg: '#FFF0CC' },
  paused:      { label: 'Paused',      color: '#6B4E16', bg: '#F5E6C8' },
  completed:   { label: 'Completed',   color: '#147A45', bg: '#D4EDDA' },
  submitted:   { label: 'Submitted',   color: '#2457D6', bg: '#DCE4FF' },
  approved:    { label: 'Approved',    color: '#147A45', bg: '#D4EDDA' },
  rejected:    { label: 'Rejected',    color: '#BA1A1A', bg: '#FFDAD6' },
  cancelled:   { label: 'Cancelled',   color: '#74747D', bg: '#EEEEF6' },
};

const priorityConfig: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  low:      { label: 'Low',      color: '#74747D', bg: '#EEEEF6' },
  medium:   { label: 'Medium',   color: '#A06400', bg: '#FFF0CC' },
  high:     { label: 'High',     color: '#00639B', bg: '#E0F2FF' },
  critical: { label: 'Critical', color: '#BA1A1A', bg: '#FFDAD6' },
};

const syncConfig: Record<SyncStatus, { label: string; color: string; bg: string }> = {
  synced:  { label: 'Synced',  color: '#147A45', bg: '#D4EDDA' },
  pending: { label: 'Pending', color: '#6B4E16', bg: '#F5E6C8' },
  syncing: { label: 'Syncing', color: '#2457D6', bg: '#DCE4FF' },
  failed:  { label: 'Sync Failed', color: '#BA1A1A', bg: '#FFDAD6' },
};

export default function StatusChip({ status, priority, sync, size = 'small' }: StatusChipProps) {
  let cfg: { label: string; color: string; bg: string } | null = null;
  if (status) cfg = statusConfig[status];
  else if (priority) cfg = priorityConfig[priority];
  else if (sync) cfg = syncConfig[sync];

  if (!cfg) return null;

  return (
    <Chip
      label={cfg.label}
      size={size}
      aria-label={`Status: ${cfg.label}`}
      sx={{
        color: cfg.color,
        bgcolor: cfg.bg,
        fontWeight: 700,
        fontSize: size === 'small' ? '0.6875rem' : '0.75rem',
        border: 'none',
        height: size === 'small' ? 24 : 28,
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
}
