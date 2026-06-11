import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Edit,
  Settings,
  Sync,
  SupervisorAccount,
  Help,
  Logout,
  WorkspacePremium,
  AccessTime,
  PlayArrow,
  Stop,
  NavigateNext,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useTaskStore } from '../../stores';

dayjs.extend(duration);

// ── helpers ────────────────────────────────────────────────────────────────
function hoursWorked(shiftStart?: string): string {
  if (!shiftStart) return '0h 0m';
  const mins = dayjs().diff(dayjs(shiftStart), 'minute');
  if (mins < 0) return '0h 0m';
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

const SHIFT_CONFIG = {
  on_shift: { label: 'On Shift', bg: '#D4EDDA', color: '#147A45' },
  off_shift: { label: 'Off Shift', bg: '#EEEEF6', color: '#5A5B64' },
  on_break: { label: 'On Break', bg: '#FFF5E0', color: '#A06400' },
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { technician, logout, updateShiftStatus } = useAuthStore();
  const { tasks } = useTaskStore();

  const [snackText, setSnackText] = useState<string | null>(null);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2600);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/field-flow/login');
  }, [logout, navigate]);

  // Stats
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  const todayTasks = tasks.filter(
    (t) => new Date(t.scheduledStart) >= todayStart,
  ).length;
  const weekCompleted = tasks.filter(
    (t) =>
      ['completed', 'submitted', 'approved'].includes(t.status) &&
      new Date(t.scheduledStart) >= weekStart,
  ).length;

  const certCount = technician?.certifications?.length ?? 0;
  const skillCount = technician?.skills?.length ?? 0;

  const shiftConf = SHIFT_CONFIG[technician?.shiftStatus ?? 'off_shift'];
  const isOnShift = technician?.shiftStatus === 'on_shift';

  if (!technician) return null;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', pb: '80px' }}>

      {/* ── Hero header ──────────────────────────────────────────────────── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1A3FA8 0%, #2457D6 60%, #5C7FE0 100%)',
          pt: 6,
          pb: 3,
          px: 2,
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'rgba(255,255,255,0.2)',
              fontSize: '1.75rem',
              fontWeight: 800,
              mx: 'auto',
              mb: 1.5,
              border: '3px solid rgba(255,255,255,0.4)',
              color: '#fff',
            }}
          >
            {technician.avatarInitials}
          </Avatar>

          <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', mb: 0.25 }}>
            {technician.name}
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', opacity: 0.85, mb: 0.25 }}>
            {technician.employeeId}
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', opacity: 0.75, mb: 1.5 }}>
            {technician.team} · {technician.region}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            <Chip
              label={shiftConf.label}
              size="small"
              sx={{
                bgcolor: shiftConf.bg,
                color: shiftConf.color,
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Edit sx={{ fontSize: 15 }} />}
            onClick={() => showSnack('Profile editing not available in demo')}
            sx={{
              borderColor: 'rgba(255,255,255,0.5)',
              color: '#fff',
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Edit Profile
          </Button>
        </motion.div>
      </Box>

      <Box sx={{ px: 2, pt: 2 }}>

        {/* ── Stats grid ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1.25,
              mb: 2,
            }}
          >
            {[
              { label: 'Tasks Today', value: todayTasks, color: '#2457D6', bg: '#E8EFFF' },
              { label: 'Done This Week', value: weekCompleted, color: '#147A45', bg: '#D4EDDA' },
              { label: 'Certifications', value: certCount, color: '#7B2D9E', bg: '#F3E8FF' },
              { label: 'Skills', value: skillCount, color: '#006A60', bg: '#E0F4F1' },
            ].map((s) => (
              <Card key={s.label} sx={{ borderRadius: 3, bgcolor: s.bg, border: 'none' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>
                    {s.value}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '0.75rem', fontWeight: 600, color: s.color, opacity: 0.85 }}
                  >
                    {s.label}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </motion.div>

        {/* ── Skills ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17, duration: 0.35 }}
        >
          <SectionLabel>Skills</SectionLabel>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
            {technician.skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="small"
                sx={{
                  fontWeight: 600,
                  bgcolor: '#E8EFFF',
                  color: '#2457D6',
                  fontSize: '0.8125rem',
                }}
              />
            ))}
          </Box>
        </motion.div>

        {/* ── Certifications ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.35 }}
        >
          <SectionLabel>Certifications</SectionLabel>
          <Card sx={{ mb: 2, borderRadius: 3 }}>
            {technician.certifications.map((cert, idx) => (
              <Box key={cert}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.25 }}>
                  <WorkspacePremium sx={{ fontSize: 20, color: '#7B2D9E' }} />
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, flex: 1 }}>
                    {cert}
                  </Typography>
                </Box>
                {idx < technician.certifications.length - 1 && <Divider sx={{ ml: 6 }} />}
              </Box>
            ))}
          </Card>
        </motion.div>

        {/* ── Shift section ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.27, duration: 0.35 }}
        >
          <SectionLabel>Current Shift</SectionLabel>
          <Card sx={{ mb: 2, borderRadius: 3 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 1,
                  mb: 1.5,
                  textAlign: 'center',
                }}
              >
                {[
                  {
                    label: 'Start',
                    value: technician.shiftStart
                      ? dayjs(technician.shiftStart).format('HH:mm')
                      : '--:--',
                  },
                  {
                    label: 'End',
                    value: technician.shiftEnd
                      ? dayjs(technician.shiftEnd).format('HH:mm')
                      : '--:--',
                  },
                  {
                    label: 'Worked',
                    value: isOnShift ? hoursWorked(technician.shiftStart) : '0h 0m',
                  },
                ].map((s) => (
                  <Box key={s.label}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {s.value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Button
                fullWidth
                variant={isOnShift ? 'outlined' : 'contained'}
                startIcon={isOnShift ? <Stop /> : <PlayArrow />}
                onClick={() => {
                  if (isOnShift) {
                    updateShiftStatus('off_shift');
                    showSnack('Shift ended.');
                  } else {
                    updateShiftStatus('on_shift');
                    showSnack('Shift started. Good luck!');
                  }
                }}
                color={isOnShift ? 'error' : 'primary'}
                sx={{
                  borderRadius: '100px',
                  textTransform: 'none',
                  fontWeight: 700,
                  height: 44,
                  boxShadow: 'none',
                }}
              >
                {isOnShift ? 'End Shift' : 'Start Shift'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Quick links ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.35 }}
        >
          <SectionLabel>Quick Links</SectionLabel>
          <Card sx={{ mb: 2, borderRadius: 3, overflow: 'hidden' }}>
            <List disablePadding>
              {[
                {
                  label: 'Settings',
                  icon: <Settings fontSize="small" />,
                  onClick: () => navigate('/field-flow/app/settings'),
                },
                {
                  label: 'Sync Centre',
                  icon: <Sync fontSize="small" />,
                  onClick: () => navigate('/field-flow/app/sync-centre'),
                },
                {
                  label: 'Supervisor Panel',
                  icon: <SupervisorAccount fontSize="small" />,
                  onClick: () => navigate('/field-flow/app/supervisor'),
                },
                {
                  label: 'Help & Support',
                  icon: <Help fontSize="small" />,
                  onClick: () => showSnack('Help documentation not available in demo'),
                },
              ].map((item, idx, arr) => (
                <Box key={item.label}>
                  <ListItemButton onClick={item.onClick} sx={{ py: 1.25 }}>
                    <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{ '& .MuiListItemText-primary': { fontSize: '0.9375rem', fontWeight: 500 } }}
                    />
                    <NavigateNext sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemButton>
                  {idx < arr.length - 1 && <Divider sx={{ ml: 5.5 }} />}
                </Box>
              ))}
            </List>
          </Card>
        </motion.div>

        {/* ── Sign out ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.37, duration: 0.35 }}
        >
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 700,
              height: 48,
              mb: 1.5,
            }}
          >
            Sign Out
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <AccessTime sx={{ fontSize: 12, color: 'text.disabled' }} />
            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', textAlign: 'center' }}>
              FieldFlow v1.0.0 – Portfolio Demo
            </Typography>
          </Box>
        </motion.div>
      </Box>

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

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      sx={{
        fontSize: '0.6875rem',
        fontWeight: 700,
        color: 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}
