import { createTheme } from '@mui/material/styles';

// ELEGANT MONOCHROME THEME
// Primary: Noir (#1a1a1a)
// Background: Mist (#f5f5f5)
// Accent: Royal Blue (#2563eb)

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a1a', // Noir
      light: '#333333',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2563eb', // Royal Blue
      light: '#60a5fa',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5', // Mist
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#6b7280', // Cool Gray
    },
    divider: '#e5e7eb',
    success: {
      main: '#2563eb', // Using Blue for success/enhanced to keep palette minimal
    },
  },
  typography: {
    fontFamily: '"Inter", "System-ui", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h5: { fontSize: '1rem', fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 8, // Sharp, precise feel
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          boxShadow: 'none',
          borderBottom: '1px solid #e5e7eb',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #e5e7eb',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: '#2563eb',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 600,
          fontSize: '0.75rem',
          '&.MuiChip-filledDefault': {
             backgroundColor: '#f3f4f6', // mist
             color: '#4b5563', // cool gray
          },
          '&.MuiChip-filledSuccess': {
             backgroundColor: '#eff6ff', 
             color: '#2563eb', // Royal Blue
          },
        },
      },
    },
  },
});

export default theme;
