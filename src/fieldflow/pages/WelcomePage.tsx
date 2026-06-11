import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useAuthStore } from '../stores';

const features = [
  {
    icon: <AssignmentTurnedInIcon sx={{ fontSize: 20, color: '#2457D6' }} />,
    title: 'Receive tasks instantly',
    description: 'Jobs appear on your device the moment a supervisor assigns them.',
  },
  {
    icon: <WifiOffIcon sx={{ fontSize: 20, color: '#2457D6' }} />,
    title: 'Work without signal',
    description: 'Complete checklists, add notes and capture photos fully offline.',
  },
  {
    icon: <VerifiedIcon sx={{ fontSize: 20, color: '#2457D6' }} />,
    title: 'Prove every completion',
    description: 'GPS check-in, photo evidence and customer signature in one tap.',
  },
];

function TechnicianIllustration() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 200,
        height: 180,
        mx: 'auto',
      }}
    >
      {/* Background circle */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 160,
          height: 80,
          borderRadius: '50%',
          backgroundColor: '#DCE4FF',
        }}
      />

      {/* Body */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 48,
          height: 60,
          borderRadius: '10px 10px 6px 6px',
          backgroundColor: '#2457D6',
        }}
      />

      {/* Hi-vis vest stripe */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 68,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 48,
          height: 10,
          backgroundColor: '#F9A825',
          borderRadius: 1,
        }}
      />

      {/* Head */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: '#FFCC80',
        }}
      />

      {/* Hard hat */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 127,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 44,
          height: 20,
          borderRadius: '22px 22px 0 0',
          backgroundColor: '#F9A825',
        }}
      />

      {/* Left arm */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 60,
          left: 'calc(50% - 38px)',
          width: 14,
          height: 44,
          borderRadius: 8,
          backgroundColor: '#1A3FA8',
          transform: 'rotate(-12deg)',
          transformOrigin: 'top center',
        }}
      />

      {/* Right arm holding clipboard */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 58,
          left: 'calc(50% + 24px)',
          width: 14,
          height: 44,
          borderRadius: 8,
          backgroundColor: '#1A3FA8',
          transform: 'rotate(14deg)',
          transformOrigin: 'top center',
        }}
      />

      {/* Clipboard */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 36,
          left: 'calc(50% + 34px)',
          width: 32,
          height: 40,
          borderRadius: 4,
          backgroundColor: '#FFFFFF',
          border: '2px solid #E2E3EB',
          boxShadow: '0 2px 6px rgba(0,0,0,0.10)',
          overflow: 'hidden',
          p: '4px',
        }}
      >
        <Box sx={{ width: '100%', height: 4, backgroundColor: '#2457D6', borderRadius: 1, mb: '3px' }} />
        <Box sx={{ width: '80%', height: 3, backgroundColor: '#C8C9D2', borderRadius: 1, mb: '3px' }} />
        <Box sx={{ width: '90%', height: 3, backgroundColor: '#C8C9D2', borderRadius: 1, mb: '3px' }} />
        <Box sx={{ width: '60%', height: 3, backgroundColor: '#C8C9D2', borderRadius: 1 }} />
      </Box>

      {/* Legs */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 'calc(50% - 22px)',
          width: 18,
          height: 44,
          borderRadius: '4px 4px 8px 8px',
          backgroundColor: '#3D3E47',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 'calc(50% + 4px)',
          width: 18,
          height: 44,
          borderRadius: '4px 4px 8px 8px',
          backgroundColor: '#3D3E47',
        }}
      />

      {/* Checkmark badge */}
      <motion.div
        style={{ position: 'absolute', top: 10, right: 16 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: '#147A45',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 8px rgba(20,122,69,0.35)',
          }}
        >
          <Typography sx={{ color: '#FFFFFF', fontSize: '1.125rem', fontWeight: 800, lineHeight: 1 }}>
            ✓
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}

export default function WelcomePage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleDemo = async () => {
    const ok = await login('FF-1042', 'demo123');
    if (ok) navigate('/field-flow/permissions');
  };

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#2457D6',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            FieldFlow
          </Typography>
          <Typography variant="h1" sx={{ fontSize: '1.875rem', fontWeight: 800, color: '#1A1B1F', mb: 1 }}>
            Field work,{' '}
            <Box component="span" sx={{ color: '#2457D6' }}>
              simplified.
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ color: '#5A5B64', lineHeight: 1.6 }}>
            The task management app built for technicians who work on-site, not behind a desk.
          </Typography>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Box sx={{ mt: 4, mb: 4 }}>
            <TechnicianIllustration />
          </Box>
        </motion.div>

        {/* Feature bullets */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22, ease: 'easeOut' }}
        >
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: 3,
              border: '1px solid #E2E3EB',
              overflow: 'hidden',
              mb: 4,
            }}
          >
            {features.map((f, i) => (
              <Box
                key={f.title}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  px: 2.5,
                  py: 2,
                  borderBottom: i < features.length - 1 ? '1px solid #E2E3EB' : 'none',
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    backgroundColor: '#EEF2FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  {f.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#1A1B1F', mb: 0.25 }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#5A5B64' }}>
                    {f.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.32, ease: 'easeOut' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate('/field-flow/login')}
              sx={{ borderRadius: '100px' }}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleDemo}
              sx={{ borderRadius: '100px', borderColor: '#2457D6', color: '#2457D6' }}
            >
              Explore Demo
            </Button>
          </Box>

          <Typography
            variant="caption"
            sx={{ display: 'block', textAlign: 'center', color: '#9E9EA6', mt: 2 }}
          >
            Demo uses pre-loaded sample data. No account needed.
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
}
