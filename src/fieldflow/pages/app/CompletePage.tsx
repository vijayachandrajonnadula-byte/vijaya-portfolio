import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Home,
  Assignment,
  CloudDone,
  CloudOff,
  NavigateNext,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useTaskStore, useOfflineStore, useSyncStore } from '../../stores';

// ─── confetti particle colors ─────────────────────────────────────────────

const PARTICLE_COLORS = ['#2457D6', '#147A45', '#A06400', '#6B21A8', '#C84B00', '#BA1A1A', '#009DC4', '#4CAF50'];

interface Particle {
  id: number;
  color: string;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
}

// ─── helper ───────────────────────────────────────────────────────────────

function formatDuration(start: string, end: string): string {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const totalMinutes = Math.round(diffMs / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── main component ───────────────────────────────────────────────────────

export default function CompletePage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const { getTask, evidence, materials, getTodayTasks } = useTaskStore();
  const { isOffline } = useOfflineStore();
  const { queue, syncAll, isSyncing } = useSyncStore();

  const task = getTask(taskId ?? '');

  const [particles, setParticles] = useState<Particle[]>([]);
  const [syncPhase, setSyncPhase] = useState<'uploading' | 'done' | 'offline'>('uploading');
  const [syncProgress, setSyncProgress] = useState(0);

  const submittedAt = task?.actualEnd ?? new Date().toISOString();

  // ── compute stats ─────────────────────────────────────────────────────────

  const taskEvidence = evidence.filter((e) => e.taskId === taskId);
  const taskMaterials = materials.filter((m) => m.taskId === taskId);

  const allChecklistItems = task?.checklists.flatMap((s) => s.items) ?? [];
  const completedItems = allChecklistItems.filter((i) => i.completed || i.notApplicable);
  const checklistPct = allChecklistItems.length > 0
    ? Math.round((completedItems.length / allChecklistItems.length) * 100)
    : 100;

  const duration = task?.checkInTime && task.actualEnd
    ? formatDuration(task.checkInTime, task.actualEnd)
    : null;

  // Next task (today, assigned/accepted, not this task)
  const todayTasks = getTodayTasks();
  const nextTask = todayTasks.find(
    (t) => t.id !== taskId && ['assigned', 'accepted'].includes(t.status)
  );

  // Pending sync count
  const pendingSync = queue.filter((i) => i.status === 'pending' || i.status === 'syncing').length;

  // ── generate particles on mount ───────────────────────────────────────────

  useEffect(() => {
    const ps: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      x: 50 + (Math.random() - 0.5) * 10,
      y: 50 + (Math.random() - 0.5) * 10,
      angle: (i / 8) * 360 + Math.random() * 30,
      distance: 80 + Math.random() * 60,
      size: 10 + Math.random() * 8,
    }));
    setParticles(ps);
  }, []);

  // ── simulate sync upload ──────────────────────────────────────────────────

  useEffect(() => {
    if (isOffline) {
      setSyncPhase('offline');
      return;
    }

    const interval = setInterval(() => {
      setSyncProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setSyncPhase('done');
          return 100;
        }
        return p + 10;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [isOffline]);

  const handleSyncRetry = useCallback(() => {
    syncAll();
  }, [syncAll]);

  if (!task) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button variant="contained" onClick={() => navigate('/field-flow/app/home')} sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700 }}>
          Return Home
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        px: 2,
        pt: 4,
        pb: 4,
      }}
    >
      {/* ── Confetti particles ────────────────────────────────────────────── */}
      <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * p.distance;
          const ty = Math.sin(rad) * p.distance;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, x: `${p.x}vw`, y: `${p.y}vh`, scale: 0 }}
              animate={{ opacity: 0, x: `calc(${p.x}vw + ${tx}px)`, y: `calc(${p.y}vh + ${ty}px)`, scale: 1, rotate: p.angle * 2 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              style={{ position: 'absolute' }}
            >
              <Box
                sx={{
                  width: p.size,
                  height: p.size,
                  borderRadius: p.id % 2 === 0 ? '50%' : '2px',
                  bgcolor: p.color,
                }}
              />
            </motion.div>
          );
        })}
      </Box>

      {/* ── Success hero ─────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        >
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              bgcolor: '#D4EDDA',
              border: '3px solid #9DD4AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <CheckCircle sx={{ fontSize: 52, color: '#147A45' }} />
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Typography sx={{ fontWeight: 900, fontSize: '1.75rem', lineHeight: 1.2, mb: 0.5 }}>
            Task Submitted
          </Typography>
          <Typography
            sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', color: 'primary.main', mb: 0.5 }}
          >
            {task.workOrderNumber}
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            {dayjs(submittedAt).format('ddd, D MMM YYYY [at] HH:mm')}
          </Typography>
        </motion.div>
      </Box>

      {/* ── Summary stats ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.3 }}
      >
        <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1.5 }}>
              Summary
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {duration && (
                <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: '#EEF4FF', textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#2457D6' }}>{duration}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Time on site</Typography>
                </Box>
              )}
              <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: '#D4F0EC', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#006A60' }}>{taskEvidence.length}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Evidence captured</Typography>
              </Box>
              <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: '#F3E8FF', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#6B21A8' }}>{taskMaterials.length}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Materials used</Typography>
              </Box>
              <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: '#D4EDDA', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#147A45' }}>{checklistPct}%</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Checklist complete</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Sync status ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.3 }}
      >
        <Card
          sx={{
            mb: 2,
            borderRadius: 3,
            boxShadow: 'none',
            border: '1px solid',
            borderColor: syncPhase === 'offline' ? '#E8D4A0' : syncPhase === 'done' ? '#9DD4AF' : 'divider',
            bgcolor: syncPhase === 'offline' ? '#FFF5E0' : syncPhase === 'done' ? '#F0FAF4' : 'background.paper',
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: syncPhase === 'uploading' ? 1.5 : 0 }}>
              {syncPhase === 'offline' ? (
                <CloudOff sx={{ fontSize: 22, color: '#A06400', flexShrink: 0 }} />
              ) : syncPhase === 'done' ? (
                <CloudDone sx={{ fontSize: 22, color: '#147A45', flexShrink: 0 }} />
              ) : (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'flex', flexShrink: 0 }}
                >
                  <CloudDone sx={{ fontSize: 22, color: '#2457D6' }} />
                </motion.div>
              )}
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: syncPhase === 'offline' ? '#A06400' : syncPhase === 'done' ? '#147A45' : 'text.primary' }}>
                  {syncPhase === 'uploading' ? 'Uploading to server...'
                    : syncPhase === 'done' ? 'Submission uploaded'
                    : 'Saved locally'}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                  {syncPhase === 'offline'
                    ? 'Will sync automatically when you reconnect'
                    : syncPhase === 'done'
                    ? 'All data has been sent to the server'
                    : `${pendingSync} item${pendingSync !== 1 ? 's' : ''} queued for sync`
                  }
                </Typography>
              </Box>
              {syncPhase === 'offline' && pendingSync > 0 && (
                <Button
                  size="small"
                  onClick={handleSyncRetry}
                  disabled={isSyncing}
                  sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', borderRadius: '100px', flexShrink: 0 }}
                >
                  Retry
                </Button>
              )}
            </Box>
            {syncPhase === 'uploading' && (
              <LinearProgress
                variant="determinate"
                value={syncProgress}
                sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: '#2457D6', borderRadius: 3 } }}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Action cards ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.3 }}
      >
        <Stack spacing={1.25}>
          {/* Next task card */}
          {nextTask && (
            <Card
              onClick={() => navigate(`/field-flow/app/tasks/${nextTask.id}`)}
              sx={{
                borderRadius: 3,
                boxShadow: 'none',
                border: '1.5px solid #C4D4FF',
                bgcolor: '#EEF4FF',
                cursor: 'pointer',
                '&:active': { opacity: 0.85 },
                transition: 'opacity 0.15s',
              }}
            >
              <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Assignment sx={{ fontSize: 20, color: '#2457D6', flexShrink: 0 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#2457D6', mb: 0.125 }}>
                      View Next Task
                    </Typography>
                    <Typography sx={{ fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {nextTask.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.75, mt: 0.5, flexWrap: 'wrap' }}>
                      <Chip
                        label={nextTask.workOrderNumber}
                        size="small"
                        sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 700, fontFamily: 'monospace', bgcolor: '#C4D4FF', color: '#2457D6', '& .MuiChip-label': { px: 0.75 } }}
                      />
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {dayjs(nextTask.scheduledStart).format('HH:mm')}
                      </Typography>
                    </Box>
                  </Box>
                  <NavigateNext sx={{ fontSize: 20, color: '#2457D6', flexShrink: 0 }} />
                </Box>
              </CardContent>
            </Card>
          )}

          {/* View submitted task */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Assignment sx={{ fontSize: 18 }} />}
            onClick={() => navigate(`/field-flow/app/tasks/${taskId}`)}
            sx={{
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.9375rem',
              height: 48,
              borderColor: 'divider',
              color: 'text.primary',
            }}
          >
            View Submitted Task
          </Button>

          {/* Return home */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<Home sx={{ fontSize: 18 }} />}
            onClick={() => navigate('/field-flow/app/home')}
            sx={{
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              height: 52,
              boxShadow: 'none',
              bgcolor: '#147A45',
              '&:hover': { bgcolor: '#0F5C34', boxShadow: 'none' },
            }}
          >
            Return Home
          </Button>
        </Stack>
      </motion.div>
    </Box>
  );
}
