import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StorageIcon from '@mui/icons-material/Storage';

type PermissionStatus = 'pending' | 'granted' | 'denied';

interface Permission {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
}

const PERMISSIONS: Permission[] = [
  {
    id: 'location',
    label: 'Location',
    description: 'Required for GPS check-in at job sites and route tracking during shift.',
    icon: <LocationOnIcon sx={{ fontSize: 22 }} />,
    required: true,
  },
  {
    id: 'camera',
    label: 'Camera',
    description: 'Used to capture photo evidence, scan barcodes, and document completed work.',
    icon: <PhotoCameraIcon sx={{ fontSize: 22 }} />,
    required: true,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Receive new task assignments, urgent job alerts, and sync status updates.',
    icon: <NotificationsIcon sx={{ fontSize: 22 }} />,
    required: false,
  },
  {
    id: 'storage',
    label: 'Storage',
    description: 'Save task data, photos, and forms locally so you can work without internet.',
    icon: <StorageIcon sx={{ fontSize: 22 }} />,
    required: false,
  },
];

function StatusChip({ status }: { status: PermissionStatus }) {
  const map: Record<PermissionStatus, { label: string; bg: string; color: string; border: string }> = {
    pending: { label: 'Pending', bg: '#F7F8FC', color: '#5A5B64', border: '#C8C9D2' },
    granted: { label: 'Granted', bg: '#E8F5EE', color: '#147A45', border: '#A5D6B7' },
    denied: { label: 'Denied', bg: '#FDECEA', color: '#BA1A1A', border: '#F5BDBA' },
  };
  const s = map[status];
  return (
    <Chip
      label={s.label}
      size="small"
      sx={{
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontWeight: 700,
        fontSize: '0.6875rem',
        height: 24,
      }}
    />
  );
}

export default function PermissionsPage() {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState<Record<string, PermissionStatus>>({
    location: 'pending',
    camera: 'pending',
    notifications: 'pending',
    storage: 'pending',
  });

  const handleAllow = (id: string) => {
    // Simulate async browser permission grant
    setStatuses((prev) => ({ ...prev, [id]: 'granted' }));
  };

  const handleDeny = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: 'denied' }));
  };

  const requiredGranted =
    statuses['location'] === 'granted' && statuses['camera'] === 'granted';

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        backgroundColor: '#F7F8FC',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 480,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          px: 3,
          pt: 5,
          pb: 4,
        }}
      >
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '18px',
              backgroundColor: '#EEF2FF',
              border: '1.5px solid #C7D3F8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <Box sx={{ display: 'flex', gap: '3px' }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: '#2457D6' }} />
                <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: '#5C7FE0' }} />
              </Box>
              <Box sx={{ display: 'flex', gap: '3px' }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: '#5C7FE0' }} />
                <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: '#2457D6' }} />
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#1A1B1F', mb: 0.75 }}>
            Allow FieldFlow to access your device
          </Typography>
          <Typography variant="body1" sx={{ color: '#5A5B64', mb: 3.5 }}>
            These permissions let the app work the way field technicians need it to.
          </Typography>
        </motion.div>

        {/* Permission rows */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: 'easeOut' }}
        >
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: 3,
              border: '1px solid #E2E3EB',
              overflow: 'hidden',
              mb: 2,
            }}
          >
            {PERMISSIONS.map((perm, i) => {
              const status = statuses[perm.id];
              const isPending = status === 'pending';
              return (
                <Box
                  key={perm.id}
                  sx={{
                    px: 2.5,
                    py: 2,
                    borderBottom: i < PERMISSIONS.length - 1 ? '1px solid #E2E3EB' : 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: status === 'granted' ? '#E8F5EE' : status === 'denied' ? '#FDECEA' : '#EEF2FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: status === 'granted' ? '#147A45' : status === 'denied' ? '#BA1A1A' : '#2457D6',
                        transition: 'background-color 0.2s, color 0.2s',
                      }}
                    >
                      {perm.icon}
                    </Box>

                    {/* Text */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.4 }}>
                        <Typography variant="subtitle2" sx={{ color: '#1A1B1F' }}>
                          {perm.label}
                        </Typography>
                        {perm.required && (
                          <Chip
                            label="Required"
                            size="small"
                            sx={{
                              backgroundColor: '#FFF4E5',
                              color: '#A06400',
                              border: '1px solid #F5DAAD',
                              fontWeight: 700,
                              fontSize: '0.6875rem',
                              height: 20,
                            }}
                          />
                        )}
                        <Box sx={{ ml: 'auto', flexShrink: 0 }}>
                          <StatusChip status={status} />
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#5A5B64', lineHeight: 1.5 }}>
                        {perm.description}
                      </Typography>

                      {/* Action buttons — only shown when pending */}
                      {isPending && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleAllow(perm.id)}
                            sx={{ borderRadius: '100px', minHeight: 34, fontSize: '0.8125rem' }}
                          >
                            Allow
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleDeny(perm.id)}
                            sx={{
                              borderRadius: '100px',
                              minHeight: 34,
                              fontSize: '0.8125rem',
                              borderColor: '#C8C9D2',
                              color: '#5A5B64',
                              '&:hover': { borderColor: '#9E9EA6', backgroundColor: 'rgba(0,0,0,0.03)' },
                            }}
                          >
                            Deny
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </motion.div>

        {/* Demo note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Box
            sx={{
              backgroundColor: '#EEF2FF',
              border: '1px solid #C7D3F8',
              borderRadius: 2,
              px: 2,
              py: 1.5,
              mb: 3,
            }}
          >
            <Typography variant="caption" sx={{ color: '#5A5B64' }}>
              <Box component="span" sx={{ fontWeight: 700, color: '#2457D6' }}>Portfolio demo:</Box>{' '}
              This demo simulates browser permission responses. No real device access is requested.
            </Typography>
          </Box>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.24, ease: 'easeOut' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={!requiredGranted}
              onClick={() => navigate('/field-flow/app/home')}
              sx={{ borderRadius: '100px' }}
            >
              Continue to app
            </Button>

            {!requiredGranted && (
              <Typography variant="caption" sx={{ color: '#9E9EA6', textAlign: 'center', mt: 0.5 }}>
                Allow Location and Camera to continue
              </Typography>
            )}

            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/field-flow/app/home')}
              sx={{
                color: '#74747D',
                fontWeight: 500,
                fontSize: '0.875rem',
                mt: 0.5,
                minHeight: 'auto',
                '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
              }}
            >
              Skip for now
            </Button>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
