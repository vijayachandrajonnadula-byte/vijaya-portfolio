import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Stack,
  Alert,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  Grid,
} from '@mui/material';
import {
  ArrowBack,
  ExpandMore,
  Edit,
  CheckCircle,
  Warning,
  Assignment,
  AccessTime,
  CameraAlt,
  Inventory,
  Notes as NotesIcon,
  Draw,
  BugReport,
  CloudUpload,
  CloudDone,
  CloudOff,
  Send,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useTaskStore, useOfflineStore, useSyncStore } from '../../stores';
import { mockCustomers } from '../../data';

// ─── helpers ──────────────────────────────────────────────────────────────

function formatDuration(start: string, end: string): string {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const totalMinutes = Math.round(diffMs / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── snackbar ─────────────────────────────────────────────────────────────

function Snackbar({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1600,
        pointerEvents: 'none',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      <Box sx={{ bgcolor: '#1A1B1F', color: '#fff', borderRadius: '100px', px: 2.5, py: 1, fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', boxShadow: 4 }}>
        {message}
      </Box>
    </Box>
  );
}

// ─── section header with edit link ────────────────────────────────────────

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  count?: number;
  editPath?: string;
}

function SectionHeader({ icon, title, count, editPath }: SectionHeaderProps) {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
      <Box sx={{ color: 'text.secondary', display: 'flex', flexShrink: 0 }}>{icon}</Box>
      <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', flex: 1 }}>
        {title}{count !== undefined ? ` (${count})` : ''}
      </Typography>
      {editPath && (
        <Button
          size="small"
          startIcon={<Edit sx={{ fontSize: 14 }} />}
          onClick={(e) => { e.stopPropagation(); navigate(editPath); }}
          sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', color: 'primary.main', py: 0, px: 0.75, minWidth: 0 }}
        >
          Edit
        </Button>
      )}
    </Box>
  );
}

// ─── main component ───────────────────────────────────────────────────────

export default function ReviewPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const { getTask, notes, evidence, materials, signatures, submitTask } = useTaskStore();
  const { isOffline } = useOfflineStore();
  const { enqueue, queue } = useSyncStore();

  const task = getTask(taskId ?? '');
  const customer = task ? mockCustomers.find((c) => c.id === task.customerId) : null;

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitDone, setSubmitDone] = useState(false);
  const [snackText, setSnackText] = useState<string | null>(null);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2800);
  }, []);

  if (!task) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
          <Toolbar sx={{ px: 1, minHeight: 56 }}>
            <IconButton onClick={() => navigate(-1)} edge="start"><ArrowBack /></IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', ml: 0.5 }}>Review & Submit</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Task not found.</Typography>
        </Box>
      </Box>
    );
  }

  // ── computed data ─────────────────────────────────────────────────────────

  const taskNotes = notes.filter((n) => n.taskId === taskId);
  const taskEvidence = evidence.filter((e) => e.taskId === taskId);
  const taskMaterials = materials.filter((m) => m.taskId === taskId);
  const taskSignature = signatures[taskId ?? ''];

  const allChecklistItems = task.checklists.flatMap((s) => s.items);
  const requiredItems = allChecklistItems.filter((i) => i.required);
  const completedItems = allChecklistItems.filter((i) => i.completed || i.notApplicable);
  const requiredIncomplete = requiredItems.filter((i) => !i.completed && !i.notApplicable);
  const issueItems = allChecklistItems.filter((i) => i.issue);

  const checklistPct = allChecklistItems.length > 0
    ? Math.round((completedItems.length / allChecklistItems.length) * 100)
    : 100;

  const hasSignatureRequired = task.requiresSignature;
  const hasEvidenceRequired = task.requiresEvidence;
  const hasMissingRequired = requiredIncomplete.length > 0;
  const hasMissingEvidence = hasEvidenceRequired && taskEvidence.length === 0;
  const hasMissingSignature = hasSignatureRequired && !taskSignature;
  const hasMissingCheckout = !task.checkOutTime;

  const validationErrors = [
    ...(hasMissingRequired ? [`${requiredIncomplete.length} required checklist item${requiredIncomplete.length > 1 ? 's' : ''} incomplete`] : []),
    ...(hasMissingEvidence ? ['Required evidence photos are missing'] : []),
    ...(hasMissingSignature ? ['Customer signature not captured'] : []),
    ...(hasMissingCheckout ? ['Check-out not recorded'] : []),
  ];

  const canSubmit = validationErrors.length === 0 && !['submitted', 'approved'].includes(task.status);

  const duration = task.checkInTime && (task.checkOutTime ?? task.actualEnd)
    ? formatDuration(task.checkInTime, task.checkOutTime ?? task.actualEnd ?? new Date().toISOString())
    : null;

  // ── submit handler ────────────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    if (!taskId || !canSubmit) return;
    setSubmitDialogOpen(true);
    setSubmitProgress(0);

    // Animate progress
    const interval = setInterval(() => {
      setSubmitProgress((p) => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + 15;
      });
    }, 200);

    await new Promise((r) => setTimeout(r, 2000));
    clearInterval(interval);
    setSubmitProgress(100);

    submitTask(taskId);
    enqueue({
      type: 'task_update',
      taskId,
      taskTitle: task.title,
      payload: { status: 'submitted', submittedAt: new Date().toISOString() },
    });

    await new Promise((r) => setTimeout(r, 400));
    setSubmitDone(true);

    setTimeout(() => {
      setSubmitDialogOpen(false);
      navigate(`/field-flow/app/tasks/${taskId}/complete`);
    }, 800);
  }, [taskId, canSubmit, task.title, submitTask, enqueue, navigate]);

  const pendingSync = queue.filter((i) => i.status === 'pending').length;

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
            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Review & Submit</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: 'monospace' }}>
              {task.workOrderNumber}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ flex: 1, px: 2, pt: 2, pb: '80px' }}>

        {/* Validation alerts */}
        {validationErrors.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Alert
              severity="warning"
              sx={{ mb: 2, borderRadius: 2 }}
              icon={<Warning sx={{ fontSize: 18 }} />}
            >
              <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', mb: 0.5 }}>
                Issues to resolve before submitting:
              </Typography>
              <Stack spacing={0.25}>
                {validationErrors.map((err) => (
                  <Typography key={err} sx={{ fontSize: '0.8125rem' }}>
                    {err}
                  </Typography>
                ))}
              </Stack>
            </Alert>
          </motion.div>
        )}

        {/* Submission status banner */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04, duration: 0.25 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              mb: 2,
              bgcolor: canSubmit ? '#D4EDDA' : '#FFF5E0',
              border: '1px solid',
              borderColor: canSubmit ? '#9DD4AF' : '#E8D4A0',
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
            }}
          >
            {canSubmit
              ? <CheckCircle sx={{ fontSize: 18, color: '#147A45', flexShrink: 0 }} />
              : <Warning sx={{ fontSize: 18, color: '#A06400', flexShrink: 0 }} />
            }
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: canSubmit ? '#147A45' : '#A06400' }}>
              {canSubmit ? 'Ready to submit' : 'Cannot submit — see issues above'}
            </Typography>
          </Box>
        </motion.div>

        {/* ── Sections ──────────────────────────────────────────────────── */}

        {/* 1. Task Information */}
        <Accordion defaultExpanded disableGutters elevation={0} sx={{ mb: 1.5, borderRadius: '12px !important', border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' }, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2, minHeight: 52 }}>
            <SectionHeader icon={<Assignment sx={{ fontSize: 18 }} />} title="Task Information" editPath={`/field-flow/app/tasks/${taskId}`} />
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Stack spacing={0.75}>
              {[
                ['Work Order', task.workOrderNumber],
                ['Title', task.title],
                ['Category', task.serviceCategory],
                ['Customer', customer?.name ?? task.customerId],
                ['Scheduled Start', dayjs(task.scheduledStart).format('D MMM YYYY HH:mm')],
                ['Scheduled End', dayjs(task.scheduledEnd).format('D MMM YYYY HH:mm')],
                ...(task.actualStart ? [['Actual Start', dayjs(task.actualStart).format('D MMM YYYY HH:mm')]] : []),
              ].map(([label, value]) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', flexShrink: 0 }}>{label}</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, textAlign: 'right' }}>{value}</Typography>
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* 2. Time on Site */}
        <Accordion defaultExpanded disableGutters elevation={0} sx={{ mb: 1.5, borderRadius: '12px !important', border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' }, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2, minHeight: 52 }}>
            <SectionHeader icon={<AccessTime sx={{ fontSize: 18 }} />} title="Time on Site" />
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Stack spacing={0.75}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>Check-in</Typography>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                  {task.checkInTime ? dayjs(task.checkInTime).format('HH:mm, D MMM') : 'Not recorded'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>Check-out</Typography>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: !task.checkOutTime ? '#A06400' : undefined }}>
                  {task.checkOutTime ? dayjs(task.checkOutTime).format('HH:mm, D MMM') : 'Not recorded'}
                </Typography>
              </Box>
              {duration && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>Duration</Typography>
                  <Chip label={duration} size="small" sx={{ height: 22, fontSize: '0.75rem', fontWeight: 700, bgcolor: '#EEF4FF', color: '#2457D6', '& .MuiChip-label': { px: 1 } }} />
                </Box>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* 3. Checklist Summary */}
        <Accordion defaultExpanded disableGutters elevation={0} sx={{ mb: 1.5, borderRadius: '12px !important', border: '1px solid', borderColor: hasMissingRequired ? '#F5B8B4' : 'divider', '&:before': { display: 'none' }, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2, minHeight: 52 }}>
            <SectionHeader
              icon={<Assignment sx={{ fontSize: 18 }} />}
              title="Checklist"
              editPath={`/field-flow/app/tasks/${taskId}/checklist`}
            />
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
            <Divider sx={{ mb: 1.5 }} />
            {allChecklistItems.length === 0 ? (
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 1 }}>
                No checklist items for this task
              </Typography>
            ) : (
              <>
                {/* Progress bar */}
                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>Overall completion</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: checklistPct === 100 ? '#147A45' : '#A06400' }}>
                      {checklistPct}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={checklistPct}
                    sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: checklistPct === 100 ? '#147A45' : '#A06400', borderRadius: 3 } }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: '0.8125rem' }}>Total: <strong>{allChecklistItems.length}</strong></Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#147A45' }}>Completed: <strong>{completedItems.length}</strong></Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#BA1A1A' }}>Required incomplete: <strong>{requiredIncomplete.length}</strong></Typography>
                </Box>
                {task.checklists.map((section) => {
                  const sectionCompleted = section.items.filter((i) => i.completed || i.notApplicable).length;
                  return (
                    <Box key={section.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography sx={{ fontSize: '0.875rem' }}>{section.title}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        {sectionCompleted === section.items.length
                          ? <CheckCircle sx={{ fontSize: 14, color: '#147A45' }} />
                          : <Warning sx={{ fontSize: 14, color: '#A06400' }} />
                        }
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: sectionCompleted === section.items.length ? '#147A45' : '#A06400' }}>
                          {sectionCompleted}/{section.items.length}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </>
            )}
          </AccordionDetails>
        </Accordion>

        {/* 4. Evidence */}
        <Accordion defaultExpanded disableGutters elevation={0} sx={{ mb: 1.5, borderRadius: '12px !important', border: '1px solid', borderColor: hasMissingEvidence ? '#F5B8B4' : 'divider', '&:before': { display: 'none' }, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2, minHeight: 52 }}>
            <SectionHeader
              icon={<CameraAlt sx={{ fontSize: 18 }} />}
              title="Evidence"
              count={taskEvidence.length}
              editPath={`/field-flow/app/tasks/${taskId}/evidence`}
            />
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
            <Divider sx={{ mb: 1.5 }} />
            {taskEvidence.length === 0 ? (
              <Typography sx={{ fontSize: '0.875rem', color: hasMissingEvidence ? '#BA1A1A' : 'text.secondary', textAlign: 'center', py: 1 }}>
                {hasMissingEvidence ? 'Required evidence photos are missing' : 'No evidence captured'}
              </Typography>
            ) : (
              <Grid container spacing={1}>
                {taskEvidence.slice(0, 6).map((ev) => (
                  <Grid size={6} key={ev.id}>
                    <Box
                      sx={{
                        height: 80,
                        borderRadius: 2,
                        overflow: 'hidden',
                        bgcolor: '#EEF4FF',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {ev.dataUrl ? (
                        <Box component="img" src={ev.dataUrl} alt={ev.caption} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <CameraAlt sx={{ fontSize: 24, color: 'text.disabled' }} />
                      )}
                    </Box>
                  </Grid>
                ))}
                {taskEvidence.length > 6 && (
                  <Grid size={6}>
                    <Box sx={{ height: 80, borderRadius: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.875rem' }}>+{taskEvidence.length - 6} more</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </AccordionDetails>
        </Accordion>

        {/* 5. Materials */}
        <Accordion disableGutters elevation={0} sx={{ mb: 1.5, borderRadius: '12px !important', border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' }, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2, minHeight: 52 }}>
            <SectionHeader
              icon={<Inventory sx={{ fontSize: 18 }} />}
              title="Materials Used"
              count={taskMaterials.length}
              editPath={`/field-flow/app/tasks/${taskId}/materials`}
            />
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
            <Divider sx={{ mb: 1.5 }} />
            {taskMaterials.length === 0 ? (
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 1 }}>
                No materials recorded
              </Typography>
            ) : (
              <Stack spacing={0.75}>
                {taskMaterials.map((m) => (
                  <Box key={m.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{m.name}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{m.partNumber}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 }}>
                      {m.quantity} {m.unit}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </AccordionDetails>
        </Accordion>

        {/* 6. Notes */}
        <Accordion disableGutters elevation={0} sx={{ mb: 1.5, borderRadius: '12px !important', border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' }, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2, minHeight: 52 }}>
            <SectionHeader
              icon={<NotesIcon sx={{ fontSize: 18 }} />}
              title="Notes"
              count={taskNotes.length}
              editPath={`/field-flow/app/tasks/${taskId}/notes`}
            />
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
            <Divider sx={{ mb: 1.5 }} />
            {taskNotes.length === 0 ? (
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 1 }}>
                No notes added
              </Typography>
            ) : (
              <Stack spacing={1}>
                {taskNotes.slice(0, 2).map((n) => (
                  <Box key={n.id} sx={{ p: 1.25, borderRadius: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                      <Chip
                        label={n.type === 'internal' ? 'Internal' : 'Customer Visible'}
                        size="small"
                        sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 700, bgcolor: n.type === 'internal' ? '#F5F5F5' : '#EEF4FF', color: n.type === 'internal' ? '#555' : '#2457D6', '& .MuiChip-label': { px: 0.75 } }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {n.content}
                    </Typography>
                  </Box>
                ))}
                {taskNotes.length > 2 && (
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', textAlign: 'center' }}>
                    +{taskNotes.length - 2} more note{taskNotes.length - 2 > 1 ? 's' : ''}
                  </Typography>
                )}
              </Stack>
            )}
          </AccordionDetails>
        </Accordion>

        {/* 7. Customer Signature */}
        <Accordion defaultExpanded disableGutters elevation={0} sx={{ mb: 1.5, borderRadius: '12px !important', border: '1px solid', borderColor: hasMissingSignature ? '#F5B8B4' : 'divider', '&:before': { display: 'none' }, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2, minHeight: 52 }}>
            <SectionHeader
              icon={<Draw sx={{ fontSize: 18 }} />}
              title="Customer Signature"
              editPath={`/field-flow/app/tasks/${taskId}/signature`}
            />
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
            <Divider sx={{ mb: 1.5 }} />
            {!taskSignature ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                <Warning sx={{ fontSize: 18, color: hasMissingSignature ? '#BA1A1A' : '#A06400', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.875rem', color: hasMissingSignature ? '#BA1A1A' : 'text.secondary' }}>
                  {hasMissingSignature ? 'Signature required — not yet captured' : 'No signature required for this task'}
                </Typography>
              </Box>
            ) : taskSignature.unavailable ? (
              <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: '#FFF5E0', border: '1px solid #E8D4A0' }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#6B4E16', mb: 0.25 }}>Customer unavailable</Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: '#6B4E16' }}>{taskSignature.unavailableReason}</Typography>
              </Box>
            ) : (
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>Customer</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>{taskSignature.customerName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>Role</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{taskSignature.customerRole}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>Captured</Typography>
                  <Typography sx={{ fontSize: '0.8125rem' }}>{dayjs(taskSignature.capturedAt).format('HH:mm, D MMM YYYY')}</Typography>
                </Box>
                {taskSignature.dataUrl && (
                  <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: '#fff', height: 80 }}>
                    <Box component="img" src={taskSignature.dataUrl} alt="Customer signature" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </Box>
                )}
                <Chip
                  icon={<CheckCircle sx={{ fontSize: 13 }} />}
                  label="Signature captured"
                  size="small"
                  sx={{ height: 24, fontSize: '0.75rem', fontWeight: 700, bgcolor: '#D4EDDA', color: '#147A45', alignSelf: 'flex-start', '& .MuiChip-label': { px: 1 } }}
                />
              </Stack>
            )}
          </AccordionDetails>
        </Accordion>

        {/* 8. Outstanding Issues */}
        {issueItems.length > 0 && (
          <Accordion disableGutters elevation={0} sx={{ mb: 1.5, borderRadius: '12px !important', border: '1px solid #F5B8B4', '&:before': { display: 'none' }, overflow: 'hidden', bgcolor: '#FFF0EE' }}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2, minHeight: 52 }}>
              <SectionHeader icon={<BugReport sx={{ fontSize: 18 }} />} title={`Outstanding Issues (${issueItems.length})`} />
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
              <Divider sx={{ mb: 1.5, borderColor: '#F5B8B4' }} />
              <Stack spacing={0.75}>
                {issueItems.map((item) => (
                  <Box key={item.id} sx={{ p: 1.25, borderRadius: 2, bgcolor: '#fff', border: '1px solid #F5B8B4' }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, mb: 0.25 }}>{item.title}</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: '#BA1A1A' }}>{item.issue}</Typography>
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Sync queue info */}
        {pendingSync > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 0.5 }}>
            {isOffline ? <CloudOff sx={{ fontSize: 16, color: 'text.disabled' }} /> : <CloudUpload sx={{ fontSize: 16, color: '#2457D6' }} />}
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
              {pendingSync} item{pendingSync > 1 ? 's' : ''} pending sync
            </Typography>
          </Box>
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
            onClick={() => showSnack('Progress saved locally')}
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, fontSize: '0.9375rem', height: 48, borderColor: 'divider', color: 'text.primary' }}
          >
            Save Draft
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<Send sx={{ fontSize: 18 }} />}
            onClick={handleSubmit}
            disabled={!canSubmit}
            sx={{
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              height: 52,
              boxShadow: 'none',
              bgcolor: '#147A45',
              '&:hover': { bgcolor: '#0F5C34', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
            }}
          >
            Submit Task
          </Button>
        </Stack>
      </Box>

      {/* Submit progress dialog */}
      <Dialog
        open={submitDialogOpen}
        slotProps={{ paper: { sx: { borderRadius: 3, mx: 2, minWidth: 280 } } }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1, textAlign: 'center' }}>
          {submitDone ? 'Submission Complete' : 'Submitting Task...'}
        </DialogTitle>
        <DialogContent sx={{ pt: 0, pb: 3, px: 3, textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>
            {submitDone ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <CloudDone sx={{ fontSize: 52, color: '#147A45' }} />
              </motion.div>
            ) : (
              <CloudUpload sx={{ fontSize: 52, color: 'primary.main' }} />
            )}
          </Box>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 2 }}>
            {submitDone ? 'Task submitted successfully!' : 'Uploading task data and evidence...'}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={submitProgress}
            sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: '#147A45', borderRadius: 3 } }}
          />
          <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', mt: 1 }}>
            {submitProgress}%
          </Typography>
        </DialogContent>
      </Dialog>

      <Snackbar message={snackText} />
    </Box>
  );
}
