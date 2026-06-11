import { useState, useEffect, useCallback } from 'react';
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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Warning,
  GpsFixed,
  GpsOff,
  MyLocation,
  LocationOn,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore, useDemoStore } from '../../stores';

// ─── snackbar ─────────────────────────────────────────────────────────────

interface SnackbarProps {
  message: string | null;
}

function Snackbar({ message }: SnackbarProps) {
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

// ─── helper ───────────────────────────────────────────────────────────────

function formatCoord(n: number, decimals = 5): string {
  return n.toFixed(decimals);
}

// ─── main component ───────────────────────────────────────────────────────

export default function CheckInPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const { getTask, checkIn } = useTaskStore();
  const { locationSimulation, setLocationSimulation, showDemoControls } = useDemoStore();

  const task = getTask(taskId ?? '');

  const [currentTime, setCurrentTime] = useState(new Date());
  const [snackText, setSnackText] = useState<string | null>(null);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2800);
  }, []);

  const handleCheckIn = useCallback(() => {
    if (!taskId) return;
    checkIn(taskId);
    showSnack('Checked in successfully');
    setTimeout(() => {
      navigate(`/field-flow/app/tasks/${taskId}`);
    }, 1500);
  }, [taskId, checkIn, showSnack, navigate]);

  const handleOverrideSubmit = useCallback(() => {
    if (!overrideReason.trim()) return;
    setOverrideOpen(false);
    checkIn(taskId ?? '');
    showSnack('Override check-in submitted for supervisor review');
    setTimeout(() => {
      navigate(`/field-flow/app/tasks/${taskId}`);
    }, 1500);
  }, [overrideReason, checkIn, taskId, showSnack, navigate]);

  if (!task) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
          <Toolbar sx={{ px: 1, minHeight: 56 }}>
            <IconButton onClick={() => navigate(-1)} edge="start" aria-label="Go back"><ArrowBack /></IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', ml: 0.5 }}>Check In</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Task not found.</Typography>
        </Box>
      </Box>
    );
  }

  // Derive simulated coordinates
  const siteLat = task.address.lat;
  const siteLng = task.address.lng;
  const currentLat = locationSimulation === 'outside_site' ? siteLat + 0.003 : siteLat;
  const currentLng = locationSimulation === 'outside_site' ? siteLng + 0.003 : siteLng;

  // Distance calculation (Haversine simplified for short distances)
  const deltaLat = (currentLat - siteLat) * 111320;
  const deltaLng = (currentLng - siteLng) * 111320 * Math.cos((siteLat * Math.PI) / 180);
  const distanceMetres = Math.round(Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng));

  const isNear = locationSimulation === 'near_site';
  const isUnavailable = locationSimulation === 'none';
  const canCheckIn = isNear;

  const siteAddress = `${task.address.line1}, ${task.address.city} ${task.address.state} ${task.address.postcode}`;

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
            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Check In</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: 'monospace' }}>
              {task.workOrderNumber}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, px: 2, pt: 2, pb: '80px' }}>

        {/* Date / time */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums' }}>
              {dayjs(currentTime).format('HH:mm:ss')}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              {dayjs(currentTime).format('dddd, D MMMM YYYY')}
            </Typography>
          </Box>
        </motion.div>

        {/* Location card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.3 }}>
          <Card sx={{ mb: 1.5, borderRadius: 3 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <GpsFixed sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary' }}>
                  Current Location
                </Typography>
              </Box>

              {isUnavailable ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 2, bgcolor: '#FFF0EE', border: '1px solid #F5B8B4' }}>
                  <GpsOff sx={{ fontSize: 18, color: '#BA1A1A' }} />
                  <Typography sx={{ fontSize: '0.875rem', color: '#BA1A1A', fontWeight: 600 }}>
                    GPS signal unavailable
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mb: 0.25 }}>Coordinates</Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', fontFamily: 'monospace' }}>
                        {formatCoord(currentLat)}, {formatCoord(currentLng)}
                      </Typography>
                    </Box>
                    <Chip
                      label="±8m"
                      size="small"
                      icon={<MyLocation sx={{ fontSize: 13 }} />}
                      sx={{ bgcolor: '#D4F0EC', color: '#006A60', fontWeight: 700, fontSize: '0.75rem', height: 24, '& .MuiChip-label': { px: 1 } }}
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mb: 0.25 }}>Site Address</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                      <LocationOn sx={{ fontSize: 14, color: 'text.secondary', mt: 0.15, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{siteAddress}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mb: 0.25 }}>Distance from Site</Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: isNear ? '#147A45' : '#A06400' }}>
                        {distanceMetres}m
                      </Typography>
                    </Box>
                    <Chip
                      label={isNear ? 'Within range' : 'Outside range (simulated)'}
                      size="small"
                      sx={{
                        bgcolor: isNear ? '#D4EDDA' : '#FFF5E0',
                        color: isNear ? '#147A45' : '#A06400',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: 24,
                        '& .MuiChip-label': { px: 1 },
                      }}
                    />
                  </Box>
                </Stack>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Status state card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.3 }}>
          <AnimatePresence mode="wait">
            {isUnavailable && (
              <motion.div key="unavailable" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#FFF0EE', border: '2px solid #F5B8B4', mb: 1.5, textAlign: 'center' }}>
                  <GpsOff sx={{ fontSize: 40, color: '#BA1A1A', mb: 1 }} />
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#BA1A1A', mb: 0.5 }}>
                    Location Unavailable
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#BA1A1A' }}>
                    Unable to determine your GPS location. Enable location services or use the demo controls below.
                  </Typography>
                </Box>
              </motion.div>
            )}

            {isNear && (
              <motion.div key="near" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#D4EDDA', border: '2px solid #9DD4AF', mb: 1.5, textAlign: 'center' }}>
                  <CheckCircle sx={{ fontSize: 40, color: '#147A45', mb: 1 }} />
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#147A45', mb: 0.5 }}>
                    You are within the check-in zone (50m)
                  </Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#147A45', fontFamily: 'monospace' }}>
                    {formatCoord(currentLat)}, {formatCoord(currentLng)}
                  </Typography>
                </Box>
              </motion.div>
            )}

            {locationSimulation === 'outside_site' && (
              <motion.div key="outside" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#FFF5E0', border: '2px solid #E8D4A0', mb: 1.5, textAlign: 'center' }}>
                  <Warning sx={{ fontSize: 40, color: '#A06400', mb: 1 }} />
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#A06400', mb: 0.5 }}>
                    You are {distanceMetres}m from the required check-in zone
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#6B4E16' }}>
                    Move within 50m of the site to check in, or request a supervisor override.
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Demo controls */}
        {showDemoControls && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.3 }}>
            <Card sx={{ mb: 1.5, borderRadius: 3, border: '2px dashed', borderColor: 'divider' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1 }}>
                  Demo Controls
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mb: 1.5 }}>
                  Current simulation:{' '}
                  <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {locationSimulation === 'near_site' ? 'Near site' : locationSimulation === 'outside_site' ? 'Outside site' : 'None'}
                  </Box>
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant={locationSimulation === 'near_site' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setLocationSimulation('near_site')}
                    sx={{
                      flex: 1,
                      borderRadius: '100px',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      height: 38,
                      boxShadow: 'none',
                      ...(locationSimulation === 'near_site' && { bgcolor: '#147A45', '&:hover': { bgcolor: '#0f6038', boxShadow: 'none' } }),
                    }}
                  >
                    Simulate Near Site
                  </Button>
                  <Button
                    variant={locationSimulation === 'outside_site' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setLocationSimulation('outside_site')}
                    sx={{
                      flex: 1,
                      borderRadius: '100px',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      height: 38,
                      boxShadow: 'none',
                      ...(locationSimulation === 'outside_site' && { bgcolor: '#A06400', '&:hover': { bgcolor: '#7a4d00', boxShadow: 'none' } }),
                    }}
                  >
                    Simulate Outside Site
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Site details */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.3 }}>
          <Card sx={{ mb: 1.5, borderRadius: 3 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1 }}>
                Task
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.25 }}>{task.title}</Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontFamily: 'monospace' }}>{task.workOrderNumber}</Typography>
              <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mb: 0.5 }}>Scheduled Start</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                  {dayjs(task.scheduledStart).format('ddd, D MMM YYYY [at] HH:mm')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      {/* Sticky bottom action bar */}
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
          {locationSimulation === 'outside_site' && (
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => setOverrideOpen(true)}
              sx={{
                borderRadius: '100px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.9375rem',
                height: 48,
                borderColor: '#A06400',
                color: '#A06400',
              }}
            >
              Request Override
            </Button>
          )}
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<CheckCircle sx={{ fontSize: 18 }} />}
            onClick={handleCheckIn}
            disabled={!canCheckIn}
            sx={{
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              height: 52,
              boxShadow: 'none',
              bgcolor: '#147A45',
              '&:hover': { bgcolor: '#0f6038', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
            }}
          >
            Confirm Check-In
          </Button>
          {!canCheckIn && !isUnavailable && (
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', textAlign: 'center', fontWeight: 500 }}>
              You must be within 50m of the site to check in
            </Typography>
          )}
        </Stack>
      </Box>

      {/* Override dialog */}
      <Dialog open={overrideOpen} onClose={() => setOverrideOpen(false)} slotProps={{ paper: { sx: { borderRadius: 3, mx: 2 } } }} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1 }}>
          Request Check-In Override
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 2 }}>
            You are {distanceMetres}m from the site. Provide a reason for the override — this will be sent to your supervisor for review.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="e.g. GPS signal affected by surrounding buildings. I am physically on-site at the correct address."
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setOverrideOpen(false)}
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOverrideSubmit}
            variant="contained"
            disabled={!overrideReason.trim()}
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
          >
            Submit Override
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar message={snackText} />
    </Box>
  );
}
