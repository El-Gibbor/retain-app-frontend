import { CssBaseline, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import ServerWakeNotice from './components/common/ServerWakeNotice';
import { AuthProvider } from './context/AuthProvider';
import { NotificationProvider } from './context/NotificationProvider';
import { store } from './store';
import { theme } from './theme';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing #root element in index.html');

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <BrowserRouter>
          <AuthProvider>
            <NotificationProvider>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
              <ServerWakeNotice />
            </NotificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
