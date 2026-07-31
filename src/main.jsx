import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { arcReactorTheme } from './theme/arcReactorTheme';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={arcReactorTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);