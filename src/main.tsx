import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ContextProvider/ThemeProvider.tsx'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);

// Register service worker for PWA
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  },
  onUpdate: () => {
    console.log('New content is available; please refresh.');
    // You could add a custom UI here to prompt the user to update
    if (window.confirm('A new version is available! Would you like to update now?')) {
      window.location.reload();
    }
  },
});
