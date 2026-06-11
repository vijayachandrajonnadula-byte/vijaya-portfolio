import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  Pause as PauseIcon,
  CameraAlt,
  Warning,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../../stores';
import StatusChip from '../../components/common/StatusChip';

// ─── constants ────────────────────────────────────────────────────────────

const PAUSE_REASONS = [
  { value: 'Awaiting Parts', label: 'Awaiting Parts' },
  { value: 'Customer Unavailable', label: 'Customer Unavailable' },
  { value: 'Unsafe Site', label: 'Unsafe Site' },
  { value: 'Access Denied', label: 'Access Denied' },
  { value: 'Approval Required', label: 'Approval Required' },
  { value: 'Equipment Unavailable', label: 'Equipment Unavailable' },
  { value: 'Weather Conditions', label: 'Weather Conditions' },
  { value: 'Other', label: 'Other' },
];

// ─── snackbar ─────────────────────────────────────────────────────────────

function Snackbar({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="snack"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.22 }}
          style={{
            position: 'fixed',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1600,
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
            {message}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── main component ───────────────────────────────────────────────────────

export default function PausePage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const { getTask, pauseTask } = useTaskStore();
  const task = getTask(taskId ?? '');

  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [estimatedResume, setEstimatedResume] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snackText, setSnackText] = useState<string | null>(null);

  // Validation
  const [touched, setTouched] = useState({ reason: false, notes: false });

  const reasonError = touched.reason && !reason ? 'Please select a reason for pausing' : '';
  const notesError = touched.notes && notes.trim().length < 10
    ? `Notes must be at least 10 characters (${notes.trim().length}/10)`
    : '';

  const isValid = reason && notes.trim().length >= 10;

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2800);
  }, []);

  const handlePauseClick = useCallback(() => {
    setTouched({ reason: true, notes: true });
    if (!isValid) return;
    setConfirmOpen(true);
  }, [isValid]);

  const handleConfirmPause = useCallback(() => {
    if (!taskId || !isValid) return;
    setConfirmOpen(false);
    setSubmitted(true);
    pauseTask(
      taskId,
      reason,
      notes.trim(),
      estimatedResume ? new Date(estimatedResume).toISOString() : undefined
    );
    showSnack('Task paused successfully');
    setTimeout(() => {
      navigate(-1);
    }, 1500);
  }, [taskId, isValid, reason, notes, estimatedResume, pauseTask, navigate, showSnack]);

  if (!task) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
          <Toolbar sx={{ px: 1, minHeight: 56 }}>
            <IconButton onClick={() => navigate(-1)} edge="start"><ArrowBack /></IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', ml: 0.5 }}>Pause Task</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Task not found.</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* AppBar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary', zIndex: 10 }}
      >
        <Toolbar sx={{ px: 1, minHeight: 56, gap: 0.5 }}>
          <IconButton onClick={() => navigate(-1)} edge="start" aria-label="Go back" size="small">
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0, mx: 0.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Pause Task</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: 'monospace' }}>
              {task.workOrderNumber}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ flex: 1, px: 2, pt: 2, pb: '80px' }}>
        {/* Task summary card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card sx={{ mb: 2, borderRadius: 3, bgcolor: '#FFF5E0', border: '1px solid #E8D4A0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', flex: 1, minWidth: 0, lineHeight: 1.3 }}>
                  {task.title}
                </Typography>
                <StatusChip status={task.status} />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.75 }}>
                <Chip
                  label={task.serviceCategory}
                  size="small"
                  sx={{ height: 22, fontSize: '0.6875rem', fontWeight: 700, bgcolor: '#E8D4A0', color: '#6B4E16', '& .MuiChip-label': { px: 1 } }}
                />
                {task.checkInTime && (
                  <Typography sx={{ fontSize: '0.8125rem', color: '#6B4E16', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Checked in {dayjs(task.checkInTime).format('HH:mm')}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reason for pausing */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.25 }}
        >
          <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: reasonError ? '#F5B8B4' : 'divider' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <FormControl error={!!reasonError} sx={{ width: '100%' }}>
                <FormLabel
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'text.secondary',
                    mb: 1,
                    '&.Mui-focused': { color: 'text.secondary' },
                  }}
                >
                  Reason for Pausing *
                </FormLabel>
                <RadioGroup
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setTouched((t) => ({ ...t, reason: true }));
                  }}
                >
                  <Stack spacing={0.5}>
                    {PAUSE_REASONS.map((r) => (
                      <FormControlLabel
                        key={r.value}
                        value={r.value}
                        control={
                          <Radio
                            size="small"
                            sx={{ py: 0.5, '&.Mui-checked': { color: '#A06400' } }}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: '0.9375rem', fontWeight: reason === r.value ? 700 : 400 }}>
                            {r.label}
                          </Typography>
                        }
                        sx={{
                          m: 0,
                          p: 1,
                          borderRadius: 2,
                          bgcolor: reason === r.value ? '#FFF5E0' : 'transparent',
                          border: '1px solid',
                          borderColor: reason === r.value ? '#E8D4A0' : 'transparent',
                          transition: 'all 0.15s ease',
                        }}
                      />
                    ))}
                  </Stack>
                </RadioGroup>
                {reasonError && <FormHelperText>{reasonError}</FormHelperText>}
              </FormControl>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.25 }}
        >
          <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: notesError ? '#F5B8B4' : 'divider' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography
                sx={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1 }}
              >
                Notes *
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={4}
                placeholder="Describe the situation – what's blocking you, what's been done, and what the next steps are..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, notes: true }))}
                error={!!notesError}
                helperText={notesError || `${notes.trim().length} characters (min 10)`}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Estimated resume time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.25 }}
        >
          <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography
                sx={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1 }}
              >
                Estimated Resume Time (optional)
              </Typography>
              <TextField
                fullWidth
                type="datetime-local"
                value={estimatedResume}
                onChange={(e) => setEstimatedResume(e.target.value)}
                variant="outlined"
                size="small"
                slotProps={{ htmlInput: { min: new Date().toISOString().slice(0, 16) } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Optional evidence */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.25 }}
        >
          <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography
                sx={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1 }}
              >
                Photo Evidence (optional)
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1.5 }}>
                Documenting the pause reason with photos helps supervisors understand the situation.
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CameraAlt sx={{ fontSize: 18 }} />}
                onClick={() => showSnack('Navigate to Evidence page to add photos')}
                sx={{
                  borderRadius: '100px',
                  textTransform: 'none',
                  fontWeight: 700,
                  height: 44,
                  borderColor: 'divider',
                  color: 'text.secondary',
                }}
              >
                Add Photo Evidence of Pause Reason
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Validation summary */}
        {(!reason || notes.trim().length < 10) && (touched.reason || touched.notes) && (
          <Alert
            severity="warning"
            icon={<Warning sx={{ fontSize: 18 }} />}
            sx={{ mb: 2, borderRadius: 2, fontSize: '0.875rem' }}
          >
            <Stack spacing={0.25}>
              {!reason && <Typography sx={{ fontSize: '0.875rem' }}>Select a reason for pausing</Typography>}
              {notes.trim().length < 10 && <Typography sx={{ fontSize: '0.875rem' }}>Add a note (minimum 10 characters)</Typography>}
            </Stack>
          </Alert>
        )}
      </Box>

      {/* Sticky bottom bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          px: 2,
          pt: 1.5,
          pb: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
          zIndex: 20,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
        }}
      >
        <Stack spacing={1}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={() => navigate(-1)}
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
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<PauseIcon sx={{ fontSize: 18 }} />}
            onClick={handlePauseClick}
            disabled={submitted}
            sx={{
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              height: 52,
              boxShadow: 'none',
              bgcolor: '#A06400',
              '&:hover': { bgcolor: '#7A4D00', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
            }}
          >
            {submitted ? 'Pausing...' : 'Pause Task'}
          </Button>
        </Stack>
      </Box>

      {/* Confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3, mx: 2 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1 }}>
          Pause this task?
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', mb: 1.5 }}>
            Task status will be updated to <strong>Paused</strong>. You can resume this task at any time.
          </Typography>
          {reason && (
            <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: '#FFF5E0', border: '1px solid #E8D4A0', mb: 1 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6B4E16', mb: 0.25 }}>Reason</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#6B4E16' }}>{reason}</Typography>
            </Box>
          )}
          {estimatedResume && (
            <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: 'text.secondary', mb: 0.25 }}>Estimated Resume</Typography>
              <Typography sx={{ fontSize: '0.875rem' }}>
                {dayjs(estimatedResume).format('ddd, D MMM YYYY [at] HH:mm')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}
          >
            Go Back
          </Button>
          <Button
            onClick={handleConfirmPause}
            variant="contained"
            sx={{
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: 'none',
              bgcolor: '#A06400',
              '&:hover': { bgcolor: '#7A4D00', boxShadow: 'none' },
            }}
          >
            Confirm Pause
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar message={snackText} />
    </Box>
  );
}
