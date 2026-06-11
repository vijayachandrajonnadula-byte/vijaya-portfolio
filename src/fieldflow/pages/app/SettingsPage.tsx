import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  DarkMode,
  LocationOn,
  CameraAlt,
  Notifications,
  WifiOff,
  CloudSync,
  CloudDownload,
  DeleteSweep,
  BugReport,
  SimCard,
  Help,
  ContactSupport,
  Policy,
  Info,
  Logout,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore, useOfflineStore, useDemoStore, useAuthStore } from '../../stores';

// ── localStorage keys ─────────────────────────────────────────────────────
const LS_WIFI_ONLY = 'fieldflow_wifi_only';
const LS_AUTO_SYNC = 'fieldflow_auto_sync';

function useLSSetting(key: string, defaultVal: boolean) {
  const stored = localStorage.getItem(key);
  const initial = stored !== null ? stored === 'true' : defaultVal;
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => {
    setValue((v) => {
      const next = !v;
      localStorage.setItem(key, String(next));
      return next;
    });
  }, [key]);
  return [value, toggle] as const;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { mode, toggle: toggleTheme } = useThemeStore();
  const { isOffline, isSimulated, toggleSimulated } = useOfflineStore();
  const { showDemoControls, toggleDemoControls } = useDemoStore();
  const { logout } = useAuthStore();

  const [wifiOnly, toggleWifiOnly] = useLSSetting(LS_WIFI_ONLY, true);
  const [autoSync, toggleAutoSync] = useLSSetting(LS_AUTO_SYNC, true);

  const [snackText, setSnackText] = useState<string | null>(null);
  const [clearCacheOpen, setClearCacheOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2600);
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', pb: '80px' }}>
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
        <Toolbar sx={{ px: 1, minHeight: 56 }}>
          <IconButton size="small" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowBack fontSize="small" />
          </IconButton>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', ml: 0.75 }}>
            Settings
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ px: 2, pt: 2 }}>
        {/* ── Appearance ────────────────────────────────────────────────── */}
        <SettingsSection label="Appearance">
          <SettingsItem
            icon={<DarkMode fontSize="small" />}
            label="Dark Mode"
            action={
              <Switch
                checked={mode === 'dark'}
                onChange={toggleTheme}
                size="small"
              />
            }
          />
        </SettingsSection>

        {/* ── Permissions ───────────────────────────────────────────────── */}
        <SettingsSection label="Permissions">
          {[
            {
              icon: <LocationOn fontSize="small" />,
              label: 'Location Access',
              msg: 'Location permissions are managed by your browser. Check site settings.',
            },
            {
              icon: <CameraAlt fontSize="small" />,
              label: 'Camera Access',
              msg: 'Camera permissions are managed by your browser. Check site settings.',
            },
            {
              icon: <Notifications fontSize="small" />,
              label: 'Push Notifications',
              msg: 'Notification permissions are managed by your browser. Check site settings.',
            },
          ].map((item, idx, arr) => (
            <Box key={item.label}>
              <SettingsItem
                icon={item.icon}
                label={item.label}
                action={
                  <Switch
                    defaultChecked
                    size="small"
                    onChange={() => showSnack(item.msg)}
                  />
                }
              />
              {idx < arr.length - 1 && <Divider sx={{ ml: 5.5 }} />}
            </Box>
          ))}
        </SettingsSection>

        {/* ── Offline & Sync ────────────────────────────────────────────── */}
        <SettingsSection label="Offline & Sync">
          <SettingsItem
            icon={<WifiOff fontSize="small" />}
            label="Download on Wi-Fi only"
            action={<Switch checked={wifiOnly} onChange={toggleWifiOnly} size="small" />}
          />
          <Divider sx={{ ml: 5.5 }} />
          <SettingsItem
            icon={<CloudSync fontSize="small" />}
            label="Auto-sync on reconnect"
            action={<Switch checked={autoSync} onChange={toggleAutoSync} size="small" />}
          />
          <Divider sx={{ ml: 5.5 }} />
          <SettingsItem
            icon={<CloudDownload fontSize="small" />}
            label="Offline downloads"
            secondary="12.4 MB used"
            onClick={() => showSnack('Offline storage used: 12.4 MB')}
          />
          <Divider sx={{ ml: 5.5 }} />
          <SettingsItem
            icon={<DeleteSweep fontSize="small" />}
            label="Clear cached data"
            labelColor="error.main"
            onClick={() => setClearCacheOpen(true)}
          />
        </SettingsSection>

        {/* ── Demo Controls ─────────────────────────────────────────────── */}
        <SettingsSection label="Demo Controls">
          <SettingsItem
            icon={<BugReport fontSize="small" />}
            label="Show demo controls panel"
            action={
              <Switch
                checked={showDemoControls}
                onChange={toggleDemoControls}
                size="small"
              />
            }
          />
          <Divider sx={{ ml: 5.5 }} />
          <SettingsItem
            icon={<SimCard fontSize="small" />}
            label="Simulate offline mode"
            action={
              <Switch
                checked={isOffline && isSimulated}
                onChange={toggleSimulated}
                size="small"
              />
            }
          />
        </SettingsSection>

        {/* ── Support ───────────────────────────────────────────────────── */}
        <SettingsSection label="Support">
          <SettingsItem
            icon={<Help fontSize="small" />}
            label="Help"
            onClick={() => showSnack('Help documentation not available in demo')}
          />
          <Divider sx={{ ml: 5.5 }} />
          <SettingsItem
            icon={<ContactSupport fontSize="small" />}
            label="Contact Supervisor"
            onClick={() => showSnack('Opening contact...')}
          />
          <Divider sx={{ ml: 5.5 }} />
          <SettingsItem
            icon={<Policy fontSize="small" />}
            label="Privacy Policy"
            onClick={() => showSnack('Privacy policy not available in demo')}
          />
          <Divider sx={{ ml: 5.5 }} />
          <SettingsItem
            icon={<Info fontSize="small" />}
            label="About FieldFlow"
            onClick={() => setAboutOpen(true)}
          />
        </SettingsSection>

        {/* ── Account ───────────────────────────────────────────────────── */}
        <SettingsSection label="Account">
          <SettingsItem
            icon={<Logout fontSize="small" />}
            label="Sign Out"
            labelColor="error.main"
            onClick={() => setSignOutOpen(true)}
          />
        </SettingsSection>
      </Box>

      {/* ── Clear cache dialog ─────────────────────────────────────────── */}
      <Dialog open={clearCacheOpen} onClose={() => setClearCacheOpen(false)}>
        <DialogTitle>Clear Cached Data?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will remove all locally cached task data and offline files (12.4 MB). Any
            unsynced work will be preserved. Downloaded tasks will need to be re-downloaded.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearCacheOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              setClearCacheOpen(false);
              showSnack('Cached data cleared');
            }}
          >
            Clear
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Sign out dialog ────────────────────────────────────────────── */}
      <Dialog open={signOutOpen} onClose={() => setSignOutOpen(false)}>
        <DialogTitle>Sign Out?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will be returned to the login screen. Any pending sync items will be uploaded
            when you next sign in.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignOutOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              setSignOutOpen(false);
              logout();
              navigate('/field-flow/login');
            }}
          >
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── About dialog ───────────────────────────────────────────────── */}
      <Dialog open={aboutOpen} onClose={() => setAboutOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>About FieldFlow</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1.5 }}>
            FieldFlow was designed as a native Android field-service application. For portfolio
            demonstration and browser-based usability testing, this implementation is a
            mobile-first web prototype.
          </DialogContentText>
          <DialogContentText sx={{ mb: 1.5 }}>
            Demo credentials: <strong>FF-1042 / demo123</strong>
          </DialogContentText>
          <DialogContentText sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
            Version 1.0.0 · Portfolio Demo
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAboutOpen(false)} sx={{ fontWeight: 700 }}>
            Close
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

// ── Section wrapper ───────────────────────────────────────────────────────
function SettingsSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Typography
        sx={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          mb: 0.75,
          mt: 0.5,
        }}
      >
        {label}
      </Typography>
      <Card sx={{ mb: 2, borderRadius: 3, overflow: 'hidden' }}>
        <List disablePadding>{children}</List>
      </Card>
    </motion.div>
  );
}

// ── Settings row ─────────────────────────────────────────────────────────
interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  secondary?: string;
  labelColor?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

function SettingsItem({
  icon,
  label,
  secondary,
  labelColor,
  action,
  onClick,
}: SettingsItemProps) {
  const content = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>{icon}</ListItemIcon>
      <ListItemText
        primary={label}
        secondary={secondary}
        sx={{
          '& .MuiListItemText-primary': {
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: labelColor ?? 'text.primary',
          },
          '& .MuiListItemText-secondary': { fontSize: '0.75rem' },
        }}
      />
      {action}
    </Box>
  );

  if (onClick) {
    return (
      <ListItemButton onClick={onClick} sx={{ py: 1.25, px: 2 }}>
        {content}
      </ListItemButton>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
      {content}
    </Box>
  );
}
