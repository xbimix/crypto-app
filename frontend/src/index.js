import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import App from './App';

// Create light/dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff88', // Crypto green accent
    },
    background: {
      default: '#0a1929', // Dark blue background
      paper: '#001e3c',
    }
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  }
});

const getTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: '#00ff88',
    },
  },
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);