import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Load SAP UI5 Web Components assets (themes, translations)
import '@ui5/webcomponents-react/dist/Assets.js';

// Clean up any active service worker during local development to prevent caching issues
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('Local dev Service Worker cleared successfully.');
          window.location.reload();
        }
      });
    }
  });
}

// Only register the offline Service Worker in production
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Production Service Worker registered', reg))
      .catch(err => console.error('Service Worker registration failed', err));
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
