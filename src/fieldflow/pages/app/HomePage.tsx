import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
  IconButton,
  Avatar,
  Badge,
  Chip,
  LinearProgress,
  Divider,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  NotificationsNone,
  LocationOn,
  AccessTime,
  Assignment,
  PlayArrow,
  NavigateNext,
  Refresh,
  QrCodeScanner,
  Sync,
  WifiOff,
  WarningAmber,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useAuthStore,
  useTaskStore,
  useOfflineStore,
  useSyncStore,
  useNotificationStore,
  useDemoStore,
} from '../../stores';
import { mockCustomers } from '../../data';
import StatusChip from '../../components/common/StatusChip';
import type { Task } from '../../types';

// ─── priority colour map ─────────────────────────────────────────────────
const PRIORITY_DOT: Record<string, string> = {
  low: '#74747D',
  medium: '#A06400',
  high: '#00639B',
  critical: '#BA1A1A',
};

const DONE_STATUSES: Task['status'][] = ['completed', 'submitted', 'approved'];
const ACTIVE_STATUSES: Task['status'][] = [
  'assigned',
  'accepted',
  'en_route',
  'arrived',
  'in_progress',
  'paused',
];

// ─── helpers ─────────────────────────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function hoursWorked(shiftStart?: string): string {
  if (!shiftStart) return '0h 0m';
  const mins = dayjs().diff(dayjs(shiftStart), 'minute');
  if (mins < 0) return '0h 0m';
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── main component ───────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();

  const { technician, updateShiftStatus } = useAuthStore();
  const { getTodayTasks } = useTaskStore();
  const { isOffline, toggleSimulated } = useOfflineStore();
  const { queue } = useSyncStore();
  const { unreadCount } = useNotificationStore();
  const { showDemoControls } = useDemoStore();

  const [refreshing, setRefreshing] = useState(false);
  const [snackText, setSnackText] = useState<string | null>(null);

  const todayTasks = getTodayTasks();
  const assignedCount = todayTasks.filter((t) => t.status === 'assigned').length;
  const inProgressCount = todayTasks.filter((t) => t.status === 'in_progress').length;
  const completedCount = todayTasks.filter((t) => DONE_STATUSES.includes(t.status)).length;
  const pendingSyncCount = queue.filter((q) => q.status === 'pending').length;

  const nextTask = todayTasks.find(
    (t) => ACTIVE_STATUSES.includes(t.status) && t.status !== 'completed',
  );

  const shiftJobsCompleted = completedCount;
  const shiftJobsRemaining = todayTasks.filter(
    (t) => !DONE_STATUSES.includes(t.status) && t.status !== 'cancelled',
  ).length;

  const alerts = todayTasks
    .filter((t) => t.priority === 'critical' || t.status === 'rejected')
    .slice(0, 3);

  const routeTasks = [...todayTasks]
    .sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime())
    .slice(0, 5);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2800);
  }, []);

  const handleRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showSnack('Dashboard refreshed');
    }, 1200);
  }, [refreshing, showSnack]);

  const handleShiftToggle = useCallback(() => {
    if (!technician) return;
    if (technician.shiftStatus === 'on_shift') {
      updateShiftStatus('off_shift');
      showSnack('Shift ended. Have a safe journey home.');
    } else {
      updateShiftStatus('on_shift');
      showSnack('Shift started. Good luck today!');
    }
  }, [technician, updateShiftStatus, showSnack]);

  const isOnShift = technician?.shiftStatus === 'on_shift';
  const unread = unreadCount();
  const firstName = technician?.name?.split(' ')[0] ?? 'Technician';

  // ─── section label helper ──────────────────────────────────────────────
  function SectionLabel({ children }: { children: string }) {
    return (
      <Typography
        sx={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          mb: 1,
        }}
      >
        {children}
      </Typography>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', position: 'relative' }}>

      {/* ── Sticky AppBar ───────────────────────────────────────────────── */}
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
        <Toolbar sx={{ px: 2, minHeight: 60, gap: 1 }}>
          {/* greeting + date */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: isOffline ? '#BA1A1A' : '#147A45',
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {getGreeting()}, {firstName}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {dayjs().format('dddd, D MMMM YYYY')}
            </Typography>
          </Box>

          {/* refresh */}
          <IconButton
            size="small"
            onClick={handleRefresh}
            aria-label="Refresh dashboard"
            sx={{
              color: 'text.secondary',
              animation: refreshing ? 'spin 0.8s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          >
            <Refresh fontSize="small" />
          </IconButton>

          {/* notifications */}
          <IconButton
            size="small"
            onClick={() => navigate('/field-flow/app/notifications')}
            aria-label={`Notifications, ${unread} unread`}
          >
            <Badge badgeContent={unread} color="error" max={9}>
              <NotificationsNone fontSize="small" />
            </Badge>
          </IconButton>

          {/* avatar */}
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: '#2457D6',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            aria-label="User profile"
          >
            {technician?.avatarInitials ?? 'AM'}
          </Avatar>
        </Toolbar>
        {refreshing && <LinearProgress sx={{ height: 2 }} />}
      </AppBar>

      {/* ── Page content ────────────────────────────────────────────────── */}
      <Box sx={{ px: 2, pt: 2, pb: 3 }}>

        {/* ── Shift Card ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.35, ease: 'easeOut' }}
        >
          <Card
            sx={{
              mb: 2,
              borderRadius: 3,
              background: isOnShift
                ? 'linear-gradient(135deg, #1A3FA8 0%, #2457D6 60%, #5C7FE0 100%)'
                : 'linear-gradient(135deg, #3D3D4A 0%, #5A5B64 100%)',
              border: 'none',
              color: '#fff',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                {/* left: status + hours */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: isOnShift ? '#7FFFC4' : '#BBBBCC',
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.85)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                      }}
                    >
                      {isOnShift ? 'Shift Active' : 'Off Shift'}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: isOnShift ? '#fff' : 'rgba(255,255,255,0.5)',
                      lineHeight: 1.1,
                    }}
                  >
                    {isOnShift && technician?.shiftStart
                      ? hoursWorked(technician.shiftStart)
                      : '--'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                    {isOnShift ? 'hours worked today' : 'Start your shift to begin'}
                  </Typography>
                </Box>

                {/* right: job pills */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, alignItems: 'flex-end' }}>
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: 13, color: '#7FFFC4 !important' }} />}
                    label={`${shiftJobsCompleted} done`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.6875rem',
                      height: 24,
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                  <Chip
                    icon={
                      <RadioButtonUnchecked
                        sx={{ fontSize: 13, color: 'rgba(255,255,255,0.7) !important' }}
                      />
                    }
                    label={`${shiftJobsRemaining} remaining`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.85)',
                      fontWeight: 600,
                      fontSize: '0.6875rem',
                      height: 24,
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                startIcon={isOnShift ? null : <PlayArrow />}
                onClick={handleShiftToggle}
                sx={{
                  bgcolor: isOnShift ? 'rgba(255,255,255,0.18)' : '#fff',
                  color: isOnShift ? '#fff' : '#1A3FA8',
                  fontWeight: 700,
                  borderRadius: '100px',
                  height: 44,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: isOnShift
                      ? 'rgba(255,255,255,0.28)'
                      : 'rgba(255,255,255,0.92)',
                  },
                  boxShadow: 'none',
                }}
              >
                {isOnShift ? 'End Shift' : 'Start Shift'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Next Task ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07, duration: 0.35, ease: 'easeOut' }}
        >
          <SectionLabel>Next Task</SectionLabel>

          <AnimatePresence mode="wait">
            {nextTask ? (
              <NextTaskCard
                key={nextTask.id}
                task={nextTask}
                onNavigate={() => showSnack('Opening maps...')}
                onStart={() => navigate(`/field-flow/app/tasks/${nextTask.id}`)}
              />
            ) : (
              <motion.div
                key="empty-next"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card sx={{ mb: 2, borderRadius: 3 }}>
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      py: 3,
                      '&:last-child': { pb: 3 },
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 36, color: '#147A45', mb: 1 }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                      All tasks for today are done
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      Great work! Check back tomorrow for new assignments.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Today's Summary ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.35, ease: 'easeOut' }}
        >
          <SectionLabel>Today's Summary</SectionLabel>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mb: 2,
              overflowX: 'auto',
              pb: 0.5,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {[
              { label: 'Assigned', count: assignedCount, color: '#00639B', bg: '#E0F2FF' },
              { label: 'In Progress', count: inProgressCount, color: '#A06400', bg: '#FFF0CC' },
              { label: 'Completed', count: completedCount, color: '#147A45', bg: '#D4EDDA' },
              { label: 'Pending Sync', count: pendingSyncCount, color: '#6B4E16', bg: '#F5E6C8' },
            ].map((s) => (
              <Box
                key={s.label}
                sx={{
                  flexShrink: 0,
                  bgcolor: s.bg,
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                  minWidth: 78,
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{ fontSize: '1.375rem', fontWeight: 800, color: s.color, lineHeight: 1.1 }}
                >
                  {s.count}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: s.color,
                    lineHeight: 1.2,
                    display: 'block',
                  }}
                >
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* ── Today's Route ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.21, duration: 0.35, ease: 'easeOut' }}
        >
          <SectionLabel>Today's Route</SectionLabel>

          <Card sx={{ mb: 2, borderRadius: 3, overflow: 'hidden' }}>
            {routeTasks.length === 0 ? (
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Typography
                  sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center' }}
                >
                  No tasks scheduled for today
                </Typography>
              </CardContent>
            ) : (
              routeTasks.map((task, idx) => {
                const isActive =
                  task.status === 'in_progress' || task.status === 'arrived';
                const isDone = DONE_STATUSES.includes(task.status);
                return (
                  <Box key={task.id}>
                    <CardActionArea
                      onClick={() => navigate(`/field-flow/app/tasks/${task.id}`)}
                      sx={{
                        px: 2,
                        py: 1.25,
                        borderLeft: isActive
                          ? '3px solid #2457D6'
                          : '3px solid transparent',
                        bgcolor: isActive ? '#F4F6FF' : 'transparent',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        {/* index circle */}
                        <Box
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            bgcolor: isDone
                              ? '#D4EDDA'
                              : isActive
                              ? '#2457D6'
                              : '#EEEEF6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {isDone ? (
                            <CheckCircle sx={{ fontSize: 14, color: '#147A45' }} />
                          ) : (
                            <Typography
                              sx={{
                                fontSize: '0.6rem',
                                fontWeight: 800,
                                color: isActive ? '#fff' : '#5A5B64',
                              }}
                            >
                              {idx + 1}
                            </Typography>
                          )}
                        </Box>

                        {/* priority dot */}
                        <Box
                          sx={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            bgcolor: PRIORITY_DOT[task.priority],
                            flexShrink: 0,
                          }}
                        />

                        {/* task info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: isActive ? 700 : 600,
                              color: isDone ? 'text.secondary' : 'text.primary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              textDecoration: isDone ? 'line-through' : 'none',
                            }}
                          >
                            {task.title}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.75,
                            }}
                          >
                            <AccessTime sx={{ fontSize: 10, color: 'text.secondary' }} />
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                              {dayjs(task.scheduledStart).format('HH:mm')}
                            </Typography>
                            <LocationOn sx={{ fontSize: 10, color: 'text.secondary' }} />
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                color: 'text.secondary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {task.distanceKm} km
                            </Typography>
                          </Box>
                        </Box>

                        {/* status + chevron */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            flexShrink: 0,
                          }}
                        >
                          <StatusChip status={task.status} size="small" />
                          <NavigateNext sx={{ fontSize: 16, color: 'text.secondary' }} />
                        </Box>
                      </Box>
                    </CardActionArea>
                    {idx < routeTasks.length - 1 && <Divider sx={{ ml: 7 }} />}
                  </Box>
                );
              })
            )}
          </Card>
        </motion.div>

        {/* ── Alerts ──────────────────────────────────────────────────────── */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.35, ease: 'easeOut' }}
          >
            <SectionLabel>Alerts</SectionLabel>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {alerts.map((task) => {
                const isRejected = task.status === 'rejected';
                const bg = isRejected ? '#FFF0EE' : '#FFF5E0';
                const borderColor = isRejected ? '#F5B8B4' : '#E8D4A0';
                const iconColor = isRejected ? '#BA1A1A' : '#A06400';
                const textColor = isRejected ? '#BA1A1A' : '#6B4E16';

                return (
                  <CardActionArea
                    key={task.id}
                    onClick={() => navigate(`/field-flow/app/tasks/${task.id}`)}
                    sx={{ borderRadius: 2 }}
                  >
                    <Box
                      sx={{
                        bgcolor: bg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: 2,
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.25,
                      }}
                    >
                      <WarningAmber
                        sx={{ fontSize: 18, color: iconColor, mt: 0.1, flexShrink: 0 }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 0.25,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: textColor,
                            }}
                          >
                            {task.workOrderNumber}
                          </Typography>
                          <StatusChip priority={task.priority} size="small" />
                          {isRejected && <StatusChip status={task.status} size="small" />}
                        </Box>
                        <Typography
                          sx={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: textColor,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {task.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: textColor, opacity: 0.85 }}>
                          {isRejected
                            ? 'Submission rejected — tap to review and resubmit'
                            : `Critical priority · ${task.address.city} · ${task.distanceKm} km`}
                        </Typography>
                      </Box>
                      <NavigateNext sx={{ fontSize: 18, color: textColor, flexShrink: 0 }} />
                    </Box>
                  </CardActionArea>
                );
              })}
            </Box>
          </motion.div>
        )}

        {/* ── Offline alert ────────────────────────────────────────────────── */}
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.35, ease: 'easeOut' }}
          >
            <Alert
              icon={<WifiOff fontSize="small" />}
              severity="warning"
              sx={{ mb: 2, borderRadius: 2 }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                You are offline
              </Typography>
              <Typography sx={{ fontSize: '0.75rem' }}>
                {pendingSyncCount > 0
                  ? `${pendingSyncCount} item${pendingSyncCount !== 1 ? 's' : ''} queued for sync when connection is restored.`
                  : 'Your work is saved locally and will sync when you reconnect.'}
              </Typography>
            </Alert>
          </motion.div>
        )}

        {/* ── Quick Actions ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.35, ease: 'easeOut' }}
        >
          <SectionLabel>Quick Actions</SectionLabel>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1.25,
              mb: 2,
            }}
          >
            {[
              {
                label: 'Scan Asset',
                icon: <QrCodeScanner sx={{ fontSize: 24, color: '#2457D6' }} />,
                bg: '#EEF2FF',
                route: '/field-flow/app/scan',
                badge: 0,
              },
              {
                label: 'Sync Centre',
                icon: <Sync sx={{ fontSize: 24, color: '#006A60' }} />,
                bg: '#E6F7F5',
                route: '/field-flow/app/sync-centre',
                badge: pendingSyncCount,
              },
              {
                label: 'Notifications',
                icon: <NotificationsNone sx={{ fontSize: 24, color: '#A06400' }} />,
                bg: '#FFF5E0',
                route: '/field-flow/app/notifications',
                badge: unread,
              },
              {
                label: 'Supervisor Panel',
                icon: <Assignment sx={{ fontSize: 24, color: '#BA1A1A' }} />,
                bg: '#FFF0EE',
                route: '/field-flow/app/supervisor',
                badge: 0,
              },
            ].map((action) => (
              <CardActionArea
                key={action.label}
                onClick={() => navigate(action.route)}
                sx={{ borderRadius: 2.5 }}
              >
                <Box
                  sx={{
                    bgcolor: action.bg,
                    borderRadius: 2.5,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.75,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    {action.icon}
                    {action.badge > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: -6,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: '#BA1A1A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          sx={{ fontSize: '0.55rem', fontWeight: 800, color: '#fff' }}
                        >
                          {action.badge > 9 ? '9+' : action.badge}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      color: 'text.primary',
                    }}
                  >
                    {action.label}
                  </Typography>
                </Box>
              </CardActionArea>
            ))}
          </Box>
        </motion.div>

      </Box>

      {/* ── Demo Controls bar ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDemoControls && (
          <motion.div
            key="demo-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'sticky', bottom: 0, zIndex: 10 }}
          >
            <Box
              sx={{
                bgcolor: '#1A1B1F',
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    bgcolor: '#FFF0CC',
                    color: '#6B4E16',
                    borderRadius: '100px',
                    px: 1,
                    py: 0.25,
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                  }}
                >
                  Demo Mode
                </Box>
                {isOffline && (
                  <Typography
                    sx={{ fontSize: '0.75rem', color: '#FF8A8A', fontWeight: 600 }}
                  >
                    Offline simulated
                  </Typography>
                )}
              </Box>

              <Button
                size="small"
                variant="outlined"
                startIcon={
                  isOffline ? (
                    <WifiOff sx={{ fontSize: 14 }} />
                  ) : (
                    <Sync sx={{ fontSize: 14 }} />
                  )
                }
                onClick={toggleSimulated}
                sx={{
                  color: isOffline ? '#FF8A8A' : '#7FFFC4',
                  borderColor: isOffline ? '#FF8A8A' : '#7FFFC4',
                  borderRadius: '100px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  py: 0.25,
                  '&:hover': {
                    borderColor: isOffline ? '#FF8A8A' : '#7FFFC4',
                    bgcolor: isOffline
                      ? 'rgba(255,138,138,0.1)'
                      : 'rgba(127,255,196,0.1)',
                  },
                }}
              >
                {isOffline ? 'Go Online' : 'Simulate Offline'}
              </Button>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Snackbar ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {snackText && (
          <motion.div
            key="snack"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed',
              bottom: showDemoControls ? 72 : 88,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1400,
              pointerEvents: 'none',
              maxWidth: 'calc(100vw - 32px)',
            }}
          >
            <Box
              sx={{
                bgcolor: '#1A1B1F',
                color: '#fff',
                borderRadius: '100px',
                px: 2.5,
                py: 1,
                fontSize: '0.875rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                boxShadow: 4,
              }}
            >
              {snackText}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

    </Box>
  );
}

// ─── Next Task Card ───────────────────────────────────────────────────────
interface NextTaskCardProps {
  task: Task;
  onNavigate: () => void;
  onStart: () => void;
}

function NextTaskCard({ task, onNavigate, onStart }: NextTaskCardProps) {
  const customer = mockCustomers.find((c) => c.id === task.customerId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          borderLeft: `4px solid ${PRIORITY_DOT[task.priority]}`,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1.25,
            }}
          >
            <Box sx={{ flex: 1, mr: 1, minWidth: 0 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.35 }}
              >
                <Assignment sx={{ fontSize: 11, color: 'text.secondary' }} />
                <Typography
                  sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600 }}
                >
                  {task.workOrderNumber}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.3,
                }}
              >
                {task.title}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                alignItems: 'flex-end',
                flexShrink: 0,
              }}
            >
              <StatusChip status={task.status} />
              <StatusChip priority={task.priority} />
            </Box>
          </Box>

          {/* customer name */}
          {customer && (
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: 'text.secondary',
                fontWeight: 600,
                display: 'block',
                mb: 1,
              }}
            >
              {customer.name}
            </Typography>
          )}

          {/* time + location */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <AccessTime sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                {dayjs(task.scheduledStart).format('HH:mm')} –{' '}
                {dayjs(task.scheduledEnd).format('HH:mm')} ·{' '}
                {formatDuration(task.estimatedDuration)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <LocationOn sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {task.address.line1}, {task.address.city} · {task.distanceKm} km away
              </Typography>
            </Box>
          </Box>

          {/* actions */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<LocationOn sx={{ fontSize: 15 }} />}
              onClick={onNavigate}
              sx={{
                flex: 1,
                borderRadius: '100px',
                fontWeight: 700,
                fontSize: '0.8125rem',
                textTransform: 'none',
                height: 40,
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              Navigate
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<PlayArrow sx={{ fontSize: 15 }} />}
              onClick={onStart}
              sx={{
                flex: 1,
                borderRadius: '100px',
                fontWeight: 700,
                fontSize: '0.8125rem',
                textTransform: 'none',
                height: 40,
                boxShadow: 'none',
              }}
            >
              Start Task
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
