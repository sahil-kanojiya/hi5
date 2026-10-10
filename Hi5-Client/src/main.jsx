// import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import './index.css';
import Preloader from './components/preloader/Preloader.jsx';
import { Suspense } from 'react';
import StoreProvider from './components/providers/StoreProvider.jsx';
import ThemeProvider from './components/providers/ThemeProvider.jsx';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './components/providers/AuthProvider.jsx';
import { ToastProvider } from './components/providers/ToastProvider.jsx';
import WebSocketProvider from './socket/WebSocketProvider.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Suspense fallback={<Preloader />}>
    <StoreProvider>
      <AuthProvider>
        <WebSocketProvider>
          <ThemeProvider>
            <Router>
              <ToastProvider>
                <App />
              </ToastProvider>
            </Router>
          </ThemeProvider>
        </WebSocketProvider>
      </AuthProvider>
    </StoreProvider>
  </Suspense>
  // </StrictMode>
);
