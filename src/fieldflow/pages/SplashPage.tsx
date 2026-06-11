import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

function LoadingDots() {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', mt: 6 }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.6)',
          }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
    </Box>
  );
}

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/field-flow/welcome', { replace: true });
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        backgroundColor: '#2457D6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 480,
          mx: 'auto',
          px: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: '22px',
              backgroundColor: 'rgba(255,255,255,0.18)',
              border: '2px solid rgba(255,255,255,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Inner icon: stylised "F" made from boxes */}
            <Box sx={{ position: 'relative', width: 40, height: 44 }}>
              {/* Vertical bar */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 10,
                  height: 44,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '3px',
                }}
              />
              {/* Top horizontal bar */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 30,
                  height: 10,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '3px',
                }}
              />
              {/* Middle horizontal bar */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 17,
                  width: 24,
                  height: 10,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  borderRadius: '3px',
                }}
              />
            </Box>
          </Box>
        </motion.div>

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
          style={{ textAlign: 'center' }}
        >
          <Typography
            sx={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            FieldFlow
          </Typography>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.34, ease: 'easeOut' }}
          style={{ textAlign: 'center' }}
        >
          <Typography
            sx={{
              mt: 1.5,
              fontSize: '1rem',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.01em',
            }}
          >
            Work clearly. Prove completion.
          </Typography>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <LoadingDots />
        </motion.div>
      </Box>
    </Box>
  );
}
