import { createTheme } from '@mui/material/styles';

// Create a dark theme with green and dark-gray colors
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4caf50', // Green
    },
    secondary: {
      main: '#a5d6a7', // Light green
    },
    background: {
      default: '#121212', // Dark gray
      paper: '#1e1e1e',   // Slightly lighter dark gray
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  // Make components more responsive
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333',
        },
      },
    },
  },
});

export default darkTheme; 