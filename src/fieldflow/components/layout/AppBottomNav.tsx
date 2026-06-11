import { BottomNavigation, BottomNavigationAction, Box, Badge, Paper } from '@mui/material';
import {
  HomeOutlined,
  Home,
  AssignmentOutlined,
  Assignment,
  QrCodeScanner,
  HistoryOutlined,
  History,
  PersonOutlined,
  Person,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../stores';

const routes = [
  { path: '/field-flow/app/home',       label: 'Home',     icon: <HomeOutlined />,       activeIcon: <Home /> },
  { path: '/field-flow/app/tasks',      label: 'Tasks',    icon: <AssignmentOutlined />, activeIcon: <Assignment /> },
  { path: '/field-flow/app/scan',       label: 'Scan',     icon: <QrCodeScanner />,      activeIcon: <QrCodeScanner /> },
  { path: '/field-flow/app/activity',   label: 'Activity', icon: <HistoryOutlined />,    activeIcon: <History /> },
  { path: '/field-flow/app/profile',    label: 'Profile',  icon: <PersonOutlined />,     activeIcon: <Person /> },
];

export default function AppBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const unreadCount = useNotificationStore((s) => s.unreadCount());

  const currentIndex = routes.findIndex((r) => location.pathname.startsWith(r.path));
  const value = currentIndex >= 0 ? currentIndex : 0;

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        pb: 'env(safe-area-inset-bottom, 0px)',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(_, v) => navigate(routes[v].path)}
        sx={{ height: 64 }}
        showLabels
      >
        {routes.map((r, i) => (
          <BottomNavigationAction
            key={r.path}
            label={r.label}
            icon={
              i === 2 ? (
                // Scan FAB-style
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: value === 2 ? 'primary.main' : '#E7E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: -2,
                    boxShadow: value === 2 ? '0 4px 12px rgba(36,87,214,0.4)' : '0 2px 6px rgba(0,0,0,0.12)',
                    transition: 'all 0.2s',
                  }}
                >
                  <QrCodeScanner sx={{ color: value === 2 ? '#fff' : '#5A5B64', fontSize: 24 }} />
                </Box>
              ) : i === 3 ? (
                <Badge badgeContent={unreadCount} color="error" max={9}>
                  {value === i ? r.activeIcon : r.icon}
                </Badge>
              ) : (
                value === i ? r.activeIcon : r.icon
              )
            }
            aria-label={r.label}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
