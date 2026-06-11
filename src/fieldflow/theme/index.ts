import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    offline: Palette['primary'];
    warning2: Palette['primary'];
  }
  interface PaletteOptions {
    offline?: PaletteOptions['primary'];
    warning2?: PaletteOptions['primary'];
  }
}

const fontFamily = [
  'Roboto',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Arial',
  'sans-serif',
].join(',');

export const fieldflowTheme = createTheme({
  palette: {
    primary: {
      main: '#2457D6',
      light: '#5C7FE0',
      dark: '#1A3FA8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#006A60',
      light: '#00897B',
      dark: '#004D44',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#BA1A1A',
      light: '#D44E4E',
      dark: '#8B0000',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#A06400',
      light: '#C8820A',
      dark: '#7A4A00',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#147A45',
      light: '#1E9B58',
      dark: '#0D5A30',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#00639B',
      light: '#0082CB',
      dark: '#004870',
      contrastText: '#FFFFFF',
    },
    offline: {
      main: '#6B4E16',
      light: '#8B6A2A',
      dark: '#4A360E',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F7F8FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1B1F',
      secondary: '#5A5B64',
      disabled: '#9E9EA6',
    },
    divider: '#E2E3EB',
    grey: {
      50: '#F7F8FC',
      100: '#EEEEF6',
      200: '#E2E3EB',
      300: '#C8C9D2',
      400: '#9E9EA6',
      500: '#74747D',
      600: '#5A5B64',
      700: '#3D3E47',
      800: '#2A2B34',
      900: '#1A1B1F',
    },
  },
  typography: {
    fontFamily,
    h1: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 },
    subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.4, letterSpacing: '0.01em' },
    overline: { fontSize: '0.6875rem', fontWeight: 600, lineHeight: 1.5, letterSpacing: '0.08em', textTransform: 'uppercase' },
    button: { fontSize: '0.9375rem', fontWeight: 600, letterSpacing: '0.01em', textTransform: 'none' },
  },
  spacing: 8,
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        html: { WebkitTextSizeAdjust: '100%' },
        body: {
          overscrollBehavior: 'none',
          WebkitTapHighlightColor: 'transparent',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          minHeight: 48,
          paddingLeft: 24,
          paddingRight: 24,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9375rem',
        },
        sizeLarge: { minHeight: 56, fontSize: '1rem' },
        sizeSmall: { minHeight: 36, paddingLeft: 16, paddingRight: 16, fontSize: '0.875rem' },
        contained: {
          boxShadow: '0 1px 2px rgba(0,0,0,0.10)',
          '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.15)' },
        },
      },
      defaultProps: { disableElevation: true },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: 10, minWidth: 44, minHeight: 44 },
        sizeLarge: { padding: 12 },
        sizeSmall: { padding: 6 },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: { boxShadow: '0 4px 12px rgba(36, 87, 214, 0.3)' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #E2E3EB',
          boxShadow: 'none',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: 16, '&:last-child': { paddingBottom: 16 } },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600, fontSize: '0.75rem' },
        sizeSmall: { height: 24, fontSize: '0.6875rem' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            minHeight: 52,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12 },
        input: { padding: '14px 16px' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 64,
          borderTop: '1px solid #E2E3EB',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 48,
          padding: '6px 0',
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.6875rem',
            fontWeight: 600,
            marginTop: 2,
          },
          '&.Mui-selected': { color: '#2457D6' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #E2E3EB',
        },
      },
      defaultProps: { color: 'inherit', elevation: 0 },
    },
    MuiToolbar: {
      styleOverrides: {
        root: { minHeight: '56px !important', padding: '0 16px' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20, margin: 16, width: 'calc(100% - 32px)', maxWidth: 480 },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { padding: '20px 20px 8px', fontWeight: 700, fontSize: '1.125rem' } },
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: '8px 20px' } },
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: '12px 20px 20px', gap: 8 } },
    },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      },
      styleOverrides: {
        root: { bottom: '80px !important' },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: { borderRadius: 12, fontSize: '0.875rem', fontWeight: 500 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 4 } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: '#E2E3EB' } },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          minHeight: 52,
          '&.Mui-selected': { backgroundColor: '#DCE4FF' },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { borderRadius: 8, minHeight: 44 },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { width: 52, height: 32, padding: 0 },
        switchBase: {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            '& + .MuiSwitch-track': { backgroundColor: '#2457D6', opacity: 1 },
          },
        },
        thumb: { width: 28, height: 28 },
        track: { borderRadius: 16, opacity: 1, backgroundColor: '#C8C9D2' },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: { fontSize: '0.625rem', fontWeight: 700, minWidth: 18, height: 18 },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 44 },
        indicator: { height: 3, borderRadius: '3px 3px 0 0' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '6px 16px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: { minHeight: 'auto', padding: '14px 16px' },
      },
    },
  },
});

export const fieldflowDarkTheme = createTheme({
  ...fieldflowTheme,
  palette: {
    mode: 'dark',
    primary: { main: '#90AAF0', light: '#BFD0FF', dark: '#6080D0', contrastText: '#001F6A' },
    secondary: { main: '#4CD4C5', light: '#7EEEE3', dark: '#009688', contrastText: '#001F1C' },
    background: { default: '#1A1B1F', paper: '#24252E' },
    text: { primary: '#E4E5F0', secondary: '#A9AAB5' },
    divider: '#3A3B44',
  },
});
