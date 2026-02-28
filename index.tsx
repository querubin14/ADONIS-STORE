import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          aria-label="Notificaciones"
          toastStyle={{
            background: '#1f1f1f',
            color: '#fff',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontFamily: 'Jost, sans-serif',
          }}
        />
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
