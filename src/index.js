import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n'; // Initialize i18n before the app renders
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Web3Provider } from './context/Web3Context';
import { SimpleWalletProvider } from './context/SimpleWalletContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <Web3Provider>
            <SimpleWalletProvider>
              <App />
            </SimpleWalletProvider>
          </Web3Provider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

// Register the PWA service worker in production only (avoids dev caching issues).
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}