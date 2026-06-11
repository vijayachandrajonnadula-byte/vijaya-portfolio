import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { fieldflowTheme, fieldflowDarkTheme } from './theme';
import { useThemeStore } from './stores';
import { useAuthStore } from './stores';

// Layout
import AppShell from './components/layout/AppShell';

// Auth / Onboarding
import SplashPage from './pages/SplashPage';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import PermissionsPage from './pages/PermissionsPage';

// App pages
import HomePage from './pages/app/HomePage';
import TasksPage from './pages/app/TasksPage';
import TaskDetailPage from './pages/app/TaskDetailPage';
import CheckInPage from './pages/app/CheckInPage';
import ChecklistPage from './pages/app/ChecklistPage';
import EvidencePage from './pages/app/EvidencePage';
import MaterialsPage from './pages/app/MaterialsPage';
import NotesPage from './pages/app/NotesPage';
import PausePage from './pages/app/PausePage';
import SignaturePage from './pages/app/SignaturePage';
import ReviewPage from './pages/app/ReviewPage';
import CompletePage from './pages/app/CompletePage';
import ScanPage from './pages/app/ScanPage';
import ActivityPage from './pages/app/ActivityPage';
import ProfilePage from './pages/app/ProfilePage';
import SettingsPage from './pages/app/SettingsPage';
import NotificationsPage from './pages/app/NotificationsPage';
import SyncCentrePage from './pages/app/SyncCentrePage';
import SupervisorPanelPage from './pages/app/SupervisorPanelPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/field-flow/login" replace />;
  return <>{children}</>;
}

export default function FieldFlowApp() {
  const mode = useThemeStore((s) => s.mode);
  const theme = mode === 'dark' ? fieldflowDarkTheme : fieldflowTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Onboarding */}
        <Route index element={<SplashPage />} />
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="permissions" element={<PermissionsPage />} />

        {/* Protected app routes */}
        <Route
          path="app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/:id" element={<TaskDetailPage />} />
          <Route path="tasks/:id/check-in" element={<CheckInPage />} />
          <Route path="tasks/:id/checklist" element={<ChecklistPage />} />
          <Route path="tasks/:id/evidence" element={<EvidencePage />} />
          <Route path="tasks/:id/materials" element={<MaterialsPage />} />
          <Route path="tasks/:id/notes" element={<NotesPage />} />
          <Route path="tasks/:id/pause" element={<PausePage />} />
          <Route path="tasks/:id/signature" element={<SignaturePage />} />
          <Route path="tasks/:id/review" element={<ReviewPage />} />
          <Route path="tasks/:id/complete" element={<CompletePage />} />
          <Route path="scan" element={<ScanPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="sync-centre" element={<SyncCentrePage />} />
          <Route path="supervisor" element={<SupervisorPanelPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/field-flow" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
