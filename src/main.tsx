import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyle from '@/style/GlobalStyle.tsx';
import { theme } from '@/style/theme.tsx';
import App from '@/App.tsx';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { MaintenanceProvider } from '@/contexts/MaintenanceContext';
import '@/firebase';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      if (
        error.response?.status === 503 &&
        !window.location.pathname.startsWith('/admin')
      ) {
        window.dispatchEvent(new Event('maintenance-mode'));
      }
    },
  }),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MaintenanceProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </MaintenanceProvider>
    </QueryClientProvider>
  </StrictMode>,
);
