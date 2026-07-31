import { createTheme } from '@mui/material/styles';

export const arcReactorTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0090FF',
      light: '#33B0FF',
      dark: '#0058B8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00C8E8',
      light: '#66E0FF',
      dark: '#0088A0',
      contrastText: '#060B16',
    },
    background: {
      default: '#080B12',
      paper: '#000000',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      disabled: '#64748B',
    },
    divider: 'rgba(255, 255, 255, 0.15)',
    action: {
      hover: 'rgba(255,255,255,0.05)',
      selected: 'rgba(255,255,255,0.1)',
    },
  },
  typography: {
    fontFamily: '"Inter", "IBM Plex Mono", -apple-system, sans-serif',
    h1: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
    },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    body1: { color: '#CBD5E1' },
    body2: { color: '#94A3B8' },
    caption: { fontFamily: '"IBM Plex Mono", monospace' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#080B12',
          backgroundImage:
            'radial-gradient(ellipse at 50% 0%, rgba(30, 58, 138, 0.15) 0%, transparent 70%), radial-gradient(ellipse at 80% 50%, rgba(30, 58, 138, 0.05) 0%, transparent 50%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 999,
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 9,
          padding: '10px 18px',
        },
      },
    },
  },
});