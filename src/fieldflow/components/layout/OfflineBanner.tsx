import { Box, Typography, Button, Stack } from '@mui/material';
import { CloudOff, Sync } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useOfflineStore } from '../../stores';
import { useSyncStore } from '../../stores';

export default function OfflineBanner() {
  const { isOffline, isSimulated } = useOfflineStore();
  const { pendingCount, syncAll, isSyncing } = useSyncStore();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ overflow: 'hidden' }}
        >
          <Box
            role="status"
            aria-live="polite"
            sx={{
              bgcolor: '#6B4E16',
              color: '#fff',
              px: 2,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <CloudOff sx={{ fontSize: 16 }} />
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', lineHeight: 1.2 }}>
                  {isSimulated ? 'Offline (simulated)' : 'No connection'}
                </Typography>
                {pendingCount() > 0 && (
                  <Typography variant="caption" sx={{ opacity: 0.85 }}>
                    {pendingCount()} item{pendingCount() !== 1 ? 's' : ''} waiting to sync
                  </Typography>
                )}
              </Box>
            </Stack>
            {!isOffline && pendingCount() > 0 && (
              <Button
                size="small"
                startIcon={<Sync />}
                onClick={() => syncAll()}
                disabled={isSyncing}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  minHeight: 32,
                  fontSize: '0.75rem',
                }}
                variant="outlined"
              >
                {isSyncing ? 'Syncing…' : 'Sync now'}
              </Button>
            )}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
