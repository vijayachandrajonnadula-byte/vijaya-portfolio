import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Button,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  FlashOn,
  Schedule,
  Home,
  VerifiedUser,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../../stores';
import type { Task } from '../../types';

// ── status colour map ──────────────────────────────────────────────────────
const STATUS_CHIP: Record<
  Task['status'],
  { label: string; bg: string; color: string }
> = {
  assigned: { label: 'Assigned', bg: '#E8EFFF', color: '#2457D6' },
  accepted: { label: 'Accepted', bg: '#E8EFFF', color: '#2457D6' },
  en_route: { label: 'En Route', bg: '#E8EFFF', color: '#2457D6' },
  arrived: { label: 'Arrived', bg: '#E0F4F1', color: '#006A60' },
  in_progress: { label: 'In Progress', bg: '#FFF5E0', color: '#A06400' },
  paused: { label: 'Paused', bg: '#FFF5E0', color: '#A06400' },
  completed: { label: 'Completed', bg: '#D4EDDA', color: '#147A45' },
  submitted: { label: 'Submitted', bg: '#E8EFFF', color: '#2457D6' },
  approved: { label: 'Approved', bg: '#D4EDDA', color: '#147A45' },
  rejected: { label: 'Rejected', bg: '#FDECEA', color: '#BA1A1A' },
  cancelled: { label: 'Cancelled', bg: '#EEEEF6', color: '#5A5B64' },
};

const PRIORITY_COLOR: Record<Task['priority'], string> = {
  low: '#74747D',
  medium: '#A06400',
  high: '#00639B',
  critical: '#BA1A1A',
};

export default function SupervisorPanelPage() {
  const navigate = useNavigate();
  const { tasks, supervisorApprove, supervisorReject, addUrgentTask } = useTaskStore();

  const [snackText, setSnackText] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<{ id: string; title: string } | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const [rejectError, setRejectError] = useState(false);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2600);
  }, []);

  const handleApprove = useCallback(
    (taskId: string) => {
      supervisorApprove(taskId);
      showSnack('Task approved');
    },
    [supervisorApprove, showSnack],
  );

  const openRejectDialog = useCallback((id: string, title: string) => {
    setRejectTarget({ id, title });
    setRejectComment('');
    setRejectError(false);
    setRejectDialogOpen(true);
  }, []);

  const handleRejectConfirm = useCallback(() => {
    if (!rejectComment.trim()) {
      setRejectError(true);
      return;
    }
    if (rejectTarget) {
      supervisorReject(rejectTarget.id, rejectComment.trim());
      showSnack(`Submission rejected – ${rejectTarget.title}`);
    }
    setRejectDialogOpen(false);
    setRejectTarget(null);
    setRejectComment('');
    setRejectError(false);
  }, [rejectComment, rejectTarget, supervisorReject, showSnack]);

  // Pre-fill mock rejection for task-012 (uses supervisorComment from mock data)
  const handlePrefilledReject = useCallback(() => {
    const task = tasks.find((t) => t.id === 'task-012');
    if (!task) {
      showSnack('Task WO-2024-0792 not found');
      return;
    }
    if (task.status !== 'submitted') {
      showSnack(`WO-2024-0792 is currently ${task.status} – nothing to reject`);
      return;
    }
    const comment =
      'Submission rejected – post-work evidence photos are missing for Boiler 2. ' +
      'Please re-open the task, attach photos of the installed sensors on Boiler 2, and resubmit.';
    supervisorReject('task-012', comment);
    showSnack('Rejection sent for WO-2024-0792');
  }, [tasks, supervisorReject, showSnack]);

  const submittedTasks = tasks.filter((t) => t.status === 'submitted');
  const resolvedTasks = tasks.filter((t) =>
    ['approved', 'rejected'].includes(t.status),
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
        <Toolbar sx={{ px: 1, minHeight: 56, gap: 0.75 }}>
          <IconButton size="small" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowBack fontSize="small" />
          </IconButton>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', flex: 1, ml: 0.5 }}>
            Supervisor Panel
          </Typography>
          <Chip
            label="DEMO"
            size="small"
            sx={{
              bgcolor: '#FFF0CC',
              color: '#6B4E16',
              fontWeight: 800,
              fontSize: '0.6875rem',
              letterSpacing: '0.4px',
            }}
          />
        </Toolbar>
      </AppBar>

      <Box sx={{ px: 2, pt: 2, pb: '80px' }}>

        {/* ── Disclaimer ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            severity="info"
            icon={<VerifiedUser fontSize="small" />}
            sx={{ mb: 2, borderRadius: 2 }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', mb: 0.25 }}>
              Portfolio Demo Tool
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem' }}>
              This panel simulates supervisor actions for portfolio demonstration. In a
              production system, supervisor actions would be performed in a separate web
              dashboard by authorised supervisors.
            </Typography>
          </Alert>
        </motion.div>

        {/* ── Awaiting Review ───────────────────────────────────────────── */}
        <SectionLabel>Awaiting Review ({submittedTasks.length})</SectionLabel>

        {submittedTasks.length === 0 ? (
          <Card sx={{ mb: 2, borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 3, '&:last-child': { pb: 3 } }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                No tasks awaiting review
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            <AnimatePresence>
              {submittedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.25 }}
                >
                  <SubmittedTaskCard
                    task={task}
                    onApprove={() => handleApprove(task.id)}
                    onReject={() => openRejectDialog(task.id, task.title)}
                    onNavigate={() => navigate(`/field-flow/app/tasks/${task.id}`)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        )}

        {/* ── Resolved tasks ────────────────────────────────────────────── */}
        {resolvedTasks.length > 0 && (
          <>
            <SectionLabel>Recently Resolved ({resolvedTasks.length})</SectionLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {resolvedTasks.slice(0, 5).map((task) => (
                <ResolvedTaskCard key={task.id} task={task} />
              ))}
            </Box>
          </>
        )}

        {/* ── Simulation actions ────────────────────────────────────────── */}
        <SectionLabel>Simulation Actions</SectionLabel>

        <Card sx={{ mb: 1.5, borderRadius: 3 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', mb: 0.5 }}>
              Add Urgent Task
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mb: 1.5 }}>
              Dispatch a critical emergency task to Arjun's task list immediately.
            </Typography>
            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<FlashOn />}
              onClick={() => {
                addUrgentTask();
                showSnack('Urgent task dispatched to Arjun');
              }}
              sx={{
                borderRadius: '100px',
                textTransform: 'none',
                fontWeight: 700,
                height: 42,
                boxShadow: 'none',
              }}
            >
              Dispatch Urgent Task
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ mb: 1.5, borderRadius: 3 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', mb: 0.5 }}>
              Simulate Schedule Change
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mb: 1.5 }}>
              Sends a schedule-change notification to the technician's notification centre.
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Schedule />}
              onClick={() => showSnack('Schedule change notification sent')}
              sx={{
                borderRadius: '100px',
                textTransform: 'none',
                fontWeight: 700,
                height: 42,
              }}
            >
              Send Schedule Change
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2, borderRadius: 3 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', mb: 0.5 }}>
              Send rejection for WO-2024-0792
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mb: 1.5 }}>
              Reject the Pressure Sensor Replacement submission with the standard
              missing-evidence comment. Only works if the task is in 'submitted' status.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<Cancel />}
              onClick={handlePrefilledReject}
              sx={{
                borderRadius: '100px',
                textTransform: 'none',
                fontWeight: 700,
                height: 42,
              }}
            >
              Reject WO-2024-0792
            </Button>
          </CardContent>
        </Card>

        {/* ── Return to App ─────────────────────────────────────────────── */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/field-flow/app/home')}
          sx={{
            borderRadius: '100px',
            textTransform: 'none',
            fontWeight: 700,
            height: 48,
            boxShadow: 'none',
          }}
        >
          Return to App
        </Button>
      </Box>

      {/* ── Reject Dialog ─────────────────────────────────────────────────── */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Reject Submission</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1.5 }}>
            Rejecting: <strong>{rejectTarget?.title}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            label="Supervisor comment (required)"
            multiline
            rows={3}
            fullWidth
            value={rejectComment}
            onChange={(e) => {
              setRejectComment(e.target.value);
              if (e.target.value.trim()) setRejectError(false);
            }}
            error={rejectError}
            helperText={rejectError ? 'A comment is required to reject a submission.' : ''}
            sx={{ mt: 0.5 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRejectConfirm}
            sx={{ fontWeight: 700, boxShadow: 'none' }}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {snackText && (
          <motion.div
            key="snack"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: 88,
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

// ── SubmittedTaskCard ─────────────────────────────────────────────────────
interface SubmittedTaskCardProps {
  task: Task;
  onApprove: () => void;
  onReject: () => void;
  onNavigate: () => void;
}

function SubmittedTaskCard({ task, onApprove, onReject, onNavigate }: SubmittedTaskCardProps) {
  const statusConf = STATUS_CHIP[task.status];

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        borderLeft: `4px solid ${PRIORITY_COLOR[task.priority]}`,
      }}
    >
      <CardActionArea onClick={onNavigate} sx={{ px: 2, pt: 1.75, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.75 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: 'text.secondary',
                fontWeight: 600,
                mb: 0.25,
              }}
            >
              {task.workOrderNumber}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.9375rem',
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
          <Chip
            label={statusConf.label}
            size="small"
            sx={{
              bgcolor: statusConf.bg,
              color: statusConf.color,
              fontWeight: 700,
              fontSize: '0.6875rem',
              flexShrink: 0,
              '& .MuiChip-label': { px: 1 },
            }}
          />
        </Box>

        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
          {task.address.line1}, {task.address.city}
        </Typography>

        {task.actualEnd && (
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            Completed {dayjs(task.actualEnd).format('D MMM [at] HH:mm')}
          </Typography>
        )}
      </CardActionArea>

      <Divider />

      <Box sx={{ display: 'flex', gap: 1, p: 1.5 }}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          startIcon={<CheckCircle sx={{ fontSize: 16 }} />}
          onClick={onApprove}
          sx={{
            borderRadius: '100px',
            textTransform: 'none',
            fontWeight: 700,
            height: 38,
            boxShadow: 'none',
            fontSize: '0.8125rem',
          }}
        >
          Approve
        </Button>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<Cancel sx={{ fontSize: 16 }} />}
          onClick={onReject}
          sx={{
            borderRadius: '100px',
            textTransform: 'none',
            fontWeight: 700,
            height: 38,
            fontSize: '0.8125rem',
          }}
        >
          Reject
        </Button>
      </Box>
    </Card>
  );
}

// ── ResolvedTaskCard ──────────────────────────────────────────────────────
function ResolvedTaskCard({ task }: { task: Task }) {
  const statusConf = STATUS_CHIP[task.status];
  const isApproved = task.status === 'approved';

  return (
    <Card sx={{ borderRadius: 2.5 }}>
      <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box
            sx={{
              mt: 0.25,
              color: isApproved ? '#147A45' : '#BA1A1A',
              flexShrink: 0,
            }}
          >
            {isApproved ? (
              <CheckCircle sx={{ fontSize: 18 }} />
            ) : (
              <Cancel sx={{ fontSize: 18 }} />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.35 }}>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {task.title}
              </Typography>
              <Chip
                label={statusConf.label}
                size="small"
                sx={{
                  height: 18,
                  bgcolor: statusConf.bg,
                  color: statusConf.color,
                  fontWeight: 700,
                  fontSize: '0.6875rem',
                  flexShrink: 0,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {task.workOrderNumber}
              {task.supervisorComment ? ` · ${task.supervisorComment.slice(0, 60)}...` : ''}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: '0.6875rem',
        fontWeight: 700,
        color: 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        mb: 1,
        mt: 0.5,
      }}
    >
      {children}
    </Typography>
  );
}
