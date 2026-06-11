import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Chip,
  Snackbar,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAuthStore } from '../stores';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, rememberDevice, setRememberDevice } = useAuthStore();

  const [employeeId, setEmployeeId] = useState('FF-1042');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSignIn = async () => {
    clearError();
    const ok = await login(employeeId.trim(), password);
    if (ok) navigate('/field-flow/permissions', { replace: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSignIn();
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
          pt: 2,
          pb: 4,
        }}
      >
        {/* Back button */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
          <IconButton
            onClick={() => navigate('/field-flow/welcome')}
            aria-label="Back to welcome"
            sx={{ ml: -1 }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#1A1B1F', mb: 0.75 }}>
            Welcome back
          </Typography>
          <Typography variant="body1" sx={{ color: '#5A5B64', mb: 4 }}>
            Sign in with your employee ID or work email.
          </Typography>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}
        >
          {/* Error alert */}
          {error && (
            <Alert
              severity="error"
              onClose={clearError}
              sx={{ borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}

          {/* Employee ID field */}
          <TextField
            label="Employee ID or email"
            value={employeeId}
            onChange={(e) => { clearError(); setEmployeeId(e.target.value); }}
            onKeyDown={handleKeyDown}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="username"
            slotProps={{ htmlInput: { 'aria-label': 'Employee ID or email' } }}
          />

          {/* Password field */}
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { clearError(); setPassword(e.target.value); }}
            onKeyDown={handleKeyDown}
            autoComplete="current-password"
            slotProps={{
              htmlInput: { 'aria-label': 'Password' },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      edge="end"
                      size="small"
                      sx={{ mr: 0.5 }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Remember device + Forgot password row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  size="small"
                  sx={{ color: '#9E9EA6', '&.Mui-checked': { color: '#2457D6' } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#5A5B64' }}>
                  Remember this device
                </Typography>
              }
            />
            <Button
              variant="text"
              size="small"
              onClick={() => setSnackbarOpen(true)}
              sx={{
                color: '#2457D6',
                fontWeight: 600,
                fontSize: '0.875rem',
                minHeight: 'auto',
                p: 0,
                '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
              }}
            >
              Forgot password?
            </Button>
          </Box>

          {/* Sign in button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSignIn}
            disabled={isLoading || !employeeId.trim() || !password}
            sx={{ borderRadius: '100px', mt: 1 }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.8)' }} />
                <span>Signing in...</span>
              </Box>
            ) : (
              'Sign In'
            )}
          </Button>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Demo credentials hint */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
              mt: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: '#EEF2FF',
                border: '1px solid #C7D3F8',
                borderRadius: 2.5,
                px: 2,
                py: 1.5,
                display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start',
                width: '100%',
              }}
            >
              <InfoOutlinedIcon sx={{ fontSize: 18, color: '#2457D6', mt: 0.125, flexShrink: 0 }} />
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#2457D6', display: 'block' }}>
                  Portfolio demo credentials
                </Typography>
                <Typography variant="caption" sx={{ color: '#5A5B64' }}>
                  ID: FF-1042 &nbsp;|&nbsp; Password: demo123
                </Typography>
              </Box>
            </Box>

            <Chip
              label="v1.0.0 (Portfolio Demo)"
              size="small"
              sx={{
                backgroundColor: 'transparent',
                color: '#9E9EA6',
                border: '1px solid #E2E3EB',
                fontSize: '0.6875rem',
              }}
            />
          </Box>
        </motion.div>
      </Box>

      {/* Forgot password snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Contact your field operations supervisor to reset your password."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
