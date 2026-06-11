import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppBottomNav from './AppBottomNav';
import OfflineBanner from './OfflineBanner';

export default function AppShell() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      <OfflineBanner />
      <Box
        component="main"
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          pb: '80px', // space for bottom nav
          position: 'relative',
        }}
      >
        <Outlet />
      </Box>
      <AppBottomNav />
    </Box>
  );
}
