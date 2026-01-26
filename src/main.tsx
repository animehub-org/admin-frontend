import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { setupAxiosInterceptors } from './services/AxiosConfig.ts';

// Configura interceptors do Axios (Token Injection + Auto Refresh)
setupAxiosInterceptors();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
