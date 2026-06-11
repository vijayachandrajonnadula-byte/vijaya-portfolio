import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  LinearProgress,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  TextField,
  Button,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  ExpandMore,
  CameraAlt,
  AddPhotoAlternate,
  NoteAdd,
  ReportProblem,
  CheckCircleOutlined,
  RadioButtonUnchecked,
  Warning,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../../stores';
import type { ChecklistItemData } from '../../types';

// ─── checklist item ────────────────────────────────────────────────────────

interface ChecklistItemProps {
  item: ChecklistItemData;
  sectionId: string;
  taskId: string;
  onNavigateEvidence: () => void;
}

function ChecklistItem({ item, sectionId, taskId, onNavigateEvidence }: ChecklistItemProps) {
  const { updateChecklistItem } = useTaskStore();
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteValue, setNoteValue] = useState(item.note ?? '');
  const [issueOpen, setIssueOpen] = useState(false);
  const [issueText, setIssueText] = useState(item.issue ?? '');
  const [naOpen, setNaOpen] = useState(false);
  const [naReason, setNaReason] = useState(item.notApplicableReason ?? '');
  const [descExpanded, setDescExpanded] = useState(false);
  const [measureValue, setMeasureValue] = useState(item.measurement?.value ?? '');

  const handleToggle = useCallback(() => {
    if (item.notApplicable) return;
    updateChecklistItem(taskId, sectionId, item.id, { completed: !item.completed });
  }, [item, taskId, sectionId, updateChecklistItem]);

  const handleMeasureChange = useCallback((val: string) => {
    setMeasureValue(val);
    updateChecklistItem(taskId, sectionId, item.id, {
      measurement: { value: val, unit: item.measurement?.unit ?? '' },
      completed: val.trim() !== '',
    });
  }, [item, taskId, sectionId, updateChecklistItem]);

  const handleSaveNote = useCallback(() => {
    updateChecklistItem(taskId, sectionId, item.id, { note: noteValue });
    setNoteOpen(false);
  }, [noteValue, taskId, sectionId, item.id, updateChecklistItem]);

  const handleSaveIssue = useCallback(() => {
    updateChecklistItem(taskId, sectionId, item.id, { issue: issueText });
    setIssueOpen(false);
  }, [issueText, taskId, sectionId, item.id, updateChecklistItem]);

  const handleNaConfirm = useCallback(() => {
    if (!naReason.trim()) return;
    updateChecklistItem(taskId, sectionId, item.id, {
      notApplicable: true,
      notApplicableReason: naReason,
      completed: false,
    });
    setNaOpen(false);
  }, [naReason, taskId, sectionId, item.id, updateChecklistItem]);

  const handleUndoNa = useCallback(() => {
    updateChecklistItem(taskId, sectionId, item.id, { notApplicable: false, notApplicableReason: undefined });
  }, [taskId, sectionId, item.id, updateChecklistItem]);

  const isIncomplete = item.required && !item.completed && !item.notApplicable;

  return (
    <Box
      sx={{
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': { borderBottom: 'none' },
        bgcolor: isIncomplete && item.required ? 'transparent' : 'transparent',
      }}
    >
      {/* Header row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        {/* Required dot */}
        {item.required && !item.notApplicable && (
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: item.completed ? '#147A45' : '#BA1A1A',
              mt: 1.25,
              flexShrink: 0,
            }}
          />
        )}

        {/* Checkbox or N/A chip */}
        {item.notApplicable ? (
          <Box sx={{ mt: 0.25, flexShrink: 0 }}>
            <Chip
              label="N/A"
              size="small"
              onClick={handleUndoNa}
              sx={{ bgcolor: '#F2F2F2', color: 'text.secondary', fontWeight: 700, fontSize: '0.6875rem', height: 24, '& .MuiChip-label': { px: 1 }, cursor: 'pointer' }}
            />
          </Box>
        ) : (
          <Checkbox
            checked={item.completed}
            onChange={handleToggle}
            size="small"
            icon={<RadioButtonUnchecked sx={{ fontSize: 20 }} />}
            checkedIcon={<CheckCircleOutlined sx={{ fontSize: 20, color: '#147A45' }} />}
            sx={{ p: 0.25, mt: 0.1, flexShrink: 0, '&.Mui-checked': { color: '#147A45' } }}
            disabled={item.type === 'measurement' || item.type === 'photo'}
          />
        )}

        {/* Title and description */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: item.description ? 'pointer' : 'default' }}
            onClick={() => item.description && setDescExpanded(!descExpanded)}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '0.9375rem',
                lineHeight: 1.4,
                color: item.notApplicable ? 'text.disabled' : 'text.primary',
                textDecoration: item.notApplicable ? 'line-through' : 'none',
              }}
            >
              {item.title}
            </Typography>
            {item.description && (
              <ExpandMore
                sx={{
                  fontSize: 18,
                  color: 'text.secondary',
                  flexShrink: 0,
                  transform: descExpanded ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
            )}
          </Box>

          <AnimatePresence>
            {descExpanded && item.description && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mt: 0.5, lineHeight: 1.5 }}>
                  {item.description}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Measurement input */}
          {item.type === 'measurement' && !item.notApplicable && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <TextField
                size="small"
                type="number"
                placeholder="Enter value"
                value={measureValue}
                onChange={(e) => handleMeasureChange(e.target.value)}
                sx={{
                  width: 120,
                  '& .MuiOutlinedInput-root': { borderRadius: 2, height: 36 },
                  '& input': { py: 0.75, px: 1.25, fontSize: '0.875rem' },
                }}
              />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.secondary' }}>
                {item.measurement?.unit}
              </Typography>
            </Box>
          )}

          {/* Photo type */}
          {item.type === 'photo' && !item.notApplicable && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<CameraAlt sx={{ fontSize: 14 }} />}
                onClick={onNavigateEvidence}
                sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', height: 32, borderColor: 'divider', color: 'text.primary' }}
              >
                Add Photo
              </Button>
              {item.evidenceIds.length > 0 && (
                <Badge badgeContent={item.evidenceIds.length} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.6875rem' } }}>
                  <Chip
                    label={`${item.evidenceIds.length} photo${item.evidenceIds.length > 1 ? 's' : ''}`}
                    size="small"
                    icon={<AddPhotoAlternate sx={{ fontSize: 13 }} />}
                    sx={{ bgcolor: '#EEF4FF', color: '#2457D6', fontWeight: 700, fontSize: '0.75rem', height: 26 }}
                  />
                </Badge>
              )}
            </Box>
          )}

          {/* Existing note */}
          {item.note && (
            <Box sx={{ mt: 0.75, p: 1, borderRadius: 1.5, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
              <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontStyle: 'italic' }}>
                Note: {item.note}
              </Typography>
            </Box>
          )}

          {/* Existing issue */}
          {item.issue && (
            <Box sx={{ mt: 0.75, p: 1, borderRadius: 1.5, bgcolor: '#FFF0EE', border: '1px solid #F5B8B4' }}>
              <Typography sx={{ fontSize: '0.8125rem', color: '#BA1A1A', fontWeight: 600 }}>
                Issue: {item.issue}
              </Typography>
            </Box>
          )}

          {/* Action row */}
          {!item.notApplicable && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
              <Button
                size="small"
                startIcon={<NoteAdd sx={{ fontSize: 13 }} />}
                onClick={() => setNoteOpen(true)}
                sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', height: 28, color: 'text.secondary', px: 1 }}
              >
                {item.note ? 'Edit Note' : 'Add Note'}
              </Button>
              <Button
                size="small"
                onClick={() => setNaOpen(true)}
                sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', height: 28, color: 'text.secondary', px: 1 }}
              >
                N/A
              </Button>
              <Button
                size="small"
                startIcon={<ReportProblem sx={{ fontSize: 13 }} />}
                onClick={() => setIssueOpen(true)}
                sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', height: 28, color: item.issue ? '#BA1A1A' : 'text.secondary', px: 1 }}
              >
                Issue
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Note dialog */}
      <Dialog open={noteOpen} onClose={() => setNoteOpen(false)} slotProps={{ paper: { sx: { borderRadius: 3, mx: 2 } } }} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1 }}>Add Note</DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add an observation or note for this item..."
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setNoteOpen(false)} sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={handleSaveNote} variant="contained" sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}>Save Note</Button>
        </DialogActions>
      </Dialog>

      {/* Issue dialog */}
      <Dialog open={issueOpen} onClose={() => setIssueOpen(false)} slotProps={{ paper: { sx: { borderRadius: 3, mx: 2 } } }} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1 }}>Report Issue</DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1.5 }}>
            Describe the issue with this checklist item. This will be flagged for supervisor review.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="e.g. Component not accessible due to locked enclosure. Site contact required."
            value={issueText}
            onChange={(e) => setIssueText(e.target.value)}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setIssueOpen(false)} sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
          <Button
            onClick={handleSaveIssue}
            variant="contained"
            disabled={!issueText.trim()}
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, boxShadow: 'none', bgcolor: '#BA1A1A', '&:hover': { bgcolor: '#9B1212', boxShadow: 'none' } }}
          >
            Report Issue
          </Button>
        </DialogActions>
      </Dialog>

      {/* N/A dialog */}
      <Dialog open={naOpen} onClose={() => setNaOpen(false)} slotProps={{ paper: { sx: { borderRadius: 3, mx: 2 } } }} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1 }}>Mark as Not Applicable</DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1.5 }}>
            Provide a reason why this item does not apply.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="e.g. Unit 2 not installed at this site."
            value={naReason}
            onChange={(e) => setNaReason(e.target.value)}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setNaOpen(false)} sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
          <Button
            onClick={handleNaConfirm}
            variant="contained"
            disabled={!naReason.trim()}
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
          >
            Confirm N/A
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ─── main component ───────────────────────────────────────────────────────

export default function ChecklistPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const { getTask } = useTaskStore();
  const task = getTask(taskId ?? '');

  const [incompleteDialogOpen, setIncompleteDialogOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const allSectionIds = task?.checklists.map((s) => s.id) ?? [];
    return new Set(allSectionIds.slice(0, 2));
  });

  if (!task) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
          <Toolbar sx={{ px: 1, minHeight: 56 }}>
            <IconButton onClick={() => navigate(-1)} edge="start"><ArrowBack /></IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', ml: 0.5 }}>Checklist</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Task not found.</Typography>
        </Box>
      </Box>
    );
  }

  // Compute progress stats
  const allItems = task.checklists.flatMap((s) => s.items);
  const totalItems = allItems.length;
  const completedItems = allItems.filter((i) => i.completed || i.notApplicable).length;
  const requiredItems = allItems.filter((i) => i.required);
  const completedRequired = requiredItems.filter((i) => i.completed || i.notApplicable);
  const incompleteRequired = requiredItems.filter((i) => !i.completed && !i.notApplicable);
  const evidenceMissing = allItems.filter((i) => i.requiresEvidence && i.completed && i.evidenceIds.length === 0).length;
  const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const allRequiredDone = incompleteRequired.length === 0;

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const handleContinue = () => {
    if (!allRequiredDone) {
      setIncompleteDialogOpen(true);
      return;
    }
    navigate(`/field-flow/app/tasks/${taskId}/evidence`);
  };

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
            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Checklist</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: 'monospace' }}>{task.workOrderNumber}</Typography>
          </Box>
          <Chip
            label={`${completedItems}/${totalItems}`}
            size="small"
            sx={{
              bgcolor: allRequiredDone ? '#D4EDDA' : '#EEF4FF',
              color: allRequiredDone ? '#147A45' : '#2457D6',
              fontWeight: 800,
              fontSize: '0.75rem',
              height: 24,
              '& .MuiChip-label': { px: 1 },
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, pb: '80px' }}>
        {/* Progress bar */}
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'text.secondary' }}>
              Overall Progress
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', color: allRequiredDone ? '#147A45' : 'primary.main' }}>
              {progressPct}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPct}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                bgcolor: allRequiredDone ? '#147A45' : 'primary.main',
              },
            }}
          />
        </Box>

        {/* Stats row */}
        <Box sx={{ px: 2, pb: 1.5 }}>
          <Stack direction="row" spacing={1}>
            <Box sx={{ flex: 1, p: 1.25, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: '#2457D6' }}>{requiredItems.length}</Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontWeight: 600 }}>Required</Typography>
            </Box>
            <Box sx={{ flex: 1, p: 1.25, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: '#147A45' }}>{completedRequired.length}</Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontWeight: 600 }}>Completed</Typography>
            </Box>
            <Box sx={{ flex: 1, p: 1.25, borderRadius: 2, bgcolor: evidenceMissing > 0 ? '#FFF0EE' : 'background.paper', border: '1px solid', borderColor: evidenceMissing > 0 ? '#F5B8B4' : 'divider', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: evidenceMissing > 0 ? '#BA1A1A' : 'text.primary' }}>{evidenceMissing}</Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontWeight: 600 }}>Missing Evidence</Typography>
            </Box>
          </Stack>
        </Box>

        {/* Empty state */}
        {task.checklists.length === 0 && (
          <Box sx={{ px: 2, py: 6, textAlign: 'center' }}>
            <CheckCircleOutlined sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.secondary' }}>No checklist items for this task</Typography>
          </Box>
        )}

        {/* Checklist sections */}
        <Box sx={{ px: 2 }}>
          {task.checklists.map((section, sectionIdx) => {
            const sectionItems = section.items;
            const sectionCompleted = sectionItems.filter((i) => i.completed || i.notApplicable).length;
            const sectionTotal = sectionItems.length;
            const sectionDone = sectionCompleted === sectionTotal;
            const isExpanded = expandedSections.has(section.id);

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIdx * 0.05, duration: 0.3 }}
              >
                <Accordion
                  expanded={isExpanded}
                  onChange={() => toggleSection(section.id)}
                  disableGutters
                  elevation={0}
                  sx={{
                    mb: 1.5,
                    borderRadius: '12px !important',
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                    '&:before': { display: 'none' },
                    bgcolor: 'background.paper',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      minHeight: 52,
                      px: 2,
                      '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1, my: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: sectionDone ? '#147A45' : '#2457D6',
                        flexShrink: 0,
                      }}
                    />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', flex: 1, minWidth: 0 }}>
                      {section.title}
                    </Typography>
                    <Chip
                      label={`${sectionCompleted}/${sectionTotal}`}
                      size="small"
                      sx={{
                        bgcolor: sectionDone ? '#D4EDDA' : 'action.hover',
                        color: sectionDone ? '#147A45' : 'text.secondary',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: 22,
                        '& .MuiChip-label': { px: 1 },
                      }}
                    />
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 2, pt: 0, pb: 1 }}>
                    <Divider sx={{ mb: 0 }} />
                    {sectionItems.map((item) => (
                      <ChecklistItem
                        key={item.id}
                        item={item}
                        sectionId={section.id}
                        taskId={taskId ?? ''}
                        onNavigateEvidence={() => navigate(`/field-flow/app/tasks/${taskId}/evidence`)}
                      />
                    ))}
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            );
          })}
        </Box>
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
          {incompleteRequired.length > 0 && (
            <Typography sx={{ fontSize: '0.75rem', color: '#BA1A1A', textAlign: 'center', fontWeight: 600 }}>
              {incompleteRequired.length} required item{incompleteRequired.length > 1 ? 's' : ''} still incomplete
            </Typography>
          )}
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<CameraAlt sx={{ fontSize: 18 }} />}
              onClick={() => navigate(`/field-flow/app/tasks/${taskId}/evidence`)}
              sx={{
                flex: 1,
                borderRadius: '100px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.9375rem',
                height: 52,
                borderColor: 'divider',
                color: 'text.primary',
              }}
            >
              Evidence
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              sx={{
                flex: 2,
                borderRadius: '100px',
                textTransform: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                height: 52,
                boxShadow: 'none',
                bgcolor: allRequiredDone ? '#147A45' : 'primary.main',
                '&:hover': { bgcolor: allRequiredDone ? '#0f6038' : 'primary.dark', boxShadow: 'none' },
              }}
            >
              {allRequiredDone ? 'Continue' : `Continue (${incompleteRequired.length} remaining)`}
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Incomplete required items dialog */}
      <Dialog open={incompleteDialogOpen} onClose={() => setIncompleteDialogOpen(false)} slotProps={{ paper: { sx: { borderRadius: 3, mx: 2 } } }} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning sx={{ color: '#BA1A1A', fontSize: 20 }} />
          Incomplete Required Items
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1.5 }}>
            The following required items must be completed before you can continue:
          </Typography>
          <Stack spacing={0.75}>
            {incompleteRequired.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#BA1A1A', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.875rem' }}>{item.title}</Typography>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setIncompleteDialogOpen(false)}
            variant="contained"
            fullWidth
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
          >
            Return to Checklist
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
