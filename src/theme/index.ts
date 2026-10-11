import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';
import { civic, civicShadow } from './tokens';

const baseTheme = createTheme({
  palette: {
    mode: 'light',
    civic,
    primary: { main: civic.blue, contrastText: '#FFFFFF' },
    secondary: { main: civic.dark },
    success: { main: civic.green, contrastText: '#FFFFFF' },
    warning: { main: civic.amber, contrastText: civic.dark },
    text: { primary: civic.dark, secondary: civic.muted },
    divider: civic.border,
    background: { default: civic.bg, paper: civic.surface },
    action: {
      hover: alpha(civic.blue, 0.04),
      selected: alpha(civic.blue, 0.08),
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Lexend", ui-sans-serif, system-ui, sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: `1px solid ${civic.border}`, boxShadow: civicShadow },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: { border: `1px solid ${civic.border}`, boxShadow: civicShadow },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: { backgroundColor: civic.surface, borderBottom: `1px solid ${civic.border}` },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: `1px solid ${civic.border}` },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // Stronger than civic.border so inputs stay visible on white
        notchedOutline: { borderColor: alpha(civic.muted, 0.45) },
        root: {
          [`&:hover:not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline`]: {
            borderColor: civic.muted,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true },
    },
  },
});

export const theme = responsiveFontSizes(baseTheme);
