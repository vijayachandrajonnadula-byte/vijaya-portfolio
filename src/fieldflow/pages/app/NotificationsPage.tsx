import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  CardActionArea,
  Divider,
  Button,
  Collapse,
} from '@mui/material';
import {
  ArrowBack,
  NotificationsNone,
  ErrorOutlined,
  Cancel,
  Sync,
  CheckCircle,
  WatchLater,
  CalendarToday,
  CameraAlt,
  Close,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../../stores';
import type { Notification } from '../../types';

dayjs.extend(relativeTime);

// ── notification type config ───────────────────────────────────────────────
const NOTIF_CONFIG: Record<
  Notification['type'],
  { icon: React.ReactNode; color: string; bg: string; filterGroup: string }
> = {
  new_assignment: {
    icon: <NotificationsNone sx={{ fontSize: 18 }} />,
    color: '#2457D6',
    bg: '#E8EFFF',
    filterGroup: 'Assignments',
  },
  critical_assignment: {
    icon: <ErrorOutlined sx={{ fontSize: 18 }} />,
    color: '#BA1A1A',
    bg: '#FDECEA',
    filterGroup: 'Assignments',
  },
  submission_rejected: {
    icon: <Cancel sx={{ fontSize: 18 }} />,
    color: '#BA1A1A',
    bg: '#FDECEA',
    filterGroup: 'Rejected',
  },
  pending_sync: {
    icon: <Sync sx={{ fontSize: 18 }} />,
    color: '#A06400',
    bg: '#FFF5E0',
    filterGroup: 'Sync',
  },
  task_approved: {
    icon: <CheckCircle sx={{ fontSize: 18 }} />,
    color: '#147A45',
    bg: '#D4EDDA',
    filterGroup: 'Assignments',
  },
  shift_ending: {
    icon: <WatchLater sx={{ fontSize: 18 }} />,
    color: '#A06400',
    bg: '#FFF5E0',
    filterGroup: 'Assignments',
  },
  schedule_updated: {
    icon: <CalendarToday sx={{ fontSize: 18 }} />,
    color: '#2457D6',
    bg: '#E8EFFF',
    filterGroup: 'Assignments',
  },
  missing_evidence: {
    icon: <CameraAlt sx={{ fontSize: 18 }} />,
    color: '#A06400',
    bg: '#FFF5E0',
    filterGroup: 'Assignments',
  },
  task_starts_soon: {
    icon: <WatchLater sx={{ fontSize: 18 }} />,
    color: '#2457D6',
    bg: '#E8EFFF',
    filterGroup: 'Assignments',
  },
};

const FILTER_TABS = ['All', 'Unread', 'Assignments', 'Rejected', 'Sync'] as const;
type FilterTab = (typeof FILTER_TABS)[number];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, markRead, markAllRead, dismiss, unreadCount } =
    useNotificationStore();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [showDismissed, setShowDismissed] = useState(false);

  const unread = unreadCount();

  const active = useMemo(
    () =>
      notifications.filter((n) => {
        if (n.dismissed) return false;
        if (activeFilter === 'Unread') return !n.read;
        if (activeFilter === 'Assignments')
          return NOTIF_CONFIG[n.type]?.filterGroup === 'Assignments';
        if (activeFilter === 'Rejected')
          return NOTIF_CONFIG[n.type]?.filterGroup === 'Rejected';
        if (activeFilter === 'Sync')
          return NOTIF_CONFIG[n.type]?.filterGroup === 'Sync';
        return true;
      }),
    [notifications, activeFilter],
  );

  const dismissed = useMemo(
    () => notifications.filter((n) => n.dismissed),
    [notifications],
  );

  const handleTap = useCallback(
    (n: Notification) => {
      markRead(n.id);
      if (n.taskId) navigate(`/field-flow/app/tasks/${n.taskId}`);
    },
    [markRead, navigate],
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh' }}>
      {/* ── AppBar ─────────────────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ px: 1, minHeight: 56, gap: 0.5 }}>
          <IconButton size="small" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowBack fontSize="small" />
          </IconButton>

          <Box sx={{ flex: 1, ml: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                Notifications
              </Typography>
              {unread > 0 && (
                <Chip
                  label={unread}
                  size="small"
                  sx={{
                    height: 18,
                    bgcolor: '#BA1A1A',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.6875rem',
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              )}
            </Box>
          </Box>

          {unread > 0 && (
            <Button
              size="small"
              onClick={markAllRead}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: 'primary.main',
              }}
            >
              Mark all read
            </Button>
          )}
        </Toolbar>

        {/* Filter chips */}
        <Box
          sx={{
            px: 2,
            pb: 1,
            display: 'flex',
            gap: 0.75,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {FILTER_TABS.map((tab) => (
            <Chip
              key={tab}
              label={tab}
              size="small"
              onClick={() => setActiveFilter(tab)}
              sx={{
                fontWeight: activeFilter === tab ? 700 : 500,
                bgcolor: activeFilter === tab ? 'primary.main' : 'action.hover',
                color: activeFilter === tab ? '#fff' : 'text.secondary',
                flexShrink: 0,
                '&:hover': {
                  bgcolor: activeFilter === tab ? 'primary.dark' : 'action.selected',
                },
              }}
            />
          ))}
        </Box>
      </AppBar>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <Box sx={{ pb: '80px' }}>
        {active.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
            <Typography sx={{ fontSize: '2rem', mb: 1 }}>🎉</Typography>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>You're all caught up</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              No notifications to show for this filter.
            </Typography>
          </Box>
        )}

        <AnimatePresence initial={false}>
          {active.map((notif, idx) => (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <NotifRow
                notif={notif}
                isLast={idx === active.length - 1}
                onTap={handleTap}
                onDismiss={dismiss}
                onOpenTask={(id) => navigate(`/field-flow/app/tasks/${id}`)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ── Dismissed section ──────────────────────────────────────────── */}
        {dismissed.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <CardActionArea
              onClick={() => setShowDismissed((v) => !v)}
              sx={{ px: 2, py: 1 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}
                >
                  Show dismissed ({dismissed.length})
                </Typography>
                {showDismissed ? (
                  <ExpandLess sx={{ fontSize: 16, color: 'text.secondary' }} />
                ) : (
                  <ExpandMore sx={{ fontSize: 16, color: 'text.secondary' }} />
                )}
              </Box>
            </CardActionArea>

            <Collapse in={showDismissed}>
              {dismissed.map((notif, idx) => (
                <NotifRow
                  key={notif.id}
                  notif={notif}
                  isLast={idx === dismissed.length - 1}
                  onTap={handleTap}
                  onDismiss={dismiss}
                  onOpenTask={(id) => navigate(`/field-flow/app/tasks/${id}`)}
                  isDimmed
                />
              ))}
            </Collapse>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── NotifRow ─────────────────────────────────────────────────────────────
interface NotifRowProps {
  notif: Notification;
  isLast: boolean;
  isDimmed?: boolean;
  onTap: (n: Notification) => void;
  onDismiss: (id: string) => void;
  onOpenTask: (taskId: string) => void;
}

function NotifRow({ notif, isLast, isDimmed, onTap, onDismiss, onOpenTask }: NotifRowProps) {
  const config = NOTIF_CONFIG[notif.type] ?? {
    icon: <NotificationsNone sx={{ fontSize: 18 }} />,
    color: '#74747D',
    bg: '#EEEEF6',
    filterGroup: '',
  };

  const isUnread = !notif.read && !notif.dismissed;

  return (
    <>
      <Box
        sx={{
          bgcolor: isUnread ? 'rgba(36,87,214,0.04)' : 'transparent',
          opacity: isDimmed ? 0.5 : 1,
          position: 'relative',
        }}
      >
        <CardActionArea onClick={() => onTap(notif)} sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            {/* Icon */}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: config.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: config.color,
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              {config.icon}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: isUnread ? 700 : 500,
                      color: 'text.primary',
                      mb: 0.25,
                    }}
                  >
                    {notif.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      color: 'text.secondary',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4,
                    }}
                  >
                    {notif.body}
                  </Typography>
                </Box>

                {/* Dismiss button */}
                {!notif.dismissed && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss(notif.id);
                    }}
                    sx={{ p: 0.25, color: 'text.secondary', flexShrink: 0 }}
                    aria-label="Dismiss"
                  >
                    <Close sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Box>

              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75, flexWrap: 'wrap' }}
              >
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  {dayjs(notif.timestamp).fromNow()}
                </Typography>

                {/* Unread dot */}
                {isUnread && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#2457D6',
                      flexShrink: 0,
                    }}
                  />
                )}

                {/* Open Task chip */}
                {notif.taskId && (
                  <Chip
                    label="Open Task"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTask(notif.taskId!);
                    }}
                    sx={{
                      height: 20,
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      bgcolor: 'action.hover',
                      color: 'primary.main',
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </CardActionArea>
      </Box>
      {!isLast && <Divider />}
    </>
  );
}
