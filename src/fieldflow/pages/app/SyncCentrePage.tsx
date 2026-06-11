import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  SyncOutlined,
  WifiOff,
  Wifi,
  CheckCircle,
  ErrorOutlined,
  Pending,
  Assignment,
  PhotoCamera,
  Inventory,
  Note,
  CheckBox,
  Draw,
  LocationOn,
  Refresh,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion, AnimatePresence } from 'framer-motion';
import { useSyncStore, useOfflineStore } from '../../stores';
import type { SyncQueueItem } from '../../types';

dayjs.extend(relativeTime);

// ── item type config ───────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  SyncQueueItem['type'],
  { icon: React.ReactNode; label: string }
> = {
  task_update: { icon: <Assignment sx={{ fontSize: 18 }} />, label: 'Task Update' },
  evidence: { icon: <PhotoCamera sx={{ fontSize: 18 }} />, label: 'Evidence' },
  material: { icon: <Inventory sx={{ fontSize: 18 }} />, label: 'Material' },
  note: { icon: <Note sx={{ fontSize: 18 }} />, label: 'Note' },
  checklist: { icon: <CheckBox sx={{ fontSize: 18 }} />, label: 'Checklist' },
  signature: { icon: <Draw sx={{ fontSize: 18 }} />, label: 'Signature' },
  check_in: { icon: <LocationOn sx={{ fontSize: 18 }} />, label: 'Check-in' },
  check_out: { icon: <LocationOn sx={{ fontSize: 18 }} />, label: 'Check-out' },
};

const STATUS_CHIP: Record<
  SyncQueueItem['status'],
  { label: string; bg: string; color: string }
> = {
  pending: { label: 'Pending', bg: '#FFF5E0', color: '#A06400' },
  syncing: { label: 'Syncing', bg: '#E8EFFF', color: '#2457D6' },
  synced: { label: 'Synced', bg: '#D4EDDA', color: '#147A45' },
  failed: { label: 'Failed', bg: '#FDECEA', color: '#BA1A1A' },
};

type TabKey = 'pending' | 'failed' | 'synced';

export default function SyncCentrePage() {
  const navigate = useNavigate();
  const { queue, isSyncing, lastSyncAt, syncAll, retryItem, clearSynced, pendingCount, failedCount } =
    useSyncStore();
  const { isOffline } = useOfflineStore();

  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [snackText, setSnackText] = useState<string | null>(null);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2500);
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (!isOffline && pendingCount() > 0) {
      syncAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOffline]);

  const pending = queue.filter((i) => i.status === 'pending' || i.status === 'syncing');
  const failed = queue.filter((i) => i.status === 'failed');
  const synced = queue.filter((i) => i.status === 'synced');

  const allSynced = queue.length > 0 && pending.length === 0 && failed.length === 0;
  const isEmpty = queue.length === 0;

  const tabItems: Record<TabKey, SyncQueueItem[]> = { pending, failed, synced };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh' }}>
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
        <Toolbar sx={{ px: 1, minHeight: 56, gap: 0.5 }}>
          <IconButton size="small" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowBack fontSize="small" />
          </IconButton>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', ml: 0.5, flex: 1 }}>
            Sync Centre
          </Typography>
          <IconButton
            size="small"
            onClick={() => {
              if (!isOffline) syncAll();
              else showSnack('Cannot sync while offline');
            }}
            disabled={isSyncing || isOffline}
            aria-label="Sync all"
            sx={{
              animation: isSyncing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          >
            <SyncOutlined fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ px: 2, pt: 2, pb: '80px' }}>

        {/* ── Status summary card ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card
            sx={{
              mb: 2,
              borderRadius: 3,
              bgcolor: isOffline ? '#FFF5E0' : '#D4EDDA',
              border: 'none',
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: isOffline ? '#A06400' : '#147A45',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  {isOffline ? (
                    <WifiOff sx={{ fontSize: 20 }} />
                  ) : (
                    <Wifi sx={{ fontSize: 20 }} />
                  )}
                </Box>
                <Box>
                  <Typography
                    sx={{ fontWeight: 700, fontSize: '1rem', color: isOffline ? '#A06400' : '#147A45' }}
                  >
                    {isOffline ? 'Offline' : 'Online'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {lastSyncAt
                      ? `Last sync ${dayjs(lastSyncAt).fromNow()}`
                      : 'Never synced'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<Pending sx={{ fontSize: 14 }} />}
                  label={`${pendingCount()} pending`}
                  size="small"
                  sx={{
                    bgcolor: pendingCount() > 0 ? '#FFF5E0' : 'action.hover',
                    color: pendingCount() > 0 ? '#A06400' : 'text.secondary',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                />
                <Chip
                  icon={<ErrorOutlined sx={{ fontSize: 14 }} />}
                  label={`${failedCount()} failed`}
                  size="small"
                  sx={{
                    bgcolor: failedCount() > 0 ? '#FDECEA' : 'action.hover',
                    color: failedCount() > 0 ? '#BA1A1A' : 'text.secondary',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                />
                <Chip
                  icon={<CheckCircle sx={{ fontSize: 14 }} />}
                  label={`${synced.length} synced`}
                  size="small"
                  sx={{
                    bgcolor: synced.length > 0 ? '#D4EDDA' : 'action.hover',
                    color: synced.length > 0 ? '#147A45' : 'text.secondary',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Offline warning ───────────────────────────────────────────── */}
        <AnimatePresence>
          {isOffline && (
            <motion.div
              key="offline-warn"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert
                severity="warning"
                icon={<WifiOff fontSize="small" />}
                sx={{ mb: 2, borderRadius: 2 }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  You are offline
                </Typography>
                <Typography sx={{ fontSize: '0.75rem' }}>
                  Items will sync automatically when your connection is restored.
                </Typography>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Sync All button ───────────────────────────────────────────── */}
        <Button
          fullWidth
          variant="contained"
          startIcon={
            <SyncOutlined
              sx={{
                animation: isSyncing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          }
          disabled={isOffline || isSyncing}
          onClick={() => syncAll()}
          sx={{
            mb: 2,
            borderRadius: '100px',
            textTransform: 'none',
            fontWeight: 700,
            height: 48,
            boxShadow: 'none',
          }}
        >
          {isSyncing ? 'Syncing...' : 'Sync All'}
        </Button>

        {/* ── All synced celebration ────────────────────────────────────── */}
        <AnimatePresence>
          {(allSynced || isEmpty) && !isSyncing && (
            <motion.div
              key="all-synced"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card sx={{ mb: 2, borderRadius: 3, textAlign: 'center', py: 3 }}>
                <CheckCircle sx={{ fontSize: 48, color: '#147A45', mb: 1 }} />
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>All items synced</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  Your work is up to date.
                </Typography>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        {queue.length > 0 && (
          <>
            <Box
              sx={{
                display: 'flex',
                gap: 0.75,
                mb: 1.5,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {(
                [
                  { key: 'pending' as const, label: `Pending (${pending.length})`, color: '#A06400' },
                  { key: 'failed' as const, label: `Failed (${failed.length})`, color: '#BA1A1A' },
                  { key: 'synced' as const, label: `Synced (${synced.length})`, color: '#147A45' },
                ] as const
              ).map((tab) => (
                <Chip
                  key={tab.key}
                  label={tab.label}
                  size="small"
                  onClick={() => setActiveTab(tab.key)}
                  sx={{
                    fontWeight: activeTab === tab.key ? 700 : 500,
                    bgcolor:
                      activeTab === tab.key
                        ? tab.color
                        : 'action.hover',
                    color: activeTab === tab.key ? '#fff' : 'text.secondary',
                    flexShrink: 0,
                  }}
                />
              ))}
            </Box>

            {/* Queue items */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {tabItems[activeTab].length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 5 }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      No {activeTab} items
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                    {tabItems[activeTab].map((item) => (
                      <SyncItemCard
                        key={item.id}
                        item={item}
                        onRetry={retryItem}
                        onRetrySnack={() => showSnack('Retrying...')}
                      />
                    ))}
                  </Box>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {/* ── Clear synced ──────────────────────────────────────────────── */}
        {synced.length > 0 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                clearSynced();
                showSnack('Synced items cleared');
              }}
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '0.8125rem',
              }}
            >
              Clear synced items
            </Button>
          </Box>
        )}
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

// ── SyncItemCard ─────────────────────────────────────────────────────────
interface SyncItemCardProps {
  item: SyncQueueItem;
  onRetry: (id: string) => void;
  onRetrySnack: () => void;
}

function SyncItemCard({ item, onRetry, onRetrySnack }: SyncItemCardProps) {
  const typeConf = TYPE_CONFIG[item.type] ?? {
    icon: <Assignment sx={{ fontSize: 18 }} />,
    label: item.type,
  };
  const statusConf = STATUS_CHIP[item.status];
  const isSyncing = item.status === 'syncing';

  return (
    <Card sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
      {isSyncing && <LinearProgress sx={{ height: 2 }} />}
      <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
        <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
          {/* Icon */}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              flexShrink: 0,
            }}
          >
            {typeConf.icon}
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.35 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, flex: 1, minWidth: 0 }}>
                {typeConf.label}
              </Typography>
              <Chip
                label={statusConf.label}
                size="small"
                sx={{
                  height: 18,
                  bgcolor: statusConf.bg,
                  color: statusConf.color,
                  fontWeight: 700,
                  fontSize: '0.6875rem',
                  flexShrink: 0,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            </Box>

            <Typography
              sx={{
                fontSize: '0.8125rem',
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mb: 0.25,
              }}
            >
              {item.taskTitle}
            </Typography>

            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {dayjs(item.createdAt).fromNow()}
            </Typography>

            {/* Failed details */}
            {item.status === 'failed' && (
              <Box sx={{ mt: 0.75 }}>
                <Divider sx={{ mb: 0.75 }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#BA1A1A', mb: 0.5 }}>
                  {item.errorMessage ?? 'Upload failed'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {item.retryCount} attempt{item.retryCount !== 1 ? 's' : ''}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Refresh sx={{ fontSize: 13 }} />}
                    onClick={() => {
                      onRetry(item.id);
                      onRetrySnack();
                    }}
                    sx={{
                      borderRadius: '100px',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      py: 0.25,
                      px: 1.25,
                      height: 26,
                    }}
                  >
                    Retry
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
