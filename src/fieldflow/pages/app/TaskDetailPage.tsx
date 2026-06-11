import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  MoreVert,
  LocationOn,
  AccessTime,
  Phone,
  Description,
  Security,
  Build,
  Assignment,
  CheckCircle,
  Warning,
  Pause,
  PlayArrow,
  Map,
  ContentCopy,
  Download,
  OpenInNew,
  CloudOff,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../../stores';
import { mockCustomers } from '../../data';
import type { TaskStatus } from '../../types';
import StatusChip from '../../components/common/StatusChip';

// ─── helpers ──────────────────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function buildAddress(address: {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
}): string {
  const parts = [address.line1];
  if (address.line2) parts.push(address.line2);
  parts.push(`${address.city} ${address.state} ${address.postcode}`);
  return parts.join(', ');
}

// ─── status banner config ─────────────────────────────────────────────────

const STATUS_BANNER: Partial<Record<TaskStatus, { bg: string; border: string; color: string }>> = {
  in_progress: { bg: '#EEF4FF', border: '#C4D4FF', color: '#2457D6' },
  paused: { bg: '#FFF5E0', border: '#E8D4A0', color: '#A06400' },
  rejected: { bg: '#FFF0EE', border: '#F5B8B4', color: '#BA1A1A' },
  assigned: { bg: '#E0F2FF', border: '#B0D9F5', color: '#00639B' },
  accepted: { bg: '#D4F0EC', border: '#9ED9D2', color: '#006A60' },
  en_route: { bg: '#EEF2FF', border: '#C0CDFF', color: '#2457D6' },
  arrived: { bg: '#D4F0EC', border: '#9ED9D2', color: '#006A60' },
  completed: { bg: '#D4EDDA', border: '#9DD4AF', color: '#147A45' },
  submitted: { bg: '#EEF2FF', border: '#C0CDFF', color: '#2457D6' },
  approved: { bg: '#D4EDDA', border: '#9DD4AF', color: '#147A45' },
};

// ─── snackbar ─────────────────────────────────────────────────────────────

interface SnackbarProps {
  message: string | null;
  bottomOffset?: number;
}

function Snackbar({ message, bottomOffset = 100 }: SnackbarProps) {
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
            bottom: bottomOffset,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1500,
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

// ─── section card ─────────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card sx={{ mb: 1.5, borderRadius: 3 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1.5,
          }}
        >
          <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'text.secondary',
            }}
          >
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

// ─── main component ───────────────────────────────────────────────────────

export default function TaskDetailPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const { getTask, acceptTask, startJourney, startWork, resumeTask, isLoading } = useTaskStore();

  const task = getTask(taskId ?? '');
  const customer = task ? mockCustomers.find((c) => c.id === task.customerId) : null;

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackText, setSnackText] = useState<string | null>(null);
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2800);
  }, []);

  const handleCopyAddress = useCallback(() => {
    if (!task) return;
    const addr = buildAddress(task.address);
    navigator.clipboard.writeText(addr).then(() => {
      showSnack('Address copied to clipboard');
    }).catch(() => {
      showSnack('Could not copy address');
    });
  }, [task, showSnack]);

  const handleNavigate = useCallback(() => {
    if (!task) return;
    const { lat, lng } = task.address;
    const url = `https://maps.google.com/?q=${lat},${lng}`;
    showSnack('Opening navigation...');
    setTimeout(() => window.open(url, '_blank'), 400);
  }, [task, showSnack]);

  const handleCopyWO = useCallback(() => {
    if (!task) return;
    navigator.clipboard.writeText(task.workOrderNumber).then(() => {
      showSnack('Work order number copied');
    }).catch(() => {
      showSnack('Could not copy WO number');
    });
    setMenuAnchor(null);
  }, [task, showSnack]);

  const handleDownloadTask = useCallback(() => {
    showSnack('Task downloaded for offline use');
    setMenuAnchor(null);
  }, [showSnack]);

  const handleReportIssue = useCallback(() => {
    showSnack('Issue reporting coming soon');
    setMenuAnchor(null);
  }, [showSnack]);

  const handlePrimaryAction = useCallback(() => {
    if (!task) return;

    switch (task.status) {
      case 'assigned':
        acceptTask(task.id);
        showSnack('Task accepted');
        break;
      case 'accepted':
        startJourney(task.id);
        showSnack('Journey started – navigate to site');
        break;
      case 'en_route':
        navigate(`/field-flow/app/tasks/${task.id}/check-in`);
        break;
      case 'arrived':
        startWork(task.id);
        showSnack('Work started');
        break;
      case 'in_progress':
        navigate(`/field-flow/app/tasks/${task.id}/checklist`);
        break;
      case 'paused':
        resumeTask(task.id);
        showSnack('Task resumed');
        break;
      case 'completed':
      case 'submitted':
      case 'approved':
        navigate(`/field-flow/app/tasks/${task.id}/review`);
        break;
      case 'rejected':
        navigate(`/field-flow/app/tasks/${task.id}/checklist`);
        break;
      default:
        break;
    }
  }, [task, acceptTask, startJourney, startWork, resumeTask, navigate, showSnack]);

  // ── 404 state ────────────────────────────────────────────────────────────
  if (!isLoading && !task) {
    return (
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
          <Toolbar sx={{ px: 1, minHeight: 56 }}>
            <IconButton
              onClick={() => navigate(-1)}
              edge="start"
              aria-label="Go back"
            >
              <ArrowBack />
            </IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', ml: 0.5 }}>
              Task Not Found
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 3,
            textAlign: 'center',
          }}
        >
          <Assignment sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
          <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', mb: 0.75 }}>
            Task Not Found
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 3, fontSize: '0.9375rem' }}>
            This task may have been removed or the link is incorrect.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/field-flow/app/tasks')}
            sx={{
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              boxShadow: 'none',
            }}
          >
            Back to Tasks
          </Button>
        </Box>
      </Box>
    );
  }

  if (!task) return null;

  const bannerCfg = STATUS_BANNER[task.status] ?? {
    bg: 'background.paper',
    border: 'divider',
    color: 'text.primary',
  };

  const fullAddress = buildAddress(task.address);

  const hasSafety =
    task.requiredPPE.length > 0 ||
    task.siteRisks.length > 0 ||
    task.safetyNotes.length > 0;

  // CTA config per status
  const ctaConfig: Record<
    TaskStatus,
    {
      primary: { label: string; color?: string; startIcon?: React.ReactNode };
      secondary?: { label: string; onClick: () => void };
    }
  > = {
    assigned: {
      primary: { label: 'Accept Task', startIcon: <CheckCircle sx={{ fontSize: 18 }} /> },
    },
    accepted: {
      primary: { label: 'Start Journey', startIcon: <PlayArrow sx={{ fontSize: 18 }} /> },
    },
    en_route: {
      primary: { label: 'Check In', startIcon: <LocationOn sx={{ fontSize: 18 }} /> },
    },
    arrived: {
      primary: { label: 'Start Work', startIcon: <PlayArrow sx={{ fontSize: 18 }} /> },
    },
    in_progress: {
      primary: { label: 'Continue Checklist', startIcon: <Assignment sx={{ fontSize: 18 }} /> },
      secondary: {
        label: 'Pause Task',
        onClick: () => navigate(`/field-flow/app/tasks/${task.id}/pause`),
      },
    },
    paused: {
      primary: { label: 'Resume Task', startIcon: <PlayArrow sx={{ fontSize: 18 }} /> },
      secondary: {
        label: 'View Checklist',
        onClick: () => navigate(`/field-flow/app/tasks/${task.id}/checklist`),
      },
    },
    completed: {
      primary: { label: 'Review Submission', startIcon: <OpenInNew sx={{ fontSize: 18 }} /> },
    },
    submitted: {
      primary: { label: 'Review Submission', startIcon: <OpenInNew sx={{ fontSize: 18 }} /> },
    },
    approved: {
      primary: { label: 'Review Submission', startIcon: <OpenInNew sx={{ fontSize: 18 }} /> },
    },
    rejected: {
      primary: { label: 'Fix and Resubmit', color: '#BA1A1A', startIcon: <Warning sx={{ fontSize: 18 }} /> },
      secondary: {
        label: 'Edit Submission',
        onClick: () => navigate(`/field-flow/app/tasks/${task.id}/review`),
      },
    },
    cancelled: {
      primary: { label: 'Task Cancelled' },
    },
  };

  const cta = ctaConfig[task.status];

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── AppBar ──────────────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
          zIndex: 10,
        }}
      >
        <Toolbar sx={{ px: 1, minHeight: 56, gap: 0.5 }}>
          <IconButton
            onClick={() => navigate(-1)}
            edge="start"
            aria-label="Go back"
            size="small"
          >
            <ArrowBack />
          </IconButton>

          <Box sx={{ flex: 1, minWidth: 0, mx: 0.5 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.875rem',
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {task.workOrderNumber}
            </Typography>
          </Box>

          <StatusChip status={task.status} />

          <IconButton
            size="small"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            aria-label="More options"
          >
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ── 3-dot menu ────────────────────────────────────────────────── */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        slotProps={{ paper: { sx: { borderRadius: 2, minWidth: 200 } } }}
      >
        <MenuItem
          onClick={handleDownloadTask}
          sx={{ gap: 1.5, fontSize: '0.9375rem' }}
        >
          <Download sx={{ fontSize: 18, color: 'text.secondary' }} />
          Download task
        </MenuItem>
        <MenuItem
          onClick={handleCopyWO}
          sx={{ gap: 1.5, fontSize: '0.9375rem' }}
        >
          <ContentCopy sx={{ fontSize: 18, color: 'text.secondary' }} />
          Copy WO number
        </MenuItem>
        {customer && (
          <MenuItem
            component="a"
            href={`tel:${customer.phone}`}
            onClick={() => setMenuAnchor(null)}
            sx={{ gap: 1.5, fontSize: '0.9375rem' }}
          >
            <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
            Call customer
          </MenuItem>
        )}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={handleReportIssue}
          sx={{ gap: 1.5, fontSize: '0.9375rem', color: '#BA1A1A' }}
        >
          <Warning sx={{ fontSize: 18 }} />
          Report issue
        </MenuItem>
      </Menu>

      {/* ── Scrollable content ────────────────────────────────────────── */}
      <Box sx={{ flex: 1, px: 2, pt: 2, pb: 12 }}>

        {/* 1. Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.3, ease: 'easeOut' }}
        >
          <Box
            sx={{
              bgcolor: bannerCfg.bg,
              border: `1px solid ${bannerCfg.border}`,
              borderRadius: 3,
              p: 2,
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 0.75,
                flexWrap: 'wrap',
              }}
            >
              <Chip
                label={task.serviceCategory}
                size="small"
                sx={{
                  bgcolor: bannerCfg.color,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.6875rem',
                  height: 22,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
              <StatusChip priority={task.priority} />
            </Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: '1.125rem',
                lineHeight: 1.3,
                color: 'text.primary',
              }}
            >
              {task.title}
            </Typography>
            {task.status === 'paused' && task.pauseReason && (
              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: '0.8125rem',
                  color: '#A06400',
                  fontWeight: 600,
                }}
              >
                Paused: {task.pauseReason.replace(/_/g, ' ')}
                {task.estimatedResumeTime
                  ? ` · Resumes ${dayjs(task.estimatedResumeTime).format('ddd D MMM [at] HH:mm')}`
                  : ''}
              </Typography>
            )}
          </Box>
        </motion.div>

        {/* 2. Task Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.3, ease: 'easeOut' }}
        >
          <SectionCard
            icon={<AccessTime sx={{ fontSize: 18 }} />}
            title="Task Summary"
          >
            <Stack spacing={1.25}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <AccessTime sx={{ fontSize: 16, color: 'text.secondary', mt: 0.1, flexShrink: 0 }} />
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.1 }}>
                    Scheduled
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                    {dayjs(task.scheduledStart).format('ddd, D MMM YYYY')}
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    {dayjs(task.scheduledStart).format('HH:mm')} – {dayjs(task.scheduledEnd).format('HH:mm')}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.1 }}>
                    Estimated Duration
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                    {formatDuration(task.estimatedDuration)}
                  </Typography>
                </Box>
                {customer && (
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.1 }}>
                      Customer
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {customer.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      {customer.accountNumber}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Stack>
          </SectionCard>
        </motion.div>

        {/* 3. Address */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.3, ease: 'easeOut' }}
        >
          <SectionCard
            icon={<LocationOn sx={{ fontSize: 18 }} />}
            title="Address"
          >
            {/* Static map placeholder */}
            <Box
              sx={{
                height: 120,
                borderRadius: 2,
                bgcolor: '#C8D8F0',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #B0C4E0',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.2) 20px, rgba(255,255,255,0.2) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.2) 20px, rgba(255,255,255,0.2) 21px)',
                }}
              />
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <Map sx={{ fontSize: 32, color: '#2457D6' }} />
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#2457D6',
                    mt: 0.25,
                  }}
                >
                  {task.address.city}
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', mb: 0.25 }}>
              {task.address.line1}
            </Typography>
            {task.address.line2 && (
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                {task.address.line2}
              </Typography>
            )}
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 0.5 }}>
              {task.address.city} {task.address.state} {task.address.postcode}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                color: 'text.secondary',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <LocationOn sx={{ fontSize: 14 }} />
              {task.distanceKm} km away
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Map sx={{ fontSize: 15 }} />}
                onClick={handleNavigate}
                sx={{
                  flex: 1,
                  borderRadius: '100px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  height: 40,
                  borderColor: 'divider',
                  color: 'text.primary',
                }}
              >
                Navigate
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopy sx={{ fontSize: 15 }} />}
                onClick={handleCopyAddress}
                sx={{
                  flex: 1,
                  borderRadius: '100px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  height: 40,
                  borderColor: 'divider',
                  color: 'text.primary',
                }}
              >
                Copy Address
              </Button>
            </Box>
          </SectionCard>
        </motion.div>

        {/* 4. Customer */}
        {customer && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.3, ease: 'easeOut' }}
          >
            <SectionCard
              icon={<Phone sx={{ fontSize: 18 }} />}
              title="Customer Contact"
            >
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.25 }}>
                {customer.contactPerson}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 1.5,
                }}
              >
                <Phone sx={{ fontSize: 14 }} />
                {customer.phone}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  component="a"
                  href={`tel:${customer.phone}`}
                  startIcon={<Phone sx={{ fontSize: 15 }} />}
                  sx={{
                    flex: 1,
                    borderRadius: '100px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    height: 40,
                    boxShadow: 'none',
                  }}
                >
                  Call
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Description sx={{ fontSize: 15 }} />}
                  onClick={() => showSnack('SMS messaging coming soon')}
                  sx={{
                    flex: 1,
                    borderRadius: '100px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    height: 40,
                    borderColor: 'divider',
                    color: 'text.primary',
                  }}
                >
                  Message
                </Button>
              </Box>
            </SectionCard>
          </motion.div>
        )}

        {/* 5. Job Description */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.3, ease: 'easeOut' }}
        >
          <SectionCard
            icon={<Description sx={{ fontSize: 18 }} />}
            title="Job Description"
          >
            <Stack spacing={1.5}>
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    mb: 0.5,
                  }}
                >
                  Problem / Task
                </Typography>
                <Typography sx={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  {task.description}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    mb: 0.5,
                  }}
                >
                  Scope of Work
                </Typography>
                <Typography sx={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  {task.scopeOfWork}
                </Typography>
              </Box>

              {task.equipment.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        mb: 1,
                      }}
                    >
                      Equipment
                    </Typography>
                    <Stack spacing={1}>
                      {task.equipment.map((eq) => (
                        <Box
                          key={eq.id}
                          sx={{
                            p: 1.25,
                            borderRadius: 1.5,
                            bgcolor: 'action.hover',
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mb: 0.25,
                            }}
                          >
                            <Build sx={{ fontSize: 13, color: 'text.secondary' }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                              {eq.name}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              fontSize: '0.8125rem',
                              color: 'text.secondary',
                              fontFamily: 'monospace',
                            }}
                          >
                            {eq.assetTag} · {eq.model} · S/N: {eq.serialNumber}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </>
              )}
            </Stack>
          </SectionCard>
        </motion.div>

        {/* 6. Safety */}
        {hasSafety && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3, ease: 'easeOut' }}
          >
            <SectionCard
              icon={<Security sx={{ fontSize: 18 }} />}
              title="Safety Requirements"
            >
              <Stack spacing={1.5}>
                {task.requiredPPE.length > 0 && (
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        mb: 0.75,
                      }}
                    >
                      Required PPE
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {task.requiredPPE.map((ppe) => (
                        <Chip
                          key={ppe}
                          label={ppe}
                          size="small"
                          sx={{
                            bgcolor: '#D4EDDA',
                            color: '#147A45',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 26,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {task.siteRisks.length > 0 && (
                  <>
                    {task.requiredPPE.length > 0 && <Divider />}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          mb: 0.75,
                        }}
                      >
                        Site Risks
                      </Typography>
                      <Stack spacing={0.5}>
                        {task.siteRisks.map((risk) => (
                          <Box
                            key={risk}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Warning sx={{ fontSize: 14, color: '#A06400', flexShrink: 0 }} />
                            <Typography sx={{ fontSize: '0.875rem', color: '#6B4E16' }}>
                              {risk}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}

                {task.safetyNotes.length > 0 && (
                  <>
                    <Divider />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          mb: 0.75,
                        }}
                      >
                        Safety Notes
                      </Typography>
                      <Stack spacing={0.75}>
                        {task.safetyNotes.map((note, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              p: 1.25,
                              borderRadius: 1.5,
                              bgcolor: '#FFF5E0',
                              border: '1px solid #E8D4A0',
                            }}
                          >
                            <Typography sx={{ fontSize: '0.875rem', color: '#6B4E16', lineHeight: 1.5 }}>
                              {note}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}

                <Divider />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={safetyAcknowledged}
                      onChange={(e) => setSafetyAcknowledged(e.target.checked)}
                      size="small"
                      sx={{
                        color: '#147A45',
                        '&.Mui-checked': { color: '#147A45' },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      I acknowledge I have read the safety briefing
                    </Typography>
                  }
                />
              </Stack>
            </SectionCard>
          </motion.div>
        )}

        {/* 7. Required Parts */}
        {task.requiredParts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.3, ease: 'easeOut' }}
          >
            <SectionCard
              icon={<Build sx={{ fontSize: 18 }} />}
              title="Required Parts"
            >
              {task.requiredParts.some((p) => !p.available) && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.25,
                    borderRadius: 1.5,
                    bgcolor: '#FFF0EE',
                    border: '1px solid #F5B8B4',
                    mb: 1.5,
                  }}
                >
                  <Warning sx={{ fontSize: 16, color: '#BA1A1A', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.875rem', color: '#BA1A1A', fontWeight: 600 }}>
                    Some required parts are unavailable — check with your supervisor
                  </Typography>
                </Box>
              )}

              <Stack spacing={0.75}>
                {task.requiredParts.map((part) => (
                  <Box
                    key={part.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.25,
                      borderRadius: 1.5,
                      bgcolor: part.available ? 'action.hover' : '#FFF0EE',
                      border: '1px solid',
                      borderColor: part.available ? 'divider' : '#F5B8B4',
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: part.available ? '#147A45' : '#BA1A1A',
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {part.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {part.partNumber} · Qty: {part.quantity} {part.unit}
                      </Typography>
                    </Box>
                    <Chip
                      label={part.available ? 'Available' : 'Unavailable'}
                      size="small"
                      sx={{
                        bgcolor: part.available ? '#D4EDDA' : '#FFDAD6',
                        color: part.available ? '#147A45' : '#BA1A1A',
                        fontWeight: 700,
                        fontSize: '0.6875rem',
                        height: 22,
                        '& .MuiChip-label': { px: 1 },
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </SectionCard>
          </motion.div>
        )}

        {/* 8. Supervisor comment (rejected) */}
        {task.status === 'rejected' && task.supervisorComment && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.3, ease: 'easeOut' }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: '#FFF0EE',
                border: '2px solid #F5B8B4',
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                }}
              >
                <Warning sx={{ fontSize: 18, color: '#BA1A1A' }} />
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    color: '#BA1A1A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Supervisor Comment
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.9375rem', color: '#BA1A1A', lineHeight: 1.6 }}>
                {task.supervisorComment}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Offline indicator */}
        {!task.isDownloaded && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#F5E6C8',
              border: '1px solid #E8D4A0',
              mb: 1.5,
            }}
          >
            <CloudOff sx={{ fontSize: 16, color: '#6B4E16', flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.8125rem', color: '#6B4E16', fontWeight: 600 }}>
              This task is not downloaded for offline use
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Button
              size="small"
              startIcon={<Download sx={{ fontSize: 14 }} />}
              onClick={() => showSnack('Task downloaded for offline use')}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.75rem',
                color: '#6B4E16',
                minWidth: 0,
                py: 0,
                px: 0.5,
              }}
            >
              Download
            </Button>
          </Box>
        )}

      </Box>

      {/* ── Sticky Bottom Action Bar ───────────────────────────────────── */}
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
        {task.status === 'cancelled' ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 1,
            }}
          >
            <Typography
              sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.secondary' }}
            >
              This task has been cancelled
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1}>
            {/* Secondary button */}
            {cta.secondary && (
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={
                  task.status === 'in_progress' ? (
                    <Pause sx={{ fontSize: 18 }} />
                  ) : undefined
                }
                onClick={cta.secondary.onClick}
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
                {cta.secondary.label}
              </Button>
            )}

            {/* Primary button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={cta.primary.startIcon}
              onClick={handlePrimaryAction}
              disabled={
                hasSafety &&
                ['assigned', 'accepted'].includes(task.status) &&
                !safetyAcknowledged
              }
              sx={{
                borderRadius: '100px',
                textTransform: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                height: 52,
                boxShadow: 'none',
                bgcolor: cta.primary.color ?? 'primary.main',
                '&:hover': {
                  bgcolor: cta.primary.color ? '#9B1212' : 'primary.dark',
                  boxShadow: 'none',
                },
                '&.Mui-disabled': {
                  bgcolor: 'action.disabledBackground',
                },
              }}
            >
              {cta.primary.label}
            </Button>

            {hasSafety && ['assigned', 'accepted'].includes(task.status) && !safetyAcknowledged && (
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                Acknowledge the safety briefing above to continue
              </Typography>
            )}
          </Stack>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar message={snackText} bottomOffset={110} />
    </Box>
  );
}
