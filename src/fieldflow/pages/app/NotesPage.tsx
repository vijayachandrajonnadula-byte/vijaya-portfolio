import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Chip,
  Stack,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  Mic,
  MicOff,
  Pause,
  Stop,
  Notes as NotesIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore, useOfflineStore } from '../../stores';
import type { TaskNote } from '../../types';

dayjs.extend(relativeTime);

// ─── constants ────────────────────────────────────────────────────────────

const NOTE_TEMPLATES = [
  'Site access confirmed',
  'Customer briefed on work scope',
  'No defects found during inspection',
  'Parts not available – rescheduling required',
  'Customer not on site – left notice',
];

const SYNC_COLORS: Record<string, string> = {
  pending: '#A06400',
  synced: '#147A45',
  failed: '#BA1A1A',
  syncing: '#2457D6',
};

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

// ─── note card ────────────────────────────────────────────────────────────

interface NoteCardProps {
  note: TaskNote;
  onEdit: (note: TaskNote) => void;
  onDelete: (note: TaskNote) => void;
}

function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const isInternal = note.type === 'internal';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          mb: 1.5,
          borderRadius: 3,
          border: '1px solid',
          borderColor: isInternal ? 'divider' : '#C4D4FF',
          boxShadow: 'none',
        }}
      >
        <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
          {/* Header row */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
            <Chip
              label={isInternal ? 'Internal' : 'Customer Visible'}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.6875rem',
                fontWeight: 700,
                bgcolor: isInternal ? '#F5F5F5' : '#EEF4FF',
                color: isInternal ? '#555' : '#2457D6',
                '& .MuiChip-label': { px: 1 },
                flexShrink: 0,
              }}
            />
            {note.isVoiceNote && (
              <Chip
                icon={<Mic sx={{ fontSize: 12 }} />}
                label={note.audioDuration ? `${note.audioDuration}s` : 'Voice'}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  bgcolor: '#F3E8FF',
                  color: '#6B21A8',
                  '& .MuiChip-label': { px: 1 },
                  flexShrink: 0,
                }}
              />
            )}
            <Box sx={{ flex: 1 }} />
            {/* Sync dot */}
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: SYNC_COLORS[note.syncStatus] ?? '#999',
                mt: 0.5,
                flexShrink: 0,
              }}
              title={note.syncStatus}
            />
          </Box>

          {/* Content */}
          <Typography
            sx={{
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              mb: 1,
            }}
          >
            {note.content}
          </Typography>

          {/* Footer row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>
              {dayjs(note.updatedAt ?? note.createdAt).fromNow()}
              {note.updatedAt && note.updatedAt !== note.createdAt && ' (edited)'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.25 }}>
              <IconButton
                size="small"
                onClick={() => onEdit(note)}
                aria-label="Edit note"
                sx={{ color: 'text.secondary', p: 0.5 }}
              >
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(note)}
                aria-label="Delete note"
                sx={{ color: '#BA1A1A', p: 0.5 }}
              >
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── main component ───────────────────────────────────────────────────────

export default function NotesPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const { getTask, notes, addNote, updateNote, removeNote } = useTaskStore();
  const { isOffline } = useOfflineStore();

  const task = getTask(taskId ?? '');

  // Filter tab: 'all' | 'internal' | 'customer_visible'
  const [filterType, setFilterType] = useState<'all' | 'internal' | 'customer_visible'>('all');

  // Add note state
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'internal' | 'customer_visible'>('internal');

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Edit dialog
  const [editNote, setEditNote] = useState<TaskNote | null>(null);
  const [editContent, setEditContent] = useState('');

  // Delete dialog
  const [deleteNote, setDeleteNote] = useState<TaskNote | null>(null);

  // Snackbar
  const [snackText, setSnackText] = useState<string | null>(null);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2800);
  }, []);

  // Cleanup recording interval on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  const taskNotes = notes.filter((n) => n.taskId === taskId);
  const filteredNotes =
    filterType === 'all'
      ? taskNotes
      : taskNotes.filter((n) => n.type === filterType);

  const internalCount = taskNotes.filter((n) => n.type === 'internal').length;
  const customerCount = taskNotes.filter((n) => n.type === 'customer_visible').length;

  // ── recording controls ───────────────────────────────────────────────────

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingSeconds(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
  }, []);

  const handlePauseRecording = useCallback(() => {
    setIsPaused((prev) => {
      if (prev) {
        // Resume
        recordingIntervalRef.current = setInterval(() => {
          setRecordingSeconds((s) => s + 1);
        }, 1000);
      } else {
        // Pause
        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      }
      return !prev;
    });
  }, []);

  const handleStopRecording = useCallback(() => {
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    const duration = recordingSeconds;
    setIsRecording(false);
    setIsPaused(false);

    const minutes = Math.floor(duration / 60);
    const secs = duration % 60;
    const durationLabel = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const newNote: TaskNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      taskId: taskId ?? '',
      content: `Voice Note (${durationLabel}) – recorded on site`,
      type: newType,
      isVoiceNote: true,
      audioDuration: duration,
      createdAt: new Date().toISOString(),
      syncStatus: 'pending',
    };
    addNote(newNote);
    setRecordingSeconds(0);
    showSnack('Voice note added');
  }, [recordingSeconds, newType, taskId, addNote, showSnack]);

  // ── add note ──────────────────────────────────────────────────────────────

  const handleAddNote = useCallback(() => {
    const content = newContent.trim();
    if (!content) {
      showSnack('Please enter a note');
      return;
    }
    const note: TaskNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      taskId: taskId ?? '',
      content,
      type: newType,
      createdAt: new Date().toISOString(),
      syncStatus: isOffline ? 'pending' : 'pending',
    };
    addNote(note);
    setNewContent('');
    showSnack('Note added');
  }, [newContent, newType, taskId, addNote, isOffline, showSnack]);

  // ── template chip ─────────────────────────────────────────────────────────

  const handleTemplateSelect = useCallback((template: string) => {
    setNewContent((prev) => (prev ? `${prev}\n${template}` : template));
  }, []);

  // ── edit ──────────────────────────────────────────────────────────────────

  const handleEditOpen = useCallback((note: TaskNote) => {
    setEditNote(note);
    setEditContent(note.content);
  }, []);

  const handleEditSave = useCallback(() => {
    if (!editNote) return;
    const content = editContent.trim();
    if (!content) return;
    updateNote(editNote.id, content);
    setEditNote(null);
    showSnack('Note updated');
  }, [editNote, editContent, updateNote, showSnack]);

  // ── delete ────────────────────────────────────────────────────────────────

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteNote) return;
    removeNote(deleteNote.id);
    setDeleteNote(null);
    showSnack('Note deleted');
  }, [deleteNote, removeNote, showSnack]);

  // ── format recording timer ────────────────────────────────────────────────

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (!task) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
          <Toolbar sx={{ px: 1, minHeight: 56 }}>
            <IconButton onClick={() => navigate(-1)} edge="start"><ArrowBack /></IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', ml: 0.5 }}>Notes</Typography>
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
            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Notes</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: 'monospace' }}>
              {task.workOrderNumber}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => {
              // Scroll to add note area
              document.getElementById('add-note-area')?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Add note"
            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' }, width: 34, height: 34, borderRadius: 2 }}
          >
            <Add sx={{ fontSize: 20 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Filter toggle */}
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
        <ToggleButtonGroup
          value={filterType}
          exclusive
          onChange={(_, val) => val && setFilterType(val)}
          size="small"
          fullWidth
          sx={{ '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.875rem', height: 38 } }}
        >
          <ToggleButton value="all">
            All ({taskNotes.length})
          </ToggleButton>
          <ToggleButton value="internal">
            Internal ({internalCount})
          </ToggleButton>
          <ToggleButton value="customer_visible">
            Customer ({customerCount})
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Notes list */}
      <Box sx={{ flex: 1, px: 2, pt: 1.5, pb: '80px' }}>
        {filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                textAlign: 'center',
              }}
            >
              <NotesIcon sx={{ fontSize: 52, color: 'text.disabled', mb: 2 }} />
              <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', mb: 0.75 }}>
                No notes yet
              </Typography>
              <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', maxWidth: 280, lineHeight: 1.5 }}>
                Add site observations, customer instructions, or work details below.
              </Typography>
            </Box>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditOpen}
                onDelete={setDeleteNote}
              />
            ))}
          </AnimatePresence>
        )}

        {/* Add note area */}
        <Box id="add-note-area">
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1.5 }}>
            Add Note
          </Typography>

          {/* Note type toggle */}
          <ToggleButtonGroup
            value={newType}
            exclusive
            onChange={(_, val) => val && setNewType(val)}
            size="small"
            sx={{ mb: 1.5, '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem' } }}
          >
            <ToggleButton value="internal" sx={{ px: 2 }}>Internal</ToggleButton>
            <ToggleButton value="customer_visible" sx={{ px: 2 }}>Customer Visible</ToggleButton>
          </ToggleButtonGroup>

          {/* Template chips */}
          <Box sx={{ mb: 1.5, overflowX: 'auto', pb: 0.5 }}>
            <Stack direction="row" spacing={0.75} sx={{ width: 'max-content' }}>
              {NOTE_TEMPLATES.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  size="small"
                  onClick={() => handleTemplateSelect(t)}
                  sx={{
                    height: 30,
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' },
                    '& .MuiChip-label': { px: 1.25 },
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Text field */}
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Type your note here, or use a template above..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            variant="outlined"
            sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {/* Voice recording section */}
          {!isRecording ? (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Mic sx={{ fontSize: 18 }} />}
              onClick={handleStartRecording}
              sx={{
                borderRadius: '100px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.9375rem',
                height: 48,
                borderColor: 'divider',
                color: 'text.secondary',
                mb: 1.5,
              }}
            >
              Record Voice Note
            </Button>
          ) : (
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                border: '1.5px solid #F5B8B4',
                bgcolor: '#FFF0EE',
                mb: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                {/* Animated recording dot */}
                <motion.div
                  animate={isPaused ? {} : { opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: '#BA1A1A',
                      flexShrink: 0,
                    }}
                  />
                </motion.div>
                <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'monospace', color: '#BA1A1A', flex: 1 }}>
                  {formatTimer(recordingSeconds)}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: '#BA1A1A', fontWeight: 600 }}>
                  {isPaused ? 'Paused' : 'Recording...'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={isPaused ? <Mic sx={{ fontSize: 16 }} /> : <Pause sx={{ fontSize: 16 }} />}
                  onClick={handlePauseRecording}
                  sx={{ flex: 1, borderRadius: '100px', textTransform: 'none', fontWeight: 700, fontSize: '0.875rem', height: 40, borderColor: '#BA1A1A', color: '#BA1A1A' }}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Stop sx={{ fontSize: 16 }} />}
                  onClick={handleStopRecording}
                  sx={{ flex: 1, borderRadius: '100px', textTransform: 'none', fontWeight: 700, fontSize: '0.875rem', height: 40, bgcolor: '#BA1A1A', boxShadow: 'none', '&:hover': { bgcolor: '#9B1212', boxShadow: 'none' } }}
                >
                  Stop & Save
                </Button>
              </Box>
            </Box>
          )}

          {/* Add button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!newContent.trim()}
            onClick={handleAddNote}
            sx={{
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              height: 52,
              boxShadow: 'none',
              mb: 2,
            }}
          >
            Add Note
          </Button>

          {/* Offline indicator */}
          {isOffline && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 0.5 }}>
              <MicOff sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>
                Offline – notes will sync when connected
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Edit dialog */}
      <Dialog
        open={!!editNote}
        onClose={() => setEditNote(null)}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { borderRadius: 3, mx: 2 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1 }}>
          Edit Note
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            variant="outlined"
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setEditNote(null)}
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            disabled={!editContent.trim()}
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteNote}
        onClose={() => setDeleteNote(null)}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3, mx: 2 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1 }}>
          Delete Note?
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            This note will be permanently removed. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteNote(null)}
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, boxShadow: 'none', bgcolor: '#BA1A1A', '&:hover': { bgcolor: '#9B1212', boxShadow: 'none' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar message={snackText} />
    </Box>
  );
}
