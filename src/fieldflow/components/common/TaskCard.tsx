import { Box, Card, CardActionArea, Typography, Stack, Chip } from '@mui/material';
import {
  AccessTime,
  LocationOn,
  Assignment,
  CloudOff,
  CloudDone,
  Sync,
  ErrorOutlined,
  PhotoCamera,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import type { Task } from '../../types';
import StatusChip from './StatusChip';
import { mockCustomers } from '../../data';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  compact?: boolean;
}

const priorityDot: Record<string, string> = {
  low: '#74747D',
  medium: '#A06400',
  high: '#00639B',
  critical: '#BA1A1A',
};

function SyncIcon({ status }: { status: Task['syncStatus'] }) {
  if (status === 'synced') return <CloudDone sx={{ fontSize: 14, color: '#147A45' }} />;
  if (status === 'syncing') return <Sync sx={{ fontSize: 14, color: '#2457D6' }} />;
  if (status === 'failed') return <ErrorOutlined sx={{ fontSize: 14, color: '#BA1A1A' }} />;
  return <CloudOff sx={{ fontSize: 14, color: '#6B4E16' }} />;
}

export default function TaskCard({ task, onClick, compact }: TaskCardProps) {
  const customer = mockCustomers.find((c) => c.id === task.customerId);
  const startTime = dayjs(task.scheduledStart).format('HH:mm');
  const endTime = dayjs(task.scheduledEnd).format('HH:mm');

  return (
    <Card
      sx={{
        borderLeft: `4px solid ${priorityDot[task.priority]}`,
        mb: 1.5,
        borderRadius: 2,
        overflow: 'hidden',
        opacity: task.status === 'cancelled' ? 0.6 : 1,
      }}
    >
      <CardActionArea onClick={onClick} sx={{ p: 0 }}>
        <Box sx={{ p: compact ? 1.5 : 2 }}>
          {/* Header row */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}
          >
            <Box sx={{ flex: 1, mr: 1 }}>
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ alignItems: 'center', mb: 0.25 }}
              >
                <Assignment sx={{ fontSize: 12, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {task.workOrderNumber}
                </Typography>
                <SyncIcon status={task.syncStatus} />
              </Stack>
              <Typography
                variant={compact ? 'body2' : 'subtitle2'}
                sx={{
                  fontWeight: 700,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {task.title}
              </Typography>
            </Box>
            <Stack spacing={0.5} sx={{ alignItems: 'flex-end' }}>
              <StatusChip status={task.status} />
              <StatusChip priority={task.priority} />
            </Stack>
          </Stack>

          {/* Customer */}
          {customer && !compact && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mb: 1 }}
            >
              {customer.name}
            </Typography>
          )}

          {/* Details row */}
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <AccessTime sx={{ fontSize: 12, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {startTime} – {endTime}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <LocationOn sx={{ fontSize: 12, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {task.distanceKm} km · {task.address.city}
              </Typography>
            </Stack>
            {task.requiresEvidence && (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <PhotoCamera sx={{ fontSize: 12, color: '#A06400' }} />
                <Typography variant="caption" sx={{ color: '#A06400' }}>
                  Evidence req.
                </Typography>
              </Stack>
            )}
          </Stack>

          {/* Tags */}
          {!compact && task.tags.length > 0 && (
            <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap' }}>
              {task.tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{ height: 20, fontSize: '0.625rem', bgcolor: '#F0F2FF', color: '#2457D6' }}
                />
              ))}
            </Stack>
          )}

          {/* Paused state */}
          {task.status === 'paused' && task.pauseReason && (
            <Box
              sx={{
                mt: 1,
                p: 1,
                borderRadius: 1,
                bgcolor: '#F5E6C8',
                border: '1px solid #E8D4A0',
              }}
            >
              <Typography variant="caption" sx={{ color: '#6B4E16', fontWeight: 600 }}>
                Paused: {task.pauseReason.replace('_', ' ')}
              </Typography>
            </Box>
          )}

          {/* Rejected state */}
          {task.status === 'rejected' && task.supervisorComment && (
            <Box
              sx={{
                mt: 1,
                p: 1,
                borderRadius: 1,
                bgcolor: '#FFDAD6',
                border: '1px solid #F5B8B4',
              }}
            >
              <Typography variant="caption" sx={{ color: '#BA1A1A', fontWeight: 600 }}>
                Rejected – correction required
              </Typography>
            </Box>
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
}
