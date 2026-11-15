import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// Import the theme directly, not through ./index: that barrel re-exports every component, so a single broken
// file anywhere would blank the whole gallery and every page load would fetch the entire library.
import { theme } from './theme/theme';import App from './App';

// React.StrictMode is intentionally not used: with React 19.3.1, @mui/x-tree-view's dev-only
// StrictMode detection (useDisposable) throws and blanks the page. Re-enable once MUI X fixes it.
createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
);
