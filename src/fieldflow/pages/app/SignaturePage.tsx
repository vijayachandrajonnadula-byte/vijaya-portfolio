import { useState, useRef, useCallback } from 'react';
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
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Draw,
  Delete,
  CheckCircle,
  Person,
  AccessTime,
  PersonOff,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import SignatureCanvas from 'react-signature-canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore, useAuthStore } from '../../stores';
import type { Signature } from '../../types';
import { mockCustomers } from '../../data';

// ─── constants ────────────────────────────────────────────────────────────

const UNAVAILABLE_REASONS = [
  'Customer not on site',
  'Refused to sign',
  'Site evacuated',
  'Other',
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

export default function SignaturePage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const { getTask, saveSignature } = useTaskStore();
  const { technician } = useAuthStore();
  const task = getTask(taskId ?? '');
  const customer = task ? mockCustomers.find((c) => c.id === task.customerId) : null;

  // Form fields
  const [customerName, setCustomerName] = useState(customer?.contactPerson ?? '');
  const [customerRole, setCustomerRole] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [capturedAt, setCapturedAt] = useState<string | null>(null);

  // Customer unavailable dialog
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const [unavailableReason, setUnavailableReason] = useState('');
  const [unavailableDetails, setUnavailableDetails] = useState('');

  // Snackbar
  const [snackText, setSnackText] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const sigPadRef = useRef<SignatureCanvas>(null);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2800);
  }, []);

  const handleSignatureEnd = useCallback(() => {
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      setIsSigned(true);
      if (!capturedAt) setCapturedAt(new Date().toISOString());
    }
  }, [capturedAt]);

  const handleClear = useCallback(() => {
    sigPadRef.current?.clear();
    setIsSigned(false);
    setCapturedAt(null);
  }, []);

  const canSubmit =
    customerName.trim() &&
    customerRole.trim() &&
    isSigned &&
    consentChecked;

  const handleSaveSignature = useCallback(() => {
    if (!canSubmit || !taskId || !sigPadRef.current) return;
    const dataUrl = sigPadRef.current.toDataURL('image/png');
    const now = capturedAt ?? new Date().toISOString();
    const sig: Signature = {
      taskId,
      customerName: customerName.trim(),
      customerRole: customerRole.trim(),
      dataUrl,
      capturedAt: now,
      technicianName: technician?.name ?? 'Technician',
      consentGiven: true,
    };
    saveSignature(taskId, sig);
    setSubmitted(true);
    showSnack('Signature saved');
    setTimeout(() => {
      navigate(`/field-flow/app/tasks/${taskId}/review`);
    }, 1200);
  }, [canSubmit, taskId, customerName, customerRole, capturedAt, technician, saveSignature, navigate, showSnack]);

  const handleUnavailableConfirm = useCallback(() => {
    if (!taskId || !unavailableReason) return;
    const sig: Signature = {
      taskId,
      customerName: customerName.trim() || 'Unavailable',
      customerRole: customerRole.trim() || 'N/A',
      dataUrl: '',
      capturedAt: new Date().toISOString(),
      technicianName: technician?.name ?? 'Technician',
      consentGiven: false,
      unavailable: true,
      unavailableReason: unavailableDetails.trim()
        ? `${unavailableReason}: ${unavailableDetails.trim()}`
        : unavailableReason,
    };
    saveSignature(taskId, sig);
    setUnavailableOpen(false);
    setSubmitted(true);
    showSnack('Marked as customer unavailable');
    setTimeout(() => {
      navigate(`/field-flow/app/tasks/${taskId}/review`);
    }, 1200);
  }, [taskId, customerName, customerRole, unavailableReason, unavailableDetails, technician, saveSignature, navigate, showSnack]);

  if (!task) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
          <Toolbar sx={{ px: 1, minHeight: 56 }}>
            <IconButton onClick={() => navigate(-1)} edge="start"><ArrowBack /></IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', ml: 0.5 }}>Customer Signature</Typography>
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
            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Customer Signature</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: 'monospace' }}>
              {task.workOrderNumber}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ flex: 1, px: 2, pt: 2, pb: '80px' }}>

        {/* Work summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: '#C4D4FF', bgcolor: '#EEF4FF' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#2457D6', mb: 1.25 }}>
                Work Summary
              </Typography>
              <Stack spacing={0.75}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', flexShrink: 0 }}>Work Order</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, fontFamily: 'monospace', textAlign: 'right' }}>{task.workOrderNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', flexShrink: 0 }}>Task</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, textAlign: 'right', flex: 1, minWidth: 0 }}>{task.title}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', flexShrink: 0 }}>Category</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, textAlign: 'right' }}>{task.serviceCategory}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTime sx={{ fontSize: 13 }} /> Date
                  </Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, textAlign: 'right' }}>
                    {dayjs(task.actualEnd ?? new Date()).format('ddd, D MMM YYYY [at] HH:mm')}
                  </Typography>
                </Box>
                <Divider sx={{ my: 0.25 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', flexShrink: 0 }}>Status</Typography>
                  <Chip
                    label="Work Completed"
                    size="small"
                    icon={<CheckCircle sx={{ fontSize: 12 }} />}
                    sx={{ height: 22, fontSize: '0.6875rem', fontWeight: 700, bgcolor: '#D4EDDA', color: '#147A45', '& .MuiChip-label': { px: 1 } }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.25 }}
        >
          <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1.5 }}>
                Customer Details
              </Typography>
              <Stack spacing={1.5}>
                <TextField
                  fullWidth
                  required
                  label="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                  required
                  label="Customer Role"
                  placeholder="e.g. Site Manager, Facilities Manager"
                  value={customerRole}
                  onChange={(e) => setCustomerRole(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        {/* Technician info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.25 }}
        >
          <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
            <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Person sx={{ fontSize: 18, color: 'primary.contrastText' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                    {technician?.name ?? 'Technician'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    Attending Technician · {technician?.employeeId}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Signature canvas */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.25 }}
        >
          <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1.5px solid', borderColor: isSigned ? '#147A45' : 'divider', transition: 'border-color 0.2s' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Draw sx={{ fontSize: 16 }} /> Customer Signature
                </Typography>
                {isSigned && (
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: 13 }} />}
                    label="Signature captured"
                    size="small"
                    sx={{ height: 24, fontSize: '0.75rem', fontWeight: 700, bgcolor: '#D4EDDA', color: '#147A45', '& .MuiChip-label': { px: 1 } }}
                  />
                )}
              </Box>

              {/* Canvas wrapper */}
              <Box
                sx={{
                  position: 'relative',
                  border: '1.5px solid',
                  borderColor: isSigned ? '#9DD4AF' : 'divider',
                  borderRadius: 2,
                  bgcolor: '#fff',
                  overflow: 'hidden',
                  mb: 1,
                  cursor: 'crosshair',
                }}
              >
                <SignatureCanvas
                  ref={sigPadRef}
                  onEnd={handleSignatureEnd}
                  canvasProps={{
                    width: 600,
                    height: 180,
                    style: { width: '100%', height: 180, display: 'block', touchAction: 'none' },
                  }}
                  penColor="#1A1B1F"
                  backgroundColor="#ffffff"
                />
                {!isSigned && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <Typography sx={{ color: 'text.disabled', fontSize: '0.9375rem', fontWeight: 500, userSelect: 'none' }}>
                      Sign here
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button
                  size="small"
                  startIcon={<Delete sx={{ fontSize: 15 }} />}
                  onClick={handleClear}
                  disabled={!isSigned}
                  sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem', color: '#BA1A1A', py: 0.5, px: 1, '&:disabled': { color: 'text.disabled' } }}
                >
                  Clear
                </Button>
                {capturedAt && (
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>
                    {dayjs(capturedAt).format('HH:mm:ss')}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Consent checkbox */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.25 }}
        >
          <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: consentChecked ? '#9DD4AF' : 'divider', bgcolor: consentChecked ? '#F0FAF4' : 'background.paper', transition: 'all 0.2s' }}>
            <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    sx={{ color: '#147A45', '&.Mui-checked': { color: '#147A45' } }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.9375rem', lineHeight: 1.5 }}>
                    I confirm the described work has been completed to my satisfaction.
                  </Typography>
                }
                sx={{ m: 0, alignItems: 'flex-start', '& .MuiCheckbox-root': { mt: -0.5 } }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer unavailable button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.25 }}
        >
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PersonOff sx={{ fontSize: 18 }} />}
            onClick={() => setUnavailableOpen(true)}
            sx={{
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 700,
              height: 48,
              borderColor: 'divider',
              color: 'text.secondary',
              mb: 1,
            }}
          >
            Customer unavailable to sign
          </Button>
        </motion.div>
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
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<Draw sx={{ fontSize: 18 }} />}
          onClick={handleSaveSignature}
          disabled={!canSubmit || submitted}
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
          {submitted ? 'Saved!' : 'Save Signature'}
        </Button>
        {!canSubmit && (
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', textAlign: 'center', mt: 0.75 }}>
            {!customerName.trim() ? 'Enter customer name' : !customerRole.trim() ? 'Enter customer role' : !isSigned ? 'Signature required' : 'Confirm consent above'}
          </Typography>
        )}
      </Box>

      {/* Customer unavailable dialog */}
      <Dialog
        open={unavailableOpen}
        onClose={() => setUnavailableOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { borderRadius: 3, mx: 2 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1 }}>
          Customer Unavailable to Sign
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 2 }}>
            Select a reason and provide any additional details.
          </Typography>
          <RadioGroup
            value={unavailableReason}
            onChange={(e) => setUnavailableReason(e.target.value)}
          >
            <Stack spacing={0.5} sx={{ mb: 2 }}>
              {UNAVAILABLE_REASONS.map((r) => (
                <FormControlLabel
                  key={r}
                  value={r}
                  control={<Radio size="small" />}
                  label={<Typography sx={{ fontSize: '0.9375rem', fontWeight: unavailableReason === r ? 700 : 400 }}>{r}</Typography>}
                  sx={{
                    m: 0,
                    p: 1,
                    borderRadius: 2,
                    bgcolor: unavailableReason === r ? '#EEF4FF' : 'transparent',
                    border: '1px solid',
                    borderColor: unavailableReason === r ? '#C4D4FF' : 'transparent',
                  }}
                />
              ))}
            </Stack>
          </RadioGroup>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Additional details (optional)"
            value={unavailableDetails}
            onChange={(e) => setUnavailableDetails(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setUnavailableOpen(false)}
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUnavailableConfirm}
            variant="contained"
            disabled={!unavailableReason}
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar message={snackText} />
    </Box>
  );
}
