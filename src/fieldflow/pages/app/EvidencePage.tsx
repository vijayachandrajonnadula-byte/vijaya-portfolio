import { useState, useRef, useCallback } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Fab,
  Grid,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Add,
  CameraAlt,
  PhotoLibrary,
  Delete,
  Close,
  CameraEnhance,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../../stores';
import type { EvidenceType, EvidenceRecord } from '../../types';

// ─── constants ────────────────────────────────────────────────────────────

const EVIDENCE_TYPE_OPTIONS: { value: EvidenceType; label: string; color: string; bg: string }[] = [
  { value: 'before_work', label: 'Before Work', color: '#2457D6', bg: '#EEF4FF' },
  { value: 'during_work', label: 'During Work', color: '#A06400', bg: '#FFF5E0' },
  { value: 'after_work', label: 'After Work', color: '#147A45', bg: '#D4EDDA' },
  { value: 'fault', label: 'Fault', color: '#BA1A1A', bg: '#FFF0EE' },
  { value: 'asset_label', label: 'Asset Label', color: '#6B21A8', bg: '#F3E8FF' },
  { value: 'safety_issue', label: 'Safety Issue', color: '#C84B00', bg: '#FFF0E0' },
  { value: 'other', label: 'Other', color: '#555', bg: '#F5F5F5' },
];

const FILTER_OPTIONS: { value: EvidenceType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'before_work', label: 'Before' },
  { value: 'during_work', label: 'During' },
  { value: 'after_work', label: 'After' },
  { value: 'fault', label: 'Fault' },
  { value: 'asset_label', label: 'Asset' },
  { value: 'other', label: 'Other' },
];

const SYNC_COLORS: Record<string, string> = {
  pending: '#A06400',
  synced: '#147A45',
  failed: '#BA1A1A',
  syncing: '#2457D6',
};

function typeConfig(type: EvidenceType) {
  return EVIDENCE_TYPE_OPTIONS.find((o) => o.value === type) ?? EVIDENCE_TYPE_OPTIONS[EVIDENCE_TYPE_OPTIONS.length - 1];
}

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
          style={{ position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 1600, pointerEvents: 'none', maxWidth: 'calc(100vw - 32px)' }}
        >
          <Box sx={{ bgcolor: '#1A1B1F', color: '#fff', borderRadius: '100px', px: 2.5, py: 1, fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', boxShadow: 4 }}>
            {message}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── demo canvas image ─────────────────────────────────────────────────────

function generateDemoImage(type: EvidenceType): string {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const cfg = typeConfig(type);
  ctx.fillStyle = cfg.bg;
  ctx.fillRect(0, 0, 400, 300);
  ctx.strokeStyle = cfg.color;
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 392, 292);
  ctx.fillStyle = cfg.color;
  ctx.font = 'bold 22px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(cfg.label, 200, 140);
  ctx.font = '14px system-ui';
  ctx.fillStyle = '#666';
  ctx.fillText('Demo Photo — FieldFlow', 200, 170);
  ctx.fillText(dayjs().format('D MMM YYYY HH:mm'), 200, 195);
  return canvas.toDataURL('image/png');
}

// ─── evidence card ─────────────────────────────────────────────────────────

interface EvidenceCardProps {
  item: EvidenceRecord;
  onTap: () => void;
}

function EvidenceCard({ item, onTap }: EvidenceCardProps) {
  const cfg = typeConfig(item.type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{ width: '100%' }}
    >
      <Box
        onClick={onTap}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          cursor: 'pointer',
          '&:active': { opacity: 0.85 },
        }}
      >
        {/* Thumbnail */}
        <Box
          sx={{
            height: 120,
            bgcolor: cfg.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {item.dataUrl ? (
            <Box
              component="img"
              src={item.dataUrl}
              alt={item.caption || cfg.label}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <CameraAlt sx={{ fontSize: 28, color: cfg.color, mb: 0.5 }} />
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: cfg.color }}>
                {cfg.label}
              </Typography>
            </Box>
          )}
          {/* Sync dot */}
          <Box
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: SYNC_COLORS[item.syncStatus] ?? '#999',
              border: '1.5px solid white',
            }}
          />
        </Box>

        {/* Info */}
        <Box sx={{ p: 1 }}>
          <Chip
            label={cfg.label}
            size="small"
            sx={{
              bgcolor: cfg.bg,
              color: cfg.color,
              fontWeight: 700,
              fontSize: '0.6875rem',
              height: 20,
              mb: 0.5,
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
          {item.caption && (
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.4 }}>
              {item.caption}
            </Typography>
          )}
          <Typography sx={{ fontSize: '0.6875rem', color: 'text.disabled', mt: 0.25 }}>
            {dayjs(item.capturedAt).format('HH:mm')}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}

// ─── main component ───────────────────────────────────────────────────────

export default function EvidencePage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const { getTask, evidence, addEvidence, removeEvidence } = useTaskStore();
  const task = getTask(taskId ?? '');

  const [snackText, setSnackText] = useState<string | null>(null);
  const [filter, setFilter] = useState<EvidenceType | 'all'>('all');

  // Capture sheet state
  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureType, setCaptureType] = useState<EvidenceType>('before_work');
  const [captureCaption, setCaptureCaption] = useState('');

  // Full-screen viewer
  const [viewItem, setViewItem] = useState<EvidenceRecord | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // File input refs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2800);
  }, []);

  const taskEvidence = evidence.filter((e) => e.taskId === taskId);
  const filteredEvidence = filter === 'all' ? taskEvidence : taskEvidence.filter((e) => e.type === filter);

  const handleFileRead = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const newRecord: EvidenceRecord = {
          id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          taskId: taskId ?? '',
          type: captureType,
          caption: captureCaption.trim(),
          dataUrl,
          capturedAt: new Date().toISOString(),
          syncStatus: 'pending',
        };
        addEvidence(newRecord);
        setCaptureOpen(false);
        setCaptureCaption('');
        showSnack('Evidence captured');
      };
      reader.readAsDataURL(file);
    },
    [taskId, captureType, captureCaption, addEvidence, showSnack]
  );

  const handleCameraCapture = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileRead(file);
    e.target.value = '';
  }, [handleFileRead]);

  const handleGalleryUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileRead(file);
    e.target.value = '';
  }, [handleFileRead]);

  const handleDemoPhoto = useCallback(() => {
    const dataUrl = generateDemoImage(captureType);
    const newRecord: EvidenceRecord = {
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      taskId: taskId ?? '',
      type: captureType,
      caption: captureCaption.trim() || `${typeConfig(captureType).label} – demo photo`,
      dataUrl,
      capturedAt: new Date().toISOString(),
      syncStatus: 'pending',
    };
    addEvidence(newRecord);
    setCaptureOpen(false);
    setCaptureCaption('');
    showSnack('Demo photo added');
  }, [taskId, captureType, captureCaption, addEvidence, showSnack]);

  const handleDelete = useCallback(() => {
    if (!viewItem) return;
    removeEvidence(viewItem.id);
    setViewItem(null);
    setDeleteConfirmOpen(false);
    showSnack('Evidence deleted');
  }, [viewItem, removeEvidence, showSnack]);

  if (!task) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
          <Toolbar sx={{ px: 1, minHeight: 56 }}>
            <IconButton onClick={() => navigate(-1)} edge="start"><ArrowBack /></IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', ml: 0.5 }}>Evidence</Typography>
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
            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Evidence</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: 'monospace' }}>{task.workOrderNumber}</Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setCaptureOpen(true)}
            aria-label="Add evidence"
            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' }, width: 34, height: 34, borderRadius: 2 }}
          >
            <Add sx={{ fontSize: 20 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Filter chips */}
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5, overflowX: 'auto' }}>
        <Stack direction="row" spacing={0.75} sx={{ width: 'max-content' }}>
          {FILTER_OPTIONS.map((opt) => {
            const count = opt.value === 'all' ? taskEvidence.length : taskEvidence.filter((e) => e.type === opt.value).length;
            return (
              <Chip
                key={opt.value}
                label={`${opt.label}${count > 0 ? ` (${count})` : ''}`}
                size="small"
                onClick={() => setFilter(opt.value as EvidenceType | 'all')}
                sx={{
                  height: 30,
                  fontWeight: filter === opt.value ? 800 : 600,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  bgcolor: filter === opt.value ? 'primary.main' : 'background.paper',
                  color: filter === opt.value ? 'primary.contrastText' : 'text.secondary',
                  border: '1px solid',
                  borderColor: filter === opt.value ? 'primary.main' : 'divider',
                  '& .MuiChip-label': { px: 1.25 },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, px: 2, pt: 1.5, pb: '100px' }}>
        {filteredEvidence.length === 0 ? (
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
                py: 8,
                textAlign: 'center',
              }}
            >
              <CameraEnhance sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
              <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', mb: 0.75 }}>
                {filter === 'all' ? 'No evidence captured yet' : `No ${typeConfig(filter as EvidenceType).label} photos`}
              </Typography>
              <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', mb: 3, maxWidth: 280 }}>
                Document your work by capturing photos before, during and after the job.
              </Typography>
              <Button
                variant="contained"
                startIcon={<CameraAlt sx={{ fontSize: 18 }} />}
                onClick={() => setCaptureOpen(true)}
                sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, height: 48, px: 3, boxShadow: 'none' }}
              >
                Capture First Photo
              </Button>
            </Box>
          </motion.div>
        ) : (
          <Grid container spacing={1.5}>
            {filteredEvidence.map((item) => (
              <Grid size={6} key={item.id}>
                <EvidenceCard item={item} onTap={() => setViewItem(item)} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* FAB */}
      {filteredEvidence.length > 0 && (
        <Fab
          color="primary"
          aria-label="Add evidence"
          onClick={() => setCaptureOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 20,
            zIndex: 30,
            boxShadow: 4,
          }}
        >
          <CameraAlt />
        </Fab>
      )}

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleCameraCapture}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleGalleryUpload}
      />

      {/* Capture bottom sheet */}
      <Dialog
        open={captureOpen}
        onClose={() => setCaptureOpen(false)}
        slotProps={{
          paper: {
            sx: {
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              m: 0,
              borderRadius: '16px 16px 0 0',
              maxWidth: '100%',
              width: '100%',
            },
          },
        }}
        sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.0625rem', pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Add Evidence
          <IconButton size="small" onClick={() => setCaptureOpen(false)} aria-label="Close">
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pb: 0 }}>
          {/* Type selector */}
          <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1 }}>
            Evidence Type
          </Typography>
          <Box sx={{ overflowX: 'auto', pb: 1 }}>
            <ToggleButtonGroup
              value={captureType}
              exclusive
              onChange={(_, val) => val && setCaptureType(val as EvidenceType)}
              size="small"
              sx={{ gap: 0.75, display: 'flex', flexWrap: 'wrap' }}
            >
              {EVIDENCE_TYPE_OPTIONS.map((opt) => (
                <ToggleButton
                  key={opt.value}
                  value={opt.value}
                  sx={{
                    borderRadius: '100px !important',
                    border: '1px solid !important',
                    borderColor: captureType === opt.value ? `${opt.color} !important` : 'divider !important',
                    bgcolor: captureType === opt.value ? `${opt.bg} !important` : 'transparent',
                    color: captureType === opt.value ? `${opt.color} !important` : 'text.secondary',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    px: 1.5,
                    py: 0.5,
                    height: 32,
                    textTransform: 'none',
                    '&.Mui-selected': {
                      bgcolor: opt.bg,
                      color: opt.color,
                    },
                  }}
                >
                  {opt.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {/* Caption */}
          <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mt: 2, mb: 1 }}>
            Caption (optional)
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. HVAC Unit 1 – filter condition before replacement"
            value={captureCaption}
            onChange={(e) => setCaptureCaption(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <Divider sx={{ mb: 2 }} />

          {/* Action buttons */}
          <Stack spacing={1.25} sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<CameraAlt sx={{ fontSize: 18 }} />}
              onClick={() => cameraInputRef.current?.click()}
              sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, fontSize: '0.9375rem', height: 52, boxShadow: 'none' }}
            >
              Take Photo
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<PhotoLibrary sx={{ fontSize: 18 }} />}
              onClick={() => galleryInputRef.current?.click()}
              sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, fontSize: '0.9375rem', height: 52, borderColor: 'divider', color: 'text.primary' }}
            >
              Upload from Gallery
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<CameraEnhance sx={{ fontSize: 18 }} />}
              onClick={handleDemoPhoto}
              sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, fontSize: '0.9375rem', height: 52, borderColor: 'divider', color: 'text.secondary', borderStyle: 'dashed' }}
            >
              Use Demo Photo
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Full-screen viewer */}
      <Dialog
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        fullScreen
        slotProps={{ paper: { sx: { bgcolor: '#0A0A0A' } } }}
      >
        {viewItem && (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                pt: 2,
                pb: 1,
              }}
            >
              <IconButton onClick={() => setViewItem(null)} sx={{ color: '#fff' }} aria-label="Close viewer">
                <Close />
              </IconButton>
              <Chip
                label={typeConfig(viewItem.type).label}
                size="small"
                sx={{
                  bgcolor: typeConfig(viewItem.type).bg,
                  color: typeConfig(viewItem.type).color,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              />
              <IconButton
                onClick={() => setDeleteConfirmOpen(true)}
                sx={{ color: '#FF6B6B' }}
                aria-label="Delete evidence"
              >
                <Delete />
              </IconButton>
            </Box>

            {/* Image */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
              }}
            >
              {viewItem.dataUrl ? (
                <Box
                  component="img"
                  src={viewItem.dataUrl}
                  alt={viewItem.caption || 'Evidence'}
                  sx={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: 2 }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    bgcolor: typeConfig(viewItem.type).bg,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <CameraAlt sx={{ fontSize: 48, color: typeConfig(viewItem.type).color }} />
                  <Typography sx={{ fontWeight: 700, color: typeConfig(viewItem.type).color }}>
                    {typeConfig(viewItem.type).label}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Details */}
            <Box sx={{ px: 2, pb: 4 }}>
              {viewItem.caption && (
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
                  {viewItem.caption}
                </Typography>
              )}
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', mb: 0.5 }}>
                {dayjs(viewItem.capturedAt).format('ddd, D MMM YYYY [at] HH:mm')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: SYNC_COLORS[viewItem.syncStatus] ?? '#999',
                  }}
                />
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem', textTransform: 'capitalize' }}>
                  {viewItem.syncStatus}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} slotProps={{ paper: { sx: { borderRadius: 3, mx: 2 } } }} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1 }}>Delete Evidence?</DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            This photo will be permanently removed. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
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
